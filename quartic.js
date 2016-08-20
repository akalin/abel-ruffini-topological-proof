'use strict';

// All the formulas below are from
// https://en.wikipedia.org/wiki/Quartic_function#General_formula_for_roots .

// Delta_0 = c^2 - 3bd + 12ae.
var quarticDisc0Formula = (function() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  var e = ComplexFormula.select(-5);
  return c.pow(2).minus(b.times(d, 3)).plus(a.times(e, 12));
})();

// Delta_1 = 2c^3 - 9bcd + 27b^2e + 27ad^2 - 72ace.
var quarticDisc1Formula = (function() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  var e = ComplexFormula.select(-5);
  var disc1a = c.pow(3).times(2);
  var disc1b = b.times(c, d, 9)
  var disc1c = b.pow(2).times(e, 27);
  var disc1d = a.times(d.pow(2), 27);
  var disc1e = a.times(c, e, 72);
  return disc1a.minus(disc1b).plus(disc1c, disc1d).minus(disc1e);
})();

// -27 Delta = Delta_1^2 - 4 Delta_0^3.
var quarticScaledDiscFormula =
    quarticDisc1Formula.pow(2).minus(quarticDisc0Formula.pow(3).times(4));

// Q^3 = (Delta_1 + sqrt(-27 Delta)) / 2, where both complex square
// roots are taken.
function newQuarticQCubedFormula() {
  var disc1 = quarticDisc1Formula;
  return disc1.plusAll(quarticScaledDiscFormula.root(2)).divAll(2);
}

// p = (8ac - 3b^2) / (8a^2).
var quarticPFormula = (function() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  var e = ComplexFormula.select(-5);
  return a.times(c, 8).minus(b.pow(2).times(3)).div(a.pow(2).times(8));
})();

// q = (b^3 - 4abc + 8a^2d) / (8a^3).
var quarticSmallQFormula = (function() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  var e = ComplexFormula.select(-5);
  return b.pow(3).minus(a.times(b, c, 4)).plus(a.pow(2).times(d, 8))
    .div(a.pow(3).times(8));
})();

// S = sqrt((-2/3) p + (Q + Delta_0/Q)/(3a)) / 2, where only one value
// of Q^3 is taken, and both complex square roots are taken.
function newQuarticSFormula() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  var e = ComplexFormula.select(-5);
  var p = quarticPFormula;
  var disc0 = quarticDisc0Formula;
  var Q = newQuarticQCubedFormula().slice(0, 1).root(3);
  return Q.plus(disc0.divAll(Q)).divAll(a.times(3))
    .minusAll(p.times(2/3)).root(2).divAll(2);
}

// x_1, x_2 = -b/(4a) - S + sqrt(-4S^2 - 2p + q/S) / 2, and
// x_3, x_4 = -b/(4a) + S + sqrt(-4S^2 - 2p - q/S) / 2, where only one
// value of S is taken, and both complex square roots are taken.
function newQuarticFormula() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  var e = ComplexFormula.select(-5);
  var p = quarticPFormula;
  var q = quarticSmallQFormula;
  var S = newQuarticSFormula().slice(0, 1);
  var t1 = b.neg().div(a.times(4));
  var t2 = p.neg().times(2).minus(S.pow(2).times(4));
  var t3 = q.div(S);
  var x12 = t1.minus(S).plusAll(t3.plus(t2).root(2).divAll(2));
  var x34 = t1.plus(S).plusAll(t3.neg().plus(t2).root(2).divAll(2));
  return x12.concat(x34);
}
