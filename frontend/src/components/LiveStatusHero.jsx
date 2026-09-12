import React from 'react';
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';
import { Activity, Droplet, TestTube, Thermometer, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { i18n } from '../i18n';

export default function LiveStatusHero({ reading, history, lang }) {
  const t = i18n[lang] || i18n.en;
  const status = reading?.status || 'SAFE';

  const statusConfig = {
    SAFE: {
      bgClass: 'glow-safe',
      badgeClass: 'badge-safe',
      icon: <CheckCircle2 size={24} color="#10B981" />,
      title: t.statusSafe,
      color: '#10B981',
      desc: "All physical & chemical parameters comply strictly with BIS 10500:2012 acceptable drinking standards."
    },
    WATCH: {
      bgClass: 'glow-watch',
      badgeClass: 'badge-watch',
      icon: <AlertTriangle size={24} color="#F59E0B" />,
      title: t.statusWatch,
      color: '#F59E0B',
      desc: "Moderate turbidity or elevated mineral TDS detected. Standard filtration active."
    },
    UNSAFE: {
      bgClass: 'glow-unsafe',
      badgeClass: 'badge-unsafe',
      icon: <ShieldAlert size={24} color="#EF4444" />,
      title: t.statusUnsafe,
      color: '#EF4444',
      desc: "Contamination hazard detected! UV-C disinfection engaged & Jal Sahiya notification dispatched."
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.SAFE;

  // Prepare chart sparkline data from history
  const sparkData = (history || []).slice(0, 25).reverse().map((item, idx) => ({
    index: idx,
    ph: item.ph,
    turbidity: item.turbidity_ntu,
    tds: item.tds_ppm,
    temp: item.temperature_c
  }));

  return (
    <section style={{ marginBottom: '24px' }}>
      
      {/* Top Banner Status Bar */}
      <div className={`glass-panel ${currentStatus.bgClass}`} style={{
        padding: '20px 28px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: `rgba(${status === 'SAFE' ? '16, 185, 129' : (status === 'WATCH' ? '245, 158, 11' : '239, 68, 68')}, 0.2)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentStatus.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: currentStatus.color }}>
                {currentStatus.title}
              </h2>
              <span className={currentStatus.badgeClass}>
                {status}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              {reading?.purification_action || currentStatus.desc}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          <div>Telemetry Source: <strong style={{ color: '#00D2FF' }}>{reading?.source || 'simulated'}</strong></div>
          <div>Last Reading: <strong>{reading?.timestamp ? new Date(reading.timestamp).toLocaleTimeString() : 'N/A'}</strong></div>
        </div>
      </div>

      {/* 4 Sensor Parameter Hero Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        
        {/* 1. pH Card */}
        <ParameterCard
          title={t.phLabel}
          value={reading?.ph ? reading.ph.toFixed(2) : '--'}
          unit={t.phUnit}
          status={reading?.ph_status || 'SAFE'}
          limit={t.phLimit}
          icon={<TestTube size={20} color="#00D2FF" />}
          sparkKey="ph"
          data={sparkData}
          strokeColor="#00D2FF"
          fillColor="rgba(0, 210, 255, 0.15)"
          yDomain={[3.5, 10.5]}
        />

        {/* 2. Turbidity Card */}
        <ParameterCard
          title={t.turbidityLabel}
          value={reading?.turbidity_ntu ? reading.turbidity_ntu.toFixed(2) : '--'}
          unit={t.turbidityUnit}
          status={reading?.turbidity_status || 'SAFE'}
          limit={t.turbidityLimit}
          icon={<Droplet size={20} color="#34D399" />}
          sparkKey="turbidity"
          data={sparkData}
          strokeColor="#34D399"
          fillColor="rgba(52, 211, 153, 0.15)"
          yDomain={[0, 45]}
        />

        {/* 3. TDS Card */}
        <ParameterCard
          title={t.tdsLabel}
          value={reading?.tds_ppm ? Math.round(reading.tds_ppm) : '--'}
          unit={t.tdsUnit}
          status={reading?.tds_status || 'SAFE'}
          limit={t.tdsLimit}
          icon={<Activity size={20} color="#FBBF24" />}
          sparkKey="tds"
          data={sparkData}
          strokeColor="#FBBF24"
          fillColor="rgba(251, 191, 36, 0.15)"
          yDomain={[100, 2000]}
        />

        {/* 4. Temperature Card */}
        <ParameterCard
          title={t.tempLabel}
          value={reading?.temperature_c ? reading.temperature_c.toFixed(1) : '--'}
          unit={t.tempUnit}
          status={reading?.temp_status || 'SAFE'}
          limit={t.tempLimit}
          icon={<Thermometer size={20} color="#F472B6" />}
          sparkKey="temp"
          data={sparkData}
          strokeColor="#F472B6"
          fillColor="rgba(244, 114, 182, 0.15)"
          yDomain={[10, 40]}
        />

      </div>
    </section>
  );
}

function ParameterCard({ title, value, unit, status, limit, icon, sparkKey, data, strokeColor, fillColor, yDomain }) {
  const badgeStyle = {
    SAFE: 'badge-safe',
    WATCH: 'badge-watch',
    UNSAFE: 'badge-unsafe'
  }[status] || 'badge-safe';

  return (
    <div className="glass-panel" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{title}</span>
        </div>
        <span className={badgeStyle} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
          {status}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
        <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
          {value}
        </span>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>{unit}</span>
      </div>

      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
        {limit}
      </div>

      {/* Mini Sparkline Chart */}
      <div style={{ height: '42px', width: '100%', margin: '0 -10px -10px -10px' }}>
        {data && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <YAxis domain={yDomain} hide />
              <Area type="monotone" dataKey={sparkKey} stroke={strokeColor} strokeWidth={2} fill={fillColor} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
