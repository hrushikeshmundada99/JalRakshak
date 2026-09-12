import React, { useState } from 'react';
import { Sliders, Send, AlertOctagon, RefreshCw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { pushManualOverride } from '../api/client';
import { i18n } from '../i18n';

export default function DemoControlPanel({ deviceId, onManualPush, lang }) {
  const t = i18n[lang] || i18n.en;
  const [isOpen, setIsOpen] = useState(true);

  const [ph, setPh] = useState(7.2);
  const [turbidity, setTurbidity] = useState(0.8);
  const [tds, setTds] = useState(420);
  const [temp, setTemp] = useState(25.5);
  const [isPushing, setIsPushing] = useState(false);

  const handlePush = async () => {
    setIsPushing(true);
    try {
      const payload = {
        device_id: deviceId,
        ph: parseFloat(ph),
        turbidity_ntu: parseFloat(turbidity),
        tds_ppm: parseFloat(tds),
        temperature_c: parseFloat(temp)
      };
      const res = await pushManualOverride(payload);
      if (onManualPush) onManualPush(res);
    } catch (err) {
      console.error('Manual override failed:', err);
    } finally {
      setIsPushing(false);
    }
  };

  const applyPreset = (pPh, pTurb, pTds, pTemp) => {
    setPh(pPh);
    setTurbidity(pTurb);
    setTds(pTds);
    setTemp(pTemp);
  };

  return (
    <div className="glass-panel" style={{
      marginBottom: '24px',
      border: '1px solid rgba(0, 210, 255, 0.3)',
      boxShadow: '0 0 25px rgba(0, 210, 255, 0.15)'
    }}>
      
      {/* Header bar / Toggle button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(11, 79, 138, 0.3) 0%, rgba(0, 210, 255, 0.1) 100%)',
          borderRadius: isOpen ? '16px 16px 0 0' : '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sliders size={20} color="#00D2FF" />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{t.demoPanelTitle}</span>
              <span className="badge-tag" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                Live Demo Mode
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {t.demoPanelSub}
            </div>
          </div>
        </div>

        <button style={{ background: 'none', border: 'none', color: '#00D2FF', cursor: 'pointer' }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Drawer Body */}
      {isOpen && (
        <div style={{ padding: '24px' }}>
          
          {/* Quick Anomaly Trigger Buttons */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="#FBBF24" />
              <span>Quick Anomaly Injection Presets:</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={() => { applyPreset(4.5, 12.0, 1450, 27.0); }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <AlertOctagon size={14} />
                <span>{t.simAmd}</span>
              </button>

              <button
                onClick={() => { applyPreset(7.1, 35.0, 620, 29.5); }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#FBBF24',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {t.simTurb}
              </button>

              <button
                onClick={() => { applyPreset(9.2, 1.8, 1600, 28.0); }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: '#D8B4FE',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {t.simFluoride}
              </button>

              <button
                onClick={() => { applyPreset(7.4, 0.6, 320, 25.0); }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34D399',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} />
                <span>{t.resetSim}</span>
              </button>
            </div>
          </div>

          {/* Interactive Sliders Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            
            {/* pH Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>pH Level</span>
                <span style={{ color: '#00D2FF', fontWeight: 800 }}>{ph} pH</span>
              </div>
              <input
                type="range"
                min="3.5"
                max="10.5"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="slider-custom"
              />
            </div>

            {/* Turbidity Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Turbidity (NTU)</span>
                <span style={{ color: '#34D399', fontWeight: 800 }}>{turbidity} NTU</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="50.0"
                step="0.5"
                value={turbidity}
                onChange={(e) => setTurbidity(e.target.value)}
                className="slider-custom"
              />
            </div>

            {/* TDS Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>TDS (ppm)</span>
                <span style={{ color: '#FBBF24', fontWeight: 800 }}>{tds} ppm</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="25"
                value={tds}
                onChange={(e) => setTds(e.target.value)}
                className="slider-custom"
              />
            </div>

            {/* Temp Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Temperature (°C)</span>
                <span style={{ color: '#F472B6', fontWeight: 800 }}>{temp} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="0.5"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="slider-custom"
              />
            </div>

          </div>

          {/* Action Push Button */}
          <button
            onClick={handlePush}
            disabled={isPushing}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0B4F8A 0%, #00D2FF 100%)',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0, 210, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.2s ease'
            }}
          >
            <Send size={18} />
            <span>{isPushing ? 'Injecting Telemetry...' : t.pushManual}</span>
          </button>

        </div>
      )}

    </div>
  );
}
