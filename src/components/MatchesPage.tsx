import { Box, Card, Button, Spinner } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { collection, doc, query, where, documentId } from 'firebase/firestore';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { Navigate } from 'react-router-dom';

import { db } from '../../firebase.config';
import logo from '../logo.png';
import '../dashboard.css';

const auth = getAuth();

function MatchesPage() {
  const [signOut] = useSignOut(auth);
  const [user, userLoading] = useAuthState(auth);

  // Get the current user from Firebase
  const [currentUser, currentUserLoading] = useDocument(doc(db, 'users', user?.uid || 'asd'));
  const currentUserData = currentUser?.data() || {};

  // Get users from Firebase database
  const usersCollectionRef = collection(db, 'users');
  const [users, usersLoading] = useCollection(query(usersCollectionRef, where(documentId(), '!=', user?.uid || 'asd')));
  const usersArray = users?.docs.map(user => ({
    id: user.id,
    ...user.data()
  })) || [];

  // Filter users to show only those liked by the current user
  const likedUsersArray = usersArray.filter(user => currentUserData.userLikes?.includes(user.id));

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
      <div>
        <img src={logo} className="connectly-logo" alt="Connectly Logo" />
      </div>
      <br />
      <div className='card-container' style={{ display: 'flex', gap: '24px' }}>
        {/* Display cards for each liked user with their data. */}
        {likedUsersArray.map(user => (
          <Card key={user.id} padding={4} className="card">
            <p><b>Name: </b> {user.name}</p>
            <p><b>Gender: </b> {user.gender}</p>
            <p><b>Age: </b> {user.age}</p>
            <p><b>Country of living: </b> {user.country}</p>
            <p><b>Preference: </b> {user.preference}</p>
            <p><b>Comment: </b> {user.comment}</p>
            <p><b>Contact info: </b> {user.contactInfo}</p>
          </Card>
        ))}
      </div>

      <br />
      <Button onClick={signOut}>Sign out</Button>
    </Box>
  );
}

export default MatchesPage;
