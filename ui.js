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
	T.data = {};

	T.cache = {
		paths: {},
		counter: 0
	};

	T.db = {
		plugins: {},
		components: {}
	};

	setInterval(function() {

		W.NOW = new Date();

		let remove = [];

		// Delete unused plugins
		for (let key in T.plugins) {
			let m = T.plugins[key];
			if (!inDOM(m.dom))
				m.$remove();
		}

		// Delete unused components
		for (let m of T.components) {
			if (!inDOM(m.dom))
				remove.push(m);
		}

		// Delete unused binders
		for (let m of T.binders) {
			if (!inDOM(m.dom))
				remove(m);
		}

		for (let m of remove)
			m.$remove();

		T.cache.counter++;
		T.emit('service', T.cache.counter);

	}, 60000);

	/*
		@Path: Core
		@Method: Total.set(scope, path, value); #scope {Object}; #path {String}; #value {Object};
		The method assigns a `value` based on a `path` to the defined `scope`.
	*/
	T.set = function(scope, path, value) {

		var key = 'A' + HASH(path);
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
		@Method: Total.get(scope, path); #scope {Object}; #path {String}; #return {String/Boolean/Object};
		The method reads a `value` based on a `path` in the defined `scope`.
	*/
	T.get = function(scope, path) {

		var key = 'B' + HASH(path);
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
		@Method: Total.find(scope, path, callback); #scope {object}; #path {String}; #callback {Function(arr)};
		The method returns in the callback all component instances defined in the path scope.
	*/
	T.find = function(scope, path, callback) {
		path = path instanceof T.Path ? path : parsepath(path);
		path.exec(function() {
			var arr = [];
			for (let m of T.components) {
				if (m.ready && m.scope === scope) {
					if (path.includes(m.path)) {
						if ((path.flags.visible && HIDDEN(m.element)) || (path.flags.touched && !m.config.touched) || (path.flags.modified && !m.config.modified) || (path.flags.invalid && !m.config.invalid) || (path.flags.disabled && !m.config.disabled) || (path.flags.enabled && m.config.disabled))
							continue;
						arr.push(m);
					}
				}
			}
			callback(arr);
		});
	};

	/*
		@Path: Core
		@Method: Total.notify(scope, path); #scope {Object}; #path {String};
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

	/*
		@Path: Core
		@Method: Total.cl(name, callback); #name {String}; #callback {Function()};
		The method inicializes codelists.
	*/
	T.cl = function(name, callback) {
		callback();
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

	function inDOM(el) {
		if (!el)
			return;
		if (el.tagName === 'BODY')
			return true;
		var parent = el.parentNode;
		while (parent) {
			if (parent.tagName === 'BODY')
				return true;
			parent = parent.parentNode;
		}
	}

	function parsepath(path) {
		var key = 'C' + HASH(path);
		var cache = T.cache.paths[key];
		if (cache)
			return cache;
		return T.cache.paths[key] = new T.Path(path);
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

			// @TODO: missing implementation for downloading dependencies

			if (t.tag === 'UI-PLUGIN' && !t.instance) {

				if (t.path === '*')
					t.path = DEF.pathcommon.substring(0, DEF.pathcommon.length - 1);

				tmp = T.db.plugins[t.path];

				if (t.path.includes(' ') && t.path.includes('?'))
					t.path = 'Total.data.p' + GUID(10);

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
			t.instance.dom = t.element[0];
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
					t.instance.cls = cls;
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
			var skip = { reset: 1, default: 1, change: 1, extend: 1, nowatch: 1, type: 1, nobind: 1, modify: 1, modified: 1, touched: 1, invalid: 1 };

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
			@Method: instance.includes(path); #path {String};
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
			@Method: instance.assign(path); #path {String};
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
				path = c === '?' ? path.substring(1) : path ? ('.' + path) : '';

			return parsepath(this.path + path);
		};

		/*
			@Path: Path
			@Method: instance.get(scope); #scope {Object};
			The method reads a `value` based on a `path` in the defined `scope`.
		*/
		PROTO.get = function(scope) {
			return T.get(scope, this.path);
		};

		/*
			@Path: Path
			@Method: instance.set(scope, value); #scope {Object}; #value {String/Number/Boolean/Object/Date};
			The method assigns a `value` based on a `path` to the defined `scope`.
		*/
		PROTO.set = function(scope, value) {
			T.set(scope, this.path, value);
		};

		/*
			@Path: Path
			@Method: instance.notify(scope); #scope {Object};
			The method notifies all watchers based on the path.
		*/
		PROTO.notify = function(scope, flags) {
			if (flags) {
				if (typeof(flags) === 'object') {
					let tmp = '';
					for (let key in flags)
						tmp += ' @' + key;
					flags = tmp;
				} else
					flags = ' ' + flags;
			}
			T.notify(scope, flags ? (this.path + (flags || '')) : this);
		};

		/*
			@Path: Path
			@Method: instance.exec([callback]); #[callback] {Function()};
			The method executes flags and code lists.
		*/
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

		/*
			@Path: Path
			@Method: instance.find(scope, callback); #scope {object}; #callback {Function(arr)};
			The method returns in the callback all component instances defined in the path scope.
		*/
		PROTO.find = function(scope, callback) {
			return T.find(scope, this, callback);
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
					return t.path.get(t.scope);
				},
				set(value) {
					t.path.set(t.scope, value);
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
					return t.path.get(t.scope, '@reset');
				}
			});
			Object.defineProperty(t, 'modified', {
				get() {
					return t.get(t.scope, '@reset @modified') || {}
				}
			});
		};

		var PROTO = T.Plugin.prototype;

		// Internal
		PROTO.init = function() {
			var t = this;
			t.make && t.make();
		};

		/*
			@Path: Plugin
			@Method: instance.get(path);
			The method reads a value from the plugin model.
		*/
		PROTO.get = function(path) {

			var t = this;
			var obj = null;

			path = t.path.assign(path);

			/*
			@TODO: Not implemented
			if (path.flags.modified) {
				obj = {};
				for (let m of T.components) {
					if (path.includes(m.path)) {
						T.set(path)
					}
				}
			}*/

			if (path.flags.reset) {
				for (let m of T.components) {
					if (path.includes(m.path))
						m.reset();
				}
			}

			return t.path.get(t.scope);
		};

		/*
			@Path: Plugin
			@Method: instance.set(path, value)
			The method assigns a `value` based on a `path` to the defined plugin `scope`.
		*/
		PROTO.set = function(path, value) {
			var t = this;
			path = t.path.assign(path);
			path.set(t.scope, value);
			path.notify(t.scope);
		};

		/*
			@Path: Plugin
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

		/*
			@Path: Plugin
			@Method: instance.emit(name, [a], [b], [c], [d]);
			The method emits a global event within Total.js UI library.
		*/
		PROTO.emit = T.emit;

		/*
			@Path: Plugin
			@Class: instance.format(path);
			The method formats the path based on the plugin path.
		*/
		PROTO.format = function(path) {

			if (!path)
				path = '';

			if (path.indexOf('{') === -1)
				path += '{0}';

			return path.format(this.path);
		};

		/*
			@Path: Plugin
			@Method: instance.watch(path, callback);
			The method registers a new watcher to capture changes based on the path.
		*/
		PROTO.watch = function(path, callback) {

			if (typeof(path) === 'function') {
				callback = path;
				path = '';
			}

			var t = this;
			t.watchers.push({ path: t.path.assign(path), fn: callback });
		};

		// Internal method
		PROTO.$remove = function() {
			var t = this;

			try {
				t.destroy && t.destroy();
			} catch (e) {
				WARN(ERR.format(e));
			}

			delete T.plugins[t.path];
			t.element.remove();
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

		// Internal
		PROTO.init = function() {
			var t = this;
			t.make && t.make();
			t.$setter(t.get(), t.path.path, { init: 1 });
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

		/*
			@Path: Component
			@Method: instance.watch(path, callback);
			The method registers a new watcher to capture changes based on the path.
		*/
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
			@Method: instance.touch();
			The method simulates user "touch".
		*/
		PROTO.touch = function() {
			var t = this;
			t.config.touched = true;
			t.$validate();
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

		// Internal method
		PROTO.$remove = function() {
			var t = this;

			try {
				t.destroy && t.destroy();
			} catch (e) {
				WARN(ERR.format(e));
			}

			var index = t.components.indexOf(t);
			if (index !== -1)
				t.components.splice(index, 1);
			t.element.remove();
		};

	})();

	// Binder declaration
	(function() {

		T.Binder = function(proxy) {}

		var PROTO = T.Binder.prototype;

		PROTO.init = function() {

		};

		// Internal method
		PROTO.$remove = function() {
			var t = this;
			var index = t.binders.indexOf(t);
			if (index !== -1)
				t.binders.splice(index, 1);
			t.element.remove();
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
			@Property: NOW; #return {Date};
			The property always returns the current `Date` object refreshed in a one minute interval.
		*/
		W.NOW = new Date();

		/*
			@Path: Globals
			@Property: NOOP(); #return {Function};
			The method returns empty function that means "no operation".
		*/
		W.NOOP = function() {};

		/*
			@Path: Globals
			@Property: ON(name, callback); #name {String}; #callback {Function(a, b, c, d)};
			The method registers a new handler for capturing a specific event.
		*/
		W.ON = T.on;

		/*
			@Path: Globals
			@Property: EMIT(name, [a], [b], [c], [d]); #name {String}; #[a] {Object}; #[b] {Object}; #[c] {Object}; #[d] {Object};
			The method emits a specific event to all plugins and components.
		*/
		W.EMIT = T.emit;

		/*
			@Path: Globals
			@Method: SET(path, value); #path {String}; #value {Object};
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
			@Method: GET(path); #path {String}; #return {Object};
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
			@Method: UPD(path); #path {String};
			The method notifies all UI components and watchers based on the path.
		*/
		W.UPD = W.UPDATE = function(path) {
			T.notify(T.scope, path);
		};

		/*
			@Path: Globals
			@Method: COMPONENT(name, [config], callback, [dependencies]); #path {String}; #[config] {Object}; #callback {Function(self, config, element, cls)}; #[dependencies] {String};
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
			@Method: PLUGIN(path, [config], callback, [dependencies]); #path {String}; #[config] {Object}; #callback {Function(self, config, element, cls)}; #[dependencies] {String};
			The method registers a new plugin declaration.
		*/
		W.PLUGIN = function(name, config, callback, dependencies) {

			if (typeof(config) === 'function') {
				dependencies = callback;
				callback = config;
				config = '';
			}

			if (name === '*')
				name = DEF.pathcommon.substring(0, DEF.pathcommon.length - 1);

			T.db.plugins[name] = { config: (config || '').parseConfig(), callback: callback, dependencies: dependencies };
		};

		/*
			@Path: Globals
			@Method: ERRORS(path, callback); #path {String}; #callback {Function(arr)};
			The method returns errors based on the path.
		*/
		W.ERRORS = function(path, callback) {
			path = parsepath(path + ' @invalid');
			path.find(T.scope, callback);
		};

		/*
			@Path: Globals
			@Method: HIDDEN(el); #el {jQuery/Element}
			The method determines whether the element is visible or not.
		*/
		W.HIDDEN = function(el) {
			if (el == null)
				return true;
			if (el instanceof jQuery)
				el = el[0];
			return el.parentNode && el.parentNode.tagName === T_BODY ? false : W.isIE ? (!el.offsetWidth && !el.offsetHeight) : !el.offsetParent;
		};

		/*
			@Path: Globals
			@Method: HASH(value); #value {String/Number/Boolean/Object/Date};
			The method creates a hash from the `value`.
		*/
		W.HASH = function(value, unsigned) {
			if (!value)
				return 0;
			var type = typeof(value);
			if (type === 'number')
				return value;
			else if (type === 'boolean')
				return value ? 1 : 0;
			else if (value instanceof Date)
				return value.getTime();
			else if (type === 'object')
				value = STRINGIFY(value);
			var hash = 0, i, char;
			if (!value.length)
				return hash;
			var l = value.length;
			for (i = 0; i < l; i++) {
				char = value.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash |= 0; // Convert to 32bit integer
			}
			return hash >>> 0;
		};

		/*
			@Path: Globals
			@Method: WARN(a, [b], [c], [d]); #a {Object}; #[b] {Object}; #[c] {Object}; #[d] {Object};
			The method prints a warning on the web dev console.
		*/
		W.WARN = function() {
			W.console && W.console.warn.apply(W.console, arguments);
		};

		function rnd2() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}

		function rnd3() {
			return arguments[Math.floor(Math.random() * arguments.length)];
		}

		/*
			@Path: Globals
			@Method: GUID([length]); #length {Number};
			The method generates a unique identifier randomly. The `length {Number}` argument can affect its length.
		*/
		W.GUID = function(length) {

			if (!length) {
				var ticks = Date.now();
				var low = ticks.toString(16);
				var sec = (ticks / 60000 >> 0).toString(16);
				return low.substring(0, 8) + '-' + (low.length < 8 ? low.substring(8).padLeft(4, '0') : low.substring(4, 8)) + '-' + rnd3(1, 2, 3, 4, 5) + sec.substring(1, 4) + '-' + rnd3(0, 8, 9, 'a', 'b') + sec.substring(4, 7) + '-' + rnd2() + rnd2() + rnd2();
			}

			var l = ((length / 10) >> 0) + 1;
			var b = [];

			for (var i = 0; i < l; i++)
				b.push(Math.random().toString(36).substring(2));

			return b.join('').substring(0, length);
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