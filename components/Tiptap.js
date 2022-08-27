import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import Menubar from './Menubar.js'



export default () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
  })

  return (
    <div>   
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

