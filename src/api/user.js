import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/login/member_login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/v1/member/vip',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
