export const floatingMenus = [
  {
    icon: 'ri-h-1',
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run()
    },
  },
  {
    icon: 'ri-h-2',
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run()
    },
  },
  {
    icon: 'ri-h-3',
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run()
    },
  },
  {
    icon: 'ri-code-box-line',
    command: (editor) => {
      editor.chain().focus().toggleCodeBlock().run()
    },
  },
  {
    icon: 'ri-quote-text',
    command: (editor) => {
      editor.chain().focus().toggleBlockquote().run()
    },
  },
  {
    icon: 'ri-list-unordered',
    command: (editor) => {
      editor.chain().focus().toggleBulletList().run()
    },
  },
  {
    icon: 'ri-list-ordered',
    command: (editor) => {
      editor.chain().focus().toggleOrderedList().run()
    },
  },
  {
    icon: 'ri-list-check-3',
    command: (editor) => {
      editor.chain().focus().toggleTaskList().run()
    },
  },
  {
    icon: 'ri-separator',
    command: (editor) => {
      editor.chain().focus().setHorizontalRule().run()
    },
  },
  {
    icon: 'ri-table-line',
    command: (editor) => {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
    },
  },
  {
    icon: 'ri-image-line',
    command: (editor) => {
      editor
        .chain()
        .focus()
        .setMedia({
          type: 'img',
        })
        .run()
    },
  },
  {
    icon: 'ri-movie-line',
    command: (editor) => {
      editor
        .chain()
        .focus()
        .setMedia({
          type: 'video',
        })
        .run()
    },
  },
  {
    icon: 'ri-compass-4-line',
    command: (editor) => {
      editor.chain().focus().setMap().run()
    },
  },
]

export const textMenus = [
  {
    icon: 'ri-h-1',
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run()
    },
    title: 'heading',
    attrs: { level: 1 },
  },
  {
    icon: 'ri-h-2',
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run()
    },
    title: 'heading',
    attrs: { level: 2 },
  },
  {
    icon: 'ri-h-3',
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run()
    },
    title: 'heading',
    attrs: { level: 3 },
  },
  {
    icon: 'ri-bold',
    command: (editor) => {
      editor.chain().focus().toggleBold().run()
    },
    title: 'bold',
    attrs: {},
  },
  {
    icon: 'ri-strikethrough',
    command: (editor) => {
      editor.chain().focus().toggleStrike().run()
    },
    title: 'strike',
    attrs: {},
  },
  {
    icon: 'ri-code-s-slash-line',
    command: (editor) => {
      editor.chain().focus().toggleCode().run()
    },
    title: 'code',
    attrs: {},
  },
]

export const bubbleMenus = [
  {
    icon: 'ri-quote-text',
    command: (editor) => {
      editor.chain().focus().toggleBlockquote().run()
    },
    title: 'blockquote',
    attrs: {},
  },
  {
    icon: 'ri-list-unordered',
    command: (editor) => {
      editor.chain().focus().toggleBulletList().run()
    },
    title: 'bulletList',
    attrs: {},
  },
  {
    icon: 'ri-list-ordered',
    command: (editor) => {
      editor.chain().focus().toggleOrderedList().run()
    },
    title: 'orderedList',
    attrs: {},
  },
  {
    icon: 'ri-list-check-3',
    command: (editor) => {
      editor.chain().focus().toggleTaskList().run()
    },
    title: 'taskList',
    attrs: {},
  },
]

export const tableMenus = [
  {
    icon: 'ri-insert-column-left',
    command: (editor) => {
      editor.chain().focus().addColumnBefore().run()
    },
  },
  {
    icon: 'ri-insert-column-right',
    command: (editor) => {
      editor.chain().focus().addColumnAfter().run()
    },
  },
  {
    icon: 'ri-delete-column',
    command: (editor) => {
      editor.chain().focus().deleteColumn().run()
    },
  },
  {
    icon: 'ri-insert-row-top',
    command: (editor) => {
      editor.chain().focus().addRowBefore().run()
    },
  },
  {
    icon: 'ri-insert-row-bottom',
    command: (editor) => {
      editor.chain().focus().addRowAfter().run()
    },
  },
  {
    icon: 'ri-delete-row',
    command: (editor) => {
      editor.chain().focus().deleteRow().run()
    },
  },
  {
    icon: 'ri-delete-bin-7-line',
    command: (editor) => {
      editor.chain().focus().deleteTable().run()
    },
  },
  {
    icon: 'ri-merge-cells-horizontal',
    command: (editor) => {
      editor.chain().focus().mergeOrSplit().run()
    },
  },
]

export const colorMenus = [
  {
    color: 'rgba(160, 160, 160, 1)',
    command: (editor, color) => {
      editor.chain().focus().setColor(color).run()
    },
  },
  {
    color: 'rgba(212, 76, 71, 1)',
    command: (editor, color) => {
      editor.chain().focus().setColor(color).run()
    },
  },
  {
    color: 'rgba(217, 115, 13, 1)',
    command: (editor, color) => {
      editor.chain().focus().setColor(color).run()
    },
  },
  {
    color: 'rgba(203, 145, 47, 1)',
    command: (editor, color) => {
      editor.chain().focus().setColor(color).run()
    },
  },
  {
    color: 'rgba(68, 131, 97, 1)',
    command: (editor, color) => {
      editor.chain().focus().setColor(color).run()
    },
  },
  {
    color: 'rgba(51, 126, 169, 1)',
    command: (editor, color) => {
      editor.chain().focus().setColor(color).run()
    },
  },
  {
    color: 'rgba(144, 101, 176, 1)',
    command: (editor, color) => {
      editor.chain().focus().setColor(color).run()
    },
  },
]
