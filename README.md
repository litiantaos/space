# TeoSpace

## Introduction

App built using [Nuxt 3](https://nuxt.com), [Tailwind CSS](https://tailwindcss.com), [Pinia](https://pinia.vuejs.org), [Remix Icon](https://remixicon.com), [Tiptap](https://tiptap.dev) and [Supabase](https://supabase.com/).

Website: [https://www.litiantao.com](https://www.litiantao.com)

## Configuration

Add `.env` file:

```
--- Supabase ---
SUPABASE_URL="https://example.supabase.co"
SUPABASE_KEY="<your_key>"

--- Your Domain ---
NUXT_PUBLIC_SITE_URL="https://example.com"

--- Gemini Key ---
NUXT_GEMINI_AK="<your_key>"

--- GaoDe Map Key ---
NUXT_AMAP_AK="<your_key>"
NUXT_AMAP_SK="<your_key>"
```

## Setup

```bash
# Install dependencies
npm install

# Start dev server at localhost:3000
npm run dev -- -o
```
