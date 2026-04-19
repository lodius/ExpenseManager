import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("expense_manager")

app = FastAPI(title="Expense Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Expense Manager API"}

@app.on_event("startup")
def startup_event():
    from backend.database import init_db
    init_db()
    logger.info("Expense Manager API startup complete")

@app.on_event("shutdown")
def shutdown_event():
    logger.info("Expense Manager API is shutting down")
    from backend.database import engine
    engine.dispose()
    logger.info("Database engine disposed successfully")

from backend.api.expenses import router as expenses_router
from backend.api import expenses_sync, categories, reports, settings

app.include_router(expenses_router, prefix="/api/expenses", tags=["expenses"])
app.include_router(expenses_sync.router, prefix="/api/sync", tags=["sync"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])
