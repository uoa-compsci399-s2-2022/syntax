import { TipTapCustomImage } from '../node/Image'
import { useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios'
import { UploadFn } from '../node/upload_image'


async function upload(file){
    let { data } = await axios.post("/api/s3/", {
        type: file.type,
    });
    console.log(file)
    const url = data.url;
      await axios.put(url, file, {
        headers: {
            "Content-type": file.type,
            "Access-Control-Allow-Origin": "*",
            },
    });
    return data.src;
}

const ImageEditor = () => {
  const [file, setFile] = useState()
  const editor = useEditor({
    extensions: [
        StarterKit,
        TipTapCustomImage(UploadFn),
      
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
    let { data } = await axios.post("/api/s3/", {
        type: file.type,
    });
    editor.chain().focus()?.setImage({ src })?.run();
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