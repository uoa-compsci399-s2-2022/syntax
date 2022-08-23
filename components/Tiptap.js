import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = ({noteContent}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: noteContent,
  })

  return (
    <EditorContent editor={editor} />
  )
}

export default Tiptap;