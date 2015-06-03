var $cmanager = new ComponentManager();
var COM_DATA_BIND_SELECTOR = 'input[data-component-bind],textarea[data-component-bind],select[data-component-bind]';
var COM_ATTR = '[data-component]';
var COM_ATTR_U = 'data-component-url';
var COM_ATTR_URL = '[' + COM_ATTR_U + ']';
var COM_ATTR_B = 'data-component-bind';
var COM_ATTR_P = 'data-component-path';
var COM_ATTR_T = 'data-component-template';
var COM_ATTR_I = 'data-component-init';
var COM_ATTR_C = 'data-component-class';

$.fn.component = function() {
    return this.data(COM_ATTR);
};

$.components = function(container) {
    if ($cmanager.isCompiling)
        return $.components;
    return $.components.compile(container);
};

$.components.evaluate = function(path, expression) {
    var key = 'eval' + expression;
    var exp = $cmanager.cache[key];
    var val = $.components.get(path);

    if ($.components.debug)
        console.log('%c$.components.evaluate(' + path + ')', 'color:gray');

    if (exp !== undefined)
        return exp.call(val, val, path);
    if (expression.indexOf('return') === -1)
        expression = 'return ' + expression;
    exp = new Function('value', 'path', expression);
    $cmanager.cache[key] = exp;
    return exp.call(val, val, path);
};

$.components.defaults = {}
$.components.defaults.delay = 300;
$.components.defaults.keypress = true;
$.components.defaults.timeout = 15;
$.components.debug = false;
$.components.version = 'v1.8.0';
$.components.$version = '';
$.components.$language = '';
$.components.$formatter = [];
$.components.$parser = [];

$.components.compile = function(container) {

    $cmanager.isCompiling = true;
    $.components.$inject();

    if ($cmanager.pending.length > 0) {
        $cmanager.pending.push(function() {
            $.components.compile(container);
        });
        return $.components;
    }

    var els = container ? container.find(COM_ATTR) : $(COM_ATTR);
    var skip = false;

    els.each(function() {

        if (skip)
            return;

        var el = $(this);
        var name = el.attr('data-component');

        if (el.data(COM_ATTR))
            return;

        var component = $cmanager.register[name || ''];
        if (!component)
            return;

        var obj = component(el);

        obj.$init = el.attr(COM_ATTR_I) || null;
        obj.type = el.attr('data-component-type') || '';

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
        $.components.compile();
        return;
    }

    if (container !== undefined) {
        $cmanager.next();
        return;
    }

    if ($cmanager.toggle.length === 0) {
        $cmanager.next();
        return;
    }

    component_async($cmanager.toggle, function(item, next) {
        for (var i = 0, length = item.toggle.length; i < length; i++)
            item.element.toggleClass(item.toggle[i]);
        next();
    }, function() {
        $cmanager.next();
    });
};

$.components.$inject = function() {

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
                $cmanager.toggle.push(item);

            if (item.cb && !item.element.attr('data-component')) {
                var cb = $cmanager.get(item.cb);
                if (typeof(cb) === 'function')
                    cb(item.element);
            }

            count++;
            next();
        });

    }, function() {
        $cmanager.clear('valid', 'dirty');
        if (count === 0)
            return;
        $.components.compile();
    });
};

$.components.inject = function(url, target, callback) {

    if (typeof(target) === 'function') {
        timeout = callback;
        callback = target;
        target = 'body';
    }

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

    if (target === 'body') {
        var random = Math.floor(Math.random() * 100000);
        var id = 'data-component-injector="' + random +'"';
        $(target).append('<div ' + id + '></div>');
        target = $(target).find('> div[' + id + ']');
    }

    $(target).load($components_url(url), function() {
        $.components.compile();
        if (callback)
            callback();
    });

    return $.components;
};

$.components.parseQuery = function(value) {

    if (!value)
        value = window.location.search;

    if (value.substring(0, 1) === '?')
        value = value.substring(1);

    var arr = value.split('&');
    var obj = {};
    for (var i = 0, length = arr.length; i < length; i++) {
        var sub = arr[i].split('=');
        var key = sub[0];
        var val = decodeURIComponent(sub[1] || '');

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

$.components.POST = function(url, data, callback, timeout, error) {

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

        if ($.components.debug)
            console.log('%c$.components.POST(' + url + ')', 'color:magenta');

        $.ajax($components_url(url), { type: 'POST', data: JSON.stringify(data), success: function(r) {
            if (typeof(callback) === 'string')
                return $cmanager.remap(callback, r);
            if (callback)
                callback(r);
        }, error: function(req, status, r) {
            $.components.emit('error', r, req.status, url);
            if (typeof(error) === 'string')
                return $cmanager.remap(error, r);
            if (error)
                error(r, req.status, status);
        }, contentType: 'application/json' });
    }, timeout || 0);
    return $.components;
};

