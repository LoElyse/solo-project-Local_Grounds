import { CssBaseline } from '@mui/material';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useAuth0 } from '@auth0/auth0-react';
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
