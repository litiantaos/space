import * as qiniu from 'qiniu-js'

// Qiniu
export const uploadToQiniu = async (file, path) => {
  const uploadToken = await $fetch('/api/qiniu/get-upload-token')

  const observable = qiniu.upload(file, path, uploadToken)

  const observer = {
    next(res) {
      // console.log('next', res)
    },
    error(err) {
      // console.log('err', err)
    },
    complete(res) {
      // console.log('complete', res)
    },
  }

  const subscription = observable.subscribe(observer)

  const config = useRuntimeConfig()

  const publicUrl = config.public.fileUrl + '/' + path

  return publicUrl
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
