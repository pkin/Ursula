const express = require('express');
const app = express();
const cors = require('cors');

let http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));


app.get('/api/testDone', (req, res) => {
    io.emit("done");
    res.send("ok, done");
});


// testi counter
let counter = 1;

io.on('connection', (socket) => {
    
    console.log('a user connected (socket.io)');
    
    socket.on('disconnect', () => {
        console.log('user disconnected (socket.io)');
    });

    socket.on('finished', data => { console.log("received: 'finished' ", data ? data : ''); });

    socket.on('relative_move', data => { console.log("received: 'relative_move',", data); });

    // socket.on('turn', data => { console.log("received: 'turn',", data); });
    
    socket.on('pick_up_color_ball', data => { console.log("received: 'pick_up_color_ball',", data); });

    socket.on('tts', data => { console.log("received: 'tts',", data); });

    socket.on('face', data => { console.log("received: 'face',", data); });

    socket.on('emote', data => { console.log("received: 'emote',", data); });
    
    socket.on('open_hand', data => { console.log("received: 'open_hand',", data); });

    socket.on('close_hand', data => { console.log("received: 'close_hand',", data); });
    
    socket.on('pick_up_40mm_ball', data => { console.log("received: 'pick_up_40mm_ball',", data); });
    
    socket.on('drop_off_40mm_ball', data => { console.log("received: 'drop_off_40mm_ball',", data); });
    
    socket.on('wait', data => {
        console.log("received: 'wait',", data);
        const duration = parseInt(data.duration);
        if (!isNaN(duration)) {
            setTimeout( () => { socket.emit('done') }, duration); 
        }
    });
    
    
    socket.on('tarkista_nimi', (nimi, callback) => {        
        callback(null, onkoNimiTallennetuissa(nimi));
    });
    
    // kokeilua...
    socket.on('getCounter', (nimi, callback) => {
        console.log(`Returning getCounter with counter ${counter} and the nimi is ${nimi}`);
        // Use a Node style callback (error, value)
        // callback(null, ++counter + " " + nimi);
        callback(null, onkoNimiTallennetuissa(nimi));
    });
    
    // socket.on('ask_for_done', () => {
    //     console.log("received: 'ask_for_done' (testing), emitting 'done'...");
    //     socket.emit('done');
    // });

});

const onkoNimiTallennetuissa = nimi => {
    
    const fs = require('fs');
    const hakemisto = './tallennukset/';
    
    const olemassa = fs.readdirSync(hakemisto).some( (element, index) => {
        let data = fs.readFileSync(hakemisto + "/" + element);
        if (nimi === JSON.parse(data)[0])
        return true;
        else
        return false;
    });
    
    return olemassa;
    
    // Tämä toimii myös:
    // let olemassa = false;
    // for (let file of fs.readdirSync(hakemisto)) {
        //     let data = fs.readFileSync(hakemisto + file);
        //     console.log(nimi, JSON.parse(data)[0], nimi === JSON.parse(data)[0] );
        //     if (nimi === JSON.parse(data)[0]) {
            //         olemassa = true;
            //         break;
            //     };
            // };
    
        }
        
        
        app.get('/api/onkoTallennusJoOlemassa/:id', (req, res) => {
            
            const fs = require('fs');
            const filename = './tallennukset/' + req.params.id + '.xml';
            
            fs.readFile(filename, (err, data) => {
                if (err) {
                    // console.log(err);
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
    const filename = './tallennukset/' + req.params.id + '.json';

    let tallennusString = [req.body.nimi, req.body.xml];
    
    
    // tallennusString.push(req.body.nimi);
    // tallennusString.push(req.body.xml);
    tallennusString = JSON.stringify(tallennusString);
    console.log("---" , tallennusString);
    

    fs.writeFile(filename, tallennusString, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    
    return res.status(200).json( req.body )
})



app.get('/api/tarkista/:id', (req, res) => {
    
    
    // const fs = require('fs');
    // const filename = 'temp_xml_tallennus.txt'
    res.writeHead(200, {'Content-Type': 'text/xml'});  // xml, not html
    res.write("true");
    res.end();
    
});

app.get('/api/ohjelmat', (req, res) => {

    const fs = require('fs');
    const hakemisto = './tallennukset/';
    const ohjelmat = [];
    
    fs.readdirSync(hakemisto).forEach(file => {
        let tiedostonimi = file.replace(".xml", "");
        let muokkausaika = fs.statSync(hakemisto + "/" + file).mtime;
        ohjelmat.push( {nimi: tiedostonimi, muokattu: muokkausaika } );
        // console.log(ohjelmat);
    });
    
    return res.status(200).json(ohjelmat);
})

// let robotin_komennot = [];

// app.post('/api/postRobotCommands', (req, res) => {
//     robotin_komennot = req.body.komennot.split(",");
//     console.log("---");
//     console.log(robotin_komennot);
//     res.send(req.body);
// });

// app.get('/api/nextCommand', (req, res) => {
//     res.send(giveNextRobotCommand());
// });

// let giveNextRobotCommand = () => {
//     return robotin_komennot.shift();
// }


const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});