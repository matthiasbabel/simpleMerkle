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

    get root(): Uint8Array {
        return this.nodes[this.nodes.length];
    }
}