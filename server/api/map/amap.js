export default defineEventHandler(async (event) => {
  const { amapAK, amapSK } = useRuntimeConfig()

  return { amapAK, amapSK }
})
