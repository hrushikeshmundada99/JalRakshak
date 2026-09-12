import React from 'react';
import { useTranslation } from 'react-i18next';
import JharkhandContext from '../components/JharkhandContext';
import { Layers } from 'lucide-react';

export default function JharkhandGISMapPage() {
  const { t } = useTranslation();

  const gisNodes = [
    {
      id: 'JH-01',
      name: 'Dhanbad (Jharia Mining Belt)',
      lat: '23.7957° N',
      lng: '86.4304° E',
      hazard: 'Acid Mine Drainage (Pyrite Leaching)',
      avgPh: 5.1,
      avgTds: 1240,
      riskLevel: 'HIGH'
    },
    {
      id: 'JH-02',
      name: 'Bokaro (Steel City Aquifer)',
      lat: '23.6693° N',
      lng: '86.1511° E',
      hazard: 'Industrial Mineral TDS & Heavy Slurry',
      avgPh: 6.2,
      avgTds: 1100,
      riskLevel: 'MODERATE'
    },
    {
      id: 'JH-03',
      name: 'West Singhbhum (Chaibasa Pit)',
      lat: '22.5524° N',
      lng: '85.8078° E',
      hazard: 'Iron & Manganese Oxide Saturation',
      avgPh: 6.4,
      avgTds: 680,
      riskLevel: 'MODERATE'
    },
    {
      id: 'JH-04',
      name: 'Palamu / Garhwa (Drought Zone)',
      lat: '24.0450° N',
      lng: '84.0734° E',
      hazard: 'Toxic Fluoride Aquifer Leaching',
      avgPh: 8.9,
      avgTds: 1480,
      riskLevel: 'CRITICAL'
    }
  ];

  return (
    <div>
      
      {/* Contamination Distribution Donut Chart & District Overview */}
      <JharkhandContext />

      {/* GIS Regional Field Node Monitoring Cards */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={22} color="#00D2FF" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>
              Regional Field Monitoring Nodes
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            4 Active Mining Belt Telemetry Units
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {gisNodes.map((node) => (
            <div key={node.id} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#00D2FF', fontFamily: 'monospace' }}>
                    {node.id}
                  </span>
                  <span className={
                    node.riskLevel === 'CRITICAL' || node.riskLevel === 'HIGH' ? 'badge-unsafe' : 'badge-watch'
                  } style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                    {node.riskLevel} RISK
                  </span>
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                  {node.name}
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                  Coordinates: {node.lat}, {node.lng}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Primary Hazard: <strong style={{ color: '#E2E8F0' }}>{node.hazard}</strong>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.76rem'
              }}>
                <div>Avg pH: <strong style={{ color: '#00D2FF' }}>{node.avgPh}</strong></div>
                <div>Avg TDS: <strong style={{ color: '#FBBF24' }}>{node.avgTds} ppm</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
