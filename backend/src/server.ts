import { createApp } from './app';
import { env } from './config/env';
import { connectMongo, disconnectMongo } from './database/mongo';

async function main() {
  await connectMongo(env.mongoUri);
  const server = createApp().listen(env.port, () => {
    console.log(`KidLife API chạy tại http://localhost:${env.port} (MongoDB: ${env.mongoUri})`);
  });

  const shutdown = () => {
    server.close(() => {
      disconnectMongo().finally(() => process.exit(0));
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Không khởi động được server:', err);
  process.exit(1);
});
