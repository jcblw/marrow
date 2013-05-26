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