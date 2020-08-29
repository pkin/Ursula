const express = require('express');
const app = express();
const cors = require('cors');

let http = require('http').createServer(app);
const io = require('socket.io')(http);

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

app.get('/api/testFlag', (req, res) => {
    io.emit("robottikomento", "komento_valmis");
    res.send("ok"); 
});

// app.get('/api/nextCommand', (req, res) => {
//     res.send(giveNextRobotCommand());
// });

// let giveNextRobotCommand = () => {   
//     return robotin_komennot.shift();
// }

io.on('connection', (socket) => {
    
    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
    socket.on('robottikomento', (data) => {
        console.log(data);
    });
    
});


app.get('/api/onkoTallennusJoOlemassa/:id', (req, res) => {
    
    const fs = require('fs');
    const filename = './tallennukset/' + req.params.id + '.xml';

    fs.readFile(filename, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.write("ei löydy");
            res.end();
        }
        else if (data) {
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.write("löytyy");
            res.end();
        } 
        // else {
        //     res.writeHead(200, {'Content-Type': 'text/xml'});
        //     res.write("ei löydy");
        //     res.end();
        // }
    }); 

})

app.post('/api/saveXML3/:id', (req, res, next) => {

    const fs = require('fs');
    const filename = './tallennukset/' + req.params.id + '.xml';
    
    fs.writeFile(filename, req.body.xml, function (err) {
        if (err) throw err;
            console.log('Saved!');
    });

    return res.status(200).json( req.body )
})



app.get('/api/XMLstorage', (req, res) => {
    
    const fs = require('fs');
    const filename = 'temp_xml_tallennus.txt'
    res.writeHead(200, {'Content-Type': 'text/xml'});
    // res.write('<html>\n<body>\n');
    res.write("dickbutt");
    // res.write('</body>\n</html>');
    res.end();
    // console.log(req)
    // fs.readFile(filename, (err, data) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     res.writeHead(200, {'Content-Type': 'text/xml'});
    //     // res.write('<html>\n<body>\n');
    //     res.write(data);
    //     // res.write('</body>\n</html>');
    //     res.end();
    //}); 

});



const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});