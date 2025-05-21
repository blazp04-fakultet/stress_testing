your-project-name/
├── .env                 # Environment variables (DB connection, API keys, etc.) - DO NOT COMMIT SENSITIVE DATA
├── .gitignore           # Git ignore file
├── deno.json            # Deno configuration (tasks, import map, lint, fmt)
├── main.ts              # Main application entry point (production)
│
├── src/                 # Source code directory
    ├── api/             # API route definitions and handlers
    │   ├── v1/          # API Versioning (optional but recommended)
    │   │   ├── routes/      # Route definitions
    │   │   │   ├── index.ts   # Combines all v1 routers
    │   │   │   ├── drones.ts   # Routes for drone resources
    │   │   ├── handlers/    # Request handling logic (controllers)
    │   │   │   ├── droneHandlers.ts
    │   │   └── middleware/  # Route-specific middleware (if needed)
    │   │       └── ...
    │
    ├── core/            # Core application logic and infrastructure
    │   ├── auth/        # Authentication logic (e.g., API key validation)
    │   │   └── apiKeyAuth.ts
    │   ├── cache/       # Caching setup and interaction (Redis)
    │   │   ├── client.ts  # Redis client setup
    │   │   └── cacheService.ts # Functions to interact with cache
    │   ├── config/      # Configuration loading
    │   │   └── mod.ts     # Loads and exports configuration
    │   ├── db/          # Database setup and interaction (PostgreSQL)
    │   │   ├── client.ts  # PostgreSQL client setup
    │   │   ├── repositories/ # Data access logic (optional, good for complex queries)
    │   │   │   └── droneRepository.ts
    │   │   │   └── ...
    │   │   └── migrations/ # Database migration files (if using a migration tool)
    │   │       └── ...
    │   ├── middleware/  # Global middleware (logging, error handling, CORS)
    │   │   ├── errorHandler.ts
    │   │   ├── logger.ts
    │   │   └── cors.ts
    │   ├── types/       # Shared TypeScript interfaces and types
    │   │   ├── db.ts      # Database model types
    │   │   ├── api.ts     # API request/response types
    │   │   └── index.ts   # Re-exports types
    │   └── utils/       # Utility functions (validation, formatting, etc.)
    │       └── ...
    │
    └── server.ts        # Server setup and initialization logic
