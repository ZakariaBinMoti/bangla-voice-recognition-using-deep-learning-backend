const express = require('express');
const cors = require('cors');
const speech = require('@google-cloud/speech');
const fs = require('fs');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
process.env.GOOGLE_APPLICATION_CREDENTIALS='banglavoice.json';

// middleware
app.use(cors({
    origin: [
        'http://localhost:5174'
    ]
}));
app.use(express.json());

app.get('/v2t/:name', (req, res) => {

    const filename = req.params.name;
    console.log(filename);

    async function transcribeAudio(audiofile){
        try {
            const speechClient = new speech.SpeechClient();
    
            const file = fs.readFileSync(audiofile);
            const audioBytes = file.toString('base64');
    
            const audio = {
                content: audioBytes
            };
    
            const config = {
                encoding: 'LINEAR16',
                sampleRateHertz: 44100,
                languageCode: 'bn-BD'
            }
            return new Promise((resolve, reject)=>{
                speechClient.recognize({audio,config})
                .then(data => {
                    resolve(data);
                })
                .catch(error =>{
                    reject(error);
                })
            })
    
        } catch (error) {
            console.error('ERROR:',error)
        }
    }
    
    (async()=>{
        const data = await transcribeAudio(filename+'.wav');
        // console.log(data[0].results[0].alternatives[0].transcript);
        console.log(data[0].results.map(result=>result.alternatives[0].transcript).join('\n'));
        res.send(data[0].results.map(result=>result.alternatives[0].transcript).join('\n'));
    })()
})

app.get('/', (req, res) => {
    res.send('Bangla voice to text server for our capstone project is running');
})

app.listen(port, () => {
    console.log(`Bangla voice to text server for our capstone project is running on port ${port}`);
})
