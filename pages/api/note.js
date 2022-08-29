// pages/api/note.js

import { createNote, updateNote, deleteNote } from "../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {

  const session = await getSession({ req });
  if (req.method == "POST") {
    const { title, body } = req.body;
    console.log("POST")
    const note = await createNote(title, body, session);
    return res.json(note);
  }

  else if (req.method == "PUT") {
    const { id, title, body } = req.body;

    // const updatedData = {title, body}
    // Update current note
    // also pass the session which would be use to get the user information

    console.log({ id, title, body });

    const note = await updateNote(id, { title, body }, session);
    return res.json(note);
  }

  else if (req.method == "DELETE") {
    const { id } = req.body;
    const note = await deleteNote(id, session);
    return res.json(note);
  }
}
