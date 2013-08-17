/* global to emulate client */
Marrow = require('../src/core').Marrow;

var 
assert = require( 'assert' ),
events = require('../src/events'),
build = require('../src/build'),
fn = function ( ) { };

describe( 'Marrow', function ( ) { 

	var 
	Component = Marrow( fn ),
	component = new Component();


	describe( 'to', function ( ) { 
		it( 
			'should create a method with the event name', 
			function () {
				component.to('testTo', function(){ } );
				assert.equal ( 'function', typeof component.testTo );
			} 
		);
		it( 
			'should emit an event to a custom event based off method name', 
			function () {
				var count = 0;
				component.on('testTo', function ( ) { 
					count = count + 1;
				} )
				component.to('testTo', function(){ } );
				component.testTo()
				assert.equal( 1, count );
			} 
		);

		component.off();

		it( 
			'should change the state of the component based off the' +
			' optional state', 
			function () {
				component.to('testTo', function(){ } , 5000);
				component.testTo()
				assert.equal( 5000, component.getState() );
			} 
		);
	} );

} )
