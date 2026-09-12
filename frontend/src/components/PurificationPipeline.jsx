import React from 'react';
import { Waves, Filter, Cpu, Zap, CheckCircle, ShieldOff } from 'lucide-react';
import { i18n } from '../i18n';

export default function PurificationPipeline({ reading, lang }) {
  const t = i18n[lang] || i18n.en;
  const status = reading?.status || 'SAFE';
  const pipeline = reading?.pipeline_stages || {
    intake: 'completed',
    filtration: 'bypassed',
    sensor_check: 'passed',
    uvc_disinfection: 'bypassed',
    output: 'completed'
  };

  const stages = [
    {
      key: 'intake',
      label: t.stageIntake,
      icon: <Waves size={20} />,
      status: pipeline.intake,
      detail: "Continuous Raw Stream Intake"
    },
    {
      key: 'filtration',
      label: t.stageFiltration,
      icon: <Filter size={20} />,
      status: pipeline.filtration,
      detail: pipeline.filtration === 'bypassed' ? "Bypassed (Water Safe)" : "Active Carbon Pass"
    },
    {
      key: 'sensor_check',
      label: t.stageSensor,
      icon: <Cpu size={20} />,
      status: pipeline.sensor_check,
      detail: `BIS Evaluated (${reading?.ph ? reading.ph.toFixed(1) : 7.0} pH)`
    },
    {
      key: 'uvc_disinfection',
      label: t.stageUvc,
      icon: <Zap size={20} />,
      status: pipeline.uvc_disinfection,
      detail: pipeline.uvc_disinfection === 'active' ? "254nm High UV Dosage Active" : (pipeline.uvc_disinfection === 'standby' ? "Low Power Standby" : "Skipped (Energy Saved)")
    },
    {
      key: 'output',
      label: t.stageOutput,
      icon: <CheckCircle size={20} />,
      status: pipeline.output,
      detail: "Clean Community Supply"
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
            {t.pipelineTitle}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t.pipelineSub}
          </p>
        </div>

        {/* Adaptive Callout Badge */}
        {status === 'SAFE' ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(0, 210, 255, 0.1) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34D399',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            <ShieldOff size={16} />
            <span>PURIFICATION SKIPPED — POWER & FILTER CONSERVED</span>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#FCA5A5',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            <Zap size={16} color="#EF4444" />
            <span>UV-C DISINFECTION UNIT ACTIVATED</span>
          </div>
        )}
      </div>

      {/* Pipeline Stepper Flow Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        position: 'relative'
      }}>
        {stages.map((stage, idx) => {
          let stageBg = 'rgba(255, 255, 255, 0.03)';
          let stageBorder = 'rgba(255, 255, 255, 0.08)';
          let iconColor = 'var(--text-dim)';
          let badgeText = stage.status;

          if (stage.status === 'completed' || stage.status === 'passed') {
            stageBg = 'rgba(16, 185, 129, 0.08)';
            stageBorder = 'rgba(16, 185, 129, 0.3)';
            iconColor = '#34D399';
          } else if (stage.status === 'active') {
            stageBg = 'rgba(239, 68, 68, 0.18)';
            stageBorder = 'rgba(239, 68, 68, 0.5)';
            iconColor = '#EF4444';
          } else if (stage.status === 'bypassed') {
            stageBg = 'rgba(0, 210, 255, 0.06)';
            stageBorder = 'rgba(0, 210, 255, 0.2)';
            iconColor = '#00D2FF';
          }

          return (
            <div
              key={stage.key}
              style={{
                background: stageBg,
                border: `1px solid ${stageBorder}`,
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: iconColor
                }}>
                  {stage.icon}
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: iconColor
                }}>
                  {badgeText}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px' }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {stage.detail}
                </div>
              </div>

              {/* Step indicator dot */}
              <div style={{
                height: '4px',
                width: '100%',
                borderRadius: '2px',
                background: iconColor,
                opacity: 0.6,
                marginTop: 'auto'
              }} />
            </div>
          );
        })}
      </div>

    </div>
  );
}
