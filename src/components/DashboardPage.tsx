import { Box, Button, Card, Center, Spinner, Select, Stack, CardFooter, CardBody, Text } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { arrayUnion, collection, doc, documentId, query, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
// import { Navigate } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';

import '../dashboard.css';
import { db } from '../../firebase.config';
import countries from '../components/countries.json'; // Import the JSON data
import logo from '../logo.png';

const auth = getAuth();

function DashboardPage() {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [ageRange, setAgeRange] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [preferenceFilter, setPreferenceFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Get the current user from Firebase
  const [currentUser, currentUserLoading] = useDocument(doc(db, 'users', user?.uid || 'asd'));
  const currentUserData = currentUser?.data() || {};

  // Get users from Firebase database
  const usersCollectionRef = collection(db, 'users');
  const [users, usersLoading] = useCollection(query(usersCollectionRef, where(documentId(), '!=', user?.uid || 'asd')));
  const usersArray = (users?.docs || []).map((user) => ({
    id: user.id,
    ...user.data(),
  }));

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

  function handleCountryFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setCountryFilter(event.target.value);
  }

  // Filter users by selected filters
  const filteredUsersArray = usersArray.filter((user) => {
    const age = user.age;
    const ageMatch =
      !ageRange ||
      (ageRange === '16-18' && age >= 16 && age <= 18) ||
      (ageRange === '19-21' && age > 18 && age <= 21) ||
      (ageRange === '22-25' && age > 21 && age <= 25) ||
      (ageRange === '26-30' && age > 25 && age <= 30) ||
      (ageRange === '30+' && age > 30);
    const genderMatch = !genderFilter || user.gender === genderFilter;
    const preferenceMatch = !preferenceFilter || user.preference === preferenceFilter;
    const countryMatch = !countryFilter || user.countryOfLiving === countryFilter;

    return ageMatch && genderMatch && preferenceMatch && countryMatch;
  });

  // Do not show page content until auth state is fetched.
  if (userLoading || currentUserLoading || usersLoading) {
    return (
      <Box padding="24px" className="body-cont">
        <Center>
          <Spinner />
        </Center>
      </Box>
    );
  }

  // If user isn't signed in, redirect to auth page.
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Box padding="24px" className="body-cont">
      <div>
        <img src={logo} className="connectly-logo" alt="Connectly Logo" />
      </div>
      <br />
      <Stack>
        <Select placeholder="Filter by age range" onChange={handleAgeRangeChange} value={ageRange} bg="white">
          <option value="16-18">16-18</option>
          <option value="19-21">19-21</option>
          <option value="22-25">22-25</option>
          <option value="26-30">26-30</option>
          <option value="30+">30+</option>
        </Select>
        <Select placeholder="Filter by gender" onChange={handleGenderFilterChange} value={genderFilter} bg="white">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
        </Select>
        <Select
          placeholder="Filter by preference"
          onChange={handlePreferenceFilterChange}
          value={preferenceFilter}
          bg="white"
        >
          <option value="dont-know">Don't know</option>
          <option value="date">Date</option>
          <option value="friends">Friends</option>
          {/* Add other preference options as needed */}
        </Select>
        <Select placeholder="Filter by country" onChange={handleCountryFilterChange} value={countryFilter} bg="white">
          {countries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.name}
            </option>
          ))}
        </Select>
      </Stack>
      <br />
      <div className="card-container" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Display cards for each user with their data. */}
        {filteredUsersArray.length > 0 ? (
          filteredUsersArray.map((user) => (
            <Card key={user.id} className="card">
              <CardBody>
                <Text>
                  <b>Name: </b> {user.name}
                </Text>
                <Text>
                  <b>Gender: </b> {user.gender}
                </Text>
                <Text>
                  <b>Age: </b> {user.age}
                </Text>
                <Text>
                  <b>Country of living: </b> {user.countryOfLiving}
                </Text>
                <Text>
                  <b>Preference: </b> {user.preference}
                </Text>
                <Text>
                  <b>Comment: </b> {user.comment}
                </Text>
              </CardBody>
              <CardFooter>
                <Button onClick={() => likeUser(user.id)} className="my-button">
                  ❤️
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Center w="full" py={8}>
            <p>No users matched your filters.</p>
          </Center>
        )}
      </div>

      <br />
      <Button onClick={signOut} class="sign-outt">
        Sign out
      </Button>
      <Button onClick={() => navigate('/matches')} class="gotopage">
        Check matches
      </Button>
      <Button onClick={() => navigate('/edit-profile')} class="gotopage">
        Edit your profile
      </Button>
    </Box>
  );
}

export default DashboardPage;
