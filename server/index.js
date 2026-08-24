const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("CONNECTED"))
.catch((err)=>console.log(err));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.listen(process.env.PORT, ()=>{
    console.log("Server Running : 5000");
});