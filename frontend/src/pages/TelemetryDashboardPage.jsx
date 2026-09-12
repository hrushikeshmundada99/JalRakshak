import React from 'react';
import LiveStatusHero from '../components/LiveStatusHero';
import DemoControlPanel from '../components/DemoControlPanel';
import MLRiskCard from '../components/MLRiskCard';
import AlertLog from '../components/AlertLog';

export default function TelemetryDashboardPage({
  currentReading,
  history,
  alerts,
  deviceId,
  lang,
  onManualPush
}) {
  return (
    <div>
      
      {/* Live Status Hero Banner & 4 Sparkline Parameter Cards */}
      <LiveStatusHero
        reading={currentReading}
        history={history}
        lang={lang}
      />

      {/* Demo Control Panel (Collapsible Drawer) */}
      <DemoControlPanel
        deviceId={deviceId}
        lang={lang}
        onManualPush={onManualPush}
      />

      {/* ML Risk Prediction & Emergency Alert Dispatch Log */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <MLRiskCard reading={currentReading} lang={lang} />
        <AlertLog alerts={alerts} lang={lang} />
      </div>

    </div>
  );
}
