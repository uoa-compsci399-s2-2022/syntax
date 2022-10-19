import {
	Modal,
	Input,
	Button,
	Dropdown,
	Container,
	Row,
	useTheme
} from "@nextui-org/react";
import { throttle } from "lodash";
import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes
} from "../../modules/AppContext";
import { useRouter } from "next/router";
import Link from "next/link";


const SearchModal = ({ open, closeHandler }) => {
	const { checked, type } = useTheme();
	const sortOptions = {
		"Title (ascending)": {
		  "title": 1
		},
		"Title (descending)": {
		  "title": -1
		},
		"Last Modified (ascending)": {
		  "updatedAt": 1
		},
		"Last Modified (descending)": {
		  "updatedAt": -1
		},
		"Created (ascending)": {
		  "createdAt": 1
		},
		"Created (descending)": {
		  "createdAt": -1
		}
	 };
	const [selectedSort, setSelectedSort] = useState("Title (ascending)");
	const [titleChecked, setTitleChecked] = useState(true);
	const [contentChecked, setContentChecked] = useState(false);
	const [codeChecked, setCodeChecked] = useState(false);
	const [sq, setSQ] = useState('')
	const [returnedNotes, setNotes] = useState([])
	const setCurrentNote = useDispatchNote();
	const router = useRouter();
	const throttledSearch = useRef(
		throttle(async (searchtype, sorting, sq) => {
			if (sq) Search(searchtype, sorting, sq);
			else{
				setNotes([]);
			}
		}, 1000)
	).current;
	
	const triggerSearch = (psq) =>{
		throttledSearch({ titleChecked, contentChecked, codeChecked }, selectedSort, psq);
	}

	const Search = async (searchtype, sorting, sq) => {
		const sortingField = sortOptions[sorting];
		let res = await fetch("/api/search", {
			method: "POST",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify({searchtype, sortingField, "sq":sq})
		});
		const notes = await res.json()
		setNotes(notes)
	};


	return (
		<Modal
			blur
			scroll
			closeButton
			open={open}
			onClose={closeHandler}
			width="600px"
			css={{ margin: "10px" }}
		>
			<Modal.Header
				css={{
					flexDirection: "column",
					alignItems: "flex-start",
					gap: "16px",
					borderBottom: "1px solid $border",
					marginTop: "16px",
					paddingBottom: "16px"
				}}
			>
				<Input
					clearable
					aria-label="Advanced Search Bar"
					placeholder="Search notes..."
					onChange={(e) => { 
						setSQ(e.target.value);
						triggerSearch(e.target.value);
					}}
					type="search"
					animated={false}
					contentLeft={
						<MagnifyingGlassIcon style={{ height: "var(--icon-size)" }} />
					}
					css={{ width: "100%", $$inputColor: type === "dark" ? "var(--nextui-colors-background)" : "var(--nextui-colors-accents0)" }}
				/>
				<Container
					display="flex"
					wrap="nowrap"
					css={{ padding: "0", gap: "10px" }}
				>
					<Button
						auto
						onPress={() => setTitleChecked(prevTitleChecked => !prevTitleChecked)}
						css={{
							background: titleChecked ? "$accents4" : "transparent",
							color: "$textSecondary",
							border: "2px solid $accents4"
						}}
					>
						Title
					</Button>
					<Button
						auto
						onPress={() => setContentChecked(prevContentChecked => !prevContentChecked)}
						css={{
							background: contentChecked ? "$accents4" : "transparent",
							color: "$textSecondary",
							border: "2px solid $accents4"
						}}
					>
						Content
					</Button>
					<Button
						auto
						onPress={() => setCodeChecked(prevCodeChecked => !prevCodeChecked)}
						css={{
							background: codeChecked ? "$accents4" : "transparent",
							color: "$textSecondary",
							border: "2px solid $accents4"
						}}
					>
						Code
					</Button>
				</Container>
			</Modal.Header>
			<Modal.Body>
				{returnedNotes.length > 0 ? (
					<>
						<Dropdown>
							<Dropdown.Button
								light
								animated="false"
								css={{
									paddingLeft: "10px",
									margin: "0",
									width: "min-content",
									minHeight: "36px"
								}}
							>
								{selectedSort}
							</Dropdown.Button>
							<Dropdown.Menu
								aria-label="Sort Options"
								onAction={(key) => {
									setSelectedSort(key);
									triggerSearch(sq);
								}}
							>
								{Object.entries(sortOptions).map(([k, v]) => (
									<Dropdown.Item key={k} value={k}>
										{k}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>

						<Container css={{ padding: "0" }}>

							{returnedNotes.map((note, index) => (
								<Link href={`/note/${encodeURIComponent(note._id.$oid)}`}>
									<Container
										key={index}
										css={{
											padding: "10px",
											borderRadius: "12px",
											"&:hover": {
												background: "$accents4"
											}
										}}
									>
										<Row>{note.title}</Row>
										<Row css={{ color: "$accents6" }}>{note.updatedAt}</Row>
									</Container>
								</Link>
							))}
						</Container>

					</>
				) : (
					<Container display="flex" justify="center">
						No results
					</Container>
				)}
			</Modal.Body>
			<Modal.Footer></Modal.Footer>
		</Modal>
	);
};

export default SearchModal;
