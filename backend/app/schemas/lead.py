from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


class LeadCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None

    industry: Optional[str] = None
    company_size: Optional[str] = None
    funding: Optional[str] = None
    technology_stack: Optional[str] = None


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class LeadResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None

    industry: Optional[str] = None
    company_size: Optional[str] = None
    funding: Optional[str] = None
    technology_stack: Optional[str] = None

    status: str
    score: int
    score_label: str

    # created_at: Optional[str] = None
    # updated_at: Optional[str] = None

    owner_id: int

    class Config:
        from_attributes = True

class LeadSummary(BaseModel):
    total_leads: int
    hot_leads: int
    warm_leads: int
    cold_leads: int
    average_score: float

    model_config = ConfigDict(from_attributes=True)