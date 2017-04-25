var MAN = new CMAN();
!window.MAN && (window.MAN = MAN);

var COMPATTR_B = 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind],input[data-component-bind],textarea[data-component-bind],select[data-component-bind]';
var COMPATTR_C = '[data-jc],[data-component]';
var COMPATTR_U = '[data-jc-url],[data-component-url]';
var COMPATTR_S = '[data-jc-scope],[data-component-scope],[data-jc-controller],[data-component-controller]';
var COMPATTR_R = 'data-jc-removed';
var DIACRITICS = {225:'a',228:'a',269:'c',271:'d',233:'e',283:'e',357:'t',382:'z',250:'u',367:'u',252:'u',369:'u',237:'i',239:'i',244:'o',243:'o',246:'o',353:'s',318:'l',314:'l',253:'y',255:'y',263:'c',345:'r',341:'r',328:'n',337:'o'};

window.isMOBILE = ('ontouchstart' in window || navigator.maxTouchPoints) ? true : false;
window.isROBOT = navigator.userAgent ? (/search|agent|bot|crawler|spider/i).test(navigator.userAgent) : true;
window.isSTANDALONE = navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

window.EMPTYARRAY = [];
window.EMPTYOBJECT = {};

window.setTimeout2 = function(name, fn, timeout, limit) {
	var key = ':' + name;
	if (limit > 0) {
		var key2 = key + ':limit';
		if (MAN.others[key2] >= limit)
			return;
		MAN.others[key2] = (MAN.others[key2] || 0) + 1;
		MAN.others[key] && clearTimeout(MAN.others[key]);
		return MAN.others[key] = setTimeout(function() {
			MAN.others[key2] = undefined;
			fn && fn();
		}, timeout);
	}

	MAN.others[key] && clearTimeout(MAN.others[key]);
	return MAN.others[key] = setTimeout(fn, timeout);
};

window.clearTimeout2 = function(name) {
	var key = ':' + name;

	if (MAN.others[key]) {
		clearTimeout(MAN.others[key]);
		MAN.others[key] = undefined;
		MAN.others[key + ':limit'] && (MAN.others[key + ':limit'] = undefined);
		return true;
	}

	return false;
};

window.TRY = function(fn, err) {
	try {
		fn();
		return true;
	} catch (e) {
		err && err(e);
	}
	return false;
};

if (Object.freeze) {
	Object.freeze(EMPTYOBJECT);
	Object.freeze(EMPTYARRAY);
}

window.SINGLETON = function(name, def) {
	return MAN.singletons[name] || (MAN.singletons[name] = (new Function('return ' + (def || '{}')))());
};

// Because of file size
window.COM = window.jC = function(container) {
	return COM.compile(container);
};

COM.clean = function(timeout) {
	clearTimeout(MAN.tic);
	MAN.tic = setTimeout(function() {
		MAN.cleaner();
	}, timeout || 10);
	return COM;
};

COM.evaluate = function(path, expression, nopath) {
	var key = 'eval' + expression;
	var exp = MAN.cache[key];
	var val;

	if (nopath)
		val = path;
	else
		val = COM.get(path);

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
COM.defaults.jsoncompress = false;
COM.defaults.jsondate = true;
COM.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' };
COM.defaults.devices = { xs: { max: 768 }, sm: { min: 768, max: 992 }, md: { min: 992, max: 1200 }, lg: { min: 1200 }};
COM.defaults.importcache = 'session';
COM.version = 'v9.0.0';
COM.$localstorage = 'jc';
COM.$version = '';
COM.$language = '';
COM.$formatter = [];
COM.$parser = [];
COM.$parser.push(function(path, value, type) {
	if (type === 'number' || type === 'currency' || type === 'float') {
		if (typeof(value) === 'string')
			value = value.replace(/\s/g, '').replace(/,/g, '.');
		var v = parseFloat(value);
		return isNaN(v) ? null : v;
	}
	return value;
});

COM.cookies = {
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
			var date = DATETIME;
			date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));
			expire = date;
		} else if (type === 'string')
			expire = new Date(Date.now() + expire.parseExpire());
		document.cookie = name + '=' + value + '; expires=' + expire.toGMTString() + '; path=/';
	},
	rem: function (name) {
		this.set(name, '', -1);
	}
};

COM.formatter = function(value, path, type) {

	if (typeof(value) === 'function') {
		if (!COM.$formatter)
			COM.$formatter = [];
		COM.$formatter.push(value);
		return COM;
	}

	var a = COM.$formatter;
	if (a && a.length) {
		for (var i = 0, length = a.length; i < length; i++)
			value = a[i].call(COM, path, value, type);
	}

	return value;
};

COM.usage = function(name, expire, path, callback) {

	var type = typeof(expire);
	if (type === 'string')
		expire = DATETIME.add('-' + expire);
	else if (type === 'number')
		expire = Date.now() - expire;

	if (typeof(path) === 'function') {
		callback = path;
		path = undefined;
	}

	var arr = [];

	if (path) {
		COM.findByPath(path, function(c) {
			if (c.usage[name] > expire)
				return;
			if (callback)
				callback(c);
			else
				arr.push(c);
		});
	} else {
		MAN.components.forEach(function(c) {
			if (c.usage[name] > expire)
				return;
			if (callback)
				callback(c);
			else
				arr.push(c);
		});
	}

	return callback ? COM : arr;
};

COM.schedule = function(selector, name, expire, callback) {
	if (expire.substring(0, 1) !== '-')
		expire = '-' + expire;
	var arr = expire.split(' ');
	var type = arr[1].toLowerCase().substring(0, 1);
	MAN.schedulers.push({ name: name, expire: expire, selector: selector, callback: callback, type: type === 'y' || type === 'd' ? 'h' : type });
	return COM;
};

COM.parser = function(value, path, type) {

	if (typeof(value) === 'function') {
		!COM.$parser && (COM.$parser = []);
		COM.$parser.push(value);
		return this;
	}

	var a = COM.$parser;
	if (a && a.length) {
		for (var i = 0, length = a.length; i < length; i++)
			value = a[i].call(COM, path, value, type);
	}

	return value;
};

COM.compile = function(container) {

	if (MAN.isCompiling) {
		MAN.recompile = true;
		return COM;
	}

	var jcw = window.READY || window.jComponent;
	if (jcw && jcw.length) {
		while (true) {
			var fn = jcw.shift();
			if (!fn)
				break;
			fn();
		}
	}

	MAN.isCompiling = true;
	COM.$inject();

	if (MAN.pending.length) {
		(function(container) {
			MAN.pending.push(function() {
				COM.compile(container);
			});
		})(container);
		return COM;
	}

	var scopes = $(COMPATTR_S);
	var scopes_length = scopes.length;
	var has = false;

	COM.crawler(container, function(name, dom) {

		var el = $(dom);
		has = true;

		if (MAN.initializers['$ST_' + name]) {
			dom.$jc = true;
			el.attr(COMPATTR_R, true);
			el.remove();
			return;
		}

		var instances = [];
		var all = name.split(',');

		all.forEach(function(name) {
			name = name.trim();
			var component = MAN.register[name || ''];
			if (!component) {

				var x = COMPATTR(el, 'import');
				if (!x) {
					!MAN.initializers['$NE_' + name] && (MAN.initializers['$NE_' + name] = true);
					return;
				}

				if (MAN.imports[x] === 1)
					return;

				if (MAN.imports[x] === 2) {
					!MAN.initializers['$NE_' + name] && (MAN.initializers['$NE_' + name] = true);
					return;
				}

				MAN.imports[x] = 1;
				IMPORT(x, function() {
					MAN.imports[x] = 2;
				});
				return;
			}

			var obj = component(el);
			if (obj.init) {
				if (!MAN.initializers[name]) {
					MAN.initializers[name] = true;
					obj.init();
				}
				obj.init = undefined;
			}

			obj.$init = COMPATTR(el, 'init') || null;
			obj.type = COMPATTR(el, 'type') || '';
			obj.id = COMPATTR(el, 'id') || obj._id;
			obj.dependencies = [];
			obj.siblings = all.length > 1;

			dom.$jc = true;

			if (!obj.$noscope)
				obj.$noscope = COMPATTR(el, 'noscope') === 'true';

			if (COMPATTR(el, 'singleton') === 'true')
				MAN.initializers['$ST_' + name] = true;

			var code = obj.path ? obj.path.charCodeAt(0) : 0;
			if (!obj.$noscope && scopes_length && obj.path && code !== 33 && code !== 35) {

				for (var i = 0; i < scopes_length; i++) {

					if (!$.contains(scopes[i], dom))
						continue;

					var p = scopes[i].$jcscope || COMPATTR(scopes[i], 'scope');

					scopes[i].$initialized = true;

					if (!scopes[i].$processed) {
						scopes[i].$processed = true;

						if (!p || p === '?') {
							p = GUID(25).replace(/\d/g, '');
							scopes[i].$jcscope = p;
						}

						var tmp = COMPATTR(scopes[i], 'value');
						if (tmp) {
							var fn = new Function('return ' + tmp);
							MAN.defaults['#' + HASH(p)] = fn; // store by path (DEFAULT() --> can reset scope object)
							tmp = fn();
							MAN.set(p, tmp);
							COM.$emitwildcard(p, tmp, 1);
						}
					}

					obj.setPath(obj.path === '?' ? p : (obj.path.indexOf('?') === -1 ? p + '.' + obj.path : obj.path.replace(/\?/g, p)));
					obj.scope = scopes[i];
					obj.$controller = COMPATTR(scopes[i], 'controller');
					obj.pathscope = p;
				}
			}

			var dep = (COMPATTR(el, 'dependencies') || '').split(',');
			for (var i = 0, length = dep.length; i < length; i++) {
				var d = dep[i].trim();
				d && obj.dependencies.push(d);
			}

			instances.push(obj);

			var template = COMPATTR(el, 'template') || obj.template;
			if (template)
				obj.template = template;

			if (COMPATTR(el, 'released') === 'true')
				obj.$released = true;

			if (COMPATTR(el, 'url')) {
				window.console && window.console.warn('jComponent: You cannot use [data-jc-url] for the component: ' + obj.name + '[' + obj.path + ']. Instead of it you have to use data-jc-template.');
				return;
			}

			if (typeof(template) === 'string') {
				var fn = function(data) {
					if (obj.prerender)
						data = obj.prerender(data);
					typeof(obj.make) === 'function' && obj.make(data);
					$jc_init(el, obj);
				};

				var c = template.substring(0, 1);
				if (c === '.' || c === '#' || c === '[') {
					fn($(template).html());
					return;
				}

				var k = 'TE' + HASH(template);
				var a = MAN.temp[k];
				if (a)
					return fn(a);

				$.get($jc_url(template), function(response) {
					MAN.temp[k] = response;
					fn(response);
				});
				return;
			}

			if (typeof(obj.make) === 'string') {

				if (obj.make.indexOf('<') !== -1) {
					if (obj.prerender)
						obj.make = obj.prerender(obj.make);
					el.html(obj.make);
					$jc_init(el, obj);
					return;
				}

				$.get($jc_url(obj.make), function(data) {
					if (obj.prerender)
						data = obj.prerender(data);
					el.html(data);
					$jc_init(el, obj);
				});

				return;
			}

			obj.make && obj.make();
			$jc_init(el, obj);
		});

		// A reference to implementation
		el.data(COMPATTR_C, instances.length > 1 ? instances : instances[0]);
	});

	if (!has)
		MAN.isCompiling = false;

	if (container !== undefined || !MAN.toggle.length)
		return MAN.next();

	$jc_async(MAN.toggle, function(item, next) {
		for (var i = 0, length = item.toggle.length; i < length; i++)
			item.element.toggleClass(item.toggle[i]);
		next();
	}, function() {
		MAN.next();
	});
};

