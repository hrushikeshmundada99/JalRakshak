import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  Filter,
  MapPin,
  Wrench,
  FileText,
  Globe,
  Droplet,
  Sun,
  Users,
  Cpu
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang.startsWith('hi') ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  const tabs = [
    { id: 'telemetry', label: t('tabTelemetry'), icon: <TrendingUp size={16} /> },
    { id: 'schematic', label: t('tabSchematic'), icon: <Filter size={16} /> },
    { id: 'gis', label: t('tabGisMap'), icon: <MapPin size={16} /> },
    { id: 'health', label: t('tabHealth'), icon: <Wrench size={16} /> },
    { id: 'reports', label: t('tabReports'), icon: <FileText size={16} /> }
  ];

  return (
    <header style={{ marginBottom: '24px' }}>
      
      {/* 1. Main Header Navigation Bar */}
      <div className="glass-panel" style={{
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderRadius: '16px 16px 0 0',
        borderBottom: 'none'
      }}>
        
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D2FF 0%, #0B4F8A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 210, 255, 0.4)'
          }}>
            <Droplet size={24} color="#FFFFFF" fill="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                {t('appTitle')}
              </h1>
              <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>
                {t('appTitleRegional')}
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Center Pill Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(7, 14, 28, 0.6)',
          padding: '5px',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '24px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  background: isActive
                    ? 'linear-gradient(135deg, #00A3FF 0%, #0B4F8A 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 20px rgba(0, 163, 255, 0.4)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* IoT Stream Online Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 16px',
            borderRadius: '24px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34D399',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}>
            <span className="pulse-dot" style={{ background: '#10B981' }}></span>
            <span>{t('iotOnline')}</span>
          </div>

          {/* Language Switcher using react-i18next */}
          <button
            onClick={toggleLanguage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Globe size={15} color="#00D2FF" />
            <span>{currentLang.startsWith('hi') ? 'English' : 'हिन्दी'}</span>
          </button>

        </div>

      </div>

      {/* 2. Sub-Header Metadata Ticker Bar */}
      <div style={{
        background: 'rgba(5, 12, 24, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderTop: 'none',
        borderRadius: '0 0 16px 16px',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.78rem',
        color: '#94A3B8'
      }}>
        
        {/* Metric Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} color="#00D2FF" />
            <span>{t('activeUnitLabel')}</span>
            <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{t('activeUnitVal')}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplet size={14} color="#34D399" />
            <span>{t('purifiedLabel')}</span>
            <strong style={{ color: '#34D399' }}>{t('purifiedVal')}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} color="#C084FC" />
            <span>{t('beneficiariesLabel')}</span>
            <strong style={{ color: '#C084FC' }}>{t('beneficiariesVal')}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sun size={14} color="#FBBF24" />
            <span>{t('solarInputLabel')}</span>
            <strong style={{ color: '#FBBF24' }}>{t('solarInputVal')}</strong>
          </div>

        </div>

        {/* Right Dept Credit */}
        <div style={{ fontSize: '0.74rem', color: '#64748B', fontFamily: 'monospace' }}>
          {t('govBrand')}
        </div>

      </div>

    </header>
  );
}
