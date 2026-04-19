# Frontend Architecture Overview

## Project Structure

```
frontend/
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Main app with routing & layout
│   ├── index.css                   # Global styles with Tailwind
│   ├── components/
│   │   ├── Sidebar.jsx             # Navigation sidebar component
│   │   └── UI.jsx                  # Reusable UI components (Alert, Button, Card, Modal, Loading, EmptyState)
│   ├── pages/
│   │   ├── Dashboard.jsx           # Dashboard with charts and analytics
│   │   ├── Expenses.jsx            # Expense CRUD with filtering
│   │   ├── Categories.jsx          # Category management with colors
│   │   └── Settings.jsx            # Email configuration and help
│   └── services/
│       └── api.js                  # API service layer (Axios)
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite build config
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS plugins
├── package.json                    # Dependencies
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
└── node_modules/                   # Dependencies (after npm install)
```

## Component Architecture

### App.jsx
- Main entry point with React Router (BrowserRouter)
- Dual sidebar navigation (desktop sidebar + mobile slide-out menu)
- Header with hamburger menu toggle
- Main content area with routing
- Fully mobile responsive with breakpoints

### Pages

#### Dashboard.jsx
- Summary cards (total expenses, count, average)
- Currency selector (USD/VND) with localStorage persistence
- Email sync button with loading state
- Daily trend chart (ComposedChart with Bar and Line)
- Category pie chart with color coding
- Category breakdown section with progress bars
- Alert notifications for sync status
- Uses Sidebar component for navigation

#### Expenses.jsx
- Table view of all expenses with sorting
- Add/Edit/Delete functionality with modals
- Filter by category (text input) and source (dropdown)
- Form validation for required fields
- Date picker for expense date
- Source selection (Manual/Email)
- Responsive table design with action buttons
- Empty state with icon when no expenses

#### Categories.jsx
- Grid view of categories with color indicators
- Add/Edit/Delete functionality with modals
- Color picker input for category colors
- Description field support
- Duplicate category name validation
- Responsive grid layout (1-3 columns based on screen size)
- Empty state when no categories

#### Settings.jsx
- Email configuration form (IMAP server, email, password)
- Test connection button with loading state
- Connection status indicator (configured/not configured)
- Gmail App Password help section with link
- General settings information (version, database location, API endpoint)
- FAQ help section
- Alert notifications for success/error messages

### Components

#### UI.jsx
- **Alert**: Info, success, error, warning messages with icons and close button
- **Button**: Variants (primary, secondary, danger, outline), sizes (sm, md, lg), loading state
- **Card**: Reusable container component with shadow
- **Modal**: Reusable dialog with confirm/cancel actions and loading state
- **Loading**: Spinner component for loading states
- **EmptyState**: Icon, title, description for empty lists

#### Sidebar.jsx
- Navigation sidebar with logo and menu items
- Links to Dashboard, Expenses, Categories, Settings
- Logout button (placeholder)
- Indigo color theme matching app branding

## API Integration

### Services/api.js
RESTful API client using Axios with organized endpoints:

- **expensesAPI**: CRUD operations + filtering (create, getAll, getById, update, delete)
- **categoriesAPI**: Category management (getAll, create, update, delete)
- **reportsAPI**: Analytics and summaries (getSummary, getDaily, getByCategory)
- **syncAPI**: Email sync (fetchEmails)
- **settingsAPI**: Email configuration (getAll, save, test connection)

Base URL configured via `VITE_API_URL` environment variable (defaults to `http://localhost:8000/api`)

All endpoints configured with:
- Base URL from environment variables
- JSON content type
- Error handling
- Consistent response format

## Styling & Design

### Tailwind CSS
- Utility-first CSS framework
- Custom colors: blue theme
- Responsive breakpoints (mobile, tablet, desktop)
- Dark-friendly color palette

### Layout
- Sidebar navigation (fixed on desktop, hamburger on mobile)
- Sticky header
- Main content area with padding
- Responsive grid layouts

### Design Patterns
- Consistent button styling
- Modal dialogs for forms
- Alert messages for feedback
- Loading states
- Empty states
- Hover effects and transitions

## Features

### Dashboard
- Real-time spending overview with summary cards
- Currency formatting (USD/VND)
- Automatic chart updates on data changes
- Email sync integration with loading states
- Category analytics with visual breakdown

### Expenses Management
- Full CRUD operations with validation
- Filter by category (text) and source (dropdown)
- Date picker for expense dates
- Category assignment with text input
- Source tracking (Manual/Email)

### Categories
- Custom colors
- Color picker
- Descriptions
- Bulk management

### Settings
- Email account configuration (IMAP server, email, password)
- Connection testing with timeout handling
- Gmail App Password help with external link
- System information (version, database path, API URL)
- FAQ help section

## State Management

### Local Component State
- React hooks (useState, useEffect)
- Form data handling
- Loading/error states
- Modal visibility

### API State
- Fetch on component mount
- Refetch after mutations
- Error handling and alerts
- Loading indicators

## Responsive Design

### Mobile (< 768px)
- Hamburger menu sidebar
- Full-width cards
- Stacked layouts
- Touch-friendly buttons

### Tablet (768px - 1024px)
- 2-column grid layouts
- Sidebar still visible
- Optimized tables

### Desktop (> 1024px)
- 3-column grids
- Full sidebar
- Optimized data tables

## Error Handling

- Network error alerts
- Validation error messages
- Graceful error recovery
- User-friendly error messages

## Performance Optimizations

- Code splitting via React Router
- Lazy component loading
- Image optimization (emojis used instead of images)
- Efficient re-renders with hooks
- Chart memoization via Recharts

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- **react**: UI framework (^18.2.0)
- **react-dom**: DOM rendering (^18.2.0)
- **react-router-dom**: Client-side routing (^6.20.0)
- **axios**: HTTP client (^1.15.0)
- **recharts**: Chart library (^3.8.1)
- **lucide-react**: Icon library (^0.263.1)
- **tailwindcss**: Utility CSS (^4.2.2)
- **vite**: Build tool (^5.0.0)
- **@tailwindcss/postcss**: Tailwind PostCSS plugin (^4.2.2)

## Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Creates optimized dist/ folder for production deployment.

## Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` file
3. Start development server: `npm run dev`
4. Test all pages and features
5. Test API integration
6. Deploy or package with Electron
