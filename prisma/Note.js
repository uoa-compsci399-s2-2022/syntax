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

	const note = await getNoteByID(newNote.id);
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

	const note = await getNoteByID(newNote.id);
	return note;
};

export const getNoteByID = async (id) => {
	const note = await prisma.note.findUnique({
		where: {
			id
		},
		include: {
			user: true,
			group: true
		}
	});

	return JSON.parse(JSON.stringify(note));
};

export const getAllNotesBySearch = async (title, content, code, sort, id) => {

	const notes = await prisma.note.findRaw({
		filter: { 
		$and: 
		[{"userId": id}, 
		{$or: [
			{"title": {$regex: title, '$options' : 'i' }},
			{"body.content": { $elemMatch: { content: { $elemMatch: { "text": { $regex: content}}}}}},
			{"body.content": { $elemMatch: { "attrs.code_content": {$regex: code}}}}]
		}]},
		options: { projection: { "updatedAt": false }}
		})
		console.log(notes)
		return JSON.parse(JSON.stringify(notes))
};


export const getAllNotesByUserIdSearch = async (id) => {
	const notes = await prisma.note.findRaw({
		filter: {
		"userId": id,},
		options: {projection: {"updatedAt" : false}}
	})
	return JSON.parse(JSON.stringify(notes))
}

export const updateNote = async (id, updatedData, session) => {
	let userId = session?.user.id;
	const updatedNote = await prisma.note.update({
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
	const note = await getNoteByID(updatedNote.id);
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
