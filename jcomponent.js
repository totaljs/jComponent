var $components = {};
var $components_cache = { toggle: [] };
var $components_events = {};
var $components_timeout;
var $components_counter = 0;

var COM_DATA_BIND_SELECTOR = 'input[data-component-bind],textarea[data-component-bind],select[data-component-bind]';
var COM_ATTR = '[data-component]';
var COM_ATTR_URL = '[data-component-url]';

$.fn.component = function() {
    return this.data(COM_ATTR);
};

$.components = function(container) {

    var els = container ? container.find(COM_ATTR) : $(COM_ATTR);
    var skip = 0;

    els.each(function() {

        if (skip > 0) {
            skip--;
            return;
        }

        var el = $(this);
        var name = el.attr('data-component');
        var component = $components[name || ''];

        if (!component)
            return;

        skip += el.find(COM_ATTR).length;

        if (el.data(COM_ATTR))
            return;

        var obj = component(el);

        // Reference to implementation
        el.data(COM_ATTR, obj);

        if (typeof(obj.make) === 'string') {

            if (obj.make.indexOf('<') !== -1) {
                el.html(obj.make);
                init(el, obj);
                return;
            }

            $.get(obj.make, function(data) {
                el.html(data);
                init(el, obj);
            });

            return;
        }

        if (obj.make)
            obj.make();

        init(el, obj);
    });

    if (container !== undefined)
        return;

    $.components.inject();
    if ($components_cache.toggle.length === 0)
        return;

    component_async($components_cache.toggle, function(item, next) {
        for (var i = 0, length = item.toggle.length; i < length; i++)
            item.element.toggleClass(item.toggle[i]);
        next();
    });
};

$.components.formatter = [];
$.components.parser = [];

$.components.inject = function() {

    var els = $(COM_ATTR_URL);
    var arr = [];
    var count = 0;

    els.each(function() {
        var el = $(this);
        if (el.data(COM_ATTR_URL))
            return;
        el.data(COM_ATTR_URL, '1');
        arr.push({ element: el, url: el.attr('data-component-url'), toggle: (el.attr('data-component-class') || '').split(' ') });
    });

    component_async(arr, function(item, next) {
        $.get(item.url, function(response) {
            item.element.append(response);
            if (item.toggle.length > 0 && item.toggle[0] !== '')
                $components_cache.toggle.push(item);
            count++;
            next();
        });
    }, function() {
        $components_cache_clear('dirty');
        $components_cache_clear('valid');
        if (count === 0)
            return;
        $.components();
    });
};

$.components.ready = function(fn) {
    if (!$components_cache['ready'])
        $components_cache['ready'] = [];
    $components_cache['ready'].push(fn);
    $components_cache_clear('dirty');
    $components_cache_clear('valid');
};

function $components_ready() {
    clearTimeout($components_timeout);
    $components_timeout = setTimeout(function() {
        $(document).trigger('components', [$components_counter]);
        $(document).off('components');
        $.components.emit('init');
        $.components.emit('ready');
        if (!$components_cache['ready'])
            return;
        var arr = $components_cache['ready'];
        for (var i = 0, length = arr.length; i < length; i++)
            arr[i]($components_counter);
        delete $components_cache['ready'];
    }, 100);
}

$.components.on = function(name, path, fn, context) {

    if (typeof(path) === 'function') {
        fn = path;
        path = '';
    }

    var arr = name.split('+');

    if (context === undefined)
        context = $.components;

    for (var i = 0, length = arr.length; i < length; i++) {
        var id = arr[i].replace(/\s/g, '');
        if (!$components_events[path]) {
            $components_events[path] = {};
            $components_events[path][name] = [];
        } else if (!$components_events[path][name])
            $components_events[path][name] = [];
        $components_events[path][name].push({ fn: fn, context: context });
    }
    return this;
};

