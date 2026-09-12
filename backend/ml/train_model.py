"""
JalRakshak ML Model Training & Inference Engine
Trains RandomForestClassifier on Jharkhand CGWB groundwater dataset
"""
import os
import sys
import joblib
import pandas as pd
import numpy as np

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from ml.dataset_generator import generate_jharkhand_water_dataset


MODEL_PATH = os.path.join(os.path.dirname(__file__), "risk_model.joblib")

_model_cache = None

def train_and_save_model():
    print("Generating synthetic CGWB Jharkhand groundwater dataset...")
    df = generate_jharkhand_water_dataset(num_samples=4000)
    
    X = df[["ph", "turbidity_ntu", "tds_ppm", "temperature_c"]]
    y = df["risk_label"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print("Training RandomForestClassifier...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        random_state=42,
        n_jobs=1
    )
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    
    print("\n--- MODEL PERFORMANCE ---")
    print(f"Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    print("\nFeature Importances:")
    for feat, imp in zip(X.columns, clf.feature_importances_):
        print(f"  {feat}: {imp:.4f}")
        
    joblib.dump(clf, MODEL_PATH)
    print(f"\nModel successfully saved to: {MODEL_PATH}")
    return clf

def load_risk_model():
    global _model_cache
    if _model_cache is not None:
        return _model_cache
    
    if not os.path.exists(MODEL_PATH):
        print(f"Model artifact not found at {MODEL_PATH}, training new model...")
        _model_cache = train_and_save_model()
    else:
        _model_cache = joblib.load(MODEL_PATH)
    return _model_cache

def predict_water_risk(ph: float, turbidity_ntu: float, tds_ppm: float, temperature_c: float):
    """
    Returns prediction dictionary:
    {
      "risk_label": str,
      "confidence": float,
      "explanation": str,
      "recommended_action": str
    }
    """
    model = load_risk_model()
    features = np.array([[ph, turbidity_ntu, tds_ppm, temperature_c]])
    
    pred_label = model.predict(features)[0]
    probs = model.predict_proba(features)[0]
    classes = model.classes_
    
    class_idx = list(classes).index(pred_label)
    confidence = float(probs[class_idx])
    
    # Detailed regional explanations & remedies based on PS 26040 context
    explanations = {
        "SAFE": {
            "explanation": "Water parameters strictly align with BIS 10500:2012 safe drinking standards. Low mineral saturation.",
            "action": "Maintain normal adaptive intake. No intensive chemical filtration required."
        },
        "ACID_MINE_DRAINAGE_RISK": {
            "explanation": f"Low pH ({ph:.1f}) + elevated TDS ({tds_ppm:.0f} mg/L) indicates Acid Mine Drainage (AMD) common in Dhanbad/Bokaro coal mining belts.",
            "action": "Engage alkaline neutralization bed + activated carbon before intake. Notify local Jal Sahiya."
        },
        "IRON_MANGANESE_RISK": {
            "explanation": f"Moderate pH ({ph:.1f}) with high turbidity ({turbidity_ntu:.1f} NTU) indicates dissolved iron/manganese oxides typical in West Singhbhum iron ore corridors.",
            "action": "Activate oxidation-coagulation module and multi-stage sediment filtration."
        },
        "FLUORIDE_RISK": {
            "explanation": f"Alkaline pH ({ph:.1f}) combined with high TDS ({tds_ppm:.0f} mg/L) signals toxic Fluoride leaching typical of Palamu deep aquifer rock formations.",
            "action": "Reroute water through activated alumina / reverse osmosis membrane unit."
        },
        "MICROBIAL_RISK": {
            "explanation": f"Severe turbidity ({turbidity_ntu:.1f} NTU) and warm temperature ({temperature_c:.1f}°C) suggests post-monsoon organic surface runoff & bacterial proliferation.",
            "action": "Immediate maximum UV-C dosage & chlorination cycle required."
        }
    }
    
    info = explanations.get(pred_label, {
        "explanation": "Unclassified water risk profile.",
        "action": "Perform manual laboratory verification."
    })
    
    return {
        "risk_label": pred_label,
        "confidence": round(confidence * 100, 1),
        "explanation": info["explanation"],
        "recommended_action": info["action"]
    }

if __name__ == "__main__":
    train_and_save_model()
