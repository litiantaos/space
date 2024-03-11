<template>
  <NodeViewWrapper
    class="c-border-el c-bg-page flex w-full flex-col gap-3 rounded-md border-dashed p-3"
    draggable="true"
    data-drag-handle
  >
    <div class="text-gray-400">元素组</div>
    <NodeViewContent type="group" contenteditable="false" />
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps({
  nodeViewProps,
})
</script>
