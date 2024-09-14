<div align="center">


  <h1>Spotify Genius</h1>
  
  <p>
    Spotify Genius는 Spotify API와 Web Playback SDK를 사용하여 사용자에게 음악을 검색하고 재생할 수 있는 기능을 제공하는 웹 애플리케이션입니다. 이 앱은 또한 가사를 검색하고 번역할 수 있는 기능을 제공합니다.
  </p>
  <a href="https://github.com/Hyun198/spotify_final">SpotifyGenius fullstack Update version</a>
<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="react" />
  <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="bootstrap" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="node" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="expressjs" />
</p>
   
</div>

<br />

<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
  - [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Installation](#gear-installation)
  - [Run Locally](#running-run-locally)
- [Usage](#eyes-usage)
- [Acknowledgements](#gem-acknowledgements)

<!-- About the Project -->

## :star2: About the Project

<div align="center"> 
  <img src="./assets/image.png" alt="screenshot" />
</div>

<!-- TechStack -->

### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li>React : 사용자 인터페이스 구축</li>
    <li>Axios : HTTP 요청 처리</li>
    <li>Spotify API : 음악 데이터 및 재생 제어</li>
    <li>Spotify Web Playback SDK : Spotify 트랙 재생</li>
    <li>Genius API : 가사 불러오기</li>
    <li>DeepL API : 가사 번역하는데 사용</li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li>Node, Express.js: 여러 api통신 처리 및 클라이언트 요청 응답</li>
  </ul>
</details>

<!-- Features -->

### :dart: Features

- Spotify에 로그인하여 사용자 인증
- 아티스트와 트랙 검색
- 선택한 트랙 또는 플레이리스트에 있는 트랙 재생 및 제어 (재생, 일시 정지, 다음 트랙, 이전 트랙)
- 현재 재생 중인 트랙의 가사 표시 및 번역

<!-- Env Variables -->

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- Clinet <br>
  `REACT_APP_CLIENT_ID`
- Server <br>
  `PORT`
  `CLIENT_ID`
  `CLIENT_SECRET`
  `GENIUS_API_KEY`
  `DEEPL_API_KEY`

<!-- Installation -->

### :gear: Installation

Install my-project with npm

```bash
  yarn install my-project
  cd my-project
```

<!-- Run Locally -->

### :running: Run Locally

Clone the project

```bash
  git clone https://github.com/Hyun198/spotify_final.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies client and start

```bash
  cd client
  npm install
  npm start
```

Install dependencies server and start

```bash
  cd server
  npm install
  npm start
```

<!-- Usage -->

## :eyes: Usage

#### Spotify API 토큰 받아오기

    const getAccessToken = async () => {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      form: {
        grant_type: "client_credentials",
      },
      json: true,
    };

    try {
      const response = await axios.post(authOptions.url, authOptions.form, {
        headers: authOptions.headers,
      });
      return response.data.access_token;
    } catch (error) {
      console.error("Error fetching access token: ", error);
    }
    };

#### Genius API

    try {
          const { name, artist } = req.body;
          const apiKey = process.env.GENIUS_API_KEY;
          const options = {
              apiKey: apiKey,
              title: name,
              artist: artist,
              optimizeQuery: true,
          };
          const lyrics = await getLyrics(options)
          res.json({ lyrics: lyrics });

      } catch (error) {
          console.error('error selected track:', error.message);
          res.status(500).json({ error: 'failed to select track' });
      }

#### DeepL api

    try {
        const { lyrics, targetLang } = req.body;

        const apiKey = process.env.DEEPL_API_KEY;
        const translator = new deepl.Translator(apiKey);
        const result = await translator.translateText(lyrics, null, targetLang);
        res.json(result);
    } catch (error) {
        console.error("Error translating lyrics:", error.message);
        res.status(500).json({ error: "Failed to translate lyrics" });
    }

<!-- Acknowledgments -->

## :gem: Acknowledgements

- [Spotify Api](https://developer.spotify.com/documentation/web-api) : Spotify Api 공식 문서
- [DeepL Api ](https://www.deepl.com/ko/pro-api/nl/pl/pro-api?utm_term=&utm_campaign=KO%7CPMAX%7CC%7CKorean&utm_source=google&utm_medium=paid&hsa_acc=1083354268&hsa_cam=20765813469&hsa_grp=&hsa_ad=&hsa_src=x&hsa_tgt=&hsa_kw=&hsa_mt=&hsa_net=adwords&hsa_ver=3&gad_source=1&gclid=CjwKCAjwreW2BhBhEiwAavLwfOwX4xfY-YatISqrWkm_hmOT_roV7hoNVLCdIVQ5Z_Ck2X7YPpsEgxoCNy4QAvD_BwE) : DeepL Api 공식문서
- [Genius Api](https://genius.com/developers) : Genius Api 공식 문서
