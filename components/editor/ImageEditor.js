import { TipTapCustomImage } from '../../node/Image'
import { useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';

async function upload(file){
  //fetch data from endpoint for presigned link and image src
  let res = await fetch("/api/s3/", {
    method: "POST",
    body: file.type,
  });
  const {data, src} = await res.json();
  const url = data.url; //url for post
  const fields = data.fields; //formdata for post
  const formData = new FormData();
  Object.entries({ ...fields}).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append('file', file)
  //POST to upload file
  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (upload.ok){
    return src
  }
  return null
}

async function tag(difference, key, value){
  for (var num in difference){
    const body = {
      name: difference[num].split("/").pop(),
      tag: {
        key: key,
        value: value
      }
    }
    let res = await fetch("/api/s3", {
      method: "PUT",
      body: JSON.stringify(body)
    });
  }
}

const ImageEditor = () => {
  const [file, setFile] = useState()
  const [images, setImages] = useState()

  const editor = useEditor({
    editorProps: {
      handleDOMEvents: {
        async keyup(view, event) {
          const currentImages = view.state.doc.toJSON().content.filter(node => node.type === 'image').map(element => element.attrs.src);
          if (images != null){
            if (images.length > currentImages.length){
              let difference = images.filter(image => !currentImages.includes(image))
              await tag(difference, "USED", "False")
            }
            else {
              let difference = currentImages.filter(image => !images.includes(image));
              await tag(difference, "USED", "True")
            }
          }
          images = currentImages
        }
      }
    },
    extensions: [
        StarterKit,
        TipTapCustomImage(upload),
    ],
    content: '<p>Hello World! 🌎️</p>',
  })

  editor?.on('create', ({ editor }) => {
    setImages(editor.getJSON().content.filter(node => node.type === 'image'))
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
    else{
      console.log("File size was too large")
    }
  }

  return (
    <>
      <div>
        <form onSubmit={submit} style={{width:650}}>
            <input onChange={fileSelected} type="file" accept="image/*"></input>
            <button type="submit">Submit</button>
        </form>
        <EditorContent editor={editor}/>
      </div>
    </>
  )
}

export default ImageEditor;