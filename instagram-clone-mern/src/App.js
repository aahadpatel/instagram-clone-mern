import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { Button, DialogContentText, Input } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // listening for whenever any authentication change occurs
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in 
        console.log(authUser);
        // setting persistent state, which keeps you logged in
        setUser(authUser);
      } else {
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup actions before firing the useeffect
      unsubscribe();
    }
  }, [user, username]);

  // useEffect runs a piece of code based on a specific condition 
  useEffect(() => {
    // every single time the database changes in that collection, onSnapshot takes a 'picture' of what the collection currently holds
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    //prevent refresh
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
      setOpenSignIn(false)
  }

  return (
    <div className="app">
      {/*  ? is an 'optional' in JS- if user is not there, don't apply the condition */}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img 
              className="app__headerImage"
              src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png"
              alt=""
            />
          </center>
          <form className="app__signup">
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email" 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form> 
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img 
              className="app__headerImage"
              src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png"
              alt=""
            />
          </center>
          <form className="app__signup">
            <Input
              placeholder="email" 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form> 
      </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
          ): (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
        {
          posts.map(({id, post}) => (
            // putting an id prevents refreshing all the posts- just refreshes the new post added in the db
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}></Post>
          ))
        }
        </div>
          <div className="app__postsRight"> 
            <InstagramEmbed 
              url='https://www.instagram.com/p/CHwuNT8rWvk/'
              // clientAccessToken='123|456'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ): (
        <h3>Sorry, please login to upload!</h3>
      )}
    </div>
  );
}

export default App;
