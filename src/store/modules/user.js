import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    menus: '',
    roles: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      phone,
      password
    } = userInfo // 解构出用户名和密码
    return new Promise((resolve, reject) => {
      // 执行登录请求
      login({
        phone: phone.trim(),
        password: password
      }).then(response => {
        const {
          data
        } = response
        commit('SET_TOKEN', data.info.token)
        setToken(data.info.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info 获取到用户信息
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response

        if (!data) {
          reject('验证失败，请重新登录')
        }
        // 模拟请求数据
        const menus = [{
          path: '/a',
          redirect: '/form',
          component: 'Layout',
          meta: {
            title: '系统管理',
            icon: 'form'
          },
          children: [{
            path: '/form',
            name: 'form',
            component: 'dashboard/index',
            // form前加不加 /，取决于你的router/_import_  文件中的@/view、后面是否有/
            meta: {
              title: '常见问题',
              icon: 'zhifubao'
            }
          },
          {
            path: '/table',
            name: 'table',
            component: 'dashboard/index',
            // form前加不加 /，取决于你的router/_import_  文件中的@/view、后面是否有/
            meta: {
              title: '关于我们',
              icon: 'table'
            }
          },
          {
            path: '/table1',
            name: 'table1',
            component: 'dashboard/index',
            role: ['editor'],
            // form前加不加 /，取决于你的router/_import_  文件中的@/view、后面是否有/
            meta: {
              title: '店铺装修',
              icon: 'table'
            }
          }
          ]
        }]
        //如果需要404 页面，请在此处添加
        menus.push({
          path: '/404',
          component: '404',
          hidden: true
        }, {
          path: '*',
          redirect: '/404',
          hidden: true
        })
        // 获取到用户信息
        console.log(data)
        console.log(menus)
        const {
          nickname,
          headimg,
          is_vip
        } = data.member_info // 解构出名字和头像
        commit('SET_NAME', nickname) // 触发vuex SET_NAME 保存名字到vuex
        commit('SET_AVATAR', headimg) // 触发vuex SET_AVATAR 保存头像到vuex
        commit('SET_MENUS', menus) // 触发vuex SET_MENUS 保存路由表到vuex
        commit('SET_ROLES',is_vip)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
