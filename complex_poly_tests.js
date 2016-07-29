'use strict';

describe('complex polynomials', function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toBeCloseToComplex: toBeCloseToComplexFactory
    });
  });

  it('rootsToCoefficients roots of unity', function() {
    var p = 10;
    var rs = [];
    for (var i = 0; i < p; ++i) {
      rs.push(Complex.ONE.root(p, i));
    }
    var as = rootsToCoefficients(rs);

    expect(as[0]).toBeCloseToComplex(new Complex(-1, 0));

    for (var i = 1; i < p; ++i) {
      expect(as[i]).toBeCloseToComplex(Complex.ZERO);
    }
  });

  it('rootsToCoefficients binomial coefficients', function() {
    var p = 5;
    var rs = [];
    for (var i = 0; i < p; ++i) {
      rs.push(Complex.ONE);
    }
    var as = rootsToCoefficients(rs);

    var one = Complex.ONE;
    var five = new Complex(5, 0);
    var ten = new Complex(10, 0);
    expect(as).toEqual([one.neg(), five, ten.neg(), ten, five.neg(), one]);
  });
});
