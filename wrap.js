(function() {
	function nodeWrap(definition, root, module, options) {
		var dependencies = [];
		if (options.require) {
			for (var i = 0; i < options.require.length; ++i) {
				var a = require(options.require[i]);
				dependencies.push(a);
			}
		}

		module.exports = definition.apply(root, dependencies);
	}

	function amdWrap(definition, define, options) {
		var dependencies = [] || options.require;
		define(dependencies, definition);
	}

	function windowWrap(definition, root, options) {
		var normalizedRequire = [];
		var dependencies = [];
		if (options.require && !options.rootrequire) {
			for (var i = 0; i < options.require.length; ++i) {
				var dep = options.require[i];
				var li = dep.lastIndexOf('/');
				if (li != -1)
					dep = dep.substring(li + 1);
				normalizedRequire.push(dep);
			}
		} else if (options.rootrequire) {
			normalizedRequire = options.rootrequire;
		}

		for (var i = 0; i < normalizedRequire.length; ++i) {
			dependencies.push(root[normalizedRequire[i]]);
		}

		root[options.name] = definition.apply(root, dependencies);
	}

	function wrap(definition, options) {
		options = options || {systems: {}};
		var module = options.systems.module,
		define = options.systems.define,
		root = options.systems.root;

		if (options.version != null && options.version != wrap.version) {
			wrap.others[options.version](module, define, root, definition, options);
			return;
		}

		if (module) {
			nodeWrap(definition, root, module, options);
		} else if (define && define.amd) {
			amdWrap(definition, define, options);
		} else {
			windowWrap(definition, root, options);
		}
	}

	var glob;
	if (typeof global !== 'undefined' && typeof module !== 'undefined') {
		glob = global;
	} else {
		glob = window;
	}

	var prev = glob.wrapjs;

	if (prev) {
		wrap.others = prev.others;
	} else {
		wrap.others = {};
	}
	wrap.version = '1.0.0';
	wrap.others[wrap.version] = wrap;
	wrap.systems = ['true ? {',
		'module: ', '(typeof module !== "undefined" && module.exports ? module : null),',
		' define: ', '(typeof define !== "undefined" && define.amd ? define : null),',
		' root: ', '(typeof module !== "undefined" && module.exports ? global : window)',
	'} : {}'].join('');

	if (!prev || comesLater(wrap.version, prev.version)) {
		glob.wrapjs = wrap;
	}

	function comesLater(l, r) {
		l = l.split('.');
		r = r.split('.');

		for (var i = 0; i < 3; ++i) {
			if (l[i] > r[i]) return true;
		}

		return false;
	}
})();
