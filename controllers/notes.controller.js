const Note = require("../models/note.model")

exports.createNote = async(req,res) => {
    try {
        let newNote = new Note(req.body)
        newNote = await newNote.save()
        res.status(201).json({
            status: true,
            content: {
                data: newNote
            }
        })
    } catch(err){
        res.status(500).json({
        status: "false",
        });
    }
}

exports.getNotes = async(req,res) => {
    try {
        let page = parseInt(req.query.page) || 1
        const total = await Note.countDocuments()
        let notes = await Note.find({})
        .sort({createdAt: 1})
        .skip((page-1)*10)
        .limit(10)
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total,
                    pages: Math.ceil(total/10),
                    page
                },
                data: notes
            }
        })
    } catch(err) {
        res.status(500).json({
            status: "false",
        });
    }
}

exports.getNote = async(req,res) => {
    try {
        const {id} = req.params
        let note = await Note.findById(id)
        if(!note)
            throw new Error("Note doesn't exist")
        res.status(200).json({
            status: true,
            content: {
                data : note
            }
        })
    } catch(err) {
        if(err.message === "Note doesn't exist"){
            res.status(400).json({
                status: false,
                errors: {
                    msg : "No note found with given id"
                }
            })
        }
        else {
            res.status(500).json({
                status: "false",
            }); 
        }
    }
}

exports.updateNote = async(req,res) => {
    try {
        const {id} = req.params
        let note = await Note.findById(id)
        if(!note)
            throw new Error("Note doesn't exist")
        if(req.body.title)
            note.title = req.body.title
        if(req.body.content)
            note.content = req.body.content
        note = await note.save()
        res.status(200).json({
            status: true,
            content: {
                data: note
            }
        })
    } catch(err) {
        if (err.message === "Note doesn't exist") {
            res.status(400).json({
            status: false,
            errors: {
                msg: "No note found with given id",
            },
            });
        } else {
            res.status(500).json({
            status: "false",
            });
        }
    }
}

exports.deleteNote = async(req,res) => {
    try {
        let {id} = req.params
        let note = await Note.findByIdAndDelete(id)
        if(!note)
            throw new Error("Note doesn't exist")
        res.status(200).json({
            status: true
        })
    } catch(err) {
        if (err.message === "Note doesn't exist") {
            res.status(400).json({
            status: false,
            errors: {
                msg: "No note found with given id",
            },
            });
        } else {
            res.status(500).json({
            status: "false",
            });
        }
    }
}