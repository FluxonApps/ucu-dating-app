import { HStack, Img, Link, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import logo from '../logo.png';
import '../components/first_page.css';

function InitialPage() {
  return (
    <Stack className="container" spacing={10} justifyContent="center" alignItems="center">
      <Img className="auth-logo" src={logo} alt="logo" />
      <Text className="slogan" color="black" fontFamily={'Abhaya Libre'}>
        "Connecting Ukrainians Worldwide: Connectly brings hearts together across the globe."
      </Text>
      <HStack className="link" mt={4} fontFamily={'Abril Fatface'}>
        <Link as={RouterLink} to="/dashboard">
          Go to main page
        </Link>
        <Text>|</Text>
        <Link as={RouterLink} to="/auth">
          Authenticate
        </Link>
      </HStack>
    </Stack>
  );
}

export default InitialPage;
