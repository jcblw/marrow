## Marrow

Marrow.js is what the bones are inside the bones of your framework, it basic is building blocks for your web components. It packs in a couple conventions that I use for my web components plus a event emitter.

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

// why thats cool
var component = new Component(document.querySelector("body"));

// custom events
component.on("doingCoolStuff", function(){
	alert("yes!")
});

// simple conventions
component.open();

```
With simple conventions its easy to make component play nice with each other and also build tools to manage components

Its in very early stages so all of this is subject to change.