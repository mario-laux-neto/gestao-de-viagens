const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Travel Organization API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      destinations: '/api/destinations',
      itineraries: '/api/itineraries',
      activities: '/api/activities'
    }
  });
});

module.exports = router;
