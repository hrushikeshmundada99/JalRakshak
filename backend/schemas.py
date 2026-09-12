from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class ReadingCreate(BaseModel):
    device_id: str = Field(default="jalrakshak-unit-01")
    timestamp: Optional[str] = None
    ph: float
    turbidity_ntu: float
    tds_ppm: float
    temperature_c: float
    source: Optional[str] = "simulated"

class ManualReadingCreate(BaseModel):
    device_id: str = Field(default="jalrakshak-unit-01")
    ph: float
    turbidity_ntu: float
    tds_ppm: float
    temperature_c: float

class ReadingResponse(BaseModel):
    id: int
    device_id: str
    timestamp: str
    ph: float
    turbidity_ntu: float
    tds_ppm: float
    temperature_c: float
    source: str
    status: str
    active_stage: str
    purification_action: str
    risk_label: str
    risk_confidence: float
    ph_status: str
    turbidity_status: str
    tds_status: str
    temp_status: str

    class Config:
        from_attributes = True

class RiskPredictionResponse(BaseModel):
    device_id: str
    predicted_risk: str
    confidence: float
    explanation: str
    recommended_action: str
    timestamp: str

class AlertResponse(BaseModel):
    id: int
    device_id: str
    timestamp: str
    alert_level: str
    trigger_reason: str
    sms_english: str
    sms_hindi: str
    parameters: dict
