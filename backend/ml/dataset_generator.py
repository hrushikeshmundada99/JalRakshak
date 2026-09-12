"""
Synthetic CGWB Jharkhand Groundwater Dataset Generator for JalRakshak ML Risk Classifier
"""
import numpy as np
import pandas as pd
import os

def generate_jharkhand_water_dataset(num_samples: int = 3500, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    
    # 5 classes with proportional distribution mimicking Jharkhand ground reports
    # 0: SAFE (40%)
    # 1: ACID_MINE_DRAINAGE_RISK (25%) - Dhanbad / Bokaro coal mining belt
    # 2: IRON_MANGANESE_RISK (20%) - Iron ore belts of West Singhbhum / Ranchi
    # 3: FLUORIDE_RISK (10%) - Palamu / Garhwa drought-prone alkaline aquifers
    # 4: MICROBIAL_RISK (5%) - Post-monsoon surface contamination
    
    records = []
    
    for _ in range(num_samples):
        cat = np.random.choice(
            ["SAFE", "ACID_MINE_DRAINAGE_RISK", "IRON_MANGANESE_RISK", "FLUORIDE_RISK", "MICROBIAL_RISK"],
            p=[0.40, 0.25, 0.20, 0.10, 0.05]
        )
        
        if cat == "SAFE":
            ph = np.random.normal(7.3, 0.4)
            turbidity = np.random.exponential(0.6) + 0.1
            tds = np.random.normal(320, 80)
            temp = np.random.normal(25.0, 3.0)
            
        elif cat == "ACID_MINE_DRAINAGE_RISK":
            ph = np.random.normal(5.1, 0.6)
            turbidity = np.random.normal(6.5, 2.5)
            tds = np.random.normal(1100, 250)
            temp = np.random.normal(27.0, 2.5)
            
        elif cat == "IRON_MANGANESE_RISK":
            ph = np.random.normal(6.4, 0.3)
            turbidity = np.random.normal(14.0, 4.0)
            tds = np.random.normal(650, 150)
            temp = np.random.normal(26.0, 2.0)
            
        elif cat == "FLUORIDE_RISK":
            ph = np.random.normal(8.9, 0.3)
            turbidity = np.random.normal(1.8, 0.8)
            tds = np.random.normal(1450, 300)
            temp = np.random.normal(28.5, 2.5)
            
        elif cat == "MICROBIAL_RISK":
            ph = np.random.normal(7.1, 0.4)
            turbidity = np.random.normal(28.0, 8.0)
            tds = np.random.normal(520, 120)
            temp = np.random.normal(30.0, 2.0)

        # Enforce physical constraints & add subtle noise
        ph = float(np.clip(ph, 3.5, 10.5))
        turbidity = float(np.clip(turbidity, 0.05, 75.0))
        tds = float(np.clip(tds, 50.0, 3000.0))
        temp = float(np.clip(temp, 12.0, 40.0))

        records.append({
            "ph": round(ph, 2),
            "turbidity_ntu": round(turbidity, 2),
            "tds_ppm": round(tds, 1),
            "temperature_c": round(temp, 1),
            "risk_label": cat
        })
        
    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    out_dir = os.path.dirname(__file__)
    df = generate_jharkhand_water_dataset()
    csv_path = os.path.join(out_dir, "jharkhand_water_dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} samples of synthetic CGWB Jharkhand groundwater dataset at {csv_path}")
    print("\nDataset Class Distribution:\n", df["risk_label"].value_counts())
