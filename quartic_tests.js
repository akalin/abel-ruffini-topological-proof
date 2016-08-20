'use strict';

describe('quartic formula', function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toBeCloseToComplex: toBeCloseToComplexFactory,
      toBeCloseToComplexArray: toBeCloseToComplexArrayFactory
    });
  });

  it('basic', function() {
    var rs = [
      new Complex(-1, 1),
      new Complex(-3, 0),
      new Complex(1, 0),
      new Complex(0, 2),
    ];

    var as = rootsToCoefficients(rs);
    var f = newQuarticFormula();
    var results = f.update.apply(f, as);
    expect(results).toBeCloseToComplexArray(rs);
  });

  it('path', function() {
    var r0 = new Complex(-1, 1);
    var r1 = new Complex(-3, 0);
    var r2 = new Complex(1, 0);
    var r3 = new Complex(0, 2);

    var lerp = function(a, b, t) {
      return a.plus(b.minus(a).times(t));
    };

    var f = newQuarticFormula();
    var rs;
    for (var t = 0; t <= 1.0; t += 0.1) {
      rs = [
        lerp(r0, r1, t), lerp(r1, r2, t), lerp(r2, r3, t), lerp(r3, r0, t)
      ];
      var as = rootsToCoefficients(rs);
      var results = f.update.apply(f, as);
      expect(results).toBeCloseToComplexArray(rs);
    }

    expect(rs).toBeCloseToComplexArray([ r1, r2, r3, r0 ]);
  });
});
