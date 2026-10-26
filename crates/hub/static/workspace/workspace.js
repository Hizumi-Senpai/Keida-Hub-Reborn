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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, ee = 1 << 25, te = 1 << 21, ne = 1 << 22, re = 1 << 23, ie = Symbol("$state"), ae = Symbol("component"), oe = Symbol("legacy props"), se = Symbol(""), ce = Symbol("attributes"), le = Symbol("class"), ue = Symbol("style"), de = Symbol("text"), fe = Symbol("form reset"), pe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), me = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), he = {}, T = Symbol("uninitialized"), ge = "http://www.w3.org/1999/xhtml";
function _e() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function ve(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function ye() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// ../node_modules/svelte/src/internal/client/dom/hydration.js
var E = !1;
function be(e) {
	E = e;
}
var D;
function O(e) {
	if (e === null) throw ve(), he;
	return D = e;
}
function xe() {
	return O(/* @__PURE__ */ nn(D));
}
function k(e) {
	if (E) {
		if (/* @__PURE__ */ nn(D) !== null) throw ve(), he;
		D = e;
	}
}
function Se(e = 1) {
	if (E) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ nn(n);
		D = n;
	}
}
function Ce(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ nn(n);
		e && n.remove(), n = i;
	}
}
function we(e) {
	if (!e || e.nodeType !== 8) throw ve(), he;
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
var A = null;
function He(e) {
	A = e;
}
function Ue(e, t = !1, n) {
	A = {
		p: A,
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
	var t = A, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) _n(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, A = t.p, Ge(e);
}
function Ge(e = {}) {
	return i(e, ae, { value: !0 }), e;
}
function Ke() {
	return !Be || A !== null && A.l === null;
}
// ../node_modules/svelte/src/internal/client/dom/task.js
var qe = [];
function Je() {
	var e = qe;
	qe = [], p(e);
}
function Ye(e) {
	if (qe.length === 0 && !St) {
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
function j(e, t) {
	e.f = e.f & Ze | t;
}
function Qe(e) {
	e.f & 512 || e.deps === null ? j(e, h) : j(e, _);
}
// ../node_modules/svelte/src/internal/client/reactivity/utils.js
function $e(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), j(e, h);
}
// ../node_modules/svelte/src/internal/client/dom/elements/misc.js
function et(e) {
	E && /* @__PURE__ */ tn(e) !== null && an(e);
}
var tt = !1;
function nt() {
	tt || (tt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[fe]?.();
		});
	}, { capture: !0 }));
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function rt(e) {
	var t = z, n = V;
	B(null), H(null);
	try {
		return e();
	} finally {
		B(t), H(n);
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/async.js
function it(e, t, n, r) {
	let i = Ke() ? ct : ft;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = at(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				un(e, s);
			}
			ot();
		}
	}
	var d = st();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ ut(e))).then(u).catch((e) => un(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), ot());
	}) : f();
}
function at() {
	var e = V, t = z, n = A, r = M;
	return function(i = !0) {
		H(e), B(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ot(e = !0) {
	H(null), B(null), He(null), e && M?.deactivate();
}
function st() {
	var e = V, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ct(e) {
	var t = 2 | g;
	return V !== null && (V.f |= C), {
		ctx: A,
		deps: null,
		effects: null,
		equals: Te,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: T,
		wv: 0,
		parent: V,
		ac: null
	};
}
var lt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ut(e, t, n) {
	let r = V;
	r === null && ke();
	var i = void 0, a = zt(T), o = !z, s = /* @__PURE__ */ new Set();
	return Cn(() => {
		var t = V, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== pe && n.reject(e);
			}).finally(ot);
		} catch (e) {
			n.reject(e), ot();
		}
		var c = M;
		if (o) {
			if (t.f & 32768) var l = st();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(lt);
			else for (let e of s.values()) e.reject(lt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== lt && (c.activate(), t ? (a.f |= re, Wt(a, t)) : (a.f & 8388608 && (a.f ^= re), Wt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), hn(() => {
		for (let e of s) e.reject(lt);
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
function dt(e) {
	let t = /* @__PURE__ */ ct(e);
	return Un(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function ft(e) {
	let t = /* @__PURE__ */ ct(e);
	return t.equals = De, t;
}
function pt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) R(t[n]);
	}
}
function mt(e) {
	var t, n = V, r = e.parent;
	if (!zn && r !== null && e.v !== T && r.f & 24576) return _e(), e.v;
	H(r);
	try {
		pt(e), t = Qn(e);
	} finally {
		H(n);
	}
	return t;
}
function ht(e) {
	var t = mt(e);
	!e.equals(t) && (e.wv = Yn(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), yt?.capture(e, t, !0)), e.deps === null)) ? j(e, h) : zn || (bt === null ? Qe(e) : (mn() || M?.is_fork) && bt.set(e, t));
}
function gt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && rt(() => {
		t.ac.abort(pe), t.ac = null;
	}), t.fn !== null && (t.teardown = d), tr(t, 0), kn(t));
}
function _t(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && nr(t);
}
// ../node_modules/svelte/src/internal/client/reactivity/batch.js
var vt = null, M = null, yt = null, bt = null, xt = null, St = !1, Ct = !1, wt = null, Tt = null, Et = 0, Dt = 1, Ot = class e {
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
			for (var r of n.d) j(r, g), t(r);
			for (r of n.m) j(r, _), t(r);
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
		for (let e of this.#u) this.#d.delete(e), j(e, g), this.schedule(e);
		for (let e of this.#d) j(e, _), this.schedule(e);
		this.apply();
		for (var t = wt = [], n = [], r = Tt = []; this.#c.length > 0;) {
			Et++ > 1e3 && (this.#S(), At());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Ft(e), this.#h() || this.discard(), t;
			}
		}
		if (M = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (wt = null, Tt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Pt(e, t);
			r.length > 0 && M.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), yt = this, Mt(n), Mt(t), yt = null, this.#s?.resolve();
			var o = M;
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
				a ? r.f ^= h : i & 4 ? t.push(r) : Xn(r) && (i & 16 && this.#d.add(r), nr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), j(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), M = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) $e(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== T && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), bt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, bt = null;
	}
	flush() {
		try {
			Ct = !0, M = this, this.#_();
		} finally {
			Et = 0, xt = null, wt = null, Tt = null, Ct = !1, M = null, bt = null, Lt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(lt);
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
		if (M === null) {
			let t = M = new e();
			!Ct && !St && Ye(() => {
				t.#e || t.flush();
			});
		}
		return M;
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
			if (Xe(), M === null) return r;
			M.flush();
		}
	} finally {
		St = t, yt = n;
	}
}
function At() {
	try {
		Pe();
	} catch (e) {
		un(e, xt);
	}
}
var jt = null;
function Mt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Xn(r) && (jt = /* @__PURE__ */ new Set(), nr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Mn(r), jt?.size > 0)) {
				Lt.clear();
				for (let e of jt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) jt.has(n) && (jt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || nr(n);
					}
				}
				jt.clear();
			}
		}
		jt = null;
	}
}
function Nt(e) {
	M.schedule(e);
}
function Pt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), j(e, h);
		for (var n = e.first; n !== null;) Pt(n, t), n = n.next;
	}
}
function Ft(e) {
	j(e, h);
	for (var t = e.first; t !== null;) Ft(t), t = t.next;
}
// ../node_modules/svelte/src/internal/client/reactivity/sources.js
var It = /* @__PURE__ */ new Set(), Lt = /* @__PURE__ */ new Map(), Rt = !1;
function zt(e, t) {
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
function Bt(e, t) {
	let n = zt(e, t);
	return Un(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Vt(e, t = !1, n = !0) {
	let r = zt(e);
	return t || (r.equals = De), Be && n && A !== null && A.l !== null && (A.l.s ??= []).push(r), r;
}
function N(e, t, n = !1) {
	return z !== null && (!Vn || z.f & 131072) && Ke() && z.f & 4325394 && (Hn === null || !Hn.has(e)) && Re(), Wt(e, n ? Yt(t) : t, Tt);
}
var Ht = null, Ut = 0;
function Wt(e, t, n = null) {
	if (!e.equals(t)) {
		zn ? Lt.set(e, t) : Lt.has(e) || Lt.set(e, e.v);
		var r = Ot.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && mt(t), bt === null && Qe(t);
		}
		e.wv = Yn(), Ht = null, Ut = 0, Jt(e, g, n), Ht = null, Ke() && V !== null && V.f & 1024 && !(V.f & 96) && (G === null ? Wn([e]) : G.push(e)), !r.is_fork && It.size > 0 && !Rt && Gt();
	}
	return t;
}
function Gt() {
	Rt = !1;
	for (let e of It) {
		e.f & 1024 && j(e, _);
		let t;
		try {
			t = Xn(e);
		} catch {
			t = !0;
		}
		t && nr(e);
	}
	It.clear();
}
function Kt(e, t = 1) {
	var n = K(e);
	return N(e, t === 1 ? ++n : --n);
}
function qt(e) {
	N(e, e.v + 1);
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
				if (l && j(s, t), c & 131072) It.add(s);
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
	if (typeof t != "object" || !t || ie in t || ae in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Bt(0), u = null, d = qn, f = (e) => {
		if (qn === d) return e();
		var t = z, n = qn;
		B(null), Jn(d);
		var r = e();
		return B(t), Jn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Bt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Ie();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Bt(n.value, u);
				return r.set(t, e), e;
			}) : N(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Bt(T, u));
					r.set(t, e), qt(o);
				}
			} else N(n, T), qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === ie) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Bt(Yt(s ? e[n] : T), u)), r.set(n, o)), o !== void 0) {
				var c = K(o);
				return c === T ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = K(i);
				if (a === T) return;
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
			if (t === ie) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== T || Reflect.has(e, t);
			return (n !== void 0 || V !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Bt(i ? Yt(e[t]) : T, u)), r.set(t, n)), K(n) === T) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Bt(T, u)), r.set(d + "", p)) : N(p, T);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Bt(void 0, u)), N(c, Yt(n)), r.set(t, c));
			else {
				l = c.v !== T;
				var m = f(() => Yt(n));
				N(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && N(g, _ + 1);
				}
				qt(o);
			}
			return !0;
		},
		ownKeys(e) {
			K(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== T;
			});
			for (var [n, i] of r) i.v !== T && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Le();
		}
	});
}
var Xt, Zt, Qt, $t;
function en() {
	if (Xt === void 0) {
		Xt = window, Zt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Qt = a(t, "firstChild").get, $t = a(t, "nextSibling").get, u(e) && (e[le] = void 0, e[ce] = null, e[ue] = void 0, e.__e = void 0), u(n) && (n[de] = void 0);
	}
}
function P(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function tn(e) {
	return Qt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function nn(e) {
	return $t.call(e);
}
function F(e, t) {
	if (!E) return /* @__PURE__ */ tn(e);
	var n = /* @__PURE__ */ tn(D);
	if (n === null) n = D.appendChild(P());
	else if (t && n.nodeType !== 3) {
		var r = P();
		return n?.before(r), O(r), r;
	}
	return t && cn(n), O(n), n;
}
function rn(e, t = !1) {
	if (!E) {
		var n = /* @__PURE__ */ tn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ nn(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = P();
			return D?.before(r), O(r), r;
		}
		cn(D);
	}
	return D;
}
function I(e, t = !1) {
	if (!E) return /* @__PURE__ */ tn(e);
	var n = F(e, t);
	return k(e), n;
}
function L(e, t = 1, n = !1) {
	let r = E ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ nn(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = P();
			return r === null ? i?.after(a) : r.before(a), O(a), a;
		}
		cn(r);
	}
	return O(r), r;
}
function an(e) {
	e.textContent = "";
}
function on() {
	return !1;
}
function sn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function cn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function ln(e) {
	var t = V;
	if (t === null) return z.f |= re, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	un(e, t);
}
function un(e, t) {
	if (e === he) throw e;
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
function dn(e) {
	V === null && (z === null && Ne(e), Me()), zn && je(e);
}
function fn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function pn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: A,
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
	M?.register_created_effect(r);
	var i = r;
	if (e & 4) wt === null ? Ot.ensure().schedule(r) : wt.push(r);
	else if (t !== null) {
		try {
			nr(r);
		} catch (e) {
			throw R(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && fn(i, n), z !== null && z.f & 2 && !(e & 64))) {
		var a = z;
		(a.effects ??= []).push(i);
	}
	return r;
}
function mn() {
	return z !== null && !Vn;
}
function hn(e) {
	let t = pn(8, null);
	return j(t, h), t.teardown = e, t;
}
function gn(e) {
	dn("$effect");
	var t = V.f;
	if (!z && t & 32 && A !== null && !A.i) {
		var n = A;
		(n.e ??= []).push(e);
	} else return _n(e);
}
function _n(e) {
	return pn(4 | w, e);
}
function vn(e) {
	return dn("$effect.pre"), pn(8 | w, e);
}
function yn(e) {
	Ot.ensure();
	let t = pn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Nn(t, () => {
			R(t), n(void 0);
		}) : (R(t), n(void 0));
	});
}
function bn(e) {
	return pn(4, e);
}
function xn(e, t) {
	var n = A, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = wn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				H(n.parent), q(t);
			} finally {
				H(n);
			}
		}
	});
}
function Sn() {
	var e = A;
	wn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && j(n, _), Xn(n) && nr(n), t.ran = !1;
		}
	});
}
function Cn(e) {
	return pn(ne | C, e);
}
function wn(e, t = 0) {
	return pn(8 | t, e);
}
function Tn(e, t = [], n = [], r = []) {
	it(r, t, n, (t) => {
		pn(8, () => {
			e(...t.map(K));
		});
	});
}
function En(e, t = 0) {
	return pn(16 | t, e);
}
function Dn(e) {
	return pn(32 | C, e);
}
function On(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = zn, r = z;
		Bn(!0), B(null);
		try {
			t.call(null);
		} catch (t) {
			un(t, e.parent);
		} finally {
			Bn(n), B(r);
		}
	}
}
function kn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && rt(() => {
			e.abort(pe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : R(n, t), n = r;
	}
}
function An(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || R(t), t = n;
	}
}
function R(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (jn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, kn(e, t && !n), tr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	On(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Mn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function jn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ nn(e);
		e.remove(), e = n;
	}
}
function Mn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Nn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Pn(e, r, !0);
	var i = () => {
		n && R(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Pn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Pn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Fn(e) {
	e.f &= -257, In(e, !0);
}
function In(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (j(e, g), Ot.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			In(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Ln(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ nn(n);
		t.append(n), n = i;
	}
}
// ../node_modules/svelte/src/internal/client/legacy.js
var Rn = null, zn = !1;
function Bn(e) {
	zn = e;
}
var z = null, Vn = !1;
function B(e) {
	z = e;
}
var V = null;
function H(e) {
	V = e;
}
var Hn = null;
function Un(e) {
	z !== null && (z.f & 2097152 || z.f & 2) && (Hn ??= /* @__PURE__ */ new Set()).add(e);
}
var U = null, W = 0, G = null;
function Wn(e) {
	G = e;
}
var Gn = 1, Kn = 0, qn = Kn;
function Jn(e) {
	qn = e;
}
function Yn() {
	return ++Gn;
}
function Xn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Xn(a) && ht(a), a.wv > e.wv) return !0;
		}
		t & 512 && bt === null && j(e, h);
	}
	return !1;
}
function Zn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Hn !== null && Hn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Zn(a, t, !1) : t === a && (n ? j(a, g) : a.f & 1024 && j(a, _), Nt(a));
	}
}
function Qn(e) {
	var t = U, n = W, r = G, i = z, a = Hn, o = A, s = Vn, c = qn, l = e.f;
	U = null, W = 0, G = null, z = l & 96 ? null : e, Hn = null, He(e.ctx), Vn = !1, qn = ++Kn, e.ac !== null && (rt(() => {
		e.ac.abort(pe);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= b;
		var f = $n(e);
		if (Ke() && G !== null && !Vn && f !== null && !(e.f & 6146)) for (var p = 0; p < G.length; p++) Zn(G[p], e);
		if (i !== null && i !== e) {
			if (Kn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Kn;
			if (t !== null) for (let e of t) e.rv = Kn;
			G !== null && (r === null ? r = G : r.push(...G));
		}
		return e.f & 8388608 && (e.f ^= re), d;
	} catch (t) {
		return $n(e), ln(t);
	} finally {
		e.f ^= te, U = t, W = n, G = r, z = i, Hn = a, He(o), Vn = s, qn = c;
	}
}
function $n(e) {
	var t = e.deps, n = M?.is_fork;
	if (U !== null) {
		var r;
		if (n || tr(e, W), t !== null && W > 0) for (t.length = W + U.length, r = 0; r < U.length; r++) t[W + r] = U[r];
		else e.deps = t = U;
		if (mn() && e.f & 512) for (r = W; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && W < t.length && (tr(e, W), t.length = W);
	return t;
}
function er(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (U === null || !n.call(U, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== T && Qe(s), s.ac !== null && rt(() => {
			s.ac.abort(pe), s.ac = null, j(s, g);
		}), gt(s), tr(s, 0);
	}
}
function tr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) er(e, n[r]);
}
function nr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		j(e, h);
		var n = V;
		V = e;
		try {
			t & 16777232 ? An(e) : kn(e), On(e);
			var r = Qn(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Gn;
		} finally {
			V = n;
		}
	}
}
function K(e) {
	var t = !!(e.f & 2);
	if (Rn?.add(e), z !== null && !Vn && !(V !== null && V.f & 16384) && (Hn === null || !Hn.has(e))) {
		var r = z.deps;
		if (z.f & 2097152) e.rv < Kn && (e.rv = Kn, U === null && r !== null && r[W] === e ? W++ : U === null ? U = [e] : U.push(e));
		else {
			z.deps ??= [], n.call(z.deps, e) || z.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [z] : n.call(i, z) || i.push(z);
		}
	}
	if (zn && Lt.has(e)) return Lt.get(e);
	if (t) {
		var a = e;
		if (zn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || ir(a)) && (o = mt(a)), Lt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Vn && z !== null && !!(z.f & 512), c = (a.f & b) === 0;
		Xn(a) && (s && (a.f |= 512), ht(a)), s && !c && (_t(a), rr(a));
	}
	if (bt?.has(e)) return bt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function rr(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (_t(r), rr(r));
	}
}
function ir(e) {
	if (e.v === T) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Lt.has(t) || t.f & 2 && ir(t)) return !0;
	return !1;
}
function q(e) {
	var t = Vn;
	try {
		return Vn = !0, e();
	} finally {
		Vn = t;
	}
}
function ar(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ie in e) or(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ie in n && or(n);
		}
	}
}
function or(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			or(e[n], t);
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
var sr = ["touchstart", "touchmove"];
function cr(e) {
	return sr.includes(e);
}
// ../node_modules/svelte/src/internal/client/dom/elements/events.js
var lr = Symbol("events"), ur = /* @__PURE__ */ new Set(), dr = /* @__PURE__ */ new Set();
function fr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || _r.call(t, e), !e.cancelBubble) return rt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Ye(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function pr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = fr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && hn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function J(e, t, n) {
	(t[lr] ??= {})[e] = n;
}
function mr(e) {
	for (var t = 0; t < e.length; t++) ur.add(e[t]);
	for (var n of dr) n(e);
}
var hr = null, gr = !1;
function _r(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	hr = e, gr || (gr = !0, setTimeout(() => {
		gr = !1, hr = null;
	}));
	var s = 0, c = hr === e && e[lr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[lr] = t;
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
		var d = z, f = V;
		B(null), H(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[lr]?.[r];
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
			e[lr] = t, delete e.currentTarget, B(d), H(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var vr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function yr(e) {
	return vr?.createHTML(e) ?? e;
}
function br(e) {
	var t = sn("template");
	return t.innerHTML = yr(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function xr(e, t) {
	var n = V;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Y(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (E) return xr(D, null), D;
		i === void 0 && (i = br(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ tn(i)));
		var t = r || Zt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ tn(t), s = t.lastChild;
			xr(o, s);
		} else xr(t, t);
		return t;
	};
}
function Sr(e = "") {
	if (!E) {
		var t = P(e + "");
		return xr(t, t), t;
	}
	var n = D;
	return n.nodeType === 3 ? cn(n) : (n.before(n = P()), O(n)), xr(n, n), n;
}
function X(e, t) {
	if (E) {
		var n = V;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = D), xe();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function Cr(e) {
	let t = 0, n = zt(0), r;
	return () => {
		mn() && (K(n), wn(() => (t === 0 && (r = q(() => e(() => qt(n)))), t += 1, () => {
			Ye(() => {
				--t, t === 0 && (r?.(), r = void 0, qt(n));
			});
		})));
	};
}
// ../node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var wr = S | C;
function Tr(e, t, n, r) {
	new Er(e, t, n, r);
}
var Er = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = E ? D : null;
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
	#h = Cr(() => (this.#m = zt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = En(() => {
			if (E) {
				let e = we(this.#t);
				xe();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, wr), E && (this.#e = D);
	}
	#g() {
		try {
			this.#a = Dn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ye(r), t && (this.#s = Dn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? ye() : (t = !0, n && ze(), this.#s !== null && Nn(this.#s, () => {
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
					un(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (y | x)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Dn(() => e(this.#e)), Ye(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = P(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return Dn(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							un(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(M)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Nn(this.#o, () => {
					this.#o = null;
				}), this.#S(M));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Dn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Ln(this.#a, e);
				let t = this.#n.pending;
				this.#o = Dn(() => t(this.#e));
			} else this.#S(M);
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
		var t = V, n = z, r = A;
		H(this.#i), B(this.#i), He(this.#i.ctx);
		try {
			return Ot.ensure(), e();
		} finally {
			H(t), B(n), He(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Nn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ye(() => {
			this.#d = !1, this.#m && Wt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), K(this.#m);
	}
	error(e) {
		if (e === he || !this.#n.onerror && !this.#n.failed) throw e;
		M?.is_fork ? (this.#a && M.skip_effect(this.#a), this.#o && M.skip_effect(this.#o), this.#s && M.skip_effect(this.#s), M.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (R(this.#a), null), this.#o &&= (R(this.#o), null), this.#s &&= (R(this.#s), null), E && (O(this.#t), Se(), O(Ce()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return Dn(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return un(e, this.#i.parent), null;
				}
			}));
		};
		Ye(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					un(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => un(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function Z(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[de] ??= e.nodeValue) && (e[de] = n, e.nodeValue = `${n}`);
}
function Dr(e, t) {
	return kr(e, t);
}
var Or = /* @__PURE__ */ new Map();
function kr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	en();
	var l = void 0, u = yn(() => {
		var s = n ?? t.appendChild(P());
		Tr(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = A;
			if (o && (n.c = o), a && (i.$$events = a), E && xr(t, null), l = e(t, i) || Ge(), E && (V.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw ve(), he;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = cr(r);
					for (let e of [t, document]) {
						var a = Or.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Or.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, _r, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(ur)), dr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Or.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, _r), r.delete(e), r.size === 0 && Or.delete(n)) : r.set(e, i);
			}
			dr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Ar.set(l, u), l;
}
var Ar = /* @__PURE__ */ new WeakMap(), jr = class {
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
			if (n) Fn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Fn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (R(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Ln(r, t), t.append(P()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else R(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Nn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (R(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = M, r = on();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = P();
				i.append(a), this.#n.set(e, {
					effect: Dn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Dn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else E && (this.anchor = D), this.#a(n);
	}
};
// ../node_modules/svelte/src/internal/client/dom/blocks/if.js
function Q(e, t, n = !1) {
	var r;
	E && (r = D, xe());
	var i = new jr(e), a = n ? S : 0;
	function o(e, t) {
		if (E) {
			var n = we(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ce();
				O(a), i.anchor = a, be(!1), i.ensure(e, t), be(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	En(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// ../node_modules/svelte/src/internal/client/dom/blocks/each.js
function Mr(e, t) {
	return t;
}
function Nr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Nn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Pr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			an(d), d.append(u), e.items.clear();
		}
		Pr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Pr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ee, Ln(a, document.createDocumentFragment())) : R(t[i], n);
	}
}
var Fr;
function Ir(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = E ? O(/* @__PURE__ */ tn(u)) : u.appendChild(P());
	}
	E && xe();
	var d = null, f = /* @__PURE__ */ ft(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = K(f);
			_.fallback = d, Rr(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= ee, Br(d, null, c)) : Fn(d) : Nn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: En(() => {
			var e = K(f), t = e.length;
			let r = !1;
			E && we(c) === "[!" != (t === 0) && (c = Ce(), O(c), be(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = M, v = on(), y = 0; y < t; y += 1) {
				E && D.nodeType === 8 && D.data === "]" && (c = D, r = !0, be(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && Wt(S.v, b), S.i && Wt(S.i, y), v && _.unskip_effect(S.e)) : (S = zr(l, m ? c : Fr ??= P(), b, x, y, o, n, i), m || (S.e.f |= ee), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = Dn(() => s(c)) : (d = Dn(() => s(Fr ??= P())), d.f |= ee)), t > u.size && Ae("", "", ""), E && t > 0 && O(Ce()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && be(!0), K(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, E && (c = D);
}
function Lr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Rr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Lr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Fn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ee, _ === l) Br(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Vr(e, d, _), Vr(e, _, y), Br(_, y, n), d = _, p = [], m = [], l = Lr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Br(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Vr(e, S.prev, C.next), Vr(e, d, S), Vr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Br(_, l, n), Vr(e, _.prev, _.next), Vr(e, _, d === null ? e.effect.first : d.next), Vr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Lr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Lr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Pr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Lr(l.next);
		var te = w.length;
		if (te > 0) {
			var ne = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) w[v].nodes?.a?.fix();
			}
			Nr(e, w, ne);
		}
	}
	o && Ye(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function zr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? zt(n) : /* @__PURE__ */ Vt(n, !1, !1) : null, l = o & 2 ? zt(i) : null;
	return {
		v: c,
		i: l,
		e: Dn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Br(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ nn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Vr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// ../node_modules/svelte/src/internal/shared/attributes.js
var Hr = [..." 	\n\r\f\xA0\v﻿"];
function Ur(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Hr.includes(r[o - 1])) && (s === r.length || Hr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// ../node_modules/svelte/src/internal/client/dom/elements/class.js
function Wr(e, t, n, r, i, a) {
	var o = e[le];
	if (E || o !== n || o === void 0) {
		var s = Ur(n, r, a);
		E && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[le] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// ../node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Gr = Symbol("is custom element"), Kr = Symbol("is html"), qr = me ? "link" : "LINK", Jr = me ? "progress" : "PROGRESS";
function Yr(e) {
	if (E) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					$(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					$(e, "checked", null), e.checked = r;
				}
			}
		};
		e[fe] = n, Ye(n), nt();
	}
}
function Xr(e, t) {
	var n = Zr(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Jr) && (e.value = t ?? "");
}
function $(e, t, n, r) {
	var i = Zr(e);
	E && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === qr) || i[t] !== (i[t] = n) && (t === "loading" && (e[se] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && $r(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Zr(e) {
	return e[ce] ??= {
		[Gr]: e.nodeName.includes("-"),
		[Kr]: e.namespaceURI === ge
	};
}
var Qr = /* @__PURE__ */ new Map();
function $r(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Qr.get(t);
	if (n) return n;
	Qr.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ei(e, t) {
	return e === t || e?.[ie] === t;
}
function ti(e = Ge(), t, n, r) {
	var i = A.r, a = V;
	return bn(() => {
		var o, s;
		return wn(() => {
			o = s, s = r?.() || [], q(() => {
				ei(n(...s), e) || (t(e, ...s), o && ei(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ei(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function ni(e = !1) {
	let t = A, n = t.l.u;
	if (!n) return;
	let r = () => ar(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ ct(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => K(i);
	}
	n.b.length && vn(() => {
		ri(t, r), p(n.b);
	}), gn(() => {
		let e = q(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && gn(() => {
		ri(t, r), p(n.a);
	});
}
function ri(e, t) {
	if (e.l.s) for (let t of e.l.s) K(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function ii(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = q(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var ai = [];
function oi(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ee(e, t) && (e = t, n)) {
			let t = !ai.length;
			for (let t of r) t[1](), ai.push(t, e);
			if (t) {
				for (let e = 0; e < ai.length; e += 2) ai[e][0](ai[e + 1]);
				ai.length = 0;
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
function si(e) {
	let t;
	return ii(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var ci = !1, li = Symbol("unmounted");
function ui(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ Vt(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(li in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = ii(e, (e) => {
				i ? r.source.v = e : N(r.source, e);
			}), i = !1;
		}
	}
	return e && li in n ? si(e) : K(r.source);
}
function di() {
	let e = {};
	function t() {
		hn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, li, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function fi(e) {
	var t = ci;
	try {
		return ci = !1, [e(), ci];
	} finally {
		ci = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function pi(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ ct(r), K(u)) : (l && (l = !1, c = s ? q(r) : r), c);
	let f;
	if (o) {
		var p = ie in e || oe in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = fi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Fe(t), f(m)));
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
	var v = !1, y = (n & 1 ? ct : ft)(() => (v = !1, g()));
	o && K(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? K(y) : i && o ? Yt(e) : e;
			return N(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return zn && v || b.f & 16384 ? y.v : K(y);
	});
}
function mi(e) {
	A === null && Oe("onMount"), Be && A.l !== null ? gi(A).m.push(e) : gn(() => {
		let t = q(e);
		if (typeof t == "function") return t;
	});
}
function hi(e) {
	A === null && Oe("onDestroy"), mi(() => () => q(e));
}
function gi(e) {
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
var _i = "keida-hub-reborn", vi = "reborn-workspace-v1", yi = 9223372036854775807n, bi = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1
}), xi = (e) => typeof e == "object" && !!e && !Array.isArray(e), Si = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= yi && (!t || e !== "0"), Ci = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096;
function wi(e) {
	if (!xi(e) || e.product !== _i || e.contract !== vi || e.schema !== 1 || !xi(e.account) || !Si(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !Si(e.session_generation) || !xi(e.note) || !Ci(e.note.body) || !Si(e.note.revision)) throw Error("Invalid workspace response");
	if (e.crafty != null) {
		let t = e.crafty, n = (e) => e === null || typeof e == "number" && Number.isSafeInteger(e) && e >= 0, r = (e) => e === null || typeof e == "string" && /^[a-z_]{1,40}$/.test(e);
		if (!xi(t) || !Si(t.revision) || typeof t.configured != "boolean" || !n(t.checked_at) || !r(t.error) || !Array.isArray(t.servers) || t.servers.length > 8 || t.servers.some((e) => !xi(e) || typeof e.name != "string" || e.name.length > 80 || typeof e.join != "string" || e.join.length > 253 || ![
			"running",
			"stopped",
			"unknown"
		].includes(String(e.state)) || ![
			"fresh",
			"stale",
			"unknown"
		].includes(String(e.freshness)) || !n(e.players) || !n(e.capacity) || !n(e.collected_at) || !n(e.provider_at) || !r(e.error))) throw Error("Invalid connection response");
	}
	return e;
}
function Ti(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (xi(t) && t.schema === 1 && Ci(t.body) && Si(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
function Ei(e) {
	let t = oi(bi("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l = !1, u = !1, d = () => si(t), f = (e) => `${_i}.workspace.v1:${e.account.id}:${e.session_generation}`;
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
		h(), u ||= n, kt(() => t.set(bi(n ? "blocked" : "paused", e)));
	}
	function _() {
		r && clearTimeout(r), !l && !u && d().phase === "ready" && document.visibilityState === "visible" && (r = setTimeout(() => {
			r = void 0, x();
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
					"X-Reborn-Product": _i,
					"X-Reborn-Contract": vi,
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
	function b(e) {
		let t = d().snapshot;
		return !t || e.account.id === t.account.id && e.session_generation === t.session_generation && e.account.role === t.account.role;
	}
	async function x() {
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
			let a = wi(i.value);
			if (!b(a)) {
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
					e ??= Ti(sessionStorage.getItem(o));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (p(), e = void 0), t.set({
					...bi("ready", "Workspace checked."),
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
	function S(e) {
		let n = d();
		if (n.phase === "ready" && n.snapshot) {
			if (t.set({
				...n,
				draft: e,
				dirty: e !== n.snapshot.note.body,
				save: n.save === "saved" ? "idle" : n.save
			}), Ci(e)) m();
			else if (s = void 0, o) try {
				sessionStorage.removeItem(o);
			} catch {}
		}
	}
	function C() {
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
	function w(e) {
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
	async function ee() {
		let e = d();
		if (e.phase !== "ready" || !e.dirty || !Ci(e.draft) || e.save === "conflict" || e.save === "uncertain" || a) return;
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
				let n = wi(e.value);
				if (!b(n) || n.note.body !== c.body || BigInt(n.note.revision) !== BigInt(c.base) + 1n) throw Error("Unqualified save result");
				t.update((e) => ({
					...e,
					snapshot: {
						...n,
						crafty: n.crafty ?? e.snapshot?.crafty
					},
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
			a === o && (a = void 0), s === n && !l && (d().save === "conflict" ? await x() : _());
		}
	}
	function te() {
		p(), g("Signing out…", !0);
		try {
			c?.postMessage({ kind: "auth-changed" });
		} catch {}
	}
	function ne() {
		let e = () => g("Workspace hidden. Checking access on return."), n = () => {
			x();
		}, r = () => {
			document.visibilityState === "visible" ? n() : e();
		};
		try {
			c = new BroadcastChannel("keida-hub-reborn.account.v1"), c.onmessage = (e) => {
				xi(e.data) && e.data.kind === "auth-changed" && g("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), x(), () => {
			l = !0, h(), c?.close(), t.set(bi("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
		};
	}
	return {
		model: t,
		start: ne,
		edit: S,
		recover: C,
		resolve: w,
		save: ee,
		signOut: te,
		check: x
	};
}
// src/Connections.svelte
var Di = /* @__PURE__ */ Y("<section class=\"card small-card\"><h2>No Crafty connection enrolled</h2><p>An owner can add dedicated access and choose which servers to show.</p></section>"), Oi = /* @__PURE__ */ Y("<p class=\"notice\" role=\"status\"> </p>"), ki = /* @__PURE__ */ Y("<p class=\"field-help\">This server could not be fully observed.</p>"), Ai = /* @__PURE__ */ Y("<article class=\"card small-card server-card\"><h2> </h2> <p><strong> </strong> <span class=\"field-help\">Provider-reported process state</span></p> <dl><dt>Players</dt><dd> </dd> <dt>Freshness</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd> <dt>Join address</dt><dd> </dd></dl> <!></article>"), ji = /* @__PURE__ */ Y("<!> <div class=\"server-grid\"></div> <p class=\"field-help\">A running process does not establish game readiness. Join addresses are owner-reviewed; outside-network joining is accepted separately.</p>", 1), Mi = /* @__PURE__ */ Y("<button class=\"button secondary\">Check connection state</button>"), Ni = /* @__PURE__ */ Y("<button class=\"text-button\" type=\"button\">Remove server</button>"), Pi = /* @__PURE__ */ Y("<fieldset><legend> </legend> <label>Crafty server UUID</label><input name=\"server-id\" required=\"\" maxlength=\"36\"/> <label>Display name</label><input name=\"server-name\" required=\"\" maxlength=\"80\"/> <label>Reviewed public join address, optional</label><input name=\"server-join\" maxlength=\"253\" placeholder=\"play.example:25565\"/> <!></fieldset>"), Fi = /* @__PURE__ */ Y("<button class=\"text-button\" type=\"button\">Remove connection</button>"), Ii = /* @__PURE__ */ Y("<section class=\"card connection-setup\" aria-label=\"Dedicated Crafty enrollment\"><h2>Dedicated Crafty access</h2> <p>Create access specifically for Reborn, limited to viewing the selected servers. Credentials are encrypted on the server and are not shown again.</p> <p class=\"workspace-status\" role=\"status\"> </p> <!> <form autocomplete=\"off\"><label for=\"crafty-endpoint\">Crafty HTTPS address</label><input id=\"crafty-endpoint\" name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\" placeholder=\"https://crafty.example/\"/> <label for=\"crafty-token\">Dedicated API token</label><input id=\"crafty-token\" name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label for=\"crafty-timezone\">Crafty’s configured time zone</label><input id=\"crafty-timezone\" name=\"timezone\" required=\"\" maxlength=\"64\" placeholder=\"America/Chicago or UTC\"/> <label for=\"crafty-ca\">Private CA certificate, if needed</label><textarea id=\"crafty-ca\" name=\"ca-pem\" maxlength=\"8192\" rows=\"3\"></textarea> <p class=\"field-help\">Leave the certificate blank for publicly trusted HTTPS. The address and certificate must pass normal hostname and trust checks.</p> <!> <div class=\"button-row\"><button class=\"button secondary\" type=\"button\">Add server</button> <button class=\"button primary\" type=\"submit\"> </button></div></form> <!></section>"), Li = /* @__PURE__ */ Y("<div class=\"connections-intro\"><p>Server observations from your deliberately enrolled Crafty connection.</p><span class=\"quiet-label\">Read-only overview</span></div> <!> <!>", 1);
function Ri(e, t) {
	Ue(t, !1);
	let n = pi(t, "binding", 8), r = pi(t, "overview", 8), i = pi(t, "owner", 8, !1), a = pi(t, "active", 8, !1), o = pi(t, "refresh", 8), s = /* @__PURE__ */ Vt(), c = /* @__PURE__ */ Vt([0]), l = /* @__PURE__ */ Vt(0), u = /* @__PURE__ */ Vt(), d = /* @__PURE__ */ Vt(""), f = /* @__PURE__ */ Vt(!1), p = 0, m = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
	function h() {
		++p, K(u)?.abort(), N(u, void 0), K(s)?.reset(), N(c, [Kt(l)]), N(d, ""), N(f, !1);
	}
	hi(h);
	async function g(e = !1) {
		if (!a() || !i() || K(u) || !r() || K(f)) return;
		let t = r().revision, m = K(s) ? new FormData(K(s)) : void 0, h = (e) => m?.getAll(e).map(String) ?? [], g = h("server-id"), _ = h("server-name"), v = h("server-join"), y = e ? null : {
			endpoint: String(m?.get("endpoint") ?? ""),
			token: String(m?.get("token") ?? ""),
			ca_pem: String(m?.get("ca-pem") ?? ""),
			timezone: String(m?.get("timezone") ?? ""),
			servers: g.map((e, t) => ({
				id: e,
				name: _[t] ?? "",
				join: v[t] ?? ""
			}))
		};
		K(s)?.reset(), N(c, [Kt(l)]);
		let b = new AbortController();
		N(u, b);
		let x = ++p, S = setTimeout(() => b.abort(), 4e3);
		N(d, e ? "Removing the connection…" : "Saving the dedicated connection…");
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
			if (x !== p || !a()) return;
			if (r.status === 200) N(d, e ? "Connection removed." : "Connection saved. Checking provider observations…");
			else if (r.status === 409) N(d, "The connection changed elsewhere. Check its current state before enrolling again.");
			else if ([
				400,
				401,
				403,
				413,
				426
			].includes(r.status)) N(d, "Connection not accepted. Check your account and the dedicated connection details.");
			else throw Error("Uncertain connection outcome");
			await o()();
		} catch {
			x === p && a() && (N(f, !0), N(d, "The save outcome is uncertain. Check the connection before entering credentials again."));
		} finally {
			clearTimeout(S), K(u) === b && N(u, void 0);
		}
	}
	async function _() {
		await o()(), a() && (N(f, !1), N(d, "Review the current connection state before making another change."));
	}
	xn(() => ar(a()), () => {
		a() || h();
	}), Sn(), ni();
	var v = Li(), y = L(rn(v), 2), b = (e) => {
		X(e, Di());
	}, x = (e) => {
		var t = ji(), n = rn(t), i = (e) => {
			var t = Oi(), n = I(t, !0);
			Tn(() => Z(n, (ar(r()), q(() => r().error === "checking" ? "Checking the provider. Fresh results will appear on the next observation." : "Provider observations are unavailable or incomplete. Unknown player counts stay unknown.")))), X(e, t);
		};
		Q(n, (e) => {
			ar(r()), q(() => r().error) && e(i);
		});
		var a = L(n, 2);
		Ir(a, 5, () => (ar(r()), q(() => r().servers)), Mr, (e, t) => {
			var n = Ai(), r = F(n), i = I(r, !0), a = L(r, 2), o = I(F(a), !0);
			Se(2), k(a);
			var s = L(a, 2), c = L(F(s)), l = I(c), u = L(c, 3), d = I(u, !0), f = L(u, 3), p = I(f, !0), h = L(f, 2), g = I(h, !0), _ = I(L(h, 3), !0);
			k(s);
			var v = L(s, 2), y = (e) => {
				X(e, ki());
			};
			Q(v, (e) => {
				K(t), q(() => K(t).error) && e(y);
			}), k(n), Tn((e, n) => {
				Z(i, (K(t), q(() => K(t).name))), Z(o, (K(t), q(() => K(t).state === "running" ? "Running" : K(t).state === "stopped" ? "Stopped" : "Unknown"))), Z(l, `${K(t), q(() => K(t).players === null ? "Not reported" : `${K(t).players} reported`) ?? ""}${K(t), q(() => K(t).capacity === null ? "" : ` / ${K(t).capacity} capacity`) ?? ""}`), Z(d, (K(t), q(() => K(t).freshness === "fresh" ? "Recent provider sample" : K(t).freshness === "stale" ? "Stale provider sample" : "Provider sample age unknown"))), Z(p, e), Z(g, n), Z(_, (K(t), q(() => K(t).join || "Not configured")));
			}, [() => (K(t), q(() => m(K(t).collected_at))), () => (K(t), q(() => m(K(t).provider_at)))]), X(e, n);
		}), k(a), Se(2), X(e, t);
	};
	Q(y, (e) => {
		ar(r()), q(() => !r() || !r().configured) ? e(b) : e(x, -1);
	});
	var S = L(y, 2), C = (e) => {
		var t = Ii(), n = L(F(t), 4), i = I(n, !0), a = L(n, 2), o = (e) => {
			var t = Mi();
			J("click", t, () => void _()), X(e, t);
		};
		Q(a, (e) => {
			K(f) && e(o);
		});
		var p = L(a, 2), m = L(F(p)), h = L(m, 3), v = L(h, 3), y = L(v, 3), b = L(y, 4);
		Ir(b, 3, () => K(c), (e) => e, (e, t, n) => {
			var r = Pi(), i = F(r), a = I(i), o = L(i, 2), s = L(o), l = L(s, 2), d = L(l), p = L(d, 2), m = L(p), h = L(m, 2), g = (e) => {
				var n = Ni();
				Tn(() => n.disabled = !!K(u) || K(f)), J("click", n, () => N(c, K(c).filter((e) => e !== K(t)))), X(e, n);
			};
			Q(h, (e) => {
				K(c), q(() => K(c).length > 1) && e(g);
			}), k(r), Tn(() => {
				Z(a, `Server ${K(n) + 1}`), $(o, "for", `crafty-id-${K(t)}`), $(s, "id", `crafty-id-${K(t)}`), s.disabled = !!K(u) || K(f), $(l, "for", `crafty-name-${K(t)}`), $(d, "id", `crafty-name-${K(t)}`), d.disabled = !!K(u) || K(f), $(p, "for", `crafty-join-${K(t)}`), $(m, "id", `crafty-join-${K(t)}`), m.disabled = !!K(u) || K(f);
			}), X(e, r);
		});
		var x = L(b, 2), S = F(x), C = L(S, 2), w = I(C, !0);
		k(x), k(p), ti(p, (e) => N(s, e), () => K(s));
		var ee = L(p, 2), te = (e) => {
			var t = Fi();
			Tn(() => t.disabled = !!K(u) || K(f)), J("click", t, () => void g(!0)), X(e, t);
		};
		Q(ee, (e) => {
			ar(r()), q(() => r()?.configured) && e(te);
		}), k(t), Tn(() => {
			Z(i, K(d)), m.disabled = !!K(u) || K(f), h.disabled = !!K(u) || K(f), v.disabled = !!K(u) || K(f), y.disabled = !!K(u) || K(f), S.disabled = (K(c), K(u), K(f), q(() => K(c).length >= 8 || !!K(u) || K(f))), C.disabled = !!K(u) || K(f) || !r(), Z(w, K(u) ? "Working…" : "Save dedicated connection");
		}), pr("submit", p, (e) => {
			e.preventDefault(), g();
		}), J("click", S, () => N(c, [...K(c), Kt(l)])), X(e, t);
	};
	Q(S, (e) => {
		i() && a() && e(C);
	}), X(e, v), We();
}
mr(["click"]);
// src/App.svelte
var zi = /* @__PURE__ */ Y("<a rel=\"noreferrer\"> </a>"), Bi = /* @__PURE__ */ Y("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), Vi = /* @__PURE__ */ Y("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), Hi = /* @__PURE__ */ Y("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), Ui = /* @__PURE__ */ Y("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), Wi = /* @__PURE__ */ Y("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), Gi = /* @__PURE__ */ Y("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), Ki = /* @__PURE__ */ Y("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span aria-hidden=\"true\"></span></button> <button><span aria-hidden=\"true\">◇</span>Connections</button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <form method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary> <dl><dt>Source</dt><dd><!></dd><dt>Tree</dt><dd> </dd><dt>Channel</dt><dd> </dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\" aria-label=\"Home\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-grid\"><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button></section><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p> </p><button class=\"text-button\">View connections <span aria-hidden=\"true\">→</span></button></section></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <section aria-label=\"Connections\"><!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function qi(e, t) {
	Ue(t, !1);
	let n = () => ui(l, "$model", r), [r, i] = di(), a = /* @__PURE__ */ Vt(), o = /* @__PURE__ */ Vt(), s = pi(t, "binding", 8), c = Ei(s()), l = c.model, u = /* @__PURE__ */ Vt("home"), d = /* @__PURE__ */ Vt(), f = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", p = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified", m = document.querySelector("meta[name=\"reborn-tree\"]")?.content ?? "unqualified", h = document.querySelector("meta[name=\"reborn-channel\"]")?.content ?? "development";
	function g(e) {
		N(u, e), K(d)?.focus();
	}
	mi(c.start), xn(() => n(), () => {
		N(a, new TextEncoder().encode(n().draft).length);
	}), xn(() => (n(), K(a)), () => {
		N(o, n().phase === "ready" && n().dirty && K(a) <= 4096 && ![
			"saving",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), Sn(), ni();
	var _ = Ki(), v = L(rn(_), 2), y = F(v), b = L(F(y), 4), x = F(b);
	let S;
	var C = L(x, 2);
	let w;
	var ee = L(F(C), 2);
	let te;
	k(C);
	var ne = L(C, 2);
	let re;
	k(b);
	var ie = L(b, 2), ae = F(ie), oe = L(F(ae)), se = F(oe), ce = I(se, !0), le = I(L(se), !0);
	k(oe), k(ae);
	var ue = L(ae, 2), de = L(L(F(ue), 2), 2);
	Yr(de), Se(2), k(ue);
	var fe = L(ue, 2), pe = F(fe), me = F(pe, !0);
	Se(), k(pe);
	var he = L(pe, 2), T = L(F(he)), ge = F(T), _e = (e) => {
		var t = zi(), n = I(t, !0);
		Tn(() => {
			$(t, "href", `https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${p}`), Z(n, p);
		}), X(e, t);
	}, ve = /* @__PURE__ */ dt(() => q(() => /^[a-f0-9]{40}$/.test(p))), ye = (e) => {
		var t = Sr();
		Tn(() => Z(t, p)), X(e, t);
	};
	Q(ge, (e) => {
		K(ve) ? e(_e) : e(ye, -1);
	}), k(T);
	var E = L(T, 2), be = I(E, !0), D = I(L(E, 2), !0);
	Se(2), k(he), k(fe), k(ie), k(y);
	var O = L(y, 2), xe = F(O), Ce = F(xe), we = L(F(Ce)), Te = I(we, !0);
	ti(we, (e) => N(d, e), () => K(d)), k(Ce);
	var Ee = L(Ce), De = L(F(Ee), 1, !0);
	k(Ee), k(xe);
	var Oe = L(xe, 2), ke = I(Oe, !0), Ae = L(Oe, 2), je = (e) => {
		X(e, Bi());
	};
	Q(Ae, (e) => {
		n(), q(() => n().phase !== "ready") && e(je);
	});
	var Me = L(Ae, 2), Ne = F(Me), Pe = F(Ne), Fe = L(F(Pe), 3);
	k(Pe), Se(), k(Ne);
	var Ie = L(Ne, 2), Le = F(Ie), Re = L(F(Le), 2), ze = I(Re, !0), Be = L(Re);
	k(Le);
	var Ve = L(Le), A = L(F(Ve), 2), He = I(A, !0), Ge = L(A);
	k(Ve), k(Ie), k(Me);
	var Ke = L(Me, 2), qe = F(Ke), Je = I(L(F(qe)), !0);
	k(qe);
	var Ye = L(qe, 2), Xe = (e) => {
		var t = Vi(), n = L(F(t), 2), r = F(n), i = L(r);
		k(n), k(t), J("click", r, function(...e) {
			c.recover?.apply(this, e);
		}), J("click", i, () => c.resolve(!0)), X(e, t);
	};
	Q(Ye, (e) => {
		n(), q(() => n().recovery) && e(Xe);
	});
	var Ze = L(Ye, 2), j = L(F(Ze), 2);
	et(j);
	var Qe = L(j, 4), $e = F(Qe);
	let tt;
	var nt = I($e), rt = L($e), it = I(rt, !0);
	k(Qe), k(Ze);
	var at = L(Ze, 2), ot = (e) => {
		X(e, Hi());
	};
	Q(at, (e) => {
		n(), q(() => n().storageLimited) && e(ot);
	});
	var st = L(at, 2), ct = (e) => {
		X(e, Ui());
	};
	Q(st, (e) => {
		K(a) > 4096 && e(ct);
	});
	var lt = L(st, 2), ut = (e) => {
		var t = Wi(), r = L(F(t), 2), i = I(r, !0), a = L(r), o = F(a), s = L(o);
		k(a), k(t), Tn(() => Z(i, (n(), q(() => n().snapshot?.note.body)))), J("click", o, () => c.resolve(!1)), J("click", s, () => c.resolve(!0)), X(e, t);
	};
	Q(lt, (e) => {
		n(), q(() => n().save === "conflict") && e(ut);
	});
	var pt = L(lt, 2), mt = (e) => {
		var t = Gi(), n = L(F(t), 2);
		k(t), J("click", n, () => c.check()), X(e, t);
	};
	Q(pt, (e) => {
		n(), q(() => n().save === "uncertain") && e(mt);
	}), k(Ke);
	var ht = L(Ke, 2), gt = F(ht);
	{
		let e = /* @__PURE__ */ ft(() => (n(), q(() => n().snapshot?.crafty))), t = /* @__PURE__ */ ft(() => (n(), q(() => n().snapshot?.account.role === "owner"))), r = /* @__PURE__ */ ft(() => (K(u), n(), q(() => K(u) === "connections" && n().phase === "ready")));
		Ri(gt, {
			get binding() {
				return s();
			},
			get overview() {
				return K(e);
			},
			get owner() {
				return K(t);
			},
			get active() {
				return K(r);
			},
			get refresh() {
				return q(() => c.check);
			}
		});
	}
	k(ht), Se(2), k(O), k(v), Tn(() => {
		$(x, "aria-current", K(u) === "home" ? "page" : void 0), S = Wr(x, 1, "", null, S, { active: K(u) === "home" }), $(C, "aria-current", K(u) === "note" ? "page" : void 0), w = Wr(C, 1, "", null, w, { active: K(u) === "note" }), te = Wr(ee, 1, "draft-dot", null, te, { visible: n().dirty }), $(ne, "aria-current", K(u) === "connections" ? "page" : void 0), re = Wr(ne, 1, "", null, re, { active: K(u) === "connections" }), Z(ce, (n(), q(() => n().snapshot?.account.username ?? "Your account"))), Z(le, (n(), q(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), Xr(de, s()), Z(me, f), Z(be, m), Z(D, h), Z(Te, K(u) === "home" ? "Welcome home." : K(u) === "note" ? "A little space to think." : "Your servers, at a glance."), Z(De, (n(), q(() => n().phase === "ready" ? "Session checked" : n().phase === "checking" ? "Checking access" : "Access paused"))), Z(ke, (n(), q(() => n().message))), $(Me, "hidden", (K(u), n(), q(() => K(u) !== "home" || n().phase !== "ready"))), Z(ze, (n(), q(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are."))), Z(He, (n(), q(() => n().snapshot?.crafty?.configured ? "Your enrolled Crafty observations are available in Connections." : "Enroll dedicated Crafty access to see your selected servers."))), $(Ke, "hidden", (K(u), n(), q(() => K(u) !== "note" || n().phase !== "ready"))), Z(Je, (n(), q(() => n().dirty ? "Unsaved changes" : "Up to date"))), Xr(j, (n(), q(() => n().draft))), j.disabled = (n(), q(() => n().phase !== "ready")), tt = Wr($e, 1, "", null, tt, { "over-limit": K(a) > 4096 }), Z(nt, `${K(a) ?? ""} / 4096 bytes`), rt.disabled = !K(o), Z(it, (n(), q(() => n().save === "saving" ? "Saving…" : "Save note"))), $(ht, "hidden", (K(u), n(), q(() => K(u) !== "connections" || n().phase !== "ready")));
	}), J("click", x, () => g("home")), J("click", C, () => g("note")), J("click", ne, () => g("connections")), pr("submit", ue, () => c.signOut()), J("click", Fe, () => g("note")), J("click", Be, () => g("note")), J("click", Ge, () => g("connections")), pr("submit", Ze, (e) => {
		e.preventDefault(), c.save();
	}), J("input", j, (e) => c.edit(e.currentTarget.value)), X(e, _), We(), i();
}
mr(["click", "input"]);
// src/main.ts
var Ji = document.getElementById("workspace-root"), Yi = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, Xi = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
if (Ji && Yi && /^[a-f0-9]{64}$/.test(Yi) && Xi === "reborn-workspace-v1") {
	let e = Array.from(Ji.childNodes);
	Ji.replaceChildren();
	try {
		Dr(qi, {
			target: Ji,
			props: { binding: Yi }
		});
	} catch {
		Ji.replaceChildren(...e);
	}
}
