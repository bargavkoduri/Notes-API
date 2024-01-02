const Admin = require("../models/admin.model")
const {generateToken} = require("../utils/jwt")

exports.login = async(req,res) => {
    try {
        let admin = await Admin.findOne({
            email: req.body.email,
            password: req.body.password
        })
        if(!admin)
            throw new Error("No user found")
        res.status(200).json({
            status: true,
            access_token: generateToken({email: req.body.email})
        })
    } catch(err) {
        if(err.message = "No user found"){
            res.status(400).json({
                status: false,
                errors: {
                    msg : "Invalid login credentials"
                }
            })
        }
        else {
            res.status(500).json({
                status: false,
            });
        }
    }
}