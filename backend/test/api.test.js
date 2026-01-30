// for bookings

// const request = require('supertest');
// const app = require('../index'); 
// const { sequelize, connectDB } = require('../database/database');
// const path = require('path');
// const fs = require('fs');

// beforeAll(async () => {
//   await connectDB();
// });

// afterAll(async () => {
//   await sequelize.close();
// });

// const getUniqueStr = () => `${Date.now()}_${Math.floor(Math.random() * 1000)}`;

// describe('Nepal TrekMate: Booking and Trip Lifecycle', () => {
//   let adminToken, agentToken, userToken;
//   let agentId, userId, packageId, bookingId;
//   const password = 'Password123!';

//   // --- SECTION 1: AUTH & APPROVAL SETUP ---

//   it('Step 1: Setup Admin and Approved Agent', async () => {
//     const id = getUniqueStr();
//     const agentEmail = `agent_${id}@test.com`;
//     const adminEmail = `admin_${id}@test.com`;

//     // 1. Register Agent
//     const regAgent = await request(app).post('/api/user/register').send({
//       fullName: `Agent ${id}`, email: agentEmail, password, role: 'travelagent'
//     });
//     agentId = regAgent.body.user.id;

//     // 2. Register/Login Admin
//     await request(app).post('/api/user/register').send({
//       fullName: `Admin ${id}`, email: adminEmail, password, role: 'admin'
//     });
//     const adminLogin = await request(app).post('/api/user/login').send({
//       email: adminEmail, password, role: 'admin'
//     });
//     adminToken = adminLogin.body.token;

//     // 3. Approve Agent
//     await request(app)
//       .put(`/api/user/approve-user/${agentId}`)
//       .set('Authorization', `Bearer ${adminToken}`);

//     // 4. Login Agent
//     const agentLogin = await request(app).post('/api/user/login').send({
//       email: agentEmail, password, role: 'travelagent'
//     });
//     agentToken = agentLogin.body.token;
//   });

//   // --- SECTION 2: CONTENT CREATION ---

//   it('Step 2: Create Package for Booking', async () => {
//     const filePath = path.join(__dirname, 'temp_pkg.png');
//     fs.writeFileSync(filePath, 'dummy_image_buffer');

//     const res = await request(app)
//       .post('/api/packages/add')
//       .set('Authorization', `Bearer ${agentToken}`)
//       .field('packageName', 'Annapurna Sanctuary')
//       .field('description', 'A majestic trek to the base camp.')
//       .field('destination', 'Pokhara, Nepal')
//       .field('price', '950')
//       .field('durationDays', '10')
//       .field('agentId', agentId)
//       .attach('packageImage', filePath);

//     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

//     expect(res.status).toBe(201);
//     packageId = res.body.data.id;
//   });

//   // --- SECTION 3: BOOKING OPERATIONS ---

//   it('Step 3: Register Regular User and Create Booking', async () => {
//     const id = getUniqueStr();
//     const userEmail = `user_${id}@test.com`;

//     // 1. User Registration
//     await request(app).post('/api/user/register').send({
//       fullName: `Trekker ${id}`, email: userEmail, password, role: 'user'
//     });

//     // 2. User Login
//     const userLogin = await request(app).post('/api/user/login').send({
//       email: userEmail, password, role: 'user'
//     });
//     userToken = userLogin.body.token;

//     // 3. Create Booking
//     const bookingRes = await request(app)
//       .post('/api/bookings/create')
//       .set('Authorization', `Bearer ${userToken}`)
//       .send({
//         packageId: packageId,
//         bookingDate: '2026-06-15',
//         numberOfPeople: 3
//       });

//     expect(bookingRes.status).toBe(201);
//     expect(bookingRes.body.success).toBe(true);
//     // Logic check: 950 * 3 = 2850
//     expect(bookingRes.body.booking.totalPrice).toBe(2850);
//     bookingId = bookingRes.body.booking.id;
//   });

//   // --- SECTION 4: MANAGEMENT & COMPLETION ---

