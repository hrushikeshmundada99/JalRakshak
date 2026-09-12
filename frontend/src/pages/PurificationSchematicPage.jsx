import React from 'react';
import { useTranslation } from 'react-i18next';
import PurificationPipeline from '../components/PurificationPipeline';
import { Zap, Gauge, Sliders } from 'lucide-react';

export default function PurificationSchematicPage({ reading }) {
  const { t } = useTranslation();
  const status = reading?.status || 'SAFE';

  return (
    <div>
      
      {/* 5-Stage Animated Adaptive Purification Pipeline */}
      <PurificationPipeline reading={reading} />

      {/* Schematic Hardware Specs & Flow Indicators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        
        {/* Valve & Solenoid Control */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Sliders size={20} color="#00D2FF" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Adaptive Solenoid Bypass</h4>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Solenoid State: <strong style={{ color: status === 'SAFE' ? '#34D399' : '#EF4444' }}>
              {status === 'SAFE' ? 'BYPASS VALVE OPEN (Energy Saved)' : 'PURIFICATION VALVE ENGAGED'}
            </strong>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
            When sensors verify water quality within BIS 10500 limits, motorized 3-way solenoid valve routes stream directly to storage, extending carbon filter life.
          </p>
        </div>

        {/* UV-C Chamber Intensity */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Zap size={20} color="#C084FC" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>UV-C Disinfection Dosage</h4>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Dosage Intensity: <strong style={{ color: '#C084FC' }}>
              {status === 'UNSAFE' ? '42.5 mJ/cm² (Full Germicidal Power)' : '0 mJ/cm² (Standby)'}
            </strong>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
            High-output 254nm UV-C LED chamber neutralizes bacterial pathogen DNA within 1.2s contact time during unsafe contamination events.
          </p>
        </div>

        {/* Pressure & Flow Rates */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Gauge size={20} color="#34D399" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Flow & Pressure Differential</h4>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Flow Rate: <strong style={{ color: '#34D399' }}>12.4 L/min</strong> | Differential: <strong style={{ color: '#FFF' }}>0.4 Bar</strong>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
            Multi-stage sediment pre-filter pressure drop monitored in real-time to detect clogging before flow degradation occurs.
          </p>
        </div>

      </div>

    </div>
  );
}
