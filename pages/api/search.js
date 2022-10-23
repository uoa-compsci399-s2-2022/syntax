import { getAllNotesBySearch, getAllNotesByUserIdSearch } from "../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
	const session = await getSession({ req });

	if (req.method == "POST") {
		var params = req.body;
		const identifiers = Object.keys(params.searchtype)
		const active = identifiers.filter(function(id) {
			return params.searchtype[id]
		})
		const note = await getAllNotesBySearch(req.body.sq, active, req.body.sortingField, session?.user?.id)
		return res.json(note)
	}
}