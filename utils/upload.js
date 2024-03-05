// Supabase
export const uploadToSupabase = async (
  file,
  path,
  bucket = 'space',
  options = {},
) => {
  const client = useSupabaseClient()
  const config = useRuntimeConfig()

  const { data, error } = await client.storage
    .from(bucket)
    .upload(path, file, options)

  if (error) {
    console.log(error)
  }

  const url =
    config.public.supabaseUrl +
    '/storage/v1/object/public/' +
    bucket +
    '/' +
    path

  return url
}

// Qiniu
export const uploadToQiniu = async (file, path) => {
  const qiniu = await import('qiniu-js')

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

          const url = config.public.fileUrl + '/' + path

          resolve(url)
        },
      }

      const subscription = observable.subscribe(observer)
    } catch (error) {
      reject(error)
    }
  })
}
