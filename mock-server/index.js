const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

const users = [];

const userServices = {
    createUser: (req, res) => {
        let nameUsed = false;
        users.forEach(user => {
            if (user.username === req.body.username || user.email === req.body.email) {
                return nameUsed = true;
            };
        });
        if(nameUsed) {
            res.status(400).json({ type: 'error', message: "Username or email is already used" });
        } else {
            users.push(req.body);
            res.json({ type: "signup-success", user: { username: req.body.username, email: req.body.email }});
        }
    },
    login: (req, res) => {
        let authorized = false;
        let loggedUser = {};
        users.forEach(user => {
            if (user.username === req.body.username && user.password === req.body.password) {
                loggedUser = { username: user.username, email: user.email };
                return authorized = true;
            };
        });
        if (authorized) { 
            res.json({ type: "login-success", user: { ...loggedUser }}); 
        } else {
            res.status(400).json({ type: "error", message: "Login or password is incorrect"});
        }
    }
};

app.post("/api/login", userServices.login);
app.post("/api/register", userServices.createUser);

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});

