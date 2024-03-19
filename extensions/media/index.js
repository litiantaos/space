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
      align: {
        default: 'center',
      },
      srcs: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: (element) => ({
          src: element.getAttribute('src'),
        }),
      },
      {
        tag: 'video',
        getAttrs: (element) => ({
          src: element.getAttribute('src'),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { type, srcs } = HTMLAttributes

    if (type === 'img' && (!srcs || srcs.length === 1)) {
      return ['img', HTMLAttributes]
    } else if (type === 'video') {
      return [
        'video',
        mergeAttributes(HTMLAttributes, {
          controls: 'true',
        }),
      ]
    } else if (srcs && srcs.length > 1) {
      let arr = srcs.map((src) => {
        return [
          'img',
          {
            type: 'img',
            src,
          },
        ]
      })

      return [
        'div',
        {
          type: 'group',
        },
        ...arr,
      ]
    }
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
