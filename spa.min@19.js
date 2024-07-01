/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */
/*! Total.js UI Library | (c) 2014-2023 Peter Sirka | www.totaljs.com */
/* eslint-disable */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(C,e){"use strict";var t=[],r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply([],e)},u=t.push,i=t.indexOf,n={},o=n.toString,v=n.hasOwnProperty,a=v.toString,l=a.call(Object),y={},m=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType&&"function"!=typeof e.item},x=function(e){return null!=e&&e===e.window},E=C.document,c={type:!0,src:!0,nonce:!0,noModule:!0};function b(e,t,n){var r,i,o=(n=n||E).createElement("script");if(o.text=e,t)for(r in c)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function w(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[o.call(e)]||"object":typeof e}var f="3.6.0",S=function(e,t){return new S.fn.init(e,t)};function p(e){var t=!!e&&"length"in e&&e.length,n=w(e);return!m(e)&&!x(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}S.fn=S.prototype={jquery:f,constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)},map:function(n){return this.pushStack(S.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(S.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(S.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:t.sort,splice:t.splice},S.extend=S.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||m(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(S.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||S.isPlainObject(n)?n:{},i=!1,a[t]=S.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},S.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==o.call(e))&&(!(t=r(e))||"function"==typeof(n=v.call(t,"constructor")&&t.constructor)&&a.call(n)===l)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){b(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(p(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},makeArray:function(e,t){var n=t||[];return null!=e&&(p(Object(e))?S.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:i.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,a=[];if(p(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&a.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&a.push(i);return g(a)},guid:1,support:y}),"function"==typeof Symbol&&(S.fn[Symbol.iterator]=t[Symbol.iterator]),S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase()});var d=function(n){var e,d,b,o,i,h,f,g,w,u,l,T,C,a,E,v,s,c,y,S="sizzle"+1*new Date,p=n.document,k=0,r=0,m=ue(),x=ue(),A=ue(),N=ue(),j=function(e,t){return e===t&&(l=!0),0},D={}.hasOwnProperty,t=[],q=t.pop,L=t.push,H=t.push,O=t.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",I="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",W="\\["+M+"*("+I+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+I+"))|)"+M+"*\\]",F=":("+I+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+W+")*)|.*)\\)|)",B=new RegExp(M+"+","g"),$=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=new RegExp("^"+M+"*,"+M+"*"),z=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp(M+"|>"),X=new RegExp(F),V=new RegExp("^"+I+"$"),G={ID:new RegExp("^#("+I+")"),CLASS:new RegExp("^\\.("+I+")"),TAG:new RegExp("^("+I+"|[*])"),ATTR:new RegExp("^"+W),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/HTML$/i,Q=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){T()},ae=be(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{H.apply(t=O.call(p.childNodes),p.childNodes),t[p.childNodes.length].nodeType}catch(e){H={apply:t.length?function(e,t){L.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function se(t,e,n,r){var i,o,a,s,u,l,c,f=e&&e.ownerDocument,p=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==p&&9!==p&&11!==p)return n;if(!r&&(T(e),e=e||C,E)){if(11!==p&&(u=Z.exec(t)))if(i=u[1]){if(9===p){if(!(a=e.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(f&&(a=f.getElementById(i))&&y(e,a)&&a.id===i)return n.push(a),n}else{if(u[2])return H.apply(n,e.getElementsByTagName(t)),n;if((i=u[3])&&d.getElementsByClassName&&e.getElementsByClassName)return H.apply(n,e.getElementsByClassName(i)),n}if(d.qsa&&!N[t+" "]&&(!v||!v.test(t))&&(1!==p||"object"!==e.nodeName.toLowerCase())){if(c=t,f=e,1===p&&(U.test(t)||z.test(t))){(f=ee.test(t)&&ye(e.parentNode)||e)===e&&d.scope||((s=e.getAttribute("id"))?s=s.replace(re,ie):e.setAttribute("id",s=S)),o=(l=h(t)).length;while(o--)l[o]=(s?"#"+s:":scope")+" "+xe(l[o]);c=l.join(",")}try{return H.apply(n,f.querySelectorAll(c)),n}catch(e){N(t,!0)}finally{s===S&&e.removeAttribute("id")}}}return g(t.replace($,"$1"),e,n,r)}function ue(){var r=[];return function e(t,n){return r.push(t+" ")>b.cacheLength&&delete e[r.shift()],e[t+" "]=n}}function le(e){return e[S]=!0,e}function ce(e){var t=C.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){var n=e.split("|"),r=n.length;while(r--)b.attrHandle[n[r]]=t}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function de(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}function he(n){return function(e){var t=e.nodeName.toLowerCase();return("input"===t||"button"===t)&&e.type===n}}function ge(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&ae(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function ve(a){return le(function(o){return o=+o,le(function(e,t){var n,r=a([],e.length,o),i=r.length;while(i--)e[n=r[i]]&&(e[n]=!(t[n]=e[n]))})})}function ye(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}for(e in d=se.support={},i=se.isXML=function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return!Y.test(t||n&&n.nodeName||"HTML")},T=se.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:p;return r!=C&&9===r.nodeType&&r.documentElement&&(a=(C=r).documentElement,E=!i(C),p!=C&&(n=C.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",oe,!1):n.attachEvent&&n.attachEvent("onunload",oe)),d.scope=ce(function(e){return a.appendChild(e).appendChild(C.createElement("div")),"undefined"!=typeof e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),d.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),d.getElementsByTagName=ce(function(e){return e.appendChild(C.createComment("")),!e.getElementsByTagName("*").length}),d.getElementsByClassName=K.test(C.getElementsByClassName),d.getById=ce(function(e){return a.appendChild(e).id=S,!C.getElementsByName||!C.getElementsByName(S).length}),d.getById?(b.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n=t.getElementById(e);return n?[n]:[]}}):(b.filter.ID=function(e){var n=e.replace(te,ne);return function(e){var t="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return t&&t.value===n}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),b.find.TAG=d.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):d.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},b.find.CLASS=d.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&E)return t.getElementsByClassName(e)},s=[],v=[],(d.qsa=K.test(C.querySelectorAll))&&(ce(function(e){var t;a.appendChild(e).innerHTML="<a id='"+S+"'></a><select id='"+S+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||v.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+S+"-]").length||v.push("~="),(t=C.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||v.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||v.push(":checked"),e.querySelectorAll("a#"+S+"+*").length||v.push(".#.+[+~]"),e.querySelectorAll("\\\f"),v.push("[\\r\\n\\f]")}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=C.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&v.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),a.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),v.push(",.*:")})),(d.matchesSelector=K.test(c=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&ce(function(e){d.disconnectedMatch=c.call(e,"*"),c.call(e,"[s!='']:x"),s.push("!=",F)}),v=v.length&&new RegExp(v.join("|")),s=s.length&&new RegExp(s.join("|")),t=K.test(a.compareDocumentPosition),y=t||K.test(a.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},j=t?function(e,t){if(e===t)return l=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!d.sortDetached&&t.compareDocumentPosition(e)===n?e==C||e.ownerDocument==p&&y(p,e)?-1:t==C||t.ownerDocument==p&&y(p,t)?1:u?P(u,e)-P(u,t):0:4&n?-1:1)}:function(e,t){if(e===t)return l=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e==C?-1:t==C?1:i?-1:o?1:u?P(u,e)-P(u,t):0;if(i===o)return pe(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?pe(a[r],s[r]):a[r]==p?-1:s[r]==p?1:0}),C},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if(T(e),d.matchesSelector&&E&&!N[t+" "]&&(!s||!s.test(t))&&(!v||!v.test(t)))try{var n=c.call(e,t);if(n||d.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){N(t,!0)}return 0<se(t,C,null,[e]).length},se.contains=function(e,t){return(e.ownerDocument||e)!=C&&T(e),y(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!=C&&T(e);var n=b.attrHandle[t.toLowerCase()],r=n&&D.call(b.attrHandle,t.toLowerCase())?n(e,t,!E):void 0;return void 0!==r?r:d.attributes||!E?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},se.escape=function(e){return(e+"").replace(re,ie)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,n=[],r=0,i=0;if(l=!d.detectDuplicates,u=!d.sortStable&&e.slice(0),e.sort(j),l){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)e.splice(n[r],1)}return u=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else while(t=e[r++])n+=o(t);return n},(b=se.selectors={cacheLength:50,createPseudo:le,match:G,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return G.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=h(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=m[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&m(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(n,r,i){return function(e){var t=se.attr(e,n);return null==t?"!="===r:!r||(t+="","="===r?t===i:"!="===r?t!==i:"^="===r?i&&0===t.indexOf(i):"*="===r?i&&-1<t.indexOf(i):"$="===r?i&&t.slice(-i.length)===i:"~="===r?-1<(" "+t.replace(B," ")+" ").indexOf(i):"|="===r&&(t===i||t.slice(0,i.length+1)===i+"-"))}},CHILD:function(h,e,t,g,v){var y="nth"!==h.slice(0,3),m="last"!==h.slice(-4),x="of-type"===e;return 1===g&&0===v?function(e){return!!e.parentNode}:function(e,t,n){var r,i,o,a,s,u,l=y!==m?"nextSibling":"previousSibling",c=e.parentNode,f=x&&e.nodeName.toLowerCase(),p=!n&&!x,d=!1;if(c){if(y){while(l){a=e;while(a=a[l])if(x?a.nodeName.toLowerCase()===f:1===a.nodeType)return!1;u=l="only"===h&&!u&&"nextSibling"}return!0}if(u=[m?c.firstChild:c.lastChild],m&&p){d=(s=(r=(i=(o=(a=c)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1])&&r[2],a=s&&c.childNodes[s];while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if(1===a.nodeType&&++d&&a===e){i[h]=[k,s,d];break}}else if(p&&(d=s=(r=(i=(o=(a=e)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1]),!1===d)while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if((x?a.nodeName.toLowerCase()===f:1===a.nodeType)&&++d&&(p&&((i=(o=a[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]=[k,d]),a===e))break;return(d-=v)===g||d%g==0&&0<=d/g}}},PSEUDO:function(e,o){var t,a=b.pseudos[e]||b.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return a[S]?a(o):1<a.length?(t=[e,e,"",o],b.setFilters.hasOwnProperty(e.toLowerCase())?le(function(e,t){var n,r=a(e,o),i=r.length;while(i--)e[n=P(e,r[i])]=!(t[n]=r[i])}):function(e){return a(e,0,t)}):a}},pseudos:{not:le(function(e){var r=[],i=[],s=f(e.replace($,"$1"));return s[S]?le(function(e,t,n,r){var i,o=s(e,null,r,[]),a=e.length;while(a--)(i=o[a])&&(e[a]=!(t[a]=i))}):function(e,t,n){return r[0]=e,s(r,null,n,i),r[0]=null,!i.pop()}}),has:le(function(t){return function(e){return 0<se(t,e).length}}),contains:le(function(t){return t=t.replace(te,ne),function(e){return-1<(e.textContent||o(e)).indexOf(t)}}),lang:le(function(n){return V.test(n||"")||se.error("unsupported lang: "+n),n=n.replace(te,ne).toLowerCase(),function(e){var t;do{if(t=E?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var t=n.location&&n.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===a},focus:function(e){return e===C.activeElement&&(!C.hasFocus||C.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ge(!1),disabled:ge(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return J.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ve(function(){return[0]}),last:ve(function(e,t){return[t-1]}),eq:ve(function(e,t,n){return[n<0?n+t:n]}),even:ve(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:ve(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:ve(function(e,t,n){for(var r=n<0?n+t:t<n?t:n;0<=--r;)e.push(r);return e}),gt:ve(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=b.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[e]=de(e);for(e in{submit:!0,reset:!0})b.pseudos[e]=he(e);function me(){}function xe(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function be(s,e,t){var u=e.dir,l=e.next,c=l||u,f=t&&"parentNode"===c,p=r++;return e.first?function(e,t,n){while(e=e[u])if(1===e.nodeType||f)return s(e,t,n);return!1}:function(e,t,n){var r,i,o,a=[k,p];if(n){while(e=e[u])if((1===e.nodeType||f)&&s(e,t,n))return!0}else while(e=e[u])if(1===e.nodeType||f)if(i=(o=e[S]||(e[S]={}))[e.uniqueID]||(o[e.uniqueID]={}),l&&l===e.nodeName.toLowerCase())e=e[u]||e;else{if((r=i[c])&&r[0]===k&&r[1]===p)return a[2]=r[2];if((i[c]=a)[2]=s(e,t,n))return!0}return!1}}function we(i){return 1<i.length?function(e,t,n){var r=i.length;while(r--)if(!i[r](e,t,n))return!1;return!0}:i[0]}function Te(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Ce(d,h,g,v,y,e){return v&&!v[S]&&(v=Ce(v)),y&&!y[S]&&(y=Ce(y,e)),le(function(e,t,n,r){var i,o,a,s=[],u=[],l=t.length,c=e||function(e,t,n){for(var r=0,i=t.length;r<i;r++)se(e,t[r],n);return n}(h||"*",n.nodeType?[n]:n,[]),f=!d||!e&&h?c:Te(c,s,d,n,r),p=g?y||(e?d:l||v)?[]:t:f;if(g&&g(f,p,n,r),v){i=Te(p,u),v(i,[],n,r),o=i.length;while(o--)(a=i[o])&&(p[u[o]]=!(f[u[o]]=a))}if(e){if(y||d){if(y){i=[],o=p.length;while(o--)(a=p[o])&&i.push(f[o]=a);y(null,p=[],i,r)}o=p.length;while(o--)(a=p[o])&&-1<(i=y?P(e,a):s[o])&&(e[i]=!(t[i]=a))}}else p=Te(p===t?p.splice(l,p.length):p),y?y(null,t,p,r):H.apply(t,p)})}function Ee(e){for(var i,t,n,r=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,u=be(function(e){return e===i},a,!0),l=be(function(e){return-1<P(i,e)},a,!0),c=[function(e,t,n){var r=!o&&(n||t!==w)||((i=t).nodeType?u(e,t,n):l(e,t,n));return i=null,r}];s<r;s++)if(t=b.relative[e[s].type])c=[be(we(c),t)];else{if((t=b.filter[e[s].type].apply(null,e[s].matches))[S]){for(n=++s;n<r;n++)if(b.relative[e[n].type])break;return Ce(1<s&&we(c),1<s&&xe(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace($,"$1"),t,s<n&&Ee(e.slice(s,n)),n<r&&Ee(e=e.slice(n)),n<r&&xe(e))}c.push(t)}return we(c)}return me.prototype=b.filters=b.pseudos,b.setFilters=new me,h=se.tokenize=function(e,t){var n,r,i,o,a,s,u,l=x[e+" "];if(l)return t?0:l.slice(0);a=e,s=[],u=b.preFilter;while(a){for(o in n&&!(r=_.exec(a))||(r&&(a=a.slice(r[0].length)||a),s.push(i=[])),n=!1,(r=z.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace($," ")}),a=a.slice(n.length)),b.filter)!(r=G[o].exec(a))||u[o]&&!(r=u[o](r))||(n=r.shift(),i.push({value:n,type:o,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?se.error(e):x(e,s).slice(0)},f=se.compile=function(e,t){var n,v,y,m,x,r,i=[],o=[],a=A[e+" "];if(!a){t||(t=h(e)),n=t.length;while(n--)(a=Ee(t[n]))[S]?i.push(a):o.push(a);(a=A(e,(v=o,m=0<(y=i).length,x=0<v.length,r=function(e,t,n,r,i){var o,a,s,u=0,l="0",c=e&&[],f=[],p=w,d=e||x&&b.find.TAG("*",i),h=k+=null==p?1:Math.random()||.1,g=d.length;for(i&&(w=t==C||t||i);l!==g&&null!=(o=d[l]);l++){if(x&&o){a=0,t||o.ownerDocument==C||(T(o),n=!E);while(s=v[a++])if(s(o,t||C,n)){r.push(o);break}i&&(k=h)}m&&((o=!s&&o)&&u--,e&&c.push(o))}if(u+=l,m&&l!==u){a=0;while(s=y[a++])s(c,f,t,n);if(e){if(0<u)while(l--)c[l]||f[l]||(f[l]=q.call(r));f=Te(f)}H.apply(r,f),i&&!e&&0<f.length&&1<u+y.length&&se.uniqueSort(r)}return i&&(k=h,w=p),c},m?le(r):r))).selector=e}return a},g=se.select=function(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,c=!r&&h(e=l.selector||e);if(n=n||[],1===c.length){if(2<(o=c[0]=c[0].slice(0)).length&&"ID"===(a=o[0]).type&&9===t.nodeType&&E&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(te,ne),t)||[])[0]))return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}i=G.needsContext.test(e)?0:o.length;while(i--){if(a=o[i],b.relative[s=a.type])break;if((u=b.find[s])&&(r=u(a.matches[0].replace(te,ne),ee.test(o[0].type)&&ye(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&xe(o)))return H.apply(n,r),n;break}}}return(l||f(e,c))(r,t,!E,n,!t||ee.test(e)&&ye(t.parentNode)||t),n},d.sortStable=S.split("").sort(j).join("")===S,d.detectDuplicates=!!l,T(),d.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(C.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),d.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(R,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),se}(C);S.find=d,S.expr=d.selectors,S.expr[":"]=S.expr.pseudos,S.uniqueSort=S.unique=d.uniqueSort,S.text=d.getText,S.isXMLDoc=d.isXML,S.contains=d.contains,S.escapeSelector=d.escape;var h=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&S(e).is(n))break;r.push(e)}return r},T=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},k=S.expr.match.needsContext;function A(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var N=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,n,r){return m(n)?S.grep(e,function(e,t){return!!n.call(e,t,e)!==r}):n.nodeType?S.grep(e,function(e){return e===n!==r}):"string"!=typeof n?S.grep(e,function(e){return-1<i.call(n,e)!==r}):S.filter(n,e,r)}S.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?S.find.matchesSelector(r,e)?[r]:[]:S.find.matches(e,S.grep(t,function(e){return 1===e.nodeType}))},S.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(S(e).filter(function(){for(t=0;t<r;t++)if(S.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)S.find(e,i[t],n);return 1<r?S.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&k.test(e)?S(e):e||[],!1).length}});var D,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(S.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||D,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:q.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof S?t[0]:t,S.merge(this,S.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:E,!0)),N.test(r[1])&&S.isPlainObject(t))for(r in t)m(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(i=E.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):m(e)?void 0!==n.ready?n.ready(e):e(S):S.makeArray(e,this)}).prototype=S.fn,D=S(E);var L=/^(?:parents|prev(?:Until|All))/,H={children:!0,contents:!0,next:!0,prev:!0};function O(e,t){while((e=e[t])&&1!==e.nodeType);return e}S.fn.extend({has:function(e){var t=S(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(S.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&S(e);if(!k.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?-1<a.index(n):1===n.nodeType&&S.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?S.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?i.call(S(e),this[0]):i.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(S.uniqueSort(S.merge(this.get(),S(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),S.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return h(e,"parentNode")},parentsUntil:function(e,t,n){return h(e,"parentNode",n)},next:function(e){return O(e,"nextSibling")},prev:function(e){return O(e,"previousSibling")},nextAll:function(e){return h(e,"nextSibling")},prevAll:function(e){return h(e,"previousSibling")},nextUntil:function(e,t,n){return h(e,"nextSibling",n)},prevUntil:function(e,t,n){return h(e,"previousSibling",n)},siblings:function(e){return T((e.parentNode||{}).firstChild,e)},children:function(e){return T(e.firstChild)},contents:function(e){return null!=e.contentDocument&&r(e.contentDocument)?e.contentDocument:(A(e,"template")&&(e=e.content||e),S.merge([],e.childNodes))}},function(r,i){S.fn[r]=function(e,t){var n=S.map(this,i,e);return"Until"!==r.slice(-5)&&(t=e),t&&"string"==typeof t&&(n=S.filter(t,n)),1<this.length&&(H[r]||S.uniqueSort(n),L.test(r)&&n.reverse()),this.pushStack(n)}});var P=/[^\x20\t\r\n\f]+/g;function R(e){return e}function M(e){throw e}function I(e,t,n,r){var i;try{e&&m(i=e.promise)?i.call(e).done(t).fail(n):e&&m(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}S.Callbacks=function(r){var e,n;r="string"==typeof r?(e=r,n={},S.each(e.match(P)||[],function(e,t){n[t]=!0}),n):S.extend({},r);var i,t,o,a,s=[],u=[],l=-1,c=function(){for(a=a||r.once,o=i=!0;u.length;l=-1){t=u.shift();while(++l<s.length)!1===s[l].apply(t[0],t[1])&&r.stopOnFalse&&(l=s.length,t=!1)}r.memory||(t=!1),i=!1,a&&(s=t?[]:"")},f={add:function(){return s&&(t&&!i&&(l=s.length-1,u.push(t)),function n(e){S.each(e,function(e,t){m(t)?r.unique&&f.has(t)||s.push(t):t&&t.length&&"string"!==w(t)&&n(t)})}(arguments),t&&!i&&c()),this},remove:function(){return S.each(arguments,function(e,t){var n;while(-1<(n=S.inArray(t,s,n)))s.splice(n,1),n<=l&&l--}),this},has:function(e){return e?-1<S.inArray(e,s):0<s.length},empty:function(){return s&&(s=[]),this},disable:function(){return a=u=[],s=t="",this},disabled:function(){return!s},lock:function(){return a=u=[],t||i||(s=t=""),this},locked:function(){return!!a},fireWith:function(e,t){return a||(t=[e,(t=t||[]).slice?t.slice():t],u.push(t),i||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!o}};return f},S.extend({Deferred:function(e){var o=[["notify","progress",S.Callbacks("memory"),S.Callbacks("memory"),2],["resolve","done",S.Callbacks("once memory"),S.Callbacks("once memory"),0,"resolved"],["reject","fail",S.Callbacks("once memory"),S.Callbacks("once memory"),1,"rejected"]],i="pending",a={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},"catch":function(e){return a.then(null,e)},pipe:function(){var i=arguments;return S.Deferred(function(r){S.each(o,function(e,t){var n=m(i[t[4]])&&i[t[4]];s[t[1]](function(){var e=n&&n.apply(this,arguments);e&&m(e.promise)?e.promise().progress(r.notify).done(r.resolve).fail(r.reject):r[t[0]+"With"](this,n?[e]:arguments)})}),i=null}).promise()},then:function(t,n,r){var u=0;function l(i,o,a,s){return function(){var n=this,r=arguments,e=function(){var e,t;if(!(i<u)){if((e=a.apply(n,r))===o.promise())throw new TypeError("Thenable self-resolution");t=e&&("object"==typeof e||"function"==typeof e)&&e.then,m(t)?s?t.call(e,l(u,o,R,s),l(u,o,M,s)):(u++,t.call(e,l(u,o,R,s),l(u,o,M,s),l(u,o,R,o.notifyWith))):(a!==R&&(n=void 0,r=[e]),(s||o.resolveWith)(n,r))}},t=s?e:function(){try{e()}catch(e){S.Deferred.exceptionHook&&S.Deferred.exceptionHook(e,t.stackTrace),u<=i+1&&(a!==M&&(n=void 0,r=[e]),o.rejectWith(n,r))}};i?t():(S.Deferred.getStackHook&&(t.stackTrace=S.Deferred.getStackHook()),C.setTimeout(t))}}return S.Deferred(function(e){o[0][3].add(l(0,e,m(r)?r:R,e.notifyWith)),o[1][3].add(l(0,e,m(t)?t:R)),o[2][3].add(l(0,e,m(n)?n:M))}).promise()},promise:function(e){return null!=e?S.extend(e,a):a}},s={};return S.each(o,function(e,t){var n=t[2],r=t[5];a[t[1]]=n.add,r&&n.add(function(){i=r},o[3-e][2].disable,o[3-e][3].disable,o[0][2].lock,o[0][3].lock),n.add(t[3].fire),s[t[0]]=function(){return s[t[0]+"With"](this===s?void 0:this,arguments),this},s[t[0]+"With"]=n.fireWith}),a.promise(s),e&&e.call(s,s),s},when:function(e){var n=arguments.length,t=n,r=Array(t),i=s.call(arguments),o=S.Deferred(),a=function(t){return function(e){r[t]=this,i[t]=1<arguments.length?s.call(arguments):e,--n||o.resolveWith(r,i)}};if(n<=1&&(I(e,o.done(a(t)).resolve,o.reject,!n),"pending"===o.state()||m(i[t]&&i[t].then)))return o.then();while(t--)I(i[t],a(t),o.reject);return o.promise()}});var W=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;S.Deferred.exceptionHook=function(e,t){C.console&&C.console.warn&&e&&W.test(e.name)&&C.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},S.readyException=function(e){C.setTimeout(function(){throw e})};var F=S.Deferred();function B(){E.removeEventListener("DOMContentLoaded",B),C.removeEventListener("load",B),S.ready()}S.fn.ready=function(e){return F.then(e)["catch"](function(e){S.readyException(e)}),this},S.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--S.readyWait:S.isReady)||(S.isReady=!0)!==e&&0<--S.readyWait||F.resolveWith(E,[S])}}),S.ready.then=F.then,"complete"===E.readyState||"loading"!==E.readyState&&!E.documentElement.doScroll?C.setTimeout(S.ready):(E.addEventListener("DOMContentLoaded",B),C.addEventListener("load",B));var $=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===w(n))for(s in i=!0,n)$(e,t,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,m(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(S(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},_=/^-ms-/,z=/-([a-z])/g;function U(e,t){return t.toUpperCase()}function X(e){return e.replace(_,"ms-").replace(z,U)}var V=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function G(){this.expando=S.expando+G.uid++}G.uid=1,G.prototype={cache:function(e){var t=e[this.expando];return t||(t={},V(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[X(t)]=n;else for(r in t)i[X(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][X(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(X):(t=X(t))in r?[t]:t.match(P)||[]).length;while(n--)delete r[t[n]]}(void 0===t||S.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!S.isEmptyObject(t)}};var Y=new G,Q=new G,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,K=/[A-Z]/g;function Z(e,t,n){var r,i;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(K,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===(i=n)||"false"!==i&&("null"===i?null:i===+i+""?+i:J.test(i)?JSON.parse(i):i)}catch(e){}Q.set(e,t,n)}else n=void 0;return n}S.extend({hasData:function(e){return Q.hasData(e)||Y.hasData(e)},data:function(e,t,n){return Q.access(e,t,n)},removeData:function(e,t){Q.remove(e,t)},_data:function(e,t,n){return Y.access(e,t,n)},_removeData:function(e,t){Y.remove(e,t)}}),S.fn.extend({data:function(n,e){var t,r,i,o=this[0],a=o&&o.attributes;if(void 0===n){if(this.length&&(i=Q.get(o),1===o.nodeType&&!Y.get(o,"hasDataAttrs"))){t=a.length;while(t--)a[t]&&0===(r=a[t].name).indexOf("data-")&&(r=X(r.slice(5)),Z(o,r,i[r]));Y.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof n?this.each(function(){Q.set(this,n)}):$(this,function(e){var t;if(o&&void 0===e)return void 0!==(t=Q.get(o,n))?t:void 0!==(t=Z(o,n))?t:void 0;this.each(function(){Q.set(this,n,e)})},null,e,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){Q.remove(this,e)})}}),S.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Y.get(e,t),n&&(!r||Array.isArray(n)?r=Y.access(e,t,S.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=S.queue(e,t),r=n.length,i=n.shift(),o=S._queueHooks(e,t);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){S.dequeue(e,t)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Y.get(e,n)||Y.access(e,n,{empty:S.Callbacks("once memory").add(function(){Y.remove(e,[t+"queue",n])})})}}),S.fn.extend({queue:function(t,n){var e=2;return"string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?S.queue(this[0],t):void 0===n?this:this.each(function(){var e=S.queue(this,t,n);S._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&S.dequeue(this,t)})},dequeue:function(e){return this.each(function(){S.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=S.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=Y.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var ee=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,te=new RegExp("^(?:([+-])=|)("+ee+")([a-z%]*)$","i"),ne=["Top","Right","Bottom","Left"],re=E.documentElement,ie=function(e){return S.contains(e.ownerDocument,e)},oe={composed:!0};re.getRootNode&&(ie=function(e){return S.contains(e.ownerDocument,e)||e.getRootNode(oe)===e.ownerDocument});var ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&ie(e)&&"none"===S.css(e,"display")};function se(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return S.css(e,t,"")},u=s(),l=n&&n[3]||(S.cssNumber[t]?"":"px"),c=e.nodeType&&(S.cssNumber[t]||"px"!==l&&+u)&&te.exec(S.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)S.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,S.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var ue={};function le(e,t){for(var n,r,i,o,a,s,u,l=[],c=0,f=e.length;c<f;c++)(r=e[c]).style&&(n=r.style.display,t?("none"===n&&(l[c]=Y.get(r,"display")||null,l[c]||(r.style.display="")),""===r.style.display&&ae(r)&&(l[c]=(u=a=o=void 0,a=(i=r).ownerDocument,s=i.nodeName,(u=ue[s])||(o=a.body.appendChild(a.createElement(s)),u=S.css(o,"display"),o.parentNode.removeChild(o),"none"===u&&(u="block"),ue[s]=u)))):"none"!==n&&(l[c]="none",Y.set(r,"display",n)));for(c=0;c<f;c++)null!=l[c]&&(e[c].style.display=l[c]);return e}S.fn.extend({show:function(){return le(this,!0)},hide:function(){return le(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?S(this).show():S(this).hide()})}});var ce,fe,pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,he=/^$|^module$|\/(?:java|ecma)script/i;ce=E.createDocumentFragment().appendChild(E.createElement("div")),(fe=E.createElement("input")).setAttribute("type","radio"),fe.setAttribute("checked","checked"),fe.setAttribute("name","t"),ce.appendChild(fe),y.checkClone=ce.cloneNode(!0).cloneNode(!0).lastChild.checked,ce.innerHTML="<textarea>x</textarea>",y.noCloneChecked=!!ce.cloneNode(!0).lastChild.defaultValue,ce.innerHTML="<option></option>",y.option=!!ce.lastChild;var ge={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function ve(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&A(e,t)?S.merge([e],n):n}function ye(e,t){for(var n=0,r=e.length;n<r;n++)Y.set(e[n],"globalEval",!t||Y.get(t[n],"globalEval"))}ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td,y.option||(ge.optgroup=ge.option=[1,"<select multiple='multiple'>","</select>"]);var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===w(o))S.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+S.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;S.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&-1<S.inArray(o,r))i&&i.push(o);else if(l=ie(o),a=ve(f.appendChild(o),"script"),l&&ye(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}var be=/^([^.]*)(?:\.(.+)|)/;function we(){return!0}function Te(){return!1}function Ce(e,t){return e===function(){try{return E.activeElement}catch(e){}}()==("focus"===t)}function Ee(e,t,n,r,i,o){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)Ee(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Te;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return S().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=S.guid++)),e.each(function(){S.event.add(this,t,i,r,n)})}function Se(e,i,o){o?(Y.set(e,i,!1),S.event.add(e,i,{namespace:!1,handler:function(e){var t,n,r=Y.get(this,i);if(1&e.isTrigger&&this[i]){if(r.length)(S.event.special[i]||{}).delegateType&&e.stopPropagation();else if(r=s.call(arguments),Y.set(this,i,r),t=o(this,i),this[i](),r!==(n=Y.get(this,i))||t?Y.set(this,i,!1):n={},r!==n)return e.stopImmediatePropagation(),e.preventDefault(),n&&n.value}else r.length&&(Y.set(this,i,{value:S.event.trigger(S.extend(r[0],S.Event.prototype),r.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===Y.get(e,i)&&S.event.add(e,i,we)}S.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.get(t);if(V(t)){n.handler&&(n=(o=n).handler,i=o.selector),i&&S.find.matchesSelector(re,i),n.guid||(n.guid=S.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return"undefined"!=typeof S&&S.event.triggered!==e.type?S.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(P)||[""]).length;while(l--)d=g=(s=be.exec(e[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=S.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=S.event.special[d]||{},c=S.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&S.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,h,a)||t.addEventListener&&t.addEventListener(d,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),S.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.hasData(e)&&Y.get(e);if(v&&(u=v.events)){l=(t=(t||"").match(P)||[""]).length;while(l--)if(d=g=(s=be.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){f=S.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||S.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)S.event.remove(e,d+t[l],n,r,!0);S.isEmptyObject(u)&&Y.remove(e,"handle events")}},dispatch:function(e){var t,n,r,i,o,a,s=new Array(arguments.length),u=S.event.fix(e),l=(Y.get(this,"events")||Object.create(null))[u.type]||[],c=S.event.special[u.type]||{};for(s[0]=u,t=1;t<arguments.length;t++)s[t]=arguments[t];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){a=S.event.handlers.call(this,u,l),t=0;while((i=a[t++])&&!u.isPropagationStopped()){u.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!u.isImmediatePropagationStopped())u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((S.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&1<=e.button))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?-1<S(i,this).index(l):S.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(t,e){Object.defineProperty(S.Event.prototype,t,{enumerable:!0,configurable:!0,get:m(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(e){return e[S.expando]?e:new S.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Se(t,"click",we),!1},trigger:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Se(t,"click"),!0},_default:function(e){var t=e.target;return pe.test(t.type)&&t.click&&A(t,"input")&&Y.get(t,"click")||A(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},S.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},S.Event=function(e,t){if(!(this instanceof S.Event))return new S.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?we:Te,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&S.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[S.expando]=!0},S.Event.prototype={constructor:S.Event,isDefaultPrevented:Te,isPropagationStopped:Te,isImmediatePropagationStopped:Te,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=we,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=we,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=we,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},S.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:!0},S.event.addProp),S.each({focus:"focusin",blur:"focusout"},function(e,t){S.event.special[e]={setup:function(){return Se(this,e,Ce),!1},trigger:function(){return Se(this,e),!0},_default:function(){return!0},delegateType:t}}),S.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,i){S.event.special[e]={delegateType:i,bindType:i,handle:function(e){var t,n=e.relatedTarget,r=e.handleObj;return n&&(n===this||S.contains(this,n))||(e.type=r.origType,t=r.handler.apply(this,arguments),e.type=i),t}}}),S.fn.extend({on:function(e,t,n,r){return Ee(this,e,t,n,r)},one:function(e,t,n,r){return Ee(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,S(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Te),this.each(function(){S.event.remove(this,e,n,t)})}});var ke=/<script|<style|<link/i,Ae=/checked\s*(?:[^=]|=\s*.checked.)/i,Ne=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function je(e,t){return A(e,"table")&&A(11!==t.nodeType?t:t.firstChild,"tr")&&S(e).children("tbody")[0]||e}function De(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function qe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Le(e,t){var n,r,i,o,a,s;if(1===t.nodeType){if(Y.hasData(e)&&(s=Y.get(e).events))for(i in Y.remove(t,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)S.event.add(t,i,s[i][n]);Q.hasData(e)&&(o=Q.access(e),a=S.extend({},o),Q.set(t,a))}}function He(n,r,i,o){r=g(r);var e,t,a,s,u,l,c=0,f=n.length,p=f-1,d=r[0],h=m(d);if(h||1<f&&"string"==typeof d&&!y.checkClone&&Ae.test(d))return n.each(function(e){var t=n.eq(e);h&&(r[0]=d.call(this,e,t.html())),He(t,r,i,o)});if(f&&(t=(e=xe(r,n[0].ownerDocument,!1,n,o)).firstChild,1===e.childNodes.length&&(e=t),t||o)){for(s=(a=S.map(ve(e,"script"),De)).length;c<f;c++)u=e,c!==p&&(u=S.clone(u,!0,!0),s&&S.merge(a,ve(u,"script"))),i.call(n[c],u,c);if(s)for(l=a[a.length-1].ownerDocument,S.map(a,qe),c=0;c<s;c++)u=a[c],he.test(u.type||"")&&!Y.access(u,"globalEval")&&S.contains(l,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?S._evalUrl&&!u.noModule&&S._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},l):b(u.textContent.replace(Ne,""),u,l))}return n}function Oe(e,t,n){for(var r,i=t?S.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||S.cleanData(ve(r)),r.parentNode&&(n&&ie(r)&&ye(ve(r,"script")),r.parentNode.removeChild(r));return e}S.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,o,a,s,u,l,c=e.cloneNode(!0),f=ie(e);if(!(y.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||S.isXMLDoc(e)))for(a=ve(c),r=0,i=(o=ve(e)).length;r<i;r++)s=o[r],u=a[r],void 0,"input"===(l=u.nodeName.toLowerCase())&&pe.test(s.type)?u.checked=s.checked:"input"!==l&&"textarea"!==l||(u.defaultValue=s.defaultValue);if(t)if(n)for(o=o||ve(e),a=a||ve(c),r=0,i=o.length;r<i;r++)Le(o[r],a[r]);else Le(e,c);return 0<(a=ve(c,"script")).length&&ye(a,!f&&ve(e,"script")),c},cleanData:function(e){for(var t,n,r,i=S.event.special,o=0;void 0!==(n=e[o]);o++)if(V(n)){if(t=n[Y.expando]){if(t.events)for(r in t.events)i[r]?S.event.remove(n,r):S.removeEvent(n,r,t.handle);n[Y.expando]=void 0}n[Q.expando]&&(n[Q.expando]=void 0)}}}),S.fn.extend({detach:function(e){return Oe(this,e,!0)},remove:function(e){return Oe(this,e)},text:function(e){return $(this,function(e){return void 0===e?S.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return He(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||je(this,e).appendChild(e)})},prepend:function(){return He(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=je(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return He(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return He(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(S.cleanData(ve(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return S.clone(this,e,t)})},html:function(e){return $(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!ke.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=S.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(S.cleanData(ve(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var n=[];return He(this,arguments,function(e){var t=this.parentNode;S.inArray(this,n)<0&&(S.cleanData(ve(this)),t&&t.replaceChild(e,this))},n)}}),S.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,a){S.fn[e]=function(e){for(var t,n=[],r=S(e),i=r.length-1,o=0;o<=i;o++)t=o===i?this:this.clone(!0),S(r[o])[a](t),u.apply(n,t.get());return this.pushStack(n)}});var Pe=new RegExp("^("+ee+")(?!px)[a-z%]+$","i"),Re=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=C),t.getComputedStyle(e)},Me=function(e,t,n){var r,i,o={};for(i in t)o[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=o[i];return r},Ie=new RegExp(ne.join("|"),"i");function We(e,t,n){var r,i,o,a,s=e.style;return(n=n||Re(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||ie(e)||(a=S.style(e,t)),!y.pixelBoxStyles()&&Pe.test(a)&&Ie.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function Fe(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",re.appendChild(u).appendChild(l);var e=C.getComputedStyle(l);n="1%"!==e.top,s=12===t(e.marginLeft),l.style.right="60%",o=36===t(e.right),r=36===t(e.width),l.style.position="absolute",i=12===t(l.offsetWidth/3),re.removeChild(u),l=null}}function t(e){return Math.round(parseFloat(e))}var n,r,i,o,a,s,u=E.createElement("div"),l=E.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",y.clearCloneStyle="content-box"===l.style.backgroundClip,S.extend(y,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),o},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),s},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==a&&(e=E.createElement("table"),t=E.createElement("tr"),n=E.createElement("div"),e.style.cssText="position:absolute;left:-11111px;border-collapse:separate",t.style.cssText="border:1px solid",t.style.height="1px",n.style.height="9px",n.style.display="block",re.appendChild(e).appendChild(t).appendChild(n),r=C.getComputedStyle(t),a=parseInt(r.height,10)+parseInt(r.borderTopWidth,10)+parseInt(r.borderBottomWidth,10)===t.offsetHeight,re.removeChild(e)),a}}))}();var Be=["Webkit","Moz","ms"],$e=E.createElement("div").style,_e={};function ze(e){var t=S.cssProps[e]||_e[e];return t||(e in $e?e:_e[e]=function(e){var t=e[0].toUpperCase()+e.slice(1),n=Be.length;while(n--)if((e=Be[n]+t)in $e)return e}(e)||e)}var Ue=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ve={position:"absolute",visibility:"hidden",display:"block"},Ge={letterSpacing:"0",fontWeight:"400"};function Ye(e,t,n){var r=te.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Qe(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=S.css(e,n+ne[a],!0,i)),r?("content"===n&&(u-=S.css(e,"padding"+ne[a],!0,i)),"margin"!==n&&(u-=S.css(e,"border"+ne[a]+"Width",!0,i))):(u+=S.css(e,"padding"+ne[a],!0,i),"padding"!==n?u+=S.css(e,"border"+ne[a]+"Width",!0,i):s+=S.css(e,"border"+ne[a]+"Width",!0,i));return!r&&0<=o&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u}function Je(e,t,n){var r=Re(e),i=(!y.boxSizingReliable()||n)&&"border-box"===S.css(e,"boxSizing",!1,r),o=i,a=We(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(Pe.test(a)){if(!n)return a;a="auto"}return(!y.boxSizingReliable()&&i||!y.reliableTrDimensions()&&A(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===S.css(e,"display",!1,r))&&e.getClientRects().length&&(i="border-box"===S.css(e,"boxSizing",!1,r),(o=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+Qe(e,t,n||(i?"border":"content"),o,r,a)+"px"}function Ke(e,t,n,r,i){return new Ke.prototype.init(e,t,n,r,i)}S.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=We(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=X(t),u=Xe.test(t),l=e.style;if(u||(t=ze(s)),a=S.cssHooks[t]||S.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"===(o=typeof n)&&(i=te.exec(n))&&i[1]&&(n=se(e,t,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(S.cssNumber[s]?"":"px")),y.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=X(t);return Xe.test(t)||(t=ze(s)),(a=S.cssHooks[t]||S.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=We(e,t,r)),"normal"===i&&t in Ge&&(i=Ge[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),S.each(["height","width"],function(e,u){S.cssHooks[u]={get:function(e,t,n){if(t)return!Ue.test(S.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?Je(e,u,n):Me(e,Ve,function(){return Je(e,u,n)})},set:function(e,t,n){var r,i=Re(e),o=!y.scrollboxSize()&&"absolute"===i.position,a=(o||n)&&"border-box"===S.css(e,"boxSizing",!1,i),s=n?Qe(e,u,n,a,i):0;return a&&o&&(s-=Math.ceil(e["offset"+u[0].toUpperCase()+u.slice(1)]-parseFloat(i[u])-Qe(e,u,"border",!1,i)-.5)),s&&(r=te.exec(t))&&"px"!==(r[3]||"px")&&(e.style[u]=t,t=S.css(e,u)),Ye(0,t,s)}}}),S.cssHooks.marginLeft=Fe(y.reliableMarginLeft,function(e,t){if(t)return(parseFloat(We(e,"marginLeft"))||e.getBoundingClientRect().left-Me(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),S.each({margin:"",padding:"",border:"Width"},function(i,o){S.cssHooks[i+o]={expand:function(e){for(var t=0,n={},r="string"==typeof e?e.split(" "):[e];t<4;t++)n[i+ne[t]+o]=r[t]||r[t-2]||r[0];return n}},"margin"!==i&&(S.cssHooks[i+o].set=Ye)}),S.fn.extend({css:function(e,t){return $(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=Re(e),i=t.length;a<i;a++)o[t[a]]=S.css(e,t[a],!1,r);return o}return void 0!==n?S.style(e,t,n):S.css(e,t)},e,t,1<arguments.length)}}),((S.Tween=Ke).prototype={constructor:Ke,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||S.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(S.cssNumber[n]?"":"px")},cur:function(){var e=Ke.propHooks[this.prop];return e&&e.get?e.get(this):Ke.propHooks._default.get(this)},run:function(e){var t,n=Ke.propHooks[this.prop];return this.options.duration?this.pos=t=S.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Ke.propHooks._default.set(this),this}}).init.prototype=Ke.prototype,(Ke.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=S.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){S.fx.step[e.prop]?S.fx.step[e.prop](e):1!==e.elem.nodeType||!S.cssHooks[e.prop]&&null==e.elem.style[ze(e.prop)]?e.elem[e.prop]=e.now:S.style(e.elem,e.prop,e.now+e.unit)}}}).scrollTop=Ke.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},S.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},S.fx=Ke.prototype.init,S.fx.step={};var Ze,et,tt,nt,rt=/^(?:toggle|show|hide)$/,it=/queueHooks$/;function ot(){et&&(!1===E.hidden&&C.requestAnimationFrame?C.requestAnimationFrame(ot):C.setTimeout(ot,S.fx.interval),S.fx.tick())}function at(){return C.setTimeout(function(){Ze=void 0}),Ze=Date.now()}function st(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=ne[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function ut(e,t,n){for(var r,i=(lt.tweeners[t]||[]).concat(lt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function lt(o,e,t){var n,a,r=0,i=lt.prefilters.length,s=S.Deferred().always(function(){delete u.elem}),u=function(){if(a)return!1;for(var e=Ze||at(),t=Math.max(0,l.startTime+l.duration-e),n=1-(t/l.duration||0),r=0,i=l.tweens.length;r<i;r++)l.tweens[r].run(n);return s.notifyWith(o,[l,n,t]),n<1&&i?t:(i||s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l]),!1)},l=s.promise({elem:o,props:S.extend({},e),opts:S.extend(!0,{specialEasing:{},easing:S.easing._default},t),originalProperties:e,originalOptions:t,startTime:Ze||at(),duration:t.duration,tweens:[],createTween:function(e,t){var n=S.Tween(o,l.opts,e,t,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(n),n},stop:function(e){var t=0,n=e?l.tweens.length:0;if(a)return this;for(a=!0;t<n;t++)l.tweens[t].run(1);return e?(s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l,e])):s.rejectWith(o,[l,e]),this}}),c=l.props;for(!function(e,t){var n,r,i,o,a;for(n in e)if(i=t[r=X(n)],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=S.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete e[r],o)n in e||(e[n]=o[n],t[n]=i);else t[r]=i}(c,l.opts.specialEasing);r<i;r++)if(n=lt.prefilters[r].call(l,o,c,l.opts))return m(n.stop)&&(S._queueHooks(l.elem,l.opts.queue).stop=n.stop.bind(n)),n;return S.map(c,ut,l),m(l.opts.start)&&l.opts.start.call(o,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),S.fx.timer(S.extend(u,{elem:o,anim:l,queue:l.opts.queue})),l}S.Animation=S.extend(lt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return se(n.elem,e,te.exec(t),n),n}]},tweener:function(e,t){m(e)?(t=e,e=["*"]):e=e.match(P);for(var n,r=0,i=e.length;r<i;r++)n=e[r],lt.tweeners[n]=lt.tweeners[n]||[],lt.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),v=Y.get(e,"fxshow");for(r in n.queue||(null==(a=S._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,S.queue(e,"fx").length||a.empty.fire()})})),t)if(i=t[r],rt.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}d[r]=v&&v[r]||S.style(e,r)}if((u=!S.isEmptyObject(t))||!S.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=v&&v.display)&&(l=Y.get(e,"display")),"none"===(c=S.css(e,"display"))&&(l?c=l:(le([e],!0),l=e.style.display||l,c=S.css(e,"display"),le([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===S.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1,d)u||(v?"hidden"in v&&(g=v.hidden):v=Y.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&le([e],!0),p.done(function(){for(r in g||le([e]),Y.remove(e,"fxshow"),d)S.style(e,r,d[r])})),u=ut(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}],prefilter:function(e,t){t?lt.prefilters.unshift(e):lt.prefilters.push(e)}}),S.speed=function(e,t,n){var r=e&&"object"==typeof e?S.extend({},e):{complete:n||!n&&t||m(e)&&e,duration:e,easing:n&&t||t&&!m(t)&&t};return S.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in S.fx.speeds?r.duration=S.fx.speeds[r.duration]:r.duration=S.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){m(r.old)&&r.old.call(this),r.queue&&S.dequeue(this,r.queue)},r},S.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(t,e,n,r){var i=S.isEmptyObject(t),o=S.speed(e,n,r),a=function(){var e=lt(this,S.extend({},t),o);(i||Y.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(i,e,o){var a=function(e){var t=e.stop;delete e.stop,t(o)};return"string"!=typeof i&&(o=e,e=i,i=void 0),e&&this.queue(i||"fx",[]),this.each(function(){var e=!0,t=null!=i&&i+"queueHooks",n=S.timers,r=Y.get(this);if(t)r[t]&&r[t].stop&&a(r[t]);else for(t in r)r[t]&&r[t].stop&&it.test(t)&&a(r[t]);for(t=n.length;t--;)n[t].elem!==this||null!=i&&n[t].queue!==i||(n[t].anim.stop(o),e=!1,n.splice(t,1));!e&&o||S.dequeue(this,i)})},finish:function(a){return!1!==a&&(a=a||"fx"),this.each(function(){var e,t=Y.get(this),n=t[a+"queue"],r=t[a+"queueHooks"],i=S.timers,o=n?n.length:0;for(t.finish=!0,S.queue(this,a,[]),r&&r.stop&&r.stop.call(this,!0),e=i.length;e--;)i[e].elem===this&&i[e].queue===a&&(i[e].anim.stop(!0),i.splice(e,1));for(e=0;e<o;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish})}}),S.each(["toggle","show","hide"],function(e,r){var i=S.fn[r];S.fn[r]=function(e,t,n){return null==e||"boolean"==typeof e?i.apply(this,arguments):this.animate(st(r,!0),e,t,n)}}),S.each({slideDown:st("show"),slideUp:st("hide"),slideToggle:st("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,r){S.fn[e]=function(e,t,n){return this.animate(r,e,t,n)}}),S.timers=[],S.fx.tick=function(){var e,t=0,n=S.timers;for(Ze=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||S.fx.stop(),Ze=void 0},S.fx.timer=function(e){S.timers.push(e),S.fx.start()},S.fx.interval=13,S.fx.start=function(){et||(et=!0,ot())},S.fx.stop=function(){et=null},S.fx.speeds={slow:600,fast:200,_default:400},S.fn.delay=function(r,e){return r=S.fx&&S.fx.speeds[r]||r,e=e||"fx",this.queue(e,function(e,t){var n=C.setTimeout(e,r);t.stop=function(){C.clearTimeout(n)}})},tt=E.createElement("input"),nt=E.createElement("select").appendChild(E.createElement("option")),tt.type="checkbox",y.checkOn=""!==tt.value,y.optSelected=nt.selected,(tt=E.createElement("input")).value="t",tt.type="radio",y.radioValue="t"===tt.value;var ct,ft=S.expr.attrHandle;S.fn.extend({attr:function(e,t){return $(this,S.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){S.removeAttr(this,e)})}}),S.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?S.prop(e,t,n):(1===o&&S.isXMLDoc(e)||(i=S.attrHooks[t.toLowerCase()]||(S.expr.match.bool.test(t)?ct:void 0)),void 0!==n?null===n?void S.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=S.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!y.radioValue&&"radio"===t&&A(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(P);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),ct={set:function(e,t,n){return!1===t?S.removeAttr(e,n):e.setAttribute(n,n),n}},S.each(S.expr.match.bool.source.match(/\w+/g),function(e,t){var a=ft[t]||S.find.attr;ft[t]=function(e,t,n){var r,i,o=t.toLowerCase();return n||(i=ft[o],ft[o]=r,r=null!=a(e,t,n)?o:null,ft[o]=i),r}});var pt=/^(?:input|select|textarea|button)$/i,dt=/^(?:a|area)$/i;function ht(e){return(e.match(P)||[]).join(" ")}function gt(e){return e.getAttribute&&e.getAttribute("class")||""}function vt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(P)||[]}S.fn.extend({prop:function(e,t){return $(this,S.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[S.propFix[e]||e]})}}),S.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&S.isXMLDoc(e)||(t=S.propFix[t]||t,i=S.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=S.find.attr(e,"tabindex");return t?parseInt(t,10):pt.test(e.nodeName)||dt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),y.optSelected||(S.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),S.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){S.propFix[this.toLowerCase()]=this}),S.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).addClass(t.call(this,e,gt(this)))});if((e=vt(t)).length)while(n=this[u++])if(i=gt(n),r=1===n.nodeType&&" "+ht(i)+" "){a=0;while(o=e[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=ht(r))&&n.setAttribute("class",s)}return this},removeClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).removeClass(t.call(this,e,gt(this)))});if(!arguments.length)return this.attr("class","");if((e=vt(t)).length)while(n=this[u++])if(i=gt(n),r=1===n.nodeType&&" "+ht(i)+" "){a=0;while(o=e[a++])while(-1<r.indexOf(" "+o+" "))r=r.replace(" "+o+" "," ");i!==(s=ht(r))&&n.setAttribute("class",s)}return this},toggleClass:function(i,t){var o=typeof i,a="string"===o||Array.isArray(i);return"boolean"==typeof t&&a?t?this.addClass(i):this.removeClass(i):m(i)?this.each(function(e){S(this).toggleClass(i.call(this,e,gt(this),t),t)}):this.each(function(){var e,t,n,r;if(a){t=0,n=S(this),r=vt(i);while(e=r[t++])n.hasClass(e)?n.removeClass(e):n.addClass(e)}else void 0!==i&&"boolean"!==o||((e=gt(this))&&Y.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===i?"":Y.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&-1<(" "+ht(gt(n))+" ").indexOf(t))return!0;return!1}});var yt=/\r/g;S.fn.extend({val:function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,S(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=S.map(t,function(e){return null==e?"":e+""})),(r=S.valHooks[this.type]||S.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=S.valHooks[t.type]||S.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(yt,""):null==e?"":e:void 0}}),S.extend({valHooks:{option:{get:function(e){var t=S.find.attr(e,"value");return null!=t?t:ht(S.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!A(n.parentNode,"optgroup"))){if(t=S(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=S.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=-1<S.inArray(S.valHooks.option.get(r),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),S.each(["radio","checkbox"],function(){S.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<S.inArray(S(e).val(),t)}},y.checkOn||(S.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),y.focusin="onfocusin"in C;var mt=/^(?:focusinfocus|focusoutblur)$/,xt=function(e){e.stopPropagation()};S.extend(S.event,{trigger:function(e,t,n,r){var i,o,a,s,u,l,c,f,p=[n||E],d=v.call(e,"type")?e.type:e,h=v.call(e,"namespace")?e.namespace.split("."):[];if(o=f=a=n=n||E,3!==n.nodeType&&8!==n.nodeType&&!mt.test(d+S.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,(e=e[S.expando]?e:new S.Event(d,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:S.makeArray(t,[e]),c=S.event.special[d]||{},r||!c.trigger||!1!==c.trigger.apply(n,t))){if(!r&&!c.noBubble&&!x(n)){for(s=c.delegateType||d,mt.test(s+d)||(o=o.parentNode);o;o=o.parentNode)p.push(o),a=o;a===(n.ownerDocument||E)&&p.push(a.defaultView||a.parentWindow||C)}i=0;while((o=p[i++])&&!e.isPropagationStopped())f=o,e.type=1<i?s:c.bindType||d,(l=(Y.get(o,"events")||Object.create(null))[e.type]&&Y.get(o,"handle"))&&l.apply(o,t),(l=u&&o[u])&&l.apply&&V(o)&&(e.result=l.apply(o,t),!1===e.result&&e.preventDefault());return e.type=d,r||e.isDefaultPrevented()||c._default&&!1!==c._default.apply(p.pop(),t)||!V(n)||u&&m(n[d])&&!x(n)&&((a=n[u])&&(n[u]=null),S.event.triggered=d,e.isPropagationStopped()&&f.addEventListener(d,xt),n[d](),e.isPropagationStopped()&&f.removeEventListener(d,xt),S.event.triggered=void 0,a&&(n[u]=a)),e.result}},simulate:function(e,t,n){var r=S.extend(new S.Event,n,{type:e,isSimulated:!0});S.event.trigger(r,null,t)}}),S.fn.extend({trigger:function(e,t){return this.each(function(){S.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return S.event.trigger(e,t,n,!0)}}),y.focusin||S.each({focus:"focusin",blur:"focusout"},function(n,r){var i=function(e){S.event.simulate(r,e.target,S.event.fix(e))};S.event.special[r]={setup:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r);t||e.addEventListener(n,i,!0),Y.access(e,r,(t||0)+1)},teardown:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r)-1;t?Y.access(e,r,t):(e.removeEventListener(n,i,!0),Y.remove(e,r))}}});var bt=C.location,wt={guid:Date.now()},Tt=/\?/;S.parseXML=function(e){var t,n;if(!e||"string"!=typeof e)return null;try{t=(new C.DOMParser).parseFromString(e,"text/xml")}catch(e){}return n=t&&t.getElementsByTagName("parsererror")[0],t&&!n||S.error("Invalid XML: "+(n?S.map(n.childNodes,function(e){return e.textContent}).join("\n"):e)),t};var Ct=/\[\]$/,Et=/\r?\n/g,St=/^(?:submit|button|image|reset|file)$/i,kt=/^(?:input|select|textarea|keygen)/i;function At(n,e,r,i){var t;if(Array.isArray(e))S.each(e,function(e,t){r||Ct.test(n)?i(n,t):At(n+"["+("object"==typeof t&&null!=t?e:"")+"]",t,r,i)});else if(r||"object"!==w(e))i(n,e);else for(t in e)At(n+"["+t+"]",e[t],r,i)}S.param=function(e,t){var n,r=[],i=function(e,t){var n=m(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!S.isPlainObject(e))S.each(e,function(){i(this.name,this.value)});else for(n in e)At(n,e[n],t,i);return r.join("&")},S.fn.extend({serialize:function(){return S.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=S.prop(this,"elements");return e?S.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!S(this).is(":disabled")&&kt.test(this.nodeName)&&!St.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=S(this).val();return null==n?null:Array.isArray(n)?S.map(n,function(e){return{name:t.name,value:e.replace(Et,"\r\n")}}):{name:t.name,value:n.replace(Et,"\r\n")}}).get()}});var Nt=/%20/g,jt=/#.*$/,Dt=/([?&])_=[^&]*/,qt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Lt=/^(?:GET|HEAD)$/,Ht=/^\/\//,Ot={},Pt={},Rt="*/".concat("*"),Mt=E.createElement("a");function It(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,r=0,i=e.toLowerCase().match(P)||[];if(m(t))while(n=i[r++])"+"===n[0]?(n=n.slice(1)||"*",(o[n]=o[n]||[]).unshift(t)):(o[n]=o[n]||[]).push(t)}}function Wt(t,i,o,a){var s={},u=t===Pt;function l(e){var r;return s[e]=!0,S.each(t[e]||[],function(e,t){var n=t(i,o,a);return"string"!=typeof n||u||s[n]?u?!(r=n):void 0:(i.dataTypes.unshift(n),l(n),!1)}),r}return l(i.dataTypes[0])||!s["*"]&&l("*")}function Ft(e,t){var n,r,i=S.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&S.extend(!0,e,r),e}Mt.href=bt.href,S.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:bt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(bt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Rt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":S.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Ft(Ft(e,S.ajaxSettings),t):Ft(S.ajaxSettings,e)},ajaxPrefilter:It(Ot),ajaxTransport:It(Pt),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var c,f,p,n,d,r,h,g,i,o,v=S.ajaxSetup({},t),y=v.context||v,m=v.context&&(y.nodeType||y.jquery)?S(y):S.event,x=S.Deferred(),b=S.Callbacks("once memory"),w=v.statusCode||{},a={},s={},u="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(h){if(!n){n={};while(t=qt.exec(p))n[t[1].toLowerCase()+" "]=(n[t[1].toLowerCase()+" "]||[]).concat(t[2])}t=n[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return h?p:null},setRequestHeader:function(e,t){return null==h&&(e=s[e.toLowerCase()]=s[e.toLowerCase()]||e,a[e]=t),this},overrideMimeType:function(e){return null==h&&(v.mimeType=e),this},statusCode:function(e){var t;if(e)if(h)T.always(e[T.status]);else for(t in e)w[t]=[w[t],e[t]];return this},abort:function(e){var t=e||u;return c&&c.abort(t),l(0,t),this}};if(x.promise(T),v.url=((e||v.url||bt.href)+"").replace(Ht,bt.protocol+"//"),v.type=t.method||t.type||v.method||v.type,v.dataTypes=(v.dataType||"*").toLowerCase().match(P)||[""],null==v.crossDomain){r=E.createElement("a");try{r.href=v.url,r.href=r.href,v.crossDomain=Mt.protocol+"//"+Mt.host!=r.protocol+"//"+r.host}catch(e){v.crossDomain=!0}}if(v.data&&v.processData&&"string"!=typeof v.data&&(v.data=S.param(v.data,v.traditional)),Wt(Ot,v,t,T),h)return T;for(i in(g=S.event&&v.global)&&0==S.active++&&S.event.trigger("ajaxStart"),v.type=v.type.toUpperCase(),v.hasContent=!Lt.test(v.type),f=v.url.replace(jt,""),v.hasContent?v.data&&v.processData&&0===(v.contentType||"").indexOf("application/x-www-form-urlencoded")&&(v.data=v.data.replace(Nt,"+")):(o=v.url.slice(f.length),v.data&&(v.processData||"string"==typeof v.data)&&(f+=(Tt.test(f)?"&":"?")+v.data,delete v.data),!1===v.cache&&(f=f.replace(Dt,"$1"),o=(Tt.test(f)?"&":"?")+"_="+wt.guid+++o),v.url=f+o),v.ifModified&&(S.lastModified[f]&&T.setRequestHeader("If-Modified-Since",S.lastModified[f]),S.etag[f]&&T.setRequestHeader("If-None-Match",S.etag[f])),(v.data&&v.hasContent&&!1!==v.contentType||t.contentType)&&T.setRequestHeader("Content-Type",v.contentType),T.setRequestHeader("Accept",v.dataTypes[0]&&v.accepts[v.dataTypes[0]]?v.accepts[v.dataTypes[0]]+("*"!==v.dataTypes[0]?", "+Rt+"; q=0.01":""):v.accepts["*"]),v.headers)T.setRequestHeader(i,v.headers[i]);if(v.beforeSend&&(!1===v.beforeSend.call(y,T,v)||h))return T.abort();if(u="abort",b.add(v.complete),T.done(v.success),T.fail(v.error),c=Wt(Pt,v,t,T)){if(T.readyState=1,g&&m.trigger("ajaxSend",[T,v]),h)return T;v.async&&0<v.timeout&&(d=C.setTimeout(function(){T.abort("timeout")},v.timeout));try{h=!1,c.send(a,l)}catch(e){if(h)throw e;l(-1,e)}}else l(-1,"No Transport");function l(e,t,n,r){var i,o,a,s,u,l=t;h||(h=!0,d&&C.clearTimeout(d),c=void 0,p=r||"",T.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}(v,T,n)),!i&&-1<S.inArray("script",v.dataTypes)&&S.inArray("json",v.dataTypes)<0&&(v.converters["text script"]=function(){}),s=function(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}(v,s,T,i),i?(v.ifModified&&((u=T.getResponseHeader("Last-Modified"))&&(S.lastModified[f]=u),(u=T.getResponseHeader("etag"))&&(S.etag[f]=u)),204===e||"HEAD"===v.type?l="nocontent":304===e?l="notmodified":(l=s.state,o=s.data,i=!(a=s.error))):(a=l,!e&&l||(l="error",e<0&&(e=0))),T.status=e,T.statusText=(t||l)+"",i?x.resolveWith(y,[o,l,T]):x.rejectWith(y,[T,l,a]),T.statusCode(w),w=void 0,g&&m.trigger(i?"ajaxSuccess":"ajaxError",[T,v,i?o:a]),b.fireWith(y,[T,l]),g&&(m.trigger("ajaxComplete",[T,v]),--S.active||S.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return S.get(e,t,n,"json")},getScript:function(e,t){return S.get(e,void 0,t,"script")}}),S.each(["get","post"],function(e,i){S[i]=function(e,t,n,r){return m(t)&&(r=r||n,n=t,t=void 0),S.ajax(S.extend({url:e,type:i,dataType:r,data:t,success:n},S.isPlainObject(e)&&e))}}),S.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")}),S._evalUrl=function(e,t,n){return S.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){S.globalEval(e,t,n)}})},S.fn.extend({wrapAll:function(e){var t;return this[0]&&(m(e)&&(e=e.call(this[0])),t=S(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(n){return m(n)?this.each(function(e){S(this).wrapInner(n.call(this,e))}):this.each(function(){var e=S(this),t=e.contents();t.length?t.wrapAll(n):e.append(n)})},wrap:function(t){var n=m(t);return this.each(function(e){S(this).wrapAll(n?t.call(this,e):t)})},unwrap:function(e){return this.parent(e).not("body").each(function(){S(this).replaceWith(this.childNodes)}),this}}),S.expr.pseudos.hidden=function(e){return!S.expr.pseudos.visible(e)},S.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},S.ajaxSettings.xhr=function(){try{return new C.XMLHttpRequest}catch(e){}};var Bt={0:200,1223:204},$t=S.ajaxSettings.xhr();y.cors=!!$t&&"withCredentials"in $t,y.ajax=$t=!!$t,S.ajaxTransport(function(i){var o,a;if(y.cors||$t&&!i.crossDomain)return{send:function(e,t){var n,r=i.xhr();if(r.open(i.type,i.url,i.async,i.username,i.password),i.xhrFields)for(n in i.xhrFields)r[n]=i.xhrFields[n];for(n in i.mimeType&&r.overrideMimeType&&r.overrideMimeType(i.mimeType),i.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)r.setRequestHeader(n,e[n]);o=function(e){return function(){o&&(o=a=r.onload=r.onerror=r.onabort=r.ontimeout=r.onreadystatechange=null,"abort"===e?r.abort():"error"===e?"number"!=typeof r.status?t(0,"error"):t(r.status,r.statusText):t(Bt[r.status]||r.status,r.statusText,"text"!==(r.responseType||"text")||"string"!=typeof r.responseText?{binary:r.response}:{text:r.responseText},r.getAllResponseHeaders()))}},r.onload=o(),a=r.onerror=r.ontimeout=o("error"),void 0!==r.onabort?r.onabort=a:r.onreadystatechange=function(){4===r.readyState&&C.setTimeout(function(){o&&a()})},o=o("abort");try{r.send(i.hasContent&&i.data||null)}catch(e){if(o)throw e}},abort:function(){o&&o()}}}),S.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),S.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return S.globalEval(e),e}}}),S.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),S.ajaxTransport("script",function(n){var r,i;if(n.crossDomain||n.scriptAttrs)return{send:function(e,t){r=S("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",i=function(e){r.remove(),i=null,e&&t("error"===e.type?404:200,e.type)}),E.head.appendChild(r[0])},abort:function(){i&&i()}}});var _t,zt=[],Ut=/(=)\?(?=&|$)|\?\?/;S.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=zt.pop()||S.expando+"_"+wt.guid++;return this[e]=!0,e}}),S.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,o,a=!1!==e.jsonp&&(Ut.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ut.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=m(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Ut,"$1"+r):!1!==e.jsonp&&(e.url+=(Tt.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return o||S.error(r+" was not called"),o[0]},e.dataTypes[0]="json",i=C[r],C[r]=function(){o=arguments},n.always(function(){void 0===i?S(C).removeProp(r):C[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,zt.push(r)),o&&m(i)&&i(o[0]),o=i=void 0}),"script"}),y.createHTMLDocument=((_t=E.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===_t.childNodes.length),S.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(y.createHTMLDocument?((r=(t=E.implementation.createHTMLDocument("")).createElement("base")).href=E.location.href,t.head.appendChild(r)):t=E),o=!n&&[],(i=N.exec(e))?[t.createElement(i[1])]:(i=xe([e],t,o),o&&o.length&&S(o).remove(),S.merge([],i.childNodes)));var r,i,o},S.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return-1<s&&(r=ht(e.slice(s)),e=e.slice(0,s)),m(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),0<a.length&&S.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?S("<div>").append(S.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},S.expr.pseudos.animated=function(t){return S.grep(S.timers,function(e){return t===e.elem}).length},S.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l=S.css(e,"position"),c=S(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),o=S.css(e,"top"),u=S.css(e,"left"),("absolute"===l||"fixed"===l)&&-1<(o+u).indexOf("auto")?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),m(t)&&(t=t.call(e,n,S.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+i),"using"in t?t.using.call(e,f):c.css(f)}},S.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){S.offset.setOffset(this,t,e)});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===S.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===S.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=S(e).offset()).top+=S.css(e,"borderTopWidth",!0),i.left+=S.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-S.css(r,"marginTop",!0),left:t.left-i.left-S.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===S.css(e,"position"))e=e.offsetParent;return e||re})}}),S.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,i){var o="pageYOffset"===i;S.fn[t]=function(e){return $(this,function(e,t,n){var r;if(x(e)?r=e:9===e.nodeType&&(r=e.defaultView),void 0===n)return r?r[i]:e[t];r?r.scrollTo(o?r.pageXOffset:n,o?n:r.pageYOffset):e[t]=n},t,e,arguments.length)}}),S.each(["top","left"],function(e,n){S.cssHooks[n]=Fe(y.pixelPosition,function(e,t){if(t)return t=We(e,n),Pe.test(t)?S(e).position()[n]+"px":t})}),S.each({Height:"height",Width:"width"},function(a,s){S.each({padding:"inner"+a,content:s,"":"outer"+a},function(r,o){S.fn[o]=function(e,t){var n=arguments.length&&(r||"boolean"!=typeof e),i=r||(!0===e||!0===t?"margin":"border");return $(this,function(e,t,n){var r;return x(e)?0===o.indexOf("outer")?e["inner"+a]:e.document.documentElement["client"+a]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+a],r["scroll"+a],e.body["offset"+a],r["offset"+a],r["client"+a])):void 0===n?S.css(e,t,i):S.style(e,t,n,i)},s,n?e:void 0,n)}})}),S.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){S.fn[t]=function(e){return this.on(t,e)}}),S.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,n){S.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)}});var Xt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;S.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),m(e))return r=s.call(arguments,2),(i=function(){return e.apply(t||this,r.concat(s.call(arguments)))}).guid=e.guid=e.guid||S.guid++,i},S.holdReady=function(e){e?S.readyWait++:S.ready(!0)},S.isArray=Array.isArray,S.parseJSON=JSON.parse,S.nodeName=A,S.isFunction=m,S.isWindow=x,S.camelCase=X,S.type=w,S.now=Date.now,S.isNumeric=function(e){var t=S.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},S.trim=function(e){return null==e?"":(e+"").replace(Xt,"")},"function"==typeof define&&define.amd&&define("jquery",[],function(){return S});var Vt=C.jQuery,Gt=C.$;return S.noConflict=function(e){return C.$===S&&(C.$=Gt),e&&C.jQuery===S&&(C.jQuery=Vt),S},"undefined"==typeof e&&(C.jQuery=C.$=S),S});
(function(e){if(e.Tangular)return;var t={};var v=t.helpers={};t.version='v5.0.5';t.cache={};e.Ta=e.Tangular=t;e.Thelpers=v;var s={null:true,undefined:true,true:true,false:true,Object:1,String:1,Number:1,Boolean:1,Date:1,Array:1,window:1,global:1,arguments:1,eval:1,Function:1,function:1,var:1,let:1,const:1,delete:1};var l=/\{\{.*?\}\}/g;var u=/\{\{|\}\}/g;var n=/[<>&"]/g;var o=/\n$/g;function w(e,r){var t='';var n=[];var i=0;for(var a=0;a<e.length;a++){var l=e.charCodeAt(a);if(!i){if(t&&l>47&&l<58||l>64&&l<91||l>96&&l<123||(l===95||l===36)){t+=e.charAt(a);continue}if(t){if(!s[t]&&n.indexOf(t)===-1&&(!r||r.indexOf(t)===-1))n.push(t);t=''}}if(l===46||l===124){i=l}else if((i===46||i===124)&&l===40){i=0}else if(l===96||l===34||l===39){if(l===i)i=0;else i=l}}if(t&&!s[t]&&n.indexOf(t)===-1&&(!r||r.indexOf(t)===-1))n.push(t);return n}t.toArray=function(e){var r=Object.keys(e);var t=[];for(var n=0,i=r.length;n<i;n++)t.push({key:r[n],value:e[r[n]]});return t};function i(){this.commands;this.variables;this.builder;this.split='\0'}i.prototype.compile=function(e,r,t){var g=this;var m=0;var b=0;var $=[];var a=l;var y=u;var x;if(r&&t){a=new RegExp(r+'.*?'+t,'g');y=new RegExp(r+'|'+t,'g')}g.template=e;e=e.replace(/\|\|/g,'');g.variables={};g.commands=[];g.builder=e.replace(a,function(f){var e=f.replace(y,'').trim();var r=null;var t=null;var n;var c=false;var v=false;var p=true;if(e==='fi'){m--}else if(e==='end'){b--;$.pop()}else if(e.substring(0,3)==='if '){m++;r=w(e.substring(3),$);if(r.length){for(var i=0;i<r.length;i++){var a=r[i];if(g.variables[a])g.variables[a]++;else g.variables[a]=1}}else r=null;c=true;p=true}else if(e.substring(0,8)==='foreach '){b++;x=e.substring(8).split(' ');$.push(x[0].trim());n=x[2].indexOf('.');if(n!==-1)x[2]=x[2].substring(0,n);r=x[2].trim();if($.indexOf(r)===-1){if(g.variables[r])g.variables[r]++;else g.variables[r]=1;r=[r]}else r=null;v=true}else if(e.substring(0,8)==='else if '){r=w(e.substring(8),$);if(r.length){for(var i=0;i<r.length;i++){var a=r[i];if(g.variables[a])g.variables[a]++;else g.variables[a]=1}}else r=null;c=true}else if(e!=='continue'&&e!=='break'&&e!=='else'){r=w(e);var l=false;for(var i=0;i<r.length;i++){var s=r[i];if(s+'('===e.substring(0,s.length+1)){l=true;continue}if(g.variables[s])g.variables[s]++;else g.variables[s]=1}if(!r.length)r=null;var u=e.indexOf('|');var h=null;if(l){h=e.substring(0,u===-1?e.length:u);if(u===-1)e='';else e=''+e.substring(n)}else if(!l&&u===-1)e+=' | encode';t=e.split('|');e=t[0];t=t.slice(1);if(l)t.unshift(h);if(t.length){for(var i=0;i<t.length;i++){var o=t[i].trim();var d=l&&!i;n=o.indexOf('(');if(n===-1){o='Thelpers.$execute($helpers,model,\''+o+'\','+(d?'':')')}else o='Thelpers.$execute($helpers,model,\''+o.substring(0,n)+'\','+(d?'':',')+o.substring(n+1);t[i]=o}}else t=null;e=g.safe(e.trim()||'model');p=false}g.commands.push({index:g.commands.length,cmd:e,ifcount:m,loopcount:b,variable:r,helpers:t,isloop:v,isif:c,iscode:p});return g.split}).split(g.split);for(var n=0;n<g.builder.length;n++){var i=g.builder[n];g.builder[n]=i?i.replace(o,''):i}return g.make()};i.prototype.safe=function(e){var r=e.split('.');var t=[];for(var n=1;n<r.length;n++){var i=r.slice(0,n).join('.');t.push(i+'==null?\'\':')}return t.join('')+r.join('.')};i.prototype.make=function(){var e=this;var r=['var $output=$text[0];var $tmp;var $index=0;'];for(var t=0,f=e.commands.length;t<f;t++){var n=e.commands[t];var i;t&&r.push('$output+=$text['+t+'];');if(n.iscode){if(n.isloop){var a='$i'+Math.random().toString(16).substring(3,6);var l=a+'a';var c=n.cmd.lastIndexOf(' in ');if(c===-1)c=n.cmd.lastIndexOf(' of ');i=n.cmd.substring(c+4).trim();i=l+'='+e.safe(i)+';if(!('+l+' instanceof Array)){if('+l+'&&typeof('+l+')===\'object\')'+l+'=Tangular.toArray('+l+')}if('+l+' instanceof Array&&'+l+'.length){for(var '+a+'=0,'+a+'l='+l+'.length;'+a+'<'+a+'l;'+a+'++){$index='+a+';var '+n.cmd.split(' ')[1]+'='+l+'['+a+'];';r.push(i)}else if(n.isif){if(n.cmd.substring(0,8)==='else if ')r.push('}'+n.cmd.substring(0,8).trim()+'('+n.cmd.substring(8).trim()+'){');else r.push(n.cmd.substring(0,3).trim()+'('+n.cmd.substring(3).trim()+'){')}else{switch(n.cmd){case'else':r.push('}else{');break;case'end':r.push('}}');break;case'fi':r.push('}');break;case'break':r.push('break;');break;case'continue':r.push('continue;');break}}}else{if(n.helpers){var s='';for(var u=0;u<n.helpers.length;u++){var v=n.helpers[u];if(u===0)s=v.replace('',n.cmd.trim()).trim();else s=v.replace('',s.trim())}r.push('$tmp='+s+';if($tmp!=null)$output+=$tmp;')}else r.push('if('+n.cmd+'!=null)$output+='+n.cmd+';')}}r.push((f?'$output+=$text['+f+'];':'')+'return $output.charAt(0) === \'\\n\'?$output.substring(1):$output;');delete e.variables.$;var o=Object.keys(e.variables);var p=['$helpers||{}','$||{}','model'];for(var t=0;t<o.length;t++)p.push('model.'+o[t]);for(var t=0;t<e.builder.length;t++)e.builder[t]=e.builder[t].replace(/\1/g,'||');var h='var tangular=function($helpers,$,model'+(o.length?','+o.join(','):'')+'){'+r.join('')+'};return function(model,$,$helpers){try{return tangular('+p.join(',')+')}catch(e){console.error(\'Tangular error:\',e + \'\',$template)}}';return new Function('$text','$template',h.replace(/\1/g,'||'))(e.builder,e.template)};v.$execute=function(e,r,t,n,i,a,l,s,u,f,c){var o=e[t]||v[t];if(!o){console&&console.warn('Tangular: missing helper','"'+t+'"');return n}return o.call(r,n,i,a,l,s,u,f,c)};v.encode=function(e,r){if(r){if(typeof r==='function')return r(e);if(r==='json')return JSON.stringify(e);if(r==='json2')return JSON.stringify(e,null,'\t');if(r==='url'||r==='urlencoded')return encodeURIComponent(e);if(r==='querify')return QUERIFY(e)}return e==null?'':(e+'').replace(n,function(e){switch(e){case'&':return'&amp;';case'<':return'&lt;';case'>':return'&gt;';case'"':return'&quot;'}return e})};v.raw=function(e){return e};t.render=function(e,r,t,n){var e=(new i).compile(e);return e(r==null?{}:r,t,n)};t.compile=function(e,r,t){return(new i).compile(e,r,t)};t.register=function(e,r){v[e]=r;return t}})(window);
Thelpers.pluralize=function(r,e,t,a,n){return r||(r=0),'number'!=typeof r&&(r=parseFloat(r.toString().replace(/\s/g,'').replace(',','.'))),r.pluralize(e,t,a,n)},Thelpers.format=function(r,e,t,a){var n=typeof r;if(r==null)return'';if('number'===n||r instanceof Date)return r.format(e==null?null:e,t,a);'string'!==n&&(r=r.toString()),r=r.trim();for(var i=!1,o=0,f=0,u=0,l=r.length;l>u;u++){var g=r.charCodeAt(u);if(58===g||32===g||84===g){i=!0;break}if(45===g){if(o++,1===o)continue;i=!0;break}if(46===g){if(f++,1===f)continue;i=!0;break}}return i?r.parseDate().format(e||'dd.MM.yyyy'):r.parseFloat().format(e,t,a)};Thelpers.def=Thelpers.empty=function(e,n){return e?Thelpers.encode(e):n||DEF.empty};Thelpers.currency=function(e,t){switch(typeof e){case'number':return e.currency(t);case'string':return e.parseFloat().currency(t);default:return''}};Thelpers.cl=function(id,name,key){var cl=DEF.cl[name];return cl instanceof Array?cl.findValue('id',id,key||'name',key?'':DEF.empty):(key?'':DEF.empty)};Thelpers.clicon=function(id,name,key){var cl=DEF.cl[name];var item = cl instanceof Array?cl.findItem('id',id):null;return item?((item.icon?('<i class="'+item.icon+' mr5"'+(item.color?(' style="color:'+item.color+'"'):'')+'></i>'):'')+(item[key||'name']||'')):''};
(function(p){var v='NAV.';var h={version:16.3,hashtags:false,middlewares:{},params:[],query:{},query2:{},routes:[],url:'',count:0};var d={$prev:[],$next:[],isReady:false,LIMIT_HISTORY:100,LIMIT_HISTORY_ERROR:100};h.history=d.$prev;var f=location;!p.NAV&&(p.NAV=h);h.custom=function(r){h.$custom=true;if(r==null||r==true||typeof r==='string')CACHEPATH('NAV.href',r==null||r==true?'1 month':r)};h.remember=function(r,e){if(e===null)delete h.query2[r];else h.query2[r]=e==undefined?h.query[r]:e};h.remove=function(r){r=r.env(true).ROOT(true);var e=[];for(var t=0;t<h.routes.length;t++)h.routes[t].id!==r&&e.push(h.routes[t]);h.routes=e;return h};h.autosave=function(){h.$save=1};h.save=function(){try{localStorage.setItem(DEF.localstorage+'.nav',STRINGIFY({prev:d.$prev,next:d.$next,ts:new Date}))}catch(r){}};h.load=function(){try{var r=PARSE(localStorage.getItem(DEF.localstorage+'.nav')||'null');if(r){if(r.prev instanceof Array)d.$prev=h.history=r.prev;if(r.next instanceof Array)d.$next=r.next;h.$pop=true}}catch(r){}};p.ROUTE=function(r,e,t,n){var i;if(e instanceof Array){var i=t;t=e;e=i}if(typeof t==='function'){i=n;n=t;t=i}r=r.env(true).ROOT(true);var a=r.jRcount('/')+(r.indexOf('*')===-1?0:10);var u=h._route(r.trim());var o=[];if(typeof t==='string')t=t.split(',').trim();var s=[];var l=[];var c={};t instanceof Array&&t.forEach(function(r){if(typeof r==='object')c=r;else if(r.substring(0,1)==='@')l.push(r.substring(1));else s.push(r)});if(r.indexOf('{')!==-1){a-=100;for(var f=0;f<u.length;f++)u[f].substring(0,1)==='{'&&o.push(f);a-=o.length}h.remove(r);h.routes.push({id:r,url:u,fn:e,priority:a,params:o,middleware:s.length?s:null,init:n,count:0,pending:false,options:c,roles:l});h.routes.sort(function(r,e){return r.priority>e.priority?-1:r.priority<e.priority?1:0});h.is404&&(r===h.url||r.indexOf('{')!==-1)&&p.REDIRECT(h.href+location.hash);EMIT('route',r);return h};p.MIDDLEWARE=function(r,e){if(r instanceof Array){r.wait(function(r,e){var t=h.middlewares[r];if(t)t(e);else e()},e);return h}h.middlewares[r]=e;return h};h.refresh=function(){return h.location(h.url,true)};h.reload=function(){return h.refresh()};h._route=function(r){if(r.charCodeAt(0)===47)r=r.substring(1);if(r.charCodeAt(r.length-1)===47)r=r.substring(0,r.length-1);var e=r.split('/');if(e.length===1&&!e[0])e[0]='/';return e};h._route_param=function(r,e){var t=[];if(!e||!r)return t;var n=e.params.length;if(n){for(var i=0;i<n;i++){var a=r[e.params[i]];t.push(a==='/'||/\{|\}/.test(a)?'':a)}}return t};h._route_compare=function(r,e){var t=r.length;var n=t===1&&r[0]==='/';if(e.length!==t)return false;for(var i=0;i<t;i++){var a=e[i];if(!a)return false;if(!n&&a.charCodeAt(0)===123)continue;if(a==='*')return true;if(r[i]!==a)return false}return true};h.location=function(r,e){if(r)NAV.href=r;d.isReady=true;var t=r.indexOf('?');var n='';if(t!==-1){n=r.substring(t);r=r.substring(0,t)}r=g(r);r=h.path(r);var i=h._route(r);var a=[];var u=true;var o=[];o.push.apply(o,i);for(var s=0;s<i.length;s++)i[s]=i[s].toLowerCase();if(!e&&h.url.length&&h.prev()!==h.url){if(h.$pop)h.$pop=false;else{d.$prev.push(h.url);d.$prev.length>h.LIMIT_HISTORY&&d.$prev.shift();d.$next.length>h.LIMIT_HISTORY&&d.$next.shift();h.$save&&h.save()}}if(h.isback!==d.$prev.length)SET(v+'isback',d.$prev.length);if(h.isforward!==d.$next.length)SET(v+'isforward',d.$next.length);for(var s=0;s<h.routes.length;s++){var f=h.routes[s];if(!h._route_compare(i,f.url))continue;if(f.url.indexOf('*')===-1)u=false;if(f.once&&f.count>0)continue;f.count++;a.push(f);break}var l=false;var c=[];var p=h.url;h.url=r;if(h.url!==p)UPD(v+'url');UPD(v+'href');h._params(n);h.params=h._route_param(o,f);UPD(v+'params');h.is404=false;EMIT('location',r);for(var s=0;s<a.length;s++){var f=a[s];if(f.pending)continue;if(!f.middleware||!f.middleware.length){if(!f.init){f.fn.apply(h,h.params);continue}f.pending=true;(function(r){r.init(function(){r.fn.apply(h,h.params);r.pending=false})})(f);f.init=null;continue}(function(e){var r=e.middleware.length;var n=[];var i=h.url;for(var t=0;t<r;t++){var a=e.middleware[t];if(a.charAt(0)==='#'){(function(e){n.push(r=>CL(e,()=>r()))})(a.substring(1));continue}var u=h.middlewares[a];u&&function(e,t){n.push(function(r){if(h.url!==i){n=null;r=null;e.pending=false}else t.call(h,r,e.options,e.roles,e)})}(e,u)}if(!e.init){e.pending=true;n.jRmiddleware(function(r){if(h.url===i)!r&&e.fn.apply(h,h.params);e.pending=false},e);return}e.pending=true;e.init(function(){n.jRmiddleware(function(r){if(h.url===i)!r&&e.fn.apply(h,h.params);e.pending=false},e)});e.init=null})(f)}l&&h.status(500,c);if(u){h.is404=true;h.status(404)}else h.is404=false};h.prev=function(){return d.$prev[d.$prev.length-1]};h.next=function(){return d.$next[d.$next.length-1]};h.back=function(){var r=d.$prev.pop()||'/';if(h.url&&h.next()!==h.url)d.$next.push(h.url);h.url='';p.REDIRECT(r);h.$save&&h.save();return h};h.forward=function(){var r=d.$next.pop()||'/';if(h.url&&h.prev()!==h.url)d.$prev.push(h.url);h.url='';p.REDIRECT(r);h.$save&&h.save();return h};h.status=function(r,e){EMIT(r+'',e);return h};NAV.redirect=p.REDIRECT=function(r){if(!r)r=h.url;var e=false;r=r.env(true).ROOT(true).replace(/\s(@)?nohistory/i,function(){e=true;return''});if(Object.keys(h.query2).length)r=QUERIFY(r,h.query2);r=r.flags(null,r,'redirect');if(r.indexOf('./')!==-1){var t=NAV.url;var n=r.indexOf('?');var i=n===-1?'':r.substring(n);if(r==='./'){REDIRECT(NAV.url);return}var a=r.match(/\.\.\//g);var u=t.split('/').trim();t='/'+u.splice(0,u.length-a.length).join('/');if(t.charAt(t.length-1)!=='/')t+='/';t+=i;REDIRECT(t);return}var o=r.charCodeAt(0);var s=f;if(o===35){s.hash=r;h.location(r,false)}else if(h.$custom){h.location(r,false)}else if(history.pushState){if(!e)history.pushState(null,null,r);h.location(s.pathname+s.search,false)}else s.href=r};h._params=function(r){var e={};h.queryraw=(r||f.search).substring(1);var t=h.queryraw.split('&');for(var n=0;n<t.length;n++){var i=t[n].replace(/\+/g,'%20').split('=');if(i.length!==2)continue;var a=decodeURIComponent(i[0]);var u=decodeURIComponent(i[1]);var o=e[a]instanceof Array;if(e[a]&&!o)e[a]=[e[a]];if(o)e[a].push(u);else e[a]=u}h.query=e;var s=v+'query';p.M&&UPD(s);return h};h.path=function(r,e){if(r.substring(0,1)==='#')return r;if(!e)e='/';var t=r.indexOf('?');var n='';if(t!==-1){n=r.substring(t);r=r.substring(0,t)}var i=r.length;var a=r.substring(i-1,i);if(a!==e)r+=e;return r+n};function g(r){if(r.substring(0,1)==='#')return r;var e=r.indexOf('#');return e!==-1?r.substring(0,e):r}Array.prototype.jRmiddleware=function(e,t){var n=this;var r=n.shift();if(r===undefined){e&&e();return n}r(function(r){if(r instanceof Error||r===false)e&&e(r===false?true:r);else setTimeout(function(){n.jRmiddleware(e,t)},1)},t.options,t.roles);return n};String.prototype.jRcount=function(r){var e=0;var t=0;do{e=this.indexOf(r,e+r.length);if(e>0)t++}while(e>0);return t};h.clientside=function(r){$(document).on('click',r,function(r){r.preventDefault();var e=$(this);var t=e.attr('href')||e.attrd('href')||e.attrd('url');if(t!=='javas'+'cript:vo'+'id(0)'&&t!=='#')p.REDIRECT(t)});return h};function r(){NAV.ua=MAIN.ua;$(document).ready(function(){if(!h.$custom){if(h.hashtags)h.url=f.hash||h.path(g(f.pathname));else h.url=h.path(g(f.pathname))}setTimeout(function(){if(!d.isReady)h.location(h.href||h.url)},5);$(p).on('hashchange',function(){d.isReady&&h.hashtags&&h.location(h.path(f.hash))}).on('popstate',function(){if(d.isReady&&!h.hashtags&&!h.$custom){var r=h.path(f.pathname);h.url!==r&&h.location(r)}})})}if(p.jQuery&&p.MAIN&&p.MAIN.loaded){r()}else{h.init=setInterval(function(){if(p.jQuery&&p.MAIN&&p.MAIN.loaded){clearInterval(h.init);r()}},100)}h._params()})(window);

(function() {

	// Constants
	var REGMETHOD = /GET|POST|PATCH|PUT|DELETE\s/;
	var REGCOM = /(data--|data---|data-import|-bind|bind)=|COMPONENT\(/;
	var REGSCRIPT = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGCSS = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGENV = /(\[.*?\])/gi;
	var REGPARAMS = /\{{1,2}[a-z0-9_.-\s]+\}{1,2}/gi;
	var REGCOMMA = /,/g;
	var REGSEARCH = /[^a-zA-Zá-žÁ-Žа-яА-Я\d\s:]/g;
	var REGFNPLUGIN = /[a-z0-9_-]+\/[a-z0-9_]+\(|(^|(?=[^a-z0-9]))@[a-z0-9-_]+\./i;
	var REGMETA = /_{2,}/;
	var REGAJAXFLAGS = /\s(repeat|cancel|urlencoded|json|noencrypt|nodecrypt|nocsrf|error|#[a-z0-9_-]+|@[a-z0-9_-]+)/gi;
	var REGBINDERCOMPARE = /^[^a-z0-9.]/;
	var REGWILDCARD = /\.\*/;
	var REGISARR = /\[\d+\]$/;
	var REGSCOPEINLINE = /\?/g;
	var REGSCOPECHECK = /\?\/|\?\./;
	var REGSCOPEREPLACE = /\?\//g;
	var REGSCR = /SCR/g;
	var REGNUM = /^(-)?[0-9.]+$/;
	var REGFLAGS = /\s@[a-z0-9]+/gi;
	var REGCL = /\s#[a-z0-9_-]+/gi;
	var T_COM = '---';
	var T_ = '--';
	var T_DATA = 'data-';
	var ATTRCOM = 'ui-component,[data--],[data' + T_COM + ']';
	var ATTRBIND = 'ui-bind,[data-bind],[bind]';
	var ATTRJCBIND = 'data-jc-bind';
	var ATTRDATA = 'jc';
	var ATTRDEL = T_DATA + 'jc-removed';
	var DIACRITICS = { 225:'a',228:'a',269:'c',271:'d',233:'e',283:'e',357:'t',382:'z',250:'u',367:'u',252:'u',369:'u',237:'i',239:'i',244:'o',243:'o',246:'o',353:'s',318:'l',314:'l',253:'y',255:'y',263:'c',345:'r',341:'r',328:'n',337:'o' };
	var ACTRLS = { INPUT: true, TEXTAREA: true, SELECT: true };
	var DEFMODEL = { value: null };
	var MULTIPLE = /\s\+\s|\s/;
	var SCOPENAME = 'scope';
	var PLUGINNAME = 'plugin';
	var ATTRSCOPE2 = T_DATA + '' + SCOPENAME;
	var ATTRPLUGIN = T_DATA + '' + PLUGINNAME;
	var TYPE_FN = 'function';
	var TYPE_S = 'string';
	var TYPE_N = 'number';
	var TYPE_O = 'object';
	var TYPE_B = 'boolean';
	var TYPE_NULL = 'null';
	var KEY_ENV = 'env';
	var REG_TIME = /am|pm/i;
	var T_CSRF = 'x-csrf-token';
	var T_BODY = 'BODY';
	var T_PATH = 'path';
	var T_DISABLED = 'disabled';
	var T_HIDDEN = 'hidden';
	var T_WIDTH = 'width';
	var T_HEIGHT = 'height';
	var T_CHECKED = 'checked';
	var T_VALUE = 'value';
	var T_RESIZE = 'resize';
	var T_FALSE = 'false';
	var T_TRUE = 'true';
	var T_RESPONSE = 'response';
	var T_VALID = 'valid';
	var T_DIRTY = 'dirty';
	var T_BIND = 'bind';
	var T_TEMPLATE = 'template';
	var T_VBINDARR = 'vbindarray';
	var T_SCRIPT = 'script';
	var T_PATHS = 'PATHS';
	var T_CLASS = 'class';
	var T_HTML = 'html';
	var T_CONFIG = 'config';
	var T_DEFAULT = 'default';
	var T_COMPILED = 'jc-compile';
	var T_IMPORT = 'import';
	var T_TMP = 'jctmp.';
	var T_UNKNOWN = 'UNKNOWN';
	var T_CLICK = 'click';
	var ERRCONN = 'ERR_CONNECTION_CLOSED';
	var OK = Object.keys;
	var SKIPBODYENCRYPTOR = { ':': 1, '"': 1, '[': 1, ']': 1, '\'': 1, '_': 1, '{': 1, '}': 1, '&': 1, '=': 1, '+': 1, '-': 1, '\\': 1, '/': 1, ',': 1 };
	var SKIPCUSTOMELEMENTS = { component: 1, bind: 1, import: 1, plugin: 1 };
	var ERREXEC = 'jC: The method "{0}" not found';
	var ERRSETTER = 'jC: The component method "{0}" not found';
	var ERRPLUGIN = 'Plugin "{0}" not found';
	var debug = false;

	// No scrollbar
	var W = window;
	var D = document;
	var $W = $(W);

	var THROWERR = function(e) {
		W.console && W.console.error(e);
	};

	var LCOMPARER = function(a, b) {
		if (!a && !b)
			return 0;
		if (!a && b)
			return -1;
		if (a && !b)
			return 1;
		return W.Intl ? W.Intl.Collator().compare(a, b) : (a + '').localeCompare(b + '');
	};

	var LCOMPARER_DESC = function(a, b) {
		if (!a && !b)
			return 0;
		if (!a && b)
			return 1;
		if (a && !b)
			return -1;
		return (W.Intl ? W.Intl.Collator().compare(a, b) : (a + '').localeCompare(b + '')) * -1;
	};

	var C = {}; // COMPILER
	var M = {}; // MAIN
	var LS = W.localStorage;
	var PREF = {};
	var PREFBLACKLIST = { set: 1, get: 1, save: 1, load: 1, keys: 1 };
	var PREFLOADED = 0;

	var warn = W.WARN = function() {
		W.console && W.console.warn.apply(W.console, arguments);
	};

	// Source: https://stackoverflow.com/questions/5353934/check-if-element-is-visible-on-screen
	W.VISIBLE = function(el, threshold, mode) {

		if (el instanceof jQuery)
			el = el[0];

		if (el.parentNode && el.parentNode.tagName !== T_BODY) {
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

	W.STOPDEBUG = (function(){(function a(){try{(function b(i){if((''+(i/i)).length!==1||i%20===0){(function(){}).constructor('debugger')()}else{debugger}b(++i)})(0)}catch(e){setTimeout(a,5000)}})()});

	W.HIDDEN = function(el) {
		if (el == null)
			return true;
		if (el instanceof jQuery)
			el = el[0];
		return el.parentNode && el.parentNode.tagName === T_BODY ? false : W.isIE ? (!el.offsetWidth && !el.offsetHeight) : !el.offsetParent;
	};

	W.LOCALIZE = function(str) {

		var arr = str.split('\n');

		for (var i = 0; i < arr.length; i++) {
			var line = arr[i].trim();
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

	W.TRANSLATE = function(str) {

		if (!str || typeof(str) !== TYPE_S || str.indexOf('@(') === -1)
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

	var prefsave = function() {
		var keys = OK(PREF);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			var item = PREF[key];
			if (item && item.expire > NOW)
				PREF[key] = item;
			else
				delete PREF[key];
		}
		W.PREF.save(PREF);
	};

	var prefload = function(data) {

		if (typeof(data) === TYPE_S)
			data = PARSE(data);

		if (data) {
			var remove = false;
			for (var key in data) {
				var item = data[key];
				if (item && item.expire > NOW) {
					PREF[key] = item;
					if (!PREFBLACKLIST[key])
						W.PREF[key] = item.value;
				} else
					remove = true;
			}

			if (PREF.PATHS) {
				for (var key in PREF.PATHS)
					M.set(key, PREF.PATHS[key], true);
			}

			remove && setTimeout2('PREF', W.PREF.save, 1000, null, PREF);
		}

		M.loaded = true;
		PREFLOADED = 1;

		for (let m of plugininit)
			W.PLUGIN(m.name, m.fn);

		for (let m of pluginelements)
			findscope(m);

		for (let m of comelements)
			htmlcomponentparse2(m);

		for (let m of bindelements)
			NEWUIBIND(m.el, m.path, m.config);

		plugininit.length = 0;
		pluginelements.length = 0;
		comelements.length = 0;
		bindelements.length = 0;

		NOTIFY('PREF');
		compile();
	};

	var PR = W.PREF = {};

	PR.get = function(key, expire) {
		var tmp = PREF[key];
		var val = tmp && tmp.expire > NOW ? tmp.value : undefined;
		if (expire && val !== undefined)
			PR.set(key, val, expire);
		return val;
	};

	PR.set = function(key, value, expire) {

		if (value === undefined) {
			delete PREF[key];
			if (!PREFBLACKLIST[key])
				delete W.PREF[key];
		} else {
			PREF[key] = { value: value, expire: NOW.add(expire || '1 month') };
			if (!PREFBLACKLIST[key])
				W.PREF[key] = value;
		}

		NOTIFY('PREF.' + key);
		setTimeout2('PREF', prefsave, MD.delaypref);
		return value;
	};

	PR.keys = function() {
		return OK(PREF);
	};

	PR.load = function(callback) {
		callback(!W.isPRIVATEMODE && PARSE(LS.getItem(MD.localstorage + '.pref')));
	};

	PR.save = function(data) {
		!W.isPRIVATEMODE && LS.setItem(MD.localstorage + '.pref', STRINGIFY(data));
	};

	// temporary
	W.jctmp = {};
	W.W = W;
	W.FUNC = {};
	W.REPO = {};

	try {
		var pmk = 'jc.test';
		LS.setItem(pmk, '1');
		W.isPRIVATEMODE = LS.getItem(pmk) !== '1';
		LS.removeItem(pmk);
	} catch (e) {
		W.isPRIVATEMODE = true;
		warn('jC: localStorage is disabled');
	}

	// Internal cache
	var scrollbarwidth = null;
	var blocked = {};
	var storage = {};
	var extensions = {}; // COMPONENT_EXTEND()
	var configs = [];
	var cache = {};
	var fallback = { $: 0 }; // $ === count of new items in fallback
	var fallbackpending = [];
	var paths = {}; // saved paths from get() and set()
	var events = {};
	var watches = [];
	var temp = {};
	var toggles = [];
	var versions = {};
	var autofill = [];
	var plugininit = [];
	var pluginelements = [];
	var pluginscope = {};
	var bindelements = [];
	var comelements = [];
	var defaults = {};
	var waits = {};
	var statics = {};
	var queues = {};
	var ajaxconfig = {};
	var $ready = setTimeout(load, 2);
	var $loaded = false;
	var $domready = false;
	var knockknockcounter = 0;
	var pendingrequest = 0;
	var binders = {};
	var bindersnew = [];
	var lazycom = {};
	var repeats = {};
	var pluginableplugins = {};
	var waitfordownload = [];
	var waitforimport = [];

	var current_owner = null;
	var current_element = null;
	var current_com = null;
	var current_scope = null;
	var current_caller = null;

	W.jComponent = M;
	W.MAIN = W.M = M;
	W.TEMP = {};
	W.PLUGINS = {};
	W.EMPTYARRAY = [];
	W.EMPTYOBJECT = {};
	W.NOW = new Date();

	W.DEFAULT = function(path, timeout, reset) {
		var arr = path.split(REGMETA);
		if (arr.length > 1) {
			var def = arr[1];
			path = arr[0];
			var index = path.indexOf('.*');
			if (index !== -1)
				path = path.substring(0, index);
			SET(path + ' @default', new Function('return ' + def)(), timeout > 10 ? timeout : 3, timeout > 10 ? 3 : null);
		} else
			M.default(arr[0], timeout, null, reset);
	};

	var MD = W.DEF = M.defaults = {};
	var ENV = MD.environment = {};
	var encryptsecret = '';
	var encryptvalidator;
	var encrypthtml;

	MD.pathcommon = 'common.';
	MD.pathcl = 'DEF.cl.';
	MD.cl = {};
	MD.dictionary = {};
	MD.cdn = '';
	MD.prefixcsscomponents = 'ui-';
	MD.prefixcssmacros = 'm-';
	MD.prefixcsslibrary = 'ui-';
	MD.color = '#4285F4';

	W.DEBUG = function() {
		if (!encryptsecret)
			debug = true;
	};

	MD.secret = function(key, validator, html) {
		encryptsecret = key;

		if (validator === true) {
			html = true;
		} else {
			encryptvalidator = validator;
			encrypthtml = html == true;
		}

		delete MD.secret;
	};

	MD.repeatfocus = true;
	MD.monitor = false;
	MD.scope = W;
	MD.delay = 555;
	MD.delaykeypress = 200;
	MD.delaywatcher = 555;
	MD.delaybinder = 200;
	MD.delayrepeat = 2000;
	MD.delaypref = 1000;
	MD.keypress = true;
	MD.scrollbaranimate = true;
	MD.jsoncompress = false;
	MD.jsondate = true;
	MD.iconprefix = 'ti ti-';
	MD.ajaxerrors = false;
	MD.ajaxcredentials = false;
	MD.ajaxcredentialshtml = false;
	MD.fallback = 'https://cdn.componentator.com/j-{0}.html';
	MD.fallbackcache = '';
	MD.version = '';
	MD.versioncomponents = '';
	MD.headers = { 'X-Requested-With': 'XMLHttpRequest' };
	MD.devices = { xs: { max: 768 }, sm: { min: 768, max: 992 }, md: { min: 992, max: 1200 }, lg: { min: 1200 }};
	MD.importcache = 'session';
	MD.baseurl = ''; // String or Function
	MD.root = ''; // String or Function
	MD.makeurl = null; // Function
	MD.empty = T_COM;
	MD.jsonconverter = {
		'text json': function(text) {
			return text;
		}
	};

	MD.thousandsseparator = ' ';
	MD.decimalseparator = '.';
	MD.dateformat = 'yyyy-MM-dd';
	MD.timeformat = 'HH:mm';
	MD.dateformatutc = false;
	// MD.currency = ''; DEFAULT CURRENCY
	MD.localstorage = ATTRDATA;
	MD.languagekey = 'language';
	MD.versionkey = 'version';
	MD.currencies = {};
	MD.firstdayofweek = 1;
	MD.customelements = false;

	ENV.ts = MD.dateformat + ' - ' + MD.timeformat;
	ENV.date = MD.dateformat;
	ENV.time = MD.timeformat;

	// MD.language
	// MD.languagehtml
	// MD.version
	// MD.versionhtml

	W.MONTHS = M.months = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
	W.DAYS = M.days = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

	var MV = DEF.validators = {};
	MV.url = /http(s)?:\/\/[^,{}\\]*$/i;
	MV.phone = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,8}$/im;
	MV.email = /^[a-zA-Z0-9-_.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

	var MR = DEF.regexp = {};
	MR.int = /(-|\+)?[0-9]+/;
	MR.float = /(-|\+)?[0-9.,]+/;
	MR.date = /YYYY|yyyy|YY|yy|MMMM|MMM|MM|M|dddd|DDDD|DDD|ddd|DD|dd|D|d|HH|H|hh|h|mm|m|ss|s|a|ww|w/g;
	MR.pluralize = /#{1,}/g;
	MR.format = /\{\d+\}/g;

	M.loaded = false;
	M.version = 19.182;
	M.scrollbars = [];
	M.$components = {};
	M.binders = [];
	M.macros = {};
	M.performance = { plugins: {}, scopes: {}, components: {}, binders: {}, events: {}, setters: {}, exec: {}, set: {}, get: {}, watchers: {}, requests: {}, compilation: {}, validation: {}, reset: {}, lazy: {}, changes: {}, repeat: {}, cmd: {}, returns: {} };
	M.components = [];
	M.$formatter = [];
	M.$parser = [];
	M.compiler = C;
	M.paths = {};
	M.common = {};
	M.cl = {};

	C.is = false;
	C.recompile = false;
	C.importing = 0;
	C.pending = [];
	C.init = [];
	C.imports = {};
	C.ready = [];
	C.counter = 0;

	var OF = Object.freeze;
	if (OF) {
		OF(EMPTYOBJECT);
		OF(EMPTYARRAY);
	}

	M.compile = compile;

	function VBinder(html) {
		var t = this;
		var e = t.element = $(html);
		t.binders = [];
		var fn = function() {
			var dom = this;
			if (dom.tagName === 'UI-BIND') {
				W.NEWUIBIND(dom, null, null, true);
				dom.ui && t.binders.push(dom.ui);
			} else {
				var el = $(dom);
				var b = el.attrd(T_BIND) || el.attr(T_BIND);
				dom.$jcbind = dom.uibind = parsebinder(dom, b, EMPTYARRAY);
				dom.$jcbind && t.binders.push(dom.$jcbind);
			}
		};
		e.filter(ATTRBIND).each(fn);
		e.find(ATTRBIND).each(fn);
	}

	var VBP = VBinder.prototype;

	VBP.on = function() {
		var t = this;
		t.element.on.apply(t.element, arguments);
		return t;
	};

	VBP.remove = function() {
		var t = this;
		var e = t.element;
		e.find('*').off();
		e.off().remove();
		t.element = null;
		t.binders = null;
		t.value = {};
		t = null;
		return t;
	};

	VBP.get = function(path) {
		var val = this.value;
		return path ? get(path, val) : val;
	};

	// A temporary variable for the performance
	var VBPA = [null];

	VBP.set = function(path, model, skipchecksum) {

		var t = this;

		if (model == null) {
			t.value = model = path;
			path = '';
		} else
			set2(t.value, path, model);

		t.upd(path, skipchecksum);
		return t;
	};

	VBP.upd = function(path, skipchecksum) {
		var t = this;

		// Maybe the model has been changed
		if (!skipchecksum && t.vbindarray) {
			var sum = t.vbindarray.$checksum(t.value);
			if (t.element[0].$bchecksum !== sum)
				t.element[0].$bchecksum = sum;
		}

		for (var i = 0; i < t.binders.length; i++) {
			var b = t.binders[i];

			if (!(b instanceof Array)) {
				VBPA[0] = b;
				b = VBPA;
			}

			for (var j = 0; j < b.length; j++) {
				var bi = b[j];
				if (bi) {
					var can = !path || !bi.path || comparepath(bi.path, path);
					can && bi.exec(bi.path ? get(bi.path, t.value) : t.value, path || bi.path);
				}
			}
		}

		return t;
	};

	W.VBIND = function(html) {
		return new VBinder(html);
	};

	W.VBINDARRAY = function(html, el) {
		var obj = {};
		obj.html = html;
		obj.compile = html.COMPILABLE();
		obj.items = [];
		obj.element = el instanceof COM ? el.element : $(el);
		obj.element[0].$vbindarray = obj;
		obj.value = [];
		obj.remove = function() {
			for (var i = 0; i < obj.items.length; i++)
				obj.items[i].remove();
			obj.checksum = null;
			obj.items = null;
			obj.html = null;
			obj.element = null;
		};

		var serialize = function(val) {
			switch (typeof(val)) {
				case TYPE_N:
					return val.toString(36);
				case TYPE_B:
					return val ? '1' : '0';
				case TYPE_S:
					return HASH(val).toString(36);
				default:
					return val == null ? '' : val instanceof Date ? val.getTime().toString(36) : HASH(JSON.stringify(val).replace(/"|:|\{|\}|\[|\]/g, '')).toString(36);
			}
		};

		obj.$checksum = function(item) {
			var sum = '';
			var binder = obj.items[0];
			if (binder) {
				for (var j = 0; j < binder.binders.length; j++) {
					var b = binder.binders[j];
					var p = b.path;
					if (b.track) {
						for (var i = 0; i < b.track.length; i++)
							sum += serialize(get((p ? (p + '.') : '') + b.track[i].substring(1), item));
					} else
						sum += serialize(p ? get(p, item) : item);
				}
			}
			return HASH(sum).toString(36);
		};

		obj.get = function(index) {
			var val = obj.value;
			return index == null ? val : val[index];
		};

		obj.upd = function(index) {
			if (index == null)
				obj.set(obj.value);
			else
				obj.set(index, obj.value[index]);
			return obj;
		};

		obj.set = function(index, value) {

			var sum = null;

			if (index == null) {
				var arr = obj.items.splice(0);
				for (var i = 0; i < arr.length; i++)
					arr[i].remove();
				return obj;
			}

			if (!(index instanceof Array)) {
				var item = obj.items[index];
				if (item) {
					sum = obj.$checksum(value);
					var el = item.element[0];

					// Rebinds reference
					item.value = value;
					obj.value[index] = value;

					// Redraws
					if (el.$bchecksum !== sum) {
						el.$bchecksum = sum;
						item.set(value);
					}
				}
				return obj;
			}

			obj.value = value = index;

			if (obj.items.length > value.length) {
				var rem = obj.items.splice(value.length);
				for (var i = 0; i < rem.length; i++)
					rem[i].remove();
			}

			for (var i = 0; i < value.length; i++) {
				var val = value[i];
				var item = obj.items[i];
				if (!item) {
					item = VBIND(obj.html);
					obj.items.push(item);
					item.element.attrd('index', i);
					item.element[0].$vbind = item;
					item.index = i;
					item.vbindarray = obj;
					for (var j = 0; j < item.binders.length; j++)
						item.binders[j].vbind = item;
					obj.element.append(item.element);
				}

				var el = item.element[0];
				sum = obj.$checksum(val);

				// Rebinds reference
				item.value = val;

				// Redraws
				if (el.$bchecksum !== sum) {
					el.$bchecksum = sum;
					item.set(val, null, true);
				}
			}

			obj.compile && COMPILE();
		};

		return obj;
	};

	// ===============================================================
	// MAIN FUNCTIONS
	// ===============================================================

	W.ENV = function(name, value) {

		if (typeof(name) === TYPE_O) {
			if (name) {
				for (var key in name) {
					ENV[key] = name[key];
					events[KEY_ENV] && EMIT(KEY_ENV, key, name[key]);
				}
			}
			return name;
		}

		if (value !== undefined) {
			events[KEY_ENV] && EMIT(KEY_ENV, name, value);
			ENV[name] = value;
			return value;
		}

		return ENV[name];
	};

	W.ENVIRONMENT = function(name, version, language, env) {
		var reload = MD.localstorage != name;
		MD.localstorage = name;
		MD.version = version || '';
		MD.languagehtml = language || '';
		env && W.ENV(env);
		reload && load();
	};

	W.FREE = function(timeout) {
		setTimeout2('$clean', cleaner, timeout || 10);
	};

	W.EVALUATE = function(path, expression, nopath) {

		var key = 'eval' + expression;
		var exp = temp[key];
		var val = null;

		if (nopath)
			val = path;
		else
			val = get(path);

		if (exp)
			return exp.call(val, val, path);

		if (expression.indexOf('return') === -1)
			expression = 'return ' + expression;

		exp = new Function(T_VALUE, T_PATH, expression);
		temp[key] = exp;
		return exp.call(val, val, path);
	};

	W.COOKIES = {
		get: function(name) {
			name = name.env();
			var arr = D.cookie.split(';');
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
		set: function(name, value, expire, samesite) {
			var type = typeof(expire);
			if (type === TYPE_N) {
				var date = W.NOW;
				date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));
				expire = date;
			} else if (type === TYPE_S)
				expire = new Date(Date.now() + expire.parseExpire());
			D.cookie = name.env() + '=' + value + '; expires=' + expire.toGMTString() + '; path=/' + (samesite ? ('; samesite=' + samesite.charAt(0).toUpperCase() + samesite.substring(1)) : '');
		},
		rem: function(name) {
			COOKIES.set(name.env(), '', -1);
		}
	};

	W.FORMATTER = function(value, path, type, format) {

		if (typeof(value) === TYPE_FN) {
			!M.$formatter && (M.$formatter = []);

			// Prepend
			if (path === true)
				M.$formatter.unshift(value);
			else
				M.$formatter.push(value);

			return;
		}

		var a = M.$formatter;
		if (a && a.length) {
			for (var i = 0; i < a.length; i++) {
				var val = a[i].call(M, path, value, type, format);
				if (val !== undefined)
					value = val;
			}
		}

		return value;
	};

	W.PARSER = function(value, path, type, format) {

		if (typeof(value) === TYPE_FN) {
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
			for (var i = 0; i < a.length; i++)
				value = a[i].call(M, path, value, type, format);
		}

		return value;
	};

	function parseHeaders(val) {
		var h = {};
		var lines = val.split('\n');
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			var index = line.indexOf(':');
			if (index !== -1)
				h[line.substring(0, index).toLowerCase()] = line.substring(index + 1).trim();
		}
		return h;
	}

	function findformat(val) {
		var a = val.indexOf('-->');
		var s = 3;

		if (a === -1) {
			a = val.indexOf('->');
			s = 2;
		}

		if (a !== -1) {
			if (val.indexOf('/') !== -1 && val.indexOf('(') === -1)
				val += '(value)';
		}

		var fn = val.substring(a + s).trim();
		var is = false;
		if (fn.indexOf('?/') !== -1) {
			s = fn.indexOf('(');
			fn = '(value,path,type,scope)=>scope?scope.$format(\'' + fn.substring(2, s) + '\')' + fn.substring(s) + ':value';
			is = true;
		}

		return a === -1 ? null : { path: val.substring(0, a).trim(), fn: FN(fn), scope: is };
	}

	W.UPLOAD = function(url, data, callback, timeout, progress) {

		if (typeof(timeout) !== TYPE_N && progress == null) {
			progress = timeout;
			timeout = null;
		}

		if (!callback)
			return promiseajax('UPLOAD', url, data, timeout, progress);

		if (!url)
			url = location.pathname;

		var nodecrypt = false;
		var nocsrf = false;
		var customflags = [];
		var cl = null;
		var tmp = null;
		var wraperror = false;

		url = url.replace(REGAJAXFLAGS, function(text) {
			var c = text.charAt(1);
			if (c === '@') {
				customflags.push(text.substring(2));
			} if (c === '#') {
				if (!cl)
					cl = [];
				cl.push(text.substring(2));
			} else {
				c = text.substring(1, 4).toLowerCase();
				if (c === 'err')
					wraperror = true;
				else if (c === 'nod')
					nodecrypt = true;
				else if (c === 'noc')
					nocsrf = true;
			}
			return '';
		});

		tmp = null;

		var method = 'POST';
		var index = url.indexOf(' ');

		if (index !== -1)
			method = url.substring(0, index).toUpperCase();

		var isCredentials = method.charAt(0) === '!';
		if (isCredentials)
			method = method.substring(1);
		else
			isCredentials = MD.ajaxcredentials;

		var headers = {};
		tmp = url.match(/\{.*?\}/g);

		if (tmp) {
			url = url.replace(tmp, '').replace(/\s{2,}/g, ' ');
			tmp = (new Function('return ' + tmp))();
			if (typeof(tmp) === TYPE_O)
				headers = tmp;
		}

		url = url.substring(index).trim().$env();

		if (typeof(callback) === TYPE_N) {
			timeout = callback;
			callback = undefined;
		}

		var output = {};
		output.throw = ajaxcustomerror;
		output.respond = ajaxcustomresponse;
		output.url = url;
		output.headers = headers;
		output.process = true;
		output.error = false;
		output.upload = true;
		output.method = method;
		output.data = data;
		output.scope = current_scope;
		output.callback = callback;
		output.duration = Date.now();
		output.progress = progress;
		output.decryption = !nodecrypt;
		output.credentials = isCredentials;

		if (callback && wraperror)
			callback = ERROR(true, callback);

		if (DEF.csrf && !nocsrf) {
			headers[T_CSRF] = DEF.csrf;
			output.csrf = true;
		}

		events.request && EMIT('request', output);
		customflags.length && emitflags(customflags, url);

		if (output.cancel)
			return;

		DEF.monitor && monitor_method('requests');

		var $call = function() {

			var xhr = new XMLHttpRequest();

			if (output.credentials)
				xhr.withCredentials = true;

			xhr.addEventListener('error', function() {
				var req = this;
				ajaxprocess(output, req.status, req.statusText || ERRCONN, req.responseText, parseHeaders(req.getAllResponseHeaders()), req.status > 399);
			});

			xhr.addEventListener('load', function() {
				var req = this;
				ajaxprocess(output, req.status, req.statusText, req.responseText, parseHeaders(req.getAllResponseHeaders()), req.status > 399);
			}, false);

			xhr.upload.onprogress = function(evt) {
				var p = output.progress;
				if (p) {
					var percentage = 0;
					if (evt.lengthComputable)
						percentage = Math.round(evt.loaded * 100 / evt.total);
					if (output.$progress !== percentage) {
						if (typeof(p) === TYPE_S)
							remap(p, percentage);
						else
							p(percentage, evt.transferSpeed, evt.timeRemaining);
						output.$progress = percentage;
					}
				}
			};

			xhr.open(method, makeurl(output.url));

			for (var key in MD.headers)
				xhr.setRequestHeader(key.env(), MD.headers[key].env());

			if (headers) {
				for (var key in headers)
					xhr.setRequestHeader(key, headers[key]);
			}

			if (!(data instanceof FormData)) {
				xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
				data = JSON.stringify(data);
			}

			xhr.send(data);

		};

		if (cl)
			W.CL(cl.join(','), () => setTimeout($call, timeout || 0));
		else
			setTimeout($call, timeout || 0);
	};

	W.UNWATCH = function(path, fn) {
		if (MULTIPLE.test(path)) {
			var arr = path.split(MULTIPLE).trim();
			for (var i = 0; i < arr.length; i++)
				UNWATCH(arr[i], fn);
		} else
			OFF('watch', path, fn);
	};

	W.WATCH = function(path, fn, init) {

		if (MULTIPLE.test(path)) {
			var arr = path.split(MULTIPLE).trim();
			for (var i = 0; i < arr.length; i++)
				WATCH(arr[i], fn, init);
			return;
		}

		if (typeof(path) === TYPE_FN) {
			init = fn;
			fn = path;
			path = '*';
		}

		var push = '';

		if (path.charAt(0) === '^') {
			path = path.substring(1).trim();
			push = '^';
		}

		// Commented because if the path doesn't contain scope and WATCH is inside in PLUGIN then scopes aren't work correctly
		// var index = path.indexOf('?');
		// ON(push + 'watch', path, fn, init, null, index === -1 ? '' : current_scope);

		ON(push + 'watch', path, fn, init, null, current_scope);
	};

	W.WATCHONCE = function(path, fn) {

		if (path !== '*')
			path = pathmaker(path, 1);

		var cb = function(p, value, type) {
			UNWATCH(path, cb);
			fn(p, value, type);
		};

		WATCH(path, cb);
	};

	W.ON = function(name, path, fn, init, context, scope) {

		var isflag = name.indexOf('@flag ') !== -1;

		if (isflag)
			name = name.replace(/@flag\s/g, '@flag_');

		if (MULTIPLE.test(name)) {
			var arr = name.split(MULTIPLE).trim();
			for (var i = 0; i < arr.length; i++)
				ON(arr[i], path, fn, init, context, scope);
			return;
		}

		if (isflag)
			name = name.replace(/@flag_/g, '@flag ');

		var push = true;

		if (name.charAt(0) === '^') {
			push = false;
			name = name.substring(1).trim();
		}

		var owner = null;
		var index = name.indexOf('#');

		if (index) {
			owner = name.substring(0, index).trim();
			name = name.substring(index + 1).trim();
		}

		if (typeof(path) === TYPE_FN) {
			fn = path;
			path = name === 'watch' ? '*' : '';
		} else
			path = path.replace('.*', '');

		if (path) {
			index = path.indexOf('/');
			if (index !== -1)
				scope = path.substring(0, index);
			else if (path !== '*')
				path = pathmaker(path, 1);
		}

		var obj = { name: name, fn: fn, owner: owner || current_owner, context: context || (current_com == null ? undefined : current_com), scope: scope };

		if (name === 'watch') {
			var arr = [];

			var tmp = findformat(path.replace(REGSCOPEREPLACE, scope || T_UNKNOWN));
			if (tmp) {
				path = tmp.path;
				obj.format = tmp.fn;
				obj.format.scope = tmp.scope;
			}

			if (path.substring(path.length - 1) === '.')
				path = path.substring(0, path.length - 1);

			var c = path.charAt(0);
			var alias = null;

			// Common
			if (c === '*' && path !== '*') {
				path = MD.pathcommon + path.substring(1);
				alias = { length: MD.pathcommon.length, type: c };
			}

			// Codelist
			if (c === '#') {
				path = MD.pathcl + path.substring(1);
				alias = { length: MD.pathcl.length, type: c };
			}

			// Temporary
			if (c === '%') {
				path = T_TMP + path.substring(1);
				alias = { length: T_TMP.length, type: c };
			}

			// Raw plugin
			if (c === '=')
				path = 'PLUGINS["{0}"].'.format(scope || 'undefined') + path.substring(1);

			path = path.env();

			// !path = fixed path
			if (path.charCodeAt(0) === 33) {
				obj.$pathfixed = true;
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
				obj.$pathfixed = false;
			}

			obj.path = path;
			obj.$path = arr;
			obj.alias = alias;

			if (M.paths[path])
				M.paths[path]++;
			else
				M.paths[path] = 1;

			if (push)
				watches.push(obj);
			else
				watches.unshift(obj);

			if (init) {
				DEF.monitor && monitor_method('watchers', 1);
				obj.scope && (current_scope = obj.scope);
				fn.call(context || M, alias ? (alias.type + path.substring(alias.length)) : path, obj.format ? obj.format(get(path), path, 0) : get(path), 0);
			}

		} else {

			DEF.monitor && monitor_method('events', 1);

			if (events[name]) {
				if (push)
					events[name].push(obj);
				else
					events[name].unshift(obj);
			} else
				events[name] = [obj];

			(!C.ready && (name === 'ready' || name === 'init')) && fn();
		}
	};

	W.OFF = function(name, path, fn) {

		if (name.indexOf('+') !== -1) {
			var arr = name.split('+').trim();
			for (var i = 0; i < arr.length; i++)
				OFF(arr[i], path, fn);
			return;
		}

		if (typeof(path) === TYPE_FN) {
			fn = path;
			path = '';
		}

		if (path === undefined)
			path = '';

		var c = path.charAt(0);

		// Common
		if (c === '*' && path !== '*')
			path = MD.pathcommon + path.substring(1);

		// Codelist
		if (c === '#')
			path = MD.pathcl + path.substring(1);

		// Temporary
		if (c === '%')
			path = T_TMP + path.substring(1);

		// Raw plugin
		if (c === '=')
			path = 'PLUGINS["{0}"].'.format(scope || 'undefined') + path.substring(1);

		var owner = null;
		var index = name.indexOf('#');
		if (index) {
			owner = name.substring(0, index).trim();
			name = name.substring(index + 1).trim();
		}

		if (path) {
			path = path.replace('.*', '').trim();
			var tmp = findformat(path);
			if (tmp)
				path = tmp.path;
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
				else if (type === 7)
					v = key === name && item.path === path;
				else
					v = key === name;

				if (v && item.path && M.paths[item.path])
					M.paths[item.path]--;

				return v;
			});
		};

		for (var p in events) {
			events[p] = cleararr(events[p], p);
			if (!events[p].length)
				delete events[p];
		}

		if (DEF.monitor) {
			if (path)
				monitor_method('watchers', 2);
			else
				monitor_method('events', 2);
		}

		watches = cleararr(watches, 'watch');
	};

	W.EMIT = function(name) {

		name = makeandexecflags(name);

		var e = events[name];
		if (!e || !e.length)
			return false;

		var args = [];

		for (var i = 1; i < arguments.length; i++)
			args.push(arguments[i]);

		DEF.monitor && monitor_method('events');

		var oldscope = current_scope;

		for (var i = 0; i < e.length; i++) {
			var m = e[i];
			var context = m.context;
			if (context !== undefined && (context === null || context.$removed))
				continue;
			current_scope = m.scope ? m.scope : oldscope;
			m.fn.apply(context || W, args);
		}

		current_scope = oldscope;
		return true;
	};

	W.CHANGE = function(path, value) {
		if (value == null)
			value = true;
		var arr = findcomponents(pathmaker(path), EMPTYOBJECT);
		var is = value === undefined || value === true;
		for (var com of arr) {
			com.config.touched = is;
			com.config.modified = is;
		}
		state(arr, 1, 2);
	};

	// DEF.monitor && monitor_method('validation');
	// state(arr, 1, 1);

	function findcomponents(path, flags) {

		if (typeof(flags) === TYPE_S) {
			var tmp = {};
			var arr = flags.split(',');
			for (var m of arr)
				tmp[m.trim()] = 1;
			flags = tmp;
		} else if (flags instanceof Array) {
			var tmp = {};
			for (var m of flags) {
				if (m.charAt(0) === '@')
					m = m.substring(1);
				tmp[m] = 1;
			}
			flags = tmp;
		}

		// @flags {Object} -- "visible", "disabled", "enabled", "hidden", "readonly"

		var index = path.lastIndexOf('.*');
		if (index !== -1)
			path = path.substring(0, index);

		path = pathmaker(path, 0, 1);

		var output = [];
		var all = M.components;

		for (var i = 0; i < all.length; i++) {
			var com = all[i];

			//  || (isExcept && com.$except(except))
			if (!com || com.$removed || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && !com.config.disabled) || (flags.disabled && com.config.disabled)))
				continue;

			output.push(com);
		}
		return output;
	}

	W.IMPORTCACHE = function(url, expire, target, callback, insert, preparator) {

		var w;

		url = url.$env().replace(/<.*?>/, function(text) {
			w = text.substring(1, text.length - 1).trim();
			return '';
		}).trim();

		// unique
		var first = url.charAt(0);
		var once = url.substring(0, 5).toLowerCase() === 'once ';

		if (typeof(target) === TYPE_FN) {

			if (typeof(callback) === TYPE_FN) {
				preparator = callback;
				insert = true;
			} else if (typeof(insert) === TYPE_FN) {
				preparator = insert;
				insert = true;
			}

			callback = target;
			target = 'body';

		} else if (typeof(insert) === TYPE_FN) {
			preparator = insert;
			insert = true;
		}

		if (w) {

			var wf = w.substring(w.length - 2) === '()';
			if (wf)
				w = w.substring(0, w.length - 2);

			var wo = GET(w);
			if (wf && typeof(wo) === TYPE_FN) {
				if (wo()) {
					callback && callback(0);
					return;
				}
			} else if (wo) {
				callback && callback(0);
				return;
			}
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
						callback(0);
					else {
						WAIT(function() {
							return statics[url] === 2;
						}, function() {
							callback(0);
						});
					}
				}
				return;
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

		var d = D;
		if (ext === '.js') {
			var scr = d.createElement(T_SCRIPT);
			scr.type = 'text/java' + T_SCRIPT;
			scr.async = false;
			scr.onload = function() {
				statics[url] = 2;
				callback && callback(1);
				W.jQuery && setTimeout(compile, 300);
			};
			scr.src = makeurl(url, true);
			d.getElementsByTagName('head')[0].appendChild(scr);
			events.import && EMIT(T_IMPORT, url, $(scr));
			DEF.monitor && monitor_method('requests');
			return;
		}

		if (ext === '.css') {
			var link = d.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = makeurl(url, true);
			link.onload = function() {
				callback && setTimeout(callback, 2, 1);
			};
			d.getElementsByTagName('head')[0].appendChild(link);
			statics[url] = 2;
			events.import && EMIT(T_IMPORT, url, $(link));
			DEF.monitor && monitor_method('requests');
			return;
		}

		WAIT(function() {
			return !!W.jQuery;
		}, function() {

			statics[url] = 2;
			var id = T_IMPORT + HASH(url);

			var cb = function(response, code, output) {

				if (!response) {
					callback && callback(0);
					return;
				}

				if (typeof(response) !== TYPE_S) {
					WARN('jC: invalid response for IMPORT("{0}")'.format(url), response);
					callback && callback(0);
					return;
				}

				url = '$import' + url;
				response = ADAPT(null, null, response);

				if (preparator)
					response = preparator(response, output);

				var is = REGCOM.test(response);
				response = importscripts(importstyles(response, id)).trim();
				target = $(target);

				if (response) {
					current_element = target[0];
					if (insert === false)
						target.html(response);
					else
						target.append(response);
					current_element = null;
				}

				setTimeout(function() {
					// is && compile(response ? target : null);
					// because of scopes
					is && compile();
					callback && WAIT(function() {
						return C.is == false;
					}, function() {
						callback(1);
					});
					events.import && EMIT(T_IMPORT, url, target);
				}, 10);
			};

			if (expire)
				AJAXCACHE('GET ' + url, null, cb, expire);
			else
				AJAX('GET ' + url, cb);
		});
	};

	W.IMPORT = function(url, target, callback, insert, preparator) {
		if (url instanceof Array) {

			if (typeof(target) === TYPE_FN) {
				preparator = insert;
				insert = callback;
				callback = target;
				target = null;
			}

			var scope = current_scope;
			url.wait(function(url, next) {
				current_scope = scope;
				IMPORTCACHE(url, null, target, next, insert, preparator);
			}, function() {
				current_scope = scope;
				callback && callback();
			});
		} else
			IMPORTCACHE(url, null, target, callback, insert, preparator);
	};

	W.CACHEPATH = function(path, expire, rebind, preferences) {

		var arr = path.split(REGMETA);
		path = pathmaker(arr[0], 1);

		if (arr[1])
			arr[1] = new Function('return ' + arr[1]);

		var skip = false;

		WATCH(path, function(p, value) {

			if (skip)
				return;

			var obj = preferences ? W.PREF.get(T_PATHS) : cachestorage(T_PATHS);
			if (obj)
				obj[path] = value;
			else {
				obj = {};
				obj[path] = value;
			}
			if (preferences)
				W.PREF.set(T_PATHS, value, expire);
			else
				cachestorage(T_PATHS, obj, expire);
		});

		if (rebind === undefined || rebind) {
			skip = true;
			var cache = preferences ? W.PREF.get(T_PATHS) : cachestorage(T_PATHS);
			if (cache && cache[path] !== undefined) {
				if (cache[path] !== get(path))
					M.set(path, cache[path], true);
			} else if (arr[1])
				M.set(path, arr[1](), true);
			skip = false;
		}

	};

	W.CACHE = function(key, value, expire) {
		return cachestorage(key, value, expire);
	};

	W.SCROLLBARWIDTH = function() {
		var id = 'jcscrollbarwidth';
		if (scrollbarwidth != null)
			return scrollbarwidth;
		var b = D.body;
		$(b).append('<div id="{0}" style="width{1}height{1}overflow:scroll;position:absolute;top{2}left{2}"></div>'.format(id, ':100px;', ':9999px;'));
		var el = D.getElementById(id);
		if (el) {
			scrollbarwidth = el.offsetWidth - el.clientWidth;
			b.removeChild(el);
		}
		return scrollbarwidth || 0;
	};

	W.REMOVECACHE = function(key, isSearching) {
		if (isSearching) {
			for (var m in storage) {
				if (m.indexOf(key) !== -1)
					delete storage[key];
			}
		} else
			delete storage[key];
		save();
	};

	W.AJAXCONFIG = function(name, fn) {
		ajaxconfig[name] = fn;
	};

	W.ASETTER = function() {
		var args = [];
		for (var i = 0; i < arguments.length; i++)
			args.push(arguments[i]);
		var scope = current_scope;
		return function(response) {
			args.push(response);
			current_scope = scope;
			SETTER.apply(W, args);
		};
	};

	W.AEXEC = function() {
		var args = [];
		for (var i = 0; i < arguments.length; i++)
			args.push(arguments[i]);
		var scope = current_scope;
		return function(response) {
			current_scope = scope;
			args.push(response);
			EXEC.apply(W, args);
		};
	};

	W.ACMD = function() {
		var args = [];
		for (var i = 0; i < arguments.length; i++)
			args.push(arguments[i]);
		return function(response) {
			args.push(response);
			CMD.apply(W, args);
		};
	};

	var serializedata = function(obj) {
		var keys = Object.keys(obj);
		var builder = [];
		for (var i = 0; i < keys.length; i++) {
			var val = obj[keys[i]];
			if (val !== undefined) {
				if (val != null) {
					if (val instanceof Array)
						val = val.join(',');
					else if (val instanceof Date)
						val = val.format('iso');
					else
						val = val + '';
				}
				builder.push(encodeURIComponent(keys[i]) + '=' + (val == null ? '' : encodeURIComponent(val)));
			}
		}
		return builder.length ? builder.join('&') : '';
	};

	function apicallback(url, model, callback, scope, socket) {
		current_scope = scope;
		url = url.env();
		if (!encryptsecret && debug)
			url += (url.indexOf('?') === -1 ? '?' : '&') + 'schema=' + model.schema.replace(/\?/g, '&');
		AJAX('POST ' + url, model, callback, null, socket);
	}

	function promiseajax(name, a, b, d, e) {
		return new Promise(function(resolve, reject) {
			W[name](a, b, function(response, err) {
				if (!MD.ajaxerrors && err > 399) {
					if (response instanceof Array)
						response = response[0].error;
					reject(response ? response.toString() : (err + ''));
				} else
					resolve(response);
			}, d, e);
		});
	}

	var wdapi;

	W.WAPI_INIT = function(opt) {

		var uid = Date.now().toString(36);
		var callbacks = {};
		var counter = 0;
		var online = false;
		var socket;
		var pending = 0;
		var events = {};
		var timeout;
		var paused = false;

		opt.pause = function(is) {
			if (is) {
				if (pending === 2) {
					paused = true;
					socket && socket.close();
				}
			} else {
				if (pending !== 2) {
					paused = false;
					connect('reconnect');
				}
			}
		};

		opt.emit = function(name, a, b, c, d) {
			var arr = events[name];
			if (arr && arr.length) {
				for (var i = 0; i < arr.length; i++)
					arr[i](a, b, c, d);
			}
		};

		opt.on = function(name, fn) {
			if (events[name])
				events[name].push(fn);
			else
				events[name] = [fn];
		};

		var onopen = function() {
			pending = 2;
			online = true;
			opt.open && opt.open();
			if (opt.callback) {
				opt.callback();
				opt.callback = null;
			}
			events.open && opt.emit('open');
		};

		var onclose = function(e) {

			pending = 3;
			online = false;
			socket = null;
			opt.close && opt.close(e);
			events.close && opt.emit('close', e);

			if (opt.callback) {
				opt.callback(e.code);
				opt.callback = null;
			}

			timeout && clearTimeout(timeout);
			timeout = null;

			if (e.code !== 4001 && opt.reconnect !== false && !paused)
				setTimeout(connect, opt.reconnect || 2000, 'reconnect');

		};

		var onmessage = function(e) {

			var data = e.data;

			if (encryptsecret)
				data = decrypt_data(data, encryptsecret);

			data = PARSE(data);
			opt.message && opt.message(data);

			if (data) {
				switch (data.TYPE) {
					case 'ping':
						var msg = STRINGIFY({ TYPE: 'pong' });
						if (output.encrypted)
							msg = encrypt_data(msg, encryptsecret);
						socket.send(msg);
						break;
					case 'api':
						var output = callbacks[data.callbackid];
						if (output) {
							output.timeout && clearTimeout(output.timeout);
							output.timeout = null;
							delete callbacks[data.callbackid];
							ajaxprocess(output, 200, '', data.data, EMPTYOBJECT);
						}
						break;
				}
			}
			events.message && opt.emit('message', data);

			/*
			try {
			} catch (e) {
				THROWERR(e);
				events.error && opt.emit('error', e);
				opt.error && opt.error(e, e.data);
			}*/
		};

		var connect = function(type) {

			if (type === 'timeout') {
				// We have open some callbacks
				if (Object.keys(callbacks).length) {
					setTimeout(connect, 200, type);
					return;
				}
			}

			timeout && clearTimeout(timeout);
			timeout = null;

			events.reconnect && opt.emit('reconnect', type);
			socket && socket.close();

			var url = opt.url.env(true);
			if (url.charAt(0) === '/')
				url = location.origin.replace(/^http/, 'ws') + url;

			socket = new WebSocket(url);
			socket.onopen = onopen;
			socket.onclose = onclose;
			socket.onmessage = onmessage;

			if (opt.expire) {
				timeout && clearTimeout(timeout);
				timeout = setTimeout(function() {
					pending = 3;
					connect('expire');
				}, opt.expire);
			}

		};

		var timeouthandler = function(output) {
			var t = 'Timeout';
			output.$error({ code: 408, responseText: t, headers: EMPTYOBJECT }, t);
		};

		opt.send = function(name, data, callback, timeout, scope) {

			var prepare = function(output) {

				if (pending !== 2) {
					setTimeout(prepare, 100, output);
					return;
				}

				if (online) {
					var id = uid + (counter++) + '';
					output.timeout = setTimeout(timeouthandler, timeout || 10000, output);
					callbacks[id] = output;
					var msg = { TYPE: 'api', callbackid: id, data: output.data };
					msg = STRINGIFY(msg);

					if (output.encrypted)
						msg = encrypt_data(msg, encryptsecret);

					socket.send(msg);

				} else
					output.$error({ code: 0, responseText: ERRCONN, headers: EMPTYOBJECT }, ERRCONN);
			};

			if (scope !== undefined)
				current_scope = scope;

			// Backward compatibility
			if (!callback)
				callback = NOOP;

			return W.API('--socket-- ' + name, data, callback, prepare);
		};

		wdapi = opt;
		pending = 1;
		connect('init');
		return opt;
	};

	W.TAPI = function(name, data, callback) {
		var m = DEF.api ? W.DAPI : W.WAPI;
		return m(name, data, callback);
	};

	W.WAPI = function(name, data, callback, timeout, scope) {
		if (!name)
			return wdapi;

		if (typeof(name) === TYPE_O)
			return W.WAPI_INIT(name);

		if (typeof(data) === TYPE_FN && !callback) {
			callback = data;
			data = null;
		}

		if (!callback)
			return promiseajax('WAPI', name, data, timeout, scope);

		if (wdapi)
			return wdapi.send(name, data, callback, timeout, scope);

		setTimeout(W.WAPI, 100, name, data, callback, timeout, scope || current_scope);
	};

	W.DAPI = function(name, data, callback) {
		var url = DEF.api;
		url = typeof(url) === 'function' ? url(name, data) : (url + ' ' + name);
		return W.API(url, data, callback);
	};

	W.API = function(url, data, callback, socket) {

		var type = typeof(data);

		if (type === TYPE_FN || type === TYPE_S) {
			callback = data;
			data = null;
		}

		if (!callback)
			return promiseajax('API', url, data, socket);

		var beg = url.indexOf(' ');
		var schema = url.substring(beg).trim();
		var plus = '';

		var end = schema.indexOf(' ');
		if (end !== -1) {
			plus = schema.substring(end);
			schema = schema.substring(0, end);
		}

		var meta = { schema: schema.env() };
		var api = {};

		url = url.substring(0, beg).trim() + plus;

		if (data)
			meta.data = data;

		api.query = function(value) {
			if (value)
				meta.schema = (meta.schema.lastIndexOf('?') === -1 ? '?' : '&') + typeof(value) === TYPE_S ? value.replace(/\?/g, '&') : jQuery.param(value);
			return this;
		};

		api.params = function(value) {
			if (value)
				meta.schema = meta.schema.arg(value);
			return this;
		};

		api.data = function(value) {
			if (value)
				meta.data = value;
			return this;
		};

		setTimeout(apicallback, 1, url, meta, callback, current_scope, socket);
		return api;
	};

	W.AJAX = function(url, data, callback, timeout, socket) {

		if (typeof(url) === TYPE_FN) {
			timeout = callback;
			callback = data;
			data = url;
			url = location.pathname;
		}

		var td = typeof(data);
		var arg = EMPTYARRAY;
		var rawurl = url;
		var tmp;

		if (!callback && (td === TYPE_FN || td === TYPE_S)) {
			timeout = callback;
			callback = data;
			data = undefined;
		}

		if (!callback)
			return promiseajax('AJAX', url, data, timeout, socket);

		if (url.substring(0, 4) === 'API ')
			return W.API(url.substring(4), data, callback, socket);

		var index = url.indexOf(' ');
		if (index === -1)
			return;

		DEF.monitor && monitor_method('requests');

		var sync = false;
		var cachetime;

		url = url.replace(/<.*?>/, function(text) {
			cachetime = text.replace(/<|>/g, '');
			return '';
		});

		if (cachetime) {
			AJAXCACHE(url, data, callback, cachetime);
			return;
		}

		url = url.replace(/\ssync/i, function() {
			sync = true;
			return '';
		});

		if (sync) {
			if (pendingrequest) {
				setTimeout(function(a, b, c, d) {
					W.AJAX.call(W, a, b, c, d);
				}, MD.delay, rawurl, data, callback, timeout);
				return;
			}
		}

		var repeat = false;
		var cancel = false;
		var reqid = null;
		var json = false;
		var urlencoded = false;
		var noencrypt = false;
		var nodecrypt = false;
		var nocsrf = false;
		var customflags = [];
		var wraperror = false;
		var cl = [];

		url = url.replace(REGAJAXFLAGS, function(text) {
			var c = text.charAt(1);
			var l = c.toLowerCase();
			if (c === '#') {
				reqid = text.substring(2);
				if (M.cl[reqid]) {
					cl.push(reqid);
					reqid = '';
				}
			} else if (c === '@')
				customflags.push(text.substring(2));
			else if (l === 'r')
				repeat = true;
			else if (l === 'u')
				urlencoded = true;
			else if (l === 'j')
				json = true;
			else if (l === 'e') // error
				wraperror = true;
			else if (l === 'n') {
				c = text.substring(1, 4).toLowerCase();
				if (c === 'noc')
					nocsrf = true;
				else if (c === 'noe')
					noencrypt = true;
				else
					nodecrypt = true;
			} else
				cancel = true;
			return '';
		});

		if (callback && wraperror)
			callback = ERROR(true, callback);

		if (repeat)
			arg = [rawurl, data, callback, timeout];

		var method = url.substring(0, index).toUpperCase();
		var isCredentials = method.charAt(0) === '!';
		if (isCredentials)
			method = method.substring(1);
		else
			isCredentials = MD.ajaxcredentials;

		var headers = {};
		tmp = url.match(/\{.*?\}/g);

		if (tmp) {
			url = url.replace(tmp, '').replace(/\s{2,}/g, ' ');
			tmp = (new Function('return ' + tmp))();
			if (typeof(tmp) === TYPE_O)
				headers = tmp;
		}

		url = url.substring(index).trim().$env();

		var mainurl = (reqid || (method + ' ' + url));
		if (cancel) {
			if (cache[mainurl]) {
				cache[mainurl].output.cancel = true;
				cache[mainurl].xhr.abort();
			}
		}

		var curr_scope = current_scope;
		pendingrequest++;

		if (customflags.length)
			emitflags(customflags, url, data);

		var $call = function() {

			if (method === 'GET' && data) {
				var qs = (typeof(data) === TYPE_S ? data : serializedata(data)); // serializedata replaces jQuery.param(data, true)
				if (qs)
					url += '?' + qs;
			}

			var options = {};
			options.method = method;
			options.converters = MD.jsonconverter;

			if (reqid)
				options.id = reqid;

			options.headers = $.extend(headers, MD.headers);
			options.scope = curr_scope;
			options.process = true;
			options.error = false;
			options.upload = false;
			options.callback = callback;
			options.throw = ajaxcustomerror;
			options.respond = ajaxcustomresponse;
			options.duration = Date.now();
			options.credentials = isCredentials;
			options.dataType = 'text';

			if (url.match(/http:\/\/|https:\/\//i)) {
				options.crossDomain = true;
				delete options.headers['X-Requested-With'];
			} else
				url = url.ROOT();

			var custom = url.match(/\s\([a-z0-9\-.,]+\)/i);
			if (custom) {
				url = url.replace(custom, '').replace(/\s+/g, '');
				options.url = url;
				custom = (custom + '').replace(/\(|\)/g, '').split(',');
				for (var i = 0; i < custom.length; i++) {
					var opt = ajaxconfig[custom[i].trim()];
					opt && opt(options);
				}
			}

			if (!options.url)
				options.url = url;

			var ishtml = options.url.indexOf('.html') !== -1;

			if (options.credentials && ishtml && !DEF.ajaxcredentialshtml)
				options.credentials = false;

			if (DEF.csrf && !nocsrf && !ishtml) {
				headers[T_CSRF] = DEF.csrf;
				options.csrf = true;
			}

			var canencrypt = encryptsecret && !noencrypt && (!encryptvalidator || encryptvalidator(options));
			if (method !== 'GET') {
				if (typeof(data) === TYPE_S) {
					options.data = canencrypt ? encrypt_data(data, encryptsecret) : data;
				} else {
					var tmp = urlencoded ? QUERIFY(data).substring(1) : STRINGIFY(data);
					if (!urlencoded)
						options.contentType = options.headers['Content-Type'] = 'application/json; charset=utf-8';
					options.data = canencrypt ? encrypt_data(tmp, encryptsecret) : tmp;
				}
			}

			if (canencrypt) {
				options.headers['X-Encryption'] = 'a';
				options.encrypted = true;
			}

			events.request && EMIT('request', options);

			if (options.cancel)
				return;

			if (options.credentials) {
				if (!options.xhrFields)
					options.xhrFields = {};
				options.xhrFields.withCredentials = true;
			} else if (options.xhrFields)
				delete options.xhrFields;

			options.type = options.method;
			delete options.method;

			var output = {};
			output.throw = ajaxcustomerror;
			output.respond = ajaxcustomresponse;
			output.url = options.url;
			output.process = true;
			output.error = false;
			output.json = json;
			output.upload = false;
			output.method = method;
			output.data = data;
			output.scope = curr_scope;
			output.callback = callback;
			output.encrypted = options.encrypted;
			output.duration = options.duration;
			output.credentials = options.credentials;
			output.decryption = !nodecrypt;

			if (options.credentials != null)
				delete options.credentials;

			if (cancel)
				cache[mainurl] = { options: options, output: output };

			delete options.url;

			options.success = function(r, s, req) {
				if (cancel)
					delete cache[mainurl];
				pendingrequest--;
				ajaxprocess(output, req.status, s, r, req.getAllResponseHeaders ? parseHeaders(req.getAllResponseHeaders()) : req.headers);
			};

			options.error = function(req, s) {

				if (cancel)
					delete cache[mainurl];

				pendingrequest--;
				var code = req.status;

				if (repeat && (!code || code === 408 || code === 502 || code === 503 || code === 504 || code === 509)) {
					// internal error
					// internet doesn't work
					setTimeout(function() {
						current_scope = curr_scope;
						AJAX.apply(M, arg);
					}, MD.delayrepeat);
				} else
					ajaxprocess(output, code, s, req.responseText, req.getAllResponseHeaders ? parseHeaders(req.getAllResponseHeaders()) : req.headers, true);
			};

			if (output.url === '--socket--') {
				output.$success = options.success;
				output.$error = options.error;
				socket && socket(output);
				return;
			}

			var xhr = $.ajax(makeurl(output.url), options);

			if (cancel)
				cache[mainurl].xhr = xhr;

		};

		if (cl.length)
			CL(cl.join(','), () => setTimeout($call, timeout || 0));
		else
			setTimeout($call, timeout || 0);
	};

	function ajaxcustomerror(response, headers, code) {
		var t = this;

		if (typeof(headers) === TYPE_N) {
			code = headers;
			headers = null;
		}

		t.cancel = false;
		t.process = true;
		ajaxprocess(t, code, ATTRDATA, response, headers || EMPTYOBJECT, true);
		t.cancel = true;
	}

	function ajaxcustomresponse(response, headers) {
		var t = this;
		t.cancel = false;
		t.process = true;
		ajaxprocess(t, 200, ATTRDATA, response, headers || EMPTYOBJECT);
		t.cancel = true;
	}

	function ajaxprocess(output, code, status, response, headers, error) {

		var p = output.progress;
		if (p) {
			if (typeof(p) === TYPE_S)
				remap(p, 100);
			else
				p(100);
		}

		if (!code)
			code = 999;

		if (!response && error)
			response = code + ': ' + status;

		if (output.decryption && ((headers && headers['x-encryption']) || output.encrypted) && encryptsecret && typeof(response) === TYPE_S) {
			if (encrypthtml || output.url.indexOf('.html') === -1)
				response = decrypt_data(response, encryptsecret);
		}

		output.raw = output.response = response;
		output.status = code;
		output.text = status;
		output.error = error;
		output.headers = headers;
		output.duration = Date.now() - output.duration;

		var callback = output.callback;
		var ct = output.headers['content-type'];
		var isjson = false;
		output.type = ct;

		if (ct && ct.indexOf('/json') !== -1) {
			try {
				output.response = PARSE(output.response, MD.jsondate);
				isjson = true;
			} catch (e) {}
		}

		current_scope = output.scope;
		events[T_RESPONSE] && EMIT(T_RESPONSE, output);
		current_scope = output.scope;

		if (output.json && !isjson)
			output.response = null;

		if (output.cancel || !output.process)
			return;

		if (error) {
			if (MD.ajaxerrors) {
				if (typeof(callback) === TYPE_S)
					remap(callback, output.response);
				else
					callback && callback.call(output, output.response, output.status, output);
			} else {
				events.error && EMIT('error', output);
				if (typeof(callback) === TYPE_FN)
					callback.call(output, output.response, output.status, output);
			}
		} else {
			if (typeof(callback) === TYPE_S)
				remap(callback, output.response);
			else
				callback && callback.call(output, output.response, undefined, output);
		}
	}

	W.AJAXCACHEREVIEW = function(url, data, callback, expire, timeout, clear) {
		return AJAXCACHE(url, data, callback, expire, timeout, clear, true);
	};

	W.AJAXCACHE = function(url, data, callback, expire, timeout, clear, review) {

		var tdata = typeof(data);

		if (tdata === TYPE_FN || (tdata === TYPE_S && typeof(callback) === TYPE_S && typeof(expire) !== TYPE_S)) {
			clear = timeout;
			timeout = expire;
			expire = callback;
			callback = data;
			data = null;
		}

		if (typeof(timeout) === TYPE_B) {
			clear = timeout === true;
			timeout = 0;
		}

		var index = url.indexOf(' ');
		if (index === -1)
			return;

		var method = url.substring(0, index).toUpperCase();
		var uri = url.substring(index).trim().$env();
		var curr_scope = current_scope;

		setTimeout(function() {
			var value = clear ? undefined : cacherest(method, uri, data, undefined, expire);
			if (value !== undefined) {

				var diff = review ? STRINGIFY(value) : null;

				current_scope = curr_scope;

				if (typeof(callback) === TYPE_S)
					remap(callback, value);
				else
					callback(value, true);

				if (!review || navigator.onLine === false)
					return;

				current_scope = curr_scope;

				AJAX(url, data, function(r, err) {

					if (err)
						r = err;

					current_scope = curr_scope;

					// Is same?
					if (diff !== STRINGIFY(r)) {

						if (!err)
							cacherest(method, uri, data, r, expire);

						if (typeof(callback) === TYPE_S)
							remap(callback, r);
						else
							callback(r, false, true);
					}
				});
				return;
			}

			current_scope = curr_scope;
			AJAX(url, data, function(r, err) {
				if (err)
					r = err;

				current_scope = curr_scope;

				if (!err)
					cacherest(method, uri, data, r, expire);

				if (typeof(callback) === TYPE_S)
					remap(callback, r);
				else
					callback(r, false);
			});
		}, timeout || 1);
	};

	W.CLEARCACHE = function() {
		if (!W.isPRIVATEMODE) {
			var rem = LS.removeItem;
			var k = MD.localstorage;
			rem(k);
			rem(k + '.cache');
			rem(k + '.blocked');
		}
	};

	W.ERROR = function(arr, success, error) {

		if (typeof(arr) === TYPE_FN) {
			error = success;
			success = arr;
			arr = true;
		}

		if (arr !== true) {
			if (arr) {
				var iserr = arr instanceof Error ? true : arr instanceof Array && arr.length ? arr[0].error != null : arr.error != null;
				if (iserr) {
					events.ERROR && EMIT('ERROR', arr);
					error && W.SEEX(error, arr);
					return true;
				}
			}
			success && W.SEEX(success, arr);
			return false;
		}

		var scope = current_scope;
		return function(response, err) {

			if ((!response || typeof(response) === TYPE_S) && err > 0)
				response = [{ error: response || err }];

			current_scope = scope;
			W.ERROR(response, success, error);
		};

	};

	W.ERRORS = function(path, flags, highlight) {

		if (path instanceof Array) {
			flags = path;
			path = undefined;
		}

		if (flags === true) {
			flags = highlight instanceof Array ? highlight : null;
			highlight = true;
		}

		path = path.replace('.*', '');

		var arr = findcomponents(path, flags);
		var statelist = [];

		for (var com of arr) {
			if (com.config.touched && com.config.invalid)
				statelist.push(com);
		}

		highlight && state(statelist, 1, 1);
		return statelist;
	};

	W.CAN = function(path, flags) {

		var arr = findcomponents(pathmaker(path), flags);

		// Without components
		if (!arr.length)
			return true;

		var touched = false;
		var invalid = false;

		for (var com of arr) {
			if (com.config.touched)
				touched = true;
			if (com.config.invalid)
				invalid = true;
			if (invalid && touched)
				break;
		}

		return invalid == false && touched === true;
	};

	W.VALID = function(path, flags) {
		var arr = findcomponents(pathmaker(path), flags);
		for (var com of arr) {
			if (com.config.invalid)
				return false;
		}
		return true;
	};

	W.DISABLED = function(path, flags) {
		return !CAN(path, flags);
	};

	W.INVALID = function(path, flags) {
		path = pathmaker(path);
		if (path) {
			var arr = findcomponents(path, flags);
			for (var com of arr) {
				com.config.touched = true;
				com.config.invalid = true;
			}
			state(com, 1, 7);
		}
	};

	W.BLOCKED = function(name, timeout, callback) {

		var key = name.replace(REGSCOPEINLINE, current_scope || '?');
		var item = blocked[key];
		var now = Date.now();

		if (item > now)
			return true;

		if (typeof(timeout) === TYPE_S)
			timeout = timeout.env().parseExpire();

		var local = timeout > 10000;
		blocked[key] = now + timeout;
		!W.isPRIVATEMODE && local && LS.setItem(MD.localstorage + '.blocked', STRINGIFY(blocked));
		callback && callback();
		return false;
	};

	M.plugin = M.scope = function(val) {
		return val === undefined ? current_scope : (current_scope = val);
	};

	M.caller = function(val) {
		return val === undefined ? current_caller : (current_caller = val);
	};

	// 1 === manually
	// 2 === by input
	M.update = function(path, reset, type, wasset) {

		var meta = compilepath(path.replace(REGWILDCARD, ''));
		var newpath = meta.pathmaker ? pathmaker(meta.path) : meta.path;

		if (!newpath)
			return;

		CL(meta.cl, function() {

			var value = get(newpath);
			!wasset && set(newpath, value, true);
			DEF.monitor && monitor_method('set');

			meta.flags2 && emitflags(meta, newpath, value, type);

			var statelist = [];

			if (meta.flags.type != null)
				type = meta.flags.type;

			if (type === undefined)
				type = 1; // manually

			var arr = findcomponents(newpath);

			for (var com of arr) {

				var result = com.get();
				if (meta.flags.default && com.$default && result === undefined) {
					result = com.$default();
					com.set(result, 3);
				} else if (com.setter || (com.dom && com.dom.setter)) {
					com.$skip = false;
					try {
						com.setterX(result, newpath, type);
					} catch (e) {
						THROWERR(e);
					}
				}

				if (reset === true || meta.flags.reset || meta.flags.default) {
					com.config.modified = false;
					com.config.touched = false;
				}

				if (meta.flags.change || meta.flags.modify || meta.flags.touch)
					com.config.touched = true;

				if (meta.flags.change || meta.flags.modify)
					com.config.modified = true;

				var invalid = com.validate ? (!com.validate(result)) : false;
				com.config.invalid = invalid;

				if (!com.$ready)
					com.$ready = true;

				statelist.push(com);
			}

			state(statelist, 1, 4);

			if (!meta.flags.nowatch)
				emitwatch(newpath, get(newpath), type);
		});
	};

	W.NOTIFY = function() {

		var arg = arguments;
		var all = M.components;

		var $ticks = (Math.random() + '').substring(2, 8);
		for (var j = 0; j < arg.length; j++) {
			var p = arg[j];
			binders[p] && binderbind(p, p, $ticks, 1);
		}

		for (var i = 0; i < all.length; i++) {
			var com = all[i];
			if (!com || com.$removed || !com.$loaded || !com.path)
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
				if (com.setter || (com.dom && com.dom.setter)) {
					try {
						com.setterX(val, com.path, 1);
					} catch (e) {
						THROWERR(e);
					}
				}
				com.state && com.stateX(1, 6);
			}
		}

		for (var j = 0; j < arg.length; j++)
			emitwatch(arg[j], GET(arg[j]), 1);
	};

	M.extend = function(path, value, type) {

		var meta = compilepath(path);
		var newpath = meta.pathmaker ? pathmaker(meta.path) : meta.path;
		if (newpath) {

			CL(meta.cl, function() {
				var keys = OK(value);
				var reset = type === true || meta.flags.reset;
				if (reset)
					type = 1;

				for (var i = 0; i < keys.length; i++) {
					var p = newpath + '.' + keys[i];
					set(p, value[keys[i]], null, type);
				}

				DEF.monitor && monitor_method('set');
				meta.flags2 && emitflags(meta, newpath, value, type);

				var statelist = [];
				var arr = findcomponents(newpath);

				for (var com of arr) {

					for (var j = 0; j < keys.length; j++) {

						var p = newpath + '.' + keys[j];

						if (!com.$compare(p))
							continue;

						var result = com.get();

						if (meta.flags.default && com.$default) {
							result = com.$default();
							com.set(result, 3);
						} else if (com.setter || (com.dom && com.dom.setter)) {
							com.$skip = false;
							try {
								com.setterX(result, p, type);
							} catch (e) {
								THROWERR(e);
							}
						}

						if (!com.$ready)
							com.$ready = true;

						if (reset === true || meta.flags.reset || meta.flags.default) {
							com.config.modified = false;
							com.config.touched = false;
						}

						if (meta.flags.change || meta.flags.modify || meta.flags.touch)
							com.config.touched = true;

						if (meta.flags.change || meta.flags.modify)
							com.config.modified = true;

						com.config.invalid = com.validate ? (!com.validate(result)) : false;
						com.state && statelist.push(com);
					}
				}

				state(statelist, 1, 4);

				if (!meta.flags.nowatch) {
					for (let key of keys) {
						var p = newpath + '.' + key;
						emitwatch(p, get(p), type);
					}
				}
			});
		}
	};

	W.REWRITE = function(path, value, type) {
		var meta = compilepath(path);
		path = meta.pathmaker ? pathmaker(meta.path) : meta.path;
		if (path) {
			CL(meta.cl, function() {
				DEF.monitor && monitor_method('set');
				if (meta.flags.nobind)
					set2(W, path, value); // without data-bind
				else
					set(path, value, null, type); // with data-bind
				if (!meta.flags.nowatch)
					emitwatch(path, value, type);
				meta.flags2 && emitflags(meta, path, value, type);
			});
		}
	};

	W.REWRITE2 = function(path, value, type) {
		REWRITE(path + ' @nobind', value, type);
	};

	M.inc = function(path, value, type) {

		var meta = compilepath(path);
		var newpath = meta.pathmaker ? pathmaker(meta.path) : meta.path;

		if (!newpath)
			return;

		CL(meta.cl, function() {
			DEF.monitor && monitor_method('get');
			var current = get(newpath);
			if (!current) {
				current = 0;
			} else if (typeof(current) !== TYPE_N) {
				current = parseFloat(current);
				if (isNaN(current))
					current = 0;
			}
			current += value;
			M.set(path, current, type);
		});
	};

	// 1 === manually
	// 2 === by input
	// 3 === default
	M.set = function(path, value, type) {

		if (path.charAt(0) === '+')
			return M.push(path.substring(1), value, type);

		var meta = compilepath(path);
		path = meta.rawpath;

		if (meta.format)
			value = meta.format.fn(value, newpath, 1, meta.format.scope && current_scope ? PLUGINS[current_scope] : null);

		if (meta.path.charAt(0) === '~' || meta.flags.extend) {
			CL(meta.cl, () => M.extend(meta.flags.extend ? path : path.substring(1), value, type));
			return;
		}

		var newpath = meta.pathmaker ? pathmaker(meta.path) : meta.path;
		if (!newpath)
			return;

		var isupdate = (typeof(value) === TYPE_O && value != null && !(value instanceof Array) && !(value instanceof Date));
		var reset = type === true;
		if (reset)
			type = 1;

		CL(meta.cl, function() {

			if (meta.flags.diff) {
				var val = get(newpath);
				if (HASH(val) === HASH(value))
					return;
			}

			set(newpath, value, null, type);

			if (isupdate)
				return M.update(path, reset, type, true);

			DEF.monitor && monitor_method('set');

			var result = get(newpath);
			var statelist = [];

			meta.flags2 && emitflags(meta, newpath, result, type);

			if (type === undefined)
				type = 1;

			if (meta.flags.type != null)
				type = meta.flags.type;

			var arr = findcomponents(newpath);

			for (var com of arr) {

				if (meta.flags.default && com.$default)
					com.set(com.$default(), 3);
				else if (com.setter || (com.dom && com.dom.setter)) {
					if (com.path === newpath) {
						try {
							com.setterX(result, newpath, type);
						} catch (e) {
							THROWERR(e);
						}
					} else {
						try {
							var val = get(com.path);
							com.setterX(val, newpath, type);
						} catch (e) {
							THROWERR(e);
						}
					}
				}

				if (!com.$ready)
					com.$ready = true;

				if (type !== 3)
					statelist.push(com);

				if (reset || meta.flags.reset || meta.flags.default) {
					com.config.touched = false;
					com.config.modified = false;
				}

				if (meta.flags.change || meta.flags.modify || meta.flags.touch)
					com.config.touched = true;

				if (meta.flags.change || meta.flags.modify)
					com.config.modified = true;

				com.config.invalid = com.validate ? (!com.validate(result)) : false;
			}

			state(statelist, type, 5);

			if (!meta.flags.nowatch)
				emitwatch(newpath, result, type);
		});
	};

	M.push = function(path, value, type) {

		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++)
				M.push(path[i], value, type);
			return;
		}

		var meta = compilepath(path);
		var unshift = 0;
		var p = meta.path;

		if (p.charAt(0) === '^') {
			p = p.substring(1);
			unshift = 1;
		}

		CL(meta.cl, function() {

			var newpath = meta.pathmaker ? pathmaker(p) : p;
			var arr = get(newpath);
			var n = false;

			if (!(arr instanceof Array)) {
				arr = [];
				n = true;
			}

			var is = true;

			if (value instanceof Array) {
				if (value.length) {
					if (unshift)
						arr.unshift.apply(arr, value);
					else
						arr.push.apply(arr, value);
				} else
					is = false;
			} else {
				if (unshift)
					arr.unshift(value);
				else
					arr.push(value);
			}

			if (n)
				M.set(p, arr, type);
			else if (is)
				M.update(p, undefined, type);
		});
	};

	function compilepath(path) {

		var key = '__' + path;
		var pv = paths[key];
		if (pv)
			return pv;

		var obj = {};
		obj.flags = {};
		obj.flagslist = '';

		if (path.indexOf(' #') !== -1) {
			obj.cl = [];
			path = path.replace(REGCL, function(text) {
				obj.cl.push(text.trim().substring(1));
				return '';
			}).trim();
			obj.cl = obj.cl.join(',');
		}

		obj.format = findformat(path);
		obj.rawpath = path;

		if (obj.format)
			obj.rawpath = path = obj.format.path;

		path = path.replace(/@[\w:]+/g, function(text) {
			obj.flagslist += (obj.flagslist ? ' ' : '') + text;
			var name = text.substring(1);
			var index = name.indexOf(':');
			if (index !== -1) {
				var k = name.substring(0, index);
				var v = name.substring(index + 1);
				obj.flags[k] = k == 'type' && v.charCodeAt(0) < 58 ? +v : v;
			} else
				obj.flags[name] = 1;
			return '';
		}).trim();

		if (obj.flagslist)
			obj.flagslist = ' ' + obj.flagslist;

		obj.path = path.env();

		var c = obj.path.charAt(0);

		if (c === '%')
			obj.path = T_TMP + obj.path.substring(1);
		else if (c === '#')
			obj.path = MD.pathcl + obj.path.substring(1);
		else if (c === '*')
			obj.path = MD.pathcommon + obj.path.substring(1);

		obj.path = makepluginpath(obj.path);
		obj.flags2 = [];

		var keys = Object.keys(obj.flags);
		var skip = { reset: 1, default: 1, change: 1, extend: 1, nowatch: 1, type: 1, nobind: 1 };

		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (!skip[key])
				obj.flags2.push(key);
		}

		if (!obj.flags2.length)
			delete obj.flags2;

		obj.pathmaker = obj.path.charAt(0) === '@' ? false : (/\?|\/|\s|\[/).test(obj.path);
		return paths[key] = obj;
	}

	function emitflags(meta, path, value, type) {
		var flags = meta instanceof Array ? meta : meta.flags2;
		for (var i = 0; i < flags.length; i++) {
			var name = '@flag ' + flags[i];
			events[name] && EMIT(name, path, value, type);
		}
	}

	function pathmaker(path, clean, noscope) {

		if (!path)
			return path;

		var tmp = '';

		if (clean) {
			var index = path.indexOf(' ');
			if (index !== -1) {
				tmp = path.substring(index);
				path = path.substring(0, index);
			}
		}

		path = path.env();

		if (!noscope && current_scope)
			path = path.replace(REGSCOPEINLINE, current_scope);

		var c = path.charCodeAt(0);

		// common
		if (c === 42) // *
			return MD.pathcommon + path.substring(1);

		// codelist
		if (c === 35) // #
			return MD.pathcl + path.substring(1);

		// temporary
		if (c === 37) // %
			return T_TMP + path.substring(1) + tmp;

		if (c === 64) { // @
			// parent component.data()
			return path;
		}

		var index = path.indexOf('/');
		if (index === -1)
			return path + tmp;

		var p = path.substring(0, index);
		var rem = W.PLUGINS[p];

		return ((rem ? ('PLUGINS[\'' + p + '\']') : (p + '_plugin_not_found')) + '.' + path.substring(index + 1)) + tmp;
	}

	W.RETURN = function(cmd, multiple) {

		cmd = cmd.split('/').trim();

		if (cmd.length !== 2)
			return;

		var selector = cmd[0];
		var prop = cmd[1];
		var is = prop.indexOf('.') !== -1;

		DEF.monitor && monitor_method('returns');

		if (multiple) {
			var arr = FIND(selector, true);
			var output = [];
			for (var i = 0; i < arr.length; i++) {
				var val = is ? get(prop, arr[i]) : arr[i][prop];
				if (val !== undefined)
					output.push(val);
			}
			return output;
		} else {
			var com = FIND(selector);
			if (com)
				return is ? get(prop, com) : com[prop];
		}
	};

	W.CLRELOAD = function(name, callback) {
		var arr = name.split(',').trim();
		arr.wait(function(name, next) {
			var cl = M.cl[name];
			if (cl) {
				cl.reload = true;
				CL(name, () => next());
			} else
				next();
		}, callback);
	};

	W.CL_INIT = W.CLINIT = function(name, callback, expire, init) {

		if (typeof(expire) === TYPE_B) {
			init = expire;
			expire = '';
		}

		if (typeof(callback) === TYPE_S) {
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

		name = pathmaker(name);
		M.cl[name] = { callback: callback, expire: expire };
		init && W.CL(name, NOOP);
	};

	W.CL = function(name, callback) {

		if (!name) {
			callback && callback();
			return;
		}

		var arr = name.split(',').trim();
		arr.wait(function checkcl(key, next) {
			key = pathmaker(key);
			var item = M.cl[key];
			if (item) {
				if (!item.reload && DEF.cl[key]) {
					next();
				} else {
					item.callback(function(val, extend) {
						var p = 'DEF.cl';
						if (extend === true)
							EXTEND(p, val);
						else
							SET(p + '.' + key, val);
						item.date = NOW = new Date();
						item.reload = false;
						next();
					});
				}
			} else {
				if (DEF.cl[key])
					next();
				else
					setTimeout(checkcl, M.delaywatcher, key, next);
			}
		}, callback);
	};

	W.GET = function(path, scope) {

		if (!path)
			return;

		var meta = compilepath(path);
		var newpath = meta.pathmaker ? pathmaker(meta.path) : meta.path;

		path = meta.rawpath;

		if (scope === true) {
			scope = null;
			RESET(path, true);
		} else if (typeof(scope) === TYPE_FN) {
			var val = meta.flags.modified ? getmodified(newpath) : get(newpath);
			if (val == null) {
				setTimeout(GET, MD.delaywatcher, path, scope);
			} else {
				scope(val);
				DEF.monitor && monitor_method('get');
				meta.flags.reset && RESET(path, true);
			}
			return;
		}

		DEF.monitor && monitor_method('get');
		meta.flags.update && setTimeout(W.UPD, 1, path);
		var value = meta.flags.modified ? getmodified(newpath) : meta.flags.clone ? CLONE(get(newpath, scope)) : get(newpath, scope);
		meta.flags.reset && W.RESET(path, true);
		meta.flags2 && emitflags(meta, newpath, value);

		if (meta.format)
			value = meta.format.fn(value, newpath, 1, meta.format.scope && current_scope ? PLUGINS[current_scope] : null);

		return value;
	};

	function getmodified(path) {
		var model = null;
		var arr = MODIFIED(path);
		var index = path.indexOf('.*');
		if (index !== -1)
			path = path.substring(0, index);
		for (var i = 0; i < arr.length; i++) {
			var p = arr[i];
			if (model == null)
				model = {};
			var prop = p.substring(path.length + 1).trim();
			if (prop)
				set2(model, prop, get(p));
		}
		return model;
	}

	W.VALIDATE = function(path, flags) {

		var arr = [];
		var valid = true;

		var meta = compilepath(path.replace(REGWILDCARD, ''));
		var newpath = meta.pathmaker ? pathmaker(meta.path) : meta.path;

		var arr = findcomponents(newpath, flags);
		var statelist = [];
		var valid = true;

		for (var com of arr) {
			if (com.validate) {
				com.config.invalid = !com.validate(com.get());
				if (com.config.invalid)
					valid = false;
			}
			statelist.push(com);
		}

		state(statelist, 1, 1);
		meta.flags && meta.flags.flags(newpath, GET(newpath));
		return valid;
	};

	function com_validate2(com) {
		com.config.invalid = com.validate ? (!com.validate(com.get())) : false;
		state([com], 1, 1);
		return !com.config.invalid;
	}

	M.default = function(path, timeout, onlyComponent, reset, scope) {

		if (timeout !== true && timeout > 0) {
			setTimeout(M.default, timeout, path, 0, onlyComponent, reset, scope || current_scope);
			return;
		}

		if (typeof(onlyComponent) === TYPE_B) {
			reset = onlyComponent;
			onlyComponent = null;
		}

		if (reset === undefined)
			reset = true;

		var curr_scope = current_scope;

		if (scope)
			current_scope = scope;

		path = pathmaker(path).replace(REGWILDCARD, '');

		// Reset scope
		var key = path.replace(/\.\*$/, '');
		var fn = defaults['#' + HASH(key)];
		var tmp;

		if (fn) {
			tmp = fn();
			set(key, tmp, null, 3);
		}

		var arr = [];
		var all = M.components;

		for (var i = 0; i < all.length; i++) {
			var com = all[i];

			if (!com || com.$removed || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			if (com.state)
				arr.push(com);

			if (onlyComponent && onlyComponent._id !== com._id)
				continue;

			com.$default && com.set(com.$default(), 3);

			if (!reset)
				return;

			com.config.touched = false;
			com.config.modified = false;
			com.config.invalid = com.validate ? (!com.validate(com.get())) : false;
		}

		if (reset)
			state(arr, 3, 3);

		current_scope = curr_scope;
	};

	W.RESET = function(path, timeout, onlyComponent, scope) {

		if (timeout !== true && timeout > 0) {
			setTimeout(W.RESET, timeout, path, null, scope || current_scope);
			return;
		}

		var tmp = current_scope;

		if (scope)
			current_scope = scope;

		var meta = compilepath(path.replace(REGWILDCARD, ''));
		var newpath = (meta.pathmaker ? pathmaker(meta.path) : meta.path);

		var arr = [];
		var components = findcomponents(newpath);

		DEF.monitor && monitor_method('reset');

		for (var com of components) {

			// com.state && arr.push(com);
			arr.push(com);

			if (onlyComponent && onlyComponent._id !== com._id)
				continue;

			if (meta.flags.default && com.$default)
				com.set(com.$default(), 3);

			com.config.touched = false;
			com.config.modified = false;

			if (com.validate)
				com.config.invalid = !com.validate(com.get());
			else
				com.config.invalid = false;
		}

		state(arr, 1, 3);
		current_scope = tmp;
	};

	M.each = function(fn, path) {
		var wildcard = path ? path.lastIndexOf('*') !== -1 : false;
		if (wildcard)
			path = path.replace('.*', '');
		var all = M.components;
		var index = 0;
		for (var i = 0; i < all.length; i++) {
			var com = all[i];
			if (!com || !com.$loaded || com.$removed || (path && (!com.path || !com.$compare(path))))
				continue;
			var stop = fn(com, index++, wildcard);
			if (stop === true)
				return;
		}
	};

	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================

	function attrcom(el, name) {
		if (!el.attrd)
			el = $(el);
		return name ? el.attrd(ATTRDATA + '-' + name) : (el.attrd(T_COM) || el.attrd(T_));
	}

	function crawler(container, onComponent, level) {

		if (container)
			container = $(container)[0];
		else
			container = D.body;

		if (!container)
			return;

		var comp = container ? attrcom(container, 'compile') : '1';
		if (comp === '0' || comp === T_FALSE)
			return;

		var b = null;
		var binders = null;

		if (!container.$jcbind) {
			b = container.getAttribute(T_DATA + T_BIND) || container.getAttribute(T_BIND);
			if (b) {
				!binders && (binders = []);
				binders.push({ el: container, b: b });
			}
		}

		var name = attrcom(container);

		!container.$com && name != null && onComponent(name, container, 0);

		var arr = container.childNodes;
		var sub = [];

		if (level === undefined)
			level = 0;
		else
			level++;

		for (var i = 0; i < arr.length; i++) {
			var el = arr[i];
			if (el) {

				if (!el.tagName)
					continue;

				var webc = el.tagName.indexOf('-') !== -1;

				comp = el.getAttribute(T_DATA + T_COMPILED);
				if (comp === '0' || comp === T_FALSE)
					continue;

				if (!webc && el.$com === undefined) {
					name = attrcom(el);
					if (name != null)
						onComponent(name || '', el, level);
				}

				if (!webc && !el.$jcbind) {
					b = el.getAttribute(T_DATA + T_BIND) || el.getAttribute(T_BIND);
					if (b) {
						el.$jcbind = 1;
						!binders && (binders = []);
						binders.push({ el: el, b: b });
					}
				}

				comp = el.getAttribute(T_DATA + T_COMPILED);
				if (comp !== '0' && comp !== T_FALSE)
					el.childNodes.length && el.tagName !== 'SCRIPT' && REGCOM.test(el.innerHTML) && sub.indexOf(el) === -1 && sub.push(el);
			}
		}

		for (var i = 0; i < sub.length; i++) {
			el = sub[i];
			el && crawler(el, onComponent, level);
		}

		if (binders) {
			for (var i = 0; i < binders.length; i++) {
				var a = binders[i];
				a.el.$jcbind = a.el.uibind = parsebinder(a.el, a.b);
			}
		}
	}

	function findcomponent(container, selector, callback) {

		var s = (selector ? selector.split(' ') : EMPTYARRAY);
		var path = '';
		var name = '';
		var id = '';
		var version = '';
		var index;

		for (var i = 0; i < s.length; i++) {
			switch (s[i].charAt(0)) {
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
			for (var j = 0; j < container.length; j++) {
				var childs = container[j].querySelectorAll(ATTRCOM);
				for (var i = 0; i < childs.length; i++) {
					var com = childs[i].$com;
					if (!com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.version !== version) || (path && (com.$pp || (com.path !== path && (!com.pathscope || ((com.pathscope + '.' + path) !== com.path))))))
						continue;
					if (callback) {
						if (callback(com) === false)
							break;
					} else
						arr.push(com);
				}
			}
		} else {
			for (var i = 0; i < M.components.length; i++) {
				var com = M.components[i];
				if (!com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.version !== version) || ((path && (com.$pp || (com.path !== path && (!com.pathscope || ((com.pathscope + '.' + path) !== com.path)))))))
					continue;

				if (callback) {
					if (callback(com) === false)
						break;
				} else
					arr.push(com);
			}
		}

		return arr;
	}

	function findcontrol(container, onElement, level) {

		var arr = container.childNodes;
		var sub = [];

		ACTRLS[container.tagName] && onElement(container);

		if (level == null)
			level = 0;
		else
			level++;

		for (var i = 0; i < arr.length; i++) {
			var el = arr[i];

			if (el && el.tagName) {

				var tag = el.tagName;

				if (tag !== 'INPUT' && tag !== 'SELECT' && tag !== 'TEXTAREA' && el.$com)
					continue;

				if (el.childNodes.length && tag !== 'SCRIPT' && !attrcom(el))
					sub.push(el);

				if (ACTRLS[el.tagName] && el.getAttribute(ATTRJCBIND) != null && onElement(el) === false)
					return;
			}
		}

		for (var i = 0; i < sub.length; i++) {
			el = sub[i];
			if (el && findcontrol(el, onElement, level) === false)
				return;
		}
	}

	var loaddone = false;

	function load() {

		$ready && clearTimeout($ready);
		$ready = null;

		if (loaddone) {
			// Clears previous cache
			storage = {};
			blocked = {};
		} else
			loaddone = true;

		var cache;

		try {
			cache = LS.getItem(MD.localstorage + '.cache');
			if (cache && typeof(cache) === TYPE_S)
				storage = PARSE(cache);
		} catch (e) {}
		try {
			cache = LS.getItem(MD.localstorage + '.blocked');
			if (cache && typeof(cache) === TYPE_S)
				blocked = PARSE(cache);
		} catch (e) {}

		if (storage) {
			var obj = storage[T_PATHS];
			if (obj) {
				for (var key in obj.value)
					M.set(key, obj.value[key], true);
			}
		}
	}

	function dependencies(declaration, callback, obj, el) {

		if (declaration.importing) {
			WAIT(() => declaration.importing !== true, () => callback(obj, el));
			return;
		}

		if (!declaration.dependencies || !declaration.dependencies.length) {
			setTimeout((callback, obj, el) => callback(obj, el), 5, callback, obj, el);
			return;
		}

		declaration.importing = true;
		declaration.dependencies.wait(function(item, next) {
			if (typeof(item) === TYPE_FN) {
				item(next);
			} else {

				if (item.charAt(0) === '@') {

					// Component
					var name = item.substring(1);
					if (!PPC.caniuse(name)) {
						ADD({ name: name, prepend: true });
						WARN('The "{0}" component has downloaded the dependent component "{1}".'.format(obj.name, name));
						WAIT(() => PPC.caniuse(name), next, 500, 2000);
					} else
						next();
					return;
				}

				IMPORT((item.indexOf('<') === -1 ? 'once ' : '') + item, next);
			}
		}, function() {
			declaration.importing = false;
			callback(obj, el);
		});
	}

	function compile(container) {

		if (C.is) {
			C.recompile = true;
			return;
		}

		var arr = [];

		if (W.READY instanceof Array && W.READY.length)
			arr.push.apply(arr, W.READY.splice(0));

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
				C.pending.push(() => compile(container));
			})(container);
			return;
		}

		DEF.monitor && monitor_method('compilation', 1);

		var has = false;

		if (!MD.webcomponentsonly)
			crawler(container, compilecomponent);

		// perform binder
		rebindbinder();

		if (!has || !C.pending.length)
			C.is = false;

		if (container !== undefined || !toggles.length) {
			nextpending();
			return;
		}

		async(toggles, function(item, next) {
			for (var i = 0; i < item.toggle.length; i++)
				item.element.tclass(item.toggle[i]);
			next();
		}, nextpending);
	}

	function compilecomponent(comname, dom) {

		var el = $(dom);
		var meta = comname instanceof Array ? comname : comname.split(REGMETA);
		if (meta.length) {
			meta = meta.trim(true);
			comname = meta[0];
		} else
			meta = null;

		// Check singleton instance
		if (statics['$ST_' + comname]) {
			remove(el);
			return;
		}

		var instances = [];
		var all = comname.split(',');

		for (var y = 0; y < all.length; y++) {

			var name = all[y].trim();
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

			var lazy = false;

			if (name.substring(0, 5).toLowerCase() === 'lazy ') {
				name = name.substring(5);
				lazy = true;
			}

			if (!is && name.lastIndexOf('@') === -1) {
				if (versions[name])
					name += '@' + versions[name];
				else if (MD.versioncomponents)
					name += '@' + MD.versioncomponents;
			}

			var com = M.$components[name];
			var lo = null;

			if (lazy && name) {
				var namea = name.substring(0, name.indexOf('@'));
				lo = lazycom[name];
				if (!lo) {

					var obj = {};
					obj.state = 1;
					obj.nodes = [];

					if (namea && name !== namea)
						lazycom[name] = lazycom[namea] = obj;
					else
						lazycom[name] = obj;

					if (dom.$jcwebcomponent)
						obj.nodes.push(dom);

					DEF.monitor && monitor_method('lazy', 1);
					continue;
				}
				if (lo.state === 1)
					continue;
			}

			if (!com) {

				if (!fallback[name]) {
					fallback[name] = 1;
					fallback.$++;
				}

				var x;

				if (meta[2]) {
					var index = meta[2].indexOf('$url:');
					if (index !== -1) {
						var end = meta[2].indexOf(';', index + 5);
						if (end === -1)
							end = meta[2].length;
						x = meta[2].substring(index + 5, end);
					}
				}

				if (!x) {
					!statics['$NE_' + name] && (statics['$NE_' + name] = true);
					continue;
				}

				if (C.imports[x] === 1)
					continue;

				if (C.imports[x] === 2) {
					!statics['$NE_' + name] && (statics['$NE_' + name] = true);
					continue;
				}

				C.imports[x] = 1;
				C.importing++;

				IMPORT(x, function() {
					C.importing--;
					C.imports[x] = 2;
				});

				continue;
			}

			if (fallback[name] === 1) {
				fallback.$--;
				delete fallback[name];
			}

			if (statics['$ST_' + com.name]) {
				remove(el);
				continue;
			}

			var obj = new COM(com.name);
			var parent = dom.parentNode;

			while (true) {
				if (parent.$com) {
					var pc = parent.$com;
					obj.owner = pc;
					if (pc.$children)
						pc.$children++;
					else
						pc.$children = 1;
					break;
				} else if (parent.tagName === T_BODY)
					break;
				parent = parent.parentNode;
				if (parent == null)
					break;
			}

			obj.global = com.shared;
			obj.element = el;
			obj.dom = dom;
			obj.version && obj.aclass('jc-v' + obj.version);

			var p = attrcom(el, T_PATH) || (meta ? meta[1] === TYPE_NULL ? '' : meta[1] : '') || ''; // || obj._id;
			var tmp = TRANSLATE(attrcom(el, T_CONFIG) || (meta ? meta[2] === TYPE_NULL ? '' : meta[2] : ''));

			var c = p.charAt(0);

			if (c === '%' || (tmp && tmp.indexOf('$noscope:') !== -1) || c === '#' || c === '*' || c === '=')
				obj.$noscope = true;

			obj.setPath(pathmaker(p, 1, 1), 1);

			if (!obj.id)
				obj.id = obj._id;

			obj.siblings = all.length > 1;
			obj.$lazy = lo;
			dom.$com = dom.uicomponent = obj;

			if (!dom.ui)
				dom.ui = obj;

			if (!obj.$noscope)
				obj.$noscope = attrcom(el, 'noscope') === T_TRUE;

			var code = obj.path ? obj.path.charCodeAt(0) : 0;
			if (!obj.$noscope && !obj.$pp) {

				var scope = findscope(dom);
				var is = false;

				if (obj.path && code !== 33 && code !== 35) {
					if (scope) {

						is = (obj.path || '').indexOf('?') !== -1;

						if (obj.path === '?') {
							obj.setPath(scope.path, 2);
							is = true;
						} else
							is && obj.setPath(scope.makepath(obj.path), 2);
					} else {
						var pn = dom.parentNode;
						if (pn && !pn.$noscope)
							pn.$noscope = true;
					}

				} else {
					obj.$$path = EMPTYARRAY;
					obj.path = '';
				}

				if (is) {
					obj.scope = scope;
					obj.pathscope = scope.path;
					obj.plugin = scope.plugin;
				}
			}

			if (tmp && tmp.charAt(0) === '%')
				obj.config = W[tmp.substring(1)] || {};
			else
				obj.config = {};

			obj.config.modified = false;
			obj.config.touched = false;
			obj.config.invalid = false;

			// Default config
			com.config && obj.reconfigure(com.config, NOOP);
			tmp && obj.reconfigure(tmp, NOOP);

			for (var i = 0; i < configs.length; i++) {
				var con = configs[i];
				con.fn(obj) && obj.reconfigure(typeof(con.config) === TYPE_FN ? con.config.call(obj) : con.config, NOOP);
			}

			var at = obj.name.lastIndexOf('@');
			current_com = obj;
			com.declaration.call(obj, obj, obj.config, MD.prefixcsscomponents + (at === - 1 ? obj.name : obj.name.substring(0, at)));
			current_com = null;

			meta[3] && el.attrd('jc-value', meta[3]);

			if (obj.init && !statics[name]) {
				statics[name] = true;
				obj.init();
			}

			instances.push(obj);

			if (dom.tagName === 'UI-COMPONENT') {
				dom.$jcinitialized = true;
				dom.config = obj.config;
			}

			if (com.dependencies) {
				dependencies(com, function(obj, el) {

					if (obj.make) {
						var parent = current_com;
						current_com = obj;
						obj.make();
						current_com = parent;
					}

					init(el, obj);
				}, obj, el);
			} else {

				// Because sometimes make doesn't contain the content of the element
				setTimeout(function(init, el, obj) {

					if (obj.make) {
						var parent = current_com;
						current_com = obj;
						obj.make();
						current_com = parent;
					}

					init(el, obj);

				}, 5, init, el, obj);
			}
		}

		// A reference to instances
		if (instances.length > 0)
			el.$com = el.uicomponent = instances.length > 1 ? instances : instances[0];
	}

	function findscope(el) {

		// OLD: el = el.parentNode;

		// For quick DOM travelsation (this is a simple cache)
		if (el && el.$noscope)
			return;

		while (el && el.tagName !== T_BODY) {

			if (el.$scopedata)
				return el.$scopedata;

			var path;
			var tag = el.tagName;
			if (tag === 'UI-PLUGIN') {
				path = el.getAttribute(T_PATH) || '';
				if (path.indexOf('__') === -1) {
					path += '__' + el.getAttribute(T_CONFIG) || 'null';
					var tmp = el.getAttribute(T_DEFAULT);
					if (tmp)
						path += '__' + tmp;
				}
			} else if (tag === 'UI-COMPONENT' || tag === 'UI-BIND' || tag === 'UI-IMPORT') {
				// e.g. <ui-component name="box" plugin=""
				path = el.getAttribute(PLUGINNAME);
			} else
				path = (el.getAttribute ? (el.getAttribute(ATTRPLUGIN) || el.getAttribute(PLUGINNAME) || el.getAttribute(ATTRSCOPE2) || el.getAttribute(SCOPENAME)) : null);

			if (path) {

				var meta = path.split(REGMETA);
				if (meta.length > 1)
					path = meta[0];

				var scope = new Scope();
				var conf = TRANSLATE((meta[1] || '').replace(/\$/g, '').parseConfig());
				var c = path.charAt(0);
				var isolated = c === '!';

				scope.isolated = isolated || !!conf.isolated;

				if (c === '!')
					path = path.substring(1);

				var tmp = path.split(' ');

				if (!tmp[0] || tmp[0] === '?')
					path = GUID(10).replace(/\d/g, '') + Date.now().toString(36);
				else if (tmp[1]) {
					// dynamically assigned plugin
					path = tmp[0];
				}

				if (path === '*')
					path = MD.pathcommon.substring(0, MD.pathcommon.length - 1);

				scope._id = scope.ID = scope.id = GUID(10);
				scope.element = $(el);
				scope.config = conf;
				el.$scopedata = scope;
				conf.aclass && scope.element.aclass(path);

				// find parent
				// OLD: scope.parent = findscope(el);
				scope.parent = findscope(el.parentNode);
				scope.elements = [];

				DEF.monitor && monitor_method('scopes', 1);

				var parent = scope.parent;

				if (!parent) {
					var pn = el.parentNode;
					if (pn)
						pn.$noscope = true;
				}

				while (parent) {
					scope.elements.push(parent.element[0]);
					if (parent.isolated)
						break;
					parent = parent.parent;
					if (parent == null)
						break;
				}

				if (scope.isolated)
					scope.path = path;
				else if (scope.parent) {
					if (path.indexOf('?') !== -1) {
						path = path.replace(/\?(\d)*\./, function(text) {
							var skip = text.length > 2 ? +text.substring(1, text.length - 1) : 0;
							if (skip) {
								for (var i = 0; i < skip; i++)
									scope.elements.shift();
								scope.parent = scope.elements.length ? scope.elements[0].$scopedata : null;
							}
							return '';
						});
						scope.path = scope.parent.path + '.' + path;
					} else
						scope.path = scope.parent.path + '.' + path;
				} else
					scope.path = path;

				path = scope.path;
				var plugin;

				if (tmp[1]) {
					plugin = pluginscope[tmp[1]];
					if (plugin) {
						current_element = scope.element;
						W.PLUGINS[scope.path] = scope.plugin = new Plugin(path, plugin.fn, 0, 0, current_caller && PLUGINS[current_caller]);
						scope.plugin.scopedata = scope;
					} else {
						debug && WARN(ERRPLUGIN.format('? ' + tmp[1]));
						return;
					}
				} else {
					// Tries to assign an element into the plugin
					scope.plugin = plugin = W.PLUGINS[scope.path];
					if (plugin) {
						plugin.element = scope.element;
					} else {
						// The plugin not found
						current_element = scope.element;
						W.PLUGINS[scope.path] = new Plugin(path, NOOP, 0, 0, current_caller && PLUGINS[current_caller]);
						// "scope.plugin" can't be assigned due to the bad declaration in the Exec method
						debug && WARN(ERRPLUGIN.format(scope.path));
					}
				}

				scope.elements.push(el);

				tmp = meta[2] || attrcom(el, T_VALUE);
				if (tmp) {
					var fn = new Function('return ' + tmp);
					defaults['#' + HASH(path)] = fn; // store by path (DEFAULT() --> can reset scope object)
					tmp = fn();
					set(path, tmp, null, 1);
					emitwatch(path, tmp, 1);
				}

				// Applies classes
				var cls = conf.class || attrcom(el, T_CLASS);
				if (cls) {
					(function(cls) {
						cls = cls.split(' ');
						setTimeout(function() {
							for (var i = 0; i < cls.length; i++)
								scope.element.tclass(cls[i]);
						}, conf.delay || 300);
					})(cls);
				}

				tmp = conf.init || attrcom(el, 'init');
				if (tmp) {
					tmp = GET(tmp.replace(/\?/g, path));
					if (tmp) {
						var a = current_owner;
						current_owner = SCOPENAME + scope._id;
						current_scope = path;
						tmp.call(scope, path, scope.element);
						current_owner = a;
					}
				}

				return scope;

			} else {
				el = el.parentNode;
				if (el && el.$noscope)
					return;
			}
		}
	}

	function download() {

		var arr = [];
		var items = waitforimport.splice(0);

		var els = MD.webcomponentsonly ? EMPTYARRAY : document.querySelectorAll('[' + T_DATA + T_IMPORT + ']');

		for (var i = 0; i < els.length; i++)
			items.push(els[i]);

		for (var i = 0; i < items.length; i++) {

			var t = items[i];
			if (!t.$downloaded) {

				var el = $(t);
				var data = (el.attrd(T_IMPORT) || el.attr(T_CONFIG) || '').parseConfig();

				t.$downloaded = 1;

				// data.url
				// data.cache
				// data.init
				// data.path
				// data.class
				// data.make
				// data.replace
				// data.target
				// data.reevaluate

				// Unique
				var url = data.url;
				if (!url)
					url = el.attr(T_PATH);

				var once = url.substring(0, 5).toLowerCase() === 'once ';
				if (url.charAt(0) === '!' || once) {
					if (once)
						url = url.substring(5);
					else
						url = url.substring(1);
					if (statics[url])
						continue;
					statics[url] = 2;
				}

				data.url = url;
				data.element = el;
				data.toggle = data.class;
				arr.push(data);
			}
		}

		if (!arr.length)
			return;

		C.importing++;

		async(arr, function(item, next) {

			var key = makeurl(item.url);

			AJAXCACHE('GET ' + item.url, null, function(response) {

				key = '$import' + key;

				if (typeof(response) !== TYPE_S) {
					statics[key] = true;
					current_element = null;
					next();
					return;
				}

				current_element = item.element[0];

				if (typeof(response) === TYPE_S)
					response = ADAPT(item.path, item.id, response);

				if (!item.reevaluate && statics[key])
					response = removescripts(response);
				else
					response = importscripts(importstyles(response, HASH(key) + ''));

				statics[key] = true;
				item.toggle && item.toggle.length && item.toggle[0] && toggles.push(item);

				if (item.make) {
					var fn = null;
					if (item.make.indexOf('/') === -1)
						fn = get(item.make);
					else {
						var tmp = item.make.replace('?', item.path).split('/');
						var plugin = W.PLUGINS[tmp[0]];
						if (plugin) {
							fn = plugin[tmp[1]];
							fn && plugin.scope();
						}
					}
					if (fn && typeof(fn) === TYPE_FN) {
						response = fn(response, item.element, item.path);
						if (!response) {
							current_element = null;
							next();
							return;
						}
					}
				}

				if (item.target)
					$(item.target).append(response);
				else if (item.replace)
					item.element.replaceWith(response);
				else
					item.element.html(response);

				if (item.init) {
					if (item.init.indexOf('/') === -1) {
						var init = get(item.init);
						if (typeof(init) === TYPE_FN)
							init(item.element);
					} else
						EXEC(true, item.init.replace('?', item.path || ''), item.element);
				}

				// Because plugin initialization takes 1 tick
				setTimeout(function() {
					current_element = null;
					next();
				}, 2);

			}, item.cache == null ? MD.importcache : item.cache);

		}, function() {
			C.importing--;
			clear(T_VALID, T_DIRTY, 'find');
			compile();
		});
	}

	function remove(el) {
		var dom = el[0];
		dom.$com = dom.uicomponent = null;
		el.attr(ATTRDEL, true);
		el.remove();
	}

	function cacherest(method, url, params, value, expire) {

		if (params) {

			var ishtml = url.indexOf('.html') !== -1;
			var k = MD.versionkey;

			if (!params[k]) {
				if (MD.version)
					params[k] = MD.version;
				else if (MD.versionhtml && ishtml)
					params[k] = MD.versionhtml;
			}

			k = MD.languagekey;
			if (!params[k]) {
				if (MD.language)
					params[k] = MD.language;
				else if (MD.languagehtml && ishtml)
					params[k] = MD.languagehtml;
			}
		}

		params = STRINGIFY(params);
		var key = HASH(method + '#' + url.replace(/\//g, '') + params) + '';
		return cachestorage(key, value, expire);
	}

	function cachestorage(key, value, expire) {

		var now = Date.now();

		if (value !== undefined) {

			if (expire === 'session') {
				cache['$session' + key] = value;
				return value;
			}

			if (typeof(expire) === TYPE_S)
				expire = expire.parseExpire();

			if (expire) {
				storage[key] = { expire: now + expire, value: value };
				save();
			}

			return value;
		}

		var item = cache['$session' + key];
		if (item !== undefined)
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

		var ishtml = url.indexOf('.html') !== -1;

		if (MD.version)
			builder.push(MD.versionkey + '=' + en(MD.version));
		else if (MD.versionhtml && ishtml)
			builder.push(MD.versionkey + '=' + en(MD.versionhtml));

		if (MD.language)
			builder.push(MD.languagekey + '=' + en(MD.language));
		else if (MD.languagehtml && ishtml)
			builder.push(MD.languagekey + '=' + en(MD.languagehtml));

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
		var dom = el[0];
		var type = dom.tagName;
		obj.released && obj.released(HIDDEN(dom));
		DEF.monitor && monitor_method('components', 1);
		M.components.push(obj);
		C.init.push(obj);
		type !== T_BODY && REGCOM.test(el[0].innerHTML) && compile(el);
		obj.$initialized = true;
		ready();
	}

	function initialize() {
		var item = C.init.pop();
		if (item === undefined) {
			!C.ready && compile();
		} else {
			!item.$removed && prepare(item);
			initialize();
		}
	}

	function prepare(obj) {

		if (!obj)
			return;

		var el = obj.element;

		if (extensions[obj.name]) {
			var ext = extensions[obj.name];
			for (var i = 0; i < ext.length; i++) {
				var item = ext[i];
				item.config && obj.reconfigure(item.config, NOOP);
				item.fn.call(obj, obj, obj.config, MD.prefixcsscomponents + obj.name);
			}
		}

		var value = obj.get();
		var tmp;

		obj.configure && obj.reconfigure(obj.config, undefined, true);

		// Inits datasource after config is loaded
		if (obj.$confds) {
			obj.$confds();
			delete obj.$confds;
		}

		obj.$loaded = true;

		if (obj.setter || (obj.dom && obj.dom.setter)) {
			if (!obj.$prepared) {

				obj.$prepared = true;
				obj.$ready = true;

				tmp = attrcom(obj, T_VALUE);

				if (tmp) {
					if (!defaults[tmp])
						defaults[tmp] = new Function('return ' + tmp);
					obj.$default = defaults[tmp];
					if (value === undefined && obj.path) {
						value = obj.$default();
						set(obj.path, value, null, 1);
						emitwatch(obj.path, value, 0);
					}
				}

				if (!obj.$binded) {
					obj.$binded = true;
					try {
						obj.setterX(value, obj.path, 0);
					} catch (e) {
						THROWERR(e);
					}
				}
			}
		} else
			obj.$binded = true;

		if (obj.validate)
			obj.config.invalid = !obj.validate(obj.get(), true);

		obj.done && setTimeout(obj.done, 20);
		obj.stateX(0, 3);

		obj.$init && setTimeout(function() {
			var fn = get(obj.makepath(obj.$init));
			typeof(fn) === TYPE_FN && fn.call(obj, obj);
			obj.$init = undefined;
		}, 5);

		var n = 'component';
		el.trigger(n);
		el.off(n);

		var cls = attrcom(el, T_CLASS);
		cls && (function(cls) {
			setTimeout(function() {
				cls = cls.split(' ');
				var tmp = el[0].$jclass || {};
				for (var i = 0; i < cls.length; i++) {
					if (!tmp[cls[i]]) {
						el.tclass(cls[i]);
						tmp[cls[i]] = true;
					}
				}
				el[0].$jclass = tmp;
			}, 5);
		})(cls);

		obj.id && EMIT('#' + obj.id, obj);

		var e = '@' + obj.name;
		events[e] && EMIT(e, obj);
		events[n] && EMIT(n, obj);

		clear('find.');

		if (obj.$lazy) {
			obj.$lazy.state = 3;
			delete obj.$lazy;
			events.lazy && EMIT('lazy', obj.$name, false);
		}
	}

	function async(arr, fn, done) {
		var item = arr.shift();
		if (item == null)
			return done && done();
		fn(item, () => async(arr, fn, done));
	}

	function nextpending() {

		var next = C.pending.shift();
		if (next) {
			next();
		} else if ($domready) {

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
				var pending = waitfordownload.splice(0);
				var cache = {};
				fallbackpending.splice(0).wait(function(item, next) {
					cache[item] = 1;
					if (M.$components[item]) {
						next();
					} else {
						warn('Downloading: ' + item);
						IMPORTCACHE(MD.fallback.format(item), MD.fallbackcache, next);
					}
				}, function() {
					for (var el of pending) {
						if (cache[el.$componentname]) {
							if (el.$compilecomponent) {
								el.$compilecomponent();
								delete el.$compilecomponent;
								delete el.$componentname;
							}
						} else
							waitfordownload.push(el);
					}
				}, 3);
			}, 100);
		}
	}

	function emitwatch(path, value, type) {

		DEF.monitor && monitor_method('watchers');

		for (var i = 0; i < watches.length; i++) {

			var self = watches[i];

			if (self.$pathfixed) {
				if (self.path === path || (path.length < self.path.length && self.path.substring(0, path.length) === path)) {
					self.scope && (current_scope = self.scope);
					self.fn.call(self.context, path, self.format ? self.format(value, path, type) : value, type);
				}
				continue;
			}

			if (self.path === '*') {
				self.scope && (current_scope = self.scope);
				self.fn.call(self.context, path, self.format ? self.format(value, path, type) : value, type);
			} else if (path.length > self.path.length) {
				var index = path.lastIndexOf('.', self.path.length);
				if (index === -1 ? false : self.path === path.substring(0, index)) {
					self.scope && (current_scope = self.scope);
					var val = GET(self.path);
					self.fn.call(self.context, self.alias ? (self.alias.type + path.substring(self.alias.length)) : path, self.format ? self.format(val, path, type) : val, type);
				}
			} else {
				for (var j = 0; j < self.$path.length; j++) {
					if (self.$path[j] === path) {
						var val = GET(self.path);
						self.scope && (current_scope = self.scope);
						self.fn.call(self.context, self.alias ? (self.alias.type + path.substring(self.alias.length)) : path, self.format ? self.format(val, path, type) : val, type);
						break;
					}
				}
			}
		}
	}

	function ready() {

		setTimeout2('$ready', function() {

			refresh();
			initialize();

			var count = M.components.length;
			$(D).trigger('components', [count]);

			if (!$loaded) {
				$loaded = true;
				clear(T_VALID, T_DIRTY, 'find');
				events.init && EMIT('init');
				events.ready && EMIT('ready');
			}

			setTimeout2('$initcleaner', function() {
				cleaner();
				var arr = autofill.splice(0);
				for (var i = 0; i < arr.length; i++) {
					var com = arr[i];
					!com.$default && findcontrol(com.dom, function(el) {
						var val = $(el).val();
						if (val) {
							var tmp = com.parser(val);
							if (tmp) {
								com.config.touched = true;
								com.set(tmp, 0);
							}
						}
						return true;
					});
				}
			}, 1000);

			C.is = false;

			if (C.recompile) {
				C.recompile = false;
				compile();
			}

			if (C.ready) {
				var arr = C.ready;
				for (var i = 0; i < arr.length; i++)
					arr[i](count);
				C.ready = undefined;
				compile();
				setTimeout(nextpending, 500);
				setTimeout(nextpending, 1800);
				setTimeout(compile, 3000);
			}
		}, 100);
	}

	function removescripts(str) {
		return str.replace(REGSCRIPT, function(text) {
			var index = text.indexOf('>');
			var scr = text.substring(0, index + 1);
			return scr.substring(0, 6) === '<style' || (scr.substring(0, 7) === ('<' + T_SCRIPT) && scr.indexOf('type="') === -1) || scr.indexOf('/javascript"') !== -1 ? '' : text;
		});
	}

	function importscripts(str) {

		var beg = -1;
		var output = str;
		var external = [];
		var scr;

		while (true) {

			beg = str.indexOf('<' + T_SCRIPT, beg);
			if (beg === -1)
				break;
			var end = str.indexOf('</script>', beg + 8);
			var code = str.substring(beg, end + 9);
			beg = end + 9;
			end = code.indexOf('>');
			scr = code.substring(0, end);

			if (scr.indexOf('type=') !== -1 && scr.lastIndexOf('java' + T_SCRIPT) === -1)
				continue;

			var tmp = code.substring(end + 1, code.length - 9).trim();
			if (!tmp) {
				output = output.replace(code, '').trim();
				var eid = 'external' + HASH(code);
				if (!statics[eid]) {
					external.push(code);
					statics[eid] = true;
				}
			}
		}

		external.length && $('head').append(external.join('\n'));
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

	function remap(path, value, callback) {

		var cl;

		if (path.indexOf(' #') !== -1) {
			var tmp = makecl(path);
			cl = tmp.cl;
			path = tmp.path;
		}

		var index = path.replace('-->', '->').indexOf('->');
		if (index !== -1) {
			value = get(path.substring(0, index).trim(), value);
			path = path.substring(index + 3).trim();
		}

		CL(cl, function() {
			if (callback)
				callback(path, value);
			else
				M.set(path, value);
		});
	}

	function set(path, value, is, settype) {

		if (!path)
			return;

		var key = '+' + path;

		if (paths[key])
			return paths[key](MD.scope, value, path, binders, binderbind, is, settype);

		if (!path || path.indexOf('?') !== -1)
			return;

		var arr = parsepath(path);
		var builder = [];
		var binder = [];

		for (var i = 0; i < arr.length - 1; i++) {
			var item = arr[i];
			var type = arr[i + 1] ? (REGISARR.test(arr[i + 1]) ? '[]' : '{}') : '{}';
			var p = 'w' + (item.charAt(0) === '[' ? '' : '.') + item;
			builder.push('if(typeof(' + p + ')!==\'object\'||' + p + '==null)' + p + '=' + type);
		}

		var v;

		for (var i = 0; i < arr.length - 1; i++) {
			v = arr[i].replace(/'/g, '"');
			binder.push('binders[\'' + v + '\']&&setTimeout(binderbind,1,\'' + v + '\',\'' + path + '\',$ticks,c)');
		}

		v = arr[arr.length - 1].replace(/'/g, '"');
		binder.push('binders[\'' + v + '\']&&setTimeout(binderbind,1,\'' + v + '\',\'' + path + '\',$ticks,c)');
		binder.push('binders[\'!' + v + '\']&&setTimeout(binderbind,1,\'!' + v + '\',\'' + path + '\',$ticks,c)');

		if (v.charAt(0) !== '[')
			v = '.' + v;

		var fn = (new Function('w', 'a', 'b', 'binders', 'binderbind', 'nobind', 'c', 'var $ticks=(Math.random()+\'\').substring(2,8);if(!nobind){' + builder.join(';') + ';var v=typeof(a)==\'function\'?a(MAIN.compiler.get(b)):a;w' + v + '=v}' + binder.join(';') + ';return a'));
		paths[key] = fn;
		fn(MD.scope, value, path, binders, binderbind, is, settype);
	}

	function set2(scope, path, value) {

		if (path == null)
			return;

		var key = '++' + path;

		if (paths[key])
			return paths[key](scope, value, path);

		var arr = parsepath(path);
		var builder = [];

		for (var i = 0; i < arr.length - 1; i++) {
			var item = arr[i];
			var type = arr[i + 1] ? (REGISARR.test(arr[i + 1]) ? '[]' : '{}') : '{}';
			var p = 'w' + (item.charAt(0) === '[' ? '' : '.') + item;
			builder.push('if(typeof(' + p + ')!==\'object\'||' + p + '==null)' + p + '=' + type);
		}

		var v = arr[arr.length - 1];

		if (v.charAt(0) !== '[')
			v = '.' + v;

		var fn = (new Function('w', 'a', 'b', builder.join(';') + ';w' + v + '=a;return a'));
		paths[key] = fn;
		fn(scope, value, path);
		return scope;
	}

	function makepluginpath(path) {

		var c = path.charAt(0);
		if (c === '*')
			path = path.replace(c, cleancommonpath());

		var index = path.indexOf('|');
		return index === -1 ? path : (path = 'PLUGINS["' + path.substring(0, index) + '"].' + path.substring(index + 1));
	}

	function get(path, scope) {

		if (path == null)
			return;

		var code = path.charCodeAt(0);
		if (code === 37) // %
			path = T_TMP + path.substring(1);
		else if (code === 35) // #
			path = MD.pathcl + path.substring(1);
		else if (code === 42) // *
			path = MD.pathcommon + path.substring(1);

		var key = '=' + path;
		if (paths[key])
			return paths[key](scope || MD.scope);

		if (path.indexOf('?') !== -1)
			return;

		var arr = parsepath(path);
		var builder = [];

		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			if (item.charAt(0) !== '[')
				item = '.' + item;
			builder.push('if(!w' + item + ')return w' + item);
		}

		var v = arr[arr.length - 1];
		if (v.charAt(0) !== '[')
			v = '.' + v;

		var fn = (new Function('w', builder.join(';') + ';return w' + v));
		paths[key] = fn;
		return fn(scope || MD.scope);
	}

	function parsepath(path) {

		var cache = [];

		// Clear more complex paths
		path = path.replace(/\[.*?\]/g, text => '#' + (cache.push(text) - 1));

		var arr = path.split('.');
		var builder = [];
		var all = [];

		for (var p of arr) {

			p = p.replace(/#\d+/g, text => cache[+text.substring(1)]);

			var index = p.indexOf('[');
			if (index === -1) {
				all.push(p);
				builder.push(all.join('.'));
			} else {
				all.push(p.substring(0, index));
				builder.push(all.join('.'));
				all.splice(all.length - 1);
				all.push(p);
				builder.push(all.join('.'));
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

		for (var key in cache) {
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

	function inDOM(el) {
		if (!el)
			return;
		if (el.tagName === T_BODY)
			return true;
		var parent = el.parentNode;
		while (parent) {
			if (parent.tagName === T_BODY)
				return true;
			parent = parent.parentNode;
		}
	}

	function cleaner() {

		DEF.monitor && monitor_method('compilation', 2);

		var is = false;
		var index;
		var arr;

		for (var key in events) {
			index = 0;
			arr = events[key];
			while (true) {

				var item = arr[index++];
				if (item === undefined)
					break;

				if (item.context == null || (item.context.element && inDOM(item.context.element[0])))
					continue;

				item.context && item.context.element && item.context.element.remove();
				item.context.$removed = true;
				item.context = null;
				arr.splice(index - 1, 1);

				if (!arr.length)
					delete events[key];

				DEF.monitor && monitor_method('events', 2);

				index -= 2;
				is = true;
			}
		}

		index = 0;
		while (true) {
			var item = watches[index++];
			if (item === undefined)
				break;
			if (item.context == null || (item.context.element && inDOM(item.context.element[0])))
				continue;
			item.context && item.context.element && item.context.element.remove();
			item.context.$removed = true;
			item.context = null;
			watches.splice(index - 1, 1);
			DEF.monitor && monitor_method('watchers', 2);
			index -= 2;
			is = true;
		}

		index = 0;
		while (true) {
			var item = M.scrollbars[index++];
			if (item === undefined)
				break;
			if (inDOM(item.element[0]))
				continue;
			item.destroy();
			index -= 2;
			is = true;
		}

		var all = M.components;
		var length = all.length;
		index = 0;

		while (index < length) {

			var component = all[index++];

			if (!component) {
				index--;
				all.splice(index, 1);
				length = all.length;
				continue;
			}

			var c = component.element;
			if (!component.$removed && c && inDOM(c[0])) {
				if (!component.attr(ATTRDEL)) {
					if (component.$parser && !component.$parser.length)
						component.$parser = undefined;
					if (component.$formatter && !component.$formatter.length)
						component.$formatter = undefined;
					continue;
				}
			}

			events.destroy && EMIT('destroy', component.name, component);
			var e = 'component.destroy';
			events[e] && EMIT(e, component.name, component);

			delete statics['$ST_' + component.name];
			component.destroy && component.destroy();
			$('#css' + component.ID).remove();

			if (c[0].tagName !== T_BODY) {
				c.off();
				c.find('*').off();
				c.remove();
			}

			if (M.paths[component.path])
				M.paths[component.path]--;

			removewaiter(component);

			if (component.dom.$binderconfig) {
				clearTimeout(component.dom.$binderconfig);
				component.dom.$binderconfig = null;
			}

			component.$assigned && SET(component.$assigned, null);
			component.$assigned = null;
			component.$main = undefined;
			component.$data = null;
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
			DEF.monitor && monitor_method('components', 2);
		}

		for (var key in binders) {
			arr = binders[key];
			var j = 0;
			while (true) {
				var o = arr[j++];
				if (!o)
					break;
				if (o.el && inDOM(o.el[0]))
					continue;
				index = M.binders.indexOf(o);
				if (index !== -1)
					M.binders.splice(index, 1);
				var e = o.el;
				if (e && !e[0].$br) {
					if (o.$macros) {
						for (var m of o.$macros) {
							if (m.destroy)
								m.destroy();
						}
					}
					e.off();
					e.find('*').off();
					e[0].$br = 1;
				}
				j--;
				arr.splice(j, 1);
			}
			if (!arr.length) {
				if (M.paths[key])
					M.paths[key]--;
				delete binders[key];
			}
			DEF.monitor && monitor('binders', 2);
		}

		clear('find');

		// Checks PLUGINS
		var R = W.PLUGINS;

		for (var k in R) {
			var a = R[k];
			if (a.$remove && !a.element || !inDOM(a.element[0]) || !a.element[0].innerHTML) {
				a.$remove();
				delete R[k];
				DEF.monitor && monitor('plugins', 2);
			}
		}

		SET('NOW', new Date());
		var now = W.NOW.getTime();
		var is2 = false;
		var is3 = false;

		for (var key in blocked) {
			if (blocked[key] <= now) {
				delete blocked[key];
				is2 = true;
			}
		}

		is2 && !W.isPRIVATEMODE && LS.setItem(MD.localstorage + '.blocked', STRINGIFY(blocked));

		for (var key in storage) {
			var item = storage[key];
			if (!item.expire || item.expire <= now) {
				delete storage[key];
				is3 = true;
			}
		}

		is3 && save();

		if (is) {
			refresh();
			setTimeout(compile, 2000);
		}
	}

	function save() {
		!W.isPRIVATEMODE && LS.setItem(MD.localstorage + '.cache', STRINGIFY(storage));
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
		arr && arr.length && setTimeout(function(arr) {
			for (var m of arr)
				m.stateX(type, what);
		}, 2, arr);
	}

	// ===============================================================
	// SCOPE
	// ===============================================================

	function Scope(path) {
		this.path = path;
	}

	var SCP = Scope.prototype;

	SCP.$formatnoop = function(value) {
		return value;
	};

	SCP.apply = function() {
		var self = this;
		current_scope = self.path;
		return self;
	};

	SCP.$format = function(endpoint) {
		var plugin = W.PLUGINS[this.path];
		if (plugin && plugin[endpoint]) {
			DEF.monitor && monitor_method('plugins');
			return plugin[endpoint];
		}
		return SCP.$formatnoop;
	};

	SCP.makepath = function(val) {
		var t = this;
		val = val.replace(/\?\d+/g, function(text) {
			var skip = +text.substring(1);
			var parent = t.parent;
			for (var i = 1; i < skip; i++) {
				if (parent)
					parent = parent.parent;
			}
			return parent ? parent.path : t.path;
		}).replace(REGSCOPEINLINE, t.path);
		return makepluginpath(val);
	};

	SCP.unwatch = function(path, fn) {
		var self = this;
		OFF(SCOPENAME + self._id + '#watch', makescopepath(self, path), fn);
		return self;
	};

	SCP.watch = function(path, fn, init) {
		var self = this;
		ON(SCOPENAME + self._id + '#watch', makescopepath(self, path), fn, init, self);
		return self;
	};

	SCP.reset = function(path, timeout) {
		if (path > 0) {
			timeout = path;
			path = '';
		}
		return RESET(makescopepath(this, path), timeout);
	};

	SCP.default = function(path, timeout) {
		if (path > 0) {
			timeout = path;
			path = '';
		}
		return DEFAULT(makescopepath(this, path), timeout);
	};

	function makescopepath(scope, path) {
		return !path || path.indexOf('?') === -1 ? (scope.path + (path ? '.' + path : '')) : scope.makepath(path);
	}

	SCP.set = function(path, value, timeout, reset) {
		return SET(makescopepath(this, path), value, timeout, reset);
	};

	SCP.push = function(path, value, timeout, reset) {
		return PUSH(makescopepath(this, path), value, timeout, reset);
	};

	SCP.update = function(path, timeout, reset) {
		return UPDATE(makescopepath(this, path), timeout, reset);
	};

	SCP.change = function(path) {
		return CHANGE(makescopepath(this, path), true);
	};

	SCP.get = function(path) {
		return GET(makescopepath(this, path));
	};

	SCP.can = function(except) {
		return CAN(this.path, except);
	};

	SCP.errors = function(except, highlight) {
		return ERRORS(this.path, except, highlight);
	};

	SCP.remove = function() {
		var self = this;
		var arr = M.components;

		for (var i = 0; i < arr.length; i++) {
			var a = arr[i];
			a.scope && a.scope.path === self.path && a.remove(true);
		}

		OFF(SCOPENAME + self._id + '#watch');
		var e = self.element;
		e.find('*').off();
		e.off();
		e.remove();
		setTimeout2('$cleaner', cleaner2, 100);
	};

	SCP.FIND = function(selector, many, callback, timeout) {
		return this.element.FIND(selector, many, callback, timeout);
	};

	SCP.SETTER = function(a, b, c, d, e, f, g) {
		return this.element.SETTER(a, b, c, d, e, f, g);
	};

	SCP.RECONFIGURE = function(selector, name) {
		return this.element.RECONFIGURE(selector, name);
	};

	// ===============================================================
	// MACRO DECLARATION
	// ===============================================================

	function Macro(name, binder) {
		var t = this;
		t.name = name;
		t.binder = binder;
		t.element = binder.el;
		t.dom = binder.el[0];
		t.path = binder.path;
		var macro = M.macros[name];
		macro(t, binder.el, MD.prefixcssmacros + name);
		t.make && t.make();
		if (t.binder.scope)
			t.scope = t.element.scope();
	}

	// ===============================================================
	// COMPONENT DECLARATION
	// ===============================================================

	function COM(name) {

		var self = this;
		self._id = self.ID = ATTRDATA + (C.counter++);
		self.$parser = [];
		self.$formatter = [];
		self.$configwatcher = {};
		self.$configchanges = {};

		// self.$skip = false;
		// self.$ready = false;
		// self.$initialized = false;
		// self.$path;

		self.trim = true;
		self.$data = {};

		var version = name.lastIndexOf('@');

		self.name = name;
		self.$name = version === -1 ? name : name.substring(0, version);
		self.version = version === -1 ? '' : name.substring(version + 1);
		self.removed = false;

		// self.path;
		// self.type;
		// self.id;

		// self.make;
		// self.done;
		// self.prerender;
		// self.destroy;
		// self.state;
		// self.validate;
	}

	function monitor(obj) {

		var p = M.performance;
		var o;

		var t = Date.now();

		if (obj.name) {
			o = p.components;
			p.changes.components = 1;
		} else {
			o = p.binders;
			p.changes.binders = 1;
		}

		if (o.peak)
			o.peak++;
		else
			o.peak = 1;

		o = obj.$usage;

		if (!o)
			o = obj.$usage = { count: 0 };

		var t = Date.now();
		if (o.time)
			o.diff = t - o.time;

		o.count++;
		o.time = t;
	}

	function monitor_method(name, type) {

		var p = M.performance[name];

		switch (type) {
			case 1:
				p.add = p.add ? (p.add + 1) : 1;
				break;
			case 2:
				p.rem = p.rem ? (p.rem + 1) : 1;
				break;
			default:
				p.peak = p.peak ? (p.peak + 1) : 1;
				p.count = p.count ? (p.count + 1) : 1;
				break;
		}

		var t = Date.now();

		if (p.time)
			p.diff = t - p.time;

		p.time = t;
		M.performance.changes[name] = 1;
	}

	var PPC = COM.prototype;
	var MPC = Macro.prototype;

	MPC.set = function(value) {
		return SET(this.binder.path, value);
	};

	MPC.get = function() {
		return GET(this.binder.path);
	};

	MPC.refresh = function() {
		this.binder.refresh();
		return this;
	};

	function setterXbinder(self) {

		var cache = self.$bindcache;
		cache.bt = 0; // reset timer id

		if (self.$bindchanges) {
			var hash = HASH(cache.value);
			if (hash === self.$valuehash)
				return;
			self.$valuehash = hash;
		}

		MD.monitor && monitor(self);
		self.config.$setter && EXEC.call(self, self.config.$setter.SCOPE(self), cache.value, cache.path, cache.type);
		self.data && self.data('', cache.value);

		if (!self.$skipsetter) {
			self.setter(cache.value, cache.path, cache.type);
			self.dom.setter && self.dom.setter(cache.value, cache.path, cache.type);
		}

		if (self.$skipsetter)
			self.$skipsetter = false;

		self.setter2 && self.setter2(cache.value, cache.path, cache.type);
	}

	function setterXvisibility(self) {
		self.setterX(self.$bindcache.value, self.$bindcache.path, self.$bindcache.type);
	}

	PPC.setterX = function(value, path, type) {

		var self = this;

		if ((!self.setter && !self.dom.setter) || (self.$bindexact && self.path !== path && self.path.indexOf(path + '.') === -1 && type))
			return;

		var cache = self.$bindcache;
		if (arguments.length) {

			if (self.$format)
				value = self.$format(value, path, type, self.scope);

			if (self.$bindvisible) {

				if (cache.check) {
					clearTimeout(cache.check);
					cache.check = null;
				}

				if (HIDDEN(self.dom)) {
					cache.value = value;
					cache.path = path;
					cache.type = type;
					cache.bt && clearTimeout(cache.bt);
					cache.is = true;
					cache.check = setTimeout(setterXvisibility, 500, self);
				} else {
					cache.value = value;
					cache.path = path;
					cache.type = type;
					if (!cache.bt) {
						if (cache.is)
							self.setterX();
						else
							setterXbinder(self);
					}
				}
			} else {

				if (self.$bindchanges) {
					var hash = HASH(value);
					if (hash === self.$valuehash)
						return;
					self.$valuehash = hash;
				}

				MD.monitor && monitor(self);

				// Binds value directly
				self.config.$setter && EXEC.call(self, self.config.$setter.SCOPE(self), value, path, type);
				self.data && self.data('', value);

				if (!self.$skipsetter) {
					self.setter && self.setter(value, path, type);
					self.dom.setter && self.dom.setter(value, path, type);
				}

				if (self.$skipsetter)
					self.$skipsetter = false;

				self.setter2 && self.setter2(value, path, type);
			}

		} else if (!HIDDEN(self.dom) && cache && cache.is) {
			cache.is = false;
			cache.bt && clearTimeout(cache.bt);
			cache.bt = setTimeout(setterXbinder, self.$bindtimeout, self);
		}
	};

	PPC.stateX = function(type, what) {

		var self = this;
		var key = type + 'x' + what;
		var config = self.config;

		if (!self.$bindchanges || self.$statekey !== key) {
			self.$statekey = key;
			config.$state && EXEC.call(self, config.$state.SCOPE(self), type, what);
			self.state && self.state(type, what);
			self.dom.state && self.dom.state(config);
			self.state2 && self.state2(type, what);
		}

		if (!self.$stateprev)
			self.$stateprev = { modified: false, touched: false, invalid: false };

		var tmp = self.$stateprev;
		var update = [];

		if (tmp.modified != config.modified)
			update.push('modified');

		if (tmp.touched != config.touched)
			update.push('touched');

		if (tmp.invalid != config.invalid)
			update.push('invalid');

		var clsl = self.dom.classList;

		clsl.toggle('ui-modified', config.modified == true);
		clsl.toggle('ui-touched', config.touched == true);
		clsl.toggle('ui-disabled', config.disabled == true);
		clsl.toggle('ui-invalid', config.invalid == true);

		if (update.length) {
			for (var key of update) {
				if (self.configure)
					self.configure(key, config[key], false, tmp[key]);
				if (self.dom.configure)
					self.dom.configure(key, config[key], false, tmp[key]);
				tmp[key] = config[key];
			}
		}

	};

	PPC.getter = function(value, realtime, nobind) {

		var self = this;
		value = self.parser(value);
		self.getter2 && self.getter2(value, realtime);

		// Binds a value
		if (nobind)
			com_validate2(self);
		else if (value !== self.get()) {
			if (realtime)
				self.$skip = true;

			self.config.touched = true;
			self.set(value, 2);

		} else if (realtime === 3) {
			// A validation for same values, "realtime=3" is in "blur" event
			// Because we need to validate the input if the user leaves from the control
			com_validate2(self);
		}
	};

	PPC.setter = function(value, path, type) {

		var self = this;

		if (type === 2) {
			if (self.$skip) {
				self.$skip = false;
				return;
			}
		}

		var a = 'select-one';

		value = self.formatter(value);

		findcontrol(self.dom, function(t) {

			if (t.$com !== self)
				t.$com = t.uicomponent = self;

			var path = t.$com.path;
			if (path && path.length && path !== self.path)
				return;

			if (t.type === 'checkbox') {
				var tmp = value != null ? (value + '').toLowerCase() : '';
				tmp = tmp === T_TRUE || tmp === '1' || tmp === 'on';
				tmp !== t.checked && (t.checked = tmp);
				return;
			}

			if (value == null)
				value = '';

			if (!type && self.$autofill && t.type !== a && t.type !== 'range' && !self.$default)
				autofill.push(t.$com);

			if (t.type === a || t.type === 'select') {
				var el = $(t);
				if (el.val() !== value)
					el.val(value);
			} else if (t.value !== value)
				t.value = value;

		});
	};

	PPC.parsesource = function(value) {

		var type = '';
		var self = this;

		if (self.type === TYPE_N || self.config.type === TYPE_N)
			type = TYPE_N;

		return value.parseSource(type);
	};

	PPC.modify = function(value, type) {
		var self = this;
		value = self.parser(value);
		self.config.touched = true;
		self.set(value, type == null ? 2 : type);
		return self;
	};

	PPC.CMD = function(name, a, b, c, d, e) {
		var self = this;
		events.cmd && EMIT('cmd', name, a, b, c, d, e);
		DEF.monitor && monitor_method('cmd');
		if (!self.$removed && self.$commands && self.$commands[name]) {
			var commands = self.$commands[name];
			for (var cmd of commands)
				cmd(a, b, c, d, e);
		}
		return self;
	};

	PPC.command = function(name, fn) {
		var t = this;

		if (!t.$commands)
			t.$commands = {};

		var first = false;

		if (name.charAt(0) === '^') {
			first = true;
			name = name.substring(1);
		}

		if (t.$commands[name]) {
			if (first)
				t.$commands[name].unshift(fn);
			else
				t.$commands[name].push(fn);
		} else
			t.$commands[name] = [fn];

		return t;
	};

	PPC.autofill = function(val) {
		var t = this;
		t.$autofill = val == null ? true : val == true;
		return t;
	};

	PPC.bind = function(flags, value) {

		var t = this;
		var validate = false;
		var setter = false;

		if (flags) {
			var arr = flags.split(/\s|,|\|/);
			for (var m of arr) {
				if (m.charAt(0) === '@')
					m = m.substring(1);
				switch (m) {
					case 'setter':
						setter = true;
						break;
					case 'validate':
						validate = true;
						break;
					case 'touched':
					case 'touch':
						t.config.touched = true;
						break;
					case 'modified':
					case 'changed':
					case 'modify':
					case 'change':
						t.config.modified = true;
						break;
					case 'reset':
						t.config.modified = false;
						t.config.touched = false;
						break;
				}
			}
		}

		validate && t.validate2();

		if (value === undefined) {
			t.stateX(0, 0);
			setter && t.setter(t.get(), t.path, 2);
			return;
		}

		if (!setter)
			t.$skipsetter = true;

		if (t.path && value !== undefined)
			M.set(t.path, value, 2);
	};

	PPC.import = function(url, callback, insert, preparator) {
		IMPORT(url, this.element, callback, insert, preparator);
		return this;
	};

	PPC.data = function(key, value) {

		if (!key)
			key = '@';

		var self = this;
		var data = self.$data[key];

		if (arguments.length === 1)
			return data ? data.value : null;

		if (data) {
			data.value = value;
			for (var i = 0; i < data.items.length; i++) {
				var o = data.items[i];
				var curr_scope = current_scope;
				o.el[0].parentNode && o.exec(value, key);
				current_scope = curr_scope;
			}
		} else
			self.$data[key] = { value: value, items: [] };

		if (self.$ppc) {
			var c = M.components;
			for (var i = 0; i < c.length; i++) {
				var com = c[i];
				if (com.owner === self && com.$pp && key === com.path) {
					try {
						com.setterX(value, value, 2);
					} catch (e) {
						THROWERR(e);
					}
				}
			}
		}

		return value;
	};

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

	function comparepath(path, updated) {

		if (updated.length > path.length) {
			for (var i = 0; i < path.length; i++) {
				var a = updated.charAt(i);
				var b = path.charAt(i);
				if (a !== b)
					return false;
			}

			var c = updated.charAt(i);
			return c === '.' || c === '[' || c === '';
		}

		return path === updated;
	}

	PPC.$compare = function(path) {
		var self = this;

		if (self.$pathfixed)
			return self.path === path || (path.length < self.path.length && self.path.substring(0, path.length) === path);

		if (path.length > self.path.length) {
			for (var i = 0; i < self.path.length; i++) {
				var a = path.charAt(i);
				var b = self.path.charAt(i);
				if (a !== b)
					return false;
			}

			var c = path.charAt(i);
			return c === '.' || c === '[' || c === '';
		}

		for (var i = 0; i < self.$path.length; i++) {
			if (self.$path[i] === path)
				return true;
		}
	};

	function removewaiter(obj) {
		if (obj.$W) {
			for (var key in obj.$W) {
				var v = obj.$W[key];
				v.id && clearInterval(v.id);
			}
			delete obj.$W;
		}
	}

	PPC.notmodified = function(fields) {
		var t = this;
		typeof(fields) === TYPE_S && (fields = [fields]);
		return NOTMODIFIED(t._id, t.get(), fields);
	};

	function waiter_worker(self, obj, prop) {
		if (!self.$removed) {
			var v = self[prop]();
			if (v) {
				clearInterval(obj.id);
				for (var i = 0; i < obj.callback.length; i++)
					obj.callback[i].call(self, v);
				delete self.$W[prop];
			}
		}
	}

	function waiter(self, obj, prop) {
		obj.id && clearInterval(obj.id);
		obj.id = setInterval(waiter_worker, MD.delaywatcher, self, obj, prop);
	}

	MPC.$waiter = PPC.$waiter = function(prop, callback) {

		var t = this;

		if (prop === true) {
			if (t.$W) {
				for (var k in t.$W) {
					var o = t.$W[k];
					waiter(t, o, k);
				}
			}
			return;
		} else if (prop === false) {
			if (t.$W) {
				for (var key in t.$W) {
					var a = t.$W[key];
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

		waiter(t, t.$W[prop], prop);
		return t;
	};

	MPC.hidden = PPC.hidden = function(callback) {
		var t = this;

		if (t.$removed) {
			callback = null;
			return 1;
		}

		var v = !HIDDEN(t.dom);
		if (callback) {
			if (v)
				callback.call(t);
			else
				t.$waiter(T_HIDDEN, callback);
		}
		return v;
	};

	MPC.visible = PPC.visible = function(callback) {
		var t = this;

		if (t.$removed) {
			callback = null;
			return 0;
		}

		var v = !HIDDEN(t.dom);
		if (callback) {
			if (v)
				callback.call(t);
			else
				t.$waiter('visible', callback);
		}
		return v;
	};

	MPC.width = PPC.width = function(callback) {
		var t = this;

		if (t.$removed) {
			callback = null;
			return 0;
		}

		var v = t.element ? t.dom.offsetWidth : 0;
		if (callback) {
			if (v)
				callback.call(t, v);
			else
				t.$waiter(T_WIDTH, callback);
		}
		return v;
	};

	MPC.height = PPC.height = function(callback) {
		var t = this;

		if (t.$removed) {
			callback = null;
			return 0;
		}

		var v = t.element ? t.dom.offsetHeight : 0;
		if (callback) {
			if (v)
				callback.call(t, v);
			else
				t.$waiter(T_HEIGHT, callback);
		}
		return v;
	};

	// Backward compatibility
	PPC.release = function(value) {
		var self = this;
		return value === undefined || self.$removed ? HIDDEN(self.dom) : value;
	};

	PPC.validate2 = function() {
		return com_validate2(this);
	};

	PPC.exec = function(name, a, b, c, d, e) {

		var self = this;
		var cl;

		if (name.indexOf(' #') !== -1) {
			var tmp = makecl(name);
			cl = tmp.cl;
			name = tmp.path;
		}

		name = makeandexecflags(name);

		CL(cl, function() {
			var childs = self.find(ATTRCOM);
			for (var i = 0; i < childs.length; i++) {
				var t = childs[i];
				if (t.$com) {
					MD.monitor && monitor(self);
					t.$com.caller = self;
					t.$com[name] && t.$com[name](a, b, c, d, e);
				}
			}
		});

		return self;
	};

	PPC.replace = function(el, remove) {
		var self = this;

		if (C.is)
			C.recompile = true;

		var n = SCOPENAME;
		var prev = self.element;
		var scope = prev.attrd(n);

		if (!scope) {
			n = PLUGINNAME;
			scope = prev.attrd(n);
		}

		if (!scope)
			scope = prev.attr(n);

		var data = prev[0].$scopedata;

		prev.rattrd(ATTRDATA, '-', T_, T_COM);
		prev[0].$com = prev[0].uicomponent = prev[0].$scopedata = null;

		scope && self.element.rattrd(n);

		if (remove)
			prev.off().remove();
		else
			self.attrd('jc-replaced', T_TRUE);

		self.element = $(el);

		if (scope) {
			if (self.element[0].tagName.substring(0, 3) === 'UI-')
				self.element.attr(n, scope);
			else
				self.element.attrd(n, scope);
		}

		self.dom = self.element[0];
		self.dom.$com = self.dom.uicomponent = self;

		if (data) {
			self.dom.$scopedata = data;
			data.element = self.element;
			var ctx = PLUGINS[data.path];
			if (ctx)
				ctx.element = self.element;
		}

		self.siblings = false;
		return self;
	};

	PPC.compile = function(container) {
		var self = this;
		!container && self.attrd(T_COMPILED) && self.attrd(T_COMPILED, '1');
		compile(container || self.element);
		return self;
	};

	PPC.notify = function() {
		NOTIFY(this.path);
		return this;
	};

	PPC.update = function(type) {
		var self = this;
		self.$binded && self.set(self.get(), type);
		return self;
	};

	PPC.refresh = function(notify, type) {
		var self = this;
		if (self.$binded) {

			if (typeof(notify) === TYPE_S) {
				type = notify;
				notify = true;
			}

			if (notify)
				self.set(self.get(), type);
			else
				self.setter && self.setterX(self.get(), self.path, 1);
		}
		return self;
	};

	MPC.tclass = PPC.tclass = function(cls, v) {
		var self = this;
		self.element.tclass(cls, v);
		return self;
	};

	MPC.aclass = PPC.aclass = function(cls, timeout) {
		var self = this;
		if (timeout)
			setTimeout(function() { self.element.aclass(cls); }, timeout);
		else
			self.element.aclass(cls);
		return self;
	};

	MPC.hclass = PPC.hclass = function(cls) {
		return this.element.hclass(cls);
	};

	MPC.rclass = PPC.rclass = function(cls, timeout) {
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

	MPC.rclass2 = PPC.rclass2 = function(search) {
		this.element.rclass2(search);
		return this;
	};

	MPC.EXEC = function(path, a, b, c, d) {
		var self = this;
		var p = self.scope ? self.scope.makepath(path) : path;
		if (p.charAt(0) === '@') {
			p = p.substring(1);
			var com = self.parent().component();
			if (com && com[p])
				com[p](a, b, c, d);
			else if (debug)
				WARN(ERREXEC.format(path));
		} else
			EXEC(p, a, b, c, d);
		return self;
	};

	MPC.SEEX = function(path, a, b, c, d) {

		var self = this;
		var p = self.scope ? self.scope.makepath(path) : path;

		if (p.charAt(0) === '@') {
			p = p.substring(1);
			var com = self.parent().component();
			if (com) {
				if (typeof(com[p]) === TYPE_FN)
					com[p](a, b, c, d);
				else
					com[p] = a;
			}
		} else
			SEEX(p, a, b, c, d);

		return self;
	};

	PPC.GET = function(path) {
		return GET(this.makepath(path));
	};

	PPC.SET = function(path, value) {
		return SET(this.makepath(path), value);
	};

	PPC.EXEC = function(path, a, b, c, d) {

		var self = this;
		var p = self.makepath(path);

		if (p.charAt(0) === '@') {
			p = p.substring(1);
			var com = self.parent().component();
			if (com && com[p])
				com[p](a, b, c, d);
			else if (debug)
				WARN(ERREXEC.format(path));
		} else
			EXEC(p, a, b, c, d);

		return self;
	};

	PPC.SEEX = function(path, a, b, c, d) {

		var self = this;
		var p = self.makepath(path);

		if (p.charAt(0) === '@') {
			p = p.substring(1);
			var com = self.parent().component();
			if (com) {
				if (typeof(com[p]) === TYPE_FN)
					com[p](a, b, c, d);
				else
					com[p] = a;
			} else if (debug)
				WARN(ERREXEC.format(path));
		} else
			SEEX(p, a, b, c, d);

		return self;
	};

	PPC.noplugin = PPC.noscope = function(value) {
		var self = this;
		self.$noscope = value === undefined ? true : value === true;
		return self;
	};

	PPC.nocompile = function() {
		var self = this;
		self.element.attrd(T_COMPILED, '0');
		return self;
	};

	PPC.singleton = function() {
		var self = this;
		statics['$ST_' + self.name] = true;
		return self;
	};

	PPC.blind = function() {
		var self = this;
		self.path = null;
		self.$path = null;
		self.$$path = null;
		return self;
	};

	PPC.bindchanges = function(enable) {
		this.$bindchanges = enable == null || enable === true;
		return this;
	};

	PPC.bindexact = function(enable) {
		this.$bindexact = enable == null || enable === true;
		return this;
	};

	PPC.bindvisible = function(timeout) {
		var self = this;
		if (timeout === false) {
			self.$bindvisible = false;
			self.$bindcache = null;
		} else {
			self.$bindvisible = true;
			self.$bindtimeout = timeout || MD.delaybinder;
			self.$bindcache = {};
		}
		return self;
	};

	PPC.readonly = function() {
		var self = this;
		self.validate = null;
		self.getter = null;
		self.setter = null;
		return self;
	};

	MPC.faicon = PPC.faicon = PPC.icon = function(value) {
		return value ? ((value.indexOf(' ') === -1 ? MD.iconprefix : '') + value) : '';
	};

	PPC.novalidate = PPC.noValid = PPC.noValidate = function() {
		// @TODO: remove
		return self;
	};

	PPC.nodirty = PPC.noDirty = function() {
		// @TODO: remove
		return self;
	};

	PPC.datasource = function(path, callback, init) {
		var self = this;
		var ds = self.$datasource;

		ds && self.unwatch(ds.path, ds.fn);

		if (path) {
			path = self.makepath(path);
			self.$datasource = { path: path, fn: callback };

			if (init !== false && !self.$loaded) {
				self.watch(path, callback);
				self.$confds = function() {
					callback.call(self, path, get(path), 0);
				};
			} else
				self.watch(path, callback, init !== false);

		} else
			self.$datasource = null;

		return self;
	};

	PPC.makepath = function(path) {

		var self = this;

		if (path.indexOf('?') !== -1) {
			var scope = self.pathscope ? self.scope : self.$scopepath;
			if (self.$scopepath === undefined)
				scope = self.$scopepath = self.element.scope() || null;
			if (scope)
				path = scope.makepath(path);
		}

		return makepluginpath(path);
	};

	PPC.scopepath = function(path) {
		var self = this;

		if (path.indexOf('?') === -1)
			return path;

		if (self.$scopepath === undefined)
			self.$scopepath = self.element.scope() || null;

		return self.$scopepath ? self.$scopepath.makepath(path) : path;
	};

	PPC.setPath = function(path, type) {

		// type 1: init
		// type 2: scope

		var self = this;
		var tmp = findformat(path);

		if (tmp) {
			path = tmp.path;
			self.$format = tmp.fn;
			if (tmp.scope)
				self.$format.scope = true;

		} else if (!type)
			self.$format = null;

		var arr = [];

		if (path.charAt(0) === '@') {
			path = path.substring(1);
			self.$pp = true;
			self.owner.$ppc = true;
		} else
			self.$pp = false;

		path = path.env();

		// Temporary
		if (path.charCodeAt(0) === 37)
			path = T_TMP + path.substring(1);

		// data-bind value (current element or parent -> parent -> parent)
		if (path === '.') {
			self.path = '';
			self.$path = EMPTYARRAY;
			return;
		}

		// !path = fixed path
		if (path.charCodeAt(0) === 33) {
			self.$pathfixed = true;
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
			self.$pathfixed = false;
		}

		self.path = path;
		self.$path = arr;
		type !== 1 && C.ready && refresh();

		if (path.indexOf('?') === -1) {
			if (M.paths[path])
				M.paths[path]++;
			else
				M.paths[path] = 1;
		}

		return self;
	};

	MPC.attr = PPC.attr = SCP.attr = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.attr(name);
		el.attr(name, value);
		return this;
	};

	var autofocus = function(el, selector, counter) {
		if (!isMOBILE) {
			if (typeof(counter) !== TYPE_N)
				counter = 0;
			var target = el.find(typeof(selector) === TYPE_S ? selector : 'input,select,textarea');
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
	};

	MPC.autofocus = PPC.autofocus = SCP.autofocus = function(selector, counter) {
		autofocus(this.element, selector, counter);
		return this;
	};

	MPC.attrd = PPC.attrd = SCP.attrd = function(name, value) {
		name = T_DATA + name;
		var el = this.element;
		if (value === undefined)
			return el.attr(name);
		el.attr(name, value);
		return this;
	};

	MPC.attrd2 = PPC.attrd2 = SCP.attrd2 = function(name) {
		return this.element.attrd2(name);
	};

	MPC.css = PPC.css = SCP.css = function(name, value) {
		var el = this.element;
		if (value === undefined)
			return el.css(name);
		el.css(name, value);
		return this;
	};

	PPC.main = SCP.main = function() {
		var self = this;
		if (self.$main === undefined) {
			var tmp = self.parent().closest(ATTRCOM)[0];
			self.$main = tmp ? tmp.$com : null;
		}
		return self.$main;
	};

	PPC.rcwatch = function(path, value) {
		var self = this;
		if (value) {
			self.reconfigure(value);
			self.$reconfigure();
		}
		return self;
	};

	PPC.configdisplay = function(key, value) {

		if (typeof(value) !== TYPE_S || !(/@(xs|sm|md|lg|dark|light)=/).test(value))
			return value;

		var self = this;

		if (!self.$configdisplay)
			self.$configdisplay = {};

		if (!self.$configdisplay[key])
			self.$configdisplay[key] = {};

		var values = self.$configdisplay[key];
		if (values.cache !== value) {
			values.cache = value;
			var arr = value.split(/,|\s/);
			for (var i = 0; i < arr.length; i++) {
				var kv = arr[i].split('=');
				var v = kv[1];
				if (v === T_TRUE || v === T_FALSE)
					v = v === T_TRUE;
				else if (REGNUM.test(v)) {
					var tmp = +v;
					if (!isNaN(tmp))
						v = tmp;
				}
				values[kv[0].substring(1)] = v;
			}
		}

		if (values.dark != null || values.light != null) {
			var d = document.body.classList.contains(MD.prefixcsslibrary + 'dark') ? 'dark' : 'light';
			v = values[d];
			if (d === 'dark' || d === 'light')
				return v;
		}

		d = WIDTH();
		v = values[d];

		if (v == null) {
			if (d === 'xs') {
				v = values.sm;
				if (v == null)
					v = values.md;
				if (v == null)
					v = values.lg;
			} else if (d === 'sm') {
				v = values.xs;
				if (v == null)
					v = values.md;
				if (v == null)
					v = values.lg;
			} else if (d === 'md') {
				v = values.sm;
				if (v == null)
					v = values.lg;
				if (v == null)
					v = values.xs;
			} else if (d === 'lg') {
				v = values.md;
				if (v == null)
					v = values.sm;
				if (v == null)
					v = values.xs;
			}
		}

		return v;
	};

	function updateconfig(com) {
		com.$configtimeout = null;
		com.reconfigure(com.$configchanges);
		com.$configchanges = {};
	}

	PPC.$configmonitor = function(path) {
		var self = this;
		return function(p, v) {
			self.$configchanges[path] = v;
			self.$configtimeout && clearTimeout(self.$configtimeout);
			self.$configtimeout = setTimeout(updateconfig, 50, self);
		};
	};

	PPC.reconfigure = function(value, callback, init, noemit) {

		var self = this;

		if (value == null)
			return self;

		if (typeof(value) === TYPE_O) {
			for (var k in value) {

				var v = value[k];
				var iswatcher = k.charAt(0) === '=';

				if (iswatcher) {
					k = k.substring(1);
					if (!self.$configwatcher[k]) {
						self.$configwatcher[k] = v = self.makepath(v);
						self.watch(v, self.$configmonitor(k));
					}
					v = GET(v);
				}

				if (!iswatcher)
					v = self.configdisplay(k, v);
				var prev = self.config[k];
				if (!init && self.config[k] !== v)
					self.config[k] = v;
				if (callback)
					callback(k, v, init, init ? undefined : prev);
				else {
					if (!noemit) {
						if (self.configure)
							self.configure(k, v, init, init ? undefined : prev);
						if (self.dom.configure)
							self.dom.configure(k, v, init, init ? undefined : prev);
					}
				}
				self.data && self.data(T_CONFIG + '.' + k, v);
			}
		} else if (value.charAt(0) === '=' && value.indexOf(':') === -1) {
			value = value.substring(1).SCOPE(self);

			if (self.watch) {
				self.$rcwatch && self.unwatch(self.$rcwatch, self.rcwatch);
				self.watch(value, self.rcwatch);
				self.$rcwatch = value;
			}

			self.reconfigure(get(value), callback, init);

		} else {

			TRANSLATE(value).parseConfig(function(k, v) {

				var prev = self.config[k];
				var iswatcher = k.charAt(0) === '=';

				if (iswatcher) {
					k = k.substring(1);
					if (!self.$configwatcher[k]) {
						self.$configwatcher[k] = v = self.makepath(v);
						self.watch(v, self.$configmonitor(k));
					}
					v = GET(v);
				}

				if (!iswatcher)
					v = self.configdisplay(k, v);

				if ((self.$new || !init) && self.config[k] !== v)
					self.config[k] = v;

				self.data && self.data(T_CONFIG + '.' + k, v);

				if (callback)
					callback(k, v, init, init ? undefined : prev);
				else {
					if (!noemit) {
						if (self.configure)
							self.configure(k, v, init, init ? undefined : prev);
						if (self.dom && self.dom.configure)
							self.dom.configure(k, v, init, init ? undefined : prev);
					}
				}
			});
		}

		self.$reconfigure();
		return self;
	};

	function reconfigure_assign(self, path) {
		self.$assigned && SET(self.$assigned, null);
		self.$assigned = self.makepath(path);
		SET(self.$assigned, self);
	}

	function reconfigure_exec(self, path) {
		EXEC.call(self, self.makepath(path.$reconfigure), self);
	}

	PPC.$reconfigure = function() {
		var self = this;
		var cfg = self.config;

		self.data && self.data(T_CONFIG, cfg);

		if (cfg.$type) {
			self.type = cfg.$type;
			delete cfg.$type;
		}

		if (cfg.$assign) {
			setTimeout(reconfigure_assign, cfg.$assign.indexOf('?') === -1 ? 1 : 10, self, cfg.$assign);
			delete cfg.$assign;
		}

		if (cfg.$id) {
			self.id = cfg.$id;
			delete cfg.$id;
		}

		if (cfg.$compile == false && self.nocompile) {
			self.nocompile();
			delete cfg.$compile;
		}

		if (cfg.$init) {
			self.$init = cfg.$init;
			delete cfg.$init;
		}

		if (cfg.$bindvisible != null)
			self.bindvisible(cfg.$bindvisible ? 0 : false);

		if (cfg.$class) {
			self.tclass(cfg.$class);
			delete cfg.$class;
		}

		if (cfg.$reconfigure) {
			setTimeout(reconfigure_exec, cfg.$reconfigure.indexOf('?') === -1 ? 1 : 10, self, cfg.$reconfigure);
			delete cfg.$reconfigure;
		}
	};

	MPC.closest = PPC.closest = SCP.closest = function(sel) {
		return this.element.closest(sel);
	};

	MPC.parent = PPC.parent = SCP.parent = function(sel) {

		var self = this;
		if (!sel)
			return self.element.parent();

		if (sel === 'auto') {
			var dom = self.dom;
			if (dom) {
				dom = dom.parentNode;
				while (true) {
					if (!dom || dom.tagName === 'BODY')
						break;
					if (dom.style.height && !dom.classList.contains(MD.prefixcsslibrary + 'scrollbar-area'))
						return $(dom);
					dom = dom.parentNode;
				}
				return $W;
			}
		}

		if (sel.substring(0, 6) !== 'parent')
			return sel === 'window' ? $W : sel === 'document' ? D : self.element.closest(sel);

		var count = sel.substring(6);
		var parent = self.element.parent();

		if (count) {
			count = +count;
			for (var i = 0; i < count; i++)
				parent = parent.parent();
		}

		return parent;
	};

	var TNB = { number: 1, boolean: 1 };

	MPC.html = PPC.html = function(value) {
		var el = this.element;
		if (value === undefined)
			return el.html();
		if (value instanceof Array)
			value = value.join('');
		var type = typeof(value);
		current_element = el[0];
		var v = (value || TNB[type]) ? el.empty().append(value) : el.empty();
		current_element = null;
		return v;
	};

	MPC.text = PPC.text = function(value) {
		var el = this.element;
		if (value === undefined)
			return el.text();
		if (value instanceof Array)
			value = value.join('');
		var type = typeof(value);
		return (value || TNB[type]) ? el.empty().text(value) : el.empty();
	};

	MPC.empty = PPC.empty = function() {

		var self = this;

		if (self.$children) {
			for (var i = 0; i < M.components.length; i++) {
				var m = M.components[i];
				!m.$removed && m.owner === self && m.remove();
			}
			self.$children = 0;
		}

		var el = self.element;
		el.empty();
		return el;
	};

	MPC.append = PPC.append = SCP.append = function(value) {
		var el = this.element;
		if (value instanceof Array)
			value = value.join('');
		current_element = el[0];
		var v = value ? el.append(value) : el;
		current_element = null;
		return v;
	};

	MPC.event = PPC.event = SCP.event = function() {
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

	MPC.find = PPC.find = SCP.find = function(selector) {
		var el = this.element;
		if (selector && typeof(selector) === TYPE_O)
			return el.multiple(selector);
		return el.find(selector);
	};

	PPC.isInvalid = function() {
		var self = this;
		return self.config.touched && self.config.invalid;
	};

	PPC.unwatch = function(path, fn) {
		var self = this;
		OFF('com' + self._id + '#watch', path, fn);
		return self;
	};

	PPC.watch = function(path, fn, init) {

		var self = this;

		if (typeof(path) === TYPE_FN) {
			init = fn;
			fn = path;
			path = self.path;
		} else
			path = path.replace(REGSCOPEREPLACE, self.path);

		self.on('watch', path, fn, init);
		return self;
	};

	PPC.invalid = function() {
		return INVALID(this.path, this);
	};

	PPC.change = PPC.touched = function(value) {
		var self = this;
		CHANGE(self.path, value === undefined ? true : value);
		return self;
	};

	PPC.dirty = function(value, noEmit) {

		var self = this;

		if (value === undefined)
			return !self.config.touched;

		self.config.touched = !value;

		if (!noEmit)
			state([self], 2, 2);

		return self;
	};

	PPC.reset = function() {
		var self = this;
		self.config.modified = false;
		self.config.touched = false;
		self.config.invalid = self.validate ? (!self.validate(self.get())) : false;
		self.stateX(1, 3);
		return self;
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
		el.attr(ATTRDEL, T_TRUE).find(ATTRCOM).attr(ATTRDEL, T_TRUE);
		self.$removed = 1;
		self.removed = true;
		OFF('com' + self._id + '#');
		!noClear && setTimeout2('$cleaner', cleaner2, 100);
		return true;
	};

	PPC.on = function(name, path, fn, init) {

		if (typeof(path) === TYPE_FN) {
			init = fn;
			fn = path;
			path = '';
		} else
			path = path.replace('.*', '');

		var self = this;
		var push = '';

		if (name.charAt(0) === '^') {
			push = '^';
			name = name.substring(1).trim();
		}

		ON(push + 'com' + self._id + '#' + name, path, fn, init, self);
		return self;
	};

	PPC.off = function(name, fn) {
		var self = this;
		OFF('com' + self._id + '#' + name, fn);
		return self;
	};

	PPC.caniuse = function(name) {
		if (M.$components[name])
			return 1;
		if (lazycom[name])
			return 2;
	};

	PPC.formatter = function(value, prepend) {
		var self = this;

		if (typeof(value) === TYPE_FN) {
			!self.$formatter && (self.$formatter = []);
			if (prepend === true)
				self.$formatter.unshift(value);
			else
				self.$formatter.push(value);
			return self;
		}

		var format = self.format || self.config.format;
		var type = self.type || self.config.type;

		var a = self.$formatter;
		if (a && a.length) {
			for (var i = 0; i < a.length; i++)
				value = a[i].call(self, self.path, value, type, format);
		}

		a = M.$formatter;
		if (a && a.length) {
			for (var i = 0; i < a.length; i++)
				value = a[i].call(self, self.path, value, type, format);
		}

		return value;
	};

	PPC.parser = function(value, prepend) {

		var self = this;
		var type = typeof(value);

		if (type === TYPE_FN) {
			!self.$parser && (self.$parser = []);

			if (prepend === true)
				self.$parser.unshift(value);
			else
				self.$parser.push(value);

			return self;
		}

		if (self.trim && type === TYPE_S)
			value = value.trim();

		var format = self.format || self.config.format;
		var type = self.type || self.config.type;

		var a = self.$parser;
		if (a && a.length) {
			for (var i = 0; i < a.length; i++)
				value = a[i].call(self, self.path, value, type, format);
		}

		a = M.$parser;
		if (a && a.length) {
			for (var i = 0; i < a.length; i++)
				value = a[i].call(self, self.path, value, type, format);
		}

		return value;
	};

	PPC.emit = function() {
		EMIT.apply(M, arguments);
		return this;
	};

	PPC.get = function(path) {
		var self = this;
		if (self.$pp)
			return self.owner.data(self.path);
		path = path ? self.makepath(path) : (self.path || self.$jcbindget);
		if (path) {
			var val = self.$jcbind && self.$jcbind.vbind ? get(path, self.$jcbind.vbind.value) : get(path);
			return self.$format ? self.$format(val, path, -1, self.scope) : val;
		}
	};

	PPC.skip = function() {
		var self = this;
		self.$skipsetter = true;
		return self;
	};

	PPC.set = function(value, type) {

		var self = this;

		if (self.$pp) {
			self.owner.set(self.path, value);
			return self;
		}

		var arg = arguments;

		self.config.modified = true;

		// Backwards compatibility
		if (arg.length === 3)
			M.set(self.makepath(arg[0]), arg[1], arg[2]);
		else {
			var p = self.path || self.$jcbindset;
			p && M.set(p, value, type);
		}

		return self;
	};

	PPC.inc = function(value, type) {
		var self = this;
		var p = self.path || self.$jcbindset;
		self.config.modified = true;
		p && M.inc(p, value, type);
		return self;
	};

	PPC.extend = function(value, type) {
		var self = this;
		var p = self.path || self.$jcbindset;
		self.config.modified = true;
		p && M.extend(p, value, type);
		return self;
	};

	PPC.rewrite = function(value, type) {
		var self = this;
		var p = self.path || self.$jcbindset;
		self.config.modified = true;
		p && REWRITE(p, value, type);
		return self;
	};

	PPC.push = function(value, type) {
		var self = this;
		var p = self.path || self.$jcbindset;
		self.config.modified = true;
		p && M.push(p, value, type);
		return self;
	};

	// ===============================================================
	// WINDOW FUNCTIONS
	// ===============================================================

	var ua = navigator.userAgent || '';
	W.isMOBILE = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(ua);
	W.isROBOT = (/search|agent|bot|crawler|spider/i).test(ua);
	W.isSTANDALONE = navigator.standalone || W.matchMedia('(display-mode: standalone)').matches;
	W.isTOUCH = !!('ontouchstart' in W || navigator.maxTouchPoints);
	W.isIE = (/msie|trident/i).test(ua);

	W.setTimeout2 = function(name, fn, timeout, limit, param) {
		var key = ':' + name;
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
		if (statics[key]) {
			clearTimeout(statics[key]);
			statics[key] = undefined;
			statics[key + ':limit'] && (statics[key + ':limit'] = undefined);
			return true;
		}
		return false;
	};

	W.CONFIG = function(selector, config) {

		if (typeof(selector) === TYPE_S) {

			var arr;

			if (selector.indexOf(',') !== -1) {
				arr = selector.split(',');
				for (var i = 0; i < arr.length; i++)
					CONFIG(arr[i].trim(), config);
				return;
			}

			var fn = [];
			arr = selector.split(' ');

			for (var i = 0; i < arr.length; i++) {
				var sel = arr[i];
				var prop = '';
				switch (sel.trim().charAt(0)) {
					case '*':
						fn.push('com.path.indexOf(\'{0}\')!==-1'.format(sel.substring(1)));
						return;
					case '.':
						// path
						prop = T_PATH;
						break;
					case '#':
						// id
						prop = 'id';
						break;
					default:
						// name
						prop = '$name';
						break;
				}
				fn.push('com.{0}==\'{1}\''.format(prop, prop === '$name' ? sel : sel.substring(1)));
			}
			selector = FN('com=>' + fn.join('&&'));
		}

		configs.push({ fn: selector, config: config });
	};

	function recompile() {
		setTimeout2('$compile', COMPILE, 700);
	}

	W.MACRO = function(name, declaration) {
		M.macros[name] = declaration;
	};

	W.EXTENSION = function(name, config, declaration) {

		// component_name: DESCRIPTION OF EXTENSION
		var index = name.indexOf(':');
		var note = '';

		if (index !== -1) {
			note = name.substring(index + 1).trim();
			name = name.substring(0, index).trim();
		}

		var c = name.charAt(0);

		if (c === '@' || c === '*') {
			var id = c === '*' ? cleancommonpath() : name.substring(1).trim();
			var obj = W.PLUGINS[id];
			if (obj) {
				config.call(obj, obj);
			} else {
				if (extensions[name] && extensions[name].indexOf(config) === -1)
					extensions[name].push(config);
				else
					extensions[name] = [config];
			}
			return;
		}

		if (typeof(config) === TYPE_FN) {
			var tmp = declaration;
			declaration = config;
			config = tmp;
		}

		if (extensions[name])
			extensions[name].push({ config: config, fn: declaration, name: note });
		else
			extensions[name] = [{ config: config, fn: declaration, name: note }];

		for (var i = 0; i < M.components.length; i++) {
			var m = M.components[i];
			if (!m.$removed || name === m.name){
				config && m.reconfigure(config, undefined, true);
				declaration.call(m, m, m.config, 'ui–' + m.name);
			}
		}

		recompile();
	};

	W.ADD = function(value, element, config, content) {

		if (element instanceof COM || element instanceof Scope || element instanceof Plugin)
			element = element.element;

		if (element instanceof jQuery)
			element = element[0];

		if (element && typeof(element) === TYPE_O && !element.parentNode) {
			content = config;
			config = element;
			element = null;
		}

		if (typeof(config) === TYPE_S) {
			content = config;
			config = null;
		}

		if (value instanceof Array) {
			for (var i = 0; i < value.length; i++)
				ADD(value[i], element, config, content);
		} else {

			var arr;
			var prepend = false;

			if (typeof(value) === TYPE_O) {

				arr = [];
				arr.push(value.name || '');
				arr.push(value.path || '');

				if (value.config && typeof(value.config) === TYPE_O)
					config = value.config;
				else
					arr.push(value.config || '');

				if (value.element)
					element = value.element;

				if (value.prepend)
					prepend = true;

			} else {
				var name = value.split('__')[0];
				if (name.charAt(0) === '!') {

					value = value.substring(1);
					name = name.substring(1);

					var keys = Object.keys(M.$components);
					var index = name.indexOf('@');
					if (index !== -1)
						name = name.substring(0, index);

					for (var i = 0; i < keys.length; i++) {
						var key = keys[i];
						index = key.indexOf('@');
						if (index !== -1)
							key = key.substring(0, index);
						if (key === name)
							return;
					}
				}

				arr = value.split('__');
			}

			if (config) {
				var key = T_CONFIG + GUID(10);
				W[key] = config;
				arr[2] = '%' + key;
			}

			var content = '<ui-component name="{0}" path="{1}" config="{2}">{3}</ui-component>'.format(arr[0], arr[1] || 'null', arr[2] || 'null', content || '');
			var el = $(element || D.body);

			if (prepend)
				el.prepend(content);
			else
				el.append(content);

			recompile();
		}
	};

	W.COMPONENT = function(name, config, declaration, dependencies) {

		if (typeof(config) === TYPE_FN) {
			dependencies = declaration;
			declaration = config;
			config = null;
		}

		if (MD.customelements && !SKIPCUSTOMELEMENTS[name])
			registercustom('ui-' + name, name);

		// Multiple versions
		if (name.indexOf(',') !== -1) {
			var tmp = name.split(',');
			for (var i = 0; i < tmp.length; i++) {
				var item = tmp[i].trim();
				item && COMPONENT(item, config, declaration, i ? null : dependencies);
			}
		} else {
			M.$components[name] && warn('Overwriting component:', name);
			var a = M.$components[name] = { name: name, config: config, declaration: declaration, shared: {}, dependencies: dependencies instanceof Array ? dependencies : null };
			var e = 'component.compile';
			events[e] && EMIT(e, name, a);
		}
	};

	W.WIDTH = function(el) {
		if (!el)
			el = $W;
		var w = el.width();
		var d = MD.devices;
		return w >= d.md.min && w <= d.md.max ? 'md' : w >= d.sm.min && w <= d.sm.max ? 'sm' : w > d.lg.min ? 'lg' : w <= d.xs.max ? 'xs' : '';
	};

	var regfnplugin = function(v) {
		var l = v.length;
		return pathmaker(v.substring(0, l - 1), 0, 1) + v.substring(l - 1);
	};

	W.FN = function(exp, notrim) {

		exp = exp.replace(REGFNPLUGIN, regfnplugin);
		var index = exp.indexOf('=>');
		if (index === -1)
			return isValue(exp) ? FN('value=>' + rebinddecode(exp), true) : new Function('return ' + (exp.indexOf('(') === -1 ? 'typeof({0})==\'function\'?{0}.apply(this,arguments):{0}'.format(exp) : exp));

		var arg = exp.substring(0, index).trim();
		var val = exp.substring(index + 2).trim();
		var is = false;

		arg = arg.replace(/\(|\)|\s/g, '').trim();
		if (arg)
			arg = arg.split(',');

		if (val.charCodeAt(0) === 123 && !notrim) {
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
	};

	W.SETTER = function(selector, name) {

		var arg = [];
		var beg = selector === true ? 3 : 2;
		var isget;
		var tmp;
		var is;
		var methodname;
		var myselector;
		var scope = current_scope;
		var cl;
		var lazy;

		for (var i = beg; i < arguments.length; i++)
			arg.push(arguments[i]);

		if (beg === 3) {

			if (name.indexOf(' #') !== -1) {
				tmp = makecl(name);
				cl = tmp.cl;
				name = tmp.path;
			}

			myselector = makeandexecflags(name);

			if (myselector.charAt(0) === '!') {
				myselector = myselector.substring(1);
				is = true;
			}

			tmp = myselector.indexOf('/');

			if (tmp !== -1) {
				arg.unshift(arguments[2]);
				methodname = myselector.substring(tmp + 1);
				myselector = myselector.substring(0, tmp);
			}

			lazy = lazycom[myselector];
			if (lazy && lazy.state !== 3) {
				if (lazy.state === 1) {
					if (is)
						return;
					lazy.state = 2;
					events.lazy && EMIT('lazy', myselector, true);
					warn('Lazy load: ' + myselector);
					DEF.monitor && monitor_method('lazy', 2);
					if (lazy.nodes && lazy.nodes.length) {
						for (var m of lazy.nodes)
							htmlcomponentparse2(m);
						delete lazy.nodes;
					}
					compile();
				}

				setTimeout(function(arg) {
					current_scope = scope;
					arg[0] = true;
					CL(cl, () => SETTER.apply(W, arg));
				}, 555, arguments);

				return;
			}

			if (tmp === -1)
				methodname = arguments[2];

			DEF.monitor && monitor_method('setters');

			CL(cl, function() {
				FIND(myselector, true, function(arr) {

					current_scope = scope;
					isget = methodname.indexOf('.') !== -1;
					events.setter && EMIT('setter', myselector, methodname, arg[0], arg[1]);

					var count = 0;

					for (var i = 0; i < arr.length; i++) {
						var o = arr[i];
						var a = isget ? get(methodname, o) : o[methodname];

						if (!a && o.$new)
							a = isget ? get(methodname, o.node) : o.node[methodname];

						if (typeof(a) === TYPE_FN) {
							count++;
							a.apply(o, arg);
						}
					}

					if (debug && !count)
						WARN(ERRSETTER.format(selector));

				});
			});

		} else {

			if (selector.indexOf(' #') !== -1) {
				tmp = makecl(selector);
				cl = tmp.cl;
				selector = tmp.path;
			}

			myselector = makeandexecflags(selector);
			methodname = name;
			tmp = myselector.indexOf('/');

			if (tmp !== -1) {
				arg.unshift(arguments[1]);
				methodname = myselector.substring(tmp + 1);
				myselector = myselector.substring(0, tmp);
			}

			if (myselector.charAt(0) === '!') {
				myselector = myselector.substring(1);
				is = true;
			}

			lazy = lazycom[myselector];
			if (lazy && lazy.state !== 3) {
				if (lazy.state === 1) {
					if (is)
						return;
					lazy.state = 2;
					events.lazy && EMIT('lazy', myselector, true);
					DEF.monitor && monitor_method('lazy', 2);
					warn('Lazy load: ' + myselector);

					if (lazy.nodes && lazy.nodes.length) {
						for (var m of lazy.nodes)
							htmlcomponentparse2(m);
						delete lazy.nodes;
					}

					compile();
				}

				setTimeout(function(arg) {
					current_scope = scope;
					CL(cl, () => SETTER.apply(W, arg));
				}, 555, arguments);

				return;
			}

			var arr = FIND(myselector, true);
			isget = methodname.indexOf('.') !== -1;

			DEF.monitor && monitor_method('setters');
			events.setter && EMIT('setter', myselector, methodname, arg[0], arg[1]);

			CL(cl, function() {
				var count = 0;
				for (var i = 0; i < arr.length; i++) {
					var o = arr[i];
					var a = isget ? get(methodname, o) : o[methodname];

					if (!a && o.$new)
						a = isget ? get(methodname, o.node) : o.node[methodname];

					if (typeof(a) === TYPE_FN) {
						a.apply(o, arg);
						count++;
					}
				}

				if (debug && !count)
					WARN(ERRSETTER.format(selector));
			});
		}
	};

	function exechelper(ctx, path, arg, cl) {
		setTimeout(function() {
			CL(cl, function() {
				DEF.monitor && monitor_method('exec');
				EXEC.call(ctx, true, path, arg[0], arg[1], arg[2], arg[3], arg[4], arg[5], arg[6]);
			});
		}, 200);
	}

	function safeget(path) {
		var index = path.indexOf(' ');
		return index === -1 ? path : path.substring(0, index);
	}

	W.SEEX = function(path, a, b, c, d) {
		if (typeof(path) === TYPE_FN) {
			path(a, b, c, d);
		} else {
			if (path.indexOf('/') !== -1 || typeof(get(safeget(path))) === TYPE_FN)
				EXEC(path, a, b, c, d);
			else
				SET(path, a);
		}
	};

	W.CMD = function(name, a, b, c, d, e) {

		events.cmd && EMIT('cmd', name, a, b, c, d, e);
		DEF.monitor && monitor_method('cmd');

		for (var i = 0; i < M.components.length; i++) {
			var com = M.components[i];
			if (com && com.$loaded && !com.$removed && com.$commands && com.$commands[name]) {
				var cmd = com.$commands[name];
				for (var j = 0; j < cmd.length; j++)
					cmd[j](a, b, c, d, e);
			}
		}
	};

	var execsetterflags;

	function makecl(path) {

		var cl = [];

		path = path.replace(REGCL, function(text) {
			cl.push(text.trim().substring(1));
			return '';
		});

		return { path: path, cl: cl.length ? cl.join(',') : '' };
	}

	function makeandexecflags(path) {
		execsetterflags = [];
		path = path && typeof(path) === TYPE_S ? path.replace(REGFLAGS, parseexecsetterflags) : path;
		execsetterflags.length && emitflags(execsetterflags, path);
		return path;
	}

	function parseexecsetterflags(text) {
		execsetterflags.push(text.substring(2));
		return '';
	}

	W.ADAPT = function(path, id, text) {

		if (!text || typeof(text) !== TYPE_S)
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

	W.inDOM = inDOM;
	W.EXE = W.EXEC = function(path) {

		var arg = [];
		var f = 1;
		var wait = false;
		var p;
		var ctx = this;

		if (path === true) {
			wait = true;
			path = arguments[1];
			f = 2;
		}

		path = path.env();

		if (current_scope)
			path = path.replace(REGSCOPEINLINE, current_scope);

		for (var i = f; i < arguments.length; i++)
			arg.push(arguments[i]);

		var c = path.charAt(0);

		if (c === '*')
			path = path.replace(c, cleancommonpath() + (path.charAt(1) === '/' ? '' : '/'));

		var tmp;
		var cl;

		if (path.indexOf(' #') !== -1) {
			tmp = makecl(path);
			cl = tmp.cl;
			path = tmp.path;
		}

		path = makeandexecflags(path);

		// Event
		if (c === '#') {
			p = path.substring(1);
			if (wait) {
				!events[p] && exechelper(ctx, path, arg, cl);
			} else
				CL(cl, () => EMIT.call(ctx, p, arg[0], arg[1], arg[2], arg[3], arg[4]));
			return;
		}

		if (c === '-') {
			var is = path.substring(0, 3) === T_COM; // backward compatibility
			var args = [path.substring(is ? 3 : 1).trim(), arg[0], arg[1], arg[2], arg[3], arg[4]];
			wait && args.unshift(wait);
			CL(cl, () => SETTER.apply(W, args));
			return;
		}

		if (c === '&') {
			CL(cl, () => CMD.call(ctx, path.substring(1), arg[0], arg[1], arg[2], arg[3], arg[4]));
			return;
		}

		events.exec && EMIT('exec', path, arg[0], arg[1], arg[2], arg[3]);

		var plugin_method = null;
		var plugin_name = null;
		var index = null;

		if (c === '@') {
			index = path.indexOf('.');
			plugin_name = path.substring(1, index);
			plugin_method = path.substring(index + 1);
		}

		if (!plugin_name) {
			index = path.indexOf('/');
			if (index !== -1) {
				plugin_name = path.substring(0, index);
				plugin_method = path.substring(index + 1);
			}
		}

		if (plugin_name) {
			var ctrl = W.PLUGINS[plugin_name];
			if (ctrl && typeof(ctrl[plugin_method]) === TYPE_FN) {

				current_caller = tmp = current_scope;
				current_scope = plugin_name;

				CL(cl, function() {

					var caller = tmp && W.PLUGINS[tmp];
					if (caller && caller !== ctrl)
						ctrl.caller = caller;

					current_caller = plugin_name;
					ctrl[plugin_method].apply(ctx === W ? ctrl : ctx, arg);

					if (DEF.monitor) {
						monitor_method('exec');
						monitor_method('plugins');
					}

					current_scope = tmp;

				});

				return;

			} else if (plugin_name) {
				tmp = pluginableplugins[plugin_name];
				if (tmp) {
					if (!tmp.pending) {
						warn('Initializing: ' + plugin_name);
						tmp.pending = true;
						if (typeof(tmp.fn) === TYPE_S) {
							// URL address
							CL(cl, function() {
								IMPORT(tmp.fn, function() {
									tmp = pluginableplugins[plugin_name];
									tmp && W.PLUGIN(tmp.name, tmp.fn, tmp.init, () => exechelper(ctx, path, arg));
								}, response => response.replace(/~PATH~|~ID~/g, tmp.name));
							});
						} else {
							delete pluginableplugins[plugin_name];
							CL(cl, () => W.PLUGIN(tmp.name, tmp.fn, tmp.init, () => exechelper(ctx, path, arg)));
						}
						return;
					} else
						wait = true;
				}
			}

			if (debug && !wait)
				WARN(ERREXEC.format(path));

			wait && exechelper(ctx, path, arg, cl);
			return;
		}

		if (path.substring(0, 5) === 'FUNC') {
			var fn = FUNC[path.substring(6)];
			if (fn) {
				CL(cl, () => fn.apply(ctx === W ? ctrl : ctx, arg));
				return;
			}

			if (wait)
				exechelper(ctx, path, arg, cl);
			else if (debug)
				WARN(ERREXEC.format(path));
			return;
		}

		var fn = get(path);

		if (typeof(fn) === TYPE_FN) {
			CL(cl, function() {
				fn.apply(ctx, arg);
				DEF.monitor && monitor_method('exec');
			});
			return;
		}

		if (wait)
			exechelper(ctx, path, arg, cl);
		else if (debug)
			WARN(ERREXEC.format(path));

	};

	W.ATTRD = function(el, attrd) {
		if (el) {
			if (el instanceof jQuery)
				return el.attrd2(attrd || 'id');
			else if (el instanceof jQuery.Event)
				return $(el.currentTarget).attrd2(attrd || 'id');
			else if (typeof(el.getAttribute) === TYPE_FN)
				return W.ATTRD($(el), attrd);
			else if (typeof(el) === TYPE_O)
				return el[attrd || 'id'];
		}
		return el;
	};

	W.MAKE = function(obj, fn, update) {

		switch (typeof(obj)) {
			case TYPE_FN:
				fn = obj;
				obj = {};
				break;
			case TYPE_S:
				var p = pathmaker(obj);
				var is = true;
				obj = get(p);
				if (obj == null) {
					is = false;
					obj = {};
				}
				fn.call(obj, obj, p, function(path, value) {
					set2(obj, path, value);
				});
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

	W.OPT = function(obj, fn) {
		if (typeof(obj) === TYPE_FN) {
			fn = obj;
			obj = {};
		}

		var scope = '';
		fn.call(obj, function(path, value) {
			return set2(obj, scope + path, value);
		}, function(s) {
			scope = s == null ? '' : (s + '');
			if (scope)
				scope += '.';
		});
		return obj;
	};

	W.COPY = function(a, b) {
		var keys = OK(a);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			var val = a[key];
			var type = typeof(val);
			b[key] = type === TYPE_O ? val ? CLONE(val) : val : val;
		}
		return b;
	};

	W.CLONE = function(obj, path) {

		var type = typeof(obj);
		switch (type) {
			case TYPE_N:
			case TYPE_B:
				return obj;
			case TYPE_S:
				return path ? obj : CLONE(GET(obj));
		}

		if (obj == null)
			return obj;

		if (obj instanceof Date)
			return new Date(obj.getTime());

		return PARSE(JSON.stringify(obj));
	};

	var QUERIFYMETHODS = { GET: 1, POST: 1, DELETE: 1, PUT: 1, PATCH: 1, API: 1 };

	W.QUERIFY = function(url, obj) {

		if (typeof(url) !== TYPE_S) {
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
		compress === undefined && (compress = MD.jsoncompress);
		var tf = typeof(fields);
		var tmp = JSON.stringify(obj, function(key, value) {

			if (!key)
				return value;

			if (fields) {
				if (fields instanceof Array) {
					if (fields.indexOf(key) === -1)
						return undefined;
				} else if (tf === TYPE_FN) {
					if (!fields(key, value))
						return undefined;
				} else if (fields[key] === false)
					return undefined;
			}

			if (compress === true) {
				var t = typeof(value);
				if (t === TYPE_S) {
					value = value.trim();
					return value ? value : undefined;
				} else if (value === false || value == null)
					return undefined;
			}

			return value;
		});
		return encrypt && encryptsecret ? encrypt_data(tmp, encryptsecret) : tmp;
	};

	W.PARSE = function(value, date) {

		if (typeof(value) === TYPE_O)
			return value;

		// Is selector?
		var c = (value || '').charAt(0);
		if (c === '#' || c === '.')
			return PARSE($(value).html(), date);

		date === undefined && (date = MD.jsondate);
		try {
			return JSON.parse(value, function(key, value) {
				return typeof(value) === TYPE_S && date && value.isJSONDate() ? new Date(value) : value;
			});
		} catch (e) {
			return null;
		}
	};

	W.NOOP = function(){};

	W.TOGGLE = function(path, timeout, reset) {
		var v = GET(path);
		SET(path, !v, timeout, reset);
	};

	W.NUL = W.NULL = function(path, timeout) {
		SET(path, null, timeout);
	};

	var timeouts = {};

	var setbind = function(path, value, reset, scope) {
		remap(path, value, function(path, value) {
			delete timeouts[path];
			scope && (current_scope = scope);
			M.set(path, value, reset);
		});
	};

	var incbind = function(path, value, reset, scope) {
		remap(path, value, function(path, value) {
			delete timeouts[path];
			scope && (current_scope = scope);
			M.inc(path, value, reset);
		});
	};

	var extbind = function(path, value, reset, scope) {
		remap(path, value, function(path, value) {
			delete timeouts[path];
			scope && (current_scope = scope);
			M.extend(path, value, reset);
		});
	};

	var pushbind = function(path, value, reset, scope) {
		remap(path, value, function(path, value) {
			delete timeouts[path];
			scope && (current_scope = scope);
			M.push(path, value, reset);
		});
	};

	var updbind = function(path, reset) {
		delete timeouts[path];
		M.update(path, reset);
	};

	var setajax = function(type, path, value, timeout, reset) {
		// path    = URL
		// value   = data or callback
		// timeout = callback or boolean
		// reset   = boolean

		if (typeof(timeout) === TYPE_B) {
			reset = timeout;
			timeout = null;
		}

		var tmp = typeof(value);
		var cb = function(response, err) {
			switch (tmp) {
				case TYPE_S:
					switch (type) {
						case 'set':
							setbind(value, response, reset);
							break;
						case 'push':
							pushbind(value, response, reset);
							break;
						case 'extend':
							extbind(value, response, reset);
							break;
					}
					break;
				case TYPE_FN:
					value(response, err);
					break;
			}
		};

		if (tmp === TYPE_FN || tmp === TYPE_S)
			AJAX(path, cb);
		else
			AJAX(path, value, cb);
	};

	W.SET = function(path, value, timeout, reset) {

		if (REGMETHOD.test(path)) {
			setajax('set', path, value, timeout, reset);
			return;
		}

		var t = typeof(timeout);
		if (t === TYPE_B)
			return M.set(path, value, timeout);

		if (!timeout || timeout < 10 || t !== TYPE_N) // TYPE
			return M.set(path, value, timeout);

		timeouts[path] && clearTimeout(timeouts[path]);
		timeouts[path] = setTimeout(setbind, timeout, path, value, reset, current_scope);
	};

	W.INC = function(path, value, timeout, reset) {

		if (value == null)
			value = 1;

		var t = typeof(timeout);
		if (t === TYPE_B)
			return M.inc(path, value, timeout);
		if (!timeout || timeout < 10 || t !== TYPE_N) // TYPE
			return M.inc(path, value, timeout);
		timeouts[path] && clearTimeout(timeouts[path]);
		timeouts[path] = setTimeout(incbind, timeout, path, value, reset, current_scope);
	};

	W.EXT = W.EXTEND = function(path, value, timeout, reset) {

		if (REGMETHOD.test(path)) {
			setajax('extend', path, value, timeout, reset);
			return;
		}

		var t = typeof(timeout);
		if (t === TYPE_B)
			return M.extend(path, value, timeout);
		if (!timeout || timeout < 10 || t !== TYPE_N) // TYPE
			return M.extend(path, value, timeout);
		timeouts[path] && clearTimeout(timeouts[path]);
		timeouts[path] = setTimeout(extbind, timeout, path, value, reset, current_scope);
	};

	W.PUSH = function(path, value, timeout, reset) {

		if (REGMETHOD.test(path)) {
			setajax('push', path, value, timeout, reset);
			return;
		}

		var t = typeof(timeout);
		if (t === TYPE_B)
			return M.push(path, value, timeout);
		if (!timeout || timeout < 10 || t !== TYPE_N) // TYPE
			return M.push(path, value, timeout);
		timeouts[path] && clearTimeout(timeouts[path]);
		timeouts[path] = setTimeout(pushbind, timeout, path, value, reset, current_scope);
	};

	W.MODIFIED = function(path, flags) {
		var output = [];
		var arr = findcomponents(path, flags);
		for (var com of arr) {
			if (com.config.touched && com.config.modified)
				output.push(com.path);
		}
		return output;
	};

	W.NOTMODIFIED = function(path, value, fields) {

		if (value === undefined) {
			path = pathmaker(path);
			value = get(path);
		}

		if (value === undefined)
			value = null;

		if (fields)
			path = path.concat('#', fields);

		var s = STRINGIFY(value, false, fields);
		var hash = HASH(s);
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
		var output;

		if (typeof(many) === TYPE_FN) {
			isWaiting = true;
			callback = many;
			many = undefined;
			// noCache = undefined;
			// noCache can be timeout
		} else if (typeof(noCache) === TYPE_FN) {
			var tmp = callback;
			isWaiting = true;
			callback = noCache;
			noCache = tmp;
			// noCache can be timeout
		}

		if (typeof(value) === TYPE_S && value.indexOf('?') !== -1)
			value = value.replace(REGSCOPEINLINE, current_scope);

		if (isWaiting) {
			WAIT(function() {
				var val = FIND(value, many, noCache);
				var lazy = lazycom[value];
				if (lazy && lazy.state === 1) {
					lazy.state = 2;
					events.lazy && EMIT('lazy', value, true);
					DEF.monitor && monitor_method('lazy', 2);
					warn('Lazy load: ' + value);
					if (lazy.nodes && lazy.nodes.length) {
						for (var m of lazy.nodes)
							htmlcomponentparse2(m);
						delete lazy.nodes;
					}
					compile();
				}
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
		if (typeof(value) === TYPE_O) {
			if (!(value instanceof jQuery))
				value = $(value);
			output = findcomponent(value, '');
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

	W.COMPONENTS = function(path) {

		var flags = {};

		path = path.replace(/@\w+/g, function(text) {
			flags[text.substring(1)] = 1;
			return '';
		}).trim();

		path = pathmaker(path, 0, 1);

		var arr = [];

		for (let m of M.components) {
			if (!m || m.$removed || !m.$loaded || !m.path || !m.$compare(path))
				continue;
			if ((flags.visible && HIDDEN(m.element)) || (flags.hidden && !HIDDEN(m.element)) || (flags.touched && !m.config.touched) || (flags.modified && !m.config.modified) || (flags.required && !m.config.required) || (flags.invalid && !m.config.invalid) || (flags.valid && m.config.invalid) || (flags.disabled && !m.config.disabled) || (flags.enabled && m.config.disabled))
				continue;
			arr.push(m);
		}

		return arr;
	};

	W.BIND = function(path) {
		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++)
				BIND(path[i]);
			return;
		}
		path = pathmaker(path);
		if (path) {
			var is = path.charCodeAt(0) === 33;
			if (is)
				path = path.substring(1);
			path = path.replace(REGWILDCARD, '');
			path && set(path, get(path), true);
		}
	};

	W.UPD = W.UPDATE = function(path, timeout, reset) {
		var t = typeof(timeout);
		if (t === TYPE_B)
			return M.update(path, timeout);
		if (!timeout || timeout < 10 || t !== TYPE_N) // TYPE
			return M.update(path, reset, timeout);
		timeouts[path] && clearTimeout(timeouts[path]);
		timeouts[path] = setTimeout(updbind, timeout, path, reset);
	};

	W.CSS = function(value, id, selector) {
		id && $('#css' + id).remove();
		var val = (value instanceof Array ? value.join('') : value);
		val && $('<style type="text/css"' + (id ? ' id="css' + id + '"' : '') + '>' + (selector ? wrap(selector, val) : val) + '</style>').appendTo('head');
	};

	var windowappearance = 'light';

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
					obj[key] && builder.push(T_ + key.trim() + ':' + (obj[key] + '').trim());
					break;
			}
		}

		obj.color && SET('DEF.color', obj.color);

		if (obj.color && !obj.rgb) {
			var color = obj.color.substring(1);
			if (color.length === 3)
				color += color;
			obj.rgb = parseInt(color.substring(0, 2), 16) + ',' + parseInt(color.substring(2, 4), 16) + ',' + parseInt(color.substring(4, 6), 16);
			builder.push(T_ + 'rgb:' + obj.rgb);
		}

		$('body').tclass(MD.prefixcsslibrary + 'dark', !!dark).tclass(MD.prefixcsslibrary + 'large', !!large);

		if (builder.length)
			CSS(':root{' + builder.join(';') + '}', id);
		else
			$('#css' + id).remove();

		var k = dark ? 'dark' : 'light';
		if (windowappearance !== k) {
			windowappearance = k;
			reconfigure_components();
		}
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

	W.HASH = function(s, unsigned) {
		if (!s)
			return 0;
		var type = typeof(s);
		if (type === TYPE_N)
			return s;
		else if (type === TYPE_B)
			return s ? 1 : 0;
		else if (s instanceof Date)
			return s.getTime();
		else if (type === TYPE_O)
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
		return unsigned != false ? hash >>> 0 : hash;
	};

	function rnd2() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	function rnd3() {
		return arguments[Math.floor(Math.random() * arguments.length)];
	}

	W.GUID = function(size) {

		if (!size) {
			var ticks = Date.now();
			var low = ticks.toString(16);
			var sec = (ticks / 60000 >> 0).toString(16);
			return low.substring(0, 8) + '-' + (low.length < 8 ? low.substring(8).padLeft(4, '0') : low.substring(4, 8)) + '-' + rnd3(1, 2, 3, 4, 5) + sec.substring(1, 4) + '-' + rnd3(0, 8, 9, 'a', 'b') + sec.substring(4, 7) + '-' + rnd2() + rnd2() + rnd2();
		}

		var l = ((size / 10) >> 0) + 1;
		var b = [];

		for (var i = 0; i < l; i++)
			b.push(Math.random().toString(36).substring(2));

		return b.join('').substring(0, size);
	};

	W.WAIT = function(fn, callback, interval, timeout) {

		var key = ((Math.random() * 10000) >> 0).toString(16);
		var tkey = timeout > 0 ? key + '_timeout' : 0;

		if (timeout == null)
			timeout = 5000;

		if (typeof(callback) === TYPE_N) {
			var tmp = interval;
			interval = callback;
			callback = tmp;
		}

		var is = typeof(fn) === TYPE_S;
		var run = false;
		var curr_scope = current_scope;

		if (is) {
			fn = fn.replace(REGSCOPEINLINE, curr_scope);
			fn = fn.flags(fn);
			var result = get(fn);
			if (result)
				run = true;
		} else if (fn())
			run = true;

		if (run) {
			callback(null, function(sleep) {
				setTimeout(function() {
					current_scope = curr_scope;
					WAIT(fn, callback, interval, timeout);
				}, sleep || 1);
			});
			return;
		}

		if (tkey && timeout) {
			waits[tkey] = setTimeout(function() {
				clearInterval(waits[key]);
				delete waits[tkey];
				delete waits[key];
				callback(new Error('Timeout.'));
			}, timeout);
		}

		waits[key] = setInterval(function() {

			if (is) {
				var result = get(fn.replace(REGSCOPEINLINE, curr_scope));
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

			current_scope = curr_scope;
			callback && callback(null, function(sleep) {
				setTimeout(function() {
					current_scope = curr_scope;
					WAIT(fn, callback, interval);
				}, sleep || 1);
			});

		}, interval || 500);
	};

	var $recompile;

	W.COMPILE = function(container) {
		clearTimeout($recompile);
		return compile(container);
	};

	// ===============================================================
	// PROTOTYPES
	// ===============================================================

	var AP = Array.prototype;
	var SP = String.prototype;
	var NP = Number.prototype;
	var DP = Date.prototype;

	AP.async = function(thread, callback, pending, scope) {

		var self = this;

		if (scope == null)
			scope = current_scope;

		if (typeof(thread) === TYPE_FN) {
			callback = thread;
			thread = 1;
		} else if (thread === undefined)
			thread = 1;

		if (pending === undefined)
			pending = 0;

		var item = self.shift();
		if (item === undefined) {
			if (!pending) {
				pending = undefined;
				if (scope)
					current_scope = scope;
				callback && callback();
			}
			return self;
		}

		for (var i = 0; i < thread; i++) {

			if (i)
				item = self.shift();

			pending++;
			if (scope)
				current_scope = scope;
			item(function() {
				setTimeout(function() {
					pending--;
					self.async(1, callback, pending, scope);
				}, 1);
			});
		}

		return self;
	};

	AP.wait = function(onItem, callback, thread, tmp) {

		var self = this;
		var init = false;

		// INIT
		if (!tmp) {

			if (typeof(callback) !== TYPE_FN) {
				thread = callback;
				callback = null;
			}

			tmp = {};
			tmp.pending = 0;
			tmp.index = 0;
			tmp.thread = thread;
			tmp.scope = current_scope;

			// thread === Boolean then array has to be removed item by item
			init = true;
		}

		var item = thread === true ? self.shift() : self[tmp.index++];
		if (item === undefined) {
			if (!tmp.pending) {
				if (callback) {
					current_scope = tmp.scope;
					callback();
				}
				tmp.cancel = true;
			}
			return self;
		}

		tmp.pending++;

		current_scope = tmp.scope;
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

	AP.take = function(count) {
		var arr = [];
		var self = this;
		for (var i = 0; i < self.length; i++) {
			arr.push(self[i]);
			if (arr.length >= count)
				return arr;
		}
		return arr;
	};

	AP.skip = function(count) {
		var arr = [];
		var self = this;
		for (var i = 0; i < self.length; i++)
			i >= count && arr.push(self[i]);
		return arr;
	};

	AP.takeskip = function(take, skip) {
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

	SP.parseEncoded = function() {

		var str = this;
		var index = str.indexOf('?');

		if (index !== -1)
			str = str.substring(index + 1);

		index = str.lastIndexOf('#');
		if (index !== -1)
			str = str.substring(0, index);

		var arr = str.split('&');
		var obj = {};

		for (var m of arr) {
			var tmp = m.split('=');
			obj[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
		}

		return obj;
	};

	SP.VARIABLES = function(args) {

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

		return str.replace(/--\w+--/g, function(text) {
			return args[text.substring(2, text.length - 2).trim()] || text;
		});

	};

	SP.ROOT = function(noBase) {
		var url = this;
		var r = MD.root;
		var b = MD.baseurl;
		var ext = /(https|http|wss|ws|file):\/\/|\/\/[a-z0-9]|[a-z]:/i;
		var replace = function(t) {
			return t.charAt(0) + '/';
		};
		if (r)
			url = typeof(r) === TYPE_FN ? r(url) : ext.test(url) ? url : (r + url);
		else if (!noBase && b)
			url = typeof(b) === TYPE_FN ? b(url) : ext.test(url) ? url : (b + url);
		return url.replace(/[^:]\/{2,}/, replace);
	};

	SP.parseSource = function(type) {

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

	SP.encode = function() {
		return Thelpers.encode(this);
	};

	SP.env = function() {
		var self = this;
		return self.replace(REGENV, function(val) {
			var key = val.substring(1, val.length - 1);
			return (key.charAt(0) === '.' ? GET(key.substring(1)) : ENV[key]) || val;
		});
	};

	SP.$env = function() {
		var self = this;
		var index = this.indexOf('?');
		return index === -1 ? self.env() : self.substring(0, index).env() + self.substring(index);
	};

	SP.COMPILABLE = function() {
		return REGCOM.test(this);
	};

	SP.parseConfig = function(def, callback) {

		var output;

		switch (typeof(def)) {
			case TYPE_FN:
				callback = def;
				output = {};
				break;
			case TYPE_S:
				output = def.parseConfig();
				break;
			case TYPE_O:
				if (def != null)
					output = def;
				else
					output = {};
				break;
			default:
				output = {};
				break;
		}

		var arr = this.replace(/\\;/g, '\0').split(';');
		var colon = /(https|http|wss|ws):\/\//gi;

		for (var m of arr) {

			var item = m.replace(/\0/g, ';').replace(/\\:/g, '\0').replace(colon, function(text) {
				return text.replace(/:/g, '\0');
			});

			var kv = item.split(':');
			var l = kv.length;

			if (l !== 2)
				continue;

			var k = kv[0].trim().env();
			var v = kv[1].trim().replace(/\0/g, ':').env();

			if (v === T_TRUE || v === T_FALSE)
				v = v === T_TRUE;
			else if (REGNUM.test(v)) {
				var tmp = +v;
				if (!isNaN(tmp))
					v = tmp;
			}

			output[k] = v;
			callback && callback(k, v);
		}

		return output;
	};

	SP.flags = function(path, value, type) {
		var flags = [];
		var str = this.replace(/(^|\s)@[\w]+/g, function(text) {
			flags.push(text.trim().substring(1));
			return '';
		}).trim();
		flags.length && emitflags(flags, path, value, type);
		return str;
	};

	SP.arg = SP.args = function(obj, encode, def) {

		if (typeof(encode) === TYPE_S)
			def = encode;

		var isfn = typeof(encode) === 'function';

		return this.replace(REGPARAMS, function(text) {
			// Is double?
			var l = text.charCodeAt(1) === 123 ? 2 : 1;
			var key = text.substring(l, text.length - l).trim();
			var val = get(key, obj);

			if (encode) {
				if (isfn)
					return encode(val, key);
				if (encode === 'json')
					return JSON.stringify(val);
			}

			return val == null ? (def == null ? text : def) : encode ? encode === 'escape' ? Thelpers.encode(val) : encodeURIComponent(val + '') : val;
		});
	};

	SP.render = function(a, b) {
		try {
			return Tangular.render(this, a, b);
		} catch (e) {
			THROWERR(e);
			return '';
		}
	};

	SP.isJSONDate = function() {
		var t = this;
		var l = t.length - 1;
		return l > 18 && l < 30 && t.charCodeAt(l) === 90 && t.charCodeAt(10) === 84 && t.charCodeAt(4) === 45 && t.charCodeAt(13) === 58 && t.charCodeAt(16) === 58;
	};

	SP.parseExpire = function() {

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

	SP.removeTags = function() {
		return this.replace(/<\/?[^>]+(>|$)/g, '');
	};

	SP.toASCII = function() {
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

	SP.toSearch = function() {

		var str = this.replace(REGSEARCH, '').trim().toLowerCase().toASCII();
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

	SP.slug = function(max) {
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
		var val = str.match(MR.int);
		if (!val)
			return def || 0;
		val = +val[0];
		return isNaN(val) ? def || 0 : val;
	};

	SP.parseFloat = function(def) {
		var str = this.trim();
		var val = str.match(MR.float);
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
		for (var i = 0; i < self.length; i++) {
			if (typeof(self[i]) === TYPE_S)
				self[i] = self[i].trim();
			if (empty || self[i])
				output.push(self[i]);
		}
		return output;
	};

	AP.findIndex = function(cb, value) {

		var self = this;
		var isFN = typeof(cb) === TYPE_FN;
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

	AP.findAll = function(cb, value) {

		var self = this;
		var isFN = typeof(cb) === TYPE_FN;
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

	AP.findItem = function(cb, value) {
		var index = this.findIndex(cb, value);
		if (index !== -1)
			return this[index];
	};

	AP.findValue = function(cb, value, path, def, cache) {

		if (typeof(cb) === TYPE_FN) {
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

	AP.remove = function(cb, value) {

		var self = this;
		var arr = [];
		var isFN = typeof(cb) === TYPE_FN;
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

	DP.toNumber = function(format) {
		return +this.format(format || 'yyyyMMdd');
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

		if (typeof(value) === TYPE_S)
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
		var dt = this.getTime() + this.getTimezoneOffset() * 60000;
		return ticks ? dt : new Date(dt);
	};

	DP.format = function(format, utc) {

		var self = (utc || MD.dateformatutc) ? this.toUTC() : this;

		if (format == null)
			format = MD.dateformat;

		if (!format || format === 'iso')
			return self.getFullYear() + '-' + ((self.getMonth() + 1) + '').padLeft(2, '0') + '-' + (self.getDate() + '').padLeft(2, '0') + 'T' + (self.getHours() + '').padLeft(2, '0') + ':' + (self.getMinutes() + '').padLeft(2, '0') + ':' + (self.getSeconds() + '').padLeft(2, '0') + '.' + (self.getMilliseconds() + '').padLeft(3, '0') + 'Z';

		var key = 'dt_' + format;

		if (statics[key])
			return statics[key](self);

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

		format = format.replace(MR.date, function(key) {
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
					return beg + (half ? 'W.$jcdatempam(d.getHours()).padLeft(2, \'0\')' : 'd.getHours().padLeft(2, \'0\')') + end;
				case 'H':
				case 'h':
					return beg + (half ? 'W.$jcdatempam(d.getHours())' : 'd.getHours()') + end;
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

		statics[key] = new Function('d', before.join('\n') + 'return \'' + format + '\';');
		return statics[key](self);
	};

	W.$jcdatempam = function(value) {
		return value >= 12 ? value - 12 : value;
	};

	NP.between = function(condition, otherwise) {

		var keys = Object.keys(condition);
		var val = this;

		for (var i = 0; i < keys.length; i++) {

			var key = keys[i];
			var arr = key.split('-');

			var a = arr[0] ? +arr[0] : null;
			var b = arr[1] ? +arr[1] : null;

			if (a != null && b !== null) {
				if (val >= a && val <= b)
					return condition[key];
			} else if (a != null) {
				if (val >= a)
					return condition[key];
			} else if (b != null)
				if (val <= b)
					return condition[key];
		}

		return otherwise;
	};

	NP.pluralize = function(zero, one, few, other) {

		if (!one && typeof(zero) === TYPE_S) {
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

		return value.indexOf('#') === -1 ? value : value.replace(MR.pluralize, function(text) {
			return text === '##' ? num.format() : (num + '');
		});

	};

	NP.currency = function(currency, a, b, c) {
		if (currency == null)
			currency = MD.currency || '';
		if (currency.charAt(0) === '[')
			currency = currency.env();
		var curr = MD.currencies[currency];
		return curr ? curr(this, a, b, c) : this.format(2);
	};

	NP.format = function(decimals, separator, separatorDecimal) {

		var self = this;
		var num = self + '';
		var dec = '';
		var output = '';
		var minus = num.charAt(0) === '-' ? '-' : '';
		if (minus)
			num = num.substring(1);

		var index = num.indexOf('.');

		if (typeof(decimals) === TYPE_S) {
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

	SP.SCOPE = function(element) {
		var t = this;
		if (t.indexOf('?') === -1 || element == null)
			return t;
		if (element instanceof COM)
			return element.scope ? element.scope.makepath(t) : element.scopepath(t);
		else if (element instanceof Plugin)
			return t.replace(REGSCOPEINLINE, element.name);
		else if (element instanceof jQuery || element.nodeName) {
			var tmp = $(element).scope();
			return tmp ? tmp.makepath(t) : t;
		}
		return element.makepath ? element.makepath(t) : t;
	};

	SP.padLeft = function(t, e) {
		var r = this + '';
		return Array(Math.max(0, t - r.length + 1)).join(e || ' ') + r;
	};

	SP.padRight = function(t, e) {
		var r = this + '';
		return r + Array(Math.max(0, t - r.length + 1)).join(e || ' ');
	};

	NP.padLeft = function(t, e) {
		return (this + '').padLeft(t, e || '0');
	};

	NP.padRight = function(t, e) {
		return (this + '').padRight(t, e || '0');
	};

	NP.add = NP.inc = function(value, decimals) {

		var self = this;

		if (value == null)
			return self;

		if (typeof(value) === TYPE_N)
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

	NP.round = function(decimals) {
		if (decimals == null)
			decimals = 0;
		return +(Math.round(this + 'e+' + decimals) + 'e-' + decimals);
	};

	SP.format = function() {
		var arg = arguments;
		return this.replace(MR.format, function(text) {
			var value = arg[+text.substring(1, text.length - 1)];
			return value == null ? '' : value instanceof Array ? value.join('') : value;
		});
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
			var ampm = val.match(REG_TIME);
			if (ampm && ampm[0].toLowerCase() === 'pm')
				h += 12;
		}

		var y = (dt.y || dt.Y) || 0;

		if (y < 100)
			y += 2000;

		return new Date(y, (dt.M || 1) - 1, dt.d || dt.D || 0, h || 0, dt.m || 0, dt.s || 0);
	}

	SP.parseDate = function(format) {

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

	AP.last = function(def) {
		var item = this[this.length - 1];
		return item === undefined ? def : item;
	};

	function sortcomparer(sort) {

		var key = 'sort_' + sort;
		var meta = temp[key];

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
			temp[key] = meta;
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
						case TYPE_S:
							col.type = 1;
							break;
						case TYPE_N:
							col.type = 2;
							break;
						case TYPE_B:
							col.type = 3;
							break;
						case TYPE_O:
							col.type = 5;
							break;
					}
				}

				if (col.type) {
					switch (col.type) {
						case 1:
							tmp = col.desc ? LCOMPARER_DESC(va, vb) : LCOMPARER(va, vb);
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

	AP.quicksort = function(sort) {

		var self = this;
		if (self.length < 2)
			return self;

		var self = this;

		// Backward compatibility
		if (!sort || sort === true) {
			self.sort(LCOMPARER);
			return self;
		}

		// Backward compatibility
		if (sort === false) {
			self.sort(LCOMPARER_DESC);
			return self;
		}

		var args = arguments;
		if (args[1] === false || args[1] === 'desc' || args[1] === 2)
			sort += '_desc';

		self.sort(sortcomparer(sort));
		return self;
	};

	AP.attr = function(name, value) {

		var self = this;

		if (arguments.length === 2) {
			if (value == null)
				return self;
		} else if (value === undefined)
			value = name + '';

		self.push(name + '="' + ((value + '').env() + '').replace(/[<>&"]/g, function(c) {
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

	function reconfigure_components() {
		for (var i = 0; i < M.components.length; i++) {
			var com = M.components[i];
			// reconfigure
			if (!com.removed && !com.$removed && com.$configdisplay && com.$ready) {
				var obj = {};
				for (var key in com.$configdisplay)
					obj[key] = com.$configdisplay[key].cache;
				com.reconfigure(obj);
			}
		}
	}

	// Waits for jQuery
	WAIT(function() {
		return !!W.jQuery;
	}, function() {

		// Fixed IE <button tags
		W.isIE && $W.on('keydown', function(e) {
			if (e.keyCode === 13) {
				var n = e.target.tagName;
				if (n === 'BUTTON' || n === 'INPUT' || n === 'SELECT')
					e.preventDefault();
			}
		});

		$.fn.multiple = function(selector) {
			var tmp = {};
			for (var key in selector)
				tmp[key] = this.find(selector[key]);
			return tmp;
		};

		$.fn.FIND = function(selector, many, callback, timeout) {

			if (typeof(many) === TYPE_FN) {
				timeout = callback;
				callback = many;
				many = undefined;
			}

			var self = this;
			var output = findcomponent(self, selector);

			if (typeof(callback) === TYPE_FN) {

				if (output.length) {
					var val = many ? output : output[0];
					callback.call(val, val);
					return self;
				}

				WAIT(function() {
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

		var com_exec = function(com, name, arg) {
			if (com instanceof Array) {
				for (var i = 0; i < com.length; i++) {
					var ci = com[i];
					if (ci[name])
						ci[name].apply(ci, arg);
				}
			} else if (com[name])
				com[name].apply(com, arg);
		};

		$.fn.EMIT = function(name, a, b, c, d) {
			var is = name.charAt(0) === '^';
			if (is)
				name = name.substring(1).trim();
			return this.EXEC((is ? '^' : '') + 'emit', name, a, b, c, d);
		};

		$.fn.EXEC = function(name) {

			var self = this;
			var arg = [];
			var parent = name.charAt(0) === '^';
			if (parent)
				name = name.substring(1).trim();

			for (var i = 1; i < arguments.length; i++)
				arg.push(arguments[i]);

			for (var j = 0; j < self.length; j++) {
				var el = self[j];
				if (parent) {
					while (true) {
						el = el.parentNode;
						if (el == null || el.tagName === 'HTML')
							break;
						el.$com && com_exec(el.$com, name, arg);
					}
				} else {
					// childs
					var fn = function(el) {
						for (var i = 0; i < el.children.length; i++) {
							var cur = el.children[i];
							cur.$com && cur.getAttribute(ATTRJCBIND) == null && com_exec(cur.$com, name, arg);
							if (cur.children && cur.children.length)
								fn(cur);
						}
					};
					fn(el);
				}
			}

			return self;
		};

		$.fn.CMD = function(name, a, b, c, d, e) {
			var self = this;
			var arr = self.FIND('*', true);
			events.cmd && EMIT('cmd', a, b, c, d);
			DEF.monitor && monitor_method('cmd');
			for (var i = 0; i < arr.length; i++) {
				var o = arr[i];
				var cmd = o.$commands ? o.$commands[name] : null;
				if (cmd && cmd.length) {
					for (var j = 0; j < cmd.length; j++)
						cmd[j](a, b, c, d, e);
				}
			}
		};

		$.fn.SETTER = function(selector, name) {

			var self = this;
			var arg = [];
			var beg = selector === true ? 3 : 2;
			var methodname;
			var myselector;
			var isget;
			var tmp;
			var cl;
			var lazy;

			for (var i = beg; i < arguments.length; i++)
				arg.push(arguments[i]);

			if (beg === 3) {

				if (name.indexOf(' #') !== -1) {
					tmp = makecl(name);
					cl = tmp.cl;
					name = tmp.path;
				}

				myselector = makeandexecflags(name);
				tmp = myselector.indexOf('/');

				if (tmp !== -1) {
					arg.unshift(arguments[2]);
					methodname = myselector.substring(tmp + 1);
					myselector = myselector.substring(0, tmp);
				} else
					methodname = arguments[2];

				tmp = myselector;
				if (tmp.charAt(0) === '^')
					myselector = myselector.substring(1).trim();

				lazy = lazycom[myselector];
				if (lazy && lazy.state !== 3) {
					if (lazy.state === 1) {
						lazy.state = 2;
						events.lazy && EMIT('lazy', myselector, true);
						DEF.monitor && monitor_method('lazy', 2);
						warn('Lazy load: ' + myselector);
						if (lazy.nodes && lazy.nodes.length) {
							for (var m of lazy.nodes)
								htmlcomponentparse2(m);
							delete lazy.nodes;
						}
						compile();
					}

					setTimeout(function(arg) {
						CL(cl, () => $.fn.SETTER.apply(self, arg));
					}, 555, arguments);

					return self;
				}

				isget = methodname.indexOf('.') !== -1;

				CL(cl, function() {
					self.FIND(tmp, true, function(arr) {
						events.setter && EMIT('setter', tmp, methodname, arg[0], arg[1]);
						for (var i = 0; i < arr.length; i++) {
							var o = arr[i];
							var a = isget ? get(methodname, o) : o[methodname];
							if (typeof(a) === TYPE_FN)
								a.apply(o, arg);
						}
					});
				});

			} else {

				if (selector.indexOf(' #') !== -1) {
					tmp = makecl(selector);
					cl = tmp.cl;
					selector = tmp.path;
				}

				myselector = makeandexecflags(selector);
				methodname = name;
				tmp = myselector.indexOf('/');

				if (tmp !== -1) {
					arg.unshift(arguments[1]);
					methodname = myselector.substring(tmp + 1);
					myselector = myselector.substring(0, tmp);
				}

				tmp = myselector;
				if (tmp.charAt(0) === '^')
					myselector = myselector.substring(1).trim();

				lazy = lazycom[myselector];
				if (lazy && lazy.state !== 3) {
					if (lazy.state === 1) {
						lazy.state = 2;
						events.lazy && EMIT('lazy', myselector, true);
						DEF.monitor && monitor_method('lazy', 2);
						warn('Lazy load: ' + myselector);
						if (lazy.nodes && lazy.nodes.length) {
							for (var m of lazy.nodes)
								htmlcomponentparse2(m);
							delete lazy.nodes;
						}
						compile();
					}

					setTimeout(function(arg) {
						CL(cl, () => $.fn.SETTER.apply(self, arg));
					}, 555, arguments);

					return self;
				}

				var arr = self.FIND(tmp, true);
				isget = methodname.indexOf('.') !== -1;

				CL(cl, function() {
					events.setter && EMIT('setter', tmp, methodname, arg[0], arg[1]);
					for (var i = 0; i < arr.length; i++) {
						var o = arr[i];
						var a = isget ? get(methodname, o) : o[methodname];
						if (typeof(a) === TYPE_FN)
							a.apply(o, arg);
					}
				});
			}

			return self;
		};

		$.fn.RECONFIGURE = function(selector, value) {
			return this.SETTER(selector, 'reconfigure', value);
		};

		$.fn.plugin = $.fn.scope = function() {
			var el = this;
			return el.length ? findscope(el[0]) : null;
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

		$.fn.aclass = function(a, timeout) {
			var self = this;
			if (timeout && self.length) {
				self[0].$ct && clearTimeout(self[0].$ct);
				self[0].$ct = setTimeout(classtimeout, timeout, self, a, 1);
			}
			return timeout ? self : self.addClass(a);
		};

		$.fn.rclass = function(a, timeout) {
			var self = this;
			if (timeout && self.length) {
				self[0].$ct && clearTimeout(self[0].$ct);
				self[0].$ct = setTimeout(classtimeout, timeout, self, a, 2);
			}
			return timeout ? self : a == null ? self.removeClass() : self.removeClass(a);
		};

		$.fn.rattr = function(a) {
			return this.removeAttr(a);
		};

		$.fn.rattrd = function() {
			for (var i = 0; i < arguments.length; i++)
				this.removeAttr(T_DATA + arguments[i]);
			return this;
		};

		$.fn.rclass2 = function(a, timeout) {

			var self = this;

			if (timeout) {
				if (self.length) {
					self[0].$ct && clearTimeout(self[0].$ct);
					self[0].$ct = setTimeout(classtimeout, timeout, self, a, 3);
				}
				return self;
			}

			var arr = (self.attr(T_CLASS) || '').split(' ');
			var isReg = typeof(a) === TYPE_O;

			for (var i = 0; i < arr.length; i++) {
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
			a = T_DATA + a;
			return v == null ? this.attr(a) : this.attr(a, v);
		};

		$.fn.attrd2 = function(a) {

			a = T_DATA + a;

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

		// Appends an SVG element
		$.fn.asvg = function(tag) {

			if (tag.indexOf('<') === -1) {
				var el = D.createElementNS('http://www.w3.org/2000/svg', tag);
				this.append(el);
				return $(el);
			}

			var d = D.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = D.createDocumentFragment();
			while (d.firstChild.firstChild)
				f.appendChild(d.firstChild.firstChild);
			f = $(f);
			this.append(f);
			return f;
		};

		$.fn.psvg = function(tag) {

			if (tag.indexOf('<') === -1) {
				var el = D.createElementNS('http://www.w3.org/2000/svg', tag);
				this.prepend(el);
				return $(el);
			}

			var d = D.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = D.createDocumentFragment();
			while (d.firstChild.firstChild)
				f.appendChild(d.firstChild.firstChild);
			f = $(f);
			this.prepend(f);
			return f;
		};

		function findinstance(t, type) {

			if (!t.length)
				return null;

			for (var i = 0; i < t.length; i++) {
				if (t[i][type])
					return t[i][type];
			}

			var el = t[0].parentElement;
			while (el !== null) {
				if (el[type])
					return el[type];
				el = el.parentElement;
			}

			return null;
		}

		$.fn.binder = function() {
			return findinstance(this, '$jcbind');
		};

		$.fn.vbind = function() {
			return findinstance(this, '$vbind');
		};

		$.fn.vbindarray = function() {
			return findinstance(this, '$' + T_VBINDARR);
		};

		$.fn.component = function() {
			return findinstance(this, '$com');
		};

		$.fn.components = function(fn) {
			var all = this.find(ATTRCOM);
			var output = null;
			for (var i = 0; i < all.length; i++) {
				var com = all[i].$com;
				if (com) {
					var isarr = com instanceof Array;
					if (isarr) {
						for (var j = 0; j < com.length; j++) {
							var o = com[j];
							if (o && o.$ready && !o.$removed) {
								if (fn) {
									fn.call(o, i);
								} else {
									if (!output)
										output = [];
									output.push(o);
								}
							}
						}
					} else if (com && com.$ready && !com.$removed) {
						if (fn) {
							fn.call(com, i);
						} else {
							if (!output)
								output = [];
							output.push(com);
						}
					}
				}
			}
			return fn ? all : output;
		};

		$.components = M;

		setInterval(function() {

			knockknockcounter++;
			W.NOW = new Date();

			EMIT('service', knockknockcounter);
			EMIT('knockknock', knockknockcounter);

			for (var a of M.components)
				a.service && a.service(knockknockcounter);

			for (var a of M.binders) {
				var arr = a.$macros;
				if (arr) {
					for (var m of arr)
						m.service && m.service(knockknockcounter);
				}
			}

			for (var key in M.cl) {
				var cl = M.cl[key];
				if (cl.expire && cl.date) {
					if (cl.date <= NOW.add('-' + cl.expire)) {
						cl.reload = true;
						cl.date = null;
					}
				}
			}

			if (knockknockcounter % 5 === 0) {
				paths = {};
				W.TEMP = {};
			}

			if (knockknockcounter % 3 === 0)
				cleaner();

			temp = {};

		}, 60000);

		var displaymodeprev;

		function displaymode() {
			var d = WIDTH();
			if (D.body) {
				if (d !== displaymodeprev) {
					displaymodeprev = d;
					var b = $(D.body);
					b.rclass('jc-lg jc-md jc-sm jc-xs');
					b.aclass('jc-' + d);
				}
			} else
				setTimeout(displaymode, 50);
		}

		var windowresizeinterval;
		var windowresizetimeout;
		var windowresized = false;
		var windowsize;
		var windowwh = {};

		function resize_noscrollbar() {

			windowresizeinterval = null;

			var d = WIDTH();
			if (!d) {
				setTimeout(resize_noscrollbar, 50);
				return;
			}

			if (WW === windowwh.w && WH === windowwh.h)
				return;

			windowwh.w = WW;
			windowwh.h = WH;

			displaymode();

			if (windowresized) {
				if (windowsize !== d) {
					windowsize = d;
					reconfigure_components();
				}
			} else {
				windowsize = d;
				windowresized = true;
			}

			events.resize2 && EMIT('resize2');
		}

		function resize() {

			var w = $W;

			W.WW = w.width();
			W.WH = w.height();

			if (!W.WH || !W.WH) {
				windowresizetimeout && clearTimeout(windowresizetimeout);
				windowresizetimeout = setTimeout(resize, 10);
				return;
			}

			windowresizetimeout = null;
			windowresizeinterval && clearTimeout(windowresizeinterval);
			windowresizeinterval = setTimeout(resize_noscrollbar, 300);
		}

		function viewportheight() {
			if (screen.orientation) {
				var viewport = document.querySelector('meta[name=viewport]');
				if (viewport && viewport.content && viewport.content.indexOf('height') === -1)
					viewport.setAttribute('content', viewport.content + ', height=' + W.innerHeight);
			}
		}

		function parseUA() {
			var arr = ua.match(/[a-z]+/gi);
			if (arr) {
				var data = {};
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

			var keys = OK(data);
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
			M.ua = output;
		}

		parseUA();

		W.addEventListener('load', viewportheight);

		if (M.ua.device === 'mobile' || M.ua.browser !== 'Firefox')
			W.addEventListener('deviceorientation', viewportheight, true);

		resize();

		$W.on(T_RESIZE, resize);
		$W.on('visibilitychange', function() {
			W.EMIT('visible', !document.hidden);
		});

		$(D).ready(function() {

			if (!M.$components.exec) {
				(function() {
					var timeout = null;
					var el = $(document.body);
					var fn = function(plus, forceprevent) {
						return function execlick(e) {

							if (M.$components.exec)
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

							if (attr) {
								if (attr.includes('?')) {
									var scope = el.scope();
									if (scope)
										attr = scope.makepath(attr);
								}
								EXEC(attr, el, e);
							}
							href && REDIRECT(href);
						};
					};
					el.on('contextmenu', '.exec3', fn('3', true));
					el.on('dblclick', '.exec2', fn('2'));
					el.on('click', '.exec', fn(''));
				})();
			}

			var body = $(D.body);

			body.aclass('jc-' + (M.version >> 0));

			if (isPRIVATEMODE)
				body.aclass('jc-nostorage');

			if (isTOUCH)
				body.aclass('jc-touch');

			if (isSTANDALONE)
				body.aclass('jc-standalone');

			var pua = M.ua;
			pua.browser && body.aclass('jc-' + pua.browser.toLowerCase());
			pua.os && body.aclass('jc-' + pua.os.toLowerCase());
			pua.device && body.aclass('jc-' + pua.device.toLowerCase());

			displaymode();

			var cd = (function () {
				var cookies = navigator.cookieEnabled;
				if (!cookies) {
					D.cookie = ATTRDATA;
					cookies = D.cookie.indexOf(ATTRDATA) != -1;
				}
				return cookies;
			})();

			if (!cd)
				body.aclass('jc-nocookies');

			if ($ready) {
				clearTimeout($ready);
				$ready = null;
				load();
			}

			var SELECTOR = 'input[' + ATTRJCBIND + '],textarea[' + ATTRJCBIND + '],select[' + ATTRJCBIND + ']';

			$(D).on('input', 'input[' + ATTRJCBIND + '],textarea[' + ATTRJCBIND + ']', function() {

				// realtime binding
				var self = this;
				var com = self.$com;

				if (!com || com.$removed || !com.getter || self.$jckeypress === false)
					return;

				self.$jcevent = 2;

				if (self.$jckeypress === undefined) {
					var tmp = attrcom(self, 'keypress');
					if (tmp)
						self.$jckeypress = tmp === T_TRUE;
					else if (com.config.$realtime != null)
						self.$jckeypress = com.config.$realtime === true;
					else if (com.config.$binding)
						self.$jckeypress = com.config.$binding === 1;
					else
						self.$jckeypress = MD.keypress;
					if (self.$jckeypress === false)
						return;
				}

				if (self.$jcdelay === undefined)
					self.$jcdelay = +(attrcom(self, 'keypress-delay') || com.config.$delay || MD.delaykeypress);

				if (self.$jconly === undefined)
					self.$jconly = attrcom(self, 'keypress-only') === T_TRUE || com.config.$binding === 2;

				self.$jctimeout && clearTimeout(self.$jctimeout);
				self.$jctimeout = setTimeout(keypressdelay, self.$jcdelay, self);
			}).on('focus blur', SELECTOR, function(e) {

				var self = this;
				var com = self.$com;

				if (e.type === 'focusin' && !com && !self.$jccheck) {
					// try to find
					var elcom = $(self).closest(ATTRCOM);
					if (elcom)
						self.$com = self.uicomponent = elcom[0].$com;
				}

				if (!com || com.$removed || !com.getter)
					return;

				if (e.type === 'focusin')
					self.$jcevent = 1;
				else if (self.$jcevent === 1) {
					com.config.touched = true;
					com.getter(self.value, 3);
				} else if (self.$jcskip) {
					self.$jcskip = false;
				} else {
					// formatter
					var tmp = com.$skip;
					if (tmp)
						com.$skip = false;
					var val = com.get();
					MD.monitor && monitor(com);
					com.setter(val, com.path, 2);
					com.setter2 && com.setter2(val, com.path, 2);
					if (tmp)
						com.$skip = tmp;
				}
			}).on('change', SELECTOR, function() {

				var self = this;
				var com = self.$com;

				if (self.$jconly || !com || com.$removed || !com.getter)
					return;

				if (self.$jckeypress === false) {
					// bind + validate
					self.$jcskip = true;
					com.getter(self.value, false);
					return;
				}

				switch (self.tagName) {
					case 'SELECT':
						var sel = self[self.selectedIndex];
						self.$jcevent = 2;
						com.config.touched = true;
						com.getter(sel.value, false);
						return;
					case 'INPUT':
						if (self.type === 'checkbox' || self.type === 'radio') {
							self.$jcevent = 2;
							com.config.touched = true;
							com.getter(self.checked, false);
							return;
						}
						break;
				}

				if (self.$jctimeout) {
					com.config.touched = true;
					com.getter(self.value, true);
					clearTimeout(self.$jctimeout);
					self.$jctimeout = 0;
				} else {
					self.$jcskip = true;
					com.setter && com.setterX(com.get(), self.path, 2);
				}
			});

			setTimeout(W.PREF.load, 2, prefload);
			$domready = true;
		});
	}, 50);

	function keypressdelay(self) {
		var com = self.$com;
		// Reset timeout
		self.$jctimeout = 0;
		com.config.touched = true;
		com.getter(self.value, true);
	}

	M.$parser.push(function(path, value, type) {
		switch (type) {
			case TYPE_N:
			case 'currency':
			case 'float':

				var t = typeof(value);
				var v = null;

				if (t == TYPE_S) {
					switch (MD.thousandsseparator) {
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

					if (MD.decimalseparator === ',')
						value = value.replace(REGCOMMA, '.');

					if (value)
						v = +value;
					else
						return null;

				} else if (t === TYPE_N)
					v = value;
				else
					return null;

				return isNaN(v) ? null : v;

			case TYPE_B:
			case 'bool':
				return value == null ? null : value === true || typeof(value) == TYPE_S ? (value == '1' || value == T_TRUE || value == 'on') : !!value;

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

	function binderbind(path, absolutepath, ticks, type) {
		var arr = binders[path];
		console.log('binderbind', path, arr);
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			if (!item.disabled && item.ticks !== ticks) {
				item.ticks = ticks;
				var curr_scope = current_scope;
				item.exec(GET(item.path), absolutepath, null, null, null, type);
				current_scope = curr_scope;
			}
		}
	}

	var $rebinder;
	var $reimport;

	function rebindbinderexec() {
		var arr = bindersnew.splice(0);
		var n = 'binder';
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			if (!item.$init) {
				var curr_scope = current_scope;
				if (item.com)
					item.exec(item.com.data(item.path), item.path);
				else
					item.exec(GET(item.path), item.path);
				current_scope = curr_scope;
				events[n] && EMIT(n, item);
			}
		}
	}

	function rebindbinder() {
		$rebinder && clearTimeout($rebinder);
		$rebinder = setTimeout(rebindbinderexec, 15);
	}

	function reimport() {
		$reimport && clearTimeout($reimport);
		$reimport = setTimeout(download, 15);
	}

	function rebinddecode(val) {
		return val.replace(/&#39;/g, '\'');
	}

	function parsebinderskip(str) {
		var a = arguments;
		str = str.split(' ')[0].trim().replace(REGBINDERCOMPARE, '');
		for (var i = 1; i < a.length; i++) {
			if (str === a[i])
				return false;
		}
		return true;
	}

	function parsebinder(el, b, r) {

		var meta = b.split(REGMETA);
		if (meta.indexOf('|') !== -1) {
			if (!r) {
				var tmp = [];
				var output = [];
				for (var i = 0; i < meta.length; i++) {
					var m = meta[i];
					if (m === '|') {
						tmp.length && output.push(parsebinder(el, tmp.join('__')));
						tmp = [];
						continue;
					}
					m && tmp.push(m);
				}
				tmp.length && output.push(parsebinder(el, tmp.join('__'), true));
			}
			return output;
		}

		var ne = el.getAttribute('element');
		if (ne) {
			el = $(ne)[0];
		} else {
			ne = el.getAttribute('child');
			var pe = el.getAttribute('parent');
			if (pe)
				el = $(el).closest(pe)[0];
			if (ne && el)
				el = $(el).find(ne)[0];
		}

		if (!el)
			return;

		var path = null;
		var index = null;
		var obj = new jBinder();
		var cls = [];
		var sub = {};
		var e = obj.el = $(el);
		var isclick = false;
		var isnew = el.tagName === 'UI-BIND';
		var isnewdefselector = 'ui-component,input,textarea,select,button';
		var isscope = false;
		var tmp;

		DEF.monitor && monitor_method('binders', 1);

		for (var i = 0; i < meta.length; i++) {

			var item = TRANSLATE(meta[i].trim());
			if (item) {
				if (i) {

					var k, v = '';

					if (item !== T_TEMPLATE && item !== ('!' + T_TEMPLATE) && item !== 'strict' && item !== T_VBINDARR && item !== ('!' + T_VBINDARR)) {

						// template with nested selector
						index = item.indexOf(T_TEMPLATE);
						tmp = index === 0 || index === 1; // "template" or "!template"
						index = item.indexOf(':');
						if (index === -1) {
							index = item.length;
							if (!tmp)
								item += ':value';
						}

						k = item.substring(0, index).trim();
						v = item.substring(index + 1).trim();

					} else
						k = item;

					if (k === 'selector') {
						obj[k] = v;
						continue;
					}

					if (k === 'helpers') {
						if (v.indexOf('?') !== -1) {
							var scope = findscope(el);
							if (scope)
								v = scope.makepath(v);
						}
						(function(obj, k, v) {
							obj[k] = function() {
								var val = GET(v);
								return typeof(val) === TYPE_FN ? val() : val;
							};
						})(obj, k, v);
						continue;
					}

					if (k === 'assign') {
						if (v.indexOf('?') !== -1) {
							var scope = findscope(el);
							if (scope)
								v = scope.makepath(v);
						}
						SET(v, $(el));
						continue;
					}

					var rki = k.indexOf(' ');
					var rk = rki === -1 ? k : k.substring(0, rki);
					var c = v.charAt(0);
					var vmethod = k !== T_TEMPLATE ? c === '.' ? 1 : c === '@' ? 2 : 0 : 0;
					var smethod = v.indexOf('?') !== -1;
					var dfn;

					if (vmethod) {
						v = v.substring(1);
						dfn = (function(v, type) {
							return function(value, path, el) {
								var fn;
								if (type === 1) {
									var vb = el.vbindarray() || el.vbind();
									fn = vb && vb[v];
								} else {
									var com = el.component();
									fn = com && com[v];
								}
								if (fn)
									return fn.call(this, value, path, el);
							};
						})(v, vmethod);
					} else if (smethod) {
						dfn = (function(p) {
							return function(value, path, el) {
								var scope = el.scope();
								if (scope) {
									var fn = GET(scope.makepath(p));
									if (fn)
										return fn.call(el, value, path, el);
								}
							};
						})(v);
					} else if (v.includes('/') && k !== 'check') {
						dfn = (function(p) {
							return function(value, path, el) {
								var fn = GET(p);
								if (fn)
									return fn.call(el, value, path, el);
							};
						})(v);
					}

					if (REGSCOPECHECK.test(v)) {
						isscope = true;
						if (k !== T_CLICK && k !== 'check') {
							var vbeg = v.indexOf('(');
							var vfn = vbeg == -1 ? v : v.substring(0, vbeg);
							var vkey = ATTRDATA + GUID(5);
							v = new Function('value', T_PATH, 'el', 'var fn=el[0].' + vkey + ';if(!fn){var _s=el.scope();if(_s){el[0].' + vkey + '=fn=GET(_s.makepath(\'' + vfn + '\'))}}if(fn)return fn' + (vbeg == -1 ? '(value,path,el)' : v.substring(vbeg)));
						}
					}

					var fn = parsebinderskip(rk, 'setter', 'strict', 'check', 'track', 'tracktype', T_RESIZE, 'delay', 'macro', T_IMPORT, T_CLASS, T_TEMPLATE, T_VBINDARR, 'focus', T_CLICK, 'format', 'helper', 'helpers', 'currency', 'empty', 'changes', 'ready', 'once') && k.substring(0, 3) !== 'def' ? typeof(v) === TYPE_FN ? v : v.indexOf('=>') !== -1 ? FN(rebinddecode(v)) : isValue(v) ? FN('(value,path,el)=>' + rebinddecode(v), true) : v.charAt(0) === '@' ? obj.com[v.substring(1)] : dfn ? dfn : GET(v) : 1;

					if (!fn) {
						WARN('Invalid <ui-bind> command ' + item, el);
						continue;
					}

					var keys = k.split('+');

					for (var j = 0; j < keys.length; j++) {

						k = keys[j].trim();

						var s = ''; // as nested selector
						var notvisible = false;
						var notnull = false;
						var backup = false;

						index = k.indexOf(' ');
						if (index !== -1) {
							s = k.substring(index + 1);
							k = k.substring(0, index);
						}

						k = k.replace(/^(~!|!~|!|~)/, function(text) {
							if (text.indexOf('!') !== -1)
								notnull = true;
							if (text.indexOf('~') !== -1)
								notvisible = true;
							return '';
						});

						var c = k.charAt(0);

						if (k === T_CLASS)
							k = 't' + T_CLASS;

						if (c === '.') {
							if (notnull)
								fn.$nn = 1;
							cls.push({ name: k.substring(1), fn: fn });
							k = T_CLASS;
						}

						if (typeof(fn) === TYPE_FN) {
							if (notnull)
								fn.$nn = 1;
							if (notvisible)
								fn.$nv = 1;
						}

						switch (k) {
							case 'attr':

								index = s.indexOf(' ');

								var tmp = { attr: s, fn: fn };

								if (notnull)
									tmp.$nn = 1;

								if (notvisible)
									tmp.$nv =1;

								if (index === -1) {
									if (!obj[k])
										obj[k] = [];
									obj[k].push(tmp);
									s = '';
								} else {
									tmp.attr = s.substring(0, index);
									s = s.substring(index + 1);
									if (!sub[s])
										sub[s] = {};
									if (!sub[s][k])
										sub[s][k] = [];
									sub[s][k].push(tmp);
								}

								break;
							case 'changes':
							case 'ready':
							case 'once':
								break;
							case 'empty':
								fn = v === T_VALUE ? MD.empty : v;
								break;
							case 'macro':
								fn = v.split(',').trim();
								break;
							case 'check':
							case 'currency':
							case 'focus':
							case T_RESIZE:
								fn = v;
								break;
							case 'format':
								fn = v === 'value' ? '' : (/^\d+$/).test(v) ? (+v) : v;
								break;
							case 'helper':
								tmp = v.indexOf('(');
								if (tmp === -1)
									v += '(value)';
								else
									v = v.substring(0, tmp + 1) + 'value,' + v.substring(tmp + 1);
								fn = FN('(value,path,el)=>Thelpers.' + v);
								if (notnull)
									fn.$nn = 1;
								break;
							case T_CLICK:
								isclick = true;
								fn = v;
								break;
							case 'track':
								obj[k] = v.split(',').trim();
								continue;
							case 'tracktype':
								var tt = v.split(',').trim();
								obj[k] = {};
								for (var l = 0; l < tt.length; l++)
									obj[k][tt[l]] = 1;
								continue;
							case 'strict':
								obj[k] = v ? v : true;
								continue;
							case T_HIDDEN:
								k = 'hide';
								break;
							case 'exec':
								k = 'change';
								break;
							case 'refresh':
								k = 'refreshbind';
								break;
							case T_DISABLED: // internal rewrite because binder contains '.disabled` property
							case 'disable':
								k = 'disable';
								backup = true;
								if (isnew && !obj.selector)
									obj.selector = isnewdefselector;
								break;
							case T_CONFIG:
								if (isnew && !obj.selector)
									obj.selector = 'ui-component';
								break;
							case 'enabled':
							case 'enable':
								k = 'enable';
								backup = true;
								if (isnew && !obj.selector)
									obj.selector = isnewdefselector;
								break;
							case T_VALUE:
								k = 'val';
								backup = true;
								break;
							case T_DEFAULT:
								k = 'def';
								break;
							case 'set':
								if (isnew && !obj.selector)
									obj.selector = 'ui-component';
								break;
							case 'delay':
								fn = +v;
								break;
							case 'href':
							case 'src':
							case 'val':
							case 'title':
							case T_HTML:
							case 'text':
							case T_CHECKED:
								backup = true;
								break;
							case 'setter':
								fn = FN('(value,path,el)=>el.SETTER(' + v + ')');
								if (notnull)
									fn.$nn = 1;
								if (notvisible)
									fn.$nv =1;
								break;
							case T_IMPORT:
								var c = v.charAt(0);
								if ((/^(https|http):\/\//).test(v) || c === '/' || c === '.' || c === '[') {
									if (c === '.')
										fn = v.substring(1);
									else
										fn = v;
								} else
									fn = (v === 'value' || v === 'true') ? 1 : FN(rebinddecode(v));
								break;
							case 'tclass':
								fn = v;
								break;

							case T_VBINDARR:
								var scr = e.find(T_SCRIPT + ',' + T_TEMPLATE).eq(0);
								var r = false;
								if (scr.length)
									r = true;
								else
									scr = e;
								fn = VBINDARRAY(TRANSLATE(scr.html().replace(REGSCR, T_SCRIPT)), e);
								if (notvisible)
									fn.$nv = 1;
								r && scr.remove();
								break;

							case T_TEMPLATE:

								// Only for backward compatibility:
								if (s === T_TRUE || s === T_VALUE)
									s = '';

								var ns = '';
								v = v.replace(/\{.*?\}/g, function(sel) {
									ns = sel.replace(/\{|\}/g, '').trim();
									return '';
								}).trim();

								var et = s ? e.find(s) : e;
								var scr = ns ? $(ns) : et.find(T_SCRIPT + ',' + T_TEMPLATE).eq(0);

								var r = false;
								if (scr.length)
									r = true;
								else
									scr = et;

								tmp = TRANSLATE(scr.html().replace(REGSCR, T_SCRIPT));

								try {
									fn = Tangular.compile(tmp);
								} catch (e) {
									THROWERR(e);
									fn = NOOP;
								}

								if (notnull)
									fn.$nn = 1;
								if (notvisible)
									fn.$nv = 1;

								if (v) {
									var attr = '';
									v = v.replace(/(-)?->.*/, function(text) {
										attr = text.replace(/(-)?->/g, '').trim();
										return '';
									});
									fn.$vdomattr = attr;
								}

								fn.$vdom = v;
								fn.$compile = tmp.COMPILABLE();

								r && !ns && scr.remove();
								break;
							case T_PATH:
								k = 'setpath';
								break;
						}

						if (k === 'def')
							fn = new Function('return ' + v)();

						if (backup && notnull)
							obj[k + 'bk'] = (k == 'src' || k == 'href' || k == 'title') ? e.attr(k) : k == T_HTML ? e.html() : k == 'text' ? e.text() : k == 'val' ? e.val() : k == T_CHECKED ? e.prop(k) : k === 'disable' ? e.prop(T_DISABLED) : k === 'enable' ? (e.prop(T_DISABLED) == false) : '';

						if (s) {

							if (!sub[s])
								sub[s] = {};

							if (k !== T_CLASS && k !== 'attr')
								sub[s][k] = fn;
							else if (cls.length) {
								var p = cls.pop();
								if (sub[s].classes)
									sub[s].classes.push(p);
								else
									sub[s].classes = [p];
							}
						} else {
							if (k !== T_CLASS && k !== 'attr')
								obj[k] = fn;
						}
					}

				} else {

					// path
					path = item;

					var c = path.charAt(0);

					if (c === '!') {
						path = path.substring(1);
						obj.notnull = true;
					}

					if (c === '*')
						path = MD.pathcommon + path.substring(1);

					if (c === '#')
						path = MD.pathcl + path.substring(1);

					if (path === '-')
						path = (attrcom(obj.el) || '').split(REGMETA)[1];

					if (meta.length === 1) {
						var fn = GET(path);
						fn && fn.call(obj.el, obj.el);
						return fn ? fn : null;
					}

					tmp = findformat(path);

					if (tmp) {
						path = tmp.path;
						obj.formatter = tmp.fn;
						obj.formatter.scope = tmp.scope;
					}

					// Is virtual path?
					if (c === '.') {
						obj.virtual = true;
						path = path.substring(1);
						continue;
					}

					if (path.substring(path.length - 1) === '.')
						path = path.substring(0, path.length - 1);

					if (path.charAt(0) === '@') {
						path = path.substring(1);

						var isCtrl = false;
						if (path.charAt(0) === '@') {
							isCtrl = true;
							path = path.substring(1);
						}

						if (!path)
							path = '@';

						var parent = el.parentNode;
						while (parent) {
							if (isCtrl) {
								if (parent.$ctrl) {
									obj.com = parent.$ctrl;
									if (path === '@' && !obj.com.$dataw) {
										obj.com.$dataw = 1;
										obj.com.watch(function(path, value) {
											obj.com.data('@', value);
										});
									}
									break;
								}
							} else {
								if (parent.$com) {
									obj.com = parent.$com;
									break;
								}
							}
							parent = parent.parentNode;
						}

						if (!obj.com)
							return null;
					}
				}
			}
		}

		for (var key in sub) {
			if (!obj.child)
				obj.child = [];
			var o = sub[key];
			o.selector = key.charAt(0) === '-' ? ATTRCOM : key;
			obj.child.push(o);
		}

		if (!obj.empty)
			obj.empty = '';

		if (cls.length)
			obj.classes = cls;

		if (obj.virtual) {
			path = pathmaker(path, 0, 1);
		} else {

			var bj = obj.com && path.charAt(0) === '@';
			path = bj ? path : pathmaker(path, 0, 1);

			if (isscope || path.indexOf('?') !== -1 || (obj.formatter && obj.formatter.scope)) {
				var scope = findscope(el);
				if (scope) {
					path = scope.makepath(path);
					obj.scope = scope.path;
					obj.plugin = scope.plugin;
				} else {
					WARN('Missing <ui-plugin>', el);
					return;
				}
			}

			if (obj.check)
				obj.check = obj.check.replace(/\?/, obj.scope);

			var arr = path.split('.');
			var p = '';

			if (obj.com) {
				!obj.com.$data[path] && (obj.com.$data[path] = { value: null, items: [] });
				obj.com.$data[path].items.push(obj);
			} else {
				var skiparr = false;
				var length = arr.length;
				for (var i = 0; i < length; i++) {
					p += (p ? '.' : '') + arr[i];
					var k = i === (length - 1) ? p : ('!' + p);
					if (!skiparr) {
						var index = arr[i].indexOf('[');
						if (index !== -1) {
							var ka = k.substring(0, k.length - (arr[i].length - index));
							if (binders[ka])
								binders[ka].push(obj);
							else
								binders[ka] = [obj];
							skiparr = true;
						}
					}

					if (binders[k])
						binders[k].push(obj);
					else
						binders[k] = [obj];
				}
			}
		}

		obj.path = path == TYPE_NULL ? null : path;

		if (obj.vbindarray)
			obj.vbindarray.path = obj.path;

		if (obj.macro) {
			obj.$macros = [];
			for (var i = 0; i < obj.macro.length; i++) {
				var m = jbind_macro_init(obj, obj.macro[i]);
				m && obj.$macros.push(m);
			}
		}

		if (obj.track) {
			for (var i = 0; i < obj.track.length; i++) {
				var objk = obj.track[i] = path + '.' + obj.track[i];
				if (M.paths[objk])
					M.paths[objk]++;
				else
					M.paths[objk] = 1;
			}
		} else {
			if (M.paths[obj.path])
				M.paths[obj.path]++;
			else
				M.paths[obj.path] = 1;
		}

		if (isclick) {
			var fn = function(click) {
				return function(e) {

					var t = this;

					if ((t.tagName === 'INPUT' || t.tagName === 'BUTTON') && t.disabled)
						return;

					var el = $(t);
					var scope = el.scope();
					var fn;

					click = scope ? scope.makepath(click) : click;

					if (click.charAt(0) === '@') {
						click = click.substring(1);
						var com = el.component();
						fn = com ? com[click] : null;
					} else
						fn = GET(click);

					if (fn) {

						var val;
						if (obj.virtual) {
							var tmp = obj.el.vbind();
							val = tmp ? tmp.get(obj.path) : null;
						} else
							val = obj.path ? GET(obj.path) : null;

						var index = click.indexOf('/');
						if (index !== -1)
							current_scope = click.substring(0, index);
						else if (scope)
							current_scope = scope.path;

						fn(el, e, val, obj.path);
					}

				};
			};

			obj.click && obj.el.on(T_CLICK, fn(obj.click));
			var child = obj.child;
			if (child) {
				for (var i = 0; i < child.length; i++)
					child[i].click && obj.el.on(T_CLICK, child[i].selector, fn(child[i].click));
			}
		}

		if (obj.child) {
			for (var i = 0; i < obj.child.length; i++) {
				var child = obj.child[i];
				if (child.format == null)
					child.format = obj.format;
				if (child.empty == null)
					child.empty = obj.empty;
			}
		}

		obj.$init = 0;

		if (!obj.virtual) {
			var tmp = obj.el.filter(ATTRCOM);
			if (obj.ready && !tmp.length)
				tmp = obj.el.find(ATTRCOM);
			if (tmp.length) {
				obj.wcom = [];
				for (var i = 0; i < tmp.length; i++)
					obj.wcom.push(tmp[i]);

			}
			M.binders.push(obj);
			bindersnew.push(obj);
		}

		return obj;
	}

	function jBinder() {}

	var JBP = jBinder.prototype;

	JBP.refresh = function() {
		var t = this;
		var curr_scope = current_scope;
		t.exec(GET(t.path), t.path);
		current_scope = curr_scope;
	};

	function jbind_focus(item) {
		autofocus(item.el, item.focus);
	}

	function jbind_resize(el) {
		el.SETTER('*', T_RESIZE);
	}

	function jbind_macro_init(item, name) {
		var macro = M.macros[name];
		if (macro)
			return new Macro(name, item);
	}

	function jbind_macro(el, item, value, path, type) {
		for (var i = 0; i < item.$macros.length; i++) {
			var m = item.$macros[i];
			m.setter && m.setter(value, path, type);
		}
	}

	function jbind_delay(obj, value, path, index, can, type) {
		obj.$delay = null;
		var curr_scope = current_scope;
		obj.exec(value, path, index, true, can, type);
		current_scope = curr_scope;
	}

	function jbind_com(obj, value, path, index, can, type) {
		var curr_scope = current_scope;
		delete obj.wcomrunning;
		obj.exec(value, path, index, true, can, type);
		current_scope = curr_scope;
	}

	function bindsetterx(el, item, value, path, type, counter) {
		if (el && item.set) {
			var com = el[0].$com;
			if (com && !com.$removed && com.$loaded && !com.path && (com.setter || (com.dom && com.dom.setter))) {
				if (com.$jcbind !== item) {
					com.$jcbind = com.uibind = item;
					if (item.vbind && item.vbind.vbindarray)
						com.$jcbindset = item.vbind.vbindarray.path + '[' + item.vbind.index + '].' + item.path;
					else
						com.$jcbindset = item.vbind ? null : item.path;
					com.$jcbindget = item.path;
				}
				com.setterX(value, path, type);
				if (item.setid) {
					clearTimeout(item.setid);
					delete item.setid;
				}
			} else if (!counter || counter < 30) {
				item.setid && clearTimeout(item.setid);
				item.setid = setTimeout(bindsetterx, 100, el, item, value, path, type, counter || 1);
			}
		}
	}

	JBP.exec = function(value, path, index, wakeup, can, type) {

		var item = this;

		if (item.disabled)
			return;

		MD.monitor && monitor(item);

		var el = item.el;
		if (index != null) {
			if (item.child == null)
				return;
			item = item.child[index];
			if (item == null)
				return;
		}

		if (item.notnull && value == null)
			return;

		if (item.wcom) {
			item.wcomrunning && clearTimeout(item.wcomrunning);
			item.wcomrunning = null;
			for (var i = 0; i < item.wcom.length; i++) {
				var com = item.wcom[i];
				if (com && com.parentNode && (!com.$com || !com.$com.$loaded)) {
					item.wcomrunning = setTimeout(jbind_com, 100, item, value, path, index, can, type);
					return;
				}
			}
			delete item.$running;
			delete item.wcom;
		}

		if (item.selector) {
			if (item.cache)
				el = item.cache;
			else {
				el = el.find(item.selector);
				if (el.length)
					item.cache = el;
			}
		}

		if (!el.length)
			return;

		if (!wakeup && item.delay) {
			item.$delay && clearTimeout(item.$delay);
			item.$delay = setTimeout(jbind_delay, item.delay, item, value, path, index, can, type);
			return;
		}

		if (item.$init) {

			if (item.strict && item.path !== path) {
				if (item.strict !== true || path.length > item.path.length)
					return;
			}

			if (item.track && item.path !== path) {
				var can = false;
				for (var i = 0; i < item.track.length; i++) {
					var t = item.track[i];
					if (t === path || (path.length < t.length && t.substring(0, path.length) === path)) {
						can = true;
						break;
					}
				}
				if (!can)
					return;
			}

			if (item.tracktype && type != null && !item.tracktype[type])
				return;
		}

		if (item.scope)
			current_scope = item.scope;

		if (item.check) {
			var tmpindex = item.check.indexOf('/');
			var fn;
			if (tmpindex === -1) {
				// not method
				if (!GET(item.check))
					return;
			} else {
				// plugin
				var plugin = PLUGINS[item.check.substring(0, tmpindex)];
				if (plugin) {
					fn = plugin[item.check.substring(tmpindex + 1)];
					if (fn && !fn.call(item.el, value, path, item.el))
						return;
				}
			}
		}

		if (item.def && value == null)
			value = item.def;

		if (item.formatter)
			value = item.formatter(value, path, -1, item.formatter.scope ? PLUGINS[item.scope] : null);

		item.init && item.init.call(item.el, value, path, item.el);

		var tmp = null;

		if (item.changes) {
			if (value && typeof(value) === TYPE_O) {
				if (item.track) {
					var values = {};
					for (var i = 0; i < item.track.length; i++) {
						var t = item.track[i].substring(item.path.length + 1);
						values[t] = value[t];
					}
					tmp = HASH(values);
				} else
					tmp = HASH(value);
			} else
				tmp = value;

			if (item.stamp !== tmp || !item.$init)
				item.stamp = tmp;
			else
				return;
		}

		if (item.set) {
			tmp = item.set.call(item.el, value, path, el);
			bindsetterx(el, item, tmp, path, type);
		}

		can = can !== false;

		if (item.show && (value != null || !item.show.$nn)) {
			tmp = !item.show.call(item.el, value, path, item.el);
			el.tclass(T_HIDDEN, tmp);
			if (tmp)
				can = false;
		}

		if (item.hide && (value != null || !item.hide.$nn)) {
			tmp = !!item.hide.call(item.el, value, path, item.el);
			el.tclass(T_HIDDEN, tmp);
			if (tmp)
				can = false;
		}

		if (item.invisible && (value != null || !item.invisible.$nn)) {
			tmp = !!item.invisible.call(item.el, value, path, item.el);
			el.tclass('invisible', tmp);
			if (tmp)
				can = false;
		}

		if (item.visible && (value != null || !item.visible.$nn)) {
			tmp = !item.visible.call(item.el, value, path, item.el);
			el.tclass('invisible', tmp);
			if (tmp)
				can = false;
		}

		if (!item.$init)
			item.$init = 1;

		if (item.classes) {
			for (var i = 0; i < item.classes.length; i++) {
				var cls = item.classes[i];
				if (!cls.fn.$nn || value != null)
					el.tclass(cls.name, !!cls.fn.call(el, value, path, el));
			}
		}

		if (can && item.import) {
			if (typeof(item.import) === TYPE_FN) {
				if (value) {
					!item.$ic && (item.$ic = {});
					!item.$ic[value] && IMPORT('ONCE ' + value, el);
					item.$ic[value] = 1;
				}
			} else if (item.import != 1) {
				IMPORT(item.import, el);
				delete item.import;
			} else {
				var scr = item.el.find(T_SCRIPT + ',' + T_TEMPLATE).eq(0);
				var scrhtml = scr.html();
				scr.replaceWith(scrhtml);
				delete item.import;
				scrhtml.COMPILABLE() && COMPILE();
				scrhtml = null;
			}
		}

		if (item.attr && item.attr.length) {
			for (var i = 0; i < item.attr.length; i++) {
				tmp = item.attr[i];
				if ((can || tmp.$nv) && (value != null || !tmp.$nn))
					el.attr(tmp.attr, tmp.fn.call(el, value, path, item.el || el));
			}
		}

		if (item.config && (can || item.config.$nv)) {
			if (value != null || !item.config.$nn) {
				tmp = item.config.call(el, value, path, el);
				if (tmp) {
					for (var i = 0; i < el.length; i++) {
						var c = el[i].$com;
						if (c && c.$initialized)
							c.reconfigure(tmp);
						else
							binderconfig(el[i], tmp);
					}
				}
			}
		}

		if (item.vbindarray && (can || item.vbindarray.$nv))
			item.vbindarray.set(value);

		if (item.html && (can || item.html.$nv)) {
			if (value != null || !item.html.$nn) {
				tmp = item.html.call(el, value, path, el);
				el.html(bindvalue(tmp, item, T_HTML));
			} else
				el.html(item.empty || item.htmlbk);
		}

		if (item.text && (can || item.text.$nv)) {
			if (value != null || !item.text.$nn) {
				tmp = item.text.call(el, value, path, el);
				el.text(bindvalue(tmp, item, 'text'));
			} else
				el.html(item.empty || item.textbk);
		}

		if (item.val && (can || item.val.$nv)) {
			if (value != null || !item.val.$nn) {
				tmp = item.val.call(el, value, path, el);
				el.val(bindvalue(tmp, item, 'val'));
			} else
				el.val(item.empty || item.valbk);
		}

		if (item.template && (can || item.template.$nv) && (value != null || !item.template.$nn)) {

			DEFMODEL.value = value;
			DEFMODEL.path = path;

			if (item.template.$vdom) {
				var status = DIFFDOM(el, item.template.$vdom, item.template(DEFMODEL, null, item.helpers ? item.helpers() : null), item.template.$vdomattr);
				tmp = !!(status.add || status.upd);
			} else {
				tmp = true;
				try {
					el.html(item.template(DEFMODEL, null, item.helpers ? item.helpers() : null));
				} catch (e) {
					THROWERR(e);
				}
			}

			item.template.$compile && tmp && W.COMPILE(el);
		}

		if (item.disable && (can || item.disable.$nv)) {

			if (value != null || !item.disable.$nn) {
				tmp = !!item.disable.call(el, value, path, el);
				el.prop(T_DISABLED, tmp);
			} else {
				tmp = item.disablebk;
				el.prop(T_DISABLED, tmp == true);
			}

			var conf = T_DISABLED + ':' + (tmp == true ? T_TRUE : T_FALSE);
			for (var i = 0; i < el.length; i++) {
				var c = el[i].$com;
				if (c && c.$initialized)
					c.reconfigure(conf);
				else
					binderconfig(el[i], conf);
			}
		}

		if (item.enable && (can || item.enable.$nv)) {
			if (value != null || !item.enable.$nn) {
				tmp = !item.enable.call(el, value, path, el);
				el.prop(T_DISABLED, tmp);
			} else {
				tmp = item.enablebk == false;
				el.prop(T_DISABLED, tmp);
			}
			var conf = T_DISABLED + ':' + (tmp == true ? T_TRUE : T_FALSE);
			for (var i = 0; i < el.length; i++) {
				var c = el[i].$com;
				if (c && c.$initialized)
					c.reconfigure(conf);
				else
					binderconfig(el[i], conf);
			}
		}

		if (item.required && (can || item.required.$nv)) {
			tmp = !!item.required.call(el, value, path, el);
			var conf = 'required:' + (tmp == true ? T_TRUE : T_FALSE);
			for (var i = 0; i < el.length; i++) {
				var c = el[i].$com;
				if (c && c.$initialized)
					c.reconfigure(conf);
				else
					binderconfig(el[i], conf);
			}
		}

		if (item.checked && (can || item.checked.$nv)) {
			if (value != null || !item.checked.$nn) {
				tmp = !!item.checked.call(el, value, path, el);
				el.prop(T_CHECKED, tmp);
			} else
				el.prop(T_CHECKED, item.checkedbk == true);
		}

		if (item.title && (can || item.title.$nv)) {
			if (value != null || !item.title.$nn) {
				tmp = item.title.call(el, value, path, el);
				el.attr('title', bindvalue(tmp, item, 'title'));
			} else
				el.attr('title', item.empty || item.titlebk);
		}

		if (item.href && (can || item.href.$nv)) {
			if (value != null || !item.href.$nn) {
				tmp = item.href.call(el, value, path, el);
				el.attr('href', bindvalue(tmp, item, 'href'));
			} else
				el.attr(item.empty || item.hrefbk);
		}

		if (item.src && (can || item.src.$nv)) {
			if (value != null || !item.src.$nn) {
				tmp = item.src.call(el, value, path, el);
				el.attr('src', bindvalue(tmp, item, 'src'));
			} else
				el.attr('src', item.empty || item.srcbk);
		}

		if (item.setter && (can || item.setter.$nv) && (value != null || !item.setter.$nn))
			item.setter.call(el, value, path, el);

		if (item.change && (value != null || !item.change.$nn)) {
			// "change" must contain a raw value, not formatted
			item.change.call(el, value, path, el);
		}

		if (can && item.refreshbind && (value != null || !item.refreshbind.$nn))
			item.refreshbind.call(el, value, path, el);

		if (can && item.focus)
			setTimeout(jbind_focus, el.find(item.focus).length ? 100 : 1500, item);

		if (can && item.resize)
			setTimeout(jbind_resize, 100, el);

		item.macro && jbind_macro(el, item, value, path, type);

		if (can && index == null && item.child) {
			var curr_scope = current_scope;
			for (var i = 0; i < item.child.length; i++)
				item.exec(value, path, i, undefined, can);
			current_scope = curr_scope;
		}

		if (item.tclass) {
			el.tclass(item.tclass);
			delete item.tclass;
		}

		if (item.once) {
			var index = M.binders.indexOf(item);
			if (index !== -1) {
				item.el = null;
				item.disabled = true;
				FREE(1000);
			}
		}
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

	function bindvalue(val, item, prop) {
		if (item.helper && (!item.helper.$nn || val != null))
			val = item.helper(val);
		var res = val === '' ? item.empty : val == null ? (item.empty || (prop ? item[prop + 'bk'] : '')) : item.currency ? val.currency(item.currency) : item.format != null ? val.format(val instanceof Date ? item.format ? item.format : null : item.format || 0) : val;
		return res == null ? '' : res;
	}

	function binderconfig(el, val) {
		el.$binderconfig && clearTimeout(el.$binderconfig);
		el.$binderconfig = setTimeout(binderconfigforce, MD.delaybinder, el, val);
	}

	function binderconfigforce(el, val) {
		el.$binderconfig = null;
		var c = el.$com;
		if (c && c.$initialized)
			c.reconfigure(val);
		else
			binderconfig(el, val);
	}

	function isValue(val) {
		var index = val.indexOf(T_VALUE);
		return index !== -1 ? (((/\W/).test(val)) || val === T_VALUE) : false;
	}

	function plugindone(t, fn, done) {

		var a = current_owner;
		current_owner = t.id;
		delete t.pending;
		current_scope = t.name;
		fn.call(t, t);

		// extensions
		var exts = extensions['@' + t.name];
		if (exts) {
			for (var ext of exts)
				ext.call(t, t);
		}

		exts = extensions['@' + t.id];
		if (exts) {
			for (var ext of exts)
				ext.call(t, t);
		}

		events.plugin && EMIT(PLUGINNAME, t);
		DEF.monitor && monitor_method('plugins', fn ? 1 : 0);
		W.PLUGINS[t.name] = t;
		current_scope = null;
		done && done();
		current_owner = a;
	}

	function Plugin(name, fn, init, done, caller) {

		W.PLUGINS[name] && W.PLUGINS[name].$remove(true);

		var t = this;
		t.element = $(current_element || D.body);
		t.id = 'plug' + name;
		t.name = name;
		t.caller = caller;

		var ext = {
			get() {
				return GET(t.makepath()) || {};
			},
			set(value) {
				SET(t.makepath(), value);
			}
		};

		Object.defineProperty(t, 'parent', {
			get() {
				var scope = this.element.scope();
				return scope && scope.parent ? scope.parent.plugin : null;
			}
		});

		Object.defineProperty(t, 'model', ext);
		Object.defineProperty(t, 'data', ext);
		Object.defineProperty(t, 'form', {
			get() {
				return GET(t.makepath() + ' @reset') || {};
			}
		});
		Object.defineProperty(t, 'modified', {
			get() {
				return GET(t.makepath() + ' @reset @modified') || {};
			}
		});

		if (init) {
			t.pending = true;
			if (typeof(init) === TYPE_S) {
				MIDDLEWARE(init.split(/\s|,/).trim(), function() {
					plugindone(t, fn, done);
				});
			} else {
				init.call(t, function() {
					plugindone(t, fn, done);
				}, t);
			}
		} else
			plugindone(t, fn, done);
	}

	var PP = Plugin.prototype;

	function ppcall(plugin, type, name, data, callback) {

		if (callback == null) {
			callback = data;
			data = null;
		}

		plugin.scope();

		if (typeof(callback) === TYPE_S)
			callback = plugin.makepath(callback);
		else if (!callback)
			return promiseajax(type, name, data);

		W[type](name, data, callback);
		return plugin;
	}

	PP.upload = function(name, data, callback) {
		return ppcall(this, 'UPLOAD', name, data, callback);
	};

	PP.tapi = function(name, data, callback) {
		return ppcall(this, 'TAPI', name, data, callback);
	};

	PP.api = function(url, data, callback) {
		return ppcall(this, 'API', url, data, callback);
	};

	PP.dapi = function(name, data, callback) {
		return ppcall(this, 'DAPI', name, data, callback);
	};

	PP.wapi = function(name, data, callback) {
		return ppcall(this, 'wapi', name, data, callback);
	};

	PP.ajax = function(name, data, callback) {
		return ppcall(this, 'AJAX', name, data, callback);
	};

	PP.on = function(name, callback, init) {
		var t = this;
		t.scope();
		ON(name, callback, init);
		return t;
	};

	PP.watch = function(name, callback, init) {

		var t = this;
		var fn = callback;

		t.scope();

		if (typeof(fn) === TYPE_FN) {
			fn = function(path, value, type) {
				callback(value, path, type);
			};
		}

		name = name.split(',').trim();
		for (var i = 0; i < name.length; i++)
			name[i] = t.makepath(name[i]);

		WATCH(name.join(','), fn, init);
		return t;
	};

	PP.set = function(path, value, type) {
		var t = this;

		if (value === undefined) {
			value = path;
			path = null;
		}

		SET(t.makepath(path), value, type);
		return t;
	};

	PP.nul = function(path, type) {
		var t = this;
		SET(t.makepath(path), null, type);
		return t;
	};

	PP.push = function(path, value, type) {
		var t = this;

		if (value === undefined) {
			value = path;
			path = null;
		}

		PUSH(t.makepath(path), value, type);
		return t;
	};

	PP.extend = function(path, value, type) {
		var t = this;

		if (value === undefined) {
			value = path;
			path = null;
		}

		EXTEND(t.makepath(path), value, type);
		return t;
	};

	PP.inc = function(path, value, type) {
		var t = this;

		if (value === undefined) {
			value = path;
			path = null;
		}

		INC(t.makepath(path), value, type);
		return t;
	};

	PP.toggle = function(path, type) {
		var t = this;
		t.scope();
		TOGGLE(t.makepath(path), type);
		return t;
	};

	PP.upd = function(path, type) {
		var t = this;
		UPD(t.makepath(path), type);
		return t;
	};

	PP.reset = function(path) {
		var t = this;
		RESET(t.makepath(path));
		return t;
	};

	PP.get = function(path) {
		return GET(this.makepath(path));
	};

	PP.$format = function(endpoint) {
		var plugin = this;
		if (plugin && plugin[endpoint]) {
			DEF.monitor && monitor_method('plugins');
			return plugin[endpoint];
		}
		return SCP.$formatnoop;
	};

	PP.exec = function(name, a, b, c, d, e) {

		var self = this;
		var cl;

		if (name.indexOf(' #') !== -1) {
			var tmp = makecl(name);
			cl = tmp.cl;
			name = tmp.path;
		}

		name = makeandexecflags(name);

		CL(cl, function() {
			self.scope();
			var fn = self[name];
			MD.monitor && monitor_method('plugins');
			fn && fn.call(self, a, b, c, d, e);
		});

		return self;
	};

	PP.plugin = PP.scope = function(path) {
		var self = this;
		current_caller = current_scope = path === null ? null : (path || self.name);
		return self;
	};

	PP.format = function(path) {

		if (!path)
			path = '';

		if (path.indexOf('{') === -1)
			path += '{0}';

		return path.format(this.name);
	};

	PP.makepath = function(path) {

		var self = this;

		self.scope();

		var c = path ? path.charAt(0) : '';

		if (c === '*')
			return cleancommonpath() + (path.length > 1 ? ('.' + path.substring(1)) : '');

		// Does it contain flags only?
		if (c === '@')
			return self.name + ' ' + path;

		if (c === '^' || c === '+')
			return c + self.makepath(path.substring(1));

		if (c === '|')
			return self.name + path;

		if (c === '%' || c === '#')
			return path;

		if (path)
			path = path.replace(/\?(\.)?/, '');

		return self.name + (path ? ('.' + path) : '');
	};

	PP.remove = PP.$remove = function() {

		var self = this;
		if (!self.element)
			return true;

		var id = self.id + '_';
		for (var key in repeats) {
			if (key.substring(0, id.length) === id) {
				clearInterval(repeats[key]);
				delete repeats[key];
			}
		}

		DEF.monitor && monitor_method('plugins', 2);
		EMIT('plugin.destroy', self);
		self.destroy && self.destroy();

		// Remove all global events
		for (var key in events) {
			var evt = events[key];
			evt = evt.remove('owner', self.id);
			if (!evt.length)
				delete events[key];
		}

		watches = watches.remove('owner', self.id);

		// Remove events
		OFF(self.id + '#watch');

		// self.element.remove();
		self.element = null;

		delete W.PLUGINS[self.name];
		return true;
	};

	function cleancommonpath() {
		return MD.pathcommon.substring(0, MD.pathcommon.length - 1);
	}

	W.PLUGINABLE = function(name, fn, init) {

		if (name === '*')
			name = cleancommonpath();

		var tmp = pluginableplugins[name];
		if (tmp && tmp.pending) {
			tmp.fn = fn;
			tmp.init = init;
		} else
			pluginableplugins[name] = { name: name, fn: fn, init: init };
	};

	W.PLUGIN = function(name, fn, init, done) {

		if (name === '*')
			name = cleancommonpath();

		if (PREFLOADED) {

			if (name.indexOf(' ') !== -1) {
				var arr = name.split(' ').trim();
				pluginscope[arr[1]] = { fn: fn, element: current_element };
				return;
			}

			if (fn) {
				current_scope = name;
				fn = new Plugin(name, fn, init, done, current_caller && PLUGINS[current_caller]);
			}

			if (!init) {
				DEF.monitor && monitor_method('plugins', fn ? 1 : 0);
				return fn || W.PLUGINS[name];
			}

		} else
			plugininit.push({ name: name, fn: fn, init: init, done: done });

	};

	function CustomScrollbar(element, options) {

		var self = this;
		var size = {};
		var drag = {};

		if (!options)
			options = {};

		var n = MD.prefixcsslibrary + 'scrollbar';
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
			if (MD.scrollbaranimate && !animcache.disabled && (size.vpos === 0 || size.vpos === size.vmax)) {
				size.animvpost && clearTimeout(size.animvpost);
				size.animvpost = setTimeout(animyt2, 10, size.vpos, size.vmax);
			}
		};

		handlers.forcex = function() {
			barx[0].style.left = size.hpos + 'px';
			if (MD.scrollbaranimate && !animcache.disabled && (size.hpos === 0 || size.hpos === size.hmax)) {
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
			events.scrollidle && EMIT('scrollidle', area);
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
					events.scroll && EMIT('scroll', area);
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

			if (!pathx.hclass(n + '-' + T_HIDDEN))
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

			if (!pathy.hclass(n + '-' + T_HIDDEN))
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
				if (parent.tagName === T_BODY) {
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
				el = typeof(options.parent) === TYPE_O ? $(options.parent) : el.closest(options.parent);
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
					path.tclass(T_HIDDEN, md);
				}

			} else {
				aw = size.viewWidth + (canY ? size.margin : 0) - mx;
				ah = size.viewHeight + (canX ? size.margin : 0) - my;
			}

			if (scrollbarcache.aw !== aw) {
				scrollbarcache.aw = aw;
				!md && area.css(T_WIDTH, aw);
				if (shadowtop) {
					var shadowm = options.marginshadowY || 0;
					shadowtop.css(T_WIDTH, size.viewWidth - shadowm);
					shadowbottom.css(T_WIDTH, size.viewWidth - shadowm);
				}
				shadowright && shadowright.css('left', size.viewWidth - shadowheight);
				bodyarea.css(orientation === 'y' ? T_WIDTH : 'min-' + T_WIDTH, size.viewWidth - mx + (W.isIE || isedge || !sw ? size.margin : 0) - (orientation === 'x' ? size.margin : 0));
			}

			if (scrollbarcache.ah !== ah) {
				scrollbarcache.ah = ah;
				area.css(T_HEIGHT, ah);
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
					shadowleft.css(T_HEIGHT, cssx.top - (options.marginshadowX || 0) + shadowplus);
					shadowright.css(T_HEIGHT, cssx.top - (options.marginshadowX || 0) + shadowplus);
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
						bary.stop().css(T_HEIGHT, size.vbarsize).attrd('size', size.vbarsize);
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
						barx.stop().css(T_WIDTH, size.hbarsize).attrd('size', size.hbarsize);
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

			var n = MD.prefixcsslibrary + 'scrollbar-';

			if (canX && scrollbarcache.hbar !== size.hbar) {
				scrollbarcache.hbar = size.hbar;
				pathx.tclass((visibleX ? n : '') + T_HIDDEN, !size.hbar);
			}

			if (canY && scrollbarcache.vbar !== size.vbar) {
				scrollbarcache.vbar = size.vbar;
				pathy.tclass((visibleY ? n : '') + T_HIDDEN, !size.vbar);
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

			if (typeof(val) === TYPE_S)
				val = area[0].scrollLeft + (+val);

			size.hpos = -1;
			return area[0].scrollLeft = val;
		};

		self.scrollTop = function(val) {

			if (val == null)
				return area[0].scrollTop;

			if (typeof(val) === TYPE_S)
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
			OFF(T_RESIZE, self.resize);
			var index = M.scrollbars.indexOf(self);
			if (index !== -1)
				M.scrollbars.splice(index, 1);
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
			$W.on(T_RESIZE, onresize);
			ON(T_RESIZE, self.resize);
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
		M.scrollbars.push(self);
		return self;
	}

	M.prototypes = function(fn) {
		var obj = {};
		obj.Component = PPC;
		obj.Plugin = PP;
		obj.VBinder = VBP;
		fn.call(obj, obj);
	};

	W.SCROLLBAR = function(element, options) {
		return new CustomScrollbar(element, options);
	};

	W.NOTFOCUSED = function() {
		return document.hidden || document.msHidden || document.webkitHidden;
	};

	W.REPEAT = function(condition, process, delay, init) {

		if (typeof(process) === TYPE_N) {
			init = delay;
			delay = process;
			process = condition;
			condition = null;
		}

		var path;
		var is = !!condition;

		if (typeof(condition) === TYPE_S) {
			var tmp = condition.split(REGMETA);
			path = tmp[0].replace(REGSCOPEINLINE, current_scope);
			condition = tmp[1] ? FN('value=>' + tmp[1]) : null;
		}

		var key = ('plug' + current_scope || '') + '_' + GUID(5);
		var indexer = 0;

		var fn = function(scope, indexer) {

			if (MD.repeatfocus && W.NOTFOCUSED()) {
				// accelerated timer
				repeats[key] && clearTimeout(repeats[key]);
				repeats[key] = setTimeout(fn, 1000, scope, indexer);
				return;
			}

			var skip = false;

			if (is) {
				if (path) {
					var tmp = GET(path);
					if (condition) {
						if (!condition(GET(path)))
							skip = true;
					} else if (!tmp)
						skip = true;
				} else if (!condition())
					skip = true;
			}

			repeats[key] && clearTimeout(repeats[key]);
			repeats[key] = setTimeout(fn, delay, scope, skip ? indexer : (indexer + 1));

			if (skip)
				return;

			DEF.monitor && monitor_method('repeat');

			var curr_scope;
			if (scope) {
				curr_scope = current_scope;
				current_scope = scope;
				process(indexer + 1, scope);
				current_scope = curr_scope;
			} else
				process(indexer + 1, '');
		};

		init && fn(indexer++, current_scope);
		repeats[key] = setTimeout(fn, delay, current_scope, indexer);
	};

	W.QUEUE = function(name, fn) {

		if (typeof(name) == TYPE_FN) {
			fn = name;
			name = T_COM;
		}

		var arr = queues[name];
		if (!arr)
			arr = queues[name] = [];

		if (fn) {
			arr.push({ fn: fn, scope: current_scope });
			W.QUEUE(name);
		} else if (!arr.isrunning) {
			var item = arr.shift();
			if (item) {
				arr.isrunning = true;
				current_scope = item.scope;
				item.fn(function() {
					arr.isrunning = false;
					W.QUEUE(name);
				}, arr.length);
			}
		}

		return arr.length;
	};

	W.WORKFLOW = function(declaration, tasks, callback) {

		if (typeof(tasks) === TYPE_FN) {
			callback = tasks;
			tasks = undefined;
		}

		var $ = {};
		$.tasks = tasks || {};
		$.scope = current_scope;
		$.callback = function(fn) {
			callback = fn;
		};

		$.next = $.trigger = function(next, val) {
			setTimeout($.nextforce, 5, next, val);
		};

		$.nextforce = function(next, val) {

			if (!$)
				return;

			$.prev = $.current;
			var fn = $.tasks[next];
			if (fn) {
				var tmp = current_scope;
				current_scope = $.scope;
				$.current = next;

				if (val != undefined)
					$.value = val;

				fn($, $.value);
				current_scope = tmp;
			} else
				$.destroy();
		};

		$.next2 = function(name) {
			return function(val) {
				$ && $.next(name, val);
			};
		};

		$.invalid = function(e) {
			if ($.error)
				$.error(e, $);
			else if (!callback)
				WARN('WORKFLOW: ' + $.current, e);
			callback && callback.call($, DEF.ajaxerrors ? e : null, e, $);
		};

		$.push = function(name, cb) {
			$.tasks[name] = cb;
		};

		$.done = function(val) {
			if (val == undefined)
				val = $.value;
			callback && callback.call($, val, null, $);
		};

		$.clone = function() {
			return W.WORKFLOW(null, $.tasks);
		};

		$.destroy = function() {
			$ = null;
		};

		declaration && declaration($);
		return $;
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

	function encrypt_data(value, key) {

		var builder = [];
		var index = 0;
		var length = key.length;

		var mask = Math.floor(Math.random() * 999999999);
		var maskarr = [];

		for (var i = 3; i >= 0; i--)
			maskarr.push((mask >> (8 * i)) & 255);

		for (var i = 0; i < value.length; i++) {

			var c = value.charAt(i);

			if (SKIPBODYENCRYPTOR[c]) {
				builder.push(c);
				continue;
			}

			if (index === length)
				index = 0;

			var a = value.charCodeAt(i) + 2;
			var b = key.charCodeAt(index++);
			var t = (a + b).toString(36);
			builder.push(t.length + t);
		}

		var output = [];

		builder = builder.join('');
		for (var i = 0; i < builder.length; i++)
			output.push(String.fromCharCode(builder.charCodeAt(i) ^ maskarr[i % 4]));

		for (var i = maskarr.length - 1; i > -1; i--)
			output.unshift(String.fromCharCode(maskarr[i]));

		return btoa(output.join(''));
	}

	function decrypt_data(value, key) {

		var v;

		try {
			v = atob(value);
		} catch (e) {
			return '';
		}

		var mask = [];
		for (var i = 0; i < 4; i++)
			mask[i] = v.charCodeAt(i);

		var output = [];
		for (var i = 4; i < v.length; i++)
			output.push(String.fromCharCode(v.charCodeAt(i) ^ mask[i % 4]));

		var index = 0;
		var length = key.length;
		var builder = [];

		value = output.join('');

		for (var i = 0; i < value.length; i++) {

			var c = value.charAt(i);

			if (SKIPBODYENCRYPTOR[c]) {
				builder.push(c);
				continue;
			}

			if (index === length)
				index = 0;

			var l = +value.charAt(i);
			var code = parseInt(value.substring(i + 1, i + 1 + l), 36);
			var b = key.charCodeAt(index++);
			builder.push(String.fromCharCode(code - b - 2));
			i += l;
		}

		return builder.join('');
	}

	W.DECRYPT = function(hex, key, type) {
		var index = hex.lastIndexOf('x');
		if (index !== -1) {
			if (!type)
				type = '';
			var hash = hex.substring(index + 1);
			var o = hex.substring(type.length, index);
			var t = type ? hex.substring(0, type.length) : '';
			if (t === type && HASH(o + (key || '') + type).toString(32) === hash) {
				o = decodeURIComponent(o.replace(/(..)/g, '%$1'));
				var c = o.charAt(0);
				return c === '[' || c === '{' || c === '"' ? PARSE(o) : o;
			}
		}
	};

	W.ENCRYPT = function(str, key, type) {
		if (typeof(str) === TYPE_O)
			str = STRINGIFY(str, true);
		var arr = unescape(encodeURIComponent(str)).split('');
		for (var i = 0; i < arr.length; i++)
			arr[i] = arr[i].charCodeAt(0).toString(16);
		if (!type)
			type = '';
		var o = arr.join('');
		return type + o + 'x' + HASH(o + (key || '') + type).toString(32);
	};

	W.UNAUTHORIZED = function() {

		var user = W.user;
		if (user) {

			if (user.sa || user.su)
				return false;

			var compare = user.permissions || user.roles;
			var args = arguments;

			if (compare) {
				if (compare instanceof Array) {
					for (var i = 0; i < compare.length; i++) {
						for (var j = 0; j < args.length; j++) {
							if (args[j] === compare[i])
								return false;
						}
					}
				} else {
					for (var j = 0; j < args.length; j++) {
						if (compare[args[j]])
							return false;
					}
				}
			}
		}

		return true;
	};

	function safereplacesemicolon(text, newtext) {
		return text.replace(/(.)?;/g, function(c) {
			var f = c.charAt(0);
			return f === '\\' ? c : (f + newtext);
		});
	}

	W.NEWUIBIND = function(element, path, config, virtual) {

		if (element instanceof jQuery)
			element = element[0];

		if (!virtual && !PREFLOADED) {
			bindelements.push({ el: element, path: path, config: config });
			return;
		}

		if (!path)
			path = element.getAttribute(T_PATH);

		if (!config)
			config = element.getAttribute(T_CONFIG);

		if (!path)
			path = 'null';

		if (config)
			path += '__' + safereplacesemicolon(config, '__');

		element.ui = parsebinder(element, path);

		if (element.ui) {
			element.$jcbind = element.uibind = element.ui;
			element.ui.$new = 1;
			element.ui.$type = 'binder';
			rebindbinder();
		} else
			WARN('Invalid <ui-bind>', element);
	};

	function htmlcomponentparse2(t, n) {

		if (!PREFLOADED) {
			comelements.push(t);
			return;
		}

		if (!n)
			n = t.getAttribute('name') || '';

		if (!n)
			return;

		var p = t.getAttribute(T_PATH) || 'null';
		var c = t.getAttribute(T_CONFIG) || 'null';
		var d = t.getAttribute(T_DEFAULT) || '';

		var meta = [n, p, c, d || ''];
		t.$jcwebcomponent = true;

		compilecomponent(meta, t);

		if (!t.$com && !t.$compilecomponent) {

			var islazy = n.substring(0, 5).toLowerCase() === 'lazy ';
			if (islazy)
				n = n.substring(5);

			if (n.lastIndexOf('@') === -1) {
				if (versions[n])
					n += '@' + versions[n];
				else if (MD.versioncomponents)
					n += '@' + MD.versioncomponents;
			}

			if (!M.$components[n]) {
				t.$componentname = n;
				t.$compilecomponent = () => compilecomponent(meta, t);
				waitfordownload.push(t);
				if (!C.ready)
					setTimeout2('$nextpending', nextpending, 50);
			}
		}
	}

	customElements.define('ui-plugin',class extends HTMLElement {
		constructor() {
			super();
			this.ui = { $new: 1, $type: PLUGINNAME };
			if (PREFLOADED)
				setTimeout(findscope, 1, this);
			else
				pluginelements.push(this);
		}
	});

	customElements.define('ui-bind', class extends HTMLElement {
		constructor() {
			super();
			setTimeout(W.NEWUIBIND, 2, this);
		}
	});

	function registercustom(name, component) {
		customElements.define(name, class extends HTMLElement {

			// Implement status
			constructor() {
				super();
				setTimeout(htmlcomponentparse2, 1, this, component);
			}

			static get observedAttributes() {
				return [T_CONFIG];
			}

			reconfigure(value, init, noemit) {
				var t = this;
				if (value == null)
					value = t.getAttribute(T_CONFIG);
				t.$com.reconfigure(value, null, init, noemit);
			}

			modify(value, type) {
				this.$com.modify(value, type);
			}

			read(raw) {
				return this.$com.read(raw);
			}

			get() {
				return GET(this.$com.path);
			}

			set(value, type) {
				this.config.modified = true;
				SET(this.$com.path, value, type);
			}

			update(type) {
				this.config.modified = true;
				SET(this.$com.path, this.get(), type);
			}

			reset() {
				this.reconfigure({ invalid: false, modified: false });
			}

			attributeChangedCallback(property, ovalue, nvalue) {
				var t = this;

				if (!this.$initialized)
					return;

				switch (property) {
					case T_CONFIG:
						t.$com.reconfigure(nvalue);
						break;
				}
			}

		});
	}

	function importparse(t) {
		waitforimport.push(t);
		reimport();
	}

	customElements.define('ui-import', class extends HTMLElement {

		constructor() {
			super();
			setTimeout(importparse, 1, this);
		}

	});

	registercustom('ui-component');

})();