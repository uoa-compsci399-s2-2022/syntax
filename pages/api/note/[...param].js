import { getNoteByID } from "../../../prisma/Note";
import { getSession } from "next-auth/react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { TipTapCustomImage } from "@/node/Image";
import { Drawing } from "@/node/Drawing";
import TurndownService from 'turndown';

const htmlTemplate = (title, body) => {
    return(
        `<!doctype html><html><head><title>${title}</title><meta charset="utf-8"></head><body>${body}</body></html>`
)} 




export default async function handle(req, res) {
    const { param } = req.query
    const session = await getSession({ req });
    if (param.length === 3){
        if (param[1] === "export"){
            const noteId = param[0]
            const note = await getNoteByID(noteId)
            let type = req.body
            let file
            const title = note.title
            const body = generateHTML(note.body, [StarterKit, Drawing(), TipTapCustomImage(null)])
            const html = htmlTemplate(title, body)

            if (param[2] === "md"){
                const turndownService = new TurndownService()
                const markdown = turndownService.turndown(html)
                res.status(200).json({text: markdown})

            } else if (param[2] === "html"){
                res.status(200).json({text: html})
                
            } else {
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