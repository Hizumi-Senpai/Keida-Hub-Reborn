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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, E = 1 << 21, ee = 1 << 22, te = 1 << 23, ne = Symbol("$state"), re = Symbol("component"), D = Symbol("legacy props"), ie = Symbol(""), ae = Symbol("attributes"), oe = Symbol("class"), se = Symbol("style"), ce = Symbol("text"), le = Symbol("form reset"), ue = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), de = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), fe = {}, pe = Symbol("uninitialized"), me = "http://www.w3.org/1999/xhtml";
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
	if (e === null) throw ge(), fe;
	return k = e;
}
function xe() {
	return be(/* @__PURE__ */ cn(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ cn(k) !== null) throw ge(), fe;
		k = e;
	}
}
function Se(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ cn(n);
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
		var i = /* @__PURE__ */ cn(n);
		e && n.remove(), n = i;
	}
}
function we(e) {
	if (!e || e.nodeType !== 8) throw ge(), fe;
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
		for (var r of n) Sn(r);
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
function $e(e, t) {
	e.f = e.f & Qe | t;
}
function et(e) {
	e.f & 512 || e.deps === null ? $e(e, h) : $e(e, _);
}
// ../node_modules/svelte/src/internal/client/reactivity/utils.js
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), $e(e, h);
}
// ../node_modules/svelte/src/internal/client/dom/elements/misc.js
function nt(e) {
	O && /* @__PURE__ */ sn(e) !== null && un(e);
}
var rt = !1;
function it() {
	rt || (rt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[le]?.();
		});
	}, { capture: !0 }));
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function at(e) {
	var t = B, n = V;
	qn(null), Jn(null);
	try {
		return e();
	} finally {
		qn(t), Jn(n);
	}
}
function ot(e, t, n, r = n) {
	e.addEventListener(t, () => at(n));
	let i = e[le];
	e[le] = i ? () => {
		i(), r(!0);
	} : () => r(!0), it();
}
// ../node_modules/svelte/src/internal/client/reactivity/async.js
function st(e, t, n, r) {
	let i = qe() ? dt : M;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = ct(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				hn(e, s);
			}
			lt();
		}
	}
	var d = ut();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ pt(e))).then(u).catch((e) => hn(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), lt());
	}) : f();
}
function ct() {
	var e = V, t = B, n = j, r = N;
	return function(i = !0) {
		Jn(e), qn(t), Ue(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function lt(e = !0) {
	Jn(null), qn(null), Ue(null), e && N?.deactivate();
}
function ut() {
	var e = V, t = e.b, n = N, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function dt(e) {
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
		v: pe,
		wv: 0,
		parent: V,
		ac: null
	};
}
var ft = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function pt(e, t, n) {
	let r = V;
	r === null && ke();
	var i = void 0, a = Vt(pe), o = !B, s = /* @__PURE__ */ new Set();
	return On(() => {
		var t = V, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ue && n.reject(e);
			}).finally(lt);
		} catch (e) {
			n.reject(e), lt();
		}
		var c = N;
		if (o) {
			if (t.f & 32768) var l = ut();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(ft);
			else for (let e of s.values()) e.reject(ft);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== ft && (c.activate(), t ? (a.f |= te, Kt(a, t)) : (a.f & 8388608 && (a.f ^= te), Kt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), bn(() => {
		for (let e of s) e.reject(ft);
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
function mt(e) {
	let t = /* @__PURE__ */ dt(e);
	return Xn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function M(e) {
	let t = /* @__PURE__ */ dt(e);
	return t.equals = De, t;
}
function ht(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Fn(t[n]);
	}
}
function gt(e) {
	var t, n = V, r = e.parent;
	if (!Wn && r !== null && e.v !== pe && r.f & 24576) return he(), e.v;
	Jn(r);
	try {
		ht(e), t = cr(e);
	} finally {
		Jn(n);
	}
	return t;
}
function _t(e) {
	var t = gt(e);
	!e.equals(t) && (e.wv = ar(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), xt?.capture(e, t, !0)), e.deps === null)) ? $e(e, h) : Wn || (St === null ? et(e) : (yn() || N?.is_fork) && St.set(e, t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && at(() => {
		t.ac.abort(ue), t.ac = null;
	}), t.fn !== null && (t.teardown = d), dr(t, 0), Nn(t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && fr(t);
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
			for (var r of n.d) $e(r, g), t(r);
			for (r of n.m) $e(r, _), t(r);
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
		for (let e of this.#u) this.#d.delete(e), $e(e, g), this.schedule(e);
		for (let e of this.#d) $e(e, _), this.schedule(e);
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), $e(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), N = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== pe && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), St?.set(e, t)), this.is_fork || (e.v = t);
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
		for (let e of this.async_deriveds.values()) e.reject(ft);
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
		hn(e, Ct);
	}
}
var Nt = null;
function Pt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && or(r) && (Nt = /* @__PURE__ */ new Set(), fr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Ln(r), Nt?.size > 0)) {
				zt.clear();
				for (let e of Nt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Nt.has(n) && (Nt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || fr(n);
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
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), $e(e, h);
		for (var n = e.first; n !== null;) It(n, t), n = n.next;
	}
}
function Lt(e) {
	$e(e, h);
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
	return Xn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t = !1, n = !0) {
	let r = Vt(e);
	return t || (r.equals = De), Ve && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function Ut(e, t) {
	return F(e, U(() => H(e))), t;
}
function F(e, t, n = !1) {
	return B !== null && (!Kn || B.f & 131072) && qe() && B.f & 4325394 && (Yn === null || !Yn.has(e)) && ze(), Kt(e, n ? Zt(t) : t, Dt);
}
var Wt = null, Gt = 0;
function Kt(e, t, n = null) {
	if (!e.equals(t)) {
		Wn ? zt.set(e, t) : zt.has(e) || zt.set(e, e.v);
		var r = At.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && gt(t), St === null && et(t);
		}
		e.wv = ar(), Wt = null, Gt = 0, Xt(e, g, n), Wt = null, qe() && V !== null && V.f & 1024 && !(V.f & 96) && ($n === null ? er([e]) : $n.push(e)), !r.is_fork && Rt.size > 0 && !Bt && qt();
	}
	return t;
}
function qt() {
	Bt = !1;
	for (let e of Rt) {
		e.f & 1024 && $e(e, _);
		let t;
		try {
			t = or(e);
		} catch {
			t = !0;
		}
		t && fr(e);
	}
	Rt.clear();
}
function Jt(e, t = 1) {
	var n = H(e);
	return F(e, t === 1 ? ++n : --n);
}
function Yt(e) {
	F(e, e.v + 1);
}
function Xt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = qe(), a = r.length;
		if (Gt += a, Gt > 1e5 && Wt === null && (Wt = /* @__PURE__ */ new Set()), Wt !== null) {
			if (Wt.has(e)) return;
			Wt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== V) {
				var l = (c & g) === 0;
				if (l && $e(s, t), c & 131072) Rt.add(s);
				else if (c & 2) {
					var u = s;
					St?.delete(u), Xt(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && Nt !== null && Nt.add(d), n === null ? Ft(d) : n.push(d);
				}
			}
		}
	}
}
function Zt(t) {
	if (typeof t != "object" || !t || ne in t || re in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Ht(0), u = null, d = rr, f = (e) => {
		if (rr === d) return e();
		var t = B, n = rr;
		qn(null), ir(d);
		var r = e();
		return qn(t), ir(n), r;
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
					let e = f(() => /* @__PURE__ */ Ht(pe, u));
					r.set(t, e), Yt(o);
				}
			} else F(n, pe), Yt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === ne) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Ht(Zt(s ? e[n] : pe), u)), r.set(n, o)), o !== void 0) {
				var c = H(o);
				return c === pe ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = H(i);
				if (a === pe) return;
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
			var n = r.get(t), i = n !== void 0 && n.v !== pe || Reflect.has(e, t);
			return (n !== void 0 || V !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Ht(i ? Zt(e[t]) : pe, u)), r.set(t, n)), H(n) === pe) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Ht(pe, u)), r.set(d + "", p)) : F(p, pe);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Ht(void 0, u)), F(c, Zt(n)), r.set(t, c));
			else {
				l = c.v !== pe;
				var m = f(() => Zt(n));
				F(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && F(g, _ + 1);
				}
				Yt(o);
			}
			return !0;
		},
		ownKeys(e) {
			H(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== pe;
			});
			for (var [n, i] of r) i.v !== pe && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Re();
		}
	});
}
function Qt(e) {
	try {
		if (typeof e == "object" && e && ne in e) return e[ne];
	} catch {}
	return e;
}
function $t(e, t) {
	return Object.is(Qt(e), Qt(t));
}
var en, tn, nn, rn;
function an() {
	if (en === void 0) {
		en = window, tn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		nn = a(t, "firstChild").get, rn = a(t, "nextSibling").get, u(e) && (e[oe] = void 0, e[ae] = null, e[se] = void 0, e.__e = void 0), u(n) && (n[ce] = void 0);
	}
}
function on(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function sn(e) {
	return nn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function cn(e) {
	return rn.call(e);
}
function I(e, t) {
	if (!O) return /* @__PURE__ */ sn(e);
	var n = /* @__PURE__ */ sn(k);
	if (n === null) n = k.appendChild(on());
	else if (t && n.nodeType !== 3) {
		var r = on();
		return n?.before(r), be(r), r;
	}
	return t && pn(n), be(n), n;
}
function ln(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ sn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ cn(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = on();
			return k?.before(r), be(r), r;
		}
		pn(k);
	}
	return k;
}
function L(e, t = !1) {
	if (!O) return /* @__PURE__ */ sn(e);
	var n = I(e, t);
	return A(e), n;
}
function R(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ cn(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = on();
			return r === null ? i?.after(a) : r.before(a), be(a), a;
		}
		pn(r);
	}
	return be(r), r;
}
function un(e) {
	e.textContent = "";
}
function dn() {
	return !1;
}
function fn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function pn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function mn(e) {
	var t = V;
	if (t === null) return B.f |= te, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	hn(e, t);
}
function hn(e, t) {
	if (e === fe) throw e;
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
function gn(e) {
	V === null && (B === null && Ne(e), Me()), Wn && je(e);
}
function _n(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function vn(e, t) {
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
			fr(r);
		} catch (e) {
			throw Fn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && _n(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function yn() {
	return B !== null && !Kn;
}
function bn(e) {
	let t = vn(8, null);
	return $e(t, h), t.teardown = e, t;
}
function xn(e) {
	gn("$effect");
	var t = V.f;
	if (!B && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return Sn(e);
}
function Sn(e) {
	return vn(4 | w, e);
}
function Cn(e) {
	return gn("$effect.pre"), vn(8 | w, e);
}
function wn(e) {
	At.ensure();
	let t = vn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Rn(t, () => {
			Fn(t), n(void 0);
		}) : (Fn(t), n(void 0));
	});
}
function Tn(e) {
	return vn(4, e);
}
function En(e, t) {
	var n = j, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = kn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				Jn(n.parent), U(t);
			} finally {
				Jn(n);
			}
		}
	});
}
function Dn() {
	var e = j;
	kn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && $e(n, _), or(n) && fr(n), t.ran = !1;
		}
	});
}
function On(e) {
	return vn(ee | C, e);
}
function kn(e, t = 0) {
	return vn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	st(r, t, n, (t) => {
		vn(8, () => {
			e(...t.map(H));
		});
	});
}
function An(e, t = 0) {
	return vn(16 | t, e);
}
function jn(e) {
	return vn(32 | C, e);
}
function Mn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Wn, r = B;
		Gn(!0), qn(null);
		try {
			t.call(null);
		} catch (t) {
			hn(t, e.parent);
		} finally {
			Gn(n), qn(r);
		}
	}
}
function Nn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && at(() => {
			e.abort(ue);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Fn(n, t), n = r;
	}
}
function Pn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Fn(t), t = n;
	}
}
function Fn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (In(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Nn(e, t && !n), dr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Mn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Ln(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function In(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ cn(e);
		e.remove(), e = n;
	}
}
function Ln(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Rn(e, t, n = !0) {
	var r = [];
	e.f |= 256, zn(e, r, !0);
	var i = () => {
		n && Fn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function zn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				zn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Bn(e) {
	e.f &= -257, Vn(e, !0);
}
function Vn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || ($e(e, g), At.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Vn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Hn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ cn(n);
		t.append(n), n = i;
	}
}
// ../node_modules/svelte/src/internal/client/legacy.js
var Un = null, Wn = !1;
function Gn(e) {
	Wn = e;
}
var B = null, Kn = !1;
function qn(e) {
	B = e;
}
var V = null;
function Jn(e) {
	V = e;
}
var Yn = null;
function Xn(e) {
	B !== null && (B.f & 2097152 || B.f & 2) && (Yn ??= /* @__PURE__ */ new Set()).add(e);
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
			if (or(a) && _t(a), a.wv > e.wv) return !0;
		}
		t & 512 && St === null && $e(e, h);
	}
	return !1;
}
function sr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Yn !== null && Yn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? sr(a, t, !1) : t === a && (n ? $e(a, g) : a.f & 1024 && $e(a, _), Ft(a));
	}
}
function cr(e) {
	var t = Zn, n = Qn, r = $n, i = B, a = Yn, o = j, s = Kn, c = rr, l = e.f;
	Zn = null, Qn = 0, $n = null, B = l & 96 ? null : e, Yn = null, Ue(e.ctx), Kn = !1, rr = ++nr, e.ac !== null && (at(() => {
		e.ac.abort(ue);
	}), e.ac = null);
	try {
		e.f |= E;
		var u = e.fn, d = u();
		e.f |= b;
		var f = lr(e);
		if (qe() && $n !== null && !Kn && f !== null && !(e.f & 6146)) for (var p = 0; p < $n.length; p++) sr($n[p], e);
		if (i !== null && i !== e) {
			if (nr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = nr;
			if (t !== null) for (let e of t) e.rv = nr;
			$n !== null && (r === null ? r = $n : r.push(...$n));
		}
		return e.f & 8388608 && (e.f ^= te), d;
	} catch (t) {
		return lr(e), mn(t);
	} finally {
		e.f ^= E, Zn = t, Qn = n, $n = r, B = i, Yn = a, Ue(o), Kn = s, rr = c;
	}
}
function lr(e) {
	var t = e.deps, n = N?.is_fork;
	if (Zn !== null) {
		var r;
		if (n || dr(e, Qn), t !== null && Qn > 0) for (t.length = Qn + Zn.length, r = 0; r < Zn.length; r++) t[Qn + r] = Zn[r];
		else e.deps = t = Zn;
		if (yn() && e.f & 512) for (r = Qn; r < t.length; r++) (t[r].reactions ??= []).push(e);
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
		s.f & 512 && (s.f ^= 512), s.v !== pe && et(s), s.ac !== null && at(() => {
			s.ac.abort(ue), s.ac = null, $e(s, g);
		}), vt(s), dr(s, 0);
	}
}
function dr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ur(e, n[r]);
}
function fr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		$e(e, h);
		var n = V;
		V = e;
		try {
			t & 16777232 ? Pn(e) : Nn(e), Mn(e);
			var r = cr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = tr;
		} finally {
			V = n;
		}
	}
}
async function pr() {
	await Promise.resolve(), jt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (Un?.add(e), B !== null && !Kn && !(V !== null && V.f & 16384) && (Yn === null || !Yn.has(e))) {
		var r = B.deps;
		if (B.f & 2097152) e.rv < nr && (e.rv = nr, Zn === null && r !== null && r[Qn] === e ? Qn++ : Zn === null ? Zn = [e] : Zn.push(e));
		else {
			B.deps ??= [], n.call(B.deps, e) || B.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [B] : n.call(i, B) || i.push(B);
		}
	}
	if (Wn && zt.has(e)) return zt.get(e);
	if (t) {
		var a = e;
		if (Wn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || hr(a)) && (o = gt(a)), zt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Kn && B !== null && !!(B.f & 512), c = (a.f & b) === 0;
		or(a) && (s && (a.f |= 512), _t(a)), s && !c && (yt(a), mr(a));
	}
	if (St?.has(e)) return St.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function mr(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (yt(r), mr(r));
	}
}
function hr(e) {
	if (e.v === pe) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (zt.has(t) || t.f & 2 && hr(t)) return !0;
	return !1;
}
function U(e) {
	var t = Kn;
	try {
		return Kn = !0, e();
	} finally {
		Kn = t;
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
		if (r.capture || Dr.call(t, e), !e.cancelBubble) return at(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Xe(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Cr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Sr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && bn(() => {
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
		var d = B, f = V;
		qn(null), Jn(null);
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
			e[yr] = t, delete e.currentTarget, qn(d), Jn(f);
		}
	}
}
// ../node_modules/svelte/src/internal/client/dom/reconciler.js
var Or = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function kr(e) {
	return Or?.createHTML(e) ?? e;
}
function Ar(e) {
	var t = fn("template");
	return t.innerHTML = kr(e.replaceAll("<!>", "<!---->")), t.content;
}
// ../node_modules/svelte/src/internal/client/dom/template.js
function jr(e, t) {
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
		if (O) return jr(k, null), k;
		i === void 0 && (i = Ar(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ sn(i)));
		var t = r || tn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ sn(t), s = t.lastChild;
			jr(o, s);
		} else jr(t, t);
		return t;
	};
}
function Mr(e = "") {
	if (!O) {
		var t = on(e + "");
		return jr(t, t), t;
	}
	var n = k;
	return n.nodeType === 3 ? pn(n) : (n.before(n = on()), be(n)), jr(n, n), n;
}
function Nr() {
	if (O) return jr(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = on();
	return e.append(t, n), jr(t, n), e;
}
function q(e, t) {
	if (O) {
		var n = V;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = k), xe();
	} else e !== null && e.before(t);
}
// ../node_modules/svelte/src/reactivity/create-subscriber.js
function Pr(e) {
	let t = 0, n = Vt(0), r;
	return () => {
		yn() && (H(n), kn(() => (t === 0 && (r = U(() => e(() => Yt(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, Yt(n));
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
	#h = Pr(() => (this.#m = Vt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = An(() => {
			if (O) {
				let e = we(this.#t);
				xe();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Fr), O && (this.#e = k);
	}
	#g() {
		try {
			this.#a = jn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Xe(r), t && (this.#s = jn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? ve() : (t = !0, n && Be(), this.#s !== null && Rn(this.#s, () => {
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
					hn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (y | x)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = jn(() => e(this.#e)), Xe(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = on(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return jn(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							hn(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(N)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Rn(this.#o, () => {
					this.#o = null;
				}), this.#S(N));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = jn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Hn(this.#a, e);
				let t = this.#n.pending;
				this.#o = jn(() => t(this.#e));
			} else this.#S(N);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		tt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = V, n = B, r = j;
		Jn(this.#i), qn(this.#i), Ue(this.#i.ctx);
		try {
			return At.ensure(), e();
		} finally {
			Jn(t), qn(n), Ue(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Rn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Xe(() => {
			this.#d = !1, this.#m && Kt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), H(this.#m);
	}
	error(e) {
		if (e === fe || !this.#n.onerror && !this.#n.failed) throw e;
		N?.is_fork ? (this.#a && N.skip_effect(this.#a), this.#o && N.skip_effect(this.#o), this.#s && N.skip_effect(this.#s), N.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (Fn(this.#a), null), this.#o &&= (Fn(this.#o), null), this.#s &&= (Fn(this.#s), null), O && (be(this.#t), Se(), be(Ce()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return jn(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return hn(e, this.#i.parent), null;
				}
			}));
		};
		Xe(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					hn(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => hn(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function J(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ce] ??= e.nodeValue) && (e[ce] = n, e.nodeValue = `${n}`);
}
function Rr(e, t) {
	return Br(e, t);
}
var zr = /* @__PURE__ */ new Map();
function Br(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	an();
	var l = void 0, u = wn(() => {
		var s = n ?? t.appendChild(on());
		Ir(s, { pending: () => {} }, (t) => {
			We({});
			var n = j;
			if (o && (n.c = o), a && (i.$$events = a), O && jr(t, null), l = e(t, i) || Ke(), O && (V.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw ge(), fe;
			Ge();
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
			if (n) Bn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Bn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Fn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Hn(r, t), t.append(on()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Fn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Rn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Fn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = N, r = dn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = on();
				i.append(a), this.#n.set(e, {
					effect: jn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, jn(() => t(this.anchor)));
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
	var i = new Hr(e), a = n ? S : 0;
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
	An(() => {
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
		Rn(n, () => {
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
			un(d), d.append(u), e.items.clear();
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
		r?.has(a) ? (a.f |= T, Hn(a, document.createDocumentFragment())) : Fn(t[i], n);
	}
}
var Kr;
function qr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = O ? be(/* @__PURE__ */ sn(u)) : u.appendChild(on());
	}
	O && xe();
	var d = null, f = /* @__PURE__ */ M(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = H(f);
			_.fallback = d, Yr(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= T, Zr(d, null, c)) : Bn(d) : Rn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: An(() => {
			var e = H(f), t = e.length;
			let r = !1;
			O && we(c) === "[!" != (t === 0) && (c = Ce(), be(c), ye(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = N, v = dn(), y = 0; y < t; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (c = k, r = !0, ye(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && Kt(S.v, b), S.i && Kt(S.i, y), v && _.unskip_effect(S.e)) : (S = Xr(l, m ? c : Kr ??= on(), b, x, y, o, n, i), m || (S.e.f |= T), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = jn(() => s(c)) : (d = jn(() => s(Kr ??= on())), d.f |= T)), t > u.size && Ae("", "", ""), O && t > 0 && be(Ce()), !m) {
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
function Jr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Yr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Jr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Bn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
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
	o && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Xr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Vt(n) : /* @__PURE__ */ P(n, !1, !1) : null, l = o & 2 ? Vt(i) : null;
	return {
		v: c,
		i: l,
		e: jn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Zr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ cn(r);
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
	var o = e[oe];
	if (O || o !== n || o === void 0) {
		var s = ei(n, r, a);
		O && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[oe] = n;
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
			ni(c, i ? a.includes(l) : $t(l, r));
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
		if (!e(n)) return _e();
		for (var i of t.options) i.selected = n.includes(si(i));
	} else {
		for (i of t.options) if ($t(si(i), n)) {
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
	}), bn(() => {
		t.disconnect();
	});
}
function oi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ot(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), si);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && si(o);
		}
		n(a), e.__value = a, N !== null && r.add(N);
	}), Tn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = N;
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
		e[le] = n, Xe(n), it();
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
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === di) || i[t] !== (i[t] = n) && (t === "loading" && (e[ie] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && vi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function gi(e) {
	return e[ae] ??= {
		[li]: e.nodeName.includes("-"),
		[ui]: e.namespaceURI === me
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
	ot(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = xi(e) ? Si(a) : a, n(a), N !== null && r.add(N), await pr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (O && e.defaultValue !== e.value || U(t) == null && e.value) && (n(xi(e) ? Si(e.value) : e.value), N !== null && r.add(N)), kn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = N;
			if (r.has(i)) return;
		}
		xi(e) && n === Si(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function bi(e, t, n = t) {
	ot(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (O && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), kn(() => {
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
function wi(e = Ke(), t, n, r) {
	var i = j.r, a = V;
	return Tn(() => {
		var o, s;
		return kn(() => {
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
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => W(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ dt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => H(i);
	}
	n.b.length && Cn(() => {
		Ei(t, r), p(n.b);
	}), xn(() => {
		let e = U(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && xn(() => {
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
		if (Ee(e, t) && (e = t, n)) {
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
		source: /* @__PURE__ */ P(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(Mi in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = Di(e, (e) => {
				i ? r.source.v = e : F(r.source, e);
			}), i = !1;
		}
	}
	return e && Mi in n ? Ai(e) : H(r.source);
}
function Pi() {
	let e = {};
	function t() {
		bn(() => {
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
	var i = !Ve || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ dt(r), H(u)) : (l && (l = !1, c = s ? U(r) : r), c);
	let f;
	if (o) {
		var p = ne in e || D in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Fi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ie(t), f(m)));
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
	var v = !1, y = (n & 1 ? dt : M)(() => (v = !1, g()));
	o && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && o ? Zt(e) : e;
			return F(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Wn && v || b.f & 16384 ? y.v : H(y);
	});
}
function Ii(e) {
	j === null && Oe("onMount"), Ve && j.l !== null ? Bi(j).m.push(e) : xn(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function Li(e) {
	j === null && Oe("onDestroy"), Ii(() => () => U(e));
}
function Ri(e) {
	j === null && Oe("beforeUpdate"), j.l === null && Fe("beforeUpdate"), Bi(j).b.push(e);
}
function zi(e) {
	j === null && Oe("afterUpdate"), j.l === null && Fe("afterUpdate"), Bi(j).a.push(e);
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
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), He();
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
}), Zi = (e, t) => ({
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
	media: Xi()
}), Q = (e) => typeof e == "object" && !!e && !Array.isArray(e), $ = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= Ui && (!t || e !== "0"), Qi = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096, $i = (e, t, n = !1) => typeof e == "string" && (!n || e.trim().length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e), ea = (e, t, n) => Array.isArray(e) && e.length <= t && e.every((e) => $i(e, n, !0)), ta = (e) => $(e) && BigInt(e) <= 253402300799n, na = [
	"unavailable",
	"invalid_configuration",
	"timeout",
	"transport",
	"denied",
	"provider_error",
	"oversized",
	"malformed",
	"not_discovered"
], ra = (e) => e === null || typeof e == "string" && na.includes(e), ia = (e) => e === null || typeof e == "number" && Number.isSafeInteger(e) && e >= 0 && e <= 1e6;
function aa(e) {
	if (typeof e != "string" || new TextEncoder().encode(e).length > 1024 || !/^https:\/\/[^/]/.test(e) || /[\s\u0000-\u001f\u007f\\]/u.test(e)) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "https:" && !!t.hostname && !t.username && !t.password && !e.includes("?") && !e.includes("#");
	} catch {
		return !1;
	}
}
function oa(e) {
	if (!Q(e) || !Array.isArray(e.groups) || e.groups.length > 2 || !Number.isInteger(e.unread_groups) || new Set(e.groups.map((e) => Q(e) ? e.category : null)).size !== e.groups.length || e.groups.some((e) => !Q(e) || !["services", "connections"].includes(String(e.category)) || !$(e.revision, !0) || !$(e.read_through) || !$(e.unread) || BigInt(e.read_through) > BigInt(e.revision) || BigInt(e.unread) !== BigInt(e.revision) - BigInt(e.read_through) || !Q(e.latest) || !$(e.latest.source_revision, !0) || !$(e.latest.occurred_at) || BigInt(e.latest.occurred_at) > 253402300799n || typeof e.latest.label != "string" || !/^[A-Za-z ]{1,64}$/.test(e.latest.label) || !(e.category === "services" ? [
		"service_added",
		"service_updated",
		"service_removed"
	] : ["connection_saved", "connection_removed"]).includes(String(e.latest.kind))) || e.unread_groups !== e.groups.filter((e) => e.unread !== "0").length) throw Error("Invalid notification response");
	return e;
}
function sa(e) {
	if (!Q(e) || !$(e.revision) || !Array.isArray(e.panels) || e.panels.length !== 3 || e.panels.some((e) => !Q(e) || ![
		"note",
		"connections",
		"pins"
	].includes(String(e.id)) || typeof e.visible != "boolean") || new Set(e.panels.map((e) => e.id)).size !== 3 || !e.panels.some((e) => e.visible)) throw Error("Invalid layout response");
	return e;
}
function ca(e) {
	let t = [
		"crafty",
		"jellyfin",
		"seerr",
		"sonarr",
		"radarr",
		"qbittorrent",
		"discord"
	], n = e.catalog, r = e.roadmap;
	if (!Array.isArray(n) || n.length !== t.length || new Set(n.map((e) => Q(e) ? e.id : null)).size !== t.length || n.some((e) => !Q(e) || !t.includes(String(e.id)) || !$i(e.name, 80, !0) || e.status !== ([
		"crafty",
		"jellyfin",
		"seerr"
	].includes(String(e.id)) ? "available" : "planned") || !$i(e.summary, 512, !0) || !ea(e.requirements, 8, 512) || !ea(e.capabilities, 8, 512)) || !Q(r) || typeof r.as_of != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(r.as_of) || !$i(r.intro, 1024, !0) || !ea(r.priorities, 8, 512) || r.tracker_url !== "https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2" || !Array.isArray(r.milestones) || r.milestones.length !== 9 || r.milestones.some((e, t) => !Q(e) || e.id !== `M${t}` || !$i(e.title, 120, !0) || !$i(e.status, 160, !0) || !ea(e.delivered, 8, 512) || !ea(e.remaining, 8, 512))) throw Error("Invalid workspace guide");
	return {
		catalog: n,
		roadmap: r
	};
}
function la(e, t, n) {
	if (!$(e.current_revision) || !$(e.through) || e.next_before !== null && !$(e.next_before, !0) || n && (e.current_revision !== t.revision || e.through !== t.through) || !Array.isArray(e.entries) || e.entries.length > 25 || e.entries.some((r) => !Q(r) || !$(r.id, !0) || !$(r.revision, !0) || !ta(r.checked_at) || !ra(r.error) || typeof r.complete != "boolean" || !Array.isArray(r.servers) || r.servers.length > 8 || BigInt(r.id) > BigInt(e.through) || n && BigInt(r.id) >= BigInt(t.next) || r.servers.some((e) => !Q(e) || !$i(e.name, 80, !0) || ![
		"running",
		"stopped",
		"unknown"
	].includes(String(e.state)) || !ia(e.players) || !ia(e.capacity) || e.collected_at !== null && !ta(e.collected_at) || e.provider_at !== null && !ta(e.provider_at) || ![
		"fresh",
		"stale",
		"unknown"
	].includes(String(e.freshness)) || !ra(e.error))) || e.entries.some((t, n) => n > 0 && BigInt(t.id) >= BigInt(e.entries[n - 1].id)) || e.next_before !== null && (e.entries.length !== 25 || e.next_before !== e.entries.at(-1)?.id)) throw Error("Invalid observation history");
	return {
		phase: "ready",
		entries: e.entries,
		revision: e.current_revision,
		through: e.through,
		next: e.next_before,
		message: "Retained provider observations checked."
	};
}
var ua = (e, t) => e.length === t.length && e.every((e, n) => e.id === t[n].id && e.visible === t[n].visible);
function da(e) {
	if (!Q(e) || e.product !== Vi || e.contract !== Hi || e.schema !== 1 || !Q(e.account) || !$(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !$(e.session_generation) || !Q(e.note) || !Qi(e.note.body) || !$(e.note.revision)) throw Error("Invalid workspace response");
	let t = e.directory, n = (e, t, n = !1) => typeof e == "string" && (!n || e.length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e);
	if (!Q(t) || !$(t.revision) || !$(t.pins_revision) || !Array.isArray(t.services) || t.services.length > 100 || t.services.some((e) => !Q(e) || !$(e.id, !0) || !n(e.name, 80, !0) || !n(e.category, 40, !0) || !n(e.description, 240) || !aa(e.url)) || new Set(t.services.map((e) => e.id)).size !== t.services.length || !Array.isArray(t.pins) || t.pins.length > 24 || new Set(t.pins).size !== t.pins.length || t.pins.some((e) => !$(e, !0) || !t.services.some((t) => t.id === e))) throw Error("Invalid directory response");
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
	return oa(e.notifications), sa(e.layout), e;
}
function fa(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (Q(t) && t.schema === 1 && Qi(t.body) && $(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
var pa = (e) => e === null || typeof e == "string" && [
	"checking",
	"unavailable",
	"invalid_configuration",
	"timeout",
	"transport",
	"denied",
	"provider_error",
	"oversized",
	"malformed"
].includes(e), ma = (e, t, n = 0) => typeof e == "number" && Number.isSafeInteger(e) && e >= n && e <= t, ha = (e) => ma(e, 48) && e % 12 == 0;
function ga(e, t = Math.floor(Date.now() / 1e3)) {
	let n = e.checked_at, r = !Number.isFinite(t) || t < 0 || n === null || n > t + 5 ? "unknown" : e.freshness === "fresh" && t - n > 90 ? "stale" : e.freshness;
	return r === e.freshness ? e : {
		...e,
		freshness: r
	};
}
function _a(e, t, n) {
	if (!Q(e) || !$(e.revision) || typeof e.configured != "boolean" || !(e.checked_at === null || ma(e.checked_at, 253402300799)) || ![
		"fresh",
		"stale",
		"unknown"
	].includes(String(e.freshness)) || !pa(e.error) || typeof e.complete != "boolean" || e.offset !== n || !ha(e.offset) || !(e.next_offset === null || ha(e.next_offset) && e.next_offset === n + 12) || !(e.total === null || ma(e.total, 1e9)) || typeof e.truncated != "boolean" || !Array.isArray(e.items) || e.items.length > 12 || new Set(e.items.map((e) => Q(e) ? e.id : null)).size !== e.items.length || e.items.some((e) => !Q(e) || typeof e.id != "string" || !/^[a-f0-9]{64}$/.test(e.id) || !(e.title === null || $i(e.title, 240, !0)) || !["movie", "series"].includes(String(e.kind)) || !(e.year === null || ma(e.year, 9999, 1)) || !pa(e.detail_error) || (t === "jellyfin" ? e.request_status !== null : ![
		"pending",
		"approved",
		"declined",
		"failed",
		"completed",
		"unknown"
	].includes(String(e.request_status)))) || (t === "seerr" ? e.playback !== null : !(e.playback === null || Q(e.playback) && (e.playback.playing === null || ma(e.playback.playing, 256)) && (e.playback.paused === null || ma(e.playback.paused, 256)) && pa(e.playback.error))) || !e.configured && (e.items.length !== 0 || e.complete || e.checked_at !== null || e.next_offset !== null)) throw Error("Invalid media response");
	let r = e;
	return ga({
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
function va(e) {
	let t = ki(Zi("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l, u, d, f = 0, p = 0, m = 0, h = !1, g = {}, _ = {}, v = {}, y = {
		jellyfin: 0,
		seerr: 0
	}, b = {
		jellyfin: 0,
		seerr: 0
	}, x, S, C, w = !1, T = !1, E = () => Ai(t), ee = (e) => `${Vi}.workspace.v1:${e.account.id}:${e.session_generation}`;
	function te() {
		if (S = void 0, x) try {
			sessionStorage.removeItem(x);
		} catch {}
	}
	function ne() {
		let e = E();
		if (!x || !e.snapshot) return;
		if (!e.dirty) {
			te();
			return;
		}
		let n = {
			body: e.draft,
			base: e.base
		};
		S = {
			key: x,
			draft: n
		};
		try {
			sessionStorage.setItem(x, JSON.stringify({
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
	function re() {
		++n, h = !1;
		for (let e of Yi) ++y[e], ++b[e], g[e]?.abort(), _[e]?.abort(), v[e]?.abort(), delete g[e], delete _[e], delete v[e];
		r && clearTimeout(r), r = void 0, i?.abort(), a?.abort(), i = void 0, a = void 0, o?.abort(), o = void 0, ++f, s?.abort(), s = void 0, ++p, c?.abort(), c = void 0, ++m, l?.abort(), l = void 0, u?.abort(), u = void 0, d?.abort(), d = void 0;
	}
	function D(e, n = !1) {
		re(), T ||= n, jt(() => t.set(Zi(n ? "blocked" : "paused", e)));
	}
	function ie() {
		r && clearTimeout(r), !w && !T && E().phase === "ready" && E().notificationSave !== "uncertain" && E().layoutSave !== "uncertain" && document.visibilityState === "visible" && (r = setTimeout(() => {
			r = void 0, Oe(), de();
		}, 15e3));
	}
	async function ae(t, n, r) {
		let i = performance.now(), a = setTimeout(() => n.abort(), 4e3);
		try {
			let a = await fetch(t, {
				method: r ? "PUT" : "GET",
				credentials: "same-origin",
				cache: "no-store",
				redirect: "error",
				signal: n.signal,
				headers: {
					"X-Reborn-Product": Vi,
					"X-Reborn-Contract": Hi,
					"X-CSRF-Token": e,
					...t === "/api/workspace/guide" ? { "X-Reborn-Guide": "media-v1" } : {},
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
	function oe(e) {
		return e === 401 || e === 403 ? "Your sign-in changed or ended. Open a fresh workspace after signing in." : e === 426 ? "This workspace needs a fresh document. Open workspace again." : "Your workspace could not be checked. Open workspace again when access is available.";
	}
	function se(e) {
		let t = E().snapshot;
		return !t || e.account.id === t.account.id && e.session_generation === t.session_generation && e.account.role === t.account.role;
	}
	function ce(e, t) {
		return Q(e) && e.product === Vi && e.contract === Hi && e.schema === 1 && Q(e.account) && e.account.id === t.account.id && e.account.username === t.account.username && e.account.role === t.account.role && e.session_generation === t.session_generation;
	}
	function le(e) {
		let t = E();
		return t.phase === "ready" && !!t.snapshot && e.account.id === t.snapshot.account.id && e.account.username === t.snapshot.account.username && e.account.role === t.snapshot.account.role && e.session_generation === t.snapshot.session_generation;
	}
	function ue(e, t, n = !1) {
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
	async function de(e = !1) {
		if (w || T || i || a || o || u || d || !e && E().layoutSave === "uncertain" || document.visibilityState !== "visible") return;
		let r = new AbortController();
		i = r;
		let s = n;
		try {
			let i = await ae("/api/workspace/snapshot", r);
			if (w || r.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				D("Workspace hidden. Checking access on return.");
				return;
			}
			if (i.status !== 200) {
				D(oe(i.status), !0);
				return;
			}
			let a = da(i.value);
			if (!se(a)) {
				D("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let o = E();
			if (x = ee(a), o.phase === "ready") {
				let n = ue(o, a.crafty), r = o.dirty && a.note.revision !== o.base, i = !!o.layoutDraft && ua(o.layoutDraft.panels, a.layout.panels) && e && ["uncertain", "checking-conflict"].includes(o.layoutSave), s = !!o.layoutDraft && !i && o.layoutDraft.base !== a.layout.revision, c = {
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
				n.changed ? jt(() => t.set(c)) : t.set(c), o.dirty && o.draft === a.note.body && (t.update((e) => ({
					...e,
					dirty: !1,
					base: a.note.revision,
					save: "saved",
					message: "The current note is saved."
				})), te());
			} else {
				let e = S?.key === x ? S.draft : void 0, n = !1;
				try {
					e ??= fa(sessionStorage.getItem(x));
				} catch {
					n = !0;
				}
				e?.body === a.note.body && (te(), e = void 0), t.set({
					...Zi("ready", "Workspace checked."),
					snapshot: a,
					draft: a.note.body,
					base: a.note.revision,
					recovery: e,
					storageLimited: n
				});
			}
			if (h && E().snapshot?.account.role === "owner") for (let e of Yi) {
				let t = E().media[e].observation;
				t?.error === "checking" && !g[e] && !v[e] && Fe(e, t.offset);
			}
			ie();
		} catch {
			i === r && s === n && !w && D("Your workspace could not be checked. Open workspace again to retry deliberately.", !0);
		} finally {
			i === r && (i = void 0);
		}
	}
	function fe(e) {
		let n = E();
		if (n.phase === "ready" && n.snapshot) {
			if (t.set({
				...n,
				draft: e,
				dirty: e !== n.snapshot.note.body,
				save: n.save === "saved" ? "idle" : n.save
			}), Qi(e)) ne();
			else if (S = void 0, x) try {
				sessionStorage.removeItem(x);
			} catch {}
		}
	}
	function pe() {
		let e = E();
		e.recovery && e.snapshot && e.phase === "ready" && (t.set({
			...e,
			draft: e.recovery.body,
			base: e.recovery.base,
			dirty: !0,
			recovery: void 0,
			save: e.recovery.base === e.snapshot.note.revision ? "idle" : "conflict",
			message: "Draft recovered. Review it before saving."
		}), ne());
	}
	function me(e) {
		let n = E();
		n.snapshot && n.phase === "ready" && (t.set({
			...n,
			draft: e ? n.snapshot.note.body : n.draft,
			base: n.snapshot.note.revision,
			dirty: !e && n.draft !== n.snapshot.note.body,
			recovery: void 0,
			save: "idle",
			message: e ? "Loaded the saved note." : "Draft kept against the latest saved revision. Review, then save deliberately."
		}), ne());
	}
	async function he() {
		let e = E();
		if (e.phase !== "ready" || !e.dirty || !Qi(e.draft) || [
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
			let e = await ae("/api/workspace/note", o, {
				body: c.body,
				base_revision: c.base
			});
			if (w || o.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				D("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				D(oe(e.status), !0);
				return;
			}
			if (e.status === 409) t.update((e) => ({
				...e,
				save: "checking-conflict",
				message: "Another save won. Checking the latest saved note before comparing. Your draft is unchanged."
			}));
			else if (e.status === 200) {
				let n = da(e.value);
				if (!se(n) || n.note.body !== c.body || BigInt(n.note.revision) !== BigInt(c.base) + 1n) throw Error("Unqualified save result");
				let r = E(), i = ue(r, n.crafty, !0), a = {
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
				i.changed ? jt(() => t.set(a)) : t.set(a), ne();
			} else throw Error("Save outcome unavailable");
		} catch {
			a === o && s === n && !w && t.update((e) => ({
				...e,
				save: "uncertain",
				message: "Save outcome is uncertain. Check the saved note before trying again."
			}));
		} finally {
			a === o && (a = void 0), s === n && !w && (E().save === "checking-conflict" ? await de() : ie());
		}
	}
	async function ge(e, r) {
		let a = E();
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
			let i = await ae(e, s, r);
			if (w || s.signal.aborted || c !== n) return !1;
			if (document.visibilityState !== "visible") return D("Workspace hidden. Checking access on return."), !1;
			if ([
				401,
				403,
				426
			].includes(i.status)) return D(oe(i.status), !0), !1;
			if (i.status === 200) {
				let e = da(i.value);
				return se(e) ? (t.update((t) => ({
					...t,
					snapshot: t.snapshot ? {
						...t.snapshot,
						directory: e.directory
					} : void 0,
					directorySave: "idle",
					directoryMessage: "Saved to your account."
				})), !0) : (D("Your account scope changed. Open a fresh workspace.", !0), !1);
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
			return o === s && c === n && !w && t.update((e) => ({
				...e,
				directorySave: "uncertain",
				directoryMessage: "The save may have completed. Check saved services before making another change."
			})), !1;
		} finally {
			o === s && (o = void 0), c === n && !w && ie();
		}
	}
	function _e(e, t) {
		return ge("/api/owner/directory", {
			base_revision: e,
			change: t
		});
	}
	function ve(e) {
		let t = E().snapshot?.directory;
		return t ? ge("/api/workspace/pins", {
			base_directory_revision: t.revision,
			base_revision: t.pins_revision,
			ids: e
		}) : Promise.resolve(!1);
	}
	async function O(e, s) {
		let c = E();
		if (w || T || c.phase !== "ready" || !c.snapshot || u || a || o || d || c.layoutSave === "checking-conflict" || c.notificationSave !== "idle" || !["services", "connections"].includes(e) || !$(s, !0)) return;
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
			let r = await ae("/api/workspace/notifications/read", l, {
				category: e,
				through: s
			});
			if (w || l.signal.aborted || f !== n) return;
			if (document.visibilityState !== "visible") {
				D("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				D(oe(r.status), !0);
				return;
			}
			if (r.status === 409) throw Error("Read watermark changed");
			let i = r.value;
			if (r.status !== 200 || !Q(i)) throw Error("Read marker unavailable");
			if (i.product !== Vi || i.contract !== Hi || i.schema !== 1 || !Q(i.account) || i.account.id !== c.snapshot.account.id || i.account.username !== c.snapshot.account.username || i.account.role !== c.snapshot.account.role || i.session_generation !== c.snapshot.session_generation) {
				D("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let a = oa(i.notifications), o = a.groups.find((t) => t.category === e);
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
			u === l && f === n && !w && t.update((e) => ({
				...e,
				notificationSave: "uncertain",
				notificationMessage: "The read marker may have saved. Check notifications to see the current state."
			}));
		} finally {
			u === l && (u = void 0), f === n && !w && ie();
		}
	}
	function ye() {
		let e = E();
		e.phase !== "ready" || !e.snapshot || e.layoutDraft || a || o || u || d || (i?.abort(), i = void 0, r && clearTimeout(r), r = void 0, t.set({
			...e,
			layoutDraft: {
				base: e.snapshot.layout.revision,
				panels: e.snapshot.layout.panels.map((e) => ({ ...e }))
			},
			layoutSave: "idle",
			layoutMessage: "Arrange your Home panels, then save to your account."
		}), ie());
	}
	function k(e) {
		let n = E();
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
	function be(e, t) {
		let n = E().layoutDraft?.panels.map((e) => ({ ...e }));
		if (!n) return;
		let r = n.findIndex((t) => t.id === e), i = r + t;
		r < 0 || i < 0 || i >= n.length || ([n[r], n[i]] = [n[i], n[r]], k(n));
	}
	function xe(e) {
		let t = E().layoutDraft?.panels.map((e) => ({ ...e }));
		if (!t) return;
		let n = t.find((t) => t.id === e);
		!n || n.visible && t.filter((e) => e.visible).length === 1 || (n.visible = !n.visible, k(t));
	}
	function A() {
		k(Wi());
	}
	function Se() {
		let e = E();
		e.phase !== "ready" || [
			"saving",
			"checking-conflict",
			"uncertain"
		].includes(e.layoutSave) || (t.set({
			...e,
			layoutDraft: void 0,
			layoutSave: "idle",
			layoutMessage: "Your saved Home layout is in use."
		}), ie());
	}
	function Ce(e) {
		let n = E();
		n.phase === "ready" && n.snapshot && n.layoutDraft && n.layoutSave === "conflict" && (e ? Se() : t.set({
			...n,
			layoutDraft: {
				...n.layoutDraft,
				base: n.snapshot.layout.revision
			},
			layoutSave: "idle",
			layoutMessage: "Your arrangement is kept against the checked saved layout. Review, then save deliberately."
		}));
	}
	async function we() {
		let e = E();
		if (w || T || e.phase !== "ready" || !e.snapshot || !e.layoutDraft || e.layoutSave !== "idle" || a || o || u || d) return;
		let s = {
			base: e.layoutDraft.base,
			panels: e.layoutDraft.panels.map((e) => ({ ...e }))
		};
		if (!s.panels.some((e) => e.visible) || ua(s.panels, e.snapshot.layout.panels)) return;
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
			let r = await ae("/api/workspace/layout", c, {
				base_revision: s.base,
				panels: s.panels
			});
			if (w || c.signal.aborted || l !== n) return;
			if (document.visibilityState !== "visible") {
				D("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				D(oe(r.status), !0);
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
					D("Your account scope changed. Open a fresh workspace.", !0);
					return;
				}
				let i = sa(n.layout);
				if (BigInt(i.revision) !== BigInt(s.base) + 1n || !ua(i.panels, s.panels)) throw Error("Unqualified layout result");
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
			d === c && l === n && !w && t.update((e) => ({
				...e,
				layoutSave: "uncertain",
				layoutMessage: "The layout may have saved. Check the saved layout before saving again; your changes have not been sent again."
			}));
		} finally {
			d === c && (d = void 0), l === n && !w && (f ? await de(!0) : ie());
		}
	}
	async function Te(e = E().activity.category, r = E().activity.query, i = !1) {
		let a = E();
		if (w || T || a.phase !== "ready" || !a.snapshot || document.visibilityState !== "visible") return;
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
			let s = await ae(`/api/workspace/activity?${d}`, o);
			if (w || o.signal.aborted || c !== f || l !== n) return;
			if (document.visibilityState !== "visible") {
				D("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				D(oe(s.status), !0);
				return;
			}
			let p = s.value;
			if (s.status !== 200 || !Q(p) || p.product !== Vi || p.contract !== Hi || p.schema !== 1 || !Q(p.account) || p.account.id !== a.snapshot.account.id || p.account.role !== a.snapshot.account.role || p.account.username !== a.snapshot.account.username || p.session_generation !== a.snapshot.session_generation) {
				if (s.status === 200) {
					D("Your account scope changed. Open a fresh workspace.", !0);
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
			!w && c === f && l === n && t.update((t) => ({
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
	async function Ee(e = !1) {
		let r = E();
		if (w || T || r.phase !== "ready" || !r.snapshot || document.visibilityState !== "visible" || c || !e && r.guide.phase === "ready") return;
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
			let e = await ae("/api/workspace/guide", a);
			if (w || a.signal.aborted || o !== p || s !== n || !le(i)) return;
			if (document.visibilityState !== "visible") {
				D("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				D(oe(e.status), !0);
				return;
			}
			if (e.status !== 200) throw Error("Guide unavailable");
			if (!ce(e.value, i)) {
				D("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let r = ca(e.value);
			t.update((e) => ({
				...e,
				guide: {
					phase: "ready",
					value: r,
					message: "Workspace guide checked."
				}
			}));
		} catch {
			!w && o === p && s === n && le(i) && t.update((e) => ({
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
	async function De(e = !1) {
		let r = E();
		if (w || T || r.phase !== "ready" || !r.snapshot || document.visibilityState !== "visible") return;
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
			let r = await ae(`/api/workspace/observations${e ? `?${u}` : ""}`, o);
			if (w || o.signal.aborted || s !== m || c !== n || !le(a)) return;
			if (document.visibilityState !== "visible") {
				D("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				D(oe(r.status), !0);
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
			if (!ce(r.value, a)) {
				D("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let l = la(r.value, i, e);
			if (l.revision !== a.crafty?.revision || l.revision !== E().snapshot?.crafty?.revision) {
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
			!w && s === m && c === n && le(a) && t.update((e) => ({
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
	function Oe() {
		let e = E();
		if (w || T || e.phase !== "ready") return;
		let n = Math.floor(Date.now() / 1e3), r = !1, i = { ...e.media };
		for (let e of Yi) {
			let t = i[e].observation;
			if (!t) continue;
			let a = ga(t, n);
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
	function ke(e, n, r = !1) {
		let i = () => t.update((t) => ({
			...t,
			media: {
				...t.media,
				[e]: n
			}
		}));
		r ? jt(i) : i();
	}
	function Ae() {
		let e = E();
		return !w && !T && e.phase === "ready" && e.snapshot?.account.role === "owner" && document.visibilityState === "visible" ? e.snapshot : void 0;
	}
	function je(e) {
		++y[e], g[e]?.abort(), delete g[e];
	}
	function Me() {
		h = !1;
		for (let e of Yi) {
			je(e), ++b[e], _[e]?.abort(), delete _[e];
			let t = E().media[e], n = !!v[e];
			v[e]?.abort(), delete v[e], ke(e, {
				phase: "idle",
				save: n ? "uncertain" : t.save,
				message: n ? "The save may have completed. Check the connection state before another change." : t.save === "uncertain" || t.save === "conflict" ? t.message : ""
			}, !0);
		}
	}
	async function Ne(e, t = !0) {
		let r = Ae();
		if (!r || v[e]) return;
		h = !0, je(e), _[e]?.abort();
		let i = new AbortController();
		_[e] = i;
		let a = ++b[e], o = n, s = E().media[e];
		ke(e, {
			...s,
			phase: "loading",
			observation: void 0,
			message: "Checking the current enrollment…"
		}, !0);
		try {
			let s = await ae(`/api/owner/media/${e}`, i);
			if (w || i.signal.aborted || a !== b[e] || o !== n || !le(r)) return;
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				D(oe(s.status), !0);
				return;
			}
			let c = s.value;
			if (s.status !== 200 || !Q(c) || !$(c.revision) || typeof c.configured != "boolean") throw Error("Media enrollment unavailable");
			let l = E().media[e].status;
			if (l && BigInt(c.revision) < BigInt(l.revision)) throw Error("Older enrollment reply");
			ke(e, {
				phase: "ready",
				status: {
					revision: c.revision,
					configured: c.configured
				},
				save: "idle",
				message: c.configured ? "Enrollment checked. Only observation requests are sent." : "No connection is enrolled."
			}, !0), t && c.configured && await Fe(e);
		} catch {
			if (!w && a === b[e] && o === n && le(r)) {
				let t = E().media[e];
				ke(e, {
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
	async function Pe() {
		Ae() && (h = !0, await Promise.all(Yi.map((e) => Ne(e))));
	}
	async function Fe(e, t = 0) {
		let r = Ae();
		if (!r || !ha(t) || v[e]) return;
		h = !0, je(e);
		let i = new AbortController();
		g[e] = i;
		let a = y[e], o = n, s = E().media[e];
		ke(e, {
			...s,
			phase: "loading",
			observation: void 0,
			message: "Checking sampled media observations…"
		}, !0);
		try {
			let c = await ae(`/api/workspace/media/${e}?offset=${t}`, i);
			if (w || i.signal.aborted || a !== y[e] || o !== n || !le(r)) return;
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				D(oe(c.status), !0);
				return;
			}
			if (c.status === 409) {
				je(e), ke(e, {
					phase: "error",
					save: s.save,
					message: "Enrollment changed. Check the connection state before reading its new scope."
				}, !0);
				return;
			}
			if (c.status !== 200) throw Error("Media unavailable");
			if (!ce(c.value, r)) {
				D("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			if (c.value.provider !== e) throw Error("Wrong media provider");
			let l = _a(c.value.observation, e, t), u = E().media[e].status;
			if (u && BigInt(l.revision) < BigInt(u.revision)) throw Error("Older media scope");
			u?.revision !== l.revision && (++b[e], _[e]?.abort(), delete _[e]);
			let d = l.configured ? l.error === "checking" ? "A sample is being collected. Check observations again, or wait for the existing workspace access check." : l.error ? "This provider sample is unavailable or incomplete. Unknown values stay unknown." : l.complete ? "Media observations checked." : "A partial media sample is available; some details are unknown." : "No connection is enrolled.";
			ke(e, {
				phase: "ready",
				status: {
					revision: l.revision,
					configured: l.configured
				},
				observation: l,
				save: E().media[e].save,
				message: d
			}, !0);
		} catch {
			!w && a === y[e] && o === n && le(r) && ke(e, {
				...E().media[e],
				phase: "error",
				observation: void 0,
				message: "Media observations could not be checked. Retry deliberately; your workspace note is unchanged."
			}, !0);
		} finally {
			g[e] === i && delete g[e];
		}
	}
	async function Ie(e, t, r) {
		let i = Ae(), a = E().media[e];
		if (!i || v[e] || a.phase !== "ready" || a.save !== "idle" || a.status?.revision !== t || !$(t)) return;
		h = !0, je(e), ++b[e], _[e]?.abort(), delete _[e];
		let o = new AbortController();
		v[e] = o;
		let s = n;
		ke(e, {
			...a,
			observation: void 0,
			save: "saving",
			message: r ? "Saving the dedicated connection…" : "Removing the connection…"
		}, !0);
		try {
			let c = await ae(`/api/owner/media/${e}`, o, {
				base_revision: t,
				connection: r
			});
			if (w || o.signal.aborted || s !== n || !le(i) || v[e] !== o) return;
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				D(oe(c.status), !0);
				return;
			}
			if (c.status === 409) {
				ke(e, {
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
				ke(e, {
					...a,
					observation: void 0,
					save: "idle",
					message: "Connection not accepted. Check the address, library, certificate and broad-access acknowledgement."
				}, !0);
				return;
			}
			let l = c.value;
			if (c.status !== 200 || !Q(l) || !$(l.revision, !0) || BigInt(l.revision) !== BigInt(t) + 1n || l.configured !== (r !== null)) throw Error("Uncertain media save");
			ke(e, {
				phase: "ready",
				status: {
					revision: l.revision,
					configured: l.configured
				},
				save: "idle",
				message: r ? "Connection saved. Check its observations." : "Connection removed."
			}, !0);
		} catch {
			!w && s === n && le(i) && v[e] === o && ke(e, {
				phase: "error",
				save: "uncertain",
				message: "The save may have completed. Check the connection state before entering credentials again."
			}, !0);
		} finally {
			v[e] === o && delete v[e];
		}
	}
	function Le() {
		te(), D("Signing out…", !0);
		try {
			C?.postMessage({ kind: "auth-changed" });
		} catch {}
	}
	function Re() {
		let e = () => D("Workspace hidden. Checking access on return."), n = () => {
			de();
		}, r = () => {
			document.visibilityState === "visible" ? n() : e();
		};
		try {
			C = new BroadcastChannel("keida-hub-reborn.account.v1"), C.onmessage = (e) => {
				Q(e.data) && e.data.kind === "auth-changed" && D("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), de(), () => {
			w = !0, re(), C?.close(), t.set(Zi("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
		};
	}
	return {
		model: t,
		start: Re,
		edit: fe,
		recover: pe,
		resolve: me,
		save: he,
		signOut: Le,
		check: () => de(!0),
		editService: _e,
		pins: ve,
		activity: Te,
		markNotification: O,
		beginLayout: ye,
		moveLayout: be,
		toggleLayout: xe,
		resetLayout: A,
		cancelLayout: Se,
		resolveLayout: Ce,
		saveLayout: we,
		checkLayout: () => de(!0),
		loadGuide: Ee,
		observations: De,
		openMedia: Pe,
		closeMedia: Me,
		checkMedia: Ne,
		loadMedia: Fe,
		saveMedia: Ie
	};
}
// src/LayoutEditor.svelte
var ya = /* @__PURE__ */ K("<li tabindex=\"-1\"><label><input type=\"checkbox\"/><span> </span></label> <div class=\"layout-move\"><button class=\"button secondary layout-up\">↑<span class=\"sr-only\">Move up</span></button><button class=\"button secondary layout-down\">↓<span class=\"sr-only\">Move down</span></button></div></li>"), ba = /* @__PURE__ */ K("<li> </li>"), xa = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Layout conflict\"><h3>There’s a newer saved layout</h3><p>Your arrangement is still shown. Compare it with the saved order below before choosing what to keep.</p><ol></ol><div class=\"button-row\"><button class=\"button secondary\">Keep my layout against saved layout</button><button class=\"text-button layout-use-saved\">Use saved layout</button></div></section>"), Sa = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain layout\"><h3>Check before saving again</h3><p>The layout may have saved. Your arrangement has not been sent again.</p><button class=\"button secondary check-layout check-saved-layout\">Check saved layout</button></section>"), Ca = /* @__PURE__ */ K("<section class=\"layout-editor card\" aria-label=\"Home layout\"><h2>Make Home yours</h2><p>Choose the panels you see and their order. Keep at least one visible. Your other views and open forms stay available.</p> <ol class=\"layout-list\"></ol> <!> <!> <div class=\"button-row\"><button class=\"button primary save-layout\"> </button><button class=\"text-button cancel-layout\">Cancel layout</button><button class=\"text-button reset-layout\">Reset layout</button></div> <p class=\"field-help\">Reset previews the default order and visibility. Save layout applies it to this account.</p></section>");
function wa(e, t) {
	We(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = Z(t, "draft", 8), o = Z(t, "saved", 8), s = Z(t, "state", 8), c = Z(t, "authorized", 8), l = Z(t, "move", 8), u = Z(t, "toggle", 8), d = Z(t, "save", 8), f = Z(t, "cancel", 8), p = Z(t, "reset", 8), m = Z(t, "resolve", 8), h = Z(t, "check", 8);
	async function g(e, t) {
		l()(e, t), await pr(), document.querySelector(`[data-layout-row="${e}"]`)?.focus();
	}
	En(() => (W(c()), W(s())), () => {
		F(n, !c() || [
			"saving",
			"checking-conflict",
			"uncertain"
		].includes(s()));
	}), En(() => W(a()), () => {
		F(r, a()?.panels.filter((e) => e.visible).length ?? 0);
	}), En(() => (W(a()), W(o())), () => {
		F(i, !!a() && !!o() && a().panels.some((e, t) => e.id !== o()?.panels[t].id || e.visible !== o()?.panels[t].visible));
	}), Dn(), Ti();
	var _ = Ca(), v = R(I(_), 3);
	qr(v, 7, () => (W(a()), U(() => a()?.panels ?? [])), (e) => e.id, (e, t, i) => {
		var a = ya(), o = I(a), s = I(o);
		pi(s);
		var c = L(R(s), !0);
		A(o);
		var l = R(o, 2), d = I(l), f = R(d);
		A(l), A(a), z((e, o, l, u) => {
			X(a, "data-layout-row", (H(t), U(() => H(t).id))), X(s, "aria-label", e), hi(s, (H(t), U(() => H(t).visible))), s.disabled = (H(n), H(t), H(r), U(() => H(n) || H(t).visible && H(r) === 1)), J(c, o), X(d, "aria-label", l), d.disabled = H(n) || H(i) === 0, X(f, "aria-label", u), f.disabled = H(n) || H(i) === 2;
		}, [
			() => (W(Gi), H(t), U(() => `Show ${Gi(H(t).id)}`)),
			() => (W(Gi), H(t), U(() => Gi(H(t).id))),
			() => (W(Gi), H(t), U(() => `Move ${Gi(H(t).id)} up`)),
			() => (W(Gi), H(t), U(() => `Move ${Gi(H(t).id)} down`))
		]), G("change", s, () => u()(H(t).id)), G("click", d, () => g(H(t).id, -1)), G("click", f, () => g(H(t).id, 1)), q(e, a);
	}), A(v);
	var y = R(v, 2), b = (e) => {
		var t = xa(), n = R(I(t), 2);
		qr(n, 5, () => (W(o()), U(() => o()?.panels ?? [])), (e) => e.id, (e, t) => {
			var n = ba(), r = L(n);
			z((e) => J(r, `${e ?? ""} — ${H(t), U(() => H(t).visible ? "Shown" : "Hidden") ?? ""}`), [() => (W(Gi), H(t), U(() => Gi(H(t).id)))]), q(e, n);
		}), A(n);
		var r = R(n), i = I(r), a = R(i);
		A(r), A(t), G("click", i, () => m()(!1)), G("click", a, () => m()(!0)), q(e, t);
	};
	Y(y, (e) => {
		s() === "conflict" && e(b);
	});
	var x = R(y, 2), S = (e) => {
		var t = Sa(), n = R(I(t), 2);
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
wr(["change", "click"]);
// src/ObservationHistory.svelte
var Ta = /* @__PURE__ */ K("<p class=\"observation-empty\">No retained observations in this window. A connection must be enrolled and observed before samples appear.</p>"), Ea = /* @__PURE__ */ K("<p class=\"notice\"> </p>"), Da = /* @__PURE__ */ K("<p class=\"field-help\"> </p>"), Oa = /* @__PURE__ */ K("<section><h4> </h4> <dl><dt>Reported process</dt><dd> </dd> <dt>Players</dt><dd> </dd> <dt>Freshness at collection</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd></dl> <!></section>"), ka = /* @__PURE__ */ K("<li><div class=\"guide-card-heading\"><h3> </h3><time> </time></div> <p class=\"observation-completeness\"> </p> <!> <div class=\"observation-servers\"></div></li>"), Aa = /* @__PURE__ */ K("<p class=\"quiet-label\"> </p> <!> <ol class=\"observation-list\"></ol>", 1), ja = /* @__PURE__ */ K("<section class=\"card observation-history\" aria-label=\"Provider observation history\"><p class=\"eyebrow\">RETAINED PROVIDER SAMPLES</p><h2 tabindex=\"-1\">Crafty observation history</h2> <p>Samples are collected while an authorized workspace checks the enrolled connection. At most the first sample per enrollment revision each minute is retained, up to the newest 10,000 batches.</p> <p class=\"field-help\">This is sampled, on-demand history. Gaps do not establish downtime, and a process or player report does not establish game readiness. Freshness below describes the sample at collection time.</p> <p> </p> <p class=\"workspace-status observation-status\" role=\"status\"> </p> <!> <div class=\"button-row\"><button class=\"button secondary observation-newest\">Check newest observations</button><button class=\"button secondary observation-older\">Older observations</button><button class=\"text-button\">Check current connection</button></div> <p class=\"field-help\">Up to 25 batches per page. New samples appear when you check newest. Older pages use the same history window; retention can shorten that window as new samples arrive. Reading history does not contact Crafty.</p></section>");
function Ma(e, t) {
	We(t, !1);
	let n = Z(t, "state", 8), r = Z(t, "authorized", 8, !1), i = Z(t, "owner", 8, !1), a = Z(t, "load", 8), o = Z(t, "checkConnection", 8), s = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString(), c = (e) => e === "denied" ? "Provider access denied" : e === "timeout" ? "Provider timed out" : e === "transport" ? "Provider could not be reached" : e === "not_discovered" ? "Selected server was not discovered" : e === "malformed" ? "Provider response was incomplete or malformed" : e === "oversized" ? "Provider response exceeded the observation limit" : e === "invalid_configuration" ? "Connection could not be checked" : e ? "Provider observation unavailable" : "";
	Ti();
	var l = ja(), u = R(I(l), 7), d = L(u, !0), f = R(u, 2), p = L(f, !0), m = R(f, 2), h = (e) => {
		var t = Aa(), r = ln(t), i = L(r), a = R(r, 2), o = (e) => {
			q(e, Ta());
		};
		Y(a, (e) => {
			W(n()), U(() => n().entries.length === 0) && e(o);
		});
		var l = R(a, 2);
		qr(l, 5, () => (W(n()), U(() => n().entries)), (e) => e.id, (e, t) => {
			var n = ka(), r = I(n), i = I(r), a = L(i), o = R(i), l = L(o, !0);
			A(r);
			var u = R(r, 2), d = L(u, !0), f = R(u, 2), p = (e) => {
				var n = Ea(), r = L(n, !0);
				z((e) => J(r, e), [() => (H(t), U(() => c(H(t).error)))]), q(e, n);
			};
			Y(f, (e) => {
				H(t), U(() => H(t).error) && e(p);
			});
			var m = R(f, 2);
			qr(m, 5, () => (H(t), U(() => H(t).servers)), Ur, (e, t) => {
				var n = Oa(), r = I(n), i = L(r, !0), a = R(r, 2), o = R(I(a)), l = L(o, !0), u = R(o, 3), d = L(u), f = R(u, 3), p = L(f, !0), m = R(f, 3), h = L(m, !0), g = L(R(m, 2), !0);
				A(a);
				var _ = R(a, 2), v = (e) => {
					var n = Da(), r = L(n, !0);
					z((e) => J(r, e), [() => (H(t), U(() => c(H(t).error)))]), q(e, n);
				};
				Y(_, (e) => {
					H(t), U(() => H(t).error) && e(v);
				}), A(n), z((e, r) => {
					X(n, "aria-label", (H(t), U(() => `Observation for ${H(t).name}`))), J(i, (H(t), U(() => H(t).name))), J(l, (H(t), U(() => H(t).state === "running" ? "Running" : H(t).state === "stopped" ? "Stopped" : "Unknown"))), J(d, `${H(t), U(() => H(t).players === null ? "Not reported" : `${H(t).players} reported`) ?? ""}${H(t), U(() => H(t).capacity === null ? "" : ` / ${H(t).capacity} capacity`) ?? ""}`), J(p, (H(t), U(() => H(t).freshness === "fresh" ? "Fresh at collection" : H(t).freshness === "stale" ? "Stale at collection" : "Sample age was unknown"))), J(h, e), J(g, r);
				}, [() => (H(t), U(() => s(H(t).collected_at))), () => (H(t), U(() => s(H(t).provider_at)))]), q(e, n);
			}), A(m), A(n), z((e, r) => {
				X(n, "data-observation-id", (H(t), U(() => H(t).id))), X(n, "data-observation-revision", (H(t), U(() => H(t).revision))), J(a, `Enrollment revision ${H(t), U(() => H(t).revision) ?? ""}`), X(o, "datetime", e), J(l, r), J(d, (H(t), U(() => H(t).complete ? "Complete provider sample" : "Incomplete provider sample")));
			}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).checked_at) * 1e3)).toISOString())), () => (H(t), U(() => s(H(t).checked_at)))]), q(e, n);
		}), A(l), z(() => {
			X(r, "data-current-revision", (W(n()), U(() => n().revision))), J(i, `Current enrollment revision ${W(n()), U(() => n().revision) ?? ""}`);
		}), q(e, t);
	};
	Y(m, (e) => {
		W(r()), W(n()), U(() => r() && n().phase === "ready") && e(h);
	});
	var g = R(m, 2), _ = I(g), v = R(_), y = R(v);
	A(g), Se(2), A(l), z(() => {
		J(d, i() ? "Your owner account can review retained samples from prior enrollment revisions." : "Your account sees samples only for the currently enrolled servers. Replacing or removing a connection changes this history scope."), J(p, (W(n()), U(() => n().message))), _.disabled = (W(r()), W(n()), U(() => !r() || n().phase === "loading")), v.disabled = (W(r()), W(n()), U(() => !r() || n().phase !== "ready" || !n().next)), y.disabled = !r();
	}), G("click", _, () => void a()()), G("click", v, () => void a()(!0)), G("click", y, () => void o()()), q(e, l), Ge();
}
wr(["click"]);
// src/Connections.svelte
var Na = /* @__PURE__ */ K("<p class=\"notice\" role=\"status\">This observation could not be added to history. Your workspace is still available; retained history may be incomplete.</p>"), Pa = /* @__PURE__ */ K("<section class=\"card small-card\"><h2>No Crafty connection enrolled</h2><p>An owner can add dedicated access and choose which servers to show.</p></section>"), Fa = /* @__PURE__ */ K("<p class=\"notice\" role=\"status\"> </p>"), Ia = /* @__PURE__ */ K("<p class=\"field-help\">This server could not be fully observed.</p>"), La = /* @__PURE__ */ K("<article class=\"card small-card server-card\"><h2> </h2> <p><strong> </strong> <span class=\"field-help\">Provider-reported process state</span></p> <dl><dt>Players</dt><dd> </dd> <dt>Freshness</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd> <dt>Join address</dt><dd> </dd></dl> <!></article>"), Ra = /* @__PURE__ */ K("<!> <div class=\"server-grid\"></div> <p class=\"field-help\">A running process does not establish game readiness. Join addresses are owner-reviewed; outside-network joining is accepted separately.</p>", 1), za = /* @__PURE__ */ K("<button class=\"button secondary\">Check connection state</button>"), Ba = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove server</button>"), Va = /* @__PURE__ */ K("<fieldset><legend> </legend> <label>Crafty server UUID</label><input name=\"server-id\" required=\"\" maxlength=\"36\"/> <label>Display name</label><input name=\"server-name\" required=\"\" maxlength=\"80\"/> <label>Reviewed public join address, optional</label><input name=\"server-join\" maxlength=\"253\" placeholder=\"play.example:25565\"/> <!></fieldset>"), Ha = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove connection</button>"), Ua = /* @__PURE__ */ K("<section class=\"card connection-setup\" aria-label=\"Dedicated Crafty enrollment\"><h2>Dedicated Crafty access</h2> <p>Create access specifically for Reborn, limited to viewing the selected servers. Credentials are encrypted on the server and are not shown again.</p> <p class=\"workspace-status\" role=\"status\"> </p> <!> <form autocomplete=\"off\"><label for=\"crafty-endpoint\">Crafty HTTPS address</label><input id=\"crafty-endpoint\" name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\" placeholder=\"https://crafty.example/\"/> <label for=\"crafty-token\">Dedicated API token</label><input id=\"crafty-token\" name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label for=\"crafty-timezone\">Crafty’s configured time zone</label><input id=\"crafty-timezone\" name=\"timezone\" required=\"\" maxlength=\"64\" placeholder=\"America/Chicago or UTC\"/> <label for=\"crafty-ca\">Private CA certificate, if needed</label><textarea id=\"crafty-ca\" name=\"ca-pem\" maxlength=\"8192\" rows=\"3\"></textarea> <p class=\"field-help\">Leave the certificate blank for publicly trusted HTTPS. The address and certificate must pass normal hostname and trust checks.</p> <!> <div class=\"button-row\"><button class=\"button secondary\" type=\"button\">Add server</button> <button class=\"button primary\" type=\"submit\"> </button></div></form> <!></section>"), Wa = /* @__PURE__ */ K("<div><div class=\"button-row\"><button class=\"text-button\">View connection enrollment history</button><button class=\"text-button view-observation-history\">View provider observation history</button></div> <!> <div class=\"connections-intro\"><p>Server observations from your deliberately enrolled Crafty connection.</p><span class=\"quiet-label\">Read-only overview</span></div> <!> <!></div> <div><button class=\"text-button observation-back\">Back to connections</button> <!></div>", 1);
function Ga(e, t) {
	We(t, !1);
	let n = Z(t, "binding", 8), r = Z(t, "history", 8), i = Z(t, "overview", 8), a = Z(t, "owner", 8, !1), o = Z(t, "active", 8, !1), s = Z(t, "refresh", 8), c = Z(t, "observationState", 8), l = Z(t, "loadObservations", 8), u = /* @__PURE__ */ P(), d = /* @__PURE__ */ P([0]), f = /* @__PURE__ */ P(0), p = /* @__PURE__ */ P(), m = /* @__PURE__ */ P(""), h = /* @__PURE__ */ P(!1), g = 0, _ = /* @__PURE__ */ P(!1), v = /* @__PURE__ */ P(), y = /* @__PURE__ */ P(), b = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
	function x() {
		++g, H(p)?.abort(), F(p, void 0), H(u)?.reset(), F(d, [Jt(f)]), F(m, ""), F(h, !1);
	}
	Li(x);
	async function S() {
		o() && (F(_, !0), l()(), await pr(), H(y)?.querySelector("h2")?.focus());
	}
	async function C() {
		F(_, !1), await pr(), H(v)?.focus();
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
		H(u)?.reset(), F(d, [Jt(f)]);
		let b = new AbortController();
		F(p, b);
		let x = ++g, S = setTimeout(() => b.abort(), 4e3);
		F(m, e ? "Removing the connection…" : "Saving the dedicated connection…");
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
			if (r.status === 200) F(m, e ? "Connection removed." : "Connection saved. Checking provider observations…");
			else if (r.status === 409) F(m, "The connection changed elsewhere. Check its current state before enrolling again.");
			else if ([
				400,
				401,
				403,
				413,
				426
			].includes(r.status)) F(m, "Connection not accepted. Check your account and the dedicated connection details.");
			else throw Error("Uncertain connection outcome");
			await s()();
		} catch {
			x === g && o() && (F(h, !0), F(m, "The save outcome is uncertain. Check the connection before entering credentials again."));
		} finally {
			clearTimeout(S), H(p) === b && F(p, void 0);
		}
	}
	async function T() {
		await s()(), o() && (F(h, !1), F(m, "Review the current connection state before making another change."));
	}
	En(() => W(o()), () => {
		o() || (x(), F(_, !1));
	}), Dn(), Ti();
	var E = Wa(), ee = ln(E), te = I(ee), ne = I(te), re = R(ne);
	wi(re, (e) => F(v, e), () => H(v)), A(te);
	var D = R(te, 2), ie = (e) => {
		q(e, Na());
	};
	Y(D, (e) => {
		W(i()), U(() => i()?.history_error === "unavailable") && e(ie);
	});
	var ae = R(D, 4), oe = (e) => {
		q(e, Pa());
	}, se = (e) => {
		var t = Ra(), n = ln(t), r = (e) => {
			var t = Fa(), n = L(t, !0);
			z(() => J(n, (W(i()), U(() => i().error === "checking" ? "Checking the provider. Fresh results will appear on the next observation." : "Provider observations are unavailable or incomplete. Unknown player counts stay unknown.")))), q(e, t);
		};
		Y(n, (e) => {
			W(i()), U(() => i().error) && e(r);
		});
		var a = R(n, 2);
		qr(a, 5, () => (W(i()), U(() => i().servers)), Ur, (e, t) => {
			var n = La(), r = I(n), i = L(r, !0), a = R(r, 2), o = L(I(a), !0);
			Se(2), A(a);
			var s = R(a, 2), c = R(I(s)), l = L(c), u = R(c, 3), d = L(u, !0), f = R(u, 3), p = L(f, !0), m = R(f, 2), h = L(m, !0), g = L(R(m, 3), !0);
			A(s);
			var _ = R(s, 2), v = (e) => {
				q(e, Ia());
			};
			Y(_, (e) => {
				H(t), U(() => H(t).error) && e(v);
			}), A(n), z((e, n) => {
				J(i, (H(t), U(() => H(t).name))), J(o, (H(t), U(() => H(t).state === "running" ? "Running" : H(t).state === "stopped" ? "Stopped" : "Unknown"))), J(l, `${H(t), U(() => H(t).players === null ? "Not reported" : `${H(t).players} reported`) ?? ""}${H(t), U(() => H(t).capacity === null ? "" : ` / ${H(t).capacity} capacity`) ?? ""}`), J(d, (H(t), U(() => H(t).freshness === "fresh" ? "Recent provider sample" : H(t).freshness === "stale" ? "Stale provider sample" : "Provider sample age unknown"))), J(p, e), J(h, n), J(g, (H(t), U(() => H(t).join || "Not configured")));
			}, [() => (H(t), U(() => b(H(t).collected_at))), () => (H(t), U(() => b(H(t).provider_at)))]), q(e, n);
		}), A(a), Se(2), q(e, t);
	};
	Y(ae, (e) => {
		W(i()), U(() => !i() || !i().configured) ? e(oe) : e(se, -1);
	});
	var ce = R(ae, 2), le = (e) => {
		var t = Ua(), n = R(I(t), 4), r = L(n, !0), a = R(n, 2), o = (e) => {
			var t = za();
			G("click", t, () => void T()), q(e, t);
		};
		Y(a, (e) => {
			H(h) && e(o);
		});
		var s = R(a, 2), c = R(I(s)), l = R(c, 3), g = R(l, 3), _ = R(g, 3), v = R(_, 4);
		qr(v, 3, () => H(d), (e) => e, (e, t, n) => {
			var r = Va(), i = I(r), a = L(i), o = R(i, 2), s = R(o), c = R(s, 2), l = R(c), u = R(l, 2), f = R(u), m = R(f, 2), g = (e) => {
				var n = Ba();
				z(() => n.disabled = !!H(p) || H(h)), G("click", n, () => F(d, H(d).filter((e) => e !== H(t)))), q(e, n);
			};
			Y(m, (e) => {
				H(d), U(() => H(d).length > 1) && e(g);
			}), A(r), z(() => {
				J(a, `Server ${H(n) + 1}`), X(o, "for", `crafty-id-${H(t)}`), X(s, "id", `crafty-id-${H(t)}`), s.disabled = !!H(p) || H(h), X(c, "for", `crafty-name-${H(t)}`), X(l, "id", `crafty-name-${H(t)}`), l.disabled = !!H(p) || H(h), X(u, "for", `crafty-join-${H(t)}`), X(f, "id", `crafty-join-${H(t)}`), f.disabled = !!H(p) || H(h);
			}), q(e, r);
		});
		var y = R(v, 2), b = I(y), x = R(b, 2), S = L(x, !0);
		A(y), A(s), wi(s, (e) => F(u, e), () => H(u));
		var C = R(s, 2), E = (e) => {
			var t = Ha();
			z(() => t.disabled = !!H(p) || H(h)), G("click", t, () => void w(!0)), q(e, t);
		};
		Y(C, (e) => {
			W(i()), U(() => i()?.configured) && e(E);
		}), A(t), z(() => {
			J(r, H(m)), c.disabled = !!H(p) || H(h), l.disabled = !!H(p) || H(h), g.disabled = !!H(p) || H(h), _.disabled = !!H(p) || H(h), b.disabled = (H(d), H(p), H(h), U(() => H(d).length >= 8 || !!H(p) || H(h))), x.disabled = !!H(p) || H(h) || !i(), J(S, H(p) ? "Working…" : "Save dedicated connection");
		}), Cr("submit", s, (e) => {
			e.preventDefault(), w();
		}), G("click", b, () => F(d, [...H(d), Jt(f)])), q(e, t);
	};
	Y(ce, (e) => {
		a() && o() && e(le);
	}), A(ee);
	var ue = R(ee, 2), de = I(ue);
	Ma(R(de, 2), {
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
	}), A(ue), wi(ue, (e) => F(y, e), () => H(y)), z(() => {
		X(ee, "hidden", H(_)), re.disabled = !o(), X(ue, "hidden", !H(_));
	}), G("click", ne, function(...e) {
		r()?.apply(this, e);
	}), G("click", re, () => void S()), G("click", de, () => void C()), q(e, E), Ge();
}
wr(["click"]);
// src/Directory.svelte
var Ka = /* @__PURE__ */ K("<button class=\"text-button\">Browse services <span aria-hidden=\"true\">→</span></button>"), qa = /* @__PURE__ */ K("<section class=\"notice\"><h3>Review the saved state</h3><p> </p><button class=\"button secondary\">Check saved services</button></section>"), Ja = /* @__PURE__ */ K("<option> </option>"), Ya = /* @__PURE__ */ K("<div class=\"directory-filters\"><div><label for=\"service-search\">Search services</label><input id=\"service-search\" type=\"search\" maxlength=\"120\" placeholder=\"Name, category or description\"/></div><div><label for=\"service-filter\">Category</label><select id=\"service-filter\"><option>All categories</option><!></select></div></div>"), Xa = /* @__PURE__ */ K("<section class=\"card small-card\"><h3> </h3><p> </p></section>"), Za = /* @__PURE__ */ K("<p> </p>"), Qa = /* @__PURE__ */ K("<button class=\"text-button move-up\">↑</button><button class=\"text-button move-down\">↓</button>", 1), $a = /* @__PURE__ */ K("<p>The directory changed. Review the service and choose Remove again.</p>"), eo = /* @__PURE__ */ K("<div class=\"notice\"><p> </p><!><div class=\"button-row\"><button class=\"button secondary confirm-remove\">Remove service</button><button class=\"text-button\">Keep service</button></div></div>"), to = /* @__PURE__ */ K("<div class=\"button-row\"><button class=\"text-button edit-service\"> </button><button class=\"text-button remove-service\">Remove</button></div> <!>", 1), no = /* @__PURE__ */ K("<article class=\"card small-card service-card\"><p class=\"eyebrow\"> </p><h3><a class=\"service-link\" target=\"_blank\" rel=\"noopener noreferrer\"> <span class=\"sr-only\">(opens in a new tab)</span> <span aria-hidden=\"true\">↗</span></a></h3> <!> <p class=\"field-help service-address\"> </p> <div class=\"button-row\"><button class=\"button secondary pin-service\"> </button> <!></div> <!></article>"), ro = /* @__PURE__ */ K("<div class=\"directory-grid\"></div>"), io = /* @__PURE__ */ K("<p class=\"field-help\">Up to 24 personal pins. Links open the selected service in a new tab. Each service handles its own sign-in; directory links do not check availability.</p>"), ao = /* @__PURE__ */ K("<div class=\"notice\"><p>The directory changed after this form was opened. Review the current entries, then choose whether to keep this edit.</p><button class=\"button secondary\" type=\"button\">Keep edit against current directory</button></div>"), oo = /* @__PURE__ */ K("<section class=\"card directory-editor\" aria-label=\"Service editor\"><h2> </h2><p>Add a reviewed HTTPS link without passwords, tokens, query parameters or fragments. These links are visible to signed-in accounts.</p> <form><label for=\"service-name\">Service name</label><input id=\"service-name\" name=\"service-name\" required=\"\" maxlength=\"80\"/> <label for=\"service-category\">Category</label><input id=\"service-category\" name=\"service-category\" required=\"\" maxlength=\"40\"/> <label for=\"service-url\">HTTPS link</label><input id=\"service-url\" name=\"service-url\" type=\"url\" required=\"\" maxlength=\"1024\" placeholder=\"https://service.example/\"/> <label for=\"service-description\">Description, optional</label><textarea id=\"service-description\" name=\"service-description\" maxlength=\"240\" rows=\"2\"></textarea> <!> <div class=\"button-row\"><button class=\"button primary\" type=\"submit\"> </button><button class=\"text-button\" type=\"button\"> </button></div></form></section>"), so = /* @__PURE__ */ K("<div class=\"directory-heading\"><div><p class=\"eyebrow\"> </p><h2> </h2></div><!></div> <p class=\"directory-status\" role=\"status\"> </p> <!> <!> <!> <!> <!>", 1);
function co(e, t) {
	We(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = Z(t, "directory", 8), o = Z(t, "authorized", 8, !1), s = Z(t, "owner", 8, !1), c = Z(t, "compact", 8, !1), l = Z(t, "state", 8), u = Z(t, "message", 8), d = Z(t, "browse", 8), f = Z(t, "check", 8), p = Z(t, "edit", 8), m = Z(t, "pin", 8), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P(""), _ = /* @__PURE__ */ P(""), v = /* @__PURE__ */ P(""), y = /* @__PURE__ */ P(""), b = /* @__PURE__ */ P(""), x = /* @__PURE__ */ P(""), S = /* @__PURE__ */ P(), C = /* @__PURE__ */ P(), w = 0;
	function T() {
		++w, F(h, ""), F(g, ""), F(_, ""), F(v, ""), F(y, ""), F(b, ""), F(x, ""), F(C, void 0), F(S, void 0);
	}
	Li(T);
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
	async function D(e) {
		if (H(n) || !a() || !s() || H(C)?.id !== e) return;
		let t = w;
		await p()(H(C).base, {
			action: "delete",
			id: e
		}) && o() && t === w && (await pr(), o() && t === w && (F(C, void 0), H(x) === e && E()));
	}
	En(() => (W(l()), W(o())), () => {
		F(n, l() === "saving" || l() === "uncertain" || !o());
	}), En(() => W(a()), () => {
		F(r, [...new Set(a()?.services.map((e) => e.category) ?? [])].sort());
	}), En(() => (H(g), H(r)), () => {
		H(g) && !H(r).includes(H(g)) && F(g, "");
	}), En(() => (W(a()), W(c()), H(g), H(h)), () => {
		F(i, [...a()?.services ?? []].sort((e, t) => {
			let n = a()?.pins.indexOf(e.id) ?? -1, r = a()?.pins.indexOf(t.id) ?? -1;
			return n >= 0 || r >= 0 ? (n < 0 ? 25 : n) - (r < 0 ? 25 : r) : e.name.localeCompare(t.name) || Number(BigInt(e.id) - BigInt(t.id));
		}).filter((e) => c() ? a()?.pins.includes(e.id) : (!H(g) || e.category === H(g)) && `${e.name} ${e.category} ${e.description}`.toLocaleLowerCase().includes(H(h).toLocaleLowerCase())));
	}), En(() => W(o()), () => {
		o() || T();
	}), En(() => (W(o()), W(a()), H(S)), () => {
		o() && a() && H(S) === void 0 && F(S, a().revision);
	}), Dn(), Ti();
	var ie = so(), ae = ln(ie), oe = I(ae), se = I(oe), ce = L(se, !0), le = L(R(se), !0);
	A(oe);
	var ue = R(oe), de = (e) => {
		var t = Ka();
		G("click", t, function(...e) {
			d()?.apply(this, e);
		}), q(e, t);
	};
	Y(ue, (e) => {
		c() && e(de);
	}), A(ae);
	var fe = R(ae, 2), pe = L(fe, !0), me = R(fe, 2), he = (e) => {
		var t = qa(), n = R(I(t)), r = L(n, !0), i = R(n);
		A(t), z(() => J(r, l() === "uncertain" ? "Your change has not been sent again." : "Your edit is still in the form. Compare it with the current directory before saving.")), G("click", i, () => void f()()), q(e, t);
	};
	Y(me, (e) => {
		(l() === "uncertain" || l() === "conflict") && e(he);
	});
	var ge = R(me, 2), _e = (e) => {
		var t = Ya(), n = I(t), i = R(I(n));
		pi(i), A(n);
		var a = R(n), o = R(I(a)), s = I(o);
		s.value = s.__value = "", qr(R(s), 1, () => H(r), Ur, (e, t) => {
			var n = Ja(), r = L(n, !0), i = {};
			z(() => {
				J(r, H(t)), i !== (i = H(t)) && (n.value = (n.__value = i) ?? "");
			}), q(e, n);
		}), A(o), ai(o), A(a), A(t), yi(i, () => H(h), (e) => F(h, e)), oi(o, () => H(g), (e) => F(g, e)), q(e, t);
	};
	Y(ge, (e) => {
		c() || e(_e);
	});
	var ve = R(ge, 2), O = (e) => {
		var t = Xa(), n = I(t), r = L(n, !0), i = L(R(n), !0);
		A(t), z(() => {
			J(r, (W(c()), W(a()), U(() => c() ? "Keep your favorites close" : a()?.services.length ? "No matching services" : "Your directory starts here"))), J(i, (W(c()), W(a()), W(s()), U(() => c() ? "Pin services from the directory to show them on Home." : a()?.services.length ? "Try another search or category." : s() ? "Add a service below to make it available to signed-in accounts." : "An owner can add reviewed service links.")));
		}), q(e, t);
	}, ye = (e) => {
		var t = ro();
		qr(t, 5, () => H(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ M(() => (W(a()), H(t), U(() => a()?.pins.includes(H(t).id) ?? !1))), i = /* @__PURE__ */ M(() => (W(a()), H(t), U(() => a()?.pins.indexOf(H(t).id) ?? -1)));
			var o = no(), l = I(o), u = L(l, !0), d = R(l), f = I(d), p = I(f, !0);
			Se(3), A(f), A(d);
			var m = R(d, 2), h = (e) => {
				var n = Za(), r = L(n, !0);
				z(() => J(r, (H(t), U(() => H(t).description)))), q(e, n);
			};
			Y(m, (e) => {
				H(t), U(() => H(t).description) && e(h);
			});
			var g = R(m, 2), _ = L(g, !0), v = R(g, 2), y = I(v), b = L(y, !0), x = R(y, 2), S = (e) => {
				var r = Qa(), o = ln(r), s = R(o);
				z(() => {
					X(o, "aria-label", (H(t), U(() => `Move ${H(t).name} up`))), o.disabled = H(n) || H(i) === 0, X(s, "aria-label", (H(t), U(() => `Move ${H(t).name} down`))), s.disabled = (H(n), W(H(i)), W(a()), U(() => H(n) || H(i) === (a()?.pins.length ?? 0) - 1));
				}), G("click", o, () => re(H(t).id, -1)), G("click", s, () => re(H(t).id, 1)), q(e, r);
			};
			Y(x, (e) => {
				H(r) && e(S);
			}), A(v);
			var w = R(v, 2), T = (e) => {
				var r = to(), i = ln(r), o = I(i), s = L(o), c = R(o);
				A(i);
				var l = R(i, 2), u = (e) => {
					var r = eo(), i = I(r), o = L(i), s = R(i), c = (e) => {
						q(e, $a());
					};
					Y(s, (e) => {
						H(C), W(a()), U(() => H(C).base !== a()?.revision) && e(c);
					});
					var l = R(s), u = I(l), d = R(u);
					A(l), A(r), z(() => {
						J(o, `Remove ${H(C), U(() => H(C).name) ?? ""} from the directory and everyone’s pins?`), u.disabled = (H(n), H(C), W(a()), U(() => H(n) || H(C).base !== a()?.revision));
					}), G("click", u, () => void D(H(t).id)), G("click", d, () => F(C, void 0)), q(e, r);
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
		q(e, io());
	};
	Y(k, (e) => {
		c() || e(be);
	});
	var xe = R(k, 2), Ce = (e) => {
		var t = oo(), r = I(t), i = L(r, !0), o = R(r, 3), s = R(I(o));
		pi(s);
		var u = R(s, 3);
		pi(u);
		var d = R(u, 3);
		pi(d);
		var f = R(d, 3);
		nt(f);
		var p = R(f, 2), m = (e) => {
			var t = ao(), r = R(I(t));
			A(t), z(() => r.disabled = H(n)), G("click", r, () => F(S, a()?.revision)), q(e, t);
		};
		Y(p, (e) => {
			H(S), W(a()), U(() => H(S) !== void 0 && a() && H(S) !== a().revision) && e(m);
		});
		var h = R(p, 2), g = I(h), C = L(g, !0), w = R(g), T = L(w, !0);
		A(h), A(o), A(t), z(() => {
			X(t, "hidden", c()), J(i, H(x) ? "Edit service" : "Add a service"), s.disabled = H(n), u.disabled = H(n), d.disabled = H(n), f.disabled = H(n), g.disabled = (H(n), H(S), W(a()), U(() => H(n) || H(S) !== a()?.revision)), J(C, l() === "saving" ? "Saving…" : H(x) ? "Save service" : "Add service"), w.disabled = H(n), J(T, H(x) ? "Cancel edit" : "Clear form");
		}), Cr("submit", o, (e) => {
			e.preventDefault(), te();
		}), yi(s, () => H(_), (e) => F(_, e)), yi(u, () => H(b), (e) => F(b, e)), yi(d, () => H(y), (e) => F(y, e)), yi(f, () => H(v), (e) => F(v, e)), G("click", w, E), q(e, t);
	};
	Y(xe, (e) => {
		s() && o() && e(Ce);
	}), z(() => {
		J(ce, c() ? "YOUR SHORTCUTS" : "A PLACE FOR YOUR SERVICES"), J(le, c() ? "Pinned services" : "Service directory"), J(pe, u());
	}), q(e, ie), Ge();
}
wr(["click"]);
// src/Activity.svelte
var lo = /* @__PURE__ */ K("<p class=\"activity-empty\">No matching activity in this window. Try another action name or check the newest entries.</p>"), uo = /* @__PURE__ */ K("<li><div><strong> </strong><p> </p></div><time> </time></li>"), fo = /* @__PURE__ */ K("<!> <ol class=\"activity-list\"></ol> <div class=\"button-row\"><button class=\"button secondary\">Check newest activity</button><button class=\"button secondary\">Older activity</button></div> <p class=\"field-help\">Up to 25 entries per page. New changes appear when you check newest; older pages stay within the current history window. Search matches action names, not note or credential contents.</p>", 1), po = /* @__PURE__ */ K("<button class=\"button secondary\">Retry activity</button>"), mo = /* @__PURE__ */ K("<button class=\"button secondary\">Check activity</button>"), ho = /* @__PURE__ */ K("<section class=\"card activity-card\" aria-label=\"Your retained activity\"><h2>Your activity</h2> <p>Successful changes made by your account, retained from the introduction of Activity. Connection entries describe enrollment changes, not game actions or provider uptime.</p> <form class=\"activity-search\"><div><label for=\"activity-query\">Search action names</label><input id=\"activity-query\" maxlength=\"80\" placeholder=\"For example, saved or Crafty\"/></div> <div><label for=\"activity-category\">Activity category</label><select id=\"activity-category\"><option>All activity</option><option>Workspace notes</option><option>Services and pins</option><option>Connection enrollment</option></select></div> <button type=\"submit\" class=\"button primary\">Search activity</button></form> <p class=\"workspace-status\" role=\"status\"> </p> <!></section>");
function go(e, t) {
	We(t, !1);
	let n = Z(t, "state", 8), r = Z(t, "authorized", 8, !1), i = Z(t, "load", 8), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P("all"), s = /* @__PURE__ */ P(), c = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	En(() => W(r()), () => {
		r() || (F(a, ""), F(o, "all"), F(s, void 0));
	}), En(() => (W(n()), H(s)), () => {
		n() !== H(s) && n().phase === "loading" && (F(s, n()), F(a, n().query), F(o, n().category));
	}), Dn(), Ti();
	var l = ho(), u = R(I(l), 4), d = I(u), f = R(I(d));
	pi(f), A(d);
	var p = R(d, 2), m = R(I(p)), h = I(m);
	h.value = h.__value = "all";
	var g = R(h);
	g.value = g.__value = "workspace";
	var _ = R(g);
	_.value = _.__value = "directory";
	var v = R(_);
	v.value = v.__value = "connections", A(m), ai(m), A(p);
	var y = R(p, 2);
	A(u);
	var b = R(u, 2), x = L(b, !0), S = R(b, 2), C = (e) => {
		var t = fo(), r = ln(t), a = (e) => {
			q(e, lo());
		};
		Y(r, (e) => {
			W(n()), U(() => n().entries.length === 0) && e(a);
		});
		var o = R(r, 2);
		qr(o, 5, () => (W(n()), U(() => n().entries)), (e) => e.id, (e, t) => {
			var n = uo(), r = I(n), i = I(r), a = L(i, !0), o = L(R(i));
			A(r);
			var s = R(r), l = L(s, !0);
			A(n), z((e, r) => {
				X(n, "data-activity-id", (H(t), U(() => H(t).id))), J(a, (H(t), U(() => H(t).label))), J(o, `Revision ${H(t), U(() => H(t).revision) ?? ""} · ${H(t), U(() => H(t).category === "connections" ? "Connection enrollment" : H(t).category === "directory" ? "Services and pins" : "Workspace note") ?? ""}`), X(s, "datetime", e), J(l, r);
			}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => c(H(t).occurred_at)))]), q(e, n);
		}), A(o);
		var s = R(o, 2), l = I(s), u = R(l);
		A(s), Se(2), z(() => u.disabled = (W(n()), U(() => !n().next))), G("click", l, () => void i()(n().category, n().query)), G("click", u, () => void i()(n().category, n().query, !0)), q(e, t);
	}, w = (e) => {
		var t = po();
		G("click", t, () => void i()(n().category, n().query)), q(e, t);
	}, T = (e) => {
		var t = mo();
		z(() => t.disabled = !r()), G("click", t, () => void i()(H(o), H(a))), q(e, t);
	};
	Y(S, (e) => {
		W(n()), U(() => n().phase === "ready") ? e(C) : (W(n()), U(() => n().phase === "error") ? e(w, 1) : (W(n()), U(() => n().phase === "idle") && e(T, 2)));
	}), A(l), z(() => {
		f.disabled = !r(), m.disabled = !r(), y.disabled = !r(), J(x, (W(n()), U(() => n().message)));
	}), Cr("submit", u, (e) => {
		e.preventDefault(), i()(H(o), H(a));
	}), yi(f, () => H(a), (e) => F(a, e)), oi(m, () => H(o), (e) => F(o, e)), q(e, l), Ge();
}
wr(["click"]);
// src/Notifications.svelte
var _o = /* @__PURE__ */ K("<div class=\"notice\"><h3>Check your read markers</h3><p>The change may have completed. Check notifications before marking another group read.</p></div>"), vo = /* @__PURE__ */ K("<p class=\"notification-empty\"> </p>"), yo = /* @__PURE__ */ K("<li><div><h3> </h3><p class=\"notification-count\"> </p><p> </p><p class=\"field-help\"><time> </time></p></div> <button class=\"button secondary mark-notification-read\"> </button></li>"), bo = /* @__PURE__ */ K("<div class=\"notification-card card\"><div class=\"notification-heading\"><div><p class=\"eyebrow\">AT YOUR PACE</p><h2>Your notifications</h2></div><button class=\"button secondary check-notifications\">Check notifications</button></div> <p>Shared service and connection changes from other accounts, grouped together. Opening this inbox leaves them unread.</p> <label class=\"notification-filter\"><input id=\"notification-show-read\" type=\"checkbox\"/> Show read groups</label> <p class=\"notification-status\" role=\"status\"> </p> <!> <!> <ul class=\"notification-list\"></ul></div>");
function xo(e, t) {
	We(t, !1);
	let n = /* @__PURE__ */ P(), r = Z(t, "value", 8), i = Z(t, "authorized", 8), a = Z(t, "state", 8), o = Z(t, "message", 8), s = Z(t, "check", 8), c = Z(t, "mark", 8), l = /* @__PURE__ */ P(!1), u = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	En(() => W(i()), () => {
		i() || F(l, !1);
	}), En(() => (W(i()), W(r()), H(l)), () => {
		F(n, i() ? (r()?.groups ?? []).filter((e) => H(l) || e.unread !== "0") : []);
	}), Dn(), Ti();
	var d = bo(), f = I(d), p = R(I(f));
	A(f);
	var m = R(f, 4), h = I(m);
	pi(h), Se(), A(m);
	var g = R(m, 2), _ = L(g, !0), v = R(g, 2), y = (e) => {
		q(e, _o());
	};
	Y(v, (e) => {
		a() === "uncertain" && e(y);
	});
	var b = R(v, 2), x = (e) => {
		var t = vo(), n = L(t, !0);
		z(() => J(n, H(l) ? "No shared changes to show yet." : "You’re all caught up.")), q(e, t);
	};
	Y(b, (e) => {
		H(n), U(() => H(n).length === 0) && e(x);
	});
	var S = R(b, 2);
	qr(S, 5, () => H(n), (e) => e.category, (e, t) => {
		var n = yo(), r = I(n), o = I(r), s = L(o, !0), l = R(o), d = L(l, !0), f = R(l), p = L(f, !0), m = R(f), h = I(m), g = L(h, !0);
		A(m), A(r);
		var _ = R(r, 2), v = L(_);
		A(n), z((e, r) => {
			X(n, "data-notification-category", (H(t), U(() => H(t).category))), J(s, (H(t), U(() => H(t).category === "services" ? "Services" : "Connections"))), J(d, (H(t), U(() => H(t).unread === "0" ? "Read" : `${H(t).unread} unread ${H(t).unread === "1" ? "change" : "changes"}`))), J(p, (H(t), U(() => H(t).latest.label))), X(h, "datetime", e), J(g, r), _.disabled = (W(i()), W(a()), H(t), U(() => !i() || a() !== "idle" || H(t).unread === "0")), J(v, `Mark ${H(t), U(() => H(t).category === "services" ? "services" : "connections") ?? ""} read`);
		}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).latest.occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => u(H(t).latest.occurred_at)))]), G("click", _, () => c()(H(t).category, H(t).revision)), q(e, n);
	}), A(S), A(d), z(() => {
		p.disabled = !i() || a() === "saving", h.disabled = !i(), J(_, o() || "Read markers are saved to your account.");
	}), G("click", p, () => s()()), bi(h, () => H(l), (e) => F(l, e)), q(e, d), Ge();
}
wr(["click"]);
// src/Guide.svelte
var So = /* @__PURE__ */ K("<li> </li>"), Co = /* @__PURE__ */ K("<button class=\"button secondary\">Open Connections</button>"), wo = /* @__PURE__ */ K("<button class=\"button secondary\">Open Media</button>"), To = /* @__PURE__ */ K("<p class=\"field-help\">Media enrollment and observations require owner access.</p>"), Eo = /* @__PURE__ */ K("<p class=\"field-help\">Setup will be available when this integration is implemented and qualified.</p>"), Do = /* @__PURE__ */ K("<article class=\"card integration-card\"><div class=\"guide-card-heading\"><h2> </h2><span class=\"integration-status\"> </span></div> <p> </p> <h3>What it offers</h3><ul></ul> <h3>Setup requirements</h3><ul></ul> <!></article>"), Oo = /* @__PURE__ */ K("<section class=\"card guide-intro\"><p class=\"eyebrow\">OPTIONAL CONNECTIONS</p><h2>Integration catalog</h2><p>Come back here to see what is available and what is planned. Each connection needs deliberate setup and its own access permissions.</p><p class=\"field-help\">Available means the Reborn feature exists. Connections shows Crafty enrollment. Media provides owner-only Jellyfin and Seerr observations; credentials and real provider acceptance are separate.</p></section> <div class=\"catalog-list\"></div>", 1), ko = /* @__PURE__ */ K("<h4>Recorded progress</h4><ul></ul>", 1), Ao = /* @__PURE__ */ K("<section><div class=\"guide-card-heading\"><h3> </h3><span class=\"quiet-label\"> </span></div> <!> <h4>Work still ahead</h4><ul></ul></section>"), jo = /* @__PURE__ */ K("<article class=\"card roadmap-note\" aria-label=\"Project roadmap note\"><p class=\"eyebrow\">A NOTE FOR THE ROAD AHEAD</p><h2>Keida Reborn roadmap</h2> <p> </p> <p class=\"field-help\">Work-list snapshot dated <time> </time>. This note ships with the site; it does not update itself from GitHub. Your private workspace note is separate.</p> <h3>Next priorities</h3><ol class=\"roadmap-priorities\"></ol> <div class=\"roadmap-milestones\"></div> <p><a rel=\"noreferrer\">Open the current roadmap and acceptance tracker <span aria-hidden=\"true\">↗</span></a></p></article>"), Mo = /* @__PURE__ */ K("<section class=\"card guide-intro\"><h2> </h2><p>The guide is available after your account access is checked.</p><button class=\"button secondary\"> </button></section>"), No = /* @__PURE__ */ K("<div class=\"guide-card\"><p class=\"workspace-status\" role=\"status\"> </p> <!></div>");
function Po(e, t) {
	We(t, !1);
	let n = Z(t, "mode", 8, "catalog"), r = Z(t, "state", 8), i = Z(t, "authorized", 8, !1), a = Z(t, "retry", 8), o = Z(t, "connections", 8), s = Z(t, "media", 8), c = Z(t, "owner", 8, !1);
	Ti();
	var l = No(), u = I(l), d = L(u, !0), f = R(u, 2), p = (e) => {
		var t = Nr(), i = ln(t), a = (e) => {
			var t = Oo(), n = R(ln(t), 2);
			qr(n, 5, () => (W(r()), U(() => r().value.catalog)), (e) => e.id, (e, t) => {
				var n = Do(), r = I(n), i = I(r), a = L(i, !0), l = R(i), u = L(l, !0);
				A(r);
				var d = R(r, 2), f = L(d, !0), p = R(d, 3);
				qr(p, 5, () => (H(t), U(() => H(t).capabilities)), Ur, (e, t) => {
					var n = So(), r = L(n, !0);
					z(() => J(r, H(t))), q(e, n);
				}), A(p);
				var m = R(p, 3);
				qr(m, 5, () => (H(t), U(() => H(t).requirements)), Ur, (e, t) => {
					var n = So(), r = L(n, !0);
					z(() => J(r, H(t))), q(e, n);
				}), A(m);
				var h = R(m, 2), g = (e) => {
					var n = Nr(), r = ln(n), i = (e) => {
						var t = Co();
						G("click", t, function(...e) {
							o()?.apply(this, e);
						}), q(e, t);
					}, a = (e) => {
						var t = wo();
						G("click", t, function(...e) {
							s()?.apply(this, e);
						}), q(e, t);
					}, l = (e) => {
						q(e, To());
					};
					Y(r, (e) => {
						H(t), U(() => H(t).id === "crafty") ? e(i) : c() ? e(a, 1) : e(l, -1);
					}), q(e, n);
				}, _ = (e) => {
					q(e, Eo());
				};
				Y(h, (e) => {
					H(t), U(() => H(t).status === "available") ? e(g) : e(_, -1);
				}), A(n), z(() => {
					X(n, "data-integration-id", (H(t), U(() => H(t).id))), J(a, (H(t), U(() => H(t).name))), X(l, "data-status", (H(t), U(() => H(t).status))), J(u, (H(t), U(() => H(t).status === "available" ? "Available" : "Planned"))), J(f, (H(t), U(() => H(t).summary)));
				}), q(e, n);
			}), A(n), q(e, t);
		}, l = (e) => {
			var t = jo(), n = R(I(t), 3), i = L(n, !0), a = R(n, 2), o = R(I(a)), s = L(o, !0);
			Se(), A(a);
			var c = R(a, 3);
			qr(c, 5, () => (W(r()), U(() => r().value.roadmap.priorities)), Ur, (e, t) => {
				var n = So(), r = L(n, !0);
				z(() => J(r, H(t))), q(e, n);
			}), A(c);
			var l = R(c, 2);
			qr(l, 5, () => (W(r()), U(() => r().value.roadmap.milestones)), (e) => e.id, (e, t) => {
				var n = Ao(), r = I(n), i = I(r), a = L(i), o = L(R(i), !0);
				A(r);
				var s = R(r, 2), c = (e) => {
					var n = ko(), r = R(ln(n));
					qr(r, 5, () => (H(t), U(() => H(t).delivered)), Ur, (e, t) => {
						var n = So(), r = L(n, !0);
						z(() => J(r, H(t))), q(e, n);
					}), A(r), q(e, n);
				};
				Y(s, (e) => {
					H(t), U(() => H(t).delivered.length) && e(c);
				});
				var l = R(s, 3);
				qr(l, 5, () => (H(t), U(() => H(t).remaining)), Ur, (e, t) => {
					var n = So(), r = L(n, !0);
					z(() => J(r, H(t))), q(e, n);
				}), A(l), A(n), z(() => {
					X(n, "data-milestone-id", (H(t), U(() => H(t).id))), X(n, "aria-label", (H(t), U(() => `${H(t).id}: ${H(t).title}`))), J(a, `${H(t), U(() => H(t).id) ?? ""} · ${H(t), U(() => H(t).title) ?? ""}`), J(o, (H(t), U(() => H(t).status)));
				}), q(e, n);
			}), A(l);
			var u = L(R(l, 2));
			A(t), z(() => {
				J(i, (W(r()), U(() => r().value.roadmap.intro))), X(o, "datetime", (W(r()), U(() => r().value.roadmap.as_of))), J(s, (W(r()), U(() => r().value.roadmap.as_of))), X(u, "href", (W(r()), U(() => r().value.roadmap.tracker_url)));
			}), q(e, t);
		};
		Y(i, (e) => {
			n() === "catalog" ? e(a) : e(l, -1);
		}), q(e, t);
	}, m = (e) => {
		var t = Mo(), i = I(t), o = L(i, !0), s = R(i, 2), c = L(s, !0);
		A(t), z(() => {
			J(o, n() === "roadmap" ? "Roadmap note" : "Integration catalog"), J(c, (W(r()), U(() => r().phase === "error" ? "Retry workspace guide" : "Check workspace guide")));
		}), G("click", s, () => void a()()), q(e, t);
	};
	Y(f, (e) => {
		W(i()), W(r()), U(() => i() && r().phase === "ready" && r().value) ? e(p) : (W(i()), W(r()), U(() => i() && r().phase !== "loading") && e(m, 1));
	}), A(l), z(() => J(d, (W(r()), U(() => r().message)))), q(e, l), Ge();
}
wr(["click"]);
// src/Media.svelte
var Fo = /* @__PURE__ */ K("<section class=\"card small-card media-owner-only\"><h2>Owner access required</h2><p>An owner can enroll and view media connections. Provider-account sharing has not been configured for members.</p></section>"), Io = /* @__PURE__ */ K("<div class=\"media-playback\" data-media-playback=\"\"><h3>Recent server playback</h3><p> </p><p class=\"field-help\">Across the Jellyfin server, not limited to the selected library: sessions active within 120 seconds with a reported playing item. Counts do not show users, devices or watch titles.</p></div>"), Lo = /* @__PURE__ */ K("<small>Some details unavailable</small>"), Ro = /* @__PURE__ */ K("<tr data-media-item=\"\"><td> <!></td><td> </td><td> </td></tr>"), zo = /* @__PURE__ */ K("<div class=\"media-table-scroll\"><table class=\"media-table\"><caption> </caption><thead><tr><th scope=\"col\">Title</th><th scope=\"col\">Type</th><th scope=\"col\"> </th></tr></thead><tbody></tbody></table></div>"), Bo = /* @__PURE__ */ K("<p class=\"media-empty\"> </p>"), Vo = /* @__PURE__ */ K("<p class=\"field-help\">No usable rows were reported for this sample. This does not establish an empty library or request list.</p>"), Ho = /* @__PURE__ */ K("<p class=\"notice\">More rows exist beyond this bounded view.</p>"), Uo = /* @__PURE__ */ K("<dl class=\"media-sample\"><dt>Collected</dt><dd> </dd><dt>Freshness</dt><dd> </dd><dt>Sample</dt><dd> </dd></dl> <!> <!> <p class=\"field-help\"> </p> <!> <div class=\"button-row media-pagination\"><button class=\"text-button media-previous\"> </button><span class=\"quiet-label\"> </span><button class=\"text-button media-next\"> </button></div>", 1), Wo = /* @__PURE__ */ K("<p class=\"field-help\">Choose one Jellyfin library by its ID. This limits the rows requested here; the underlying API key may still access all libraries and sessions.</p>"), Go = /* @__PURE__ */ K("<label for=\"jellyfin-library\">Jellyfin library ID</label><input id=\"jellyfin-library\" name=\"library-id\" required=\"\" maxlength=\"36\"/><p class=\"field-help\">Use the library’s lowercase 32-digit ID or UUID, without an address or API key.</p>", 1), Ko = /* @__PURE__ */ K("<button class=\"text-button media-remove\"> </button>"), qo = /* @__PURE__ */ K("<section class=\"card media-provider\"><div class=\"guide-card-heading\"><h2> </h2><span class=\"quiet-label\">Owner-only observations</span></div> <p class=\"workspace-status\" role=\"status\" data-media-status=\"\"> </p> <div class=\"button-row media-actions\"><button class=\"button secondary media-check-state\"> </button><button class=\"button secondary media-check-observations\"> </button></div> <!> <details class=\"media-enrollment\"><summary> </summary><p>Use a key created deliberately for Reborn. It is encrypted on the server and will not be shown again.</p><p class=\"notice\"> </p> <!> <form autocomplete=\"off\"><label> </label><input name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\"/> <label>Dedicated API key</label><input name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <!> <label>Private CA certificate, if needed</label><textarea name=\"ca-pem\" rows=\"3\" maxlength=\"8192\"></textarea><p class=\"field-help\">Leave blank for publicly trusted HTTPS. Normal hostname and trust checks always apply.</p> <label class=\"media-ack\"><input name=\"acknowledge\" type=\"checkbox\" required=\"\"/>I understand this key may grant broad access, and I choose owner-only media observations.</label> <button class=\"button primary media-save\" type=\"submit\"> </button></form></details> <!></section>"), Jo = /* @__PURE__ */ K("<div class=\"media-providers\"></div>"), Yo = /* @__PURE__ */ K("<div class=\"media-view\"><section class=\"card media-intro\"><p class=\"eyebrow\">MEDIA, WITH DELIBERATE ACCESS</p><h2>Media observations</h2><p>Check a selected Jellyfin library, counts of recent playback and Seerr request status. These connections send observation requests only.</p><p class=\"field-help\">Media is owner-only. Hub member accounts are not linked to provider accounts, and this view does not share their playback or request identities.</p></section> <!></div>");
function Xo(e, t) {
	We(t, !1);
	let n = Z(t, "owner", 8, !1), r = Z(t, "active", 8, !1), i = Z(t, "state", 8), a = Z(t, "check", 8), o = Z(t, "load", 8), s = Z(t, "save", 8), c = ["jellyfin", "seerr"], l = (e) => e === "jellyfin" ? "Jellyfin" : "Seerr", u = /* @__PURE__ */ P({}), d = (e) => e === null ? "Not collected" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(), f = (e) => r() && n() && i()[e].phase === "ready" && i()[e].save === "idle" && !!i()[e].status;
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
	En(() => (W(r()), W(n())), () => {
		r() && n() || p();
	}), Dn(), Ti();
	var h = Yo(), g = R(I(h), 2), _ = (e) => {
		q(e, Fo());
	}, v = (e) => {
		var t = Jo();
		qr(t, 5, () => c, (e) => e, (e, t) => {
			let s = /* @__PURE__ */ M(() => (W(i()), H(t), U(() => i()[H(t)]))), c = /* @__PURE__ */ M(() => (W(H(s)), U(() => H(s).observation))), f = /* @__PURE__ */ M(() => (W(r()), W(H(s)), U(() => !r() || H(s).save === "saving"))), p = /* @__PURE__ */ M(() => (W(r()), W(n()), W(H(s)), U(() => r() && n() && H(s).phase === "ready" && H(s).save === "idle" && !!H(s).status)));
			var h = qo(), g = I(h), _ = L(I(g), !0);
			Se(), A(g);
			var v = R(g, 2), y = L(v, !0), b = R(v, 2), x = I(b), S = L(x), C = R(x), w = L(C);
			A(b);
			var T = R(b, 2), E = (e) => {
				var n = Uo(), r = ln(n), i = R(I(r)), a = L(i, !0), s = R(i, 2), u = L(s, !0), p = L(R(s, 2), !0);
				A(r);
				var m = R(r, 2), h = (e) => {
					var t = Io(), n = L(R(I(t)), !0);
					Se(), A(t), z(() => J(n, (W(H(c)), U(() => H(c).playback && H(c).playback.playing !== null && H(c).playback.paused !== null ? `${H(c).playback.playing} playing · ${H(c).playback.paused} paused` : "Playback counts unavailable")))), q(e, t);
				};
				Y(m, (e) => {
					H(t) === "jellyfin" && e(h);
				});
				var g = R(m, 2), _ = (e) => {
					var n = zo(), r = I(n), i = I(r), a = L(i, !0), o = R(i), s = I(o), l = L(R(I(s), 2), !0);
					A(s), A(o);
					var u = R(o);
					qr(u, 5, () => (W(H(c)), U(() => H(c).items)), (e) => e.id, (e, n) => {
						var r = Ro(), i = I(r), a = I(i, !0), o = R(a), s = (e) => {
							q(e, Lo());
						};
						Y(o, (e) => {
							H(n), U(() => H(n).detail_error) && e(s);
						}), A(i);
						var c = R(i), l = L(c, !0), u = L(R(c), !0);
						A(r), z((e) => {
							J(a, (H(n), U(() => H(n).title ?? "Title unavailable"))), J(l, (H(n), U(() => H(n).kind === "movie" ? "Movie" : "Series"))), J(u, e);
						}, [() => (H(t), H(n), U(() => H(t) === "jellyfin" ? H(n).year ?? "Not reported" : H(n).request_status === "unknown" ? "Unknown" : H(n).request_status ? H(n).request_status[0].toUpperCase() + H(n).request_status.slice(1) : "Not reported"))]), q(e, r);
					}), A(u), A(r), A(n), z(() => {
						J(a, H(t) === "jellyfin" ? "Selected library rows" : "Recent request rows"), J(l, H(t) === "jellyfin" ? "Year" : "Request status"), X(u, "data-media-rows", H(t));
					}), q(e, n);
				}, v = (e) => {
					var n = Bo(), r = L(n, !0);
					z(() => J(r, H(t) === "jellyfin" ? "No movie or series rows were reported in this library." : "No requests were reported.")), q(e, n);
				}, y = (e) => {
					q(e, Vo());
				};
				Y(g, (e) => {
					W(H(c)), U(() => H(c).items.length) ? e(_) : (W(H(c)), U(() => H(c).complete && H(c).error === null && H(c).total === 0) ? e(v, 1) : (W(H(c)), U(() => H(c).error !== "checking") && e(y, 2)));
				});
				var b = R(g, 2), x = L(b), S = R(b, 2), C = (e) => {
					q(e, Ho());
				};
				Y(S, (e) => {
					W(H(c)), U(() => H(c).truncated) && e(C);
				});
				var w = R(S, 2), T = I(w), E = L(T), ee = R(T), te = L(ee), ne = R(ee), re = L(ne);
				A(w), z((e, t, n) => {
					J(a, e), J(u, (W(H(c)), U(() => H(c).freshness === "fresh" ? "Recent collection" : H(c).freshness === "stale" ? "Stale collection" : "Collection age unknown"))), J(p, (W(H(c)), U(() => H(c).complete ? "Complete for these bounded queries" : "Incomplete or still checking"))), J(x, `${W(H(c)), U(() => H(c).total === null ? "Provider total unavailable." : `${H(c).total} rows reported by the provider.`) ?? ""} Up to 12 rows per page and the first 60 rows only. Pages can change as the provider changes.`), T.disabled = (W(H(f)), W(H(c)), U(() => H(f) || H(c).offset === 0)), J(E, `Previous ${t ?? ""} page`), J(te, `Page ${W(H(c)), U(() => H(c).offset / 12 + 1) ?? ""}`), ne.disabled = (W(H(f)), W(H(c)), U(() => H(f) || H(c).next_offset === null)), J(re, `Next ${n ?? ""} page`);
				}, [
					() => (W(H(c)), U(() => d(H(c).checked_at))),
					() => (H(t), U(() => l(H(t)))),
					() => (H(t), U(() => l(H(t))))
				]), G("click", T, () => void o()(H(t), H(c).offset - 12)), G("click", ne, () => H(c).next_offset !== null && void o()(H(t), H(c).next_offset)), q(e, n);
			}, ee = (e) => {
				var n = Bo(), r = L(n);
				z((e) => J(r, `No ${e ?? ""} connection enrolled.`), [() => (H(t), U(() => l(H(t))))]), q(e, n);
			};
			Y(T, (e) => {
				W(H(c)), U(() => H(c)?.configured) ? e(E) : (W(H(s)), U(() => H(s).status && !H(s).status.configured) && e(ee, 1));
			});
			var te = R(T, 2), ne = I(te), re = L(ne), D = R(ne, 2), ie = L(D), ae = R(D, 2), oe = (e) => {
				q(e, Wo());
			};
			Y(ae, (e) => {
				H(t) === "jellyfin" && e(oe);
			});
			var se = R(ae, 2), ce = I(se), le = L(ce), ue = R(ce), de = R(ue, 2), fe = R(de), pe = R(fe, 2), me = (e) => {
				var t = Go(), n = R(ln(t));
				X(n, "pattern", "[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}"), Se(), z(() => n.disabled = !H(p)), q(e, t);
			};
			Y(pe, (e) => {
				H(t) === "jellyfin" && e(me);
			});
			var he = R(pe, 2), ge = R(he), _e = R(ge, 3), ve = I(_e);
			Se(), A(_e);
			var O = R(_e, 2), ye = L(O);
			A(se), wi(se, (e, t) => Ut(u, H(u)[t] = e), (e) => H(u)?.[e], () => [H(t)]), A(te);
			var k = R(te, 2), be = (e) => {
				var n = Ko(), r = L(n);
				z((e) => {
					n.disabled = !H(p), J(r, `Remove ${e ?? ""} connection`);
				}, [() => (H(t), U(() => l(H(t))))]), G("click", n, () => void m(H(t), !0)), q(e, n);
			};
			Y(k, (e) => {
				W(H(s)), U(() => H(s).status?.configured) && e(be);
			}), A(h), z((e, n, r, i, a, o, l, u, d, m) => {
				X(h, "data-media-provider", H(t)), X(h, "data-media-revision", (W(H(s)), U(() => H(s).status?.revision ?? ""))), X(h, "data-media-configured", e), X(h, "data-media-error", (W(H(c)), U(() => H(c)?.error ?? ""))), X(h, "data-media-complete", n), X(h, "data-media-offset", (W(H(c)), U(() => H(c)?.offset ?? 0))), X(h, "data-media-save", (W(H(s)), U(() => H(s).save))), X(h, "aria-label", r), J(_, i), J(y, (W(H(s)), U(() => H(s).message || "Check the connection state to begin."))), x.disabled = H(f), J(S, `Check ${a ?? ""} connection state`), C.disabled = (W(H(f)), W(H(s)), U(() => H(f) || !H(s).status?.configured)), J(w, `Check ${o ?? ""} observations`), J(re, `Enroll dedicated ${l ?? ""} access`), J(ie, `A ${u ?? ""} API key can grant administrator access. Reborn sends observation requests only; this does not restrict what the key itself can do.`), X(ce, "for", `${H(t)}-endpoint`), J(le, `${d ?? ""} HTTPS address`), X(ue, "id", `${H(t)}-endpoint`), X(ue, "placeholder", `https://${H(t)}.example/`), ue.disabled = !H(p), X(de, "for", `${H(t)}-token`), X(fe, "id", `${H(t)}-token`), fe.disabled = !H(p), X(he, "for", `${H(t)}-ca`), X(ge, "id", `${H(t)}-ca`), ge.disabled = !H(p), X(_e, "for", `${H(t)}-ack`), X(ve, "id", `${H(t)}-ack`), ve.disabled = !H(p), O.disabled = !H(p), J(ye, `Save ${m ?? ""} connection`);
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
			]), G("click", x, () => void a()(H(t))), G("click", C, () => void o()(H(t), H(c)?.offset ?? 0)), Cr("submit", se, (e) => {
				e.preventDefault(), m(H(t));
			}), q(e, h);
		}), A(t), q(e, t);
	};
	Y(g, (e) => {
		n() ? e(v, -1) : e(_);
	}), A(h), q(e, h), Ge();
}
wr(["click"]);
// src/App.svelte
var Zo = /* @__PURE__ */ K("<span class=\"notification-badge\"> </span>"), Qo = /* @__PURE__ */ K("<a rel=\"noreferrer\"> </a>"), $o = /* @__PURE__ */ K("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), es = /* @__PURE__ */ K("<span class=\"card-icon\" aria-hidden=\"true\">▤</span><h2>Your workspace note</h2><p> </p><button class=\"text-button\">Keep writing <span aria-hidden=\"true\">→</span></button>", 1), ts = /* @__PURE__ */ K("<span class=\"card-icon\" aria-hidden=\"true\">◇</span><h2>Connections</h2><p> </p><button class=\"text-button\">View connections <span aria-hidden=\"true\">→</span></button>", 1), ns = /* @__PURE__ */ K("<section><!></section>"), rs = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), is = /* @__PURE__ */ K("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), as = /* @__PURE__ */ K("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), os = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), ss = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), cs = /* @__PURE__ */ K("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span aria-hidden=\"true\"></span></button> <button><span aria-hidden=\"true\">◇</span>Connections</button> <button><span aria-hidden=\"true\">▦</span>Services</button> <button><span aria-hidden=\"true\">◷</span>Activity</button> <button><span aria-hidden=\"true\">♧</span>Notifications<!></button> <button><span aria-hidden=\"true\">⊞</span>Integrations</button> <button><span aria-hidden=\"true\">≡</span>Roadmap</button> <button><span aria-hidden=\"true\">▻</span>Media</button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <form method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary> <dl><dt>Source</dt><dd><!></dd><dt>Tree</dt><dd> </dd><dt>Channel</dt><dd> </dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl></details></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p class=\"workspace-status\" role=\"status\"> </p> <!> <section class=\"home-view\"><div class=\"welcome-card card\"><div><p class=\"eyebrow\">MAKE YOURSELF AT HOME</p><h2>A useful place<br/>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><div class=\"button-row\"><button class=\"button primary\">Open your note <span aria-hidden=\"true\">↗</span></button><button class=\"text-button\">Read the Roadmap note</button></div></div><div class=\"orb\" aria-hidden=\"true\"><div>K</div></div></div> <div class=\"home-layout-heading\"><p class=\"layout-status\" role=\"status\"> </p><button class=\"button secondary customize-home\">Customize Home</button></div> <div><!></div> <div></div></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <section aria-label=\"Connections\"><!></section> <section aria-label=\"Activity\"><!></section> <section aria-label=\"Notifications\"><!></section> <section><!></section> <section aria-label=\"Media\"><!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function ls(e, t) {
	We(t, !1);
	let n = () => Ni(u, "$model", r), [r, i] = Pi(), a = /* @__PURE__ */ P(), o = /* @__PURE__ */ P(), s = /* @__PURE__ */ P(), c = Z(t, "binding", 8), l = va(c()), u = l.model, d = /* @__PURE__ */ P("home"), f = /* @__PURE__ */ P(), p = /* @__PURE__ */ P(), m = /* @__PURE__ */ P(Wi()), h, g = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", _ = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified", v = document.querySelector("meta[name=\"reborn-tree\"]")?.content ?? "unqualified", y = document.querySelector("meta[name=\"reborn-channel\"]")?.content ?? "development";
	function b(e) {
		H(d) === "media" && e !== "media" ? (l.closeMedia(), jt(() => {
			F(d, e);
		})) : F(d, e), H(f)?.focus(), e === "activity" && l.activity(), e === "notifications" && l.check(), (e === "integrations" || e === "roadmap") && l.loadGuide(), e === "media" && l.openMedia();
	}
	let x = () => n().snapshot ? `${n().snapshot.account.id}:${n().snapshot.session_generation}:${n().snapshot.account.role}` : "";
	Ri(() => {
		let e = document.activeElement;
		h = H(d) === "home" && n().phase === "ready" && e instanceof HTMLElement && H(p)?.contains(e) ? {
			element: e,
			scope: x()
		} : void 0;
	}), zi(() => {
		let e = h;
		h = void 0, e && H(d) === "home" && n().phase === "ready" && e.scope === x() && e.element.isConnected && H(p)?.contains(e.element) && document.activeElement === document.body && document.visibilityState === "visible" && document.hasFocus() && e.element.getClientRects().length > 0 && e.element.focus({ preventScroll: !0 });
	}), Ii(l.start), En(() => (n(), Wi), () => {
		F(a, n().layoutDraft?.panels ?? n().snapshot?.layout.panels ?? Wi());
	}), En(() => (n(), H(d), H(a)), () => {
		n().phase === "ready" ? H(d) !== "directory" && F(m, H(a)) : F(m, Wi());
	}), En(() => n(), () => {
		F(o, new TextEncoder().encode(n().draft).length);
	}), En(() => (n(), H(o)), () => {
		F(s, n().phase === "ready" && n().dirty && H(o) <= 4096 && !["saving", "checking-conflict"].includes(n().layoutSave) && n().notificationSave !== "saving" && ![
			"saving",
			"checking-conflict",
			"conflict",
			"uncertain"
		].includes(n().save));
	}), Dn(), Ti();
	var S = cs(), C = R(ln(S), 2), w = I(C), T = R(I(w), 4), E = I(T);
	let ee;
	var te = R(E, 2);
	let ne;
	var re = R(I(te), 2);
	let D;
	A(te);
	var ie = R(te, 2);
	let ae;
	var oe = R(ie, 2);
	let se;
	var ce = R(oe, 2);
	let le;
	var ue = R(ce, 2);
	let de;
	var fe = R(I(ue), 2), pe = (e) => {
		var t = Zo(), r = L(t, !0);
		z(() => {
			X(t, "aria-label", (n(), U(() => `${n().snapshot.notifications.unread_groups} unread groups`))), J(r, (n(), U(() => n().snapshot.notifications.unread_groups)));
		}), q(e, t);
	};
	Y(fe, (e) => {
		n(), U(() => n().snapshot?.notifications.unread_groups) && e(pe);
	}), A(ue);
	var me = R(ue, 2);
	let he;
	var ge = R(me, 2);
	let _e;
	var ve = R(ge, 2);
	let O;
	A(T);
	var ye = R(T, 2), k = I(ye), be = R(I(k)), xe = I(be), Ce = L(xe, !0), we = L(R(xe), !0);
	A(be), A(k);
	var Te = R(k, 2), Ee = R(R(I(Te), 2), 2);
	pi(Ee), Se(2), A(Te);
	var De = R(Te, 2), Oe = I(De), ke = I(Oe, !0);
	Se(), A(Oe);
	var Ae = R(Oe, 2), je = R(I(Ae)), Me = I(je), Ne = (e) => {
		var t = Qo(), n = L(t, !0);
		z(() => {
			X(t, "href", `https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${_}`), J(n, _);
		}), q(e, t);
	}, Pe = /* @__PURE__ */ mt(() => U(() => /^[a-f0-9]{40}$/.test(_))), Fe = (e) => {
		var t = Mr();
		z(() => J(t, _)), q(e, t);
	};
	Y(Me, (e) => {
		H(Pe) ? e(Ne) : e(Fe, -1);
	}), A(je);
	var Ie = R(je, 2), Le = L(Ie, !0), Re = L(R(Ie, 2), !0);
	Se(2), A(Ae), A(De), A(ye), A(w);
	var ze = R(w, 2), Be = I(ze), Ve = I(Be), He = R(I(Ve)), j = L(He, !0);
	wi(He, (e) => F(f, e), () => H(f)), A(Ve);
	var Ue = R(Ve), Ke = R(I(Ue), 1, !0);
	A(Ue), A(Be);
	var qe = R(Be, 2), Je = L(qe, !0), Ye = R(qe, 2), Xe = (e) => {
		q(e, $o());
	};
	Y(Ye, (e) => {
		n(), U(() => n().phase !== "ready") && e(Xe);
	});
	var Ze = R(Ye, 2), Qe = I(Ze), $e = I(Qe), et = R(I($e), 3), tt = I(et), rt = R(tt);
	A(et), A($e), Se(), A(Qe);
	var it = R(Qe, 2), at = I(it), ot = L(at, !0), st = R(at);
	A(it);
	var ct = R(it, 2), lt = I(ct);
	{
		let e = /* @__PURE__ */ M(() => (n(), U(() => n().snapshot?.layout))), t = /* @__PURE__ */ M(() => (n(), U(() => n().phase === "ready")));
		wa(lt, {
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
	A(ct);
	var ut = R(ct, 2);
	let dt;
	qr(ut, 5, () => H(m), (e) => e.id, (e, t) => {
		var r = ns();
		let i;
		var a = I(r), o = (e) => {
			var t = es(), r = R(ln(t), 2), i = L(r, !0), a = R(r);
			z(() => J(i, (n(), U(() => n().dirty ? "You have an unsaved draft open." : n().snapshot?.note.revision === "0" ? "A blank page for whatever comes next." : "Your saved note is ready when you are.")))), G("click", a, () => b("note")), q(e, t);
		}, s = (e) => {
			var t = ts(), r = R(ln(t), 2), i = L(r, !0), a = R(r);
			z(() => J(i, (n(), U(() => n().snapshot?.crafty?.configured ? "Your enrolled Crafty observations are available in Connections." : "Enroll dedicated Crafty access to see your selected servers.")))), G("click", a, () => b("connections")), q(e, t);
		}, c = (e) => {
			{
				let t = /* @__PURE__ */ M(() => (n(), U(() => n().snapshot?.directory))), r = /* @__PURE__ */ M(() => (n(), U(() => n().phase === "ready"))), i = /* @__PURE__ */ M(() => (n(), U(() => n().snapshot?.account.role === "owner"))), a = /* @__PURE__ */ M(() => H(d) === "home");
				co(e, {
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
			X(r, "data-home-panel", (H(t), U(() => H(t).id))), X(r, "hidden", (n(), H(t), H(d), U(() => n().phase !== "ready" || (H(t).id === "pins" ? H(d) === "home" && !H(t).visible : H(d) !== "home" || !H(t).visible)))), X(r, "aria-label", (H(t), U(() => H(t).id === "pins" ? "Services" : H(t).id === "note" ? "Workspace note shortcut" : "Connections shortcut"))), i = ti(r, 1, "", null, i, {
				card: H(t).id !== "pins",
				"small-card": H(t).id !== "pins",
				"pins-panel": H(t).id === "pins"
			});
		}), q(e, r);
	}), A(ut), wi(ut, (e) => F(p, e), () => H(p)), A(Ze);
	var ft = R(Ze, 2), pt = I(ft), ht = L(R(I(pt)), !0);
	A(pt);
	var gt = R(pt, 2), _t = (e) => {
		var t = rs(), n = R(I(t), 2), r = I(n), i = R(r);
		A(n), A(t), G("click", r, function(...e) {
			l.recover?.apply(this, e);
		}), G("click", i, () => l.resolve(!0)), q(e, t);
	};
	Y(gt, (e) => {
		n(), U(() => n().recovery) && e(_t);
	});
	var vt = R(gt, 2), yt = R(I(vt), 2);
	nt(yt);
	var bt = R(yt, 4), N = I(bt);
	let xt;
	var St = L(N), Ct = R(N), wt = L(Ct, !0);
	A(bt), A(vt);
	var Tt = R(vt, 2), Et = (e) => {
		q(e, is());
	};
	Y(Tt, (e) => {
		n(), U(() => n().storageLimited) && e(Et);
	});
	var Dt = R(Tt, 2), Ot = (e) => {
		q(e, as());
	};
	Y(Dt, (e) => {
		H(o) > 4096 && e(Ot);
	});
	var kt = R(Dt, 2), At = (e) => {
		var t = os(), r = R(I(t), 2), i = L(r, !0), a = R(r), o = I(a), s = R(o);
		A(a), A(t), z(() => J(i, (n(), U(() => n().snapshot?.note.body)))), G("click", o, () => l.resolve(!1)), G("click", s, () => l.resolve(!0)), q(e, t);
	};
	Y(kt, (e) => {
		n(), U(() => n().save === "conflict") && e(At);
	});
	var Mt = R(kt, 2), Nt = (e) => {
		var t = ss(), n = R(I(t), 2);
		A(t), G("click", n, () => l.check()), q(e, t);
	};
	Y(Mt, (e) => {
		n(), U(() => n().save === "uncertain") && e(Nt);
	}), A(ft);
	var Pt = R(ft, 2), Ft = I(Pt);
	{
		let e = /* @__PURE__ */ M(() => (n(), U(() => n().snapshot?.crafty))), t = /* @__PURE__ */ M(() => (n(), U(() => n().snapshot?.account.role === "owner"))), r = /* @__PURE__ */ M(() => (H(d), n(), U(() => H(d) === "connections" && n().phase === "ready")));
		Ga(Ft, {
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
			},
			get observationState() {
				return n(), U(() => n().observations);
			},
			get loadObservations() {
				return U(() => l.observations);
			}
		});
	}
	A(Pt);
	var It = R(Pt, 2), Lt = I(It);
	{
		let e = /* @__PURE__ */ M(() => (n(), U(() => n().phase === "ready")));
		go(Lt, {
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
	A(It);
	var Rt = R(It, 2), zt = I(Rt);
	{
		let e = /* @__PURE__ */ M(() => (n(), U(() => n().snapshot?.notifications))), t = /* @__PURE__ */ M(() => (n(), U(() => n().phase === "ready")));
		xo(zt, {
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
	A(Rt);
	var Bt = R(Rt, 2), Vt = I(Bt);
	{
		let e = /* @__PURE__ */ M(() => H(d) === "roadmap" ? "roadmap" : "catalog"), t = /* @__PURE__ */ M(() => (n(), U(() => n().phase === "ready"))), r = /* @__PURE__ */ M(() => (n(), U(() => n().snapshot?.account.role === "owner")));
		Po(Vt, {
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
			get owner() {
				return H(r);
			}
		});
	}
	A(Bt);
	var Ht = R(Bt, 2), Ut = I(Ht);
	{
		let e = /* @__PURE__ */ M(() => (n(), U(() => n().snapshot?.account.role === "owner"))), t = /* @__PURE__ */ M(() => (H(d), n(), U(() => H(d) === "media" && n().phase === "ready")));
		Xo(Ut, {
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
	A(Ht), Se(2), A(ze), A(C), z(() => {
		X(E, "aria-current", H(d) === "home" ? "page" : void 0), ee = ti(E, 1, "", null, ee, { active: H(d) === "home" }), X(te, "aria-current", H(d) === "note" ? "page" : void 0), ne = ti(te, 1, "", null, ne, { active: H(d) === "note" }), D = ti(re, 1, "draft-dot", null, D, { visible: n().dirty }), X(ie, "aria-current", H(d) === "connections" ? "page" : void 0), ae = ti(ie, 1, "", null, ae, { active: H(d) === "connections" }), X(oe, "aria-current", H(d) === "directory" ? "page" : void 0), se = ti(oe, 1, "", null, se, { active: H(d) === "directory" }), X(ce, "aria-current", H(d) === "activity" ? "page" : void 0), le = ti(ce, 1, "", null, le, { active: H(d) === "activity" }), X(ue, "aria-current", H(d) === "notifications" ? "page" : void 0), de = ti(ue, 1, "", null, de, { active: H(d) === "notifications" }), X(me, "aria-current", H(d) === "integrations" ? "page" : void 0), he = ti(me, 1, "", null, he, { active: H(d) === "integrations" }), X(ge, "aria-current", H(d) === "roadmap" ? "page" : void 0), _e = ti(ge, 1, "", null, _e, { active: H(d) === "roadmap" }), X(ve, "aria-current", H(d) === "media" ? "page" : void 0), O = ti(ve, 1, "", null, O, { active: H(d) === "media" }), J(Ce, (n(), U(() => n().snapshot?.account.username ?? "Your account"))), J(we, (n(), U(() => n().snapshot?.account.role === "owner" ? "Owner" : n().snapshot?.account.role === "member" ? "Member" : "Check account access"))), mi(Ee, c()), J(ke, g), J(Le, v), J(Re, y), J(j, H(d) === "home" ? "Welcome home." : H(d) === "note" ? "A little space to think." : H(d) === "connections" ? "Your servers, at a glance." : H(d) === "directory" ? "Everything within reach." : H(d) === "activity" ? "Pick up the thread." : H(d) === "notifications" ? "Catch up at your pace." : H(d) === "integrations" ? "Make the right connections." : H(d) === "media" ? "A window into your media." : "See what comes next."), J(Ke, (n(), U(() => n().phase === "ready" ? "Session checked" : n().phase === "checking" ? "Checking access" : "Access paused"))), J(Je, (n(), U(() => n().message))), X(Ze, "hidden", (H(d), n(), U(() => H(d) !== "home" && H(d) !== "directory" || n().phase !== "ready"))), X(Ze, "aria-label", H(d) === "directory" ? "Service directory view" : "Home"), X(Qe, "hidden", H(d) !== "home"), X(it, "hidden", H(d) !== "home"), J(ot, (n(), U(() => n().layoutMessage || "Your panels, in your own order."))), st.disabled = (n(), U(() => !!n().layoutDraft || n().phase !== "ready" || n().layoutSave === "saving")), X(ct, "hidden", H(d) !== "home"), dt = ti(ut, 1, "home-grid", null, dt, { "services-view": H(d) === "directory" }), X(ft, "hidden", (H(d), n(), U(() => H(d) !== "note" || n().phase !== "ready"))), J(ht, (n(), U(() => n().dirty ? "Unsaved changes" : "Up to date"))), mi(yt, (n(), U(() => n().draft))), yt.disabled = (n(), U(() => n().phase !== "ready")), xt = ti(N, 1, "", null, xt, { "over-limit": H(o) > 4096 }), J(St, `${H(o) ?? ""} / 4096 bytes`), Ct.disabled = !H(s), J(wt, (n(), U(() => n().save === "saving" ? "Saving…" : "Save note"))), X(Pt, "hidden", (H(d), n(), U(() => H(d) !== "connections" || n().phase !== "ready"))), X(It, "hidden", (H(d), n(), U(() => H(d) !== "activity" || n().phase !== "ready"))), X(Rt, "hidden", (H(d), n(), U(() => H(d) !== "notifications" || n().phase !== "ready"))), X(Bt, "hidden", (H(d), n(), U(() => H(d) !== "integrations" && H(d) !== "roadmap" || n().phase !== "ready"))), X(Bt, "aria-label", H(d) === "roadmap" ? "Roadmap note" : "Integration catalog"), X(Ht, "hidden", (H(d), n(), U(() => H(d) !== "media" || n().phase !== "ready")));
	}), G("click", E, () => b("home")), G("click", te, () => b("note")), G("click", ie, () => b("connections")), G("click", oe, () => b("directory")), G("click", ce, () => b("activity")), G("click", ue, () => b("notifications")), G("click", me, () => b("integrations")), G("click", ge, () => b("roadmap")), G("click", ve, () => b("media")), Cr("submit", Te, () => l.signOut()), G("click", tt, () => b("note")), G("click", rt, () => b("roadmap")), G("click", st, function(...e) {
		l.beginLayout?.apply(this, e);
	}), Cr("submit", vt, (e) => {
		e.preventDefault(), l.save();
	}), G("input", yt, (e) => l.edit(e.currentTarget.value)), q(e, S), Ge(), i();
}
wr(["click", "input"]);
// src/main.ts
var us = document.getElementById("workspace-root"), ds = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, fs = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
if (us && ds && /^[a-f0-9]{64}$/.test(ds) && fs === "reborn-workspace-v1") {
	let e = Array.from(us.childNodes);
	us.replaceChildren();
	try {
		Rr(ls, {
			target: us,
			props: { binding: ds }
		});
	} catch {
		us.replaceChildren(...e);
	}
}
