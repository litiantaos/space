<template>
  <div>
    <EditorContent :editor="editor" class="html-style h-full" />

    <FloatingMenu
      v-if="editor"
      :editor="editor"
      :tippy-options="{ animation: 'shift-away', duration: 200 }"
    >
      <BasePopover
        :options="{
          placement: 'bottom-start',
          theme: 'base',
        }"
      >
        <button
          class="ri-sparkling-line text-xl text-slate-400 transition-all active:text-slate-300"
        ></button>

        <template #content>
          <div class="grid w-max grid-cols-5 gap-1">
            <button
              v-for="menu in floatingMenus"
              class="menu-button"
              :class="menu.icon"
              @click="menu.command(editor)"
            ></button>

            <button
              class="menu-button ri-infinity-line"
              @click="askAi('gemini')"
            ></button>
          </div>
        </template>
      </BasePopover>
    </FloatingMenu>

    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :tippy-options="{
        animation: 'shift-away',
        duration: 200,
        placement: 'top-start',
        theme: 'base',
      }"
      class="bubble-menu"
      plugin-key="bubbleMenu"
    >
      <BasePopover
        :options="{
          placement: 'top-start',
          offset: [-5, 10],
          theme: 'base',
        }"
      >
        <button class="menu-button ri-text"></button>

        <template #content>
          <div class="bubble-menu">
            <button
              v-for="menu in textMenus"
              class="menu-button"
              :class="[
                menu.icon,
                {
                  active: editor.isActive(menu.title, menu.attrs),
                },
              ]"
              @click="menu.command(editor)"
            ></button>
          </div>
        </template>
      </BasePopover>

      <BasePopover
        :options="{
          placement: 'top-start',
          offset: [-41, 10],
          theme: 'base',
        }"
      >
        <button class="menu-button ri-font-color"></button>

        <template #content>
          <div class="bubble-menu">
            <button
              class="menu-button ri-slash-commands-2 text-lg"
              @click="editor.chain().focus().unsetColor().run()"
            ></button>

            <button
              v-for="menu in colorMenus"
              class="menu-button flex items-center justify-center"
              @click="menu.command(editor, menu.color)"
            >
              <div
                class="h-4 w-4 rounded-sm"
                :style="{ background: menu.color }"
              ></div>
            </button>
          </div>
        </template>
      </BasePopover>

      <button
        v-for="menu in bubbleMenus"
        class="menu-button"
        :class="[
          menu.icon,
          {
            active: editor.isActive(menu.title, menu.attrs),
          },
        ]"
        @click="menu.command(editor)"
      ></button>

      <BasePopover
        :options="{
          placement: 'top-end',
          offset: [41, 10],
        }"
      >
        <button
          class="menu-button ri-link"
          :class="{ active: editor.isActive('link') }"
          @click="onLink"
        ></button>

        <template #content>
          <BaseInput
            type="text"
            placeholder="URL"
            v-model="linkUrl"
            icon="ri-check-line"
            auto-focus
            @confirm="setLink"
            @keyup.enter="setLink"
            class="w-[294px]"
          />
        </template>
      </BasePopover>

      <BasePopover
        :options="{
          placement: 'top-end',
          offset: [5, 10],
          theme: 'base',
        }"
      >
        <button class="menu-button ri-infinity-line"></button>

        <template #content>
          <div class="bubble-menu">
            <button class="menu-button" @click="runAi('rewrite', 'gemini')">
              R
            </button>
            <button class="menu-button" @click="runAi('summarize', 'gemini')">
              S
            </button>
            <button class="menu-button" @click="runAi('expand', 'gemini')">
              E
            </button>
            <button class="menu-button" @click="runAi('continue', 'gemini')">
              C
            </button>
          </div>
        </template>
      </BasePopover>
    </BubbleMenu>

    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :should-show="() => editor.isActive('table')"
      :tippy-options="{
        animation: 'shift-away',
        duration: 200,
        placement: 'top-start',
        theme: 'base',
      }"
      class="bubble-menu"
      plugin-key="tableMenu"
    >
      <button
        v-for="menu in tableMenus"
        class="menu-button"
        :class="menu.icon"
        @click="menu.command(editor)"
      ></button>
    </BubbleMenu>
  </div>
</template>

<script setup>
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from '@tiptap/vue-3'

import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Media from '~/extensions/media'
import Map from '~/extensions/map'
import Group from '~/extensions/group'

import {
  floatingMenus,
  bubbleMenus,
  textMenus,
  tableMenus,
  colorMenus,
} from '~/utils/editor-menus'

import { useOverlay } from '~/stores/overlay'
import PostAiContent from '~/components/Post/AiContent.vue'

const props = defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
})

const model = defineModel()

const editor = useEditor({
  content: model.value,
  editable: props.editable,
  autofocus: true,
  extensions: [
    StarterKit.configure({
      codeBlock: false,
      dropcursor: {
        width: 3,
        color: '#59c289',
      },
    }),
    TaskList,
    TaskItem,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    Placeholder.configure({
      placeholder: '心有从容，向阳而生',
    }),
    Link.configure({
      openOnClick: false,
    }),
    CodeBlockLowlight.configure({
      lowlight: createLowlight(common),
    }),
    TextStyle,
    Color,
    Media,
    Map,
    Group,
  ],
  onUpdate: () => {
    model.value = editor.value.getHTML()
  },
})

watch(
  () => model.value,
  (value) => {
    const isSame = editor.value.getHTML() === value
    if (!isSame) {
      editor.value.commands.setContent(value, false)
    }
  },
)

// LINK
const linkUrl = ref(null)

const onLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  linkUrl.value = previousUrl
}

const setLink = () => {
  if (linkUrl.value === null) {
    return
  }

  if (linkUrl.value === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: linkUrl.value })
    .run()
}

// Ai
const overlay = useOverlay()

const runAi = async (type, model) => {
  const content = window.getSelection().toString()

  overlay.show = true
  overlay.component = PostAiContent
  overlay.data = {
    content,
    type,
    model,
    editorContent: model.value,
  }

  const result = await $fetch(`/api/ai/${model}`, {
    query: {
      content,
      type,
    },
    timeout: 50000,
  })

  // console.log(result)

  overlay.data.result = result
}

const askAi = (model) => {
  overlay.show = true
  overlay.component = PostAiContent
  overlay.data = {
    mode: 'ask',
    model,
  }
}
</script>

<style>
.tiptap {
  @apply h-full overflow-auto;

  &:focus {
    outline: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  p.is-editor-empty:first-child::before {
    @apply pointer-events-none float-left ml-10 h-0 text-gray-300 content-[attr(data-placeholder)];
  }
}

.bubble-menu {
  @apply flex gap-1;
}

.menu-button {
  @apply c-bg-el-active c-text-base h-8 w-8 rounded;

  &.active {
    @apply font-bold text-blue-500;
  }
}

div[data-tippy-root] {
  @apply transition-transform duration-300;

  .tippy-box {
    max-width: none !important;
  }
}
</style>
