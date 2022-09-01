import { TipTapCustomImage } from '../node/Image'
import { useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import { UploadFn } from '../node/upload_image'


async function upload(file){
  let res = await fetch("/api/s3/", {
    method: "POST",
    body: file.type,
  });
  const {data, src} = await res.json();
  const url = data.url;
  const fields = data.fields;
  const formData = new FormData();
  Object.entries({ ...fields}).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append('file', file)
  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (upload.ok){
    return src
  }
  return null
}

const ImageEditor = () => {
  const [file, setFile] = useState()
  const editor = useEditor({
    extensions: [
        StarterKit,
        TipTapCustomImage(upload),
    ],
    content: '<p>Hello World! 🌎️</p>',
  })

  const fileSelected = event => {
    const file = event.target.files[0]
    setFile(file)
  }

  const submit = async event => {
    event.preventDefault()
    const src = await upload(file)
    if (src !== null){
      editor.chain().focus()?.setImage({src})?.run();
    }
    console.log("File size was too large")
  }

  return (
    <>
      <div>
        <form onSubmit={submit} style={{width:650}} className="flex flex-col space-y-5 px-5 py-14">
            <input onChange={fileSelected} type="file" accept="image/*"></input>
            <button type="submit">Submit</button>
        </form>
        <EditorContent editor={editor}/>
      </div>
    </>
  )
}

export default ImageEditor;