import { join } from "jsr:@std/path@1/join";
import { Client } from "jsr:@jersey/postgres";

const MIGRATIONS_DIR = "./src/core/db/migrations";

interface MigrationRecord {
  id: number;
  name: string;
  filename: string;
  applied_at: Date;
}

export class Migrator {
  private client: Client;
  private initialized = false;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Initialize the migration system and run pending migrations
   */
  async initialize(): Promise<void> {
    console.log("Checking database migrations...");

    // Make sure migration table exists
    await this.createMigrationTableIfNotExists();
    this.initialized = true;

    // Check and apply migrations
    await this.applyPendingMigrations();
  }

  /**
   * Creates the migrations table if it doesn't exist
   */
  private async createMigrationTableIfNotExists(): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        filename TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  /**
   * Load all migration files from the migrations directory
   */
  private async loadMigrationFiles(): Promise<string[]> {
    try {
      const files = [];
      for await (const entry of Deno.readDir(MIGRATIONS_DIR)) {
        if (entry.isFile && entry.name.match(/^\d+_.*\.(sql|js|ts)$/)) {
          files.push(entry.name);
        }
      }
      // Sort files by their numeric prefix
      return files.sort((a, b) => {
        const numA = parseInt(a.split("_")[0]);
        const numB = parseInt(b.split("_")[0]);
        return numA - numB;
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.log(
          `Migrations directory not found. Creating ${MIGRATIONS_DIR}...`
        );
        await Deno.mkdir(MIGRATIONS_DIR, { recursive: true });
        return [];
      }
      throw error;
    }
  }

  /**
   * Get list of already applied migrations
   */
  private async getAppliedMigrations(): Promise<MigrationRecord[]> {
    const result = await this.client.queryObject<MigrationRecord>(
      "SELECT id, name, filename, applied_at FROM migrations ORDER BY id"
    );
    return result.rows;
  }

  /**
   * Check for pending migrations and apply them
   */
  private async applyPendingMigrations(): Promise<void> {
    if (!this.initialized) {
      throw new Error("Migration system not initialized");
    }

    // Get list of all migrations
    const migrationFiles = await this.loadMigrationFiles();

    // Get already applied migrations
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedFilenames = new Set(appliedMigrations.map((m) => m.filename));

    // Find migrations that haven't been applied yet
    const pendingMigrations = migrationFiles.filter(
      (file) => !appliedFilenames.has(file)
    );

    if (pendingMigrations.length === 0) {
      console.log("No pending migrations to apply.");
      return;
    }

    console.log(
      `Found ${pendingMigrations.length} pending migrations to apply...`
    );

    // Apply each pending migration
    for (const filename of pendingMigrations) {
      await this.applyMigration(filename);
    }

    console.log("All migrations applied successfully.");
  }

  /**
   * Apply a single migration file
   */
  private async applyMigration(filename: string): Promise<void> {
    console.log(`Applying migration: ${filename}`);

    const filepath = join(MIGRATIONS_DIR, filename);

    try {
      // Handle different file types
      if (filename.endsWith(".sql")) {
        await this.applySqlMigration(filepath, filename);
      } else if (filename.endsWith(".js") || filename.endsWith(".ts")) {
        await this.applyJsTsMigration(filepath, filename);
      } else {
        throw new Error(`Unsupported migration file type: ${filename}`);
      }

      // Record the migration as applied
      const name = filename
        .split("_")
        .slice(1)
        .join("_")
        .replace(/\.(sql|js|ts)$/, "");
      await this.recordAppliedMigration(name, filename);

      console.log(`Successfully applied migration: ${filename}`);
    } catch (error) {
      console.error(`Failed to apply migration ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Apply a SQL migration file
   */
  private async applySqlMigration(
    filepath: string,
    filename: string
  ): Promise<void> {
    const sql = await Deno.readTextFile(filepath);

    // Check if transaction should be disabled
    const disableTransaction = sql
      .trim()
      .startsWith("-- migrate disableTransaction");

    if (disableTransaction) {
      // Run without transaction
      await this.client.queryArray(sql);
    } else {
      // Run within transaction
      const transaction = this.client.createTransaction(
        `migration_${filename}`
      );
      await transaction.begin();

      try {
        await transaction.queryArray(sql);
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  }

  /**
   * Apply  TypeScript migration file
   */
  private async applyJsTsMigration(
    filepath: string,
    filename: string
  ): Promise<void> {
    // Import the migration module
    const migration = await import(`file://${Deno.cwd()}/${filepath}`);

    if (typeof migration.generateQueries !== "function") {
      throw new Error(
        `Migration file ${filename} does not export generateQueries function`
      );
    }

    const queries = migration.generateQueries();
    const disableTransaction = migration.disableTransaction === true;

    if (disableTransaction) {
      // Run without transaction
      for await (const query of queries) {
        if (typeof query === "string") {
          await this.client.queryArray(query);
        } else {
          await this.client.queryArray(query.text, query.args || []);
        }
      }
    } else {
      // Run within transaction
      const transaction = this.client.createTransaction(
        `migration_${filename}`
      );
      await transaction.begin();

      try {
        for await (const query of queries) {
          if (typeof query === "string") {
            await transaction.queryArray(query);
          } else {
            await transaction.queryArray(query.text, query.args || []);
          }
        }
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  }

  /**
   * Record a migration as having been applied
   */
  private async recordAppliedMigration(
    name: string,
    filename: string
  ): Promise<void> {
    await this.client.queryArray(
      "INSERT INTO migrations (name, filename) VALUES ($1, $2)",
      [name, filename]
    );
  }
}

// Example usage function to be called during backend startup
export async function initializeMigrations(dbClient: Client): Promise<void> {
  const migrator = new Migrator(dbClient);
  await migrator.initialize();
}
