(function(Marrow){

	var 
	// some local utilities
	delimiter = /\:/g,
	// simple function that splits apart event string into array
	// input a string get out an array
	parseEventString = function(str){
		if(typeof str === "string"){
			return str.split(delimiter);
		}
		return null;
	};

	// Marrow::__events creates the _events object ~ can probably
	// be phased out

	Marrow.prototype.__events = function(){
		this._events = {};
	};

	// Marrow::on is a way to bind to a event emitted by the object
	// The first parameter is a String that defined what event type
	// that you want to attach to. The second parameter is a function
	// that will be queued and executed once the evnt fires

	Marrow.prototype.on = function( event, callback ){

		if(
			typeof callback === "function" &&
			typeof event === "string"
		){

			var 
			events = parseEventString(event),
			// only support two layer events
			e = ( events.length > 1 ) ? events[ 0 ] + "_" + events[ 1 ]  : events[ 0 ];


			if( !this._events ){
				this.__events(); // create events object
			}

			if( typeof this._events[ e ] !== "object" ){
				this._events[ e ] = [];
			}

			if( typeof this._events[ e ].length === "number" ){
				this._events[ e ].push( callback );
			}
			
		}

		return this;
	};

	// Marrow::off is a way to remove a binding to an event that would
	// be attached with the on method. The first parameter is a String
	// with the name of the event you want to unbind from this is optional,
	// when omited all events will be unbound from object. The second parameter
	// is a funcion that is a referance to a function that was bound to an event
	// this will only remove that one binding. The second argument is also
	// optional and when omitted will then unbind and bindings to the specified
	// event in the first parameter

	Marrow.prototype.off = function( event, fn ){
		if(
			typeof this._events === "object" &&
			typeof event === "string" &&
			typeof this._events[ event ] === "object" && 
			this._events[ event ].length
		){

			var events = this._events[ event ];

			if( typeof fn === "function" ){

				for( var i = 0; i < events.length; i += 1 ){

					if( events[i] === fn ){ 
						delete events[ i ]; // remove specific fn
					}

				}

			}else{
				events = []; // remove all events in group
			}

		}else if( !event ){
			this._events = {}; // remove all
		}

	};

	// Marrow::emit is a way to fire off events to all the binding functions
	// The first parameter in emit is the event type as a String this is 
	// a referance used to bind the events to functions. Emit will also take
	// any other parameters passed into the emits method and will pass them to
	// the and event binds... only omiting the first parameter, the event type.
	// eg. obj.on("payload", function(payload){ /*Do stuff with payload*/});
	// obj.emit("payload", payload);

	Marrow.prototype.emit = function( event ){

		if(
			typeof this._events === "object" &&
			typeof event === "string"
		){

			var 
			events = parseEventString(event),
			e,
			arg = [].slice.call( arguments ); // copying argument so we can pass
			// though a chunk of them

			if( !this._events ){
				this.__events(); // create events object
			}

			for( var i = 0; i < events.length; i += 1 ){

				e = ( i ) ? events[ 0 ] + "_" + events[ i ]  : events[ i ];	

				if(
					typeof this._events[ e ] === "object" && 
					this._events[ e ].length
				){

					for( var q = 0; q < this._events[ e ].length; q += 1 ){
						this._events[ e ][ q ].apply( this, arg.slice( 1 ) ); 
					}

				}

			}
		}

	};

}(Marrow));