$.components.PUT = function(url, data, callback, timeout, error) {

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

        if ($.components.debug)
            console.log('%c$.components.PUT(' + url + ')', 'color:magenta');

        $.ajax($components_url(url), { type: 'PUT', data: JSON.stringify(data), success: function(r) {
            if (typeof(callback) === 'string')
                return $cmanager.remap(callback, r);
            if (callback)
                callback(r);
        }, error: function(req, status, r) {
            $.components.emit('error', r, req.status, url);
            if (typeof(error) === 'string')
                return $cmanager.remap(error, r);
            if (error)
                error(r, req.status, status);
        }, contentType: 'application/json' });
    }, timeout || 0);
    return $.components;
};

$.components.GET = function(url, data, callback, timeout, error) {

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

        if ($.components.debug)
            console.log('%c$.components.GET(' + url + ')', 'color:magenta');

        $.ajax($components_url(url), { type: 'GET', data: data, success: function(r) {
            if (typeof(callback) === 'string')
                return $cmanager.remap(callback, r);
            if (callback)
                callback(r);
        }, error: function(req, status, r) {
            $.components.emit('error', r, req.status, url);
            if (typeof(error) === 'string')
                return $cmanager.remap(error, r);
            if (error)
                error(r, req.status, status);
        }});
    }, timeout || 0);
    return $.components;
};

$.components.DELETE = function(url, data, callback, timeout, error) {

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

        if ($.components.debug)
            console.log('%c$.components.DELETE(' + url + ')', 'color:magenta');

        $.ajax($components_url(url), { type: 'DELETE', data: JSON.stringify(data), success: function(r) {
            if (typeof(callback) === 'string')
                return $cmanager.remap(callback, r);
            if (callback)
                callback(r);
        }, error: function(req, status, r) {
            $.components.emit('error', r, req.status, url);
            if (typeof(error) === 'string')
                return $cmanager.remap(error, r);
            if (error)
                error(r, req.status, status);
            else
                throw new Error(r);
        }, contentType: 'application/json' });
    }, timeout || 0);
    return $.components;
};

$.components.GETCACHE = function(url, data, callback, expire, timeout) {
    var value = $cmanager.restcache('GET', url, data);

    if (value !== undefined) {
        if (typeof(callback) === 'string')
            $cmanager.remap(callback, value);
        else
            callback(value);
        return $.components;
    }

    $.components.GET(url, data, function(r) {
        $cmanager.restcache('GET', url, data, r);
        if (typeof(callback) === 'string')
            $cmanager.remap(callback, r);
        else
            callback(r);
    }, timeout);

    if (!expire)
        return $.components;

    setTimeout(function() {
        $.components.DELETECACHE('GET', url, data);
    }, expire);

    return $.components;
};

$.components.POSTCACHE = function(url, data, callback, expire) {
    var value = $cmanager.restcache('POST', url, data);

    if (value !== undefined) {
        if (typeof(callback) === 'string')
            $cmanager.remap(callback, value);
        else
            callback(value);
        return $.components;
    }

    $.components.POST(url, data, function(r) {
        $cmanager.restcache('POST', url, data, r);
        if (typeof(callback) === 'string')
            $cmanager.remap(callback, r);
        else
            callback(r);
    }, timeout);

    if (!expire)
        return $.components;

    setTimeout(function() {
        $.components.DELETECACHE('POST', url, data);
    }, expire);

    return $.components;
};

$.components.DELETECACHE = function(method, url, data) {
    var key = method.toUpperCase() + '#' + url + (data ? '?' + JSON.stringify(data) : '');
    delete $cmanager.cacherest[key];
    return $.components;
};

$.components.ready = function(fn) {
    $cmanager.ready.push(fn);
    return $.components;
};

function $components_url(url) {
    var index = url.indexOf('?');
    var builder = [];

    if ($.components.$version)
        builder.push('version=' + encodeURIComponent($.components.$version));

    if ($.components.$language)
        builder.push('language=' + encodeURIComponent($.components.$language));

    if (builder.length === 0)
        return url;

    if (index !== -1)
        url += '&';
    else
        url += '?';

    return url + builder.join('&');
}

function $components_ready() {
    clearTimeout($cmanager.timeout);
    $cmanager.timeout = setTimeout(function() {

        $cmanager.initialize();

        var count = $cmanager.components.length;
        $(document).trigger('components', [count]);

        if (!$cmanager.isReady) {
            $cmanager.clear('valid', 'dirty');
            $cmanager.isReady = true;
            $.components.emit('init');
            $.components.emit('ready');
        }

        $cmanager.isCompiling = false;

        if (!$cmanager.ready)
            return;

        var arr = $cmanager.ready;
        for (var i = 0, length = arr.length; i < length; i++)
            arr[i](count);

        delete $cmanager.ready;

    }, 100);
}

$.components.watch = function(path, fn, init) {
    $.components.on('watch', path, fn);

    if (!init)
        return $.components;

    setTimeout(function() {
        fn.call($.components, path, $cmanager.get(path));
    }, 5);

    return $.components;
};

