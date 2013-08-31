( function ( Marrow ) {

	// builds out a task name
	Marrow.prototype._taskName = function ( task, options ) {
		var name = task;

		if ( options.event ) {
			name += ':_' + ( options.event || 'all' );
		}

		if ( options.instance ) {
			name += ':' + ( options.instance || '' );
		}
		// taskName:_position:instance

		return name;

	};

	// registers a task
	Marrow.prototype.registerTask = function ( task, fn, options ) {
		// needs better type testing

		if ( !Marrow.DS._tasks ) {
			Marrow.DS._tasks = {};
		}

		var 
		_task = {};

	
		_task.fn = fn;
		_task.options = options;

		Marrow.DS._tasks[ this._taskName( task, options ) ] = _task;

	};

	// checks for task registered under a certain name
	Marrow.prototype.tasker = function ( events, instance ) {

		if ( 
			typeof events !== 'string' ||
			typeof instance !== 'object' || 
			typeof instance.constructor !== 'function'
		) {
			if( 'console' in parent ) {
				// lets give a clue
				console.error( 'Could not run Marrow::tasker with the' +
					' arguments >' + events.toString() + 
					', ' + instance.toString()   
				);
			}
			return false;
		}

		var tasks = Marrow.DS._tasks,
			name = instance.constructor.name;

		for( var key in tasks ) {
			var value = tasks[ key ];
			if ( new RegExp( ':_' + events + ':' + name ).test( key ) ) {
				value.fn( instance );
			}
		}

		return true;
	};



 } ( Marrow ));