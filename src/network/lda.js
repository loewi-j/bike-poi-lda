import {request} from "./request";

export function getLDAHeatMap() {
  return request({
    method: 'get',
    url: 'cityBike/heatmap',
  })
}

export function getLDAPercent(type) {
  return request({
    method: 'get',
    url: 'cityBike/percent',
    params: {type}
  })
}