COM.crawler = function(container, onComponent, level) {

	if (container)
		container = $(container).get(0);
	else
		container = document.body;

	if (!container)
		return COM;

	var name = COMPATTR(container);
	!container.$jc && name != null && onComponent(name, container, 0);

	var arr = container.childNodes;
	var sub = [];

	if (level === undefined)
		level = 0;
	else
		level++;

	for (var i = 0, length = arr.length; i < length; i++) {
		var el = arr[i];
		if (el) {
			el.tagName && el.childNodes.length && el.tagName !== 'SCRIPT' && MAN.regexpcom.test(el.innerHTML) && sub.push(el);
			!el.$jc && el.tagName && (el.hasAttribute('data-jc') || el.hasAttribute('data-component')) && onComponent(COMPATTR(el) || '', el, level);
		}
	}

	for (var i = 0, length = sub.length; i < length; i++) {
		el = sub[i];
		el && COM.crawler(el, onComponent, level);
	}

	return COM;
};

COM.$inject = function() {

	var els = $(COMPATTR_U);
	var arr = [];
	var count = 0;

	els.each(function() {
		var el = $(this);
		if (el.data(COMPATTR_U))
			return;

		el.data(COMPATTR_U, '1');

		var url = COMPATTR(el, 'url');

		// Unique
		var once = url.substring(0, 5).toLowerCase() === 'once ';
		if (url.substring(0, 1) === '!' || once) {

			if (once)
				url = url.substring(5);
			else
				url = url.substring(1);

			if (MAN.others[url])
				return;

			MAN.others[url] = 2;
		}

		arr.push({ element: el, cb: COMPATTR(el, 'init'), path: COMPATTR(el, 'path'), url: url, toggle: (COMPATTR(el, 'class') || '').split(' ') });
	});

	if (!arr.length)
		return;

	var compile = false;

	$jc_async(arr, function(item, next) {
		var key = $jc_url(item.url);
		var can = false;

		AJAXCACHE('GET ' + key, null, function(response) {

			key = '$import' + key;

			if (MAN.cache[key])
				response = MAN.removescripts(response);

			can = response && MAN.regexpcom.test(response);
			if (can)
				compile = true;

			// inject
			item.element.html(response);
			MAN.cache[key] = true;

			if (can && item.path) {
				var com = item.element.find(COMPATTR_C);
				com.each(function() {
					var el = $(this);
					$.each(this.attributes, function() {
						this.specified && el.attr(this.name, this.value.replace('$', item.path));
					});
				});
			}

			item.toggle.length && item.toggle[0] && MAN.toggle.push(item);

			if (item.cb && !COMPATTR(item.element)) {
				var cb = MAN.get(item.cb);
				typeof(cb) === 'function' && cb(item.element);
			}

			count++;
			next();
		}, COM.defaults.importcache);

	}, function() {
		MAN.clear('valid', 'dirty', 'broadcast', 'find');
		count && compile && window.COMPILE();
	});
};

COM.components = function() {
	return Object.keys(MAN.register).trim();
};

COM.inject = COM.import = function(url, target, callback, insert, preparator) {

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

		if (MAN.others[url]) {

			if (!callback)
				return COM;

			if (MAN.others[url] === 2) {
				callback();
				return COM;
			}

			WAIT(function() {
				return MAN.others[url] === 2;
			}, function() {
				callback();
			});

			return COM;
		}

		MAN.others[url] = 1;
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
			MAN.others[url] = 2;
			callback && callback();
			window.jQuery && setTimeout(COM.compile, 300);
		};

		scr.src = url;
		d.getElementsByTagName('head')[0].appendChild(scr);
		return;
	}

	if (ext === '.css') {
		var stl = d.createElement('link');
		stl.type = 'text/css';
		stl.rel = 'stylesheet';
		stl.href = url;
		d.getElementsByTagName('head')[0].appendChild(stl);
		MAN.others[url] = 2;
		callback && setTimeout(callback, 200);
		return;
	}

	WAIT(function() {
		return window.jQuery ? true : false;
	}, function() {
		MAN.others[url] = 2;

		var id = '';

		if (insert) {
			id = 'data-jc-imported="' + ((Math.random() * 100000) >> 0) + '"';
			$(target).append('<div ' + id + '></div>');
			target = $(target).find('> div[' + id + ']');
		}

		var key = $jc_url(url);
		AJAXCACHE('GET ' + key, null, function(response) {

			key = '$import' + key;

			if (preparator)
				response = preparator(response);

			if (MAN.cache[key])
				response = MAN.removescripts(response);
			else
				response = MAN.importstyles(response, id);

			$(target).html(response);
			MAN.cache[key] = true;

			setTimeout(function() {
				response && MAN.regexpcom.test(response) && COM.compile(target);
				callback && callback();
			}, 10);

		}, COM.defaults.importcache);
	});
	return COM;
};

COM.createURL = function(url, values) {

	if (typeof(url) === 'object') {
		values = url;
		url = location.pathname + location.search;
	}

	var query;
	var index = url.indexOf('?');
	if (index !== -1) {
		query = COM.parseQuery(url.substring(index + 1));
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

COM.parseCookie = COM.parseCookies = function() {
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

COM.parseQuery = function(value) {

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

COM.UPLOAD = function(url, data, callback, timeout, progress) {

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
				r = PARSE(r, COM.defaults.jsondate);
			} catch (e) {}

			if (progress) {
				if (typeof(progress) === 'string')
					MAN.remap(progress, 100);
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
				return typeof(callback) === 'string' ? MAN.remap(callback, r) : (callback && callback(r));

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
				MAN.remap(progress, percentage);
			else
				progress(percentage, evt.transferSpeed, evt.timeRemaining);
		};

		xhr.open('POST', url);
		Object.keys(COM.defaults.headers).forEach(function(key) {
			xhr.setRequestHeader(key, COM.defaults.headers[key]);
		});
		xhr.send(data);

	}, timeout || 0);

	return COM;
};

window.TEMPLATE = COM.TEMPLATE = function(url, callback, prepare) {

	if (MAN.cache[url]) {

		if (typeof(callback) === 'string')
			SET(callback, MAN.cache[url]);
		else
			callback(MAN.cache[url]);

		return COM;
	}

	AJAX('GET ' + url, function(response, err) {

		if (err)
			response = '';

		var value = MAN.cache[url] = prepare ? prepare(response) : response;
		if (typeof(callback) === 'string')
			SET(callback, value);
		else
			callback(value);
	});

	return COM;
};

COM.AJAX = function(url, data, callback, timeout) {

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
		return COM;

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
	var middleware = '';

	if (index !== -1) {
		middleware = url.substring(index);
		url = url.substring(0, index);
	}

	setTimeout(function() {

		if (method === 'GET' && data)
			url += '?' + (typeof(data) === 'string' ? data : jQuery.param(data, true));

		var options = {};
		options.type = method;
		options.converters = MAN.jsonconverter;

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

		options.headers = $.extend(headers, COM.defaults.headers);

		var key = HASH(url + STRINGIFY(options));
		var ma = MAN.ajax[key];
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
			delete MAN.ajax[key];
			output.response = r;
			output.status = s;
			output.headers = req.getAllResponseHeaders();
			EMIT('response', output);
			output.process && $MIDDLEWARE(middleware, output.response, 1, function(path, value) {
				if (typeof(callback) === 'string')
					MAN.remap(callback, value);
				else
					callback && callback(value, undefined, output);
			});
		};

		options.error = function(req, status, e) {
			delete MAN.ajax[key];
			output.response = req.responseText;
			output.status = status + ': ' + e;
			output.error = true;
			output.headers = req.getAllResponseHeaders();

			if (output.headers.indexOf('/json') !== -1) {
				try {
					output.response = PARSE(output.response, COM.defaults.jsondate);
				} catch (e) {}
			}

			EMIT('response', output);
			output.process && EMIT('error', output);
			output.process && typeof(callback) === 'function' && callback(output.response, output.status, output);
		};

		MAN.ajax[key] = $.ajax($jc_url(url), options);
	}, timeout || 0);

	return COM;
};

