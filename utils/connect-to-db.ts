import mongoose from 'mongoose';

export async function connectToDB() {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGODB_URI!).then(() => {
        console.log('Connected to MongoDB');
    }).catch((error: any) => {
        console.error('Error connecting to MongoDB:', error);
    });
}
