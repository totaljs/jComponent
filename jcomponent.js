var MAN = $cmanager = new CMAN();
var COM_DATA_BIND_SELECTOR = 'input[data-component-bind],textarea[data-component-bind],select[data-component-bind]';
var COM_ATTR = '[data-component]';
var COM_ATTR_U = 'data-component-url';
var COM_ATTR_URL = '[' + COM_ATTR_U + ']';
var COM_ATTR_B = 'data-component-bind';
var COM_ATTR_D = 'data-component-dependencies';
var COM_ATTR_P = 'data-component-path';
var COM_ATTR_T = 'data-component-template';
var COM_ATTR_I = 'data-component-init';
var COM_ATTR_V = 'data-component-value';
var COM_ATTR_R = 'data-component-removed';
var COM_ATTR_C = 'data-component-class';
var COM_ATTR_S = 'data-component-scope';
var REG_EMAIL = /^[a-z0-9-_.+]+@[a-z0-9.-]+\.[a-z]{2,6}$/i;
var REG_FORMAT = /\{\d+\}/g;

$.fn.component = function() {
	return this.data(COM_ATTR);
};

$.fn.components = function(fn) {
	var all = this.find(COM_ATTR);
	all.each(function(index) {
		var com = $(this).data(COM_ATTR);
		if (com && com.$ready && !com.$removed)
			fn.call(com, index);
	});
	return all;
};

// Because of file size
window.COM = $.components = function(container) {
	if (MAN.isCompiling)
		return COM;
	return COM.compile(container);
};

COM.evaluate = function(path, expression) {
	var key = 'eval' + expression;
	var exp = MAN.cache[key];
	var val = COM.get(path);

	if (COM.debug)
		console.log('%c$.components.evaluate(' + path + ')', 'color:gray');

	if (exp !== undefined)
		return exp.call(val, val, path);
	if (expression.indexOf('return') === -1)
		expression = 'return ' + expression;
	exp = new Function('value', 'path', expression);
	MAN.cache[key] = exp;
	return exp.call(val, val, path);
};

COM.defaults = {};
COM.defaults.delay = 300;
COM.defaults.keypress = true;
COM.defaults.localstorage = true;
COM.debug = false;
COM.version = 'v3.2.0';
COM.$localstorage = 'jcomponent';
COM.$version = '';
COM.$language = '';
COM.$formatter = new Array(0);
COM.$parser = new Array(0);
COM.$parser.push(function(path, value, type) {
	if (type === 'number' || type === 'currency' || type === 'float') {
		if (typeof(value) === 'string')
			value = value.replace(/\s/g, '').replace(/,/g, '.');
		var v = parseFloat(value);
		if (isNaN(v))
			v = null;
		return v;
	}
	return value;
});

COM.compile = function(container) {

	MAN.isCompiling = true;
	COM.$inject();

	if (MAN.pending.length > 0) {
		MAN.pending.push(function() {
			COM.compile(container);
		});
		return COM;
	}

	var els = container ? container.find(COM_ATTR) : $(COM_ATTR);
	var skip = false;

	if (els.length === 0 && !container) {
		$components_ready();
		return;
	}

	var scopes = $('[' + COM_ATTR_S + ']');
	var scopes_length = scopes.length;

	els.each(function() {

		if (skip)
			return;

		var el = $(this);
		var name = el.attr('data-component');

		if (el.data(COM_ATTR) || el.attr(COM_ATTR_R))
			return;

		var component = MAN.register[name || ''];
		if (!component)
			return;

		var obj = component(el);

		obj.$init = el.attr(COM_ATTR_I) || null;
		obj.type = el.attr('data-component-type') || '';
		obj.id = el.attr('data-component-id') || obj._id;
		obj.dependencies = new Array(0);

		if (!obj.$noscope)
			obj.$noscope = el.attr('data-component-noscope') === 'true';

		if (!obj.$noscope && scopes_length && obj.path && obj.path.charCodeAt(0) !== 33) {
			for (var i = 0; i < scopes_length; i++) {

				if (!$.contains(scopes[i], this))
					continue;

				var p = scopes[i].getAttribute(COM_ATTR_S);

				if (!p || p === '?') {
					p = 'scope' + (Math.floor(Math.random() * 100000) + 1000);
					scopes[i].setAttribute(COM_ATTR_S, p);
				}

				if (!scopes[i].$processed) {
					scopes[i].$processed = true;
					var tmp = scopes[i].getAttribute(COM_ATTR_V);
					if (tmp)
						MAN.set(p, new Function('return ' + tmp)());
				}

				obj.setPath(p + '.' + obj.path);
				obj.scope = scopes[i];
			}
		}

		var dep = (el.attr(COM_ATTR_D) || '').split(',');

		for (var i = 0, length = dep.length; i < length; i++) {
			var d = dep[i].trim();
			if (d)
				obj.dependencies.push(d);
		}

		// A reference to implementation
		el.data(COM_ATTR, obj);

		var template = el.attr(COM_ATTR_T) || obj.template;
		if (template)
			obj.template = template;

		if (el.attr(COM_ATTR_U))
			throw new Error('You cannot use [data-component-url] for the component: ' + obj.name + '[' + obj.path + ']. Instead of it you must use data-component-template.');

		if (typeof(template) === 'string') {
			var fn = function(data) {
				if (obj.prerender)
					data = prerender(data);
				if (typeof(obj.make) === 'function')
					obj.make(data);
				component_init(el, obj);
			};

			var c = template.substring(0, 1);
			if (c === '.' || c === '#' || c === '[')
				fn($(c).html());
			else
				$.get($components_url(template), fn);
			return;
		}

		if (typeof(obj.make) === 'string') {

			if (obj.make.indexOf('<') !== -1) {
				if (obj.prerender)
					obj.make = obj.prerender(obj.make);
				el.html(obj.make);
				component_init(el, obj);
				return;
			}

			$.get($components_url(obj.make), function(data) {
				if (obj.prerender)
					data = prerender(data);
				el.html(data);
				component_init(el, obj);
			});

			return;
		}

		if (obj.make) {
			if (obj.make())
				skip = true;
		}

		component_init(el, obj);
	});

	if (skip) {
		COM.compile();
		return;
	}

	if (container !== undefined) {
		MAN.next();
		return;
	}

	if (MAN.toggle.length === 0) {
		MAN.next();
		return;
	}

	component_async(MAN.toggle, function(item, next) {
		for (var i = 0, length = item.toggle.length; i < length; i++)
			item.element.toggleClass(item.toggle[i]);
		next();
	}, function() {
		MAN.next();
	});
};

COM.$inject = function() {

	var els = $(COM_ATTR_URL);
	var arr = [];
	var count = 0;

	els.each(function() {
		var el = $(this);
		if (el.data(COM_ATTR_URL))
			return;
		el.data(COM_ATTR_URL, '1');
		arr.push({ element: el, cb: el.attr(COM_ATTR_I), path: el.attr(COM_ATTR_P), url: el.attr(COM_ATTR_U), toggle: (el.attr(COM_ATTR_C) || '').split(' ') });
	});

	if (arr.length === 0)
		return;

	component_async(arr, function(item, next) {
		item.element.load($components_url(item.url), function() {

			if (item.path) {
				var com = item.element.find(COM_ATTR);
				com.each(function() {
					var el = $(this);
					$.each(this.attributes, function() {
						if (!this.specified)
							return;
						el.attr(this.name, this.value.replace('$', item.path));
					});
				});
			}

			if (item.toggle.length > 0 && item.toggle[0] !== '')
				MAN.toggle.push(item);

			if (item.cb && !item.element.attr('data-component')) {
				var cb = MAN.get(item.cb);
				if (typeof(cb) === 'function')
					cb(item.element);
			}

			count++;
			next();
		});

	}, function() {
		MAN.clear('valid', 'dirty', 'broadcast');
		if (count === 0)
			return;
		COM.compile();
	});
};

COM.inject = COM.import = function(url, target, callback, insert) {

	if (insert === undefined)
		insert = true;

	if (typeof(target) === 'function') {
		timeout = callback;
		callback = target;
		target = 'body';
	}

	if (target.getPath)
		target = target.element;

	if (!target)
		target = 'body';

	var extension = url.lastIndexOf('.');
	if (extension !== -1)
		extension = url.substring(extension).toLowerCase();
	else
		extension = '';

	if (extension === '.js') {
		var script = d.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.onload = function(){
			if (callback)
				callback();
		};
		script.src = Url;
		document.getElementsByTagName('head')[0].appendChild(script);
		return;
	}

	if (extension === '.css') {
		var style = document.createElement('link');
		style.type = 'text/css';
		style.rel = 'stylesheet';
		style.href = 'style.css';
		document.getElementsByTagName('head')[0].appendChild(style);
		return;
	}

	if (insert) {
		var random = Math.floor(Math.random() * 100000);
		var id = 'data-component-import="' + random +'"';
		$(target).append('<div ' + id + '></div>');
		target = $(target).find('> div[' + id + ']');
	}

	$(target).load($components_url(url), function() {
		COM.compile();
		if (callback)
			callback();
	});

	return COM;
};

