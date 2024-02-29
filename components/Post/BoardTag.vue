<template>
  <div class="no-scrollbar my-3 flex items-center gap-2 overflow-x-auto">
    <button
      v-for="(tag, idx) in tags"
      class="tag"
      :class="tag.checked ? 'bg-slate-200' : 'bg-slate-100/85'"
      @click="checkTag(idx)"
    >
      {{ tag.name }}
    </button>

    <div
      v-if="user && profile?.role === 'admin'"
      class="tag flex items-center bg-slate-100/85"
    >
      <input
        :type="editable ? 'text' : 'button'"
        v-model="inputValue"
        class="text-xs transition-[width]"
        :class="editable ? 'w-20' : 'w-0'"
        @keyup.enter="insertTag"
      />
      <button
        :class="editable ? 'ri-close-line' : 'ri-add-line'"
        @click="addTag"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'

const client = useSupabaseClient()
const user = useSupabaseUser()

const emit = defineEmits(['checked'])

// Get All Tags
const { data } = await client.from('tags').select('id, name')

const tags = ref(null)

tags.value = data.map((item) => ({
  ...item,
  checked: false,
}))

// Edit Post: Match Checked Tags
const checkedTags = usePostStore().editablePost
  ? usePostStore().editablePost.tags
  : null

if (checkedTags?.length) {
  tags.value = tags.value.map((tag) => ({
    ...tag,
    checked: checkedTags.some((checkedTag) => checkedTag.id === tag.id),
  }))
}

// Checked Tags
const checked = ref(null)

const checkTag = (index) => {
  tags.value[index].checked = !tags.value[index].checked

  checked.value = tags.value.filter((tag) => tag.checked)
  // console.log(checked.value)
  emit('checked', checked.value)
}

// Add Tag
const editable = ref(false)
const inputValue = ref(null)

const addTag = () => {
  editable.value = !editable.value
  inputValue.value = null
}

const insertTag = async () => {
  const { data, error } = await client
    .from('tags')
    .insert({
      name: inputValue.value,
    })
    .select()

  if (error) throw error

  tags.value.push({
    id: data[0].id,
    name: inputValue.value,
  })

  editable.value = false
  inputValue.value = null
}

// Add Tag Only Admin
const profile = ref(null)

onMounted(() => {
  profile.value = useUserProfile().profile.value
})
</script>
