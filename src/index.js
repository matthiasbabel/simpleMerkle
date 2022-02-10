export default class SimpleMerkle {
    /**
     * 
     * @param {Uint8Array} input 
     * @param {Function} hasher 
     */
    constructor(input, hasher) {
        this.depth = Math.log2(input.length);

        if (this.depth < 1 || this.depth % 1 !== 0) throw "Length of input must be pow of two.";

        this.hasher = hasher;
        this.input = input;

        this.calculateTree();
    }

    /**
     * 
     * @param {Uint8Array} input 
     * @returns {Uint8Array}
     */
    leafHash(input) {
        return this.hasher(input);
    }

    /**
     * 
     * @param {Uint8Array} left 
     * @param {Uint8Array} right 
     * @returns {Uint8Array}
     */
    nodeHash(left, right) {
        let input = new Uint8Array(left.length + right.length);
        input.set(left);
        input.set(right, right.length);
        return this.hasher(input);
    }

    /**
     * Caclulates the tree
     */
    calculateTree() {
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
    //
    //    /**
    //    * Builds a merkle proof
    //    * @param index {Number}
    //    * @returns {Proof}
    //    */
    //    generateProof = (index) => {
    //        if (this.input.length <= index) throw "No valid in index";
    //        let path = new Uint8Array(this.depth).fill(0);
    //        let base2 = (index).toString(2);
    //        for (let i = 0; i < base2.length; i++) {
    //            path[i] = Number(base2[base2.length - i - 1]);
    //        }
    //        let lemma = [this.nodes[index]];
    //        let offset = 0;
    //        let pos = index;
    //        let width = this.input.length;
    //        for (let i = 0; i < this.depth; i++) {
    //            if (path[i]) {
    //                lemma.push(this.nodes[offset + pos - 1]);
    //            } else {
    //                lemma.push(this.nodes[offset + pos + 1]);
    //            }
    //            pos >>= 1;
    //            offset += width;
    //            width >>= 1;
    //        }
    //        lemma.push(this.root);
    //        return new Proof(path, lemma, this.nodeHash);
    //    }
    //
    //    /**
    //     * Returns the root of the tree
    //     */
    get root() {
        return this.nodes[this.nodes.length];
    }
}
//
//class Proof {
//    /**
//     * A proof of a merkle tree
//     * @param path {[Number]}
//     * @param lemma {Array}
//     * @param nodeHash {Function} Hashing function for a node
//     */
//    path;
//    lemma;
//    nodeHash;
//
//    constructor(path, lemma, nodeHash) {
//        this.path = path;
//        this.lemma = lemma;
//        this.nodeHash = nodeHash;
//    }
//
//    /**
//     * Validates proof
//     * @returns {boolean}
//     */
//    validate() {
//        let hash = this.lemma[0];
//        for (let i = 0; i < this.path.length; i++) {
//            if (this.path[i]) {
//                hash = this.nodeHash(this.lemma[i + 1], hash);
//            } else {
//                hash = this.nodeHash(hash, this.lemma[i + 1]);
//            }
//        }
//        return hash === this.lemma[this.lemma.length - 1];
//    }
//}