COM.AJAXCACHEREVIEW = function(url, data, callback, expire, timeout, clear) {
	return AJAXCACHE(url, data, callback, expire, timeout, clear, true);
};

COM.AJAXCACHE = function(url, data, callback, expire, timeout, clear, review) {

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
		return COM;

	var method = url.substring(0, index).toUpperCase();
	var uri = url.substring(index).trim();

	setTimeout(function() {
		var value = clear ? undefined : MAN.cacherest(method, uri, data, undefined, expire);
		if (value !== undefined) {

			var diff = review ? STRINGIFY(value) : null;

			if (typeof(callback) === 'string')
				MAN.remap(callback, value);
			else
				callback(value, true);

			if (!review)
				return COM;

			AJAX(url, data, function(r, err) {
				if (err)
					r = err;
				// Is same?
				if (diff !== STRINGIFY(r)) {
					MAN.cacherest(method, uri, data, r, expire);
					if (typeof(callback) === 'string')
						MAN.remap(callback, r);
					else
						callback(r, false, true);
				}
			});
			return COM;
		}

		COM.AJAX(url, data, function(r, err) {
			if (err)
				r = err;
			MAN.cacherest(method, uri, data, r, expire);
			if (typeof(callback) === 'string')
				MAN.remap(callback, r);
			else
				callback(r, false);
		});
	}, timeout || 1);

	return COM;
};

COM.cachepath = function(path, expire, rebind) {
	var key = '$jcpath';
	WATCH(path, function(p, value) {
		var obj = MAN.cachestorage(key);
		if (obj)
			obj[path] = value;
		else {
			obj = {};
			obj[path] = value;
		}
		MAN.cachestorage(key, obj, expire);
	});

	if (rebind === undefined || rebind) {
		var cache = MAN.cachestorage(key);
		cache && cache[path] !== undefined && cache[path] !== GET(path) && SET(path, cache[path], true);
	}

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
	} else
		delete MAN.storage[key];
	$jc_save();
	return COM;
};

COM.REMOVECACHE = function(method, url, data) {

	var index = method.indexOf(' ');
	if (index !== -1) {
		data = url;
		url = method.substring(index).trim();
		method = method.substring(0, index);
	}

	data = STRINGIFY(data);
	var key = HASH(method + '#' + url.replace(/\//g, '') + data).toString();
	delete MAN.storage[key];
	$jc_save();
	return COM;
};

COM.ready = function(fn) {
	MAN.ready && MAN.ready.push(fn);
	return COM;
};

function $jc_url(url) {
	var index = url.indexOf('?');
	var builder = [];

	COM.$version && builder.push('version=' + encodeURIComponent(COM.$version));
	COM.$language && builder.push('language=' + encodeURIComponent(COM.$language));

	if (!builder.length)
		return url;

	if (index !== -1)
		url += '&';
	else
		url += '?';

	return url + builder.join('&');
}

function $jc_ready() {
	clearTimeout(MAN.timeout);
	MAN.timeout = setTimeout(function() {

		$MEDIAQUERY();
		MAN.refresh();
		MAN.initialize();

		var count = MAN.components.length;
		$(document).trigger('components', [count]);

		if (!MAN.isReady) {
			MAN.clear('valid', 'dirty', 'broadcast', 'find');
			MAN.isReady = true;
			EMIT('init');
			EMIT('ready');
		}

		MAN.timeoutcleaner && clearTimeout(MAN.timeoutcleaner);
		MAN.timeoutcleaner = setTimeout(function() {
			MAN.cleaner();
			MAN.autofill.splice(0).forEach(function(component) {
				var el = component.element.find(COMPATTR_B).eq(0);
				var val = el.val();
				if (val) {
					var tmp = component.parser(val);
					component.set(tmp);
					COM.$emitwildcard(component.path, tmp, 3);
				}
			});
		}, 1000);

		MAN.isCompiling = false;

		$(COMPATTR_S).each(function() {

			if (!this.$initialized || this.$ready)
				return;

			var scope = $(this);
			this.$ready = true;

			// Applies classes
			var cls = COMPATTR(scope, 'class');
			if (cls) {
				(function(cls) {
					cls = cls.split(' ');
					setTimeout(function() {
						for (var i = 0, length = cls.length; i < length; i++)
							scope.toggleClass(cls[i]);
					}, 5);
				})(cls);
			}

			var controller = COMPATTR(this, 'controller');
			if (controller) {
				var ctrl = CONTROLLER(controller);
				if (ctrl)
					ctrl.$init(this.$jcscope, scope);
				else {
					!MAN.warning[controller] && window.console && window.console.warn('jComponent: The controller "{0}" not found.'.format(controller));
					MAN.warning[controller] = true;
				}
			}

			var path = COMPATTR(this, 'init');
			if (!path)
				return;

			if (MAN.isOperation(path)) {
				var op = OPERATION(path);
				if (op)
					op.call(scope, this.$jcscope, scope);
				else if (window.console) {
					!MAN.warning[path] && window.console.warn('jComponent: The operation ' + path + ' not found.');
					MAN.warning[path] = true;
				}
			} else {
				var fn = GET(path);
				typeof(fn) === 'function' && fn.call(scope, this.$jcscope, scope);
			}
		});

		if (MAN.recompile) {
			MAN.recompile = false;
			COM.compile();
		}

		if (!MAN.ready)
			return;

		var arr = MAN.ready;
		for (var i = 0, length = arr.length; i < length; i++)
			arr[i](count);

		MAN.ready = undefined;
	}, 100);
}

COM.watch = function(path, fn, init) {

	if (typeof(path) === 'function') {
		init = fn;
		fn = path;
		path = '*';
	}

	ON('watch', path, fn);
	init && fn.call(COM, path, MAN.get(path), 0);
	return COM;
};

COM.on = function(name, path, fn, init) {

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

	if (!MAN.events[path]) {
		MAN.events[path] = {};
		MAN.events[path][name] = [];
	} else if (!MAN.events[path][name])
		MAN.events[path][name] = [];

	MAN.events[path][name].push({ fn: fn, id: this._id, path: fixed });
	init && fn.call(COM, path, MAN.get(path), true);
	(MAN.isReady && (name === 'ready' || name === 'init')) && fn();
	return COM;
};

function $jc_init(el, obj) {

	var dom = el.get(0);
	var type = dom.tagName;
	var collection;

	// autobind
	if (type === 'INPUT' || type === 'SELECT' || type === 'TEXTAREA') {
		obj.$input = true;
		collection = obj.element;
	} else
		collection = el.find(COMPATTR_B);

	collection.each(function() {
		if (!this.$jc)
			this.$jc = obj;
	});

	obj.released && obj.released(obj.$released);
	MAN.components.push(obj);
	MAN.init.push(obj);
	type !== 'BODY' && MAN.regexpcom.test(el.get(0).innerHTML) && COM.compile(el);
	$jc_ready();
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

COM.$emitwildcard = function(path, value, type) {
	MAN.const_emit2[0] = path;
	MAN.const_emit2[1] = value;
	MAN.const_emit2[2] = type;
	COM.$emit2('watch', '*', MAN.const_emit2);
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

	COM.$emitwildcard(path, unique[path], type);

	Object.keys(unique).forEach(function(key) {
		MAN.const_emit2[1] = unique[key];
		COM.$emit2(name, key, MAN.const_emit2);
	});

	return this;
};

COM.$emit = function(name, path) {

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
		MAN.const_emit2[0] = path;
		MAN.const_emit2[1] = COM.get(path);
		MAN.const_emit2[2] = arguments[3];
		COM.$emit2(name, '*', MAN.const_emit2);
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

		args[1] = COM.get(p + k);
		COM.$emit2(name, p + k, args);
		k !== a && COM.$emit2(name, p + a, args);
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
		if (context !== undefined && (context === null || context.$removed))
			continue;
		e[i].fn.apply(context || window, args);
	}

	return true;
};

COM.change = function(path, value) {
	if (value === undefined)
		return !COM.dirty(path);
	return !COM.dirty(path, !value);
};

COM.used = function(path) {
	COM.each(function(obj) {
		obj.used();
	}, path, true);
	return COM;
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
				obj.$interaction(102);
			}
		} else if (onlyComponent._id === obj._id) {
			obj.$valid = value;
			obj.$interaction(102);
		}

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

	MAN.clear('dirty');
	MAN.cache[key] = dirty;

	// For double hitting component.state() --> look into COM.invalid()
	!skipEmitState && COM.state(arr, 1, 2);

	return dirty;
};

