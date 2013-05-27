(function(exports){

	var Marrow = function(component, fn){ 
		if(!(this instanceof Marrow)){
			return new Marrow(component);
		}
		// extend component 
		component.prototype = this;
		
		// return it extended with our goodness
		if(typeof fn === "function"){
			fn(this);
		}

		return component;
	};

	Marrow.prototype = Marrow.plus = {};

	// maybe make a more verbose state, also more conventional
	Marrow.prototype.getState = function(){
		return this.__state;
	};

	exports.Marrow = Marrow;

}(this));