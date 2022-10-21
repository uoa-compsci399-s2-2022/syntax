// pages/api/note.js

import { createNote, updateNote, deleteNote, createNoteInGroup } from "../../prisma/Note";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {

  const session = await getSession({ req });
  if (session) {
    if (req.method == "POST") {
      const { title, body, groupId } = req.body;
      console.log("POST", groupId)
     if(groupId){
      const note = await createNoteInGroup(title, body, groupId, session);
        return res.json(note);
     }
      const note = await createNote(title, body, session);
      return res.json(note);
    }
  
    else if (req.method == "PUT") {
      const { id, title, body, groupId } = req.body;
      console.log(req.body);
  
      // const updatedData = {title, body}
      // Update current note
      // also pass the session which would be use to get the user information
    if(id==undefined){
      const note = await createNote(title, body, session);
      return res.json(note);
    }
  
  
      const note = await updateNote(id, { title, body, groupId }, session);
      return res.json(note);
    }
  
    else if (req.method == "DELETE") {
      const id = req.body;
      const note = await deleteNote(id, session);
      return res.json(note);
    }
    
    else{
      return res.status(405).json({ message: "Method not allowed" });
    }
  } else {
    return res.status(401).json({message: "Unauthorized access"})
  }
}
