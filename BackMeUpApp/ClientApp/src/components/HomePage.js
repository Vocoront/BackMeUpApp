import React from 'react';
import Post from './Post';
import NewPostForm from './NewPostForm';

const HomePage=()=>(
    <div>
      <NewPostForm />
      <Post/>
      <Post/>
      <Post/>
    </div>
  );
export default HomePage;