COM.parseQuery = function(value) {

	if (!value)
		value = window.location.search;

	if (!value)
		return {};

	if (value.substring(0, 1) === '?')
		value = value.substring(1);

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

COM.UPLOAD = function(url, data, callback, timeout, progress, error) {

	if (!url)
		url = window.location.pathname;

	if (typeof(callback) === 'number') {
		timeout = callback;
		callback = undefined;
	}

	if (typeof(timeout) !== 'number') {
		var tmp = progress;
		error = progress;
		progress = timeout;
		timeout = tmp;
	}

	setTimeout(function() {

		if (COM.debug)
			console.log('%c$.components.UPLOAD(' + url + ')', 'color:magenta');

		var xhr = new XMLHttpRequest();

		xhr.addEventListener('load', function () {

			var r = this.responseText;
			try {
				r = JSON.parse(r);
			} catch (e) {}

			if (this.status === 200) {
				if (typeof(callback) === 'string')
					return MAN.remap(callback, r);
				if (callback)
					callback(r);
				return;
			}

			COM.emit('error', r, this.status, url);

			if (typeof(error) === 'string')
				return MAN.remap(error, r);

			if (error)
				error(r, this.status);
			else if (typeof(callback) === 'function')
				callback(undefined, r, this.status);

		}, false);

		xhr.upload.onprogress = function (evt) {
			if (!progress)
				return;
			var percentage = 0;
			if (evt.lengthComputable)
				percentage = Math.round(evt.loaded * 100 / evt.total);
			if (typeof(progress) === 'string')
				return MAN.remap(progress, percentage);
			progress(percentage, evt.transferSpeed, evt.timeRemaining);
		};

		xhr.open('POST', url);
		xhr.send(data);
	}, timeout || 0);

	return COM;
};

COM.POST = function(url, data, callback, timeout, error) {

	if (!url)
		url = window.location.pathname;

	if (typeof(callback) === 'number') {
		timeout = callback;
		callback = undefined;
	}

	if (typeof(timeout) !== 'number') {
		var tmp = error;
		error = timeout;
		timeout = tmp;
	}

	setTimeout(function() {

		if (COM.debug)
			console.log('%c$.components.POST(' + url + ')', 'color:magenta');

		$.ajax($components_url(url), { type: 'POST', data: JSON.stringify(data), success: function(r) {
			if (typeof(callback) === 'string')
				return MAN.remap(callback, r);
			if (callback)
				callback(r);
		}, error: function(req, status, r) {
			COM.emit('error', r, req.status, url);
			if (typeof(error) === 'string')
				return MAN.remap(error, r);
			if (error)
				error(r, req.status, status);
			else if (typeof(callback) === 'function')
				callback(undefined, r, req.status);
		}, contentType: 'application/json' });
	}, timeout || 0);
	return COM;
};

COM.PUT = function(url, data, callback, timeout, error) {

	if (!url)
		url = window.location.pathname;

	if (typeof(callback) === 'number') {
		timeout = callback;
		callback = undefined;
	}

	if (typeof(timeout) !== 'number') {
		var tmp = error;
		error = timeout;
		timeout = tmp;
	}

	setTimeout(function() {

		if (COM.debug)
			console.log('%c$.components.PUT(' + url + ')', 'color:magenta');

		$.ajax($components_url(url), { type: 'PUT', data: JSON.stringify(data), success: function(r) {
			if (typeof(callback) === 'string')
				return MAN.remap(callback, r);
			if (callback)
				callback(r);
		}, error: function(req, status, r) {
			COM.emit('error', r, req.status, url);
			if (typeof(error) === 'string')
				return MAN.remap(error, r);
			if (error)
				error(r, req.status, status);
			else if (typeof(callback) === 'function')
				callback(undefined, r, req.status);
		}, contentType: 'application/json' });
	}, timeout || 0);
	return COM;
};

COM.TEMPLATE = function(url, callback, prepare) {

	if (MAN.cache[url]) {

		if (typeof(callback) === 'string')
			SET(callback, MAN.cache[url]);
		else
			callback(MAN.cache[url]);

		return COM;
	}

	COM.GET(url, {}, function(response) {
		var value = MAN.cache[url] = prepare ? prepare(response) : response;
		if (typeof(callback) === 'string')
			SET(callback, value);
		else
			callback(value);
	});

	return COM;
};

COM.GET = function(url, data, callback, timeout, error) {

	if (!url)
		url = window.location.pathname;

	if (typeof(callback) === 'number') {
		timeout = callback;
		callback = undefined;
	}

	if (typeof(timeout) !== 'number') {
		var tmp = error;
		error = timeout;
		timeout = tmp;
	}

	setTimeout(function() {

		if (COM.debug)
			console.log('%c$.components.GET(' + url + ')', 'color:magenta');

		if (data)
			url += '?' + jQuery.param(data);

		$.ajax($components_url(url), { type: 'GET', success: function(r) {
			if (typeof(callback) === 'string')
				return MAN.remap(callback, r);
			if (callback)
				callback(r);
		}, error: function(req, status, r) {
			COM.emit('error', r, req.status, url);
			if (typeof(error) === 'string')
				return MAN.remap(error, r);
			if (error)
				error(r, req.status, status);
			else if (typeof(callback) === 'function')
				callback(undefined, r, req.status);
		}});
	}, timeout || 0);
	return COM;
};

COM.DELETE = function(url, data, callback, timeout, error) {

	if (!url)
		url = window.location.pathname;

	if (typeof(callback) === 'number') {
		timeout = callback;
		callback = undefined;
	}

	if (typeof(timeout) !== 'number') {
		var tmp = error;
		error = timeout;
		timeout = tmp;
	}

	setTimeout(function() {

		if (COM.debug)
			console.log('%c$.components.DELETE(' + url + ')', 'color:magenta');

		$.ajax($components_url(url), { type: 'DELETE', data: JSON.stringify(data), success: function(r) {
			if (typeof(callback) === 'string')
				return MAN.remap(callback, r);
			if (callback)
				callback(r);
		}, error: function(req, status, r) {
			COM.emit('error', r, req.status, url);
			if (typeof(error) === 'string')
				return MAN.remap(error, r);
			if (error)
				error(r, req.status, status);
			else if (typeof(callback) === 'function')
				callback(undefined, r, req.status);
		}, contentType: 'application/json' });
	}, timeout || 0);
	return COM;
};

COM.GETCACHE = function(url, data, callback, expire, timeout, clear) {

	if (typeof(timeout) === 'boolean') {
		var tmp = clear;
		clear = timeout;
		timeout = tmp;
	}

	setTimeout(function() {
		var value = clear ? undefined : MAN.cacherest('GET', url, data);
		if (value !== undefined) {
			if (typeof(callback) === 'string')
				MAN.remap(callback, value);
			else
				callback(value);
			return COM;
		}

		COM.GET(url, data, function(r, err) {
			if (r === undefined)
				r = err;
			MAN.cacherest('GET', url, data, r, expire);
			if (typeof(callback) === 'string')
				MAN.remap(callback, r);
			else
				callback(r);
		});
	}, timeout || 1);

	return COM;
};

COM.POSTCACHE = function(url, data, callback, expire, timeout, clear) {

	if (typeof(timeout) === 'boolean') {
		var tmp = clear;
		clear = timeout;
		timeout = tmp;
	}

	setTimeout(function() {
		var value = clear ? undefined : MAN.cacherest('POST', url, data);
		if (value !== undefined) {
			if (typeof(callback) === 'string')
				MAN.remap(callback, value);
			else
				callback(value);
			return COM;
		}

		COM.POST(url, data, function(r, err) {
			if (r === undefined)
				r = err;
			MAN.cacherest('POST', url, data, r, expire);
			if (typeof(callback) === 'string')
				MAN.remap(callback, r);
			else
				callback(r);
		});
	}, timeout || 1);

	return COM;
};

COM.cache = function(key, value, expire) {
	return MAN.cachestorage(key, value, expire);
};

COM.removeCache = function(key, isSearching) {
	if (isSearching) {
		for (var m in MAN.storage) {
			if (m.indexOf(key) !== -1)
				delete MAN.storage[key];
		}
	} else {
		delete MAN.storage[key];
	}
	$components_save();
	return COM;
};

COM.REMOVECACHE = function(method, url, data) {
	data = JSON.stringify(data);
	var key = HASH(method + '#' + url.replace(/\//g, '') + data).toString();
	delete MAN.storage[key];
	$components_save();
	return COM;
};

COM.ready = function(fn) {
	if (MAN.ready)
		MAN.ready.push(fn);
	return COM;
};

function $components_url(url) {
	var index = url.indexOf('?');
	var builder = [];

	if (COM.$version)
		builder.push('version=' + encodeURIComponent(COM.$version));

	if (COM.$language)
		builder.push('language=' + encodeURIComponent(COM.$language));

	if (builder.length === 0)
		return url;

	if (index !== -1)
		url += '&';
	else
		url += '?';

	return url + builder.join('&');
}

function $components_ready() {
	clearTimeout(MAN.timeout);
	MAN.timeout = setTimeout(function() {

		MAN.refresh();
		MAN.initialize();

		var count = MAN.components.length;
		$(document).trigger('components', [count]);

		if (!MAN.isReady) {
			MAN.clear('valid', 'dirty', 'broadcast');
			MAN.isReady = true;
			COM.emit('init');
			COM.emit('ready');
		}

		if (MAN.timeoutcleaner)
			clearTimeout(MAN.timeoutcleaner);

		MAN.timeoutcleaner = setTimeout(function() {
			MAN.cleaner();
		}, 1000);

		MAN.isCompiling = false;
		$('[' + COM_ATTR_S + ']').each(function() {

			if (this.$ready)
				return;

			var scope = $(this);
			this.$ready = true;

			// Applies classes
			var cls = scope.attr(COM_ATTR_C);
			if (cls) {
				cls = cls.split(' ');
				for (var i = 0, length = cls.length; i < length; i++)
					scope.toggleClass(cls[i]);
			}

			var controller = this.getAttribute('data-component-controller');
			if (controller) {
				var ctrl = CONTROLLER(controller);
				if (ctrl)
					ctrl.$init(undefined, this.getAttribute(COM_ATTR_S), scope);
			}

			var path = this.getAttribute(COM_ATTR_I);
			if (!path)
				return;

			if (MAN.isOperation(path)) {
				var op = OPERATION(path);
				if (op)
					op.call(scope, scope);
				else if (console)
					console.warn('Operation ' + path + ' not found.');
			} else {
				var fn = GET(path);
				if (typeof(fn) === 'function')
					fn.call(scope, scope);
			}
		});

		if (!MAN.ready)
			return;

		var arr = MAN.ready;
		for (var i = 0, length = arr.length; i < length; i++)
			arr[i](count);

		delete MAN.ready;
	}, 300);
}

COM.watch = function(path, fn, init) {
	COM.on('watch', path, fn);

	if (!init)
		return COM;

	fn.call(COM, path, MAN.get(path), true);
	return COM;
};

COM.on = function(name, path, fn, init) {

	if (typeof(path) === 'function') {
		fn = path;
		path = '';
	} else
		path = path.replace('.*', '');

	if (COM.debug)
		console.log('%c$.components.on(' + name + (path ? ', ' + path : '') + ')', 'color:blue');

	var fixed = null;
	if (path.charCodeAt(0) === 33) {
		path = path.substring(1);
		fixed = path;
	}

	if (!MAN.events[path]) {
		MAN.events[path] = {};
		MAN.events[path][name] = [];
	} else if (!MAN.events[path][name])
		MAN.events[path][name] = [];

	MAN.events[path][name].push({ fn: fn, id: this._id, path: fixed });

	if (!init)
		return COM;
	fn.call(COM, path, MAN.get(path), true);
	return COM;
};

function component_init(el, obj) {

	var type = el.get(0).tagName;
	var collection;

	if (COM.debug)
		console.log('%c$.components.init: ' + obj.name + ' (' + (obj.id || obj._id) + ')', 'color:green');

	// autobind
	if (type === 'INPUT' || type === 'SELECT' || type === 'TEXTAREA') {
		obj.$input = true;
		collection = obj.element;
	} else
		collection = el.find(COM_DATA_BIND_SELECTOR);

	collection.each(function() {
		if (!this.$component)
			this.$component = obj;
	});

	MAN.components.push(obj);
	MAN.init.push(obj);
	COM.compile(el);
	$components_ready();
}

COM.$emit2 = function(name, path, args) {

	var e = MAN.events[path];
	if (!e)
		return false;

	e = e[name];
	if (!e)
		return false;

	for (var i = 0, length = e.length; i < length; i++) {
		var ev = e[i];
		if (!ev.path || ev.path === path)
			ev.fn.apply(ev.context, args);
	}

	return true;
};

COM.$emitonly = function(name, paths, type, path) {

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

	COM.$emit2(name, '*', [path, unique[path]]);

	Object.keys(unique).forEach(function(key) {
		// OLDER: COM.$emit2(name, key, [key, unique[key]]);
		COM.$emit2(name, key, [path, unique[key]]);
	});

	return this;
};

COM.$emit = function(name, path) {

	if (!path)
		return;

	var arr = path.split('.');
	var args = [];
	var length = name === 'watch' ? 3 : arguments.length;

	for (var i = name === 'watch' ? 1 : 2; i < length; i++)
		args.push(arguments[i]);

	COM.$emit2(name, '*', args);

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

		p += (i > 0 ? '.' : '');

		args[1] = COM.get(p + k);
		COM.$emit2(name, p + k, args);
		if (k !== a)
			COM.$emit2(name, p + a, args);
		p += k;
	}

	return true;
};

COM.emit = function(name) {

	var e = MAN.events[''];
	if (!e)
		return false;

	e = MAN.events[''][name];
	if (!e)
		return false;

	var args = [];

	for (var i = 1, length = arguments.length; i < length; i++)
		args.push(arguments[i]);

	for (var i = 0, length = e.length; i < length; i++) {
		var context = e[i].context;
		if (context !== undefined) {
			if (context === null || context.$removed)
				continue;
		}
		e[i].fn.apply(context, args);
	}

	return true;
};

COM.change = function(path, value) {
	if (value === undefined)
		return !COM.dirty(path);
	return !COM.dirty(path, !value);
};

COM.valid = function(path, value, onlyComponent) {

	var isExcept = value instanceof Array;
	var key = 'valid' + path + (isExcept ? '>' + value.join('|') : '');
	var except;

	if (isExcept) {
		except = value;
		value = undefined;
	}

	if (typeof(value) !== 'boolean' && MAN.cache[key] !== undefined)
		return MAN.cache[key];

	if (COM.debug)
		console.log('%c$.components.valid(' + path + (value !== undefined ? ', ' + value : '') + ')', 'color:orange');

	var valid = true;
	var arr = value !== undefined ? [] : null;

	COM.each(function(obj, index, isAsterix) {

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
			}
		} else if (onlyComponent._id === obj._id)
			obj.$valid = value;

		if (obj.$valid === false)
			valid = false;

	}, path, true);

	MAN.clear('valid');
	MAN.cache[key] = valid;
	COM.state(arr, 1, 1);
	return valid;
};

