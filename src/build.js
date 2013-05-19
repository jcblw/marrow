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