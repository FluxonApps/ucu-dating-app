import { HStack, Img, Link, Stack, Text } from '@chakra-ui/react';

import fluxonLogo from '../assets/fluxon-logo.svg';
import MainLayout from '../components/layout/MainLayout.tsx';

function InitialPage() {
  return (
    <MainLayout>
      <Stack spacing={4} justifyContent="center" alignItems="center" h="full">
        <Link target="_blank" href="https://fluxon.com">
          <Img w={300} src={fluxonLogo} />
        </Link>
        <Text color="white">UCU x Fluxon Product Development Bootcamp</Text>
        <HStack mt={4} color="blue.100">
          <Link href="/dashboard">Go to main page</Link>
          <Text>|</Text>
          <Link href="/auth">Authenticate</Link>
        </HStack>
      </Stack>
    </MainLayout>
  );
}

export default InitialPage;
