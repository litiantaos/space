import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import GroupView from './view.vue'

export default Node.create({
  name: 'Group',

  group: 'block',

  content: 'block*',

  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'div[type="group"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { type: 'group' }), 0]
  },

  addCommands() {
    return {
      setGroup:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(GroupView)
  },
})
