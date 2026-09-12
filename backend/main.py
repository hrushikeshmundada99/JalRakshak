"""
JalRakshak Backend API Engine (FastAPI + SQLite + WebSockets + ML Risk Engine)
"""
import io
import json
import asyncio
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import ReadingDB
from schemas import ReadingCreate, ManualReadingCreate, ReadingResponse, RiskPredictionResponse, AlertResponse
from purification_logic import evaluate_reading
from ml.train_model import predict_water_risk

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JalRakshak API",
    description="Smart Water Purification & Monitoring System API for Jharkhand Rural/Mining Belts",
    version="2.0.0"
)

# Enable CORS for React frontend (Vite default port 5173 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager for real-time live streaming
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

def process_and_save_reading(
    db: Session,
    device_id: str,
    ph: float,
    turbidity_ntu: float,
    tds_ppm: float,
    temperature_c: float,
    source: str = "simulated",
    timestamp_str: Optional[str] = None
):
    # 1. Run Purification Logic (State Machine & BIS 10500 Evaluation)
    eval_res = evaluate_reading(ph, turbidity_ntu, tds_ppm, temperature_c)
    
    # 2. Run ML Risk Inference
    ml_res = predict_water_risk(ph, turbidity_ntu, tds_ppm, temperature_c)
    
    dt = datetime.now(timezone.utc)
    if timestamp_str:
        try:
            dt = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
        except Exception:
            pass

    # 3. Build DB Record
    db_reading = ReadingDB(
        device_id=device_id,
        timestamp=dt,
        ph=ph,
        turbidity_ntu=turbidity_ntu,
        tds_ppm=tds_ppm,
        temperature_c=temperature_c,
        source=source,
        status=eval_res["status"],
        active_stage=eval_res["active_stage"],
        purification_action=eval_res["purification_action"],
        risk_label=ml_res["risk_label"],
        risk_confidence=ml_res["confidence"],
        ph_status=eval_res["parameter_statuses"]["ph"],
        turbidity_status=eval_res["parameter_statuses"]["turbidity"],
        tds_status=eval_res["parameter_statuses"]["tds"],
        temp_status=eval_res["parameter_statuses"]["temp"]
    )
    
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)

    reading_dict = {
        "id": db_reading.id,
        "device_id": db_reading.device_id,
        "timestamp": db_reading.timestamp.isoformat(),
        "ph": db_reading.ph,
        "turbidity_ntu": db_reading.turbidity_ntu,
        "tds_ppm": db_reading.tds_ppm,
        "temperature_c": db_reading.temperature_c,
        "source": db_reading.source,
        "status": db_reading.status,
        "active_stage": db_reading.active_stage,
        "purification_action": db_reading.purification_action,
        "risk_label": db_reading.risk_label,
        "risk_confidence": db_reading.risk_confidence,
        "ph_status": db_reading.ph_status,
        "turbidity_status": db_reading.turbidity_status,
        "tds_status": db_reading.tds_status,
        "temp_status": db_reading.temp_status,
        "pipeline_stages": eval_res["pipeline_stages"],
        "ml_explanation": ml_res["explanation"],
        "ml_action": ml_res["recommended_action"]
    }
    
    return db_reading, reading_dict

# ----------------- REST ENDPOINTS ----------------- #

@app.get("/")
def root():
    return {
        "system": "JalRakshak — Smart Water Monitoring Backend",
        "status": "Operational",
        "team": "The Evolvers (Team 107)",
        "problem_statement": "26040 - Water Quality Monitoring for Mining Belts"
    }

@app.post("/api/readings", response_model=ReadingResponse)
async def ingest_reading(payload: ReadingCreate, db: Session = Depends(get_db)):
    """
    Standard Hardware/Simulator Ingestion Endpoint.
    This exact endpoint and schema will be used by the physical ESP32 device.
    """
    db_reading, reading_dict = process_and_save_reading(
        db=db,
        device_id=payload.device_id,
        ph=payload.ph,
        turbidity_ntu=payload.turbidity_ntu,
        tds_ppm=payload.tds_ppm,
        temperature_c=payload.temperature_c,
        source=payload.source or "simulated",
        timestamp_str=payload.timestamp
    )
    
    # Broadcast to WebSocket subscribers
    await manager.broadcast(reading_dict)
    
    return reading_dict

