/*
 * Marrow.js - 0.0.20 
 * Description : Marrow is constructor that extends your constructors to help emit events and create a conventions to help manage components 
 * Project Url : https://github.com/jacoblwe20/marrow 
 * Author : Jacob Lowe <http://jacoblowe.me> 
 * License : MIT 
 */

(function(exports){

	// Marrow Constructor
	// the first argument in the component which is just a function
	// that acts as the initial constructor function for the component.
	// the second argument is a callback function that you can pass in
	// another callback function where the first argument is the `this`
	// prototype of Marrow. returns the first prameter with an extended
	// prototype

	var Marrow = function ( component, extend ) { 
		if ( !( this instanceof Marrow ) ) {
			return new Marrow( component, extend );
		}
		
		if ( typeof extend === 'function' ) {
			extend( this );
		}

		if ( typeof extend === 'object' ) {
			this.merge( this, extend );
		}

		var Construct = function Construct( ){
				this._init();
				return component.apply( this, arguments );
			};		

		// preserve constructor
		this.constructor = component;

		// extend component 
		Construct.prototype = component.prototype;
		Construct._name = component.name;
		this.merge( Construct.prototype, this );		

		return Construct;
	};

	// data store object
	Marrow.DS = {};

	Marrow.prototype._init = function ( ) {
		this.emit('initialize');
		this._store( );
		if ( 'tasker' in this ) {
			this.tasker( 'initialize', this );
		}
	};

	Marrow.prototype._store = function ( ) {
		if( !( Marrow.DS[this.constructor.name] ) ){
			Marrow.DS[this.constructor.name] = [];
		}
		var store = Marrow.DS[this.constructor.name];
		store.push( this );			
		this.ts = +new Date() + store.length;
	};

	// Marrow::merge will merge two objects together the merge is
	// not recursive and is only applied to the first level of the 
	// objects. The first parameter is the object to merg into and
	// the rest of the parameters are the objects to merge into
	// the first obj.

	Marrow.prototype.merge = function ( ) {
		var obj = arguments[ 0 ];
		if ( typeof obj === 'object' ) {
			for ( var i = 0; i <= arguments.length - 1; i += 1 ) {
				var _obj =  arguments[ i ];
				if ( typeof _obj === 'object' ) {
					for ( var _key in _obj ) {
						obj[ _key ] = _obj[ _key ];
					}
				}
			}
			return obj;
		}
	};

	// Marrow::getState returns the state of the component

	Marrow.prototype.getState = function () {
		return this.__state;
	};

	// Marrow::setState first parameter gets set as value of the 
	// __state which is return in getState. Need to be a Number
	// if not it will be evaluated as NaN

	Marrow.prototype.setState = function( value ){
		this.__state = +value; // + with evaluate this value a interger
	};

	exports.Marrow = Marrow;

}(this));

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

		// subscribing to another objects events
		if( typeof event === 'object' ){
			this._objBind( event, callback, arguments[2]);
			return null;		
		}

		if( typeof event === 'function' ){
			this._contructorBind( event, callback, arguments[2] );
			return null;		
		}

		if(
			typeof callback === "function" &&
			typeof event === "string"
		){

			var 
			events = parseEventString(event),
			// only support two layer events
			e = ( events.length > 1 ) ? events[ 0 ] + ":" + events[ 1 ]  : events[ 0 ];


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

	// Marrow::once is a way to bind to an event once. see on for more
	// details on event binding

	Marrow.prototype.once = function ( event, callback ) {
		var 
		_this = this,
		handle = function ( ) {
			callback.apply( _this, arguments );
			_this.off( event, handle );
			_this.off( event, callback );
		};
		this.on( event, handle );
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

		if( typeof event === 'object' ){
			event = this._objUnbind( event, fn, arguments[2] );
			return null;
		}


		if(
			typeof this._events === "object" &&
			typeof event === "string" &&
			typeof this._events[ event ] === "object" && 
			this._events[ event ].length
		){

			var events = this._events[ event ];


			if( typeof fn === "function" ){

				for( var i = 0; i < events.length; i += 1 ){

					if( '' + events[i] === '' + fn ){ 
						this._events[ event ][ i ] = null; // remove specific fn
					}

				}

			}else{
				this._events[ event ] = []; // remove all events in group
			}

		} else {
			if( 
				typeof event === 'undefined' &&
				typeof fn === 'undefined' 
			) {
				this._events = {}; // remove all
			}
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

				e = ( i ) ? events[ 0 ] + ":" + events[ i ] : events[ i ];	

				if(
					typeof this._events[ e ] === "object" && 
					this._events[ e ].length
				){

					for( var q = 0; q < this._events[ e ].length; q += 1 ){
						var payload = ( !( i ) && events.length > 1 ) ?
							arg : 
							arg.slice( 1 ); 

						if( this._events[ e ][ q ] ){
							this._events[ e ][ q ].apply( this, payload );
						} 
					}

				}

			}

			// if an all event binding is made emit event to it
	
		}

	};

	// Marrow._objBind binds to another object on event

	Marrow.prototype._objBind = function ( obj, event, fn ) {
		if ( 
			!obj && 
			typeof obj.on !== 'function' &&
			typeof event !== 'string' &&
			typeof fn !== 'function'
		) {
			// bad
			return null;
		} 
		obj.on( event, fn );
		
	};

	// Marrow._objBind removes binding

	Marrow.prototype._objUnbind = function ( obj, event, fn ) {
		if ( 
			!obj && 
			typeof obj.off !== 'function' &&
			typeof event !== 'string'
		) {
			// bad
			return null;
		} 
		obj.off( event, fn );
	};

	// Marrow._instanceBind binds events to an instance using task

	Marrow.prototype._contructorBind = function ( instance, event, fn ) {
		if (
			typeof instance !== 'function' ||
			typeof event !== 'string' ||
			typeof fn !== 'function' ||
			!( 'registerTask' in this )
		){
			// bad
			return null;
		}

		var constructor = instance._name;

		this.registerTask( '_contructorBind', 
			function ( _this ) {
				if ( _this && typeof _this.on === 'function' ) {
					_this.on( event, fn );
				}
			}, {
				instance : constructor,
				// this is when we want to bind to the instance
				event : 'initialize'
			}
		);

		//need a method to look up already created
		//instances especially for un binding events
	};

}(Marrow));

