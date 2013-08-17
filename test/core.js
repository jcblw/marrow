/* global to emulate client */
Marrow = require('../src/core').Marrow;

var 
assert = require( 'assert' ),
fn = function ( ) { };

describe( 'Marrow', function ( ) { 
	it( 
		'when executed with required params will return a new instance' + 
		' of Marrow', 
		function( ) {

			var Component = Marrow( fn );
			assert( true, Component instanceof Marrow );
		} 
	);

	var 
	Component = Marrow( fn ),
	component = new Component();


	describe( 'getState', function ( ) { 
		it( 
			'should return the current state of the component' + 
			' as a number', 
			function () {
				component.__state = 1;
				assert( 1, component.getState() );
				assert( 'number', typeof component.getState() );
			} 
		);
	} );

	describe( 'setState', function ( ) {
		it(
			'should the state of the component',
			function ( ) {
				component.setState( 5 );
				assert( 5, component.getState( ) );
			}
		)

		it(
			'should only return numbers',
			function ( ) {
				component.setState( 'string ' );
				assert( true, isNaN( component.getState( ) ) );
				assert( 'number', typeof component.getState( ) );
				component.setState( '2' );
				assert( 2, component.getState( ) );
			}
		)
	} )
} )
