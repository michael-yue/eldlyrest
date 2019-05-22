import request from '@/utils/request'

export function payQrcode(param) {
  return request({
    url: '/eldlyrest/payQrcode?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function payCash(param) {
  return request({
    url: '/eldlyrest/payCash?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function payCardBalance(param) {
  return request({
    url: '/eldlyrest/payCardBalance?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}
