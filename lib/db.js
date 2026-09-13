import mongoose from 'mongoose';

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please check your .env file');
}

let connectingPromise = null;

export async function connectDB() {
    // 1 = connected. Anything else (0 disconnected, 2 connecting, 3 disconnecting)
    // must not be treated as ready, otherwise queries buffer against a connection
    // that never finishes negotiating and time out silently.
    if (mongoose.connection.readyState === 1) {
        console.log('Using existing database connection');
        return;
    }

    if (connectingPromise) {
        return connectingPromise;
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not set. Check your .env file.');
    }

    const maxRetries = 3;
    let lastError;

    connectingPromise = (async () => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await mongoose.connect(process.env.MONGO_URI, {
                    serverSelectionTimeoutMS: 10000,  // Increased timeout for DNS issues
                    socketTimeoutMS: 45000,
                    family: 4,  // Force IPv4 - helps with DNS resolution issues
                    maxPoolSize: 10,
                    retryWrites: true,
                });

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
    })();

    try {
        await connectingPromise;
    } finally {
        connectingPromise = null;
    }
}
