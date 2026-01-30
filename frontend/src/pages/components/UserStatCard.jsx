
import React, { useState } from 'react';

const UserStatCard = ({ icon, label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    background: '#E0F2F7',
    borderRadius: '15px',
    padding: '20px',
    flex: 1,
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: isHovered ? '0px 8px 15px rgba(0,0,0,0.1)' : '0px 4px 10px rgba(0,0,0,0.05)',
    border: '1px solid #CFE2E8',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'all 0.2s ease-in-out'
  };

  return (
    <div 
      style={cardStyle} 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>
        {label}
      </h3>
    </div>
  );
};

export default UserStatCard;