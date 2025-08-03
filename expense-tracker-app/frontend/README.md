# Expense Tracker Frontend

A modern React application for tracking expenses with dark mode support, real-time currency updates, and a clean UI built with Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **React 19** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - API client

## 📂 Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ExpenseCard.jsx     # Individual expense display
│   │   ├── ExpenseDetails.jsx  # Expense modal view
│   │   ├── ExpenseList.jsx     # List of expenses
│   │   ├── Reports.jsx         # Analytics & reports
│   │   └── Settings.jsx        # App settings & preferences
│   ├── App.jsx                 # Main application
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── index.html                # HTML template
└── vite.config.js           # Vite configuration
```

## ✨ Features

### 💰 Expense Management
- Add, view, and track expenses
- Categorize expenses
- Date-wise organization
- Currency customization (₹, $, €, £)

### 🎨 UI/UX
- Dark/Light theme
- Responsive design
- Loading states
- Error handling
- Modal interactions
- Clean animations

### 📊 Reports & Analytics
- Total expenses overview
- Category-wise breakdown
- Monthly trends
- Visual data representation

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=http://localhost:8000  # Backend API URL
```

### Docker Support

#### Production Build
```bash
docker build -t expense-tracker-frontend .
docker run -p 80:80 expense-tracker-frontend
```
