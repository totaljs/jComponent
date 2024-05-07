(function(W) {

	const ERR = 'Total.js UI: {0}';
	const Total = {};
	const DEF = {
		cl: {}
	};
	const T = Total;

	W.Total = Total;
	W.DEF = DEF;
	W.PLUGINS = {};
	W.NOOP = function(){};
	W.W = W;

	DEF.pathcommon = 'common.';
	DEF.pathcl = 'DEF.cl.';

	T.scope = W;
	T.version = 20;
	T.components = [];
	T.binders = [];
	T.watchers = [];
	T.events = {};
	T.plugins = W.PLUGINS;
	T.env = {};

	T.cache = {
		paths: {}
	};

	T.db = {
		plugins: {},
		components: {}
	};

	/*
		@Path: Core
		@Method: Total.set(scope, path, value);
		The method assigns a `value` based on a `path` to the defined `scope`.
	*/
	T.set = function(scope, path, value) {

		var key = 'set' + path;
		var fn = T.cache.paths[key];

		if (fn)
			return fn(scope, value);

		var arr = splitpath(path);
		var builder = [];
		var regarr = /\[\d+\]|\[\]$/;

		for (var i = 0; i < arr.length - 1; i++) {
			var type = arr[i + 1] ? (regarr.test(arr[i + 1]) ? '[]' : '{}') : '{}';
			var p = 'w' + (arr[i][0] === '[' ? '' : '.') + arr[i];
			builder.push('if(typeof(' + p + ')!==\'object\'||' + p + '==null)' + p + '=' + type + ';');
		}

		var v = arr[arr.length - 1];
		var ispush = v.lastIndexOf('[]') !== -1;
		var regarr = /\[\]/g;
		var a = builder.join(';') + ';var v=typeof(a)===\'function\'?a(F.TUtils.get(b)):a;w' + (v[0] === '[' ? '' : '.') + (ispush ? v.replace(regarr, '.push(v)') : (v + '=v')) + ';return v';

		var fn = new Function('w', 'a', 'b', a);
		T.cache.paths[key] = fn;
		return fn(scope, value, path);
	};

	/*
		@Path: Core
		@Method: Total.get(scope, path);
		The method reads a `value` based on a `path` in the defined `scope`.
	*/
	T.get = function(scope, path) {

		var key = 'get' + path;
		var fn = T.cache.paths[key];

		if (fn)
			return fn(scope);

		if (!path)
			return scope;

		var arr = splitpath(path);
		var builder = [];

		for (var i = 0, length = arr.length - 1; i < length; i++)
			builder.push('if(!w' + (!arr[i] || arr[i][0] === '[' ? '' : '.') + arr[i] + ')return');

		var v = arr[arr.length - 1];
		fn = (new Function('w', builder.join(';') + ';return w' + (v[0] === '[' ? '' : '.') + v));
		T.cache.paths[key] = fn;
		return fn(scope);
	};

	T.on = function(name, callback) {
		var arr = T.events[name];
		if (!arr)
			arr = T.events[name] = [];
		arr.push(callback);
	};

	T.emit = function(name, a, b, c, d) {

		var arr = T.events[name];
		if (arr) {
			for (var e of arr)
				e(a, b, c, d);
		}

		for (let m of T.components) {
			arr = m.events[name];
			if (arr) {
				for (var e of arr)
					e(a, b, c, d);
			}
		}

		for (let key in T.plugins) {
			arr = T.plugins[key].events[name];
			if (arr) {
				for (var e of arr)
					e(a, b, c, d);
			}
		}

	};

	/*
		@Path: Core
		@Method: Total.notify(scope, path);
		The method notifies all watchers based on a `path` ot the defined `scope`.
	*/
	T.notify = function(scope, path, onlyflags) {

		// @onlyflags = true notifies components about changed state

		path = path instanceof T.Path ? path : parsepath(path);
		path.exec(function() {

			// Component watchers
			for (let m of T.components) {
				if (m.ready && m.scope === scope) {
					if (!m.path || path.includes(m.path)) {
						if (path.flags.reset || path.flags.detault) {
							m.config.touched = false;
							m.config.modified = false;
						} else if (path.flags.change || path.flags.touch || path.flags.modify || path.flags.modified) {
							m.config.modified = true;
							m.config.touched = true;
						}

						if (onlyflags)
							m.$validate();
						else
							m.$setter(m.get(), path.path, path.flags);
					}

					if (!onlyflags) {
						for (let w of m.watchers) {
							if (w.path.includes(path))
								w.fn(w.path.get(scope), path.path, path.flags);
						}
					}

				}
			}

			if (onlyflags)
				return;

			// Plugin watchers
			for (let key in T.plugins) {
				let plugin = T.plugins[key];
				if (plugin.ready && plugin.scope === scope) {
					for (let m of plugin.watchers) {
						if (!m.path || m.path.includes(path))
							m.fn(m.path.get(scope), path.path, path.flags);
					}
				}
			}

			// Global watchers
			for (let m of T.watchers) {
				if (m.scope === scope && (!m.path || m.path.includes(path)))
					m.fn(path, m.path.get(scope), path.flags);
			}
		});

	};

	T.cl = function(name, callback) {
		callback();
	};

	W.WARN = function() {
		W.console && W.console.warn.apply(W.console, arguments);
	};

	function register(name, callback, attribute) {
		customElements.define(name, class extends HTMLElement {

			// Implement status
			constructor() {
				super();
				setTimeout(callback, 1, this);
			}

			static get observedAttributes() {
				return ['config', 'path'];
			}

			attributeChangedCallback(property, ovalue, nvalue) {
				var t = this;
				if (t.$initialized && attribute)
					 attribute(this, property, nvalue);
			}

		});
	}

	function parsepath(path) {
		var cache = T.cache.paths[path];
		if (cache)
			return cache;
		return T.cache.paths[path] = new T.Path(path);
	}

	function splitpath(path) {

		var arr = path.split('.');
		var builder = [];
		var all = [];

		for (var i = 0; i < arr.length; i++) {
			var p = arr[i];
			var index = p.indexOf('[');
			if (index === -1) {
				if (p.indexOf('-') === -1) {
					all.push(p);
					builder.push(all.join('.'));
				} else {
					var a = all.splice(all.length - 1);
					all.push(a + '[\'' + p + '\']');
					builder.push(all.join('.'));
				}
			} else {
				if (p.indexOf('-') === -1) {
					all.push(p.substring(0, index));
					builder.push(all.join('.'));
					all.splice(all.length - 1);
					all.push(p);
					builder.push(all.join('.'));
				} else {
					all.push('[\'' + p.substring(0, index) + '\']');
					builder.push(all.join(''));
					all.push(p.substring(index));
					builder.push(all.join(''));
				}
			}
		}

		return builder;
	}

	function findparent(el, tag) {

		parent = el.parentNode;

		if (parent) {

			if (parent.tagName === 'BODY')
				return;

			if (parent.tagName === tag)
				return parent;

			return findparent(parent, tag);
		}

	}

	// Proxy declaration
	(function() {

		T.Proxy = function(el) {
			el = $(el);
			var t = this;
			t.element = el;
			t.name = el.attr('name') || '';
			t.path = el.attr('path') || '';
			t.config = (el.attr('config') || '').parseConfig();
			t.tag = el[0].tagName;
			t.ready = false;
			el[0].$proxy = t;
			setTimeout(t.init, 1, t);
		}

		var PROTO = T.Proxy.prototype;

		PROTO.init = function(t) {

			if (t.ready)
				return;

			let tmp;
			let arr;

			if (t.tag === 'UI-PLUGIN' && !t.instance) {
				tmp = T.db.plugins[t.path];
				if (!tmp) {
					WARN(ERR.format('The plugin "{0}" not found'.format(t.path)));
					return;
				}
				t.instance = new T.Plugin(t);
			} else if (t.tag === 'UI-COMPONENT' && !t.instance) {
				tmp = T.db.components[t.name];
				if (!tmp) {
					// Try to download component from CDN
					WARN(ERR.format('The component "{0}" not found'.format(t.name)));
					return;
				}
				t.instance = new T.Component(t);
				arr = T.components;
			} else if (t.tag === 'UI-BIND' && !t.instance)
				t.instance = new T.Binder(t, t.config, t.element);

			if (t.path.includes('?')) {
				// absolute path
				let parent = findparent(t.element[0], 'UI-PLUGIN');
				if (parent) {
					let proxy = parent.$proxy;
					if (proxy && proxy.ready) {
						// @TODO: missing skipper "?1" or "?3"
						t.parent = proxy.element;
						t.path = t.path.replace(/\?/g, proxy.path);
					} else {
						setTimeout(t.init, 500, t);
						return;
					}
				} else {
					WARN(ERR.format('The element "{0}" does not have defined parent plugin'.format(t.path)), t.element[0]);
					return;
				}
			}

			t.ready = true;
			t.instance.ready = true;
			t.instance.scope = W;
			t.instance.name = t.name || t.path;
			t.instance.path = new T.Path(t.path);
			t.instance.proxy = t;
			t.instance.element = t.element;
			t.instance.config = {};
			t.instance.plugin = t.parent;

			for (let key in tmp.config)
				t.instance.config[key] = tmp.config[key];

			for (let key in t.config)
				t.instance.config[key] = t.config[key];

			var cls = 'ui-' + t.name;

			switch (t.tag) {
				case 'UI-PLUGIN':
					T.plugins[t.path] = t.instance;
					break;
				case 'UI-COMPONENT':
					t.element.aclass(cls);
					break;
			}

			arr && arr.push(t.instance);
			tmp.callback.call(t.instance, t.instance, t.config, t.element, cls);
			t.instance.init();
		};
	})();

	register('ui-component', function(el) {
		new T.Proxy(el);
	}, function(el, property, value) {
		// attribute is changed
	});

	register('ui-plugin', function(el) {
		new T.Proxy(el);
	}, function(el, property, value) {
		// attribute is changed
	});

	register('ui-bind', function(el) {
		new T.Proxy(el);
	}, function(el, property, value) {
		// attribute is changed
	});

	// Path declaration
	(function() {

		/*
			@Path: Path
			@Class: Total.Path(path)
			The class parses dynamic paths.
		*/
		T.Path = function(path) {

			var t = this;

			t.flags = {};

			if (path.includes(' #')) {
				t.cl = [];
				path = path.replace(/\s#[a-z0-9_-]+/gi, function(text) {
					t.cl.push(text.trim().substring(1));
					return '';
				}).trim();
				t.cl = t.cl.join(',');
			}

			// obj.format = findformat(path);

			t.raw = path;

			path = path.replace(/<.?>/g, function(text) {
				t.cache = text;
				return '';
			});

			// if (obj.format)
			// 	obj.rawpath = path = obj.format.path;

			path = path.replace(/@[\w:]+/g, function(text) {
				let name = text.substring(1);
				let index = name.indexOf(':');
				if (index !== -1) {
					let k = name.substring(0, index);
					let v = name.substring(index + 1);
					t.flags[k] = k == 'type' && v.charCodeAt(0) < 58 ? +v : v;
				} else
					t.flags[name] = 1;
				return '';
			}).trim();

			t.path = path.env();
			t.split = splitpath(path);

			let c = t.path.charAt(0);

			if (c === '%')
				t.path = T_TMP + t.path.substring(1);
			else if (c === '#')
				t.path = DEF.pathcl + t.path.substring(1);
			else if (c === '*')
				t.path = DEF.pathcommon + t.path.substring(1);

			c = path.charAt(0);

			if (c === '*')
				path = path.replace(c, DEF.pathcommon.substring(0, DEF.pathcommon.length - 1));

			let index = path.indexOf('|');

			t.path = index === -1 ? path : (path = 'PLUGINS["' + path.substring(0, index) + '"].' + path.substring(index + 1));
			t.flags2 = [];

			var keys = Object.keys(t.flags);
			var skip = { reset: 1, default: 1, change: 1, extend: 1, nowatch: 1, type: 1, nobind: 1, modify: 1, modified: 1, touched: 1 };

			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				if (!skip[key])
					t.flags2.push(key);
			}

			if (!t.flags2.length)
				delete t.flags2;

		};

		var PROTO = T.Path.prototype;

		/*
			@Path: Path
			@Method: instance.includes(path)
			The method checks to see if the path is part of the route.
		*/
		PROTO.includes = function(path) {

			var t = this;

			if (path instanceof T.Path)
				path = path.path;

			if (path.length > t.path.length) {
				for (var i = 0; i < t.path.length; i++) {
					var a = path.charAt(i);
					var b = t.path.charAt(i);
					if (a !== b)
						return false;
				}

				var c = path.charAt(i);
				return c === '.' || c === '[' || c === '';
			}

			for (let m of t.split) {
				if (m === path)
					return true;
			}

		};

		/*
			@Path: Path
			@Method: instance.assign(path)
			The method assigns a new path to the current path instance.
		*/
		PROTO.assign = function(path) {
			var c = path.charAt(0);

			// *common, #cl, %temp
			if (c === '*' || c === '#' || c === '%')
				return path;

			if (c === '@' || c === '<' || c === '>' || c === '(' || c === ')')
				path = ' ' + path;
			else
				path = path ? ('.' + path) : '';

			return parsepath(this.path + path);
		};

		/*
			@Path: Path
			@Method: instance.get(scope)
			The method reads a `value` based on a `path` in the defined `scope`.
		*/
		PROTO.get = function(scope) {
			return T.get(scope, this.path);
		};

		/*
			@Path: Path
			@Method: instance.set(scope, value)
			The method assigns a `value` based on a `path` to the defined `scope`.
		*/
		PROTO.set = function(scope, value) {
			T.set(scope, this.path, value);
		};

		/*
			@Path: Path
			@Method: instance.notify(scope)
			The method notifies all watchers based on the path.
		*/
		PROTO.notify = function(scope, flags) {
			if (flags)
				flags = ' ' + flags;
			T.notify(scope, flags ? (this.path + (flags || '')) : this);
		};

		PROTO.exec = function(callback) {

			var t = this;

			if (t.flags2) {
				for (let m of t.flags2)
					Total.emit('@flag ' + m);
			}

			if (t.cl)
				Total.cl(t.cl, callback);
			else
				callback();

		};

	})();

	// Plugin declaration
	(function() {

		/*
			@Class: Total.Plugin(proxy)
			The class handles plugins.
		*/
		T.Plugin = function(proxy) {
			var t = this;
			t.watchers = [];
			t.events = {};

			var ext = {
				get() {
					return t.get();
				},
				set(value) {
					t.set(value);
				}
			};

			Object.defineProperty(t, 'parent', {
				get() {
					return t.plugin;
				}
			});

			Object.defineProperty(t, 'model', ext);
			Object.defineProperty(t, 'data', ext);
			Object.defineProperty(t, 'form', {
				get() {
					return t.get('@reset');
				}
			});
			Object.defineProperty(t, 'modified', {
				get() {
					return t.get('@reset @modified') || {}
				}
			});
		};

		var PROTO = T.Plugin.prototype;

		PROTO.get = function(path) {

			var t = this;
			var obj = null;

			path = t.path.assign(path);

			if (path.flags.modified) {
				obj = {};
				for (let m of T.components) {
					if (path.includes(m.path)) {
						T.set(path)
					}
				}
			}

			if (path.flags.reset) {
				for (let m of T.components) {
					if (path.includes(m.path))
						m.reset();
				}
			}

			return t.path.get(t.scope);
		};

		PROTO.init = function() {
			var t = this;
			t.make && t.make();
		};

		PROTO.on = function(name, callback) {
			var t = this;
			var arr = t.events[name];
			if (!arr)
				arr = t.events[name] = [];
			arr.push(callback);
		};

		PROTO.emit = T.emit;

		PROTO.format = function(path) {

			if (!path)
				path = '';

			if (path.indexOf('{') === -1)
				path += '{0}';

			return path.format(this.path);
		};

		PROTO.makepath = function(path) {
			var t = this;
			if (path) {
				let c = path.charAt(0);
				if (c !== '<' && c !== '@' && c !== '#')
					path = t.format('{0}.' + path);
				else
					path = t.path + ' ' + path;
			}
			return path || t.path;
		}

		PROTO.watch = function(path, callback) {

			if (typeof(path) === 'function') {
				callback = path;
				path = '';
			}

			var t = this;
			t.watchers.push({ path: t.path.assign(path), fn: callback });
		};

		PROTO.validate = function() {

		};

	})();

	// Component declaration
	(function() {

		/*
			@Class: Total.Plugin(proxy);
			The class handles components.
		*/
		T.Component = function(proxy) {
			var t = this;
			t.events = {};
			t.internal = {};
			t.watchers = [];
		}

		var PROTO = T.Component.prototype;

		PROTO.init = function() {
			var t = this;
			t.make && t.make();
		};

		// Deprecated
		PROTO.bindvisible = NOOP;

		/*
			@Path: Component
			@Method: instance.readonly();
			The method disables validation.
		*/
		PROTO.readonly = function() {
			this.internal.readonly = true;
		};

		/*
			@Path: Component
			@Method: instance.singleton();
			The method enables changes the component instance to a singleton.
		*/
		PROTO.singleton = function() {
			this.internal.singleton = true;
		};

		/*
			@Path: Component
			@Method: instance.set(value, [type]);
			The method assings a value to the model and calls `setter`.
		*/
		PROTO.set = function(value, flags) {
			var t = this;
			t.path.set(t.scope, value, flags);
			t.path.notify(t.scope, flags);
		};

		/*
			@Path: Component
			@Method: instance.get();
			The method reads a value from the model.
		*/
		PROTO.get = function() {
			var t = this;
			return t.path.get(t.scope);
		};

		/*
			@Path: Component
			@Method: instance.on(name, callback);
			The method registers a global event.
		*/
		PROTO.on = function(name, callback) {
			var t = this;
			var arr = t.events[name];
			if (!arr)
				arr = t.events[name] = [];
			arr.push(callback);
		};

		PROTO.watch = function(path, callback) {

			if (typeof(path) === 'function') {
				callback = path;
				path = '';
			}

			var t = this;
			t.watchers.push({ path: t.path.assign(path), fn: callback });
		};

		/*
			@Path: Component
			@Method: instance.emit(name, [a], [b], [c], [d]);
			The method emits a global event within Total.js UI library.
		*/
		PROTO.emit = T.emit;

		/*
			@Path: Component
			@Method: instance.modify(value, [type]);
			The method assigns a value to the model, sets a state to `touched` and calls `setter`.
		*/
		PROTO.modify = function(value, flags) {
			var t = this;
			t.config.touched = true;
			t.config.modified = true;
			t.set(value, flags);
		};

		/*
			@Path: Component
			@Method: instance.reset();
			The method resets the state.
		*/
		PROTO.reset = function(noemit) {
			var t = this;
			t.config.touched = false;
			t.config.modified = false;

			if (!noemit)
				t.$validate();

		};

		/*
			@Path: Component
			@Method: instance.reconfigure(value);
			The method reconfigures the component. The `value` can be `String` or `Object`.
		*/
		PROTO.reconfigure = function(value, init) {

			var t = this;

			if (typeof(value) === 'string')
				value = value.parseConfig();

			for (let key in value) {
				t.configure && t.configure(key, value, t.config[key], init);
				t.config[key] = value;
			}
		};

		// Internal method
		PROTO.$state = function() {
			var t = this;
			var cls = t.element[0].classList;
			cls.toggle('ui-touched', t.config.touched == true);
			cls.toggle('ui-modified', t.config.modified == true);
			cls.toggle('ui-disabled', t.config.disabled == true);
			cls.toggle('ui-invalid', t.config.invalid == true);
		};

		PROTO.$validate = function(value) {

			var t = this;

			if (t.internal.readonly || !t.validate) {
				t.config.invalid = false;
			} else {
				let r = t.validate(value === undefined ? t.get() : value);
				t.config.invalid = r === '' || r == true ? false : typeof(r) === 'string' ? r : true;
			}

			t.$state();
		};

		// Internal method
		PROTO.$setter = function(value, path, flags) {
			var t = this;
			t.setter && t.setter(value, path, flags);
			t.$validate();
		};

	})();

	// Binder declaration
	(function() {

		T.Binder = function(proxy) {}

		var PROTO = T.Binder.prototype;

		PROTO.init = function() {

		};

	})();

	// String prototypes
	(function() {

		var PROTO = String.prototype;

		/*
			@Path: String prototype
			@Prototype: String.prototype.format([index0], [index1], [index2]);
			The method replaces all indexes in the form `{index}` with values defined as arguments.
		*/
		PROTO.format = function() {
			var arg = arguments;
			return this.replace(/\{\d+\}/g, function(text) {
				var value = arg[+text.substring(1, text.length - 1)];
				return value == null ? '' : value instanceof Array ? value.join('') : value;
			});
		};

		/*
			@Path: String prototype
			@Prototype: String.prototype.env();
			The method replaces all phrases `[key]` with values defined in the environment.
		*/
		PROTO.env = function() {
			var self = this;
			return self.replace(/(\[.*?\])/gi, function(val) {
				var key = val.substring(1, val.length - 1);
				return (key.charAt(0) === '.' ? T.get(W, key.substring(1)) : T.env[key]) || val;
			});
		};

		/*
			@Path: String.prototype
			@Prototype: String.prototype.parseConfig();
			The method parses Total.js UI library configuration in the form `key1:value;key2:value`.
		*/
		PROTO.parseConfig = function(def) {

			let arr = this.replace(/\\;/g, '\0').split(';');
			let colon = /(https|http|wss|ws):\/\//gi;
			let output = {};
			let regnum = /^(-)?[0-9.]+$/;

			for (let m of arr) {

				let item = m.replace(/\0/g, ';').replace(/\\:/g, '\0').replace(colon, text => text.replace(/:/g, '\0'));
				let kv = item.split(':');
				let l = kv.length;

				if (l !== 2)
					continue;

				let k = kv[0].trim().env();
				let v = kv[1].trim().replace(/\0/g, ':').env();

				if (v === 'true' || v === 'false')
					v = v === 'true';
				else if (regnum.test(v)) {
					let tmp = +v;
					if (!isNaN(tmp))
						v = tmp;
				}

				output[k] = v;
			}

			return output;
		};

	})();

	// Window globals
	(function() {

		/*
			@Path: Globals
			@Method: SET(path, value);
			The method sets and notifies all UI components and watchers based on the path.
		*/
		W.SET = function(path, value) {
			path = parsepath(path);
			path.exec(function() {
				path.set(T.scope, value);
				path.notify(T.scope);
			});
		};

		/*
			@Path: Globals
			@Method: GET(path);
			Based on the path, the method returns a value.
		*/
		W.GET = function(path) {
			var flags = path.includes(' ');
			path = parsepath(path);
			flags && path.notify(T.scope);
			return path.get(T.scope);
		};

		/*
			@Path: Globals
			@Method: UPD(path);
			The method notifies all UI components and watchers based on the path.
		*/
		W.UPD = W.UPDATE = function(path) {
			T.notify(T.scope, path);
		};

		/*
			@Path: Globals
			@Method: COMPONENT(name, [config], callback, [dependencies]);
			The method registers a new component declaration.
		*/
		W.COMPONENT = function(name, config, callback, dependencies) {

			if (typeof(config) === 'function') {
				dependencies = callback;
				callback = config;
				config = '';
			}

			T.db.components[name] = { config: (config || '').parseConfig(), callback: callback, dependencies: dependencies };
		};

		/*
			@Path: Globals
			@Method: PLUGIN(name, [config], callback, [dependencies]);
			The method registers a new plugin declaration.
		*/
		W.PLUGIN = function(name, config, callback, dependencies) {

			if (typeof(config) === 'function') {
				dependencies = callback;
				callback = config;
				config = '';
			}

			T.db.plugins[name] = { config: (config || '').parseConfig(), callback: callback, dependencies: dependencies };
		};

	})();

	// jQuery extensions
	(function() {

		// Fixed IE <button tags
		W.isIE && $W.on('keydown', function(e) {
			if (e.keyCode === 13) {
				var n = e.target.tagName;
				if (n === 'BUTTON' || n === 'INPUT' || n === 'SELECT')
					e.preventDefault();
			}
		});

		/*
			@Path: jQuery extensions
			@Method: $(selector).multiple({ input: 'selector', textarea: 'selector' });
			The method searches for all elements based on the object keys.
		*/
		$.fn.multiple = function(selector) {
			var tmp = {};
			for (var key in selector)
				tmp[key] = this.find(selector[key]);
			return tmp;
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).plugin();
			The method finds the closest plugin.
		*/
		$.fn.plugin = function() {
			var parent = findparent(this, 'UI-PLUGIN');
			return parent ? parent.$proxy.instance : null;
		};

		var classtimeout = function(el, a, t) {

			if (el.length)
				delete el[0].$ct;

			if (t === 1)
				el.aclass(a);
			else if (t === 2)
				el.rclass(a);
			else if (t === 3)
				el.rclass2(a);
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).aclass(cls, [timeout]);
			The method appends CSS class to the current element.
		*/
		$.fn.aclass = function(a, timeout) {
			var self = this;
			if (timeout && self.length) {
				self[0].$ct && clearTimeout(self[0].$ct);
				self[0].$ct = setTimeout(classtimeout, timeout, self, a, 1);
			}
			return timeout ? self : self.addClass(a);
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).rclass(cls, [timeout]);
			The method removes CSS class from the current element.
		*/
		$.fn.rclass = function(a, timeout) {
			var self = this;
			if (timeout && self.length) {
				self[0].$ct && clearTimeout(self[0].$ct);
				self[0].$ct = setTimeout(classtimeout, timeout, self, a, 2);
			}
			return timeout ? self : a == null ? self.removeClass() : self.removeClass(a);
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).rattr(name);
			The method removes attribute.
		*/
		$.fn.rattr = function(a) {
			return this.removeAttr(a);
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).rattrd(name);
			The method removes `data` attribute.
		*/
		$.fn.rattrd = function() {
			for (var i = 0; i < arguments.length; i++)
				this.removeAttr('data-' + arguments[i]);
			return this;
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).rclass2(find, [timeout]);
			The method removes all CSS classes that contain the `find` phrase.
		*/
		$.fn.rclass2 = function(a, timeout) {

			var self = this;

			if (timeout) {
				if (self.length) {
					self[0].$ct && clearTimeout(self[0].$ct);
					self[0].$ct = setTimeout(classtimeout, timeout, self, a, 3);
				}
				return self;
			}

			var arr = (self.attr('class') || '').split(' ');
			var isReg = typeof(a) === 'object';

			for (var i = 0; i < arr.length; i++) {
				var cls = arr[i];
				if (cls) {
					if (isReg) {
						if (a.test(cls))
							self.rclass(cls);
					} else {
						cls.indexOf(a) !== -1 && self.rclass(cls);
					}
				}
			}

			return self;
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).hclass(name);
			The method checks if the element contains a defined CSS class.
		*/
		$.fn.hclass = function(a) {
			return this.hasClass(a);
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).tclass(name, [enable]);
			The method toggles the CSS class for the current element.
		*/
		$.fn.tclass = function(a, v) {
			return this.toggleClass(a, v);
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).attrd(name, value);
			The method assigns a `value` to the current element's specific attribute `name`.
		*/
		$.fn.attrd = function(a, v) {
			a = 'data-' + a;
			return v == null ? this.attr(a) : this.attr(a, v);
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).attrd2(name, value);
			The method tries to find a data attribute value in the parent tree of the current element.
		*/
		$.fn.attrd2 = function(a) {

			a = 'data-' + a;

			var v = null;
			var c = this;

			while (c[0] && v == null) {
				v = c.attr(a);
				if (!v) {
					if (c[0].tagName === 'BODY')
						break;
					c = c.parent();
				}
			}

			return v;
		};

		/*
			@Path: jQuery extensions
			@Method: $(selector).asvg(tag);
			The method creates an SVG element.
		*/
		$.fn.asvg = function(tag) {

			if (tag.indexOf('<') === -1) {
				var el = D.createElementNS('http://www.w3.org/2000/svg', tag);
				this.append(el);
				return $(el);
			}

			var d = D.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = D.createDocumentFragment();
			while (d.firstChild.firstChild)
				f.appendChild(d.firstChild.firstChild);
			f = $(f);
			this.append(f);
			return f;
		};

		$.fn.psvg = function(tag) {

			if (tag.indexOf('<') === -1) {
				var el = D.createElementNS('http://www.w3.org/2000/svg', tag);
				this.prepend(el);
				return $(el);
			}

			var d = D.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = D.createDocumentFragment();
			while (d.firstChild.firstChild)
				f.appendChild(d.firstChild.firstChild);
			f = $(f);
			this.prepend(f);
			return f;
		};
	})();


})(window);