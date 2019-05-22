import request from '@/utils/request'

export function listAllUser(usertypeid, cardnumber, mobile, pagenum, pagesize) {
  return request({
    url: '/eldlyrest/listAllUser?t=' + Date.now(),
    method: 'get',
    params: {
      usertypeid,
      cardnumber,
      mobile,
      pagenum,
      pagesize
    }
  })
}
export function queryUsers(usertype, currentPage, limit) {
  return request({
    url: '/eldlyrest/queryUsers?t=' + Date.now(),
    method: 'get',
    params: {
      usertype,
      currentPage,
      limit
    }
  })
}

export function createCard(param) {
  return request({
    url: '/eldlyrest/createCard?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function deleteUser(param) {
  return request({
    url: '/eldlyrest/deleteUser?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function queryPerson(cardnumber) {
  return request({
    url: '/eldlyrest/queryPersonByCardnumber?t=' + Date.now(),
    method: 'post',
    data: {
      cardnumber: cardnumber
    }
  })
}
// UserType

export function addUserType(param) {
  return request({
    url: '/eldlyrest/addUserLevel?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}
export function updateUserType(param) {
  return request({
    url: '/eldlyrest/updateUserLevel?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}
export function deleteUserType(param) {
  return request({
    url: '/eldlyrest/deleteUserLevel?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}
export function listAllUserType() {
  return request({
    url: '/eldlyrest/listAllUserType?t=' + Date.now(),
    method: 'get'
  })
}