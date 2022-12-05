
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  name: String, // String is shorthand for {type: String}
});


const fileShareUser = mongoose.model("User", userSchema);

module.exports = fileShareUser;