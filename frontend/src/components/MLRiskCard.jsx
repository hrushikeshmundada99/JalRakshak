import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Wrench } from 'lucide-react';

export default function MLRiskCard({ reading }) {
  const { t } = useTranslation();
  
  const riskLabel = reading?.risk_label || 'SAFE';
  const confidence = reading?.risk_confidence || 98.5;
  const explanation = reading?.ml_explanation || "Water parameters strictly align with BIS 10500:2012 safe drinking standards.";
  const action = reading?.ml_action || "Maintain normal adaptive intake. No intensive chemical filtration required.";

  const riskBadgeConfig = {
    SAFE: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: 'rgba(16, 185, 129, 0.3)', title: "SAFE BASELINE AQUIFER" },
    ACID_MINE_DRAINAGE_RISK: { bg: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', border: 'rgba(239, 68, 68, 0.4)', title: "ACID MINE DRAINAGE (DHANBAD/BOKARO BELT)" },
    IRON_MANGANESE_RISK: { bg: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: 'rgba(245, 158, 11, 0.4)', title: "IRON & MANGANESE ORE CONTAMINATION" },
    FLUORIDE_RISK: { bg: 'rgba(168, 85, 247, 0.2)', color: '#D8B4FE', border: 'rgba(168, 85, 247, 0.4)', title: "FLUORIDE LEACHING (PALAMU AQUIFER)" },
    MICROBIAL_RISK: { bg: 'rgba(236, 72, 153, 0.2)', color: '#F472B6', border: 'rgba(236, 72, 153, 0.4)', title: "MICROBIAL / ORGANIC RUNOFF CONTAMINATION" }
  };

  const badge = riskBadgeConfig[riskLabel] || riskBadgeConfig.SAFE;

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(11, 79, 138, 0.4) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00D2FF'
            }}>
              <Brain size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
                {t('mlTitle')}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t('mlSub')}
              </p>
            </div>
          </div>

          <div style={{
            fontSize: '0.72rem',
            padding: '4px 10px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#38BDF8',
            fontWeight: 600
          }}>
            RandomForestClassifier
          </div>
        </div>

        {/* Prediction Badge */}
        <div style={{
          background: badge.bg,
          border: `1px solid ${badge.border}`,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('mlRiskClass')}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: badge.color }}>
              {confidence.toFixed(1)}% {t('mlConfidence')}
            </span>
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            {badge.title}
          </div>

          <div style={{ height: '6px', width: '100%', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${confidence}%`, background: badge.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Groundwater Explanation */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
            {t('mlExplanation')}:
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
            {explanation}
          </p>
        </div>
      </div>

      {/* Actionable Remedy */}
      <div style={{
        padding: '12px 14px',
        borderRadius: '10px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        marginTop: '12px'
      }}>
        <Wrench size={18} color="#00D2FF" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#00D2FF' }}>
            {t('mlAction')}:
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {action}
          </div>
        </div>
      </div>

    </div>
  );
}
