// Total.js UI Library
// jComponent v20
// DEV

(function(W) {

	const ERR = 'Total.js UI: {0}';
	const Total = {};
	const DEF = {
		cl: {}
	};

	const TNB = { number: 1, boolean: 1 };
	const T = Total;

	W.Total = T;
	W.DEF = DEF;
	W.PLUGINS = {};
	W.W = W;
	W.MAIN = T;
	W.M = T;
	W.$W = $(W);

	/*
		@Path: Globals
		@Method: NOOP(); #return {Function};
		The method returns empty function that means "no operation".
	*/
	W.NOOP = function() {};

	/*
		@Path: Globals
		@Property: EMPTYARRAY; #return {Array};
		THe property returns empty array;
	*/
	W.EMPTYARRAY = [];
	Object.freeze(W.EMPTYARRAY);

	/*
		@Path: Globals
		@Property: EMPTYOBJECT; #return {Object};
		THe property returns empty object;
	*/
	W.EMPTYOBJECT = {};
	Object.freeze(W.EMPTYOBJECT);

	DEF.pathcommon = 'common.';
	DEF.pathcl = 'DEF.cl.';
	DEF.pathplugins = 'Total.data.';
	DEF.pathtmp = 'DEF.tmp.';
	DEF.headers = { 'X-Requested-With': 'XMLHttpRequest' };
	DEF.fallback = 'https://cdn.componentator.com/j-{0}.html';
	DEF.localstorage = 'totalui';
	DEF.dictionary = {};
	DEF.currency = '';
	DEF.currencies = {};
	DEF.cdn = '';
	DEF.tmp = {};
	DEF.iconprefix = 'ti ti-';
	DEF.scrollbaranimate = true;
	DEF.thousandsseparator = ' ';
	DEF.decimalseparator = '.';
	DEF.dateformat = 'yyyy-MM-dd';
	DEF.timeformat = 'HH:mm';
	DEF.dateformatutc = false;
	DEF.devices = { xs: { max: 768 }, sm: { min: 768, max: 992 }, md: { min: 992, max: 1200 }, lg: { min: 1200 }};
	DEF.empty = '---';
	DEF.env = {};
	DEF.prefixcsscomponents = 'ui-';
	DEF.prefixcsslibrary = 'ui-';

	DEF.regexp = {};
	DEF.regexp.int = /(-|\+)?[0-9]+/;
	DEF.regexp.float = /(-|\+)?[0-9.,]+/;
	DEF.regexp.date = /YYYY|yyyy|YY|yy|MMMM|MMM|MM|M|dddd|DDDD|DDD|ddd|DD|dd|D|d|HH|H|hh|h|mm|m|ss|s|a|ww|w/g;
	DEF.regexp.pluralize = /#{1,}/g;
	DEF.regexp.format = /\{\d+\}/g;

	DEF.onstorageread = function(callback) {
		let cache = {};
		try {
			cache = PARSE(localStorage.getItem(DEF.localstorage) || '');
		} catch (e) {}
		callback(cache || {});
	};

	DEF.onstoragesave = function(data) {
		try {
			localStorage.setItem(DEF.localstorage, JSON.stringify(data));
		} catch (e) {}
	};

	T.ready = false;
	T.scope = W;
	T.version = 20;
	T.components = [];
	T.binders = [];
	T.scrollbars = [];
	T.watchers = [];
	T.events = {};
	T.plugins = W.PLUGINS;
	T.env = {};
	T.data = {};

	T.cache = {
		timeouts: {},
		external: {},
		imports: {},
		storage: {},
		paths: {},
		plugins: [],
		counter: 0,
		statics: {},
		lockers: {},
		tmp: {}
	};

	T.db = {
		lazy: {},
		plugins: {},
		extensions: {},
		configs: {},
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

		// Check cache
		let resave = false;
		for (let key in T.cache.storage) {
			let m = T.cache.storage[key];
			if (m.expire && m.expire < NOW) {
				resave = true;
				delete T.cache.storage[key];
			}
		}

		resave && savestorage();

		for (let m of remove)
			m.$remove();

		T.cache.counter++;
		T.emit('service', T.cache.counter);

		// Every 5 minutes
		if (T.cache.counter % 5 === 0) {
			T.cache.paths = {};
		}

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
		var a = builder.join(';') + ';var v=typeof(a)===\'function\'?a(Total.get(a, b)):a;w' + (v[0] === '[' ? '' : '.') + (ispush ? v.replace(regarr, '.push(v)') : (v + '=v')) + ';return v';

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

		var plugin = path.split('/');
		if (plugin.length > 1)
			path = 'PLUGINS[\'{0}\'].{1}'.format(plugin[0], plugin[1]);

		var arr = splitpath(path);
		var builder = [];

		for (var i = 0, length = arr.length - 1; i < length; i++)
			builder.push('if(!w' + (!arr[i] || arr[i][0] === '[' ? '' : '.') + arr[i] + ')return');

		var v = arr[arr.length - 1];
		fn = (new Function('w', builder.join(';') + ';return w' + (v[0] === '[' ? '' : '.') + v));
		T.cache.paths[key] = fn;
		return fn(scope);
	};

	T.off = function(name, callback) {
		if (callback) {
			var arr = T.events[name];
			var index = arr.indexOf(callback);
			if (index !== -1)
				arr.splice(index, 1);
		} else
			delete T.events[name];
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

	T.exec = function(name, a, b, c, d) {

		// @important flag (it waits for a method)

		let raw = name;
		let index = name.indexOf(' ');
		let path = '';

		if (index !== -1) {
			path = name.substring(index + 1);
			name = name.substring(0, index);
		}

		path = parsepath(path);

		if (name.includes('/')) {

			let tmp = name.split('/');
			let plugin = T.plugins[tmp[0]];
			if (plugin) {
				if (plugin[tmp[1]])
					path.exec(() => plugin[tmp[1]](a, b, c, d));
				else
					WARN(ERR.format('The method "{0}/{1}" not found.'.format(tmp[0], tmp[1])));
			} else {
				if (path && path.flags.important)
					setTimeout(T.exec, 500, raw, a, b, c, d);
				else
					WARN(ERR.format('The plugin "{0}" not found.'.format(tmp[0])));
			}
		} else {
			if (W[name]) {
				path.exec(() => W[name](a, b, c, d));
			} else {
				if (path && path.flags.important)
					setTimeout(T.exec, 500, raw, a, b, c, d);
				else
					WARN(ERR.format('The method "{0}" not found.'.format(name)));
			}
		}
	};

	T.setter = function(element, name, a, b, c, d) {

		var arr = T.components;
		let raw = name;
		let index = name.indexOf(' ');
		let path = '';

		if (index !== -1) {
			path = name.substring(index + 1);
			name = name.substring(0, index);
		}

		path = parsepath(path);

		if (element) {

			let arr = [];

			if (element instanceof T.Plugin) {
				for (let m of T.components) {
					if (m.plugin === element)
						arr.push(m);
				}
			} else {
				arr = element.find('ui-component');
				for (let m of arr) {
					if (m.$totalcomponent)
						arr.push(m.$totalcomponent);
				}
			}
		}

		let tmp = name.split('/').trim();
		let sel = name.charAt(0);
		let id = '';
		let pth = '';

		name = tmp[0];

		switch (sel) {
			case '#': // identifier
				id = name.substring(1);
				name = '';
				break;
			case '.': // path
				pth = name.substring(1);
				name = '';
				break;
		}

		if (T.cache.lockers[name]) {
			setTimeout(T.setter, 300, element, raw, a, b, c, d);
			return;
		}

		// Check lazy components
		if (name) {
			let proxy = T.db.lazy[name];
			if (proxy) {
				delete T.db.lazy[name];
				T.cache.lockers[tmp[0]] = true;
				proxy.callback = function() {
					delete T.cache.lockers[tmp[0]];
					T.setter(element, raw, a, b, c, d);
				};
				proxy.init(proxy);
				return;
			}
		}

		let count = 0;
		let run = [];

		for (let m of arr) {

			if (m.ready) {

				if (tmp[0] != '*') {
					if (id && m.id !== id)
						continue;
					else if (pth && !m.path.includes(pth))
						continue;
					else if (m.name !== tmp[0])
						continue;
				}

				count++;

				if (m[tmp[1]])
					run.push(m);
				else
					WARN('The setter "{0}" not found.'.format(name));
			}
		}

		if (run.length) {
			path.exec(function() {
				for (let m of run)
					m[tmp[1]](a, b, c, d);
			});
		} else if (path.flags.important) {
			setTimeout(T.setter, 800, element, raw, a, b, c, d);
		} else
			WARN(ERR.format('The setter "{0}" not found.'.format(name)));
	};

	T.cmd = function(element, name, a, b, c, d) {

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

			// Binders
			for (let m of T.binders) {
				if (m.fn && m.scope === scope && (!m.path || m.path.includes(path)))
					m.fn(path, m.path.get(scope), path.flags);
			}
		});

	};

	T.process = function(scope, value, callback) {

		var type = typeof(callback);

		if (type === 'function') {
			callback(value);
			return;
		}

		if (type === 'string')
			callback = parsepath(callback);

		if (callback instanceof T.Path) {
			callback.exec(function() {
				callback.set(scope, value);
				callback.notify(scope);
			});
		}

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

	function autofocus(el, selector, counter) {
		if (!isMOBILE) {
			if (typeof(counter) !== 'function')
				counter = 0;
			var target = el.find(typeof(selector) === 'string' ? selector : 'input,select,textarea');
			for (var i = 0; i < target.length; i++) {
				var item = target[i];
				if (item && !HIDDEN(item)) {
					item.focus();
					if (document.activeElement == item)
						return;
				}
			}
			if (counter < 15)
				setTimeout(autofocus, 200, el, selector, counter + 1);
		}
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

	function savestorage() {
		var data = {};
		for (let key in T.cache.storage) {
			let item = T.cache.storage[key];
			if (item.expire)
				data[key] = item;
		}
		try {
			DEF.onstoragesave(data);
		} catch (e) {}
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

	function findplugin(parent) {
		if (parent.tagName === 'UI-PLUGIN' || parent.getAttribute('plugin'))
			return parent;
		parent = parent.parentNode;
		if (parent) {
			if (parent.tagName === 'BODY')
				return;
			return findplugin(parent);
		}
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

	function parent(sel) {

		var t = this;
		if (!sel)
			return t.element.parent();

		if (sel === 'auto') {
			var dom = t.dom;
			if (dom) {
				dom = dom.parentNode;
				while (true) {
					if (!dom || dom.tagName === 'BODY')
						break;
					if (dom.style.height && !dom.classList.contains(DEF.prefixcsslibrary + 'scrollbar-area'))
						return $(dom);
					dom = dom.parentNode;
				}
				return $(W);
			}
		}

		if (sel.substring(0, 6) !== 'parent')
			return sel === 'window' ? $(W) : sel === 'document' ? D : t.element.closest(sel);

		var count = sel.substring(6);
		var parent = t.element.parent();

		if (count) {
			count = +count;
			for (var i = 0; i < count; i++)
				parent = parent.parent();
		}

		return parent;
	}

	// Proxy declaration
	(function() {

		T.Proxy = function(type, el, name, path, config, callback) {
			el = $(el);
			var t = this;
			t.type = type;
			t.element = el;
			t.name = name || path || '';
			t.path = path || '';
			t.config = (typeof(config) === 'string' ? config.parseConfig(type === 'bind') : config) || {};
			t.dom = el[0];
			t.ready = false;
			t.callback = callback;
			t.pending = [];
			setTimeout(t.init, 1, t);
		};

		var PROTO = T.Proxy.prototype;

		function init(t) {

			if (t.ref.count != null)
				t.ref.count++;

			t.ready = true;
			t.instance.scope = W;
			t.instance.name = t.name || t.path;
			t.instance.path = new T.Path(t.path);
			t.instance.proxy = t;
			t.instance.element = t.element;
			t.instance.dom = t.element[0];
			t.instance.config = {};
			t.instance.plugin = t.parent ? t.parent[0].$totalplugin : null;

			for (let key in t.ref.config)
				t.instance.config[key] = t.ref.config[key];

			for (let key in t.config)
				t.instance.config[key] = t.config[key];

			var cls = DEF.prefixcsscomponents + t.name;
			var extensions = null;
			var reference = '';

			switch (t.type) {
				case 'plugin':
					T.plugins[t.path] = t.instance;
					extensions = T.db.extensions['@' + t.path];
					reference = '$totalplugin';
					break;
				case 'component':
					t.element.aclass(cls);
					t.instance.cls = cls;
					t.instance.def = t.element.attr('default');

					if (t.instance.def)
						t.instance.def = new Function('return ' + t.instance.def);

					extensions = T.db.extensions[t.instance.name];
					reference = '$totalcomponent';
					T.components.push(t.instance);
					break;
				case 'bind':
					reference = '$totalbinder';
					T.binders.push(t.instance);
					break;
			}

			if (reference)
				t.element[0][reference] = t.instance;

			if (extensions) {
				for (let m of extensions) {
					if (m.config) {
						for (let key in m.config)
							t.instance.config[key] = m.config[key];
					}
				}
			}

			t.ref.callback && t.ref.callback.call(t.instance, t.instance, t.instance.config, cls);

			if (extensions) {
				for (let m of extensions)
					m.callback.call(t.instance, t.instance, t.instance.config, cls);
				delete T.cache.lockers[t.name];
				delete T.cache.lockers[t.path];
			}

			t.instance.$init();

			// pending
			if (t.pending) {
				for (let proxy of t.pending)
					proxy.init(proxy);
				delete t.pending;
			}

		}

		PROTO.init = function(t) {

			if (t.ready)
				return;

			// Check if the Total.js UI library is initialized
			if (!T.ready) {
				setTimeout(t => t.init(t), 300, t);
				return;
			}

			// Inline plugin definition
			if (t.type !== 'plugin') {
				let plugin = t.element.attr('plugin');
				if (plugin) {
					let pp = t.dom.$proxyplugin;
					if (pp) {
						if (!pp.ready) {
							pp.pending.push(t);
							return;
						}
					} else {
						T.newplugin(t.element, plugin).pending.push(t);
						return;
					}
				}
			}

			if (t.type === 'import') {

				let url = t.path || t.config.url;

				if (!T.cache.external[url]) {
					T.cache.external[url] = true;
					WARN(ERR.format('Downloading "{0}".').format(url));
				}

				IMPORT(url, t.element, function() {
					t.ready = true;
					for (let proxy of t.pending)
						proxy.init(proxy);
					delete t.pending;
				});

				return;
			}

			let tmp;

			if (t.type === 'plugin' && !t.instance) {

				let last = T.cache.plugins.shift();

				if (!t.path)
					t.path = last || '';

				if (t.path === '*')
					t.path = DEF.pathcommon.substring(0, DEF.pathcommon.length - 1);

				tmp = T.db.plugins[t.path];
				t.ref = tmp;

				if (t.path.includes(' ') && t.path.includes('?'))
					t.path = DEF.pathplugins + GUID(10).replace(/^[0-9]/g, 'x');

				if (!tmp) {
					WARN(ERR.format('The plugin "{0}" not found'.format(t.path)));
					return;
				}

				t.instance = new T.Plugin(t);

			} else if (t.type === 'component' && !t.instance) {

				if (!t.lazy) {
					let index = t.name.indexOf(' ');
					if (index !== -1) {
						if (t.name.substring(0, 5).toUpperCase() === 'LAZY ') {
							t.name = t.name.substring(5);
							T.db.lazy[t.name] = t;
							return;
						}
					}
				}

				tmp = T.db.components[t.name];
				if (!tmp) {

					if (t.fallback) {
						WARN(ERR.format('The component "{0}" not found'.format(t.name)));
						return;
					}

					// Try to download component from CDN
					if (!T.cache.external[t.name]) {
						T.cache.external[t.name] = true;
						WARN(ERR.format('Downloading "{0}" component.').format(t.name));
					}

					IMPORT(DEF.fallback.format(t.name), function() {
						t.fallback = true;
						t.init(t);
					});
					return;
				}

				t.instance = new T.Component(t);
				t.ref = tmp;
			} else if (t.type === 'bind' && !t.instance) {
				t.ref = { config: t.config };
				t.instance = new T.Binder(t, t.config, t.element);
			}

			if (t.path.includes('?')) {
				// absolute path
				let parent = findplugin(t.type === 'plugin' ? t.dom.parentNode : t.dom);
				if (parent) {
					let proxy = parent.$proxyplugin;
					if (proxy && proxy.ready) {
						// @TODO: missing skipper "?1" or "?3"
						t.parent = proxy.element;
						t.path = t.path.replace(/\?/g, proxy.path);
					} else {
						setTimeout(t.init, 50, t);
						return;
					}
				} else {
					WARN(ERR.format('The element "{0}" does not have defined parent plugin'.format(t.path)), t.element[0]);
					return;
				}
			}

			if (t.ref.dependencies) {
				if (!(t.ref.dependencies instanceof Array))
					t.ref.dependencies = t.ref.dependencies.split(',').trim();
				t.ref.dependencies.wait(IMPORT, () => init(t));
			} else
				init(t);
		};

	})();

	T.newplugin = function(element, path, config, callback) {
		element[0].$proxyplugin = new T.Proxy('plugin', element, path, path, config, callback);
		return element[0].$proxyplugin;
	};

	T.newcomponent = function(element, name, path, config, callback) {
		[0].$proxycomponent = new T.Proxy('component', element, name, path, config, callback);
		return element[0].$proxycomponent;
	};

	T.newbinder = function(element, path, config, callback) {
		element[0].$proxybinder = new T.Proxy('bind', element, path, path, config, callback);
		return element[0].$proxybinder;
	};

	T.newimporter = function(element, path, config, callback) {
		element[0].$proxyimporter = new T.Proxy('import', element, path, path, config, callback);
		return element[0].$proxyimporter;
	};

	register('ui-component', function(el) {
		el = $(el);
		T.newcomponent(el, el.attr('name'), el.attr('path'), el.attr('config'));
	}, function(el, property, value) {
		// attribute is changed
	});

	register('ui-plugin', function(el) {
		el = $(el);
		let path = el.attr('path');
		T.newplugin(el, path, path, el.attr('config'));
	}, function(el, property, value) {
		// attribute is changed
	});

	register('ui-bind', function(el) {
		el = $(el);
		let path = el.attr('path');
		T.newbinder(el, path, el.attr('config'));
	}, function(el, property, value) {
		// attribute is changed
	});

	register('ui-import', function(el) {
		el = $(el);
		T.newimporter(el, el.attr('path'), el.attr('config'));
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
			t.ERROR = false;

			path = path.replace(' ERROR', function(text) {
				t.ERROR = true;
				return '';
			});

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

			path = path.replace(/<.*?>/g, function(text) {
				t.cache = text.substring(1, text.length - 1).trim();
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

			if (t.path == 'null')
				t.path = '';

			t.split = splitpath(path);

			let c = t.path.charAt(0);

			if (c === '%')
				t.path = DEF.pathtmp + t.path.substring(1);
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

			if (!path)
				return this;

			var c = path.charAt(0);

			// *common, #cl, %temp

			switch (c) {
				case '*':
					let tmp = DEF.pathcommon;
					path = path.substring(1);
					if (path)
						tmp += path;
					else
						tmp = tmp.substring(0, tmp.length - 1);
					return parsepath(tmp);
				case '#':
					path = path.substring(1);
					return parsepath(DEF.pathcl + path);
				case '%':
					path = path.substring(1);
					return parsepath(DEF.pathtmp + path);
			}

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
			return this.path ? T.get(scope, this.path) : undefined;
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
					return t.get(t.scope, '@reset @modified') || {};
				}
			});
		};

		var PROTO = T.Plugin.prototype;

		// Internal
		PROTO.$init = function() {
			var t = this;
			if (t.proxy.callback) {
				t.proxy.callback();
				t.proxy.callback = null;
			}
			t.ready = true;
			t.make && t.make();
		};

		/*
			@Path: Plugin
			@Method: instance.parent(selector); #selector {String};
			The method tries to find parent element according to the selector.
		*/
		PROTO.parent = parent;

		PROTO.alias = function(name) {
			T.plugins[name] = this;
		};

		PROTO.setter = PROTO.SETTER = function(name, a, b, c, d) {
			T.setter(this.element, name, a, b, c, d);
		};

		PROTO.cmd = PROTO.CMD = function(name, a, b, c, d) {
			T.cmd(this.element, name, a, b, c, d);
		};

		PROTO.tapi = function(name, data, callback) {

			var type = typeof(data);

			if (!callback && (type === 'string' || type === 'function')) {
				callback = data;
				data = null;
			}

			var t = this;
			data = { schema: name, data: data ? data : undefined };
			return t.ajax('POST ' + DEF.api, data, callback);
		};

		PROTO.ajax = function(url, data, callback) {

			var t = this;
			var type = typeof(data);

			if (!callback && (type === 'string' || type === 'function')) {
				callback = data;
				data = null;
			}

			type = typeof(callback);

			if (type === 'function')
				return AJAX(url, data, callback, t.scope);
			else if (type === 'string')
				return AJAX(url, data, response => t.set(callback, response), t.scope);
			else
				return AJAX(url, data, NOOP, t.scope);
		};

		PROTO.exec = function(name, a, b, c, d, e) {
			var t = this;
			var path = parsepath(name);
			var fn = t[path.path];
			if (fn)
				path.exec(() => fn(a, b, c, d, e));
			else
				WARN(ERR.format('The method "{0}/{1}" not found.'.format(t.name, path.path)));
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

			if (path.flags.reset || path.flags.default) {
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
			@Method: instance.set(path, value)
			The method assigns a `value` based on a `path` to the defined plugin `scope`.
		*/
		PROTO.nul = function(path) {
			var t = this;
			path = t.path.assign(path);
			path.set(t.scope, null);
			path.notify(t.scope);
		};

		/*
			@Path: Plugin
			@Method: instance.update(path)
			The method notifies all components and watchers based on the path.
		*/
		PROTO.update = function(path) {
			var t = this;
			path = t.path.assign(path);
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

			if (t.$removed)
				return;

			t.$removed = true;

			try {
				t.destroy && t.destroy();
			} catch (e) {
				WARN(ERR.format(e));
			}

			// Remove all pointers (with all aliases)
			for (let key in T.plugins) {
				if (T.plugins[key] === t)
					delete T.plugins[key];
			}

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
			t.commands = {};
			t.watchers = [];

			// Backward compatibility
			t.$ready = true;
			t.ID = t.id = GUID(10);

		};

		var PROTO = T.Component.prototype;

		// Internal
		PROTO.$init = function() {

			var t = this;
			t.ready = true;

			try {

				if (!T.db.components[t.name].init) {
					T.db.components[t.name].init = true;
					t.init && t.init();
				}

				t.make && t.make();
				t.reconfigure(t.config, true);
				t.$setter(t.get(), t.path.path, { init: 1 });
			} finally {
				if (t.proxy.callback) {
					t.proxy.callback();
					t.proxy.callback = null;
				}
			}
		};

		// Deprecated
		PROTO.bindvisible = NOOP;
		PROTO.nocompile = NOOP;

		// Backward compatibility
		PROTO.autobind = function() {

			var t = this;

			if (t.$binded)
				return;

			t.$binded = true;

			var selector = 'input,select,textarea';
			var timeout = null;
			var prev = null;

			var updateforce = function() {
				timeout = null;
				var value = t.find(selector).val();
				if (value !== prev)
					t.rewrite(value);
			};

			var update = function() {
				timeout && clearTimeout(timeout);
				timeout = setTimeout(updateforce, 200);
			};

			t.element.on('input', selector, function() {
				t.config.modified = true;
				prev = $(this).val();
				t.rewrite(prev);
			}).on('focusin', selector, function() {
				prev = $(this).val();
				t.config.touched = true;
			}).on('change', selector, function() {
				t.config.modified = true;
				update();
			}).on('blur', selector, function() {
				t.config.touched = true;
				update();
			});
		};

		/*
			@Path: Component
			@Method: instance.readonly();
			The method disables validation.
		*/
		PROTO.readonly = function() {
			this.internal.readonly = true;
		};

		PROTO.blind = function() {
			var t = this;
			t.internal.blind = true;
			var index = T.components.indexOf(t);
			if (index !== -1)
				T.components.splice(index, 1);
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
			@Method: instance.set(value, [flags]); #value {String}; #[flags] {String} with @;
			The method assigns a value to the model and calls `setter`.
		*/
		PROTO.set = function(value, flags) {
			var t = this;
			if (t.path.path) {
				t.path.set(t.scope, value);
				t.path.notify(t.scope, flags);
			} else
				WARN(ERR.format('The component "{0}" does not have a defined path'.format(t.name), t));
		};

		/*
			@Path: Component
			@Method: instance.rewrite(value, [flags]); #value {String}; #[flags] {String} with @;
			The method assigns a value to the model without calling the setter.
		*/
		PROTO.rewrite = function(value, flags) {
			this.skip = true;
			this.set(value, flags);
		};

		/*
			@Path: Component
			@Method: instance.get();
			The method reads a value from the model.
		*/
		PROTO.get = function() {
			return this.path.get(this.scope);
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
			@Method: instance.parent(selector); #selector {String};
			The method tries to find parent element according to the selector.
		*/
		PROTO.parent = parent;

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

		PROTO.change = function() {
			var t = this;
			t.config.touched = true;
			t.config.modified = true;
			t.$validate();
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

		PROTO.tclass = function(cls, v) {
			var t = this;
			t.element.tclass(cls, v);
			return t;
		};

		PROTO.aclass = function(cls, timeout) {
			var t = this;
			if (timeout)
				setTimeout(t => t.element.aclass(cls), timeout, t);
			else
				t.element.aclass(cls);
			return t;
		};

		PROTO.hclass = function(cls) {
			return this.element.hclass(cls);
		};

		PROTO.rclass = function(cls, timeout) {
			var t = this;
			var e = t.element;
			if (timeout)
				setTimeout(e => e.rclass(cls), timeout, e);
			else {
				if (cls)
					e.rclass(cls);
				else
					e.rclass();
			}
			return t;
		};

		PROTO.rclass2 = function(search) {
			this.element.rclass2(search);
			return this;
		};

		PROTO.html = function(value) {
			var el = this.element;
			if (value === undefined)
				return el.html();
			if (value instanceof Array)
				value = value.join('');
			var type = typeof(value);
			var v = (value || TNB[type]) ? el.empty().append(value) : el.empty();
			return v;
		};

		PROTO.text = function(value) {
			var el = this.element;
			if (value === undefined)
				return el.text();
			if (value instanceof Array)
				value = value.join('');
			var type = typeof(value);
			return (value || TNB[type]) ? el.empty().text(value) : el.empty();
		};

		PROTO.empty = function() {
			var t = this;
			t.element.empty();
			return t;
		};

		PROTO.append = function(value) {
			var el = this.element;
			if (value instanceof Array)
				value = value.join('');
			return value ? el.append(value) : el;
		};


		PROTO.autofocus = function(selector, counter) {
			autofocus(this.element, selector, counter);
			return this;
		};

		PROTO.css = function(name, value) {
			var el = this.element;
			if (value === undefined)
				return el.css(name);
			el.css(name, value);
			return this;
		};

		PROTO.event = function() {
			var t = this;
			t.element.on.apply(t.element, arguments);
			return t;
		};

		PROTO.find = function(selector) {
			var el = this.element;
			if (selector && typeof(selector) === 'object')
				return el.multiple(selector);
			return el.find(selector);
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
				t.configure && t.configure(key, value[key], init ? null : t.config[key], init);
				t.config[key] = value[key];
			}

			if (value.$assign)
				T.set(T.scope, value.$assign, t);

			if (value.$class)
				t.element.tclass(value.$class);

			if (value.$id)
				t.ID = t.id = value.$id;

			// if (value.$init) {
			// 	EXEC();
			// }

		};

		/*
			@Path: Component
			@Method: instance.refresh();
			The method refreshes value (in other words, it calls instance.setter()).
		*/
		PROTO.refresh = function() {
			var t = this;
			t.$setter(t.get(), t.path.path, { refresh: 1 });
		};

		/*
			@Path: Component
			@Method: instance.command(name, callback); #name {String}; #callback {Function(a, b, c, d, e)}
			The method registers a new command.
		*/
		PROTO.command = function(name, callback) {
			var t = this;
			if (t.commands[name])
				t.commands[name].push(callback);
			else
				t.commands[name] = [callback];
		};

		/*
			@Path: Component
			@Method: instance.CMD(name, [a], [b], [c], [d]); #name {String}; #[a] {Object}; #[b] {Object}; #[c] {Object}; #[d] {Object};
			The method executes a command with custom arguments.
		*/
		PROTO.CMD = function(name, a, b, c, d, e) {
			var t = this;
			var commands = t.commands[name];
			if (commands) {
				for (let fn of commands)
					fn(a, b, c, d, e);
			}
		};

		/*
			@Path: Component
			@Method: instance.icon(value); #value {String};
			The method checks if it is needed to add the icon prefix defined in `DEF.iconprefix`.
		*/
		PROTO.icon = function(value) {
			return value ? ((value.includes(' ') ? DEF.iconprefix : '') + value) : '';
		};

		/*
			@Path: Component
			@Method: instance.replace(target, [remove]); #target {Element/jQuery}; #[remove] {Boolean};
			The method moves the component into another element defined in the `target` argument.
		*/
		PROTO.replace = function(target, remove) {
			var t = this;
			var prev = t.element;
			delete t.dom.$totalcomponent;
			remove && prev.off().remove();
			t.element = $(target);
			t.dom = t.element[0];
			t.dom.$totalcomponent = t;
			return t;
		};

		// Internal method
		PROTO.$state = function() {
			var t = this;
			var cls = t.element[0].classList;
			cls.toggle('ui-touched', t.config.touched == true);
			cls.toggle('ui-modified', t.config.modified == true);
			cls.toggle('ui-disabled', t.config.disabled == true);
			cls.toggle('ui-invalid', t.config.invalid == true);
			t.state && t.state();
		};

		// Internal method
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

			if ((flags.init || flags.default) && (value == null) && t.def) {
				value = t.def();
				t.rewrite(value);
			}

			if (t.skip)
				t.skip = false;
			else if (t.setter)
				t.setter(value, path, flags);

			t.$validate();
		};

		// Internal method
		PROTO.$remove = function() {
			var t = this;

			if (t.$removed)
				return;

			t.$removed = true;

			try {
				t.destroy && t.destroy();
			} catch (e) {
				WARN(ERR.format(e));
			}

			var index = T.components.indexOf(t);
			if (index !== -1)
				T.components.splice(index, 1);

			t.element.remove();
		};

		// Backward compatibility
		PROTO.formatter = NOOP;
		PROTO.parser = NOOP;

	})();

	// Binder declaration
	(function() {

		function compile(value) {
			return new Function('element', 'path', 'value', 'var el = element;return ' + value);
		}

		T.Binder = function(proxy) {
		};

		function reconfigure(el, config) {
			var arr = el.find('ui-component');
			for (let m of arr)
				m.$totalcomponent.reconfigure(config);
		}

		var PROTO = T.Binder.prototype;
		var DEFMODEL = {};

		PROTO.$init = function() {

			let t = this;
			let proxy = t.proxy;

			t.ready = true;

			var el = proxy.element;
			var selector = el.attr('element');

			if (selector)
				el = $(selector);
			else {
				selector = el.attr('child');
				if (selector) {
					el = el.find(selector);
				} else {
					selector = el.attr('parent');
					if (selector)
						el = el.closest(selector);
					else
						el = t.element;
				}
			}

			let config = proxy.config;
			let commands = [];

			t.config = config;
			t.element = proxy.element;
			t.target = el;
			t.path = proxy.path;
			t.empty = '';

			if (t.path.charAt(0) === '!') {
				t.notnull = true;
				t.path = t.path.substring(1);
			}

			t.path = parsepath(t.path);

			for (let key in config) {

				let cmd = {};
				let arg = key.replace(/\s\+\s/g, '+').split(' ');

				cmd.name = arg[0];
				cmd.name = cmd.name.replace(/^(~!|!~|!|~)/, function(text) {
					if (text.includes('!'))
						cmd.notnull = true;
					if (text.includes('~'))
						cmd.visible = true; // not implemented
					return '';
				});

				cmd.clone = cmd.name.split('+');
				cmd.name = cmd.clone[0];
				cmd.clone.shift();

				if (cmd.name.charAt(0) === '.')
					cmd.isclass = 1;

				cmd.priority = 10;

				var value = cmd.value = config[key];

				if (cmd.name === 'attr') {
					cmd.attr = arg[1];
					cmd.selector = arg[2];
				} else if (arg[1])
					cmd.selector = arg[1];

				switch (cmd.name) {

					case 'track':
						t.track = t.replaceplugin(value).split(',').trim();
						break;
					case 'once':
					case 'strict':
					case 'changes':
						t[cmd.name] = true;
						break;
					case 'empty':
						t[cmd.name] = value || DEF.empty;
						break;
					case 'class':
					case 'assign':
						t[cmd.name] = t.replaceplugin(value);
						break;
					case 'delay':
						t[cmd.name] = (value || '100').parseInt();
						break;
					case 'focus':
						commands.push(cmd);
						break;
					case 'helpers':
						t[cmd.name] = new Function('scope', 'return Total.get(scope, "{0}")'.format(t.replace(value)));
						break;
					case 'exec':
					case 'refresh':
						cmd.value = t.replaceplugin(value);
						commands.push(cmd);
						break;
					case 'check':
						t[cmd.name] = parsepath(cmd.value);
						break;
					case 'template':

						if (value && value.charAt(0) === '{') {
							// external selector
							cmd.template = $(value.substring(1, value.length - 1)).html();
						} else {
							let scr = t.element.find('script,template');
							if (scr.length) {
								cmd.template = scr.html();
								scr.remove();
							} else
								cmd.template = t.element.html();
							if (value)
								cmd.vdom = value.split('->').trim();
						}

						el.empty();

						cmd.template = Tangular.compile(cmd.template);
						commands.push(cmd);
						break;
					default:

						if (cmd.value) {
							if (cmd.name !== 'resize')
								cmd.fn = compile(cmd.value);
						}

						switch (cmd.name) {
							case 'show':
							case 'hide':
								cmd.priority = 0;
								break;
							case 'visible':
							case 'invisible':
								cmd.priority = 2;
								break;
						}

						if (cmd.isclass)
							cmd.name = cmd.name.substring(1);

						commands.push(cmd);
						break;
				}

			}

			for (let cmd of commands) {
				if (cmd.clone.length > 1) {
					for (let key of cmd.clone) {
						let tmp = CLONE(cmd);
						tmp.name = key;
						delete tmp.clone;
						commands.push(tmp);
					}
				}
				delete cmd.clone;
			}

			commands.quicksort('priority')
			t.commands = commands;

			if (t.proxy.callback) {
				t.proxy.callback();
				t.proxy.callback = null;
			}
		};

		PROTO.replaceplugin = function(val) {
			var t = this;
			return t.plugin ? val.replace(/\?/, t.plugin.path.path) : val;
		};

		PROTO.fn = function(path, value, flags, nodelay) {

			let t = this;

			t.value = value;

			if (!t.loaded) {

				if (t.assign) {
					T.set(t.scope, t.assign, t);
					T.notify(t.scope, t.assign);
					delete t.assign;
				}

				if (t.init) {
					T.exec(t.init, t);
					delete t.init;
				}

				t.loaded = true;
			}

			if (t.notnull && (value === null || value === undefined))
				return;

			if (t.strict && t.path.path !== path.path)
				return;

			if (t.track) {
				let is = false;
				for (let m of t.track) {
					if (path.path.includes('.' + m)) {
						is = true;
						break;
					}
				}
				if (!is)
					return;
			}

			if (t.check) {
				let check = t.check.get(t.scope);
				if (typeof(check) === 'function') {
					if (!check(value, path, t.element))
						return;
				} else
					WARN(ERR.format('the check "{0}" command does not exist'.format(t.check)), t.dom);
			}

			if (t.delay && !nodelay) {
				t.timeout && clearTimeout(t.timeout);
				t.timeout = setTimeout((path, value, flags) => this.fn(path, value, flags, true), t.delay, path, value, flags);
				return;
			}

			if (t.changes) {
				let hash = HASH(value);
				if (hash === t.hash)
					return;
				t.hash = hash;
			}

			for (let m of t.commands) {

				let el = t.element;

				if (m.selector)
					el = el.find(m.selector);

				var val = m.fn ? m.fn(el, path, value, flags) : value;

				if (m.notnull && val == null)
					continue;

				if (m.isclass) {
					el.tclass(m.name, !!val);
					continue;
				}

				switch (m.name) {
					case 'template':

						DEFMODEL.value = value;
						DEFMODEL.path = path;
						DEFMODEL.element = el;

						if (m.vdom)
							DIFFDOM(el, m.vdom[0], m.template(DEFMODEL, null, m.helpers ? m.helpers(t.scope) : null), m.vdom[1]);
						else
							el.html(m.template(DEFMODEL, null, m.helpers ? m.helpers(t.scope) : null));

						break;
					case 'resize':
						T.setter(el, (value || '*') + '/resize');
						break;
					case 'exec':
					case 'refresh':
						T.exec(m.value, value, path, el);
						break;
					case 'focus':
						setTimeout(autofocus, 500, el, m.value);
						break;
					case 'required':
						reconfigure(el, { required: !!val });
						break;
					case 'disabled':
						reconfigure(el, { disabled: !!val });
						el.find('input,select,textarea').prop('disabled', !!val);
						break;
					case 'enabled':
						reconfigure(el, { disabled: !val });
						el.find('input,select,textarea').prop('disabled', !val);
						break;
					case 'attr':
						el.attr(m.attr, val);
						break;
					case 'checked':
						el.find('input').prop('checked', !!val);
						break;
					case 'show':
						el.tclass('hidden', !val);
						break;
					case 'hide':
						el.tclass('hidden', !!val);
						break;
					case 'visible':
						el.tclass('invisible', !val);
						break;
					case 'invisible':
						el.tclass('invisible', !!val);
						break;
					case 'html':
						el.html(val == null || val == '' ? t.empty : val.toString());
						break;
					case 'text':
						el.text(val == null || val == '' ? t.empty : val.toString());
						break;
					case 'value':
						el.val(val == null || val == '' ? t.empty : val.toString());
						break;
					case 'title':
					case 'href':
					case 'src':
						el.attr(m.name, val == null || val == '' ? t.empty : val.toString());
						break;
				}
			}

			if (t.class) {
				t.element.tclass(t.class);
				delete t.class;
			}

			// remove
			if (t.once) {
				t.fn = null;
				let index = T.binders.indexOf(t);
				if (index !== -1)
					T.binders.splice(index, 1);
			}

		};

		// Internal method
		PROTO.$remove = function() {
			var t = this;
			if (!t.$removed) {
				t.$removed = true;
				var index = T.binders.indexOf(t);
				if (index !== -1)
					T.binders.splice(index, 1);
				t.element.remove();
			}
		};

	})();

	// String prototypes
	(function() {

		var PROTO = String.prototype;

		/*
			@Path: String prototype
			@Method: String.prototype.format([index0], [index1], [index2]);
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
			@Method: String.prototype.env();
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
			@Method: String.prototype.parseConfig();
			The method parses Total.js UI library configuration in the form `key1:value;key2:value`.
		*/
		PROTO.parseConfig = function(noconvert) {

			let arr = this.replace(/\\;/g, '\0').split(';');
			let colon = /(https|http|wss|ws):\/\//gi;
			let output = {};
			let regnum = /^(-)?[0-9.]+$/;

			for (let m of arr) {

				let item = m.replace(/\0/g, ';').replace(/\\:/g, '\0').replace(colon, text => text.replace(/:/g, '\0'));
				let kv = item.split(':');
				let l = kv.length;

				let k = kv[0].trim().env();
				let v = l === 2 ? kv[1].trim().replace(/\0/g, ':').env() : null;

				if (noconvert !== true) {
					if (v === 'true' || v === 'false')
						v = v === 'true';
					else if (regnum.test(v)) {
						let tmp = +v;
						if (!isNaN(tmp))
							v = tmp;
					}
				}

				output[k] = v;
			}

			return output;
		};

		/*
			@Path: String.prototype
			@Method: String.prototype.isJSONDate(); #return {Boolean};
			The method checks if the string is a serialized JSON date.
		*/
		PROTO.isJSONDate = function() {
			var t = this;
			var l = t.length - 1;
			return l > 18 && l < 30 && t.charCodeAt(l) === 90 && t.charCodeAt(10) === 84 && t.charCodeAt(4) === 45 && t.charCodeAt(13) === 58 && t.charCodeAt(16) === 58;
		};

		/*
			@Path: String.prototype
			@Method: String.prototype.VARIABLES(args); #args {Object}; #return {String};
			The method applies `--VARIABLE--` defined in the `args` argument in the current string.
		*/
		PROTO.VARIABLES = function(args) {

			var str = this;

			if (!args)
				args = {};

			str = str.replace(/--(\s)?[a-zA-Z\s]+=+.*?--/g, function(text) {
				var is = false;
				for (var i = 2; i < text.length; i++) {
					var c = text.charAt(i);
					if (c === '=') {
						args[text.substring(2, i).trim()] = text.substring(i + 1, text.length - 2).trim();
						is = true;
						break;
					}
				}
				return is ? '' : text;
			});

			return str.replace(/--\w+--/g, text => args[text.substring(2, text.length - 2).trim()] || text);
		};

		PROTO.padLeft = function(t, e) {
			var r = this + '';
			return Array(Math.max(0, t - r.length + 1)).join(e || ' ') + r;
		};

		PROTO.padRight = function(t, e) {
			var r = this + '';
			return r + Array(Math.max(0, t - r.length + 1)).join(e || ' ');
		};


		PROTO.parseInt = function(def) {
			var str = this.trim();
			var val = str.match(DEF.regexp.int);
			if (!val)
				return def || 0;
			val = +val[0];
			return isNaN(val) ? def || 0 : val;
		};

		PROTO.parseFloat = function(def) {
			var str = this.trim();
			var val = str.match(DEF.regexp.float);
			if (!val)
				return def || 0;
			val = val[0];
			if (val.indexOf(',') !== -1)
				val = val.replace(',', '.');
			val = +val;
			return isNaN(val) ? def || 0 : val;
		};

		/*
			@Path: String.prototype
			@Method: String.prototype.args(obj, [encode]); #obj {Object} payload, #encode {String/Function(key, value)} supported values `json`, `escape` and `encode`; #return {String};
			The method checks if the string is a serialized JSON date.
		*/
		PROTO.args = function(obj, encode, def) {

			var isfn = typeof(encode) === 'function';

			return this.replace(/\{{1,2}[a-z0-9_.-\s]+\}{1,2}/gi, function(text) {

				// Is double?
				var l = text.charCodeAt(1) === 123 ? 2 : 1;
				var key = text.substring(l, text.length - l).trim();
				var val = T.get(obj, key);

				if (isfn)
					return encode(val, key);

				switch (encode) {
					case 'json':
						return JSON.stringify(val);
					case 'encode':
						return val ? encodeURIComponent(val + '') : (val == null ? '' : val);
					case 'escape':
						return val ? Thelpers.encode(val + '') : (val == null ? '' : val);
				}

				return val === undefined ? text : val === null ? '' : (val + '');
			});
		};

	})();

	// Number prototypes
	(function() {

		var PROTO = Number.prototype;

		PROTO.padLeft = function(t, e) {
			return (this + '').padLeft(t, e || '0');
		};

		PROTO.padRight = function(t, e) {
			return (this + '').padRight(t, e || '0');
		};

		PROTO.floor = function(decimals) {
			return Math.floor(this * Math.pow(10, decimals)) / Math.pow(10, decimals);
		};

		PROTO.parseDate = function(offset) {
			return new Date(this + (offset || 0));
		};

		PROTO.round = function(decimals) {
			if (decimals == null)
				decimals = 0;
			return +(Math.round(this + 'e+' + decimals) + 'e-' + decimals);
		};

		PROTO.currency = function(currency, a, b, c) {
			if (currency == null)
				currency = DEF.currency;
			if (currency.charAt(0) === '[')
				currency = currency.env();
			var curr = DEF.currencies[currency];
			return curr ? curr(this, a, b, c) : this.format(2);
		};

		PROTO.format = function(decimals, separator, separatorDecimal) {

			var self = this;
			var num = self + '';
			var dec = '';
			var output = '';
			var minus = num.charAt(0) === '-' ? '-' : '';
			if (minus)
				num = num.substring(1);

			var index = num.indexOf('.');

			if (typeof(decimals) === 'string') {
				var tmp;
				if (decimals.charAt(0) === '[') {
					tmp = W.ENV(decimals.substring(1, decimals.length - 1));
					if (tmp) {
						if (tmp >= 0) {
							decimals = tmp;
						} else {
							decimals = tmp.decimals;
							if (tmp.separator)
								separator = tmp.separator;
							if (tmp.decimalseparator)
								separatorDecimal = tmp.decimalseparator;
						}
					}
				} else {
					tmp = separator;
					separator = decimals;
					decimals = tmp;
				}
			}

			if (separator === undefined)
				separator = DEF.thousandsseparator;

			if (index !== -1) {
				dec = num.substring(index + 1);
				num = num.substring(0, index);
			}

			index = -1;
			for (var i = num.length - 1; i >= 0; i--) {
				index++;
				if (index > 0 && index % 3 === 0)
					output = separator + output;
				output = num[i] + output;
			}

			if (decimals || dec.length) {
				if (dec.length > decimals)
					dec = dec.substring(0, decimals || 0);
				else
					dec = dec.padRight(decimals || 0, '0');
			}

			if (dec.length && separatorDecimal === undefined)
				separatorDecimal = DEF.decimalseparator;

			return minus + output + (dec.length ? separatorDecimal + dec : '');
		};

	})();

	// Array prototypes
	(function() {

		var PROTO = Array.prototype;

		var lcomparer = function(a, b) {
			if (!a && !b)
				return 0;
			if (!a && b)
				return -1;
			if (a && !b)
				return 1;
			return W.Intl ? W.Intl.Collator().compare(a, b) : (a + '').localeCompare(b + '');
		};

		var lcomparer_desc = function(a, b) {
			if (!a && !b)
				return 0;
			if (!a && b)
				return 1;
			if (a && !b)
				return -1;
			return (W.Intl ? W.Intl.Collator().compare(a, b) : (a + '').localeCompare(b + '')) * -1;
		};

		var sortcomparer = function(sort) {

			var key = 'sort_' + sort;
			var meta = T.cache.tmp[key];

			if (!meta) {
				meta = [];
				sort = sort.replace(/\s/g, '').split(',');
				for (var i = 0; i < sort.length; i++) {
					var tmp = sort[i].split((/_(desc|asc)/));
					var obj = { name: tmp[0], type: null, desc: tmp[1] === 'desc' };
					if (tmp[0].indexOf('.') !== -1)
						obj.read = new Function('val', 'return val.' + tmp[0].replace(/\./g, '?.'));
					meta.push(obj);
				}
				T.cache.tmp[key] = meta;
			}

			return function(a, b) {
				for (var i = 0; i < meta.length; i++) {
					var col = meta[i];
					var va = col.read ? col.read(a) : a[col.name];
					var vb = col.read ? col.read(b) : b[col.name];

					if (!col.type) {
						if (va != null)
							col.type = va instanceof Date ? 4 : typeof(va);
						else if (vb != null)
							col.type = vb instanceof Date ? 4: typeof(vb);
						switch (col.type) {
							case 'string':
								col.type = 1;
								break;
							case 'number':
								col.type = 2;
								break;
							case 'boolean':
								col.type = 3;
								break;
							case 'object':
								col.type = 5;
								break;
						}
					}

					if (col.type) {
						switch (col.type) {
							case 1:
								tmp = col.desc ? lcomparer_desc(va, vb) : lcomparer(va, vb);
								if (tmp)
									return tmp;
								break;
							case 2:
								tmp = va > vb ? (col.desc ? -1 : 1) : va < vb ? (col.desc ? 1 : -1) : 0;
								if (tmp)
									return tmp;
								break;
							case 3:
								tmp = va === true && vb === false ? (col.desc ? -1 : 1) : va === false && vb === true ? (col.desc ? 1 : -1) : 0;
								if (tmp)
									return tmp;
								break;
							case 4:

								if (!va && !vb)
									break;

								if (va && !vb)
									return col.desc ? -1 : 1;

								if (!va && vb)
									return col.desc ? 1 : -1;

								if (!va.getTime)
									va = new Date(va);

								if (!vb.getTime)
									vb = new Date(vb);

								tmp = va > vb ? (col.desc ? -1 : 1) : va < vb ? (col.desc ? 1 : -1) : 0;

								if (tmp)
									return tmp;

								break;
						}
					} else
						return 0;
				}

				return 0;
			};
		}

		PROTO.quicksort = function(sort) {

			var self = this;
			if (self.length < 2)
				return self;

			var self = this;

			// Backward compatibility
			if (!sort || sort === true) {
				self.sort(lcomparer);
				return self;
			}

			// Backward compatibility
			if (sort === false) {
				self.sort(lcomparer_desc);
				return self;
			}

			var args = arguments;
			if (args[1] === false || args[1] === 'desc' || args[1] === 2)
				sort += '_desc';

			self.sort(sortcomparer(sort));
			return self;
		};

		/*
			@Path: Array.prototype
			@Method: Array.prototype.trim(); #return {Array};
			The method trims all string values, and empty values will be skipped.
		*/
		PROTO.trim = function() {
			var self = this;
			var output = [];
			for (var i = 0; i < self.length; i++) {
				if (typeof(self[i]) === 'string')
					self[i] = self[i].trim();
				if (self[i])
					output.push(self[i]);
			}
			return output;
		};

		PROTO.findIndex = function(cb, value) {

			var self = this;
			var isFN = typeof(cb) === 'function';
			var isV = value !== undefined;

			for (var i = 0; i < self.length; i++) {
				if (isFN) {
					if (cb.call(self, self[i], i))
						return i;
				} else if (isV) {
					if (self[i][cb] === value)
						return i;
				} else if (self[i] === cb)
					return i;
			}
			return -1;
		};

		PROTO.findAll = function(cb, value) {

			var self = this;
			var isFN = typeof(cb) === 'function';
			var isV = value !== undefined;
			var arr = [];

			for (var i = 0; i < self.length; i++) {
				if (isFN) {
					cb.call(self, self[i], i) && arr.push(self[i]);
				} else if (isV) {
					self[i][cb] === value && arr.push(self[i]);
				} else
					self[i] === cb && arr.push(self[i]);
			}
			return arr;
		};

		PROTO.findItem = function(cb, value) {
			var index = this.findIndex(cb, value);
			if (index !== -1)
				return this[index];
		};

		PROTO.findValue = function(cb, value, path, def, cache) {

			if (typeof(cb) === 'function') {
				def = path;
				path = value;
				value = undefined;
				cache = false;
			}

			var key, val = def;

			if (cache) {
				key = 'fv_' + cb + '=' + value;
				if (temp[key])
					return temp[key];
			}

			var index = this.findIndex(cb, value);
			if (index !== -1) {
				var item = this[index];
				if (path.indexOf('.') === -1)
					item = item[path];
				else
					item = get(path, item);
				cache && (temp[key] = val);
				val = item == null ? def : item;
			}

			return val;
		};

		PROTO.remove = function(cb, value) {

			var self = this;
			var arr = [];
			var isFN = typeof(cb) === 'function';
			var isV = value !== undefined;

			for (var i = 0; i < self.length; i++) {
				if (isFN) {
					!cb.call(self, self[i], i) && arr.push(self[i]);
				} else if (isV) {
					self[i][cb] !== value && arr.push(self[i]);
				} else {
					self[i] !== cb && arr.push(self[i]);
				}
			}
			return arr;
		};

		PROTO.wait = function(onItem, callback, thread, tmp) {

			var self = this;
			var init = false;

			// INIT
			if (!tmp) {

				if (typeof(callback) !== 'function') {
					thread = callback;
					callback = null;
				}

				tmp = {};
				tmp.pending = 0;
				tmp.index = 0;
				tmp.thread = thread;

				// thread === Boolean then array has to be removed item by item
				init = true;
			}

			var item = thread === true ? self.shift() : self[tmp.index++];
			if (item === undefined) {
				if (!tmp.pending) {
					callback && callback();
					tmp.cancel = true;
				}
				return self;
			}

			tmp.pending++;
			onItem.call(self, item, () => setTimeout(next_wait, 1, self, onItem, callback, thread, tmp), tmp.index);

			if (!init || tmp.thread === 1)
				return self;

			for (var i = 1; i < tmp.thread; i++)
				self.wait(onItem, callback, 1, tmp);

			return self;
		};

		function next_wait(self, onItem, callback, thread, tmp) {
			tmp.pending--;
			self.wait(onItem, callback, thread, tmp);
		}

		PROTO.take = function(count) {
			var arr = [];
			var self = this;
			for (var i = 0; i < self.length; i++) {
				arr.push(self[i]);
				if (arr.length >= count)
					return arr;
			}
			return arr;
		};

		PROTO.skip = function(count) {
			var arr = [];
			var self = this;
			for (var i = 0; i < self.length; i++)
				i >= count && arr.push(self[i]);
			return arr;
		};

		PROTO.takeskip = function(take, skip) {
			var arr = [];
			var self = this;
			for (var i = 0; i < self.length; i++) {
				if (i < skip)
					continue;
				if (arr.length >= take)
					return arr;
				arr.push(self[i]);
			}
			return arr;
		};

	})();

	// Date prototypes
	(function() {

		var PROTO = Date.prototype;

		/*
			@Path: Date.prototype
			@Method: Date.prototype.add(value); #value {String} #return {Date};
			The method extends the current `Date` with the declared `value`.
		*/
		PROTO.add = function(value) {

			var arr = value.split(' ');
			var count = arr[0];

			value = arr[1];
			count = count.env();

			if (typeof(count) === 'string')
				count = +count;

			var self = this;
			var dt = new Date(self.getTime());

			switch(value.substring(0, 3)) {
				case 's':
				case 'ss':
				case 'sec':
					dt.setSeconds(dt.getSeconds() + count);
					return dt;
				case 'm':
				case 'mm':
				case 'min':
					dt.setMinutes(dt.getMinutes() + count);
					return dt;
				case 'h':
				case 'hh':
				case 'hou':
					dt.setHours(dt.getHours() + count);
					return dt;
				case 'd':
				case 'dd':
				case 'day':
					dt.setDate(dt.getDate() + count);
					return dt;
				case 'w':
				case 'ww':
				case 'wee':
					dt.setDate(dt.getDate() + (count * 7));
					return dt;
				case 'M':
				case 'MM':
				case 'mon':
					dt.setMonth(dt.getMonth() + count);
					return dt;
				case 'y':
				case 'yy':
				case 'yyy':
				case 'yea':
					dt.setFullYear(dt.getFullYear() + count);
					return dt;
			}
			return dt;
		};

		PROTO.format = function(format, utc) {

			var self = (utc || DEF.dateformatutc) ? this.toUTC() : this;

			if (format == null)
				format = DEF.dateformat;

			if (!format || format === 'iso')
				return self.getFullYear() + '-' + ((self.getMonth() + 1) + '').padLeft(2, '0') + '-' + (self.getDate() + '').padLeft(2, '0') + 'T' + (self.getHours() + '').padLeft(2, '0') + ':' + (self.getMinutes() + '').padLeft(2, '0') + ':' + (self.getSeconds() + '').padLeft(2, '0') + '.' + (self.getMilliseconds() + '').padLeft(3, '0') + 'Z';

			var key = 'dt_' + format;

			if (T.cache.statics[key])
				return T.cache.statics[key](self);

			var half = false;

			format = format.env();

			if (format && format.charAt(0) === '!') {
				half = true;
				format = format.substring(1);
			}

			var beg = '\'+';
			var end = '+\'';
			var before = [];

			var ismm = false;
			var isdd = false;
			var isww = false;

			format = format.replace(DEF.regexp.date, function(key) {
				switch (key) {
					case 'yyyy':
					case 'YYYY':
						return beg + 'd.getFullYear()' + end;
					case 'yy':
					case 'YY':
						return beg + '(d.getFullYear()+\'\').substring(2)' + end;
					case 'MMM':
						ismm = true;
						return beg + 'mm.substring(0, 3)' + end;
					case 'MMMM':
						ismm = true;
						return beg + 'mm' + end;
					case 'MM':
						return beg + '(d.getMonth() + 1).padLeft(2, \'0\')' + end;
					case 'M':
						return beg + '(d.getMonth() + 1)' + end;
					case 'ddd':
					case 'DDD':
						isdd = true;
						return beg + 'dd.substring(0, 2).toUpperCase()' + end;
					case 'dddd':
					case 'DDDD':
						isdd = true;
						return beg + 'dd' + end;
					case 'dd':
					case 'DD':
						return beg + 'd.getDate().padLeft(2, \'0\')' + end;
					case 'd':
					case 'D':
						return beg + 'd.getDate()' + end;
					case 'HH':
					case 'hh':
						return beg + (half ? 'W.$totaluidate(d.getHours()).padLeft(2, \'0\')' : 'd.getHours().padLeft(2, \'0\')') + end;
					case 'H':
					case 'h':
						return beg + (half ? 'W.$totaluidate(d.getHours())' : 'd.getHours()') + end;
					case 'mm':
						return beg + 'd.getMinutes().padLeft(2, \'0\')' + end;
					case 'm':
						return beg + 'd.getMinutes()' + end;
					case 'ss':
						return beg + 'd.getSeconds().padLeft(2, \'0\')' + end;
					case 's':
						return beg + 'd.getSeconds()' + end;
					case 'w':
					case 'ww':
						isww = true;
						return beg + (key === 'ww' ? 'ww.padLeft(2, \'0\')' : 'ww') + end;
					case 'a':
						var b = '\'PM\':\'AM\'';
						return beg + '(d.getHours()>=12 ? ' + b + ')' + end;
				}
			});

			ismm && before.push('var mm=W.MONTHS[d.getMonth()];');
			isdd && before.push('var dd=W.DAYS[d.getDay()];');
			isww && before.push('var ww = new Date(+d);ww.setHours(0,0,0,0);ww.setDate(ww.getDate()+3-(ww.getDay()+6)%7);var ww1=new Date(ww.getFullYear(),0,4);ww=1+Math.round(((ww.getTime()-ww1.getTime())/86400000-3+(ww1.getDay()+6)%7)/7);');

			T.cache.statics[key] = new Function('d', before.join('\n') + 'return \'' + format + '\';');
			return T.cache.statics[key](self);
		};

		W.$totaluidate = function(value) {
			return value >= 12 ? value - 12 : value;
		};
	})();

	// Window globals
	(function() {

		var ua = navigator.userAgent || '';
		W.isMOBILE = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(ua);
		W.isROBOT = (/search|agent|bot|crawler|spider/i).test(ua);
		W.isSTANDALONE = navigator.standalone || W.matchMedia('(display-mode: standalone)').matches;
		W.isTOUCH = !!('ontouchstart' in W || navigator.maxTouchPoints);
		W.isIE = (/msie|trident/i).test(ua);

		/*
			@Path: Globals
			@Property: NOW; #return {Date};
			The property always returns the current `Date` object refreshed in a one minute interval.
		*/
		W.NOW = new Date();

		/*
			@Path: Globals
			@Property: ON(name, callback); #name {String}; #callback {Function(a, b, c, d)};
			The method registers a new handler for capturing a specific event.
		*/
		W.ON = T.on;

		/*
			@Path: Globals
			@Property: OFF(name, [callback]); #name {String}; #[callback] {Function};
			The method removes the existing handler for capturing a specific event.
		*/
		W.OFF = T.off;

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

			T.db.components[name] = { count: 0, config: (config || '').parseConfig(), callback: callback, dependencies: dependencies };
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

			T.db.plugins[name] = { count: 0, config: (config || '').parseConfig(), callback: callback, dependencies: dependencies };

			// It's targeted for "<ui-plugin" elements without defined "path"
			T.cache.plugins.push(name);
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
			return el.parentNode && el.parentNode.tagName === 'body' ? false : W.isIE ? (!el.offsetWidth && !el.offsetHeight) : !el.offsetParent;
		};

		/*
			@Path: Globals
			@Method: VISIBLE(el, [threshold], [mode]); #el {jQuery/Element}; #[threshold] {Number}; #mode {visible|above|below}; return {Boolean};
			The method checks if the element is visible on the screen.
		*/
		// Source: https://stackoverflow.com/questions/5353934/check-if-element-is-visible-on-screen
		W.VISIBLE = function(el, threshold, mode) {

			if (el instanceof jQuery)
				el = el[0];

			if (el.parentNode && el.parentNode.tagName !== 'body') {
				if (W.isIE) {
					if (!el.offsetWidth && !el.offsetHeight)
						return false;
				} else if (!el.offsetParent)
					return false;
			}

			if (!threshold)
				threshold = 0;

			if (!mode)
				mode = 'visible';

			var rect = el.getBoundingClientRect();
			var vw = Math.max(document.documentElement.clientHeight, W.innerHeight);
			var above = rect.bottom - threshold < 0;
			var below = rect.top - vw + threshold >= 0;
			return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
		};

		/*
			@Path: Globals
			@Method: NOTFOCUSED(); #return {Boolean};
			The method checks if the browser window is focused or not.
		*/
		W.NOTFOCUSED = function() {
			return document.hidden || document.msHidden || document.webkitHidden;
		};

		/*
			@Path: Globals
			@Method: SCROLLBAR(element, options); #element {String/jQuery/Element}; #options {Object}; #return {Scrollbar};
			The method wraps the `element` with a custom scrollbar.
		*/
		W.SCROLLBAR = function(el, opt) {
			return new CustomScrollbar(el, opt);
		};

		/*
			@Path: Globals
			@Method: SCROLLBARWIDTH(); #return {Number};
			The method returns the width of the scrollbar.
		*/
		W.SCROLLBARWIDTH = function() {
			var id = 'totaluiscrollbar';
			if (T.cache.scrollbarwidth != null)
				return T.cache.scrollbarwidth;
			var b = document.body;
			$(b).append('<div id="{0}" style="width{1}height{1}overflow:scroll;position:absolute;top{2}left{2}"></div>'.format(id, ':100px;', ':9999px;'));
			var el = document.getElementById(id);
			if (el) {
				T.cache.scrollbarwidth = el.offsetWidth - el.clientWidth;
				b.removeChild(el);
			}
			return T.cache.scrollbarwidth || 0;
		};

		/*
			@Path: Globals
			@Method: WIDTH(element); #element {String/jQuery}; #return {Number};
			The method returns the element's width.
		*/
		W.WIDTH = function(el) {
			if (!el)
				el = $W;
			var w = el.width();
			var d = DEF.devices;
			return w >= d.md.min && w <= d.md.max ? 'md' : w >= d.sm.min && w <= d.sm.max ? 'sm' : w > d.lg.min ? 'lg' : w <= d.xs.max ? 'xs' : '';
		};

		/*
			@Path: Globals
			@Method: ENV(name, value); #name {String}; #value {String};
			The method registers a new environment variable.
		*/
		/*
			@Path: Globals
			@Method: ENV(name); #name {String}; #returns {String};
			The method reads the value of the environment variable.
		*/
		W.ENV = function(name, value) {

			if (typeof(name) === 'object') {
				if (name) {
					for (var key in name) {
						DEF.env[key] = name[key];
						T.events.env && EMIT('env', key, name[key]);
					}
				}
				return name;
			}

			if (value !== undefined) {
				T.events.env && EMIT('env', name, value);
				DEF.env[name] = value;
				return value;
			}

			return DEF.env[name];
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

		W.CLONE = function(obj, path) {

			var type = typeof(obj);
			switch (type) {
				case 'number':
				case 'boolean':
					return obj;
				case 'string':
					return path ? obj : CLONE(GET(obj));
			}

			if (obj == null)
				return obj;

			if (obj instanceof Date)
				return new Date(obj.getTime());

			return PARSE(JSON.stringify(obj));
		};

		var QUERIFYMETHODS = { GET: 1, POST: 1, DELETE: 1, PUT: 1, PATCH: 1, API: 1 };

		W.QUERIFY = function(url, obj) {

			if (typeof(url) !== 'string') {
				obj = url;
				url = '';
			}

			if (!obj)
				return url;

			var arg = [];
			var keys = Object.keys(obj);

			for (var i = 0; i < keys.length; i++) {

				var key = keys[i];
				var val = obj[key];
				if (val != null) {

					if (val instanceof Date)
						val = val.toISOString();
					else if (val instanceof Array)
						val = val.join(',');

					val = val + '';
					val && arg.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
				}
			}

			if (url) {
				var arr = url.split(' ');
				var index = QUERIFYMETHODS[arr[0]] ? 1 : 0;
				if (arg.length)
					arr[index] += (arr[index].indexOf('?') === -1 ? '?' : '&') + arg.join('&');
				return arr.join(' ');
			}

			return arg.length ? ('?' + arg.join('&')) : '';
		};

		W.STRINGIFY = function(obj, compress, fields, encrypt) {
			var tf = typeof(fields);
			var tmp = JSON.stringify(obj, function(key, value) {

				if (!key)
					return value;

				if (fields) {
					if (fields instanceof Array) {
						if (fields.indexOf(key) === -1)
							return undefined;
					} else if (tf === 'function') {
						if (!fields(key, value))
							return undefined;
					} else if (fields[key] === false)
						return undefined;
				}

				if (compress === true) {
					var t = typeof(value);
					if (t === 'string') {
						value = value.trim();
						return value ? value : undefined;
					} else if (value === false || value == null)
						return undefined;
				}

				return value;
			});
			return encrypt && encryptsecret ? encrypt_data(tmp, encryptsecret) : tmp;
		};

		W.PARSE = function(value, date) {

			if (typeof(value) === 'object')
				return value;

			// Is selector?
			var c = (value || '').charAt(0);
			if (c === '#' || c === '.')
				return PARSE($(value).html(), date);

			date === undefined && (date = MD.jsondate);
			try {
				return JSON.parse(value, function(key, value) {
					return typeof(value) === 'string' && date && value.isJSONDate() ? new Date(value) : value;
				});
			} catch (e) {
				return null;
			}
		};

		function onresponse(opt) {

			var req = opt.req;

			opt.status = req.status;
			opt.text = req.statusText;
			opt.response = req.responseText;
			opt.iserror = opt.status >= 399;
			opt.onprogress && T.process(opt.scope, 100, opt.onprogress);
			opt.duration = Date.now() - opt.duration;
			opt.headers = {};

			// Parse headers
			let resheaders = req.getAllResponseHeaders().split('\n');
			for (let line of resheaders) {
				let index = line.indexOf(':');
				if (index !== -1)
					opt.headers[line.substring(0, index).toLowerCase()] = line.substring(index + 1).trim();
			}

			let type = opt.headers['content-type'];

			if (type && type.indexOf('/json') !== -1)
				opt.response = PARSE(opt.response);

			T.events.response && F.emit('response', opt);

			// Processed by another way
			if (opt.cancel)
				return;

			if (opt.ERROR) {

				if (opt.iserror && !opt.response) {
					T.emit('ERROR', opt.status + '');
					return;
				}

				if (W.ERROR(opt.response))
					return;
			}

			if (opt.path && opt.path.cache)
				CACHE(opt.id, opt.response, opt.path.cache);

			T.process(opt.scope, opt.response, opt.callback);

			let arr = T.cache.lockers[opt.id];
			if (arr) {
				for (let fn of arr)
					T.process(opt.scope, opt.response, fn);
				delete T.cache.lockers[opt.id];
			}
		}

		W.TAPI = function(name, data, callback, scope) {
			var type = typeof(data);

			if (!callback && (type === 'function' || type === 'string')) {
				callback = data;
				data = null;
			}

			data = { schema: name, data: data ? data : undefined };
			return W.AJAX('POST ' + DEF.api, data, callback);
		};

		/*
			@Path: Globals
			@Method: AJAX(url, [data], callback); #url {String}; #[data] {Object}; #callback {Function(response)};
			The method parsers JSON and converts all dates to `Date` object.
		*/
		W.AJAX = function(url, data, callback, scope) {

			var type = typeof(data);

			if (!callback && (type === 'function' || type === 'string')) {
				callback = data;
				data = null;
			}

			url = url.env();

			var opt = {};
			var index = url.indexOf(' ');

			opt.id = url;
			opt.method = url.substring(0, index);
			opt.scope = scope || T.scope;
			opt.flags = {};

			url = url.substring(index + 1);
			index = url.indexOf(' ');

			if (index !== -1) {

				opt.url = url.substring(0, index);
				url = url.substring(index + 1);
				opt.path = new T.Path(url);
			} else
				opt.url = url;

			if (opt.path && (opt.path.cache || opt.path.sync)) {
				let arr = T.cache.lockers[opt.id];
				if (arr)
					arr.push(callback);
				else
					T.cache.lockers[opt.id] = [];
			}

			if (opt.url.substring(0, 2) === '//')
				opt.url = location.protocol + opt.url;

			if (typeof(callback) === 'string')
				callback = parsepath(callback);

			opt.headers = {};
			opt.callback = callback;
			opt.onprogress = typeof(onprogress) === 'string' ? parsepath(onprogress) : onprogress;
			opt.duration = Date.now();

			if (opt.method !== 'GET')
				opt.headers['Content-Type'] = typeof(data) === 'string' ? 'application/x-www-form-urlencoded' : 'application/json';

			for (let key in DEF.headers)
				opt.headers[key] = DEF.headers[key];

			opt.data = data;

			T.events.request && F.emit('request', opt);

			if (opt.cancel)
				return;

			if (opt.path && opt.path.cache) {
				let cache = CACHE(opt.id);
				if (cache) {
					delete T.cache.lockers[opt.id];
					T.process(opt.scope, cache, opt.callback);
					return;
				}
			}

			var percentage = 0;
			var xhr = new XMLHttpRequest();

			xhr.addEventListener('error', function() {
				opt.req = this;
				onresponse(opt);
			});

			xhr.addEventListener('load', function() {
				opt.req = this;
				onresponse(opt);
			}, false);

			if (onprogress) {
				xhr.upload.onprogress = function(e) {
					let p = e.lengthComputable ? Math.round(e.loaded * 100 / e.total) : 0;
					if (percentage !== p) {
						percentage = p;
						opt.onprogress && T.process(opt.scope, p, opt.onprogress);
					}
				};
			}

			opt.xhr = xhr;
			xhr.open(opt.method, opt.url);

			for (let key in opt.headers)
				xhr.setRequestHeader(key, opt.headers[key]);

			if (!(data instanceof FormData))
				opt.data = JSON.stringify(opt.data);

			if (opt.path) {
				opt.path.exec(() => xhr.send(opt.data));
			} else
				xhr.send(opt.data);
		};

		/*
			@Path: Globals
			@Method: ADAPT(path, id, text); #path {String}; #id {String}; #text {String}; #return {String};
			The method replaces all keywords `CLASS` and `~PATH~` for the `path` value, and `~ID~` for the `id` value in the `text` argument.
		*/
		W.ADAPT = function(path, id, text) {

			if (!text || typeof(text) !== 'string')
				return text;

			text = TRANSLATE(text).VARIABLES().replace(/~CDN~/g, DEF.cdn);

			if (path) {
				text = text.replace(/~PATH~|CLASS/g, path).replace(/<ui-plugin.*?>/g, function(text) {
					return text.indexOf('path=') === -1 ? (text.substring(0, 10) + ' path="' + path + '"' + text.substring(10)) : text;
				}).replace('PLUGIN(function(', 'PLUGIN(\'{0}\', function('.format(path));
			}

			if (id)
				text = text.replace(/~ID~/g, id);

			return text;
		};

		function removescripts(str) {
			return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, function(text) {
				var index = text.indexOf('>');
				var scr = text.substring(0, index + 1);
				return scr.substring(0, 6) === '<style' || (scr.substring(0, 7) === ('<script') && scr.indexOf('type="') === -1) || scr.indexOf('/javascript"') !== -1 ? '' : text;
			});
		}

		function importscripts(str) {

			var beg = -1;
			var output = str;
			var external = [];
			var scr;

			while (true) {

				beg = str.indexOf('<script', beg);
				if (beg === -1)
					break;
				var end = str.indexOf('</script>', beg + 8);
				var code = str.substring(beg, end + 9);
				beg = end + 9;
				end = code.indexOf('>');
				scr = code.substring(0, end);

				if (scr.indexOf('type=') !== -1 && scr.lastIndexOf('javascript') === -1)
					continue;

				var tmp = code.substring(end + 1, code.length - 9).trim();
				if (!tmp) {
					output = output.replace(code, '').trim();
					var eid = 'external' + HASH(code);
					if (!T.cache.statics[eid]) {
						external.push(code);
						T.cache.statics[eid] = true;
					}
				}
			}

			external.length && $('head').append(external.join('\n'));
			return output;
		}

		function importstyles(str, id) {

			var builder = [];

			str = str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, function(text) {
				text = text.replace('<style>', '<style type="text/css">');
				builder.push(text.substring(23, text.length - 8).trim());
				return '';
			});

			var key = 'css' + (id || '');

			if (id) {
				if (T.cache.statics[key])
					$('#' + key).remove();
				else
					T.cache.statics[key] = true;
			}

			builder.length && $('<style' + (id ? ' id="' + key + '"' : '') + '>{0}</style>'.format(builder.join('\n'))).appendTo('head');
			return str;
		}

		/*
			@Path: Globals
			@Method: IMPORT(url, [target], callback); #url {String}; #[target] {String/jQuery/Element}; #callback {Function};
			The method imports external sources like JavaScript libaries, CSS libraries, UI components or parts.
		*/
		W.IMPORT = function(url, target, callback) {

			if (typeof(target) === 'function') {
				callback = target;
				target = 'body';
			}

			var key = url;

			if (T.cache.imports[key]) {
				T.cache.imports[key].push({ target: target, callback: callback });
				return;
			}

			if (!target)
				target = 'body';

			T.cache.imports[key] = [{ target: target, callback: callback }];

			var done = function() {
				for (let m of T.cache.imports[key])
					m.callback && m.callback();
				delete T.cache.imports[key];
			};

			let d = document;
			let ext = '';
			let check = '';

			url = url.replace(/<.*?>/, function(text) {
				if (text.includes(' '))
					return text;
				check = text.substring(1, text.length - 1);
				return '';
			});

			if (check && W[check]) {
				return;
			}

			url = url.replace(/\s\.[a-z0-9]+/, function(text) {
				ext = text.trim();
				return '';
			});

			if (!ext) {
				let index = url.indexOf(' ');
				let tmp = url;
				if (index !== -1)
					tmp = tmp.substring(0, index);
				ext = tmp.substring(tmp.lastIndexOf('.'));
				if (ext !== '.js' && ext !== '.css')
					ext = '';
			}

			if (ext === '.js') {
				var scr = d.createElement('script');
				scr.type = 'text/javascript';
				scr.async = false;
				scr.onload = function() {
					done();
					T.events.import && T.emit('import', url, $(scr));
				};
				scr.src = url;
				d.getElementsByTagName('head')[0].appendChild(scr);
				return;
			}

			if (ext === '.css') {
				var link = d.createElement('link');
				link.type = 'text/css';
				link.rel = 'stylesheet';
				link.href = url;
				link.onload = function() {
					setTimeout(done, 2);
					T.events.import && T.emit('import', url, $(link));
				};
				d.getElementsByTagName('head')[0].appendChild(link);
				return;
			}

			AJAX('GET ' + url, function(response) {

				if (typeof(response) !== 'string') {
					WARN(ERR.format('Invalid response for IMPORT("{0}")'.format(url)), response);
					done();
					return;
				}

				let id = 'import' + HASH(url);
				response = ADAPT(null, null, response);
				response = importscripts(importstyles(response, id)).trim();

				if (response) {
					for (let m of T.cache.imports[key]) {
						if (m.target)
							$(m.target).append(response);
					}
				}

				setTimeout(function() {
					done();
					T.events.import && T.emit('import', url, target);
				}, 10);
			});

		};

		/*
			@Path: Globals
			@Method: PARSE(value); #value {String}; #return {Object};
			The method parsers JSON and converts all dates to `Date` object.
		*/
		W.PARSE = function(value) {

			if (typeof(value) === 'object')
				return value;

			// Is selector?
			let c = (value || '').charAt(0);
			if (c === '#' || c === '.')
				return PARSE($(value).html());

			try {
				return JSON.parse(value, (key, value) => typeof(value) === 'string' && value.isJSONDate() ? new Date(value) : value);
			} catch (e) {
				return null;
			}
		};

		/*
			@Path: Globals
			@Method: CACHE(key, value, expire); #key {String}; #value {Object}; #expire {String};
			@Method: CACHE(key); #key {String}; #return {Object};
			The method reads or writes persistent data into the `localStorage`.
		*/
		W.CACHE = function(key, value, expire) {
			var date = new Date();

			key = 'ui' + HASH(key).toString(36);

			if (expire) {
				let item = { value: value, expire: expire === 'session' ? null : date.add(expire) };
				T.cache.storage[key] = item;
				item.expire && savestorage();
			} else {
				let tmp = T.cache.storage[key];
				if (tmp && tmp.expire && tmp.expire < date)
					tmp = null;
				return tmp ? tmp.value : null;
			}
		};

		/*
			@Path: Globals
			@Method: LOCALIZE(text); #text {String}; #return {String};
			The method loads a localization dictionary. The format must be the same as the Total.js resource file.
		*/
		W.LOCALIZE = function(text) {
			var lines = text.split('\n');
			for (let line of lines) {
				line = line.trim();
				if (line && line.substring(0, 2) !== '//') {
					var index = line.indexOf(':');
					if (index !== -1) {
						var key = line.substring(0, index).trim();
						var val = line.substring(index + 1).trim();
						DEF.dictionary[key] = val;
					}
				}
			}
		};

		/*
			@Path: Globals
			@Method: LOCALIZE(text); #text {String}; #return {String};
			The method translates the Total.js localization markup as `@(text to translate)`. The localization dictionary must be loaded via the `LOCALIZE()` method.
		*/
		W.TRANSLATE = function(str) {

			if (!str || typeof(str) !== 'string' || str.indexOf('@(') === -1)
				return str;

			var index = 0;
			var arr = [];

			while (true) {

				index = str.indexOf('@(', index);

				if (index === -1)
					break;

				var length = str.length;
				var count = 0;

				for (var i = index + 2; i < length; i++) {
					var c = str[i];

					if (c === '(') {
						count++;
						continue;
					}

					if (c !== ')')
						continue;
					else if (count) {
						count--;
						continue;
					}

					arr.push(str.substring(index, i + 1));
					index = i;
					break;
				}
			}

			for (var i = 0; i < arr.length; i++) {
				var raw = arr[i];
				var text = raw.substring(2, raw.length - 1);
				var key = HASH(text).toString(36);
				var tmp = DEF.dictionary[key];
				if (!tmp) {
					key = 'T' + key;
					tmp = DEF.dictionary[key];
				}
				str = str.replace(raw, tmp || text);
			}

			return str;
		};

		W.setTimeout2 = function(name, fn, timeout, limit, param) {
			var key = ':' + name;
			var statics = T.cache.timeouts;
			if (limit > 0) {
				var key2 = key + ':limit';
				if (statics[key2] >= limit)
					return;
				statics[key2] = (statics[key2] || 0) + 1;
				statics[key] && clearTimeout(statics[key]);
				statics[key] = setTimeout(function(param) {
					statics[key2] = undefined;
					fn && fn(param);
				}, timeout, param);
			} else {
				statics[key] && clearTimeout(statics[key]);
				statics[key] = setTimeout(fn, timeout, param);
			}
			return name;
		};

		W.clearTimeout2 = function(name) {
			var key = ':' + name;
			var statics = T.cache.timeouts;
			if (statics[key]) {
				clearTimeout(statics[key]);
				statics[key] = undefined;
				statics[key + ':limit'] && (statics[key + ':limit'] = undefined);
				return true;
			}
			return false;
		};

		/*
			@Path: Globals
			@Method: ERROR(response, success, error); #response {Object}; #success {Function(response)}; #error {Function(response)};
			The method processes errors.
		*/
		W.ERROR = function(response, success, error) {

			if (typeof(response) === 'function') {
				error = success;
				success = response;
				response = true;
			}

			if (response !== true) {
				if (response) {
					var iserr = response instanceof Error ? true : response instanceof Array && response.length ? response[0].error != null : response.error != null;
					if (iserr) {
						T.events.ERROR && T.emit('ERROR', response);
						error && W.SEEX(error, response);
						return true;
					}
				}
				success && W.SEEX(success, response);
				return false;
			}

			return function(response, err) {
				if ((!response || typeof(response) === 'string') && err > 0)
					response = [{ error: response || err }];
				W.ERROR(response, success, error);
			};

		};

		/*
			@Path: Globals
			@Method: EXTENSION(name, config, callback); #name {String}; #config {String/Object}; #callback {Function(instance, config, element, cls)};
			The method extends UI components `component_name` or plugins `@plugin_name`.
		*/
		W.EXTENSION = function(name, config, callback) {

			name = name.split(':').trim()[0];

			var obj = { config: config ? typeof(config) === 'string' ? config.parseConfig() : config : null, callback: callback };

			if (T.db.extensions[name])
				T.db.extensions[name].push(obj);
			else
				T.db.extensions[name] = [obj];

			// Applying the extension for existing instances
			// Plugins
			if (name.charAt(0) === '@') {
				name = name.substring(1);
				for (let key in T.plugins) {
					if (key === name) {
						let plugin = T.plugins[key];
						if (obj.config) {
							for (let k in obj.config)
								plugin.config[k] = obj.config[k];
						}
						callback(plugin, plugin.config, plugin.element);
					}
				}
			} else {
				for (let m of T.components) {
					if (m.name === name) {
						obj.config && m.reconfigure(obj.config);
						callback(m, m.config, m.element, m.cls);
					}
				}
			}
		};

		/*
			@Path: Globals
			@Method: CONFIG(selector, config); #selector {String/Function(instance)}; #config {String/Object};
			The method reconfigure all existing and new components.

			Possible selectors: `#component_id`, `.component_path`, `component_name`.
		*/
		W.CONFIG = function(selector, config) {

			// #component_id
			// component_name
			// component_path
			// function

			if (typeof(config) === 'string')
				config = config.parseConfig();

			if (typeof(selector) === 'function') {
				T.db.configs.push({ check: selector, config: config });

				// apply for existing instances
				for (let m of T.components) {
					if (selector(m))
						m.reconfigure(config);
				}

				return;
			}

			var arr;

			if (selector.includes(',')) {
				arr = selector.split(',');
				for (let m of arr)
					CONFIG(m.trim(), config);
				return;
			}

			var c = selector.charAt(0);
			var code = '';

			switch (c) {
				case '#': // id
					code = 'instance.id === "{0}"'.format(selector.substring(1));
					break;
				case '.': // path
					code = 'instance.path.includes("{0}")'.format(selector.substring(1));
					break;
				case '*': // all UI components
					code = 'true';
					break;
				default:  // name
					code = 'instance.name === "{0}"'.format(selector);
					break;
			}

			selector = new Function('instance', 'return ' + code);
			T.db.configs.push({ check: selector, config: config });

			// apply for existing instances
			for (let m of T.components) {
				if (selector(m))
					m.reconfigure(config);
			}
		};

		W.EXEC = function(name, a, b, c, d) {
			T.exec(name, a, b, c, d);
		};

		W.SETTER = function(name, a, b, c, d) {
			T.setter(null, name, a, b, c, d);
		};

		function diffdomchecksum(el, type) {
			return type ? el.getAttribute(type) : el.outerHTML;
		}

		W.DIFFDOM = function(el, selector, html, attr) {

			var vdom = $(html);
			var varr = vdom.filter(selector);
			var vels = el.find(selector);
			var output = { add: 0, upd: 0, rem: 0 };
			var arr = [];

			for (var j = 0; j < vels.length; j++)
				vels[j].$diffdom = 1;

			for (var i = 0; i < varr.length; i++) {
				var item = varr[i];
				var obj = {};
				obj.virtual = item;
				obj.checksum = diffdomchecksum(item, attr);
				for (var j = 0; j < vels.length; j++) {
					var node = vels[j];
					var checksum = diffdomchecksum(node, attr);
					if (checksum === obj.checksum) {
						delete node.$diffdom;
						obj.node = node;
						break;
					}
				}
				arr.push(obj);
			}

			var dom = el[0];
			var rem = [];

			for (var j = 0; j < vels.length; j++) {
				var node = vels[j];
				if (node.$diffdom)
					rem.push(node);
			}

			output.rem = rem.length;

			for (var j = 0; j < rem.length; j++)
				dom.removeChild(rem[j]);

			for (var i = 0; i < arr.length; i++) {
				var node = dom.children[i];
				var item = arr[i];
				if (item.node) {
					output.upd++;
					if (node && item.node !== node)
						NODEINSERT(item.node, node, true);
				} else {
					output.add++;
					if (node)
						NODEINSERT(item.virtual, node, true);
					else
						dom.appendChild(item.virtual);
				}
			}

			return output;
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

		$.fn.CMD = function(name, a, b, c, d) {
			T.cmd($(this), name, a, b, c, d);
		};

		$.fn.SETTER = function(name, a, b, c, d) {
			T.setter($(this), name, a, b, c, d);
		};

	})();

	// load localStorage
	setTimeout(function() {

		DEF.onstorageread(function(data) {
			T.cache.storage = data || {};
			T.ready = true;
		});

	}, 1);

	function CustomScrollbar(element, options) {

		var self = this;
		var size = {};
		var drag = {};

		if (!options)
			options = {};

		var n = DEF.prefixcsslibrary + 'scrollbar';
		var id = GUID(5);

		element.aclass(n);
		element.wrapInner('<div class="{0}-area" data-id="{1}"><div class="{0}-body" data-id="{1}"></div></div>'.format(n, id));

		var iscc = !!options.controls;
		var controls = options.controls || element;
		var visibleX = options.visibleX == null ? false : options.visibleX;
		var visibleY = options.visibleY == null ? false : options.visibleY;
		var orientation = options.orientation;
		var canX = !orientation || orientation === 'x';
		var canY = !orientation || orientation === 'y';
		var isedge = navigator.userAgent.indexOf('Edge') !== -1;

		controls.prepend(('<div class="{0}-path {0}-notready" data-id="{1}">' + (canY ? '<div class="{0}-y" data-id="{1}"><span><b></b></span></div>' : '') + (canX ? '<div class="{0}-x" data-id="{1}"><span><b></b></span></div></div>' : '')).format(n, id));
		element[0].$scrollbar = self;

		if (options.padding == null)
			options.padding = 5;

		if (!options.minsize)
			options.minsize = 50;

		var di = '[data-id="{0}"]'.format(id);
		var pe = 'pointer-events';
		var path = controls.find('.' + n + '-path' + di);
		var pathx = canX ? $(path.find('.' + n + '-x' + di)[0]) : null;
		var pathy = canY ? $(path.find('.' + n + '-y' + di)[0]) : null;
		var barx = canX ? $(pathx.find('span')[0]) : null;
		var bary = canY ? $(pathy.find('span')[0]) : null;
		var bodyarea = element.find('.' + n + '-body' + di);
		var area = $(element.find('> .' + n + '-area' + di)[0]);
		var shadowtop;
		var shadowbottom;
		var shadowleft;
		var shadowright;
		var sc = 'shadow';
		var shadowheight = 0;

		if (options[sc]) {

			element.prepend(('<div class="{0}-{1}">' + (canX ? '<div class="{0}-{1}-left {0}-{1}-h" style="opacity:0"></div><div class="{0}-{1}-right {0}-{1}-h" style="opacity:0"></div>' : '') + (canY ? '<div class="{0}-{1}-top {0}-{1}-v" style="opacity:0"></div><div class="{0}-{1}-bottom {0}-{1}-v" style="opacity:0"></div>' : '') + '</div>').format(n, sc));
			var shadow = element.find('> .' + n + '-' + sc);

			if (canY) {
				shadowtop = shadow.find('> .' + n + '-' + sc + '-top');
				shadowbottom = shadow.find('> .' + n + '-'  + sc + '-bottom');
			}

			if (canX) {
				shadowleft = shadow.find('> .' + n + '-' + sc + '-left');
				shadowright = shadow.find('> .' + n + '-'  + sc + '-right');
			}

			shadowheight = shadowtop ? shadowtop.height() : shadowleft.width();
		}

		var notemmited = true;
		var intervalresize;
		var delayresize;
		var delay;
		var resizeid;
		var syncx = [];
		var syncy = [];
		var synclocked;
		var syncdelay;
		var syncid = 'cs' + GUID(5);
		var scrollbarcache = {};

		self.options = options;
		self.pathx = pathx;
		self.pathy = pathy;
		self.barx = barx;
		self.bary = bary;
		self.element = element;
		self.area = area;
		self.body = bodyarea;

		var handlers = {};

		handlers.onmousemove = function(e) {
			if (drag.is) {
				var p, diff, h;
				if (drag.type === 'y') {

					diff = e.pageY - drag.offset;

					if (diff < 0)
						diff = 0;

					h = size.vbarlength - size.vbarsize;
					p = (diff / h) * 100;
					area[0].scrollTop = ((size.scrollHeight - size.viewHeight + (options.marginY || 0)) / 100) * (p > 100 ? 100 : p);

					if (drag.counter++ > 10) {
						drag.counter = 0;
						drag.pos = e.pageY;
					}

				} else {

					diff = e.pageX - drag.offset;

					if (diff < 0)
						diff = 0;

					h = size.hbarlength - size.hbarsize;
					p = (diff / h) * 100;
					area[0].scrollLeft = ((size.scrollWidth - size.viewWidth + (options.marginX || 0)) / 100) * (p > 100 ? 100 : p);

					if (drag.counter++ > 5) {
						drag.counter = 0;
						drag.pos = e.pageX;
					}
				}

				// if (p < -20 || p > 120)
				// 	drag.is = false;
			}
		};

		handlers.onresize = function() {

			if (!delayresize) {
				scrollbarcache.ready = 0;
				path.aclass(n + '-notready');
			}

			delayresize && clearTimeout(delayresize);
			delayresize = setTimeout(self.resize, 500);
		};

		var bind = function() {
			animcache.disabled = true;
			if (!drag.binded) {
				drag.binded = true;
				var w = $W.on('mousemove', handlers.onmousemove).on('mouseup', handlers.onmouseup);
				if (W.parent !== W)
					w.on('mouseout', handlers.onmouseout);
			}
		};

		var unbind = function() {
			animcache.disabled = false;
			if (drag.binded) {
				pathy && pathy.rclass(n + '-y-show');
				pathx && pathx.rclass(n + '-x-show');
				drag.binded = false;
				var w = $W.off('mousemove', handlers.onmousemove).off('mouseup', handlers.onmouseup);
				if (W.parent !== W)
					w.off('mouseout', handlers.onmouseout);
			}
		};

		var animyt = {};
		var animcache = {};

		var animyt_fn = function(value) {
			if (animcache.y !== value && !animcache.yis) {
				animcache.y = value;
				animyt.top = value + 20;
				bary.stop().animate(animyt, 150, function() {
					animyt.top = value;
					bary.stop().animate(animyt, 150, function() {
						animcache.yis = false;
					});
				});
			}
		};

		var animxt = {};
		var animxt_fn = function(value) {
			if (animcache.x !== value && !animcache.xis) {
				animcache.xis = true;
				animcache.x = value;
				animxt.left = value + 20;
				barx.stop().animate(animxt, 150, function() {
					animxt.left = value;
					barx.stop().animate(animxt, 150, function() {
						animcache.xis = false;
					});
				});
			}
		};

		var animyb = {};
		var animyb_fn = function(value) {
			if (animcache.y !== value && !animcache.yis) {
				animcache.yis = true;
				animyb.height = value - 20;
				bary.stop().animate(animyb, 150, function() {
					animyb.height = value;
					bary.stop().animate(animyb, 150, function() {
						animcache.yis = false;
					});
				});
			}
		};

		var animxr = {};
		var animxr_fn = function(value) {
			if (animcache.x !== value && !animcache.xis) {
				animcache.yis = true;
				animxr.width = value - 20;
				barx.stop().animate(animxr, 150, function() {
					animxr.width = value;
					barx.stop().animate(animxr, 150, function() {
						animcache.xis = false;
					});
				});
			}
		};

		var animyt2 = function(pos, max) {
			size.animvpost = null;
			if (pos === max) {
				size.animvpos = true;
				animyt_fn(pos);
			} else if (pos === 0) {
				animyb_fn(+bary.attrd('size'));
				size.animvpos = true;
			}
		};

		var animxt2 = function(pos, max) {
			size.animhpost = null;
			if (pos === max) {
				size.animhpos = true;
				animxt_fn(pos);
			} else if (pos === 0) {
				animxr_fn(+barx.attrd('size'));
				size.animhpos = true;
			}
		};

		handlers.onmouseup = function() {
			drag.is = false;
			unbind();
		};

		handlers.onmouseout = function(e) {
			var f = e.relatedTarget || e.toElement;
			if (!f || f.tagName == 'HTML') {
				drag.is = false;
				unbind();
			}
		};

		handlers.forcey = function() {
			bary[0].style.top = size.vpos + 'px';
			if (DEF.scrollbaranimate && !animcache.disabled && (size.vpos === 0 || size.vpos === size.vmax)) {
				size.animvpost && clearTimeout(size.animvpost);
				size.animvpost = setTimeout(animyt2, 10, size.vpos, size.vmax);
			}
		};

		handlers.forcex = function() {
			barx[0].style.left = size.hpos + 'px';
			if (DEF.scrollbaranimate && !animcache.disabled && (size.hpos === 0 || size.hpos === size.hmax)) {
				size.animhpost && clearTimeout(size.animhpost);
				size.animhpost = setTimeout(animxt2, 10, size.hpos, size.hmax);
			}
		};

		handlers.clearscroll = function() {
			delay = null;
			notemmited = true;
			size.animvpos = false;
			animcache.y = -1;
			animcache.x = -1;
			options.onidle && options.onidle(self);
			T.events.scrollidle && T.emit('scrollidle', area);
		};

		handlers.onscroll = function() {

			var y = area[0].scrollTop;
			var x = area[0].scrollLeft;
			var is = size.prevx !== x || size.prevy !== y;
			var pos;
			var p;
			var d;
			var max;

			size.prevx = x;
			size.prevy = y;

			if (shadowtop || shadowleft) {

				if (!shadowheight)
					shadowheight = shadowtop ? shadowtop.height() : shadowleft.width();

				if (canY) {
					if (y > shadowheight) {
						if (!size.shadowtop) {
							size.shadowtop = true;
							shadowtop.stop().animate({ opacity: 1 }, 200);
						}
					} else {
						if (size.shadowtop) {
							size.shadowtop = false;
							shadowtop.stop().animate({ opacity: 0 }, 200);
						}
					}

					if (y < ((size.scrollHeight - size.clientHeight) - shadowheight)) {
						if (!size.shadowbottom) {
							size.shadowbottom = true;
							shadowbottom.stop().animate({ opacity: 1 }, 200);
						}
					} else {
						if (size.shadowbottom) {
							size.shadowbottom = false;
							shadowbottom.stop().animate({ opacity: 0 }, 200);
						}
					}
				}

				if (canX) {
					if (x > shadowheight) {
						if (!size.shadowleft) {
							size.shadowleft = true;
							shadowleft.stop().animate({ opacity: 1 }, 200);
						}
					} else {
						if (size.shadowleft) {
							size.shadowleft = false;
							shadowleft.stop().animate({ opacity: 0 }, 200);
						}
					}

					if (x < ((size.scrollWidth - size.clientWidth) - shadowheight)) {
						if (!size.shadowright) {
							size.shadowright = true;
							shadowright.stop().animate({ opacity: 1 }, 200);
						}
					} else {
						if (size.shadowright) {
							size.shadowright = false;
							shadowright.stop().animate({ opacity: 0 }, 200);
						}
					}
				}
			}

			if (size.vbar && canY) {

				d = (size.scrollHeight - size.clientHeight) + 1;
				p = d ? Math.ceil((y / d) * 100) : 0;
				if (p > 100)
					p = 100;

				max = (size.vbarlength || 0) - (size.vbarsize || 0);
				pos = Math.ceil((p / 100) * max);

				if (pos < 0)
					pos = 0;
				else {
					if (pos > max)
						pos = max;
				}
				if (size.vpos !== pos) {
					size.vpos = pos;
					size.vmax = max;
					W.requestAnimationFrame(handlers.forcey);
				}
			}

			if (size.hbar && canX) {

				d = (size.scrollWidth - size.clientWidth) + 1;
				p = d ? Math.ceil((x / d) * 100) : 0;

				if (p > 100)
					p = 100;

				max = size.hbarlength - size.hbarsize;
				pos = ((p / 100) * max) >> 0;

				if (pos < 0)
					pos = 0;
				else {
					if (pos > max)
						pos = max;
				}

				if (size.hpos !== pos) {
					size.hpos = pos;
					size.hmax = max;
					W.requestAnimationFrame(handlers.forcex);
				}
			}

			if (is) {

				if (notemmited) {
					clearTimeout(resizeid);
					resizeid = setTimeout(self.resize, 500, true);
					T.events.scroll && T.emit('scroll', area);
					notemmited = false;
				}

				delay && clearTimeout(delay);
				delay = setTimeout(handlers.clearscroll, 700);

				options.onscroll && options.onscroll(self);

			} else {
				if (size.hbar || size.vbar) {
					clearTimeout(resizeid);
					resizeid = setTimeout(self.resize, 500, true);
				}
			}

			if (syncx.length || syncy.length) {

				if (synclocked) {
					if (synclocked !== syncid)
						return;
				} else
					synclocked = syncid;

				self.unsync();

				for (var i = 0; i < syncx.length; i++) {
					if (syncx[i].$csid !== synclocked) {
						syncx[i].scrollLeft = x;
						syncx[i].style[pe] = 'none';
					}
				}

				for (var i = 0; i < syncy.length; i++) {
					if (syncy[i].$csid !== synclocked) {
						syncy[i].scrollTop = y;
						syncy[i].style[pe] = 'none';
					}
				}
			}
		};

		pathx && pathx.on('mousedown', function(e) {

			drag.type = 'x';

			var tag = e.target.tagName;

			if (tag === 'SPAN' || tag === 'B') {
				bind();
				drag.offset = element.offset().left + e.offsetX;
				drag.offset2 = e.offsetX;
				drag.is = true;
				drag.pos = e.pageX;
				drag.counter = 0;
			} else {
				// path
				var offsetX = e.offsetX < 10 ? 0 : e.offsetX > (size.viewWidth - 10) ? size.viewWidth : (e.offsetX - 10);
				var p = Math.ceil((offsetX / (size.viewWidth - size.hbarsize)) * 100);
				self.scrollLeft(((size.scrollWidth - size.viewWidth + (options.marginX || 0)) / 100) * (p > 100 ? 100 : p));
				drag.is = false;
				return;
			}

			if (!pathx.hclass(n + '-' + 'hidden'))
				pathx.aclass(n + '-x-show');

			e.preventDefault();
			e.stopPropagation();
		}).on('mouseup', function() {
			drag.is = false;
			unbind();
		});

		pathy && pathy.on('mousedown', function(e) {

			drag.type = 'y';

			var tag = e.target.tagName;

			if (tag === 'SPAN' || tag === 'B') {
				bind();
				drag.offset = element.offset().top + e.offsetY;
				drag.offset2 = e.offsetY;
				drag.pos = e.pageY;
				drag.is = true;
				drag.counter = 0;
			} else {
				// path
				var offsetY = e.offsetY < 10 ? 0 : e.offsetY > (size.viewHeight - 10) ? size.viewHeight : (e.offsetY - 10);
				var p = Math.ceil((offsetY / (size.viewHeight - size.vbarsize)) * 100);
				self.scrollTop(((size.scrollHeight - size.viewHeight + (options.marginY || 0)) / 100) * (p > 100 ? 100 : p));
				drag.is = false;
				return;
			}

			if (!pathy.hclass(n + '-' + 'hidden'))
				pathy.aclass(n + '-y-show');

			e.preventDefault();
			e.stopPropagation();

		}).on('mouseup', function() {
			drag.is = false;
			unbind();
		});

		area.on('scroll', handlers.onscroll);

		self.element.on('scroll', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var t = this;
			if (t.scrollTop)
				t.scrollTop = 0;
			if (t.scrollLeft)
				t.scrollLeft = 0;
			return false;
		});

		self.check = function() {

			var el = element[0];
			var parent = el.parentNode;
			var is = false;

			while (parent) {
				if (parent.tagName === 'body') {
					is = true;
					break;
				}
				parent = parent.parentNode;
			}

			if (is)
				self.resize();
			else
				self.destroy();
		};

		var cssx = {};
		var cssy = {};
		var cssba = {};

		var PR = 'padding-right';
		var PB = 'padding-bottom';

		self.size = size;
		self.resize2 = onresize;
		self.resize = function(scrolling, force) {

			if (resizeid) {
				clearTimeout(resizeid);
				resizeid = null;
			}

			// Not visible
			if (!force && HIDDEN(element[0]))
				return;

			animcache.yis = false;
			animcache.xis = false;
			animcache.y = -1;
			animcache.x = -1;

			var a = area[0];
			var el = element;
			var md = isMOBILE && !SCROLLBARWIDTH();

			delayresize = null;

			if (options.parent) {
				el = typeof(options.parent) === 'object' ? $(options.parent) : el.closest(options.parent);
				if (!el[0].$scrollbar) {
					el[0].$scrollbar = self;
					el.on('scroll', function(e) {
						var t = this;
						if (t.scrollTop)
							t.scrollTop = 0;
						if (t.scrollLeft)
							t.scrollLeft = 0;
						e.preventDefault();
						return false;
					});
				}
			}

			size.viewWidth = el.width() + (options.offsetX || 0);
			size.viewHeight = el.height() + (options.offsetY || 0);

			var sw = SCROLLBARWIDTH();
			size.margin = sw;

			if (!size.margin && !md) {
				// Mac OS
				size.empty = 1;
				size.margin = options.margin == null ? 25 : options.margin;
				self.margin = options.margin == null ? (size.thicknessH ? -size.thicknessH : 0) : options.margin;
				self.marginX = canY ? self.margin : 0;
				self.marginY = canX ? self.margin : 0;
			} else {
				size.empty = 0;
				self.margin = sw;
				self.marginX = canY ? self.margin : 0;
				self.marginY = canX ? self.margin : 0;
			}

			self.thinknessX = size.thicknessH;
			self.thinknessY = size.thicknessY;

			var mx = canX ? (options.marginX || 0) : 0;
			var my = canY ? (options.marginY || 0) : 0;
			var aw;
			var ah;

			// Safari iOS
			if (md) {

				if (size.viewWidth > WW)
					size.viewWidth = WW;

				if (size.viewWidth > screen.width)
					size.viewWidth = screen.width;

				aw = size.viewWidth - mx;
				ah = size.viewHeight - my;

				if (scrollbarcache.md != md) {
					// scrollbarcache.md = md; --> is defined below
					path.tclass('hidden', md);
				}

			} else {
				aw = size.viewWidth + (canY ? size.margin : 0) - mx;
				ah = size.viewHeight + (canX ? size.margin : 0) - my;
			}

			if (scrollbarcache.aw !== aw) {
				scrollbarcache.aw = aw;
				!md && area.css('width', aw);
				if (shadowtop) {
					var shadowm = options.marginshadowY || 0;
					shadowtop.css('width', size.viewWidth - shadowm);
					shadowbottom.css('width', size.viewWidth - shadowm);
				}
				shadowright && shadowright.css('left', size.viewWidth - shadowheight);
				bodyarea.css(orientation === 'y' ? 'width' : 'min-' + 'width', size.viewWidth - mx + (W.isIE || isedge || !sw ? size.margin : 0) - (orientation === 'x' ? size.margin : 0));
			}

			if (scrollbarcache.ah !== ah) {
				scrollbarcache.ah = ah;
				area.css('height', ah);
				shadowbottom && shadowbottom.css('top', size.viewHeight - shadowheight);
			}

			size.scrollWidth = a.scrollWidth || 0;
			size.scrollHeight = a.scrollHeight || 0;

			if (canX)
				size.clientWidth = Math.ceil(area.innerWidth());

			if (canY)
				size.clientHeight = Math.ceil(area.innerHeight());

			var defthickness = options.thickness || 10;

			if (!size.thicknessH && canX)
				size.thicknessH = (pathx.height() || defthickness) - 1;

			if (!size.thicknessV && canY)
				size.thicknessV = (pathy.width() || defthickness) - 1;

			if (size.hpos == null)
				size.hpos = 0;

			if (size.vpos == null)
				size.vpos = 0;

			if (canX) {

				if (iscc) {
					cssx.top = size.viewHeight - size.thicknessH;
					cssx.width = size.viewWidth;
				} else {
					cssx.top = size.viewHeight - size.thicknessH;
					cssx.width = size.viewWidth;
				}

				if (options.marginXY)
					cssx.top -= options.marginXY;

				if (options.marginX)
					cssx.width -= options.marginX;

				if (shadowleft) {
					var shadowm = options.marginshadowX || 0;
					var shadowplus = options.floating === false ? 0 : pathx.height();
					shadowleft.css('height', cssx.top - (options.marginshadowX || 0) + shadowplus);
					shadowright.css('height', cssx.top - (options.marginshadowX || 0) + shadowplus);
				}

				var pl = pathx.css('left');
				if (pl) {
					pl = pl.parseInt();
					cssx.width -= (pl * 2);
				}

				if (options.padding)
					cssx.top -= options.padding;

				pathx.css(cssx);
			}

			if (canY) {

				if (iscc) {
					cssy.left = controls.width() - size.thicknessV;
					cssy.height = controls.height();
				} else {
					cssy.left = size.viewWidth - size.thicknessV;
					cssy.height = size.viewHeight;
				}

				if (options.padding)
					cssy.left -= options.padding;

				var pt = pathy.css('top');
				if (pt) {
					pt = pt.parseInt();
					cssy.height -= (pt * 2);
				}

				if (options.marginYX && cssx.left != null)
					cssx.left -= options.marginYX;

				if (options.marginY)
					cssy.height -= options.marginY;

				pathy.css(cssy);
				size.vbar = (size.scrollHeight - size.clientHeight) > 5;
				if (size.vbar) {
					size.vbarsize = (size.clientHeight * (cssy.height / size.scrollHeight)) >> 0;
					if (size.vbarsize < options.minsize)
						size.vbarsize = options.minsize;
					size.vbarlength = cssy.height;
					if (scrollbarcache.vbarsize !== size.vbarsize) {
						scrollbarcache.vbarsize = size.vbarsize;
						bary.stop().css('height', size.vbarsize).attrd('size', size.vbarsize);
					}
				}
			}

			if (canX) {
				size.hbar = size.scrollWidth > size.clientWidth;
				if (size.hbar) {
					size.hbarsize = (size.clientWidth * (cssx.width / size.scrollWidth)) >> 0;
					size.hbarlength = cssx.width;
					if (size.hbarsize < options.minsize)
						size.hbarsize = options.minsize;
					if (scrollbarcache.hbarsize !== size.hbarsize) {
						scrollbarcache.hbarsize = size.hbarsize;
						barx.stop().css('width', size.hbarsize).attrd('size', size.hbarsize);
					}
				}
			}

			if (scrollbarcache.canX !== canX) {
				scrollbarcache.canX = canX;
				area[0].style['overflow-x'] = canX ? '' : 'hidden';
			}

			if (scrollbarcache.canY !== canY) {
				scrollbarcache.canY = canY;
				area[0].style['overflow-y'] = canY ? '' : 'hidden';
			}

			if (!size.vbarsize)
				size.vbarsize = 0;

			if (!size.hbarsize)
				size.hbarsize = 0;

			var n = DEF.prefixcsslibrary + 'scrollbar-';

			if (canX && scrollbarcache.hbar !== size.hbar) {
				scrollbarcache.hbar = size.hbar;
				pathx.tclass((visibleX ? n : '') + 'hidden', !size.hbar);
			}

			if (canY && scrollbarcache.vbar !== size.vbar) {
				scrollbarcache.vbar = size.vbar;
				pathy.tclass((visibleY ? n : '') + 'hidden', !size.vbar);
			}

			if (visibleX && !size.hbar)
				size.hbar = true;

			if (visibleY && !size.vbar)
				size.vbar = true;

			var isx = size.hbar && canX;
			var isy = size.vbar && canY;

			if (scrollbarcache.isx !== isx) {
				scrollbarcache.isx = isx;
				element.tclass(n + 'isx', isx);
			}

			if (scrollbarcache.isy !== isy) {
				scrollbarcache.isy = isy;
				element.tclass(n + 'isy', isy);
			}

			if (scrollbarcache.md !== md) {
				scrollbarcache.md = md;
				element.tclass(n + 'touch', md);
			}

			if (!scrollbarcache.ready) {
				scrollbarcache.ready = 1;
				path.rclass(n + 'notready');
			}

			if (size.margin) {
				var plus = size.margin;

				if (W.isIE == false && sw && !isedge)
					plus = 0;

				if (options.floating == false) {
					if (canY)
						cssba[PR] = size.vbar ? (size.thicknessV + plus) : plus;
					if (canX)
						cssba[PB] = size.hbar ? (size.thicknessH + plus) : plus;
				} else {
					if (canY)
						cssba[PR] = plus;
					if (canX)
						cssba[PB] = plus;
				}

				if (scrollbarcache[PR] !== cssba[PR] || scrollbarcache[PB] !== cssba[PB]) {
					scrollbarcache[PR] = cssba[PR];
					scrollbarcache[PB] = cssba[PB];
					bodyarea.css(cssba);
				}
			}

			options.onresize && options.onresize(self);

			if (!scrolling)
				handlers.onscroll();

			return self;
		};

		self.scrollLeft = function(val) {

			if (val == null)
				return area[0].scrollLeft;

			if (typeof(val) === 'string')
				val = area[0].scrollLeft + (+val);

			size.hpos = -1;
			return area[0].scrollLeft = val;
		};

		self.scrollTop = function(val) {

			if (val == null)
				return area[0].scrollTop;

			if (typeof(val) === 'string')
				val = area[0].scrollTop + (+val);

			size.vpos = -1;
			return area[0].scrollTop = val;
		};

		self.scrollBottom = function(val) {
			if (val == null)
				return area[0].scrollTop;
			size.vpos = -1;
			return area[0].scrollTop = (area[0].scrollHeight - size.clientHeight) - (val || 0);
		};

		self.scrollRight = function(val) {
			if (val == null)
				return area[0].scrollLeft;
			size.hpos = -1;
			return area[0].scrollLeft = (area[0].scrollWidth - size.clientWidth) - (val || 0);
		};

		self.scroll = function(x, y) {
			area[0].scrollLeft = x;
			area[0].scrollTop = y;
			size.vpos = -1;
			size.hpos = -1;
			return self;
		};

		self.destroy = function() {
			clearInterval(intervalresize);
			unbind();
			area && area.off();
			pathx && pathx.off();
			pathy && pathy.off();
			T.off('resize', self.resize);
			var index = T.scrollbars.indexOf(self);
			if (index !== -1)
				T.scrollbars.splice(index, 1);
		};

		var resize_visible = function() {
			if (HIDDEN(element[0]))
				setTimeout(resize_visible, 234);
			else {
				setTimeout(self.resize, 500);
				setTimeout(self.resize, 1000);
				self.resize();
			}
		};

		if (options.autoresize == null || options.autoresize) {
			$W.on('resize', onresize);
			T.on('resize', self.resize);
		}

		self.unsyncdone = function() {
			synclocked = null;
			syncdelay = null;

			for (var i = 0; i < syncx.length; i++)
				syncx[i].style[pe] = '';

			for (var i = 0; i < syncy.length; i++)
				syncy[i].style[pe] = '';
		};

		self.unsync = function() {
			syncdelay && clearTimeout(syncdelay);
			syncdelay = setTimeout(self.unsyncdone, 300);
		};

		self.sync = function(el, offset) {

			el = el instanceof jQuery ? el : $(el);
			el[0].$csid = 'cs' + GUID(8);

			var isx = !offset || offset === 'left' || offset === 'x';
			var isy = !offset || offset === 'top' || offset === 'y';

			el.on('scroll', function() {

				if (synclocked && synclocked !== this.$csid)
					return;

				synclocked = this.$csid;
				self.unsync();

				if (isx)
					self.area[0].scrollLeft = this.scrollLeft;

				if (isy)
					self.area[0].scrollTop = this.scrollTop;
			});

			isx && syncx.push(el[0]);
			isy && syncy.push(el[0]);
		};

		resize_visible();
		intervalresize = setInterval(self.check, options.interval || 54321);
		T.scrollbars.push(self);
		return self;
	}

})(window);