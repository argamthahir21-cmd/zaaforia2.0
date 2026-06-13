import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';


async function testConnections() {
  console.log('Testing MongoDB...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }

  console.log('\nTesting Cloudinary...');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully:', result);
  } catch (err) {
    console.error('❌ Cloudinary connection failed:', err.message || err);
  }
}

testConnections();
