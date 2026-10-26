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
		mt(e), t = ir(e);
	} finally {
		Gn(n);
	}
	return t;
}
function gt(e) {
	var t = ht(e);
	!e.equals(t) && (e.wv = tr(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), bt?.capture(e, t, !0)), e.deps === null)) ? M(e, h) : Vn || (xt === null ? Qe(e) : (_n() || N?.is_fork) && xt.set(e, t));
}
function _t(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && rt(() => {
		t.ac.abort(fe), t.ac = null;
	}), t.fn !== null && (t.teardown = d), sr(t, 0), jn(t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && cr(t);
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
				a ? r.f ^= h : i & 4 ? t.push(r) : nr(r) && (i & 16 && this.#d.add(r), cr(r));
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
			if (!(r.f & 24576) && nr(r) && (Mt = /* @__PURE__ */ new Set(), cr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Pn(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || cr(n);
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
		e.wv = tr(), Ht = null, Ut = 0, Jt(e, g, n), Ht = null, Ke() && H !== null && H.f & 1024 && !(H.f & 96) && (Yn === null ? Xn([e]) : Yn.push(e)), !r.is_fork && Lt.size > 0 && !zt && Gt();
	}
	return t;
}
function Gt() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && M(e, _);
		let t;
		try {
			t = nr(e);
		} catch {
			t = !0;
		}
		t && cr(e);
	}
	Lt.clear();
}
function Kt(e, t = 1) {
	var n = W(e);
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
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Vt(0), u = null, d = $n, f = (e) => {
		if ($n === d) return e();
		var t = V, n = $n;
		Wn(null), er(d);
		var r = e();
		return Wn(t), er(n), r;
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
				var c = W(o);
				return c === E ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = W(i);
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
			return (n !== void 0 || H !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Vt(i ? Yt(e[t]) : E, u)), r.set(t, n)), W(n) === E) ? !1 : i;
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
			W(o);
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
			cr(r);
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
				Gn(n.parent), G(t);
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
			n.f & 1024 && n.deps !== null && M(n, _), nr(n) && cr(n), t.ran = !1;
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
			e(...t.map(W));
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Nn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, jn(e, t && !n), sr(e, 0);
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
var U = null, Jn = 0, Yn = null;
function Xn(e) {
	Yn = e;
}
var Zn = 1, Qn = 0, $n = Qn;
function er(e) {
	$n = e;
}
function tr() {
	return ++Zn;
}
function nr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (nr(a) && gt(a), a.wv > e.wv) return !0;
		}
		t & 512 && xt === null && M(e, h);
	}
	return !1;
}
function rr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Kn !== null && Kn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? rr(a, t, !1) : t === a && (n ? M(a, g) : a.f & 1024 && M(a, _), Pt(a));
	}
}
function ir(e) {
	var t = U, n = Jn, r = Yn, i = V, a = Kn, o = j, s = Un, c = $n, l = e.f;
	U = null, Jn = 0, Yn = null, V = l & 96 ? null : e, Kn = null, He(e.ctx), Un = !1, $n = ++Qn, e.ac !== null && (rt(() => {
		e.ac.abort(fe);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= b;
		var f = ar(e);
		if (Ke() && Yn !== null && !Un && f !== null && !(e.f & 6146)) for (var p = 0; p < Yn.length; p++) rr(Yn[p], e);
		if (i !== null && i !== e) {
			if (Qn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Qn;
			if (t !== null) for (let e of t) e.rv = Qn;
			Yn !== null && (r === null ? r = Yn : r.push(...Yn));
		}
		return e.f & 8388608 && (e.f ^= re), d;
	} catch (t) {
		return ar(e), fn(t);
	} finally {
		e.f ^= te, U = t, Jn = n, Yn = r, V = i, Kn = a, He(o), Un = s, $n = c;
	}
}
function ar(e) {
	var t = e.deps, n = N?.is_fork;
	if (U !== null) {
		var r;
		if (n || sr(e, Jn), t !== null && Jn > 0) for (t.length = Jn + U.length, r = 0; r < U.length; r++) t[Jn + r] = U[r];
		else e.deps = t = U;
		if (_n() && e.f & 512) for (r = Jn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Jn < t.length && (sr(e, Jn), t.length = Jn);
	return t;
}
function or(e, r) {
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
		s.f & 512 && (s.f ^= 512), s.v !== E && Qe(s), s.ac !== null && rt(() => {
			s.ac.abort(fe), s.ac = null, M(s, g);
		}), _t(s), sr(s, 0);
	}
}
function sr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) or(e, n[r]);
}
function cr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		M(e, h);
		var n = H;
		H = e;
		try {
			t & 16777232 ? Mn(e) : jn(e), An(e);
			var r = ir(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Zn;
		} finally {
			H = n;
		}
	}
}
async function lr() {
	await Promise.resolve(), At();
}
function W(e) {
	var t = !!(e.f & 2);
	if (Bn?.add(e), V !== null && !Un && !(H !== null && H.f & 16384) && (Kn === null || !Kn.has(e))) {
		var r = V.deps;
		if (V.f & 2097152) e.rv < Qn && (e.rv = Qn, U === null && r !== null && r[Jn] === e ? Jn++ : U === null ? U = [e] : U.push(e));
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
			return (!(a.f & 1024) && a.reactions !== null || dr(a)) && (o = ht(a)), Rt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Un && V !== null && !!(V.f & 512), c = (a.f & b) === 0;
		nr(a) && (s && (a.f |= 512), gt(a)), s && !c && (vt(a), ur(a));
	}
	if (xt?.has(e)) return xt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function ur(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (vt(r), ur(r));
	}
}
function dr(e) {
	if (e.v === E) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && dr(t)) return !0;
	return !1;
}
function G(e) {
	var t = Un;
	try {
		return Un = !0, e();
	} finally {
		Un = t;
	}
}
function K(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (T in e) fr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && T in n && fr(n);
		}
	}
}
function fr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			fr(e[n], t);
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
var pr = ["touchstart", "touchmove"];
function mr(e) {
	return pr.includes(e);
}
// ../node_modules/svelte/src/internal/client/dom/elements/events.js
var hr = Symbol("events"), gr = /* @__PURE__ */ new Set(), _r = /* @__PURE__ */ new Set();
function vr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Cr.call(t, e), !e.cancelBubble) return rt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Ye(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function yr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = vr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && vn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function q(e, t, n) {
	(t[hr] ??= {})[e] = n;
}
function br(e) {
	for (var t = 0; t < e.length; t++) gr.add(e[t]);
	for (var n of _r) n(e);
}
var xr = null, Sr = !1;
function Cr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	xr = e, Sr || (Sr = !0, setTimeout(() => {
		Sr = !1, xr = null;
	}));
	var s = 0, c = xr === e && e[hr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[hr] = t;
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
					var h = o[hr]?.[r];
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
			e[hr] = t, delete e.currentTarget, Wn(d), Gn(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var wr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Tr(e) {
	return wr?.createHTML(e) ?? e;
}
function Er(e) {
	var t = un("template");
	return t.innerHTML = Tr(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function Dr(e, t) {
	var n = H;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function J(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (D) return Dr(O, null), O;
		i === void 0 && (i = Er(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ an(i)));
		var t = r || $t ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ an(t), s = t.lastChild;
			Dr(o, s);
		} else Dr(t, t);
		return t;
	};
}
function Or(e = "") {
	if (!D) {
		var t = rn(e + "");
		return Dr(t, t), t;
	}
	var n = O;
	return n.nodeType === 3 ? dn(n) : (n.before(n = rn()), k(n)), Dr(n, n), n;
}
function Y(e, t) {
	if (D) {
		var n = H;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = O), xe();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function kr(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		_n() && (W(n), Dn(() => (t === 0 && (r = G(() => e(() => qt(n)))), t += 1, () => {
			Ye(() => {
				--t, t === 0 && (r?.(), r = void 0, qt(n));
			});
		})));
	};
}
// ../node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Ar = S | C;
function jr(e, t, n, r) {
	new Mr(e, t, n, r);
}
var Mr = class {
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
	#h = kr(() => (this.#m = Bt(this.#l), () => {
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
		}, Ar), D && (this.#e = O);
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
		return this.#h(), W(this.#m);
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
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ue] ??= e.nodeValue) && (e[ue] = n, e.nodeValue = `${n}`);
}
function Nr(e, t) {
	return Fr(e, t);
}
var Pr = /* @__PURE__ */ new Map();
function Fr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	nn();
	var l = void 0, u = Sn(() => {
		var s = n ?? t.appendChild(rn());
		jr(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = j;
			if (o && (n.c = o), a && (i.$$events = a), D && Dr(t, null), l = e(t, i) || Ge(), D && (H.nodes.end = O, O === null || O.nodeType !== 8 || O.data !== "]")) throw _e(), me;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = mr(r);
					for (let e of [t, document]) {
						var a = Pr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Pr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Cr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(gr)), _r.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Pr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Cr), r.delete(e), r.size === 0 && Pr.delete(n)) : r.set(e, i);
			}
			_r.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Ir.set(l, u), l;
}
var Ir = /* @__PURE__ */ new WeakMap(), Lr = class {
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
function Z(e, t, n = !1) {
	var r;
	D && (r = O, xe());
	var i = new Lr(e), a = n ? S : 0;
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
function Rr(e, t) {
	return t;
}
function zr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Fn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Br(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
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
		Br(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Br(e, t, n = !0) {
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
var Vr;
function Hr(t, n, i, a, o, s = null) {
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
			var t = W(f);
			_.fallback = d, Wr(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= ee, Kr(d, null, c)) : Ln(d) : Fn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: On(() => {
			var e = W(f), t = e.length;
			let r = !1;
			D && we(c) === "[!" != (t === 0) && (c = Ce(), k(c), be(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = N, v = ln(), y = 0; y < t; y += 1) {
				D && O.nodeType === 8 && O.data === "]" && (c = O, r = !0, be(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && Wt(S.v, b), S.i && Wt(S.i, y), v && _.unskip_effect(S.e)) : (S = Gr(l, m ? c : Vr ??= rn(), b, x, y, o, n, i), m || (S.e.f |= ee), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = kn(() => s(c)) : (d = kn(() => s(Vr ??= rn())), d.f |= ee)), t > u.size && Ae("", "", ""), D && t > 0 && k(Ce()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && be(!0), W(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, D && (c = O);
}
function Ur(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Wr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Ur(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Ln(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ee, _ === l) Kr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), qr(e, d, _), qr(e, _, y), Kr(_, y, n), d = _, p = [], m = [], l = Ur(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Kr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					qr(e, S.prev, C.next), qr(e, d, S), qr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Kr(_, l, n), qr(e, _.prev, _.next), qr(e, _, d === null ? e.effect.first : d.next), qr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Ur(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Ur(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Br(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Ur(l.next);
		var te = w.length;
		if (te > 0) {
			var ne = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) w[v].nodes?.a?.fix();
			}
			zr(e, w, ne);
		}
	}
	o && Ye(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Gr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ P(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: kn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Kr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ on(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function qr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// ../node_modules/svelte/src/internal/shared/attributes.js
var Jr = [..." 	\n\r\f\xA0\v﻿"];
function Yr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Jr.includes(r[o - 1])) && (s === r.length || Jr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// ../node_modules/svelte/src/internal/client/dom/elements/class.js
function Xr(e, t, n, r, i, a) {
	var o = e[ce];
	if (D || o !== n || o === void 0) {
		var s = Yr(n, r, a);
		D && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ce] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Zr(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Qr(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = ni(c);
			Zr(c, i ? a.includes(l) : Zt(l, r));
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
function $r(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return ve();
		for (var i of t.options) i.selected = n.includes(ni(i));
	} else {
		for (i of t.options) if (Zt(ni(i), n)) {
			i.selected = !0;
			return;
		}
		r && n === void 0 || (t.selectedIndex = -1);
	}
}
function ei(e) {
	var t = new MutationObserver((t) => {
		t.every(ri) || ("__defaultValue" in e && Qr(e, !1), "__value" in e && $r(e, e.__value));
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
function ti(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	it(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ni);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ni(o);
		}
		n(a), e.__value = a, N !== null && r.add(N);
	}), Cn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = N;
			if (r.has(o)) return;
		}
		if ($r(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ni(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function ni(e) {
	return "__value" in e ? e.__value : e.value;
}
function ri(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// ../node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ii = Symbol("is custom element"), ai = Symbol("is html"), oi = pe ? "link" : "LINK", si = pe ? "progress" : "PROGRESS";
function ci(e) {
	if (D) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Q(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Q(e, "checked", null), e.checked = r;
				}
			}
		};
		e[de] = n, Ye(n), nt();
	}
}
function li(e, t) {
	var n = ui(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === si) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = ui(e);
	D && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === oi) || i[t] !== (i[t] = n) && (t === "loading" && (e[oe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && fi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ui(e) {
	return e[se] ??= {
		[ii]: e.nodeName.includes("-"),
		[ai]: e.namespaceURI === he
	};
}
var di = /* @__PURE__ */ new Map();
function fi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = di.get(t);
	if (n) return n;
	di.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function pi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	it(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = mi(e) ? hi(a) : a, n(a), N !== null && r.add(N), await lr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (D && e.defaultValue !== e.value || G(t) == null && e.value) && (n(mi(e) ? hi(e.value) : e.value), N !== null && r.add(N)), Dn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = N;
			if (r.has(i)) return;
		}
		mi(e) && n === hi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function mi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function hi(e) {
	return e === "" ? null : +e;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function gi(e, t) {
	return e === t || e?.[T] === t;
}
function _i(e = Ge(), t, n, r) {
	var i = j.r, a = H;
	return Cn(() => {
		var o, s;
		return Dn(() => {
			o = s, s = r?.() || [], G(() => {
				gi(n(...s), e) || (t(e, ...s), o && gi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && gi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function vi(e = !1) {
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => K(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ lt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => W(i);
	}
	n.b.length && xn(() => {
		yi(t, r), p(n.b);
	}), yn(() => {
		let e = G(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && yn(() => {
		yi(t, r), p(n.a);
	});
}
function yi(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function bi(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = G(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var xi = [];
function Si(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ee(e, t) && (e = t, n)) {
			let t = !xi.length;
			for (let t of r) t[1](), xi.push(t, e);
			if (t) {
				for (let e = 0; e < xi.length; e += 2) xi[e][0](xi[e + 1]);
				xi.length = 0;
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
function Ci(e) {
	let t;
	return bi(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var wi = !1, Ti = Symbol("unmounted");
function Ei(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ P(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(Ti in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = bi(e, (e) => {
				i ? r.source.v = e : F(r.source, e);
			}), i = !1;
		}
	}
	return e && Ti in n ? Ci(e) : W(r.source);
}
function Di() {
	let e = {};
	function t() {
		vn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, Ti, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Oi(e) {
	var t = wi;
	try {
		return wi = !1, [e(), wi];
	} finally {
		wi = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ lt(r), W(u)) : (l && (l = !1, c = s ? G(r) : r), c);
	let f;
	if (o) {
		var p = T in e || ae in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Oi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Fe(t), f(m)));
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
	o && W(y);
	var b = H;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? W(y) : i && o ? Yt(e) : e;
			return F(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Vn && v || b.f & 16384 ? y.v : W(y);
	});
}
function ki(e) {
	j === null && Oe("onMount"), Be && j.l !== null ? ji(j).m.push(e) : yn(() => {
		let t = G(e);
		if (typeof t == "function") return t;
	});
}
function Ai(e) {
	j === null && Oe("onDestroy"), ki(() => () => G(e));
}
function ji(e) {
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
var Mi = "keida-hub-reborn", Ni = "reborn-workspace-v1", Pi = 9223372036854775807n, Fi = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1,
	directorySave: "idle",
	directoryMessage: ""
}), Ii = (e) => typeof e == "object" && !!e && !Array.isArray(e), Li = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= Pi && (!t || e !== "0"), Ri = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096;
function zi(e) {
	if (typeof e != "string" || new TextEncoder().encode(e).length > 1024 || !/^https:\/\/[^/]/.test(e) || /[\s\u0000-\u001f\u007f\\]/u.test(e)) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "https:" && !!t.hostname && !t.username && !t.password && !e.includes("?") && !e.includes("#");
	} catch {
		return !1;
	}
}
function Bi(e) {
	if (!Ii(e) || e.product !== Mi || e.contract !== Ni || e.schema !== 1 || !Ii(e.account) || !Li(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !Li(e.session_generation) || !Ii(e.note) || !Ri(e.note.body) || !Li(e.note.revision)) throw Error("Invalid workspace response");
	let t = e.directory, n = (e, t, n = !1) => typeof e == "string" && (!n || e.length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e);
	if (!Ii(t) || !Li(t.revision) || !Li(t.pins_revision) || !Array.isArray(t.services) || t.services.length > 100 || t.services.some((e) => !Ii(e) || !Li(e.id, !0) || !n(e.name, 80, !0) || !n(e.category, 40, !0) || !n(e.description, 240) || !zi(e.url)) || new Set(t.services.map((e) => e.id)).size !== t.services.length || !Array.isArray(t.pins) || t.pins.length > 24 || new Set(t.pins).size !== t.pins.length || t.pins.some((e) => !Li(e, !0) || !t.services.some((t) => t.id === e))) throw Error("Invalid directory response");
	if (e.crafty != null) {
		let t = e.crafty, n = (e) => e === null || typeof e == "number" && Number.isSafeInteger(e) && e >= 0, r = (e) => e === null || typeof e == "string" && /^[a-z_]{1,40}$/.test(e);
		if (!Ii(t) || !Li(t.revision) || typeof t.configured != "boolean" || !n(t.checked_at) || !r(t.error) || !Array.isArray(t.servers) || t.servers.length > 8 || t.servers.some((e) => !Ii(e) || typeof e.name != "string" || e.name.length > 80 || typeof e.join != "string" || e.join.length > 253 || ![
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
function Vi(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (Ii(t) && t.schema === 1 && Ri(t.body) && Li(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
function Hi(e) {
	let t = Si(Fi("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l, u = !1, d = !1, f = () => Ci(t), p = (e) => `${Mi}.workspace.v1:${e.account.id}:${e.session_generation}`;
	function m() {
		if (c = void 0, s) try {
			sessionStorage.removeItem(s);
		} catch {}
	}
	function h() {
		let e = f();
		if (!s || !e.snapshot) return;
		if (!e.dirty) {
			m();
			return;
		}
		let n = {
			body: e.draft,
			base: e.base
		};
		c = {
			key: s,
			draft: n
		};
		try {
			sessionStorage.setItem(s, JSON.stringify({
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
	function g() {
		++n, r && clearTimeout(r), r = void 0, i?.abort(), a?.abort(), i = void 0, a = void 0, o?.abort(), o = void 0;
	}
	function _(e, n = !1) {
		g(), d ||= n, At(() => t.set(Fi(n ? "blocked" : "paused", e)));
	}
	function v() {
		r && clearTimeout(r), !u && !d && f().phase === "ready" && document.visibilityState === "visible" && (r = setTimeout(() => {
			r = void 0, S();
		}, 15e3));
	}
	async function y(t, n, r) {
		let i = performance.now(), a = setTimeout(() => n.abort(), 4e3);
		try {
			let a = await fetch(t, {
				method: r ? "PUT" : "GET",
				credentials: "same-origin",
				cache: "no-store",
				redirect: "error",
				signal: n.signal,
				headers: {
					"X-Reborn-Product": Mi,
					"X-Reborn-Contract": Ni,
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
	function b(e) {
		return e === 401 || e === 403 ? "Your sign-in changed or ended. Open a fresh workspace after signing in." : e === 426 ? "This workspace needs a fresh document. Open workspace again." : "Your workspace could not be checked. Open workspace again when access is available.";
	}
	function x(e) {
		let t = f().snapshot;
		return !t || e.account.id === t.account.id && e.session_generation === t.session_generation && e.account.role === t.account.role;
	}
	async function S() {
		if (u || d || i || a || o || document.visibilityState !== "visible") return;
		let e = new AbortController();
		i = e;
		let r = n;
		try {
			let i = await y("/api/workspace/snapshot", e);
			if (u || e.signal.aborted || r !== n) return;
			if (document.visibilityState !== "visible") {
				_("Workspace hidden. Checking access on return.");
				return;
			}
			if (i.status !== 200) {
				_(b(i.status), !0);
				return;
			}
			let a = Bi(i.value);
			if (!x(a)) {
				_("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let o = f();
			if (s = p(a), o.phase === "ready") {
				let e = o.dirty && a.note.revision !== o.base;
				t.set({
					...o,
					snapshot: a,
					draft: o.dirty ? o.draft : a.note.body,
					base: o.dirty ? o.base : a.note.revision,
					save: e ? "conflict" : o.save === "uncertain" ? "idle" : o.save,
					message: e ? "A newer saved note is available. Your draft is unchanged." : "Workspace checked.",
					directorySave: o.directorySave === "uncertain" ? "idle" : o.directorySave,
					directoryMessage: o.directorySave === "uncertain" ? "Current saved directory and pins checked. Review them before making another change." : o.directoryMessage
				}), o.dirty && o.draft === a.note.body && (t.update((e) => ({
					...e,
					dirty: !1,
					base: a.note.revision,
					save: "saved",
					message: "The current note is saved."
				})), m());
			} else {
				let e = c?.key === s ? c.draft : void 0, n = !1;
				try {
					e ??= Vi(sessionStorage.getItem(s));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (m(), e = void 0), t.set({
					...Fi("ready", "Workspace checked."),
					snapshot: a,
					draft: a.note.body,
					base: a.note.revision,
					recovery: e,
					storageLimited: n
				});
			}
			v();
		} catch {
			i === e && r === n && !u && _("Your workspace could not be checked. Open workspace again to retry deliberately.", !0);
		} finally {
			i === e && (i = void 0);
		}
	}
	function C(e) {
		let n = f();
		if (n.phase === "ready" && n.snapshot) {
			if (t.set({
				...n,
				draft: e,
				dirty: e !== n.snapshot.note.body,
				save: n.save === "saved" ? "idle" : n.save
			}), Ri(e)) h();
			else if (c = void 0, s) try {
				sessionStorage.removeItem(s);
			} catch {}
		}
	}
	function w() {
		let e = f();
		e.recovery && e.snapshot && e.phase === "ready" && (t.set({
			...e,
			draft: e.recovery.body,
			base: e.recovery.base,
			dirty: !0,
			recovery: void 0,
			save: e.recovery.base === e.snapshot.note.revision ? "idle" : "conflict",
			message: "Draft recovered. Review it before saving."
		}), h());
	}
	function ee(e) {
		let n = f();
		n.snapshot && n.phase === "ready" && (t.set({
			...n,
			draft: e ? n.snapshot.note.body : n.draft,
			base: n.snapshot.note.revision,
			dirty: !e && n.draft !== n.snapshot.note.body,
			recovery: void 0,
			save: "idle",
			message: e ? "Loaded the saved note." : "Draft kept against the latest saved revision. Review, then save deliberately."
		}), h());
	}
	async function te() {
		let e = f();
		if (e.phase !== "ready" || !e.dirty || !Ri(e.draft) || e.save === "conflict" || e.save === "uncertain" || a) return;
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
			let e = await y("/api/workspace/note", o, {
				body: c.body,
				base_revision: c.base
			});
			if (u || o.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				_("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				_(b(e.status), !0);
				return;
			}
			if (e.status === 409) t.update((e) => ({
				...e,
				save: "conflict",
				message: "Another save won. Your draft is unchanged."
			}));
			else if (e.status === 200) {
				let n = Bi(e.value);
				if (!x(n) || n.note.body !== c.body || BigInt(n.note.revision) !== BigInt(c.base) + 1n) throw Error("Unqualified save result");
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
				})), h();
			} else throw Error("Save outcome unavailable");
		} catch {
			a === o && s === n && !u && t.update((e) => ({
				...e,
				save: "uncertain",
				message: "Save outcome is uncertain. Check the saved note before trying again."
			}));
		} finally {
			a === o && (a = void 0), s === n && !u && (f().save === "conflict" ? await S() : v());
		}
	}
	async function ne(e, r) {
		let a = f();
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
			let i = await y(e, s, r);
			if (u || s.signal.aborted || c !== n) return !1;
			if (document.visibilityState !== "visible") return _("Workspace hidden. Checking access on return."), !1;
			if ([
				401,
				403,
				426
			].includes(i.status)) return _(b(i.status), !0), !1;
			if (i.status === 200) {
				let e = Bi(i.value);
				return x(e) ? (t.update((t) => ({
					...t,
					snapshot: t.snapshot ? {
						...t.snapshot,
						directory: e.directory
					} : void 0,
					directorySave: "idle",
					directoryMessage: "Saved to your account."
				})), !0) : (_("Your account scope changed. Open a fresh workspace.", !0), !1);
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
			return o === s && c === n && !u && t.update((e) => ({
				...e,
				directorySave: "uncertain",
				directoryMessage: "The save may have completed. Check saved services before making another change."
			})), !1;
		} finally {
			o === s && (o = void 0), c === n && !u && v();
		}
	}
	function re(e, t) {
		return ne("/api/owner/directory", {
			base_revision: e,
			change: t
		});
	}
	function T(e) {
		let t = f().snapshot?.directory;
		return t ? ne("/api/workspace/pins", {
			base_directory_revision: t.revision,
			base_revision: t.pins_revision,
			ids: e
		}) : Promise.resolve(!1);
	}
	function ie() {
		m(), _("Signing out…", !0);
		try {
			l?.postMessage({ kind: "auth-changed" });
		} catch {}
	}
	function ae() {
		let e = () => _("Workspace hidden. Checking access on return."), n = () => {
			S();
		}, r = () => {
			document.visibilityState === "visible" ? n() : e();
		};
		try {
			l = new BroadcastChannel("keida-hub-reborn.account.v1"), l.onmessage = (e) => {
				Ii(e.data) && e.data.kind === "auth-changed" && _("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), S(), () => {
			u = !0, g(), l?.close(), t.set(Fi("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
		};
	}
	return {
		model: t,
		start: ae,
		edit: C,
		recover: w,
		resolve: ee,
		save: te,
		signOut: ie,
		check: S,
		editService: re,
		pins: T
	};
}
// src/Connections.svelte
var Ui = /* @__PURE__ */ J("<section class=\"card small-card\"><h2>No Crafty connection enrolled</h2><p>An owner can add dedicated access and choose which servers to show.</p></section>"), Wi = /* @__PURE__ */ J("<p class=\"notice\" role=\"status\"> </p>"), Gi = /* @__PURE__ */ J("<p class=\"field-help\">This server could not be fully observed.</p>"), Ki = /* @__PURE__ */ J("<article class=\"card small-card server-card\"><h2> </h2> <p><strong> </strong> <span class=\"field-help\">Provider-reported process state</span></p> <dl><dt>Players</dt><dd> </dd> <dt>Freshness</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd> <dt>Join address</dt><dd> </dd></dl> <!></article>"), qi = /* @__PURE__ */ J("<!> <div class=\"server-grid\"></div> <p class=\"field-help\">A running process does not establish game readiness. Join addresses are owner-reviewed; outside-network joining is accepted separately.</p>", 1), Ji = /* @__PURE__ */ J("<button class=\"button secondary\">Check connection state</button>"), Yi = /* @__PURE__ */ J("<button class=\"text-button\" type=\"button\">Remove server</button>"), Xi = /* @__PURE__ */ J("<fieldset><legend> </legend> <label>Crafty server UUID</label><input name=\"server-id\" required=\"\" maxlength=\"36\"/> <label>Display name</label><input name=\"server-name\" required=\"\" maxlength=\"80\"/> <label>Reviewed public join address, optional</label><input name=\"server-join\" maxlength=\"253\" placeholder=\"play.example:25565\"/> <!></fieldset>"), Zi = /* @__PURE__ */ J("<button class=\"text-button\" type=\"button\">Remove connection</button>"), Qi = /* @__PURE__ */ J("<section class=\"card connection-setup\" aria-label=\"Dedicated Crafty enrollment\"><h2>Dedicated Crafty access</h2> <p>Create access specifically for Reborn, limited to viewing the selected servers. Credentials are encrypted on the server and are not shown again.</p> <p class=\"workspace-status\" role=\"status\"> </p> <!> <form autocomplete=\"off\"><label for=\"crafty-endpoint\">Crafty HTTPS address</label><input id=\"crafty-endpoint\" name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\" placeholder=\"https://crafty.example/\"/> <label for=\"crafty-token\">Dedicated API token</label><input id=\"crafty-token\" name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label for=\"crafty-timezone\">Crafty’s configured time zone</label><input id=\"crafty-timezone\" name=\"timezone\" required=\"\" maxlength=\"64\" placeholder=\"America/Chicago or UTC\"/> <label for=\"crafty-ca\">Private CA certificate, if needed</label><textarea id=\"crafty-ca\" name=\"ca-pem\" maxlength=\"8192\" rows=\"3\"></textarea> <p class=\"field-help\">Leave the certificate blank for publicly trusted HTTPS. The address and certificate must pass normal hostname and trust checks.</p> <!> <div class=\"button-row\"><button class=\"button secondary\" type=\"button\">Add server</button> <button class=\"button primary\" type=\"submit\"> </button></div></form> <!></section>"), $i = /* @__PURE__ */ J("<div class=\"connections-intro\"><p>Server observations from your deliberately enrolled Crafty connection.</p><span class=\"quiet-label\">Read-only overview</span></div> <!> <!>", 1);
function ea(e, t) {
	Ue(t, !1);
	let n = $(t, "binding", 8), r = $(t, "overview", 8), i = $(t, "owner", 8, !1), a = $(t, "active", 8, !1), o = $(t, "refresh", 8), s = /* @__PURE__ */ P(), c = /* @__PURE__ */ P([0]), l = /* @__PURE__ */ P(0), u = /* @__PURE__ */ P(), d = /* @__PURE__ */ P(""), f = /* @__PURE__ */ P(!1), p = 0, m = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
	function h() {
		++p, W(u)?.abort(), F(u, void 0), W(s)?.reset(), F(c, [Kt(l)]), F(d, ""), F(f, !1);
	}
	Ai(h);
	async function g(e = !1) {
		if (!a() || !i() || W(u) || !r() || W(f)) return;
		let t = r().revision, m = W(s) ? new FormData(W(s)) : void 0, h = (e) => m?.getAll(e).map(String) ?? [], g = h("server-id"), _ = h("server-name"), v = h("server-join"), y = e ? null : {
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
		W(s)?.reset(), F(c, [Kt(l)]);
		let b = new AbortController();
		F(u, b);
		let x = ++p, S = setTimeout(() => b.abort(), 4e3);
		F(d, e ? "Removing the connection…" : "Saving the dedicated connection…");
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
			if (r.status === 200) F(d, e ? "Connection removed." : "Connection saved. Checking provider observations…");
			else if (r.status === 409) F(d, "The connection changed elsewhere. Check its current state before enrolling again.");
			else if ([
				400,
				401,
				403,
				413,
				426
			].includes(r.status)) F(d, "Connection not accepted. Check your account and the dedicated connection details.");
			else throw Error("Uncertain connection outcome");
			await o()();
		} catch {
			x === p && a() && (F(f, !0), F(d, "The save outcome is uncertain. Check the connection before entering credentials again."));
		} finally {
			clearTimeout(S), W(u) === b && F(u, void 0);
		}
	}
	async function _() {
		await o()(), a() && (F(f, !1), F(d, "Review the current connection state before making another change."));
	}
	wn(() => K(a()), () => {
		a() || h();
	}), Tn(), vi();
	var v = $i(), y = R(sn(v), 2), b = (e) => {
		Y(e, Ui());
	}, x = (e) => {
		var t = qi(), n = sn(t), i = (e) => {
			var t = Wi(), n = L(t, !0);
			z(() => X(n, (K(r()), G(() => r().error === "checking" ? "Checking the provider. Fresh results will appear on the next observation." : "Provider observations are unavailable or incomplete. Unknown player counts stay unknown.")))), Y(e, t);
		};
		Z(n, (e) => {
			K(r()), G(() => r().error) && e(i);
		});
		var a = R(n, 2);
		Hr(a, 5, () => (K(r()), G(() => r().servers)), Rr, (e, t) => {
			var n = Ki(), r = I(n), i = L(r, !0), a = R(r, 2), o = L(I(a), !0);
			Se(2), A(a);
			var s = R(a, 2), c = R(I(s)), l = L(c), u = R(c, 3), d = L(u, !0), f = R(u, 3), p = L(f, !0), h = R(f, 2), g = L(h, !0), _ = L(R(h, 3), !0);
			A(s);
			var v = R(s, 2), y = (e) => {
				Y(e, Gi());
			};
			Z(v, (e) => {
				W(t), G(() => W(t).error) && e(y);
			}), A(n), z((e, n) => {
				X(i, (W(t), G(() => W(t).name))), X(o, (W(t), G(() => W(t).state === "running" ? "Running" : W(t).state === "stopped" ? "Stopped" : "Unknown"))), X(l, `${W(t), G(() => W(t).players === null ? "Not reported" : `${W(t).players} reported`) ?? ""}${W(t), G(() => W(t).capacity === null ? "" : ` / ${W(t).capacity} capacity`) ?? ""}`), X(d, (W(t), G(() => W(t).freshness === "fresh" ? "Recent provider sample" : W(t).freshness === "stale" ? "Stale provider sample" : "Provider sample age unknown"))), X(p, e), X(g, n), X(_, (W(t), G(() => W(t).join || "Not configured")));
			}, [() => (W(t), G(() => m(W(t).collected_at))), () => (W(t), G(() => m(W(t).provider_at)))]), Y(e, n);
		}), A(a), Se(2), Y(e, t);
	};
	Z(y, (e) => {
		K(r()), G(() => !r() || !r().configured) ? e(b) : e(x, -1);
	});
	var S = R(y, 2), C = (e) => {
		var t = Qi(), n = R(I(t), 4), i = L(n, !0), a = R(n, 2), o = (e) => {
			var t = Ji();
			q("click", t, () => void _()), Y(e, t);
		};
		Z(a, (e) => {
			W(f) && e(o);
		});
		var p = R(a, 2), m = R(I(p)), h = R(m, 3), v = R(h, 3), y = R(v, 3), b = R(y, 4);
		Hr(b, 3, () => W(c), (e) => e, (e, t, n) => {
			var r = Xi(), i = I(r), a = L(i), o = R(i, 2), s = R(o), l = R(s, 2), d = R(l), p = R(d, 2), m = R(p), h = R(m, 2), g = (e) => {
				var n = Yi();
				z(() => n.disabled = !!W(u) || W(f)), q("click", n, () => F(c, W(c).filter((e) => e !== W(t)))), Y(e, n);
			};
			Z(h, (e) => {
				W(c), G(() => W(c).length > 1) && e(g);
			}), A(r), z(() => {
				X(a, `Server ${W(n) + 1}`), Q(o, "for", `crafty-id-${W(t)}`), Q(s, "id", `crafty-id-${W(t)}`), s.disabled = !!W(u) || W(f), Q(l, "for", `crafty-name-${W(t)}`), Q(d, "id", `crafty-name-${W(t)}`), d.disabled = !!W(u) || W(f), Q(p, "for", `crafty-join-${W(t)}`), Q(m, "id", `crafty-join-${W(t)}`), m.disabled = !!W(u) || W(f);
			}), Y(e, r);
		});
		var x = R(b, 2), S = I(x), C = R(S, 2), w = L(C, !0);
		A(x), A(p), _i(p, (e) => F(s, e), () => W(s));
		var ee = R(p, 2), te = (e) => {
			var t = Zi();
			z(() => t.disabled = !!W(u) || W(f)), q("click", t, () => void g(!0)), Y(e, t);
		};
		Z(ee, (e) => {
			K(r()), G(() => r()?.configured) && e(te);
		}), A(t), z(() => {
			X(i, W(d)), m.disabled = !!W(u) || W(f), h.disabled = !!W(u) || W(f), v.disabled = !!W(u) || W(f), y.disabled = !!W(u) || W(f), S.disabled = (W(c), W(u), W(f), G(() => W(c).length >= 8 || !!W(u) || W(f))), C.disabled = !!W(u) || W(f) || !r(), X(w, W(u) ? "Working…" : "Save dedicated connection");
		}), yr("submit", p, (e) => {
			e.preventDefault(), g();
		}), q("click", S, () => F(c, [...W(c), Kt(l)])), Y(e, t);
	};
	Z(S, (e) => {
		i() && a() && e(C);
	}), Y(e, v), We();
}
br(["click"]);
// src/Directory.svelte
var ta = /* @__PURE__ */ J("<button class=\"text-button\">Browse services <span aria-hidden=\"true\">→</span></button>"), na = /* @__PURE__ */ J("<section class=\"notice\"><h3>Review the saved state</h3><p> </p><button class=\"button secondary\">Check saved services</button></section>"), ra = /* @__PURE__ */ J("<option> </option>"), ia = /* @__PURE__ */ J("<div class=\"directory-filters\"><div><label for=\"service-search\">Search services</label><input id=\"service-search\" type=\"search\" maxlength=\"120\" placeholder=\"Name, category or description\"/></div><div><label for=\"service-filter\">Category</label><select id=\"service-filter\"><option>All categories</option><!></select></div></div>"), aa = /* @__PURE__ */ J("<section class=\"card small-card\"><h3> </h3><p> </p></section>"), oa = /* @__PURE__ */ J("<p> </p>"), sa = /* @__PURE__ */ J("<button class=\"text-button move-up\">↑</button><button class=\"text-button move-down\">↓</button>", 1), ca = /* @__PURE__ */ J("<p>The directory changed. Review the service and choose Remove again.</p>"), la = /* @__PURE__ */ J("<div class=\"notice\"><p> </p><!><div class=\"button-row\"><button class=\"button secondary confirm-remove\">Remove service</button><button class=\"text-button\">Keep service</button></div></div>"), ua = /* @__PURE__ */ J("<div class=\"button-row\"><button class=\"text-button edit-service\"> </button><button class=\"text-button remove-service\">Remove</button></div> <!>", 1), da = /* @__PURE__ */ J("<article class=\"card small-card service-card\"><p class=\"eyebrow\"> </p><h3><a class=\"service-link\" target=\"_blank\" rel=\"noopener noreferrer\"> <span class=\"sr-only\">(opens in a new tab)</span> <span aria-hidden=\"true\">↗</span></a></h3> <!> <p class=\"field-help service-address\"> </p> <div class=\"button-row\"><button class=\"button secondary pin-service\"> </button> <!></div> <!></article>"), fa = /* @__PURE__ */ J("<div class=\"directory-grid\"></div>"), pa = /* @__PURE__ */ J("<p class=\"field-help\">Up to 24 personal pins. Links open the selected service in a new tab. Each service handles its own sign-in; directory links do not check availability.</p>"), ma = /* @__PURE__ */ J("<div class=\"notice\"><p>The directory changed after this form was opened. Review the current entries, then choose whether to keep this edit.</p><button class=\"button secondary\" type=\"button\">Keep edit against current directory</button></div>"), ha = /* @__PURE__ */ J("<section class=\"card directory-editor\" aria-label=\"Service editor\"><h2> </h2><p>Add a reviewed HTTPS link without passwords, tokens, query parameters or fragments. These links are visible to signed-in accounts.</p> <form><label for=\"service-name\">Service name</label><input id=\"service-name\" name=\"service-name\" required=\"\" maxlength=\"80\"/> <label for=\"service-category\">Category</label><input id=\"service-category\" name=\"service-category\" required=\"\" maxlength=\"40\"/> <label for=\"service-url\">HTTPS link</label><input id=\"service-url\" name=\"service-url\" type=\"url\" required=\"\" maxlength=\"1024\" placeholder=\"https://service.example/\"/> <label for=\"service-description\">Description, optional</label><textarea id=\"service-description\" name=\"service-description\" maxlength=\"240\" rows=\"2\"></textarea> <!> <div class=\"button-row\"><button class=\"button primary\" type=\"submit\"> </button><button class=\"text-button\" type=\"button\"> </button></div></form></section>"), ga = /* @__PURE__ */ J("<div class=\"directory-heading\"><div><p class=\"eyebrow\"> </p><h2> </h2></div><!></div> <p class=\"directory-status\" role=\"status\"> </p> <!> <!> <!> <!> <!>", 1);
function _a(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = $(t, "directory", 8), o = $(t, "authorized", 8, !1), s = $(t, "owner", 8, !1), c = $(t, "compact", 8, !1), l = $(t, "state", 8), u = $(t, "message", 8), d = $(t, "browse", 8), f = $(t, "check", 8), p = $(t, "edit", 8), m = $(t, "pin", 8), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P(""), _ = /* @__PURE__ */ P(""), v = /* @__PURE__ */ P(""), y = /* @__PURE__ */ P(""), b = /* @__PURE__ */ P(""), x = /* @__PURE__ */ P(""), S = /* @__PURE__ */ P(), C = /* @__PURE__ */ P(), w = 0;
	function ee() {
		++w, F(h, ""), F(g, ""), F(_, ""), F(v, ""), F(y, ""), F(b, ""), F(x, ""), F(C, void 0), F(S, void 0);
	}
	Ai(ee);
	function te() {
		F(_, ""), F(v, ""), F(y, ""), F(b, ""), F(x, ""), F(C, void 0), F(S, a()?.revision);
	}
	function ne(e) {
		F(x, e.id), F(_, e.name), F(v, e.description), F(y, e.url), F(b, e.category), F(S, a()?.revision), F(C, void 0), document.querySelector("#service-name")?.focus();
	}
	async function re() {
		if (W(n) || !s() || W(S) === void 0) return;
		let e = w, t = {
			action: W(x) ? "update" : "create",
			...W(x) ? { id: W(x) } : {},
			link: {
				name: W(_),
				category: W(b),
				description: W(v),
				url: W(y)
			}
		};
		await p()(W(S), t) && o() && e === w && (await lr(), o() && e === w && te());
	}
	function T(e) {
		!W(n) && a() && m()(a().pins.includes(e) ? a().pins.filter((t) => t !== e) : [...a().pins, e]);
	}
	function ie(e, t) {
		if (W(n) || !a()) return;
		let r = [...a().pins], i = r.indexOf(e), o = i + t;
		i < 0 || o < 0 || o >= r.length || ([r[i], r[o]] = [r[o], r[i]], m()(r));
	}
	async function ae(e) {
		if (W(n) || !a() || !s() || W(C)?.id !== e) return;
		let t = w;
		await p()(W(C).base, {
			action: "delete",
			id: e
		}) && o() && t === w && (await lr(), o() && t === w && (F(C, void 0), W(x) === e && te()));
	}
	wn(() => (K(l()), K(o())), () => {
		F(n, l() === "saving" || l() === "uncertain" || !o());
	}), wn(() => K(a()), () => {
		F(r, [...new Set(a()?.services.map((e) => e.category) ?? [])].sort());
	}), wn(() => (W(g), W(r)), () => {
		W(g) && !W(r).includes(W(g)) && F(g, "");
	}), wn(() => (K(a()), K(c()), W(g), W(h)), () => {
		F(i, [...a()?.services ?? []].sort((e, t) => {
			let n = a()?.pins.indexOf(e.id) ?? -1, r = a()?.pins.indexOf(t.id) ?? -1;
			return n >= 0 || r >= 0 ? (n < 0 ? 25 : n) - (r < 0 ? 25 : r) : e.name.localeCompare(t.name) || Number(BigInt(e.id) - BigInt(t.id));
		}).filter((e) => c() ? a()?.pins.includes(e.id) : (!W(g) || e.category === W(g)) && `${e.name} ${e.category} ${e.description}`.toLocaleLowerCase().includes(W(h).toLocaleLowerCase())));
	}), wn(() => K(o()), () => {
		o() || ee();
	}), wn(() => (K(o()), K(a()), W(S)), () => {
		o() && a() && W(S) === void 0 && F(S, a().revision);
	}), Tn(), vi();
	var oe = ga(), se = sn(oe), ce = I(se), le = I(ce), ue = L(le, !0), de = L(R(le), !0);
	A(ce);
	var fe = R(ce), pe = (e) => {
		var t = ta();
		q("click", t, function(...e) {
			d()?.apply(this, e);
		}), Y(e, t);
	};
	Z(fe, (e) => {
		c() && e(pe);
	}), A(se);
	var me = R(se, 2), E = L(me, !0), he = R(me, 2), ge = (e) => {
		var t = na(), n = R(I(t)), r = L(n, !0), i = R(n);
		A(t), z(() => X(r, l() === "uncertain" ? "Your change has not been sent again." : "Your edit is still in the form. Compare it with the current directory before saving.")), q("click", i, () => void f()()), Y(e, t);
	};
	Z(he, (e) => {
		(l() === "uncertain" || l() === "conflict") && e(ge);
	});
	var _e = R(he, 2), ve = (e) => {
		var t = ia(), n = I(t), i = R(I(n));
		ci(i), A(n);
		var a = R(n), o = R(I(a)), s = I(o);
		s.value = s.__value = "", Hr(R(s), 1, () => W(r), Rr, (e, t) => {
			var n = ra(), r = L(n, !0), i = {};
			z(() => {
				X(r, W(t)), i !== (i = W(t)) && (n.value = (n.__value = i) ?? "");
			}), Y(e, n);
		}), A(o), ei(o), A(a), A(t), pi(i, () => W(h), (e) => F(h, e)), ti(o, () => W(g), (e) => F(g, e)), Y(e, t);
	};
	Z(_e, (e) => {
		c() || e(ve);
	});
	var ye = R(_e, 2), D = (e) => {
		var t = aa(), n = I(t), r = L(n, !0), i = L(R(n), !0);
		A(t), z(() => {
			X(r, (K(c()), K(a()), G(() => c() ? "Keep your favorites close" : a()?.services.length ? "No matching services" : "Your directory starts here"))), X(i, (K(c()), K(a()), K(s()), G(() => c() ? "Pin services from the directory to show them on Home." : a()?.services.length ? "Try another search or category." : s() ? "Add a service below to make it available to signed-in accounts." : "An owner can add reviewed service links.")));
		}), Y(e, t);
	}, be = (e) => {
		var t = fa();
		Hr(t, 5, () => W(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ pt(() => (K(a()), W(t), G(() => a()?.pins.includes(W(t).id) ?? !1))), i = /* @__PURE__ */ pt(() => (K(a()), W(t), G(() => a()?.pins.indexOf(W(t).id) ?? -1)));
			var o = da(), l = I(o), u = L(l, !0), d = R(l), f = I(d), p = I(f, !0);
			Se(3), A(f), A(d);
			var m = R(d, 2), h = (e) => {
				var n = oa(), r = L(n, !0);
				z(() => X(r, (W(t), G(() => W(t).description)))), Y(e, n);
			};
			Z(m, (e) => {
				W(t), G(() => W(t).description) && e(h);
			});
			var g = R(m, 2), _ = L(g, !0), v = R(g, 2), y = I(v), b = L(y, !0), x = R(y, 2), S = (e) => {
				var r = sa(), o = sn(r), s = R(o);
				z(() => {
					Q(o, "aria-label", (W(t), G(() => `Move ${W(t).name} up`))), o.disabled = W(n) || W(i) === 0, Q(s, "aria-label", (W(t), G(() => `Move ${W(t).name} down`))), s.disabled = (W(n), K(W(i)), K(a()), G(() => W(n) || W(i) === (a()?.pins.length ?? 0) - 1));
				}), q("click", o, () => ie(W(t).id, -1)), q("click", s, () => ie(W(t).id, 1)), Y(e, r);
			};
			Z(x, (e) => {
				W(r) && e(S);
			}), A(v);
			var w = R(v, 2), ee = (e) => {
				var r = ua(), i = sn(r), o = I(i), s = L(o), c = R(o);
				A(i);
				var l = R(i, 2), u = (e) => {
					var r = la(), i = I(r), o = L(i), s = R(i), c = (e) => {
						Y(e, ca());
					};
					Z(s, (e) => {
						W(C), K(a()), G(() => W(C).base !== a()?.revision) && e(c);
					});
					var l = R(s), u = I(l), d = R(u);
					A(l), A(r), z(() => {
						X(o, `Remove ${W(C), G(() => W(C).name) ?? ""} from the directory and everyone’s pins?`), u.disabled = (W(n), W(C), K(a()), G(() => W(n) || W(C).base !== a()?.revision));
					}), q("click", u, () => void ae(W(t).id)), q("click", d, () => F(C, void 0)), Y(e, r);
				};
				Z(l, (e) => {
					W(C), W(t), G(() => W(C)?.id === W(t).id) && e(u);
				}), z(() => {
					o.disabled = W(n), X(s, `Edit ${W(t), G(() => W(t).name) ?? ""}`), c.disabled = W(n);
				}), q("click", o, () => ne(W(t))), q("click", c, () => F(C, a() ? {
					id: W(t).id,
					base: a().revision,
					name: W(t).name
				} : void 0)), Y(e, r);
			};
			Z(w, (e) => {
				s() && !c() && e(ee);
			}), A(o), z(() => {
				Q(o, "data-service-id", (W(t), G(() => W(t).id))), X(u, (W(t), G(() => W(t).category))), Q(f, "href", (W(t), G(() => W(t).url))), X(p, (W(t), G(() => W(t).name))), X(_, (W(t), G(() => W(t).url))), Q(y, "aria-pressed", W(r)), Q(y, "aria-label", (K(W(r)), W(t), G(() => `${W(r) ? "Unpin" : "Pin"} ${W(t).name}`))), y.disabled = (W(n), K(W(r)), K(a()), G(() => W(n) || !W(r) && (a()?.pins.length ?? 0) >= 24)), X(b, W(r) ? "Pinned" : "Pin to Home");
			}), q("click", y, () => T(W(t).id)), Y(e, o);
		}), A(t), Y(e, t);
	};
	Z(ye, (e) => {
		W(i), G(() => W(i).length === 0) ? e(D) : e(be, -1);
	});
	var O = R(ye, 2), k = (e) => {
		Y(e, pa());
	};
	Z(O, (e) => {
		c() || e(k);
	});
	var xe = R(O, 2), Ce = (e) => {
		var t = ha(), r = I(t), i = L(r, !0), o = R(r, 3), s = R(I(o));
		ci(s);
		var u = R(s, 3);
		ci(u);
		var d = R(u, 3);
		ci(d);
		var f = R(d, 3);
		et(f);
		var p = R(f, 2), m = (e) => {
			var t = ma(), r = R(I(t));
			A(t), z(() => r.disabled = W(n)), q("click", r, () => F(S, a()?.revision)), Y(e, t);
		};
		Z(p, (e) => {
			W(S), K(a()), G(() => W(S) !== void 0 && a() && W(S) !== a().revision) && e(m);
		});
		var h = R(p, 2), g = I(h), C = L(g, !0), w = R(g), ee = L(w, !0);
		A(h), A(o), A(t), z(() => {
			Q(t, "hidden", c()), X(i, W(x) ? "Edit service" : "Add a service"), s.disabled = W(n), u.disabled = W(n), d.disabled = W(n), f.disabled = W(n), g.disabled = (W(n), W(S), K(a()), G(() => W(n) || W(S) !== a()?.revision)), X(C, l() === "saving" ? "Saving…" : W(x) ? "Save service" : "Add service"), w.disabled = W(n), X(ee, W(x) ? "Cancel edit" : "Clear form");
		}), yr("submit", o, (e) => {
			e.preventDefault(), re();
		}), pi(s, () => W(_), (e) => F(_, e)), pi(u, () => W(b), (e) => F(b, e)), pi(d, () => W(y), (e) => F(y, e)), pi(f, () => W(v), (e) => F(v, e)), q("click", w, te), Y(e, t);
	};
	Z(xe, (e) => {
		s() && o() && e(Ce);
	}), z(() => {
		X(ue, c() ? "YOUR SHORTCUTS" : "A PLACE FOR YOUR SERVICES"), X(de, c() ? "Pinned services" : "Service directory"), X(E, u());
	}), Y(e, oe), We();
}
br(["click"]);
// src/App.svelte
var va = /* @__PURE__ */ J("<a rel=\"noreferrer\"> </a>"), ya = /* @__PURE__ */ J("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), ba = /* @__PURE__ */ J("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), xa = /* @__PURE__ */ J("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), Sa = /* @__PURE__ */ J("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), Ca = /* @__PURE__ */ J("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), wa = /* @__PURE__ */ J("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), Ta = /* @__PURE__ */ J("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span aria-hidden=\"true\"></span></button> <button><span aria-hidden=\"true\">◇</span>Connections</button> <button><span aria-hidden=\"true\">▦</span>Services</button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <form method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary> <dl><dt>Source</dt><dd><!></dd><dt>Tree</dt><dd> </dd><dt>Channel</dt><dd> </dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\" aria-label=\"Home\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-grid\"><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button></section><section class=\"card small-card\"><span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p> </p><button class=\"text-button\">View connections <span aria-hidden=\"true\">→</span></button></section></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <section aria-label=\"Connections\"><!></section> <section aria-label=\"Services\"><!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function Ea(e, t) {
	Ue(t, !1);
	let n = () => Ei(l, "$model", r), [r, i] = Di(), a = /* @__PURE__ */ P(), o = /* @__PURE__ */ P(), s = $(t, "binding", 8), c = Hi(s()), l = c.model, u = /* @__PURE__ */ P("home"), d = /* @__PURE__ */ P(), f = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", p = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified", m = document.querySelector("meta[name=\"reborn-tree\"]")?.content ?? "unqualified", h = document.querySelector("meta[name=\"reborn-channel\"]")?.content ?? "development";
	function g(e) {
		F(u, e), W(d)?.focus();
	}
	ki(c.start), wn(() => n(), () => {
		F(a, new TextEncoder().encode(n().draft).length);
	}), wn(() => (n(), W(a)), () => {
		F(o, n().phase === "ready" && n().dirty && W(a) <= 4096 && ![
			"saving",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), Tn(), vi();
	var _ = Ta(), v = R(sn(_), 2), y = I(v), b = R(I(y), 4), x = I(b);
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
	A(b);
	var ae = R(b, 2), oe = I(ae), se = R(I(oe)), ce = I(se), le = L(ce, !0), ue = L(R(ce), !0);
	A(se), A(oe);
	var de = R(oe, 2), fe = R(R(I(de), 2), 2);
	ci(fe), Se(2), A(de);
	var pe = R(de, 2), me = I(pe), E = I(me, !0);
	Se(), A(me);
	var he = R(me, 2), ge = R(I(he)), _e = I(ge), ve = (e) => {
		var t = va(), n = L(t, !0);
		z(() => {
			Q(t, "href", `https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${p}`), X(n, p);
		}), Y(e, t);
	}, ye = /* @__PURE__ */ ft(() => G(() => /^[a-f0-9]{40}$/.test(p))), D = (e) => {
		var t = Or();
		z(() => X(t, p)), Y(e, t);
	};
	Z(_e, (e) => {
		W(ye) ? e(ve) : e(D, -1);
	}), A(ge);
	var be = R(ge, 2), O = L(be, !0), k = L(R(be, 2), !0);
	Se(2), A(he), A(pe), A(ae), A(y);
	var xe = R(y, 2), Ce = I(xe), we = I(Ce), Te = R(I(we)), Ee = L(Te, !0);
	_i(Te, (e) => F(d, e), () => W(d)), A(we);
	var De = R(we), Oe = R(I(De), 1, !0);
	A(De), A(Ce);
	var ke = R(Ce, 2), Ae = L(ke, !0), je = R(ke, 2), Me = (e) => {
		Y(e, ya());
	};
	Z(je, (e) => {
		n(), G(() => n().phase !== "ready") && e(Me);
	});
	var Ne = R(je, 2), Pe = I(Ne), Fe = I(Pe), Ie = R(I(Fe), 3);
	A(Fe), Se(), A(Pe);
	var Le = R(Pe, 2), Re = I(Le), ze = R(I(Re), 2), Be = L(ze, !0), Ve = R(ze);
	A(Re);
	var j = R(Re), He = R(I(j), 2), Ge = L(He, !0), Ke = R(He);
	A(j), A(Le), A(Ne);
	var qe = R(Ne, 2), Je = I(qe), Ye = L(R(I(Je)), !0);
	A(Je);
	var Xe = R(Je, 2), Ze = (e) => {
		var t = ba(), n = R(I(t), 2), r = I(n), i = R(r);
		A(n), A(t), q("click", r, function(...e) {
			c.recover?.apply(this, e);
		}), q("click", i, () => c.resolve(!0)), Y(e, t);
	};
	Z(Xe, (e) => {
		n(), G(() => n().recovery) && e(Ze);
	});
	var M = R(Xe, 2), Qe = R(I(M), 2);
	et(Qe);
	var $e = R(Qe, 4), tt = I($e);
	let nt;
	var rt = L(tt), it = R(tt), at = L(it, !0);
	A($e), A(M);
	var ot = R(M, 2), st = (e) => {
		Y(e, xa());
	};
	Z(ot, (e) => {
		n(), G(() => n().storageLimited) && e(st);
	});
	var ct = R(ot, 2), lt = (e) => {
		Y(e, Sa());
	};
	Z(ct, (e) => {
		W(a) > 4096 && e(lt);
	});
	var ut = R(ct, 2), dt = (e) => {
		var t = Ca(), r = R(I(t), 2), i = L(r, !0), a = R(r), o = I(a), s = R(o);
		A(a), A(t), z(() => X(i, (n(), G(() => n().snapshot?.note.body)))), q("click", o, () => c.resolve(!1)), q("click", s, () => c.resolve(!0)), Y(e, t);
	};
	Z(ut, (e) => {
		n(), G(() => n().save === "conflict") && e(dt);
	});
	var mt = R(ut, 2), ht = (e) => {
		var t = wa(), n = R(I(t), 2);
		A(t), q("click", n, () => c.check()), Y(e, t);
	};
	Z(mt, (e) => {
		n(), G(() => n().save === "uncertain") && e(ht);
	}), A(qe);
	var gt = R(qe, 2), _t = I(gt);
	{
		let e = /* @__PURE__ */ pt(() => (n(), G(() => n().snapshot?.crafty))), t = /* @__PURE__ */ pt(() => (n(), G(() => n().snapshot?.account.role === "owner"))), r = /* @__PURE__ */ pt(() => (W(u), n(), G(() => W(u) === "connections" && n().phase === "ready")));
		ea(_t, {
			get binding() {
				return s();
			},
			get overview() {
				return W(e);
			},
			get owner() {
				return W(t);
			},
			get active() {
				return W(r);
			},
			get refresh() {
				return G(() => c.check);
			}
		});
	}
	A(gt);
	var vt = R(gt, 2), yt = I(vt);
	{
		let e = /* @__PURE__ */ pt(() => (n(), G(() => n().snapshot?.directory))), t = /* @__PURE__ */ pt(() => (n(), G(() => n().phase === "ready"))), r = /* @__PURE__ */ pt(() => (n(), G(() => n().snapshot?.account.role === "owner"))), i = /* @__PURE__ */ pt(() => W(u) === "home");
		_a(yt, {
			get directory() {
				return W(e);
			},
			get authorized() {
				return W(t);
			},
			get owner() {
				return W(r);
			},
			get compact() {
				return W(i);
			},
			get state() {
				return n(), G(() => n().directorySave);
			},
			get message() {
				return n(), G(() => n().directoryMessage);
			},
			browse: () => g("directory"),
			get check() {
				return G(() => c.check);
			},
			get edit() {
				return G(() => c.editService);
			},
			get pin() {
				return G(() => c.pins);
			}
		});
	}
	A(vt), Se(2), A(xe), A(v), z(() => {
		Q(x, "aria-current", W(u) === "home" ? "page" : void 0), S = Xr(x, 1, "", null, S, { active: W(u) === "home" }), Q(C, "aria-current", W(u) === "note" ? "page" : void 0), w = Xr(C, 1, "", null, w, { active: W(u) === "note" }), te = Xr(ee, 1, "draft-dot", null, te, { visible: n().dirty }), Q(ne, "aria-current", W(u) === "connections" ? "page" : void 0), re = Xr(ne, 1, "", null, re, { active: W(u) === "connections" }), Q(T, "aria-current", W(u) === "directory" ? "page" : void 0), ie = Xr(T, 1, "", null, ie, { active: W(u) === "directory" }), X(le, (n(), G(() => n().snapshot?.account.username ?? "Your account"))), X(ue, (n(), G(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), li(fe, s()), X(E, f), X(O, m), X(k, h), X(Ee, W(u) === "home" ? "Welcome home." : W(u) === "note" ? "A little space to think." : W(u) === "connections" ? "Your servers, at a glance." : "Everything within reach."), X(Oe, (n(), G(() => n().phase === "ready" ? "Session checked" : n().phase === "checking" ? "Checking access" : "Access paused"))), X(Ae, (n(), G(() => n().message))), Q(Ne, "hidden", (W(u), n(), G(() => W(u) !== "home" || n().phase !== "ready"))), X(Be, (n(), G(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are."))), X(Ge, (n(), G(() => n().snapshot?.crafty?.configured ? "Your enrolled Crafty observations are available in Connections." : "Enroll dedicated Crafty access to see your selected servers."))), Q(qe, "hidden", (W(u), n(), G(() => W(u) !== "note" || n().phase !== "ready"))), X(Ye, (n(), G(() => n().dirty ? "Unsaved changes" : "Up to date"))), li(Qe, (n(), G(() => n().draft))), Qe.disabled = (n(), G(() => n().phase !== "ready")), nt = Xr(tt, 1, "", null, nt, { "over-limit": W(a) > 4096 }), X(rt, `${W(a) ?? ""} / 4096 bytes`), it.disabled = !W(o), X(at, (n(), G(() => n().save === "saving" ? "Saving…" : "Save note"))), Q(gt, "hidden", (W(u), n(), G(() => W(u) !== "connections" || n().phase !== "ready"))), Q(vt, "hidden", (W(u), n(), G(() => W(u) !== "home" && W(u) !== "directory" || n().phase !== "ready")));
	}), q("click", x, () => g("home")), q("click", C, () => g("note")), q("click", ne, () => g("connections")), q("click", T, () => g("directory")), yr("submit", de, () => c.signOut()), q("click", Ie, () => g("note")), q("click", Ve, () => g("note")), q("click", Ke, () => g("connections")), yr("submit", M, (e) => {
		e.preventDefault(), c.save();
	}), q("input", Qe, (e) => c.edit(e.currentTarget.value)), Y(e, _), We(), i();
}
br(["click", "input"]);
// src/main.ts
var Da = document.getElementById("workspace-root"), Oa = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, ka = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
if (Da && Oa && /^[a-f0-9]{64}$/.test(Oa) && ka === "reborn-workspace-v1") {
	let e = Array.from(Da.childNodes);
	Da.replaceChildren();
	try {
		Nr(Ea, {
			target: Da,
			props: { binding: Oa }
		});
	} catch {
		Da.replaceChildren(...e);
	}
}
