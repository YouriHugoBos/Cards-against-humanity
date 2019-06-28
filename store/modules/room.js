import server from '../server.js'

const state = {
  rooms: [],
  room: {
    players: [],
    id: '',
    max: 6
  },
  players: []
}

const getters = {
  getRooms: state => {
    return state.rooms
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
  'CREATE_ROOM' (state, room) {
    const ref = server.ref('rooms/').push()
    const key = ref.key
    const newRoom = {
      id: key,
      name: room.name,
      players: [],
      max: room.max
    }
    ref.set(newRoom)
    server.ref('/rooms/' + newRoom.id + '/players/').push(room.player)
    server.ref('/users/' + room.player).push(newRoom.id)
  }
}
const actions = {
  loadRooms ({ commit }) {
    commit('GET_ROOMS')
  },
  createRoom ({ commit }, payload) {
    console.log(payload)
    commit('CREATE_ROOM', payload)
  },
  getRooms ({ commit }) {
    server.ref('rooms/').on('value', (snapshot) => {
      commit('GET_ROOMS', snapshot.val())
    })
  },
  getPlayersInRoom ({ commit }, roomId) {
    server.ref('rooms/' + roomId +'/players').on('value', (snapshot) => {
      console.log(snapshot.val())
      commit('RETURN_PLAYERS', snapshot.val())
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
