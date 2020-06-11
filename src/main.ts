import { BLEManager } from "./BLEManager";
import { Device } from "./Device";
import { Service } from "./Service";
import { Characteristic } from "./Characteristic";

// document.addEventListener('DOMContentLoaded', (event) => {
//   main();
// });

document.querySelector("#connect").addEventListener("click", () => {
  main();
});

function main() {
  //ECG Channels
  let channel_1 = new Characteristic(0x8171);
  let channel_2 = new Characteristic(0x8172);
  let channel_3 = new Characteristic(0x8173);
  let channel_4 = new Characteristic(0x8174);
  let channel_5 = new Characteristic(0x8175);
  let channel_6 = new Characteristic(0x8176);
  let channel_7 = new Characteristic(0x8177);
  let channel_8 = new Characteristic(0x8178);

  let ecg_characteristics: Characteristic[] = [
    channel_1,
    channel_2,
    channel_3,
    channel_4,
    channel_5,
    channel_6,
    channel_7,
    channel_8
  ];

  //ECG Service
  let ecg_service = new Service(0x805b, ecg_characteristics);

  //Welcome
  console.log("IECG v0.1"); //Internet ECG v0.1

  //Create BLE Manager
  let ble = new BLEManager();

  //Create ECG Device
  let ecg_device = new Device("1A", ble);

  //Connect to ECG Device
  ecg_device.ble.connect(ecg_service).then(() => {

    //Enable notifications
    ecg_device.ble.start_notifications(ecg_service, channel_1);
    ecg_device.ble.start_notifications(ecg_service, channel_2);
    ecg_device.ble.start_notifications(ecg_service, channel_3);
    ecg_device.ble.start_notifications(ecg_service, channel_4);
    ecg_device.ble.start_notifications(ecg_service, channel_5);
    ecg_device.ble.start_notifications(ecg_service, channel_6);
    ecg_device.ble.start_notifications(ecg_service, channel_7);
    ecg_device.ble.start_notifications(ecg_service, channel_8);

  });
}
