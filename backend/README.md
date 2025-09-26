# SihCow Backend API

Backend API for the SihCow cow breed detection application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
MONGO_URI=mongodb://127.0.0.1:27017/SihCow
PORT=4000
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with auto-restart
- `npm run dev:fast` - Start development server without auto-restart
- `npm run build` - Build the project
- `npm start` - Start production server

## API Endpoints

- `GET /health` - Health check
- `GET /animals` - Get all animals
- `POST /animals` - Create new animal
- `DELETE /animals/:id` - Delete animal

## MongoDB Setup

Install and start MongoDB:
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Or start manually
mongod
```
