// pages/api/note.js

import { createNote, updateNote, deleteNote } from "../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  // Get the current session data with {user, email, id}
  const session = await getSession({ req });

  // Run if the request is a POST request
  if (req.method == "POST") {
    // Get note title & body from the request body
    const { title, body } = req.body;

    // Create a new note
    // also pass the session which would be use to get the user information
    const note = await createNote(title, body, session);

    // return created note
    return res.json(note);
  }

  // Run if the request is a PUT request
  else if (req.method == "PUT") {
    const { id, title, body } = req.body;
    console.log({ id, title, body });
    // const updatedData = {title, body}
    // Update current note
    // also pass the session which would be use to get the user information
    const note = await updateNote(id, { title, body }, session);

    // return updated note
    return res.json(note);
  }

  // Run if the request is a DELETE request
  else if (req.method == "DELETE") {
    const { id } = req.body;
    const note = await deleteNote(id, session);

    // return deleted note
    return res.json(note);
  }
}
