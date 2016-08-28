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

// SimultaneousAnimation creates an animation that runs all its given
// animations simultaneously.
function SimultaneousAnimation(as) {
  this._as = as;
};

SimultaneousAnimation.prototype.run = function(time, doneCallback) {
  var waitCount = this._as.length;
  var eachDoneCallback = function() {
    --waitCount;
    if (waitCount <= 0) {
      if (doneCallback !== undefined) {
        doneCallback();
      }
    }
  };
  for (var i = 0; i < this._as.length; ++i) {
    this._as[i].run(time, eachDoneCallback);
  }
};

SimultaneousAnimation.prototype.invert = function() {
  return new SimultaneousAnimation(this._as.map(function(a) {
    return a.invert();
   }));
};

// SimultaneousAnimation creates an animation that runs its given
// animations one after the other.
function SequentialAnimation(as) {
  this._as = as;
};

SequentialAnimation.prototype.run = function(time, doneCallback) {
  var next = 0;
  var as = this._as;
  var runNext = function () {
    var i = next;
    ++next;
    if (i < as.length) {
      as[i].run(time / as.length, runNext);
      return;
    }
    if (doneCallback !== undefined) {
      doneCallback();
    }
  };
  runNext();
};

SequentialAnimation.prototype.invert = function() {
  return new SequentialAnimation(this._as.map(function(a) {
    return a.invert();
   }).slice().reverse());
};

function newCommutatorAnimation(a1, a2) {
  return new SequentialAnimation([a2, a1, a2.invert(), a1.invert()])
}

var _defaultSwapTh = Math.PI/12;

function SwapAnimation(p1, p2, th) {
  this._p1 = p1;
  this._p2 = p2;
  if (th === undefined) {
    th = _defaultSwapTh;
  }
  this._th = th;
}

SwapAnimation.prototype.run = function(time, doneCallback) {
  var x1 = this._p1.X();
  var y1 = this._p1.Y();
  var x2 = this._p2.X();
  var y2 = this._p2.Y();
  var a1 = new PathAnimation(this._p1, x1, y1, x2, y2, this._th);
  var a2 = new PathAnimation(this._p2, x2, y2, x1, y1, this._th);
  var a = new SimultaneousAnimation([a1, a2]);
  a.run(time, doneCallback);
};

SwapAnimation.prototype.invert = function() {
  return new SwapAnimation(this._p1, this._p2, -this._th);
};

function SwapElementAnimation(a, i1, i2, options) {
  this._a = a;
  this._i1 = i1;
  this._i2 = i2;
  options = options || {};
  this._startCallback = options.startCallback;
  this._swapCallback = options.swapCallback;
  var th = options.th;
  if (th === undefined) {
    th = _defaultSwapTh;
  }
  this._th = th;
}

SwapElementAnimation.prototype.run = function(time, doneCallback) {
  var a = this._a;
  var i1 = this._i1;
  var i2 = this._i2;
  var p1 = a[i1];
  var p2 = a[i2];
  var sa = new SwapAnimation(p1, p2, this._th);
  if (this._startCallback !== undefined) {
    this._startCallback();
  }
  var swapCallback = this._swapCallback;
  sa.run(time, function() {
    a[i1] = p2;
    a[i2] = p1;
    if (swapCallback !== undefined) {
      swapCallback();
    }
    if (doneCallback !== undefined) {
      doneCallback();
    }
  });
};

SwapElementAnimation.prototype.invert = function() {
  return new SwapElementAnimation(this._a, this._i1, this._i2, {
    startCallback: this._startCallback,
    swapCallback: this._swapCallback,
    th: -this._th
  });
};
