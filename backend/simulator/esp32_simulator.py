"""
JalRakshak ESP32 Hardware Simulator Script
===========================================
REPLACE THIS FILE'S DATA SOURCE WITH REAL ESP32 SERIAL/WIFI POST WHEN HARDWARE IS READY — endpoint & schema do not change.

This script posts simulated sensor data to `http://localhost:8000/api/readings` on a 3.5s loop.
Simulates realistic baseline drift and periodic mining-belt anomaly spikes (Acid Mine Drainage, High Turbidity, Mineral Leaching).
"""

import time
import math
import random
import requests
from datetime import datetime, timezone

API_URL = "http://localhost:8000/api/readings"
DEVICE_ID = "jalrakshak-unit-01"

def run_simulator():
    print(f"============================================================")
    print(f"JalRakshak ESP32 Hardware Simulator Active")
    print(f"Target Endpoint: {API_URL}")
    print(f"Device ID: {DEVICE_ID}")
    print(f"============================================================\n")

    step = 0
    
    # Base state parameters
    base_ph = 7.2
    base_turbidity = 0.8
    base_tds = 420.0
    base_temp = 25.5
    
    while True:
        step += 1
        
        # 1. Gentle continuous sine-wave drift + micro noise
        ph_drift = math.sin(step * 0.1) * 0.2 + random.uniform(-0.1, 0.1)
        turb_drift = math.cos(step * 0.15) * 0.4 + random.uniform(-0.15, 0.15)
        tds_drift = math.sin(step * 0.08) * 35.0 + random.uniform(-10.0, 10.0)
        temp_drift = math.sin(step * 0.05) * 1.5 + random.uniform(-0.2, 0.2)
        
        ph = round(base_ph + ph_drift, 2)
        turbidity = max(0.1, round(base_turbidity + turb_drift, 2))
        tds = max(100.0, round(base_tds + tds_drift, 1))
        temp = round(base_temp + temp_drift, 1)
        
        # 2. Inject periodic contamination anomaly (every 7-9 readings)
        anomaly_type = None
        if step % 8 == 0:
            choice = random.choice(["AMD", "TURBIDITY", "TDS", "FLUORIDE"])
            if choice == "AMD":
                ph = round(random.uniform(4.3, 5.4), 2)
                tds = round(random.uniform(1100.0, 1650.0), 1)
                anomaly_type = "Acid Mine Drainage (Dhanbad/Bokaro Belt)"
            elif choice == "TURBIDITY":
                turbidity = round(random.uniform(18.0, 42.0), 2)
                anomaly_type = "Heavy Surface Runoff / Turbidity Spike"
            elif choice == "TDS":
                tds = round(random.uniform(1400.0, 1950.0), 1)
                anomaly_type = "Mineral Mineralization Spike"
            elif choice == "FLUORIDE":
                ph = round(random.uniform(8.7, 9.4), 2)
                tds = round(random.uniform(1300.0, 1750.0), 1)
                anomaly_type = "Alkaline Aquifer / Fluoride Leaching"

        payload = {
            "device_id": DEVICE_ID,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "ph": ph,
            "turbidity_ntu": turbidity,
            "tds_ppm": tds,
            "temperature_c": temp,
            "source": "simulated"
        }
        
        try:
            res = requests.post(API_URL, json=payload, timeout=4.0)
            if res.status_code == 200:
                data = res.json()
                status_color = "[SAFE]" if data['status'] == "SAFE" else (" [WATCH]" if data['status'] == "WATCH" else "[UNSAFE]")
                anom_str = f" | ANOMALY: {anomaly_type}" if anomaly_type else ""
                print(f"[{datetime.now().strftime('%H:%M:%S')}] #{step:03d} | {status_color} | pH: {ph:4.1f} | Turb: {turbidity:4.1f} NTU | TDS: {tds:5.0f} ppm | Temp: {temp:4.1f}C | Risk: {data['risk_label']}{anom_str}")
            else:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] HTTP {res.status_code}: {res.text}")
        except Exception as e:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Connection Error (Backend offline?): {e}")

        time.sleep(3.5)

if __name__ == "__main__":
    run_simulator()
