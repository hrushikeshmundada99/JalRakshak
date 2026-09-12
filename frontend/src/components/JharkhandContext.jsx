import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MapPin, Database } from 'lucide-react';
import { i18n } from '../i18n';

export default function JharkhandContext({ lang }) {
  const t = i18n[lang] || i18n.en;

  const data = [
    { name: 'Iron & Manganese', value: 35, color: '#FBBF24' },
    { name: 'Acid Mine Drainage (AMD)', value: 25, color: '#EF4444' },
    { name: 'Fluoride Contamination', value: 20, color: '#C084FC' },
    { name: 'Microbial Surface Runoff', value: 15, color: '#F472B6' },
    { name: 'Sediment / Turbidity', value: 5, color: '#34D399' }
  ];

  const districts = [
    { name: "Dhanbad", type: "Coal Belt / AMD", hazard: "Acid Mine Drainage (Low pH 4.2-5.5)" },
    { name: "Bokaro", type: "Industrial Mining", hazard: "Heavy Mineral TDS (>1400 ppm)" },
    { name: "West Singhbhum", type: "Iron Ore Belt", hazard: "Oxidized Iron & High Sediment" },
    { name: "Palamu / Garhwa", type: "Drought Aquifers", hazard: "Toxic Fluoride (>1.5 mg/L)" }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(0, 210, 255, 0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34D399'
          }}>
            <MapPin size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
              {t.jharkhandTitle}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {t.jharkhandSub}
            </p>
          </div>
        </div>

        <div style={{
          fontSize: '0.75rem',
          padding: '4px 12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#38BDF8',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Database size={14} />
          <span>CGWB Regional Hydro-Geological Baseline</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        
        {/* Donut Chart */}
        <div style={{ height: '220px', width: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(10, 20, 38, 0.95)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.8rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>100%</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Mining Risks</div>
          </div>
        </div>

        {/* Legend & District Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Legend Items */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {data.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                <span>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>

          {/* District Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {districts.map((d) => (
              <div key={d.name} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '0.78rem'
              }}>
                <div style={{ fontWeight: 700, color: '#00D2FF', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{d.name}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{d.type}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>
                  {d.hazard}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
