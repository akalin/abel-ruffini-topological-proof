'use strict';

function complexToCoords(z) {
  return [z.re(), z.im()];
}

function pointToComplex(p) {
  return new Complex(p.X(), p.Y());
}

function getContainingBox(zs) {
  var minX = 0;
  var minY = 0;
  var maxX = 0;
  var maxY = 0;

  for (var i = 0; i < zs.length; ++i) {
    minX = Math.min(minX, zs[i].re());
    minY = Math.min(minY, zs[i].im());
    maxX = Math.max(maxX, zs[i].re());
    maxY = Math.max(maxY, zs[i].im());
  }

  var maxX = Math.max(Math.abs(minX), Math.abs(maxX));
  var maxY = Math.max(Math.abs(minY), Math.abs(maxY));
  var maxV = Math.max(Math.max(maxX, maxY), 1e-5);
  var fudgeFactor = 2;

  maxV *= fudgeFactor;

  return [-maxV, maxV, maxV, -maxV];
}

function Display(rootBoardDivID, coeffBoardDivID, formulaBoardDivID,
                 initialRoots, formula) {
  var boardOptions = {
    axis: true,
    showCopyright: false,
    animationDelay: 10,
  };
  this._rootBoard = JXG.JSXGraph.initBoard(rootBoardDivID, boardOptions);
  this._rootBoard.suspendUpdate();

  this._rootPointsBySubscript = initialRoots.map((function(r, i) {
    return this._rootBoard.create('point', complexToCoords(r), {
      name: 'r_{' + (i+1) + '}',
      size: 0.5,
    });
  }).bind(this));
  this._rootPoints = this._rootPointsBySubscript.slice();
  // Both arrays below are indexed by subscript.
  this._rootTracePoints = [];
  this._rootTraceCurves = [];

  this._rootBoard.unsuspendUpdate();

  this._rootBoard.setBoundingBox(getContainingBox(initialRoots), true);

  this._coeffBoard = JXG.JSXGraph.initBoard(coeffBoardDivID, boardOptions);
  this._coeffBoard.suspendUpdate();

  var nameArray = 'abcdefghijklmnopqrstuvwxyz';

  var coeffs = rootsToCoefficients(initialRoots);
  this._coeffPoints = coeffs.slice(0, coeffs.length).map((function(a, i) {
    return this._coeffBoard.create('point', complexToCoords(a), {
      name: nameArray[coeffs.length - i - 1],
      size: 0.5,
      fixed: true,
    });
  }).bind(this));
  this._coeffTracePoints = [];
  this._coeffTraceCurves = [];

  this._coeffBoard.unsuspendUpdate();

  this._coeffBoard.setBoundingBox(getContainingBox(coeffs), true);

  this._formulaBoard = JXG.JSXGraph.initBoard(formulaBoardDivID, boardOptions);

  this.setFormula(formula);

  this._rootBoard.on('update', Display.prototype._onRootUpdate.bind(this));
}

Display.prototype._updateFormula = function(coeffs) {
  return this._formula.update.apply(this._formula, coeffs);
};

Display.prototype._onRootUpdate = function() {
  this._rootBoard.suspendUpdate();

  var roots = this._rootPointsBySubscript.map(function(p) {
    return pointToComplex(p);
  });

  for (var i = 0; i < this._rootTracePoints.length; ++i) {
    var points = this._rootTracePoints[i];
    if (points !== undefined) {
      var p = this._rootPointsBySubscript[i];
      points.x.push(p.X());
      points.y.push(p.Y());
    }
  }

  this._rootBoard.unsuspendUpdate();

  this._coeffBoard.suspendUpdate();

  var coeffs = rootsToCoefficients(roots);
  for (var i = 0; i < coeffs.length; ++i) {
    var coords = complexToCoords(coeffs[i]);
    this._coeffPoints[i].moveTo(coords);
    var points = this._coeffTracePoints[i];
    if (points !== undefined) {
      points.x.push(coords[0]);
      points.y.push(coords[1]);
    }
  }

  this._coeffBoard.unsuspendUpdate();

  this._formulaBoard.suspendUpdate();

  var results = this._updateFormula(coeffs);
  for (var i = 0; i < results.length; ++i) {
    var coords = complexToCoords(results[i]);
    this._resultPointsBySubscript[i].moveTo(coords);
    var points = this._resultTracePoints[i];
    if (points !== undefined) {
      points.x.push(coords[0]);
      points.y.push(coords[1]);
    }
  }

  this._formulaBoard.unsuspendUpdate();
};

