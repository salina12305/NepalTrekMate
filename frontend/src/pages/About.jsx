
import React from 'react';
import { Link } from 'react-router-dom'; 

const About = () => {

  const navLinkStyle = { 
    margin: '0 15px', 
    color: '#2c2b2b', 
    textDecoration: 'none',
    fontSize: '16px'
  };

  const registerButtonStyle = {
    ...navLinkStyle,
    padding: '10px 20px',
    background: '#1a1a3b',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    marginLeft: '15px'
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
      {/* Header */}
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
          <Link to="/login" style={{ ...navLinkStyle, fontWeight: 'bold', color: '#2D7DBF' }}>Login</Link>
          <Link to="/register" style={registerButtonStyle}>Sign Up</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '160px 20px 80px', 
        textAlign: 'center', 
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>Your Journey, Our Mission</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
          Nepal TrekMate was built to help you navigate the breathtaking trails of the Himalayas with confidence and community.
        </p>
      </section>

      {/* Content Section */}
      <section style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#2D7DBF', fontSize: '2rem', textAlign: 'center' }}>Who We Are</h2>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#555' }}>
          Founded in 2025, <strong>Nepal TrekMate</strong> is dedicated to making the wonders of Nepal accessible to everyone. 
          From the Everest Base Camp to the hidden gems of the Annapurna circuit, we provide the platform to plan, track, and share your adventures.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '40px' }}>
          <div style={{ flex: '1', minWidth: '300px', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '12px', borderLeft: '5px solid #2D7DBF' }}>
            <h3 style={{ color: '#2D7DBF' }}>Our Vision</h3>
            <p>To be the #1 digital companion for trekking in Nepal, promoting sustainable tourism and local heritage.</p>
          </div>
          <div style={{ flex: '1', minWidth: '300px', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '12px', borderLeft: '5px solid #2d5a27' }}>
            <h3 style={{ color: '#2d5a27' }}>Our Values</h3>
            <p>We prioritize trekker safety, environmental conservation, and authentic cultural exchange.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#2d5a27', color: 'white' }}>
        <h2>Ready to explore the Himalayas?</h2>
        <p style={{ marginBottom: '25px' }}>Join our community of trekkers and start your adventure today.</p>
        <Link to="/register" style={{ 
          padding: '12px 30px', 
          fontSize: '1rem', 
          backgroundColor: '#ff7e5f', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '30px', 
          fontWeight: 'bold',
          display: 'inline-block'
        }}>
          Get Started for Free
        </Link>
      </footer>
    </div>
  );
};

export default About;