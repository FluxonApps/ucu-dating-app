import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Select,
  useToast,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';

import logo from '../logo.png';
import '../auth.css';
import { db } from '../../firebase.config.ts';
import countries from '../components/countries.json'; // Import the JSON data

const auth = getAuth();

const AuthPage = () => {
  const toast = useToast();

  const [user] = useAuthState(auth);
  const [signInWithEmailAndPassword, , signInLoading] = useSignInWithEmailAndPassword(auth);
  const [createUserWithEmailAndPassword, , signUpLoading] = useCreateUserWithEmailAndPassword(auth);
  const loading = signInLoading || signUpLoading;

  const [showSignIn, setShowSignIn] = useState(false);

  // Variables that store form field values.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [countryOfLiving, setCountry] = useState('');
  const [contactInfo, setContact] = useState('');
  const [preference, setPreference] = useState('');
  const [comment, setComment] = useState('');

  const switchAuthMode = () => {
    setShowSignIn((prevState) => !prevState);
    setEmail('');
    setPassword('');
    setName('');
    setAge('');
    setGender('');
    setCountry('');
    setContact('');
    setPreference('');
    setComment('');
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };

  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
    e.target.style.color = 'black';
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
    e.target.style.color = 'black';
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
  };

  const handlePreferenceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPreference(e.target.value);
    e.target.style.color = 'black';
  };

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const signIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (!res) throw new Error();

      toast({ status: 'success', description: 'Successfully signed in!' });
    } catch (e) {
      console.error(e);
      toast({
        status: 'error',
        title: 'Error',
        description: 'Failed to sign in. Please, try again.',
      });
    }
  };

  const signUp = async () => {
    try {
      if (parseInt(age) < 16) {
        throw new Error('Users must be at least 16 years old.');
      }

      const res = await createUserWithEmailAndPassword(email, password);
      if (!res) throw new Error();

      // Save user to database.
      const userDocRef = doc(db, 'users', res.user.uid);

      await setDoc(userDocRef, {
        name,
        email,
        age,
        gender,
        countryOfLiving,
        contactInfo,
        preference,
        comment,
        userLikes: [],
      });

      toast({ status: 'success', description: 'Successfully signed up!' });
    } catch (e) {
      console.error(e);
      toast({
        status: 'error',
        title: 'Error',
        description: e.message || 'Failed to create a new user. Please, try again.',
      });
    }
  };

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (showSignIn) {
      await signIn();
    } else {
      await signUp();
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Flex w="full" h="full" justifyContent="space-between">
      <Box mx="auto" as="form" onSubmit={handleAuth}>
        <Stack spacing={4} w={500} bg="white" rounded="md" p={8}>
          <img className="auth-logo" src={logo} alt="Logo" />

          {!showSignIn && <Input placeholder="Name" type="text" onChange={handleNameChange} value={name} required />}
          <Input placeholder="Email" type="email" onChange={handleEmailChange} value={email} required />
          <Input
            placeholder="Password"
            type="password"
            onChange={handlePasswordChange}
            value={password}
            minLength={6}
            required
          />

          {!showSignIn && (
            <>
              <Input placeholder="Age" type="number" onChange={handleAgeChange} value={age} required />
              <Select placeholder="Gender" onChange={handleGenderChange} value={gender} required style={{ color: gender ? 'black' : 'grey' }}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </Select>
              <Select placeholder="Country of living" onChange={handleCountryChange} value={countryOfLiving} required style={{ color: countryOfLiving ? 'black' : 'grey' }}>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.name}
                  </option>
                ))}
              </Select>
              <Input
                placeholder="Contact Information"
                type="text"
                onChange={handleContactChange}
                value={contactInfo}
                required
              />
              <Select placeholder="Preference" onChange={handlePreferenceChange} value={preference} required style={{ color: preference ? 'black' : 'grey' }}>
                <option value="friends">Friends</option>
                <option value="date">Date</option>
                <option value="dont-know">Don't know</option>
              </Select>
              <Input placeholder="Comment" type="text" onChange={handleCommentChange} value={comment} required />
            </>
          )}

          <Button type="submit" bg="turquoise" isDisabled={loading} isLoading={loading}>
            {showSignIn ? 'SIGN IN' : 'SIGN UP'}
          </Button>
          <Button mt={4} fontSize="sm" fontWeight="normal" variant="link" onClick={switchAuthMode} isDisabled={loading}>
            {showSignIn ? 'Create a new account?' : 'Already have an account?'}
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default AuthPage;
