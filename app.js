const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

// Public routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'register.html'));
});


app.get('/teacher-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'teacher-dashboard.html'));
});

app.get('/student-homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'student-homepage.html'));
});

app.get('/create-case', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'create-case.html'));
});

app.get('/game-playing', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'game-playing.html'));
});

app.get('/unauthorised', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'unauthorised.html'));
});

app.listen(3001, () => {
  console.log('Frontend server running on port 3001');
});