(function(Marrow){

	// Marrow::_extend creates a method in the prototype of the
	// object, the first parameter is type (String), which defines the name
	// of the method and allows binding to events on the method.
	// Second argument is state which is the state that gets set 
	// when the method is called, this needs to be a number. The 
	// third argument is the stored value that allows a kinda mapping
	// to the function that is going to be called, this also is a String.	
	// eg. ::to("die", function(){ele.remove()})
	// now you can bind to ::on("die")

	Marrow.prototype.__extend = function(type, state, store){
		var self = this;
		this[ type ] = function(){
			if( typeof this[ store ] === "function" ){
				self[ store ].apply( this, arguments );
			}

			if( typeof state === "number" ){
				self.__state = state;
			}

			var arr = [].concat(type, Array.prototype.slice.call(arguments));

			self.emit.apply( this, arr );
		};
	};

	// Marrow::to creates a method that will auto fire off an event 
	// with the same name.  The first parameter is type 
	// which is the name of the method and the name of the event
	// to bind to, this is a String. The second argument is a function
	// that you would want to excute when the newly created method is
	// called. The third state parameter is state which is a Number...
	// the number of the state you want you component to go into once the
	// method is called 

	Marrow.prototype.to = function( type, fn, state ){
		if(
			typeof type === "string" &&
			typeof fn === "function"
		){
			var store = "__" + type; // a `private` variable name
			this[ store ] = fn;
			this.__extend( type, state, store );
		}

	};

}(Marrow));

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