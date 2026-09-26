const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://ngothanhbinh29072000_db_user:H5Nva1g2RfMGhtCD@cluster0.voxxggf.mongodb.net/', { dbName: 'kidlife' }).then(async () => {
  const hash = await bcrypt.hash('123456', 10);
  await mongoose.connection.collection('users').updateOne(
    { email: 'admin@kidlife.vn' },
    { $set: { passwordHash: hash, fullName: 'System Admin', role: 'admin', status: 'active', createdAt: new Date(), updatedAt: new Date() } },
    { upsert: true }
  );
  console.log('Admin account ready');
  process.exit(0);
}).catch(console.error);
