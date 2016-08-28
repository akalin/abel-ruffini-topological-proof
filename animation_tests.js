'use strict';

describe('animation', function() {
  function FakePoint(x, y) {
    this.points = [[x, y]];
    this.attributes = {
      fixed: false
    };
  }

  FakePoint.prototype.X = function() {
    return this.points[this.points.length-1][0];
  };

  FakePoint.prototype.Y = function() {
    return this.points[this.points.length-1][1];
  };

  FakePoint.prototype.moveAlong = function(path, time, options) {
    for (var i = 0; i < path.length; ++i) {
      this.points.push(path[i]);
    }
    if (options.callback !== undefined) {
      options.callback();
    }
  };

  describe('PathAnimation', function() {
    it('run', function() {
      var p = new FakePoint(1, 1);
      var a = new PathAnimation(p, 1, 1, 2, 2, Math.PI/4);

      var done = false;
      a.run(1000, function() { done = true; });

      expect(done).toBe(true);
      expect(p.points).toEqual([[1, 1], [1, 1], [2, 1], [2, 2]]);
    });

    it('run with no callback', function() {
      var p = new FakePoint(1, 1);
      var a = new PathAnimation(p, 1, 1, 2, 2, Math.PI/4);

      // Should not try to run a nonexistent callback.
      a.run(1000);

      expect(p.points).toEqual([[1, 1], [1, 1], [2, 1], [2, 2]]);
    });

    it('invert', function() {
      var p = new FakePoint(1, 1);
      var a = new PathAnimation(p, 1, 1, 2, 2, Math.PI/4).invert();

      var done = false;
      a.run(1000, function() { done = true; });

      expect(done).toBe(true);
      expect(p.points).toEqual([[1, 1], [2, 2], [2, 1], [1, 1]]);
    });
  });

  function FakeClock() {
    this.now = 0;
  }

  function FakeAnimation(clock, inverseParent, id) {
    this.clock = clock;
    this.inverseParent = inverseParent;
    this.id = id;
  }

  FakeAnimation.prototype.run = function(time, doneCallback) {
    this.startTime = this.clock.now;
    this.runTime = time;
    this.runDoneCallback = doneCallback;
  };

  FakeAnimation.prototype.finishRun = function() {
    this.endTime = this.clock.now;
    if (this.runDoneCallback !== undefined) {
      this.runDoneCallback();
    }
  };

  FakeAnimation.prototype.invert = function() {
    return new FakeAnimation(this.clock, this);
  };

  describe('SimultaneousAnimation', function() {
    it('run', function() {
      var c = new FakeClock();
      var a1 = new FakeAnimation(c);
      var a2 = new FakeAnimation(c);
      var a = new SimultaneousAnimation([a1, a2]);

      var done = false;
      a.run(1000, function() { done = true; });

      expect(done).toBe(false);
      expect(a1.startTime).toBe(0);
      expect(a1.runTime).toBe(1000);
      expect(a1.endTime).toBe(undefined);
      expect(a2.startTime).toBe(0);
      expect(a2.runTime).toBe(1000);
      expect(a2.endTime).toBe(undefined);

      c.now += 1000;
      a2.finishRun();

      expect(done).toBe(false);
      expect(a1.startTime).toBe(0);
      expect(a1.runTime).toBe(1000);
      expect(a1.endTime).toBe(undefined);
      expect(a2.startTime).toBe(0);
      expect(a2.runTime).toBe(1000);
      expect(a2.endTime).toBe(1000);

      a1.finishRun();

      expect(done).toBe(true);
      expect(a1.startTime).toBe(0);
      expect(a1.runTime).toBe(1000);
      expect(a1.endTime).toBe(1000);
      expect(a2.startTime).toBe(0);
      expect(a2.runTime).toBe(1000);
      expect(a2.endTime).toBe(1000);
    });

    it('run with no callback', function() {
      var c = new FakeClock();
      var a1 = new FakeAnimation(c);
      var a2 = new FakeAnimation(c);
      var a = new SimultaneousAnimation([a1, a2]);

      // Should not try to run a nonexistent callback.
      a.run(1000);

      c.now += 1000;
      a2.finishRun();
      a1.finishRun();

      expect(a1.startTime).toBe(0);
      expect(a1.runTime).toBe(1000);
      expect(a1.endTime).toBe(1000);
      expect(a2.startTime).toBe(0);
      expect(a2.runTime).toBe(1000);
      expect(a2.runTime).toBe(1000);
    });

    it('invert', function() {
      var c = new FakeClock();
      var a1 = new FakeAnimation(c);
      var a2 = new FakeAnimation(c);
      var a = new SimultaneousAnimation([a1, a2]).invert();

      var a1i = a._as[0];
      expect(a1i.inverseParent).toBe(a1);

      var a2i = a._as[1];
      expect(a2i.inverseParent).toBe(a2);

      var done = false;
      a.run(1000, function() { done = true; });

      expect(done).toBe(false);
      expect(a1i.startTime).toBe(0);
      expect(a1i.runTime).toBe(1000);
      expect(a1i.endTime).toBe(undefined);
      expect(a2i.startTime).toBe(0);
      expect(a2i.runTime).toBe(1000);
      expect(a2i.endTime).toBe(undefined);

      c.now += 1000;
      a1i.finishRun();

      expect(done).toBe(false);
      expect(a1i.startTime).toBe(0);
      expect(a1i.runTime).toBe(1000);
      expect(a1i.endTime).toBe(1000);
      expect(a2i.startTime).toBe(0);
      expect(a2i.runTime).toBe(1000);
      expect(a2i.endTime).toBe(undefined);

      a2i.finishRun();

      expect(done).toBe(true);
      expect(a1i.startTime).toBe(0);
      expect(a1i.runTime).toBe(1000);
      expect(a1i.endTime).toBe(1000);
      expect(a2i.startTime).toBe(0);
      expect(a2i.runTime).toBe(1000);
      expect(a2i.endTime).toBe(1000);
    });
  });

  describe('SequentialAnimation', function() {
    it('run', function() {
      var c = new FakeClock();
      var a1 = new FakeAnimation(c);
      var a2 = new FakeAnimation(c);
      var a = new SequentialAnimation([a1, a2]);

      var done = false;
      a.run(1000, function() { done = true; });

      expect(done).toBe(false);
      expect(a1.startTime).toBe(0);
      expect(a1.runTime).toBe(500);
      expect(a1.endTime).toBe(undefined);
      expect(a2.startTime).toBe(undefined);
      expect(a2.runTime).toBe(undefined);
      expect(a2.endTime).toBe(undefined);

      c.now += 500;
      a1.finishRun();

      expect(done).toBe(false);
      expect(a1.startTime).toBe(0);
      expect(a1.runTime).toBe(500);
      expect(a1.endTime).toBe(500);
      expect(a2.startTime).toBe(500);
      expect(a2.runTime).toBe(500);
      expect(a2.endTime).toBe(undefined);

      c.now += 500;
      a2.finishRun();

      expect(done).toBe(true);
      expect(a1.startTime).toBe(0);
      expect(a1.runTime).toBe(500);
      expect(a1.endTime).toBe(500);
      expect(a2.startTime).toBe(500);
      expect(a2.runTime).toBe(500);
      expect(a2.endTime).toBe(1000);
    });

    it('run with no callback', function() {
      var c = new FakeClock();
      var a1 = new FakeAnimation(c);
      var a2 = new FakeAnimation(c);
      var a = new SequentialAnimation([a1, a2]);

      // Should not try to run a nonexistent callback.
      a.run(1000);

      c.now += 500;
      a1.finishRun();
      c.now += 500;
      a2.finishRun();

      expect(a1.startTime).toBe(0);
      expect(a1.runTime).toBe(500);
      expect(a1.endTime).toBe(500);
      expect(a2.startTime).toBe(500);
      expect(a2.runTime).toBe(500);
      expect(a2.endTime).toBe(1000);
    });

    it('invert', function() {
      var c = new FakeClock();
      var a1 = new FakeAnimation(c);
      var a2 = new FakeAnimation(c);
      var a = new SequentialAnimation([a1, a2]).invert();

      var done = false;
      a.run(1000, function() { done = true; });

      var a2i = a._as[0];
      expect(a2i.inverseParent).toBe(a2);

      var a1i = a._as[1];
      expect(a1i.inverseParent).toBe(a1);

      expect(done).toBe(false);
      expect(a2i.startTime).toBe(0);
      expect(a2i.runTime).toBe(500);
      expect(a2i.endTime).toBe(undefined);
      expect(a1i.startTime).toBe(undefined);
      expect(a1i.runTime).toBe(undefined);
      expect(a1i.endTime).toBe(undefined);

      c.now += 500;
      a2i.finishRun();

      expect(done).toBe(false);
      expect(a2i.startTime).toBe(0);
      expect(a2i.runTime).toBe(500);
      expect(a2i.endTime).toBe(500);
      expect(a1i.startTime).toBe(500);
      expect(a1i.runTime).toBe(500);
      expect(a1i.endTime).toBe(undefined);

      c.now += 500;
      a1i.finishRun();

      expect(done).toBe(true);
      expect(a2i.startTime).toBe(0);
      expect(a2i.runTime).toBe(500);
      expect(a2i.endTime).toBe(500);
      expect(a1i.startTime).toBe(500);
      expect(a1i.runTime).toBe(500);
      expect(a1i.endTime).toBe(1000);
    });
  });

  it('newCommutatorAnimation', function() {
    var c = new FakeClock();
    var a1 = new FakeAnimation(c, false, 'a1');
    var a2 = new FakeAnimation(c, false, 'a2');
    var a = newCommutatorAnimation(a1, a2);

    expect(a).toEqual(
      new SequentialAnimation([a2, a1, a2.invert(), a1.invert()])
    );
  });

  describe('SwapAnimation', function() {
    it('run', function() {
      var p1 = new FakePoint(1, 1);
      var p2 = new FakePoint(2, 2);
      var a = new SwapAnimation(p1, p2, Math.PI/4);

      var done = false;
      a.run(1000, function() { done = true; });

      expect(done).toBe(true);
      expect(p1.points).toEqual([[1, 1], [1, 1], [2, 1], [2, 2]]);
      expect(p2.points).toEqual([[2, 2], [2, 2], [1, 2], [1, 1]]);
    });

    it('run with no callback', function() {
      var p1 = new FakePoint(1, 1);
      var p2 = new FakePoint(2, 2);
      var a = new SwapAnimation(p1, p2, Math.PI/4);

      // Should not try to run a nonexistent callback.
      a.run(1000);

      expect(p1.points).toEqual([[1, 1], [1, 1], [2, 1], [2, 2]]);
      expect(p2.points).toEqual([[2, 2], [2, 2], [1, 2], [1, 1]]);
    });

    it('invert', function() {
      var p1 = new FakePoint(1, 1);
      var p2 = new FakePoint(2, 2);
      var a = new SwapAnimation(p1, p2, Math.PI/4).invert();

      var done = false;
      a.run(1000, function() { done = true; });

      expect(done).toBe(true);
      expect(p1.points).toEqual([[1, 1], [1, 1], [1, 2], [2, 2]]);
      expect(p2.points).toEqual([[2, 2], [2, 2], [2, 1], [1, 1]]);
    });

    it('invert with default', function() {
      var p1 = new FakePoint(1, 1);
      var p2 = new FakePoint(2, 2);
      var a = new SwapAnimation(p1, p2);
      var aInv = a.invert();
      expect(aInv._th).toBe(-a._th);
    });
  });

  describe('SwapElementAnimation', function() {
    it('run', function() {
      var p1 = new FakePoint(1, 1);
      var p2 = new FakePoint(2, 2);
      var p3 = new FakePoint(3, 3);
      var ps = [ p1, p2, p3 ];

      var startDoneBeforeSwap = false;
      var swapDone = false;
      var a = new SwapElementAnimation(ps, 0, 1, {
        startCallback: function() {
          if (!swapDone) {
            startDoneBeforeSwap = true;
          }
        },
        swapCallback: function() { swapDone = true; },
        th: Math.PI/4
      });

      var done = false;
      a.run(1000, function() { done = true; });

      expect(startDoneBeforeSwap).toBe(true);
      expect(swapDone).toBe(true);
      expect(done).toBe(true);
      expect(p1.points).toEqual([[1, 1], [1, 1], [2, 1], [2, 2]]);
      expect(p2.points).toEqual([[2, 2], [2, 2], [1, 2], [1, 1]]);
      expect(p3.points).toEqual([[3, 3]]);
      expect(ps).toEqual([ p2, p1, p3 ]);
    });

    it('run with no callbacks', function() {
      var p1 = new FakePoint(1, 1);
      var p2 = new FakePoint(2, 2);
      var ps = [ p1, p2 ];
      var a = new SwapElementAnimation(ps, 0, 1, { th: Math.PI/4 });

      // Should not try to run nonexistent callbacks.
      a.run(1000);

      expect(p1.points).toEqual([[1, 1], [1, 1], [2, 1], [2, 2]]);
      expect(p2.points).toEqual([[2, 2], [2, 2], [1, 2], [1, 1]]);
      expect(ps).toEqual([ p2, p1 ]);
    });

    it('invert', function() {
      var p1 = new FakePoint(1, 1);
      var p2 = new FakePoint(2, 2);
      var ps = [ p1, p2 ];
      var a = new SwapElementAnimation(ps, 0, 1, { th: Math.PI/4 }).invert();

      var done = false;
      a.run(1000, function() { done = true; });

      expect(done).toBe(true);
      expect(p1.points).toEqual([[1, 1], [1, 1], [1, 2], [2, 2]]);
      expect(p2.points).toEqual([[2, 2], [2, 2], [2, 1], [1, 1]]);
      expect(ps).toEqual([ p2, p1 ]);
    });

    it('invert with default', function() {
      var p1 = new FakePoint(1, 1);
      var p2 = new FakePoint(2, 2);
      var ps = [ p1, p2 ];
      var a = new SwapElementAnimation(ps, 0, 1);
      var aInv = a.invert();
      expect(aInv._th).toBe(-a._th);
    });
  });
});
