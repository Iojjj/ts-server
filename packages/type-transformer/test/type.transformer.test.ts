import chai = require("chai");
import {TypeTransformer} from "../src/type.transformer";
import {Transform, TransformCollection, TransformDictionary} from "../src/transform.decorator";

const typeTransformer = new TypeTransformer();

describe("to Number", () => {
    it(`must transform string "42" to number 42`, () => {
        chai.expect(typeTransformer.transform("42", Number)).equals(42);
    });

    it(`must transform number 5 to number 5`, () => {
        chai.expect(typeTransformer.transform(5, Number)).equals(5);
    });

    it(`must transform string "NaN" to number NaN`, () => {
        chai.expect(isNaN(typeTransformer.transform<number>("NaN", Number))).equals(true);
    });

    it(`must transform NaN to NaN`, () => {
        chai.expect(isNaN(typeTransformer.transform<number>(NaN, Number))).equals(true);
    });

    it(`must transform null to number 5`, () => {
        chai.expect(typeTransformer.transform(null, Number, 5)).equals(5);
    });

    it(`must transform undefined to number 5`, () => {
        chai.expect(typeTransformer.transform(undefined, Number, 5, 5)).equals(5);
    });

    it(`must transform null to null`, () => {
        chai.expect(typeTransformer.transform(null, Number)).equals(null);
    });

    it(`must transform undefined to undefined`, () => {
        chai.expect(typeTransformer.transform(undefined, Number)).equals(undefined);
    });

    it(`must fail transforming string with symbols different from numbers`, () => {
        chai.assert.throws(() => typeTransformer.transform("dada", Number));
    });

    it(`must fail transforming object`, () => {
        chai.assert.throws(() => typeTransformer.transform({}, Number));
    });

    it(`must fail transforming function`, () => {
        chai.assert.throws(() => {
            typeTransformer.transform(() => {
                // no-op
            }, Number);
        });
    });

    it(`must fail transforming Symbol`, () => {
        chai.assert.throws(() => typeTransformer.transform(Symbol(42), Number));
    });

    it(`must fail transforming Buffer`, () => {
        chai.assert.throws(() => typeTransformer.transform(new Buffer("42"), Number));
    });

    it(`must fail transforming array`, () => {
        chai.assert.throws(() => typeTransformer.transform([], Number));
    });
});

describe("to String", () => {
    it(`must transform string "aa" to string "aa"`, () => {
        chai.expect(typeTransformer.transform("aa", String)).equals("aa");
    });

    it(`must transform boolean true to string "true"`, () => {
        chai.expect(typeTransformer.transform(true, String)).equals("true");
    });

    it(`must transform boolean false to string "false"`, () => {
        chai.expect(typeTransformer.transform(false, String)).equals("false");
    });

    it(`must transform number 42 to string "42"`, () => {
        chai.expect(typeTransformer.transform(42, String)).equals("42");
    });

    it(`must transform number -1 to string "-1"`, () => {
        chai.expect(typeTransformer.transform(-1, String)).equals("-1");
    });

    it(`must transform Buffer("42") to string "42"`, () => {
        chai.expect(typeTransformer.transform(new Buffer("42"), String)).equals("42");
    });

    it(`must transform null to null`, () => {
        chai.expect(typeTransformer.transform(null, String)).equals(null);
    });

    it(`must transform undefined to undefined`, () => {
        chai.expect(typeTransformer.transform(undefined, String)).equals(undefined);
    });

    it(`must transform null to "aa"`, () => {
        chai.expect(typeTransformer.transform(null, String, "aa")).equals("aa");
    });

    it(`must transform undefined to "aa"`, () => {
        chai.expect(typeTransformer.transform(undefined, String, "", "aa")).equals("aa");
    });

    it(`must fail transforming object`, () => {
        chai.assert.throws(() => typeTransformer.transform({}, String));
    });

    it(`must fail transforming function`, () => {
        chai.assert.throws(() => {
            typeTransformer.transform(() => {
                // no-op
            }, String);
        });
    });

    it(`must fail transforming Symbol`, () => {
        chai.assert.throws(() => typeTransformer.transform(Symbol(42), String));
    });

    it(`must fail transforming array`, () => {
        chai.assert.throws(() => typeTransformer.transform([], String));
    });
});

