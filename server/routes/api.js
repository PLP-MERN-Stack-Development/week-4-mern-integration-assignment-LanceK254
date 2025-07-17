// server/routes/api.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API route is working' });
});

export default router;