COM.dirty = function(path, value, onlyComponent, skipEmitState) {

	var isExcept = value instanceof Array;
	var key = 'dirty' + path + (isExcept ? '>' + value.join('|') : '');
	var except;

	if (isExcept) {
		except = value;
		value = undefined;
	}

	if (typeof(value) !== 'boolean' && MAN.cache[key] !== undefined)
		return MAN.cache[key];

	if (COM.debug)
		console.log('%c$.components.dirty(' + path + (value !== undefined ? ', ' + value : '') + ')', 'color:orange');

	var dirty = true;
	var arr = value !== undefined ? [] : null;

	COM.each(function(obj, index, isAsterix) {

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
			if (isAsterix || obj.path === path)
				obj.$dirty = value;
		} else if (onlyComponent._id === obj._id)
				obj.$dirty = value;

		if (obj.$dirty === false)
			dirty = false;

	}, path, true);

	MAN.clear('dirty');
	MAN.cache[key] = dirty;

	// For double hitting component.state() --> look into COM.invalid()
	if (!skipEmitState)
		COM.state(arr, 1, 2);

	return dirty;
};

// 1 === by developer
// 2 === by input
COM.update = function(path, reset) {

	var is = path.charCodeAt(0) === 33;
	if (is)
		path = path.substring(1);

	path = path.replace('.*', '.');
	if (!path)
		return COM;

	var length;
	var state = [];
	var was = false;
	var updates = {};

	if (COM.debug)
		console.log('%c$.components.update(' + (is ? '!' : '') + path + ')', 'color:red');

	var A = path.split('.');
	var AL = A.length;

	COM.each(function(component) {

		if (!component.path || component.disabled)
			return;

		for (var i = 0; i < AL; i++) {
			if (component.$$path[i] && component.$$path[i] !== A[i])
				return;
		}

		if (component.$path && component.$path !== path)
			return;

		var result = component.get();

		if (component.setter)
			component.setter(result, path, 1);

		component.$ready = true;

		if (reset === true) {

			if (!component.$dirty_disabled)
				component.$dirty = true;

			if (!component.$valid_disabled) {
				component.$valid = true;
				component.$validate = false;
				if (component.validate)
					component.$valid = component.validate(result);
			}

			component.element.find(COM_DATA_BIND_SELECTOR).each(function() {
				delete this.$value;
				delete this.$value2;
			});

		} else if (component.validate && !component.$valid_disabled)
			component.valid(component.validate(result), true);

		if (component.state)
			state.push(component);

		if (component.path === path)
			was = true;

		updates[component.path] = result;
	}, is ? path : undefined, undefined, is);

	if (reset)
		MAN.clear('dirty', 'valid');

	if (!updates[path])
		updates[path] = COM.get(path);

	for (var i = 0, length = state.length; i < length; i++)
		state[i].state(1, 4);

	// watches
	length = path.length;

	Object.keys(MAN.events).forEach(function(key) {
		if (key.substring(0, length) !== path)
			return;
		updates[key] = COM.get(key);
	});

	COM.$emitonly('watch', updates, 1, path);
	return COM;
};

COM.notify = function() {

	var arg = arguments;
	var length = arguments.length;

	COM.each(function(component) {

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

		component.setter(component.get(), component.path, 1);
	});

	Object.keys(MAN.events).forEach(function(key) {

		var is = false;
		for (var i = 0; i < length; i++) {
			if (key === arg[i]) {
				is = true;
				break;
			}
		}

		if (!is)
			return;

		COM.$emit2('watch', key, [key, COM.get(key)]);
	});

	return COM;
};

