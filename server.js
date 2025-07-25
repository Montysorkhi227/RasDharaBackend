const express = require('express');
const app = express();
const DB = require("../server/config/db")
const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
const userRoutes = require("./routes/userRoutes")
const adminRoutes = require("./routes/adminRoutes")

DB()

app.use(cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
    
app.use(express.json());


// app.use('/api/auth', authRoutes);
// app.use('/api/product', productRoutes); 
app.use('/api/user', userRoutes); 
app.use('/api/admin',adminRoutes)

// 🔐 Protected route example
// app.post('/api/protected', async (req, res) => {
//   const authHeader = req.headers.authorization || '';
//   const idToken = authHeader.startsWith('Bearer ')
//     ? authHeader.split('Bearer ')[1]
//     : null;

//   if (!idToken) return res.status(401).json({ error: 'No token provided' });

//   try {
//     const decoded = await admin.auth().verifyIdToken(idToken);
//     res.json({ success: true, uid: decoded.uid });
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid or expired token' });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
