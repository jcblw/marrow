## Marrow

Marrow.js is inside the bones of your framework, it is basic building blocks for your web components. It packs in a couple conventions that I use for my web components plus a event emitter.

### To Use

warning: this is at a very early development stage

```javascript
// add some marrow to a component

var Component = function(ele){
	this.ele = ele;
};

Component = Marrow(Component, function(self){

	var init = function(){
		self.emit("doingCoolStuff");
	};

	self.onOpen(init);
	
});

// and you can still extend your object the way you normally would
Component.prototype.doStuff = function(){
	// and still use Marrows methods
	this.emit("doingStuff");
};

// why thats cool
var component = new Component(document.querySelector("body"));

// custom events
component.on("doingCoolStuff", function(){
	alert("yes!");
});

component.on("doingStuff", function(){
	alert("stuff is good");
});

// simple conventions
component.open();

```
With simple conventions its easy to make component play nice with each other and also build tools to manage components

Its in very early stages so all of this is subject to change.

TODO : Make a way to compile template, andadd it into the shadow dom,
TODO : Settup Marrow group to signify that a component is compatable as a web components
