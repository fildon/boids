import * as chai from 'chai';
import * as mocha from 'mocha';
import { Vector2 } from '../vector2';

const expect = chai.expect;

describe('Vector2', () => {
    it('computes distance', () => {
        var v0 = new Vector2(0, 0);
        var v1 = new Vector2(3, 4);
        var distance = v0.distance(v1);
        expect(distance).to.equal(5);
    });
});