$.components.on = function(name, path, fn, init) {

    if (typeof(path) === 'function') {
        fn = path;
        path = '';
    } else
        path = path.replace('.*', '');

    if ($.components.debug)
        console.log('%c$.components.on(' + name + (path ? ', ' + path : '') + ')', 'color:blue');

    var fixed = null;
    if (path.charCodeAt(0) === 33) {
        path = path.substring(1);
        fixed = path;
    }

    if (!$cmanager.events[path]) {
        $cmanager.events[path] = {};
        $cmanager.events[path][name] = [];
    } else if (!$cmanager.events[path][name])
        $cmanager.events[path][name] = [];

    $cmanager.events[path][name].push({ fn: fn, id: this._id, path: fixed });

    if (!init)
        return $.components;
    fn.call($.components, path, $cmanager.get(path));
    return $.components;
};

function component_init(el, obj) {

    var type = el.get(0).tagName;
    var collection;

    if ($.components.debug)
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

    $cmanager.components.push(obj);
    $cmanager.init.push(obj);
    $.components.compile(el);
    $components_ready();
}

$.components.$emit2 = function(name, path, args) {

    var e = $cmanager.events[path];
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

$.components.$emitonly = function(name, paths, type, path) {

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

    $.components.$emit2(name, '*', [path, unique[path]]);

    Object.keys(unique).forEach(function(key) {
        // OLDER: $.components.$emit2(name, key, [key, unique[key]]);
        $.components.$emit2(name, key, [path, unique[key]]);
    });

    return this;
};

$.components.$emit = function(name, path) {

    if (!path)
        return;

    var arr = path.split('.');
    var args = [];

    for (var i = name === 'watch' ? 1 : 2, length = arguments.length; i < length; i++)
        args.push(arguments[i]);

    $.components.$emit2(name, '*', args);

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

        args[1] = $.components.get(p + k);
        $.components.$emit2(name, p + k, args);
        if (k !== a)
            $.components.$emit2(name, p + a, args);
        p += k;
    }

    return true;
};

$.components.emit = function(name) {

    var e = $cmanager.events[''];
    if (!e)
        return false;

    e = $cmanager.events[''][name];
    if (!e)
        return false;

    var args = [];

    for (var i = 1, length = arguments.length; i < length; i++)
        args.push(arguments[i]);

    for (var i = 0, length = e.length; i < length; i++)
        e[i].fn.apply(e[i].context, args);

    return true;
};

$.components.change = function(path, value) {
    if (value === undefined)
        return !$.components.dirty(path);
    return !$.components.dirty(path, !value);
};

$.components.valid = function(path, value, notifyPath) {

    var key = 'valid' + path;
    if (typeof(value) !== 'boolean' && $cmanager.cache[key] !== undefined)
        return $cmanager.cache[key];

    if ($.components.debug)
        console.log('%c$.components.valid(' + path + ')', 'color:orange');

    var valid = true;
    var arr = value !== undefined ? [] : null;
    var fn = notifyPath ? $.components.eachPath : $.components.each;

    fn(function(obj) {

        if (value === undefined) {
            if (obj.$valid === false)
                valid = false;
            return;
        }

        var isState = true;
        var isUpdate = true;

        if (notifyPath) {
            var isAsterix = obj.path.substring(obj.path.length - 1) !== -1;
            if (!isAsterix)
                isState = obj.path === path;
            isUpdate = obj.path === path;
        } else {
            isUpdate = true;
            isState = true;
        }

        if (isState && obj.state)
            arr.push(obj);

        if (isUpdate) {
            obj.$valid = value;
            obj.$validate = false;
        }

        if (obj.$valid === false)
            valid = false;

    }, path);

    $cmanager.clear('valid');
    $cmanager.cache[key] = valid;
    $.components.state(arr, 1, 1);
    return valid;
};

$.components.dirty = function(path, value, notifyPath) {

    var key = 'dirty' + path;

    if (typeof(value) !== 'boolean' && $cmanager.cache[key] !== undefined)
        return $cmanager.cache[key];

    if ($.components.debug)
        console.log('%c$.components.dirty(' + path + ')', 'color:orange');

    var dirty = true;
    var arr = value !== undefined ? [] : null;
    var fn = notifyPath ? $.components.eachPath : $.components.each;

    fn(function(obj) {

        if (value === undefined) {
            if (obj.$dirty === false)
                dirty = false;
            return;
        }

        var isState = true;
        var isUpdate = true;

        if (notifyPath) {
            var isAsterix = obj.path.substring(obj.path.length - 1) !== -1;
            if (!isAsterix)
                isState = obj.path === path;
            isUpdate = obj.path === path;
        } else {
            isUpdate = true;
            isState = true;
        }

        if (isState && obj.state)
            arr.push(obj);

        if (isUpdate)
            obj.$dirty = value;

        if (obj.$dirty === false)
            dirty = false;

    }, path);

    $cmanager.clear('dirty');
    $cmanager.cache[key] = dirty;
    $.components.state(arr, 2, 2);
    return dirty;
};

