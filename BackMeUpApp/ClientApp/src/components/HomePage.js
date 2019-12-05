import React from 'react';
import Post from './Post';
import CreatePost from './CreatePost';

const HomePage=()=>(
    <div>
      <CreatePost />
      <Post/>
      <Post/>
      <Post/>
    </div>
  );
export default HomePage;