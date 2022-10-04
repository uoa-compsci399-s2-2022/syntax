import { getNoteByID } from "../../../prisma/Note";
import { getSession } from "next-auth/react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { TipTapCustomImage } from "@/node/Image";
import { Drawing } from "@/node/Drawing";
import TurndownService from 'turndown';
import mdToPdf from "md-to-pdf";

const CSS = `<style>
/* general css */
html,
body {
padding: 0;
margin: 5%;
font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
color: inherit;
text-decoration: none;
}

* {
box-sizing: border-box;
}

/* note page styling */
.note-metadata-table td {
padding: 0;
}

.note-metadata-table th {
padding: 0;
padding-right: 3rem;
}

.ProseMirror img.ProseMirror-selectednode {
outline: 3px solid #68cef8;
}

/* image resizer styling */
.image-small, .drawing-small {
max-width: 200px;
}
.image-medium, .drawing-medium {
max-width: 500px;
}
.image-large, .drawing-large {
max-width: 100%;
}
.image-float-none, .drawing-float-none {
float: none;
}
.image-float-left, .drawing-float-left {
float: left;
}
.image-float-right, .drawing-float-right {
float: right;
}

.bubble-menu {
display: flex;
background-color: #0d0d0d;
padding: 0.2rem;
border-radius: 0.5rem;
}

.container {
min-height: 100vh;
padding: 0 0.5rem;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
}

.main {
padding: 5rem 0;
flex: 1;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
}

.footer {
width: 100%;
height: 100px;
border-top: 1px solid #eaeaea;
display: flex;
justify-content: center;
align-items: center;
}

.footer img {
margin-left: 0.5rem;
}

.footer a {
display: flex;
justify-content: center;
align-items: center;
}

.title a {
color: #0070f3;
text-decoration: none;
}

.title a:hover,
.title a:active {
text-decoration: underline;
}

.title {
margin: 0;
line-height: 1.15;
font-size: 4rem;
}

.title,
.description {
text-align: center;
}

.description {
line-height: 1.5;
font-size: 1.5rem;
}

.code {
background: #fafafa;
border-radius: 5px;
padding: 0.75rem;
font-size: 1.1rem;
font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace;
}

.grid {
display: flex;
align-items: center;
justify-content: center;
flex-wrap: wrap;

max-width: 800px;
margin-top: 3rem;
}

.card {
margin: 1rem;
flex-basis: 45%;
padding: 1.5rem;
text-align: left;
color: inherit;
text-decoration: none;
border: 1px solid #eaeaea;
border-radius: 10px;
transition: color 0.15s ease, border-color 0.15s ease;
}

.card:hover,
.card:active {
color: #0070f3;
border-color: #0070f3;
}

.card h3 {
margin: 0 0 1rem 0;
font-size: 1.5rem;
}

.card p {
margin: 0;
font-size: 1.25rem;
line-height: 1.5;
}

.logo {
height: 1em;
}

@media (max-width: 600px) {
.grid {
    width: 100%;
    flex-direction: column;
}
}
  
</style>`

const htmlTemplate = (title, body, name, css) => {
    if (css){
        return(`<html><head><title>${title}</title><meta charset="utf-8">${CSS}</head><body><h1>${title}<h1/><h4>${name}</h4><br><hr>${body}</body></html>`)
    }
    return(
        `<html><head><meta charset="utf-8"></head><body><h1>${title}<h1/><h4>${name}</h4><br><hr>${body}</body></html>`
)} 




export default async function handle(req, res) {
    const { param } = req.query
    const session = await getSession({ req });
    if (param.length === 3){
        if (param[1] === "export"){
            const noteId = param[0]
            const note = await getNoteByID(noteId)
            const title = note.title
            const body = generateHTML(note.body, [StarterKit, Drawing(), TipTapCustomImage(null)])
            if (param[2] === "md"){
                const html = htmlTemplate(title, body, note.user.name, false)
                const turndownService = new TurndownService()
                const markdown = turndownService.turndown(html)
                res.status(200).json({text: markdown})

            } else if (param[2] === "html"){
                let html = htmlTemplate(title, body, note.user.name, true)
                html = "<!doctype html>" + html
                res.status(200).json({text: html})
                
            } else if (param[2] === "pdf") {
                const html = htmlTemplate(title, body, note.user.name, false)
                const turndownService = new TurndownService()
                const markdown = turndownService.turndown(html)
                const pdf = await mdToPdf({content: markdown})
                const json = pdf.content.toJSON()
                res.status(200).json({
                    text: json.data
                })
            }else {
                return res.status(501).json({ message: `` });
            }
        } else{
            return res.status(501).json({ message: `/api/note/${param.join('/')} is not implemented` });
        }
    }
    else{
        return res.status(501).json({ message: `/api/note/${param.join('/')} is not implemented` });
    }
}