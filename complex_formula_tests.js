describe('complex formula', function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toBeCloseToComplex: toBeCloseToComplexFactory,
      toBeCloseToComplexArray: toBeCloseToComplexArrayFactory
    });
  });

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

  it('neg', function() {
    var f = ComplexFormula.select(1).neg();
    var results = f.update(1, 3, 5);
    expect(results).toEqual([ Complex.from(3).neg() ]);
  });

  it('neg empty', function() {
    var f = ComplexFormula.empty.neg();
    var results = f.update(1, 3, 5);
    expect(results).toEqual([]);
  });

  it('conj', function() {
    var f = ComplexFormula.select(1).conj();
    var results = f.update(1, new Complex(1, 2), 5);
    expect(results).toEqual([ new Complex(1, -2) ]);
  });

  it('conj empty', function() {
    var f = ComplexFormula.empty.conj();
    var results = f.update(1, 3, 5);
    expect(results).toEqual([]);
  });

  it('pow', function() {
    var f = ComplexFormula.select(1).pow(3);
    var z = new Complex(1, 2);
    var results = f.update(1, z, 5);
    expect(results).toEqual([ z.pow(3) ]);
  });

  it('pow empty', function() {
    var f = ComplexFormula.empty.pow(3);
    var z = new Complex(1, 2);
    var results = f.update(1, z, 5);
    expect(results).toEqual([]);
  });

  it('root', function() {
    var f = ComplexFormula.select(0).root(2);

    var results = f.update(Complex.ONE);
    expect(results).toBeCloseToComplexArray([ Complex.ONE, Complex.ONE.neg() ]);

    results = f.update(Complex.ONE.neg());
    expect(results).toBeCloseToComplexArray([ Complex.I, Complex.I.neg() ]);

    results = f.update(Complex.ONE);
    expect(results).toBeCloseToComplexArray([ Complex.ONE.neg(), Complex.ONE ]);

    results = f.update(Complex.ONE.neg());
    expect(results).toBeCloseToComplexArray([ Complex.I.neg(), Complex.I ]);

    results = f.update(Complex.ONE);
    expect(results).toBeCloseToComplexArray([ Complex.ONE, Complex.ONE.neg() ]);
  });

  it('root empty', function() {
    var f = ComplexFormula.empty.root(2);

    var results = f.update(1, 3);
    expect(results).toEqual([]);
  });

  it('from', function() {
    var re = 3.1;

    var f = ComplexFormula.from(re);
    var results = f.update(1.4);
    expect(results).toEqual([ Complex.from(3.1) ]);

    var z = new Complex(1.4, 2.5);
    f = ComplexFormula.from(z);
    results = f.update(1.4, 3.1);
    expect(results).toEqual([ z ]);

    f = ComplexFormula.from(f);
    results = f.update(1.4, 3.1);
    expect(results).toEqual([ z ]);
  });

  it('plus', function() {
    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    var f = a.plus(b);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(4) ]);
  });

  it('plus empty', function() {
    var a = ComplexFormula.empty;
    var f = a.plus(a);

    var results = f.update(4, 9);
    expect(results).toEqual([]);
  });

  it('plus multivalent', function() {
    var a = ComplexFormula.select(0).root(2);
    var b = ComplexFormula.select(1).root(2);
    var f = a.plus(b);

    var results = f.update(4, 9);
    expect(results).toBeCloseToComplexArray([
      Complex.from(5), Complex.from(-5)
    ]);
  });

  it('plus multiple arguments', function() {
    var f = ComplexFormula.plus;

    var results = f().update(1, 3);
    expect(results).toEqual([]);

    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    f = a.plus(b, a, b);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(8) ]);
  });

  it('minus', function() {
    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    var f = a.minus(b);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(-2) ]);
  });

  it('minus empty', function() {
    var a = ComplexFormula.empty;
    var f = a.minus(a);

    var results = f.update(4, 9);
    expect(results).toEqual([]);
  });

  it('minus multivalent', function() {
    var a = ComplexFormula.select(0).root(2);
    var b = ComplexFormula.select(1).root(2);
    var f = a.minus(b);

    var results = f.update(4, 9);
    expect(results).toBeCloseToComplexArray([
      Complex.from(-1), Complex.from(+1)
    ]);
  });

  it('minus multiple arguments', function() {
    var f = ComplexFormula.minus;

    var results = f().update(1, 3);
    expect(results).toEqual([]);

    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    f = a.minus(b, a);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(-3) ]);
  });

  it('times', function() {
    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    var f = a.times(b);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(3) ]);
  });

  it('times empty', function() {
    var a = ComplexFormula.empty;
    var f = a.times(a);

    var results = f.update(4, 9);
    expect(results).toEqual([]);
  });

  it('times multivalent', function() {
    var a = ComplexFormula.select(0).root(2);
    var b = ComplexFormula.select(1).root(2);
    var f = a.times(b);

    var results = f.update(4, 9);
    expect(results).toBeCloseToComplexArray([
      Complex.from(6), Complex.from(6)
    ]);
  });

  it('times multiple arguments', function() {
    var f = ComplexFormula.times;

    var results = f().update(1, 3);
    expect(results).toEqual([]);

    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    f = a.times(b, a);

    var results = f.update(2, 3);
    expect(results).toEqual([ Complex.from(12) ]);
  });

  it('div', function() {
    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    var f = a.div(b);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(1/3) ]);
  });

  it('div empty', function() {
    var a = ComplexFormula.empty;
    var f = a.div(a);

    var results = f.update(4, 9);
    expect(results).toEqual([]);
  });

  it('div multivalent', function() {
    var a = ComplexFormula.select(0).root(2);
    var b = ComplexFormula.select(1).root(2);
    var f = a.div(b);

    var results = f.update(4, 9);
    expect(results).toBeCloseToComplexArray([
      Complex.from(2/3), Complex.from(2/3)
    ]);
  });

  it('div multiple arguments', function() {
    var f = ComplexFormula.div;

    var results = f().update(1, 3);
    expect(results).toEqual([]);

    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    f = a.div(b, a);

    var results = f.update(2, 3);
    expect(results).toEqual([ Complex.from(1/3) ]);
  });

  it('plusAll', function() {
    var a = ComplexFormula.select(0).root(2);
    var b = ComplexFormula.select(1).root(4);
    var f = a.plusAll(b);

    var results = f.update(1, 16);
    expect(results).toBeCloseToComplexArray([
      new Complex(3, 0),
      new Complex(1, 0),
      new Complex(1, 2),
      new Complex(-1, 2),
      new Complex(-1, 0),
      new Complex(-3, 0),
      new Complex(1, -2),
      new Complex(-1, -2)
    ]);
  });

  it('plusAll empty', function() {
    var a = ComplexFormula.empty;
    var f = a.plusAll(a);

    var results = f.update(4, 9);
    expect(results).toEqual([]);
  });

  it('plusAll univalent', function() {
    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    var f = a.plusAll(b);

    var results = f.update(2, 3);
    expect(results).toBeCloseToComplexArray([ Complex.from(5) ]);
  });

  it('plusAll multiple arguments', function() {
    var f = ComplexFormula.plusAll;

    var results = f().update(1, 3);
    expect(results).toEqual([]);

    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    f = a.plusAll(b, a, b);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(8) ]);
  });

  it('minusAll', function() {
    var a = ComplexFormula.select(0).root(2);
    var b = ComplexFormula.select(1).root(4);
    var f = a.minusAll(b);

    var results = f.update(1, 16);
    expect(results).toBeCloseToComplexArray([
      new Complex(-1, 0),
      new Complex(-3, 0),
      new Complex(1, -2),
      new Complex(-1, -2),
      new Complex(3, 0),
      new Complex(1, 0),
      new Complex(1, 2),
      new Complex(-1, 2)
    ]);
  });

  it('minusAll empty', function() {
    var a = ComplexFormula.empty;
    var f = a.minusAll(a);

    var results = f.update(4, 9);
    expect(results).toEqual([]);
  });

  it('minusAll univalent', function() {
    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    var f = a.minusAll(b);

    var results = f.update(2, 3);
    expect(results).toBeCloseToComplexArray([ Complex.from(-1) ]);
  });

  it('minusAll multiple arguments', function() {
    var f = ComplexFormula.minusAll;

    var results = f().update(1, 3);
    expect(results).toEqual([]);

    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    f = a.minusAll(b, a);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(-3) ]);
  });

  it('timesAll', function() {
    var a = ComplexFormula.select(0).root(2);
    var b = ComplexFormula.select(1).root(4);
    var f = a.timesAll(b);

    var results = f.update(1, 16);
    expect(results).toBeCloseToComplexArray([
      new Complex(2, 0),
      new Complex(-2, 0),
      new Complex(0, 2),
      new Complex(0, -2),
      new Complex(-2, 0),
      new Complex(2, 0),
      new Complex(0, -2),
      new Complex(0, 2)
    ]);
  });

  it('timesAll empty', function() {
    var a = ComplexFormula.empty;
    var f = a.timesAll(a);

    var results = f.update(4, 9);
    expect(results).toEqual([]);
  });

  it('timesAll univalent', function() {
    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    var f = a.timesAll(b);

    var results = f.update(2, 3);
    expect(results).toBeCloseToComplexArray([ Complex.from(6) ]);
  });

  it('timesAll multiple arguments', function() {
    var f = ComplexFormula.timesAll;

    var results = f().update(1, 3);
    expect(results).toEqual([]);

    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    f = a.timesAll(b, a);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(3) ]);
  });

  it('divAll', function() {
    var a = ComplexFormula.select(0).root(2);
    var b = ComplexFormula.select(1).root(4);
    var f = a.divAll(b);

    var results = f.update(1, 16);
    expect(results).toBeCloseToComplexArray([
      new Complex(1/2, 0),
      new Complex(-1/2, 0),
      new Complex(0, -1/2),
      new Complex(0, 1/2),
      new Complex(-1/2, 0),
      new Complex(1/2, 0),
      new Complex(0, 1/2),
      new Complex(0, -1/2)
    ]);
  });

  it('divAll empty', function() {
    var a = ComplexFormula.empty;
    var f = a.divAll(a);

    var results = f.update(4, 9);
    expect(results).toEqual([]);
  });

  it('divAll univalent', function() {
    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    var f = a.divAll(b);

    var results = f.update(2, 3);
    expect(results).toBeCloseToComplexArray([ Complex.from(2/3) ]);
  });

  it('divAll multiple arguments', function() {
    var f = ComplexFormula.divAll;

    var results = f().update(1, 3);
    expect(results).toEqual([]);

    var a = ComplexFormula.select(0);
    var b = ComplexFormula.select(1);
    f = a.divAll(b, a);

    var results = f.update(1, 3);
    expect(results).toEqual([ Complex.from(1/3) ]);
  });
});
