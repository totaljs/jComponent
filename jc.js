(function() {

	// Constants
	var REGCOM = /(data-jc|data-jc-controller)=|COMPONENT\(/;
	var REGSCRIPT = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGCSS = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGENV = /(\[.*?\])/gi;
	var REGPARAMS = /\{{1,2}[a-z0-9_.-\s]+\}{1,2}/gi;
	var REGEMPTY = /\s/g;
	var REGCOMMA = /,/g;
	var REGGROUP = /\{[a-z0-9\-,\s]+\}/i;
	var REGBACKUP = /^backup\s/i;
	var REGSEARCH = /[^a-zA-Zá-žÁ-Žа-яА-Я\d\s:]/g;
	var REGMETA = /_{2,}/;
	var REGWILDCARD = /\.\*/;
	var REGISARR = /\[\d+\]$/;
	var ATTRSCOPECTRL = '[data-jc-controller]';
	var ATTRCOM = '[data-jc]';
	var ATTRURL = '[data-jc-url]';
	var ATTRDATA = 'jc';
	var ATTRDEL = 'data-jc-removed';
	var ATTRREL = 'data-jc-released';
	var SELINPUT = 'input,textarea,select';
	var DIACRITICS = {225:'a',228:'a',269:'c',271:'d',233:'e',283:'e',357:'t',382:'z',250:'u',367:'u',252:'u',369:'u',237:'i',239:'i',244:'o',243:'o',246:'o',353:'s',318:'l',314:'l',253:'y',255:'y',263:'c',345:'r',341:'r',328:'n',337:'o'};
	var ACTRLS = { INPUT: true, TEXTAREA: true, SELECT: true };
	var OK = Object.keys;
	var A = '-->';

	var LCOMPARER = window.Intl ? window.Intl.Collator().compare : function(a, b) {
		return a.localeCompare(b);
	};

	var C = {}; // COMPILER
	var M = {}; // MAIN
	var L = {}; // CONTROLLERS
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
	var fallback = { $: 0 }; // $ === count of new items in fallback
	var fallbackpending = [];
	var paths = {}; // saved paths from get() and set()
	var events = {};
	var watches = [];
	var temp = {};
	var mediaqueries = [];
	var singletons = {};
	var schedulers = [];
	var toggles = [];
	var versions = {};
	var warnings = {};
	var schemas = {};
	var autofill = [];
	var defaults = {};
	var waits = {};
	var operations = {};
	var statics = {};
	var proxy = {};
	var ajaxconfig = {};
	var skips = {};
	var $ready = setTimeout(load, 2);
	var $loaded = false;
	var $domready = false;
	var schedulercounter = 0;
	var mediaqueriescounter = 0;
	var knockknockcounter = 0;

	var current_ctrl = null;
	var current_owner = null;

	W.MAIN = W.M = W.jC = W.COM = M;
	W.CONTROLLERS = L;
	W.EMPTYARRAY = [];
	W.EMPTYOBJECT = {};
	W.DATETIME = new Date();

	var MD = W.DEF = M.defaults = {};
	var ENV = MD.environment = {};
	MD.delay = 555;
	MD.delaywatcher = 555;
	MD.delaybinder = 200;
	MD.delayrepeat = 2000;
	MD.keypress = true;
	MD.localstorage = true;
	MD.jsoncompress = false;
	MD.jsondate = true;
	MD.ajaxerrors = false;
	MD.fallback = 'https://cdn.componentator.com/j-{0}.html';
	MD.fallbackcache = '';
	MD.version = '';
	MD.headers = { 'X-Requested-With': 'XMLHttpRequest' };
	MD.devices = { xs: { max: 768 }, sm: { min: 768, max: 992 }, md: { min: 992, max: 1200 }, lg: { min: 1200 }};
	MD.importcache = 'session';
	MD.pingdata = {};
	MD.baseurl = ''; // String or Function
	MD.makeurl = null; // Function
	MD.jsonconverter = {
		'text json': function(text) {
			return PARSE(text);
		}
	};

	MD.thousandsseparator = ' ';
	MD.decimalseparator = '.';

	W.MONTHS = M.months = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
	W.DAYS = M.days = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

	M.skipproxy = '';

	var MV = M.validators = {};
	MV.url = /^(https?:\/\/(?:www\.|(?!www))[^\s.#!:?+=&@!$'~*,;/()[\]]+\.[^\s#!?+=&@!$'~*,;()[\]\\]{2,}\/?|www\.[^\s#!:.?+=&@!$'~*,;/()[\]]+\.[^\s#!?+=&@!$'~*,;()[\]\\]{2,}\/?)/i;
	MV.phone = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
	MV.email = /^[a-zA-Z0-9-_.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

	var MR = M.regexp = {};
	MR.int = /(-|\+)?[0-9]+/;
	MR.float = /(-|\+)?[0-9.,]+/;
	MR.date = /yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|a|ww|w/g;
	MR.pluralize = /#{1,}/g;
	MR.format = /\{\d+\}/g;

	M.loaded = false;
	M.version = 'v14.3.3';
	M.$localstorage = 'jc';
	M.$version = '';
	M.$language = '';

	M.$components = {};
	M.components = [];
	M.$formatter = [];
	M.$parser = [];
	M.transforms = {};
	L.items = M.controllers = {};
	M.compiler = C;

	C.is = false;
	C.recompile = false;
	C.importing = 0;
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

	W.NEWTRANSFORM = W.CREATETRANSFORM = function(name, callback) {
		M.transforms[name] = callback;
		return W;
	};

	W.TRANSFORM = function(name, value, callback) {

		var m = M.transforms;

		if (arguments.length === 2) {
			// name + value (is callback)
			return function(val) {
				W.TRANSFORM(name, val, value);
			};
		}

		var cb = function() {
			if (typeof(callback) === 'string')
				SET(callback, value);
			else
				callback(value);
		};

		var keys = name.split(',');
		var async = [];
		var context = {};

		context.value = value;

		for (var i = 0, length = keys.length; i < length; i++) {
			var key = keys[i].trim();
			key && m[key] && async.push(m[key]);
		}

		if (async.length === 1)
			async[0].call(context, value, function(val) {
				if (val !== undefined)
					value = val;
				cb();
			});
		else if (async.length) {
			async.wait(function(fn, next) {
				fn.call(context, value, function(val) {
					if (val !== undefined)
						value = val;
					next();
				});
			}, cb);
		} else
			cb();

		return W;
	};

	// ===============================================================
	// MAIN FUNCTIONS
	// ===============================================================

	M.ENV = W.ENV = function(name, value) {

		if (typeof(name) === 'object') {
			name && OK(name).forEach(function(key) {
				ENV[key] = name[key];
				M.emit('environment', key, name[key]);
			});
			return name;
		}

		if (value !== undefined) {
			M.emit('environment', name, value);
			ENV[name] = value;
			return value;
		}

		return ENV[name];
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

			// Prepend
			if (path === true)
				M.$formatter.unshift(value);
			else
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

			// Prepend
			if (path === true)
				M.$parser.unshift(value);
			else
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
					r = PARSE(r, MD.jsondate);
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

				if (!output.error || MD.ajaxerrors) {
					typeof(callback) === 'string' ? remap(callback.env(), r) : (callback && callback(r, null, output));
				} else {
					M.emit('error', output);
					output.process && typeof(callback) === 'function' && callback({}, r, output);
				}

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

			var keys = OK(MD.headers);
			for (var i = 0; i < keys.length; i++)
				xhr.setRequestHeader(keys[i].env(), MD.headers[keys[i]].env());

			if (headers) {
				var keys = OK(headers);
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

	W.UNWATCH = function(path, fn) {
		return OFF('watch', path, fn);
	};

	W.WATCH = M.watch = function(path, fn, init) {

		if (typeof(path) === 'function') {
			init = fn;
			fn = path;
			path = '*';
		}

		path = ctrl_path(path);
		ON('watch', path, fn, init);
		return M;
	};

	W.ON = M.on = function(name, path, fn, init, context) {

		var owner = null;
		var index = name.indexOf('#');

		if (index) {
			owner = name.substring(0, index).trim();
			name = name.substring(index + 1).trim();
		}

		if (typeof(path) === 'function') {
			fn = path;
			path = name === 'watch' ? '*' : '';
		} else
			path = path.replace('.*', '');

		var obj = { name: name, fn: fn, owner: owner || current_owner, controller: current_ctrl, context: context };

		if (name === 'watch') {
			var arr = [];
			index = path.indexOf(A);

			if (index !== -1) {
				var n = path.substring(index + 3).trim();
				path = path.substring(0, index).trim();
				var is = n.indexOf('=>') === -1;
				if (is) {
					if (n.indexOf('.') !== -1) {
						n = '(value,path,type)=>' + n;
						is = false;
					}
				}
				obj.format = is ? GET(n) : FN(n);
			}

			if (path.substring(path.length - 1) === '.')
				path = path.substring(0, path.length - 1);

			// Temporary
			if (path.charCodeAt(0) === 37)
				path = 'jctmp.' + path.substring(1);

			path = path.env(true);

			// !path = fixed path
			if (path.charCodeAt(0) === 33) {
				path = path.substring(1);
				arr.push(path);
			} else {
				var p = path.split('.');
				var s = [];
				for (var j = 0; j < p.length; j++) {
					var b = p[j].lastIndexOf('[');
					if (b !== -1) {
						var c = s.join('.');
						arr.push(c + (c ? '.' : '') + p[j].substring(0, b));
					}
					s.push(p[j]);
					arr.push(s.join('.'));
				}
			}

			obj.path = path;
			obj.$path = arr;
			watches.push(obj);
			init && fn.call(context || M, path, get(path), 0);
		} else {
			if (events[name])
				events[name].push(obj);
			else
				events[name] = [obj];
			(!C.ready && (name === 'ready' || name === 'init')) && fn();
		}
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

		if (path) {
			path = path.replace('.*', '').trim();
			index = path.indexOf(A);
			if (index !== -1)
				path = path.substring(0, index).trim();
			if (path.substring(path.length - 1) === '.')
				path = path.substring(0, path.length - 1);
		}

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
		else if (name && path)
			type = 7;
		else if (fn)
			type = 6;

		var cleararr = function(arr, key) {
			return arr.remove(function(item) {
				if (type > 2 && type < 5) {
					if (item.path !== path)
						return false;
				}
				var v = false;
				if (type === 1)
					v = item.owner === owner;
				else if (type === 2)
					v = key === name && item.owner === owner;
				else if (type === 3)
					v = key === name && item.owner === owner;
				else if (type === 4)
					v = key === name && item.owner === owner && item.fn === fn;
				else if (type === 5 || type === 6)
					v = key === name && item.fn === fn;
				else if (type === 6)
					v = item.fn === fn;
				else if (type === 7)
					v = key === name && item.path === path;
				else
					v = key === name;
				return v;
			});
		};

		OK(events).forEach(function(p) {
			events[p] = cleararr(events[p], p);
			if (!events[p].length)
				delete events[p];
		});

		watches = cleararr(watches, 'watch');
		return M;
	};

	W.EMIT = M.emit = function(name) {

		var e = events[name];
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
			!obj.disabled && obj.used();
		}, path);
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

		var flags;

		if (isExcept) {
			var is = false;
			flags = {};
			except = except.remove(function(item) {
				if (item.substring(0, 1) === '@') {
					flags[item.substring(1)] = true;
					is = true;
					return true;
				}
				return false;
			});
			!is && (flags = null);
			isExcept = except.length > 0;
		}

		var valid = true;
		var arr = value !== undefined ? [] : null;

		var index = path.lastIndexOf('.*');
		var wildcard = index !== -1;
		if (index !== -1)
			path = path.substring(0, index);

		path = ctrl_path(path);

		var all = M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.$removed || !com.$loaded || !com.path || !com.$compare(path) || (isExcept && com.$except(except)))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && com.find(SELINPUT).is(':disabled')) || (flags.disabled && com.find(SELINPUT).is(':enabled'))))
				continue;

			if (com.disabled || com.$valid_disabled) {
				arr && com.state && arr.push(com);
				continue;
			}

			if (value === undefined) {
				if (com.$valid === false)
					valid = false;
				continue;
			}

			com.state && arr.push(com);

			if (!onlyComponent) {
				if (wildcard || com.path === path) {
					com.$valid = value;
					com.$interaction(102);
				}
			} else if (onlyComponent._id === com._id) {
				com.$valid = value;
				com.$interaction(102);
			}
			if (com.$valid === false)
				valid = false;
		}

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
		var flags;

		if (isExcept) {
			var is = false;
			flags = {};
			except = except.remove(function(item) {
				if (item.substring(0, 1) === '@') {
					flags[item.substring(1)] = true;
					is = true;
					return true;
				}
				return false;
			});
			!is && (flags = null);
			isExcept = except.length > 0;
		}

		var index = path.lastIndexOf('.*');
		var wildcard = index !== -1;
		if (index !== -1)
			path = path.substring(0, index);

		path = ctrl_path(path);

		var all = M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.$removed || !com.$loaded || !com.path || !com.$compare(path) || (isExcept && com.$except(except)))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && com.find(SELINPUT).is(':disabled')) || (flags.disabled && com.find(SELINPUT).is(':enabled'))))
				continue;

			if (com.disabled || com.$dirty_disabled) {
				arr && com.state && arr.push(com);
				continue;
			}

			if (value === undefined) {
				if (com.$dirty === false)
					dirty = false;
				continue;
			}

			com.state && arr.push(com);

			if (!onlyComponent) {
				if (wildcard || com.path === path) {
					com.$dirty = value;
					com.$interaction(101);
				}
			} else if (onlyComponent._id === com._id) {
				com.$dirty = value;
				com.$interaction(101);
			}
			if (com.$dirty === false)
				dirty = false;
		}

		clear('dirty');
		cache[key] = dirty;

		// For double hitting component.state() --> look into COM.invalid()
		!skipEmitState && state(arr, 1, 2);
		return dirty;
	};

	W.IMPORTCACHE = function(url, expire, target, callback, insert, preparator) {

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

		if (url.substring(0, 2) === '//')
			url = location.protocol + url;

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
				if (callback) {
					if (statics[url] === 2)
						callback();
					else {
						WAIT(function() {
							return statics[url] === 2;
						}, callback);
					}
				}
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
			scr.async = false;
			scr.onload = function() {
				statics[url] = 2;
				callback && callback();
				W.jQuery && setTimeout(compile, 300);
			};
			scr.src = makeurl(url, true);
			d.getElementsByTagName('head')[0].appendChild(scr);
			M.emit('import', url, $(scr));
			return M;
		}

		if (ext === '.css') {
			var stl = d.createElement('link');
			stl.type = 'text/css';
			stl.rel = 'stylesheet';
			stl.href = makeurl(url, true);
			d.getElementsByTagName('head')[0].appendChild(stl);
			statics[url] = 2;
			callback && setTimeout(callback, 200);
			M.emit('import', url, $(stl));
			return M;
		}

		WAIT(function() {
			return !!W.jQuery;
		}, function() {

			statics[url] = 2;
			var id = 'import' + W.HASH(url);

			var cb = function(response) {

				if (!response) {
					callback && callback();
					return;
				}

				url = '$import' + url;

				if (preparator)
					response = preparator(response);

				var is = REGCOM.test(response);
				response = importscripts(importstyles(response, id), id).trim();
				target = $(target);

				if (response) {
					if (insert === false)
						target.html(response);
					else
						target.append(response);
				}

				setTimeout(function() {
					// is && compile(response ? target : null);
					// because of controllers and scopes
					is && compile();
					callback && WAIT(function() {
						return C.is == false && C.controllers == 0;
					}, callback);
					M.emit('import', url, target);
				}, 10);
			};

			if (expire)
				AJAXCACHE('GET ' + url, null, cb, expire);
			else
				AJAX('GET ' + url, cb);

		});

		return M;
	};

	W.INJECT = W.IMPORT = M.import = function(url, target, callback, insert, preparator) {
		return W.IMPORTCACHE(url, null, target, callback, insert, preparator);
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

	W.MODIFY = function(path, callback, timeout, reset) {
		W.SET(path, callback(GET(path)), timeout, reset);
		return M;
	};

	W.LASTMODIFICATION = W.USAGE = M.usage = function(name, expire, path, callback) {

		var type = typeof(expire);
		if (type === 'string') {
			var dt = W.DATETIME = new Date();
			expire = dt.add('-' + expire.env()).getTime();
		} else if (type === 'number')
			expire = Date.now() - expire;

		if (typeof(path) === 'function') {
			callback = path;
			path = undefined;
		}

		var arr = [];

		if (path) {
			M.findByPath(path, function(c) {
				if (c.usage[name] < expire)
					return;
				if (callback)
					callback(c);
				else
					arr.push(c);
			});
		} else {
			M.components.forEach(function(c) {
				if (c.usage[name] < expire)
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

	M.createURL = W.MAKEPARAMS = function(url, values, type) {

		var l = location;

		if (typeof(url) === 'object') {
			type = values;
			values = url;
			url = l.pathname + l.search;
		}

		var query;
		var index = url.indexOf('?');
		if (index !== -1) {
			query = M.parseQuery(url.substring(index + 1));
			url = url.substring(0, index);
		} else
			query = {};

		var keys = OK(values);

		for (var i = 0, length = keys.length; i < length; i++) {
			var key = keys[i];
			query[key] = values[key];
		}

		var val = $.param(query, type == null || type === true);
		return url + (val ? '?' + val : '');
	};

	M.parseQuery = W.READPARAMS = function(value) {

		if (!value)
			value = location.search;

		if (!value)
			return {};

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
		var arg = EMPTYARRAY;

		if (!callback && (td === 'function' || td === 'string')) {
			timeout = callback;
			callback = data;
			data = undefined;
		}

		var index = url.indexOf(' ');
		if (index === -1)
			return M;

		var repeat = false;

		url = url.replace(/\srepeat/i, function() {
			repeat = true;
			return '';
		});

		if (repeat) {
			arg = [];
			for (var i = 0; i < arguments.length; i++)
				arg.push(arguments[i]);
		}

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

		setTimeout(function() {

			if (method === 'GET' && data)
				url += '?' + (typeof(data) === 'string' ? data : jQuery.param(data, true));

			var options = {};
			options.method = method;
			options.converters = MD.jsonconverter;

			if (method !== 'GET') {
				if (typeof(data) === 'string') {
					options.data = data;
				} else {
					options.contentType = 'application/json; charset=utf-8';
					options.data = STRINGIFY(data);
				}
			}

			options.headers = $.extend(headers, MD.headers);

			if (url.match(/http:\/\/|https:\/\//i)) {
				options.crossDomain = true;
				delete options.headers['X-Requested-With'];
				if (isCredentials)
					options.xhrFields = { withCredentials: true };
			} else if (MD.baseurl) {
				if (typeof(MD.baseurl) === 'function')
					url = MD.baseurl(url);
				else
					url = MD.baseurl + url;
			}

			var custom = url.match(/\([a-z0-9\-.,]+\)/i);
			if (custom) {
				url = url.replace(custom, '').replace(/\s+/g, '');
				options.url = url;
				custom = custom.toString().replace(/\(|\)/g, '').split(',');
				for (var i = 0; i < custom.length; i++) {
					var opt = ajaxconfig[custom[i].trim()];
					opt && opt(options);
				}
			}

			if (!options.url)
				options.url = url;

			M.emit('request', options);

			if (options.cancel)
				return;

			options.type = options.method;
			delete options.method;

			var output = {};
			output.url = options.url;
			output.process = true;
			output.error = false;
			output.upload = false;
			output.method = method;
			output.data = data;

			delete options.url;

			options.success = function(r, s, req) {
				output.response = r;
				output.status = req.status || 999;
				output.text = s;
				output.headers = parseHeaders(req.getAllResponseHeaders());
				M.emit('response', output);
				if (output.process && !output.cancel) {
					if (typeof(callback) === 'string')
						remap(callback, output.response);
					else
						callback && callback.call(output, output.response, undefined, output);
				}
			};

			options.error = function(req, s) {

				if (!req.status && repeat) {
					// internal error
					// internet doesn't work
					setTimeout(function() {
						arg[0] += ' REPEAT';
						W.AJAX.apply(M, arg);
					}, MD.delayrepeat);
					return;
				}

				output.response = req.responseText;
				output.status = req.status || 999;
				output.text = s;
				output.error = true;
				output.headers = parseHeaders(req.getAllResponseHeaders());
				var ct = output.headers['content-type'];

				if (ct && ct.indexOf('/json') !== -1) {
					try {
						output.response = PARSE(output.response, MD.jsondate);
					} catch (e) {}
				}

				M.emit('response', output);

				if (output.cancel || !output.process)
					return;

				if (MD.ajaxerrors) {
					if (typeof(callback) === 'string')
						remap(callback, output.response);
					else
						callback && callback.call(output, output.response, output.status, output);
				} else {
					M.emit('error', output);
					typeof(callback) === 'function' && callback.call(output, output.response, output.status, output);
				}
			};

			$.ajax(makeurl(output.url), options);

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
			clear = timeout === true;
			timeout = 0;
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

	W.CLEARCACHE = function() {
		if (!W.isPRIVATEMODE) {
			var rem = localStorage.removeItem;
			var k = M.$localstorage;
			rem(k);
			rem(k + '.cache');
			rem(k + '.blocked');
		}
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
			if (!obj.disabled && (!except || !obj.$except(except)) && obj.$valid === false && !obj.$valid_disabled)
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

	W.INVALID = function(path, onlyComponent) {
		path = ctrl_path(path);
		if (path) {
			M.dirty(path, false, onlyComponent, true);
			M.valid(path, false, onlyComponent);
		}
		return M;
	};

	W.BLOCKED = function(name, timeout, callback) {
		var key = name;
		var item = blocked[key];
		var now = Date.now();

		if (item > now)
			return true;

		if (typeof(timeout) === 'string')
			timeout = timeout.env().parseExpire();

		var local = MD.localstorage && timeout > 10000;
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

		path = path.replace(REGWILDCARD, '');
		if (!path)
			return M;

		var state = [];

		if (type === undefined)
			type = 1; // manually

		M.skipproxy = path;

		var all = M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.disabled || com.$removed || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			var result = com.get();
			if (com.setter) {
				com.$skip = false;
				com.setterX(result, path, type);
				com.$interaction(type);
			}

			if (!com.$ready)
				com.$ready = true;

			if (reset === true) {

				if (!com.$dirty_disabled) {
					com.$dirty = true;
					com.$interaction(101);
				}

				if (!com.$valid_disabled) {
					com.$valid = true;
					com.$validate = false;
					if (com.validate) {
						com.$valid = com.validate(result);
						com.$interaction(102);
					}
				}

				findcontrol2(com);

			} else if (com.validate && !com.$valid_disabled)
				com.valid(com.validate(result), true);

			com.state && state.push(com);
		}

		reset && clear('dirty', 'valid');

		for (var i = 0, length = state.length; i < length; i++)
			state[i].stateX(1, 4);

		emitwatch(path, get(path), type);
		return M;
	};

	W.NOTIFY = M.notify = function() {

		var arg = arguments;
		var all = M.components;

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path)
				continue;

			var is = 0;
			for (var j = 0; j < arg.length; j++) {
				if (com.path === arg[j]) {
					is = 1;
					break;
				}
			}

			if (is) {
				var val = com.get();
				com.setter && com.setterX(val, com.path, 1);
				com.state && com.stateX(1, 6);
				com.$interaction(1);
			}
		}

		for (var j = 0; j < arg.length; j++)
			emitwatch(arg[j], GET(arg[j]), 1);

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

	W.REWRITE = M.rewrite = function(path, value, type) {
		path = ctrl_path(path);
		if (path) {
			M.skipproxy = path;
			set(path, value, type);
			emitwatch(path, value, type);
		}
		return M;
	};

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
	// 3 === default
	M.set = function(path, value, type) {
		path = ctrl_path(path);

		if (!path)
			return M;

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

		M.skipproxy = path;
		set(path, value, type);

		if (isUpdate)
			return M.update(path, reset, type, true);

		var result = get(path);
		var state = [];

		if (type === undefined)
			type = 1;

		var all = M.components;

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.disabled || com.$removed || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			if (com.setter) {
				if (com.path === path) {
					if (com.setter) {
						com.setterX(result, path, type);
						com.$interaction(type);
					}
				} else {
					if (com.setter) {
						com.setterX(get(com.path), path, type);
						com.$interaction(type);
					}
				}
			}

			if (!com.$ready)
				com.$ready = true;

			type !== 3 && com.state && state.push(com);

			if (reset) {
				if (!com.$dirty_disabled)
					com.$dirty = true;
				if (!com.$valid_disabled) {
					com.$valid = true;
					com.$validate = false;
					if (com.validate) {
						com.$valid = com.validate(result);
						com.$interaction(102);
					}
				}

				findcontrol2(com);

			} else if (com.validate && !com.$valid_disabled)
				com.valid(com.validate(result), true);
		}

		reset && clear('dirty', 'valid');

		for (var i = 0, length = state.length; i < length; i++)
			state[i].stateX(type, 5);

		emitwatch(path, result, type);
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
		M.skipproxy = path;

		if (value instanceof Array) {
			if (value.length)
				arr.push.apply(arr, value);
			else
				is = false;
		} else
			arr.push(value);

		if (n)
			M.set(path, arr, type);
		else if (is)
			M.update(path, undefined, type);

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

		M.each(function(obj) {
			obj.remove(true);
		}, ctrl_path(path));

		setTimeout2('$cleaner', cleaner2, 100);
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
			var d = PARSE(declaration, MD.jsondate);
			schemas[name] = d;
			return d;
		}
	};

	W.VALIDATE = M.validate = function(path, except) {

		var arr = [];
		var valid = true;

		path = ctrl_path(path.replace(REGWILDCARD, ''));

		var flags;
		if (except) {
			var is = false;
			flags = {};
			except = except.remove(function(item) {
				if (item.substring(0, 1) === '@') {
					flags[item.substring(1)] = true;
					is = true;
					return true;
				}
				return false;
			});
			!is && (flags = null);
			!except.length && (except = null);
		}

		var all = M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && com.find(SELINPUT).is(':disabled')) || (flags.disabled && com.find(SELINPUT).is(':enabled'))))
				continue;

			com.state && arr.push(com);

			if (com.$valid_disabled)
				continue;

			com.$validate = true;
			if (com.validate) {
				com.$valid = com.validate(get(com.path));
				com.$interaction(102);
				if (!com.$valid)
					valid = false;
			}
		}

		clear('valid');
		state(arr, 1, 1);
		// emit('validate', path);
		return valid;
	};

	M.validate2 = function(com) {

		var valid = true;

		if (com.disabled)
			return valid;

		if (com.$valid_disabled)
			return valid;

		var arr = [];
		com.state && arr.push(com);
		com.$validate = true;

		if (com.validate) {
			com.$valid = com.validate(get(com.path));
			com.$interaction(102);
			if (!com.$valid)
				valid = false;
		}

		clear('valid');
		state(arr, 1, 1);
		// emit('validate', com.path);
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

		path = ctrl_path(path).replace(REGWILDCARD, '');

		// Reset scope
		var key = path.replace(/\.\*$/, '');
		var fn = defaults['#' + W.HASH(key)];
		var tmp;

		if (fn) {
			tmp = fn();
			set(key, tmp);
		}

		var arr = [];
		var all = M.components;

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			if (com.state)
				arr.push(com);

			if (onlyComponent && onlyComponent._id !== com._id)
				continue;

			com.$default && com.set(com.path, com.$default(), 3);

			if (!reset)
				return;

			findcontrol2(com);

			if (!com.$dirty_disabled)
				com.$dirty = true;
			if (!com.$valid_disabled) {
				com.$valid = true;
				com.$validate = false;
				if (com.validate) {
					com.$valid = com.validate(com.get());
					com.$interaction(102);
				}
			}
		}

		// emit('default', path);

		if (reset) {
			clear('valid', 'dirty');
			state(arr, 3, 3);
			// emit('reset', path);
		}

		return M;
	};

	W.RESET = M.reset = function(path, timeout, onlyComponent) {

		if (timeout > 0) {
			setTimeout(function() {
				M.reset(path);
			}, timeout);
			return M;
		}

		path = ctrl_path(path).replace(REGWILDCARD, '');

		var arr = [];
		var all = M.components;

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			com.state && arr.push(com);

			if (onlyComponent && onlyComponent._id !== com._id)
				continue;

			findcontrol2(com);

			if (!com.$dirty_disabled) {
				com.$dirty = true;
				com.$interaction(101);
			}

			if (!com.$valid_disabled) {
				com.$valid = true;
				com.$validate = false;
				if (com.validate) {
					com.$valid = com.validate(com.get());
					com.$interaction(102);
				}
			}
		}

		clear('valid', 'dirty');
		state(arr, 1, 3);
		// emit('reset', path);
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

		var selected;
		if (isMany) {
			callback = undefined;
			selected = [];
		}

		var all = M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || !com.$loaded || !com.path || com.path !== path)
				continue;
			if (isCallback) {
				var o = callback(com);
				if (o === true)
					return;
			}
			if (isMany)
				selected.push(com);
			else
				return com;
		}

		return isCallback ? M : selected;
	};

	M.each = function(fn, path) {
		var wildcard = path ? path.lastIndexOf('*') !== -1 : false;
		if (wildcard)
			path = path.replace('.*', '');
		var all = M.components;
		var index = 0;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || !com.$loaded || com.$removed || (path && (!com.path || !com.$compare(path))))
				continue;
			var stop = fn(com, index++, wildcard);
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
		OK(M.controllers).forEach(function(key) {
			var c = M.controllers[key];
			c.emit.call(c, a, b, c, d, e);
		});
		return L;
	};

	L.remove = function(name) {
		OK(M.controllers).forEach(function(key) {
			if (!name || key === name)
				M.controllers[key].remove();
		});
		return L;
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
		var d = MD.devices;

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

	function attrcom(el, name) {
		name = name ? '-' + name : '';
		return el.getAttribute ? el.getAttribute('data-jc' + name) : el.attrd('jc' + name);
	}

	function crawler(container, onComponent, level, controller, scopes) {

		if (container)
			container = $(container).get(0);
		else
			container = document.body;

		if (!container)
			return;

		if (level == null || level === 0) {
			scopes = [];
			if (container !== document.body) {
				var scope = $(container).closest('[data-jc-scope]');
				scope && scope.length && scopes.push(scope.get(0));
			}
		}

		var released = container ? attrcom(container, 'released') === 'true' : false;
		var tmp = attrcom(container, 'controller');
		if (tmp)
			controller = tmp;

		tmp = attrcom(container, 'scope');
		if (tmp)
			scopes.push(container);

		var name = attrcom(container);
		!container.$com && name != null && onComponent(name, container, 0, controller, scopes);

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

				if (el.$com === undefined) {
					name = attrcom(el);
					if (name != null) {
						released && el.setAttribute(ATTRREL, 'true');
						onComponent(name || '', el, level, controller, scopes);
					}
				}
			}
		}

		for (var i = 0, length = sub.length; i < length; i++) {
			el = sub[i];
			el && crawler(el, onComponent, level, controller, scopes && scopes.length ? scopes : []);
		}
	}

	function findcomponent(container, selector, callback) {

		var s = (selector ? selector.split(' ') : EMPTYARRAY);
		var path = '';
		var name = '';
		var id = '';
		var version = '';
		var index;

		for (var i = 0, length = s.length; i < length; i++) {
			switch (s[i].substring(0, 1)) {
				case '*':
					break;
				case '.':
					// path
					path = s[i].substring(1);
					break;
				case '#':
					// id;
					id = s[i].substring(1);
					index = id.indexOf('[');
					if (index !== -1) {
						path = id.substring(index + 1, id.length - 1).trim();
						id = id.substring(0, index);
					}
					break;
				default:
					// name
					name = s[i];
					index = name.indexOf('[');

					if (index !== -1) {
						path = name.substring(index + 1, name.length - 1).trim();
						name = name.substring(0, index);
					}

					index = name.lastIndexOf('@');

					if (index !== -1) {
						version = name.substring(index + 1);
						name = name.substring(0, index);
					}

					break;
			}
		}

		var arr = callback ? undefined : [];
		if (container) {
			var stop = false;
			container.find('[data-jc]').each(function() {
				var com = this.$com;

				if (stop || !com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.$version !== version))
					return;

				if (path) {
					if (com.path !== path) {
						if (!com.pathscope || ((com.pathscope + '.' + path) !== com.path))
							return;
					}
				}

				if (callback) {
					if (callback(com) === false)
						stop = true;
				} else
					arr.push(com);
			});
		} else {
			for (var i = 0, length = M.components.length; i < length; i++) {
				var com = M.components[i];
				if (!com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.$version !== version))
					continue;
				if (path) {
					if (com.path !== path) {
						if (!com.pathscope || ((com.pathscope + '.' + path) !== com.path))
							continue;
					}
				}

				if (callback) {
					if (callback(com) === false)
						break;
				} else
					arr.push(com);
			}
		}

		return arr;
	}

	function findcontrol2(com, input) {

		if (com.$inputcontrol) {
			if (com.$inputcontrol % 2 !== 0) {
				com.$inputcontrol++;
				return;
			}
		}

		var target = input ? input : com.element;
		findcontrol(target.get(0), function(el) {
			if (!el.$com || el.$com !== com) {
				el.$com = com;
				com.$inputcontrol = 1;
			}
		});
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
			if (el && el.tagName) {
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

	function load() {
		clearTimeout($ready);
		if (MD.localstorage) {
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
			obj && OK(obj.value).forEach(function(key) {
				M.set(key, obj.value[key], true);
			});
		}

		W.jQuery && setTimeout(compile, 2);
		M.loaded = true;
	}

	function dependencies(declaration, callback, obj, el) {

		if (declaration.importing) {
			WAIT(function() {
				return declaration.importing !== true;
			}, function() {
				callback(obj, el);
			});
			return;
		}

		if (!declaration.dependencies || !declaration.dependencies.length) {
			setTimeout(function(callback, obj, el) {
				callback(obj, el);
			}, 5, callback, obj, el);
			return;
		}

		declaration.importing = true;
		declaration.dependencies.wait(function(item, next) {
			if (typeof(item) === 'function')
				item(next);
			else
				IMPORT('once ' + item, next);
		}, function() {
			declaration.importing = false;
			callback(obj, el);
		}, 3);
	}

	function compile(container) {

		if (C.is) {
			C.recompile = true;
			return;
		}

		var arr = [];

		W.READY instanceof Array && arr.push.apply(arr, W.READY);
		W.jComponent instanceof Array && arr.push.apply(arr, W.jComponent);
		W.components instanceof Array && arr.push.apply(arr, W.components);

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

		crawler(container, function(name, dom, level, controller, scope) {

			var el = $(dom);
			has = true;

			var meta = name.split(REGMETA);
			if (meta.length) {
				meta = meta.trim(true);
				name = meta[0];
			} else
				meta = null;

			// Check singleton instance
			if (statics['$ST_' + name]) {
				remove(el);
				return;
			}

			var instances = [];
			var all = name.split(',');

			all.forEach(function(name) {

				name = name.trim();

				var is = false;

				if (name.indexOf('|') !== -1) {

					// Multiple versions
					var keys = name.split('|');
					for (var i = 0; i < keys.length; i++) {
						var key = keys[i].trim();
						if (key && M.$components[key]) {
							name = key;
							is = true;
							break;
						}
					}

					if (!is)
						name = keys[0].trim();
				}

				if (!is && name.lastIndexOf('@') === -1) {
					if (versions[name])
						name += '@' + versions[name];
					else if (MD.version)
						name += '@' + MD.version;
				}

				var com = M.$components[name];

				if (!com) {

					if (!fallback[name]) {
						fallback[name] = 1;
						fallback.$++;
					}

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
					C.importing++;

					M.import(x, function() {
						C.importing--;
						C.imports[x] = 2;
					});

					return;
				}

				if (fallback[name] === 1) {
					fallback.$--;
					delete fallback[name];
				}

				var obj = new COM(com.name);
				obj.global = com.shared;
				obj.element = el;
				obj.dom = el.get(0);
				obj.setPath(attrcom(el, 'path') || (meta ? meta[1] : '') || obj._id, 1);
				obj.config = {};

				// Default config
				com.config && obj.reconfigure(com.config, NOOP);

				var tmp = attrcom(el, 'config') || (meta ? meta[2] : '');
				tmp && obj.reconfigure(tmp, NOOP);

				obj.$init = attrcom(el, 'init') || null;
				obj.type = attrcom(el, 'type') || '';
				obj.id = attrcom(el, 'id') || obj._id;
				obj.siblings = all.length > 1;

				com.declaration.call(obj, obj, obj.config);
				meta[3] && el.attrd('jc-value', meta[3]);

				if (obj.init && !statics[name]) {
					statics[name] = true;
					obj.init();
				}

				dom.$com = obj;

				if (!obj.$noscope)
					obj.$noscope = attrcom(el, 'noscope') === 'true';

				var code = obj.path ? obj.path.charCodeAt(0) : 0;
				if (!obj.$noscope && scope.length) {

					var output = initscopes(scope);

					if (obj.path && code !== 33 && code !== 35) {
						obj.setPath(obj.path === '?' ? output.path : (obj.path.indexOf('?') === -1 ? output.path + '.' + obj.path : obj.path.replace(/\?/g, output.path)), 2);
					} else {
						obj.$$path = EMPTYARRAY;
						obj.path = '';
					}

					obj.scope = output;
					obj.$controller = attrcom(scope[scope.length - 1], 'controller') || controller;
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
					// Because sometimes make doesn't contain the content of the element
					setTimeout(function(init, el, obj) {
						obj.make && obj.make();
						init(el, obj);
					}, 5, init, el, obj);
				}
			});

			// A reference to instance
			if (instances.length > 0)
				el.data(ATTRDATA, instances.length > 1 ? instances : instances[0]);

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

	function initscopes(scopes) {

		var scope = scopes[scopes.length - 1];
		if (scope.$scopedata)
			return scope.$scopedata;

		var path = attrcom(scope, 'scope');
		var independent = path.substring(0, 1) === '!';

		if (independent)
			path = path.substring(1);

		var arr = [scope];
		if (!independent) {
			for (var i = scopes.length - 1; i > -1; i--) {
				arr.push(scopes[i]);
				if (scopes[i].getAttribute('data-jc-scope').substring(0, 1) === '!')
					break;
			}
		}

		var absolute = '';

		arr.length && arr.reverse();

		for (var i = 0, length = arr.length; i < length; i++) {

			var sc = arr[i];
			var p = sc.$scope || attrcom(sc, 'scope');

			sc.$initialized = true;

			if (sc.$processed) {
				absolute = p;
				continue;
			}

			sc.$processed = true;
			sc.$isolated = p.substring(0, 1) === '!';

			if (sc.$isolated)
				p = p.substring(1);

			if (!p || p === '?')
				p = GUID(25).replace(/\d/g, '');

			if (sc.$isolated)
				absolute = p;
			else
				absolute += (absolute ? '.' : '') + p;

			sc.$scope = absolute;
			var d = new Scope();
			d._id = d.id = GUID(10);
			d.path = absolute;
			d.elements = arr.slice(0, i + 1);
			d.isolated = sc.$isolated;
			d.element = $(arr[0]);
			sc.$scopedata = d;

			var tmp = attrcom(sc, 'value');
			if (tmp) {
				var fn = new Function('return ' + tmp);
				defaults['#' + W.HASH(p)] = fn; // store by path (DEFAULT() --> can reset scope object)
				tmp = fn();
				set(p, tmp);
				emitwatch(p, tmp, 1);
			}

			// Applies classes
			var cls = attrcom(sc, 'class');
			if (cls) {
				(function(cls) {
					cls = cls.split(' ');
					setTimeout(function() {
						var el = $(sc);
						for (var i = 0, length = cls.length; i < length; i++)
							el.tclass(cls[i]);
					}, 5);
				})(cls);
			}

			tmp = attrcom(sc, 'init');
			if (tmp) {
				tmp = GET(tmp);
				if (tmp) {
					var a = current_owner;
					current_owner = 'scope' + d._id;
					tmp.call(d, p, $(sc));
					current_owner = a;
				}
			}
		}

		return scope.$scopedata;
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

			var url = attrcom(el, 'url');

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
			item.callback = attrcom(el, 'init');
			item.path = attrcom(el, 'path');
			item.toggle = (attrcom(el, 'class') || '').split(' ');
			item.expire = attrcom(el, 'cache') || MD.importcache;
			arr.push(item);
		});

		if (!arr.length)
			return;

		var canCompile = false;
		C.importing++;

		async(arr, function(item, next) {

			var key = makeurl(item.url);
			var can = false;

			M.AJAXCACHE('GET ' + item.url, null, function(response) {

				key = '$import' + key;

				if (statics[key])
					response = removescripts(response);
				else
					response = importscripts(importstyles(response));

				can = response && REGCOM.test(response);

				if (can)
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
			C.importing--;
			clear('valid', 'dirty', 'find');
			count && canCompile && compile();
		});
	}

	function remove(el) {
		var dom = el.get(0);
		dom.$com = null;
		el.attr(ATTRDEL, true);
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

	function makeurl(url, make) {

		MD.makeurl && (url = MD.makeurl(url));

		if (make)
			return url;

		var builder = [];
		var en = encodeURIComponent;

		M.$version && builder.push('version=' + en(M.$version));
		M.$language && builder.push('language=' + en(M.$language));

		if (!builder.length)
			return url;

		var index = url.indexOf('?');
		if (index == -1)
			url += '?';
		else
			url += '&';

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

		findcontrol2(obj, collection);

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
						emitwatch(obj.path, value, 0);
					}
				}

				if (obj.$binded)
					obj.$interaction(0);
				else {
					obj.$binded = true;
					obj.setterX(value, obj.path, 0);
					obj.$interaction(0);
				}
			}
		} else
			obj.$binded = true;

		if (obj.validate && !obj.$valid_disabled)
			obj.$valid = obj.validate(obj.get(), true);

		obj.done && setTimeout(obj.done, 20);
		obj.state && obj.stateX(0, 3);

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

		var n = 'component';
		el.trigger(n);
		el.off(n);

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
		M.emit(n, obj);
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
		else if ($domready) {

			if (C.ready)
				C.is = false;

			if (MD.fallback && fallback.$ && !C.importing) {
				var arr = OK(fallback);
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] !== '$') {
						var num = fallback[arr[i]];
						if (num === 1) {
							fallbackpending.push(arr[i].toLowerCase());
							fallback[arr[i]] = 2;
						}
					}
				}
				fallback.$ = 0;
				fallbackpending.length && downloadfallback();
			}
		}
	}

	function downloadfallback() {
		if (C.importing) {
			setTimeout(downloadfallback, 1000);
		} else {
			setTimeout2('$fallback', function() {
				fallbackpending.splice(0).wait(function(item, next) {
					if (M.$components[item])
						next();
					else {
						warn('Downloading: ' + item);
						W.IMPORTCACHE(MD.fallback.format(item), MD.fallbackcache, next);
					}
				}, 3);
			}, 100);
		}
	}

	function isOperation(name) {
		return name.charCodeAt(0) === 35;
	}

	function emitwatch(path, value, type) {
		for (var i = 0, length = watches.length; i < length; i++) {
			var self = watches[i];
			if (self.path === '*') {
				self.fn.call(self.context, path, self.format ? self.format(value, path, type) : value, type);
			} else if (path.length > self.path.length) {
				var index = path.lastIndexOf('.', self.path.length);
				if (index === -1 ? false : self.path === path.substring(0, index)) {
					var val = GET(self.path);
					self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
				}
			} else {
				for (var j = 0, jl = self.$path.length; j < jl; j++) {
					if (self.$path[j] === path) {
						var val = GET(self.path);
						self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
						break;
					}
				}
			}
		}
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
				var arr = autofill.splice(0);
				for (var i = 0; i < arr.length; i++) {
					var com = arr[i];
					!com.$default && findcontrol(com.element.get(0), function(el) {
						var val = $(el).val();
						if (val) {
							var tmp = com.parser(val);
							if (tmp && com.get() !== tmp) {
								com.dirty(false, true);
								com.set(tmp, undefined, 0);
							}
						}
						return true;
					});
				}
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

		var index = path.replace(A, '->').indexOf('->');

		if (index !== -1) {
			value = value[path.substring(0, index).trim()];
			path = path.substring(index + 3).trim();
		}

		M.set(path, value);
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

		var arr = parsepath(path);
		var builder = [];

		for (var i = 0; i < arr.length - 1; i++) {
			var item = arr[i];
			var type = arr[i + 1] ? (REGISARR.test(arr[i + 1]) ? '[]' : '{}') : '{}';
			var p = 'w' + (item.substring(0, 1) === '[' ? '' : '.') + item;
			builder.push('if(typeof(' + p + ')!==\'object\'||' + p + '==null)' + p + '=' + type + ';');
		}

		var v = arr[arr.length - 1];

		if (v.substring(0, 1) !== '[')
			v = '.' + v;

		var fn = (new Function('w', 'a', 'b', builder.join(';') + ';var v=typeof(a)===\'function\'?a(MAIN.compiler.get(b)):a;w' + v + '=v;return v'));
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

		var arr = parsepath(path);
		var builder = [];

		for (var i = 0, length = arr.length - 1; i < length; i++) {
			var item = arr[i];
			if (item.substring(0, 1) !== '[')
				item = '.' + item;
			builder.push('if(!w' + item + ')return');
		}

		var v = arr[arr.length - 1];
		if (v.substring(0, 1) !== '[')
			v = '.' + v;

		var fn = (new Function('w', builder.join(';') + ';return w' + v));
		paths[key] = fn;
		return fn(scope || W);
	}

	function parsepath(path) {

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

	C.get = get;

	function clear() {

		if (!arguments.length) {
			cache = {};
			return;
		}

		var arr = OK(cache);

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

	function cleaner2() {
		clear();
		cleaner();
	}

	function cleaner() {

		var keys = OK(events);
		var is = true;
		var length = keys.length;
		var index;

		for (var i = 0; i < length; i++) {
			var key = keys[i];
			index = 0;
			var arr = events[key];
			while (true) {

				var item = arr[index++];
				if (item === undefined)
					break;

				if (item.context == null || (item.context.element && item.context.element.closest(document.documentElement).length))
					continue;

				item.context && item.context.element && item.context.element.remove();
				item.context.$removed = true;
				item.context = null;
				arr.splice(index - 1, 1);

				if (!arr.length)
					delete events[key];

				index -= 2;
				is = true;
			}
		}

		index = 0;
		while (true) {
			var item = watches[index++];
			if (item === undefined)
				break;
			if (item.context == null || (item.context.element && item.context.element.closest(document.documentElement).length))
				continue;
			item.context && item.context.element && item.context.element.remove();
			item.context.$removed = true;
			item.context = null;
			watches.splice(index - 1, 1);
			index -= 2;
			is = true;
		}

		var all = M.components;
		index = 0;
		length = all.length;

		while (index < length) {

			var component = all[index++];
			if (!component) {
				index--;
				all.splice(index, 1);
				length = all.length;
				continue;
			}

			if (!component.$removed || component.$removed === 2) {
				// Clears temporary cache for parent components
				component.$parent = component.$main = undefined;
				continue;
			}

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
			component.dom = null;
			component.$removed = 2;
			component.path = null;
			component.setter = null;
			component.setter2 = null;
			component.getter = null;
			component.getter2 = null;
			component.make = null;

			index--;
			all.splice(index, 1);
			length = M.components.length;
			is = true;
		}

		clear('find');

		W.DATETIME = new Date();
		var now = W.DATETIME.getTime();
		var is2 = false;
		var is3 = false;

		for (var key in blocked) {
			if (blocked[key] <= now) {
				delete blocked[key];
				is2 = true;
			}
		}

		MD.localstorage && is2 && !W.isPRIVATEMODE && localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));

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
		!W.isPRIVATEMODE && MD.localstorage && localStorage.setItem(M.$localstorage + '.cache', JSON.stringify(storage));
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

	// what:
	// 1. valid
	// 2. dirty
	// 3. reset
	// 4. update
	// 5. set
	function state(arr, type, what) {
		arr && arr.length && setTimeout(function() {
			for (var i = 0, length = arr.length; i < length; i++)
				arr[i].stateX(type, what);
		}, 2, arr);
	}

	// ===============================================================
	// VIRTUAL DECLARATION
	// ===============================================================

	function CONTAINER(element, mapping, config) {
		var t = this;
		t.element = typeof(element) === 'string' ? $(element.$env()) : element;
		t.dom = t.element.get(0);
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
		var keys = OK(self.mapping);
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
			var keys = OK(t.mapping);
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
			var keys = OK(t.mapping);
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
			t.dom = t.element.get(0);
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
		t.dom = el.get(0);
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
			t.dom = t.element.get(0);
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
		self.dom = self.element.get(0);
		self.length = self.element.length;
		return self;
	};

	PPP.replace = function(el) {
		var self = this;
		self.element.replaceWith(el);
		self.element = el;
		self.dom = el.get(0);
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
	// SCOPE
	// ===============================================================

	function Scope() {}

	var SCP = Scope.prototype;

	SCP.unwatch = function(path, fn) {
		var self = this;
		M.off('scope' + self._id + '#watch', self.path + (path ? '.' + path : ''), fn);
		return self;
	};

	SCP.watch = function(path, fn, init) {
		var self = this;
		M.on('scope' + self._id + '#watch', self.path + (path ? '.' + path : ''), fn, init, self);
		return self;
	};

	SCP.reset = function(path, timeout) {
		if (path > 0) {
			timeout = path;
			path = '';
		}
		return W.RESET(this.path + '.' + (path ? + path : '*'), timeout);
	};

	SCP.default = function(path, timeout) {
		if (path > 0) {
			timeout = path;
			path = '';
		}
		return W.DEFAULT(this.path + '.' + (path ? path : '*'), timeout);
	};

	SCP.set = function(path, value, timeout, reset) {
		return W.SET(this.path + (path ? '.' + path : ''), value, timeout, reset);
	};

	SCP.push = function(path, value, timeout, reset) {
		return W.PUSH(this.path + (path ? '.' + path : ''), value, timeout, reset);
	};

	SCP.update = function(path, timeout, reset) {
		return W.UPDATE(this.path + (path ? '.' + path : ''), timeout, reset);
	};

	SCP.get = function(path) {
		return W.GET(this.path + (path ? '.' + path : ''));
	};

	SCP.can = function(except) {
		return W.CAN(this.path + '.*', except);
	};

	SCP.errors = function(except, highlight) {
		return W.ERRORS(this.path + '.*', except, highlight);
	};

	SCP.remove = function() {
		var self = this;
		var arr = M.components;

		for (var i = 0; i < arr.length; i++) {
			var a = arr[i];
			a.scope && a.scope.path === self.path && a.remove(true);
		}

		if (self.isolated) {
			arr = OK(proxy);
			for (var i = 0; i < arr.length; i++) {
				var a = arr[i];
				if (a.substring(0, self.path.length) === self.path)
					delete proxy[a];
			}
		}

		M.off('scope' + self._id + '#watch');
		var e = self.element;
		e.find('*').off();
		e.off();
		e.remove();
		setTimeout2('$cleaner', cleaner2, 100);
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
		self.dom = null;
		self.removed = false;
	}

	var PCTRL = Controller.prototype;

	PCTRL.emit = function(name) {
		var self = this;
		var e = self.$events[name];
		if (e && e.length) {
			for (var i = 0, length = e.length; i < length; i++)
				e[i].call(self, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		}
		return self;
	};

	PCTRL.on = function(name, fn) {
		var self = this;
		var e = self.$events[name];
		!e && (self.$events[name] = e = []);
		e.push(fn);
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
		M.on('ctrl' + self.name + '#watch', path, fn, init);
		return self;
	};

	PCTRL.path = function(path) {

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

	PCTRL.set = function(path, value, type) {
		var self = this;

		if (value === undefined) {
			value = path;
			path = '';
		}

		M.set(self.path(path), value, type);
		return self;
	};

	PCTRL.update = function(path, reset, type) {
		var self = this;

		if (path === true) {
			reset = true;
			path = '';
		}

		if (reset != null && typeof(reset) !== 'boolean') {
			type = reset;
			reset = true;
		}

		M.update(self.path(path), reset, type);
		return self;
	};

	PCTRL.notify = function(path) {
		var self = this;
		M.notify(self.path(path));
		return self;
	};

	PCTRL.inc = function(path, value, type) {
		var self = this;

		if (value === undefined) {
			value = path;
			path = '';
		}

		M.inc(self.path(path), value, type);
		return self;
	};

	PCTRL.push = function(path, value, type) {
		var self = this;

		if (value === undefined) {
			value = path;
			path = '';
		}

		M.push(self.path(path), value, type);
		return self;
	};

	PCTRL.extend = function(path, value, type) {
		var self = this;
		if (value === undefined) {
			value = path;
			path = '';
		}
		M.extend(self.path(path), value, type);
		return self;
	};

	PCTRL.rewrite = function(path, value) {

		if (value === undefined) {
			value = path;
			path = '';
		}

		var self = this;
		M.rewrite(self.path(path), value);
		return self;
	};

	PCTRL.reset = function(path) {
		var self = this;
		M.reset(self.path(path));
		return self;
	};

	PCTRL.default = function(path, timeout, onlyComponent, reset) {
		var self = this;
		M.default(self.path(path), timeout, onlyComponent, reset);
		return self;
	};

	PCTRL.get = function(path) {
		var self = this;
		return get(self.path(path));
	};

	SCP.FIND = PCTRL.FIND = function(selector, many, callback, timeout) {
		return this.element.FIND(selector, many, callback, timeout);
	};

	SCP.SETTER = PCTRL.SETTER = function(a, b, c, d, e, f, g) {
		return this.element.SETTER(a, b, c, d, e, f, g);
	};

	SCP.RECONFIGURE = PCTRL.RECONFIGURE = function(selector, name) {
		return this.element.RECONFIGURE(selector, name);
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
		self.$released = false;
		self.$bindreleased = true;

		var version = name.lastIndexOf('@');

		self.name = name;
		self.$name = version === -1 ? name : name.substring(0, version);
		self.version = version === -1 ? '' : name.substring(version + 1);
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

		self.getter = function(value, realtime, validate, nobind) {

			var self = this;

			value = self.parser(value);
			self.getter2 && self.getter2(value, realtime);

			if (realtime)
				self.$skip = true;

			// Binds a value
			if (nobind)
				M.validate2(self);
			else
				self.set(self.path, value, 2);
		};

		self.stateX = function(type, what) {
			var key = type + 'x' + what;
			if (!self.$bindchanges || self.$state !== key) {
				self.$state = key;
				self.state(type, what);
			}
		};

		self.setterX = function(value, path, type) {

			if (!self.setter || (self.$bindexact && self.path !== path && self.path.indexOf(path + '.') === -1 && type))
				return;

			var cache = self.$bindcache;
			if (arguments.length) {

				if (skips[self.path]) {
					var s = --skips[self.path];
					if (s <= 0) {
						delete skips[self.path];
						return;
					}
				}

				if (self.$format)
					value = self.$format(value, path, type);

				if (self.$bindreleased) {

					if (self.$bindchanges) {
						var hash = W.HASH(value);
						if (hash === self.$valuehash)
							return;
						self.$valuehash = hash;
					}

					// Binds value directly
					self.setter(value, path, type);
					self.setter2 && self.setter2(value, path, type);
				} else {
					if (self.$released) {
						cache.is = true;
						cache.value = value;
						cache.path = path;
						cache.type = type;
					} else {
						cache.value = value;
						cache.path = path;
						cache.type = type;
						if (!cache.bt) {
							cache.is = true;
							self.setterX();
						}
					}
				}

			} else if (!self.$released && cache && cache.is) {
				cache.is = false;
				cache.bt && clearTimeout(cache.bt);
				cache.bt = setTimeout(function(self) {
					var cache = self.$bindcache;
					cache.bt = 0; // reset timer id

					if (self.$bindchanges) {
						var hash = W.HASH(value);
						if (hash === self.$valuehash)
							return;
						self.$valuehash = hash;
					}

					self.setter(cache.value, cache.path, cache.type);
					self.setter2 && self.setter2(cache.value, cache.path, cache.type);
				}, self.$bindtimeout, self);
			}
		};

		self.setter = function(value, path, type) {

			var self = this;

			if (type === 2) {
				if (self.$skip) {
					self.$skip = false;
					return;
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

				if (!type && t.type !== a && t.type !== 'range' && !self.$default && !value)
					autofill.push(t.$com);

				if (t.type === a || t.type === 'select') {
					var el = $(t);
					el.val() !== value && el.val(value);
				} else if (t.value !== value)
					t.value = value;
			});
		};
	}

	var PPC = COM.prototype;

	PPC.$except = function(except) {
		var p = self.$path;
		for (var a = 0; a < except.length; a++) {
			for (var b = 0; b < p.length; b++) {
				if (except[a] === p[b])
					return true;
			}
		}
		return false;
	};

	PPC.$compare = function(path, fix) {
		var self = this;

		if (fix)
			return self.path === path;

		if (path.length > self.path.length) {
			var index = path.lastIndexOf('.', self.path.length);
			return index === -1 ? false : self.path === path.substring(0, index);
		}

		for (var i = 0, length = self.$path.length; i < length; i++) {
			if (self.$path[i] === path)
				return true;
		}
	};

	function removewaiter(obj) {
		if (obj.$W) {
			var keys = OK(obj.$W);
			for (var i = 0, length = keys.length; i < length; i++) {
				var v = obj.$W[keys[i]];
				v.id && clearInterval(v.id);
			}
		}
	}

	PPC.notmodified = function(fields) {
		var t = this;
		typeof(fields) === 'string' && (fields = [fields]);
		return W.NOTMODIFIED(t._id, t.get(), fields);
	};

	PPC.$waiter = PPP.$waiter = PPVC.$waiter = PCTRL.$waiter = function(prop, callback) {

		var t = this;

		if (prop === true) {
			if (t.$W) {
				var keys = OK(t.$W);
				for (var i = 0; i < keys.length; i++) {
					var k = keys[i];
					var o = t.$W[k];
					o.id = setInterval(function(t, prop) {
						var o = t.$W[prop];
						var v = t[prop]();
						if (v) {
							clearInterval(o.id);
							for (var i = 0; i < o.callback.length; i++)
								o.callback[i].call(t, v);
							delete t.$W[prop];
						}
					}, MD.delaywatcher, t, k);
				}
			}
			return;
		} else if (prop === false) {
			if (t.$W) {
				var keys = OK(t.$W);
				for (var i = 0; i < keys.length; i++) {
					var a = t.$W[keys[i]];
					a && clearInterval(a.id);
				}
			}
			return;
		}

		!t.$W && (t.$W = {});

		if (t.$W[prop]) {
			// Checks if same callback exists
			for (var i = 0; i < t.$W[prop].length; i++) {
				if (t.$W[prop][i] === callback)
					return t;
			}
			t.$W[prop].callback.push(callback);
			return t;
		} else
			t.$W[prop] = { callback: [callback] };

		if (!t.$released) {
			t.$W[prop].id = setInterval(function(t, prop) {
				var o = t.$W[prop];
				var v = t[prop]();
				if (v) {
					clearInterval(o.id);
					for (var i = 0; i < o.callback.length; i++)
						o.callback[i].call(t, v);
					delete t.$W[prop];
				}
			}, MD.delaywatcher, t, prop);
		}
		return t;
	};

	PPC.hidden = PPP.hidden = PPVC.hidden = PCTRL.hidden = function(callback) {
		var t = this;
		var v = t.element ? t.element.get(0).offsetParent : null;
		v = v === null;
		if (callback) {
			if (v)
				callback.call(t);
			else
				t.$waiter('hidden', callback);
		}
		return v;
	};

	PPC.visible = PPP.visible = PPVC.visible = PCTRL.visible = function(callback) {
		var t = this;
		var v = t.element ? t.element.get(0).offsetParent : null;
		v = v !== null;
		if (callback) {
			if (v)
				callback.call(t);
			else
				t.$waiter('visible', callback);
		}
		return v;
	};

	PPC.width = PPP.width = PPVC.width = PCTRL.width = function(callback) {
		var t = this;
		var v = t.element ? t.element.get(0).offsetWidth : 0;
		if (callback) {
			if (v)
				callback.call(t, v);
			else
				t.$waiter('width', callback);
		}
		return v;
	};

	PPC.height = PPP.height = PPVC.height = PCTRL.height = function(callback) {
		var t = this;
		var v = t.element ? t.element.get(0).offsetHeight : 0;
		if (callback) {
			if (v)
				callback.call(t, v);
			else
				t.$waiter('height', callback);
		}
		return v;
	};

	PPC.import = PPP.import = PCTRL.import = function(url, callback, insert, preparator) {
		var self = this;
		M.import(url, self.element, callback, insert, preparator);
		return self;
	};

	PPC.release = function(value, container) {

		var self = this;
		if (value === undefined || self.$removed)
			return self.$released;

		self.attrd('jc-released', value);

		(container || self.element).find(ATTRCOM).each(function() {
			var el = $(this);
			el.attrd('jc-released', value ? 'true' : 'false');
			var com = el.data(ATTRDATA);
			if (com instanceof Object) {
				if (com instanceof Array) {
					for (var i = 0, length = com.length; i < length; i++) {
						var o = com[i];
						if (!o.$removed && o.$released !== value) {
							o.$released = value;
							o.released && o.released(value, self);
							o.$waiter(!value);
							!value && o.setterX();
						}
					}
				} else if (!com.$removed && com.$released !== value) {
					com.$released = value;
					com.released && com.released(value, self);
					com.$waiter(!value);
					!value && com.setterX();
				}
			}
		});

		if (!container && self.$released !== value) {
			self.$released = value;
			self.released && self.released(value, self);
			self.$waiter(!value);
			!value && self.setterX();
		}

		return value;
	};

	PPC.validate2 = function() {
		return M.validate2(this);
	};

	PPC.exec = function(name, a, b, c, d, e) {
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
		self.dom = self.element.get(0);
		self.dom.$com = self;
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
				self.setter && self.setterX(self.get(), self.path, 1);
				self.$interaction(1);
			}
		}
		return self;
	};

	PPVC.tclass = PPC.tclass = PPP.tclass = PCTRL.tclass = function(cls, v) {
		var self = this;
		self.element.tclass(cls, v);
		return self;
	};

	PPVC.aclass = PPC.aclass = PPP.aclass = PCTRL.aclass = function(cls, timeout) {
		var self = this;
		if (timeout)
			setTimeout(function() { self.element.aclass(cls); }, timeout);
		else
			self.element.aclass(cls);
		return self;
	};

	PPVC.hclass = PPC.hclass = PPP.hclass = PCTRL.hclass = function(cls) {
		return this.element.hclass(cls);
	};

	PPVC.rclass = PPC.rclass = PPP.rclass = PCTRL.rclass = function(cls, timeout) {
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

	PPVC.rclass2 = PPC.rclass2 = PPP.rclass2 = PCTRL.rclass2 = function(search) {
		this.element.rclass2(search);
		return this;
	};

	PPVC.classes = PPC.classes = PPP.classes = PCTRL.classes = function(cls) {

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

	PPC.toggle = PPP.toggle = PCTRL.toggle = function(cls, visible, timeout) {

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

	PPC.noscope = PPC.noScope = function(value) {
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

	PPC.bindchanges = PPC.bindChanges = function(enable) {
		this.$bindchanges = enable == null || enable === true;
		return this;
	};

	PPC.bindexact = PPC.bindExact = function(enable) {
		this.$bindexact = enable == null || enable === true;
		return this;
	};

	PPC.bindvisible = PPC.bindVisible = function(timeout) {
		var self = this;
		self.$bindreleased = false;
		self.$bindtimeout = timeout || MD.delaybinder;
		self.$bindcache = {};
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

	PPC.novalidate = PPC.noValid = PPC.noValidate = function(val) {
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
		self.$dirty = !val;
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
		var index = path.indexOf(A);

		if (index !== -1) {
			var name = path.substring(index + 3).trim();
			path = path.substring(0, index).trim();

			var is = name.indexOf('=>') === -1;
			if (is) {
				if (name.indexOf('.') !== -1) {
					name = '(value,path,type)=>' + name;
					is = false;
				}
			}
			self.$format = is ? GET(name) : FN(name);
		} else if (!type)
			self.$format = null;

		var arr = [];

		// Temporary
		if (path.charCodeAt(0) === 37)
			path = 'jctmp.' + path.substring(1);

		// Operations
		if (isOperation(path)) {
			self.$path = null;
			return self;
		}

		path = path.env(true);

		// !path = fixed path
		if (path.charCodeAt(0) === 33) {
			path = path.substring(1);
			arr.push(path);
		} else {
			var p = path.split('.');
			var s = [];
			for (var j = 0; j < p.length; j++) {
				var b = p[j].lastIndexOf('[');
				if (b !== -1) {
					var c = s.join('.');
					arr.push(c + (c ? '.' : '') + p[j].substring(0, b));
				}
				s.push(p[j]);
				arr.push(s.join('.'));
			}
		}

		self.path = path;
		self.$path = arr;
		type !== 1 && C.ready && refresh();
		return self;
	};

	PPVC.attr = PPC.attr = PPP.attr = PCTRL.attr = SCP.attr = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.attr(name);
		el.attr(name, value);
		return this;
	};

	PPVC.attrd = PPC.attrd = PPP.attrd = PCTRL.attrd = SCP.attrd = function(name, value) {
		name = 'data-' + name;
		var el = this.element;
		if (value === undefined)
			return el.attr(name);
		el.attr(name, value);
		return this;
	};

	PPVC.css = PPC.css = PPP.css = PCTRL.css = SCP.css = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.css(name);
		el.css(name, value);
		return this;
	};

	PPC.main = PCTRL.main = SCP.main = function() {
		var self = this;
		if (self.$main === undefined) {
			var tmp = self.parent().closest('[data-jc]').get(0);
			self.$main = tmp ? tmp.$com : null;
		}
		return self.$main;
	};

	PPC.rcwatch = PCTRL.rcwatch = function(path, value) {
		return value ? this.reconfigure(value) : this;
	};

	PPC.reconfigure = PPVC.reconfigure = PCTRL.reconfigure = function(value, callback, init) {
		var self = this;

		if (typeof(value) === 'object') {
			OK(value).forEach(function(k) {
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

	PPVC.closest = PPC.closest = PPP.closest = PCTRL.closest = SCP.closest = function(sel) {
		return this.element.closest(sel);
	};

	PPVC.parent = PPC.parent = PPP.parent = PCTRL.parent = SCP.parent = function(sel) {
		return this.element.parent(sel);
	};

	PPVC.html = PPC.html = PPP.html = PCTRL.html = function(value) {
		var el = this.element;
		if (value === undefined)
			return el.html();
		if (value instanceof Array)
			value = value.join('');
		var type = typeof(value);
		return value || type === 'number' || type === 'boolean' ? el.empty().append(value) : el.empty();
	};

	PPVC.text = PPC.text = PPP.text = PCTRL.text = function(value) {
		var el = this.element;
		if (value === undefined)
			return el.text();
		if (value instanceof Array)
			value = value.join('');
		var type = typeof(value);
		return value || type === 'number' || type === 'boolean' ? el.empty().text(value) : el.empty();
	};

	PPVC.empty = PPC.empty = PPP.empty = PCTRL.empty = function() {
		var el = this.element;
		el.empty();
		return el;
	};

	PPVC.append = PPC.append = PPP.append = PCTRL.append = SCP.append = function(value) {
		var el = this.element;
		if (value instanceof Array)
			value = value.join('');
		else if (value instanceof CONTAINER)
			value = value.element;
		return value ? el.append(value) : el;
	};

	PPVC.event = PPC.event = PPP.event = PPP.on = PCTRL.event = SCP.event = function() {
		var self = this;
		if (self.element)
			self.element.on.apply(self.element, arguments);
		else {
			setTimeout(function(arg) {
				self.event(self, arg);
			}, 500, arguments);
		}
		return self;
	};

	PPVC.find = PPC.find = PPP.find = PCTRL.find = SCP.find = function(selector) {
		return this.element.find(selector);
	};

	PPC.virtualize = PCTRL.virtualize = SCP.virtualize = function(mapping, config) {
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

		self.on('watch', path, fn, init);
		return self;
	};

	PPC.invalid = function() {
		return W.INVALID(this.path, this);
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
		!noEmit && self.state && self.stateX(1, 1);
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
		!noEmit && self.state && self.stateX(2, 2);
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
		removewaiter(self);
		el.removeData(ATTRDATA);
		el.attr(ATTRDEL, 'true').find(ATTRCOM).attr(ATTRDEL, 'true');
		self.$removed = 1;
		self.removed = true;
		M.off('com' + self._id + '#');
		!noClear && setTimeout2('$cleaner', cleaner2, 100);
		return true;
	};

	PPC.on = function(name, path, fn, init) {
		if (typeof(path) === 'function') {
			init = fn;
			fn = path;
			path = '';
		} else
			path = path.replace('.*', '');
		var self = this;
		M.on('com' + self._id + '#' + name, path, fn, init, self);
		return self;
	};

	PPC.formatter = function(value, prepend) {

		var self = this;

		if (typeof(value) === 'function') {
			!self.$formatter && (self.$formatter = []);
			if (prepend === true)
				self.$formatter.unshift(value);
			else
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

	PPC.parser = function(value, prepend) {

		var self = this;
		var type = typeof(value);

		if (type === 'function') {
			!self.$parser && (self.$parser = []);

			if (prepend === true)
				self.$parser.unshift(value);
			else
				self.$parser.push(value);

			return self;
		}

		if (self.trim && type === 'string')
			value = value.trim();

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

	PPC.skip = function(path) {
		var self = this;
		W.SKIP(path || self.path);
		return self;
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
		var self = this;
		if (value === undefined) {
			value = path;
			path = self.path;
		}
		path && M.inc(path, value, type);
		return self;
	};

	PPC.extend = function(path, value, type) {
		var self = this;
		if (value === undefined) {
			value = path;
			path = self.path;
		}
		path && M.extend(path, value, type);
		return self;
	};

	PPC.rewrite = function(path, value) {
		var self = this;
		if (value === undefined) {
			value = path;
			path = self.path;
		}
		path && M.rewrite(path, value);
		return self;
	};

	PPC.push = function(path, value, type) {
		var self = this;
		if (value === undefined) {
			value = path;
			path = self.path;
		}
		path && M.push(path, value, type);
		return self;
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
	W.isTOUCH = !!('ontouchstart' in W || navigator.maxTouchPoints);

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

		// Multiple versions
		if (name.indexOf(',') !== -1) {
			name.split(',').forEach(function(item, index) {
				item = item.trim();
				item && W.COMPONENT(item, config, declaration, index ? null : dependencies);
			});
			return;
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
		var d = MD.devices;
		return w >= d.md.min && w <= d.md.max ? 'md' : w >= d.sm.min && w <= d.sm.max ? 'sm' : w > d.lg.min ? 'lg' : w <= d.xs.max ? 'xs' : '';
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

		var d = MD.devices;

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

	W.FN = function(exp) {
		var index = exp.indexOf('=>');
		if (index === -1)
			return exp;

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

	W.RECONFIGURE = function(selector, value) {
		SETTER(true, selector, 'reconfigure', value);
		return W.RECONFIGURE;
	};

	W.SETTER = function(selector, name) {

		var arg = [];
		var beg = selector === true ? 3 : 2;

		for (var i = beg; i < arguments.length; i++)
			arg.push(arguments[i]);

		if (beg === 3) {
			selector = name;
			name = arguments[2];
			FIND(selector, true, function(arr) {
				for (var i = 0, length = arr.length; i < length; i++) {
					var o = arr[i];
					if (typeof(o[name]) === 'function')
						o[name].apply(o, arg);
					else
						o[name] = arg[0];
				}
			});
		} else {
			var arr = FIND(selector, true);
			for (var i = 0, length = arr.length; i < length; i++) {
				var o = arr[i];
				if (typeof(o[name]) === 'function')
					o[name].apply(o, arg);
				else
					o[name] = arg[0];
			}
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
		compress === undefined && (compress = MD.jsoncompress);
		var tf = typeof(fields);
		return JSON.stringify(obj, function(key, value) {

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
	};

	W.PARSE = function(value, date) {

		// Is selector?
		var c = value.substring(0, 1);
		if (c === '#' || c === '.')
			return W.PARSE($(value).html(), date);

		date === undefined && (date = MD.jsondate);
		try {
			return JSON.parse(value, function(key, value) {
				return typeof(value) === 'string' && date && value.isJSONDate() ? new Date(value) : value;
			});
		} catch (e) {
			return null;
		}
	};

	W.SKIP = function() {
		for (var j = 0; j < arguments.length; j++) {
			var arr = arguments[j].split(',');
			for (var i = 0, length = arr.length; i < length; i++) {
				var p = arr[i].trim();
				if (skips[p])
					skips[p]++;
				else
					skips[p] = 1;
			}
		}
	};

	W.NOOP = function(){};
	W.SET = function(path, value, timeout, reset) {
		var t = typeof(timeout);
		if (t === 'boolean')
			return M.set(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return M.set(path, value, timeout);
		setTimeout(function() {
			M.set(path, value, reset);
		}, timeout);
		return M;
	};

	W.INC = function(path, value, timeout, reset) {
		var t = typeof(timeout);
		if (t === 'boolean')
			return M.inc(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return M.inc(path, value, timeout);
		setTimeout(function() {
			M.inc(path, value, reset);
		}, timeout);
		return M;
	};

	W.EXTEND = function(path, value, timeout, reset) {
		var t = typeof(timeout);
		if (t === 'boolean')
			return M.extend(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return M.extend(path, value, timeout);
		setTimeout(function() {
			M.extend(path, value, reset);
		}, timeout);
		return M;
	};

	W.PUSH = function(path, value, timeout, reset) {
		var t = typeof(timeout);
		if (t === 'boolean')
			return M.push(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return M.push(path, value, timeout);
		setTimeout(function() {
			M.push(path, value, reset);
		}, timeout);
		return M;
	};

	W.DEFAULT = function(path, timeout, reset) {
		return M.default(path, timeout, null, reset);
	};

	W.UPTODATE = function(period, url, callback, condition) {

		if (typeof(url) === 'function') {
			condition = callback;
			callback = url;
			url = '';
		}

		var dt = new Date().add(period);
		ON('knockknock', function() {
			if (dt > W.DATETIME)
				return;
			if (!condition || !condition())
				return;
			var id = setTimeout(function() {
				if (url)
					W.location.href = url.$env();
				else
					W.location.reload(true);
			}, 5000);
			callback && callback(id);
		});
	};

	W.PING = function(url, timeout, execute) {

		if (navigator.onLine != null && !navigator.onLine)
			return;

		if (typeof(timeout) === 'boolean') {
			execute = timeout;
			timeout = 0;
		}

		url = url.$env();

		var index = url.indexOf(' ');
		var method = 'GET';

		if (index !== -1) {
			method = url.substring(0, index).toUpperCase();
			url = url.substring(index).trim();
		}

		var options = {};
		var data = $.param(MD.pingdata);

		if (data) {
			index = url.lastIndexOf('?');
			if (index === -1)
				url += '?' + data;
			else
				url += '&' + data;
		}

		options.type = method;
		options.headers = { 'x-ping': location.pathname, 'x-cookies': navigator.cookieEnabled ? '1' : '0', 'x-referrer': document.referrer };

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

		execute && $.ajax(makeurl(url), options);

		return setInterval(function() {
			$.ajax(makeurl(url), options);
		}, timeout || 30000);
	};

	M.modified = W.MODIFIED = function(path) {
		var output = [];
		M.each(function(obj) {
			if (!(obj.disabled || obj.$dirty_disabled))
				!obj.$dirty === false && output.push(obj.path);
		}, ctrl_path(path));
		return output;
	};

	W.NOTMODIFIED = function(path, value, fields) {

		if (value === undefined)
			value = get(path);

		if (value === undefined)
			value = null;

		if (fields)
			path = path.concat('#', fields);

		var s = W.STRINGIFY(value, false, fields);
		var hash = W.HASH(s);
		var key = 'notmodified.' + path;

		if (cache[key] === hash)
			return true;

		cache[key] = hash;
		return false;
	};

	W.VERSION = function() {
		for (var j = 0; j < arguments.length; j++) {
			var keys = arguments[j].split(',');
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i].trim();
				var tmp = key.indexOf('@');
				if (tmp === -1)
					continue;
				var version = key.substring(tmp + 1);
				key = key.substring(0, tmp);
				version && key && (versions[key] = version);
			}
		}
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
				return val instanceof Array ? val.length > 0 : !!val;
			}, function(err) {
				// timeout
				if (!err) {
					var val = FIND(value, many);
					callback.call(val ? val : W, val);
				}
			}, 500, noCache);
			return;
		}

		// Element
		if (typeof(value) === 'object') {
			if (!(value instanceof jQuery))
				value = $(value);
			var output = findcomponent(value, '');
			return many ? output : output[0];
		}

		var key, output;

		if (!noCache) {
			key = 'find.' + value + '.' + (many ? 0 : 1);
			output = cache[key];
			if (output)
				return output;
		}

		var r = findcomponent(null, value);
		if (!many)
			r = r[0];
		output = r;
		!noCache && (cache[key] = output);
		return output;
	};

	W.UPDATE = function(path, timeout, reset) {
		var t = typeof(timeout);
		if (t === 'boolean')
			return M.update(path, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return M.update(path, reset, timeout);
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
		var type = typeof(s);
		if (type === 'number')
			return s;
		else if (type === 'boolean')
			return s ? 1 : 0;
		else if (s instanceof Date)
			return s.getTime();
		else if (type === 'object')
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
		if (ctrl) {
			var tmp = current_ctrl;
			current_ctrl = name;
			fn.call(ctrl, ctrl, ctrl.scope, ctrl.element);
			current_ctrl = tmp;
		} else {
			setTimeout(function() {
				W.SCOPE(name, fn);
			}, 350);
		}
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

			if (element) {
				obj.element = element;
				obj.dom = element.get(0);
			}

			if (obj.$callback) {
				C.controllers--;
				current_ctrl = obj.name;

				if (obj.element) {
					var tmp = attrcom(obj.element, 'config');
					tmp && obj.reconfigure(tmp, NOOP);
				}

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

	PCTRL.remove = PCTRL.kill = function() {

		var self = this;

		if (!M.controllers[self.name])
			return;

		removewaiter(self);
		self.removed = true;
		self.emit('destroy');
		self.destroy && self.destroy();
		delete M.controllers[self.name];

		// Remove all global events
		OK(events).forEach(function(e) {
			var evt = events[e];
			OK(evt).forEach(function(key) {
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
			setTimeout(cleaner2, 500);
		}, 1000, self.scope);
	};

	PCTRL.released = function() {
		var self = this;
		if (!self.$parent)
			self.$parent = $(self.element.closest('[data-jc-released]').get(0));
		return self.$parent.attrd('jc-released') === 'true';
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
					return is ? true : !!value;
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

	AP.wait = AP.waitFor = function(onItem, callback, thread, tmp) {

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
		onItem.call(self, item, function() {
			setTimeout(next_wait, 1, self, onItem, callback, thread, tmp);
		}, tmp.index);

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
				return ENV[val.substring(1, val.length - 1)] || val;
			});
		}
		var l = self.length - 1;
		return (self.charCodeAt(0) === 91 && self.charCodeAt(l) === 93 ? (ENV[self.substring(1, l)] || self) : self).toString();
	};

	SP.$env = function() {
		var self = this;
		var index = this.indexOf('?');
		return index === -1 ? self.env(true) : self.substring(0, index).env(true) + self.substring(index);
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

	SP.params = SP.arg = function(obj) {
		return this.replace(REGPARAMS, function(text) {
			// Is double?
			var l = text.charCodeAt(1) === 123 ? 2 : 1;
			var val = get(text.substring(l, text.length - l).trim(), obj);
			return val == null ? text : val;
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
			} else if (code > 47 && code < 58)
				builder += c;
			else if (code > 94 && code < 123)
				builder += c;
		}

		var l = builder.length - 1;
		return builder[l] === '-' ? builder.substring(0, l) : builder;
	};

	SP.isEmail = function() {
		var str = this;
		return str.length <= 4 ? false : MV.email.test(str);
	};

	SP.isPhone = function() {
		var str = this;
		return str.length < 6 ? false : MV.phone.test(str);
	};

	SP.isURL = function() {
		var str = this;
		return str.length <= 7 ? false : MV.url.test(str);
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

	AP.trim = function(empty) {
		var self = this;
		var output = [];
		for (var i = 0, length = self.length; i < length; i++) {
			if (typeof(self[i]) === 'string')
				self[i] = self[i].trim();
			if (empty || self[i])
				output.push(self[i]);
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

	DP.toUTC = function(ticks) {
		var self = this;
		var dt = self.getTime() + self.getTimezoneOffset() * 60000;
		return ticks ? dt : new Date(dt);
	};

	DP.format = function(format, utc) {

		var self = utc ? this.toUTC() : this;

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
					var b = '\'PM\':\'AM\'';
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
			separator = MD.thousandsseparator;

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
			separatorDecimal = MD.decimalseparator;

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

	AP.quicksort = function(name, asc) {

		var self = this;
		var length = self.length;
		if (!length || length === 1)
			return self;

		if (typeof(name) === 'boolean') {
			asc = name;
			name = undefined;
		}

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
				return va && vb ? (asc ? LCOMPARER(va, vb) : LCOMPARER(vb, va)) : 0;
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
			if (!output)
				output = [0];
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

	var BLACKLIST = { sort: 1, reverse: 1, splice: 1, slice: 1, pop: 1, unshift: 1, shift: 1, push: 1 };

	W.CREATE = function(path) {

		var is = false;
		var callback;

		if (typeof(path) === 'string') {
			if (proxy[path])
				return proxy[path];
			is = true;
			callback = function(key) {
				var p = path + (key ? '.' + key : '');
				if (M.skipproxy === p) {
					M.skipproxy = '';
					return;
				}
				setTimeout(function() {
					if (M.skipproxy === p)
						M.skipproxy = '';
					else
						W.NOTIFY(p, true);
				}, MD.delaybinder);
			};

		} else
			callback = path;

		var blocked = false;
		var obj = path ? (GET(path) || {}) : {};
		var handler = {
			get: function(target, property, receiver) {
				try {
					return new Proxy(target[property], handler);
				} catch (err) {
					return Reflect.get(target, property, receiver);
				}
			},
			defineProperty: function(target, property, descriptor) {
				!blocked && callback(property, descriptor);
				return Reflect.defineProperty(target, property, descriptor);
			},
			deleteProperty: function(target, property) {
				!blocked && callback(property);
				return Reflect.deleteProperty(target, property);
			},
			apply: function(target, thisArg, argumentsList) {
				if (BLACKLIST[target.name]) {
					blocked = true;
					var result = Reflect.apply(target, thisArg, argumentsList);
					callback('', argumentsList[0]);
					blocked = false;
					return result;
				}
				return Reflect.apply(target, thisArg, argumentsList);
			}
		};

		var o = new Proxy(obj, handler);

		if (is) {
			M.skipproxy = path;
			GET(path) == null && SET(path, obj, true);
			return proxy[path] = o;
		} else
			return o;
	};

	// Waits for jQuery
	WAIT(function() {
		return !!W.jQuery;
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
				W.FIND(item.selector, true).forEach(function(component) {
					component && component.usage.compare(item.name, dt) && item.callback(component);
				});
			}
		}, 3500);

		$.fn.FIND = function(selector, many, callback, timeout) {

			if (typeof(many) === 'function') {
				timeout = callback;
				callback = many;
				many = undefined;
			}

			var self = this;
			var output = findcomponent(self, selector);
			if (typeof(callback) === 'function') {

				if (output.length) {
					callback.call(output, output);
					return self;
				}

				W.WAIT(function() {
					var val = self.FIND(selector, many);
					return val instanceof Array ? val.length > 0 : !!val;
				}, function(err) {
					// timeout
					if (!err) {
						var val = self.FIND(selector, many);
						callback.call(val ? val : W, val);
					}
				}, 500, timeout);

				return self;
			}

			return many ? output : output[0];
		};

		$.fn.SETTER = function(selector, name) {

			var self = this;
			var arg = [];
			var beg = selector === true ? 3 : 2;

			for (var i = beg; i < arguments.length; i++)
				arg.push(arguments[i]);

			if (beg === 3) {
				selector = name;
				name = arguments[2];
				self.FIND(selector, true, function(arr) {
					for (var i = 0, length = arr.length; i < length; i++) {
						var o = arr[i];
						if (typeof(o[name]) === 'function')
							o[name].apply(o, arg);
						else
							o[name] = arg[0];
					}
				});
			} else {
				var arr = self.FIND(selector, true);
				for (var i = 0, length = arr.length; i < length; i++) {
					var o = arr[i];
					if (typeof(o[name]) === 'function')
						o[name].apply(o, arg);
					else
						o[name] = arg[0];
				}
			}

			return self;
		};

		$.fn.RECONFIGURE = function(selector, value) {
			return this.SETTER(selector, 'reconfigure', value);
		};

		$.fn.scope = function() {

			if (!this.length)
				return null;

			var data = this.get(0).$scopedata;
			if (data)
				return data;
			var el = this.closest('[data-jc-scope]');
			if (el.length) {
				data = el.get(0).$scopedata;
				if (data)
					return data;
			}
			return null;
		};

		$.fn.controller = function() {
			if (!this.length)
				return;
			var a = 'jc-controller';
			var n = this.attrd(a);
			if (n)
				return CONTROLLER(n);
			var el = this.closest('[data-' + a + ']');
			if (el.length) {
				n = el.attrd(a);
				if (n)
					return CONTROLLER(n);
			}
		};

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
			var arr = (self.attr('class') || '').split(' ');
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

			$(document).on('input', 'input[data-jc-bind],textarea[data-jc-bind]', function() {

				// realtime binding
				var self = this;
				var com = self.$com;

				if (!com || com.$removed || !com.getter || self.$jckeypress === false)
					return;

				self.$jcevent = 2;

				if (self.$jckeypress === undefined) {
					var tmp = attrcom(self, 'keypress');
					if (tmp)
						self.$jckeypress = tmp === 'true';
					else
						self.$jckeypress = MD.keypress;
					if (self.$jckeypress === false)
						return;
				}

				if (self.$jcdelay === undefined)
					self.$jcdelay = +(attrcom(self, 'keypress-delay') || MD.delay);

				if (self.$jconly === undefined)
					self.$jconly = attrcom(self, 'keypress-only') === 'true';

				self.$jctimeout && clearTimeout(self.$jctimeout);
				self.$jctimeout = setTimeout(keypressdelay, self.$jcdelay, self);
			});

			$(document).on('focus blur', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function(e) {

				var self = this;
				var com = self.$com;

				if (!com || com.$removed || !com.getter)
					return;

				if (e.type === 'focusin')
					self.$jcevent = 1;
				else if (self.$jcevent === 1) {
					com.dirty(false, true);
					com.getter(self.value, true, true, true);
				}
			});

			$(document).on('change', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function() {

				var self = this;
				var com = self.$com;

				if (self.$jconly || !com || com.$removed || !com.getter)
					return;

				if (self.$jckeypress === false) {
					// bind + validate
					com.getter(self.value, false, true);
					return;
				}

				switch (self.tagName) {
					case 'SELECT':
						var sel = self[self.selectedIndex];
						self.$jcevent = 2;
						com.dirty(false, true);
						com.getter(sel.value, false, true);
						return;
					case 'INPUT':
						if (self.type === 'checkbox' || self.type === 'radio') {
							self.$jcevent = 2;
							com.dirty(false, true);
							com.getter(self.checked, false, true);
							return;
						}
						break;
				}

				if (self.$jctimeout) {
					com.dirty(false, true);
					com.getter(self.value, true, true);
					clearTimeout(self.$jctimeout);
					self.$jctimeout = 0;
				} else
					com.setter && com.setterX(com.get(), self.path, 2);

			});

			setTimeout(compile, 2);
			$domready = true;
		});
	}, 100);

	function keypressdelay(self) {
		var com = self.$com;
		// Reset timeout
		self.$jctimeout = 0;
		// It's not dirty
		com.dirty(false, true);
		// Binds a value
		com.getter(self.value, true, true);
	}

	M.$parser.push(function(path, value, type) {

		switch (type) {
			case 'number':
			case 'currency':
			case 'float':
				var v = +(typeof(value) == 'string' ? value.replace(REGEMPTY, '').replace(REGCOMMA, '.') : value);
				return isNaN(v) ? null : v;

			case 'date':
			case 'datetime':

				if (!value)
					return null;

				if (value instanceof Date)
					return value;

				value = value.parseDate();
				return value && value.getTime() ? value : null;
		}

		return value;
	});

})();