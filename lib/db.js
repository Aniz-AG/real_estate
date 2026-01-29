import mongoose from 'mongoose';

const connection = {};

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please check your .env file');
}

export async function connectDB() {
    if (connection.isConnected) {
        console.log('Using existing database connection');
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not set. Check your .env file.');
    }

    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const db = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,  // Increased timeout for DNS issues
                socketTimeoutMS: 45000,
                family: 4,  // Force IPv4 - helps with DNS resolution issues
                maxPoolSize: 10,
                retryWrites: true,
            });

            connection.isConnected = db.connections[0].readyState;
            console.log('✅ MongoDB Connected Successfully');
            return;
        } catch (error) {
            lastError = error;
            console.error(`❌ MongoDB Connection Error (attempt ${attempt}/${maxRetries}):`, error.message);

            if (attempt < maxRetries) {
                const delay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
                console.log(`⏳ Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw new Error(`Database connection failed after ${maxRetries} attempts: ${lastError.message}`);
}
