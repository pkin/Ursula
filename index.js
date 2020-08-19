const express = require('express');
const app = express();
const cors = require('cors');

let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

let robotin_komennot = [];

app.post('/api/postRobotCommands', (req, res) => {
    robotin_komennot = req.body.komennot.split(",");
    console.log("---");
    console.log(robotin_komennot);
    res.send(req.body);
});

app.get('/api/showRobotCommands', (req, res) => {
    res.send(robotin_komennot);
});

app.get('/api/nextCommand', (req, res) => {
    res.send(giveNextRobotCommand());
});

let giveNextRobotCommand = () => {

    return robotin_komennot.shift();
}

io.on('connection', (socket) => {

    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});