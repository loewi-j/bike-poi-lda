import {request} from "./request";

export function getPOIData() {
  return request({
    method: 'get',
    url: 'cityBike/poi',
  })
}

export function getTimeData() {
  return request({
    method: 'get',
    url: 'cityBike/time',
  })
}

