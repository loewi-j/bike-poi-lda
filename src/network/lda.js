import {request} from "./request";

export function getLDAHeatMap(type) {
  return request({
    method: 'get',
    url: 'cityBike/heatmap',
    params: {type}
  })
}

export function getLDAPercent(type) {
  return request({
    method: 'get',
    url: 'cityBike/percent',
    params: {type}
  })
}