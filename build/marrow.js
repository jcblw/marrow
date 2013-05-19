/*
 * Marrow.js - 0.0.4 
 * Author : Jacob Lowe <http://jacoblowe.me> 
 */

(function(exports){

	var Marrow = function(component, fn){
		if(
			!(this instanceof Marrow)
		){
			return new Marrow(component);
		}
		// extend component
		component.prototype = Marrow.prototype;
		// return it extended with our goodness
		if(typeof fn === "function"){
			fn(component);
		}

		return component;
	};

	Marrow.prototype = Marrow.module = {};

	//event emmiter

	Marrow.prototype._events = {};

	Marrow.prototype.on = function(event, callback){

		if(
			typeof callback === "function" &&
			typeof event === "string"
		){
			if(typeof this._events[event] !== "object"){
				this._events[event] = [];
			}

			if(
				typeof this._events[event].length === "number"
			){
				this._events[event].push(callback);
			}
		}


		return this;

	};

	Marrow.prototype.emit = function(event, evntObj){

		if(
			typeof event === "string" &&
			typeof this._events[event] === "object" && 
			this._events[event].length
		){

			var arg = [].slice.call(arguments);

			for(var i = 0; i < this._events[event].length; i += 1){
				this._events[event][i].apply(null, arg.slice(1));
			}
		}

	};

	// small utitlity to

	Marrow.prototype.__setFn = Marrow.__setFn = function(key, fn){
		if(typeof func === "function"){
			this[key] = func;
		}
	};

	// create an method that triggers an event
	// eg. ::to("die", function(){ele.remove()})
	// now you can bind to ::on("die")

	Marrow.prototype.to = function(type, fn, state){
		if(
			typeof type === "string" &&
			typeof fn === "function"
		){
			var store = "__" + type; // a `private` variable name
			this.__setFn(store, fn);

			this[type] = function(){
				if(typeof this[store] === "function"){
					this[store]();
				}

				//some small backward compatibility <<remove
				if(type === "open"){
					this.__state = 1;
				}else if(type === "close"){
					this.__state = 0;
				}

				if(typeof state === "number" || state){
					this.__state = state;
				}

				this.emit(type);
			};
		}

	};

	// maybe make a more verbose state, also more conventional
	Marrow.prototype.getState = function(){
		return this.__state;
	};

	// compile to a web component when available
	exports.Marrow = Marrow;

}(this));