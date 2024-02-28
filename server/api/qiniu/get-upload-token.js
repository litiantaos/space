import qiniu from 'qiniu'

export default defineEventHandler(async (event) => {
  const { qiniuAK, qiniuSK } = useRuntimeConfig()

  const mac = new qiniu.auth.digest.Mac(qiniuAK, qiniuSK)

  const options = {
    scope: 'teospace',
    expires: 7200,
  }

  const putPolicy = new qiniu.rs.PutPolicy(options)

  const uploadToken = putPolicy.uploadToken(mac)

  return uploadToken
})
