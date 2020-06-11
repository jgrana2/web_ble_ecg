import {Service} from "./Service";
import {Characteristic} from "./Characteristic";

export class BLEManager{
  public status: string;
  public server: any;
  constructor(){
    this.status = "disconnected";
    console.log("BLE Manager created");
  }

  connect(service: Service):Promise<any>{
    const promise = new Promise((resolve, reject) => {
      window.navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [service.uuid]
      })
      .then(device => {
          console.log("Connecting to device...");
          this.status = "connected";
          device.gatt.connect().then(gatt_server => {
            this.server = gatt_server;
            console.log("Connected to server", gatt_server);
            resolve(this.server);
          });
        })
        .catch(error => {
          console.log(error);
          reject();
        });
  });
  return promise;
  }

  start_notifications(service: Service, characteristic: Characteristic):Promise<any>{
    const promise = new Promise((resolve, reject) => {
      // console.log(this.server);
      this.server.getPrimaryService(service.uuid)
      .then((gatt_service: any) => {
        // console.log(gatt_service);
        return gatt_service.getCharacteristic(characteristic.uuid);
      })
      .then((gatt_characteristic: any) => {
        // console.log(gatt_characteristic);
        return gatt_characteristic.startNotifications()
        .then((gatt_characteristic: any) => {
          gatt_characteristic.addEventListener('characteristicvaluechanged', characteristic.notication_handler);
          console.log("Notifications started on", gatt_characteristic.uuid);
          resolve(gatt_characteristic);
      });
      })
      .catch((error: any) => {
        console.log(error);
        reject();
      });
    });
    return promise;
}

  disconnect(){

  }

  on_connect(){

  }

  on_disconnect(){

  }
}
