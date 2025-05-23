import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  const { geminiAK } = useRuntimeConfig()

  const { content, type, mode } = getQuery(event)

  const genAI = new GoogleGenerativeAI(geminiAK)

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const keys = {
    rewrite: '重写',
    summarize: '简写',
    expand: '扩写',
    continue: '续写',
  }

  let prompt = ''

  if (mode && mode === 'ask') {
    prompt = content
  } else {
    prompt =
      '**' + keys[type] + '**以下内容并直接输出纯文本结果：<br><br>>' + content
  }

  // console.log(prompt)

  const result = await model.generateContent(prompt)

  const text = result.response.text()

  return text
})
