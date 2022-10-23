import { createGroup, updateGroup, deleteGroup } from "../../prisma/Note";
import { getSession } from "next-auth/react";
import rateLimit from "../../utils/rate-limit"

const limiter = rateLimit({
	interval: 1000,
	uniqueTokenPerInterval: 500
})

export default async function handle(req, res) {

	const session = await getSession({ req });
	if (session) {
		try{
			await limiter.check(res, 2, 'CACHE_TOKEN')
		} catch {
			res.status(429).json({error: "Rate limit exceeded"})
		}
		if (req.method == "POST") {
			const { name, color } = req.body;
			console.log("POST")
			const note = await createGroup(name, color, session);
			return res.json(note);
		}
	   
		else if (req.method == "PUT") {
			const {id, name, color} = req.body;
	   
			const note = await updateGroup(id, { name, color }, session);
			return res.json(note);
		}
	   
		else if (req.method == "DELETE") {
			const id = req.body;
			const note = await deleteGroup(id, session);
			return res.json(note);
		}
		
		else {
			return res.status(405).json({ message: "Method not allowed" });
		}
	} else {
		return res.status(401).json({message: "Unauthorized access"})
	}	
 }