COM.extend = function(path, value, type) {
	var val = COM.get(path);
	if (val === null || val === undefined)
		val = {};
	if (COM.debug)
		console.log('%c$.components.extend(' + path + ')', 'color:silver');
	COM.set(path, $.extend(val, value), type);
	return COM;
};

COM.nested = function(element, selector, type, value) {

	element = $(element);

	if (selector === '*') {
		selector = null;
	} else if (!(selector instanceof Array)) {
		selector = selector.split(',');
		var nested = [];
		for (var i = 0, length = selector.length; i < length; i++) {
			var item = selector[i].trim();
			if (item)
				nested.push(item);
		}

		if (nested.length === 0)
			selector = null;
		else
			selector = nested;
	}

	var isEach = typeof(type) === 'function';

	if (!isEach) {
		switch (type) {
			case 'path':
			case 'template':
			case 'dependencies':
			case 'class':
			case 'url':
			case 'type':
			case 'init':
			case 'bind':
			case 'keypress':
			case 'keypress-delay':
			case 'keypress-only':
				type = 'data-component-' + type;
				break;
			case 'delay':
			case 'only':
				type = 'data-component-keypress-' + type;
				break;
		}
	}

	var self = this;
	var replacer = function(current, value) {
		if (current && current.indexOf('?') !== -1)
			return current.replace('?', value);
		return value;
	};

	if (!selector) {
		element.find('[data-component]').each(function() {
			var el = $(this);
			var com = el.component();

			if (isEach) {
				type(el, com);
				return;
			}

			el.attr(type, type === COM_ATTR_P ? replacer(el.attr(type), value) : value);
			if (com && type === COM_ATTR_P)
				com.setPath(replacer(com.path, value));

		});
		return self;
	}

	element.find('[data-component]').each(function() {
		var el = $(this);
		var id = el.attr('data-component-id');
		var pat = el.attr(COM_ATTR_P);
		var name = el.attr('data-component');
		for (var i = 0, length = selector.length; i < length; i++) {
			var item = selector[i];
			var is = false;
			if (item.charCodeAt(0) === 46)
				is = item.substring(1) === pat;
			else if (item.charCodeAt(0) === 35)
				is = item.substring(1) === id;
			else
				is = item === name;

			if (!is)
				continue;

			var com = el.component();
			if (isEach) {
				type(el, com);
				return;
			}

			el.attr(type, type === COM_ATTR_P ? replacer(el.attr(type), value) : value);
			if (com && type === COM_ATTR_P)
				com.setPath(replacer(com.path, value));
		}
	});

	return self;
};

// 1 === by developer
// 2 === by input
COM.set = function(path, value, type) {
	var is = path.charCodeAt(0) === 33;
	if (is)
		path = path.substring(1);

	if (path.charCodeAt(0) === 43) {
		path = path.substring(1);
		return COM.push(path, value, type);
	}

	if (!path)
		return COM;

	var isUpdate = (typeof(value) === 'object' && !(value instanceof Array) && value !== null && value !== undefined);
	var reset = type === true;
	if (reset)
		type = 1;

	if (COM.debug && !isUpdate)
		console.log('%c$.components.set(' + path + ')', 'color:red');

	MAN.set(path, value);

	if (isUpdate)
		return COM.update(path, reset);

	var result = MAN.get(path);
	var state = [];

	if (type === undefined)
		type = 1;

	var A = path.split('.');
	var AL = A.length;

	COM.each(function(component) {

		if (!component.path || component.disabled)
			return;

		for (var i = 0; i < AL; i++) {
			if (component.$$path[i] && component.$$path[i] !== A[i])
				return;
		}

		if (component.$path && component.$path !== path)
			return;

		if (component.path === path) {
			if (component.setter)
				component.setter(result, path, type);
		} else {
			if (component.setter)
				component.setter(COM.get(component.path), path, type);
		}

		component.$ready = true;

		if (component.state)
			state.push(component);

		if (reset) {
			if (!component.$dirty_disabled)
				component.$dirty = true;
			if (!component.$valid_disabled) {
				component.$valid = true;
				component.$validate = false;
				if (component.validate)
					component.$valid = component.validate(result);
			}

			component.element.find(COM_DATA_BIND_SELECTOR).each(function() {
				delete this.$value;
				delete this.$value2;
			});

		} else if (component.validate && !component.$valid_disabled)
			component.valid(component.validate(result), true);

	}, path, true, is);

	if (reset)
		MAN.clear('dirty', 'valid');

	for (var i = 0, length = state.length; i < length; i++)
		state[i].state(type, 5);

	COM.$emit('watch', path, undefined, type, is);
	return COM;
};

COM.push = function(path, value, type) {

	if (COM.debug)
		console.log('%c$.components.push(' + path + ')', 'color:silver');

	var arr = COM.get(path);
	var n = false;

	if (!(arr instanceof Array)) {
		arr = [];
		n = true;
	}

	var is = true;

	if (value instanceof Array) {
		if (value.length > 0)
			arr.push.apply(arr, value);
		else
			is = false;
	}
	else
		arr.push(value);

	if (n) {
		COM.set(path, arr, type);
	} else if (is)
		COM.update(path, type);

	return self;
};

COM.clean = function() {
	MAN.cleaner();
	return COM;
}

COM.get = function(path) {
	if (COM.debug)
		console.log('%c$.components.get(' + path + ')', 'color:gray');
	return MAN.get(path);
};

COM.remove = function(path) {

	if (path instanceof jQuery) {
		path.find(COM_ATTR).attr(COM_ATTR_R, 'true').each(function() {
			var com = $(this).data('component');
			if (com)
				com.$removed = true;
		});

		if (path.attr(COM_ATTR_T))
			path.attr(COM_ATTR_R, 'true');

		var com = path.data('component');
		if (com)
			com.$removed = true;

		MAN.cleaner();
		return COM;
	}

	MAN.clear();
	COM.each(function(obj) {
		obj.remove(true);
	}, path);
	MAN.cleaner();
	return COM;
};

COM.validate = function(path, except) {

	var arr = [];
	var valid = true;

	COM.each(function(obj) {

		if (obj.disabled)
			return;

		if (except && except.indexOf(obj.path) !== -1)
			return;

		if (obj.state)
			arr.push(obj);

		if (obj.$valid_disabled)
			return;

		obj.$validate = true;

		if (obj.validate) {
			obj.$valid = obj.validate(MAN.get(obj.path));
			if (!obj.$valid)
				valid = false;
		}

	}, path);

	MAN.clear('valid');
	COM.state(arr, 1, 1);
	COM.$emit('validate', path);
	return valid;
};

COM.errors = function(path, except) {

	if (path instanceof Array) {
		except = path;
		path = undefined;
	}

	var arr = [];
	COM.each(function(obj) {
		if (except && except.indexOf(obj.path) !== -1)
			return;
		if (obj.$valid === false && !obj.$valid_disabled)
			arr.push(obj);
	}, path);
	return arr;
};

COM.can = function(path, except) {
	return !COM.dirty(path, except) && COM.valid(path, except);
};

COM.disable = function(path, except) {
	return COM.dirty(path, except) || !COM.valid(path, except);
};

COM.invalid = function(path, onlyComponent) {
	COM.dirty(path, false, onlyComponent, true);
	COM.valid(path, false, onlyComponent);
	return COM;
};

COM.blocked = function(name, timeout, callback) {
	var key = name;
	var item = MAN.cacheblocked[key];
	var now = Date.now();

	if (COM.debug)
		console.log('%c$.components.blocked(' + name + ')', 'color:silver');

	if (item > now)
		return true;

	var local = COM.defaults.localstorage && timeout > 10000;
	MAN.cacheblocked[key] = now + timeout;

	if (local)
		localStorage.setItem(COM.$localstorage + '.blocked', JSON.stringify(MAN.cacheblocked));

	if (callback)
		callback();

	return false;
};

// who:
// 1. valid
// 2. dirty
// 3. reset
// 4. update
// 5. set
COM.state = function(arr, type, who) {
	if (!arr || arr.length === 0)
		return;
	setTimeout(function() {
		for (var i = 0, length = arr.length; i < length; i++)
			arr[i].state(type, who);
	}, 2);
};

COM.broadcast = function(selector, name, caller) {
	return BROADCAST(selector, name, caller);
};

COM.reset = function(path, timeout, onlyComponent) {

	if (timeout > 0) {
		setTimeout(function() {
			COM.reset(path);
		}, timeout);
		return COM;
	}

	if (COM.debug)
		console.log('%c$.components.reset(' + path + ')', 'color:orange');

	var arr = [];

	COM.each(function(obj) {

		if (obj.disabled)
			return;

		if (obj.state)
			arr.push(obj);

		if (onlyComponent && onlyComponent._id !== obj._id)
			return;

		obj.element.find(COM_DATA_BIND_SELECTOR).each(function() {
			delete this.$value;
			delete this.$value2;
		});

		if (!obj.$dirty_disabled)
			obj.$dirty = true;

		if (!obj.$valid_disabled) {
			obj.$valid = true;
			obj.$validate = false;
			if (obj.validate)
				obj.$valid = obj.validate(obj.get());
		}

	}, path);

	MAN.clear('valid', 'dirty');
	COM.state(arr, 1, 3);
	COM.$emit('reset', path);
	return COM;
};

