import * as React from 'react';
import './AboutPage.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function AboutPage() {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const showInfo = useSelector((store) => store.showInfo);
  const dispatch = useDispatch();


  const handleClose = () => {
    setOpen(false);
    dispatch({ type: 'SHOW_INFO', payload: !showInfo });
  }
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };
  

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [showInfo]);


    return (
      <div>

        <Backdrop
          sx={{ bgcolor:'rgb(51, 26, 7)', color: '#f3cb9f', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showInfo}
          onClick={handleClose}
        >


  <Card sx={{ maxWidth: 800, height: 800, bgcolor:'#F3CB9FFF'}}>
    <CardActionArea>
      <div>
        <img src= '/public/images/local_grounds.svg' class="center" alt="local ground logo" height="300" width="300"/>
      </div>
      <CardContent>
        <Typography gutterBottom variant="h5"  component="div" align="center">
             About The App
            </Typography>
            <Typography variant="body2"  color="text.secondary" paragraph>


              Technologies used to create this app:
              <ul>

              <li>Node.js: For the backend server.</li>

              <li>React: For building a dynamic and responsive user interface.</li>

              <li>Redux: To manage the app's state.</li>

              <li>AI: To curate personalized blogs for each coffee shop.</li>

              <li>Google Places API: To find local coffee shops.</li>

              <li>Material UI: For stylish and user-friendly design components.</li>

             <li> TypeScript: For better code quality and type safety.</li>

              <li>Prisma: To handle database interactions smoothly.</li>

              <li>AuthO: To securely manage user logins.</li>

                <li>Socket.io: To enable real-time communication between users.</li>
            </ul>
              In the future, I aim to expand Local Grounds to search for all locally owned, non-chain businesses.
              This will help support communities no matter where you travel.

            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
        </Backdrop>
      </div>
    );
  }






