export default class SimpleMerkle {
    input: Array<Uint8Array>;
    nodes: Array<Uint8Array>;
    depth: number;
    
    hasher: any;

    constructor (input: any, hasher: any) {
        this.depth = Math.log2(input.length);

        if (this.depth < 1 || this.depth % 1 !== 0) throw "Length of input must be pow of two.";

        this.hasher = hasher;
        this.input = input;
        
        this.calculateTree();
    }

    leafHash(input: Uint8Array): Uint8Array {
        return this.hasher(input);
    }

    nodeHash(left: Uint8Array, right: Uint8Array): Uint8Array {
        let input: Uint8Array = new Uint8Array(left.length + right.length);
        input.set(left);
        input.set(right, right.length);
        return this.hasher(input);
    }

    calculateTree(): void {
        this.nodes = [];
        for (let i of this.input) {
            this.nodes.push(this.leafHash(i));
        }
        let width = this.nodes.length;
        width >>= 1;
        let offset = 0;
        while (width > 0) {
            for (let i = 0; i < width; i++) {
                let j = 2 * i + offset;
                this.nodes.push(this.nodeHash(this.nodes[j], this.nodes[j + 1]));
            }
            offset += width * 2;
            width >>= 1;
        }
    }

     /**
     * Builds a merkle proof
     * @param index {Number}
     * @returns {Proof}
     */
    generateProof = (index) => {
        if (this.input.length <= index) throw "No valid in index";
        let path = new Uint8Array(this.depth).fill(0);
        let base2 = (index).toString(2);
        for (let i = 0; i < base2.length; i++) {
            path[i] = Number(base2[base2.length - i - 1]);
        }
        let lemma = [this.nodes[index]];
        let offset = 0;
        let pos = index;
        let width = this.input.length;
        for (let i = 0; i < this.depth; i++) {
            if (path[i]) {
                lemma.push(this.nodes[offset + pos - 1]);
            } else {
                lemma.push(this.nodes[offset + pos + 1]);
            }
            pos >>= 1;
            offset += width;
            width >>= 1;
        }
        lemma.push(this.root);
        return new Proof(path, lemma, this.nodeHash);
    }


    get root(): Uint8Array {
        return this.nodes[this.nodes.length];
    }
}

class Proof {
    /**
     * A proof of a merkle tree
     * @param path {[Number]}
     * @param lemma {Array}
     * @param nodeHash {Function} Hashing function for a node
     */
    path: Uint8Array;
    lemma: Array<Uint8Array>;
    nodeHash: any;

    constructor(path: Uint8Array, lemma: Array<Uint8Array>, nodeHash: any) {
        this.path = path;
        this.lemma = lemma;
        this.nodeHash = nodeHash;
    }

    /**
     * Validates proof
     * @returns {boolean}
     */
    validate() : boolean {
        let hash = this.lemma[0];
        for (let i = 0; i < this.path.length; i++) {
            if (this.path[i]) {
               hash = this.nodeHash(this.lemma[i + 1], hash);
            } else {
               hash = this.nodeHash(hash, this.lemma[i + 1]);
            }
        }
        return hash === this.lemma[this.lemma.length - 1];
    }
}