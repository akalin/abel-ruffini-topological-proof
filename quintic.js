'use strict';


// Taken from the output of
//
//   Discriminant[a x^5 + b x^4 + c x^3 + d x^2 + e x + f, x]
//
// from Mathematica, munged with some regexps to get each monomial
// term to be in a consistent format.
var quinticDiscFormula = (function() {
  var a = ComplexFormula.select(-1);
  var b = ComplexFormula.select(-2);
  var c = ComplexFormula.select(-3);
  var d = ComplexFormula.select(-4);
  var e = ComplexFormula.select(-5);
  var f = ComplexFormula.select(-6);

  var s =
      '1 b^2 c^2 d^2 e^2 + -4 a^1 c^3 d^2 e^2 + -4 b^3 d^3 e^2 + ' +
      '18 a^1 b^1 c^1 d^3 e^2 + -27 a^2 d^4 e^2 + -4 b^2 c^3 e^3 + ' +
      '16 a^1 c^4 e^3 + 18 b^3 c^1 d^1 e^3 + -80 a^1 b^1 c^2 d^1 e^3 + ' +
      '-6 a^1 b^2 d^2 e^3 + 144 a^2 c^1 d^2 e^3 + -27 b^4 e^4 + ' +
      '144 a^1 b^2 c^1 e^4 + -128 a^2 c^2 e^4 + -192 a^2 b^1 d^1 e^4 + ' +
      '256 a^3 e^5 + -4 b^2 c^2 d^3 f^1 + 16 a^1 c^3 d^3 f^1 + ' +
      '16 b^3 d^4 f^1 + -72 a^1 b^1 c^1 d^4 f^1 + 108 a^2 d^5 f^1 + ' +
      '18 b^2 c^3 d^1 e^1 f^1 + -72 a^1 c^4 d^1 e^1 f^1 + ' +
      '-80 b^3 c^1 d^2 e^1 f^1 + 356 a^1 b^1 c^2 d^2 e^1 f^1 + ' +
      '24 a^1 b^2 d^3 e^1 f^1 + -630 a^2 c^1 d^3 e^1 f^1 + ' +
      '-6 b^3 c^2 e^2 f^1 + 24 a^1 b^1 c^3 e^2 f^1 + 144 b^4 d^1 e^2 f^1 + ' +
      '-746 a^1 b^2 c^1 d^1 e^2 f^1 + 560 a^2 c^2 d^1 e^2 f^1 + ' +
      '1020 a^2 b^1 d^2 e^2 f^1 + -36 a^1 b^3 e^3 f^1 + ' +
      '160 a^2 b^1 c^1 e^3 f^1 + -1600 a^3 d^1 e^3 f^1 + -27 b^2 c^4 f^2 + ' +
      '108 a^1 c^5 f^2 + 144 b^3 c^2 d^1 f^2 + -630 a^1 b^1 c^3 d^1 f^2 + ' +
      '-128 b^4 d^2 f^2 + 560 a^1 b^2 c^1 d^2 f^2 + 825 a^2 c^2 d^2 f^2 + ' +
      '-900 a^2 b^1 d^3 f^2 + -192 b^4 c^1 e^1 f^2 + ' +
      '1020 a^1 b^2 c^2 e^1 f^2 + -900 a^2 c^3 e^1 f^2 + ' +
      '160 a^1 b^3 d^1 e^1 f^2 + -2050 a^2 b^1 c^1 d^1 e^1 f^2 + ' +
      '2250 a^3 d^2 e^1 f^2 + -50 a^2 b^2 e^2 f^2 + 2000 a^3 c^1 e^2 f^2 + ' +
      '256 b^5 f^3 + -1600 a^1 b^3 c^1 f^3 + 2250 a^2 b^1 c^2 f^3 + ' +
      '2000 a^2 b^2 d^1 f^3 + -3750 a^3 c^1 d^1 f^3 + ' +
      '-2500 a^3 b^1 e^1 f^3 + 3125 a^4 f^4';

  var terms = s.split(' + ').map(function(t) {
    var matches = t.match(/^([-0-9]+)(?: a\^(\d+))?(?: b\^(\d+))?(?: c\^(\d+))?(?: d\^(\d+))?(?: e\^(\d+))?(?: f\^(\d+))?$/);
    if (matches == null) {
      throw "Could not match " + t;
    }
    var coeff = parseInt(matches[1], 10);
    var aExp = parseInt(matches[2] || "0", 10);
    var bExp = parseInt(matches[3] || "0", 10);
    var cExp = parseInt(matches[4] || "0", 10);
    var dExp = parseInt(matches[5] || "0", 10);
    var eExp = parseInt(matches[6] || "0", 10);
    var fExp = parseInt(matches[7] || "0", 10);
    return ComplexFormula.from(coeff).times(
      a.pow(aExp),
      b.pow(bExp),
      c.pow(cExp),
      d.pow(dExp),
      e.pow(eExp),
      f.pow(fExp)
    );
  });
  return ComplexFormula.plus.apply(null, terms);
})();
