import { randomUUID } from "crypto";

// Storage interface for future use if needed
export interface IStorage {
  // Placeholder for future storage operations
}

export class MemStorage implements IStorage {
  constructor() {
    // Placeholder for future storage operations
  }
}

export const storage = new MemStorage();
