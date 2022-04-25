const router = require('express').Router();
const uid = require('uuid');
const util = require('util');
const fs = require('fs');



const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const readFile = () =>{
    return readFileAsync('./Develop/db/db.json', 'utf8')
};

const writeFile = data => {
    return writeFileAsync('./Develop/db/db.json', JSON.stringify(data))
};

router.get('/notes', (req,res)=>{
    getNotes().then((notes)=>{
        return res.json(notes);
    })

    .catch((err)=> res.status(500).json(err));
});

router.post('/notes', (req,res)=>{
    addNote(req.body)
    .then((note)=> res.json(note))
    .catch((err)=> res.status(500).json(err))
});

router.delete('/notes/:id',(req,res)=>{
    deleteNote(req.params.id)
    .then(()=> res.json({status: true}))
    .catch((err)=> res.status(500).json(err))
});

const getNotes = () => {
    return new Promise(function(resolve, reject)
    {
         readFile()
         .then((notes)=>{
            let notesArr =[];
    
              try {
               notesArr = [].concat(JSON.parse(notes));
             } catch (err) {
                notesArr = [];
             }
    
                resolve(notesArr);
            });

    });
}

const addNote = (note) => {
    return new Promise(function(resolve, reject)
    {
        if(!note.title || !note.text) {
            throw new Error('Must enter in a title and text');
        }

        const newNote = {id: uid.v4(), title: note.title, text: note.text};

        getNotes()
        .then ((notes)=> [...notes, newNote])
        .then((updatedNotes)=> {
            writeFile(updatedNotes);
            resolve(newNote);
        });

    });
}

function deleteNote(id) {
    return new Promise(function(resolve, reject)
    {
        getNotes()
        .then((notes)=> notes.filter((note)=> note.id !== id))
        .then ((filteredNotes)=>{
            writeFile(filteredNotes);
            resolve();
        });

    });
}

module.exports = router;