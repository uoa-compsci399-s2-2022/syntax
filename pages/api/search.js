import { getAllNotesBySearch, getAllNotesByUserIdSearch } from "../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    const session = await getSession({ req });
    var title = undefined
    var content = undefined
    var code = undefined
    var sort = req.headers.selectedsort
    console.log(sort)

    if (req.method == "POST") {
        if (req.headers.titlechecked == 'true') {
            title = req.body
        }
        if (req.headers.contentchecked == 'true') {
            content = req.body
        }
        if (req.headers.codechecked == 'true') {
            code = req.body
        }
        const note = await getAllNotesBySearch(title, content, code, sort, session?.user?.id)
        return res.json(note)
    }
}