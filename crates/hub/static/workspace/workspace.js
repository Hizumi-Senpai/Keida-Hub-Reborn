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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, E = 1 << 21, ee = 1 << 22, D = 1 << 23, te = Symbol("$state"), ne = Symbol("component"), re = Symbol("legacy props"), ie = Symbol(""), ae = Symbol("attributes"), oe = Symbol("class"), se = Symbol("style"), ce = Symbol("text"), le = Symbol("form reset"), ue = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), O = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), de = {}, fe = Symbol("uninitialized"), pe = "http://www.w3.org/1999/xhtml";
function me() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function he(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function ge() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function _e() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// ../node_modules/svelte/src/internal/client/dom/hydration.js
var k = !1;
function A(e) {
	k = e;
}
var j;
function ve(e) {
	if (e === null) throw he(), de;
	return j = e;
}
function ye() {
	return ve(/* @__PURE__ */ on(j));
}
function M(e) {
	if (k) {
		if (/* @__PURE__ */ on(j) !== null) throw he(), de;
		j = e;
	}
}
function be(e = 1) {
	if (k) {
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
	if (!e || e.nodeType !== 8) throw he(), de;
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
function N(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
// ../node_modules/svelte/src/internal/client/errors.js
function Ee() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function De(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Oe(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function ke() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ae(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function je() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Me(e) {
	throw Error("https://svelte.dev/e/lifecycle_legacy_only");
}
function Ne(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Pe() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Fe() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ie() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Le() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// ../node_modules/svelte/src/internal/flags/index.js
var Re = !1;
function ze() {
	Re = !0;
}
// ../node_modules/svelte/src/internal/client/context.js
var Be = null;
function Ve(e) {
	Be = e;
}
function He(e, t = !1, n) {
	Be = {
		p: Be,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: qn,
		l: Re && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ue(e) {
	var t = Be, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) bn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Be = t.p, We(e);
}
function We(e = {}) {
	return i(e, ne, { value: !0 }), e;
}
function Ge() {
	return !Re || Be !== null && Be.l === null;
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
	k && /* @__PURE__ */ an(e) !== null && cn(e);
}
var tt = !1;
function nt() {
	tt || (tt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[le]?.();
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
	let i = e[le];
	e[le] = i ? () => {
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
	var e = qn, t = Wn, n = Be, r = F;
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
		ctx: Be,
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
	r === null && Ee();
	var i = void 0, a = zt(fe), o = !Wn, s = /* @__PURE__ */ new Set();
	return En(() => {
		var t = qn, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ue && n.reject(e);
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
			l?.(), s.delete(n), t !== ut && (c.activate(), t ? (a.f |= D, Wt(a, t)) : (a.f & 8388608 && (a.f ^= D), Wt(a, e)), c.deactivate());
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
		t.ac.abort(ue), t.ac = null;
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
		je();
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
	return t || (r.equals = Te), Re && n && Be !== null && Be.l !== null && (Be.l.s ??= []).push(r), r;
}
function Vt(e, t) {
	return L(e, U(() => H(e))), t;
}
function L(e, t, n = !1) {
	return Wn !== null && (!Gn || Wn.f & 131072) && Ge() && Wn.f & 4325394 && (Yn === null || !Yn.has(e)) && Ie(), Wt(e, n ? Yt(t) : t, Tt);
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
	if (typeof t != "object" || !t || te in t || ne in t) return t;
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
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Pe();
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
			if (n === te) return t;
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
			if (t === te) return !0;
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
			Fe();
		}
	});
}
function Xt(e) {
	try {
		if (typeof e == "object" && e && te in e) return e[te];
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
		en = a(t, "firstChild").get, tn = a(t, "nextSibling").get, u(e) && (e[oe] = void 0, e[ae] = null, e[se] = void 0, e.__e = void 0), u(n) && (n[ce] = void 0);
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
	if (!k) return /* @__PURE__ */ an(e);
	var n = /* @__PURE__ */ an(j);
	if (n === null) n = j.appendChild(rn());
	else if (t && n.nodeType !== 3) {
		var r = rn();
		return n?.before(r), ve(r), r;
	}
	return t && dn(n), ve(n), n;
}
function sn(e, t = !1) {
	if (!k) {
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
	if (!k) return /* @__PURE__ */ an(e);
	var n = R(e, t);
	return M(e), n;
}
function B(e, t = 1, n = !1) {
	let r = k ? j : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ on(r);
	if (!k) return r;
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
	if (t === null) return Wn.f |= D, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	pn(e, t);
}
function pn(e, t) {
	if (e === de) throw e;
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
	qn === null && (Wn === null && Ae(e), ke()), Hn && Oe(e);
}
function hn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function gn(e, t) {
	var n = qn;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: Be,
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
	if (!Wn && t & 32 && Be !== null && !Be.i) {
		var n = Be;
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
	var n = Be, r = {
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
	var e = Be;
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
			e.abort(ue);
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
	var t = Zn, n = Qn, r = $n, i = Wn, a = Yn, o = Be, s = Gn, c = rr, l = e.f;
	Zn = null, Qn = 0, $n = null, Wn = l & 96 ? null : e, Yn = null, Ve(e.ctx), Gn = !1, rr = ++nr, e.ac !== null && (rt(() => {
		e.ac.abort(ue);
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
		return e.f & 8388608 && (e.f ^= D), d;
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
			s.ac.abort(ue), s.ac = null, Ze(s, g);
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
		if (te in e) gr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && te in n && gr(n);
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
		if (k) return jr(j, null), j;
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
	if (!k) {
		var t = rn(e + "");
		return jr(t, t), t;
	}
	var n = j;
	return n.nodeType === 3 ? dn(n) : (n.before(n = rn()), ve(n)), jr(n, n), n;
}
function Nr() {
	if (k) return jr(j, null), j;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = rn();
	return e.append(t, n), jr(t, n), e;
}
function q(e, t) {
	if (k) {
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
	#t = k ? j : null;
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
			if (k) {
				let e = Se(this.#t);
				ye();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Fr), k && (this.#e = j);
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
			this.#y() || (t ? _e() : (t = !0, n && Le(), this.#s !== null && In(this.#s, () => {
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
		var t = qn, n = Wn, r = Be;
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
		if (e === de || !this.#n.onerror && !this.#n.failed) throw e;
		F?.is_fork ? (this.#a && F.skip_effect(this.#a), this.#o && F.skip_effect(this.#o), this.#s && F.skip_effect(this.#s), F.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (Nn(this.#a), null), this.#o &&= (Nn(this.#o), null), this.#s &&= (Nn(this.#s), null), k && (ve(this.#t), be(), ve(xe()));
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
	n !== (e[ce] ??= e.nodeValue) && (e[ce] = n, e.nodeValue = `${n}`);
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
			var n = Be;
			if (o && (n.c = o), a && (i.$$events = a), k && jr(t, null), l = e(t, i) || We(), k && (qn.nodes.end = j, j === null || j.nodeType !== 8 || j.data !== "]")) throw he(), de;
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
		} else k && (this.anchor = j), this.#a(n);
	}
};
// ../node_modules/svelte/src/internal/client/dom/blocks/if.js
function Y(e, t, n = !1) {
	var r;
	k && (r = j, ye());
	var i = new Hr(e), a = n ? S : 0;
	function o(e, t) {
		if (k) {
			var n = Se(r);
			if (e !== parseInt(n.substring(1))) {
				var a = xe();
				ve(a), i.anchor = a, A(!1), i.ensure(e, t), A(!0);
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
		c = k ? ve(/* @__PURE__ */ an(u)) : u.appendChild(rn());
	}
	k && ye();
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
			k && Se(c) === "[!" != (t === 0) && (c = xe(), ve(c), A(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = F, v = ln(), y = 0; y < t; y += 1) {
				k && j.nodeType === 8 && j.data === "]" && (c = j, r = !0, A(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && Wt(S.v, b), S.i && Wt(S.i, y), v && _.unskip_effect(S.e)) : (S = Xr(l, m ? c : Kr ??= rn(), b, x, y, o, n, i), m || (S.e.f |= T), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = kn(() => s(c)) : (d = kn(() => s(Kr ??= rn())), d.f |= T)), t > u.size && De("", "", ""), k && t > 0 && ve(xe()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && A(!0), H(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, k && (c = j);
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
	var o = e[oe];
	if (k || o !== n || o === void 0) {
		var s = ei(n, r, a);
		k && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[oe] = n;
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
		if (!e(n)) return ge();
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
var li = Symbol("is custom element"), ui = Symbol("is html"), di = O ? "link" : "LINK", fi = O ? "progress" : "PROGRESS";
function pi(e) {
	if (k) {
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
		e[le] = n, Je(n), nt();
	}
}
function mi(e, t) {
	var n = hi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === fi) && (e.value = t ?? "");
}
function X(e, t, n, r) {
	var i = hi(e);
	k && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === di) || i[t] !== (i[t] = n) && (t === "loading" && (e[ie] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && _i(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function hi(e) {
	return e[ae] ??= {
		[li]: e.nodeName.includes("-"),
		[ui]: e.namespaceURI === pe
	};
}
var gi = /* @__PURE__ */ new Map();
function _i(e) {
	var t = e.getAttribute("is") || e.nodeName, n = gi.get(t);
	if (n) return n;
	gi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function vi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	it(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = bi(e) ? xi(a) : a, n(a), F !== null && r.add(F), await pr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (k && e.defaultValue !== e.value || U(t) == null && e.value) && (n(bi(e) ? xi(e.value) : e.value), F !== null && r.add(F)), Dn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = F;
			if (r.has(i)) return;
		}
		bi(e) && n === xi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function yi(e, t, n = t) {
	it(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (k && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), Dn(() => {
		e.checked = !!t();
	});
}
function bi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function xi(e) {
	return e === "" ? null : +e;
}
// ../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Si(e, t) {
	return e === t || e?.[te] === t;
}
function Ci(e = We(), t, n, r) {
	var i = Be.r, a = qn;
	return Cn(() => {
		var o, s;
		return Dn(() => {
			o = s, s = r?.() || [], U(() => {
				Si(n(...s), e) || (t(e, ...s), o && Si(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Si(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// ../node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function wi(e = !1) {
	let t = Be, n = t.l.u;
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
		Ti(t, r), p(n.b);
	}), yn(() => {
		let e = U(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && yn(() => {
		Ti(t, r), p(n.a);
	});
}
function Ti(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
	t();
}
// ../node_modules/svelte/src/store/utils.js
function Ei(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), d;
	let r = U(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// ../node_modules/svelte/src/store/shared/index.js
var Di = [];
function Oi(e, t = d) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (we(e, t) && (e = t, n)) {
			let t = !Di.length;
			for (let t of r) t[1](), Di.push(t, e);
			if (t) {
				for (let e = 0; e < Di.length; e += 2) Di[e][0](Di[e + 1]);
				Di.length = 0;
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
function ki(e) {
	let t;
	return Ei(e, (e) => t = e)(), t;
}
// ../node_modules/svelte/src/internal/client/reactivity/store.js
var Ai = !1, ji = Symbol("unmounted");
function Mi(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ I(void 0),
		unsubscribe: d
	};
	if (r.store !== e && !(ji in n)) {
		if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = d;
		else {
			var i = !0;
			r.unsubscribe = Ei(e, (e) => {
				i ? r.source.v = e : L(r.source, e);
			}), i = !1;
		}
	}
	return e && ji in n ? ki(e) : H(r.source);
}
function Ni() {
	let e = {};
	function t() {
		vn(() => {
			for (var t in e) e[t].unsubscribe();
			i(e, ji, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Pi(e) {
	var t = Ai;
	try {
		return Ai = !1, [e(), Ai];
	} finally {
		Ai = t;
	}
}
// ../node_modules/svelte/src/internal/client/reactivity/props.js
function Z(e, t, n, r) {
	var i = !Re || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ lt(r), H(u)) : (l && (l = !1, c = s ? U(r) : r), c);
	let f;
	if (o) {
		var p = te in e || re in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = Pi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ne(t), f(m)));
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
function Fi(e) {
	Be === null && N("onMount"), Re && Be.l !== null ? zi(Be).m.push(e) : yn(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function Ii(e) {
	Be === null && N("onDestroy"), Fi(() => () => U(e));
}
function Li(e) {
	Be === null && N("beforeUpdate"), Be.l === null && Me("beforeUpdate"), zi(Be).b.push(e);
}
function Ri(e) {
	Be === null && N("afterUpdate"), Be.l === null && Me("afterUpdate"), zi(Be).a.push(e);
}
function zi(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
// ../node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), ze();
// src/refresh.ts
var Bi = "keida-hub-reborn", Vi = "reborn-workspace-v1", Hi = 6e4, Ui = 4e3, Wi = (e) => typeof e == "object" && !!e && !Array.isArray(e), Gi = (e, t) => typeof e == "string" && e.length > 0 && e.length <= t && /^[A-Za-z0-9._-]+$/.test(e), Ki = (e) => typeof e == "string" && /^[a-f0-9]{40}$/.test(e);
function qi(e) {
	if (!Wi(e) || !Gi(e.product, 64) || !Gi(e.version, 100) || !Gi(e.contract, 80) || !Gi(e.package_version, 40) || ![
		"accepted",
		"preview",
		"development"
	].includes(String(e.channel))) throw Error("Invalid build");
	let t = Ki(e.commit) && Ki(e.tree);
	if (e.channel === "accepted") {
		if (!t || !Number.isSafeInteger(e.ordinal) || e.ordinal < 0 || e.version !== `0.1.${e.ordinal}`) throw Error("Invalid accepted build");
	} else if (e.ordinal !== null || (e.channel === "preview" ? !t || !/^0\.1\.(0|[1-9][0-9]*)-preview\.[a-f0-9]{12}$/.test(e.version) || !e.version.endsWith(e.commit.slice(0, 12)) : !(t && e.version === `0.1.0-development.${e.commit.slice(0, 12)}` || e.commit === "unqualified" && e.tree === "unqualified" && e.version === "development"))) throw Error("Invalid development build");
	return {
		product: e.product,
		version: e.version,
		commit: e.commit,
		tree: e.tree,
		ordinal: e.ordinal,
		channel: e.channel,
		contract: e.contract,
		package_version: e.package_version
	};
}
function Ji() {
	let e = (e) => document.querySelector(`meta[name="reborn-${e}"]`)?.content ?? "";
	try {
		let t = e("ordinal");
		return t !== "" && !/^(0|[1-9][0-9]*)$/.test(t) ? void 0 : qi({
			product: e("product"),
			version: e("version"),
			commit: e("commit"),
			tree: e("tree"),
			ordinal: t === "" ? null : Number(t),
			channel: e("channel"),
			contract: e("auth-contract"),
			package_version: e("package-version")
		});
	} catch {
		return;
	}
}
var Yi = (e, t) => Object.keys(e).every((n) => e[n] === t[n]), Xi = (e, t) => Wi(e.account) && e.account.id === t.account.id && e.account.username === t.account.username && e.account.role === t.account.role && e.session_generation === t.session_generation, Zi = class extends Error {
	kind;
	running;
	detail;
	constructor(e, t, n) {
		super(e), this.kind = e, this.running = t, this.detail = n;
	}
};
function Qi(e, t) {
	let n = Ji(), r = Oi({
		phase: "idle",
		loaded: n,
		review: !1,
		message: "Check the server version when ready."
	}), i = 0, a, o, s = !1, c = !1, l = 0, u, d = 0, f, p = (e) => r.update((t) => ({
		...t,
		...e
	}));
	function m() {
		++i, a?.abort(), a = void 0, o && clearTimeout(o), o = void 0, f?.(), f = void 0, u = void 0, c = !1;
	}
	function h(e, n, r) {
		p({
			phase: e,
			...n ? { running: n } : {},
			message: r ?? (e === "sign-in-required" ? "Your sign-in changed or ended. Use a fresh sign-in to continue." : "This page cannot continue with the server now answering. Open a fresh document when you are ready.")
		}), t.blocked(e === "sign-in-required" ? "Your sign-in changed or ended. Open a fresh workspace after signing in." : "The server is incompatible with this loaded page. Open a fresh document.");
	}
	async function g(t, n, r) {
		let i = new AbortController(), a = performance.now(), o = () => i.abort();
		n.addEventListener("abort", o, { once: !0 }), n.aborted && i.abort();
		let s = Math.min(Ui, r - a);
		if (s <= 0) throw n.removeEventListener("abort", o), Error("Deadline");
		let c = setTimeout(o, s);
		try {
			let o = await fetch(t, {
				method: "GET",
				credentials: "same-origin",
				cache: "no-store",
				redirect: "error",
				signal: i.signal,
				headers: {
					"X-Reborn-Product": Bi,
					"X-Reborn-Contract": Vi,
					"X-CSRF-Token": e
				}
			});
			if (n.aborted || i.signal.aborted || performance.now() - a >= s || performance.now() >= r) throw Error("Deadline");
			if (o.status !== 200) return { status: o.status };
			if (o.headers.get("content-type")?.split(";")[0].trim() !== "application/json" || !o.body) throw Error("Invalid reply");
			let c = o.body.getReader(), l = [], u = 0;
			try {
				for (;;) {
					let { done: e, value: t } = await c.read();
					if (e) break;
					if (u += t.byteLength, u > 8192 || n.aborted || i.signal.aborted || performance.now() - a >= s || performance.now() >= r) throw Error("Invalid reply");
					l.push(t);
				}
			} catch (e) {
				throw await c.cancel().catch(() => {}), e;
			}
			if (n.aborted || i.signal.aborted || performance.now() - a >= s || performance.now() >= r) throw Error("Deadline");
			let d = new Uint8Array(u), f = 0;
			for (let e of l) d.set(e, f), f += e.byteLength;
			return {
				status: 200,
				value: JSON.parse(new TextDecoder("utf-8", { fatal: !0 }).decode(d))
			};
		} finally {
			clearTimeout(c), n.removeEventListener("abort", o);
		}
	}
	async function _(e, t, r) {
		let i = await g("/api/health", e, t);
		if (i.status !== 200 || !Wi(i.value) || i.value.status !== "ok") throw Error("Unavailable health");
		let a = qi(i.value.identity);
		if (!n || n.product !== Bi || a.product !== Bi || n.contract !== "reborn-auth-v1" || a.contract !== n.contract || document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content !== Vi) throw new Zi("incompatible", a);
		let o = await g("/api/workspace/access", e, t);
		if (o.status === 401 || o.status === 403) throw new Zi("sign-in-required", a);
		if (o.status === 404 || o.status === 405) throw new Zi("incompatible", a, "The running server does not support this page’s refresh checks. Use your Account link to open a fresh document when ready.");
		if (o.status === 426) throw new Zi("incompatible", a);
		if (o.status !== 200 || !Wi(o.value)) throw Error("Unavailable access");
		let s = o.value;
		if (s.product !== Bi || s.contract !== Vi || s.schema !== 1) throw new Zi("incompatible", a);
		if (!Xi(s, r)) throw new Zi("sign-in-required", a);
		if (!Yi(a, qi(s.identity))) throw Error("Server changed between probes");
		return a;
	}
	async function v() {
		let e = t.scope();
		if (s || a || !e || document.visibilityState !== "visible" || ki(r).review) return;
		let o = new AbortController(), c = ++i;
		if (a = o, ki(r).phase === "compatible-ready") return void (a = void 0);
		p({ phase: "checking" });
		try {
			let t = await _(o.signal, performance.now() + Ui * 2, e);
			if (s || o.signal.aborted || i !== c) return;
			p({
				running: t,
				phase: Yi(n, t) ? "current" : "changed",
				message: Yi(n, t) ? "This page matches the running server." : "The running server changed. Review your work before refreshing."
			});
		} catch (e) {
			if (s || o.signal.aborted || i !== c) return;
			e instanceof Zi ? h(e.kind, e.running, e.detail) : p({
				phase: "unavailable",
				message: "The server version could not be checked. This page has not refreshed."
			});
		} finally {
			a === o && (a = void 0);
		}
	}
	function y() {
		m(), p({
			phase: "cancelled",
			message: "Refresh checks cancelled. This page has not refreshed."
		});
	}
	function b(e = !1) {
		if (e) {
			let e = ki(r).phase;
			m(), ["sign-in-required", "incompatible"].includes(e) || p({
				phase: "cancelled",
				review: !1,
				message: "Workspace access paused. Open a fresh document to check access."
			});
		} else c || (m(), ki(r).phase === "checking" && p({ phase: "idle" }));
	}
	async function x() {
		if (s || c || t.busy()) return;
		let e = t.scope();
		if (!e) {
			h("sign-in-required");
			return;
		}
		m();
		let n = new AbortController(), r = ++i, g = performance.now() + Hi;
		a = n, c = !0, p({
			phase: "reconnecting",
			review: !0,
			message: "Checking the running server and your access. This can take up to one minute."
		});
		let v = () => {
			i !== r || s || (n.abort(), f?.(), p({
				phase: "could-not-reconnect",
				message: "Could not reconnect within one minute. Your page has not refreshed."
			}));
		};
		d = g, u = v, o = setTimeout(v, Hi);
		let y = 1e3;
		try {
			for (; !s && i === r && !n.signal.aborted && performance.now() < g;) {
				if (document.visibilityState === "visible") try {
					let t = await _(n.signal, g, e);
					if (s || i !== r || n.signal.aborted || performance.now() >= g) break;
					if (document.visibilityState !== "visible") throw Error("Workspace hidden");
					l = performance.now(), p({
						running: t,
						phase: "compatible-ready",
						message: "The server and your account are ready. Review unfinished work, then choose whether to refresh."
					});
					return;
				} catch (e) {
					if (s || i !== r || n.signal.aborted) break;
					if (e instanceof Zi) {
						h(e.kind, e.running, e.detail);
						return;
					}
				}
				if (performance.now() >= g) break;
				await new Promise((e) => {
					let t = setTimeout(() => {
						f = void 0, e();
					}, Math.min(y, g - performance.now()));
					f = () => {
						clearTimeout(t), e();
					};
				}), y = Math.min(y * 2, 1e4);
			}
			!s && i === r && v();
		} finally {
			i === r && (o && clearTimeout(o), o = void 0, u = void 0, c = !1, a === n && (a = void 0));
		}
	}
	function S(e) {
		s || ki(r).phase !== "compatible-ready" || (t.busy() ? p({ message: "Finish or check the pending change before refreshing." }) : performance.now() - l > 15e3 ? p({
			phase: "unavailable",
			message: "The access check expired. Check again before refreshing."
		}) : t.drafts() && !e ? p({ message: "Unfinished work is still here. Save it, stay, or choose to discard it deliberately." }) : (e && t.discard(), m(), t.leaving(), window.location.assign("/workspace")));
	}
	return {
		model: r,
		discover: v,
		reconnect: x,
		navigate: S,
		cancel: y,
		pause: b,
		resume: () => {
			c && (performance.now() >= d ? u?.() : f?.());
		},
		review: () => {
			c || m(), p({ review: !0 });
		},
		stay: () => {
			c ? y() : ki(r).phase === "compatible-ready" && p({ phase: "idle" }), p({ review: !1 });
		},
		dispose: () => {
			s = !0, m();
		}
	};
}
// src/tiles.ts
var $i = () => ({
	phase: "idle",
	save: "idle",
	message: ""
}), ea = (e) => typeof e == "object" && !!e && !Array.isArray(e), ta = (e) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= 9223372036854775807n, na = (e) => e.map((e) => ({ ...e })), ra = (e, t) => e.length === t.length && e.every((e, n) => e.id === t[n].id && e.size === t[n].size), ia = (e) => `${e.account.id}:${e.account.username}:${e.account.role}:${e.session_generation}`, aa = class extends Error {};
function oa(e, t) {
	if (!Array.isArray(e) || e.length < 1 || e.length > t.length || new Set(e.map((e) => ea(e) ? e.id : void 0)).size !== e.length || e.some((e) => !ea(e) || !t.includes(e.id) || !["normal", "wide"].includes(String(e.size)))) throw Error("Invalid tiles");
	return e.map((e) => ({
		id: e.id,
		size: e.size
	}));
}
function sa(e, t) {
	if (!ea(e) || e.product !== "keida-hub-reborn" || e.contract !== "reborn-workspace-v1" || e.schema !== 1 || e.tiles_contract !== "reborn-tiles-v1" || !ea(e.account) || e.account.id !== t.account.id || e.account.username !== t.account.username || e.account.role !== t.account.role || e.session_generation !== t.session_generation) throw new aa("Invalid tile scope");
	let n = t.account.role === "owner" ? [
		"games",
		"jellyfin",
		"requests",
		"downloads",
		"services",
		"note"
	] : [
		"games",
		"services",
		"note"
	];
	if (!Array.isArray(e.catalog) || e.catalog.length !== n.length || new Set(e.catalog.map((e) => ea(e) ? e.id : void 0)).size !== n.length || e.catalog.some((e) => !ea(e) || !n.includes(e.id) || typeof e.label != "string" || e.label.length < 1 || new TextEncoder().encode(e.label).length > 80 || /[\u0000-\u001f\u007f]/u.test(e.label)) || !ea(e.layout) || !ta(e.layout.revision)) throw Error("Invalid tile catalog");
	return {
		catalog: e.catalog.map((e) => ({
			id: e.id,
			label: e.label
		})),
		defaults: oa(e.defaults, n),
		layout: {
			revision: e.layout.revision,
			tiles: oa(e.layout.tiles, n)
		}
	};
}
function ca(e) {
	let t = Oi($i()), n, r = 0, i, a, o = () => ki(t), s = (t, i) => i === r && n === ia(t) && e.scope() && ia(e.scope()) === n;
	function c() {
		++r, i?.abort(), a?.abort(), i = void 0, a = void 0, n = void 0, t.set($i());
	}
	function l(e) {
		let t = ia(e);
		n !== t && (c(), n = t), u(!1);
	}
	async function u(c = !0) {
		let l = e.scope(), u = o();
		if (!l || n !== ia(l) || i || a || !c && (u.save === "uncertain" || u.phase === "error") || document.visibilityState !== "visible") return;
		let d = new AbortController(), f = r;
		i = d, (!u.value || c && u.save === "conflict") && t.set({
			...u,
			phase: "loading",
			message: "Checking your saved tiles…"
		});
		try {
			let n = await e.request("/api/workspace/tiles", d);
			if (!s(l, f) || d.signal.aborted) return;
			if ([
				401,
				403,
				426
			].includes(n.status)) {
				e.blocked(n.status);
				return;
			}
			if (n.status !== 200) throw Error("Tiles unavailable");
			let r = sa(n.value, l), i = o();
			if (i.value && BigInt(r.layout.revision) < BigInt(i.value.layout.revision)) throw Error("Older layout");
			let a = c && !!i.draft && ra(i.draft.tiles, r.layout.tiles), u = !!i.draft && !a && i.draft.base !== r.layout.revision;
			t.set({
				phase: "ready",
				value: r,
				draft: a ? void 0 : i.draft,
				save: a ? "idle" : u ? "conflict" : c && i.save === "uncertain" ? "idle" : i.save,
				message: a ? "Saved tiles checked. They match your changes." : u ? "A newer tile layout was saved. Your changes are kept for comparison." : i.save === "uncertain" && c ? "Saved tiles checked. Review your changes before saving deliberately." : i.draft ? i.message : "Your tiles, saved to your account."
			});
		} catch (n) {
			s(l, f) && i === d && (n instanceof aa ? e.blocked(401) : t.update((e) => ({
				...e,
				phase: "error",
				message: "Your saved tiles could not be checked. Retry, or open a fresh workspace from Account & recovery."
			})));
		} finally {
			i === d && (i = void 0);
		}
	}
	function d() {
		let n = o();
		e.scope() && n.value && !n.draft && !a && n.save === "idle" && (i?.abort(), i = void 0, t.set({
			...n,
			draft: {
				base: n.value.layout.revision,
				tiles: na(n.value.layout.tiles)
			},
			message: "Choose your tiles, order and widths, then save."
		}));
	}
	function f(n) {
		let r = o();
		e.scope() && r.value && r.draft && r.save === "idle" && t.set({
			...r,
			draft: {
				...r.draft,
				tiles: n
			},
			message: "Your tile arrangement is unsaved."
		});
	}
	function p(e) {
		let t = o();
		t.draft && t.value?.catalog.some((t) => t.id === e) && !t.draft.tiles.some((t) => t.id === e) && f([...na(t.draft.tiles), {
			id: e,
			size: t.value.defaults.find((t) => t.id === e)?.size ?? "normal"
		}]);
	}
	function m(e) {
		let t = o();
		!t.draft || t.draft.tiles.length < 2 || f(t.draft.tiles.filter((t) => t.id !== e));
	}
	function h(e, t) {
		let n = o().draft?.tiles;
		if (!n) return;
		let r = na(n), i = r.findIndex((t) => t.id === e), a = i + t;
		i < 0 || a < 0 || a >= r.length || ([r[i], r[a]] = [r[a], r[i]], f(r));
	}
	function g(e, t) {
		let n = o().draft?.tiles;
		n && ["normal", "wide"].includes(t) && f(n.map((n) => n.id === e ? {
			...n,
			size: t
		} : { ...n }));
	}
	function _() {
		let e = o();
		e.value && f(na(e.value.defaults));
	}
	function v() {
		let n = o();
		!e.scope() || a || ["saving", "uncertain"].includes(n.save) || t.set({
			...n,
			draft: void 0,
			save: "idle",
			message: "Your saved tile layout is in use."
		});
	}
	function y(e) {
		let n = o();
		n.value && n.draft && n.save === "conflict" && n.phase === "ready" && (e ? v() : t.set({
			...n,
			draft: {
				...n.draft,
				base: n.value.layout.revision
			},
			save: "idle",
			message: "Your arrangement is kept. Review it, then save deliberately."
		}));
	}
	async function b() {
		let c = e.scope(), l = o();
		if (!c || n !== ia(c) || !l.value || !l.draft || a || l.save !== "idle" || ra(l.draft.tiles, l.value.layout.tiles)) return;
		i?.abort(), i = void 0;
		let d = {
			base_revision: l.draft.base,
			tiles: na(l.draft.tiles)
		}, f = new AbortController(), p = r;
		a = f, t.set({
			...l,
			save: "saving",
			message: "Saving your tile layout…"
		});
		let m = !1;
		try {
			let n = await e.request("/api/workspace/tiles", f, d);
			if (!s(c, p) || f.signal.aborted) return;
			if ([
				401,
				403,
				426
			].includes(n.status)) {
				e.blocked(n.status);
				return;
			}
			if (n.status === 409) m = !0, t.update((e) => ({
				...e,
				phase: "loading",
				save: "conflict",
				message: "Another tile layout was saved first. Checking it before comparison…"
			}));
			else if ([
				400,
				413,
				429
			].includes(n.status)) t.update((e) => ({
				...e,
				save: "idle",
				message: "The tiles were not accepted. Keep at least one tile and review the arrangement."
			}));
			else {
				if (n.status !== 200) throw Error("Uncertain tiles");
				let e = sa(n.value, c);
				if (BigInt(e.layout.revision) !== BigInt(d.base_revision) + 1n || !ra(d.tiles, e.layout.tiles)) throw Error("Unqualified tile receipt");
				t.set({
					phase: "ready",
					value: e,
					save: "idle",
					message: "Tile layout saved to your account."
				});
			}
		} catch (n) {
			s(c, p) && (n instanceof aa ? e.blocked(401) : t.update((e) => ({
				...e,
				save: "uncertain",
				message: "The tile layout may have saved. Check saved tiles before saving again; your changes have not been sent again."
			})));
		} finally {
			a === f && (a = void 0), m && s(c, p) && await u(!0);
		}
	}
	return {
		model: t,
		admit: l,
		clear: c,
		check: u,
		begin: d,
		add: p,
		remove: m,
		move: h,
		resize: g,
		reset: _,
		cancel: v,
		resolve: y,
		save: b,
		busy: () => !!a || o().save === "uncertain",
		drafts: () => !!o().draft
	};
}
// src/controller.ts
var la = "keida-hub-reborn", ua = "reborn-workspace-v1", da = 9223372036854775807n, fa = () => ({
	phase: "idle",
	message: ""
}), pa = () => ({
	phase: "idle",
	entries: [],
	through: "0",
	next: null,
	category: "all",
	query: "",
	message: ""
}), ma = () => ({
	phase: "idle",
	message: ""
}), ha = () => ({
	phase: "idle",
	entries: [],
	revision: "0",
	through: "0",
	next: null,
	message: ""
}), ga = ["jellyfin", "seerr"], _a = () => ({
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
}), va = [
	"sonarr",
	"radarr",
	"qbittorrent"
], ya = {
	sonarr: "sonarr-v3",
	radarr: "radarr-v3",
	qbittorrent: "qbittorrent-v2-key"
}, ba = () => ({
	phase: "idle",
	offset: 0,
	save: "idle",
	message: ""
}), xa = () => ({
	sonarr: ba(),
	radarr: ba(),
	qbittorrent: ba()
}), Sa = () => ({
	phase: "idle",
	save: "idle",
	message: ""
}), Ca = () => ({
	phase: "idle",
	save: "idle",
	message: ""
}), wa = (e, t) => ({
	phase: e,
	message: t,
	draft: "",
	base: "0",
	dirty: !1,
	save: "idle",
	storageLimited: !1,
	directorySave: "idle",
	directoryMessage: "",
	activity: pa(),
	notificationSave: "idle",
	notificationMessage: "",
	guide: ma(),
	games: fa(),
	observations: ha(),
	media: _a(),
	queues: xa(),
	identity: Sa(),
	sessions: Ca()
}), Q = (e) => typeof e == "object" && !!e && !Array.isArray(e), $ = (e, t = !1) => typeof e == "string" && /^(0|[1-9][0-9]{0,18})$/.test(e) && BigInt(e) <= da && (!t || e !== "0"), Ta = (e) => typeof e == "string" && !e.includes("\0") && new TextEncoder().encode(e).length <= 4096, Ea = (e, t, n = !1) => typeof e == "string" && (!n || e.trim().length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e), Da = (e, t, n) => Array.isArray(e) && e.length <= t && e.every((e) => Ea(e, n, !0)), Oa = (e) => $(e) && BigInt(e) <= 253402300799n, ka = [
	"unavailable",
	"invalid_configuration",
	"timeout",
	"transport",
	"denied",
	"provider_error",
	"oversized",
	"malformed",
	"not_discovered"
], Aa = (e) => e === null || typeof e == "string" && ka.includes(e), ja = (e) => e === null || typeof e == "number" && Number.isSafeInteger(e) && e >= 0 && e <= 1e6;
function Ma(e) {
	if (typeof e != "string" || new TextEncoder().encode(e).length > 1024 || !/^https:\/\/[^/]/.test(e) || /[\s\u0000-\u001f\u007f\\]/u.test(e)) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "https:" && !!t.hostname && !t.username && !t.password && !e.includes("?") && !e.includes("#");
	} catch {
		return !1;
	}
}
function Na(e) {
	if (!Q(e) || !Array.isArray(e.groups) || e.groups.length > 2 || !Number.isInteger(e.unread_groups) || new Set(e.groups.map((e) => Q(e) ? e.category : null)).size !== e.groups.length || e.groups.some((e) => !Q(e) || !["services", "connections"].includes(String(e.category)) || !$(e.revision, !0) || !$(e.read_through) || !$(e.unread) || BigInt(e.read_through) > BigInt(e.revision) || BigInt(e.unread) !== BigInt(e.revision) - BigInt(e.read_through) || !Q(e.latest) || !$(e.latest.source_revision, !0) || !$(e.latest.occurred_at) || BigInt(e.latest.occurred_at) > 253402300799n || typeof e.latest.label != "string" || !/^[A-Za-z ]{1,64}$/.test(e.latest.label) || !(e.category === "services" ? [
		"service_added",
		"service_updated",
		"service_removed"
	] : ["connection_saved", "connection_removed"]).includes(String(e.latest.kind))) || e.unread_groups !== e.groups.filter((e) => e.unread !== "0").length) throw Error("Invalid notification response");
	return e;
}
function Pa(e) {
	if (!Q(e) || !$(e.revision) || !Array.isArray(e.panels) || e.panels.length !== 3 || e.panels.some((e) => !Q(e) || ![
		"note",
		"connections",
		"pins"
	].includes(String(e.id)) || typeof e.visible != "boolean") || new Set(e.panels.map((e) => e.id)).size !== 3 || !e.panels.some((e) => e.visible)) throw Error("Invalid layout response");
	return e;
}
function Fa(e) {
	let t = [
		"crafty",
		"jellyfin",
		"seerr",
		"sonarr",
		"radarr",
		"qbittorrent",
		"discord"
	], n = e.catalog, r = e.roadmap;
	if (!Array.isArray(n) || n.length !== t.length || new Set(n.map((e) => Q(e) ? e.id : null)).size !== t.length || n.some((e) => !Q(e) || !t.includes(String(e.id)) || !Ea(e.name, 80, !0) || e.status !== ([
		"crafty",
		"jellyfin",
		"seerr",
		"sonarr",
		"radarr",
		"qbittorrent"
	].includes(String(e.id)) ? "available" : "planned") || !Ea(e.summary, 512, !0) || !Da(e.requirements, 8, 512) || !Da(e.capabilities, 8, 512)) || !Q(r) || typeof r.as_of != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(r.as_of) || !Ea(r.intro, 1024, !0) || !Da(r.priorities, 8, 512) || r.tracker_url !== "https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2" || !Array.isArray(r.milestones) || r.milestones.length !== 9 || r.milestones.some((e, t) => !Q(e) || e.id !== `M${t}` || !Ea(e.title, 120, !0) || !Ea(e.status, 160, !0) || !Da(e.delivered, 8, 512) || !Da(e.remaining, 8, 512))) throw Error("Invalid workspace guide");
	return {
		catalog: n,
		roadmap: r
	};
}
function Ia(e, t, n) {
	if (!$(e.current_revision) || !$(e.through) || e.next_before !== null && !$(e.next_before, !0) || n && (e.current_revision !== t.revision || e.through !== t.through) || !Array.isArray(e.entries) || e.entries.length > 25 || e.entries.some((r) => !Q(r) || !$(r.id, !0) || !$(r.revision, !0) || !Oa(r.checked_at) || !Aa(r.error) || typeof r.complete != "boolean" || !Array.isArray(r.servers) || r.servers.length > 8 || BigInt(r.id) > BigInt(e.through) || n && BigInt(r.id) >= BigInt(t.next) || r.servers.some((e) => !Q(e) || !Ea(e.name, 80, !0) || ![
		"running",
		"stopped",
		"unknown"
	].includes(String(e.state)) || !ja(e.players) || !ja(e.capacity) || e.collected_at !== null && !Oa(e.collected_at) || e.provider_at !== null && !Oa(e.provider_at) || ![
		"fresh",
		"stale",
		"unknown"
	].includes(String(e.freshness)) || !Aa(e.error))) || e.entries.some((t, n) => n > 0 && BigInt(t.id) >= BigInt(e.entries[n - 1].id)) || e.next_before !== null && (e.entries.length !== 25 || e.next_before !== e.entries.at(-1)?.id)) throw Error("Invalid observation history");
	return {
		phase: "ready",
		entries: e.entries,
		revision: e.current_revision,
		through: e.through,
		next: e.next_before,
		message: "Retained provider observations checked."
	};
}
var La = (e) => typeof e == "string" && /^[1-9][0-9]{0,19}$/.test(e) && BigInt(e) <= 18446744073709551615n, Ra = (e) => Ea(e, 320) && e.length > 0 && Array.from(e).length <= 80 && !/^[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/u.test(e) && !/[\u0080-\u009f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u.test(e), za = (e) => Q(e) && La(e.id) && Ra(e.display_name), Ba = [
	"denied",
	"invalid_response",
	"timeout",
	"transport",
	"provider_error",
	"unavailable",
	"restart_required"
];
function Va(e) {
	let t = e.application, n = e.link, r = e.attempt;
	if (!Q(t) || typeof t.configured != "boolean" || !$(t.revision) || t.profile !== "discord-identify-v1" || t.callback_uri !== `${window.location.origin}/account/discord/callback` || !Q(n) || !$(n.revision) || !$(n.flow_generation) || !(n.identity === null || Q(n.identity) && Oa(n.identity.verified_at) && za(n.identity)) || !Q(r) || ![
		"none",
		"awaiting_discord",
		"ready_to_review",
		"reviewing",
		"review_ready",
		"cancelled",
		"failed",
		"restart_required"
	].includes(String(r.phase)) || !(r.candidate === null || za(r.candidate)) || r.cleanup !== null && r.cleanup !== "acknowledged" && r.cleanup !== "unconfirmed" || !(r.error === null || typeof r.error == "string" && Ba.includes(r.error)) || r.candidate !== null && r.phase !== "review_ready" || r.phase === "review_ready" && r.candidate === null || n.identity !== null && r.candidate !== null) throw Error("Invalid identity response");
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
var Ha = (e) => e.attempt.phase === "review_ready" ? "Review the Discord identity below, then confirm deliberately." : e.attempt.phase === "ready_to_review" ? "Discord returned. Review the identity before choosing whether to link it." : e.attempt.phase === "awaiting_discord" ? "Continue with Discord in this browser, or cancel this unfinished link." : e.attempt.phase === "reviewing" ? "The identity review is still in progress. Check status before another action." : ["failed", "restart_required"].includes(e.attempt.phase) ? "The unfinished link could not be completed. Start a new link when ready." : e.attempt.phase === "cancelled" ? "The unfinished link was cancelled." : e.link.identity ? "Your saved Discord identity is shown below." : e.application.configured ? "No Discord identity is linked. You can start a link when ready." : "Discord linking is waiting for owner setup.", Ua = (e) => typeof e == "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(e);
function Wa(e) {
	if (!Oa(e.checked_at) || !Array.isArray(e.sessions) || e.sessions.length < 1 || e.sessions.length > 32 || e.sessions.some((t) => !Q(t) || !Ua(t.id) || !Oa(t.created_at) || !Oa(t.expires_at) || typeof t.current != "boolean" || BigInt(t.expires_at) <= BigInt(e.checked_at) || BigInt(t.expires_at) <= BigInt(t.created_at)) || new Set(e.sessions.map((e) => e.id)).size !== e.sessions.length || e.sessions.filter((e) => e.current === !0).length !== 1 || e.sessions.some((e, t, n) => t > 0 && (BigInt(e.created_at) > BigInt(n[t - 1].created_at) || e.created_at === n[t - 1].created_at && e.id >= n[t - 1].id))) throw Error("Invalid session list");
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
function Ga(e) {
	if (!Q(e) || e.product !== la || e.contract !== ua || e.schema !== 1 || !Q(e.account) || !$(e.account.id, !0) || typeof e.account.username != "string" || !/^[a-z0-9_-]{3,32}$/.test(e.account.username) || e.account.role !== "owner" && e.account.role !== "member" || !$(e.session_generation) || !Q(e.note) || !Ta(e.note.body) || !$(e.note.revision)) throw Error("Invalid workspace response");
	let t = e.directory, n = (e, t, n = !1) => typeof e == "string" && (!n || e.length > 0) && new TextEncoder().encode(e).length <= t && !/[\u0000-\u001f\u007f]/u.test(e);
	if (!Q(t) || !$(t.revision) || !$(t.pins_revision) || !Array.isArray(t.services) || t.services.length > 100 || t.services.some((e) => !Q(e) || !$(e.id, !0) || !n(e.name, 80, !0) || !n(e.category, 40, !0) || !n(e.description, 240) || !Ma(e.url)) || new Set(t.services.map((e) => e.id)).size !== t.services.length || !Array.isArray(t.pins) || t.pins.length > 24 || new Set(t.pins).size !== t.pins.length || t.pins.some((e) => !$(e, !0) || !t.services.some((t) => t.id === e))) throw Error("Invalid directory response");
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
	return Na(e.notifications), Pa(e.layout), e;
}
function Ka(e) {
	if (!(!e || e.length > 25e3)) try {
		let t = JSON.parse(e);
		if (Q(t) && t.schema === 1 && Ta(t.body) && $(t.base)) return {
			body: t.body,
			base: t.base
		};
	} catch {}
}
var qa = (e) => e === null || typeof e == "string" && [
	"checking",
	"unavailable",
	"invalid_configuration",
	"timeout",
	"transport",
	"denied",
	"provider_error",
	"oversized",
	"malformed"
].includes(e), Ja = (e, t, n = 0) => typeof e == "number" && Number.isSafeInteger(e) && e >= n && e <= t;
function Ya(e) {
	if (!$(e.revision) || typeof e.configured != "boolean" || typeof e.checking != "boolean" || !Array.isArray(e.servers) || e.servers.length > 8 || !e.configured && e.servers.length !== 0 || e.servers.some((e) => !Q(e) || !Ea(e.name, 80, !0) || !Ea(e.join, 259) || e.gateway !== null && (!Q(e.gateway) || e.gateway.source !== "join-gateway-v1" || ![
		"sleeping",
		"starting",
		"updating",
		"online",
		"unavailable"
	].includes(String(e.gateway.state)) || !["fresh", "stale"].includes(String(e.gateway.freshness)) || !Ja(e.gateway.checked_at, 253402300799) || !ja(e.gateway.players) || !ja(e.gateway.capacity) || !Aa(e.gateway.error) || e.gateway.state !== "online" && (e.gateway.players !== null || e.gateway.capacity !== null)))) throw Error("Invalid game status");
	let t = e;
	return {
		revision: t.revision,
		configured: t.configured,
		checking: t.checking,
		servers: t.servers.map((e) => ({
			name: e.name,
			join: e.join,
			gateway: e.gateway === null ? null : {
				source: e.gateway.source,
				state: e.gateway.state,
				checked_at: e.gateway.checked_at,
				freshness: e.gateway.freshness,
				players: e.gateway.players,
				capacity: e.gateway.capacity,
				error: e.gateway.error
			}
		}))
	};
}
var Xa = (e) => Ja(e, 48) && e % 12 == 0;
function Za(e, t = Math.floor(Date.now() / 1e3)) {
	let n = e.checked_at, r = !Number.isFinite(t) || t < 0 || n === null || n > t + 5 ? "unknown" : e.freshness === "fresh" && t - n > 90 ? "stale" : e.freshness;
	return r === e.freshness ? e : {
		...e,
		freshness: r
	};
}
function Qa(e, t, n) {
	if (!Q(e) || !$(e.revision) || typeof e.configured != "boolean" || !(e.checked_at === null || Ja(e.checked_at, 253402300799)) || ![
		"fresh",
		"stale",
		"unknown"
	].includes(String(e.freshness)) || !qa(e.error) || typeof e.complete != "boolean" || e.offset !== n || !Xa(e.offset) || !(e.next_offset === null || Xa(e.next_offset) && e.next_offset === n + 12) || !(e.total === null || Ja(e.total, 1e9)) || typeof e.truncated != "boolean" || !Array.isArray(e.items) || e.items.length > 12 || new Set(e.items.map((e) => Q(e) ? e.id : null)).size !== e.items.length || e.items.some((e) => !Q(e) || typeof e.id != "string" || !/^[a-f0-9]{64}$/.test(e.id) || !(e.title === null || Ea(e.title, 240, !0)) || !["movie", "series"].includes(String(e.kind)) || !(e.year === null || Ja(e.year, 9999, 1)) || !qa(e.detail_error) || (t === "jellyfin" ? e.request_status !== null : ![
		"pending",
		"approved",
		"declined",
		"failed",
		"completed",
		"unknown"
	].includes(String(e.request_status)))) || (t === "seerr" ? e.playback !== null : !(e.playback === null || Q(e.playback) && (e.playback.playing === null || Ja(e.playback.playing, 256)) && (e.playback.paused === null || Ja(e.playback.paused, 256)) && qa(e.playback.error))) || !e.configured && (e.items.length !== 0 || e.complete || e.checked_at !== null || e.next_offset !== null)) throw Error("Invalid media response");
	let r = e;
	return Za({
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
var $a = [
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
], eo = [
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
], to = [
	"downloading",
	"importBlocked",
	"importPending",
	"importing",
	"imported",
	"failedPending",
	"failed",
	"ignored",
	"unknown"
], no = [
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
], ro = (e) => e === null || typeof e == "string" && $a.includes(e), io = (e) => e === null || Ja(e, 2 ** 53 - 1);
function ao(e, t = Math.floor(Date.now() / 1e3)) {
	let n = e.checked_at, r = !Number.isFinite(t) || t < 0 || n === null || n > t ? "unknown" : e.freshness === "fresh" && t - n > 90 ? "stale" : e.freshness;
	return r === e.freshness ? e : {
		...e,
		freshness: r
	};
}
function oo(e, t, n) {
	let r = t === "qbittorrent";
	if (!Q(e) || !$(e.revision) || typeof e.configured != "boolean" || e.profile !== ya[t] || !(e.checked_at === null || Ja(e.checked_at, 253402300799)) || ![
		"fresh",
		"stale",
		"unknown"
	].includes(String(e.freshness)) || !ro(e.error) || typeof e.complete != "boolean" || e.offset !== n || !Xa(e.offset) || !(e.next_offset === null || Xa(e.next_offset) && e.next_offset === n + 12) || !(e.total === null || Ja(e.total, 1e9)) || r && e.total !== null || typeof e.truncated != "boolean" || !Array.isArray(e.items) || e.items.length > 12 || new Set(e.items.map((e) => Q(e) ? e.id : null)).size !== e.items.length || e.items.some((e) => !Q(e) || typeof e.id != "string" || !/^[a-f0-9]{64}$/.test(e.id) || !(e.title === null || Ea(e.title, 240, !0)) || typeof e.status != "string" || !(r ? no : eo).includes(e.status) || !(e.import_state === null || !r && typeof e.import_state == "string" && to.includes(e.import_state)) || e.warning !== null && typeof e.warning != "boolean" || !(e.progress_basis_points === null || Ja(e.progress_basis_points, 1e4)) || !io(e.size_bytes) || !io(e.download_bytes_per_second) || !io(e.upload_bytes_per_second) || !r && (e.download_bytes_per_second !== null || e.upload_bytes_per_second !== null)) || !e.configured && (e.items.length !== 0 || e.complete || e.checked_at !== null || e.next_offset !== null || e.total !== null || e.error !== null || e.freshness !== "unknown" || e.truncated) || e.error !== null && e.complete || e.error !== null && e.error !== "checking" && (e.items.length !== 0 || e.next_offset !== null || e.total !== null) || e.error === "page_moved" && (e.items.length !== 0 || e.next_offset !== null || e.total !== null) || e.next_offset !== null && e.items.length !== 12 || e.complete && e.items.some((e) => e.title === null || e.status === "unknown" || e.warning === null || !r && (e.import_state === null || e.import_state === "unknown"))) throw Error("Invalid queue response");
	if (e.configured && e.error === null && !r && (e.total === null || e.items.length !== Math.min(12, Math.max(0, e.total - n)) || e.next_offset !== (n + 12 <= 48 && n + e.items.length < e.total ? n + 12 : null) || e.truncated !== e.total > 60)) throw Error("Invalid queue page");
	if (r && e.truncated && (n !== 48 || e.items.length !== 12 || e.next_offset !== null)) throw Error("Invalid transfer window");
	let i = e;
	return ao({
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
function so(e) {
	let t = Oi(wa("checking", "Checking your workspace…")), n = 0, r, i, a, o, s, c, l, u, d = 0, f, p = 0, m = 0, h = 0, g = !1, _ = {}, v = {}, y = {}, b = {
		jellyfin: 0,
		seerr: 0
	}, x = {
		jellyfin: 0,
		seerr: 0
	}, S = !1, C, w, T = 0, E = !1, ee, D, te = 0, ne = !1, re = {}, ie = {}, ae = {}, oe = {
		sonarr: 0,
		radarr: 0,
		qbittorrent: 0
	}, se = {
		sonarr: 0,
		radarr: 0,
		qbittorrent: 0
	}, ce, le, ue, O = !1, de = !1, fe, pe = !1, me = !1, he = "", ge = "", _e = [], k = /* @__PURE__ */ new Map(), A = () => ki(t), j = ca({
		request: De,
		scope: () => {
			let e = A();
			return !O && !de && e.phase === "ready" && document.visibilityState === "visible" ? e.snapshot : void 0;
		},
		blocked: (e) => N(Oe(e), !0)
	}), ve = () => j.busy() || !!a || !!o || !!f || !!D || !!w || pe || me || ga.some((e) => !!y[e]) || va.some((e) => !!ae[e]) || [
		A().save,
		A().directorySave,
		A().notificationSave,
		A().identity.save,
		A().sessions.save,
		...ga.map((e) => A().media[e].save),
		...va.map((e) => A().queues[e].save)
	].includes("uncertain");
	function ye() {
		let e = A();
		return e.dirty || e.recovery || j.drafts() ? !0 : Array.from(document.querySelectorAll("#workspace-root form input, #workspace-root form textarea, #workspace-root form select")).some((e) => {
			if (e instanceof HTMLInputElement && [
				"hidden",
				"submit",
				"button"
			].includes(e.type) || e.id === "workspace-note") return !1;
			if (e instanceof HTMLInputElement && ["checkbox", "radio"].includes(e.type)) return e.checked !== e.defaultChecked;
			if (e instanceof HTMLSelectElement) {
				let t = Array.from(e.options), n = 0;
				return t.forEach((e, t) => {
					e.defaultSelected && (n = t);
				}), e.selectedIndex !== (n < 0 ? 0 : n);
			}
			return e.value !== e.defaultValue || e instanceof HTMLInputElement && e.type === "password" && e.value.length > 0;
		});
	}
	let M = Qi(e, {
		scope: () => fe,
		blocked: (e) => N(e, !0),
		busy: ve,
		drafts: ye,
		discard: Ce,
		leaving: () => {
			de = !0, Te();
		}
	}), be = () => ({
		busy: ve(),
		drafts: ye()
	});
	function xe(e, n) {
		pe = e, me = n, t.update((e) => ({ ...e }));
	}
	let Se = (e) => `${la}.workspace.v1:${e.account.id}:${e.session_generation}`;
	function Ce() {
		if (le = void 0, ce) try {
			sessionStorage.removeItem(ce);
		} catch {}
	}
	function we() {
		let e = A();
		if (!ce || !e.snapshot) return;
		if (!e.dirty) {
			Ce();
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
	function Te() {
		j.clear(), he = "", ge = "", _e = [], k.clear(), ++d, u?.abort(), u = void 0, ++n, g = !1, ne = !1, E = !1, S = !1, ++T, C?.abort(), w?.abort(), C = void 0, w = void 0, ++te, ee?.abort(), D?.abort(), ee = void 0, D = void 0;
		for (let e of ga) ++b[e], ++x[e], _[e]?.abort(), v[e]?.abort(), y[e]?.abort(), delete _[e], delete v[e], delete y[e];
		for (let e of va) ++oe[e], ++se[e], re[e]?.abort(), ie[e]?.abort(), ae[e]?.abort(), delete re[e], delete ie[e], delete ae[e];
		r && clearTimeout(r), r = void 0, i?.abort(), a?.abort(), i = void 0, a = void 0, o?.abort(), o = void 0, ++p, s?.abort(), s = void 0, ++m, c?.abort(), c = void 0, ++h, l?.abort(), l = void 0, f?.abort(), f = void 0;
	}
	function N(e, n = !1) {
		M.pause(n), Te(), de ||= n, kt(() => t.set(wa(n ? "blocked" : "paused", e)));
	}
	function Ee() {
		r && clearTimeout(r), !O && !de && A().phase === "ready" && A().notificationSave !== "uncertain" && document.visibilityState === "visible" && (r = setTimeout(() => {
			r = void 0, Ge(), it(), Ne();
		}, 15e3));
	}
	async function De(t, n, r, i = r ? "PUT" : "GET") {
		let a = performance.now(), o = setTimeout(() => n.abort(), 4e3);
		try {
			let o = await fetch(t, {
				method: i,
				credentials: "same-origin",
				cache: "no-store",
				redirect: "error",
				signal: n.signal,
				headers: {
					"X-Reborn-Product": la,
					"X-Reborn-Contract": ua,
					"X-CSRF-Token": e,
					...t === "/api/workspace/guide" ? { "X-Reborn-Guide": "home-tiles-v1" } : {},
					...t === "/api/workspace/tiles" ? { "X-Reborn-Tiles-Contract": "reborn-tiles-v1" } : {},
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
	function Oe(e) {
		return e === 401 || e === 403 ? "Your sign-in changed or ended. Open a fresh workspace after signing in." : e === 426 ? "This workspace needs a fresh document. Open workspace again." : "Your workspace could not be checked. Open workspace again when access is available.";
	}
	function ke(e) {
		let t = A().snapshot;
		return !t || e.account.id === t.account.id && e.session_generation === t.session_generation && e.account.role === t.account.role;
	}
	function Ae(e, t) {
		return Q(e) && e.product === la && e.contract === ua && e.schema === 1 && Q(e.account) && e.account.id === t.account.id && e.account.username === t.account.username && e.account.role === t.account.role && e.session_generation === t.session_generation;
	}
	function je(e) {
		let t = A();
		return t.phase === "ready" && !!t.snapshot && e.account.id === t.snapshot.account.id && e.account.username === t.snapshot.account.username && e.account.role === t.snapshot.account.role && e.session_generation === t.snapshot.session_generation;
	}
	function Me(e, t, n = !1) {
		let r = e.snapshot?.crafty, i = t ? r && (BigInt(t.revision) < BigInt(r.revision) || n && t.revision === r.revision) ? r : t : r ?? t;
		return r?.revision === i?.revision ? {
			crafty: i,
			observations: e.observations,
			changed: !1
		} : (++h, l?.abort(), l = void 0, ++d, u?.abort(), u = void 0, k.delete("games"), {
			crafty: i,
			observations: {
				...ha(),
				message: "Connection enrollment changed. Check newest observations for the current scope."
			},
			changed: !0
		});
	}
	async function Ne(e = !1) {
		if (O || de || i || a || o || f || document.visibilityState !== "visible") return;
		let r = new AbortController();
		i = r;
		let s = n;
		try {
			let e = await De("/api/workspace/snapshot", r);
			if (O || r.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if (e.status !== 200) {
				N(Oe(e.status), !0);
				return;
			}
			let i = Ga(e.value);
			if (!ke(i) || fe && (i.account.id !== fe.account.id || i.account.username !== fe.account.username || i.account.role !== fe.account.role || i.session_generation !== fe.session_generation)) {
				N("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			fe = {
				account: i.account,
				session_generation: i.session_generation
			};
			let a = A();
			if (ce = Se(i), a.phase === "ready") {
				let e = Me(a, i.crafty), n = a.dirty && i.note.revision !== a.base, r = {
					...a,
					snapshot: {
						...i,
						crafty: e.crafty
					},
					observations: e.observations,
					games: e.changed ? fa() : a.games,
					draft: a.dirty ? a.draft : i.note.body,
					base: a.dirty ? a.base : i.note.revision,
					save: n ? "conflict" : ["uncertain", "checking-conflict"].includes(a.save) ? "idle" : a.save,
					message: n ? "A newer saved note is available. Your draft is unchanged." : "Workspace checked.",
					notificationSave: "idle",
					notificationMessage: a.notificationSave === "uncertain" ? "Current read markers checked. Review newer changes before marking read." : "Notifications checked.",
					directorySave: a.directorySave === "uncertain" ? "idle" : a.directorySave,
					directoryMessage: a.directorySave === "uncertain" ? "Current saved directory and pins checked. Review them before making another change." : a.directoryMessage
				};
				e.changed ? kt(() => t.set(r)) : t.set(r), a.dirty && a.draft === i.note.body && (t.update((e) => ({
					...e,
					dirty: !1,
					base: i.note.revision,
					save: "saved",
					message: "The current note is saved."
				})), Ce());
			} else {
				let e = le?.key === ce ? le.draft : void 0, n = !1;
				try {
					e ??= Ka(sessionStorage.getItem(ce));
				} catch {
					n = !0;
				}
				e?.body === i.note.body && (Ce(), e = void 0), t.set({
					...wa("ready", "Workspace checked."),
					snapshot: i,
					draft: i.note.body,
					base: i.note.revision,
					recovery: e,
					storageLimited: n
				});
			}
			if (j.admit({
				account: i.account,
				session_generation: i.session_generation
			}), g && A().snapshot?.account.role === "owner") for (let e of ga) {
				let t = A().media[e].observation;
				t?.error === "checking" && !_[e] && !y[e] && nt(e, t.offset);
			}
			if (ne && A().snapshot?.account.role === "owner") for (let e of va) {
				let t = A().queues[e].observation;
				t?.error !== "checking" || re[e] || ae[e] || ie[e] || ut(e, t.offset);
			}
			Ye(), M.discover(), Ee();
		} catch {
			i === r && s === n && !O && N("Your workspace could not be checked. Open workspace again to retry deliberately.", !0);
		} finally {
			i === r && (i = void 0);
		}
	}
	function Pe(e) {
		let n = A();
		if (n.phase === "ready" && n.snapshot) {
			if (t.set({
				...n,
				draft: e,
				dirty: e !== n.snapshot.note.body,
				save: n.save === "saved" ? "idle" : n.save
			}), Ta(e)) we();
			else if (le = void 0, ce) try {
				sessionStorage.removeItem(ce);
			} catch {}
		}
	}
	function Fe() {
		let e = A();
		e.recovery && e.snapshot && e.phase === "ready" && (t.set({
			...e,
			draft: e.recovery.body,
			base: e.recovery.base,
			dirty: !0,
			recovery: void 0,
			save: e.recovery.base === e.snapshot.note.revision ? "idle" : "conflict",
			message: "Draft recovered. Review it before saving."
		}), we());
	}
	function Ie(e) {
		let n = A();
		n.snapshot && n.phase === "ready" && (t.set({
			...n,
			draft: e ? n.snapshot.note.body : n.draft,
			base: n.snapshot.note.revision,
			dirty: !e && n.draft !== n.snapshot.note.body,
			recovery: void 0,
			save: "idle",
			message: e ? "Loaded the saved note." : "Draft kept against the latest saved revision. Review, then save deliberately."
		}), we());
	}
	async function Le() {
		let e = A();
		if (e.phase !== "ready" || !e.dirty || !Ta(e.draft) || [
			"conflict",
			"checking-conflict",
			"uncertain"
		].includes(e.save) || a || f) return;
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
			let e = await De("/api/workspace/note", o, {
				body: c.body,
				base_revision: c.base
			});
			if (O || o.signal.aborted || s !== n) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				N(Oe(e.status), !0);
				return;
			}
			if (e.status === 409) t.update((e) => ({
				...e,
				save: "checking-conflict",
				message: "Another save won. Checking the latest saved note before comparing. Your draft is unchanged."
			}));
			else if (e.status === 200) {
				let n = Ga(e.value);
				if (!ke(n) || n.note.body !== c.body || BigInt(n.note.revision) !== BigInt(c.base) + 1n) throw Error("Unqualified save result");
				let r = A(), i = Me(r, n.crafty, !0), a = {
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
				i.changed ? kt(() => t.set(a)) : t.set(a), we();
			} else throw Error("Save outcome unavailable");
		} catch {
			a === o && s === n && !O && t.update((e) => ({
				...e,
				save: "uncertain",
				message: "Save outcome is uncertain. Check the saved note before trying again."
			}));
		} finally {
			a === o && (a = void 0), s === n && !O && (A().save === "checking-conflict" ? await Ne() : Ee());
		}
	}
	async function Re(e, r) {
		let a = A();
		if (a.phase !== "ready" || !a.snapshot || o || f || a.directorySave === "uncertain") return !1;
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
			let i = await De(e, s, r);
			if (O || s.signal.aborted || c !== n) return !1;
			if (document.visibilityState !== "visible") return N("Workspace hidden. Checking access on return."), !1;
			if ([
				401,
				403,
				426
			].includes(i.status)) return N(Oe(i.status), !0), !1;
			if (i.status === 200) {
				let e = Ga(i.value);
				return ke(e) ? (t.update((t) => ({
					...t,
					snapshot: t.snapshot ? {
						...t.snapshot,
						directory: e.directory
					} : void 0,
					directorySave: "idle",
					directoryMessage: "Saved to your account."
				})), !0) : (N("Your account scope changed. Open a fresh workspace.", !0), !1);
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
			return o === s && c === n && !O && t.update((e) => ({
				...e,
				directorySave: "uncertain",
				directoryMessage: "The save may have completed. Check saved services before making another change."
			})), !1;
		} finally {
			o === s && (o = void 0), c === n && !O && Ee();
		}
	}
	function ze(e, t) {
		return Re("/api/owner/directory", {
			base_revision: e,
			change: t
		});
	}
	function Be(e) {
		let t = A().snapshot?.directory;
		return t ? Re("/api/workspace/pins", {
			base_directory_revision: t.revision,
			base_revision: t.pins_revision,
			ids: e
		}) : Promise.resolve(!1);
	}
	async function Ve(e, s) {
		let c = A();
		if (O || de || c.phase !== "ready" || !c.snapshot || f || a || o || c.notificationSave !== "idle" || !["services", "connections"].includes(e) || !$(s, !0)) return;
		i?.abort(), i = void 0, r && clearTimeout(r), r = void 0;
		let l = new AbortController();
		f = l;
		let u = n;
		t.update((e) => ({
			...e,
			notificationSave: "saving",
			notificationMessage: "Saving your read marker…"
		}));
		try {
			let r = await De("/api/workspace/notifications/read", l, {
				category: e,
				through: s
			});
			if (O || l.signal.aborted || u !== n) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				N(Oe(r.status), !0);
				return;
			}
			if (r.status === 409) throw Error("Read watermark changed");
			let i = r.value;
			if (r.status !== 200 || !Q(i)) throw Error("Read marker unavailable");
			if (i.product !== la || i.contract !== ua || i.schema !== 1 || !Q(i.account) || i.account.id !== c.snapshot.account.id || i.account.username !== c.snapshot.account.username || i.account.role !== c.snapshot.account.role || i.session_generation !== c.snapshot.session_generation) {
				N("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let a = Na(i.notifications), o = a.groups.find((t) => t.category === e);
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
			f === l && u === n && !O && t.update((e) => ({
				...e,
				notificationSave: "uncertain",
				notificationMessage: "The read marker may have saved. Check notifications to see the current state."
			}));
		} finally {
			f === l && (f = void 0), u === n && !O && Ee();
		}
	}
	async function He(e = A().activity.category, r = A().activity.query, i = !1) {
		let a = A();
		if (O || de || a.phase !== "ready" || !a.snapshot || document.visibilityState !== "visible") return;
		s?.abort();
		let o = new AbortController();
		s = o;
		let c = ++p, l = n, u = a.activity, d = new URLSearchParams({
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
				...pa(),
				phase: "loading",
				category: e,
				query: r,
				message: "Checking your retained activity…"
			}
		}));
		try {
			let s = await De(`/api/workspace/activity?${d}`, o);
			if (O || o.signal.aborted || c !== p || l !== n) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				N(Oe(s.status), !0);
				return;
			}
			let f = s.value;
			if (s.status !== 200 || !Q(f) || f.product !== la || f.contract !== ua || f.schema !== 1 || !Q(f.account) || f.account.id !== a.snapshot.account.id || f.account.role !== a.snapshot.account.role || f.account.username !== a.snapshot.account.username || f.session_generation !== a.snapshot.session_generation) {
				if (s.status === 200) {
					N("Your account scope changed. Open a fresh workspace.", !0);
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
			if (f.category !== e || f.q !== r || !$(f.through) || f.next_before !== null && !$(f.next_before, !0) || i && f.through !== u.through || !Array.isArray(f.entries) || f.entries.length > 25 || f.entries.some((e) => !Q(e) || !$(e.id, !0) || !$(e.revision, !0) || !$(e.occurred_at) || BigInt(e.occurred_at) > 253402300799n || !h.includes(String(e.kind)) || !m.includes(String(e.category)) || typeof e.label != "string" || !/^[A-Za-z ]{1,64}$/.test(e.label) || BigInt(e.id) > BigInt(f.through) || i && BigInt(e.id) >= BigInt(u.next)) || f.entries.some((e, t) => t > 0 && BigInt(e.id) >= BigInt(f.entries[t - 1].id)) || f.next_before !== null && (f.entries.length !== 25 || f.next_before !== f.entries.at(-1)?.id)) throw Error("Invalid activity response");
			t.update((t) => ({
				...t,
				activity: {
					phase: "ready",
					category: e,
					query: r,
					entries: f.entries,
					through: f.through,
					next: f.next_before,
					message: "Retained activity checked."
				}
			}));
		} catch {
			!O && c === p && l === n && t.update((t) => ({
				...t,
				activity: {
					...pa(),
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
	async function Ue(e = !1) {
		let r = A();
		if (O || de || r.phase !== "ready" || !r.snapshot || document.visibilityState !== "visible" || c || !e && r.guide.phase === "ready") return;
		let i = r.snapshot, a = new AbortController();
		c = a;
		let o = ++m, s = n;
		t.update((e) => ({
			...e,
			guide: {
				phase: "loading",
				message: "Checking the workspace guide…"
			}
		}));
		try {
			let e = await De("/api/workspace/guide", a);
			if (O || a.signal.aborted || o !== m || s !== n || !je(i)) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(e.status)) {
				N(Oe(e.status), !0);
				return;
			}
			if (e.status !== 200) throw Error("Guide unavailable");
			if (!Ae(e.value, i)) {
				N("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let r = Fa(e.value);
			t.update((e) => ({
				...e,
				guide: {
					phase: "ready",
					value: r,
					message: "Workspace guide checked."
				}
			}));
		} catch {
			!O && o === m && s === n && je(i) && t.update((e) => ({
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
	async function We(e = !1) {
		let r = A();
		if (O || de || r.phase !== "ready" || !r.snapshot || document.visibilityState !== "visible") return;
		let i = r.observations;
		if (e && (!i.next || i.phase !== "ready" || i.revision !== r.snapshot.crafty?.revision)) return;
		l?.abort();
		let a = r.snapshot, o = new AbortController();
		l = o;
		let s = ++h, c = n, u = new URLSearchParams();
		e && (u.set("revision", i.revision), u.set("through", i.through), u.set("before", i.next)), t.update((e) => ({
			...e,
			observations: {
				...ha(),
				phase: "loading",
				message: "Checking retained provider observations…"
			}
		}));
		try {
			let r = await De(`/api/workspace/observations${e ? `?${u}` : ""}`, o);
			if (O || o.signal.aborted || s !== h || c !== n || !je(a)) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				N(Oe(r.status), !0);
				return;
			}
			if (r.status === 409) {
				t.update((e) => ({
					...e,
					observations: {
						...ha(),
						phase: "error",
						message: "Connection enrollment changed. Check the current connection, then check newest observations."
					}
				}));
				return;
			}
			if (r.status !== 200) throw Error("Observation history unavailable");
			if (!Ae(r.value, a)) {
				N("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let l = Ia(r.value, i, e);
			if (l.revision !== a.crafty?.revision || l.revision !== A().snapshot?.crafty?.revision) {
				t.update((e) => ({
					...e,
					observations: {
						...ha(),
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
			!O && s === h && c === n && je(a) && t.update((e) => ({
				...e,
				observations: {
					...ha(),
					phase: "error",
					message: "Provider history could not be checked. Retry deliberately; current connections remain available."
				}
			}));
		} finally {
			l === o && (l = void 0);
		}
	}
	function Ge() {
		let e = A();
		if (O || de || e.phase !== "ready") return;
		let n = Math.floor(Date.now() / 1e3), r = !1, i = { ...e.media };
		for (let e of ga) {
			let t = i[e].observation;
			if (!t) continue;
			let a = Za(t, n);
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
	function Ke(e, n, r = !1) {
		let i = () => t.update((t) => ({
			...t,
			media: {
				...t.media,
				[e]: n
			}
		}));
		r ? kt(i) : i();
	}
	function qe() {
		let e = A();
		return !O && !de && e.phase === "ready" && e.snapshot?.account.role === "owner" && document.visibilityState === "visible" ? e.snapshot : void 0;
	}
	function Je(e, n) {
		let r = A().phase === "ready" && A().snapshot?.account.role === "owner", i = r && (e === "media" || e === "home" && n.some((e) => e === "jellyfin" || e === "requests")), a = r && (e === "queues" || e === "home" && n.includes("downloads")), o = [...new Set(n)].sort(), s = `${e}:${r}:${o.join(",")}`;
		if (s !== he) {
			he = s;
			for (let t of _e) e === "home" && o.includes(t) || k.delete(t);
			if (e === "home" && o.includes("games") || (++d, u?.abort(), u = void 0, t.update((e) => ({
				...e,
				games: fa()
			}))), ge === "home") for (let [t, n] of [["jellyfin", "jellyfin"], ["requests", "seerr"]]) _e.includes(t) && (e !== "home" || !o.includes(t)) && (Qe(n), ++x[n], v[n]?.abort(), delete v[n]);
			ge = e, _e = o, !i && g ? $e(!1) : i && (g = !0), !a && ne ? st(!1) : a && (ne = !0), Ye();
		}
	}
	function Ye() {
		if (ge !== "home" || O || de || A().phase !== "ready" || document.visibilityState !== "visible") return;
		let e = performance.now();
		for (let t of _e) if (!(e - (k.get(t) ?? -Infinity) < 14e3)) {
			if (t === "games") u || (k.set(t, e), Xe());
			else if (qe() && [
				"jellyfin",
				"requests",
				"downloads"
			].includes(t)) {
				if (t === "jellyfin" || t === "requests") {
					let n = t === "jellyfin" ? "jellyfin" : "seerr";
					if (_[n] || v[n] || y[n] || A().media[n].save !== "idle") continue;
					k.set(t, e), nt(n, 0);
				} else {
					if (va.some((e) => re[e] || ie[e] || ae[e] || A().queues[e].save !== "idle")) continue;
					k.set(t, e), Promise.all(va.map((e) => ut(e, 0)));
				}
			}
		}
	}
	async function Xe() {
		let e = A().snapshot;
		if (!e || O || de || A().phase !== "ready" || u || document.visibilityState !== "visible" || ge !== "home" || !_e.includes("games")) return;
		let r = new AbortController();
		u = r;
		let i = ++d, a = n;
		t.update((e) => ({
			...e,
			games: {
				...e.games,
				phase: "loading",
				message: ""
			}
		}));
		try {
			let o = await De("/api/workspace/games", r);
			if (O || r.signal.aborted || i !== d || a !== n || !je(e)) return;
			if ([
				401,
				403,
				426
			].includes(o.status)) {
				N(Oe(o.status), !0);
				return;
			}
			if (o.status === 409) {
				t.update((e) => ({
					...e,
					games: {
						phase: "error",
						message: "Server details changed. Checking for an update."
					}
				}));
				return;
			}
			if (o.status !== 200) throw Error("Game status unavailable");
			if (!Ae(o.value, e)) {
				N("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			let s = Ya(o.value), c = A().snapshot?.crafty?.revision;
			if (c && BigInt(s.revision) < BigInt(c)) throw Error("Older server scope");
			t.update((e) => ({
				...e,
				games: {
					phase: "ready",
					value: s,
					message: ""
				}
			}));
		} catch {
			!O && i === d && a === n && je(e) && t.update((e) => ({
				...e,
				games: {
					phase: "error",
					message: "Status is taking a little longer. It will be checked again."
				}
			}));
		} finally {
			u === r && (u = void 0);
		}
	}
	async function Ze(e) {
		e === "games" ? (await Ne(!0), await Xe()) : qe() && (e === "jellyfin" || e === "requests" ? await et(e === "jellyfin" ? "jellyfin" : "seerr") : e === "downloads" && await Promise.all(va.map(async (e) => {
			re[e] || ie[e] || ae[e] || await ut(e, 0);
		})));
	}
	function Qe(e) {
		++b[e], _[e]?.abort(), delete _[e];
	}
	function $e(e = !0) {
		g = !1;
		for (let t of ga) {
			Qe(t), ++x[t], v[t]?.abort(), delete v[t];
			let n = A().media[t], r = !!y[t];
			y[t]?.abort(), delete y[t], Ke(t, {
				phase: "idle",
				save: r ? "uncertain" : n.save,
				message: r ? "The save may have completed. Check the connection state before another change." : n.save === "uncertain" || n.save === "conflict" ? n.message : ""
			}, e);
		}
	}
	async function et(e, t = !0) {
		let r = qe();
		if (!r || y[e]) return;
		g = !0, Qe(e), v[e]?.abort();
		let i = new AbortController();
		v[e] = i;
		let a = ++x[e], o = n, s = A().media[e];
		Ke(e, {
			...s,
			phase: "loading",
			observation: void 0,
			message: "Checking the current enrollment…"
		}, !0);
		try {
			let s = await De(`/api/owner/media/${e}`, i);
			if (O || i.signal.aborted || a !== x[e] || o !== n || !je(r)) return;
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				N(Oe(s.status), !0);
				return;
			}
			let c = s.value;
			if (s.status !== 200 || !Q(c) || !$(c.revision) || typeof c.configured != "boolean") throw Error("Media enrollment unavailable");
			let l = A().media[e].status;
			if (l && BigInt(c.revision) < BigInt(l.revision)) throw Error("Older enrollment reply");
			Ke(e, {
				phase: "ready",
				status: {
					revision: c.revision,
					configured: c.configured
				},
				save: "idle",
				message: c.configured ? "Enrollment checked. Only observation requests are sent." : "No connection is enrolled."
			}, !0), t && c.configured && await nt(e);
		} catch {
			if (!O && a === x[e] && o === n && je(r)) {
				let t = A().media[e];
				Ke(e, {
					...t,
					phase: "error",
					observation: void 0,
					message: "The connection state could not be checked. Retry deliberately before entering credentials."
				}, !0);
			}
		} finally {
			v[e] === i && delete v[e];
		}
	}
	async function tt() {
		qe() && (g = !0, await Promise.all(ga.map((e) => et(e))));
	}
	async function nt(e, t = 0) {
		let r = qe();
		if (!r || !Xa(t) || y[e]) return;
		g = !0, Qe(e);
		let i = new AbortController();
		_[e] = i;
		let a = b[e], o = n, s = A().media[e];
		Ke(e, {
			...s,
			phase: "loading",
			observation: void 0,
			message: "Checking sampled media observations…"
		}, !0);
		try {
			let c = await De(`/api/workspace/media/${e}?offset=${t}`, i);
			if (O || i.signal.aborted || a !== b[e] || o !== n || !je(r)) return;
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				N(Oe(c.status), !0);
				return;
			}
			if (c.status === 409) {
				Qe(e), Ke(e, {
					phase: "error",
					save: s.save,
					message: "Enrollment changed. Check the connection state before reading its new scope."
				}, !0);
				return;
			}
			if (c.status !== 200) throw Error("Media unavailable");
			if (!Ae(c.value, r)) {
				N("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			if (c.value.provider !== e) throw Error("Wrong media provider");
			let l = Qa(c.value.observation, e, t), u = A().media[e].status;
			if (u && BigInt(l.revision) < BigInt(u.revision)) throw Error("Older media scope");
			u?.revision !== l.revision && (++x[e], v[e]?.abort(), delete v[e]);
			let d = l.configured ? l.error === "checking" ? "A sample is being collected. Check observations again, or wait for the existing workspace access check." : l.error ? "This provider sample is unavailable or incomplete. Unknown values stay unknown." : l.complete ? "Media observations checked." : "A partial media sample is available; some details are unknown." : "No connection is enrolled.";
			Ke(e, {
				phase: "ready",
				status: {
					revision: l.revision,
					configured: l.configured
				},
				observation: l,
				save: A().media[e].save,
				message: d
			}, !0);
		} catch {
			!O && a === b[e] && o === n && je(r) && Ke(e, {
				...A().media[e],
				phase: "error",
				observation: void 0,
				message: "Media observations could not be checked. Retry deliberately; your workspace note is unchanged."
			}, !0);
		} finally {
			_[e] === i && delete _[e];
		}
	}
	async function rt(e, t, r) {
		let i = qe(), a = A().media[e];
		if (!i || y[e] || a.phase !== "ready" || a.save !== "idle" || a.status?.revision !== t || !$(t)) return;
		g = !0, Qe(e), ++x[e], v[e]?.abort(), delete v[e];
		let o = new AbortController();
		y[e] = o;
		let s = n;
		Ke(e, {
			...a,
			observation: void 0,
			save: "saving",
			message: r ? "Saving the dedicated connection…" : "Removing the connection…"
		}, !0);
		try {
			let c = await De(`/api/owner/media/${e}`, o, {
				base_revision: t,
				connection: r
			});
			if (O || o.signal.aborted || s !== n || !je(i) || y[e] !== o) return;
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				N(Oe(c.status), !0);
				return;
			}
			if (c.status === 409) {
				Ke(e, {
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
				Ke(e, {
					...a,
					observation: void 0,
					save: "idle",
					message: "Connection not accepted. Check the address, library, certificate and broad-access acknowledgement."
				}, !0);
				return;
			}
			let l = c.value;
			if (c.status !== 200 || !Q(l) || !$(l.revision, !0) || BigInt(l.revision) !== BigInt(t) + 1n || l.configured !== (r !== null)) throw Error("Uncertain media save");
			Ke(e, {
				phase: "ready",
				status: {
					revision: l.revision,
					configured: l.configured
				},
				save: "idle",
				message: r ? "Connection saved. Check its observations." : "Connection removed."
			}, !0);
		} catch {
			!O && s === n && je(i) && y[e] === o && Ke(e, {
				phase: "error",
				save: "uncertain",
				message: "The save may have completed. Check the connection state before entering credentials again."
			}, !0);
		} finally {
			y[e] === o && delete y[e];
		}
	}
	function it() {
		let e = A();
		if (O || de || e.phase !== "ready") return;
		let n = Math.floor(Date.now() / 1e3), r = !1, i = { ...e.queues };
		for (let e of va) {
			let t = i[e].observation;
			if (!t) continue;
			let a = ao(t, n);
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
	function at(e, n, r = !1) {
		let i = () => t.update((t) => ({
			...t,
			queues: {
				...t.queues,
				[e]: n
			}
		}));
		r ? kt(i) : i();
	}
	function ot(e) {
		++oe[e], re[e]?.abort(), delete re[e];
	}
	function st(e = !0) {
		ne = !1;
		for (let t of va) {
			ot(t), ++se[t], ie[t]?.abort(), delete ie[t];
			let n = A().queues[t], r = !!ae[t];
			ae[t]?.abort(), delete ae[t], at(t, {
				...ba(),
				save: r ? "uncertain" : n.save,
				message: r ? "The save may have completed. Check the connection state before another change." : n.save === "uncertain" || n.save === "conflict" ? n.message : ""
			}, e);
		}
	}
	async function ct(e) {
		let t = qe();
		if (!t || ae[e]) return;
		ne = !0, ot(e), ie[e]?.abort();
		let r = new AbortController();
		ie[e] = r;
		let i = ++se[e], a = n, o = A().queues[e];
		at(e, {
			...o,
			phase: "loading",
			observation: void 0,
			message: "Checking the current enrollment…"
		}, !0);
		try {
			let s = await De(`/api/owner/queues/${e}`, r);
			if (O || !ne || r.signal.aborted || i !== se[e] || a !== n || !je(t)) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				N(Oe(s.status), !0);
				return;
			}
			let c = s.value;
			if (s.status !== 200 || !Q(c) || !$(c.revision) || typeof c.configured != "boolean" || c.profile !== ya[e]) throw Error("Queue enrollment unavailable");
			let l = A().queues[e].status;
			if (l && (BigInt(c.revision) < BigInt(l.revision) || c.revision === l.revision && c.configured !== l.configured)) throw Error("Older enrollment reply");
			at(e, {
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
			!O && ne && i === se[e] && a === n && je(t) && at(e, {
				...A().queues[e],
				phase: "error",
				observation: void 0,
				message: "The connection state could not be checked. Retry deliberately before entering credentials."
			}, !0);
		} finally {
			ie[e] === r && delete ie[e];
		}
	}
	async function lt() {
		qe() && (ne = !0, await Promise.all(va.map((e) => ct(e))));
	}
	async function ut(e, t = A().queues[e].offset) {
		let r = qe();
		if (!r || !Xa(t) || ae[e]) return;
		ne = !0, ot(e);
		let i = new AbortController();
		re[e] = i;
		let a = oe[e], o = n, s = A().queues[e];
		at(e, {
			...s,
			offset: t,
			phase: "loading",
			observation: void 0,
			message: "Checking queue observations…"
		}, !0);
		try {
			let c = await De(`/api/workspace/queues/${e}?offset=${t}`, i);
			if (O || !ne || i.signal.aborted || a !== oe[e] || o !== n || !je(r)) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				N(Oe(c.status), !0);
				return;
			}
			if (c.status === 409) {
				ot(e), at(e, {
					...ba(),
					phase: "error",
					save: s.save,
					message: "Enrollment changed. Check the connection state before reading its new scope."
				}, !0);
				return;
			}
			if (c.status !== 200) throw Error("Queues unavailable");
			if (!Ae(c.value, r)) {
				N("Your account scope changed. Open a fresh workspace.", !0);
				return;
			}
			if (c.value.provider !== e) throw Error("Wrong queue provider");
			let l = oo(c.value.observation, e, t), u = A().queues[e].status;
			if (u && (BigInt(l.revision) < BigInt(u.revision) || l.revision === u.revision && l.configured !== u.configured)) throw Error("Older queue scope");
			u?.revision !== l.revision && (++se[e], ie[e]?.abort(), delete ie[e]);
			let d = l.configured ? l.error === "checking" ? "A sample is being collected. Displayed rows, if any, retain their earlier collection time." : l.error === "page_moved" ? "The provider moved this page as its queue changed. Reload the first page deliberately." : l.error === "unsupported_profile" ? "This provider does not match the supported API profile. Review the enrolled version and address." : l.error === "denied" ? "The provider denied access. Review deliberate key enrollment." : l.error === "rate_limited" ? "The provider limited requests. Try again deliberately later." : l.error ? "Queue observations are unavailable. Unknown values stay unknown." : l.complete ? "Queue observations checked." : "An incomplete sample is available; unreported values stay unknown." : "No connection is enrolled.";
			at(e, {
				phase: "ready",
				offset: t,
				status: {
					revision: l.revision,
					configured: l.configured,
					profile: l.profile
				},
				observation: l,
				save: A().queues[e].save,
				message: d
			}, !0);
		} catch {
			!O && ne && a === oe[e] && o === n && je(r) && at(e, {
				...A().queues[e],
				phase: "error",
				observation: void 0,
				message: "Queue observations could not be checked. Retry deliberately; your private note is unchanged."
			}, !0);
		} finally {
			re[e] === i && delete re[e];
		}
	}
	async function dt(e, t, r) {
		let i = qe(), a = A().queues[e];
		if (!i || ae[e] || a.phase !== "ready" || a.save !== "idle" || a.status?.revision !== t || !$(t)) return;
		ne = !0, ot(e), ++se[e], ie[e]?.abort(), delete ie[e];
		let o = new AbortController();
		ae[e] = o;
		let s = n;
		at(e, {
			...a,
			observation: void 0,
			save: "saving",
			message: r ? "Saving the deliberately enrolled connection…" : "Removing the connection…"
		}, !0);
		try {
			let c = await De(`/api/owner/queues/${e}`, o, {
				base_revision: t,
				connection: r
			});
			if (O || !ne || o.signal.aborted || s !== n || !je(i) || ae[e] !== o) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(c.status)) {
				N(Oe(c.status), !0);
				return;
			}
			if (c.status === 409) {
				at(e, {
					...ba(),
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
				at(e, {
					...a,
					observation: void 0,
					save: "idle",
					message: "Connection not accepted. Review the root HTTPS address, supported version, certificate and broad-access acknowledgement."
				}, !0);
				return;
			}
			let l = c.value;
			if (c.status !== 200 || !Q(l) || !$(l.revision, !0) || BigInt(l.revision) !== BigInt(t) + 1n || l.configured !== (r !== null) || l.profile !== ya[e]) throw Error("Uncertain queue save");
			at(e, {
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
			!O && ne && s === n && je(i) && ae[e] === o && at(e, {
				...A().queues[e],
				phase: "error",
				observation: void 0,
				save: "uncertain",
				message: "The save may have completed. Check the connection state before entering credentials again."
			}, !0);
		} finally {
			ae[e] === o && delete ae[e];
		}
	}
	function ft() {
		let e = A();
		return !O && !de && e.phase === "ready" && e.snapshot && document.visibilityState === "visible" ? e.snapshot : void 0;
	}
	function P(e) {
		kt(() => t.update((t) => ({
			...t,
			identity: e
		})));
	}
	function pt() {
		E = !1, ++te, ee?.abort(), ee = void 0;
		let e = !!D;
		D?.abort(), D = void 0, P({
			...Sa(),
			save: e ? "uncertain" : A().identity.save,
			message: e ? "The change may have completed. Check identity status before another action." : ""
		});
	}
	function mt(e, t, n = A().identity.value) {
		if (!Ae(e, t)) throw N("Your account scope changed. Open a fresh workspace.", !0), Error("Identity scope changed");
		let r = Va(e);
		if (n && (BigInt(r.application.revision) < BigInt(n.application.revision) || BigInt(r.link.revision) < BigInt(n.link.revision) || BigInt(r.link.flow_generation) < BigInt(n.link.flow_generation))) throw Error("Older identity response");
		return r;
	}
	async function ht() {
		let e = ft();
		if (!e || D) return;
		E = !0, ee?.abort();
		let t = new AbortController();
		ee = t;
		let r = ++te, i = n, a = A().identity.value;
		P({
			...A().identity,
			phase: "loading",
			value: void 0,
			message: "Checking your current Discord link…"
		});
		try {
			let o = await De("/api/workspace/discord", t);
			if (O || !E || t.signal.aborted || r !== te || i !== n || !je(e)) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(o.status)) {
				N(Oe(o.status), !0);
				return;
			}
			if (o.status !== 200) throw Error("Identity unavailable");
			let s = mt(o.value, e, a);
			P({
				phase: "ready",
				value: s,
				save: "idle",
				message: Ha(s)
			});
		} catch {
			!O && E && r === te && i === n && je(e) && P({
				phase: "error",
				save: A().identity.save,
				message: "Identity status could not be checked. Check again before making a change."
			});
		} finally {
			ee === t && (ee = void 0);
		}
	}
	async function gt() {
		ft() && (E = !0, await ht());
	}
	async function _t(e) {
		let t = ft(), r = A().identity, i = r.value;
		if (!t || !E || D || r.phase !== "ready" || r.save !== "idle" || !i || e === "review" && i.attempt.phase !== "ready_to_review" || e === "confirm" && i.attempt.phase !== "review_ready") return;
		let a = {
			base_revision: i.link.revision,
			base_flow_generation: i.link.flow_generation,
			...["review", "confirm"].includes(e) ? { base_application_revision: i.application.revision } : {}
		};
		ee?.abort(), ee = void 0, ++te;
		let o = new AbortController();
		D = o;
		let s = n;
		P({
			...r,
			value: void 0,
			save: "saving",
			message: e === "review" ? "Reviewing the identity returned by Discord…" : e === "confirm" ? "Saving your confirmed identity…" : e === "unlink" ? "Unlinking this identity locally…" : "Cancelling this unfinished link…"
		});
		try {
			let r = await De(`/api/workspace/discord/${e}`, o, a, "POST");
			if (O || !E || o.signal.aborted || s !== n || !je(t) || D !== o) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				N(Oe(r.status), !0);
				return;
			}
			if (r.status === 409) {
				P({
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
				P({
					phase: "error",
					save: "idle",
					message: "The action was not accepted. Check identity status before starting again."
				});
				return;
			}
			if (r.status !== 200) throw Error("Uncertain identity change");
			let c = mt(r.value, t, i);
			P({
				phase: "ready",
				value: c,
				save: "idle",
				message: e === "unlink" ? "The Discord identity is unlinked locally. Your local sign-in is unchanged." : e === "cancel" ? "The unfinished link is cancelled." : Ha(c)
			});
		} catch {
			!O && E && s === n && je(t) && D === o && P({
				phase: "error",
				save: "uncertain",
				message: "The action may have completed. Check identity status before making another choice. It has not been sent again."
			});
		} finally {
			D === o && (D = void 0);
		}
	}
	async function vt(e, t) {
		let r = qe(), i = A().identity;
		if (!r || !E || D || i.phase !== "ready" || i.save !== "idle" || i.value?.application.revision !== e || !$(e)) return;
		ee?.abort(), ee = void 0, ++te;
		let a = new AbortController();
		D = a;
		let o = n;
		P({
			phase: "loading",
			save: "saving",
			message: t ? "Saving dedicated Discord application access…" : "Removing Discord application access…"
		});
		try {
			let s = await De("/api/owner/discord/application", a, {
				base_revision: e,
				application: t
			});
			if (O || !E || a.signal.aborted || o !== n || !je(r) || D !== a) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(s.status)) {
				N(Oe(s.status), !0);
				return;
			}
			if (s.status === 409) {
				P({
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
				P({
					phase: "error",
					save: "idle",
					message: "Application access was not accepted. Check status, then review the application ID, secret and callback logging acknowledgement."
				});
				return;
			}
			if (s.status !== 200) throw Error("Uncertain application save");
			let c = mt(s.value, r, i.value);
			if (BigInt(c.application.revision) !== BigInt(e) + 1n || c.application.configured !== (t !== null)) throw Error("Uncertain application revision");
			P({
				phase: "ready",
				value: c,
				save: "idle",
				message: t ? "Discord application saved. Existing identity links are unchanged." : "Discord application removed. Existing links remain available for local unlinking."
			});
		} catch {
			!O && E && o === n && je(r) && D === a && P({
				phase: "error",
				save: "uncertain",
				message: "The application save may have completed. Check status before entering credentials again."
			});
		} finally {
			t && (t.client_secret = ""), D === a && (D = void 0);
		}
	}
	function F(e) {
		kt(() => t.update((t) => ({
			...t,
			sessions: e
		})));
	}
	function yt() {
		S = !1, ++T, C?.abort(), C = void 0;
		let e = !!w;
		w?.abort(), w = void 0, F({
			...Ca(),
			save: e ? "uncertain" : A().sessions.save,
			message: e ? "The sign-out may have completed. Check your active sessions before another action." : ""
		});
	}
	function bt(e, t, n) {
		if (!Ae(e, t)) throw N("Your account scope changed. Open a fresh workspace.", !0), Error("Session scope changed");
		let r = Wa(e);
		if (n && (BigInt(r.checked_at) < BigInt(n.checked_at) || r.sessions.find((e) => e.current).id !== n.sessions.find((e) => e.current).id)) throw Error("Older or different acting session list");
		return r;
	}
	async function xt() {
		let e = ft();
		if (!e || w) return;
		S = !0, C?.abort();
		let t = new AbortController();
		C = t;
		let r = ++T, i = n, a = A().sessions.value;
		F({
			...A().sessions,
			phase: "loading",
			value: void 0,
			message: "Checking your active sign-in sessions…"
		});
		try {
			let o = await De("/api/workspace/sessions", t);
			if (O || !S || t.signal.aborted || r !== T || i !== n || !je(e)) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(o.status)) {
				N(Oe(o.status), !0);
				return;
			}
			if (o.status !== 200) throw Error("Session list unavailable");
			F({
				phase: "ready",
				value: bt(o.value, e, a),
				save: "idle",
				message: "Your active sign-in sessions were checked. Later sign-ins, expiry or sign-outs can change this list."
			});
		} catch {
			!O && S && r === T && i === n && je(e) && F({
				phase: "error",
				save: A().sessions.save,
				message: "Your active sessions could not be checked. This does not mean no sessions exist. Check again before choosing a session to sign out."
			});
		} finally {
			C === t && (C = void 0);
		}
	}
	async function St() {
		ft() && (S = !0, await xt());
	}
	async function Ct(e) {
		let t = ft(), r = A().sessions, i = r.value;
		if (!t || !S || w || r.phase !== "ready" || r.save !== "idle" || !i || !Ua(e) || !i.sessions.some((t) => t.id === e && !t.current)) return;
		C?.abort(), C = void 0, ++T;
		let a = new AbortController();
		w = a;
		let o = n;
		F({
			phase: "loading",
			save: "saving",
			message: "Signing out the selected other session…"
		});
		try {
			let r = await De("/api/workspace/sessions/revoke", a, { session_id: e }, "POST");
			if (O || !S || a.signal.aborted || o !== n || !je(t) || w !== a) return;
			if (document.visibilityState !== "visible") {
				N("Workspace hidden. Checking access on return.");
				return;
			}
			if ([
				401,
				403,
				426
			].includes(r.status)) {
				N(Oe(r.status), !0);
				return;
			}
			if (r.status === 409) {
				F({
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
				F({
					phase: "error",
					save: "idle",
					message: "The sign-out was not accepted. Check your active sessions before another action."
				});
				return;
			}
			if (r.status !== 200 || !Q(r.value) || r.value.result !== "signed_out") throw Error("Uncertain targeted sign-out");
			let s = bt(r.value, t, i);
			if (s.sessions.some((t) => t.id === e)) throw Error("Target remains in sign-out receipt");
			F({
				phase: "ready",
				value: s,
				save: "idle",
				message: "The selected session is signed out. This session and unrelated sign-ins remain available."
			});
		} catch {
			!O && S && o === n && je(t) && w === a && F({
				phase: "error",
				save: "uncertain",
				message: "The sign-out may have completed. Check your active sessions before another action. It has not been sent again."
			});
		} finally {
			w === a && (w = void 0);
		}
	}
	function wt() {
		Ce(), N("Signing out…", !0);
		try {
			ue?.postMessage({ kind: "auth-changed" });
		} catch {}
	}
	function Tt() {
		let e = () => N("Workspace hidden. Checking access on return."), n = () => {
			M.resume(), Ne();
		}, r = () => {
			document.visibilityState === "visible" ? n() : e();
		};
		try {
			ue = new BroadcastChannel("keida-hub-reborn.account.v1"), ue.onmessage = (e) => {
				Q(e.data) && e.data.kind === "auth-changed" && N("Your sign-in may have changed. Open a fresh workspace.", !0);
			};
		} catch {}
		return window.addEventListener("blur", e), window.addEventListener("pagehide", e), window.addEventListener("focus", n), window.addEventListener("pageshow", n), document.addEventListener("visibilitychange", r), Ne(), () => {
			O = !0, M.dispose(), Te(), ue?.close(), t.set(wa("blocked", "Workspace closed.")), window.removeEventListener("blur", e), window.removeEventListener("pagehide", e), window.removeEventListener("focus", n), window.removeEventListener("pageshow", n), document.removeEventListener("visibilitychange", r);
		};
	}
	return {
		model: t,
		tiles: j,
		updates: M,
		refreshStatus: be,
		connectionMutation: xe,
		start: Tt,
		edit: Pe,
		recover: Fe,
		resolve: Ie,
		save: Le,
		signOut: wt,
		check: () => Ne(!0),
		editService: ze,
		pins: Be,
		activity: He,
		markNotification: Ve,
		loadGuide: Ue,
		observations: We,
		setObservationView: Je,
		checkHome: Ze,
		openMedia: tt,
		closeMedia: $e,
		checkMedia: et,
		loadMedia: nt,
		saveMedia: rt,
		openQueues: lt,
		closeQueues: st,
		checkQueues: ct,
		loadQueues: ut,
		saveQueues: dt,
		openIdentity: gt,
		closeIdentity: pt,
		checkIdentity: ht,
		identityAction: _t,
		saveDiscordApplication: vt,
		openSessions: St,
		closeSessions: yt,
		checkSessions: xt,
		revokeSession: Ct
	};
}
// src/HomeTiles.svelte
var co = /* @__PURE__ */ K("<p>No game connection enrolled yet.</p><p class=\"field-help\">Choose which servers to display in Connections.</p>", 1), lo = /* @__PURE__ */ K("<p class=\"game-hint\">Join to wake.</p>"), uo = /* @__PURE__ */ K("<p class=\"game-hint\">Getting ready for you.</p>"), fo = /* @__PURE__ */ K("<p class=\"game-hint\">A new modpack is being prepared.</p>"), po = /* @__PURE__ */ K("<p class=\"game-hint\">Join details aren't set up yet.</p>"), mo = /* @__PURE__ */ K("<p class=\"game-hint\">Checking for an update.</p>"), ho = /* @__PURE__ */ K("<p class=\"tile-meta\"> </p>"), go = /* @__PURE__ */ K("<p class=\"game-join\"><span class=\"field-help\">Join</span> <code> </code></p>"), _o = /* @__PURE__ */ K("<span class=\"tile-collected\"> </span>"), vo = /* @__PURE__ */ K("<li><div class=\"game-tile-name\"><strong> </strong><span> </span></div> <!> <!> <!> <!></li>"), yo = /* @__PURE__ */ K("<ul class=\"game-tile-list\"></ul>"), bo = /* @__PURE__ */ K("<!> <div class=\"tile-actions\"><button class=\"text-button tile-observe\" data-observe-tile=\"games\">Refresh</button><button class=\"text-button\">Server details →</button></div>", 1), xo = /* @__PURE__ */ K("<p class=\"playback-counts\"> </p>"), So = /* @__PURE__ */ K("<p class=\"tile-feedback\"> </p>"), Co = /* @__PURE__ */ K("<small> </small>"), wo = /* @__PURE__ */ K("<li><span> </span><!></li>"), To = /* @__PURE__ */ K("<ul class=\"tile-item-list\"></ul>"), Eo = /* @__PURE__ */ K("<p> </p>"), Do = /* @__PURE__ */ K("<p class=\"tile-stat\"><strong> </strong><span> </span></p> <p class=\"tile-meta\"> </p> <!> <!> <!> <p class=\"tile-collected\"> </p>", 1), Oo = /* @__PURE__ */ K("<!> <!> <div class=\"tile-actions\"><button class=\"text-button tile-observe\">Refresh</button><button class=\"text-button\"> </button></div>", 1), ko = /* @__PURE__ */ K("<li><span> </span><small> </small></li>"), Ao = /* @__PURE__ */ K("<p class=\"field-help\"> </p>"), jo = /* @__PURE__ */ K("<p><strong> </strong></p> <p class=\"tile-meta\"> </p> <!> <!> <p class=\"tile-collected\"> </p>", 1), Mo = /* @__PURE__ */ K("<div class=\"download-tile-provider\"><h3> </h3> <!> <!></div>"), No = /* @__PURE__ */ K("<div class=\"download-tile-providers\"></div> <div class=\"tile-actions\"><button class=\"text-button tile-observe\" data-observe-tile=\"downloads\">Refresh</button><button class=\"text-button\">All queues & transfers →</button></div>", 1), Po = /* @__PURE__ */ K("<li><a target=\"_blank\" rel=\"noopener noreferrer\"><span><strong> </strong><!></span><span aria-hidden=\"true\">↗</span></a></li>"), Fo = /* @__PURE__ */ K("<ul class=\"service-tile-links\"></ul>"), Io = /* @__PURE__ */ K("<p>Pin the services you use from Services.</p>"), Lo = /* @__PURE__ */ K("<!> <div class=\"tile-actions\"><button class=\"text-button\">Manage services →</button></div>", 1), Ro = /* @__PURE__ */ K("<p> </p> <div class=\"tile-actions\"><button class=\"text-button\"> </button></div>", 1), zo = /* @__PURE__ */ K("<section><div class=\"tile-heading\"><h2> </h2><span class=\"tile-symbol\" aria-hidden=\"true\"> </span></div> <!></section>"), Bo = /* @__PURE__ */ K("<div class=\"dashboard-grid\"></div>");
function Vo(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = Z(t, "tiles", 8), a = Z(t, "catalog", 8), o = Z(t, "crafty", 8), s = Z(t, "games", 8), c = Z(t, "directory", 8), l = Z(t, "media", 8), u = Z(t, "queues", 8), d = Z(t, "dirty", 8, !1), f = Z(t, "noteSaved", 8, !1), p = Z(t, "authorized", 8, !1), m = Z(t, "owner", 8, !1), h = Z(t, "navigate", 8), g = Z(t, "observe", 8), _ = Z(t, "grid", 12, void 0), v = (e) => a().find((t) => t.id === e)?.label ?? e, y = (e) => e == null ? "Not collected" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(), b = (e) => e == null ? "Not reported" : new Intl.NumberFormat().format(e), x = (e) => e === "fresh" ? "Recent sample" : e === "stale" ? "Stale sample" : "Sample age unknown", S = (e) => e === "sonarr" ? "Sonarr" : e === "radarr" ? "Radarr" : "qBittorrent", C = (e) => e === "requests" ? "Seerr" : "Jellyfin", w = [
		"sonarr",
		"radarr",
		"qbittorrent"
	], T = (e) => e.gateway?.freshness === "fresh" && Date.now() / 1e3 - e.gateway.checked_at <= 45 && Date.now() / 1e3 - e.gateway.checked_at >= -5 ? e.gateway : void 0, E = (e) => T(e)?.state === "sleeping" ? "Sleeping" : T(e)?.state === "starting" ? "Waking up" : T(e)?.state === "updating" ? "Updating" : T(e)?.state === "online" ? "Online" : e.state === "running" && e.freshness === "fresh" ? "Running" : e.state === "stopped" && e.freshness === "fresh" ? "Offline" : e.join ? "Status pending" : "Not listed", ee = (e) => T(e)?.state === "online" ? T(e).players : !T(e) && e.state === "running" && e.freshness === "fresh" ? e.players : null, D = (e) => T(e)?.state === "online" ? T(e).capacity : !T(e) && e.state === "running" && e.freshness === "fresh" ? e.capacity : null;
	wn(() => (W(o()), W(s())), () => {
		L(n, (o()?.servers ?? []).map((e, t) => {
			let n = s().value?.revision === o()?.revision && s().value?.configured === o()?.configured ? s().value?.servers[t] : void 0;
			return n?.name === e.name ? {
				...e,
				join: e.join || n.join,
				gateway: n.gateway
			} : e;
		}));
	}), wn(() => W(c()), () => {
		L(r, c() ? c().pins.map((e) => c().services.find((t) => t.id === e)).filter((e) => e !== void 0) : []);
	}), Tn(), wi();
	var te = Bo();
	qr(te, 5, i, (e) => e.id, (e, t) => {
		var i = Nr(), a = sn(i), s = (e) => {
			var i = zo();
			let a;
			var s = R(i), c = R(s), m = z(c, !0), _ = z(B(c), !0);
			M(s);
			var te = B(s, 2), ne = (e) => {
				var t = bo(), r = sn(t), i = (e) => {
					var t = co();
					be(), q(e, t);
				}, a = (e) => {
					var t = yo();
					qr(t, 5, () => H(n), Ur, (e, t) => {
						let n = /* @__PURE__ */ P(() => (H(t), U(() => E(H(t))))), r = /* @__PURE__ */ P(() => (H(t), U(() => ee(H(t))))), i = /* @__PURE__ */ P(() => (H(t), U(() => D(H(t)))));
						var a = vo(), o = R(a), s = R(o), c = z(s, !0), l = B(s);
						let u;
						var d = z(l, !0);
						M(o);
						var f = B(o, 2), p = (e) => {
							q(e, lo());
						}, m = (e) => {
							q(e, uo());
						}, h = (e) => {
							q(e, fo());
						}, g = (e) => {
							q(e, po());
						}, _ = (e) => {
							q(e, mo());
						};
						Y(f, (e) => {
							H(n) === "Sleeping" ? e(p) : H(n) === "Waking up" ? e(m, 1) : H(n) === "Updating" ? e(h, 2) : H(n) === "Not listed" ? e(g, 3) : H(n) === "Status pending" && e(_, 4);
						});
						var v = B(f, 2), b = (e) => {
							var t = ho(), n = z(t);
							V(() => J(n, `${H(r) ?? ""} players${H(i) === null ? "" : ` / ${H(i)}`}`)), q(e, t);
						};
						Y(v, (e) => {
							H(r) !== null && e(b);
						});
						var x = B(v, 2), S = (e) => {
							var n = go(), r = z(B(R(n), 2), !0);
							M(n), V(() => J(r, (H(t), U(() => H(t).join)))), q(e, n);
						};
						Y(x, (e) => {
							H(t), U(() => H(t).join) && e(S);
						});
						var C = B(x, 2), w = (e) => {
							var n = _o(), r = z(n);
							V((e) => J(r, `Updated ${e ?? ""}`), [() => (H(t), U(() => y(T(H(t))?.checked_at ?? H(t).collected_at)))]), q(e, n);
						}, te = /* @__PURE__ */ ft(() => (H(t), U(() => T(H(t))?.checked_at || H(t).collected_at)));
						Y(C, (e) => {
							H(te) && e(w);
						}), M(a), V(() => {
							X(a, "data-game-status", H(n)), J(c, (H(t), U(() => H(t).name))), u = ti(l, 1, "state-chip", null, u, {
								"is-running": H(n) === "Online" || H(n) === "Running",
								"is-sleeping": H(n) === "Sleeping"
							}), J(d, H(n));
						}), q(e, a);
					}), M(t), q(e, t);
				};
				Y(r, (e) => {
					W(o()), U(() => !o()?.configured) ? e(i) : e(a, -1);
				});
				var s = B(r, 2), c = R(s), l = B(c);
				M(s), V(() => c.disabled = !p()), G("click", c, () => void g()("games")), G("click", l, () => h()("connections")), q(e, t);
			}, re = (e) => {
				let n = /* @__PURE__ */ P(() => (W(l()), H(t), U(() => l()[H(t).id === "jellyfin" ? "jellyfin" : "seerr"]))), r = /* @__PURE__ */ P(() => (W(H(n)), U(() => H(n).observation)));
				var i = Oo(), a = sn(i), o = (e) => {
					var n = Do(), i = sn(n), a = R(i), o = z(a, !0), s = z(B(a), !0);
					M(i);
					var c = B(i, 2), l = z(c), u = B(c, 2), d = (e) => {
						var t = xo(), n = z(t);
						V(() => J(n, `${W(H(r)), U(() => H(r).playback?.playing == null ? "Playback unknown" : `${H(r).playback.playing} playing`) ?? ""}${W(H(r)), U(() => H(r).playback?.paused == null ? "" : ` · ${H(r).playback.paused} paused`) ?? ""}`)), q(e, t);
					};
					Y(u, (e) => {
						H(t), U(() => H(t).id === "jellyfin") && e(d);
					});
					var f = B(u, 2), p = (e) => {
						var t = So(), n = z(t, !0);
						V(() => J(n, (W(H(r)), U(() => H(r).error === "checking" ? "Collecting a sample…" : "This sample is unavailable or incomplete.")))), q(e, t);
					};
					Y(f, (e) => {
						W(H(r)), U(() => H(r).error) && e(p);
					});
					var m = B(f, 2), h = (e) => {
						var n = To();
						qr(n, 5, () => (W(H(r)), U(() => H(r).items.slice(0, 4))), (e) => e.id, (e, n) => {
							var r = wo(), i = R(r), a = z(i, !0), o = B(i), s = (e) => {
								var t = Co(), r = z(t, !0);
								V(() => J(r, (H(n), U(() => H(n).request_status ?? "unknown")))), q(e, t);
							}, c = (e) => {
								var t = Co(), r = z(t, !0);
								V(() => J(r, (H(n), U(() => H(n).year)))), q(e, t);
							};
							Y(o, (e) => {
								H(t), U(() => H(t).id === "requests") ? e(s) : (H(n), U(() => H(n).year) && e(c, 1));
							}), M(r), V(() => J(a, (H(n), U(() => H(n).title ?? "Title unavailable")))), q(e, r);
						}), M(n), q(e, n);
					}, g = (e) => {
						var n = Eo(), r = z(n);
						V(() => J(r, `No ${H(t), U(() => H(t).id === "jellyfin" ? "library items" : "requests") ?? ""} reported.`)), q(e, n);
					};
					Y(m, (e) => {
						W(H(r)), U(() => H(r).items.length) ? e(h) : (W(H(r)), U(() => H(r).complete && H(r).total === 0) && e(g, 1));
					});
					var _ = z(B(m, 2));
					V((e, n, i) => {
						J(o, e), J(s, (H(t), U(() => H(t).id === "jellyfin" ? "library items reported" : "requests reported"))), J(l, `${n ?? ""} · ${W(H(r)), U(() => H(r).complete ? "Complete bounded sample" : "Partial sample") ?? ""}`), J(_, `Updated ${i ?? ""} · Showing up to 4 items`);
					}, [
						() => (W(H(r)), U(() => b(H(r).total))),
						() => (W(H(r)), U(() => x(H(r).freshness))),
						() => (W(H(r)), U(() => y(H(r).checked_at)))
					]), q(e, n);
				}, s = (e) => {
					var r = Eo(), i = z(r, !0);
					V((e) => J(i, e), [() => (W(H(n)), H(t), U(() => H(n).phase === "loading" ? "Loading…" : H(n).status?.configured === !1 ? `${C(H(t).id)} is not connected.` : `${H(t).id === "jellyfin" ? "Loading your library" : "Loading requests"}…`))]), q(e, r);
				};
				Y(a, (e) => {
					W(H(r)), U(() => H(r)?.configured) ? e(o) : e(s, -1);
				});
				var c = B(a, 2), u = (e) => {
					var t = So(), r = z(t, !0);
					V(() => J(r, (W(H(n)), U(() => H(n).message)))), q(e, t);
				};
				Y(c, (e) => {
					W(H(n)), U(() => H(n).phase === "error") && e(u);
				});
				var d = B(c, 2), f = R(d), m = B(f), _ = z(m);
				M(d), V(() => {
					X(f, "data-observe-tile", (H(t), U(() => H(t).id))), f.disabled = (W(p()), W(H(n)), U(() => !p() || H(n).phase === "loading" || H(n).save === "saving")), J(_, `${H(t), U(() => H(t).id === "jellyfin" ? "Library & playback" : "All requests") ?? ""} →`);
				}), G("click", f, () => void g()(H(t).id)), G("click", m, () => h()("media")), q(e, i);
			}, ie = (e) => {
				var t = No(), n = sn(t);
				qr(n, 5, () => w, (e) => e, (e, t) => {
					let n = /* @__PURE__ */ P(() => (W(u()), H(t), U(() => u()[H(t)]))), r = /* @__PURE__ */ P(() => (W(H(n)), U(() => H(n).observation)));
					var i = Mo(), a = R(i), o = z(a, !0), s = B(a, 2), c = (e) => {
						var t = jo(), n = sn(t), i = z(R(n), !0);
						M(n);
						var a = B(n, 2), o = z(a), s = B(a, 2), c = (e) => {
							var t = So(), n = z(t, !0);
							V(() => J(n, (W(H(r)), U(() => H(r).error === "checking" ? "Collecting a sample…" : "Observations unavailable or incomplete.")))), q(e, t);
						};
						Y(s, (e) => {
							W(H(r)), U(() => H(r).error) && e(c);
						});
						var l = B(s, 2), u = (e) => {
							var t = To();
							qr(t, 5, () => (W(H(r)), U(() => H(r).items.slice(0, 3))), (e) => e.id, (e, t) => {
								var n = ko(), r = R(n), i = z(r, !0), a = z(B(r), !0);
								M(n), V((e) => {
									J(i, (H(t), U(() => H(t).title ?? "Title unavailable"))), J(a, e);
								}, [() => (H(t), U(() => H(t).progress_basis_points === null ? H(t).status : `${(H(t).progress_basis_points / 100).toFixed(1)}%`))]), q(e, n);
							}), M(t), q(e, t);
						}, d = (e) => {
							var t = Ao(), n = z(t, !0);
							V(() => J(n, (W(H(r)), U(() => H(r).total === 0 ? "Queue empty." : "No rows on this sample page.")))), q(e, t);
						};
						Y(l, (e) => {
							W(H(r)), U(() => H(r).items.length) ? e(u) : (W(H(r)), U(() => H(r).complete) && e(d, 1));
						});
						var f = z(B(l, 2));
						V((e, t, n) => {
							J(i, e), J(o, `${t ?? ""} · ${W(H(r)), U(() => H(r).complete ? "Complete bounded sample" : "Partial sample") ?? ""}`), J(f, `Updated ${n ?? ""}`);
						}, [
							() => (W(H(r)), U(() => H(r).total === null ? `${H(r).items.length} transfers on this sample page` : `${b(H(r).total)} queued`)),
							() => (W(H(r)), U(() => x(H(r).freshness))),
							() => (W(H(r)), U(() => y(H(r).checked_at)))
						]), q(e, t);
					}, l = (e) => {
						var t = Ao(), r = z(t, !0);
						V(() => J(r, (W(H(n)), U(() => H(n).phase === "loading" ? "Checking…" : H(n).status?.configured === !1 ? "Not connected" : "Loading…")))), q(e, t);
					};
					Y(s, (e) => {
						W(H(r)), U(() => H(r)?.configured) ? e(c) : e(l, -1);
					});
					var d = B(s, 2), f = (e) => {
						var t = So(), r = z(t, !0);
						V(() => J(r, (W(H(n)), U(() => H(n).message)))), q(e, t);
					};
					Y(d, (e) => {
						W(H(n)), U(() => H(n).phase === "error") && e(f);
					}), M(i), V((e) => {
						X(i, "data-tile-queue", H(t)), J(o, e);
					}, [() => (H(t), U(() => S(H(t))))]), q(e, i);
				}), M(n);
				var r = B(n, 2), i = R(r), a = B(i);
				M(r), V((e) => i.disabled = e, [() => (W(p()), W(u()), U(() => !p() || w.some((e) => u()[e].phase === "loading" || u()[e].save === "saving")))]), G("click", i, () => void g()("downloads")), G("click", a, () => h()("queues")), q(e, t);
			}, ae = (e) => {
				var t = Lo(), n = sn(t), i = (e) => {
					var t = Fo();
					qr(t, 5, () => H(r), (e) => e.id, (e, t) => {
						var n = Po(), r = R(n), i = R(r), a = R(i), o = z(a, !0), s = B(a), c = (e) => {
							var n = Co(), r = z(n, !0);
							V(() => J(r, (H(t), U(() => H(t).description)))), q(e, n);
						};
						Y(s, (e) => {
							H(t), U(() => H(t).description) && e(c);
						}), M(i), be(), M(r), M(n), V(() => {
							X(r, "href", (H(t), U(() => H(t).url))), J(o, (H(t), U(() => H(t).name)));
						}), q(e, n);
					}), M(t), q(e, t);
				}, a = (e) => {
					q(e, Io());
				};
				Y(n, (e) => {
					H(r), U(() => H(r).length) ? e(i) : e(a, -1);
				}), G("click", z(B(n, 2)), () => h()("directory")), q(e, t);
			}, oe = (e) => {
				var t = Ro(), n = sn(t), r = z(n, !0), i = B(n, 2), a = R(i), o = z(a);
				M(i), V(() => {
					J(r, d() ? "Your unfinished note is waiting." : f() ? "Your saved note is ready." : "A private place for a thought or reminder."), J(o, `${d() ? "Continue your draft" : "Open your note"} →`);
				}), G("click", a, () => h()("note")), q(e, t);
			};
			Y(te, (e) => {
				H(t), U(() => H(t).id === "games") ? e(ne) : (H(t), U(() => H(t).id === "jellyfin" || H(t).id === "requests") ? e(re, 1) : (H(t), U(() => H(t).id === "downloads") ? e(ie, 2) : (H(t), U(() => H(t).id === "services") ? e(ae, 3) : e(oe, -1))));
			}), M(i), V((e, n) => {
				a = ti(i, 1, "dashboard-tile card", null, a, { "tile-wide": H(t).size === "wide" }), X(i, "data-home-tile", (H(t), U(() => H(t).id))), X(i, "data-tile-size", (H(t), U(() => H(t).size))), X(i, "aria-label", e), J(m, n), J(_, (H(t), U(() => H(t).id === "games" ? "◇" : H(t).id === "jellyfin" ? "▻" : H(t).id === "requests" ? "☷" : H(t).id === "downloads" ? "⇣" : H(t).id === "services" ? "▦" : "▤")));
			}, [() => (H(t), U(() => `${v(H(t).id)} tile`)), () => (H(t), U(() => v(H(t).id)))]), q(e, i);
		}, c = /* @__PURE__ */ ft(() => (W(m()), H(t), U(() => m() || ![
			"jellyfin",
			"requests",
			"downloads"
		].includes(H(t).id))));
		Y(a, (e) => {
			H(c) && e(s);
		}), q(e, i);
	}), M(te), Ci(te, (e) => _(e), () => _()), q(e, te), Ue();
}
wr(["click"]);
// src/TileEditor.svelte
var Ho = /* @__PURE__ */ K("<li tabindex=\"-1\"><strong> </strong> <div class=\"tile-editor-controls\"><label class=\"tile-width\"><span>Width</span><select><option>Normal</option><option>Wide</option></select></label> <button class=\"button secondary\">↑</button> <button class=\"button secondary\">↓</button> <button class=\"text-button\">Remove</button></div></li>"), Uo = /* @__PURE__ */ K("<button class=\"button secondary\"> </button>"), Wo = /* @__PURE__ */ K("<div class=\"tile-add\"><h3>Add a tile</h3><div class=\"button-row\"></div></div>"), Go = /* @__PURE__ */ K("<p> </p><div class=\"button-row\"><button class=\"button secondary\">Keep my tile arrangement</button><button class=\"text-button\">Use saved tiles</button></div>", 1), Ko = /* @__PURE__ */ K("<p>The latest saved layout still needs checking. Your arrangement above is unchanged.</p><button class=\"button secondary check-tiles\">Check saved tiles</button>", 1), qo = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Tile layout conflict\"><h3>A newer tile layout is saved</h3> <!></section>"), Jo = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain tile save\"><h3>Check before saving again</h3><p>The save may have completed. Your arrangement has not been sent again.</p><button class=\"button secondary check-tiles\">Check saved tiles</button></section>"), Yo = /* @__PURE__ */ K("<section class=\"tiles-editor card\" aria-label=\"Customize Home tiles\"><div class=\"tile-heading\"><div><p class=\"eyebrow\">MAKE HOME YOURS</p><h2>Your tiles</h2></div><span class=\"quiet-label\">Changes save to your account</span></div> <p>Add the things you use, choose their order and give larger tiles more room. Keep at least one tile.</p> <ol class=\"tile-editor-list\"></ol> <!> <div class=\"button-row tile-save-actions\"><button class=\"button primary save-tiles\"> </button><button class=\"button secondary cancel-tiles\">Cancel</button><button class=\"text-button reset-tiles\">Reset to default tiles</button></div> <!> <!></section>");
function Xo(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = Z(t, "state", 8), a = Z(t, "control", 8), o = Z(t, "finish", 8), s = Z(t, "authorized", 8, !1), c = (e) => i().value?.catalog.find((t) => t.id === e)?.label ?? e;
	wn(() => (W(s()), W(i())), () => {
		L(n, !s() || i().save !== "idle");
	}), wn(() => W(i()), () => {
		L(r, !!i().draft && !!i().value && JSON.stringify(i().draft.tiles) === JSON.stringify(i().value.layout.tiles));
	}), Tn(), wi();
	var l = Nr(), u = sn(l), d = (e) => {
		var t = Yo(), l = B(R(t), 4);
		qr(l, 7, () => (W(i()), U(() => i().draft.tiles)), (e) => e.id, (e, t, r) => {
			var o = Ho(), s = R(o), l = z(s, !0), u = B(s, 2), d = R(u), f = B(R(d)), p = R(f);
			p.value = p.__value = "normal";
			var m = B(p);
			m.value = m.__value = "wide", M(f);
			var h;
			ai(f), M(d);
			var g = B(d, 2), _ = B(g, 2), v = B(_, 2);
			M(u), M(o), V((e, a, s, c, u, d) => {
				X(o, "data-tile-row", (H(t), U(() => H(t).id))), X(o, "aria-label", e), J(l, a), X(f, "aria-label", s), f.disabled = H(n), h !== (h = (H(t), U(() => H(t).size))) && (f.value = (f.__value = h) ?? "", ii(f, h)), X(g, "aria-label", c), g.disabled = H(n) || H(r) === 0, X(_, "aria-label", u), _.disabled = (H(n), W(H(r)), W(i()), U(() => H(n) || H(r) === i().draft.tiles.length - 1)), X(v, "aria-label", d), v.disabled = (H(n), W(i()), U(() => H(n) || i().draft.tiles.length === 1));
			}, [
				() => (H(t), W(H(r)), W(i()), U(() => `${c(H(t).id)} tile, position ${H(r) + 1} of ${i().draft.tiles.length}`)),
				() => (H(t), U(() => c(H(t).id))),
				() => (H(t), U(() => `${c(H(t).id)} tile width`)),
				() => (H(t), U(() => `Move ${c(H(t).id)} up`)),
				() => (H(t), U(() => `Move ${c(H(t).id)} down`)),
				() => (H(t), U(() => `Remove ${c(H(t).id)}`))
			]), G("change", f, (e) => a().resize(H(t).id, e.currentTarget.value)), G("click", g, () => a().move(H(t).id, -1)), G("click", _, () => a().move(H(t).id, 1)), G("click", v, () => a().remove(H(t).id)), q(e, o);
		}), M(l);
		var u = B(l, 2), d = (e) => {
			var t = Wo(), r = B(R(t));
			qr(r, 5, () => (W(i()), U(() => i().value.catalog.filter((e) => !i().draft.tiles.some((t) => t.id === e.id)))), (e) => e.id, (e, t) => {
				var r = Uo(), i = z(r);
				V(() => {
					X(r, "aria-label", (H(t), U(() => `Add ${H(t).label}`))), r.disabled = H(n), J(i, `+ ${H(t), U(() => H(t).label) ?? ""}`);
				}), G("click", r, () => a().add(H(t).id)), q(e, r);
			}), M(r), M(t), q(e, t);
		}, f = /* @__PURE__ */ ft(() => (W(i()), U(() => i().value.catalog.some((e) => !i().draft.tiles.some((t) => t.id === e.id)))));
		Y(u, (e) => {
			H(f) && e(d);
		});
		var p = B(u, 2), m = R(p), h = z(m, !0), g = B(m), _ = B(g);
		M(p);
		var v = B(p, 2), y = (e) => {
			var t = qo(), n = B(R(t), 2), r = (e) => {
				var t = Go(), n = sn(t), r = z(n), s = B(n), l = R(s), u = B(l);
				M(s), V((e) => J(r, `Saved order: ${e ?? ""}. Your arrangement above is unchanged.`), [() => (W(i()), U(() => i().value.layout.tiles.map((e) => c(e.id)).join(", ")))]), G("click", l, () => a().resolve(!1)), G("click", u, () => void o()(() => a().resolve(!0))), q(e, t);
			}, l = (e) => {
				var t = Ko(), n = B(sn(t));
				V(() => n.disabled = (W(s()), W(i()), U(() => !s() || i().phase === "loading"))), G("click", n, () => void o()(a().check)), q(e, t);
			};
			Y(n, (e) => {
				W(i()), U(() => i().phase === "ready") ? e(r) : e(l, -1);
			}), M(t), q(e, t);
		};
		Y(v, (e) => {
			W(i()), U(() => i().save === "conflict") && e(y);
		});
		var b = B(v, 2), x = (e) => {
			var t = Jo(), n = B(R(t), 2);
			M(t), V(() => n.disabled = !s()), G("click", n, () => void o()(a().check)), q(e, t);
		};
		Y(b, (e) => {
			W(i()), U(() => i().save === "uncertain") && e(x);
		}), M(t), V((e) => {
			m.disabled = H(n) || H(r), J(h, (W(i()), U(() => i().save === "saving" ? "Saving…" : "Save tiles"))), g.disabled = e, _.disabled = H(n);
		}, [() => (W(s()), W(i()), U(() => !s() || ["saving", "uncertain"].includes(i().save)))]), G("click", m, () => void o()(a().save)), G("click", g, () => void o()(a().cancel)), G("click", _, function(...e) {
			a().reset?.apply(this, e);
		}), q(e, t);
	};
	Y(u, (e) => {
		W(i()), U(() => i().draft && i().value) && e(d);
	}), q(e, l), Ue();
}
wr(["change", "click"]);
// src/ObservationHistory.svelte
var Zo = /* @__PURE__ */ K("<p class=\"observation-empty\">No retained observations in this window. A connection must be enrolled and observed before samples appear.</p>"), Qo = /* @__PURE__ */ K("<p class=\"notice\"> </p>"), $o = /* @__PURE__ */ K("<p class=\"field-help\"> </p>"), es = /* @__PURE__ */ K("<section><h4> </h4> <dl><dt>Reported process</dt><dd> </dd> <dt>Players</dt><dd> </dd> <dt>Freshness at collection</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd></dl> <!></section>"), ts = /* @__PURE__ */ K("<li><div class=\"guide-card-heading\"><h3> </h3><time> </time></div> <p class=\"observation-completeness\"> </p> <!> <div class=\"observation-servers\"></div></li>"), ns = /* @__PURE__ */ K("<p class=\"quiet-label\"> </p> <!> <ol class=\"observation-list\"></ol>", 1), rs = /* @__PURE__ */ K("<section class=\"card observation-history\" aria-label=\"Provider observation history\"><p class=\"eyebrow\">RETAINED PROVIDER SAMPLES</p><h2 tabindex=\"-1\">Crafty observation history</h2> <p>Samples are collected while an authorized workspace checks the enrolled connection. At most the first sample per enrollment revision each minute is retained, up to the newest 10,000 batches.</p> <p class=\"field-help\">This is sampled, on-demand history. Gaps do not establish downtime, and a process or player report does not establish game readiness. Freshness below describes the sample at collection time.</p> <p> </p> <p class=\"workspace-status observation-status\" role=\"status\"> </p> <!> <div class=\"button-row\"><button class=\"button secondary observation-newest\">Check newest observations</button><button class=\"button secondary observation-older\">Older observations</button><button class=\"text-button\">Check current connection</button></div> <p class=\"field-help\">Up to 25 batches per page. New samples appear when you check newest. Older pages use the same history window; retention can shorten that window as new samples arrive. Reading history does not contact Crafty.</p></section>");
function is(e, t) {
	He(t, !1);
	let n = Z(t, "state", 8), r = Z(t, "authorized", 8, !1), i = Z(t, "owner", 8, !1), a = Z(t, "load", 8), o = Z(t, "checkConnection", 8), s = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString(), c = (e) => e === "denied" ? "Provider access denied" : e === "timeout" ? "Provider timed out" : e === "transport" ? "Provider could not be reached" : e === "not_discovered" ? "Selected server was not discovered" : e === "malformed" ? "Provider response was incomplete or malformed" : e === "oversized" ? "Provider response exceeded the observation limit" : e === "invalid_configuration" ? "Connection could not be checked" : e ? "Provider observation unavailable" : "";
	wi();
	var l = rs(), u = B(R(l), 7), d = z(u, !0), f = B(u, 2), p = z(f, !0), m = B(f, 2), h = (e) => {
		var t = ns(), r = sn(t), i = z(r), a = B(r, 2), o = (e) => {
			q(e, Zo());
		};
		Y(a, (e) => {
			W(n()), U(() => n().entries.length === 0) && e(o);
		});
		var l = B(a, 2);
		qr(l, 5, () => (W(n()), U(() => n().entries)), (e) => e.id, (e, t) => {
			var n = ts(), r = R(n), i = R(r), a = z(i), o = B(i), l = z(o, !0);
			M(r);
			var u = B(r, 2), d = z(u, !0), f = B(u, 2), p = (e) => {
				var n = Qo(), r = z(n, !0);
				V((e) => J(r, e), [() => (H(t), U(() => c(H(t).error)))]), q(e, n);
			};
			Y(f, (e) => {
				H(t), U(() => H(t).error) && e(p);
			});
			var m = B(f, 2);
			qr(m, 5, () => (H(t), U(() => H(t).servers)), Ur, (e, t) => {
				var n = es(), r = R(n), i = z(r, !0), a = B(r, 2), o = B(R(a)), l = z(o, !0), u = B(o, 3), d = z(u), f = B(u, 3), p = z(f, !0), m = B(f, 3), h = z(m, !0), g = z(B(m, 2), !0);
				M(a);
				var _ = B(a, 2), v = (e) => {
					var n = $o(), r = z(n, !0);
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
var as = /* @__PURE__ */ K("<p class=\"notice\" role=\"status\">This observation could not be added to history. Your workspace is still available; retained history may be incomplete.</p>"), os = /* @__PURE__ */ K("<section class=\"card small-card\"><h2>No Crafty connection enrolled</h2><p>An owner can add dedicated access and choose which servers to show.</p></section>"), ss = /* @__PURE__ */ K("<p class=\"notice\" role=\"status\"> </p>"), cs = /* @__PURE__ */ K("<p class=\"field-help\">This server could not be fully observed.</p>"), ls = /* @__PURE__ */ K("<article class=\"card small-card server-card\"><h2> </h2> <p><strong> </strong> <span class=\"field-help\">Provider-reported process state</span></p> <dl><dt>Players</dt><dd> </dd> <dt>Freshness</dt><dd> </dd> <dt>Collected</dt><dd> </dd><dt>Provider sample</dt><dd> </dd> <dt>Join address</dt><dd> </dd></dl> <!></article>"), us = /* @__PURE__ */ K("<!> <div class=\"server-grid\"></div> <p class=\"field-help\">A running process does not establish game readiness. Join addresses are owner-reviewed; outside-network joining is accepted separately.</p>", 1), ds = /* @__PURE__ */ K("<button class=\"button secondary\">Check connection state</button>"), fs = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove server</button>"), ps = /* @__PURE__ */ K("<fieldset><legend> </legend> <label>Crafty server UUID</label><input name=\"server-id\" required=\"\" maxlength=\"36\"/> <label>Display name</label><input name=\"server-name\" required=\"\" maxlength=\"80\"/> <label>Reviewed public join address, optional</label><input name=\"server-join\" maxlength=\"253\" placeholder=\"play.example:25565\"/> <!></fieldset>"), ms = /* @__PURE__ */ K("<button class=\"text-button\" type=\"button\">Remove connection</button>"), hs = /* @__PURE__ */ K("<section class=\"card connection-setup\" aria-label=\"Dedicated Crafty enrollment\"><h2>Dedicated Crafty access</h2> <p>Create access specifically for Reborn, limited to viewing the selected servers. Credentials are encrypted on the server and are not shown again.</p> <p class=\"workspace-status\" role=\"status\"> </p> <!> <form autocomplete=\"off\"><label for=\"crafty-endpoint\">Crafty HTTPS address</label><input id=\"crafty-endpoint\" name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\" placeholder=\"https://crafty.example/\"/> <label for=\"crafty-token\">Dedicated API token</label><input id=\"crafty-token\" name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label for=\"crafty-timezone\">Crafty’s configured time zone</label><input id=\"crafty-timezone\" name=\"timezone\" required=\"\" maxlength=\"64\" placeholder=\"America/Chicago or UTC\"/> <label for=\"crafty-ca\">Private CA certificate, if needed</label><textarea id=\"crafty-ca\" name=\"ca-pem\" maxlength=\"8192\" rows=\"3\"></textarea> <p class=\"field-help\">Leave the certificate blank for publicly trusted HTTPS. The address and certificate must pass normal hostname and trust checks.</p> <!> <div class=\"button-row\"><button class=\"button secondary\" type=\"button\">Add server</button> <button class=\"button primary\" type=\"submit\"> </button></div></form> <!></section>"), gs = /* @__PURE__ */ K("<div><div class=\"button-row\"><button class=\"text-button\">View connection enrollment history</button><button class=\"text-button view-observation-history\">View provider observation history</button></div> <!> <div class=\"connections-intro\"><p>Server observations from your deliberately enrolled Crafty connection.</p><span class=\"quiet-label\">Read-only overview</span></div> <!> <!></div> <div><button class=\"text-button observation-back\">Back to connections</button> <!></div>", 1);
function _s(e, t) {
	He(t, !1);
	let n = Z(t, "binding", 8), r = Z(t, "mutationState", 8), i = Z(t, "history", 8), a = Z(t, "overview", 8), o = Z(t, "owner", 8, !1), s = Z(t, "active", 8, !1), c = Z(t, "refresh", 8), l = Z(t, "observationState", 8), u = Z(t, "loadObservations", 8), d = /* @__PURE__ */ I(), f = /* @__PURE__ */ I([0]), p = /* @__PURE__ */ I(0), m = /* @__PURE__ */ I(), h = /* @__PURE__ */ I(""), g = /* @__PURE__ */ I(!1), _ = 0, v = /* @__PURE__ */ I(!1), y = /* @__PURE__ */ I(), b = /* @__PURE__ */ I(), x = (e) => e === null ? "Not reported" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
	function S() {
		++_, H(m)?.abort(), L(m, void 0), H(d)?.reset(), L(f, [Kt(p)]), L(h, ""), L(g, !1);
	}
	Ii(S);
	async function C() {
		s() && (L(v, !0), u()(), await pr(), H(b)?.querySelector("h2")?.focus());
	}
	async function w() {
		L(v, !1), await pr(), H(y)?.focus();
	}
	async function T(e = !1) {
		if (!s() || !o() || H(m) || !a() || H(g)) return;
		let t = a().revision, r = H(d) ? new FormData(H(d)) : void 0, i = (e) => r?.getAll(e).map(String) ?? [], l = i("server-id"), u = i("server-name"), v = i("server-join"), y = e ? null : {
			endpoint: String(r?.get("endpoint") ?? ""),
			token: String(r?.get("token") ?? ""),
			ca_pem: String(r?.get("ca-pem") ?? ""),
			timezone: String(r?.get("timezone") ?? ""),
			servers: l.map((e, t) => ({
				id: e,
				name: u[t] ?? "",
				join: v[t] ?? ""
			}))
		};
		H(d)?.reset(), L(f, [Kt(p)]);
		let b = new AbortController();
		L(m, b);
		let x = ++_, S = setTimeout(() => b.abort(), 4e3);
		L(h, e ? "Removing the connection…" : "Saving the dedicated connection…");
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
			if (x !== _ || !s()) return;
			if (r.status === 200) L(h, e ? "Connection removed." : "Connection saved. Checking provider observations…");
			else if (r.status === 409) L(h, "The connection changed elsewhere. Check its current state before enrolling again.");
			else if ([
				400,
				401,
				403,
				413,
				426
			].includes(r.status)) L(h, "Connection not accepted. Check your account and the dedicated connection details.");
			else throw Error("Uncertain connection outcome");
			await c()();
		} catch {
			x === _ && s() && (L(g, !0), L(h, "The save outcome is uncertain. Check the connection before entering credentials again."));
		} finally {
			clearTimeout(S), H(m) === b && L(m, void 0);
		}
	}
	async function E() {
		await c()(), s() && (L(g, !1), L(h, "Review the current connection state before making another change."));
	}
	wn(() => (W(r()), H(m), H(g)), () => {
		r()(!!H(m), H(g));
	}), wn(() => W(s()), () => {
		s() || (S(), L(v, !1));
	}), Tn(), wi();
	var ee = gs(), D = sn(ee), te = R(D), ne = R(te), re = B(ne);
	Ci(re, (e) => L(y, e), () => H(y)), M(te);
	var ie = B(te, 2), ae = (e) => {
		q(e, as());
	};
	Y(ie, (e) => {
		W(a()), U(() => a()?.history_error === "unavailable") && e(ae);
	});
	var oe = B(ie, 4), se = (e) => {
		q(e, os());
	}, ce = (e) => {
		var t = us(), n = sn(t), r = (e) => {
			var t = ss(), n = z(t, !0);
			V(() => J(n, (W(a()), U(() => a().error === "checking" ? "Checking the provider. Fresh results will appear on the next observation." : "Provider observations are unavailable or incomplete. Unknown player counts stay unknown.")))), q(e, t);
		};
		Y(n, (e) => {
			W(a()), U(() => a().error) && e(r);
		});
		var i = B(n, 2);
		qr(i, 5, () => (W(a()), U(() => a().servers)), Ur, (e, t) => {
			var n = ls(), r = R(n), i = z(r, !0), a = B(r, 2), o = z(R(a), !0);
			be(2), M(a);
			var s = B(a, 2), c = B(R(s)), l = z(c), u = B(c, 3), d = z(u, !0), f = B(u, 3), p = z(f, !0), m = B(f, 2), h = z(m, !0), g = z(B(m, 3), !0);
			M(s);
			var _ = B(s, 2), v = (e) => {
				q(e, cs());
			};
			Y(_, (e) => {
				H(t), U(() => H(t).error) && e(v);
			}), M(n), V((e, n) => {
				J(i, (H(t), U(() => H(t).name))), J(o, (H(t), U(() => H(t).state === "running" ? "Running" : H(t).state === "stopped" ? "Stopped" : "Unknown"))), J(l, `${H(t), U(() => H(t).players === null ? "Not reported" : `${H(t).players} reported`) ?? ""}${H(t), U(() => H(t).capacity === null ? "" : ` / ${H(t).capacity} capacity`) ?? ""}`), J(d, (H(t), U(() => H(t).freshness === "fresh" ? "Recent provider sample" : H(t).freshness === "stale" ? "Stale provider sample" : "Provider sample age unknown"))), J(p, e), J(h, n), J(g, (H(t), U(() => H(t).join || "Not configured")));
			}, [() => (H(t), U(() => x(H(t).collected_at))), () => (H(t), U(() => x(H(t).provider_at)))]), q(e, n);
		}), M(i), be(2), q(e, t);
	};
	Y(oe, (e) => {
		W(a()), U(() => !a() || !a().configured) ? e(se) : e(ce, -1);
	});
	var le = B(oe, 2), ue = (e) => {
		var t = hs(), n = B(R(t), 4), r = z(n, !0), i = B(n, 2), o = (e) => {
			var t = ds();
			G("click", t, () => void E()), q(e, t);
		};
		Y(i, (e) => {
			H(g) && e(o);
		});
		var s = B(i, 2), c = B(R(s)), l = B(c, 3), u = B(l, 3), _ = B(u, 3), v = B(_, 4);
		qr(v, 3, () => H(f), (e) => e, (e, t, n) => {
			var r = ps(), i = R(r), a = z(i), o = B(i, 2), s = B(o), c = B(s, 2), l = B(c), u = B(l, 2), d = B(u), p = B(d, 2), h = (e) => {
				var n = fs();
				V(() => n.disabled = !!H(m) || H(g)), G("click", n, () => L(f, H(f).filter((e) => e !== H(t)))), q(e, n);
			};
			Y(p, (e) => {
				H(f), U(() => H(f).length > 1) && e(h);
			}), M(r), V(() => {
				J(a, `Server ${H(n) + 1}`), X(o, "for", `crafty-id-${H(t)}`), X(s, "id", `crafty-id-${H(t)}`), s.disabled = !!H(m) || H(g), X(c, "for", `crafty-name-${H(t)}`), X(l, "id", `crafty-name-${H(t)}`), l.disabled = !!H(m) || H(g), X(u, "for", `crafty-join-${H(t)}`), X(d, "id", `crafty-join-${H(t)}`), d.disabled = !!H(m) || H(g);
			}), q(e, r);
		});
		var y = B(v, 2), b = R(y), x = B(b, 2), S = z(x, !0);
		M(y), M(s), Ci(s, (e) => L(d, e), () => H(d));
		var C = B(s, 2), w = (e) => {
			var t = ms();
			V(() => t.disabled = !!H(m) || H(g)), G("click", t, () => void T(!0)), q(e, t);
		};
		Y(C, (e) => {
			W(a()), U(() => a()?.configured) && e(w);
		}), M(t), V(() => {
			J(r, H(h)), c.disabled = !!H(m) || H(g), l.disabled = !!H(m) || H(g), u.disabled = !!H(m) || H(g), _.disabled = !!H(m) || H(g), b.disabled = (H(f), H(m), H(g), U(() => H(f).length >= 8 || !!H(m) || H(g))), x.disabled = !!H(m) || H(g) || !a(), J(S, H(m) ? "Working…" : "Save dedicated connection");
		}), Cr("submit", s, (e) => {
			e.preventDefault(), T();
		}), G("click", b, () => L(f, [...H(f), Kt(p)])), q(e, t);
	};
	Y(le, (e) => {
		o() && s() && e(ue);
	}), M(D);
	var O = B(D, 2), de = R(O);
	is(B(de, 2), {
		get state() {
			return l();
		},
		get authorized() {
			return s();
		},
		get owner() {
			return o();
		},
		get load() {
			return u();
		},
		get checkConnection() {
			return c();
		}
	}), M(O), Ci(O, (e) => L(b, e), () => H(b)), V(() => {
		X(D, "hidden", H(v)), re.disabled = !s(), X(O, "hidden", !H(v));
	}), G("click", ne, function(...e) {
		i()?.apply(this, e);
	}), G("click", re, () => void C()), G("click", de, () => void w()), q(e, ee), Ue();
}
wr(["click"]);
// src/Directory.svelte
var vs = /* @__PURE__ */ K("<button class=\"text-button\">Browse services <span aria-hidden=\"true\">→</span></button>"), ys = /* @__PURE__ */ K("<section class=\"notice\"><h3>Review the saved state</h3><p> </p><button class=\"button secondary\">Check saved services</button></section>"), bs = /* @__PURE__ */ K("<option> </option>"), xs = /* @__PURE__ */ K("<div class=\"directory-filters\"><div><label for=\"service-search\">Search services</label><input id=\"service-search\" type=\"search\" maxlength=\"120\" placeholder=\"Name, category or description\"/></div><div><label for=\"service-filter\">Category</label><select id=\"service-filter\"><option>All categories</option><!></select></div></div>"), Ss = /* @__PURE__ */ K("<section class=\"card small-card\"><h3> </h3><p> </p></section>"), Cs = /* @__PURE__ */ K("<p> </p>"), ws = /* @__PURE__ */ K("<button class=\"text-button move-up\">↑</button><button class=\"text-button move-down\">↓</button>", 1), Ts = /* @__PURE__ */ K("<p>The directory changed. Review the service and choose Remove again.</p>"), Es = /* @__PURE__ */ K("<div class=\"notice\"><p> </p><!><div class=\"button-row\"><button class=\"button secondary confirm-remove\">Remove service</button><button class=\"text-button\">Keep service</button></div></div>"), Ds = /* @__PURE__ */ K("<div class=\"button-row\"><button class=\"text-button edit-service\"> </button><button class=\"text-button remove-service\">Remove</button></div> <!>", 1), Os = /* @__PURE__ */ K("<article class=\"card small-card service-card\"><p class=\"eyebrow\"> </p><h3><a class=\"service-link\" target=\"_blank\" rel=\"noopener noreferrer\"> <span class=\"sr-only\">(opens in a new tab)</span> <span aria-hidden=\"true\">↗</span></a></h3> <!> <p class=\"field-help service-address\"> </p> <div class=\"button-row\"><button class=\"button secondary pin-service\"> </button> <!></div> <!></article>"), ks = /* @__PURE__ */ K("<div class=\"directory-grid\"></div>"), As = /* @__PURE__ */ K("<p class=\"field-help\">Up to 24 personal pins. Links open the selected service in a new tab. Each service handles its own sign-in; directory links do not check availability.</p>"), js = /* @__PURE__ */ K("<div class=\"notice\"><p>The directory changed after this form was opened. Review the current entries, then choose whether to keep this edit.</p><button class=\"button secondary\" type=\"button\">Keep edit against current directory</button></div>"), Ms = /* @__PURE__ */ K("<section class=\"card directory-editor\" aria-label=\"Service editor\"><h2> </h2><p>Add a reviewed HTTPS link without passwords, tokens, query parameters or fragments. These links are visible to signed-in accounts.</p> <form><label for=\"service-name\">Service name</label><input id=\"service-name\" name=\"service-name\" required=\"\" maxlength=\"80\"/> <label for=\"service-category\">Category</label><input id=\"service-category\" name=\"service-category\" required=\"\" maxlength=\"40\"/> <label for=\"service-url\">HTTPS link</label><input id=\"service-url\" name=\"service-url\" type=\"url\" required=\"\" maxlength=\"1024\" placeholder=\"https://service.example/\"/> <label for=\"service-description\">Description, optional</label><textarea id=\"service-description\" name=\"service-description\" maxlength=\"240\" rows=\"2\"></textarea> <!> <div class=\"button-row\"><button class=\"button primary\" type=\"submit\"> </button><button class=\"text-button\" type=\"button\"> </button></div></form></section>"), Ns = /* @__PURE__ */ K("<div class=\"directory-heading\"><div><p class=\"eyebrow\"> </p><h2> </h2></div><!></div> <p class=\"directory-status\" role=\"status\"> </p> <!> <!> <!> <!> <!>", 1);
function Ps(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = Z(t, "directory", 8), o = Z(t, "authorized", 8, !1), s = Z(t, "owner", 8, !1), c = Z(t, "compact", 8, !1), l = Z(t, "state", 8), u = Z(t, "message", 8), d = Z(t, "browse", 8), f = Z(t, "check", 8), p = Z(t, "edit", 8), m = Z(t, "pin", 8), h = /* @__PURE__ */ I(""), g = /* @__PURE__ */ I(""), _ = /* @__PURE__ */ I(""), v = /* @__PURE__ */ I(""), y = /* @__PURE__ */ I(""), b = /* @__PURE__ */ I(""), x = /* @__PURE__ */ I(""), S = /* @__PURE__ */ I(), C = /* @__PURE__ */ I(), w = 0;
	function T() {
		++w, L(h, ""), L(g, ""), L(_, ""), L(v, ""), L(y, ""), L(b, ""), L(x, ""), L(C, void 0), L(S, void 0);
	}
	Ii(T);
	function E() {
		L(_, ""), L(v, ""), L(y, ""), L(b, ""), L(x, ""), L(C, void 0), L(S, a()?.revision);
	}
	function ee(e) {
		L(x, e.id), L(_, e.name), L(v, e.description), L(y, e.url), L(b, e.category), L(S, a()?.revision), L(C, void 0), document.querySelector("#service-name")?.focus();
	}
	async function D() {
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
	function te(e) {
		!H(n) && a() && m()(a().pins.includes(e) ? a().pins.filter((t) => t !== e) : [...a().pins, e]);
	}
	function ne(e, t) {
		if (H(n) || !a()) return;
		let r = [...a().pins], i = r.indexOf(e), o = i + t;
		i < 0 || o < 0 || o >= r.length || ([r[i], r[o]] = [r[o], r[i]], m()(r));
	}
	async function re(e) {
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
	}), Tn(), wi();
	var ie = Ns(), ae = sn(ie), oe = R(ae), se = R(oe), ce = z(se, !0), le = z(B(se), !0);
	M(oe);
	var ue = B(oe), O = (e) => {
		var t = vs();
		G("click", t, function(...e) {
			d()?.apply(this, e);
		}), q(e, t);
	};
	Y(ue, (e) => {
		c() && e(O);
	}), M(ae);
	var de = B(ae, 2), fe = z(de, !0), pe = B(de, 2), me = (e) => {
		var t = ys(), n = B(R(t)), r = z(n, !0), i = B(n);
		M(t), V(() => J(r, l() === "uncertain" ? "Your change has not been sent again." : "Your edit is still in the form. Compare it with the current directory before saving.")), G("click", i, () => void f()()), q(e, t);
	};
	Y(pe, (e) => {
		(l() === "uncertain" || l() === "conflict") && e(me);
	});
	var he = B(pe, 2), ge = (e) => {
		var t = xs(), n = R(t), i = B(R(n));
		pi(i), M(n);
		var a = B(n), o = B(R(a)), s = R(o);
		s.value = s.__value = "", qr(B(s), 1, () => H(r), Ur, (e, t) => {
			var n = bs(), r = z(n, !0), i = {};
			V(() => {
				J(r, H(t)), i !== (i = H(t)) && (n.value = (n.__value = i) ?? "");
			}), q(e, n);
		}), M(o), ai(o), M(a), M(t), vi(i, () => H(h), (e) => L(h, e)), oi(o, () => H(g), (e) => L(g, e)), q(e, t);
	};
	Y(he, (e) => {
		c() || e(ge);
	});
	var _e = B(he, 2), k = (e) => {
		var t = Ss(), n = R(t), r = z(n, !0), i = z(B(n), !0);
		M(t), V(() => {
			J(r, (W(c()), W(a()), U(() => c() ? "Keep your favorites close" : a()?.services.length ? "No matching services" : "Your directory starts here"))), J(i, (W(c()), W(a()), W(s()), U(() => c() ? "Pin services from the directory to show them on Home." : a()?.services.length ? "Try another search or category." : s() ? "Add a service below to make it available to signed-in accounts." : "An owner can add reviewed service links.")));
		}), q(e, t);
	}, A = (e) => {
		var t = ks();
		qr(t, 5, () => H(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ P(() => (W(a()), H(t), U(() => a()?.pins.includes(H(t).id) ?? !1))), i = /* @__PURE__ */ P(() => (W(a()), H(t), U(() => a()?.pins.indexOf(H(t).id) ?? -1)));
			var o = Os(), l = R(o), u = z(l, !0), d = B(l), f = R(d), p = R(f, !0);
			be(3), M(f), M(d);
			var m = B(d, 2), h = (e) => {
				var n = Cs(), r = z(n, !0);
				V(() => J(r, (H(t), U(() => H(t).description)))), q(e, n);
			};
			Y(m, (e) => {
				H(t), U(() => H(t).description) && e(h);
			});
			var g = B(m, 2), _ = z(g, !0), v = B(g, 2), y = R(v), b = z(y, !0), x = B(y, 2), S = (e) => {
				var r = ws(), o = sn(r), s = B(o);
				V(() => {
					X(o, "aria-label", (H(t), U(() => `Move ${H(t).name} up`))), o.disabled = H(n) || H(i) === 0, X(s, "aria-label", (H(t), U(() => `Move ${H(t).name} down`))), s.disabled = (H(n), W(H(i)), W(a()), U(() => H(n) || H(i) === (a()?.pins.length ?? 0) - 1));
				}), G("click", o, () => ne(H(t).id, -1)), G("click", s, () => ne(H(t).id, 1)), q(e, r);
			};
			Y(x, (e) => {
				H(r) && e(S);
			}), M(v);
			var w = B(v, 2), T = (e) => {
				var r = Ds(), i = sn(r), o = R(i), s = z(o), c = B(o);
				M(i);
				var l = B(i, 2), u = (e) => {
					var r = Es(), i = R(r), o = z(i), s = B(i), c = (e) => {
						q(e, Ts());
					};
					Y(s, (e) => {
						H(C), W(a()), U(() => H(C).base !== a()?.revision) && e(c);
					});
					var l = B(s), u = R(l), d = B(u);
					M(l), M(r), V(() => {
						J(o, `Remove ${H(C), U(() => H(C).name) ?? ""} from the directory and everyone’s pins?`), u.disabled = (H(n), H(C), W(a()), U(() => H(n) || H(C).base !== a()?.revision));
					}), G("click", u, () => void re(H(t).id)), G("click", d, () => L(C, void 0)), q(e, r);
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
			}), G("click", y, () => te(H(t).id)), q(e, o);
		}), M(t), q(e, t);
	};
	Y(_e, (e) => {
		H(i), U(() => H(i).length === 0) ? e(k) : e(A, -1);
	});
	var j = B(_e, 2), ve = (e) => {
		q(e, As());
	};
	Y(j, (e) => {
		c() || e(ve);
	});
	var ye = B(j, 2), xe = (e) => {
		var t = Ms(), r = R(t), i = z(r, !0), o = B(r, 3), s = B(R(o));
		pi(s);
		var u = B(s, 3);
		pi(u);
		var d = B(u, 3);
		pi(d);
		var f = B(d, 3);
		et(f);
		var p = B(f, 2), m = (e) => {
			var t = js(), r = B(R(t));
			M(t), V(() => r.disabled = H(n)), G("click", r, () => L(S, a()?.revision)), q(e, t);
		};
		Y(p, (e) => {
			H(S), W(a()), U(() => H(S) !== void 0 && a() && H(S) !== a().revision) && e(m);
		});
		var h = B(p, 2), g = R(h), C = z(g, !0), w = B(g), T = z(w, !0);
		M(h), M(o), M(t), V(() => {
			X(t, "hidden", c()), J(i, H(x) ? "Edit service" : "Add a service"), s.disabled = H(n), u.disabled = H(n), d.disabled = H(n), f.disabled = H(n), g.disabled = (H(n), H(S), W(a()), U(() => H(n) || H(S) !== a()?.revision)), J(C, l() === "saving" ? "Saving…" : H(x) ? "Save service" : "Add service"), w.disabled = H(n), J(T, H(x) ? "Cancel edit" : "Clear form");
		}), Cr("submit", o, (e) => {
			e.preventDefault(), D();
		}), vi(s, () => H(_), (e) => L(_, e)), vi(u, () => H(b), (e) => L(b, e)), vi(d, () => H(y), (e) => L(y, e)), vi(f, () => H(v), (e) => L(v, e)), G("click", w, E), q(e, t);
	};
	Y(ye, (e) => {
		s() && o() && e(xe);
	}), V(() => {
		J(ce, c() ? "YOUR SHORTCUTS" : "A PLACE FOR YOUR SERVICES"), J(le, c() ? "Pinned services" : "Service directory"), J(fe, u());
	}), q(e, ie), Ue();
}
wr(["click"]);
// src/Activity.svelte
var Fs = /* @__PURE__ */ K("<p class=\"activity-empty\">No matching activity in this window. Try another action name or check the newest entries.</p>"), Is = /* @__PURE__ */ K("<li><div><strong> </strong><p> </p></div><time> </time></li>"), Ls = /* @__PURE__ */ K("<!> <ol class=\"activity-list\"></ol> <div class=\"button-row\"><button class=\"button secondary\">Check newest activity</button><button class=\"button secondary\">Older activity</button></div> <p class=\"field-help\">Up to 25 entries per page. New changes appear when you check newest; older pages stay within the current history window. Search matches action names, not note or credential contents.</p>", 1), Rs = /* @__PURE__ */ K("<button class=\"button secondary\">Retry activity</button>"), zs = /* @__PURE__ */ K("<button class=\"button secondary\">Check activity</button>"), Bs = /* @__PURE__ */ K("<section class=\"card activity-card\" aria-label=\"Your retained activity\"><h2>Your activity</h2> <p>Successful changes made by your account, retained from the introduction of Activity. Connection entries describe enrollment changes, not game actions or provider uptime.</p> <form class=\"activity-search\"><div><label for=\"activity-query\">Search action names</label><input id=\"activity-query\" maxlength=\"80\" placeholder=\"For example, saved or Crafty\"/></div> <div><label for=\"activity-category\">Activity category</label><select id=\"activity-category\"><option>All activity</option><option>Workspace notes</option><option>Services and pins</option><option>Connection enrollment</option></select></div> <button type=\"submit\" class=\"button primary\">Search activity</button></form> <p class=\"workspace-status\" role=\"status\"> </p> <!></section>");
function Vs(e, t) {
	He(t, !1);
	let n = Z(t, "state", 8), r = Z(t, "authorized", 8, !1), i = Z(t, "load", 8), a = /* @__PURE__ */ I(""), o = /* @__PURE__ */ I("all"), s = /* @__PURE__ */ I(), c = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	wn(() => W(r()), () => {
		r() || (L(a, ""), L(o, "all"), L(s, void 0));
	}), wn(() => (W(n()), H(s)), () => {
		n() !== H(s) && n().phase === "loading" && (L(s, n()), L(a, n().query), L(o, n().category));
	}), Tn(), wi();
	var l = Bs(), u = B(R(l), 4), d = R(u), f = B(R(d));
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
		var t = Ls(), r = sn(t), a = (e) => {
			q(e, Fs());
		};
		Y(r, (e) => {
			W(n()), U(() => n().entries.length === 0) && e(a);
		});
		var o = B(r, 2);
		qr(o, 5, () => (W(n()), U(() => n().entries)), (e) => e.id, (e, t) => {
			var n = Is(), r = R(n), i = R(r), a = z(i, !0), o = z(B(i));
			M(r);
			var s = B(r), l = z(s, !0);
			M(n), V((e, r) => {
				X(n, "data-activity-id", (H(t), U(() => H(t).id))), J(a, (H(t), U(() => H(t).label))), J(o, `Revision ${H(t), U(() => H(t).revision) ?? ""} · ${H(t), U(() => H(t).category === "connections" ? "Connection enrollment" : H(t).category === "directory" ? "Services and pins" : "Workspace note") ?? ""}`), X(s, "datetime", e), J(l, r);
			}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => c(H(t).occurred_at)))]), q(e, n);
		}), M(o);
		var s = B(o, 2), l = R(s), u = B(l);
		M(s), be(2), V(() => u.disabled = (W(n()), U(() => !n().next))), G("click", l, () => void i()(n().category, n().query)), G("click", u, () => void i()(n().category, n().query, !0)), q(e, t);
	}, w = (e) => {
		var t = Rs();
		G("click", t, () => void i()(n().category, n().query)), q(e, t);
	}, T = (e) => {
		var t = zs();
		V(() => t.disabled = !r()), G("click", t, () => void i()(H(o), H(a))), q(e, t);
	};
	Y(S, (e) => {
		W(n()), U(() => n().phase === "ready") ? e(C) : (W(n()), U(() => n().phase === "error") ? e(w, 1) : (W(n()), U(() => n().phase === "idle") && e(T, 2)));
	}), M(l), V(() => {
		f.disabled = !r(), m.disabled = !r(), y.disabled = !r(), J(x, (W(n()), U(() => n().message)));
	}), Cr("submit", u, (e) => {
		e.preventDefault(), i()(H(o), H(a));
	}), vi(f, () => H(a), (e) => L(a, e)), oi(m, () => H(o), (e) => L(o, e)), q(e, l), Ue();
}
wr(["click"]);
// src/Notifications.svelte
var Hs = /* @__PURE__ */ K("<div class=\"notice\"><h3>Check your read markers</h3><p>The change may have completed. Check notifications before marking another group read.</p></div>"), Us = /* @__PURE__ */ K("<p class=\"notification-empty\"> </p>"), Ws = /* @__PURE__ */ K("<li><div><h3> </h3><p class=\"notification-count\"> </p><p> </p><p class=\"field-help\"><time> </time></p></div> <button class=\"button secondary mark-notification-read\"> </button></li>"), Gs = /* @__PURE__ */ K("<div class=\"notification-card card\"><div class=\"notification-heading\"><div><p class=\"eyebrow\">AT YOUR PACE</p><h2>Your notifications</h2></div><button class=\"button secondary check-notifications\">Check notifications</button></div> <p>Shared service and connection changes from other accounts, grouped together. Opening this inbox leaves them unread.</p> <label class=\"notification-filter\"><input id=\"notification-show-read\" type=\"checkbox\"/> Show read groups</label> <p class=\"notification-status\" role=\"status\"> </p> <!> <!> <ul class=\"notification-list\"></ul></div>");
function Ks(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = Z(t, "value", 8), i = Z(t, "authorized", 8), a = Z(t, "state", 8), o = Z(t, "message", 8), s = Z(t, "check", 8), c = Z(t, "mark", 8), l = /* @__PURE__ */ I(!1), u = (e) => (/* @__PURE__ */ new Date(Number(e) * 1e3)).toLocaleString();
	wn(() => W(i()), () => {
		i() || L(l, !1);
	}), wn(() => (W(i()), W(r()), H(l)), () => {
		L(n, i() ? (r()?.groups ?? []).filter((e) => H(l) || e.unread !== "0") : []);
	}), Tn(), wi();
	var d = Gs(), f = R(d), p = B(R(f));
	M(f);
	var m = B(f, 4), h = R(m);
	pi(h), be(), M(m);
	var g = B(m, 2), _ = z(g, !0), v = B(g, 2), y = (e) => {
		q(e, Hs());
	};
	Y(v, (e) => {
		a() === "uncertain" && e(y);
	});
	var b = B(v, 2), x = (e) => {
		var t = Us(), n = z(t, !0);
		V(() => J(n, H(l) ? "No shared changes to show yet." : "You’re all caught up.")), q(e, t);
	};
	Y(b, (e) => {
		H(n), U(() => H(n).length === 0) && e(x);
	});
	var S = B(b, 2);
	qr(S, 5, () => H(n), (e) => e.category, (e, t) => {
		var n = Ws(), r = R(n), o = R(r), s = z(o, !0), l = B(o), d = z(l, !0), f = B(l), p = z(f, !0), m = B(f), h = R(m), g = z(h, !0);
		M(m), M(r);
		var _ = B(r, 2), v = z(_);
		M(n), V((e, r) => {
			X(n, "data-notification-category", (H(t), U(() => H(t).category))), J(s, (H(t), U(() => H(t).category === "services" ? "Services" : "Connections"))), J(d, (H(t), U(() => H(t).unread === "0" ? "Read" : `${H(t).unread} unread ${H(t).unread === "1" ? "change" : "changes"}`))), J(p, (H(t), U(() => H(t).latest.label))), X(h, "datetime", e), J(g, r), _.disabled = (W(i()), W(a()), H(t), U(() => !i() || a() !== "idle" || H(t).unread === "0")), J(v, `Mark ${H(t), U(() => H(t).category === "services" ? "services" : "connections") ?? ""} read`);
		}, [() => (H(t), U(() => (/* @__PURE__ */ new Date(Number(H(t).latest.occurred_at) * 1e3)).toISOString())), () => (H(t), U(() => u(H(t).latest.occurred_at)))]), G("click", _, () => c()(H(t).category, H(t).revision)), q(e, n);
	}), M(S), M(d), V(() => {
		p.disabled = !i() || a() === "saving", h.disabled = !i(), J(_, o() || "Read markers are saved to your account.");
	}), G("click", p, () => s()()), yi(h, () => H(l), (e) => L(l, e)), q(e, d), Ue();
}
wr(["click"]);
// src/Guide.svelte
var qs = /* @__PURE__ */ K("<li> </li>"), Js = /* @__PURE__ */ K("<button class=\"button secondary\">Open Connections</button>"), Ys = /* @__PURE__ */ K("<button class=\"button secondary\">Open Media</button>"), Xs = /* @__PURE__ */ K("<p class=\"field-help\">Media enrollment and observations require owner access.</p>"), Zs = /* @__PURE__ */ K("<button class=\"button secondary\">Open Queues</button>"), Qs = /* @__PURE__ */ K("<p class=\"field-help\">Queue enrollment and observations require owner access.</p>"), $s = /* @__PURE__ */ K("<button class=\"button secondary\">Open Identity</button><p class=\"field-help\">Identity linking is available with deliberate owner setup. Discord sign-in, friends, roles and bots remain planned.</p>", 1), ec = /* @__PURE__ */ K("<p class=\"field-help\">Setup will be available when this integration is implemented and qualified.</p>"), tc = /* @__PURE__ */ K("<article class=\"card integration-card\"><div class=\"guide-card-heading\"><h2> </h2><span class=\"integration-status\"> </span></div> <p> </p> <h3>What it offers</h3><ul></ul> <h3>Setup requirements</h3><ul></ul> <!></article>"), nc = /* @__PURE__ */ K("<section class=\"card guide-intro\"><p class=\"eyebrow\">OPTIONAL CONNECTIONS</p><h2>Integration catalog</h2><p>Come back here to see what is available and what is planned. Each connection needs deliberate setup and its own access permissions.</p><p class=\"field-help\">Available means the Reborn feature exists. Connections shows Crafty enrollment. Media provides Jellyfin and Seerr observations; Queues provides Sonarr, Radarr and qBittorrent observations. Media and Queues are owner-only. Identity offers deliberate Discord identity linking; wider Discord features remain planned. Credentials and real provider acceptance are separate.</p></section> <div class=\"catalog-list\"></div>", 1), rc = /* @__PURE__ */ K("<h4>Recorded progress</h4><ul></ul>", 1), ic = /* @__PURE__ */ K("<section><div class=\"guide-card-heading\"><h3> </h3><span class=\"quiet-label\"> </span></div> <!> <h4>Work still ahead</h4><ul></ul></section>"), ac = /* @__PURE__ */ K("<article class=\"card roadmap-note\" aria-label=\"Project roadmap note\"><p class=\"eyebrow\">A NOTE FOR THE ROAD AHEAD</p><h2>Keida Reborn roadmap</h2> <p> </p> <p class=\"field-help\">Work-list snapshot dated <time> </time>. This note ships with the site; it does not update itself from GitHub. Your private workspace note is separate.</p> <h3>Next priorities</h3><ol class=\"roadmap-priorities\"></ol> <div class=\"roadmap-milestones\"></div> <p><a rel=\"noreferrer\">Open the current roadmap and acceptance tracker <span aria-hidden=\"true\">↗</span></a></p></article>"), oc = /* @__PURE__ */ K("<section class=\"card guide-intro\"><h2> </h2><p>The guide is available after your account access is checked.</p><button class=\"button secondary\"> </button></section>"), sc = /* @__PURE__ */ K("<div class=\"guide-card\"><p class=\"workspace-status\" role=\"status\"> </p> <!></div>");
function cc(e, t) {
	He(t, !1);
	let n = Z(t, "mode", 8, "catalog"), r = Z(t, "state", 8), i = Z(t, "authorized", 8, !1), a = Z(t, "retry", 8), o = Z(t, "connections", 8), s = Z(t, "media", 8), c = Z(t, "queues", 8), l = Z(t, "identity", 8), u = Z(t, "owner", 8, !1);
	wi();
	var d = sc(), f = R(d), p = z(f, !0), m = B(f, 2), h = (e) => {
		var t = Nr(), i = sn(t), a = (e) => {
			var t = nc(), n = B(sn(t), 2);
			qr(n, 5, () => (W(r()), U(() => r().value.catalog)), (e) => e.id, (e, t) => {
				var n = tc(), r = R(n), i = R(r), a = z(i, !0), d = B(i), f = z(d, !0);
				M(r);
				var p = B(r, 2), m = z(p, !0), h = B(p, 3);
				qr(h, 5, () => (H(t), U(() => H(t).capabilities)), Ur, (e, t) => {
					var n = qs(), r = z(n, !0);
					V(() => J(r, H(t))), q(e, n);
				}), M(h);
				var g = B(h, 3);
				qr(g, 5, () => (H(t), U(() => H(t).requirements)), Ur, (e, t) => {
					var n = qs(), r = z(n, !0);
					V(() => J(r, H(t))), q(e, n);
				}), M(g);
				var _ = B(g, 2), v = (e) => {
					var n = Nr(), r = sn(n), i = (e) => {
						var t = Js();
						G("click", t, function(...e) {
							o()?.apply(this, e);
						}), q(e, t);
					}, a = (e) => {
						var t = Nr(), n = sn(t), r = (e) => {
							var t = Ys();
							G("click", t, function(...e) {
								s()?.apply(this, e);
							}), q(e, t);
						}, i = (e) => {
							q(e, Xs());
						};
						Y(n, (e) => {
							u() ? e(r) : e(i, -1);
						}), q(e, t);
					}, l = (e) => {
						var t = Zs();
						G("click", t, function(...e) {
							c()?.apply(this, e);
						}), q(e, t);
					}, d = (e) => {
						q(e, Qs());
					};
					Y(r, (e) => {
						H(t), U(() => H(t).id === "crafty") ? e(i) : (H(t), U(() => H(t).id === "jellyfin" || H(t).id === "seerr") ? e(a, 1) : u() ? e(l, 2) : e(d, -1));
					}), q(e, n);
				}, y = (e) => {
					var t = $s(), n = sn(t);
					be(), G("click", n, function(...e) {
						l()?.apply(this, e);
					}), q(e, t);
				}, b = (e) => {
					q(e, ec());
				};
				Y(_, (e) => {
					H(t), U(() => H(t).status === "available") ? e(v) : (H(t), U(() => H(t).id === "discord") ? e(y, 1) : e(b, -1));
				}), M(n), V(() => {
					X(n, "data-integration-id", (H(t), U(() => H(t).id))), J(a, (H(t), U(() => H(t).name))), X(d, "data-status", (H(t), U(() => H(t).status))), J(f, (H(t), U(() => H(t).status === "available" ? "Available" : "Planned"))), J(m, (H(t), U(() => H(t).summary)));
				}), q(e, n);
			}), M(n), q(e, t);
		}, d = (e) => {
			var t = ac(), n = B(R(t), 3), i = z(n, !0), a = B(n, 2), o = B(R(a)), s = z(o, !0);
			be(), M(a);
			var c = B(a, 3);
			qr(c, 5, () => (W(r()), U(() => r().value.roadmap.priorities)), Ur, (e, t) => {
				var n = qs(), r = z(n, !0);
				V(() => J(r, H(t))), q(e, n);
			}), M(c);
			var l = B(c, 2);
			qr(l, 5, () => (W(r()), U(() => r().value.roadmap.milestones)), (e) => e.id, (e, t) => {
				var n = ic(), r = R(n), i = R(r), a = z(i), o = z(B(i), !0);
				M(r);
				var s = B(r, 2), c = (e) => {
					var n = rc(), r = B(sn(n));
					qr(r, 5, () => (H(t), U(() => H(t).delivered)), Ur, (e, t) => {
						var n = qs(), r = z(n, !0);
						V(() => J(r, H(t))), q(e, n);
					}), M(r), q(e, n);
				};
				Y(s, (e) => {
					H(t), U(() => H(t).delivered.length) && e(c);
				});
				var l = B(s, 3);
				qr(l, 5, () => (H(t), U(() => H(t).remaining)), Ur, (e, t) => {
					var n = qs(), r = z(n, !0);
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
		var t = oc(), i = R(t), o = z(i, !0), s = B(i, 2), c = z(s, !0);
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
var lc = /* @__PURE__ */ K("<section class=\"card small-card media-owner-only\"><h2>Owner access required</h2><p>An owner can enroll and view media connections. Provider-account sharing has not been configured for members.</p></section>"), uc = /* @__PURE__ */ K("<div class=\"media-playback\" data-media-playback=\"\"><h3>Recent server playback</h3><p> </p><p class=\"field-help\">Across the Jellyfin server, not limited to the selected library: sessions active within 120 seconds with a reported playing item. Counts do not show users, devices or watch titles.</p></div>"), dc = /* @__PURE__ */ K("<small>Some details unavailable</small>"), fc = /* @__PURE__ */ K("<tr data-media-item=\"\"><td> <!></td><td> </td><td> </td></tr>"), pc = /* @__PURE__ */ K("<div class=\"media-table-scroll\"><table class=\"media-table\"><caption> </caption><thead><tr><th scope=\"col\">Title</th><th scope=\"col\">Type</th><th scope=\"col\"> </th></tr></thead><tbody></tbody></table></div>"), mc = /* @__PURE__ */ K("<p class=\"media-empty\"> </p>"), hc = /* @__PURE__ */ K("<p class=\"field-help\">No usable rows were reported for this sample. This does not establish an empty library or request list.</p>"), gc = /* @__PURE__ */ K("<p class=\"notice\">More rows exist beyond this bounded view.</p>"), _c = /* @__PURE__ */ K("<dl class=\"media-sample\"><dt>Collected</dt><dd> </dd><dt>Freshness</dt><dd> </dd><dt>Sample</dt><dd> </dd></dl> <!> <!> <p class=\"field-help\"> </p> <!> <div class=\"button-row media-pagination\"><button class=\"text-button media-previous\"> </button><span class=\"quiet-label\"> </span><button class=\"text-button media-next\"> </button></div>", 1), vc = /* @__PURE__ */ K("<p class=\"field-help\">Choose one Jellyfin library by its ID. This limits the rows requested here; the underlying API key may still access all libraries and sessions.</p>"), yc = /* @__PURE__ */ K("<label for=\"jellyfin-library\">Jellyfin library ID</label><input id=\"jellyfin-library\" name=\"library-id\" required=\"\" maxlength=\"36\"/><p class=\"field-help\">Use the library’s lowercase 32-digit ID or UUID, without an address or API key.</p>", 1), bc = /* @__PURE__ */ K("<button class=\"text-button media-remove\"> </button>"), xc = /* @__PURE__ */ K("<section class=\"card media-provider\"><div class=\"guide-card-heading\"><h2> </h2><span class=\"quiet-label\">Owner-only observations</span></div> <p class=\"workspace-status\" role=\"status\" data-media-status=\"\"> </p> <div class=\"button-row media-actions\"><button class=\"button secondary media-check-state\"> </button><button class=\"button secondary media-check-observations\"> </button></div> <!> <details class=\"media-enrollment\"><summary> </summary><p>Use a key created deliberately for Reborn. It is encrypted on the server and will not be shown again.</p><p class=\"notice\"> </p> <!> <form autocomplete=\"off\"><label> </label><input name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\"/> <label>Dedicated API key</label><input name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <!> <label>Private CA certificate, if needed</label><textarea name=\"ca-pem\" rows=\"3\" maxlength=\"8192\"></textarea><p class=\"field-help\">Leave blank for publicly trusted HTTPS. Normal hostname and trust checks always apply.</p> <label class=\"media-ack\"><input name=\"acknowledge\" type=\"checkbox\" required=\"\"/>I understand this key may grant broad access, and I choose owner-only media observations.</label> <button class=\"button primary media-save\" type=\"submit\"> </button></form></details> <!></section>"), Sc = /* @__PURE__ */ K("<div class=\"media-providers\"></div>"), Cc = /* @__PURE__ */ K("<div class=\"media-view\"><section class=\"card media-intro\"><p class=\"eyebrow\">MEDIA, WITH DELIBERATE ACCESS</p><h2>Media observations</h2><p>Check a selected Jellyfin library, counts of recent playback and Seerr request status. These connections send observation requests only.</p><p class=\"field-help\">Media is owner-only. Hub member accounts are not linked to provider accounts, and this view does not share their playback or request identities.</p></section> <!></div>");
function wc(e, t) {
	He(t, !1);
	let n = Z(t, "owner", 8, !1), r = Z(t, "active", 8, !1), i = Z(t, "state", 8), a = Z(t, "check", 8), o = Z(t, "load", 8), s = Z(t, "save", 8), c = ["jellyfin", "seerr"], l = (e) => e === "jellyfin" ? "Jellyfin" : "Seerr", u = /* @__PURE__ */ I({}), d = (e) => e === null ? "Not collected" : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString(), f = (e) => r() && n() && i()[e].phase === "ready" && i()[e].save === "idle" && !!i()[e].status;
	function p() {
		for (let e of c) H(u)[e]?.reset();
	}
	Ii(p);
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
	}), Tn(), wi();
	var h = Cc(), g = B(R(h), 2), _ = (e) => {
		q(e, lc());
	}, v = (e) => {
		var t = Sc();
		qr(t, 5, () => c, (e) => e, (e, t) => {
			let s = /* @__PURE__ */ P(() => (W(i()), H(t), U(() => i()[H(t)]))), c = /* @__PURE__ */ P(() => (W(H(s)), U(() => H(s).observation))), f = /* @__PURE__ */ P(() => (W(r()), W(H(s)), U(() => !r() || H(s).save === "saving"))), p = /* @__PURE__ */ P(() => (W(r()), W(n()), W(H(s)), U(() => r() && n() && H(s).phase === "ready" && H(s).save === "idle" && !!H(s).status)));
			var h = xc(), g = R(h), _ = z(R(g), !0);
			be(), M(g);
			var v = B(g, 2), y = z(v, !0), b = B(v, 2), x = R(b), S = z(x), C = B(x), w = z(C);
			M(b);
			var T = B(b, 2), E = (e) => {
				var n = _c(), r = sn(n), i = B(R(r)), a = z(i, !0), s = B(i, 2), u = z(s, !0), p = z(B(s, 2), !0);
				M(r);
				var m = B(r, 2), h = (e) => {
					var t = uc(), n = z(B(R(t)), !0);
					be(), M(t), V(() => J(n, (W(H(c)), U(() => H(c).playback && H(c).playback.playing !== null && H(c).playback.paused !== null ? `${H(c).playback.playing} playing · ${H(c).playback.paused} paused` : "Playback counts unavailable")))), q(e, t);
				};
				Y(m, (e) => {
					H(t) === "jellyfin" && e(h);
				});
				var g = B(m, 2), _ = (e) => {
					var n = pc(), r = R(n), i = R(r), a = z(i, !0), o = B(i), s = R(o), l = z(B(R(s), 2), !0);
					M(s), M(o);
					var u = B(o);
					qr(u, 5, () => (W(H(c)), U(() => H(c).items)), (e) => e.id, (e, n) => {
						var r = fc(), i = R(r), a = R(i, !0), o = B(a), s = (e) => {
							q(e, dc());
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
					var n = mc(), r = z(n, !0);
					V(() => J(r, H(t) === "jellyfin" ? "No movie or series rows were reported in this library." : "No requests were reported.")), q(e, n);
				}, y = (e) => {
					q(e, hc());
				};
				Y(g, (e) => {
					W(H(c)), U(() => H(c).items.length) ? e(_) : (W(H(c)), U(() => H(c).complete && H(c).error === null && H(c).total === 0) ? e(v, 1) : (W(H(c)), U(() => H(c).error !== "checking") && e(y, 2)));
				});
				var b = B(g, 2), x = z(b), S = B(b, 2), C = (e) => {
					q(e, gc());
				};
				Y(S, (e) => {
					W(H(c)), U(() => H(c).truncated) && e(C);
				});
				var w = B(S, 2), T = R(w), E = z(T), ee = B(T), D = z(ee), te = B(ee), ne = z(te);
				M(w), V((e, t, n) => {
					J(a, e), J(u, (W(H(c)), U(() => H(c).freshness === "fresh" ? "Recent collection" : H(c).freshness === "stale" ? "Stale collection" : "Collection age unknown"))), J(p, (W(H(c)), U(() => H(c).complete ? "Complete for these bounded queries" : "Incomplete or still checking"))), J(x, `${W(H(c)), U(() => H(c).total === null ? "Provider total unavailable." : `${H(c).total} rows reported by the provider.`) ?? ""} Up to 12 rows per page and the first 60 rows only. Pages can change as the provider changes.`), T.disabled = (W(H(f)), W(H(c)), U(() => H(f) || H(c).offset === 0)), J(E, `Previous ${t ?? ""} page`), J(D, `Page ${W(H(c)), U(() => H(c).offset / 12 + 1) ?? ""}`), te.disabled = (W(H(f)), W(H(c)), U(() => H(f) || H(c).next_offset === null)), J(ne, `Next ${n ?? ""} page`);
				}, [
					() => (W(H(c)), U(() => d(H(c).checked_at))),
					() => (H(t), U(() => l(H(t)))),
					() => (H(t), U(() => l(H(t))))
				]), G("click", T, () => void o()(H(t), H(c).offset - 12)), G("click", te, () => H(c).next_offset !== null && void o()(H(t), H(c).next_offset)), q(e, n);
			}, ee = (e) => {
				var n = mc(), r = z(n);
				V((e) => J(r, `No ${e ?? ""} connection enrolled.`), [() => (H(t), U(() => l(H(t))))]), q(e, n);
			};
			Y(T, (e) => {
				W(H(c)), U(() => H(c)?.configured) ? e(E) : (W(H(s)), U(() => H(s).status && !H(s).status.configured) && e(ee, 1));
			});
			var D = B(T, 2), te = R(D), ne = z(te), re = B(te, 2), ie = z(re), ae = B(re, 2), oe = (e) => {
				q(e, vc());
			};
			Y(ae, (e) => {
				H(t) === "jellyfin" && e(oe);
			});
			var se = B(ae, 2), ce = R(se), le = z(ce), ue = B(ce), O = B(ue, 2), de = B(O), fe = B(de, 2), pe = (e) => {
				var t = yc(), n = B(sn(t));
				X(n, "pattern", "[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}"), be(), V(() => n.disabled = !H(p)), q(e, t);
			};
			Y(fe, (e) => {
				H(t) === "jellyfin" && e(pe);
			});
			var me = B(fe, 2), he = B(me), ge = B(he, 3), _e = R(ge);
			be(), M(ge);
			var k = B(ge, 2), A = z(k);
			M(se), Ci(se, (e, t) => Vt(u, H(u)[t] = e), (e) => H(u)?.[e], () => [H(t)]), M(D);
			var j = B(D, 2), ve = (e) => {
				var n = bc(), r = z(n);
				V((e) => {
					n.disabled = !H(p), J(r, `Remove ${e ?? ""} connection`);
				}, [() => (H(t), U(() => l(H(t))))]), G("click", n, () => void m(H(t), !0)), q(e, n);
			};
			Y(j, (e) => {
				W(H(s)), U(() => H(s).status?.configured) && e(ve);
			}), M(h), V((e, n, r, i, a, o, l, u, d, m) => {
				X(h, "data-media-provider", H(t)), X(h, "data-media-revision", (W(H(s)), U(() => H(s).status?.revision ?? ""))), X(h, "data-media-configured", e), X(h, "data-media-error", (W(H(c)), U(() => H(c)?.error ?? ""))), X(h, "data-media-complete", n), X(h, "data-media-offset", (W(H(c)), U(() => H(c)?.offset ?? 0))), X(h, "data-media-save", (W(H(s)), U(() => H(s).save))), X(h, "aria-label", r), J(_, i), J(y, (W(H(s)), U(() => H(s).message || "Check the connection state to begin."))), x.disabled = H(f), J(S, `Check ${a ?? ""} connection state`), C.disabled = (W(H(f)), W(H(s)), U(() => H(f) || H(s).phase === "loading" || !H(s).status?.configured)), J(w, `Check ${o ?? ""} observations`), J(ne, `Enroll dedicated ${l ?? ""} access`), J(ie, `A ${u ?? ""} API key can grant administrator access. Reborn sends observation requests only; this does not restrict what the key itself can do.`), X(ce, "for", `${H(t)}-endpoint`), J(le, `${d ?? ""} HTTPS address`), X(ue, "id", `${H(t)}-endpoint`), X(ue, "placeholder", `https://${H(t)}.example/`), ue.disabled = !H(p), X(O, "for", `${H(t)}-token`), X(de, "id", `${H(t)}-token`), de.disabled = !H(p), X(me, "for", `${H(t)}-ca`), X(he, "id", `${H(t)}-ca`), he.disabled = !H(p), X(ge, "for", `${H(t)}-ack`), X(_e, "id", `${H(t)}-ack`), _e.disabled = !H(p), k.disabled = !H(p), J(A, `Save ${m ?? ""} connection`);
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
		}), M(t), q(e, t);
	};
	Y(g, (e) => {
		n() ? e(v, -1) : e(_);
	}), M(h), q(e, h), Ue();
}
wr(["click"]);
// src/Queues.svelte
var Tc = /* @__PURE__ */ K("<section class=\"card small-card queue-owner-only\"><h2>Owner access required</h2><p>An owner can enroll and view queue connections. Provider-account sharing has not been configured for members.</p></section>"), Ec = /* @__PURE__ */ K("<p class=\"field-help\">Transfers include downloading, uploading, stopped, checking and other reported states. Progress estimates current wanted/selected bytes; it does not measure checking, import or playback completion.</p>"), Dc = /* @__PURE__ */ K("<p class=\"field-help\">The provider queue includes pending and delayed releases. Its count does not establish the number of active downloads or downloader health. Progress estimates downloaded bytes and does not establish import or playback completion.</p>"), Oc = /* @__PURE__ */ K("<th scope=\"col\">Import state</th>"), kc = /* @__PURE__ */ K("<th scope=\"col\">Download rate</th><th scope=\"col\">Upload rate</th>", 1), Ac = /* @__PURE__ */ K("<td> </td>"), jc = /* @__PURE__ */ K("<td> </td><td> </td>", 1), Mc = /* @__PURE__ */ K("<tr data-queue-item=\"\"><td> <small> </small></td><td> </td><!><td> </td><td> </td><!></tr>"), Nc = /* @__PURE__ */ K("<div class=\"queue-table-scroll\" tabindex=\"0\" role=\"region\"><table class=\"queue-table\"><caption> </caption><thead><tr><th scope=\"col\">Title</th><th scope=\"col\">State</th><!><th scope=\"col\">Progress estimate</th><th scope=\"col\">Size</th><!></tr></thead><tbody></tbody></table></div>"), Pc = /* @__PURE__ */ K("<p class=\"queue-empty\"> </p>"), Fc = /* @__PURE__ */ K("<p class=\"field-help\">No usable rows were reported for this sample. This does not establish an empty provider queue.</p>"), Ic = /* @__PURE__ */ K("<p class=\"notice\">More items exist beyond this bounded view.</p>"), Lc = /* @__PURE__ */ K("<button class=\"button secondary queue-first-page\"> </button>"), Rc = /* @__PURE__ */ K("<dl class=\"queue-sample\"><dt>Collected</dt><dd> </dd><dt>Freshness</dt><dd> </dd><dt>Sample</dt><dd> </dd></dl> <!> <!> <p class=\"field-help\"> </p> <!> <!> <div class=\"button-row queue-pagination\"><button class=\"text-button queue-previous\"> </button><span class=\"quiet-label\"> </span><button class=\"text-button queue-next\"> </button></div>", 1), zc = /* @__PURE__ */ K("<button class=\"text-button queue-remove\"> </button>"), Bc = /* @__PURE__ */ K("<section class=\"card queue-provider\"><div class=\"guide-card-heading\"><h2> </h2><span class=\"quiet-label\">Owner-only observations</span></div> <p class=\"workspace-status\" role=\"status\" data-queue-status=\"\"> </p> <div class=\"button-row queue-actions\"><button class=\"button secondary queue-check-state\"> </button><button class=\"button secondary queue-check-observations\"> </button></div> <!> <details class=\"queue-enrollment\"><summary> </summary><p>Use access deliberately enrolled for Reborn. The key is encrypted on the server and will not be shown again.</p><p class=\"notice\"> </p><p class=\"field-help\"> </p> <form autocomplete=\"off\"><label> </label><input name=\"endpoint\" type=\"url\" required=\"\" maxlength=\"512\"/> <label>API key</label><input name=\"token\" type=\"password\" required=\"\" maxlength=\"8192\" autocomplete=\"off\"/> <label>Private CA certificate, if needed</label><textarea name=\"ca-pem\" rows=\"3\" maxlength=\"8192\"></textarea><p class=\"field-help\">Leave blank for publicly trusted HTTPS. Normal hostname and trust checks always apply.</p> <label class=\"queue-ack\"><input name=\"acknowledge\" type=\"checkbox\" required=\"\"/>I understand this key may grant broad management access, and I choose owner-only queue observations.</label> <button class=\"button primary queue-save\" type=\"submit\"> </button></form></details> <!></section>"), Vc = /* @__PURE__ */ K("<div class=\"queue-providers\"></div>"), Hc = /* @__PURE__ */ K("<div class=\"queues-view\"><section class=\"card queue-intro\"><p class=\"eyebrow\">QUEUE OBSERVATIONS</p><h2>See what’s in motion</h2><p>Check Sonarr and Radarr queue items, including pending releases, and qBittorrent transfers. Each provider is checked only when requested.</p><p class=\"field-help\">This view is owner-only. Member accounts have no provider identity mapping or accepted sharing policy.</p></section> <!></div>");
function Uc(e, t) {
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
	Ri(() => {
		let e = g;
		if (!e) return;
		let t = i()[e.provider], a = t.status, o = document.activeElement;
		if (!r() || !n() || !a?.configured || a.revision !== e.revision || a.profile !== e.profile || t.offset !== e.offset || t.save !== "idle" || !e.element.isConnected || document.visibilityState !== "visible" || !document.hasFocus()) {
			_();
			return;
		}
		let s = o === document.body || o === document.documentElement;
		!s && o !== e.element ? _() : e.element.disabled ? e.wasDisabled = !0 : e.wasDisabled && (_(), s && e.element.getClientRects().length > 0 && e.element.focus({ preventScroll: !0 }));
	}), Fi(() => {
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
	Ii(y);
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
			profile: ya[e],
			acknowledge_broad_access: c?.get("acknowledge") === "on"
		};
		H(m)[e]?.reset(), await s()(e, o.revision, l);
	}
	wn(() => (W(i()), W(r()), W(n())), () => {
		b(i(), r(), n());
	}), Tn(), wi();
	var C = Hc(), w = B(R(C), 2), T = (e) => {
		q(e, Tc());
	}, E = (e) => {
		var t = Vc();
		qr(t, 5, () => c, (e) => e, (e, t) => {
			let a = /* @__PURE__ */ P(() => (W(i()), H(t), U(() => i()[H(t)]))), s = /* @__PURE__ */ P(() => (W(H(a)), U(() => H(a).observation))), c = /* @__PURE__ */ P(() => (W(r()), W(H(a)), U(() => !r() || H(a).save === "saving"))), h = /* @__PURE__ */ P(() => (W(H(a)), W(H(s)), U(() => H(a).phase === "loading" || H(s)?.error === "checking"))), g = /* @__PURE__ */ P(() => (W(r()), W(n()), W(H(a)), U(() => r() && n() && H(a).phase === "ready" && H(a).save === "idle" && !!H(a).status)));
			var _ = Bc(), y = R(_), b = z(R(y));
			be(), M(y);
			var C = B(y, 2), w = z(C, !0), T = B(C, 2), E = R(T), ee = z(E), D = B(E), te = z(D);
			M(T);
			var ne = B(T, 2), re = (e) => {
				var n = Rc(), r = sn(n), i = B(R(r)), u = z(i, !0), m = B(i, 2), g = z(m, !0), _ = z(B(m, 2), !0);
				M(r);
				var v = B(r, 2), y = (e) => {
					q(e, Ec());
				}, b = (e) => {
					q(e, Dc());
				};
				Y(v, (e) => {
					H(t) === "qbittorrent" ? e(y) : e(b, -1);
				});
				var x = B(v, 2), S = (e) => {
					var n = Nc(), r = R(n), i = R(r), a = z(i, !0), o = B(i), c = R(o), u = B(R(c), 2), d = (e) => {
						q(e, Oc());
					};
					Y(u, (e) => {
						H(t) !== "qbittorrent" && e(d);
					});
					var m = B(u, 3), h = (e) => {
						var t = kc();
						be(), q(e, t);
					};
					Y(m, (e) => {
						H(t) === "qbittorrent" && e(h);
					}), M(c), M(o);
					var g = B(o);
					qr(g, 5, () => (W(H(s)), U(() => H(s).items)), (e) => e.id, (e, n) => {
						var r = Mc(), i = R(r), a = R(i, !0), o = z(B(a), !0);
						M(i);
						var s = B(i), c = z(s, !0), l = B(s), u = (e) => {
							var t = Ac(), r = z(t, !0);
							V(() => J(r, (H(n), U(() => H(n).import_state === null ? "Not reported" : H(n).import_state === "unknown" ? "Unknown" : H(n).import_state)))), q(e, t);
						};
						Y(l, (e) => {
							H(t) !== "qbittorrent" && e(u);
						});
						var d = B(l), m = z(d, !0), h = B(d), g = z(h, !0), _ = B(h), v = (e) => {
							var t = jc(), r = sn(t), i = z(r, !0), a = z(B(r), !0);
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
					var n = Pc(), r = z(n, !0);
					V(() => J(r, H(t) === "qbittorrent" ? "No transfers were reported on this page." : "No queue or pending items were reported on this page.")), q(e, n);
				}, w = (e) => {
					q(e, Fc());
				};
				Y(x, (e) => {
					W(H(s)), U(() => H(s).items.length) ? e(S) : (W(H(s)), U(() => H(s).complete && H(s).error === null) ? e(C, 1) : (W(H(s)), U(() => H(s).error !== "checking" && H(s).error !== "page_moved") && e(w, 2)));
				});
				var T = B(x, 2), E = z(T), ee = B(T, 2), D = (e) => {
					q(e, Ic());
				};
				Y(ee, (e) => {
					W(H(s)), U(() => H(s).truncated) && e(D);
				});
				var te = B(ee, 2), ne = (e) => {
					var n = Lc(), r = z(n);
					V((e) => {
						n.disabled = H(c) || H(h), J(r, `Reload first ${e ?? ""} page`);
					}, [() => (H(t), U(() => l(H(t))))]), G("click", n, () => void o()(H(t), 0)), q(e, n);
				};
				Y(te, (e) => {
					W(H(s)), U(() => H(s).error === "page_moved") && e(ne);
				});
				var re = B(te, 2), ie = R(re), ae = z(ie), oe = B(ie), se = z(oe), ce = B(oe), le = z(ce);
				M(re), V((e, n, r) => {
					J(u, e), J(g, (W(H(s)), U(() => H(s).freshness === "fresh" ? "Recent collection" : H(s).freshness === "stale" ? "Stale collection" : "Collection age unknown"))), J(_, (W(H(s)), U(() => H(s).complete ? "Complete for this bounded query" : "Incomplete or still checking"))), J(E, `${W(H(s)), H(t), U(() => H(s).total === null ? H(t) === "qbittorrent" ? "Provider total is not supplied." : "Provider total unavailable." : `${H(s).total} queue and pending items reported by the provider.`) ?? ""} Up to 12 rows per page and the first 60 rows only. Live pages can move as the provider changes.`), ie.disabled = (W(H(c)), W(H(h)), W(H(a)), W(H(s)), U(() => H(c) || H(h) || H(a).offset === 0 || H(s).error === "page_moved")), J(ae, `Previous ${n ?? ""} page`), J(se, `Page ${W(H(a)), U(() => H(a).offset / 12 + 1) ?? ""}`), ce.disabled = (W(H(c)), W(H(h)), W(H(s)), U(() => H(c) || H(h) || H(s).next_offset === null)), J(le, `Next ${r ?? ""} page`);
				}, [
					() => (W(H(s)), U(() => d(H(s).checked_at))),
					() => (H(t), U(() => l(H(t)))),
					() => (H(t), U(() => l(H(t))))
				]), G("click", ie, () => void o()(H(t), H(a).offset - 12)), G("click", ce, () => H(s).next_offset !== null && void o()(H(t), H(s).next_offset)), q(e, n);
			}, ie = (e) => {
				var n = Pc(), r = z(n);
				V((e) => J(r, `No ${e ?? ""} connection enrolled.`), [() => (H(t), U(() => l(H(t))))]), q(e, n);
			};
			Y(ne, (e) => {
				W(H(s)), U(() => H(s)?.configured) ? e(re) : (W(H(a)), U(() => H(a).status && !H(a).status.configured) && e(ie, 1));
			});
			var ae = B(ne, 2), oe = R(ae), se = z(oe), ce = B(oe, 2), le = z(ce), ue = B(ce), O = z(ue), de = B(ue, 2), fe = R(de), pe = z(fe), me = B(fe), he = B(me, 2), ge = B(he), _e = B(ge, 2), k = B(_e), A = B(k, 3), j = R(A);
			be(), M(A);
			var ve = B(A, 2), ye = z(ve);
			M(de), Ci(de, (e, t) => Vt(m, H(m)[t] = e), (e) => H(m)?.[e], () => [H(t)]), M(ae);
			var xe = B(ae, 2), Se = (e) => {
				var n = zc(), r = z(n);
				V((e) => {
					n.disabled = !H(g), J(r, `Remove ${e ?? ""} connection`);
				}, [() => (H(t), U(() => l(H(t))))]), G("click", n, () => void S(H(t), !0)), q(e, n);
			};
			Y(xe, (e) => {
				W(H(a)), U(() => H(a).status?.configured) && e(Se);
			}), M(_), V((e, n, r, i, o, l, u, d, f, p, m, v) => {
				X(_, "data-queue-provider", H(t)), X(_, "data-queue-phase", (W(H(a)), U(() => H(a).phase))), X(_, "data-queue-revision", (W(H(a)), U(() => H(a).status?.revision ?? ""))), X(_, "data-queue-configured", e), X(_, "data-queue-error", (W(H(s)), U(() => H(s)?.error ?? ""))), X(_, "data-queue-complete", n), X(_, "data-queue-offset", (W(H(a)), U(() => H(a).offset))), X(_, "data-queue-save", (W(H(a)), U(() => H(a).save))), X(_, "data-queue-freshness", (W(H(s)), U(() => H(s)?.freshness ?? "unknown"))), X(_, "data-queue-total", (W(H(s)), U(() => H(s)?.total ?? ""))), X(_, "data-queue-truncated", r), X(_, "aria-label", i), J(b, `${o ?? ""}${H(t) === "qbittorrent" ? " Transfers" : " queue"}`), J(w, (W(H(a)), U(() => H(a).message || "Check the connection state to begin."))), E.disabled = H(c), J(ee, `Check ${l ?? ""} connection state`), D.disabled = (W(H(c)), W(H(h)), W(H(a)), U(() => H(c) || H(h) || !H(a).status?.configured)), J(te, `Check ${u ?? ""} observations`), J(se, `Enroll ${d ?? ""} access`), J(le, `A global ${f ?? ""} API key may grant broad management authority. Reborn sends observation requests only; this does not restrict what the key itself can do.`), J(O, `Supported profile: ${p ?? ""}. Use a root-mounted HTTPS address. Subpath installations and username/password login are not supported here.`), X(fe, "for", `queue-${H(t)}-endpoint`), J(pe, `${m ?? ""} HTTPS address`), X(me, "id", `queue-${H(t)}-endpoint`), X(me, "placeholder", `https://${H(t)}.example/`), me.disabled = !H(g), X(he, "for", `queue-${H(t)}-token`), X(ge, "id", `queue-${H(t)}-token`), ge.disabled = !H(g), X(_e, "for", `queue-${H(t)}-ca`), X(k, "id", `queue-${H(t)}-ca`), k.disabled = !H(g), X(A, "for", `queue-${H(t)}-ack`), X(j, "id", `queue-${H(t)}-ack`), j.disabled = !H(g), ve.disabled = !H(g), J(ye, `Save ${v ?? ""} connection`);
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
			]), G("click", E, () => void x(H(t))), G("click", D, (e) => v(H(t), H(a).offset, e)), Cr("submit", de, (e) => {
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
var Wc = /* @__PURE__ */ K("<div class=\"identity-saved\" data-discord-linked=\"\"><h3>Linked Discord identity</h3> <dl class=\"identity-details\"><dt>Display name at verification</dt><dd> </dd><dt>Discord ID</dt><dd class=\"identity-id\"> </dd><dt>Verified</dt><dd> </dd></dl> <p class=\"field-help\">The immutable Discord ID identifies this link. Display names can change.</p> <button class=\"text-button discord-unlink\">Unlink Discord identity locally</button> <p class=\"field-help\">Local unlink removes this account’s saved identity link. It does not contact Discord or change your local sign-in.</p></div>"), Gc = /* @__PURE__ */ K("<form method=\"post\" action=\"/account/discord/start\" class=\"identity-start-form\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-discord-link-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <input type=\"hidden\" name=\"base_revision\"/> <input type=\"hidden\" name=\"base_flow_generation\"/> <input type=\"hidden\" name=\"base_application_revision\"/> <button class=\"button primary discord-start\" type=\"submit\"> </button></form> <p class=\"field-help\">Continue through the Reborn handoff page to Discord, then return to this browser to review the result. Starting a new link cancels an older unfinished attempt.</p>", 1), Kc = /* @__PURE__ */ K("<p class=\"notice\">Discord linking is waiting for dedicated application setup by an owner. Existing links can still be unlinked locally.</p>"), qc = /* @__PURE__ */ K("<p class=\"identity-empty\">No Discord identity linked.</p> <!>", 1), Jc = /* @__PURE__ */ K("<section class=\"identity-review\" aria-label=\"Review returned Discord identity\"><h3>Discord returned</h3><p>Review fetches your Discord identity once. You will choose separately whether to save the link.</p><button class=\"button primary discord-review\">Review Discord identity</button></section>"), Yc = /* @__PURE__ */ K("<section class=\"identity-review\" data-discord-candidate=\"\" aria-label=\"Confirm Discord identity\"><h3>Confirm this identity</h3><dl class=\"identity-details\"><dt>Display name</dt><dd> </dd><dt>Discord ID</dt><dd class=\"identity-id\"> </dd></dl><p>This identity has been verified for this attempt. Choose Confirm to save it to your current Reborn account.</p><button class=\"button primary discord-confirm\">Confirm Discord identity link</button></section>"), Xc = /* @__PURE__ */ K("<p class=\"field-help\">Discord acknowledged revoking this verification grant. This revokes tokens for the whole application authorization.</p>"), Zc = /* @__PURE__ */ K("<p class=\"notice\">Discord grant revocation could not be confirmed. Reborn discarded the verification tokens. You can remove the application authorization in Discord’s Authorized Apps settings.</p>"), Qc = /* @__PURE__ */ K("<button class=\"text-button discord-cancel\">Cancel unfinished Discord link</button>"), $c = /* @__PURE__ */ K("<button class=\"text-button discord-remove-application\">Remove Discord application access</button>"), el = /* @__PURE__ */ K("<details class=\"identity-enrollment\"><summary>Set up Discord application access</summary><p>Enroll a dedicated Discord application for Reborn. The secret is encrypted on the server and will not be shown again.</p><p>Register this exact redirect URI in the application’s OAuth settings:</p><p class=\"identity-callback\"><code> </code></p><p class=\"field-help\">Only the identify permission is requested. Before real use, review callback query handling in access logs at every proxy and application layer. OAuth codes and state arrive in the callback URL.</p> <form autocomplete=\"off\"><label for=\"discord-client-id\">Discord application ID</label><input id=\"discord-client-id\" name=\"client_id\" type=\"text\" inputmode=\"numeric\" maxlength=\"20\" required=\"\" autocomplete=\"off\"/> <label for=\"discord-client-secret\">Discord application secret</label><input id=\"discord-client-secret\" name=\"client_secret\" type=\"password\" minlength=\"1\" maxlength=\"256\" pattern=\"[!-~]+\" required=\"\" autocomplete=\"off\"/> <label class=\"identity-ack\" for=\"discord-logging-ack\"><input id=\"discord-logging-ack\" name=\"callback_logging_reviewed\" type=\"checkbox\" required=\"\"/>I reviewed callback query logging at every layer before enabling this application.</label> <button class=\"button primary discord-save-application\" type=\"submit\">Save Discord application</button></form> <!> <p class=\"field-help\">Replacing or removing application access cancels unfinished links. Accepted identity links remain saved and can be unlinked locally.</p></details>"), tl = /* @__PURE__ */ K("<!> <!> <!> <!> <!> <!>", 1), nl = /* @__PURE__ */ K("<div class=\"identity-view\"><section class=\"card identity-intro\"><p class=\"eyebrow\">YOUR DISCORD IDENTITY</p><h2>Choose a deliberate connection</h2><p>Link a verified Discord identity to this Reborn account. You review the identity and confirm it before a link is saved.</p><p class=\"field-help\">Your local sign-in and recovery stay available. A saved link records past identity verification; Discord sign-in, friends, server roles and bot setup are still planned.</p></section> <section class=\"card identity-card\" data-discord-identity=\"\" aria-label=\"Discord identity connection\"><p class=\"workspace-status\" role=\"status\" data-discord-status=\"\"> </p> <button class=\"button secondary discord-check\">Check Discord identity status</button> <!></section></div>");
function rl(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = Z(t, "binding", 8), a = Z(t, "owner", 8, !1), o = Z(t, "active", 8, !1), s = Z(t, "state", 8), c = Z(t, "check", 8), l = Z(t, "act", 8), u = Z(t, "saveApplication", 8), d = /* @__PURE__ */ I(), f = "", p = /* @__PURE__ */ I(!1), m = (e) => (/* @__PURE__ */ new Date(Number(BigInt(e)) * 1e3)).toLocaleString("en-US", {
		timeZone: "America/Chicago",
		timeZoneName: "short"
	});
	function h(e, t, n) {
		let r = t && n && e.value ? `${e.value.application.revision}:${e.value.application.configured}` : "";
		t && n && r === f && e.save === "idle" || H(d)?.reset(), t || L(p, !1), f = r;
	}
	Ii(() => H(d)?.reset());
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
	}), Tn(), wi();
	var v = nl(), y = B(R(v), 2), b = R(y), x = z(b, !0), S = B(b, 2), C = B(S, 2), w = (e) => {
		let t = /* @__PURE__ */ P(() => (W(s()), U(() => s().value)));
		var o = tl(), c = sn(o), u = (e) => {
			var r = Wc(), i = B(R(r), 2), a = B(R(i)), o = z(a, !0), s = B(a, 2), c = z(s, !0), u = z(B(s, 2), !0);
			M(i);
			var d = B(i, 4);
			be(2), M(r), V((e) => {
				J(o, (W(H(t)), U(() => H(t).link.identity.display_name))), J(c, (W(H(t)), U(() => H(t).link.identity.id))), J(u, e), d.disabled = !H(n);
			}, [() => (W(H(t)), U(() => m(H(t).link.identity.verified_at)))]), G("click", d, () => void l()("unlink")), q(e, r);
		}, f = (e) => {
			var a = qc(), o = B(sn(a), 2), s = (e) => {
				var a = Gc(), o = sn(a), s = B(B(R(o), 2), 2);
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
				q(e, Kc());
			};
			Y(o, (e) => {
				W(H(t)), U(() => H(t).application.configured) ? e(s) : e(c, -1);
			}), q(e, a);
		};
		Y(c, (e) => {
			W(H(t)), U(() => H(t).link.identity) ? e(u) : e(f, -1);
		});
		var h = B(c, 2), g = (e) => {
			var t = Jc(), r = B(R(t), 2);
			M(t), V(() => r.disabled = !H(n)), G("click", r, () => void l()("review")), q(e, t);
		};
		Y(h, (e) => {
			W(H(t)), U(() => H(t).attempt.phase === "ready_to_review") && e(g);
		});
		var v = B(h, 2), y = (e) => {
			var r = Yc(), i = B(R(r)), a = B(R(i)), o = z(a, !0), s = z(B(a, 2), !0);
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
			q(e, Xc());
		}, S = (e) => {
			q(e, Zc());
		};
		Y(b, (e) => {
			W(H(t)), U(() => H(t).attempt.cleanup === "acknowledged") ? e(x) : (W(H(t)), U(() => H(t).attempt.cleanup === "unconfirmed") && e(S, 1));
		});
		var C = B(b, 2), w = (e) => {
			var r = Qc();
			V(() => r.disabled = (H(n), W(H(t)), U(() => !H(n) || H(t).attempt.phase === "reviewing"))), G("click", r, () => void l()("cancel")), q(e, r);
		};
		Y(C, (e) => {
			H(r) && e(w);
		});
		var T = B(C, 2), E = (e) => {
			var r = el(), i = B(R(r), 3), a = z(R(i), !0);
			M(i);
			var o = B(i, 3), s = B(R(o));
			X(s, "pattern", "[1-9][0-9]{0,19}");
			var c = B(s, 3), l = B(c, 2), u = R(l);
			be(), M(l);
			var f = B(l, 2);
			M(o), Ci(o, (e) => L(d, e), () => H(d));
			var p = B(o, 2), m = (e) => {
				var t = $c();
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
var il = /* @__PURE__ */ K("<span class=\"quiet-label session-current-badge\">This session</span>"), al = /* @__PURE__ */ K("<button class=\"button secondary session-signout-current\" form=\"workspace-sign-out\" type=\"submit\">Sign out this session</button> <p class=\"field-help\">Uses the normal sign-out form for this browser.</p>", 1), ol = /* @__PURE__ */ K("<button class=\"button secondary session-revoke\" type=\"button\">Sign out this other session</button> <p class=\"field-help\">Ends only this sign-in. Your account and other sessions stay available.</p>", 1), sl = /* @__PURE__ */ K("<li class=\"session-row\" data-session-row=\"\"><div class=\"session-row-heading\"><h3> </h3><!></div> <dl class=\"session-details\"><dt>Created</dt><dd><time data-session-created=\"\"> </time></dd><dt>Expires</dt><dd><time data-session-expires=\"\"> </time></dd></dl> <!></li>"), cl = /* @__PURE__ */ K("<p class=\"sessions-only-current\">This is your only active session at the checked time.</p>"), ll = /* @__PURE__ */ K("<p class=\"field-help sessions-snapshot\">Checked <time> </time>. Later sign-ins, expiry and sign-outs can change the next result.</p> <ul class=\"session-list\" aria-label=\"Your active sign-in sessions\"></ul> <!>", 1), ul = /* @__PURE__ */ K("<div class=\"sessions-view\"><section class=\"card sessions-intro\"><p class=\"eyebrow\">YOUR SIGN-IN SESSIONS</p><h2>Review your active sign-ins</h2><p>Review your active Reborn sign-ins and deliberately sign out one other session. Each entry shows when that session was created and when it expires.</p><p class=\"field-help\">This list does not identify a device, browser, IP address or last-used time. Your account supports up to 32 active sessions. It shows a complete snapshot when checked, rather than session history.</p></section> <section class=\"card sessions-card\" data-sessions-view=\"\" aria-label=\"Active sign-in sessions\"><div class=\"sessions-heading\"><h2>Active sessions</h2><button class=\"button secondary sessions-check\">Check active sessions</button></div> <p class=\"workspace-status\" role=\"status\" data-sessions-status=\"\"> </p> <!> <p class=\"field-help sessions-account-link\">For normal sign-out, sign-out everywhere or recovery, <a href=\"/account\">open Account &amp; recovery</a>.</p></section></div>");
function dl(e, t) {
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
	Fi(() => {
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
	}), Tn(), wi();
	var p = ul(), m = B(R(p), 2), h = R(m), g = B(R(h));
	Ci(g, (e) => L(s, e), () => H(s)), M(h);
	var _ = B(h, 2), v = z(_, !0), y = B(_, 2), b = (e) => {
		var t = ll(), r = sn(t), a = B(R(r)), o = z(a, !0);
		be(), M(r);
		var s = B(r, 2);
		qr(s, 5, () => (W(i()), U(() => i().value.sessions)), (e) => e.id, (e, t) => {
			var r = sl(), i = R(r), a = R(i), o = z(a, !0), s = B(a), c = (e) => {
				q(e, il());
			};
			Y(s, (e) => {
				H(t), U(() => H(t).current) && e(c);
			}), M(i);
			var d = B(i, 2), p = B(R(d)), m = R(p), h = z(m, !0);
			M(p);
			var g = B(p, 2), _ = R(g), v = z(_, !0);
			M(g), M(d);
			var y = B(d, 2), b = (e) => {
				var t = al(), r = sn(t);
				be(2), V(() => r.disabled = !H(n)), q(e, t);
			}, x = (e) => {
				var r = ol(), i = sn(r);
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
			q(e, cl());
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
// src/RefreshNotice.svelte
var fl = /* @__PURE__ */ K("<dt>Loaded page</dt><dd> <span class=\"field-help\"> </span></dd>", 1), pl = /* @__PURE__ */ K("<dt>Running server</dt><dd> <span class=\"field-help\"> <!></span></dd>", 1), ml = /* @__PURE__ */ K("<dl class=\"refresh-builds\"><!> <!></dl>"), hl = /* @__PURE__ */ K("<p data-refresh-drafts=\"\">There is unfinished work in your note, arrangement or a form. You can stay and finish it, or deliberately discard it.</p>"), gl = /* @__PURE__ */ K("<p data-refresh-busy=\"\">A change is pending or its result needs checking. Finish it or check the saved state before refreshing. It will not be sent again.</p>"), _l = /* @__PURE__ */ K("<button class=\"button secondary refresh-cancel\">Cancel refresh checks</button>"), vl = /* @__PURE__ */ K("<button class=\"button primary refresh-navigate\"> </button>"), yl = /* @__PURE__ */ K("<button class=\"button primary refresh-prepare\">Check access for refresh</button>"), bl = /* @__PURE__ */ K("<p class=\"field-help\">Private content is hidden. <a href=\"/account\">Open your account</a> to choose a fresh document. Review any unfinished work before leaving.</p>"), xl = /* @__PURE__ */ K("<p>Save or finish work in this page before refreshing. Unsaved forms do not move to the next document.</p> <!> <!> <div class=\"button-row\"><!> <button class=\"text-button refresh-stay\">Stay on this page</button></div> <!>", 1), Sl = /* @__PURE__ */ K("<button class=\"button secondary refresh-review\">Review refresh</button>"), Cl = /* @__PURE__ */ K("<section class=\"refresh-notice notice\" aria-label=\"Workspace refresh\"><p class=\"eyebrow\">YOUR PAGE, YOUR CHOICE</p> <h2>Refresh when you are ready.</h2> <p role=\"status\" data-refresh-status=\"\"> </p> <!> <!></section>");
function wl(e, t) {
	He(t, !1);
	let n = () => Mi(l, "$updates", r), [r, i] = Ni(), a = Z(t, "control", 8), o = Z(t, "inspect", 8), s = Z(t, "workspaceModel", 8), c = Z(t, "tileState", 8), l = a().model, u = /* @__PURE__ */ I({
		busy: !1,
		drafts: !1
	}), d = /* @__PURE__ */ I(0);
	Fi(() => {
		let e = () => {
			pr().then(() => {
				Kt(d);
			});
		};
		return document.addEventListener("input", e), document.addEventListener("change", e), () => {
			document.removeEventListener("input", e), document.removeEventListener("change", e);
		};
	}), wn(() => (W(s()), W(c()), H(d), W(o())), () => {
		s(), c(), H(d), L(u, o()());
	}), Tn(), wi();
	var f = Nr(), p = sn(f), m = (e) => {
		var t = Cl(), r = B(R(t), 4), i = z(r, !0), o = B(r, 2), s = (e) => {
			var t = ml(), r = R(t), i = (e) => {
				var t = fl(), r = B(sn(t)), i = R(r), a = z(B(i), !0);
				M(r), V((e) => {
					J(i, `${n(), U(() => n().loaded.version) ?? ""} `), J(a, e);
				}, [() => (n(), U(() => n().loaded.commit.slice(0, 12)))]), q(e, t);
			};
			Y(r, (e) => {
				n(), U(() => n().loaded) && e(i);
			});
			var a = B(r, 2), o = (e) => {
				var t = pl(), r = B(sn(t)), i = R(r), a = B(i), o = R(a, !0), s = B(o), c = (e) => {
					var t = Mr();
					V(() => J(t, `· ${n(), U(() => n().running.product) ?? ""}`)), q(e, t);
				};
				Y(s, (e) => {
					n(), U(() => n().running.product !== n().loaded?.product) && e(c);
				}), M(a), M(r), V((e) => {
					J(i, `${n(), U(() => n().running.version) ?? ""} `), J(o, e);
				}, [() => (n(), U(() => n().running.commit.slice(0, 12)))]), q(e, t);
			};
			Y(a, (e) => {
				n(), U(() => n().running) && e(o);
			}), M(t), q(e, t);
		};
		Y(o, (e) => {
			n(), U(() => n().loaded || n().running) && e(s);
		});
		var c = B(o, 2), l = (e) => {
			var t = xl(), r = B(sn(t), 2), i = (e) => {
				q(e, hl());
			};
			Y(r, (e) => {
				H(u), U(() => H(u).drafts) && e(i);
			});
			var o = B(r, 2), s = (e) => {
				q(e, gl());
			};
			Y(o, (e) => {
				H(u), U(() => H(u).busy) && e(s);
			});
			var c = B(o, 2), l = R(c), d = (e) => {
				var t = _l();
				G("click", t, function(...e) {
					a().cancel?.apply(this, e);
				}), q(e, t);
			}, f = (e) => {
				var t = vl(), n = z(t, !0);
				V(() => {
					t.disabled = (H(u), U(() => H(u).busy)), J(n, (H(u), U(() => H(u).drafts ? "Discard unsaved work and refresh" : "Refresh workspace")));
				}), G("click", t, () => a().navigate(H(u).drafts)), q(e, t);
			}, p = (e) => {
				var t = yl();
				V(() => t.disabled = (H(u), U(() => H(u).busy))), G("click", t, () => void a().reconnect()), q(e, t);
			};
			Y(l, (e) => {
				n(), U(() => n().phase === "reconnecting") ? e(d) : (n(), U(() => n().phase === "compatible-ready") ? e(f, 1) : (n(), U(() => n().phase !== "sign-in-required" && n().phase !== "incompatible") && e(p, 2)));
			});
			var m = B(l, 2);
			M(c);
			var h = B(c, 2), g = (e) => {
				q(e, bl());
			};
			Y(h, (e) => {
				n(), U(() => n().phase === "sign-in-required" || n().phase === "incompatible") && e(g);
			}), G("click", m, function(...e) {
				a().stay?.apply(this, e);
			}), q(e, t);
		}, d = (e) => {
			var t = Sl();
			G("click", t, function(...e) {
				a().review?.apply(this, e);
			}), q(e, t);
		};
		Y(c, (e) => {
			n(), U(() => n().review) ? e(l) : e(d, -1);
		}), M(t), V(() => {
			X(t, "data-refresh-phase", (n(), U(() => n().phase))), J(i, (n(), U(() => n().message)));
		}), q(e, t);
	}, h = /* @__PURE__ */ ft(() => (n(), U(() => n().review || [
		"changed",
		"unavailable",
		"sign-in-required",
		"incompatible",
		"could-not-reconnect"
	].includes(n().phase))));
	Y(p, (e) => {
		H(h) && e(m);
	}), q(e, f), Ue(), i();
}
wr(["click"]);
// src/App.svelte
var Tl = /* @__PURE__ */ K("<span class=\"notification-badge\"> </span>"), El = /* @__PURE__ */ K("<a rel=\"noreferrer\"> </a>"), Dl = /* @__PURE__ */ K("<section class=\"recovery card\"><p class=\"eyebrow\">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class=\"button-row\"><a class=\"button primary\" href=\"/workspace\">Open workspace again</a><a class=\"button secondary\" href=\"/account\">Your account</a></div></section>"), Ol = /* @__PURE__ */ K("<section class=\"card tile-layout-unavailable\"><h2> </h2><p>Notes and detailed views remain available in the sidebar.</p><div class=\"button-row\"><button class=\"button secondary check-tiles\">Check saved tiles</button><a class=\"text-button\" href=\"/workspace\">Open workspace again</a></div></section>"), kl = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Draft recovery\"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class=\"button-row\"><button class=\"button secondary\">Recover draft</button><button class=\"text-button\">Discard draft</button></div></section>"), Al = /* @__PURE__ */ K("<p class=\"field-help\">Browser storage is unavailable. Draft recovery is limited to this open page.</p>"), jl = /* @__PURE__ */ K("<p class=\"notice\">Shorten this note to 4096 bytes before saving or leaving this page.</p>"), Ml = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Save conflict\"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre> </pre><div class=\"button-row\"><button class=\"button secondary\">Keep my draft</button><button class=\"text-button\">Use saved note</button></div></section>"), Nl = /* @__PURE__ */ K("<section class=\"notice\" aria-label=\"Uncertain save\"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class=\"button secondary\">Check saved note</button></section>"), Pl = /* @__PURE__ */ K("<a class=\"skip-link\" href=\"#workspace-content\">Skip to content</a> <div class=\"workspace-shell\"><aside class=\"sidebar\" aria-label=\"Workspace sidebar\"><a class=\"brand\" href=\"/workspace\"><span class=\"brand-mark\" aria-hidden=\"true\">K</span><span>Keida <small>REBORN</small></span></a> <p class=\"nav-label\">YOUR SPACE</p> <nav class=\"main-nav\" aria-label=\"Workspace views\"><button><span aria-hidden=\"true\">⌂</span>Home</button> <button><span aria-hidden=\"true\">▤</span>Workspace note<span aria-hidden=\"true\"></span></button> <button><span aria-hidden=\"true\">◇</span>Connections</button> <button><span aria-hidden=\"true\">▦</span>Services</button> <button><span aria-hidden=\"true\">◷</span>Activity</button> <button><span aria-hidden=\"true\">♧</span>Notifications<!></button> <button><span aria-hidden=\"true\">⊞</span>Integrations</button> <button><span aria-hidden=\"true\">≡</span>Roadmap</button> <button><span aria-hidden=\"true\">▻</span>Media</button> <button><span aria-hidden=\"true\">⇄</span>Queues</button> <button><span aria-hidden=\"true\">◎</span>Identity</button></nav> <div class=\"sidebar-bottom\"><a href=\"/account\" class=\"account-link\"><span class=\"avatar\" aria-hidden=\"true\">K</span><span><strong> </strong><small> </small></span></a> <button class=\"text-button review-sessions\" data-open-sessions=\"\">Review sign-in sessions</button> <form id=\"workspace-sign-out\" method=\"post\" action=\"/account/sign-out\"><input type=\"hidden\" name=\"product\" value=\"keida-hub-reborn\"/> <input type=\"hidden\" name=\"contract\" value=\"reborn-account-v1\"/> <input type=\"hidden\" name=\"csrf_token\"/> <button type=\"submit\" class=\"sign-out\">Sign out <span aria-hidden=\"true\">↗</span></button></form> <details class=\"version\"><summary> <span>Build details</span></summary> <dl><dt>Source</dt><dd><!></dd><dt>Tree</dt><dd> </dd><dt>Channel</dt><dd> </dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl></details> <div class=\"refresh-control\"><span class=\"field-help\"> </span><button class=\"text-button refresh-open\">Review refresh</button></div></div></aside> <main id=\"workspace-content\" class=\"workspace-content\"><header class=\"page-header\"><div><p class=\"eyebrow\">YOUR OWN CORNER OF KEIDA</p><h1 tabindex=\"-1\"> </h1></div><span class=\"connection-state\"><span aria-hidden=\"true\">●</span> </span></header> <p role=\"status\"> </p> <!> <!> <section class=\"home-view\" aria-label=\"Home\"><div class=\"home-layout-heading\"><p class=\"tiles-status\" role=\"status\"> </p><button class=\"button secondary customize-tiles\">Customize tiles</button></div> <div><!></div> <!></section> <section class=\"service-directory-view\" aria-label=\"Service directory view\"><!></section> <section class=\"note-view\" aria-label=\"Workspace note\"><div class=\"note-heading\"><p>A private note, available each time you sign in.</p><span class=\"quiet-label\"> </span></div> <!> <form class=\"note-card card\"><label for=\"workspace-note\">Workspace note</label> <textarea id=\"workspace-note\" name=\"workspace-note\" maxlength=\"4096\" spellcheck=\"true\" aria-describedby=\"note-help note-size\" placeholder=\"What would you like to come back to?\"></textarea> <p id=\"note-help\" class=\"field-help\">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p> <div class=\"note-footer\"><span id=\"note-size\"> </span><button class=\"button primary\" type=\"submit\"> </button></div></form> <!> <!> <!> <!></section> <section aria-label=\"Connections\"><!></section> <section aria-label=\"Activity\"><!></section> <section aria-label=\"Notifications\"><!></section> <section><!></section> <section aria-label=\"Media\"><!></section> <section aria-label=\"Queues\"><!></section> <section aria-label=\"Identity\"><!></section> <section aria-label=\"Sign-in sessions\"><!></section> <footer class=\"content-footer\"><span>Keida Reborn</span><a href=\"/account\">Account &amp; recovery</a></footer></main></div>", 1);
function Fl(e, t) {
	He(t, !1);
	let n = () => Mi(h, "$tileModel", a), r = () => Mi(f, "$model", a), i = () => Mi(p, "$updates", a), [a, o] = Ni(), s = /* @__PURE__ */ I(), c = /* @__PURE__ */ I(), l = /* @__PURE__ */ I(), u = Z(t, "binding", 8), d = so(u()), f = d.model, p = d.updates.model, m = d.tiles, h = m.model, g = /* @__PURE__ */ I(window.location.hash === "#sessions" ? "sessions" : window.location.hash === "#identity" ? "identity" : "home"), _ = /* @__PURE__ */ I(), v = /* @__PURE__ */ I(), y = /* @__PURE__ */ I(), b = /* @__PURE__ */ I(), x, S = document.querySelector("meta[name=\"reborn-version\"]")?.content ?? "development", C = document.querySelector("meta[name=\"reborn-commit\"]")?.content ?? "unqualified", w = document.querySelector("meta[name=\"reborn-tree\"]")?.content ?? "unqualified", T = document.querySelector("meta[name=\"reborn-channel\"]")?.content ?? "development";
	function E(e) {
		let t = H(g) === "identity" && e !== "identity" || H(g) === "sessions" && e !== "sessions";
		H(g) === "identity" && e !== "identity" && d.closeIdentity(), H(g) === "sessions" && e !== "sessions" && d.closeSessions(), t ? kt(() => {
			L(g, e);
		}) : L(g, e), H(_)?.focus(), e === "activity" && d.activity(), e === "notifications" && d.check(), (e === "integrations" || e === "roadmap") && d.loadGuide(), e === "media" && d.openMedia(), e === "queues" && d.openQueues();
	}
	let ee = /* @__PURE__ */ I(!1), D = /* @__PURE__ */ I(!1), te = () => r().snapshot ? `${r().snapshot.account.id}:${r().snapshot.session_generation}:${r().snapshot.account.role}` : "", ne;
	function re(e) {
		ne !== void 0 && cancelAnimationFrame(ne), ne = void 0;
		let t = e.currentTarget, n = e.target;
		if (!(t instanceof HTMLElement) || !(n instanceof HTMLButtonElement) || !t.contains(n) || !matchMedia("(max-width: 600px)").matches) return;
		let r = te();
		ne = requestAnimationFrame(() => {
			if (ne = void 0, r !== te() || !t.isConnected || !n.isConnected || !t.contains(n) || document.activeElement !== n || document.visibilityState !== "visible" || !document.hasFocus() || !matchMedia("(max-width: 600px)").matches) return;
			let e = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = e.left + 8, o = e.right - 8, s = i.left < a ? i.left - a : i.right > o ? i.right - o : 0;
			s && t.scrollBy({
				left: s,
				behavior: "instant"
			});
		});
	}
	Ii(() => {
		ne !== void 0 && cancelAnimationFrame(ne);
	});
	async function ie(e) {
		let t = te();
		await e(), await pr(), t && t === te() && H(g) === "home" && r().phase === "ready" && !n().draft && document.activeElement === document.body && document.visibilityState === "visible" && document.hasFocus() && H(b)?.isConnected && !H(b).disabled && H(b).getClientRects().length > 0 && H(b).focus({ preventScroll: !0 });
	}
	Li(() => {
		let e = document.activeElement;
		x = H(g) === "home" && r().phase === "ready" && e instanceof HTMLElement && (H(v)?.contains(e) || H(y)?.contains(e)) ? {
			element: e,
			scope: te()
		} : void 0;
	}), Ri(() => {
		let e = x;
		if (x = void 0, !e) return;
		let t = e.element instanceof HTMLButtonElement && e.element.disabled;
		H(g) === "home" && r().phase === "ready" && e.scope === te() && e.element.isConnected && (H(v)?.contains(e.element) || H(y)?.contains(e.element)) && (document.activeElement === document.body || t && document.activeElement === e.element) && document.visibilityState === "visible" && document.hasFocus() && e.element.getClientRects().length > 0 && (t ? e.element.closest("[data-tile-row]") : e.element)?.focus({ preventScroll: !0 });
	}), Fi(d.start), wn(() => n(), () => {
		L(s, n().draft?.tiles ?? n().value?.layout.tiles ?? []);
	}), wn(() => (r(), H(g), H(s)), () => {
		r().phase === "ready" && d.setObservationView(H(g), H(s).map((e) => e.id));
	}), wn(() => r(), () => {
		L(c, new TextEncoder().encode(r().draft).length);
	}), wn(() => (r(), H(c)), () => {
		L(l, r().phase === "ready" && r().dirty && H(c) <= 4096 && r().notificationSave !== "saving" && ![
			"saving",
			"checking-conflict",
			"conflict",
			"uncertain"
		].includes(r().save));
	}), wn(() => (H(g), r()), () => {
		(H(g) !== "identity" || r().phase !== "ready") && L(ee, !1);
	}), wn(() => (H(g), r(), H(ee)), () => {
		H(g) === "identity" && r().phase === "ready" && !H(ee) && (L(ee, !0), d.openIdentity());
	}), wn(() => (H(g), r()), () => {
		(H(g) !== "sessions" || r().phase !== "ready") && L(D, !1);
	}), wn(() => (H(g), r(), H(D)), () => {
		H(g) === "sessions" && r().phase === "ready" && !H(D) && (L(D, !0), d.openSessions());
	}), Tn(), wi();
	var ae = Pl(), oe = B(sn(ae), 2), se = R(oe), ce = B(R(se), 4), le = R(ce);
	let ue;
	var O = B(le, 2);
	let de;
	var fe = B(R(O), 2);
	let pe;
	M(O);
	var me = B(O, 2);
	let he;
	var ge = B(me, 2);
	let _e;
	var k = B(ge, 2);
	let A;
	var j = B(k, 2);
	let ve;
	var ye = B(R(j), 2), xe = (e) => {
		var t = Tl(), n = z(t, !0);
		V(() => {
			X(t, "aria-label", (r(), U(() => `${r().snapshot.notifications.unread_groups} unread groups`))), J(n, (r(), U(() => r().snapshot.notifications.unread_groups)));
		}), q(e, t);
	};
	Y(ye, (e) => {
		r(), U(() => r().snapshot?.notifications.unread_groups) && e(xe);
	}), M(j);
	var Se = B(j, 2);
	let Ce;
	var we = B(Se, 2);
	let Te;
	var N = B(we, 2);
	let Ee;
	var De = B(N, 2);
	let Oe;
	var ke = B(De, 2);
	let Ae;
	M(ce);
	var je = B(ce, 2), Me = R(je), Ne = B(R(Me)), Pe = R(Ne), Fe = z(Pe, !0), Ie = z(B(Pe), !0);
	M(Ne), M(Me);
	var Le = B(Me, 2), Re = B(Le, 2), ze = B(B(R(Re), 2), 2);
	pi(ze), be(2), M(Re);
	var Be = B(Re, 2), Ve = R(Be), We = R(Ve, !0);
	be(), M(Ve);
	var Ge = B(Ve, 2), Ke = B(R(Ge)), qe = R(Ke), Je = (e) => {
		var t = El(), n = z(t, !0);
		V(() => {
			X(t, "href", `https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${C}`), J(n, C);
		}), q(e, t);
	}, Ye = /* @__PURE__ */ ft(() => U(() => /^[a-f0-9]{40}$/.test(C))), Xe = (e) => {
		var t = Mr();
		V(() => J(t, C)), q(e, t);
	};
	Y(qe, (e) => {
		H(Ye) ? e(Je) : e(Xe, -1);
	}), M(Ke);
	var Ze = B(Ke, 2), Qe = z(Ze, !0), $e = z(B(Ze, 2), !0);
	be(2), M(Ge), M(Be);
	var tt = B(Be, 2), nt = R(tt), rt = z(nt, !0), it = B(nt);
	M(tt), M(je), M(se);
	var at = B(se, 2), ot = R(at), st = R(ot), ct = B(R(st)), lt = z(ct, !0);
	Ci(ct, (e) => L(_, e), () => H(_)), M(st);
	var ut = B(st), dt = B(R(ut), 1, !0);
	M(ut), M(ot);
	var pt = B(ot, 2);
	let mt;
	var ht = z(pt, !0), gt = B(pt, 2);
	wl(gt, {
		get control() {
			return U(() => d.updates);
		},
		get inspect() {
			return U(() => d.refreshStatus);
		},
		get workspaceModel() {
			return r();
		},
		get tileState() {
			return n();
		}
	});
	var _t = B(gt, 2), vt = (e) => {
		q(e, Dl());
	};
	Y(_t, (e) => {
		r(), U(() => r().phase !== "ready") && e(vt);
	});
	var F = B(_t, 2), yt = R(F), bt = R(yt), xt = z(bt, !0), St = B(bt);
	Ci(St, (e) => L(b, e), () => H(b)), M(yt);
	var Ct = B(yt, 2), wt = R(Ct);
	{
		let e = /* @__PURE__ */ P(() => (r(), U(() => r().phase === "ready")));
		Xo(wt, {
			get state() {
				return n();
			},
			get control() {
				return m;
			},
			finish: ie,
			get authorized() {
				return H(e);
			}
		});
	}
	M(Ct), Ci(Ct, (e) => L(y, e), () => H(y));
	var Tt = B(Ct, 2), Et = (e) => {
		{
			let t = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.crafty))), i = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.directory))), a = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.note.revision !== "0"))), o = /* @__PURE__ */ P(() => (r(), U(() => r().phase === "ready"))), c = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.account.role === "owner")));
			Vo(e, {
				get tiles() {
					return H(s);
				},
				get catalog() {
					return n(), U(() => n().value.catalog);
				},
				get crafty() {
					return H(t);
				},
				get games() {
					return r(), U(() => r().games);
				},
				get directory() {
					return H(i);
				},
				get media() {
					return r(), U(() => r().media);
				},
				get queues() {
					return r(), U(() => r().queues);
				},
				get dirty() {
					return r(), U(() => r().dirty);
				},
				get noteSaved() {
					return H(a);
				},
				get authorized() {
					return H(o);
				},
				get owner() {
					return H(c);
				},
				navigate: E,
				get observe() {
					return U(() => d.checkHome);
				},
				get grid() {
					return H(v);
				},
				set grid(e) {
					L(v, e);
				},
				$$legacy: !0
			});
		}
	}, Dt = (e) => {
		var t = Ol(), r = R(t), i = z(r, !0), a = B(r, 2), o = R(a);
		be(), M(a), M(t), V(() => {
			J(i, (n(), U(() => n().phase === "error" ? "Your tiles could not be loaded" : "Getting your tiles ready"))), o.disabled = (n(), U(() => n().phase === "loading"));
		}), G("click", o, () => void m.check()), q(e, t);
	};
	Y(Tt, (e) => {
		r(), n(), U(() => r().phase === "ready" && n().value) ? e(Et) : (r(), U(() => r().phase === "ready") && e(Dt, 1));
	}), M(F);
	var Ot = B(F, 2), At = R(Ot);
	{
		let e = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.directory))), t = /* @__PURE__ */ P(() => (r(), U(() => r().phase === "ready"))), n = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.account.role === "owner")));
		Ps(At, {
			get directory() {
				return H(e);
			},
			get authorized() {
				return H(t);
			},
			get owner() {
				return H(n);
			},
			compact: !1,
			get state() {
				return r(), U(() => r().directorySave);
			},
			get message() {
				return r(), U(() => r().directoryMessage);
			},
			browse: () => E("directory"),
			get check() {
				return U(() => d.check);
			},
			get edit() {
				return U(() => d.editService);
			},
			get pin() {
				return U(() => d.pins);
			}
		});
	}
	M(Ot);
	var jt = B(Ot, 2), Mt = R(jt), Nt = z(B(R(Mt)), !0);
	M(Mt);
	var Pt = B(Mt, 2), Ft = (e) => {
		var t = kl(), n = B(R(t), 2), r = R(n), i = B(r);
		M(n), M(t), G("click", r, function(...e) {
			d.recover?.apply(this, e);
		}), G("click", i, () => d.resolve(!0)), q(e, t);
	};
	Y(Pt, (e) => {
		r(), U(() => r().recovery) && e(Ft);
	});
	var It = B(Pt, 2), Lt = B(R(It), 2);
	et(Lt);
	var Rt = B(Lt, 4), zt = R(Rt);
	let Bt;
	var Vt = z(zt), Ht = B(zt), Ut = z(Ht, !0);
	M(Rt), M(It);
	var Wt = B(It, 2), Gt = (e) => {
		q(e, Al());
	};
	Y(Wt, (e) => {
		r(), U(() => r().storageLimited) && e(Gt);
	});
	var Kt = B(Wt, 2), qt = (e) => {
		q(e, jl());
	};
	Y(Kt, (e) => {
		H(c) > 4096 && e(qt);
	});
	var Jt = B(Kt, 2), Yt = (e) => {
		var t = Ml(), n = B(R(t), 2), i = z(n, !0), a = B(n), o = R(a), s = B(o);
		M(a), M(t), V(() => J(i, (r(), U(() => r().snapshot?.note.body)))), G("click", o, () => d.resolve(!1)), G("click", s, () => d.resolve(!0)), q(e, t);
	};
	Y(Jt, (e) => {
		r(), U(() => r().save === "conflict") && e(Yt);
	});
	var Xt = B(Jt, 2), Zt = (e) => {
		var t = Nl(), n = B(R(t), 2);
		M(t), G("click", n, () => d.check()), q(e, t);
	};
	Y(Xt, (e) => {
		r(), U(() => r().save === "uncertain") && e(Zt);
	}), M(jt);
	var Qt = B(jt, 2), $t = R(Qt);
	{
		let e = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.crafty))), t = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.account.role === "owner"))), n = /* @__PURE__ */ P(() => (H(g), r(), U(() => H(g) === "connections" && r().phase === "ready")));
		_s($t, {
			get mutationState() {
				return U(() => d.connectionMutation);
			},
			history: () => {
				L(g, "activity"), H(_)?.focus(), d.activity("connections", "");
			},
			get binding() {
				return u();
			},
			get overview() {
				return H(e);
			},
			get owner() {
				return H(t);
			},
			get active() {
				return H(n);
			},
			get refresh() {
				return U(() => d.check);
			},
			get observationState() {
				return r(), U(() => r().observations);
			},
			get loadObservations() {
				return U(() => d.observations);
			}
		});
	}
	M(Qt);
	var en = B(Qt, 2), tn = R(en);
	{
		let e = /* @__PURE__ */ P(() => (r(), U(() => r().phase === "ready")));
		Vs(tn, {
			get state() {
				return r(), U(() => r().activity);
			},
			get authorized() {
				return H(e);
			},
			get load() {
				return U(() => d.activity);
			}
		});
	}
	M(en);
	var nn = B(en, 2), rn = R(nn);
	{
		let e = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.notifications))), t = /* @__PURE__ */ P(() => (r(), U(() => r().phase === "ready")));
		Ks(rn, {
			get value() {
				return H(e);
			},
			get authorized() {
				return H(t);
			},
			get state() {
				return r(), U(() => r().notificationSave);
			},
			get message() {
				return r(), U(() => r().notificationMessage);
			},
			get check() {
				return U(() => d.check);
			},
			get mark() {
				return U(() => d.markNotification);
			}
		});
	}
	M(nn);
	var an = B(nn, 2), on = R(an);
	{
		let e = /* @__PURE__ */ P(() => H(g) === "roadmap" ? "roadmap" : "catalog"), t = /* @__PURE__ */ P(() => (r(), U(() => r().phase === "ready"))), n = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.account.role === "owner")));
		cc(on, {
			get mode() {
				return H(e);
			},
			get state() {
				return r(), U(() => r().guide);
			},
			get authorized() {
				return H(t);
			},
			retry: () => d.loadGuide(!0),
			connections: () => E("connections"),
			media: () => E("media"),
			queues: () => E("queues"),
			identity: () => E("identity"),
			get owner() {
				return H(n);
			}
		});
	}
	M(an);
	var cn = B(an, 2), ln = R(cn);
	{
		let e = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.account.role === "owner"))), t = /* @__PURE__ */ P(() => (H(g), r(), U(() => H(g) === "media" && r().phase === "ready")));
		wc(ln, {
			get state() {
				return r(), U(() => r().media);
			},
			get owner() {
				return H(e);
			},
			get active() {
				return H(t);
			},
			get check() {
				return U(() => d.checkMedia);
			},
			get load() {
				return U(() => d.loadMedia);
			},
			get save() {
				return U(() => d.saveMedia);
			}
		});
	}
	M(cn);
	var un = B(cn, 2), dn = R(un);
	{
		let e = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.account.role === "owner"))), t = /* @__PURE__ */ P(() => (H(g), r(), U(() => H(g) === "queues" && r().phase === "ready")));
		Uc(dn, {
			get state() {
				return r(), U(() => r().queues);
			},
			get owner() {
				return H(e);
			},
			get active() {
				return H(t);
			},
			get check() {
				return U(() => d.checkQueues);
			},
			get load() {
				return U(() => d.loadQueues);
			},
			get save() {
				return U(() => d.saveQueues);
			}
		});
	}
	M(un);
	var fn = B(un, 2), pn = R(fn);
	{
		let e = /* @__PURE__ */ P(() => (r(), U(() => r().snapshot?.account.role === "owner"))), t = /* @__PURE__ */ P(() => (H(g), r(), U(() => H(g) === "identity" && r().phase === "ready")));
		rl(pn, {
			get binding() {
				return u();
			},
			get state() {
				return r(), U(() => r().identity);
			},
			get owner() {
				return H(e);
			},
			get active() {
				return H(t);
			},
			get check() {
				return U(() => d.checkIdentity);
			},
			get act() {
				return U(() => d.identityAction);
			},
			get saveApplication() {
				return U(() => d.saveDiscordApplication);
			}
		});
	}
	M(fn);
	var mn = B(fn, 2), hn = R(mn);
	{
		let e = /* @__PURE__ */ P(() => (H(g), r(), U(() => H(g) === "sessions" && r().phase === "ready")));
		dl(hn, {
			get state() {
				return r(), U(() => r().sessions);
			},
			get active() {
				return H(e);
			},
			get check() {
				return U(() => d.checkSessions);
			},
			get revoke() {
				return U(() => d.revokeSession);
			}
		});
	}
	M(mn), be(2), M(at), M(oe), V(() => {
		X(le, "aria-current", H(g) === "home" ? "page" : void 0), ue = ti(le, 1, "", null, ue, { active: H(g) === "home" }), X(O, "aria-current", H(g) === "note" ? "page" : void 0), de = ti(O, 1, "", null, de, { active: H(g) === "note" }), pe = ti(fe, 1, "draft-dot", null, pe, { visible: r().dirty }), X(me, "aria-current", H(g) === "connections" ? "page" : void 0), he = ti(me, 1, "", null, he, { active: H(g) === "connections" }), X(ge, "aria-current", H(g) === "directory" ? "page" : void 0), _e = ti(ge, 1, "", null, _e, { active: H(g) === "directory" }), X(k, "aria-current", H(g) === "activity" ? "page" : void 0), A = ti(k, 1, "", null, A, { active: H(g) === "activity" }), X(j, "aria-current", H(g) === "notifications" ? "page" : void 0), ve = ti(j, 1, "", null, ve, { active: H(g) === "notifications" }), X(Se, "aria-current", H(g) === "integrations" ? "page" : void 0), Ce = ti(Se, 1, "", null, Ce, { active: H(g) === "integrations" }), X(we, "aria-current", H(g) === "roadmap" ? "page" : void 0), Te = ti(we, 1, "", null, Te, { active: H(g) === "roadmap" }), X(N, "aria-current", H(g) === "media" ? "page" : void 0), Ee = ti(N, 1, "", null, Ee, { active: H(g) === "media" }), X(De, "aria-current", H(g) === "queues" ? "page" : void 0), Oe = ti(De, 1, "", null, Oe, { active: H(g) === "queues" }), X(ke, "aria-current", H(g) === "identity" ? "page" : void 0), Ae = ti(ke, 1, "", null, Ae, { active: H(g) === "identity" }), J(Fe, (r(), U(() => r().snapshot?.account.username ?? "Your account"))), J(Ie, (r(), U(() => r().snapshot?.account.role === "owner" ? "Owner" : r().snapshot?.account.role === "member" ? "Member" : "Check account access"))), Le.disabled = (r(), U(() => r().phase !== "ready")), X(Le, "aria-current", H(g) === "sessions" ? "page" : void 0), mi(ze, u()), J(We, S), J(Qe, w), J($e, T), J(rt, (i(), U(() => i().phase === "changed" ? "Server changed" : i().phase === "current" ? "Page matches server" : i().phase === "checking" ? "Checking server version" : "Page and server versions"))), J(lt, H(g) === "home" ? "Welcome home." : H(g) === "note" ? "A little space to think." : H(g) === "connections" ? "Your servers, at a glance." : H(g) === "directory" ? "Everything within reach." : H(g) === "activity" ? "Pick up the thread." : H(g) === "notifications" ? "Catch up at your pace." : H(g) === "integrations" ? "Make the right connections." : H(g) === "media" ? "A window into your media." : H(g) === "queues" ? "See what’s in motion." : H(g) === "identity" ? "An identity you choose." : H(g) === "sessions" ? "Your active sign-ins." : "See what comes next."), J(dt, (r(), U(() => r().phase === "ready" ? "Session checked" : r().phase === "checking" ? "Checking access" : "Access paused"))), mt = ti(pt, 1, "workspace-status", null, mt, { "status-quiet": r().phase === "ready" && r().message === "Workspace checked." }), J(ht, (r(), U(() => r().message))), X(F, "hidden", (H(g), r(), U(() => H(g) !== "home" || r().phase !== "ready"))), J(xt, (n(), U(() => n().message || "Your games, media and services in one place."))), St.disabled = (r(), n(), U(() => r().phase !== "ready" || !n().value || !!n().draft || n().save !== "idle")), X(Ot, "hidden", (H(g), r(), U(() => H(g) !== "directory" || r().phase !== "ready"))), X(jt, "hidden", (H(g), r(), U(() => H(g) !== "note" || r().phase !== "ready"))), J(Nt, (r(), U(() => r().dirty ? "Unsaved changes" : "Up to date"))), mi(Lt, (r(), U(() => r().draft))), Lt.disabled = (r(), U(() => r().phase !== "ready")), Bt = ti(zt, 1, "", null, Bt, { "over-limit": H(c) > 4096 }), J(Vt, `${H(c) ?? ""} / 4096 bytes`), Ht.disabled = !H(l), J(Ut, (r(), U(() => r().save === "saving" ? "Saving…" : "Save note"))), X(Qt, "hidden", (H(g), r(), U(() => H(g) !== "connections" || r().phase !== "ready"))), X(en, "hidden", (H(g), r(), U(() => H(g) !== "activity" || r().phase !== "ready"))), X(nn, "hidden", (H(g), r(), U(() => H(g) !== "notifications" || r().phase !== "ready"))), X(an, "hidden", (H(g), r(), U(() => H(g) !== "integrations" && H(g) !== "roadmap" || r().phase !== "ready"))), X(an, "aria-label", H(g) === "roadmap" ? "Roadmap note" : "Integration catalog"), X(cn, "hidden", (H(g), r(), U(() => H(g) !== "media" || r().phase !== "ready"))), X(un, "hidden", (H(g), r(), U(() => H(g) !== "queues" || r().phase !== "ready"))), X(fn, "hidden", (H(g), r(), U(() => H(g) !== "identity" || r().phase !== "ready"))), X(mn, "hidden", (H(g), r(), U(() => H(g) !== "sessions" || r().phase !== "ready")));
	}), G("focusin", ce, re), G("click", le, () => E("home")), G("click", O, () => E("note")), G("click", me, () => E("connections")), G("click", ge, () => E("directory")), G("click", k, () => E("activity")), G("click", j, () => E("notifications")), G("click", Se, () => E("integrations")), G("click", we, () => E("roadmap")), G("click", N, () => E("media")), G("click", De, () => E("queues")), G("click", ke, () => E("identity")), G("click", Le, () => E("sessions")), Cr("submit", Re, () => d.signOut()), G("click", it, function(...e) {
		d.updates.review?.apply(this, e);
	}), G("click", St, function(...e) {
		m.begin?.apply(this, e);
	}), Cr("submit", It, (e) => {
		e.preventDefault(), d.save();
	}), G("input", Lt, (e) => d.edit(e.currentTarget.value)), q(e, ae), Ue(), o();
}
wr([
	"focusin",
	"click",
	"input"
]);
// src/main.ts
var Il = document.getElementById("workspace-root"), Ll = document.querySelector("meta[name=\"reborn-session-binding\"]")?.content, Rl = document.querySelector("meta[name=\"reborn-workspace-contract\"]")?.content;
if (Il && Ll && /^[a-f0-9]{64}$/.test(Ll) && Rl === "reborn-workspace-v1") {
	let e = Array.from(Il.childNodes);
	Il.replaceChildren();
	try {
		Rr(Fl, {
			target: Il,
			props: { binding: Ll }
		});
	} catch {
		Il.replaceChildren(...e);
	}
}
