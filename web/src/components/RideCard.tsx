interface RideCardProps {
  ride: {
    _id: string;
    name: string;
    park: string;
    description?: string;
    heightRequirement?: number;
    thrillLevel?: number;
    rideType?: string;
    accessibility?: string[];
    image?: {
      asset: { url?: string };
      alt?: string;
    };
    isClosed?: boolean;
    closureNote?: string;
  };
}

export default function RideCard({ ride }: RideCardProps) {
  const getThrillColor = (level: number) => {
    if (level >= 4) return '#e53e3e';
    if (level >= 3) return '#dd6b20';
    if (level >= 2) return '#d69e2e';
    return '#38a169';
  };

  const getThrillLabel = (level: number) => {
    if (level >= 4) return 'High Thrill';
    if (level >= 3) return 'Medium Thrill';
    if (level >= 2) return 'Low Thrill';
    return 'Family';
  };

  return (
    <div className="ride-card">
      <div className="ride-card-header">
        <h3>{ride.name}</h3>
        {ride.isClosed && <span className="ride-closed-badge">Closed</span>}
      </div>
      
      <div className="ride-meta">
        <span className="ride-park">{ride.park}</span>
        {ride.rideType && <span className="ride-type">{ride.rideType}</span>}
      </div>
      
      {ride.description && <p className="ride-description">{ride.description}</p>}
      
      <div className="ride-stats">
        {ride.heightRequirement !== undefined && ride.heightRequirement > 0 && (
          <div className="ride-stat">
            <span className="stat-label">Height</span>
            <span className="stat-value">{ride.heightRequirement}"+</span>
          </div>
        )}
        {ride.thrillLevel && (
          <div className="ride-stat">
            <span className="stat-label">Thrill</span>
            <span 
              className="stat-value thrill-badge"
              style={{ backgroundColor: getThrillColor(ride.thrillLevel) }}
            >
              {getThrillLabel(ride.thrillLevel)}
            </span>
          </div>
        )}
      </div>
      
      {ride.isClosed && ride.closureNote && (
        <p className="closure-note">{ride.closureNote}</p>
      )}
      
      <style>{`
        .ride-card {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem;
        }
        
        .ride-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .ride-card-header h3 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
        }
        
        .ride-closed-badge {
          background: #e53e3e;
          color: white;
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
        }
        
        .ride-meta {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }
        
        .ride-park {
          font-size: 0.8125rem;
          color: var(--primary);
          font-weight: 500;
        }
        
        .ride-type {
          font-size: 0.8125rem;
          color: var(--text-light);
        }
        
        .ride-description {
          font-size: 0.875rem;
          color: var(--text-medium);
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }
        
        .ride-stats {
          display: flex;
          gap: 1rem;
        }
        
        .ride-stat {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        
        .stat-label {
          font-size: 0.6875rem;
          color: var(--text-light);
          text-transform: uppercase;
        }
        
        .stat-value {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-dark);
        }
        
        .thrill-badge {
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
        }
        
        .closure-note {
          font-size: 0.8125rem;
          color: #e53e3e;
          margin-top: 0.75rem;
          padding: 0.5rem;
          background: #fff5f5;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
