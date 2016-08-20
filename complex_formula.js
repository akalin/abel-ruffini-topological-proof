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
