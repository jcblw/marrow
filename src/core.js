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
			if(!(typeof this._events[event] === "object")){
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

			for(var i = 0; i < this._events[event].length; i += 1){
				this._events[event][i](evntObj);
			}
		}

	};

	// small utitlity to

	Marrow.prototype.__setFn = Marrow.__setFn = function(key, err){
		return function(func){
			if(typeof func === "function"){
				this[key] = func;
			}else{
				if(err){
					// just to give hints
					throw(err);
				}
			}
		};
	};

	// closing and opening the component

	Marrow.prototype.close = function(){
		if(typeof this.__close === "function"){
			this.__close.apply(this, arguments);
		}
		this.emit("close");
		this.__state = 0;
	};

	Marrow.prototype.open = function(){
		if(typeof this.__open === "function"){
			this.__open.apply(this, arguments);
		}
		this.emit("open");
		this.__state = 1;
	};

	Marrow.prototype.toClose = Marrow.__setFn(
		"__close", 
		"Marrow::toClose takes a function as the first argument"
	);

	Marrow.prototype.toOpen = Marrow.__setFn(
		"__open", 
		"Marrow::toOpen takes a function as the first argument"
	);

	// maybe make a more verbose state, also more conventional
	Marrow.prototype.getState = function(){
		return this.__state;
	};

	// to remove

	Marrow.prototype.remove = function(){
		if(typeof this.__remove === "function"){
			this.__remove.apply(this, arguments);
		}
		this.emit("removed");
		this.__state = 0;
	};

	Marrow.prototype.toRemove = Marrow.__setFn(
		"__remove", 
		"Marrow::toRemove takes a function as the first argument"
	);

	// compile to a web component when available
	exports.Marrow = Marrow;

}(this));(function(exports){

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
			if(!(typeof this._events[event] === "object")){
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

			for(var i = 0; i < this._events[event].length; i += 1){
				this._events[event][i](evntObj);
			}
		}

	};

	// small utitlity to

	Marrow.prototype.__setFn = Marrow.__setFn = function(key, err){
		return function(func){
			if(typeof func === "function"){
				this[key] = func;
			}else{
				if(err){
					// just to give hints
					throw(err);
				}
			}
		};
	};

	// closing and opening the component

	Marrow.prototype.close = function(){
		if(typeof this.__close === "function"){
			this.__close();
		}
		this.emit("close");
		this.__state = 0;
	};

	Marrow.prototype.open = function(){
		if(typeof this.__open === "function"){
			this.__open();
		}
		this.emit("open");
		this.__state = 1;
	};

	Marrow.prototype.toClose = Marrow.__setFn(
		"__close", 
		"Marrow::toClose takes a function as the first argument"
	);

	Marrow.prototype.toOpen = Marrow.__setFn(
		"__open", 
		"Marrow::toOpen takes a function as the first argument"
	);

	// maybe make a more verbose state, also more conventional
	Marrow.prototype.getState = function(){
		return this.__state;
	};

	// to remove

	Marrow.prototype.remove = function(){
		if(typeof this.__remove === "function"){
			this.__remove();
		}
		this.emit("removed");
		this.__state = 0;
	};

	Marrow.prototype.toRemove = Marrow.__setFn(
		"__remove", 
		"Marrow::toRemove takes a function as the first argument"
	);

	// compile to a web component when available
	exports.Marrow = Marrow;

}(this));