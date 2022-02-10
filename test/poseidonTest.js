const buildSimplePoseidon = require("../src/poseidon");
const buildPoseidon = require("circomlibjs").buildPoseidon;

const expect = require("chai").expect;

let simplePoseidon;
let poseidon;

beforeEach(async function () {
    simplePoseidon = await buildSimplePoseidon();
    poseidon = await buildPoseidon();
});

describe('SimplePoseidon', () => {
    it('Test buff2string', () => {
        let input = [0, 1];
        let result = simplePoseidon(input);
        let res = "12583541437132735734108669866114103169564651237895298778035846191048104863326";
        expect(simplePoseidon.buff2string(result)).to.equal(res);
        //console.log(poseidon.F.toObject(result).toString(), result, poseidon.F.e(res));
        //console.log(simplePoseidon.buff2String(result), result, poseidon.F.e(res));
    });
    it('Test string2buff', () => {
        let input = [0, 1];
        let result = simplePoseidon(input);
        let res = "12583541437132735734108669866114103169564651237895298778035846191048104863326";
        expect(result).to.equal(simplePoseidon.string2buff(res));
    });
});
