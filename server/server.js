require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');
const app = express();

const getLyrics = require('./lib/getLyrics');
const getSong = require('./lib/getSong');
const deepl = require('deepl-node')

const PORT = process.env.PORT || 5000;


app.use(express.json())
app.use(bodyParser.json())

//Spotify api 설정
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/api/token"
const RESPONSE_TYPE = "token"

const getAccessToken = async () => {
    try {
        const data = qs.stringify({
            'grant_type': 'client_credentials',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        });
        const response = await axios.post(AUTH_ENDPOINT, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting access token:", error.message);
        throw new Error("Failed to get access token");
    }
}



app.post('/api/search', async (req, res) => {
    try {
        const { searchTerm } = req.body;
        const token = await getAccessToken();

        const response = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchTerm,
                type: "artist,album,track",
                market: "KR",
                limit: 10
            }
        });
        const searchResults = {
            artists: response.data.artists.items,
            /* albums: response.data.albums.items,
            tracks: response.data.tracks.items, */

        }
        console.log(searchResults);

        const TopArtistId = response.data.artists.items[0].id;
        const TopArtistsTracks = await axios.get(`https://api.spotify.com/v1/artists/${TopArtistId}/top-tracks`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        const TopArtistData = {
            artist: response.data.artists.items[0], // 최상위 아티스트 정보
            tracks: TopArtistsTracks.data.tracks // 해당 아티스트의 트랙 데이터
        };
        res.json(TopArtistData);

    } catch (error) {
        console.error("Error searching artists:", error.message);
        res.status(500).json({ error: "Failed to search artists" });
    }
});

let translatedLyrics = '';
//track정보 받아오기
app.post('/api/track/select', async (req, res) => {
    try {
        const { name, artist } = req.body;
        console.log(name, artist);
        const apiKey = process.env.GENIUS_API_KEY;
        const options = {
            apiKey: apiKey,
            title: name,
            artist: artist,
            optimizeQuery: true,
        };
        const lyrics = await getLyrics(options)
        console.log("가사 불러오기 성공")
        res.json({ lyrics: lyrics });

    } catch (error) {
        console.error('error selected track:', error.message);
        res.status(500).json({ error: 'failed to select track' });
    }
})

app.post('/api/translate', async (req, res) => {
    try {
        const { lyrics, targetLang } = req.body;
        console.log(lyrics, targetLang);
        const apiKey = process.env.DEEPL_API_KEY;
        const translator = new deepl.Translator(apiKey);
        const result = await translator.translateText(lyrics, null, targetLang);
        res.json(result);
    } catch (error) {
        console.error("Error translating lyrics:", error.message);
        res.status(500).json({ error: "Failed to translate lyrics" });
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});