function init(el, obj) {

    // autobind
    el.find(COM_DATA_BIND_SELECTOR).bind('change blur', function(e) {

        var el = $(this);
        var path = el.attr('data-component-bind');

        if (path && path.length > 0 && path !== obj.path)
            return;

        if (!obj.getter)
            return;

        obj.$dirty = false;

        var value = this.type === 'checkbox' ? this.checked : el.val();
        if (value === obj.$tmp)
            return;

        obj.$tmp = value;
        obj.getter(value, 2);

    }).attr('data-component-bind', obj.path);

    var value = obj.get();

    obj.type = el.attr('data-component-type') || '';
    obj.id = el.attr('data-component-id') || obj.name;

    if (obj.setter)
        obj.setter(value);

    if (obj.validate)
        obj.$valid = obj.validate(obj.get(), 0);

    if (obj.done)
        obj.done();

    if (obj.state)
        obj.state(0);

    el.trigger('component');
    el.off('component');

    var cls = el.attr('data-component-class');
    if (cls) {
        cls = cls.split(' ');
        for (var i = 0, length = cls.length; i < length; i++)
            el.toggleClass(cls[i]);
    }

    $components_counter++;
    $components_ready();
    $.components(el);
}

$.components.version = 'v1.0.0';
$.components.valid = function(path, value) {

    var key = 'valid' + path;

    if (typeof(value) !== 'boolean' && $components_cache[key] !== undefined)
        return $components_cache[key];

    var valid = true;
    var arr = value !== undefined ? [] : null;

    $.components.each(function(obj) {

        if (value !== undefined) {
            if (obj.state)
                arr.push(obj);
            obj.$valid = value;
            obj.$validate = false;
        }

        if (obj.$valid === false)
            valid = false;

    }, path);

    $.components.state(arr, 1);
    $components_cache[key] = valid;

    return valid;
};

$.components.get = function(selector) {
    return $(selector).data(COM_ATTR);
};

$.components.$emit2 = function(name, path, args) {
    var e = $components_events[path];
    if (!e)
        return false;

    e = e[name];
    if (!e)
        return false;

    for (var i = 0, length = e.length; i < length; i++)
        e[i].fn.apply(e[i].context, args);

    return true;
};

$.components.$emit = function(name, path) {

    if (!path)
        return;

    var arr = path.split('.');
    var args = [];

    for (var i = 2, length = arguments.length; i < length; i++)
        args.push(arguments[i]);

    $.components.$emit2(name, '*', args);

    var p = '';

    for (var i = 0, length = arr.length; i < length; i++) {
        p += (p.length > 0 ? '.' : '') + arr[i];
        $.components.$emit2(name, p, args);
    }

    return true;
};

$.components.emit = function(name) {

    var e = $components_events[''];
    if (!e)
        return false;

    e = $components_events[''][name];
    if (!e)
        return false;

    var args = [];

    for (var i = 1, length = arguments.length; i < length; i++)
        args.push(arguments[i]);

    for (var i = 0, length = e.length; i < length; i++)
        e[i].fn.apply(e[i].context, arguments);

    return true;
};

$.components.dirty = function(path, value) {

    var key = 'dirty' + path;

    if (typeof(value) !== 'boolean' && $components_cache[key] !== undefined)
        return $components_cache[key];

    var dirty = true;
    var arr = value !== undefined ? [] : null;

    $.components.each(function(obj) {
        if (value !== undefined) {
            if (obj.state)
                arr.push(obj);
            obj.$dirty = value;
        }

        if (obj.$dirty === false)
            dirty = false;

    }, path);

    $.components.state(arr, 2);
    return dirty;
};

// 1 === by developer
// 2 === by input
$.components.set = function(path, value, type) {
    component_setvalue(window, path, value);
    var result = component_getvalue(window, path);
    var state = [];
    $.components.each(function(component) {
        if (component.setter)
            component.setter(result);
        if (component.validate)
            component.valid(component.validate(result), true);
        if (component.state)
            state.push(component);
    }, path);

    for (var i = 0, length = state.length; i < length; i++)
        state[i].state(type);

    $.components.$emit('watch', path, value, type === undefined ? 1 : type);
    return $.components;
};

$.components.get = function(path, value) {
    return component_getvalue(window, path, value);
};

$.components.remove = function(path, container) {

    if (typeof(path) === 'object') {
        var tmp = container;
        container = path;
        path = tmp;
    }

    $components_cache_clear();
    $.components.each(function(obj) {
        obj.remove(true);
    }, path);

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
            obj.$valid = obj.validate(component_getvalue(window, current));
            if (!obj.$valid)
                valid = false;
        }

    }, path);

    $components_cache_clear('valid');

    if (arr.length > 0)
        $.components.state(arr, 1);
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

