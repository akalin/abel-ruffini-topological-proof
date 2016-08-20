'use strict';

describe('quintic discriminant', function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toBeCloseToComplexArray: toBeCloseToComplexArrayFactory
    });
  });

  it('basic', function() {
    var a = new Complex(-1, 1);
    var b = new Complex(2, 0);
    var c = new Complex(0, 3);
    var d = new Complex(4, 4);
    var e = new Complex(1, 0);
    var f = new Complex(0, 1);

    var results = quinticDiscFormula.update(a, b, c, d, e, f);
    // Computed via Mathematica.
    var expectedZ = new Complex(780124, 76980);
    expect(results).toBeCloseToComplexArray([expectedZ]);
  });
});
