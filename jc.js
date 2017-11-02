(function() {

	// Constants
	var REGCOM = /(data-ja|data-jc|data-jc-controller)=/;
	var REGSCRIPT = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGCSS = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGENV = /(\[.*?\])/gi;
	var REGPARAMS = /\{[a-z0-9]+\}/gi;
	var REGEMPTY = /\s/g;
	var REGCOMMA = /,/g;
	var REGGROUP = /\{[a-z0-9\-,\s]+\}/i;
	var REGBACKUP = /^backup\s/i;
	var REGSEARCH = /[^a-zA-Zá-žÁ-Žа-яА-Я\d\s:]/g;
	var ATTRSCOPE = '[data-jc-scope]';
	var ATTRSCOPECTRL = '[data-jc-controller]';
	var ATTRCOM = '[data-jc]';
	var ATTRURL = '[data-jc-url],[data-ja-url]';
	var ATTRDATA = 'jc';
	var ATTRDEL = 'data-jc-removed';
	var DIACRITICS = {225:'a',228:'a',269:'c',271:'d',233:'e',283:'e',357:'t',382:'z',250:'u',367:'u',252:'u',369:'u',237:'i',239:'i',244:'o',243:'o',246:'o',353:'s',318:'l',314:'l',253:'y',255:'y',263:'c',345:'r',341:'r',328:'n',337:'o'};
	var ACTRLS = { INPUT: true, TEXTAREA: true, SELECT: true };

	var LCOMPARER = window.Intl ? window.Intl.Collator().compare : function(a, b) {
		return a.localeCompare(b);
	};

	var C = {}; // COMPILER
	var M = {}; // MAIN
	var L = {}; // CONTROLLERS
	var A = {}; // APPS CONTAINER
	var W = window;

	// temporary
	W.jctmp = {};

	try {
		var pmk = 'jc.test';
		W.localStorage.setItem(pmk, '1');
		W.isPRIVATEMODE = W.localStorage.getItem(pmk) !== '1';
		W.localStorage.removeItem(pmk);
	} catch (e) {
		W.isPRIVATEMODE = true;
	}

	// Internal cache
	var blocked = {};
	var storage = {};
	var extensions = {}; // COMPONENT_EXTEND()
	var cache = {};
	var paths = {}; // saved paths from get() and set()
	var events = {};
	var temp = {};
	var mediaqueries = [];
	var singletons = {};
	var schedulers = [];
	var toggles = [];
	var middlewares = {};
	var warnings = {};
	var schemas = {};
	var autofill = [];
	var defaults = {};
	var waits = {};
	var operations = {};
	var workflows = {};
	var statics = {};
	var ajaxconfig = {};
	var $ready = setTimeout(load, 2);
	var $loaded = false;
	var schedulercounter = 0;
	var mediaqueriescounter = 0;
	var knockknockcounter = 0;

	var tmp_emit2 = [null, null, null];
	var current_ctrl = null;

	W.MAIN = W.M = W.jC = W.COM = M;
	W.APPS = W.A = A;
	W.CONTROLLERS = L;
	W.EMPTYARRAY = [];
	W.EMPTYOBJECT = {};
	W.DATETIME = new Date();

	M.defaults = {};
	M.defaults.environment = {};
	M.defaults.delay = 300;
	M.defaults.keypress = true;
	M.defaults.localstorage = true;
	M.defaults.jsoncompress = false;
	M.defaults.jsondate = true;
	M.defaults.ajaxerrors = false;
	M.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' };
	M.defaults.devices = { xs: { max: 768 }, sm: { min: 768, max: 992 }, md: { min: 992, max: 1200 }, lg: { min: 1200 }};
	M.defaults.importcache = 'session';
	M.defaults.pingdata = {};
	M.defaults.jsonconverter = {
		'text json': function (text) {
			return PARSE(text);
		}
	};

	M.defaults.thousandsseparator = ' ';
	M.defaults.decimalseparator = '.';

	W.MONTHS = M.months = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
	W.DAYS = M.days = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

	M.validators = {};
	M.validators.url = /^(http|https):\/\/(?:(?:(?:[\w\.\-\+!$&'\(\)*\+,;=]|%[0-9a-f]{2})+:)*(?:[\w\.\-\+%!$&'\(\)*\+,;=]|%[0-9a-f]{2})+@)?(?:(?:[a-z0-9\-\.]|%[0-9a-f]{2})+|(?:\[(?:[0-9a-f]{0,4}:)*(?:[0-9a-f]{0,4})\]))(?::[0-9]+)?(?:[\/|\?](?:[\w#!:\.\?\+=&@!$'~*,;\/\(\)\[\]\-]|%[0-9a-f]{2})*)?$/i;
	M.validators.phone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
	M.validators.email = /^[a-zA-Z0-9-_.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

	M.regexp = {};
	M.regexp.int = /(-|\+)?[0-9]+/;
	M.regexp.float = /(-|\+)?[0-9.,]+/;
	M.regexp.date = /yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|a|ww|w/g;
	M.regexp.pluralize = /#{1,}/g;
	M.regexp.format = /\{\d+\}/g;

	M.loaded = false;
	M.version = 'v12.0.6';
	M.$localstorage = 'jc';
	M.$version = '';
	M.$language = '';

	M.$components = {};
	M.components = [];
	M.$apps = {};
	A.items = M.apps = [];
	M.$formatter = [];
	M.$parser = [];
	L.items = M.controllers = {};
	M.compiler = C;

	C.is = false;
	C.recompile = false;
	C.pending = [];
	C.init = [];
	C.imports = {};
	C.ready = [];
	C.counter = 0;
	C.controllers = 0;

	if (Object.freeze) {
		Object.freeze(EMPTYOBJECT);
		Object.freeze(EMPTYARRAY);
	}

	// backward compatibility
	W.MAN = C;
	W.MAN.set = set;

	M.compile = compile;

	// ===============================================================
	// MAIN FUNCTIONS
	// ===============================================================

	M.ENV = W.ENV = function(name, value) {

		if (typeof(name) === 'object') {
			name && Object.keys(name).forEach(function(key) {
				M.defaults.environment[key] = name[key];
				M.emit('environment', key, name[key]);
			});
			return name;
		}

		if (value !== undefined) {
			M.emit('environment', name, value);
			M.defaults.environment[name] = value;
			return value;
		}

		return M.defaults.environment[name];
	};

	M.environment = function(name, version, language, env) {
		M.$localstorage = name;
		M.$version = version || '';
		M.$language = language || '';
		env && M.ENV(env);
		return M;
	};

	M.clean = function(timeout) {
		setTimeout2('$clean', cleaner, timeout || 10);
		return M;
	};

	W.EVALUATE = M.evaluate = function(path, expression, nopath) {

		var key = 'eval' + expression;
		var exp = temp[key];
		var val;

		if (nopath)
			val = path;
		else
			val = get(path);

		if (exp !== undefined)
			return exp.call(val, val, path);
		if (expression.indexOf('return') === -1)
			expression = 'return ' + expression;
		exp = new Function('value', 'path', expression);
		temp[key] = exp;
		return exp.call(val, val, path);
	};

	W.COOKIES = M.cookies = {
		get: function (name) {
			name = name.env();
			var arr = document.cookie.split(';');
			for (var i = 0; i < arr.length; i++) {
				var c = arr[i];
				if (c.charAt(0) === ' ')
					c = c.substring(1);
				var v = c.split('=');
				if (v.length > 1 && v[0] === name)
					return v[1];
			}
			return '';
		},
		set: function (name, value, expire) {
			var type = typeof(expire);
			if (type === 'number') {
				var date = W.DATETIME;
				date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));
				expire = date;
			} else if (type === 'string')
				expire = new Date(Date.now() + expire.parseExpire());
			document.cookie = name.env() + '=' + value + '; expires=' + expire.toGMTString() + '; path=/';
		},
		rem: function (name) {
			M.cookies.set(name.env(), '', -1);
		}
	};

	M.formatter = function(value, path, type) {

		if (typeof(value) === 'function') {
			!M.$formatter && (M.$formatter = []);
			M.$formatter.push(value);
			return M;
		}

		var a = M.$formatter;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				var val = a[i].call(M, path, value, type);
				if (val !== undefined)
					value = val;
			}
		}

		return value;
	};

	M.parser = function(value, path, type) {

		if (typeof(value) === 'function') {
			!M.$parser && (M.$parser = []);
			M.$parser.push(value);
			return this;
		}

		var a = M.$parser;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++)
				value = a[i].call(M, path, value, type);
		}

		return value;
	};

	function parseHeaders(val) {
		var h = {};
		val.split('\n').forEach(function(line) {
			var index = line.indexOf(':');
			if (index !== -1)
				h[line.substring(0, index).toLowerCase()] = line.substring(index + 1).trim();
		});
		return h;
	}

	W.UPLOAD = M.upload = function(url, data, callback, timeout, progress) {

		if (!url)
			url = location.pathname;

		var method = 'POST';
		var index = url.indexOf(' ');
		var tmp;

		if (index !== -1)
			method = url.substring(0, index).toUpperCase();

		var isCredentials = method.substring(0, 1) === '!';
		if (isCredentials)
			method = method.substring(1);

		var headers = {};
		tmp = url.match(/\{.*?\}/g);

		if (tmp) {
			url = url.replace(tmp, '').replace(/\s{2,}/g, ' ');
			tmp = (new Function('return ' + tmp))();
			if (typeof(tmp) === 'object')
				headers = tmp;
		}

		url = url.substring(index).trim().$env();

		// middleware
		index = url.indexOf(' #');
		var mid = '';

		if (index !== -1) {
			mid = url.substring(index);
			url = url.substring(0, index);
		}

		if (typeof(callback) === 'number') {
			timeout = callback;
			callback = undefined;
		}

		setTimeout(function() {

			var xhr = new XMLHttpRequest();
			var output = {};

			if (isCredentials)
				xhr.withCredentials = true;

			output.process = true;
			output.error = false;
			output.upload = true;
			output.method = method;
			output.url = url.$env();
			output.data = data;

			xhr.addEventListener('load', function() {

				var self = this;
				var r = self.responseText;
				try {
					r = PARSE(r, M.defaults.jsondate);
				} catch (e) {}

				if (progress) {
					if (typeof(progress) === 'string')
						remap(progress, 100);
					else
						progress(100);
				}

				output.response = r;
				output.status = self.status;
				output.text = self.statusText;
				output.error = self.status > 399;
				output.headers = parseHeaders(self.getAllResponseHeaders());

				M.emit('response', output);

				if (!output.process || output.cancel)
					return;

				if (!r && output.error)
					r = output.response = self.status + ': ' + self.statusText;

				if (!output.error || M.defaults.ajaxerrors) {
					middleware(mid, r, 1, function(path, value) {
						typeof(callback) === 'string' ? remap(callback.env(), value) : (callback && callback(value, null, output));
					});
					return;
				}

				M.emit('error', output);
				output.process && typeof(callback) === 'function' && callback({}, r, output);

			}, false);

			xhr.upload.onprogress = function(evt) {
				if (!progress)
					return;
				var percentage = 0;
				if (evt.lengthComputable)
					percentage = Math.round(evt.loaded * 100 / evt.total);
				if (typeof(progress) === 'string')
					remap(progress.env(), percentage);
				else
					progress(percentage, evt.transferSpeed, evt.timeRemaining);
			};

			xhr.open(method, makeurl(url));

			var keys = Object.keys(M.defaults.headers);
			for (var i = 0; i < keys.length; i++)
				xhr.setRequestHeader(keys[i].env(), M.defaults.headers[keys[i]].env());

			if (headers) {
				var keys = Object.keys(headers);
				for (var i = 0; i < keys.length; i++)
					xhr.setRequestHeader(keys[i], headers[keys[i]]);
			}

			xhr.send(data);

		}, timeout || 0);

		return M;
	};

	M.ready = function(fn) {
		if (C.ready)
			C.ready.push(fn);
		else
			fn();
		return M;
	};

	W.WATCH = M.watch = function(path, fn, init) {

		if (typeof(path) === 'function') {
			init = fn;
			fn = path;
			path = '*';
		}

		path = ctrl_path(path);
		ON('watch', path, fn);
		init && fn.call(M, path, get(path), 0);
		return M;
	};

	W.ON = M.on = function(name, path, fn, init) {

		if (typeof(path) === 'function') {
			fn = path;
			path = name === 'watch' ? '*' : '';
		} else
			path = path.replace('.*', '');

		var fixed = null;
		if (path.charCodeAt(0) === 33) {
			path = path.substring(1);
			fixed = path;
		}

		var owner = null;
		var index = name.indexOf('#');

		if (index) {
			owner = name.substring(0, index).trim();
			name = name.substring(index + 1).trim();
		}

		if (!events[path]) {
			events[path] = {};
			events[path][name] = [];
		} else if (!events[path][name])
			events[path][name] = [];

		events[path][name].push({ fn: fn, path: fixed, owner: owner, controller: current_ctrl });
		init && fn.call(M, path, get(path), true);
		(!C.ready && (name === 'ready' || name === 'init')) && fn();
		return M;
	};

	W.OFF = M.off = function(name, path, fn) {

		if (typeof(path) === 'function') {
			fn = path;
			path = '';
		}

		if (path === undefined)
			path = '';

		var owner = null;
		var index = name.indexOf('#');
		if (index) {
			owner = name.substring(0, index).trim();
			name = name.substring(index + 1).trim();
		}

		if (path)
			path = path.replace('.*', '');

		var type = 0;

		if (owner && !path && !fn && !name)
			type = 1;
		else if (owner && name && !fn && !path)
			type = 2;
		else if (owner && name && path)
			type = 3;
		else if (owner && name && path && fn)
			type = 4;
		else if (name && path && fn)
			type = 5;
		else if (fn)
			type = 6;

		Object.keys(events).forEach(function(p) {

			var evt = events[p];
			if (type > 2 && type < 5) {
				if (p !== path)
					return false;
			}

			Object.keys(evt).forEach(function(key) {
				evt[key] = evt[key].remove(function(item) {
					if (type === 1)
						return item.owner === owner;
					else if (type === 2)
						return key === name && item.owner === owner;
					else if (type === 3)
						return key === name && item.owner === owner;
					else if (type === 4)
						return key === name && item.owner === owner && item.fn === fn;
					else if (type === 5 || type === 6)
						return key === name && item.fn === fn;
					else if (type === 6)
						return item.fn === fn;
					return key === name;
				});

				if (!evt[key].length)
					delete evt[key];
			});

			if (!Object.keys(evt).length)
				delete events[p];
		});

		return M;
	};

	W.EMIT = M.emit = function(name) {

		var e = events[''];
		if (!e)
			return false;

		e = events[''][name];
		if (!e)
			return false;

		var args = [];

		for (var i = 1, length = arguments.length; i < length; i++)
			args.push(arguments[i]);

		for (var i = 0, length = e.length; i < length; i++) {
			var context = e[i].context;
			if (context !== undefined && (context === null || context.$removed))
				continue;
			e[i].fn.apply(context || window, args);
		}

		return true;
	};

	W.CHANGE = M.change = function(path, value) {
		return value === undefined ? !M.dirty(path) : !M.dirty(path, !value);
	};

	M.used = function(path) {
		M.each(function(obj) {
			obj.used();
		}, path, true);
		return M;
	};

	M.valid = function(path, value, onlyComponent) {

		var isExcept = value instanceof Array;
		var key = 'valid' + path + (isExcept ? '>' + value.join('|') : '');
		var except;

		if (isExcept) {
			except = value;
			value = undefined;
		}

		if (typeof(value) !== 'boolean' && cache[key] !== undefined)
			return cache[key];

		var valid = true;
		var arr = value !== undefined ? [] : null;

		M.each(function(obj, index, isAsterix) {

			if (isExcept && except.indexOf(obj.path) !== -1)
				return;

			if (obj.disabled || obj.$valid_disabled) {
				arr && obj.state && arr.push(obj);
				return;
			}

			if (value === undefined) {
				if (obj.$valid === false)
					valid = false;
				return;
			}

			obj.state && arr.push(obj);

			if (!onlyComponent) {
				if (isAsterix || obj.path === path) {
					obj.$valid = value;
					obj.$validate = false;
					obj.$interaction(102);
				}
			} else if (onlyComponent._id === obj._id) {
				obj.$valid = value;
				obj.$interaction(102);
			}

			if (obj.$valid === false)
				valid = false;

		}, path, true);

		clear('valid');
		cache[key] = valid;
		state(arr, 1, 1);
		return valid;
	};

	M.dirty = function(path, value, onlyComponent, skipEmitState) {

		var isExcept = value instanceof Array;
		var key = 'dirty' + path + (isExcept ? '>' + value.join('|') : '');
		var except;

		if (isExcept) {
			except = value;
			value = undefined;
		}

		if (typeof(value) !== 'boolean' && cache[key] !== undefined)
			return cache[key];

		var dirty = true;
		var arr = value !== undefined ? [] : null;

		M.each(function(obj, index, isAsterix) {

			if (isExcept && except.indexOf(obj.path) !== -1)
				return;

			if (obj.disabled || obj.$dirty_disabled) {
				arr && obj.state && arr.push(obj);
				return;
			}

			if (value === undefined) {
				if (obj.$dirty === false)
					dirty = false;
				return;
			}

			obj.state && arr.push(obj);

			if (!onlyComponent) {
				if (isAsterix || obj.path === path) {
					obj.$dirty = value;
					obj.$interaction(101);
				}
			} else if (onlyComponent._id === obj._id) {
				obj.$dirty = value;
				obj.$interaction(101);
			}

			if (obj.$dirty === false)
				dirty = false;

		}, path, true);

		clear('dirty');
		cache[key] = dirty;

		// For double hitting component.state() --> look into COM.invalid()
		!skipEmitState && state(arr, 1, 2);
		return dirty;
	};

	W.INJECT = W.IMPORT = M.import = function(url, target, callback, insert, preparator) {

		url = url.$env();

		// unique
		var first = url.substring(0, 1);
		var once = url.substring(0, 5).toLowerCase() === 'once ';

		if (typeof(target) === 'function') {

			if (typeof(callback) === 'function') {
				preparator = callback;
				insert = true;
			} else if (typeof(insert) === 'function') {
				preparator = insert;
				insert = true;
			}

			callback = target;
			target = 'body';
		} else if (typeof(insert) === 'function') {
			preparator = insert;
			insert = true;
		}

		var index = url.lastIndexOf(' .');
		var ext = '';

		if (index !== -1) {
			ext = url.substring(index).trim().toLowerCase();
			url = url.substring(0, index).trim();
		}

		if (first === '!' || once) {

			if (once)
				url = url.substring(5);
			else
				url = url.substring(1);

			if (statics[url]) {

				if (!callback)
					return M;

				if (statics[url] === 2) {
					callback();
					return M;
				}

				WAIT(function() {
					return statics[url] === 2;
				}, callback);
				return M;
			}

			statics[url] = 1;
		}

		if (target && target.setPath)
			target = target.element;

		if (!target)
			target = 'body';

		if (!ext) {
			index = url.lastIndexOf('?');
			if (index !== -1) {
				var index2 = url.lastIndexOf('.', index);
				if (index2 !== -1)
					ext = url.substring(index2, index).toLowerCase();
			} else {
				index = url.lastIndexOf('.');
				if (index !== -1)
					ext = url.substring(index).toLowerCase();
			}
		}

		var d = document;
		if (ext === '.js') {
			var scr = d.createElement('script');
			scr.type = 'text/javascript';
			// scr.async = true;
			scr.onload = function() {
				statics[url] = 2;
				callback && callback();
				W.jQuery && setTimeout(compile, 300);
			};
			scr.src = url;
			d.getElementsByTagName('head')[0].appendChild(scr);
			return M;
		}

		if (ext === '.css') {
			var stl = d.createElement('link');
			stl.type = 'text/css';
			stl.rel = 'stylesheet';
			stl.href = url;
			d.getElementsByTagName('head')[0].appendChild(stl);
			statics[url] = 2;
			callback && setTimeout(callback, 200);
			return M;
		}

		WAIT(function() {
			return W.jQuery ? true : false;
		}, function() {

			statics[url] = 2;
			var id = 'import' + W.HASH(url);

			AJAX('GET ' + url, function(response) {

				url = '$import' + url;

				if (preparator)
					response = preparator(response);

				response = importscripts(importstyles(response, id), id);

				target = $(target);

				if (insert === false)
					target.html(response);
				else
					target.append(response);

				setTimeout(function() {
					response && REGCOM.test(response) && compile(target);
					callback && WAIT(function() {
						return C.is == false && C.controllers == 0;
					}, callback);
				}, 10);
			});
		});

		return M;
	};

	W.CACHEPATH = M.cachepath = function(path, expire, rebind) {
		var key = '$jcpath';
		M.watch(path, function(p, value) {
			var obj = cachestorage(key);
			if (obj)
				obj[path] = value;
			else {
				obj = {};
				obj[path] = value;
			}
			cachestorage(key, obj, expire);
		});

		if (rebind === undefined || rebind) {
			var cache = cachestorage(key);
			cache && cache[path] !== undefined && cache[path] !== get(path) && M.set(path, cache[path], true);
		}
		return M;
	};


	W.CACHE = M.cache = function(key, value, expire) {
		return cachestorage(key, value, expire);
	};

	W.SCROLLBARWIDTH = function() {
		var id = 'jcscrollbarwidth';
		if (cache[id])
			return cache[id];
		var b = document.body;
		$(b).append('<div id="{0}" style="width{1}height{1}overflow:scroll;position:absolute;top{2}left{2}"></div>'.format(id, ':100px;', ':9999px;'));
		var el = document.getElementById(id);
		var w = cache[id] = el.offsetWidth - el.clientWidth;
		b.removeChild(el);
		return w;
	};

	W.REMOVECACHE = M.removeCache = function(key, isSearching) {
		if (isSearching) {
			for (var m in storage) {
				if (m.indexOf(key) !== -1)
					delete storage[key];
			}
		} else
			delete storage[key];
		save();
		return M;
	};

	W.USAGE = M.usage = function(name, expire, path, callback) {

		var type = typeof(expire);
		if (type === 'string') {
			var dt = W.DATETIME = new Date();
			expire = dt.add('-' + expire).getTime();
		} else if (type === 'number')
			expire = Date.now() - expire;

		if (typeof(path) === 'function') {
			callback = path;
			path = undefined;
		}

		var arr = [];

		if (path) {
			M.findByPath(path, function(c) {
				if (c.usage[name] > expire)
					return;
				if (callback)
					callback(c);
				else
					arr.push(c);
			});
		} else {
			M.components.forEach(function(c) {
				if (c.usage[name] > expire)
					return;
				if (callback)
					callback(c);
				else
					arr.push(c);
			});
		}

		return callback ? M : arr;
	};

	M.parseCookie = M.parseCookies = function() {
		var arr = document.cookie.split(';');
		var obj = {};

		for (var i = 0, length = arr.length; i < length; i++) {
			var line = arr[i].trim();
			var index = line.indexOf('=');
			if (index !== -1)
				obj[line.substring(0, index)] = decodeURIComponent(line.substring(index + 1));
		}

		return obj;
	};

	M.createURL = function(url, values) {

		if (typeof(url) === 'object') {
			values = url;
			url = location.pathname + location.search;
		}

		var query;
		var index = url.indexOf('?');
		if (index !== -1) {
			query = M.parseQuery(url.substring(index + 1));
			url = url.substring(0, index);
		} else
			query = {};

		var keys = Object.keys(values);

		for (var i = 0, length = keys.length; i < length; i++) {
			var key = keys[i];
			query[key] = values[key];
		}

		var val = $.param(query, true);
		return url + (val ? '?' + val : '');
	};

	M.parseQuery = function(value) {

		if (!value)
			value = location.search;

		if (!value)
			return EMPTYOBJECT;

		var index = value.indexOf('?');
		if (index !== -1)
			value = value.substring(index + 1);

		var arr = value.split('&');
		var obj = {};
		for (var i = 0, length = arr.length; i < length; i++) {
			var sub = arr[i].split('=');
			var key = sub[0];
			var val = decodeURIComponent((sub[1] || '').replace(/\+/g, '%20'));

			if (!obj[key]) {
				obj[key] = val;
				continue;
			}

			if (!(obj[key] instanceof Array))
				obj[key] = [obj[key]];
			obj[key].push(val);
		}
		return obj;
	};

	W.AJAXCONFIG = M.AJAXCONFIG = function(name, fn) {
		ajaxconfig[name] = fn;
		return M;
	};

	W.AJAX = M.AJAX = function(url, data, callback, timeout) {

		if (typeof(url) === 'function') {
			timeout = callback;
			callback = data;
			data = url;
			url = location.pathname;
		}

		var td = typeof(data);
		var tmp;

		if (!callback && (td === 'function' || td === 'string')) {
			timeout = callback;
			callback = data;
			data = undefined;
		}

		var index = url.indexOf(' ');
		if (index === -1)
			return M;

		var method = url.substring(0, index).toUpperCase();
		var isCredentials = method.substring(0, 1) === '!';
		if (isCredentials)
			method = method.substring(1);

		var headers = {};
		tmp = url.match(/\{.*?\}/g);

		if (tmp) {
			url = url.replace(tmp, '').replace(/\s{2,}/g, ' ');
			tmp = (new Function('return ' + tmp))();
			if (typeof(tmp) === 'object')
				headers = tmp;
		}

		url = url.substring(index).trim().$env();

		// middleware
		index = url.indexOf(' #');
		var mid = '';

		if (index !== -1) {
			mid = url.substring(index);
			url = url.substring(0, index);
		}

		setTimeout(function() {

			if (method === 'GET' && data)
				url += '?' + (typeof(data) === 'string' ? data : jQuery.param(data, true));

			var options = {};
			options.type = method;
			options.converters = M.defaults.jsonconverter;

			if (method !== 'GET') {
				if (typeof(data) === 'string') {
					options.data = data;
				} else {
					options.contentType = 'application/json; charset=utf-8';
					options.data = STRINGIFY(data);
				}
			}

			options.headers = $.extend(headers, M.defaults.headers);

			if (url.match(/http\:\/\/|https\:\/\//i)) {
				options.crossDomain = true;
				delete options.headers['X-Requested-With'];
				if (isCredentials)
					options.xhrFields = { withCredentials: true };
			}

			var custom = url.match(/\([a-z0-9\-\.\,]+\)/i);
			if (custom) {
				url = url.replace(custom, '').replace(/\s+/g, '');
				custom = custom.toString().replace(/\(|\)/g, '').split(',');
				for (var i = 0; i < custom.length; i++) {
					var opt = ajaxconfig[custom[i].trim()];
					opt && opt(options);
				}
			}

			var output = {};
			output.url = url;
			output.process = true;
			output.error = false;
			output.upload = false;
			output.method = method;
			output.data = data;

			options.success = function(r, s, req) {
				output.response = r;
				output.status = req.status || 999;
				output.text = s;
				output.headers = parseHeaders(req.getAllResponseHeaders());
				M.emit('response', output);
				(output.process && !output.cancel) && middleware(mid, output.response, 1, function(path, value) {
					if (typeof(callback) === 'string')
						remap(callback, value);
					else
						callback && callback.call(output, value, undefined, output);
				});
			};

			options.error = function(req, s) {

				output.response = req.responseText;
				output.status = req.status || 999;
				output.text = s;
				output.error = true;
				output.headers = parseHeaders(req.getAllResponseHeaders());
				var ct = output.headers['content-type'];

				if (ct && ct.indexOf('/json') !== -1) {
					try {
						output.response = PARSE(output.response, M.defaults.jsondate);
					} catch (e) {}
				}

				M.emit('response', output);

				if (output.cancel || !output.process)
					return;

				if (M.defaults.ajaxerrors) {
					middleware(mid, output.response, 1, function(path, value) {
						if (typeof(callback) === 'string')
							remap(callback, value);
						else
							callback && callback.call(output, value, output.status, output);
					});
				} else {
					M.emit('error', output);
					if (typeof(callback) === 'function')
						callback.call(output, output.response, output.status, output);
				}
			};

			$.ajax(makeurl(url), options);

		}, timeout || 0);

		return M;
	};

	W.AJAXCACHEREVIEW = M.AJAXCACHEREVIEW = function(url, data, callback, expire, timeout, clear) {
		return M.AJAXCACHE(url, data, callback, expire, timeout, clear, true);
	};

	W.AJAXCACHE = M.AJAXCACHE = function(url, data, callback, expire, timeout, clear, review) {

		var tdata = typeof(data);

		if (tdata === 'function' || (tdata === 'string' && typeof(callback) === 'string' && typeof(expire) !== 'string')) {
			clear = timeout;
			timeout = expire;
			expire = callback;
			callback = data;
			data = null;
		}

		if (typeof(timeout) === 'boolean') {
			timeout = 0;
			clear = true;
		}

		var index = url.indexOf(' ');
		if (index === -1)
			return M;

		var method = url.substring(0, index).toUpperCase();
		var uri = url.substring(index).trim().$env();

		setTimeout(function() {
			var value = clear ? undefined : cacherest(method, uri, data, undefined, expire);
			if (value !== undefined) {

				var diff = review ? STRINGIFY(value) : null;

				if (typeof(callback) === 'string')
					remap(callback, value);
				else
					callback(value, true);

				if (!review)
					return;

				M.AJAX(url, data, function(r, err) {
					if (err)
						r = err;
					// Is same?
					if (diff !== STRINGIFY(r)) {
						cacherest(method, uri, data, r, expire);
						if (typeof(callback) === 'string')
							remap(callback, r);
						else
							callback(r, false, true);
					}
				});
				return;
			}

			M.AJAX(url, data, function(r, err) {
				if (err)
					r = err;
				cacherest(method, uri, data, r, expire);
				if (typeof(callback) === 'string')
					remap(callback, r);
				else
					callback(r, false);
			});
		}, timeout || 1);

		return M;
	};

	W.SCHEDULE = M.schedule = function(selector, name, expire, callback) {
		if (expire.substring(0, 1) !== '-')
			expire = '-' + expire;
		var arr = expire.split(' ');
		var type = arr[1].toLowerCase().substring(0, 1);
		var id = GUID(10);
		schedulers.push({ id: id, name: name, expire: expire, selector: selector, callback: callback, type: type === 'y' || type === 'd' ? 'h' : type, controller: current_ctrl });
		return id;
	};

	W.CLEARSCHEDULE = M.clearSchedule = function(id) {
		schedulers = schedulers.remove('id', id);
		return M;
	};

	W.ERRORS = M.errors = function(path, except, highlight) {

		if (path instanceof Array) {
			except = path;
			path = undefined;
		}

		if (except === true) {
			except = highlight instanceof Array ? highlight : null;
			highlight = true;
		}

		var arr = [];

		M.each(function(obj) {
			if (except && except.indexOf(obj.path) !== -1)
				return;
			if (obj.$valid === false && !obj.$valid_disabled)
				arr.push(obj);
		}, ctrl_path(path));

		highlight && state(arr, 1, 1);
		return arr;
	};

	W.CAN = M.can = function(path, except) {
		path = ctrl_path(path);
		return !M.dirty(path, except) && M.valid(path, except);
	};

	W.DISABLED = M.disabled = M.disable = function(path, except) {
		path = ctrl_path(path);
		return M.dirty(path, except) || !M.valid(path, except);
	};

	W.INVALID = M.invalid = function(path, onlyComponent) {
		path = ctrl_path(path);
		if (!path)
			return M;
		M.dirty(path, false, onlyComponent, true);
		M.valid(path, false, onlyComponent);
		return M;
	};

	W.BLOCKED = M.blocked = function(name, timeout, callback) {
		var key = name;
		var item = blocked[key];
		var now = Date.now();

		if (item > now)
			return true;

		if (typeof(timeout) === 'string')
			timeout = timeout.env().parseExpire();

		var local = M.defaults.localstorage && timeout > 10000;
		blocked[key] = now + timeout;
		!W.isPRIVATEMODE && local && localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));
		callback && callback();
		return false;
	};

	// 1 === manually
	// 2 === by input
	M.update = function(path, reset, type) {

		path = ctrl_path(path);
		if (!path)
			return M;

		var is = path.charCodeAt(0) === 33;
		if (is)
			path = path.substring(1);

		path = path.replace(/\.\*/, '');
		middleware(path, undefined, type, function(path) {

			if (!path)
				return;

			var state = [];
			var updates = {};

			// Array prevention
			var search = path;

			if (type === undefined)
				type = 1; // manually

			var A = search.split('.');
			var AL = A.length;
			var isarr = path.indexOf('[') !== -1;

			M.each(function(component) {

				if (!component.path || component.disabled)
					return;

				var isnot = true;

				for (var i = 0; i < AL; i++) {
					var item = component.$$path[i];
					if (!item)
						return;
					if (isarr) {
						if (item.raw !== A[i])
							return;
					} else {
						if (item.path && item.path !== A[i])
							return;
						if (item.is)
							isnot = false;
					}
				}

				if (isnot && component.$path && component.$path !== path)
					return;

				var result = component.get();
				if (component.setter) {
					component.$skip = false;
					middleware(component.middleware, result, type, function(tmp, value) {
						component.setter(value, path, type);
					});
					component.$interaction(type);
				}

				component.$ready = true;

				if (reset === true) {

					if (!component.$dirty_disabled) {
						component.$dirty = true;
						component.$interaction(101);
					}

					if (!component.$valid_disabled) {
						component.$valid = true;
						component.$validate = false;
						if (component.validate) {
							component.$valid = component.validate(result);
							component.$interaction(102);
						}
					}

					findcontrol(component.element.get(0), function(el) {
						if (el.$com !== component)
							el.$com = component;
						el.$value = el.$value2 = undefined;
					});

				} else if (component.validate && !component.$valid_disabled)
					component.valid(component.validate(result), true);

				component.state && state.push(component);
				updates[component.path] = result;

			}, is ? path : undefined, undefined, is);

			reset && clear('dirty', 'valid');

			if (!updates[path])
				updates[path] = get(path);

			for (var i = 0, length = state.length; i < length; i++)
				state[i].state(1, 4);

			// watches
			length = path.length;

			Object.keys(events).forEach(function(key) {
				if (key === path || key.substring(0, length + 1) === path + '.')
					updates[key] = get(key);
			});

			emitonly('watch', updates, type, path);
		});

		return M;
	};

	W.NOTIFY = M.notify = function() {

		var arg = arguments;
		var length = arguments.length;

		M.each(function(component) {

			if (!component.path || component.disabled)
				return;

			var is = false;

			for (var i = 0; i < length; i++) {
				if (component.path === arg[i]) {
					is = true;
					break;
				}
			}

			if (!is)
				return;

			var val = component.get();
			component.setter && component.setter(val, component.path, 1);
			component.setter2 && component.setter2(val, component.path, 1);
			component.state && component.state(1, 6);
			component.$interaction(1);
		});

		Object.keys(events).forEach(function(key) {

			var is = false;
			for (var i = 0; i < length; i++) {
				if (key === arg[i]) {
					is = true;
					break;
				}
			}

			if (!is)
				return;

			tmp_emit2[0] = key;
			tmp_emit2[1] = get(key);
			tmp_emit2[2] = 1;
			emit2('watch', key, tmp_emit2);
		});

		return M;
	};

	M.extend = function(path, value, type) {
		path = ctrl_path(path);
		if (path) {
			var val = get(path);
			if (val == null)
				val = {};
			M.set(path, $.extend(val, value), type);
		}
		return M;
	};

	W.REWRITE = M.rewrite = function(path, val) {
		path = ctrl_path(path);
		path && middleware(path, val, 1, helper_rewrite);
		return M;
	};

	function helper_rewrite(path, value) {
		set(path, value, 1);
		emitwildcard(path, value, 1);
	}

	M.inc = function(path, value, type) {

		path = ctrl_path(path);

		if (!path)
			return M;

		var current = get(path);
		if (!current) {
			current = 0;
		} else if (typeof(current) !== 'number') {
			current = parseFloat(current);
			if (isNaN(current))
				current = 0;
		}

		current += value;
		M.set(path, current, type);
		return M;
	};

	// 1 === manually
	// 2 === by input
	M.set = function(path, val, type) {

		path = ctrl_path(path);
		if (!path)
			return M;

		middleware(path, val, type, function(path, value) {

			var is = path.charCodeAt(0) === 33;
			if (is)
				path = path.substring(1);

			if (path.charCodeAt(0) === 43) {
				path = path.substring(1);
				return M.push(path, value, type);
			}

			if (!path)
				return M;

			var isUpdate = (typeof(value) === 'object' && !(value instanceof Array) && value != null);
			var reset = type === true;
			if (reset)
				type = 1;

			set(path, value, type);

			if (isUpdate)
				return M.update(path, reset, type, true);

			// Is changed value by e.g. middleware?
			// If yes the control/input will be redrawn
			var isChanged = val !== value;
			var result = get(path);
			var state = [];

			if (type === undefined)
				type = 1;

			var A = path.split('.');
			var AL = A.length;

			M.each(function(component) {

				if (!component.path || component.disabled)
					return;

				for (var i = 0; i < AL; i++) {
					var item = component.$$path[i];
					if (item && item.raw !== A[i])
						return;
				}

				if (component.$path && component.$path !== path)
					return;

				if (component.path === path) {
					if (component.setter) {
						if (isChanged)
							component.$skip = false;
						middleware(component.middleware, result, type, function(tmp, value) {
							component.setter(value, path, type);
						});
						component.$interaction(type);
					}
				} else {
					if (component.setter) {
						if (isChanged)
							component.$skip = false;
						middleware(component.middleware, get(component.path), type, function(tmp, value) {
							component.setter(value, path, type);
						});
						component.$interaction(type);
					}
				}

				component.$ready = true;
				component.state && state.push(component);

				if (reset) {
					if (!component.$dirty_disabled)
						component.$dirty = true;
					if (!component.$valid_disabled) {
						component.$valid = true;
						component.$validate = false;
						if (component.validate) {
							component.$valid = component.validate(result);
							component.$interaction(102);
						}
					}

					findcontrol(component.element.get(0), function(el) {
						if (el.$com !== component)
							el.$com = component;
						el.$value = el.$value2 = undefined;
					});

				} else if (component.validate && !component.$valid_disabled)
					component.valid(component.validate(result), true);

			}, path, true, is);

			reset && clear('dirty', 'valid');

			for (var i = 0, length = state.length; i < length; i++)
				state[i].state(type, 5);

			emit('watch', path, undefined, type, is);
		});
		return M;
	};

	M.push = function(path, value, type) {

		var arr = get(path);
		var n = false;

		if (!(arr instanceof Array)) {
			arr = [];
			n = true;
		}

		var is = true;

		if (value instanceof Array) {
			if (value.length)
				arr.push.apply(arr, value);
			else
				is = false;
		}
		else
			arr.push(value);

		if (n)
			M.set(path, arr, type);
		else if (is)
			M.update(path, type);
		return M;
	};

	function ctrl_path(path) {

		if (!path)
			return path;

		// temporary
		if (path.charCodeAt(0) === 37)
			return 'jctmp.' + path.substring(1);

		if (path.charCodeAt(0) === 64) {
			path = path.substring(1);
			var index = path.indexOf('.');
			var ctrl = CONTROLLER(path.substring(0, index));
			return (ctrl ? ctrl.scope : 'UNDEFINED') + path.substring(index);
		}

		var index = path.indexOf('/');
		if (index === -1)
			return path;

		var ctrl = CONTROLLER(path.substring(0, index));
		return (ctrl ? ctrl.scope : 'UNDEFINED') + '.' + path.substring(index + 1);
	}

	W.GET = M.get = function(path, scope) {
		return get(ctrl_path(path), scope);
	};

	M.remove = function(path) {

		if (path instanceof jQuery) {
			path.find(ATTRCOM).attr(ATTRDEL, 'true').each(function() {
				var com = $(this).data(ATTRDATA);
				if (com) {
					if (com instanceof Array) {
						com.forEach(function(o) {
							o.$removed = true;
						});
					} else
						com.$removed = true;
				}
			});

			attrcom(path, 'template') && path.attr(ATTRDEL, 'true');

			var com = path.data(ATTRDATA);
			if (com) {
				if (com instanceof Array) {
					com.forEach(function(o) {
						o.$removed = true;
					});
				} else
					com.$removed = true;
			}

			setTimeout2('$cleaner', cleaner, 100);
			return M;
		}

		clear();
		M.each(function(obj) {
			obj.remove(true);
		}, ctrl_path(path));

		setTimeout2('$cleaner', cleaner, 100);
		return M;
	};

	M.schema = function(name, declaration) {

		if (!declaration)
			return CLONE(schemas[name]);

		if (typeof(declaration) === 'object') {
			schemas[name] = declaration;
			return declaration;
		}

		if (typeof(declaration) === 'function') {
			var f = declaration();
			schemas[name] = f;
			return f;
		}

		if (typeof(declaration) !== 'string')
			return undefined;

		var a = declaration.substring(0, 1);
		var b = declaration.substring(declaration.length - 1);

		if ((a === '"' && b === '"') || (a === '[' && b === ']') || (a === '{' && b === '}')) {
			var d = PARSE(declaration, M.defaults.jsondate);
			schemas[name] = d;
			return d;
		}
	};

	W.VALIDATE = M.validate = function(path, except) {

		var arr = [];
		var valid = true;

		path = ctrl_path(path);

		M.each(function(obj) {

			if (obj.disabled || (except && except.indexOf(obj.path) !== -1))
				return;

			obj.state && arr.push(obj);

			if (obj.$valid_disabled)
				return;

			obj.$validate = true;

			if (obj.validate) {
				obj.$valid = obj.validate(get(obj.path));
				obj.$interaction(102);
				if (!obj.$valid)
					valid = false;
			}

		}, path);

		clear('valid');
		state(arr, 1, 1);
		emit('validate', path);
		return valid;
	};

	M.default = function(path, timeout, onlyComponent, reset) {

		if (timeout > 0) {
			setTimeout(function() {
				M.default(path, 0, onlyComponent, reset);
			}, timeout);
			return M;
		}

		if (typeof(onlyComponent) === 'boolean') {
			reset = onlyComponent;
			onlyComponent = null;
		}

		if (reset === undefined)
			reset = true;

		path = ctrl_path(path);

		// Reset scope
		var key = path.replace(/\.\*$/, '');
		var fn = defaults['#' + W.HASH(key)];
		var tmp;

		if (fn) {
			tmp = fn();
			set(key, tmp);
			emitwildcard(key, tmp, 3);
		}

		var arr = [];

		M.each(function(obj) {

			if (obj.disabled)
				return;

			if (obj.state)
				arr.push(obj);

			if (onlyComponent && onlyComponent._id !== obj._id)
				return;

			obj.$default && obj.path && obj.set(obj.path, obj.$default(), 3);

			if (!reset)
				return;

			findcontrol(obj.element.get(0), function(t) {
				if (t.$com !== obj)
					t.$com = obj;
				t.$value = t.$value2 = undefined;
			});

			if (!obj.$dirty_disabled)
				obj.$dirty = true;

			if (!obj.$valid_disabled) {
				obj.$valid = true;
				obj.$validate = false;
				if (obj.validate) {
					obj.$valid = obj.validate(obj.get());
					obj.$interaction(102);
				}
			}

		}, path);

		emit('default', path);

		if (!reset)
			return M;

		clear('valid', 'dirty');
		state(arr, 3, 3);
		emit('reset', path);
		return M;
	};

	W.RESET = M.reset = function(path, timeout, onlyComponent) {

		if (timeout > 0) {
			setTimeout(function() {
				M.reset(path);
			}, timeout);
			return M;
		}

		var arr = [];
		path = ctrl_path(path);

		M.each(function(obj) {

			if (obj.disabled)
				return;

			obj.state && arr.push(obj);

			if (onlyComponent && onlyComponent._id !== obj._id)
				return;

			findcontrol(obj.element.get(0), function(t) {
				if (t.$com !== obj)
					t.$com = obj;
				t.$value2 = t.$value = undefined;
			});

			if (!obj.$dirty_disabled) {
				obj.$dirty = true;
				obj.$interaction(101);
			}

			if (!obj.$valid_disabled) {
				obj.$valid = true;
				obj.$validate = false;
				if (obj.validate) {
					obj.$valid = obj.validate(obj.get());
					obj.$interaction(102);
				}
			}

		}, path);

		clear('valid', 'dirty');
		state(arr, 1, 3);
		emit('reset', path);
		return M;
	};

	M.findByPath = function(path, callback) {

		var tp = typeof(path);
		if (tp === 'function' || tp === 'boolean') {
			callback = path;
			path = undefined;
		}

		var tc = typeof(callback);
		var isCallback = tc === 'function';
		var isMany = tc === 'boolean';

		var com;

		if (isMany) {
			callback = undefined;
			com = [];
		}

		M.each(function(component) {

			if (isCallback)
				return callback(component);

			if (!isMany) {
				com = component;
				return true; // stop
			}

			com.push(component);
		}, ctrl_path(path));

		return isCallback ? M : com;
	};

	M.findByName = function(name, path, callback) {
		return M.findByProperty('name', name, path, callback);
	};

	M.findById = function(id, path, callback) {
		return M.findByProperty('id', id, path, callback);
	};

	M.findByProperty = function(prop, value, path, callback) {

		var tp = typeof(path);
		if (tp === 'function' || tp === 'boolean') {
			callback = path;
			path = undefined;
		}

		var tc = typeof(callback);
		var isCallback = tc === 'function';
		var isMany = tc === 'boolean';

		var com;

		if (isMany) {
			callback = undefined;
			com = [];
		}

		M.each(function(component) {

			if (component[prop] !== value)
				return;

			if (isCallback)
				return callback(component);

			if (!isMany) {
				com = component;
				return true; // stop
			}

			com.push(component);
		}, ctrl_path(path));

		return isCallback ? M : com;
	};

	M.each = function(fn, path, watch, fix) {

		var isAsterix = path ? path.lastIndexOf('*') !== -1 : false;
		if (isAsterix)
			path = path.replace('.*', '');
		var $path;

		if (!path)
			$path = [];
		else
			$path = path.split('.');

		var index = 0;
		var is = path ? path.indexOf('[') !== -1 : false;

		for (var i = 0, length = M.components.length; i < length; i++) {
			var component = M.components[i];

			if (!component || !component.$loaded || component.$removed || (fix && component.path !== path))
				continue;

			if (path) {
				if (!component.path)
					continue;
				if (isAsterix) {
					var a = compare($path, component.$$path, 0, path, component.path, is);
					if (!a)
						continue;
				} else {
					if (path !== component.path) {
						if (watch) {
							var a = compare($path, component.$$path, 2, path, component.path || '', is);
							if (!a)
								continue;
						} else
							continue;
					}
				}
			}

			var stop = fn(component, index++, isAsterix);
			if (stop === true)
				return M;
		}
		return M;
	};

	W.TEMPLATE = function(url, callback, prepare) {

		if (statics[url]) {
			if (typeof(callback) === 'string')
				SET(callback, statics[url]);
			else
				callback(statics[url]);
			return M;
		}

		M.AJAX('GET ' + url, function(response, err) {

			if (err)
				response = '';

			var value = statics[url] = prepare ? prepare(response) : response;
			if (typeof(callback) === 'string')
				SET(callback, value);
			else
				callback(value);
		});
		return M;
	};

	// ===============================================================
	// CONTROLLERS FUNCTIONS
	// ===============================================================

	L.emit = function(a, b, c, d, e) {
		Object.keys(M.controllers).forEach(function(key) {
			var c = M.controllers[key];
			c.emit.call(c, a, b, c, d, e);
		});
		return L;
	};

	L.remove = function(name) {
		Object.keys(M.controllers).forEach(function(key) {
			if (!name || key === name)
				M.controllers[key].remove();
		});
		return L;
	};

	// ===============================================================
	// APPS FUNCTIONS
	// ===============================================================

	A.emit = function(a, b, c, d, e) {
		for (var i = 0, length = M.apps.length; i < length; i++)
			M.apps[i].emit.call(M.apps[i], a, b, c, d, e);
		return A;
	};

	A.remove = function(element, noremove) {

		if (element === true) {
			noremove = true;
			element = null;
		}

		if (!element)
			element = $(document.body);

		element.find('[data-ja]').each(function() {
			this.$app && this.$app.remove(noremove);
		});

		return A;
	};

	A.import = function(url, callback) {
		var index = url.indexOf(' ');
		if (index === -1 || index > 5)
			url = 'GET ' + url;
		M.AJAX(url, function(response) {
			var is = response ? compileapp(response) : false;
			callback && callback(is ? null : new Error('Invalid jComponent application.'));
		});
		return A;
	};

	A.compile = function(body) {
		return compileapp(body);
	};

	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================

	function mediaquery() {

		if (!mediaqueries || !mediaqueries.length)
			return;

		var orientation = W.orientation ? Math.abs(W.orientation) === 90 ? 'landscape' : 'portrait' : '';

		var $w = $(W);
		var w = $w.width();
		var h = $w.height();
		var d = M.defaults.devices;

		for (var i = 0, length = mediaqueries.length; i < length; i++) {
			var mq = mediaqueries[i];
			var cw = w;
			var ch = h;

			if (mq.element) {
				cw = mq.element.width();
				ch = mq.element.height();
			}

			if (mq.orientation) {
				if (!orientation && mq.orientation !== 'portrait')
					continue;
				else if (orientation !== mq.orientation)
					continue;
			}

			if (mq.minW && mq.minW >= cw)
				continue;
			if (mq.maxW && mq.maxW <= cw)
				continue;
			if (mq.minH && mq.minH >= ch)
				continue;
			if (mq.maxH && mq.maxH <= ch)
				continue;

			if (mq.oldW === cw && mq.oldH !== ch) {
				// changed height
				if (!mq.maxH && !mq.minH)
					continue;
			}

			if (mq.oldH === ch && mq.oldW !== cw) {
				// changed width
				if (!mq.maxW && !mq.minW)
					continue;
			}

			if (mq.oldW === cw && mq.oldH === ch)
				continue;

			var type;

			if (cw >= d.md.min && cw <= d.md.max)
				type = 'md';
			else if (cw >= d.sm.min && cw <= d.sm.max)
				type = 'sm';
			else if (cw > d.lg.min)
				type = 'lg';
			else if (cw <= d.xs.max)
				type = 'xs';

			mq.oldW = cw;
			mq.oldH = ch;
			mq.fn(cw, ch, type, mq.id);
		}
	}

	function middleware(path, value, type, callback) {

		var index = path.indexOf(' #');
		if (index === -1) {
			callback(path, value);
			return;
		}

		var a = path.substring(0, index);

		if (value === undefined)
			value = get(a);

		W.MIDDLEWARE(path.substring(index + 1).trim().replace(/#/g, '').split(' '), value, function(value) {
			callback(a, value);
		}, a);
	}

	function keypress(self, old, e) {

		if (self.value === old)
			return;

		if (self.value !== self.$value2) {
			var dirty = false;
			var code = e.keyCode || e.which;
			if (code !== 9) {
				if (self.$com.$dirty)
					dirty = true;
				self.$com.dirty(false, true);
			}

			var v = self.$com.getter(self.value, 2, dirty, old, e.type === 'focusout' || code === 13 || code === 8);
			if (self.nodeName === 'INPUT' || self.nodeName === 'TEXTAREA') {
				var val = self.$com.formatter(v);
				if (self.value !== val) {
					var pos = getcursor(self);
					self.value = val;
					setcursor(self, pos);
				}
			}
			self.$value2 = self.value;
		}

		setTimeout2('$jckp' + self.$com.id, function() {
			self.$value2 = self.$value = undefined;
		}, 60000 * 5);
	}

	function setcursor(el, pos) {
		if (el.createTextRange) {
			var range = el.createTextRange();
			range.move('character', pos);
			range.select();
			return true;
		} else if (el.selectionStart || !el.selectionStart) {
			el.focus();
			el.setSelectionRange(pos, pos);
			return true;
		}
	}

	function getcursor(el) {
		if (document.selection) {
			var sel = document.selection.createRange();
			sel.moveStart('character', -el.value.length);
			return sel.text.length;
		} else if (el.selectionStart || !el.selectionStart)
			return el.selectionStart;
		return 0;
	}

	function compare(a, b, type, ak, bk, isarray) {

		// type 0 === wildcard
		// type 1 === fix path
		// type 2 === in path

		var key = type + '=' + ak + '=' + bk;
		var r = temp[key];
		if (r !== undefined)
			return r;

		if (type === 0) {
			for (var i = 0, length = a.length; i < length; i++) {
				if (b[i] === undefined)
					continue;
				if (isarray) {
					if (a[i] !== b[i].raw) {
						temp[key] = false;
						return false;
					}
				} else {
					if (a[i] !== b[i].path) {
						temp[key] = false;
						return false;
					}
				}
			}

			temp[key] = true;
			return true;
		}

		if (type === 1) {
			if (a.length !== b.length)
				return false;
			for (var i = 0, length = b.length; i < length; i++) {
				if (a[i] !== b[i].raw) {
					temp[key] = false;
					return false;
				}
			}
			temp[key] = true;
			return true;
		}

		if (type === 2) {
			for (var i = 0, length = a.length; i < length; i++) {
				if (b[i] === undefined)
					continue;
				if (a[i] !== b[i].raw) {
					temp[key] = false;
					return false;
				}
			}
			temp[key] = true;
			return true;
		}
	}

	function attrcom(el, name) {
		name = name ? '-' + name : '';
		return el.getAttribute ? el.getAttribute('data-jc' + name) : el.attrd('jc' + name);
	}

	function attrapp(el, name) {
		name = name ? '-' + name : '';
		return el.getAttribute ? el.getAttribute('data-ja' + name) : el.attrd('ja' + name);
	}

	function crawler(container, onComponent, onApp, level, controller) {

		if (container)
			container = $(container).get(0);
		else
			container = document.body;

		if (!container)
			return;

		var name = attrapp(container);
		!container.$app && name != null && onApp(name, container, 0);

		var tmp = attrcom(container, 'controller');
		if (tmp)
			controller = tmp;

		name = attrcom(container);
		!container.$com && name != null && onComponent(name, container, 0, controller);

		var arr = container.childNodes;
		var sub = [];

		if (level === undefined)
			level = 0;
		else
			level++;

		for (var i = 0, length = arr.length; i < length; i++) {
			var el = arr[i];
			if (el) {

				if (!el.tagName)
					continue;

				el.childNodes.length && el.tagName !== 'SCRIPT' && REGCOM.test(el.innerHTML) && sub.push(el);

				if (el.$app === undefined) {
					name = attrapp(el);
					name != null && onApp(name || '', el, level);
				}

				if (el.$com === undefined) {
					name = attrcom(el);
					name != null && onComponent(name || '', el, level, controller);
				}
			}
		}

		for (var i = 0, length = sub.length; i < length; i++) {
			el = sub[i];
			el && crawler(el, onComponent, onApp, level, controller);
		}
	}

	function findcontrol(container, onElement, level) {

		var arr = container.childNodes;
		var sub = [];

		ACTRLS[container.tagName] && onElement(container);

		if (level == null)
			level = 0;
		else
			level++;

		for (var i = 0, length = arr.length; i < length; i++) {
			var el = arr[i];
			if (el) {
				if (!el.tagName)
					continue;
				el.childNodes.length && el.tagName !== 'SCRIPT' && el.getAttribute('data-jc') == null && sub.push(el);
				if (ACTRLS[el.tagName] && el.getAttribute('data-jc-bind') != null && onElement(el) === false)
					return;
			}
		}

		for (var i = 0, length = sub.length; i < length; i++) {
			el = sub[i];
			if (el && findcontrol(el, onElement, level) === false)
				return;
		}
	}

	function compileapp(html) {

		var beg = -1;
		var end = -1;

		var body_script = '';
		var body_style = '';
		var app = {};

		while (true) {
			beg = html.indexOf('<script', end);
			if (beg === -1)
				break;

			end = html.indexOf('</script>', beg);
			if (end === -1)
				break;

			var body = html.substring(beg, end);
			var beg = body.indexOf('>') + 1;
			var type = body.substring(0, beg);
			body = body.substring(beg).trim();

			if (type.indexOf('markdown') !== -1)
				app.readme = body;
			else if (type.indexOf('html') !== -1) {
				if (type.indexOf('settings') !== -1)
					app.settings = body;
				else if (type.indexOf('body') !== -1 || type.endsWith('"text/html">'))
					app.html = body;
			} else
				body_script = body;

			end += 9;
		}

		if (!body)
			return false;

		beg = html.indexOf('<style');
		if (beg !== -1)
			body_style = html.substring(html.indexOf('>', beg) + 1, html.indexOf('</style>')).trim();

		try {
			new Function('exports', body_script)(app);
		} catch(e) {
			warn('A problem with compiling application: {0}.' + e.toString());
		}

		M.emit('app.compile', app);

		if (!app.name || !app.install)
			return false;

		var name = app.name;

		if (body_style) {
			$('#appcss_' + app.name).remove();
			$('<style type="text/css" id="appcss_{0}">'.format(app.name) + body_style + '</style>').appendTo('head');
		}

		if (M.$apps[name]) {
			var tmp = M.$apps[name];

			try {
				tmp.uninstall && tmp.uninstall(true);
			} catch (e) {
				warn('A problem with uninstalling application "{0}": {1}.'.foramt(name, e.toString()));
			}

			M.$apps[name] = app;

			var apps = M.apps.slice(0);
			apps.waitFor(function(item, next) {
				item.name === name && item.remove(true);
				next();
			});

		} else
			M.$apps[name] = app;

		return true;
	}

	function load() {
		clearTimeout($ready);
		if (M.defaults.localstorage) {
			var cache;
			try {
				cache = localStorage.getItem(M.$localstorage + '.cache');
				if (cache && typeof(cache) === 'string')
					storage = PARSE(cache);
			} catch (e) {}
			try {
				cache = localStorage.getItem(M.$localstorage + '.blocked');
				if (cache && typeof(cache) === 'string')
					blocked = PARSE(cache);
			} catch (e) {}
		}

		if (storage) {
			var obj = storage['$jcpath'];
			obj && Object.keys(obj.value).forEach(function(key) {
				M.set(key, obj.value[key], true);
			});
		}

		W.jQuery && setTimeout(compile, 2);
		M.loaded = true;
	}

	function dependencies(declaration, callback, obj, el) {

		if (declaration.importing) {
			WAIT(function() {
				return declaration.importing;
			}, function() {
				callback(obj, el);
			});
			return;
		}

		if (!declaration.dependencies || !declaration.dependencies.length) {
			callback(obj, el);
			return;
		}

		declaration.importing = true;
		declaration.dependencies.wait(function(item, next) {
			IMPORT(item, next);
		}, function() {
			declaration.importing = false;
			callback(obj, el);
		});
	}

	function compile(container) {

		// jComponent APP
		if (typeof(container) === 'string') {
			compileapp(container);
			return;
		}

		if (C.is) {
			C.recompile = true;
			return;
		}

		var arr = [];

		W.READY && arr.push.apply(arr, W.READY);
		W.jComponent && arr.push.apply(arr, W.jComponent);
		W.components && arr.push.apply(arr, W.components);

		if (arr.length) {
			while (true) {
				var fn = arr.shift();
				if (!fn)
					break;
				fn();
			}
		}

		C.is = true;
		download();

		if (C.pending.length) {
			(function(container) {
				C.pending.push(function() {
					compile(container);
				});
			})(container);
			return;
		}

		var has = false;

		crawler(container, function(name, dom, level, controller) {

			var el = $(dom);
			has = true;

			// Check singleton instance
			if (statics['$ST_' + name]) {
				remove(el);
				return;
			}

			var instances = [];
			var all = name.split(',');
			var scope = el.closest(ATTRSCOPE);

			all.forEach(function(name) {

				name = name.trim();

				var com = M.$components[name || ''];
				if (!com) {

					var x = attrcom(el, 'import');
					if (!x) {
						!statics['$NE_' + name] && (statics['$NE_' + name] = true);
						return;
					}

					if (C.imports[x] === 1)
						return;

					if (C.imports[x] === 2) {
						!statics['$NE_' + name] && (statics['$NE_' + name] = true);
						return;
					}

					C.imports[x] = 1;
					M.import(x, function() {
						C.imports[x] = 2;
					});

					return;
				}

				var obj = new COM(com.name);
				obj.global = com.shared;
				obj.element = el;
				obj.setPath(attrcom(el, 'path') || obj._id, 1);
				obj.config = {};

				// Default config
				com.config && obj.reconfigure(com.config, NOOP);

				var tmp = attrcom(el, 'config');
				tmp && obj.reconfigure(tmp, NOOP);
				com.declaration.call(obj, obj, obj.config);

				if (obj.init && !statics[name]) {
					statics[name] = true;
					obj.init();
				}

				obj.$init = attrcom(el, 'init') || null;
				obj.type = attrcom(el, 'type') || '';
				obj.id = attrcom(el, 'id') || obj._id;
				obj.siblings = all.length > 1;

				dom.$com = obj;

				if (!obj.$noscope)
					obj.$noscope = attrcom(el, 'noscope') === 'true';

				var code = obj.path ? obj.path.charCodeAt(0) : 0;
				if (!obj.$noscope && scope.length) {

					var output = initscopes(scope);

					if (obj.path && code !== 33 && code !== 35)
						obj.setPath(obj.path === '?' ? output.path : (obj.path.indexOf('?') === -1 ? output.path + '.' + obj.path : obj.path.replace(/\?/g, output.path)), 2);
					else {
						obj.$$path = EMPTYARRAY;
						obj.path = '';
					}

					obj.scope = output.elements;
					obj.$controller = attrcom(scope, 'controller') || controller;
					obj.pathscope = output.path;
				}

				if (!obj.$controller)
					obj.$controller = attrcom(el, 'controller') || controller;

				instances.push(obj);

				var template = attrcom(el, 'template') || obj.template;
				if (template)
					obj.template = template;

				if (attrcom(el, 'released') === 'true')
					obj.$released = true;

				if (attrcom(el, 'url'))
					return warn('Components: You have to use "data-jc-template" attribute instead of "data-jc-url" for the component: {0}[{1}].'.format(obj.name, obj.path));

				if (typeof(template) === 'string') {
					var fn = function(data) {
						if (obj.prerender)
							data = obj.prerender(data);
						dependencies(com, function(obj, el) {
							typeof(obj.make) === 'function' && obj.make(data);
							init(el, obj);
						}, obj, el);
					};

					var c = template.substring(0, 1);
					if (c === '.' || c === '#' || c === '[') {
						fn($(template).html());
						return;
					}

					var k = 'TE' + W.HASH(template);
					var a = statics[k];
					if (a)
						return fn(a);

					$.get(makeurl(template), function(response) {
						statics[k] = response;
						fn(response);
					});
					return;
				}

				if (typeof(obj.make) === 'string') {

					if (obj.make.indexOf('<') !== -1) {
						dependencies(com, function(obj, el) {
							if (obj.prerender)
								obj.make = obj.prerender(obj.make);
							el.html(obj.make);
							init(el, obj);
						}, obj, el);
						return;
					}

					$.get(makeurl(obj.make), function(data) {
						dependencies(com, function(obj, el) {
							if (obj.prerender)
								data = obj.prerender(data);
							el.html(data);
							init(el, obj);
						}, obj, el);
					});

					return;
				}

				if (com.dependencies) {
					dependencies(com, function(obj, el) {
						obj.make && obj.make();
						init(el, obj);
					}, obj, el);
				} else {
					obj.make && obj.make();
					init(el, obj);
				}
			});

			// A reference to instance
			el.data(ATTRDATA, instances.length > 1 ? instances : instances[0]);

		}, function(name, dom) {
			var d = M.$apps[name];
			if (d) {
				var id = attrapp(dom, 'id');
				if (id)
					appdependencies(d, id, dom);
				else
					warn('Apps: The application "{0}" doesn\'t contain "data-ja-id" attribute.'.format(name));
			}
		}, undefined);

		if (!has || !C.pending.length)
			C.is = false;

		if (container !== undefined || !toggles.length)
			return nextpending();

		async(toggles, function(item, next) {
			for (var i = 0, length = item.toggle.length; i < length; i++)
				item.element.tclass(item.toggle[i]);
			next();
		}, nextpending);
	}

	function initscopes(scope) {

		if (scope[0].$scopedata)
			return scope[0].$scopedata;

		var path = attrcom(scope, 'scope');
		var independent = path.substring(0, 1) === '!';

		if (independent)
			path = path.substring(1);

		var arr = [scope];

		if (!independent) {
			var index = 0;
			var parent = scope;
			while (true) {
				index++;
				if (index > 2)
					break;
				parent = parent.parent().closest(ATTRSCOPE);
				if (!parent.length)
					break;
				arr.push(parent);
			}
		}

		var absolute = '';

		arr.length && arr.reverse();

		for (var i = 0, length = arr.length; i < length; i++) {

			var sc = arr[i][0];
			var p = sc.$scope || attrcom(sc, 'scope');

			sc.$initialized = true;

			if (sc.$processed) {
				if (sc.$independent)
					absolute = p;
				else
					absolute += (absolute ? '.' : '') + p;
				continue;
			}

			sc.$processed = true;
			sc.$independent = p.substring(0, 1) === '!';

			if (sc.$independent)
				p = p.substring(1);

			if (!p || p === '?')
				p = GUID(25).replace(/\d/g, '');

			if (sc.$independent)
				absolute = p;
			else
				absolute += (absolute ? '.' : '') + p;

			sc.$scope = absolute;
			sc.$scopedata = { path: absolute, elements: arr.slice(0, i + 1) };

			var tmp = attrcom(sc, 'value');
			if (tmp) {
				var fn = new Function('return ' + tmp);
				defaults['#' + W.HASH(p)] = fn; // store by path (DEFAULT() --> can reset scope object)
				tmp = fn();
				set(p, tmp);
				emitwildcard(p, tmp, 1);
			}

			tmp = attrcom(sc, 'init');
			tmp && W.EXEC(tmp, p, $(sc));
		}

		return scope[0].$scopedata;
	}

	function appdependencies(d, id, dom) {

		$(dom).data(ATTRDATA, EMPTYOBJECT);

		if (d.$pending === 1) {
			WAIT(function() {
				return d.$pending === false;
			}, function() {
				appcreate(d, id, dom);
			});
			return;
		}

		if (d.$pending === undefined && d.dependencies && d.dependencies.length) {
			d.$pending = 1;
			d.dependencies.waitFor(function(item, next) {
				M.import('ONCE ' + item, next);
			}, function() {
				d.$pending = 2;
				appcreate(d, id, dom);
			});
		} else
			appcreate(d, id, dom);
	}

	function appcreate(d, id, dom) {
		var el = $(dom);
		var key = id ? ('app.' + d.name + '.' + id + '.options') : null;
		d.html && el.empty().append(d.html);
		id = 'app' + W.HASH(id);

		var initd = el.attrd('ja-path');
		if (initd)
			initd = get(initd);
		else
			initd = undefined;

		var app = new APP(id, el, d, key, initd);
		app.$cache = key;
		dom.$app = app;
		el.data(ATTRDATA, app);
		M.apps.push(app);
		M.emit('app', app, d, initd);
		REGCOM.test(d.html) && compile(el);
		var cls = attrapp(el, 'class');
		if (cls) {
			toggles.push({ toggle: cls.split(' '), element: el });
			el.removeAttr('data-ja-class');
		}
	}

	W.LOG = function() {
		window.console && console.log.apply(console, arguments);
	};

	W.WARN = function() {
		window.console && console.warn.apply(console, arguments);
	};

	function warn() {
		W.console && W.console.warn.apply(W.console, arguments);
	}

	function download() {

		var arr = [];
		var count = 0;

		$(ATTRURL).each(function() {

			var el = $(this);

			if (el.data(ATTRDATA))
				return;

			el.data(ATTRDATA, '1');

			var app = attrapp(el, 'url');
			var url = app ? app : attrcom(el, 'url');

			// Unique
			var once = url.substring(0, 5).toLowerCase() === 'once ';
			if (url.substring(0, 1) === '!' || once) {
				if (once)
					url = url.substring(5);
				else
					url = url.substring(1);
				if (statics[url])
					return;
				statics[url] = 2;
			}

			var item = {};
			item.url = url;
			item.element = el;
			item.callback = app ? null : attrcom(el, 'init');
			item.path = app ? null : attrcom(el, 'path');
			item.toggle = app ? null : (attrcom(el, 'class') || '').split(' ');
			item.expire = ((app ? attrapp(el, 'cache') : attrcom(el, 'cache')) || M.defaults.importcache);
			item.app = app ? true : false;
			arr.push(item);
		});

		if (!arr.length)
			return;

		var canCompile = false;

		async(arr, function(item, next) {

			var key = makeurl(item.url);
			var can = false;

			M.AJAXCACHE('GET ' + item.url, null, function(response) {

				if (item.app) {
					compileapp(response);
					canCompile = true;
					count++;
					return next();
				}

				key = '$import' + key;

				if (statics[key])
					response = removescripts(response);
				else
					response = importscripts(importstyles(response));

				can = response && REGCOM.test(response);

				if (can || item.app)
					canCompile = true;

				item.element.html(response);
				statics[key] = true;
				item.toggle.length && item.toggle[0] && toggles.push(item);

				if (item.callback && !attrcom(item.element)) {
					var callback = get(item.callback);
					typeof(callback) === 'function' && callback(item.element);
				}

				count++;
				next();

			}, item.expire);

		}, function() {
			clear('valid', 'dirty', 'find');
			count && canCompile && compile();
		});
	}

	function remove(el) {
		var dom = el.get(0);
		dom.$com = null;
		dom.$app = null;
		el.attr(ATTRDEL, true);
		el.attrd('ja-removed', true);
		el.remove();
	}

	function cacherest(method, url, params, value, expire) {

		if (params && !params.version && M.$version)
			params.version = M.$version;

		if (params && !params.language && M.$language)
			params.language = M.$language;

		params = STRINGIFY(params);
		var key = W.HASH(method + '#' + url.replace(/\//g, '') + params).toString();
		return cachestorage(key, value, expire);
	}

	function cachestorage(key, value, expire) {

		var now = Date.now();

		if (value !== undefined) {

			if (expire === 'session') {
				cache['$session' + key] = value;
				return value;
			}

			if (typeof(expire) === 'string')
				expire = expire.parseExpire();

			storage[key] = { expire: now + expire, value: value };
			save();
			return value;
		}

		var item = cache['$session' + key];
		if (item)
			return item;

		item = storage[key];
		if (item && item.expire > now)
			return item.value;
	}

	function makeurl(url) {
		var index = url.indexOf('?');
		var builder = [];

		M.$version && builder.push('version=' + encodeURIComponent(M.$version));
		M.$language && builder.push('language=' + encodeURIComponent(M.$language));

		if (!builder.length)
			return url;

		if (index !== -1)
			url += '&';
		else
			url += '?';

		return url + builder.join('&');
	}

	function init(el, obj) {

		var dom = el.get(0);
		var type = dom.tagName;
		var collection;

		// autobind
		if (ACTRLS[type]) {
			obj.$input = true;
			collection = obj.element;
		} else
			collection = el;

		findcontrol(collection.get(0), function(el) {
			!el.$com && (el.$com = obj);
		});

		obj.released && obj.released(obj.$released);
		M.components.push(obj);
		C.init.push(obj);
		type !== 'BODY' && REGCOM.test(el.get(0).innerHTML) && compile(el);
		ready();
	}

	function initialize() {
		var item = C.init.pop();
		if (item === undefined)
			!C.ready && compile();
		else {
			!item.$removed && prepare(item);
			initialize();
		}
	}

	function prepare(obj) {

		if (!obj)
			return;

		var value = obj.get();
		var el = obj.element;
		var tmp;

		extensions[obj.name] && extensions[obj.name].forEach(function(item) {
			item.config && obj.reconfigure(item.config, NOOP);
			item.fn.call(obj, obj);
		});

		obj.configure && obj.reconfigure(obj.config, undefined, true);
		obj.$loaded = true;

		if (obj.setter) {
			if (!obj.$prepared) {

				obj.$prepared = true;
				obj.$ready = true;

				tmp = attrcom(obj, 'value');

				if (tmp) {
					if (!defaults[tmp])
						defaults[tmp] = new Function('return ' + tmp);
					obj.$default = defaults[tmp];
					if (value === undefined) {
						value = obj.$default();
						set(obj.path, value);
						emitwildcard(obj.path, value, 0);
					}
				}

				if (obj.$binded)
					obj.$interaction(0);
				else {
					obj.$binded = true;
					middleware(obj.path + obj.middleware, value, 1, function(path, value) {
						obj.setter(value, obj.path, 0);
						obj.$interaction(0);
					});
				}
			}
		}

		if (obj.validate && !obj.$valid_disabled)
			obj.$valid = obj.validate(obj.get(), true);

		obj.done && setTimeout(function() {
			obj.done();
		}, 20);

		obj.state && obj.state(0, 3);

		obj.$init && setTimeout(function() {
			if (isOperation(obj.$init)) {
				var op = OPERATION(obj.$init);
				op && op.call(obj, obj);
				obj.$init = undefined;
				return;
			}
			var fn = get(obj.$init);
			typeof(fn) === 'function' && fn.call(obj, obj);
			obj.$init = undefined;
		}, 5);

		el.trigger('component');
		el.off('component');

		var cls = attrcom(el, 'class');
		cls && (function(cls) {
			setTimeout(function() {
				cls = cls.split(' ');
				var tmp = el.get(0).$jclass || {};
				for (var i = 0, length = cls.length; i < length; i++) {
					if (!tmp[cls[i]]) {
						el.tclass(cls[i]);
						tmp[cls[i]] = true;
					}
				}
				el.get(0).$jclass = tmp;
			}, 5);
		})(cls);

		obj.id && M.emit('#' + obj.id, obj);
		M.emit('@' + obj.name, obj);
		M.emit('component', obj);
	}

	function async(arr, fn, done) {
		var item = arr.shift();
		if (item == null)
			return done && done();
		fn(item, function() {
			async(arr, fn, done);
		});
	}

	function nextpending() {
		var next = C.pending.shift();
		if (next)
			next();
		else if (C.ready)
			C.is = false;
	}

	function isOperation(name) {
		return name.charCodeAt(0) === 35;
	}

	function isArray(path) {
		var index = path.lastIndexOf('[');
		if (index === -1)
			return false;
		path = path.substring(index + 1, path.length - 1).substring(0, 1);
		return !(path === '"' || path === '\'');
	}

	function emit2(name, path, args) {

		var e = events[path];
		if (!e)
			return false;

		e = e[name];
		if (!e)
			return false;

		for (var i = 0, length = e.length; i < length; i++) {
			var ev = e[i];
			(!ev.path || ev.path === path) && ev.fn.apply(ev.context, args);
		}

		return true;
	}

	function emitwildcard(path, value, type) {
		tmp_emit2[0] = path;
		tmp_emit2[1] = value;
		tmp_emit2[2] = type;
		emit2('watch', '*', tmp_emit2);
	}

	function emitonly(name, paths, type, path) {

		var unique = {};
		var keys = Object.keys(paths);

		for (var a = 0, al = keys.length; a < al; a++) {
			var arr = keys[a].split('.');
			var p = '';
			for (var b = 0, bl = arr.length; b < bl; b++) {
				p += (p ? '.' : '') + arr[b];
				unique[p] = paths[p];
			}
		}

		emitwildcard(path, unique[path], type);

		Object.keys(unique).forEach(function(key) {
			tmp_emit2[1] = unique[key];
			emit2(name, key, tmp_emit2);
		});
	}

	function emit(name, path) {

		if (!path)
			return;

		var arr = path.split('.');
		var args = [];
		var is = name === 'watch';
		var length = is ? 3 : arguments.length;

		for (var i = is ? 1 : 2; i < length; i++)
			args.push(arguments[i]);

		if (is)
			args.push(arguments[3]);

		if (is) {
			tmp_emit2[0] = path;
			tmp_emit2[1] = get(path);
			tmp_emit2[2] = arguments[3];
			emit2(name, '*', tmp_emit2);
		}

		var p = '';
		for (var i = 0, length = arr.length; i < length; i++) {

			var k = arr[i];
			var a = arr[i];

			if (k === '*')
				continue;

			if (a.substring(a.length - 1, a.length) === ']') {
				var beg = a.lastIndexOf('[');
				a = a.substring(0, beg);
			}

			p += (i ? '.' : '');

			args[1] = get(p + k);
			emit2(name, p + k, args);
			k !== a && emit2(name, p + a, args);
			p += k;
		}

		return true;
	}

	function ready() {

		setTimeout2('$ready', function() {
			mediaquery();

			refresh();
			initialize();

			var count = M.components.length;
			$(document).trigger('components', [count]);

			if (!$loaded) {
				$loaded = true;
				clear('valid', 'dirty', 'find');
				M.emit('init');
				M.emit('ready');
			}

			setTimeout2('$initcleaner', function() {
				cleaner();
				autofill.splice(0).forEach(function(component) {
					findcontrol(component.element.get(0), function(el) {
						var val = $(el).val();
						if (val) {
							var tmp = component.parser(val);
							if (tmp) {
								component.set(tmp);
								emitwildcard(component.path, tmp, 3);
							}
						}
						return true;
					});
				});
			}, 1000);

			C.is = false;

			$(ATTRSCOPECTRL).each(function() {

				var t = this;
				var controller = attrcom(t, 'controller');

				// Does this element contain jComponent?
				// If yes, skip
				if (attrcom(t))
					return;

				if (controller) {
					if (t.$ready)
						return;
				} else if (!t.$initialized || t.$ready)
					return;

				var scope = $(t);
				t.$ready = true;

				// Applies classes
				var cls = attrcom(scope, 'class');
				if (cls) {
					(function(cls) {
						cls = cls.split(' ');
						setTimeout(function() {
							for (var i = 0, length = cls.length; i < length; i++)
								scope.tclass(cls[i]);
						}, 5);
					})(cls);
				}

				if (controller) {
					var ctrl = CONTROLLER(controller);
					if (ctrl)
						ctrl.$init(t.$scope, scope);
					else {
						!warnings[controller] && warn('Components: The controller "{0}" not found.'.format(controller));
						warnings[controller] = true;
					}
				}

				var path = attrcom(t, 'init');
				if (!path)
					return;

				if (isOperation(path)) {
					var op = OPERATION(path);
					if (op)
						op.call(scope, t.$scope, scope);
					else {
						!warnings[path] && warn('Components: The operation {0} not found.'.format(path));
						warnings[path] = true;
					}
				} else {
					var fn = get(path);
					typeof(fn) === 'function' && fn.call(scope, t.$scope, scope);
				}
			});

			if (C.recompile) {
				C.recompile = false;
				compile();
			}

			if (C.ready) {
				var arr = C.ready;
				for (var i = 0, length = arr.length; i < length; i++)
					arr[i](count);
				C.ready = undefined;
			}

		}, 100);
	}

	function removescripts(str) {
		return str.replace(REGSCRIPT, function(text) {
			var index = text.indexOf('>');
			var scr = text.substring(0, index + 1);
			return scr.substring(0, 6) === '<style' || (scr.substring(0, 7) === '<script' && scr.indexOf('type="') === -1) || scr.indexOf('/javascript"') !== -1 ? '' : text;
		});
	}

	function importscripts(str, id) {

		var beg = -1;
		var output = str;
		var builder = [];
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

			output = output.replace(code, '').trim();

			var tmp = code.substring(end + 1, code.length - 9).trim();
			if (tmp)
				builder.push(tmp);
			else {
				var eid = 'external' + W.HASH(code);
				if (!statics[eid]) {
					external.push(code);
					statics[eid] = true;
				}
			}
		}

		external.length && $('head').append(external.join('\n'));

		if (builder.length) {
			var key = 'js' + (id || '');
			if (id) {
				if (statics[key])
					$('#' + key).remove();
				else
					statics[key] = true;
			}
			scr = document.createElement('script');
			scr.type = 'text/javascript';
			scr.text = builder.join('\n');
			id && (scr.id = key);
			document.body.appendChild(scr);
		}

		return output;
	}

	function importstyles(str, id) {
		var builder = [];

		str = str.replace(REGCSS, function(text) {
			text = text.replace('<style>', '<style type="text/css">');
			builder.push(text.substring(23, text.length - 8).trim());
			return '';
		});

		var key = 'css' + (id || '');

		if (id) {
			if (statics[key])
				$('#' + key).remove();
			else
				statics[key] = true;
		}

		builder.length && $('<style' + (id ? ' id="' + key + '"' : '') + '>{0}</style>'.format(builder.join('\n'))).appendTo('head');
		return str;
	}

	function remap(path, value) {

		var index = path.replace('-->', '->').indexOf('->');

		if (index !== -1) {
			value = value[path.substring(0, index).trim()];
			path = path.substring(index + 3).trim();
		}

		middleware(path, value, 1, function(path, value) {
			M.set(path, value);
		});
	}

	function set(path, value) {

		if (path == null)
			return;

		if (path.charCodeAt(0) === 35) {
			var op = OPERATION(path);
			if (op)
				op(value, path);
			else {
				!warnings[path] && warn('Components: The operation {0} not found.'.format(path));
				warnings[path] = true;
			}
			return;
		}

		var key = '+' + path;

		if (paths[key])
			return paths[key](W, value, path);

		if (path.indexOf('?') !== -1) {
			path = '';
			return;
		}

		var arr = path.split('.');
		var builder = [];
		var p = '';

		for (var i = 0, length = arr.length; i < length; i++) {
			p += (p !== '' ? '.' : '') + arr[i];
			var type = isArray(arr[i]) ? '[]' : '{}';

			if (i !== length - 1) {
				builder.push('if(typeof(w.' + p + ')!=="object"||w.' + p + '===null)w.' + p + '=' + type);
				continue;
			}

			if (type === '{}')
				break;

			p = p.substring(0, p.lastIndexOf('['));
			builder.push('if(!(w.' + p + ' instanceof Array))w.' + p + '=' + type);
			break;
		}

		var fn = (new Function('w', 'a', 'b', builder.join(';') + ';var v=typeof(a)===\'function\'?a(MAIN.compiler.get(b)):a;w.' + path.replace(/'/, '\'') + '=v;return v'));
		paths[key] = fn;
		fn(W, value, path);
		return C;
	}

	function get(path, scope) {

		if (path == null)
			return;

		var code = path.charCodeAt(0);
		if (code === 35) {
			var op = OPERATION(path);
			return op ? op : NOOP;
		} else if (code === 37)
			path = 'jctmp.' + path.substring(1);

		var key = '=' + path;
		if (paths[key])
			return paths[key](scope || W);

		if (path.indexOf('?') !== -1)
			return;

		var arr = path.split('.');
		var builder = [];
		var p = '';

		for (var i = 0, length = arr.length - 1; i < length; i++) {
			var tmp = arr[i];
			var index = tmp.lastIndexOf('[');
			index !== -1 && builder.push('if(!w.' + (p ? p + '.' : '') + tmp.substring(0, index) + ')return');
			p += (p !== '' ? '.' : '') + arr[i];
			builder.push('if(!w.' + p + ')return');
		}

		var fn = (new Function('w', builder.join(';') + ';return w.' + path.replace(/'/, '\'')));
		paths[key] = fn;
		return fn(scope || W);
	}

	C.get = get;

	function clear() {

		if (!arguments.length) {
			cache = {};
			return;
		}

		var arr = Object.keys(cache);

		for (var i = 0, length = arr.length; i < length; i++) {
			var key = arr[i];
			var remove = false;
			var a = arguments;

			for (var j = 0; j < a.length; j++) {
				if (key.substring(0, a[j].length) !== a[j])
					continue;
				remove = true;
				break;
			}

			if (remove)
				delete cache[key];
		}
	}

	function cleaner() {

		var aks = Object.keys(events);
		var is = true;

		for (var a = 0, al = aks.length; a < al; a++) {

			var ak = aks[a];

			if (!events[ak])
				continue;

			var bks = Object.keys(events[ak]);

			for (var b = 0, bl = bks.length; b < bl; b++) {

				var bk = bks[b];
				var arr = events[ak][bk];

				if (!arr)
					continue;

				var index = 0;

				while (true) {

					var item = arr[index++];
					if (item === undefined)
						break;

					if (item.context == null || (item.context.element && item.context.element.closest(document.documentElement).length))
						continue;

					item.context && item.context.element && item.context.element.remove();
					item.context.$removed = true;
					item.context = null;
					events[ak][bk].splice(index - 1, 1);

					if (!events[ak][bk].length) {
						delete events[ak][bk];
						if (!Object.keys(events[ak]).length)
							delete events[ak];
					}

					index -= 2;
					is = true;
				}
			}
		}

		var index = 0;
		var length = M.components.length;

		while (index < length) {

			var component = M.components[index++];
			if (!component) {
				index--;
				M.components.splice(index, 1);
				length = M.components.length;
				continue;
			}

			if (!component.$removed || component.$removed === 2)
				continue;

			if (component.element && component.element.closest(document.documentElement).length) {
				if (!component.attr(ATTRDEL)) {
					if (component.$parser && !component.$parser.length)
						component.$parser = undefined;
					if (component.$formatter && !component.$formatter.length)
						component.$formatter = undefined;
					continue;
				}
			}

			M.emit('destroy', component.name, component);
			M.emit('component.destroy', component.name, component);

			component.destroy && component.destroy();
			component.element.off();
			component.element.find('*').off();
			component.element.remove();
			component.element = null;
			component.$removed = 2;
			component.path = null;
			component.setter = null;
			component.getter = null;
			component.make = null;

			index--;
			M.components.splice(index, 1);
			length = M.components.length;
			is = true;
		}

		var index = 0;
		var length = M.apps.length;

		while (index < length) {
			var app = M.apps[index++];
			if (!app) {
				index--;
				M.apps.splice(index, 1);
				length = M.apps.length;
				continue;
			}

			if (app.element && app.element.closest(document.documentElement).length)
				continue;

			M.emit('app.destroy', app.name, app);

			app.emit('destroy');
			app.destroy && app.destroy();
			app.element.off();
			app.element.find('*').off();
			app.element.remove();
			app.element = null;
			app.$removed = true;
			app.make = null;

			index--;
			M.apps.splice(index, 1);
			length = M.apps.length;
		}

		clear('find');

		W.DATETIME = new Date();
		var now = W.DATETIME.getTime();
		var is2 = false;
		var is3 = false;

		for (var key in blocked) {
			if (blocked[key] > now)
				continue;
			delete blocked[key];
			is2 = true;
		}

		M.defaults.localstorage && is2 && !W.isPRIVATEMODE && localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));

		for (var key in storage) {
			var item = storage[key];
			if (!item.expire || item.expire <= now) {
				delete storage[key];
				is3 = true;
			}
		}

		is3 && save();
		is && refresh();
	}

	function save() {
		!W.isPRIVATEMODE && M.defaults.localstorage && localStorage.setItem(M.$localstorage + '.cache', JSON.stringify(storage));
	}

	function refresh() {
		setTimeout2('$refresh', function() {
			M.components.sort(function(a, b) {
				if (a.$removed || !a.path)
					return 1;
				if (b.$removed || !b.path)
					return -1;
				var al = a.path.length;
				var bl = b.path.length;
				return al > bl ? - 1 : al === bl ? LCOMPARER(a.path, b.path) : 1;
			});
		}, 200);
	}

	// who:
	// 1. valid
	// 2. dirty
	// 3. reset
	// 4. update
	// 5. set
	function state(arr, type, who) {
		if (!arr || !arr.length)
			return;
		setTimeout(function() {
			for (var i = 0, length = arr.length; i < length; i++)
				arr[i].state(type, who);
		}, 2);
	}

	// ===============================================================
	// VIRTUAL DECLARATION
	// ===============================================================

	function CONTAINER(element, mapping, config) {
		var t = this;
		t.element = typeof(element) === 'string' ? $(element.$env()) : element;
		t.mapping = mapping;
		t.config = {};
		config && t.reconfigure(config, NOOP);
		t.refresh();
		setTimeout(function(t) {
			t.configure && t.reconfigure(t.config, undefined, true);
		}, 1, t);
	}

	var PPVC = CONTAINER.prototype;

	PPVC.clone = function(deep) {
		var t = this;
		var c = new CONTAINER(t.element.clone(true), deep ? W.CLONE(t.mapping) : t.mapping, t.config);
		c.configure = t.configure;
		return c;
	};

	PPVC.refresh = function() {

		var self = this;
		var keys = Object.keys(self.mapping);
		for (var i = 0, length = keys.length; i < length; i++) {
			var key = keys[i];

			if (key === 'refresh' || key === 'clone' || key === 'event' || key === 'on' || key === 'emit' || key === 'group') {
				warn('VIRTUALIZE can\'t contain a field called "{0}" in mapping.'.format(key));
				continue;
			}

			var sel = self.mapping[key];
			var backup = false;
			var group = null;

			if (typeof(sel) === 'string') {
				sel = sel.$env();
				backup = (REGBACKUP).test(sel);
				if (backup)
					sel = sel.substring(7);
				group = sel.match(REGGROUP);
				if (group) {
					sel = sel.replace(group, '').trim();
					group = group.toString().replace(/\{|\}/g, '').split(',').trim();
				}
				self.mapping[key] = sel.trim();
			}

			var val = typeof(sel) === 'function' ? sel(self.element) : self.element.find(sel);
			if (self[key])
				self[key].refresh();
			else {
				self[key] = new PROPERTY(self, sel, val instanceof jQuery ? val : $(val), group);
				backup && self[key].backup();
			}
		}
		return self;
	};

	PPVC.backup = function(elements) {
		var t = this;
		if (elements) {
			var keys = Object.keys(t.mapping);
			for (var i = 0, length = keys.length; i < length; i++) {
				var key = keys[i];
				var o = t[key];
				if (o.$backup && (elements === true || (o.group && o.group.indexOf(elements) !== -1)))
					o.backup();
			}
		} else
			t.$backup = t.element.clone(true);
		return t;
	};

	PPVC.restore = function(elements) {
		var t = this;
		if (elements) {
			var keys = Object.keys(t.mapping);
			var count = 0;
			for (var i = 0, length = keys.length; i < length; i++) {
				var key = keys[i];
				var o = t[key];
				if (o.$backup && (elements === true || (o.group && o.group.indexOf(elements) !== -1))) {
					count++;
					o.restore();
				}
			}
			count && t.refresh();
		} else if (t.$backup) {
			var clone = t.$backup.clone(true);
			t.element.replaceWith(clone).remove();
			t.element = clone;
			t.refresh();
		}
		return t;
	};

	function PROPERTY(container, selector, el, group) {
		var t = this;
		t.id = 'v' + GUID(10);
		t.group = group;
		t.container = container;
		t.element = el;
		t.selector = selector;
		t.length = el.length;
		!t.length && t.$refresh();
	}

	var PPP = PROPERTY.prototype;

	PPP.backup = function() {
		var t = this;
		t.$backup = t.element.clone(true);
		return t;
	};

	PPP.restore = function() {
		var t = this;
		if (t.$backup) {
			var clone = t.$backup.clone(true);
			t.element.replaceWith(clone).remove();
			t.element = clone;
		}
		return t;
	};

	PPP.make = function(fn) {
		var self = this;
		if (self.length)
			fn.call(self, self);
		else {
			setTimeout(function(self, fn) {
				self.make(fn);
			}, 200, self, fn);
		}
		return self;
	};

	PPP.refresh = function() {
		var self = this;
		self.element = typeof(self.selector) === 'function' ? self.selector(self.container.element) : self.container.element.find(self.selector);
		self.length = self.element.length;
		return self;
	};

	PPP.replace = function(el) {
		var self = this;
		self.element.replaceWith(el);
		self.element = el;
		return self;
	};

	PPP.$refresh = function() {
		var self = this;
		if (self.length)
			return self;
		setTimeout(function(self) {
			self.refresh();
			self.$refresh();
		}, 200, self);
		return self;
	};

	PPP.click = function(callback) {
		var e = this.element;
		e.off('click touchend');
		e.on('click touchend', callback);
		return this;
	};

	PPP.src = function(url) {
		var self = this;
		self.element.attr('src', url);
		return self;
	};

	PPP.disable = function(v) {
		var self = this;
		if (v === undefined)
			return self.element.prop('disabled');
		self.element.prop('disabled', v);
		return self;
	};

	PPP.prop = function(k, v) {
		var self = this;
		if (v === undefined)
			return self.element.prop(k);
		self.element.prop(k, v);
		return self;
	};

	PPP.val = function(v) {
		var self = this;
		if (v === undefined)
			return self.element.val();
		self.element.val(v);
		return self;
	};

	// ===============================================================
	// CONTROLLER DECLARATION
	// ===============================================================

	function Controller(name) {
		var self = this;
		self.config = {};
		self.$events = {};
		self.scope = '';
		self.name = name;
		self.element = null;
		self.removed = false;
	}

	var PCTRL = Controller.prototype;

	// ===============================================================
	// APPLICATION DECLARATION
	// ===============================================================

	function APP(id, element, declaration, key, data) {
		var self = this;

		self.removed = false;
		self.$events = {};
		self.id = id;
		self.config = {};

		declaration.config && self.reconfigure(declaration.config, NOOP);
		var tmp = attrapp(element, 'config');
		tmp && self.reconfigure(tmp, NOOP);

		self.scope = attrapp(element, 'scope') || attrcom(element, 'scope') || ('app' + GUID(10));
		element.get(0).$scope = self.scope;
		!attrapp(element, 'noscope') && element.attrd('jc-scope', '?');
		self.name = declaration.name;
		self.type = declaration.type;
		self.element = element;
		self.key = key;
		self.declaration = declaration;
		self.$load(function(options) {
			self.options = $.extend(true, CLONE(declaration.options), options || EMPTYOBJECT);
			declaration.install.call(self, self, data);
			self.make && self.make(data);
		});

		self.configure && self.reconfigure(self.config, undefined, true);
	}

	var PPA = APP.prototype;

	PPA.change = function() {
		this.$save();
		return this;
	};

	PPA.emit = PCTRL.emit = function(name) {
		var self = this;
		var e = self.$events[name];
		if (e && e.length) {
			for (var i = 0, length = e.length; i < length; i++)
				e[i].call(self, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		}
		return self;
	};

	PPA.on = PCTRL.on = function(name, fn) {
		var self = this;
		var e = self.$events[name];
		!e && (self.$events[name] = e = []);
		e.push(fn);
		return self;
	};

	PPA.unwatch = function(path, fn) {
		var self = this;
		M.off('app' + self.id + '#watch', self.path(path), fn);
		return self;
	};

	PPA.watch = function(path, fn, init) {
		var self = this;
		path = self.path(path);
		M.on('app' + self.id + '#watch', path, fn);
		init && fn.call(self, path, path, 0);
		return self;
	};

	PCTRL.unwatch = function(path, fn) {
		var self = this;
		M.off('ctrl' + self.name + '#watch', self.path(path), fn);
		return self;
	};

	PCTRL.watch = function(path, fn, init) {
		var self = this;
		path = self.path(path);
		M.on('ctrl' + self.name + '#watch', path, fn);
		init && fn.call(self, path, get(path), 0);
		return self;
	};

	PPA.path = PCTRL.path = function(path) {

		var self = this;

		if (!self.scope && self instanceof Controller) {
			var k = '$ctrl' + self.name;
			if (!warnings[k]) {
				warn('Controller "{0}" doesn\'t have defined a scope for path "{1}".'.format(self.name, path));
				warnings[k] = true;
			}
		}

		return self.scope + (path ? (self.scope ? '.' : '') + path : '');
	};

	PPA.set = PCTRL.set = function(path, value, type) {
		var self = this;

		if (value === undefined) {
			value = path;
			path = '';
		}

		M.set(self.path(path), value, type);
		return self;
	};

	PPA.update = PCTRL.update = function(path, reset, type) {
		var self = this;

		if (path === true) {
			reset = true;
			path = '';
		}

		M.update(self.path(path), reset, type);
		return self;
	};

	PPA.notify = PCTRL.notify = function(path) {
		var self = this;
		M.notify(self.path(path));
		return self;
	};

	PPA.inc = PCTRL.inc = function(path, value, type) {
		var self = this;

		if (value === undefined) {
			value = path;
			path = '';
		}

		M.inc(self.path(path), value, type);
		return self;
	};

	PPA.push = PCTRL.push = function(path, value, type) {
		var self = this;

		if (value === undefined) {
			value = path;
			path = '';
		}

		M.push(self.path(path), value, type);
		return self;
	};

	PPA.extend = PCTRL.extend = function(path, value, type) {
		var self = this;
		if (value === undefined) {
			value = path;
			path = '';
		}
		M.extend(self.path(path), value, type);
		return self;
	};

	PPA.rewrite = PCTRL.rewrite = function(path, value) {

		if (value === undefined) {
			value = path;
			path = '';
		}

		var self = this;
		M.rewrite(self.path(path), value);
		return self;
	};

	PPA.reset = PCTRL.reset = function(path) {
		var self = this;
		RESET(self.path(path));
		return self;
	};

	PPA.default = PCTRL.default = function(path, timeout, onlyComponent, reset) {
		var self = this;
		M.default(self.path(path), timeout, onlyComponent, reset);
		return self;
	};

	PPA.get = PCTRL.get = function(path) {
		var self = this;
		return get(self.path(path));
	};

	PPA.remove = PPA.kill = PPA.destroy = function(noremove) {
		var self = this;
		var el = self.element;

		self.removed = true;
		self.destroy && self.destroy();
		self.emit('destroy');

		el.removeData(ATTRDATA);
		el.get(0).$app = null;
		el.removeAttr('data-jc-scope');
		el.off();

		if (!noremove) {
			el.remove();
			self.key && M.removeCache(self.key);
		}

		// Remove events
		M.off('app' + self.id + '#watch');

		M.apps = M.apps.remove(self);
		setTimeout2('$cleaner', cleaner, 100);
		return self;
	};

	PPA.$load = function(callback) {
		var self = this;
		callback(self.key ? M.cache(self.key) : null);
		return self;
	};

	PPA.$save = function() {
		var self = this;
		self.key && M.cache(self.key, self.options, '1 year');
		return self;
	};

	// ===============================================================
	// COMPONENT DECLARATION
	// ===============================================================

	function COM(name) {
		var self = this;
		self._id = 'component' + (C.counter++);
		self.usage = new USAGE();
		self.$dirty = true;
		self.$valid = true;
		self.$validate = false;
		self.$parser = [];
		self.$formatter = [];
		self.$skip = false;
		self.$ready = false;
		self.$path;
		self.trim = true;
		self.middleware = ''; // internal
		self.$released = false;

		self.name = name;
		self.path;
		self.type;
		self.id;
		self.disabled = false;
		self.removed = false;

		self.make;
		self.done;
		self.prerender;
		self.destroy;
		self.state;
		self.validate;
		self.released;

		self.release = function(value) {

			var self = this;
			if (value === undefined || self.$removed)
				return self.$released;

			self.element.find(ATTRCOM).each(function() {
				var el = $(this);
				el.attrd('jc-released', value ? 'true' : 'false');
				var com = el.data(ATTRDATA);
				if (com) {
					if (com instanceof Array) {
						com.forEach(function(o) {
							if (!o.$removed && o.$released !== value) {
								com.$released = value;
								com.released && com.released(value, self);
							}
						});
					} else if (!com.$removed && com.$released !== value) {
						com.$released = value;
						com.released && com.released(value, self);
					}
				}
			});

			if (self.$released !== value) {
				self.$released = value;
				self.released && self.released(value, self);
			}

			return value;
		};

		self.getter = function(value, type, dirty, older, skip) {

			var self = this;
			value = self.parser(value);

			self.getter2 && self.getter2(value, type, dirty);

			if (type === 2 && !skip)
				self.$skip = true;

			if (type !== 2 || (older != null)) {
				M.validate(self.path);
				return value;
			}

			if (self.trim && typeof(value) === 'string')
				value = value.trim();

			if (value === self.get()) {
				dirty && M.validate(self.path);
				return value;
			}

			if (skip)
				self.$skip = false;

			self.set(self.path, value, type);
			return value;
		};

		self.setter = function(value, path, type) {

			var self = this;

			self.setter2 && self.setter2(value, path, type);

			if (type === 2) {
				if (self.$skip) {
					self.$skip = false;
					return self;
				}
			}

			var a = 'select-one';
			value = self.formatter(value);

			findcontrol(self.element.get(0), function(t) {

				if (t.$com !== self)
					t.$com = self;

				var path = t.$com.path;
				if (path && path.length && path !== self.path)
					return;

				if (t.type === 'checkbox') {
					var tmp = value != null ? value.toString().toLowerCase() : '';
					tmp = tmp === 'true' || tmp === '1' || tmp === 'on';
					tmp !== t.checked && (t.checked = tmp);
					return;
				}

				if (value == null)
					value = '';

				if (!type && t.type !== a && t.type !== 'range' && (!value || (self.$default && self.$default() === value)))
					autofill.push(t.$com);

				if (t.type === a || t.type === 'select') {
					var el = $(t);
					el.val() !== value && el.val(value);
				} else if (t.value !== value) {
					t.value = value;
					type === 1 && (t.$value2 = value);
				}
			});
		};
	}

	var PPC = COM.prototype;
	var dp = Object.defineProperty;

	dp(PPC, 'hidden', {
		get: function() {
			return this.element.get(0).offsetParent === null;
		}
	});

	dp(PPP, 'hidden', {
		get: function() {
			return this.element.get(0).offsetParent === null;
		}
	});

	dp(PPA, 'hidden', {
		get: function() {
			return this.element.get(0).offsetParent === null;
		}
	});

	dp(PPVC, 'hidden', {
		get: function() {
			return this.element.get(0).offsetParent === null;
		}
	});

	dp(PCTRL, 'hidden', {
		get: function() {
			return this.element.get(0).offsetParent === null;
		}
	});

	PPC.import = PPA.import = PPP.import = PCTRL.import = function(url, callback, insert, preparator) {
		var self = this;
		M.import(url, self.element, callback, insert, preparator);
		return self;
	};

	PPC.exec = PPA.exec = function(name, a, b, c, d, e) {
		var self = this;
		self.find(ATTRCOM).each(function() {
			var t = this;
			if (t.$com) {
				t.$com.caller = self;
				t.$com[name] && this.$com[name](a, b, c, d, e);
			}
		});
		return self;
	};

	PPC.controller = function(name) {
		var self = this;
		if (name) {
			self.$controller = name;
			return self;
		}
		return CONTROLLER(self.$controller);
	};

	PPC.replace = function(el, remove) {
		var self = this;

		if (C.is)
			C.recompile = true;

		var prev = self.element;
		var ctrl = prev.attrd('jc-controller');
		var scope = prev.attrd('jc-scope');

		self.element.removeAttr('data-jc');
		self.element.get(0).$com = null;
		ctrl && self.element.removeAttr('data-jc-controller');
		scope && self.element.removeAttr('data-jc-scope');

		if (remove)
			prev.off().remove();
		else
			self.attrd('jc-replaced', 'true');

		self.element = $(el);
		self.element.get(0).$com = self;
		self.attrd('jc', self.name);
		ctrl && self.attrd('jc-controller', ctrl);
		scope && self.attrd('jc-scope', scope);
		self.siblings = false;
		return self;
	};

	PPC.compile = function(container) {
		compile(container || this.element);
		return this;
	};

	PPC.nested = function() {
		var arr = [];
		this.find(ATTRCOM).each(function() {
			var el = $(this);
			var com = el.data(ATTRDATA);
			if (com && !el.attr(ATTRDEL)) {
				if (com instanceof Array)
					arr.push.apply(arr, com);
				else
					arr.push(com);
			}
		});
		return arr;
	};

	// @TODO: add reconfiguration for nested

	PPC.$interaction = function(type) {
		// type === 0 : init
		// type === 1 : manually
		// type === 2 : by input
		// type === 3 : by default
		// type === 100 : custom
		// type === 101 : dirty
		// type === 102 : valid
		var now = Date.now();
		var t = this;

		switch (type) {
			case 0:
				t.usage.init = now;
				t.$binded = true;
				break;
			case 1:
				t.usage.manually = now;
				t.$binded = true;
				break;
			case 2:
				t.usage.input = now;
				t.$binded = true;
				break;
			case 3:
				t.usage.default = now;
				t.$binded = true;
				break;
			case 100:
				t.usage.custom = now;
				break;
			case 101:
				t.usage.dirty = now;
				break;
			case 102:
				t.usage.valid = now;
				break;
		}

		return t;
	};

	PPC.notify = function() {
		W.NOTIFY(this.path);
		return this;
	};

	PPC.update = PPC.refresh = function(notify) {
		var self = this;
		if (self.$binded) {
			if (notify)
				self.set(self.path, self.get());
			else {
				self.setter && self.setter(self.get(), self.path, 1);
				self.$interaction(1);
			}
		}
		return self;
	};

	PPVC.tclass = PPC.tclass = PPA.tclass = PPP.tclass = PCTRL.tclass = function(cls, v) {
		var self = this;
		self.element.tclass(cls, v);
		return self;
	};

	PPVC.aclass = PPC.aclass = PPA.aclass = PPP.aclass = PCTRL.aclass = function(cls, timeout) {
		var self = this;
		if (timeout)
			setTimeout(function() { self.element.aclass(cls); }, timeout);
		else
			self.element.aclass(cls);
		return self;
	};

	PPVC.hclass = PPC.hclass = PPA.hclass = PPP.hclass = PCTRL.hclass = function(cls) {
		return this.element.hclass(cls);
	};

	PPVC.rclass = PPC.rclass = PPA.rclass = PPP.rclass = PCTRL.rclass = function(cls, timeout) {
		var self = this;
		var e = self.element;
		if (timeout)
			setTimeout(function() { e.rclass(cls); }, timeout);
		else {
			if (cls)
				e.rclass(cls);
			else
				e.rclass();
		}
		return self;
	};

	PPVC.rclass2 = PPC.rclass2 = PPA.rclass2 = PPP.rclass2 = PCTRL.rclass2 = function(search) {
		this.element.rclass2(search);
		return this;
	};

	PPVC.classes = PPC.classes = PPA.classes = PPP.classes = PCTRL.classes = function(cls) {

		var key = 'cls.' + cls;
		var tmp = temp[key];
		var t = this;
		var e = t.element;

		if (tmp) {
			tmp.add && e.aclass(tmp.add);
			tmp.rem && e.rclass(tmp.rem);
			return t;
		}

		var arr = cls instanceof Array ? cls : cls.split(' ');
		var add = '';
		var rem = '';

		for (var i = 0, length = arr.length; i < length; i++) {
			var c = arr[i].substring(0, 1);
			if (c === '-')
				rem += (rem ? ' ' : '') + arr[i].substring(1);
			else
				add += (add ? ' ' : '') + (c === '+' ? arr[i].substring(1) : arr[i]);
		}

		add && e.aclass(add);
		rem && e.rclass(rem);

		if (cls instanceof Array)
			return t;

		temp[key] = { add: add, rem: rem };
		return t;
	};

	PPC.toggle = PPA.toggle = PPP.toggle = PCTRL.toggle = function(cls, visible, timeout) {

		var manual = false;
		var self = this;

		if (typeof(cls) !== 'string') {
			timeout = visible;
			visible = cls;
			cls = 'hidden';
			manual = true;
		}

		if (typeof(visible) === 'number') {
			timeout = visible;
			visible = undefined;
		} else if (manual && visible !== undefined)
			visible = !visible;

		var el = self.element;
		if (!timeout) {
			el.tclass(cls, visible);
			return self;
		}

		setTimeout(function() {
			el.tclass(cls, visible);
		}, timeout);
		return self;
	};

	PPC.noScope = function(value) {
		this.$noscope = value === undefined ? true : value === true;
		return this;
	};

	PPC.singleton = function() {
		statics['$ST_' + this.name] = true;
		return this;
	};

	PPC.blind = function() {
		var self = this;
		self.path = null;
		self.$path = null;
		self.$$path = null;
		return self;
	};

	PPC.readonly = function() {
		var self = this;
		self.noDirty();
		self.noValid();
		self.getter = null;
		self.setter = null;
		self.$parser = null;
		self.$formatter = null;
		return self;
	};

	PPC.noValid = PPC.noValidate = function(val) {
		if (val === undefined)
			val = true;
		var self = this;
		self.$valid_disabled = val;
		self.$valid = val;
		return self;
	};

	PPC.noDirty = function(val) {
		if (val === undefined)
			val = true;
		var self = this;
		self.$dirty_disabled = val;
		self.$dirty = val ? false : true;
		return self;
	};

	PPC.datasource = function(path, callback, init) {
		var self = this;
		var ds = self.$datasource;

		ds && self.unwatch(ds.path, ds.fn);

		if (path) {
			self.$datasource = { path: path, fn: callback };
			self.watch(path, callback, init !== false);
		} else
			self.$datasource = null;

		return self;
	};

	PPC.setPath = function(path, type) {

		// type 1: init
		// type 2: scope

		var self = this;

		// Temporary
		if (path.charCodeAt(0) === 37)
			path = 'jctmp.' + path.substring(1);

		// Operations
		if (isOperation(path)) {
			self.$$path = self.$path = EMPTYARRAY;
			self.path = path;
			self.middleware = '';
			return self;
		}

		path = path.env(true);

		var fixed = null;

		if (path.charCodeAt(0) === 33) {
			path = path.substring(1);
			fixed = path;
		}

		var index = path.indexOf(' #');

		if (index !== -1) {
			self.middleware = path.substring(index);
			path = path.substring(0, index);
		} else if (type !== 2)
			self.middleware = '';

		self.path = path;
		self.$path = fixed;
		var arr = path.split('.');
		var pre = [];

		for (var i = 0, length = arr.length; i < length; i++) {
			var item = arr[i];
			var raw = item;
			index = item.indexOf('[');
			if (index !== -1)
				item = item.substring(0, index);
			pre.push({ path: item, raw: raw, is: index !== -1 });
		}

		self.$$path = pre;
		type !== 1 && C.ready && refresh();
		return self;
	};

	PPVC.attr = PPC.attr = PPA.attr = PPP.attr = PCTRL.attr = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.attr(name);
		el.attr(name, value);
		return this;
	};

	PPVC.attrd = PPC.attrd = PPA.attrd = PPP.attrd = PCTRL.attrd = function(name, value) {
		name = 'data-' + name;
		var el = this.element;
		if (value === undefined)
			return el.attr(name);
		el.attr(name, value);
		return this;
	};

	PPVC.css = PPC.css = PPA.css = PPP.css = PCTRL.css = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.css(name);
		el.css(name, value);
		return this;
	};

	PPC.rcwatch = PPA.rcwatch = PCTRL.rcwatch = function(path, value) {
		return value ? this.reconfigure(value) : this;
	};

	PPC.reconfigure = PPA.reconfigure = PPVC.reconfigure = PCTRL.reconfigure = function(value, callback, init) {

		var self = this;

		if (typeof(value) === 'object') {
			Object.keys(value).forEach(function(k) {
				var prev = self.config[k];
				if (!init && self.config[k] !== value[k])
					self.config[k] = value[k];
				if (callback)
					callback(k, value[k], init, init ? undefined : prev);
				else if (self.configure)
					self.configure(k, value[k], init, init ? undefined : prev);
			});
			return self;
		}

		// Variable
		if (value.substring(0, 1) === '=') {
			value = value.substring(1);
			if (self.watch) {
				self.$rcwatch && self.unwatch(self.$rcwatch, self.rcwatch);
				self.watch(value, self.rcwatch);
				self.$rcwatch = value;
			}
			self.reconfigure(get(value), callback, init);
			return self;
		}

		value.$config(function(k, v) {
			var prev = self.config[k];
			if (!init && self.config[k] !== v)
				self.config[k] = v;
			if (callback)
				callback(k, v, init, init ? undefined : prev);
			else if (self.configure)
				self.configure(k, v, init, init ? undefined : prev);
		});

		return self;
	};

	PPVC.closest = PPC.closest = PPA.closest = PPP.closest = PCTRL.closest = function(sel) {
		return this.element.closest(sel);
	};

	PPVC.parent = PPC.parent = PPA.parent = PPP.parent = PCTRL.parent = function(sel) {
		return this.element.parent(sel);
	};

	PPVC.html = PPC.html = PPA.html = PPP.html = PCTRL.html = function(value) {
		var el = this.element;
		if (value === undefined)
			return el.html();
		if (value instanceof Array)
			value = value.join('');
		var type = typeof(value);
		return value || type === 'number' || type === 'boolean' ? el.empty().append(value) : el.empty();
	};

	PPVC.text = PPC.text = PPA.text = PPP.text = PCTRL.text = function(value) {
		var el = this.element;
		if (value === undefined)
			return el.text();
		if (value instanceof Array)
			value = value.join('');
		var type = typeof(value);
		return value || type === 'number' || type === 'boolean' ? el.empty().text(value) : el.empty();
	};

	PPVC.empty = PPC.empty = PPA.empty = PPP.empty = PCTRL.empty = function() {
		var el = this.element;
		el.empty();
		return el;
	};

	PPVC.append = PPC.append = PPA.append = PPP.append = PCTRL.append = function(value) {
		var el = this.element;
		if (value instanceof Array)
			value = value.join('');
		else if (value instanceof CONTAINER)
			value = value.element;
		return value ? el.append(value) : el;
	};

	PPVC.event = PPC.event = PPA.event = PPP.event = PPP.on = PCTRL.event = function() {
		var self = this;
		self.element.on.apply(self.element, arguments);
		return self;
	};

	PPVC.find = PPC.find = PPA.find = PPP.find = PCTRL.find = function(selector) {
		return this.element.find(selector);
	};

	PPC.virtualize = PPA.virtualize = PCTRL.virtualize = function(mapping, config) {
		return W.VIRTUALIZE(this.element, mapping, config);
	};

	PPC.isInvalid = function() {
		var self = this;
		var is = !self.$valid;
		if (is && !self.$validate)
			is = !self.$dirty;
		return is;
	};

	PPC.unwatch = function(path, fn) {
		var self = this;
		M.off('com' + self._id + '#watch', path, fn);
		return self;
	};

	PPC.watch = function(path, fn, init) {

		var self = this;

		if (typeof(path) === 'function') {
			init = fn;
			fn = path;
			path = self.path;
		} else
			path = ctrl_path(path);

		self.on('watch', path, fn);
		init && fn.call(self, path, self.get(path), 0);
		return self;
	};

	PPC.invalid = function() {
		return M.invalid(this.path, this);
	};

	PPC.valid = function(value, noEmit) {

		var self = this;

		if (value === undefined)
			return self.$valid;

		if (self.$valid_disabled)
			return self;

		self.$valid = value;
		self.$validate = false;
		self.$interaction(102);
		clear('valid');
		!noEmit && self.state && self.state(1, 1);
		return self;
	};

	PPC.style = function(value) {
		W.STYLE(value, this._id);
		return this;
	};

	PPC.change = function(value) {
		var self = this;
		self.$dirty_disabled = false;
		self.$dirty = true;
		M.change(self.path, value === undefined ? true : value, self);
		return self;
	};

	PPC.used = function() {
		return this.$interaction(100);
	};

	PPC.dirty = function(value, noEmit) {

		var self = this;

		if (value === undefined)
			return self.$dirty;

		if (self.$dirty_disabled)
			return self;

		self.$dirty = value;
		self.$interaction(101);
		clear('dirty');
		!noEmit && self.state && self.state(2, 2);
		return self;
	};

	PPC.reset = function() {
		var self = this;
		M.reset(self.path, 0, self);
		return self;
	};

	PPC.setDefault = function(value) {
		this.$default = function() {
			return value;
		};
		return this;
	};

	PPC.default = function(reset) {
		var self = this;
		M.default(self.path, 0, self, reset);
		return self;
	};

	PPC.remove = PPC.kill = function(noClear) {
		var self = this;
		var el = self.element;
		el.removeData(ATTRDATA);
		el.attr(ATTRDEL, 'true').find(ATTRCOM).attr(ATTRDEL, 'true');
		self.$removed = 1;
		self.removed = true;
		M.off('com' + self._id + '#');
		if (!noClear) {
			clear();
			setTimeout2('$cleaner', cleaner, 100);
		}
		return true;
	};

	PPC.on = function(name, path, fn, init) {

		if (typeof(path) === 'function') {
			init = fn;
			fn = path;
			path = '';
		} else
			path = path.replace('.*', '');

		var fixed = null;
		if (path.charCodeAt(0) === 33) {
			path = path.substring(1);
			fixed = path;
		}

		if (!events[path]) {
			events[path] = {};
			events[path][name] = [];
		} else if (!events[path][name])
			events[path][name] = [];

		var self = this;
		events[path][name].push({ fn: fn, context: self, id: self._id, owner: 'com' + self._id, path: fixed });
		init && fn.call(M, path, get(path));

		return self;
	};

	PPC.formatter = function(value) {

		var self = this;

		if (typeof(value) === 'function') {
			if (!self.$formatter)
				self.$formatter = [];
			self.$formatter.push(value);
			return self;
		}

		var a = self.$formatter;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++)
				value = a[i].call(self, self.path, value, self.type);
		}

		a = M.$formatter;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++)
				value = a[i].call(self, self.path, value, self.type);
		}

		return value;
	};

	PPC.parser = function(value) {

		var self = this;

		if (typeof(value) === 'function') {
			if (!self.$parser)
				self.$parser = [];
			self.$parser.push(value);
			return self;
		}
		var a = self.$parser;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++)
				value = a[i].call(self, self.path, value, self.type);
		}

		a = M.$parser;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++)
				value = a[i].call(self, self.path, value, self.type);
		}

		return value;
	};

	PPC.emit = function() {
		M.emit.apply(M, arguments);
		return this;
	};

	PPC.evaluate = function(path, expression, nopath) {
		if (!expression) {
			expression = path;
			path = this.path;
		}
		return M.evaluate(path, expression, nopath);
	};

	PPC.get = function(path) {
		if (!path)
			path = this.path;
		if (path)
			return get(path);
	};

	PPC.set = function(path, value, type) {

		var self = this;

		if (value === undefined) {
			value = path;
			path = self.path;
		}

		path && M.set(path, value, type);
		return self;
	};

	PPC.inc = function(path, value, type) {

		if (value === undefined) {
			value = path;
			path = this.path;
		}

		path && M.inc(path, value, type);
		return this;
	};

	PPC.extend = function(path, value, type) {

		if (value === undefined) {
			value = path;
			path = this.path;
		}

		path && M.extend(path, value, type);
		return this;
	};

	PPC.rewrite = function(path, value) {

		if (value === undefined) {
			value = path;
			path = this.path;
		}

		path && M.rewrite(path, value);
		return this;
	};

	PPC.push = function(path, value, type) {

		if (value === undefined) {
			value = path;
			path = this.path;
		}

		path && M.push(path, value, type);
		return this;
	};

	// ===============================================================
	// USAGE DECLARATION
	// ===============================================================

	function USAGE() {
		var t = this;
		t.init = 0;
		t.manually = 0;
		t.input = 0;
		t.default = 0;
		t.custom = 0;
		t.dirty = 0;
		t.valid = 0;
	}

	USAGE.prototype.compare = function(type, dt) {
		if (typeof(dt) === 'string' && dt.substring(0, 1) !== '-')
			dt = W.DATETIME.add('-' + dt);
		var val = this[type];
		return val === 0 ? false : val < dt.getTime();
	};

	USAGE.prototype.convert = function(type) {

		var n = Date.now();
		var output = {};
		var num = 1;
		var t = this;

		switch (type.toLowerCase().substring(0, 3)) {
			case 'min':
			case 'mm':
			case 'm':
				num = 60000;
				break;

			case 'hou':
			case 'hh':
			case 'h':
				num = 360000;
				break;

			case 'sec':
			case 'ss':
			case 's':
				num = 1000;
				break;
		}

		output.init = t.init === 0 ? 0 : ((n - t.init) / num) >> 0;
		output.manually = t.manually === 0 ? 0 : ((n - t.manually) / num) >> 0;
		output.input = t.input === 0 ? 0 : ((n - t.input) / num) >> 0;
		output.default = t.default === 0 ? 0 : ((n - t.default) / num) >> 0;
		output.custom = t.custom === 0 ? 0 : ((n - t.custom) / num) >> 0;
		output.dirty = t.dirty === 0 ? 0 : ((n - t.dirty) / num) >> 0;
		output.valid = t.valid === 0 ? 0 : ((n - t.valid) / num) >> 0;
		return output;
	};

	M.prototypes = function(fn) {
		var obj = {};
		obj.Container = PPVC;
		obj.Property = PPP;
		obj.App = PPA;
		obj.Component = PPC;
		obj.Usage = USAGE.prototype;
		obj.Controller = PCTRL;
		fn.call(obj, obj);
		return M;
	};

	// ===============================================================
	// WINDOW FUNCTIONS
	// ===============================================================

	W.isMOBILE = /Mobi/.test(navigator.userAgent);
	W.isROBOT = navigator.userAgent ? (/search|agent|bot|crawler|spider/i).test(navigator.userAgent) : true;
	W.isSTANDALONE = navigator.standalone || W.matchMedia('(display-mode: standalone)').matches;
	W.isTOUCH = ('ontouchstart' in W || navigator.maxTouchPoints) ? true : false;

	W.setTimeout2 = function(name, fn, timeout, limit, param) {
		var key = ':' + name;
		if (limit > 0) {
			var key2 = key + ':limit';
			if (statics[key2] >= limit)
				return;
			statics[key2] = (statics[key2] || 0) + 1;
			statics[key] && clearTimeout(statics[key]);
			return statics[key] = setTimeout(function(param) {
				statics[key2] = undefined;
				fn && fn(param);
			}, timeout, param);
		}
		statics[key] && clearTimeout(statics[key]);
		return statics[key] = setTimeout(fn, timeout, param);
	};

	W.clearTimeout2 = function(name) {
		var key = ':' + name;
		if (statics[key]) {
			clearTimeout(statics[key]);
			statics[key] = undefined;
			statics[key + ':limit'] && (statics[key + ':limit'] = undefined);
			return true;
		}
		return false;
	};

	W.TRY = function(fn, err) {
		try {
			fn();
			return true;
		} catch (e) {
			err && err(e);
		}
		return false;
	};

	W.COMPONENT_EXTEND = function(name, config, declaration) {

		if (typeof(config) === 'function') {
			var tmp = declaration;
			declaration = config;
			config = tmp;
		}

		if (extensions[name])
			extensions[name].push({ config: config, fn: declaration });
		else
			extensions[name] = [{ config: config, fn: declaration }];

		for (var i = 0, length = M.components.length; i < length; i++) {
			var m = M.components[i];
			if (!m.$removed || name === m.name){
				config && m.reconfigure(config, undefined, true);
				declaration.call(m, m);
			}
		}
	};

	W.COMPONENT = function(name, config, declaration, dependencies) {

		if (typeof(config) === 'function') {
			dependencies = declaration;
			declaration = config;
			config = null;
		}

		M.$components[name] && warn('Components: Overwriting component:', name);
		var a = M.$components[name] = { name: name, config: config, declaration: declaration, shared: {}, dependencies: dependencies instanceof Array ? dependencies : null };
		M.emit('component.compile', name, a);
	};

	W.SINGLETON = function(name, def) {
		return singletons[name] || (singletons[name] = (new Function('return ' + (def || '{}')))());
	};

	W.WIDTH = function(el) {
		if (!el)
			el = $(W);
		var w = el.width();
		var d = M.defaults.devices;
		return w >= d.md.min && w <= d.md.max ? 'md' : w >= d.sm.min && w <= d.sm.max ? 'sm' : w > d.lg.min ? 'lg' : w <= d.xs.max ? 'xs' : '';
	};

	W.WORKFLOW = function(name, fn) {

		if (!fn) {
			if (!workflows)
				return NOOP;
			var w = workflows[name];
			if (!(w instanceof Array))
				return NOOP;
			return function() {
				for (var i = 0, length = w.length; i < length; i++)
					w[i].apply(this, arguments);
			};
		}

		if (!workflows)
			workflows = {};

		var w = workflows[name];
		if (w)
			w.push(fn);
		else
			workflows[name] = [fn];
	};

	W.MEDIAQUERY = function(query, element, fn) {

		if (typeof(query) === 'number') {
			mediaqueries.remove('id', query);
			return true;
		}

		if (typeof(element) === 'function') {
			fn = element;
			element = null;
		}

		query = query.toLowerCase();
		var type;

		if (query.indexOf(',') !== -1) {
			var ids = [];
			query.split(',').forEach(function(q) {
				q = q.trim();
				q && ids.push(W.MEDIAQUERY(q, element, fn));
			});
			return ids;
		}

		var d = M.defaults.devices;

		if (query === 'md')
			query = 'min-width:{0}px and max-width:{1}px'.format(d.md.min, d.md.max);
		else if (query === 'lg')
			query = 'min-width:{0}px'.format(d.lg.min);
		else if (query === 'xs')
			query = 'max-width:{0}px'.format(d.xs.max);
		else if (query === 'sm')
			query = 'min-width:{0}px and max-width:{1}px'.format(d.sm.min, d.sm.max);

		var arr = query.match(/(max-width|min-width|max-device-width|min-device-width|max-height|min-height|max-device-height|height|width):(\s)\d+(px|em|in)?/gi);
		var obj = {};

		var num = function(val) {
			var n = parseInt(val.match(/\d+/), 10);
			return val.match(/\d+(em)/) ? n * 16 : val.match(/\d+(in)/) ? (n * 0.010416667) >> 0 : n;
		};

		if (arr) {
			for (var i = 0, length = arr.length; i < length; i++) {
				var item = arr[i];
				var index = item.indexOf(':');
				switch (item.substring(0, index).toLowerCase().trim()) {
					case 'min-width':
					case 'min-device-width':
					case 'width':
						obj.minW = num(item);
						break;
					case 'max-width':
					case 'max-device-width':
						obj.maxW = num(item);
						break;
					case 'min-height':
					case 'min-device-height':
					case 'height':
						obj.minH = num(item);
						break;
					case 'max-height':
					case 'max-device-height':
						obj.maxH = num(item);
						break;
				}
			}
		}

		arr = query.match(/orientation:(\s)(landscape|portrait)/gi);
		if (arr) {
			for (var i = 0, length = arr.length; i < length; i++) {
				var item = arr[i];
				if (item.toLowerCase().indexOf('portrait') !== -1)
					obj.orientation = 'portrait';
				else
					obj.orientation = 'landscape';
			}
		}

		obj.id = mediaqueriescounter++;
		obj.fn = fn;
		obj.type = type;

		if (element)
			obj.element = element;

		mediaqueries.push(obj);
		return obj.id;
	};

	W.MIDDLEWARE = function(name, value, callback, path) {

		if (!(name instanceof Array)) {
			middlewares[name] = value;
			return;
		}

		if (typeof(callback) !== 'function') {
			var tmp = callback;
			callback = value;
			value = tmp;
		}

		var context = {};
		name.waitFor(function(name, next) {

			var mid = middlewares[name];

			if (mid) {
				mid.call(context, next, value, path);
				return;
			}

			!warnings[name] && warn('Components: Middleware "{0}" not found.'.format(name));
			warnings[name] = true;

			next();
		}, function(val) {
			callback && callback.call(context, val !== undefined ? val : value, path);
		});
	};

	W.FN = function(exp) {
		var index = exp.indexOf('=>');
		var arg = exp.substring(0, index).trim();
		var val = exp.substring(index + 2).trim();
		var is = false;

		arg = arg.replace(/\(|\)|\s/g, '').trim();
		if (arg)
			arg = arg.split(',');

		if (val.charCodeAt(0) === 123) {
			is = true;
			val = val.substring(1, val.length - 1).trim();
		}

		var output = (is ? '' : 'return ') + val;
		switch (arg.length) {
			case 1:
				return new Function(arg[0], output);
			case 2:
				return new Function(arg[0], arg[1], output);
			case 3:
				return new Function(arg[0], arg[1], arg[2], output);
			case 4:
				return new Function(arg[0], arg[1], arg[2], arg[3], output);
			case 0:
			default:
				return new Function(output);
		}
	};

	W.SETTER = function(selector, name) {

		var arg = [];
		var beg = selector === true ? 3 : 2;

		for (var i = beg; i < arguments.length; i++)
			arg.push(arguments[i]);

		if (beg === 3) {
			selector = name;
			name = arguments[2];
			FIND(selector, function(o) {
				if (typeof(o[name]) === 'function')
					o[name].apply(o, arg);
				else
					o[name] = arg[0];
			});
		} else {
			FIND(selector, true).forEach(function(o) {
				if (typeof(o[name]) === 'function')
					o[name].apply(o, arg);
				else
					o[name] = arg[0];
			});
		}

		return W.SETTER;
	};

	function exechelper(path, arg) {
		setTimeout(function() {
			W.EXEC(true, path, arg[0], arg[1], arg[2], arg[3], arg[4], arg[5], arg[6]);
		}, 200);
	}

	W.EXEC = function(path) {

		var arg = [];
		var f = 1;
		var wait = false;
		var ok = 0;

		if (path === true) {
			wait = true;
			path = arguments[1];
			f = 2;
		}

		path = path.env();

		for (var i = f; i < arguments.length; i++)
			arg.push(arguments[i]);

		// OPERATION
		var c = path.charCodeAt(0);
		if (c === 35) {
			var op = OPERATION(path);
			if (op) {
				op.apply(W, arg);
				ok = 1;
			}
			wait && !ok && exechelper(path, arg);
			return W.EXEC;
		}

		// CONTROLLER
		if (c === 64) {
			var index = path.indexOf('.');
			var ctrl = CONTROLLER(path.substring(1, index));
			if (ctrl) {
				var fn = ctrl[path.substring(index + 1)];
				if (typeof(fn) === 'function') {
					fn.apply(ctrl, arg);
					ok = 1;
				}
			}

			wait && !ok && exechelper(path, arg);
			return W.EXEC;
		}

		// CONTROLLER
		var index = path.indexOf('/');
		if (index !== -1) {
			var ctrl = CONTROLLER(path.substring(0, index));
			var fn = path.substring(index + 1);
			if (ctrl && typeof(ctrl[fn]) === 'function') {
				ctrl[fn].apply(ctrl, arg);
				ok = 1;
			}

			wait && !ok && exechelper(path, arg);
			return W.EXEC;
		}

		var fn = get(path);

		if (typeof(fn) === 'function') {
			fn.apply(W, arg);
			ok = 1;
		}

		wait && !ok && exechelper(path, arg);
		return W.EXEC;
	};

	W.MAKE = function(obj, fn, update) {

		switch (typeof(obj)) {
			case 'function':
				fn = obj;
				obj = {};
				break;
			case 'string':
				var p = obj;
				var is = true;
				obj = get(p);
				if (obj == null) {
					is = false;
					obj = {};
				}
				fn.call(obj, obj, p);
				if (is && (update === undefined || update === true))
					M.update(p, true);
				else {
					if (C.ready)
						set(p, obj);
					else
						M.set(p, obj, true);
				}
				return obj;
		}

		fn.call(obj, obj, '');
		return obj;
	};

	W.CLONE = function(obj, path) {

		var type = typeof(obj);
		switch (type) {
			case 'number':
			case 'boolean':
				return obj;
			case 'string':
				return path ? obj : CLONE(get(obj), true);
		}

		if (obj == null)
			return obj;

		if (obj instanceof Date)
			return new Date(obj.getTime());

		return PARSE(JSON.stringify(obj));
	};

	W.STRINGIFY = function(obj, compress, fields) {
		compress === undefined && (compress = M.defaults.jsoncompress);
		var tf = typeof(fields);
		return JSON.stringify(obj, function(key, value) {

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
	};

	W.PARSE = function(value, date) {
		date === undefined && (date = M.defaults.jsondate);
		try {
			return JSON.parse(value, function(key, value) {
				return typeof(value) === 'string' && date && value.isJSONDate() ? new Date(value) : value;
			});
		} catch (e) {
			return null;
		}
	};

	W.NOOP = function(){};
	W.SET = function(path, value, timeout, reset) {
		if (typeof(timeout) === 'boolean')
			return M.set(path, value, timeout);
		if (!timeout || timeout < 5) // TYPE
			return M.set(path, value, timeout);
		setTimeout(function() {
			M.set(path, value, reset);
		}, timeout);
		return M;
	};

	W.INC = function(path, value, timeout, reset) {
		if (typeof(timeout) === 'boolean')
			return M.inc(path, value, timeout);
		if (!timeout || timeout < 5)
			return M.inc(path, value, timeout);
		setTimeout(function() {
			M.inc(path, value, reset);
		}, timeout);
		return M;
	};

	W.EXTEND = function(path, value, timeout, reset) {
		if (typeof(timeout) === 'boolean')
			return M.extend(path, value, timeout);
		if (!timeout || timeout < 5)
			return M.extend(path, value, timeout);
		setTimeout(function() {
			M.extend(path, value, reset);
		}, timeout);
		return M;
	};

	W.PUSH = function(path, value, timeout, reset) {
		if (typeof(timeout) === 'boolean')
			return M.push(path, value, timeout);
		if (!timeout || timeout < 5)
			return M.push(path, value, timeout);
		setTimeout(function() {
			M.push(path, value, reset);
		}, timeout);
		return M;
	};

	W.DEFAULT = function(path, timeout, reset) {
		return M.default(path, timeout, null, reset);
	};

	W.UPTODATE = function(period, url, callback) {

		if (typeof(url) === 'function') {
			callback = url;
			url = '';
		}

		var dt = new Date().add(period);
		ON('knockknock', function() {
			if (dt > W.DATETIME || document.hasFocus())
				return;
			setTimeout(function() {
				if (url)
					W.location.href = url.$env();
				else
					W.location.reload(true);
			}, 5000);
			callback && callback();
		});
	};

	W.PING = function(url, timeout) {

		if (navigator.onLine != null && !navigator.onLine)
			return;

		url = url.$env();

		var index = url.indexOf(' ');
		var method = 'GET';

		if (index !== -1) {
			method = url.substring(0, index).toUpperCase();
			url = url.substring(index).trim();
		}

		var options = {};
		var data = $.param(M.defaults.pingdata);

		if (data) {
			index = url.lastIndexOf('?');
			if (index === -1)
				url += '?' + data;
			else
				url += '&' + data;
		}

		options.type = method;
		options.headers = { 'X-Ping': location.pathname };

		options.success = function(r) {
			if (r) {
				try {
					(new Function(r))();
				} catch (e) {}
			}
		};

		options.error = function() {
			setTimeout(function() {
				location.reload(true);
			}, 2000);
		};

		return setInterval(function() {
			$.ajax(makeurl(url), options);
		}, timeout || 30000);
	};

	M.modified = W.MODIFIED = function(path) {
		var output = [];
		M.each(function(obj) {
			if (obj.disabled || obj.$dirty_disabled)
				return;
			obj.$dirty === false && output.push(obj.path);
		}, path, true);
		return output;
	};

	W.NOTMODIFIED = function(path, value, fields) {

		if (value === undefined)
			value = get(path);

		if (value === undefined)
			value = null;

		if (fields)
			path = path.concat('#', fields);

		var hash = W.HASH(W.STRINGIFY(value, false, fields));
		var key = 'notmodified.' + path;

		if (cache[key] === hash)
			return true;
		cache[key] = hash;
		return false;
	};

	W.FIND = function(value, many, noCache, callback) {

		var isWaiting = false;

		if (typeof(many) === 'function') {
			isWaiting = true;
			callback = many;
			many = undefined;
			// noCache = undefined;
			// noCache can be timeout
		} else if (typeof(noCache) === 'function') {
			var tmp = callback;
			isWaiting = true;
			callback = noCache;
			noCache = tmp;
			// noCache can be timeout
		}

		if (isWaiting) {
			WAIT(function() {
				var val = FIND(value, many, noCache);
				if (val instanceof Array)
					return val.length > 0;
				return val ? true : false;
			}, function(err) {
				// timeout
				if (err)
					return;
				var val = FIND(value, many);
				callback.call(val ? val : W, val);
			}, 500, noCache);
			return;
		}

		// Element
		if (typeof(value) === 'object') {

			if (!(value instanceof jQuery))
				value = $(value);

			var selector = value.find('[data-jc]');
			if (many) {
				var arr = [];
				selector.each(function() {
					this.$com && arr.push(this.$com);
				});
				return arr;
			}

			var item = selector[0];
			return item ? item.$com : null;
		}

		var key, output;

		if (!noCache) {
			key = 'find.' + value + '.' + (many ? 0 : 1);
			output = cache[key];
			if (output)
				return output;
		}

		if (value.charCodeAt(0) === 46) {
			output = M.findByPath(value.substring(1), many);
			if (!noCache)
				cache[key] = output;
			return output;
		}

		if (value.charCodeAt(0) === 35) {
			output = M.findById(value.substring(1), undefined, many);
			if (!noCache)
				cache[key] = output;
			return output;
		}

		output = M.findByName(value, undefined, many);
		if (!noCache)
			cache[key] = output;
		return output;
	};

	W.UPDATE = function(path, timeout, reset) {
		if (typeof(timeout) === 'boolean')
			return M.update(path, timeout);
		if (!timeout)
			return M.update(path, reset);
		setTimeout(function() {
			M.update(path, reset);
		}, timeout);
	};

	W.SCHEMA = function(name, declaration) {
		return M.schema(name, declaration);
	};

	W.OPERATION = function(name, fn) {
		if (fn)
			operations[name] = fn;
		else
			fn = operations[name.charCodeAt(0) === 35 ? name.substring(1) : name];
		return fn;
	};

	W.CSS = W.STYLE = function(value, id) {
		id && $('#css' + id).remove();
		$('<style type="text/css"' + (id ? ' id="css' + id + '"' : '') + '>' + (value instanceof Array ? value.join('') : value) + '</style>').appendTo('head');
	};

	W.HASH = function(s) {
		if (!s)
			return 0;
		if (typeof(s) !== 'string')
			s = STRINGIFY(s);
		var hash = 0, i, char;
		if (!s.length)
			return hash;
		var l = s.length;
		for (i = 0; i < l; i++) {
			char = s.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};

	W.GUID = function(size) {
		if (!size)
			size = 10;
		var l = ((size / 10) >> 0) + 1;
		var b = [];
		for (var i = 0; i < l; i++)
			b.push(Math.random().toString(36).substring(2));
		return b.join('').substring(0, size);
	};

	W.KEYPRESS = function(fn, timeout, key) {
		if (!timeout)
			timeout = 300;
		var str = fn.toString();
		var beg = str.length - 20;
		if (beg < 0)
			beg = 0;
		var tkey = key ? key : W.HASH(str.substring(0, 20) + 'X' + str.substring(beg)) + '_keypress';
		setTimeout2(tkey, fn, timeout);
	};

	W.WAIT = function(fn, callback, interval, timeout) {
		var key = ((Math.random() * 10000) >> 0).toString(16);
		var tkey = timeout > 0 ? key + '_timeout' : 0;

		if (typeof(callback) === 'number') {
			var tmp = interval;
			interval = callback;
			callback = tmp;
		}

		var is = typeof(fn) === 'string';
		var run = false;

		if (is) {
			var result = get(fn);
			if (result)
				run = true;
		} else if (fn())
			run = true;

		if (run) {
			callback(null, function(sleep) {
				setTimeout(function() {
					WATCH(fn, callback, interval, timeout);
				}, sleep || 1);
			});
			return;
		}

		if (tkey) {
			waits[tkey] = setTimeout(function() {
				clearInterval(waits[key]);
				delete waits[tkey];
				delete waits[key];
				callback(new Error('Timeout.'));
			}, timeout);
		}

		waits[key] = setInterval(function() {

			if (is) {
				var result = get(fn);
				if (result == null)
					return;
			} else if (!fn())
				return;

			clearInterval(waits[key]);
			delete waits[key];

			if (tkey) {
				clearTimeout(waits[tkey]);
				delete waits[tkey];
			}

			callback && callback(null, function(sleep) {
				setTimeout(function() {
					WATCH(fn, callback, interval);
				}, sleep || 1);
			});

		}, interval || 500);
	};

	W.COMPILE = function(container) {
		return compile(container);
	};

	W.SCOPE = function(name, fn) {
		var ctrl = M.controllers[arguments[0]];
		if (!ctrl) {
			setTimeout(function() {
				W.SCOPE(name, fn);
			}, 350);
			return;
		}
		var tmp = current_ctrl;
		current_ctrl = name;
		fn.call(ctrl, ctrl, ctrl.scope, ctrl.element);
		current_ctrl = tmp;
	};

	W.CONTROLLER = function() {

		var callback = arguments[arguments.length - 1];
		if (typeof(callback) !== 'function')
			return M.controllers[arguments[0]];

		var obj = new Controller(arguments[0]);
		obj.$callback = callback;

		M.controllers[obj.name] = obj;

		var key = 'ctrl$' + obj.name;

		obj.$init = function(path, element) {

			clearTimeout(statics[key]);

			if (path)
				obj.scope = path;

			if (element)
				obj.element = element;

			if (obj.$callback) {
				C.controllers--;
				current_ctrl = obj.name;
				obj.$callback.call(obj, obj, path, element);
				obj.$callback = null;
				current_ctrl = null;
			}

			return obj;
		};

		C.controllers++;

		statics[key] = setTimeout(function() {
			obj.$init();
		}, 500);

		return obj.$init;
	};

	PCTRL.change = function(path, value) {

		if (typeof(path) === 'boolean') {
			value = path;
			path = '';
		}

		var self = this;
		M.change(self.path(path), value === undefined ? true : value);
		return self;
	};

	PCTRL.remove = PCTRL.kill = PCTRL.destroy = function() {

		var self = this;

		if (!M.controllers[self.name])
			return;

		self.removed = true;
		self.emit('destroy');
		self.destroy && self.destroy();
		delete M.controllers[self.name];

		// Remove all global events
		Object.keys(events).forEach(function(e) {
			var evt = events[e];
			Object.keys(evt).forEach(function(key) {
				evt[key] = evt[key].remove('controller', self.name);
				if (!evt[key].length)
					delete events[''][key];
			});
		});

		// Remove events
		M.off('ctrl' + self.name + '#watch');

		// Remove schedulers
		schedulers = schedulers.remove('controller', self.name);

		for (var i = 0, length = M.components.length; i < length; i++) {
			var com = M.components[i];
			com.$controller === self.name && com.remove(true);
		}

		setTimeout(function(scope) {
			if (scope)
				delete window[scope];
			self.element && self.element.remove();
			clear();
			setTimeout(cleaner, 500);
		}, 1000, self.scope);
	};

	PCTRL.exec = function(name, a, b, c, d, e) {
		var self = this;
		for (var i = 0, length = M.components.length; i < length; i++) {
			var t = M.components[i];
			if (t.$controller === self.name) {
				t.caller = self;
				t[name] && t[name](a, b, c, d, e);
			}
		}
		return self;
	};

	PCTRL.components = function() {
		var arr = [];
		for (var i = 0, length = M.components.length; i < length; i++) {
			var com = M.components[i];
			com.$controller === this.name && arr.push(com);
		}
		return arr;
	};

	W.VIRTUALIZE = function(el, map, config) {
		if (el.element instanceof jQuery)
			el = el.element;
		!(el instanceof jQuery) && (el = $(el));
		return new CONTAINER(el, map, config);
	};

	COMPONENT('', function() {
		var self = this;
		var type = self.element.get(0).tagName;
		if (type !== 'INPUT' && type !== 'SELECT' && type !== 'TEXTAREA') {
			self.readonly();
			self.setter = function(value) {
				value = self.formatter(value, true);
				self.element.html(value);
			};
		} else {
			var a = 'data-jc-bind';
			!self.element.attr(a) && self.element.attr(a, '1');
			if (self.element.attr('required')) {
				self.validate = function(value, is) {
					return is ? true : value ? true : false;
				};
			}
			self.element.$com = self;
		}
	});

	// ===============================================================
	// PROTOTYPES
	// ===============================================================

	var AP = Array.prototype;
	var SP = String.prototype;
	var NP = Number.prototype;
	var DP = Date.prototype;

	AP.wait = AP.waitFor = function(fn, callback, meta) {

		if (meta === undefined)
			meta = { index: 0, value: null };

		var self = this;
		var item = self[meta.index++];

		if (item === undefined) {
			callback && callback(meta.value);
			return self;
		}

		fn.call(self, item, function(value) {
			meta.value = value;
			self.waitFor(fn, callback, meta);
		}, meta.index);

		return self;
	};

	AP.compare = function(id, b, fields) {
		var a = this;
		var update = [];
		var append = [];
		var remove = [];
		var il = a.length;
		var jl = b.length;

		for (var i = 0; i < il; i++) {
			var aa = a[i];
			var is = false;

			for (var j = 0; j < jl; j++) {
				var bb = b[j];
				if (bb[id] !== aa[id])
					continue;
				STRINGIFY(aa, false, fields) !== STRINGIFY(bb, false, fields) && update.push({ oldIndex: i, newIndex: j, oldItem: aa, newItem: bb });
				is = true;
				break;
			}

			!is && remove.push({ oldIndex: i, newIndex: j, oldItem: aa, newItem: bb });
		}

		for (var i = 0; i < jl; i++) {
			var aa = b[i];
			var is = true;

			for (var j = 0; j < il; j++) {
				var bb = a[j];
				if (bb[id] === aa[id]) {
					is = false;
					break;
				}
			}

			is && append.push({ oldIndex: null, newIndex: i, oldItem: null, newItem: aa });
		}

		var pr = (remove.length / il) * 100;
		var pu = (update.length / il) * 100;

		return {
			change: append.length || remove.length || update.length ? true : false,
			redraw: pr > 60 || pu > 60,
			append: append,
			remove: remove,
			update: update
		};
	};

	AP.async = function(context, callback) {

		if (typeof(context) === 'function') {
			var tmp = callback;
			callback = context;
			context = tmp;
		}

		if (!context)
			context = {};

		var arr = this;
		var index = 0;

		var c = function() {
			var fn = arr[index++];
			if (fn)
				fn.call(context, c, index - 1);
			else
				return callback && callback.call(context);
		};

		c();
		return this;
	};

	AP.ticks = function(max, beg) {

		var self = this;
		var length = self.length;
		if (length < max)
			return self;

		var each = Math.round(length / max);
		var arr = [];
		var count = 0;
		var sum = 0;

		if (beg) {
			for (var i = 0; i < length; i++) {
				if (sum++ % each === 0) {
					count++;
					arr.push(self[i]);
				}

				if (count === max)
					break;
			}
		} else {
			for (var i = length - 1; i > -1; i--) {
				if (sum++ % each === 0) {
					count++;
					arr.push(self[i]);
				}

				if (count === max)
					break;
			}
			arr.reverse();
		}
		return arr;
	};

	AP.take = function(count) {
		var arr = [];
		var self = this;
		var length = self.length;
		for (var i = 0; i < length; i++) {
			arr.push(self[i]);
			if (arr.length >= count)
				return arr;
		}
		return arr;
	};

	AP.skip = function(count) {
		var arr = [];
		var self = this;
		var length = self.length;
		for (var i = 0; i < length; i++)
			i >= count && arr.push(self[i]);
		return arr;
	};

	AP.takeskip = function(take, skip) {
		var arr = [];
		var self = this;
		var length = self.length;
		for (var i = 0; i < length; i++) {
			if (i < skip)
				continue;
			if (arr.length >= take)
				return arr;
			arr.push(self[i]);
		}
		return arr;
	};

	SP.env = function(search) {
		var self = this;
		if (search) {
			return self.replace(REGENV, function(val) {
				return M.defaults.environment[val.substring(1, val.length - 1)] || val;
			});
		}
		var l = self.length - 1;
		return (self.charCodeAt(0) === 91 && self.charCodeAt(l) === 93 ? (M.defaults.environment[self.substring(1, l)] || self) : self).toString();
	};

	SP.$env = function() {
		var index = this.indexOf('?');
		return index === -1 ? this.env(true) : this.substring(0, index).env(true) + this.substring(index);
	};

	SP.parseConfig = SP.$config = function(def, callback) {

		var output;

		switch (typeof(def)) {
			case 'function':
				callback = def;
				output = {};
				break;
			case 'string':
				output = def.parseConfig();
				break;
			case 'object':
				if (def != null)
					output = def;
				else
					output = {};
				break;
			default:
				output = {};
				break;
		}

		var arr = this.env().replace(/\\;/g, '\0').split(';');
		var num = /^(-)?[0-9.]+$/;
		var colon = /(https|http|wss|ws):\/\//gi;

		for (var i = 0, length = arr.length; i < length; i++) {

			var item = arr[i].replace(/\0/g, ';').replace(/\\:/g, '\0').replace(colon, function(text) {
				return text.replace(/:/g, '\0');
			});

			var kv = item.split(':');
			var l = kv.length;

			if (l !== 2)
				continue;

			var k = kv[0].trim();
			var v = kv[1].trim().replace(/\0/g, ':').env();

			if (v === 'true' || v === 'false')
				v = v === 'true';
			else if (num.test(v)) {
				var tmp = +v;
				if (!isNaN(tmp))
					v = tmp;
			}

			output[k] = v;
			callback && callback(k, v);
		}

		return output;
	};

	SP.params = function(obj) {
		return this.replace(REGPARAMS, function(id) {
			return get(id.substring(1, id.length - 1), obj);
		});
	};

	SP.render = function(a, b) {
		return Tangular.render(this, a, b);
	};

	SP.isJSONDate = function() {
		var t = this;
		var l = t.length - 1;
		return l > 22 && l < 30 && t.charCodeAt(l) === 90 && t.charCodeAt(10) === 84 && t.charCodeAt(4) === 45 && t.charCodeAt(13) === 58 && t.charCodeAt(16) === 58;
	};

	SP.parseExpire = function() {

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

	SP.removeDiacritics = function() {
		var buf = '';
		for (var i = 0, length = this.length; i < length; i++) {
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

	SP.toSearch = function() {

		var str = this.replace(REGSEARCH, '').trim().toLowerCase().removeDiacritics();
		var buf = [];
		var prev = '';

		for (var i = 0, length = str.length; i < length; i++) {
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

	SP.slug = function(max) {
		max = max || 60;

		var self = this.trim().toLowerCase().removeDiacritics();
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
				continue;
			}

			if (code > 47 && code < 58) {
				builder += c;
				continue;
			}

			if (code > 94 && code < 123) {
				builder += c;
				continue;
			}
		}
		var l = builder.length - 1;
		return builder[l] === '-' ? builder.substring(0, l) : builder;
	};

	SP.isEmail = function() {
		var str = this;
		return str.length <= 4 ? false : M.validators.email.test(str);
	};

	SP.isPhone = function() {
		var str = this;
		return str.length < 6 ? false : M.validators.phone.test(str);
	};

	SP.isURL = function() {
		var str = this;
		return str.length <= 7 ? false : M.validators.url.test(str);
	};

	SP.parseInt = function(def) {
		var str = this.trim();
		var val = str.match(M.regexp.int);
		if (!val)
			return def || 0;
		val = +val[0];
		return isNaN(val) ? def || 0 : val;
	};

	SP.parseFloat = function(def) {
		var str = this.trim();
		var val = str.match(M.regexp.float);
		if (!val)
			return def || 0;
		val = val[0];
		if (val.indexOf(',') !== -1)
			val = val.replace(',', '.');
		val = +val;
		return isNaN(val) ? def || 0 : val;
	};

	AP.trim = function() {
		var self = this;
		var output = [];
		for (var i = 0, length = self.length; i < length; i++) {
			if (typeof(self[i]) === 'string')
				self[i] = self[i].trim();
			self[i] && output.push(self[i]);
		}
		return output;
	};

	AP.findIndex = function(cb, value) {

		var self = this;
		var isFN = typeof(cb) === 'function';
		var isV = value !== undefined;

		for (var i = 0, length = self.length; i < length; i++) {
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

	AP.findAll = function(cb, value) {

		var self = this;
		var isFN = typeof(cb) === 'function';
		var isV = value !== undefined;
		var arr = [];

		for (var i = 0, length = self.length; i < length; i++) {
			if (isFN) {
				cb.call(self, self[i], i) && arr.push(self[i]);
			} else if (isV) {
				self[i][cb] === value && arr.push(self[i]);
			} else
				self[i] === cb && arr.push(self[i]);
		}
		return arr;
	};

	AP.findItem = function(cb, value) {
		var index = this.findIndex(cb, value);
		if (index !== -1)
			return this[index];
	};

	AP.remove = function(cb, value) {

		var self = this;
		var arr = [];
		var isFN = typeof(cb) === 'function';
		var isV = value !== undefined;

		for (var i = 0, length = self.length; i < length; i++) {
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

	DP.parseDate = function() {
		return this;
	};

	DP.add = function(type, value) {

		if (value === undefined) {
			var arr = type.split(' ');
			type = arr[1];
			value = parseInt(arr[0]);
		}

		if (typeof(value) === 'string')
			value = value.env();

		var self = this;
		var dt = new Date(self.getTime());

		switch(type.substring(0, 3)) {
			case 's':
			case 'ss':
			case 'sec':
				dt.setSeconds(dt.getSeconds() + value);
				return dt;
			case 'm':
			case 'mm':
			case 'min':
				dt.setMinutes(dt.getMinutes() + value);
				return dt;
			case 'h':
			case 'hh':
			case 'hou':
				dt.setHours(dt.getHours() + value);
				return dt;
			case 'd':
			case 'dd':
			case 'day':
				dt.setDate(dt.getDate() + value);
				return dt;
			case 'w':
			case 'ww':
			case 'wee':
				dt.setDate(dt.getDate() + (value * 7));
				return dt;
			case 'M':
			case 'MM':
			case 'mon':
				dt.setMonth(dt.getMonth() + value);
				return dt;
			case 'y':
			case 'yy':
			case 'yyy':
			case 'yea':
				dt.setFullYear(dt.getFullYear() + value);
				return dt;
		}
		return dt;
	};

	DP.format = function(format) {

		var self = this;

		if (!format)
			return self.getFullYear() + '-' + (self.getMonth() + 1).toString().padLeft(2, '0') + '-' + self.getDate().toString().padLeft(2, '0') + 'T' + self.getHours().toString().padLeft(2, '0') + ':' + self.getMinutes().toString().padLeft(2, '0') + ':' + self.getSeconds().toString().padLeft(2, '0') + '.' + self.getMilliseconds().toString().padLeft(3, '0') + 'Z';

		var key = 'dt_' + format;

		if (statics[key])
			return statics[key](self);

		var half = false;

		format = format.env();

		if (format && format.substring(0, 1) === '!') {
			half = true;
			format = format.substring(1);
		}

		var beg = '\'+';
		var end = '+\'';
		var before = [];

		var ismm = false;
		var isdd = false;
		var isww = false;

		format = format.replace(M.regexp.date, function(key) {
			switch (key) {
				case 'yyyy':
					return beg + 'd.getFullYear()' + end;
				case 'yy':
					return beg + 'd.getFullYear().toString().substring(2)' + end;
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
					isdd = true;
					return beg + 'dd.substring(0, 2).toUpperCase()' + end;
				case 'dddd':
					isdd = true;
					return beg + 'dd' + end;
				case 'dd':
					return beg + 'd.getDate().padLeft(2, \'0\')' + end;
				case 'd':
					return beg + 'd.getDate()' + end;
				case 'HH':
				case 'hh':
					return beg + (half ? 'window.$jcdatempam(d.getHours()).padLeft(2, \'0\')' : 'd.getHours().padLeft(2, \'0\')') + end;
				case 'H':
				case 'h':
					return beg + (half ? 'window.$jcdatempam(d.getHours())' : 'd.getHours()') + end;
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
					var b = "'PM':'AM'";
					return beg + '(d.getHours() >= 12 ? ' + b + ')' + end;
			}
		});

		ismm && before.push('var mm = M.months[d.getMonth()];');
		isdd && before.push('var dd = M.days[d.getDay()];');
		isww && before.push('var ww = new Date(+d);ww.setHours(0, 0, 0);ww.setDate(ww.getDate() + 4 - (ww.getDay() || 7));ww = Math.ceil((((ww - new Date(ww.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);');

		statics[key] = new Function('d', before.join('\n') + 'return \'' + format + '\';');
		return statics[key](self);
	};

	W.$jcdatempam = function(value) {
		return value >= 12 ? value - 12 : value;
	};

	NP.pluralize = function(zero, one, few, other) {

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

		return value.indexOf('#') === -1 ? value : value.replace(M.regexp.pluralize, function(text) {
			return text === '##' ? num.format() : num.toString();
		});
	};

	NP.format = function(decimals, separator, separatorDecimal) {

		var self = this;
		var num = self.toString();
		var dec = '';
		var output = '';
		var minus = num.substring(0, 1) === '-' ? '-' : '';
		if (minus)
			num = num.substring(1);

		var index = num.indexOf('.');

		if (typeof(decimals) === 'string') {
			var tmp;
			if (decimals.substring(0, 1) === '[') {
				tmp = ENV(decimals.substring(1, decimals.length - 1));
				if (tmp) {
					decimals = tmp.decimals;
					if (tmp.separator)
						separator = tmp.separator;
					if (tmp.decimalseparator)
						separatorDecimal = tmp.decimalseparator;
				}
			} else {
				tmp = separator;
				separator = decimals;
				decimals = tmp;
			}
		}

		if (separator === undefined)
			separator = M.defaults.thousandsseparator;

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
			separatorDecimal = M.defaults.decimalseparator;

		return minus + output + (dec.length ? separatorDecimal + dec : '');
	};

	SP.padLeft = function(t, e) {
		var r = this.toString();
		return Array(Math.max(0, t - r.length + 1)).join(e || ' ') + r;
	};

	SP.padRight = function(t, e) {
		var r = this.toString();
		return r + Array(Math.max(0, t - r.length + 1)).join(e || ' ');
	};

	NP.padLeft = function(t, e) {
		return this.toString().padLeft(t, e || '0');
	};

	NP.padRight = function(t, e) {
		return this.toString().padRight(t, e || '0');
	};

	NP.async = function(fn, callback) {
		var number = this;
		if (number >= 0)
			fn(number, function() {
				setTimeout(function() {
					(number - 1).async(fn, callback);
				}, 1);
			});
		else
			callback && callback();
		return number;
	};

	NP.add = NP.inc = function(value, decimals) {

		var self = this;

		if (value == null)
			return self;

		if (typeof(value) === 'number')
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

	NP.floor = function(decimals) {
		return Math.floor(this * Math.pow(10, decimals)) / Math.pow(10, decimals);
	};

	NP.parseDate = function(offset) {
		return new Date(this + (offset || 0));
	};

	SP.format = function() {
		var arg = arguments;
		return this.replace(M.regexp.format, function(text) {
			var value = arg[+text.substring(1, text.length - 1)];
			return value == null ? '' : value instanceof Array ? value.join('') : value;
		});
	};

	SP.parseDate = function() {
		var self = this.trim();
		if (!self)
			return null;

		var lc = self.charCodeAt(self.length - 1);

		// Classic date
		if (lc === 41)
			return new Date(self);

		// JSON format
		if (lc === 90)
			return new Date(Date.parse(self));

		var arr = self.indexOf(' ') === -1 ? self.split('T') : self.split(' ');
		var index = arr[0].indexOf(':');
		var length = arr[0].length;

		if (index !== -1) {
			var tmp = arr[1];
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

		parsed.push(+date[firstDay ? 2 : 0]); // year
		parsed.push(+date[1]); // month
		parsed.push(+date[firstDay ? 0 : 2]); // day
		parsed.push(+time[0]); // hours
		parsed.push(+time[1]); // minutes
		parsed.push(+time[2]); // seconds
		parsed.push(+time[3]); // miliseconds

		var def = W.DATETIME = new Date();

		for (var i = 0, length = parsed.length; i < length; i++) {
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

	AP.last = function(def) {
		var item = this[this.length - 1];
		return item === undefined ? def : item;
	};

	AP.quicksort = function(name, asc, maxlength) {

		var self = this;
		var length = self.length;
		if (!length || length === 1)
			return self;

		if (typeof(name) === 'boolean') {
			asc = name;
			name = undefined;
		}

		if (maxlength === undefined)
			maxlength = 5;

		if (asc === undefined)
			asc = true;

		var self = self;
		var type = 0;
		var field = name ? self[0][name] : self[0];

		switch (typeof(field)) {
			case 'string':
				if (field.isJSONDate())
					type = 4;
				else
					type = 1;
				break;
			case 'number':
				type = 2;
				break;
			case 'boolean':
				type = 3;
				break;
			default:
				if (!(field instanceof Date))
					return self;
				type = 4;
				break;
		}

		self.sort(function(a, b) {

			var va = name ? a[name] : a;
			var vb = name ? b[name] : b;

			// String
			if (type === 1) {
				return va && vb ? (asc ? LCOMPARER(va.substring(0, maxlength), vb.substring(0, maxlength)) : LCOMPARER(vb.substring(0, maxlength), va.substring(0, maxlength))) : 0;
			} else if (type === 2) {
				return va > vb ? (asc ? 1 : -1) : va < vb ? (asc ? -1 : 1) : 0;
			} else if (type === 3) {
				return va === true && vb === false ? (asc ? 1 : -1) : va === false && vb === true ? (asc ? -1 : 1) : 0;
			} else if (type === 4) {
				if (!va || !vb)
					return 0;
				if (!va.getTime)
					va = new Date(va);
				if (!vb.getTime)
					vb = new Date(vb);
				var at = va.getTime();
				var bt = vb.getTime();
				return at > bt ? (asc ? 1 : -1) : at < bt ? (asc ? -1 : 1) : 0;
			}
			return 0;
		});

		return self;
	};

	AP.attr = function(name, value) {

		var self = this;

		if (arguments.length === 2) {
			if (value == null)
				return self;
		} else if (value === undefined)
			value = name.toString();

		self.push(name + '="' + value.toString().env().toString().replace(/[<>&"]/g, function(c) {
			switch (c) {
				case '&': return '&amp;';
				case '<': return '&lt;';
				case '>': return '&gt;';
				case '"': return '&quot;';
			}
			return c;
		}) + '"');

		return self;
	};

	AP.scalar = function(type, key, def) {

		var output = def;
		var isDate = false;
		var isAvg = type === 'avg' || type === 'average';
		var isDistinct = type === 'distinct';
		var self = this;

		for (var i = 0, length = self.length; i < length; i++) {
			var val = key ? self[i][key] : self[i];

			if (typeof(val) === 'string')
				val = val.parseFloat();

			if (val instanceof Date) {
				isDate = true;
				val = val.getTime();
			}

			if (isDistinct) {
				if (!output)
					output = [];
				output.indexOf(val) === -1 && output.push(val);
				continue;
			}

			if (type === 'median') {
				if (!output)
					output = [];
				output.push(val);
				continue;
			}

			if (type === 'sum' || isAvg) {
				if (output)
					output += val;
				else
					output = val;
				continue;
			}

			if (type !== 'range') {
				if (!output)
					output = val;
			} else {
				if (!output) {
					output = new Array(2);
					output[0] = val;
					output[1] = val;
				}
			}

			switch (type) {
				case 'range':
					output[0] = Math.min(output[0], val);
					output[1] = Math.max(output[1], val);
					break;
				case 'min':
					output = Math.min(output, val);
					break;
				case 'max':
					output = Math.max(output, val);
					break;
			}
		}

		if (isDistinct)
			return output;

		if (isAvg) {
			output = output / self.length;
			return isDate ? new Date(output) : output;
		}

		if (type === 'median') {
			output.sort(function(a, b) {
				return a - b;
			});
			var half = Math.floor(output.length / 2);
			output = output.length % 2 ? output[half] : (output[half - 1] + output[half]) / 2.0;
		}

		if (isDate) {
			if (typeof(output) === 'number')
				return new Date(output);
			output[0] = new Date(output[0]);
			output[1] = new Date(output[1]);
		}

		return output;
	};

	// Waits for jQuery
	WAIT(function() {
		return W.jQuery ? true : false;
	}, function() {

		setInterval(function() {
			temp = {};
			paths = {};
			cleaner();
		}, (1000 * 60) * 5);

		// scheduler
		schedulercounter = 0;
		setInterval(function() {

			if (!schedulers.length)
				return;

			schedulercounter++;
			var now = new Date();
			W.DATETIME = now;
			for (var i = 0, length = schedulers.length; i < length; i++) {
				var item = schedulers[i];
				if (item.type === 'm') {
					if (schedulercounter % 30 !== 0)
						continue;
				} else if (item.type === 'h') {
					// 1800 seconds --> 30 minutes
					// 1800 / 2 (seconds) --> 900
					if (schedulercounter % 900 !== 0)
						continue;
				}

				var dt = now.add(item.expire);
				FIND(item.selector, true).forEach(function(component) {
					component && component.usage.compare(item.name, dt) && item.callback(component);
				});
			}
		}, 3500);

		$.fn.aclass = function(a) {
			return this.addClass(a);
		};

		$.fn.rclass = function(a) {
			return a == null ? this.removeClass() : this.removeClass(a);
		};

		$.fn.rattr = function(a) {
			return this.removeAttr(a);
		};

		$.fn.rattrd = function(a) {
			return this.removeAttr('data-' + a);
		};

		$.fn.rclass2 = function(a) {

			var self = this;
			var arr = self.attr('class').split(' ');
			var isReg = typeof(a) === 'object';

			for (var i = 0, length = arr.length; i < length; i++) {
				var cls = arr[i];
				if (cls) {
					if (isReg) {
						a.test(cls) && self.rclass(cls);
					} else {
						cls.indexOf(a) !== -1 && self.rclass(cls);
					}
				}
			}

			return self;
		};

		$.fn.hclass = function(a) {
			return this.hasClass(a);
		};

		$.fn.tclass = function(a, v) {
			return this.toggleClass(a, v);
		};

		$.fn.attrd = function(a, v) {
			a = 'data-' + a;
			return v == null ? this.attr(a) : this.attr(a, v);
		};

		// Appends an SVG element
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

		$.fn.component = function() {
			var com = this.data(ATTRDATA);
			return com instanceof COM || com instanceof Array ? com : null;
		};

		$.fn.components = function(fn) {
			var all = this.find(ATTRCOM);
			var output;
			all.each(function(index) {
				var com = $(this).data(ATTRDATA);
				var isarr = com instanceof Array;
				if (com instanceof COM || isarr) {
					if (isarr) {
						com.forEach(function(o) {
							if (o && o.$ready && !o.$removed) {
								if (fn)
									return fn.call(o, index);
								if (!output)
									output = [];
								output.push(o);
							}
						});
					} else if (com && com.$ready && !com.$removed) {
						if (fn)
							return fn.call(com, index);
						if (!output)
							output = [];
						output.push(com);
					}
				}
			});
			return fn ? all : output;
		};

		$.fn.rescroll = function(offset, bottom) {
			var t = this;
			t.each(function() {
				var e = this;
				var el = e;
				el.scrollIntoView(true);
				if (offset) {
					var count = 0;
					while (el && el.scrollTop == 0 && count++ < 25) {
						el = el.parentNode;
						if (el && el.scrollTop) {

							var off = el.scrollTop + offset;

							if (bottom != false) {
								if (el.scrollTop + el.getBoundingClientRect().height >= el.scrollHeight) {
									el.scrollTop = el.scrollHeight;
									return;
								}
							}

							el.scrollTop = off;
							return;
						}
					}
				}
			});
			return t;
		};

		$.components = M;

		setInterval(function() {
			W.DATETIME = new Date();
			var c = M.components;
			for (var i = 0, length = c.length; i < length; i++)
				c[i].knockknock && c[i].knockknock(knockknockcounter);
			c = M.apps;
			for (var i = 0, length = c.length; i < length; i++) {
				c[i].knockknock && c[i].knockknock(knockknockcounter);
				c[i].emit('knockknock', knockknockcounter);
			}
			M.emit('knockknock', knockknockcounter++);
		}, 60000);

		$(document).ready(function() {

			if ($ready) {
				clearTimeout($ready);
				load();
			}

			$(W).on('resize', mediaquery);
			$(W).on('orientationchange', mediaquery);
			mediaquery();

			$(document).on('input change keypress keydown blur', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function(e) {

				var self = this;

				// tab, alt, ctrl, shift, capslock
				var code = e.keyCode || e.which;

				// IE 9+ PROBLEM
				if ((e.type === 'input' && self.type !== 'range') || (e.type === 'keypress'))
					return !(self.tagName !== 'TEXTAREA' && code === 13);

				var special = self.type === 'checkbox' || self.type === 'radio' || self.type === 'range';

				if ((e.type === 'focusout' && special) || (e.type === 'change' && (!special && self.tagName !== 'SELECT')) || (!self.$com || self.$com.$removed || !self.$com.getter))
					return;

				if (e.metaKey || code === 9 || (code > 15 && code < 21) || (code > 36 && code < 41)) {

					// Paste / Cut
					if (code !== 86 && code !== 88) {
						self.$value = null;
						return;
					}
				}

				// Backspace
				if (code === 8 && !self.value)
					return;

				if (self.$skip && e.type === 'focusout') {
					keypress(self, self.$value, e);
					return;
				}

				var old = self.$value;
				var value;

				// cleans old value
				self.$value = null;

				if (self.type === 'checkbox' || self.type === 'radio') {
					if (e.type === 'keydown')
						return;
					var value = self.checked;
					self.$com.dirty(false, true);
					self.$com.getter(value, 2);
					self.$com.$skip = false;
					return;
				}

				if (self.tagName === 'SELECT') {
					if (e.type === 'keydown' || self.selectedIndex === -1)
						return;
					var selected = self[self.selectedIndex];
					value = selected.value;
					var dirty = false;
					if (self.$com.$dirty)
						dirty = true;
					self.$com.dirty(false, true);
					self.$com.getter(value, 2, dirty, old, e.type === 'focusout');
					self.$com.$skip = false;
					return;
				}

				if (self.$delay === undefined)
					self.$delay = parseInt(attrcom(self, 'keypress-delay') || '0');

				if (self.$only === undefined)
					self.$only = attrcom(self, 'keypress-only') === 'true';

				if ((self.$only && (e.type === 'focusout' || e.type === 'change')) || (e.type === 'keydown' && (code === undefined || code === 9)))
					return;

				if (code && code < 41 && code !== 8 && code !== 32) {
					if (code !== 13)
						return;
					if (e.tagName !== 'TEXTAREA') {
						self.$value = self.value;
						clearTimeout2('M$timeout');
						keypress(self, old, e);
						return;
					}
				}

				if (self.$nkp === undefined) {
					var v = attrcom(self, 'keypress');
					if (v)
						self.$nkp = v === 'false';
					else
						self.$nkp = M.defaults.keypress === false;
				}

				var delay = self.$delay;
				if (self.$nkp) {
					if (e.type === 'keydown' || e.type === 'focusout')
						return;
					if (!delay)
						delay = 1;
				} else if (!delay)
					delay = M.defaults.delay;

				if (e.type === 'focusout')
					delay = 0;

				setTimeout2('M$timeout', function() {
					keypress(self, old, e);
				}, delay);
			});

			setTimeout(compile, 2);
		});
	}, 100);

	M.$parser.push(function(path, value, type) {

		switch (type) {
			case 'number':
			case 'currency':
			case 'float':

				if (typeof(value) === 'string')
					value = value.replace(REGEMPTY, '').replace(REGCOMMA, '.');
				var v = +value;
				return isNaN(v) ? null : v;

			case 'date':
			case 'datetime':

				if (value instanceof Date)
					return value;

				if (!value)
					return null;

				value = value.parseDate();
				return value && value.getTime() ? value : null;
		}

		return value;
	});

})();