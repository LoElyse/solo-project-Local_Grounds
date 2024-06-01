import * as React from 'react';
import  Card  from '@mui/material/Card';
import CardContent  from '@mui/material/CardContent';
import  CardMedia  from '@mui/material/CardMedia';
import Typography  from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useAuth0 } from '@auth0/auth0-react';
import LogOut from '../LogOut/LogOut';
import  LoginButton from '../LogIn/LogIn';

export default function LandingPage() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      style={{ minHeight: '100vh' }}
      bgcolor="#f3cb9f"
    >

      <img style={{margin: 50}} src="../../../public/images/local_grounds.svg" width={250} alt={"Local Grounds Logo"} />
      Welcome to Local Grounds - a place to find great local coffee and support the community 🤎
      <LoginButton />
    </Grid>
  );
}
