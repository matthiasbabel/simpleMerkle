include "./lib/poseidon.circom";

template Main() {
   signal output out;
   signal input in[2];
   
   component hash = Poseidon(2);

   hash.inputs[0] <== in[0];
   hash.inputs[1] <== in[1];
   
   out <== hash.out;
}

component main = Main();