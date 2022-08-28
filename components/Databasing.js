export async function createNote(text) {

    let note = {
        title: "Temporary title, link this later",
        body: text,
    };
    await fetch("/api/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
    });
    document.location.reload()
}