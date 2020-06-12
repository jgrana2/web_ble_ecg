import { BLEManager } from "./BLEManager";
import { Device } from "./Device";
import { Service } from "./Service";
import { Characteristic } from "./Characteristic";
import { SignalCanvas } from "./SignalCanvas";
import { Container } from "./Container";

// document.addEventListener('DOMContentLoaded', (event) => {
//   main();
// });

document.querySelector("#connect_button").addEventListener("click", () => {
  main();
});

function main() {
  //Welcome
  console.log("IECG v0.1", new Date().toString()); //Internet ECG v0.1

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

  //Create BLE Manager
  let ble = new BLEManager();

  //Create ECG Device
  let ecg_device = new Device("1A", ble);

  //Connect to ECG Device
  ecg_device.ble.connect(ecg_service).then(() => {

    //Create web page container
    let container = new Container("#363537", "10px");

    //Create canvas
    let lead_I_canvas = new SignalCanvas(container, "lead_I", -1, -1, "rgba(12,206,107,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_II_canvas = new SignalCanvas(container, "lead_II", -1, -1, "rgba(220,237,49,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_III_canvas = new SignalCanvas(container, "lead_III", -1, -1, "rgba(239,45,86,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_aVR_canvas = new SignalCanvas(container, "lead_aVR", -1, -1, "rgba(237,125,58,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_aVL_canvas = new SignalCanvas(container, "lead_aVL", -1, -1, "rgba(202,12,206,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_aVF_canvas = new SignalCanvas(container, "lead_aVF", -1, -1, "rgba(72,145,255,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_V1_canvas = new SignalCanvas(container, "lead_V1", -1, -1, "rgba(255,205,107,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_V2_canvas = new SignalCanvas(container, "lead_V2", -1, -1, "rgba(255,112,215,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_V3_canvas = new SignalCanvas(container, "lead_V3", -1, -1, "rgba(237,125,58,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_V4_canvas = new SignalCanvas(container, "lead_V4", -1, -1, "rgba(12,206,107,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_V5_canvas = new SignalCanvas(container, "lead_V5", -1, -1, "rgba(239,45,86,0.1)", "#0CCE6B", 0, 0, 2);
    let lead_V6_canvas = new SignalCanvas(container, "lead_V6", -1, -1, "rgba(202,12,206,0.1)", "#0CCE6B", 0, 0, 2);

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