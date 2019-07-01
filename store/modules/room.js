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
  getPlayers: state => {
    return state.players
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
    console.log('set host : ' , rootState.player.user.id)
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
      if (room.gameState === roomStates.PLAYING && !router.currentRoute.path.includes('game')) {
        router.push(`/game/${room.id}`);
      }
      const players = Object.keys(room.players).map((key, index) => room.players[key]);

      if (room.gameState === roomStates.PLAYING && room.host === rootState.player.user.id) {
        const submittedPlayers = players.filter((player) => player.submitted);
        if (Object.keys(room.players).length === submittedPlayers.length) {
          dispatch('updateRoomState', roomStates.VOTE);
          // present white cards text
          // vote round
          // give points
          // host can start new round
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
    await dispatch('fetchWhiteCards');
    await dispatch('fetchBlackCards');
    await dispatch('drawWhiteCards');
    await dispatch('drawBlackCard');
    await dispatch('updateRoomState', roomStates.PLAYING);
  },
  async updateRoomState({ state, commit }, gameState) {
    await server.ref('/rooms/' + state.room.id).update({gameState})
    return Promise.resolve();
  },
  fetchBlackCards ({ commit }) {
    server.ref('/blackCards/').once('value', (snapshot) => {
      commit('SET_BLACKCARDS', snapshot.val())
      return Promise.resolve();
    });
  },
  drawBlackCard ({ state, commit }) {
    const availableBlackCards = !state.room.availableBlackCards
      ? state.blackCards.map((card, index) => index)
      : state.room.availableBlackCards;

    const random = Math.floor(Math.random() * availableBlackCards.length);
    const currentBlackCard = state.blackCards[availableBlackCards[random]].text;
    availableBlackCards.splice(random, 1)

    server.ref(`/rooms/${state.room.id}`).update({ currentBlackCard, availableBlackCards });
  },
  fetchWhiteCards ({ commit }) {
    server.ref('/whiteCards/').once('value', (snapshot) => {
      commit('SET_WHITECARDS', snapshot.val())
      return Promise.resolve();
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
  submitCardToRoom({ rootState, state, commit }, card) {
    server.ref(`/rooms/${state.room.id}/players/${rootState.player.user.id}`).update({submitted: true, card: card.text})
  },
}
export default {
  state,
  getters,
  mutations,
  actions
}
