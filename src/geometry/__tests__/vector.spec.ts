import { config } from '../../stateManagement/config';
import { Vector } from '../../geometry/vector';

describe('Vector', () => {
  describe('distance', () => {
    it('computes 3-4-5 triangle', () => {
      const v0 = new Vector();
      const v1 = new Vector(3, 4);
      const distance = v0.distance(v1);
      expect(distance).toBe(5);
    });

    it('handles 0 distance', () => {
      expect(
        new Vector(1, 1).distance(new Vector(1, 1)),
      ).toBe(0);
    });
  });

  describe('equality', () => {
    it('compares x y values, not object equality', () => {
      const v0 = new Vector(0, 1);
      const v1 = new Vector(0, 1);
      expect(v0.equals(v1)).toBe(true);
    });
  });

  describe('vectorTo', () => {
    it('computes the vector from one position vector to another', () => {
      const v0 = new Vector(1, 1);
      const v1 = new Vector(2, 3);
      const actual = v0.vectorTo(v1);
      const expected = new Vector(1, 2);
      expect(actual).toStrictEqual(expected);
    });

    it('wraps negatively if that is shorter', () => {
      const v0 = new Vector(1, 1);
      const v1 = new Vector(config.screen.maxX - 1, config.screen.maxY - 1);
      const actual = v0.vectorTo(v1);
      const expected = new Vector(-2, -2);
      expect(actual).toStrictEqual(expected);
    });

    it('wraps positively if that is shorter', () => {
      const v0 = new Vector(config.screen.maxX - 1, config.screen.maxY - 1);
      const v1 = new Vector(1, 1);
      const actual = v0.vectorTo(v1);
      const expected = new Vector(2, 2);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('rotate', () => {
    it('rotates a vector through an eighth turn', () => {
      const v = new Vector(Math.sqrt(2), 0);

      const actual = v.rotate(Math.PI / 4);

      const expected = new Vector(1, 1);
      expect(actual.x).toBeCloseTo(expected.x);
      expect(actual.y).toBeCloseTo(expected.y);
    });

    it('rotates a vector through a quarter turn', () => {
      const v = new Vector(1, 1);

      const actual = v.rotate(Math.PI / 2);

      const expected = new Vector(-1, 1);
      expect(actual.x).toBeCloseTo(expected.x);
      expect(actual.y).toBeCloseTo(expected.y);
    });
  });

  describe('angleTo', () => {
    it('measures a quarter rotation from one vector to another', () => {
      const v0 = new Vector(3, 4);
      const v1 = new Vector(-4, 3);
      expect(v0.angleTo(v1)).toBeCloseTo(Math.PI / 2);
    });

    it('measures a 1 radian angle from one vector to another', () => {
      const v0 = new Vector(5, 9);
      const v1 = new Vector(-4.87, 9.07);
      expect(v0.angleTo(v1)).toBeCloseTo(1);
    });

    it('measures clockwise angles', () => {
      const v0 = new Vector(-4, 3);
      const v1 = new Vector(3, 4);
      expect(v0.angleTo(v1)).toBeCloseTo(-Math.PI / 2);
    });
  });

  describe('add', () => {
    it('adds two vectors together', () => {
      const v1 = new Vector(1, 2);
      const v2 = new Vector(3, 4);

      const actual = v1.add(v2);

      const expected = new Vector(4, 6);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('average', () => {
    it('returns the zero vector if none input', () => {
      const actual = Vector.average([]);
      
      const expected = new Vector(0, 0);
      expect(actual).toStrictEqual(expected);
    });

    it('returns the same vector if only one input', () => {
      const v = new Vector(1, 1);
      const actual = Vector.average([v]);

      expect(actual).toStrictEqual(v);
    });

    it('returns the average of two or more vectors', () => {
      const v1 = new Vector();
      const v2 = new Vector(2, 2);
      const v3 = new Vector(0, 2);
      const v4 = new Vector(2, 0);

      const expected = new Vector(1, 1);
      const actual = Vector.average([v1, v2, v3, v4]);

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('unitVector', () => {
    it('returns a vector scaled to length 1', () => {
      const v = new Vector(10, 0);

      const expected = new Vector(1, 0);
      const actual = v.unitVector();

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('scaleToLength', () => {
    it('performs no-op if current length is zero', () => {
      const v = new Vector(0, 0);

      const actual = v.scaleToLength(5);

      expect(actual).toStrictEqual(v);
    });
  });

  describe('normalize', () => {
    it('puts a negative vector into the positive space', () => {
      const v = new Vector(-1, -1);

      const expected = new Vector(config.screen.maxX - 1, config.screen.maxY - 1);
      const actual = v.normalize();

      expect(actual).toStrictEqual(expected);
    });
  });
});
