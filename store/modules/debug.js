import server from '../server.js'
import router from '../../src/router.js'

const state = {}

const getters = {}

const mutations = {}

const actions = {
  clearDatabase () {
    server.ref('/users').remove();
    server.ref('/rooms').remove();

    localStorage.removeItem('userId');
    router.push('/')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
