"use strict";
( () => {
    var _t = Object.create;
    var Me = Object.defineProperty;
    var Ct = Object.getOwnPropertyDescriptor;
    var Lt = Object.getOwnPropertyNames;
    var Nt = Object.getPrototypeOf
      , Rt = Object.prototype.hasOwnProperty;
    var U = (e, t) => () => (t || e((t = {
        exports: {}
    }).exports, t),
    t.exports);
    var vt = (e, t, r, n) => {
        if (t && typeof t == "object" || typeof t == "function")
            for (let o of Lt(t))
                !Rt.call(e, o) && o !== r && Me(e, o, {
                    get: () => t[o],
                    enumerable: !(n = Ct(t, o)) || n.enumerable
                });
        return e
    }
    ;
    var H = (e, t, r) => (r = e != null ? _t(Nt(e)) : {},
    vt(t || !e || !e.__esModule ? Me(r, "default", {
        value: e,
        enumerable: !0
    }) : r, e));
    var je = U( (Vr, oe) => {
        var De = function(e) {
            "use strict";
            if (typeof e != "function")
                return [];
            var t = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
              , r = /([^\s,]+)/g
              , n = e.toString().replace(t, "")
              , o = n.slice(n.indexOf("(") + 1, n.indexOf(")")).match(r);
            return o === null ? [] : o
        };
        typeof oe < "u" && typeof oe.exports < "u" && (oe.exports = De);
        typeof window < "u" && (window.GetParams = De)
    }
    );
    var ye = U( (Kr, We) => {
        We.exports = kt;
        function kt(e, t) {
            if (t !== "$")
                for (var r = Pt(t), n = 0; n < r.length; n++)
                    t = r[n].toString().replace(/\\"/g, '"'),
                    !(typeof e[t] > "u" && n !== r.length - 1) && (e = e[t]);
            return e
        }
        function Pt(e) {
            for (var t = /(?:\.(\w+))|(?:\[(\d+)\])|(?:\["((?:[^\\"]|\\.)*)"\])/g, r = [], n; n = t.exec(e); )
                r.push(n[1] || n[2] || n[3]);
            return r
        }
    }
    );
    var Be = U(ae => {
        var Mt = ye()
          , Fe = Se();
        ae.getRegexFlags = function(t) {
            var r = "";
            return t.ignoreCase && (r += "i"),
            t.global && (r += "g"),
            t.multiline && (r += "m"),
            r
        }
        ;
        ae.stringifyFunction = function(t, r) {
            if (typeof r == "function")
                return r(t);
            var n = t.toString()
              , o = n.match(/^[^{]*{|^[^=]*=>/)
              , a = o ? o[0] : "<function> "
              , i = n[n.length - 1] === "}" ? "}" : "";
            return a.replace(/\r\n|\n/g, " ").replace(/\s+/g, " ") + " /* ... */ " + i
        }
        ;
        ae.restore = function(t, r) {
            var n = t[0]
              , o = t.slice(1);
            switch (n) {
            case "$":
                return Mt(r, t);
            case "r":
                var a = o.indexOf(",")
                  , i = o.slice(0, a)
                  , s = o.slice(a + 1);
                return RegExp(s, i);
            case "d":
                return new Date(+o);
            case "f":
                var d = function() {
                    throw new Error("can't run jsan parsed function")
                };
                return d.toString = function() {
                    return o
                }
                ,
                d;
            case "u":
                return;
            case "e":
                var c = new Error(o);
                return c.stack = "Stack is unavailable for jsan parsed errors",
                c;
            case "s":
                return Symbol(o);
            case "g":
                return Symbol.for(o);
            case "m":
                return new Map(Fe.parse(o));
            case "l":
                return new Set(Fe.parse(o));
            case "n":
                return NaN;
            case "i":
                return 1 / 0;
            case "y":
                return -1 / 0;
            default:
                return console.warn("unknown type", t),
                t
            }
        }
    }
    );
    var ze = U(xe => {
        var Gr = ye()
          , Y = Be()
          , Dt = typeof WeakMap < "u" ? WeakMap : function() {
            var e = []
              , t = [];
            return {
                set: function(r, n) {
                    e.push(r),
                    t.push(n)
                },
                get: function(r) {
                    for (var n = 0; n < e.length; n++)
                        if (e[n] === r)
                            return t[n]
                }
            }
        }
        ;
        xe.decycle = function e(t, r, n, o) {
            "use strict";
            o = o || new Dt;
            var a = !Object.prototype.hasOwnProperty.call(r, "circular")
              , i = r.refs !== !1;
            return function s(d, c, u) {
                var l, S, m, f = typeof n == "function" ? n(u || "", d) : d;
                if (r.date && f instanceof Date)
                    return {
                        $jsan: "d" + f.getTime()
                    };
                if (r.regex && f instanceof RegExp)
                    return {
                        $jsan: "r" + Y.getRegexFlags(f) + "," + f.source
                    };
                if (r.function && typeof f == "function")
                    return {
                        $jsan: "f" + Y.stringifyFunction(f, r.function)
                    };
                if (r.nan && typeof f == "number" && isNaN(f))
                    return {
                        $jsan: "n"
                    };
                if (r.infinity) {
                    if (Number.POSITIVE_INFINITY === f)
                        return {
                            $jsan: "i"
                        };
                    if (Number.NEGATIVE_INFINITY === f)
                        return {
                            $jsan: "y"
                        }
                }
                if (r.undefined && f === void 0)
                    return {
                        $jsan: "u"
                    };
                if (r.error && f instanceof Error)
                    return {
                        $jsan: "e" + f.message
                    };
                if (r.symbol && typeof f == "symbol") {
                    var g = Symbol.keyFor(f);
                    return g !== void 0 ? {
                        $jsan: "g" + g
                    } : {
                        $jsan: "s" + f.toString().slice(7, -1)
                    }
                }
                if (r.map && typeof Map == "function" && f instanceof Map && typeof Array.from == "function")
                    return {
                        $jsan: "m" + JSON.stringify(e(Array.from(f), r, n, o))
                    };
                if (r.set && typeof Set == "function" && f instanceof Set && typeof Array.from == "function")
                    return {
                        $jsan: "l" + JSON.stringify(e(Array.from(f), r, n, o))
                    };
                if (f && typeof f.toJSON == "function")
                    try {
                        f = f.toJSON(u)
                    } catch {
                        var _ = u || "$";
                        return "toJSON failed for '" + (o.get(f) || _) + "'"
                    }
                if (typeof f == "object" && f !== null && !(f instanceof Boolean) && !(f instanceof Date) && !(f instanceof Number) && !(f instanceof RegExp) && !(f instanceof String) && typeof f != "symbol" && !(f instanceof Error)) {
                    if (typeof f == "object") {
                        var O = o.get(f);
                        if (O) {
                            if (a && i)
                                return {
                                    $jsan: O
                                };
                            var b = c.split(".").slice(0, -1).join(".");
                            if (b.indexOf(O) === 0)
                                return a ? {
                                    $jsan: O
                                } : typeof r.circular == "function" ? r.circular(f, c, O) : r.circular;
                            if (i)
                                return {
                                    $jsan: O
                                }
                        }
                        o.set(f, c)
                    }
                    if (Object.prototype.toString.apply(f) === "[object Array]")
                        for (m = [],
                        l = 0; l < f.length; l += 1)
                            m[l] = s(f[l], c + "[" + l + "]", l);
                    else {
                        m = {};
                        for (S in f)
                            if (Object.prototype.hasOwnProperty.call(f, S)) {
                                var x = /^\w+$/.test(S) ? "." + S : "[" + JSON.stringify(S) + "]";
                                m[S] = S === "$jsan" ? [s(f[S], c + x)] : s(f[S], c + x, S)
                            }
                    }
                    return m
                }
                return f
            }(t, "$")
        }
        ;
        xe.retrocycle = function(t) {
            "use strict";
            return function r(n) {
                var o, a, i, s;
                if (n && typeof n == "object")
                    if (Object.prototype.toString.apply(n) === "[object Array]")
                        for (o = 0; o < n.length; o += 1)
                            a = n[o],
                            a && typeof a == "object" && (a.$jsan ? n[o] = Y.restore(a.$jsan, t) : r(a));
                    else
                        for (i in n) {
                            if (typeof n[i] == "string" && i === "$jsan")
                                return Y.restore(n.$jsan, t);
                            i === "$jsan" && (n[i] = n[i][0]),
                            typeof n[i] == "object" && (a = n[i],
                            a && typeof a == "object" && (a.$jsan ? n[i] = Y.restore(a.$jsan, t) : r(a)))
                        }
                return n
            }(t)
        }
    }
    );
    var Se = U(ge => {
        var $e = ze();
        ge.stringify = function(t, r, n, o) {
            if (arguments.length < 4)
                try {
                    return arguments.length === 1 ? JSON.stringify(t) : JSON.stringify.apply(JSON, arguments)
                } catch {}
            var a = o || !1;
            typeof a == "boolean" && (a = {
                date: a,
                function: a,
                regex: a,
                undefined: a,
                error: a,
                symbol: a,
                map: a,
                set: a,
                nan: a,
                infinity: a
            });
            var i = $e.decycle(t, a, r);
            return arguments.length === 1 ? JSON.stringify(i) : JSON.stringify(i, Array.isArray(r) ? r : null, n)
        }
        ;
        ge.parse = function(t, r) {
            var n = /"\$jsan"/.test(t), o;
            return arguments.length === 1 ? o = JSON.parse(t) : o = JSON.parse(t, r),
            n && (o = $e.retrocycle(o)),
            o
        }
    }
    );
    var Q = U( (Hr, Ue) => {
        Ue.exports = Se()
    }
    );
    var Je = H(je())
      , Wt = H(Q());
    var jt = H(Q());
    function P(e, t, r) {
        return {
            data: r ? e[r]() : e,
            __serializedType__: t
        }
    }
    function Ae(e, t) {
        return {
            data: Object.assign({}, e),
            __serializedType__: t
        }
    }
    function Ve(e, t, r, n) {
        let o = P(e, t, r);
        if (!n)
            return o;
        for (let a = 0; a < n.length; a++) {
            let i = n[a];
            if (typeof i == "function" && e instanceof i)
                return o.__serializedRef__ = a,
                o
        }
        return o
    }
    var Ke = {
        refs: !1,
        date: !0,
        function: !0,
        regex: !0,
        undefined: !0,
        error: !0,
        symbol: !0,
        map: !0,
        set: !0,
        nan: !0,
        infinity: !0
    };
    function F(e, t, r, n) {
        function o(i, s) {
            return s instanceof e.Record ? Ve(s, "ImmutableRecord", "toObject", t) : s instanceof e.Range ? Ae(s, "ImmutableRange") : s instanceof e.Repeat ? Ae(s, "ImmutableRepeat") : e.OrderedMap.isOrderedMap(s) ? P(s, "ImmutableOrderedMap", "toObject") : e.Map.isMap(s) ? P(s, "ImmutableMap", "toObject") : e.List.isList(s) ? P(s, "ImmutableList", "toArray") : e.OrderedSet.isOrderedSet(s) ? P(s, "ImmutableOrderedSet", "toArray") : e.Set.isSet(s) ? P(s, "ImmutableSet", "toArray") : e.Seq.isSeq(s) ? P(s, "ImmutableSeq", "toArray") : e.Stack.isStack(s) ? P(s, "ImmutableStack", "toArray") : s
        }
        function a(i, s) {
            if (typeof s == "object" && s !== null && "__serializedType__"in s) {
                let d = s;
                switch (d.__serializedType__) {
                case "ImmutableMap":
                    return e.Map(d.data);
                case "ImmutableOrderedMap":
                    return e.OrderedMap(d.data);
                case "ImmutableList":
                    return e.List(d.data);
                case "ImmutableRange":
                    return e.Range(d.data._start, d.data._end, d.data._step);
                case "ImmutableRepeat":
                    return e.Repeat(d.data._value, d.data.size);
                case "ImmutableSet":
                    return e.Set(d.data);
                case "ImmutableOrderedSet":
                    return e.OrderedSet(d.data);
                case "ImmutableSeq":
                    return e.Seq(d.data);
                case "ImmutableStack":
                    return e.Stack(d.data);
                case "ImmutableRecord":
                    return t && t[d.__serializedRef__] ? new t[d.__serializedRef__](d.data) : e.Map(d.data);
                default:
                    return d.data
                }
            }
            return s
        }
        return {
            replacer: r ? function(i, s) {
                return r(i, s, o)
            }
            : o,
            reviver: n ? function(i, s) {
                return n(i, s, a)
            }
            : a,
            options: Ke
        }
    }
    function Xe(e) {
        return Array.isArray(e)
    }
    function ie(e) {
        let t = e.actionsDenylist ?? e.actionsBlacklist
          , r = e.actionsAllowlist ?? e.actionsWhitelist;
        if (t || r)
            return {
                allowlist: Xe(r) ? r.join("|") : r,
                denylist: Xe(t) ? t.join("|") : t
            }
    }
    function qe(e) {
        let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ""
          , r = [];
        return Object.keys(e).forEach(n => {
            let o = e[n];
            typeof o == "function" ? r.push({
                name: t + (n || o.name || "anonymous"),
                func: o,
                args: (0,
                Je.default)(o)
            }) : typeof o == "object" && (r = r.concat(qe(o, t + n + ".")))
        }
        ),
        r
    }
    function se(e) {
        return Array.isArray(e) ? e : qe(e)
    }
    var Ge = e => new Function("return " + e)();
    function Ft(e, t) {
        let r = e.map(Ge);
        if (!t)
            return r;
        let n = Ge(t);
        if (Array.isArray(n))
            return r.concat(...n);
        throw new Error("rest must be an array")
    }
    function He(e, t) {
        if (typeof e == "string")
            return new Function("return " + e)();
        let r = t[e.selected].func
          , n = Ft(e.args, e.rest);
        return r(...n)
    }
    var Bt = typeof global == "object" && global && global.Object === Object && global
      , Ye = Bt;
    var zt = typeof self == "object" && self && self.Object === Object && self
      , $t = Ye || zt || Function("return this")()
      , fe = $t;
    var Ut = fe.Symbol
      , V = Ut;
    var Qe = Object.prototype
      , Vt = Qe.hasOwnProperty
      , Kt = Qe.toString
      , Z = V ? V.toStringTag : void 0;
    function Xt(e) {
        var t = Vt.call(e, Z)
          , r = e[Z];
        try {
            e[Z] = void 0;
            var n = !0
        } catch {}
        var o = Kt.call(e);
        return n && (t ? e[Z] = r : delete e[Z]),
        o
    }
    var Ze = Xt;
    var Gt = Object.prototype
      , Jt = Gt.toString;
    function qt(e) {
        return Jt.call(e)
    }
    var et = qt;
    var Ht = "[object Null]"
      , Yt = "[object Undefined]"
      , tt = V ? V.toStringTag : void 0;
    function Qt(e) {
        return e == null ? e === void 0 ? Yt : Ht : tt && tt in Object(e) ? Ze(e) : et(e)
    }
    var rt = Qt;
    function Zt(e) {
        return e != null && typeof e == "object"
    }
    var nt = Zt;
    var er = "[object Symbol]";
    function tr(e) {
        return typeof e == "symbol" || nt(e) && rt(e) == er
    }
    var ot = tr;
    var rr = /\s/;
    function nr(e) {
        for (var t = e.length; t-- && rr.test(e.charAt(t)); )
            ;
        return t
    }
    var at = nr;
    var or = /^\s+/;
    function ar(e) {
        return e && e.slice(0, at(e) + 1).replace(or, "")
    }
    var it = ar;
    function ir(e) {
        var t = typeof e;
        return e != null && (t == "object" || t == "function")
    }
    var B = ir;
    var st = NaN
      , sr = /^[-+]0x[0-9a-f]+$/i
      , fr = /^0b[01]+$/i
      , dr = /^0o[0-7]+$/i
      , ur = parseInt;
    function cr(e) {
        if (typeof e == "number")
            return e;
        if (ot(e))
            return st;
        if (B(e)) {
            var t = typeof e.valueOf == "function" ? e.valueOf() : e;
            e = B(t) ? t + "" : t
        }
        if (typeof e != "string")
            return e === 0 ? e : +e;
        e = it(e);
        var r = fr.test(e);
        return r || dr.test(e) ? ur(e.slice(2), r ? 2 : 8) : sr.test(e) ? st : +e
    }
    var he = cr;
    var lr = function() {
        return fe.Date.now()
    }
      , de = lr;
    var pr = "Expected a function"
      , mr = Math.max
      , yr = Math.min;
    function Sr(e, t, r) {
        var n, o, a, i, s, d, c = 0, u = !1, l = !1, S = !0;
        if (typeof e != "function")
            throw new TypeError(pr);
        t = he(t) || 0,
        B(r) && (u = !!r.leading,
        l = "maxWait"in r,
        a = l ? mr(he(r.maxWait) || 0, t) : a,
        S = "trailing"in r ? !!r.trailing : S);
        function m(p) {
            var w = n
              , I = o;
            return n = o = void 0,
            c = p,
            i = e.apply(I, w),
            i
        }
        function f(p) {
            return c = p,
            s = setTimeout(O, t),
            u ? m(p) : i
        }
        function g(p) {
            var w = p - d
              , I = p - c
              , L = t - w;
            return l ? yr(L, a - I) : L
        }
        function _(p) {
            var w = p - d
              , I = p - c;
            return d === void 0 || w >= t || w < 0 || l && I >= a
        }
        function O() {
            var p = de();
            if (_(p))
                return b(p);
            s = setTimeout(O, g(p))
        }
        function b(p) {
            return s = void 0,
            S && n ? m(p) : (n = o = void 0,
            i)
        }
        function x() {
            s !== void 0 && clearTimeout(s),
            c = 0,
            n = d = o = s = void 0
        }
        function E() {
            return s === void 0 ? i : b(de())
        }
        function A() {
            var p = de()
              , w = _(p);
            if (n = arguments,
            o = this,
            d = p,
            w) {
                if (s === void 0)
                    return f(d);
                if (l)
                    return clearTimeout(s),
                    s = setTimeout(O, t),
                    m(d)
            }
            return s === void 0 && (s = setTimeout(O, t)),
            i
        }
        return A.cancel = x,
        A.flush = E,
        A
    }
    var ft = Sr;
    var xr = "Expected a function";
    function gr(e, t, r) {
        var n = !0
          , o = !0;
        if (typeof e != "function")
            throw new TypeError(xr);
        return B(r) && (n = "leading"in r ? !!r.leading : n,
        o = "trailing"in r ? !!r.trailing : o),
        ft(e, t, {
            leading: n,
            maxWait: t,
            trailing: o
        })
    }
    var K = gr;
    var Ee = () => Math.random().toString(36).substring(7).split("").join(".")
      , Jn = {
        INIT: `@@redux/INIT${Ee()}`,
        REPLACE: `@@redux/REPLACE${Ee()}`,
        PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${Ee()}`
    };
    function dt(e) {
        if (typeof e != "object" || e === null)
            return !1;
        let t = e;
        for (; Object.getPrototypeOf(t) !== null; )
            t = Object.getPrototypeOf(t);
        return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null
    }
    function ut(...e) {
        return e.length === 0 ? t => t : e.length === 1 ? e[0] : e.reduce( (t, r) => (...n) => t(r(...n)))
    }
    function Ie() {
        return typeof Symbol == "function" && Symbol.observable || "@@observable"
    }
    var T = {
        PERFORM_ACTION: "PERFORM_ACTION",
        RESET: "RESET",
        ROLLBACK: "ROLLBACK",
        COMMIT: "COMMIT",
        SWEEP: "SWEEP",
        TOGGLE_ACTION: "TOGGLE_ACTION",
        SET_ACTIONS_ACTIVE: "SET_ACTIONS_ACTIVE",
        JUMP_TO_STATE: "JUMP_TO_STATE",
        JUMP_TO_ACTION: "JUMP_TO_ACTION",
        REORDER_ACTION: "REORDER_ACTION",
        IMPORT_STATE: "IMPORT_STATE",
        LOCK_CHANGES: "LOCK_CHANGES",
        PAUSE_RECORDING: "PAUSE_RECORDING"
    }
      , lt = typeof window == "object" && (typeof window.chrome < "u" || typeof window.process < "u" && window.process.type === "renderer")
      , Ar = lt || typeof process < "u" && process.release && process.release.name === "node"
      , hr = {
        performAction(e, t, r, n) {
            if (!dt(e))
                throw new Error("Actions must be plain objects. Use custom middleware for async actions.");
            if (typeof e.type > "u")
                throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');
            let o;
            if (t) {
                let a = 0;
                if (typeof t == "function")
                    o = t(e);
                else {
                    let i = Error(), s;
                    if (Error.captureStackTrace && Ar ? (r && Error.stackTraceLimit < r && (s = Error.stackTraceLimit,
                    Error.stackTraceLimit = r),
                    Error.captureStackTrace(i, n)) : a = 3,
                    o = i.stack,
                    s && (Error.stackTraceLimit = s),
                    (a || typeof Error.stackTraceLimit != "number" || r && Error.stackTraceLimit > r) && o != null) {
                        let d = o.split(`
`);
                        r && d.length > r && (o = d.slice(0, r + a + (d[0].startsWith("Error") ? 1 : 0)).join(`
`))
                    }
                }
            }
            return {
                type: T.PERFORM_ACTION,
                action: e,
                timestamp: Date.now(),
                stack: o
            }
        },
        reset() {
            return {
                type: T.RESET,
                timestamp: Date.now()
            }
        },
        rollback() {
            return {
                type: T.ROLLBACK,
                timestamp: Date.now()
            }
        },
        commit() {
            return {
                type: T.COMMIT,
                timestamp: Date.now()
            }
        },
        sweep() {
            return {
                type: T.SWEEP
            }
        },
        toggleAction(e) {
            return {
                type: T.TOGGLE_ACTION,
                id: e
            }
        },
        setActionsActive(e, t) {
            let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
            return {
                type: T.SET_ACTIONS_ACTIVE,
                start: e,
                end: t,
                active: r
            }
        },
        reorderAction(e, t) {
            return {
                type: T.REORDER_ACTION,
                actionId: e,
                beforeActionId: t
            }
        },
        jumpToState(e) {
            return {
                type: T.JUMP_TO_STATE,
                index: e
            }
        },
        jumpToAction(e) {
            return {
                type: T.JUMP_TO_ACTION,
                actionId: e
            }
        },
        importState(e, t) {
            return {
                type: T.IMPORT_STATE,
                nextLiftedState: e,
                noRecompute: t
            }
        },
        lockChanges(e) {
            return {
                type: T.LOCK_CHANGES,
                status: e
            }
        },
        pauseRecording(e) {
            return {
                type: T.PAUSE_RECORDING,
                status: e
            }
        }
    }
      , D = {
        type: "@@INIT"
    };
    function Er(e, t, r) {
        let n = r, o;
        try {
            n = e(r, t)
        } catch (a) {
            o = a.toString(),
            lt ? setTimeout( () => {
                throw a
            }
            ) : console.error(a)
        }
        return {
            state: n,
            error: o
        }
    }
    function pt(e, t, r, n) {
        return n ? Er(e, t, r) : {
            state: e(r, t)
        }
    }
    function ct(e, t, r, n, o, a, i, s) {
        if (!e || t === -1 || t >= e.length && e.length === a.length)
            return e;
        let d = e.slice(0, t);
        for (let c = t; c < a.length; c++) {
            let u = a[c], l = o[u].action, S = d[c - 1], m = S ? S.state : n, f = i.includes(u), g;
            f ? g = S : s && S && S.error ? g = {
                state: m,
                error: "Interrupted by an error up the chain"
            } : g = pt(r, l, m, s),
            d.push(g)
        }
        return d
    }
    function R(e, t, r, n) {
        return hr.performAction(e, t, r, n)
    }
    function Ir(e) {
        return Array.isArray(e)
    }
    function br(e, t, r, n) {
        let o = {
            monitorState: r(void 0, {}),
            nextActionId: 1,
            actionsById: {
                0: R(D)
            },
            stagedActionIds: [0],
            skippedActionIds: [],
            committedState: t,
            currentStateIndex: 0,
            computedStates: [],
            isLocked: n.shouldStartLocked === !0,
            isPaused: n.shouldRecordChanges === !1
        };
        return (a, i) => {
            let {monitorState: s, actionsById: d, nextActionId: c, stagedActionIds: u, skippedActionIds: l, committedState: S, currentStateIndex: m, computedStates: f, isLocked: g, isPaused: _} = a || o;
            a || (d = {
                ...d
            });
            function O(A) {
                let p = A
                  , w = u.slice(1, p + 1);
                for (let I = 0; I < w.length; I++)
                    if (f[I + 1].error) {
                        p = I,
                        w = u.slice(1, p + 1);
                        break
                    } else
                        delete d[w[I]];
                l = l.filter(I => !w.includes(I)),
                u = [0, ...u.slice(p + 1)],
                S = f[p].state,
                f = f.slice(p),
                m = m > p ? m - p : 0
            }
            function b(A) {
                let p;
                return A ? (p = f[m],
                s = r(s, i)) : p = pt(e, i.action, f[m].state, !1),
                !n.pauseActionType || c === 1 ? {
                    monitorState: s,
                    actionsById: {
                        0: R(D)
                    },
                    nextActionId: 1,
                    stagedActionIds: [0],
                    skippedActionIds: [],
                    committedState: p.state,
                    currentStateIndex: 0,
                    computedStates: [p],
                    isLocked: g,
                    isPaused: !0
                } : (A && (m === u.length - 1 && m++,
                u = [...u, c],
                c++),
                {
                    monitorState: s,
                    actionsById: {
                        ...d,
                        [c - 1]: R({
                            type: n.pauseActionType
                        })
                    },
                    nextActionId: c,
                    stagedActionIds: u,
                    skippedActionIds: l,
                    committedState: S,
                    currentStateIndex: m,
                    computedStates: [...f.slice(0, u.length - 1), p],
                    isLocked: g,
                    isPaused: !0
                })
            }
            let x = 0
              , E = n.maxAge;
            if (typeof E == "function" && (E = E(i, a)),
            /^@@redux\/(INIT|REPLACE)/.test(i.type))
                n.shouldHotReload === !1 && (d = {
                    0: R(D)
                },
                c = 1,
                u = [0],
                l = [],
                S = f.length === 0 ? t : f[m].state,
                m = 0,
                f = []),
                x = 0,
                E && u.length > E && (f = ct(f, x, e, S, d, u, l, n.shouldCatchErrors),
                O(u.length - E),
                x = 1 / 0);
            else
                switch (i.type) {
                case T.PERFORM_ACTION:
                    {
                        if (g)
                            return a || o;
                        if (_)
                            return b();
                        E && u.length >= E && O(u.length - E + 1),
                        m === u.length - 1 && m++;
                        let A = c++;
                        d[A] = i,
                        u = [...u, A],
                        x = u.length - 1;
                        break
                    }
                case T.RESET:
                    {
                        d = {
                            0: R(D)
                        },
                        c = 1,
                        u = [0],
                        l = [],
                        S = t,
                        m = 0,
                        f = [];
                        break
                    }
                case T.COMMIT:
                    {
                        d = {
                            0: R(D)
                        },
                        c = 1,
                        u = [0],
                        l = [],
                        S = f[m].state,
                        m = 0,
                        f = [];
                        break
                    }
                case T.ROLLBACK:
                    {
                        d = {
                            0: R(D)
                        },
                        c = 1,
                        u = [0],
                        l = [],
                        m = 0,
                        f = [];
                        break
                    }
                case T.TOGGLE_ACTION:
                    {
                        let {id: A} = i;
                        l.indexOf(A) === -1 ? l = [A, ...l] : l = l.filter(w => w !== A),
                        x = u.indexOf(A);
                        break
                    }
                case T.SET_ACTIONS_ACTIVE:
                    {
                        let {start: A, end: p, active: w} = i
                          , I = [];
                        for (let L = A; L < p; L++)
                            I.push(L);
                        if (w) {
                            let L = new Set(I);
                            l = l.filter(j => !L.has(j))
                        } else {
                            let L = new Set(l);
                            l = [...l, ...I.filter(j => !L.has(j))]
                        }
                        x = u.indexOf(A);
                        break
                    }
                case T.JUMP_TO_STATE:
                    {
                        m = i.index,
                        x = 1 / 0;
                        break
                    }
                case T.JUMP_TO_ACTION:
                    {
                        let A = u.indexOf(i.actionId);
                        A !== -1 && (m = A),
                        x = 1 / 0;
                        break
                    }
                case T.SWEEP:
                    {
                        let A = new Set(l);
                        u = u.filter(p => !A.has(p)),
                        l = [],
                        m = Math.min(m, u.length - 1);
                        break
                    }
                case T.REORDER_ACTION:
                    {
                        let A = i.actionId
                          , p = u.indexOf(A);
                        if (p < 1)
                            break;
                        let w = i.beforeActionId
                          , I = u.indexOf(w);
                        if (I < 1) {
                            let j = u.length;
                            I = w > u[j - 1] ? j : 1
                        }
                        let L = p - I;
                        L > 0 ? (u = [...u.slice(0, I), A, ...u.slice(I, p), ...u.slice(p + 1)],
                        x = I) : L < 0 && (u = [...u.slice(0, p), ...u.slice(p + 1, I), A, ...u.slice(I)],
                        x = p);
                        break
                    }
                case T.IMPORT_STATE:
                    {
                        Ir(i.nextLiftedState) ? (d = {
                            0: R(D)
                        },
                        c = 1,
                        u = [0],
                        l = [],
                        m = i.nextLiftedState.length,
                        f = [],
                        S = i.preloadedState,
                        x = 0,
                        i.nextLiftedState.forEach(A => {
                            d[c] = R(A, n.trace || n.shouldIncludeCallstack),
                            u.push(c),
                            c++
                        }
                        )) : ({monitorState: s, actionsById: d, nextActionId: c, stagedActionIds: u, skippedActionIds: l, committedState: S, currentStateIndex: m, computedStates: f} = i.nextLiftedState,
                        i.noRecompute && (x = 1 / 0));
                        break
                    }
                case T.LOCK_CHANGES:
                    {
                        g = i.status,
                        x = 1 / 0;
                        break
                    }
                case T.PAUSE_RECORDING:
                    {
                        if (_ = i.status,
                        _)
                            return b(!0);
                        d = {
                            0: R(D)
                        },
                        c = 1,
                        u = [0],
                        l = [],
                        S = f[m].state,
                        m = 0,
                        f = [];
                        break
                    }
                default:
                    {
                        x = 1 / 0;
                        break
                    }
                }
            return f = ct(f, x, e, S, d, u, l, n.shouldCatchErrors),
            s = r(s, i),
            {
                monitorState: s,
                actionsById: d,
                nextActionId: c,
                stagedActionIds: u,
                skippedActionIds: l,
                committedState: S,
                currentStateIndex: m,
                computedStates: f,
                isLocked: g,
                isPaused: _
            }
        }
    }
    function Or(e) {
        let {computedStates: t, currentStateIndex: r} = e
          , {state: n} = t[r];
        return n
    }
    function Tr(e, t, r) {
        let n, o = r.trace || r.shouldIncludeCallstack, a = r.traceLimit || 10;
        function i() {
            let c = Or(e.getState());
            return c !== void 0 && (n = c),
            n
        }
        function s(c) {
            return e.dispatch(R(c, o, a, s)),
            c
        }
        let d = Ie();
        return d in e || console.warn("Symbol.observable as defined by Redux and Redux DevTools do not match. This could cause your app to behave differently if the DevTools are not loaded. Consider polyfilling Symbol.observable before Redux is imported or avoid polyfilling Symbol.observable altogether."),
        {
            liftedStore: e,
            dispatch: s,
            subscribe: e.subscribe,
            getState: i,
            replaceReducer(c) {
                e.replaceReducer(t(c))
            },
            [d]() {
                return {
                    subscribe(c) {
                        if (typeof c != "object")
                            throw new TypeError("Expected the observer to be an object.");
                        function u() {
                            c.next && c.next(i())
                        }
                        return u(),
                        {
                            unsubscribe: e.subscribe(u)
                        }
                    },
                    [d]() {
                        return this
                    }
                }
            }
        }
    }
    function mt() {
        let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : () => null
          , t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (typeof t.maxAge == "number" && t.maxAge < 2)
            throw new Error("DevTools.instrument({ maxAge }) option, if specified, may not be less than 2.");
        return r => (n, o) => {
            function a(s) {
                if (typeof s != "function")
                    throw s && typeof s.default == "function" ? new Error('Expected the reducer to be a function. Instead got an object with a "default" field. Did you pass a module instead of the default export? Try passing require(...).default instead.') : new Error("Expected the reducer to be a function.");
                return br(s, o, e, t)
            }
            let i = r(a(n));
            if (i.liftedStore)
                throw new Error("DevTools instrumentation should not be applied more than once. Check your store configuration.");
            return Tr(i, a, t)
        }
    }
    function ue(e) {
        let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : o => o
          , r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : o => o;
        if (!e)
            return o => function() {
                return o(...arguments)
            }
            ;
        function n(o) {
            return {
                ...o,
                actionsById: Object.fromEntries(Object.entries(o.actionsById).map(a => {
                    let[i,s] = a;
                    return [i, {
                        ...s,
                        action: r(s.action)
                    }]
                }
                )),
                committedState: t(o.committedState),
                computedStates: o.computedStates.map(a => ({
                    ...a,
                    state: t(a.state)
                }))
            }
        }
        return o => (a, i) => {
            let s = `redux-dev-session-${e}`, d;
            try {
                let u = localStorage.getItem(s);
                u && (d = n(JSON.parse(u)) || i,
                o(a, i))
            } catch (u) {
                console.warn("Could not read debug session from localStorage:", u);
                try {
                    localStorage.removeItem(s)
                } finally {
                    d = void 0
                }
            }
            let c = o(a, d);
            return {
                ...c,
                dispatch(u) {
                    c.dispatch(u);
                    try {
                        localStorage.setItem(s, JSON.stringify(c.getState()))
                    } catch (l) {
                        console.warn("Could not write debug session to localStorage:", l)
                    }
                    return u
                }
            }
        }
    }
    function be(e) {
        let t = new RegExp(`[?&]${e}=([^&#]+)\\b`).exec(window.location.href);
        return t && t.length > 0 ? t[1] : null
    }
    function Oe(e, t, r) {
        return ut(mt(t, {
            maxAge: r.maxAge,
            trace: r.trace,
            traceLimit: r.traceLimit,
            shouldCatchErrors: r.shouldCatchErrors || window.shouldCatchErrors,
            shouldHotReload: r.shouldHotReload,
            shouldRecordChanges: r.shouldRecordChanges,
            shouldStartLocked: r.shouldStartLocked,
            pauseActionType: r.pauseActionType || "@@PAUSED"
        }), ue(be("debug_session")))(e)
    }
    var yt = {
        DO_NOT_FILTER: "DO_NOT_FILTER",
        DENYLIST_SPECIFIC: "DENYLIST_SPECIFIC",
        ALLOWLIST_SPECIFIC: "ALLOWLIST_SPECIFIC"
    }
      , ee = e => !e && (!window.devToolsOptions || !window.devToolsOptions.filter || window.devToolsOptions.filter === yt.DO_NOT_FILTER);
    function z(e, t) {
        if (ee(t) || typeof e != "string" && typeof e.type.match != "function")
            return !1;
        let {allowlist: r, denylist: n} = t || window.devToolsOptions || {}
          , o = e.type || e;
        return r && !o.match(r) || n && o.match(n)
    }
    function wr(e, t) {
        return t ? Object.fromEntries(Object.entries(e).map( ([r,n]) => [r, {
            ...n,
            action: t(n.action, r)
        }])) : e
    }
    function _r(e, t) {
        return t ? e.map( (r, n) => ({
            ...r,
            state: t(r.state, n)
        })) : e
    }
    function Te(e, t, r, n, o) {
        if (o || !ee(t)) {
            let a = []
              , i = []
              , s = n && {}
              , {actionsById: d} = e
              , {computedStates: c} = e;
            return e.stagedActionIds.forEach( (u, l) => {
                let S = d[u];
                if (!S)
                    return;
                let m = S.action
                  , f = c[l]
                  , g = f.state;
                l && (o && !o(g, m) || z(m, t)) || (a.push(u),
                i.push(r ? {
                    ...f,
                    state: r(g, l)
                } : f),
                n && (s[u] = {
                    ...S,
                    action: n(m, u)
                }))
            }
            ),
            {
                ...e,
                actionsById: s || d,
                stagedActionIds: a,
                computedStates: i
            }
        }
        return !r && !n ? e : {
            ...e,
            actionsById: wr(e.actionsById, n),
            computedStates: _r(e.computedStates, r)
        }
    }
    function St(e, t, r, n, o, a) {
        let i = t.stagedActionIds;
        if (e <= i[1])
            return t;
        let s = i.indexOf(e);
        if (s === -1)
            return t;
        let d = a || !ee(r), c = d ? [0] : i, u = t.actionsById, l = t.computedStates, S = {}, m = [], f, g, _;
        for (let O = d ? 1 : s; O < i.length; O++)
            f = i[O],
            g = u[f],
            _ = l[O],
            !(d && (a && !a(_.state, g.action) || z(g.action, r) || (c.push(f),
            O < s))) && (S[f] = o ? {
                ...g,
                action: o(g.action, f)
            } : g,
            m.push(n ? {
                ..._,
                state: n(_.state, O)
            } : _));
        if (m.length !== 0)
            return {
                actionsById: S,
                computedStates: m,
                stagedActionIds: c,
                currentStateIndex: t.currentStateIndex,
                nextActionId: t.nextActionId
            }
    }
    var Cr;
    var Lr = e => e !== "" ? e.split(`
`).filter(Boolean).join("|") : null;
    var xt = (e=Cr) => !e || e.inject || !e.urls || location.href.match(Lr(e.urls));
    var te = class {
        constructor(t) {
            this.reducer = (t={}, r) => (this.active && (this.lastAction = r.type,
            r.type === "LOCK_CHANGES" ? window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ = r.status : r.type === "PAUSE_RECORDING" ? this.paused = r.status : this.isHotReloaded() && setTimeout(this.update, 0)),
            t);
            this.start = t => {
                this.active = !0,
                t || this.update()
            }
            ;
            this.stop = () => {
                this.active = !1,
                clearTimeout(this.waitingTimeout)
            }
            ;
            this.isHotReloaded = () => this.lastAction && /^@@redux\/(INIT|REPLACE)/.test(this.lastAction);
            this.isMonitorAction = () => this.lastAction && this.lastAction !== "PERFORM_ACTION";
            this.isTimeTraveling = () => this.lastAction === "JUMP_TO_STATE" || this.lastAction === "JUMP_TO_ACTION";
            this.isPaused = () => this.paused ? this.lastAction !== "BLOCKED" ? (window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ || (this.lastAction = "BLOCKED"),
            !1) : !0 : !1;
            this.isLocked = () => window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ ? this.lastAction !== "BLOCKED" ? (this.lastAction = "BLOCKED",
            !1) : !0 : !1;
            this.update = t
        }
    }
    ;
    var we, gt = 0;
    function Nr(e) {
        let t = 1;
        return function(r) {
            if (r)
                return t = 1,
                0;
            let n = Math.pow(2, t - 1);
            return t < 5 && (t += 1),
            n * e
        }
    }
    var At = Nr(5e3);
    function Rr(e) {
        we && !we() || window.postMessage({
            source: "@devtools-page",
            type: "ERROR",
            message: e
        }, "*")
    }
    function vr(e) {
        window.devToolsOptions && !window.devToolsOptions.shouldCatchErrors || e.timeStamp - gt < At() || (gt = e.timeStamp,
        At(!0),
        Rr(e.message))
    }
    function ce(e) {
        we = e,
        window.addEventListener("error", vr, !1)
    }
    var le = H(Q());
    function kr(e) {
        return !!e.immutable
    }
    function Pr(e) {
        return !!e.immutable
    }
    function re(e, {serialize: t}) {
        if (!e)
            return;
        let r = le.default.parse;
        t && (kr(t) ? r = i => le.default.parse(i, F(t.immutable, t.refs, t.replacer, t.reviver).reviver) : Pr(t) && (r = i => le.default.parse(i, t.reviver)));
        let n = r(e)
          , o = "payload"in n && n.preloadedState ? r(n.preloadedState) : void 0;
        return {
            nextLiftedState: "payload"in n ? r(n.payload) : n,
            preloadedState: o
        }
    }
    function Mr(e) {
        window.postMessage(e, "*")
    }
    function pe(e) {
        Mr({
            source: "@devtools-page",
            type: "OPEN",
            position: e ?? "window"
        })
    }
    var Dr = 0;
    function X(e) {
        return e || ++Dr
    }
    var _e = H(Q());
    var G = {}
      , $ = "@devtools-page";
    function jr(e, t) {
        return t && t.window === t ? "[WINDOW]" : t
    }
    function Wr(e) {
        try {
            return JSON.stringify(e)
        } catch {
            return _e.default.stringify(e, jr, void 0, {
                circular: "[CIRCULAR]",
                date: !0
            })
        }
    }
    var ht;
    function v(e, t) {
        let r = typeof t > "u" ? Wr(e) : _e.default.stringify(e, t.replacer, void 0, t.options);
        return !ht && r && r.length > 16 * 1024 * 1024 && (console.warn("Application state or actions payloads are too large making Redux DevTools serialization slow and consuming a lot of memory. See https://github.com/reduxjs/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu on how to configure it."),
        ht = !0),
        r
    }
    function me(e) {
        let t = e.serialize;
        if (t) {
            if (t === !0)
                return {
                    options: !0
                };
            if (t.immutable) {
                let r = F(t.immutable, t.refs, t.replacer, t.reviver);
                return {
                    replacer: r.replacer,
                    reviver: r.reviver,
                    options: typeof t.options == "object" ? {
                        ...r.options,
                        ...t.options
                    } : r.options
                }
            }
            return !t.replacer && !t.reviver ? {
                options: t.options
            } : {
                replacer: t.replacer,
                reviver: t.reviver,
                options: t.options || !0
            }
        }
    }
    function M(e) {
        window.postMessage(e, "*")
    }
    function Fr(e, t) {
        if (!e.trace)
            return;
        if (typeof e.trace == "function")
            return e.trace();
        let r, n = 0, o, a = e.traceLimit, i = Error();
        if (Error.captureStackTrace ? (Error.stackTraceLimit < a && (o = Error.stackTraceLimit,
        Error.stackTraceLimit = a),
        Error.captureStackTrace(i, t)) : n = 3,
        r = i.stack,
        o && (Error.stackTraceLimit = o),
        n || typeof Error.stackTraceLimit != "number" || Error.stackTraceLimit > a) {
            let s = r.split(`
`);
            s.length > a && (r = s.slice(0, a + n + (s[0] === "Error" ? 1 : 0)).join(`
`))
        }
        return r
    }
    function Et(e, t, r) {
        let n = Date.now()
          , o = Fr(t, r);
        return typeof e == "string" ? {
            action: {
                type: e
            },
            timestamp: n,
            stack: o
        } : e.type ? e.action ? o ? {
            stack: o,
            ...e
        } : e : {
            action: e,
            timestamp: n,
            stack: o
        } : {
            action: {
                type: "update"
            },
            timestamp: n,
            stack: o
        }
    }
    function N(e, t, r) {
        if (e.type === "ACTION")
            M({
                ...e,
                action: v(e.action, r),
                payload: v(e.payload, t)
            });
        else if (e.type === "STATE") {
            let {actionsById: n, computedStates: o, committedState: a, ...i} = e.payload;
            M({
                ...e,
                payload: i,
                actionsById: v(n, r),
                computedStates: v(o, t),
                committedState: typeof a < "u"
            })
        } else if (e.type === "PARTIAL_STATE") {
            let {actionsById: n, computedStates: o, committedState: a, ...i} = e.payload;
            M({
                ...e,
                payload: i,
                actionsById: v(n, r),
                computedStates: v(o, t),
                committedState: typeof a < "u"
            })
        } else
            e.type === "EXPORT" ? M({
                ...e,
                payload: v(e.payload, r),
                committedState: typeof e.committedState < "u" ? v(e.committedState, t) : e.committedState
            }) : M(e)
    }
    function ne(e, t, r, n, o) {
        let a = e;
        typeof r != "object" && (r = {},
        e && (a = Et(e, r, ne))),
        N(e ? {
            type: "ACTION",
            action: a,
            payload: t,
            maxAge: r.maxAge,
            source: $,
            name: r.name || o,
            instanceId: r.instanceId || n || 1
        } : {
            type: "STATE",
            action: a,
            payload: t,
            maxAge: r.maxAge,
            source: $,
            name: r.name || o,
            instanceId: r.instanceId || n || 1
        }, r.serialize, r.serialize)
    }
    function Ce(e) {
        if (!e || e.source !== window)
            return;
        let t = e.data;
        !t || t.source !== "@devtools-extension" || Object.keys(G).forEach(r => {
            if (t.id && r !== t.id)
                return;
            let n = G[r];
            typeof n == "function" ? n(t) : n.forEach(o => {
                o(t)
            }
            )
        }
        )
    }
    function Le(e, t) {
        G[t] = e,
        window.addEventListener("message", Ce, !1)
    }
    var Br = (e, t) => r => {
        r.type === "IMPORT" ? e({
            type: "DISPATCH",
            payload: {
                type: "IMPORT_STATE",
                ...re(r.state, t)
            }
        }) : e(r)
    }
    ;
    function It() {
        window.removeEventListener("message", Ce),
        M({
            type: "DISCONNECT",
            source: $
        })
    }
    function bt(e) {
        let t = e || {}
          , r = X(t.instanceId);
        t.instanceId || (t.instanceId = r),
        t.name || (t.name = document.title && r === 1 ? document.title : `Instance ${r}`),
        t.serialize && (t.serialize = me(t));
        let n = t.actionCreators || {}
          , o = t.latency
          , a = t.predicate
          , i = ie(t)
          , s = t.autoPause
          , d = s
          , c = []
          , u = []
          , l = b => {
            if (s && (b.type === "START" ? d = !1 : b.type === "STOP" && (d = !0)),
            b.type === "DISPATCH") {
                let x = b.payload;
                x.type === "PAUSE_RECORDING" && (d = x.status,
                N({
                    type: "LIFTED",
                    liftedState: {
                        isPaused: d
                    },
                    instanceId: r,
                    source: $
                }))
            }
        }
        ;
        G[r] = [l];
        let S = b => {
            if (!b)
                return;
            let x = Br(b, t)
              , E = G[r];
            return E.push(x),
            function() {
                let p = E.indexOf(x);
                E.splice(p, 1)
            }
        }
          , m = () => {
            delete G[r]
        }
          , f = K( () => {
            ne(c, u, t),
            c = [],
            u = []
        }
        , o)
          , g = (b, x) => {
            if (d || z(b, i) || a && !a(x, b))
                return;
            let E = b
              , A = t.stateSanitizer ? t.stateSanitizer(x) : x;
            if (b && (t.getActionType ? (E = t.getActionType(b),
            typeof E != "object" && (E = {
                action: {
                    type: E
                },
                timestamp: Date.now()
            })) : t.actionSanitizer && (E = t.actionSanitizer(b)),
            E = Et(E, t, g),
            o)) {
                c.push(E),
                u.push(A),
                f();
                return
            }
            ne(E, A, t)
        }
          , _ = (b, x) => {
            let E = {
                type: "INIT",
                payload: v(b, t.serialize),
                instanceId: r,
                source: $
            };
            x && Array.isArray(x) ? (E.action = v(x),
            E.name = t.name) : (x && (E.liftedState = x,
            x.isPaused && (d = !0)),
            E.libConfig = {
                actionCreators: JSON.stringify(se(n)),
                name: t.name || document.title,
                features: t.features,
                serialize: !!t.serialize,
                type: t.type
            }),
            M(E)
        }
          , O = b => {
            M({
                type: "ERROR",
                payload: b,
                instanceId: r,
                source: $
            })
        }
        ;
        return window.addEventListener("message", Ce, !1),
        M({
            type: "INIT_INSTANCE",
            instanceId: r,
            source: $
        }),
        {
            init: _,
            subscribe: S,
            unsubscribe: m,
            send: g,
            error: O
        }
    }
    function Ot() {
        try {
            return window.self !== window.top
        } catch {
            return !0
        }
    }
    var k = "@devtools-page", Ne = {}, J;
    function Tt(e, t) {
        console.warn(`${e} parameter is deprecated, use ${t} instead: https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md`)
    }
    function Re(e) {
        typeof e != "object" && (e = {}),
        window.devToolsOptions || (window.devToolsOptions = {});
        let t, r = !1, n, o, a = 1, i = X(e.instanceId), s = ie(e), d = me(e), c = me(e), {stateSanitizer: u, actionSanitizer: l, predicate: S, latency: m=500} = e;
        e.actionsWhitelist && Tt("actionsWhiteList", "actionsAllowlist"),
        e.actionsBlacklist && Tt("actionsBlacklist", "actionsDenylist");
        let f = K( (y, h) => {
            O.cancel();
            let C = y || t.liftedStore.getState();
            a = C.nextActionId,
            N({
                type: "STATE",
                payload: Te(C, s, u, l, S),
                source: k,
                instanceId: i,
                libConfig: h
            }, d, c)
        }
        , m)
          , g = new te(f);
        function _() {
            let y = t.liftedStore.getState()
              , h = y.actionsById
              , C = [];
            y.stagedActionIds.slice(1).forEach(q => {
                C.push(h[q].action)
            }
            ),
            N({
                type: "EXPORT",
                payload: C,
                committedState: y.committedState,
                source: k,
                instanceId: i
            }, d, c)
        }
        let O = K( () => {
            let y = t.liftedStore.getState()
              , h = y.nextActionId
              , C = h - 1
              , q = y.actionsById[C];
            if (a === C) {
                a = h;
                let ve = q.action
                  , ke = y.computedStates;
                if (z(ve, s) || S && !S(ke[ke.length - 1].state, ve))
                    return;
                let Pe = y.computedStates[y.computedStates.length - 1].state;
                N({
                    type: "ACTION",
                    payload: u ? u(Pe, h - 1) : Pe,
                    source: k,
                    instanceId: i,
                    action: l ? l(y.actionsById[h - 1].action, h - 1) : y.actionsById[h - 1],
                    maxAge: w(),
                    nextActionId: h
                }, d, c);
                return
            }
            let W = St(a, y, s, u, l, S);
            if (a = h,
            !(typeof W > "u")) {
                if ("skippedActionIds"in W) {
                    N({
                        type: "STATE",
                        payload: Te(W, s, u, l, S),
                        source: k,
                        instanceId: i
                    }, d, c);
                    return
                }
                N({
                    type: "PARTIAL_STATE",
                    payload: W,
                    source: k,
                    instanceId: i,
                    maxAge: w()
                }, d, c)
            }
        }
        , m);
        function b(y) {
            if (!(e.features && !e.features.dispatch))
                try {
                    let h = He(y, o);
                    (t.initialDispatch || t.dispatch)(h)
                } catch (h) {
                    N({
                        type: "ERROR",
                        payload: h.message,
                        source: k,
                        instanceId: i
                    }, d, c)
                }
        }
        function x(y) {
            if (!(e.features && !e.features.import))
                try {
                    let h = re(y, e);
                    if (!h)
                        return;
                    t.liftedStore.dispatch({
                        type: "IMPORT_STATE",
                        ...h
                    })
                } catch (h) {
                    N({
                        type: "ERROR",
                        payload: h.message,
                        source: k,
                        instanceId: i
                    }, d, c)
                }
        }
        function E(y) {
            let h = e.features;
            h && (!h.jump && (y.type === "JUMP_TO_STATE" || y.type === "JUMP_TO_ACTION") || !h.skip && y.type === "TOGGLE_ACTION" || !h.reorder && y.type === "REORDER_ACTION" || !h.import && y.type === "IMPORT_STATE" || !h.lock && y.type === "LOCK_CHANGES" || !h.pause && y.type === "PAUSE_RECORDING") || t.liftedStore.dispatch(y)
        }
        function A(y) {
            switch (y.type) {
            case "DISPATCH":
                E(y.payload);
                return;
            case "ACTION":
                b(y.payload);
                return;
            case "IMPORT":
                x(y.state);
                return;
            case "EXPORT":
                _();
                return;
            case "UPDATE":
                f();
                return;
            case "START":
                g.start(!0),
                !o && e.actionCreators && (o = se(e.actionCreators)),
                f(void 0, {
                    name: e.name || document.title,
                    actionCreators: JSON.stringify(o),
                    features: e.features,
                    serialize: !!e.serialize,
                    type: "redux"
                }),
                J && (N({
                    type: "GET_REPORT",
                    payload: J,
                    source: k,
                    instanceId: i
                }, d, c),
                J = null);
                return;
            case "STOP":
                g.stop(),
                O.cancel(),
                f.cancel(),
                y.failed || N({
                    type: "STOP",
                    payload: void 0,
                    source: k,
                    instanceId: i
                }, d, c);
                return;
            case "OPTIONS":
                window.devToolsOptions = Object.assign(window.devToolsOptions || {}, y.options);
                return
            }
        }
        let p = []
          , w = (y, h) => {
            let C = e && e.maxAge || window.devToolsOptions.maxAge || 50;
            if (!y || ee(s) || !y.action)
                return C;
            if ((!n || n < C) && (n = C),
            z(y.action, s))
                n++;
            else if (p.push(h.nextActionId),
            p.length >= C) {
                let q = h.stagedActionIds
                  , W = 1;
                for (; n > C && !p.includes(q[W]); )
                    n--,
                    W++;
                p.shift()
            }
            return n
        }
        ;
        function I() {
            Le(A, i),
            ce( () => {
                r = !0;
                let y = t.liftedStore.getState();
                return y.computedStates[y.currentStateIndex].error && f(y),
                !0
            }
            ),
            N({
                type: "INIT_INSTANCE",
                payload: void 0,
                source: k,
                instanceId: i
            }, d, c),
            t.subscribe(L),
            typeof J > "u" && (J = be("remotedev_report"),
            J && pe())
        }
        function L() {
            if (!g.active)
                return;
            if (!r && !g.isMonitorAction()) {
                O();
                return
            }
            if (g.isPaused() || g.isLocked() || g.isTimeTraveling())
                return;
            let y = t.liftedStore.getState();
            r && !y.computedStates[y.currentStateIndex].error && (r = !1),
            f(y)
        }
        return y => (h, C) => xt(window.devToolsOptions) ? (t = Ne[i] = Oe(y, g.reducer, {
            ...e,
            maxAge: w
        })(h, C),
        Ot() ? setTimeout(I, 3e3) : I(),
        t) : y(h, C)
    }
    window.__REDUX_DEVTOOLS_EXTENSION__ = Re;
    window.__REDUX_DEVTOOLS_EXTENSION__.open = pe;
    window.__REDUX_DEVTOOLS_EXTENSION__.notifyErrors = ce;
    window.__REDUX_DEVTOOLS_EXTENSION__.send = ne;
    window.__REDUX_DEVTOOLS_EXTENSION__.listen = Le;
    window.__REDUX_DEVTOOLS_EXTENSION__.connect = bt;
    window.__REDUX_DEVTOOLS_EXTENSION__.disconnect = It;
    var zr = e => t => (r, n) => {
        let o = t(r, n);
        return Ne[e] && (Ne[e].initialDispatch = o.dispatch),
        {
            ...o,
            dispatch: (...a) => !window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ && o.dispatch(...a)
        }
    }
      , wt = e => (...t) => (...r) => {
        let n = X(e.instanceId);
        return [zr(n), ...t].reduceRight( (o, a) => a(o), Re({
            ...e,
            instanceId: n
        })(...r))
    }
    ;
    function $r(...e) {
        return e.length === 0 ? Re() : e.length === 1 && typeof e[0] == "object" ? wt(e[0]) : wt({})(...e)
    }
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = $r;
}
)();
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/