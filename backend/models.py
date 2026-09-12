from sqlalchemy import Column, Integer, Float, String, DateTime, Text
from datetime import datetime, timezone
from database import Base

class ReadingDB(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True, default="jalrakshak-unit-01")
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    # Raw sensor data
    ph = Column(Float, nullable=False)
    turbidity_ntu = Column(Float, nullable=False)
    tds_ppm = Column(Float, nullable=False)
    temperature_c = Column(Float, nullable=False)
    source = Column(String, default="simulated")  # "simulated", "hardware", or "manual"
    
    # Derived state machine logic & ML predictions
    status = Column(String, nullable=False)  # "SAFE", "WATCH", "UNSAFE"
    active_stage = Column(String, nullable=False)  # e.g., "UV-C Disinfection Active" or "Sensor Check Passed"
    purification_action = Column(String, nullable=False)  # Textual log for UI
    risk_label = Column(String, nullable=False)  # e.g., "SAFE", "ACID_MINE_DRAINAGE_RISK", etc.
    risk_confidence = Column(Float, default=0.0)
    
    # Parameter evaluations against BIS 10500:2012
    ph_status = Column(String, default="SAFE")
    turbidity_status = Column(String, default="SAFE")
    tds_status = Column(String, default="SAFE")
    temp_status = Column(String, default="SAFE")
