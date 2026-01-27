
import React from 'react';
import { Heart } from 'lucide-react'; // Import for the heart icon

const TripCard = ({ title, description, date, status, rating, icon, color, image, onClick, isWishlisted, onWishlistToggle }) => {
  const cardStyle = { 
    width: '380px', 
    borderRadius: '24px', // Increased roundness for a more modern look
    overflow: 'hidden', 
    boxShadow: '0px 10px 30px rgba(0,0,0,0.05)', 
    background: '#fff',
    border: '1px solid #f0f0f0',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.3s ease',
  };

  const handleHeartClick = (e) => {
    e.stopPropagation(); // Prevents the card's onClick (navigation) from firing
    if (onWishlistToggle) onWishlistToggle();
  };

  return (
    <div 
      style={cardStyle} 
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* HEADER SECTION */}
      <div style={{ 
        height: '220px', 
        background: color || '#f5f5f5', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '50px',
        overflow: 'hidden' 
      }}>
        {image ? (
          <img 
            src={image} 
            alt={title} 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              zIndex: 1
            }} 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
        ) : null}
        
        {/* Wishlist Heart Overlay */}
        <button 
          onClick={handleHeartClick}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isWishlisted ? '#ef4444' : '#64748b',
            transition: 'all 0.2s ease'
          }}
        >
          <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        
        {/* Fallback Icon */}
        <span style={{ zIndex: 0 }}>{icon || '🏔️'}</span>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{title}</h3>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f59e0b' }}>⭐ {rating || "5.0"}</span>
        </div>

        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5', height: '42px', overflow: 'hidden' }}>
          {description}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
             <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Price</span>
             <span style={{ fontWeight: '900', color: '#3b82f6', fontSize: '18px' }}>{date}</span>
          </div>

          <span style={{ 
            background: status === 'Available' ? '#f0fdf4' : '#fef2f2', 
            color: status === 'Available' ? '#16a34a' : '#dc2626', 
            padding: '6px 14px', 
            borderRadius: '100px', 
            fontWeight: 'bold',
            fontSize: '11px',
            border: `1px solid ${status === 'Available' ? '#dcfce7' : '#fee2e2'}`
          }}>
            {status || 'Available'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;