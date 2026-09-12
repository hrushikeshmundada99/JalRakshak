import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TelemetryDashboardPage from './pages/TelemetryDashboardPage';
import PurificationSchematicPage from './pages/PurificationSchematicPage';
import JharkhandGISMapPage from './pages/JharkhandGISMapPage';
import FilterSolarHealthPage from './pages/FilterSolarHealthPage';
import ComplianceReportsPage from './pages/ComplianceReportsPage';

import {
  fetchLatestReading,
  fetchReadingHistory,
  fetchAlerts,
  connectWebSocket
} from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [lang, setLang] = useState('en');
  const [deviceId, setDeviceId] = useState('jalrakshak-unit-01');
  const [wsStatus, setWsStatus] = useState('connecting');
  
  const [currentReading, setCurrentReading] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Fetch initial telemetry data
  const refreshData = async () => {
    try {
      const [latest, histRes, alertRes] = await Promise.all([
        fetchLatestReading(deviceId).catch(() => null),
        fetchReadingHistory(deviceId, 50, 0).catch(() => ({ readings: [] })),
        fetchAlerts(deviceId, 20).catch(() => [])
      ]);

      if (latest) setCurrentReading(latest);
      if (histRes?.readings) setHistory(histRes.readings);
      if (alertRes) setAlerts(alertRes);
    } catch (err) {
      console.error('Data initialization error:', err);
    }
  };

  useEffect(() => {
    refreshData();

    // Connect real-time WebSocket telemetry stream
    const cleanupWs = connectWebSocket(
      (newReading) => {
        setCurrentReading(newReading);
        setHistory(prev => [newReading, ...prev.slice(0, 99)]);
        if (newReading.status === 'UNSAFE' || newReading.status === 'WATCH') {
          fetchAlerts(deviceId, 20).then(res => setAlerts(res)).catch(() => {});
        }
      },
      (status) => {
        setWsStatus(status);
      }
    );

    return () => {
      cleanupWs();
    };
  }, [deviceId]);

  const handleManualPush = (newReading) => {
    setCurrentReading(newReading);
    setHistory(prev => [newReading, ...prev.slice(0, 99)]);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px 40px 24px', maxWidth: '1480px', margin: '0 auto' }}>
      
      {/* 1. Header Navigation Bar & Sub-Header Ticker Bar matching screenshot */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        wsStatus={wsStatus}
      />

      {/* 2. Dynamic Feature Page Switcher */}
      <main style={{ marginTop: '20px' }}>
        {activeTab === 'telemetry' && (
          <TelemetryDashboardPage
            currentReading={currentReading}
            history={history}
            alerts={alerts}
            deviceId={deviceId}
            lang={lang}
            onManualPush={handleManualPush}
          />
        )}

        {activeTab === 'schematic' && (
          <PurificationSchematicPage
            reading={currentReading}
            lang={lang}
          />
        )}

        {activeTab === 'gis' && (
          <JharkhandGISMapPage
            lang={lang}
          />
        )}

        {activeTab === 'health' && (
          <FilterSolarHealthPage
            lang={lang}
          />
        )}

        {activeTab === 'reports' && (
          <ComplianceReportsPage
            history={history}
            deviceId={deviceId}
            lang={lang}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer style={{
        textAlign: 'center',
        padding: '24px 0 10px 0',
        fontSize: '0.78rem',
        color: 'var(--text-dim)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        marginTop: '40px'
      }}>
        JalRakshak Smart Water Purification & Monitoring Platform | Developed by Team The Evolvers (ID 107) for SIH 2026 | Department of Higher & Technical Education, Govt of Jharkhand
      </footer>

    </div>
  );
}
