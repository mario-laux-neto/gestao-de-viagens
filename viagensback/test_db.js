const { Usuario } = require('./src/models');

async function test() {
  try {
    console.log('Finding a user in database...');
    const user = await Usuario.findOne();
    console.log('SUCCESS! Found user:', user ? user.toJSON() : 'No users found');
  } catch (err) {
    console.error('ERROR connecting/querying database:', err);
  }
}

test();
