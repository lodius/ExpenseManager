# Quick Start Guide

## Prerequisites
- Node.js 18+ (check: `node --version`)
- Python 3.8+ (check: `python --version`)
- Git (optional)

## 1. Installation (5 minutes)

```bash
# Navigate to project directory
cd d:\work\ExpenseManager

# Install all dependencies (frontend, backend, Electron)
npm run install-all
```

## 2. Environment Setup (2 minutes)

### Backend Configuration

1. Create `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Edit `.env` and add your email settings:
```
IMAP_SERVER=imap.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
DATABASE_URL=sqlite:///./data/expense_manager.db
API_HOST=127.0.0.1
API_PORT=8000
```

**Note:** The `.env` file should be in the root directory (same level as `package.json`), not in the backend folder.

**For Gmail users:**
- Enable 2-Factor Authentication first
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" and "Windows Computer"
- Copy the generated password and paste it above

### Frontend Configuration

Frontend will use default settings. To customize:

1. Create `.env` file in `frontend/` directory:
```bash
cd frontend
cp .env.example .env
```

2. Optional customizations:
```
VITE_API_URL=http://localhost:8000/api
```

## 3. Running the Application

### Option A: Run Everything Together (Recommended)
```bash
npm start
```

This starts:
- ✅ Backend API (http://localhost:8000)
- ✅ Frontend Dev Server (http://localhost:5173)
- ✅ Electron Desktop App

Wait 10-15 seconds for everything to initialize.

**Access the application:**
- **Electron App**: Desktop window will open automatically
- **Web Browser**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs

### Option B: Run Services Separately
```bash
# Terminal 1: Backend API
npm run dev:backend
# Access: http://localhost:8000/docs (Swagger docs)

# Terminal 2: Frontend
npm run dev:frontend
# Access: http://localhost:5173

# Terminal 3: Electron (optional)
npm run dev:electron
```

## 4. First Time Use

### Create Your First Expense Category
1. Click "Categories" in the sidebar or navigation
2. Click "Add Category" button
3. Enter name: "Food"
4. Choose a color using the color picker (e.g., #3b82f6 for blue)
5. Add an optional description
6. Click "Create"

### Add Your First Expense
1. Click "Expenses" in the sidebar or navigation
2. Click "Add Expense" button
3. Fill in the form:
   - **Amount**: 50.00
   - **Description**: "Grocery shopping"
   - **Category**: "Food" (or any category you created)
   - **Source**: "Manual" (or "Email" if synced)
   - **Date**: Today's date
4. Click "Create"

### Setup Email Sync (Optional)
1. Click "Settings" in the sidebar or navigation
2. Fill in email configuration:
   - **IMAP Server**: `imap.gmail.com` (for Gmail) or `imap.outlook.com` (for Outlook)
   - **Email Address**: Your full email address
   - **Password**: App password (for Gmail) or regular password (for Outlook)
3. Click "Test Connection" to verify
4. If successful, click "Save Settings"

**Note for Gmail users:** You must use an App Password, not your regular Gmail password. See the help text in Settings for instructions.

### Sync Bank Statements
1. Go to "Dashboard"
2. Select your preferred currency (USD or VND) from the dropdown
3. Click "Sync Now" button
4. Wait for sync to complete (may take 30 seconds)
5. View imported expenses in the "Expenses" page
6. Check the daily trend chart and category breakdown for insights

## 5. Key Features

### Dashboard
- Overview of spending
- Monthly trend chart
- Category breakdown
- Quick email sync

### Expenses
- View all expenses
- Add/edit/delete expenses
- Filter by category or source
- See total, count, average

### Categories
- Create custom categories
- Assign colors
- Add descriptions
- Organize expenses

### Settings
- Configure email account
- Test email connection
- View application info

### Reports (Built-in API endpoints)
- Monthly summaries
- Daily breakdowns
- Category analysis
- Date range reports

## Troubleshooting

### Port Already in Use
If you see "Port 8000 already in use":
```bash
# Kill the process using port 8000
# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Email Connection Failed
- ✅ Check email and password are correct
- ✅ Gmail: Use App Password (not regular password)
- ✅ Check IMAP is enabled on your email account
- ✅ Firewall might be blocking IMAP port 993

### Frontend Won't Load
- ✅ Check port 5173 is available
- ✅ Try: `cd frontend && npm install`
- ✅ Clear browser cache (Ctrl+Shift+Delete)

### Database Errors
- ✅ Delete `data/expense_manager.db` to reset
- ✅ Restart backend to recreate database

## Useful URLs

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:5173 | React app |
| Backend API | http://localhost:8000 | FastAPI |
| API Docs (Swagger) | http://localhost:8000/docs | Interactive API |
| API Docs (ReDoc) | http://localhost:8000/redoc | Alternative docs |

## File Locations

| Item | Location |
|------|----------|
| Database | `data/expense_manager.db` |
| Backend Config | `.env` (root directory) |
| Frontend Config | `frontend/.env` (optional) |
| Backend Code | `backend/` |
| Frontend Code | `frontend/src/` |
| Electron App | `app/` |

## Next Steps

1. ✅ Start the application (`npm start`)
2. ✅ Create some categories
3. ✅ Add test expenses
4. ✅ Configure email (Settings)
5. ✅ Try email sync (Dashboard)
6. ✅ Explore reports and charts

## Common Commands

```bash
# Install dependencies
npm run install-all

# Start all services
npm start

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build for production
npm run build:frontend

# Run tests (when available)
npm test
```

## Support

### Documentation
- README.md - Full project documentation
- API_DOCUMENTATION.md - API reference
- FRONTEND_ARCHITECTURE.md - Frontend structure

### Getting Help
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console (F12) for errors
4. Check terminal output for backend errors

## Tips & Tricks

💡 **Dashboard Sync**: Click "Sync Now" to import emails as expenses
💡 **Currency**: Switch between USD and VND on the Dashboard
💡 **Quick Filters**: Use category/source filters on Expenses page
💡 **Categories**: Colors help visually identify expense types
💡 **Reports**: Access via API at `/api/reports/*` for detailed analytics
💡 **Mobile**: App is responsive and works on tablet screens
💡 **Test Connection**: Always test email settings before saving

---

**Ready to track your expenses? Let's go! 🚀**
