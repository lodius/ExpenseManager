from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    source = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Expense(amount={self.amount}, description='{self.description}', category='{self.category}')>"