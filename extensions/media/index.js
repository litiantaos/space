import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import MediaView from './view.vue'

export default Node.create({
  name: 'Media',

  group: 'block',

  selectable: true,

  draggable: true,

  addAttributes() {
    return {
      type: {
        default: 'img',
      },
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      style: {
        default: 'margin-left: auto; margin-right: auto;',
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const { type } = HTMLAttributes

    if (type === 'img') {
      return ['img', HTMLAttributes]
    } else if (type === 'video') {
      return [
        'video',
        mergeAttributes(HTMLAttributes, {
          controls: 'true',
        }),
      ]
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: (element) => ({
          src: element.getAttribute('src'),
          type: 'img',
        }),
      },
      {
        tag: 'video',
        getAttrs: (element) => ({
          src: element.getAttribute('src'),
          type: 'video',
        }),
      },
    ]
  },

  addCommands() {
    return {
      setMedia:
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
    return VueNodeViewRenderer(MediaView)
  },
})
