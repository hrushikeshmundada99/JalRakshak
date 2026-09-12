const API_BASE = 'http://localhost:8000/api';
const WS_URL = 'ws://localhost:8000/ws/live';

export async function fetchLatestReading(deviceId = 'jalrakshak-unit-01') {
  const res = await fetch(`${API_BASE}/readings/latest?device_id=${deviceId}`);
  if (!res.ok) throw new Error('Failed to fetch latest reading');
  return res.json();
}

export async function fetchReadingHistory(deviceId = 'jalrakshak-unit-01', limit = 50, offset = 0) {
  const res = await fetch(`${API_BASE}/readings/history?device_id=${deviceId}&limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function fetchLatestRisk(deviceId = 'jalrakshak-unit-01') {
  const res = await fetch(`${API_BASE}/risk/${deviceId}/latest`);
  if (!res.ok) throw new Error('Failed to fetch risk prediction');
  return res.json();
}

export async function fetchAlerts(deviceId = 'jalrakshak-unit-01', limit = 20) {
  const res = await fetch(`${API_BASE}/alerts?device_id=${deviceId}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function pushManualOverride(reading) {
  const res = await fetch(`${API_BASE}/readings/manual-override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reading)
  });
  if (!res.ok) throw new Error('Manual override failed');
  return res.json();
}

export function getExportCsvUrl(deviceId = 'jalrakshak-unit-01') {
  return `${API_BASE}/readings/export?device_id=${deviceId}`;
}

export function connectWebSocket(onMessage, onStatusChange) {
  let ws = null;
  let reconnectTimer = null;

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      if (onStatusChange) onStatusChange('connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (err) {
        console.error('Failed to parse WS frame:', err);
      }
    };

    ws.onerror = (err) => {
      if (onStatusChange) onStatusChange('error');
    };

    ws.onclose = () => {
      if (onStatusChange) onStatusChange('disconnected');
      reconnectTimer = setTimeout(connect, 3000);
    };
  }

  connect();

  return () => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (ws) ws.close();
  };
}
