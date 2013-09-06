/* global to emulate client */
// Marrow = require('../src/core').Marrow;

var
Marrow = require( '../index' ), 
assert = require( 'assert' ),
// events = require('../src/events'),
fn = function fn( ) { 
	var hell0 = 1;
};

describe( 'Marrow', function ( ) { 

	var 
	Component = Marrow( fn ),
	component = new Component();

	describe( 'on', function ( ) { 
		it( 
			'should add a handler to an event array', 
			function () {
				component.on( 'hello', fn );
				assert.equal( 1, component._events.hello.length );
				component.on( 'hello', function(){} );
				assert.equal( 2, component._events.hello.length );
			} 
		);
		it( 
			'should only accept strings as first param', 
			function () {
				component.on( 123, function(){} );
				assert( 'undefined', typeof component._events[123] );
				component.on( 'world', function(){} );
				assert.equal( 'object', typeof component._events['world'] );
			} 
		);
		it( 
			'should only accept functions as the second param', 
			function () {
				component.on( 'nofn', 123 );
				assert.equal( 'undefined', typeof component._events.nofn );
				component.on( 'yesfn', function(){} );
				assert.equal( 'object', typeof component._events.yesfn );
			} 
		);

		var 
		Mock = Marrow( function Mock( ){ } );
		mock = new Mock();

		it( 
			'should bind to another objects events if the object has the' + 
			'proper methods', 
			function () {
				var worked;
				component.on( mock, 'hello', function ( ) {
					worked = true;
				});
				mock.emit('hello');
				assert.equal( true, worked );
			} 
		);
	} );

	describe( 'off', function ( ) {
		it(
			'should only remove only specified function when present',
			function ( ) {
				var count = 0;
				var handle = function( ){
					count = count + 1;
				};
				component.on( 'offtest', handle );
				component.off( 'offtest', handle );
				assert.equal( 0, count );
			}
		)
		it(
			'should remove all functions when no function is provided',
			function ( ) {
				component.off( 'world' );
				assert.equal( 'object', typeof component._events.world );
				assert.equal( 0, component._events.world.length );
			}
		)
		it(
			'should remove every event function when nothing is provided',
			function ( ) {
				var count = 0;
				component.off( );
				assert.equal( 'object', typeof component._events );
				for( var key in component._events ){
					count = count + 1;
				}
				assert.equal( 0, count );
			}
		)
		it(
			'should not remove anything when bad params are used',
			function ( ) {
				component.on('hello', function(){});
				component.on('world', function(){});
				component.on('universe', function(){});
				component.off( '12312313', 12839231 );
				component.off( fn, "aisdjufasfu" );
				component.off( 0 );
				assert.equal( 1, component._events.hello.length );
				assert.equal( 1, component._events.world.length );
				assert.equal( 1, component._events.universe.length );
			}
		)

		var 
		Off = Marrow( function Off( ){ } );
		off = new Off();

		it( 
			'when binding to another objects events off should remove ' +
			'the handler for that other object', 
			function () {
				var 
				count = 0,
				handle = function handle( ) {
					count = count + 1;
				};

				component.on( off, 'offTest', handle);
				off.emit('offTest');

				component.off( off, 'offTest', handle);
				off.emit('offTest');
				off.emit('offTest');
				off.emit('offTest');
				off.emit('offTest');
				
				assert.equal( 1, count );
			} 
		);

		it( 
			'when binding to another objects events off should remove ' +
			'the all handles for a cetain event', 
			function () {
				var 
				count = 0,
				handle = function handle( ) {
					count = count + 1;
				};

				component.on( off, 'hello', handle);
				component.on( off, 'hello', handle);
				component.on( off, 'hello', handle);

				component.off( off, 'hello');
				off.emit('hello');
				off.emit('hello');
				off.emit('hello');
				off.emit('hello');
				
				assert.equal( 0, count );
			} 
		);
	

	} )

	//clean
	component.off();

	describe( 'emit', function ( ) {
		it(
			'should call any functions attached to an event',
			function ( ) {
				var 
				worked,
				alsoWorked;
				component.on( 'emitTest', function(){
					worked = true;
				} );
				component.on( 'emitTest', function(){
					alsoWorked = true;
				} );
				component.emit( 'emitTest' );
				assert.equal( true, worked );
				assert.equal( true, alsoWorked );
			}
		);

		//clean
		component.off();

		it(
			'should emit to only specific events',
			function ( ) {
				var worked,
					alsoWorked;
				component.on( 'event1', function ( ) {
					worked = true;
				} )
				component.on( 'event2', function ( ) {
					alsoWorked = true;
				} )
				component.emit('event1');
				assert.equal( true, worked );
				assert.equal( 'undefined', typeof alsoWorked );
			}
		)

		//clean
		component.off();

		it(
			'should emit to base of events handlers',
			function ( ) {
				var worked = 0;
					alsoWorked = 0;
				component.on( 'emit', function ( ) {
					worked = +worked + 1;
				} );
				component.on( 'emit:hello', function ( ) {
					alsoWorked = +alsoWorked + 1;
				} );
				component.emit('emit:hello');
				component.emit('emit:world');
				component.emit('emit:ofwefwe');
				component.emit('emit:yeah');
				//bad
				component.emit('emits:yeah');
				assert.equal( 4, worked );
				assert.equal( 1, alsoWorked );
			}
		)

		//clean
		component.off();

		it(
			'should emit pass all arguments except event name if its a ' + 
			'specific event handle',
			function ( ) {

				component.on('hello', function ( ) {
					assert.equal( 1, arguments[0] );
					assert.equal( 0, arguments[1] );
					assert.equal( 'string', arguments[2] );
					assert.equal( true, arguments[3] );
					assert.equal( 4, arguments.length );
				});

				component.emit('hello', 1, 0, 'string', true );

			}
		)

		it(
			'should emit pass all arguments even event name if its a ' + 
			'base event handle',
			function ( ) {

				component.on('base', function ( ) {
					assert.equal( 'base:hello', arguments[0] );
					assert.equal( 1, arguments[1] );
					assert.equal( 0, arguments[2] );
					assert.equal( 'string', arguments[3] );
					assert.equal( 4, arguments.length );
				});

				component.emit('base:hello', 1, 0, 'string' );

			}
		)

		//clean
		component.off();

		it(
			'should emit to base and sub events when chaining them',
			function ( ) {
				var count = 0;
				component.on('emit', function ( ) {
					count = count + 1;
				});
				component.on('emit:hello', function ( ) {
					count = count + 1;
				});
				component.on('emit:world', function ( ) {
					count = count + 1;
				});
				component.on('emit:hello:world', function ( ) {
					count = count + 1;
				});
				component.emit('emit:hello:world');
				assert.equal( 4, count );

			}
		)

	} )

	component.off();

	describe( 'once', function ( ) { 
		it( 
			'should only fire once', 
			function () {
				var count = 0;
				component.once( 'once', function( ) {
					count = count + 1;
				} );
				component.emit('once');
				component.emit('once');
				component.emit('once');
				component.emit('once');
				component.emit('once');
				assert.equal( 1, count );
				
			} 
		);

		it(
			'should receive all arguments passes from emit',
			function ( ) {

				component.once('hello', function ( ) {
					assert.equal( 1, arguments[0] );
					assert.equal( 0, arguments[1] );
					assert.equal( 'string', arguments[2] );
					assert.equal( true, arguments[3] );
					assert.equal( 4, arguments.length );
				});

				component.emit('hello', 1, 0, 'string', true );

			}
		);
	} );

} )
