'use strict';

function RotationCounter(z) {
  this._z = z;
  this._k = 0;
}

function isPositive(x) {
  if (x > 0) {
    return true;
  }
  if (x < 0) {
    return false;
  }
  return (1 / x == +Infinity);
}

function deltaK(z1, z2) {
  if (z1 === undefined) {
    return 0;
  }
  var z1Upper = isPositive(z1.im());
  var z2Upper = isPositive(z2.im());
  if (z1Upper == z2Upper) {
    return 0;
  }
  var dz = z2.minus(z1);
  var dx = dz.re();
  var dy = dz.im();

  // Compute the signed area of the parallelogram spanned by z1 and
  // z2, i.e. their cross product, and use its sign to determine
  // whether the vector from z1 to z2 crosses the negative real axis.
  var area = z1.re() * z2.im() - z2.re() * z1.im();
  if (isPositive(area) == isPositive(dy)) {
    return 0;
  }
  return (z1Upper ? +1 : -1);
};

// Returns how many times the lines containing all previous updates
// have crossed the negative real axis, where crossing
// counterclockwise counts as +1 and crossing clockwise counts as -1.
RotationCounter.prototype.k = function() {
  return this._k;
};

RotationCounter.prototype.update = function(z) {
  this._k += deltaK(this._z, z);
  this._z = z;
};
