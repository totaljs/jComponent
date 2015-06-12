/* @license
jComponent + Tangular + jRouting
Copyright 2014-2015 Peter Širka All rights reserved.
Code licensed under MIT.
*/
var Thelpers={},Tangular={};Tangular.register=function(e,r){Thelpers[e]=r},Tangular.compile=function(e){e||(e="");for(var r=-1,n=[],i=-1,t=0,s=e.length,u=0;s>r++;){var a=e.substring(r,r+2);if(-1===i)if("{{"!==a);else{if(-1!==i){u++;continue}var l=e.substring(t,r);n.push(l?'unescape("'+escape(l)+'")':'""'),i=r+2}else if("}}"===a){if(u>0){u--;continue}n.push(e.substring(i,r).trim()),t=r+2,i=-1;continue}}n.push('unescape("'+escape(e.substring(t,s))+'")'),s=n.length;for(var f="$output+=",g='var $s=this;var $output="";',o=[],c=!1,p=0,d=0;s>d;d++)if(d%2!==0){var h=n[d],v=!1,r=h.lastIndexOf("|"),b="helpers.encode(@)",T=null,$=h.substring(0,3);"if "===$&&(h="if( "+h.substring(3)+"){",v=!0),"foreach "===h.substring(0,8)&&(T=h.split(" "),"var"===T[1]&&T.splice(1,1),o.push(T[1]),v=!0,c=!0,p++);var m=h.substring(0,5);if("endif"===m||"fi"===h?(h="}",v=!0):"else"===m?(h="} else {",v=!0):("end"===$||"endfor"===h.substring(0,6))&&(h=0===o.length?"}":"}})();",o.pop(),v=!0,p--,0===p&&(c=!1)),v)h=Tangular.append(h,o,c).trim();else{if(-1!==r){b=h.substring(r+1).trim(),h=h.substring(0,r),r=b.indexOf("(");var x=b;if(-1===r?b+="(@)":(x=b.substring(0,r),b=b.substring(0,r+1)+"@"+(-1===b.indexOf("()")?",":"")+b.substring(r+1)),b="helpers."+b,void 0===Thelpers[x])throw new Error('Helper: "'+x+'" not found.')}r=b.indexOf("("),b=b.substring(0,r)+".call($s,"+b.substring(r+1),h=b.replace("@",Tangular.append(h,o,c).trim())}if(v){if(T){var w=Tangular.append(T[3],o,c);h="if ("+w+"===null||"+w+"===undefined)"+w+"=[];(function(){for(var i=0,length="+w+".length;i<length;i++){var "+T[1]+"="+w+"[i];var $index=i;"}g+=h}else g+=f+h+";"}else g+=f+n[d]+";";return function(e){return new Function("helpers",g+";return $output;").call(e,Thelpers)}},Tangular.append=function(e,r){return void 0===r&&(r=[]),e.replace(/[\_\$a-zá-žÁ-ŽA-Z0-9\s]+/g,function(e,n,i){var t=i.substring(n-1,n),s=!1,u=e.trim();switch(('"'===t||"'"===t||"."===t)&&(s=!0),e.trim()){case"else":case"end":case"endfor":case"endif":case"fi":case"foreach":case"if":return e;case"$index":if(!s)return e}if(""===u)return"";if(s)return e;s=!1;for(var a=0,l=r.length;l>a;a++){var f=r[a].length;if(u.substring(0,f)===r[a]){if(u.length!==f){var t=u.substring(f,f+1);if("."!==t&&"+"!==t)continue}s=!0;break}}if(s)return u;t=u.substring(0,1);var g=t.charCodeAt(0);return g>47&&58>g?u:"$s."+u})},Tangular.render=function(e,r){return(void 0===r||null===r)&&(r={}),"string"==typeof e&&(e=Tangular.compile(e)),e(r)},Tangular.register("encode",function(e){return(void 0===e||null===e)&&(e=""),e.toString().replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}),Tangular.register("raw",function(e){return(void 0===e||null===e)&&(e=""),e});
var LIMIT_HISTORY=100,LIMIT_HISTORY_ERROR=100,JRFU={},jRouting={version:103,cache:{},routes:[],history:[],errors:[],events:{},eventsOnce:{},global:{},query:{},middlewares:{},repository:{},url:"",model:null,isFirst:!0,isReady:!1,isRefresh:!1,isModernBrowser:"undefined"!=typeof history.pushState,count:0};jRouting.on=function(t,r){var n=this,e=n.events[t];return e?(e.push(r),n):(n.events[t]=[r],n)},jRouting.once=function(t,r){var n=this,e=n.eventsOnce[t];return e?(e.push(r),n):(n.eventsOnce[t]=[r],n)},jRouting.emit=function(t){var r=this,n=r.events[t]||[],e=r.eventsOnce[t]||[],i=n.length,o=e.length;if(0===i&&0===o)return r;for(var u=[],a=arguments.length,s=1;a>s;s++)u.push(arguments[s]);if(i>0)for(var s=0;i>s;s++)n[s].apply(r,u);if(o>0){for(var s=0;i>s;s++)e[s].apply(r,u);delete r.eventsOnce[t]}},jRouting.route=function(t,r,n,e){var i;if(r instanceof Array){var i=n;n=r,r=i}"function"==typeof n&&(i=e,e=n,n=i);var o=this,u=t.count("/")+(-1===t.indexOf("*")?0:10),a=o._route(t.trim()),s=[];if("string"==typeof n&&(n=n.split(",")),-1!==t.indexOf("{")){u-=100;for(var f=0;f<a.length;f++)"{"===a[f].substring(0,1)&&s.push(f);u-=s.length}return o.routes.push({url:a,fn:r,priority:u,params:s,middleware:n||null,init:e,count:0,pending:!1}),o.routes.sort(function(t,r){return t.priority>r.priority?-1:t.priority<r.priority?1:0}),o},jRouting.middleware=function(t,r){var n=this;return n.middlewares[t]=r,n},jRouting.refresh=function(){var t=this;return t.location(t.url,!0)},jRouting.reload=function(){return jRouting.refresh()},jRouting._route=function(t){t=t.toLowerCase(),"/"===t.charIndex(0)&&(t=t.substring(1)),"/"===t.charIndex(t.length-1)&&(t=t.substring(0,t.length-1));var r=t.split("/");return 1===r.length&&""===r[0]&&(r[0]="/"),r},jRouting._route_param=function(t,r){var n=[];if(!r||!t)return n;var e=r.params.length;if(0===e)return n;for(var i=0;e>i;i++){var o=t[r.params[i]];n.push("/"===o?"":o)}return n},jRouting._route_compare=function(t,r){var n=t.length,e=1===n&&"/"===t[0];if(r.length!==n)return!1;for(var i=0;n>i;i++){var o=r[i];if("undefined"==typeof o)return!1;if(e||"{"!==o.charIndex(0)){if("*"===o)return!0;if(t[i]!==o)return!1}}return!0},jRouting.location=function(t,r){var n=t.indexOf("?");-1!==n&&(t=t.substring(0,n)),t=JRFU.prepareUrl(t),t=JRFU.path(t);var e=this,i=e._route(t),o=[],u=!0;e.isRefresh=r||!1,e.count++,r||e.url.length>0&&e.history[e.history.length-1]!==e.url&&(e.history.push(e.url),e.history.length>LIMIT_HISTORY&&e.history.shift());for(var a=e.routes.length,s=0;a>s;s++){var f=e.routes[s];if(e._route_compare(i,f.url)&&(-1===f.url.indexOf("*")&&(u=!1),!(f.once&&f.count>0))){f.count++,o.push(f);break}}var p=!1,c=[];e.url.length>0&&(e.cache[e.url]=e.repository),e.url=t,e.repository=e.cache[t],void 0===e.repository&&(e.repository={}),e._params(),e.emit("location",t),a=o.length;for(var s=0;a>s;s++){var f=o[s];if(!f.pending)if(f.middleware&&0!==f.middleware.length)!function(t){for(var r=t.middleware.length,n=[],o=0;r>o;o++)!function(t,r){n.push(function(n){r.call(e,n,t)})}(t,jRouting.middlewares[t.middleware[o]]);return t.init?(t.pending=!0,t.init(function(){n.async(function(){t.fn.apply(e,e._route_param(i,t)),t.pending=!1})}),void(t.init=null)):(t.pending=!0,void n.async(function(){t.fn.apply(e,e._route_param(i,t)),t.pending=!1}))}(f);else{if(!f.init){f.fn.apply(e,e._route_param(i,f));continue}f.pending=!0,function(t){t.init(function(){t.fn.apply(e,e._route_param(i,t)),t.pending=!1})}(f),f.init=null}}p&&e.status(500,c),u&&e.status(404,new Error("Route not found."))},jRouting.prev=function(){var t=this;return t.history[t.history.length-1]},jRouting.back=function(){var t=this,r=t.history.pop()||"/";return t.url="",t.redirect(r,!0),t},jRouting.status=function(t,r){var n=this;return n.emit("status",t||404,r),n},jRouting.redirect=function(t,r){var n=this;return n.isModernBrowser?(history.pushState(null,null,t),n.model=r||null,n.location(t,!1),n):(window.location.href=t,!1)},jRouting.cookie={read:function(t){for(var r=document.cookie.split(";"),n=0;n<r.length;n++){var e=r[n];" "===e.charAt(0)&&(e=e.substring(1));var i=e.split("=");if(i.length>1&&i[0]===t)return i[1]}return""},write:function(t,r,n){var e="";if("number"==typeof n){var i=new Date;i.setTime(i.getTime()+24*n*60*60*1e3),e="; expires="+i.toGMTString()}else n instanceof Date&&(e="; expires="+n.toGMTString());document.cookie=t+"="+r+e+"; path=/"},remove:function(t){this.write(t,"",-1)}},jRouting._params=function(){for(var t=this,r={},n=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),e=0;e<n.length;e++){var i=n[e].split("=");if(2===i.length){var o=decodeURIComponent(i[0]),u=decodeURIComponent(i[1]),a=r[o]instanceof Array;"undefined"==typeof r[o]||a||(r[o]=[r[o]]),a?r[o].push(u):r[o]=u}}return t.query=r,t},JRFU.path=function(t,r){"undefined"==typeof r&&(r="/");var n=t.indexOf("?"),e="";-1!==n&&(e=t.substring(n),t=t.substring(0,n));var i=t.charIndex(t.length-1);return i!==r&&(t+=r),t+e},Array.prototype.forEach||(Array.prototype.forEach=function(t){for(var r=this,n=0;n<r.length;n++)t(r[n],n);return r}),Array.prototype.indexOf||(Array.prototype.indexOf=function(t){for(var r=this,n=0;n<r.length;n++)if(t===r[n])return n;return-1}),$(window).bind("popstate",function(){var t=window.location.hash||"";0===t.length&&(t=window.location.pathname),jRouting.location(JRFU.path(t))}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s]+|[\s]+$/g,"")}),String.prototype.count||(String.prototype.count=function(t){var r=0,n=0;do r=this.indexOf(t,r+t.length),r>0&&n++;while(r>0);return n}),String.prototype.charIndex||(String.prototype.charIndex=function(t){return this.toString().substring(t,t+1)}),JRFU.path=function(t,r){"undefined"==typeof r&&(r="/");var n=t.indexOf("?"),e="";-1!==n&&(e=t.substring(n),t=t.substring(0,n));var i=t.charIndex(t.length-1);return i!==r&&(t+=r),t+e},JRFU.prepareUrl=function(t){return index=t.indexOf("#"),-1!==index?t.substring(0,index):t},Array.prototype.async||(Array.prototype.async=function(t){var r=this,n=r.shift();return void 0===n?(t&&t(),r):(n(function(){setTimeout(function(){r.async(t)},1)}),r)}),jRouting.on("error",function(t,r,n){var e=this;e.errors.push({error:t,url:r,name:n,date:new Date}),e.errors.length>LIMIT_HISTORY_ERROR&&e.errors.shift()}),$.fn.jRouting=function(t){if(!jRouting.isModernBrowser)return this;var r=function(t){t.preventDefault(),jRouting.redirect($(this).attr("href"))};return t?($(document).on("click",this.selector,r),this):(this.filter("a").bind("click",r),this)},$(document).ready(function(){var t=window.location.pathname;if(jRouting.isReady=!0,"undefined"==typeof jRouting.events.ready)jRouting.location(JRFU.path(JRFU.prepareUrl(t)));else{var r=JRFU.path(JRFU.prepareUrl(t));jRouting.emit("ready",r),jRouting.emit("load",r)}});

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
$.components.defaults.localstorage = true;
$.components.debug = false;
$.components.version = 'v1.9.1';
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

    if (!value)
        return {};

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

