import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, ShieldAlert, PhoneCall } from 'lucide-react';

export default function AlertLog({ alerts }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EF4444'
          }}>
            <Bell size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              {t('alertsTitle')}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t('alertsSub')}
            </p>
          </div>
        </div>

        <span style={{
          fontSize: '0.72rem',
          padding: '4px 10px',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#FCA5A5',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          fontWeight: 700
        }}>
          {alerts ? alerts.length : 0} Active Logs
        </span>
      </div>

      {/* Alert List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: '340px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingRight: '4px'
      }}>
        {(!alerts || alerts.length === 0) ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-dim)',
            fontSize: '0.88rem'
          }}>
            {t('noAlerts')}
          </div>
        ) : (
          alerts.map((alert) => {
            const isUnsafe = alert.alert_level === 'UNSAFE';
            return (
              <div
                key={alert.id}
                style={{
                  background: isUnsafe ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  border: isUnsafe ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={16} color={isUnsafe ? '#EF4444' : '#F59E0B'} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isUnsafe ? '#FCA5A5' : '#FBBF24' }}>
                      {alert.alert_level} — {alert.risk_label}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Simulated SMS Dispatch */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  color: '#E2E8F0',
                  lineHeight: '1.4'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8', marginBottom: '4px', fontSize: '0.72rem', fontFamily: 'var(--font-main)' }}>
                    <PhoneCall size={12} />
                    <span>Jal Sahiya SMS Gateway (Simulated Dispatch):</span>
                  </div>
                  <div>{currentLang.startsWith('hi') ? alert.sms_hindi : alert.sms_english}</div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
