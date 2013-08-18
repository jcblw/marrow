/* global to emulate client */
Marrow = require('../src/core').Marrow;

var 
assert = require( 'assert' ),
fn = function ( ) { };

describe( 'Marrow', function ( ) { 
	
	it( 
		'when a function is passed in as the second param an instance' + 
		' of Marrow is passed as the first param', 
		function( ) {

			var Component = Marrow( fn, function( _this ) {
				assert.equal( true, _this instanceof Marrow );
			});
		} 
	);

	it( 
		'when a function is passed in as the second param an instance' + 
		' of Marrow is passed as the first param and should allow for ' +
		'chaing on methods onto the instance', 
		function( ) {

			var Component = Marrow( fn, function( _this ) {
				_this.hello = function ( ) { return 'world'; };
			});
			var component = new Component();
			assert.equal( 'world', component.hello( ) );
		} 
	);

	it( 
		'when a object is passed in as the second param an instance' + 
		' of Marrow uses that object to extend the components prototype', 
		function( ) {

			var Component = Marrow( fn, {
				hello : function ( ) {
					return 'world';
				}
			});
			var component = new Component();
			assert.equal( 'world', component.hello( ) );
		} 
	);

	it( 
		'when a component is extended by chaining methods onto it prototype ' + 
		'those methods are preserved', 
		function( ) {

			var Component = Marrow( fn );
			Component.prototype.hello = function( ) { 
				return 'world'; 
			}
			var component = new Component();
			assert.equal( 'world', component.hello( ) );
		} 
	);

	it( 
		'when a component is created the constructor name will be preserved ' +
		'if it was passed in correctly', 
		function( ) {

			var Fun = Marrow( function Fun( ){ } );
			var component = new Fun();
			assert.equal( 'Fun', component.constructor.name );
			assert.equal( true, component instanceof Fun );
		} 
	);

	var 
	Component = Marrow( fn ),
	component = new Component();


	describe( 'merge', function ( ) { 
		it( 
			'should merge two or more objects', 
			function () {
				var 
				obj = {},
				obj2 = { hello : 'world' },
				obj3 = { world : 'hello'};

				component.merge( obj, { key : 1 } );
				obj2 = component.merge( obj2, obj3, { key : 2 } );

				assert.equal( 1, obj.key );
				assert.equal( 2, obj2.key );
				assert.equal( 'world', obj2.hello );
				assert.equal( 'hello', obj2.world );
			} 
		);

		it(
			'should overwrite keys when another obj down the chain of' + 
			'arguments has the same key',
			function ( ) {
				var
				obj = { hello : 'world' },
				obj2 = { hello : 'universe' },
				obj3 = { hello : 'world' },
				obj4 = { hello : 'Marrow' };

				component.merge( obj, obj2 );

				assert.equal( 'universe', obj.hello );

				component.merge( obj, obj3, obj2, obj4 );

				assert.equal( 'Marrow', obj.hello );
			}
		)

		it(
			'should return an object if first param is an object',
			function ( ) {
				var
				obj = { hello : 'world' },
				_obj = component.merge( obj ),
				_obj2 = component.merge( obj, _obj );

				assert.equal( 'object', typeof _obj );
				assert.equal( 'object', typeof _obj2 );

			}
		)
	} );

	describe( 'getState', function ( ) { 
		it( 
			'should return the current state of the component' + 
			' as a number', 
			function () {
				component.__state = 1;
				assert.equal( 1, component.getState() );
				assert.equal( 'number', typeof component.getState() );
			} 
		);
	} );

	describe( 'setState', function ( ) {
		it(
			'should the state of the component',
			function ( ) {
				component.setState( 5 );
				assert.equal( 5, component.getState( ) );
			}
		)

		it(
			'should only return numbers',
			function ( ) {
				component.setState( 'string ' );
				assert.equal( true, isNaN( component.getState( ) ) );
				assert.equal( 'number', typeof component.getState( ) );
				component.setState( '2' );
				assert.equal( 2, component.getState( ) );
			}
		)
	} )
} )
