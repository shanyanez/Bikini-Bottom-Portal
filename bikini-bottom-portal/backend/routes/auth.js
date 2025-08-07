const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Middleware to check if user is already authenticated
const requireGuest = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    next();
};

// Middleware to require authentication
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

// Login page
router.get('/login', requireGuest, (req, res) => {
    res.render('login', { 
        title: 'Welcome to Bikini Bottom',
        error: req.query.error || null,
        success: req.query.success || null
    });
});

// Login POST
router.post('/login', requireGuest, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.redirect('/auth/login?error=Please fill in all fields, me boy!');
        }
        
        const user = await db.findUserByUsername(username);
        
        if (!user) {
            return res.redirect('/auth/login?error=No user found with that username, barnacle head!');
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.redirect('/auth/login?error=Wrong password! Are you sure you\'re not Patrick?');
        }
        
        // Store user in session (without password)
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            favorite_character: user.favorite_character,
            jellyfish_count: user.jellyfish_count,
            krabby_patties_eaten: user.krabby_patties_eaten
        };
        
        res.redirect('/profile?success=Welcome back to Bikini Bottom!');
        
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/auth/login?error=Something went wrong in the Krusty Krab!');
    }
});

// Register page
router.get('/register', requireGuest, (req, res) => {
    res.render('register', { 
        title: 'Join Bikini Bottom',
        error: req.query.error || null
    });
});

// Register POST
router.post('/register', requireGuest, async (req, res) => {
    try {
        const { username, email, password, confirmPassword, full_name, favorite_character } = req.body;
        
        // Validation
        if (!username || !email || !password || !confirmPassword || !full_name) {
            return res.redirect('/auth/register?error=Please fill in all required fields, me boy!');
        }
        
        if (password !== confirmPassword) {
            return res.redirect('/auth/register?error=Passwords don\'t match! Are you sure you\'re not Patrick?');
        }
        
        if (password.length < 6) {
            return res.redirect('/auth/register?error=Password must be at least 6 characters long!');
        }
        
        // Check if username already exists
        const existingUser = await db.findUserByUsername(username);
        if (existingUser) {
            return res.redirect('/auth/register?error=Username already exists! Try another one, barnacle head!');
        }
        
        // Check if email already exists
        const existingEmail = await db.findUserByEmail(email);
        if (existingEmail) {
            return res.redirect('/auth/register?error=Email already registered!');
        }
        
        // Create new user
        const userData = {
            username,
            email,
            password,
            full_name,
            favorite_character: favorite_character || 'SpongeBob'
        };
        
        await db.createUser(userData);
        
        res.redirect('/auth/login?success=Registration successful! Welcome to Bikini Bottom!');
        
    } catch (error) {
        console.error('Registration error:', error);
        res.redirect('/auth/register?error=Something went wrong in the Krusty Krab!');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/?success=See you later, alligator!');
    });
});

module.exports = router;
