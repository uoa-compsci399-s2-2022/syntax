import { addUser, deleteUser, getSharedUsers } from "../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    const session = await getSession({ req });
    if (req.method == "POST") {
        const { email, roomId, noteId, YDOC, } = req.body;
        const users = await addUser(email, roomId, noteId, YDOC, session)
		  return res.json(users);
    }
    if (req.method == "DELETE") {
        const { email, id } = req.body;
        const users = await deleteUser(email, id, session)
		  return res.json(users);
    }
    if (req.method == 'PUT') {
        const { id } = req.body;
        const users = await getSharedUsers(id)
        return res.json(users);
    }
}