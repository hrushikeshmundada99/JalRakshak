import React from 'react';
import { Sun, Wrench, Battery, Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';
import { i18n } from '../i18n';

export default function FilterSolarHealthPage({ lang }) {
  const t = i18n[lang] || i18n.en;

  return (
    <div>
      
      {/* Top 4 Hardware Health Gauges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        
        {/* Solar Input Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sun size={20} color="#FBBF24" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Solar PV Input</span>
            </div>
            <span className="badge-safe" style={{ fontSize: '0.65rem' }}>92% SOC</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>234 W</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Peak Solar Input (Dhanbad Station)</div>
        </div>

        {/* Filter Capacity Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={20} color="#34D399" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Carbon Filter Life</span>
            </div>
            <span className="badge-safe" style={{ fontSize: '0.65rem' }}>84% HEALTH</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399' }}>84%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Est. 420 Hours Remaining</div>
        </div>

        {/* UV Lamp Efficiency */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="#C084FC" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>UV-C Tube Health</span>
            </div>
            <span className="badge-safe" style={{ fontSize: '0.65rem' }}>96% EFFICIENCY</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C084FC' }}>96%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>1,240 / 10,000 Burn Hours</div>
        </div>

        {/* Pump Pressure */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="#00D2FF" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pump Flow Rate</span>
            </div>
            <span className="badge-safe" style={{ fontSize: '0.65rem' }}>NOMINAL</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00D2FF' }}>12.4 L/m</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Operating Pressure: 2.1 Bar</div>
        </div>

      </div>

      {/* Community Impact & Maintenance Schedule */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '16px' }}>
          Hardware Maintenance & Off-Grid Telemetry Logs
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontWeight: 700, color: '#34D399', marginBottom: '4px' }}>
              Off-Grid Solar PV Optimization
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Dual 100W polycrystalline solar panels with MPPT charge controller supply 24V LiFePO4 battery storage, ensuring 48h autonomy during prolonged monsoon cloud cover.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontWeight: 700, color: '#00D2FF', marginBottom: '4px' }}>
              Adaptive Filter Life Extension
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              By bypassing UV-C and carbon filtration when water quality is SAFE, filter bed replacement cycles are extended from 3 months to 8+ months.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
