var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
	username: String,
	email: String,
	password: String,
	token: String,
	avatar: String,
	description: String,
	premiumStatus: Boolean,
});

module.exports = mongoose.model("users", userSchema);
