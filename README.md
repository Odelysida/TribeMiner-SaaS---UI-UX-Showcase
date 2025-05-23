# TribeMiner by BitTribe

A Cloud Lottery Pool Miner for AUM tokens with a modern Vue.js frontend and Elysia.js backend.

## Features

- Real-time mining status updates
- Pool statistics and rewards tracking
- Secure wallet integration
- Modern and responsive UI
- WebSocket-based mining updates

## Tech Stack

- Frontend:
  - Vue 3 with Composition API
  - TypeScript
  - Tailwind CSS
  - Pinia for state management
  - Vue Router

- Backend:
  - Elysia.js
  - WebSocket for real-time updates
  - TypeScript

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/tribeminer.git
cd tribeminer
```

2. Install dependencies:
```bash
npm install
```

## Development

1. Start the development server (both frontend and backend):
```bash
npm start
```

This will start:
- Frontend at: http://localhost:5173
- Backend at: http://localhost:3000
- Swagger UI at: http://localhost:3000/swagger

## Building for Production

1. Build the frontend:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Project Structure

```
tribeminer/
├── src/
│   ├── assets/         # Static assets
│   ├── backend/        # Backend server and services
│   ├── components/     # Vue components
│   ├── composables/    # Vue composables
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   └── views/          # Vue views/pages
├── public/             # Public static files
└── package.json        # Project configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 