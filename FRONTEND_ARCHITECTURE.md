# Frontend Architecture Overview

## Project Structure

```
frontend/
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Main app with routing & layout
│   ├── index.css                   # Global styles with Tailwind
│   ├── components/
│   │   └── UI.jsx                  # Reusable UI components
│   ├── pages/
│   │   ├── Dashboard.jsx           # Dashboard with charts
│   │   ├── Expenses.jsx            # Expense CRUD
│   │   ├── Categories.jsx          # Category management
│   │   └── Settings.jsx            # Email configuration
│   └── services/
│       └── api.js                  # API service layer
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
- Main entry point with React Router
- Sidebar navigation
- Header with user menu
- Main content area
- Mobile responsive

### Pages

#### Dashboard.jsx
- Displays summary cards (total, count, average)
- Email sync button with loading state
- Line chart for monthly trend
- Pie chart for category breakdown
- Category breakdown table with percentages
- Alerts for sync status

#### Expenses.jsx
- Table view of all expenses
- Add/Edit/Delete functionality
- Filter by category and source
- Modal form for adding/editing
- Responsive design with actions column
- Empty state when no expenses

#### Categories.jsx
- Grid view of categories
- Color indicator for each category
- Add/Edit/Delete functionality
- Modal form with color picker
- Responsive grid layout

#### Settings.jsx
- Email configuration form
- Test connection button
- Email tips and documentation
- General settings information
- Help section with FAQs
- Alert status indicators

### Components (UI.jsx)
- **Alert**: Info, success, error, warning messages
- **Button**: Variants (primary, secondary, danger, outline), sizes, loading state
- **Card**: Reusable container component
- **Modal**: Reusable dialog with confirm/cancel
- **Loading**: Spinner component
- **EmptyState**: Icon, title, description for empty lists

## API Integration

### Services/api.js
RESTful API client using Axios with organized endpoints:

- **expensesAPI**: CRUD operations + filtering
- **categoriesAPI**: Category management
- **reportsAPI**: Analytics and summaries
- **syncAPI**: Email sync
- **settingsAPI**: Email configuration + testing

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
- Real-time spending overview
- Automatic chart updates
- Email sync integration
- Category analytics

### Expenses Management
- CRUD operations
- Advanced filtering
- Date picker
- Category assignment
- Source tracking

### Categories
- Custom colors
- Color picker
- Descriptions
- Bulk management

### Settings
- Email account configuration
- Connection testing
- Help documentation
- System information

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

- **react**: UI framework
- **react-dom**: DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **recharts**: Chart library
- **lucide-react**: Icon library
- **tailwindcss**: Utility CSS
- **vite**: Build tool

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