describe("to Boolean", () => {
    it(`must transform string "true" to true`, () => {
        chai.expect(typeTransformer.transform("true", Boolean)).equals(true);
    });
    it(`must transform string "false" to false`, () => {
        chai.expect(typeTransformer.transform("false", Boolean)).equals(false);
    });
    it(`must transform number 1 to true`, () => {
        chai.expect(typeTransformer.transform(1, Boolean)).equals(true);
    });
    it(`must transform number 0 to false`, () => {
        chai.expect(typeTransformer.transform(0, Boolean)).equals(false);
    });
    it(`must fail transform number -1 to boolean`, () => {
        chai.assert.throws(() => typeTransformer.transform(-1, Boolean));
    });

    it(`must transform null to null`, () => {
        chai.expect(typeTransformer.transform(null, Boolean)).equals(null);
    });

    it(`must transform undefined to undefined`, () => {
        chai.expect(typeTransformer.transform(undefined, Boolean)).equals(undefined);
    });

    it(`must transform null to true`, () => {
        chai.expect(typeTransformer.transform(null, Boolean, true)).equals(true);
    });

    it(`must transform undefined to false`, () => {
        chai.expect(typeTransformer.transform(undefined, Boolean, true, false)).equals(false);
    });

    it(`must fail transforming object`, () => {
        chai.assert.throws(() => typeTransformer.transform({}, Boolean));
    });

    it(`must fail transforming function`, () => {
        chai.assert.throws(() => {
            typeTransformer.transform(() => {
                // no-op
            }, Boolean);
        });
    });

    it(`must fail transforming Symbol`, () => {
        chai.assert.throws(() => typeTransformer.transform(Symbol(42), Boolean));
    });

    it(`must fail transforming array`, () => {
        chai.assert.throws(() => typeTransformer.transform([], Boolean));
    });
});

describe("to Date", () => {
    it("must transform Date to Date", () => {
        const date = new Date(Date.now());
        chai.expect(typeTransformer.transform<Date>(date, Date).getTime()).equals(date.getTime());
    });

    it("must transform number to Date", () => {
        const date = Date.now();
        chai.expect(typeTransformer.transform<Date>(date, Date).getTime()).equals(date);
    });

    it("must transform string in format YYYY to Date", () => {
        const date = new Date(Date.UTC(1990, 0));
        const parsed = typeTransformer.transform<Date>("1990", Date);
        chai.expect(parsed.getTime()).equals(date.getTime());
    });

    it("must transform string in format YYYY-MM to Date", () => {
        const date = new Date(Date.UTC(1990, 1));
        const parsed = typeTransformer.transform<Date>("1990-02", Date);
        chai.expect(parsed.getTime()).equals(date.getTime());
    });

    it("must transform string in format YYYY-MM-DD to Date", () => {
        const date = new Date(Date.UTC(1990, 1, 15, 0, 0, 0, 0));
        const parsed = typeTransformer.transform<Date>("1990-02-15", Date);
        chai.expect(parsed.getTime()).equals(date.getTime());
    });

    it(`must transform null to null`, () => {
        chai.expect(typeTransformer.transform(null, Date)).equals(null);
    });

    it(`must transform undefined to undefined`, () => {
        chai.expect(typeTransformer.transform(undefined, Date)).equals(undefined);
    });

    it(`must transform null to Date.now()`, () => {
        const date = new Date();
        chai.expect(typeTransformer.transform(null, Date, date)).equals(date);
    });

    it(`must transform undefined to 1990-02-15`, () => {
        const date = new Date(Date.UTC(1990, 1, 15, 0, 0, 0, 0));
        chai.expect(typeTransformer.transform(undefined, Date, null, date)).equals(date);
    });

    it("must fail transforming string in wrong format", () => {
        chai.assert.throws(() => typeTransformer.transform<Date>("02-1990", Date));
    });

    it("must fail transforming random string", () => {
        chai.assert.throws(() => typeTransformer.transform<Date>("dwad", Date));
    });

    it("must fail transforming boolean", () => {
        chai.assert.throws(() => typeTransformer.transform<Date>(true, Date));
    });

    it("must fail transforming Buffer", () => {
        chai.assert.throws(() => typeTransformer.transform<Date>(new Buffer("42"), Date));
    });

    it("must fail transforming Symbol", () => {
        chai.assert.throws(() => typeTransformer.transform<Date>(Symbol("42"), Date));
    });

    it("must fail transforming array", () => {
        chai.assert.throws(() => typeTransformer.transform<Date>([], Date));
    });

    it("must fail transforming object", () => {
        chai.assert.throws(() => typeTransformer.transform<Date>({}, Date));
    });

    it("must fail transforming function", () => {
        chai.assert.throws(() => typeTransformer.transform<Date>(() => {
            // no-op
        }, Date));
    });
});

describe("to Test class", () => {

    it("must transform plain object to Test", () => {
        const map = new Map();
        for (let i = 0; i<10; i++) {
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

class Test {
    @Transform() name: string;
    @Transform() surname: string;
    @Transform() age: number;
    @Transform() isLucky: boolean;
    @Transform() dateOfBirth: Date;
    @Transform() symbol: symbol;
    @Transform() buffer: Buffer;
    @TransformCollection(Test) children: Test[];
    @TransformDictionary(String, Number) map: Map<string, string>;
    @TransformCollection(Number) set: Set<number>;
    @TransformCollection(Date) array: Date[];

    constructor(name: string, surname: string) {
        this.name = name;
        this.surname = surname;
        this.children = [];
        this.map = new Map();
        this.set = new Set();
        this.array = [];
        for (let i = 0; i<10; i++) {
            this.map.set(`key${i}`, `val${i}`);
            this.set.add(i);
            this.array.push(new Date)
        }
    }

    get fullName(): string {
        return `${this.name} ${this.surname}`;
    }
}