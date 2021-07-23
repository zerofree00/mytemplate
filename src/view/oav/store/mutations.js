import * as types from './mutation-types'

const mutations = {
  [types.SET_USERINFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.SET_KEEPALIVE] (state, keepAlive) {
    state.keepAlive = keepAlive
  },
}

export default mutations