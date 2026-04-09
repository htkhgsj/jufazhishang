require('dotenv').config()
const express = require('express');
const cors = require('cors'); // 引入
const app = express();

const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ message: "Healthy" });
});

app.post('/test', (req, res) => {
  res.json({ message: "Data received successfully:"});
});

app.post('/poemSep', (req, res) => {
    const { poem } = req.body;
    //call LLM to separate poem into atoms
    const API_KEY = process.env.API_KEY;
    console.log("Received poem:", poem);
    while(true) {
        try{
            
        }
        catch(err) {
            console.error("Error occurred:", err);
        }

    
    }


});


app.listen(PORT, () => {
  console.log(`🚀 服务器运行在: http://localhost:${PORT}`);
});