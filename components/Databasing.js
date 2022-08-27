export async function createNote(note) {
    console.log(note)
    let res = await fetch("/api/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: note,
    });
    console.log(res)
    const message = await res.json();
    console.log("Created note", { message });
}