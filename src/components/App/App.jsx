import { CssBaseline } from '@mui/material';
import "./App.css";
import GoogleMaps from '../SearchForm/SearchForm';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import io from 'socket.io-client';
import Blog from '../Blog/Blog';
import LandingPage from '../LandingPage/LandingPage';
import NavBar from '../NavBar/NavBar';
import { useSelector } from 'react-redux';
import AboutPage from '../AboutPage/AboutPage';
import FavBlogs from '../Blog/FavBlogs';


function App() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const blogResults = useSelector((store) => store.blogCreated);
  const showInfo = useSelector((store) => store.showInfo);
  const showFav = useSelector((store) => store.showFavorites);


  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('message', (message) => {
      console.log('Received message:', message);
    });

    socket.emit('message', 'Hello from client');

    return () => {
      socket.disconnect();
    };
  }, []);

  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: 'AIzaSyDdUciAK9zCvJIMisBaPLc2XJgnXwlKMcA',
  return (
    <div>
      <div> {isAuthenticated && <NavBar />} </div>
      <div>
        {!isAuthenticated && <LandingPage />}
      </div>
      <div>
        {showInfo && <AboutPage />}
      </div>
      <div>
        {isAuthenticated && blogResults.length < 1 && <span><GoogleMaps /></span>}
      </div>
      <div>
        {isAuthenticated && blogResults.length > 0 && <span>{showFav ? <FavBlogs /> : <Blog />}</span>}
      </div>
    </div>
  )
}


export default App;
