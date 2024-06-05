import { Box, Button, Card, Center, Spinner } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { arrayUnion, collection, doc, documentId, query, updateDoc, where } from 'firebase/firestore';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { Navigate } from 'react-router-dom';

import '../dashboard.css';
import { db } from '../../firebase.config';
import logo from '../logo.png';

const auth = getAuth();

function DashboardPage() {
  const [user, userLoading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  // Get the current user from Firebase
  const [currentUser, currentUserLoading] = useDocument(doc(db, 'users', user?.uid || 'asd'));
  const currentUserData = currentUser?.data() || {};

  // Get users from Firebase database
  const usersCollectionRef = collection(db, 'users');
  const [users, usersLoading] = useCollection(query(usersCollectionRef, where(documentId(), '!=', user?.uid || 'asd')));
  const usersArray = (users?.docs || []).map(function (user) {
    return { id: user.id, ...user.data() };
  });

  async function likeUser(userId: string) {
    if (currentUser) {
      await updateDoc(currentUser.ref, {
        userLikes: arrayUnion(userId),
      });
    }
  }

  function checkIfMatch(userId: string, userLikes: string[]) {
    if (!userLikes.length || !currentUser) return false;

    // It's a match if the logged in user and the user we check against have liked each other.
    return currentUserData.userLikes?.includes(userId) && userLikes.includes(currentUser.id);
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
              {checkIfMatch(user.id, user.userLikes || []) ? (
                <p>
                  <b>Contact info: </b> {user.contactInfo}
                </p>
              ) : (
                ''
              )}
            

              <Button
                onClick={function () {
                  likeUser(user.id);
                }}
                className="my-button"
              >
                ❤️
              </Button>
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
