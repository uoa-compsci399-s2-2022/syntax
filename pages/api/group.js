// pages/api/group.js

import { createGroup } from "../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {

  const session = await getSession({ req });
  if (req.method == "POST") {
    const { name, color } = req.body;
    const group = await createGroup(name, color, session);
    return res.json(group);
  }
}
