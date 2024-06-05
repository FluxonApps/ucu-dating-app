import React, { useState } from 'react';
import { Box, Button, Card, Center, Spinner, Select } from '@chakra-ui/react';
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
  const [ageRange, setAgeRange] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [preferenceFilter, setPreferenceFilter] = useState('');

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

  // Handle filter changes
  function handleAgeRangeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setAgeRange(event.target.value);
  }

  function handleGenderFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setGenderFilter(event.target.value);
  }

  function handlePreferenceFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setPreferenceFilter(event.target.value);
  }

  // Filter users by selected filters
  const filteredUsersArray = usersArray.filter(user => {
    const age = user.age;
    const ageMatch = !ageRange || (
      (ageRange === '16-18' && age >= 16 && age <= 18) ||
      (ageRange === '19-21' && age > 18 && age <= 21) ||
      (ageRange === '22-25' && age > 21 && age <= 25) ||
      (ageRange === '26-30' && age > 25 && age <= 30) ||
      (ageRange === '30+' && age > 30)
    );
    const genderMatch = !genderFilter || user.gender === genderFilter;
    const preferenceMatch = !preferenceFilter || user.preference === preferenceFilter;

    return ageMatch && genderMatch && preferenceMatch;
  });

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
        <img src={logo} className="connectly-logo" />
      </div>
      <br />
      <Select placeholder="Filter by age range" onChange={handleAgeRangeChange} value={ageRange}>
        <option value="16-18">16-18</option>
        <option value="19-21">19-21</option>
        <option value="22-25">22-25</option>
        <option value="26-30">26-30</option>
        <option value="30+">30+</option>
      </Select>
      <Select placeholder="Filter by gender" onChange={handleGenderFilterChange} value={genderFilter}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="non-binary">Non-binary</option>
      </Select>
      <Select placeholder="Filter by preference" onChange={handlePreferenceFilterChange} value={preferenceFilter}>
        <option value="dont-know">Dont-know</option>
        <option value="date">Date</option>
        <option value="friends">Friends</option>
        {/* Add other preference options as needed */}
      </Select>
      <br />
      <div className='card-container' style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Display cards for each user with their data. */}
        {filteredUsersArray.length > 0 ? (
          filteredUsersArray.map(function (user: any) {
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
                  <b>Country of living: </b> {user.countryOfLiving}
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
          })
        ) : (
          <Center w="full" py={8}>
            <p>No users matched your filters.</p>
          </Center>
        )}
      </div>

      <br />
      <Button className='' onClick={signOut}>Sign out</Button>
    </Box>
    // <Button onClick={signOut}>Sign out</Button>
  );
}

export default DashboardPage;

