import server from '../server.js'

const state = {
  username: '',
  roomId: ''
}

const getters = {
  getUsername: state => {
    return state.username || localStorage.getItem('username')
  }
}

const mutations = {
  'UPDATE_USERNAME' (state, username) {
    console.log('updating username state : ' + username)
    localStorage.setItem('username', username);
    state.username = username
    server.ref('users/').set({name: username, roomId: null})
  },
  'JOIN_ROOM' (state, payload) {
    console.log(payload.username + "is joining room : " + payload.roomId)
    server.ref('rooms/' + payload.roomId + '/players').push([payload.username])
    server.ref('/users/' + payload.username + '/roomId/').set(({roomId :payload.roomId}))
  }
}

const actions = {
  getUsername ({ commit }) {
    commit('UPDATE_USERNAME', localStorage.getItem('username'))
  },
  insertUsername ({ commit }, username) {
    console.log('inserting user to local storage and database : ' + username)
    commit('UPDATE_USERNAME', username)
  },
  userJoinRoom({commit}, payload) {
    console.log('inserting user to room : ' + payload)
    commit('JOIN_ROOM', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
