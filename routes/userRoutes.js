const express = require('express');
const userController = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', protect, userController.getUserProfile);
router.put('/update-password', protect, userController.updatePassword);
router.get('/', protect, adminOnly, userController.getAllUsers);
router.put('/:id/role', protect, adminOnly, userController.updateUserRole);
router.get('/:id', protect, adminOnly, userController.getUserById);
router.delete('/:id', protect, adminOnly, userController.deleteUser);

module.exports = router;
