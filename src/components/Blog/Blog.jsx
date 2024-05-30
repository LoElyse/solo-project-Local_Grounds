import { Box } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiMarkdown from 'mui-markdown';


import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { ImageList, ImageListItem } from '@mui/material';
const socket = io('http://localhost:3000'); // replace with your server URL

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Blog() {
  const [expanded, setExpanded] = React.useState(false);
  const blogResults = useSelector((store) => store.blogCreated);
  const dispatch = useDispatch();

  socket.on('blogSent', (blog) => {
    console.log('Setting Blog Component To True:');
    dispatch({
      type: 'SHOW_BLOGS',
      payload: 1
    });
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  return (
    <div>
      <Box display="flex" flexDirection="column" alignItems="center">
      {blogResults.map((blog) => {
        const content = JSON.parse(blog.content);
        return(
          <Box key={`box-${blog.id}`} mb={8} width="100%" display="flex" justifyContent="center">
    <Card sx={{ maxWidth: 800 }} key={`card-${blog.id}`}>
      <CardHeader
        title={blog.title}
        key={`ch-${blog.id}`}

      />
      <CardMedia
        component="img"
        key={`cm-${blog.id}`}
        image={content.photos[content.photos.length - 1]}
      />
      <CardActions disableSpacing key={`ca-${blog.id}`}>
        <IconButton  key={`ib-${blog.id}`}
                    aria-label="add to favorites"
        >
          <FavoriteIcon  />
        </IconButton>
        <ExpandMore
          key={`cem-${blog.id}`}
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse key={`col-${blog.id}`} in={expanded} timeout="auto" unmountOnExit>
        <CardContent key={`cc-${blog.id}`}>
            <Typography mode="markdown" option={{all: { gutterBottom: true, color: 'primary'}, h1: { align: 'center'}}}>
              <MuiMarkdown>{content.content}</MuiMarkdown>
            </Typography>
          <ImageList variant="masonry" cols={3} gap={8}>
            {content.photos.map((item) => (
              <ImageListItem key={item}>
                <img
                  srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item}?w=248&fit=crop&auto=format`}
                  alt={item}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </CardContent>
      </Collapse>
    </Card>
    </Box>
            )}
  )}
        </Box>
    </div>
  )
}