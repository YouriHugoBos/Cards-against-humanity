import server from '../server.js'

const state = {
  username: ''
}

const getters = {
  getUsername: state => {
    return state.username || localStorage.getItem('username')
  }
}

const mutations = {
  'UPDATE_USERNAME' (state, username) {
    console.log('updating username state : ' + username)
    state.username = username
  }
}

const actions = {
  getUsername ({ commit }) {
    console.log(server)
    commit('UPDATE_USERNAME', localStorage.getItem('username'))
  },
  insertUsername ({ commit }, username) {
    console.log('inserting user to local storage : ' + username)
    commit('UPDATE_USERNAME', username)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
