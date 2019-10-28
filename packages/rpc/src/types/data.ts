export interface DataParser {
  serialize: (data: object) => DataOutput | Promise<DataOutput>;
  deserialize: (data: DataInput) => object | Promise<object>;
}

export type DataInput = string | Buffer | ArrayBuffer | Buffer[];
export type DataOutput = string | Buffer;
