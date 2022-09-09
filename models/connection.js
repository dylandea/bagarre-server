var mongoose = require("mongoose");

var options = {
	connectTimeoutMS: 5000,
	useNewUrlParser: true,
	useUnifiedTopology: true,
};
mongoose.connect(
	"mongodb+srv://pinpon:aF7SpdLCIJkgOQcX@cluster0.vlvppit.mongodb.net/test",
	options,
	function (err) {
		if (err) {
			console.log(
				`error, failed to connect to the database because --> ${err}`
			);
		} else {
			console.info("*** Database connection : Success ***");
		}
	}
);
