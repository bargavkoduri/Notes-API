const Validator = require("validatorjs");
const {note,updateNote} = require("./validations.rules.json")

const populateArr = (errors) => {
  let errorsArr = [];
  for (error in errors) {
    let obj = {
      param: error,
      message: errors[error][0],
      code: "INVALID_INPUT",
    };
    errorsArr.push(obj);
  }
  return errorsArr;
};

exports.noteValidator = (req, res, next) => {
    let validation = new Validator(req.body,note);
    if (validation.passes()) {
    next();
    } else {
    let { errors } = validation.errors;
    errors = populateArr(errors);
    res.status(400).json({
        status: false,
        errors,
    });
    }
};

exports.updateNoteValidator = (req, res, next) => {
  let validation = new Validator(req.body,updateNote);
  if (validation.passes()) {
    next();
  } else {
    let { errors } = validation.errors;
    errors = populateArr(errors);
    res.status(400).json({
      status: false,
      errors,
    });
  }
};