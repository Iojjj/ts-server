import {SampleServer} from "./server";

const server = new SampleServer();
server.start()
    .then((host) => console.log(`Server started on ${host}.`));