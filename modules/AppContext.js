const { createContext, useState, useContext, useReducer } = require("react");

// context data getter
const NoteStateContext = createContext();
const NotesStateContext = createContext();

// context data setter
const NoteDispatchContext = createContext();
const NotesDispatchContext = createContext();

// reducer function to modify state based on action types
const notesReducer = (state, action) => {
  // get the note object and the type of action by destructuring
  const { note, type } = action;

  // if "add"
  // return an array of the previous state and the note object
  if (type === "add") return [...state, note];

  // if "replace"
  // replace entire array with new value
  if (type === "replace") return note;

  // if "remove"
  // remove the note object in the previous state
  // that matches the title of the current note object
  if (type === "remove") {
    const noteIndex = state.findIndex((x) => x.title === note.title);

    // if no match, return the previous state
    if (noteIndex < 0) return state;

    // avoid mutating the original state, create a copy
    const stateUpdate = [...state];

    // then splice it out from the array
    stateUpdate.splice(noteIndex, 1);
    return stateUpdate;
  }

  if (type === "edit") {
    let noteIndex = state.findIndex((x) => x.id === note.id);
    console.log({ state, noteIndex, note });

    // if no match, return the previous state
    if (noteIndex < 0) return state;

    // update note at the defined index
    state[noteIndex] = note;
  }
  return state;
};

// NoteProvider, which will wrap the application
// providing all the nested state and dispatch context
export const NoteProvider = ({ children }) => {
  // useState for note, to get and set a single note
  const [note, setNote] = useState({});

  // use Reducer for notes, to get all notes
  // and add, edit or remove a note from the array
  const [notes, setNotes] = useReducer(notesReducer, []);

  return (
    <NoteDispatchContext.Provider value={setNote}>
      <NoteStateContext.Provider value={note}>
        <NotesDispatchContext.Provider value={setNotes}>
          <NotesStateContext.Provider value={notes}>{children}</NotesStateContext.Provider>
        </NotesDispatchContext.Provider>
      </NoteStateContext.Provider>
    </NoteDispatchContext.Provider>
  );
};

// export state contexts
export const useDispatchNote = () => useContext(NoteDispatchContext);
export const useNote = () => useContext(NoteStateContext);
export const useDispatchNotes = () => useContext(NotesDispatchContext);
export const useNotes = () => useContext(NotesStateContext);
