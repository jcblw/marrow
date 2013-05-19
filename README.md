## Marrow

Marrow.js is inside the bones of your framework, it is basic building blocks for your web components. It packs in a couple conventions that I use for my web components plus a event emitter.

### Use

##### Building your own components w/ Marrow

```javascript
// add some marrow to a component

var Component = function(ele){
	this.ele = ele;
};

// return extended component as well s passing it into `optional` callback;
Component = Marrow(Component, function(self){

	var init = function(){
		self.emit("doingCoolStuff");
	};

	self.on("open", init, 1);
	// optional state at end
	
});

// and you can still extend your object the way you normally would
Component.prototype.blah = function(){
	// and still use Marrows methods
	this.emit("blah");
};

```

##### Using Marrow Components

```javascript
// just example usage - u would actually define this
var component = new Component(document.querySelector("body"));

// custom events
component.on("doingCoolStuff", function(){
	console.log("yes!");
});

// i can haz arguments
component.on("doingStuff", function(stuff){
	console.log( stuff + " is being done"); //Cool Stuff is being done
});

// build method and attach events to them
component.to("doingStuff", function(stuff){
	// will a auto create method component::doingStuff
	// will allow you to pass parameters though method to events
	// will trigger event "doingStuff" when called
});

//use
component.doingStuff("Cool Stuff");

```

#### `Warning`


Its in very early stages so all of this is subject to change.

- TODO : Make a way to compile template, andadd it into the shadow dom,
- TODO : Settup Marrow group to signify that a component is compatable as a web components