// 1 === by developer
// 2 === by input
$.components.update = function(path, reset) {

    path = path.replace('.*', '');

    var state = [];
    var length = path.length;
    var was = false;
    var updates = {};

    if ($.components.debug)
        console.log('%c$.components.update(' + path + ')', 'color:red');

    $.components.each(function(component) {

        if (length > 0 && !component.path)
            return;

        var len = component.path.length;
        if (component.path.substring(0, length) !== path) {
            if (path.substring(0, len) !== component.path)
                return;
        }

        if (component.$path && component.$path !== path)
            return;

        var result = component.get();

        if (component.setter)
            component.setter(result, path, 1);

        component.$ready = true;

        if (reset === true) {
            component.$dirty = true;
            component.$valid = true;
            component.$validate = false;
            if (component.validate)
                component.$valid = component.validate(result);
        } else if (component.validate)
            component.valid(component.validate(result), true);

        if (component.state)
            state.push(component);

        if (component.path === path)
            was = true;

        updates[component.path] = result;
    });

    if (!updates[path])
        updates[path] = $.components.get(path);

    for (var i = 0, length = state.length; i < length; i++)
        state[i].state(1, 4);

    // watches
    length = path.length;

    Object.keys($cmanager.events).forEach(function(key) {
        if (key.substring(0, length) !== path)
            return;
        updates[key] = $.components.get(key);
    });

    $.components.$emitonly('watch', updates, 1, path);
    return $.components;
};

$.components.extend = function(path, value, type) {
    var val = $.components.get(path);
    if (val === null || val === undefined)
        val = {};
    if ($.components.debug)
        console.log('%c$.components.extend(' + path + ')', 'color:silver');
    $.components.set(path, $.extend(true, val, value), type);
    return $.components;
};

// 1 === by developer
// 2 === by input
$.components.set = function(path, value, type) {

    if (path.charCodeAt(0) === 43) {
        path = path.substring(1);
        return $.components.push(path, value, type);
    }

    var isUpdate = (typeof(value) === 'object' && !(value instanceof Array) && value !== null && value !== undefined);
    var reset = type === true;
    if (reset)
        type = 1;

    if ($.components.debug && !isUpdate)
        console.log('%c$.components.set(' + path + ')', 'color:red');

    $cmanager.set(path, value);

    if (isUpdate)
        return $.components.update(path, reset);

    var result = $cmanager.get(path);
    var state = [];

    if (type === undefined)
        type = 1;

    $.components.each(function(component) {

        if (component.$path && component.$path !== path)
            return;

        if (component.path === path) {
            if (component.setter)
                component.setter(result, path, type);
        } else {
            if (component.setter)
                component.setter($.components.get(component.path), path, type);
        }

        component.$ready = true;

        if (component.state)
            state.push(component);

        if (reset) {
            component.$dirty = true;
            component.$valid = true;
            component.$validate = false;
            if (component.validate)
                component.$valid = component.validate(result);
        } else if (component.validate)
            component.valid(component.validate(result), true);

    }, path, true);

    for (var i = 0, length = state.length; i < length; i++)
        state[i].state(type, 5);

    $.components.$emit('watch', path, undefined, type);
    return $.components;
};

$.components.push = function(path, value, type) {

    if ($.components.debug)
        console.log('%c$.components.push(' + path + ')', 'color:silver');

    var arr = $.components.get(path);
    if (!(arr instanceof Array))
        arr = [];
    var is = true;

    if (value instanceof Array) {
        if (value.length > 0)
            arr.push.apply(arr, value);
        else
            is = false;
    }
    else
        arr.push(value);

    if (is)
        $.components.update(path, type);
    return self;
};

$.components.clean = function() {
    $cmanager.cleaner();
    return $.components;
}

$.components.get = function(path) {
    if ($.components.debug)
        console.log('%c$.components.get(' + path + ')', 'color:gray');
    return $cmanager.get(path);
};

$.components.remove = function(path) {
    $cmanager.clear();
    $.components.each(function(obj) {
        obj.remove(true);
    }, path);
    $cmanager.cleaner();
    return $.components;
};

$.components.validate = function(path) {

    var arr = [];
    var valid = true;

    $.components.each(function(obj) {

        var current = obj.path;

        if (obj.state)
            arr.push(obj);

        obj.$validate = true;

        if (obj.validate) {
            obj.$valid = obj.validate($cmanager.get(current));
            if (!obj.$valid)
                valid = false;
        }

    }, path);

    $cmanager.clear('valid');
    $.components.state(arr, 1, 1);
    $.components.$emit('validate', path);
    return valid;
};

$.components.invalid = function(path) {
    var arr = [];
    $.components.each(function(obj) {
        if (obj.$valid === false)
            arr.push(obj);
    }, path);
    return arr;
};

$.components.can = function(path) {
    return !$.components.dirty(path) && $.components.valid(path);
};

$.components.disable = function(path) {
    return $.components.dirty(path) || !$.components.valid(path);
};

