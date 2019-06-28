import server from '../server.js'

const state = {
  rooms: [],
  room: {
    players: [],
    id: '',
    max: 6
  }
}

const getters = {
  getRooms: state => {
    return state.rooms
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
    server.ref('/users/' + room.player + '/roomId/').push(({roomId : newRoom.id}))
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
      console.log(snapshot.val())
      commit('GET_ROOMS', snapshot.val())
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
