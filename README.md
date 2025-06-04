# Riffle Validation - Offline-First Conflict Resolution Backend

A NestJS backend that provides RESTful APIs for an offline-first application with automatic conflict resolution. The system is inspired by Riffle's reactive relational state management but focused on document synchronization with conflict detection and resolution.

## Features

- Offline-first architecture
- Automatic conflict detection and resolution
- Version tracking for documents
- Incremental synchronization
- Soft delete support
- RESTful API endpoints

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v15 or later)
- Docker and Docker Compose (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=riffle_validation
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd riffle-validation
```

2. Install dependencies:
```bash
npm install
```

3. Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

4. Start the development server:
```bash
npm run start:dev
```

## API Endpoints

### Documents

- `POST /documents` - Create new document
- `GET /documents` - List all active documents
- `GET /documents/:id` - Get specific document
- `PUT /documents/:id` - Update document (with conflict detection)
- `DELETE /documents/:id?clientId=uuid` - Soft delete document
- `POST /documents/sync` - Incremental sync since timestamp
- `GET /documents/conflicts` - Get pending conflicts
- `POST /documents/resolve-conflict` - Resolve conflicts

## Conflict Resolution

The system detects conflicts in two scenarios:
1. Version mismatch: When the client's version doesn't match the expected next version
2. Timestamp issue: When the server has a newer version than the client's timestamp

When a conflict is detected, the system:
1. Marks the original document as having a conflict
2. Creates a conflict record
3. Returns a 409 Conflict response with both versions
4. Allows the client to resolve the conflict through the resolution endpoint

## Development

```bash
# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run in production mode
npm run start:prod

# Run tests
npm run test
```

## License

This project is licensed under the MIT License.
