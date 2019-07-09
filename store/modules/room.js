import server from '../server.js';
import router from '../../src/router.js';

const roomStates = {
  IDLE: 'idle',
  PLAYING: 'playing',
  VOTE: 'vote',
  FINISHED: 'finished',
}

const state = {
  rooms: [],
  room: {
    players: [],
    id: '',
    max: 6
  },
  players: [],
  whiteCards: [],
  blackCards: []
}

const getters = {
  getRooms: state => {
    return state.rooms
  },
  getRoom: state => {
    return state.room
  },
  getRoomState: state => {
    return state.room.gameState
  },
  getPlayers: state => {
    return state.room.players
  },
  getVoted: state => {
    return state.players.voted
  },
  isRoomFull: state => (id) => {
    for (let item in state.room) {
      if (item.id === id) {
        return state.room.max < state.room.players.length
      }
    }
  },
  getBlackCard: state => {
    return state.room.currentBlackCard
  }
}

const mutations = {
  'GET_ROOMS' (state, rooms) {
    state.rooms = rooms
  },
  'RETURN_PLAYERS' (state, players) {
    state.players = players
    return players
  },
  'SET_ROOM' (state, room) {
    state.room = room;
  },
  'SET_WHITECARDS' (state, whiteCards) {
    state.whiteCards = whiteCards;
  },
  'SET_BLACKCARDS' (state, blackCards) {
    state.blackCards = blackCards
  },
  'UPDATE_GAMESTATE' (state, gameState) {
    state.room.gameState = gameState
  }
}

