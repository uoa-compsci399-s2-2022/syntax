import { addUser, deleteUser, getSharedUsers } from "../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    const session = await getSession({ req });
    if (req.method == "POST") {
        const { email, id } = req.body;
        await addUser(email, id, session)
    }
    if (req.method == "DELETE") {
        const { email, id } = req.body;
        await deleteUser(email, id, session)
    }
    if (req.method == 'PUT') {
        const { id } = req.body;
        const users = await getSharedUsers(id)
        return res.json(users);
    }
}