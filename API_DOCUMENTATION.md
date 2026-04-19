# Expense Manager API Documentation

## Base URL
`http://localhost:8000`

## Endpoints Overview

### Expenses (`/api/expenses`)

#### GET `/api/expenses`
Get all expenses with optional filtering
- **Query Parameters:**
  - `skip` (int): Number of records to skip (default: 0)
  - `limit` (int): Max records to return (default: 100, max: 500)
  - `category` (str): Filter by category
  - `source` (str): Filter by source (Email, Manual)
  - `min_amount` (float): Minimum amount filter
  - `max_amount` (float): Maximum amount filter
- **Response:** List of expenses

#### POST `/api/expenses`
Create a new expense
- **Request Body:**
  ```json
  {
    "amount": 50.00,
    "description": "Grocery shopping",
    "category": "Food",
    "source": "Manual",
    "date": "2024-04-18T10:30:00"
  }
  ```
- **Response:** Created expense with ID

#### GET `/api/expenses/{expense_id}`
Get a specific expense by ID

#### PUT `/api/expenses/{expense_id}`
Update an expense
- **Request Body:** Same fields as POST (all optional)

#### DELETE `/api/expenses/{expense_id}`
Delete an expense

#### GET `/api/expenses/reports/summary`
Get total expense summary
- **Response:**
  ```json
  {
    "total": 1500.00,
    "count": 25,
    "average": 60.00
  }
  ```

#### GET `/api/expenses/reports/daily`
Get daily expense trend for the last N days
- **Query Parameters:**
  - `days` (int): Number of days to include (default: 30, max: 365)
- **Response:**
  ```json
  [
    {
      "date": "2025-04-18",
      "total": 50.00
    }
  ]
  ```

#### GET `/api/expenses/reports/category`
Get expense breakdown by category
- **Response:**
  ```json
  [
    {
      "category": "Food",
      "total": 300.00,
      "percentage": 40.0
    }
  ]
  ```

---

### Categories (`/api/categories`)

#### GET `/api/categories`
List all expense categories

#### POST `/api/categories`
Create a new category
- **Request Body:**
  ```json
  {
    "name": "Food",
    "color": "#FF5733",
    "description": "Grocery and dining expenses"
  }
  ```

#### GET `/api/categories/{category_id}`
Get a specific category

#### PUT `/api/categories/{category_id}`
Update a category

#### DELETE `/api/categories/{category_id}`
Delete a category

---

### Reports & Analytics (`/api/reports`)

#### GET `/api/reports/summary`
Get total spending summary across all expenses
- **Response:**
  ```json
  {
    "total": 1500.00,
    "count": 25,
    "average": 60.00
  }
  ```

#### GET `/api/reports/monthly`
Get monthly expense breakdown
- **Response:**
  ```json
  [
    {
      "month": "April",
      "year": 2025,
      "total": 500.00,
      "count": 10,
      "by_category": [
        {
          "category": "Food",
          "total": 200.00,
          "count": 8,
          "percentage": 40.0
        }
      ]
    }
  ]
  ```

#### GET `/api/reports/daily`
Get daily expense summary for the last N days
- **Query Parameters:**
  - `days` (int): Number of days to include (default: 30, max: 365)
- **Response:**
  ```json
  [
    {
      "date": "2025-04-18",
      "total": 50.00,
      "count": 2
    }
  ]
  ```

#### GET `/api/reports/by-category`
Get spending breakdown by category
- **Response:**
  ```json
  [
    {
      "category": "Food",
      "total": 300.00,
      "count": 10,
      "percentage": 40.0
    }
  ]
  ```

#### GET `/api/reports/date-range`
Get expense summary for a date range
- **Query Parameters:**
  - `start_date` (str): Start date (YYYY-MM-DD)
  - `end_date` (str): End date (YYYY-MM-DD)

---

### Email Sync (`/api/sync`)

#### POST `/api/sync/fetch-emails`
Fetch and process bank statement emails
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully processed emails. Created 5 expenses.",
    "expenses_found": 5
  }
  ```

---

### Email Settings (`/api/settings`)

#### GET `/api/settings`
Get current email settings (password masked)
- **Response:**
  ```json
  {
    "imap_server": "imap.gmail.com",
    "email_user": "your_email@gmail.com",
    "status": "configured"
  }
  ```

#### POST `/api/settings`
Save email settings
- **Request Body:**
  ```json
  {
    "imap_server": "imap.gmail.com",
    "email_user": "your_email@gmail.com",
    "email_pass": "your_app_password"
  }
  ```

#### POST `/api/settings/test`
Test email connection
- **Response:**
  ```json
  {
    "success": true,
    "message": "Connection successful! Found 10 emails.",
    "email_count": 10
  }
  ```

---

## Response Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input or validation error
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

## Authentication
Currently no authentication is required. Implement Bearer token or OAuth2 for production.

## Rate Limiting
Not currently implemented. Implement for production use.

## Development

Start the API:
```bash
cd backend
uvicorn main:app --reload
```

API will be available at: `http://localhost:8000`
Swagger documentation: `http://localhost:8000/docs`
ReDoc documentation: `http://localhost:8000/redoc`
