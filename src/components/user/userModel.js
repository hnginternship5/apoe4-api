import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import validator from 'validator';
import bcrypt from 'bcrypt';

import timestamps from 'mongoose-timestamp';

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please enter your email address',
    },
    phoneNumber: {
        type: Number,
        unique: true
    },
    password: {
        type: String,
        required: 'You must enter a password',
        trim: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    customType: {
        type: String,
        default: 'users',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    accessToken: String,
    refreshToken: String,
    lastLogin: String,
    loginAttempts: String,
    ipAddress: String,
    avatar: String,
    twitter: String,
    instagram: String,
    facebook: String,
    linkedin: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

UserSchema.plugin(timestamps, {
    createdAt: {
        index: true,
    },
    updatedAt: {
        index: true,
    },
});

UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Hash password
UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = this.encryptPassword(this.password);
    next();
});

UserSchema.methods = {
    encryptPassword: (plainTextWord) => {
        if (!plainTextWord) return '';
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(plainTextWord, salt);
    },
    comparePassword: function (password) {
        return bcrypt.compareSync(password, this.password);
    },
};


module.exports = mongoose.model('User', UserSchema);