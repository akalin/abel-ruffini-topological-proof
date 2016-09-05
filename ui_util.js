'use strict';

var runningOp = false;

function runOp(display, op, time, doneCallback) {
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
    if (doneCallback !== undefined) {
      doneCallback();
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

  updateRotationCounterList(display);
}

function updateRotationCounterList(display) {
  var resultPermutation = display.getResultPermutation();
  var rotationCounterList = document.getElementById('rotationCounterList');
  var z0 = display.getRotationCounterOrigin();
  var s = 'z<sub>0</sub> = ' + z0 + ', ';
  if (isIdentityPermutation(resultPermutation)) {
    s += display.getResultRotationCounters().map(function(rc, i) {
      return 'Rot(x<sub>' + (i+1) + '</sub>, z<sub>0</sub>) = ' + rc.k();
    }).join(', ');
  } else {
    s += 'Rot(x<sub>i</sub>, z<sub>0</sub>) is undefined';
  }
  rotationCounterList.innerHTML = s;
}

function resetRootAndResultList(display) {
  display.reorderPointsBySubscript();
  display.resetResultRotationCounters();
  updateRootAndResultList(display);
}

function checkOpRulesOutFormula(display, op, time, undoCallback, doneCallback) {
  resetRootAndResultList(display);
  runOp(display, op, time, function() {
    var rootPermutation = display.getRootPermutation();
    var resultPermutation = display.getResultPermutation();
    var rulesOut = (isIdentityPermutation(rootPermutation) !=
                    isIdentityPermutation(resultPermutation));
    undoCallback();
    runOp(display, op.invert(), time, function() {
      doneCallback(rulesOut);
    });
  });
}

function findFirstOpRulingOutSelectedFormulaHelper(
  display, opInfos, statusCallback, doneCallback) {
  var i = 0;
  var undoCallback = function() {
    statusCallback(opInfos[i], true);
  }
  var _doneCallback = function(rulesOut) {
    if (rulesOut) {
      doneCallback(opInfos[i]);
      return;
    }
    ++i;
    if (i >= opInfos.length) {
      doneCallback(null);
      return;
    }
    statusCallback(opInfos[i], false);
    checkOpRulesOutFormula(
      display, opInfos[i].op, opInfos[i].time, undoCallback, _doneCallback);
  };
  statusCallback(opInfos[0]);
  checkOpRulesOutFormula(
    display, opInfos[0].op, opInfos[0].time, undoCallback, _doneCallback);
}

function findFirstOpRulingOutSelectedFormula(display, opInfos) {
  var status = document.getElementById('findFirstOpStatus');
  var statusCallback = function(opInfo, isUndo) {
    if (isUndo) {
      status.innerHTML = 'Undoing ' + opInfo.name + '...';
    } else {
      status.innerHTML = 'Trying ' + opInfo.name + '...';
    }
  };
  var doneCallback = function(opInfo) {
    if (opInfo === null) {
      status.innerHTML = 'No op ruling out selected formula found';
    } else {
      status.innerHTML = opInfo.name + ' rules out selected formula';
    }
  };
  findFirstOpRulingOutSelectedFormulaHelper(
    display, opInfos, statusCallback, doneCallback);
}
