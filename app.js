require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
   // console.log('The received data from the API: ', data.body.artists.items[0]);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', {artists: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/albums/:id', (req, res) => {
    let artistId = req.params.id
    console.log(artistId)
    spotifyApi
    .getArtistAlbums(artistId, { limit: 10 })
    .then(data => {
       return data.body.items.map(a =>  a.id);
    })
    .then(albums => {
      return spotifyApi.getAlbums(albums);
    })
    .then(data => {
        //console.log('This are data', data.body.albums[0])
        res.render('albums', {artistAlbums: data.body.albums})
    })
    .catch(err => console.log('An error occurred: ', err));
  });

  app.get('/tracks/:id', (req, res) => {
    let albumId = req.params.id
    console.log(albumId)
  spotifyApi
  .getAlbumTracks(albumId, /*{ limit : 5, offset : 1 }*/)
  .then(data => {
    //console.log('These are the tracks: ', data.body.items);
    res.render('tracks', {albumTracks: data.body.items})
  })
  .catch(err => console.log('Something went wrong!', err));
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