// 1 === manually
// 2 === by input
COM.update = function(path, reset, type) {

	var is = path.charCodeAt(0) === 33;
	if (is)
		path = path.substring(1);

	path = path.replace(/\.\*/, '');
	$MIDDLEWARE(path, undefined, type, function(path) {

		if (!path)
			return COM;

		var state = [];
		var updates = {};

		// Array prevention
		var search = path;

		if (type === undefined)
			type = 1; // manually

		var A = search.split('.');
		var AL = A.length;
		var isarr = path.indexOf('[') !== -1;

		COM.each(function(component) {

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

				$MIDDLEWARE(component.middleware, result, type, function(tmp, value) {
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

				component.element.find(COMPATTR_B).each(function() {
					this.$value = this.$value2 = undefined;
				});

			} else if (component.validate && !component.$valid_disabled)
				component.valid(component.validate(result), true);

			component.state && state.push(component);
			updates[component.path] = result;

		}, is ? path : undefined, undefined, is);

		reset && MAN.clear('dirty', 'valid');

		if (!updates[path])
			updates[path] = COM.get(path);

		for (var i = 0, length = state.length; i < length; i++)
			state[i].state(1, 4);

		// watches
		length = path.length;

		Object.keys(MAN.events).forEach(function(key) {
			if (key === path || key.substring(0, length + 1) === path + '.')
				updates[key] = COM.get(key);
		});

		COM.$emitonly('watch', updates, type, path);
	});

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
		var val = component.get();
		component.setter && component.setter(val, component.path, 1);
		component.setter2 && component.setter(val, component.path, 1);
		component.$interaction(1);
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

		MAN.const_notify[0] = key;
		MAN.const_notify[1] = COM.get(key);
		COM.$emit2('watch', key, MAN.const_notify);
	});

	return COM;
};

COM.extend = function(path, value, type) {
	var val = COM.get(path);
	if (val == null)
		val = {};
	COM.set(path, $.extend(val, value), type);
	return COM;
};

COM.rewrite = function(path, val) {
	$MIDDLEWARE(path, val, 1, function(path, value) {
		MAN.set(path, value, 1);
		COM.$emitwildcard(path, value, 1);
	});
	return COM;
};

// 1 === manually
// 2 === by input
COM.set = function(path, val, type) {
	$MIDDLEWARE(path, val, type, function(path, value) {
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

		MAN.set(path, value, type);

		if (isUpdate)
			return COM.update(path, reset, type);

		// Is changed value by e.g. middleware?
		// If yes the control/input will be redrawn
		var isChanged = val !== value;
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
					$MIDDLEWARE(component.middleware, result, type, function(tmp, value) {
						component.setter(value, path, type);
					});
					component.$interaction(type);
				}
			} else {
				if (component.setter) {
					if (isChanged)
						component.$skip = false;
					$MIDDLEWARE(component.middleware, COM.get(component.path), type, function(tmp, value) {
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

				component.element.find(COMPATTR_B).each(function() {
					this.$value = this.$value2 = undefined;
				});

			} else if (component.validate && !component.$valid_disabled)
				component.valid(component.validate(result), true);

		}, path, true, is);

		reset && MAN.clear('dirty', 'valid');

		for (var i = 0, length = state.length; i < length; i++)
			state[i].state(type, 5);

		COM.$emit('watch', path, undefined, type, is);
	});
	return COM;
};

COM.push = function(path, value, type) {

	var arr = COM.get(path);
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
		COM.set(path, arr, type);
	else if (is)
		COM.update(path, type);

	return COM;
};

COM.get = function(path, scope) {
	return MAN.get(path, scope);
};

COM.remove = function(path) {

	if (path instanceof jQuery) {
		path.find(COMPATTR_C).attr(COMPATTR_R, 'true').each(function() {
			var com = $(this).data(COMPATTR_C);
			if (com) {
				if (com instanceof Array) {
					com.forEach(function(o) {
						o.$removed = true;
					});
				} else
					com.$removed = true;
			}
		});

		COMPATTR(path, 'template') && path.attr(COMPATTR_R, 'true');

		var com = path.data(COMPATTR_C);
		if (com) {
			if (com instanceof Array) {
				com.forEach(function(o) {
					o.$removed = true;
				});
			} else
				com.$removed = true;
		}

		clearTimeout(MAN.tic);
		MAN.tic = setTimeout(function() {
			MAN.cleaner();
		}, 100);
		return COM;
	}

	MAN.clear();
	COM.each(function(obj) {
		obj.remove(true);
	}, path);

	clearTimeout(MAN.tic);
	MAN.tic = setTimeout(function() {
		MAN.cleaner();
	}, 100);
	return COM;
};

COM.schema = function(name, declaration) {

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
		var d = PARSE(declaration, COM.defaults.jsondate);
		MAN.schemas[name] = d;
		return d;
	}
};

