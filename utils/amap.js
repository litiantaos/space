export const loadAMap = async () => {
  const AMapLoader = await import('@amap/amap-jsapi-loader')

  const { amapAK, amapSK } = await $fetch('/api/map/amap')

  window._AMapSecurityConfig = {
    securityJsCode: amapSK,
  }

  return await AMapLoader.load({
    key: amapAK,
    version: '2.0',
    plugins: ['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Geocoder'],
  })
}

export const getAMapLocation = async (AMap) => {
  return new Promise(async (resolve, reject) => {
    const geolocation = new AMap.Geolocation()

    geolocation.getCurrentPosition(async (status, result) => {
      if (status === 'complete') {
        const res = result.position

        const lnglat = [res.lng, res.lat]

        resolve(lnglat)
      } else {
        console.log(result)

        reject(result)
      }
    })
  })
}

export const setAMap = async (AMap, center, id) => {
  const isDarkMode = ref(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  return await new AMap.Map(id, {
    viewMode: '2D',
    zoom: 12,
    center,
    mapStyle: isDarkMode.value
      ? 'amap://styles/grey'
      : 'amap://styles/whitesmoke',
    scrollWheel: false,
    doubleClickZoom: false,
    dragEnable: false,
    keyboardEnable: false,
    touchZoom: false,
    dragEnable: false,
    pitchEnable: false,
    rotateEnable: false,
    rotateEnable: false,
    pitchEnable: false,
    WebGLParams: {
      preserveDrawingBuffer: true,
    },
  })
}

export const setAMapMarker = async (AMap, center) => {
  return await new AMap.CircleMarker({
    center,
    radius: 8,
    fillColor: '#2775b6',
    fillOpacity: 0.6,
    strokeColor: '#2775b6',
    strokeWeight: 4,
    strokeOpacity: 0.2,
    zIndex: 10,
  })
}

export const getAMapAddress = async (AMap, lnglat) => {
  return new Promise(async (resolve, reject) => {
    const geocoder = await new AMap.Geocoder()

    geocoder.getAddress(lnglat, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        // console.log(result.regeocode)

        const address = result.regeocode.formattedAddress

        resolve(address)
      } else {
        console.log(result)

        reject(result)
      }
    })
  })
}
