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
  onManualPush
}) {
  return (
    <div>
      
      {/* Live Status Hero Banner & 4 Sparkline Parameter Cards */}
      <LiveStatusHero
        reading={currentReading}
        history={history}
      />

      {/* Demo Control Panel (Collapsible Drawer) */}
      <DemoControlPanel
        deviceId={deviceId}
        onManualPush={onManualPush}
      />

      {/* ML Risk Prediction & Emergency Alert Dispatch Log */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <MLRiskCard reading={currentReading} />
        <AlertLog alerts={alerts} />
      </div>

    </div>
  );
}