$.components.GETCACHE = function(url, data, callback, expire, timeout, clear) {

    if (typeof(timeout) === 'boolean') {
        var tmp = clear;
        clear = timeout;
        timeout = tmp;
    }

    var value = clear ? undefined : $cmanager.cacherest('GET', url, data);
    if (value !== undefined) {
        if (typeof(callback) === 'string')
            $cmanager.remap(callback, value);
        else
            callback(value);
        return $.components;
    }

    $.components.GET(url, data, function(r) {
        $cmanager.cacherest('GET', url, data, r, expire);
        if (typeof(callback) === 'string')
            $cmanager.remap(callback, r);
        else
            callback(r);
    }, timeout);

    return $.components;
};

$.components.POSTCACHE = function(url, data, callback, expire, timeout, clear) {

    if (typeof(timeout) === 'boolean') {
        var tmp = clear;
        clear = timeout;
        timeout = tmp;
    }

    var value = clear ? undefined : $cmanager.cacherest('POST', url, data);
    if (value !== undefined) {
        if (typeof(callback) === 'string')
            $cmanager.remap(callback, value);
        else
            callback(value);
        return $.components;
    }

    $.components.POST(url, data, function(r) {
        $cmanager.cacherest('POST', url, data, r, expire);
        if (typeof(callback) === 'string')
            $cmanager.remap(callback, r);
        else
            callback(r);
    }, timeout);

    return $.components;
};

