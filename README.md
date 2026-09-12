# JalRakshak — Smart Water Monitoring & Purification System

**Problem Statement ID:** 26040  
**Title:** Smart Water Purification and Quality Monitoring System for Rural and Mining-Affected Areas  
**Organization:** Government of Jharkhand — Department of Higher & Technical Education  
**Theme:** Clean & Green Technology | **Category:** Hardware  
**Team:** The Evolvers (Team ID 107)  

---

## Overview

JalRakshak is an IoT-enabled smart water purification and quality monitoring system engineered specifically for the hydro-geological hazards of Jharkhand's rural and mining-affected belts (Dhanbad, Bokaro, West Singhbhum, and Palamu).

The software architecture consists of:
1. **FastAPI Backend (`backend/`)**: REST API + WebSockets server handling live telemetry ingestion, BIS 10500 rule evaluations, ML risk inference, and emergency alert dispatches.
2. **Adaptive 5-Stage Purification Logic**: Solenoid state machine that bypasses high-power UV-C disinfection when water quality is SAFE, conserving energy and filter lifespan.
3. **ML Regional Risk Classifier (`backend/ml/`)**: Scikit-Learn `RandomForestClassifier` trained on CGWB Jharkhand groundwater profiles achieving 98.88% accuracy (`SAFE`, `ACID_MINE_DRAINAGE_RISK`, `IRON_MANGANESE_RISK`, `FLUORIDE_RISK`, `MICROBIAL_RISK`).
4. **ESP32 Hardware Simulator (`backend/simulator/`)**: Standalone telemetry script broadcasting continuous sensor data with regional mining-belt anomalies.
5. **E-Governance React Dashboard (`frontend/`)**: Multi-tab government tech UI featuring live metric sparklines, purification pipeline visualizer, GIS map context, filter/solar health diagnostics, BIS 10500 compliance report generator with CSV export, bilingual (English/Hindi) toggle, and a Judge Demo Control Panel.

---

## Directory Structure

```
JALRAKSHAK2.0/
├── backend/
│   ├── main.py                  # FastAPI app & WebSockets (/ws/live)
│   ├── database.py              # SQLite engine
│   ├── models.py                # SQLAlchemy models
│   ├── schemas.py               # Pydantic schemas
│   ├── purification_logic.py    # Adaptive 5-stage state machine
│   ├── ml/
│   │   ├── dataset_generator.py # CGWB synthetic dataset generator
│   │   ├── train_model.py       # Scikit-learn Random Forest model trainer
│   │   └── risk_model.joblib    # Model artifact
│   ├── simulator/
│   │   └── esp32_simulator.py   # Standalone ESP32 simulator script
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/                 # REST & WebSocket client helpers
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # 5 Modular feature pages
│   │   ├── App.jsx              # Main router & tab controller
│   │   ├── i18n.js              # Bilingual English & Hindi dictionary
│   │   └── index.css            # NIC / Jal Shakti styling tokens
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Quick Start Guide

### 1. Install & Run Backend
```bash
cd backend
python -m pip install -r requirements.txt
python ml/train_model.py
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Start ESP32 Hardware Simulator
```bash
cd backend
python simulator/esp32_simulator.py
```

### 3. Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## Hardware Ingestion Data Contract (`POST /api/readings`)

When the physical ESP32 device is ready, configure its HTTP client to POST to `http://<server-ip>:8000/api/readings` with:

```json
{
  "device_id": "jalrakshak-unit-01",
  "timestamp": "2026-09-12T12:00:00Z",
  "ph": 6.4,
  "turbidity_ntu": 12.3,
  "tds_ppm": 850,
  "temperature_c": 27.1,
  "source": "hardware"
}
```
No dashboard code changes required — instant plug and play integration.
