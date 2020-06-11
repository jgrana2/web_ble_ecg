import {Characteristic} from './Characteristic';

export class Service {
  public uuid: number;
  public characteristics: Characteristic[] = new Array(9); //Status + 8 channels
  constructor(uuid: number, characteristics: Characteristic[]){
    this.uuid = uuid;
    this.characteristics = characteristics;
  }
}