//   it('Step 4: Update Booking Status (Admin)', async () => {
//     const res = await request(app)
//       .put(`/api/bookings/update-status/${bookingId}`)
//       .set('Authorization', `Bearer ${adminToken}`)
//       .send({ status: 'confirmed' });

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe("Status updated");
//   });

//   it('Step 5: Mark Trip as Completed (User)', async () => {
//     const res = await request(app)
//       .put(`/api/bookings/complete/${bookingId}`)
//       .set('Authorization', `Bearer ${userToken}`);

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe("Trip marked as completed!");
//   });
// });


//for packages
const request = require('supertest');
const app = require('../index'); 
const { sequelize, connectDB } = require('../database/database');
const path = require('path');
const fs = require('fs');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await sequelize.close();
});

const getUniqueStr = () => `${Date.now()}_${Math.floor(Math.random() * 1000)}`;

describe('Nepal TrekMate: Comprehensive Trip Lifecycle', () => {
  let adminToken, agentToken, userToken;
  let agentId, userId, packageId, bookingId;
  const password = 'Password123!';

  it('Step 1: Initialize System with Admin and Approved Agent', async () => {
    const id = getUniqueStr();
    const agentEmail = `agent_${id}@test.com`;
    const adminEmail = `admin_${id}@test.com`;

    const regAgent = await request(app).post('/api/user/register').send({
      fullName: `Agent ${id}`, 
      email: agentEmail, 
      password, 
      role: 'travelagent'
    });
    agentId = regAgent.body.user.id;

    await request(app).post('/api/user/register').send({
      fullName: `Admin ${id}`, 
      email: adminEmail, 
      password, 
      role: 'admin'
    });

    const adminLogin = await request(app).post('/api/user/login').send({
      email: adminEmail, 
      password, 
      role: 'admin'
    });
    adminToken = adminLogin.body.token;

    await request(app)
      .put(`/api/user/approve-user/${agentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    const agentLogin = await request(app).post('/api/user/login').send({
      email: agentEmail, 
      password, 
      role: 'travelagent'
    });
    agentToken = agentLogin.body.token;

    expect(agentToken).toBeDefined();
  });

  it('Step 2: Authenticated Agent Creates Tour Package', async () => {
    const filePath = path.join(__dirname, 'tour_pkg.png');
    fs.writeFileSync(filePath, 'fake image data');

    const res = await request(app)
      .post('/api/packages/add')
      .set('Authorization', `Bearer ${agentToken}`)
      .field('packageName', 'Annapurna Base Camp')
      .field('description', 'A trek to the heart of the Annapurnas')
      .field('destination', 'Pokhara')
      .field('price', '800')
      .field('durationDays', '7')
      .field('agentId', agentId)
      .attach('packageImage', filePath);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    expect(res.status).toBe(201);
    packageId = res.body.data.id;
    expect(packageId).toBeDefined();
  });

  it('Step 3: Traveler Registration and Package Booking', async () => {
    const id = getUniqueStr();
    const userEmail = `trekker_${id}@test.com`;

    await request(app).post('/api/user/register').send({
      fullName: `Trekker ${id}`, 
      email: userEmail, 
      password, 
      role: 'user'
    });

    const userLogin = await request(app).post('/api/user/login').send({
      email: userEmail, 
      password, 
      role: 'user'
    });
    userToken = userLogin.body.token;
    userId = userLogin.body.user.id;

    const bookingRes = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        packageId: packageId,
        bookingDate: '2026-05-20',
        numberOfPeople: 2
      });

    expect(bookingRes.status).toBe(201);
    expect(bookingRes.body.booking.totalPrice).toBe(1600); 
    bookingId = bookingRes.body.booking.id;
  });

  it('Step 4: Manage Booking Record and Verify Status Update', async () => {
    const getRes = await request(app)
      .get('/api/bookings/my-bookings')
      .set('Authorization', `Bearer ${userToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.data.length).toBeGreaterThan(0);

    const statusRes = await request(app)
      .put(`/api/bookings/update-status/${bookingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.message).toBe("Status updated");
  });

  it('Step 5: Conclude Trip and Finalize Booking', async () => {
    const res = await request(app)
      .put(`/api/bookings/complete/${bookingId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Trip marked as completed!");
  });
});