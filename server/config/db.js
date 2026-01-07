import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || 'pg_management';
    
    if (uri && !uri.includes('?') && !uri.endsWith('/')) {
      uri = uri + dbName;
    } else if (uri && uri.endsWith('/')) {
      uri = uri + dbName;
    }
    
    const conn = await mongoose.connect(uri, {
      dbName: dbName
    });
    console.log(`MongoDB Connected: ${conn.connection.host} - Database: ${dbName}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
