var Marrow = require('./src/core').Marrow,
	build = require('./src/build'),
	events = require('./src/events'),
	task = require('./src/task');

	// stiching everything together
	Marrow.prototype = Marrow.prototype.merge( 
		Marrow.prototype,
		events.prototype,
		build.prototype,
		task.prototype
	);

module.exports = Marrow;