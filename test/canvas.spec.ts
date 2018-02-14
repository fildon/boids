import * as chai from "chai";
import * as mocha from "mocha";
import { Canvas } from "../src/canvas";

const expect = chai.expect;

describe("Canvas", () => {
    it("generates valid colours", () => {
        const colour = Canvas.randomColor();
        const regex = /^hsl\([0-9]*\.[0-9]*, 50%, 50%\)$/;
        expect(regex.test(colour)).to.equal(true);
    });
});