COM.findByName = function(name, path, callback) {

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

	COM.each(function(component) {

		if (component.name !== name)
			return;

		if (isCallback) {
			callback(component);
			return;
		}

		if (!isMany) {
			com = component;
			return true; // stop
		}

		com.push(component);
	}, path);

	return isCallback ? COM : com;
};

COM.findByPath = function(path, callback) {

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

	COM.each(function(component) {

		if (isCallback) {
			callback(component);
			return;
		}

		if (!isMany) {
			com = component;
			return true; // stop
		}

		com.push(component);

	}, path);

	return isCallback ? COM : com;
};

COM.findById = function(id, path, callback) {

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

	COM.each(function(component) {

		if (component.id !== id)
			return;

		if (isCallback) {
			callback(component);
			return;
		}

		if (!isMany) {
			com = component;
			return true; // stop
		}

		com.push(component);

	}, path);

	return isCallback ? COM : com;
};

COM.schema = function(name, declaration, callback) {

	if (!declaration)
		return $.extend(true, {}, MAN.schemas[name]);

	if (typeof(declaration) === 'object') {
		MAN.schemas[name] = declaration;
		return declaration;
	}

	if (typeof(declaration) === 'function') {
		var f = declaration();
		MAN.schemas[name] = f;
		return f;
	}

	if (typeof(declaration) !== 'string')
		return undefined;

	var a = declaration.substring(0, 1);
	var b = declaration.substring(declaration.length - 1);

	if ((a === '"' && b === '"') || (a === '[' && b === ']') || (a === '{' && b === '}')) {
		var d = JSON.parse(declaration);
		MAN.schemas[name] = d;
		if (callback)
			callback(d)
		return d;
	}

	// url?
	$.get($components_url(declaration), function(d) {
		if (typeof(d) === 'string')
			d = JSON.parse(d);
		MAN.schemas[name] = d;
		if (callback)
			callback(d);
	});
};

COM.each = function(fn, path, watch, fix) {
	var isAsterix = path ? path.lastIndexOf('*') !== -1 : false;
	if (isAsterix)
		path = path.replace('.*', '');

	var $path;

	if (!path)
		$path = new Array(0);
	else
		$path = path.split('.');

	var index = 0;

	for (var i = 0, length = MAN.components.length; i < length; i++) {
		var component = MAN.components[i];
		if (component.$removed)
			continue;

		if (fix && component.path !== path)
			continue;

		if (path) {
			if (!component.path)
				continue;
			if (isAsterix) {
				var a = COM_P_COMPARE($path, component.$$path, 0, path, component.path);
				if (!a)
					continue;
			} else {
				if (path !== component.path) {
					if (watch) {
						var a = COM_P_COMPARE($path, component.$$path, 2, path, component.path);
						if (!a)
							continue;
					} else
						continue;
				}
			}
		}

		var stop = fn(component, index++, isAsterix);
		if (stop === true)
			return COM;
	}
	return COM;
};

function COM_P_COMPARE(a, b, type, ak, bk) {

	// type 0 === wildcard
	// type 1 === fix path
	// type 2 === in path

	var key = type + '=' + ak + '=' + bk;
	var r = MAN.temp[key];
	if (r !== undefined)
		return r;

	if (type === 0) {

		for (var i = 0, length = a.length; i < length; i++) {
			if (b[i] === undefined)
				continue;
			if (a[i] !== b[i]) {
				MAN.temp[key] = false;
				return false;
			}
		}

		MAN.temp[key] = true;
		return true;
	}

	if (type === 1) {
		if (a.length !== b.length)
			return false;
		for (var i = 0, length = b.length; i < length; i++) {
			if (a[i] !== b[i]) {
				MAN.temp[key] = false;
				return false;
			}
		}
		MAN.temp[key] = true;
		return true;
	}

	if (type === 2) {

		if (a.length < b.length)
			return false;

		for (var i = 0, length = a.length; i < length; i++) {
			if (b[i] === undefined)
				continue;
			if (a[i] !== b[i]) {
				MAN.temp[key] = false;
				return false;
			}
		}
		MAN.temp[key] = true;
		return true;
	}
}

function COMP(name) {

	this._id = 'component' + Math.floor(Math.random() * 100000);
	this.$dirty = true;
	this.$valid = true;
	this.$validate = false;
	this.$parser = new Array(0);
	this.$formatter = new Array(0);
	this.$skip = false;
	this.$ready = false;
	this.$path;
	this.trim = true;

	this.name = name;
	this.path;
	this.type;
	this.id;
	this.disabled = false;
	this.caller;

	this.make;
	this.done;
	this.prerender;
	this.destroy;
	this.state;
	this.dependencies;

	this.validate;

	this.getter = function(value, type, older) {

		value = this.parser(value);

		if (type === 2)
			this.$skip = true;

		if ((type !== 2 || older !== null) && value === this.get()) {
		 	COM.validate(this.path);
			return this;
		}

		if (this.trim && typeof(value) === 'string')
			value = value.trim();

		this.set(this.path, value, type);
		return this;
	};

	this.setter = function(value, path, type) {

		var self = this;

		if (type === 2) {
			if (self.$skip === true) {
				self.$skip = false;
				return self;
			}
		}

		var selector = self.$input === true ? this.element : this.element.find(COM_DATA_BIND_SELECTOR);
		value = self.formatter(value);

		selector.each(function() {

			var path = this.$component.path;
			if (path && path.length > 0 && path !== self.path)
				return;

			if (this.type === 'checkbox') {
				var tmp = value !== null && value !== undefined ? value.toString().toLowerCase() : '';
				this.checked = tmp === 'true' || tmp === '1' || tmp === 'on';
				return;
			}

			if (value === undefined || value === null)
				value = '';

			if (this.type === 'select-one' || this.type === 'select') {
				$(this).val(value);
				return;
			}

			this.value = value;
		});
	};
}

COMP.prototype.update = function() {
	this.set(this.get());
	return this;
};

COMP.prototype.nested = function(selector, type, value) {
	COM.nested(this.element, selector, type, value);
	return this;
};

COMP.prototype.noscope = function(value) {
	this.$noscope = value === undefined ? true : value === true;
	return this;
};

COMP.prototype.readonly = function() {
	this.noDirty();
	this.noValid();
	this.getter = null;
	this.setter = null;
	this.$parser = null;
	this.$formatter = null;
	return this;
};

COMP.prototype.broadcast = function(name) {
	return BROADCAST(this.dependencies, name, this);
};

COMP.prototype.noValid = function(val) {
	if (val === undefined)
		val = true;
	this.$valid_disabled = val;
	this.$valid = val;
	return this;
};

COMP.prototype.noDirty = function(val) {
	if (val === undefined)
		val = true;
	this.$dirty_disabled = val;
	this.$dirty = val ? false : true;
	return this;
};

COMP.prototype.setPath = function(path, init) {
	var fixed = null;

	if (path.charCodeAt(0) === 33) {
		path = path.substring(1);
		fixed = path;
	}

	this.path = path;
	this.$path = fixed;
	this.$$path = path.split('.');

	if (!init && MAN.isReady)
		MAN.refresh();

	return this;
};

COMP.prototype.attr = function(name, value) {
	if (value === undefined)
		return this.element.attr(name);
	this.element.attr(name, value);
	return this;
};

COMP.prototype.html = function(value) {
	if (value === undefined)
		return this.element.html();
	return this.element.html(value);
};

COMP.prototype.append = function(value) {
	return this.element.append(value);
};

COMP.prototype.find = function(selector) {
	return this.element.find(selector);
};

COMP.prototype.isInvalid = function() {
	var is = !this.$valid;
	if (is && !this.$validate)
		is = !this.$dirty;
	return is;
};

COMP.prototype.watch = function(path, fn, init) {

	var self = this;

	if (typeof(path) === 'function') {
		init = fn;
		fn = path;
		path = self.path;
	}

	self.on('watch', path, fn);

	if (!init)
		return self;

	fn.call(self, path, self.get(path), true);
	return self;
};

COMP.prototype.invalid = function() {
	return COM.invalid(this.path, this);
};

COMP.prototype.valid = function(value, noEmit) {

	if (value === undefined)
		return this.$valid;

	if (this.$valid_disabled)
		return this;

	this.$valid = value;
	this.$validate = false;

	MAN.clear('valid');

	if (noEmit)
		return this;

	if (this.state)
		this.state(1, 1);

	return this;
};

COMP.prototype.style = function(value) {
	STYLE(value);
	return this;
};

COMP.prototype.change = function(value) {
	if (value === undefined)
		value = true;
	COM.change(this.path, value, this);
	return this;
};

COMP.prototype.dirty = function(value, noEmit) {

	if (value === undefined)
		return this.$dirty;

	if (this.$dirty_disabled)
		return this;

	this.$dirty = value;
	MAN.clear('dirty');

	if (noEmit)
		return this;

	if (this.state)
		this.state(2, 2);

	return this;
};

COMP.prototype.reset = function() {
	COM.reset(this.path, 0, this);
	return this;
};

COMP.prototype.remove = function(noClear) {

	this.element.removeData(COM_ATTR);
	this.element.find(COM_ATTR).attr(COM_ATTR_R, 'true');
	this.element.attr(COM_ATTR_R, 'true');

	if (!noClear)
		MAN.clear();

	COM.$removed = true;

	if (!noClear)
		MAN.cleaner();

	return true;
};

