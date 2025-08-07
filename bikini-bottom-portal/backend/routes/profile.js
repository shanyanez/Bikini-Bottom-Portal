const express = require('express');
const db = require('../db');
const router = express.Router();

// Middleware to require authentication
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

// Profile page
router.get('/', requireAuth, async (req, res) => {
    try {
        const user = await db.getUserById(req.session.user.id);
        
        if (!user) {
            req.session.destroy();
            return res.redirect('/auth/login?error=User not found!');
        }
        
        res.render('profile', { 
            title: `${user.full_name}'s Profile`,
            user: {
                ...user,
                password: undefined // Don't send password to frontend
            },
            success: req.query.success || null,
            error: req.query.error || null
        });
        
    } catch (error) {
        console.error('Profile error:', error);
        res.redirect('/?error=Something went wrong in the Krusty Krab!');
    }
});

// Update profile
router.post('/update', requireAuth, async (req, res) => {
    try {
        const { full_name, favorite_character, jellyfish_count, krabby_patties_eaten } = req.body;
        
        const updates = {};
        
        if (full_name && full_name.trim()) {
            updates.full_name = full_name.trim();
        }
        
        if (favorite_character && favorite_character.trim()) {
            updates.favorite_character = favorite_character.trim();
        }
        
        if (jellyfish_count !== undefined && !isNaN(jellyfish_count)) {
            updates.jellyfish_count = parseInt(jellyfish_count);
        }
        
        if (krabby_patties_eaten !== undefined && !isNaN(krabby_patties_eaten)) {
            updates.krabby_patties_eaten = parseInt(krabby_patties_eaten);
        }
        
        if (Object.keys(updates).length === 0) {
            return res.redirect('/profile?error=No changes to update, me boy!');
        }
        
        await db.updateUserProfile(req.session.user.id, updates);
        
        // Update session with new data
        const updatedUser = await db.getUserById(req.session.user.id);
        req.session.user = {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            full_name: updatedUser.full_name,
            favorite_character: updatedUser.favorite_character,
            jellyfish_count: updatedUser.jellyfish_count,
            krabby_patties_eaten: updatedUser.krabby_patties_eaten
        };
        
        res.redirect('/profile?success=Profile updated successfully! You\'re the best, like no one ever was!');
        
    } catch (error) {
        console.error('Profile update error:', error);
        res.redirect('/profile?error=Something went wrong in the Krusty Krab!');
    }
});

// Add jellyfish (fun feature)
router.post('/add-jellyfish', requireAuth, async (req, res) => {
    try {
        const currentUser = await db.getUserById(req.session.user.id);
        const newCount = (currentUser.jellyfish_count || 0) + 1;
        
        await db.updateUserProfile(req.session.user.id, { jellyfish_count: newCount });
        
        // Update session
        req.session.user.jellyfish_count = newCount;
        
        res.redirect('/profile?success=You caught a jellyfish! 🐙');
        
    } catch (error) {
        console.error('Add jellyfish error:', error);
        res.redirect('/profile?error=The jellyfish got away!');
    }
});

// Eat Krabby Patty (fun feature)
router.post('/eat-patty', requireAuth, async (req, res) => {
    try {
        const currentUser = await db.getUserById(req.session.user.id);
        const newCount = (currentUser.krabby_patties_eaten || 0) + 1;
        
        await db.updateUserProfile(req.session.user.id, { krabby_patties_eaten: newCount });
        
        // Update session
        req.session.user.krabby_patties_eaten = newCount;
        
        res.redirect('/profile?success=Yummy! Another Krabby Patty! 🍔');
        
    } catch (error) {
        console.error('Eat patty error:', error);
        res.redirect('/profile?error=The Krabby Patty fell in the water!');
    }
});

module.exports = router;
