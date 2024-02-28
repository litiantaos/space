<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-end gap-2 text-sm text-slate-400">
      <div class="text-gray-500">
        <div>{{ daysDiff }}</div>
        <div>{{ monthsDiff }}</div>
      </div>

      <div>
        <div>DAYS</div>
        <div>MONTHS</div>
      </div>

      <div class="ml-1 text-[44px] leading-10 text-gray-500">90</div>

      <div>YEARS</div>

      <Transition name="date-left">
        <div v-if="checkedDate" class="ml-2">
          {{ checkedDate }}
        </div>
      </Transition>
    </div>

    <div
      class="no-scrollbar grid grid-flow-col grid-rows-12 gap-1 overflow-auto"
    >
      <div
        v-for="num in 1080"
        class="h-3 w-3 flex-none rounded-sm"
        :class="
          groupedPosts[toDate(num)]
            ? 'bg-emerald-300/80'
            : num <= monthsDiff
              ? 'bg-blue-200'
              : 'bg-slate-100'
        "
        :style="{ 'grid-row-start': num === 1 ? birthdayMonth : 'unset' }"
        @click="checkDate(num)"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  birthday: String,
})

const startDate = new Date(props.birthday)
const todayDate = new Date()

// Months
const yearsDiff = todayDate.getFullYear() - startDate.getFullYear()
const monthsDiff =
  yearsDiff * 12 + (todayDate.getMonth() - startDate.getMonth()) + 1

// Days
const timeDiff = todayDate.getTime() - startDate.getTime()
const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

const birthdayMonth = parseInt(props.birthday.split('-')[1], 10)

const checkedDate = ref('')

const toDate = (num) => {
  const index = num + birthdayMonth - 2

  const year =
    Number(props.birthday.split('-')[0]) + Math.ceil((index + 1) / 12) - 1
  const mon = (index % 12) + 1
  const month = mon >= 10 ? mon : `0${mon}`

  return `${year}-${month}`
}

const checkDate = (num) => {
  const postCount = groupedPosts[toDate(num)]
    ? ' | ' + groupedPosts[toDate(num)].length + ' Posts'
    : ''

  checkedDate.value = toDate(num) + postCount

  setTimeout(() => {
    checkedDate.value = ''
  }, 1500)
}

// Get All Posts
const { data: posts } = await useSupabaseClient()
  .from('posts')
  .select('id, created_at')
  .order('created_at', {
    ascending: false,
  })

// Group Posts
const groupedPosts = posts.reduce((acc, post) => {
  const month = post.created_at.slice(0, 7)

  if (!acc[month]) {
    acc[month] = []
  }

  acc[month].push(post)

  return acc
}, {})
</script>

<style>
.date-left-enter-active,
.date-left-leave-active {
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.date-left-enter-from,
.date-left-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
