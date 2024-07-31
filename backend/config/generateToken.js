const jwt = require("jsonwebtoken")

const generateToken = (id) => {
    return jwt.sign({ id }, "HARSHA" , {
      expiresIn: "30d",
    });
}
module.exports = generateToken;