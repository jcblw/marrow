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
		this._store( );
		if ( 'tasker' in this ) {
			this.tasker( 'initialize', this );
		}
		if ( 'emit' in this ) {
			this.emit('initialize');
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