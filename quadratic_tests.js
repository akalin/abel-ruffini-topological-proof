'use strict';

describe('quadratic formula', function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toBeCloseToComplex: toBeCloseToComplexFactory,
      toBeCloseToComplexArray: toBeCloseToComplexArrayFactory
    });
  });

  it('basic', function() {
    var rs = [
      new Complex(1, 0),
      new Complex(0, 2),
    ];

    var as = rootsToCoefficients(rs);
    var f = newQuadraticFormula();
    var results = f.update.apply(f, as);
    expect(results).toBeCloseToComplexArray(rs);
  });

  it('path', function() {
    var r0 = new Complex(1, 0);
    var r1 = new Complex(0, 2);
    var r0Mid = new Complex(1, 1);
    var r1Mid = new Complex(0, 1);

    var lerp = function(a, b, t) {
      return a.plus(b.minus(a).times(t));
    };

    var f = newQuadraticFormula();
    var rs;
    for (var t = 0; t <= 1.0; t += 0.1) {
      rs = [
        (t <= 0.5) ? lerp(r0, r0Mid, 2*t) : lerp(r0Mid, r1, 2*(t - 0.5)),
        (t <= 0.5) ? lerp(r1, r1Mid, 2*t) : lerp(r1Mid, r0, 2*(t - 0.5)),
      ];
      var as = rootsToCoefficients(rs);
      var results = f.update.apply(f, as);
      expect(results).toBeCloseToComplexArray(rs);
    }

    expect(rs).toBeCloseToComplexArray([ r1, r0 ]);
  });
});
