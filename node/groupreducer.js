// 
// 
//  just testing the group reducer function to turn our notes into grouped objects
// 
var notes = [{
	"id": "63105bab77781cdfbe40a3ec",
	"title": "Serial Test",
	"body": {
		"type": "doc",
		"content": [{
			"type": "heading",
			"attrs": {
				"level": 1
			},
			"content": [{
				"type": "text",
				"text": "i have edited this header"
			}]
		},
		{
			"type": "paragraph",
			"content": [{
				"type": "text",
				"marks": [{
					"type": "italic"
				}],
				"text": "this is italicswwe"
			}]
		},
		{
			"type": "paragraph",
			"content": [{
				"type": "text",
				"text": "i have changed the "
			}]
		},
		{
			"type": "code_block",
			"attrs": {
				"code_content": "prwewewqweeint(12sdqwe3)qwe\nsdsadasd\nasd",
				"code_output": "123",
				"language": "python3"
			}
		}
		]
	},
	"createdAt": "2022-09-01T07:13:47.748Z",
	"updatedAt": "2022-09-20T11:12:39.274Z",
	"userId": "62fcac1dfcffb8a6fac487e9",
	"groupId": "632932d036b55d0d3d87e459",
	"group": {
		"id": "632932d036b55d0d3d87e459",
		"name": "Test note",
		"color": "Notes",
		"userId": "Notes"
	}
},
{
	"id": "63206f78c55a98dd5c08eb9f",
	"title": "Untitled Note",
	"body": {
		"type": "doc",
		"content": [{
			"type": "paragraph",
			"content": [{
				"type": "text",
				"text": "werwerw"
			}]
		},
		{
			"type": "code_block",
			"attrs": {
				"code_content": "function name(params) {\n  asd\n}",
				"code_output": "4",
				"language": "javascript-node"
			}
		},
		{
			"type": "paragraph",
			"content": [{
				"type": "text",
				"text": "ewr"
			}]
		},
		{
			"type": "code_block",
			"attrs": {
				"code_content": "print(123)",
				"code_output": "123",
				"language": "python3"
			}
		}
		]
	},
	"createdAt": "2022-09-13T11:54:32.745Z",
	"updatedAt": "2022-09-20T11:12:43.861Z",
	"userId": "62fcac1dfcffb8a6fac487e9",
	"groupId": "632932d036b55d0d3d87e459",
	"group": {
		"id": "632932d036b55d0d3d87e459",
		"name": "Test note",
		"color": "Notes",
		"userId": "Notes"
	}
},
{
	"id": "6329a9ec69ebd390b9c00755",
	"title": "Untitled Note",
	"body": {
		"type": "doc",
		"content": [{
			"type": "paragraph",
			"content": [{
				"type": "text",
				"text": "Start typing here..."
			}]
		}]
	},
	"createdAt": "2022-09-20T11:54:20.806Z",
	"updatedAt": "2022-09-20T11:54:20.807Z",
	"userId": "62fcac1dfcffb8a6fac487e9",
	"groupId": "Notes",
	"group": {}
}
];

function groupBy(arr) {
	return arr.reduce(function (memo, x) {
		!(x.groupId in memo) && (memo[x.groupId] = x.group);
		!(memo[x.groupId].notes) && (memo[x.groupId].notes = []);
		delete x.group;
		memo[x.groupId].notes.push(x);
		return memo;
	}, {});
};

console.log(groupBy(notes));