// who:
// 1. valid
// 2. dirty
// 3. reset
// 4. update
// 5. set
$.components.state = function(arr, type, who) {
    if (!arr || arr.length === 0)
        return;
    setTimeout(function() {
        for (var i = 0, length = arr.length; i < length; i++)
            arr[i].state(type, who);
    }, 2);
};

$.components.reset = function(path, timeout) {

    if (timeout > 0) {
        setTimeout(function() {
            $.components.reset(path);
        }, timeout);
        return $.components;
    }

    if ($.components.debug)
        console.log('%c$.components.reset(' + path + ')', 'color:orange');

    var arr = [];
    $.components.each(function(obj) {
        if (obj.state)
            arr.push(obj);
        obj.$dirty = true;
        obj.$valid = true;
        obj.$validate = false;
        if (obj.validate)
            obj.$valid = obj.validate(obj.get());

    }, path);

    $cmanager.clear('valid', 'dirty');
    $.components.state(arr, 1, 3);
    $.components.$emit('reset', path);
    return $.components;
};

$.components.findByName = function(name, path, callback) {

    if (typeof(path) === 'function') {
        callback = path;
        path = undefined;
    }

    var isCallback = typeof(callback) === 'function';
    var com;

    $.components.each(function(component) {

        if (component.name !== name)
            return;

        if (isCallback) {
            callback(component);
            return;
        }

        com = component;
        return true; // stop

    }, path);

    return isCallback ? $.components : com;
};

$.components.findByPath = function(path, callback) {

    if (typeof(path) === 'function') {
        callback = path;
        path = undefined;
    }

    var isCallback = typeof(callback) === 'function';
    var com;

    $.components.each(function(component) {

        if (isCallback) {
            callback(component);
            return;
        }

        com = component;
        return true; // stop

    }, path);

    return isCallback ? $.components : com;
};

$.components.findById = function(id, path, callback) {

    if (typeof(path) === 'function') {
        callback = path;
        path = undefined;
    }

    var isCallback = typeof(callback) === 'function';
    var com;

    $.components.each(function(component) {

        if (component.id !== id)
            return;

        if (isCallback) {
            callback(component);
            return;
        }

        com = component;
        return true; // stop

    }, path);

    return isCallback ? $.components : com;
};

$.components.schema = function(name, declaration, callback) {

    if (!declaration)
        return $.extend(true, {}, $cmanager.schemas[name]);

    if (typeof(declaration) === 'object') {
        $cmanager.schemas[name] = declaration;
        return declaration;
    }

    if (typeof(declaration) === 'function') {
        var f = declaration();
        $cmanager.schemas[name] = f;
        return f;
    }

    if (typeof(declaration) !== 'string')
        return undefined;

    var a = declaration.substring(0, 1);
    var b = declaration.substring(declaration.length - 1);

    if ((a === '"' && b === '"') || (a === '[' && b === ']') || (a === '{' && b === '}')) {
        var d = JSON.parse(declaration);
        $cmanager.schemas[name] = d;
        if (callback)
            callback(d)
        return d;
    }

    // url?
    $.get($components_url(declaration), function(d) {
        if (typeof(d) === 'string')
            d = JSON.parse(d);
        $cmanager.schemas[name] = d;
        if (callback)
            callback(d);
    });
};

$.components.each = function(fn, path, watch) {
    var isAsterix = path ? path.lastIndexOf('*') !== -1 : false;
    if (isAsterix)
        path = path.replace('.*', '').replace('*', '');
    var index = 0;
    for (var i = 0, length = $cmanager.components.length; i < length; i++) {
        var component = $cmanager.components[i];

        if (path) {
            if (!component.path)
                continue;
            if (isAsterix) {
                if (component.path.indexOf(path) !== 0)
                    continue;
            } else {
                if (path !== component.path) {
                    if (watch) {
                        if (path.indexOf(component.path) === -1)
                            continue;
                    } else
                        continue;
                }
            }
        }
        if (component && !component.$removed) {
            var stop = fn(component, index++, isAsterix);
            if (stop === true)
                return $.components;
        }
    }
    return $.components;
};

$.components.eachPath = function(fn, path) {

    var isAsterix = path ? path.lastIndexOf('*') !== -1 : false;
    if (isAsterix)
        path = path.replace('.*', '').replace('*', '');
    var index = 0;
    for (var i = 0, length = $cmanager.components.length; i < length; i++) {
        var component = $cmanager.components[i];
        if ((component && component.$removed) || !component.path)
            continue;

        if (isAsterix) {
            if (path.indexOf(component.path) !== 0 || component.path.indexOf(path))
                fn(component, index++, true);
            continue;
        }

        if (path.indexOf(component.path) === 0)
            fn(component, index++, false);
    }

    return $.components;
};

