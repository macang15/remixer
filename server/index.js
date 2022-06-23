const express = require('express');
require('dotenv').config();
const querystring = require('querystring');
const axios = require('axios');
const url = require('url');
const https = require('https')
const fs = require('fs');
const { resolveNs } = require('dns');
const app = express();
const port = 8888;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/json', (req, res) => {
  const data = {
    name: 'hongsun',
    isPerson: true

  };
  res.json(data)
});

app.get('/api/login', (req, res) => {
  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`)
});

app.get('/api/callback', (req, res)=>{
    const code = req.query.code || null;
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    })
    .then(response => {
        if (response.status === 200) {
            const { access_token, token_type} = response.data;
            const queryParams = querystring.stringify({
              access_token,
              token_type
            });
            res.redirect(`http://localhost:3000/?${queryParams}`)
        }
    })
    .catch(error => {
        res.send(error);
    });

});

app.get('/api/search', (req, res)=>{
  const name=req.query.name;

  const token_type = req.query.token_type;
  const access_token = req.query.access_token;
  let payload = {
    q: name,
    type: 'track',
    market: 'ES',
    limit: '1',
    offset: '0',
  }
  const params =new url.URLSearchParams(payload)
  axios.get(`https://api.spotify.com/v1/search?${params}`,{
    headers: {
      Authorization: `${token_type} ${access_token}`
    }
  })
  .then(response=>{
    const track =response.data.tracks.items[0]; 
    const id= track.id;
    const real_name = track.name;
    const preview_url = track.preview_url;
    const artist = track.artists[0].name;
    const image_url = track.album.images[0].url;
    https.get(preview_url, resp => {
      resp.pipe(fs.createWriteStream('./test.mp3'))
    });
    

    axios.get(`https://api.spotify.com/v1/audio-features/${id}`, {
      headers: {
        Authorization: `${token_type} ${access_token}`
      }
    })
    .then(response=> {
      response.data  = {
        'real_name': real_name,
        'preview_url': preview_url,
        'artist': artist,
        'image_url': image_url,
        ...response.data
      }
      res.send(`${JSON.stringify(response.data, null, 2)}`);
    })
    .catch(error=>{
      res.send(error)
    });
  })
  .catch(error => {
    res.send(error);
  })
});


app.listen(port, () => {
console.log(REDIRECT_URI)
  console.log(`Express app listening at http://localhost:${port}`);
})