COM.validate = function(path, except) {

	var arr = [];
	var valid = true;

	COM.each(function(obj) {

		if (obj.disabled || (except && except.indexOf(obj.path) !== -1))
			return;

		obj.state && arr.push(obj);

		if (obj.$valid_disabled)
			return;

		obj.$validate = true;

		if (obj.validate) {
			obj.$valid = obj.validate(MAN.get(obj.path));
			obj.$interaction(102);
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

COM.disabled = COM.disable = function(path, except) {
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

	if (item > now)
		return true;

	var local = COM.defaults.localstorage && timeout > 10000;
	MAN.cacheblocked[key] = now + timeout;

	try {
		local && localStorage.setItem(COM.$localstorage + '.blocked', JSON.stringify(MAN.cacheblocked));
	} catch (e) {
		// private mode
	}

	callback && callback();
	return false;
};

// who:
// 1. valid
// 2. dirty
// 3. reset
// 4. update
// 5. set
COM.state = function(arr, type, who) {
	if (!arr || !arr.length)
		return;
	setTimeout(function() {
		for (var i = 0, length = arr.length; i < length; i++)
			arr[i].state(type, who);
	}, 2);
	return COM;
};

COM.broadcast = function(selector, name, caller) {
	return BROADCAST(selector, name, caller);
};

COM.default = function(path, timeout, onlyComponent, reset) {

	if (timeout > 0) {
		setTimeout(function() {
			COM.default(path, 0, onlyComponent, reset);
		}, timeout);
		return COM;
	}

	if (typeof(onlyComponent) === 'boolean') {
		reset = onlyComponent;
		onlyComponent = null;
	}

	if (reset === undefined)
		reset = true;

	// Reset scope
	var key = path.replace(/\.\*$/, '');
	var fn = MAN.defaults['#' + HASH(key)];
	var tmp;

	if (fn) {
		tmp = fn();
		MAN.set(key, tmp);
		COM.$emitwildcard(key, tmp, 3);
	}

	var arr = [];

	COM.each(function(obj) {

		if (obj.disabled)
			return;

		if (obj.state)
			arr.push(obj);

		if (onlyComponent && onlyComponent._id !== obj._id)
			return;

		obj.$default && obj.path && obj.set(obj.path, obj.$default(), 3);

		if (!reset)
			return;

		obj.element.find(COMPATTR_B).each(function() {
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

	COM.$emit('default', path);

	if (!reset)
		return COM;

	MAN.clear('valid', 'dirty');
	COM.state(arr, 3, 3);
	COM.$emit('reset', path);
	return COM;
};

COM.reset = function(path, timeout, onlyComponent) {

	if (timeout > 0) {
		setTimeout(function() {
			COM.reset(path);
		}, timeout);
		return COM;
	}

	var arr = [];

	COM.each(function(obj) {

		if (obj.disabled)
			return;

		obj.state && arr.push(obj);

		if (onlyComponent && onlyComponent._id !== obj._id)
			return;

		obj.element.find(COMPATTR_B).each(function() {
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

	MAN.clear('valid', 'dirty');
	COM.state(arr, 1, 3);
	COM.$emit('reset', path);
	return COM;
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

		if (isCallback)
			return callback(component);

		if (!isMany) {
			com = component;
			return true; // stop
		}

		com.push(component);
	}, path);

	return isCallback ? COM : com;
};

COM.findByName = function(name, path, callback) {
	return COM.findByProperty('name', name, path, callback);
};

COM.findById = function(id, path, callback) {
	return COM.findByProperty('id', id, path, callback);
};

COM.findByProperty = function(prop, value, path, callback) {

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

	return isCallback ? COM : com;
};

COM.each = function(fn, path, watch, fix) {
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

	for (var i = 0, length = MAN.components.length; i < length; i++) {
		var component = MAN.components[i];

		if (!component || component.$removed || (fix && component.path !== path))
			continue;

		if (path) {
			if (!component.path)
				continue;
			if (isAsterix) {
				var a = $jc_compare($path, component.$$path, 0, path, component.path, is);
				if (!a)
					continue;
			} else {
				if (path !== component.path) {
					if (watch) {
						var a = $jc_compare($path, component.$$path, 2, path, component.path || '', is);
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

function $jc_compare(a, b, type, ak, bk, isarray) {

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
			if (isarray) {
				if (a[i] !== b[i].raw) {
					MAN.temp[key] = false;
					return false;
				}
			} else {
				if (a[i] !== b[i].path) {
					MAN.temp[key] = false;
					return false;
				}
			}
		}

		MAN.temp[key] = true;
		return true;
	}

	if (type === 1) {
		if (a.length !== b.length)
			return false;
		for (var i = 0, length = b.length; i < length; i++) {
			if (a[i] !== b[i].raw) {
				MAN.temp[key] = false;
				return false;
			}
		}
		MAN.temp[key] = true;
		return true;
	}

	if (type === 2) {
		for (var i = 0, length = a.length; i < length; i++) {
			if (b[i] === undefined)
				continue;
			if (a[i] !== b[i].raw) {
				MAN.temp[key] = false;
				return false;
			}
		}
		MAN.temp[key] = true;
		return true;
	}
}

function COMUSAGE() {
	this.init = 0;
	this.manually = 0;
	this.input = 0;
	this.default = 0;
	this.custom = 0;
	this.dirty = 0;
	this.valid = 0;
}

COMUSAGE.prototype.compare = function(type, dt) {
	if (typeof(dt) === 'string' && dt.substring(0, 1) !== '-')
		dt = DATETIME.add('-' + dt);
	var val = this[type];
	return val === 0 ? false : val < dt.getTime();
};

COMUSAGE.prototype.convert = function(type) {

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

function COMP(name) {

	this._id = 'component' + (MAN.counter++);
	this.usage = new COMUSAGE();
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
	this.caller;

	this.make;
	this.done;
	this.prerender;
	this.destroy;
	this.state;
	this.dependencies;
	this.validate;
	this.released;

	this.release = function(value) {

		var self = this;
		if (value === undefined || self.$removed)
			return self.$released;

		self.element.find(COMPATTR_C).each(function() {
			var el = $(this);
			el.attr('data-jc-released', value ? 'true' : 'false');
			var com = el.data(COMPATTR_C);
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
			COM.validate(this.path);
			return this;
		}

		if (this.trim && typeof(value) === 'string')
			value = value.trim();

		if (value === this.get()) {
			dirty && COM.validate(this.path);
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

		var selector = self.$input === true ? this.element : this.element.find(COMPATTR_B);
		var a = 'select-one';

		value = self.formatter(value);
		selector.each(function() {

			var path = this.$jc.path;
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
				MAN.autofill.push(this.$jc);

			if (this.type === a || this.type === 'select') {
				var el = $(this);
				el.val() !== value && el.val(value);
			} else
				this.value !== value && (this.value = value);
		});
	};
}

COMP.prototype.controller = function() {
	return CONTROLLER(this.$controller);
};

COMP.prototype.replace = function(el) {
	this.element = $(el);
	this.element.get(0).$jc = true;
	return this;
};

COMP.prototype.compile = function(container) {
	COM.compile(container || this.element);
	return this;
};

COMP.prototype.nested = function() {
	var arr = [];
	this.find(COMPATTR_C).each(function() {
		var el = $(this);
		var com = el.data(COMPATTR_C);
		if (com && !el.attr(COMPATTR_R)) {
			if (com instanceof Array)
				arr.push.apply(arr, com);
			else
				arr.push(com);
		}
	});
	return arr;
};

COMP.prototype.$interaction = function(type) {
	// type === 0 : init
	// type === 1 : manually
	// type === 2 : by input
	// type === 3 : by default
	// type === 100 : custom
	// type === 101 : dirty
	// type === 102 : valid
	var now = Date.now();

	switch (type) {
		case 0:
			this.usage.init = now;
			this.$binded = true;
			break;
		case 1:
			this.usage.manually = now;
			this.$binded = true;
			break;
		case 2:
			this.usage.input = now;
			this.$binded = true;
			break;
		case 3:
			this.usage.default = now;
			this.$binded = true;
			break;
		case 100:
			this.usage.custom = now;
			break;
		case 101:
			this.usage.dirty = now;
			break;
		case 102:
			this.usage.valid = now;
			break;
	}

	return this;
};

COMP.prototype.notify = function() {
	NOTIFY(this.path);
	return this;
};

COMP.prototype.update = COMP.prototype.refresh = function(notify) {
	var self = this;
	if (notify)
		self.set(self.get());
	else {
		self.setter && self.setter(self.get(), self.path, 1);
		self.$interaction(1);
	}
	return self;
};

COMP.prototype.classes = function(cls) {

	var key = 'cls.' + cls;
	var tmp = MAN.temp[key];
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

	MAN.temp[key] = { add: add, rem: rem };
	return this;
};

COMP.prototype.toggle = function(cls, visible, timeout) {

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

COMP.prototype.noscope = function(value) {
	this.$noscope = value === undefined ? true : value === true;
	return this;
};

COMP.prototype.singleton = function() {
	var self = this;
	MAN.initializers['$ST_' + self.name] = true;
	return self;
};

COMP.prototype.blind = function() {
	var self = this;
	self.path = null;
	self.$path = null;
	self.$$path = null;
	return self;
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

COMP.prototype.broadcast = function(selector, name) {

	if (name === undefined) {
		name = selector;
		selector = this.dependencies;
		if (!selector || !selector.length)
			selector = this;
	} else if (selector === '*')
		selector = this;

	return BROADCAST(selector, name, this);
};

COMP.prototype.noValid = COMP.prototype.noValidate = function(val) {
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
	!init && MAN.isReady && MAN.refresh();
	return this;
};

COMP.prototype.attr = function(name, value) {
	var el = this.element;
	if (value === undefined)
		return el.attr(name);
	el.attr(name, value);
	return this;
};

COMP.prototype.css = function(name, value) {
	var el = this.element;
	if (value === undefined)
		return el.css(name);
	el.css(name, value);
	return this;
};

COMP.prototype.html = function(value) {
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

COMP.prototype.empty = function() {
	var el = this.element;
	el.empty();
	return el;
};

COMP.prototype.append = function(value) {
	var el = this.element;
	if (value instanceof Array)
		value = value.join('');
	return value ? el.append(value) : el;
};

COMP.prototype.event = function() {
	this.element.on.apply(this.element, arguments);
	return this;
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
	init && fn.call(self, path, self.get(path), 0);
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
	this.$interaction(102);
	MAN.clear('valid');
	!noEmit && this.state && this.state(1, 1);
	return this;
};

COMP.prototype.style = function(value) {
	STYLE(value);
	return this;
};

COMP.prototype.change = function(value) {
	COM.change(this.path, value === undefined ? true : value, this);
	return this;
};

COMP.prototype.used = function() {
	return this.$interaction(100);
};

COMP.prototype.dirty = function(value, noEmit) {

	if (value === undefined)
		return this.$dirty;

	if (this.$dirty_disabled)
		return this;

	this.$dirty = value;
	this.$interaction(101);
	MAN.clear('dirty');
	!noEmit && this.state && this.state(2, 2);
	return this;
};

COMP.prototype.reset = function() {
	COM.reset(this.path, 0, this);
	return this;
};

COMP.prototype.setDefault = function(value) {
	this.$default = function() {
		return value;
	};
	return this;
};

COMP.prototype.default = function(reset) {
	COM.default(this.path, 0, this, reset);
	return this;
};

COMP.prototype.remove = function(noClear) {

	this.element.removeData(COMPATTR_C);
	this.element.find(COMPATTR_C).attr(COMPATTR_R, 'true');
	this.element.attr(COMPATTR_R, 'true');

	!noClear && MAN.clear();

	COM.$removed = true;

	if (noClear)
		return true;

	clearTimeout(MAN.tic);
	MAN.tic = setTimeout(function() {
		MAN.cleaner();
	}, 100);
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
	init && fn.call(COM, path, MAN.get(path));
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
	return COM;
};

COMP.prototype.evaluate = function(path, expression, nopath) {

	if (!expression) {
		expression = path;
		path = this.path;
	}

	return COM.evaluate(path, expression, nopath);
};

COMP.prototype.get = function(path) {
	if (!path)
		path = this.path;
	if (path)
		return MAN.get(path);
};

COMP.prototype.set = function(path, value, type) {

	var self = this;

	if (value === undefined) {
		value = path;
		path = this.path;
	}

	path && COM.set(path, value, type);
	return self;
};

COMP.prototype.inc = function(path, value, type) {

	var self = this;

	if (value === undefined) {
		value = path;
		path = this.path;
	}

	path && COM.inc(path, value, type);
	return self;
};

COMP.prototype.extend = function(path, value, type) {

	var self = this;

	if (value === undefined) {
		value = path;
		path = this.path;
	}

	path && COM.extend(path, value, type);
	return self;
};

COMP.prototype.push = function(path, value, type) {
	var self = this;

	if (value === undefined) {
		value = path;
		path = this.path;
	}

	path && COM.push(path, value, type, self);
	return self;
};

window.COMPONENT_EXTEND = function(type, declaration) {
	if (!MAN.extends[type])
		MAN.extends[type] = [];
	MAN.extends[type].push(declaration);
	MAN.components.forEach(function(m) {
		if (!m.$removed || type === m.name)
			declaration.apply(m, m);
	});
};

window.COMPONENT = function(type, declaration) {

	var shared = {};

	var fn = function(el) {
		var obj = new COMP(type);
		obj.global = shared;
		obj.element = el;
		obj.setPath(COMPATTR(el, 'path') || obj._id, true);
		declaration.call(obj);
		return obj;
	};

	MAN.register[type] && window.console && window.console.warn('jComponent: Overwriting component:', type);
	MAN.register[type] = fn;
};

function $jc_async(arr, fn, done) {

	var item = arr.shift();
	if (item == null)
		return done && done();

	fn(item, function() {
		$jc_async(arr, fn, done);
	});
}

function CMAN() {
	this.kkcounter = 0;
	this.kkinterval = setInterval(function() {
		window.DATETIME = new Date();
		var c = MAN.components;
		for (var i = 0, length = c.length; i < length; i++)
			c[i].knockknock && c[i].knockknock(MAN.kkcounter);
		EMIT('knockknock', MAN.kkcounter++);
	}, 60000);
	this.autofill = [];
	this.const_emit2 = [null, null, null];
	this.const_notify = [null, null];
	this.counter = 1;
	this.mcounter = 1;
	this.tic;
	this.tis;
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
	this.imports = {};
	this.styles = [];
	this.operations = {};
	this.controllers = {};
	this.initializers = {};
	this.warning = {};
	this.waits = {};
	this.defaults = {};
	this.middleware = {};
	this.others = {};
	this.schedulers = [];
	this.singletons = {};
	this.extends = {};
	this.ajax = {};
	this.regexpcom = /(data-jc|data-component)\=/;
	this.jsonconverter = {
		'text json': function (text) {
			return PARSE(text);
		}
	};
	// this.mediaquery;
}

MAN.cacherest = function(method, url, params, value, expire) {

	if (params && !params.version && COM.$version)
		params.version = COM.$version;

	if (params && !params.language && COM.$language)
		params.language = COM.$language;

	params = STRINGIFY(params);
	var key = HASH(method + '#' + url.replace(/\//g, '') + params).toString();
	return this.cachestorage(key, value, expire);
};

MAN.cachestorage = function(key, value, expire) {

	var now = Date.now();

	if (value !== undefined) {

		if (expire === 'session') {
			MAN.cache['$session' + key] = value;
			return value;
		}

		if (typeof(expire) === 'string')
			expire = expire.parseExpire();

		this.storage[key] = { expire: now + expire, value: value };
		$jc_save();
		return value;
	}

	var item = MAN.cache['$session' + key];
	if (item)
		return item;

	item = this.storage[key];
	if (item && item.expire > now)
		return item.value;
};

MAN.initialize = function() {
	var item = this.init.pop();
	if (item === undefined)
		!MAN.isReady && COM.compile();
	else {
		!item.$removed && this.prepare(item);
		this.initialize();
	}
	return this;
};

MAN.remap = function(path, value) {
	$MIDDLEWARE(path, value, 1, function(path, value) {
		var index = path.replace('-->', '->').indexOf('->');
		if (index === -1)
			return COM.set(path, value);
		var o = path.substring(0, index).trim();
		var n = path.substring(index + 2).trim();
		COM.set(n, value[o]);
	});
	return this;
};

MAN.importstyles = function(str, id) {
	return str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, function(text) {
		text = text.replace('<style>', '<style type="text/css">');
		id && (text = text.replace('<style', '<style ' + id));
		$(text).appendTo('head');
		return '';
	});
};

MAN.removescripts = function(str) {
	return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, function(text) {
		var index = text.indexOf('>');
		var scr = text.substring(0, index + 1);
		return scr.substring(0, 6) === '<style' || scr === '<script>' || scr.indexOf('/javascript"') !== -1 ? '' : text;
	});
};

MAN.prepare = function(obj) {

	if (!obj)
		return this;

	var value = obj.get();
	var el = obj.element;
	var tmp;

	MAN.extends[obj.name] && MAN.extends[obj.name].forEach(function(fn) {
		fn.call(obj, obj);
	});

	if (obj.setter) {
		if (!obj.$prepared) {

			obj.$prepared = true;
			obj.$ready = true;

			tmp = COMPATTR(obj, 'value');
			if (tmp) {
				if (!MAN.defaults[tmp])
					MAN.defaults[tmp] = new Function('return ' + tmp);
				obj.$default = MAN.defaults[tmp];
				if (value === undefined) {
					value = obj.$default();
					MAN.set(obj.path, value);
					COM.$emitwildcard(obj.path, value, 0);
				}
			}

			if (!obj.$binded) {
				obj.$binded = true;
				$MIDDLEWARE(obj.middleware, value, 1, function(path, value) {
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
		if (MAN.isOperation(obj.$init)) {
			var op = OPERATION(obj.$init);
			op && op.call(obj, obj);
			obj.$init = undefined;
			return;
		}
		var fn = COM.get(obj.$init);
		typeof(fn) === 'function' && fn.call(obj, obj);
		obj.$init = undefined;
	}, 5);

	el.trigger('component');
	el.off('component');

	var cls = COMPATTR(el, 'class');
	cls && (function(cls) {
		setTimeout(function() {
			cls = cls.split(' ');
			for (var i = 0, length = cls.length; i < length; i++)
				el.toggleClass(cls[i]);
		}, 5);
	})(cls)

	obj.id && EMIT('#' + obj.id, obj);
	EMIT('@' + obj.name, obj);
	EMIT('component', obj);
	return this;
};

MAN.next = function() {
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
MAN.clear = function() {

	var self = this;

	if (!arguments.length) {
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

MAN.isArray = function(path) {
	var index = path.lastIndexOf('[');
	if (index === -1)
		return false;
	path = path.substring(index + 1, path.length - 1).substring(0, 1);
	return !(path === '"' || path === '\'');
};

MAN.isOperation = function(name) {
	return name.charCodeAt(0) === 35;
};
/**
 * Get value from a model
 * @param {String} path
 * @return {Object}
 */
MAN.get = function(path, scope) {

	if (path.charCodeAt(0) === 35) {
		var op = OPERATION(path);
		return op ? op : NOOP;
	}

	var cachekey = '=' + path;
	var self = this;
	if (self.temp[cachekey])
		return self.temp[cachekey](scope || window);

	// @TODO: Exception?
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
	self.temp[cachekey] = fn;
	return fn(scope || window);
};

/**
 * Set value to a model
 * @param {String} path
 * @param {Object} value
 */
MAN.set = function(path, value) {

	if (path.charCodeAt(0) === 35) {
		var op = OPERATION(path);
		if (op)
			op(value, path);
		else if (window.console) {
			!MAN.warning[path] && window.console.warn('jComponent: The operation ' + path + ' not found.');
			MAN.warning[path] = true;
		}
		return self;
	}

	var cachekey = '+' + path;
	var self = this;

	if (self.cache[cachekey])
		return self.cache[cachekey](window, value, path);

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

MAN.refresh = function() {
	var self = this;
	setTimeout2('M$refresh', function() {
		self.components.sort(function(a, b) {
			if (a.$removed || !a.path)
				return 1;
			if (b.$removed || !b.path)
				return -1;
			var al = a.path.length;
			var bl = b.path.length;
			return al > bl ? - 1 : al === bl ? a.path.localeCompare(b.path) : 1;
		});
	}, 200);
	return self;
};

/**
 * Event cleaner
 * @return {CMAN}
 */
MAN.cleaner = function() {

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

				if (item.context == null || (item.context.element && item.context.element.closest(document.documentElement).length))
					continue;

				item.context && item.context.element && item.context.element.remove();
				item.context.$removed = true;
				item.context = null;
				self.events[ak][bk].splice(index - 1, 1);

				if (!self.events[ak][bk].length) {
					delete self.events[ak][bk];
					if (!Object.keys(self.events[ak]).length)
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

		if (component.$removed)
			continue;

		if (component.element && component.element.closest(document.documentElement).length) {
			if (!component.attr(COMPATTR_R)) {
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
		MAN.components.splice(index, 1);
		length = MAN.components.length;
		is = true;
	}

	MAN.clear('find');

	var now = Date.now();
	var is2 = false;
	var is3 = false;

	for (var key in self.cacheblocked) {
		if (self.cacheblocked[key] > now)
			continue;
		delete self.cacheblocked[key];
		is2 = true;
	}

	if (COM.defaults.localstorage && is2) {
		try {
			localStorage.setItem(COM.$localstorage + '.blocked', JSON.stringify(self.cacheblocked));
		} catch(e) {
			// private mode
		}
	}

	for (var key in self.storage) {
		var item = self.storage[key];
		if (!item.expire || item.expire <= now) {
			delete self.storage[key];
			is3 = true;
		}
	}

	is3 && $jc_save();
	is && self.refresh();
	return self;
};

MAN.$$ = function() {
	delete MAN.$load;
	if (COM.defaults.localstorage) {
		var cache;
		try {
			cache = localStorage.getItem(COM.$localstorage + '.cache');
			if (cache && typeof(cache) === 'string')
				MAN.storage = PARSE(cache);
		} catch (e) {}
		try {
			cache = localStorage.getItem(COM.$localstorage + '.blocked');
			if (cache && typeof(cache) === 'string')
				MAN.cacheblocked = PARSE(cache);
		} catch (e) {}
	}

	if (MAN.storage) {
		var obj = MAN.storage['$jcpath'];
		obj && Object.keys(obj.value).forEach(function(key) {
			SET(key, obj.value[key], true);
		});
	}

	window.jQuery && setTimeout(COM.compile, 2);
};

/**
 * Default component
 */
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
		self.element.$jc = self;
	}
});

function $jc_save() {
	try {
		COM.defaults.localstorage && localStorage.setItem(COM.$localstorage + '.cache', JSON.stringify(MAN.storage));
	} catch(e) {
		// private mode
	}
}

window.REWRITE = COM.rewrite;

window.SET = function(path, value, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.set(path, value, timeout);
	if (!timeout || timeout < 5) // TYPE
		return COM.set(path, value, timeout);
	setTimeout(function() {
		COM.set(path, value, reset);
	}, timeout);
	return COM;
};

window.INC = function(path, value, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.inc(path, value, timeout);
	if (!timeout || timeout < 5)
		return COM.inc(path, value, timeout);
	setTimeout(function() {
		COM.inc(path, value, reset);
	}, timeout);
	return COM;
};

window.EXTEND = function(path, value, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.extend(path, value, timeout);
	if (!timeout || timeout < 5)
		return COM.extend(path, value, timeout);
	setTimeout(function() {
		COM.extend(path, value, reset);
	}, timeout);
	return COM;
};

window.PUSH = function(path, value, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.push(path, value, timeout);
	if (!timeout || timeout < 5)
		return COM.push(path, value, timeout);
	setTimeout(function() {
		COM.push(path, value, reset);
	}, timeout);
	return COM;
};

window.INVALID = COM.invalid;
window.RESET = COM.reset;

window.DEFAULT = function(path, timeout, reset) {
	return COM.default(path, timeout, null, reset);
};

window.WATCH = function(path, callback, init) {
	return ON('watch', path, callback, init);
};

window.UPTODATE = function(period, url, callback) {

	if (typeof(url) === 'function') {
		callback = url;
		url = '';
	}

	var dt = new Date().add(period);
	ON('knockknock', function() {
		if (dt > DATETIME)
			return;
		setTimeout(function() {
			if (url)
				window.location.href = url;
			else
				window.location.reload(true);
		}, 5000);
		callback && callback();
	});
};

window.PING = function(url, timeout, callback) {

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
	var uri = $jc_url(url);
	options.type = method;
	options.headers = { 'X-Ping': location.pathname };

	options.success = function(r) {
		if (typeof(callback) === 'string')
			MAN.remap(callback, r);
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

window.CAN = COM.can;
window.DISABLED = COM.disabled;
window.AJAX = COM.AJAX;
window.AJAXCACHE = COM.AJAXCACHE;
window.AJAXCACHEREVIEW = COM.AJAXCACHEREVIEW;
window.GET = COM.get;
window.CACHE = COM.cache;
window.CACHEPATH = COM.cachepath;
window.NOTIFY = COM.notify;
window.NOTMODIFIED = function(path, value, fields) {

	if (value === undefined)
		value = COM.get(path);

	if (value === undefined)
		value = null;

	if (fields)
		path = path.concat('#', fields);

	var hash = HASH(STRINGIFY(value, fields));
	var key = 'notmodified.' + path;
	if (MAN.cache[key] === hash)
		return true;
	MAN.cache[key] = hash;
	return false;
};

window.SCHEDULE = COM.schedule;
window.FIND = function(value, many, noCache, callback) {

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
			callback.call(val ? val : window, val);
		}, 500, noCache);
		return;
	}

	// var path;
	// var index = value.indexOf('[');
	// if (index !== -1) {
	// 	path = value.substring(index + 1, value.length - 1);
	// 	value = value.substring(0, index);
	// }

	var key;
	var output;

	if (!noCache) {
		key = 'find.' + value + '.' + (many ? 0 : 1);
		output = MAN.cache[key];
		if (output)
			return output;
	}

	if (value.charCodeAt(0) === 46) {
		output = COM.findByPath(value.substring(1), many);
		if (!noCache)
			MAN.cache[key] = output;
		return output;
	}

	if (value.charCodeAt(0) === 35) {
		output = COM.findById(value.substring(1), undefined, many);
		if (!noCache)
			MAN.cache[key] = output;
		return output;
	}

	output = COM.findByName(value, undefined, many);
	if (!noCache)
		MAN.cache[key] = output;
	return output;
};

window.BROADCAST = function(selector, name, caller) {

	if (typeof(selector) === 'object') {

		if (selector.element)
			selector = selector.element;
		else
			selector = $(selector);

		var components = [];

		selector.find(COMPATTR_C).each(function() {
			var com = $(this).data(COMPATTR_C);
			if (com) {
				if (com instanceof Array) {
					for (var i = 0, length = com.length; i < length; i++)
						com[i] && typeof(com[i][name]) === 'function' && components.push(com[i]);
				} else if (com && typeof(com[name]) === 'function')
					components.push(com);
			}
		});

		return $BROADCAST_EVAL(components, name, caller);
	}

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
		var com = FIND(item, true, true);
		com && typeof(com[name]) === 'function' && components.push.apply(components, com);
	}

	MAN.cache[key] = components;
	return $BROADCAST_EVAL(components, name, caller);
};

function $BROADCAST_EVAL(components, name, caller) {

	if (!caller)
		caller = null;

	return function() {
		var arg = arguments;
		for (var i = 0, length = components.length; i < length; i++) {
			var component = components[i];
			if (typeof(component[name]) === 'function') {
				component.caller = caller;
				component[name].apply(component[name], arg);
				component.caller = null;
			}
		}
	};
}

window.UPDATE = function(path, timeout, reset) {
	if (typeof(timeout) === 'boolean')
		return COM.update(path, timeout);
	if (!timeout)
		return COM.update(path, reset);
	setTimeout(function() {
		COM.update(path, reset);
	}, timeout);
};

window.CHANGE = COM.change;
window.INJECT = window.IMPORT = COM.import;

window.SCHEMA = function(name, declaration) {
	return COM.schema(name, declaration);
};

window.OPERATION = function(name, fn) {
	if (fn)
		MAN.operations[name] = fn;
	else
		fn = MAN.operations[name.charCodeAt(0) === 35 ? name.substring(1) : name];
	return fn;
};

window.ON = function(name, path, fn, init) {
	return COM.on(name, path, fn, init);
};

window.EMIT = COM.emit;
window.EVALUATE = COM.evaluate;

window.STYLE = function(value) {
	clearTimeout(MAN.tis);
	MAN.styles.push(value instanceof Array ? value.join('\n') : value);
	MAN.tis = setTimeout(function() {
		$('<style type="text/css">' + MAN.styles.join('') + '</style>').appendTo('head');
		MAN.styles = [];
	}, 50);
};

window.BLOCKED = function(name, timeout, callback) {
	return COM.blocked(name, timeout, callback);
};

window.HASH = function(s) {
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

window.GUID = function(size) {
	if (!size)
		size = 10;
	var l = ((size / 24) >> 0) + 1;
	var b = [];
	for (var i = 0; i < l; i++)
		b.push(Math.random().toString(36).substring(2));
	return b.join('').substring(0, size);
};

window.KEYPRESS = function(fn, timeout, key) {
	if (!timeout)
		timeout = 300;
	var str = fn.toString();
	var beg = str.length - 20;
	if (beg < 0)
		beg = 0;
	var tkey = key ? key : HASH(str.substring(0, 20) + 'X' + str.substring(beg)) + '_keypress';
	clearTimeout(MAN.waits[tkey]);
	MAN.waits[tkey] = setTimeout(fn, timeout);
};

window.WAIT = function(fn, callback, interval, timeout) {
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
		var result = MAN.get(fn);
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
		return COM;
	}

	if (tkey) {
		MAN.waits[tkey] = setTimeout(function() {
			clearInterval(MAN.waits[key]);
			delete MAN.waits[tkey];
			delete MAN.waits[key];
			callback(new Error('Timeout.'));
		}, timeout);
	}

	MAN.waits[key] = setInterval(function() {

		if (is) {
			var result = MAN.get(fn);
			if (result == null)
				return;
		} else if (!fn())
			return;

		clearInterval(MAN.waits[key]);
		delete MAN.waits[key];

		if (tkey) {
			clearTimeout(MAN.waits[tkey]);
			delete MAN.waits[tkey];
		}

		callback && callback(null, function(sleep) {
			setTimeout(function() {
				WATCH(fn, callback, interval);
			}, sleep || 1);
		});

	}, interval || 500);

	return COM;
};

window.COMPILE = function(container) {
	return COM.compile(container);
};

window.CONTROLLER = function() {
	var callback = arguments[arguments.length - 1];

	if (typeof(callback) !== 'function')
		return MAN.controllers[arguments[0]];

	var obj = {};
	obj.name = obj.path = arguments[0];
	MAN.controllers[obj.name] = obj;

	obj.get = function(path) {
		return COM.get(obj.path + (path ? '.' + path : ''));
	};

	obj.set = function(path, value, type) {
		if (arguments.length === 1) {
			value = path;
			path = undefined;
		}
		COM.set(obj.path + (path ? '.' + path : ''), value, type);
		return obj;
	};

	obj.destroy = function() {
		obj.element.remove();
		delete MAN.controllers[obj.name];
		setTimeout(function() {
			MAN.cleaner();
		}, 500);
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

MAN.$load = setTimeout(MAN.$$, 2);

// Waits for jQuery
WAIT(function() {
	return window.jQuery ? true : false;
}, function() {

	setInterval(function() {
		MAN.temp = {};
		MAN.cleaner();
	}, (1000 * 60) * 5);

	// scheduler
	MAN.sc = 0;
	setInterval(function() {
		MAN.sc++;
		var now = new Date();
		for (var i = 0, length = MAN.schedulers.length; i < length; i++) {
			var item = MAN.schedulers[i];
			if (item.type === 'm') {
				if (MAN.sc % 30 !== 0)
					continue;
			} else if (item.type === 'h') {
				// 1800 seconds --> 30 minutes
				// 1800 / 2 (seconds) --> 900
				if (MAN.sc % 900 !== 0)
					continue;
			}

			var dt = now.add(item.expire);
			FIND(item.selector, true).forEach(function(component) {
				component && component.usage.compare(item.name, dt) && item.callback(component);
			});
		}
	}, 2000);

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

	$.fn.component = function() {
		return this.data(COMPATTR_C);
	};

	$.fn.components = function(fn) {
		var all = this.find(COMPATTR_C);
		var output;
		all.each(function(index) {
			var com = $(this).data(COMPATTR_C);
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

	$.components = window.COM || window.jC;

	$(document).ready(function() {

		if (MAN.$load) {
			clearTimeout(MAN.$load);
			MAN.$$();
		}

		$(window).on('resize', $MEDIAQUERY);
		$(window).on('orientationchange', $MEDIAQUERY);
		$MEDIAQUERY();

		$(document).on('input change keypress keydown blur', COMPATTR_B, function(e) {

			var self = this;

			// IE 9+ PROBLEM
			if ((e.type === 'input' && self.type !== 'range') || (e.type === 'keypress'))
				return !(self.tagName !== 'TEXTAREA' && e.keyCode === 13);

			var special = self.type === 'checkbox' || self.type === 'radio' || self.type === 'range';// || self.tagName === 'SELECT';
			if ((e.type === 'focusout' && special) || (e.type === 'change' && (!special && self.tagName !== 'SELECT')) || (!self.$jc || self.$jc.$removed || !self.$jc.getter))
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
				$jc_keypress(self, self.$value, e);
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
				self.$jc.dirty(false, true);
				self.$jc.getter(value, 2);
				self.$jc.$skip = false;
				return;
			}

			if (self.tagName === 'SELECT') {
				if (e.type === 'keydown' || self.selectedIndex === -1)
					return;
				var selected = self[self.selectedIndex];
				value = selected.value;
				var dirty = false;
				if (self.$jc.$dirty)
					dirty = true;
				self.$jc.dirty(false, true);
				self.$jc.getter(value, 2, dirty, old, e.type === 'focusout');
				self.$jc.$skip = false;
				return;
			}

			if (self.$delay === undefined)
				self.$delay = parseInt(COMPATTR(self, 'keypress-delay') || '0');

			if (self.$only === undefined)
				self.$only = COMPATTR(self, 'keypress-only') === 'true';

			if ((self.$only && (e.type === 'focusout' || e.type === 'change')) || (e.type === 'keydown' && (e.keyCode === undefined || e.keyCode === 9)))
				return;

			if (e.keyCode < 41 && e.keyCode !== 8 && e.keyCode !== 32) {
				if (e.keyCode !== 13)
					return;
				if (e.tagName !== 'TEXTAREA') {
					self.$value = self.value;
					clearTimeout2('M$timeout');
					$jc_keypress(self, old, e);
					return;
				}
			}

			if (self.$nokeypress === undefined) {
				var v = COMPATTR(self, 'keypress');
				if (v)
					self.$nokeypress = v === 'false';
				else
					self.$nokeypress = COM.defaults.keypress === false;
			}

			var delay = self.$delay;
			if (self.$nokeypress) {
				if (e.type === 'keydown' || e.type === 'focusout')
					return;
				if (!delay)
					delay = 1;
			} else if (!delay)
				delay = COM.defaults.delay;

			if (e.type === 'focusout')
				delay = 0;

			setTimeout2('M$timeout', function() {
				$jc_keypress(self, old, e);
			}, delay);
		});

		setTimeout(COM.compile, 2);
	});
}, 100);

function $jc_keypress(self, old, e) {

	if (self.value === old)
		return;

	clearTimeout2('M$timeout');

	if (self.value !== self.$value2) {
		var dirty = false;

		if (e.keyCode !== 9) {
			if (self.$jc.$dirty)
				dirty = true;
			self.$jc.dirty(false, true);
		}

		self.$jc.getter(self.value, 2, dirty, old, e.type === 'focusout' || e.keyCode === 13);
		if (self.nodeName === 'INPUT' || self.nodeName === 'TEXTAREA') {
			var val = self.$jc.formatter(self.value);
			if (self.value !== val) {
				var pos = $jc_getcursor(self);
				self.value = val;
				$jc_setcursor(self, pos);
			}
		}
		self.$value2 = self.value;
	}

	setTimeout2('$jckp' + self.$jc.id, function() {
		self.$value2 = self.$value = undefined;
	}, 60000 * 5);
}

function $jc_setcursor(el, pos) {
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

function $jc_getcursor(el) {
	if (document.selection) {
		var sel = document.selection.createRange();
		sel.moveStart('character', -el.value.length);
		return sel.text.length;
	} else if (el.selectionStart || !el.selectionStart)
		return el.selectionStart;
	return 0;
}

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
				return key === 'ww' ? tmp.toString().padLeft(2, '0') : tmp;
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
	var isPercentage = false;
	var num;

	if (value[length - 1] === '%') {
		value = value.substring(0, length - 1);
		isPercentage = true;

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

	var def = new Date();

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
			case '&': return '&amp;'
			case '<': return '&lt;'
			case '>': return '&gt;'
			case '"': return '&quot;'
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

window.WIDTH = function(el) {
	if (!el)
		el = $(window);
	var w = el.width();
	var d = COM.defaults.devices;
	return w >= d.md.min && w <= d.md.max ? 'md' : w >= d.sm.min && w <= d.sm.max ? 'sm' : w > d.lg.min ? 'lg' : w <= d.xs.max ? 'xs' : '';
};

window.WORKFLOW = function(name, fn) {

	if (!fn) {
		if (!MAN.workflows)
			return NOOP;
		var w = MAN.workflows[name];
		if (!(w instanceof Array))
			return NOOP;
		return function() {
			for (var i = 0, length = w.length; i < length; i++)
				w[i].apply(this, arguments);
		};
	}

	if (!MAN.workflows)
		MAN.workflows = {};

	var w = MAN.workflows[name];
	if (w)
		w.push(fn);
	else
		MAN.workflows[name] = [fn];
};

window.MEDIAQUERY = function(query, element, fn) {

	if (typeof(query) === 'number') {
		MAN.mediaquery.remove('id', query);
		return true;
	}

	if (typeof(element) === 'function') {
		fn = element;
		element = null;
	}

	if (!MAN.mediaquery)
		MAN.mediaquery = [];

	query = query.toLowerCase();
	var type;

	if (query.indexOf(',') !== -1) {
		var ids = [];
		query.split(',').forEach(function(q) {
			q = q.trim();
			q && ids.push(window.MEDIAQUERY(q, element, fn));
		});
		return ids;
	}

	var d = COM.defaults.devices;

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
				case 'width':
					obj.maxW = num(item);
					break;
				case 'min-height':
				case 'min-device-height':
				case 'height':
					obj.minH = num(item);
					break;
				case 'max-height':
				case 'max-device-height':
				case 'height':
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

	obj.id = MAN.mcounter++;
	obj.fn = fn;
	obj.type = type;

	if (element)
		obj.element = element;

	MAN.mediaquery.push(obj);
	return obj.id;
}

function COMPATTR(el, name) {
	name = name ? '-' + name : '';
	return el.getAttribute ? el.getAttribute('data-jc' + name) || el.getAttribute('data-component' + name) : el.attr('data-jc' + name) || el.attr('data-component' + name);
}

function $MEDIAQUERY() {

	if (!MAN.mediaquery || !MAN.mediaquery.length)
		return;

	var orientation = window.orientation ? Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait' : '';

	var $w = $(window);
	var w = $w.width();
	var h = $w.height();
	var d = COM.defaults.devices;

	for (var i = 0, length = MAN.mediaquery.length; i < length; i++) {
		var mq = MAN.mediaquery[i];
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

function $MIDDLEWARE(path, value, type, callback) {

	var index = path.indexOf(' #');

	if (index === -1) {
		callback(path, value);
		return path;
	}

	var a = path.substring(0, index);
	if (value === undefined)
		value = COM.get(a);

	MIDDLEWARE(path.substring(index + 1).trim().replace(/\#/g, '').split(' '), value, function(value) {
		callback(a, value);
	}, a);

	return a;
}

window.UPLOAD = function(url, data, callback, timeout, progress, error) {
	return COM.UPLOAD(url, data, callback, timeout, progress, error);
};

window.MIDDLEWARE = function(name, value, callback, path) {

	if (!(name instanceof Array)) {
		MAN.middleware[name] = value;
		return;
	}

	if (typeof(callback) !== 'function') {
		var tmp = callback;
		callback = value;
		value = tmp;
	}

	var context = {};
	name.waitFor(function(name, next) {
		var mid = MAN.middleware[name];

		if (mid) {
			mid.call(context, next, value, path);
			return;
		}

		!MAN.warning[name] && window.console && window.console.warn('jComponent: Middleware "' + name + '" not found.');
		MAN.warning[name] = true;

		next();
	}, function(val) {
		callback && callback.call(context, val !== undefined ? val : value, path);
	});
};

window.FN = function(exp) {
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

window.SETTER = function(selector, name) {

	var w = window;
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

	return w.SETTER;
};

window.EXEC = function(path) {
	var w = window;
	var arg = [];

	for (var i = 1; i < arguments.length; i++)
		arg.push(arguments[i]);

	// OPERATION
	var c = path.charCodeAt(0);
	if (c === 35) {
		OPERATION(path).apply(w, arg);
		return EXEC;
	}

	var index = path.indexOf('/');
	if (index !== -1) {
		var ctrl = CONTROLLER(path.substring(0, index));
		var fn = path.substring(index + 1);
		ctrl && typeof(ctrl[fn]) === 'function' && ctrl[fn].apply(ctrl, arg);
		return w.EXEC;
	}

	var fn = GET(path);
	typeof(fn) === 'function' && fn.apply(w, arg);
	return w.EXEC;
};

window.MAKE = function(obj, fn, update) {

	switch (typeof(obj)) {
		case 'function':
			fn = obj;
			obj = {};
			break;
		case 'string':
			var p = obj;
			var is = true;
			obj = GET(p);
			if (obj == null) {
				is = false;
				obj = {};
			}
			fn.call(obj, obj, p);
			if (is && (update === undefined || update === true))
				UPDATE(p, true);
			else {
				if (MAN.isReady)
					SET(p, obj, true);
				else
					MAN.set(p, obj);
			}
			return obj;
	}

	fn.call(obj, obj, '');
	return obj;
};

window.CLONE = function(obj) {

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

window.STRINGIFY = function(obj, compress) {
	compress === undefined && (compress = COM.defaults.jsoncompress);
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

window.PARSE = function(value, date) {
	date === undefined && (date = COM.defaults.jsondate);
	try {
		return JSON.parse(value, function(key, value) {
			return typeof(value) === 'string' && date && value.isJSONDate() ? new Date(value) : value;
		});
	} catch (e) {
		return null;
	}
};

window.NOOP = function(){};
window.DATETIME = new Date();