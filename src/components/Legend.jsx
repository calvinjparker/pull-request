// Key to the icons and line styles used in every diagram.
export default function Legend() {
  const row = (icon, label) => (
    <li><svg viewBox="-3 -2 10 4" className="legend-icon">{icon}</svg><span>{label}</span></li>
  );
  return (
    <details className="legend">
      <summary>Key</summary>
      <ul>
        {row(<g className="player offense"><circle cx={2} r={1.5} className="body" /></g>, 'Offense')}
        {row(<g className="player defense"><path d="M2,-1.8 L3.7,1.2 L0.3,1.2 Z" className="body" /></g>, 'Defense (M = marker)')}
        {row(<g className="disc"><circle cx={2} r={0.75} /></g>, 'Disc')}
        {row(<path d="M-2,0 H5" className="path path-cut" markerEnd="url(#ah-cut)" />, 'Hard cut')}
        {row(<path d="M-2,0 H5" className="path path-jog" />, 'Jog / setup')}
        {row(<path d="M-2,0 H5" className="path path-clear" />, 'Clearing out')}
        {row(<path d="M-2,0 H5" className="path path-throw" />, 'Throw')}
        {row(<rect x={-2} y={-1.5} width={8} height={3} className="zone-swatch" />, 'Space to attack')}
      </ul>
    </details>
  );
}
