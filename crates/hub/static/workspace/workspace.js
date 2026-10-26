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
	return T(/* @__PURE__ */ Xt(w));
}
function E(e) {
	if (C) {
		if (/* @__PURE__ */ Xt(w) !== null) throw be(), _e;
		w = e;
	}
}
function we(e = 1) {
	if (C) {
		for (var t = e, n = w; t--;) n = /* @__PURE__ */ Xt(n);
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
		var i = /* @__PURE__ */ Xt(n);
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
		for (var r of n) ln(r);
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
var Je = [];
function Ye() {
	var e = Je;
	Je = [], p(e);
}
function O(e) {
	if (Je.length === 0 && !yt) {
		var t = Je;
		queueMicrotask(() => {
			t === Je && Ye();
		});
	}
	Je.push(e);
}
// ../node_modules/svelte/src/internal/client/reactivity/status.js
var Xe = ~(g | _ | h);
function k(e, t) {
	e.f = e.f & Xe | t;
}
function Ze(e) {
	e.f & 512 || e.deps === null ? k(e, h) : k(e, _);
}
// ../node_modules/svelte/src/internal/client/reactivity/utils.js
function Qe(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), k(e, h);
}
// ../node_modules/svelte/src/internal/client/dom/elements/misc.js
function $e(e) {
	C && /* @__PURE__ */ Yt(e) !== null && Qt(e);
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
	var e = W, t = V, n = D, r = A;
	return function(i = !0) {
		G(e), U(t), Ue(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function at(e = !0) {
	G(null), U(null), Ue(null), e && A?.deactivate();
}
function ot() {
	var e = W, t = e.b, n = A, r = !!t?.is_rendered();
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
	var i = void 0, a = Nt(S), o = !V, s = /* @__PURE__ */ new Set();
	return hn(() => {
		var t = W, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== he && n.reject(e);
			}).finally(at);
		} catch (e) {
			n.reject(e), at();
		}
		var c = A;
		if (o) {
			if (t.f & 32768) var l = ot();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(ct);
			else for (let e of s.values()) e.reject(ct);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== ct && (c.activate(), t ? (a.f |= oe, Rt(a, t)) : (a.f & 8388608 && (a.f ^= oe), Rt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), sn(() => {
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
	if (!jn && r !== null && e.v !== S && r.f & 24576) return ye(), e.v;
	G(r);
	try {
		dt(e), t = Hn(e);
	} finally {
		G(n);
	}
	return t;
}
function pt(e) {
	var t = ft(e);
	!e.equals(t) && (e.wv = zn(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), _t?.capture(e, t, !0)), e.deps === null)) ? k(e, h) : jn || (j === null ? Ze(e) : (on() || A?.is_fork) && j.set(e, t));
}
function mt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && nt(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = d), Gn(t, 0), xn(t));
}
function ht(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Kn(t);
}
// ../node_modules/svelte/src/internal/client/reactivity/batch.js
var gt = null, A = null, _t = null, j = null, vt = null, yt = !1, bt = !1, xt = null, St = null, Ct = 0, wt = 1, Tt = class e {
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
			for (var r of n.d) k(r, g), t(r);
			for (r of n.m) k(r, _), t(r);
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
		for (let e of this.#u) this.#d.delete(e), k(e, g), this.schedule(e);
		for (let e of this.#d) k(e, _), this.schedule(e);
		this.apply();
		for (var t = xt = [], n = [], r = St = []; this.#c.length > 0;) {
			Ct++ > 1e3 && (this.#S(), Et());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw At(e), this.#h() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (xt = null, St = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) kt(e, t);
			r.length > 0 && A.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), _t = this, Dt(n), Dt(t), _t = null, this.#s?.resolve();
			var o = A;
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
				a ? r.f ^= h : i & 4 ? t.push(r) : Bn(r) && (i & 16 && this.#d.add(r), Kn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), k(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), A = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) Qe(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== S && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), j?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, j = null;
	}
	flush() {
		try {
			bt = !0, A = this, this.#_();
		} finally {
			Ct = 0, vt = null, xt = null, St = null, bt = !1, A = null, j = null, N.clear();
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
		this.#m || (this.#m = !0, O(() => {
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
		if (A === null) {
			let t = A = new e();
			!bt && O(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		j = null;
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
function Et() {
	try {
		Fe();
	} catch (e) {
		R(e, vt);
	}
}
var M = null;
function Dt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Bn(r) && (M = /* @__PURE__ */ new Set(), Kn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && wn(r), M?.size > 0)) {
				N.clear();
				for (let e of M) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) M.has(n) && (M.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Kn(n);
					}
				}
				M.clear();
			}
		}
		M = null;
	}
}
function Ot(e) {
	A.schedule(e);
}
function kt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), k(e, h);
		for (var n = e.first; n !== null;) kt(n, t), n = n.next;
	}
}
function At(e) {
	k(e, h);
	for (var t = e.first; t !== null;) At(t), t = t.next;
}
// ../node_modules/svelte/src/internal/client/reactivity/sources.js
var jt = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map(), Mt = !1;
function Nt(e, t) {
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
function Pt(e, t) {
	let n = Nt(e, t);
	return Nn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ft(e, t = !1, n = !0) {
	let r = Nt(e);
	return t || (r.equals = ke), Ve && n && D !== null && D.l !== null && (D.l.s ??= []).push(r), r;
}
function P(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && qe() && V.f & 4325394 && (K === null || !K.has(e)) && ze(), Rt(e, n ? Ht(t) : t, St);
}
var It = null, Lt = 0;
function Rt(e, t, n = null) {
	if (!e.equals(t)) {
		jn ? N.set(e, t) : N.has(e) || N.set(e, e.v);
		var r = Tt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ft(t), j === null && Ze(t);
		}
		e.wv = zn(), It = null, Lt = 0, Vt(e, g, n), It = null, qe() && W !== null && W.f & 1024 && !(W.f & 96) && (Y === null ? Pn([e]) : Y.push(e)), !r.is_fork && jt.size > 0 && !Mt && zt();
	}
	return t;
}
function zt() {
	Mt = !1;
	for (let e of jt) {
		e.f & 1024 && k(e, _);
		let t;
		try {
			t = Bn(e);
		} catch {
			t = !0;
		}
		t && Kn(e);
	}
	jt.clear();
}
function Bt(e) {
	P(e, e.v + 1);
}
function Vt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = qe(), a = r.length;
		if (Lt += a, Lt > 1e5 && It === null && (It = /* @__PURE__ */ new Set()), It !== null) {
			if (It.has(e)) return;
			It.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== W) {
				var l = (c & g) === 0;
				if (l && k(s, t), c & 131072) jt.add(s);
				else if (c & 2) {
					var u = s;
					j?.delete(u), Vt(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && M !== null && M.add(d), n === null ? Ot(d) : n.push(d);
				}
			}
		}
	}
}
function Ht(t) {
	if (typeof t != "object" || !t || x in t || se in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Pt(0), u = null, d = Ln, f = (e) => {
		if (Ln === d) return e();
		var t = V, n = Ln;
		U(null), Rn(d);
		var r = e();
		return U(t), Rn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Pt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Le();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Pt(n.value, u);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Pt(S, u));
					r.set(t, e), Bt(o);
				}
			} else P(n, S), Bt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === x) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Pt(Ht(s ? e[n] : S), u)), r.set(n, o)), o !== void 0) {
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
			return (n !== void 0 || W !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Pt(i ? Ht(e[t]) : S, u)), r.set(t, n)), X(n) === S) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Pt(S, u)), r.set(d + "", p)) : P(p, S);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Pt(void 0, u)), P(c, Ht(n)), r.set(t, c));
			else {
				l = c.v !== S;
				var m = f(() => Ht(n));
				P(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && P(g, _ + 1);
				}
				Bt(o);
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
var Ut, Wt, Gt, Kt;
function qt() {
	if (Ut === void 0) {
		Ut = window, Wt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Gt = a(t, "firstChild").get, Kt = a(t, "nextSibling").get, u(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), u(n) && (n[pe] = void 0);
	}
}
function Jt(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Yt(e) {
	return Gt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Xt(e) {
	return Kt.call(e);
}
function F(e, t) {
	if (!C) return /* @__PURE__ */ Yt(e);
	var n = /* @__PURE__ */ Yt(w);
	if (n === null) n = w.appendChild(Jt());
	else if (t && n.nodeType !== 3) {
		var r = Jt();
		return n?.before(r), T(r), r;
	}
	return t && tn(n), T(n), n;
}
function Zt(e, t = !1) {
	if (!C) {
		var n = /* @__PURE__ */ Yt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Xt(n) : n;
	}
	if (t) {
		if (w?.nodeType !== 3) {
			var r = Jt();
			return w?.before(r), T(r), r;
		}
		tn(w);
	}
	return w;
}
function I(e, t = !1) {
	if (!C) return /* @__PURE__ */ Yt(e);
	var n = F(e, t);
	return E(e), n;
}
function L(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Xt(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = Jt();
			return r === null ? i?.after(a) : r.before(a), T(a), a;
		}
		tn(r);
	}
	return T(r), r;
}
function Qt(e) {
	e.textContent = "";
}
function $t() {
	return !1;
}
function en(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function tn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function nn(e) {
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
function rn(e) {
	W === null && (V === null && Pe(e), Ne()), jn && Me(e);
}
function an(e, t) {
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
	A?.register_created_effect(r);
	var i = r;
	if (e & 4) xt === null ? Tt.ensure().schedule(r) : xt.push(r);
	else if (t !== null) {
		try {
			Kn(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= te));
	}
	if (i !== null && (i.parent = n, n !== null && an(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function on() {
	return V !== null && !H;
}
function sn(e) {
	let t = z(8, null);
	return k(t, h), t.teardown = e, t;
}
function cn(e) {
	rn("$effect");
	var t = W.f;
	if (!V && t & 32 && D !== null && !D.i) {
		var n = D;
		(n.e ??= []).push(e);
	} else return ln(e);
}
function ln(e) {
	return z(4 | re, e);
}
function un(e) {
	return rn("$effect.pre"), z(8 | re, e);
}
function dn(e) {
	Tt.ensure();
	let t = z(64 | ne, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Tn(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function fn(e) {
	return z(4, e);
}
function pn(e, t) {
	var n = D, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = gn(() => {
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
function mn() {
	var e = D;
	gn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && k(n, _), Bn(n) && Kn(n), t.ran = !1;
		}
	});
}
function hn(e) {
	return z(ae | ne, e);
}
function gn(e, t = 0) {
	return z(8 | t, e);
}
function _n(e, t = [], n = [], r = []) {
	rt(r, t, n, (t) => {
		z(8, () => {
			e(...t.map(X));
		});
	});
}
function vn(e, t = 0) {
	return z(16 | t, e);
}
function yn(e) {
	return z(32 | ne, e);
}
function bn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = jn, r = V;
		Mn(!0), U(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			Mn(n), U(r);
		}
	}
}
function xn(e, t = !1) {
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
function Sn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Cn(e.nodes.start, e.nodes.end), n = !0), e.f |= b, xn(e, t && !n), Gn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	bn(e), e.f ^= b, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && wn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Cn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Xt(e);
		e.remove(), e = n;
	}
}
function wn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Tn(e, t, n = !0) {
	var r = [];
	e.f |= 256, En(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function En(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				En(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Dn(e) {
	e.f &= -257, On(e, !0);
}
function On(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (k(e, g), Tt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			On(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function kn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Xt(n);
		t.append(n), n = i;
	}
}
// ../node_modules/svelte/src/internal/client/legacy.js
var An = null, jn = !1;
function Mn(e) {
	jn = e;
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
function Nn(e) {
	V !== null && (V.f & 2097152 || V.f & 2) && (K ??= /* @__PURE__ */ new Set()).add(e);
}
var q = null, J = 0, Y = null;
function Pn(e) {
	Y = e;
}
var Fn = 1, In = 0, Ln = In;
function Rn(e) {
	Ln = e;
}
function zn() {
	return ++Fn;
}
function Bn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Bn(a) && pt(a), a.wv > e.wv) return !0;
		}
		t & 512 && j === null && k(e, h);
	}
	return !1;
}
function Vn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(K !== null && K.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Vn(a, t, !1) : t === a && (n ? k(a, g) : a.f & 1024 && k(a, _), Ot(a));
	}
}
function Hn(e) {
	var t = q, n = J, r = Y, i = V, a = K, o = D, s = H, c = Ln, l = e.f;
	q = null, J = 0, Y = null, V = l & 96 ? null : e, K = null, Ue(e.ctx), H = !1, Ln = ++In, e.ac !== null && (nt(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = Un(e);
		if (qe() && Y !== null && !H && f !== null && !(e.f & 6146)) for (var p = 0; p < Y.length; p++) Vn(Y[p], e);
		if (i !== null && i !== e) {
			if (In++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = In;
			if (t !== null) for (let e of t) e.rv = In;
			Y !== null && (r === null ? r = Y : r.push(...Y));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return Un(e), nn(t);
	} finally {
		e.f ^= ie, q = t, J = n, Y = r, V = i, K = a, Ue(o), H = s, Ln = c;
	}
}
function Un(e) {
	var t = e.deps, n = A?.is_fork;
	if (q !== null) {
		var r;
		if (n || Gn(e, J), t !== null && J > 0) for (t.length = J + q.length, r = 0; r < q.length; r++) t[J + r] = q[r];
		else e.deps = t = q;
		if (on() && e.f & 512) for (r = J; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && J < t.length && (Gn(e, J), t.length = J);
	return t;
}
function Wn(e, r) {
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
			s.ac.abort(he), s.ac = null, k(s, g);
		}), mt(s), Gn(s, 0);
	}
}
function Gn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Wn(e, n[r]);
}
function Kn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, h);
		var n = W;
		W = e;
		try {
			t & 16777232 ? Sn(e) : xn(e), bn(e);
			var r = Hn(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Fn;
		} finally {
			W = n;
		}
	}
}
function X(e) {
	var t = !!(e.f & 2);
	if (An?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (K === null || !K.has(e))) {
		var r = V.deps;
		if (V.f & 2097152) e.rv < In && (e.rv = In, q === null && r !== null && r[J] === e ? J++ : q === null ? q = [e] : q.push(e));
		else {
			V.deps ??= [], n.call(V.deps, e) || V.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [V] : n.call(i, V) || i.push(V);
		}
	}
	if (jn && N.has(e)) return N.get(e);
	if (t) {
		var a = e;
		if (jn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Jn(a)) && (o = ft(a)), N.set(a, o), o;
		}
		var s = !(a.f & 512) && !H && V !== null && !!(V.f & 512), c = (a.f & ee) === 0;
		Bn(a) && (s && (a.f |= 512), pt(a)), s && !c && (ht(a), qn(a));
	}
	if (j?.has(e)) return j.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function qn(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (ht(r), qn(r));
	}
}
function Jn(e) {
	if (e.v === S) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && Jn(t)) return !0;
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
function Yn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (x in e) Xn(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && x in n && Xn(n);
		}
	}
}
function Xn(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Xn(e[n], t);
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
var Zn = ["touchstart", "touchmove"];
function Qn(e) {
	return Zn.includes(e);
}
// ../node_modules/svelte/src/internal/client/dom/elements/events.js
var $n = Symbol("events"), er = /* @__PURE__ */ new Set(), tr = /* @__PURE__ */ new Set();
function nr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || sr.call(t, e), !e.cancelBubble) return nt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, O(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function rr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = nr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && sn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Q(e, t, n) {
	(t[$n] ??= {})[e] = n;
}
function ir(e) {
	for (var t = 0; t < e.length; t++) er.add(e[t]);
	for (var n of tr) n(e);
}
var ar = null, or = !1;
function sr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	ar = e, or || (or = !0, setTimeout(() => {
		or = !1, ar = null;
	}));
	var s = 0, c = ar === e && e[$n];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[$n] = t;
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
					var h = o[$n]?.[r];
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
			e[$n] = t, delete e.currentTarget, U(d), G(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var cr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function lr(e) {
	return cr?.createHTML(e) ?? e;
}
function ur(e) {
	var t = en("template");
	return t.innerHTML = lr(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function dr(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function fr(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (C) return dr(w, null), w;
		i === void 0 && (i = ur(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Yt(i)));
		var t = r || Wt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Yt(t), s = t.lastChild;
			dr(o, s);
		} else dr(t, t);
		return t;
	};
}
function pr(e, t) {
	if (C) {
		var n = W;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = w), Ce();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function mr(e) {
	let t = 0, n = Nt(0), r;
	return () => {
		on() && (X(n), gn(() => (t === 0 && (r = Z(() => e(() => Bt(n)))), t += 1, () => {
			O(() => {
				--t, t === 0 && (r?.(), r = void 0, Bt(n));
			});
		})));
	};
}
// ../node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var hr = te | ne;
function gr(e, t, n, r) {
	new _r(e, t, n, r);
}
var _r = class {
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
	#h = mr(() => (this.#m = Nt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = vn(() => {
			if (C) {
				let e = Ee(this.#t);
				Ce();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, hr), C && (this.#e = w);
	}
	#g() {
		try {
			this.#a = yn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		O(r), t && (this.#s = yn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? xe() : (t = !0, n && Be(), this.#s !== null && Tn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = yn(() => e(this.#e)), O(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = Jt(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return yn(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							R(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(A)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Tn(this.#o, () => {
					this.#o = null;
				}), this.#S(A));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = yn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				kn(this.#a, e);
				let t = this.#n.pending;
				this.#o = yn(() => t(this.#e));
			} else this.#S(A);
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
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Tn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, O(() => {
			this.#d = !1, this.#m && Rt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), X(this.#m);
	}
	error(e) {
		if (e === _e || !this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
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
					return yn(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return R(e, this.#i.parent), null;
				}
			}));
		};
		O(() => {
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
function vr(e, t) {
	return br(e, t);
}
var yr = /* @__PURE__ */ new Map();
function br(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	qt();
	var l = void 0, u = dn(() => {
		var s = n ?? t.appendChild(Jt());
		gr(s, { pending: () => {} }, (t) => {
			We({});
			var n = D;
			if (o && (n.c = o), a && (i.$$events = a), C && dr(t, null), l = e(t, i) || Ke(), C && (W.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw be(), _e;
			Ge();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = Qn(r);
					for (let e of [t, document]) {
						var a = yr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), yr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, sr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(er)), tr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = yr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, sr), r.delete(e), r.size === 0 && yr.delete(n)) : r.set(e, i);
			}
			tr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return xr.set(l, u), l;
}
var xr = /* @__PURE__ */ new WeakMap(), Sr = class {
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
			if (n) Dn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Dn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						kn(r, t), t.append(Jt()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Tn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = $t();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = Jt();
				i.append(a), this.#n.set(e, {
					effect: yn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, yn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else C && (this.anchor = w), this.#a(n);
	}
};
// ../node_modules/svelte/src/internal/client/dom/blocks/if.js
function Cr(e, t, n = !1) {
	var r;
	C && (r = w, Ce());
	var i = new Sr(e), a = n ? te : 0;
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
	vn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// ../node_modules/svelte/src/internal/shared/attributes.js
var wr = [..." 	\n\r\f\xA0\v﻿"];
function Tr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || wr.includes(r[o - 1])) && (s === r.length || wr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// ../node_modules/svelte/src/internal/client/dom/elements/class.js
function Er(e, t, n, r, i, a) {
	var o = e[de];
	if (C || o !== n || o === void 0) {
		var s = Tr(n, r, a);
		C && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// ../node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Dr = Symbol("is custom element"), Or = Symbol("is html"), kr = ge ? "link" : "LINK", Ar = ge ? "progress" : "PROGRESS";
function jr(e) {
	if (C) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Nr(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Nr(e, "checked", null), e.checked = r;
				}
			}
		};
		e[me] = n, O(n), tt();
	}
}
function Mr(e, t) {
	var n = Pr(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Ar) && (e.value = t ?? "");
}
function Nr(e, t, n, r) {
	var i = Pr(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === kr) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ir(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Pr(e) {
	return e[ue] ??= {
		[Dr]: e.nodeName.includes("-"),
		[Or]: e.namespaceURI === ve
	};
}
var Fr = /* @__PURE__ */ new Map();
function Ir(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Fr.get(t);
	if (n) return n;
	Fr.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Lr(e, t) {
	return e === t || e?.[x] === t;
}
function Rr(e = Ke(), t, n, r) {
	var i = D.r, a = W;
	return fn(() => {
		var o, s;
		return gn(() => {
			o = s, s = r?.() || [], Z(() => {
				Lr(n(...s), e) || (t(e, ...s), o && Lr(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Lr(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function zr(e = !1) {
	let t = D, n = t.l.u;
	if (!n) return;
	let r = () => Yn(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ st(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => X(i);
	}
	n.b.length && un(() => {
		Br(t, r), p(n.b);
	}), cn(() => {
		let e = Z(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && cn(() => {
		Br(t, r), p(n.a);
	});
}
function Br(e, t) {
	if (e.l.s) for (let t of e.l.s) X(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function Vr(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = Z(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var Hr = [];
function Ur(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Oe(e, t) && (e = t, n)) {
			let t = !Hr.length;
			for (let t of r) t[1](), Hr.push(t, e);
			if (t) {
				for (let e = 0; e < Hr.length; e += 2) Hr[e][0](Hr[e + 1]);
				Hr.length = 0;
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
function Wr(e) {
	let t;
	return Vr(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var Gr = !1, Kr = Symbol("unmounted");
function qr(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ Ft(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(Kr in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = Vr(e, (e) => {
				i ? r.source.v = e : P(r.source, e);
			}), i = !1;
		}
	}
	return e && Kr in n ? Wr(e) : X(r.source);
}
function Jr() {
	let e = {};
	function t() {
		sn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Kr, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Yr(e) {
	var t = Gr;
	try {
		return Gr = !1, [e(), Gr];
	} finally {
		Gr = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function Xr(e, t, n, r) {
	var i = !Ve || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ st(r), X(u)) : (l && (l = !1, c = s ? Z(r) : r), c);
	let f;
	if (o) {
		var p = x in e || ce in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Yr(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ie(t), f(m)));
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
			let n = t ? X(y) : i && o ? Ht(e) : e;
			return P(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return jn && v || ee.f & 16384 ? y.v : X(y);
	});
}
function Zr(e) {
	D === null && Ae("onMount"), Ve && D.l !== null ? Qr(D).m.push(e) : cn(() => {
		let t = Z(e);
		if (typeof t == "function") return t;
	});
}
function Qr(e) {
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
var $r = "keida-hub-reborn", ei = "reborn-workspace-v1", ti = 9223372036854775807n, ni = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1
}), ri = (e) => typeof e == "object" && !!e && !Array.isArray(e), ii = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= ti && (!t || e !== "0"), ai = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096;
function oi(e) {
	if (!ri(e) || e.product !== $r || e.contract !== ei || e.schema !== 1 || !ri(e.account) || !ii(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !ii(e.session_generation) || !ri(e.note) || !ai(e.note.body) || !ii(e.note.revision)) throw Error("Invalid workspace response");
	return e;
}
function si(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (ri(t) && t.schema === 1 && ai(t.body) && ii(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
function ci(e) {
	let t = Ur(ni("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l = !1, u = !1, d = () => Wr(t), f = (e) => `${$r}.workspace.v1:${e.account.id}:${e.session_generation}`;
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
		h(), u ||= n, t.set(ni(n ? "blocked" : "paused", e));
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
					"X-Reborn-Product": $r,
					"X-Reborn-Contract": ei,
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
			let a = oi(i.value);
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
					e ??= si(sessionStorage.getItem(o));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (p(), e = void 0), t.set({
					...ni("ready", "Workspace checked."),
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
			}), ai(e)) m();
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
		if (e.phase !== "ready" || !e.dirty || !ai(e.draft) || e.save === "conflict" || e.save === "uncertain" || a) return;
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
				let n = oi(e.value);
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
				ri(e.data) && e.data.kind === "auth-changed" && g("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), b(), () => {
			l = !0, h(), c?.close(), t.set(ni("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
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
var li = /* @__PURE__ */ fr("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), ui = /* @__PURE__ */ fr("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), di = /* @__PURE__ */ fr("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), fi = /* @__PURE__ */ fr("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), pi = /* @__PURE__ */ fr("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), mi = /* @__PURE__ */ fr("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), hi = /* @__PURE__ */ fr("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span></span></button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <form method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary><p> </p><p>Source build · Reborn</p></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\" aria-label=\"Home\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-grid\"><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button></section><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p>Provider connections are not available yet. Game and media information will appear here after deliberate enrollment.</p><span class=\"quiet-label\">No provider data loaded</span></section></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function gi(e, t) {
	We(t, !1);
	let n = () => qr(l, "$model", r), [r, i] = Jr(), a = /* @__PURE__ */ Ft(), o = /* @__PURE__ */ Ft(), s = Xr(t, "binding", 8), c = ci(s()), l = c.model, u = /* @__PURE__ */ Ft("home"), d = /* @__PURE__ */ Ft(), f = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", p = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified";
	function m(e) {
		P(u, e), X(d)?.focus();
	}
	Zr(c.start), pn(() => n(), () => {
		P(a, new TextEncoder().encode(n().draft).length);
	}), pn(() => (n(), X(a)), () => {
		P(o, n().phase === "ready" && n().dirty && X(a) <= 4096 && ![
			"saving",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), mn(), zr();
	var h = hi(), g = L(Zt(h), 2), _ = F(g), v = L(F(_), 4), y = F(v);
	let ee;
	var b = L(y, 2);
	let te;
	var ne = L(F(b), 2);
	let re;
	E(b), E(v);
	var ie = L(v, 2), ae = F(ie), oe = L(F(ae)), x = F(oe), se = I(x, !0), ce = I(L(x), !0);
	E(oe), E(ae);
	var le = L(ae, 2), ue = L(L(F(le), 2), 2);
	jr(ue), we(2), E(le);
	var de = L(le, 2), fe = F(de), pe = F(fe, !0);
	we(), E(fe);
	var me = I(L(fe), !0);
	we(), E(de), E(ie), E(_);
	var he = L(_, 2), ge = F(he), _e = F(ge), S = L(F(_e)), ve = I(S, !0);
	Rr(S, (e) => P(d, e), () => X(d)), E(_e);
	var ye = L(_e), be = L(F(ye), 1, !0);
	E(ye), E(ge);
	var xe = L(ge, 2), C = I(xe, !0), Se = L(xe, 2), w = (e) => {
		pr(e, li());
	};
	Cr(Se, (e) => {
		n(), Z(() => n().phase !== "ready") && e(w);
	});
	var T = L(Se, 2), Ce = F(T), Te = F(Ce), Ee = L(F(Te), 3);
	E(Te), we(), E(Ce);
	var De = L(Ce, 2), Oe = F(De), ke = L(F(Oe), 2), Ae = I(ke, !0), je = L(ke);
	E(Oe), we(), E(De), E(T);
	var Me = L(T, 2), Ne = F(Me), Pe = I(L(F(Ne)), !0);
	E(Ne);
	var Fe = L(Ne, 2), Ie = (e) => {
		var t = ui(), n = L(F(t), 2), r = F(n), i = L(r);
		E(n), E(t), Q("click", r, function(...e) {
			c.recover?.apply(this, e);
		}), Q("click", i, () => c.resolve(!0)), pr(e, t);
	};
	Cr(Fe, (e) => {
		n(), Z(() => n().recovery) && e(Ie);
	});
	var Le = L(Fe, 2), Re = L(F(Le), 2);
	$e(Re);
	var ze = L(Re, 4), Be = F(ze);
	let Ve;
	var He = I(Be), D = L(Be), Ue = I(D, !0);
	E(ze), E(Le);
	var Ke = L(Le, 2), qe = (e) => {
		pr(e, di());
	};
	Cr(Ke, (e) => {
		n(), Z(() => n().storageLimited) && e(qe);
	});
	var Je = L(Ke, 2), Ye = (e) => {
		pr(e, fi());
	};
	Cr(Je, (e) => {
		X(a) > 4096 && e(Ye);
	});
	var O = L(Je, 2), Xe = (e) => {
		var t = pi(), r = L(F(t), 2), i = I(r, !0), a = L(r), o = F(a), s = L(o);
		E(a), E(t), _n(() => $(i, (n(), Z(() => n().snapshot?.note.body)))), Q("click", o, () => c.resolve(!1)), Q("click", s, () => c.resolve(!0)), pr(e, t);
	};
	Cr(O, (e) => {
		n(), Z(() => n().save === "conflict") && e(Xe);
	});
	var k = L(O, 2), Ze = (e) => {
		var t = mi(), n = L(F(t), 2);
		E(t), Q("click", n, () => c.check()), pr(e, t);
	};
	Cr(k, (e) => {
		n(), Z(() => n().save === "uncertain") && e(Ze);
	}), E(Me), we(2), E(he), E(g), _n(() => {
		Nr(y, "aria-current", X(u) === "home" ? "page" : void 0), ee = Er(y, 1, "", null, ee, { active: X(u) === "home" }), Nr(b, "aria-current", X(u) === "note" ? "page" : void 0), te = Er(b, 1, "", null, te, { active: X(u) === "note" }), re = Er(ne, 1, "draft-dot", null, re, { visible: n().dirty }), Nr(ne, "aria-label", (n(), Z(() => n().dirty ? "Unsaved draft" : void 0))), $(se, (n(), Z(() => n().snapshot?.account.username ?? "Your account"))), $(ce, (n(), Z(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), Mr(ue, s()), $(pe, f), $(me, p), $(ve, X(u) === "home" ? "Welcome home." : "A little space to think."), $(be, (n(), Z(() => n().phase === "ready" ? "Session checked" : "Checking access"))), $(C, (n(), Z(() => n().message))), Nr(T, "hidden", (X(u), n(), Z(() => X(u) !== "home" || n().phase !== "ready"))), $(Ae, (n(), Z(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are."))), Nr(Me, "hidden", (X(u), n(), Z(() => X(u) !== "note" || n().phase !== "ready"))), $(Pe, (n(), Z(() => n().dirty ? "Unsaved changes" : "Up to date"))), Mr(Re, (n(), Z(() => n().draft))), Re.disabled = (n(), Z(() => n().phase !== "ready")), Ve = Er(Be, 1, "", null, Ve, { "over-limit": X(a) > 4096 }), $(He, `${X(a) ?? ""} / 4096 bytes`), D.disabled = !X(o), $(Ue, (n(), Z(() => n().save === "saving" ? "Saving…" : "Save note")));
	}), Q("click", y, () => m("home")), Q("click", b, () => m("note")), rr("submit", le, () => c.signOut()), Q("click", Ee, () => m("note")), Q("click", je, () => m("note")), rr("submit", Le, (e) => {
		e.preventDefault(), c.save();
	}), Q("input", Re, (e) => c.edit(e.currentTarget.value)), pr(e, h), Ge(), i();
}
ir(["click", "input"]);
// src/main.ts
var _i = document.getElementById("workspace-root"), vi = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, yi = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
_i && vi && /^[a-f0-9]{64}$/.test(vi) && yi === "reborn-workspace-v1" && (_i.replaceChildren(), vr(gi, {
	target: _i,
	props: { binding: vi }
}));
