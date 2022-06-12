import * as io from 'socket.io-client';

export class Socket {
    public client: any;
    constructor() {
        this.client = io.connect("http://144.202.5.9:9900");
        this.client.on("connect", () => {
          console.log("Connected to Socket server");
        });
    }
}
