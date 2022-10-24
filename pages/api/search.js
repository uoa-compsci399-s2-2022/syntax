import { getAllNotesBySearch, getAllNotesByUserIdSearch } from "../../prisma/Note";
import { getSession } from "next-auth/react";
import rateLimit from "../../utils/rate-limit"

const limiter = rateLimit({
	interval: 1000, //resets token every second
	uniqueTokenPerInterval: 500 //500 unique users per call
})

export default async function handle(req, res) {
    const session = await getSession({ req });
    if (session) {
        try{
			await limiter.check(res, 5, 'CACHE_TOKEN') //5 requests per second is the limit
		} catch {
			res.status(429).json({error: "Rate limit exceeded"})
		}
        if (req.method == "POST") {
            var params = req.body;
            const identifiers = Object.keys(params.searchtype)
            const active = identifiers.filter(function(id) {
                return params.searchtype[id]
            })
            const note = await getAllNotesBySearch(req.body.sq, active, req.body.sortingField, session?.user?.id)
            return res.json(note)
        }
        else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } else {
        return res.status(401).json({message: "Unauthorized access"})
    }
}