const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ngothanhbinh29072000_db_user:H5Nva1g2RfMGhtCD@cluster0.voxxggf.mongodb.net/', { dbName: 'kidlife' }).then(async () => {
  await mongoose.connection.collection('users').updateOne(
    { email: 'vudinhviet2004@gmail.com' },
    { $set: { role: 'parent' } }
  );
  console.log('Role reset to parent in kidlife DB');
  process.exit(0);
}).catch(console.error);
