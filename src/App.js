//This project is about markdown: Markdown is a way to write basic HTML by typing manually
//delete items from a list--we add trash icon before
//in import, we use {} to precisely target specific things from that file

import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"       //array in data.js file
import Split from "react-split"
import {nanoid} from "nanoid"       //a npm package

import "./style.css"

export default function App() {
    const [notes, setNotes] = React.useState(
        () => JSON.parse(localStorage.getItem("notes")) || []
    )

    //the below state is for id
    const [currentNoteId, setCurrentNoteId] = React.useState(
       
        (notes[0] && notes[0].id) || ""     //if notes[0] exists (contains id and text) then the initisial is notes[0].id (the id of the only note which is notes[0])
    )
   
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))    //set to server
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        // Put the most recently-modified note at the top

        //the other way-for loop
        // setNotes(oldNotes => {
        //     const newArray = []
        //     for(let i = 0; i < oldNotes.length; i++) {
        //         const oldNote = oldNotes[i]
        //         if(oldNote.id === currentNoteId) {
        //             newArray.unshift({ ...oldNote, body: text })
        //         } else {
        //             newArray.push(oldNote)
        //         }
        //     }
        //     return newArray
        // })


        //my way--map instead of for loop
        setNotes(oldNotes =>{
            const newArray = []
            oldNotes.map(item =>{
                if(item.id === currentNoteId) {
                    newArray.unshift({ ...item, body: text })
                }else{
                    newArray.push(item)
                }
            })
            return newArray
        })
    }
    
    function deleteNote(event, noteId) {
        event.stopPropagation()    //stopPropagation prevents further propagation of the current event in the capturing and bubbling phases.
        //it stops to fire

        // another way to delete items:
        // const tagInner = event.target.parentElement.parentElement.children[0].innerHTML
        // console.log(tagInner)
        // const newList = notes.filter ((item) => item.body !== tagInner)
        // setNotes(newList)       //update the state function

        //another way to delete items
        console.log("delete note", noteId)
        //we are filtering the items based on noteId
        //so the one that is deleted will not include in the setNotes--we can use for loop instead of 
        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }
    
    function findCurrentNote() {
        return notes.find(note => {         //The find() method returns the value of the first element that passes a test.
            return note.id === currentNoteId
        }) || notes[0]
    }
    

    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    handleRemoveItem={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
