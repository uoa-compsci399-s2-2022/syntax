import { getNoteByID } from "../../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    const { param } = req.query
    if (param.length === 2){
        if (param[1] === "export"){
            const noteId = param[0]
            const note = await getNoteByID(noteId)
            let type = req.body
            res.status(200).json(note)
        }
    }
    else{
        return res.status(501).json({ message: `/api/note/${param.join('/')} is not implemented` });
    }
}