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
    name: "",
    avatar: "",
    menus: "",
    roles: ""
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
        commit("SET_TOKEN", data.info.token)
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
        const menus = [
          {
            "path": '/',
            "component": "Layout",
            "redirect": '/dashboard',
            "children": [{
              "path": 'dashboard',
              "name": 'Dashboard',
              "component": "dashboard/index",
              "meta": { "title": '首页', "icon": 'dashboard', "affix": "true" } // affix: true 固定 不能被关闭的tabs
            }]
          },
          {
            "path": "/system",
            "redirect": "/menu",
            "component": "Layout",
            "meta": {
              "title": "系统管理",
              "icon": "form"
            },
            "children": [{
              "path": "/menu",
              "name": "menu",
              "component": "menu/index",
              "meta": {
                "title": "菜单管理",
                "icon": "table",
                "roles": ["edit", "delete", "add", "role"]
              }
            },
            {
              "path": "/roles",
              "name": "roles",
              "component": "roles/index",
              "meta": {
                "title": "角色管理",
                "icon": "table",
                "roles": ["edit", "delete", "add", "role"]
              }
            },
            {
              "path": "/administrator",
              "name": "administrator",
              "component": "dashboard/index",
              "meta": {
                "title": "用户管理",
                "icon": "table"
              }
            },
            {
              "path": "/settings",
              "name": "settings",
              "component": "dashboard/index",
              "meta": {
                "title": "系统参数",
                "icon": "table"
              }
            }
            ]
          },
          {
            "path": "/school",
            "redirect": "/information",
            "component": "Layout",
            "meta": {
              "title": "机构管理",
              "icon": "form"
            },
            "children": [{
              "path": "/information",
              "name": "information",
              "component": "dashboard/index",
              "meta": {
                "title": "机构信息",
                "icon": "table"
              }
            },
            {
              "path": "/user",
              "name": "user",
              "component": "dashboard/index",
              "meta": {
                "title": "用户管理",
                "icon": "table"
              }
            },
            {
              "path": "/teacher",
              "name": "teacher",
              "component": "roles/index",
              "meta": {
                "title": "康复师管理",
                "icon": "table",
                "roles": ["edit", "delete", "add", "role"]
              }
            },
            {
              "path": "/vipCard",
              "name": "vipCard",
              "component": "dashboard/index",
              "meta": {
                "title": "会员卡管理",
                "icon": "table"
              }
            },
            {
              "path": "/schoolAdmin",
              "name": "schoolAdmin",
              "component": "dashboard/index",

              "meta": {
                "title": "管理员列表",
                "icon": "table"
              }
            },
            ]
          },
          {
            "path": "/course",
            "redirect": "/courseList",
            "component": "Layout",
            "meta": {
              "title": "课程管理",
              "icon": "form"
            },
            "children": [{
              "path": "/courseList",
              "name": "courseList",
              "component": "dashboard/index",

              "meta": {
                "title": "课程列表",
                "icon": "table"
              }
            },
            {
              "path": "/videoKu",
              "name": "videoKu",
              "component": "dashboard/index",

              "meta": {
                "title": "视频库管理",
                "icon": "table"
              }
            },
            {
              "path": "/trainingPlan",
              "name": "trainingPlan",
              "component": "roles/index",

              "meta": {
                "title": "训练计划管理",
                "icon": "table",
                "roles": ["edit", "delete", "add", "role"]
              }
            },
            {
              "path": "/analysis",
              "name": "analysis",
              "component": "dashboard/index",

              "meta": {
                "title": "维度分析管理",
                "icon": "table"
              }
            }
            ]
          },
          {
            "path": "/msg",
            "redirect": "/form",
            "component": "Layout",
            "meta": {
              "title": "资讯管理",
              "icon": "form"
            },
            "children": [
              {
                "path": "/tuiwen",
                "name": "tuiwen",
                "component": "dashboard/index",
                "meta": {
                  "title": "推文列表",
                  "icon": "table"
                }
              },
              {
                "path": "/commonProblem",
                "name": "commonProblem",
                "component": "roles/index",
                "meta": {
                  "title": "常见问题",
                  "icon": "table",
                  "roles": ["edit", "delete", "add", "role"]
                }
              },
              {
                "path": "/stationLetter",
                "name": "stationLetter",
                "component": "dashboard/index",
                "meta": {
                  "title": "站内信管理",
                  "icon": "table"
                }
              }
            ]
          }
        ]
        //如果需要404 页面，请在此处添加
        menus.push({
          path: "/404",
          component: "404",
          hidden: true
        }, {
          path: "*",
          redirect: "/404",
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
        commit("SET_NAME", nickname) // 触发vuex SET_NAME 保存名字到vuex
        commit("SET_AVATAR", headimg) // 触发vuex SET_AVATAR 保存头像到vuex
        commit("SET_MENUS", menus) // 触发vuex SET_MENUS 保存路由表到vuex
        commit("SET_ROLES", is_vip)
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
