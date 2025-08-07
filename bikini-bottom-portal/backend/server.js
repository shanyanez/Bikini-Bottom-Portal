const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Session configuration
app.use(session({
    secret: 'krabby-patty-secret-recipe',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Global middleware to check if user is authenticated
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// Home route with SpongeBob welcome
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Welcome to Bikini Bottom Portal',
        user: req.session.user 
    });
});

// Initialize database and start server
db.init().then(() => {
    app.listen(PORT, () => {
        console.log(`🌊 Welcome to Bikini Bottom Portal! Server running on port ${PORT}`);
        console.log(`🏠 Visit: http://localhost:${PORT}`);
        console.log(`🐟 Ready to serve the finest Krabby Patties!`);
    });
}).catch(err => {
    console.error('❌ Database initialization failed:', err);
});
