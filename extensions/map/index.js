import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import MapView from './view.vue'

export default Node.create({
  name: 'Map',

  group: 'block',

  selectable: true,

  draggable: true,

  addAttributes() {
    return {
      location: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[location]',
        getAttrs: (element) => ({
          location: element.getAttribute('location'),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      setMap:
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
    return VueNodeViewRenderer(MapView)
  },
})
