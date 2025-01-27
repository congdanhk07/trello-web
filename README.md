# Trello Clone

A modern Trello clone built with React and Material-UI (MUI) that implements a drag-and-drop Kanban board system.

## Requirements

```
* nodejs = v18.16.0
* npm = v9.5.1
* yarn = v1.22.19

* "react": "^18.2.0"
* "react-dom": "^18.2.0"
* "@types/react": "^18.0.28"
* "@types/react-dom": "^18.0.11"

* "vite": "^4.3.2"
* "@vitejs/plugin-react-swc": "^3.0.0"

* "eslint": "^8.38.0"
* "eslint-plugin-react": "^7.32.2"
* "eslint-plugin-react-hooks": "^4.6.0"
* "eslint-plugin-react-refresh": "^0.3.4"
```

## Features

- 🎯 Modern and responsive UI using Material-UI (MUI)
- 🎨 Dark/Light mode support
- 🔄 Drag and drop functionality for cards and columns
- 📱 Mobile-friendly design
- 🎭 Customizable board layouts
- 👥 User management and authentication system
- 🔍 Search functionality
- 📋 Board management features

## Tech Stack

- **Frontend Framework:** React
- **UI Library:** Material-UI (MUI)
- **Drag & Drop:** @dnd-kit
- **State Management:** React Hooks
- **Styling:** MUI's styling solution with CSS-in-JS
- **Icons:** Material Icons

## Project Structure

```
src/
├── apis/
├── assets/
├── components/
│   ├── AppBar/
│   └── ModeSelect/
├── pages/
│   ├── Auth/
│   ├── Boards/
│   └── Users/
├── utils/
├── App.jsx
├── main.jsx
└── theme.js
```

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

## Key Features Implementation

### Board Management

- Columns and cards can be dragged and dropped
- Real-time updates of card positions
- Smooth animations during drag and drop operations

### User Interface

- Clean and intuitive design
- Responsive layout that works on all devices
- Custom scrollbars for better user experience
- Modern Material Design components

### Customization

- Theme customization support
- Custom board layouts
- Flexible column and card management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
