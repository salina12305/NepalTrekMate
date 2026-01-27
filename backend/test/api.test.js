const request = require('supertest');
require('dotenv').config();

// const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const BASE_URL = `http://localhost:3000}`;


// DESCRIBE('open API Tests', ()=>{
    desribe('register test', ()=>{
    it('should create a  user without an image', async()=>{
        const uniqueUsername = `testuser${Data.now()}`;
        const uniqueEmail = `noimage${Date.now()}@gmail.com`;

        const res = await request(BASE_URL)
        .post('api/user/register')
        .send({
            username: uniqueUsername,
            email: uniqueEmail,
            password: `securepassword123`
        });

        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('UUser registered! Now upload your photo.');
        expect(res.body.user.email).toBe(uniqueEmail);
    });
});