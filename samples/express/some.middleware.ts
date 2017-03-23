import {Middleware} from "../../src/server/decorators/middleware.decorator";
import {SimpleMiddleware} from "../../src/server/core/models/base/abs.middleware";
import {Req} from "../../src/server-express/decorators/request.decorator";
import {Res} from "../../src/server-express/decorators/response.decorator";
import {Result} from "../../src/server-express/decorators/result.decorator";
import {Next} from "../../src/server-express/decorators/next.decorator";

@Middleware()
export class SomeMiddleware extends SimpleMiddleware {

    private readonly num: number;

    constructor(num: number) {
        super();
        this.num = num;
    }

    protected async run(@Req() request: any, @Res() response: any,
                        @Result() result: any, @Next() next: () => Promise<any>): Promise<any> {
        console.log(`waiting`, this.num);
        await this.countdown();
    }

    private countdown(): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(resolve, 500);
        });
    }

} 