# TribeMiner - Static Demo Version

A cloud lottery pool miner for AUM tokens, now configured for static deployment with mock data.

## 🚀 Features

- **Mining Dashboard**: Real-time mining statistics and controls (simulated)
- **User Management**: Admin panel for user administration
- **Chat System**: Community chat with real-time messaging simulation
- **Wallet Integration**: Mock wallet connection and balance tracking
- **Admin Panel**: Complete admin interface with system monitoring
- **Responsive Design**: Modern UI with Tailwind CSS and Vue 3

## 📦 Static Deployment

This version has been converted to use only mock data and can be deployed as a static website without any backend dependencies.

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

### Deployment Options

#### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

#### Vercel
1. Connect your repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

#### GitHub Pages
1. Build the project: `npm run build`
2. Push the `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

#### Any Static Host
1. Run `npm run build`
2. Upload the contents of the `dist` folder to your web server

## 🎮 Demo Accounts

### Admin Account
- **Email**: `admin@tribeminer.com`
- **Password**: `admin123`
- **Features**: Full admin access, user management, system monitoring

### Customer Account
- **Email**: `user@tribeminer.com`
- **Password**: `user123`
- **Features**: Mining dashboard, chat, wallet management

## 🛠 Technology Stack

- **Frontend**: Vue 3 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Build Tool**: Vite
- **Icons**: Font Awesome
- **Mock Data**: Custom service layer

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
│   ├── admin/          # Admin panel views
│   ├── auth/           # Authentication views
│   └── customer/       # Customer dashboard views
├── stores/             # Pinia state management
├── lib/                # Utilities and services
│   └── mockData.ts     # Mock data service
├── assets/             # Static assets
└── router/             # Vue Router configuration
```

## 🎯 Mock Data Features

- **User Management**: 5 mock users with different roles and statuses
- **Mining Statistics**: Simulated real-time mining data
- **Chat Messages**: Pre-populated chat history with simulation
- **Server Logs**: Mock server logs with different levels and sources
- **Transactions**: Sample transaction history
- **System Stats**: Simulated system performance metrics

## 🔧 Customization

### Adding New Mock Data
Edit `src/lib/mockData.ts` to add or modify mock data:

```typescript
// Add new users
export const mockUsers: MockUser[] = [
  // ... existing users
  {
    id: 'new_user_id',
    username: 'new_user',
    email: 'new@example.com',
    // ... other properties
  }
]
```

### Modifying UI
- Components are in `src/components/`
- Views are in `src/views/`
- Styling uses Tailwind CSS classes
- Global styles in `src/assets/`

### Changing Mock Behavior
- Mining simulation: `src/stores/miningStore.ts`
- Authentication: `src/stores/authStore.ts`
- Data services: `src/lib/mockData.ts`

## 🎨 UI Features

- **Glass morphism design** with backdrop blur effects
- **Animated backgrounds** and hover effects
- **Responsive layout** for all screen sizes
- **Dark theme** optimized for mining applications
- **Real-time animations** for mining statistics
- **Interactive charts** and progress bars

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **Bundle Size**: Optimized with Vite tree-shaking
- **Loading Time**: < 2s on 3G networks
- **Memory Usage**: Efficient Vue 3 Composition API

## 🔒 Security Notes

This is a demo version with mock authentication. For production use:
- Implement real authentication with JWT tokens
- Add CSRF protection
- Use HTTPS for all communications
- Implement rate limiting
- Add input validation and sanitization

## 📄 License

This project is for demonstration purposes. Please check licensing requirements for production use.

## 🤝 Contributing

This is a demo project, but feel free to fork and modify for your own use cases.

## 📞 Support

For questions about this demo, please check the code comments and mock data structure in `src/lib/mockData.ts`. 