Display.prototype.swapRootOp = function(i, j, swapCallback) {
  return new SwapElementAnimation(this._rootPoints, i, j, {
    swapCallback: swapCallback
  });
};

Display.prototype._enableTrace = function(points, tracePoints, traceCurves, i) {
  if (tracePoints[i] !== undefined) {
    return;
  }

  var p = points[i];

  var tps = {
    x: [p.X()],
    y: [p.Y()]
  }
  var c = p.board.create('curve', [tps.x, tps.y], { curveType: 'plot' });
  c.hasPoint = function () { return false; }

  tracePoints[i] = tps;
  traceCurves[i] = c;
};

Display.prototype._disableTrace = function(tracePoints, traceCurves, i) {
  if (tracePoints[i] === undefined) {
    return;
  }

  tracePoints[i] = undefined;
  traceCurves[i].board.removeObject(traceCurves[i]);
  traceCurves[i] = undefined;
};

Display.prototype.enableTraceRoot = function(i) {
  return this._enableTrace(
    this._rootPointsBySubscript, this._rootTracePoints,
    this._rootTraceCurves, i);
};

Display.prototype.enableTraceCoeff = function(i) {
  return this._enableTrace(
    this._coeffPoints, this._coeffTracePoints, this._coeffTraceCurves, i);
};

Display.prototype.enableTraceResult = function(i) {
  return this._enableTrace(
    this._resultPointsBySubscript, this._resultTracePoints,
    this._resultTraceCurves, i);
};

Display.prototype.disableTraceRoot = function(i) {
  return this._disableTrace(this._rootTracePoints, this._rootTraceCurves, i);
};

Display.prototype.disableTraceCoeff = function(i) {
  return this._disableTrace(this._coeffTracePoints, this._coeffTraceCurves, i);
};

Display.prototype.disableTraceResult = function(i) {
  return this._disableTrace(
    this._resultTracePoints, this._resultTraceCurves, i);
};

Display.prototype.setRootsFixed = function(newFixed) {
  var oldFixed = this._rootPoints[0].getAttribute('fixed');

  this._rootBoard.suspendUpdate();

  for (var i = 0; i < this._rootPoints.length; ++i) {
    this._rootPoints[i].setAttribute({ fixed: newFixed });
  }

  this._rootBoard.unsuspendUpdate();

  return oldFixed;
};

Display.prototype.setFormula = function(formula) {
  this._formulaBoard.suspendUpdate();

  if (this._resultPointsBySubscript !== undefined) {
    for (var i = 0; i < this._resultPointsBySubscript.length; ++i) {
      this._formulaBoard.removeObject(this._resultPointsBySubscript[i]);
      this.disableTraceResult(i);
    }
  }

  this._formula = formula;

  var coeffs = this._coeffPoints.map(function(p) {
    return new Complex(p.X(), p.Y());
  });

  var results = this._updateFormula(coeffs);
  this._resultPointsBySubscript = results.map((function(s, i) {
    return this._formulaBoard.create('point', complexToCoords(s), {
      name: 'x_{' + (i+1) + '}',
      size: 0.5,
      fixed: true,
    });
  }).bind(this));
  this._resultPoints = this._resultPointsBySubscript.slice();
  // Both arrays below are indexed by subscript.
  this._resultTracePoints = [];
  this._resultTraceCurves = [];

  this._formulaBoard.unsuspendUpdate();

  this._formulaBoard.setBoundingBox(getContainingBox(results), true);

  return results.length;
};
