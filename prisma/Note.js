import { truncate } from "lodash";
import prisma from "./prisma";

// 
// note specific calls
// 

export const createNote = async (title, body, session) => {
	const newNote = await prisma.note.create({
		data: {
			title,
			body,
			user: {
				connect: {
					email: session?.user?.email
				}
			},
			group: {
				connectOrCreate: {
					where: {
						default: session?.user?.id,
					},
					create: {
						name: 'Notes',
						color: '#FFFFFF',
						default: session?.user?.id,
						user: {
							connect: {
								email: session?.user?.email
							}
						},
					},
				},
			},
		},
	});

	const note = await getNoteByID(newNote.id, session);
	return note;
};

export const createNoteInGroup = async (title, body, groupId, session) => {
	const newNote = await prisma.note.create({
		data: {
			title,
			body,
			user: {
				connect: {
					email: session?.user?.email
				}
			},
			group: {
				connect: {
					id: groupId
				}
			},
		},
	});

	const note = await getNoteByID(newNote.id, session);
	return note;
};

export const getNoteByID = async (id, session) => {
	let userId = session?.user.id;
	const note = await prisma.note.findUnique({
		where: {
			id: id
		},
		include: {
			user: true,
			group: true,
			room: true
		}
	});

	return JSON.parse(JSON.stringify(note));
};

export const getAllNotesBySearch = async (sq, active, sortingField, id) => {
	var queryBase = {
		titleChecked: { "title": { $regex: sq, '$options': 'i' } },
		contentChecked: { "body.content": { $elemMatch: { content: { $elemMatch: { "text": { $regex: sq, '$options': 'i' } } } } } },
		codeChecked: { "body.content": { $elemMatch: { "attrs.code_content": { $regex: sq, '$options': 'i'  } } } },
	}
	const queries = [active.map(i=>queryBase[i])]; 
	const notes = await prisma.note.findRaw({
		filter: {
			$and:
				[{ "userId": id },
				{
					$or: {...queries}[0]
				}]
		},
		options: { sort: sortingField }
	})
	return JSON.parse(JSON.stringify(notes))
};


export const getAllNotesByUserIdSearch = async (id) => {
	const notes = await prisma.note.findRaw({
		filter: {
			"userId": id,
		},
		options: { projection: { "updatedAt": false } }
	})
	return JSON.parse(JSON.stringify(notes))
}

export const updateNote = async (id, updatedData, session) => {
	let userId = session?.user.id;
	const updatedNote = await prisma.note.update({
		where: {
			id: id
		},
		data: {
			...updatedData,
		}
	});
	const note = await getNoteByID(updatedNote.id, session);
	return note;
};


export const deleteNote = async (id, session) => {
	let userId = session?.user.id;
	const deletedNote = await prisma.note.delete({
		where: {
			id_userId: {
				id,
				userId
			}
		}
	});
	return deletedNote;
};


// 
// multi-note specific calls
// 

export const getAllNotesByUserID = async (id) => {
	const notes = await prisma.user.findMany({
		where: {
			id: id
		},
		select: {
			groups: {
				include: {
					notes: {
						include: {
							group: true,
							user: true,
							room: true
						}
					}
				}
			},
			rooms:{
				include: {
					note: {
						include: {
							group: true,
							user: true,
							room: true
						}
					}
				}
			}
		}
	});
	return JSON.parse(JSON.stringify(notes));
};

// 
// user specific calls
// 

export const changeProfilePicture = async (session) => {

};


// 
// group specific calls
// 

export const getGroupByID = async (id) => {
	const note = await prisma.group.findUnique({
		where: {
			id
		},
		include: {
			notes: true
		}
	});

	return JSON.parse(JSON.stringify(note));
};

export const createGroup = async (name, color, session) => {
	const newGroup = await prisma.group.create({
		data: {
			name,
			color,
			user: {
				connect: {
					email: session?.user?.email
				}
			}
		},
	});
	const group = await getGroupByID(newGroup.id);
	return group;
};

export const updateGroup = async (id, updatedData, session) => {
	let userId = session?.user.id;
	const updatedGroup = await prisma.group.update({
		where: {
			id_userId: {
				id,
				userId
			}
		},
		data: {
			...updatedData,
		}
	});
	const group = await getGroupByID(updatedGroup.id);
	return group;
};

export const deleteGroup = async (id, session) => {
	let userId = session?.user.id;
	const deletedGroup = await prisma.group.delete({
		where: {
			id_userId: {
				id,
				userId
			}
		}
	});
	return deletedGroup;
};

//
// room specific calls
// 

export const createRoom = async (noteId, YDOC, session) => {
	const newRoom = await prisma.group.create({
		data: {
			noteId,
			color,
			note: {
				connect: {
					id: noteId
				}
			},
			YDOC,
			user: {
				connect: {
					email: session?.user?.email
				}
			},
			userIds: {
				push: session?.user.id
			}
		},
	});
	return newRoom;
};

export const addUser = async (email, roomId, session) => {
	const users = await prisma.User.update({
		where: {
			email: email
		},
		data: {
			rooms: {
				connect: {
					id: roomId
				}
			}
		},
	})
}

export const deleteUser = async(email, roomId, session) => {
	await prisma.User.update({
		where: {
			email: email
		},
		data: {
			rooms: {
				disconnect: {
					id: roomId
				}
			}
		},
	})
}

export const getSharedUsers = async (roomId) => {
	console.log(roomId);
	const users = await prisma.room.findUnique({
		where: {
			id: roomId
		},
		include: {
			user: true
		}
	})
	return JSON.parse(JSON.stringify(users));
}
