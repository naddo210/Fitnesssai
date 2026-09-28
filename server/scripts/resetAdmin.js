import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fitnessLevel: { type: String, default: 'Beginner' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    badges: { type: [String], default: [] },
    totalWorkouts: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function setAdmin(emailArg, passwordArg, nameArg) {
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI is missing from server/.env');
        process.exit(1);
    }

    const email = (emailArg || 'admin@fitnessai.com').toLowerCase().trim();
    const password = passwordArg || 'Admin123!';
    const name = nameArg || 'System Administrator';

    try {
        console.log(`Connecting to MongoDB Atlas...`);
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`✓ Connected to database.`);

        let user = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            user.role = 'admin';
            user.password = hashedPassword;
            if (nameArg) user.name = nameArg;
            await user.save();
            console.log(`\n========================================`);
            console.log(`✅ EXISTING USER PROMOTED TO ADMIN:`);
            console.log(`   User ID : ${user._id}`);
            console.log(`   Name    : ${user.name}`);
            console.log(`   Email   : ${user.email}`);
            console.log(`   Role    : ${user.role}`);
            console.log(`   Password: (Updated successfully)`);
            console.log(`========================================\n`);
        } else {
            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'admin',
                fitnessLevel: 'Advanced',
            });
            console.log(`\n========================================`);
            console.log(`✅ NEW ADMIN ACCOUNT CREATED:`);
            console.log(`   User ID : ${user._id}`);
            console.log(`   Name    : ${user.name}`);
            console.log(`   Email   : ${user.email}`);
            console.log(`   Role    : ${user.role}`);
            console.log(`   Password: (Saved successfully)`);
            console.log(`========================================\n`);
        }

        await mongoose.disconnect();
        console.log(`✓ Disconnected cleanly.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error updating admin account:', err.message);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
const emailInput = args[0];
const passwordInput = args[1];
const nameInput = args[2];

setAdmin(emailInput, passwordInput, nameInput);