@app.post("/api/readings/manual-override", response_model=ReadingResponse)
async def manual_override_reading(payload: ManualReadingCreate, db: Session = Depends(get_db)):
    """
    Demo Control Panel Manual Override.
    Allows live adjustments of pH, turbidity, TDS, and temperature during judge presentation.
    """
    db_reading, reading_dict = process_and_save_reading(
        db=db,
        device_id=payload.device_id,
        ph=payload.ph,
        turbidity_ntu=payload.turbidity_ntu,
        tds_ppm=payload.tds_ppm,
        temperature_c=payload.temperature_c,
        source="manual"
    )
    
    await manager.broadcast(reading_dict)
    return reading_dict

@app.get("/api/readings/latest")
def get_latest_reading(device_id: str = "jalrakshak-unit-01", db: Session = Depends(get_db)):
    reading = db.query(ReadingDB).filter(ReadingDB.device_id == device_id).order_by(ReadingDB.id.desc()).first()
    if not reading:
        raise HTTPException(status_code=404, detail="No readings found")
    
    eval_res = evaluate_reading(reading.ph, reading.turbidity_ntu, reading.tds_ppm, reading.temperature_c)
    ml_res = predict_water_risk(reading.ph, reading.turbidity_ntu, reading.tds_ppm, reading.temperature_c)
    
    return {
        "id": reading.id,
        "device_id": reading.device_id,
        "timestamp": reading.timestamp.isoformat(),
        "ph": reading.ph,
        "turbidity_ntu": reading.turbidity_ntu,
        "tds_ppm": reading.tds_ppm,
        "temperature_c": reading.temperature_c,
        "source": reading.source,
        "status": reading.status,
        "active_stage": reading.active_stage,
        "purification_action": reading.purification_action,
        "risk_label": reading.risk_label,
        "risk_confidence": reading.risk_confidence,
        "ph_status": reading.ph_status,
        "turbidity_status": reading.turbidity_status,
        "tds_status": reading.tds_status,
        "temp_status": reading.temp_status,
        "pipeline_stages": eval_res["pipeline_stages"],
        "ml_explanation": ml_res["explanation"],
        "ml_action": ml_res["recommended_action"]
    }

@app.get("/api/readings/history")
def get_reading_history(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    device_id: str = "jalrakshak-unit-01",
    db: Session = Depends(get_db)
):
    total = db.query(ReadingDB).filter(ReadingDB.device_id == device_id).count()
    readings = db.query(ReadingDB).filter(ReadingDB.device_id == device_id).order_by(ReadingDB.id.desc()).offset(offset).limit(limit).all()
    
    results = []
    for r in readings:
        results.append({
            "id": r.id,
            "device_id": r.device_id,
            "timestamp": r.timestamp.isoformat(),
            "ph": r.ph,
            "turbidity_ntu": r.turbidity_ntu,
            "tds_ppm": r.tds_ppm,
            "temperature_c": r.temperature_c,
            "source": r.source,
            "status": r.status,
            "active_stage": r.active_stage,
            "purification_action": r.purification_action,
            "risk_label": r.risk_label,
            "risk_confidence": r.risk_confidence
        })
    return {"total": total, "readings": results}

@app.get("/api/readings/export")
def export_readings_csv(device_id: str = "jalrakshak-unit-01", db: Session = Depends(get_db)):
    readings = db.query(ReadingDB).filter(ReadingDB.device_id == device_id).order_by(ReadingDB.id.desc()).all()
    
    output = io.StringIO()
    output.write("ID,Timestamp,Device_ID,pH,Turbidity_NTU,TDS_PPM,Temperature_C,Source,Status,Risk_Label,Confidence_Pct,Purification_Action\n")
    
    for r in readings:
        action_clean = r.purification_action.replace(",", ";")
        output.write(f"{r.id},{r.timestamp.isoformat()},{r.device_id},{r.ph},{r.turbidity_ntu},{r.tds_ppm},{r.temperature_c},{r.source},{r.status},{r.risk_label},{r.risk_confidence:.1f},\"{action_clean}\"\n")
        
    output.seek(0)
    filename = f"JalRakshak_Readings_{device_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.get("/api/risk/{device_id}/latest", response_model=RiskPredictionResponse)
