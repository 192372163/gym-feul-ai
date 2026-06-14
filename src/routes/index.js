const express = require('express');
const authenticate = require('../middleware/auth');
const profileController = require('../controllers/profileController');
const planController = require('../controllers/planController');
const uploadController = require('../controllers/uploadController');
const paymentController = require('../controllers/paymentController');
const workoutLogController = require('../controllers/workoutLogController');
const mealLogController = require('../controllers/mealLogController');
const waterLogController = require('../controllers/waterLogController');
const weightLogController = require('../controllers/weightLogController');

const router = express.Router();

router.use(authenticate);

// Profile
router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.upsertProfile);

// AI plans
router.post('/plans/generate', planController.generatePlan);
router.get('/plans/latest', planController.getLatestPlan);
router.get('/plans', planController.getPlanHistory);

// Uploads
router.post('/uploads/progress-photo', uploadController.uploadProgressPhoto);

// Payments & subscriptions
router.post('/payments/order', paymentController.createOrder);
router.post('/payments/verify', paymentController.verifyPayment);
router.get('/subscription', paymentController.getSubscriptionStatus);

// Workout logs
router.post('/logs/workout', workoutLogController.logWorkout);
router.get('/logs/workout', workoutLogController.getWorkoutLogs);

// Meal logs
router.post('/logs/meal', mealLogController.logMeal);
router.get('/logs/meal', mealLogController.getMealLogs);

// Water logs
router.post('/logs/water', waterLogController.logWater);
router.get('/logs/water', waterLogController.getWaterLogs);

// Weight logs
router.post('/logs/weight', weightLogController.logWeight);
router.get('/logs/weight', weightLogController.getWeightLogs);

module.exports = router;
