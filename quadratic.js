'use strict';

// From https://en.wikipedia.org/wiki/Discriminant :
//
//   Delta = b^2 - 4ac.
var quadraticDiscriminantFormula = (function() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  return b.pow(2).minus(a.times(c, 4));
})();

// From https://en.wikipedia.org/wiki/Quadratic_formula :
//
//   x = (-b + sqrt(Delta)) / 2a,
//
// where both complex square roots are taken.
function newQuadraticFormula() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var disc = quadraticDiscriminantFormula;
  return b.neg().plusAll(disc.root(2)).divAll(a.times(2));
};
