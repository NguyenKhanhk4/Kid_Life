const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://ngothanhbinh29072000_db_user:H5Nva1g2RfMGhtCD@cluster0.voxxggf.mongodb.net/', { dbName: 'kidlife' }).then(async () => {
  const hash = await bcrypt.hash('123456', 10);
  const result = await mongoose.connection.collection('users').updateOne(
    { email: 'vudinhviet2004@gmail.com' },
    { $set: { passwordHash: hash } }
  );
  console.log('Update result:', result);
  console.log('Password reset to 123456 in kidlife DB');
  process.exit(0);
}).catch(console.error);
