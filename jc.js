(function() {

	// Constants
	var REGCOM = /(data-ja|data-jc)\=/;
	var REGSCRIPT = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGCSS = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGEMPTY = /\s/g;
	var REGCOMMA = /,/g;
	var ATTRSCOPE = '[data-jc-scope],[data-jc-controller]';
	var ATTRCOM = '[data-jc]';
	var ATTRURL = '[data-jc-url],[data-ja-url]';
	var ATTRDATA = 'jc';
	var ATTRDEL = 'data-jc-removed';
	var ATTRBIND = 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]';
	var DIACRITICS = {225:'a',228:'a',269:'c',271:'d',233:'e',283:'e',357:'t',382:'z',250:'u',367:'u',252:'u',369:'u',237:'i',239:'i',244:'o',243:'o',246:'o',353:'s',318:'l',314:'l',253:'y',255:'y',263:'c',345:'r',341:'r',328:'n',337:'o'};

	var C = {}; // COMPILER
	var M = {}; // MAIN
	var A = {}; // APPS CONTAINER
	var W = window;

	// Internal cache
	var blocked = {};
	var storage = {};
	var extensions = {}; // COMPONENT_EXTEND()
	var cache = {};
	var paths = {}; // saved paths from get() and set()
	var events = {};
	var temp = {};
	var mediaqueries = {};
	var singletons = {};
	var schedulers = [];
	var toggles = [];
	var ajax = {};
	var middlewares = {};
	var warnings = [];
	var schemas = {};
	var autofill = [];
	var defaults = {};
	var waits = {};
	var operations = {};
	var controllers = {};
	var workflows = {};
	var styles = [];
	var statics = {};
	var $ready = setTimeout(load, 2);
	var schedulercounter = 0;
	var mediaqueriescounter = 0;
	var knockknockcounter = 0;

	var tmp_emit2 = [null, null, null];
	var tmp_notify = [null, null];

	W.MAIN = W.M = W.jC = W.COM = M;
	W.APPS = W.A = A;
	W.EMPTYARRAY = [];
	W.EMPTYOBJECT = {};
	W.DATETIME = new Date();

	M.defaults = {};
	M.defaults.delay = 300;
	M.defaults.keypress = true;
	M.defaults.localstorage = true;
	M.defaults.jsoncompress = false;
	M.defaults.jsondate = true;
	M.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' };
	M.defaults.devices = { xs: { max: 768 }, sm: { min: 768, max: 992 }, md: { min: 992, max: 1200 }, lg: { min: 1200 }};
	M.defaults.importcache = 'session';
	M.defaults.jsonconverter = {
		'text json': function (text) {
			return PARSE(text);
		}
	};

	M.version = 'v10.0.0';
	M.$localstorage = 'jc';
	M.$version = '';
	M.$language = '';

	M.$components = {};
	M.components = [];
	M.$apps = {};
	M.apps = [];
	M.$formatter = [];
	M.$parser = [];
	M.compiler = C;

	C.is = false;
	C.recompile = false;
	C.pending = [];
	C.imports = [];
	C.init = [];
	C.imports = {};
	C.ready = [];
	C.counter = 0;

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

	M.clean = function(timeout) {
		setTimeout2('$clean', cleaner, timeout || 10);
		return M;
	};

	M.evaluate = function(path, expression, nopath) {

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

	M.cookies = {
		get: function (name) {
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
			document.cookie = name + '=' + value + '; expires=' + expire.toGMTString() + '; path=/';
		},
		rem: function (name) {
			M.set(name, '', -1);
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
			for (var i = 0, length = a.length; i < length; i++)
				value = a[i].call(M, path, value, type);
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

	M.upload = function(url, data, callback, timeout, progress) {

		if (!url)
			url = location.pathname;

		if (typeof(callback) === 'number') {
			timeout = callback;
			callback = undefined;
		}

		setTimeout(function() {
			var xhr = new XMLHttpRequest();
			var output = {};
			output.process = true;
			output.error = false;
			output.upload = true;
			output.method = 'POST';
			output.url = url;
			output.data = data;

			xhr.addEventListener('load', function() {

				var r = this.responseText;
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
				output.status = this.status;
				output.error = this.status !== 200;
				output.headers = this.getAllResponseHeaders();

				EMIT('response', output);

				if (!output.process)
					return;

				if (!output.error)
					return typeof(callback) === 'string' ? remap(callback, r) : (callback && callback(r));

				if (!r)
					r = output.response = this.status + ': ' + this.statusText;

				EMIT('error', output);
				output.process && typeof(callback) === 'function' && callback({}, r, output);

			}, false);

			xhr.upload.onprogress = function(evt) {
				if (!progress)
					return;
				var percentage = 0;
				if (evt.lengthComputable)
					percentage = Math.round(evt.loaded * 100 / evt.total);
				if (typeof(progress) === 'string')
					remap(progress, percentage);
				else
					progress(percentage, evt.transferSpeed, evt.timeRemaining);
			};

			xhr.open('POST', url);
			Object.keys(M.defaults.headers).forEach(function(key) {
				xhr.setRequestHeader(key, M.defaults.headers[key]);
			});
			xhr.send(data);
		}, timeout || 0);

		return M;
	};

	M.ready = function(fn) {
		C.ready && C.ready.push(fn);
		return M;
	};

	M.watch = function(path, fn, init) {

		if (typeof(path) === 'function') {
			init = fn;
			fn = path;
			path = '*';
		}

		ON('watch', path, fn);
		init && fn.call(M, path, get(path), 0);
		return M;
	};

	M.on = function(name, path, fn, init) {

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

		if (!events[path]) {
			events[path] = {};
			events[path][name] = [];
		} else if (!events[path][name])
			events[path][name] = [];

		events[path][name].push({ fn: fn, id: this._id, path: fixed });
		init && fn.call(M, path, get(path), true);
		(M.ready && (name === 'ready' || name === 'init')) && fn();
		return M;
	};

	M.emit = function(name) {

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

	M.change = function(path, value) {
		if (value === undefined)
			return !M.dirty(path);
		return !M.dirty(path, !value);
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
				if (arr && obj.state)
					arr.push(obj);
				return;
			}

			if (value === undefined) {
				if (obj.$valid === false)
					valid = false;
				return;
			}

			if (obj.state)
				arr.push(obj);

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
				if (arr && obj.state)
					arr.push(obj);
				return;
			}

			if (value === undefined) {
				if (obj.$dirty === false)
					dirty = false;
				return;
			}

			if (obj.state)
				arr.push(obj);

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

	M.import = function(url, target, callback, insert, preparator) {

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

		if (insert === undefined)
			insert = true;

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
			scr.async = true;
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

			var id = '';

			if (insert) {
				id = 'data-jc-imported="' + ((Math.random() * 100000) >> 0) + '"';
				$(target).append('<div ' + id + '></div>');
				target = $(target).find('> div[' + id + ']');
			}

			var key = makeurl(url);
			AJAXCACHE('GET ' + key, null, function(response) {

				key = '$import' + key;

				if (preparator)
					response = preparator(response);

				if (cache[key])
					response = removescripts(response);
				else
					response = importstyles(response, id);

				$(target).html(response);
				cache[key] = true;

				setTimeout(function() {
					response && REGCOM.test(response) && compile(target);
					callback && callback();
				}, 10);

			}, M.defaults.importcache);
		});

		return M;
	};

	M.cachepath = function(path, expire, rebind) {
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


	M.cache = function(key, value, expire) {
		return cachestorage(key, value, expire);
	};

	M.removeCache = function(key, isSearching) {
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

	M.usage = function(name, expire, path, callback) {

		var type = typeof(expire);
		if (type === 'string')
			expire = W.DATETIME.add('-' + expire);
		else if (type === 'number')
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

	M.AJAX = function(url, data, callback, timeout) {

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

		url = url.substring(index).trim();

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

			if (url.match(/http\:\/\/|https\:\/\//i)) {
				options.crossDomain = true;
				if (isCredentials)
					options.xhrFields = { withCredentials: true };
			}

			options.headers = $.extend(headers, M.defaults.headers);

			var key = W.HASH(url + STRINGIFY(options));
			var ma = ajax[key];
			if (ma) {
				ma.jcabort = true;
				ma.abort();
				ma = undefined;
			}

			var output = {};
			output.url = url;
			output.process = true;
			output.error = false;
			output.upload = false;
			output.method = method;
			output.data = data;

			options.success = function(r, s, req) {
				delete ajax[key];
				output.response = r;
				output.status = s;
				output.headers = req.getAllResponseHeaders();
				EMIT('response', output);
				output.process && middleware(mid, output.response, 1, function(path, value) {
					if (typeof(callback) === 'string')
						remap(callback, value);
					else
						callback && callback(value, undefined, output);
				});
			};

			options.error = function(req, status, e) {
				delete ajax[key];
				output.response = req.responseText;
				output.status = status + ': ' + e;
				output.error = true;
				output.headers = req.getAllResponseHeaders();

				if (output.headers.indexOf('/json') !== -1) {
					try {
						output.response = PARSE(output.response, M.defaults.jsondate);
					} catch (e) {}
				}

				EMIT('response', output);
				output.process && EMIT('error', output);
				output.process && typeof(callback) === 'function' && callback(output.response, output.status, output);
			};

			ajax[key] = $.ajax(makeurl(url), options);
		}, timeout || 0);

		return M;
	};

	M.AJAXCACHEREVIEW = function(url, data, callback, expire, timeout, clear) {
		return AJAXCACHE(url, data, callback, expire, timeout, clear, true);
	};

	M.AJAXCACHE = function(url, data, callback, expire, timeout, clear, review) {

		if (typeof(url) === 'function') {
			timeout = callback;
			callback = data;
			data = url;
			url = location.pathname;
		}

		var td = typeof(data);
		if ((!callback || typeof(callback) === 'number') && (td === 'function' || td === 'string')) {
			clear = timeout;
			timeout = expire;
			expire = callback;
			callback = data;
			data = undefined;
		}

		if (typeof(timeout) === 'boolean') {
			var tmp = clear;
			clear = timeout;
			timeout = tmp;
		}

		var index = url.indexOf(' ');
		if (index === -1)
			return M;

		var method = url.substring(0, index).toUpperCase();
		var uri = url.substring(index).trim();

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

				AJAX(url, data, function(r, err) {
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

	M.schedule = function(selector, name, expire, callback) {
		if (expire.substring(0, 1) !== '-')
			expire = '-' + expire;
		var arr = expire.split(' ');
		var type = arr[1].toLowerCase().substring(0, 1);
		schedulers.push({ name: name, expire: expire, selector: selector, callback: callback, type: type === 'y' || type === 'd' ? 'h' : type });
		return M;
	};

	M.errors = function(path, except) {

		if (path instanceof Array) {
			except = path;
			path = undefined;
		}

		var arr = [];
		M.each(function(obj) {
			if (except && except.indexOf(obj.path) !== -1)
				return;
			if (obj.$valid === false && !obj.$valid_disabled)
				arr.push(obj);
		}, path);
		return arr;
	};

	M.can = function(path, except) {
		return !M.dirty(path, except) && M.valid(path, except);
	};

	M.disabled = M.disable = function(path, except) {
		return M.dirty(path, except) || !M.valid(path, except);
	};

	M.invalid = function(path, onlyComponent) {
		M.dirty(path, false, onlyComponent, true);
		M.valid(path, false, onlyComponent);
		return M;
	};

	M.blocked = function(name, timeout, callback) {
		var key = name;
		var item = blocked[key];
		var now = Date.now();

		if (item > now)
			return true;

		var local = M.defaults.localstorage && timeout > 10000;
		blocked[key] = now + timeout;

		try {
			local && localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));
		} catch (e) {
			// private mode
		}

		callback && callback();
		return false;
	};

	// 1 === manually
	// 2 === by input
	M.update = function(path, reset, type) {

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

					component.element.find(ATTRBIND).each(function() {
						this.$value = this.$value2 = undefined;
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

	M.notify = function() {

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
			component.setter2 && component.setter(val, component.path, 1);
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

			tmp_notify[0] = key;
			tmp_notify[1] = get(key);
			emit2('watch', key, tmp_notify);
		});

		return M;
	};

	M.extend = function(path, value, type) {
		var val = get(path);
		if (val == null)
			val = {};
		M.set(path, $.extend(val, value), type);
		return M;
	};

	M.rewrite = function(path, val) {
		middleware(path, val, 1, helper_rewrite);
		return M;
	};

	function helper_rewrite(path, value) {
		set(path, value, 1);
		emitwildcard(path, value, 1);
	}

	M.inc = function(path, value, type) {
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

			var isUpdate = (typeof(value) === 'object' && !(value instanceof Array) && value !== null && value !== undefined);
			var reset = type === true;
			if (reset)
				type = 1;

			set(path, value, type);

			if (isUpdate)
				return M.update(path, reset, type);

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

					component.element.find(ATTRBIND).each(function() {
						this.$value = this.$value2 = undefined;
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

	M.get = function(path, scope) {
		return get(path, scope);
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
		}, path);

		setTimeout2('$cleaner', cleaner, 100);
		return M;
	};

	M.schema = function(name, declaration) {

		if (!declaration)
			return $.extend(true, {}, schemas[name]);

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

	M.validate = function(path, except) {

		var arr = [];
		var valid = true;

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

			obj.element.find(ATTRBIND).each(function() {
				this.$value = this.$value2 = undefined;
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

	M.reset = function(path, timeout, onlyComponent) {

		if (timeout > 0) {
			setTimeout(function() {
				M.reset(path);
			}, timeout);
			return M;
		}

		var arr = [];

		M.each(function(obj) {

			if (obj.disabled)
				return;

			obj.state && arr.push(obj);

			if (onlyComponent && onlyComponent._id !== obj._id)
				return;

			obj.element.find(ATTRBIND).each(function() {
				this.$value2 = this.$value = undefined;
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
		}, path);

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
		}, path);

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

			if (!component || component.$removed || (fix && component.path !== path))
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

		AJAX('GET ' + url, function(response, err) {

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
	// APPS FUNCTIONS
	// ===============================================================

	A.emit = function(a, b, c, d, e) {
		for (var i = 0, length = M.apps.length; i < length; i++)
			M.apps[i].emit.call(M.apps[i], a, b, c, d, e);
		return A;
	};

	A.import = function(url, callback) {
		var index = url.indexOf(' ');
		if (index === -1 || index > 5)
			url = 'GET ' + url;
		AJAX(url, function(response) {
			var is = response ? compileapp(response) : false;
			callback && callback(is ? null : new Error('Invalid jComponent application.'));
		});
		return A;
	};

	A.compile = function(body) {
		return compileapp(body);
	};

	A.save = function() {

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
		W.MIDDLEWARE(path.substring(index + 1).trim().replace(/\#/g, '').split(' '), value, function(value) {
			callback(a, value);
		}, a);
	}

	function keypress(self, old, e) {

		if (self.value === old)
			return;

		if (self.value !== self.$value2) {
			var dirty = false;

			if (e.keyCode !== 9) {
				if (self.$com.$dirty)
					dirty = true;
				self.$com.dirty(false, true);
			}

			self.$com.getter(self.value, 2, dirty, old, e.type === 'focusout' || e.keyCode === 13);
			if (self.nodeName === 'INPUT' || self.nodeName === 'TEXTAREA') {
				var val = self.$com.formatter(self.value);
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
		return el.getAttribute ? el.getAttribute('data-jc' + name) : el.attr('data-jc' + name);
	}

	function attrapp(el, name) {
		name = name ? '-' + name : '';
		return el.getAttribute ? el.getAttribute('data-ja' + name) : el.attr('data-ja' + name);
	}

	function crawler(container, onComponent, onApp, level) {

		if (container)
			container = $(container).get(0);
		else
			container = document.body;

		if (!container)
			return;

		var name = attrapp(container);
		!container.$app && name != null && onApp(name, container, 0);

		name = attrcom(container);
		!container.$com && name != null && onComponent(name, container, 0);

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

				if (!el.$app) {
					name = attrapp(el);
					name != null && onApp(name || '', el, level);
				}

				if (!el.$com) {
					name = attrcom(el);
					name != null && onComponent(name || '', el, level);
				}
			}
		}

		for (var i = 0, length = sub.length; i < length; i++) {
			el = sub[i];
			el && crawler(el, onComponent, onApp, level);
		}
	}

	function compileapp(html) {

		var beg = -1;
		var end = -1;

		var body_settings = '';
		var body_script = '';
		var body_readme = '';
		var body_style = '';
		var body_html = '';

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
				body_readme = body;
			else if (type.indexOf('html') !== -1) {
				if (type.indexOf('settings') !== -1)
					body_settings = body;
				else
					body_html = body;
			} else
				body_script = body;

			end += 9;
		}

		if (!body)
			return false;

		beg = html.indexOf('<style');
		if (beg !== -1)
			body_style = html.substring(html.indexOf('>', beg) + 1, html.indexOf('</style>')).trim();

		var app = {};

		try {
			new Function('exports', body_script)(app);
		} catch(e) {
			warn('A problem with compiling application: {0}.' + e.toString());
		}

		if (!app.name || !app.install)
			return false;

		var name = app.name;
		app.settings = body_settings;
		app.readme = body_readme;
		app.html = body_html;

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
				if (item.name !== name)
					return next();
				item.remove(true);
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

		var scopes = $(ATTRSCOPE);
		var scopes_length = scopes.length;
		var has = false;

		crawler(container, function(name, dom) {

			var el = $(dom);
			has = true;

			// Check singleton instance
			if (C.init['$ST_' + name]) {
				remove(el);
				return;
			}

			var instances = [];
			var all = name.split(',');

			all.forEach(function(name) {
				name = name.trim();

				var com = M.$components[name || ''];
				if (!com) {

					var x = attrcom(el, 'import');
					if (!x) {
						!C.init['$NE_' + name] && (C.init['$NE_' + name] = true);
						return;
					}

					if (C.imports[x] === 1)
						return;

					if (C.imports[x] === 2) {
						!C.init['$NE_' + name] && (C.init['$NE_' + name] = true);
						return;
					}

					C.imports[x] = 1;
					IMPORT(x, function() {
						C.imports[x] = 2;
					});
					return;
				}

				var obj = com(el);
				if (obj.init) {
					if (!C.init[name]) {
						C.init[name] = true;
						obj.init();
					}
					obj.init = undefined;
				}

				obj.$init = attrcom(el, 'init') || null;
				obj.type = attrcom(el, 'type') || '';
				obj.id = attrcom(el, 'id') || obj._id;
				obj.siblings = all.length > 1;

				dom.$com = obj;

				if (!obj.$noscope)
					obj.$noscope = attrcom(el, 'noscope') === 'true';

				var code = obj.path ? obj.path.charCodeAt(0) : 0;
				if (!obj.$noscope && scopes_length && obj.path && code !== 33 && code !== 35) {

					for (var i = 0; i < scopes_length; i++) {

						if (!$.contains(scopes[i], dom))
							continue;

						var p = scopes[i].$cope || attrcom(scopes[i], 'scope');

						scopes[i].$initialized = true;

						if (!scopes[i].$processed) {
							scopes[i].$processed = true;

							if (!p || p === '?') {
								p = GUID(25).replace(/\d/g, '');
								scopes[i].$cope = p;
							}

							var tmp = attrcom(scopes[i], 'value');
							if (tmp) {
								var fn = new Function('return ' + tmp);
								defaults['#' + W.HASH(p)] = fn; // store by path (DEFAULT() --> can reset scope object)
								tmp = fn();
								set(p, tmp);
								emitwildcard(p, tmp, 1);
							}
						}

						obj.setPath(obj.path === '?' ? p : (obj.path.indexOf('?') === -1 ? p + '.' + obj.path : obj.path.replace(/\?/g, p)));
						obj.scope = scopes[i];
						obj.$controller = attrcom(scopes[i], 'controller');
						obj.pathscope = p;
					}
				}

				instances.push(obj);

				var template = attrcom(el, 'template') || obj.template;
				if (template)
					obj.template = template;

				if (attrcom(el, 'released') === 'true')
					obj.$released = true;

				if (attrcom(el, 'url'))
					return warn('Components: You cannot use [data-jc-url] for the component: {0}[{1}]. Instead of it you have to use data-jc-template.'.format(obj.name, obj.path));

				if (typeof(template) === 'string') {
					var fn = function(data) {
						if (obj.prerender)
							data = obj.prerender(data);
						typeof(obj.make) === 'function' && obj.make(data);
						init(el, obj);
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
						if (obj.prerender)
							obj.make = obj.prerender(obj.make);
						el.html(obj.make);
						init(el, obj);
						return;
					}

					$.get(makeurl(obj.make), function(data) {
						if (obj.prerender)
							data = obj.prerender(data);
						el.html(data);
						init(el, obj);
					});

					return;
				}

				obj.make && obj.make();
				init(el, obj);
			});

			// A reference to instance
			el.data(ATTRDATA, instances.length > 1 ? instances : instances[0]);

		}, function(name, dom) {
			var d = M.$apps[name];
			if (d) {
				var id = attrapp(dom, 'id');

				if (!id) {
					warn('Apps: The application "{0}" doesn\'t contain "data-ja-id" attribute.'.format(name));
					return;
				}

				var el = $(dom);
				var key = id ? ('app.' + name + '.' + id + '.options') : null;
				d.html && el.empty().append(d.html);
				id = 'app' + W.HASH(id);
				var app = new APP(id, el, d, key);
				app.$cache = key;
				dom.$app = app;
				el.data(ATTRDATA, app);
				M.apps.push(app);
				REGCOM.test(d.html) && compile(el);
				var cls = attrapp(el, 'class');
				if (cls) {
					toggles.push({ toggle: cls.split(' '), element: el });
					el.removeAttr('data-ja-class');
				}
			}
		}, undefined);

		if (!has)
			C.is = false;

		if (container !== undefined || !toggles.length)
			return nextpending();

		async(toggles, function(item, next) {
			for (var i = 0, length = item.toggle.length; i < length; i++)
				item.element.toggleClass(item.toggle[i]);
			next();
		}, nextpending);
	}

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

			AJAXCACHE('GET ' + item.url, null, function(response) {

				if (item.app) {
					compileapp(response);
					canCompile = true;
					count++;
					return next();
				}

				key = '$import' + key;

				if (statics[key])
					response = removescripts(response);

				can = response && REGCOM.test(response);
				if (can || item.app)
					canCompile = true;

				item.element.html(response);
				statics[key] = true;

				if (can && item.path) {
					var com = item.element.find(ATTRCOM);
					com.each(function() {
						var el = $(this);
						$.each(this.attributes, function() {
							// @TODO: this.specified --> WTF?
							this.specified && el.attr(this.name, this.value.replace('$', item.path));
						});
					});
				}

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
		el.attr('data-ja-removed', true);
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
		if (type === 'INPUT' || type === 'SELECT' || type === 'TEXTAREA') {
			obj.$input = true;
			collection = obj.element;
		} else
			collection = el.find(ATTRBIND);

		collection.each(function() {
			!this.$com && (this.$com = obj);
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
			!M.ready && compile();
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

		extensions[obj.name] && extensions[obj.name].forEach(function(fn) {
			fn.call(obj, obj);
		});

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

				if (!obj.$binded) {
					obj.$binded = true;
					middleware(obj.middleware, value, 1, function(path, value) {
						obj.setter(value, obj.path, 0);
						obj.$interaction(0);
					});
				} else
					obj.$interaction(0);
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
				for (var i = 0, length = cls.length; i < length; i++)
					el.toggleClass(cls[i]);
			}, 5);
		})(cls);

		obj.id && EMIT('#' + obj.id, obj);
		EMIT('@' + obj.name, obj);
		EMIT('component', obj);
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
		else if (M.ready)
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

			if (!M.ready) {
				clear('valid', 'dirty', 'find');
				M.ready = true;
				EMIT('init');
				EMIT('ready');
			}

			setTimeout2('$initcleaner', function() {
				cleaner();
				autofill.splice(0).forEach(function(component) {
					var el = component.element.find(ATTRBIND).eq(0);
					var val = el.val();
					if (val) {
						var tmp = component.parser(val);
						component.set(tmp);
						emitwildcard(component.path, tmp, 3);
					}
				});
			}, 1000);

			C.is = false;

			$(ATTRSCOPE).each(function() {

				var t = this;

				if (!t.$initialized || t.$ready)
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
								scope.toggleClass(cls[i]);
						}, 5);
					})(cls);
				}

				var controller = attrcom(t, 'controller');
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
			return scr.substring(0, 6) === '<style' || scr === '<script>' || scr.indexOf('/javascript"') !== -1 ? '' : text;
		});
	}

	function importstyles(str, id) {
		return str.replace(REGCSS, function(text) {
			text = text.replace('<style>', '<style type="text/css">');
			id && (text = text.replace('<style', '<style ' + id));
			$(text).appendTo('head');
			return '';
		});
	}

	function remap(path, value) {
		middleware(path, value, 1, function(path, value) {
			var index = path.replace('-->', '->').indexOf('->');
			if (index === -1)
				return M.set(path, value);
			var o = path.substring(0, index).trim();
			var n = path.substring(index + 2).trim();
			M.set(n, value[o]);
		});
	}

	function set(path, value) {

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

		var fn = (new Function('w', 'a', 'b', builder.join(';') + ';var v=typeof(a)===\'function\'?a(MAIN.compiler.get(b)):a;w.' + path.replace(/\'/, '\'') + '=v;return v'));
		paths[key] = fn;
		fn(W, value, path);
		return C;
	}

	function get(path, scope) {

		if (path.charCodeAt(0) === 35) {
			var op = OPERATION(path);
			return op ? op : NOOP;
		}

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

		var fn = (new Function('w', builder.join(';') + ';return w.' + path.replace(/\'/, '\'')));
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

			if (component.$removed)
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

			EMIT('destroy', component.name, component);

			component.destroy && component.destroy();
			component.element.off();
			component.element.find('*').off();
			component.element.remove();
			component.element = null;
			component.$removed = true;
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

			EMIT('destroy', app.name, app);

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

		if (M.defaults.localstorage && is2) {
			try {
				localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));
			} catch(e) {
				// private mode
			}
		}

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
		try {
			M.defaults.localstorage && localStorage.setItem(M.$localstorage + '.cache', JSON.stringify(storage));
		} catch(e) {
			// private mode
		}
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
				return al > bl ? - 1 : al === bl ? a.path.localeCompare(b.path) : 1;
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
	// APPLICATION DECLARATION
	// ===============================================================

	function APP(id, element, declaration, key) {
		var self = this;
		self.$events = {};
		self.id = id;
		self.scope = attrapp(element, 'scope') || attrcom(element, 'scope') || ('app' + GUID(10));
		!attrapp(element, 'noscope') && element.attr('data-jc-scope', self.scope);
		self.name = declaration.name;
		self.type = declaration.type;
		self.element = element;
		self.key = key;
		self.declaration = declaration;
		self.$load(function(options) {
			self.options = $.extend(true, CLONE(declaration.options), options || EMPTYOBJECT);
			declaration.install.call(self, self);
			self.make && self.make();
		});
	}

	APP.prototype.change = function() {
		this.$save();
		return this;
	};

	APP.prototype.emit = function(name) {
		var e = this.$events[name];
		if (e && e.length) {
			for (var i = 0, length = e.length; i < length; i++)
				e[i].call(this, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		}
		return this;
	};

	APP.prototype.on = function(name, fn) {
		var e = this.$events[name];
		!e && (this.$events[name] = e = []);
		e.push(fn);
		return this;
	};

	APP.prototype.find = function(selector) {
		return this.element.find(selector);
	};

	APP.prototype.append = function(value) {
		return this.element.append(value);
	};

	APP.prototype.html = function(value) {
		return this.element.html(value);
	};

	APP.prototype.event = function() {
		this.element.on.apply(this.element, arguments);
		return this;
	};

	APP.prototype.path = function(path) {
		return this.scope + (path ? '.' + path : '');
	};

	APP.prototype.set = function(path, value, type) {
		var self = this;
		M.set(self.path(path), value, type);
		return self;
	};

	APP.prototype.update = function(path, reset, type) {
		var self = this;
		M.update(self.path(path), reset, type);
		return self;
	};

	APP.prototype.notify = function(path) {
		var self = this;
		M.notify(self.path(path));
		return self;
	};

	APP.prototype.inc = function(path, value, type) {
		var self = this;
		M.inc(self.path(path), value, type);
		return self;
	};

	APP.prototype.push = function(path, value, type) {
		var self = this;
		M.push(self.path(path), value, type);
		return self;
	};

	APP.prototype.extend = function(path, value, type) {
		var self = this;
		M.extend(self.path(path), value, type);
		return self;
	};

	APP.prototype.rewrite = function(path, value) {
		var self = this;
		M.rewrite(self.path(path), value);
		return self;
	};

	APP.prototype.default = function(path, timeout, onlyComponent, reset) {
		var self = this;
		M.default(self.path(path), timeout, onlyComponent, reset);
		return self;
	};

	APP.prototype.get = function(path) {
		return get(self.path(path));
	};

	APP.prototype.toggle = function(cls, visible, timeout) {

		var manual = false;

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

		var el = this.element;
		if (!timeout) {
			el.toggleClass(cls, visible);
			return this;
		}

		setTimeout(function() {
			el.toggleClass(cls, visible);
		}, timeout);
		return this;
	};

	APP.prototype.attr = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.attr(name);
		el.attr(name, value);
		return this;
	};

	APP.prototype.css = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.css(name);
		el.css(name, value);
		return this;
	};

	APP.prototype.empty = function() {
		var el = this.element;
		el.empty();
		return el;
	};

	APP.prototype.remove = function(noremove) {
		var self = this;
		self.destroy && self.destroy();
		self.emit('destroy');
		self.element.removeData(ATTRDATA);
		self.element.get(0).$app = null;

		if (!noremove) {
			self.element.remove();
			self.key && M.removeCache(self.key);
		}

		self.element.off();
		M.apps = M.apps.remove(self);
		setTimeout2('$cleaner', cleaner, 100);
		return self;
	};

	APP.prototype.$load = function(callback) {
		var self = this;
		callback(self.key ? M.cache(self.key) : null);
		return self;
	};

	APP.prototype.$save = function() {
		var self = this;
		self.key && M.cache(self.key, self.options, '1 year');
		return self;
	};

	// ===============================================================
	// COMPONENT DECLARATION
	// ===============================================================

	function COM(name) {
		this._id = 'component' + (C.counter++);
		this.usage = new USAGE();
		this.$dirty = true;
		this.$valid = true;
		this.$validate = false;
		this.$parser = [];
		this.$formatter = [];
		this.$skip = false;
		this.$ready = false;
		this.$path;
		this.trim = true;
		this.middleware = ''; // internal
		this.$released = false;

		this.name = name;
		this.path;
		this.type;
		this.id;
		this.disabled = false;

		this.make;
		this.done;
		this.prerender;
		this.destroy;
		this.state;
		this.validate;
		this.released;

		this.release = function(value) {

			var self = this;
			if (value === undefined || self.$removed)
				return self.$released;

			self.element.find(ATTRCOM).each(function() {
				var el = $(this);
				el.attr('data-jc-released', value ? 'true' : 'false');
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
				self.released && this.released(value, self);
			}

			return value;
		};

		this.getter = function(value, type, dirty, older, skip) {

			value = this.parser(value);

			if (type === 2 && !skip)
				this.$skip = true;

			if (type !== 2 || (older !== null && older !== undefined)) {
				M.validate(this.path);
				return this;
			}

			if (this.trim && typeof(value) === 'string')
				value = value.trim();

			if (value === this.get()) {
				dirty && M.validate(this.path);
				return this;
			}

			if (skip)
				this.$skip = false;

			this.getter2 && this.getter2.apply(this, arguments);
			this.set(this.path + this.middleware, value, type);
			return this;
		};

		this.setter = function(value, path, type) {

			var self = this;

			if (type === 2) {
				if (self.$skip) {
					self.$skip = false;
					return self;
				}
			}

			this.setter2 && this.setter2.apply(this, arguments);

			var selector = self.$input === true ? this.element : this.element.find(ATTRBIND);
			var a = 'select-one';

			value = self.formatter(value);
			selector.each(function() {

				var path = this.$com.path;
				if (path && path.length && path !== self.path)
					return;

				if (this.type === 'checkbox') {
					var tmp = value != null ? value.toString().toLowerCase() : '';
					tmp = tmp === 'true' || tmp === '1' || tmp === 'on';
					tmp !== this.checked && (this.checked = tmp);
					return;
				}

				if (value == null)
					value = '';

				if (!type && this.type !== a && this.type !== 'range' && (!value || (self.$default && self.$default() === value)))
					autofill.push(this.$com);

				if (this.type === a || this.type === 'select') {
					var el = $(this);
					el.val() !== value && el.val(value);
				} else
					this.value !== value && (this.value = value);
			});
		};
	}

	COM.prototype.controller = function() {
		return CONTROLLER(this.$controller);
	};

	COM.prototype.replace = function(el) {
		this.element = $(el);
		this.element.get(0).$com = this;
		return this;
	};

	COM.prototype.compile = function(container) {
		compile(container || this.element);
		return this;
	};

	COM.prototype.nested = function() {
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

	COM.prototype.$interaction = function(type) {
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

	COM.prototype.notify = function() {
		W.NOTIFY(this.path);
		return this;
	};

	COM.prototype.update = COM.prototype.refresh = function(notify) {
		if (notify)
			this.set(this.get());
		else {
			this.setter && this.setter(this.get(), this.path, 1);
			this.$interaction(1);
		}
		return this;
	};

	COM.prototype.classes = function(cls) {

		var key = 'cls.' + cls;
		var tmp = temp[key];
		var e = this.element;

		if (tmp) {
			tmp.add && e.addClass(tmp.add);
			tmp.rem && e.removeClass(tmp.rem);
			return this;
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

		add && e.addClass(add);
		rem && e.removeClass(rem);

		if (cls instanceof Array)
			return this;

		temp[key] = { add: add, rem: rem };
		return this;
	};

	COM.prototype.toggle = function(cls, visible, timeout) {

		var manual = false;

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

		var el = this.element;
		if (!timeout) {
			el.toggleClass(cls, visible);
			return this;
		}

		setTimeout(function() {
			el.toggleClass(cls, visible);
		}, timeout);
		return this;
	};

	COM.prototype.noscope = function(value) {
		this.$noscope = value === undefined ? true : value === true;
		return this;
	};

	COM.prototype.singleton = function() {
		C.init['$ST_' + this.name] = true;
		return this;
	};

	COM.prototype.blind = function() {
		this.path = null;
		this.$path = null;
		this.$$path = null;
		return this;
	};

	COM.prototype.readonly = function() {
		this.noDirty();
		this.noValid();
		this.getter = null;
		this.setter = null;
		this.$parser = null;
		this.$formatter = null;
		return this;
	};

	COM.prototype.noValid = COM.prototype.noValidate = function(val) {
		if (val === undefined)
			val = true;
		this.$valid_disabled = val;
		this.$valid = val;
		return this;
	};

	COM.prototype.noDirty = function(val) {
		if (val === undefined)
			val = true;
		this.$dirty_disabled = val;
		this.$dirty = val ? false : true;
		return this;
	};

	COM.prototype.setPath = function(path, init) {
		var fixed = null;

		if (path.charCodeAt(0) === 33) {
			path = path.substring(1);
			fixed = path;
		}

		var index = path.indexOf(' #');
		if (index !== -1) {
			this.middleware = path.substring(index);
			path = path.substring(0, index);
		} else
			this.middleware = '';

		this.path = path;
		this.$path = fixed;
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

		this.$$path = pre;
		!init && M.ready && refresh();
		return this;
	};

	COM.prototype.attr = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.attr(name);
		el.attr(name, value);
		return this;
	};

	COM.prototype.css = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.css(name);
		el.css(name, value);
		return this;
	};

	COM.prototype.html = function(value) {
		var el = this.element;
		var current = el.html();
		if (value === undefined)
			return current;
		if (value instanceof Array)
			value = value.join('');
		if (value === current)
			return el;
		var type = typeof(value);
		return value || type === 'number' || type === 'boolean' ? el.empty().append(value) : el.empty();
	};

	COM.prototype.empty = function() {
		var el = this.element;
		el.empty();
		return el;
	};

	COM.prototype.append = function(value) {
		var el = this.element;
		if (value instanceof Array)
			value = value.join('');
		return value ? el.append(value) : el;
	};

	COM.prototype.event = function() {
		this.element.on.apply(this.element, arguments);
		return this;
	};

	COM.prototype.find = function(selector) {
		return this.element.find(selector);
	};

	COM.prototype.isInvalid = function() {
		var is = !this.$valid;
		if (is && !this.$validate)
			is = !this.$dirty;
		return is;
	};

	COM.prototype.watch = function(path, fn, init) {

		var self = this;

		if (typeof(path) === 'function') {
			init = fn;
			fn = path;
			path = self.path;
		}

		self.on('watch', path, fn);
		init && fn.call(self, path, self.get(path), 0);
		return self;
	};

	COM.prototype.invalid = function() {
		return M.invalid(this.path, this);
	};

	COM.prototype.valid = function(value, noEmit) {

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

	COM.prototype.style = function(value) {
		W.STYLE(value);
		return this;
	};

	COM.prototype.change = function(value) {
		M.change(this.path, value === undefined ? true : value, this);
		return this;
	};

	COM.prototype.used = function() {
		return this.$interaction(100);
	};

	COM.prototype.dirty = function(value, noEmit) {

		if (value === undefined)
			return this.$dirty;

		if (this.$dirty_disabled)
			return this;

		this.$dirty = value;
		this.$interaction(101);
		clear('dirty');
		!noEmit && this.state && this.state(2, 2);
		return this;
	};

	COM.prototype.reset = function() {
		M.reset(this.path, 0, this);
		return this;
	};

	COM.prototype.setDefault = function(value) {
		this.$default = function() {
			return value;
		};
		return this;
	};

	COM.prototype.default = function(reset) {
		M.default(this.path, 0, this, reset);
		return this;
	};

	COM.prototype.remove = function(noClear) {
		this.element.removeData(ATTRDATA);
		this.element.find(ATTRCOM).attr(ATTRDEL, 'true');
		this.element.attr(ATTRDEL, 'true');
		this.$removed = true;
		if (!noClear) {
			clear();
			setTimeout2('$cleaner', cleaner, 100);
		}
		return true;
	};

	COM.prototype.on = function(name, path, fn, init) {

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

		events[path][name].push({ fn: fn, context: this, id: this._id, path: fixed });
		init && fn.call(M, path, get(path));
		return this;
	};

	COM.prototype.formatter = function(value) {

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

	COM.prototype.parser = function(value) {

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

	COM.prototype.emit = function() {
		M.emit.apply(M, arguments);
		return this;
	};

	COM.prototype.evaluate = function(path, expression, nopath) {
		if (!expression) {
			expression = path;
			path = this.path;
		}
		return M.evaluate(path, expression, nopath);
	};

	COM.prototype.get = function(path) {
		if (!path)
			path = this.path;
		if (path)
			return get(path);
	};

	COM.prototype.set = function(path, value, type) {

		if (value === undefined) {
			value = path;
			path = this.path;
		}

		path && M.set(path, value, type);
		return this;
	};

	COM.prototype.inc = function(path, value, type) {

		if (value === undefined) {
			value = path;
			path = this.path;
		}

		path && M.inc(path, value, type);
		return this;
	};

	COM.prototype.extend = function(path, value, type) {

		if (value === undefined) {
			value = path;
			path = this.path;
		}

		path && M.extend(path, value, type);
		return this;
	};

	COM.prototype.push = function(path, value, type) {

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
		this.init = 0;
		this.manually = 0;
		this.input = 0;
		this.default = 0;
		this.custom = 0;
		this.dirty = 0;
		this.valid = 0;
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

		output.init = this.init === 0 ? 0 : ((n - this.init) / num) >> 0;
		output.manually = this.manually === 0 ? 0 : ((n - this.manually) / num) >> 0;
		output.input = this.input === 0 ? 0 : ((n - this.input) / num) >> 0;
		output.default = this.default === 0 ? 0 : ((n - this.default) / num) >> 0;
		output.custom = this.custom === 0 ? 0 : ((n - this.custom) / num) >> 0;
		output.dirty = this.dirty === 0 ? 0 : ((n - this.dirty) / num) >> 0;
		output.valid = this.valid === 0 ? 0 : ((n - this.valid) / num) >> 0;
		return output;
	};

	// ===============================================================
	// WINDOW FUNCTIONS
	// ===============================================================

	W.PROTOTYPEAPP = APP.prototype;
	W.PROTOTYPECOMPONENT = COM.prototype;
	W.PROTOTYPEUSAGE = USAGE.prototype;
	W.isMOBILE = ('ontouchstart' in W || navigator.maxTouchPoints) ? true : false;
	W.isROBOT = navigator.userAgent ? (/search|agent|bot|crawler|spider/i).test(navigator.userAgent) : true;
	W.isSTANDALONE = navigator.standalone || W.matchMedia('(display-mode: standalone)').matches;

	W.setTimeout2 = function(name, fn, timeout, limit) {
		var key = ':' + name;
		if (limit > 0) {
			var key2 = key + ':limit';
			if (statics[key2] >= limit)
				return;
			statics[key2] = (statics[key2] || 0) + 1;
			statics[key] && clearTimeout(statics[key]);
			return statics[key] = setTimeout(function() {
				statics[key2] = undefined;
				fn && fn();
			}, timeout);
		}
		statics[key] && clearTimeout(statics[key]);
		return statics[key] = setTimeout(fn, timeout);
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

	W.COMPONENT_EXTEND = function(name, declaration) {
		if (!extensions[name])
			extensions[name] = [];
		extensions[name].push(declaration);

		for (var i = 0, length = M.components.length; i < length; i++) {
			var m = M.components[i];
			if (!m.$removed || name === m.name)
				declaration.apply(m, m);
		}
	};

	W.COMPONENT = function(name, declaration) {

		var shared = {};

		var fn = function(el) {
			var obj = new COM(name);
			obj.global = shared;
			obj.element = el;
			obj.setPath(attrcom(el, 'path') || obj._id, true);
			declaration.call(obj);
			return obj;
		};

		M.$components[name] && warn('Components: Overwriting component:', name);
		M.$components[name] = fn;
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

	W.UPLOAD = M.upload;

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

	W.EXEC = function(path) {
		var arg = [];

		for (var i = 1; i < arguments.length; i++)
			arg.push(arguments[i]);

		// OPERATION
		var c = path.charCodeAt(0);
		if (c === 35) {
			OPERATION(path).apply(W, arg);
			return EXEC;
		}

		var index = path.indexOf('/');
		if (index !== -1) {
			var ctrl = CONTROLLER(path.substring(0, index));
			var fn = path.substring(index + 1);
			ctrl && typeof(ctrl[fn]) === 'function' && ctrl[fn].apply(ctrl, arg);
			return W.EXEC;
		}

		var fn = get(path);
		typeof(fn) === 'function' && fn.apply(W, arg);
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
					if (M.ready)
						M.set(p, obj, true);
					else
						set(p, obj);
				}
				return obj;
		}

		fn.call(obj, obj, '');
		return obj;
	};

	W.CLONE = function(obj) {

		var type = typeof(obj);
		switch (type) {
			case 'number':
			case 'string':
			case 'boolean':
				return obj;
		}

		if (obj == null)
			return obj;

		if (obj instanceof Date)
			return new Date(obj.getTime());

		return PARSE(JSON.stringify(obj));
	};

	W.STRINGIFY = function(obj, compress) {
		compress === undefined && (compress = M.defaults.jsoncompress);
		return JSON.stringify(obj, function(key, value) {
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

	W.REWRITE = M.rewrite;

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

	W.INVALID = M.invalid;
	W.RESET = M.reset;
	W.COOKIES = M.cookies;

	W.DEFAULT = function(path, timeout, reset) {
		return M.default(path, timeout, null, reset);
	};

	W.WATCH = function(path, callback, init) {
		return ON('watch', path, callback, init);
	};

	W.UPTODATE = function(period, url, callback) {

		if (typeof(url) === 'function') {
			callback = url;
			url = '';
		}

		var dt = new Date().add(period);
		ON('knockknock', function() {
			if (dt > W.DATETIME)
				return;
			setTimeout(function() {
				if (url)
					W.location.href = url;
				else
					W.location.reload(true);
			}, 5000);
			callback && callback();
		});
	};

	W.PING = function(url, timeout, callback) {

		if (navigator.onLine != null && !navigator.onLine)
			return;

		if (typeof(timeout) === 'function') {
			var tmp = callback;
			callback = timeout;
			timeout = tmp;
		}

		var index = url.indexOf(' ');
		var method = 'GET';

		if (index !== -1) {
			method = url.substring(0, index).toUpperCase();
			url = url.substring(index).trim();
		}

		var options = {};
		var uri = makeurl(url);
		options.type = method;
		options.headers = { 'X-Ping': location.pathname };

		options.success = function(r) {
			if (typeof(callback) === 'string')
				remap(callback, r);
			else
				callback && callback(r);
		};

		options.error = function(req, status, r) {
			status = status + ': ' + r;
			EMIT('error', r, status, url);
			typeof(callback) === 'function' && callback(undefined, status, url);
		};

		return setInterval(function() {
			$.ajax(uri, options);
		}, timeout || 30000);
	};

	W.VALIDATE = M.validate;
	W.CAN = M.can;
	W.DISABLED = M.disabled;
	W.AJAX = M.AJAX;
	W.AJAXCACHE = M.AJAXCACHE;
	W.AJAXCACHEREVIEW = M.AJAXCACHEREVIEW;
	W.GET = M.get;
	W.CACHE = M.cache;
	W.CACHEPATH = M.cachepath;
	W.NOTIFY = M.notify;

	W.NOTMODIFIED = function(path, value, fields) {

		if (value === undefined)
			value = get(path);

		if (value === undefined)
			value = null;

		if (fields)
			path = path.concat('#', fields);

		var hash = W.HASH(W.STRINGIFY(value, fields));
		var key = 'notmodified.' + path;
		if (cache[key] === hash)
			return true;
		cache[key] = hash;
		return false;
	};

	W.SCHEDULE = M.schedule;
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

		var key;
		var output;

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

	W.CHANGE = M.change;
	W.INJECT = W.IMPORT = M.import;

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

	W.ON = function(name, path, fn, init) {
		return M.on(name, path, fn, init);
	};

	W.EMIT = M.emit;
	W.EVALUATE = M.evaluate;

	W.STYLE = function(value) {
		styles.push(value instanceof Array ? value.join('\n') : value);
		setTimeout2('$style', function() {
			$('<style type="text/css">' + styles.join('') + '</style>').appendTo('head');
			styles = [];
		}, 50);
	};

	W.BLOCKED = function(name, timeout, callback) {
		return M.blocked(name, timeout, callback);
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
		var l = ((size / 24) >> 0) + 1;
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

	W.CONTROLLER = function() {
		var callback = arguments[arguments.length - 1];

		if (typeof(callback) !== 'function')
			return controllers[arguments[0]];

		var obj = {};
		obj.name = obj.path = arguments[0];
		controllers[obj.name] = obj;

		obj.get = function(path) {
			return M.get(obj.path + (path ? '.' + path : ''));
		};

		obj.set = function(path, value, type) {
			if (arguments.length === 1) {
				value = path;
				path = undefined;
			}
			M.set(obj.path + (path ? '.' + path : ''), value, type);
			return obj;
		};

		obj.destroy = function() {
			obj.element.remove();
			delete controllers[obj.name];
			setTimeout(cleaner, 500);
			return undefined;
		};

		return obj.$init = function(path, element) {
			obj.$init = undefined;
			if (path)
				obj.path = path;
			obj.element = element;
			callback.call(obj, obj, path, element);
			return obj;
		};
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

	Array.prototype.waitFor = function(fn, callback) {

		if (fn.index === undefined)
			fn.index = 0;

		var index = fn.index;
		var self = this;
		var item = self[fn.index++];

		if (!item) {
			callback && callback(fn.value);
			delete fn.value;
			return self;
		}

		fn.call(self, item, function(value) {
			fn.value = value;
			self.waitFor(fn, callback);
		}, index);

		return self;
	};

	Array.prototype.compare = function(id, b, fields) {
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
				STRINGIFY(aa, fields) !== STRINGIFY(bb, fields) && update.push({ oldIndex: i, newIndex: j, oldItem: aa, newItem: bb });
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

	Array.prototype.async = function(context, callback) {

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

	Array.prototype.ticks = function(max, beg) {

		var length = this.length;
		if (length < max)
			return this;

		var each = Math.round(length / max);
		var arr = [];
		var count = 0;
		var sum = 0;

		if (beg) {
			for (var i = 0; i < length; i++) {
				if (sum++ % each === 0) {
					count++;
					arr.push(this[i]);
				}

				if (count === max)
					break;
			}
		} else {
			for (var i = length - 1; i > -1; i--) {
				if (sum++ % each === 0) {
					count++;
					arr.push(this[i]);
				}

				if (count === max)
					break;
			}
			arr.reverse();
		}
		return arr;
	};

	Array.prototype.take = function(count) {
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

	Array.prototype.skip = function(count) {
		var arr = [];
		var self = this;
		var length = self.length;
		for (var i = 0; i < length; i++)
			i >= count && arr.push(self[i]);
		return arr;
	};

	String.prototype.isJSONDate = function() {
		var l = this.length - 1;
		return l > 22 && l < 30 && this.charCodeAt(l) === 90 && this.charCodeAt(10) === 84 && this.charCodeAt(4) === 45 && this.charCodeAt(13) === 58 && this.charCodeAt(16) === 58;
	};

	String.prototype.parseExpire = function() {

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

	String.prototype.removeDiacritics = function() {
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

	String.prototype.toSearch = function() {

		var str = this.replace(/[^a-zA-Zá-žÁ-Ž\d\s:]/g, '').trim().toLowerCase().removeDiacritics();
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

	String.prototype.slug = function(max) {
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

	String.prototype.isEmail = function() {
		var str = this;
		var r = /^[a-zA-Z0-9-_.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
		return str.length <= 4 ? false : r.test(str);
	};

	String.prototype.isPhone = function() {
		var str = this;
		var r = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
		return str.length < 6 ? false : r.test(str);
	};

	String.prototype.isURL = function() {
		var str = this;
		var r = /^(http|https):\/\/(?:(?:(?:[\w\.\-\+!$&'\(\)*\+,;=]|%[0-9a-f]{2})+:)*(?:[\w\.\-\+%!$&'\(\)*\+,;=]|%[0-9a-f]{2})+@)?(?:(?:[a-z0-9\-\.]|%[0-9a-f]{2})+|(?:\[(?:[0-9a-f]{0,4}:)*(?:[0-9a-f]{0,4})\]))(?::[0-9]+)?(?:[\/|\?](?:[\w#!:\.\?\+=&@!$'~*,;\/\(\)\[\]\-]|%[0-9a-f]{2})*)?$/i;
		return str.length <= 7 ? false : r.test(str);
	};

	String.prototype.parseInt = function(def) {
		var str = this.trim();
		var val = str.match(/(\-|\+)?[0-9]+/);
		if (!val)
			return def || 0;
		val = +val[0];
		return isNaN(val) ? def || 0 : val;
	};

	String.prototype.parseFloat = function(def) {
		var str = this.trim();
		var val = str.match(/(\-|\+)?[0-9\.\,]+/);
		if (!val)
			return def || 0;
		val = val[0];
		if (val.indexOf(',') !== -1)
			val = val.replace(',', '.');
		val = +val;
		return isNaN(val) ? def || 0 : val;
	};

	Array.prototype.trim = function() {
		var self = this;
		var output = [];
		for (var i = 0, length = self.length; i < length; i++) {
			if (typeof(self[i]) === 'string')
				self[i] = self[i].trim();
			self[i] && output.push(self[i]);
		}
		return output;
	};

	Array.prototype.findIndex = function(cb, value) {

		var self = this;
		var isFN = typeof(cb) === 'function';
		var isV = value !== undefined;

		for (var i = 0, length = self.length; i < length; i++) {
			if (isFN) {
				if (cb.call(self, self[i], i))
					return i;
				continue;
			}
			if (isV) {
				if (self[i][cb] === value)
					return i;
				continue;
			}
			if (self[i] === cb)
				return i;
		}
		return -1;
	};

	Array.prototype.findItem = function(cb, value) {
		var index = this.findIndex(cb, value);
		if (index !== -1)
			return this[index];
	};

	Array.prototype.remove = function(cb, value) {

		var self = this;
		var arr = [];
		var isFN = typeof(cb) === 'function';
		var isV = value !== undefined;

		for (var i = 0, length = self.length; i < length; i++) {

			if (isFN) {
				!cb.call(self, self[i], i) && arr.push(self[i]);
				continue;
			}

			if (isV) {
				self[i][cb] !== value && arr.push(self[i]);
				continue;
			}

			self[i] !== cb && arr.push(self[i]);
		}
		return arr;
	};

	Date.prototype.parseDate = function() {
		return this;
	};

	Date.prototype.add = function(type, value) {

		if (value === undefined) {
			var arr = type.split(' ');
			type = arr[1];
			value = parseInt(arr[0]);
		}

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

	Date.prototype.format = function(t) {
		var e = this, r = !1;
		if (t && 33 === t.charCodeAt(0) && (r = !0, t = t.substring(1)), void 0 === t || null === t || '' === t) return e.getFullYear() + '-' + (e.getMonth() + 1).toString().padLeft(2, '0') + '-' + e.getDate().toString().padLeft(2, '0') + 'T' + e.getHours().toString().padLeft(2, '0') + ':' + e.getMinutes().toString().padLeft(2, '0') + ':' + e.getSeconds().toString().padLeft(2, '0') + '.' + e.getMilliseconds().padLeft(3, '0').toString() + 'Z';
		var n = e.getHours();
		return r && n >= 12 && (n -= 12), t.replace(/yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|a|ww|w/g, function(t) {
			switch (t) {
				case 'yyyy':
					return e.getFullYear();
				case 'yy':
					return e.getYear().toString().substring(1);
				case 'MM':
					return (e.getMonth() + 1).toString().padLeft(2, '0');
				case 'M':
					return e.getMonth() + 1;
				case 'dd':
					return e.getDate().toString().padLeft(2, '0');
				case 'd':
					return e.getDate();
				case 'HH':
				case 'hh':
					return n.toString().padLeft(2, '0');
				case 'H':
				case 'h':
					return e.getHours();
				case 'mm':
					return e.getMinutes().toString().padLeft(2, '0');
				case 'm':
					return e.getMinutes();
				case 'ss':
					return e.getSeconds().toString().padLeft(2, '0');
				case 's':
					return e.getSeconds();
				case 'w':
				case 'ww':
					var tmp = new Date(+e);
					tmp.setHours(0, 0, 0);
					tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
					tmp = Math.ceil((((tmp - new Date(tmp.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
					return t === 'ww' ? tmp.toString().padLeft(2, '0') : tmp;
				case 'a':
					return e.getHours() >= 12 ? 'PM' : 'AM';
			}
		});
	};

	Number.prototype.pluralize = function(zero, one, few, other) {

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

		return value.indexOf('#') === -1 ? value : value.replace(/\#{1,}/g, function(text) {
			return text === '##' ? num.format() : num.toString();
		});
	};

	Number.prototype.format = function(decimals, separator, separatorDecimal) {
		var self = this;
		var num = self.toString();
		var dec = '';
		var output = '';
		var minus = num.substring(0, 1) === '-' ? '-' : '';
		if (minus)
			num = num.substring(1);

		var index = num.indexOf('.');

		if (typeof(decimals) === 'string') {
			var tmp = separator;
			separator = decimals;
			decimals = tmp;
		}

		if (separator === undefined)
			separator = ' ';

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
			separatorDecimal = separator === '.' ? ',' : '.';

		return minus + output + (dec.length ? separatorDecimal + dec : '');
	};

	String.prototype.padLeft = function(t, e) {
		var r = this.toString();
		return Array(Math.max(0, t - r.length + 1)).join(e || ' ') + r;
	};

	String.prototype.padRight = function(t, e) {
		var r = this.toString();
		return r + Array(Math.max(0, t - r.length + 1)).join(e || ' ');
	};

	Number.prototype.padLeft = function(t, e) {
		return this.toString().padLeft(t, e || '0');
	};

	Number.prototype.padRight = function(t, e) {
		return this.toString().padRight(t, e || '0');
	};

	Number.prototype.add = Number.prototype.inc = function(value, decimals) {

		if (value == null)
			return this;

		if (typeof(value) === 'number')
			return this + value;

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
						num = this * ((this / 100) * val);
						break;
					case 43:
						num = this + ((this / 100) * val);
						break;
					case 45:
						num = this - ((this / 100) * val);
						break;
					case 47:
						num = this / ((this / 100) * val);
						break;
				}
				return decimals !== undefined ? num.floor(decimals) : num;
			} else {
				num = (this / 100) * value.parseFloat();
				return decimals !== undefined ? num.floor(decimals) : num;
			}

		} else
			num = value.parseFloat();

		switch (first) {
			case 42:
				num = this * num;
				break;
			case 43:
				num = this + num;
				break;
			case 45:
				num = this - num;
				break;
			case 47:
				num = this / num;
				break;
			default:
				num = this;
				break;
		}

		return decimals !== undefined ? num.floor(decimals) : num;
	};

	Number.prototype.floor = function(decimals) {
		return Math.floor(this * Math.pow(10, decimals)) / Math.pow(10, decimals);
	};

	String.prototype.format = function() {
		var arg = arguments;
		return this.replace(/\{\d+\}/g, function(text) {
			var value = arg[+text.substring(1, text.length - 1)];
			return value == null ? '' : value instanceof Array ? value.join('') : value;
		});
	};

	String.prototype.parseDate = function() {
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

	Array.prototype.last = function(def) {
		var item = this[this.length - 1];
		return item === undefined ? def : item;
	};

	Array.prototype.quicksort = function(name, asc, maxlength) {

		var length = this.length;
		if (!length || length === 1)
			return this;

		if (typeof(name) === 'boolean') {
			asc = name;
			name = undefined;
		}

		if (maxlength === undefined)
			maxlength = 3;

		if (asc === undefined)
			asc = true;

		var self = this;
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
				return va && vb ? (asc ? va.substring(0, maxlength).removeDiacritics().localeCompare(vb.substring(0, maxlength).removeDiacritics()) : vb.substring(0, maxlength).removeDiacritics().localeCompare(va.substring(0, maxlength).removeDiacritics())) : 0;
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

	Array.prototype.attr = function(name, value) {

		if (arguments.length === 2) {
			if (value == null)
				return this;
		} else if (value === undefined)
			value = name.toString();

		this.push(name + '="' + value.toString().replace(/[<>&"]/g, function(c) {
			switch (c) {
				case '&': return '&amp;';
				case '<': return '&lt;';
				case '>': return '&gt;';
				case '"': return '&quot;';
			}
			return c;
		}) + '"');

		return this;
	};

	Array.prototype.scalar = function(type, key, def) {

		var output = def;
		var isDate = false;
		var isAvg = type === 'avg' || type === 'average';
		var isDistinct = type === 'distinct';

		for (var i = 0, length = this.length; i < length; i++) {
			var val = key ? this[i][key] : this[i];

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
			output = output / this.length;
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
			return this.data(ATTRDATA);
		};

		$.fn.components = function(fn) {
			var all = this.find(ATTRCOM);
			var output;
			all.each(function(index) {
				var com = $(this).data(ATTRCOM);
				if (com) {
					if (com instanceof Array) {
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
			EMIT('knockknock', knockknockcounter++);
		}, 60000);

		$(document).ready(function() {

			if ($ready) {
				clearTimeout($ready);
				load();
			}

			$(W).on('resize', mediaquery);
			$(W).on('orientationchange', mediaquery);
			mediaquery();

			$(document).on('input change keypress keydown blur', ATTRBIND, function(e) {

				var self = this;

				// IE 9+ PROBLEM
				if ((e.type === 'input' && self.type !== 'range') || (e.type === 'keypress'))
					return !(self.tagName !== 'TEXTAREA' && e.keyCode === 13);

				var special = self.type === 'checkbox' || self.type === 'radio' || self.type === 'range';// || self.tagName === 'SELECT';
				if ((e.type === 'focusout' && special) || (e.type === 'change' && (!special && self.tagName !== 'SELECT')) || (!self.$com || self.$com.$removed || !self.$com.getter))
					return;

				// tab, alt, ctrl, shift, capslock
				var code = e.keyCode;
				if (e.metaKey || code === 9 || (code > 15 && code < 21) || (code > 36 && code < 41)) {
					// Paste / Cut
					if (code !== 86 && code !== 88)
						return;
				}

				// Backspace
				if (e.keyCode === 8 && !self.value)
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

				if ((self.$only && (e.type === 'focusout' || e.type === 'change')) || (e.type === 'keydown' && (e.keyCode === undefined || e.keyCode === 9)))
					return;

				if (e.keyCode < 41 && e.keyCode !== 8 && e.keyCode !== 32) {
					if (e.keyCode !== 13)
						return;
					if (e.tagName !== 'TEXTAREA') {
						self.$value = self.value;
						clearTimeout2('M$timeout');
						keypress(self, old, e);
						return;
					}
				}

				if (self.$nokeypress === undefined) {
					var v = attrcom(self, 'keypress');
					if (v)
						self.$nokeypress = v === 'false';
					else
						self.$nokeypress = M.defaults.keypress === false;
				}

				var delay = self.$delay;
				if (self.$nokeypress) {
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
		if (type === 'number' || type === 'currency' || type === 'float') {
			if (typeof(value) === 'string')
				value = value.replace(REGEMPTY, '').replace(REGCOMMA, '.');
			var v = parseFloat(value);
			return isNaN(v) ? null : v;
		}
		return value;
	});

})();