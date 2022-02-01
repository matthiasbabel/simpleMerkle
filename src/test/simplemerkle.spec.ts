import { expect } from 'chai';

import SimpleMerkle from "../index" 

describe("SimpleMerkle", () => {
    describe("Create", () => {
        it("Init SimpleMerkle", () => {
            let tree = new SimpleMerkle([1, 2, 3, 4]);
        });
    })
});
