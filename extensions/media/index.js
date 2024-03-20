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
      srcs: {
        default: null,
      },
      width: {
        default: '100%',
      },
      align: {
        default: 'center',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img:not([type="group"] img)',
        getAttrs: (element) => ({
          srcs: [element.getAttribute('src')],
        }),
      },
      {
        tag: 'video',
        getAttrs: (element) => ({
          srcs: [element.getAttribute('src')],
        }),
      },
      {
        tag: 'div[type="group"]',
        getAttrs: (element) => {
          let groupSrcs = []

          const groupImgs = element.querySelectorAll('img[src]')

          groupImgs.forEach((img) => {
            const groupSrc = img.getAttribute('src')

            if (groupSrc) groupSrcs.push(groupSrc)
          })

          return {
            srcs: groupSrcs,
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { type, srcs, width, align } = HTMLAttributes

    if (type === 'img' && (!srcs || srcs.length === 1)) {
      return [
        'img',
        {
          src: srcs?.[0],
          width,
          align,
          zoomable: true,
        },
      ]
    } else if (type === 'video') {
      return [
        'video',
        {
          src: srcs?.[0],
          width,
          align,
          controls: true,
        },
      ]
    } else if (srcs && srcs.length > 1) {
      let arr = srcs.map((src) => {
        return [
          'img',
          {
            src,
            zoomable: true,
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