$.components.state = function(arr, type) {

    if (!arr || arr.length === 0)
        return;

    for (var i = 0, length = arr.length; i < length; i++)
        arr[i].state(type);
};

$.components.reset = function(path) {

    var arr = [];
    $.components.each(function(obj) {
        var current = obj.path;
        if (obj.state)
            arr.push(obj);
        obj.$dirty = true;
        obj.$valid = true;
        obj.$validate = false;
        if (obj.validate)
            obj.$valid = obj.validate(obj.get(), 3);

    }, path);

    $components_cache_clear();
    $.components.state(arr, 3);
    $.components.$emit('reset', path);
    return $.components;
};

$.components.each = function(fn, path) {

    var isAsterix = path ? path.lastIndexOf('*') !== -1 : false;

    if (isAsterix)
        path = path.replace('.*', '').replace('*', '');

    $(COM_ATTR).each(function() {

        var component = $(this).data(COM_ATTR);
        if (!component)
            return;

        if (path) {
            if (!component.path)
                return;
            if (isAsterix) {
                if (component.path.indexOf(path) !== 0)
                    return;
            } else {
                if (path !== component.path)
                    return;
            }
        }

        if (component && !component.$removed)
            fn(component);
    });

    return $.components;
};

function $components_cache_clear(name) {
    var arr = Object.keys($components_cache);
    for (var i = 0, length = arr.length; i < length; i++) {

        var key = arr[i];
        if (!name) {
            delete $components_cache[key];
            continue;
        }

        if (key.substring(0, name.length) !== name)
            continue;

        delete $components_cache[key];
    }
}

function Component(name, container) {

    this._id = new Date().getTime() + 'X' + Math.floor(Math.random() * 10000);

    this.events = {};
    this.$dirty = true;
    this.$valid = true;
    this.$validate = false;

    this.name = name;
    this.path;
    this.type;
    this.id;
    this.$tmp = null;

    this.make;
    this.done;
    this.watch;
    this.destroy;
    this.state; // 0 init, 1 valid/validate, 2 dirty

    this.validate;
    this.container = container || window;

    this.getter = function(value, type) {
        var value = this.parser(value);
        this.set(this.path, value, type);
        return this;
    };

    this.setter = function(value) {

        var self = this;
        value = this.formatter(value);

        this.element.find(COM_DATA_BIND_SELECTOR).each(function() {

            var el = $(this);
            var path = el.attr('data-component-bind');

            if (path && path.length > 0 && path !== self.path)
                return;

            if (this.type === 'checkbox') {
                this.checked = value == true;
                return;
            }

            if (value === undefined || value === null)
                value = '';

            if (this.type === 'select-one') {
                el.val(value);
                return;
            }

            this.value = value;
        });
    };
}

Component.prototype.valid = function(value, noEmit) {
    if (value === undefined)
        return this.$valid;

    this.$valid = value;
    this.$validate = false;

    $components_cache_clear('valid');

    if (noEmit)
        return this;

    if (this.state)
        this.state(1);

    return this;
};

Component.prototype.dirty = function(value) {

    if (value === undefined)
        return this.$dirty;

    this.$dirty = value;
    $components_cache_clear('dirty');

    if (this.state)
        this.state(2);

    return this;
};

Component.prototype.remove = function(noClear) {

    if (this.destroy)
        this.destroy();

    this.element.removeData(COM_ATTR);
    this.element.find(COM_DATA_BIND_SELECTOR).unbind('change');
    this.element.remove();

    if (!noClear)
        $components_cache_clear();

    $.components.$removed = true;
    $.components.state(undefined, 'destroy', this);
    $.components.$emit('destroy', this.name, this.element.attr('data-component-path'));

};

Component.prototype.on = function(name, path, fn) {
    var arr = name.split('+');
    for (var i = 0, length = arr.length; i < length; i++) {
        var id = arr[i].replace(/\s/g, '');
        if (!$components_events[path]) {
            $components_events[path] = {};
            $components_events[path][name] = [];
        } else if (!$components_events[path][name])
            $components_events[path][name] = [];
        $components_events[path][name].push({ fn: fn, context: this, id: this._id });
    }
    return this;
};

Component.prototype.formatter = function(value) {
    for (var i = 0, length = $.components.formatter.length; i < length; i++)
        value = $.components.formatter[i].call(this, this.path, value, this.type);
    return value;
};

