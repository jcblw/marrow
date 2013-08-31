/* global to emulate client */
Marrow = require('../src/core').Marrow;

var 
assert = require( 'assert' ),
events = require('../src/events'),
task = require('../src/task'),
fn = function fn( ) { };

describe( 'Marrow', function ( ) { 

	var 
	Component = Marrow( function Component(){} ),
	component = new Component( ),
	Listener = Marrow( function Listener(){} ),
	listener = new Listener( );

	describe( 'registerTask', function ( ) {

		listener.registerTask( 'hello', 
			function ( ) {
				// task do stuff
				return 'hello';
			}, {
				event: 'test',
				instance : 'Component'
			}
		);

		it( 'should create a task that will be stored in' + 
			' Marrow.DS._tasks', 
			function ( ) {
				var count = 0;
				for( var key in Marrow.DS._tasks ){
					count += 1;
				}
				assert.equal( 1, count );
			}
		)

		var task = Marrow.DS._tasks[ 'hello:_test:Component' ];
		it( 'should register task under the proper name eg.' + 
			' task:_event:instance', 
			function ( ) {
				assert.equal( 'object', typeof task  );
			}
		)

		it( 'should store the event under the key of `fn`' + 
			' inside of the task',
			function ( ) {
				assert.equal( 'function', typeof task.fn ); 
				// return of that handle
				assert.equal( 'hello', task.fn() ); 
			}
		)

	});

	describe( 'tasker', function ( ) {
		it( 'should run a task if one is registered ', 
			function ( ) { 
				var count  = 0;
				listener.registerTask( 'test', 
					function(  ){
						count += 1;
					}, {
						event : 'countUp',
						instance: 'Listener'
					}
				);
				listener.tasker( 'countUp', listener );
				assert.equal( 1, count );
			}
		)

		it( 'should pass the instance that fired the event' + 
			'to the event hander as the first argument', 
			function ( ) {
				var ts,
					hello;
				listener.registerTask( 'test', 
					function( instance ){
						ts = listener.ts;
						instance.hello = true;
						instance.on( 'test', function( ) {
							hello = true;
						})
					}, {
						event : 'instanceTest',
						instance: 'Listener'
					}
				);
				listener.tasker( 'instanceTest', listener );
				listener.emit( 'test' );
				assert.equal( 'object', typeof listener );
				assert.equal( true, listener.hello );
				assert.equal( listener.ts , ts );
				assert.equal( true , hello );
			}

		)
	});

	describe( 'initialize task', function ( ) {

		it( 'should run any initialization task if task module is included' + 
			' when and instance is initialized',
			function () {
				var count = 0;
				listener.registerTask('init',
					function ( obj ) {
						count += 1;
					}, {
						instance : 'Component',
						event: 'initialize'
					}
				);
				var comp1 = new Component();
				var comp2 = new Component();
				assert.equal( 2, count );
				var comp3 = new Component();
				assert.equal( 3, count );

			} 
		);

	});

	describe( 'on', function ( ) {

		it( 'should register a task to run on initialize if' + 
			' a constructor is passed as first parameter',
			function ( ) {
				listener.on( Component, 'hello', function ( ) {
					return 'world';
				});

				var task = Marrow.DS._tasks[ '_contructorBind:_initialize:Component' ];
				assert.equal( 'object', typeof task );
				assert.equal( 'function', typeof task.fn );
			}
		)

		it( 'should bind event to instance once an instance is created', 
			function ( ) {
				var works;
				listener.on( Component, 'testIt', function ( ) {
					works = true;
				});
				var comp4 = new Component();
				comp4.emit('testIt');
				assert.equal( true, works );
			}
		)

		it( 'should bind all instances with constructor specified',
			function ( ) {
				var count  = 0;
				listener.on( Component, 'testing', function ( ) {
					count += 1;
				});

				var comp5 = new Component();
				var comp6 = new Component();
				var comp7 = new Component();

				comp5.emit('testing', 'comp5' );
				comp6.emit('testing', 'comp6' );
				comp7.emit('testing', 'comp7' );

				assert.equal( 3, count );

				var comp8 = new Component();
				comp8.emit('testing', 'comp8' );

				assert.equal( 4, count );

			} 
		)
		

	})

} )
