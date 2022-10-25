// pages/api/note.js

import {
	createNote,
	updateNote,
	deleteNote,
	createNoteInGroup
} from "../../prisma/Note";
import { getSession } from "next-auth/react";
import rateLimit from "../../utils/rate-limit";

const limiter = rateLimit({
	interval: 1000, //resets token every second
	uniqueTokenPerInterval: 500 //500 unique users per call
});

export default async function handle(req, res) {
	const session = await getSession({ req });
	if (session) {
		try {
			await limiter.check(res, 2, "CACHE_TOKEN"); //2 requests per second is the limit
		} catch {
			return res.status(429).json({ error: "Rate limit exceeded" });
		}
		if (req.method == "POST") {
			const { title, body, groupId } = req.body;
			console.log("POST", groupId);
			if (groupId) {
				const note = await createNoteInGroup(title, body, groupId, session);
				return res.json(note);
			}
			const note = await createNote(title, body, session);
			return res.json(note);
		} else if (req.method == "PUT") {
			const { id, title, body, groupId, YDOC } = req.body;
			console.log(req.body);

			// const updatedData = {title, body}
			// Update current note
			// also pass the session which would be use to get the user information
			if (id == undefined) {
				const note = await createNote(title, body, session);
				return res.json(note);
			}

			const note = await updateNote(
				id,
				{ title, body, groupId, YDOC },
				session
			);
			return res.json(note);
		} else if (req.method == "DELETE") {
			const id = req.body;
			const note = await deleteNote(id, session);
			return res.json(note);
		} else {
			return res.status(405).json({ message: "Method not allowed" });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized access" });
	}
}
