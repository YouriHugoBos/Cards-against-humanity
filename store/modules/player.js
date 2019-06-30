import server from '../server.js'
import router from '../../src/router.js'

const state = {
  user : {
    username: '',
    id: '',
    roomId: '',
  }
}

const getters = {
  getUsername: state => {
    return state.user.username
  },
  getUserRoom: state => {
    return state.user.roomId || localStorage.getItem('roomId')
  },
  getPlayerWhiteCards : state => {
    return state.user.whiteCards
  }
}

const mutations = {
  'INIT_USER' (state, user) {
    state.user = user
  },
}

const actions = {
  createUser ({ commit }, username) {
    const ref = server.ref('users/').push()
    const key = ref.key
    const user = {
      id: key,
      username
    }
    localStorage.setItem('userId', user.id)
    state.user = user
    ref.set({username: user.username, id: user.id})

    commit('INIT_USER', user)
  },
  fetchUser ({ state, commit }) {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      console.error('User does not exist')
      router.push('/');
      return;
    }
    server.ref(`/users/${userId}`).once('value', (snapshot) => {
      const user = snapshot.val()
      console.log(user.roomId);
      commit('INIT_USER', user)
      if( user != null ) {
        user.roomId ? router.push(`/room/${user.roomId}`) : router.push('/lobby')
        return;
      }
    })
  },
  userJoinRoom ({ state, commit }, room) {
    server.ref('rooms/' + room.id + '/players').push(state.user)
    server.ref('/users/' + state.user.id).update({roomId : room.id})
    router.push(`/room/${room.id}`)

    commit('INIT_USER', {...state.user, roomId: room.id})

    return Promise.resolve();
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
