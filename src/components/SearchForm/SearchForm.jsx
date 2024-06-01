import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import "../../index.css"


import CoffeeIcon from '@mui/icons-material/Coffee';
import { useAuth0 } from '@auth0/auth0-react';

// This key was created specifically for the demo in mui.com.
// You need to create a new one for your application.
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_APP_GMAP_API_KEY;


const apiKey = import.meta.env.VITE_APP_GMAP_API_KEY;
const geocodeApi = `https://maps.googleapis.com/maps/api/geocode/json`

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}


const autocompleteService = { current: null };

export default function GoogleMaps() {

  const [location, setLocation] = React.useState({});
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);
  const { getAccessTokenSilently, user } = useAuth0();
  const dispatch = useDispatch();
  const placeResults = useSelector((store) => store.searchPlace);
  const token = getAccessTokenSilently().then(token => token);

  const { email } = user;

  const socket = io('http://localhost:3000'); // replace with your server URL

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  const findPlace = (placeId) => {
    let map;
    let service;
    let infoWindow;

    infoWindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("results"), {
      center: location.geometry.location,
      zoom: 15,
    });

    const request = {
      query: "Local coffee shops",
      type: ['cafe'],
      fields: ["name", "formatted_address", "place_id", "geometry"],
    };

    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        getPlace(results[0]);
      }
    });
  }
  const getPlace = async (location) => {
    let map;
    let service;
    let infoWindow;

    infoWindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("results"), {
      center: location.geometry.location,
      zoom: 15,
    });

    const request = {
      location: location.geometry.location,
      query: "locally owned coffee shops in my area that aren't chains",
      fields: ["name", "formatted_address", "place_id", "geometry"],
      type: ['cafe'],
      radius: 500
    };

    service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, async (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        results.map((result) => {
          service.getDetails({ placeId: result.place_id }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place.place_id) {
              console.log('PHOTOS',place.photos)
              if(Array.isArray(place.photos)){
              const photos = place.photos.map((photo) => photo.getUrl());
              dispatch({
                type: 'SEARCH_PLACE',
                payload: {
                  email: email,
                  id: place.place_id,
                  name: place.name,
                  latitude: place.geometry.location.lat(),
                  longitude: place.geometry.location.lng(),
                  metadata: {
                    phone_number: place.formatted_phone_number,
                    address: place.formatted_address,
                    rating: place.rating,
                    photo: place.photos[0].getUrl(),
                    photos: photos,
                    hours: place?.opening_hours?.weekday_text,
                    business_status: place.business_status,
                    website: place.website
                  }
                }

                  });
                }}
              })
                });
            }
    });
  }



  const reverseGeocode = ({ latitude: lat, longitude: lng }) => {
    const url = `${geocodeApi}?key=${apiKey}&latlng=${lat},${lng}`;

    fetch(url ).then(response => response.json())
      .then(response => {
        console.log(response);
        const place = response.results[0];
        setLocation(place);
        setValue(place.formatted_address);
        getPlace(place);
      });
  };


  if (typeof window !== 'undefined' && !loaded.current) {
    setValue('Fetching address...');

    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      );
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        await reverseGeocode(position.coords);
      })
    }


    loaded.current = true;
  }

  // What does useMemo?
  const fetchPredictions = React.useMemo(
    () =>
      debounce( async (request, callback) => {
        await autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    [],
  );


  // Send the place results to the server
   React.useEffect( () => {


     // Send a message to the server
    socket.emit('placeSent', placeResults);

    socket.on('message', (message) => {
      console.log('Received message:', message);
    });

    socket.on('blogSent', (blog) => {
      if(blog.favorite){
        dispatch({
          type: 'FAV_BLOG_SENT',
          payload: blog
        });
        }
      console.log('Received blog:', blog);
      dispatch({
        type: 'BLOG_CREATED',
        payload: blog
      });
    });

    /*axios.post('http://localhost:3000/openai/prompt', placeResults, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log(response);
    });
  console.log('STATE', placeResults);*/
  }, [placeResults]);

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    //autocompleteService.addListener('place_changed', () => onChangeAddress(autocompleteService));

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetchPredictions({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetchPredictions]);

  return (
    <div>
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
      bgcolor="#f3cb9f">
      <Autocomplete
        id="google-map-demo"
        sx={{ width: 300 }}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.description
        }
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="No locations"
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
          findPlace(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search Local" fullWidth />

        )}
        renderOption={(props, option) => {
          const matches =
            option.structured_formatting.main_text_matched_substrings || [];

          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match) => [match.offset, match.offset + match.length]),
          );

          return (

            <li {...props}>
              <Grid container alignItems="center">
                <Grid item sx={{ display: 'flex', width: 44 }}>
                  <LocationOnIcon sx={{ color: 'text.secondary' }} />
                </Grid>
                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                  {parts.map((part, index) => (
                    <Box
                      key={index}
                      component="span"
                      sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                    >
                      {part.text}
                    </Box>
                  ))}
                  <Typography variant="body2" color="text.secondary">
                    {option.structured_formatting.secondary_text}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </Grid>
  <div id='results'>
  </div>
  </div>
  )

}


