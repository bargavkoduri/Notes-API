const {Router} = require("express")
const router = Router()
const validationMiddleware = require("../validations/middlewares")
const notesController = require("../controllers/notes.controller")
const {checkValidToken} = require("../utils/jwt")

router.use(checkValidToken)
router.post("",validationMiddleware.noteValidator,notesController.createNote)
router.get("",notesController.getNotes)
router.get("/:id",notesController.getNote)
router.patch("/:id",validationMiddleware.updateNoteValidator,notesController.updateNote)
router.delete("/:id",notesController.deleteNote)

module.exports = router