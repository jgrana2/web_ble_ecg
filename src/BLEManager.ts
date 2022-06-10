import { Service } from "./Service";
import { Characteristic } from "./Characteristic";
import { SignalCanvas } from "./SignalCanvas";
import { Socket } from "./Socket";

export class BLEManager {
  public server: any;
  public service: Service;
  public channel_1: number[];
  public channel_2: number[];
  public socket: Socket;

  constructor(service: Service, socket: Socket) {
    this.service = service;
    this.socket = socket;
    console.log("BLE Manager created");
  }

  //Connect to device
  connect(): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      window.navigator.bluetooth
        .requestDevice({
          acceptAllDevices: true,
          optionalServices: [this.service.uuid],
        })
        .then((device) => {
          console.log("Connecting to device...");
          device.gatt.connect().then((gatt_server) => {
            this.server = gatt_server;

            //Remove connect button
            document.getElementById("connect_button").style.display = "none";

            console.log("Connected!", gatt_server);
            resolve(this.server);
          });
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
    return promise;
  }

  //Start receiving notifications from the specified characteristic
  start_notifications(characteristic: Characteristic, canvas: SignalCanvas) {
    this.server
      .getPrimaryService(this.service.uuid)
      .then((gatt_service: BluetoothRemoteGATTService) => {
        return gatt_service.getCharacteristic(characteristic.uuid);
      })
      .then(async (gatt_characteristic: BluetoothRemoteGATTCharacteristic) => {
        const gatt_characteristic_1 = await gatt_characteristic
          .startNotifications();
        characteristic.gatt_characteristic = gatt_characteristic_1;
        gatt_characteristic_1.addEventListener(
          "characteristicvaluechanged",
          (event: Event) => this.notification_handler(event, canvas, characteristic)
        );
        console.log("Notifications started on", gatt_characteristic_1.uuid);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  //Function to handle notifications
  notification_handler(
    event: any,
    canvas: SignalCanvas,
    characteristic: Characteristic
  ) {
    // let data: number[] = this.convert_to_16bits(event.target.value);
    // console.log(event.target.value);
    let data_view: DataView = event.target.value; //DataView(84)
    let data_array: number[] = []
    for (let index = 0; index < data_view.byteLength/Int32Array.BYTES_PER_ELEMENT; index++) {
      data_array[index] = data_view.getInt32(index * Int32Array.BYTES_PER_ELEMENT, true)
    }

    switch (canvas.id) {
      case "lead_III":
        switch (characteristic.uuid) {
          case 0x8171:
            this.channel_1 = data_array;
            break;
          case 0x8172:
            this.channel_2 = data_array;
            if (this.channel_1 != null) {
              for (const key in this.channel_1) {
                if (this.channel_1.hasOwnProperty(key)) {
                  data_array[key] = this.channel_2[key] - this.channel_1[key];
                }
              }
              canvas.draw_line(data_array);
              this.socket.client.emit("lead_III", { uuid: characteristic.uuid, data: data_array });
            }
            break;
        }
        break;

      case "lead_aVR":
        switch (characteristic.uuid) {
          case 0x8171:
            this.channel_1 = data_array;
            break;
          case 0x8172:
            this.channel_2 = data_array;
            if (this.channel_1 != null) {
              for (const key in this.channel_1) {
                if (this.channel_1.hasOwnProperty(key)) {
                  data_array[key] = (this.channel_2[key] - this.channel_1[key]) / 2;
                }
              }
              canvas.draw_line(data_array);
              this.socket.client.emit("lead_aVR", { uuid: characteristic.uuid, data: data_array });
            }
            break;
        }
        break;

      case "lead_aVL":
        switch (characteristic.uuid) {
          case 0x8171:
            this.channel_1 = data_array;
            break;
          case 0x8172:
            this.channel_2 = data_array;
            if (this.channel_1 != null) {
              for (const key in this.channel_1) {
                if (this.channel_1.hasOwnProperty(key)) {
                  data_array[key] = this.channel_1[key] - this.channel_2[key] / 2;
                }
              }
              canvas.draw_line(data_array);
              this.socket.client.emit("lead_aVL", { uuid: characteristic.uuid, data: data_array });
            }
            break;
        }
        break;

      case "lead_aVF":
        switch (characteristic.uuid) {
          case 0x8171:
            this.channel_1 = data_array;
            break;
          case 0x8172:
            this.channel_2 = data_array;
            if (this.channel_1 != null) {
              for (const key in this.channel_1) {
                if (this.channel_1.hasOwnProperty(key)) {
                  data_array[key] = this.channel_2[key] - this.channel_1[key] / 2;;
                }
              }
              canvas.draw_line(data_array);
              this.socket.client.emit("lead_aVF", { uuid: characteristic.uuid, data: data_array });
            }
            break;
        }
        break;

      case "lead_II_big":
        canvas.draw_line(data_array);
        this.socket.client.emit("lead_II_big", { uuid: characteristic.uuid, data: data_array });
        break;

      default:
        canvas.draw_line(data_array);
        this.socket.client.emit("non_derived_lead", { uuid: characteristic.uuid, data: data_array });
        break;
    }
  }
}
