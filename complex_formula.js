'use strict';

// f should be a function that takes an array of arrays of Complex
// objects and returns an array of complex objects. If subformulas is
// falsy or empty, then when update is called, f will be passed an
// array of a single array containing the arguments of update
// converted to Complex objects. Otherwise, f will be passed the array
// of subresults from calling the subformulas with the arguments of
// update.
function ComplexFormula(f, subformulas) {
  this._f = f;
  this._subformulas = subformulas || [];
}

// This function takes in any number of objects and returns an array
// of Complex objects.
ComplexFormula.prototype.update = function() {
  // Use a for loop as anything more clever prevents this use of
  // arguments from being optimized out.
  var inputs = [];
  for (var i = 0; i < arguments.length; ++i) {
    inputs.push(Complex.from(arguments[i]));
  };
  if (this._subformulas.length === 0) {
    return this._f([inputs]);
  }
  var subresults = this._subformulas.map(function(subformula) {
    return subformula.update.apply(subformula, inputs);
  });
  return this._f(subresults);
};

ComplexFormula.empty = new ComplexFormula(function() {
  return [];
});

ComplexFormula.constant = function(o) {
  var z = Complex.from(o);
  return new ComplexFormula(function() {
    return [ z ];
  });
};

ComplexFormula.select = function(i) {
  return new ComplexFormula(function(subresults) {
    if (i < 0) {
      i = subresults[0].length + i;
    }
    return [ subresults[0][i] ];
  });
};

ComplexFormula.prototype._unaryOp = function(op) {
  return new ComplexFormula(function(subresults) {
    return subresults[0].map(function(x) { return op(x); });
  }, [ this ]);
};

ComplexFormula.prototype.neg = function() {
  return this._unaryOp(function(z) {
    return z.neg();
  });
};

ComplexFormula.prototype.conj = function() {
  return this._unaryOp(function(z) {
    return z.conj();
  });
};

ComplexFormula.prototype.pow = function(p) {
  return this._unaryOp(function(z) {
    return z.pow(p);
  });
};

// The returned formula returns an array of all p pth roots of all its
// arguments. Furthermore, as the formula is updated with new
// arguments that go around the origin, the returned roots remain in a
// stable order and vary continuously with respect to the input,
// assuming that the arguments don't go through zero.
ComplexFormula.prototype.root = function(p) {
  var rotationCounters;
  return new ComplexFormula(function(subresults) {
    var zs = subresults[0];
    if (rotationCounters === undefined) {
      rotationCounters = zs.map(function() {
        return new RotationCounter();
      });
    }
    var results = [];
    for (var i = 0; i < zs.length; ++i) {
      var rotationCounter = rotationCounters[i];
      var z = zs[i];
      rotationCounter.update(z);
      var k = rotationCounter.k();
      for (var j = 0; j < p; ++j) {
        results.push(z.root(p, (k + j) % p));
      }
    }
    return results;
  }, [ this ]);
};

ComplexFormula.from = function(o) {
  if (o instanceof ComplexFormula) {
    return o;
  }
  return ComplexFormula.constant(o);
};

ComplexFormula._getSubformulas = function(that, args) {
  var subformulas = Array.prototype.map.call(args, function(arg) {
    return ComplexFormula.from(arg);
  });
  if (that instanceof ComplexFormula) {
    subformulas.unshift(that);
  }
  return subformulas;
};

ComplexFormula._multiOp = function(op, that, args) {
  var subformulas = this._getSubformulas(that, args);
  if (subformulas.length == 0) {
    return ComplexFormula.empty;
  }
  return new ComplexFormula(function(subresults) {
    return subresults[0].map(function(_, i) {
      var opInputs = subresults.map(function(a) { return a[i]; });
      return op.apply(null, opInputs);
    });
  }, subformulas);
};

ComplexFormula.plus = ComplexFormula.prototype.plus = function() {
  return ComplexFormula._multiOp(Complex.plus, this, arguments);
};

ComplexFormula.minus = ComplexFormula.prototype.minus = function() {
  return ComplexFormula._multiOp(Complex.minus, this, arguments);
};

ComplexFormula.times = ComplexFormula.prototype.times = function() {
  return ComplexFormula._multiOp(Complex.times, this, arguments);
};

ComplexFormula.div = ComplexFormula.prototype.div = function() {
  return ComplexFormula._multiOp(Complex.div, this, arguments);
};

ComplexFormula._multiOpAll = function(op, that, args) {
  var subformulas = this._getSubformulas(that, args);
  if (subformulas.length == 0) {
    return ComplexFormula.empty;
  }
  return new ComplexFormula(function(subresults) {
    var indices = subresults.map(function() { return 0; });
    var results = [];
    outer:
    while (true) {
      for (var i = 0; i < indices.length; ++i) {
        if (indices[i] < subresults[i].length) {
          break;
        }
        if ((i + 1) == indices.length) {
          break outer;
        }
        indices[i] = 0;
        ++indices[i+1];
      }

      var opInputs = indices.map(function(i, j) { return subresults[j][i]; });
      results.push(op.apply(null, opInputs));
      ++indices[0];
    }
    return results;
  }, subformulas);
};

ComplexFormula.plusAll = ComplexFormula.prototype.plusAll = function() {
  return ComplexFormula._multiOpAll(Complex.plus, this, arguments);
};

ComplexFormula.minusAll = ComplexFormula.prototype.minusAll = function() {
  return ComplexFormula._multiOpAll(Complex.minus, this, arguments);
};

ComplexFormula.timesAll = ComplexFormula.prototype.timesAll = function() {
  return ComplexFormula._multiOpAll(Complex.times, this, arguments);
};
