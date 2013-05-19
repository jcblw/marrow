/*
 * Marrow.js - 0.0.6 
 * Author : Jacob Lowe <http://jacoblowe.me> 
 */

(function(exports){

	var Marrow = function(component, fn){
		if(!(this instanceof Marrow)){
			return new Marrow(component);
		}
		// extend component sorry ie8
		if( Object.create && Object.getPrototypeOf ){
			component.prototype = Object.create(Object.getPrototypeOf(this));
		}
		// return it extended with our goodness
		if(typeof fn === "function"){
			fn(component);
		}

		return component;
	};

	Marrow.prototype = Marrow.plus = {};

	//event emmiter

	Marrow.prototype.__events = function(){
		this._events = {};
	};

	Marrow.prototype.on = function(event, callback){

		if(
			typeof callback === "function" &&
			typeof event === "string"
		){
			if(!this._events){
				this.__events(); // create events object
			}

			if(typeof this._events[event] !== "object"){
				this._events[event] = [];
			}

			if(typeof this._events[event].length === "number"){
				this._events[event].push(callback);
			}
		}


		return this;

	};

	Marrow.prototype.emit = function(event, evntObj){

		if(
			typeof this._events === "object" &&
			typeof event === "string" &&
			typeof this._events[event] === "object" && 
			this._events[event].length
		){

			var arg = [].slice.call(arguments); // copying argument so we can pass
			// though a chunk of them

			for(var i = 0; i < this._events[event].length; i += 1){
				this._events[event][i].apply(this, arg.slice(1)); 
			}
		}

	};

	// create an method that triggers an event
	// eg. ::to("die", function(){ele.remove()})
	// now you can bind to ::on("die")

	Marrow.prototype.__extend = function(type, state, store){
		var self = this;
		this[type] = function(){
			if(typeof this[store] === "function"){
				self[store].apply(this, arguments);
			}

			if(typeof state === "number"){
				self.__state = state;
			}

			self.emit(type);
		};
	};

	Marrow.prototype.to = function(type, fn, state){
		if(
			typeof type === "string" &&
			typeof fn === "function"
		){
			var store = "__" + type; // a `private` variable name
			this[store] = fn;
			this.__extend(type, state, store);
		}

	};

	// maybe make a more verbose state, also more conventional
	Marrow.prototype.getState = function(){
		return this.__state;
	};

	// compile to a web component when available
	exports.Marrow = Marrow;

}(this));