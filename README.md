## Marrow

Marrow.js is inside the bones of your framework, it helps your component communicate.

## Api

### Getting Started

```javascript
var Component = Marrow( function Component( ) {
	/* constructor */
} );
```

by adding in the second referance to the name in the function we are able to preserve the `component.constructor.name`

#### Extending

with a function

```javascipt
var Component = Marrow( 
	function Component( ) {
		/* constructor */
	},
	function( _this ){
		_this.method = function(){

		};
		_this.value = 123;
	}
);
```
with a object

```javascipt
var Component = Marrow( 
	function Component( ) {
		/* constructor */
	},
	{
		hello : function(){
			this.emit( 'world' );
		}
	}
);
```

#### Basic Inheritance

```javascript
var Component = Marrow( function Component( ) {
	/* constructor */
});

Component.prototype.method = function ( ) {
	
};

Component.prototype.value = 123;
```
### Creating an Instance

```javascript
var Component = Marrow( /* ... */ );
var component = new Component( );
```

### Events

Marrows events are very similiar to Backbones or Nodes event emitter. In Marrow you have an event `string`. That event  string helps identify what handlers to send the events & events payload to. We support base events and chaining events as well

eg. `app:error` would be an event that has a base of `app` and subevent of `error` so if you were to bind to either `app` or `app:error` you would recieve the event data.

##### Chaining

Instead of allowing multiple levels of event bind there is only two levels `base:sub` but we also allow chaining so if there are multiple sub events you would like to emit to you could just chain the events together eg. `app:error:log`. Would emit to `app`, `app:log`, `app:error`, & `app:error:log`.

#### `marrow.on`

is a way to bind to a event emitted by the object. The first parameter is a String that defined what event type that you want to attach to. The second parameter is a function that will be queued and executed once the event fires.

```javascript
component.on( 'event', function ( args ) {
	/* do stuff */
} );
```

If a sub event is emitted and consumed by a base event the base event will also get the event string so that it can be handled correctly.

```javascript
component.on( 'app', function ( event, args ) {
	/* do stuff */
} );
/* if `app:*` is emited */
```

Add just added to 0.0.17 the ability to bind to other objs events

```javascript
component.on( otherComponent, 'event', function ( args ) {
	/* do stuff with another objects event */
} );

otherComponent.emit('event');
```


#### `marrow.once`

practically the same exact thing as on but only will fire once.

```javascript
component.once( 'event', function ( args ) {
	/* do stuff once */
} );
```


#### `marrow.off`

is a way to remove a binding to an event that would be attached with the on method. The first parameter is a String with the name of the event you want to unbind from this is optional, when omited all events will be unbound from object. The second parameter is a funcion that is a referance to a function that was bound to an event this will only remove that one binding. The second argument is also optional and when omitted will then unbind and bindings to the specified event in the first parameter.

```javascript
var fn = function fn () { /* ... */ };
component.on( 'event', fn );
component.off( 'event', fn );
// remove all handlers
component.off( 'event' );
// remove everything
component.off( );
```

#### `marrow.emit`

is a way to fire off events to all the binding functions. The first parameter in emit is the event type as a String this is a referance used to bind the events to functions. Emit will also take any other parameters passed into the emits method and will pass them to the and event binds... only omiting the first parameter, the event type.

```javascript
component.on( "event", function( payload ){ 
	/*Do stuff with payload*/
});
component.emit( "event", {} );
```

### Building Methods

Right now there is only one method in this section but in this section has allot of areas to expand to.

#### `marrow.to`

creates a method that will auto fire off an event with the same name.  The first parameter is type which is the name of the method and the name of the event to bind to, this is a String. The second argument is a function that you would want to excute when the newly created method is called. The third state parameter is state which is a Number... the number of the state you want you component to go into once the method is called. 

```javascript
component.to( 'complete', function ( ) {
	/* do stuff */
}, 2 );
component.on( 'complete', function ( ) { 
	// will fire after all sync code in complete method are ran
} );
component.complete( );
```

### States

Marrow allows for multiple `number` states so that components can not only talk to each other but know what states other components are in.

#### `marrow.getState`

returns the state of the component... will alway be evaluted for a number

#### `marrow.setState`

first parameter gets set as value of the __state which is return in getState. Need to be a Number if not it will be evaluated as NaN.

```javascript
component.setState( 3 );
component.getState( ); // 3
```

using `marrow.to`

```javascript
component.to( 'complete', function ( ) { }, 5 );
component.complete( );
component.getState( ); // 5
```


