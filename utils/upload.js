// Supabase
export const uploadToSupabase = async (
  file,
  path,
  bucket = 'main',
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

// Supabase Tus Options
export const uploadToSupabaseOptions = async (path, bucket = 'main') => {
  const client = useSupabaseClient()
  const config = useRuntimeConfig()

  const { data: session } = await client.auth.getSession()

  return {
    endpoint: config.public.supabaseUrl + '/storage/v1/upload/resumable',
    retryDelays: [0, 3000, 5000, 10000, 20000],
    headers: {
      authorization: `Bearer ${session.session.access_token}`,
      'x-upsert': 'false',
    },
    uploadDataDuringCreation: true,
    removeFingerprintOnSuccess: true,
    metadata: {
      bucketName: bucket,
      objectName: path,
      cacheControl: 3600,
    },
    chunkSize: 6 * 1024 * 1024,
  }
}
