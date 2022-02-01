import { buildPoseidon } from "circomlibjs";
import SimpleMerkle from "..";

async function test() {
    let input = [[1], [2], [3], [4]];
    //let intput8array = new TextEncoder().encode("Hello World");
    let poseidon = await buildPoseidon();
    let tree = new SimpleMerkle(input, poseidon);
    console.log(tree);
}

test();