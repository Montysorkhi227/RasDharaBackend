const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
  username: {type:String , required:true},
  phone: { type: Number, required:true, unique: true },
  email: { type: String, required:true, unique: true },
  password: {type:String , required:true},
  role: { type: String, enum: ['User'], default: 'User' }, 
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600
  },
},{
  timestamps: true,
  autoIndex: true,
});

module.exports = mongoose.model('TemporaryUser', tempSchema);
 