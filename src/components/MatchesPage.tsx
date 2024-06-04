import { Box, Spinner, Text } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { collection, doc, documentId, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { Navigate } from 'react-router-dom';

import { db } from '../../firebase.config';

const auth = getAuth();

function MatchesPage() {
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
    <Box padding="24px">
      <Text fontSize="xl">Matches</Text>
      {/* TODO Display cards of matched users. */}
    </Box>
  );
}

export default MatchesPage;
