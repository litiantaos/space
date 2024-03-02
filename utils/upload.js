import * as qiniu from 'qiniu-js'

// Qiniu
export const uploadToQiniu = async (file, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadToken = await $fetch('/api/qiniu/get-upload-token')

      if (!uploadToken) {
        throw new Error('无法获取上传 Token')
      }

      const observable = qiniu.upload(file, path, uploadToken)

      const observer = {
        next(res) {
          // console.log('next', res)
        },
        error(err) {
          reject(err)
        },
        complete(res) {
          const config = useRuntimeConfig()

          const publicUrl = config.public.fileUrl + '/' + path

          resolve(publicUrl)
        },
      }

      const subscription = observable.subscribe(observer)
    } catch (error) {
      reject(error)
    }
  })
}

// Supabase
export const uploadToSupabase = async (file, path, bucket, options) => {
  const client = useSupabaseClient()
  const config = useRuntimeConfig()

  const { data, error } = await client.storage
    .from(bucket)
    .upload(path, file, options)

  if (error) {
    console.log(error)
  }

  const publicUrl =
    config.public.supabaseUrl +
    '/storage/v1/object/public/' +
    bucket +
    '/' +
    path

  return publicUrl
}
