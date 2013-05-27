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