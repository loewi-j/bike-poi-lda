//百度地图ak注册脚本
export const loadBMap = (ak)=> {
  return new Promise(function(resolve, reject) {
    if (typeof BMap !== 'undefined') {
      // eslint-disable-next-line no-undef
      resolve(BMap)
      return true
    }
    window.onBMapCallback = function() {
      // eslint-disable-next-line no-undef
      resolve(BMap)
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src =
        'http://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=onBMapCallback'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
