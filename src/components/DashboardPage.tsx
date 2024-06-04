import { Box, Button, Card, Center, Spinner } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { collection, doc, documentId, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { Navigate } from 'react-router-dom';
import '../dashboard.css';

import { db } from '../../firebase.config';

const auth = getAuth();

function DashboardPage() {
  const [user, userLoading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  // Get the current user from Firebase
  const [currentUser, currentUserLoading] = useDocument(doc(db, 'users', user?.uid || 'asd'));
  // A list of IDs of liked users.
  const [likedUsers, setLikedUsers] = useState<string[]>([]);

  // Get users from Firebase database
  const usersCollectionRef = collection(db, 'users');
  const [users, usersLoading] = useCollection(query(usersCollectionRef, where(documentId(), '!=', user?.uid || 'asd')));

  function likeUser(userId: string) {
    console.log(userId);
    setLikedUsers([...likedUsers, userId]);
  }

  // Do not show page content until auth state is fetched.
  if (userLoading || currentUserLoading || usersLoading) {
    return <Spinner />;
  }

  // If user isn't signed in, redirect to auth page.
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Box padding="24px">
      {/* <p>Welcome, {currentUser?.data()?.name}!</p> */}
      <img
      src="../src/logo.png"
      className='connectly-logo'
          />
      <br />
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Display cards for each user with their data. */}
        {users?.docs.map(function (user) {
          // An object that holds user data from Firebase.
          const userData = user.data();

          return (
            <Card key={user.id} padding={4} className='card'>
              <p>
                <b>Name: </b> {userData.name}
              </p>
              <p>
                <b>Age: </b> {userData.age}
              </p>
              <p>
                <b>Country of living: </b> {userData.country}
              </p>
              <p>
                <b>Preference: </b> {userData.preference}
              </p>
              <p>
                <b>Comment: </b> {userData.comment}
              </p>
              {likedUsers.includes(user.id) ?
              <p>
                <b>Contact info: </b> {userData.contactInfo}
              </p> :''}
              <Button onClick={function () {
                likeUser(user.id);
              }} className='my-button'>❤️</Button>
              
            </Card>
          );

        })}
      </div>
      
      <br />
      <Button onClick={signOut}>Sign out</Button>
    </Box>
  );
}

export default DashboardPage;
