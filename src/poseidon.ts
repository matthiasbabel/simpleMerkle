
//const buildPoseidon = require("circomlibjs").buildPoseidon;

async function test() {
    let uint8array = new TextEncoder().encode("Hello World");
    console.log(uint8array);
}
test();