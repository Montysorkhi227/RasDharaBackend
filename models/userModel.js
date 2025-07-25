const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type:String , required:true},
  phone: { type: Number, required:true, unique: true },
  email: { type: String, required:true, unique: true },
  password: {type:String , required:true},
  role: { type: String, enum: ['User'], default: 'User' }, 
  profileImage: {type:String},
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('User', userSchema);
