// Gerekli paketleri import et
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

// Express uygulamasını başlat
const app = express();
const PORT = process.env.PORT || 3000;

// Gelen JSON verilerini okuyabilmek için
app.use(express.json());
// Roblox'tan gelen isteklere izin vermek için
app.use(cors());

// Ortam değişkeninden (Environment Variable) API anahtarını al
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Ana sayfa için basit bir mesaj
app.get('/', (req, res) => {
  res.send('Roblox AI Proxy Sunucusu Çalışıyor!');
});

// Roblox'tan sohbet isteklerini alacağımız endpoint
app.post('/chat', async (req, res) => {
  try {
    // Roblox'tan gelen 'prompt'u al
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt (mesaj) bulunamadı.' });
    }

    // Gemini'ye isteği gönder
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    // Cevabı Roblox'a geri gönder
    res.json({ response: text });
    
  } catch (error) {
    console.error('API isteğinde hata:', error);
    res.status(500).json({ error: 'Yapay zeka ile iletişim kurulamadı.' });
  }
});

// Sunucuyu dinlemeye başla
app.listen(PORT, () => {
  console.log(`Uygulamanız ${PORT} portunda dinleniyor`);
});
