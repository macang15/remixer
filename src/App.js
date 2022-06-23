import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import axios from 'axios';
import {useEffect} from 'react';

const initialFormData = Object.freeze({
  name: ''
});

const initialShownData = Object.freeze({
  real_name: '',
  preview_url: ''
});

function App() {
  useEffect(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tokenType = urlParams.get('token_type');
    const accessToken = urlParams.get('access_token')
    updateFormData({
      ...formData,
      'token_type': tokenType,
      'access_token': accessToken,
    });
  }, [])
 
  const [formData, updateFormData] = useState(initialFormData);
  const [shownData, updateShownData] = useState(initialFormData);
  const handleChange= (e) =>{
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });

  }; 
  const handleSearch= (e)=>{
    e.preventDefault();
    console.log(formData);
    const params =new URLSearchParams(formData);
    axios.get(`/api/search?${params}`)
    .then((res)=>{
      console.log(res.data)
      updateShownData({
        ...shownData,
        'preview_url': res.data.preview_url,
        'real_name': res.data.real_name,
        'artist': res.data.artist,
        'image_url': res.data.image_url,
      })
      console.log(shownData)
      
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a href='/api/login'>LOgin</a>

        <input type='text' name='name' onChange={handleChange}/>
        <button onClick={handleSearch}>SEARCH</button>
        <audio controls src = {shownData.preview_url}></audio>
        <div>
          <p>Found name: {shownData.real_name} </p>
          <p>artist: {shownData.artist} </p>
        </div>
        <img src ={shownData.image_url}></img>
      </header>
    </div>
  );
}

export default App;
