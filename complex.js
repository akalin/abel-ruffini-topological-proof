'use strict';

function Complex(re, im) {
  this._re = re;
  this._im = im;
}

Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);

Complex.from = function(o) {
  if (o instanceof Complex) {
    return o;
  }
  return new Complex(o, 0);
};

Complex.fromPolar = function(r, th) {
  return new Complex(r * Math.cos(th), r * Math.sin(th));
};

Complex.prototype.toString = function(radix) {
  var re = this._re.toString(radix);
  var im = this._im.toString(radix);
  return re + '+' + im + 'i';
};

Complex.prototype.re = function() {
  return this._re;
};

Complex.prototype.im = function() {
  return this._im;
};

Complex.equals = Complex.prototype.equals = function() {
  var first = this;
  var i = 0;
  if (!(first instanceof Complex)) {
    if (arguments.length === 0) {
      return true;
    }
    first = arguments[0];
    i = 1;
  }
  for (; i < arguments.length; ++i) {
    var other = Complex.from(arguments[i]);
    if ((first._re != other._re) || (first._im != other._im)) {
      return false;
    }
  }
  return true;
};

Complex.prototype.absSq = function() {
  return this._re*this._re + this._im*this._im;
};

Complex.prototype.abs = function() {
  return Math.sqrt(this.absSq());
};

// Returns Math.atan2(this.im(), this.re()).
Complex.prototype.arg = function() {
  return Math.atan2(this._im, this._re);
};

Complex.prototype.neg = function() {
  return new Complex(-this._re, -this._im);
};

Complex.prototype.conj = function() {
  return new Complex(this._re, -this._im);
};

Complex.plus = Complex.prototype.plus = function() {
  var re = 0;
  var im = 0;
  if (this instanceof Complex) {
    re = this._re;
    im = this._im;
  }
  for (var i = 0; i < arguments.length; ++i) {
    var other = Complex.from(arguments[i]);
    re += other._re;
    im += other._im;
  }
  return new Complex(re, im);
};

Complex.minus = Complex.prototype.minus = function() {
  var first = this;
  var i = 0;
  if (!(first instanceof Complex)) {
    if (arguments.length === 0) {
      return Complex.ZERO;
    }
    first = Complex.from(arguments[0]);
    i = 1;
  }
  var re = first._re;
  var im = first._im;
  for (; i < arguments.length; ++i) {
    var other = Complex.from(arguments[i]);
    re -= other._re;
    im -= other._im;
  }
  return new Complex(re, im);
};

Complex.times = Complex.prototype.times = function() {
  var re = 1;
  var im = 0;
  if (this instanceof Complex) {
    re = this._re;
    im = this._im;
  }
  for (var i = 0; i < arguments.length; ++i) {
    var other = Complex.from(arguments[i]);
    var prevRe = re;
    var prevIm = im;
    re = prevRe * other._re - prevIm * other._im
    im = prevRe * other._im + prevIm * other._re;
  }
  return new Complex(re, im);
};

Complex.div = Complex.prototype.div = function() {
  var first = this;
  var i = 0;
  if (!(first instanceof Complex)) {
    if (arguments.length === 0) {
      return Complex.ONE;
    }
    first = Complex.from(arguments[0]);
    i = 1;
  }
  var re = first._re;
  var im = first._im;
  for (; i < arguments.length; ++i) {
    var other = Complex.from(arguments[i]);
    var d = other.absSq();
    var prevRe = re;
    var prevIm = im;
    re = (prevRe * other._re + prevIm * other._im) / d;
    im = (prevIm * other._re - prevRe * other._im) / d;
  }
  return new Complex(re, im);
};

// Assumes p is a non-negative integer.
Complex.prototype.pow = function(p) {
  var r = Math.pow(this.absSq(), 0.5*p);
  var th = this.arg() * p;
  return Complex.fromPolar(r, th);
};

// Returns the kth pth root. That is, if the polar form of this is (r,
// th=this.arg()), this returns (root(r, p), (th + 2*pi*k)/p) in polar
// form.
Complex.prototype.root = function(p, k) {
  var r = Math.pow(this.absSq(), 0.5/p);
  if (k === undefined) {
    k = 0;
  }
  var th = (this.arg() + 2 * Math.PI * k) / p;
  return Complex.fromPolar(r, th);
};
