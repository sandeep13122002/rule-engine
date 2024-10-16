import mongoose from "mongoose";

// Update with your MongoDB connection string

export async function connectToDatabase() {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
}

