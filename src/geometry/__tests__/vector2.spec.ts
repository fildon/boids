import { config } from "stateManagement/config";
import { Vector2 } from "geometry/vector2";

describe.skip("Vector2", () => {
  describe("distance", () => {
    it("computes 3-4-5 triangle", () => {
      const v0 = new Vector2();
      const v1 = new Vector2(3, 4);
      const distance = v0.distance(v1);
      expect(distance).to.equal(5);
    });

    it("handles 0 distance", () => {
      expect(
        new Vector2(1, 1).distance(new Vector2(1, 1)),
      ).to.equal(0);
    });
  });

  describe("equality", () => {
    it("compares x y values, not object equality", () => {
      const v0 = new Vector2(0, 1);
      const v1 = new Vector2(0, 1);
      expect(v0.equals(v1)).to.be.true;
    });
  });

  describe("vectorTo", () => {
    it("computes the vector from one position vector to another", () => {
      const v0 = new Vector2(1, 1);
      const v1 = new Vector2(2, 3);
      const actual = v0.vectorTo(v1);
      const expected = new Vector2(1, 2);
      expect(actual).to.deep.equal(expected);
    });

    it("wraps negatively if that is shorter", () => {
      const v0 = new Vector2(1, 1);
      const v1 = new Vector2(config.screen.maxX - 1, config.screen.maxY - 1);
      const actual = v0.vectorTo(v1);
      const expected = new Vector2(-2, -2);
      expect(actual).to.deep.equal(expected);
    });

    it("wraps positively if that is shorter", () => {
      const v0 = new Vector2(config.screen.maxX - 1, config.screen.maxY - 1);
      const v1 = new Vector2(1, 1);
      const actual = v0.vectorTo(v1);
      const expected = new Vector2(2, 2);
      expect(actual).to.deep.equal(expected);
    });
  });

  describe("rotate", () => {
    it("rotates a vector", () => {
      const v0 = new Vector2(Math.sqrt(2), 0);
      const v1 = new Vector2(1, 1);
      const v2 = v0.rotate(Math.PI / 4);
      expect(fuzzyVectorEquality(v2, v1)).to.be.true;
    });

    it("rotates a vector", () => {
      const v0 = new Vector2(1, 1);
      const v1 = new Vector2(-1, 1);
      const v2 = v0.rotate(Math.PI / 2);
      expect(fuzzyVectorEquality(v2, v1)).to.be.true;
    });

    it("rotates a vector", () => {
      const v0 = new Vector2(1, 1);
      const v1 = new Vector2(0, Math.sqrt(2));
      const v2 = v0.rotate(Math.PI / 4);
      expect(fuzzyVectorEquality(v2, v1)).to.be.true;
    });
  });

  describe("angleTo", () => {
    it("measures the angle from one vector to another", () => {
      const v0 = new Vector2(3, 4);
      const v1 = new Vector2(-4, 3);
      expect(v0.angleTo(v1)).to.be.lessThan((Math.PI / 2) + 0.001);
      expect(v0.angleTo(v1)).to.be.greaterThan((Math.PI / 2) - 0.001);
    });

    it("measures the angle from one vector to another", () => {
      const v0 = new Vector2(5, 9);
      const v1 = new Vector2(-4.87, 9.07);
      expect(v0.angleTo(v1)).to.be.lessThan(1 + 0.001);
      expect(v0.angleTo(v1)).to.be.greaterThan(1 - 0.001);
    });

    it("measures clockwise angles", () => {
      const v0 = new Vector2(-4, 3);
      const v1 = new Vector2(3, 4);
      expect(v0.angleTo(v1)).to.be.lessThan((-Math.PI / 2) + 0.001);
      expect(v0.angleTo(v1)).to.be.greaterThan((-Math.PI / 2) - 0.001);
    });
  });

  describe("add", () => {
    it("adds two vectors together", () => {
      const v0 = new Vector2(1, 2);
      const v1 = new Vector2(3, 4);
      const v2 = v0.add(v1);
      expect(v2.x).to.equal(4);
      expect(v2.y).to.equal(6);
    });
  });

  describe("average", () => {
    it("returns the zero vector if none input", () => {
      const actual = Vector2.average([]);
      expect(actual.x).to.equal(0);
      expect(actual.y).to.equal(0);
    });

    it("returns the same vector if only one input", () => {
      const v = new Vector2(1, 1);
      const actual = Vector2.average([v]);
      expect(actual.x).to.equal(v.x);
      expect(actual.y).to.equal(v.y);
    });

    it("returns the average of two or more vectors", () => {
      const v1 = new Vector2();
      const v2 = new Vector2(2, 2);
      const v3 = new Vector2(0, 2);
      const v4 = new Vector2(2, 0);

      const expected = new Vector2(1, 1);
      const actual = Vector2.average([v1, v2, v3, v4]);

      expect(actual.x).to.equal(expected.x);
      expect(actual.y).to.equal(expected.y);
    });
  });

  describe("unitVector", () => {
    it("returns a vector scaled to length 1", () => {
      const v = new Vector2(10, 0);

      const expected = new Vector2(1, 0);
      const actual = v.unitVector();

      expect(actual.x).to.equal(expected.x);
      expect(actual.y).to.equal(expected.y);
    });
  });

  describe("scaleToLength", () => {
    it("performs no-op if current length is zero", () => {
      const v = new Vector2(0, 0);

      const actual = v.scaleToLength(5);

      expect(actual).to.equal(v);
    });
  })

  describe("normalize", () => {
    it("puts a negative vector into the positive space", () => {
      const v = new Vector2(-1, -1);

      const expected = new Vector2(config.screen.maxX - 1, config.screen.maxY - 1);
      const actual = v.normalize();

      expect(actual.x).to.equal(expected.x);
      expect(actual.y).to.equal(expected.y);
    })
  });
});
