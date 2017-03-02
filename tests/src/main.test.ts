import {MainTestModule} from "./main-test.module";
import {Inject} from "../../framework/src/dependency-injection/decorators/inject/inject.decorator";
import {Test} from "./test";
import {Component} from "../../framework/src/dependency-injection/decorators/component/component.decorator";
import {Named} from "../../framework/src/dependency-injection/decorators/inject/named.decorator";

@Component(MainTestModule)
export class MainTest implements Test {

    //noinspection JSMismatchedCollectionQueryUpdate
    @Inject() @Named("tests")
    private tests: Test[];

    public run(): void {
        this.tests.forEach(t => t.run());
    }
}