'use strict';

describe('animation', function() {
  function FakePoint(x, y) {
    this.points = [[x, y]];
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
});
