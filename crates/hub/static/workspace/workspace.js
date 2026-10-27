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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, ee = 1 << 25, te = 1 << 21, ne = 1 << 22, re = 1 << 23, T = Symbol("$state"), ie = Symbol("component"), ae = Symbol("legacy props"), oe = Symbol(""), se = Symbol("attributes"), ce = Symbol("class"), le = Symbol("style"), ue = Symbol("text"), de = Symbol("form reset"), fe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), pe = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), me = {}, E = Symbol("uninitialized"), he = "http://www.w3.org/1999/xhtml";
function ge() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function _e(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function ve() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function ye() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// ../node_modules/svelte/src/internal/client/dom/hydration.js
var D = !1;
function be(e) {
	D = e;
}
var O;
function k(e) {
	if (e === null) throw _e(), me;
	return O = e;
}
function xe() {
	return k(/* @__PURE__ */ on(O));
}
function A(e) {
	if (D) {
		if (/* @__PURE__ */ on(O) !== null) throw _e(), me;
		O = e;
	}
}
function Se(e = 1) {
	if (D) {
		for (var t = e, n = O; t--;) n = /* @__PURE__ */ on(n);
		O = n;
	}
}
function Ce(e = !0) {
	for (var t = 0, n = O;;) {
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
	if (!e || e.nodeType !== 8) throw _e(), me;
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
		r: H,
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
	return i(e, ie, { value: !0 }), e;
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
	D && /* @__PURE__ */ an(e) !== null && cn(e);
}
var tt = !1;
function nt() {
	tt || (tt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[de]?.();
		});
	}, { capture: !0 }));
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function rt(e) {
	var t = V, n = H;
	Wn(null), Gn(null);
	try {
		return e();
	} finally {
		Wn(t), Gn(n);
	}
}
function it(e, t, n, r = n) {
	e.addEventListener(t, () => rt(n));
	let i = e[de];
	e[de] = i ? () => {
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
	var s = H, c = ot(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
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
	var e = H, t = V, n = j, r = N;
	return function(i = !0) {
		Gn(e), Wn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function st(e = !0) {
	Gn(null), Wn(null), He(null), e && N?.deactivate();
}
function ct() {
	var e = H, t = e.b, n = N, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function lt(e) {
	var t = 2 | g;
	return H !== null && (H.f |= C), {
		ctx: j,
		deps: null,
		effects: null,
		equals: Te,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: E,
		wv: 0,
		parent: H,
		ac: null
	};
}
var ut = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function dt(e, t, n) {
	let r = H;
	r === null && ke();
	var i = void 0, a = Bt(E), o = !V, s = /* @__PURE__ */ new Set();
	return En(() => {
		var t = H, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== fe && n.reject(e);
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
			l?.(), s.delete(n), t !== ut && (c.activate(), t ? (a.f |= re, Wt(a, t)) : (a.f & 8388608 && (a.f ^= re), Wt(a, e)), c.deactivate());
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
	return qn(t), t;
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
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function ht(e) {
	var t, n = H, r = e.parent;
	if (!Vn && r !== null && e.v !== E && r.f & 24576) return ge(), e.v;
	Gn(r);
	try {
		mt(e), t = ar(e);
	} finally {
		Gn(n);
	}
	return t;
}
function gt(e) {
	var t = ht(e);
	!e.equals(t) && (e.wv = nr(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), bt?.capture(e, t, !0)), e.deps === null)) ? M(e, h) : Vn || (xt === null ? Qe(e) : (_n() || N?.is_fork) && xt.set(e, t));
}
function _t(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && rt(() => {
		t.ac.abort(fe), t.ac = null;
	}), t.fn !== null && (t.teardown = d), cr(t, 0), jn(t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && lr(t);
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
				a ? r.f ^= h : i & 4 ? t.push(r) : rr(r) && (i & 16 && this.#d.add(r), lr(r));
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
		e.v !== E && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), xt?.set(e, t)), this.is_fork || (e.v = t);
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
			if (!(r.f & 24576) && rr(r) && (Mt = /* @__PURE__ */ new Set(), lr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Pn(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || lr(n);
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
	return qn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t = !1, n = !0) {
	let r = Bt(e);
	return t || (r.equals = De), Be && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function F(e, t, n = !1) {
	return V !== null && (!Un || V.f & 131072) && Ke() && V.f & 4325394 && (Kn === null || !Kn.has(e)) && Re(), Wt(e, n ? Yt(t) : t, Et);
}
var Ht = null, Ut = 0;
function Wt(e, t, n = null) {
	if (!e.equals(t)) {
		Vn ? Rt.set(e, t) : Rt.has(e) || Rt.set(e, e.v);
		var r = kt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ht(t), xt === null && Qe(t);
		}
		e.wv = nr(), Ht = null, Ut = 0, Jt(e, g, n), Ht = null, Ke() && H !== null && H.f & 1024 && !(H.f & 96) && (Xn === null ? Zn([e]) : Xn.push(e)), !r.is_fork && Lt.size > 0 && !zt && Gt();
	}
	return t;
}
function Gt() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && M(e, _);
		let t;
		try {
			t = rr(e);
		} catch {
			t = !0;
		}
		t && lr(e);
	}
	Lt.clear();
}
function Kt(e, t = 1) {
	var n = U(e);
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
			if (i || s !== H) {
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
	if (typeof t != "object" || !t || T in t || ie in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Vt(0), u = null, d = er, f = (e) => {
		if (er === d) return e();
		var t = V, n = er;
		Wn(null), tr(d);
		var r = e();
		return Wn(t), tr(n), r;
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
					let e = f(() => /* @__PURE__ */ Vt(E, u));
					r.set(t, e), qt(o);
				}
			} else F(n, E), qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === T) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Vt(Yt(s ? e[n] : E), u)), r.set(n, o)), o !== void 0) {
				var c = U(o);
				return c === E ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = U(i);
				if (a === E) return;
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
			if (t === T) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== E || Reflect.has(e, t);
			return (n !== void 0 || H !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Vt(i ? Yt(e[t]) : E, u)), r.set(t, n)), U(n) === E) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Vt(E, u)), r.set(d + "", p)) : F(p, E);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Vt(void 0, u)), F(c, Yt(n)), r.set(t, c));
			else {
				l = c.v !== E;
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
			U(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== E;
			});
			for (var [n, i] of r) i.v !== E && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Le();
		}
	});
}
function Xt(e) {
	try {
		if (typeof e == "object" && e && T in e) return e[T];
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
		en = a(t, "firstChild").get, tn = a(t, "nextSibling").get, u(e) && (e[ce] = void 0, e[se] = null, e[le] = void 0, e.__e = void 0), u(n) && (n[ue] = void 0);
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
	if (!D) return /* @__PURE__ */ an(e);
	var n = /* @__PURE__ */ an(O);
	if (n === null) n = O.appendChild(rn());
	else if (t && n.nodeType !== 3) {
		var r = rn();
		return n?.before(r), k(r), r;
	}
	return t && dn(n), k(n), n;
}
function sn(e, t = !1) {
	if (!D) {
		var n = /* @__PURE__ */ an(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ on(n) : n;
	}
	if (t) {
		if (O?.nodeType !== 3) {
			var r = rn();
			return O?.before(r), k(r), r;
		}
		dn(O);
	}
	return O;
}
function L(e, t = !1) {
	if (!D) return /* @__PURE__ */ an(e);
	var n = I(e, t);
	return A(e), n;
}
function R(e, t = 1, n = !1) {
	let r = D ? O : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ on(r);
	if (!D) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = rn();
			return r === null ? i?.after(a) : r.before(a), k(a), a;
		}
		dn(r);
	}
	return k(r), r;
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
	var t = H;
	if (t === null) return V.f |= re, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	pn(e, t);
}
function pn(e, t) {
	if (e === me) throw e;
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
	H === null && (V === null && Ne(e), Me()), Vn && je(e);
}
function hn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function gn(e, t) {
	var n = H;
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
			lr(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && hn(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function _n() {
	return V !== null && !Un;
}
function vn(e) {
	let t = gn(8, null);
	return M(t, h), t.teardown = e, t;
}
function yn(e) {
	mn("$effect");
	var t = H.f;
	if (!V && t & 32 && j !== null && !j.i) {
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
		e.outro ? Fn(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
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
			var n = H;
			try {
				Gn(n.parent), W(t);
			} finally {
				Gn(n);
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
			n.f & 1024 && n.deps !== null && M(n, _), rr(n) && lr(n), t.ran = !1;
		}
	});
}
function En(e) {
	return gn(ne | C, e);
}
function Dn(e, t = 0) {
	return gn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	at(r, t, n, (t) => {
		gn(8, () => {
			e(...t.map(U));
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
		let n = Vn, r = V;
		Hn(!0), Wn(null);
		try {
			t.call(null);
		} catch (t) {
			pn(t, e.parent);
		} finally {
			Hn(n), Wn(r);
		}
	}
}
function jn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && rt(() => {
			e.abort(fe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function Mn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Nn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, jn(e, t && !n), cr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	An(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Pn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Nn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ on(e);
		e.remove(), e = n;
	}
}
function Pn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Fn(e, t, n = !0) {
	var r = [];
	e.f |= 256, In(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function In(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				In(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Ln(e) {
	e.f &= -257, Rn(e, !0);
}
function Rn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (M(e, g), kt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Rn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function zn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ on(n);
		t.append(n), n = i;
	}
}
// ../node_modules/svelte/src/internal/client/legacy.js
var Bn = null, Vn = !1;
function Hn(e) {
	Vn = e;
}
var V = null, Un = !1;
function Wn(e) {
	V = e;
}
var H = null;
function Gn(e) {
	H = e;
}
var Kn = null;
function qn(e) {
	V !== null && (V.f & 2097152 || V.f & 2) && (Kn ??= /* @__PURE__ */ new Set()).add(e);
}
var Jn = null, Yn = 0, Xn = null;
function Zn(e) {
	Xn = e;
}
var Qn = 1, $n = 0, er = $n;
function tr(e) {
	er = e;
}
function nr() {
	return ++Qn;
}
function rr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (rr(a) && gt(a), a.wv > e.wv) return !0;
		}
		t & 512 && xt === null && M(e, h);
	}
	return !1;
}
function ir(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Kn !== null && Kn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ir(a, t, !1) : t === a && (n ? M(a, g) : a.f & 1024 && M(a, _), Pt(a));
	}
}
function ar(e) {
	var t = Jn, n = Yn, r = Xn, i = V, a = Kn, o = j, s = Un, c = er, l = e.f;
	Jn = null, Yn = 0, Xn = null, V = l & 96 ? null : e, Kn = null, He(e.ctx), Un = !1, er = ++$n, e.ac !== null && (rt(() => {
		e.ac.abort(fe);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= b;
		var f = or(e);
		if (Ke() && Xn !== null && !Un && f !== null && !(e.f & 6146)) for (var p = 0; p < Xn.length; p++) ir(Xn[p], e);
		if (i !== null && i !== e) {
			if ($n++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = $n;
			if (t !== null) for (let e of t) e.rv = $n;
			Xn !== null && (r === null ? r = Xn : r.push(...Xn));
		}
		return e.f & 8388608 && (e.f ^= re), d;
	} catch (t) {
		return or(e), fn(t);
	} finally {
		e.f ^= te, Jn = t, Yn = n, Xn = r, V = i, Kn = a, He(o), Un = s, er = c;
	}
}
function or(e) {
	var t = e.deps, n = N?.is_fork;
	if (Jn !== null) {
		var r;
		if (n || cr(e, Yn), t !== null && Yn > 0) for (t.length = Yn + Jn.length, r = 0; r < Jn.length; r++) t[Yn + r] = Jn[r];
		else e.deps = t = Jn;
		if (_n() && e.f & 512) for (r = Yn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Yn < t.length && (cr(e, Yn), t.length = Yn);
	return t;
}
function sr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Jn === null || !n.call(Jn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== E && Qe(s), s.ac !== null && rt(() => {
			s.ac.abort(fe), s.ac = null, M(s, g);
		}), _t(s), cr(s, 0);
	}
}
function cr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) sr(e, n[r]);
}
function lr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		M(e, h);
		var n = H;
		H = e;
		try {
			t & 16777232 ? Mn(e) : jn(e), An(e);
			var r = ar(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Qn;
		} finally {
			H = n;
		}
	}
}
async function ur() {
	await Promise.resolve(), At();
}
function U(e) {
	var t = !!(e.f & 2);
	if (Bn?.add(e), V !== null && !Un && !(H !== null && H.f & 16384) && (Kn === null || !Kn.has(e))) {
		var r = V.deps;
		if (V.f & 2097152) e.rv < $n && (e.rv = $n, Jn === null && r !== null && r[Yn] === e ? Yn++ : Jn === null ? Jn = [e] : Jn.push(e));
		else {
			V.deps ??= [], n.call(V.deps, e) || V.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [V] : n.call(i, V) || i.push(V);
		}
	}
	if (Vn && Rt.has(e)) return Rt.get(e);
	if (t) {
		var a = e;
		if (Vn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || fr(a)) && (o = ht(a)), Rt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Un && V !== null && !!(V.f & 512), c = (a.f & b) === 0;
		rr(a) && (s && (a.f |= 512), gt(a)), s && !c && (vt(a), dr(a));
	}
	if (xt?.has(e)) return xt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function dr(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (vt(r), dr(r));
	}
}
function fr(e) {
	if (e.v === E) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && fr(t)) return !0;
	return !1;
}
function W(e) {
	var t = Un;
	try {
		return Un = !0, e();
	} finally {
		Un = t;
	}
}
function G(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (T in e) pr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && T in n && pr(n);
		}
	}
}
function pr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			pr(e[n], t);
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
var mr = ["touchstart", "touchmove"];
function hr(e) {
	return mr.includes(e);
}
// ../node_modules/svelte/src/internal/client/dom/elements/events.js
var gr = Symbol("events"), _r = /* @__PURE__ */ new Set(), vr = /* @__PURE__ */ new Set();
function yr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || wr.call(t, e), !e.cancelBubble) return rt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Ye(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function br(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = yr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && vn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function K(e, t, n) {
	(t[gr] ??= {})[e] = n;
}
function xr(e) {
	for (var t = 0; t < e.length; t++) _r.add(e[t]);
	for (var n of vr) n(e);
}
var Sr = null, Cr = !1;
function wr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Sr = e, Cr || (Cr = !0, setTimeout(() => {
		Cr = !1, Sr = null;
	}));
	var s = 0, c = Sr === e && e[gr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[gr] = t;
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
		var d = V, f = H;
		Wn(null), Gn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[gr]?.[r];
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
			e[gr] = t, delete e.currentTarget, Wn(d), Gn(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var Tr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Er(e) {
	return Tr?.createHTML(e) ?? e;
}
function Dr(e) {
	var t = un("template");
	return t.innerHTML = Er(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function Or(e, t) {
	var n = H;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function q(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (D) return Or(O, null), O;
		i === void 0 && (i = Dr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ an(i)));
		var t = r || $t ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ an(t), s = t.lastChild;
			Or(o, s);
		} else Or(t, t);
		return t;
	};
}
function kr(e = "") {
	if (!D) {
		var t = rn(e + "");
		return Or(t, t), t;
	}
	var n = O;
	return n.nodeType === 3 ? dn(n) : (n.before(n = rn()), k(n)), Or(n, n), n;
}
function J(e, t) {
	if (D) {
		var n = H;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = O), xe();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function Ar(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		_n() && (U(n), Dn(() => (t === 0 && (r = W(() => e(() => qt(n)))), t += 1, () => {
			Ye(() => {
				--t, t === 0 && (r?.(), r = void 0, qt(n));
			});
		})));
	};
}
// ../node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var jr = S | C;
function Mr(e, t, n, r) {
	new Nr(e, t, n, r);
}
var Nr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = D ? O : null;
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
	#h = Ar(() => (this.#m = Bt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = On(() => {
			if (D) {
				let e = we(this.#t);
				xe();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, jr), D && (this.#e = O);
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
			this.#y() || (t ? ye() : (t = !0, n && ze(), this.#s !== null && Fn(this.#s, () => {
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
				}), this.#a === null ? (this.#c = null, n && this.#S(N)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Fn(this.#o, () => {
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
				zn(this.#a, e);
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
		var t = H, n = V, r = j;
		Gn(this.#i), Wn(this.#i), He(this.#i.ctx);
		try {
			return kt.ensure(), e();
		} finally {
			Gn(t), Wn(n), He(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Fn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ye(() => {
			this.#d = !1, this.#m && Wt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), U(this.#m);
	}
	error(e) {
		if (e === me || !this.#n.onerror && !this.#n.failed) throw e;
		N?.is_fork ? (this.#a && N.skip_effect(this.#a), this.#o && N.skip_effect(this.#o), this.#s && N.skip_effect(this.#s), N.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), D && (k(this.#t), Se(), k(Ce()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return kn(() => {
						var r = H;
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
function Y(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ue] ??= e.nodeValue) && (e[ue] = n, e.nodeValue = `${n}`);
}
function Pr(e, t) {
	return Ir(e, t);
}
var Fr = /* @__PURE__ */ new Map();
function Ir(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	nn();
	var l = void 0, u = Sn(() => {
		var s = n ?? t.appendChild(rn());
		Mr(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = j;
			if (o && (n.c = o), a && (i.$$events = a), D && Or(t, null), l = e(t, i) || Ge(), D && (H.nodes.end = O, O === null || O.nodeType !== 8 || O.data !== "]")) throw _e(), me;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = hr(r);
					for (let e of [t, document]) {
						var a = Fr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Fr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, wr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(_r)), vr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Fr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, wr), r.delete(e), r.size === 0 && Fr.delete(n)) : r.set(e, i);
			}
			vr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Lr.set(l, u), l;
}
var Lr = /* @__PURE__ */ new WeakMap(), Rr = class {
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
			if (n) Ln(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Ln(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						zn(r, t), t.append(rn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Fn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
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
		} else D && (this.anchor = O), this.#a(n);
	}
};
// ../node_modules/svelte/src/internal/client/dom/blocks/if.js
function X(e, t, n = !1) {
	var r;
	D && (r = O, xe());
	var i = new Rr(e), a = n ? S : 0;
	function o(e, t) {
		if (D) {
			var n = we(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ce();
				k(a), i.anchor = a, be(!1), i.ensure(e, t), be(!0);
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
function zr(e, t) {
	return t;
}
function Br(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Fn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Vr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
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
		Vr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Vr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ee, zn(a, document.createDocumentFragment())) : B(t[i], n);
	}
}
var Hr;
function Ur(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = D ? k(/* @__PURE__ */ an(u)) : u.appendChild(rn());
	}
	D && xe();
	var d = null, f = /* @__PURE__ */ pt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = U(f);
			_.fallback = d, Gr(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= ee, qr(d, null, c)) : Ln(d) : Fn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: On(() => {
			var e = U(f), t = e.length;
			let r = !1;
			D && we(c) === "[!" != (t === 0) && (c = Ce(), k(c), be(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = N, v = ln(), y = 0; y < t; y += 1) {
				D && O.nodeType === 8 && O.data === "]" && (c = O, r = !0, be(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && Wt(S.v, b), S.i && Wt(S.i, y), v && _.unskip_effect(S.e)) : (S = Kr(l, m ? c : Hr ??= rn(), b, x, y, o, n, i), m || (S.e.f |= ee), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = kn(() => s(c)) : (d = kn(() => s(Hr ??= rn())), d.f |= ee)), t > u.size && Ae("", "", ""), D && t > 0 && k(Ce()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && be(!0), U(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, D && (c = O);
}
function Wr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Gr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Wr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Ln(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ee, _ === l) qr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Jr(e, d, _), Jr(e, _, y), qr(_, y, n), d = _, p = [], m = [], l = Wr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) qr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Jr(e, S.prev, C.next), Jr(e, d, S), Jr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), qr(_, l, n), Jr(e, _.prev, _.next), Jr(e, _, d === null ? e.effect.first : d.next), Jr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Wr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Wr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Vr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Wr(l.next);
		var te = w.length;
		if (te > 0) {
			var ne = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) w[v].nodes?.a?.fix();
			}
			Br(e, w, ne);
		}
	}
	o && Ye(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Kr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ P(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: kn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function qr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ on(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Jr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// ../node_modules/svelte/src/internal/shared/attributes.js
var Yr = [..." 	\n\r\f\xA0\v﻿"];
function Xr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Yr.includes(r[o - 1])) && (s === r.length || Yr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// ../node_modules/svelte/src/internal/client/dom/elements/class.js
function Zr(e, t, n, r, i, a) {
	var o = e[ce];
	if (D || o !== n || o === void 0) {
		var s = Xr(n, r, a);
		D && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ce] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Qr(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function $r(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = ri(c);
			Qr(c, i ? a.includes(l) : Zt(l, r));
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
function ei(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return ve();
		for (var i of t.options) i.selected = n.includes(ri(i));
	} else {
		for (i of t.options) if (Zt(ri(i), n)) {
			i.selected = !0;
			return;
		}
		r && n === void 0 || (t.selectedIndex = -1);
	}
}
function ti(e) {
	var t = new MutationObserver((t) => {
		t.every(ii) || ("__defaultValue" in e && $r(e, !1), "__value" in e && ei(e, e.__value));
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
function ni(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	it(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ri);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ri(o);
		}
		n(a), e.__value = a, N !== null && r.add(N);
	}), Cn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = N;
			if (r.has(o)) return;
		}
		if (ei(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ri(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function ri(e) {
	return "__value" in e ? e.__value : e.value;
}
function ii(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// ../node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ai = Symbol("is custom element"), oi = Symbol("is html"), si = pe ? "link" : "LINK", ci = pe ? "progress" : "PROGRESS";
function li(e) {
	if (D) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Z(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Z(e, "checked", null), e.checked = r;
				}
			}
		};
		e[de] = n, Ye(n), nt();
	}
}
function ui(e, t) {
	var n = di(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ci) && (e.value = t ?? "");
}
function Z(e, t, n, r) {
	var i = di(e);
	D && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === si) || i[t] !== (i[t] = n) && (t === "loading" && (e[oe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && pi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function di(e) {
	return e[se] ??= {
		[ai]: e.nodeName.includes("-"),
		[oi]: e.namespaceURI === he
	};
}
var fi = /* @__PURE__ */ new Map();
function pi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = fi.get(t);
	if (n) return n;
	fi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function mi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	it(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = hi(e) ? gi(a) : a, n(a), N !== null && r.add(N), await ur(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (D && e.defaultValue !== e.value || W(t) == null && e.value) && (n(hi(e) ? gi(e.value) : e.value), N !== null && r.add(N)), Dn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = N;
			if (r.has(i)) return;
		}
		hi(e) && n === gi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function hi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function gi(e) {
	return e === "" ? null : +e;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function _i(e, t) {
	return e === t || e?.[T] === t;
}
function vi(e = Ge(), t, n, r) {
	var i = j.r, a = H;
	return Cn(() => {
		var o, s;
		return Dn(() => {
			o = s, s = r?.() || [], W(() => {
				_i(n(...s), e) || (t(e, ...s), o && _i(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && _i(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function yi(e = !1) {
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => G(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ lt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => U(i);
	}
	n.b.length && xn(() => {
		bi(t, r), p(n.b);
	}), yn(() => {
		let e = W(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && yn(() => {
		bi(t, r), p(n.a);
	});
}
function bi(e, t) {
	if (e.l.s) for (let t of e.l.s) U(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function xi(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = W(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var Si = [];
function Ci(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ee(e, t) && (e = t, n)) {
			let t = !Si.length;
			for (let t of r) t[1](), Si.push(t, e);
			if (t) {
				for (let e = 0; e < Si.length; e += 2) Si[e][0](Si[e + 1]);
				Si.length = 0;
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
function wi(e) {
	let t;
	return xi(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var Ti = !1, Ei = Symbol("unmounted");
function Di(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ P(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(Ei in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = xi(e, (e) => {
				i ? r.source.v = e : F(r.source, e);
			}), i = !1;
		}
	}
	return e && Ei in n ? wi(e) : U(r.source);
}
function Oi() {
	let e = {};
	function t() {
		vn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Ei, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function ki(e) {
	var t = Ti;
	try {
		return Ti = !1, [e(), Ti];
	} finally {
		Ti = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function Q(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ lt(r), U(u)) : (l && (l = !1, c = s ? W(r) : r), c);
	let f;
	if (o) {
		var p = T in e || ae in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = ki(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Fe(t), f(m)));
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
	o && U(y);
	var b = H;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? U(y) : i && o ? Yt(e) : e;
			return F(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Vn && v || b.f & 16384 ? y.v : U(y);
	});
}
function Ai(e) {
	j === null && Oe("onMount"), Be && j.l !== null ? Mi(j).m.push(e) : yn(() => {
		let t = W(e);
		if (typeof t == "function") return t;
	});
}
function ji(e) {
	j === null && Oe("onDestroy"), Ai(() => () => W(e));
}
function Mi(e) {
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
var Ni = "keida-hub-reborn", Pi = "reborn-workspace-v1", Fi = 9223372036854775807n, Ii = () => ({
	phase: "idle",
	entries: [],
	through: "0",
	next: null,
	category: "all",
	query: "",
	message: ""
}), Li = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1,
	directorySave: "idle",
	directoryMessage: "",
	activity: Ii()
}), Ri = (e) => typeof e == "object" && !!e && !Array.isArray(e), $ = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= Fi && (!t || e !== "0"), zi = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096;
function Bi(e) {
	if (typeof e != "string" || new TextEncoder().encode(e).length > 1024 || !/^https:\/\/[^/]/.test(e) || /[\s\u0000-\u001f\u007f\\]/u.test(e)) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "https:" && !!t.hostname && !t.username && !t.password && !e.includes("?") && !e.includes("#");
	} catch {
		return !1;
	}
}
function Vi(e) {
	if (!Ri(e) || e.product !== Ni || e.contract !== Pi || e.schema !== 1 || !Ri(e.account) || !$(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !$(e.session_generation) || !Ri(e.note) || !zi(e.note.body) || !$(e.note.revision)) throw Error("Invalid workspace response");
	let t = e.directory, n = (e, t, n = !1) => typeof e == "string" && (!n || e.length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e);
	if (!Ri(t) || !$(t.revision) || !$(t.pins_revision) || !Array.isArray(t.services) || t.services.length > 100 || t.services.some((e) => !Ri(e) || !$(e.id, !0) || !n(e.name, 80, !0) || !n(e.category, 40, !0) || !n(e.description, 240) || !Bi(e.url)) || new Set(t.services.map((e) => e.id)).size !== t.services.length || !Array.isArray(t.pins) || t.pins.length > 24 || new Set(t.pins).size !== t.pins.length || t.pins.some((e) => !$(e, !0) || !t.services.some((t) => t.id === e))) throw Error("Invalid directory response");
	if (e.crafty != null) {
		let t = e.crafty, n = (e) => e === null || typeof e == "number" && Number.isSafeInteger(e) && e >= 0, r = (e) => e === null || typeof e == "string" && /^[a-z_]{1,40}$/.test(e);
		if (!Ri(t) || !$(t.revision) || typeof t.configured != "boolean" || !n(t.checked_at) || !r(t.error) || !Array.isArray(t.servers) || t.servers.length > 8 || t.servers.some((e) => !Ri(e) || typeof e.name != "string" || e.name.length > 80 || typeof e.join != "string" || e.join.length > 253 || ![
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
function Hi(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (Ri(t) && t.schema === 1 && zi(t.body) && $(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
function Ui(e) {
	let t = Ci(Li("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c = 0, l, u, d, f = !1, p = !1, m = () => wi(t), h = (e) => `${Ni}.workspace.v1:${e.account.id}:${e.session_generation}`;
	function g() {
		if (u = void 0, l) try {
			sessionStorage.removeItem(l);
		} catch {}
	}
	function _() {
		let e = m();
		if (!l || !e.snapshot) return;
		if (!e.dirty) {
			g();
			return;
		}
		let n = {
			body: e.draft,
			base: e.base
		};
		u = {
			key: l,
			draft: n
		};
		try {
			sessionStorage.setItem(l, JSON.stringify({
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
	function v() {
		++n, r && clearTimeout(r), r = void 0, i?.abort(), a?.abort(), i = void 0, a = void 0, o?.abort(), o = void 0, ++c, s?.abort(), s = void 0;
	}
	function y(e, n = !1) {
		v(), p ||= n, At(() => t.set(Li(n ? "blocked" : "paused", e)));
	}
	function b() {
		r && clearTimeout(r), !f && !p && m().phase === "ready" && document.visibilityState === "visible" && (r = setTimeout(() => {
			r = void 0, w();
		}, 15e3));
	}
	async function x(t, n, r) {
		let i = performance.now(), a = setTimeout(() => n.abort(), 4e3);
		try {
			let a = await fetch(t, {
				method: r ? "PUT" : "GET",
				credentials: "same-origin",
				cache: "no-store",
				redirect: "error",
				signal: n.signal,
				headers: {
					"X-Reborn-Product": Ni,
					"X-Reborn-Contract": Pi,
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
	function S(e) {
		return e === 401 || e === 403 ? "Your sign-in changed or ended. Open a fresh workspace after signing in." : e === 426 ? "This workspace needs a fresh document. Open workspace again." : "Your workspace could not be checked. Open workspace again when access is available.";
	}
	function C(e) {
		let t = m().snapshot;
		return !t || e.account.id === t.account.id && e.session_generation === t.session_generation && e.account.role === t.account.role;
	}
	async function w() {
		if (f || p || i || a || o || document.visibilityState !== "visible") return;
		let e = new AbortController();
		i = e;
		let r = n;
		try {
			let i = await x("/api/workspace/snapshot", e);
			if (f || e.signal.aborted || r !== n) return;
			if (document.visibilityState !== "visible") {
				y("Workspace hidden. Checking access on return.");
				return;
			}
			if (i.status !== 200) {
				y(S(i.status), !0);
				return;
			}
			let a = Vi(i.value);
			if (!C(a)) {
				y("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let o = m();
			if (l = h(a), o.phase === "ready") {
				let e = o.dirty && a.note.revision !== o.base;
				t.set({
					...o,
					snapshot: a,
					draft: o.dirty ? o.draft : a.note.body,
					base: o.dirty ? o.base : a.note.revision,
					save: e ? "conflict" : ["uncertain", "checking-conflict"].includes(o.save) ? "idle" : o.save,
					message: e ? "A newer saved note is available. Your draft is unchanged." : "Workspace checked.",
					directorySave: o.directorySave === "uncertain" ? "idle" : o.directorySave,
					directoryMessage: o.directorySave === "uncertain" ? "Current saved directory and pins checked. Review them before making another change." : o.directoryMessage
				}), o.dirty && o.draft === a.note.body && (t.update((e) => ({
					...e,
					dirty: !1,
					base: a.note.revision,
					save: "saved",
					message: "The current note is saved."
				})), g());
			} else {
				let e = u?.key === l ? u.draft : void 0, n = !1;
				try {
					e ??= Hi(sessionStorage.getItem(l));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (g(), e = void 0), t.set({
					...Li("ready", "Workspace checked."),
					snapshot: a,
					draft: a.note.body,
					base: a.note.revision,
					recovery: e,
					storageLimited: n
				});
			}
			b();
		} catch {
			i === e && r === n && !f && y("Your workspace could not be checked. Open workspace again to retry deliberately.", !0);
		} finally {
			i === e && (i = void 0);
		}
	}
	function ee(e) {
		let n = m();
		if (n.phase === "ready" && n.snapshot) {
			if (t.set({
				...n,
				draft: e,
				dirty: e !== n.snapshot.note.body,
				save: n.save === "saved" ? "idle" : n.save
			}), zi(e)) _();
			else if (u = void 0, l) try {
				sessionStorage.removeItem(l);
			} catch {}
		}
	}
	function te() {
		let e = m();
		e.recovery && e.snapshot && e.phase === "ready" && (t.set({
			...e,
			draft: e.recovery.body,
			base: e.recovery.base,
			dirty: !0,
			recovery: void 0,
			save: e.recovery.base === e.snapshot.note.revision ? "idle" : "conflict",
			message: "Draft recovered. Review it before saving."
		}), _());
	}
	function ne(e) {
		let n = m();
		n.snapshot && n.phase === "ready" && (t.set({
			...n,
			draft: e ? n.snapshot.note.body : n.draft,
			base: n.snapshot.note.revision,
			dirty: !e && n.draft !== n.snapshot.note.body,
			recovery: void 0,
			save: "idle",
			message: e ? "Loaded the saved note." : "Draft kept against the latest saved revision. Review, then save deliberately."
		}), _());
	}
	async function re() {
		let e = m();
		if (e.phase !== "ready" || !e.dirty || !zi(e.draft) || [
			"conflict",
			"checking-conflict",
			"uncertain"
		].includes(e.save) || a) return;
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
			let e = await x("/api/workspace/note", o, {
				body: c.body,
				base_revision: c.base
			});
			if (f || o.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				y("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				y(S(e.status), !0);
				return;
			}
			if (e.status === 409) t.update((e) => ({
				...e,
				save: "checking-conflict",
				message: "Another save won. Checking the latest saved note before comparing. Your draft is unchanged."
			}));
			else if (e.status === 200) {
				let n = Vi(e.value);
				if (!C(n) || n.note.body !== c.body || BigInt(n.note.revision) !== BigInt(c.base) + 1n) throw Error("Unqualified save result");
				t.update((e) => ({
					...e,
					snapshot: {
						...n,
						crafty: n.crafty ?? e.snapshot?.crafty,
						directory: e.snapshot?.directory ?? n.directory
					},
					base: n.note.revision,
					dirty: e.draft !== n.note.body,
					save: "saved",
					message: e.draft === n.note.body ? "Saved to your account." : "Submitted version saved. Your newer edits are still unsaved."
				})), _();
			} else throw Error("Save outcome unavailable");
		} catch {
			a === o && s === n && !f && t.update((e) => ({
				...e,
				save: "uncertain",
				message: "Save outcome is uncertain. Check the saved note before trying again."
			}));
		} finally {
			a === o && (a = void 0), s === n && !f && (m().save === "checking-conflict" ? await w() : b());
		}
	}
	async function T(e, r) {
		let a = m();
		if (a.phase !== "ready" || !a.snapshot || o || a.directorySave === "uncertain") return !1;
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
			let i = await x(e, s, r);
			if (f || s.signal.aborted || c !== n) return !1;
			if (document.visibilityState !== "visible") return y("Workspace hidden. Checking access on return."), !1;
			if ([
				401,
				403,
				426
			].includes(i.status)) return y(S(i.status), !0), !1;
			if (i.status === 200) {
				let e = Vi(i.value);
				return C(e) ? (t.update((t) => ({
					...t,
					snapshot: t.snapshot ? {
						...t.snapshot,
						directory: e.directory
					} : void 0,
					directorySave: "idle",
					directoryMessage: "Saved to your account."
				})), !0) : (y("Your account scope changed. Open a fresh workspace.", !0), !1);
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
			return o === s && c === n && !f && t.update((e) => ({
				...e,
				directorySave: "uncertain",
				directoryMessage: "The save may have completed. Check saved services before making another change."
			})), !1;
		} finally {
			o === s && (o = void 0), c === n && !f && b();
		}
	}
	function ie(e, t) {
		return T("/api/owner/directory", {
			base_revision: e,
			change: t
		});
	}
	function ae(e) {
		let t = m().snapshot?.directory;
		return t ? T("/api/workspace/pins", {
			base_directory_revision: t.revision,
			base_revision: t.pins_revision,
			ids: e
		}) : Promise.resolve(!1);
	}
	async function oe(e = m().activity.category, r = m().activity.query, i = !1) {
		let a = m();
		if (f || p || a.phase !== "ready" || !a.snapshot || document.visibilityState !== "visible") return;
		s?.abort();
		let o = new AbortController();
		s = o;
		let l = ++c, u = n, d = a.activity, h = new URLSearchParams({
			category: e,
			q: r
		});
		if (i) {
			if (!d.next || d.category !== e || d.query !== r) return;
			h.set("through", d.through), h.set("before", d.next);
		}
		t.update((t) => ({
			...t,
			activity: {
				...Ii(),
				phase: "loading",
				category: e,
				query: r,
				message: "Checking your retained activity…"
			}
		}));
		try {
			let s = await x(`/api/workspace/activity?${h}`, o);
			if (f || o.signal.aborted || l !== c || u !== n) return;
			if (document.visibilityState !== "visible") {
				y("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				y(S(s.status), !0);
				return;
			}
			let p = s.value;
			if (s.status !== 200 || !Ri(p) || p.product !== Ni || p.contract !== Pi || p.schema !== 1 || !Ri(p.account) || p.account.id !== a.snapshot.account.id || p.account.role !== a.snapshot.account.role || p.account.username !== a.snapshot.account.username || p.session_generation !== a.snapshot.session_generation) {
				if (s.status === 200) {
					y("Your account scope changed. Open a fresh workspace.", !0);
					return;
				}
				throw Error("Activity unavailable");
			}
			let m = [
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
			if (p.category !== e || p.q !== r || !$(p.through) || p.next_before !== null && !$(p.next_before, !0) || i && p.through !== d.through || !Array.isArray(p.entries) || p.entries.length > 25 || p.entries.some((e) => !Ri(e) || !$(e.id, !0) || !$(e.revision, !0) || !$(e.occurred_at) || BigInt(e.occurred_at) > 253402300799n || !g.includes(String(e.kind)) || !m.includes(String(e.category)) || typeof e.label != "string" || !/^[A-Za-z ]{1,64}$/.test(e.label) || BigInt(e.id) > BigInt(p.through) || i && BigInt(e.id) >= BigInt(d.next)) || p.entries.some((e, t) => t > 0 && BigInt(e.id) >= BigInt(p.entries[t - 1].id)) || p.next_before !== null && (p.entries.length !== 25 || p.next_before !== p.entries.at(-1)?.id)) throw Error("Invalid activity response");
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
			!f && l === c && u === n && t.update((t) => ({
				...t,
				activity: {
					...Ii(),
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
	function se() {
		g(), y("Signing out…", !0);
		try {
			d?.postMessage({ kind: "auth-changed" });
		} catch {}
	}
	function ce() {
		let e = () => y("Workspace hidden. Checking access on return."), n = () => {
			w();
		}, r = () => {
			document.visibilityState === "visible" ? n() : e();
		};
		try {
			d = new BroadcastChannel("keida-hub-reborn.account.v1"), d.onmessage = (e) => {
				Ri(e.data) && e.data.kind === "auth-changed" && y("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), w(), () => {
			f = !0, v(), d?.close(), t.set(Li("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
		};
	}
	return {
		model: t,
		start: ce,
		edit: ee,
		recover: te,
		resolve: ne,
		save: re,
		signOut: se,
		check: w,
		editService: ie,
		pins: ae,
		activity: oe
	};
}
// src/Connections.svelte
var Wi = /* @__PURE__ */ q("<section class=\"card small-card\"><h2>No Crafty connection enrolled</h2><p>An owner can add dedicated access and choose which servers to show.</p></section>"), Gi = /* @__PURE__ */ q("<p class=\"notice\" role=\"status\"> </p>"), Ki = /* @__PURE__ */ q("<p class=\"field-help\">This server could not be fully observed.</p>"), qi = /* @__PURE__ */ q("<article class=\"card small-card server-card\"><h2> </h2> <p><strong> </strong> <span class=\"field-help\">Provider-reported process state</span></p> <dl><dt>Players</dt><dd> </dd> <dt>Freshness</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd> <dt>Join address</dt><dd> </dd></dl> <!></article>"), Ji = /* @__PURE__ */ q("<!> <div class=\"server-grid\"></div> <p class=\"field-help\">A running process does not establish game readiness. Join addresses are owner-reviewed; outside-network joining is accepted separately.</p>", 1), Yi = /* @__PURE__ */ q("<button class=\"button secondary\">Check connection state</button>"), Xi = /* @__PURE__ */ q("<button class=\"text-button\" type=\"button\">Remove server</button>"), Zi = /* @__PURE__ */ q("<fieldset><legend> </legend> <label>Crafty server UUID</label><input name=\"server-id\" required=\"\" maxlength=\"36\"/> <label>Display name</label><input name=\"server-name\" required=\"\" maxlength=\"80\"/> <label>Reviewed public join address, optional</label><input name=\"server-join\" maxlength=\"253\" placeholder=\"play.example:25565\"/> <!></fieldset>"), Qi = /* @__PURE__ */ q("<button class=\"text-button\" type=\"button\">Remove connection</button>"), $i = /* @__PURE__ */ q("<section class=\"card connection-setup\" aria-label=\"Dedicated Crafty enrollment\"><h2>Dedicated Crafty access</h2> <p>Create access specifically for Reborn, limited to viewing the selected servers. Credentials are encrypted on the server and are not shown again.</p> <p class=\"workspace-status\" role=\"status\"> </p> <!> <form autocomplete=\"off\"><label for=\"crafty-endpoint\">Crafty HTTPS address</label><input id=\"crafty-endpoint\" name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\" placeholder=\"https://crafty.example/\"/> <label for=\"crafty-token\">Dedicated API token</label><input id=\"crafty-token\" name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label for=\"crafty-timezone\">Crafty’s configured time zone</label><input id=\"crafty-timezone\" name=\"timezone\" required=\"\" maxlength=\"64\" placeholder=\"America/Chicago or UTC\"/> <label for=\"crafty-ca\">Private CA certificate, if needed</label><textarea id=\"crafty-ca\" name=\"ca-pem\" maxlength=\"8192\" rows=\"3\"></textarea> <p class=\"field-help\">Leave the certificate blank for publicly trusted HTTPS. The address and certificate must pass normal hostname and trust checks.</p> <!> <div class=\"button-row\"><button class=\"button secondary\" type=\"button\">Add server</button> <button class=\"button primary\" type=\"submit\"> </button></div></form> <!></section>"), ea = /* @__PURE__ */ q("<button class=\"text-button\">View connection enrollment history</button> <div class=\"connections-intro\"><p>Server observations from your deliberately enrolled Crafty connection.</p><span class=\"quiet-label\">Read-only overview</span></div> <!> <!>", 1);
function ta(e, t) {
	Ue(t, !1);
	let n = Q(t, "binding", 8), r = Q(t, "history", 8), i = Q(t, "overview", 8), a = Q(t, "owner", 8, !1), o = Q(t, "active", 8, !1), s = Q(t, "refresh", 8), c = /* @__PURE__ */ P(), l = /* @__PURE__ */ P([0]), u = /* @__PURE__ */ P(0), d = /* @__PURE__ */ P(), f = /* @__PURE__ */ P(""), p = /* @__PURE__ */ P(!1), m = 0, h = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
	function g() {
		++m, U(d)?.abort(), F(d, void 0), U(c)?.reset(), F(l, [Kt(u)]), F(f, ""), F(p, !1);
	}
	ji(g);
	async function _(e = !1) {
		if (!o() || !a() || U(d) || !i() || U(p)) return;
		let t = i().revision, r = U(c) ? new FormData(U(c)) : void 0, h = (e) => r?.getAll(e).map(String) ?? [], g = h("server-id"), _ = h("server-name"), v = h("server-join"), y = e ? null : {
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
		U(c)?.reset(), F(l, [Kt(u)]);
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
			clearTimeout(S), U(d) === b && F(d, void 0);
		}
	}
	async function v() {
		await s()(), o() && (F(p, !1), F(f, "Review the current connection state before making another change."));
	}
	wn(() => G(o()), () => {
		o() || g();
	}), Tn(), yi();
	var y = ea(), b = sn(y), x = R(b, 4), S = (e) => {
		J(e, Wi());
	}, C = (e) => {
		var t = Ji(), n = sn(t), r = (e) => {
			var t = Gi(), n = L(t, !0);
			z(() => Y(n, (G(i()), W(() => i().error === "checking" ? "Checking the provider. Fresh results will appear on the next observation." : "Provider observations are unavailable or incomplete. Unknown player counts stay unknown.")))), J(e, t);
		};
		X(n, (e) => {
			G(i()), W(() => i().error) && e(r);
		});
		var a = R(n, 2);
		Ur(a, 5, () => (G(i()), W(() => i().servers)), zr, (e, t) => {
			var n = qi(), r = I(n), i = L(r, !0), a = R(r, 2), o = L(I(a), !0);
			Se(2), A(a);
			var s = R(a, 2), c = R(I(s)), l = L(c), u = R(c, 3), d = L(u, !0), f = R(u, 3), p = L(f, !0), m = R(f, 2), g = L(m, !0), _ = L(R(m, 3), !0);
			A(s);
			var v = R(s, 2), y = (e) => {
				J(e, Ki());
			};
			X(v, (e) => {
				U(t), W(() => U(t).error) && e(y);
			}), A(n), z((e, n) => {
				Y(i, (U(t), W(() => U(t).name))), Y(o, (U(t), W(() => U(t).state === "running" ? "Running" : U(t).state === "stopped" ? "Stopped" : "Unknown"))), Y(l, `${U(t), W(() => U(t).players === null ? "Not reported" : `${U(t).players} reported`) ?? ""}${U(t), W(() => U(t).capacity === null ? "" : ` / ${U(t).capacity} capacity`) ?? ""}`), Y(d, (U(t), W(() => U(t).freshness === "fresh" ? "Recent provider sample" : U(t).freshness === "stale" ? "Stale provider sample" : "Provider sample age unknown"))), Y(p, e), Y(g, n), Y(_, (U(t), W(() => U(t).join || "Not configured")));
			}, [() => (U(t), W(() => h(U(t).collected_at))), () => (U(t), W(() => h(U(t).provider_at)))]), J(e, n);
		}), A(a), Se(2), J(e, t);
	};
	X(x, (e) => {
		G(i()), W(() => !i() || !i().configured) ? e(S) : e(C, -1);
	});
	var w = R(x, 2), ee = (e) => {
		var t = $i(), n = R(I(t), 4), r = L(n, !0), a = R(n, 2), o = (e) => {
			var t = Yi();
			K("click", t, () => void v()), J(e, t);
		};
		X(a, (e) => {
			U(p) && e(o);
		});
		var s = R(a, 2), m = R(I(s)), h = R(m, 3), g = R(h, 3), y = R(g, 3), b = R(y, 4);
		Ur(b, 3, () => U(l), (e) => e, (e, t, n) => {
			var r = Zi(), i = I(r), a = L(i), o = R(i, 2), s = R(o), c = R(s, 2), u = R(c), f = R(u, 2), m = R(f), h = R(m, 2), g = (e) => {
				var n = Xi();
				z(() => n.disabled = !!U(d) || U(p)), K("click", n, () => F(l, U(l).filter((e) => e !== U(t)))), J(e, n);
			};
			X(h, (e) => {
				U(l), W(() => U(l).length > 1) && e(g);
			}), A(r), z(() => {
				Y(a, `Server ${U(n) + 1}`), Z(o, "for", `crafty-id-${U(t)}`), Z(s, "id", `crafty-id-${U(t)}`), s.disabled = !!U(d) || U(p), Z(c, "for", `crafty-name-${U(t)}`), Z(u, "id", `crafty-name-${U(t)}`), u.disabled = !!U(d) || U(p), Z(f, "for", `crafty-join-${U(t)}`), Z(m, "id", `crafty-join-${U(t)}`), m.disabled = !!U(d) || U(p);
			}), J(e, r);
		});
		var x = R(b, 2), S = I(x), C = R(S, 2), w = L(C, !0);
		A(x), A(s), vi(s, (e) => F(c, e), () => U(c));
		var ee = R(s, 2), te = (e) => {
			var t = Qi();
			z(() => t.disabled = !!U(d) || U(p)), K("click", t, () => void _(!0)), J(e, t);
		};
		X(ee, (e) => {
			G(i()), W(() => i()?.configured) && e(te);
		}), A(t), z(() => {
			Y(r, U(f)), m.disabled = !!U(d) || U(p), h.disabled = !!U(d) || U(p), g.disabled = !!U(d) || U(p), y.disabled = !!U(d) || U(p), S.disabled = (U(l), U(d), U(p), W(() => U(l).length >= 8 || !!U(d) || U(p))), C.disabled = !!U(d) || U(p) || !i(), Y(w, U(d) ? "Working…" : "Save dedicated connection");
		}), br("submit", s, (e) => {
			e.preventDefault(), _();
		}), K("click", S, () => F(l, [...U(l), Kt(u)])), J(e, t);
	};
	X(w, (e) => {
		a() && o() && e(ee);
	}), K("click", b, function(...e) {
		r()?.apply(this, e);
	}), J(e, y), We();
}
xr(["click"]);
// src/Directory.svelte
var na = /* @__PURE__ */ q("<button class=\"text-button\">Browse services <span aria-hidden=\"true\">→</span></button>"), ra = /* @__PURE__ */ q("<section class=\"notice\"><h3>Review the saved state</h3><p> </p><button class=\"button secondary\">Check saved services</button></section>"), ia = /* @__PURE__ */ q("<option> </option>"), aa = /* @__PURE__ */ q("<div class=\"directory-filters\"><div><label for=\"service-search\">Search services</label><input id=\"service-search\" type=\"search\" maxlength=\"120\" placeholder=\"Name, category or description\"/></div><div><label for=\"service-filter\">Category</label><select id=\"service-filter\"><option>All categories</option><!></select></div></div>"), oa = /* @__PURE__ */ q("<section class=\"card small-card\"><h3> </h3><p> </p></section>"), sa = /* @__PURE__ */ q("<p> </p>"), ca = /* @__PURE__ */ q("<button class=\"text-button move-up\">↑</button><button class=\"text-button move-down\">↓</button>", 1), la = /* @__PURE__ */ q("<p>The directory changed. Review the service and choose Remove again.</p>"), ua = /* @__PURE__ */ q("<div class=\"notice\"><p> </p><!><div class=\"button-row\"><button class=\"button secondary confirm-remove\">Remove service</button><button class=\"text-button\">Keep service</button></div></div>"), da = /* @__PURE__ */ q("<div class=\"button-row\"><button class=\"text-button edit-service\"> </button><button class=\"text-button remove-service\">Remove</button></div> <!>", 1), fa = /* @__PURE__ */ q("<article class=\"card small-card service-card\"><p class=\"eyebrow\"> </p><h3><a class=\"service-link\" target=\"_blank\" rel=\"noopener noreferrer\"> <span class=\"sr-only\">(opens in a new tab)</span> <span aria-hidden=\"true\">↗</span></a></h3> <!> <p class=\"field-help service-address\"> </p> <div class=\"button-row\"><button class=\"button secondary pin-service\"> </button> <!></div> <!></article>"), pa = /* @__PURE__ */ q("<div class=\"directory-grid\"></div>"), ma = /* @__PURE__ */ q("<p class=\"field-help\">Up to 24 personal pins. Links open the selected service in a new tab. Each service handles its own sign-in; directory links do not check availability.</p>"), ha = /* @__PURE__ */ q("<div class=\"notice\"><p>The directory changed after this form was opened. Review the current entries, then choose whether to keep this edit.</p><button class=\"button secondary\" type=\"button\">Keep edit against current directory</button></div>"), ga = /* @__PURE__ */ q("<section class=\"card directory-editor\" aria-label=\"Service editor\"><h2> </h2><p>Add a reviewed HTTPS link without passwords, tokens, query parameters or fragments. These links are visible to signed-in accounts.</p> <form><label for=\"service-name\">Service name</label><input id=\"service-name\" name=\"service-name\" required=\"\" maxlength=\"80\"/> <label for=\"service-category\">Category</label><input id=\"service-category\" name=\"service-category\" required=\"\" maxlength=\"40\"/> <label for=\"service-url\">HTTPS link</label><input id=\"service-url\" name=\"service-url\" type=\"url\" required=\"\" maxlength=\"1024\" placeholder=\"https://service.example/\"/> <label for=\"service-description\">Description, optional</label><textarea id=\"service-description\" name=\"service-description\" maxlength=\"240\" rows=\"2\"></textarea> <!> <div class=\"button-row\"><button class=\"button primary\" type=\"submit\"> </button><button class=\"text-button\" type=\"button\"> </button></div></form></section>"), _a = /* @__PURE__ */ q("<div class=\"directory-heading\"><div><p class=\"eyebrow\"> </p><h2> </h2></div><!></div> <p class=\"directory-status\" role=\"status\"> </p> <!> <!> <!> <!> <!>", 1);
function va(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = Q(t, "directory", 8), o = Q(t, "authorized", 8, !1), s = Q(t, "owner", 8, !1), c = Q(t, "compact", 8, !1), l = Q(t, "state", 8), u = Q(t, "message", 8), d = Q(t, "browse", 8), f = Q(t, "check", 8), p = Q(t, "edit", 8), m = Q(t, "pin", 8), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P(""), _ = /* @__PURE__ */ P(""), v = /* @__PURE__ */ P(""), y = /* @__PURE__ */ P(""), b = /* @__PURE__ */ P(""), x = /* @__PURE__ */ P(""), S = /* @__PURE__ */ P(), C = /* @__PURE__ */ P(), w = 0;
	function ee() {
		++w, F(h, ""), F(g, ""), F(_, ""), F(v, ""), F(y, ""), F(b, ""), F(x, ""), F(C, void 0), F(S, void 0);
	}
	ji(ee);
	function te() {
		F(_, ""), F(v, ""), F(y, ""), F(b, ""), F(x, ""), F(C, void 0), F(S, a()?.revision);
	}
	function ne(e) {
		F(x, e.id), F(_, e.name), F(v, e.description), F(y, e.url), F(b, e.category), F(S, a()?.revision), F(C, void 0), document.querySelector("#service-name")?.focus();
	}
	async function re() {
		if (U(n) || !s() || U(S) === void 0) return;
		let e = w, t = {
			action: U(x) ? "update" : "create",
			...U(x) ? { id: U(x) } : {},
			link: {
				name: U(_),
				category: U(b),
				description: U(v),
				url: U(y)
			}
		};
		await p()(U(S), t) && o() && e === w && (await ur(), o() && e === w && te());
	}
	function T(e) {
		!U(n) && a() && m()(a().pins.includes(e) ? a().pins.filter((t) => t !== e) : [...a().pins, e]);
	}
	function ie(e, t) {
		if (U(n) || !a()) return;
		let r = [...a().pins], i = r.indexOf(e), o = i + t;
		i < 0 || o < 0 || o >= r.length || ([r[i], r[o]] = [r[o], r[i]], m()(r));
	}
	async function ae(e) {
		if (U(n) || !a() || !s() || U(C)?.id !== e) return;
		let t = w;
		await p()(U(C).base, {
			action: "delete",
			id: e
		}) && o() && t === w && (await ur(), o() && t === w && (F(C, void 0), U(x) === e && te()));
	}
	wn(() => (G(l()), G(o())), () => {
		F(n, l() === "saving" || l() === "uncertain" || !o());
	}), wn(() => G(a()), () => {
		F(r, [...new Set(a()?.services.map((e) => e.category) ?? [])].sort());
	}), wn(() => (U(g), U(r)), () => {
		U(g) && !U(r).includes(U(g)) && F(g, "");
	}), wn(() => (G(a()), G(c()), U(g), U(h)), () => {
		F(i, [...a()?.services ?? []].sort((e, t) => {
			let n = a()?.pins.indexOf(e.id) ?? -1, r = a()?.pins.indexOf(t.id) ?? -1;
			return n >= 0 || r >= 0 ? (n < 0 ? 25 : n) - (r < 0 ? 25 : r) : e.name.localeCompare(t.name) || Number(BigInt(e.id) - BigInt(t.id));
		}).filter((e) => c() ? a()?.pins.includes(e.id) : (!U(g) || e.category === U(g)) && `${e.name} ${e.category} ${e.description}`.toLocaleLowerCase().includes(U(h).toLocaleLowerCase())));
	}), wn(() => G(o()), () => {
		o() || ee();
	}), wn(() => (G(o()), G(a()), U(S)), () => {
		o() && a() && U(S) === void 0 && F(S, a().revision);
	}), Tn(), yi();
	var oe = _a(), se = sn(oe), ce = I(se), le = I(ce), ue = L(le, !0), de = L(R(le), !0);
	A(ce);
	var fe = R(ce), pe = (e) => {
		var t = na();
		K("click", t, function(...e) {
			d()?.apply(this, e);
		}), J(e, t);
	};
	X(fe, (e) => {
		c() && e(pe);
	}), A(se);
	var me = R(se, 2), E = L(me, !0), he = R(me, 2), ge = (e) => {
		var t = ra(), n = R(I(t)), r = L(n, !0), i = R(n);
		A(t), z(() => Y(r, l() === "uncertain" ? "Your change has not been sent again." : "Your edit is still in the form. Compare it with the current directory before saving.")), K("click", i, () => void f()()), J(e, t);
	};
	X(he, (e) => {
		(l() === "uncertain" || l() === "conflict") && e(ge);
	});
	var _e = R(he, 2), ve = (e) => {
		var t = aa(), n = I(t), i = R(I(n));
		li(i), A(n);
		var a = R(n), o = R(I(a)), s = I(o);
		s.value = s.__value = "", Ur(R(s), 1, () => U(r), zr, (e, t) => {
			var n = ia(), r = L(n, !0), i = {};
			z(() => {
				Y(r, U(t)), i !== (i = U(t)) && (n.value = (n.__value = i) ?? "");
			}), J(e, n);
		}), A(o), ti(o), A(a), A(t), mi(i, () => U(h), (e) => F(h, e)), ni(o, () => U(g), (e) => F(g, e)), J(e, t);
	};
	X(_e, (e) => {
		c() || e(ve);
	});
	var ye = R(_e, 2), D = (e) => {
		var t = oa(), n = I(t), r = L(n, !0), i = L(R(n), !0);
		A(t), z(() => {
			Y(r, (G(c()), G(a()), W(() => c() ? "Keep your favorites close" : a()?.services.length ? "No matching services" : "Your directory starts here"))), Y(i, (G(c()), G(a()), G(s()), W(() => c() ? "Pin services from the directory to show them on Home." : a()?.services.length ? "Try another search or category." : s() ? "Add a service below to make it available to signed-in accounts." : "An owner can add reviewed service links.")));
		}), J(e, t);
	}, be = (e) => {
		var t = pa();
		Ur(t, 5, () => U(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ pt(() => (G(a()), U(t), W(() => a()?.pins.includes(U(t).id) ?? !1))), i = /* @__PURE__ */ pt(() => (G(a()), U(t), W(() => a()?.pins.indexOf(U(t).id) ?? -1)));
			var o = fa(), l = I(o), u = L(l, !0), d = R(l), f = I(d), p = I(f, !0);
			Se(3), A(f), A(d);
			var m = R(d, 2), h = (e) => {
				var n = sa(), r = L(n, !0);
				z(() => Y(r, (U(t), W(() => U(t).description)))), J(e, n);
			};
			X(m, (e) => {
				U(t), W(() => U(t).description) && e(h);
			});
			var g = R(m, 2), _ = L(g, !0), v = R(g, 2), y = I(v), b = L(y, !0), x = R(y, 2), S = (e) => {
				var r = ca(), o = sn(r), s = R(o);
				z(() => {
					Z(o, "aria-label", (U(t), W(() => `Move ${U(t).name} up`))), o.disabled = U(n) || U(i) === 0, Z(s, "aria-label", (U(t), W(() => `Move ${U(t).name} down`))), s.disabled = (U(n), G(U(i)), G(a()), W(() => U(n) || U(i) === (a()?.pins.length ?? 0) - 1));
				}), K("click", o, () => ie(U(t).id, -1)), K("click", s, () => ie(U(t).id, 1)), J(e, r);
			};
			X(x, (e) => {
				U(r) && e(S);
			}), A(v);
			var w = R(v, 2), ee = (e) => {
				var r = da(), i = sn(r), o = I(i), s = L(o), c = R(o);
				A(i);
				var l = R(i, 2), u = (e) => {
					var r = ua(), i = I(r), o = L(i), s = R(i), c = (e) => {
						J(e, la());
					};
					X(s, (e) => {
						U(C), G(a()), W(() => U(C).base !== a()?.revision) && e(c);
					});
					var l = R(s), u = I(l), d = R(u);
					A(l), A(r), z(() => {
						Y(o, `Remove ${U(C), W(() => U(C).name) ?? ""} from the directory and everyone’s pins?`), u.disabled = (U(n), U(C), G(a()), W(() => U(n) || U(C).base !== a()?.revision));
					}), K("click", u, () => void ae(U(t).id)), K("click", d, () => F(C, void 0)), J(e, r);
				};
				X(l, (e) => {
					U(C), U(t), W(() => U(C)?.id === U(t).id) && e(u);
				}), z(() => {
					o.disabled = U(n), Y(s, `Edit ${U(t), W(() => U(t).name) ?? ""}`), c.disabled = U(n);
				}), K("click", o, () => ne(U(t))), K("click", c, () => F(C, a() ? {
					id: U(t).id,
					base: a().revision,
					name: U(t).name
				} : void 0)), J(e, r);
			};
			X(w, (e) => {
				s() && !c() && e(ee);
			}), A(o), z(() => {
				Z(o, "data-service-id", (U(t), W(() => U(t).id))), Y(u, (U(t), W(() => U(t).category))), Z(f, "href", (U(t), W(() => U(t).url))), Y(p, (U(t), W(() => U(t).name))), Y(_, (U(t), W(() => U(t).url))), Z(y, "aria-pressed", U(r)), Z(y, "aria-label", (G(U(r)), U(t), W(() => `${U(r) ? "Unpin" : "Pin"} ${U(t).name}`))), y.disabled = (U(n), G(U(r)), G(a()), W(() => U(n) || !U(r) && (a()?.pins.length ?? 0) >= 24)), Y(b, U(r) ? "Pinned" : "Pin to Home");
			}), K("click", y, () => T(U(t).id)), J(e, o);
		}), A(t), J(e, t);
	};
	X(ye, (e) => {
		U(i), W(() => U(i).length === 0) ? e(D) : e(be, -1);
	});
	var O = R(ye, 2), k = (e) => {
		J(e, ma());
	};
	X(O, (e) => {
		c() || e(k);
	});
	var xe = R(O, 2), Ce = (e) => {
		var t = ga(), r = I(t), i = L(r, !0), o = R(r, 3), s = R(I(o));
		li(s);
		var u = R(s, 3);
		li(u);
		var d = R(u, 3);
		li(d);
		var f = R(d, 3);
		et(f);
		var p = R(f, 2), m = (e) => {
			var t = ha(), r = R(I(t));
			A(t), z(() => r.disabled = U(n)), K("click", r, () => F(S, a()?.revision)), J(e, t);
		};
		X(p, (e) => {
			U(S), G(a()), W(() => U(S) !== void 0 && a() && U(S) !== a().revision) && e(m);
		});
		var h = R(p, 2), g = I(h), C = L(g, !0), w = R(g), ee = L(w, !0);
		A(h), A(o), A(t), z(() => {
			Z(t, "hidden", c()), Y(i, U(x) ? "Edit service" : "Add a service"), s.disabled = U(n), u.disabled = U(n), d.disabled = U(n), f.disabled = U(n), g.disabled = (U(n), U(S), G(a()), W(() => U(n) || U(S) !== a()?.revision)), Y(C, l() === "saving" ? "Saving…" : U(x) ? "Save service" : "Add service"), w.disabled = U(n), Y(ee, U(x) ? "Cancel edit" : "Clear form");
		}), br("submit", o, (e) => {
			e.preventDefault(), re();
		}), mi(s, () => U(_), (e) => F(_, e)), mi(u, () => U(b), (e) => F(b, e)), mi(d, () => U(y), (e) => F(y, e)), mi(f, () => U(v), (e) => F(v, e)), K("click", w, te), J(e, t);
	};
	X(xe, (e) => {
		s() && o() && e(Ce);
	}), z(() => {
		Y(ue, c() ? "YOUR SHORTCUTS" : "A PLACE FOR YOUR SERVICES"), Y(de, c() ? "Pinned services" : "Service directory"), Y(E, u());
	}), J(e, oe), We();
}
xr(["click"]);
// src/Activity.svelte
var ya = /* @__PURE__ */ q("<p class=\"activity-empty\">No matching activity in this window. Try another action name or check the newest entries.</p>"), ba = /* @__PURE__ */ q("<li><div><strong> </strong><p> </p></div><time> </time></li>"), xa = /* @__PURE__ */ q("<!> <ol class=\"activity-list\"></ol> <div class=\"button-row\"><button class=\"button secondary\">Check newest activity</button><button class=\"button secondary\">Older activity</button></div> <p class=\"field-help\">Up to 25 entries per page. New changes appear when you check newest; older pages stay within the current history window. Search matches action names, not note or credential contents.</p>", 1), Sa = /* @__PURE__ */ q("<button class=\"button secondary\">Retry activity</button>"), Ca = /* @__PURE__ */ q("<button class=\"button secondary\">Check activity</button>"), wa = /* @__PURE__ */ q("<section class=\"card activity-card\" aria-label=\"Your retained activity\"><h2>Your activity</h2> <p>Successful changes made by your account, retained from the introduction of Activity. Connection entries describe enrollment changes, not game actions or provider uptime.</p> <form class=\"activity-search\"><div><label for=\"activity-query\">Search action names</label><input id=\"activity-query\" maxlength=\"80\" placeholder=\"For example, saved or Crafty\"/></div> <div><label for=\"activity-category\">Activity category</label><select id=\"activity-category\"><option>All activity</option><option>Workspace notes</option><option>Services and pins</option><option>Connection enrollment</option></select></div> <button type=\"submit\" class=\"button primary\">Search activity</button></form> <p class=\"workspace-status\" role=\"status\"> </p> <!></section>");
function Ta(e, t) {
	Ue(t, !1);
	let n = Q(t, "state", 8), r = Q(t, "authorized", 8, !1), i = Q(t, "load", 8), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P("all"), s = /* @__PURE__ */ P(), c = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	wn(() => G(r()), () => {
		r() || (F(a, ""), F(o, "all"), F(s, void 0));
	}), wn(() => (G(n()), U(s)), () => {
		n() !== U(s) && n().phase === "loading" && (F(s, n()), F(a, n().query), F(o, n().category));
	}), Tn(), yi();
	var l = wa(), u = R(I(l), 4), d = I(u), f = R(I(d));
	li(f), A(d);
	var p = R(d, 2), m = R(I(p)), h = I(m);
	h.value = h.__value = "all";
	var g = R(h);
	g.value = g.__value = "workspace";
	var _ = R(g);
	_.value = _.__value = "directory";
	var v = R(_);
	v.value = v.__value = "connections", A(m), ti(m), A(p);
	var y = R(p, 2);
	A(u);
	var b = R(u, 2), x = L(b, !0), S = R(b, 2), C = (e) => {
		var t = xa(), r = sn(t), a = (e) => {
			J(e, ya());
		};
		X(r, (e) => {
			G(n()), W(() => n().entries.length === 0) && e(a);
		});
		var o = R(r, 2);
		Ur(o, 5, () => (G(n()), W(() => n().entries)), (e) => e.id, (e, t) => {
			var n = ba(), r = I(n), i = I(r), a = L(i, !0), o = L(R(i));
			A(r);
			var s = R(r), l = L(s, !0);
			A(n), z((e, r) => {
				Z(n, "data-activity-id", (U(t), W(() => U(t).id))), Y(a, (U(t), W(() => U(t).label))), Y(o, `Revision ${U(t), W(() => U(t).revision) ?? ""} · ${U(t), W(() => U(t).category === "connections" ? "Connection enrollment" : U(t).category === "directory" ? "Services and pins" : "Workspace note") ?? ""}`), Z(s, "datetime", e), Y(l, r);
			}, [() => (U(t), W(() => (/* @__PURE__ */ new Date(Number(U(t).occurred_at) * 1e3)).toISOString())), () => (U(t), W(() => c(U(t).occurred_at)))]), J(e, n);
		}), A(o);
		var s = R(o, 2), l = I(s), u = R(l);
		A(s), Se(2), z(() => u.disabled = (G(n()), W(() => !n().next))), K("click", l, () => void i()(n().category, n().query)), K("click", u, () => void i()(n().category, n().query, !0)), J(e, t);
	}, w = (e) => {
		var t = Sa();
		K("click", t, () => void i()(n().category, n().query)), J(e, t);
	}, ee = (e) => {
		var t = Ca();
		z(() => t.disabled = !r()), K("click", t, () => void i()(U(o), U(a))), J(e, t);
	};
	X(S, (e) => {
		G(n()), W(() => n().phase === "ready") ? e(C) : (G(n()), W(() => n().phase === "error") ? e(w, 1) : (G(n()), W(() => n().phase === "idle") && e(ee, 2)));
	}), A(l), z(() => {
		f.disabled = !r(), m.disabled = !r(), y.disabled = !r(), Y(x, (G(n()), W(() => n().message)));
	}), br("submit", u, (e) => {
		e.preventDefault(), i()(U(o), U(a));
	}), mi(f, () => U(a), (e) => F(a, e)), ni(m, () => U(o), (e) => F(o, e)), J(e, l), We();
}
xr(["click"]);
// src/App.svelte
var Ea = /* @__PURE__ */ q("<a rel=\"noreferrer\"> </a>"), Da = /* @__PURE__ */ q("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), Oa = /* @__PURE__ */ q("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), ka = /* @__PURE__ */ q("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), Aa = /* @__PURE__ */ q("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), ja = /* @__PURE__ */ q("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), Ma = /* @__PURE__ */ q("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), Na = /* @__PURE__ */ q("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span aria-hidden=\"true\"></span></button> <button><span aria-hidden=\"true\">◇</span>Connections</button> <button><span aria-hidden=\"true\">▦</span>Services</button> <button><span aria-hidden=\"true\">◷</span>Activity</button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <form method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary> <dl><dt>Source</dt><dd><!></dd><dt>Tree</dt><dd> </dd><dt>Channel</dt><dd> </dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\" aria-label=\"Home\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-grid\"><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button></section><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p> </p><button class=\"text-button\">View connections <span aria-hidden=\"true\">→</span></button></section></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <section aria-label=\"Connections\"><!></section> <section aria-label=\"Services\"><!></section> <section aria-label=\"Activity\"><!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function Pa(e, t) {
	Ue(t, !1);
	let n = () => Di(l, "$model", r), [r, i] = Oi(), a = /* @__PURE__ */ P(), o = /* @__PURE__ */ P(), s = Q(t, "binding", 8), c = Ui(s()), l = c.model, u = /* @__PURE__ */ P("home"), d = /* @__PURE__ */ P(), f = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", p = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified", m = document.querySelector("meta[name=\"reborn-tree\"]")?.content ?? "unqualified", h = document.querySelector("meta[name=\"reborn-channel\"]")?.content ?? "development";
	function g(e) {
		F(u, e), U(d)?.focus(), e === "activity" && c.activity();
	}
	Ai(c.start), wn(() => n(), () => {
		F(a, new TextEncoder().encode(n().draft).length);
	}), wn(() => (n(), U(a)), () => {
		F(o, n().phase === "ready" && n().dirty && U(a) <= 4096 && ![
			"saving",
			"checking-conflict",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), Tn(), yi();
	var _ = Na(), v = R(sn(_), 2), y = I(v), b = R(I(y), 4), x = I(b);
	let S;
	var C = R(x, 2);
	let w;
	var ee = R(I(C), 2);
	let te;
	A(C);
	var ne = R(C, 2);
	let re;
	var T = R(ne, 2);
	let ie;
	var ae = R(T, 2);
	let oe;
	A(b);
	var se = R(b, 2), ce = I(se), le = R(I(ce)), ue = I(le), de = L(ue, !0), fe = L(R(ue), !0);
	A(le), A(ce);
	var pe = R(ce, 2), me = R(R(I(pe), 2), 2);
	li(me), Se(2), A(pe);
	var E = R(pe, 2), he = I(E), ge = I(he, !0);
	Se(), A(he);
	var _e = R(he, 2), ve = R(I(_e)), ye = I(ve), D = (e) => {
		var t = Ea(), n = L(t, !0);
		z(() => {
			Z(t, "href", `https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${p}`), Y(n, p);
		}), J(e, t);
	}, be = /* @__PURE__ */ ft(() => W(() => /^[a-f0-9]{40}$/.test(p))), O = (e) => {
		var t = kr();
		z(() => Y(t, p)), J(e, t);
	};
	X(ye, (e) => {
		U(be) ? e(D) : e(O, -1);
	}), A(ve);
	var k = R(ve, 2), xe = L(k, !0), Ce = L(R(k, 2), !0);
	Se(2), A(_e), A(E), A(se), A(y);
	var we = R(y, 2), Te = I(we), Ee = I(Te), De = R(I(Ee)), Oe = L(De, !0);
	vi(De, (e) => F(d, e), () => U(d)), A(Ee);
	var ke = R(Ee), Ae = R(I(ke), 1, !0);
	A(ke), A(Te);
	var je = R(Te, 2), Me = L(je, !0), Ne = R(je, 2), Pe = (e) => {
		J(e, Da());
	};
	X(Ne, (e) => {
		n(), W(() => n().phase !== "ready") && e(Pe);
	});
	var Fe = R(Ne, 2), Ie = I(Fe), Le = I(Ie), Re = R(I(Le), 3);
	A(Le), Se(), A(Ie);
	var ze = R(Ie, 2), Be = I(ze), Ve = R(I(Be), 2), j = L(Ve, !0), He = R(Ve);
	A(Be);
	var Ge = R(Be), Ke = R(I(Ge), 2), qe = L(Ke, !0), Je = R(Ke);
	A(Ge), A(ze), A(Fe);
	var Ye = R(Fe, 2), Xe = I(Ye), Ze = L(R(I(Xe)), !0);
	A(Xe);
	var M = R(Xe, 2), Qe = (e) => {
		var t = Oa(), n = R(I(t), 2), r = I(n), i = R(r);
		A(n), A(t), K("click", r, function(...e) {
			c.recover?.apply(this, e);
		}), K("click", i, () => c.resolve(!0)), J(e, t);
	};
	X(M, (e) => {
		n(), W(() => n().recovery) && e(Qe);
	});
	var $e = R(M, 2), tt = R(I($e), 2);
	et(tt);
	var nt = R(tt, 4), rt = I(nt);
	let it;
	var at = L(rt), ot = R(rt), st = L(ot, !0);
	A(nt), A($e);
	var ct = R($e, 2), lt = (e) => {
		J(e, ka());
	};
	X(ct, (e) => {
		n(), W(() => n().storageLimited) && e(lt);
	});
	var ut = R(ct, 2), dt = (e) => {
		J(e, Aa());
	};
	X(ut, (e) => {
		U(a) > 4096 && e(dt);
	});
	var mt = R(ut, 2), ht = (e) => {
		var t = ja(), r = R(I(t), 2), i = L(r, !0), a = R(r), o = I(a), s = R(o);
		A(a), A(t), z(() => Y(i, (n(), W(() => n().snapshot?.note.body)))), K("click", o, () => c.resolve(!1)), K("click", s, () => c.resolve(!0)), J(e, t);
	};
	X(mt, (e) => {
		n(), W(() => n().save === "conflict") && e(ht);
	});
	var gt = R(mt, 2), _t = (e) => {
		var t = Ma(), n = R(I(t), 2);
		A(t), K("click", n, () => c.check()), J(e, t);
	};
	X(gt, (e) => {
		n(), W(() => n().save === "uncertain") && e(_t);
	}), A(Ye);
	var vt = R(Ye, 2), yt = I(vt);
	{
		let e = /* @__PURE__ */ pt(() => (n(), W(() => n().snapshot?.crafty))), t = /* @__PURE__ */ pt(() => (n(), W(() => n().snapshot?.account.role === "owner"))), r = /* @__PURE__ */ pt(() => (U(u), n(), W(() => U(u) === "connections" && n().phase === "ready")));
		ta(yt, {
			history: () => {
				F(u, "activity"), U(d)?.focus(), c.activity("connections", "");
			},
			get binding() {
				return s();
			},
			get overview() {
				return U(e);
			},
			get owner() {
				return U(t);
			},
			get active() {
				return U(r);
			},
			get refresh() {
				return W(() => c.check);
			}
		});
	}
	A(vt);
	var N = R(vt, 2), bt = I(N);
	{
		let e = /* @__PURE__ */ pt(() => (n(), W(() => n().snapshot?.directory))), t = /* @__PURE__ */ pt(() => (n(), W(() => n().phase === "ready"))), r = /* @__PURE__ */ pt(() => (n(), W(() => n().snapshot?.account.role === "owner"))), i = /* @__PURE__ */ pt(() => U(u) === "home");
		va(bt, {
			get directory() {
				return U(e);
			},
			get authorized() {
				return U(t);
			},
			get owner() {
				return U(r);
			},
			get compact() {
				return U(i);
			},
			get state() {
				return n(), W(() => n().directorySave);
			},
			get message() {
				return n(), W(() => n().directoryMessage);
			},
			browse: () => g("directory"),
			get check() {
				return W(() => c.check);
			},
			get edit() {
				return W(() => c.editService);
			},
			get pin() {
				return W(() => c.pins);
			}
		});
	}
	A(N);
	var xt = R(N, 2), St = I(xt);
	{
		let e = /* @__PURE__ */ pt(() => (n(), W(() => n().phase === "ready")));
		Ta(St, {
			get state() {
				return n(), W(() => n().activity);
			},
			get authorized() {
				return U(e);
			},
			get load() {
				return W(() => c.activity);
			}
		});
	}
	A(xt), Se(2), A(we), A(v), z(() => {
		Z(x, "aria-current", U(u) === "home" ? "page" : void 0), S = Zr(x, 1, "", null, S, { active: U(u) === "home" }), Z(C, "aria-current", U(u) === "note" ? "page" : void 0), w = Zr(C, 1, "", null, w, { active: U(u) === "note" }), te = Zr(ee, 1, "draft-dot", null, te, { visible: n().dirty }), Z(ne, "aria-current", U(u) === "connections" ? "page" : void 0), re = Zr(ne, 1, "", null, re, { active: U(u) === "connections" }), Z(T, "aria-current", U(u) === "directory" ? "page" : void 0), ie = Zr(T, 1, "", null, ie, { active: U(u) === "directory" }), Z(ae, "aria-current", U(u) === "activity" ? "page" : void 0), oe = Zr(ae, 1, "", null, oe, { active: U(u) === "activity" }), Y(de, (n(), W(() => n().snapshot?.account.username ?? "Your account"))), Y(fe, (n(), W(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), ui(me, s()), Y(ge, f), Y(xe, m), Y(Ce, h), Y(Oe, U(u) === "home" ? "Welcome home." : U(u) === "note" ? "A little space to think." : U(u) === "connections" ? "Your servers, at a glance." : U(u) === "directory" ? "Everything within reach." : "Pick up the thread."), Y(Ae, (n(), W(() => n().phase === "ready" ? "Session checked" : n().phase === "checking" ? "Checking access" : "Access paused"))), Y(Me, (n(), W(() => n().message))), Z(Fe, "hidden", (U(u), n(), W(() => U(u) !== "home" || n().phase !== "ready"))), Y(j, (n(), W(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are."))), Y(qe, (n(), W(() => n().snapshot?.crafty?.configured ? "Your enrolled Crafty observations are available in Connections." : "Enroll dedicated Crafty access to see your selected servers."))), Z(Ye, "hidden", (U(u), n(), W(() => U(u) !== "note" || n().phase !== "ready"))), Y(Ze, (n(), W(() => n().dirty ? "Unsaved changes" : "Up to date"))), ui(tt, (n(), W(() => n().draft))), tt.disabled = (n(), W(() => n().phase !== "ready")), it = Zr(rt, 1, "", null, it, { "over-limit": U(a) > 4096 }), Y(at, `${U(a) ?? ""} / 4096 bytes`), ot.disabled = !U(o), Y(st, (n(), W(() => n().save === "saving" ? "Saving…" : "Save note"))), Z(vt, "hidden", (U(u), n(), W(() => U(u) !== "connections" || n().phase !== "ready"))), Z(N, "hidden", (U(u), n(), W(() => U(u) !== "home" && U(u) !== "directory" || n().phase !== "ready"))), Z(xt, "hidden", (U(u), n(), W(() => U(u) !== "activity" || n().phase !== "ready")));
	}), K("click", x, () => g("home")), K("click", C, () => g("note")), K("click", ne, () => g("connections")), K("click", T, () => g("directory")), K("click", ae, () => g("activity")), br("submit", pe, () => c.signOut()), K("click", Re, () => g("note")), K("click", He, () => g("note")), K("click", Je, () => g("connections")), br("submit", $e, (e) => {
		e.preventDefault(), c.save();
	}), K("input", tt, (e) => c.edit(e.currentTarget.value)), J(e, _), We(), i();
}
xr(["click", "input"]);
// src/main.ts
var Fa = document.getElementById("workspace-root"), Ia = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, La = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
if (Fa && Ia && /^[a-f0-9]{64}$/.test(Ia) && La === "reborn-workspace-v1") {
	let e = Array.from(Fa.childNodes);
	Fa.replaceChildren();
	try {
		Pr(Pa, {
			target: Fa,
			props: { binding: Ia }
		});
	} catch {
		Fa.replaceChildren(...e);
	}
}
