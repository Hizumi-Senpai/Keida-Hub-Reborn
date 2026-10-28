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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, E = 1 << 21, ee = 1 << 22, te = 1 << 23, ne = Symbol("$state"), re = Symbol("component"), ie = Symbol("legacy props"), ae = Symbol(""), oe = Symbol("attributes"), se = Symbol("class"), ce = Symbol("style"), le = Symbol("text"), ue = Symbol("form reset"), D = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), de = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), O = {}, fe = Symbol("uninitialized"), pe = "http://www.w3.org/1999/xhtml";
function me() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function he(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function k() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function ge() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// ../node_modules/svelte/src/internal/client/dom/hydration.js
var A = !1;
function _e(e) {
	A = e;
}
var j;
function ve(e) {
	if (e === null) throw he(), O;
	return j = e;
}
function ye() {
	return ve(/* @__PURE__ */ on(j));
}
function M(e) {
	if (A) {
		if (/* @__PURE__ */ on(j) !== null) throw he(), O;
		j = e;
	}
}
function be(e = 1) {
	if (A) {
		for (var t = e, n = j; t--;) n = /* @__PURE__ */ on(n);
		j = n;
	}
}
function xe(e = !0) {
	for (var t = 0, n = j;;) {
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
function Se(e) {
	if (!e || e.nodeType !== 8) throw he(), O;
	return e.data;
}
// ../node_modules/svelte/src/internal/client/reactivity/equality.js
function Ce(e) {
	return e === this.v;
}
function we(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Te(e) {
	return !we(e, this.v);
}
function Ee(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
// ../node_modules/svelte/src/internal/client/errors.js
function De() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Oe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ke(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ae() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function je(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Me() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ne(e) {
	throw Error("https://svelte.dev/e/lifecycle_legacy_only");
}
function Pe(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Fe() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ie() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Le() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Re() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// ../node_modules/svelte/src/internal/flags/index.js
var ze = !1;
function Be() {
	ze = !0;
}
// ../node_modules/svelte/src/internal/client/context.js
var N = null;
function Ve(e) {
	N = e;
}
function He(e, t = !1, n) {
	N = {
		p: N,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: qn,
		l: ze && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ue(e) {
	var t = N, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) bn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, N = t.p, We(e);
}
function We(e = {}) {
	return i(e, re, { value: !0 }), e;
}
function Ge() {
	return !ze || N !== null && N.l === null;
}
// ../node_modules/svelte/src/internal/client/dom/task.js
var Ke = [];
function qe() {
	var e = Ke;
	Ke = [], p(e);
}
function Je(e) {
	if (Ke.length === 0 && !St) {
		var t = Ke;
		queueMicrotask(() => {
			t === Ke && qe();
		});
	}
	Ke.push(e);
}
function Ye() {
	for (; Ke.length > 0;) qe();
}
// ../node_modules/svelte/src/internal/client/reactivity/status.js
var Xe = ~(g | _ | h);
function Ze(e, t) {
	e.f = e.f & Xe | t;
}
function Qe(e) {
	e.f & 512 || e.deps === null ? Ze(e, h) : Ze(e, _);
}
// ../node_modules/svelte/src/internal/client/reactivity/utils.js
function $e(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), Ze(e, h);
}
// ../node_modules/svelte/src/internal/client/dom/elements/misc.js
function et(e) {
	A && /* @__PURE__ */ an(e) !== null && cn(e);
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
	var t = Wn, n = qn;
	Kn(null), Jn(null);
	try {
		return e();
	} finally {
		Kn(t), Jn(n);
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
	let i = Ge() ? lt : P;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = qn, c = ot(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
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
	var e = qn, t = Wn, n = N, r = F;
	return function(i = !0) {
		Jn(e), Kn(t), Ve(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function st(e = !0) {
	Jn(null), Kn(null), Ve(null), e && F?.deactivate();
}
function ct() {
	var e = qn, t = e.b, n = F, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function lt(e) {
	var t = 2 | g;
	return qn !== null && (qn.f |= C), {
		ctx: N,
		deps: null,
		effects: null,
		equals: Ce,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: fe,
		wv: 0,
		parent: qn,
		ac: null
	};
}
var ut = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function dt(e, t, n) {
	let r = qn;
	r === null && De();
	var i = void 0, a = zt(fe), o = !Wn, s = /* @__PURE__ */ new Set();
	return En(() => {
		var t = qn, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== D && n.reject(e);
			}).finally(st);
		} catch (e) {
			n.reject(e), st();
		}
		var c = F;
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
	return Xn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e) {
	let t = /* @__PURE__ */ lt(e);
	return t.equals = Te, t;
}
function pt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Nn(t[n]);
	}
}
function mt(e) {
	var t, n = qn, r = e.parent;
	if (!Hn && r !== null && e.v !== fe && r.f & 24576) return me(), e.v;
	Jn(r);
	try {
		pt(e), t = cr(e);
	} finally {
		Jn(n);
	}
	return t;
}
function ht(e) {
	var t = mt(e);
	!e.equals(t) && (e.wv = ar(), (!F?.is_fork || e.deps === null) && (F === null ? e.v = t : (F.capture(e, t, !0), yt?.capture(e, t, !0)), e.deps === null)) ? Ze(e, h) : Hn || (bt === null ? Qe(e) : (_n() || F?.is_fork) && bt.set(e, t));
}
function gt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && rt(() => {
		t.ac.abort(D), t.ac = null;
	}), t.fn !== null && (t.teardown = d), dr(t, 0), jn(t));
}
function _t(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && fr(t);
}
// ../node_modules/svelte/src/internal/client/reactivity/batch.js
var vt = null, F = null, yt = null, bt = null, xt = null, St = !1, Ct = !1, wt = null, Tt = null, Et = 0, Dt = 1, Ot = class e {
	id = Dt++;
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
		vt === null ? vt = this : (vt.#n = this, this.#t = vt), vt = this;
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
			for (var r of n.d) Ze(r, g), t(r);
			for (r of n.m) Ze(r, _), t(r);
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
		for (let e of this.#u) this.#d.delete(e), Ze(e, g), this.schedule(e);
		for (let e of this.#d) Ze(e, _), this.schedule(e);
		this.apply();
		for (var t = wt = [], n = [], r = Tt = []; this.#c.length > 0;) {
			Et++ > 1e3 && (this.#S(), At());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Ft(e), this.#h() || this.discard(), t;
			}
		}
		if (F = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (wt = null, Tt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Pt(e, t);
			r.length > 0 && F.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), yt = this, Mt(n), Mt(t), yt = null, this.#s?.resolve();
			var o = F;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (Lt.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : or(r) && (i & 16 && this.#d.add(r), fr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), Ze(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), F = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) $e(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== fe && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), bt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		F = this;
	}
	deactivate() {
		F = null, bt = null;
	}
	flush() {
		try {
			Ct = !0, F = this, this.#_();
		} finally {
			Et = 0, xt = null, wt = null, Tt = null, Ct = !1, F = null, bt = null, Lt.clear();
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
		this.#m || (this.#m = !0, Je(() => {
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
		if (F === null) {
			let t = F = new e();
			!Ct && !St && Je(() => {
				t.#e || t.flush();
			});
		}
		return F;
	}
	apply() {
		bt = null;
	}
	schedule(e) {
		xt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? vt = e : t.#t = e, this.linked = !1;
		}
	}
};
function kt(e) {
	var t = St, n = yt;
	yt = null, St = !0;
	try {
		var r;
		for (e && (kt(), r = e());;) {
			if (Ye(), F === null) return r;
			F.flush();
		}
	} finally {
		St = t, yt = n;
	}
}
function At() {
	try {
		Me();
	} catch (e) {
		pn(e, xt);
	}
}
var jt = null;
function Mt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && or(r) && (jt = /* @__PURE__ */ new Set(), fr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Fn(r), jt?.size > 0)) {
				Lt.clear();
				for (let e of jt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) jt.has(n) && (jt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || fr(n);
					}
				}
				jt.clear();
			}
		}
		jt = null;
	}
}
function Nt(e) {
	F.schedule(e);
}
function Pt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), Ze(e, h);
		for (var n = e.first; n !== null;) Pt(n, t), n = n.next;
	}
}
function Ft(e) {
	Ze(e, h);
	for (var t = e.first; t !== null;) Ft(t), t = t.next;
}
// ../node_modules/svelte/src/internal/client/reactivity/sources.js
var It = /* @__PURE__ */ new Set(), Lt = /* @__PURE__ */ new Map(), Rt = !1;
function zt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ce,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Bt(e, t) {
	let n = zt(e, t);
	return Xn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function I(e, t = !1, n = !0) {
	let r = zt(e);
	return t || (r.equals = Te), ze && n && N !== null && N.l !== null && (N.l.s ??= []).push(r), r;
}
function Vt(e, t) {
	return L(e, U(() => H(e))), t;
}
function L(e, t, n = !1) {
	return Wn !== null && (!Gn || Wn.f & 131072) && Ge() && Wn.f & 4325394 && (Yn === null || !Yn.has(e)) && Le(), Wt(e, n ? Yt(t) : t, Tt);
}
var Ht = null, Ut = 0;
function Wt(e, t, n = null) {
	if (!e.equals(t)) {
		Hn ? Lt.set(e, t) : Lt.has(e) || Lt.set(e, e.v);
		var r = Ot.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && mt(t), bt === null && Qe(t);
		}
		e.wv = ar(), Ht = null, Ut = 0, Jt(e, g, n), Ht = null, Ge() && qn !== null && qn.f & 1024 && !(qn.f & 96) && ($n === null ? er([e]) : $n.push(e)), !r.is_fork && It.size > 0 && !Rt && Gt();
	}
	return t;
}
function Gt() {
	Rt = !1;
	for (let e of It) {
		e.f & 1024 && Ze(e, _);
		let t;
		try {
			t = or(e);
		} catch {
			t = !0;
		}
		t && fr(e);
	}
	It.clear();
}
function Kt(e, t = 1) {
	var n = H(e);
	return L(e, t === 1 ? ++n : --n);
}
function qt(e) {
	L(e, e.v + 1);
}
function Jt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ge(), a = r.length;
		if (Ut += a, Ut > 1e5 && Ht === null && (Ht = /* @__PURE__ */ new Set()), Ht !== null) {
			if (Ht.has(e)) return;
			Ht.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== qn) {
				var l = (c & g) === 0;
				if (l && Ze(s, t), c & 131072) It.add(s);
				else if (c & 2) {
					var u = s;
					bt?.delete(u), Jt(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && jt !== null && jt.add(d), n === null ? Nt(d) : n.push(d);
				}
			}
		}
	}
}
function Yt(t) {
	if (typeof t != "object" || !t || ne in t || re in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Bt(0), u = null, d = rr, f = (e) => {
		if (rr === d) return e();
		var t = Wn, n = rr;
		Kn(null), ir(d);
		var r = e();
		return Kn(t), ir(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Bt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Fe();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Bt(n.value, u);
				return r.set(t, e), e;
			}) : L(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Bt(fe, u));
					r.set(t, e), qt(o);
				}
			} else L(n, fe), qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === ne) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Bt(Yt(s ? e[n] : fe), u)), r.set(n, o)), o !== void 0) {
				var c = H(o);
				return c === fe ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = H(i);
				if (a === fe) return;
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
			var n = r.get(t), i = n !== void 0 && n.v !== fe || Reflect.has(e, t);
			return (n !== void 0 || qn !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Bt(i ? Yt(e[t]) : fe, u)), r.set(t, n)), H(n) === fe) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Bt(fe, u)), r.set(d + "", p)) : L(p, fe);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Bt(void 0, u)), L(c, Yt(n)), r.set(t, c));
			else {
				l = c.v !== fe;
				var m = f(() => Yt(n));
				L(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && L(g, _ + 1);
				}
				qt(o);
			}
			return !0;
		},
		ownKeys(e) {
			H(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== fe;
			});
			for (var [n, i] of r) i.v !== fe && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Ie();
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
function R(e, t) {
	if (!A) return /* @__PURE__ */ an(e);
	var n = /* @__PURE__ */ an(j);
	if (n === null) n = j.appendChild(rn());
	else if (t && n.nodeType !== 3) {
		var r = rn();
		return n?.before(r), ve(r), r;
	}
	return t && dn(n), ve(n), n;
}
function sn(e, t = !1) {
	if (!A) {
		var n = /* @__PURE__ */ an(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ on(n) : n;
	}
	if (t) {
		if (j?.nodeType !== 3) {
			var r = rn();
			return j?.before(r), ve(r), r;
		}
		dn(j);
	}
	return j;
}
function z(e, t = !1) {
	if (!A) return /* @__PURE__ */ an(e);
	var n = R(e, t);
	return M(e), n;
}
function B(e, t = 1, n = !1) {
	let r = A ? j : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ on(r);
	if (!A) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = rn();
			return r === null ? i?.after(a) : r.before(a), ve(a), a;
		}
		dn(r);
	}
	return ve(r), r;
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
	var t = qn;
	if (t === null) return Wn.f |= te, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	pn(e, t);
}
function pn(e, t) {
	if (e === O) throw e;
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
	qn === null && (Wn === null && je(e), Ae()), Hn && ke(e);
}
function hn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function gn(e, t) {
	var n = qn;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: N,
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
	F?.register_created_effect(r);
	var i = r;
	if (e & 4) wt === null ? Ot.ensure().schedule(r) : wt.push(r);
	else if (t !== null) {
		try {
			fr(r);
		} catch (e) {
			throw Nn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && hn(i, n), Wn !== null && Wn.f & 2 && !(e & 64))) {
		var a = Wn;
		(a.effects ??= []).push(i);
	}
	return r;
}
function _n() {
	return Wn !== null && !Gn;
}
function vn(e) {
	let t = gn(8, null);
	return Ze(t, h), t.teardown = e, t;
}
function yn(e) {
	mn("$effect");
	var t = qn.f;
	if (!Wn && t & 32 && N !== null && !N.i) {
		var n = N;
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
	Ot.ensure();
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
	var n = N, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Dn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = qn;
			try {
				Jn(n.parent), U(t);
			} finally {
				Jn(n);
			}
		}
	});
}
function Tn() {
	var e = N;
	Dn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && Ze(n, _), or(n) && fr(n), t.ran = !1;
		}
	});
}
function En(e) {
	return gn(ee | C, e);
}
function Dn(e, t = 0) {
	return gn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
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
		let n = Hn, r = Wn;
		Un(!0), Kn(null);
		try {
			t.call(null);
		} catch (t) {
			pn(t, e.parent);
		} finally {
			Un(n), Kn(r);
		}
	}
}
function jn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && rt(() => {
			e.abort(D);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Pn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, jn(e, t && !n), dr(e, 0);
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
		e.f ^= v, e.f & 1024 || (Ze(e, g), Ot.ensure().schedule(e));
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
var Wn = null, Gn = !1;
function Kn(e) {
	Wn = e;
}
var qn = null;
function Jn(e) {
	qn = e;
}
var Yn = null;
function Xn(e) {
	Wn !== null && (Wn.f & 2097152 || Wn.f & 2) && (Yn ??= /* @__PURE__ */ new Set()).add(e);
}
var Zn = null, Qn = 0, $n = null;
function er(e) {
	$n = e;
}
var tr = 1, nr = 0, rr = nr;
function ir(e) {
	rr = e;
}
function ar() {
	return ++tr;
}
function or(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (or(a) && ht(a), a.wv > e.wv) return !0;
		}
		t & 512 && bt === null && Ze(e, h);
	}
	return !1;
}
function sr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Yn !== null && Yn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? sr(a, t, !1) : t === a && (n ? Ze(a, g) : a.f & 1024 && Ze(a, _), Nt(a));
	}
}
function cr(e) {
	var t = Zn, n = Qn, r = $n, i = Wn, a = Yn, o = N, s = Gn, c = rr, l = e.f;
	Zn = null, Qn = 0, $n = null, Wn = l & 96 ? null : e, Yn = null, Ve(e.ctx), Gn = !1, rr = ++nr, e.ac !== null && (rt(() => {
		e.ac.abort(D);
	}), e.ac = null);
	try {
		e.f |= E;
		var u = e.fn, d = u();
		e.f |= b;
		var f = lr(e);
		if (Ge() && $n !== null && !Gn && f !== null && !(e.f & 6146)) for (var p = 0; p < $n.length; p++) sr($n[p], e);
		if (i !== null && i !== e) {
			if (nr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = nr;
			if (t !== null) for (let e of t) e.rv = nr;
			$n !== null && (r === null ? r = $n : r.push(...$n));
		}
		return e.f & 8388608 && (e.f ^= te), d;
	} catch (t) {
		return lr(e), fn(t);
	} finally {
		e.f ^= E, Zn = t, Qn = n, $n = r, Wn = i, Yn = a, Ve(o), Gn = s, rr = c;
	}
}
function lr(e) {
	var t = e.deps, n = F?.is_fork;
	if (Zn !== null) {
		var r;
		if (n || dr(e, Qn), t !== null && Qn > 0) for (t.length = Qn + Zn.length, r = 0; r < Zn.length; r++) t[Qn + r] = Zn[r];
		else e.deps = t = Zn;
		if (_n() && e.f & 512) for (r = Qn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Qn < t.length && (dr(e, Qn), t.length = Qn);
	return t;
}
function ur(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Zn === null || !n.call(Zn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== fe && Qe(s), s.ac !== null && rt(() => {
			s.ac.abort(D), s.ac = null, Ze(s, g);
		}), gt(s), dr(s, 0);
	}
}
function dr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ur(e, n[r]);
}
function fr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		Ze(e, h);
		var n = qn;
		qn = e;
		try {
			t & 16777232 ? Mn(e) : jn(e), An(e);
			var r = cr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = tr;
		} finally {
			qn = n;
		}
	}
}
async function pr() {
	await Promise.resolve(), kt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (Vn?.add(e), Wn !== null && !Gn && !(qn !== null && qn.f & 16384) && (Yn === null || !Yn.has(e))) {
		var r = Wn.deps;
		if (Wn.f & 2097152) e.rv < nr && (e.rv = nr, Zn === null && r !== null && r[Qn] === e ? Qn++ : Zn === null ? Zn = [e] : Zn.push(e));
		else {
			Wn.deps ??= [], n.call(Wn.deps, e) || Wn.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [Wn] : n.call(i, Wn) || i.push(Wn);
		}
	}
	if (Hn && Lt.has(e)) return Lt.get(e);
	if (t) {
		var a = e;
		if (Hn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || hr(a)) && (o = mt(a)), Lt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Gn && Wn !== null && !!(Wn.f & 512), c = (a.f & b) === 0;
		or(a) && (s && (a.f |= 512), ht(a)), s && !c && (_t(a), mr(a));
	}
	if (bt?.has(e)) return bt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function mr(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (_t(r), mr(r));
	}
}
function hr(e) {
	if (e.v === fe) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Lt.has(t) || t.f & 2 && hr(t)) return !0;
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
		if (ne in e) gr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ne in n && gr(n);
		}
	}
}
function gr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			gr(e[n], t);
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
var _r = ["touchstart", "touchmove"];
function vr(e) {
	return _r.includes(e);
}
// ../node_modules/svelte/src/internal/client/dom/elements/events.js
var yr = Symbol("events"), br = /* @__PURE__ */ new Set(), xr = /* @__PURE__ */ new Set();
function Sr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Dr.call(t, e), !e.cancelBubble) return rt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Je(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Cr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Sr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && vn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[yr] ??= {})[e] = n;
}
function wr(e) {
	for (var t = 0; t < e.length; t++) br.add(e[t]);
	for (var n of xr) n(e);
}
var Tr = null, Er = !1;
function Dr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Tr = e, Er || (Er = !0, setTimeout(() => {
		Er = !1, Tr = null;
	}));
	var s = 0, c = Tr === e && e[yr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[yr] = t;
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
		var d = Wn, f = qn;
		Kn(null), Jn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[yr]?.[r];
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
			e[yr] = t, delete e.currentTarget, Kn(d), Jn(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var Or = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function kr(e) {
	return Or?.createHTML(e) ?? e;
}
function Ar(e) {
	var t = un("template");
	return t.innerHTML = kr(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function jr(e, t) {
	var n = qn;
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
		if (A) return jr(j, null), j;
		i === void 0 && (i = Ar(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ an(i)));
		var t = r || $t ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ an(t), s = t.lastChild;
			jr(o, s);
		} else jr(t, t);
		return t;
	};
}
function Mr(e = "") {
	if (!A) {
		var t = rn(e + "");
		return jr(t, t), t;
	}
	var n = j;
	return n.nodeType === 3 ? dn(n) : (n.before(n = rn()), ve(n)), jr(n, n), n;
}
function Nr() {
	if (A) return jr(j, null), j;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = rn();
	return e.append(t, n), jr(t, n), e;
}
function q(e, t) {
	if (A) {
		var n = qn;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = j), ye();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function Pr(e) {
	let t = 0, n = zt(0), r;
	return () => {
		_n() && (H(n), Dn(() => (t === 0 && (r = U(() => e(() => qt(n)))), t += 1, () => {
			Je(() => {
				--t, t === 0 && (r?.(), r = void 0, qt(n));
			});
		})));
	};
}
// ../node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Fr = S | C;
function Ir(e, t, n, r) {
	new Lr(e, t, n, r);
}
var Lr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = A ? j : null;
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
	#h = Pr(() => (this.#m = zt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = qn;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = qn.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = On(() => {
			if (A) {
				let e = Se(this.#t);
				ye();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Fr), A && (this.#e = j);
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
		Je(r), t && (this.#s = kn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? ge() : (t = !0, n && Re(), this.#s !== null && In(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = kn(() => e(this.#e)), Je(() => {
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
				}), this.#a === null ? (this.#c = null, n && this.#S(F)) : this.#u === 0 && (this.#e.before(e), this.#c = null, In(this.#o, () => {
					this.#o = null;
				}), this.#S(F));
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
			} else this.#S(F);
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
		var t = qn, n = Wn, r = N;
		Jn(this.#i), Kn(this.#i), Ve(this.#i.ctx);
		try {
			return Ot.ensure(), e();
		} finally {
			Jn(t), Kn(n), Ve(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && In(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Je(() => {
			this.#d = !1, this.#m && Wt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), H(this.#m);
	}
	error(e) {
		if (e === O || !this.#n.onerror && !this.#n.failed) throw e;
		F?.is_fork ? (this.#a && F.skip_effect(this.#a), this.#o && F.skip_effect(this.#o), this.#s && F.skip_effect(this.#s), F.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (Nn(this.#a), null), this.#o &&= (Nn(this.#o), null), this.#s &&= (Nn(this.#s), null), A && (ve(this.#t), be(), ve(xe()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return kn(() => {
						var r = qn;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return pn(e, this.#i.parent), null;
				}
			}));
		};
		Je(() => {
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
function Rr(e, t) {
	return Br(e, t);
}
var zr = /* @__PURE__ */ new Map();
function Br(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	nn();
	var l = void 0, u = Sn(() => {
		var s = n ?? t.appendChild(rn());
		Ir(s, { pending: () => {} }, (t) => {
			He({});
			var n = N;
			if (o && (n.c = o), a && (i.$$events = a), A && jr(t, null), l = e(t, i) || We(), A && (qn.nodes.end = j, j === null || j.nodeType !== 8 || j.data !== "]")) throw he(), O;
			Ue();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = vr(r);
					for (let e of [t, document]) {
						var a = zr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), zr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Dr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(br)), xr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = zr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Dr), r.delete(e), r.size === 0 && zr.delete(n)) : r.set(e, i);
			}
			xr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Vr.set(l, u), l;
}
var Vr = /* @__PURE__ */ new WeakMap(), Hr = class {
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
		var n = F, r = ln();
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
		} else A && (this.anchor = j), this.#a(n);
	}
};
// ../node_modules/svelte/src/internal/client/dom/blocks/if.js
function Y(e, t, n = !1) {
	var r;
	A && (r = j, ye());
	var i = new Hr(e), a = n ? S : 0;
	function o(e, t) {
		if (A) {
			var n = Se(r);
			if (e !== parseInt(n.substring(1))) {
				var a = xe();
				ve(a), i.anchor = a, _e(!1), i.ensure(e, t), _e(!0);
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
function Ur(e, t) {
	return t;
}
function Wr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		In(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Gr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
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
		Gr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Gr(e, t, n = !0) {
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
var Kr;
function qr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = A ? ve(/* @__PURE__ */ an(u)) : u.appendChild(rn());
	}
	A && ye();
	var d = null, f = /* @__PURE__ */ P(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = H(f);
			_.fallback = d, Yr(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= T, Zr(d, null, c)) : Rn(d) : In(d, () => {
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
			A && Se(c) === "[!" != (t === 0) && (c = xe(), ve(c), _e(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = F, v = ln(), y = 0; y < t; y += 1) {
				A && j.nodeType === 8 && j.data === "]" && (c = j, r = !0, _e(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && Wt(S.v, b), S.i && Wt(S.i, y), v && _.unskip_effect(S.e)) : (S = Xr(l, m ? c : Kr ??= rn(), b, x, y, o, n, i), m || (S.e.f |= T), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = kn(() => s(c)) : (d = kn(() => s(Kr ??= rn())), d.f |= T)), t > u.size && Oe("", "", ""), A && t > 0 && ve(xe()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && _e(!0), H(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, A && (c = j);
}
function Jr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Yr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Jr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Rn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= T, _ === l) Zr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Qr(e, d, _), Qr(e, _, y), Zr(_, y, n), d = _, p = [], m = [], l = Jr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Zr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Qr(e, S.prev, C.next), Qr(e, d, S), Qr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Zr(_, l, n), Qr(e, _.prev, _.next), Qr(e, _, d === null ? e.effect.first : d.next), Qr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Jr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Jr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Gr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Jr(l.next);
		var E = w.length;
		if (E > 0) {
			var ee = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.fix();
			}
			Wr(e, w, ee);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Xr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? zt(n) : /* @__PURE__ */ I(n, !1, !1) : null, l = o & 2 ? zt(i) : null;
	return {
		v: c,
		i: l,
		e: kn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Zr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ on(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Qr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// ../node_modules/svelte/src/internal/shared/attributes.js
var $r = [..." 	\n\r\f\xA0\v﻿"];
function ei(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || $r.includes(r[o - 1])) && (s === r.length || $r.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// ../node_modules/svelte/src/internal/client/dom/elements/class.js
function ti(e, t, n, r, i, a) {
	var o = e[se];
	if (A || o !== n || o === void 0) {
		var s = ei(n, r, a);
		A && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[se] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ni(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ri(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = si(c);
			ni(c, i ? a.includes(l) : Zt(l, r));
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
function ii(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return k();
		for (var i of t.options) i.selected = n.includes(si(i));
	} else {
		for (i of t.options) if (Zt(si(i), n)) {
			i.selected = !0;
			return;
		}
		r && n === void 0 || (t.selectedIndex = -1);
	}
}
function ai(e) {
	var t = new MutationObserver((t) => {
		t.every(ci) || ("__defaultValue" in e && ri(e, !1), "__value" in e && ii(e, e.__value));
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
function oi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	it(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), si);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && si(o);
		}
		n(a), e.__value = a, F !== null && r.add(F);
	}), Cn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = F;
			if (r.has(o)) return;
		}
		if (ii(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = si(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function si(e) {
	return "__value" in e ? e.__value : e.value;
}
function ci(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// ../node_modules/svelte/src/internal/client/dom/elements/attributes.js
var li = Symbol("is custom element"), ui = Symbol("is html"), di = de ? "link" : "LINK", fi = de ? "progress" : "PROGRESS";
function pi(e) {
	if (A) {
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
		e[ue] = n, Je(n), nt();
	}
}
function mi(e, t) {
	var n = gi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === fi) && (e.value = t ?? "");
}
function hi(e, t) {
	var n = gi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function X(e, t, n, r) {
	var i = gi(e);
	A && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === di) || i[t] !== (i[t] = n) && (t === "loading" && (e[ae] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && vi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function gi(e) {
	return e[oe] ??= {
		[li]: e.nodeName.includes("-"),
		[ui]: e.namespaceURI === pe
	};
}
var _i = /* @__PURE__ */ new Map();
function vi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = _i.get(t);
	if (n) return n;
	_i.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function yi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	it(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = xi(e) ? Si(a) : a, n(a), F !== null && r.add(F), await pr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (A && e.defaultValue !== e.value || U(t) == null && e.value) && (n(xi(e) ? Si(e.value) : e.value), F !== null && r.add(F)), Dn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = F;
			if (r.has(i)) return;
		}
		xi(e) && n === Si(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function bi(e, t, n = t) {
	it(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (A && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), Dn(() => {
		e.checked = !!t();
	});
}
function xi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Si(e) {
	return e === "" ? null : +e;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ci(e, t) {
	return e === t || e?.[ne] === t;
}
function wi(e = We(), t, n, r) {
	var i = N.r, a = qn;
	return Cn(() => {
		var o, s;
		return Dn(() => {
			o = s, s = r?.() || [], U(() => {
				Ci(n(...s), e) || (t(e, ...s), o && Ci(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ci(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Ti(e = !1) {
	let t = N, n = t.l.u;
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
		Ei(t, r), p(n.b);
	}), yn(() => {
		let e = U(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && yn(() => {
		Ei(t, r), p(n.a);
	});
}
function Ei(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function Di(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = U(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var Oi = [];
function ki(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (we(e, t) && (e = t, n)) {
			let t = !Oi.length;
			for (let t of r) t[1](), Oi.push(t, e);
			if (t) {
				for (let e = 0; e < Oi.length; e += 2) Oi[e][0](Oi[e + 1]);
				Oi.length = 0;
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
function Ai(e) {
	let t;
	return Di(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var ji = !1, Mi = Symbol("unmounted");
function Ni(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ I(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(Mi in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = Di(e, (e) => {
				i ? r.source.v = e : L(r.source, e);
			}), i = !1;
		}
	}
	return e && Mi in n ? Ai(e) : H(r.source);
}
function Pi() {
	let e = {};
	function t() {
		vn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Mi, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Fi(e) {
	var t = ji;
	try {
		return ji = !1, [e(), ji];
	} finally {
		ji = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function Z(e, t, n, r) {
	var i = !ze || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ lt(r), H(u)) : (l && (l = !1, c = s ? U(r) : r), c);
	let f;
	if (o) {
		var p = ne in e || ie in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Fi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Pe(t), f(m)));
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
	var v = !1, y = (n & 1 ? lt : P)(() => (v = !1, g()));
	o && H(y);
	var b = qn;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && o ? Yt(e) : e;
			return L(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Hn && v || b.f & 16384 ? y.v : H(y);
	});
}
function Ii(e) {
	N === null && Ee("onMount"), ze && N.l !== null ? Bi(N).m.push(e) : yn(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function Li(e) {
	N === null && Ee("onDestroy"), Ii(() => () => U(e));
}
function Ri(e) {
	N === null && Ee("beforeUpdate"), N.l === null && Ne("beforeUpdate"), Bi(N).b.push(e);
}
function zi(e) {
	N === null && Ee("afterUpdate"), N.l === null && Ne("afterUpdate"), Bi(N).a.push(e);
}
function Bi(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
// ../node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Be();
// src/controller.ts
var Vi = "keida-hub-reborn", Hi = "reborn-workspace-v1", Ui = 9223372036854775807n, Wi = () => [
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
], Gi = (e) => e === "note" ? "Workspace note" : e === "connections" ? "Connections" : "Pinned services", Ki = () => ({
	phase: "idle",
	entries: [],
	through: "0",
	next: null,
	category: "all",
	query: "",
	message: ""
}), qi = () => ({
	phase: "idle",
	message: ""
}), Ji = () => ({
	phase: "idle",
	entries: [],
	revision: "0",
	through: "0",
	next: null,
	message: ""
}), Yi = ["jellyfin", "seerr"], Xi = () => ({
	jellyfin: {
		phase: "idle",
		save: "idle",
		message: ""
	},
	seerr: {
		phase: "idle",
		save: "idle",
		message: ""
	}
}), Zi = [
	"sonarr",
	"radarr",
	"qbittorrent"
], Qi = {
	sonarr: "sonarr-v3",
	radarr: "radarr-v3",
	qbittorrent: "qbittorrent-v2-key"
}, $i = () => ({
	phase: "idle",
	offset: 0,
	save: "idle",
	message: ""
}), ea = () => ({
	sonarr: $i(),
	radarr: $i(),
	qbittorrent: $i()
}), ta = () => ({
	phase: "idle",
	save: "idle",
	message: ""
}), na = () => ({
	phase: "idle",
	save: "idle",
	message: ""
}), ra = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1,
	directorySave: "idle",
	directoryMessage: "",
	activity: Ki(),
	notificationSave: "idle",
	notificationMessage: "",
	layoutSave: "idle",
	layoutMessage: "",
	guide: qi(),
	observations: Ji(),
	media: Xi(),
	queues: ea(),
	identity: ta(),
	sessions: na()
}), Q = (e) => typeof e == "object" && !!e && !Array.isArray(e), $ = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= Ui && (!t || e !== "0"), ia = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096, aa = (e, t, n = !1) => typeof e == "string" && (!n || e.trim().length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e), oa = (e, t, n) => Array.isArray(e) && e.length <= t && e.every((e) => aa(e, n, !0)), sa = (e) => $(e) && BigInt(e) <= 253402300799n, ca = [
	"unavailable",
	"invalid_configuration",
	"timeout",
	"transport",
	"denied",
	"provider_error",
	"oversized",
	"malformed",
	"not_discovered"
], la = (e) => e === null || typeof e == "string" && ca.includes(e), ua = (e) => e === null || typeof e == "number" && Number.isSafeInteger(e) && e >= 0 && e <= 1e6;
function da(e) {
	if (typeof e != "string" || new TextEncoder().encode(e).length > 1024 || !/^https:\/\/[^/]/.test(e) || /[\s\u0000-\u001f\u007f\\]/u.test(e)) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "https:" && !!t.hostname && !t.username && !t.password && !e.includes("?") && !e.includes("#");
	} catch {
		return !1;
	}
}
function fa(e) {
	if (!Q(e) || !Array.isArray(e.groups) || e.groups.length > 2 || !Number.isInteger(e.unread_groups) || new Set(e.groups.map((e) => Q(e) ? e.category : null)).size !== e.groups.length || e.groups.some((e) => !Q(e) || !["services", "connections"].includes(String(e.category)) || !$(e.revision, !0) || !$(e.read_through) || !$(e.unread) || BigInt(e.read_through) > BigInt(e.revision) || BigInt(e.unread) !== BigInt(e.revision) - BigInt(e.read_through) || !Q(e.latest) || !$(e.latest.source_revision, !0) || !$(e.latest.occurred_at) || BigInt(e.latest.occurred_at) > 253402300799n || typeof e.latest.label != "string" || !/^[A-Za-z ]{1,64}$/.test(e.latest.label) || !(e.category === "services" ? [
		"service_added",
		"service_updated",
		"service_removed"
	] : ["connection_saved", "connection_removed"]).includes(String(e.latest.kind))) || e.unread_groups !== e.groups.filter((e) => e.unread !== "0").length) throw Error("Invalid notification response");
	return e;
}
function pa(e) {
	if (!Q(e) || !$(e.revision) || !Array.isArray(e.panels) || e.panels.length !== 3 || e.panels.some((e) => !Q(e) || ![
		"note",
		"connections",
		"pins"
	].includes(String(e.id)) || typeof e.visible != "boolean") || new Set(e.panels.map((e) => e.id)).size !== 3 || !e.panels.some((e) => e.visible)) throw Error("Invalid layout response");
	return e;
}
function ma(e) {
	let t = [
		"crafty",
		"jellyfin",
		"seerr",
		"sonarr",
		"radarr",
		"qbittorrent",
		"discord"
	], n = e.catalog, r = e.roadmap;
	if (!Array.isArray(n) || n.length !== t.length || new Set(n.map((e) => Q(e) ? e.id : null)).size !== t.length || n.some((e) => !Q(e) || !t.includes(String(e.id)) || !aa(e.name, 80, !0) || e.status !== ([
		"crafty",
		"jellyfin",
		"seerr",
		"sonarr",
		"radarr",
		"qbittorrent"
	].includes(String(e.id)) ? "available" : "planned") || !aa(e.summary, 512, !0) || !oa(e.requirements, 8, 512) || !oa(e.capabilities, 8, 512)) || !Q(r) || typeof r.as_of != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(r.as_of) || !aa(r.intro, 1024, !0) || !oa(r.priorities, 8, 512) || r.tracker_url !== "https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2" || !Array.isArray(r.milestones) || r.milestones.length !== 9 || r.milestones.some((e, t) => !Q(e) || e.id !== `M${t}` || !aa(e.title, 120, !0) || !aa(e.status, 160, !0) || !oa(e.delivered, 8, 512) || !oa(e.remaining, 8, 512))) throw Error("Invalid workspace guide");
	return {
		catalog: n,
		roadmap: r
	};
}
function ha(e, t, n) {
	if (!$(e.current_revision) || !$(e.through) || e.next_before !== null && !$(e.next_before, !0) || n && (e.current_revision !== t.revision || e.through !== t.through) || !Array.isArray(e.entries) || e.entries.length > 25 || e.entries.some((r) => !Q(r) || !$(r.id, !0) || !$(r.revision, !0) || !sa(r.checked_at) || !la(r.error) || typeof r.complete != "boolean" || !Array.isArray(r.servers) || r.servers.length > 8 || BigInt(r.id) > BigInt(e.through) || n && BigInt(r.id) >= BigInt(t.next) || r.servers.some((e) => !Q(e) || !aa(e.name, 80, !0) || ![
		"running",
		"stopped",
		"unknown"
	].includes(String(e.state)) || !ua(e.players) || !ua(e.capacity) || e.collected_at !== null && !sa(e.collected_at) || e.provider_at !== null && !sa(e.provider_at) || ![
		"fresh",
		"stale",
		"unknown"
	].includes(String(e.freshness)) || !la(e.error))) || e.entries.some((t, n) => n > 0 && BigInt(t.id) >= BigInt(e.entries[n - 1].id)) || e.next_before !== null && (e.entries.length !== 25 || e.next_before !== e.entries.at(-1)?.id)) throw Error("Invalid observation history");
	return {
		phase: "ready",
		entries: e.entries,
		revision: e.current_revision,
		through: e.through,
		next: e.next_before,
		message: "Retained provider observations checked."
	};
}
var ga = (e) => typeof e == "string" && /^[1-9][0-9]{0,19}$/.test(e) && BigInt(e) <= 18446744073709551615n, _a = (e) => aa(e, 320) && e.length > 0 && Array.from(e).length <= 80 && !/^[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/u.test(e) && !/[\u0080-\u009f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u.test(e), va = (e) => Q(e) && ga(e.id) && _a(e.display_name), ya = [
	"denied",
	"invalid_response",
	"timeout",
	"transport",
	"provider_error",
	"unavailable",
	"restart_required"
];
function ba(e) {
	let t = e.application, n = e.link, r = e.attempt;
	if (!Q(t) || typeof t.configured != "boolean" || !$(t.revision) || t.profile !== "discord-identify-v1" || t.callback_uri !== `${window.location.origin}/account/discord/callback` || !Q(n) || !$(n.revision) || !$(n.flow_generation) || !(n.identity === null || Q(n.identity) && sa(n.identity.verified_at) && va(n.identity)) || !Q(r) || ![
		"none",
		"awaiting_discord",
		"ready_to_review",
		"reviewing",
		"review_ready",
		"cancelled",
		"failed",
		"restart_required"
	].includes(String(r.phase)) || !(r.candidate === null || va(r.candidate)) || r.cleanup !== null && r.cleanup !== "acknowledged" && r.cleanup !== "unconfirmed" || !(r.error === null || typeof r.error == "string" && ya.includes(r.error)) || r.candidate !== null && r.phase !== "review_ready" || r.phase === "review_ready" && r.candidate === null || n.identity !== null && r.candidate !== null) throw Error("Invalid identity response");
	return {
		application: {
			configured: t.configured,
			revision: t.revision,
			callback_uri: t.callback_uri,
			profile: "discord-identify-v1"
		},
		link: {
			revision: n.revision,
			flow_generation: n.flow_generation,
			identity: n.identity === null ? null : {
				id: n.identity.id,
				display_name: n.identity.display_name,
				verified_at: n.identity.verified_at
			}
		},
		attempt: {
			phase: r.phase,
			candidate: r.candidate === null ? null : {
				id: r.candidate.id,
				display_name: r.candidate.display_name
			},
			cleanup: r.cleanup,
			error: r.error
		}
	};
}
var xa = (e) => e.attempt.phase === "review_ready" ? "Review the Discord identity below, then confirm deliberately." : e.attempt.phase === "ready_to_review" ? "Discord returned. Review the identity before choosing whether to link it." : e.attempt.phase === "awaiting_discord" ? "Continue with Discord in this browser, or cancel this unfinished link." : e.attempt.phase === "reviewing" ? "The identity review is still in progress. Check status before another action." : ["failed", "restart_required"].includes(e.attempt.phase) ? "The unfinished link could not be completed. Start a new link when ready." : e.attempt.phase === "cancelled" ? "The unfinished link was cancelled." : e.link.identity ? "Your saved Discord identity is shown below." : e.application.configured ? "No Discord identity is linked. You can start a link when ready." : "Discord linking is waiting for owner setup.", Sa = (e) => typeof e == "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(e);
function Ca(e) {
	if (!sa(e.checked_at) || !Array.isArray(e.sessions) || e.sessions.length < 1 || e.sessions.length > 32 || e.sessions.some((t) => !Q(t) || !Sa(t.id) || !sa(t.created_at) || !sa(t.expires_at) || typeof t.current != "boolean" || BigInt(t.expires_at) <= BigInt(e.checked_at) || BigInt(t.expires_at) <= BigInt(t.created_at)) || new Set(e.sessions.map((e) => e.id)).size !== e.sessions.length || e.sessions.filter((e) => e.current === !0).length !== 1 || e.sessions.some((e, t, n) => t > 0 && (BigInt(e.created_at) > BigInt(n[t - 1].created_at) || e.created_at === n[t - 1].created_at && e.id >= n[t - 1].id))) throw Error("Invalid session list");
	return {
		checked_at: e.checked_at,
		sessions: e.sessions.map((e) => ({
			id: e.id,
			created_at: e.created_at,
			expires_at: e.expires_at,
			current: e.current
		}))
	};
}
var wa = (e, t) => e.length === t.length && e.every((e, n) => e.id === t[n].id && e.visible === t[n].visible);
function Ta(e) {
	if (!Q(e) || e.product !== Vi || e.contract !== Hi || e.schema !== 1 || !Q(e.account) || !$(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !$(e.session_generation) || !Q(e.note) || !ia(e.note.body) || !$(e.note.revision)) throw Error("Invalid workspace response");
	let t = e.directory, n = (e, t, n = !1) => typeof e == "string" && (!n || e.length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e);
	if (!Q(t) || !$(t.revision) || !$(t.pins_revision) || !Array.isArray(t.services) || t.services.length > 100 || t.services.some((e) => !Q(e) || !$(e.id, !0) || !n(e.name, 80, !0) || !n(e.category, 40, !0) || !n(e.description, 240) || !da(e.url)) || new Set(t.services.map((e) => e.id)).size !== t.services.length || !Array.isArray(t.pins) || t.pins.length > 24 || new Set(t.pins).size !== t.pins.length || t.pins.some((e) => !$(e, !0) || !t.services.some((t) => t.id === e))) throw Error("Invalid directory response");
	if (e.crafty != null) {
		let t = e.crafty, n = (e) => e === null || typeof e == "number" && Number.isSafeInteger(e) && e >= 0, r = (e) => e === null || typeof e == "string" && /^[a-z_]{1,40}$/.test(e);
		if (!Q(t) || !$(t.revision) || typeof t.configured != "boolean" || !n(t.checked_at) || !r(t.error) || t.history_error !== void 0 && t.history_error !== null && t.history_error !== "unavailable" || !Array.isArray(t.servers) || t.servers.length > 8 || t.servers.some((e) => !Q(e) || typeof e.name != "string" || e.name.length > 80 || typeof e.join != "string" || e.join.length > 253 || ![
			"running",
			"stopped",
			"unknown"
		].includes(String(e.state)) || ![
			"fresh",
			"stale",
			"unknown"
		].includes(String(e.freshness)) || !n(e.players) || !n(e.capacity) || !n(e.collected_at) || !n(e.provider_at) || !r(e.error))) throw Error("Invalid connection response");
	}
	return fa(e.notifications), pa(e.layout), e;
}
function Ea(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (Q(t) && t.schema === 1 && ia(t.body) && $(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
var Da = (e) => e === null || typeof e == "string" && [
	"checking",
	"unavailable",
	"invalid_configuration",
	"timeout",
	"transport",
	"denied",
	"provider_error",
	"oversized",
	"malformed"
].includes(e), Oa = (e, t, n = 0) => typeof e == "number" && Number.isSafeInteger(e) && e >= n && e <= t, ka = (e) => Oa(e, 48) && e % 12 == 0;
function Aa(e, t = Math.floor(Date.now() / 1e3)) {
	let n = e.checked_at, r = !Number.isFinite(t) || t < 0 || n === null || n > t + 5 ? "unknown" : e.freshness === "fresh" && t - n > 90 ? "stale" : e.freshness;
	return r === e.freshness ? e : {
		...e,
		freshness: r
	};
}
function ja(e, t, n) {
	if (!Q(e) || !$(e.revision) || typeof e.configured != "boolean" || !(e.checked_at === null || Oa(e.checked_at, 253402300799)) || ![
		"fresh",
		"stale",
		"unknown"
	].includes(String(e.freshness)) || !Da(e.error) || typeof e.complete != "boolean" || e.offset !== n || !ka(e.offset) || !(e.next_offset === null || ka(e.next_offset) && e.next_offset === n + 12) || !(e.total === null || Oa(e.total, 1e9)) || typeof e.truncated != "boolean" || !Array.isArray(e.items) || e.items.length > 12 || new Set(e.items.map((e) => Q(e) ? e.id : null)).size !== e.items.length || e.items.some((e) => !Q(e) || typeof e.id != "string" || !/^[a-f0-9]{64}$/.test(e.id) || !(e.title === null || aa(e.title, 240, !0)) || !["movie", "series"].includes(String(e.kind)) || !(e.year === null || Oa(e.year, 9999, 1)) || !Da(e.detail_error) || (t === "jellyfin" ? e.request_status !== null : ![
		"pending",
		"approved",
		"declined",
		"failed",
		"completed",
		"unknown"
	].includes(String(e.request_status)))) || (t === "seerr" ? e.playback !== null : !(e.playback === null || Q(e.playback) && (e.playback.playing === null || Oa(e.playback.playing, 256)) && (e.playback.paused === null || Oa(e.playback.paused, 256)) && Da(e.playback.error))) || !e.configured && (e.items.length !== 0 || e.complete || e.checked_at !== null || e.next_offset !== null)) throw Error("Invalid media response");
	let r = e;
	return Aa({
		revision: r.revision,
		configured: r.configured,
		checked_at: r.checked_at,
		freshness: r.freshness,
		error: r.error,
		complete: r.complete,
		offset: r.offset,
		next_offset: r.next_offset,
		total: r.total,
		truncated: r.truncated,
		items: r.items.map(({ id: e, title: t, kind: n, year: r, request_status: i, detail_error: a }) => ({
			id: e,
			title: t,
			kind: n,
			year: r,
			request_status: i,
			detail_error: a
		})),
		playback: r.playback === null ? null : {
			playing: r.playback.playing,
			paused: r.playback.paused,
			error: r.playback.error
		}
	});
}
var Ma = [
	"checking",
	"timeout",
	"transport",
	"denied",
	"rate_limited",
	"provider_error",
	"oversized",
	"malformed",
	"unsupported_profile",
	"page_moved",
	"unavailable"
], Na = [
	"unknown",
	"queued",
	"paused",
	"downloading",
	"completed",
	"failed",
	"warning",
	"delay",
	"downloadClientUnavailable",
	"fallback"
], Pa = [
	"downloading",
	"importBlocked",
	"importPending",
	"importing",
	"imported",
	"failedPending",
	"failed",
	"ignored",
	"unknown"
], Fa = [
	"error",
	"missingFiles",
	"uploading",
	"stoppedUP",
	"queuedUP",
	"stalledUP",
	"checkingUP",
	"forcedUP",
	"downloading",
	"metaDL",
	"forcedMetaDL",
	"stoppedDL",
	"queuedDL",
	"stalledDL",
	"checkingDL",
	"forcedDL",
	"checkingResumeData",
	"moving",
	"unknown"
], Ia = (e) => e === null || typeof e == "string" && Ma.includes(e), La = (e) => e === null || Oa(e, 2 ** 53 - 1);
function Ra(e, t = Math.floor(Date.now() / 1e3)) {
	let n = e.checked_at, r = !Number.isFinite(t) || t < 0 || n === null || n > t ? "unknown" : e.freshness === "fresh" && t - n > 90 ? "stale" : e.freshness;
	return r === e.freshness ? e : {
		...e,
		freshness: r
	};
}
function za(e, t, n) {
	let r = t === "qbittorrent";
	if (!Q(e) || !$(e.revision) || typeof e.configured != "boolean" || e.profile !== Qi[t] || !(e.checked_at === null || Oa(e.checked_at, 253402300799)) || ![
		"fresh",
		"stale",
		"unknown"
	].includes(String(e.freshness)) || !Ia(e.error) || typeof e.complete != "boolean" || e.offset !== n || !ka(e.offset) || !(e.next_offset === null || ka(e.next_offset) && e.next_offset === n + 12) || !(e.total === null || Oa(e.total, 1e9)) || r && e.total !== null || typeof e.truncated != "boolean" || !Array.isArray(e.items) || e.items.length > 12 || new Set(e.items.map((e) => Q(e) ? e.id : null)).size !== e.items.length || e.items.some((e) => !Q(e) || typeof e.id != "string" || !/^[a-f0-9]{64}$/.test(e.id) || !(e.title === null || aa(e.title, 240, !0)) || typeof e.status != "string" || !(r ? Fa : Na).includes(e.status) || !(e.import_state === null || !r && typeof e.import_state == "string" && Pa.includes(e.import_state)) || e.warning !== null && typeof e.warning != "boolean" || !(e.progress_basis_points === null || Oa(e.progress_basis_points, 1e4)) || !La(e.size_bytes) || !La(e.download_bytes_per_second) || !La(e.upload_bytes_per_second) || !r && (e.download_bytes_per_second !== null || e.upload_bytes_per_second !== null)) || !e.configured && (e.items.length !== 0 || e.complete || e.checked_at !== null || e.next_offset !== null || e.total !== null || e.error !== null || e.freshness !== "unknown" || e.truncated) || e.error !== null && e.complete || e.error !== null && e.error !== "checking" && (e.items.length !== 0 || e.next_offset !== null || e.total !== null) || e.error === "page_moved" && (e.items.length !== 0 || e.next_offset !== null || e.total !== null) || e.next_offset !== null && e.items.length !== 12 || e.complete && e.items.some((e) => e.title === null || e.status === "unknown" || e.warning === null || !r && (e.import_state === null || e.import_state === "unknown"))) throw Error("Invalid queue response");
	if (e.configured && e.error === null && !r && (e.total === null || e.items.length !== Math.min(12, Math.max(0, e.total - n)) || e.next_offset !== (n + 12 <= 48 && n + e.items.length < e.total ? n + 12 : null) || e.truncated !== e.total > 60)) throw Error("Invalid queue page");
	if (r && e.truncated && (n !== 48 || e.items.length !== 12 || e.next_offset !== null)) throw Error("Invalid transfer window");
	let i = e;
	return Ra({
		revision: i.revision,
		configured: i.configured,
		profile: i.profile,
		checked_at: i.checked_at,
		freshness: i.freshness,
		error: i.error,
		complete: i.complete,
		offset: i.offset,
		next_offset: i.next_offset,
		total: i.total,
		truncated: i.truncated,
		items: i.items.map(({ id: e, title: t, status: n, import_state: r, warning: i, progress_basis_points: a, size_bytes: o, download_bytes_per_second: s, upload_bytes_per_second: c }) => ({
			id: e,
			title: t,
			status: n,
			import_state: r,
			warning: i,
			progress_basis_points: a,
			size_bytes: o,
			download_bytes_per_second: s,
			upload_bytes_per_second: c
		}))
	});
}
function Ba(e) {
	let t = ki(ra("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l, u, d, f = 0, p = 0, m = 0, h = !1, g = {}, _ = {}, v = {}, y = {
		jellyfin: 0,
		seerr: 0
	}, b = {
		jellyfin: 0,
		seerr: 0
	}, x = !1, S, C, w = 0, T = !1, E, ee, te = 0, ne = !1, re = {}, ie = {}, ae = {}, oe = {
		sonarr: 0,
		radarr: 0,
		qbittorrent: 0
	}, se = {
		sonarr: 0,
		radarr: 0,
		qbittorrent: 0
	}, ce, le, ue, D = !1, de = !1, O = () => Ai(t), fe = (e) => `${Vi}.workspace.v1:${e.account.id}:${e.session_generation}`;
	function pe() {
		if (le = void 0, ce) try {
			sessionStorage.removeItem(ce);
		} catch {}
	}
	function me() {
		let e = O();
		if (!ce || !e.snapshot) return;
		if (!e.dirty) {
			pe();
			return;
		}
		let n = {
			body: e.draft,
			base: e.base
		};
		le = {
			key: ce,
			draft: n
		};
		try {
			sessionStorage.setItem(ce, JSON.stringify({
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
	function he() {
		++n, h = !1, ne = !1, T = !1, x = !1, ++w, S?.abort(), C?.abort(), S = void 0, C = void 0, ++te, E?.abort(), ee?.abort(), E = void 0, ee = void 0;
		for (let e of Yi) ++y[e], ++b[e], g[e]?.abort(), _[e]?.abort(), v[e]?.abort(), delete g[e], delete _[e], delete v[e];
		for (let e of Zi) ++oe[e], ++se[e], re[e]?.abort(), ie[e]?.abort(), ae[e]?.abort(), delete re[e], delete ie[e], delete ae[e];
		r && clearTimeout(r), r = void 0, i?.abort(), a?.abort(), i = void 0, a = void 0, o?.abort(), o = void 0, ++f, s?.abort(), s = void 0, ++p, c?.abort(), c = void 0, ++m, l?.abort(), l = void 0, u?.abort(), u = void 0, d?.abort(), d = void 0;
	}
	function k(e, n = !1) {
		he(), de ||= n, kt(() => t.set(ra(n ? "blocked" : "paused", e)));
	}
	function ge() {
		r && clearTimeout(r), !D && !de && O().phase === "ready" && O().notificationSave !== "uncertain" && O().layoutSave !== "uncertain" && document.visibilityState === "visible" && (r = setTimeout(() => {
			r = void 0, Be(), Je(), be();
		}, 15e3));
	}
	async function A(t, n, r, i = r ? "PUT" : "GET") {
		let a = performance.now(), o = setTimeout(() => n.abort(), 4e3);
		try {
			let o = await fetch(t, {
				method: i,
				credentials: "same-origin",
				cache: "no-store",
				redirect: "error",
				signal: n.signal,
				headers: {
					"X-Reborn-Product": Vi,
					"X-Reborn-Contract": Hi,
					"X-CSRF-Token": e,
					...t === "/api/workspace/guide" ? { "X-Reborn-Guide": "identity-v1" } : {},
					...r ? { "Content-Type": "application/json" } : {}
				},
				body: r ? JSON.stringify(r) : void 0
			}), s = o.ok ? await o.json() : void 0;
			if (n.signal.aborted || performance.now() - a >= 4e3) throw Error("Deadline");
			return {
				status: o.status,
				value: s
			};
		} finally {
			clearTimeout(o);
		}
	}
	function _e(e) {
		return e === 401 || e === 403 ? "Your sign-in changed or ended. Open a fresh workspace after signing in." : e === 426 ? "This workspace needs a fresh document. Open workspace again." : "Your workspace could not be checked. Open workspace again when access is available.";
	}
	function j(e) {
		let t = O().snapshot;
		return !t || e.account.id === t.account.id && e.session_generation === t.session_generation && e.account.role === t.account.role;
	}
	function ve(e, t) {
		return Q(e) && e.product === Vi && e.contract === Hi && e.schema === 1 && Q(e.account) && e.account.id === t.account.id && e.account.username === t.account.username && e.account.role === t.account.role && e.session_generation === t.session_generation;
	}
	function ye(e) {
		let t = O();
		return t.phase === "ready" && !!t.snapshot && e.account.id === t.snapshot.account.id && e.account.username === t.snapshot.account.username && e.account.role === t.snapshot.account.role && e.session_generation === t.snapshot.session_generation;
	}
	function M(e, t, n = !1) {
		let r = e.snapshot?.crafty, i = t ? r && (BigInt(t.revision) < BigInt(r.revision) || n && t.revision === r.revision) ? r : t : r ?? t;
		return r?.revision === i?.revision ? {
			crafty: i,
			observations: e.observations,
			changed: !1
		} : (++m, l?.abort(), l = void 0, {
			crafty: i,
			observations: {
				...Ji(),
				message: "Connection enrollment changed. Check newest observations for the current scope."
			},
			changed: !0
		});
	}
	async function be(e = !1) {
		if (D || de || i || a || o || u || d || !e && O().layoutSave === "uncertain" || document.visibilityState !== "visible") return;
		let r = new AbortController();
		i = r;
		let s = n;
		try {
			let i = await A("/api/workspace/snapshot", r);
			if (D || r.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if (i.status !== 200) {
				k(_e(i.status), !0);
				return;
			}
			let a = Ta(i.value);
			if (!j(a)) {
				k("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let o = O();
			if (ce = fe(a), o.phase === "ready") {
				let n = M(o, a.crafty), r = o.dirty && a.note.revision !== o.base, i = !!o.layoutDraft && wa(o.layoutDraft.panels, a.layout.panels) && e && ["uncertain", "checking-conflict"].includes(o.layoutSave), s = !!o.layoutDraft && !i && o.layoutDraft.base !== a.layout.revision, c = {
					...o,
					snapshot: {
						...a,
						crafty: n.crafty
					},
					observations: n.observations,
					layoutDraft: i ? void 0 : o.layoutDraft,
					layoutSave: s ? "conflict" : ["uncertain", "checking-conflict"].includes(o.layoutSave) || i ? "idle" : o.layoutSave,
					layoutMessage: i ? "Saved layout checked. The current layout matches your changes." : s ? "A newer layout was saved. Your arrangement is unchanged; compare before saving." : o.layoutSave === "uncertain" ? "The saved layout was checked. Review your arrangement before saving deliberately." : o.layoutMessage,
					draft: o.dirty ? o.draft : a.note.body,
					base: o.dirty ? o.base : a.note.revision,
					save: r ? "conflict" : ["uncertain", "checking-conflict"].includes(o.save) ? "idle" : o.save,
					message: r ? "A newer saved note is available. Your draft is unchanged." : "Workspace checked.",
					notificationSave: "idle",
					notificationMessage: o.notificationSave === "uncertain" ? "Current read markers checked. Review newer changes before marking read." : "Notifications checked.",
					directorySave: o.directorySave === "uncertain" ? "idle" : o.directorySave,
					directoryMessage: o.directorySave === "uncertain" ? "Current saved directory and pins checked. Review them before making another change." : o.directoryMessage
				};
				n.changed ? kt(() => t.set(c)) : t.set(c), o.dirty && o.draft === a.note.body && (t.update((e) => ({
					...e,
					dirty: !1,
					base: a.note.revision,
					save: "saved",
					message: "The current note is saved."
				})), pe());
			} else {
				let e = le?.key === ce ? le.draft : void 0, n = !1;
				try {
					e ??= Ea(sessionStorage.getItem(ce));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (pe(), e = void 0), t.set({
					...ra("ready", "Workspace checked."),
					snapshot: a,
					draft: a.note.body,
					base: a.note.revision,
					recovery: e,
					storageLimited: n
				});
			}
			if (h && O().snapshot?.account.role === "owner") for (let e of Yi) {
				let t = O().media[e].observation;
				t?.error === "checking" && !g[e] && !v[e] && Ke(e, t.offset);
			}
			if (ne && O().snapshot?.account.role === "owner") for (let e of Zi) {
				let t = O().queues[e].observation;
				t?.error !== "checking" || re[e] || ae[e] || ie[e] || et(e, t.offset);
			}
			ge();
		} catch {
			i === r && s === n && !D && k("Your workspace could not be checked. Open workspace again to retry deliberately.", !0);
		} finally {
			i === r && (i = void 0);
		}
	}
	function xe(e) {
		let n = O();
		if (n.phase === "ready" && n.snapshot) {
			if (t.set({
				...n,
				draft: e,
				dirty: e !== n.snapshot.note.body,
				save: n.save === "saved" ? "idle" : n.save
			}), ia(e)) me();
			else if (le = void 0, ce) try {
				sessionStorage.removeItem(ce);
			} catch {}
		}
	}
	function Se() {
		let e = O();
		e.recovery && e.snapshot && e.phase === "ready" && (t.set({
			...e,
			draft: e.recovery.body,
			base: e.recovery.base,
			dirty: !0,
			recovery: void 0,
			save: e.recovery.base === e.snapshot.note.revision ? "idle" : "conflict",
			message: "Draft recovered. Review it before saving."
		}), me());
	}
	function Ce(e) {
		let n = O();
		n.snapshot && n.phase === "ready" && (t.set({
			...n,
			draft: e ? n.snapshot.note.body : n.draft,
			base: n.snapshot.note.revision,
			dirty: !e && n.draft !== n.snapshot.note.body,
			recovery: void 0,
			save: "idle",
			message: e ? "Loaded the saved note." : "Draft kept against the latest saved revision. Review, then save deliberately."
		}), me());
	}
	async function we() {
		let e = O();
		if (e.phase !== "ready" || !e.dirty || !ia(e.draft) || [
			"conflict",
			"checking-conflict",
			"uncertain"
		].includes(e.save) || a || u || d || e.layoutSave === "checking-conflict") return;
		i?.abort(), i = void 0, r && clearTimeout(r), r = void 0;
		let o = new AbortController();
		a = o;
		let s = n, c = {
			body: e.draft,
			base: e.base
		};
		t.update((e) => ({
			...e,
			save: "saving",
			message: "Saving your note…"
		}));
		try {
			let e = await A("/api/workspace/note", o, {
				body: c.body,
				base_revision: c.base
			});
			if (D || o.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				k(_e(e.status), !0);
				return;
			}
			if (e.status === 409) t.update((e) => ({
				...e,
				save: "checking-conflict",
				message: "Another save won. Checking the latest saved note before comparing. Your draft is unchanged."
			}));
			else if (e.status === 200) {
				let n = Ta(e.value);
				if (!j(n) || n.note.body !== c.body || BigInt(n.note.revision) !== BigInt(c.base) + 1n) throw Error("Unqualified save result");
				let r = O(), i = M(r, n.crafty, !0), a = {
					...r,
					snapshot: {
						...n,
						crafty: i.crafty,
						directory: r.snapshot?.directory ?? n.directory,
						notifications: r.snapshot?.notifications ?? n.notifications,
						layout: r.snapshot?.layout ?? n.layout
					},
					observations: i.observations,
					base: n.note.revision,
					dirty: r.draft !== n.note.body,
					save: "saved",
					message: r.draft === n.note.body ? "Saved to your account." : "Submitted version saved. Your newer edits are still unsaved."
				};
				i.changed ? kt(() => t.set(a)) : t.set(a), me();
			} else throw Error("Save outcome unavailable");
		} catch {
			a === o && s === n && !D && t.update((e) => ({
				...e,
				save: "uncertain",
				message: "Save outcome is uncertain. Check the saved note before trying again."
			}));
		} finally {
			a === o && (a = void 0), s === n && !D && (O().save === "checking-conflict" ? await be() : ge());
		}
	}
	async function Te(e, r) {
		let a = O();
		if (a.phase !== "ready" || !a.snapshot || o || u || d || a.layoutSave === "checking-conflict" || a.directorySave === "uncertain") return !1;
		i?.abort(), i = void 0;
		let s = new AbortController();
		o = s;
		let c = n;
		t.update((e) => ({
			...e,
			directorySave: "saving",
			directoryMessage: "Saving your change…"
		}));
		try {
			let i = await A(e, s, r);
			if (D || s.signal.aborted || c !== n) return !1;
			if (document.visibilityState !== "visible") return k("Workspace hidden. Checking access on return."), !1;
			if ([
				401,
				403,
				426
			].includes(i.status)) return k(_e(i.status), !0), !1;
			if (i.status === 200) {
				let e = Ta(i.value);
				return j(e) ? (t.update((t) => ({
					...t,
					snapshot: t.snapshot ? {
						...t.snapshot,
						directory: e.directory
					} : void 0,
					directorySave: "idle",
					directoryMessage: "Saved to your account."
				})), !0) : (k("Your account scope changed. Open a fresh workspace.", !0), !1);
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
			return o === s && c === n && !D && t.update((e) => ({
				...e,
				directorySave: "uncertain",
				directoryMessage: "The save may have completed. Check saved services before making another change."
			})), !1;
		} finally {
			o === s && (o = void 0), c === n && !D && ge();
		}
	}
	function Ee(e, t) {
		return Te("/api/owner/directory", {
			base_revision: e,
			change: t
		});
	}
	function De(e) {
		let t = O().snapshot?.directory;
		return t ? Te("/api/workspace/pins", {
			base_directory_revision: t.revision,
			base_revision: t.pins_revision,
			ids: e
		}) : Promise.resolve(!1);
	}
	async function Oe(e, s) {
		let c = O();
		if (D || de || c.phase !== "ready" || !c.snapshot || u || a || o || d || c.layoutSave === "checking-conflict" || c.notificationSave !== "idle" || !["services", "connections"].includes(e) || !$(s, !0)) return;
		i?.abort(), i = void 0, r && clearTimeout(r), r = void 0;
		let l = new AbortController();
		u = l;
		let f = n;
		t.update((e) => ({
			...e,
			notificationSave: "saving",
			notificationMessage: "Saving your read marker…"
		}));
		try {
			let r = await A("/api/workspace/notifications/read", l, {
				category: e,
				through: s
			});
			if (D || l.signal.aborted || f !== n) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				k(_e(r.status), !0);
				return;
			}
			if (r.status === 409) throw Error("Read watermark changed");
			let i = r.value;
			if (r.status !== 200 || !Q(i)) throw Error("Read marker unavailable");
			if (i.product !== Vi || i.contract !== Hi || i.schema !== 1 || !Q(i.account) || i.account.id !== c.snapshot.account.id || i.account.username !== c.snapshot.account.username || i.account.role !== c.snapshot.account.role || i.session_generation !== c.snapshot.session_generation) {
				k("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let a = fa(i.notifications), o = a.groups.find((t) => t.category === e);
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
			u === l && f === n && !D && t.update((e) => ({
				...e,
				notificationSave: "uncertain",
				notificationMessage: "The read marker may have saved. Check notifications to see the current state."
			}));
		} finally {
			u === l && (u = void 0), f === n && !D && ge();
		}
	}
	function ke() {
		let e = O();
		e.phase !== "ready" || !e.snapshot || e.layoutDraft || a || o || u || d || (i?.abort(), i = void 0, r && clearTimeout(r), r = void 0, t.set({
			...e,
			layoutDraft: {
				base: e.snapshot.layout.revision,
				panels: e.snapshot.layout.panels.map((e) => ({ ...e }))
			},
			layoutSave: "idle",
			layoutMessage: "Arrange your Home panels, then save to your account."
		}), ge());
	}
	function Ae(e) {
		let n = O();
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
	function je(e, t) {
		let n = O().layoutDraft?.panels.map((e) => ({ ...e }));
		if (!n) return;
		let r = n.findIndex((t) => t.id === e), i = r + t;
		r < 0 || i < 0 || i >= n.length || ([n[r], n[i]] = [n[i], n[r]], Ae(n));
	}
	function Me(e) {
		let t = O().layoutDraft?.panels.map((e) => ({ ...e }));
		if (!t) return;
		let n = t.find((t) => t.id === e);
		!n || n.visible && t.filter((e) => e.visible).length === 1 || (n.visible = !n.visible, Ae(t));
	}
	function Ne() {
		Ae(Wi());
	}
	function Pe() {
		let e = O();
		e.phase !== "ready" || [
			"saving",
			"checking-conflict",
			"uncertain"
		].includes(e.layoutSave) || (t.set({
			...e,
			layoutDraft: void 0,
			layoutSave: "idle",
			layoutMessage: "Your saved Home layout is in use."
		}), ge());
	}
	function Fe(e) {
		let n = O();
		n.phase === "ready" && n.snapshot && n.layoutDraft && n.layoutSave === "conflict" && (e ? Pe() : t.set({
			...n,
			layoutDraft: {
				...n.layoutDraft,
				base: n.snapshot.layout.revision
			},
			layoutSave: "idle",
			layoutMessage: "Your arrangement is kept against the checked saved layout. Review, then save deliberately."
		}));
	}
	async function Ie() {
		let e = O();
		if (D || de || e.phase !== "ready" || !e.snapshot || !e.layoutDraft || e.layoutSave !== "idle" || a || o || u || d) return;
		let s = {
			base: e.layoutDraft.base,
			panels: e.layoutDraft.panels.map((e) => ({ ...e }))
		};
		if (!s.panels.some((e) => e.visible) || wa(s.panels, e.snapshot.layout.panels)) return;
		i?.abort(), i = void 0, r && clearTimeout(r), r = void 0;
		let c = new AbortController();
		d = c;
		let l = n;
		t.update((e) => ({
			...e,
			layoutSave: "saving",
			layoutMessage: "Saving your Home layout…"
		}));
		let f = !1;
		try {
			let r = await A("/api/workspace/layout", c, {
				base_revision: s.base,
				panels: s.panels
			});
			if (D || c.signal.aborted || l !== n) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				k(_e(r.status), !0);
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
				if (n.product !== Vi || n.contract !== Hi || n.schema !== 1 || !Q(n.account) || n.account.id !== e.snapshot.account.id || n.account.username !== e.snapshot.account.username || n.account.role !== e.snapshot.account.role || n.session_generation !== e.snapshot.session_generation) {
					k("Your account scope changed. Open a fresh workspace.", !0);
					return;
				}
				let i = pa(n.layout);
				if (BigInt(i.revision) !== BigInt(s.base) + 1n || !wa(i.panels, s.panels)) throw Error("Unqualified layout result");
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
			d === c && l === n && !D && t.update((e) => ({
				...e,
				layoutSave: "uncertain",
				layoutMessage: "The layout may have saved. Check the saved layout before saving again; your changes have not been sent again."
			}));
		} finally {
			d === c && (d = void 0), l === n && !D && (f ? await be(!0) : ge());
		}
	}
	async function Le(e = O().activity.category, r = O().activity.query, i = !1) {
		let a = O();
		if (D || de || a.phase !== "ready" || !a.snapshot || document.visibilityState !== "visible") return;
		s?.abort();
		let o = new AbortController();
		s = o;
		let c = ++f, l = n, u = a.activity, d = new URLSearchParams({
			category: e,
			q: r
		});
		if (i) {
			if (!u.next || u.category !== e || u.query !== r) return;
			d.set("through", u.through), d.set("before", u.next);
		}
		t.update((t) => ({
			...t,
			activity: {
				...Ki(),
				phase: "loading",
				category: e,
				query: r,
				message: "Checking your retained activity…"
			}
		}));
		try {
			let s = await A(`/api/workspace/activity?${d}`, o);
			if (D || o.signal.aborted || c !== f || l !== n) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				k(_e(s.status), !0);
				return;
			}
			let p = s.value;
			if (s.status !== 200 || !Q(p) || p.product !== Vi || p.contract !== Hi || p.schema !== 1 || !Q(p.account) || p.account.id !== a.snapshot.account.id || p.account.role !== a.snapshot.account.role || p.account.username !== a.snapshot.account.username || p.session_generation !== a.snapshot.session_generation) {
				if (s.status === 200) {
					k("Your account scope changed. Open a fresh workspace.", !0);
					return;
				}
				throw Error("Activity unavailable");
			}
			let m = [
				"workspace",
				"directory",
				"connections"
			], h = [
				"note_saved",
				"pins_saved",
				"service_added",
				"service_updated",
				"service_removed",
				"connection_saved",
				"connection_removed"
			];
			if (p.category !== e || p.q !== r || !$(p.through) || p.next_before !== null && !$(p.next_before, !0) || i && p.through !== u.through || !Array.isArray(p.entries) || p.entries.length > 25 || p.entries.some((e) => !Q(e) || !$(e.id, !0) || !$(e.revision, !0) || !$(e.occurred_at) || BigInt(e.occurred_at) > 253402300799n || !h.includes(String(e.kind)) || !m.includes(String(e.category)) || typeof e.label != "string" || !/^[A-Za-z ]{1,64}$/.test(e.label) || BigInt(e.id) > BigInt(p.through) || i && BigInt(e.id) >= BigInt(u.next)) || p.entries.some((e, t) => t > 0 && BigInt(e.id) >= BigInt(p.entries[t - 1].id)) || p.next_before !== null && (p.entries.length !== 25 || p.next_before !== p.entries.at(-1)?.id)) throw Error("Invalid activity response");
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
			!D && c === f && l === n && t.update((t) => ({
				...t,
				activity: {
					...Ki(),
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
	async function Re(e = !1) {
		let r = O();
		if (D || de || r.phase !== "ready" || !r.snapshot || document.visibilityState !== "visible" || c || !e && r.guide.phase === "ready") return;
		let i = r.snapshot, a = new AbortController();
		c = a;
		let o = ++p, s = n;
		t.update((e) => ({
			...e,
			guide: {
				phase: "loading",
				message: "Checking the workspace guide…"
			}
		}));
		try {
			let e = await A("/api/workspace/guide", a);
			if (D || a.signal.aborted || o !== p || s !== n || !ye(i)) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				k(_e(e.status), !0);
				return;
			}
			if (e.status !== 200) throw Error("Guide unavailable");
			if (!ve(e.value, i)) {
				k("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let r = ma(e.value);
			t.update((e) => ({
				...e,
				guide: {
					phase: "ready",
					value: r,
					message: "Workspace guide checked."
				}
			}));
		} catch {
			!D && o === p && s === n && ye(i) && t.update((e) => ({
				...e,
				guide: {
					phase: "error",
					message: "The workspace guide could not be checked. Retry deliberately; your private note is unchanged."
				}
			}));
		} finally {
			c === a && (c = void 0);
		}
	}
	async function ze(e = !1) {
		let r = O();
		if (D || de || r.phase !== "ready" || !r.snapshot || document.visibilityState !== "visible") return;
		let i = r.observations;
		if (e && (!i.next || i.phase !== "ready" || i.revision !== r.snapshot.crafty?.revision)) return;
		l?.abort();
		let a = r.snapshot, o = new AbortController();
		l = o;
		let s = ++m, c = n, u = new URLSearchParams();
		e && (u.set("revision", i.revision), u.set("through", i.through), u.set("before", i.next)), t.update((e) => ({
			...e,
			observations: {
				...Ji(),
				phase: "loading",
				message: "Checking retained provider observations…"
			}
		}));
		try {
			let r = await A(`/api/workspace/observations${e ? `?${u}` : ""}`, o);
			if (D || o.signal.aborted || s !== m || c !== n || !ye(a)) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				k(_e(r.status), !0);
				return;
			}
			if (r.status === 409) {
				t.update((e) => ({
					...e,
					observations: {
						...Ji(),
						phase: "error",
						message: "Connection enrollment changed. Check the current connection, then check newest observations."
					}
				}));
				return;
			}
			if (r.status !== 200) throw Error("Observation history unavailable");
			if (!ve(r.value, a)) {
				k("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let l = ha(r.value, i, e);
			if (l.revision !== a.crafty?.revision || l.revision !== O().snapshot?.crafty?.revision) {
				t.update((e) => ({
					...e,
					observations: {
						...Ji(),
						phase: "error",
						message: "Connection enrollment changed. Check the current connection, then check newest observations."
					}
				}));
				return;
			}
			if (a.account.role === "member" && l.entries.some((e) => e.revision !== l.revision)) throw Error("Observation revision outside member scope");
			t.update((e) => ({
				...e,
				observations: l
			}));
		} catch {
			!D && s === m && c === n && ye(a) && t.update((e) => ({
				...e,
				observations: {
					...Ji(),
					phase: "error",
					message: "Provider history could not be checked. Retry deliberately; current connections remain available."
				}
			}));
		} finally {
			l === o && (l = void 0);
		}
	}
	function Be() {
		let e = O();
		if (D || de || e.phase !== "ready") return;
		let n = Math.floor(Date.now() / 1e3), r = !1, i = { ...e.media };
		for (let e of Yi) {
			let t = i[e].observation;
			if (!t) continue;
			let a = Aa(t, n);
			a !== t && (r = !0, i[e] = {
				...i[e],
				observation: a
			});
		}
		r && t.set({
			...e,
			media: i
		});
	}
	function N(e, n, r = !1) {
		let i = () => t.update((t) => ({
			...t,
			media: {
				...t.media,
				[e]: n
			}
		}));
		r ? kt(i) : i();
	}
	function Ve() {
		let e = O();
		return !D && !de && e.phase === "ready" && e.snapshot?.account.role === "owner" && document.visibilityState === "visible" ? e.snapshot : void 0;
	}
	function He(e) {
		++y[e], g[e]?.abort(), delete g[e];
	}
	function Ue() {
		h = !1;
		for (let e of Yi) {
			He(e), ++b[e], _[e]?.abort(), delete _[e];
			let t = O().media[e], n = !!v[e];
			v[e]?.abort(), delete v[e], N(e, {
				phase: "idle",
				save: n ? "uncertain" : t.save,
				message: n ? "The save may have completed. Check the connection state before another change." : t.save === "uncertain" || t.save === "conflict" ? t.message : ""
			}, !0);
		}
	}
	async function We(e, t = !0) {
		let r = Ve();
		if (!r || v[e]) return;
		h = !0, He(e), _[e]?.abort();
		let i = new AbortController();
		_[e] = i;
		let a = ++b[e], o = n, s = O().media[e];
		N(e, {
			...s,
			phase: "loading",
			observation: void 0,
			message: "Checking the current enrollment…"
		}, !0);
		try {
			let s = await A(`/api/owner/media/${e}`, i);
			if (D || i.signal.aborted || a !== b[e] || o !== n || !ye(r)) return;
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				k(_e(s.status), !0);
				return;
			}
			let c = s.value;
			if (s.status !== 200 || !Q(c) || !$(c.revision) || typeof c.configured != "boolean") throw Error("Media enrollment unavailable");
			let l = O().media[e].status;
			if (l && BigInt(c.revision) < BigInt(l.revision)) throw Error("Older enrollment reply");
			N(e, {
				phase: "ready",
				status: {
					revision: c.revision,
					configured: c.configured
				},
				save: "idle",
				message: c.configured ? "Enrollment checked. Only observation requests are sent." : "No connection is enrolled."
			}, !0), t && c.configured && await Ke(e);
		} catch {
			if (!D && a === b[e] && o === n && ye(r)) {
				let t = O().media[e];
				N(e, {
					...t,
					phase: "error",
					observation: void 0,
					message: "The connection state could not be checked. Retry deliberately before entering credentials."
				}, !0);
			}
		} finally {
			_[e] === i && delete _[e];
		}
	}
	async function Ge() {
		Ve() && (h = !0, await Promise.all(Yi.map((e) => We(e))));
	}
	async function Ke(e, t = 0) {
		let r = Ve();
		if (!r || !ka(t) || v[e]) return;
		h = !0, He(e);
		let i = new AbortController();
		g[e] = i;
		let a = y[e], o = n, s = O().media[e];
		N(e, {
			...s,
			phase: "loading",
			observation: void 0,
			message: "Checking sampled media observations…"
		}, !0);
		try {
			let c = await A(`/api/workspace/media/${e}?offset=${t}`, i);
			if (D || i.signal.aborted || a !== y[e] || o !== n || !ye(r)) return;
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				k(_e(c.status), !0);
				return;
			}
			if (c.status === 409) {
				He(e), N(e, {
					phase: "error",
					save: s.save,
					message: "Enrollment changed. Check the connection state before reading its new scope."
				}, !0);
				return;
			}
			if (c.status !== 200) throw Error("Media unavailable");
			if (!ve(c.value, r)) {
				k("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			if (c.value.provider !== e) throw Error("Wrong media provider");
			let l = ja(c.value.observation, e, t), u = O().media[e].status;
			if (u && BigInt(l.revision) < BigInt(u.revision)) throw Error("Older media scope");
			u?.revision !== l.revision && (++b[e], _[e]?.abort(), delete _[e]);
			let d = l.configured ? l.error === "checking" ? "A sample is being collected. Check observations again, or wait for the existing workspace access check." : l.error ? "This provider sample is unavailable or incomplete. Unknown values stay unknown." : l.complete ? "Media observations checked." : "A partial media sample is available; some details are unknown." : "No connection is enrolled.";
			N(e, {
				phase: "ready",
				status: {
					revision: l.revision,
					configured: l.configured
				},
				observation: l,
				save: O().media[e].save,
				message: d
			}, !0);
		} catch {
			!D && a === y[e] && o === n && ye(r) && N(e, {
				...O().media[e],
				phase: "error",
				observation: void 0,
				message: "Media observations could not be checked. Retry deliberately; your workspace note is unchanged."
			}, !0);
		} finally {
			g[e] === i && delete g[e];
		}
	}
	async function qe(e, t, r) {
		let i = Ve(), a = O().media[e];
		if (!i || v[e] || a.phase !== "ready" || a.save !== "idle" || a.status?.revision !== t || !$(t)) return;
		h = !0, He(e), ++b[e], _[e]?.abort(), delete _[e];
		let o = new AbortController();
		v[e] = o;
		let s = n;
		N(e, {
			...a,
			observation: void 0,
			save: "saving",
			message: r ? "Saving the dedicated connection…" : "Removing the connection…"
		}, !0);
		try {
			let c = await A(`/api/owner/media/${e}`, o, {
				base_revision: t,
				connection: r
			});
			if (D || o.signal.aborted || s !== n || !ye(i) || v[e] !== o) return;
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				k(_e(c.status), !0);
				return;
			}
			if (c.status === 409) {
				N(e, {
					phase: "error",
					save: "conflict",
					message: "The connection changed elsewhere. Check its current state before enrolling again."
				}, !0);
				return;
			}
			if ([
				400,
				413,
				429
			].includes(c.status)) {
				N(e, {
					...a,
					observation: void 0,
					save: "idle",
					message: "Connection not accepted. Check the address, library, certificate and broad-access acknowledgement."
				}, !0);
				return;
			}
			let l = c.value;
			if (c.status !== 200 || !Q(l) || !$(l.revision, !0) || BigInt(l.revision) !== BigInt(t) + 1n || l.configured !== (r !== null)) throw Error("Uncertain media save");
			N(e, {
				phase: "ready",
				status: {
					revision: l.revision,
					configured: l.configured
				},
				save: "idle",
				message: r ? "Connection saved. Check its observations." : "Connection removed."
			}, !0);
		} catch {
			!D && s === n && ye(i) && v[e] === o && N(e, {
				phase: "error",
				save: "uncertain",
				message: "The save may have completed. Check the connection state before entering credentials again."
			}, !0);
		} finally {
			v[e] === o && delete v[e];
		}
	}
	function Je() {
		let e = O();
		if (D || de || e.phase !== "ready") return;
		let n = Math.floor(Date.now() / 1e3), r = !1, i = { ...e.queues };
		for (let e of Zi) {
			let t = i[e].observation;
			if (!t) continue;
			let a = Ra(t, n);
			a !== t && (r = !0, i[e] = {
				...i[e],
				observation: a
			});
		}
		r && t.set({
			...e,
			queues: i
		});
	}
	function Ye(e, n, r = !1) {
		let i = () => t.update((t) => ({
			...t,
			queues: {
				...t.queues,
				[e]: n
			}
		}));
		r ? kt(i) : i();
	}
	function Xe(e) {
		++oe[e], re[e]?.abort(), delete re[e];
	}
	function Ze() {
		ne = !1;
		for (let e of Zi) {
			Xe(e), ++se[e], ie[e]?.abort(), delete ie[e];
			let t = O().queues[e], n = !!ae[e];
			ae[e]?.abort(), delete ae[e], Ye(e, {
				...$i(),
				save: n ? "uncertain" : t.save,
				message: n ? "The save may have completed. Check the connection state before another change." : t.save === "uncertain" || t.save === "conflict" ? t.message : ""
			}, !0);
		}
	}
	async function Qe(e) {
		let t = Ve();
		if (!t || ae[e]) return;
		ne = !0, Xe(e), ie[e]?.abort();
		let r = new AbortController();
		ie[e] = r;
		let i = ++se[e], a = n, o = O().queues[e];
		Ye(e, {
			...o,
			phase: "loading",
			observation: void 0,
			message: "Checking the current enrollment…"
		}, !0);
		try {
			let s = await A(`/api/owner/queues/${e}`, r);
			if (D || !ne || r.signal.aborted || i !== se[e] || a !== n || !ye(t)) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				k(_e(s.status), !0);
				return;
			}
			let c = s.value;
			if (s.status !== 200 || !Q(c) || !$(c.revision) || typeof c.configured != "boolean" || c.profile !== Qi[e]) throw Error("Queue enrollment unavailable");
			let l = O().queues[e].status;
			if (l && (BigInt(c.revision) < BigInt(l.revision) || c.revision === l.revision && c.configured !== l.configured)) throw Error("Older enrollment reply");
			Ye(e, {
				phase: "ready",
				offset: c.configured && l?.revision === c.revision ? o.offset : 0,
				status: {
					revision: c.revision,
					configured: c.configured,
					profile: c.profile
				},
				save: "idle",
				message: c.configured ? "Enrollment checked. Check observations when you want a provider sample." : "No connection is enrolled."
			}, !0);
		} catch {
			!D && ne && i === se[e] && a === n && ye(t) && Ye(e, {
				...O().queues[e],
				phase: "error",
				observation: void 0,
				message: "The connection state could not be checked. Retry deliberately before entering credentials."
			}, !0);
		} finally {
			ie[e] === r && delete ie[e];
		}
	}
	async function $e() {
		Ve() && (ne = !0, await Promise.all(Zi.map((e) => Qe(e))));
	}
	async function et(e, t = O().queues[e].offset) {
		let r = Ve();
		if (!r || !ka(t) || ae[e]) return;
		ne = !0, Xe(e);
		let i = new AbortController();
		re[e] = i;
		let a = oe[e], o = n, s = O().queues[e];
		Ye(e, {
			...s,
			offset: t,
			phase: "loading",
			observation: void 0,
			message: "Checking queue observations…"
		}, !0);
		try {
			let c = await A(`/api/workspace/queues/${e}?offset=${t}`, i);
			if (D || !ne || i.signal.aborted || a !== oe[e] || o !== n || !ye(r)) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				k(_e(c.status), !0);
				return;
			}
			if (c.status === 409) {
				Xe(e), Ye(e, {
					...$i(),
					phase: "error",
					save: s.save,
					message: "Enrollment changed. Check the connection state before reading its new scope."
				}, !0);
				return;
			}
			if (c.status !== 200) throw Error("Queues unavailable");
			if (!ve(c.value, r)) {
				k("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			if (c.value.provider !== e) throw Error("Wrong queue provider");
			let l = za(c.value.observation, e, t), u = O().queues[e].status;
			if (u && (BigInt(l.revision) < BigInt(u.revision) || l.revision === u.revision && l.configured !== u.configured)) throw Error("Older queue scope");
			u?.revision !== l.revision && (++se[e], ie[e]?.abort(), delete ie[e]);
			let d = l.configured ? l.error === "checking" ? "A sample is being collected. Displayed rows, if any, retain their earlier collection time." : l.error === "page_moved" ? "The provider moved this page as its queue changed. Reload the first page deliberately." : l.error === "unsupported_profile" ? "This provider does not match the supported API profile. Review the enrolled version and address." : l.error === "denied" ? "The provider denied access. Review deliberate key enrollment." : l.error === "rate_limited" ? "The provider limited requests. Try again deliberately later." : l.error ? "Queue observations are unavailable. Unknown values stay unknown." : l.complete ? "Queue observations checked." : "An incomplete sample is available; unreported values stay unknown." : "No connection is enrolled.";
			Ye(e, {
				phase: "ready",
				offset: t,
				status: {
					revision: l.revision,
					configured: l.configured,
					profile: l.profile
				},
				observation: l,
				save: O().queues[e].save,
				message: d
			}, !0);
		} catch {
			!D && ne && a === oe[e] && o === n && ye(r) && Ye(e, {
				...O().queues[e],
				phase: "error",
				observation: void 0,
				message: "Queue observations could not be checked. Retry deliberately; your private note is unchanged."
			}, !0);
		} finally {
			re[e] === i && delete re[e];
		}
	}
	async function tt(e, t, r) {
		let i = Ve(), a = O().queues[e];
		if (!i || ae[e] || a.phase !== "ready" || a.save !== "idle" || a.status?.revision !== t || !$(t)) return;
		ne = !0, Xe(e), ++se[e], ie[e]?.abort(), delete ie[e];
		let o = new AbortController();
		ae[e] = o;
		let s = n;
		Ye(e, {
			...a,
			observation: void 0,
			save: "saving",
			message: r ? "Saving the deliberately enrolled connection…" : "Removing the connection…"
		}, !0);
		try {
			let c = await A(`/api/owner/queues/${e}`, o, {
				base_revision: t,
				connection: r
			});
			if (D || !ne || o.signal.aborted || s !== n || !ye(i) || ae[e] !== o) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				k(_e(c.status), !0);
				return;
			}
			if (c.status === 409) {
				Ye(e, {
					...$i(),
					phase: "error",
					save: "conflict",
					message: "The connection changed elsewhere. Check its current state before enrolling again."
				}, !0);
				return;
			}
			if ([
				400,
				413,
				429
			].includes(c.status)) {
				Ye(e, {
					...a,
					observation: void 0,
					save: "idle",
					message: "Connection not accepted. Review the root HTTPS address, supported version, certificate and broad-access acknowledgement."
				}, !0);
				return;
			}
			let l = c.value;
			if (c.status !== 200 || !Q(l) || !$(l.revision, !0) || BigInt(l.revision) !== BigInt(t) + 1n || l.configured !== (r !== null) || l.profile !== Qi[e]) throw Error("Uncertain queue save");
			Ye(e, {
				phase: "ready",
				offset: 0,
				status: {
					revision: l.revision,
					configured: l.configured,
					profile: l.profile
				},
				save: "idle",
				message: r ? "Connection saved. Check its observations." : "Connection removed."
			}, !0);
		} catch {
			!D && ne && s === n && ye(i) && ae[e] === o && Ye(e, {
				...O().queues[e],
				phase: "error",
				observation: void 0,
				save: "uncertain",
				message: "The save may have completed. Check the connection state before entering credentials again."
			}, !0);
		} finally {
			ae[e] === o && delete ae[e];
		}
	}
	function nt() {
		let e = O();
		return !D && !de && e.phase === "ready" && e.snapshot && document.visibilityState === "visible" ? e.snapshot : void 0;
	}
	function rt(e) {
		kt(() => t.update((t) => ({
			...t,
			identity: e
		})));
	}
	function it() {
		T = !1, ++te, E?.abort(), E = void 0;
		let e = !!ee;
		ee?.abort(), ee = void 0, rt({
			...ta(),
			save: e ? "uncertain" : O().identity.save,
			message: e ? "The change may have completed. Check identity status before another action." : ""
		});
	}
	function at(e, t, n = O().identity.value) {
		if (!ve(e, t)) throw k("Your account scope changed. Open a fresh workspace.", !0), Error("Identity scope changed");
		let r = ba(e);
		if (n && (BigInt(r.application.revision) < BigInt(n.application.revision) || BigInt(r.link.revision) < BigInt(n.link.revision) || BigInt(r.link.flow_generation) < BigInt(n.link.flow_generation))) throw Error("Older identity response");
		return r;
	}
	async function ot() {
		let e = nt();
		if (!e || ee) return;
		T = !0, E?.abort();
		let t = new AbortController();
		E = t;
		let r = ++te, i = n, a = O().identity.value;
		rt({
			...O().identity,
			phase: "loading",
			value: void 0,
			message: "Checking your current Discord link…"
		});
		try {
			let o = await A("/api/workspace/discord", t);
			if (D || !T || t.signal.aborted || r !== te || i !== n || !ye(e)) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(o.status)) {
				k(_e(o.status), !0);
				return;
			}
			if (o.status !== 200) throw Error("Identity unavailable");
			let s = at(o.value, e, a);
			rt({
				phase: "ready",
				value: s,
				save: "idle",
				message: xa(s)
			});
		} catch {
			!D && T && r === te && i === n && ye(e) && rt({
				phase: "error",
				save: O().identity.save,
				message: "Identity status could not be checked. Check again before making a change."
			});
		} finally {
			E === t && (E = void 0);
		}
	}
	async function st() {
		nt() && (T = !0, await ot());
	}
	async function ct(e) {
		let t = nt(), r = O().identity, i = r.value;
		if (!t || !T || ee || r.phase !== "ready" || r.save !== "idle" || !i || e === "review" && i.attempt.phase !== "ready_to_review" || e === "confirm" && i.attempt.phase !== "review_ready") return;
		let a = {
			base_revision: i.link.revision,
			base_flow_generation: i.link.flow_generation,
			...["review", "confirm"].includes(e) ? { base_application_revision: i.application.revision } : {}
		};
		E?.abort(), E = void 0, ++te;
		let o = new AbortController();
		ee = o;
		let s = n;
		rt({
			...r,
			value: void 0,
			save: "saving",
			message: e === "review" ? "Reviewing the identity returned by Discord…" : e === "confirm" ? "Saving your confirmed identity…" : e === "unlink" ? "Unlinking this identity locally…" : "Cancelling this unfinished link…"
		});
		try {
			let r = await A(`/api/workspace/discord/${e}`, o, a, "POST");
			if (D || !T || o.signal.aborted || s !== n || !ye(t) || ee !== o) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				k(_e(r.status), !0);
				return;
			}
			if (r.status === 409) {
				rt({
					phase: "error",
					save: "conflict",
					message: "This link or application changed. Check identity status before another action."
				});
				return;
			}
			if ([
				400,
				413,
				429
			].includes(r.status)) {
				rt({
					phase: "error",
					save: "idle",
					message: "The action was not accepted. Check identity status before starting again."
				});
				return;
			}
			if (r.status !== 200) throw Error("Uncertain identity change");
			let c = at(r.value, t, i);
			rt({
				phase: "ready",
				value: c,
				save: "idle",
				message: e === "unlink" ? "The Discord identity is unlinked locally. Your local sign-in is unchanged." : e === "cancel" ? "The unfinished link is cancelled." : xa(c)
			});
		} catch {
			!D && T && s === n && ye(t) && ee === o && rt({
				phase: "error",
				save: "uncertain",
				message: "The action may have completed. Check identity status before making another choice. It has not been sent again."
			});
		} finally {
			ee === o && (ee = void 0);
		}
	}
	async function lt(e, t) {
		let r = Ve(), i = O().identity;
		if (!r || !T || ee || i.phase !== "ready" || i.save !== "idle" || i.value?.application.revision !== e || !$(e)) return;
		E?.abort(), E = void 0, ++te;
		let a = new AbortController();
		ee = a;
		let o = n;
		rt({
			phase: "loading",
			save: "saving",
			message: t ? "Saving dedicated Discord application access…" : "Removing Discord application access…"
		});
		try {
			let s = await A("/api/owner/discord/application", a, {
				base_revision: e,
				application: t
			});
			if (D || !T || a.signal.aborted || o !== n || !ye(r) || ee !== a) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				k(_e(s.status), !0);
				return;
			}
			if (s.status === 409) {
				rt({
					phase: "error",
					save: "conflict",
					message: "The application changed elsewhere. Check status before entering credentials again."
				});
				return;
			}
			if ([
				400,
				413,
				429
			].includes(s.status)) {
				rt({
					phase: "error",
					save: "idle",
					message: "Application access was not accepted. Check status, then review the application ID, secret and callback logging acknowledgement."
				});
				return;
			}
			if (s.status !== 200) throw Error("Uncertain application save");
			let c = at(s.value, r, i.value);
			if (BigInt(c.application.revision) !== BigInt(e) + 1n || c.application.configured !== (t !== null)) throw Error("Uncertain application revision");
			rt({
				phase: "ready",
				value: c,
				save: "idle",
				message: t ? "Discord application saved. Existing identity links are unchanged." : "Discord application removed. Existing links remain available for local unlinking."
			});
		} catch {
			!D && T && o === n && ye(r) && ee === a && rt({
				phase: "error",
				save: "uncertain",
				message: "The application save may have completed. Check status before entering credentials again."
			});
		} finally {
			t && (t.client_secret = ""), ee === a && (ee = void 0);
		}
	}
	function ut(e) {
		kt(() => t.update((t) => ({
			...t,
			sessions: e
		})));
	}
	function dt() {
		x = !1, ++w, S?.abort(), S = void 0;
		let e = !!C;
		C?.abort(), C = void 0, ut({
			...na(),
			save: e ? "uncertain" : O().sessions.save,
			message: e ? "The sign-out may have completed. Check your active sessions before another action." : ""
		});
	}
	function ft(e, t, n) {
		if (!ve(e, t)) throw k("Your account scope changed. Open a fresh workspace.", !0), Error("Session scope changed");
		let r = Ca(e);
		if (n && (BigInt(r.checked_at) < BigInt(n.checked_at) || r.sessions.find((e) => e.current).id !== n.sessions.find((e) => e.current).id)) throw Error("Older or different acting session list");
		return r;
	}
	async function P() {
		let e = nt();
		if (!e || C) return;
		x = !0, S?.abort();
		let t = new AbortController();
		S = t;
		let r = ++w, i = n, a = O().sessions.value;
		ut({
			...O().sessions,
			phase: "loading",
			value: void 0,
			message: "Checking your active sign-in sessions…"
		});
		try {
			let o = await A("/api/workspace/sessions", t);
			if (D || !x || t.signal.aborted || r !== w || i !== n || !ye(e)) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(o.status)) {
				k(_e(o.status), !0);
				return;
			}
			if (o.status !== 200) throw Error("Session list unavailable");
			ut({
				phase: "ready",
				value: ft(o.value, e, a),
				save: "idle",
				message: "Your active sign-in sessions were checked. Later sign-ins, expiry or sign-outs can change this list."
			});
		} catch {
			!D && x && r === w && i === n && ye(e) && ut({
				phase: "error",
				save: O().sessions.save,
				message: "Your active sessions could not be checked. This does not mean no sessions exist. Check again before choosing a session to sign out."
			});
		} finally {
			S === t && (S = void 0);
		}
	}
	async function pt() {
		nt() && (x = !0, await P());
	}
	async function mt(e) {
		let t = nt(), r = O().sessions, i = r.value;
		if (!t || !x || C || r.phase !== "ready" || r.save !== "idle" || !i || !Sa(e) || !i.sessions.some((t) => t.id === e && !t.current)) return;
		S?.abort(), S = void 0, ++w;
		let a = new AbortController();
		C = a;
		let o = n;
		ut({
			phase: "loading",
			save: "saving",
			message: "Signing out the selected other session…"
		});
		try {
			let r = await A("/api/workspace/sessions/revoke", a, { session_id: e }, "POST");
			if (D || !x || a.signal.aborted || o !== n || !ye(t) || C !== a) return;
			if (document.visibilityState !== "visible") {
				k("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				k(_e(r.status), !0);
				return;
			}
			if (r.status === 409) {
				ut({
					phase: "error",
					save: "conflict",
					message: "That session is no longer available for targeted sign-out. Check your active sessions before making another choice."
				});
				return;
			}
			if ([
				400,
				413,
				429
			].includes(r.status)) {
				ut({
					phase: "error",
					save: "idle",
					message: "The sign-out was not accepted. Check your active sessions before another action."
				});
				return;
			}
			if (r.status !== 200 || !Q(r.value) || r.value.result !== "signed_out") throw Error("Uncertain targeted sign-out");
			let s = ft(r.value, t, i);
			if (s.sessions.some((t) => t.id === e)) throw Error("Target remains in sign-out receipt");
			ut({
				phase: "ready",
				value: s,
				save: "idle",
				message: "The selected session is signed out. This session and unrelated sign-ins remain available."
			});
		} catch {
			!D && x && o === n && ye(t) && C === a && ut({
				phase: "error",
				save: "uncertain",
				message: "The sign-out may have completed. Check your active sessions before another action. It has not been sent again."
			});
		} finally {
			C === a && (C = void 0);
		}
	}
	function ht() {
		pe(), k("Signing out…", !0);
		try {
			ue?.postMessage({ kind: "auth-changed" });
		} catch {}
	}
	function gt() {
		let e = () => k("Workspace hidden. Checking access on return."), n = () => {
			be();
		}, r = () => {
			document.visibilityState === "visible" ? n() : e();
		};
		try {
			ue = new BroadcastChannel("keida-hub-reborn.account.v1"), ue.onmessage = (e) => {
				Q(e.data) && e.data.kind === "auth-changed" && k("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), be(), () => {
			D = !0, he(), ue?.close(), t.set(ra("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
		};
	}
	return {
		model: t,
		start: gt,
		edit: xe,
		recover: Se,
		resolve: Ce,
		save: we,
		signOut: ht,
		check: () => be(!0),
		editService: Ee,
		pins: De,
		activity: Le,
		markNotification: Oe,
		beginLayout: ke,
		moveLayout: je,
		toggleLayout: Me,
		resetLayout: Ne,
		cancelLayout: Pe,
		resolveLayout: Fe,
		saveLayout: Ie,
		checkLayout: () => be(!0),
		loadGuide: Re,
		observations: ze,
		openMedia: Ge,
		closeMedia: Ue,
		checkMedia: We,
		loadMedia: Ke,
		saveMedia: qe,
		openQueues: $e,
		closeQueues: Ze,
		checkQueues: Qe,
		loadQueues: et,
		saveQueues: tt,
		openIdentity: st,
		closeIdentity: it,
		checkIdentity: ot,
		identityAction: ct,
		saveDiscordApplication: lt,
		openSessions: pt,
		closeSessions: dt,
		checkSessions: P,
		revokeSession: mt
	};
}
// src/LayoutEditor.svelte
var Va = /* @__PURE__ */ K("<li tabindex=\"-1\"><label><input type=\"checkbox\"/><span> </span></label> <div class=\"layout-move\"><button class=\"button secondary layout-up\">↑<span class=\"sr-only\">Move up</span></button><button class=\"button secondary layout-down\">↓<span class=\"sr-only\">Move down</span></button></div></li>"), Ha = /* @__PURE__ */ K("<li> </li>"), Ua = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Layout conflict\"><h3>There’s a newer saved layout</h3><p>Your arrangement is still shown. Compare it with the saved order below before choosing what to keep.</p><ol></ol><div class=\"button-row\"><button class=\"button secondary\">Keep my layout against saved layout</button><button class=\"text-button layout-use-saved\">Use saved layout</button></div></section>"), Wa = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain layout\"><h3>Check before saving again</h3><p>The layout may have saved. Your arrangement has not been sent again.</p><button class=\"button secondary check-layout check-saved-layout\">Check saved layout</button></section>"), Ga = /* @__PURE__ */ K("<section class=\"layout-editor card\" aria-label=\"Home layout\"><h2>Make Home yours</h2><p>Choose the panels you see and their order. Keep at least one visible. Your other views and open forms stay available.</p> <ol class=\"layout-list\"></ol> <!> <!> <div class=\"button-row\"><button class=\"button primary save-layout\"> </button><button class=\"text-button cancel-layout\">Cancel layout</button><button class=\"text-button reset-layout\">Reset layout</button></div> <p class=\"field-help\">Reset previews the default order and visibility. Save layout applies it to this account.</p></section>");
function Ka(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = Z(t, "draft", 8), o = Z(t, "saved", 8), s = Z(t, "state", 8), c = Z(t, "authorized", 8), l = Z(t, "move", 8), u = Z(t, "toggle", 8), d = Z(t, "save", 8), f = Z(t, "cancel", 8), p = Z(t, "reset", 8), m = Z(t, "resolve", 8), h = Z(t, "check", 8);
	async function g(e, t) {
		l()(e, t), await pr(), document.querySelector(`[data-layout-row="${e}"]`)?.focus();
	}
	wn(() => (W(c()), W(s())), () => {
		L(n, !c() || [
			"saving",
			"checking-conflict",
			"uncertain"
		].includes(s()));
	}), wn(() => W(a()), () => {
		L(r, a()?.panels.filter((e) => e.visible).length ?? 0);
	}), wn(() => (W(a()), W(o())), () => {
		L(i, !!a() && !!o() && a().panels.some((e, t) => e.id !== o()?.panels[t].id || e.visible !== o()?.panels[t].visible));
	}), Tn(), Ti();
	var _ = Ga(), v = B(R(_), 3);
	qr(v, 7, () => (W(a()), U(() => a()?.panels ?? [])), (e) => e.id, (e, t, i) => {
		var a = Va(), o = R(a), s = R(o);
		pi(s);
		var c = z(B(s), !0);
		M(o);
		var l = B(o, 2), d = R(l), f = B(d);
		M(l), M(a), V((e, o, l, u) => {
			X(a, "data-layout-row", (H(t), U(() => H(t).id))), X(s, "aria-label", e), hi(s, (H(t), U(() => H(t).visible))), s.disabled = (H(n), H(t), H(r), U(() => H(n) || H(t).visible && H(r) === 1)), J(c, o), X(d, "aria-label", l), d.disabled = H(n) || H(i) === 0, X(f, "aria-label", u), f.disabled = H(n) || H(i) === 2;
		}, [
			() => (W(Gi), H(t), U(() => `Show ${Gi(H(t).id)}`)),
			() => (W(Gi), H(t), U(() => Gi(H(t).id))),
			() => (W(Gi), H(t), U(() => `Move ${Gi(H(t).id)} up`)),
			() => (W(Gi), H(t), U(() => `Move ${Gi(H(t).id)} down`))
		]), G("change", s, () => u()(H(t).id)), G("click", d, () => g(H(t).id, -1)), G("click", f, () => g(H(t).id, 1)), q(e, a);
	}), M(v);
	var y = B(v, 2), b = (e) => {
		var t = Ua(), n = B(R(t), 2);
		qr(n, 5, () => (W(o()), U(() => o()?.panels ?? [])), (e) => e.id, (e, t) => {
			var n = Ha(), r = z(n);
			V((e) => J(r, `${e ?? ""} — ${H(t), U(() => H(t).visible ? "Shown" : "Hidden") ?? ""}`), [() => (W(Gi), H(t), U(() => Gi(H(t).id)))]), q(e, n);
		}), M(n);
		var r = B(n), i = R(r), a = B(i);
		M(r), M(t), G("click", i, () => m()(!1)), G("click", a, () => m()(!0)), q(e, t);
	};
	Y(y, (e) => {
		s() === "conflict" && e(b);
	});
	var x = B(y, 2), S = (e) => {
		var t = Wa(), n = B(R(t), 2);
		M(t), G("click", n, () => h()()), q(e, t);
	};
	Y(x, (e) => {
		s() === "uncertain" && e(S);
	});
	var C = B(x, 2), w = R(C), T = z(w, !0), E = B(w), ee = B(E);
	M(C), be(2), M(_), V(() => {
		X(_, "hidden", !c() || !a()), w.disabled = H(n) || s() === "conflict" || !H(i), J(T, s() === "saving" ? "Saving layout…" : "Save layout"), E.disabled = H(n), ee.disabled = H(n);
	}), G("click", w, () => d()()), G("click", E, function(...e) {
		f()?.apply(this, e);
	}), G("click", ee, function(...e) {
		p()?.apply(this, e);
	}), q(e, _), Ue();
}
wr(["change", "click"]);
// src/ObservationHistory.svelte
var qa = /* @__PURE__ */ K("<p class=\"observation-empty\">No retained observations in this window. A connection must be enrolled and observed before samples appear.</p>"), Ja = /* @__PURE__ */ K("<p class=\"notice\"> </p>"), Ya = /* @__PURE__ */ K("<p class=\"field-help\"> </p>"), Xa = /* @__PURE__ */ K("<section><h4> </h4> <dl><dt>Reported process</dt><dd> </dd> <dt>Players</dt><dd> </dd> <dt>Freshness at collection</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd></dl> <!></section>"), Za = /* @__PURE__ */ K("<li><div class=\"guide-card-heading\"><h3> </h3><time> </time></div> <p class=\"observation-completeness\"> </p> <!> <div class=\"observation-servers\"></div></li>"), Qa = /* @__PURE__ */ K("<p class=\"quiet-label\"> </p> <!> <ol class=\"observation-list\"></ol>", 1), $a = /* @__PURE__ */ K("<section class=\"card observation-history\" aria-label=\"Provider observation history\"><p class=\"eyebrow\">RETAINED PROVIDER SAMPLES</p><h2 tabindex=\"-1\">Crafty observation history</h2> <p>Samples are collected while an authorized workspace checks the enrolled connection. At most the first sample per enrollment revision each minute is retained, up to the newest 10,000 batches.</p> <p class=\"field-help\">This is sampled, on-demand history. Gaps do not establish downtime, and a process or player report does not establish game readiness. Freshness below describes the sample at collection time.</p> <p> </p> <p class=\"workspace-status observation-status\" role=\"status\"> </p> <!> <div class=\"button-row\"><button class=\"button secondary observation-newest\">Check newest observations</button><button class=\"button secondary observation-older\">Older observations</button><button class=\"text-button\">Check current connection</button></div> <p class=\"field-help\">Up to 25 batches per page. New samples appear when you check newest. Older pages use the same history window; retention can shorten that window as new samples arrive. Reading history does not contact Crafty.</p></section>");
function eo(e, t) {
	He(t, !1);
	let n = Z(t, "state", 8), r = Z(t, "authorized", 8, !1), i = Z(t, "owner", 8, !1), a = Z(t, "load", 8), o = Z(t, "checkConnection", 8), s = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString(), c = (e) => e === "denied" ? "Provider access denied" : e === "timeout" ? "Provider timed out" : e === "transport" ? "Provider could not be reached" : e === "not_discovered" ? "Selected server was not discovered" : e === "malformed" ? "Provider response was incomplete or malformed" : e === "oversized" ? "Provider response exceeded the observation limit" : e === "invalid_configuration" ? "Connection could not be checked" : e ? "Provider observation unavailable" : "";
	Ti();
	var l = $a(), u = B(R(l), 7), d = z(u, !0), f = B(u, 2), p = z(f, !0), m = B(f, 2), h = (e) => {
		var t = Qa(), r = sn(t), i = z(r), a = B(r, 2), o = (e) => {
			q(e, qa());
		};
		Y(a, (e) => {
			W(n()), U(() => n().entries.length === 0) && e(o);
		});
		var l = B(a, 2);
		qr(l, 5, () => (W(n()), U(() => n().entries)), (e) => e.id, (e, t) => {
			var n = Za(), r = R(n), i = R(r), a = z(i), o = B(i), l = z(o, !0);
			M(r);
			var u = B(r, 2), d = z(u, !0), f = B(u, 2), p = (e) => {
				var n = Ja(), r = z(n, !0);
				V((e) => J(r, e), [() => (H(t), U(() => c(H(t).error)))]), q(e, n);
			};
			Y(f, (e) => {
				H(t), U(() => H(t).error) && e(p);
			});
			var m = B(f, 2);
			qr(m, 5, () => (H(t), U(() => H(t).servers)), Ur, (e, t) => {
				var n = Xa(), r = R(n), i = z(r, !0), a = B(r, 2), o = B(R(a)), l = z(o, !0), u = B(o, 3), d = z(u), f = B(u, 3), p = z(f, !0), m = B(f, 3), h = z(m, !0), g = z(B(m, 2), !0);
				M(a);
				var _ = B(a, 2), v = (e) => {
					var n = Ya(), r = z(n, !0);
					V((e) => J(r, e), [() => (H(t), U(() => c(H(t).error)))]), q(e, n);
				};
				Y(_, (e) => {
					H(t), U(() => H(t).error) && e(v);
				}), M(n), V((e, r) => {
					X(n, "aria-label", (H(t), U(() => `Observation for ${H(t).name}`))), J(i, (H(t), U(() => H(t).name))), J(l, (H(t), U(() => H(t).state === "running" ? "Running" : H(t).state === "stopped" ? "Stopped" : "Unknown"))), J(d, `${H(t), U(() => H(t).players === null ? "Not reported" : `${H(t).players} reported`) ?? ""}${H(t), U(() => H(t).capacity === null ? "" : ` / ${H(t).capacity} capacity`) ?? ""}`), J(p, (H(t), U(() => H(t).freshness === "fresh" ? "Fresh at collection" : H(t).freshness === "stale" ? "Stale at collection" : "Sample age was unknown"))), J(h, e), J(g, r);
				}, [() => (H(t), U(() => s(H(t).collected_at))), () => (H(t), U(() => s(H(t).provider_at)))]), q(e, n);
			}), M(m), M(n), V((e, r) => {
				X(n, "data-observation-id", (H(t), U(() => H(t).id))), X(n, "data-observation-revision", (H(t), U(() => H(t).revision))), J(a, `Enrollment revision ${H(t), U(() => H(t).revision) ?? ""}`), X(o, "datetime", e), J(l, r), J(d, (H(t), U(() => H(t).complete ? "Complete provider sample" : "Incomplete provider sample")));
			}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).checked_at) * 1e3)).toISOString())), () => (H(t), U(() => s(H(t).checked_at)))]), q(e, n);
		}), M(l), V(() => {
			X(r, "data-current-revision", (W(n()), U(() => n().revision))), J(i, `Current enrollment revision ${W(n()), U(() => n().revision) ?? ""}`);
		}), q(e, t);
	};
	Y(m, (e) => {
		W(r()), W(n()), U(() => r() && n().phase === "ready") && e(h);
	});
	var g = B(m, 2), _ = R(g), v = B(_), y = B(v);
	M(g), be(2), M(l), V(() => {
		J(d, i() ? "Your owner account can review retained samples from prior enrollment revisions." : "Your account sees samples only for the currently enrolled servers. Replacing or removing a connection changes this history scope."), J(p, (W(n()), U(() => n().message))), _.disabled = (W(r()), W(n()), U(() => !r() || n().phase === "loading")), v.disabled = (W(r()), W(n()), U(() => !r() || n().phase !== "ready" || !n().next)), y.disabled = !r();
	}), G("click", _, () => void a()()), G("click", v, () => void a()(!0)), G("click", y, () => void o()()), q(e, l), Ue();
}
wr(["click"]);
// src/Connections.svelte
var to = /* @__PURE__ */ K("<p class=\"notice\" role=\"status\">This observation could not be added to history. Your workspace is still available; retained history may be incomplete.</p>"), no = /* @__PURE__ */ K("<section class=\"card small-card\"><h2>No Crafty connection enrolled</h2><p>An owner can add dedicated access and choose which servers to show.</p></section>"), ro = /* @__PURE__ */ K("<p class=\"notice\" role=\"status\"> </p>"), io = /* @__PURE__ */ K("<p class=\"field-help\">This server could not be fully observed.</p>"), ao = /* @__PURE__ */ K("<article class=\"card small-card server-card\"><h2> </h2> <p><strong> </strong> <span class=\"field-help\">Provider-reported process state</span></p> <dl><dt>Players</dt><dd> </dd> <dt>Freshness</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd> <dt>Join address</dt><dd> </dd></dl> <!></article>"), oo = /* @__PURE__ */ K("<!> <div class=\"server-grid\"></div> <p class=\"field-help\">A running process does not establish game readiness. Join addresses are owner-reviewed; outside-network joining is accepted separately.</p>", 1), so = /* @__PURE__ */ K("<button class=\"button secondary\">Check connection state</button>"), co = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove server</button>"), lo = /* @__PURE__ */ K("<fieldset><legend> </legend> <label>Crafty server UUID</label><input name=\"server-id\" required=\"\" maxlength=\"36\"/> <label>Display name</label><input name=\"server-name\" required=\"\" maxlength=\"80\"/> <label>Reviewed public join address, optional</label><input name=\"server-join\" maxlength=\"253\" placeholder=\"play.example:25565\"/> <!></fieldset>"), uo = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove connection</button>"), fo = /* @__PURE__ */ K("<section class=\"card connection-setup\" aria-label=\"Dedicated Crafty enrollment\"><h2>Dedicated Crafty access</h2> <p>Create access specifically for Reborn, limited to viewing the selected servers. Credentials are encrypted on the server and are not shown again.</p> <p class=\"workspace-status\" role=\"status\"> </p> <!> <form autocomplete=\"off\"><label for=\"crafty-endpoint\">Crafty HTTPS address</label><input id=\"crafty-endpoint\" name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\" placeholder=\"https://crafty.example/\"/> <label for=\"crafty-token\">Dedicated API token</label><input id=\"crafty-token\" name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label for=\"crafty-timezone\">Crafty’s configured time zone</label><input id=\"crafty-timezone\" name=\"timezone\" required=\"\" maxlength=\"64\" placeholder=\"America/Chicago or UTC\"/> <label for=\"crafty-ca\">Private CA certificate, if needed</label><textarea id=\"crafty-ca\" name=\"ca-pem\" maxlength=\"8192\" rows=\"3\"></textarea> <p class=\"field-help\">Leave the certificate blank for publicly trusted HTTPS. The address and certificate must pass normal hostname and trust checks.</p> <!> <div class=\"button-row\"><button class=\"button secondary\" type=\"button\">Add server</button> <button class=\"button primary\" type=\"submit\"> </button></div></form> <!></section>"), po = /* @__PURE__ */ K("<div><div class=\"button-row\"><button class=\"text-button\">View connection enrollment history</button><button class=\"text-button view-observation-history\">View provider observation history</button></div> <!> <div class=\"connections-intro\"><p>Server observations from your deliberately enrolled Crafty connection.</p><span class=\"quiet-label\">Read-only overview</span></div> <!> <!></div> <div><button class=\"text-button observation-back\">Back to connections</button> <!></div>", 1);
function mo(e, t) {
	He(t, !1);
	let n = Z(t, "binding", 8), r = Z(t, "history", 8), i = Z(t, "overview", 8), a = Z(t, "owner", 8, !1), o = Z(t, "active", 8, !1), s = Z(t, "refresh", 8), c = Z(t, "observationState", 8), l = Z(t, "loadObservations", 8), u = /* @__PURE__ */ I(), d = /* @__PURE__ */ I([0]), f = /* @__PURE__ */ I(0), p = /* @__PURE__ */ I(), m = /* @__PURE__ */ I(""), h = /* @__PURE__ */ I(!1), g = 0, _ = /* @__PURE__ */ I(!1), v = /* @__PURE__ */ I(), y = /* @__PURE__ */ I(), b = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
	function x() {
		++g, H(p)?.abort(), L(p, void 0), H(u)?.reset(), L(d, [Kt(f)]), L(m, ""), L(h, !1);
	}
	Li(x);
	async function S() {
		o() && (L(_, !0), l()(), await pr(), H(y)?.querySelector("h2")?.focus());
	}
	async function C() {
		L(_, !1), await pr(), H(v)?.focus();
	}
	async function w(e = !1) {
		if (!o() || !a() || H(p) || !i() || H(h)) return;
		let t = i().revision, r = H(u) ? new FormData(H(u)) : void 0, c = (e) => r?.getAll(e).map(String) ?? [], l = c("server-id"), _ = c("server-name"), v = c("server-join"), y = e ? null : {
			endpoint: String(r?.get("endpoint") ?? ""),
			token: String(r?.get("token") ?? ""),
			ca_pem: String(r?.get("ca-pem") ?? ""),
			timezone: String(r?.get("timezone") ?? ""),
			servers: l.map((e, t) => ({
				id: e,
				name: _[t] ?? "",
				join: v[t] ?? ""
			}))
		};
		H(u)?.reset(), L(d, [Kt(f)]);
		let b = new AbortController();
		L(p, b);
		let x = ++g, S = setTimeout(() => b.abort(), 4e3);
		L(m, e ? "Removing the connection…" : "Saving the dedicated connection…");
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
			if (x !== g || !o()) return;
			if (r.status === 200) L(m, e ? "Connection removed." : "Connection saved. Checking provider observations…");
			else if (r.status === 409) L(m, "The connection changed elsewhere. Check its current state before enrolling again.");
			else if ([
				400,
				401,
				403,
				413,
				426
			].includes(r.status)) L(m, "Connection not accepted. Check your account and the dedicated connection details.");
			else throw Error("Uncertain connection outcome");
			await s()();
		} catch {
			x === g && o() && (L(h, !0), L(m, "The save outcome is uncertain. Check the connection before entering credentials again."));
		} finally {
			clearTimeout(S), H(p) === b && L(p, void 0);
		}
	}
	async function T() {
		await s()(), o() && (L(h, !1), L(m, "Review the current connection state before making another change."));
	}
	wn(() => W(o()), () => {
		o() || (x(), L(_, !1));
	}), Tn(), Ti();
	var E = po(), ee = sn(E), te = R(ee), ne = R(te), re = B(ne);
	wi(re, (e) => L(v, e), () => H(v)), M(te);
	var ie = B(te, 2), ae = (e) => {
		q(e, to());
	};
	Y(ie, (e) => {
		W(i()), U(() => i()?.history_error === "unavailable") && e(ae);
	});
	var oe = B(ie, 4), se = (e) => {
		q(e, no());
	}, ce = (e) => {
		var t = oo(), n = sn(t), r = (e) => {
			var t = ro(), n = z(t, !0);
			V(() => J(n, (W(i()), U(() => i().error === "checking" ? "Checking the provider. Fresh results will appear on the next observation." : "Provider observations are unavailable or incomplete. Unknown player counts stay unknown.")))), q(e, t);
		};
		Y(n, (e) => {
			W(i()), U(() => i().error) && e(r);
		});
		var a = B(n, 2);
		qr(a, 5, () => (W(i()), U(() => i().servers)), Ur, (e, t) => {
			var n = ao(), r = R(n), i = z(r, !0), a = B(r, 2), o = z(R(a), !0);
			be(2), M(a);
			var s = B(a, 2), c = B(R(s)), l = z(c), u = B(c, 3), d = z(u, !0), f = B(u, 3), p = z(f, !0), m = B(f, 2), h = z(m, !0), g = z(B(m, 3), !0);
			M(s);
			var _ = B(s, 2), v = (e) => {
				q(e, io());
			};
			Y(_, (e) => {
				H(t), U(() => H(t).error) && e(v);
			}), M(n), V((e, n) => {
				J(i, (H(t), U(() => H(t).name))), J(o, (H(t), U(() => H(t).state === "running" ? "Running" : H(t).state === "stopped" ? "Stopped" : "Unknown"))), J(l, `${H(t), U(() => H(t).players === null ? "Not reported" : `${H(t).players} reported`) ?? ""}${H(t), U(() => H(t).capacity === null ? "" : ` / ${H(t).capacity} capacity`) ?? ""}`), J(d, (H(t), U(() => H(t).freshness === "fresh" ? "Recent provider sample" : H(t).freshness === "stale" ? "Stale provider sample" : "Provider sample age unknown"))), J(p, e), J(h, n), J(g, (H(t), U(() => H(t).join || "Not configured")));
			}, [() => (H(t), U(() => b(H(t).collected_at))), () => (H(t), U(() => b(H(t).provider_at)))]), q(e, n);
		}), M(a), be(2), q(e, t);
	};
	Y(oe, (e) => {
		W(i()), U(() => !i() || !i().configured) ? e(se) : e(ce, -1);
	});
	var le = B(oe, 2), ue = (e) => {
		var t = fo(), n = B(R(t), 4), r = z(n, !0), a = B(n, 2), o = (e) => {
			var t = so();
			G("click", t, () => void T()), q(e, t);
		};
		Y(a, (e) => {
			H(h) && e(o);
		});
		var s = B(a, 2), c = B(R(s)), l = B(c, 3), g = B(l, 3), _ = B(g, 3), v = B(_, 4);
		qr(v, 3, () => H(d), (e) => e, (e, t, n) => {
			var r = lo(), i = R(r), a = z(i), o = B(i, 2), s = B(o), c = B(s, 2), l = B(c), u = B(l, 2), f = B(u), m = B(f, 2), g = (e) => {
				var n = co();
				V(() => n.disabled = !!H(p) || H(h)), G("click", n, () => L(d, H(d).filter((e) => e !== H(t)))), q(e, n);
			};
			Y(m, (e) => {
				H(d), U(() => H(d).length > 1) && e(g);
			}), M(r), V(() => {
				J(a, `Server ${H(n) + 1}`), X(o, "for", `crafty-id-${H(t)}`), X(s, "id", `crafty-id-${H(t)}`), s.disabled = !!H(p) || H(h), X(c, "for", `crafty-name-${H(t)}`), X(l, "id", `crafty-name-${H(t)}`), l.disabled = !!H(p) || H(h), X(u, "for", `crafty-join-${H(t)}`), X(f, "id", `crafty-join-${H(t)}`), f.disabled = !!H(p) || H(h);
			}), q(e, r);
		});
		var y = B(v, 2), b = R(y), x = B(b, 2), S = z(x, !0);
		M(y), M(s), wi(s, (e) => L(u, e), () => H(u));
		var C = B(s, 2), E = (e) => {
			var t = uo();
			V(() => t.disabled = !!H(p) || H(h)), G("click", t, () => void w(!0)), q(e, t);
		};
		Y(C, (e) => {
			W(i()), U(() => i()?.configured) && e(E);
		}), M(t), V(() => {
			J(r, H(m)), c.disabled = !!H(p) || H(h), l.disabled = !!H(p) || H(h), g.disabled = !!H(p) || H(h), _.disabled = !!H(p) || H(h), b.disabled = (H(d), H(p), H(h), U(() => H(d).length >= 8 || !!H(p) || H(h))), x.disabled = !!H(p) || H(h) || !i(), J(S, H(p) ? "Working…" : "Save dedicated connection");
		}), Cr("submit", s, (e) => {
			e.preventDefault(), w();
		}), G("click", b, () => L(d, [...H(d), Kt(f)])), q(e, t);
	};
	Y(le, (e) => {
		a() && o() && e(ue);
	}), M(ee);
	var D = B(ee, 2), de = R(D);
	eo(B(de, 2), {
		get state() {
			return c();
		},
		get authorized() {
			return o();
		},
		get owner() {
			return a();
		},
		get load() {
			return l();
		},
		get checkConnection() {
			return s();
		}
	}), M(D), wi(D, (e) => L(y, e), () => H(y)), V(() => {
		X(ee, "hidden", H(_)), re.disabled = !o(), X(D, "hidden", !H(_));
	}), G("click", ne, function(...e) {
		r()?.apply(this, e);
	}), G("click", re, () => void S()), G("click", de, () => void C()), q(e, E), Ue();
}
wr(["click"]);
// src/Directory.svelte
var ho = /* @__PURE__ */ K("<button class=\"text-button\">Browse services <span aria-hidden=\"true\">→</span></button>"), go = /* @__PURE__ */ K("<section class=\"notice\"><h3>Review the saved state</h3><p> </p><button class=\"button secondary\">Check saved services</button></section>"), _o = /* @__PURE__ */ K("<option> </option>"), vo = /* @__PURE__ */ K("<div class=\"directory-filters\"><div><label for=\"service-search\">Search services</label><input id=\"service-search\" type=\"search\" maxlength=\"120\" placeholder=\"Name, category or description\"/></div><div><label for=\"service-filter\">Category</label><select id=\"service-filter\"><option>All categories</option><!></select></div></div>"), yo = /* @__PURE__ */ K("<section class=\"card small-card\"><h3> </h3><p> </p></section>"), bo = /* @__PURE__ */ K("<p> </p>"), xo = /* @__PURE__ */ K("<button class=\"text-button move-up\">↑</button><button class=\"text-button move-down\">↓</button>", 1), So = /* @__PURE__ */ K("<p>The directory changed. Review the service and choose Remove again.</p>"), Co = /* @__PURE__ */ K("<div class=\"notice\"><p> </p><!><div class=\"button-row\"><button class=\"button secondary confirm-remove\">Remove service</button><button class=\"text-button\">Keep service</button></div></div>"), wo = /* @__PURE__ */ K("<div class=\"button-row\"><button class=\"text-button edit-service\"> </button><button class=\"text-button remove-service\">Remove</button></div> <!>", 1), To = /* @__PURE__ */ K("<article class=\"card small-card service-card\"><p class=\"eyebrow\"> </p><h3><a class=\"service-link\" target=\"_blank\" rel=\"noopener noreferrer\"> <span class=\"sr-only\">(opens in a new tab)</span> <span aria-hidden=\"true\">↗</span></a></h3> <!> <p class=\"field-help service-address\"> </p> <div class=\"button-row\"><button class=\"button secondary pin-service\"> </button> <!></div> <!></article>"), Eo = /* @__PURE__ */ K("<div class=\"directory-grid\"></div>"), Do = /* @__PURE__ */ K("<p class=\"field-help\">Up to 24 personal pins. Links open the selected service in a new tab. Each service handles its own sign-in; directory links do not check availability.</p>"), Oo = /* @__PURE__ */ K("<div class=\"notice\"><p>The directory changed after this form was opened. Review the current entries, then choose whether to keep this edit.</p><button class=\"button secondary\" type=\"button\">Keep edit against current directory</button></div>"), ko = /* @__PURE__ */ K("<section class=\"card directory-editor\" aria-label=\"Service editor\"><h2> </h2><p>Add a reviewed HTTPS link without passwords, tokens, query parameters or fragments. These links are visible to signed-in accounts.</p> <form><label for=\"service-name\">Service name</label><input id=\"service-name\" name=\"service-name\" required=\"\" maxlength=\"80\"/> <label for=\"service-category\">Category</label><input id=\"service-category\" name=\"service-category\" required=\"\" maxlength=\"40\"/> <label for=\"service-url\">HTTPS link</label><input id=\"service-url\" name=\"service-url\" type=\"url\" required=\"\" maxlength=\"1024\" placeholder=\"https://service.example/\"/> <label for=\"service-description\">Description, optional</label><textarea id=\"service-description\" name=\"service-description\" maxlength=\"240\" rows=\"2\"></textarea> <!> <div class=\"button-row\"><button class=\"button primary\" type=\"submit\"> </button><button class=\"text-button\" type=\"button\"> </button></div></form></section>"), Ao = /* @__PURE__ */ K("<div class=\"directory-heading\"><div><p class=\"eyebrow\"> </p><h2> </h2></div><!></div> <p class=\"directory-status\" role=\"status\"> </p> <!> <!> <!> <!> <!>", 1);
function jo(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = Z(t, "directory", 8), o = Z(t, "authorized", 8, !1), s = Z(t, "owner", 8, !1), c = Z(t, "compact", 8, !1), l = Z(t, "state", 8), u = Z(t, "message", 8), d = Z(t, "browse", 8), f = Z(t, "check", 8), p = Z(t, "edit", 8), m = Z(t, "pin", 8), h = /* @__PURE__ */ I(""), g = /* @__PURE__ */ I(""), _ = /* @__PURE__ */ I(""), v = /* @__PURE__ */ I(""), y = /* @__PURE__ */ I(""), b = /* @__PURE__ */ I(""), x = /* @__PURE__ */ I(""), S = /* @__PURE__ */ I(), C = /* @__PURE__ */ I(), w = 0;
	function T() {
		++w, L(h, ""), L(g, ""), L(_, ""), L(v, ""), L(y, ""), L(b, ""), L(x, ""), L(C, void 0), L(S, void 0);
	}
	Li(T);
	function E() {
		L(_, ""), L(v, ""), L(y, ""), L(b, ""), L(x, ""), L(C, void 0), L(S, a()?.revision);
	}
	function ee(e) {
		L(x, e.id), L(_, e.name), L(v, e.description), L(y, e.url), L(b, e.category), L(S, a()?.revision), L(C, void 0), document.querySelector("#service-name")?.focus();
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
		await p()(H(S), t) && o() && e === w && (await pr(), o() && e === w && E());
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
		}) && o() && t === w && (await pr(), o() && t === w && (L(C, void 0), H(x) === e && E()));
	}
	wn(() => (W(l()), W(o())), () => {
		L(n, l() === "saving" || l() === "uncertain" || !o());
	}), wn(() => W(a()), () => {
		L(r, [...new Set(a()?.services.map((e) => e.category) ?? [])].sort());
	}), wn(() => (H(g), H(r)), () => {
		H(g) && !H(r).includes(H(g)) && L(g, "");
	}), wn(() => (W(a()), W(c()), H(g), H(h)), () => {
		L(i, [...a()?.services ?? []].sort((e, t) => {
			let n = a()?.pins.indexOf(e.id) ?? -1, r = a()?.pins.indexOf(t.id) ?? -1;
			return n >= 0 || r >= 0 ? (n < 0 ? 25 : n) - (r < 0 ? 25 : r) : e.name.localeCompare(t.name) || Number(BigInt(e.id) - BigInt(t.id));
		}).filter((e) => c() ? a()?.pins.includes(e.id) : (!H(g) || e.category === H(g)) && `${e.name} ${e.category} ${e.description}`.toLocaleLowerCase().includes(H(h).toLocaleLowerCase())));
	}), wn(() => W(o()), () => {
		o() || T();
	}), wn(() => (W(o()), W(a()), H(S)), () => {
		o() && a() && H(S) === void 0 && L(S, a().revision);
	}), Tn(), Ti();
	var ae = Ao(), oe = sn(ae), se = R(oe), ce = R(se), le = z(ce, !0), ue = z(B(ce), !0);
	M(se);
	var D = B(se), de = (e) => {
		var t = ho();
		G("click", t, function(...e) {
			d()?.apply(this, e);
		}), q(e, t);
	};
	Y(D, (e) => {
		c() && e(de);
	}), M(oe);
	var O = B(oe, 2), fe = z(O, !0), pe = B(O, 2), me = (e) => {
		var t = go(), n = B(R(t)), r = z(n, !0), i = B(n);
		M(t), V(() => J(r, l() === "uncertain" ? "Your change has not been sent again." : "Your edit is still in the form. Compare it with the current directory before saving.")), G("click", i, () => void f()()), q(e, t);
	};
	Y(pe, (e) => {
		(l() === "uncertain" || l() === "conflict") && e(me);
	});
	var he = B(pe, 2), k = (e) => {
		var t = vo(), n = R(t), i = B(R(n));
		pi(i), M(n);
		var a = B(n), o = B(R(a)), s = R(o);
		s.value = s.__value = "", qr(B(s), 1, () => H(r), Ur, (e, t) => {
			var n = _o(), r = z(n, !0), i = {};
			V(() => {
				J(r, H(t)), i !== (i = H(t)) && (n.value = (n.__value = i) ?? "");
			}), q(e, n);
		}), M(o), ai(o), M(a), M(t), yi(i, () => H(h), (e) => L(h, e)), oi(o, () => H(g), (e) => L(g, e)), q(e, t);
	};
	Y(he, (e) => {
		c() || e(k);
	});
	var ge = B(he, 2), A = (e) => {
		var t = yo(), n = R(t), r = z(n, !0), i = z(B(n), !0);
		M(t), V(() => {
			J(r, (W(c()), W(a()), U(() => c() ? "Keep your favorites close" : a()?.services.length ? "No matching services" : "Your directory starts here"))), J(i, (W(c()), W(a()), W(s()), U(() => c() ? "Pin services from the directory to show them on Home." : a()?.services.length ? "Try another search or category." : s() ? "Add a service below to make it available to signed-in accounts." : "An owner can add reviewed service links.")));
		}), q(e, t);
	}, _e = (e) => {
		var t = Eo();
		qr(t, 5, () => H(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ P(() => (W(a()), H(t), U(() => a()?.pins.includes(H(t).id) ?? !1))), i = /* @__PURE__ */ P(() => (W(a()), H(t), U(() => a()?.pins.indexOf(H(t).id) ?? -1)));
			var o = To(), l = R(o), u = z(l, !0), d = B(l), f = R(d), p = R(f, !0);
			be(3), M(f), M(d);
			var m = B(d, 2), h = (e) => {
				var n = bo(), r = z(n, !0);
				V(() => J(r, (H(t), U(() => H(t).description)))), q(e, n);
			};
			Y(m, (e) => {
				H(t), U(() => H(t).description) && e(h);
			});
			var g = B(m, 2), _ = z(g, !0), v = B(g, 2), y = R(v), b = z(y, !0), x = B(y, 2), S = (e) => {
				var r = xo(), o = sn(r), s = B(o);
				V(() => {
					X(o, "aria-label", (H(t), U(() => `Move ${H(t).name} up`))), o.disabled = H(n) || H(i) === 0, X(s, "aria-label", (H(t), U(() => `Move ${H(t).name} down`))), s.disabled = (H(n), W(H(i)), W(a()), U(() => H(n) || H(i) === (a()?.pins.length ?? 0) - 1));
				}), G("click", o, () => re(H(t).id, -1)), G("click", s, () => re(H(t).id, 1)), q(e, r);
			};
			Y(x, (e) => {
				H(r) && e(S);
			}), M(v);
			var w = B(v, 2), T = (e) => {
				var r = wo(), i = sn(r), o = R(i), s = z(o), c = B(o);
				M(i);
				var l = B(i, 2), u = (e) => {
					var r = Co(), i = R(r), o = z(i), s = B(i), c = (e) => {
						q(e, So());
					};
					Y(s, (e) => {
						H(C), W(a()), U(() => H(C).base !== a()?.revision) && e(c);
					});
					var l = B(s), u = R(l), d = B(u);
					M(l), M(r), V(() => {
						J(o, `Remove ${H(C), U(() => H(C).name) ?? ""} from the directory and everyone’s pins?`), u.disabled = (H(n), H(C), W(a()), U(() => H(n) || H(C).base !== a()?.revision));
					}), G("click", u, () => void ie(H(t).id)), G("click", d, () => L(C, void 0)), q(e, r);
				};
				Y(l, (e) => {
					H(C), H(t), U(() => H(C)?.id === H(t).id) && e(u);
				}), V(() => {
					o.disabled = H(n), J(s, `Edit ${H(t), U(() => H(t).name) ?? ""}`), c.disabled = H(n);
				}), G("click", o, () => ee(H(t))), G("click", c, () => L(C, a() ? {
					id: H(t).id,
					base: a().revision,
					name: H(t).name
				} : void 0)), q(e, r);
			};
			Y(w, (e) => {
				s() && !c() && e(T);
			}), M(o), V(() => {
				X(o, "data-service-id", (H(t), U(() => H(t).id))), J(u, (H(t), U(() => H(t).category))), X(f, "href", (H(t), U(() => H(t).url))), J(p, (H(t), U(() => H(t).name))), J(_, (H(t), U(() => H(t).url))), X(y, "aria-pressed", H(r)), X(y, "aria-label", (W(H(r)), H(t), U(() => `${H(r) ? "Unpin" : "Pin"} ${H(t).name}`))), y.disabled = (H(n), W(H(r)), W(a()), U(() => H(n) || !H(r) && (a()?.pins.length ?? 0) >= 24)), J(b, H(r) ? "Pinned" : "Pin to Home");
			}), G("click", y, () => ne(H(t).id)), q(e, o);
		}), M(t), q(e, t);
	};
	Y(ge, (e) => {
		H(i), U(() => H(i).length === 0) ? e(A) : e(_e, -1);
	});
	var j = B(ge, 2), ve = (e) => {
		q(e, Do());
	};
	Y(j, (e) => {
		c() || e(ve);
	});
	var ye = B(j, 2), xe = (e) => {
		var t = ko(), r = R(t), i = z(r, !0), o = B(r, 3), s = B(R(o));
		pi(s);
		var u = B(s, 3);
		pi(u);
		var d = B(u, 3);
		pi(d);
		var f = B(d, 3);
		et(f);
		var p = B(f, 2), m = (e) => {
			var t = Oo(), r = B(R(t));
			M(t), V(() => r.disabled = H(n)), G("click", r, () => L(S, a()?.revision)), q(e, t);
		};
		Y(p, (e) => {
			H(S), W(a()), U(() => H(S) !== void 0 && a() && H(S) !== a().revision) && e(m);
		});
		var h = B(p, 2), g = R(h), C = z(g, !0), w = B(g), T = z(w, !0);
		M(h), M(o), M(t), V(() => {
			X(t, "hidden", c()), J(i, H(x) ? "Edit service" : "Add a service"), s.disabled = H(n), u.disabled = H(n), d.disabled = H(n), f.disabled = H(n), g.disabled = (H(n), H(S), W(a()), U(() => H(n) || H(S) !== a()?.revision)), J(C, l() === "saving" ? "Saving…" : H(x) ? "Save service" : "Add service"), w.disabled = H(n), J(T, H(x) ? "Cancel edit" : "Clear form");
		}), Cr("submit", o, (e) => {
			e.preventDefault(), te();
		}), yi(s, () => H(_), (e) => L(_, e)), yi(u, () => H(b), (e) => L(b, e)), yi(d, () => H(y), (e) => L(y, e)), yi(f, () => H(v), (e) => L(v, e)), G("click", w, E), q(e, t);
	};
	Y(ye, (e) => {
		s() && o() && e(xe);
	}), V(() => {
		J(le, c() ? "YOUR SHORTCUTS" : "A PLACE FOR YOUR SERVICES"), J(ue, c() ? "Pinned services" : "Service directory"), J(fe, u());
	}), q(e, ae), Ue();
}
wr(["click"]);
// src/Activity.svelte
var Mo = /* @__PURE__ */ K("<p class=\"activity-empty\">No matching activity in this window. Try another action name or check the newest entries.</p>"), No = /* @__PURE__ */ K("<li><div><strong> </strong><p> </p></div><time> </time></li>"), Po = /* @__PURE__ */ K("<!> <ol class=\"activity-list\"></ol> <div class=\"button-row\"><button class=\"button secondary\">Check newest activity</button><button class=\"button secondary\">Older activity</button></div> <p class=\"field-help\">Up to 25 entries per page. New changes appear when you check newest; older pages stay within the current history window. Search matches action names, not note or credential contents.</p>", 1), Fo = /* @__PURE__ */ K("<button class=\"button secondary\">Retry activity</button>"), Io = /* @__PURE__ */ K("<button class=\"button secondary\">Check activity</button>"), Lo = /* @__PURE__ */ K("<section class=\"card activity-card\" aria-label=\"Your retained activity\"><h2>Your activity</h2> <p>Successful changes made by your account, retained from the introduction of Activity. Connection entries describe enrollment changes, not game actions or provider uptime.</p> <form class=\"activity-search\"><div><label for=\"activity-query\">Search action names</label><input id=\"activity-query\" maxlength=\"80\" placeholder=\"For example, saved or Crafty\"/></div> <div><label for=\"activity-category\">Activity category</label><select id=\"activity-category\"><option>All activity</option><option>Workspace notes</option><option>Services and pins</option><option>Connection enrollment</option></select></div> <button type=\"submit\" class=\"button primary\">Search activity</button></form> <p class=\"workspace-status\" role=\"status\"> </p> <!></section>");
function Ro(e, t) {
	He(t, !1);
	let n = Z(t, "state", 8), r = Z(t, "authorized", 8, !1), i = Z(t, "load", 8), a = /* @__PURE__ */ I(""), o = /* @__PURE__ */ I("all"), s = /* @__PURE__ */ I(), c = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	wn(() => W(r()), () => {
		r() || (L(a, ""), L(o, "all"), L(s, void 0));
	}), wn(() => (W(n()), H(s)), () => {
		n() !== H(s) && n().phase === "loading" && (L(s, n()), L(a, n().query), L(o, n().category));
	}), Tn(), Ti();
	var l = Lo(), u = B(R(l), 4), d = R(u), f = B(R(d));
	pi(f), M(d);
	var p = B(d, 2), m = B(R(p)), h = R(m);
	h.value = h.__value = "all";
	var g = B(h);
	g.value = g.__value = "workspace";
	var _ = B(g);
	_.value = _.__value = "directory";
	var v = B(_);
	v.value = v.__value = "connections", M(m), ai(m), M(p);
	var y = B(p, 2);
	M(u);
	var b = B(u, 2), x = z(b, !0), S = B(b, 2), C = (e) => {
		var t = Po(), r = sn(t), a = (e) => {
			q(e, Mo());
		};
		Y(r, (e) => {
			W(n()), U(() => n().entries.length === 0) && e(a);
		});
		var o = B(r, 2);
		qr(o, 5, () => (W(n()), U(() => n().entries)), (e) => e.id, (e, t) => {
			var n = No(), r = R(n), i = R(r), a = z(i, !0), o = z(B(i));
			M(r);
			var s = B(r), l = z(s, !0);
			M(n), V((e, r) => {
				X(n, "data-activity-id", (H(t), U(() => H(t).id))), J(a, (H(t), U(() => H(t).label))), J(o, `Revision ${H(t), U(() => H(t).revision) ?? ""} · ${H(t), U(() => H(t).category === "connections" ? "Connection enrollment" : H(t).category === "directory" ? "Services and pins" : "Workspace note") ?? ""}`), X(s, "datetime", e), J(l, r);
			}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => c(H(t).occurred_at)))]), q(e, n);
		}), M(o);
		var s = B(o, 2), l = R(s), u = B(l);
		M(s), be(2), V(() => u.disabled = (W(n()), U(() => !n().next))), G("click", l, () => void i()(n().category, n().query)), G("click", u, () => void i()(n().category, n().query, !0)), q(e, t);
	}, w = (e) => {
		var t = Fo();
		G("click", t, () => void i()(n().category, n().query)), q(e, t);
	}, T = (e) => {
		var t = Io();
		V(() => t.disabled = !r()), G("click", t, () => void i()(H(o), H(a))), q(e, t);
	};
	Y(S, (e) => {
		W(n()), U(() => n().phase === "ready") ? e(C) : (W(n()), U(() => n().phase === "error") ? e(w, 1) : (W(n()), U(() => n().phase === "idle") && e(T, 2)));
	}), M(l), V(() => {
		f.disabled = !r(), m.disabled = !r(), y.disabled = !r(), J(x, (W(n()), U(() => n().message)));
	}), Cr("submit", u, (e) => {
		e.preventDefault(), i()(H(o), H(a));
	}), yi(f, () => H(a), (e) => L(a, e)), oi(m, () => H(o), (e) => L(o, e)), q(e, l), Ue();
}
wr(["click"]);
// src/Notifications.svelte
var zo = /* @__PURE__ */ K("<div class=\"notice\"><h3>Check your read markers</h3><p>The change may have completed. Check notifications before marking another group read.</p></div>"), Bo = /* @__PURE__ */ K("<p class=\"notification-empty\"> </p>"), Vo = /* @__PURE__ */ K("<li><div><h3> </h3><p class=\"notification-count\"> </p><p> </p><p class=\"field-help\"><time> </time></p></div> <button class=\"button secondary mark-notification-read\"> </button></li>"), Ho = /* @__PURE__ */ K("<div class=\"notification-card card\"><div class=\"notification-heading\"><div><p class=\"eyebrow\">AT YOUR PACE</p><h2>Your notifications</h2></div><button class=\"button secondary check-notifications\">Check notifications</button></div> <p>Shared service and connection changes from other accounts, grouped together. Opening this inbox leaves them unread.</p> <label class=\"notification-filter\"><input id=\"notification-show-read\" type=\"checkbox\"/> Show read groups</label> <p class=\"notification-status\" role=\"status\"> </p> <!> <!> <ul class=\"notification-list\"></ul></div>");
function Uo(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = Z(t, "value", 8), i = Z(t, "authorized", 8), a = Z(t, "state", 8), o = Z(t, "message", 8), s = Z(t, "check", 8), c = Z(t, "mark", 8), l = /* @__PURE__ */ I(!1), u = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	wn(() => W(i()), () => {
		i() || L(l, !1);
	}), wn(() => (W(i()), W(r()), H(l)), () => {
		L(n, i() ? (r()?.groups ?? []).filter((e) => H(l) || e.unread !== "0") : []);
	}), Tn(), Ti();
	var d = Ho(), f = R(d), p = B(R(f));
	M(f);
	var m = B(f, 4), h = R(m);
	pi(h), be(), M(m);
	var g = B(m, 2), _ = z(g, !0), v = B(g, 2), y = (e) => {
		q(e, zo());
	};
	Y(v, (e) => {
		a() === "uncertain" && e(y);
	});
	var b = B(v, 2), x = (e) => {
		var t = Bo(), n = z(t, !0);
		V(() => J(n, H(l) ? "No shared changes to show yet." : "You’re all caught up.")), q(e, t);
	};
	Y(b, (e) => {
		H(n), U(() => H(n).length === 0) && e(x);
	});
	var S = B(b, 2);
	qr(S, 5, () => H(n), (e) => e.category, (e, t) => {
		var n = Vo(), r = R(n), o = R(r), s = z(o, !0), l = B(o), d = z(l, !0), f = B(l), p = z(f, !0), m = B(f), h = R(m), g = z(h, !0);
		M(m), M(r);
		var _ = B(r, 2), v = z(_);
		M(n), V((e, r) => {
			X(n, "data-notification-category", (H(t), U(() => H(t).category))), J(s, (H(t), U(() => H(t).category === "services" ? "Services" : "Connections"))), J(d, (H(t), U(() => H(t).unread === "0" ? "Read" : `${H(t).unread} unread ${H(t).unread === "1" ? "change" : "changes"}`))), J(p, (H(t), U(() => H(t).latest.label))), X(h, "datetime", e), J(g, r), _.disabled = (W(i()), W(a()), H(t), U(() => !i() || a() !== "idle" || H(t).unread === "0")), J(v, `Mark ${H(t), U(() => H(t).category === "services" ? "services" : "connections") ?? ""} read`);
		}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).latest.occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => u(H(t).latest.occurred_at)))]), G("click", _, () => c()(H(t).category, H(t).revision)), q(e, n);
	}), M(S), M(d), V(() => {
		p.disabled = !i() || a() === "saving", h.disabled = !i(), J(_, o() || "Read markers are saved to your account.");
	}), G("click", p, () => s()()), bi(h, () => H(l), (e) => L(l, e)), q(e, d), Ue();
}
wr(["click"]);
// src/Guide.svelte
var Wo = /* @__PURE__ */ K("<li> </li>"), Go = /* @__PURE__ */ K("<button class=\"button secondary\">Open Connections</button>"), Ko = /* @__PURE__ */ K("<button class=\"button secondary\">Open Media</button>"), qo = /* @__PURE__ */ K("<p class=\"field-help\">Media enrollment and observations require owner access.</p>"), Jo = /* @__PURE__ */ K("<button class=\"button secondary\">Open Queues</button>"), Yo = /* @__PURE__ */ K("<p class=\"field-help\">Queue enrollment and observations require owner access.</p>"), Xo = /* @__PURE__ */ K("<button class=\"button secondary\">Open Identity</button><p class=\"field-help\">Identity linking is available with deliberate owner setup. Discord sign-in, friends, roles and bots remain planned.</p>", 1), Zo = /* @__PURE__ */ K("<p class=\"field-help\">Setup will be available when this integration is implemented and qualified.</p>"), Qo = /* @__PURE__ */ K("<article class=\"card integration-card\"><div class=\"guide-card-heading\"><h2> </h2><span class=\"integration-status\"> </span></div> <p> </p> <h3>What it offers</h3><ul></ul> <h3>Setup requirements</h3><ul></ul> <!></article>"), $o = /* @__PURE__ */ K("<section class=\"card guide-intro\"><p class=\"eyebrow\">OPTIONAL CONNECTIONS</p><h2>Integration catalog</h2><p>Come back here to see what is available and what is planned. Each connection needs deliberate setup and its own access permissions.</p><p class=\"field-help\">Available means the Reborn feature exists. Connections shows Crafty enrollment. Media provides Jellyfin and Seerr observations; Queues provides Sonarr, Radarr and qBittorrent observations. Media and Queues are owner-only. Identity offers deliberate Discord identity linking; wider Discord features remain planned. Credentials and real provider acceptance are separate.</p></section> <div class=\"catalog-list\"></div>", 1), es = /* @__PURE__ */ K("<h4>Recorded progress</h4><ul></ul>", 1), ts = /* @__PURE__ */ K("<section><div class=\"guide-card-heading\"><h3> </h3><span class=\"quiet-label\"> </span></div> <!> <h4>Work still ahead</h4><ul></ul></section>"), ns = /* @__PURE__ */ K("<article class=\"card roadmap-note\" aria-label=\"Project roadmap note\"><p class=\"eyebrow\">A NOTE FOR THE ROAD AHEAD</p><h2>Keida Reborn roadmap</h2> <p> </p> <p class=\"field-help\">Work-list snapshot dated <time> </time>. This note ships with the site; it does not update itself from GitHub. Your private workspace note is separate.</p> <h3>Next priorities</h3><ol class=\"roadmap-priorities\"></ol> <div class=\"roadmap-milestones\"></div> <p><a rel=\"noreferrer\">Open the current roadmap and acceptance tracker <span aria-hidden=\"true\">↗</span></a></p></article>"), rs = /* @__PURE__ */ K("<section class=\"card guide-intro\"><h2> </h2><p>The guide is available after your account access is checked.</p><button class=\"button secondary\"> </button></section>"), is = /* @__PURE__ */ K("<div class=\"guide-card\"><p class=\"workspace-status\" role=\"status\"> </p> <!></div>");
function as(e, t) {
	He(t, !1);
	let n = Z(t, "mode", 8, "catalog"), r = Z(t, "state", 8), i = Z(t, "authorized", 8, !1), a = Z(t, "retry", 8), o = Z(t, "connections", 8), s = Z(t, "media", 8), c = Z(t, "queues", 8), l = Z(t, "identity", 8), u = Z(t, "owner", 8, !1);
	Ti();
	var d = is(), f = R(d), p = z(f, !0), m = B(f, 2), h = (e) => {
		var t = Nr(), i = sn(t), a = (e) => {
			var t = $o(), n = B(sn(t), 2);
			qr(n, 5, () => (W(r()), U(() => r().value.catalog)), (e) => e.id, (e, t) => {
				var n = Qo(), r = R(n), i = R(r), a = z(i, !0), d = B(i), f = z(d, !0);
				M(r);
				var p = B(r, 2), m = z(p, !0), h = B(p, 3);
				qr(h, 5, () => (H(t), U(() => H(t).capabilities)), Ur, (e, t) => {
					var n = Wo(), r = z(n, !0);
					V(() => J(r, H(t))), q(e, n);
				}), M(h);
				var g = B(h, 3);
				qr(g, 5, () => (H(t), U(() => H(t).requirements)), Ur, (e, t) => {
					var n = Wo(), r = z(n, !0);
					V(() => J(r, H(t))), q(e, n);
				}), M(g);
				var _ = B(g, 2), v = (e) => {
					var n = Nr(), r = sn(n), i = (e) => {
						var t = Go();
						G("click", t, function(...e) {
							o()?.apply(this, e);
						}), q(e, t);
					}, a = (e) => {
						var t = Nr(), n = sn(t), r = (e) => {
							var t = Ko();
							G("click", t, function(...e) {
								s()?.apply(this, e);
							}), q(e, t);
						}, i = (e) => {
							q(e, qo());
						};
						Y(n, (e) => {
							u() ? e(r) : e(i, -1);
						}), q(e, t);
					}, l = (e) => {
						var t = Jo();
						G("click", t, function(...e) {
							c()?.apply(this, e);
						}), q(e, t);
					}, d = (e) => {
						q(e, Yo());
					};
					Y(r, (e) => {
						H(t), U(() => H(t).id === "crafty") ? e(i) : (H(t), U(() => H(t).id === "jellyfin" || H(t).id === "seerr") ? e(a, 1) : u() ? e(l, 2) : e(d, -1));
					}), q(e, n);
				}, y = (e) => {
					var t = Xo(), n = sn(t);
					be(), G("click", n, function(...e) {
						l()?.apply(this, e);
					}), q(e, t);
				}, b = (e) => {
					q(e, Zo());
				};
				Y(_, (e) => {
					H(t), U(() => H(t).status === "available") ? e(v) : (H(t), U(() => H(t).id === "discord") ? e(y, 1) : e(b, -1));
				}), M(n), V(() => {
					X(n, "data-integration-id", (H(t), U(() => H(t).id))), J(a, (H(t), U(() => H(t).name))), X(d, "data-status", (H(t), U(() => H(t).status))), J(f, (H(t), U(() => H(t).status === "available" ? "Available" : "Planned"))), J(m, (H(t), U(() => H(t).summary)));
				}), q(e, n);
			}), M(n), q(e, t);
		}, d = (e) => {
			var t = ns(), n = B(R(t), 3), i = z(n, !0), a = B(n, 2), o = B(R(a)), s = z(o, !0);
			be(), M(a);
			var c = B(a, 3);
			qr(c, 5, () => (W(r()), U(() => r().value.roadmap.priorities)), Ur, (e, t) => {
				var n = Wo(), r = z(n, !0);
				V(() => J(r, H(t))), q(e, n);
			}), M(c);
			var l = B(c, 2);
			qr(l, 5, () => (W(r()), U(() => r().value.roadmap.milestones)), (e) => e.id, (e, t) => {
				var n = ts(), r = R(n), i = R(r), a = z(i), o = z(B(i), !0);
				M(r);
				var s = B(r, 2), c = (e) => {
					var n = es(), r = B(sn(n));
					qr(r, 5, () => (H(t), U(() => H(t).delivered)), Ur, (e, t) => {
						var n = Wo(), r = z(n, !0);
						V(() => J(r, H(t))), q(e, n);
					}), M(r), q(e, n);
				};
				Y(s, (e) => {
					H(t), U(() => H(t).delivered.length) && e(c);
				});
				var l = B(s, 3);
				qr(l, 5, () => (H(t), U(() => H(t).remaining)), Ur, (e, t) => {
					var n = Wo(), r = z(n, !0);
					V(() => J(r, H(t))), q(e, n);
				}), M(l), M(n), V(() => {
					X(n, "data-milestone-id", (H(t), U(() => H(t).id))), X(n, "aria-label", (H(t), U(() => `${H(t).id}: ${H(t).title}`))), J(a, `${H(t), U(() => H(t).id) ?? ""} · ${H(t), U(() => H(t).title) ?? ""}`), J(o, (H(t), U(() => H(t).status)));
				}), q(e, n);
			}), M(l);
			var u = z(B(l, 2));
			M(t), V(() => {
				J(i, (W(r()), U(() => r().value.roadmap.intro))), X(o, "datetime", (W(r()), U(() => r().value.roadmap.as_of))), J(s, (W(r()), U(() => r().value.roadmap.as_of))), X(u, "href", (W(r()), U(() => r().value.roadmap.tracker_url)));
			}), q(e, t);
		};
		Y(i, (e) => {
			n() === "catalog" ? e(a) : e(d, -1);
		}), q(e, t);
	}, g = (e) => {
		var t = rs(), i = R(t), o = z(i, !0), s = B(i, 2), c = z(s, !0);
		M(t), V(() => {
			J(o, n() === "roadmap" ? "Roadmap note" : "Integration catalog"), J(c, (W(r()), U(() => r().phase === "error" ? "Retry workspace guide" : "Check workspace guide")));
		}), G("click", s, () => void a()()), q(e, t);
	};
	Y(m, (e) => {
		W(i()), W(r()), U(() => i() && r().phase === "ready" && r().value) ? e(h) : (W(i()), W(r()), U(() => i() && r().phase !== "loading") && e(g, 1));
	}), M(d), V(() => J(p, (W(r()), U(() => r().message)))), q(e, d), Ue();
}
wr(["click"]);
// src/Media.svelte
var os = /* @__PURE__ */ K("<section class=\"card small-card media-owner-only\"><h2>Owner access required</h2><p>An owner can enroll and view media connections. Provider-account sharing has not been configured for members.</p></section>"), ss = /* @__PURE__ */ K("<div class=\"media-playback\" data-media-playback=\"\"><h3>Recent server playback</h3><p> </p><p class=\"field-help\">Across the Jellyfin server, not limited to the selected library: sessions active within 120 seconds with a reported playing item. Counts do not show users, devices or watch titles.</p></div>"), cs = /* @__PURE__ */ K("<small>Some details unavailable</small>"), ls = /* @__PURE__ */ K("<tr data-media-item=\"\"><td> <!></td><td> </td><td> </td></tr>"), us = /* @__PURE__ */ K("<div class=\"media-table-scroll\"><table class=\"media-table\"><caption> </caption><thead><tr><th scope=\"col\">Title</th><th scope=\"col\">Type</th><th scope=\"col\"> </th></tr></thead><tbody></tbody></table></div>"), ds = /* @__PURE__ */ K("<p class=\"media-empty\"> </p>"), fs = /* @__PURE__ */ K("<p class=\"field-help\">No usable rows were reported for this sample. This does not establish an empty library or request list.</p>"), ps = /* @__PURE__ */ K("<p class=\"notice\">More rows exist beyond this bounded view.</p>"), ms = /* @__PURE__ */ K("<dl class=\"media-sample\"><dt>Collected</dt><dd> </dd><dt>Freshness</dt><dd> </dd><dt>Sample</dt><dd> </dd></dl> <!> <!> <p class=\"field-help\"> </p> <!> <div class=\"button-row media-pagination\"><button class=\"text-button media-previous\"> </button><span class=\"quiet-label\"> </span><button class=\"text-button media-next\"> </button></div>", 1), hs = /* @__PURE__ */ K("<p class=\"field-help\">Choose one Jellyfin library by its ID. This limits the rows requested here; the underlying API key may still access all libraries and sessions.</p>"), gs = /* @__PURE__ */ K("<label for=\"jellyfin-library\">Jellyfin library ID</label><input id=\"jellyfin-library\" name=\"library-id\" required=\"\" maxlength=\"36\"/><p class=\"field-help\">Use the library’s lowercase 32-digit ID or UUID, without an address or API key.</p>", 1), _s = /* @__PURE__ */ K("<button class=\"text-button media-remove\"> </button>"), vs = /* @__PURE__ */ K("<section class=\"card media-provider\"><div class=\"guide-card-heading\"><h2> </h2><span class=\"quiet-label\">Owner-only observations</span></div> <p class=\"workspace-status\" role=\"status\" data-media-status=\"\"> </p> <div class=\"button-row media-actions\"><button class=\"button secondary media-check-state\"> </button><button class=\"button secondary media-check-observations\"> </button></div> <!> <details class=\"media-enrollment\"><summary> </summary><p>Use a key created deliberately for Reborn. It is encrypted on the server and will not be shown again.</p><p class=\"notice\"> </p> <!> <form autocomplete=\"off\"><label> </label><input name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\"/> <label>Dedicated API key</label><input name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <!> <label>Private CA certificate, if needed</label><textarea name=\"ca-pem\" rows=\"3\" maxlength=\"8192\"></textarea><p class=\"field-help\">Leave blank for publicly trusted HTTPS. Normal hostname and trust checks always apply.</p> <label class=\"media-ack\"><input name=\"acknowledge\" type=\"checkbox\" required=\"\"/>I understand this key may grant broad access, and I choose owner-only media observations.</label> <button class=\"button primary media-save\" type=\"submit\"> </button></form></details> <!></section>"), ys = /* @__PURE__ */ K("<div class=\"media-providers\"></div>"), bs = /* @__PURE__ */ K("<div class=\"media-view\"><section class=\"card media-intro\"><p class=\"eyebrow\">MEDIA, WITH DELIBERATE ACCESS</p><h2>Media observations</h2><p>Check a selected Jellyfin library, counts of recent playback and Seerr request status. These connections send observation requests only.</p><p class=\"field-help\">Media is owner-only. Hub member accounts are not linked to provider accounts, and this view does not share their playback or request identities.</p></section> <!></div>");
function xs(e, t) {
	He(t, !1);
	let n = Z(t, "owner", 8, !1), r = Z(t, "active", 8, !1), i = Z(t, "state", 8), a = Z(t, "check", 8), o = Z(t, "load", 8), s = Z(t, "save", 8), c = ["jellyfin", "seerr"], l = (e) => e === "jellyfin" ? "Jellyfin" : "Seerr", u = /* @__PURE__ */ I({}), d = (e) => e === null ? "Not collected" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(), f = (e) => r() && n() && i()[e].phase === "ready" && i()[e].save === "idle" && !!i()[e].status;
	function p() {
		for (let e of c) H(u)[e]?.reset();
	}
	Li(p);
	async function m(e, t = !1) {
		let n = i()[e].status;
		if (!n || !f(e)) return;
		let r = H(u)[e] ? new FormData(H(u)[e]) : void 0, a = t ? null : {
			endpoint: String(r?.get("endpoint") ?? ""),
			token: String(r?.get("token") ?? ""),
			ca_pem: String(r?.get("ca-pem") ?? ""),
			library_id: e === "jellyfin" ? String(r?.get("library-id") ?? "") : null,
			acknowledge_broad_access: r?.get("acknowledge") === "on"
		};
		H(u)[e]?.reset(), await s()(e, n.revision, a);
	}
	wn(() => (W(r()), W(n())), () => {
		r() && n() || p();
	}), Tn(), Ti();
	var h = bs(), g = B(R(h), 2), _ = (e) => {
		q(e, os());
	}, v = (e) => {
		var t = ys();
		qr(t, 5, () => c, (e) => e, (e, t) => {
			let s = /* @__PURE__ */ P(() => (W(i()), H(t), U(() => i()[H(t)]))), c = /* @__PURE__ */ P(() => (W(H(s)), U(() => H(s).observation))), f = /* @__PURE__ */ P(() => (W(r()), W(H(s)), U(() => !r() || H(s).save === "saving"))), p = /* @__PURE__ */ P(() => (W(r()), W(n()), W(H(s)), U(() => r() && n() && H(s).phase === "ready" && H(s).save === "idle" && !!H(s).status)));
			var h = vs(), g = R(h), _ = z(R(g), !0);
			be(), M(g);
			var v = B(g, 2), y = z(v, !0), b = B(v, 2), x = R(b), S = z(x), C = B(x), w = z(C);
			M(b);
			var T = B(b, 2), E = (e) => {
				var n = ms(), r = sn(n), i = B(R(r)), a = z(i, !0), s = B(i, 2), u = z(s, !0), p = z(B(s, 2), !0);
				M(r);
				var m = B(r, 2), h = (e) => {
					var t = ss(), n = z(B(R(t)), !0);
					be(), M(t), V(() => J(n, (W(H(c)), U(() => H(c).playback && H(c).playback.playing !== null && H(c).playback.paused !== null ? `${H(c).playback.playing} playing · ${H(c).playback.paused} paused` : "Playback counts unavailable")))), q(e, t);
				};
				Y(m, (e) => {
					H(t) === "jellyfin" && e(h);
				});
				var g = B(m, 2), _ = (e) => {
					var n = us(), r = R(n), i = R(r), a = z(i, !0), o = B(i), s = R(o), l = z(B(R(s), 2), !0);
					M(s), M(o);
					var u = B(o);
					qr(u, 5, () => (W(H(c)), U(() => H(c).items)), (e) => e.id, (e, n) => {
						var r = ls(), i = R(r), a = R(i, !0), o = B(a), s = (e) => {
							q(e, cs());
						};
						Y(o, (e) => {
							H(n), U(() => H(n).detail_error) && e(s);
						}), M(i);
						var c = B(i), l = z(c, !0), u = z(B(c), !0);
						M(r), V((e) => {
							J(a, (H(n), U(() => H(n).title ?? "Title unavailable"))), J(l, (H(n), U(() => H(n).kind === "movie" ? "Movie" : "Series"))), J(u, e);
						}, [() => (H(t), H(n), U(() => H(t) === "jellyfin" ? H(n).year ?? "Not reported" : H(n).request_status === "unknown" ? "Unknown" : H(n).request_status ? H(n).request_status[0].toUpperCase() + H(n).request_status.slice(1) : "Not reported"))]), q(e, r);
					}), M(u), M(r), M(n), V(() => {
						J(a, H(t) === "jellyfin" ? "Selected library rows" : "Recent request rows"), J(l, H(t) === "jellyfin" ? "Year" : "Request status"), X(u, "data-media-rows", H(t));
					}), q(e, n);
				}, v = (e) => {
					var n = ds(), r = z(n, !0);
					V(() => J(r, H(t) === "jellyfin" ? "No movie or series rows were reported in this library." : "No requests were reported.")), q(e, n);
				}, y = (e) => {
					q(e, fs());
				};
				Y(g, (e) => {
					W(H(c)), U(() => H(c).items.length) ? e(_) : (W(H(c)), U(() => H(c).complete && H(c).error === null && H(c).total === 0) ? e(v, 1) : (W(H(c)), U(() => H(c).error !== "checking") && e(y, 2)));
				});
				var b = B(g, 2), x = z(b), S = B(b, 2), C = (e) => {
					q(e, ps());
				};
				Y(S, (e) => {
					W(H(c)), U(() => H(c).truncated) && e(C);
				});
				var w = B(S, 2), T = R(w), E = z(T), ee = B(T), te = z(ee), ne = B(ee), re = z(ne);
				M(w), V((e, t, n) => {
					J(a, e), J(u, (W(H(c)), U(() => H(c).freshness === "fresh" ? "Recent collection" : H(c).freshness === "stale" ? "Stale collection" : "Collection age unknown"))), J(p, (W(H(c)), U(() => H(c).complete ? "Complete for these bounded queries" : "Incomplete or still checking"))), J(x, `${W(H(c)), U(() => H(c).total === null ? "Provider total unavailable." : `${H(c).total} rows reported by the provider.`) ?? ""} Up to 12 rows per page and the first 60 rows only. Pages can change as the provider changes.`), T.disabled = (W(H(f)), W(H(c)), U(() => H(f) || H(c).offset === 0)), J(E, `Previous ${t ?? ""} page`), J(te, `Page ${W(H(c)), U(() => H(c).offset / 12 + 1) ?? ""}`), ne.disabled = (W(H(f)), W(H(c)), U(() => H(f) || H(c).next_offset === null)), J(re, `Next ${n ?? ""} page`);
				}, [
					() => (W(H(c)), U(() => d(H(c).checked_at))),
					() => (H(t), U(() => l(H(t)))),
					() => (H(t), U(() => l(H(t))))
				]), G("click", T, () => void o()(H(t), H(c).offset - 12)), G("click", ne, () => H(c).next_offset !== null && void o()(H(t), H(c).next_offset)), q(e, n);
			}, ee = (e) => {
				var n = ds(), r = z(n);
				V((e) => J(r, `No ${e ?? ""} connection enrolled.`), [() => (H(t), U(() => l(H(t))))]), q(e, n);
			};
			Y(T, (e) => {
				W(H(c)), U(() => H(c)?.configured) ? e(E) : (W(H(s)), U(() => H(s).status && !H(s).status.configured) && e(ee, 1));
			});
			var te = B(T, 2), ne = R(te), re = z(ne), ie = B(ne, 2), ae = z(ie), oe = B(ie, 2), se = (e) => {
				q(e, hs());
			};
			Y(oe, (e) => {
				H(t) === "jellyfin" && e(se);
			});
			var ce = B(oe, 2), le = R(ce), ue = z(le), D = B(le), de = B(D, 2), O = B(de), fe = B(O, 2), pe = (e) => {
				var t = gs(), n = B(sn(t));
				X(n, "pattern", "[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}"), be(), V(() => n.disabled = !H(p)), q(e, t);
			};
			Y(fe, (e) => {
				H(t) === "jellyfin" && e(pe);
			});
			var me = B(fe, 2), he = B(me), k = B(he, 3), ge = R(k);
			be(), M(k);
			var A = B(k, 2), _e = z(A);
			M(ce), wi(ce, (e, t) => Vt(u, H(u)[t] = e), (e) => H(u)?.[e], () => [H(t)]), M(te);
			var j = B(te, 2), ve = (e) => {
				var n = _s(), r = z(n);
				V((e) => {
					n.disabled = !H(p), J(r, `Remove ${e ?? ""} connection`);
				}, [() => (H(t), U(() => l(H(t))))]), G("click", n, () => void m(H(t), !0)), q(e, n);
			};
			Y(j, (e) => {
				W(H(s)), U(() => H(s).status?.configured) && e(ve);
			}), M(h), V((e, n, r, i, a, o, l, u, d, m) => {
				X(h, "data-media-provider", H(t)), X(h, "data-media-revision", (W(H(s)), U(() => H(s).status?.revision ?? ""))), X(h, "data-media-configured", e), X(h, "data-media-error", (W(H(c)), U(() => H(c)?.error ?? ""))), X(h, "data-media-complete", n), X(h, "data-media-offset", (W(H(c)), U(() => H(c)?.offset ?? 0))), X(h, "data-media-save", (W(H(s)), U(() => H(s).save))), X(h, "aria-label", r), J(_, i), J(y, (W(H(s)), U(() => H(s).message || "Check the connection state to begin."))), x.disabled = H(f), J(S, `Check ${a ?? ""} connection state`), C.disabled = (W(H(f)), W(H(s)), U(() => H(f) || H(s).phase === "loading" || !H(s).status?.configured)), J(w, `Check ${o ?? ""} observations`), J(re, `Enroll dedicated ${l ?? ""} access`), J(ae, `A ${u ?? ""} API key can grant administrator access. Reborn sends observation requests only; this does not restrict what the key itself can do.`), X(le, "for", `${H(t)}-endpoint`), J(ue, `${d ?? ""} HTTPS address`), X(D, "id", `${H(t)}-endpoint`), X(D, "placeholder", `https://${H(t)}.example/`), D.disabled = !H(p), X(de, "for", `${H(t)}-token`), X(O, "id", `${H(t)}-token`), O.disabled = !H(p), X(me, "for", `${H(t)}-ca`), X(he, "id", `${H(t)}-ca`), he.disabled = !H(p), X(k, "for", `${H(t)}-ack`), X(ge, "id", `${H(t)}-ack`), ge.disabled = !H(p), A.disabled = !H(p), J(_e, `Save ${m ?? ""} connection`);
			}, [
				() => (W(H(s)), U(() => String(H(s).status?.configured ?? !1))),
				() => (W(H(c)), U(() => String(H(c)?.complete ?? !1))),
				() => (H(t), U(() => `${l(H(t))} media connection`)),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t))))
			]), G("click", x, () => void a()(H(t))), G("click", C, () => void o()(H(t), H(c)?.offset ?? 0)), Cr("submit", ce, (e) => {
				e.preventDefault(), m(H(t));
			}), q(e, h);
		}), M(t), q(e, t);
	};
	Y(g, (e) => {
		n() ? e(v, -1) : e(_);
	}), M(h), q(e, h), Ue();
}
wr(["click"]);
// src/Queues.svelte
var Ss = /* @__PURE__ */ K("<section class=\"card small-card queue-owner-only\"><h2>Owner access required</h2><p>An owner can enroll and view queue connections. Provider-account sharing has not been configured for members.</p></section>"), Cs = /* @__PURE__ */ K("<p class=\"field-help\">Transfers include downloading, uploading, stopped, checking and other reported states. Progress estimates current wanted/selected bytes; it does not measure checking, import or playback completion.</p>"), ws = /* @__PURE__ */ K("<p class=\"field-help\">The provider queue includes pending and delayed releases. Its count does not establish the number of active downloads or downloader health. Progress estimates downloaded bytes and does not establish import or playback completion.</p>"), Ts = /* @__PURE__ */ K("<th scope=\"col\">Import state</th>"), Es = /* @__PURE__ */ K("<th scope=\"col\">Download rate</th><th scope=\"col\">Upload rate</th>", 1), Ds = /* @__PURE__ */ K("<td> </td>"), Os = /* @__PURE__ */ K("<td> </td><td> </td>", 1), ks = /* @__PURE__ */ K("<tr data-queue-item=\"\"><td> <small> </small></td><td> </td><!><td> </td><td> </td><!></tr>"), As = /* @__PURE__ */ K("<div class=\"queue-table-scroll\" tabindex=\"0\" role=\"region\"><table class=\"queue-table\"><caption> </caption><thead><tr><th scope=\"col\">Title</th><th scope=\"col\">State</th><!><th scope=\"col\">Progress estimate</th><th scope=\"col\">Size</th><!></tr></thead><tbody></tbody></table></div>"), js = /* @__PURE__ */ K("<p class=\"queue-empty\"> </p>"), Ms = /* @__PURE__ */ K("<p class=\"field-help\">No usable rows were reported for this sample. This does not establish an empty provider queue.</p>"), Ns = /* @__PURE__ */ K("<p class=\"notice\">More items exist beyond this bounded view.</p>"), Ps = /* @__PURE__ */ K("<button class=\"button secondary queue-first-page\"> </button>"), Fs = /* @__PURE__ */ K("<dl class=\"queue-sample\"><dt>Collected</dt><dd> </dd><dt>Freshness</dt><dd> </dd><dt>Sample</dt><dd> </dd></dl> <!> <!> <p class=\"field-help\"> </p> <!> <!> <div class=\"button-row queue-pagination\"><button class=\"text-button queue-previous\"> </button><span class=\"quiet-label\"> </span><button class=\"text-button queue-next\"> </button></div>", 1), Is = /* @__PURE__ */ K("<button class=\"text-button queue-remove\"> </button>"), Ls = /* @__PURE__ */ K("<section class=\"card queue-provider\"><div class=\"guide-card-heading\"><h2> </h2><span class=\"quiet-label\">Owner-only observations</span></div> <p class=\"workspace-status\" role=\"status\" data-queue-status=\"\"> </p> <div class=\"button-row queue-actions\"><button class=\"button secondary queue-check-state\"> </button><button class=\"button secondary queue-check-observations\"> </button></div> <!> <details class=\"queue-enrollment\"><summary> </summary><p>Use access deliberately enrolled for Reborn. The key is encrypted on the server and will not be shown again.</p><p class=\"notice\"> </p><p class=\"field-help\"> </p> <form autocomplete=\"off\"><label> </label><input name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\"/> <label>API key</label><input name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label>Private CA certificate, if needed</label><textarea name=\"ca-pem\" rows=\"3\" maxlength=\"8192\"></textarea><p class=\"field-help\">Leave blank for publicly trusted HTTPS. Normal hostname and trust checks always apply.</p> <label class=\"queue-ack\"><input name=\"acknowledge\" type=\"checkbox\" required=\"\"/>I understand this key may grant broad management access, and I choose owner-only queue observations.</label> <button class=\"button primary queue-save\" type=\"submit\"> </button></form></details> <!></section>"), Rs = /* @__PURE__ */ K("<div class=\"queue-providers\"></div>"), zs = /* @__PURE__ */ K("<div class=\"queues-view\"><section class=\"card queue-intro\"><p class=\"eyebrow\">QUEUE OBSERVATIONS</p><h2>See what’s in motion</h2><p>Check Sonarr and Radarr queue items, including pending releases, and qBittorrent transfers. Each provider is checked only when requested.</p><p class=\"field-help\">This view is owner-only. Member accounts have no provider identity mapping or accepted sharing policy.</p></section> <!></div>");
function Bs(e, t) {
	He(t, !1);
	let n = Z(t, "owner", 8, !1), r = Z(t, "active", 8, !1), i = Z(t, "state", 8), a = Z(t, "check", 8), o = Z(t, "load", 8), s = Z(t, "save", 8), c = [
		"sonarr",
		"radarr",
		"qbittorrent"
	], l = (e) => e === "sonarr" ? "Sonarr" : e === "radarr" ? "Radarr" : "qBittorrent", u = (e) => e === "sonarr" ? "Sonarr 4 · API v3" : e === "radarr" ? "Radarr 6 · API v3" : "qBittorrent 5.2–5.3 · Bearer API key", d = (e) => e === null ? "Not collected" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(), f = (e, t) => e === null ? "Not reported" : `${new Intl.NumberFormat().format(e)} ${t}`, p = (e) => e === null ? "Not reported" : `${(e / 100).toFixed(2)}%`, m = /* @__PURE__ */ I({}), h = {}, g;
	function _() {
		g = void 0;
	}
	function v(e, t, a) {
		let s = a.currentTarget, c = i()[e].status;
		g = r() && n() && c?.configured && s instanceof HTMLButtonElement && document.activeElement === s ? {
			element: s,
			provider: e,
			revision: c.revision,
			profile: c.profile,
			offset: t,
			wasDisabled: !1
		} : void 0, o()(e, t);
	}
	zi(() => {
		let e = g;
		if (!e) return;
		let t = i()[e.provider], a = t.status, o = document.activeElement;
		if (!r() || !n() || !a?.configured || a.revision !== e.revision || a.profile !== e.profile || t.offset !== e.offset || t.save !== "idle" || !e.element.isConnected || document.visibilityState !== "visible" || !document.hasFocus()) {
			_();
			return;
		}
		let s = o === document.body || o === document.documentElement;
		!s && o !== e.element ? _() : e.element.disabled ? e.wasDisabled = !0 : e.wasDisabled && (_(), s && e.element.getClientRects().length > 0 && e.element.focus({ preventScroll: !0 }));
	}), Ii(() => {
		let e = (e) => {
			g && e.target !== g.element && e.target !== document.body && e.target !== document.documentElement && _();
		}, t = () => {
			document.visibilityState !== "visible" && _();
		};
		return document.addEventListener("pointerdown", _, !0), document.addEventListener("keydown", _, !0), document.addEventListener("focusin", e, !0), document.addEventListener("visibilitychange", t), window.addEventListener("blur", _), () => {
			_(), document.removeEventListener("pointerdown", _, !0), document.removeEventListener("keydown", _, !0), document.removeEventListener("focusin", e, !0), document.removeEventListener("visibilitychange", t), window.removeEventListener("blur", _);
		};
	});
	function y() {
		for (let e of c) H(m)[e]?.reset();
	}
	function b(e, t, n) {
		for (let r of c) {
			let i = e[r].status, a = t && n && i ? `${i.revision}:${i.configured}` : "";
			a === h[r] && t && n || H(m)[r]?.reset(), h[r] = a;
		}
	}
	Li(y);
	async function x(e) {
		H(m)[e]?.reset(), await a()(e);
	}
	async function S(e, t = !1) {
		let a = i()[e], o = a.status;
		if (!r() || !n() || a.phase !== "ready" || a.save !== "idle" || !o) return;
		let c = H(m)[e] ? new FormData(H(m)[e]) : void 0, l = t ? null : {
			endpoint: String(c?.get("endpoint") ?? ""),
			token: String(c?.get("token") ?? ""),
			ca_pem: String(c?.get("ca-pem") ?? ""),
			profile: Qi[e],
			acknowledge_broad_access: c?.get("acknowledge") === "on"
		};
		H(m)[e]?.reset(), await s()(e, o.revision, l);
	}
	wn(() => (W(i()), W(r()), W(n())), () => {
		b(i(), r(), n());
	}), Tn(), Ti();
	var C = zs(), w = B(R(C), 2), T = (e) => {
		q(e, Ss());
	}, E = (e) => {
		var t = Rs();
		qr(t, 5, () => c, (e) => e, (e, t) => {
			let a = /* @__PURE__ */ P(() => (W(i()), H(t), U(() => i()[H(t)]))), s = /* @__PURE__ */ P(() => (W(H(a)), U(() => H(a).observation))), c = /* @__PURE__ */ P(() => (W(r()), W(H(a)), U(() => !r() || H(a).save === "saving"))), h = /* @__PURE__ */ P(() => (W(H(a)), W(H(s)), U(() => H(a).phase === "loading" || H(s)?.error === "checking"))), g = /* @__PURE__ */ P(() => (W(r()), W(n()), W(H(a)), U(() => r() && n() && H(a).phase === "ready" && H(a).save === "idle" && !!H(a).status)));
			var _ = Ls(), y = R(_), b = z(R(y));
			be(), M(y);
			var C = B(y, 2), w = z(C, !0), T = B(C, 2), E = R(T), ee = z(E), te = B(E), ne = z(te);
			M(T);
			var re = B(T, 2), ie = (e) => {
				var n = Fs(), r = sn(n), i = B(R(r)), u = z(i, !0), m = B(i, 2), g = z(m, !0), _ = z(B(m, 2), !0);
				M(r);
				var v = B(r, 2), y = (e) => {
					q(e, Cs());
				}, b = (e) => {
					q(e, ws());
				};
				Y(v, (e) => {
					H(t) === "qbittorrent" ? e(y) : e(b, -1);
				});
				var x = B(v, 2), S = (e) => {
					var n = As(), r = R(n), i = R(r), a = z(i, !0), o = B(i), c = R(o), u = B(R(c), 2), d = (e) => {
						q(e, Ts());
					};
					Y(u, (e) => {
						H(t) !== "qbittorrent" && e(d);
					});
					var m = B(u, 3), h = (e) => {
						var t = Es();
						be(), q(e, t);
					};
					Y(m, (e) => {
						H(t) === "qbittorrent" && e(h);
					}), M(c), M(o);
					var g = B(o);
					qr(g, 5, () => (W(H(s)), U(() => H(s).items)), (e) => e.id, (e, n) => {
						var r = ks(), i = R(r), a = R(i, !0), o = z(B(a), !0);
						M(i);
						var s = B(i), c = z(s, !0), l = B(s), u = (e) => {
							var t = Ds(), r = z(t, !0);
							V(() => J(r, (H(n), U(() => H(n).import_state === null ? "Not reported" : H(n).import_state === "unknown" ? "Unknown" : H(n).import_state)))), q(e, t);
						};
						Y(l, (e) => {
							H(t) !== "qbittorrent" && e(u);
						});
						var d = B(l), m = z(d, !0), h = B(d), g = z(h, !0), _ = B(h), v = (e) => {
							var t = Os(), r = sn(t), i = z(r, !0), a = z(B(r), !0);
							V((e, t) => {
								J(i, e), J(a, t);
							}, [() => (H(n), U(() => f(H(n).download_bytes_per_second, "B/s"))), () => (H(n), U(() => f(H(n).upload_bytes_per_second, "B/s")))]), q(e, t);
						};
						Y(_, (e) => {
							H(t) === "qbittorrent" && e(v);
						}), M(r), V((e, t) => {
							J(a, (H(n), U(() => H(n).title ?? "Title unavailable"))), J(o, (H(n), U(() => H(n).warning === !0 ? "Provider warning reported" : H(n).warning === null ? "Warning state not reported" : ""))), J(c, (H(n), U(() => H(n).status === "unknown" ? "Unknown" : H(n).status))), J(m, e), J(g, t);
						}, [() => (H(n), U(() => p(H(n).progress_basis_points))), () => (H(n), U(() => f(H(n).size_bytes, "B")))]), q(e, r);
					}), M(g), M(r), M(n), V((e) => {
						X(n, "aria-label", e), J(a, H(t) === "qbittorrent" ? "All-state Transfers" : "Queue and pending items"), X(g, "data-queue-rows", H(t));
					}, [() => (H(t), U(() => `${l(H(t))} ${H(t) === "qbittorrent" ? "transfers" : "queue items"}`))]), q(e, n);
				}, C = (e) => {
					var n = js(), r = z(n, !0);
					V(() => J(r, H(t) === "qbittorrent" ? "No transfers were reported on this page." : "No queue or pending items were reported on this page.")), q(e, n);
				}, w = (e) => {
					q(e, Ms());
				};
				Y(x, (e) => {
					W(H(s)), U(() => H(s).items.length) ? e(S) : (W(H(s)), U(() => H(s).complete && H(s).error === null) ? e(C, 1) : (W(H(s)), U(() => H(s).error !== "checking" && H(s).error !== "page_moved") && e(w, 2)));
				});
				var T = B(x, 2), E = z(T), ee = B(T, 2), te = (e) => {
					q(e, Ns());
				};
				Y(ee, (e) => {
					W(H(s)), U(() => H(s).truncated) && e(te);
				});
				var ne = B(ee, 2), re = (e) => {
					var n = Ps(), r = z(n);
					V((e) => {
						n.disabled = H(c) || H(h), J(r, `Reload first ${e ?? ""} page`);
					}, [() => (H(t), U(() => l(H(t))))]), G("click", n, () => void o()(H(t), 0)), q(e, n);
				};
				Y(ne, (e) => {
					W(H(s)), U(() => H(s).error === "page_moved") && e(re);
				});
				var ie = B(ne, 2), ae = R(ie), oe = z(ae), se = B(ae), ce = z(se), le = B(se), ue = z(le);
				M(ie), V((e, n, r) => {
					J(u, e), J(g, (W(H(s)), U(() => H(s).freshness === "fresh" ? "Recent collection" : H(s).freshness === "stale" ? "Stale collection" : "Collection age unknown"))), J(_, (W(H(s)), U(() => H(s).complete ? "Complete for this bounded query" : "Incomplete or still checking"))), J(E, `${W(H(s)), H(t), U(() => H(s).total === null ? H(t) === "qbittorrent" ? "Provider total is not supplied." : "Provider total unavailable." : `${H(s).total} queue and pending items reported by the provider.`) ?? ""} Up to 12 rows per page and the first 60 rows only. Live pages can move as the provider changes.`), ae.disabled = (W(H(c)), W(H(h)), W(H(a)), W(H(s)), U(() => H(c) || H(h) || H(a).offset === 0 || H(s).error === "page_moved")), J(oe, `Previous ${n ?? ""} page`), J(ce, `Page ${W(H(a)), U(() => H(a).offset / 12 + 1) ?? ""}`), le.disabled = (W(H(c)), W(H(h)), W(H(s)), U(() => H(c) || H(h) || H(s).next_offset === null)), J(ue, `Next ${r ?? ""} page`);
				}, [
					() => (W(H(s)), U(() => d(H(s).checked_at))),
					() => (H(t), U(() => l(H(t)))),
					() => (H(t), U(() => l(H(t))))
				]), G("click", ae, () => void o()(H(t), H(a).offset - 12)), G("click", le, () => H(s).next_offset !== null && void o()(H(t), H(s).next_offset)), q(e, n);
			}, ae = (e) => {
				var n = js(), r = z(n);
				V((e) => J(r, `No ${e ?? ""} connection enrolled.`), [() => (H(t), U(() => l(H(t))))]), q(e, n);
			};
			Y(re, (e) => {
				W(H(s)), U(() => H(s)?.configured) ? e(ie) : (W(H(a)), U(() => H(a).status && !H(a).status.configured) && e(ae, 1));
			});
			var oe = B(re, 2), se = R(oe), ce = z(se), le = B(se, 2), ue = z(le), D = B(le), de = z(D), O = B(D, 2), fe = R(O), pe = z(fe), me = B(fe), he = B(me, 2), k = B(he), ge = B(k, 2), A = B(ge), _e = B(A, 3), j = R(_e);
			be(), M(_e);
			var ve = B(_e, 2), ye = z(ve);
			M(O), wi(O, (e, t) => Vt(m, H(m)[t] = e), (e) => H(m)?.[e], () => [H(t)]), M(oe);
			var xe = B(oe, 2), Se = (e) => {
				var n = Is(), r = z(n);
				V((e) => {
					n.disabled = !H(g), J(r, `Remove ${e ?? ""} connection`);
				}, [() => (H(t), U(() => l(H(t))))]), G("click", n, () => void S(H(t), !0)), q(e, n);
			};
			Y(xe, (e) => {
				W(H(a)), U(() => H(a).status?.configured) && e(Se);
			}), M(_), V((e, n, r, i, o, l, u, d, f, p, m, v) => {
				X(_, "data-queue-provider", H(t)), X(_, "data-queue-phase", (W(H(a)), U(() => H(a).phase))), X(_, "data-queue-revision", (W(H(a)), U(() => H(a).status?.revision ?? ""))), X(_, "data-queue-configured", e), X(_, "data-queue-error", (W(H(s)), U(() => H(s)?.error ?? ""))), X(_, "data-queue-complete", n), X(_, "data-queue-offset", (W(H(a)), U(() => H(a).offset))), X(_, "data-queue-save", (W(H(a)), U(() => H(a).save))), X(_, "data-queue-freshness", (W(H(s)), U(() => H(s)?.freshness ?? "unknown"))), X(_, "data-queue-total", (W(H(s)), U(() => H(s)?.total ?? ""))), X(_, "data-queue-truncated", r), X(_, "aria-label", i), J(b, `${o ?? ""}${H(t) === "qbittorrent" ? " Transfers" : " queue"}`), J(w, (W(H(a)), U(() => H(a).message || "Check the connection state to begin."))), E.disabled = H(c), J(ee, `Check ${l ?? ""} connection state`), te.disabled = (W(H(c)), W(H(h)), W(H(a)), U(() => H(c) || H(h) || !H(a).status?.configured)), J(ne, `Check ${u ?? ""} observations`), J(ce, `Enroll ${d ?? ""} access`), J(ue, `A global ${f ?? ""} API key may grant broad management authority. Reborn sends observation requests only; this does not restrict what the key itself can do.`), J(de, `Supported profile: ${p ?? ""}. Use a root-mounted HTTPS address. Subpath installations and username/password login are not supported here.`), X(fe, "for", `queue-${H(t)}-endpoint`), J(pe, `${m ?? ""} HTTPS address`), X(me, "id", `queue-${H(t)}-endpoint`), X(me, "placeholder", `https://${H(t)}.example/`), me.disabled = !H(g), X(he, "for", `queue-${H(t)}-token`), X(k, "id", `queue-${H(t)}-token`), k.disabled = !H(g), X(ge, "for", `queue-${H(t)}-ca`), X(A, "id", `queue-${H(t)}-ca`), A.disabled = !H(g), X(_e, "for", `queue-${H(t)}-ack`), X(j, "id", `queue-${H(t)}-ack`), j.disabled = !H(g), ve.disabled = !H(g), J(ye, `Save ${v ?? ""} connection`);
			}, [
				() => (W(H(a)), U(() => String(H(a).status?.configured ?? !1))),
				() => (W(H(s)), U(() => String(H(s)?.complete ?? !1))),
				() => (W(H(s)), U(() => String(H(s)?.truncated ?? !1))),
				() => (H(t), U(() => `${l(H(t))} queue connection`)),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => u(H(t)))),
				() => (H(t), U(() => l(H(t)))),
				() => (H(t), U(() => l(H(t))))
			]), G("click", E, () => void x(H(t))), G("click", te, (e) => v(H(t), H(a).offset, e)), Cr("submit", O, (e) => {
				e.preventDefault(), S(H(t));
			}), q(e, _);
		}), M(t), q(e, t);
	};
	Y(w, (e) => {
		n() ? e(E, -1) : e(T);
	}), M(C), q(e, C), Ue();
}
wr(["click"]);
// src/Identity.svelte
var Vs = /* @__PURE__ */ K("<div class=\"identity-saved\" data-discord-linked=\"\"><h3>Linked Discord identity</h3> <dl class=\"identity-details\"><dt>Display name at verification</dt><dd> </dd><dt>Discord ID</dt><dd class=\"identity-id\"> </dd><dt>Verified</dt><dd> </dd></dl> <p class=\"field-help\">The immutable Discord ID identifies this link. Display names can change.</p> <button class=\"text-button discord-unlink\">Unlink Discord identity locally</button> <p class=\"field-help\">Local unlink removes this account’s saved identity link. It does not contact Discord or change your local sign-in.</p></div>"), Hs = /* @__PURE__ */ K("<form method=\"post\" action=\"/account/discord/start\" class=\"identity-start-form\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-discord-link-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <input type=\"hidden\" name=\"base_revision\"/> <input type=\"hidden\" name=\"base_flow_generation\"/> <input type=\"hidden\" name=\"base_application_revision\"/> <button class=\"button primary discord-start\" type=\"submit\"> </button></form> <p class=\"field-help\">Continue through the Reborn handoff page to Discord, then return to this browser to review the result. Starting a new link cancels an older unfinished attempt.</p>", 1), Us = /* @__PURE__ */ K("<p class=\"notice\">Discord linking is waiting for dedicated application setup by an owner. Existing links can still be unlinked locally.</p>"), Ws = /* @__PURE__ */ K("<p class=\"identity-empty\">No Discord identity linked.</p> <!>", 1), Gs = /* @__PURE__ */ K("<section class=\"identity-review\" aria-label=\"Review returned Discord identity\"><h3>Discord returned</h3><p>Review fetches your Discord identity once. You will choose separately whether to save the link.</p><button class=\"button primary discord-review\">Review Discord identity</button></section>"), Ks = /* @__PURE__ */ K("<section class=\"identity-review\" data-discord-candidate=\"\" aria-label=\"Confirm Discord identity\"><h3>Confirm this identity</h3><dl class=\"identity-details\"><dt>Display name</dt><dd> </dd><dt>Discord ID</dt><dd class=\"identity-id\"> </dd></dl><p>This identity has been verified for this attempt. Choose Confirm to save it to your current Reborn account.</p><button class=\"button primary discord-confirm\">Confirm Discord identity link</button></section>"), qs = /* @__PURE__ */ K("<p class=\"field-help\">Discord acknowledged revoking this verification grant. This revokes tokens for the whole application authorization.</p>"), Js = /* @__PURE__ */ K("<p class=\"notice\">Discord grant revocation could not be confirmed. Reborn discarded the verification tokens. You can remove the application authorization in Discord’s Authorized Apps settings.</p>"), Ys = /* @__PURE__ */ K("<button class=\"text-button discord-cancel\">Cancel unfinished Discord link</button>"), Xs = /* @__PURE__ */ K("<button class=\"text-button discord-remove-application\">Remove Discord application access</button>"), Zs = /* @__PURE__ */ K("<details class=\"identity-enrollment\"><summary>Set up Discord application access</summary><p>Enroll a dedicated Discord application for Reborn. The secret is encrypted on the server and will not be shown again.</p><p>Register this exact redirect URI in the application’s OAuth settings:</p><p class=\"identity-callback\"><code> </code></p><p class=\"field-help\">Only the identify permission is requested. Before real use, review callback query handling in access logs at every proxy and application layer. OAuth codes and state arrive in the callback URL.</p> <form autocomplete=\"off\"><label for=\"discord-client-id\">Discord application ID</label><input id=\"discord-client-id\" name=\"client_id\" type=\"text\" inputmode=\"numeric\" maxlength=\"20\" required=\"\" autocomplete=\"off\"/> <label for=\"discord-client-secret\">Discord application secret</label><input id=\"discord-client-secret\" name=\"client_secret\" type=\"password\" minlength=\"1\" maxlength=\"256\" pattern=\"[!-~]+\" required=\"\" autocomplete=\"off\"/> <label class=\"identity-ack\" for=\"discord-logging-ack\"><input id=\"discord-logging-ack\" name=\"callback_logging_reviewed\" type=\"checkbox\" required=\"\"/>I reviewed callback query logging at every layer before enabling this application.</label> <button class=\"button primary discord-save-application\" type=\"submit\">Save Discord application</button></form> <!> <p class=\"field-help\">Replacing or removing application access cancels unfinished links. Accepted identity links remain saved and can be unlinked locally.</p></details>"), Qs = /* @__PURE__ */ K("<!> <!> <!> <!> <!> <!>", 1), $s = /* @__PURE__ */ K("<div class=\"identity-view\"><section class=\"card identity-intro\"><p class=\"eyebrow\">YOUR DISCORD IDENTITY</p><h2>Choose a deliberate connection</h2><p>Link a verified Discord identity to this Reborn account. You review the identity and confirm it before a link is saved.</p><p class=\"field-help\">Your local sign-in and recovery stay available. A saved link records past identity verification; Discord sign-in, friends, server roles and bot setup are still planned.</p></section> <section class=\"card identity-card\" data-discord-identity=\"\" aria-label=\"Discord identity connection\"><p class=\"workspace-status\" role=\"status\" data-discord-status=\"\"> </p> <button class=\"button secondary discord-check\">Check Discord identity status</button> <!></section></div>");
function ec(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = Z(t, "binding", 8), a = Z(t, "owner", 8, !1), o = Z(t, "active", 8, !1), s = Z(t, "state", 8), c = Z(t, "check", 8), l = Z(t, "act", 8), u = Z(t, "saveApplication", 8), d = /* @__PURE__ */ I(), f = "", p = /* @__PURE__ */ I(!1), m = (e) => (/* @__PURE__ */ new Date(Number(BigInt(e)) * 1e3)).toLocaleString("en-US", {
		timeZone: "America/Chicago",
		timeZoneName: "short"
	});
	function h(e, t, n) {
		let r = t && n && e.value ? `${e.value.application.revision}:${e.value.application.configured}` : "";
		t && n && r === f && e.save === "idle" || H(d)?.reset(), t || L(p, !1), f = r;
	}
	Li(() => H(d)?.reset());
	async function g() {
		H(d)?.reset(), L(p, !1), await c()();
	}
	async function _(e = !1) {
		let t = s().value;
		if (!a() || !H(n) || !t) return;
		let r = H(d) ? new FormData(H(d)) : void 0, i = e ? null : {
			client_id: String(r?.get("client_id") ?? ""),
			client_secret: String(r?.get("client_secret") ?? ""),
			callback_logging_reviewed: r?.get("callback_logging_reviewed") === "on"
		};
		H(d)?.reset(), r?.delete("client_secret");
		try {
			await u()(t.application.revision, i);
		} finally {
			i && (i.client_secret = "");
		}
	}
	wn(() => (W(s()), W(o()), W(a())), () => {
		h(s(), o(), a());
	}), wn(() => (W(o()), W(s()), H(p)), () => {
		L(n, o() && s().phase === "ready" && s().save === "idle" && !!s().value && !H(p));
	}), wn(() => W(s()), () => {
		L(r, !!s().value && !["none", "cancelled"].includes(s().value.attempt.phase));
	}), Tn(), Ti();
	var v = $s(), y = B(R(v), 2), b = R(y), x = z(b, !0), S = B(b, 2), C = B(S, 2), w = (e) => {
		let t = /* @__PURE__ */ P(() => (W(s()), U(() => s().value)));
		var o = Qs(), c = sn(o), u = (e) => {
			var r = Vs(), i = B(R(r), 2), a = B(R(i)), o = z(a, !0), s = B(a, 2), c = z(s, !0), u = z(B(s, 2), !0);
			M(i);
			var d = B(i, 4);
			be(2), M(r), V((e) => {
				J(o, (W(H(t)), U(() => H(t).link.identity.display_name))), J(c, (W(H(t)), U(() => H(t).link.identity.id))), J(u, e), d.disabled = !H(n);
			}, [() => (W(H(t)), U(() => m(H(t).link.identity.verified_at)))]), G("click", d, () => void l()("unlink")), q(e, r);
		}, f = (e) => {
			var a = Ws(), o = B(sn(a), 2), s = (e) => {
				var a = Hs(), o = sn(a), s = B(B(R(o), 2), 2);
				pi(s);
				var c = B(s, 2);
				pi(c);
				var l = B(c, 2);
				pi(l);
				var u = B(l, 2);
				pi(u);
				var f = B(u, 2), m = z(f, !0);
				M(o), be(2), V((e) => {
					mi(s, i()), mi(c, (W(H(t)), U(() => H(t).link.revision))), mi(l, (W(H(t)), U(() => H(t).link.flow_generation))), mi(u, (W(H(t)), U(() => H(t).application.revision))), f.disabled = e, J(m, H(r) ? "Start a new Discord link" : "Start Discord identity link");
				}, [() => (H(n), W(H(t)), U(() => !H(n) || [
					"ready_to_review",
					"reviewing",
					"review_ready"
				].includes(H(t).attempt.phase)))]), Cr("submit", o, () => {
					L(p, !0), H(d)?.reset();
				}), q(e, a);
			}, c = (e) => {
				q(e, Us());
			};
			Y(o, (e) => {
				W(H(t)), U(() => H(t).application.configured) ? e(s) : e(c, -1);
			}), q(e, a);
		};
		Y(c, (e) => {
			W(H(t)), U(() => H(t).link.identity) ? e(u) : e(f, -1);
		});
		var h = B(c, 2), g = (e) => {
			var t = Gs(), r = B(R(t), 2);
			M(t), V(() => r.disabled = !H(n)), G("click", r, () => void l()("review")), q(e, t);
		};
		Y(h, (e) => {
			W(H(t)), U(() => H(t).attempt.phase === "ready_to_review") && e(g);
		});
		var v = B(h, 2), y = (e) => {
			var r = Ks(), i = B(R(r)), a = B(R(i)), o = z(a, !0), s = z(B(a, 2), !0);
			M(i);
			var c = B(i, 2);
			M(r), V(() => {
				J(o, (W(H(t)), U(() => H(t).attempt.candidate.display_name))), J(s, (W(H(t)), U(() => H(t).attempt.candidate.id))), c.disabled = !H(n);
			}), G("click", c, () => void l()("confirm")), q(e, r);
		};
		Y(v, (e) => {
			W(H(t)), U(() => H(t).attempt.phase === "review_ready" && H(t).attempt.candidate) && e(y);
		});
		var b = B(v, 2), x = (e) => {
			q(e, qs());
		}, S = (e) => {
			q(e, Js());
		};
		Y(b, (e) => {
			W(H(t)), U(() => H(t).attempt.cleanup === "acknowledged") ? e(x) : (W(H(t)), U(() => H(t).attempt.cleanup === "unconfirmed") && e(S, 1));
		});
		var C = B(b, 2), w = (e) => {
			var r = Ys();
			V(() => r.disabled = (H(n), W(H(t)), U(() => !H(n) || H(t).attempt.phase === "reviewing"))), G("click", r, () => void l()("cancel")), q(e, r);
		};
		Y(C, (e) => {
			H(r) && e(w);
		});
		var T = B(C, 2), E = (e) => {
			var r = Zs(), i = B(R(r), 3), a = z(R(i), !0);
			M(i);
			var o = B(i, 3), s = B(R(o));
			X(s, "pattern", "[1-9][0-9]{0,19}");
			var c = B(s, 3), l = B(c, 2), u = R(l);
			be(), M(l);
			var f = B(l, 2);
			M(o), wi(o, (e) => L(d, e), () => H(d));
			var p = B(o, 2), m = (e) => {
				var t = Xs();
				V(() => t.disabled = !H(n)), G("click", t, () => void _(!0)), q(e, t);
			};
			Y(p, (e) => {
				W(H(t)), U(() => H(t).application.configured) && e(m);
			}), be(2), M(r), V(() => {
				J(a, (W(H(t)), U(() => H(t).application.callback_uri))), s.disabled = !H(n), c.disabled = !H(n), u.disabled = !H(n), f.disabled = !H(n);
			}), Cr("submit", o, (e) => {
				e.preventDefault(), _();
			}), q(e, r);
		};
		Y(T, (e) => {
			a() && e(E);
		}), q(e, o);
	};
	Y(C, (e) => {
		W(o()), W(s()), U(() => o() && s().phase === "ready" && s().value) && e(w);
	}), M(y), M(v), V((e) => {
		X(y, "data-phase", (W(s()), U(() => s().value?.attempt.phase ?? s().phase))), X(y, "data-configured", e), X(y, "data-link-revision", (W(s()), U(() => s().value?.link.revision ?? ""))), X(y, "data-flow-generation", (W(s()), U(() => s().value?.link.flow_generation ?? ""))), X(y, "data-app-revision", (W(s()), U(() => s().value?.application.revision ?? ""))), X(y, "data-save", (W(s()), U(() => s().save))), J(x, (W(s()), U(() => s().message || "Check your current Discord link to begin."))), S.disabled = (W(o()), W(s()), U(() => !o() || s().save === "saving" || s().phase === "loading"));
	}, [() => (W(s()), U(() => String(s().value?.application.configured ?? !1)))]), G("click", S, () => void g()), q(e, v), Ue();
}
wr(["click"]);
// src/Sessions.svelte
var tc = /* @__PURE__ */ K("<span class=\"quiet-label session-current-badge\">This session</span>"), nc = /* @__PURE__ */ K("<button class=\"button secondary session-signout-current\" form=\"workspace-sign-out\" type=\"submit\">Sign out this session</button> <p class=\"field-help\">Uses the normal sign-out form for this browser.</p>", 1), rc = /* @__PURE__ */ K("<button class=\"button secondary session-revoke\" type=\"button\">Sign out this other session</button> <p class=\"field-help\">Ends only this sign-in. Your account and other sessions stay available.</p>", 1), ic = /* @__PURE__ */ K("<li class=\"session-row\" data-session-row=\"\"><div class=\"session-row-heading\"><h3> </h3><!></div> <dl class=\"session-details\"><dt>Created</dt><dd><time data-session-created=\"\"> </time></dd><dt>Expires</dt><dd><time data-session-expires=\"\"> </time></dd></dl> <!></li>"), ac = /* @__PURE__ */ K("<p class=\"sessions-only-current\">This is your only active session at the checked time.</p>"), oc = /* @__PURE__ */ K("<p class=\"field-help sessions-snapshot\">Checked <time> </time>. Later sign-ins, expiry and sign-outs can change the next result.</p> <ul class=\"session-list\" aria-label=\"Your active sign-in sessions\"></ul> <!>", 1), sc = /* @__PURE__ */ K("<div class=\"sessions-view\"><section class=\"card sessions-intro\"><p class=\"eyebrow\">YOUR SIGN-IN SESSIONS</p><h2>Review your active sign-ins</h2><p>Review your active Reborn sign-ins and deliberately sign out one other session. Each entry shows when that session was created and when it expires.</p><p class=\"field-help\">This list does not identify a device, browser, IP address or last-used time. Your account supports up to 32 active sessions. It shows a complete snapshot when checked, rather than session history.</p></section> <section class=\"card sessions-card\" data-sessions-view=\"\" aria-label=\"Active sign-in sessions\"><div class=\"sessions-heading\"><h2>Active sessions</h2><button class=\"button secondary sessions-check\">Check active sessions</button></div> <p class=\"workspace-status\" role=\"status\" data-sessions-status=\"\"> </p> <!> <p class=\"field-help sessions-account-link\">For normal sign-out, sign-out everywhere or recovery, <a href=\"/account\">open Account &amp; recovery</a>.</p></section></div>");
function cc(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = Z(t, "active", 8, !1), i = Z(t, "state", 8), a = Z(t, "check", 8), o = Z(t, "revoke", 8), s = /* @__PURE__ */ I(), c = !1, l = (e) => (/* @__PURE__ */ new Date(Number(BigInt(e)) * 1e3)).toLocaleString("en-US", {
		timeZone: "America/Chicago",
		timeZoneName: "short"
	}), u = (e) => (/* @__PURE__ */ new Date(Number(BigInt(e)) * 1e3)).toISOString();
	function d() {
		c = !1;
	}
	async function f(e, t) {
		let n = t.currentTarget;
		c = n instanceof HTMLButtonElement && document.activeElement === n, await o()(e);
		let i = c;
		c = !1, i && r() && document.visibilityState === "visible" && document.hasFocus() && (document.activeElement === document.body || document.activeElement === document.documentElement) && H(s)?.isConnected && !H(s).disabled && H(s).focus({ preventScroll: !0 });
	}
	Ii(() => {
		let e = (e) => {
			e.target !== document.body && e.target !== document.documentElement && d();
		};
		return document.addEventListener("pointerdown", d, !0), document.addEventListener("keydown", d, !0), document.addEventListener("focusin", e, !0), window.addEventListener("blur", d), () => {
			d(), document.removeEventListener("pointerdown", d, !0), document.removeEventListener("keydown", d, !0), document.removeEventListener("focusin", e, !0), window.removeEventListener("blur", d);
		};
	}), wn(() => (W(r()), W(i())), () => {
		L(n, r() && i().phase === "ready" && i().save === "idle" && !!i().value);
	}), wn(() => W(r()), () => {
		r() || d();
	}), Tn(), Ti();
	var p = sc(), m = B(R(p), 2), h = R(m), g = B(R(h));
	wi(g, (e) => L(s, e), () => H(s)), M(h);
	var _ = B(h, 2), v = z(_, !0), y = B(_, 2), b = (e) => {
		var t = oc(), r = sn(t), a = B(R(r)), o = z(a, !0);
		be(), M(r);
		var s = B(r, 2);
		qr(s, 5, () => (W(i()), U(() => i().value.sessions)), (e) => e.id, (e, t) => {
			var r = ic(), i = R(r), a = R(i), o = z(a, !0), s = B(a), c = (e) => {
				q(e, tc());
			};
			Y(s, (e) => {
				H(t), U(() => H(t).current) && e(c);
			}), M(i);
			var d = B(i, 2), p = B(R(d)), m = R(p), h = z(m, !0);
			M(p);
			var g = B(p, 2), _ = R(g), v = z(_, !0);
			M(g), M(d);
			var y = B(d, 2), b = (e) => {
				var t = nc(), r = sn(t);
				be(2), V(() => r.disabled = !H(n)), q(e, t);
			}, x = (e) => {
				var r = rc(), i = sn(r);
				be(2), V((e) => {
					i.disabled = !H(n), X(i, "aria-label", e);
				}, [() => (H(t), U(() => `Sign out the other session created ${l(H(t).created_at)}`))]), G("click", i, (e) => void f(H(t).id, e)), q(e, r);
			};
			Y(y, (e) => {
				H(t), U(() => H(t).current) ? e(b) : e(x, -1);
			}), M(r), V((e, n, i, a, s) => {
				X(r, "data-session-id", (H(t), U(() => H(t).id))), X(r, "data-current", e), J(o, (H(t), U(() => H(t).current ? "Your current sign-in" : "Another sign-in session"))), X(m, "datetime", n), J(h, i), X(_, "datetime", a), J(v, s);
			}, [
				() => (H(t), U(() => String(H(t).current))),
				() => (H(t), U(() => u(H(t).created_at))),
				() => (H(t), U(() => l(H(t).created_at))),
				() => (H(t), U(() => u(H(t).expires_at))),
				() => (H(t), U(() => l(H(t).expires_at)))
			]), q(e, r);
		}), M(s);
		var c = B(s, 2), d = (e) => {
			q(e, ac());
		};
		Y(c, (e) => {
			W(i()), U(() => i().value.sessions.length === 1) && e(d);
		}), V((e, t) => {
			X(a, "datetime", e), J(o, t);
		}, [() => (W(i()), U(() => u(i().value.checked_at))), () => (W(i()), U(() => l(i().value.checked_at)))]), q(e, t);
	};
	Y(y, (e) => {
		W(r()), W(i()), U(() => r() && i().phase === "ready" && i().value) && e(b);
	}), be(2), M(m), M(p), V(() => {
		X(m, "data-phase", (W(i()), U(() => i().phase))), X(m, "data-save", (W(i()), U(() => i().save))), X(m, "data-session-count", (W(i()), U(() => i().value?.sessions.length ?? ""))), X(m, "data-checked-at", (W(i()), U(() => i().value?.checked_at ?? ""))), g.disabled = (W(r()), W(i()), U(() => !r() || i().phase === "loading" || i().save === "saving")), J(v, (W(i()), U(() => i().message || "Check your active sign-in sessions to begin.")));
	}), G("click", g, () => void a()()), q(e, p), Ue();
}
wr(["click"]);
// src/App.svelte
var lc = /* @__PURE__ */ K("<span class=\"notification-badge\"> </span>"), uc = /* @__PURE__ */ K("<a rel=\"noreferrer\"> </a>"), dc = /* @__PURE__ */ K("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), fc = /* @__PURE__ */ K("<span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button>", 1), pc = /* @__PURE__ */ K("<span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p> </p><button class=\"text-button\">View connections <span aria-hidden=\"true\">→</span></button>", 1), mc = /* @__PURE__ */ K("<section><!></section>"), hc = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), gc = /* @__PURE__ */ K("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), _c = /* @__PURE__ */ K("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), vc = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), yc = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), bc = /* @__PURE__ */ K("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span aria-hidden=\"true\"></span></button> <button><span aria-hidden=\"true\">◇</span>Connections</button> <button><span aria-hidden=\"true\">▦</span>Services</button> <button><span aria-hidden=\"true\">◷</span>Activity</button> <button><span aria-hidden=\"true\">♧</span>Notifications<!></button> <button><span aria-hidden=\"true\">⊞</span>Integrations</button> <button><span aria-hidden=\"true\">≡</span>Roadmap</button> <button><span aria-hidden=\"true\">▻</span>Media</button> <button><span aria-hidden=\"true\">⇄</span>Queues</button> <button><span aria-hidden=\"true\">◎</span>Identity</button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <button class=\"text-button review-sessions\" data-open-sessions=\"\">Review sign-in sessions</button> <form id=\"workspace-sign-out\" method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary> <dl><dt>Source</dt><dd><!></dd><dt>Tree</dt><dd> </dd><dt>Channel</dt><dd> </dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><div class=\"button-row\"><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button><button class=\"text-button\">Read the Roadmap note</button></div></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-layout-heading\"><p class=\"layout-status\" role=\"status\"> </p><button class=\"button secondary customize-home\">Customize Home</button></div> <div><!></div> <div></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <section aria-label=\"Connections\"><!></section> <section aria-label=\"Activity\"><!></section> <section aria-label=\"Notifications\"><!></section> <section><!></section> <section aria-label=\"Media\"><!></section> <section aria-label=\"Queues\"><!></section> <section aria-label=\"Identity\"><!></section> <section aria-label=\"Sign-in sessions\"><!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function xc(e, t) {
	He(t, !1);
	let n = () => Ni(u, "$model", r), [r, i] = Pi(), a = /* @__PURE__ */ I(), o = /* @__PURE__ */ I(), s = /* @__PURE__ */ I(), c = Z(t, "binding", 8), l = Ba(c()), u = l.model, d = /* @__PURE__ */ I(window.location.hash === "#sessions" ? "sessions" : window.location.hash === "#identity" ? "identity" : "home"), f = /* @__PURE__ */ I(), p = /* @__PURE__ */ I(), m = /* @__PURE__ */ I(Wi()), h, g = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", _ = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified", v = document.querySelector("meta[name=\"reborn-tree\"]")?.content ?? "unqualified", y = document.querySelector("meta[name=\"reborn-channel\"]")?.content ?? "development";
	function b(e) {
		let t = H(d) === "media" && e !== "media" || H(d) === "queues" && e !== "queues" || H(d) === "identity" && e !== "identity" || H(d) === "sessions" && e !== "sessions";
		H(d) === "media" && e !== "media" && l.closeMedia(), H(d) === "queues" && e !== "queues" && l.closeQueues(), H(d) === "identity" && e !== "identity" && l.closeIdentity(), H(d) === "sessions" && e !== "sessions" && l.closeSessions(), t ? kt(() => {
			L(d, e);
		}) : L(d, e), H(f)?.focus(), e === "activity" && l.activity(), e === "notifications" && l.check(), (e === "integrations" || e === "roadmap") && l.loadGuide(), e === "media" && l.openMedia(), e === "queues" && l.openQueues();
	}
	let x = /* @__PURE__ */ I(!1), S = /* @__PURE__ */ I(!1), C = () => n().snapshot ? `${n().snapshot.account.id}:${n().snapshot.session_generation}:${n().snapshot.account.role}` : "";
	Ri(() => {
		let e = document.activeElement;
		h = H(d) === "home" && n().phase === "ready" && e instanceof HTMLElement && H(p)?.contains(e) ? {
			element: e,
			scope: C()
		} : void 0;
	}), zi(() => {
		let e = h;
		h = void 0, e && H(d) === "home" && n().phase === "ready" && e.scope === C() && e.element.isConnected && H(p)?.contains(e.element) && document.activeElement === document.body && document.visibilityState === "visible" && document.hasFocus() && e.element.getClientRects().length > 0 && e.element.focus({ preventScroll: !0 });
	}), Ii(l.start), wn(() => (n(), Wi), () => {
		L(a, n().layoutDraft?.panels ?? n().snapshot?.layout.panels ?? Wi());
	}), wn(() => (n(), H(d), H(a)), () => {
		n().phase === "ready" ? H(d) !== "directory" && L(m, H(a)) : L(m, Wi());
	}), wn(() => n(), () => {
		L(o, new TextEncoder().encode(n().draft).length);
	}), wn(() => (n(), H(o)), () => {
		L(s, n().phase === "ready" && n().dirty && H(o) <= 4096 && !["saving", "checking-conflict"].includes(n().layoutSave) && n().notificationSave !== "saving" && ![
			"saving",
			"checking-conflict",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), wn(() => (H(d), n()), () => {
		(H(d) !== "identity" || n().phase !== "ready") && L(x, !1);
	}), wn(() => (H(d), n(), H(x)), () => {
		H(d) === "identity" && n().phase === "ready" && !H(x) && (L(x, !0), l.openIdentity());
	}), wn(() => (H(d), n()), () => {
		(H(d) !== "sessions" || n().phase !== "ready") && L(S, !1);
	}), wn(() => (H(d), n(), H(S)), () => {
		H(d) === "sessions" && n().phase === "ready" && !H(S) && (L(S, !0), l.openSessions());
	}), Tn(), Ti();
	var w = bc(), T = B(sn(w), 2), E = R(T), ee = B(R(E), 4), te = R(ee);
	let ne;
	var re = B(te, 2);
	let ie;
	var ae = B(R(re), 2);
	let oe;
	M(re);
	var se = B(re, 2);
	let ce;
	var le = B(se, 2);
	let ue;
	var D = B(le, 2);
	let de;
	var O = B(D, 2);
	let fe;
	var pe = B(R(O), 2), me = (e) => {
		var t = lc(), r = z(t, !0);
		V(() => {
			X(t, "aria-label", (n(), U(() => `${n().snapshot.notifications.unread_groups} unread groups`))), J(r, (n(), U(() => n().snapshot.notifications.unread_groups)));
		}), q(e, t);
	};
	Y(pe, (e) => {
		n(), U(() => n().snapshot?.notifications.unread_groups) && e(me);
	}), M(O);
	var he = B(O, 2);
	let k;
	var ge = B(he, 2);
	let A;
	var _e = B(ge, 2);
	let j;
	var ve = B(_e, 2);
	let ye;
	var xe = B(ve, 2);
	let Se;
	M(ee);
	var Ce = B(ee, 2), we = R(Ce), Te = B(R(we)), Ee = R(Te), De = z(Ee, !0), Oe = z(B(Ee), !0);
	M(Te), M(we);
	var ke = B(we, 2), Ae = B(ke, 2), je = B(B(R(Ae), 2), 2);
	pi(je), be(2), M(Ae);
	var Me = B(Ae, 2), Ne = R(Me), Pe = R(Ne, !0);
	be(), M(Ne);
	var Fe = B(Ne, 2), Ie = B(R(Fe)), Le = R(Ie), Re = (e) => {
		var t = uc(), n = z(t, !0);
		V(() => {
			X(t, "href", `https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${_}`), J(n, _);
		}), q(e, t);
	}, ze = /* @__PURE__ */ ft(() => U(() => /^[a-f0-9]{40}$/.test(_))), Be = (e) => {
		var t = Mr();
		V(() => J(t, _)), q(e, t);
	};
	Y(Le, (e) => {
		H(ze) ? e(Re) : e(Be, -1);
	}), M(Ie);
	var N = B(Ie, 2), Ve = z(N, !0), We = z(B(N, 2), !0);
	be(2), M(Fe), M(Me), M(Ce), M(E);
	var Ge = B(E, 2), Ke = R(Ge), qe = R(Ke), Je = B(R(qe)), Ye = z(Je, !0);
	wi(Je, (e) => L(f, e), () => H(f)), M(qe);
	var Xe = B(qe), Ze = B(R(Xe), 1, !0);
	M(Xe), M(Ke);
	var Qe = B(Ke, 2), $e = z(Qe, !0), tt = B(Qe, 2), nt = (e) => {
		q(e, dc());
	};
	Y(tt, (e) => {
		n(), U(() => n().phase !== "ready") && e(nt);
	});
	var rt = B(tt, 2), it = R(rt), at = R(it), ot = B(R(at), 3), st = R(ot), ct = B(st);
	M(ot), M(at), be(), M(it);
	var lt = B(it, 2), ut = R(lt), dt = z(ut, !0), pt = B(ut);
	M(lt);
	var mt = B(lt, 2), ht = R(mt);
	{
		let e = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.layout))), t = /* @__PURE__ */ P(() => (n(), U(() => n().phase === "ready")));
		Ka(ht, {
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
	M(mt);
	var gt = B(mt, 2);
	let _t;
	qr(gt, 5, () => H(m), (e) => e.id, (e, t) => {
		var r = mc();
		let i;
		var a = R(r), o = (e) => {
			var t = fc(), r = B(sn(t), 2), i = z(r, !0), a = B(r);
			V(() => J(i, (n(), U(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are.")))), G("click", a, () => b("note")), q(e, t);
		}, s = (e) => {
			var t = pc(), r = B(sn(t), 2), i = z(r, !0), a = B(r);
			V(() => J(i, (n(), U(() => n().snapshot?.crafty?.configured ? "Your enrolled Crafty observations are available in Connections." : "Enroll dedicated Crafty access to see your selected servers.")))), G("click", a, () => b("connections")), q(e, t);
		}, c = (e) => {
			{
				let t = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.directory))), r = /* @__PURE__ */ P(() => (n(), U(() => n().phase === "ready"))), i = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.account.role === "owner"))), a = /* @__PURE__ */ P(() => H(d) === "home");
				jo(e, {
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
		}), M(r), V(() => {
			X(r, "data-home-panel", (H(t), U(() => H(t).id))), X(r, "hidden", (n(), H(t), H(d), U(() => n().phase !== "ready" || (H(t).id === "pins" ? H(d) === "home" && !H(t).visible : H(d) !== "home" || !H(t).visible)))), X(r, "aria-label", (H(t), U(() => H(t).id === "pins" ? "Services" : H(t).id === "note" ? "Workspace note shortcut" : "Connections shortcut"))), i = ti(r, 1, "", null, i, {
				card: H(t).id !== "pins",
				"small-card": H(t).id !== "pins",
				"pins-panel": H(t).id === "pins"
			});
		}), q(e, r);
	}), M(gt), wi(gt, (e) => L(p, e), () => H(p)), M(rt);
	var vt = B(rt, 2), F = R(vt), yt = z(B(R(F)), !0);
	M(F);
	var bt = B(F, 2), xt = (e) => {
		var t = hc(), n = B(R(t), 2), r = R(n), i = B(r);
		M(n), M(t), G("click", r, function(...e) {
			l.recover?.apply(this, e);
		}), G("click", i, () => l.resolve(!0)), q(e, t);
	};
	Y(bt, (e) => {
		n(), U(() => n().recovery) && e(xt);
	});
	var St = B(bt, 2), Ct = B(R(St), 2);
	et(Ct);
	var wt = B(Ct, 4), Tt = R(wt);
	let Et;
	var Dt = z(Tt), Ot = B(Tt), At = z(Ot, !0);
	M(wt), M(St);
	var jt = B(St, 2), Mt = (e) => {
		q(e, gc());
	};
	Y(jt, (e) => {
		n(), U(() => n().storageLimited) && e(Mt);
	});
	var Nt = B(jt, 2), Pt = (e) => {
		q(e, _c());
	};
	Y(Nt, (e) => {
		H(o) > 4096 && e(Pt);
	});
	var Ft = B(Nt, 2), It = (e) => {
		var t = vc(), r = B(R(t), 2), i = z(r, !0), a = B(r), o = R(a), s = B(o);
		M(a), M(t), V(() => J(i, (n(), U(() => n().snapshot?.note.body)))), G("click", o, () => l.resolve(!1)), G("click", s, () => l.resolve(!0)), q(e, t);
	};
	Y(Ft, (e) => {
		n(), U(() => n().save === "conflict") && e(It);
	});
	var Lt = B(Ft, 2), Rt = (e) => {
		var t = yc(), n = B(R(t), 2);
		M(t), G("click", n, () => l.check()), q(e, t);
	};
	Y(Lt, (e) => {
		n(), U(() => n().save === "uncertain") && e(Rt);
	}), M(vt);
	var zt = B(vt, 2), Bt = R(zt);
	{
		let e = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.crafty))), t = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.account.role === "owner"))), r = /* @__PURE__ */ P(() => (H(d), n(), U(() => H(d) === "connections" && n().phase === "ready")));
		mo(Bt, {
			history: () => {
				L(d, "activity"), H(f)?.focus(), l.activity("connections", "");
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
			},
			get observationState() {
				return n(), U(() => n().observations);
			},
			get loadObservations() {
				return U(() => l.observations);
			}
		});
	}
	M(zt);
	var Vt = B(zt, 2), Ht = R(Vt);
	{
		let e = /* @__PURE__ */ P(() => (n(), U(() => n().phase === "ready")));
		Ro(Ht, {
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
	M(Vt);
	var Ut = B(Vt, 2), Wt = R(Ut);
	{
		let e = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.notifications))), t = /* @__PURE__ */ P(() => (n(), U(() => n().phase === "ready")));
		Uo(Wt, {
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
	M(Ut);
	var Gt = B(Ut, 2), Kt = R(Gt);
	{
		let e = /* @__PURE__ */ P(() => H(d) === "roadmap" ? "roadmap" : "catalog"), t = /* @__PURE__ */ P(() => (n(), U(() => n().phase === "ready"))), r = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.account.role === "owner")));
		as(Kt, {
			get mode() {
				return H(e);
			},
			get state() {
				return n(), U(() => n().guide);
			},
			get authorized() {
				return H(t);
			},
			retry: () => l.loadGuide(!0),
			connections: () => b("connections"),
			media: () => b("media"),
			queues: () => b("queues"),
			identity: () => b("identity"),
			get owner() {
				return H(r);
			}
		});
	}
	M(Gt);
	var qt = B(Gt, 2), Jt = R(qt);
	{
		let e = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.account.role === "owner"))), t = /* @__PURE__ */ P(() => (H(d), n(), U(() => H(d) === "media" && n().phase === "ready")));
		xs(Jt, {
			get state() {
				return n(), U(() => n().media);
			},
			get owner() {
				return H(e);
			},
			get active() {
				return H(t);
			},
			get check() {
				return U(() => l.checkMedia);
			},
			get load() {
				return U(() => l.loadMedia);
			},
			get save() {
				return U(() => l.saveMedia);
			}
		});
	}
	M(qt);
	var Yt = B(qt, 2), Xt = R(Yt);
	{
		let e = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.account.role === "owner"))), t = /* @__PURE__ */ P(() => (H(d), n(), U(() => H(d) === "queues" && n().phase === "ready")));
		Bs(Xt, {
			get state() {
				return n(), U(() => n().queues);
			},
			get owner() {
				return H(e);
			},
			get active() {
				return H(t);
			},
			get check() {
				return U(() => l.checkQueues);
			},
			get load() {
				return U(() => l.loadQueues);
			},
			get save() {
				return U(() => l.saveQueues);
			}
		});
	}
	M(Yt);
	var Zt = B(Yt, 2), Qt = R(Zt);
	{
		let e = /* @__PURE__ */ P(() => (n(), U(() => n().snapshot?.account.role === "owner"))), t = /* @__PURE__ */ P(() => (H(d), n(), U(() => H(d) === "identity" && n().phase === "ready")));
		ec(Qt, {
			get binding() {
				return c();
			},
			get state() {
				return n(), U(() => n().identity);
			},
			get owner() {
				return H(e);
			},
			get active() {
				return H(t);
			},
			get check() {
				return U(() => l.checkIdentity);
			},
			get act() {
				return U(() => l.identityAction);
			},
			get saveApplication() {
				return U(() => l.saveDiscordApplication);
			}
		});
	}
	M(Zt);
	var $t = B(Zt, 2), en = R($t);
	{
		let e = /* @__PURE__ */ P(() => (H(d), n(), U(() => H(d) === "sessions" && n().phase === "ready")));
		cc(en, {
			get state() {
				return n(), U(() => n().sessions);
			},
			get active() {
				return H(e);
			},
			get check() {
				return U(() => l.checkSessions);
			},
			get revoke() {
				return U(() => l.revokeSession);
			}
		});
	}
	M($t), be(2), M(Ge), M(T), V(() => {
		X(te, "aria-current", H(d) === "home" ? "page" : void 0), ne = ti(te, 1, "", null, ne, { active: H(d) === "home" }), X(re, "aria-current", H(d) === "note" ? "page" : void 0), ie = ti(re, 1, "", null, ie, { active: H(d) === "note" }), oe = ti(ae, 1, "draft-dot", null, oe, { visible: n().dirty }), X(se, "aria-current", H(d) === "connections" ? "page" : void 0), ce = ti(se, 1, "", null, ce, { active: H(d) === "connections" }), X(le, "aria-current", H(d) === "directory" ? "page" : void 0), ue = ti(le, 1, "", null, ue, { active: H(d) === "directory" }), X(D, "aria-current", H(d) === "activity" ? "page" : void 0), de = ti(D, 1, "", null, de, { active: H(d) === "activity" }), X(O, "aria-current", H(d) === "notifications" ? "page" : void 0), fe = ti(O, 1, "", null, fe, { active: H(d) === "notifications" }), X(he, "aria-current", H(d) === "integrations" ? "page" : void 0), k = ti(he, 1, "", null, k, { active: H(d) === "integrations" }), X(ge, "aria-current", H(d) === "roadmap" ? "page" : void 0), A = ti(ge, 1, "", null, A, { active: H(d) === "roadmap" }), X(_e, "aria-current", H(d) === "media" ? "page" : void 0), j = ti(_e, 1, "", null, j, { active: H(d) === "media" }), X(ve, "aria-current", H(d) === "queues" ? "page" : void 0), ye = ti(ve, 1, "", null, ye, { active: H(d) === "queues" }), X(xe, "aria-current", H(d) === "identity" ? "page" : void 0), Se = ti(xe, 1, "", null, Se, { active: H(d) === "identity" }), J(De, (n(), U(() => n().snapshot?.account.username ?? "Your account"))), J(Oe, (n(), U(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), ke.disabled = (n(), U(() => n().phase !== "ready")), X(ke, "aria-current", H(d) === "sessions" ? "page" : void 0), mi(je, c()), J(Pe, g), J(Ve, v), J(We, y), J(Ye, H(d) === "home" ? "Welcome home." : H(d) === "note" ? "A little space to think." : H(d) === "connections" ? "Your servers, at a glance." : H(d) === "directory" ? "Everything within reach." : H(d) === "activity" ? "Pick up the thread." : H(d) === "notifications" ? "Catch up at your pace." : H(d) === "integrations" ? "Make the right connections." : H(d) === "media" ? "A window into your media." : H(d) === "queues" ? "See what’s in motion." : H(d) === "identity" ? "An identity you choose." : H(d) === "sessions" ? "Your active sign-ins." : "See what comes next."), J(Ze, (n(), U(() => n().phase === "ready" ? "Session checked" : n().phase === "checking" ? "Checking access" : "Access paused"))), J($e, (n(), U(() => n().message))), X(rt, "hidden", (H(d), n(), U(() => H(d) !== "home" && H(d) !== "directory" || n().phase !== "ready"))), X(rt, "aria-label", H(d) === "directory" ? "Service directory view" : "Home"), X(it, "hidden", H(d) !== "home"), X(lt, "hidden", H(d) !== "home"), J(dt, (n(), U(() => n().layoutMessage || "Your panels, in your own order."))), pt.disabled = (n(), U(() => !!n().layoutDraft || n().phase !== "ready" || n().layoutSave === "saving")), X(mt, "hidden", H(d) !== "home"), _t = ti(gt, 1, "home-grid", null, _t, { "services-view": H(d) === "directory" }), X(vt, "hidden", (H(d), n(), U(() => H(d) !== "note" || n().phase !== "ready"))), J(yt, (n(), U(() => n().dirty ? "Unsaved changes" : "Up to date"))), mi(Ct, (n(), U(() => n().draft))), Ct.disabled = (n(), U(() => n().phase !== "ready")), Et = ti(Tt, 1, "", null, Et, { "over-limit": H(o) > 4096 }), J(Dt, `${H(o) ?? ""} / 4096 bytes`), Ot.disabled = !H(s), J(At, (n(), U(() => n().save === "saving" ? "Saving…" : "Save note"))), X(zt, "hidden", (H(d), n(), U(() => H(d) !== "connections" || n().phase !== "ready"))), X(Vt, "hidden", (H(d), n(), U(() => H(d) !== "activity" || n().phase !== "ready"))), X(Ut, "hidden", (H(d), n(), U(() => H(d) !== "notifications" || n().phase !== "ready"))), X(Gt, "hidden", (H(d), n(), U(() => H(d) !== "integrations" && H(d) !== "roadmap" || n().phase !== "ready"))), X(Gt, "aria-label", H(d) === "roadmap" ? "Roadmap note" : "Integration catalog"), X(qt, "hidden", (H(d), n(), U(() => H(d) !== "media" || n().phase !== "ready"))), X(Yt, "hidden", (H(d), n(), U(() => H(d) !== "queues" || n().phase !== "ready"))), X(Zt, "hidden", (H(d), n(), U(() => H(d) !== "identity" || n().phase !== "ready"))), X($t, "hidden", (H(d), n(), U(() => H(d) !== "sessions" || n().phase !== "ready")));
	}), G("click", te, () => b("home")), G("click", re, () => b("note")), G("click", se, () => b("connections")), G("click", le, () => b("directory")), G("click", D, () => b("activity")), G("click", O, () => b("notifications")), G("click", he, () => b("integrations")), G("click", ge, () => b("roadmap")), G("click", _e, () => b("media")), G("click", ve, () => b("queues")), G("click", xe, () => b("identity")), G("click", ke, () => b("sessions")), Cr("submit", Ae, () => l.signOut()), G("click", st, () => b("note")), G("click", ct, () => b("roadmap")), G("click", pt, function(...e) {
		l.beginLayout?.apply(this, e);
	}), Cr("submit", St, (e) => {
		e.preventDefault(), l.save();
	}), G("input", Ct, (e) => l.edit(e.currentTarget.value)), q(e, w), Ue(), i();
}
wr(["click", "input"]);
// src/main.ts
var Sc = document.getElementById("workspace-root"), Cc = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, wc = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
if (Sc && Cc && /^[a-f0-9]{64}$/.test(Cc) && wc === "reborn-workspace-v1") {
	let e = Array.from(Sc.childNodes);
	Sc.replaceChildren();
	try {
		Rr(xc, {
			target: Sc,
			props: { binding: Cc }
		});
	} catch {
		Sc.replaceChildren(...e);
	}
}
