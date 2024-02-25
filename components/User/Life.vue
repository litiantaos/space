<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-end gap-4">
      <div class="flex gap-2 text-gray-500">
        <span>{{ daysDiff }}</span>
        <span class="text-slate-400">DAYS</span>
        <span>90</span>
        <span class="text-slate-400">YEARS</span>
        <span>LIFE</span>
      </div>

      <Transition>
        <div v-if="checkedDate" class="text-gray-400">{{ checkedDate }}</div>
      </Transition>
    </div>

    <div
      class="no-scrollbar grid grid-flow-col grid-rows-12 gap-1 overflow-auto"
    >
      <div
        v-for="num in 1080"
        class="h-3 w-3 flex-none rounded-sm bg-slate-100"
        :class="[
          `first:row-start-${birthdayMonth}`,
          { 'bg-blue-100': num <= monthsDiff },
        ]"
        @click="check(num)"
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

const check = (num) => {
  const index = num + birthdayMonth - 2

  const year =
    Number(props.birthday.split('-')[0]) + Math.ceil((index + 1) / 12) - 1
  const mon = (index % 12) + 1
  const month = mon >= 10 ? mon : `0${mon}`

  checkedDate.value = `${year}-${month}`

  setTimeout(() => {
    checkedDate.value = ''
  }, 1500)
}
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
