type Slot = 'games' | 'ranking' | 'levels' | 'custom-games';

export default class Storage {
  static get<T>(slot: Slot): StorageQuery<StorageEntry<T>> {
    // Get value from given slot
    const value = localStorage.getItem(slot);

    // Parse got values into an array
    const items: StorageEntry<T>[] = value ? JSON.parse(value) : [];

    return new StorageQuery<StorageEntry<T>>(items);
  }

  static append<T extends IdentifiableItem>(slot: Slot, value: T): void {
    // Get current values in given slot
    const other = Storage.get<T>(slot).all;

    // Remove the item, that has the same id as new value
    const filtered = other.filter(entry => entry.id !== value.id);

    // Add new value
    filtered.push(value);

    // Save a JSON string
    const json = JSON.stringify(filtered);
    localStorage.setItem(slot, json);
  }

  static remove<T>(slot: Slot, id: string): StorageEntry<T> | undefined {
    // Get current values in given slot
    const entries = Storage.get<T>(slot).all;

    // Find index of the entry with given id
    const index = entries.findIndex(value => value.id === id);

    // If the entry was not found, stop function execution
    if (index === -1) return;

    // Remove the item from the index found
    const removed = entries.splice(index, 1);

    // Save a JSON string
    const json = JSON.stringify(entries);
    localStorage.setItem(slot, json);

    return removed[0];
  }
}

export interface IdentifiableItem {
  id: string;
}

export type StorageEntry<T> = T & IdentifiableItem;

export class StorageQuery<T extends IdentifiableItem> {
  constructor(private readonly items: T[]) {}

  get all(): T[] {
    return this.items;
  }

  findOne(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }
}
