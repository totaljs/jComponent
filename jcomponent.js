var $components = {};
var $components_cache = {};
var COM_DATA_BIND_SELECTOR = 'input[data-bind],textarea[data-bind],select[data-bind]';

$.components = function(container) {

    var els = container ? container.find('component') : $('component');

    els.each(function() {

        var el = $(this);
        var type = el.attr('type');
        var component = $components[type];

        if (!component)
            return;

        if (el.data('component'))
            return;

        var obj = component(el);

        // Reference to implementation
        el.data('component', obj);

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

};

function init(el, obj) {

    // autobind
    el.find(COM_DATA_BIND_SELECTOR).bind('change', function() {
        var el = $(this);
        if (obj.getter)
            obj.getter(el.val());
    });

    var value = obj.get();

    if (obj.setter)
        obj.setter(value);

    if (obj.validate)
        obj.validate(value, 0);

    if (obj.done)
        obj.done();

    if (obj.state)
        obj.state('init');

    $.components(el);
}

$.components.version = 'v1.0.0';
$.components.valid = function(value, container) {

    if (typeof(value) === 'object') {
        var tmp = container;
        container = value;
        value = tmp;
    }

    var key = 'valid' + (container ? container.selector : '');

    if (typeof(value) !== 'boolean' && $components_cache[key] !== undefined)
        return $components_cache[key];

    var valid = true;
    var arr = value !== undefined ? [] : null;

    $.components.each(function(obj) {

        if (value !== undefined) {
            if (obj.state)
                arr.push(obj);
            obj.valid = value;
        }

        if (obj.valid === false)
            valid = false;

    }, container);

    if (value !== undefined && arr.length > 0)
        $.components.state(arr, 'valid', valid);

    $components_cache[key] = valid;
    return valid;
};

$.components.get = function(selector) {
    return $(selector).data('component');
};

$.components.emit = function() {

    var args = arguments;

    $('component').each(function() {
        var el = $(this);
        var obj = el.data('component');
        obj.$emit.apply(obj, args);
    });

    return $.components;
};

$.components.dirty = function(value, container) {

    if (typeof(value) !== 'boolean') {
        var tmp = container;
        container = value;
        value = tmp;
    }

    var key = 'dirty' + (container ? container.selector : '');

    if (typeof(value) !== 'boolean' && $components_cache[key] !== undefined)
        return $components_cache[key];

    var dirty = true;
    var arr = value !== undefined ? [] : null;

    $.components.each(function(obj) {

        if (value !== undefined) {
            if (obj.state)
                arr.push(obj);
            obj.dirty = value;
        }

        if (obj.dirty === false)
            dirty = false;
    }, container);

    $components_cache[key] = dirty;

    if (value !== undefined && arr.length > 0)
        $.components.state(arr, 'dirty', dirty);

    return dirty;
};

$.components.bind = function(path, value, container) {
    component_setvalue(window, path, value);
    $.components.refresh(path, container, value);
    return $.components;
};

$.components.remove = function(path, container) {
    if (typeof(path) === 'object') {
        var tmp = container;
        container = path;
        path = tmp;
    }

    $components_cache_clear();
    $.components.each(function(obj) {
        var current = obj.element.attr('path');
        if (path && path !== current)
            return;
        obj.remove(true);
    }, container);

    return $.components;
};

$.components.validate = function(path, container) {

    if (typeof(path) === 'object') {
        var tmp = container;
        container = path;
        path = tmp;
    }

    var arr = [];

    $.components.each(function(obj) {

        if (obj.state)
            arr.push(obj);

        var current = obj.element.attr('path');
        if (path && path !== current)
            return;
        if (obj.validate)
            obj.validate(component_getvalue(window, current));
    }, container);

    $components_cache_clear('valid');
    if (arr.length > 0)
        $.components.state(arr, 'validate');

    return $.components;
};

$.components.invalid = function(path, container) {

    var arr = [];

    $.components.each(function(obj) {
        var current = obj.element.attr('path');
        if (path && path !== current)
            return;
        if (obj.valid === false)
            arr.push(obj);
    }, container);

    return arr;
};

$.components.state = function(container, name, value) {

    if (container instanceof Array) {
        for (var i = 0, length = container.length; i < length; i++)
            container[i].state(name, value);
        return;
    }

    $.components.each(function(obj) {
        if (obj.state)
            obj.state(name, value);
    }, container);
};

$.components.reset = function(path, container) {

    if (typeof(path) === 'object') {
        var tmp = container;
        container = path;
        path = tmp;
    }

    var arr = [];

    $.components.each(function(obj) {

        if (obj.state)
            arr.push(obj);

        var current = obj.element.attr('path');
        if (path && path !== current)
            return;
        obj.dirty = false;
        obj.valid = true;
    }, container);

    $components_cache_clear();

    if (arr.length > 0)
        $.components.state(obj, 'reset');

    return $.components;
};

$.components.update = function(path, container, value) {
    return this.refresh(path, container, value);
};

$.components.refresh = function(path, container, value) {

    if (typeof(path) === 'object') {
        var tmp = container;
        container = path;
        path = tmp;
    }

    var arr = [];

    $.components.each(function(obj) {
        var current = obj.element.attr('path');

        if (obj.state)
            arr.push(obj);

        if (obj.watch)
            obj.watch(value, path);

        if (path && path !== current)
            return;

        if (current === undefined)
            return;

        if (obj.setter)
            obj.setter(value === undefined ? component_getvalue(window, current) : value);

    }, container);

    if (arr.length > 0)
        $.components.state(arr, 'refresh');

    return $.components;
};

$.components.each = function(fn, container) {

    if (container)
        container = container.find('component');
    else
        container = $('component');

    container.each(function() {
        var component = $(this).data('component');
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

function Component(type, container) {

    this.events = {};
    this.dirty = true;
    this.valid = true;
    this.type = type;

    this.make;
    this.done;
    this.watch;
    this.destroy;
    this.state;

    this.validate;
    this.container = container || window;

    this.getter = function(value) {
        this.set(value);
    };

    this.setter = function(value) {
        this.element.find(COM_DATA_BIND_SELECTOR).val(value === undefined || value === null ? '' : value);
    };
}

Component.prototype.remove = function(noClear) {

    if (this.destroy)
        this.destroy();

    this.element.removeData('component');
    this.element.find(COM_DATA_BIND_SELECTOR).unbind('change');
    this.element.remove();

    if (!noClear)
        $components_cache_clear();

    $.components.$removed = true;
    $.components.state(undefined, 'destroy', this);

};

Component.prototype.on = function(name, fn) {
    if (!this.events[name])
        this.events[name] = [fn];
    else
        this.events[name].push(fn);
    return this;
};

Component.prototype.emit = function() {
    $.components.emit.apply($.components, arguments);
};

Component.prototype.$emit = function(name, args) {

    var e = this.events[name];

    if (!e)
        return;

    for (var i = 0, length = e.length; i < length; i++)
        e[i].apply(this, args);

    return this;
};

Component.prototype.get = function(path) {
    var self = this;

    if (!path)
        path = self.element.attr('path');

    if (!path)
        return;

    return component_getvalue(self.container, path);
};

Component.prototype.set = function(path, value) {

    var self = this;

    if (value === undefined) {
        value = path;
        path = undefined;
    }

    if (!path)
        path = self.element.attr('path');

    if (!path)
        return self;

    self.dirty = false;

    if (self.validate)
        self.valid = self.validate(value, 1);
    else
        self.valid = true;

    component_setvalue(self.container, path, value);
    $components_cache_clear();

    var arr = [];

    // emit change
    $.components.each(function(obj) {

        if (obj.state)
            arr.push(obj);

        if (obj.watch)
            obj.watch(value, path);
        if (path !== obj.element.attr('path'))
            return;
        if (obj.validate)
            self.validate(value, 2);
        if (!obj.setter)
            return;
        obj.setter(value);
    });

    if (arr.length > 0)
        $.components.state(arr, 'value', path, value);

    return self;
};

function COMPONENT(type, declaration, container) {

    var fn = function(el) {
        var obj = new Component(type, container);
        obj.element = el;
        declaration.call(obj);
        return obj;
    };

    $components[type] = fn;
}

function component_setvalue(obj, path, value) {

    path = path.split('.');
    var length = path.length;
    var current = obj;

    for (var i = 0; i < length - 1; i++) {
        current = component_findpipe(current, path[i]);
        if (current === undefined)
            return false;
    }

    current = component_findpipe(current, path[length - 1], value);
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

    } else
        pipe = current[name];

    if (pipe === undefined)
        return;

    if (value === undefined)
        return pipe;

    if (index !== -1) {
        current[name][index] = value;
        pipe = current[name][index];
    } else {
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

$.components();
$(document).ready(function() {
    $.components();
});