/*
 * Marrow.js - 0.0.9 
 * Description : Marrow is constructor that extends your constructors to help emit events and create a conventions to help manage components 
 * Project Url : https://github.com/jacoblwe20/marrow 
 * Author : Jacob Lowe <http://jacoblowe.me> 
 * License : MIT 
 */

(function(exports){

	var Marrow = function(component, fn){ 
		if(!(this instanceof Marrow)){
			return new Marrow(component);
		}

		// return it extended with our goodness
		if(typeof fn === "function"){
			fn(this);
		}
		// extend component 
		component.prototype = this;
		

		return component;
	};

	Marrow.prototype = Marrow.plus = {};

	// maybe make a more verbose state, also more conventional
	Marrow.prototype.getState = function(){
		return this.__state;
	};

	exports.Marrow = Marrow;

}(this));

(function(Marrow){

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

	Marrow.prototype.off = function(event, fn){
		if(
			typeof this._events === "object" &&
			typeof event === "string" &&
			typeof this._events[event] === "object" && 
			this._events[event].length
		){

			var events = this._events[event];

			if(typeof fn === "function"){

				for(var i = 0; i < events.length; i += 1){

					if(events[i] === fn){ 
						delete events[i]; // remove specific fn
					}

				}

			}else{
				events = []; // remove all events in group
			}

		}else if(!event){
			this._events = {}; // remove all
		}

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

}(Marrow));

(function(Marrow){
	
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

}(Marrow));