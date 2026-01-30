import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    const navLinkStyle = { 
    margin: '0 15px', 
    color: '#2c2b2b', 
    textDecoration: 'none',
    fontSize: '16px'
  };

  const registerButtonStyle = {
    padding: '10px 20px',
    background: '#1a1a3b',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    marginLeft: '15px'
  };

  return (
    <div style={{ margin: 0, padding: 0, boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', background: '#fff' }}>
      
      {/* HEADER */}
      <header style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 60px',
        position: 'fixed',
        top: 0,
        background: '#fff',
        zIndex: 10,
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1px', fontSize: '26px', fontWeight: 700 }}>
          <img src="logo.png" alt="Logo" style={{ height: '75px', width: 'auto', display: 'block' }} />
          <span>Nepal TrekMate</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{...navLinkStyle, fontWeight: 'bold', color: '#2D7DBF'}}>Home</Link>
          <Link to="/about" style={{ ...navLinkStyle, fontWeight: 'bold', color: '#2D7DBF' }}>About</Link>
          <Link to="/login" style={{ ...navLinkStyle, fontWeight: 'bold', color: '#2D7DBF' }}>Login</Link>
          <Link to="/register" style={registerButtonStyle}>Sign Up</Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '140px 10px 10px', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '50px', lineHeight: 1.2 }}>Discover the Magic of Nepal</h1>
          <p style={{ marginBottom: '20px', color: '#555' }}>Experience breathtaking mountains, ancient temples, and rich culture</p>
        </div>
        <div style={{ borderRadius: '10px' }}>
          <img src="ne.png" alt="Hero Image" style={{ width: '450px', borderRadius: '10px' }} />
        </div>
      </div>

      {/* WHY CHOOSE US SECTION */}
      <section style={{ padding: '60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '50px', textAlign: 'center' }}>Why Choose Us?</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', justifyContent: 'center', padding: '0 80px' }}>
          
          <div style={{ background: '#f8f8f8', padding: '55px 20px', borderRadius: '15px', boxShadow: '0px 4px 10px rgba(159, 9, 9, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>👥</div>
            <h2 style={{ fontSize: '26px', margin: '10px 0', fontWeight: 700 }}>Expert Guides</h2>
            <p style={{ fontSize: '20px', marginTop: '10px' }}>Professional guides with years of experience</p>
          </div>

          <div style={{ background: '#f8f8f8', padding: '55px 20px', borderRadius: '15px', boxShadow: '0px 4px 10px rgba(159, 9, 9, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>🎒</div>
            <h2 style={{ fontSize: '26px', margin: '10px 0', fontWeight: 700 }}>Custom Packages</h2>
            <p style={{ fontSize: '20px', marginTop: '10px' }}>Tailored tours to match your preferences</p>
          </div>

          <div style={{ background: '#f8f8f8', padding: '55px 20px', borderRadius: '15px', boxShadow: '0px 4px 10px rgba(159, 9, 9, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>🛡️</div>
            <h2 style={{ fontSize: '26px', margin: '10px 0', fontWeight: 700 }}>Safe & Secure</h2>
            <p style={{ fontSize: '20px', marginTop: '10px' }}>Your safety is our top priority</p>
          </div>

          {/* LOWER CARD */}
          <div style={{ background: '#f8f8f8', padding: '55px 20px', borderRadius: '15px', boxShadow: '0px 4px 10px rgba(159, 9, 9, 0.1)', textAlign: 'center', gridColumn: '2 / 3', marginTop: '20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>💰</div>
            <h2 style={{ fontSize: '26px', margin: '10px 0', fontWeight: 700 }}>Best Prices</h2>
            <p style={{ fontSize: '20px', marginTop: '10px' }}>Competitive rates with no hidden fees</p>
          </div>
        </div>
      </section>

      {/* STEPS WRAPPER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 80px 80px' }}>
        
        {/* LEFT STEPS */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '52px', fontWeight: 700, marginBottom: '40px', color: '#1a1a3b' }}>
            Book your next trip <br /> in 3 easy steps
          </h1>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '40px', maxWidth: '350px' }}>
            <div style={{ width: '55px', height: '55px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', color: 'white', background: '#F0C419' }}>▣</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Choose Destination</h3>
              <p style={{ marginTop: '6px', color: '#666', fontSize: '15px', lineHeight: 1.4 }}>View available packages, dates, prices, and trek details.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '40px', maxWidth: '350px' }}>
            <div style={{ width: '55px', height: '55px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', color: 'white', background: '#E56B45' }}>💳</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Make Payment</h3>
              <p style={{ marginTop: '6px', color: '#666', fontSize: '15px', lineHeight: 1.4 }}>Proceed to checkout and complete payment.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '40px', maxWidth: '350px' }}>
            <div style={{ width: '55px', height: '55px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', color: 'white', background: '#2D7DBF' }}>🥾</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Start your Trek</h3>
              <p style={{ marginTop: '6px', color: '#666', fontSize: '15px', lineHeight: 1.4 }}>Meet your guide/team at the starting point.</p>
            </div>
          </div>
        </div>

        {/* RIGHT CARD STACK */}
        <div style={{ position: 'relative', paddingRight: '40px' }}>
          <div style={{ width: '330px', background: '#fff', borderRadius: '22px', padding: '0 20px 25px', boxShadow: '0px 20px 35px rgba(0,0,0,0.08)' }}>
            <img src="guide.png" alt="" style={{ width: '100%', borderRadius: '22px', marginTop: '20px' }} />
            <h2 style={{ fontSize: '22px', margin: '15px 0 5px' }}>Trip To Chitwan</h2>

            <div style={{ color: '#777', fontSize: '14px', display: 'flex', gap: '8px', marginBottom: '15px' }}>
              <span>14–20 Feb</span>
              <span>|</span>
              <span>by Prakash Tamang</span>
            </div>

            <div style={{ display: 'flex' }}>
              <span style={{ fontSize: '18px', marginRight: '18px', opacity: 0.7 }}>📍</span>
              <span style={{ fontSize: '18px', marginRight: '18px', opacity: 0.7 }}>🗺️</span>
              <span style={{ fontSize: '18px', marginRight: '18px', opacity: 0.7 }}>🥾</span>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>👥 10 people going</span>
              <span>🤍</span>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '-40px', right: '-30px', display: 'flex', background: 'white', padding: '18px', borderRadius: '18px', width: '240px', boxShadow: '0px 20px 30px rgba(0,0,0,0.1)', gap: '15px' }}>
            <img src="rhino.png" alt="" style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
            <div>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Ongoing</p>
              <h4 style={{ fontSize: '16px', margin: '3px 0' }}>Trip to Chitwan</h4>
              <p style={{ fontSize: '13px', color: '#6A43FA', margin: '0 0 5px' }}>40% completed</p>
              <div style={{ width: '100%', height: '5px', background: '#e5dbff', borderRadius: '5px' }}>
                <div style={{ width: '40%', height: '5px', background: '#6A43FA', borderRadius: '5px' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Homepage;
  