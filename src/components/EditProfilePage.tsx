import {
  Box,
  Spinner,
  Input,
  Select,
  Stack,
  Button,
  useToast,
  Text,
  FormControl,
  FormLabel,
  Center,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { FormEvent, ChangeEvent, useEffect, useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Navigate, useNavigate } from 'react-router-dom';

// import { Navigate, useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import countries from '../components/countries.json';
import logo from '../logo.png';
import '../dashboard.css';

const auth = getAuth();

function EditProfilePage() {
  const [user, userLoading] = useAuthState(auth);
  const toast = useToast();
  const [signOut] = useSignOut(auth);
  const navigate = useNavigate();

  // Get the current user from Firebase
  const [currentUser, currentUserLoading] = useDocument(doc(db, 'users', user?.uid || 'asd'));

  const [userLoaded, setUserLoaded] = useState(false);

  const [age, setAge] = useState('');
  const [countryOfLiving, setCountryOfLiving] = useState('');
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [preference, setPreference] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Set initial values for the form fields after user is loaded
    if (!userLoaded && !currentUserLoading) {
      const currentUserData = currentUser?.data() || {};

      setAge(currentUserData.age);
      setCountryOfLiving(currentUserData.countryOfLiving);
      setGender(currentUserData.gender);
      setName(currentUserData.name);
      setPreference(currentUserData.preference);
      setContactInfo(currentUserData.contactInfo);
      setComment(currentUserData.comment);

      setUserLoaded(true);
    }
  }, [userLoaded, currentUserLoading, currentUser]);

  const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      await updateDoc(currentUser.ref, {
        age,
        countryOfLiving,
        gender,
        name,
        preference,
        contactInfo,
        comment,
      });

      toast({
        status: 'success',
        description: 'Successfully updated user.',
      });
    } catch (e) {
      toast({ status: 'error', description: 'Failed to update user.' });
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };

  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountryOfLiving(e.target.value);
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContactInfo(e.target.value);
  };

  const handlePreferenceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPreference(e.target.value);
  };

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  // Do not show page content until auth state is fetched.
  if (userLoading || currentUserLoading) {
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
      <Text fontSize="xl" marginBottom="16px">
        Profile settings
      </Text>
      <form onSubmit={updateProfile}>
        <Stack spacing={3} bg="white" rounded="md" p={8}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Name" type="text" onChange={handleNameChange} value={name} required />
          </FormControl>

          <FormControl>
            <FormLabel>Age</FormLabel>
            <Input placeholder="Age" type="number" onChange={handleAgeChange} value={age} required />
          </FormControl>

          <FormControl>
            <FormLabel>Gender</FormLabel>
            <Select
              placeholder="Gender"
              onChange={handleGenderChange}
              value={gender}
              required
              style={{ color: gender ? 'black' : 'grey' }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Country of living</FormLabel>
            <Select
              placeholder="Country of living"
              onChange={handleCountryChange}
              value={countryOfLiving}
              required
              style={{ color: countryOfLiving ? 'black' : 'grey' }}
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Contact Information</FormLabel>
            <Input
              placeholder="Contact Information"
              type="text"
              onChange={handleContactChange}
              value={contactInfo}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Preference</FormLabel>
            <Select placeholder="Preference" onChange={handlePreferenceChange} value={preference} required>
              <option value="friends">Friends</option>
              <option value="date">Date</option>
              <option value="dont-know">Don't know</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Comment</FormLabel>
            <Input placeholder="Comment" type="text" onChange={handleCommentChange} value={comment} required />
          </FormControl>

          <Button type="submit" class="sign-outt">
            Update
          </Button>
        </Stack>
      </form>
      <Button onClick={signOut} class="sign-outt">
        Sign out
      </Button>
      <Button onClick={() => navigate('/matches')} class="gotopage">
        Check matches
      </Button>
      <Button onClick={() => navigate('/dashboard')} class="gotopage">
        Back to main page
      </Button>
    </Box>
  );
}

export default EditProfilePage;
