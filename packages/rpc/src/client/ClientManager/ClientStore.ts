import {
  RetrySubscribe,
  PendingStreamRequest,
  PendingUnaryRequest
} from './types';

export class ClientStore {
  private history: { [key: string]: boolean };
  private unary: { [key: string]: PendingUnaryRequest };
  private stream: { [key: string]: PendingStreamRequest };
  private retries: { [key: string]: RetrySubscribe };
  public constructor() {
    this.history = {};
    this.unary = {};
    this.stream = {};
    this.retries = {};
  }
  public exists(
    id: string | number,
    from: 'history' | 'unary' | 'stream' | 'retries'
  ): boolean {
    return Object.hasOwnProperty.call(this[from], this.toStringId(id));
  }
  public ids(
    from: 'history' | 'unary' | 'stream' | 'retries'
  ): Array<string | number> {
    return Object.keys(this[from]).map((stringId) =>
      this.fromStringId(stringId)
    );
  }
  public getHistory(id: string | number): boolean | null {
    return this.history[this.toStringId(id)] || null;
  }
  public setHistory(id: string | number, value: boolean | null): void {
    if (value !== null) {
      this.history[this.toStringId(id)] = value;
    } else {
      delete this.history[this.toStringId(id)];
    }
  }
  public getUnary(id: string | number): PendingUnaryRequest | null {
    return this.unary[this.toStringId(id)] || null;
  }
  public setUnary(
    id: string | number,
    value: PendingUnaryRequest | null
  ): void {
    if (value) {
      this.unary[this.toStringId(id)] = value;
    } else {
      delete this.unary[this.toStringId(id)];
    }
  }
  public getStream(id: string | number): PendingStreamRequest | null {
    return this.stream[this.toStringId(id)] || null;
  }
  public setStream(
    id: string | number,
    value: PendingStreamRequest | null
  ): void {
    if (value) {
      this.stream[this.toStringId(id)] = value;
    } else {
      delete this.stream[this.toStringId(id)];
    }
  }
  public getRetry(id: string | number): RetrySubscribe | null {
    return this.retries[this.toStringId(id)] || null;
  }
  public setRetry(id: string | number, value: RetrySubscribe | null): void {
    if (value) {
      this.retries[this.toStringId(id)] = value;
    } else {
      delete this.retries[this.toStringId(id)];
    }
  }
  private toStringId(id: string | number): string {
    return `${typeof id}:${id}`;
  }
  private fromStringId(id: string): string | number {
    const [type, ...str] = id.split(':');
    return type === 'number' ? parseInt(str[0]) : str.join(':');
  }
}
