import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import 'boxicons'
import './App.css';

function App() {
  const [searchKey, setSearchKey] = useState("");
  const [topArtist, setTopArtist] = useState(null);
  const [topArtistTracks, setTopArtistTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [lyrics, setLyrics] = useState(''); //원본 가사
  const [translatedLyrics, setTranslatedLyrics] = useState(''); //번역된 가사
  const [targetLang, setTargetLang] = useState('KO');
  const [isTranslated, setIsTranslated] = useState(false) //번역되어있는지 flag


  const searchArtists = async (e) => {
    e.preventDefault();
    const searchTerm = searchKey.trim();

    if (!searchTerm) {
      alert("검색어를 입력하세요.");
      return;
    }
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          searchTerm: searchTerm
        })
      })
      if (!response.ok) {
        throw new Error("Failed to search artists");
      }
      const data = await response.json();
      console.log(data);
      console.log(data.artist.images);
      setTopArtist(data.artist)
      setTopArtistTracks(data.tracks)


    } catch (error) {
      console.error(error.message);
    }
  };

  const handleTrackSelect = async (track) => {
    try {
      console.log(track);
      setSelectedTrack(track.name);
      const response = await fetch('/api/track/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(track)
      });
      if (!response.ok) {
        throw new Error("Failed to send track");
      }

      const data = await response.json();
      const Lyrics = data.lyrics;
      setLyrics(Lyrics);
      setTranslatedLyrics('');
      setIsTranslated(isTranslated) //false

    } catch (error) {
      console.error(error.message);
    }
  }

  const handleTranslate = async () => {
    try {
      const response = await axios.post('/api/translate', { lyrics, targetLang });
      setTranslatedLyrics(response.data.text);
      setIsTranslated(!isTranslated); //true
      console.log('번역완료');

    } catch (error) {
      console.error('Error translating lyrics:', error.message);
    }
  }

  const toggleTranslation = () => {
    handleTranslate();
    setIsTranslated(!isTranslated)
  }


  return (
    <div className="App">
      <h1 className='title'>Spotify Clone</h1>
      <header className="header_container">
        <form className="search_box" onSubmit={searchArtists} >
          <box-icon name='search-alt'></box-icon>
          <input className="search-input" type="text" placeholder='아티스트,앨범,노래' onChange={e => setSearchKey(e.target.value)} />
          <button className="search-btn" type={"submit"}>Search</button>
        </form>
      </header>
      <main className="main_container">
        {topArtist && (
          <div className="top-artist">
            <img className="topArtist_imgs" src={topArtist.images[0].url} alt={topArtist.name} />
            <p className="top-artist-name">{topArtist.name}</p>
            <p className='followers'>팔로워 수: {topArtist.followers.total}</p>
            <div className='top-artist-info'>
              {topArtist.genres.map(genre => (
                <p key={genre} className='genre'>{genre}</p>
              ))}
            </div>
          </div>
        )}

        <div className="top-artist-tracks">
          {topArtistTracks.map((track, index) => (
            <React.Fragment key={track.id}>
              <div className="top-artist-track" onClick={() => handleTrackSelect({ name: track.name, artist: track.artists[0].name })}>
                <img className="track-image" src={track.album.images[0].url} alt={track.album.name} />
                <p className="track-name">{track.name}</p>
              </div>
              {((index + 1) % 5 === 0 && index !== topArtistTracks.length - 1) && <div className="row-divider" />}
            </React.Fragment>
          ))}
        </div>
        {/* <div className="related-artists">
          {relatedArtists.map(artist => (
            <div className="artist" key={artist.id}>
              <img className="artist-image" src={artist.images[0].url} alt={artist.name} />
              <p className="artist-name">{artist.name}</p>
            </div>
          ))}
        </div> */}
      </main>

      <div className="lyrics_container">
        <h2 className="selectedTrack-title">{selectedTrack}</h2>
        <button className="translate-btn" onClick={toggleTranslation}>
          {isTranslated ? 'back' : '번역'}
        </button>
        <pre className='lyrics'>{isTranslated ? translatedLyrics : lyrics}</pre>
      </div>
    </div>
  );
}

export default App;