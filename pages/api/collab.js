import { addUser, deleteUser, getSharedUsers } from "../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    const session = await getSession({ req });
    if (req.method == "POST") {
        const { email, roomId, noteId, YDOC, } = req.body;
        await addUser(email, roomId, noteId, YDOC, session)
		  return res.json([]);
    }
    if (req.method == "DELETE") {
        const { email, id } = req.body;
        await deleteUser(email, id, session)
		  return res.json([]);
    }
    if (req.method == 'PUT') {
        const { id } = req.body;
        const users = await getSharedUsers(id)
        return res.json(users);
    }
}