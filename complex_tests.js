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
});
