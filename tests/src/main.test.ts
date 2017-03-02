import {MainTestModule} from "./main-test.module";
import {Inject} from "../../src/di/decorators/inject/inject.decorator";
import {Test} from "./test";
import {Component} from "../../src/di/decorators/component/component.decorator";
import {Named} from "../../src/di/decorators/inject/named.decorator";

@Component(MainTestModule)
export class MainTest implements Test {

    //noinspection JSMismatchedCollectionQueryUpdate
    @Inject() @Named("tests")
    private tests: Test[];

    public run(): void {
        this.tests.forEach(t => t.run());
    }
}