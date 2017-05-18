import chai = require("chai");
import {TypedClass} from "../../../src/public/type-transformation/decorators/typed-class.decorator";
import {Typed} from "../../../src/public/type-transformation/decorators/typed.decorator";
import {TypedArray} from "../../../src/public/type-transformation/decorators/typed-array.decorator";
import {TypedMap} from "../../../src/public/type-transformation/decorators/typed-map.decorator";
import {TypedSet} from "../../../src/public/type-transformation/decorators/typed-set.decorator";
import {DefaultTypeTransformer} from "../../../src/public/type-transformation/models/def.type-transformer";
import {TransformType} from "../../../src/public/type-transformation/models/transform-type";

@TypedClass()
class Test {
    @Typed() public name: string;
    @Typed() public surname: string;
    @Typed() public age: number;
    @Typed() public isLucky: boolean;
    @Typed() public dateOfBirth: Date;
    @Typed() public symbol: symbol;
    @Typed() public buffer: Buffer;
    @TypedArray(Test) public children: Test[];
    @TypedMap(String, Number) public map: Map<string, string>;
    @TypedSet(Number) public set: Set<number>;
    @TypedArray(Date) public array: Date[];

    constructor(name: string, surname: string) {
        this.name = name;
        this.surname = surname;
        this.children = [];
        this.map = new Map();
        this.set = new Set();
        this.array = [];
        for (let i = 0; i < 10; i++) {
            this.map.set(`key${i}`, `val${i}`);
            this.set.add(i);
            this.array.push(new Date);
        }
    }

    public get fullName(): string {
        return `${this.name} ${this.surname}`;
    }
}

const transformer = new DefaultTypeTransformer();

describe("Transform to Test class", () => {

    it("must transform plain object to Test", () => {
        const map = new Map();
        for (let i = 0; i < 10; i++) {
            map.set(`key${i}`, `${i}`);
        }
        const val = transformer.transform<Test>(<Test>{
            name: "Name",
            surname: "Surname",
            age: 15,
            isLucky: false,
            buffer: new Buffer("42"),
            children: [
                {
                    name: "First",
                    surname: "Child"
                },
                {
                    name: "Second",
                    surname: "Child"
                }
            ],
            dateOfBirth: new Date(),
            symbol: Symbol.for("42"),
            map: map
        }, Test);
        chai.expect(val.fullName).equals("Name Surname");
        chai.expect(val.age).equals(15);
        chai.expect(val.isLucky).equals(false);
        chai.expect(val.buffer.toString()).equals("42");
        chai.expect(val.children.length).equals(2);
        chai.expect(val.children[0].fullName).equals("First Child");
        chai.expect(val.children[1].fullName).equals("Second Child");
    });

    it("must transform Map to Test", () => {
        const map: Map<string, any> = new Map();
        map.set("name", "Name");
        map.set("surname", "Surname");
        map.set("array", null);
        const val = transformer.transform<Test>(map, Test);
        chai.expect(val.fullName).equals("Name Surname");
    });

    it("must transform JSON of plain object to Test", () => {
        const plainObject = {
            name: "Name",
            surname: "Surname"
        };
        const json = JSON.stringify(plainObject);
        const val = transformer.transform<Test>(json, Test);
        chai.expect(val.fullName).equals("Name Surname");
    });

    it("must handle cyclic references #1", () => {
        const test1 = new Test("Name1", "Surname1");
        const test2 = new Test("Name2", "Surname2");
        test1.children.push(test2);
        test2.children.push(test1);
        const val = transformer.transform<Test>(test1, Test);
        chai.expect(val.children.length).equals(1);
        chai.expect(val.children[0].children[0]).equals(val);
    });

    it("must handle cyclic references #2", () => {
        const test1 = new Test("name", "surname");
        test1.children.push(test1);
        const val = transformer.transform<Test>(test1, Test);
        chai.expect(val.children.length).equals(1);
        chai.expect(val.children[0]).equals(val);
    });

    it("must fail transforming string to object", () => {
        chai.assert.throws(() => transformer.transform("test", Test));
    });

    it("must fail transforming to function", () => {
        chai.assert.throws(() => transformer.transform({}, TransformType.of(() => {
            // no-op
        }, undefined)));
    });
});