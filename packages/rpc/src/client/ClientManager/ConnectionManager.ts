import { RPCClientConnection, RPCClientStatus } from '../types';
import { BehaviorSubject, Subject, Observable, Subscription } from 'rxjs';
import { DataInput, DataParser, RPCRequest, RPCNotification } from '~/types';
import { until } from 'promist';
import DataLoader from 'dataloader';

interface ConnectionManagerSubjects {
  status: BehaviorSubject<RPCClientStatus>;
  errors: Subject<Error>;
}

export class ConnectionManager {
  public errors: Error[];
  private connection: RPCClientConnection;
  private loader: DataLoader<RPCRequest | RPCNotification, null | Error>;
  private subjects: ConnectionManagerSubjects;
  private subscription: Subscription;
  public constructor(
    connection: RPCClientConnection,
    parser: DataParser,
    onData: (data: object) => void,
    batchRequests: boolean
  ) {
    this.errors = [];

    this.connection = connection;
    this.loader = new DataLoader<RPCRequest | RPCNotification, null | Error>(
      async (arr) => {
        try {
          await this.connection.actions.send(await parser.serialize(arr));
          return Array(arr.length).fill(null);
        } catch (err) {
          return Array(arr.length).fill(err);
        }
      },
      { batch: batchRequests, cache: false }
    );
    this.subjects = {
      status: new BehaviorSubject<RPCClientStatus>(connection.status),
      errors: new Subject<Error>()
    };

    const deserialize = async (data: DataInput): Promise<object> => {
      return parser.deserialize(data);
    };
    this.subscription = connection.events$.subscribe({
      next: (value) => {
        if (this.status === 'complete') return;
        switch (value.event) {
          case 'open': {
            return this.nextStatus('open');
          }
          case 'close': {
            if (value.data) this.nextError(value.data);
            return this.nextStatus('close');
          }
          case 'data': {
            return deserialize(value.data)
              .then((data) => onData(data))
              .catch((err) => this.nextError(err));
          }
          default: {
            try {
              this.nextError(
                Error(`Unexpected event: ${(value as any).event}`)
              );
            } catch (err) {
              this.nextError(err);
            }
          }
        }
      },
      error: (err) => {
        if (this.status === 'complete') return;
        this.nextError(err);
        this.close();
      },
      complete: () => {
        if (this.status === 'complete') return;
        this.close();
      }
    });
  }
  public get status(): RPCClientStatus {
    return this.subjects.status.value === 'complete'
      ? 'complete'
      : this.connection.status;
  }
  public get status$(): Observable<RPCClientStatus> {
    return this.subjects.status.asObservable();
  }
  public get errors$(): Observable<Error> {
    return this.subjects.errors.asObservable();
  }
  public async send(data: RPCRequest | RPCNotification): Promise<void> {
    if (this.status === 'complete') return;

    await this.loader.load(data);
  }
  public report(error: Error): void {
    if (this.status === 'complete') return;
    return this.nextError(error);
  }
  public close(): void {
    if (this.status === 'complete') return;

    this.connection.actions.close();
    until(() => Boolean(this.subscription)).then(() => {
      return this.subscription.unsubscribe();
    });

    this.nextStatus('close');
    this.nextStatus('complete');
    this.subjects.status.complete();
    this.subjects.errors.complete();
  }
  private nextStatus(status: RPCClientStatus): void {
    if (
      this.subjects.status.value !== 'complete' &&
      this.subjects.status.value !== status
    ) {
      this.subjects.status.next(status);
    }
  }
  private nextError(error: Error): void {
    this.errors = this.errors.concat(error);
    this.subjects.errors.next(error);
  }
}
