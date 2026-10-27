/* Generated from web/workspace; do not edit. */
// ../node_modules/svelte/src/internal/shared/utils.js
var e = Array.isArray, t = Array.prototype.indexOf, n = Array.prototype.includes, r = Array.from, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyDescriptors, s = Object.prototype, c = Array.prototype, l = Object.getPrototypeOf, u = Object.isExtensible, d = () => {};
function f(e) {
	return e();
}
function p(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function m() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, E = 1 << 21, ee = 1 << 22, te = 1 << 23, ne = Symbol("$state"), re = Symbol("component"), ie = Symbol("legacy props"), ae = Symbol(""), oe = Symbol("attributes"), se = Symbol("class"), ce = Symbol("style"), le = Symbol("text"), ue = Symbol("form reset"), de = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), fe = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), pe = {}, D = Symbol("uninitialized"), me = "http://www.w3.org/1999/xhtml";
function he() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function ge(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function _e() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function ve() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// ../node_modules/svelte/src/internal/client/dom/hydration.js
var O = !1;
function ye(e) {
	O = e;
}
var k;
function be(e) {
	if (e === null) throw ge(), pe;
	return k = e;
}
function xe() {
	return be(/* @__PURE__ */ on(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ on(k) !== null) throw ge(), pe;
		k = e;
	}
}
function Se(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ on(n);
		k = n;
	}
}
function Ce(e = !0) {
	for (var t = 0, n = k;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ on(n);
		e && n.remove(), n = i;
	}
}
function we(e) {
	if (!e || e.nodeType !== 8) throw ge(), pe;
	return e.data;
}
// ../node_modules/svelte/src/internal/client/reactivity/equality.js
function Te(e) {
	return e === this.v;
}
function Ee(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function De(e) {
	return !Ee(e, this.v);
}
function Oe(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
// ../node_modules/svelte/src/internal/client/errors.js
function ke() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ae(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function je(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Me() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ne(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Pe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Fe(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ie() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Le() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Re() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ze() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// ../node_modules/svelte/src/internal/flags/index.js
var Be = !1;
function Ve() {
	Be = !0;
}
// ../node_modules/svelte/src/internal/client/context.js
var j = null;
function He(e) {
	j = e;
}
function Ue(e, t = !1, n) {
	j = {
		p: j,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: V,
		l: Be && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function We(e) {
	var t = j, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) bn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, j = t.p, Ge(e);
}
function Ge(e = {}) {
	return i(e, re, { value: !0 }), e;
}
function Ke() {
	return !Be || j !== null && j.l === null;
}
// ../node_modules/svelte/src/internal/client/dom/task.js
var qe = [];
function Je() {
	var e = qe;
	qe = [], p(e);
}
function Ye(e) {
	if (qe.length === 0 && !Ct) {
		var t = qe;
		queueMicrotask(() => {
			t === qe && Je();
		});
	}
	qe.push(e);
}
function Xe() {
	for (; qe.length > 0;) Je();
}
// ../node_modules/svelte/src/internal/client/reactivity/status.js
var Ze = ~(g | _ | h);
function M(e, t) {
	e.f = e.f & Ze | t;
}
function Qe(e) {
	e.f & 512 || e.deps === null ? M(e, h) : M(e, _);
}
// ../node_modules/svelte/src/internal/client/reactivity/utils.js
function $e(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), M(e, h);
}
// ../node_modules/svelte/src/internal/client/dom/elements/misc.js
function et(e) {
	O && /* @__PURE__ */ an(e) !== null && cn(e);
}
var tt = !1;
function nt() {
	tt || (tt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ue]?.();
		});
	}, { capture: !0 }));
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function rt(e) {
	var t = B, n = V;
	Gn(null), Kn(null);
	try {
		return e();
	} finally {
		Gn(t), Kn(n);
	}
}
function it(e, t, n, r = n) {
	e.addEventListener(t, () => rt(n));
	let i = e[ue];
	e[ue] = i ? () => {
		i(), r(!0);
	} : () => r(!0), nt();
}
// ../node_modules/svelte/src/internal/client/reactivity/async.js
function at(e, t, n, r) {
	let i = Ke() ? lt : pt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = ot(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				pn(e, s);
			}
			st();
		}
	}
	var d = ct();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ dt(e))).then(u).catch((e) => pn(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), st());
	}) : f();
}
function ot() {
	var e = V, t = B, n = j, r = N;
	return function(i = !0) {
		Kn(e), Gn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function st(e = !0) {
	Kn(null), Gn(null), He(null), e && N?.deactivate();
}
function ct() {
	var e = V, t = e.b, n = N, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function lt(e) {
	var t = 2 | g;
	return V !== null && (V.f |= C), {
		ctx: j,
		deps: null,
		effects: null,
		equals: Te,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: D,
		wv: 0,
		parent: V,
		ac: null
	};
}
var ut = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function dt(e, t, n) {
	let r = V;
	r === null && ke();
	var i = void 0, a = Bt(D), o = !B, s = /* @__PURE__ */ new Set();
	return En(() => {
		var t = V, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== de && n.reject(e);
			}).finally(st);
		} catch (e) {
			n.reject(e), st();
		}
		var c = N;
		if (o) {
			if (t.f & 32768) var l = ct();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(ut);
			else for (let e of s.values()) e.reject(ut);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== ut && (c.activate(), t ? (a.f |= te, Wt(a, t)) : (a.f & 8388608 && (a.f ^= te), Wt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), vn(() => {
		for (let e of s) e.reject(ut);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function ft(e) {
	let t = /* @__PURE__ */ lt(e);
	return Jn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function pt(e) {
	let t = /* @__PURE__ */ lt(e);
	return t.equals = De, t;
}
function mt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Nn(t[n]);
	}
}
function ht(e) {
	var t, n = V, r = e.parent;
	if (!Hn && r !== null && e.v !== D && r.f & 24576) return he(), e.v;
	Kn(r);
	try {
		mt(e), t = or(e);
	} finally {
		Kn(n);
	}
	return t;
}
function gt(e) {
	var t = ht(e);
	!e.equals(t) && (e.wv = rr(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), bt?.capture(e, t, !0)), e.deps === null)) ? M(e, h) : Hn || (xt === null ? Qe(e) : (_n() || N?.is_fork) && xt.set(e, t));
}
function _t(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && rt(() => {
		t.ac.abort(de), t.ac = null;
	}), t.fn !== null && (t.teardown = d), lr(t, 0), jn(t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && ur(t);
}
// ../node_modules/svelte/src/internal/client/reactivity/batch.js
var yt = null, N = null, bt = null, xt = null, St = null, Ct = !1, wt = !1, Tt = null, Et = null, Dt = 0, Ot = 1, kt = class e {
	id = Ot++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		yt === null ? yt = this : (yt.#n = this, this.#t = yt), yt = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) M(r, g), t(r);
			for (r of n.m) M(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		var e = [];
		for (let i of this.#c) if (!(i.f & 16384 || !(i.f & 6144))) {
			for (var t = i, n = !1; t.parent !== null;) {
				t = t.parent;
				var r = t.f;
				if (r & 96) {
					if (!(r & 1024)) {
						n = !0;
						break;
					}
					t.f ^= h;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), M(e, g), this.schedule(e);
		for (let e of this.#d) M(e, _), this.schedule(e);
		this.apply();
		for (var t = Tt = [], n = [], r = Et = []; this.#c.length > 0;) {
			Dt++ > 1e3 && (this.#S(), jt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw It(e), this.#h() || this.discard(), t;
			}
		}
		if (N = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Tt = null, Et = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Ft(e, t);
			r.length > 0 && N.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), bt = this, Nt(n), Nt(t), bt = null, this.#s?.resolve();
			var o = N;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (Rt.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : ir(r) && (i & 16 && this.#d.add(r), ur(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#y() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#b(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), M(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), N = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) $e(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== D && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), xt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		N = this;
	}
	deactivate() {
		N = null, xt = null;
	}
	flush() {
		try {
			wt = !0, N = this, this.#_();
		} finally {
			Dt = 0, St = null, Tt = null, Et = null, wt = !1, N = null, xt = null, Rt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ut);
		this.#S(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, Ye(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= m()).promise;
	}
	static ensure() {
		if (N === null) {
			let t = N = new e();
			!wt && !Ct && Ye(() => {
				t.#e || t.flush();
			});
		}
		return N;
	}
	apply() {
		xt = null;
	}
	schedule(e) {
		St = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? yt = e : t.#t = e, this.linked = !1;
		}
	}
};
function At(e) {
	var t = Ct, n = bt;
	bt = null, Ct = !0;
	try {
		var r;
		for (e && (At(), r = e());;) {
			if (Xe(), N === null) return r;
			N.flush();
		}
	} finally {
		Ct = t, bt = n;
	}
}
function jt() {
	try {
		Pe();
	} catch (e) {
		pn(e, St);
	}
}
var Mt = null;
function Nt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && ir(r) && (Mt = /* @__PURE__ */ new Set(), ur(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Fn(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || ur(n);
					}
				}
				Mt.clear();
			}
		}
		Mt = null;
	}
}
function Pt(e) {
	N.schedule(e);
}
function Ft(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), M(e, h);
		for (var n = e.first; n !== null;) Ft(n, t), n = n.next;
	}
}
function It(e) {
	M(e, h);
	for (var t = e.first; t !== null;) It(t), t = t.next;
}
// ../node_modules/svelte/src/internal/client/reactivity/sources.js
var Lt = /* @__PURE__ */ new Set(), Rt = /* @__PURE__ */ new Map(), zt = !1;
function Bt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Te,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Vt(e, t) {
	let n = Bt(e, t);
	return Jn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t = !1, n = !0) {
	let r = Bt(e);
	return t || (r.equals = De), Be && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function F(e, t, n = !1) {
	return B !== null && (!Wn || B.f & 131072) && Ke() && B.f & 4325394 && (qn === null || !qn.has(e)) && Re(), Wt(e, n ? Yt(t) : t, Et);
}
var Ht = null, Ut = 0;
function Wt(e, t, n = null) {
	if (!e.equals(t)) {
		Hn ? Rt.set(e, t) : Rt.has(e) || Rt.set(e, e.v);
		var r = kt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ht(t), xt === null && Qe(t);
		}
		e.wv = rr(), Ht = null, Ut = 0, Jt(e, g, n), Ht = null, Ke() && V !== null && V.f & 1024 && !(V.f & 96) && (Zn === null ? Qn([e]) : Zn.push(e)), !r.is_fork && Lt.size > 0 && !zt && Gt();
	}
	return t;
}
function Gt() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && M(e, _);
		let t;
		try {
			t = ir(e);
		} catch {
			t = !0;
		}
		t && ur(e);
	}
	Lt.clear();
}
function Kt(e, t = 1) {
	var n = H(e);
	return F(e, t === 1 ? ++n : --n);
}
function qt(e) {
	F(e, e.v + 1);
}
function Jt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ke(), a = r.length;
		if (Ut += a, Ut > 1e5 && Ht === null && (Ht = /* @__PURE__ */ new Set()), Ht !== null) {
			if (Ht.has(e)) return;
			Ht.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== V) {
				var l = (c & g) === 0;
				if (l && M(s, t), c & 131072) Lt.add(s);
				else if (c & 2) {
					var u = s;
					xt?.delete(u), Jt(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && Mt !== null && Mt.add(d), n === null ? Pt(d) : n.push(d);
				}
			}
		}
	}
}
function Yt(t) {
	if (typeof t != "object" || !t || ne in t || re in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Vt(0), u = null, d = tr, f = (e) => {
		if (tr === d) return e();
		var t = B, n = tr;
		Gn(null), nr(d);
		var r = e();
		return Gn(t), nr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Vt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Ie();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Vt(n.value, u);
				return r.set(t, e), e;
			}) : F(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Vt(D, u));
					r.set(t, e), qt(o);
				}
			} else F(n, D), qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === ne) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Vt(Yt(s ? e[n] : D), u)), r.set(n, o)), o !== void 0) {
				var c = H(o);
				return c === D ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = H(i);
				if (a === D) return;
				if (n && "value" in n) n.value = a;
				else return {
					enumerable: !0,
					configurable: !0,
					value: a,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === ne) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== D || Reflect.has(e, t);
			return (n !== void 0 || V !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Vt(i ? Yt(e[t]) : D, u)), r.set(t, n)), H(n) === D) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Vt(D, u)), r.set(d + "", p)) : F(p, D);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Vt(void 0, u)), F(c, Yt(n)), r.set(t, c));
			else {
				l = c.v !== D;
				var m = f(() => Yt(n));
				F(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && F(g, _ + 1);
				}
				qt(o);
			}
			return !0;
		},
		ownKeys(e) {
			H(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== D;
			});
			for (var [n, i] of r) i.v !== D && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Le();
		}
	});
}
function Xt(e) {
	try {
		if (typeof e == "object" && e && ne in e) return e[ne];
	} catch {}
	return e;
}
function Zt(e, t) {
	return Object.is(Xt(e), Xt(t));
}
var Qt, $t, en, tn;
function nn() {
	if (Qt === void 0) {
		Qt = window, $t = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		en = a(t, "firstChild").get, tn = a(t, "nextSibling").get, u(e) && (e[se] = void 0, e[oe] = null, e[ce] = void 0, e.__e = void 0), u(n) && (n[le] = void 0);
	}
}
function rn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function an(e) {
	return en.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function on(e) {
	return tn.call(e);
}
function I(e, t) {
	if (!O) return /* @__PURE__ */ an(e);
	var n = /* @__PURE__ */ an(k);
	if (n === null) n = k.appendChild(rn());
	else if (t && n.nodeType !== 3) {
		var r = rn();
		return n?.before(r), be(r), r;
	}
	return t && dn(n), be(n), n;
}
function sn(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ an(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ on(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = rn();
			return k?.before(r), be(r), r;
		}
		dn(k);
	}
	return k;
}
function L(e, t = !1) {
	if (!O) return /* @__PURE__ */ an(e);
	var n = I(e, t);
	return A(e), n;
}
function R(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ on(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = rn();
			return r === null ? i?.after(a) : r.before(a), be(a), a;
		}
		dn(r);
	}
	return be(r), r;
}
function cn(e) {
	e.textContent = "";
}
function ln() {
	return !1;
}
function un(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function dn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function fn(e) {
	var t = V;
	if (t === null) return B.f |= te, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	pn(e, t);
}
function pn(e, t) {
	if (e === pe) throw e;
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/effects.js
function mn(e) {
	V === null && (B === null && Ne(e), Me()), Hn && je(e);
}
function hn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function gn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: j,
		deps: null,
		nodes: null,
		f: e | g | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	N?.register_created_effect(r);
	var i = r;
	if (e & 4) Tt === null ? kt.ensure().schedule(r) : Tt.push(r);
	else if (t !== null) {
		try {
			ur(r);
		} catch (e) {
			throw Nn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && hn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function _n() {
	return B !== null && !Wn;
}
function vn(e) {
	let t = gn(8, null);
	return M(t, h), t.teardown = e, t;
}
function yn(e) {
	mn("$effect");
	var t = V.f;
	if (!B && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return bn(e);
}
function bn(e) {
	return gn(4 | w, e);
}
function xn(e) {
	return mn("$effect.pre"), gn(8 | w, e);
}
function Sn(e) {
	kt.ensure();
	let t = gn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? In(t, () => {
			Nn(t), n(void 0);
		}) : (Nn(t), n(void 0));
	});
}
function Cn(e) {
	return gn(4, e);
}
function wn(e, t) {
	var n = j, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Dn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				Kn(n.parent), U(t);
			} finally {
				Kn(n);
			}
		}
	});
}
function Tn() {
	var e = j;
	Dn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && M(n, _), ir(n) && ur(n), t.ran = !1;
		}
	});
}
function En(e) {
	return gn(ee | C, e);
}
function Dn(e, t = 0) {
	return gn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	at(r, t, n, (t) => {
		gn(8, () => {
			e(...t.map(H));
		});
	});
}
function On(e, t = 0) {
	return gn(16 | t, e);
}
function kn(e) {
	return gn(32 | C, e);
}
function An(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Hn, r = B;
		Un(!0), Gn(null);
		try {
			t.call(null);
		} catch (t) {
			pn(t, e.parent);
		} finally {
			Un(n), Gn(r);
		}
	}
}
function jn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && rt(() => {
			e.abort(de);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Nn(n, t), n = r;
	}
}
function Mn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Nn(t), t = n;
	}
}
function Nn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Pn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, jn(e, t && !n), lr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	An(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Fn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Pn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ on(e);
		e.remove(), e = n;
	}
}
function Fn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function In(e, t, n = !0) {
	var r = [];
	e.f |= 256, Ln(e, r, !0);
	var i = () => {
		n && Nn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Ln(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Ln(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Rn(e) {
	e.f &= -257, zn(e, !0);
}
function zn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (M(e, g), kt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			zn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Bn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ on(n);
		t.append(n), n = i;
	}
}
// ../node_modules/svelte/src/internal/client/legacy.js
var Vn = null, Hn = !1;
function Un(e) {
	Hn = e;
}
var B = null, Wn = !1;
function Gn(e) {
	B = e;
}
var V = null;
function Kn(e) {
	V = e;
}
var qn = null;
function Jn(e) {
	B !== null && (B.f & 2097152 || B.f & 2) && (qn ??= /* @__PURE__ */ new Set()).add(e);
}
var Yn = null, Xn = 0, Zn = null;
function Qn(e) {
	Zn = e;
}
var $n = 1, er = 0, tr = er;
function nr(e) {
	tr = e;
}
function rr() {
	return ++$n;
}
function ir(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (ir(a) && gt(a), a.wv > e.wv) return !0;
		}
		t & 512 && xt === null && M(e, h);
	}
	return !1;
}
function ar(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(qn !== null && qn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ar(a, t, !1) : t === a && (n ? M(a, g) : a.f & 1024 && M(a, _), Pt(a));
	}
}
function or(e) {
	var t = Yn, n = Xn, r = Zn, i = B, a = qn, o = j, s = Wn, c = tr, l = e.f;
	Yn = null, Xn = 0, Zn = null, B = l & 96 ? null : e, qn = null, He(e.ctx), Wn = !1, tr = ++er, e.ac !== null && (rt(() => {
		e.ac.abort(de);
	}), e.ac = null);
	try {
		e.f |= E;
		var u = e.fn, d = u();
		e.f |= b;
		var f = sr(e);
		if (Ke() && Zn !== null && !Wn && f !== null && !(e.f & 6146)) for (var p = 0; p < Zn.length; p++) ar(Zn[p], e);
		if (i !== null && i !== e) {
			if (er++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = er;
			if (t !== null) for (let e of t) e.rv = er;
			Zn !== null && (r === null ? r = Zn : r.push(...Zn));
		}
		return e.f & 8388608 && (e.f ^= te), d;
	} catch (t) {
		return sr(e), fn(t);
	} finally {
		e.f ^= E, Yn = t, Xn = n, Zn = r, B = i, qn = a, He(o), Wn = s, tr = c;
	}
}
function sr(e) {
	var t = e.deps, n = N?.is_fork;
	if (Yn !== null) {
		var r;
		if (n || lr(e, Xn), t !== null && Xn > 0) for (t.length = Xn + Yn.length, r = 0; r < Yn.length; r++) t[Xn + r] = Yn[r];
		else e.deps = t = Yn;
		if (_n() && e.f & 512) for (r = Xn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Xn < t.length && (lr(e, Xn), t.length = Xn);
	return t;
}
function cr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Yn === null || !n.call(Yn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== D && Qe(s), s.ac !== null && rt(() => {
			s.ac.abort(de), s.ac = null, M(s, g);
		}), _t(s), lr(s, 0);
	}
}
function lr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) cr(e, n[r]);
}
function ur(e) {
	var t = e.f;
	if (!(t & 16384)) {
		M(e, h);
		var n = V;
		V = e;
		try {
			t & 16777232 ? Mn(e) : jn(e), An(e);
			var r = or(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = $n;
		} finally {
			V = n;
		}
	}
}
async function dr() {
	await Promise.resolve(), At();
}
function H(e) {
	var t = !!(e.f & 2);
	if (Vn?.add(e), B !== null && !Wn && !(V !== null && V.f & 16384) && (qn === null || !qn.has(e))) {
		var r = B.deps;
		if (B.f & 2097152) e.rv < er && (e.rv = er, Yn === null && r !== null && r[Xn] === e ? Xn++ : Yn === null ? Yn = [e] : Yn.push(e));
		else {
			B.deps ??= [], n.call(B.deps, e) || B.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [B] : n.call(i, B) || i.push(B);
		}
	}
	if (Hn && Rt.has(e)) return Rt.get(e);
	if (t) {
		var a = e;
		if (Hn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || pr(a)) && (o = ht(a)), Rt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Wn && B !== null && !!(B.f & 512), c = (a.f & b) === 0;
		ir(a) && (s && (a.f |= 512), gt(a)), s && !c && (vt(a), fr(a));
	}
	if (xt?.has(e)) return xt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function fr(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (vt(r), fr(r));
	}
}
function pr(e) {
	if (e.v === D) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && pr(t)) return !0;
	return !1;
}
function U(e) {
	var t = Wn;
	try {
		return Wn = !0, e();
	} finally {
		Wn = t;
	}
}
function W(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ne in e) mr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ne in n && mr(n);
		}
	}
}
function mr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			mr(e[n], t);
		} catch {}
		let n = l(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = o(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var hr = ["touchstart", "touchmove"];
function gr(e) {
	return hr.includes(e);
}
// ../node_modules/svelte/src/internal/client/dom/elements/events.js
var _r = Symbol("events"), vr = /* @__PURE__ */ new Set(), yr = /* @__PURE__ */ new Set();
function br(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Tr.call(t, e), !e.cancelBubble) return rt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Ye(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function xr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = br(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && vn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[_r] ??= {})[e] = n;
}
function Sr(e) {
	for (var t = 0; t < e.length; t++) vr.add(e[t]);
	for (var n of yr) n(e);
}
var Cr = null, wr = !1;
function Tr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Cr = e, wr || (wr = !0, setTimeout(() => {
		wr = !1, Cr = null;
	}));
	var s = 0, c = Cr === e && e[_r];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[_r] = t;
			return;
		}
		var u = a.indexOf(t);
		if (u === -1) return;
		l <= u && (s = l);
	}
	if (o = a[s] || e.target, o !== t) {
		i(e, "currentTarget", {
			configurable: !0,
			get() {
				return o || n;
			}
		});
		var d = B, f = V;
		Gn(null), Kn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[_r]?.[r];
					h == null || o.disabled && e.target !== o || h.call(o, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				s++, o = s < a.length ? a[s] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[_r] = t, delete e.currentTarget, Gn(d), Kn(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var Er = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Dr(e) {
	return Er?.createHTML(e) ?? e;
}
function Or(e) {
	var t = un("template");
	return t.innerHTML = Dr(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function kr(e, t) {
	var n = V;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function K(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (O) return kr(k, null), k;
		i === void 0 && (i = Or(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ an(i)));
		var t = r || $t ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ an(t), s = t.lastChild;
			kr(o, s);
		} else kr(t, t);
		return t;
	};
}
function Ar(e = "") {
	if (!O) {
		var t = rn(e + "");
		return kr(t, t), t;
	}
	var n = k;
	return n.nodeType === 3 ? dn(n) : (n.before(n = rn()), be(n)), kr(n, n), n;
}
function q(e, t) {
	if (O) {
		var n = V;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = k), xe();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function jr(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		_n() && (H(n), Dn(() => (t === 0 && (r = U(() => e(() => qt(n)))), t += 1, () => {
			Ye(() => {
				--t, t === 0 && (r?.(), r = void 0, qt(n));
			});
		})));
	};
}
// ../node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Mr = S | C;
function Nr(e, t, n, r) {
	new Pr(e, t, n, r);
}
var Pr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = O ? k : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = jr(() => (this.#m = Bt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = On(() => {
			if (O) {
				let e = we(this.#t);
				xe();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Mr), O && (this.#e = k);
	}
	#g() {
		try {
			this.#a = kn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ye(r), t && (this.#s = kn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? ve() : (t = !0, n && ze(), this.#s !== null && In(this.#s, () => {
				this.#s = null;
			}), this.#C(() => {
				this.#x();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#y()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					pn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (y | x)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = kn(() => e(this.#e)), Ye(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = rn(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return kn(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							pn(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(N)) : this.#u === 0 && (this.#e.before(e), this.#c = null, In(this.#o, () => {
					this.#o = null;
				}), this.#S(N));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = kn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Bn(this.#a, e);
				let t = this.#n.pending;
				this.#o = kn(() => t(this.#e));
			} else this.#S(N);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		$e(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = V, n = B, r = j;
		Kn(this.#i), Gn(this.#i), He(this.#i.ctx);
		try {
			return kt.ensure(), e();
		} finally {
			Kn(t), Gn(n), He(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && In(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ye(() => {
			this.#d = !1, this.#m && Wt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), H(this.#m);
	}
	error(e) {
		if (e === pe || !this.#n.onerror && !this.#n.failed) throw e;
		N?.is_fork ? (this.#a && N.skip_effect(this.#a), this.#o && N.skip_effect(this.#o), this.#s && N.skip_effect(this.#s), N.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (Nn(this.#a), null), this.#o &&= (Nn(this.#o), null), this.#s &&= (Nn(this.#s), null), O && (be(this.#t), Se(), be(Ce()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return kn(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return pn(e, this.#i.parent), null;
				}
			}));
		};
		Ye(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					pn(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => pn(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function J(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[le] ??= e.nodeValue) && (e[le] = n, e.nodeValue = `${n}`);
}
function Fr(e, t) {
	return Lr(e, t);
}
var Ir = /* @__PURE__ */ new Map();
function Lr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	nn();
	var l = void 0, u = Sn(() => {
		var s = n ?? t.appendChild(rn());
		Nr(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = j;
			if (o && (n.c = o), a && (i.$$events = a), O && kr(t, null), l = e(t, i) || Ge(), O && (V.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw ge(), pe;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = gr(r);
					for (let e of [t, document]) {
						var a = Ir.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Ir.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Tr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(vr)), yr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Ir.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Tr), r.delete(e), r.size === 0 && Ir.delete(n)) : r.set(e, i);
			}
			yr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Rr.set(l, u), l;
}
var Rr = /* @__PURE__ */ new WeakMap(), zr = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Rn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Rn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Nn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Bn(r, t), t.append(rn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Nn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), In(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Nn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = N, r = ln();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = rn();
				i.append(a), this.#n.set(e, {
					effect: kn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, kn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else O && (this.anchor = k), this.#a(n);
	}
};
// ../node_modules/svelte/src/internal/client/dom/blocks/if.js
function Y(e, t, n = !1) {
	var r;
	O && (r = k, xe());
	var i = new zr(e), a = n ? S : 0;
	function o(e, t) {
		if (O) {
			var n = we(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ce();
				be(a), i.anchor = a, ye(!1), i.ensure(e, t), ye(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	On(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// ../node_modules/svelte/src/internal/client/dom/blocks/each.js
function Br(e, t) {
	return t;
}
function Vr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		In(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Hr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			cn(d), d.append(u), e.items.clear();
		}
		Hr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Hr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, Bn(a, document.createDocumentFragment())) : Nn(t[i], n);
	}
}
var Ur;
function Wr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = O ? be(/* @__PURE__ */ an(u)) : u.appendChild(rn());
	}
	O && xe();
	var d = null, f = /* @__PURE__ */ pt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = H(f);
			_.fallback = d, Kr(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= T, Jr(d, null, c)) : Rn(d) : In(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: On(() => {
			var e = H(f), t = e.length;
			let r = !1;
			O && we(c) === "[!" != (t === 0) && (c = Ce(), be(c), ye(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = N, v = ln(), y = 0; y < t; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (c = k, r = !0, ye(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && Wt(S.v, b), S.i && Wt(S.i, y), v && _.unskip_effect(S.e)) : (S = qr(l, m ? c : Ur ??= rn(), b, x, y, o, n, i), m || (S.e.f |= T), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = kn(() => s(c)) : (d = kn(() => s(Ur ??= rn())), d.f |= T)), t > u.size && Ae("", "", ""), O && t > 0 && be(Ce()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && ye(!0), H(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, O && (c = k);
}
function Gr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Kr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Gr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Rn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= T, _ === l) Jr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Yr(e, d, _), Yr(e, _, y), Jr(_, y, n), d = _, p = [], m = [], l = Gr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Jr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Yr(e, S.prev, C.next), Yr(e, d, S), Yr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Jr(_, l, n), Yr(e, _.prev, _.next), Yr(e, _, d === null ? e.effect.first : d.next), Yr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Gr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Gr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Hr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Gr(l.next);
		var E = w.length;
		if (E > 0) {
			var ee = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.fix();
			}
			Vr(e, w, ee);
		}
	}
	o && Ye(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function qr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ P(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: kn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Jr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ on(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Yr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// ../node_modules/svelte/src/internal/shared/attributes.js
var Xr = [..." 	\n\r\f\xA0\v﻿"];
function Zr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Xr.includes(r[o - 1])) && (s === r.length || Xr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// ../node_modules/svelte/src/internal/client/dom/elements/class.js
function Qr(e, t, n, r, i, a) {
	var o = e[se];
	if (O || o !== n || o === void 0) {
		var s = Zr(n, r, a);
		O && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[se] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function $r(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ei(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = ii(c);
			$r(c, i ? a.includes(l) : Zt(l, r));
		}
		if (n) {
			if (s !== null) for (c of t.options) {
				var u = s.has(c);
				c.selected !== u && (c.selected = u);
			}
			else t.selectedIndex !== o && (t.selectedIndex = o);
		}
	}
}
function ti(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return _e();
		for (var i of t.options) i.selected = n.includes(ii(i));
	} else {
		for (i of t.options) if (Zt(ii(i), n)) {
			i.selected = !0;
			return;
		}
		r && n === void 0 || (t.selectedIndex = -1);
	}
}
function ni(e) {
	var t = new MutationObserver((t) => {
		t.every(ai) || ("__defaultValue" in e && ei(e, !1), "__value" in e && ti(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), vn(() => {
		t.disconnect();
	});
}
function ri(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	it(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ii);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ii(o);
		}
		n(a), e.__value = a, N !== null && r.add(N);
	}), Cn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = N;
			if (r.has(o)) return;
		}
		if (ti(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ii(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function ii(e) {
	return "__value" in e ? e.__value : e.value;
}
function ai(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// ../node_modules/svelte/src/internal/client/dom/elements/attributes.js
var oi = Symbol("is custom element"), si = Symbol("is html"), ci = fe ? "link" : "LINK", li = fe ? "progress" : "PROGRESS";
function ui(e) {
	if (O) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					X(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					X(e, "checked", null), e.checked = r;
				}
			}
		};
		e[ue] = n, Ye(n), nt();
	}
}
function di(e, t) {
	var n = pi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === li) && (e.value = t ?? "");
}
function fi(e, t) {
	var n = pi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function X(e, t, n, r) {
	var i = pi(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ci) || i[t] !== (i[t] = n) && (t === "loading" && (e[ae] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && hi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function pi(e) {
	return e[oe] ??= {
		[oi]: e.nodeName.includes("-"),
		[si]: e.namespaceURI === me
	};
}
var mi = /* @__PURE__ */ new Map();
function hi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = mi.get(t);
	if (n) return n;
	mi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function gi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	it(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = vi(e) ? yi(a) : a, n(a), N !== null && r.add(N), await dr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (O && e.defaultValue !== e.value || U(t) == null && e.value) && (n(vi(e) ? yi(e.value) : e.value), N !== null && r.add(N)), Dn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = N;
			if (r.has(i)) return;
		}
		vi(e) && n === yi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function _i(e, t, n = t) {
	it(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (O && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), Dn(() => {
		e.checked = !!t();
	});
}
function vi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function yi(e) {
	return e === "" ? null : +e;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function bi(e, t) {
	return e === t || e?.[ne] === t;
}
function xi(e = Ge(), t, n, r) {
	var i = j.r, a = V;
	return Cn(() => {
		var o, s;
		return Dn(() => {
			o = s, s = r?.() || [], U(() => {
				bi(n(...s), e) || (t(e, ...s), o && bi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && bi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Si(e = !1) {
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => W(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ lt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => H(i);
	}
	n.b.length && xn(() => {
		Ci(t, r), p(n.b);
	}), yn(() => {
		let e = U(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && yn(() => {
		Ci(t, r), p(n.a);
	});
}
function Ci(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function wi(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = U(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var Ti = [];
function Ei(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ee(e, t) && (e = t, n)) {
			let t = !Ti.length;
			for (let t of r) t[1](), Ti.push(t, e);
			if (t) {
				for (let e = 0; e < Ti.length; e += 2) Ti[e][0](Ti[e + 1]);
				Ti.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = d) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || d), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function Di(e) {
	let t;
	return wi(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var Oi = !1, ki = Symbol("unmounted");
function Ai(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ P(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(ki in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = wi(e, (e) => {
				i ? r.source.v = e : F(r.source, e);
			}), i = !1;
		}
	}
	return e && ki in n ? Di(e) : H(r.source);
}
function ji() {
	let e = {};
	function t() {
		vn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, ki, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Mi(e) {
	var t = Oi;
	try {
		return Oi = !1, [e(), Oi];
	} finally {
		Oi = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function Z(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ lt(r), H(u)) : (l && (l = !1, c = s ? U(r) : r), c);
	let f;
	if (o) {
		var p = ne in e || ie in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Mi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Fe(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (l = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (c = void 0), n === void 0 ? c : n;
	};
	if (i && !(n & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? lt : pt)(() => (v = !1, g()));
	o && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && o ? Yt(e) : e;
			return F(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Hn && v || b.f & 16384 ? y.v : H(y);
	});
}
function Ni(e) {
	j === null && Oe("onMount"), Be && j.l !== null ? Fi(j).m.push(e) : yn(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function Pi(e) {
	j === null && Oe("onDestroy"), Ni(() => () => U(e));
}
function Fi(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
// ../node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ve();
// src/controller.ts
var Ii = "keida-hub-reborn", Li = "reborn-workspace-v1", Ri = 9223372036854775807n, zi = () => [
	{
		id: "note",
		visible: !0
	},
	{
		id: "connections",
		visible: !0
	},
	{
		id: "pins",
		visible: !0
	}
], Bi = (e) => e === "note" ? "Workspace note" : e === "connections" ? "Connections" : "Pinned services", Vi = () => ({
	phase: "idle",
	entries: [],
	through: "0",
	next: null,
	category: "all",
	query: "",
	message: ""
}), Hi = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1,
	directorySave: "idle",
	directoryMessage: "",
	activity: Vi(),
	notificationSave: "idle",
	notificationMessage: "",
	layoutSave: "idle",
	layoutMessage: ""
}), Q = (e) => typeof e == "object" && !!e && !Array.isArray(e), $ = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= Ri && (!t || e !== "0"), Ui = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096;
function Wi(e) {
	if (typeof e != "string" || new TextEncoder().encode(e).length > 1024 || !/^https:\/\/[^/]/.test(e) || /[\s\u0000-\u001f\u007f\\]/u.test(e)) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "https:" && !!t.hostname && !t.username && !t.password && !e.includes("?") && !e.includes("#");
	} catch {
		return !1;
	}
}
function Gi(e) {
	if (!Q(e) || !Array.isArray(e.groups) || e.groups.length > 2 || !Number.isInteger(e.unread_groups) || new Set(e.groups.map((e) => Q(e) ? e.category : null)).size !== e.groups.length || e.groups.some((e) => !Q(e) || !["services", "connections"].includes(String(e.category)) || !$(e.revision, !0) || !$(e.read_through) || !$(e.unread) || BigInt(e.read_through) > BigInt(e.revision) || BigInt(e.unread) !== BigInt(e.revision) - BigInt(e.read_through) || !Q(e.latest) || !$(e.latest.source_revision, !0) || !$(e.latest.occurred_at) || BigInt(e.latest.occurred_at) > 253402300799n || typeof e.latest.label != "string" || !/^[A-Za-z ]{1,64}$/.test(e.latest.label) || !(e.category === "services" ? [
		"service_added",
		"service_updated",
		"service_removed"
	] : ["connection_saved", "connection_removed"]).includes(String(e.latest.kind))) || e.unread_groups !== e.groups.filter((e) => e.unread !== "0").length) throw Error("Invalid notification response");
	return e;
}
function Ki(e) {
	if (!Q(e) || !$(e.revision) || !Array.isArray(e.panels) || e.panels.length !== 3 || e.panels.some((e) => !Q(e) || ![
		"note",
		"connections",
		"pins"
	].includes(String(e.id)) || typeof e.visible != "boolean") || new Set(e.panels.map((e) => e.id)).size !== 3 || !e.panels.some((e) => e.visible)) throw Error("Invalid layout response");
	return e;
}
var qi = (e, t) => e.length === t.length && e.every((e, n) => e.id === t[n].id && e.visible === t[n].visible);
function Ji(e) {
	if (!Q(e) || e.product !== Ii || e.contract !== Li || e.schema !== 1 || !Q(e.account) || !$(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !$(e.session_generation) || !Q(e.note) || !Ui(e.note.body) || !$(e.note.revision)) throw Error("Invalid workspace response");
	let t = e.directory, n = (e, t, n = !1) => typeof e == "string" && (!n || e.length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e);
	if (!Q(t) || !$(t.revision) || !$(t.pins_revision) || !Array.isArray(t.services) || t.services.length > 100 || t.services.some((e) => !Q(e) || !$(e.id, !0) || !n(e.name, 80, !0) || !n(e.category, 40, !0) || !n(e.description, 240) || !Wi(e.url)) || new Set(t.services.map((e) => e.id)).size !== t.services.length || !Array.isArray(t.pins) || t.pins.length > 24 || new Set(t.pins).size !== t.pins.length || t.pins.some((e) => !$(e, !0) || !t.services.some((t) => t.id === e))) throw Error("Invalid directory response");
	if (e.crafty != null) {
		let t = e.crafty, n = (e) => e === null || typeof e == "number" && Number.isSafeInteger(e) && e >= 0, r = (e) => e === null || typeof e == "string" && /^[a-z_]{1,40}$/.test(e);
		if (!Q(t) || !$(t.revision) || typeof t.configured != "boolean" || !n(t.checked_at) || !r(t.error) || !Array.isArray(t.servers) || t.servers.length > 8 || t.servers.some((e) => !Q(e) || typeof e.name != "string" || e.name.length > 80 || typeof e.join != "string" || e.join.length > 253 || ![
			"running",
			"stopped",
			"unknown"
		].includes(String(e.state)) || ![
			"fresh",
			"stale",
			"unknown"
		].includes(String(e.freshness)) || !n(e.players) || !n(e.capacity) || !n(e.collected_at) || !n(e.provider_at) || !r(e.error))) throw Error("Invalid connection response");
	}
	return Gi(e.notifications), Ki(e.layout), e;
}
function Yi(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (Q(t) && t.schema === 1 && Ui(t.body) && $(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
function Xi(e) {
	let t = Ei(Hi("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l, u = 0, d, f, p, m = !1, h = !1, g = () => Di(t), _ = (e) => `${Ii}.workspace.v1:${e.account.id}:${e.session_generation}`;
	function v() {
		if (f = void 0, d) try {
			sessionStorage.removeItem(d);
		} catch {}
	}
	function y() {
		let e = g();
		if (!d || !e.snapshot) return;
		if (!e.dirty) {
			v();
			return;
		}
		let n = {
			body: e.draft,
			base: e.base
		};
		f = {
			key: d,
			draft: n
		};
		try {
			sessionStorage.setItem(d, JSON.stringify({
				schema: 1,
				...n
			}));
		} catch {
			t.update((e) => ({
				...e,
				storageLimited: !0
			}));
		}
	}
	function b() {
		++n, r && clearTimeout(r), r = void 0, i?.abort(), a?.abort(), i = void 0, a = void 0, o?.abort(), o = void 0, ++u, s?.abort(), s = void 0, c?.abort(), c = void 0, l?.abort(), l = void 0;
	}
	function x(e, n = !1) {
		b(), h ||= n, At(() => t.set(Hi(n ? "blocked" : "paused", e)));
	}
	function S() {
		r && clearTimeout(r), !m && !h && g().phase === "ready" && g().notificationSave !== "uncertain" && g().layoutSave !== "uncertain" && document.visibilityState === "visible" && (r = setTimeout(() => {
			r = void 0, E();
		}, 15e3));
	}
	async function C(t, n, r) {
		let i = performance.now(), a = setTimeout(() => n.abort(), 4e3);
		try {
			let a = await fetch(t, {
				method: r ? "PUT" : "GET",
				credentials: "same-origin",
				cache: "no-store",
				redirect: "error",
				signal: n.signal,
				headers: {
					"X-Reborn-Product": Ii,
					"X-Reborn-Contract": Li,
					"X-CSRF-Token": e,
					...r ? { "Content-Type": "application/json" } : {}
				},
				body: r ? JSON.stringify(r) : void 0
			}), o = a.ok ? await a.json() : void 0;
			if (n.signal.aborted || performance.now() - i >= 4e3) throw Error("Deadline");
			return {
				status: a.status,
				value: o
			};
		} finally {
			clearTimeout(a);
		}
	}
	function w(e) {
		return e === 401 || e === 403 ? "Your sign-in changed or ended. Open a fresh workspace after signing in." : e === 426 ? "This workspace needs a fresh document. Open workspace again." : "Your workspace could not be checked. Open workspace again when access is available.";
	}
	function T(e) {
		let t = g().snapshot;
		return !t || e.account.id === t.account.id && e.session_generation === t.session_generation && e.account.role === t.account.role;
	}
	async function E(e = !1) {
		if (m || h || i || a || o || c || l || !e && g().layoutSave === "uncertain" || document.visibilityState !== "visible") return;
		let r = new AbortController();
		i = r;
		let s = n;
		try {
			let i = await C("/api/workspace/snapshot", r);
			if (m || r.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				x("Workspace hidden. Checking access on return.");
				return;
			}
			if (i.status !== 200) {
				x(w(i.status), !0);
				return;
			}
			let a = Ji(i.value);
			if (!T(a)) {
				x("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let o = g();
			if (d = _(a), o.phase === "ready") {
				let n = o.dirty && a.note.revision !== o.base, r = !!o.layoutDraft && qi(o.layoutDraft.panels, a.layout.panels) && e && ["uncertain", "checking-conflict"].includes(o.layoutSave), i = !!o.layoutDraft && !r && o.layoutDraft.base !== a.layout.revision;
				t.set({
					...o,
					snapshot: a,
					layoutDraft: r ? void 0 : o.layoutDraft,
					layoutSave: i ? "conflict" : ["uncertain", "checking-conflict"].includes(o.layoutSave) || r ? "idle" : o.layoutSave,
					layoutMessage: r ? "Saved layout checked. The current layout matches your changes." : i ? "A newer layout was saved. Your arrangement is unchanged; compare before saving." : o.layoutSave === "uncertain" ? "The saved layout was checked. Review your arrangement before saving deliberately." : o.layoutMessage,
					draft: o.dirty ? o.draft : a.note.body,
					base: o.dirty ? o.base : a.note.revision,
					save: n ? "conflict" : ["uncertain", "checking-conflict"].includes(o.save) ? "idle" : o.save,
					message: n ? "A newer saved note is available. Your draft is unchanged." : "Workspace checked.",
					notificationSave: "idle",
					notificationMessage: o.notificationSave === "uncertain" ? "Current read markers checked. Review newer changes before marking read." : "Notifications checked.",
					directorySave: o.directorySave === "uncertain" ? "idle" : o.directorySave,
					directoryMessage: o.directorySave === "uncertain" ? "Current saved directory and pins checked. Review them before making another change." : o.directoryMessage
				}), o.dirty && o.draft === a.note.body && (t.update((e) => ({
					...e,
					dirty: !1,
					base: a.note.revision,
					save: "saved",
					message: "The current note is saved."
				})), v());
			} else {
				let e = f?.key === d ? f.draft : void 0, n = !1;
				try {
					e ??= Yi(sessionStorage.getItem(d));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (v(), e = void 0), t.set({
					...Hi("ready", "Workspace checked."),
					snapshot: a,
					draft: a.note.body,
					base: a.note.revision,
					recovery: e,
					storageLimited: n
				});
			}
			S();
		} catch {
			i === r && s === n && !m && x("Your workspace could not be checked. Open workspace again to retry deliberately.", !0);
		} finally {
			i === r && (i = void 0);
		}
	}
	function ee(e) {
		let n = g();
		if (n.phase === "ready" && n.snapshot) {
			if (t.set({
				...n,
				draft: e,
				dirty: e !== n.snapshot.note.body,
				save: n.save === "saved" ? "idle" : n.save
			}), Ui(e)) y();
			else if (f = void 0, d) try {
				sessionStorage.removeItem(d);
			} catch {}
		}
	}
	function te() {
		let e = g();
		e.recovery && e.snapshot && e.phase === "ready" && (t.set({
			...e,
			draft: e.recovery.body,
			base: e.recovery.base,
			dirty: !0,
			recovery: void 0,
			save: e.recovery.base === e.snapshot.note.revision ? "idle" : "conflict",
			message: "Draft recovered. Review it before saving."
		}), y());
	}
	function ne(e) {
		let n = g();
		n.snapshot && n.phase === "ready" && (t.set({
			...n,
			draft: e ? n.snapshot.note.body : n.draft,
			base: n.snapshot.note.revision,
			dirty: !e && n.draft !== n.snapshot.note.body,
			recovery: void 0,
			save: "idle",
			message: e ? "Loaded the saved note." : "Draft kept against the latest saved revision. Review, then save deliberately."
		}), y());
	}
	async function re() {
		let e = g();
		if (e.phase !== "ready" || !e.dirty || !Ui(e.draft) || [
			"conflict",
			"checking-conflict",
			"uncertain"
		].includes(e.save) || a || c || l || e.layoutSave === "checking-conflict") return;
		i?.abort(), i = void 0, r && clearTimeout(r), r = void 0;
		let o = new AbortController();
		a = o;
		let s = n, u = {
			body: e.draft,
			base: e.base
		};
		t.update((e) => ({
			...e,
			save: "saving",
			message: "Saving your note…"
		}));
		try {
			let e = await C("/api/workspace/note", o, {
				body: u.body,
				base_revision: u.base
			});
			if (m || o.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				x("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				x(w(e.status), !0);
				return;
			}
			if (e.status === 409) t.update((e) => ({
				...e,
				save: "checking-conflict",
				message: "Another save won. Checking the latest saved note before comparing. Your draft is unchanged."
			}));
			else if (e.status === 200) {
				let n = Ji(e.value);
				if (!T(n) || n.note.body !== u.body || BigInt(n.note.revision) !== BigInt(u.base) + 1n) throw Error("Unqualified save result");
				t.update((e) => ({
					...e,
					snapshot: {
						...n,
						crafty: n.crafty ?? e.snapshot?.crafty,
						directory: e.snapshot?.directory ?? n.directory,
						notifications: e.snapshot?.notifications ?? n.notifications,
						layout: e.snapshot?.layout ?? n.layout
					},
					base: n.note.revision,
					dirty: e.draft !== n.note.body,
					save: "saved",
					message: e.draft === n.note.body ? "Saved to your account." : "Submitted version saved. Your newer edits are still unsaved."
				})), y();
			} else throw Error("Save outcome unavailable");
		} catch {
			a === o && s === n && !m && t.update((e) => ({
				...e,
				save: "uncertain",
				message: "Save outcome is uncertain. Check the saved note before trying again."
			}));
		} finally {
			a === o && (a = void 0), s === n && !m && (g().save === "checking-conflict" ? await E() : S());
		}
	}
	async function ie(e, r) {
		let a = g();
		if (a.phase !== "ready" || !a.snapshot || o || c || l || a.layoutSave === "checking-conflict" || a.directorySave === "uncertain") return !1;
		i?.abort(), i = void 0;
		let s = new AbortController();
		o = s;
		let u = n;
		t.update((e) => ({
			...e,
			directorySave: "saving",
			directoryMessage: "Saving your change…"
		}));
		try {
			let i = await C(e, s, r);
			if (m || s.signal.aborted || u !== n) return !1;
			if (document.visibilityState !== "visible") return x("Workspace hidden. Checking access on return."), !1;
			if ([
				401,
				403,
				426
			].includes(i.status)) return x(w(i.status), !0), !1;
			if (i.status === 200) {
				let e = Ji(i.value);
				return T(e) ? (t.update((t) => ({
					...t,
					snapshot: t.snapshot ? {
						...t.snapshot,
						directory: e.directory
					} : void 0,
					directorySave: "idle",
					directoryMessage: "Saved to your account."
				})), !0) : (x("Your account scope changed. Open a fresh workspace.", !0), !1);
			}
			if ([
				400,
				404,
				409,
				413,
				429
			].includes(i.status)) return t.update((e) => ({
				...e,
				directorySave: i.status === 409 ? "conflict" : "idle",
				directoryMessage: i.status === 409 ? "Another change was saved first. Check the saved directory and review your edit before saving again." : "Change not accepted. Check the link, field limits and pin limit."
			})), !1;
			throw Error("Uncertain directory outcome");
		} catch {
			return o === s && u === n && !m && t.update((e) => ({
				...e,
				directorySave: "uncertain",
				directoryMessage: "The save may have completed. Check saved services before making another change."
			})), !1;
		} finally {
			o === s && (o = void 0), u === n && !m && S();
		}
	}
	function ae(e, t) {
		return ie("/api/owner/directory", {
			base_revision: e,
			change: t
		});
	}
	function oe(e) {
		let t = g().snapshot?.directory;
		return t ? ie("/api/workspace/pins", {
			base_directory_revision: t.revision,
			base_revision: t.pins_revision,
			ids: e
		}) : Promise.resolve(!1);
	}
	async function se(e, s) {
		let u = g();
		if (m || h || u.phase !== "ready" || !u.snapshot || c || a || o || l || u.layoutSave === "checking-conflict" || u.notificationSave !== "idle" || !["services", "connections"].includes(e) || !$(s, !0)) return;
		i?.abort(), i = void 0, r && clearTimeout(r), r = void 0;
		let d = new AbortController();
		c = d;
		let f = n;
		t.update((e) => ({
			...e,
			notificationSave: "saving",
			notificationMessage: "Saving your read marker…"
		}));
		try {
			let r = await C("/api/workspace/notifications/read", d, {
				category: e,
				through: s
			});
			if (m || d.signal.aborted || f !== n) return;
			if (document.visibilityState !== "visible") {
				x("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				x(w(r.status), !0);
				return;
			}
			if (r.status === 409) throw Error("Read watermark changed");
			let i = r.value;
			if (r.status !== 200 || !Q(i)) throw Error("Read marker unavailable");
			if (i.product !== Ii || i.contract !== Li || i.schema !== 1 || !Q(i.account) || i.account.id !== u.snapshot.account.id || i.account.username !== u.snapshot.account.username || i.account.role !== u.snapshot.account.role || i.session_generation !== u.snapshot.session_generation) {
				x("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let a = Gi(i.notifications), o = a.groups.find((t) => t.category === e);
			if (!o || BigInt(o.read_through) < BigInt(s)) throw Error("Unqualified read marker");
			t.update((e) => ({
				...e,
				snapshot: e.snapshot ? {
					...e.snapshot,
					notifications: a
				} : void 0,
				notificationSave: "idle",
				notificationMessage: "Read marker saved. Newer changes remain unread."
			}));
		} catch {
			c === d && f === n && !m && t.update((e) => ({
				...e,
				notificationSave: "uncertain",
				notificationMessage: "The read marker may have saved. Check notifications to see the current state."
			}));
		} finally {
			c === d && (c = void 0), f === n && !m && S();
		}
	}
	function ce() {
		let e = g();
		e.phase !== "ready" || !e.snapshot || e.layoutDraft || a || o || c || l || (i?.abort(), i = void 0, r && clearTimeout(r), r = void 0, t.set({
			...e,
			layoutDraft: {
				base: e.snapshot.layout.revision,
				panels: e.snapshot.layout.panels.map((e) => ({ ...e }))
			},
			layoutSave: "idle",
			layoutMessage: "Arrange your Home panels, then save to your account."
		}), S());
	}
	function le(e) {
		let n = g();
		n.phase === "ready" && n.layoutDraft && ![
			"saving",
			"checking-conflict",
			"uncertain"
		].includes(n.layoutSave) && t.set({
			...n,
			layoutDraft: {
				...n.layoutDraft,
				panels: e
			},
			layoutMessage: "Your arrangement is unsaved."
		});
	}
	function ue(e, t) {
		let n = g().layoutDraft?.panels.map((e) => ({ ...e }));
		if (!n) return;
		let r = n.findIndex((t) => t.id === e), i = r + t;
		r < 0 || i < 0 || i >= n.length || ([n[r], n[i]] = [n[i], n[r]], le(n));
	}
	function de(e) {
		let t = g().layoutDraft?.panels.map((e) => ({ ...e }));
		if (!t) return;
		let n = t.find((t) => t.id === e);
		!n || n.visible && t.filter((e) => e.visible).length === 1 || (n.visible = !n.visible, le(t));
	}
	function fe() {
		le(zi());
	}
	function pe() {
		let e = g();
		e.phase !== "ready" || [
			"saving",
			"checking-conflict",
			"uncertain"
		].includes(e.layoutSave) || (t.set({
			...e,
			layoutDraft: void 0,
			layoutSave: "idle",
			layoutMessage: "Your saved Home layout is in use."
		}), S());
	}
	function D(e) {
		let n = g();
		n.phase === "ready" && n.snapshot && n.layoutDraft && n.layoutSave === "conflict" && (e ? pe() : t.set({
			...n,
			layoutDraft: {
				...n.layoutDraft,
				base: n.snapshot.layout.revision
			},
			layoutSave: "idle",
			layoutMessage: "Your arrangement is kept against the checked saved layout. Review, then save deliberately."
		}));
	}
	async function me() {
		let e = g();
		if (m || h || e.phase !== "ready" || !e.snapshot || !e.layoutDraft || e.layoutSave !== "idle" || a || o || c || l) return;
		let s = {
			base: e.layoutDraft.base,
			panels: e.layoutDraft.panels.map((e) => ({ ...e }))
		};
		if (!s.panels.some((e) => e.visible) || qi(s.panels, e.snapshot.layout.panels)) return;
		i?.abort(), i = void 0, r && clearTimeout(r), r = void 0;
		let u = new AbortController();
		l = u;
		let d = n;
		t.update((e) => ({
			...e,
			layoutSave: "saving",
			layoutMessage: "Saving your Home layout…"
		}));
		let f = !1;
		try {
			let r = await C("/api/workspace/layout", u, {
				base_revision: s.base,
				panels: s.panels
			});
			if (m || u.signal.aborted || d !== n) return;
			if (document.visibilityState !== "visible") {
				x("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				x(w(r.status), !0);
				return;
			}
			if (r.status === 409) f = !0, t.update((e) => ({
				...e,
				layoutSave: "checking-conflict",
				layoutMessage: "Another layout was saved first. Checking the saved arrangement before comparing; your changes are unchanged."
			}));
			else if ([
				400,
				413,
				429
			].includes(r.status)) t.update((e) => ({
				...e,
				layoutSave: "idle",
				layoutMessage: "The layout was not accepted. Keep at least one panel visible and review your changes."
			}));
			else {
				let n = r.value;
				if (r.status !== 200 || !Q(n)) throw Error("Layout unavailable");
				if (n.product !== Ii || n.contract !== Li || n.schema !== 1 || !Q(n.account) || n.account.id !== e.snapshot.account.id || n.account.username !== e.snapshot.account.username || n.account.role !== e.snapshot.account.role || n.session_generation !== e.snapshot.session_generation) {
					x("Your account scope changed. Open a fresh workspace.", !0);
					return;
				}
				let i = Ki(n.layout);
				if (BigInt(i.revision) !== BigInt(s.base) + 1n || !qi(i.panels, s.panels)) throw Error("Unqualified layout result");
				t.update((e) => ({
					...e,
					snapshot: e.snapshot ? {
						...e.snapshot,
						layout: i
					} : void 0,
					layoutDraft: void 0,
					layoutSave: "idle",
					layoutMessage: "Layout saved to your account."
				}));
			}
		} catch {
			l === u && d === n && !m && t.update((e) => ({
				...e,
				layoutSave: "uncertain",
				layoutMessage: "The layout may have saved. Check the saved layout before saving again; your changes have not been sent again."
			}));
		} finally {
			l === u && (l = void 0), d === n && !m && (f ? await E(!0) : S());
		}
	}
	async function he(e = g().activity.category, r = g().activity.query, i = !1) {
		let a = g();
		if (m || h || a.phase !== "ready" || !a.snapshot || document.visibilityState !== "visible") return;
		s?.abort();
		let o = new AbortController();
		s = o;
		let c = ++u, l = n, d = a.activity, f = new URLSearchParams({
			category: e,
			q: r
		});
		if (i) {
			if (!d.next || d.category !== e || d.query !== r) return;
			f.set("through", d.through), f.set("before", d.next);
		}
		t.update((t) => ({
			...t,
			activity: {
				...Vi(),
				phase: "loading",
				category: e,
				query: r,
				message: "Checking your retained activity…"
			}
		}));
		try {
			let s = await C(`/api/workspace/activity?${f}`, o);
			if (m || o.signal.aborted || c !== u || l !== n) return;
			if (document.visibilityState !== "visible") {
				x("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				x(w(s.status), !0);
				return;
			}
			let p = s.value;
			if (s.status !== 200 || !Q(p) || p.product !== Ii || p.contract !== Li || p.schema !== 1 || !Q(p.account) || p.account.id !== a.snapshot.account.id || p.account.role !== a.snapshot.account.role || p.account.username !== a.snapshot.account.username || p.session_generation !== a.snapshot.session_generation) {
				if (s.status === 200) {
					x("Your account scope changed. Open a fresh workspace.", !0);
					return;
				}
				throw Error("Activity unavailable");
			}
			let h = [
				"workspace",
				"directory",
				"connections"
			], g = [
				"note_saved",
				"pins_saved",
				"service_added",
				"service_updated",
				"service_removed",
				"connection_saved",
				"connection_removed"
			];
			if (p.category !== e || p.q !== r || !$(p.through) || p.next_before !== null && !$(p.next_before, !0) || i && p.through !== d.through || !Array.isArray(p.entries) || p.entries.length > 25 || p.entries.some((e) => !Q(e) || !$(e.id, !0) || !$(e.revision, !0) || !$(e.occurred_at) || BigInt(e.occurred_at) > 253402300799n || !g.includes(String(e.kind)) || !h.includes(String(e.category)) || typeof e.label != "string" || !/^[A-Za-z ]{1,64}$/.test(e.label) || BigInt(e.id) > BigInt(p.through) || i && BigInt(e.id) >= BigInt(d.next)) || p.entries.some((e, t) => t > 0 && BigInt(e.id) >= BigInt(p.entries[t - 1].id)) || p.next_before !== null && (p.entries.length !== 25 || p.next_before !== p.entries.at(-1)?.id)) throw Error("Invalid activity response");
			t.update((t) => ({
				...t,
				activity: {
					phase: "ready",
					category: e,
					query: r,
					entries: p.entries,
					through: p.through,
					next: p.next_before,
					message: "Retained activity checked."
				}
			}));
		} catch {
			!m && c === u && l === n && t.update((t) => ({
				...t,
				activity: {
					...Vi(),
					phase: "error",
					category: e,
					query: r,
					message: "Activity could not be checked. Retry deliberately; other workspace views remain available."
				}
			}));
		} finally {
			s === o && (s = void 0);
		}
	}
	function ge() {
		v(), x("Signing out…", !0);
		try {
			p?.postMessage({ kind: "auth-changed" });
		} catch {}
	}
	function _e() {
		let e = () => x("Workspace hidden. Checking access on return."), n = () => {
			E();
		}, r = () => {
			document.visibilityState === "visible" ? n() : e();
		};
		try {
			p = new BroadcastChannel("keida-hub-reborn.account.v1"), p.onmessage = (e) => {
				Q(e.data) && e.data.kind === "auth-changed" && x("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), E(), () => {
			m = !0, b(), p?.close(), t.set(Hi("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
		};
	}
	return {
		model: t,
		start: _e,
		edit: ee,
		recover: te,
		resolve: ne,
		save: re,
		signOut: ge,
		check: () => E(!0),
		editService: ae,
		pins: oe,
		activity: he,
		markNotification: se,
		beginLayout: ce,
		moveLayout: ue,
		toggleLayout: de,
		resetLayout: fe,
		cancelLayout: pe,
		resolveLayout: D,
		saveLayout: me,
		checkLayout: () => E(!0)
	};
}
// src/LayoutEditor.svelte
var Zi = /* @__PURE__ */ K("<li tabindex=\"-1\"><label><input type=\"checkbox\"/><span> </span></label> <div class=\"layout-move\"><button class=\"button secondary layout-up\">↑<span class=\"sr-only\">Move up</span></button><button class=\"button secondary layout-down\">↓<span class=\"sr-only\">Move down</span></button></div></li>"), Qi = /* @__PURE__ */ K("<li> </li>"), $i = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Layout conflict\"><h3>There’s a newer saved layout</h3><p>Your arrangement is still shown. Compare it with the saved order below before choosing what to keep.</p><ol></ol><div class=\"button-row\"><button class=\"button secondary\">Keep my layout against saved layout</button><button class=\"text-button layout-use-saved\">Use saved layout</button></div></section>"), ea = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain layout\"><h3>Check before saving again</h3><p>The layout may have saved. Your arrangement has not been sent again.</p><button class=\"button secondary check-layout check-saved-layout\">Check saved layout</button></section>"), ta = /* @__PURE__ */ K("<section class=\"layout-editor card\" aria-label=\"Home layout\"><h2>Make Home yours</h2><p>Choose the panels you see and their order. Keep at least one visible. Your other views and open forms stay available.</p> <ol class=\"layout-list\"></ol> <!> <!> <div class=\"button-row\"><button class=\"button primary save-layout\"> </button><button class=\"text-button cancel-layout\">Cancel layout</button><button class=\"text-button reset-layout\">Reset layout</button></div> <p class=\"field-help\">Reset previews the default order and visibility. Save layout applies it to this account.</p></section>");
function na(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = Z(t, "draft", 8), o = Z(t, "saved", 8), s = Z(t, "state", 8), c = Z(t, "authorized", 8), l = Z(t, "move", 8), u = Z(t, "toggle", 8), d = Z(t, "save", 8), f = Z(t, "cancel", 8), p = Z(t, "reset", 8), m = Z(t, "resolve", 8), h = Z(t, "check", 8);
	async function g(e, t) {
		l()(e, t), await dr(), document.querySelector(`[data-layout-row="${e}"]`)?.focus();
	}
	wn(() => (W(c()), W(s())), () => {
		F(n, !c() || [
			"saving",
			"checking-conflict",
			"uncertain"
		].includes(s()));
	}), wn(() => W(a()), () => {
		F(r, a()?.panels.filter((e) => e.visible).length ?? 0);
	}), wn(() => (W(a()), W(o())), () => {
		F(i, !!a() && !!o() && a().panels.some((e, t) => e.id !== o()?.panels[t].id || e.visible !== o()?.panels[t].visible));
	}), Tn(), Si();
	var _ = ta(), v = R(I(_), 3);
	Wr(v, 7, () => (W(a()), U(() => a()?.panels ?? [])), (e) => e.id, (e, t, i) => {
		var a = Zi(), o = I(a), s = I(o);
		ui(s);
		var c = L(R(s), !0);
		A(o);
		var l = R(o, 2), d = I(l), f = R(d);
		A(l), A(a), z((e, o, l, u) => {
			X(a, "data-layout-row", (H(t), U(() => H(t).id))), X(s, "aria-label", e), fi(s, (H(t), U(() => H(t).visible))), s.disabled = (H(n), H(t), H(r), U(() => H(n) || H(t).visible && H(r) === 1)), J(c, o), X(d, "aria-label", l), d.disabled = H(n) || H(i) === 0, X(f, "aria-label", u), f.disabled = H(n) || H(i) === 2;
		}, [
			() => (W(Bi), H(t), U(() => `Show ${Bi(H(t).id)}`)),
			() => (W(Bi), H(t), U(() => Bi(H(t).id))),
			() => (W(Bi), H(t), U(() => `Move ${Bi(H(t).id)} up`)),
			() => (W(Bi), H(t), U(() => `Move ${Bi(H(t).id)} down`))
		]), G("change", s, () => u()(H(t).id)), G("click", d, () => g(H(t).id, -1)), G("click", f, () => g(H(t).id, 1)), q(e, a);
	}), A(v);
	var y = R(v, 2), b = (e) => {
		var t = $i(), n = R(I(t), 2);
		Wr(n, 5, () => (W(o()), U(() => o()?.panels ?? [])), (e) => e.id, (e, t) => {
			var n = Qi(), r = L(n);
			z((e) => J(r, `${e ?? ""} — ${H(t), U(() => H(t).visible ? "Shown" : "Hidden") ?? ""}`), [() => (W(Bi), H(t), U(() => Bi(H(t).id)))]), q(e, n);
		}), A(n);
		var r = R(n), i = I(r), a = R(i);
		A(r), A(t), G("click", i, () => m()(!1)), G("click", a, () => m()(!0)), q(e, t);
	};
	Y(y, (e) => {
		s() === "conflict" && e(b);
	});
	var x = R(y, 2), S = (e) => {
		var t = ea(), n = R(I(t), 2);
		A(t), G("click", n, () => h()()), q(e, t);
	};
	Y(x, (e) => {
		s() === "uncertain" && e(S);
	});
	var C = R(x, 2), w = I(C), T = L(w, !0), E = R(w), ee = R(E);
	A(C), Se(2), A(_), z(() => {
		X(_, "hidden", !c() || !a()), w.disabled = H(n) || s() === "conflict" || !H(i), J(T, s() === "saving" ? "Saving layout…" : "Save layout"), E.disabled = H(n), ee.disabled = H(n);
	}), G("click", w, () => d()()), G("click", E, function(...e) {
		f()?.apply(this, e);
	}), G("click", ee, function(...e) {
		p()?.apply(this, e);
	}), q(e, _), We();
}
Sr(["change", "click"]);
// src/Connections.svelte
var ra = /* @__PURE__ */ K("<section class=\"card small-card\"><h2>No Crafty connection enrolled</h2><p>An owner can add dedicated access and choose which servers to show.</p></section>"), ia = /* @__PURE__ */ K("<p class=\"notice\" role=\"status\"> </p>"), aa = /* @__PURE__ */ K("<p class=\"field-help\">This server could not be fully observed.</p>"), oa = /* @__PURE__ */ K("<article class=\"card small-card server-card\"><h2> </h2> <p><strong> </strong> <span class=\"field-help\">Provider-reported process state</span></p> <dl><dt>Players</dt><dd> </dd> <dt>Freshness</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd> <dt>Join address</dt><dd> </dd></dl> <!></article>"), sa = /* @__PURE__ */ K("<!> <div class=\"server-grid\"></div> <p class=\"field-help\">A running process does not establish game readiness. Join addresses are owner-reviewed; outside-network joining is accepted separately.</p>", 1), ca = /* @__PURE__ */ K("<button class=\"button secondary\">Check connection state</button>"), la = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove server</button>"), ua = /* @__PURE__ */ K("<fieldset><legend> </legend> <label>Crafty server UUID</label><input name=\"server-id\" required=\"\" maxlength=\"36\"/> <label>Display name</label><input name=\"server-name\" required=\"\" maxlength=\"80\"/> <label>Reviewed public join address, optional</label><input name=\"server-join\" maxlength=\"253\" placeholder=\"play.example:25565\"/> <!></fieldset>"), da = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove connection</button>"), fa = /* @__PURE__ */ K("<section class=\"card connection-setup\" aria-label=\"Dedicated Crafty enrollment\"><h2>Dedicated Crafty access</h2> <p>Create access specifically for Reborn, limited to viewing the selected servers. Credentials are encrypted on the server and are not shown again.</p> <p class=\"workspace-status\" role=\"status\"> </p> <!> <form autocomplete=\"off\"><label for=\"crafty-endpoint\">Crafty HTTPS address</label><input id=\"crafty-endpoint\" name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\" placeholder=\"https://crafty.example/\"/> <label for=\"crafty-token\">Dedicated API token</label><input id=\"crafty-token\" name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label for=\"crafty-timezone\">Crafty’s configured time zone</label><input id=\"crafty-timezone\" name=\"timezone\" required=\"\" maxlength=\"64\" placeholder=\"America/Chicago or UTC\"/> <label for=\"crafty-ca\">Private CA certificate, if needed</label><textarea id=\"crafty-ca\" name=\"ca-pem\" maxlength=\"8192\" rows=\"3\"></textarea> <p class=\"field-help\">Leave the certificate blank for publicly trusted HTTPS. The address and certificate must pass normal hostname and trust checks.</p> <!> <div class=\"button-row\"><button class=\"button secondary\" type=\"button\">Add server</button> <button class=\"button primary\" type=\"submit\"> </button></div></form> <!></section>"), pa = /* @__PURE__ */ K("<button class=\"text-button\">View connection enrollment history</button> <div class=\"connections-intro\"><p>Server observations from your deliberately enrolled Crafty connection.</p><span class=\"quiet-label\">Read-only overview</span></div> <!> <!>", 1);
function ma(e, t) {
	Ue(t, !1);
	let n = Z(t, "binding", 8), r = Z(t, "history", 8), i = Z(t, "overview", 8), a = Z(t, "owner", 8, !1), o = Z(t, "active", 8, !1), s = Z(t, "refresh", 8), c = /* @__PURE__ */ P(), l = /* @__PURE__ */ P([0]), u = /* @__PURE__ */ P(0), d = /* @__PURE__ */ P(), f = /* @__PURE__ */ P(""), p = /* @__PURE__ */ P(!1), m = 0, h = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
	function g() {
		++m, H(d)?.abort(), F(d, void 0), H(c)?.reset(), F(l, [Kt(u)]), F(f, ""), F(p, !1);
	}
	Pi(g);
	async function _(e = !1) {
		if (!o() || !a() || H(d) || !i() || H(p)) return;
		let t = i().revision, r = H(c) ? new FormData(H(c)) : void 0, h = (e) => r?.getAll(e).map(String) ?? [], g = h("server-id"), _ = h("server-name"), v = h("server-join"), y = e ? null : {
			endpoint: String(r?.get("endpoint") ?? ""),
			token: String(r?.get("token") ?? ""),
			ca_pem: String(r?.get("ca-pem") ?? ""),
			timezone: String(r?.get("timezone") ?? ""),
			servers: g.map((e, t) => ({
				id: e,
				name: _[t] ?? "",
				join: v[t] ?? ""
			}))
		};
		H(c)?.reset(), F(l, [Kt(u)]);
		let b = new AbortController();
		F(d, b);
		let x = ++m, S = setTimeout(() => b.abort(), 4e3);
		F(f, e ? "Removing the connection…" : "Saving the dedicated connection…");
		try {
			let r = await fetch("/api/owner/crafty", {
				method: "PUT",
				credentials: "same-origin",
				redirect: "error",
				cache: "no-store",
				signal: b.signal,
				headers: {
					"Content-Type": "application/json",
					"X-Reborn-Product": "keida-hub-reborn",
					"X-Reborn-Contract": "reborn-workspace-v1",
					"X-CSRF-Token": n()
				},
				body: JSON.stringify({
					base_revision: t,
					connection: y
				})
			});
			if (x !== m || !o()) return;
			if (r.status === 200) F(f, e ? "Connection removed." : "Connection saved. Checking provider observations…");
			else if (r.status === 409) F(f, "The connection changed elsewhere. Check its current state before enrolling again.");
			else if ([
				400,
				401,
				403,
				413,
				426
			].includes(r.status)) F(f, "Connection not accepted. Check your account and the dedicated connection details.");
			else throw Error("Uncertain connection outcome");
			await s()();
		} catch {
			x === m && o() && (F(p, !0), F(f, "The save outcome is uncertain. Check the connection before entering credentials again."));
		} finally {
			clearTimeout(S), H(d) === b && F(d, void 0);
		}
	}
	async function v() {
		await s()(), o() && (F(p, !1), F(f, "Review the current connection state before making another change."));
	}
	wn(() => W(o()), () => {
		o() || g();
	}), Tn(), Si();
	var y = pa(), b = sn(y), x = R(b, 4), S = (e) => {
		q(e, ra());
	}, C = (e) => {
		var t = sa(), n = sn(t), r = (e) => {
			var t = ia(), n = L(t, !0);
			z(() => J(n, (W(i()), U(() => i().error === "checking" ? "Checking the provider. Fresh results will appear on the next observation." : "Provider observations are unavailable or incomplete. Unknown player counts stay unknown.")))), q(e, t);
		};
		Y(n, (e) => {
			W(i()), U(() => i().error) && e(r);
		});
		var a = R(n, 2);
		Wr(a, 5, () => (W(i()), U(() => i().servers)), Br, (e, t) => {
			var n = oa(), r = I(n), i = L(r, !0), a = R(r, 2), o = L(I(a), !0);
			Se(2), A(a);
			var s = R(a, 2), c = R(I(s)), l = L(c), u = R(c, 3), d = L(u, !0), f = R(u, 3), p = L(f, !0), m = R(f, 2), g = L(m, !0), _ = L(R(m, 3), !0);
			A(s);
			var v = R(s, 2), y = (e) => {
				q(e, aa());
			};
			Y(v, (e) => {
				H(t), U(() => H(t).error) && e(y);
			}), A(n), z((e, n) => {
				J(i, (H(t), U(() => H(t).name))), J(o, (H(t), U(() => H(t).state === "running" ? "Running" : H(t).state === "stopped" ? "Stopped" : "Unknown"))), J(l, `${H(t), U(() => H(t).players === null ? "Not reported" : `${H(t).players} reported`) ?? ""}${H(t), U(() => H(t).capacity === null ? "" : ` / ${H(t).capacity} capacity`) ?? ""}`), J(d, (H(t), U(() => H(t).freshness === "fresh" ? "Recent provider sample" : H(t).freshness === "stale" ? "Stale provider sample" : "Provider sample age unknown"))), J(p, e), J(g, n), J(_, (H(t), U(() => H(t).join || "Not configured")));
			}, [() => (H(t), U(() => h(H(t).collected_at))), () => (H(t), U(() => h(H(t).provider_at)))]), q(e, n);
		}), A(a), Se(2), q(e, t);
	};
	Y(x, (e) => {
		W(i()), U(() => !i() || !i().configured) ? e(S) : e(C, -1);
	});
	var w = R(x, 2), T = (e) => {
		var t = fa(), n = R(I(t), 4), r = L(n, !0), a = R(n, 2), o = (e) => {
			var t = ca();
			G("click", t, () => void v()), q(e, t);
		};
		Y(a, (e) => {
			H(p) && e(o);
		});
		var s = R(a, 2), m = R(I(s)), h = R(m, 3), g = R(h, 3), y = R(g, 3), b = R(y, 4);
		Wr(b, 3, () => H(l), (e) => e, (e, t, n) => {
			var r = ua(), i = I(r), a = L(i), o = R(i, 2), s = R(o), c = R(s, 2), u = R(c), f = R(u, 2), m = R(f), h = R(m, 2), g = (e) => {
				var n = la();
				z(() => n.disabled = !!H(d) || H(p)), G("click", n, () => F(l, H(l).filter((e) => e !== H(t)))), q(e, n);
			};
			Y(h, (e) => {
				H(l), U(() => H(l).length > 1) && e(g);
			}), A(r), z(() => {
				J(a, `Server ${H(n) + 1}`), X(o, "for", `crafty-id-${H(t)}`), X(s, "id", `crafty-id-${H(t)}`), s.disabled = !!H(d) || H(p), X(c, "for", `crafty-name-${H(t)}`), X(u, "id", `crafty-name-${H(t)}`), u.disabled = !!H(d) || H(p), X(f, "for", `crafty-join-${H(t)}`), X(m, "id", `crafty-join-${H(t)}`), m.disabled = !!H(d) || H(p);
			}), q(e, r);
		});
		var x = R(b, 2), S = I(x), C = R(S, 2), w = L(C, !0);
		A(x), A(s), xi(s, (e) => F(c, e), () => H(c));
		var T = R(s, 2), E = (e) => {
			var t = da();
			z(() => t.disabled = !!H(d) || H(p)), G("click", t, () => void _(!0)), q(e, t);
		};
		Y(T, (e) => {
			W(i()), U(() => i()?.configured) && e(E);
		}), A(t), z(() => {
			J(r, H(f)), m.disabled = !!H(d) || H(p), h.disabled = !!H(d) || H(p), g.disabled = !!H(d) || H(p), y.disabled = !!H(d) || H(p), S.disabled = (H(l), H(d), H(p), U(() => H(l).length >= 8 || !!H(d) || H(p))), C.disabled = !!H(d) || H(p) || !i(), J(w, H(d) ? "Working…" : "Save dedicated connection");
		}), xr("submit", s, (e) => {
			e.preventDefault(), _();
		}), G("click", S, () => F(l, [...H(l), Kt(u)])), q(e, t);
	};
	Y(w, (e) => {
		a() && o() && e(T);
	}), G("click", b, function(...e) {
		r()?.apply(this, e);
	}), q(e, y), We();
}
Sr(["click"]);
// src/Directory.svelte
var ha = /* @__PURE__ */ K("<button class=\"text-button\">Browse services <span aria-hidden=\"true\">→</span></button>"), ga = /* @__PURE__ */ K("<section class=\"notice\"><h3>Review the saved state</h3><p> </p><button class=\"button secondary\">Check saved services</button></section>"), _a = /* @__PURE__ */ K("<option> </option>"), va = /* @__PURE__ */ K("<div class=\"directory-filters\"><div><label for=\"service-search\">Search services</label><input id=\"service-search\" type=\"search\" maxlength=\"120\" placeholder=\"Name, category or description\"/></div><div><label for=\"service-filter\">Category</label><select id=\"service-filter\"><option>All categories</option><!></select></div></div>"), ya = /* @__PURE__ */ K("<section class=\"card small-card\"><h3> </h3><p> </p></section>"), ba = /* @__PURE__ */ K("<p> </p>"), xa = /* @__PURE__ */ K("<button class=\"text-button move-up\">↑</button><button class=\"text-button move-down\">↓</button>", 1), Sa = /* @__PURE__ */ K("<p>The directory changed. Review the service and choose Remove again.</p>"), Ca = /* @__PURE__ */ K("<div class=\"notice\"><p> </p><!><div class=\"button-row\"><button class=\"button secondary confirm-remove\">Remove service</button><button class=\"text-button\">Keep service</button></div></div>"), wa = /* @__PURE__ */ K("<div class=\"button-row\"><button class=\"text-button edit-service\"> </button><button class=\"text-button remove-service\">Remove</button></div> <!>", 1), Ta = /* @__PURE__ */ K("<article class=\"card small-card service-card\"><p class=\"eyebrow\"> </p><h3><a class=\"service-link\" target=\"_blank\" rel=\"noopener noreferrer\"> <span class=\"sr-only\">(opens in a new tab)</span> <span aria-hidden=\"true\">↗</span></a></h3> <!> <p class=\"field-help service-address\"> </p> <div class=\"button-row\"><button class=\"button secondary pin-service\"> </button> <!></div> <!></article>"), Ea = /* @__PURE__ */ K("<div class=\"directory-grid\"></div>"), Da = /* @__PURE__ */ K("<p class=\"field-help\">Up to 24 personal pins. Links open the selected service in a new tab. Each service handles its own sign-in; directory links do not check availability.</p>"), Oa = /* @__PURE__ */ K("<div class=\"notice\"><p>The directory changed after this form was opened. Review the current entries, then choose whether to keep this edit.</p><button class=\"button secondary\" type=\"button\">Keep edit against current directory</button></div>"), ka = /* @__PURE__ */ K("<section class=\"card directory-editor\" aria-label=\"Service editor\"><h2> </h2><p>Add a reviewed HTTPS link without passwords, tokens, query parameters or fragments. These links are visible to signed-in accounts.</p> <form><label for=\"service-name\">Service name</label><input id=\"service-name\" name=\"service-name\" required=\"\" maxlength=\"80\"/> <label for=\"service-category\">Category</label><input id=\"service-category\" name=\"service-category\" required=\"\" maxlength=\"40\"/> <label for=\"service-url\">HTTPS link</label><input id=\"service-url\" name=\"service-url\" type=\"url\" required=\"\" maxlength=\"1024\" placeholder=\"https://service.example/\"/> <label for=\"service-description\">Description, optional</label><textarea id=\"service-description\" name=\"service-description\" maxlength=\"240\" rows=\"2\"></textarea> <!> <div class=\"button-row\"><button class=\"button primary\" type=\"submit\"> </button><button class=\"text-button\" type=\"button\"> </button></div></form></section>"), Aa = /* @__PURE__ */ K("<div class=\"directory-heading\"><div><p class=\"eyebrow\"> </p><h2> </h2></div><!></div> <p class=\"directory-status\" role=\"status\"> </p> <!> <!> <!> <!> <!>", 1);
function ja(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = Z(t, "directory", 8), o = Z(t, "authorized", 8, !1), s = Z(t, "owner", 8, !1), c = Z(t, "compact", 8, !1), l = Z(t, "state", 8), u = Z(t, "message", 8), d = Z(t, "browse", 8), f = Z(t, "check", 8), p = Z(t, "edit", 8), m = Z(t, "pin", 8), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P(""), _ = /* @__PURE__ */ P(""), v = /* @__PURE__ */ P(""), y = /* @__PURE__ */ P(""), b = /* @__PURE__ */ P(""), x = /* @__PURE__ */ P(""), S = /* @__PURE__ */ P(), C = /* @__PURE__ */ P(), w = 0;
	function T() {
		++w, F(h, ""), F(g, ""), F(_, ""), F(v, ""), F(y, ""), F(b, ""), F(x, ""), F(C, void 0), F(S, void 0);
	}
	Pi(T);
	function E() {
		F(_, ""), F(v, ""), F(y, ""), F(b, ""), F(x, ""), F(C, void 0), F(S, a()?.revision);
	}
	function ee(e) {
		F(x, e.id), F(_, e.name), F(v, e.description), F(y, e.url), F(b, e.category), F(S, a()?.revision), F(C, void 0), document.querySelector("#service-name")?.focus();
	}
	async function te() {
		if (H(n) || !s() || H(S) === void 0) return;
		let e = w, t = {
			action: H(x) ? "update" : "create",
			...H(x) ? { id: H(x) } : {},
			link: {
				name: H(_),
				category: H(b),
				description: H(v),
				url: H(y)
			}
		};
		await p()(H(S), t) && o() && e === w && (await dr(), o() && e === w && E());
	}
	function ne(e) {
		!H(n) && a() && m()(a().pins.includes(e) ? a().pins.filter((t) => t !== e) : [...a().pins, e]);
	}
	function re(e, t) {
		if (H(n) || !a()) return;
		let r = [...a().pins], i = r.indexOf(e), o = i + t;
		i < 0 || o < 0 || o >= r.length || ([r[i], r[o]] = [r[o], r[i]], m()(r));
	}
	async function ie(e) {
		if (H(n) || !a() || !s() || H(C)?.id !== e) return;
		let t = w;
		await p()(H(C).base, {
			action: "delete",
			id: e
		}) && o() && t === w && (await dr(), o() && t === w && (F(C, void 0), H(x) === e && E()));
	}
	wn(() => (W(l()), W(o())), () => {
		F(n, l() === "saving" || l() === "uncertain" || !o());
	}), wn(() => W(a()), () => {
		F(r, [...new Set(a()?.services.map((e) => e.category) ?? [])].sort());
	}), wn(() => (H(g), H(r)), () => {
		H(g) && !H(r).includes(H(g)) && F(g, "");
	}), wn(() => (W(a()), W(c()), H(g), H(h)), () => {
		F(i, [...a()?.services ?? []].sort((e, t) => {
			let n = a()?.pins.indexOf(e.id) ?? -1, r = a()?.pins.indexOf(t.id) ?? -1;
			return n >= 0 || r >= 0 ? (n < 0 ? 25 : n) - (r < 0 ? 25 : r) : e.name.localeCompare(t.name) || Number(BigInt(e.id) - BigInt(t.id));
		}).filter((e) => c() ? a()?.pins.includes(e.id) : (!H(g) || e.category === H(g)) && `${e.name} ${e.category} ${e.description}`.toLocaleLowerCase().includes(H(h).toLocaleLowerCase())));
	}), wn(() => W(o()), () => {
		o() || T();
	}), wn(() => (W(o()), W(a()), H(S)), () => {
		o() && a() && H(S) === void 0 && F(S, a().revision);
	}), Tn(), Si();
	var ae = Aa(), oe = sn(ae), se = I(oe), ce = I(se), le = L(ce, !0), ue = L(R(ce), !0);
	A(se);
	var de = R(se), fe = (e) => {
		var t = ha();
		G("click", t, function(...e) {
			d()?.apply(this, e);
		}), q(e, t);
	};
	Y(de, (e) => {
		c() && e(fe);
	}), A(oe);
	var pe = R(oe, 2), D = L(pe, !0), me = R(pe, 2), he = (e) => {
		var t = ga(), n = R(I(t)), r = L(n, !0), i = R(n);
		A(t), z(() => J(r, l() === "uncertain" ? "Your change has not been sent again." : "Your edit is still in the form. Compare it with the current directory before saving.")), G("click", i, () => void f()()), q(e, t);
	};
	Y(me, (e) => {
		(l() === "uncertain" || l() === "conflict") && e(he);
	});
	var ge = R(me, 2), _e = (e) => {
		var t = va(), n = I(t), i = R(I(n));
		ui(i), A(n);
		var a = R(n), o = R(I(a)), s = I(o);
		s.value = s.__value = "", Wr(R(s), 1, () => H(r), Br, (e, t) => {
			var n = _a(), r = L(n, !0), i = {};
			z(() => {
				J(r, H(t)), i !== (i = H(t)) && (n.value = (n.__value = i) ?? "");
			}), q(e, n);
		}), A(o), ni(o), A(a), A(t), gi(i, () => H(h), (e) => F(h, e)), ri(o, () => H(g), (e) => F(g, e)), q(e, t);
	};
	Y(ge, (e) => {
		c() || e(_e);
	});
	var ve = R(ge, 2), O = (e) => {
		var t = ya(), n = I(t), r = L(n, !0), i = L(R(n), !0);
		A(t), z(() => {
			J(r, (W(c()), W(a()), U(() => c() ? "Keep your favorites close" : a()?.services.length ? "No matching services" : "Your directory starts here"))), J(i, (W(c()), W(a()), W(s()), U(() => c() ? "Pin services from the directory to show them on Home." : a()?.services.length ? "Try another search or category." : s() ? "Add a service below to make it available to signed-in accounts." : "An owner can add reviewed service links.")));
		}), q(e, t);
	}, ye = (e) => {
		var t = Ea();
		Wr(t, 5, () => H(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ pt(() => (W(a()), H(t), U(() => a()?.pins.includes(H(t).id) ?? !1))), i = /* @__PURE__ */ pt(() => (W(a()), H(t), U(() => a()?.pins.indexOf(H(t).id) ?? -1)));
			var o = Ta(), l = I(o), u = L(l, !0), d = R(l), f = I(d), p = I(f, !0);
			Se(3), A(f), A(d);
			var m = R(d, 2), h = (e) => {
				var n = ba(), r = L(n, !0);
				z(() => J(r, (H(t), U(() => H(t).description)))), q(e, n);
			};
			Y(m, (e) => {
				H(t), U(() => H(t).description) && e(h);
			});
			var g = R(m, 2), _ = L(g, !0), v = R(g, 2), y = I(v), b = L(y, !0), x = R(y, 2), S = (e) => {
				var r = xa(), o = sn(r), s = R(o);
				z(() => {
					X(o, "aria-label", (H(t), U(() => `Move ${H(t).name} up`))), o.disabled = H(n) || H(i) === 0, X(s, "aria-label", (H(t), U(() => `Move ${H(t).name} down`))), s.disabled = (H(n), W(H(i)), W(a()), U(() => H(n) || H(i) === (a()?.pins.length ?? 0) - 1));
				}), G("click", o, () => re(H(t).id, -1)), G("click", s, () => re(H(t).id, 1)), q(e, r);
			};
			Y(x, (e) => {
				H(r) && e(S);
			}), A(v);
			var w = R(v, 2), T = (e) => {
				var r = wa(), i = sn(r), o = I(i), s = L(o), c = R(o);
				A(i);
				var l = R(i, 2), u = (e) => {
					var r = Ca(), i = I(r), o = L(i), s = R(i), c = (e) => {
						q(e, Sa());
					};
					Y(s, (e) => {
						H(C), W(a()), U(() => H(C).base !== a()?.revision) && e(c);
					});
					var l = R(s), u = I(l), d = R(u);
					A(l), A(r), z(() => {
						J(o, `Remove ${H(C), U(() => H(C).name) ?? ""} from the directory and everyone’s pins?`), u.disabled = (H(n), H(C), W(a()), U(() => H(n) || H(C).base !== a()?.revision));
					}), G("click", u, () => void ie(H(t).id)), G("click", d, () => F(C, void 0)), q(e, r);
				};
				Y(l, (e) => {
					H(C), H(t), U(() => H(C)?.id === H(t).id) && e(u);
				}), z(() => {
					o.disabled = H(n), J(s, `Edit ${H(t), U(() => H(t).name) ?? ""}`), c.disabled = H(n);
				}), G("click", o, () => ee(H(t))), G("click", c, () => F(C, a() ? {
					id: H(t).id,
					base: a().revision,
					name: H(t).name
				} : void 0)), q(e, r);
			};
			Y(w, (e) => {
				s() && !c() && e(T);
			}), A(o), z(() => {
				X(o, "data-service-id", (H(t), U(() => H(t).id))), J(u, (H(t), U(() => H(t).category))), X(f, "href", (H(t), U(() => H(t).url))), J(p, (H(t), U(() => H(t).name))), J(_, (H(t), U(() => H(t).url))), X(y, "aria-pressed", H(r)), X(y, "aria-label", (W(H(r)), H(t), U(() => `${H(r) ? "Unpin" : "Pin"} ${H(t).name}`))), y.disabled = (H(n), W(H(r)), W(a()), U(() => H(n) || !H(r) && (a()?.pins.length ?? 0) >= 24)), J(b, H(r) ? "Pinned" : "Pin to Home");
			}), G("click", y, () => ne(H(t).id)), q(e, o);
		}), A(t), q(e, t);
	};
	Y(ve, (e) => {
		H(i), U(() => H(i).length === 0) ? e(O) : e(ye, -1);
	});
	var k = R(ve, 2), be = (e) => {
		q(e, Da());
	};
	Y(k, (e) => {
		c() || e(be);
	});
	var xe = R(k, 2), Ce = (e) => {
		var t = ka(), r = I(t), i = L(r, !0), o = R(r, 3), s = R(I(o));
		ui(s);
		var u = R(s, 3);
		ui(u);
		var d = R(u, 3);
		ui(d);
		var f = R(d, 3);
		et(f);
		var p = R(f, 2), m = (e) => {
			var t = Oa(), r = R(I(t));
			A(t), z(() => r.disabled = H(n)), G("click", r, () => F(S, a()?.revision)), q(e, t);
		};
		Y(p, (e) => {
			H(S), W(a()), U(() => H(S) !== void 0 && a() && H(S) !== a().revision) && e(m);
		});
		var h = R(p, 2), g = I(h), C = L(g, !0), w = R(g), T = L(w, !0);
		A(h), A(o), A(t), z(() => {
			X(t, "hidden", c()), J(i, H(x) ? "Edit service" : "Add a service"), s.disabled = H(n), u.disabled = H(n), d.disabled = H(n), f.disabled = H(n), g.disabled = (H(n), H(S), W(a()), U(() => H(n) || H(S) !== a()?.revision)), J(C, l() === "saving" ? "Saving…" : H(x) ? "Save service" : "Add service"), w.disabled = H(n), J(T, H(x) ? "Cancel edit" : "Clear form");
		}), xr("submit", o, (e) => {
			e.preventDefault(), te();
		}), gi(s, () => H(_), (e) => F(_, e)), gi(u, () => H(b), (e) => F(b, e)), gi(d, () => H(y), (e) => F(y, e)), gi(f, () => H(v), (e) => F(v, e)), G("click", w, E), q(e, t);
	};
	Y(xe, (e) => {
		s() && o() && e(Ce);
	}), z(() => {
		J(le, c() ? "YOUR SHORTCUTS" : "A PLACE FOR YOUR SERVICES"), J(ue, c() ? "Pinned services" : "Service directory"), J(D, u());
	}), q(e, ae), We();
}
Sr(["click"]);
// src/Activity.svelte
var Ma = /* @__PURE__ */ K("<p class=\"activity-empty\">No matching activity in this window. Try another action name or check the newest entries.</p>"), Na = /* @__PURE__ */ K("<li><div><strong> </strong><p> </p></div><time> </time></li>"), Pa = /* @__PURE__ */ K("<!> <ol class=\"activity-list\"></ol> <div class=\"button-row\"><button class=\"button secondary\">Check newest activity</button><button class=\"button secondary\">Older activity</button></div> <p class=\"field-help\">Up to 25 entries per page. New changes appear when you check newest; older pages stay within the current history window. Search matches action names, not note or credential contents.</p>", 1), Fa = /* @__PURE__ */ K("<button class=\"button secondary\">Retry activity</button>"), Ia = /* @__PURE__ */ K("<button class=\"button secondary\">Check activity</button>"), La = /* @__PURE__ */ K("<section class=\"card activity-card\" aria-label=\"Your retained activity\"><h2>Your activity</h2> <p>Successful changes made by your account, retained from the introduction of Activity. Connection entries describe enrollment changes, not game actions or provider uptime.</p> <form class=\"activity-search\"><div><label for=\"activity-query\">Search action names</label><input id=\"activity-query\" maxlength=\"80\" placeholder=\"For example, saved or Crafty\"/></div> <div><label for=\"activity-category\">Activity category</label><select id=\"activity-category\"><option>All activity</option><option>Workspace notes</option><option>Services and pins</option><option>Connection enrollment</option></select></div> <button type=\"submit\" class=\"button primary\">Search activity</button></form> <p class=\"workspace-status\" role=\"status\"> </p> <!></section>");
function Ra(e, t) {
	Ue(t, !1);
	let n = Z(t, "state", 8), r = Z(t, "authorized", 8, !1), i = Z(t, "load", 8), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P("all"), s = /* @__PURE__ */ P(), c = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	wn(() => W(r()), () => {
		r() || (F(a, ""), F(o, "all"), F(s, void 0));
	}), wn(() => (W(n()), H(s)), () => {
		n() !== H(s) && n().phase === "loading" && (F(s, n()), F(a, n().query), F(o, n().category));
	}), Tn(), Si();
	var l = La(), u = R(I(l), 4), d = I(u), f = R(I(d));
	ui(f), A(d);
	var p = R(d, 2), m = R(I(p)), h = I(m);
	h.value = h.__value = "all";
	var g = R(h);
	g.value = g.__value = "workspace";
	var _ = R(g);
	_.value = _.__value = "directory";
	var v = R(_);
	v.value = v.__value = "connections", A(m), ni(m), A(p);
	var y = R(p, 2);
	A(u);
	var b = R(u, 2), x = L(b, !0), S = R(b, 2), C = (e) => {
		var t = Pa(), r = sn(t), a = (e) => {
			q(e, Ma());
		};
		Y(r, (e) => {
			W(n()), U(() => n().entries.length === 0) && e(a);
		});
		var o = R(r, 2);
		Wr(o, 5, () => (W(n()), U(() => n().entries)), (e) => e.id, (e, t) => {
			var n = Na(), r = I(n), i = I(r), a = L(i, !0), o = L(R(i));
			A(r);
			var s = R(r), l = L(s, !0);
			A(n), z((e, r) => {
				X(n, "data-activity-id", (H(t), U(() => H(t).id))), J(a, (H(t), U(() => H(t).label))), J(o, `Revision ${H(t), U(() => H(t).revision) ?? ""} · ${H(t), U(() => H(t).category === "connections" ? "Connection enrollment" : H(t).category === "directory" ? "Services and pins" : "Workspace note") ?? ""}`), X(s, "datetime", e), J(l, r);
			}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => c(H(t).occurred_at)))]), q(e, n);
		}), A(o);
		var s = R(o, 2), l = I(s), u = R(l);
		A(s), Se(2), z(() => u.disabled = (W(n()), U(() => !n().next))), G("click", l, () => void i()(n().category, n().query)), G("click", u, () => void i()(n().category, n().query, !0)), q(e, t);
	}, w = (e) => {
		var t = Fa();
		G("click", t, () => void i()(n().category, n().query)), q(e, t);
	}, T = (e) => {
		var t = Ia();
		z(() => t.disabled = !r()), G("click", t, () => void i()(H(o), H(a))), q(e, t);
	};
	Y(S, (e) => {
		W(n()), U(() => n().phase === "ready") ? e(C) : (W(n()), U(() => n().phase === "error") ? e(w, 1) : (W(n()), U(() => n().phase === "idle") && e(T, 2)));
	}), A(l), z(() => {
		f.disabled = !r(), m.disabled = !r(), y.disabled = !r(), J(x, (W(n()), U(() => n().message)));
	}), xr("submit", u, (e) => {
		e.preventDefault(), i()(H(o), H(a));
	}), gi(f, () => H(a), (e) => F(a, e)), ri(m, () => H(o), (e) => F(o, e)), q(e, l), We();
}
Sr(["click"]);
// src/Notifications.svelte
var za = /* @__PURE__ */ K("<div class=\"notice\"><h3>Check your read markers</h3><p>The change may have completed. Check notifications before marking another group read.</p></div>"), Ba = /* @__PURE__ */ K("<p class=\"notification-empty\"> </p>"), Va = /* @__PURE__ */ K("<li><div><h3> </h3><p class=\"notification-count\"> </p><p> </p><p class=\"field-help\"><time> </time></p></div> <button class=\"button secondary mark-notification-read\"> </button></li>"), Ha = /* @__PURE__ */ K("<div class=\"notification-card card\"><div class=\"notification-heading\"><div><p class=\"eyebrow\">AT YOUR PACE</p><h2>Your notifications</h2></div><button class=\"button secondary check-notifications\">Check notifications</button></div> <p>Shared service and connection changes from other accounts, grouped together. Opening this inbox leaves them unread.</p> <label class=\"notification-filter\"><input id=\"notification-show-read\" type=\"checkbox\"/> Show read groups</label> <p class=\"notification-status\" role=\"status\"> </p> <!> <!> <ul class=\"notification-list\"></ul></div>");
function Ua(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ P(), r = Z(t, "value", 8), i = Z(t, "authorized", 8), a = Z(t, "state", 8), o = Z(t, "message", 8), s = Z(t, "check", 8), c = Z(t, "mark", 8), l = /* @__PURE__ */ P(!1), u = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	wn(() => W(i()), () => {
		i() || F(l, !1);
	}), wn(() => (W(i()), W(r()), H(l)), () => {
		F(n, i() ? (r()?.groups ?? []).filter((e) => H(l) || e.unread !== "0") : []);
	}), Tn(), Si();
	var d = Ha(), f = I(d), p = R(I(f));
	A(f);
	var m = R(f, 4), h = I(m);
	ui(h), Se(), A(m);
	var g = R(m, 2), _ = L(g, !0), v = R(g, 2), y = (e) => {
		q(e, za());
	};
	Y(v, (e) => {
		a() === "uncertain" && e(y);
	});
	var b = R(v, 2), x = (e) => {
		var t = Ba(), n = L(t, !0);
		z(() => J(n, H(l) ? "No shared changes to show yet." : "You’re all caught up.")), q(e, t);
	};
	Y(b, (e) => {
		H(n), U(() => H(n).length === 0) && e(x);
	});
	var S = R(b, 2);
	Wr(S, 5, () => H(n), (e) => e.category, (e, t) => {
		var n = Va(), r = I(n), o = I(r), s = L(o, !0), l = R(o), d = L(l, !0), f = R(l), p = L(f, !0), m = R(f), h = I(m), g = L(h, !0);
		A(m), A(r);
		var _ = R(r, 2), v = L(_);
		A(n), z((e, r) => {
			X(n, "data-notification-category", (H(t), U(() => H(t).category))), J(s, (H(t), U(() => H(t).category === "services" ? "Services" : "Connections"))), J(d, (H(t), U(() => H(t).unread === "0" ? "Read" : `${H(t).unread} unread ${H(t).unread === "1" ? "change" : "changes"}`))), J(p, (H(t), U(() => H(t).latest.label))), X(h, "datetime", e), J(g, r), _.disabled = (W(i()), W(a()), H(t), U(() => !i() || a() !== "idle" || H(t).unread === "0")), J(v, `Mark ${H(t), U(() => H(t).category === "services" ? "services" : "connections") ?? ""} read`);
		}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).latest.occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => u(H(t).latest.occurred_at)))]), G("click", _, () => c()(H(t).category, H(t).revision)), q(e, n);
	}), A(S), A(d), z(() => {
		p.disabled = !i() || a() === "saving", h.disabled = !i(), J(_, o() || "Read markers are saved to your account.");
	}), G("click", p, () => s()()), _i(h, () => H(l), (e) => F(l, e)), q(e, d), We();
}
Sr(["click"]);
// src/App.svelte
var Wa = /* @__PURE__ */ K("<span class=\"notification-badge\"> </span>"), Ga = /* @__PURE__ */ K("<a rel=\"noreferrer\"> </a>"), Ka = /* @__PURE__ */ K("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), qa = /* @__PURE__ */ K("<span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button>", 1), Ja = /* @__PURE__ */ K("<span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p> </p><button class=\"text-button\">View connections <span aria-hidden=\"true\">→</span></button>", 1), Ya = /* @__PURE__ */ K("<section><!></section>"), Xa = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), Za = /* @__PURE__ */ K("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), Qa = /* @__PURE__ */ K("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), $a = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), eo = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), to = /* @__PURE__ */ K("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span aria-hidden=\"true\"></span></button> <button><span aria-hidden=\"true\">◇</span>Connections</button> <button><span aria-hidden=\"true\">▦</span>Services</button> <button><span aria-hidden=\"true\">◷</span>Activity</button> <button><span aria-hidden=\"true\">♧</span>Notifications<!></button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <form method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary> <dl><dt>Source</dt><dd><!></dd><dt>Tree</dt><dd> </dd><dt>Channel</dt><dd> </dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-layout-heading\"><p class=\"layout-status\" role=\"status\"> </p><button class=\"button secondary customize-home\">Customize Home</button></div> <div><!></div> <div></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <section aria-label=\"Connections\"><!></section> <section aria-label=\"Activity\"><!></section> <section aria-label=\"Notifications\"><!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function no(e, t) {
	Ue(t, !1);
	let n = () => Ai(u, "$model", r), [r, i] = ji(), a = /* @__PURE__ */ P(), o = /* @__PURE__ */ P(), s = /* @__PURE__ */ P(), c = Z(t, "binding", 8), l = Xi(c()), u = l.model, d = /* @__PURE__ */ P("home"), f = /* @__PURE__ */ P(), p = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", m = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified", h = document.querySelector("meta[name=\"reborn-tree\"]")?.content ?? "unqualified", g = document.querySelector("meta[name=\"reborn-channel\"]")?.content ?? "development";
	function _(e) {
		F(d, e), H(f)?.focus(), e === "activity" && l.activity(), e === "notifications" && l.check();
	}
	Ni(l.start), wn(() => (n(), zi), () => {
		F(a, n().layoutDraft?.panels ?? n().snapshot?.layout.panels ?? zi());
	}), wn(() => n(), () => {
		F(o, new TextEncoder().encode(n().draft).length);
	}), wn(() => (n(), H(o)), () => {
		F(s, n().phase === "ready" && n().dirty && H(o) <= 4096 && !["saving", "checking-conflict"].includes(n().layoutSave) && n().notificationSave !== "saving" && ![
			"saving",
			"checking-conflict",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), Tn(), Si();
	var v = to(), y = R(sn(v), 2), b = I(y), x = R(I(b), 4), S = I(x);
	let C;
	var w = R(S, 2);
	let T;
	var E = R(I(w), 2);
	let ee;
	A(w);
	var te = R(w, 2);
	let ne;
	var re = R(te, 2);
	let ie;
	var ae = R(re, 2);
	let oe;
	var se = R(ae, 2);
	let ce;
	var le = R(I(se), 2), ue = (e) => {
		var t = Wa(), r = L(t, !0);
		z(() => {
			X(t, "aria-label", (n(), U(() => `${n().snapshot.notifications.unread_groups} unread groups`))), J(r, (n(), U(() => n().snapshot.notifications.unread_groups)));
		}), q(e, t);
	};
	Y(le, (e) => {
		n(), U(() => n().snapshot?.notifications.unread_groups) && e(ue);
	}), A(se), A(x);
	var de = R(x, 2), fe = I(de), pe = R(I(fe)), D = I(pe), me = L(D, !0), he = L(R(D), !0);
	A(pe), A(fe);
	var ge = R(fe, 2), _e = R(R(I(ge), 2), 2);
	ui(_e), Se(2), A(ge);
	var ve = R(ge, 2), O = I(ve), ye = I(O, !0);
	Se(), A(O);
	var k = R(O, 2), be = R(I(k)), xe = I(be), Ce = (e) => {
		var t = Ga(), n = L(t, !0);
		z(() => {
			X(t, "href", `https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${m}`), J(n, m);
		}), q(e, t);
	}, we = /* @__PURE__ */ ft(() => U(() => /^[a-f0-9]{40}$/.test(m))), Te = (e) => {
		var t = Ar();
		z(() => J(t, m)), q(e, t);
	};
	Y(xe, (e) => {
		H(we) ? e(Ce) : e(Te, -1);
	}), A(be);
	var Ee = R(be, 2), De = L(Ee, !0), Oe = L(R(Ee, 2), !0);
	Se(2), A(k), A(ve), A(de), A(b);
	var ke = R(b, 2), Ae = I(ke), je = I(Ae), Me = R(I(je)), Ne = L(Me, !0);
	xi(Me, (e) => F(f, e), () => H(f)), A(je);
	var Pe = R(je), Fe = R(I(Pe), 1, !0);
	A(Pe), A(Ae);
	var Ie = R(Ae, 2), Le = L(Ie, !0), Re = R(Ie, 2), ze = (e) => {
		q(e, Ka());
	};
	Y(Re, (e) => {
		n(), U(() => n().phase !== "ready") && e(ze);
	});
	var Be = R(Re, 2), Ve = I(Be), j = I(Ve), He = R(I(j), 3);
	A(j), Se(), A(Ve);
	var Ge = R(Ve, 2), Ke = I(Ge), qe = L(Ke, !0), Je = R(Ke);
	A(Ge);
	var Ye = R(Ge, 2), Xe = I(Ye);
	{
		let e = /* @__PURE__ */ pt(() => (n(), U(() => n().snapshot?.layout))), t = /* @__PURE__ */ pt(() => (n(), U(() => n().phase === "ready")));
		na(Xe, {
			get draft() {
				return n(), U(() => n().layoutDraft);
			},
			get saved() {
				return H(e);
			},
			get state() {
				return n(), U(() => n().layoutSave);
			},
			get authorized() {
				return H(t);
			},
			get move() {
				return U(() => l.moveLayout);
			},
			get toggle() {
				return U(() => l.toggleLayout);
			},
			get save() {
				return U(() => l.saveLayout);
			},
			get cancel() {
				return U(() => l.cancelLayout);
			},
			get reset() {
				return U(() => l.resetLayout);
			},
			get resolve() {
				return U(() => l.resolveLayout);
			},
			get check() {
				return U(() => l.checkLayout);
			}
		});
	}
	A(Ye);
	var Ze = R(Ye, 2);
	let M;
	Wr(Ze, 5, () => H(a), (e) => e.id, (e, t) => {
		var r = Ya();
		let i;
		var a = I(r), o = (e) => {
			var t = qa(), r = R(sn(t), 2), i = L(r, !0), a = R(r);
			z(() => J(i, (n(), U(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are.")))), G("click", a, () => _("note")), q(e, t);
		}, s = (e) => {
			var t = Ja(), r = R(sn(t), 2), i = L(r, !0), a = R(r);
			z(() => J(i, (n(), U(() => n().snapshot?.crafty?.configured ? "Your enrolled Crafty observations are available in Connections." : "Enroll dedicated Crafty access to see your selected servers.")))), G("click", a, () => _("connections")), q(e, t);
		}, c = (e) => {
			{
				let t = /* @__PURE__ */ pt(() => (n(), U(() => n().snapshot?.directory))), r = /* @__PURE__ */ pt(() => (n(), U(() => n().phase === "ready"))), i = /* @__PURE__ */ pt(() => (n(), U(() => n().snapshot?.account.role === "owner"))), a = /* @__PURE__ */ pt(() => H(d) === "home");
				ja(e, {
					get directory() {
						return H(t);
					},
					get authorized() {
						return H(r);
					},
					get owner() {
						return H(i);
					},
					get compact() {
						return H(a);
					},
					get state() {
						return n(), U(() => n().directorySave);
					},
					get message() {
						return n(), U(() => n().directoryMessage);
					},
					browse: () => _("directory"),
					get check() {
						return U(() => l.check);
					},
					get edit() {
						return U(() => l.editService);
					},
					get pin() {
						return U(() => l.pins);
					}
				});
			}
		};
		Y(a, (e) => {
			H(t), U(() => H(t).id === "note") ? e(o) : (H(t), U(() => H(t).id === "connections") ? e(s, 1) : e(c, -1));
		}), A(r), z(() => {
			X(r, "data-home-panel", (H(t), U(() => H(t).id))), X(r, "hidden", (n(), H(t), H(d), U(() => n().phase !== "ready" || (H(t).id === "pins" ? H(d) === "home" && !H(t).visible : H(d) !== "home" || !H(t).visible)))), X(r, "aria-label", (H(t), U(() => H(t).id === "pins" ? "Services" : H(t).id === "note" ? "Workspace note shortcut" : "Connections shortcut"))), i = Qr(r, 1, "", null, i, {
				card: H(t).id !== "pins",
				"small-card": H(t).id !== "pins",
				"pins-panel": H(t).id === "pins"
			});
		}), q(e, r);
	}), A(Ze), A(Be);
	var Qe = R(Be, 2), $e = I(Qe), tt = L(R(I($e)), !0);
	A($e);
	var nt = R($e, 2), rt = (e) => {
		var t = Xa(), n = R(I(t), 2), r = I(n), i = R(r);
		A(n), A(t), G("click", r, function(...e) {
			l.recover?.apply(this, e);
		}), G("click", i, () => l.resolve(!0)), q(e, t);
	};
	Y(nt, (e) => {
		n(), U(() => n().recovery) && e(rt);
	});
	var it = R(nt, 2), at = R(I(it), 2);
	et(at);
	var ot = R(at, 4), st = I(ot);
	let ct;
	var lt = L(st), ut = R(st), dt = L(ut, !0);
	A(ot), A(it);
	var mt = R(it, 2), ht = (e) => {
		q(e, Za());
	};
	Y(mt, (e) => {
		n(), U(() => n().storageLimited) && e(ht);
	});
	var gt = R(mt, 2), _t = (e) => {
		q(e, Qa());
	};
	Y(gt, (e) => {
		H(o) > 4096 && e(_t);
	});
	var vt = R(gt, 2), yt = (e) => {
		var t = $a(), r = R(I(t), 2), i = L(r, !0), a = R(r), o = I(a), s = R(o);
		A(a), A(t), z(() => J(i, (n(), U(() => n().snapshot?.note.body)))), G("click", o, () => l.resolve(!1)), G("click", s, () => l.resolve(!0)), q(e, t);
	};
	Y(vt, (e) => {
		n(), U(() => n().save === "conflict") && e(yt);
	});
	var N = R(vt, 2), bt = (e) => {
		var t = eo(), n = R(I(t), 2);
		A(t), G("click", n, () => l.check()), q(e, t);
	};
	Y(N, (e) => {
		n(), U(() => n().save === "uncertain") && e(bt);
	}), A(Qe);
	var xt = R(Qe, 2), St = I(xt);
	{
		let e = /* @__PURE__ */ pt(() => (n(), U(() => n().snapshot?.crafty))), t = /* @__PURE__ */ pt(() => (n(), U(() => n().snapshot?.account.role === "owner"))), r = /* @__PURE__ */ pt(() => (H(d), n(), U(() => H(d) === "connections" && n().phase === "ready")));
		ma(St, {
			history: () => {
				F(d, "activity"), H(f)?.focus(), l.activity("connections", "");
			},
			get binding() {
				return c();
			},
			get overview() {
				return H(e);
			},
			get owner() {
				return H(t);
			},
			get active() {
				return H(r);
			},
			get refresh() {
				return U(() => l.check);
			}
		});
	}
	A(xt);
	var Ct = R(xt, 2), wt = I(Ct);
	{
		let e = /* @__PURE__ */ pt(() => (n(), U(() => n().phase === "ready")));
		Ra(wt, {
			get state() {
				return n(), U(() => n().activity);
			},
			get authorized() {
				return H(e);
			},
			get load() {
				return U(() => l.activity);
			}
		});
	}
	A(Ct);
	var Tt = R(Ct, 2), Et = I(Tt);
	{
		let e = /* @__PURE__ */ pt(() => (n(), U(() => n().snapshot?.notifications))), t = /* @__PURE__ */ pt(() => (n(), U(() => n().phase === "ready")));
		Ua(Et, {
			get value() {
				return H(e);
			},
			get authorized() {
				return H(t);
			},
			get state() {
				return n(), U(() => n().notificationSave);
			},
			get message() {
				return n(), U(() => n().notificationMessage);
			},
			get check() {
				return U(() => l.check);
			},
			get mark() {
				return U(() => l.markNotification);
			}
		});
	}
	A(Tt), Se(2), A(ke), A(y), z(() => {
		X(S, "aria-current", H(d) === "home" ? "page" : void 0), C = Qr(S, 1, "", null, C, { active: H(d) === "home" }), X(w, "aria-current", H(d) === "note" ? "page" : void 0), T = Qr(w, 1, "", null, T, { active: H(d) === "note" }), ee = Qr(E, 1, "draft-dot", null, ee, { visible: n().dirty }), X(te, "aria-current", H(d) === "connections" ? "page" : void 0), ne = Qr(te, 1, "", null, ne, { active: H(d) === "connections" }), X(re, "aria-current", H(d) === "directory" ? "page" : void 0), ie = Qr(re, 1, "", null, ie, { active: H(d) === "directory" }), X(ae, "aria-current", H(d) === "activity" ? "page" : void 0), oe = Qr(ae, 1, "", null, oe, { active: H(d) === "activity" }), X(se, "aria-current", H(d) === "notifications" ? "page" : void 0), ce = Qr(se, 1, "", null, ce, { active: H(d) === "notifications" }), J(me, (n(), U(() => n().snapshot?.account.username ?? "Your account"))), J(he, (n(), U(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), di(_e, c()), J(ye, p), J(De, h), J(Oe, g), J(Ne, H(d) === "home" ? "Welcome home." : H(d) === "note" ? "A little space to think." : H(d) === "connections" ? "Your servers, at a glance." : H(d) === "directory" ? "Everything within reach." : H(d) === "activity" ? "Pick up the thread." : "Catch up at your pace."), J(Fe, (n(), U(() => n().phase === "ready" ? "Session checked" : n().phase === "checking" ? "Checking access" : "Access paused"))), J(Le, (n(), U(() => n().message))), X(Be, "hidden", (H(d), n(), U(() => H(d) !== "home" && H(d) !== "directory" || n().phase !== "ready"))), X(Be, "aria-label", H(d) === "directory" ? "Service directory view" : "Home"), X(Ve, "hidden", H(d) !== "home"), X(Ge, "hidden", H(d) !== "home"), J(qe, (n(), U(() => n().layoutMessage || "Your panels, in your own order."))), Je.disabled = (n(), U(() => !!n().layoutDraft || n().phase !== "ready" || n().layoutSave === "saving")), X(Ye, "hidden", H(d) !== "home"), M = Qr(Ze, 1, "home-grid", null, M, { "services-view": H(d) === "directory" }), X(Qe, "hidden", (H(d), n(), U(() => H(d) !== "note" || n().phase !== "ready"))), J(tt, (n(), U(() => n().dirty ? "Unsaved changes" : "Up to date"))), di(at, (n(), U(() => n().draft))), at.disabled = (n(), U(() => n().phase !== "ready")), ct = Qr(st, 1, "", null, ct, { "over-limit": H(o) > 4096 }), J(lt, `${H(o) ?? ""} / 4096 bytes`), ut.disabled = !H(s), J(dt, (n(), U(() => n().save === "saving" ? "Saving…" : "Save note"))), X(xt, "hidden", (H(d), n(), U(() => H(d) !== "connections" || n().phase !== "ready"))), X(Ct, "hidden", (H(d), n(), U(() => H(d) !== "activity" || n().phase !== "ready"))), X(Tt, "hidden", (H(d), n(), U(() => H(d) !== "notifications" || n().phase !== "ready")));
	}), G("click", S, () => _("home")), G("click", w, () => _("note")), G("click", te, () => _("connections")), G("click", re, () => _("directory")), G("click", ae, () => _("activity")), G("click", se, () => _("notifications")), xr("submit", ge, () => l.signOut()), G("click", He, () => _("note")), G("click", Je, function(...e) {
		l.beginLayout?.apply(this, e);
	}), xr("submit", it, (e) => {
		e.preventDefault(), l.save();
	}), G("input", at, (e) => l.edit(e.currentTarget.value)), q(e, v), We(), i();
}
Sr(["click", "input"]);
// src/main.ts
var ro = document.getElementById("workspace-root"), io = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, ao = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
if (ro && io && /^[a-f0-9]{64}$/.test(io) && ao === "reborn-workspace-v1") {
	let e = Array.from(ro.childNodes);
	ro.replaceChildren();
	try {
		Fr(no, {
			target: ro,
			props: { binding: io }
		});
	} catch {
		ro.replaceChildren(...e);
	}
}
