'use strict';

var toBeCloseToComplexFactory = function(util, customEqualityTesters) {
  return {
    compare: function(actual, expected, precision) {
      if (precision !== 0) {
        precision = precision || 2;
      }

      return {
        pass: expected.minus(actual).abs() < (Math.pow(10, -precision) / 2)
      };
    }
  };
};

describe('complex', function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toBeCloseToComplex: toBeCloseToComplexFactory
    });
  });

  it('construction and accessors', function() {
    var re = 3.1;
    var im = 2.5;
    var z = new Complex(re, im);

    expect(z.re()).toBe(re);
    expect(z.im()).toBe(im);
  });

  it('from', function() {
    var re = 3.1;
    var z1 = Complex.from(re);
    expect(z1).toEqual(new Complex(re, 0));
    var z2 = Complex.from(z1);
    expect(z2).toEqual(z1);
  });

  it('fromPolar', function() {
    var r = 2;
    var th = Math.PI / 3;
    var z = Complex.fromPolar(r, th);

    expect(z).toEqual(new Complex(r * Math.cos(th), r * Math.sin(th)));
  });

  it('toString', function() {
    var re = 3.1;
    var im = 2.5;
    var z = new Complex(re, im);

    expect(z.toString()).toBe(re.toString() + '+' + im.toString() + 'i');
    expect(z.toString(8)).toBe(re.toString(8) + '+' + im.toString(8) + 'i');
  });

  it('equals', function() {
    var z1 = new Complex(3.1, 2.5);
    var z2 = new Complex(3.1, 4.6);
    var z3 = new Complex(6.7, 4.6);

    expect(z1.equals(z1)).toBe(true);
    expect(z1.equals(z2)).toBe(false);
    expect(z1.equals(z3)).toBe(false);
    expect(z2.equals(z1)).toBe(false);
    expect(z2.equals(z2)).toBe(true);
    expect(z2.equals(z3)).toBe(false);
    expect(z3.equals(z1)).toBe(false);
    expect(z3.equals(z2)).toBe(false);
    expect(z3.equals(z3)).toBe(true);
  });

  it('equals number', function() {
    var z1 = new Complex(3.1, 2.5);
    var z2 = new Complex(3.1, 0);
    var r = 3.1;

    expect(z1.equals(r)).toBe(false);
    expect(z2.equals(r)).toBe(true);
  });

  it('equals multiple arguments', function() {
    var z1 = new Complex(3.1, 2.5);
    var z2 = new Complex(3.1, 0);
    var r = 3.1;

    expect(z1.equals()).toBe(true);
    expect(z1.equals(z1, z1)).toBe(true);
    expect(z2.equals(r, z1)).toBe(false);
    expect(z2.equals(z1, r)).toBe(false);
  });

  it('abs and absSq', function() {
    var z = new Complex(3, 4);

    expect(z.absSq()).toBe(25);
    expect(z.abs()).toBe(5);
  });

  it('arg', function() {
    var re = 0.5;
    var im = Math.sqrt(3)*0.5;
    var z1 = new Complex(re, im);
    var z2 = new Complex(-re, im);
    var z3 = new Complex(re, -im);
    var z4 = new Complex(-re, -im);
    var th = Math.PI/3;

    expect(z1.arg()).toBeCloseTo(th);
    expect(z2.arg()).toBeCloseTo(2*th);
    expect(z3.arg()).toBeCloseTo(-th);
    expect(z4.arg()).toBeCloseTo(-2*th);
  });

  it('neg and conj', function() {
    var re = 2.5;
    var im = 3.1;
    var z = new Complex(re, im);

    expect(z.neg()).toEqual(new Complex(-re, -im));
    expect(z.conj()).toEqual(new Complex(re, -im));
  });

  it('plus and minus', function() {
    var re1 = 2.5;
    var im1 = 3.1;
    var re2 = 4.6;
    var im2 = 6.1;
    var z1 = new Complex(re1, im1);
    var z2 = new Complex(re2, im2);

    expect(z1.plus(z2)).toEqual(new Complex(re1+re2, im1+im2));
    expect(z1.minus(z2)).toEqual(new Complex(re1-re2, im1-im2));
  });

  it('plus and minus number', function() {
    var re1 = 2.5;
    var im1 = 3.1;
    var re2 = 4.6;
    var z1 = new Complex(re1, im1);

    expect(z1.plus(re2)).toEqual(new Complex(re1+re2, im1));
    expect(z1.minus(re2)).toEqual(new Complex(re1-re2, im1));
  });

  it('plus and minus multiple arguments', function() {
    var re1 = 2.5;
    var im1 = 3.1;
    var re2 = 4.6;
    var z1 = new Complex(re1, im1);

    expect(z1.plus()).toEqual(z1);
    expect(z1.minus()).toEqual(z1);

    expect(z1.plus(z1, re2)).toEqual(z1.plus(z1).plus(re2));
    expect(z1.minus(z1, re2)).toEqual(z1.minus(z1).minus(re2));
  });

  it('times', function() {
    var re1 = 2.5;
    var im1 = 3.1;
    var re2 = -4.6;
    var im2 = 6.1;
    var z1 = new Complex(re1, im1);
    var z2 = new Complex(re2, im2);

    expect(z1.times(z2)).toEqual(new Complex(re1*re2-im1*im2, re1*im2+re2*im1));
    expect(z1.times(z1.conj())).toEqual(new Complex(re1*re1+im1*im1, 0));
  });

  it('times number', function() {
    var re1 = 2.5;
    var im1 = 3.1;
    var re2 = -4.6;
    var z1 = new Complex(re1, im1);

    expect(z1.times(re2)).toEqual(new Complex(re1*re2, im1*re2));
  });

  it('times multiple arguments', function() {
    var re1 = 2.5;
    var im1 = 3.1;
    var re2 = -4.6;
    var im2 = 6.1;
    var z1 = new Complex(re1, im1);
    var z2 = new Complex(re2, im2);

    expect(z1.times()).toEqual(z1);
    expect(z1.times(z2, z1)).toEqual(z1.times(z2).times(z1));
  });

  it('div', function() {
    var re1 = 2.5;
    var im1 = 3.1;
    var re2 = -4.6;
    var im2 = 6.1;
    var z1 = new Complex(re1, im1);
    var z2 = new Complex(re2, im2);

    var q1 = z1.div(z2);
    var q2 = z1.times(z2.conj());
    expect(q1).toBeCloseToComplex(q2.div(new Complex(z2.absSq(), 0)));
  });

  it('div number', function() {
    var re1 = 2.5;
    var im1 = 3.1;
    var re2 = -4.6;
    var z1 = new Complex(re1, im1);

    expect(z1.div(re2)).toEqual(new Complex(re1 / re2, im1 / re2));
  });

  it('div multiple arguments', function() {
    var re1 = 2.5;
    var im1 = 3.1;
    var re2 = -4.6;
    var im2 = 6.1;
    var z1 = new Complex(re1, im1);
    var z2 = new Complex(re2, im2);

    expect(z1.div()).toEqual(z1);
    expect(z1.div(z2, z1)).toEqual(z1.div(z2).div(z1));
  });

  it('root', function() {
    var re = 0.5;
    var im = Math.sqrt(3)*0.5;
    var z1 = new Complex(-4 * re, 4 * im);
    var z2 = new Complex(2 * re, 2 * im);
    var z1Sqrt1 = z1.root(2);
    var z1Sqrt2 = z1.root(2, 1);

    expect(z1Sqrt1).toBeCloseToComplex(z2);
    expect(z1Sqrt1.absSq()).toBeCloseTo(z1.abs());
    expect(z1Sqrt1.arg()).toBeCloseTo(z1.arg()/2);

    expect(z1Sqrt2).toBeCloseToComplex(z2.neg());
    expect(z1Sqrt2.absSq()).toBeCloseTo(z1.abs());
    expect(z1Sqrt2.arg()).toBeCloseTo(z1.arg()/2 - Math.PI);
  });
});
