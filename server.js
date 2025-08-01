const express = require('express');
const app = express();
const DB = require("./config/db")
const cors = require('cors');
const userRoutes = require("./routes/userroutes")
const adminRoutes = require("./routes/adminroutes")
const authRoutes = require("./routes/authroutes")
const productRoutes = require("./routes/productroutes")
DB()

app.use(cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
    
app.use(express.json());
app.use('/api/user', userRoutes); 
app.use('/api/admin',adminRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/product',productRoutes)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
