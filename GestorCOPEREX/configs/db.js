import mongoose from 'mongoose';

export const dbConnection = async () => {
  try {
    mongoose.connection.on('error', () => {
      console.log('MongoDB | connection error');
      mongoose.disconnect();
    });

    mongoose.connection.on('connecting', () => {
      console.log('MongoDB | connecting');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB | connected');
    });

    mongoose.connection.on('open', () => {
      console.log(`MongoDB | database ready: ${process.env.MONGO_DB_NAME || 'db'}`);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB | reconnected');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB | disconnected');
    });

    await mongoose.connect(process.env.URI_MONGO, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      dbName: process.env.MONGO_DB_NAME,
    });
  } catch (error) {
    console.log(`Database connection error: ${error}`);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`MongoDB | Received ${signal}. Closing connection...`);
  try {
    await mongoose.connection.close();
    console.log('MongoDB | connection closed');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB | graceful shutdown error:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
