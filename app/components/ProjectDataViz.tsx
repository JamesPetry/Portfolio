'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { parseUrbanData, UrbanAnalysisData } from '@/lib/parseUrbanData';

interface ProjectDataVizProps {
  dataUrl: string;
  className?: string;
}

export default function ProjectDataViz({ dataUrl, className = '' }: ProjectDataVizProps) {
  const [data, setData] = useState<UrbanAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    fetch(dataUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.text();
      })
      .then((text) => {
        if (!isMounted) return;
        try {
          const parsed = parseUrbanData(text);
          setData(parsed);
          setError(null);
        } catch (err) {
          if (isMounted) {
            setError('Failed to parse data');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError('Failed to load data');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dataUrl]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-black/5 p-8 ${className}`}>
        <p className="text-black/40 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null; // Don't show loading, just render nothing until data loads
  }

  // Prepare data for visualizations
  const isovistData = data.isovistSM.map((s, i) => ({
    distance: s,
    area: data.isovistAreaM2[i],
    occlusivity: data.isovistOcclusivity[i],
  }));

  const nodeData = data.nodeX.map((x, i) => ({
    x,
    y: data.nodeY[i],
    closeness: data.nodeCloseness[i],
    betweenness: data.nodeBetweenness[i],
  }));

  // Color scale for node data based on closeness
  const getNodeColor = (closeness: number) => {
    const intensity = Math.floor(closeness * 255);
    return `rgba(0, 0, 0, ${0.3 + closeness * 0.5})`;
  };

  const metrics = [
    { label: 'Total GFA', value: `${(data.gfaTotalM2 / 1000).toFixed(0)}k m²` },
    { label: 'Park Area', value: `${(data.parkAreaTotalM2 / 1000).toFixed(0)}k m²` },
    { label: 'Path Length', value: `${data.pathLengthM.toFixed(0)} m` },
    { label: 'Height Range', value: `${data.heightLevelsMin}-${data.heightLevelsMax} levels` },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-black/5 p-4 rounded">
            <div className="text-xs text-black/60 mb-1">{metric.label}</div>
            <div className="text-lg font-medium text-black">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Isovist Area Chart */}
      <div className="bg-white p-4 rounded">
        <h3 className="text-sm font-medium text-black/80 mb-4">Isovist Area by Distance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={isovistData.slice(0, 10)}>
            <XAxis dataKey="distance" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v.toFixed(0)}m`} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px' }}
            />
            <Bar dataKey="area" fill="rgba(0, 0, 0, 0.6)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Node Network Scatter */}
      <div className="bg-white p-4 rounded">
        <h3 className="text-sm font-medium text-black/80 mb-4">Network Centrality Map</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart>
            <XAxis type="number" dataKey="x" hide />
            <YAxis type="number" dataKey="y" hide />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px' }}
            />
            <Scatter name="Nodes" data={nodeData} fill="rgba(0, 0, 0, 0.5)">
              {nodeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getNodeColor(entry.closeness)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