Component.prototype.parser = function(value) {
    for (var i = 0, length = $.components.parser.length; i < length; i++)
        value = $.components.parser[i].call(this, this.path, value, this.type);
    return value;
};

Component.prototype.emit = function() {
    $.components.emit.apply($.components, arguments);
};

Component.prototype.$emit2 = function(name, args) {

    var e = this.events[name];

    if (!e)
        return;

    for (var i = 0, length = e.length; i < length; i++)
        e[i].apply(this, args);

    return this;
};

Component.prototype.get = function(path) {
    if (!path)
        path = this.path;
    if (!path)
        return;
    return component_getvalue(window, path);
};

Component.prototype.set = function(path, value, type) {
    if (value === undefined) {
        value = path;
        path = this.path;
    }
    $.components.set(path, value, type);
    return self;
};

function COMPONENT(type, declaration, container) {

    var fn = function(el) {
        var obj = new Component(type, container);
        obj.element = el;
        obj.path = el.attr('data-component-path');
        declaration.call(obj);
        return obj;
    };

    $components[type] = fn;
}

function component_setvalue(obj, path, value) {

    var arr = path.split('.');
    var length = arr.length;
    var current = obj;
    var tmp;

    for (var i = 0; i < length - 1; i++) {
        current = component_findpipe(current, arr[i]);
        if (current === undefined)
            return false;
    }

    current = component_findpipe(current, arr[length - 1], value);
    return true;
}

function component_findpipe(current, name, value) {
    var beg = name.lastIndexOf('[');
    var pipe;
    var index = -1;

    if (beg !== -1) {

        index = parseInt(name.substring(beg + 1).replace(/\]\[/g, ''));
        if (isNaN(index))
            return;

        name = name.substring(0, beg);
        pipe = current[name][index];

    } else {
        pipe = current[name];
        if (pipe === undefined) {
            current[name] = {};
            if (value === undefined)
                return current[name];
            pipe = current[name];
        }
    }

    if (value === undefined)
        return pipe;

    if (index !== -1) {
        if (typeof(value) === 'function')
            current[name][index] = value(current[name][index]);
        else
            current[name][index] = value;
        pipe = current[name][index];
    } else {
        if (typeof(value) === 'function')
            current[name] = value(current[name]);
        else
            current[name] = value;
        pipe = current[name];
    }

    return pipe;
}

function component_getvalue(obj, path) {

    if (path === undefined)
        return;

    path = path.split('.');
    var length = path.length;
    var current = obj;
    for (var i = 0; i < path.length; i++) {
        current = component_findpipe(current, path[i]);
        if (current === undefined)
            return;
    }
    return current;
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

// Autocleaner
function component_event_remove() {

    var aks = Object.keys($components_events);
    for (var a = 0, al = aks.length; a < al; a++) {

        var ak = aks[a];

        if (!$components_events[ak])
            continue;

        var bks = Object.keys($components_events[ak]);

        for (var b = 0, bl = bks.length; b < bl; b++) {

            var bk = bks[b];
            var arr = $components_events[ak][bk];

            if (!arr)
                continue;

            var index = 0;

            while (true) {

                var item = arr[index++];
                if (item === undefined)
                    break;

                if (item.context === undefined)
                    continue;

                if (item.context === null || !item.context.element || item.context.element.parent().length !== 0)
                    continue;

                item.context = null;
                $components_events[ak][bk].splice(index - 1, 1);

                if ($components_events[ak][bk].length === 0) {
                    delete $components_events[ak][bk];
                    if (Object.keys($components_events[ak]).length === 0)
                        delete $components_events[ak];
                }

                index -= 2;
            }

        }
    }
}

function component_event(arr) {
    if (!arr || arr.length === 0)
        return;
    var args = [];
    for (var i = 1, length = arguments.length; i < length; i++)
        args.push(arguments[i]);
    for (var i = 0, length = arr.length; i < length; i++)
        arr[i].apply($.components, args);
}

$.components();
$(document).ready(function() {
    $.components();
});

COMPONENT('', function() {
    this.getter = null;
    this.setter = function(value) {
        value = this.formatter(value);
        this.element.html(value);
    };
});

setInterval(component_event_remove, 1000 * 60);