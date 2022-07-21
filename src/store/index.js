import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, setToken } from '@/utils'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 获取token
    user: getToken() || {},
    // 存储被回复评论的单条数据
    commentItem: {}
  },
  getters: {
  },
  mutations: {
    // 修改token
    setUser(state, val) {
      state.user = val
      setToken(val)
    },
    // 被回复评论的单条数据
    setCommentItem(state, commentItem) {
      state.commentItem = commentItem
    }
  },
  actions: {
  },
  modules: {
  }
})
