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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, ee = 32768, b = 1 << 25, te = 65536, ne = 1 << 19, re = 1 << 20, ie = 1 << 21, ae = 1 << 22, oe = 1 << 23, x = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = Symbol("form reset"), he = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ge = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), _e = {}, S = Symbol("uninitialized"), ve = "http://www.w3.org/1999/xhtml";
function ye() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function be(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function xe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// ../node_modules/svelte/src/internal/client/dom/hydration.js
var C = !1;
function Se(e) {
	C = e;
}
var w;
function T(e) {
	if (e === null) throw be(), _e;
	return w = e;
}
function Ce() {
	return T(/* @__PURE__ */ Qt(w));
}
function E(e) {
	if (C) {
		if (/* @__PURE__ */ Qt(w) !== null) throw be(), _e;
		w = e;
	}
}
function we(e = 1) {
	if (C) {
		for (var t = e, n = w; t--;) n = /* @__PURE__ */ Qt(n);
		w = n;
	}
}
function Te(e = !0) {
	for (var t = 0, n = w;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ Qt(n);
		e && n.remove(), n = i;
	}
}
function Ee(e) {
	if (!e || e.nodeType !== 8) throw be(), _e;
	return e.data;
}
// ../node_modules/svelte/src/internal/client/reactivity/equality.js
function De(e) {
	return e === this.v;
}
function Oe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function ke(e) {
	return !Oe(e, this.v);
}
function Ae(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
// ../node_modules/svelte/src/internal/client/errors.js
function je() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Me(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ne() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Pe(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Fe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
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
var D = null;
function Ue(e) {
	D = e;
}
function We(e, t = !1, n) {
	D = {
		p: D,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: W,
		l: Ve && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ge(e) {
	var t = D, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) dn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, D = t.p, Ke(e);
}
function Ke(e = {}) {
	return i(e, se, { value: !0 }), e;
}
function qe() {
	return !Ve || D !== null && D.l === null;
}
// ../node_modules/svelte/src/internal/client/dom/task.js
var O = [];
function Je() {
	var e = O;
	O = [], p(e);
}
function k(e) {
	if (O.length === 0 && !yt) {
		var t = O;
		queueMicrotask(() => {
			t === O && Je();
		});
	}
	O.push(e);
}
function Ye() {
	for (; O.length > 0;) Je();
}
// ../node_modules/svelte/src/internal/client/reactivity/status.js
var Xe = ~(g | _ | h);
function A(e, t) {
	e.f = e.f & Xe | t;
}
function Ze(e) {
	e.f & 512 || e.deps === null ? A(e, h) : A(e, _);
}
// ../node_modules/svelte/src/internal/client/reactivity/utils.js
function Qe(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), A(e, h);
}
// ../node_modules/svelte/src/internal/client/dom/elements/misc.js
function $e(e) {
	C && /* @__PURE__ */ Zt(e) !== null && en(e);
}
var et = !1;
function tt() {
	et || (et = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[me]?.();
		});
	}, { capture: !0 }));
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function nt(e) {
	var t = V, n = W;
	U(null), G(null);
	try {
		return e();
	} finally {
		U(t), G(n);
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/async.js
function rt(e, t, n, r) {
	let i = qe() ? st : ut;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = it(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				R(e, s);
			}
			at();
		}
	}
	var d = ot();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ lt(e))).then(u).catch((e) => R(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), at());
	}) : f();
}
function it() {
	var e = W, t = V, n = D, r = j;
	return function(i = !0) {
		G(e), U(t), Ue(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function at(e = !0) {
	G(null), U(null), Ue(null), e && j?.deactivate();
}
function ot() {
	var e = W, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function st(e) {
	var t = 2 | g;
	return W !== null && (W.f |= ne), {
		ctx: D,
		deps: null,
		effects: null,
		equals: De,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: S,
		wv: 0,
		parent: W,
		ac: null
	};
}
var ct = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function lt(e, t, n) {
	let r = W;
	r === null && je();
	var i = void 0, a = Ft(S), o = !V, s = /* @__PURE__ */ new Set();
	return _n(() => {
		var t = W, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== he && n.reject(e);
			}).finally(at);
		} catch (e) {
			n.reject(e), at();
		}
		var c = j;
		if (o) {
			if (t.f & 32768) var l = ot();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(ct);
			else for (let e of s.values()) e.reject(ct);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== ct && (c.activate(), t ? (a.f |= oe, Bt(a, t)) : (a.f & 8388608 && (a.f ^= oe), Bt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), ln(() => {
		for (let e of s) e.reject(ct);
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
function ut(e) {
	let t = /* @__PURE__ */ st(e);
	return t.equals = ke, t;
}
function dt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function ft(e) {
	var t, n = W, r = e.parent;
	if (!Nn && r !== null && e.v !== S && r.f & 24576) return ye(), e.v;
	G(r);
	try {
		dt(e), t = Wn(e);
	} finally {
		G(n);
	}
	return t;
}
function pt(e) {
	var t = ft(e);
	!e.equals(t) && (e.wv = Vn(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), _t?.capture(e, t, !0)), e.deps === null)) ? A(e, h) : Nn || (M === null ? Ze(e) : (cn() || j?.is_fork) && M.set(e, t));
}
function mt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && nt(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = d), qn(t, 0), Cn(t));
}
function ht(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Jn(t);
}
// ../node_modules/svelte/src/internal/client/reactivity/batch.js
var gt = null, j = null, _t = null, M = null, vt = null, yt = !1, bt = !1, xt = null, St = null, Ct = 0, wt = 1, Tt = class e {
	id = wt++;
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
		gt === null ? gt = this : (gt.#n = this, this.#t = gt), gt = this;
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
			for (var r of n.d) A(r, g), t(r);
			for (r of n.m) A(r, _), t(r);
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
		for (let e of this.#u) this.#d.delete(e), A(e, g), this.schedule(e);
		for (let e of this.#d) A(e, _), this.schedule(e);
		this.apply();
		for (var t = xt = [], n = [], r = St = []; this.#c.length > 0;) {
			Ct++ > 1e3 && (this.#S(), Dt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Mt(e), this.#h() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (xt = null, St = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) jt(e, t);
			r.length > 0 && j.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), _t = this, kt(n), kt(t), _t = null, this.#s?.resolve();
			var o = j;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (N.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : Hn(r) && (i & 16 && this.#d.add(r), Jn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), A(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), j = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) Qe(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== S && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), M?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		j = this;
	}
	deactivate() {
		j = null, M = null;
	}
	flush() {
		try {
			bt = !0, j = this, this.#_();
		} finally {
			Ct = 0, vt = null, xt = null, St = null, bt = !1, j = null, M = null, N.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ct);
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
		this.#m || (this.#m = !0, k(() => {
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
		if (j === null) {
			let t = j = new e();
			!bt && !yt && k(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		M = null;
	}
	schedule(e) {
		vt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? gt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Et(e) {
	var t = yt, n = _t;
	_t = null, yt = !0;
	try {
		var r;
		for (e && (Et(), r = e());;) {
			if (Ye(), j === null) return r;
			j.flush();
		}
	} finally {
		yt = t, _t = n;
	}
}
function Dt() {
	try {
		Fe();
	} catch (e) {
		R(e, vt);
	}
}
var Ot = null;
function kt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Hn(r) && (Ot = /* @__PURE__ */ new Set(), Jn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && En(r), Ot?.size > 0)) {
				N.clear();
				for (let e of Ot) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ot.has(n) && (Ot.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Jn(n);
					}
				}
				Ot.clear();
			}
		}
		Ot = null;
	}
}
function At(e) {
	j.schedule(e);
}
function jt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), A(e, h);
		for (var n = e.first; n !== null;) jt(n, t), n = n.next;
	}
}
function Mt(e) {
	A(e, h);
	for (var t = e.first; t !== null;) Mt(t), t = t.next;
}
// ../node_modules/svelte/src/internal/client/reactivity/sources.js
var Nt = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map(), Pt = !1;
function Ft(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: De,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function It(e, t) {
	let n = Ft(e, t);
	return Fn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Lt(e, t = !1, n = !0) {
	let r = Ft(e);
	return t || (r.equals = ke), Ve && n && D !== null && D.l !== null && (D.l.s ??= []).push(r), r;
}
function P(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && qe() && V.f & 4325394 && (K === null || !K.has(e)) && ze(), Bt(e, n ? Wt(t) : t, St);
}
var Rt = null, zt = 0;
function Bt(e, t, n = null) {
	if (!e.equals(t)) {
		Nn ? N.set(e, t) : N.has(e) || N.set(e, e.v);
		var r = Tt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ft(t), M === null && Ze(t);
		}
		e.wv = Vn(), Rt = null, zt = 0, Ut(e, g, n), Rt = null, qe() && W !== null && W.f & 1024 && !(W.f & 96) && (Y === null ? In([e]) : Y.push(e)), !r.is_fork && Nt.size > 0 && !Pt && Vt();
	}
	return t;
}
function Vt() {
	Pt = !1;
	for (let e of Nt) {
		e.f & 1024 && A(e, _);
		let t;
		try {
			t = Hn(e);
		} catch {
			t = !0;
		}
		t && Jn(e);
	}
	Nt.clear();
}
function Ht(e) {
	P(e, e.v + 1);
}
function Ut(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = qe(), a = r.length;
		if (zt += a, zt > 1e5 && Rt === null && (Rt = /* @__PURE__ */ new Set()), Rt !== null) {
			if (Rt.has(e)) return;
			Rt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== W) {
				var l = (c & g) === 0;
				if (l && A(s, t), c & 131072) Nt.add(s);
				else if (c & 2) {
					var u = s;
					M?.delete(u), Ut(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && Ot !== null && Ot.add(d), n === null ? At(d) : n.push(d);
				}
			}
		}
	}
}
function Wt(t) {
	if (typeof t != "object" || !t || x in t || se in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ It(0), u = null, d = zn, f = (e) => {
		if (zn === d) return e();
		var t = V, n = zn;
		U(null), Bn(d);
		var r = e();
		return U(t), Bn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ It(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Le();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ It(n.value, u);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ It(S, u));
					r.set(t, e), Ht(o);
				}
			} else P(n, S), Ht(o);
			return !0;
		},
		get(e, n, i) {
			if (n === x) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ It(Wt(s ? e[n] : S), u)), r.set(n, o)), o !== void 0) {
				var c = X(o);
				return c === S ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = X(i);
				if (a === S) return;
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
			if (t === x) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== S || Reflect.has(e, t);
			return (n !== void 0 || W !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ It(i ? Wt(e[t]) : S, u)), r.set(t, n)), X(n) === S) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ It(S, u)), r.set(d + "", p)) : P(p, S);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ It(void 0, u)), P(c, Wt(n)), r.set(t, c));
			else {
				l = c.v !== S;
				var m = f(() => Wt(n));
				P(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && P(g, _ + 1);
				}
				Ht(o);
			}
			return !0;
		},
		ownKeys(e) {
			X(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== S;
			});
			for (var [n, i] of r) i.v !== S && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Re();
		}
	});
}
var Gt, Kt, qt, Jt;
function Yt() {
	if (Gt === void 0) {
		Gt = window, Kt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		qt = a(t, "firstChild").get, Jt = a(t, "nextSibling").get, u(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), u(n) && (n[pe] = void 0);
	}
}
function Xt(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Zt(e) {
	return qt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Qt(e) {
	return Jt.call(e);
}
function F(e, t) {
	if (!C) return /* @__PURE__ */ Zt(e);
	var n = /* @__PURE__ */ Zt(w);
	if (n === null) n = w.appendChild(Xt());
	else if (t && n.nodeType !== 3) {
		var r = Xt();
		return n?.before(r), T(r), r;
	}
	return t && rn(n), T(n), n;
}
function $t(e, t = !1) {
	if (!C) {
		var n = /* @__PURE__ */ Zt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Qt(n) : n;
	}
	if (t) {
		if (w?.nodeType !== 3) {
			var r = Xt();
			return w?.before(r), T(r), r;
		}
		rn(w);
	}
	return w;
}
function I(e, t = !1) {
	if (!C) return /* @__PURE__ */ Zt(e);
	var n = F(e, t);
	return E(e), n;
}
function L(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Qt(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = Xt();
			return r === null ? i?.after(a) : r.before(a), T(a), a;
		}
		rn(r);
	}
	return T(r), r;
}
function en(e) {
	e.textContent = "";
}
function tn() {
	return !1;
}
function nn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function rn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function an(e) {
	var t = W;
	if (t === null) return V.f |= oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	R(e, t);
}
function R(e, t) {
	if (e === _e) throw e;
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
function on(e) {
	W === null && (V === null && Pe(e), Ne()), Nn && Me(e);
}
function sn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function z(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: D,
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
	j?.register_created_effect(r);
	var i = r;
	if (e & 4) xt === null ? Tt.ensure().schedule(r) : xt.push(r);
	else if (t !== null) {
		try {
			Jn(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= te));
	}
	if (i !== null && (i.parent = n, n !== null && sn(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function cn() {
	return V !== null && !H;
}
function ln(e) {
	let t = z(8, null);
	return A(t, h), t.teardown = e, t;
}
function un(e) {
	on("$effect");
	var t = W.f;
	if (!V && t & 32 && D !== null && !D.i) {
		var n = D;
		(n.e ??= []).push(e);
	} else return dn(e);
}
function dn(e) {
	return z(4 | re, e);
}
function fn(e) {
	return on("$effect.pre"), z(8 | re, e);
}
function pn(e) {
	Tt.ensure();
	let t = z(64 | ne, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Dn(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function mn(e) {
	return z(4, e);
}
function hn(e, t) {
	var n = D, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = vn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = W;
			try {
				G(n.parent), Z(t);
			} finally {
				G(n);
			}
		}
	});
}
function gn() {
	var e = D;
	vn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && A(n, _), Hn(n) && Jn(n), t.ran = !1;
		}
	});
}
function _n(e) {
	return z(ae | ne, e);
}
function vn(e, t = 0) {
	return z(8 | t, e);
}
function yn(e, t = [], n = [], r = []) {
	rt(r, t, n, (t) => {
		z(8, () => {
			e(...t.map(X));
		});
	});
}
function bn(e, t = 0) {
	return z(16 | t, e);
}
function xn(e) {
	return z(32 | ne, e);
}
function Sn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Nn, r = V;
		Pn(!0), U(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			Pn(n), U(r);
		}
	}
}
function Cn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && nt(() => {
			e.abort(he);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function wn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Tn(e.nodes.start, e.nodes.end), n = !0), e.f |= b, Cn(e, t && !n), qn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Sn(e), e.f ^= b, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && En(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Tn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Qt(e);
		e.remove(), e = n;
	}
}
function En(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Dn(e, t, n = !0) {
	var r = [];
	e.f |= 256, On(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function On(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				On(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function kn(e) {
	e.f &= -257, An(e, !0);
}
function An(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (A(e, g), Tt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			An(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function jn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Qt(n);
		t.append(n), n = i;
	}
}
// ../node_modules/svelte/src/internal/client/legacy.js
var Mn = null, Nn = !1;
function Pn(e) {
	Nn = e;
}
var V = null, H = !1;
function U(e) {
	V = e;
}
var W = null;
function G(e) {
	W = e;
}
var K = null;
function Fn(e) {
	V !== null && (V.f & 2097152 || V.f & 2) && (K ??= /* @__PURE__ */ new Set()).add(e);
}
var q = null, J = 0, Y = null;
function In(e) {
	Y = e;
}
var Ln = 1, Rn = 0, zn = Rn;
function Bn(e) {
	zn = e;
}
function Vn() {
	return ++Ln;
}
function Hn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Hn(a) && pt(a), a.wv > e.wv) return !0;
		}
		t & 512 && M === null && A(e, h);
	}
	return !1;
}
function Un(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(K !== null && K.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Un(a, t, !1) : t === a && (n ? A(a, g) : a.f & 1024 && A(a, _), At(a));
	}
}
function Wn(e) {
	var t = q, n = J, r = Y, i = V, a = K, o = D, s = H, c = zn, l = e.f;
	q = null, J = 0, Y = null, V = l & 96 ? null : e, K = null, Ue(e.ctx), H = !1, zn = ++Rn, e.ac !== null && (nt(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = Gn(e);
		if (qe() && Y !== null && !H && f !== null && !(e.f & 6146)) for (var p = 0; p < Y.length; p++) Un(Y[p], e);
		if (i !== null && i !== e) {
			if (Rn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Rn;
			if (t !== null) for (let e of t) e.rv = Rn;
			Y !== null && (r === null ? r = Y : r.push(...Y));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return Gn(e), an(t);
	} finally {
		e.f ^= ie, q = t, J = n, Y = r, V = i, K = a, Ue(o), H = s, zn = c;
	}
}
function Gn(e) {
	var t = e.deps, n = j?.is_fork;
	if (q !== null) {
		var r;
		if (n || qn(e, J), t !== null && J > 0) for (t.length = J + q.length, r = 0; r < q.length; r++) t[J + r] = q[r];
		else e.deps = t = q;
		if (cn() && e.f & 512) for (r = J; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && J < t.length && (qn(e, J), t.length = J);
	return t;
}
function Kn(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (q === null || !n.call(q, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== S && Ze(s), s.ac !== null && nt(() => {
			s.ac.abort(he), s.ac = null, A(s, g);
		}), mt(s), qn(s, 0);
	}
}
function qn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Kn(e, n[r]);
}
function Jn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		A(e, h);
		var n = W;
		W = e;
		try {
			t & 16777232 ? wn(e) : Cn(e), Sn(e);
			var r = Wn(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Ln;
		} finally {
			W = n;
		}
	}
}
function X(e) {
	var t = !!(e.f & 2);
	if (Mn?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (K === null || !K.has(e))) {
		var r = V.deps;
		if (V.f & 2097152) e.rv < Rn && (e.rv = Rn, q === null && r !== null && r[J] === e ? J++ : q === null ? q = [e] : q.push(e));
		else {
			V.deps ??= [], n.call(V.deps, e) || V.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [V] : n.call(i, V) || i.push(V);
		}
	}
	if (Nn && N.has(e)) return N.get(e);
	if (t) {
		var a = e;
		if (Nn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Xn(a)) && (o = ft(a)), N.set(a, o), o;
		}
		var s = !(a.f & 512) && !H && V !== null && !!(V.f & 512), c = (a.f & ee) === 0;
		Hn(a) && (s && (a.f |= 512), pt(a)), s && !c && (ht(a), Yn(a));
	}
	if (M?.has(e)) return M.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Yn(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (ht(r), Yn(r));
	}
}
function Xn(e) {
	if (e.v === S) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && Xn(t)) return !0;
	return !1;
}
function Z(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
function Zn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (x in e) Qn(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && x in n && Qn(n);
		}
	}
}
function Qn(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Qn(e[n], t);
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
var $n = ["touchstart", "touchmove"];
function er(e) {
	return $n.includes(e);
}
// ../node_modules/svelte/src/internal/client/dom/elements/events.js
var tr = Symbol("events"), nr = /* @__PURE__ */ new Set(), rr = /* @__PURE__ */ new Set();
function ir(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || lr.call(t, e), !e.cancelBubble) return nt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, k(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function ar(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = ir(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && ln(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Q(e, t, n) {
	(t[tr] ??= {})[e] = n;
}
function or(e) {
	for (var t = 0; t < e.length; t++) nr.add(e[t]);
	for (var n of rr) n(e);
}
var sr = null, cr = !1;
function lr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	sr = e, cr || (cr = !0, setTimeout(() => {
		cr = !1, sr = null;
	}));
	var s = 0, c = sr === e && e[tr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[tr] = t;
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
		var d = V, f = W;
		U(null), G(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[tr]?.[r];
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
			e[tr] = t, delete e.currentTarget, U(d), G(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var ur = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function dr(e) {
	return ur?.createHTML(e) ?? e;
}
function fr(e) {
	var t = nn("template");
	return t.innerHTML = dr(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function pr(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function mr(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (C) return pr(w, null), w;
		i === void 0 && (i = fr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Zt(i)));
		var t = r || Kt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Zt(t), s = t.lastChild;
			pr(o, s);
		} else pr(t, t);
		return t;
	};
}
function hr(e, t) {
	if (C) {
		var n = W;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = w), Ce();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function gr(e) {
	let t = 0, n = Ft(0), r;
	return () => {
		cn() && (X(n), vn(() => (t === 0 && (r = Z(() => e(() => Ht(n)))), t += 1, () => {
			k(() => {
				--t, t === 0 && (r?.(), r = void 0, Ht(n));
			});
		})));
	};
}
// ../node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var _r = te | ne;
function vr(e, t, n, r) {
	new yr(e, t, n, r);
}
var yr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = C ? w : null;
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
	#h = gr(() => (this.#m = Ft(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = bn(() => {
			if (C) {
				let e = Ee(this.#t);
				Ce();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, _r), C && (this.#e = w);
	}
	#g() {
		try {
			this.#a = xn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		k(r), t && (this.#s = xn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? xe() : (t = !0, n && Be(), this.#s !== null && Dn(this.#s, () => {
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
					R(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (y | b)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = xn(() => e(this.#e)), k(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = Xt(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return xn(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							R(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(j)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Dn(this.#o, () => {
					this.#o = null;
				}), this.#S(j));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = xn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				jn(this.#a, e);
				let t = this.#n.pending;
				this.#o = xn(() => t(this.#e));
			} else this.#S(j);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		Qe(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = W, n = V, r = D;
		G(this.#i), U(this.#i), Ue(this.#i.ctx);
		try {
			return Tt.ensure(), e();
		} finally {
			G(t), U(n), Ue(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Dn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, k(() => {
			this.#d = !1, this.#m && Bt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), X(this.#m);
	}
	error(e) {
		if (e === _e || !this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), C && (T(this.#t), we(), T(Te()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return xn(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return R(e, this.#i.parent), null;
				}
			}));
		};
		k(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					R(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => R(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function $(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function br(e, t) {
	return Sr(e, t);
}
var xr = /* @__PURE__ */ new Map();
function Sr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Yt();
	var l = void 0, u = pn(() => {
		var s = n ?? t.appendChild(Xt());
		vr(s, { pending: () => {} }, (t) => {
			We({});
			var n = D;
			if (o && (n.c = o), a && (i.$$events = a), C && pr(t, null), l = e(t, i) || Ke(), C && (W.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw be(), _e;
			Ge();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = er(r);
					for (let e of [t, document]) {
						var a = xr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), xr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, lr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(nr)), rr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = xr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, lr), r.delete(e), r.size === 0 && xr.delete(n)) : r.set(e, i);
			}
			rr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Cr.set(l, u), l;
}
var Cr = /* @__PURE__ */ new WeakMap(), wr = class {
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
			if (n) kn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (kn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (B(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						jn(r, t), t.append(Xt()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Dn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = tn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = Xt();
				i.append(a), this.#n.set(e, {
					effect: xn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, xn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else C && (this.anchor = w), this.#a(n);
	}
};
// ../node_modules/svelte/src/internal/client/dom/blocks/if.js
function Tr(e, t, n = !1) {
	var r;
	C && (r = w, Ce());
	var i = new wr(e), a = n ? te : 0;
	function o(e, t) {
		if (C) {
			var n = Ee(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Te();
				T(a), i.anchor = a, Se(!1), i.ensure(e, t), Se(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	bn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// ../node_modules/svelte/src/internal/shared/attributes.js
var Er = [..." 	\n\r\f\xA0\v﻿"];
function Dr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Er.includes(r[o - 1])) && (s === r.length || Er.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// ../node_modules/svelte/src/internal/client/dom/elements/class.js
function Or(e, t, n, r, i, a) {
	var o = e[de];
	if (C || o !== n || o === void 0) {
		var s = Dr(n, r, a);
		C && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// ../node_modules/svelte/src/internal/client/dom/elements/attributes.js
var kr = Symbol("is custom element"), Ar = Symbol("is html"), jr = ge ? "link" : "LINK", Mr = ge ? "progress" : "PROGRESS";
function Nr(e) {
	if (C) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Fr(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Fr(e, "checked", null), e.checked = r;
				}
			}
		};
		e[me] = n, k(n), tt();
	}
}
function Pr(e, t) {
	var n = Ir(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Mr) && (e.value = t ?? "");
}
function Fr(e, t, n, r) {
	var i = Ir(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === jr) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Rr(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Ir(e) {
	return e[ue] ??= {
		[kr]: e.nodeName.includes("-"),
		[Ar]: e.namespaceURI === ve
	};
}
var Lr = /* @__PURE__ */ new Map();
function Rr(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Lr.get(t);
	if (n) return n;
	Lr.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function zr(e, t) {
	return e === t || e?.[x] === t;
}
function Br(e = Ke(), t, n, r) {
	var i = D.r, a = W;
	return mn(() => {
		var o, s;
		return vn(() => {
			o = s, s = r?.() || [], Z(() => {
				zr(n(...s), e) || (t(e, ...s), o && zr(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && zr(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Vr(e = !1) {
	let t = D, n = t.l.u;
	if (!n) return;
	let r = () => Zn(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ st(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => X(i);
	}
	n.b.length && fn(() => {
		Hr(t, r), p(n.b);
	}), un(() => {
		let e = Z(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && un(() => {
		Hr(t, r), p(n.a);
	});
}
function Hr(e, t) {
	if (e.l.s) for (let t of e.l.s) X(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function Ur(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = Z(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var Wr = [];
function Gr(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Oe(e, t) && (e = t, n)) {
			let t = !Wr.length;
			for (let t of r) t[1](), Wr.push(t, e);
			if (t) {
				for (let e = 0; e < Wr.length; e += 2) Wr[e][0](Wr[e + 1]);
				Wr.length = 0;
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
function Kr(e) {
	let t;
	return Ur(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var qr = !1, Jr = Symbol("unmounted");
function Yr(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ Lt(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(Jr in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = Ur(e, (e) => {
				i ? r.source.v = e : P(r.source, e);
			}), i = !1;
		}
	}
	return e && Jr in n ? Kr(e) : X(r.source);
}
function Xr() {
	let e = {};
	function t() {
		ln(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Jr, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Zr(e) {
	var t = qr;
	try {
		return qr = !1, [e(), qr];
	} finally {
		qr = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function Qr(e, t, n, r) {
	var i = !Ve || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ st(r), X(u)) : (l && (l = !1, c = s ? Z(r) : r), c);
	let f;
	if (o) {
		var p = x in e || ce in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Zr(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ie(t), f(m)));
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
	var v = !1, y = (n & 1 ? st : ut)(() => (v = !1, g()));
	o && X(y);
	var ee = W;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? X(y) : i && o ? Wt(e) : e;
			return P(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Nn && v || ee.f & 16384 ? y.v : X(y);
	});
}
function $r(e) {
	D === null && Ae("onMount"), Ve && D.l !== null ? ei(D).m.push(e) : un(() => {
		let t = Z(e);
		if (typeof t == "function") return t;
	});
}
function ei(e) {
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
var ti = "keida-hub-reborn", ni = "reborn-workspace-v1", ri = 9223372036854775807n, ii = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1
}), ai = (e) => typeof e == "object" && !!e && !Array.isArray(e), oi = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= ri && (!t || e !== "0"), si = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096;
function ci(e) {
	if (!ai(e) || e.product !== ti || e.contract !== ni || e.schema !== 1 || !ai(e.account) || !oi(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !oi(e.session_generation) || !ai(e.note) || !si(e.note.body) || !oi(e.note.revision)) throw Error("Invalid workspace response");
	return e;
}
function li(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (ai(t) && t.schema === 1 && si(t.body) && oi(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
function ui(e) {
	let t = Gr(ii("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l = !1, u = !1, d = () => Kr(t), f = (e) => `${ti}.workspace.v1:${e.account.id}:${e.session_generation}`;
	function p() {
		if (s = void 0, o) try {
			sessionStorage.removeItem(o);
		} catch {}
	}
	function m() {
		let e = d();
		if (!o || !e.snapshot) return;
		if (!e.dirty) {
			p();
			return;
		}
		let n = {
			body: e.draft,
			base: e.base
		};
		s = {
			key: o,
			draft: n
		};
		try {
			sessionStorage.setItem(o, JSON.stringify({
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
	function h() {
		++n, r && clearTimeout(r), r = void 0, i?.abort(), a?.abort(), i = void 0, a = void 0;
	}
	function g(e, n = !1) {
		h(), u ||= n, Et(() => t.set(ii(n ? "blocked" : "paused", e)));
	}
	function _() {
		r && clearTimeout(r), !l && !u && d().phase === "ready" && document.visibilityState === "visible" && (r = setTimeout(() => {
			r = void 0, b();
		}, 15e3));
	}
	async function v(t, n, r) {
		let i = performance.now(), a = setTimeout(() => n.abort(), 4e3);
		try {
			let a = await fetch(t, {
				method: r ? "PUT" : "GET",
				credentials: "same-origin",
				cache: "no-store",
				redirect: "error",
				signal: n.signal,
				headers: {
					"X-Reborn-Product": ti,
					"X-Reborn-Contract": ni,
					"X-CSRF-Token": e,
					...r ? { "Content-Type": "application/json" } : {}
				},
				body: r ? JSON.stringify({
					body: r.body,
					base_revision: r.base
				}) : void 0
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
	function y(e) {
		return e === 401 || e === 403 ? "Your sign-in changed or ended. Open a fresh workspace after signing in." : e === 426 ? "This workspace needs a fresh document. Open workspace again." : "Your workspace could not be checked. Open workspace again when access is available.";
	}
	function ee(e) {
		let t = d().snapshot;
		return !t || e.account.id === t.account.id && e.session_generation === t.session_generation && e.account.role === t.account.role;
	}
	async function b() {
		if (l || u || i || a || document.visibilityState !== "visible") return;
		let e = new AbortController();
		i = e;
		let r = n;
		try {
			let i = await v("/api/workspace/snapshot", e);
			if (l || e.signal.aborted || r !== n) return;
			if (document.visibilityState !== "visible") {
				g("Workspace hidden. Checking access on return.");
				return;
			}
			if (i.status !== 200) {
				g(y(i.status), !0);
				return;
			}
			let a = ci(i.value);
			if (!ee(a)) {
				g("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let c = d();
			if (o = f(a), c.phase === "ready") {
				let e = c.dirty && a.note.revision !== c.base;
				t.set({
					...c,
					snapshot: a,
					draft: c.dirty ? c.draft : a.note.body,
					base: c.dirty ? c.base : a.note.revision,
					save: e ? "conflict" : c.save === "uncertain" ? "idle" : c.save,
					message: e ? "A newer saved note is available. Your draft is unchanged." : "Workspace checked."
				}), c.dirty && c.draft === a.note.body && (t.update((e) => ({
					...e,
					dirty: !1,
					base: a.note.revision,
					save: "saved"
				})), p());
			} else {
				let e = s?.key === o ? s.draft : void 0, n = !1;
				try {
					e ??= li(sessionStorage.getItem(o));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (p(), e = void 0), t.set({
					...ii("ready", "Workspace checked."),
					snapshot: a,
					draft: a.note.body,
					base: a.note.revision,
					recovery: e,
					storageLimited: n
				});
			}
			_();
		} catch {
			i === e && r === n && !l && g("Your workspace could not be checked. Open workspace again to retry deliberately.", !0);
		} finally {
			i === e && (i = void 0);
		}
	}
	function te(e) {
		let n = d();
		if (n.phase === "ready" && n.snapshot) {
			if (t.set({
				...n,
				draft: e,
				dirty: e !== n.snapshot.note.body,
				save: n.save === "saved" ? "idle" : n.save
			}), si(e)) m();
			else if (s = void 0, o) try {
				sessionStorage.removeItem(o);
			} catch {}
		}
	}
	function ne() {
		let e = d();
		e.recovery && e.snapshot && e.phase === "ready" && (t.set({
			...e,
			draft: e.recovery.body,
			base: e.recovery.base,
			dirty: !0,
			recovery: void 0,
			save: e.recovery.base === e.snapshot.note.revision ? "idle" : "conflict",
			message: "Draft recovered. Review it before saving."
		}), m());
	}
	function re(e) {
		let n = d();
		n.snapshot && n.phase === "ready" && (t.set({
			...n,
			draft: e ? n.snapshot.note.body : n.draft,
			base: n.snapshot.note.revision,
			dirty: !e && n.draft !== n.snapshot.note.body,
			recovery: void 0,
			save: "idle",
			message: e ? "Loaded the saved note." : "Draft kept against the latest saved revision. Review, then save deliberately."
		}), m());
	}
	async function ie() {
		let e = d();
		if (e.phase !== "ready" || !e.dirty || !si(e.draft) || e.save === "conflict" || e.save === "uncertain" || a) return;
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
			let e = await v("/api/workspace/note", o, c);
			if (l || o.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				g("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				g(y(e.status), !0);
				return;
			}
			if (e.status === 409) t.update((e) => ({
				...e,
				save: "conflict",
				message: "Another save won. Your draft is unchanged."
			}));
			else if (e.status === 200) {
				let n = ci(e.value);
				if (!ee(n) || n.note.body !== c.body || BigInt(n.note.revision) !== BigInt(c.base) + 1n) throw Error("Unqualified save result");
				t.update((e) => ({
					...e,
					snapshot: n,
					base: n.note.revision,
					dirty: e.draft !== n.note.body,
					save: "saved",
					message: e.draft === n.note.body ? "Saved to your account." : "Submitted version saved. Your newer edits are still unsaved."
				})), m();
			} else throw Error("Save outcome unavailable");
		} catch {
			a === o && s === n && !l && t.update((e) => ({
				...e,
				save: "uncertain",
				message: "Save outcome is uncertain. Check the saved note before trying again."
			}));
		} finally {
			a === o && (a = void 0), s === n && !l && (d().save === "conflict" ? await b() : _());
		}
	}
	function ae() {
		p(), g("Signing out…", !0);
		try {
			c?.postMessage({ kind: "auth-changed" });
		} catch {}
	}
	function oe() {
		let e = () => g("Workspace hidden. Checking access on return."), n = () => {
			b();
		}, r = () => {
			document.visibilityState === "visible" ? n() : e();
		};
		try {
			c = new BroadcastChannel("keida-hub-reborn.account.v1"), c.onmessage = (e) => {
				ai(e.data) && e.data.kind === "auth-changed" && g("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), b(), () => {
			l = !0, h(), c?.close(), t.set(ii("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
		};
	}
	return {
		model: t,
		start: oe,
		edit: te,
		recover: ne,
		resolve: re,
		save: ie,
		signOut: ae,
		check: b
	};
}
// src/App.svelte
var di = /* @__PURE__ */ mr("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), fi = /* @__PURE__ */ mr("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), pi = /* @__PURE__ */ mr("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), mi = /* @__PURE__ */ mr("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), hi = /* @__PURE__ */ mr("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), gi = /* @__PURE__ */ mr("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), _i = /* @__PURE__ */ mr("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span></span></button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <form method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary><p> </p><p>Source build · Reborn</p></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\" aria-label=\"Home\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-grid\"><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button></section><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p>Provider connections are not available yet. Game and media information will appear here after deliberate enrollment.</p><span class=\"quiet-label\">No provider data loaded</span></section></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function vi(e, t) {
	We(t, !1);
	let n = () => Yr(l, "$model", r), [r, i] = Xr(), a = /* @__PURE__ */ Lt(), o = /* @__PURE__ */ Lt(), s = Qr(t, "binding", 8), c = ui(s()), l = c.model, u = /* @__PURE__ */ Lt("home"), d = /* @__PURE__ */ Lt(), f = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", p = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified";
	function m(e) {
		P(u, e), X(d)?.focus();
	}
	$r(c.start), hn(() => n(), () => {
		P(a, new TextEncoder().encode(n().draft).length);
	}), hn(() => (n(), X(a)), () => {
		P(o, n().phase === "ready" && n().dirty && X(a) <= 4096 && ![
			"saving",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), gn(), Vr();
	var h = _i(), g = L($t(h), 2), _ = F(g), v = L(F(_), 4), y = F(v);
	let ee;
	var b = L(y, 2);
	let te;
	var ne = L(F(b), 2);
	let re;
	E(b), E(v);
	var ie = L(v, 2), ae = F(ie), oe = L(F(ae)), x = F(oe), se = I(x, !0), ce = I(L(x), !0);
	E(oe), E(ae);
	var le = L(ae, 2), ue = L(L(F(le), 2), 2);
	Nr(ue), we(2), E(le);
	var de = L(le, 2), fe = F(de), pe = F(fe, !0);
	we(), E(fe);
	var me = I(L(fe), !0);
	we(), E(de), E(ie), E(_);
	var he = L(_, 2), ge = F(he), _e = F(ge), S = L(F(_e)), ve = I(S, !0);
	Br(S, (e) => P(d, e), () => X(d)), E(_e);
	var ye = L(_e), be = L(F(ye), 1, !0);
	E(ye), E(ge);
	var xe = L(ge, 2), C = I(xe, !0), Se = L(xe, 2), w = (e) => {
		hr(e, di());
	};
	Tr(Se, (e) => {
		n(), Z(() => n().phase !== "ready") && e(w);
	});
	var T = L(Se, 2), Ce = F(T), Te = F(Ce), Ee = L(F(Te), 3);
	E(Te), we(), E(Ce);
	var De = L(Ce, 2), Oe = F(De), ke = L(F(Oe), 2), Ae = I(ke, !0), je = L(ke);
	E(Oe), we(), E(De), E(T);
	var Me = L(T, 2), Ne = F(Me), Pe = I(L(F(Ne)), !0);
	E(Ne);
	var Fe = L(Ne, 2), Ie = (e) => {
		var t = fi(), n = L(F(t), 2), r = F(n), i = L(r);
		E(n), E(t), Q("click", r, function(...e) {
			c.recover?.apply(this, e);
		}), Q("click", i, () => c.resolve(!0)), hr(e, t);
	};
	Tr(Fe, (e) => {
		n(), Z(() => n().recovery) && e(Ie);
	});
	var Le = L(Fe, 2), Re = L(F(Le), 2);
	$e(Re);
	var ze = L(Re, 4), Be = F(ze);
	let Ve;
	var He = I(Be), D = L(Be), Ue = I(D, !0);
	E(ze), E(Le);
	var Ke = L(Le, 2), qe = (e) => {
		hr(e, pi());
	};
	Tr(Ke, (e) => {
		n(), Z(() => n().storageLimited) && e(qe);
	});
	var O = L(Ke, 2), Je = (e) => {
		hr(e, mi());
	};
	Tr(O, (e) => {
		X(a) > 4096 && e(Je);
	});
	var k = L(O, 2), Ye = (e) => {
		var t = hi(), r = L(F(t), 2), i = I(r, !0), a = L(r), o = F(a), s = L(o);
		E(a), E(t), yn(() => $(i, (n(), Z(() => n().snapshot?.note.body)))), Q("click", o, () => c.resolve(!1)), Q("click", s, () => c.resolve(!0)), hr(e, t);
	};
	Tr(k, (e) => {
		n(), Z(() => n().save === "conflict") && e(Ye);
	});
	var Xe = L(k, 2), A = (e) => {
		var t = gi(), n = L(F(t), 2);
		E(t), Q("click", n, () => c.check()), hr(e, t);
	};
	Tr(Xe, (e) => {
		n(), Z(() => n().save === "uncertain") && e(A);
	}), E(Me), we(2), E(he), E(g), yn(() => {
		Fr(y, "aria-current", X(u) === "home" ? "page" : void 0), ee = Or(y, 1, "", null, ee, { active: X(u) === "home" }), Fr(b, "aria-current", X(u) === "note" ? "page" : void 0), te = Or(b, 1, "", null, te, { active: X(u) === "note" }), re = Or(ne, 1, "draft-dot", null, re, { visible: n().dirty }), Fr(ne, "aria-label", (n(), Z(() => n().dirty ? "Unsaved draft" : void 0))), $(se, (n(), Z(() => n().snapshot?.account.username ?? "Your account"))), $(ce, (n(), Z(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), Pr(ue, s()), $(pe, f), $(me, p), $(ve, X(u) === "home" ? "Welcome home." : "A little space to think."), $(be, (n(), Z(() => n().phase === "ready" ? "Session checked" : "Checking access"))), $(C, (n(), Z(() => n().message))), Fr(T, "hidden", (X(u), n(), Z(() => X(u) !== "home" || n().phase !== "ready"))), $(Ae, (n(), Z(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are."))), Fr(Me, "hidden", (X(u), n(), Z(() => X(u) !== "note" || n().phase !== "ready"))), $(Pe, (n(), Z(() => n().dirty ? "Unsaved changes" : "Up to date"))), Pr(Re, (n(), Z(() => n().draft))), Re.disabled = (n(), Z(() => n().phase !== "ready")), Ve = Or(Be, 1, "", null, Ve, { "over-limit": X(a) > 4096 }), $(He, `${X(a) ?? ""} / 4096 bytes`), D.disabled = !X(o), $(Ue, (n(), Z(() => n().save === "saving" ? "Saving…" : "Save note")));
	}), Q("click", y, () => m("home")), Q("click", b, () => m("note")), ar("submit", le, () => c.signOut()), Q("click", Ee, () => m("note")), Q("click", je, () => m("note")), ar("submit", Le, (e) => {
		e.preventDefault(), c.save();
	}), Q("input", Re, (e) => c.edit(e.currentTarget.value)), hr(e, h), Ge(), i();
}
or(["click", "input"]);
// src/main.ts
var yi = document.getElementById("workspace-root"), bi = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, xi = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
yi && bi && /^[a-f0-9]{64}$/.test(bi) && xi === "reborn-workspace-v1" && (yi.replaceChildren(), br(vi, {
	target: yi,
	props: { binding: bi }
}));
