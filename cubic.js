'use strict';

// All the formulas below are from
// https://en.wikipedia.org/wiki/Cubic_function#General_formula_for_roots .

// Delta_0 = b^2 - 3ac.
var cubicDisc0Formula = (function() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  return b.pow(2).minus(a.times(c, 3));
})();

// Delta_1 = 2b^3 - 9abc + 27a^2d.
var cubicDisc1Formula = (function() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  var disc1a = b.pow(3).times(2);
  var disc1b = a.times(b, c, 9)
  var disc1c = a.pow(2).times(d, 27);
  return disc1a.minus(disc1b).plus(disc1c);
})();

// -27 a^2 Delta = Delta_1^2 - 4 Delta_0^3.
var cubicScaledDiscFormula =
    cubicDisc1Formula.pow(2).minus(cubicDisc0Formula.pow(3).times(4));

// C^3 = (Delta_1 + sqrt(-27 a^2 Delta)) / 2, where both complex square
// roots are taken.
function newCubicCCubedFormula() {
  return cubicDisc1Formula.plusAll(cubicScaledDiscFormula.root(2)).divAll(2);
}

// x = -(b + C + Delta_0 / C) / (3a), where only one value of C^3 is
// taken.
function newCubicFormula() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  var disc0 = cubicDisc0Formula;
  var CCubed = newCubicCCubedFormula().slice(0, 1);
  var C = CCubed.root(3);
  return b.plusAll(C.plus(disc0.divAll(C))).divAll(a.times(-3));
}
