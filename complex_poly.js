'use strict';

// Returns the sum of the pth powers of every complex number in xs.
// p must be a non-negative integer.
function powerSum(xs, p) {
  var sum = Complex.ZERO;
  for (var i = 0; i < xs.length; ++i) {
    var xPowP = Complex.ONE;
    for (var j = 0; j < p; ++j) {
      xPowP = xPowP.times(xs[i]);
    }
    sum = sum.plus(xPowP);
  }
  return sum;
}

// Given a list of k complex numbers xs, returns [ e_0(xs), e_1(xs),
// ..., e_k(xs) ], where e_k is the kth elementary symmetric
// polynomial, using Newton's identities:
// https://en.wikipedia.org/wiki/Newton%27s_identities .
function evaluateElementarySymmetricPolynomials(xs) {
  var ps = [];
  for (var i = 0; i <= xs.length; ++i) {
    ps.push(powerSum(xs, i));
  }

  var es = [Complex.ONE];
  for (var i = 1; i <= xs.length; ++i) {
    var e = Complex.ZERO;
    for (var j = 1; j <= i; ++j) {
      var t = es[i-j].times(ps[j]);
      if (j % 2 == 0) {
        t = t.neg();
      }
      e = e.plus(t)
    }
    e = e.div(new Complex(i, 0));
    es.push(e);
  }
  return es;
}

// Given a list of k complex roots rs, returns [ a_0(rs), a_1(xs),
// ..., a_{k-1}(xs), a_k(xs) = 1 ], where a_0 + a_1 x + a_2 x^2 +
// ... a_{k-1} x^{k-1} + x^k is the polynomial with roots rs.
function rootsToCoefficients(rs) {
  var es = evaluateElementarySymmetricPolynomials(rs);
  var as = [];
  for (var i = 0; i <= rs.length; ++i) {
    var a = es[rs.length-i];
    if ((rs.length + i) % 2 == 1) {
      a = a.neg();
    }
    as.push(a);
  }
  return as;
}
