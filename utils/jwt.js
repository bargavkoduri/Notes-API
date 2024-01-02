const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants");

const generateToken = (data) => {
  const expiresIn = 24 * 60 * 60;
  return jwt.sign(data, JWT_SECRET, { expiresIn });
};

const checkValidToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // unauthorized
  if (token === null) {
    res.status(401).json({
      status: false,
      errors: [
        {
          message: "You need to sign in to proceed.",
          code: "NOT_SIGNEDIN",
        },
      ],
    });
  } else {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      // forbidden
      if (err) {
        res.status(403).json({
          status: false,
          errors: [
            {
              message: "Invalid Token or Token expired.",
              code: "INAVLID_TOKEN",
            },
          ],
        });
      } else {
        // If valid jwt token sets a new field in request object as user and decrypted jwt token.
        req.user = user;
        next();
      }
    });
  }
};

module.exports = { checkValidToken, generateToken };