import { getAllNotesBySearch, getAllNotesByUserIdSearch } from "../../prisma/Note";
import { getSession } from "next-auth/react";
import rateLimit from "../../utils/rate-limit"

const limiter = rateLimit({
	interval: 60 * 1000,
	uniqueTokenPerInterval: 500
})

export default async function handle(req, res) {
    const session = await getSession({ req });
    if (session) {
        try{
			await limiter.check(res, 100, 'CACHE_TOKEN')
		} catch {
            res.status(429).json({error: "Rate limit exceeded"})
		}
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
        } else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } else {
        return res.status(401).json({message: "Unauthorized access"})
    }
}