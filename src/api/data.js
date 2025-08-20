import request from '@/utils/request'

export function statistics() {
  return request({
    url: '/data/summary',
    method: 'get'
  })
}

export function timeSavingStatistics() {
  return request({
    url: '/data/time-saving',
    method: 'get'
  })
}
