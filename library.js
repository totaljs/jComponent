// Total.js UI Library (jComponent v20)
// DEV

(function(W) {

	if (W.jComponent)
		return;

	const ERR = 'jComponent: {0}';
	const Total = {};
	const DEF = {
		cl: {}
	};

	const TNB = { number: 1, boolean: 1 };
	const T = Total;
	var readycounter = 0;

	W.Total = T;
	W.jComponent = T;
	W.DEF = DEF;
	W.PLUGINS = {};
	W.W = W;
	W.MAIN = T;
	W.FUNC = {};
	W.TEMP = {};
	W.M = T;
	W.$W = $(W);
	W.MONTHS = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
	W.DAYS = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

	/*
		@Path: Globals
		@Method: NOOP(); #return {Function};
		The method returns empty function that means "no operation".
	*/
	W.COMPILE = W.NOOP = function() {};

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

	DEF.cl = {};
	DEF.path = {};
	DEF.path.common = 'common.';
	DEF.path.cl = 'DEF.cl.';
	DEF.path.plugins = 'jComponent.data.';
	DEF.path.tmp = 'DEF.tmp.';
	DEF.path.clean = name => DEF.path[name].substring(0, DEF.path[name].length - 1);
	DEF.headers = { 'X-Requested-With': 'XMLHttpRequest' };
	DEF.fallback = 'https://cdn.componentator.com/j-{0}.html';
	DEF.localstorage = 'jc';
	DEF.dictionary = {};
	DEF.currency = '';
	DEF.currencies = {};
	DEF.cdn = '';
	DEF.tmp = {};
	DEF.iconprefix = 'ti ti-';
	DEF.color = '#4285F4';
	DEF.scrollbaranimate = true;
	DEF.thousandsseparator = ' ';
	DEF.decimalseparator = '.';
	DEF.dateformat = 'yyyy-MM-dd';
	DEF.timeformat = 'HH:mm';
	DEF.dateformatutc = false;
	DEF.devices = { xs: { max: 768 }, sm: { min: 768, max: 992 }, md: { min: 992, max: 1200 }, lg: { min: 1200 }};
	DEF.baseurl = ''; // String or Function
	DEF.root = ''; // String or Function
	DEF.empty = '---';
	DEF.env = {};
	DEF.env.ts = DEF.dateformat + ' - ' + DEF.timeformat;
	DEF.env.date = DEF.dateformat;
	DEF.env.time = DEF.timeformat;

	DEF.prefixcsscomponents = 'ui-';
	DEF.prefixcsslibrary = 'ui-';

	DEF.regexp = {};
	DEF.regexp.int = /(-|\+)?[0-9]+/;
	DEF.regexp.float = /(-|\+)?[0-9.,]+/;
	DEF.regexp.date = /YYYY|yyyy|YY|yy|MMMM|MMM|MM|M|dddd|DDDD|DDD|ddd|DD|dd|D|d|HH|H|hh|h|mm|m|ss|s|a|ww|w/g;
	DEF.regexp.pluralize = /#{1,}/g;
	DEF.regexp.format = /\{\d+\}/g;
	DEF.regexp.url = /http(s)?:\/\/[^,{}\\]*$/i;
	DEF.regexp.phone = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,8}$/im;
	DEF.regexp.email = /^[a-zA-Z0-9-_.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

	DEF.onstorageread = function(callback) {
		let cache = {};
		try {
			cache = PARSE(localStorage.getItem(DEF.localstorage) || '');
		} catch {}
		callback(cache || {});
	};

	DEF.onstoragesave = function(data) {
		try {
			localStorage.setItem(DEF.localstorage, JSON.stringify(data));
		} catch {}
	};

	T.version = 20;
	T.is20 = true;
	T.ready = false;
	T.root = W;
	T.components = [];
	T.binders = [];
	T.scrollbars = [];
	T.watchers = [];
	T.events = {};
	T.plugins = W.PLUGINS;
	T.data = {};
	T.caller = null;
	T.def = DEF;
	T.autofill = [];
	T.scope = NOOP;

	T.cache = {
		timeouts: {},
		external: {},
		imports: {},
		storage: {},
		paths: {},
		normalizer: {},
		splitter: {},
		plugins: [],
		counter: 0,
		statics: {},
		lockers: {},
		resize: {},
		blocked: {},
		wait: {},
		tmp: {},
		cl: {}
	};

	T.db = {
		lazy: {},
		plugins: {},
		extensions: {},
		configs: [],
		components: {}
	};

	setInterval(function() {

		W.NOW = new Date();

		try {
			T.free();
		} catch {
			WARN(ERR.format('T.free()'), e);
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
		W.TEMP = {};
		T.cache.counter++;
		T.emit('service', T.cache.counter);

		// Every 5 minutes
		if (T.cache.counter % 5 === 0) {
			T.cache.paths = {};
			T.cache.splitter = {};
			T.cache.normalizer = {};
		}

	}, 60000);

	/*
		@Path: Core
		@Method: jComponent.free();
		The method clears all removed components, binders and plugins.
	*/
	T.free = function() {
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
	};

	/*
		@Path: Core
		@Method: jComponent.set(scope, path, value); #scope {Object}; #path {String}; #value {Object};
		The method assigns a `value` based on a `path` to the defined `scope`.
	*/
	T.set = function(scope, path, value) {

		var key = 'A' + HASH(path);
		var fn = T.cache.paths[key];

		if (fn)
			return fn(scope, value);

		var params = [];

		path = path.replace(/\['.*?'\]|\[".*?"\]/g, text => '[#' + (params.push(text) - 1) + ']');

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
		var a = builder.join('') + 'var v=typeof(a)===\'function\'?a(jComponent.get(a, b)):a;w' + (v[0] === '[' ? '' : '.') + (ispush ? v.replace(regarr, '.push(v)') : (v + '=v')) + ';return v';

		a = a.replace(/\[#\d+\]/g, text => params[+text.substring(2, text.length - 1)]);

		var fn = new Function('w', 'a', 'b', a);
		return fn(scope, value, path);
	};

	/*
		@Path: Core
		@Method: jComponent.get(scope, path); #scope {Object}; #path {String}; #return {String/Boolean/Object};
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

		if (name.includes('+')) {
			let arr = name.split('+').trim();
			for (let m of arr)
				T.off(m, callback);
			return;
		}

		if (callback) {
			var arr = T.events[name];
			var index = arr.indexOf(callback);
			if (index !== -1)
				arr.splice(index, 1);
		} else
			delete T.events[name];
	};

	T.on = function(name, callback, autoinit) {

		if (T.ready && (name === 'ready' || name === 'init')) {
			callback();
			return;
		}

		if (name.includes('+')) {
			let arr = name.split('+').trim();
			for (let m of arr)
				T.on(m, callback, autoinit);
			return;
		}

		var arr = T.events[name];

		if (!arr)
			arr = T.events[name] = [];

		arr.push(callback);
		autoinit && setTimeout(callback, 1);
	};

	T.watch = function(path, callback, autoinit) {

		if (path.includes('+')) {
			let arr = path.split('+').trim();
			for (let m of arr)
				T.watch(m, callback, autoinit);
			return;
		}

		path = parsepath(path);
		T.watchers.push({ scope: T.root, path: path, fn: callback });
		autoinit && setTimeout(() => callback(path.get(T.root), path.flags, path.path), 1);
	};

	T.unwatch = function(path, callback) {

		if (path.includes('+')) {
			let arr = path.split('+').trim();
			for (let m of arr)
				T.unwatch(m, callback);
			return;
		}

		path = parsepath(path);
		let rem = [];
		for (let m of T.watchers) {
			if (m.path.path === path.path) {
				if (!callback || m.fn == callback)
					rem.push(m);
			}
		}

		for (let m of rem)
			T.watchers.splice(T.watchers.indexOf(m), 1);
	};

	T.flags = function(flags, callback) {
		var path = new T.Path(flags);
		path.exec(callback || NOOP);
	};

	T.emit = function(name, a, b, c, d) {

		// Flags
		var index = name.indexOf(' @');
		if (index !== -1) {
			T.flags(name.substring(index + 1));
			name = name.substring(0, index);
		}

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

		var c = name.charAt(0);

		if (c === '-') {
			T.setter(null, name.substring(1), a, b, c, d);
			return;
		}

		if (c === '#') {
			T.emit(name.substring(1), a, b, c, d);
			return;
		}

		if (c === '&') {
			T.cmd(null, name.substring(1), a, b, c, d);
			return;
		}

		if (c === '*')
			name = DEF.path.clean('common') + name.substring(1);

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
				if (plugin[tmp[1]]) {
					path.exec(() => plugin[tmp[1]](a, b, c, d));
					T.caller = plugin;
				} else
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

	T.seex = function(name, a, b, c, d) {

		if (name.charAt(0) === '*')
			name = DEF.path.clean('common') + name.substring(1);

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
				if (plugin[tmp[1]]) {
					path.exec(() => plugin[tmp[1]](a, b, c, d));
					T.caller = plugin;
				} else
					WARN(ERR.format('The method "{0}/{1}" not found.'.format(tmp[0], tmp[1])));
			} else {
				if (path && path.flags.important)
					setTimeout(T.exec, 500, raw, a, b, c, d);
				else
					WARN(ERR.format('The plugin "{0}" not found.'.format(tmp[0])));
			}
		} else {
			var fn = null;
			if (typeof(W[name]) == 'function')
				fn = () => W[name](a, b, c, d);
			else
				fn = () => SET(name, a);
			path.exec(fn);
		}

	};

	T.setter = function(element, name, a, b, c, d) {

		// Backward compatibility
		if (name === true) {
			T.setter(element, a + ' @important', b, c, d);
			return;
		}

		let raw = name;
		let arr = T.components;
		let check = name.charAt(0) === '!';

		if (check)
			name = name.substring(1);

		let index = name.indexOf(' ');
		let path = '';

		if (index !== -1) {
			path = name.substring(index + 1);
			name = name.substring(0, index);
		}

		path = parsepath(path);

		if (element) {
			arr = [];
			if (element instanceof T.Plugin) {
				for (let m of T.components) {
					if (m.plugin === element)
						arr.push(m);
				}
			} else {
				let tmp = element.find('ui-component');
				for (let m of tmp) {
					if (m.$uicomponent)
						arr.push(m.$uicomponent);
				}
			}
		}

		let tmp = name.split('/').trim();
		let sel = name.charAt(0);
		let id = '';
		let pth = '';

		name = tmp[0];

		if (T.cache.lockers[name]) {
			setTimeout(T.setter, 300, element, raw, a, b, c, d);
			return;
		}

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

		// Check lazy components
		if (!check && name) {
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
				if (sel != '*') {
					if (id) {
						if (m.id !== id)
							continue;
					} else if (pth) {
						if (!m.path.includes(pth))
							continue;
					} else if (m.name !== tmp[0])
						continue;
				}

				count++;

				if (m[tmp[1]])
					run.push(m);
				else if (sel !== '*')
					WARN('The setter "{0}" not found.'.format(raw));
			}
		}

		if (run.length) {
			path.exec(function() {
				for (let m of run)
					m[tmp[1]](a, b, c, d);
			});
		} else if (path.flags.important)
			setTimeout(T.setter, 500, element, raw, a, b, c, d);

	};

	T.cmd = function(element, name, a, b, c, d) {

		var arr = T.components;

		if (element) {
			arr = [];
			if (element instanceof T.Plugin) {
				for (let m of T.components) {
					if (m.plugin === element)
						arr.push(m);
				}
			} else {
				arr = element.find('ui-component');
				for (let m of arr) {
					if (m.$uicomponent)
						arr.push(m.$uicomponent);
				}
			}
		}

		for (let m of arr) {
			if (m.ready) {
				if (m.commands[name])
					m.cmd(name, a, b, c, d);
			}
		}
	};

	/*
		@Path: Core
		@Method: jComponent.find(scope, path, callback); #scope {object}; #path {String}; #callback {Function(arr)};
		The method returns in the callback all component instances defined in the path scope.
	*/
	T.find = function(scope, path, callback) {
		path = path instanceof T.Path ? path : parsepath(path);
		path.exec(function() {
			var arr = [];
			for (let m of T.components) {
				if (!m.internal.blind && m.ready && m.scope === scope) {
					if (m.path && path.includes(m.path)) {
						if ((path.flags.visible && HIDDEN(m.element)) || (path.flags.touched && !m.config.touched) || (path.flags.modified && !m.config.modified) || (path.flags.required && !m.config.required) || (path.flags.invalid && !m.config.invalid) || (path.flags.disabled && !m.config.disabled) || (path.flags.enabled && m.config.disabled))
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
		@Method: jComponent.notify(scope, path, [onlyflags]); #scope {Object}; #path {String}; #onlyflags {Boolean} optional default "false";
		The method notifies all watchers based on a `path` ot the defined `scope`.
	*/
	T.notify = function(scope, path, onlyflags) {

		// @onlyflags = true notifies components about changed state

		path = path instanceof T.Path ? path : parsepath(path);
		path.exec(function() {

			// Component watchers
			for (let m of T.components) {
				if (!m.internal.blind && m.ready && m.scope === scope) {

					if (!m.path || m.path.includes(path)) {

						if (path.flags.reset || path.flags.default)
							m.reconfigure({ touched: 0, modified: 0 });
						else if (path.flags.change || path.flags.touch || path.flags.modify || path.flags.modified)
							m.reconfigure({ touched: 1, modified: 1 });

						if (onlyflags)
							m.$validate();
						else if (m.path)
							m.$setter(m.get(), path.flags, path.path);
					}

					if (!onlyflags) {
						for (let w of m.watchers) {
							if (w.path.includes(path))
								w.fn(w.path.get(scope), path.flags, path.path);
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
							m.fn(m.path.get(scope), path.flags, path.path);
					}
				}
			}

			// Global watchers
			for (let m of T.watchers) {
				if (m.scope === scope && (!m.path || m.path.includes(path)))
					m.fn(m.path.get(scope), path.flags, path.path);
			}

			// Binders
			for (let m of T.binders) {
				if (m.fn && m.scope === scope && (!m.path || m.path.includes(path)))
					m.fn(m.path.get(scope), path.flags, path);
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

	T.parse = function(type, value, format) {

		switch (type) {
			case 'number':
			case 'currency':
			case 'float':

				var t = typeof(value);
				var v = null;

				if (t == 'string') {
					switch (DEF.thousandsseparator) {
						case ' ':
							value = value.replace(/\s/g, '');
							break;
						case ',':
							value = value.replace(/\s|,/g, '');
							break;
						case '.':
							value = value.replace(/\s|\./g, '');
							break;
					}

					if (DEF.decimalseparator === ',')
						value = value.replace(/\,/g, '.');

					if (value)
						v = +value;
					else
						return null;

				} else if (t === 'number')
					v = value;
				else
					return null;

				return isNaN(v) ? null : v;

			case 'boolean':
			case 'bool':
				return value == null ? null : (value === true || value === '1' || value === 'true' || value === 'on' || value === 'yes' || value === 'y');

			case 'date':
			case 'datetime':
				if (!value)
					return null;
				if (value instanceof Date)
					return value;
				value = value.parseDate(format || DEF.dateformat);
				return value && value.getTime() ? value : null;
		}

		return value;
	};

	/*
		@Path: Core
		@Method: jComponent.cl(name, callback); #name {String}; #callback {Function()};
		The method inicializes codelists.
	*/
	T.cl = function(name, callback) {
		callback();
	};

	function reuildcssforce() {
		var builder = [];
		for (let key in M.db.components) {
			let item = M.db.components[key];
			if (item.css)
				builder.push(item.css.replace(/CLASS/g, 'ui-' + key));
		}
		CSS(builder.join('\n'), 'components');
	}

	function rebuildcss() {
		setTimeout2('uicomponentcss', reuildcssforce, 5);
	}

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
		} catch {}
	}

	function parsepath(path) {

		if (path instanceof T.Path)
			return path;

		var key = 'C' + HASH(path);
		var cache = T.cache.paths[key];
		if (cache)
			return cache;

		return T.cache.paths[key] = new T.Path(path);
	}

	function pluginparent(plugin, count, prop) {

		if (!plugin)
			return '';

		if (!count)
			return plugin[prop].toString();

		for (var i = 0; i < count; i++) {
			plugin = plugin.plugin;
			if (plugin == null)
				break;
		}

		return plugin ? plugin[prop].toString() : '';
	}

	function preparepath(plugin, path) {

		if (plugin instanceof T.Component)
			plugin = plugin.plugin;

		path = path.replace(/\?(\d)?\|/, function(text) {
			text = text.substring(0, text.length);
			return 'PLUGINS["{0}"]'.format(pluginparent(plugin, +text.substring(1), 'path')) + '.';
		}).replace(/\|/, () => 'PLUGINS["{0}"]'.format(pluginparent(plugin, 0, 'path')) + '.').replace(/\?(\d)?/, function(text) {
			return pluginparent(plugin, +text.substring(1), 'path');
		});

		return parsepath(path).path;
	}

	function normalize(path) {

		if (!path)
			return EMPTYARRAY;

		let arr = T.cache.normalizer[path];
		if (arr)
			return arr;

		path = path.replace(/"/g, '\'').replace(/\[.*?\]/g, text => text.replace(/\./g, '\0'));
		arr = path.split('.');

		for (let i = 0; i < arr.length; i++) {
			let m = arr[i];
			if (m.charAt(0) !== '[') {
				let index = m.indexOf('[');
				arr[i] = index === -1 ? ('[\'' + m + '\']') : ('[\'' + m.substring(0, index) + '\']' + m.substring(index));
			}
		}

		arr = arr.join('').replace(/\]\[/g, '].[').split('.');
		for (let i = 0; i < arr.length; i++)
			arr[i] = arr[i].replace(/\0/g, '.');
		T.cache.normalizer[path] = arr;
		return arr;
	}

	function splitpath(path) {

		if (!path)
			return EMPTYARRAY;

		if (path instanceof T.Path)
			return path.split;

		var key = path;
		var builder = T.cache.splitter[key];
		if (builder)
			return builder;

		var arr = normalize(path);
		builder = [];

		for (let i = 0; i < arr.length; i++)
			builder.push(arr.slice(0, i + 1).join(''));

		T.cache.splitter[key] = builder;
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

	function findinstance(t, prop) {

		if (t[prop])
			return t[prop];

		t = t.parentNode;
		while (t) {
			if (t[prop])
				return t[prop];
			t = t.parentNode;
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
			t.config = (typeof(config) === 'string' ? config.parseConfig(null, type === 'bind') : config) || {};
			t.dom = el[0];
			t.ready = false;
			t.callback = callback;
			t.pending = [];
			readycounter++;
			setTimeout(t.init, 1, t);
		};

		var PROTO = T.Proxy.prototype;

		function init(t) {

			if (t.ref.count != null)
				t.ref.count++;

			t.ready = true;
			t.instance.scope = W;
			t.instance.name = t.name || t.path;
			t.instance.path = t.path && t.path !== 'null' ? new T.Path(t.path) : null;
			t.instance.proxy = t;
			t.instance.element = t.element;
			t.instance.dom = t.element[0];
			t.instance.config = {};
			t.instance.plugin = t.instance.dom.$uiplugin || (t.parent ? t.parent[0].$uiplugin : null);

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
					reference = '$uiplugin';
					break;
				case 'component':
					// t.element.aclass(cls);
					t.instance.cls = cls;
					t.instance.def = t.element.attr('default');

					if (t.instance.def)
						t.instance.def = new Function('return ' + t.instance.def);

					extensions = T.db.extensions[t.instance.name];
					reference = '$uicomponent';
					T.components.push(t.instance);
					break;
				case 'bind':
					reference = '$uibinder';
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

			try {
				t.ref.callback && t.ref.callback.call(t.instance, t.instance, t.instance.config, cls);
			} catch (e) {
				WARN(ERR.format('Unexpected component error "{0}":'.format(t.instance.name)), e, t.element);
			}

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

			readycounter--;

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
				}, value => value ? ADAPT(t.config.path, t.config.id, value) : value);

				return;
			}

			let tmp;

			if (t.type === 'plugin' && !t.instance) {

				let last = T.cache.plugins.shift();

				if (!t.path)
					t.path = last || '';

				if (t.path === '*')
					t.path = DEF.path.clean('common');

				tmp = T.db.plugins[t.path];

				if (t.path.includes(' ') && t.path.includes('?'))
					t.path = DEF.path.plugins + GUID(10).replace(/^[0-9]/g, 'x');

				t.ref = tmp;
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
						WARN(ERR.format('The component "{0}" not found'.format(t.name)), t.dom);
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

				if (tmp.singleton) {
					t.element.remove();
					return;
				}

				t.instance = new T.Component(t);
				t.ref = tmp;
			} else if (t.type === 'bind' && !t.instance) {
				t.ref = { config: t.config };
				t.instance = new T.Binder(t, t.config, t.element);
			}

			if (t.path.includes('?') || t.type !== 'plugin') {

				// absolute path
				let parent = findplugin(t.type === 'plugin' ? t.dom.parentNode : t.dom);
				if (parent) {

					let proxy = parent.$proxyplugin;
					if (proxy && proxy.ready) {
						t.parent = proxy.element;

						if (t.path.includes('?'))
							t.path = t.path.replace(/\?/g, proxy.path);

					} else {
						setTimeout(t.init, 50, t);
						return;
					}

				} else if (t.path.includes('?')) {
					WARN(ERR.format('The element "{0}" does not have defined parent plugin'.format(t.path)), t.element[0]);
					return;
				}
			}

			if (t.type === 'plugin' && !t.ref) {
				t.ref = T.db.plugins[t.path];
				if (!t.ref) {
					PLUGIN(t.path, NOOP);
					t.ref = T.db.plugins[t.path];
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
		element[0].$proxycomponent = new T.Proxy('component', element, name, path, config, callback);
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
		let name = el.getAttribute('name');
		let config = el.getAttribute('config');
		let path = el.getAttribute('path');
		name && T.newcomponent($(el), name, path, config);
	}, function(el, property, value) {
		// attribute is changed
	});

	register('ui-plugin', function(el) {
		el = $(el);
		let path = el.attr('path');
		T.newplugin(el, path, el.attr('config'));
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
			@Class: jComponent.Path(path)
			The class parses dynamic paths.
		*/
		T.Path = function(path) {

			var t = this;

			t.flags = {};
			t.ERROR = false;

			path = path.replace(' ERROR', function() {
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

			let c = t.path.charAt(0);

			if (c === '%')
				t.path = DEF.path.tmp + t.path.substring(1);
			else if (c === '#')
				t.path = DEF.path.cl + t.path.substring(1);
			else if (c === '*')
				t.path = (t.path.charAt(1) === '/' ? DEF.path.clean('common') : DEF.path.common) + t.path.substring(1);

			c = path.charAt(0);

			if (c === '*')
				path = path.replace(c, DEF.path.clean('common'));

			let index = path.indexOf('|');
			if (index !== -1)
				t.path = 'PLUGINS["' + path.substring(0, index) + '"].' + path.substring(index + 1);

			t.split = splitpath(t.path);
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
			@Method: instance.includes(path); #path {String}; #partially {Boolean}; #return {Boolean};
			The method checks to see if the path is part of the route.
		*/
		PROTO.includes = function(path, partially) {

			var t = this;
			var arr = splitpath(path);

			if (partially) {
				for (let i = t.split.length - 1; i > -1; i--) {
					if (t.split[i].endsWith(arr[arr.length - 1]))
						return true;
				}
			}

			if (arr.length >= t.split.length)
				return t.split[t.split.length - 1] === arr[t.split.length - 1];

			return t.split[arr.length - 1] === arr[arr.length - 1];
		};

		PROTO.toString = function() {
			return this.path;
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
					let tmp = DEF.path.common;
					path = path.substring(1);
					if (path)
						tmp += path;
					else
						tmp = tmp.substring(0, tmp.length - 1);
					return parsepath(tmp);
				case '#':
					path = path.substring(1);
					return parsepath(DEF.path.cl + path);
				case '%':
					path = path.substring(1);
					return parsepath(DEF.path.tmp + path);
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
					T.emit('@flag ' + m, t.path);
			}

			if (t.cl)
				T.cl(t.cl, callback);
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
			@Class: jComponent.Plugin()
			The class handles plugins.
		*/
		T.Plugin = function() {
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
					return t.get('@reset');
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

			t.name = t.path.path;

			if (t.proxy.callback) {
				t.proxy.callback();
				t.proxy.callback = null;
			}

			if (t instanceof T.Plugin)
				t.config.init && EXEC(t.makepath(t.config.init), t.element);

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

			var index = name.indexOf(' ');
			var flags = '';

			if (index !== -1) {
				flags = name.substring(index);
				name = name.substring(0, index);
			}

			var t = this;
			data = { schema: name, data: data ? data : undefined };
			return t.ajax('POST ' + DEF.api + flags, data, callback);
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
			T.caller = t;
		};

		/*
			@Path: Plugin
			@Method: instance.get(path);
			The method reads a value from the plugin model.
		*/
		PROTO.get = function(path) {

			var t = this;

			path = t.path.assign(path);

			/*
			var obj = null;
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

			if (value == undefined) {
				path = '';
				value = path;
			}

			T.caller = t;
			path = t.path.assign(path);
			path.set(t.scope, value);
			path.notify(t.scope);
		};

		/*
			@Path: Plugin
			@Method: instance.push(path, value)
			The method pushes a `value` based on a `path` to the defined plugin `scope`.
		*/
		PROTO.push = function(path, value) {
			var t = this;
			T.caller = t;
			path = t.path.assign(path);
			var arr = path.get(t.scope);
			if (!arr)
				arr = [];
			else if (!(arr instanceof Array))
				arr = [arr];
			arr.push(value);
			path.set(t.scope, arr);
			path.notify(t.scope);
		};

		/*
			@Path: Plugin
			@Method: instance.inc(path, value)
			The method increments a `value` based on a `path` to the defined plugin `scope`.
		*/
		PROTO.inc = function(path, value) {
			var t = this;
			T.caller = t;
			path = t.path.assign(path);
			var val = path.get(t.scope);
			if (val == null)
				val = 0;
			else if (typeof(val) === 'string')
				val = val.parseFloat();
			val += value || 1;
			path.set(t.scope, val);
			path.notify(t.scope);
		};

		/*
			@Path: Plugin
			@Method: instance.toggle(path)
			The method toggles a `value` based on a `path` to the defined plugin `scope`.
		*/
		PROTO.toggle = function(path) {
			var t = this;
			T.caller = t;
			path = t.path.assign(path);
			var val = path.get(t.scope);
			path.set(t.scope, !val);
			path.notify(t.scope);
		};

		/*
			@Path: Plugin
			@Method: instance.set(path, value)
			The method assigns a `value` based on a `path` to the defined plugin `scope`.
		*/
		PROTO.nul = function(path) {
			var t = this;
			T.caller = t;
			path = t.path.assign(path);
			path.set(t.scope, null);
			path.notify(t.scope);
		};

		/*
			@Path: Plugin
			@Method: instance.update(path)
			The method notifies all components and watchers based on the path.
		*/
		PROTO.upd = PROTO.update = function(path) {
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

			if (name.includes('+')) {
				let arr = name.split('+').trim();
				for (let m of arr)
					t.on(m, callback);
				return;
			}

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
		PROTO.watch = function(path, callback, autoinit) {

			if (typeof(path) === 'function') {
				callback = path;
				path = '';
			}

			if (path.includes('+')) {
				let arr = path.split('+').trim();
				for (let m of arr)
					t.watch(m, callback, autoinit);
				return;
			}

			var t = this;

			path = t.path.assign(path);
			t.watchers.push({ path: path, fn: callback });
			autoinit && setTimeout(() => callback(path.get(t.scope), path.flags, path.path), 1);
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

		PROTO.makepath = function(path) {
			return preparepath(this, path);
		};

	})();

	// Component declaration
	(function() {

		/*
			@Class: jComponent.Plugin(proxy);
			The class handles components.
		*/
		T.Component = function(proxy) {
			var t = this;

			t.events = {};
			t.internal = {};
			t.commands = {};
			t.watchers = [];

			t.ID = t.id = 'c' + GUID(10);

		};

		var PROTO = T.Component.prototype;

		// Internal
		PROTO.$init = function() {

			var t = this;
			t.ready = true;

			try {

				var com = T.db.components[t.name];

				if (!com.init) {
					com.init = true;
					t.init && t.init();
				}

				for (let m of T.db.configs) {
					if (m.check(t)) {
						for (let key in m.config)
							t.config[key] = m.config[key];
					}
				}

				t.make && t.make();
				t.reconfigure(t.config, true);
				t.$datasource && t.$datasource.refresh && t.$datasource.refresh();
				t.path && t.$setter(t.get(), { init: 1 }, t.path.path);

			} finally {
				if (t.proxy.callback) {
					t.proxy.callback();
					t.proxy.callback = null;
				}
				t.$loaded = true;
				t.$state();
				t.done && t.done();
			}
		};

		// Deprecated
		PROTO.bindvisible = NOOP;
		PROTO.nocompile = NOOP;
		PROTO.release = NOOP;

		PROTO.makepath = function(path) {
			return preparepath(this, path);
		};

		PROTO.autofill = function(val) {
			this.$autofill = val == null || value === true;
		};

		PROTO.autobind20 = function() {

			var t = this;

			if (t.$autobind)
				return;

			t.$autobind = true;

			var selector = 'input,select,textarea';
			var timeout = null;
			var prev = null;

			var updateforce = function(setter) {
				timeout = null;
				var value = t.find(selector).val();
				if (value !== prev) {
					// arguments false, false - are due to backward functionality
					t.getter(value, false, false);
				}
				setter && t.refresh();
			};

			var update = function(setter) {
				timeout && clearTimeout(timeout);
				timeout = setTimeout(updateforce, 200, setter);
			};

			t.element.on('input', selector, function() {

				if (!t.config.modified || !t.config.touched) {
					let tmp = {};
					if (!t.config.modified)
						tmp.modified = 1;
					if (!t.config.touched)
						tmp.touched = 1;
					t.reconfigure(tmp);
				}

				var value = $(this).val();
				prev = value;

				// arguments true, false - are due to backward functionality
				t.getter(value, true, false);
				update(true);

			}).on('focusin', selector, function() {
				prev = $(this).val();
			}).on('change', selector, function() {
				if (!t.config.modified)
					t.reconfigure({ modified: 1 });
				update(true);
			}).on('blur', selector, function() {
				if (!t.config.touched)
					t.reconfigure({ touched: 1 });
				update(true);
			});
		};

		PROTO.getter = function(value, realtime) {

			var t = this;

			if (t.$parser)
				value = t.$parser(t.path.path, value);

			t.internal.autobound = true;

			if (realtime)
				t.rewrite(value);
			else
				t.set(value);
		};

		PROTO.setter = function(value, path, flags) {

			var t = this;

			if (t.$formatter)
				value = t.$formatter(t.path.path, value);

			if (value == null)
				value = '';

			var control = t.find('input,textarea,select')[0];
			if (control) {

				let selectone = 'select-one';

				if (control.type === 'checkbox') {
					let tmp = value != null ? (value + '').toLowerCase() : '';
					t.checked = tmp === 'true' || tmp === '1' || tmp === 'on' || tmp === 'yes' || tmp === 'ok';
				} else
					$(control).val(value);

				if (flags.init && t.$autofill && control.type !== selectone && control.type !== 'range' && !t.def)
					T.autofill.push(t);

			}

		};

		PROTO.bind = function(flags, value) {

			var t = this;
			var cfg = {};
			var is = false;
			var validate = false;
			var setter = false;
			var f = {};

			if (flags) {
				var arr = flags.split(/\s|,|\|/);
				for (var m of arr) {
					if (m.charAt(0) === '@')
						m = m.substring(1);
					f[m] = 1;
					switch (m) {
						case 'setter':
							setter = true;
							break;
						case 'validate':
							validate = true;
							break;
						case 'touched':
						case 'touch':
							is = true;
							cfg.touched = true;
							break;
						case 'modified':
						case 'changed':
						case 'modify':
						case 'change':
							is = true;
							cfg.modified = true;
							break;
						case 'reset':
							is = true;
							cfg.modified = false;
							cfg.touched = false;
							break;
					}
				}
			}

			is && t.reconfigure(cfg);
			validate && t.$validate();

			if (value !== undefined)
				t.rewrite(value);
			else if (is)
				t.$state();

			setter && t.setter(value !== undefined ? value : t.get(), t.path.toString(), f);
		};

		// Backward compatibility
		PROTO.formatter = function(fn) {
			var t = this;
			if (typeof(fn) === 'function')
				t.$formatter = (path, value) => fn.call(t, t.path.toString(), value, t.config.type, t.config.format);
			else
				return t.$formatter ? t.$formatter('', fn) : fn;
		};

		// Backward compatibility
		PROTO.parser = function(fn) {
			var t = this;
			if (typeof(fn) === 'function')
				t.$parser = (path, value) => fn.call(t, t.path.toString(), value, t.config.type, t.config.format);
			else
				return t.$parser ? t.$parser('', fn) : fn;
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
		};

		/*
			@Path: Component
			@Method: instance.singleton();
			The method enables changes the component instance to a singleton.
		*/
		PROTO.singleton = function() {
			this.internal.singleton = true;
			this.proxy.ref.singleton = true;
		};

		/*
			@Path: Component
			@Method: instance.set(value, [flags]); #value {String}; #[flags] {String} with @;
			The method assigns a value to the model and calls `setter`.
		*/
		PROTO.set = function(value, flags) {

			var t = this;

			if (!t.path)
				return;

			// Backward compatibility
			if (typeof(flags) === 'number') {
				switch (flags) {
					case 3:
						flags = '@default';
						break;
					case 2:
						flags = '@touched @modified';
						break;
					case 1:
						flags = '@modified';
						break;
					case 0:
						flags = '@init';
						break;
					default:
						flags = '';
						break;
				}
			}

			t.path.set(t.scope, value);
			t.path.notify(t.scope, flags);
		};

		/*
			@Path: Component
			@Method: instance.rewrite(value, [flags]); #value {String}; #[flags] {String} with @;
			The method assigns a value to the model without calling the setter.
		*/
		PROTO.rewrite = function(value, flags) {
			let t = this;
			if (t.path) {
				t.skip = true;
				t.set(value, flags);
			}
		};

		PROTO.upd = PROTO.update = function(flags) {

			// Backward compatibility
			if (typeof(flags) === 'boolean')
				flags = null;

			let t = this;
			t.path && t.path.notify(t.scope, flags);
		};

		/*
			@Path: Component
			@Method: instance.get();
			The method reads a value from the model.
		*/
		PROTO.get = function() {
			return this.path ? this.path.get(this.scope) : null;
		};

		/*
			@Path: Component
			@Method: instance.on(name, callback);
			The method registers a global event.
		*/
		PROTO.on = function(name, callback) {
			var t = this;

			if (name.includes('+')) {
				let arr = name.split('+').trim();
				for (let m of arr)
					t.on(m, callback);
				return;
			}

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
		PROTO.watch = function(path, callback, autoinit) {

			var t = this;

			if (typeof(path) === 'function') {
				callback = path;
				path = t.path.toString();
			} else if (path.includes('+')) {
				let arr = path.split('+').trim();
				for (let m of arr)
					t.watch(m, callback, autoinit);
				return;
			}

			path = parsepath(t.makepath(path));
			t.watchers.push({ path: path, fn: callback });
			autoinit && setTimeout(() => callback(path.get(t.scope), path.flags, path.path));
		};

		/*
			@Path: Component
			@Method: instance.unwatch(path, [callback]);
			The method unregisters an existing watcher.
		*/
		PROTO.unwatch = function(path, callback) {

			if (typeof(path) === 'function') {
				callback = path;
				path = t.path.toString();
			} else if (path.includes('+')) {
				let arr = path.split('+').trim();
				for (let m of arr)
					t.unwatch(m, callback);
				return;
			}

			var t = this;
			var rem = [];

			path = t.makepath(path);

			for (let m of t.watchers) {
				if (callback) {
					if (m.path === path && m.callback === callback)
						rem.push(m);
				} else if (m.path === path)
					rem.push(m);
			}

			for (let m of rem)
				t.watchers.splice(t.watchers.indexOf(m), 1);

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
			t.reconfigure({ touched: 1, modified: 1 });
			t.set(value, flags);
		};

		PROTO.change = function() {
			var t = this;
			t.reconfigure({ touched: 1, modified: 1 });
			t.$validate();
		};

		/*
			@Path: Component
			@Method: instance.touch();
			The method simulates user "touch".
		*/
		PROTO.touch = function() {
			var t = this;
			t.reconfigure({ touched: 1 });
			t.$validate();
		};

		/*
			@Path: Component
			@Method: instance.reset();
			The method resets the state.
		*/
		PROTO.reset = function(noemit) {
			var t = this;
			t.reconfigure({ touched: 0, modified: 0 });
			if (!noemit)
				t.$validate();
		};

		PROTO.attrd = function(name, value) {
			let el = this.element;
			let key = 'data-' + name;
			if (value === undefined)
				return el.attr(key);
			el.attr(key, value);
		};

		PROTO.attr = function(name, value) {
			let el = this.element;
			if (value === undefined)
				return el.attr(name);
			el.attr(name, value);
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

		PROTO.attr = function(name, value) {
			var el = this.element;
			if (value === undefined)
				return el.attr(name);
			el.attr(name, value);
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

		PROTO.import = function(url, callback, prepare) {
			IMPORT(url, this.element, callback, prepare);
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

		PROTO.watchconfig = function(key, path) {
			var t = this;
			t.watch(t.makepath(path), value => key ? t.reconfigure({ [key]: value }) : t.reconfigure(value), true);
		};

		/*
			@Path: Component
			@Method: instance.reconfigure(value);
			The method reconfigures the component. The `value` can be `String` or `Object`.
		*/
		PROTO.reconfigure = function(value, init) {

			var t = this;

			if (typeof(value) === 'string') {

				if (value.charAt(0) === '=') {
					// autobinding according to the path
					return;
				}

				value = value.parseConfig();
			}

			var state = false;

			for (let key in value) {

				let val = value[key];

				if (key === '=') {
					// global watcher
					t.watchconfig(null, val);
					continue;
				}

				var c = key.charAt(0);

				if (c === '=') {
					// key watcher
					t.watchconfig(key.substring(1), val);
					continue;
				}

				if (c === '$')
					continue;

				t.config[key] = val;
				t.configure && t.configure(key, val, init, init ? null : t.config[key], init);

				if (key === 'touched' || key === 'invalid' || key === 'modified' || key === 'disabled')
					state = true;
			}

			if (value.$assign)
				T.set(t.scope, t.makepath(value.$assign), t);

			if (value.$class)
				t.element.tclass(value.$class);

			if (value.$id)
				t.id = value.$id;

			if (value.$init)
				t.EXEC(value.$init, t);

			if (!init && state)
				t.$state();

		};

		/*
			@Path: Component
			@Method: instance.refresh();
			The method refreshes value (in other words, it calls instance.setter()).
		*/
		PROTO.refresh = function() {
			var t = this;
			t.$setter(t.get(), { refresh: 1 }, t.path ? t.path.toString() : '');
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

		PROTO.GET = function(path) {
			return GET(preparepath(this, path));
		};

		PROTO.SET = function(path, value) {
			return SET(preparepath(this, path), value);
		};

		PROTO.EXEC = function(name, a, b, c, d) {
			T.exec(preparepath(this, name), a, b, c, d);
		};

		PROTO.SETTER = function(name, a, b, c, d) {
			T.setter(null, name, a, b, c, d);
		};

		PROTO.SEEX = function(name, a, b, c, d) {
			T.seex(preparepath(this, name), a, b, c, d);
		};

		PROTO.parseSource = PROTO.parsesource = function(val) {

			var type = '';

			if (this.config.type === 'number')
				type = 'number';

			return val.parseSource(type);
		};

		/*
			@Path: Component
			@Method: instance.icon(value); #value {String};
			The method checks if it is needed to add the icon prefix defined in `DEF.iconprefix`.
		*/
		PROTO.icon = function(value) {
			return value ? ((value.includes(' ') ? '' : DEF.iconprefix) + value) : '';
		};

		/*
			@Path: Component
			@Method: instance.caniuse(name); #name {String}; #return {String};
			The method checks if the component `name` is defined or not. You can use multiple names in the form `message|notify`.
		*/
		PROTO.caniuse = function(name) {
			var arr = name.split(/\,|\|\s/);
			for (var key of arr) {
				if (T.db.components[key] || T.db.lazy[key])
					return key;
			}
			return false;
		};

		/*
			@Path: Component
			@Method: instance.replace(target, [remove]); #target {Element/jQuery}; #[remove] {Boolean};
			The method moves the component into another element defined in the `target` argument.
		*/
		PROTO.replace = function(target, remove) {

			var t = this;
			var prev = t.element;
			var prevdom = t.dom;

			if (remove) {
				delete t.dom.$uicomponent;
				delete t.dom.$uiplugin;
				prev.off().remove();
			}

			t.element = $(target);
			t.dom = t.element[0];
			t.dom.$uicomponent = t;
			t.dom.$proxycomponent = t.proxy;

			if (t.plugin) {
				t.element.attr('plugin', t.plugin.name);
				t.dom.$proxyplugin = t.plugin.proxy;
				t.dom.$uiplugin = t.plugin;
				if (t.plugin.dom === prevdom) {
					t.plugin.dom = t.dom;
					t.plugin.element = t.element;
				}
			}

			return t;
		};

		PROTO.datasource = function(path, callback, init) {

			var t = this;
			var source = t.$datasource;

			source && t.unwatch(source.path, source.fn);

			if (path) {
				path = t.makepath(path);
				t.$datasource = source = { path: path, fn: callback };
				if (init !== false && !t.$loaded) {
					t.watch(path, callback);
					source.refresh = () => callback(T.get(t.scope, path), {}, path);
				} else
					t.watch(path, callback, init !== false);

			} else
				t.$datasource = null;

			return t;
		};

		// Backward compatibility
		PROTO.isInvalid = function() {
			var cfg = this.config;
			return cfg.touched && cfg.invalid;
		};

		// Internal method
		PROTO.$state = function() {

			var t = this;
			var config = t.config;
			var cls = t.element[0].classList;

			cls.toggle('ui-touched', !!config.touched);
			cls.toggle('ui-modified', !!config.modified);
			cls.toggle('ui-disabled', !!config.disabled);
			cls.toggle('ui-invalid', !!config.invalid);

			if (t.state && t.$loaded) {

				// Arguments due to backward compatibility
				var type = 2;
				var what = 4;

				if (t.internal.autobound) {
					t.internal.autobound = false;
					type = 1;
				}

				if (!t.internal.state) {
					t.internal.state = true;
					type = 0;
					what = 5;
				} else if (!config.touched && !config.modified)
					what = 3;

				// Do not use @type and @what arguments
				// Use "config" values
				t.state(type, what);
			}

		};

		PROTO.validate2 = function(value) {
			var t = this;
			t.$validate(value);
			t.path.find(t.scope, function(arr) {
				for (let m of arr) {
					if (m !== t && m.state2)
						m.state2(t);
				}
			});
		};

		// Internal method
		PROTO.$validate = function(value) {

			var t = this;

			if (t.internal.readonly || !t.validate) {
				t.reconfigure({ invalid: false });
			} else {
				let r = t.validate(value === undefined ? t.get() : value);
				let tmp = { invalid: r === '' || r == true ? false : typeof(r) === 'string' ? r : true };
				t.reconfigure(tmp);
			}

			t.$state();
		};

		// Internal method
		PROTO.$setter = function(value, flags, path) {

			var t = this;

			if ((flags.init || flags.default) && (value == null) && t.def) {
				value = t.def();
				t.rewrite(value);
			}

			if (!flags)
				flags = {};

			if (t.skip) {
				flags.skip = true;
				t.skip = false;
			} else {
				// Backward compatibility
				t.setter && t.setter(value, path, flags);
			}

			t.setter2 && t.setter2(value, path, flags);
			t.config.$setter && t.EXEC(t.config.$setter, value, path, flags);
			t.$validate();
		};

		// Internal method
		PROTO.remove = PROTO.$remove = function() {
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

	})();

	// Binder declaration
	(function() {

		function compile(value) {
			return new Function('element', 'value', 'flags', 'path', 'var el = element;return ' + value);
		}

		T.Binder = function(proxy) {
		};

		function reconfigure(el, config) {
			var arr = el.find('ui-component');
			for (let m of arr)
				m.$uicomponent.reconfigure(config);
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
						t[cmd.name] = new Function('scope', 'return jComponent.get(scope, "{0}")'.format(t.replace(value)));
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
							let scr = el.find('script,template');
							if (scr.length) {
								cmd.template = scr.html();
								scr.remove();
							} else
								cmd.template = el.html();
							if (value)
								cmd.vdom = value.split('->').trim();
						}

						el.empty();

						cmd.template = Tangular.compile(cmd.template.replace(/SCR/g, 'script'));
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

			commands.quicksort('priority');
			t.commands = commands;

			if (t.proxy.callback) {
				t.proxy.callback();
				t.proxy.callback = null;
			}

			t.fn(t.path.get(t.scope), { init: 1 }, t.path);
		};

		PROTO.replaceplugin = function(val) {
			var t = this;
			return t.plugin ? val.replace(/\?/, t.plugin.path.path) : val;
		};

		PROTO.exec = function(value, path, flags) {
			path = parsepath(path);
			this.fn(value, flags || {}, path);
		};

		PROTO.fn = function(value, flags, path, nodelay) {

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
					if (path.includes(m, true)) {
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
				t.timeout = setTimeout((value, flags, path) => this.fn(value, flags, path, true), t.delay, value, flags, path);
				return;
			}

			if (t.changes) {
				let hash = HASH(value);
				if (hash === t.hash)
					return;
				t.hash = hash;
			}

			for (let m of t.commands) {

				let el = t.target;

				if (m.selector)
					el = el.find(m.selector);

				var val = m.fn ? m.fn(el, value, flags, path) : value;

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
			return this.replace(/(\[.*?\])/gi, function(val) {
				var key = val.substring(1, val.length - 1);
				return (key.charAt(0) === '.' ? T.get(W, key.substring(1)) : DEF.env[key]) || val;
			});
		};

		/*
			@Path: String.prototype
			@Method: String.prototype.parseConfig([def], [noconvert]); #def {String|Object} a default configuration; #noconvert {Boolean} disables number/boolean/datetime conversation; #returns {Object};
			The method parses Total.js UI library configuration in the form `key1:value;key2:value`.
		*/
		PROTO.parseConfig = function(def, noconvert) {

			let arr = this.replace(/\\;/g, '\0').split(';');
			let regnum = /^(-)?[0-9.]+$/;
			let output = {};

			if (def) {
				switch (typeof(def)) {
					case 'string':
						output = def.parseConfig(null, noconvert);
						break;
					case 'object':
						output = CLONE(def);
						break;
				}
			}

			for (let m of arr) {

				let item = m.replace(/\0/g, ';').replace(/\\:/g, ':');
				let index = item.indexOf(':');
				let k = index === -1 ? item : item.substring(0, index).trim().env();
				let v = index === -1 ? '' : item.substring(index + 1).trim().env();

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

		PROTO.ROOT = function(noBase) {
			var url = this;
			var r = DEF.root;
			var b = DEF.baseurl;
			var ext = /(https|http|wss|ws|file):\/\/|\/\/[a-z0-9]|[a-z]:/i;
			var replace = t => t.charAt(0) + '/';
			var type = 'function';
			if (r)
				url = typeof(r) === type ? r(url) : ext.test(url) ? url : (r + url);
			else if (!noBase && b)
				url = typeof(b) === type ? b(url) : ext.test(url) ? url : (b + url);
			return url.replace(/[^:]\/{2,}/, replace);
		};

		PROTO.flags = function(path) {
			return this.replace(/(^|\s)@[\w]+/g, function(text) {
				var flag = '@flag ' + text.trim().substring(1);
				T.events[flag] && T.emit(flag, path);
				return '';
			}).trim();
		};

		PROTO.padLeft = function(t, e) {
			var r = this + '';
			return Array(Math.max(0, t - r.length + 1)).join(e || ' ') + r;
		};

		PROTO.padRight = function(t, e) {
			var r = this + '';
			return r + Array(Math.max(0, t - r.length + 1)).join(e || ' ');
		};

		PROTO.parseSource = function(type) {

			var arr = this.split(',');
			var output = [];
			for (var i = 0; i < arr.length; i++) {
				var item = arr[i].split('|');
				var id = item[0];
				if (type && (type === Number || type === TYPE_N))
					id = id ? id.parseInt() : null;

				if (!item[1])
					item[1] = id + '';

				output.push({ id: id, name: item[1], icon: item[2] || '' });
			}

			return output;
		};

		PROTO.parseComponent = function(tags) {

			var html = this;
			var beg = -1;
			var end = -1;
			var output = {};

			for (var key in tags) {

				var tagbeg = tags[key];
				var tagindex = tagbeg.indexOf(' ');

				if (tagindex === -1)
					tagindex = tagbeg.length - 1;

				var tagend = '</' + tagbeg.substring(1, tagindex) + '>';
				var tagbeg2 = '<' + tagend.substring(2);

				beg = html.indexOf(tagbeg);

				if (beg !== -1) {

					var count = 0;
					end = -1;

					for (var j = (beg + tagbeg.length); j < html.length; j++) {
						var a = html.substring(j, j + tagbeg2.length);
						if (a === tagbeg2) {
							count++;
						} else {
							if (html.substring(j, j + tagend.length) === tagend) {
								if (count) {
									count--;
								} else {
									end = j;
									break;
								}
							}
						}
					}

					if (end !== -1) {
						var tmp = html.substring(html.indexOf('>', beg) + 1, end);
						html = html.replace(html.substring(beg, end + tagend.length), '').trim();
						output[key] = tmp.replace(/^\n|\n$/, '');
					}

				}
			}

			return output;
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

		PROTO.encode = function() {
			return Thelpers.encode(this);
		};

		// Backward compatibility
		PROTO.COMPILABLE = function() {
			return this;
		};

		/*
			@Path: String.prototype
			@Method: String.prototype.args(obj, [encode]); #obj {Object} payload, #encode {String/Function(key, value)} supported values `json`, `escape` and `encode`; #return {String};
			The method checks if the string is a serialized JSON date.
		*/
		PROTO.args = function(obj, encode) {

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

		const DIACRITICS = { 225:'a',228:'a',269:'c',271:'d',233:'e',283:'e',357:'t',382:'z',250:'u',367:'u',252:'u',369:'u',237:'i',239:'i',244:'o',243:'o',246:'o',353:'s',318:'l',314:'l',253:'y',255:'y',263:'c',345:'r',341:'r',328:'n',337:'o' };

		PROTO.toASCII = function() {
			var buf = '';
			for (var i = 0; i < this.length; i++) {
				var c = this[i];
				var code = c.charCodeAt(0);
				var isUpper = false;

				var r = DIACRITICS[code];
				if (r === undefined) {
					code = c.toLowerCase().charCodeAt(0);
					r = DIACRITICS[code];
					isUpper = true;
				}

				if (r === undefined) {
					buf += c;
					continue;
				}

				c = r;
				buf += isUpper ? c.toUpperCase() : c;
			}
			return buf;
		};

		PROTO.toSearch = function() {

			var str = this.replace(/[^a-zA-Zá-žÁ-Žа-яА-Я\d\s:]/g, '').trim().toLowerCase().toASCII();
			var buf = [];
			var prev = '';

			for (var i = 0; i < str.length; i++) {
				var c = str.substring(i, i + 1);
				if (c === 'y')
					c = 'i';
				if (c !== prev) {
					prev = c;
					buf.push(c);
				}
			}

			return buf.join('');
		};

		PROTO.slug = function(max) {
			max = max || 60;

			var self = this.trim().toLowerCase().toASCII();
			var builder = '';
			var length = self.length;

			for (var i = 0; i < length; i++) {
				var c = self.substring(i, i + 1);
				var code = self.charCodeAt(i);

				if (builder.length >= max)
					break;

				if (code > 31 && code < 48) {
					if (builder.substring(builder.length - 1, builder.length) !== '-')
						builder += '-';
				} else if (code > 47 && code < 58)
					builder += c;
				else if (code > 94 && code < 123)
					builder += c;
			}

			var l = builder.length - 1;
			return builder[l] === '-' ? builder.substring(0, l) : builder;
		};

		PROTO.isEmail = function() {
			var str = this;
			return str.length <= 4 ? false : DEF.regexp.email.test(str);
		};

		PROTO.isPhone = function() {
			var str = this;
			return str.length < 6 ? false : DEF.regexp.phone.test(str);
		};

		PROTO.isURL = function() {
			var str = this;
			return str.length <= 7 ? false : DEF.regexp.url.test(str);
		};

		PROTO.parseExpire = function() {

			var t = this;

			if (t === '' || t === '-' || t === DEF.empty || t === 'none' || t === '0')
				return 0;

			var str = this.split(' ');
			var number = parseInt(str[0]);

			if (isNaN(number))
				return 0;

			var min = 60000 * 60;

			switch (str[1].trim().replace(/\./g, '')) {
				case 'minutes':
				case 'minute':
				case 'min':
				case 'mm':
				case 'm':
					return 60000 * number;
				case 'hours':
				case 'hour':
				case 'HH':
				case 'hh':
				case 'h':
				case 'H':
					return min * number;
				case 'seconds':
				case 'second':
				case 'sec':
				case 'ss':
				case 's':
					return 1000 * number;
				case 'days':
				case 'day':
				case 'DD':
				case 'dd':
				case 'd':
					return (min * 24) * number;
				case 'months':
				case 'month':
				case 'MM':
				case 'M':
					return (min * 24 * 28) * number;
				case 'weeks':
				case 'week':
				case 'W':
				case 'w':
					return (min * 24 * 7) * number;
				case 'years':
				case 'year':
				case 'yyyy':
				case 'yy':
				case 'y':
					return (min * 24 * 365) * number;
				default:
					return 0;
			}
		};

		function parseDateFormat(format, val) {

			var tmp = [];
			var tmpformat = [];
			var prev = '';
			var prevformat = '';
			var allowed = { y: 1, Y: 1, M: 1, m: 1, d: 1, D: 1, H: 1, s: 1, a: 1, w: 1 };

			for (var i = 0; i < format.length; i++) {

				var c = format.charAt(i);

				if (!allowed[c])
					continue;

				if (prev !== c) {
					prevformat && tmpformat.push(prevformat);
					prevformat = c;
					prev = c;
				} else
					prevformat += c;
			}

			prev = '';

			for (var i = 0; i < val.length; i++) {
				var code = val.charCodeAt(i);
				if (code >= 48 && code <= 57)
					prev += val.charAt(i);
			}

			prevformat && tmpformat.push(prevformat);

			var f = 0;
			for (var i = 0; i < tmpformat.length; i++) {
				var l = tmpformat[i].length;
				tmp.push(prev.substring(f, f + l));
				f += l;
			}

			var dt = {};

			for (var i = 0; i < tmpformat.length; i++) {
				var type = tmpformat[i];
				if (tmp[i])
					dt[type.charAt(0)] = +tmp[i];
			}

			var h = dt.h || dt.H;

			if (h != null) {
				var ampm = val.match(/am|pm/i);
				if (ampm && ampm[0].toLowerCase() === 'pm')
					h += 12;
			}

			var y = (dt.y || dt.Y) || 0;

			if (y < 100)
				y += 2000;

			return new Date(y, (dt.M || 1) - 1, dt.d || dt.D || 0, h || 0, dt.m || 0, dt.s || 0);
		}

		PROTO.parseDate = function(format) {

			if (format)
				return parseDateFormat(format, this);

			var self = this.trim().env();
			if (!self)
				return null;

			var lc = self.charCodeAt(self.length - 1);

			// Classic date
			if (lc === 41)
				return new Date(self);

			// JSON format
			if (lc === 90)
				return new Date(Date.parse(self));

			var ampm = null;
			var tmp;

			self = self.replace(/(\s)(am|pm)/i, function(text) {
				ampm = text.trim().toLowerCase();
				return '';
			});

			var arr = self.indexOf(' ') === -1 ? self.split('T') : self.split(' ');
			var index = arr[0].indexOf(':');
			var length = arr[0].length;

			if (index !== -1) {
				tmp = arr[1];
				arr[1] = arr[0];
				arr[0] = tmp;
			}

			if (arr[0] === undefined)
				arr[0] = '';

			var noTime = arr[1] === undefined ? true : arr[1].length === 0;

			for (var i = 0; i < length; i++) {
				var c = arr[0].charCodeAt(i);
				if ((c > 47 && c < 58) || c === 45 || c === 46)
					continue;
				if (noTime)
					return new Date(self);
			}

			if (arr[1] === undefined)
				arr[1] = '00:00:00';

			var firstDay = arr[0].indexOf('-') === -1;

			var date = (arr[0] || '').split(firstDay ? '.' : '-');
			var time = (arr[1] || '').split(':');
			var parsed = [];

			if (date.length < 4 && time.length < 2)
				return new Date(self);

			index = (time[2] || '').indexOf('.');

			// milliseconds
			if (index !== -1) {
				time[3] = time[2].substring(index + 1);
				time[2] = time[2].substring(0, index);
			} else
				time[3] = '0';

			if (ampm) {
				// 12 hours time
				tmp = +time[0];
				if (ampm === 'pm')
					time[0] = tmp + 12;
			}

			parsed.push(+date[firstDay ? 2 : 0]); // year
			parsed.push(+date[1]); // month
			parsed.push(+date[firstDay ? 0 : 2]); // day
			parsed.push(+time[0]); // hours
			parsed.push(+time[1]); // minutes
			parsed.push(+time[2]); // seconds
			parsed.push(+time[3]); // miliseconds

			var def = W.NOW = new Date();

			for (var i = 0; i < parsed.length; i++) {
				if (isNaN(parsed[i]))
					parsed[i] = 0;

				var value = parsed[i];
				if (value !== 0)
					continue;

				switch (i) {
					case 0:
						if (value <= 0)
							parsed[i] = def.getFullYear();
						break;
					case 1:
						if (value <= 0)
							parsed[i] = def.getMonth() + 1;
						break;
					case 2:
						if (value <= 0)
							parsed[i] = def.getDate();
						break;
				}
			}

			return new Date(parsed[0], parsed[1] - 1, parsed[2], parsed[3], parsed[4], parsed[5]);
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

		PROTO.add = PROTO.inc = function(value, decimals) {

			var self = this;

			if (value == null)
				return self;

			if (typeof(value) === 'function')
				return self + value;

			var first = value.charCodeAt(0);
			var is = false;

			if (first < 48 || first > 57) {
				is = true;
				value = value.substring(1);
			}

			var length = value.length;
			var num;

			if (value[length - 1] === '%') {
				value = value.substring(0, length - 1);
				if (is) {
					var val = value.parseFloat();
					switch (first) {
						case 42:
							num = self * ((self / 100) * val);
							break;
						case 43:
							num = self + ((self / 100) * val);
							break;
						case 45:
							num = self - ((self / 100) * val);
							break;
						case 47:
							num = self / ((self / 100) * val);
							break;
					}
					return decimals !== undefined ? num.floor(decimals) : num;
				} else {
					num = (self / 100) * value.parseFloat();
					return decimals !== undefined ? num.floor(decimals) : num;
				}

			} else
				num = value.parseFloat();

			switch (first) {
				case 42:
					num = self * num;
					break;
				case 43:
					num = self + num;
					break;
				case 45:
					num = self - num;
					break;
				case 47:
					num = self / num;
					break;
				default:
					num = self;
					break;
			}

			return decimals !== undefined ? num.floor(decimals) : num;
		};

		PROTO.pluralize = function(zero, one, few, other) {

			if (!one && typeof(zero) === 'string') {
				// Environment
				if (zero.charAt(0) === '[')
					zero = zero.env();
				zero = zero.split(',');
			}

			if (zero instanceof Array) {
				one = zero[1];
				few = zero[2];
				other = zero[3];
				zero = zero[0];
			}

			var num = this;
			var value = '';

			if (num == 0)
				value = zero || '';
			else if (num == 1)
				value = one || '';
			else if (num > 1 && num < 5)
				value = few || '';
			else
				value = other;

			return value.includes('#') ? value.replace(DEF.regexp.pluralize, text => text === '##' ? num.format() : (num + '')) : value;
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

		PROTO.attr = function(name, value) {

			var self = this;

			if (arguments.length === 2) {
				if (value == null)
					return self;
			} else if (value === undefined)
				value = name + '';

			self.push(name + '="' + ((value + '').env() + '').replace(/[<>&"]/g, function(c) {
				switch (c) {
					case '&':
						return '&amp;';
					case '<':
						return '&lt;';
					case '>':
						return '&gt;';
					case '"':
						return '&quot;';
				}
				return c;
			}) + '"');

			return self;
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

		PROTO.last = function(def) {
			var item = this[this.length - 1];
			return item === undefined ? def : item;
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
			@Method: inDOM(element); #element {Element}; #return {Boolean};
			The method returns if the element is attached in the DOM.
		*/
		W.inDOM = inDOM;

		/*
			@Path: Globals
			@Property: NOW; #return {Date};
			The property always returns the current `Date` object refreshed in a one minute interval.
		*/
		W.NOW = new Date();

		/*
			@Path: Globals
			@Method: ON(name, callback); #name {String}; #callback {Function(a, b, c, d)};
			The method registers a new handler for capturing a specific event.
		*/
		W.ON = T.on;

		/*
			@Path: Globals
			@Method: OFF(name, [callback]); #name {String}; #[callback] {Function};
			The method removes the existing handler for capturing a specific event.
		*/
		W.OFF = T.off;

		/*
			@Path: Globals
			@Method: EMIT(name, [a], [b], [c], [d]); #name {String}; #[a] {Object}; #[b] {Object}; #[c] {Object}; #[d] {Object};
			The method emits a specific event to all plugins and components.
		*/
		W.EMIT = T.emit;
		W.FLAGS = T.flags;

		W.WATCH = T.watch;
		W.UNWATCH = T.unwatch;

		/*
			@Path: Globals
			@Method: ATTRD(el, attrd); #el {jQuery/Element}; #attrd {String} attribute name (default: `id`); #return {String};
			The method tries to read closest `data-{attrd}` value.
		*/
		W.ATTRD = function(el, attrd) {
			if (el) {
				if (el instanceof jQuery)
					return el.attrd2(attrd || 'id');
				else if (el instanceof jQuery.Event)
					return $(el.currentTarget).attrd2(attrd || 'id');
				else if (typeof(el.getAttribute) === 'function')
					return W.ATTRD($(el), attrd);
				else if (typeof(el) === 'object')
					return el[attrd || 'id'];
			}
			return el;
		};

		W.FIND = function(selector, all) {

			var name = '';
			var path = '';
			var id = '';
			var c = selector.charAt(0);

			if (c === '.')
				path = selector.substring(1);
			else if (c === '#')
				id = selector.substring(1);
			else
				name = selector;

			var arr = all ? [] : null;

			for (let m of T.components) {
				if (m.ready) {

					if (path && (!m.path || !m.path.includes(path, true)))
						continue;

					if (id && m.id !== id)
						continue;

					if (name && m.name !== name)
						continue;

					if (all)
						arr.push(m);
					else
						return m;
				}
			}

			if (all)
				return arr;
		};

		/*
			@Path: Globals
			@Method: SET(path, value); #path {String}; #value {Object};
			The method sets and notifies all UI components and watchers based on the path.
		*/
		W.SET = function(path, value) {
			path = parsepath(path);
			path.exec(function() {
				path.set(T.root, value);
				path.notify(T.root);
			});
		};

		/*
			@Path: Globals
			@Method: GET(path); #path {String}; #return {Object};
			Based on the path, the method returns a value.
		*/
		W.GET = function(path, noflags) {
			var flags = path.includes(' ');
			path = parsepath(path);
			if (!noflags && flags)
				path.notify(T.root);
			return path.get(T.root);
		};

		W.NUL = W.NULL = function(path) {
			SET(path, null);
		};

		W.INC = function(path, value) {
			var val = W.GET(path, true);
			if (val == null)
				val = 0;
			else if (typeof(val) === 'string')
				val = val.parseFloat();
			W.SET(path, val + (value || 1));
		};

		W.TOGGLE = function(path) {
			var val = W.GET(path, true);
			if (val == null)
				val = false;
			W.SET(path, !val);
		};

		/*
			@Path: Globals
			@Method: UPD(path); #path {String};
			The method notifies all UI components and watchers based on the path.
		*/
		W.UPD = W.UPDATE = function(path) {
			T.notify(T.root, path);
		};

		W.RESET = function(path) {
			T.notify(T.root, path + ' @reset');
		};

		W.PUSH = function(path, value) {
			var shift = path.charAt(0) === '^';
			if (shift)
				path = path.substring(1);
			path = parsepath(path);
			path.exec(function() {
				var model = path.get(T.root);
				var allocate = false;

				if (model == null) {
					model = [];
					allocate = true;
				}

				if (!(model instanceof Array))
					model = [model];
				if (shift)
					model.unshift(value);
				else
					model.push(value);

				if (allocate)
					path.set(T.root, model);
				else
					path.notify(T.root);
			});
		};

		W.CLRELOAD = function(name, callback) {
			var arr = name.split(',').trim();
			arr.wait(function(name, next) {
				var cl = DEF.cl[name];
				if (cl) {
					cl.reload = true;
					W.CL(name, () => next());
				} else
					next();
			}, callback);
		};

		W.CLINIT = function(name, callback, expire, init) {

			if (typeof(expire) === 'boolean') {
				init = expire;
				expire = '';
			}

			if (typeof(callback) === 'string') {
				var url = callback;
				callback = function(next) {
					var tmp = url.split(' ');
					tmp[0] = tmp[0].toLowerCase();
					if (tmp[0].charAt(0) === '!')
						tmp[0] === tmp[0].substring(1);
					switch (tmp[0]) {
						case 'get':
						case 'post':
						case 'put':
						case 'delete':
						case 'patch':
							AJAX(url, next);
							break;
						default:
							TAPI(url, next);
							break;
					}
				};
			}

			T.cache.cl[name] = { callback: callback, expire: expire };
			init && W.CL(name, NOOP);
		};

		W.CL = function(name, callback) {

			if (!name) {
				callback && callback();
				return;
			}

			name.split(',').trim().wait(function checkcl(key, next) {
				var item = T.cache.cl[key];
				if (item) {
					if (!item.reload && DEF.cl[key]) {
						next();
					} else {
						item.callback(function(val, extend) {
							if (extend === true) {
								let tmp = GET(DEF.path.clean('cl'));
								for (let key in val) {
									tmp[key] = val;
									T.notify(T.root, DEF.path.cl + key);
								}
							} else
								SET(DEF.path.cl + key, val);
							item.date = NOW = new Date();
							item.reload = false;
							next();
						});
					}
				} else {
					if (DEF.cl[key])
						next();
					else
						setTimeout(checkcl, 500, key, next);
				}
			}, callback);
		};

		/*
			@Path: Globals
			@Method: COMPONENTS(path); #path {String};
			The method returns all components on the specific path. It supports flags @touched, @visible, @modified, @invalid, @disabled, @enabled, @required
		*/
		W.COMPONENTS = function(path) {
			path = path instanceof T.Path ? path : parsepath(path);
			var arr = [];
			for (let m of T.components) {
				if (m.ready && m.scope === T.root) {
					if (m.path && path.includes(m.path)) {
						if ((path.flags.visible && HIDDEN(m.element)) || (path.flags.hidden && !HIDDEN(m.element)) || (path.flags.touched && !m.config.touched) || (path.flags.modified && !m.config.modified) || (path.flags.required && !m.config.required) || (path.flags.invalid && !m.config.invalid) || (path.flags.valid && m.config.invalid) || (path.flags.disabled && !m.config.disabled) || (path.flags.enabled && m.config.disabled))
							continue;
						arr.push(m);
					}
				}
			}
			return arr;
		};

		/*
			@Path: Globals
			@Method: COMPONENT(name, [config], callback, [dependencies]); #path {String}; #[config] {Object}; #callback {Function(self, config, cls, element)}; #[dependencies] {String};
			The method registers a new component declaration.
		*/
		W.COMPONENT = function(name, config, callback, dependencies, css) {

			if (typeof(config) === 'function') {
				css = dependencies;
				dependencies = callback;
				callback = config;
				config = '';
			}

			if (T.db.components[name])
				WARN(ERR.format('Overwriting component "{0}"'.format(name)));

			T.db.components[name] = { count: 0, config: (config || '').parseConfig(), callback: callback, dependencies: dependencies, css: css };
			rebuildcss();
		};

		W.NEWUIBIND = function(element, path, config) {

			if (!path)
				path = element.getAttribute('path');

			if (!config)
				config = element.getAttribute('config');

			return T.newbinder(element, path, config);
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
				name = DEF.path.clean('common');

			T.db.plugins[name] = { count: 0, config: (config || '').parseConfig(), callback: callback, dependencies: dependencies };

			// It's targeted for "<ui-plugin" elements without defined "path"
			T.cache.plugins.push(name);
		};

		/*
			@Path: Globals
			@Method: ERRORS(path, callback); #path {String|jQuery Element}; #callback {Function(arr)};
			The method returns errors based on the path in the callback argument.
		*/
		W.ERRORS = function(path, callback) {
			if (path instanceof jQuery) {
				let arr = path.find('ui-component');
				let err = [];
				for (let m of arr) {
					let com = m.$uicomponent;
					if (com && com.ready && com.config.invalid)
						err.push(com);
				}
				callback(err);
			} else {
				path = path instanceof T.Path ? path : parsepath(path + ' @invalid');
				path.find(T.root, callback);
			}
		};

		W.BLOCKED = function(key, timeout, callback) {

			var item = T.cache.blocked[key];
			var now = Date.now();

			if (item > now)
				return true;

			if (typeof(timeout) === 'string')
				timeout = timeout.env().parseExpire();

			var local = timeout < 10000;
			T.cache.blocked[key] = now + timeout;

			if (!local && W.localStorage)
				W.localStorage.setItem(DEF.localstorage + '.blocked', STRINGIFY(T.cache.blocked));

			callback && callback();
			return false;
		};

		W.WAIT = function(fn, callback) {

			var key = ((Math.random() * 10000) >> 0).toString(36);
			var is = typeof(fn) === 'string';
			var run = false;

			if (is) {
				var result = T.get(T.root, fn);
				if (result)
					run = true;
			} else if (fn())
				run = true;

			if (run) {
				callback();
				return;
			}

			T.cache.wait[key] = setInterval(function() {

				if (is) {
					var result = T.get(T.root, fn);
					if (result == null)
						return;
				} else if (!fn())
					return;

				clearInterval(T.cache.wait[key]);
				delete T.cache.wait[key];
				callback();

			}, 500);
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
			return el.parentNode && el.parentNode.tagName === 'BODY' ? false : W.isIE ? (!el.offsetWidth && !el.offsetHeight) : !el.offsetParent;
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
						T.emit('env', key, name[key]);
					}
				}
				return name;
			}

			if (value !== undefined) {
				T.events.env && T.emit('env', name, value);
				DEF.env[name] = value;
				// T.notify(T.root, 'DEF.env.' + name);
				return value;
			}

			return DEF.env[name];
		};

		W.ENVIRONMENT = function(name, version, language, env) {
			DEF.localstorage = name;
			DEF.version = version || '';
			DEF.languagehtml = language || '';
			env && W.ENV(env);
		};

		// Backward compatibility
		W.FREE = T.free;

		/*
			@Path: Globals
			@Method: HASH(value); #value {String/Number/Boolean/Object/Date};
			The method creates a hash from the `value`.
		*/
		W.HASH = function(value) {
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

		W.CSS = function(value, id, selector) {
			id && $('#css' + id).remove();
			var val = (value instanceof Array ? value.join('') : value);
			val && $('<style type="text/css"' + (id ? ' id="css' + id + '"' : '') + '>' + (selector ? wrap(selector, val) : val) + '</style>').appendTo('head');
		};

		W.APPEARANCE = function(obj) {

			var keys = Object.keys(obj);
			var dark = obj.dark || obj.darkmode;
			var large = obj.large || obj.largemode;
			var builder = [];
			var id = 'appearance';

			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				switch (key) {
					case 'dark':
					case 'darkmode':
					case 'large':
					case 'largemode':
						break;
					default:
						obj[key] && builder.push('--' + key.trim() + ':' + (obj[key] + '').trim());
						break;
				}
			}

			obj.color && SET('DEF.color', obj.color);

			if (obj.color && !obj.rgb) {
				var color = obj.color.substring(1);
				if (color.length === 3)
					color += color;
				obj.rgb = parseInt(color.substring(0, 2), 16) + ',' + parseInt(color.substring(2, 4), 16) + ',' + parseInt(color.substring(4, 6), 16);
				builder.push('--rgb:' + obj.rgb);
			}

			$('body').tclass(DEF.prefixcsslibrary + 'dark', !!dark).tclass(DEF.prefixcsslibrary + 'large', !!large);

			if (builder.length)
				CSS(':root{' + builder.join(';') + '}', id);
			else
				$('#css' + id).remove();
		};

		function wrap(selector, css) {

			var beg = css.indexOf('{');
			var builder = [];

			while (beg !== -1) {

				var sel = css.substring(0, beg);
				var end = css.indexOf('}', beg + 1);

				if (end === -1)
					break;

				end++;

				var tmp = [];

				if (sel.indexOf('@') === -1) {
					var arr = sel.split(',');
					for (var i = 0; i < arr.length; i++) {
						var a = arr[i].trim();
						tmp.push(selector + ' ' + a);
					}
				} else
					tmp.push(sel);

				builder.push(tmp.join(',') + css.substring(beg, end));
				css = css.substring(end);
				beg = css.indexOf('{');
			}

			return builder.join('');
		}

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

		W.COPY = function(a, b) {
			var keys = Object.keys(a);
			for (let key of keys) {
				var val = a[key];
				var type = typeof(val);
				b[key] = type === 'object' ? val ? W.CLONE(val) : val : val;
			}
			return b;
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

		W.NODEINDEXOF = function(el) {
			if (el instanceof jQuery)
				el = el[0];
			var children = el.parentNode.children;
			for (var i = 0; i < children.length; i++) {
				if (children[i] === el)
					return i;
			}
			return -1;
		};

		W.NODEINSERT = function(a, b, before) {
			if (a instanceof jQuery)
				a = a[0];
			if (b instanceof jQuery)
				b = b[0];
			if (before)
				b.parentNode.insertBefore(a, b);
			else if (b.nextSibling)
				b.parentNode.insertBefore(a, b.nextSibling);
			else
				b.parentNode.appendChild(a);
		};

		W.NODEMOVE = function(el, up) {
			if (el instanceof jQuery) {
				for (var i = 0; i < el.length; i++)
					W.NODEMOVE(el[i], up);
			} else {
				var index = W.NODEINDEXOF(el);
				if (index > -1) {
					var parent = el.parentNode;
					var children = parent.children;
					if (up) {
						if (index > 0)
							parent.insertBefore(el, children[index - 1]);
					} else {
						var dom = children[index + 2];
						if (dom)
							parent.insertBefore(el, dom);
						else
							parent.appendChild(el);
					}
				}
			}
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

		function onresponse(opt) {

			var req = opt.req;

			opt.status = req.status;
			opt.text = req.statusText;
			opt.response = req.responseText;
			opt.iserror = opt.status >= 399 || opt.status === 0;
			opt.onprogress && T.process(opt.scope, 100, opt.onprogress);
			opt.duration = Date.now() - opt.duration;
			opt.headers = {};

			// Parse headers
			if (req.getAllResponseHeaders) {
				let resheaders = req.getAllResponseHeaders().split('\n');
				for (let line of resheaders) {
					let index = line.indexOf(':');
					if (index !== -1)
						opt.headers[line.substring(0, index).toLowerCase()] = line.substring(index + 1).trim();
				}
			}

			let type = opt.headers['content-type'];

			if (type && type.indexOf('/json') !== -1)
				opt.response = PARSE(opt.response);

			T.emit('response', opt);

			// Processed by another way
			if (opt.cancel)
				return;

			if (opt.path && opt.path.ERROR) {

				if (opt.iserror && !opt.response) {
					T.emit('ERROR', opt.status + '');
					return;
				}

				if (W.ERROR(opt.response))
					return;
			}

			if (opt.path && opt.path.cache && !opt.iserror)
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

			var index = name.indexOf(' ');
			var flags = '';

			if (index !== -1) {
				flags = name.substring(index);
				name = name.substring(0, index);
			}

			data = { schema: name, data: data ? data : undefined };
			return W.AJAX('POST ' + DEF.api + flags, data, callback, scope);
		};

		function req_respond(value) {
			var opt = this;
			opt.cancel = true;
			opt.req = { status: 200, response: value };
			onresponse(opt);
		}

		/*
			@Path: Globals
			@Method: AJAX(url, [data], callback); #url {String}; #[data] {Object}; #callback {Function(response)};
			The method parsers JSON and converts all dates to `Date` object.
		*/
		W.AJAX = W.UPLOAD = function(url, data, callback, scope) {

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
			opt.scope = scope || T.root;
			opt.flags = {};

			url = url.substring(index + 1);
			index = url.indexOf(' ');

			if (index !== -1) {
				opt.url = url.substring(0, index);
				url = url.substring(index);
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

			if (opt.method !== 'GET' && !(data instanceof FormData))
				opt.headers['Content-Type'] = typeof(data) === 'string' ? 'application/x-www-form-urlencoded' : 'application/json';

			for (let key in DEF.headers)
				opt.headers[key] = DEF.headers[key];

			opt.respond = req_respond;
			opt.data = data;

			T.emit('request', opt);

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
			The method imports external sources like JavaScript libaries, CSS libraries, UI components or parts. Supported flags: @prepend, @singleton, <global_variable_name>, url .extension, .
		*/
		W.IMPORT = function(url, target, callback, prepare) {

			if (typeof(target) === 'function') {
				callback = target;
				target = 'body';
			}

			var key = url;

			if (T.cache.imports[key]) {
				T.cache.imports[key].push({ target: target, callback: callback, prepare: prepare });
				return;
			}

			if (!target)
				target = 'body';

			let d = document;
			let ext = '';
			let check = '';

			url = url.replace(/<.*?>/, function(text) {
				if (text.includes(' '))
					return text;
				check = text.substring(1, text.length - 1);
				return '';
			});

			if (check && W[check])
				return;

			T.cache.imports[key] = [{ target: target, callback: callback, prepare: prepare }];

			var done = function() {
				for (let m of T.cache.imports[key])
					m.callback && m.callback();
				delete T.cache.imports[key];
			};

			url = url.replace(/\s\.[a-z0-9]+/, function(text) {
				ext = text.trim();
				return '';
			});

			if (!ext) {
				ext = url.match(/\.[a-z0-9]+$/i);
				if (ext)
					ext = ext.toString();
			}

			var path = parsepath(url);
			var cachekey = path.flags.singleton ? ('singleton' + key) : '';

			if (cachekey) {
				let tmp = T.cache.imports[cachekey];
				if (tmp != null) {
					if (prepare)
						tmp = prepare(tmp);
					$(target)[path.flags.prepend ? 'prepend' : 'append'](tmp);
					done();
					return;
				}
			}

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
					T.emit('import', url, $(scr));
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
					T.emit('import', url, $(link));
				};
				d.getElementsByTagName('head')[0].appendChild(link);
				return;
			}

			path.exec(function() {
				AJAX('GET ' + url, function(response) {

					if (typeof(response) !== 'string') {
						WARN(ERR.format('Invalid response for IMPORT("{0}")'.format(url)), response);
						done();
						return;
					}

					let id = 'import' + HASH(url);
					response = ADAPT(null, null, response);

					if (cachekey)
						T.cache.imports[cachekey] = response;

					for (let m of T.cache.imports[key]) {
						if (m.target) {
							let html = response;
							if (m.prepare)
								html = m.prepare(html);
							html = importscripts(importstyles(html, id)).trim();
							html && $(m.target)[path.flags.prepend ? 'prepend' : 'append'](html);
						}
					}

					setTimeout(function() {
						done();
						T.emit('import', url, target);
					}, 10);
				});
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
			} catch {
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
						T.emit('ERROR', response);
						error && W.SEEX(error, response);
						return true;
					}
				}
				if (success) {
					if (typeof(success) === 'string')
						T.seex(success, response);
					else
						success(response);
				}
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

			if (typeof(config) === 'function') {
				callback = config;
				config = '';
			}

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

		W.SEEX = function(name, a, b, c, d) {
			T.seex(name, a, b, c, d);
		};

		W.EXEC = function(name, a, b, c, d) {
			T.exec(name, a, b, c, d);
		};

		W.SETTER = function(name, a, b, c, d) {
			T.setter(null, name, a, b, c, d);
		};

		W.ASETTER = function(name, a, b, c, d) {
			return () => T.setter(null, name, a, b, c, d);
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
			return findinstance(this[0], '$uiplugin');
		};

		$.fn.component = function() {
			return findinstance(this[0], '$uicomponent');
		};

		$.fn.binder = function() {
			return findinstance(this[0], '$uibinder');
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
			var isreg = typeof(a) === 'object';

			for (var i = 0; i < arr.length; i++) {
				var cls = arr[i];
				if (cls) {
					if (isreg) {
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
				var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
				this.append(el);
				return $(el);
			}

			var d = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = document.createDocumentFragment();
			while (d.firstChild.firstChild)
				f.appendChild(d.firstChild.firstChild);
			f = $(f);
			this.append(f);
			return f;
		};

		$.fn.psvg = function(tag) {

			if (tag.indexOf('<') === -1) {
				var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
				this.prepend(el);
				return $(el);
			}

			var d = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = document.createDocumentFragment();
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

		$.fn.COMPONENTS = function() {
			var list = $(this).find('ui-component');
			var arr = [];
			for (let el of list) {
				let m = el.$uicomponent;
				if (m && m.ready && m.scope === T.root)
					arr.push(m);
			}
			return arr;
		};

		$.fn.EXEC = function(name, a, b, c, d) {
			var c = name.charAt(0);

			if (c === '@') {
				// component
				var component = this.component();
				if (component) {
					name = name.substring(1);
					let fn = component[name];
					fn && fn(component, a, b, c, d);
				}
			} else if (c === '?' || c === '|') {
				var plugin = this.plugin();
				T.exec(preparepath(plugin, name), a, b, c, d);
			} else
				T.exec(name, a, b, c, d);
		};

		$.fn.SEEX = function(name, a, b, c, d) {
			var c = name.charAt(0);
			if (c === '?' || c === '|') {
				var plugin = this.plugin();
				T.seex(preparepath(plugin, name), a, b, c, d);
			} else
				T.seex(name, a, b, c, d);
		};

	})();

	T.resize = function() {

		var resize = T.cache.resize;

		resize.timeout && clearTimeout(resize.timeout);
		resize.resize = null;

		var w = $W;

		W.WW = w.width();
		W.WH = w.height();

		if (!W.WH || !W.WH) {
			resize.timeout = setTimeout(T.resize, 10);
			return;
		}

		if (WW === resize.w && WH === resize.h)
			return;

		var d = WIDTH();

		resize.w = WW;
		resize.h = WH;

		if (resize.d !== d) {
			resize.d = d;
			var body = $('body');
			body.rclass('jc-lg jc-md jc-sm jc-xs');
			body.aclass('jc-' + d);
		}

		T.ready && T.emit('resize2');
	};

	// load localStorage
	function run() {

		// Chrome: it throws error sometimes that document.body is null
		if (!document.body) {
			setTimeout(run, 10);
			return;
		}

		T.cache.blocked = PARSE(W.localStorage && W.localStorage.getItem(DEF.localstorage + '.blocked') || '{}');

		var now = Date.now();
		var blocked = T.cache.blocked;
		for (let key in blocked) {
			if (blocked[key] < now)
				delete blocked[key];
		}

		T.emit('init');
		T.resize();

		// Initial configuration
		(function() {
			var arr = (navigator.userAgent || '').match(/[a-z]+/gi);
			var data = {};

			if (arr) {
				for (var i = 0; i < arr.length; i++) {
					var uai = arr[i];

					if (uai === 'like' && arr[i + 1] === 'Gecko') {
						i += 1;
						continue;
					}

					var key = uai.toLowerCase();
					if (key === 'like')
						break;

					switch (key) {
						case 'linux':
						case 'windows':
						case 'mac':
						case 'symbian':
						case 'symbos':
						case 'tizen':
						case 'android':
							data[uai] = 2;
							if (key === 'tizen' || key === 'android')
								data.Mobile = 1;
							break;
						case 'webos':
							data.WebOS = 2;
							break;
						case 'media':
						case 'center':
						case 'tv':
						case 'smarttv':
						case 'smart':
							data[uai] = 5;
							break;
						case 'iemobile':
						case 'mobile':
							data[uai] = 1;
							data.Mobile = 3;
							break;
						case 'ipad':
						case 'ipod':
						case 'iphone':
							data.iOS = 2;
							data.Mobile = 3;
							data[uai] = 1;
							if (key === 'ipad')
								data.Tablet = 4;
							break;
						case 'phone':
							data.Mobile = 3;
							break;
						case 'tizenbrowser':
						case 'blackberry':
						case 'mini':
							data.Mobile = 3;
							data[uai] = 1;
							break;
						case 'samsungbrowser':
						case 'chrome':
						case 'firefox':
						case 'msie':
						case 'opera':
						case 'outlook':
						case 'safari':
						case 'mail':
						case 'edge':
						case 'electron':
							data[uai] = 1;
							break;
						case 'trident':
							data.MSIE = 1;
							break;
						case 'opr':
							data.Opera = 1;
							break;
						case 'tablet':
							data.Tablet = 4;
							break;
					}
				}

				if (data.MSIE) {
					data.IE = 1;
					delete data.MSIE;
				}

				if (data.WebOS || data.Android)
					delete data.Linux;

				if (data.IEMobile) {
					if (data.Android)
						delete data.Android;
					if (data.Safari)
						delete data.Safari;
					if (data.Chrome)
						delete data.Chrome;
				} else if (data.MSIE) {
					if (data.Chrome)
						delete data.Chrome;
					if (data.Safari)
						delete data.Safari;
				} else if (data.Edge) {
					if (data.Chrome)
						delete data.Chrome;
					if (data.Safari)
						delete data.Safari;
				} else if (data.Opera || data.Electron) {
					if (data.Chrome)
						delete data.Chrome;
					if (data.Safari)
						delete data.Safari;
				} else if (data.Chrome) {
					if (data.Safari)
						delete data.Safari;
				} else if (data.SamsungBrowser) {
					if (data.Safari)
						delete data.Safari;
				}
			}

			var keys = Object.keys(data);
			var output = { os: '', browser: '', device: 'desktop' };

			if (data.Tablet)
				output.device = 'tablet';
			else if (data.Mobile)
				output.device = 'mobile';

			for (var i = 0; i < keys.length; i++) {
				var val = data[keys[i]];
				switch (val) {
					case 1:
						output.browser += (output.browser ? ' ' : '') + keys[i];
						break;
					case 2:
						output.os += (output.os ? ' ' : '') + keys[i];
						break;
					case 5:
						output.device = 'tv';
						break;
				}
			}

			T.ua = output;

			let LS = W.localStorage;

			try {
				var pmk = 'jc.test';
				LS.setItem(pmk, '1');
				W.isPRIVATEMODE = LS.getItem(pmk) !== '1';
				LS.removeItem(pmk);
			} catch {
				W.isPRIVATEMODE = true;
				WARN(ERR.format('localStorage is disabled'));
			}

			var body = document.body.classList;

			body.add('jc-' + (M.version >> 0));

			if (isPRIVATEMODE)
				body.add('jc-nostorage jc-incognito');

			if (isTOUCH)
				body.add('jc-touch');

			if (isSTANDALONE)
				body.add('jc-standalone');

			output.browser && body.add('jc-' + output.browser.toLowerCase());
			output.os && body.add('jc-' + output.os.toLowerCase());
			output.device && body.add('jc-' + output.device.toLowerCase());

			var viewportheight = function() {
				if (screen.orientation) {
					var viewport = document.querySelector('meta[name=viewport]');
					if (viewport && viewport.content && viewport.content.indexOf('height') === -1)
						viewport.setAttribute('content', viewport.content + ', height=' + W.innerHeight);
				}
			};

			W.addEventListener('load', viewportheight);

			if (output.device === 'mobile' || output.browser !== 'Firefox')
				W.addEventListener('deviceorientation', viewportheight, true);

		})();

		DEF.onstorageread(function(data) {

			T.cache.storage = data || {};
			T.ready = true;
			T.loaded = true;

			$W.on('resize', function() {
				var resize = T.cache.resize;
				resize.timeout && clearTimeout(resize.timeout);
				resize.timeout = setTimeout(T.resize, 100);
			});

			$W.on('visibilitychange', () => T.emit('visible', !document.hidden));
			$(document).ready(function() {

				// check exec component
				if (!T.db.components.exec) {
					(function() {
						var timeout = null;
						var el = $(document.body);
						var fn = function(plus, forceprevent) {
							return function execlick(e) {

								if (T.db.components.exec)
									return;

								var el = $(this);

								if (!plus && timeout)
									return;

								if (!e.$force && !plus && el.hclass('exec2')) {
									timeout && clearTimeout(timeout);
									timeout = setTimeout(function(ctx, e) {
										timeout = null;
										e.$force = true;
										execlick.call(ctx, e);
									}, 300, this, e);
									return;
								}

								var attr = el.attrd('exec' + plus);
								var href = el.attrd('href' + plus);

								if (timeout) {
									clearTimeout(timeout);
									timeout = null;
								}

								var prevent = forceprevent ? '1' : el.attrd('prevent' + plus);
								if (prevent === 'true' || prevent === '1') {
									e.preventDefault();
									e.stopPropagation();
								}

								attr && el.EXEC(attr, el, e);
								href && REDIRECT(href);
							};
						};
						el.on('contextmenu', '.exec3', fn('3', true));
						el.on('dblclick', '.exec2', fn('2'));
						el.on('click', '.exec', fn(''));
					})();
				}

				setTimeout(function() {
					let arr = T.autofill.splice(0);
					for (let m of arr) {

						if (!m.def)
							continue;

						let el = m.element.find('input,textarea,select');
						if (el.length) {
							let val = el.val();
							if (val) {
								var tmp = m.$parser ? m.$parser(val) : val;
								if (tmp)
									m.set(val, '@change @init');
							}
						}
					}
				}, 1000);

				var check = function() {
					if (readycounter > 0)
						setTimeout(check, 5);
					else
						T.emit('ready');
				};

				check();
			});
		});

	}

	setTimeout(run, 1);

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
			T.emit('scrollidle', area);
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
					T.emit('scroll', area);
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