function Component(name) {

    this._id = 'component' + Math.floor(Math.random() * 100000);
    this.$dirty = true;
    this.$valid = true;
    this.$validate = false;
    this.$parser = [];
    this.$formatter = [];
    this.$skip = false;
    this.$ready = false;
    this.$path;

    this.name = name;
    this.path;
    this.type;
    this.id;

    this.make;
    this.done;
    this.prerender;
    this.destroy;
    this.state;

    this.validate;

    this.getter = function(value, type, older) {
        value = this.parser(value);
        if (type === 2)
            this.$skip = true;
        if (value === this.get()) {
            if (type !== 2 || older !== null)
                return this;
        }
        this.set(this.path, value, type);
        return this;
    };

    this.setter = function(value, type) {

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

    this.$parser.push(function(path, value, type) {

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
}

Component.prototype.setPath = function(path) {
    var fixed = null;

    if (path.charCodeAt(0) === 33) {
        path = substring(1);
        fixed = path;
    }

    this.path = path;
    this.$path = fixed;
    return this;
};

Component.prototype.attr = function(name, value) {
    if (value === undefined)
        return this.element.attr(name);
    this.element.attr(name, value);
    return this;
};

Component.prototype.html = function(value) {
    if (value === undefined)
        return this.element.html();
    return this.element.html(value);
};

Component.prototype.isInvalid = function() {
    var is = !this.$valid;
    if (is && !this.$validate)
        is = !this.$dirty;
    return is;
};

Component.prototype.watch = function(path, fn, init) {

    var self = this;

    if (typeof(path) === 'function') {
        init = fn;
        fn = path;
        path = self.path;
    }

    self.on('watch', path, fn);
    if (!init)
        return self;

    setTimeout(function() {
        fn.call(self, path, self.get());
    }, 5);

    return self;
};

Component.prototype.invalid = function() {
    return this.valid(false).dirty(false);
};

Component.prototype.valid = function(value, noEmit) {
    if (value === undefined)
        return this.$valid;

    this.$valid = value;
    this.$validate = false;

    $cmanager.clear('valid');

    if (noEmit)
        return this;

    if (this.state)
        this.state(1, 1);

    return this;
};

Component.prototype.style = function(value) {
    STYLE(value);
    return this;
};

Component.prototype.change = function(value) {
    if (value === undefined)
        return !this.dirty();
    return this.dirty(!value);
};

Component.prototype.dirty = function(value, noEmit) {

    if (value === undefined)
        return this.$dirty;

    this.$dirty = value;
    $cmanager.clear('dirty');

    if (noEmit)
        return this;

    if (this.state)
        this.state(2, 2);

    return this;
};

Component.prototype.remove = function(noClear) {

    if (this.destroy)
        this.destroy();

    this.element.removeData(COM_ATTR);
    this.element.find(COM_DATA_BIND_SELECTOR).unbind('change');
    this.element.remove();

    if (!noClear)
        $cmanager.clear();

    $.components.$removed = true;
    $.components.$emit('destroy', this.name, this.element.attr(COM_ATTR_P));

    if (!noClear)
        $cmanager.cleaner();
    else
        $cmanager.refresh();
};

Component.prototype.on = function(name, path, fn, init) {

    if (typeof(path) === 'function') {
        init = fn;
        fn = path;
        path = this.path;
    } else
        path = path.replace('.*', '');

    var fixed = null;
    if (path.charCodeAt(0) === 33) {
        path = path.substring(1);
        fixed = path;
    }

    if (!$cmanager.events[path]) {
        $cmanager.events[path] = {};
        $cmanager.events[path][name] = [];
    } else if (!$cmanager.events[path][name])
        $cmanager.events[path][name] = [];

    $cmanager.events[path][name].push({ fn: fn, context: this, id: this._id, path: fixed });

    if (!init)
        return $.components;

    fn.call($.components, path, $cmanager.get(path));
    return this;
};

Component.prototype.formatter = function(value, g) {
    var a = g ? $.components.$formatter : this.$formatter;
    for (var i = 0, length = a.length; i < length; i++)
        value = a[i].call(this, this.path, value, this.type);
    return value;
};

Component.prototype.parser = function(value, g) {
    var a = g ? $.components.$parser : this.$parser;
    for (var i = 0, length = a.length; i < length; i++)
        value = a[i].call(this, this.path, value, this.type);
    return value;
};

Component.prototype.emit = function() {
    $.components.emit.apply($.components, arguments);
};

Component.prototype.evaluate = function(path, expression) {
    if (!expression)
        path = self.path;
    return $.components.evaluate(path, expression);
};

Component.prototype.get = function(path) {
    if (!path)
        path = this.path;
    if (!path)
        return;
    if ($.components.debug)
        console.log('%c$.components.get(' + path + ')', 'color:gray');
    return $cmanager.get(path);
};

Component.prototype.update = function(path, reset) {
    $.components.update(path || this.path, reset);
};

Component.prototype.set = function(path, value, type) {

    var self = this;

    if (value === undefined) {
        value = path;
        path = this.path;
    }

    if (!path)
        return self;

    $.components.set(path, value, type);
    return self;
};

Component.prototype.extend = function(path, value, type) {

    var self = this;

    if (value === undefined) {
        value = path;
        path = this.path;
    }

    if (!path)
        return self;

    $.components.extend(path, value, type);
    return self;
};

Component.prototype.push = function(path, value, type) {
    var self = this;

    if (value === undefined) {
        value = path;
        path = this.path;
    }

    if (!path)
        return self;

    $.components.push(path, value, type, self);
};

function component(type, declaration) {
    return COMPONENT(type, declaration);
}

function COMPONENT(type, declaration) {

    var fn = function(el) {
        var obj = new Component(type);
        obj.element = el;
        obj.setPath(el.attr(COM_ATTR_P) || obj._id);
        declaration.call(obj);
        return obj;
    };

    $cmanager.register[type] = fn;
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

function ComponentManager() {
    this.isReady = false;
    this.isCompiling = false;
    this.init = [];
    this.register = {};
    this.cache = {};
    this.cacherest = {};
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
}

ComponentManager.prototype.restcache = function(method, url, params, value) {
    var key = method + '#' + url + (params ? '?' + JSON.stringify(params) : '');
    if (value === undefined)
        return this.cacherest[key];
    this.cacherest[key] = value;
};

ComponentManager.prototype.initialize = function() {
    var item = this.init.pop();

    if (item === undefined) {
        $.components.compile();
        return this;
    }

    if (!item.$removed)
        this.prepare(item);

    this.initialize();
    return this;
};

ComponentManager.prototype.remap = function(path, value) {
    var index = path.indexOf('->');
    if (index === -1)
        return $.components.set(path, value);
    var o = path.substring(0, index).trim();
    var n = path.substring(index + 2).trim();
    $.components.set(n, value[o]);
    return this;
};

ComponentManager.prototype.prepare = function(obj) {

    if (!obj)
        return this;

    var value = obj.get();
    var el = obj.element;
    obj.id = el.attr('data-component-id') || obj._id;

    if (obj.setter) {
        if (!obj.$ready) {
            obj.setter(value, obj.path);
            obj.$ready = true;
        }
    }

    if (obj.validate)
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
            if ($cmanager.isOperation(obj.$init)) {
                var op = OPERATION(obj.$init);
                if (op)
                    op.call(obj, obj);
                else if (console)
                    console.warn('Operation ' + obj.$init + ' not found.');
                delete obj.$init;
                return;
            }
            var fn = $.components.get(obj.$init);
            if (typeof(fn) === 'function')
                fn.call(obj, obj);
            delete obj.$init;
        }, 2);
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
        $.components.emit('#' + obj.id, obj);

    $.components.emit('@' + obj.name, obj);
    $.components.emit('component', obj);
    return this;
};

ComponentManager.prototype.next = function() {
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
 * @return {ComponentManager}
 */
ComponentManager.prototype.clear = function() {

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

/**
 * Refresh component instances
 * @return {ComponentManager}
 */
ComponentManager.prototype.refresh = function() {

    var self = this;
    self.components = [];

    $(COM_ATTR).each(function() {
        var component = $(this).data(COM_ATTR);
        if (!component || !component.element)
            return;
        self.components.push(component);
    });

    return self;
};

ComponentManager.prototype.isArray = function(path) {
    var index = path.lastIndexOf('[');
    if (index === -1)
        return false;
    path = path.substring(index + 1, path.length - 1).substring(0, 1);
    if (path === '"' || path === '\'')
        return false;
    return true;
};

ComponentManager.prototype.isOperation = function(name) {
    if (name.charCodeAt(0) === 35)
        return true;
    return false;
};
/**
 * Get value from a model
 * @param {String} path
 * @return {Object}
 */
ComponentManager.prototype.get = function(path) {
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
ComponentManager.prototype.set = function(path, value) {
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

    var arr = path.split('.');
    var builder = [];
    var p = '';

    for (var i = 0, length = arr.length; i < length; i++) {
        p += (p !== '' ? '.' : '') + arr[i];
        var type = self.isArray(arr[i]) ? '[]' : '{}';
        if (i !== length - 1) {
            builder.push('if(typeof(w.' + p + ')!=="object")w.' + p + '=' + type);
            continue;
        }

        if (type === '{}')
            break;

        p = p.substring(0, p.lastIndexOf('['));
        builder.push('if(!(w.' + p + ' instanceof Array))w.' + p + '=' + type);
        break;
    }

    var fn = (new Function('w', 'a', 'b', builder.join(';') + ';var v=typeof(a) === \'function\' ? a($cmanager.get(b)) : a;w.' + path.replace(/\'/, '\'') + '=v;return v'));
    self.cache[cachekey] = fn;
    fn(window, value, path);
    return self;
};

/**
 * Event cleaner
 * @return {ComponentManager}
 */
ComponentManager.prototype.cleaner = function() {

    var self = this;
    var aks = Object.keys(self.events);
    var is = false;

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

                if (item.context === null || (item.context.element && item.context.element.closest(document.documentElement)))
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

    if (!is)
        return self;

    self.refresh();
    return self;
};

/**
 * Default component
 */
COMPONENT('', function() {

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

        this.$parser.push.apply(this.$parser, $.components.$parser);
        this.$formatter.push.apply(this.$formatter, $.components.$formatter);
        this.element.$component = this;
    };
});

setInterval(function() {
    $cmanager.cleaner();
}, 1000 * 60);

setInterval(function() {
    $cmanager.temp = {};
}, (1000 * 60) * 5);

$.components.compile();
$(document).ready(function() {
    $(document).on('change keyup blur focus', 'input[data-component-bind],textarea[data-component-bind],select[data-component-bind]', function(e) {

        var self = this;

        if ((e.type === 'focusin' || e.type === 'focusout') && (self.type === 'checkbox' || self.type === 'radio' || self.tagName === 'SELECT'))
            return;

        if (e.type === 'focusin') {
            self.$value = self.value;
            return;
        }

        if (self.$skip && e.type === 'focusout') {
            self.$skip = false;
            return;
        }

        if (!self.$component || self.$component.$removed || !self.$component.getter || !self.$component.setter)
            return;

        var old = self.$value;
        var value;

        // cleans old value
        self.$value = null;

        if (self.type === 'checkbox' || self.type === 'radio') {
            if (e.type === 'keyup')
                return;
            var value = self.checked;
            self.$component.dirty(false, true);
            self.$component.getter(value, 2);
            self.$component.$skip = false;
            return;
        }

        if (self.tagName === 'SELECT') {
            if (e.type === 'keyup')
                return
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

        if (self.$nokeypress === undefined) {
            var v = self.getAttribute('data-component-keypress');
            if (v)
                self.$nokeypress = v === 'false';
            else
                self.$nokeypress = $.components.defaults.keypress === false;
        }

        var delay = self.$delay;
        if (self.$nokeypress) {
            if (e.type === 'keyup' || e.type === 'focusout')
                return;
            if (delay === 0)
                delay = 1;
        } else if (delay === 0)
            delay = $.components.defaults.delay;

        clearTimeout(self.$timeout);

        if (e.type === 'focusout')
            delay = 0;

        self.$timeout = setTimeout(function() {

            if (self.value === old)
                return;

            self.$timeout = null;
            self.$component.dirty(false, true);

            // because validation
            setTimeout(function() {
                self.$component.getter(self.value, 2, old);
            }, 2);

            if (!self.$only && e.type === 'keyup')
                return;

            self.$skip = true;
            self.$component.$skip = false;
            self.$component.setter(self.value, self.$component.path, 2);
        }, delay);
    });

    setTimeout(function() {
        $.components.compile();
    }, 2);

    setTimeout(function() {
        $cmanager.cleaner();
    }, 3000);
});

function SET(path, value, timeout, reset) {
    if (typeof(timeout) === 'boolean')
        return $.components.set(path, value, timeout);
    if (!timeout)
        return $.components.set(path, value, reset);
    setTimeout(function() {
        $.components.set(path, value, reset);
    }, timeout);
}

function EXTEND(path, value, timeout, reset) {
    if (typeof(timeout) === 'boolean')
        return $.components.extend(path, value, timeout);
    if (!timeout)
        return $.components.extend(path, value, reset);
    setTimeout(function() {
        $.components.extend(path, value, reset);
    }, timeout);
}

function PUSH(path, value, timeout, reset) {
    if (typeof(timeout) === 'boolean')
        return $.components.push(path, value, timeout);
    if (!timeout)
        return $.components.push(path, value, reset);
    setTimeout(function() {
        $.components.push(path, value, reset);
    }, timeout);
}

function RESET(path, timeout) {
    return $.components.reset(path, timeout);
}

function WATCH(path, callback, init) {
    return $.components.on('watch', path, callback, init);
}

function GET(path) {
    return $.components.get(path);
}

function UPDATE(path, timeout, reset) {
    if (typeof(timeout) === 'boolean')
        return $.components.update(path, timeout);
    if (!timeout)
        return $.components.update(path, reset);
    setTimeout(function() {
        $.components.update(path, reset);
    }, timeout);
}

function CHANGE(path, value) {
    return $.components.change(path, value);
}

function INJECT(url, target, callback, timeout) {
    return $.components.inject(url, target, callback, timeout);
}

function SCHEMA(name, declaration, callback) {
    return $.components.schema(name, declaration, callback);
}

function OPERATION(name, fn) {
    if (!fn) {
        if (name.charCodeAt(0) === 35)
            return $cmanager.operations[name.substring(1)];
        return $cmanager.operations[name];
    }
    $cmanager.operations[name] = fn;
    return fn;
}

function EVALUATE(path, expression) {
    return $.components.evaluate(path, expression);
}

function STYLE(value) {
    clearTimeout($cmanager.timeoutStyles);
    $cmanager.styles.push(value);
    $cmanager.timeoutStyles = setTimeout(function() {
        $('<style type="text/css">' + $cmanager.styles.join('') + '</style>').appendTo('head');
        $cmanager.styles = [];
    }, 50);
}