const userRoutes = require('../routes/User');
const profileRoutes = require('../routes/Profile');
const paymentRoutes = require('../routes/Payments');
const courseRoutes = require('../routes/Course');
const contactRoutes = require('../routes/ContactUs');

function initRoutes(app) {
    app.use('/api/v1/auth', userRoutes);
    app.use('/api/v1/profile', profileRoutes);
    app.use('/api/v1/payment', paymentRoutes);
    app.use('/api/v1/course', courseRoutes);
    app.use('/api/v1/contact', contactRoutes);

    // Default health-check route
    app.get('/', (req, res) => {
        return res.json({
            success: true,
            message: 'Server is Up and Running.....',
        });
    });
}

module.exports = initRoutes;
