import { Box, Card, Button, Spinner, Text } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { collection, doc, documentId, query, where } from 'firebase/firestore';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { Navigate } from 'react-router-dom';

import { db } from '../../firebase.config';
import logo from '../logo.png'
import '../dashboard.css'
import checkIfMatch from '../DashboardPage.tsx';
const auth = getAuth();

function MatchesPage() {
  const [signOut] = useSignOut(auth);
  const [user, userLoading] = useAuthState(auth);

  // Get the current user from Firebase
  const [currentUser] = useDocument(doc(db, 'users', user?.uid || 'asd'));
  const currentUserData = currentUser?.data() || {};

  // Get users from Firebase database
  const usersCollectionRef = collection(db, 'users');
  const [users, usersLoading] = useCollection(query(usersCollectionRef, where(documentId(), '!=', user?.uid || 'asd')));
  const usersArray = users?.docs.map(function (user) {
    return { id: user.id, ...user.data() };
  });

  // Do not show page content until auth state is fetched.
  if (userLoading || usersLoading) {
    return <Spinner />;
  }

  // If user isn't signed in, redirect to auth page.
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Box padding="24px" className='body-cont'>
      {/* <p>Welcome, {currentUser?.data()?.name}!</p> */}
      <div >
        <img src={logo} className="connectly-logo" />
      </div>
      <br />
      <div className='card-container' style={{ display: 'flex', gap: '24px' }}>
        {/* Display cards for each user with their data. */}
        {usersArray.map(function (user: any) {
          return (
            <Card key={user.id} padding={4} className="card">
              <p>
                <b>Name: </b> {user.name}
              </p>
              <p>
                <b>Gender: </b> {user.gender}
              </p>
              <p>
                <b>Age: </b> {user.age}
              </p>
              <p>
                <b>Country of living: </b> {user.country}
              </p>
              
              <p>
                <b>Preference: </b> {user.preference}
              </p>
              <p>
                <b>Comment: </b> {user.comment}
              </p>
              <p>
                <b>Contact info: </b> {user.contactInfo}
              </p>
            </Card>
          );
        })}
      </div>

      <br />
      <Button onClick={signOut}>Sign out</Button>
    </Box>
  );
};


export default MatchesPage;
