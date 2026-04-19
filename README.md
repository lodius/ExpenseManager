# Expense Manager

A comprehensive desktop application to manage monthly expenses from various sources. The app retrieves bank statement report emails from your mailbox and organizes them into monthly expense reports.

## Features

- 📊 **Dashboard**: Visual overview of spending with charts and statistics
- 💰 **Expense Management**: Add, edit, delete expenses with categorization
- 📧 **Email Integration**: Automatically import expenses from bank statement emails
- 🏷️ **Categories**: Create and manage expense categories with custom colors
- 📈 **Reports & Analytics**: Monthly, daily, and category-based expense breakdown
- ⚙️ **Settings**: Configure email accounts and application preferences
- 🖥️ **Desktop App**: Run locally on Windows, Mac, or Linux

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Recharts
- **Backend**: Python FastAPI + SQLAlchemy + SQLite
- **Desktop**: Electron
- **Email**: IMAP protocol

## Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ExpenseManager
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

   This will install:
   - Root dependencies (Electron, Concurrently)
   - Frontend dependencies (React, Vite, etc.)
   - Backend dependencies (FastAPI, SQLAlchemy, etc.)

3. **Configure Environment Variables**

   **Backend (.env file):**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```
   IMAP_SERVER=imap.gmail.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   DATABASE_URL=sqlite:///./data/expense_manager.db
   API_HOST=127.0.0.1
   API_PORT=8000
   ```

   **Frontend (.env file in frontend/ directory):**
   ```bash
   cd frontend
   cp .env.example .env
   ```

   Default settings should work for local development.

## Running the Application

### Development Mode

Run all services concurrently:
```bash
npm start
```

This will start:
- Backend API: `http://localhost:8000`
- Frontend Dev Server: `http://localhost:5173`
- Electron Desktop App

### Run Services Separately

**Backend only:**
```bash
npm run dev:backend
```
API: `http://localhost:8000`
Swagger Docs: `http://localhost:8000/docs`

**Frontend only:**
```bash
npm run dev:frontend
```

**Electron only:**
```bash
npm run dev:electron
```

## Building for Production

**Build frontend:**
```bash
npm run build:frontend
```

**Build Python dependencies:**
```bash
npm run build:backend
```

**Package Electron app:**
```bash
npm run build:electron
```

## Project Structure

```
ExpenseManager/
├── app/
│   └── main.js                 # Electron entry point
├── backend/
│   ├── main.py                 # FastAPI app
│   ├── database.py             # Database models and connection
│   ├── requirements.txt        # Python dependencies
│   ├── api/
│   │   ├── __init__.py
│   │   ├── expenses.py         # Expense endpoints
│   │   ├── categories.py       # Category endpoints
│   │   ├── reports.py          # Reports endpoints
│   │   ├── settings.py         # Settings endpoints
│   │   └── expenses_sync.py    # Email sync endpoint
│   ├── services/
│   │   ├── __init__.py
│   │   └── email_service.py    # Email/IMAP service
│   ├── models/
│   │   ├── __init__.py
│   │   └── expense.py          # Data models
│   └── core/
│       └── __init__.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # React entry point
│   │   ├── index.css           # Global styles
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     # Navigation sidebar component
│   │   │   └── UI.jsx          # Reusable UI components (Alert, Button, Card, Modal, etc.)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Dashboard page
│   │   │   ├── Expenses.jsx    # Expenses page
│   │   │   ├── Categories.jsx  # Categories page
│   │   │   └── Settings.jsx    # Settings page
│   │   └── services/
│   │       └── api.js          # API service layer
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   └── tailwind.config.js      # Tailwind configuration
├── data/                        # Database storage
├── package.json                # Root npm config
└── README.md                   # This file
```

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

### Key Endpoints

- `GET /api/expenses` - List expenses with filtering
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `GET /api/expenses/reports/summary` - Get expense summary
- `GET /api/expenses/reports/daily` - Get daily trend
- `GET /api/expenses/reports/category` - Get category breakdown
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `GET /api/reports/monthly` - Monthly summary
- `GET /api/reports/by-category` - Category spending breakdown
- `POST /api/sync/fetch-emails` - Sync bank statements
- `GET /api/settings` - Get email settings
- `POST /api/settings` - Save email settings
- `POST /api/settings/test` - Test email connection

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Copy the generated password
3. In Expense Manager Settings:
   - IMAP Server: `imap.gmail.com`
   - Email: Your Gmail address
   - Password: The generated App Password

### Outlook Setup

1. Enable App Passwords (if available on your account)
2. In Expense Manager Settings:
   - IMAP Server: `imap-mail.outlook.com`
   - Email: Your Outlook email
   - Password: Your Outlook password or App Password

## Features Overview

### Dashboard
- Total spending overview
- Monthly trend visualization
- Category breakdown with percentages
- Quick email sync button
- Key statistics (total, count, average)

### Expenses
- View all expenses in a table
- Add new expenses manually
- Edit existing expenses
- Delete expenses
- Filter by category and source
- Sort by date (newest first)

### Categories
- Manage expense categories
- Assign colors for visual identification
- Add descriptions
- Edit and delete categories

### Settings
- Configure email account
- Test email connection
- Help and documentation
- Application information

### Reports & Analytics
- Monthly breakdown by category
- Daily expense summary
- Category-based spending analysis
- Custom date range reports
- Visual charts and statistics

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (3.8+)
- Install dependencies: `pip install -r backend/requirements.txt`
- Check if port 8000 is available

### Frontend won't load
- Check Node version: `node --version` (18+)
- Install dependencies: `cd frontend && npm install`
- Check if port 5173 is available

### Email sync not working
- Verify email settings in Settings page
- Check IMAP server is correct for your email provider
- For Gmail, use App Password not regular password
- Check firewall/antivirus isn't blocking IMAP port 993

### Database errors
- Ensure `data/` directory exists and is writable
- Delete `data/expense_manager.db` to reset database
- Check file permissions

## Development Notes

### Adding New API Endpoints

1. Create new route file in `backend/api/`
2. Define Pydantic models and endpoints
3. Import in `backend/main.py`
4. Add router to FastAPI app

### Adding New Frontend Pages

1. Create new JSX file in `frontend/src/pages/`
2. Import components and API services
3. Add route in `frontend/src/App.jsx`
4. Add navigation link in sidebar

### Database Migrations

Currently uses SQLAlchemy's automatic schema creation. For schema changes:
1. Modify models in `backend/database.py`
2. Delete `data/expense_manager.db`
3. Restart backend to recreate schema

## Performance Tips

- Limit monthly queries to last 12-24 months for better performance
- Archive old expenses in separate tables if dataset grows large
- Consider implementing pagination for large expense lists
- Use database indexing on frequently queried fields

## Future Enhancements

- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Budget alerts and warnings
- [ ] Receipt image upload
- [ ] Data export (PDF, CSV)
- [ ] Cloud backup and sync
- [ ] Mobile app
- [ ] API authentication and user accounts
- [ ] Advanced filtering and search
- [ ] Recurring expenses
- [ ] Bill reminders

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Changelog

### Version 1.0.0 (April 2025)
- Initial release
- Core expense management features
- Email integration with IMAP support
- Dashboard with analytics and charts
- Category management with custom colors
- Settings and configuration
- Multi-currency support (USD/VND)

---

**Happy expense tracking! 📊💰**
