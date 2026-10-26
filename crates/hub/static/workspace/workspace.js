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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, ee = 32768, b = 1 << 25, te = 65536, x = 1 << 19, ne = 1 << 20, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = Symbol("form reset"), he = new class extends Error {
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
		r: G,
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
	if (O.length === 0 && !bt) {
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
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/async.js
function rt(e, t, n, r) {
	let i = qe() ? st : dt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = G, c = it(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				z(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ lt(e))).then(u).catch((e) => z(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), at());
	}) : f();
}
function it() {
	var e = G, t = H, n = D, r = j;
	return function(i = !0) {
		K(e), W(t), Ue(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function at(e = !0) {
	K(null), W(null), Ue(null), e && j?.deactivate();
}
function ot() {
	var e = G, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function st(e) {
	var t = 2 | g;
	return G !== null && (G.f |= x), {
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
		parent: G,
		ac: null
	};
}
var ct = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function lt(e, t, n) {
	let r = G;
	r === null && je();
	var i = void 0, a = It(S), o = !H, s = /* @__PURE__ */ new Set();
	return _n(() => {
		var t = G, n = m();
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
			l?.(), s.delete(n), t !== ct && (c.activate(), t ? (a.f |= ae, Vt(a, t)) : (a.f & 8388608 && (a.f ^= ae), Vt(a, e)), c.deactivate());
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
	return Fn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function dt(e) {
	let t = /* @__PURE__ */ st(e);
	return t.equals = ke, t;
}
function ft(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function pt(e) {
	var t, n = G, r = e.parent;
	if (!Nn && r !== null && e.v !== S && r.f & 24576) return ye(), e.v;
	K(r);
	try {
		ft(e), t = Wn(e);
	} finally {
		K(n);
	}
	return t;
}
function mt(e) {
	var t = pt(e);
	!e.equals(t) && (e.wv = Vn(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), vt?.capture(e, t, !0)), e.deps === null)) ? A(e, h) : Nn || (M === null ? Ze(e) : (cn() || j?.is_fork) && M.set(e, t));
}
function ht(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && nt(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = d), qn(t, 0), Cn(t));
}
function gt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Jn(t);
}
// ../node_modules/svelte/src/internal/client/reactivity/batch.js
var _t = null, j = null, vt = null, M = null, yt = null, bt = !1, xt = !1, St = null, Ct = null, wt = 0, Tt = 1, Et = class e {
	id = Tt++;
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
		_t === null ? _t = this : (_t.#n = this, this.#t = _t), _t = this;
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
		for (var t = St = [], n = [], r = Ct = []; this.#c.length > 0;) {
			wt++ > 1e3 && (this.#S(), Ot());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Nt(e), this.#h() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (St = null, Ct = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Mt(e, t);
			r.length > 0 && j.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), vt = this, At(n), At(t), vt = null, this.#s?.resolve();
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
			xt = !0, j = this, this.#_();
		} finally {
			wt = 0, yt = null, St = null, Ct = null, xt = !1, j = null, M = null, N.clear();
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
			!xt && !bt && k(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		M = null;
	}
	schedule(e) {
		yt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? _t = e : t.#t = e, this.linked = !1;
		}
	}
};
function Dt(e) {
	var t = bt, n = vt;
	vt = null, bt = !0;
	try {
		var r;
		for (e && (Dt(), r = e());;) {
			if (Ye(), j === null) return r;
			j.flush();
		}
	} finally {
		bt = t, vt = n;
	}
}
function Ot() {
	try {
		Fe();
	} catch (e) {
		z(e, yt);
	}
}
var kt = null;
function At(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Hn(r) && (kt = /* @__PURE__ */ new Set(), Jn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && En(r), kt?.size > 0)) {
				N.clear();
				for (let e of kt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) kt.has(n) && (kt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Jn(n);
					}
				}
				kt.clear();
			}
		}
		kt = null;
	}
}
function jt(e) {
	j.schedule(e);
}
function Mt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), A(e, h);
		for (var n = e.first; n !== null;) Mt(n, t), n = n.next;
	}
}
function Nt(e) {
	A(e, h);
	for (var t = e.first; t !== null;) Nt(t), t = t.next;
}
// ../node_modules/svelte/src/internal/client/reactivity/sources.js
var Pt = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map(), Ft = !1;
function It(e, t) {
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
function Lt(e, t) {
	let n = It(e, t);
	return Fn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Rt(e, t = !1, n = !0) {
	let r = It(e);
	return t || (r.equals = ke), Ve && n && D !== null && D.l !== null && (D.l.s ??= []).push(r), r;
}
function P(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && qe() && H.f & 4325394 && (q === null || !q.has(e)) && ze(), Vt(e, n ? Gt(t) : t, Ct);
}
var zt = null, Bt = 0;
function Vt(e, t, n = null) {
	if (!e.equals(t)) {
		Nn ? N.set(e, t) : N.has(e) || N.set(e, e.v);
		var r = Et.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && pt(t), M === null && Ze(t);
		}
		e.wv = Vn(), zt = null, Bt = 0, Wt(e, g, n), zt = null, qe() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? In([e]) : X.push(e)), !r.is_fork && Pt.size > 0 && !Ft && Ht();
	}
	return t;
}
function Ht() {
	Ft = !1;
	for (let e of Pt) {
		e.f & 1024 && A(e, _);
		let t;
		try {
			t = Hn(e);
		} catch {
			t = !0;
		}
		t && Jn(e);
	}
	Pt.clear();
}
function Ut(e) {
	P(e, e.v + 1);
}
function Wt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = qe(), a = r.length;
		if (Bt += a, Bt > 1e5 && zt === null && (zt = /* @__PURE__ */ new Set()), zt !== null) {
			if (zt.has(e)) return;
			zt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== G) {
				var l = (c & g) === 0;
				if (l && A(s, t), c & 131072) Pt.add(s);
				else if (c & 2) {
					var u = s;
					M?.delete(u), Wt(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && kt !== null && kt.add(d), n === null ? jt(d) : n.push(d);
				}
			}
		}
	}
}
function Gt(t) {
	if (typeof t != "object" || !t || oe in t || se in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Lt(0), u = null, d = zn, f = (e) => {
		if (zn === d) return e();
		var t = H, n = zn;
		W(null), Bn(d);
		var r = e();
		return W(t), Bn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Lt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Le();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Lt(n.value, u);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Lt(S, u));
					r.set(t, e), Ut(o);
				}
			} else P(n, S), Ut(o);
			return !0;
		},
		get(e, n, i) {
			if (n === oe) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Lt(Gt(s ? e[n] : S), u)), r.set(n, o)), o !== void 0) {
				var c = Z(o);
				return c === S ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = Z(i);
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
			if (t === oe) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== S || Reflect.has(e, t);
			return (n !== void 0 || G !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Lt(i ? Gt(e[t]) : S, u)), r.set(t, n)), Z(n) === S) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Lt(S, u)), r.set(d + "", p)) : P(p, S);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Lt(void 0, u)), P(c, Gt(n)), r.set(t, c));
			else {
				l = c.v !== S;
				var m = f(() => Gt(n));
				P(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && P(g, _ + 1);
				}
				Ut(o);
			}
			return !0;
		},
		ownKeys(e) {
			Z(o);
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
var Kt, qt, Jt, Yt;
function Xt() {
	if (Kt === void 0) {
		Kt = window, qt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Jt = a(t, "firstChild").get, Yt = a(t, "nextSibling").get, u(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), u(n) && (n[pe] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Zt(e) {
	return Jt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Qt(e) {
	return Yt.call(e);
}
function I(e, t) {
	if (!C) return /* @__PURE__ */ Zt(e);
	var n = /* @__PURE__ */ Zt(w);
	if (n === null) n = w.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
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
			var r = F();
			return w?.before(r), T(r), r;
		}
		rn(w);
	}
	return w;
}
function L(e, t = !1) {
	if (!C) return /* @__PURE__ */ Zt(e);
	var n = I(e, t);
	return E(e), n;
}
function R(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Qt(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
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
	var t = G;
	if (t === null) return H.f |= ae, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	z(e, t);
}
function z(e, t) {
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
	G === null && (H === null && Pe(e), Ne()), Nn && Me(e);
}
function sn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function B(e, t) {
	var n = G;
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
	if (e & 4) St === null ? Et.ensure().schedule(r) : St.push(r);
	else if (t !== null) {
		try {
			Jn(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= te));
	}
	if (i !== null && (i.parent = n, n !== null && sn(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function cn() {
	return H !== null && !U;
}
function ln(e) {
	let t = B(8, null);
	return A(t, h), t.teardown = e, t;
}
function un(e) {
	on("$effect");
	var t = G.f;
	if (!H && t & 32 && D !== null && !D.i) {
		var n = D;
		(n.e ??= []).push(e);
	} else return dn(e);
}
function dn(e) {
	return B(4 | ne, e);
}
function fn(e) {
	return on("$effect.pre"), B(8 | ne, e);
}
function pn(e) {
	Et.ensure();
	let t = B(64 | x, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Dn(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function mn(e) {
	return B(4, e);
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
			var n = G;
			try {
				K(n.parent), Q(t);
			} finally {
				K(n);
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
	return B(ie | x, e);
}
function vn(e, t = 0) {
	return B(8 | t, e);
}
function yn(e, t = [], n = [], r = []) {
	rt(r, t, n, (t) => {
		B(8, () => {
			e(...t.map(Z));
		});
	});
}
function bn(e, t = 0) {
	return B(16 | t, e);
}
function xn(e) {
	return B(32 | x, e);
}
function Sn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Nn, r = H;
		Pn(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			z(t, e.parent);
		} finally {
			Pn(n), W(r);
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
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function wn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
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
		n && V(e), t && t();
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
		e.f ^= v, e.f & 1024 || (A(e, g), Et.ensure().schedule(e));
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
var H = null, U = !1;
function W(e) {
	H = e;
}
var G = null;
function K(e) {
	G = e;
}
var q = null;
function Fn(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function In(e) {
	X = e;
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
			if (Hn(a) && mt(a), a.wv > e.wv) return !0;
		}
		t & 512 && M === null && A(e, h);
	}
	return !1;
}
function Un(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(q !== null && q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Un(a, t, !1) : t === a && (n ? A(a, g) : a.f & 1024 && A(a, _), jt(a));
	}
}
function Wn(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = D, s = U, c = zn, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Ue(e.ctx), U = !1, zn = ++Rn, e.ac !== null && (nt(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = Gn(e);
		if (qe() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) Un(X[p], e);
		if (i !== null && i !== e) {
			if (Rn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Rn;
			if (t !== null) for (let e of t) e.rv = Rn;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (t) {
		return Gn(e), an(t);
	} finally {
		e.f ^= re, J = t, Y = n, X = r, H = i, q = a, Ue(o), U = s, zn = c;
	}
}
function Gn(e) {
	var t = e.deps, n = j?.is_fork;
	if (J !== null) {
		var r;
		if (n || qn(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (cn() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (qn(e, Y), t.length = Y);
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
	if (i === null && r.f & 2 && (J === null || !n.call(J, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== S && Ze(s), s.ac !== null && nt(() => {
			s.ac.abort(he), s.ac = null, A(s, g);
		}), ht(s), qn(s, 0);
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
		var n = G;
		G = e;
		try {
			t & 16777232 ? wn(e) : Cn(e), Sn(e);
			var r = Wn(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Ln;
		} finally {
			G = n;
		}
	}
}
function Z(e) {
	var t = !!(e.f & 2);
	if (Mn?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var r = H.deps;
		if (H.f & 2097152) e.rv < Rn && (e.rv = Rn, J === null && r !== null && r[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], n.call(H.deps, e) || H.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [H] : n.call(i, H) || i.push(H);
		}
	}
	if (Nn && N.has(e)) return N.get(e);
	if (t) {
		var a = e;
		if (Nn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Xn(a)) && (o = pt(a)), N.set(a, o), o;
		}
		var s = !(a.f & 512) && !U && H !== null && !!(H.f & 512), c = (a.f & ee) === 0;
		Hn(a) && (s && (a.f |= 512), mt(a)), s && !c && (gt(a), Yn(a));
	}
	if (M?.has(e)) return M.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Yn(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (gt(r), Yn(r));
	}
}
function Xn(e) {
	if (e.v === S) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && Xn(t)) return !0;
	return !1;
}
function Q(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
function Zn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (oe in e) Qn(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && oe in n && Qn(n);
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
		if (r.capture || ur.call(t, e), !e.cancelBubble) return nt(() => n?.call(this, e));
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
function or(e, t, n) {
	(t[tr] ??= {})[e] = n;
}
function sr(e) {
	for (var t = 0; t < e.length; t++) nr.add(e[t]);
	for (var n of rr) n(e);
}
var cr = null, lr = !1;
function ur(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	cr = e, lr || (lr = !0, setTimeout(() => {
		lr = !1, cr = null;
	}));
	var s = 0, c = cr === e && e[tr];
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
		var d = H, f = G;
		W(null), K(null);
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
			e[tr] = t, delete e.currentTarget, W(d), K(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var dr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function fr(e) {
	return dr?.createHTML(e) ?? e;
}
function pr(e) {
	var t = nn("template");
	return t.innerHTML = fr(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function mr(e, t) {
	var n = G;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function hr(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (C) return mr(w, null), w;
		i === void 0 && (i = pr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Zt(i)));
		var t = r || qt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Zt(t), s = t.lastChild;
			mr(o, s);
		} else mr(t, t);
		return t;
	};
}
function gr(e = "") {
	if (!C) {
		var t = F(e + "");
		return mr(t, t), t;
	}
	var n = w;
	return n.nodeType === 3 ? rn(n) : (n.before(n = F()), T(n)), mr(n, n), n;
}
function _r(e, t) {
	if (C) {
		var n = G;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = w), Ce();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function vr(e) {
	let t = 0, n = It(0), r;
	return () => {
		cn() && (Z(n), vn(() => (t === 0 && (r = Q(() => e(() => Ut(n)))), t += 1, () => {
			k(() => {
				--t, t === 0 && (r?.(), r = void 0, Ut(n));
			});
		})));
	};
}
// ../node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var yr = te | x;
function br(e, t, n, r) {
	new xr(e, t, n, r);
}
var xr = class {
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
	#h = vr(() => (this.#m = It(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = bn(() => {
			if (C) {
				let e = Ee(this.#t);
				Ce();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, yr), C && (this.#e = w);
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
					z(e, this.#i && this.#i.parent);
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
				var e = this.#c = document.createDocumentFragment(), t = F(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return xn(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							z(e, this.#i.parent);
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
		var t = G, n = H, r = D;
		K(this.#i), W(this.#i), Ue(this.#i.ctx);
		try {
			return Et.ensure(), e();
		} finally {
			K(t), W(n), Ue(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Dn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, k(() => {
			this.#d = !1, this.#m && Vt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Z(this.#m);
	}
	error(e) {
		if (e === _e || !this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), C && (T(this.#t), we(), T(Te()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return xn(() => {
						var r = G;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return z(e, this.#i.parent), null;
				}
			}));
		};
		k(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					z(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => z(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function $(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function Sr(e, t) {
	return wr(e, t);
}
var Cr = /* @__PURE__ */ new Map();
function wr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Xt();
	var l = void 0, u = pn(() => {
		var s = n ?? t.appendChild(F());
		br(s, { pending: () => {} }, (t) => {
			We({});
			var n = D;
			if (o && (n.c = o), a && (i.$$events = a), C && mr(t, null), l = e(t, i) || Ke(), C && (G.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw be(), _e;
			Ge();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = er(r);
					for (let e of [t, document]) {
						var a = Cr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Cr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, ur, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(nr)), rr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Cr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, ur), r.delete(e), r.size === 0 && Cr.delete(n)) : r.set(e, i);
			}
			rr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Tr.set(l, u), l;
}
var Tr = /* @__PURE__ */ new WeakMap(), Er = class {
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
				r && (V(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						jn(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Dn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = tn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = F();
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
function Dr(e, t, n = !1) {
	var r;
	C && (r = w, Ce());
	var i = new Er(e), a = n ? te : 0;
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
var Or = [..." 	\n\r\f\xA0\v﻿"];
function kr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Or.includes(r[o - 1])) && (s === r.length || Or.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// ../node_modules/svelte/src/internal/client/dom/elements/class.js
function Ar(e, t, n, r, i, a) {
	var o = e[de];
	if (C || o !== n || o === void 0) {
		var s = kr(n, r, a);
		C && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// ../node_modules/svelte/src/internal/client/dom/elements/attributes.js
var jr = Symbol("is custom element"), Mr = Symbol("is html"), Nr = ge ? "link" : "LINK", Pr = ge ? "progress" : "PROGRESS";
function Fr(e) {
	if (C) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Lr(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Lr(e, "checked", null), e.checked = r;
				}
			}
		};
		e[me] = n, k(n), tt();
	}
}
function Ir(e, t) {
	var n = Rr(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Pr) && (e.value = t ?? "");
}
function Lr(e, t, n, r) {
	var i = Rr(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Nr) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Br(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Rr(e) {
	return e[ue] ??= {
		[jr]: e.nodeName.includes("-"),
		[Mr]: e.namespaceURI === ve
	};
}
var zr = /* @__PURE__ */ new Map();
function Br(e) {
	var t = e.getAttribute("is") || e.nodeName, n = zr.get(t);
	if (n) return n;
	zr.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Vr(e, t) {
	return e === t || e?.[oe] === t;
}
function Hr(e = Ke(), t, n, r) {
	var i = D.r, a = G;
	return mn(() => {
		var o, s;
		return vn(() => {
			o = s, s = r?.() || [], Q(() => {
				Vr(n(...s), e) || (t(e, ...s), o && Vr(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Vr(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Ur(e = !1) {
	let t = D, n = t.l.u;
	if (!n) return;
	let r = () => Zn(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ st(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => Z(i);
	}
	n.b.length && fn(() => {
		Wr(t, r), p(n.b);
	}), un(() => {
		let e = Q(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && un(() => {
		Wr(t, r), p(n.a);
	});
}
function Wr(e, t) {
	if (e.l.s) for (let t of e.l.s) Z(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function Gr(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = Q(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var Kr = [];
function qr(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Oe(e, t) && (e = t, n)) {
			let t = !Kr.length;
			for (let t of r) t[1](), Kr.push(t, e);
			if (t) {
				for (let e = 0; e < Kr.length; e += 2) Kr[e][0](Kr[e + 1]);
				Kr.length = 0;
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
function Jr(e) {
	let t;
	return Gr(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var Yr = !1, Xr = Symbol("unmounted");
function Zr(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ Rt(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(Xr in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = Gr(e, (e) => {
				i ? r.source.v = e : P(r.source, e);
			}), i = !1;
		}
	}
	return e && Xr in n ? Jr(e) : Z(r.source);
}
function Qr() {
	let e = {};
	function t() {
		ln(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Xr, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function $r(e) {
	var t = Yr;
	try {
		return Yr = !1, [e(), Yr];
	} finally {
		Yr = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function ei(e, t, n, r) {
	var i = !Ve || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ st(r), Z(u)) : (l && (l = !1, c = s ? Q(r) : r), c);
	let f;
	if (o) {
		var p = oe in e || ce in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = $r(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ie(t), f(m)));
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
	var v = !1, y = (n & 1 ? st : dt)(() => (v = !1, g()));
	o && Z(y);
	var ee = G;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Z(y) : i && o ? Gt(e) : e;
			return P(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Nn && v || ee.f & 16384 ? y.v : Z(y);
	});
}
function ti(e) {
	D === null && Ae("onMount"), Ve && D.l !== null ? ni(D).m.push(e) : un(() => {
		let t = Q(e);
		if (typeof t == "function") return t;
	});
}
function ni(e) {
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
var ri = "keida-hub-reborn", ii = "reborn-workspace-v1", ai = 9223372036854775807n, oi = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1
}), si = (e) => typeof e == "object" && !!e && !Array.isArray(e), ci = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= ai && (!t || e !== "0"), li = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096;
function ui(e) {
	if (!si(e) || e.product !== ri || e.contract !== ii || e.schema !== 1 || !si(e.account) || !ci(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !ci(e.session_generation) || !si(e.note) || !li(e.note.body) || !ci(e.note.revision)) throw Error("Invalid workspace response");
	return e;
}
function di(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (si(t) && t.schema === 1 && li(t.body) && ci(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
function fi(e) {
	let t = qr(oi("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l = !1, u = !1, d = () => Jr(t), f = (e) => `${ri}.workspace.v1:${e.account.id}:${e.session_generation}`;
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
		h(), u ||= n, Dt(() => t.set(oi(n ? "blocked" : "paused", e)));
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
					"X-Reborn-Product": ri,
					"X-Reborn-Contract": ii,
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
			let a = ui(i.value);
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
					save: "saved",
					message: "The current note is saved."
				})), p());
			} else {
				let e = s?.key === o ? s.draft : void 0, n = !1;
				try {
					e ??= di(sessionStorage.getItem(o));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (p(), e = void 0), t.set({
					...oi("ready", "Workspace checked."),
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
			}), li(e)) m();
			else if (s = void 0, o) try {
				sessionStorage.removeItem(o);
			} catch {}
		}
	}
	function x() {
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
	function ne(e) {
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
	async function re() {
		let e = d();
		if (e.phase !== "ready" || !e.dirty || !li(e.draft) || e.save === "conflict" || e.save === "uncertain" || a) return;
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
				let n = ui(e.value);
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
	function ie() {
		p(), g("Signing out…", !0);
		try {
			c?.postMessage({ kind: "auth-changed" });
		} catch {}
	}
	function ae() {
		let e = () => g("Workspace hidden. Checking access on return."), n = () => {
			b();
		}, r = () => {
			document.visibilityState === "visible" ? n() : e();
		};
		try {
			c = new BroadcastChannel("keida-hub-reborn.account.v1"), c.onmessage = (e) => {
				si(e.data) && e.data.kind === "auth-changed" && g("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), b(), () => {
			l = !0, h(), c?.close(), t.set(oi("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
		};
	}
	return {
		model: t,
		start: ae,
		edit: te,
		recover: x,
		resolve: ne,
		save: re,
		signOut: ie,
		check: b
	};
}
// src/App.svelte
var pi = /* @__PURE__ */ hr("<a rel=\"noreferrer\"> </a>"), mi = /* @__PURE__ */ hr("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), hi = /* @__PURE__ */ hr("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), gi = /* @__PURE__ */ hr("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), _i = /* @__PURE__ */ hr("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), vi = /* @__PURE__ */ hr("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), yi = /* @__PURE__ */ hr("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), bi = /* @__PURE__ */ hr("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span aria-hidden=\"true\"></span></button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <form method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary> <dl><dt>Source</dt><dd><!></dd><dt>Tree</dt><dd> </dd><dt>Channel</dt><dd> </dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\" aria-label=\"Home\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-grid\"><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button></section><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p>Provider connections are not available yet. Game and media information will appear here after deliberate enrollment.</p><span class=\"quiet-label\">No provider data loaded</span></section></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function xi(e, t) {
	We(t, !1);
	let n = () => Zr(l, "$model", r), [r, i] = Qr(), a = /* @__PURE__ */ Rt(), o = /* @__PURE__ */ Rt(), s = ei(t, "binding", 8), c = fi(s()), l = c.model, u = /* @__PURE__ */ Rt("home"), d = /* @__PURE__ */ Rt(), f = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", p = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified", m = document.querySelector("meta[name=\"reborn-tree\"]")?.content ?? "unqualified", h = document.querySelector("meta[name=\"reborn-channel\"]")?.content ?? "development";
	function g(e) {
		P(u, e), Z(d)?.focus();
	}
	ti(c.start), hn(() => n(), () => {
		P(a, new TextEncoder().encode(n().draft).length);
	}), hn(() => (n(), Z(a)), () => {
		P(o, n().phase === "ready" && n().dirty && Z(a) <= 4096 && ![
			"saving",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), gn(), Ur();
	var _ = bi(), v = R($t(_), 2), y = I(v), ee = R(I(y), 4), b = I(ee);
	let te;
	var x = R(b, 2);
	let ne;
	var re = R(I(x), 2);
	let ie;
	E(x), E(ee);
	var ae = R(ee, 2), oe = I(ae), se = R(I(oe)), ce = I(se), le = L(ce, !0), ue = L(R(ce), !0);
	E(se), E(oe);
	var de = R(oe, 2), fe = R(R(I(de), 2), 2);
	Fr(fe), we(2), E(de);
	var pe = R(de, 2), me = I(pe), he = I(me, !0);
	we(), E(me);
	var ge = R(me, 2), _e = R(I(ge)), S = I(_e), ve = (e) => {
		var t = pi(), n = L(t, !0);
		yn(() => {
			Lr(t, "href", `https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${p}`), $(n, p);
		}), _r(e, t);
	}, ye = /* @__PURE__ */ ut(() => Q(() => /^[a-f0-9]{40}$/.test(p))), be = (e) => {
		var t = gr();
		yn(() => $(t, p)), _r(e, t);
	};
	Dr(S, (e) => {
		Z(ye) ? e(ve) : e(be, -1);
	}), E(_e);
	var xe = R(_e, 2), C = L(xe, !0), Se = L(R(xe, 2), !0);
	we(2), E(ge), E(pe), E(ae), E(y);
	var w = R(y, 2), T = I(w), Ce = I(T), Te = R(I(Ce)), Ee = L(Te, !0);
	Hr(Te, (e) => P(d, e), () => Z(d)), E(Ce);
	var De = R(Ce), Oe = R(I(De), 1, !0);
	E(De), E(T);
	var ke = R(T, 2), Ae = L(ke, !0), je = R(ke, 2), Me = (e) => {
		_r(e, mi());
	};
	Dr(je, (e) => {
		n(), Q(() => n().phase !== "ready") && e(Me);
	});
	var Ne = R(je, 2), Pe = I(Ne), Fe = I(Pe), Ie = R(I(Fe), 3);
	E(Fe), we(), E(Pe);
	var Le = R(Pe, 2), Re = I(Le), ze = R(I(Re), 2), Be = L(ze, !0), Ve = R(ze);
	E(Re), we(), E(Le), E(Ne);
	var He = R(Ne, 2), D = I(He), Ue = L(R(I(D)), !0);
	E(D);
	var Ke = R(D, 2), qe = (e) => {
		var t = hi(), n = R(I(t), 2), r = I(n), i = R(r);
		E(n), E(t), or("click", r, function(...e) {
			c.recover?.apply(this, e);
		}), or("click", i, () => c.resolve(!0)), _r(e, t);
	};
	Dr(Ke, (e) => {
		n(), Q(() => n().recovery) && e(qe);
	});
	var O = R(Ke, 2), Je = R(I(O), 2);
	$e(Je);
	var k = R(Je, 4), Ye = I(k);
	let Xe;
	var A = L(Ye), Ze = R(Ye), Qe = L(Ze, !0);
	E(k), E(O);
	var et = R(O, 2), tt = (e) => {
		_r(e, gi());
	};
	Dr(et, (e) => {
		n(), Q(() => n().storageLimited) && e(tt);
	});
	var nt = R(et, 2), rt = (e) => {
		_r(e, _i());
	};
	Dr(nt, (e) => {
		Z(a) > 4096 && e(rt);
	});
	var it = R(nt, 2), at = (e) => {
		var t = vi(), r = R(I(t), 2), i = L(r, !0), a = R(r), o = I(a), s = R(o);
		E(a), E(t), yn(() => $(i, (n(), Q(() => n().snapshot?.note.body)))), or("click", o, () => c.resolve(!1)), or("click", s, () => c.resolve(!0)), _r(e, t);
	};
	Dr(it, (e) => {
		n(), Q(() => n().save === "conflict") && e(at);
	});
	var ot = R(it, 2), st = (e) => {
		var t = yi(), n = R(I(t), 2);
		E(t), or("click", n, () => c.check()), _r(e, t);
	};
	Dr(ot, (e) => {
		n(), Q(() => n().save === "uncertain") && e(st);
	}), E(He), we(2), E(w), E(v), yn(() => {
		Lr(b, "aria-current", Z(u) === "home" ? "page" : void 0), te = Ar(b, 1, "", null, te, { active: Z(u) === "home" }), Lr(x, "aria-current", Z(u) === "note" ? "page" : void 0), ne = Ar(x, 1, "", null, ne, { active: Z(u) === "note" }), ie = Ar(re, 1, "draft-dot", null, ie, { visible: n().dirty }), $(le, (n(), Q(() => n().snapshot?.account.username ?? "Your account"))), $(ue, (n(), Q(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), Ir(fe, s()), $(he, f), $(C, m), $(Se, h), $(Ee, Z(u) === "home" ? "Welcome home." : "A little space to think."), $(Oe, (n(), Q(() => n().phase === "ready" ? "Session checked" : n().phase === "checking" ? "Checking access" : "Access paused"))), $(Ae, (n(), Q(() => n().message))), Lr(Ne, "hidden", (Z(u), n(), Q(() => Z(u) !== "home" || n().phase !== "ready"))), $(Be, (n(), Q(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are."))), Lr(He, "hidden", (Z(u), n(), Q(() => Z(u) !== "note" || n().phase !== "ready"))), $(Ue, (n(), Q(() => n().dirty ? "Unsaved changes" : "Up to date"))), Ir(Je, (n(), Q(() => n().draft))), Je.disabled = (n(), Q(() => n().phase !== "ready")), Xe = Ar(Ye, 1, "", null, Xe, { "over-limit": Z(a) > 4096 }), $(A, `${Z(a) ?? ""} / 4096 bytes`), Ze.disabled = !Z(o), $(Qe, (n(), Q(() => n().save === "saving" ? "Saving…" : "Save note")));
	}), or("click", b, () => g("home")), or("click", x, () => g("note")), ar("submit", de, () => c.signOut()), or("click", Ie, () => g("note")), or("click", Ve, () => g("note")), ar("submit", O, (e) => {
		e.preventDefault(), c.save();
	}), or("input", Je, (e) => c.edit(e.currentTarget.value)), _r(e, _), Ge(), i();
}
sr(["click", "input"]);
// src/main.ts
var Si = document.getElementById("workspace-root"), Ci = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, wi = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
Si && Ci && /^[a-f0-9]{64}$/.test(Ci) && wi === "reborn-workspace-v1" && (Si.replaceChildren(), Sr(xi, {
	target: Si,
	props: { binding: Ci }
}));
