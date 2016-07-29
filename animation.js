'use strict';

// TODO: Ideally, we'd decouple the calculation of the path from
// animating the path.

// PathAnimation creates an animation for p that goes from (x1, y1) to
// (x2, y2) with an approximation deviation to the right of the given
// angle th.
function PathAnimation(p, x1, y1, x2, y2, th) {
  this._p = p;
  this._x1 = x1;
  this._y1 = y1;
  this._x2 = x2;
  this._y2 = y2;
  this._th = th;
}

PathAnimation.prototype.run = function(time, doneCallback) {
  var x1 = this._x1;
  var y1 = this._y1;
  var x2 = this._x2;
  var y2 = this._y2;

  var xm = (x1 + x2) / 2;
  var ym = (y1 + y2) / 2;

  var dx = x2 - x1;
  var dy = y2 - y1;
  var ds = Math.sqrt(dx*dx + dy*dy);

  var deviation = 0.5 * Math.tan(this._th);
  var xDev = dy*deviation;
  var yDev = -dx*deviation;

  var ps = [[x1, y1], [xm + xDev, ym + yDev], [x2, y2]];
  this._p.moveAlong(ps, time, { callback: doneCallback });
};

PathAnimation.prototype.invert = function() {
  return new PathAnimation(
    this._p, this._x2, this._y2, this._x1, this._y1, -this._th);
};

