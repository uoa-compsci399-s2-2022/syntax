import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar.js'
import { Button } from '@nextui-org/react'
import { createNote } from './Databasing.js'


export default () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Hello World! 🌎️</p>'
  })

  return (
    <div>   
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
      <Button onClick={() => createNote(editor.getJSON())}>Save</Button> 
    </div>
  )
}
