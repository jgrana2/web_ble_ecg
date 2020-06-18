import { Service } from "./Service";
import { Characteristic } from "./Characteristic";
import { SignalCanvas } from "./SignalCanvas";

export class BLEManager {
  public server: any;
  public service: Service;
  public channel_1: number[];
  public channel_2: number[];

  constructor(service: Service) {
    this.service = service;
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
    let name = characteristic.uuid.toString(16);
    this.server
      .getPrimaryService(this.service.uuid)
      .then((gatt_service: BluetoothRemoteGATTService) => {
        return gatt_service.getCharacteristic(characteristic.uuid);
      })
      .then((gatt_characteristic: BluetoothRemoteGATTCharacteristic) => {
        return gatt_characteristic
          .startNotifications()
          .then((gatt_characteristic: any) => {
            characteristic.gatt_characteristic = gatt_characteristic;
            gatt_characteristic.addEventListener(
              "characteristicvaluechanged",
              (event: Event) =>
                this.notification_handler(event, canvas, characteristic)
            );
            console.log("Notifications started on", gatt_characteristic.uuid);
          });
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
    let gatt_characteristic: BluetoothRemoteGATTCharacteristic = event.target;
    let data: number[] = this.convert_to_24_bits(event.target.value);

    switch (canvas.id) {
      case "lead_III":
        switch (characteristic.uuid) {
          case 0x8171:
            this.channel_1 = data;
            break;
          case 0x8172:
            this.channel_2 = data;
            if (this.channel_1 != null) {
              for (const key in this.channel_1) {
                if (this.channel_1.hasOwnProperty(key)) {
                  data[key] = this.channel_2[key] - this.channel_1[key];
                }
              }
              canvas.draw_line(data);
            }
            break;
        }
        break;

      case "lead_aVR":
        switch (characteristic.uuid) {
          case 0x8171:
            this.channel_1 = data;
            break;
          case 0x8172:
            this.channel_2 = data;
            if (this.channel_1 != null) {
              for (const key in this.channel_1) {
                if (this.channel_1.hasOwnProperty(key)) {
                  data[key] = (this.channel_2[key] - this.channel_1[key]) / 2;
                }
              }
              canvas.draw_line(data);
            }
            break;
        }
        break;

      case "lead_aVL":
        switch (characteristic.uuid) {
          case 0x8171:
            this.channel_1 = data;
            break;
          case 0x8172:
            this.channel_2 = data;
            if (this.channel_1 != null) {
              for (const key in this.channel_1) {
                if (this.channel_1.hasOwnProperty(key)) {
                  data[key] = this.channel_1[key] - this.channel_2[key] / 2;
                }
              }
              canvas.draw_line(data);
            }
            break;
        }
        break;

      case "lead_aVF":
        switch (characteristic.uuid) {
          case 0x8171:
            this.channel_1 = data;
            break;
          case 0x8172:
            this.channel_2 = data;
            if (this.channel_1 != null) {
              for (const key in this.channel_1) {
                if (this.channel_1.hasOwnProperty(key)) {
                  data[key] = this.channel_2[key] - this.channel_1[key] / 2;;
                }
              }
              canvas.draw_line(data);
            }
            break;
        }
        break;

      default: canvas.draw_line(data);
        break;
    }
  }

  convert_to_24_bits(view: DataView): number[] {
    let result: number;
    let is_negative: number;
    let value: number;
    let data_array_24_bits: number[];
    data_array_24_bits = [];
    for (
      let index = 0;
      index < view.byteLength;
      index = index + Uint32Array.BYTES_PER_ELEMENT
    ) {
      value = view.getUint32(index, true);
      is_negative = value & 0x800000;
      if (!is_negative) {
        data_array_24_bits.push(value);
      } else {
        data_array_24_bits.push((0xffffff - value + 1) * -1);
      }
    }
    // console.log(data_array_24_bits, this.uuid.toString(16));
    return data_array_24_bits;
  }

  disconnect() { }

  on_connect() { }

  on_disconnect() { }
}
