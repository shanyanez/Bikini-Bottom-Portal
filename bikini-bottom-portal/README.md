# Bikini Bottom Portal

Welcome to the finest user portal under the sea! A SpongeBob-themed web application with secure user authentication and profile management.

## 📚 **Class Project**
This is a fun educational project built for learning full-stack web development concepts. It demonstrates:
- **MVC Architecture** with organized code structure
- **Secure Authentication** with password hashing and sessions
- **Database Management** with SQLite and parameterized queries
- **Responsive Design** with modern CSS and animations
- **Server-side Rendering** with EJS templates

Perfect for showcasing web development skills with a playful, cartoon-themed interface!

## Features

- **SpongeBob-Themed UI**: Beautiful cartoon design with jellyfish fields pastels and pineapple house accents
- **Secure Authentication**: User registration and login with password hashing
- **Profile Management**: Edit personal information and track fun stats
- **Fun Features**: 
  - Jellyfish counter (catch jellyfish in Jellyfish Fields!)
  - Krabby Patty tracker (count delicious patties eaten!)
  - Favorite character selection
- **Responsive Design**: Works perfectly on all devices
- **Animated Background**: Floating bubbles for that underwater feel

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Template Engine**: EJS
- **Authentication**: bcryptjs, express-session
- **Styling**: Custom CSS with SpongeBob theme
- **Icons**: Font Awesome

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bikini-bottom-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Start the server**
   ```bash
   node backend/server.js
   ```

4. **Visit the application**
   Open your browser and go to `http://localhost:3000`

## 🎮 Sample Accounts

Try these pre-created accounts to explore the portal:

| Username | Password | Full Name |
|----------|----------|-----------|
| spongebob | pineapple123 | SpongeBob SquarePants |
| patrick | rock123 | Patrick Star |
| squidward | clarinet123 | Squidward Tentacles |

## 📁 Project Structure

```
bikini-bottom-portal/
├── backend/
│   ├── db.js              # Database setup and operations
│   ├── server.js           # Main Express server
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── profile.js      # Profile management routes
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── css/
│   │       └── style.css   # SpongeBob-themed styling
│   └── views/
│       ├── index.ejs       # Home page
│       ├── login.ejs       # Login page
│       ├── register.ejs    # Registration page
│       └── profile.ejs     # Profile page
├── package.json
└── README.md
```

## 🎨 Design Features

### Color Palette
- **SpongeBob Yellow**: `#ffd93d`
- **Patrick Pink**: `#ff6b9d`
- **Jellyfish Purple**: `#9b59b6`
- **Pineapple Orange**: `#f39c12`
- **Ocean Blue**: `#3498db`
- **Seafoam Green**: `#58d68d`

### Animations
- Floating bubbles background
- Bouncing hero title
- Hover effects on cards and buttons
- Interactive bubble clicks

## 🔐 Security Features

- Password hashing with bcryptjs
- Session management with express-session
- SQL injection prevention with parameterized queries
- Input validation and sanitization
- Secure cookie configuration

## 🛠️ Development

### Running in Development Mode
```bash
node backend/server.js
```

### Database
The application uses SQLite for data storage. The database file (`bikini_bottom.db`) will be created automatically when you first run the application.

### Adding New Features
1. Create routes in `backend/routes/`
2. Add database operations in `backend/db.js`
3. Create EJS templates in `frontend/views/`
4. Style with CSS in `frontend/public/css/style.css`

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `backend/server.js` (line 9)
   - Or kill the process using the port

2. **Database errors**
   - Delete `backend/bikini_bottom.db` and restart
   - Check file permissions

3. **Dependencies not found**
   - Run `npm install` in both root and backend directories
   - Clear npm cache: `npm cache clean --force`


---

**Ready to dive into Bikini Bottom? Let's go! 🐟✨**