$.components.cache = function(key, value, expire) {
    return $cmanager.cachestorage(key, value, expire);
};

$.components.removeCache = function(key, isSearching) {
    if (isSearching) {
        for (var m in $cmanager.storage) {
            if (m.indexOf(key) !== -1)
                delete $cmanager.storage[key];
        }
    } else {
        delete $cmanager.storage[key];
    }
    $components_save();
    return $.components;
};

$.components.REMOVECACHE = function(method, url, data) {
    data = JSON.stringify(data);
    var key = $components_hash(method + '#' + url.replace(/\//g, '') + data).toString();
    delete $cmanager.storage[key];
    $components_save();
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
    var is = path.charCodeAt(0) === 33;
    if (is)
        path = path.substring(1);

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
    }, undefined, undefined, is);

    if (reset) {
        $cmanager.clear('dirty');
        $cmanager.clear('valid');
    }

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

    var is = path.charCodeAt(0) === 33;
    if (is)
        path = path.substring(1);

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

    }, path, true, is);

    if (reset) {
        $cmanager.clear('dirty');
        $cmanager.clear('valid');
    }

    for (var i = 0, length = state.length; i < length; i++)
        state[i].state(type, 5);

    $.components.$emit('watch', path, undefined, type, is);
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

$.components.errors = function(path) {
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

$.components.invalid = function(path) {
    var com = $.components;
    com.dirty(path, false);
    com.valid(path, false, true);
    return com;
};

$.components.blocked = function(name, timeout, callback) {
    var key = name;
    var item = $cmanager.cacheblocked[key];
    var now = Date.now();

    if ($.components.debug)
        console.log('%c$.components.blocked(' + name + ')', 'color:silver');

    if (item > now)
        return true;

    var local = $.components.defaults.localstorage && timeout > 10000;
    $cmanager.cacheblocked[key] = now + timeout;

    if (local)
        localStorage.setItem('jcomponent.blocked', JSON.stringify($cmanager.cacheblocked));

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

$.components.each = function(fn, path, watch, fix) {
    var isAsterix = path ? path.lastIndexOf('*') !== -1 : false;
    if (isAsterix)
        path = path.replace('.*', '').replace('*', '');
    var index = 0;
    for (var i = 0, length = $cmanager.components.length; i < length; i++) {
        var component = $cmanager.components[i];

        if (fix && component.path !== path)
            continue;

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
        path = path.substring(1);
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
}

ComponentManager.prototype.cacherest = function(method, url, params, value, expire) {

    if (params && !params.version && $.components.$version)
        params.version = $.components.$version;

    if (params && !params.language && $.components.$language)
        params.language = $.components.$language;

    params = JSON.stringify(params);
    var key = $components_hash(method + '#' + url.replace(/\//g, '') + params).toString();
    return this.cachestorage(key, value, expire);
};

ComponentManager.prototype.cachestorage = function(key, value, expire) {

    var now = Date.now();

    if ($.components.debug)
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

    var now = Date.now();
    var is2 = false;
    var is3 = false;

    for (var key in self.cacheblocked) {
        if (self.cacheblocked[key] > now)
            continue;
        delete self.cacheblocked[key];
        is2 = true;
    }

    if ($.components.defaults.localstorage && is2)
        localStorage.setItem('jcomponent.blocked', JSON.stringify(self.cacheblocked));

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

    if ($.components.defaults.localstorage) {
        var cache = localStorage.getItem('jcomponent.cache');
        if (cache && typeof(cache) === 'string') {
            try {
                $cmanager.storage = JSON.parse(cache);
            } catch (e) {}
        }
        cache = localStorage.getItem('jcomponent.blocked');
        if (cache && typeof(cache) === 'string') {
            try {
                $cmanager.cacheblocked = JSON.parse(cache);
            } catch (e) {}
        }
    }

    $(document).on('change keypress keyup blur focus', 'input[data-component-bind],textarea[data-component-bind],select[data-component-bind]', function(e) {

        if (e.type === 'keypress') {
            // IE 9+ PROBLEM
            if (e.keyCode === 13)
                return false;
        }

        var self = this;
        var special = self.type === 'checkbox' || self.type === 'radio' || self.tagName === 'SELECT';

        if ((e.type === 'focusin' || e.type === 'focusout') && special)
            return;

        if (e.type === 'focusin' || (e.type === 'change' && !special))
            return;

        if (!self.$component || self.$component.$removed || !self.$component.getter || !self.$component.setter)
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

        if (e.type === 'keyup' && e.keyCode === undefined)
            return;

        if (e.keyCode < 40 && e.keyCode !== 8 && e.keyCode !== 32) {
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

        if (e.type === 'focusout')
            delay = 0;

        clearTimeout(self.$timeout);
        self.$timeout = setTimeout(function() {
            $components_keypress(self, old, e);
        }, delay);
    });

    setTimeout(function() {
        $.components.compile();
    }, 2);

    setTimeout(function() {
        $cmanager.cleaner();
    }, 3000);
});

function $components_keypress(self, old, e) {

    if (self.value === old)
        return;

    self.$timeout = null;
    self.$component.dirty(false, true);

    // because validation
    setTimeout(function() {
        self.$component.getter(self.value, 2, old);
    }, 2);

    if (!self.$only && e.type === 'keyup' && e.keyCode !== 13)
        return;

    self.$skip = true;
    self.$component.$skip = false;
    self.$component.setter(self.value, self.$component.path, 2);
    self.$value = self.value;
}

function $components_save() {
    if ($.components.defaults.localstorage)
        localStorage.setItem('jcomponent.cache', JSON.stringify($cmanager.storage));
}

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

function CACHE(key, value, expire) {
    return $.components.cache(key, value, expire);
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

function BLOCKED(name, timeout, callback) {
    return $.components.blocked(name, timeout, callback);
}

function $components_hash(s) {
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

function CONTROLLER() {
    var callback = arguments[arguments.length - 1];
    var obj = {};
    obj.name = arguments[0];
    var replacer = function(path) {
        var arg = arguments;
        return path.replace(/\{\d+\}/g, function(text) {
            return arg[parseInt(text.substring(1, text.length - 1)) + 1];
        }).replace(/\{\w+\}/g, function(text) {
            return obj[text.substring(1, text.length - 1)];
        });
    };
    callback.call(obj, replacer, obj);
}