'use strict';

describe('rotation counter', function() {
  it('clockwise', function() {
    var z = new Complex(+1, +0);
    var p = new RotationCounter(z);
    expect(p.k()).toBe(0);

    p.update(new Complex(+0, +1));
    expect(p.k()).toBe(0);

    p.update(new Complex(-0, +1));
    expect(p.k()).toBe(0);

    p.update(new Complex(-1, +0));
    expect(p.k()).toBe(0);

    p.update(new Complex(-1, -0));
    expect(p.k()).toBe(1);

    p.update(new Complex(-0, -1));
    expect(p.k()).toBe(1);

    p.update(new Complex(+0, -1));
    expect(p.k()).toBe(1);

    p.update(new Complex(+1, -0));
    expect(p.k()).toBe(1);

    p.update(new Complex(+1, +0));
    expect(p.k()).toBe(1);
  });

  it('counter-clockwise', function() {
    var z = new Complex(+1, +0);
    var p = new RotationCounter(z);
    expect(p.k()).toBe(0);

    p.update(new Complex(+1, -0));
    expect(p.k()).toBe(0);

    p.update(new Complex(+0, -1));
    expect(p.k()).toBe(0);

    p.update(new Complex(-0, -1));
    expect(p.k()).toBe(0);

    p.update(new Complex(-1, -0));
    expect(p.k()).toBe(0);

    p.update(new Complex(-1, +0));
    expect(p.k()).toBe(-1);

    p.update(new Complex(-0, +1));
    expect(p.k()).toBe(-1);

    p.update(new Complex(+0, +1));
    expect(p.k()).toBe(-1);

    p.update(new Complex(+1, +0));
    expect(p.k()).toBe(-1);
  });

  it('right sweeps', function() {
    var z = new Complex(+0, +1);
    var p = new RotationCounter(z);
    expect(p.k()).toBe(0);

    p.update(new Complex(+0, -1));
    expect(p.k()).toBe(0);

    p.update(new Complex(+0, +1));
    expect(p.k()).toBe(0);
  });

  it('left sweeps', function() {
    var z = new Complex(-0, +1);
    var p = new RotationCounter(z);
    expect(p.k()).toBe(0);

    p.update(new Complex(-0, -1));
    expect(p.k()).toBe(+1);

    p.update(new Complex(-0, +1));
    expect(p.k()).toBe(0);
  });
});
