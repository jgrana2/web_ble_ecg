export class Characteristic {
  public uuid: number;
  // public data = new Int32Array(21); //21 Samples per packet
  constructor(uuid: number){
    this.uuid = uuid;
  }

  notication_handler(event: any){
    console.log("Notified from", event.target.uuid);
  }

}