def get_risk_prediction(device_id: str, db: Session = Depends(get_db)):
    reading = db.query(ReadingDB).filter(ReadingDB.device_id == device_id).order_by(ReadingDB.id.desc()).first()
    if not reading:
        raise HTTPException(status_code=404, detail="No readings recorded for device")
    
    ml_res = predict_water_risk(reading.ph, reading.turbidity_ntu, reading.tds_ppm, reading.temperature_c)
    return {
        "device_id": device_id,
        "predicted_risk": ml_res["risk_label"],
        "confidence": ml_res["confidence"],
        "explanation": ml_res["explanation"],
        "recommended_action": ml_res["recommended_action"],
        "timestamp": reading.timestamp.isoformat()
    }

@app.get("/api/alerts")
def get_alerts(device_id: str = "jalrakshak-unit-01", limit: int = 20, db: Session = Depends(get_db)):
    """
    Returns timestamped alerts for UNSAFE and WATCH readings, formatting
    bilingual SMS/IVR notices sent to local Jal Sahiya community health workers.
    """
    unsafe_readings = db.query(ReadingDB).filter(
        ReadingDB.device_id == device_id,
        ReadingDB.status.in_(["UNSAFE", "WATCH"])
    ).order_by(ReadingDB.id.desc()).limit(limit).all()
    
    alerts = []
    for r in unsafe_readings:
        if r.status == "UNSAFE":
            eng_msg = f"[JalRakshak ALERT] Unsafe water at Unit {r.device_id}. pH:{r.ph:.1f}, Turbidity:{r.turbidity_ntu:.1f}NTU, TDS:{r.tds_ppm:.0f}ppm. Risk: {r.risk_label}. UV-C Disinfection engaged."
            hin_msg = f"[जलरक्षक चेतावनी] इकाई {r.device_id} पर अस्वच्छ जल दर्ज। pH:{r.ph:.1f}, गंदलापन:{r.turbidity_ntu:.1f}NTU, TDS:{r.tds_ppm:.0f}ppm। खतरा: {r.risk_label}। UV-C शोधन सक्रिय।"
        else:
            eng_msg = f"[JalRakshak NOTICE] Marginal water quality at Unit {r.device_id}. TDS:{r.tds_ppm:.0f}ppm, Turbidity:{r.turbidity_ntu:.1f}NTU. Standard filtration running."
            hin_msg = f"[जलरक्षक सूचना] इकाई {r.device_id} पर मध्यम जल गुणवत्ता। TDS:{r.tds_ppm:.0f}ppm, गंदलापन:{r.turbidity_ntu:.1f}NTU। सामान्य फिल्टर चालू।"
            
        alerts.append({
            "id": r.id,
            "device_id": r.device_id,
            "timestamp": r.timestamp.isoformat(),
            "alert_level": r.status,
            "risk_label": r.risk_label,
            "sms_english": eng_msg,
            "sms_hindi": hin_msg,
            "parameters": {
                "ph": r.ph,
                "turbidity": r.turbidity_ntu,
                "tds": r.tds_ppm,
                "temp": r.temperature_c
            }
        })
    return alerts

# ----------------- WEBSOCKET ENDPOINT ----------------- #

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    await manager.connect(websocket)
    try:
        # Send latest reading immediately on connection
        reading = db.query(ReadingDB).order_by(ReadingDB.id.desc()).first()
        if reading:
            eval_res = evaluate_reading(reading.ph, reading.turbidity_ntu, reading.tds_ppm, reading.temperature_c)
            ml_res = predict_water_risk(reading.ph, reading.turbidity_ntu, reading.tds_ppm, reading.temperature_c)
            payload = {
                "id": reading.id,
                "device_id": reading.device_id,
                "timestamp": reading.timestamp.isoformat(),
                "ph": reading.ph,
                "turbidity_ntu": reading.turbidity_ntu,
                "tds_ppm": reading.tds_ppm,
                "temperature_c": reading.temperature_c,
                "source": reading.source,
                "status": reading.status,
                "active_stage": reading.active_stage,
                "purification_action": reading.purification_action,
                "risk_label": reading.risk_label,
                "risk_confidence": reading.risk_confidence,
                "ph_status": reading.ph_status,
                "turbidity_status": reading.turbidity_status,
                "tds_status": reading.tds_status,
                "temp_status": reading.temp_status,
                "pipeline_stages": eval_res["pipeline_stages"],
                "ml_explanation": ml_res["explanation"],
                "ml_action": ml_res["recommended_action"]
            }
            await websocket.send_json(payload)
            
        # Keep connection open
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
