'use strict';

var runningOp = false;

function runOp(display, op, time) {
  if (runningOp) {
    return;
  }
  runningOp = true;

  var oldFixed = display.setRootsFixed(true);

  var elems = document.querySelectorAll('.disableWhileRunningOp');
  for (var i = 0; i < elems.length; ++i) {
    elems[i].disabled = true;
  }

  op.run(time, function() {
    runningOp = false;

    display.setRootsFixed(oldFixed);

    for (var i = 0; i < elems.length; ++i) {
      elems[i].disabled = false;
    }
  });
}

function switchFormula(display, formula) {
  if (runningOp) {
    return;
  }
  var numResults = display.setFormula(formula);
  resetRootAndResultList(display);
  var traceXs = document.querySelectorAll('.traceX');
  for (var i = 0; i < traceXs.length; ++i) {
    traceXs[i].querySelector('input').checked = false;
    traceXs[i].style.display = ((i < numResults) ? '' : 'none');
  }
}

function setTrace(display, event) {
  var name = event.target.value;
  var type = name[0];
  var index = parseInt(name.substring(1));
  var enable = event.target.checked;
  if (type == 'r') {
    --index;
    if (enable) {
      display.enableTraceRoot(index);
    } else {
      display.disableTraceRoot(index);
    }
  }
  if (type == 'a') {
    if (enable) {
      display.enableTraceCoeff(index);
    } else {
      display.disableTraceCoeff(index);
    }
  }
  if (type == 'x') {
    --index;
    if (enable) {
      display.enableTraceResult(index);
    } else {
      display.disableTraceResult(index);
    }
  }
}

function isIdentityPermutation(permutation) {
  for (var i = 0; i < permutation.length; ++i) {
    if (permutation[i] != i) {
      return false;
    }
  }
  return true;
}

function updateRootAndResultList(display) {
  var rootPermutation = display.getRootPermutation();
  var rootList = document.getElementById('rootList');
  rootList.innerHTML = rootPermutation.map(function(i) {
    return 'r<sub>' + (i+1) + '</sub>';
  }).join(', ');

  var resultPermutation = display.getResultPermutation();
  var resultList = document.getElementById('resultList');
  resultList.innerHTML = resultPermutation.map(function(i) {
    return 'x<sub>' + (i+1) + '</sub>';
  }).join(', ');

  var resultNote = document.getElementById('resultNote');
  if (isIdentityPermutation(rootPermutation) ==
      isIdentityPermutation(resultPermutation)) {
    resultNote.innerHTML = '';
  } else {
    resultNote.innerHTML = '(Applied path rules out formula as a formula for a root.)';
  }
}

function resetRootAndResultList(display) {
  display.reorderPointsBySubscript();
  updateRootAndResultList(display);
}
