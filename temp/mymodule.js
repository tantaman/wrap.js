(function() {
	
	wrapjs(function(dep) {
		return {
			a: 1,
			b: 2,
			dep: dep
		};
	}, {
		systems: eval(wrapjs.systems),
		require: ['./mydependency'],
		name: 'mymodule'
	});

}).call(this);