/*!
 * ZeroClipboard
 * The ZeroClipboard library provides an easy way to copy text to the clipboard using an invisible Adobe Flash movie and a JavaScript interface.
 * Copyright (c) 2014 Jon Rohan, James M. Greene
 * Licensed MIT
 * http://zeroclipboard.org/
 * v2.1.6
 */
!(function(a, b) {
  'use strict';
  var c,
    d,
    e = a,
    f = e.document,
    g = e.navigator,
    h = e.setTimeout,
    i = e.encodeURIComponent,
    j = e.ActiveXObject,
    k = e.Error,
    l = e.Number.parseInt || e.parseInt,
    m = e.Number.parseFloat || e.parseFloat,
    n = e.Number.isNaN || e.isNaN,
    o = e.Math.round,
    p = e.Date.now,
    q = e.Object.keys,
    r = e.Object.defineProperty,
    s = e.Object.prototype.hasOwnProperty,
    t = e.Array.prototype.slice,
    u = (function() {
      var a = function(a) {
        return a;
      };
      if ('function' == typeof e.wrap && 'function' == typeof e.unwrap)
        try {
          var b = f.createElement('div'),
            c = e.unwrap(b);
          1 === b.nodeType && c && 1 === c.nodeType && (a = e.unwrap);
        } catch (d) {}
      return a;
    })(),
    v = function(a) {
      return t.call(a, 0);
    },
    w = function() {
      var a,
        c,
        d,
        e,
        f,
        g,
        h = v(arguments),
        i = h[0] || {};
      for (a = 1, c = h.length; c > a; a++)
        if (null != (d = h[a]))
          for (e in d) s.call(d, e) && ((f = i[e]), (g = d[e]), i !== g && g !== b && (i[e] = g));
      return i;
    },
    x = function(a) {
      var b, c, d, e;
      if ('object' != typeof a || null == a) b = a;
      else if ('number' == typeof a.length)
        for (b = [], c = 0, d = a.length; d > c; c++) s.call(a, c) && (b[c] = x(a[c]));
      else {
        b = {};
        for (e in a) s.call(a, e) && (b[e] = x(a[e]));
      }
      return b;
    },
    y = function(a, b) {
      for (var c = {}, d = 0, e = b.length; e > d; d++) b[d] in a && (c[b[d]] = a[b[d]]);
      return c;
    },
    z = function(a, b) {
      var c = {};
      for (var d in a) -1 === b.indexOf(d) && (c[d] = a[d]);
      return c;
    },
    A = function(a) {
      if (a) for (var b in a) s.call(a, b) && delete a[b];
      return a;
    },
    B = function(a, b) {
      if (
        a &&
        1 === a.nodeType &&
        a.ownerDocument &&
        b &&
        ((1 === b.nodeType && b.ownerDocument && b.ownerDocument === a.ownerDocument) ||
          (9 === b.nodeType && !b.ownerDocument && b === a.ownerDocument))
      )
        do {
          if (a === b) return !0;
          a = a.parentNode;
        } while (a);
      return !1;
    },
    C = function(a) {
      var b;
      return (
        'string' == typeof a &&
          a &&
          ((b = a.split('#')[0].split('?')[0]), (b = a.slice(0, a.lastIndexOf('/') + 1))),
        b
      );
    },
    D = function(a) {
      var b, c;
      return (
        'string' == typeof a &&
          a &&
          ((c = a.match(
            /^(?:|[^:@]*@|.+\)@(?=http[s]?|file)|.+?\s+(?: at |@)(?:[^:\(]+ )*[\(]?)((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/
          )),
          c && c[1]
            ? (b = c[1])
            : ((c = a.match(/\)@((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/)),
              c && c[1] && (b = c[1]))),
        b
      );
    },
    E = function() {
      var a, b;
      try {
        throw new k();
      } catch (c) {
        b = c;
      }
      return b && (a = b.sourceURL || b.fileName || D(b.stack)), a;
    },
    F = function() {
      var a, c, d;
      if (f.currentScript && (a = f.currentScript.src)) return a;
      if (((c = f.getElementsByTagName('script')), 1 === c.length)) return c[0].src || b;
      if ('readyState' in c[0])
        for (d = c.length; d--; ) if ('interactive' === c[d].readyState && (a = c[d].src)) return a;
      return 'loading' === f.readyState && (a = c[c.length - 1].src) ? a : (a = E()) ? a : b;
    },
    G = function() {
      var a,
        c,
        d,
        e = f.getElementsByTagName('script');
      for (a = e.length; a--; ) {
        if (!(d = e[a].src)) {
          c = null;
          break;
        }
        if (((d = C(d)), null == c)) c = d;
        else if (c !== d) {
          c = null;
          break;
        }
      }
      return c || b;
    },
    H = function() {
      var a = C(F()) || G() || '';
      return a + 'ZeroClipboard.swf';
    },
    I = {
      bridge: null,
      version: '0.0.0',
      pluginType: 'unknown',
      disabled: null,
      outdated: null,
      unavailable: null,
      deactivated: null,
      overdue: null,
      ready: null
    },
    J = '11.0.0',
    K = {},
    L = {},
    M = null,
    N = {
      ready: 'Flash communication is established',
      error: {
        'flash-disabled': 'Flash is disabled or not installed',
        'flash-outdated': 'Flash is too outdated to support ZeroClipboard',
        'flash-unavailable': 'Flash is unable to communicate bidirectionally with JavaScript',
        'flash-deactivated':
          'Flash is too outdated for your browser and/or is configured as click-to-activate',
        'flash-overdue':
          'Flash communication was established but NOT within the acceptable time limit'
      }
    },
    O = {
      swfPath: H(),
      trustedDomains: a.location.host ? [a.location.host] : [],
      cacheBust: !0,
      forceEnhancedClipboard: !1,
      flashLoadTimeout: 3e4,
      autoActivate: !0,
      bubbleEvents: !0,
      containerId: 'global-zeroclipboard-html-bridge',
      containerClass: 'global-zeroclipboard-container',
      swfObjectId: 'global-zeroclipboard-flash-bridge',
      hoverClass: 'zeroclipboard-is-hover',
      activeClass: 'zeroclipboard-is-active',
      forceHandCursor: !1,
      title: null,
      zIndex: 999999999
    },
    P = function(a) {
      if ('object' == typeof a && null !== a)
        for (var b in a)
          if (s.call(a, b))
            if (/^(?:forceHandCursor|title|zIndex|bubbleEvents)$/.test(b)) O[b] = a[b];
            else if (null == I.bridge)
              if ('containerId' === b || 'swfObjectId' === b) {
                if (!cb(a[b]))
                  throw new Error(
                    'The specified `' + b + '` value is not valid as an HTML4 Element ID'
                  );
                O[b] = a[b];
              } else O[b] = a[b];
      {
        if ('string' != typeof a || !a) return x(O);
        if (s.call(O, a)) return O[a];
      }
    },
    Q = function() {
      return {
        browser: y(g, ['userAgent', 'platform', 'appName']),
        flash: z(I, ['bridge']),
        zeroclipboard: { version: Fb.version, config: Fb.config() }
      };
    },
    R = function() {
      return !!(I.disabled || I.outdated || I.unavailable || I.deactivated);
    },
    S = function(a, b) {
      var c,
        d,
        e,
        f = {};
      if ('string' == typeof a && a) e = a.toLowerCase().split(/\s+/);
      else if ('object' == typeof a && a && 'undefined' == typeof b)
        for (c in a)
          s.call(a, c) && 'string' == typeof c && c && 'function' == typeof a[c] && Fb.on(c, a[c]);
      if (e && e.length) {
        for (c = 0, d = e.length; d > c; c++)
          (a = e[c].replace(/^on/, '')), (f[a] = !0), K[a] || (K[a] = []), K[a].push(b);
        if ((f.ready && I.ready && Fb.emit({ type: 'ready' }), f.error)) {
          var g = ['disabled', 'outdated', 'unavailable', 'deactivated', 'overdue'];
          for (c = 0, d = g.length; d > c; c++)
            if (I[g[c]] === !0) {
              Fb.emit({ type: 'error', name: 'flash-' + g[c] });
              break;
            }
        }
      }
      return Fb;
    },
    T = function(a, b) {
      var c, d, e, f, g;
      if (0 === arguments.length) f = q(K);
      else if ('string' == typeof a && a) f = a.split(/\s+/);
      else if ('object' == typeof a && a && 'undefined' == typeof b)
        for (c in a)
          s.call(a, c) && 'string' == typeof c && c && 'function' == typeof a[c] && Fb.off(c, a[c]);
      if (f && f.length)
        for (c = 0, d = f.length; d > c; c++)
          if (((a = f[c].toLowerCase().replace(/^on/, '')), (g = K[a]), g && g.length))
            if (b) for (e = g.indexOf(b); -1 !== e; ) g.splice(e, 1), (e = g.indexOf(b, e));
            else g.length = 0;
      return Fb;
    },
    U = function(a) {
      var b;
      return (b = 'string' == typeof a && a ? x(K[a]) || null : x(K));
    },
    V = function(a) {
      var b, c, d;
      return (
        (a = db(a)),
        a && !jb(a)
          ? 'ready' === a.type && I.overdue === !0
            ? Fb.emit({ type: 'error', name: 'flash-overdue' })
            : ((b = w({}, a)),
              ib.call(this, b),
              'copy' === a.type && ((d = pb(L)), (c = d.data), (M = d.formatMap)),
              c)
          : void 0
      );
    },
    W = function() {
      if (
        ('boolean' != typeof I.ready && (I.ready = !1), !Fb.isFlashUnusable() && null === I.bridge)
      ) {
        var a = O.flashLoadTimeout;
        'number' == typeof a &&
          a >= 0 &&
          h(function() {
            'boolean' != typeof I.deactivated && (I.deactivated = !0),
              I.deactivated === !0 && Fb.emit({ type: 'error', name: 'flash-deactivated' });
          }, a),
          (I.overdue = !1),
          nb();
      }
    },
    X = function() {
      Fb.clearData(), Fb.blur(), Fb.emit('destroy'), ob(), Fb.off();
    },
    Y = function(a, b) {
      var c;
      if ('object' == typeof a && a && 'undefined' == typeof b) (c = a), Fb.clearData();
      else {
        if ('string' != typeof a || !a) return;
        (c = {}), (c[a] = b);
      }
      for (var d in c)
        'string' == typeof d &&
          d &&
          s.call(c, d) &&
          'string' == typeof c[d] &&
          c[d] &&
          (L[d] = c[d]);
    },
    Z = function(a) {
      'undefined' == typeof a
        ? (A(L), (M = null))
        : 'string' == typeof a && s.call(L, a) && delete L[a];
    },
    $ = function(a) {
      return 'undefined' == typeof a ? x(L) : 'string' == typeof a && s.call(L, a) ? L[a] : void 0;
    },
    _ = function(a) {
      if (a && 1 === a.nodeType) {
        c && (xb(c, O.activeClass), c !== a && xb(c, O.hoverClass)), (c = a), wb(a, O.hoverClass);
        var b = a.getAttribute('title') || O.title;
        if ('string' == typeof b && b) {
          var d = mb(I.bridge);
          d && d.setAttribute('title', b);
        }
        var e = O.forceHandCursor === !0 || 'pointer' === yb(a, 'cursor');
        Cb(e), Bb();
      }
    },
    ab = function() {
      var a = mb(I.bridge);
      a &&
        (a.removeAttribute('title'),
        (a.style.left = '0px'),
        (a.style.top = '-9999px'),
        (a.style.width = '1px'),
        (a.style.top = '1px')),
        c && (xb(c, O.hoverClass), xb(c, O.activeClass), (c = null));
    },
    bb = function() {
      return c || null;
    },
    cb = function(a) {
      return 'string' == typeof a && a && /^[A-Za-z][A-Za-z0-9_:\-\.]*$/.test(a);
    },
    db = function(a) {
      var b;
      if (
        ('string' == typeof a && a
          ? ((b = a), (a = {}))
          : 'object' == typeof a && a && 'string' == typeof a.type && a.type && (b = a.type),
        b)
      ) {
        !a.target && /^(copy|aftercopy|_click)$/.test(b.toLowerCase()) && (a.target = d),
          w(a, {
            type: b.toLowerCase(),
            target: a.target || c || null,
            relatedTarget: a.relatedTarget || null,
            currentTarget: (I && I.bridge) || null,
            timeStamp: a.timeStamp || p() || null
          });
        var e = N[a.type];
        return (
          'error' === a.type && a.name && e && (e = e[a.name]),
          e && (a.message = e),
          'ready' === a.type && w(a, { target: null, version: I.version }),
          'error' === a.type &&
            (/^flash-(disabled|outdated|unavailable|deactivated|overdue)$/.test(a.name) &&
              w(a, { target: null, minimumVersion: J }),
            /^flash-(outdated|unavailable|deactivated|overdue)$/.test(a.name) &&
              w(a, { version: I.version })),
          'copy' === a.type && (a.clipboardData = { setData: Fb.setData, clearData: Fb.clearData }),
          'aftercopy' === a.type && (a = qb(a, M)),
          a.target && !a.relatedTarget && (a.relatedTarget = eb(a.target)),
          (a = fb(a))
        );
      }
    },
    eb = function(a) {
      var b = a && a.getAttribute && a.getAttribute('data-clipboard-target');
      return b ? f.getElementById(b) : null;
    },
    fb = function(a) {
      if (a && /^_(?:click|mouse(?:over|out|down|up|move))$/.test(a.type)) {
        var c = a.target,
          d = '_mouseover' === a.type && a.relatedTarget ? a.relatedTarget : b,
          g = '_mouseout' === a.type && a.relatedTarget ? a.relatedTarget : b,
          h = Ab(c),
          i = e.screenLeft || e.screenX || 0,
          j = e.screenTop || e.screenY || 0,
          k = f.body.scrollLeft + f.documentElement.scrollLeft,
          l = f.body.scrollTop + f.documentElement.scrollTop,
          m = h.left + ('number' == typeof a._stageX ? a._stageX : 0),
          n = h.top + ('number' == typeof a._stageY ? a._stageY : 0),
          o = m - k,
          p = n - l,
          q = i + o,
          r = j + p,
          s = 'number' == typeof a.movementX ? a.movementX : 0,
          t = 'number' == typeof a.movementY ? a.movementY : 0;
        delete a._stageX,
          delete a._stageY,
          w(a, {
            srcElement: c,
            fromElement: d,
            toElement: g,
            screenX: q,
            screenY: r,
            pageX: m,
            pageY: n,
            clientX: o,
            clientY: p,
            x: o,
            y: p,
            movementX: s,
            movementY: t,
            offsetX: 0,
            offsetY: 0,
            layerX: 0,
            layerY: 0
          });
      }
      return a;
    },
    gb = function(a) {
      var b = (a && 'string' == typeof a.type && a.type) || '';
      return !/^(?:(?:before)?copy|destroy)$/.test(b);
    },
    hb = function(a, b, c, d) {
      d
        ? h(function() {
            a.apply(b, c);
          }, 0)
        : a.apply(b, c);
    },
    ib = function(a) {
      if ('object' == typeof a && a && a.type) {
        var b = gb(a),
          c = K['*'] || [],
          d = K[a.type] || [],
          f = c.concat(d);
        if (f && f.length) {
          var g,
            h,
            i,
            j,
            k,
            l = this;
          for (g = 0, h = f.length; h > g; g++)
            (i = f[g]),
              (j = l),
              'string' == typeof i && 'function' == typeof e[i] && (i = e[i]),
              'object' == typeof i &&
                i &&
                'function' == typeof i.handleEvent &&
                ((j = i), (i = i.handleEvent)),
              'function' == typeof i && ((k = w({}, a)), hb(i, j, [k], b));
        }
        return this;
      }
    },
    jb = function(a) {
      var b = a.target || c || null,
        e = 'swf' === a._source;
      delete a._source;
      var f = [
        'flash-disabled',
        'flash-outdated',
        'flash-unavailable',
        'flash-deactivated',
        'flash-overdue'
      ];
      switch (a.type) {
        case 'error':
          -1 !== f.indexOf(a.name) &&
            w(I, {
              disabled: 'flash-disabled' === a.name,
              outdated: 'flash-outdated' === a.name,
              unavailable: 'flash-unavailable' === a.name,
              deactivated: 'flash-deactivated' === a.name,
              overdue: 'flash-overdue' === a.name,
              ready: !1
            });
          break;
        case 'ready':
          var g = I.deactivated === !0;
          w(I, {
            disabled: !1,
            outdated: !1,
            unavailable: !1,
            deactivated: !1,
            overdue: g,
            ready: !g
          });
          break;
        case 'beforecopy':
          d = b;
          break;
        case 'copy':
          var h,
            i,
            j = a.relatedTarget;
          !L['text/html'] &&
          !L['text/plain'] &&
          j &&
          (i = j.value || j.outerHTML || j.innerHTML) &&
          (h = j.value || j.textContent || j.innerText)
            ? (a.clipboardData.clearData(),
              a.clipboardData.setData('text/plain', h),
              i !== h && a.clipboardData.setData('text/html', i))
            : !L['text/plain'] &&
              a.target &&
              (h = a.target.getAttribute('data-clipboard-text')) &&
              (a.clipboardData.clearData(), a.clipboardData.setData('text/plain', h));
          break;
        case 'aftercopy':
          Fb.clearData(), b && b !== vb() && b.focus && b.focus();
          break;
        case '_mouseover':
          Fb.focus(b),
            O.bubbleEvents === !0 &&
              e &&
              (b &&
                b !== a.relatedTarget &&
                !B(a.relatedTarget, b) &&
                kb(w({}, a, { type: 'mouseenter', bubbles: !1, cancelable: !1 })),
              kb(w({}, a, { type: 'mouseover' })));
          break;
        case '_mouseout':
          Fb.blur(),
            O.bubbleEvents === !0 &&
              e &&
              (b &&
                b !== a.relatedTarget &&
                !B(a.relatedTarget, b) &&
                kb(w({}, a, { type: 'mouseleave', bubbles: !1, cancelable: !1 })),
              kb(w({}, a, { type: 'mouseout' })));
          break;
        case '_mousedown':
          wb(b, O.activeClass),
            O.bubbleEvents === !0 && e && kb(w({}, a, { type: a.type.slice(1) }));
          break;
        case '_mouseup':
          xb(b, O.activeClass),
            O.bubbleEvents === !0 && e && kb(w({}, a, { type: a.type.slice(1) }));
          break;
        case '_click':
          (d = null), O.bubbleEvents === !0 && e && kb(w({}, a, { type: a.type.slice(1) }));
          break;
        case '_mousemove':
          O.bubbleEvents === !0 && e && kb(w({}, a, { type: a.type.slice(1) }));
      }
      return /^_(?:click|mouse(?:over|out|down|up|move))$/.test(a.type) ? !0 : void 0;
    },
    kb = function(a) {
      if (a && 'string' == typeof a.type && a) {
        var b,
          c = a.target || null,
          d = (c && c.ownerDocument) || f,
          g = {
            view: d.defaultView || e,
            canBubble: !0,
            cancelable: !0,
            detail: 'click' === a.type ? 1 : 0,
            button:
              'number' == typeof a.which
                ? a.which - 1
                : 'number' == typeof a.button
                ? a.button
                : d.createEvent
                ? 0
                : 1
          },
          h = w(g, a);
        c &&
          d.createEvent &&
          c.dispatchEvent &&
          ((h = [
            h.type,
            h.canBubble,
            h.cancelable,
            h.view,
            h.detail,
            h.screenX,
            h.screenY,
            h.clientX,
            h.clientY,
            h.ctrlKey,
            h.altKey,
            h.shiftKey,
            h.metaKey,
            h.button,
            h.relatedTarget
          ]),
          (b = d.createEvent('MouseEvents')),
          b.initMouseEvent &&
            (b.initMouseEvent.apply(b, h), (b._source = 'js'), c.dispatchEvent(b)));
      }
    },
    lb = function() {
      var a = f.createElement('div');
      return (
        (a.id = O.containerId),
        (a.className = O.containerClass),
        (a.style.position = 'absolute'),
        (a.style.left = '0px'),
        (a.style.top = '-9999px'),
        (a.style.width = '1px'),
        (a.style.height = '1px'),
        (a.style.zIndex = '' + Db(O.zIndex)),
        a
      );
    },
    mb = function(a) {
      for (var b = a && a.parentNode; b && 'OBJECT' === b.nodeName && b.parentNode; )
        b = b.parentNode;
      return b || null;
    },
    nb = function() {
      var a,
        b = I.bridge,
        c = mb(b);
      if (!b) {
        var d = ub(e.location.host, O),
          g = 'never' === d ? 'none' : 'all',
          h = sb(O),
          i = O.swfPath + rb(O.swfPath, O);
        c = lb();
        var j = f.createElement('div');
        c.appendChild(j), f.body.appendChild(c);
        var k = f.createElement('div'),
          l = 'activex' === I.pluginType;
        (k.innerHTML =
          '<object id="' +
          O.swfObjectId +
          '" name="' +
          O.swfObjectId +
          '" width="100%" height="100%" ' +
          (l
            ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"'
            : 'type="application/x-shockwave-flash" data="' + i + '"') +
          '>' +
          (l ? '<param name="movie" value="' + i + '"/>' : '') +
          '<param name="allowScriptAccess" value="' +
          d +
          '"/><param name="allowNetworking" value="' +
          g +
          '"/><param name="menu" value="false"/><param name="wmode" value="transparent"/><param name="flashvars" value="' +
          h +
          '"/></object>'),
          (b = k.firstChild),
          (k = null),
          (u(b).ZeroClipboard = Fb),
          c.replaceChild(b, j);
      }
      return (
        b ||
          ((b = f[O.swfObjectId]),
          b && (a = b.length) && (b = b[a - 1]),
          !b && c && (b = c.firstChild)),
        (I.bridge = b || null),
        b
      );
    },
    ob = function() {
      var a = I.bridge;
      if (a) {
        var b = mb(a);
        b &&
          ('activex' === I.pluginType && 'readyState' in a
            ? ((a.style.display = 'none'),
              (function c() {
                if (4 === a.readyState) {
                  for (var d in a) 'function' == typeof a[d] && (a[d] = null);
                  a.parentNode && a.parentNode.removeChild(a),
                    b.parentNode && b.parentNode.removeChild(b);
                } else h(c, 10);
              })())
            : (a.parentNode && a.parentNode.removeChild(a),
              b.parentNode && b.parentNode.removeChild(b))),
          (I.ready = null),
          (I.bridge = null),
          (I.deactivated = null);
      }
    },
    pb = function(a) {
      var b = {},
        c = {};
      if ('object' == typeof a && a) {
        for (var d in a)
          if (d && s.call(a, d) && 'string' == typeof a[d] && a[d])
            switch (d.toLowerCase()) {
              case 'text/plain':
              case 'text':
              case 'air:text':
              case 'flash:text':
                (b.text = a[d]), (c.text = d);
                break;
              case 'text/html':
              case 'html':
              case 'air:html':
              case 'flash:html':
                (b.html = a[d]), (c.html = d);
                break;
              case 'application/rtf':
              case 'text/rtf':
              case 'rtf':
              case 'richtext':
              case 'air:rtf':
              case 'flash:rtf':
                (b.rtf = a[d]), (c.rtf = d);
            }
        return { data: b, formatMap: c };
      }
    },
    qb = function(a, b) {
      if ('object' != typeof a || !a || 'object' != typeof b || !b) return a;
      var c = {};
      for (var d in a)
        if (s.call(a, d)) {
          if ('success' !== d && 'data' !== d) {
            c[d] = a[d];
            continue;
          }
          c[d] = {};
          var e = a[d];
          for (var f in e) f && s.call(e, f) && s.call(b, f) && (c[d][b[f]] = e[f]);
        }
      return c;
    },
    rb = function(a, b) {
      var c = null == b || (b && b.cacheBust === !0);
      return c ? (-1 === a.indexOf('?') ? '?' : '&') + 'noCache=' + p() : '';
    },
    sb = function(a) {
      var b,
        c,
        d,
        f,
        g = '',
        h = [];
      if (
        (a.trustedDomains &&
          ('string' == typeof a.trustedDomains
            ? (f = [a.trustedDomains])
            : 'object' == typeof a.trustedDomains &&
              'length' in a.trustedDomains &&
              (f = a.trustedDomains)),
        f && f.length)
      )
        for (b = 0, c = f.length; c > b; b++)
          if (s.call(f, b) && f[b] && 'string' == typeof f[b]) {
            if (((d = tb(f[b])), !d)) continue;
            if ('*' === d) {
              (h.length = 0), h.push(d);
              break;
            }
            h.push.apply(h, [d, '//' + d, e.location.protocol + '//' + d]);
          }
      return (
        h.length && (g += 'trustedOrigins=' + i(h.join(','))),
        a.forceEnhancedClipboard === !0 && (g += (g ? '&' : '') + 'forceEnhancedClipboard=true'),
        'string' == typeof a.swfObjectId &&
          a.swfObjectId &&
          (g += (g ? '&' : '') + 'swfObjectId=' + i(a.swfObjectId)),
        g
      );
    },
    tb = function(a) {
      if (null == a || '' === a) return null;
      if (((a = a.replace(/^\s+|\s+$/g, '')), '' === a)) return null;
      var b = a.indexOf('//');
      a = -1 === b ? a : a.slice(b + 2);
      var c = a.indexOf('/');
      return (
        (a = -1 === c ? a : -1 === b || 0 === c ? null : a.slice(0, c)),
        a && '.swf' === a.slice(-4).toLowerCase() ? null : a || null
      );
    },
    ub = (function() {
      var a = function(a) {
        var b,
          c,
          d,
          e = [];
        if (
          ('string' == typeof a && (a = [a]),
          'object' != typeof a || !a || 'number' != typeof a.length)
        )
          return e;
        for (b = 0, c = a.length; c > b; b++)
          if (s.call(a, b) && (d = tb(a[b]))) {
            if ('*' === d) {
              (e.length = 0), e.push('*');
              break;
            }
            -1 === e.indexOf(d) && e.push(d);
          }
        return e;
      };
      return function(b, c) {
        var d = tb(c.swfPath);
        null === d && (d = b);
        var e = a(c.trustedDomains),
          f = e.length;
        if (f > 0) {
          if (1 === f && '*' === e[0]) return 'always';
          if (-1 !== e.indexOf(b)) return 1 === f && b === d ? 'sameDomain' : 'always';
        }
        return 'never';
      };
    })(),
    vb = function() {
      try {
        return f.activeElement;
      } catch (a) {
        return null;
      }
    },
    wb = function(a, b) {
      if (!a || 1 !== a.nodeType) return a;
      if (a.classList) return a.classList.contains(b) || a.classList.add(b), a;
      if (b && 'string' == typeof b) {
        var c = (b || '').split(/\s+/);
        if (1 === a.nodeType)
          if (a.className) {
            for (var d = ' ' + a.className + ' ', e = a.className, f = 0, g = c.length; g > f; f++)
              d.indexOf(' ' + c[f] + ' ') < 0 && (e += ' ' + c[f]);
            a.className = e.replace(/^\s+|\s+$/g, '');
          } else a.className = b;
      }
      return a;
    },
    xb = function(a, b) {
      if (!a || 1 !== a.nodeType) return a;
      if (a.classList) return a.classList.contains(b) && a.classList.remove(b), a;
      if ('string' == typeof b && b) {
        var c = b.split(/\s+/);
        if (1 === a.nodeType && a.className) {
          for (
            var d = (' ' + a.className + ' ').replace(/[\n\t]/g, ' '), e = 0, f = c.length;
            f > e;
            e++
          )
            d = d.replace(' ' + c[e] + ' ', ' ');
          a.className = d.replace(/^\s+|\s+$/g, '');
        }
      }
      return a;
    },
    yb = function(a, b) {
      var c = e.getComputedStyle(a, null).getPropertyValue(b);
      return 'cursor' !== b || (c && 'auto' !== c) || 'A' !== a.nodeName ? c : 'pointer';
    },
    zb = function() {
      var a,
        b,
        c,
        d = 1;
      return (
        'function' == typeof f.body.getBoundingClientRect &&
          ((a = f.body.getBoundingClientRect()),
          (b = a.right - a.left),
          (c = f.body.offsetWidth),
          (d = o((b / c) * 100) / 100)),
        d
      );
    },
    Ab = function(a) {
      var b = { left: 0, top: 0, width: 0, height: 0 };
      if (a.getBoundingClientRect) {
        var c,
          d,
          g,
          h = a.getBoundingClientRect();
        'pageXOffset' in e && 'pageYOffset' in e
          ? ((c = e.pageXOffset), (d = e.pageYOffset))
          : ((g = zb()),
            (c = o(f.documentElement.scrollLeft / g)),
            (d = o(f.documentElement.scrollTop / g)));
        var i = f.documentElement.clientLeft || 0,
          j = f.documentElement.clientTop || 0;
        (b.left = h.left + c - i),
          (b.top = h.top + d - j),
          (b.width = 'width' in h ? h.width : h.right - h.left),
          (b.height = 'height' in h ? h.height : h.bottom - h.top);
      }
      return b;
    },
    Bb = function() {
      var a;
      if (c && (a = mb(I.bridge))) {
        var b = Ab(c);
        w(a.style, {
          width: b.width + 'px',
          height: b.height + 'px',
          top: b.top + 'px',
          left: b.left + 'px',
          zIndex: '' + Db(O.zIndex)
        });
      }
    },
    Cb = function(a) {
      I.ready === !0 &&
        (I.bridge && 'function' == typeof I.bridge.setHandCursor
          ? I.bridge.setHandCursor(a)
          : (I.ready = !1));
    },
    Db = function(a) {
      if (/^(?:auto|inherit)$/.test(a)) return a;
      var b;
      return (
        'number' != typeof a || n(a) ? 'string' == typeof a && (b = Db(l(a, 10))) : (b = a),
        'number' == typeof b ? b : 'auto'
      );
    },
    Eb = function(a) {
      function b(a) {
        var b = a.match(/[\d]+/g);
        return (b.length = 3), b.join('.');
      }
      function c(a) {
        return (
          !!a &&
          (a = a.toLowerCase()) &&
          (/^(pepflashplayer\.dll|libpepflashplayer\.so|pepperflashplayer\.plugin)$/.test(a) ||
            'chrome.plugin' === a.slice(-13))
        );
      }
      function d(a) {
        a &&
          ((i = !0),
          a.version && (l = b(a.version)),
          !l && a.description && (l = b(a.description)),
          a.filename && (k = c(a.filename)));
      }
      var e,
        f,
        h,
        i = !1,
        j = !1,
        k = !1,
        l = '';
      if (g.plugins && g.plugins.length)
        (e = g.plugins['Shockwave Flash']),
          d(e),
          g.plugins['Shockwave Flash 2.0'] && ((i = !0), (l = '2.0.0.11'));
      else if (g.mimeTypes && g.mimeTypes.length)
        (h = g.mimeTypes['application/x-shockwave-flash']), (e = h && h.enabledPlugin), d(e);
      else if ('undefined' != typeof a) {
        j = !0;
        try {
          (f = new a('ShockwaveFlash.ShockwaveFlash.7')),
            (i = !0),
            (l = b(f.GetVariable('$version')));
        } catch (n) {
          try {
            (f = new a('ShockwaveFlash.ShockwaveFlash.6')), (i = !0), (l = '6.0.21');
          } catch (o) {
            try {
              (f = new a('ShockwaveFlash.ShockwaveFlash')),
                (i = !0),
                (l = b(f.GetVariable('$version')));
            } catch (p) {
              j = !1;
            }
          }
        }
      }
      (I.disabled = i !== !0),
        (I.outdated = l && m(l) < m(J)),
        (I.version = l || '0.0.0'),
        (I.pluginType = k ? 'pepper' : j ? 'activex' : i ? 'netscape' : 'unknown');
    };
  Eb(j);
  var Fb = function() {
    return this instanceof Fb
      ? void ('function' == typeof Fb._createClient && Fb._createClient.apply(this, v(arguments)))
      : new Fb();
  };
  r(Fb, 'version', { value: '2.1.6', writable: !1, configurable: !0, enumerable: !0 }),
    (Fb.config = function() {
      return P.apply(this, v(arguments));
    }),
    (Fb.state = function() {
      return Q.apply(this, v(arguments));
    }),
    (Fb.isFlashUnusable = function() {
      return R.apply(this, v(arguments));
    }),
    (Fb.on = function() {
      return S.apply(this, v(arguments));
    }),
    (Fb.off = function() {
      return T.apply(this, v(arguments));
    }),
    (Fb.handlers = function() {
      return U.apply(this, v(arguments));
    }),
    (Fb.emit = function() {
      return V.apply(this, v(arguments));
    }),
    (Fb.create = function() {
      return W.apply(this, v(arguments));
    }),
    (Fb.destroy = function() {
      return X.apply(this, v(arguments));
    }),
    (Fb.setData = function() {
      return Y.apply(this, v(arguments));
    }),
    (Fb.clearData = function() {
      return Z.apply(this, v(arguments));
    }),
    (Fb.getData = function() {
      return $.apply(this, v(arguments));
    }),
    (Fb.focus = Fb.activate = function() {
      return _.apply(this, v(arguments));
    }),
    (Fb.blur = Fb.deactivate = function() {
      return ab.apply(this, v(arguments));
    }),
    (Fb.activeElement = function() {
      return bb.apply(this, v(arguments));
    });
  var Gb = 0,
    Hb = {},
    Ib = 0,
    Jb = {},
    Kb = {};
  w(O, { autoActivate: !0 });
  var Lb = function(a) {
      var b = this;
      (b.id = '' + Gb++),
        (Hb[b.id] = { instance: b, elements: [], handlers: {} }),
        a && b.clip(a),
        Fb.on('*', function(a) {
          return b.emit(a);
        }),
        Fb.on('destroy', function() {
          b.destroy();
        }),
        Fb.create();
    },
    Mb = function(a, b) {
      var c,
        d,
        e,
        f = {},
        g = Hb[this.id] && Hb[this.id].handlers;
      if ('string' == typeof a && a) e = a.toLowerCase().split(/\s+/);
      else if ('object' == typeof a && a && 'undefined' == typeof b)
        for (c in a)
          s.call(a, c) &&
            'string' == typeof c &&
            c &&
            'function' == typeof a[c] &&
            this.on(c, a[c]);
      if (e && e.length) {
        for (c = 0, d = e.length; d > c; c++)
          (a = e[c].replace(/^on/, '')), (f[a] = !0), g[a] || (g[a] = []), g[a].push(b);
        if ((f.ready && I.ready && this.emit({ type: 'ready', client: this }), f.error)) {
          var h = ['disabled', 'outdated', 'unavailable', 'deactivated', 'overdue'];
          for (c = 0, d = h.length; d > c; c++)
            if (I[h[c]]) {
              this.emit({ type: 'error', name: 'flash-' + h[c], client: this });
              break;
            }
        }
      }
      return this;
    },
    Nb = function(a, b) {
      var c,
        d,
        e,
        f,
        g,
        h = Hb[this.id] && Hb[this.id].handlers;
      if (0 === arguments.length) f = q(h);
      else if ('string' == typeof a && a) f = a.split(/\s+/);
      else if ('object' == typeof a && a && 'undefined' == typeof b)
        for (c in a)
          s.call(a, c) &&
            'string' == typeof c &&
            c &&
            'function' == typeof a[c] &&
            this.off(c, a[c]);
      if (f && f.length)
        for (c = 0, d = f.length; d > c; c++)
          if (((a = f[c].toLowerCase().replace(/^on/, '')), (g = h[a]), g && g.length))
            if (b) for (e = g.indexOf(b); -1 !== e; ) g.splice(e, 1), (e = g.indexOf(b, e));
            else g.length = 0;
      return this;
    },
    Ob = function(a) {
      var b = null,
        c = Hb[this.id] && Hb[this.id].handlers;
      return c && (b = 'string' == typeof a && a ? (c[a] ? c[a].slice(0) : []) : x(c)), b;
    },
    Pb = function(a) {
      if (Ub.call(this, a)) {
        'object' == typeof a && a && 'string' == typeof a.type && a.type && (a = w({}, a));
        var b = w({}, db(a), { client: this });
        Vb.call(this, b);
      }
      return this;
    },
    Qb = function(a) {
      a = Wb(a);
      for (var b = 0; b < a.length; b++)
        if (s.call(a, b) && a[b] && 1 === a[b].nodeType) {
          a[b].zcClippingId
            ? -1 === Jb[a[b].zcClippingId].indexOf(this.id) && Jb[a[b].zcClippingId].push(this.id)
            : ((a[b].zcClippingId = 'zcClippingId_' + Ib++),
              (Jb[a[b].zcClippingId] = [this.id]),
              O.autoActivate === !0 && Xb(a[b]));
          var c = Hb[this.id] && Hb[this.id].elements;
          -1 === c.indexOf(a[b]) && c.push(a[b]);
        }
      return this;
    },
    Rb = function(a) {
      var b = Hb[this.id];
      if (!b) return this;
      var c,
        d = b.elements;
      a = 'undefined' == typeof a ? d.slice(0) : Wb(a);
      for (var e = a.length; e--; )
        if (s.call(a, e) && a[e] && 1 === a[e].nodeType) {
          for (c = 0; -1 !== (c = d.indexOf(a[e], c)); ) d.splice(c, 1);
          var f = Jb[a[e].zcClippingId];
          if (f) {
            for (c = 0; -1 !== (c = f.indexOf(this.id, c)); ) f.splice(c, 1);
            0 === f.length && (O.autoActivate === !0 && Yb(a[e]), delete a[e].zcClippingId);
          }
        }
      return this;
    },
    Sb = function() {
      var a = Hb[this.id];
      return a && a.elements ? a.elements.slice(0) : [];
    },
    Tb = function() {
      this.unclip(), this.off(), delete Hb[this.id];
    },
    Ub = function(a) {
      if (!a || !a.type) return !1;
      if (a.client && a.client !== this) return !1;
      var b = Hb[this.id] && Hb[this.id].elements,
        c = !!b && b.length > 0,
        d = !a.target || (c && -1 !== b.indexOf(a.target)),
        e = a.relatedTarget && c && -1 !== b.indexOf(a.relatedTarget),
        f = a.client && a.client === this;
      return d || e || f ? !0 : !1;
    },
    Vb = function(a) {
      if ('object' == typeof a && a && a.type) {
        var b = gb(a),
          c = (Hb[this.id] && Hb[this.id].handlers['*']) || [],
          d = (Hb[this.id] && Hb[this.id].handlers[a.type]) || [],
          f = c.concat(d);
        if (f && f.length) {
          var g,
            h,
            i,
            j,
            k,
            l = this;
          for (g = 0, h = f.length; h > g; g++)
            (i = f[g]),
              (j = l),
              'string' == typeof i && 'function' == typeof e[i] && (i = e[i]),
              'object' == typeof i &&
                i &&
                'function' == typeof i.handleEvent &&
                ((j = i), (i = i.handleEvent)),
              'function' == typeof i && ((k = w({}, a)), hb(i, j, [k], b));
        }
        return this;
      }
    },
    Wb = function(a) {
      return 'string' == typeof a && (a = []), 'number' != typeof a.length ? [a] : a;
    },
    Xb = function(a) {
      if (a && 1 === a.nodeType) {
        var b = function(a) {
            (a || (a = e.event)) &&
              ('js' !== a._source && (a.stopImmediatePropagation(), a.preventDefault()),
              delete a._source);
          },
          c = function(c) {
            (c || (c = e.event)) && (b(c), Fb.focus(a));
          };
        a.addEventListener('mouseover', c, !1),
          a.addEventListener('mouseout', b, !1),
          a.addEventListener('mouseenter', b, !1),
          a.addEventListener('mouseleave', b, !1),
          a.addEventListener('mousemove', b, !1),
          (Kb[a.zcClippingId] = {
            mouseover: c,
            mouseout: b,
            mouseenter: b,
            mouseleave: b,
            mousemove: b
          });
      }
    },
    Yb = function(a) {
      if (a && 1 === a.nodeType) {
        var b = Kb[a.zcClippingId];
        if ('object' == typeof b && b) {
          for (
            var c, d, e = ['move', 'leave', 'enter', 'out', 'over'], f = 0, g = e.length;
            g > f;
            f++
          )
            (c = 'mouse' + e[f]),
              (d = b[c]),
              'function' == typeof d && a.removeEventListener(c, d, !1);
          delete Kb[a.zcClippingId];
        }
      }
    };
  (Fb._createClient = function() {
    Lb.apply(this, v(arguments));
  }),
    (Fb.prototype.on = function() {
      return Mb.apply(this, v(arguments));
    }),
    (Fb.prototype.off = function() {
      return Nb.apply(this, v(arguments));
    }),
    (Fb.prototype.handlers = function() {
      return Ob.apply(this, v(arguments));
    }),
    (Fb.prototype.emit = function() {
      return Pb.apply(this, v(arguments));
    }),
    (Fb.prototype.clip = function() {
      return Qb.apply(this, v(arguments));
    }),
    (Fb.prototype.unclip = function() {
      return Rb.apply(this, v(arguments));
    }),
    (Fb.prototype.elements = function() {
      return Sb.apply(this, v(arguments));
    }),
    (Fb.prototype.destroy = function() {
      return Tb.apply(this, v(arguments));
    }),
    (Fb.prototype.setText = function(a) {
      return Fb.setData('text/plain', a), this;
    }),
    (Fb.prototype.setHtml = function(a) {
      return Fb.setData('text/html', a), this;
    }),
    (Fb.prototype.setRichText = function(a) {
      return Fb.setData('application/rtf', a), this;
    }),
    (Fb.prototype.setData = function() {
      return Fb.setData.apply(this, v(arguments)), this;
    }),
    (Fb.prototype.clearData = function() {
      return Fb.clearData.apply(this, v(arguments)), this;
    }),
    (Fb.prototype.getData = function() {
      return Fb.getData.apply(this, v(arguments));
    }),
    'function' == typeof define && define.amd
      ? define(function() {
          return Fb;
        })
      : 'object' == typeof module && module && 'object' == typeof module.exports && module.exports
      ? (module.exports = Fb)
      : (a.ZeroClipboard = Fb);
})(
  (function() {
    return this || window;
  })()
);
