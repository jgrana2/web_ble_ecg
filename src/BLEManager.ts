import { Service } from "./Service";
import { Characteristic } from "./Characteristic";

export class BLEManager {
  public server: any;
  constructor() {
    console.log("BLE Manager created");
  }

  //Connect to device
  connect(service: Service): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      window.navigator.bluetooth
        .requestDevice({
          acceptAllDevices: true,
          optionalServices: [service.uuid]
        })
        .then(device => {
          console.log("Connecting to device...");
          device.gatt.connect().then(gatt_server => {
            this.server = gatt_server;

            //Remove connect button
            document.getElementById("connect_button").style.display = "none";

            console.log("Connected!", gatt_server);
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

  //Start receiving notifications from the specified service and characteristic
  start_notifications(service: Service, characteristic: Characteristic ): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.server.getPrimaryService(service.uuid)
        .then((gatt_service: any) => {
          return gatt_service.getCharacteristic(characteristic.uuid);
        })
        .then((gatt_characteristic: any) => {
          return gatt_characteristic.startNotifications()
            .then((gatt_characteristic: any) => {
              gatt_characteristic.addEventListener("characteristicvaluechanged", characteristic.notication_handler);
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

  disconnect() {}

  on_connect() {}

  on_disconnect() {}
}
