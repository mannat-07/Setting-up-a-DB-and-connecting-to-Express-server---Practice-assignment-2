const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const user = require('./schema');

const app = express();
const port = 3010;

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("Connected to database");
})
.catch((err)=>{
  console.log("Error connecting to database", err);
})

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/api/users', async (req,res)=>{
  try{
    const data = req.body;
    const newUser = new user(data);
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  }

  catch(err){
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', details: err.message });
    } 
    else {
      res.status(500).json({ message: 'Server error', details: err.message });
    }
  }

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