const actions = {
  loadRooms ({ commit }) {
    commit('GET_ROOMS')
  },
  async createRoom ({ rootState, commit, dispatch }, roomData) {
    const ref = server.ref('rooms/').push()
    const key = ref.key
    const newRoom = {
      id: key,
      name: roomData.name,
      max: roomData.max,
      gameState : roomStates.IDLE,
    }
    ref.set(newRoom)
    await dispatch('userJoinRoom', newRoom);
    server.ref(`/rooms/${newRoom.id}`).update({host : rootState.player.user.id})
    await dispatch('fetchRoom', newRoom.id)
    router.push(`/room/${newRoom.id}`)

  },
  getRooms ({ commit }) {
    server.ref('rooms/').on('value', (snapshot) => {
      commit('GET_ROOMS', snapshot.val())
    })
  },
  fetchRoom({ rootState, dispatch, state, commit }, roomId) {
    server.ref(`/rooms/${roomId}`).on('value', (snapshot) => {
      const room = snapshot.val();
      if ((room.gameState === roomStates.PLAYING || room.gameState == roomStates.VOTE) && !router.currentRoute.path.includes('game')) {
        router.push(`/game/${room.id}`);
      }
      const players = Object.keys(room.players).map((key, index) => room.players[key]);

      if (room.gameState === roomStates.PLAYING && room.host === rootState.player.user.id) {
        const submittedPlayers = players.filter((player) => player.submitted);
        if (Object.keys(room.players).length === submittedPlayers.length) {
          dispatch('updateRoomState', roomStates.VOTE);
        }
      }
      if(room.gameState === roomStates.VOTE) {
        const votedPlayers = players.filter((player) => player.voted);
        if (Object.keys(room.players).length === votedPlayers.length) {
          dispatch('startNewRound')
        }
      }

      commit('SET_ROOM', {...room, players});
    })
  },
  getPlayersInRoom ({ commit }, roomId) {
    server.ref('rooms/' + roomId +'/players').on('value', (snapshot) => {
      commit('RETURN_PLAYERS', snapshot.val())
    })
  },
  async startGame({ state, dispatch, commit }) {
    console.log('start game: ', state.whiteCards)
    await dispatch('drawWhiteCards');
    await dispatch('drawBlackCard');
    await dispatch('updateRoomState', roomStates.PLAYING);
  },
  async updateRoomState({ state, commit }, gameState) {
    await server.ref('/rooms/' + state.room.id).update({gameState})
    commit('UPDATE_GAMESTATE', gameState)
    return Promise.resolve();
  },
  async fetchBlackCards ({ commit }) {
    await server.ref('/blackCards/').once('value', (snapshot) => {
      commit('SET_BLACKCARDS', snapshot.val())
      return Promise.resolve();
    });
  },
  drawBlackCard ({ state, commit }) {
    const availableBlackCards = !state.room.availableBlackCards
      ? state.blackCards.map((card, index) => index)
      : state.room.availableBlackCards;

    const random = Math.floor(Math.random() * availableBlackCards.length);
    console.log('random: ', random, ' - getting card: ' ,  availableBlackCards[random])
    const currentBlackCard = state.blackCards[availableBlackCards[random]].text;
    availableBlackCards.splice(random, 1)

    server.ref(`/rooms/${state.room.id}`).update({ currentBlackCard, availableBlackCards });
  },
  async fetchWhiteCards ({ commit }) {
    const whiteCards = [];
    return server.ref('/whiteCards/').once('value').then((snapshot) => {
      commit('SET_WHITECARDS', snapshot.val())
    });
  },
  async drawWhiteCards({ state, commit }) {
    const availableWhiteCards = !state.room.availableWhiteCards
      ? state.whiteCards.map((card, index) => index)
      : state.room.availableWhiteCards;

    for(let p in state.room.players) {
      const player = state.room.players[p];
      const playerWhiteCards = [];
      
      for(let i = 0; i < 6; i++) {
        const random = Math.floor(Math.random() * availableWhiteCards.length);
        playerWhiteCards.push({id: random, text: state.whiteCards[availableWhiteCards[random]]});
        availableWhiteCards.splice(random, 1);
      }
      await server.ref(`/users/${player.id}`).update({ whiteCards: playerWhiteCards });
    }
    await server.ref(`/rooms/${state.room.id}`).update({ availableWhiteCards });
    return Promise.resolve();
  },
  async drawNewRoundCards ({ rootState, state }) {
    // white card
    const currentWhiteCards = rootState.player.user.whiteCards
    const updatedWhiteCards = currentWhiteCards

    const availableWhiteCards =  state.room.availableWhiteCards
    const random = Math.floor(Math.random() * availableWhiteCards.length);

    updatedWhiteCards.push({id: random, text: state.whiteCards[availableWhiteCards[random]]})
    availableWhiteCards.splice(random, 1);

    await server.ref(`/users/${rootState.player.user.id}`).update({ whiteCards: updatedWhiteCards});
    await server.ref(`/rooms/${state.room.id}`).update({ availableWhiteCards });

    // black card
    const availableBlackCards = state.room.availableBlackCards
    const blackCardRandom = Math.floor(Math.random() * availableBlackCards.length);
    const currentBlackCard = state.blackCards[availableBlackCards[blackCardRandom]].text

    availableBlackCards.splice(random, 1);
    await server.ref(`/rooms/${state.room.id}`).update({ currentBlackCard, availableBlackCards });


  },
  submitCardToRoom({ rootState, state }, card) {
    server.ref(`/rooms/${state.room.id}/players/${rootState.player.user.id}`).update({submitted: true, card: card.text})
  },
  async votePlayer ({ rootState, state }, payload) {
    const votedPlayer = payload.id
    let currentPlayerScore = 0
    state.room.players.filter((player) => {
      if(player.id == votedPlayer) {
        if('score' in player ) {
          currentPlayerScore = player.score
        }
      }
    });
    const newPlayerScore = currentPlayerScore += 1
    server.ref(`/rooms/${state.room.id}/players/${votedPlayer}`).update({score : newPlayerScore})
    server.ref(`/rooms/${state.room.id}/players/${rootState.player.user.id}`).update({voted: true})
  },
  resetRound ({ rootState, state, dispatch }) {
    state.room.players.filter((player) => {
      server.ref(`/rooms/${state.room.id}/players/${player.id}`).update({voted: false, submitted: false});
      server.ref(`/rooms/${state.room.id}/players/${player.id}/card`).remove();
    })
    console.log('rootstate user: ' + rootState.player.user)
    state.room.players.filter((user) => {
      server.ref(`/users/${user.id}`).update({submitted: false})
    });
    server.ref(`/rooms/${state.room.id}/currentBlackCard`).remove();
  },
  async startNewRound ({ dispatch }){
    await dispatch('resetRound')
    await dispatch('updateRoomState', roomStates.PLAYING);
    await dispatch('drawNewRoundCards')
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
