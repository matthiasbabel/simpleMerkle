const buildPoseidon = require("circomlibjs").buildPoseidon;

async function buildSimplePoseidon() {
    let poseidon = await buildPoseidon();

    const simplePoseidon = (arr) => {
        return poseidon(arr);
    };

    const F = poseidon.F;

    simplePoseidon.F = F;

    simplePoseidon.buff2string = (buff) => {
        return F.toObject(buff).toString();
    };

    simplePoseidon.string2buff = (string) => {
        return poseidon.F.e(string)
    };

    return simplePoseidon;
}

module.exports = buildSimplePoseidon;