COMP.prototype.on = function(name, path, fn, init) {

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

	if (!MAN.events[path]) {
		MAN.events[path] = {};
		MAN.events[path][name] = [];
	} else if (!MAN.events[path][name])
		MAN.events[path][name] = [];

	MAN.events[path][name].push({ fn: fn, context: this, id: this._id, path: fixed });

	if (!init)
		return COM;

	fn.call(COM, path, MAN.get(path));
	return this;
};

COMP.prototype.formatter = function(value) {

	if (typeof(value) === 'function') {
		if (!this.$formatter)
			this.$formatter = [];
		this.$formatter.push(value);
		return this;
	}

	var a = this.$formatter;
	if (a && a.length) {
		for (var i = 0, length = a.length; i < length; i++)
			value = a[i].call(this, this.path, value, this.type);
	}

	a = COM.$formatter;
	if (a && a.length) {
		for (var i = 0, length = a.length; i < length; i++)
			value = a[i].call(this, this.path, value, this.type);
	}

	return value;
};

COMP.prototype.parser = function(value) {

	if (typeof(value) === 'function') {
		if (!this.$parser)
			this.$parser = [];
		this.$parser.push(value);
		return this;
	}

	var a = this.$parser;
	if (a && a.length) {
		for (var i = 0, length = a.length; i < length; i++)
			value = a[i].call(this, this.path, value, this.type);
	}

	a = COM.$parser;
	if (a && a.length) {
		for (var i = 0, length = a.length; i < length; i++)
			value = a[i].call(this, this.path, value, this.type);
	}

	return value;
};

COMP.prototype.emit = function() {
	COM.emit.apply(COM, arguments);
};

COMP.prototype.evaluate = function(path, expression) {
	if (!expression)
		path = this.path;
	return COM.evaluate(path, expression);
};

COMP.prototype.get = function(path) {
	if (!path)
		path = this.path;
	if (!path)
		return;
	if (COM.debug)
		console.log('%c$.components.get(' + path + ')', 'color:gray');
	return MAN.get(path);
};

COMP.prototype.update = function(path, reset) {
	COM.update(path || this.path, reset);
};

COMP.prototype.set = function(path, value, type) {

	var self = this;

	if (value === undefined) {
		value = path;
		path = this.path;
	}

	if (!path)
		return self;

	COM.set(path, value, type);
	return self;
};

COMP.prototype.inc = function(path, value) {

	var self = this;

	if (value === undefined) {
		value = path;
		path = this.path;
	}

	if (!path)
		return self;

	COM.inc(path, value);
	return self;
};

COMP.prototype.extend = function(path, value, type) {

	var self = this;

	if (value === undefined) {
		value = path;
		path = this.path;
	}

	if (!path)
		return self;

	COM.extend(path, value, type);
	return self;
};

COMP.prototype.push = function(path, value, type) {
	var self = this;

	if (value === undefined) {
		value = path;
		path = this.path;
	}

	if (!path)
		return self;

	COM.push(path, value, type, self);
};

function component(type, declaration) {
	return COMPONENT(type, declaration);
}

function COMPONENT(type, declaration) {

	if (MAN.register[type])
		return;

	var fn = function(el) {
		var obj = new COMP(type);
		obj.element = el;
		obj.setPath(el.attr(COM_ATTR_P) || obj._id, true);
		declaration.call(obj);
		return obj;
	};

	MAN.register[type] = fn;
}

function component_async(arr, fn, done) {

	var item = arr.shift();
	if (item === undefined) {
		if (done)
			done();
		return;
	}

	fn(item, function() {
		component_async(arr, fn, done);
	});
}

function CMAN() {
	this.isReady = false;
	this.isCompiling = false;
	this.init = [];
	this.register = {};
	this.cache = {};
	this.storage = {};
	this.cacheblocked = {};
	this.temp = {};
	this.model = {};
	this.components = [];
	this.schemas = {};
	this.toggle = [];
	this.ready = [];
	this.events = {};
	this.timeout;
	this.pending = [];
	this.timeoutStyles;
	this.styles = [];
	this.operations = {};
	this.controllers = {};
}

