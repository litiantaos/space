<template>
  <NodeViewWrapper>
    <div class="relative my-2 w-full overflow-hidden">
      <div
        id="mapContainer"
        class="h-80 w-full rounded-md bg-slate-100 text-gray-500"
      ></div>

      <div
        class="absolute right-0 top-0 flex max-h-full w-60 flex-col gap-2 p-2"
      >
        <BaseInput
          class="w-full flex-none"
          type="text"
          v-model="input"
          placeholder="搜索地点"
          icon="ri-close-line"
          :loading="searching"
          @confirm="clearSearch"
          @keyup.enter="searchPlace"
        />

        <Transition name="page">
          <div
            v-if="pois"
            class="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden rounded-md border bg-white"
          >
            <TransitionGroup name="list-move-up">
              <button
                v-for="poi in pois"
                :key="poi.id"
                class="flex-none whitespace-nowrap p-2 text-left transition-all active:bg-slate-50"
                @click="checkPlace(poi.location)"
              >
                <div class="overflow-hidden text-ellipsis text-sm">
                  {{ poi.name }}
                </div>
                <div
                  class="overflow-hidden text-ellipsis text-xs text-gray-400"
                >
                  {{ poi.address }}
                </div>
              </button>

              <div
                v-if="poisPage <= poisTotalPage"
                class="flex flex-none items-center justify-center p-2 text-xl text-gray-400"
                key="more"
              >
                <button
                  :class="[
                    'active:text-gray-300',
                    searching
                      ? 'ri-loader-4-line animate-spin'
                      : 'ri-more-line',
                  ]"
                  @click="searchPlace({ page: poisPage + 1 })"
                ></button>
              </div>
            </TransitionGroup>
          </div>
        </Transition>
      </div>

      <div v-if="address" address="">{{ address }}</div>

      <BaseLoading type="absolute" :loading="loading" />
    </div>
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps({
  nodeViewProps,
})

let AMap = null
let map = null

const loading = ref(true)
const searching = ref(false)

const location = ref(null)
const address = ref(null)

const input = ref('')
const pois = ref(null)

const setMap = async () => {
  if (props.node.attrs.location) {
    location.value = props.node.attrs.location.split(',')
  } else {
    location.value = await getAMapLocation(AMap)

    props.updateAttributes({
      location: location.value,
    })
  }

  map = await setAMap(AMap, location.value)

  const marker = await setAMapMarker(AMap, location.value)

  map.add(marker)

  address.value = await getAMapAddress(AMap, location.value)

  loading.value = false
}

onMounted(async () => {
  AMap = await loadAMap()

  setMap()
})

// Search Place
const poisPage = ref(1)
const poisTotalPage = ref(null)

const searchPlace = ({ page = 1 } = {}) => {
  if (!input.value) return

  searching.value = true

  const placeSearch = new AMap.PlaceSearch({
    pageIndex: page,
  })

  placeSearch.search(input.value, (status, result) => {
    if (status === 'complete') {
      const res = result.poiList

      // console.log(res)

      if (page === 1) {
        pois.value = res.pois
      } else if (page > 1) {
        pois.value.push(...res.pois)
      }

      poisPage.value = res.pageIndex

      if (res.count < res.pageSize) {
        poisTotalPage.value = 0
      } else {
        poisTotalPage.value = Math.ceil(res.count / res.pageSize)
      }

      searching.value = false
    } else {
      console.log(result)
    }
  })
}

const clearSearch = () => {
  input.value = ''
  pois.value = null
}

// Check Place
const checkPlace = async (lnglat) => {
  // console.log(lnglat)

  location.value = [lnglat.lng, lnglat.lat]

  map = await setAMap(AMap, location.value)

  const marker = await setAMapMarker(AMap, location.value)

  map.add(marker)

  props.updateAttributes({
    location: location.value,
  })

  address.value = await getAMapAddress(AMap, location.value)
}

onUnmounted(() => {
  map?.destroy()
})
</script>

<style>
.amap-logo,
.amap-copyright {
  display: none !important;
}
</style>
