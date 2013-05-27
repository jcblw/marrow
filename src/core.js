(function(exports){

	// Marrow Constructor
	// the first argument in the component which is just a function
	// that acts as the initial constructor function for the component.
	// the second argument is a callback function that you can pass in
	// another callback function where the first argument is the `this`
	// prototype of Marrow. returns the first prameter with an extended
	// prototype

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

	// Marrow.plus is a mapping to the Marrow.prototype that
	// allows the extension of Marrow without using plus

	Marrow.prototype = Marrow.plus = {};

	// Marrow::getState returns the state of the component

	Marrow.prototype.getState = function(){
		return this.__state;
	};

	// Marrow::setState first parameter gets set as value of the 
	// __state which is return in getState. Need to be a Number
	// if not it will be evaluated as NaN

	Marrow.prototype.setState = function(value){
		this.__state = +value;
	};

	exports.Marrow = Marrow;

}(this));