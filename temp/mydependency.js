(function() {

wrapjs(function() {
	return "The dependency";
}, {
	systems: eval(wrapjs.systems),
	name: 'mydependency'
});

}).call(this);