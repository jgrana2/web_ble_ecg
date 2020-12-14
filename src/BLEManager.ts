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
    let data: number[] = this.convert_to_16bits(event.target.value);

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
              this.socket.client.emit("lead_III", { uuid: characteristic.uuid, data: data });
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
              this.socket.client.emit("lead_aVR", { uuid: characteristic.uuid, data: data });
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
              this.socket.client.emit("lead_aVL", { uuid: characteristic.uuid, data: data });
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
              this.socket.client.emit("lead_aVF", { uuid: characteristic.uuid, data: data });
            }
            break;
        }
        break;

      case "lead_II_big":
        canvas.draw_line(data);
        this.socket.client.emit("lead_II_big", { uuid: characteristic.uuid, data: data });
        break;

      default:
        canvas.draw_line(data);
        this.socket.client.emit("non_derived_lead", { uuid: characteristic.uuid, data: data });
        break;
    }
  }

  convert_to_24_bits(view: DataView): number[] {
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

  convert_to_16bits(view: DataView): number[] {
    let data_array_16_bits: number[] = [];
    for (let index = 0; index < view.byteLength; index = index + Int16Array.BYTES_PER_ELEMENT) {
      data_array_16_bits.push(view.getInt16(index, true)); //Little endian
    }
    return data_array_16_bits;
  }

  disconnect() { }

  on_connect() { }

  on_disconnect() { }
}
