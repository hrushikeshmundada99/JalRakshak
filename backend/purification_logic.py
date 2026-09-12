"""
JalRakshak Adaptive Purification Logic & BIS 10500:2012 Threshold Evaluator
"""

# BIS 10500:2012 Reference Limits
BIS_LIMITS = {
    "ph": {"min_acceptable": 6.5, "max_acceptable": 8.5, "unit": ""},
    "turbidity": {"acceptable": 1.0, "permissible": 5.0, "unit": "NTU"},
    "tds": {"acceptable": 500.0, "permissible": 2000.0, "unit": "mg/L"},
    "temperature": {"normal_min": 15.0, "normal_max": 35.0, "unit": "°C"}
}

def evaluate_reading(ph: float, turbidity_ntu: float, tds_ppm: float, temperature_c: float):
    """
    Evaluates raw sensor readings against BIS 10500 rules and computes:
    - Individual parameter compliance statuses
    - Global system status: SAFE, WATCH, or UNSAFE
    - 5-stage purification pipeline state
    - Human-readable log message for the dashboard
    """
    issues = []
    watch_reasons = []

    # 1. Evaluate pH (Acceptable: 6.5 - 8.5)
    if ph < 6.5:
        issues.append(f"Low pH ({ph:.1f} < 6.5, Acidic/Acid Mine Drainage risk)")
        ph_status = "UNSAFE"
    elif ph > 8.5:
        issues.append(f"High pH ({ph:.1f} > 8.5, Alkaline/Fluoride risk)")
        ph_status = "UNSAFE"
    else:
        ph_status = "SAFE"

    # 2. Evaluate Turbidity (Desirable: ≤1.0 NTU, Permissible: ≤5.0 NTU)
    if turbidity_ntu > 5.0:
        issues.append(f"High Turbidity ({turbidity_ntu:.1f} NTU > 5.0 NTU permissible limit)")
        turbidity_status = "UNSAFE"
    elif turbidity_ntu > 1.0:
        watch_reasons.append(f"Moderate Turbidity ({turbidity_ntu:.1f} NTU > 1.0 NTU desirable limit)")
        turbidity_status = "WATCH"
    else:
        turbidity_status = "SAFE"

    # 3. Evaluate TDS (Desirable: ≤500 mg/L, Permissible: ≤2000 mg/L)
    if tds_ppm > 1200.0:
        issues.append(f"High TDS ({tds_ppm:.0f} mg/L > 1200 mg/L threshold)")
        tds_status = "UNSAFE"
    elif tds_ppm > 500.0:
        watch_reasons.append(f"Elevated TDS ({tds_ppm:.0f} mg/L > 500 mg/L desirable limit)")
        tds_status = "WATCH"
    else:
        tds_status = "SAFE"

    # 4. Evaluate Temperature
    if temperature_c > 35.0 or temperature_c < 10.0:
        watch_reasons.append(f"Abnormal Temperature ({temperature_c:.1f}°C)")
        temp_status = "WATCH"
    else:
        temp_status = "SAFE"

    # Determine overall system status & purification stage
    if len(issues) > 0:
        status = "UNSAFE"
        active_stage = "Stage 4: UV-C Disinfection Active"
        purification_action = (
            f"ALERT: Unsafe water detected ({'; '.join(issues)}). "
            f"UV-C Disinfection Unit ACTIVATED. Emergency alert dispatched."
        )
        pipeline_stages = {
            "intake": "completed",
            "filtration": "completed",
            "sensor_check": "failed",
            "uvc_disinfection": "active",
            "output": "pending"
        }
    elif len(watch_reasons) > 0:
        status = "WATCH"
        active_stage = "Stage 2: Standard Carbon Filtration Active"
        purification_action = (
            f"WATCH: Water within permissible bounds ({'; '.join(watch_reasons)}). "
            f"Standard Carbon Filtration active; UV-C on low power standby."
        )
        pipeline_stages = {
            "intake": "completed",
            "filtration": "active",
            "sensor_check": "warning",
            "uvc_disinfection": "standby",
            "output": "completed"
        }
    else:
        status = "SAFE"
        active_stage = "Stage 5: Purification Skipped (Water Safe)"
        purification_action = (
            "SAFE: All parameters strictly within BIS 10500 acceptable limits. "
            "Purification skipped — water safe (Energy & Filter Capacity Conserved)."
        )
        pipeline_stages = {
            "intake": "completed",
            "filtration": "bypassed",
            "sensor_check": "passed",
            "uvc_disinfection": "bypassed",
            "output": "completed"
        }

    return {
        "status": status,
        "active_stage": active_stage,
        "purification_action": purification_action,
        "pipeline_stages": pipeline_stages,
        "parameter_statuses": {
            "ph": ph_status,
            "turbidity": turbidity_status,
            "tds": tds_status,
            "temp": temp_status
        },
        "issues": issues,
        "watch_reasons": watch_reasons
    }