CMAN.prototype.cacherest = function(method, url, params, value, expire) {

	if (params && !params.version && COM.$version)
		params.version = COM.$version;

	if (params && !params.language && COM.$language)
		params.language = COM.$language;

	params = JSON.stringify(params);
	var key = HASH(method + '#' + url.replace(/\//g, '') + params).toString();
	return this.cachestorage(key, value, expire);
};

CMAN.prototype.cachestorage = function(key, value, expire) {

	var now = Date.now();

	if (COM.debug)
		console.log('%c$.components.cache.' + (value === undefined ? 'get' : 'set') + '(' + key + ')', 'color:silver');

	if (value !== undefined) {
		this.storage[key] = { expire: now + expire, value: value };
		$components_save();
		return;
	}

	var item = this.storage[key];
	if (item && item.expire > now)
		return item.value;
};

CMAN.prototype.initialize = function() {
	var item = this.init.pop();

	if (item === undefined) {
		COM.compile();
		return this;
	}

	if (!item.$removed)
		this.prepare(item);

	this.initialize();
	return this;
};

CMAN.prototype.remap = function(path, value) {
	var index = path.indexOf('->');
	if (index === -1)
		return COM.set(path, value);
	var o = path.substring(0, index).trim();
	var n = path.substring(index + 2).trim();
	COM.set(n, value[o]);
	return this;
};

CMAN.prototype.prepare = function(obj) {

	if (!obj)
		return this;

	var value = obj.get();
	var el = obj.element;

	if (obj.setter) {
		if (!obj.$ready) {
			obj.$ready = true;

			if (value === undefined) {
				var tmp = obj.attr(COM_ATTR_V);
				if (tmp)
					value = new Function('return ' + tmp)();
			}

			obj.setter(value, obj.path, 0);
		}
	}

	if (obj.validate && !obj.$valid_disabled)
		obj.$valid = obj.validate(obj.get(), true);

	if (obj.done) {
		setTimeout(function() {
			obj.done();
		}, 20);
	}

	if (obj.state)
		obj.state(0, 3);

	if (obj.$init) {
		setTimeout(function() {
			if (MAN.isOperation(obj.$init)) {
				var op = OPERATION(obj.$init);
				if (op)
					op.call(obj, obj);
				else if (console)
					console.warn('Operation ' + obj.$init + ' not found.');
				delete obj.$init;
				return;
			}
			var fn = COM.get(obj.$init);
			if (typeof(fn) === 'function')
				fn.call(obj, obj);
			delete obj.$init;
		}, 5);
	}

	el.trigger('component');
	el.off('component');

	var cls = el.attr(COM_ATTR_C);
	if (cls) {
		cls = cls.split(' ');
		for (var i = 0, length = cls.length; i < length; i++)
			el.toggleClass(cls[i]);
	}

	if (obj.id)
		COM.emit('#' + obj.id, obj);

	COM.emit('@' + obj.name, obj);
	COM.emit('component', obj);
	return this;
};

CMAN.prototype.next = function() {
	var next = this.pending.shift();
	if (next === undefined) {
		if (this.isReady)
			this.isCompiling = false;
		return this;
	}
	next();
};

/**
 * Clear cache
 * @param {String} name
 * @return {CMAN}
 */
CMAN.prototype.clear = function() {

	var self = this;

	if (arguments.length === 0) {
		self.cache = {};
		return self;
	}

	var arr = Object.keys(self.cache);

	for (var i = 0, length = arr.length; i < length; i++) {
		var key = arr[i];
		var remove = false;

		for (var j = 0; j < arguments.length; j++) {
			if (key.substring(0, arguments[j].length) !== arguments[j])
				continue;
			remove = true;
			break;
		}

		if (remove)
			delete self.cache[key];
	}

	return self;
};

CMAN.prototype.isArray = function(path) {
	var index = path.lastIndexOf('[');
	if (index === -1)
		return false;
	path = path.substring(index + 1, path.length - 1).substring(0, 1);
	if (path === '"' || path === '\'')
		return false;
	return true;
};

CMAN.prototype.isOperation = function(name) {
	if (name.charCodeAt(0) === 35)
		return true;
	return false;
};
/**
 * Get value from a model
 * @param {String} path
 * @return {Object}
 */
CMAN.prototype.get = function(path) {
	if (path.charCodeAt(0) === 35) {
		var op = OPERATION(path);
		if (op)
			return op;
		else if (console)
			console.warn('Operation ' + path.substring(1) + ' not found.');
		return function(){};
	}

	var cachekey = '=' + path;
	var self = this;
	if (self.temp[cachekey])
		return self.temp[cachekey](window);

	// @TODO: Exception?
	if (path.indexOf('?') !== -1)
		return;

	var arr = path.split('.');
	var builder = [];
	var p = '';

	for (var i = 0, length = arr.length - 1; i < length; i++) {
		p += (p !== '' ? '.' : '') + arr[i];
		builder.push('if(!w.' + p + ')return');
	}

	var fn = (new Function('w', builder.join(';') + ';return w.' + path.replace(/\'/, '\'')));
	self.temp[cachekey] = fn;
	return fn(window);
};

/**
 * Set value to a model
 * @param {String} path
 * @param {Object} value
 */
CMAN.prototype.set = function(path, value) {
	if (path.charCodeAt(0) === 35) {
		var op = OPERATION(path);
		if (op)
			op(value, path);
		else if (console)
			console.warn('Operation ' + path + ' not found.');
		return self;
	}
	var cachekey = '+' + path;
	var self = this;

	if (self.temp[cachekey])
		return self.cache[cachekey](window, value);

	// @TODO: Exception?
	if (path.indexOf('?') !== -1) {
		path = '';
		return self;
	}

	var arr = path.split('.');
	var builder = [];
	var p = '';

	for (var i = 0, length = arr.length; i < length; i++) {
		p += (p !== '' ? '.' : '') + arr[i];
		var type = self.isArray(arr[i]) ? '[]' : '{}';

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

	var fn = (new Function('w', 'a', 'b', builder.join(';') + ';var v=typeof(a) === \'function\' ? a(MAN.get(b)) : a;w.' + path.replace(/\'/, '\'') + '=v;return v'));
	self.cache[cachekey] = fn;
	fn(window, value, path);
	return self;
};

COM.inc = function(path, value, type) {
	var current = COM.get(path);
	if (!current) {
		current = 0;
	} else if (typeof(current) !== 'number') {
		current = parseFloat(current);
		if (isNaN(current))
			current = 0;
	}

	current += value;
	COM.set(path, current, type);
	return self;
};

CMAN.prototype.refresh = function() {
	var self = this;
	clearTimeout(self.$refresh);
	self.$refresh = setTimeout(function() {
		// order by paths
		self.components.sort(function(a, b) {
			var al = a.path.length;
			var bl = b.path.length;
			if (al > bl)
				return -1;
			if (al === bl)
				return a.path.localeCompare(b.path);
			return 1;
		});
	}, 200);
	return self;
};

/**
 * Event cleaner
 * @return {CMAN}
 */
CMAN.prototype.cleaner = function() {

	var self = this;
	var aks = Object.keys(self.events);
	var is = true;

	for (var a = 0, al = aks.length; a < al; a++) {

		var ak = aks[a];

		if (!self.events[ak])
			continue;

		var bks = Object.keys(self.events[ak]);

		for (var b = 0, bl = bks.length; b < bl; b++) {

			var bk = bks[b];
			var arr = self.events[ak][bk];

			if (!arr)
				continue;

			var index = 0;

			while (true) {

				var item = arr[index++];
				if (item === undefined)
					break;

				if (item.context === undefined)
					continue;

				if (item.context === null || (item.context.element && item.context.element.closest(document.documentElement).length))
					continue;

				if (item.context && item.context.element)
					item.context.element.remove();

				item.context.$removed = true;
				item.context = null;
				self.events[ak][bk].splice(index - 1, 1);

				if (self.events[ak][bk].length === 0) {
					delete self.events[ak][bk];
					if (Object.keys(self.events[ak]).length === 0)
						delete self.events[ak];
				}

				index -= 2;
				is = true;
			}
		}
	}

	var index = 0;
	var length = MAN.components.length;

	while (index < length) {
		var component = MAN.components[index++];

		if (!component) {
			index--;
			MAN.components.splice(index, 1);
			length = MAN.components.length;
			continue;
		}

		if (component.element.closest(document.documentElement).length) {
			if (!component.attr(COM_ATTR_R)) {
				if (component.$parser && !component.$parser.length)
					delete component.$parser;
				if (component.$formatter && !component.$formatter.length)
					delete component.$formatter;
				continue;
			}
		}

		index--;

		COM.$emit('destroy', component.name, component);
		if (component.destroy)
			component.destroy();
		component.element.remove();
		component.element = null;
		component.$removed = true;
		component.path = null;
		component.setter = null;
		component.getter = null;
		MAN.components.splice(index, 1);
		length = MAN.components.length;
		is = true;
	}

	var now = Date.now();
	var is2 = false;
	var is3 = false;

	for (var key in self.cacheblocked) {
		if (self.cacheblocked[key] > now)
			continue;
		delete self.cacheblocked[key];
		is2 = true;
	}

	if (COM.defaults.localstorage && is2)
		localStorage.setItem(COM.$localstorage + '.blocked', JSON.stringify(self.cacheblocked));

	for (var key in self.storage) {
		var item = self.storage[key];
		if (!item.expire || item.expire <= now) {
			delete self.storage[key];
			is3 = true;
		}
	}

	if (is3)
		$components_save();

	if (is)
		self.refresh();

	return self;
};

/**
 * Default component
 */
COMPONENT('', function() {
	this.noValid();
	this.noDirty();
	this.getter = null;
	this.make = function() {
		var type = this.element.get(0).tagName;

		if (type !== 'INPUT' && type !== 'SELECT' && type !== 'TEXTAREA') {
			this.getter = null;
			this.setter = function(value) {
				value = this.formatter(value, true);
				this.element.html(value);
			};
			return;
		}

		if (!this.element.attr(COM_ATTR_B))
			this.element.attr(COM_ATTR_B, this.path);

		this.element.$component = this;
	};
});

setInterval(function() {
	MAN.temp = {};
	MAN.cleaner();
}, (1000 * 60) * 5);

COM.compile();
$(document).ready(function() {

	if (COM.defaults.localstorage) {
		var cache = localStorage.getItem(COM.$localstorage + '.cache');
		if (cache && typeof(cache) === 'string') {
			try {
				MAN.storage = JSON.parse(cache);
			} catch (e) {}
		}
		cache = localStorage.getItem(COM.$localstorage + '.blocked');
		if (cache && typeof(cache) === 'string') {
			try {
				MAN.cacheblocked = JSON.parse(cache);
			} catch (e) {}
		}
	}

	$(document).on('change keypress keydown blur focus', 'input[data-component-bind],textarea[data-component-bind],select[data-component-bind]', function(e) {

		var self = this;

		if (e.type === 'keypress') {
			// IE 9+ PROBLEM
			if (self.tagName !== 'TEXTAREA' && e.keyCode === 13)
				return false;
			return;
		}

		var special = self.type === 'checkbox' || self.type === 'radio' || self.tagName === 'SELECT';

		if ((e.type === 'focusin' || e.type === 'focusout') && special)
			return;

		if (e.type === 'focusin' || (e.type === 'change' && !special))
			return;

		if (!self.$component || self.$component.$removed || !self.$component.getter || !self.$component.setter)
			return;

		// Tab
		if (e.keyCode === 9)
			return;

		// Backspace
		if (e.keyCode === 8 && !self.value)
			return;

		if (self.$skip && e.type === 'focusout') {
			$components_keypress(self, self.$value, e);
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
			self.$component.dirty(false, true);
			self.$component.getter(value, 2);
			self.$component.$skip = false;
			return;
		}

		if (self.tagName === 'SELECT') {
			if (e.type === 'keydown')
				return;
			var selected = self[self.selectedIndex];
			value = selected.value;
			self.$component.dirty(false, true);
			self.$component.getter(value, 2);
			self.$component.$skip = false;
			return;
		}

		if (self.$delay === undefined)
			self.$delay = parseInt(self.getAttribute('data-component-keypress-delay') || '0');

		if (self.$only === undefined)
			self.$only = self.getAttribute('data-component-keypress-only') === 'true';

		if (self.$only && (e.type === 'focusout' || e.type === 'change'))
			return;

		if (e.type === 'keydown' && (e.keyCode === undefined || e.keyCode === 9))
			return;

		if (e.keyCode < 41 && e.keyCode !== 8 && e.keyCode !== 32) {
			if (e.keyCode !== 13)
				return;
			if (e.tagName !== 'TEXTAREA') {
				self.$value = self.value;
				clearTimeout(self.$timeout);
				$components_keypress(self, old, e);
				return;
			}
		}

		if (self.$nokeypress === undefined) {
			var v = self.getAttribute('data-component-keypress');
			if (v)
				self.$nokeypress = v === 'false';
			else
				self.$nokeypress = COM.defaults.keypress === false;
		}

		var delay = self.$delay;
		if (self.$nokeypress) {
			if (e.type === 'keydown' || e.type === 'focusout')
				return;
			if (delay === 0)
				delay = 1;
		} else if (delay === 0)
			delay = COM.defaults.delay;

		if (e.type === 'focusout')
			delay = 0;

		clearTimeout(self.$timeout);
		self.$timeout = setTimeout(function() {
			$components_keypress(self, old, e);
		}, delay);
	});

	setTimeout(function() {
		COM.compile();
	}, 2);
});

function $components_keypress(self, old, e) {

	if (self.value === old)
		return;

	clearTimeout(self.$timeout);
	self.$timeout = null;
	self.$component.dirty(false, true);

	if (self.value !== self.$value2) {
		// because validation
		setTimeout(function() {
			self.$value2 = self.value;
			self.$component.getter(self.value, 2, old);
		}, 5);
	}

	if (!self.$only && e.type === 'keydown' && e.keyCode !== 13)
		return;

	self.$skip = true;
	self.$component.$skip = false;
	self.$component.setter(self.value, self.$component.path, 2);
	self.$value = self.value;
	clearTimeout(self.$cleanupmemory);
	self.$cleanupmemory = setTimeout(function() {
		delete self.$value2;
		delete self.$value;
	}, 60000 * 5); // 5 minutes
}

function $components_save() {
	if (COM.defaults.localstorage)
		localStorage.setItem(COM.$localstorage + '.cache', JSON.stringify(MAN.storage));
}

function SET(path, value, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.set(path, value, timeout);
	if (!timeout)
		return COM.set(path, value, reset);
	setTimeout(function() {
		COM.set(path, value, reset);
	}, timeout);
}

function INC(path, value, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.inc(path, value, timeout);
	if (!timeout)
		return COM.inc(path, value, reset);
	setTimeout(function() {
		COM.inc(path, value, reset);
	}, timeout);
}

function EXTEND(path, value, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.extend(path, value, timeout);
	if (!timeout)
		return COM.extend(path, value, reset);
	setTimeout(function() {
		COM.extend(path, value, reset);
	}, timeout);
}

function PUSH(path, value, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.push(path, value, timeout);
	if (!timeout)
		return COM.push(path, value, reset);
	setTimeout(function() {
		COM.push(path, value, reset);
	}, timeout);
}

function RESET(path, timeout) {
	return COM.reset(path, timeout);
}

function WATCH(path, callback, init) {
	return COM.on('watch', path, callback, init);
}

function GET(path) {
	return COM.get(path);
}

function CACHE(key, value, expire) {
	return COM.cache(key, value, expire);
}

function NOTIFY() {
	return COM.notify.apply(COM, arguments);
}

function NOTMODIFIED(path, value, fields) {

	if (value === undefined)
		value = COM.get(path);

	if (value === undefined)
		value = null;

	if (fields)
		path = path.concat('#', fields);

	var hash = HASH(JSON.stringify(value, fields));
	if (MAN.cache[path] === hash)
		return true;
	MAN.cache[path] = hash;
	return false;
}

function FIND(value, many) {

	var path;
	var index = value.indexOf('[');

	if (index !== -1) {
		path = value.substring(index + 1, value.length - 1);
		value = value.substring(0, index);
	}

	if (value.charCodeAt(0) === 46)
		return COM.findByPath(value.substring(1), many);
	if (value.charCodeAt(0) === 35)
		return COM.findById(value.substring(1), path, many)
	return COM.findByName(value, path, many);
}

function BROADCAST(selector, name, caller) {

	var key = 'broadcast=';

	if (typeof(selector) === 'string') {
		key += selector;
		if (MAN.cache[key])
			return $BROADCAST_EVAL(MAN.cache[key], name, caller);
		selector = selector.split(',');
	} else {
		key += selector.join(',');
		if (MAN.cache[key])
			return $BROADCAST_EVAL(MAN.cache[key], name, caller);
	}

	var components = [];

	for (var i = 0, length = selector.length; i < length; i++) {
		var item = selector[i].trim();
		var com = FIND(item);
		if (!com)
			continue;
		components.push(com);
	}

	MAN.cache[key] = components;
	return $BROADCAST_EVAL(components, name, caller);
}

function $BROADCAST_EVAL(components, name, caller) {

	if (!caller)
		caller = null;

	return function() {
		var arg = arguments;
		for (var i = 0, length = components.length; i < length; i++) {
			var component = components[i];
			if (typeof(component[name]) !== 'function')
				continue;
			component.caller = caller;
			component[name].apply(component[name], arg);
			component.caller = null;
		}
	};
}

function UPDATE(path, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.update(path, timeout);
	if (!timeout)
		return COM.update(path, reset);
	setTimeout(function() {
		COM.update(path, reset);
	}, timeout);
}

function CHANGE(path, value) {
	return COM.change(path, value);
}

function INJECT(url, target, callback, timeout) {
	return COM.import(url, target, callback, timeout);
}

function IMPORT(url, target, callback, timeout) {
	return COM.import(url, target, callback, timeout);
}

function SCHEMA(name, declaration, callback) {
	return COM.schema(name, declaration, callback);
}

function OPERATION(name, fn) {
	if (!fn) {
		if (name.charCodeAt(0) === 35)
			return MAN.operations[name.substring(1)];
		return MAN.operations[name];
	}
	MAN.operations[name] = fn;
	return fn;
}

function ON(name, path, fn, init) {
	COM.on(name, path, fn, init);
}

function EVALUATE(path, expression) {
	return COM.evaluate(path, expression);
}

function MAKE(callback) {
	var obj = {};
	callback.call(obj, obj);
	return obj;
}

function STYLE(value) {
	clearTimeout(MAN.timeoutStyles);
	MAN.styles.push(value);
	MAN.timeoutStyles = setTimeout(function() {
		$('<style type="text/css">' + MAN.styles.join('') + '</style>').appendTo('head');
		MAN.styles = [];
	}, 50);
}

function BLOCKED(name, timeout, callback) {
	return COM.blocked(name, timeout, callback);
}

function HASH(s) {
	if (!s)
		return 0;
	if (typeof(s) !== 'string')
		s = JSON.stringify(s);
	var hash = 0, i, char;
	if (s.length === 0)
		return hash;
	var l = s.length;
	for (i = 0; i < l; i++) {
		char = s.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

function COMPILE() {
	$.components();
}

function CONTROLLER() {
	var callback = arguments[arguments.length - 1];

	if (typeof(callback) !== 'function')
		return MAN.controllers[arguments[0]];

	var obj = {};
	obj.name = obj.path = arguments[0];
	var replacer = function(path) {

		var arg = arguments;
		var is = false;

		path = path.replace(/\{\d+\}/g, function(text) {
			is = true;
			return arg[parseInt(text.substring(1, text.length - 1)) + 1];
		}).replace(/\{\w+\}/g, function(text) {
			is = true;
			return obj[text.substring(1, text.length - 1)];
		});

		if (is)
			return path;
		return obj.path + '.' + path;
	};
	MAN.controllers[obj.name] = obj;
	return obj.$init = function(arg, path, element) {
		delete obj.$init;
		if (path)
			obj.path = path;
		obj.element = element;
		callback.call(obj, replacer, arg);
		return obj;
	};
}

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
	var err;

	var c = function(e) {
		if (e) {
			if (!err) err = [];
			err.push(e);
		}
		var fn = arr[index++];

		if (fn === undefined) {
			if (callback)
				callback.call(context, err, context);
			return;
		}

		fn.call(context, err, c);
	};

	c();
};

String.prototype.isEmail = function() {
	var str = this;
	if (str.length <= 4)
		return false;
	return REG_EMAIL.test(str);
};

String.prototype.parseInt = function(def) {
	var str = this.trim();
	var num = +str;
	if (isNaN(num))
		return def || 0;
	return num;
};

String.prototype.parseFloat = function(def) {
	var str = this.trim();
	if (str.indexOf(',') !== -1)
		str = str.replace(',', '.');
	var num = +str;
	if (isNaN(num))
		return def || 0;
	return num;
};

Array.prototype.trim = function() {
	var self = this;
	var output = [];
	for (var i = 0, length = self.length; i < length; i++) {
		if (typeof(self[i]) === STRING)
			self[i] = self[i].trim();
		if (self[i])
			output.push(self[i]);
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

Date.prototype.format || (Date.prototype.format = function(t) {
    var e = this, r = !1;
    if (t && 33 === t.charCodeAt(0) && (r = !0, t = t.substring(1)), void 0 === t || null === t || '' === t) return e.getFullYear() + '-' + (e.getMonth() + 1).toString().padLeft(2, '0') + '-' + e.getDate().toString().padLeft(2, '0') + 'T' + e.getHours().toString().padLeft(2, '0') + ':' + e.getMinutes().toString().padLeft(2, '0') + ':' + e.getSeconds().toString().padLeft(2, '0') + ':' + e.getMilliseconds().toString();
    var n = e.getHours();
    return r && n >= 12 && (n -= 12), t.replace(/yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|a/g, function(t) {
        switch (t) {
            case 'yyyy':
                return e.getFullYear();
            case 'yy':
                return e.getYear();
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
            case 'a':
                var r = 'AM';
                return e.getHours() >= 12 && (r = 'PM'), r
        }
    });
});

Number.prototype.format || (Number.prototype.format = function(t, e, r) {
    var n = this,
        a = n.toString(),
        o = "",
        g = "",
        i = 45 === a.charCodeAt(0) ? '-' : '';
    i && (a = a.substring(1));
    var s = a.indexOf('.');
    if (typeof t === 'string') {
        var u = e;
        e = t, t = u
    }
    void 0 === e && (e = ' '), -1 !== s && (o = a.substring(s + 1), a = a.substring(0, s)), s = -1;
    for (var p = a.length - 1; p >= 0; p--) s++, s > 0 && s % 3 === 0 && (g = e + g), g = a.substring(p, p + 1) + g;
    return (t || o.length) && (o = o.length > t ? o.substring(0, t) : o.padRight(t, '0')), o.length && void 0 === r && (r = '.' === e ? ',' : '.'), i + g + (o.length ? r + o : '');
});

String.prototype.padLeft || (String.prototype.padLeft = function(t, e) {
    var r = this.toString();
    return Array(Math.max(0, t - r.length + 1)).join(e || '0') + r;
});

String.prototype.padRight || (String.prototype.padRight = function(t, e) {
    var r = this.toString();
    return r + Array(Math.max(0, t - r.length + 1)).join(e || '0')
});

String.prototype.format = function() {
	var arg = arguments;
	return this.replace(REG_FORMAT, function(text) {
		var value = arg[+text.substring(1, text.length - 1)];
		if (value === null || value === undefined)
			value = '';
		return value;
	});
};