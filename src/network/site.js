import {request} from "./request";

export function getStationsData() {
  return request({
    method: 'get',
    url: 'cityBike/site',
  })
}

export function getStationsCenter() {
  return request({
    method: 'get',
    url: 'cityBike/siteCenters',
  })
}