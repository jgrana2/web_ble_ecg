export class Characteristic {
  public uuid: number;
  // public data = new Int32Array(21); //21 Samples per packet
  constructor(uuid: number) {
    this.uuid = uuid;
  }

  //Function to handle notifications
  notication_handler(event: any) {
    this.convert_to_24_bits(event.target.value);
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
    console.log(data_array_24_bits, this.uuid.toString(16));
    return data_array_24_bits;
  }
}
