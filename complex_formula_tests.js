describe('complex formula', function() {
  it('construction with no subformulas', function() {
    var f = new ComplexFormula(function(subresults) {
      return subresults[0].map(function(z) { return z.pow(2); });
    });
    var z = new Complex(3.1, 2.5);

    var results = f.update(z, z.conj(), 5);
    expect(results).toEqual([ z.pow(2), z.conj().pow(2), Complex.from(25) ]);
  });

  it('construction with subformulas', function() {
    var f1 = new ComplexFormula(function(subresults) {
      return subresults[0].map(function(z) { return z.pow(2); });
    });
    var f2 = new ComplexFormula(function(subresults) {
      return subresults[0].map(function(z) { return z.pow(3); });
    });
    var g = new ComplexFormula(function(subresults) {
      return subresults[0].map(function(_, i) {
        return subresults[0][i].plus(subresults[1][i]);
      });
    }, [ f1, f2 ]);
    var z = new Complex(3.1, 2.5);

    var results = g.update(z, z.conj(), 2);
    expect(results).toEqual([
      z.pow(2).plus(z.pow(3)),
      z.conj().pow(2).plus(z.conj().pow(3)),
      Complex.from(12)
    ]);
  });

  it('empty', function() {
    var f = ComplexFormula.empty;
    var results = f.update(1, 3, 5);
    expect(results).toEqual([]);
    var results = f.update();
    expect(results).toEqual([]);
  });

  it('constant', function() {
    var f = ComplexFormula.constant(5);
    var results = f.update(1, 3, 5);
    expect(results).toEqual([ Complex.from(5) ]);
    var results = f.update();
    expect(results).toEqual([ Complex.from(5) ]);
  });

  it('select', function() {
    for (var i = -2; i <= +2; ++i) {
      var f = ComplexFormula.select(i);

      var zs = [1, 3, 5];
      var results = f.update.apply(f, zs);
      var j = (i >= 0) ? i : (zs.length + i);
      expect(results).toEqual([ Complex.from(zs[j]) ]);
    }
  });
});
