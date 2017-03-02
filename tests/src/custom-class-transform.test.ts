import chai = require("chai");
import {TypeTransformer} from "../../src/type-transformer/type.transformer";
import {
    Transform,
    TransformCollection,
    TransformDictionary
} from "../../src/type-transformer/transform.decorator";
import {AbstractTest} from "./abstract.test";
import {Inject} from "../../src/di/decorators/inject/inject.decorator";
import {Component} from "../../src/di/decorators/component/component.decorator";
import {TestModule} from "./test.module";

@Component(TestModule)
export class CustomClassTransformTest extends AbstractTest {

    public run(@Inject() typeTransformer?: TypeTransformer): void {
        if (!typeTransformer) {
            return;
        }
        describe("to Test class", () => {

            it("must transform plain object to Test", () => {
                const map = new Map();
                for (let i = 0; i < 10; i++) {
                    map.set(`key${i}`, `${i}`);
                }
                const val = typeTransformer.transform<Test>(<Test>{
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
                const val = typeTransformer.transform<Test>(map, Test);
                chai.expect(val.fullName).equals("Name Surname");
            });

            it("must transform JSON of plain object to Test", () => {
                const plainObject = {
                    name: "Name",
                    surname: "Surname"
                };
                const json = JSON.stringify(plainObject);
                const val = typeTransformer.transform<Test>(json, Test);
                chai.expect(val.fullName).equals("Name Surname");
            });

            it("must handle cyclic references #1", () => {
                const test1 = new Test("Name1", "Surname1");
                const test2 = new Test("Name2", "Surname2");
                test1.children.push(test2);
                test2.children.push(test1);
                const val = typeTransformer.transform<Test>(test1, Test);
                chai.expect(val.children.length).equals(1);
                chai.expect(val.children[0].children[0]).equals(val);
            });

            it("must handle cyclic references #2", () => {
                const test1 = new Test("name", "surname");
                test1.children.push(test1);
                const val = typeTransformer.transform<Test>(test1, Test);
                chai.expect(val.children.length).equals(1);
                chai.expect(val.children[0]).equals(val);
            });

            it("must fail transforming string to object", () => {
                chai.assert.throws(() => typeTransformer.transform("test", Test));
            });

            it("must fail transforming to function", () => {
                chai.assert.throws(() => typeTransformer.transform({}, () => {
                    // no-op
                }));
            });
        });
    }

}

class Test {
    @Transform() public name: string;
    @Transform() public surname: string;
    @Transform() public age: number;
    @Transform() public isLucky: boolean;
    @Transform() public dateOfBirth: Date;
    @Transform() public symbol: symbol;
    @Transform() public buffer: Buffer;
    @TransformCollection(Test) public children: Test[];
    @TransformDictionary(String, Number) public map: Map<string, string>;
    @TransformCollection(Number) public set: Set<number>;
    @TransformCollection(Date) public array: Date[];

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