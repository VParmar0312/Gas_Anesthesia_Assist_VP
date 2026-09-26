export interface KeyValue {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}
export type Snapshot<T> = { data: T; loaded: boolean; error: string | null };
/** One serialized writer per key. Never replaces invalid raw data automatically. */
export class Store<T> {
  private current: Snapshot<T>;
  private listeners = new Set<() => void>();
  private queue: Promise<unknown> = Promise.resolve();
  private loading?: Promise<void>;
  private valid = false;
  constructor(
    private kv: KeyValue,
    readonly key: string,
    private initial: T,
    private validate: (value: unknown) => value is T,
    private migrate?: () => Promise<T>,
  ) {
    this.current = { data: initial, loaded: false, error: null };
  }
  snapshot = () => this.current;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(data: T, error: string | null = null) {
    this.current = { data, error, loaded: true };
    this.listeners.forEach((f) => f());
  }
  load = () =>
    (this.loading ??= (async () => {
      try {
        const raw = await this.kv.getItem(this.key);
        if (raw === null) {
          const data = this.migrate ? await this.migrate() : this.initial;
          if (!this.validate(data))
            throw new Error(
              "Legacy data needs manual recovery. Original data has been preserved.",
            );
          if (this.migrate)
            await this.kv.setItem(
              this.key,
              JSON.stringify({ version: 1, data }),
            );
          this.valid = true;
          this.publish(data);
        } else {
          const parsed = JSON.parse(raw);
          if (parsed.version !== 1 || !this.validate(parsed.data))
            throw new Error(
              "Unsupported or damaged data. Export the raw backup before recovery.",
            );
          this.valid = true;
          this.publish(parsed.data);
        }
      } catch (error) {
        this.publish(
          this.initial,
          error instanceof Error ? error.message : "Storage unavailable",
        );
      }
    })());
  update = (change: (current: T) => T): Promise<void> => {
    const run = this.queue.then(async () => {
      await this.load();
      if (!this.valid)
        throw new Error("Storage is unavailable. Recover it before saving.");
      const next = change(this.current.data);
      if (!this.validate(next))
        throw new Error("Invalid data; nothing was saved.");
      const previous = await this.kv.getItem(this.key);
      if (previous !== null)
        await this.kv.setItem(`${this.key}:previous`, previous);
      await this.kv.setItem(
        this.key,
        JSON.stringify({ version: 1, data: next }),
      );
      this.publish(next);
    });
    this.queue = run.catch((error) =>
      this.publish(
        this.current.data,
        error instanceof Error ? error.message : "Save failed",
      ),
    );
    return run;
  };
  /** Explicit recovery only: preserve the current raw payload even when it is invalid. */
  recoverWith = (next: T): Promise<void> => {
    const run = this.queue.then(async () => {
      await this.load();
      if (!this.validate(next)) throw new Error("Replacement data is invalid.");
      const raw = await this.kv.getItem(this.key);
      if (raw !== null)
        await this.kv.setItem(`${this.key}:recovery:${Date.now()}`, raw);
      await this.kv.setItem(
        this.key,
        JSON.stringify({ version: 1, data: next }),
      );
      this.valid = true;
      this.publish(next);
    });
    this.queue = run.catch((error) =>
      this.publish(
        this.current.data,
        error instanceof Error ? error.message : "Recovery failed",
      ),
    );
    return run;
  };
  startFresh = () => this.recoverWith(this.initial);
  raw = () => this.kv.getItem(this.key);
  recoverPrevious = (): Promise<void> => {
    const run = this.queue.then(async () => {
      await this.load();
      const raw = await this.kv.getItem(`${this.key}:previous`);
      if (!raw) throw new Error("No previous backup is available.");
      const parsed = JSON.parse(raw);
      if (parsed.version !== 1 || !this.validate(parsed.data))
        throw new Error("Backup is invalid.");
      const damaged = await this.kv.getItem(this.key);
      if (damaged)
        await this.kv.setItem(`${this.key}:recovery:${Date.now()}`, damaged);
      await this.kv.setItem(this.key, raw);
      this.valid = true;
      this.publish(parsed.data);
    });
    this.queue = run.catch((error) =>
      this.publish(
        this.current.data,
        error instanceof Error ? error.message : "Recovery failed",
      ),
    );
    return run;
  };
}
