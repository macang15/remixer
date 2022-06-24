import logo from './vinyl.png';
import searchlogo from './search.png';
import './App.css';
import React, {useState} from 'react';
import axios from 'axios';
import {useEffect} from 'react';
import styles from './App.module.css';


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
        <h1 className = {styles.title}>
          MUSIC REMIXER
        </h1>
        <body className={styles.box}>
          <a  className = {styles.login} href='/api/login'>Login</a>
        </body>
        
        <a> 
         &nbsp;
        </a>
        
        <body className={styles.searchbox}>
          <input 
          placeholder = "please enter your favorite song"
          style={ {border:"none",outline:"none",width: "850px",
          height: "50px",color: "white",backgroundColor: "transparent", fontSize: 30, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"}}
          type='text' name='name' onChange={handleChange}/>
          <a> 
          &nbsp;
          </a>
          
          <button className={styles.search} onClick={handleSearch}><img src={searchlogo} width="30px" height="30px"/></button>
        </body>
        <a> 
          &nbsp;
          </a>
          
        <body className={styles.box2}>
          <p className = {styles.title2}>Is this what you are looking for?</p>
          <audio controls src = {shownData.preview_url}></audio>
          <div>
            <p>Found name: {shownData.real_name} </p>
            <p>artist: {shownData.artist} </p>
        </div>
        <img src ={shownData.image_url}></img>
        </body>
      </header>
    </div>
  );
}

export default App;
