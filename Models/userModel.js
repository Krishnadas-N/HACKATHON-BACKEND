const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Password: {
        type: String,
        required: true,
        trim: true
    },
    Phone: {
        type: String,
        required: true,
        trim: true
    }
});


userSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.Password, salt);
            this.Password = hashedPassword;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;