'use strict';

function Complex(re, im) {
  this._re = re;
  this._im = im;
}

Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);

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

Complex.prototype.equals = function(other) {
  return (this._re == other._re) && (this._im == other._im);
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

Complex.prototype.plus = function(other) {
  return new Complex(this._re + other._re, this._im + other._im);
};

Complex.prototype.minus = function(other) {
  return new Complex(this._re - other._re, this._im - other._im);
};

Complex.prototype.times = function(other) {
  return new Complex(this._re * other._re - this._im * other._im,
                     this._re * other._im + this._im * other._re);
};

Complex.prototype.div = function(other) {
  var d = other.absSq();
  return new Complex((this._re * other._re + this._im * other._im) / d,
                     (this._im * other._re - this._re * other._im) / d);
};
