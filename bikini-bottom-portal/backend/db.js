const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'bikini_bottom.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with tables
const init = async () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                full_name TEXT,
                favorite_character TEXT DEFAULT 'SpongeBob',
                jellyfish_count INTEGER DEFAULT 0,
                krabby_patties_eaten INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('❌ Error creating users table:', err);
                    reject(err);
                    return;
                }
                console.log('✅ Users table created successfully!');
                
                // Insert some sample users if table is empty
                db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
                    if (err) {
                        console.error('❌ Error checking users count:', err);
                        reject(err);
                        return;
                    }
                    
                    if (row.count === 0) {
                        // Create sample users
                        const sampleUsers = [
                            {
                                username: 'spongebob',
                                email: 'spongebob@bikinibottom.com',
                                password: 'pineapple123',
                                full_name: 'SpongeBob SquarePants',
                                favorite_character: 'Patrick',
                                jellyfish_count: 42,
                                krabby_patties_eaten: 1000
                            },
                            {
                                username: 'patrick',
                                email: 'patrick@bikinibottom.com',
                                password: 'rock123',
                                full_name: 'Patrick Star',
                                favorite_character: 'SpongeBob',
                                jellyfish_count: 15,
                                krabby_patties_eaten: 500
                            },
                            {
                                username: 'squidward',
                                email: 'squidward@bikinibottom.com',
                                password: 'clarinet123',
                                full_name: 'Squidward Tentacles',
                                favorite_character: 'Himself',
                                jellyfish_count: 0,
                                krabby_patties_eaten: 5
                            }
                        ];
                        
                        // Insert users one by one to avoid statement finalization issues
                        let insertedCount = 0;
                        const totalUsers = sampleUsers.length;
                        
                        sampleUsers.forEach((user, index) => {
                            bcrypt.hash(user.password, 10, (err, hash) => {
                                if (err) {
                                    console.error('❌ Error hashing password:', err);
                                    return;
                                }
                                
                                db.run(`
                                    INSERT INTO users (username, email, password, full_name, favorite_character, jellyfish_count, krabby_patties_eaten)
                                    VALUES (?, ?, ?, ?, ?, ?, ?)
                                `, [
                                    user.username,
                                    user.email,
                                    hash,
                                    user.full_name,
                                    user.favorite_character,
                                    user.jellyfish_count,
                                    user.krabby_patties_eaten
                                ], function(err) {
                                    if (err) {
                                        console.error('❌ Error inserting user:', err);
                                    } else {
                                        insertedCount++;
                                        if (insertedCount === totalUsers) {
                                            console.log('✅ Sample users created successfully!');
                                            resolve();
                                        }
                                    }
                                });
                            });
                        });
                    } else {
                        console.log('✅ Database already has users!');
                        resolve();
                    }
                });
            });
        });
    });
};

// User operations
const createUser = (userData) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(userData.password, 10, (err, hash) => {
            if (err) {
                reject(err);
                return;
            }
            
            db.run(`
                INSERT INTO users (username, email, password, full_name, favorite_character)
                VALUES (?, ?, ?, ?, ?)
            `, [userData.username, userData.email, hash, userData.full_name, userData.favorite_character || 'SpongeBob'], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...userData });
                }
            });
        });
    });
};

const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const updateUserProfile = (userId, updates) => {
    return new Promise((resolve, reject) => {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(userId);
        
        db.run(`
            UPDATE users 
            SET ${fields}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `, values, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
};

const getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

module.exports = {
    init,
    createUser,
    findUserByUsername,
    findUserByEmail,
    updateUserProfile,
    getUserById
};
