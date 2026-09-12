import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getExportCsvUrl } from '../api/client';

export default function HistoryTable({ history, deviceId }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const filteredData = (history || []).filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.status.toLowerCase().includes(term) ||
      item.risk_label.toLowerCase().includes(term) ||
      item.source.toLowerCase().includes(term) ||
      item.ph.toString().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header & CSV Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(0, 210, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00D2FF'
          }}>
            <Table size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
              {t('historyTitle')}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {t('historySub')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 12px 6px 32px',
                color: '#FFF',
                fontSize: '0.8rem',
                outline: 'none',
                width: '180px'
              }}
            />
          </div>

          {/* Export CSV Button */}
          <a
            href={getExportCsvUrl(deviceId)}
            download
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              transition: 'transform 0.2s ease'
            }}
          >
            <Download size={16} />
            <span>{t('exportCsv')}</span>
          </a>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', textAlign: 'left' }}>
              <th style={{ padding: '10px 14px' }}># ID</th>
              <th style={{ padding: '10px 14px' }}>Timestamp</th>
              <th style={{ padding: '10px 14px' }}>pH</th>
              <th style={{ padding: '10px 14px' }}>Turbidity (NTU)</th>
              <th style={{ padding: '10px 14px' }}>TDS (ppm)</th>
              <th style={{ padding: '10px 14px' }}>Temp (°C)</th>
              <th style={{ padding: '10px 14px' }}>Status</th>
              <th style={{ padding: '10px 14px' }}>ML Risk Label</th>
              <th style={{ padding: '10px 14px' }}>Source</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                  No historical telemetry readings found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-main)' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--text-dim)' }}>#{row.id}</td>
                  <td style={{ padding: '10px 14px' }}>{new Date(row.timestamp).toLocaleTimeString()}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.ph.toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.turbidity_ntu.toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{Math.round(row.tds_ppm)}</td>
                  <td style={{ padding: '10px 14px' }}>{row.temperature_c.toFixed(1)}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={
                      row.status === 'SAFE' ? 'badge-safe' : (row.status === 'WATCH' ? 'badge-watch' : 'badge-unsafe')
                    } style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#38BDF8' }}>{row.risk_label}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>{row.source}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div>
          Showing {paginatedData.length > 0 ? page * pageSize + 1 : 0} to {Math.min((page + 1) * pageSize, filteredData.length)} of {filteredData.length} entries
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: page === 0 ? 'var(--text-dim)' : '#FFF',
              cursor: page === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: page >= totalPages - 1 ? 'var(--text-dim)' : '#FFF',
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
