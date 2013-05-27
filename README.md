## Marrow

Marrow.js is inside the bones of your framework, it is basic building blocks for your web components. It packs in a couple conventions that I use for my web components plus a event emitter.

### Use

##### Extending component w/ Marrow

```javascript
//  this is just a function I will use as a constructor
var Component = function(ele){
	this.ele = ele;
};

// return extended component as well s passing it into `optional` callback;
Component = Marrow(Component, function(self){
	self.on("hello", function(){ 
		console.log("world");
	});
});

// and you can still extend your object the way you normally would
Component.prototype.blah = function(){
	// and still use Marrows method
};

```

or you can

```javascript
var Component = Marrow(function(ele){
	this.ele = ele;
	this.emit("init", this.ele);
});
```
### Calling Component

```javascript
// it really depends how you define this
var component = new Component(document.querySelector("body"));
```

##### Using Events

```javascript
var doStuffHandle = function(stuff){
	console.log( stuff + " is being done"); //Cool Stuff is being done
}

// i can haz custom events with arguments
component.on("doStuff", doStuffHandle);

// build method and attach events to them
component.to("doStuff", function(stuff){
	// will a auto create method component::doingStuff
	// will allow you to pass parameters though method to events
	// will trigger event "doingStuff" when called
}, 2); // optional state

//use
component.doStuff("Cool Stuff");

// unbind a event binding
component.off("doStuff", doStuffHandle);

// unbind all event binding
component.off("doStuff");

// unbind all events
component.off();

```

##### Using States

```javascript
component.getState(); // will be 2 from doStuff
component.setState(1);
component.getState(); // will be set to 1
```

#### `Warning`


Its in very early stages so all of this is subject to change.
