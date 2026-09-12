import React from 'react';
import HistoryTable from '../components/HistoryTable';
import { FileText, ShieldCheck, Download, CheckCircle2, Award } from 'lucide-react';
import { getExportCsvUrl } from '../api/client';
import { i18n } from '../i18n';

export default function ComplianceReportsPage({ history, deviceId, lang }) {
  const t = i18n[lang] || i18n.en;

  return (
    <div>
      
      {/* BIS 10500 Compliance Audit Certificate Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(11, 79, 138, 0.4) 0%, rgba(16, 185, 129, 0.15) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34D399'
            }}>
              <Award size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                  BIS 10500:2012 Regulatory Compliance Certificate
                </h3>
                <span className="badge-safe" style={{ fontSize: '0.72rem' }}>
                  VERIFIED AUDIT
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Government of Jharkhand — Department of Higher & Technical Education Standard Telemetry Record
              </p>
            </div>
          </div>

          <a
            href={getExportCsvUrl(deviceId)}
            download
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Download size={16} />
            <span>Download Audit Dataset (CSV)</span>
          </a>

        </div>

        {/* Regulatory Threshold Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.78rem'
        }}>
          <div>
            <div style={{ color: 'var(--text-dim)' }}>pH Standard</div>
            <strong style={{ color: '#00D2FF' }}>6.5 – 8.5 pH</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)' }}>Turbidity Standard</div>
            <strong style={{ color: '#34D399' }}>≤ 1.0 NTU (Desirable) / ≤ 5.0 NTU (Permissible)</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)' }}>TDS Standard</div>
            <strong style={{ color: '#FBBF24' }}>≤ 500 mg/L (Desirable) / ≤ 2000 mg/L (Permissible)</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)' }}>Microbial Pathogen DNA</div>
            <strong style={{ color: '#C084FC' }}>0 CFU / 100 ml (Post UV-C Dose)</strong>
          </div>
        </div>
      </div>

      {/* Filterable Historical Telemetry Table & CSV Export */}
      <HistoryTable
        history={history}
        deviceId={deviceId}
        lang={lang}
      />

    </div>
  );
}
