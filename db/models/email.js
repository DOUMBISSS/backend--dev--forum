import mongoose from 'mongoose';
import validator from  'validator';

let emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
          return validator.isEmail(value)
        }
      },
      date: { type: Date, default: Date.now },
})