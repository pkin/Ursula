const express = require('express');
const app = express();
const cors = require('cors');
const { get } = require('http');

let http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

app.get('/api/testDone', (req, res) => {
    io.emit("done");
    res.send("ok, done");
});

app.get('/api/ohjelmat', (req, res) => {
    let ohjelmat = {};
    try {
        ohjelmat = lataaOhjelmat();
    }
    catch (err) {
        console.log("Ongelma ohjelmien haussa!");
        return undefined;
    }
    return res.status(200).json(ohjelmat);
});

app.get('/api/ohjelmat/:id', (req, res) => {
    console.log('ladataan ohjelma', req.params.id);
    return res.status(200).json( lataaOhjelma(req.params.id) );
});

app.post('/api/nimiolemassa', (req, res) => {
    return res.status(200).json({"exists": onkoNimiTallennetuissa(req.body.name)});
});

// Tarkistetaan, onko ohjelman nimi jo tallennetuissa.
const onkoNimiTallennetuissa_old = nimi => {
    const fs = require('fs');
    const hakemisto = './tallennukset/';
    let id = 0;
    const olemassa = fs.readdirSync(hakemisto).some( (file, index) => {
        let ohjelma = fs.readFileSync(hakemisto + file);
        if (file.endsWith('.json')) {
            if (nimi === JSON.parse(ohjelma).nimi) {
                id = Number(file.replace(".json", ""));
                return true;
            }
            else
                return false;
        }
    });
    return olemassa ? { id: id } : { id: -1 };   
}

// Tarkistetaan, onko ohjelman nimi jo tallennetuissa.
const onkoNimiTallennetuissa = nimi => {
    const fs = require('fs');
    const hakemisto = './tallennukset/';
    return fs.readdirSync(hakemisto)
        .filter(file => String(file).endsWith('.json'))
        .some(file => { return nimi === JSON.parse(fs.readFileSync(hakemisto + file)).nimi });
};

const lataaOhjelma = id => {
    const fs = require('fs');
    const hakemisto = './tallennukset/';
    const tiedosto = id + '.json';
    let ohjelma = {};
    try {
        ohjelma = fs.readFileSync(hakemisto + tiedosto);
        ohjelma = JSON.parse(ohjelma);
    }
    catch (err) {
        console.log("Virhe tiedoston lukemisessa!");
        return undefined;
    }
    return ohjelma;
}

//  Lataa listan ohjelmista, ei varsinaista sisältöä
const lataaOhjelmat = () => {
    const fs = require('fs');
    const hakemisto = './tallennukset/';
    const ohjelmat = []; 
    fs.readdirSync(hakemisto).forEach(file => {
        if (file.endsWith('.json')) {
            let id = Number(file.replace(".json", ""));
            let nimi = lataaOhjelma(id).nimi;
            let muokkausaika = fs.statSync(hakemisto + file).mtime;
            ohjelmat.push( { id: id, nimi: nimi, muokattu: muokkausaika } );
        }
    });
    return ohjelmat;
}

app.get('/api/nxt', (req, res) => {
    return res.status(200).json(haeSeuraavaVapaaId());
});

const haeSeuraavaVapaaId = () => {
    const fs = require('fs');
    return 1 + 
        fs.readdirSync('./tallennukset/')
        .map(file => file.replace('.json', ''))
        .filter(file => Number(file))
        .map(file => Number(file))
        .reduce( (max , next) => { return max > next ? max : next }, 0 );
};

const tallennaOhjelma = (ohjelma, id) => {
    if (!ohjelma || !id) {
        console.log('Not saved, something missing!');
        return false;
    }
    if (!ohjelma.nimi || !ohjelma.xml) {
        console.log('Not saved, JSON not as expected!');
        return false;
    }
    if (id < 1)
        id = haeSeuraavaVapaaId();
    const fs = require('fs');
    const hakemisto = './tallennukset/';
    const filename = id + '.json';
    fs.writeFile(hakemisto + filename, JSON.stringify(ohjelma), err => {
        if (err) throw err;
        else {
            console.log('Saved', id, ohjelma.nimi, '!');
            return true;
        }
    });
};

app.post('/api/tallenna/:id', (req, res, next) => {
    const ohjelma = { nimi: req.body.nimi, xml: req.body.xml };
    tallennaOhjelma(ohjelma, req.params.id);
    return res.status(200).json(req.body);
});







// app.get('/api/onkoTallennusJoOlemassa/:id', (req, res) => {
            
//     const fs = require('fs');
//     const filename = './tallennukset/' + req.params.id + '.xml';
    
//     fs.readFile(filename, (err, data) => {
//         if (err) {
//             // console.log(err);
//             res.writeHead(200, {'Content-Type': 'text/xml'});
//             res.write("ei löydy");
//     res.end();
// }
// else if (data) {
//     res.writeHead(200, {'Content-Type': 'text/xml'});
//     res.write("löytyy");
//     res.end();
// }
// // else {
//     //     res.writeHead(200, {'Content-Type': 'text/xml'});
//     //     res.write("ei löydy");
// //     res.end();
// // }
// });

// })


app.get('/api/true/:id', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/xml'});  // xml, not html
    res.write("true");
    res.end();
    
});



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



// testi counter
let counter = 1;

io.on('connection', (socket) => {
    
    console.log('a user connected (socket.io)');
    
    socket.on('disconnect', () => {
        console.log('user disconnected (socket.io)');
    });

    socket.on('finished', data => { console.log("received: 'finished' ", data ? data : ''); });

    socket.on('relative_move', data => { console.log("received: 'relative_move',", data); });

    socket.on('pick_up_color_ball', data => { console.log("received: 'pick_up_color_ball',", data); });

    socket.on('tts', data => { console.log("received: 'tts',", data); });

    socket.on('face', data => { console.log("received: 'face',", data); });

    socket.on('emote', data => { console.log("received: 'emote',", data); });
    
    socket.on('open_hand', data => { console.log("received: 'open_hand',", data); });

    socket.on('close_hand', data => { console.log("received: 'close_hand',", data); });
    
    socket.on('pick_up_40mm_ball', data => { console.log("received: 'pick_up_40mm_ball',", data); });
    
    socket.on('drop_off_40mm_ball', data => { console.log("received: 'drop_off_40mm_ball',", data); });

    socket.on('arm_pose', data => { console.log("received: 'arm_pose',", data); });
    
    socket.on('wait', data => {
        console.log("received: 'wait',", data);
        const duration = parseInt(data.duration);
        if (!isNaN(duration)) {
            setTimeout( () => { socket.emit('done') }, duration); 
        }
    });

    // kokeilua...
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

    // socket.on('turn', data => { console.log("received: 'turn',", data); });

});


const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});