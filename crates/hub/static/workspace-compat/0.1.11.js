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
	return be(/* @__PURE__ */ sn(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ sn(k) !== null) throw ge(), pe;
		k = e;
	}
}
function Se(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ sn(n);
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
		var i = /* @__PURE__ */ sn(n);
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
	throw Error("https://svelte.dev/e/lifecycle_legacy_only");
}
function Ie(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Le() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Re() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function ze() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Be() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// ../node_modules/svelte/src/internal/flags/index.js
var Ve = !1;
function He() {
	Ve = !0;
}
// ../node_modules/svelte/src/internal/client/context.js
var j = null;
function Ue(e) {
	j = e;
}
function We(e, t = !1, n) {
	j = {
		p: j,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: V,
		l: Ve && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ge(e) {
	var t = j, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) xn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, j = t.p, Ke(e);
}
function Ke(e = {}) {
	return i(e, re, { value: !0 }), e;
}
function qe() {
	return !Ve || j !== null && j.l === null;
}
// ../node_modules/svelte/src/internal/client/dom/task.js
var Je = [];
function Ye() {
	var e = Je;
	Je = [], p(e);
}
function Xe(e) {
	if (Je.length === 0 && !wt) {
		var t = Je;
		queueMicrotask(() => {
			t === Je && Ye();
		});
	}
	Je.push(e);
}
function Ze() {
	for (; Je.length > 0;) Ye();
}
// ../node_modules/svelte/src/internal/client/reactivity/status.js
var Qe = ~(g | _ | h);
function M(e, t) {
	e.f = e.f & Qe | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? M(e, h) : M(e, _);
}
// ../node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), M(e, h);
}
// ../node_modules/svelte/src/internal/client/dom/elements/misc.js
function tt(e) {
	O && /* @__PURE__ */ on(e) !== null && ln(e);
}
var nt = !1;
function rt() {
	nt || (nt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ue]?.();
		});
	}, { capture: !0 }));
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function it(e) {
	var t = B, n = V;
	Kn(null), qn(null);
	try {
		return e();
	} finally {
		Kn(t), qn(n);
	}
}
function at(e, t, n, r = n) {
	e.addEventListener(t, () => it(n));
	let i = e[ue];
	e[ue] = i ? () => {
		i(), r(!0);
	} : () => r(!0), rt();
}
// ../node_modules/svelte/src/internal/client/reactivity/async.js
function ot(e, t, n, r) {
	let i = qe() ? ut : mt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = st(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				mn(e, s);
			}
			ct();
		}
	}
	var d = lt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ ft(e))).then(u).catch((e) => mn(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), ct());
	}) : f();
}
function st() {
	var e = V, t = B, n = j, r = N;
	return function(i = !0) {
		qn(e), Kn(t), Ue(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ct(e = !0) {
	qn(null), Kn(null), Ue(null), e && N?.deactivate();
}
function lt() {
	var e = V, t = e.b, n = N, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ut(e) {
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
var dt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ft(e, t, n) {
	let r = V;
	r === null && ke();
	var i = void 0, a = Vt(D), o = !B, s = /* @__PURE__ */ new Set();
	return Dn(() => {
		var t = V, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== de && n.reject(e);
			}).finally(ct);
		} catch (e) {
			n.reject(e), ct();
		}
		var c = N;
		if (o) {
			if (t.f & 32768) var l = lt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(dt);
			else for (let e of s.values()) e.reject(dt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== dt && (c.activate(), t ? (a.f |= te, Gt(a, t)) : (a.f & 8388608 && (a.f ^= te), Gt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), yn(() => {
		for (let e of s) e.reject(dt);
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
function pt(e) {
	let t = /* @__PURE__ */ ut(e);
	return Yn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function mt(e) {
	let t = /* @__PURE__ */ ut(e);
	return t.equals = De, t;
}
function ht(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Pn(t[n]);
	}
}
function gt(e) {
	var t, n = V, r = e.parent;
	if (!Un && r !== null && e.v !== D && r.f & 24576) return he(), e.v;
	qn(r);
	try {
		ht(e), t = sr(e);
	} finally {
		qn(n);
	}
	return t;
}
function _t(e) {
	var t = gt(e);
	!e.equals(t) && (e.wv = ir(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), xt?.capture(e, t, !0)), e.deps === null)) ? M(e, h) : Un || (St === null ? $e(e) : (vn() || N?.is_fork) && St.set(e, t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && it(() => {
		t.ac.abort(de), t.ac = null;
	}), t.fn !== null && (t.teardown = d), ur(t, 0), Mn(t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && dr(t);
}
// ../node_modules/svelte/src/internal/client/reactivity/batch.js
var bt = null, N = null, xt = null, St = null, Ct = null, wt = !1, Tt = !1, Et = null, Dt = null, Ot = 0, kt = 1, At = class e {
	id = kt++;
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
		bt === null ? bt = this : (bt.#n = this, this.#t = bt), bt = this;
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
		for (var t = Et = [], n = [], r = Dt = []; this.#c.length > 0;) {
			Ot++ > 1e3 && (this.#S(), Mt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Lt(e), this.#h() || this.discard(), t;
			}
		}
		if (N = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Et = null, Dt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) It(e, t);
			r.length > 0 && N.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), xt = this, Pt(n), Pt(t), xt = null, this.#s?.resolve();
			var o = N;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (zt.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : ar(r) && (i & 16 && this.#d.add(r), dr(r));
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
		for (var t = 0; t < e.length; t += 1) et(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== D && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), St?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		N = this;
	}
	deactivate() {
		N = null, St = null;
	}
	flush() {
		try {
			Tt = !0, N = this, this.#_();
		} finally {
			Ot = 0, Ct = null, Et = null, Dt = null, Tt = !1, N = null, St = null, zt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(dt);
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
		this.#m || (this.#m = !0, Xe(() => {
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
			!Tt && !wt && Xe(() => {
				t.#e || t.flush();
			});
		}
		return N;
	}
	apply() {
		St = null;
	}
	schedule(e) {
		Ct = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? bt = e : t.#t = e, this.linked = !1;
		}
	}
};
function jt(e) {
	var t = wt, n = xt;
	xt = null, wt = !0;
	try {
		var r;
		for (e && (jt(), r = e());;) {
			if (Ze(), N === null) return r;
			N.flush();
		}
	} finally {
		wt = t, xt = n;
	}
}
function Mt() {
	try {
		Pe();
	} catch (e) {
		mn(e, Ct);
	}
}
var Nt = null;
function Pt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && ar(r) && (Nt = /* @__PURE__ */ new Set(), dr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && In(r), Nt?.size > 0)) {
				zt.clear();
				for (let e of Nt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Nt.has(n) && (Nt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || dr(n);
					}
				}
				Nt.clear();
			}
		}
		Nt = null;
	}
}
function Ft(e) {
	N.schedule(e);
}
function It(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), M(e, h);
		for (var n = e.first; n !== null;) It(n, t), n = n.next;
	}
}
function Lt(e) {
	M(e, h);
	for (var t = e.first; t !== null;) Lt(t), t = t.next;
}
// ../node_modules/svelte/src/internal/client/reactivity/sources.js
var Rt = /* @__PURE__ */ new Set(), zt = /* @__PURE__ */ new Map(), Bt = !1;
function Vt(e, t) {
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
function Ht(e, t) {
	let n = Vt(e, t);
	return Yn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t = !1, n = !0) {
	let r = Vt(e);
	return t || (r.equals = De), Ve && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function F(e, t, n = !1) {
	return B !== null && (!Gn || B.f & 131072) && qe() && B.f & 4325394 && (Jn === null || !Jn.has(e)) && ze(), Gt(e, n ? Xt(t) : t, Dt);
}
var Ut = null, Wt = 0;
function Gt(e, t, n = null) {
	if (!e.equals(t)) {
		Un ? zt.set(e, t) : zt.has(e) || zt.set(e, e.v);
		var r = At.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && gt(t), St === null && $e(t);
		}
		e.wv = ir(), Ut = null, Wt = 0, Yt(e, g, n), Ut = null, qe() && V !== null && V.f & 1024 && !(V.f & 96) && (Qn === null ? $n([e]) : Qn.push(e)), !r.is_fork && Rt.size > 0 && !Bt && Kt();
	}
	return t;
}
function Kt() {
	Bt = !1;
	for (let e of Rt) {
		e.f & 1024 && M(e, _);
		let t;
		try {
			t = ar(e);
		} catch {
			t = !0;
		}
		t && dr(e);
	}
	Rt.clear();
}
function qt(e, t = 1) {
	var n = H(e);
	return F(e, t === 1 ? ++n : --n);
}
function Jt(e) {
	F(e, e.v + 1);
}
function Yt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = qe(), a = r.length;
		if (Wt += a, Wt > 1e5 && Ut === null && (Ut = /* @__PURE__ */ new Set()), Ut !== null) {
			if (Ut.has(e)) return;
			Ut.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== V) {
				var l = (c & g) === 0;
				if (l && M(s, t), c & 131072) Rt.add(s);
				else if (c & 2) {
					var u = s;
					St?.delete(u), Yt(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && Nt !== null && Nt.add(d), n === null ? Ft(d) : n.push(d);
				}
			}
		}
	}
}
function Xt(t) {
	if (typeof t != "object" || !t || ne in t || re in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Ht(0), u = null, d = nr, f = (e) => {
		if (nr === d) return e();
		var t = B, n = nr;
		Kn(null), rr(d);
		var r = e();
		return Kn(t), rr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Ht(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Le();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Ht(n.value, u);
				return r.set(t, e), e;
			}) : F(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Ht(D, u));
					r.set(t, e), Jt(o);
				}
			} else F(n, D), Jt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === ne) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Ht(Xt(s ? e[n] : D), u)), r.set(n, o)), o !== void 0) {
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
			return (n !== void 0 || V !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Ht(i ? Xt(e[t]) : D, u)), r.set(t, n)), H(n) === D) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Ht(D, u)), r.set(d + "", p)) : F(p, D);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Ht(void 0, u)), F(c, Xt(n)), r.set(t, c));
			else {
				l = c.v !== D;
				var m = f(() => Xt(n));
				F(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && F(g, _ + 1);
				}
				Jt(o);
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
			Re();
		}
	});
}
function Zt(e) {
	try {
		if (typeof e == "object" && e && ne in e) return e[ne];
	} catch {}
	return e;
}
function Qt(e, t) {
	return Object.is(Zt(e), Zt(t));
}
var $t, en, tn, nn;
function rn() {
	if ($t === void 0) {
		$t = window, en = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		tn = a(t, "firstChild").get, nn = a(t, "nextSibling").get, u(e) && (e[se] = void 0, e[oe] = null, e[ce] = void 0, e.__e = void 0), u(n) && (n[le] = void 0);
	}
}
function an(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function on(e) {
	return tn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function sn(e) {
	return nn.call(e);
}
function I(e, t) {
	if (!O) return /* @__PURE__ */ on(e);
	var n = /* @__PURE__ */ on(k);
	if (n === null) n = k.appendChild(an());
	else if (t && n.nodeType !== 3) {
		var r = an();
		return n?.before(r), be(r), r;
	}
	return t && fn(n), be(n), n;
}
function cn(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ on(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ sn(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = an();
			return k?.before(r), be(r), r;
		}
		fn(k);
	}
	return k;
}
function L(e, t = !1) {
	if (!O) return /* @__PURE__ */ on(e);
	var n = I(e, t);
	return A(e), n;
}
function R(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ sn(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = an();
			return r === null ? i?.after(a) : r.before(a), be(a), a;
		}
		fn(r);
	}
	return be(r), r;
}
function ln(e) {
	e.textContent = "";
}
function un() {
	return !1;
}
function dn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function fn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function pn(e) {
	var t = V;
	if (t === null) return B.f |= te, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	mn(e, t);
}
function mn(e, t) {
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
function hn(e) {
	V === null && (B === null && Ne(e), Me()), Un && je(e);
}
function gn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function _n(e, t) {
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
	if (e & 4) Et === null ? At.ensure().schedule(r) : Et.push(r);
	else if (t !== null) {
		try {
			dr(r);
		} catch (e) {
			throw Pn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && gn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function vn() {
	return B !== null && !Gn;
}
function yn(e) {
	let t = _n(8, null);
	return M(t, h), t.teardown = e, t;
}
function bn(e) {
	hn("$effect");
	var t = V.f;
	if (!B && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return xn(e);
}
function xn(e) {
	return _n(4 | w, e);
}
function Sn(e) {
	return hn("$effect.pre"), _n(8 | w, e);
}
function Cn(e) {
	At.ensure();
	let t = _n(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Ln(t, () => {
			Pn(t), n(void 0);
		}) : (Pn(t), n(void 0));
	});
}
function wn(e) {
	return _n(4, e);
}
function Tn(e, t) {
	var n = j, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = On(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				qn(n.parent), U(t);
			} finally {
				qn(n);
			}
		}
	});
}
function En() {
	var e = j;
	On(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && M(n, _), ar(n) && dr(n), t.ran = !1;
		}
	});
}
function Dn(e) {
	return _n(ee | C, e);
}
function On(e, t = 0) {
	return _n(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	ot(r, t, n, (t) => {
		_n(8, () => {
			e(...t.map(H));
		});
	});
}
function kn(e, t = 0) {
	return _n(16 | t, e);
}
function An(e) {
	return _n(32 | C, e);
}
function jn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Un, r = B;
		Wn(!0), Kn(null);
		try {
			t.call(null);
		} catch (t) {
			mn(t, e.parent);
		} finally {
			Wn(n), Kn(r);
		}
	}
}
function Mn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && it(() => {
			e.abort(de);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Pn(n, t), n = r;
	}
}
function Nn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Pn(t), t = n;
	}
}
function Pn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Fn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Mn(e, t && !n), ur(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	jn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && In(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Fn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ sn(e);
		e.remove(), e = n;
	}
}
function In(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ln(e, t, n = !0) {
	var r = [];
	e.f |= 256, Rn(e, r, !0);
	var i = () => {
		n && Pn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Rn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Rn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function zn(e) {
	e.f &= -257, Bn(e, !0);
}
function Bn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (M(e, g), At.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Bn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Vn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ sn(n);
		t.append(n), n = i;
	}
}
// ../node_modules/svelte/src/internal/client/legacy.js
var Hn = null, Un = !1;
function Wn(e) {
	Un = e;
}
var B = null, Gn = !1;
function Kn(e) {
	B = e;
}
var V = null;
function qn(e) {
	V = e;
}
var Jn = null;
function Yn(e) {
	B !== null && (B.f & 2097152 || B.f & 2) && (Jn ??= /* @__PURE__ */ new Set()).add(e);
}
var Xn = null, Zn = 0, Qn = null;
function $n(e) {
	Qn = e;
}
var er = 1, tr = 0, nr = tr;
function rr(e) {
	nr = e;
}
function ir() {
	return ++er;
}
function ar(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (ar(a) && _t(a), a.wv > e.wv) return !0;
		}
		t & 512 && St === null && M(e, h);
	}
	return !1;
}
function or(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Jn !== null && Jn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? or(a, t, !1) : t === a && (n ? M(a, g) : a.f & 1024 && M(a, _), Ft(a));
	}
}
function sr(e) {
	var t = Xn, n = Zn, r = Qn, i = B, a = Jn, o = j, s = Gn, c = nr, l = e.f;
	Xn = null, Zn = 0, Qn = null, B = l & 96 ? null : e, Jn = null, Ue(e.ctx), Gn = !1, nr = ++tr, e.ac !== null && (it(() => {
		e.ac.abort(de);
	}), e.ac = null);
	try {
		e.f |= E;
		var u = e.fn, d = u();
		e.f |= b;
		var f = cr(e);
		if (qe() && Qn !== null && !Gn && f !== null && !(e.f & 6146)) for (var p = 0; p < Qn.length; p++) or(Qn[p], e);
		if (i !== null && i !== e) {
			if (tr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = tr;
			if (t !== null) for (let e of t) e.rv = tr;
			Qn !== null && (r === null ? r = Qn : r.push(...Qn));
		}
		return e.f & 8388608 && (e.f ^= te), d;
	} catch (t) {
		return cr(e), pn(t);
	} finally {
		e.f ^= E, Xn = t, Zn = n, Qn = r, B = i, Jn = a, Ue(o), Gn = s, nr = c;
	}
}
function cr(e) {
	var t = e.deps, n = N?.is_fork;
	if (Xn !== null) {
		var r;
		if (n || ur(e, Zn), t !== null && Zn > 0) for (t.length = Zn + Xn.length, r = 0; r < Xn.length; r++) t[Zn + r] = Xn[r];
		else e.deps = t = Xn;
		if (vn() && e.f & 512) for (r = Zn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Zn < t.length && (ur(e, Zn), t.length = Zn);
	return t;
}
function lr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Xn === null || !n.call(Xn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== D && $e(s), s.ac !== null && it(() => {
			s.ac.abort(de), s.ac = null, M(s, g);
		}), vt(s), ur(s, 0);
	}
}
function ur(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) lr(e, n[r]);
}
function dr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		M(e, h);
		var n = V;
		V = e;
		try {
			t & 16777232 ? Nn(e) : Mn(e), jn(e);
			var r = sr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = er;
		} finally {
			V = n;
		}
	}
}
async function fr() {
	await Promise.resolve(), jt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (Hn?.add(e), B !== null && !Gn && !(V !== null && V.f & 16384) && (Jn === null || !Jn.has(e))) {
		var r = B.deps;
		if (B.f & 2097152) e.rv < tr && (e.rv = tr, Xn === null && r !== null && r[Zn] === e ? Zn++ : Xn === null ? Xn = [e] : Xn.push(e));
		else {
			B.deps ??= [], n.call(B.deps, e) || B.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [B] : n.call(i, B) || i.push(B);
		}
	}
	if (Un && zt.has(e)) return zt.get(e);
	if (t) {
		var a = e;
		if (Un) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || mr(a)) && (o = gt(a)), zt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Gn && B !== null && !!(B.f & 512), c = (a.f & b) === 0;
		ar(a) && (s && (a.f |= 512), _t(a)), s && !c && (yt(a), pr(a));
	}
	if (St?.has(e)) return St.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function pr(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (yt(r), pr(r));
	}
}
function mr(e) {
	if (e.v === D) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (zt.has(t) || t.f & 2 && mr(t)) return !0;
	return !1;
}
function U(e) {
	var t = Gn;
	try {
		return Gn = !0, e();
	} finally {
		Gn = t;
	}
}
function W(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ne in e) hr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ne in n && hr(n);
		}
	}
}
function hr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			hr(e[n], t);
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
var gr = ["touchstart", "touchmove"];
function _r(e) {
	return gr.includes(e);
}
// ../node_modules/svelte/src/internal/client/dom/elements/events.js
var vr = Symbol("events"), yr = /* @__PURE__ */ new Set(), br = /* @__PURE__ */ new Set();
function xr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Er.call(t, e), !e.cancelBubble) return it(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Xe(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Sr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = xr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && yn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[vr] ??= {})[e] = n;
}
function Cr(e) {
	for (var t = 0; t < e.length; t++) yr.add(e[t]);
	for (var n of br) n(e);
}
var wr = null, Tr = !1;
function Er(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	wr = e, Tr || (Tr = !0, setTimeout(() => {
		Tr = !1, wr = null;
	}));
	var s = 0, c = wr === e && e[vr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[vr] = t;
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
		Kn(null), qn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[vr]?.[r];
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
			e[vr] = t, delete e.currentTarget, Kn(d), qn(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var Dr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Or(e) {
	return Dr?.createHTML(e) ?? e;
}
function kr(e) {
	var t = dn("template");
	return t.innerHTML = Or(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function Ar(e, t) {
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
		if (O) return Ar(k, null), k;
		i === void 0 && (i = kr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ on(i)));
		var t = r || en ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ on(t), s = t.lastChild;
			Ar(o, s);
		} else Ar(t, t);
		return t;
	};
}
function jr(e = "") {
	if (!O) {
		var t = an(e + "");
		return Ar(t, t), t;
	}
	var n = k;
	return n.nodeType === 3 ? fn(n) : (n.before(n = an()), be(n)), Ar(n, n), n;
}
function q(e, t) {
	if (O) {
		var n = V;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = k), xe();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function Mr(e) {
	let t = 0, n = Vt(0), r;
	return () => {
		vn() && (H(n), On(() => (t === 0 && (r = U(() => e(() => Jt(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, Jt(n));
			});
		})));
	};
}
// ../node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Nr = S | C;
function Pr(e, t, n, r) {
	new Fr(e, t, n, r);
}
var Fr = class {
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
	#h = Mr(() => (this.#m = Vt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = kn(() => {
			if (O) {
				let e = we(this.#t);
				xe();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Nr), O && (this.#e = k);
	}
	#g() {
		try {
			this.#a = An(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Xe(r), t && (this.#s = An(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? ve() : (t = !0, n && Be(), this.#s !== null && Ln(this.#s, () => {
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
					mn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (y | x)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = An(() => e(this.#e)), Xe(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = an(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return An(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							mn(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(N)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Ln(this.#o, () => {
					this.#o = null;
				}), this.#S(N));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = An(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Vn(this.#a, e);
				let t = this.#n.pending;
				this.#o = An(() => t(this.#e));
			} else this.#S(N);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		et(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = V, n = B, r = j;
		qn(this.#i), Kn(this.#i), Ue(this.#i.ctx);
		try {
			return At.ensure(), e();
		} finally {
			qn(t), Kn(n), Ue(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Ln(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Xe(() => {
			this.#d = !1, this.#m && Gt(this.#m, this.#l);
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
		this.#a &&= (Pn(this.#a), null), this.#o &&= (Pn(this.#o), null), this.#s &&= (Pn(this.#s), null), O && (be(this.#t), Se(), be(Ce()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return An(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return mn(e, this.#i.parent), null;
				}
			}));
		};
		Xe(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					mn(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => mn(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function J(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[le] ??= e.nodeValue) && (e[le] = n, e.nodeValue = `${n}`);
}
function Ir(e, t) {
	return Rr(e, t);
}
var Lr = /* @__PURE__ */ new Map();
function Rr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	rn();
	var l = void 0, u = Cn(() => {
		var s = n ?? t.appendChild(an());
		Pr(s, { pending: () => {} }, (t) => {
			We({});
			var n = j;
			if (o && (n.c = o), a && (i.$$events = a), O && Ar(t, null), l = e(t, i) || Ke(), O && (V.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw ge(), pe;
			Ge();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = _r(r);
					for (let e of [t, document]) {
						var a = Lr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Lr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Er, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(yr)), br.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Lr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Er), r.delete(e), r.size === 0 && Lr.delete(n)) : r.set(e, i);
			}
			br.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return zr.set(l, u), l;
}
var zr = /* @__PURE__ */ new WeakMap(), Br = class {
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
			if (n) zn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (zn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Pn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Vn(r, t), t.append(an()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Pn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Ln(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Pn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = N, r = un();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = an();
				i.append(a), this.#n.set(e, {
					effect: An(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, An(() => t(this.anchor)));
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
	var i = new Br(e), a = n ? S : 0;
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
	kn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// ../node_modules/svelte/src/internal/client/dom/blocks/each.js
function Vr(e, t) {
	return t;
}
function Hr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Ln(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Ur(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			ln(d), d.append(u), e.items.clear();
		}
		Ur(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Ur(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, Vn(a, document.createDocumentFragment())) : Pn(t[i], n);
	}
}
var Wr;
function Gr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = O ? be(/* @__PURE__ */ on(u)) : u.appendChild(an());
	}
	O && xe();
	var d = null, f = /* @__PURE__ */ mt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = H(f);
			_.fallback = d, qr(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= T, Yr(d, null, c)) : zn(d) : Ln(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: kn(() => {
			var e = H(f), t = e.length;
			let r = !1;
			O && we(c) === "[!" != (t === 0) && (c = Ce(), be(c), ye(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = N, v = un(), y = 0; y < t; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (c = k, r = !0, ye(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && Gt(S.v, b), S.i && Gt(S.i, y), v && _.unskip_effect(S.e)) : (S = Jr(l, m ? c : Wr ??= an(), b, x, y, o, n, i), m || (S.e.f |= T), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = An(() => s(c)) : (d = An(() => s(Wr ??= an())), d.f |= T)), t > u.size && Ae("", "", ""), O && t > 0 && be(Ce()), !m) {
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
function Kr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function qr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Kr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (zn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= T, _ === l) Yr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Xr(e, d, _), Xr(e, _, y), Yr(_, y, n), d = _, p = [], m = [], l = Kr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Yr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Xr(e, S.prev, C.next), Xr(e, d, S), Xr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Yr(_, l, n), Xr(e, _.prev, _.next), Xr(e, _, d === null ? e.effect.first : d.next), Xr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Kr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Kr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Ur(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Kr(l.next);
		var E = w.length;
		if (E > 0) {
			var ee = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.fix();
			}
			Hr(e, w, ee);
		}
	}
	o && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Jr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Vt(n) : /* @__PURE__ */ P(n, !1, !1) : null, l = o & 2 ? Vt(i) : null;
	return {
		v: c,
		i: l,
		e: An(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Yr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ sn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Xr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// ../node_modules/svelte/src/internal/shared/attributes.js
var Zr = [..." 	\n\r\f\xA0\v﻿"];
function Qr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Zr.includes(r[o - 1])) && (s === r.length || Zr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// ../node_modules/svelte/src/internal/client/dom/elements/class.js
function $r(e, t, n, r, i, a) {
	var o = e[se];
	if (O || o !== n || o === void 0) {
		var s = Qr(n, r, a);
		O && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[se] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ei(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ti(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = ai(c);
			ei(c, i ? a.includes(l) : Qt(l, r));
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
function ni(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return _e();
		for (var i of t.options) i.selected = n.includes(ai(i));
	} else {
		for (i of t.options) if (Qt(ai(i), n)) {
			i.selected = !0;
			return;
		}
		r && n === void 0 || (t.selectedIndex = -1);
	}
}
function ri(e) {
	var t = new MutationObserver((t) => {
		t.every(oi) || ("__defaultValue" in e && ti(e, !1), "__value" in e && ni(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), yn(() => {
		t.disconnect();
	});
}
function ii(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	at(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ai);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ai(o);
		}
		n(a), e.__value = a, N !== null && r.add(N);
	}), wn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = N;
			if (r.has(o)) return;
		}
		if (ni(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ai(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function ai(e) {
	return "__value" in e ? e.__value : e.value;
}
function oi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// ../node_modules/svelte/src/internal/client/dom/elements/attributes.js
var si = Symbol("is custom element"), ci = Symbol("is html"), li = fe ? "link" : "LINK", ui = fe ? "progress" : "PROGRESS";
function di(e) {
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
		e[ue] = n, Xe(n), rt();
	}
}
function fi(e, t) {
	var n = mi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ui) && (e.value = t ?? "");
}
function pi(e, t) {
	var n = mi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function X(e, t, n, r) {
	var i = mi(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === li) || i[t] !== (i[t] = n) && (t === "loading" && (e[ae] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && gi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function mi(e) {
	return e[oe] ??= {
		[si]: e.nodeName.includes("-"),
		[ci]: e.namespaceURI === me
	};
}
var hi = /* @__PURE__ */ new Map();
function gi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = hi.get(t);
	if (n) return n;
	hi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function _i(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	at(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = yi(e) ? bi(a) : a, n(a), N !== null && r.add(N), await fr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (O && e.defaultValue !== e.value || U(t) == null && e.value) && (n(yi(e) ? bi(e.value) : e.value), N !== null && r.add(N)), On(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = N;
			if (r.has(i)) return;
		}
		yi(e) && n === bi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function vi(e, t, n = t) {
	at(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (O && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), On(() => {
		e.checked = !!t();
	});
}
function yi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function bi(e) {
	return e === "" ? null : +e;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function xi(e, t) {
	return e === t || e?.[ne] === t;
}
function Si(e = Ke(), t, n, r) {
	var i = j.r, a = V;
	return wn(() => {
		var o, s;
		return On(() => {
			o = s, s = r?.() || [], U(() => {
				xi(n(...s), e) || (t(e, ...s), o && xi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && xi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Ci(e = !1) {
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => W(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ ut(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => H(i);
	}
	n.b.length && Sn(() => {
		wi(t, r), p(n.b);
	}), bn(() => {
		let e = U(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && bn(() => {
		wi(t, r), p(n.a);
	});
}
function wi(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function Ti(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = U(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var Ei = [];
function Di(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ee(e, t) && (e = t, n)) {
			let t = !Ei.length;
			for (let t of r) t[1](), Ei.push(t, e);
			if (t) {
				for (let e = 0; e < Ei.length; e += 2) Ei[e][0](Ei[e + 1]);
				Ei.length = 0;
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
function Oi(e) {
	let t;
	return Ti(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var ki = !1, Ai = Symbol("unmounted");
function ji(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ P(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(Ai in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = Ti(e, (e) => {
				i ? r.source.v = e : F(r.source, e);
			}), i = !1;
		}
	}
	return e && Ai in n ? Oi(e) : H(r.source);
}
function Mi() {
	let e = {};
	function t() {
		yn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Ai, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Ni(e) {
	var t = ki;
	try {
		return ki = !1, [e(), ki];
	} finally {
		ki = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function Z(e, t, n, r) {
	var i = !Ve || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ ut(r), H(u)) : (l && (l = !1, c = s ? U(r) : r), c);
	let f;
	if (o) {
		var p = ne in e || ie in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Ni(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ie(t), f(m)));
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
	var v = !1, y = (n & 1 ? ut : mt)(() => (v = !1, g()));
	o && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && o ? Xt(e) : e;
			return F(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Un && v || b.f & 16384 ? y.v : H(y);
	});
}
function Pi(e) {
	j === null && Oe("onMount"), Ve && j.l !== null ? Ri(j).m.push(e) : bn(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function Fi(e) {
	j === null && Oe("onDestroy"), Pi(() => () => U(e));
}
function Ii(e) {
	j === null && Oe("beforeUpdate"), j.l === null && Fe("beforeUpdate"), Ri(j).b.push(e);
}
function Li(e) {
	j === null && Oe("afterUpdate"), j.l === null && Fe("afterUpdate"), Ri(j).a.push(e);
}
function Ri(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
// ../node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), He();
// src/controller.ts
var zi = "keida-hub-reborn", Bi = "reborn-workspace-v1", Vi = 9223372036854775807n, Hi = () => [
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
], Ui = (e) => e === "note" ? "Workspace note" : e === "connections" ? "Connections" : "Pinned services", Wi = () => ({
	phase: "idle",
	entries: [],
	through: "0",
	next: null,
	category: "all",
	query: "",
	message: ""
}), Gi = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1,
	directorySave: "idle",
	directoryMessage: "",
	activity: Wi(),
	notificationSave: "idle",
	notificationMessage: "",
	layoutSave: "idle",
	layoutMessage: ""
}), Q = (e) => typeof e == "object" && !!e && !Array.isArray(e), $ = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= Vi && (!t || e !== "0"), Ki = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096;
function qi(e) {
	if (typeof e != "string" || new TextEncoder().encode(e).length > 1024 || !/^https:\/\/[^/]/.test(e) || /[\s\u0000-\u001f\u007f\\]/u.test(e)) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "https:" && !!t.hostname && !t.username && !t.password && !e.includes("?") && !e.includes("#");
	} catch {
		return !1;
	}
}
function Ji(e) {
	if (!Q(e) || !Array.isArray(e.groups) || e.groups.length > 2 || !Number.isInteger(e.unread_groups) || new Set(e.groups.map((e) => Q(e) ? e.category : null)).size !== e.groups.length || e.groups.some((e) => !Q(e) || !["services", "connections"].includes(String(e.category)) || !$(e.revision, !0) || !$(e.read_through) || !$(e.unread) || BigInt(e.read_through) > BigInt(e.revision) || BigInt(e.unread) !== BigInt(e.revision) - BigInt(e.read_through) || !Q(e.latest) || !$(e.latest.source_revision, !0) || !$(e.latest.occurred_at) || BigInt(e.latest.occurred_at) > 253402300799n || typeof e.latest.label != "string" || !/^[A-Za-z ]{1,64}$/.test(e.latest.label) || !(e.category === "services" ? [
		"service_added",
		"service_updated",
		"service_removed"
	] : ["connection_saved", "connection_removed"]).includes(String(e.latest.kind))) || e.unread_groups !== e.groups.filter((e) => e.unread !== "0").length) throw Error("Invalid notification response");
	return e;
}
function Yi(e) {
	if (!Q(e) || !$(e.revision) || !Array.isArray(e.panels) || e.panels.length !== 3 || e.panels.some((e) => !Q(e) || ![
		"note",
		"connections",
		"pins"
	].includes(String(e.id)) || typeof e.visible != "boolean") || new Set(e.panels.map((e) => e.id)).size !== 3 || !e.panels.some((e) => e.visible)) throw Error("Invalid layout response");
	return e;
}
var Xi = (e, t) => e.length === t.length && e.every((e, n) => e.id === t[n].id && e.visible === t[n].visible);
function Zi(e) {
	if (!Q(e) || e.product !== zi || e.contract !== Bi || e.schema !== 1 || !Q(e.account) || !$(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !$(e.session_generation) || !Q(e.note) || !Ki(e.note.body) || !$(e.note.revision)) throw Error("Invalid workspace response");
	let t = e.directory, n = (e, t, n = !1) => typeof e == "string" && (!n || e.length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e);
	if (!Q(t) || !$(t.revision) || !$(t.pins_revision) || !Array.isArray(t.services) || t.services.length > 100 || t.services.some((e) => !Q(e) || !$(e.id, !0) || !n(e.name, 80, !0) || !n(e.category, 40, !0) || !n(e.description, 240) || !qi(e.url)) || new Set(t.services.map((e) => e.id)).size !== t.services.length || !Array.isArray(t.pins) || t.pins.length > 24 || new Set(t.pins).size !== t.pins.length || t.pins.some((e) => !$(e, !0) || !t.services.some((t) => t.id === e))) throw Error("Invalid directory response");
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
	return Ji(e.notifications), Yi(e.layout), e;
}
function Qi(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (Q(t) && t.schema === 1 && Ki(t.body) && $(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
function $i(e) {
	let t = Di(Gi("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l, u = 0, d, f, p, m = !1, h = !1, g = () => Oi(t), _ = (e) => `${zi}.workspace.v1:${e.account.id}:${e.session_generation}`;
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
		b(), h ||= n, jt(() => t.set(Gi(n ? "blocked" : "paused", e)));
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
					"X-Reborn-Product": zi,
					"X-Reborn-Contract": Bi,
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
			let a = Zi(i.value);
			if (!T(a)) {
				x("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let o = g();
			if (d = _(a), o.phase === "ready") {
				let n = o.dirty && a.note.revision !== o.base, r = !!o.layoutDraft && Xi(o.layoutDraft.panels, a.layout.panels) && e && ["uncertain", "checking-conflict"].includes(o.layoutSave), i = !!o.layoutDraft && !r && o.layoutDraft.base !== a.layout.revision;
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
					e ??= Qi(sessionStorage.getItem(d));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (v(), e = void 0), t.set({
					...Gi("ready", "Workspace checked."),
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
			}), Ki(e)) y();
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
		if (e.phase !== "ready" || !e.dirty || !Ki(e.draft) || [
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
				let n = Zi(e.value);
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
				let e = Zi(i.value);
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
			if (i.product !== zi || i.contract !== Bi || i.schema !== 1 || !Q(i.account) || i.account.id !== u.snapshot.account.id || i.account.username !== u.snapshot.account.username || i.account.role !== u.snapshot.account.role || i.session_generation !== u.snapshot.session_generation) {
				x("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let a = Ji(i.notifications), o = a.groups.find((t) => t.category === e);
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
		le(Hi());
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
		if (!s.panels.some((e) => e.visible) || Xi(s.panels, e.snapshot.layout.panels)) return;
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
				if (n.product !== zi || n.contract !== Bi || n.schema !== 1 || !Q(n.account) || n.account.id !== e.snapshot.account.id || n.account.username !== e.snapshot.account.username || n.account.role !== e.snapshot.account.role || n.session_generation !== e.snapshot.session_generation) {
					x("Your account scope changed. Open a fresh workspace.", !0);
					return;
				}
				let i = Yi(n.layout);
				if (BigInt(i.revision) !== BigInt(s.base) + 1n || !Xi(i.panels, s.panels)) throw Error("Unqualified layout result");
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
				...Wi(),
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
			if (s.status !== 200 || !Q(p) || p.product !== zi || p.contract !== Bi || p.schema !== 1 || !Q(p.account) || p.account.id !== a.snapshot.account.id || p.account.role !== a.snapshot.account.role || p.account.username !== a.snapshot.account.username || p.session_generation !== a.snapshot.session_generation) {
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
					...Wi(),
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
			m = !0, b(), p?.close(), t.set(Gi("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
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
var ea = /* @__PURE__ */ K("<li tabindex=\"-1\"><label><input type=\"checkbox\"/><span> </span></label> <div class=\"layout-move\"><button class=\"button secondary layout-up\">↑<span class=\"sr-only\">Move up</span></button><button class=\"button secondary layout-down\">↓<span class=\"sr-only\">Move down</span></button></div></li>"), ta = /* @__PURE__ */ K("<li> </li>"), na = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Layout conflict\"><h3>There’s a newer saved layout</h3><p>Your arrangement is still shown. Compare it with the saved order below before choosing what to keep.</p><ol></ol><div class=\"button-row\"><button class=\"button secondary\">Keep my layout against saved layout</button><button class=\"text-button layout-use-saved\">Use saved layout</button></div></section>"), ra = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain layout\"><h3>Check before saving again</h3><p>The layout may have saved. Your arrangement has not been sent again.</p><button class=\"button secondary check-layout check-saved-layout\">Check saved layout</button></section>"), ia = /* @__PURE__ */ K("<section class=\"layout-editor card\" aria-label=\"Home layout\"><h2>Make Home yours</h2><p>Choose the panels you see and their order. Keep at least one visible. Your other views and open forms stay available.</p> <ol class=\"layout-list\"></ol> <!> <!> <div class=\"button-row\"><button class=\"button primary save-layout\"> </button><button class=\"text-button cancel-layout\">Cancel layout</button><button class=\"text-button reset-layout\">Reset layout</button></div> <p class=\"field-help\">Reset previews the default order and visibility. Save layout applies it to this account.</p></section>");
function aa(e, t) {
	We(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = Z(t, "draft", 8), o = Z(t, "saved", 8), s = Z(t, "state", 8), c = Z(t, "authorized", 8), l = Z(t, "move", 8), u = Z(t, "toggle", 8), d = Z(t, "save", 8), f = Z(t, "cancel", 8), p = Z(t, "reset", 8), m = Z(t, "resolve", 8), h = Z(t, "check", 8);
	async function g(e, t) {
		l()(e, t), await fr(), document.querySelector(`[data-layout-row="${e}"]`)?.focus();
	}
	Tn(() => (W(c()), W(s())), () => {
		F(n, !c() || [
			"saving",
			"checking-conflict",
			"uncertain"
		].includes(s()));
	}), Tn(() => W(a()), () => {
		F(r, a()?.panels.filter((e) => e.visible).length ?? 0);
	}), Tn(() => (W(a()), W(o())), () => {
		F(i, !!a() && !!o() && a().panels.some((e, t) => e.id !== o()?.panels[t].id || e.visible !== o()?.panels[t].visible));
	}), En(), Ci();
	var _ = ia(), v = R(I(_), 3);
	Gr(v, 7, () => (W(a()), U(() => a()?.panels ?? [])), (e) => e.id, (e, t, i) => {
		var a = ea(), o = I(a), s = I(o);
		di(s);
		var c = L(R(s), !0);
		A(o);
		var l = R(o, 2), d = I(l), f = R(d);
		A(l), A(a), z((e, o, l, u) => {
			X(a, "data-layout-row", (H(t), U(() => H(t).id))), X(s, "aria-label", e), pi(s, (H(t), U(() => H(t).visible))), s.disabled = (H(n), H(t), H(r), U(() => H(n) || H(t).visible && H(r) === 1)), J(c, o), X(d, "aria-label", l), d.disabled = H(n) || H(i) === 0, X(f, "aria-label", u), f.disabled = H(n) || H(i) === 2;
		}, [
			() => (W(Ui), H(t), U(() => `Show ${Ui(H(t).id)}`)),
			() => (W(Ui), H(t), U(() => Ui(H(t).id))),
			() => (W(Ui), H(t), U(() => `Move ${Ui(H(t).id)} up`)),
			() => (W(Ui), H(t), U(() => `Move ${Ui(H(t).id)} down`))
		]), G("change", s, () => u()(H(t).id)), G("click", d, () => g(H(t).id, -1)), G("click", f, () => g(H(t).id, 1)), q(e, a);
	}), A(v);
	var y = R(v, 2), b = (e) => {
		var t = na(), n = R(I(t), 2);
		Gr(n, 5, () => (W(o()), U(() => o()?.panels ?? [])), (e) => e.id, (e, t) => {
			var n = ta(), r = L(n);
			z((e) => J(r, `${e ?? ""} — ${H(t), U(() => H(t).visible ? "Shown" : "Hidden") ?? ""}`), [() => (W(Ui), H(t), U(() => Ui(H(t).id)))]), q(e, n);
		}), A(n);
		var r = R(n), i = I(r), a = R(i);
		A(r), A(t), G("click", i, () => m()(!1)), G("click", a, () => m()(!0)), q(e, t);
	};
	Y(y, (e) => {
		s() === "conflict" && e(b);
	});
	var x = R(y, 2), S = (e) => {
		var t = ra(), n = R(I(t), 2);
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
	}), q(e, _), Ge();
}
Cr(["change", "click"]);
// src/Connections.svelte
var oa = /* @__PURE__ */ K("<section class=\"card small-card\"><h2>No Crafty connection enrolled</h2><p>An owner can add dedicated access and choose which servers to show.</p></section>"), sa = /* @__PURE__ */ K("<p class=\"notice\" role=\"status\"> </p>"), ca = /* @__PURE__ */ K("<p class=\"field-help\">This server could not be fully observed.</p>"), la = /* @__PURE__ */ K("<article class=\"card small-card server-card\"><h2> </h2> <p><strong> </strong> <span class=\"field-help\">Provider-reported process state</span></p> <dl><dt>Players</dt><dd> </dd> <dt>Freshness</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd> <dt>Join address</dt><dd> </dd></dl> <!></article>"), ua = /* @__PURE__ */ K("<!> <div class=\"server-grid\"></div> <p class=\"field-help\">A running process does not establish game readiness. Join addresses are owner-reviewed; outside-network joining is accepted separately.</p>", 1), da = /* @__PURE__ */ K("<button class=\"button secondary\">Check connection state</button>"), fa = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove server</button>"), pa = /* @__PURE__ */ K("<fieldset><legend> </legend> <label>Crafty server UUID</label><input name=\"server-id\" required=\"\" maxlength=\"36\"/> <label>Display name</label><input name=\"server-name\" required=\"\" maxlength=\"80\"/> <label>Reviewed public join address, optional</label><input name=\"server-join\" maxlength=\"253\" placeholder=\"play.example:25565\"/> <!></fieldset>"), ma = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove connection</button>"), ha = /* @__PURE__ */ K("<section class=\"card connection-setup\" aria-label=\"Dedicated Crafty enrollment\"><h2>Dedicated Crafty access</h2> <p>Create access specifically for Reborn, limited to viewing the selected servers. Credentials are encrypted on the server and are not shown again.</p> <p class=\"workspace-status\" role=\"status\"> </p> <!> <form autocomplete=\"off\"><label for=\"crafty-endpoint\">Crafty HTTPS address</label><input id=\"crafty-endpoint\" name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\" placeholder=\"https://crafty.example/\"/> <label for=\"crafty-token\">Dedicated API token</label><input id=\"crafty-token\" name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label for=\"crafty-timezone\">Crafty’s configured time zone</label><input id=\"crafty-timezone\" name=\"timezone\" required=\"\" maxlength=\"64\" placeholder=\"America/Chicago or UTC\"/> <label for=\"crafty-ca\">Private CA certificate, if needed</label><textarea id=\"crafty-ca\" name=\"ca-pem\" maxlength=\"8192\" rows=\"3\"></textarea> <p class=\"field-help\">Leave the certificate blank for publicly trusted HTTPS. The address and certificate must pass normal hostname and trust checks.</p> <!> <div class=\"button-row\"><button class=\"button secondary\" type=\"button\">Add server</button> <button class=\"button primary\" type=\"submit\"> </button></div></form> <!></section>"), ga = /* @__PURE__ */ K("<button class=\"text-button\">View connection enrollment history</button> <div class=\"connections-intro\"><p>Server observations from your deliberately enrolled Crafty connection.</p><span class=\"quiet-label\">Read-only overview</span></div> <!> <!>", 1);
function _a(e, t) {
	We(t, !1);
	let n = Z(t, "binding", 8), r = Z(t, "history", 8), i = Z(t, "overview", 8), a = Z(t, "owner", 8, !1), o = Z(t, "active", 8, !1), s = Z(t, "refresh", 8), c = /* @__PURE__ */ P(), l = /* @__PURE__ */ P([0]), u = /* @__PURE__ */ P(0), d = /* @__PURE__ */ P(), f = /* @__PURE__ */ P(""), p = /* @__PURE__ */ P(!1), m = 0, h = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
	function g() {
		++m, H(d)?.abort(), F(d, void 0), H(c)?.reset(), F(l, [qt(u)]), F(f, ""), F(p, !1);
	}
	Fi(g);
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
		H(c)?.reset(), F(l, [qt(u)]);
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
	Tn(() => W(o()), () => {
		o() || g();
	}), En(), Ci();
	var y = ga(), b = cn(y), x = R(b, 4), S = (e) => {
		q(e, oa());
	}, C = (e) => {
		var t = ua(), n = cn(t), r = (e) => {
			var t = sa(), n = L(t, !0);
			z(() => J(n, (W(i()), U(() => i().error === "checking" ? "Checking the provider. Fresh results will appear on the next observation." : "Provider observations are unavailable or incomplete. Unknown player counts stay unknown.")))), q(e, t);
		};
		Y(n, (e) => {
			W(i()), U(() => i().error) && e(r);
		});
		var a = R(n, 2);
		Gr(a, 5, () => (W(i()), U(() => i().servers)), Vr, (e, t) => {
			var n = la(), r = I(n), i = L(r, !0), a = R(r, 2), o = L(I(a), !0);
			Se(2), A(a);
			var s = R(a, 2), c = R(I(s)), l = L(c), u = R(c, 3), d = L(u, !0), f = R(u, 3), p = L(f, !0), m = R(f, 2), g = L(m, !0), _ = L(R(m, 3), !0);
			A(s);
			var v = R(s, 2), y = (e) => {
				q(e, ca());
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
		var t = ha(), n = R(I(t), 4), r = L(n, !0), a = R(n, 2), o = (e) => {
			var t = da();
			G("click", t, () => void v()), q(e, t);
		};
		Y(a, (e) => {
			H(p) && e(o);
		});
		var s = R(a, 2), m = R(I(s)), h = R(m, 3), g = R(h, 3), y = R(g, 3), b = R(y, 4);
		Gr(b, 3, () => H(l), (e) => e, (e, t, n) => {
			var r = pa(), i = I(r), a = L(i), o = R(i, 2), s = R(o), c = R(s, 2), u = R(c), f = R(u, 2), m = R(f), h = R(m, 2), g = (e) => {
				var n = fa();
				z(() => n.disabled = !!H(d) || H(p)), G("click", n, () => F(l, H(l).filter((e) => e !== H(t)))), q(e, n);
			};
			Y(h, (e) => {
				H(l), U(() => H(l).length > 1) && e(g);
			}), A(r), z(() => {
				J(a, `Server ${H(n) + 1}`), X(o, "for", `crafty-id-${H(t)}`), X(s, "id", `crafty-id-${H(t)}`), s.disabled = !!H(d) || H(p), X(c, "for", `crafty-name-${H(t)}`), X(u, "id", `crafty-name-${H(t)}`), u.disabled = !!H(d) || H(p), X(f, "for", `crafty-join-${H(t)}`), X(m, "id", `crafty-join-${H(t)}`), m.disabled = !!H(d) || H(p);
			}), q(e, r);
		});
		var x = R(b, 2), S = I(x), C = R(S, 2), w = L(C, !0);
		A(x), A(s), Si(s, (e) => F(c, e), () => H(c));
		var T = R(s, 2), E = (e) => {
			var t = ma();
			z(() => t.disabled = !!H(d) || H(p)), G("click", t, () => void _(!0)), q(e, t);
		};
		Y(T, (e) => {
			W(i()), U(() => i()?.configured) && e(E);
		}), A(t), z(() => {
			J(r, H(f)), m.disabled = !!H(d) || H(p), h.disabled = !!H(d) || H(p), g.disabled = !!H(d) || H(p), y.disabled = !!H(d) || H(p), S.disabled = (H(l), H(d), H(p), U(() => H(l).length >= 8 || !!H(d) || H(p))), C.disabled = !!H(d) || H(p) || !i(), J(w, H(d) ? "Working…" : "Save dedicated connection");
		}), Sr("submit", s, (e) => {
			e.preventDefault(), _();
		}), G("click", S, () => F(l, [...H(l), qt(u)])), q(e, t);
	};
	Y(w, (e) => {
		a() && o() && e(T);
	}), G("click", b, function(...e) {
		r()?.apply(this, e);
	}), q(e, y), Ge();
}
Cr(["click"]);
// src/Directory.svelte
var va = /* @__PURE__ */ K("<button class=\"text-button\">Browse services <span aria-hidden=\"true\">→</span></button>"), ya = /* @__PURE__ */ K("<section class=\"notice\"><h3>Review the saved state</h3><p> </p><button class=\"button secondary\">Check saved services</button></section>"), ba = /* @__PURE__ */ K("<option> </option>"), xa = /* @__PURE__ */ K("<div class=\"directory-filters\"><div><label for=\"service-search\">Search services</label><input id=\"service-search\" type=\"search\" maxlength=\"120\" placeholder=\"Name, category or description\"/></div><div><label for=\"service-filter\">Category</label><select id=\"service-filter\"><option>All categories</option><!></select></div></div>"), Sa = /* @__PURE__ */ K("<section class=\"card small-card\"><h3> </h3><p> </p></section>"), Ca = /* @__PURE__ */ K("<p> </p>"), wa = /* @__PURE__ */ K("<button class=\"text-button move-up\">↑</button><button class=\"text-button move-down\">↓</button>", 1), Ta = /* @__PURE__ */ K("<p>The directory changed. Review the service and choose Remove again.</p>"), Ea = /* @__PURE__ */ K("<div class=\"notice\"><p> </p><!><div class=\"button-row\"><button class=\"button secondary confirm-remove\">Remove service</button><button class=\"text-button\">Keep service</button></div></div>"), Da = /* @__PURE__ */ K("<div class=\"button-row\"><button class=\"text-button edit-service\"> </button><button class=\"text-button remove-service\">Remove</button></div> <!>", 1), Oa = /* @__PURE__ */ K("<article class=\"card small-card service-card\"><p class=\"eyebrow\"> </p><h3><a class=\"service-link\" target=\"_blank\" rel=\"noopener noreferrer\"> <span class=\"sr-only\">(opens in a new tab)</span> <span aria-hidden=\"true\">↗</span></a></h3> <!> <p class=\"field-help service-address\"> </p> <div class=\"button-row\"><button class=\"button secondary pin-service\"> </button> <!></div> <!></article>"), ka = /* @__PURE__ */ K("<div class=\"directory-grid\"></div>"), Aa = /* @__PURE__ */ K("<p class=\"field-help\">Up to 24 personal pins. Links open the selected service in a new tab. Each service handles its own sign-in; directory links do not check availability.</p>"), ja = /* @__PURE__ */ K("<div class=\"notice\"><p>The directory changed after this form was opened. Review the current entries, then choose whether to keep this edit.</p><button class=\"button secondary\" type=\"button\">Keep edit against current directory</button></div>"), Ma = /* @__PURE__ */ K("<section class=\"card directory-editor\" aria-label=\"Service editor\"><h2> </h2><p>Add a reviewed HTTPS link without passwords, tokens, query parameters or fragments. These links are visible to signed-in accounts.</p> <form><label for=\"service-name\">Service name</label><input id=\"service-name\" name=\"service-name\" required=\"\" maxlength=\"80\"/> <label for=\"service-category\">Category</label><input id=\"service-category\" name=\"service-category\" required=\"\" maxlength=\"40\"/> <label for=\"service-url\">HTTPS link</label><input id=\"service-url\" name=\"service-url\" type=\"url\" required=\"\" maxlength=\"1024\" placeholder=\"https://service.example/\"/> <label for=\"service-description\">Description, optional</label><textarea id=\"service-description\" name=\"service-description\" maxlength=\"240\" rows=\"2\"></textarea> <!> <div class=\"button-row\"><button class=\"button primary\" type=\"submit\"> </button><button class=\"text-button\" type=\"button\"> </button></div></form></section>"), Na = /* @__PURE__ */ K("<div class=\"directory-heading\"><div><p class=\"eyebrow\"> </p><h2> </h2></div><!></div> <p class=\"directory-status\" role=\"status\"> </p> <!> <!> <!> <!> <!>", 1);
function Pa(e, t) {
	We(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = Z(t, "directory", 8), o = Z(t, "authorized", 8, !1), s = Z(t, "owner", 8, !1), c = Z(t, "compact", 8, !1), l = Z(t, "state", 8), u = Z(t, "message", 8), d = Z(t, "browse", 8), f = Z(t, "check", 8), p = Z(t, "edit", 8), m = Z(t, "pin", 8), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P(""), _ = /* @__PURE__ */ P(""), v = /* @__PURE__ */ P(""), y = /* @__PURE__ */ P(""), b = /* @__PURE__ */ P(""), x = /* @__PURE__ */ P(""), S = /* @__PURE__ */ P(), C = /* @__PURE__ */ P(), w = 0;
	function T() {
		++w, F(h, ""), F(g, ""), F(_, ""), F(v, ""), F(y, ""), F(b, ""), F(x, ""), F(C, void 0), F(S, void 0);
	}
	Fi(T);
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
		await p()(H(S), t) && o() && e === w && (await fr(), o() && e === w && E());
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
		}) && o() && t === w && (await fr(), o() && t === w && (F(C, void 0), H(x) === e && E()));
	}
	Tn(() => (W(l()), W(o())), () => {
		F(n, l() === "saving" || l() === "uncertain" || !o());
	}), Tn(() => W(a()), () => {
		F(r, [...new Set(a()?.services.map((e) => e.category) ?? [])].sort());
	}), Tn(() => (H(g), H(r)), () => {
		H(g) && !H(r).includes(H(g)) && F(g, "");
	}), Tn(() => (W(a()), W(c()), H(g), H(h)), () => {
		F(i, [...a()?.services ?? []].sort((e, t) => {
			let n = a()?.pins.indexOf(e.id) ?? -1, r = a()?.pins.indexOf(t.id) ?? -1;
			return n >= 0 || r >= 0 ? (n < 0 ? 25 : n) - (r < 0 ? 25 : r) : e.name.localeCompare(t.name) || Number(BigInt(e.id) - BigInt(t.id));
		}).filter((e) => c() ? a()?.pins.includes(e.id) : (!H(g) || e.category === H(g)) && `${e.name} ${e.category} ${e.description}`.toLocaleLowerCase().includes(H(h).toLocaleLowerCase())));
	}), Tn(() => W(o()), () => {
		o() || T();
	}), Tn(() => (W(o()), W(a()), H(S)), () => {
		o() && a() && H(S) === void 0 && F(S, a().revision);
	}), En(), Ci();
	var ae = Na(), oe = cn(ae), se = I(oe), ce = I(se), le = L(ce, !0), ue = L(R(ce), !0);
	A(se);
	var de = R(se), fe = (e) => {
		var t = va();
		G("click", t, function(...e) {
			d()?.apply(this, e);
		}), q(e, t);
	};
	Y(de, (e) => {
		c() && e(fe);
	}), A(oe);
	var pe = R(oe, 2), D = L(pe, !0), me = R(pe, 2), he = (e) => {
		var t = ya(), n = R(I(t)), r = L(n, !0), i = R(n);
		A(t), z(() => J(r, l() === "uncertain" ? "Your change has not been sent again." : "Your edit is still in the form. Compare it with the current directory before saving.")), G("click", i, () => void f()()), q(e, t);
	};
	Y(me, (e) => {
		(l() === "uncertain" || l() === "conflict") && e(he);
	});
	var ge = R(me, 2), _e = (e) => {
		var t = xa(), n = I(t), i = R(I(n));
		di(i), A(n);
		var a = R(n), o = R(I(a)), s = I(o);
		s.value = s.__value = "", Gr(R(s), 1, () => H(r), Vr, (e, t) => {
			var n = ba(), r = L(n, !0), i = {};
			z(() => {
				J(r, H(t)), i !== (i = H(t)) && (n.value = (n.__value = i) ?? "");
			}), q(e, n);
		}), A(o), ri(o), A(a), A(t), _i(i, () => H(h), (e) => F(h, e)), ii(o, () => H(g), (e) => F(g, e)), q(e, t);
	};
	Y(ge, (e) => {
		c() || e(_e);
	});
	var ve = R(ge, 2), O = (e) => {
		var t = Sa(), n = I(t), r = L(n, !0), i = L(R(n), !0);
		A(t), z(() => {
			J(r, (W(c()), W(a()), U(() => c() ? "Keep your favorites close" : a()?.services.length ? "No matching services" : "Your directory starts here"))), J(i, (W(c()), W(a()), W(s()), U(() => c() ? "Pin services from the directory to show them on Home." : a()?.services.length ? "Try another search or category." : s() ? "Add a service below to make it available to signed-in accounts." : "An owner can add reviewed service links.")));
		}), q(e, t);
	}, ye = (e) => {
		var t = ka();
		Gr(t, 5, () => H(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ mt(() => (W(a()), H(t), U(() => a()?.pins.includes(H(t).id) ?? !1))), i = /* @__PURE__ */ mt(() => (W(a()), H(t), U(() => a()?.pins.indexOf(H(t).id) ?? -1)));
			var o = Oa(), l = I(o), u = L(l, !0), d = R(l), f = I(d), p = I(f, !0);
			Se(3), A(f), A(d);
			var m = R(d, 2), h = (e) => {
				var n = Ca(), r = L(n, !0);
				z(() => J(r, (H(t), U(() => H(t).description)))), q(e, n);
			};
			Y(m, (e) => {
				H(t), U(() => H(t).description) && e(h);
			});
			var g = R(m, 2), _ = L(g, !0), v = R(g, 2), y = I(v), b = L(y, !0), x = R(y, 2), S = (e) => {
				var r = wa(), o = cn(r), s = R(o);
				z(() => {
					X(o, "aria-label", (H(t), U(() => `Move ${H(t).name} up`))), o.disabled = H(n) || H(i) === 0, X(s, "aria-label", (H(t), U(() => `Move ${H(t).name} down`))), s.disabled = (H(n), W(H(i)), W(a()), U(() => H(n) || H(i) === (a()?.pins.length ?? 0) - 1));
				}), G("click", o, () => re(H(t).id, -1)), G("click", s, () => re(H(t).id, 1)), q(e, r);
			};
			Y(x, (e) => {
				H(r) && e(S);
			}), A(v);
			var w = R(v, 2), T = (e) => {
				var r = Da(), i = cn(r), o = I(i), s = L(o), c = R(o);
				A(i);
				var l = R(i, 2), u = (e) => {
					var r = Ea(), i = I(r), o = L(i), s = R(i), c = (e) => {
						q(e, Ta());
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
		q(e, Aa());
	};
	Y(k, (e) => {
		c() || e(be);
	});
	var xe = R(k, 2), Ce = (e) => {
		var t = Ma(), r = I(t), i = L(r, !0), o = R(r, 3), s = R(I(o));
		di(s);
		var u = R(s, 3);
		di(u);
		var d = R(u, 3);
		di(d);
		var f = R(d, 3);
		tt(f);
		var p = R(f, 2), m = (e) => {
			var t = ja(), r = R(I(t));
			A(t), z(() => r.disabled = H(n)), G("click", r, () => F(S, a()?.revision)), q(e, t);
		};
		Y(p, (e) => {
			H(S), W(a()), U(() => H(S) !== void 0 && a() && H(S) !== a().revision) && e(m);
		});
		var h = R(p, 2), g = I(h), C = L(g, !0), w = R(g), T = L(w, !0);
		A(h), A(o), A(t), z(() => {
			X(t, "hidden", c()), J(i, H(x) ? "Edit service" : "Add a service"), s.disabled = H(n), u.disabled = H(n), d.disabled = H(n), f.disabled = H(n), g.disabled = (H(n), H(S), W(a()), U(() => H(n) || H(S) !== a()?.revision)), J(C, l() === "saving" ? "Saving…" : H(x) ? "Save service" : "Add service"), w.disabled = H(n), J(T, H(x) ? "Cancel edit" : "Clear form");
		}), Sr("submit", o, (e) => {
			e.preventDefault(), te();
		}), _i(s, () => H(_), (e) => F(_, e)), _i(u, () => H(b), (e) => F(b, e)), _i(d, () => H(y), (e) => F(y, e)), _i(f, () => H(v), (e) => F(v, e)), G("click", w, E), q(e, t);
	};
	Y(xe, (e) => {
		s() && o() && e(Ce);
	}), z(() => {
		J(le, c() ? "YOUR SHORTCUTS" : "A PLACE FOR YOUR SERVICES"), J(ue, c() ? "Pinned services" : "Service directory"), J(D, u());
	}), q(e, ae), Ge();
}
Cr(["click"]);
// src/Activity.svelte
var Fa = /* @__PURE__ */ K("<p class=\"activity-empty\">No matching activity in this window. Try another action name or check the newest entries.</p>"), Ia = /* @__PURE__ */ K("<li><div><strong> </strong><p> </p></div><time> </time></li>"), La = /* @__PURE__ */ K("<!> <ol class=\"activity-list\"></ol> <div class=\"button-row\"><button class=\"button secondary\">Check newest activity</button><button class=\"button secondary\">Older activity</button></div> <p class=\"field-help\">Up to 25 entries per page. New changes appear when you check newest; older pages stay within the current history window. Search matches action names, not note or credential contents.</p>", 1), Ra = /* @__PURE__ */ K("<button class=\"button secondary\">Retry activity</button>"), za = /* @__PURE__ */ K("<button class=\"button secondary\">Check activity</button>"), Ba = /* @__PURE__ */ K("<section class=\"card activity-card\" aria-label=\"Your retained activity\"><h2>Your activity</h2> <p>Successful changes made by your account, retained from the introduction of Activity. Connection entries describe enrollment changes, not game actions or provider uptime.</p> <form class=\"activity-search\"><div><label for=\"activity-query\">Search action names</label><input id=\"activity-query\" maxlength=\"80\" placeholder=\"For example, saved or Crafty\"/></div> <div><label for=\"activity-category\">Activity category</label><select id=\"activity-category\"><option>All activity</option><option>Workspace notes</option><option>Services and pins</option><option>Connection enrollment</option></select></div> <button type=\"submit\" class=\"button primary\">Search activity</button></form> <p class=\"workspace-status\" role=\"status\"> </p> <!></section>");
function Va(e, t) {
	We(t, !1);
	let n = Z(t, "state", 8), r = Z(t, "authorized", 8, !1), i = Z(t, "load", 8), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P("all"), s = /* @__PURE__ */ P(), c = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	Tn(() => W(r()), () => {
		r() || (F(a, ""), F(o, "all"), F(s, void 0));
	}), Tn(() => (W(n()), H(s)), () => {
		n() !== H(s) && n().phase === "loading" && (F(s, n()), F(a, n().query), F(o, n().category));
	}), En(), Ci();
	var l = Ba(), u = R(I(l), 4), d = I(u), f = R(I(d));
	di(f), A(d);
	var p = R(d, 2), m = R(I(p)), h = I(m);
	h.value = h.__value = "all";
	var g = R(h);
	g.value = g.__value = "workspace";
	var _ = R(g);
	_.value = _.__value = "directory";
	var v = R(_);
	v.value = v.__value = "connections", A(m), ri(m), A(p);
	var y = R(p, 2);
	A(u);
	var b = R(u, 2), x = L(b, !0), S = R(b, 2), C = (e) => {
		var t = La(), r = cn(t), a = (e) => {
			q(e, Fa());
		};
		Y(r, (e) => {
			W(n()), U(() => n().entries.length === 0) && e(a);
		});
		var o = R(r, 2);
		Gr(o, 5, () => (W(n()), U(() => n().entries)), (e) => e.id, (e, t) => {
			var n = Ia(), r = I(n), i = I(r), a = L(i, !0), o = L(R(i));
			A(r);
			var s = R(r), l = L(s, !0);
			A(n), z((e, r) => {
				X(n, "data-activity-id", (H(t), U(() => H(t).id))), J(a, (H(t), U(() => H(t).label))), J(o, `Revision ${H(t), U(() => H(t).revision) ?? ""} · ${H(t), U(() => H(t).category === "connections" ? "Connection enrollment" : H(t).category === "directory" ? "Services and pins" : "Workspace note") ?? ""}`), X(s, "datetime", e), J(l, r);
			}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => c(H(t).occurred_at)))]), q(e, n);
		}), A(o);
		var s = R(o, 2), l = I(s), u = R(l);
		A(s), Se(2), z(() => u.disabled = (W(n()), U(() => !n().next))), G("click", l, () => void i()(n().category, n().query)), G("click", u, () => void i()(n().category, n().query, !0)), q(e, t);
	}, w = (e) => {
		var t = Ra();
		G("click", t, () => void i()(n().category, n().query)), q(e, t);
	}, T = (e) => {
		var t = za();
		z(() => t.disabled = !r()), G("click", t, () => void i()(H(o), H(a))), q(e, t);
	};
	Y(S, (e) => {
		W(n()), U(() => n().phase === "ready") ? e(C) : (W(n()), U(() => n().phase === "error") ? e(w, 1) : (W(n()), U(() => n().phase === "idle") && e(T, 2)));
	}), A(l), z(() => {
		f.disabled = !r(), m.disabled = !r(), y.disabled = !r(), J(x, (W(n()), U(() => n().message)));
	}), Sr("submit", u, (e) => {
		e.preventDefault(), i()(H(o), H(a));
	}), _i(f, () => H(a), (e) => F(a, e)), ii(m, () => H(o), (e) => F(o, e)), q(e, l), Ge();
}
Cr(["click"]);
// src/Notifications.svelte
var Ha = /* @__PURE__ */ K("<div class=\"notice\"><h3>Check your read markers</h3><p>The change may have completed. Check notifications before marking another group read.</p></div>"), Ua = /* @__PURE__ */ K("<p class=\"notification-empty\"> </p>"), Wa = /* @__PURE__ */ K("<li><div><h3> </h3><p class=\"notification-count\"> </p><p> </p><p class=\"field-help\"><time> </time></p></div> <button class=\"button secondary mark-notification-read\"> </button></li>"), Ga = /* @__PURE__ */ K("<div class=\"notification-card card\"><div class=\"notification-heading\"><div><p class=\"eyebrow\">AT YOUR PACE</p><h2>Your notifications</h2></div><button class=\"button secondary check-notifications\">Check notifications</button></div> <p>Shared service and connection changes from other accounts, grouped together. Opening this inbox leaves them unread.</p> <label class=\"notification-filter\"><input id=\"notification-show-read\" type=\"checkbox\"/> Show read groups</label> <p class=\"notification-status\" role=\"status\"> </p> <!> <!> <ul class=\"notification-list\"></ul></div>");
function Ka(e, t) {
	We(t, !1);
	let n = /* @__PURE__ */ P(), r = Z(t, "value", 8), i = Z(t, "authorized", 8), a = Z(t, "state", 8), o = Z(t, "message", 8), s = Z(t, "check", 8), c = Z(t, "mark", 8), l = /* @__PURE__ */ P(!1), u = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	Tn(() => W(i()), () => {
		i() || F(l, !1);
	}), Tn(() => (W(i()), W(r()), H(l)), () => {
		F(n, i() ? (r()?.groups ?? []).filter((e) => H(l) || e.unread !== "0") : []);
	}), En(), Ci();
	var d = Ga(), f = I(d), p = R(I(f));
	A(f);
	var m = R(f, 4), h = I(m);
	di(h), Se(), A(m);
	var g = R(m, 2), _ = L(g, !0), v = R(g, 2), y = (e) => {
		q(e, Ha());
	};
	Y(v, (e) => {
		a() === "uncertain" && e(y);
	});
	var b = R(v, 2), x = (e) => {
		var t = Ua(), n = L(t, !0);
		z(() => J(n, H(l) ? "No shared changes to show yet." : "You’re all caught up.")), q(e, t);
	};
	Y(b, (e) => {
		H(n), U(() => H(n).length === 0) && e(x);
	});
	var S = R(b, 2);
	Gr(S, 5, () => H(n), (e) => e.category, (e, t) => {
		var n = Wa(), r = I(n), o = I(r), s = L(o, !0), l = R(o), d = L(l, !0), f = R(l), p = L(f, !0), m = R(f), h = I(m), g = L(h, !0);
		A(m), A(r);
		var _ = R(r, 2), v = L(_);
		A(n), z((e, r) => {
			X(n, "data-notification-category", (H(t), U(() => H(t).category))), J(s, (H(t), U(() => H(t).category === "services" ? "Services" : "Connections"))), J(d, (H(t), U(() => H(t).unread === "0" ? "Read" : `${H(t).unread} unread ${H(t).unread === "1" ? "change" : "changes"}`))), J(p, (H(t), U(() => H(t).latest.label))), X(h, "datetime", e), J(g, r), _.disabled = (W(i()), W(a()), H(t), U(() => !i() || a() !== "idle" || H(t).unread === "0")), J(v, `Mark ${H(t), U(() => H(t).category === "services" ? "services" : "connections") ?? ""} read`);
		}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).latest.occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => u(H(t).latest.occurred_at)))]), G("click", _, () => c()(H(t).category, H(t).revision)), q(e, n);
	}), A(S), A(d), z(() => {
		p.disabled = !i() || a() === "saving", h.disabled = !i(), J(_, o() || "Read markers are saved to your account.");
	}), G("click", p, () => s()()), vi(h, () => H(l), (e) => F(l, e)), q(e, d), Ge();
}
Cr(["click"]);
// src/App.svelte
var qa = /* @__PURE__ */ K("<span class=\"notification-badge\"> </span>"), Ja = /* @__PURE__ */ K("<a rel=\"noreferrer\"> </a>"), Ya = /* @__PURE__ */ K("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), Xa = /* @__PURE__ */ K("<span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button>", 1), Za = /* @__PURE__ */ K("<span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p> </p><button class=\"text-button\">View connections <span aria-hidden=\"true\">→</span></button>", 1), Qa = /* @__PURE__ */ K("<section><!></section>"), $a = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), eo = /* @__PURE__ */ K("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), to = /* @__PURE__ */ K("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), no = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), ro = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), io = /* @__PURE__ */ K("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span aria-hidden=\"true\"></span></button> <button><span aria-hidden=\"true\">◇</span>Connections</button> <button><span aria-hidden=\"true\">▦</span>Services</button> <button><span aria-hidden=\"true\">◷</span>Activity</button> <button><span aria-hidden=\"true\">♧</span>Notifications<!></button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <form method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary> <dl><dt>Source</dt><dd><!></dd><dt>Tree</dt><dd> </dd><dt>Channel</dt><dd> </dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-layout-heading\"><p class=\"layout-status\" role=\"status\"> </p><button class=\"button secondary customize-home\">Customize Home</button></div> <div><!></div> <div></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <section aria-label=\"Connections\"><!></section> <section aria-label=\"Activity\"><!></section> <section aria-label=\"Notifications\"><!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function ao(e, t) {
	We(t, !1);
	let n = () => ji(u, "$model", r), [r, i] = Mi(), a = /* @__PURE__ */ P(), o = /* @__PURE__ */ P(), s = /* @__PURE__ */ P(), c = Z(t, "binding", 8), l = $i(c()), u = l.model, d = /* @__PURE__ */ P("home"), f = /* @__PURE__ */ P(), p = /* @__PURE__ */ P(), m = /* @__PURE__ */ P(Hi()), h, g = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", _ = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified", v = document.querySelector("meta[name=\"reborn-tree\"]")?.content ?? "unqualified", y = document.querySelector("meta[name=\"reborn-channel\"]")?.content ?? "development";
	function b(e) {
		F(d, e), H(f)?.focus(), e === "activity" && l.activity(), e === "notifications" && l.check();
	}
	let x = () => n().snapshot ? `${n().snapshot.account.id}:${n().snapshot.session_generation}:${n().snapshot.account.role}` : "";
	Ii(() => {
		let e = document.activeElement;
		h = H(d) === "home" && n().phase === "ready" && e instanceof HTMLElement && H(p)?.contains(e) ? {
			element: e,
			scope: x()
		} : void 0;
	}), Li(() => {
		let e = h;
		h = void 0, e && H(d) === "home" && n().phase === "ready" && e.scope === x() && e.element.isConnected && H(p)?.contains(e.element) && document.activeElement === document.body && document.visibilityState === "visible" && document.hasFocus() && e.element.getClientRects().length > 0 && e.element.focus({ preventScroll: !0 });
	}), Pi(l.start), Tn(() => (n(), Hi), () => {
		F(a, n().layoutDraft?.panels ?? n().snapshot?.layout.panels ?? Hi());
	}), Tn(() => (n(), H(d), H(a)), () => {
		n().phase === "ready" ? H(d) !== "directory" && F(m, H(a)) : F(m, Hi());
	}), Tn(() => n(), () => {
		F(o, new TextEncoder().encode(n().draft).length);
	}), Tn(() => (n(), H(o)), () => {
		F(s, n().phase === "ready" && n().dirty && H(o) <= 4096 && !["saving", "checking-conflict"].includes(n().layoutSave) && n().notificationSave !== "saving" && ![
			"saving",
			"checking-conflict",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), En(), Ci();
	var S = io(), C = R(cn(S), 2), w = I(C), T = R(I(w), 4), E = I(T);
	let ee;
	var te = R(E, 2);
	let ne;
	var re = R(I(te), 2);
	let ie;
	A(te);
	var ae = R(te, 2);
	let oe;
	var se = R(ae, 2);
	let ce;
	var le = R(se, 2);
	let ue;
	var de = R(le, 2);
	let fe;
	var pe = R(I(de), 2), D = (e) => {
		var t = qa(), r = L(t, !0);
		z(() => {
			X(t, "aria-label", (n(), U(() => `${n().snapshot.notifications.unread_groups} unread groups`))), J(r, (n(), U(() => n().snapshot.notifications.unread_groups)));
		}), q(e, t);
	};
	Y(pe, (e) => {
		n(), U(() => n().snapshot?.notifications.unread_groups) && e(D);
	}), A(de), A(T);
	var me = R(T, 2), he = I(me), ge = R(I(he)), _e = I(ge), ve = L(_e, !0), O = L(R(_e), !0);
	A(ge), A(he);
	var ye = R(he, 2), k = R(R(I(ye), 2), 2);
	di(k), Se(2), A(ye);
	var be = R(ye, 2), xe = I(be), Ce = I(xe, !0);
	Se(), A(xe);
	var we = R(xe, 2), Te = R(I(we)), Ee = I(Te), De = (e) => {
		var t = Ja(), n = L(t, !0);
		z(() => {
			X(t, "href", `https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${_}`), J(n, _);
		}), q(e, t);
	}, Oe = /* @__PURE__ */ pt(() => U(() => /^[a-f0-9]{40}$/.test(_))), ke = (e) => {
		var t = jr();
		z(() => J(t, _)), q(e, t);
	};
	Y(Ee, (e) => {
		H(Oe) ? e(De) : e(ke, -1);
	}), A(Te);
	var Ae = R(Te, 2), je = L(Ae, !0), Me = L(R(Ae, 2), !0);
	Se(2), A(we), A(be), A(me), A(w);
	var Ne = R(w, 2), Pe = I(Ne), Fe = I(Pe), Ie = R(I(Fe)), Le = L(Ie, !0);
	Si(Ie, (e) => F(f, e), () => H(f)), A(Fe);
	var Re = R(Fe), ze = R(I(Re), 1, !0);
	A(Re), A(Pe);
	var Be = R(Pe, 2), Ve = L(Be, !0), He = R(Be, 2), j = (e) => {
		q(e, Ya());
	};
	Y(He, (e) => {
		n(), U(() => n().phase !== "ready") && e(j);
	});
	var Ue = R(He, 2), Ke = I(Ue), qe = I(Ke), Je = R(I(qe), 3);
	A(qe), Se(), A(Ke);
	var Ye = R(Ke, 2), Xe = I(Ye), Ze = L(Xe, !0), Qe = R(Xe);
	A(Ye);
	var M = R(Ye, 2), $e = I(M);
	{
		let e = /* @__PURE__ */ mt(() => (n(), U(() => n().snapshot?.layout))), t = /* @__PURE__ */ mt(() => (n(), U(() => n().phase === "ready")));
		aa($e, {
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
	A(M);
	var et = R(M, 2);
	let nt;
	Gr(et, 5, () => H(m), (e) => e.id, (e, t) => {
		var r = Qa();
		let i;
		var a = I(r), o = (e) => {
			var t = Xa(), r = R(cn(t), 2), i = L(r, !0), a = R(r);
			z(() => J(i, (n(), U(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are.")))), G("click", a, () => b("note")), q(e, t);
		}, s = (e) => {
			var t = Za(), r = R(cn(t), 2), i = L(r, !0), a = R(r);
			z(() => J(i, (n(), U(() => n().snapshot?.crafty?.configured ? "Your enrolled Crafty observations are available in Connections." : "Enroll dedicated Crafty access to see your selected servers.")))), G("click", a, () => b("connections")), q(e, t);
		}, c = (e) => {
			{
				let t = /* @__PURE__ */ mt(() => (n(), U(() => n().snapshot?.directory))), r = /* @__PURE__ */ mt(() => (n(), U(() => n().phase === "ready"))), i = /* @__PURE__ */ mt(() => (n(), U(() => n().snapshot?.account.role === "owner"))), a = /* @__PURE__ */ mt(() => H(d) === "home");
				Pa(e, {
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
					browse: () => b("directory"),
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
			X(r, "data-home-panel", (H(t), U(() => H(t).id))), X(r, "hidden", (n(), H(t), H(d), U(() => n().phase !== "ready" || (H(t).id === "pins" ? H(d) === "home" && !H(t).visible : H(d) !== "home" || !H(t).visible)))), X(r, "aria-label", (H(t), U(() => H(t).id === "pins" ? "Services" : H(t).id === "note" ? "Workspace note shortcut" : "Connections shortcut"))), i = $r(r, 1, "", null, i, {
				card: H(t).id !== "pins",
				"small-card": H(t).id !== "pins",
				"pins-panel": H(t).id === "pins"
			});
		}), q(e, r);
	}), A(et), Si(et, (e) => F(p, e), () => H(p)), A(Ue);
	var rt = R(Ue, 2), it = I(rt), at = L(R(I(it)), !0);
	A(it);
	var ot = R(it, 2), st = (e) => {
		var t = $a(), n = R(I(t), 2), r = I(n), i = R(r);
		A(n), A(t), G("click", r, function(...e) {
			l.recover?.apply(this, e);
		}), G("click", i, () => l.resolve(!0)), q(e, t);
	};
	Y(ot, (e) => {
		n(), U(() => n().recovery) && e(st);
	});
	var ct = R(ot, 2), lt = R(I(ct), 2);
	tt(lt);
	var ut = R(lt, 4), dt = I(ut);
	let ft;
	var ht = L(dt), gt = R(dt), _t = L(gt, !0);
	A(ut), A(ct);
	var vt = R(ct, 2), yt = (e) => {
		q(e, eo());
	};
	Y(vt, (e) => {
		n(), U(() => n().storageLimited) && e(yt);
	});
	var bt = R(vt, 2), N = (e) => {
		q(e, to());
	};
	Y(bt, (e) => {
		H(o) > 4096 && e(N);
	});
	var xt = R(bt, 2), St = (e) => {
		var t = no(), r = R(I(t), 2), i = L(r, !0), a = R(r), o = I(a), s = R(o);
		A(a), A(t), z(() => J(i, (n(), U(() => n().snapshot?.note.body)))), G("click", o, () => l.resolve(!1)), G("click", s, () => l.resolve(!0)), q(e, t);
	};
	Y(xt, (e) => {
		n(), U(() => n().save === "conflict") && e(St);
	});
	var Ct = R(xt, 2), wt = (e) => {
		var t = ro(), n = R(I(t), 2);
		A(t), G("click", n, () => l.check()), q(e, t);
	};
	Y(Ct, (e) => {
		n(), U(() => n().save === "uncertain") && e(wt);
	}), A(rt);
	var Tt = R(rt, 2), Et = I(Tt);
	{
		let e = /* @__PURE__ */ mt(() => (n(), U(() => n().snapshot?.crafty))), t = /* @__PURE__ */ mt(() => (n(), U(() => n().snapshot?.account.role === "owner"))), r = /* @__PURE__ */ mt(() => (H(d), n(), U(() => H(d) === "connections" && n().phase === "ready")));
		_a(Et, {
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
	A(Tt);
	var Dt = R(Tt, 2), Ot = I(Dt);
	{
		let e = /* @__PURE__ */ mt(() => (n(), U(() => n().phase === "ready")));
		Va(Ot, {
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
	A(Dt);
	var kt = R(Dt, 2), At = I(kt);
	{
		let e = /* @__PURE__ */ mt(() => (n(), U(() => n().snapshot?.notifications))), t = /* @__PURE__ */ mt(() => (n(), U(() => n().phase === "ready")));
		Ka(At, {
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
	A(kt), Se(2), A(Ne), A(C), z(() => {
		X(E, "aria-current", H(d) === "home" ? "page" : void 0), ee = $r(E, 1, "", null, ee, { active: H(d) === "home" }), X(te, "aria-current", H(d) === "note" ? "page" : void 0), ne = $r(te, 1, "", null, ne, { active: H(d) === "note" }), ie = $r(re, 1, "draft-dot", null, ie, { visible: n().dirty }), X(ae, "aria-current", H(d) === "connections" ? "page" : void 0), oe = $r(ae, 1, "", null, oe, { active: H(d) === "connections" }), X(se, "aria-current", H(d) === "directory" ? "page" : void 0), ce = $r(se, 1, "", null, ce, { active: H(d) === "directory" }), X(le, "aria-current", H(d) === "activity" ? "page" : void 0), ue = $r(le, 1, "", null, ue, { active: H(d) === "activity" }), X(de, "aria-current", H(d) === "notifications" ? "page" : void 0), fe = $r(de, 1, "", null, fe, { active: H(d) === "notifications" }), J(ve, (n(), U(() => n().snapshot?.account.username ?? "Your account"))), J(O, (n(), U(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), fi(k, c()), J(Ce, g), J(je, v), J(Me, y), J(Le, H(d) === "home" ? "Welcome home." : H(d) === "note" ? "A little space to think." : H(d) === "connections" ? "Your servers, at a glance." : H(d) === "directory" ? "Everything within reach." : H(d) === "activity" ? "Pick up the thread." : "Catch up at your pace."), J(ze, (n(), U(() => n().phase === "ready" ? "Session checked" : n().phase === "checking" ? "Checking access" : "Access paused"))), J(Ve, (n(), U(() => n().message))), X(Ue, "hidden", (H(d), n(), U(() => H(d) !== "home" && H(d) !== "directory" || n().phase !== "ready"))), X(Ue, "aria-label", H(d) === "directory" ? "Service directory view" : "Home"), X(Ke, "hidden", H(d) !== "home"), X(Ye, "hidden", H(d) !== "home"), J(Ze, (n(), U(() => n().layoutMessage || "Your panels, in your own order."))), Qe.disabled = (n(), U(() => !!n().layoutDraft || n().phase !== "ready" || n().layoutSave === "saving")), X(M, "hidden", H(d) !== "home"), nt = $r(et, 1, "home-grid", null, nt, { "services-view": H(d) === "directory" }), X(rt, "hidden", (H(d), n(), U(() => H(d) !== "note" || n().phase !== "ready"))), J(at, (n(), U(() => n().dirty ? "Unsaved changes" : "Up to date"))), fi(lt, (n(), U(() => n().draft))), lt.disabled = (n(), U(() => n().phase !== "ready")), ft = $r(dt, 1, "", null, ft, { "over-limit": H(o) > 4096 }), J(ht, `${H(o) ?? ""} / 4096 bytes`), gt.disabled = !H(s), J(_t, (n(), U(() => n().save === "saving" ? "Saving…" : "Save note"))), X(Tt, "hidden", (H(d), n(), U(() => H(d) !== "connections" || n().phase !== "ready"))), X(Dt, "hidden", (H(d), n(), U(() => H(d) !== "activity" || n().phase !== "ready"))), X(kt, "hidden", (H(d), n(), U(() => H(d) !== "notifications" || n().phase !== "ready")));
	}), G("click", E, () => b("home")), G("click", te, () => b("note")), G("click", ae, () => b("connections")), G("click", se, () => b("directory")), G("click", le, () => b("activity")), G("click", de, () => b("notifications")), Sr("submit", ye, () => l.signOut()), G("click", Je, () => b("note")), G("click", Qe, function(...e) {
		l.beginLayout?.apply(this, e);
	}), Sr("submit", ct, (e) => {
		e.preventDefault(), l.save();
	}), G("input", lt, (e) => l.edit(e.currentTarget.value)), q(e, S), Ge(), i();
}
Cr(["click", "input"]);
// src/main.ts
var oo = document.getElementById("workspace-root"), so = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, co = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
if (oo && so && /^[a-f0-9]{64}$/.test(so) && co === "reborn-workspace-v1") {
	let e = Array.from(oo.childNodes);
	oo.replaceChildren();
	try {
		Ir(ao, {
			target: oo,
			props: { binding: so }
		});
	} catch {
		oo.replaceChildren(...e);
	}
}
