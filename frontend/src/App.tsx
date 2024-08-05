import Home from '@/pages/Home';
import { CollaborationProvider } from '@/context/collaborationCTX';
import { ClerkLoaded } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <>
      <ClerkLoaded>
        <CollaborationProvider>
          <Home />
          <Toaster />
        </CollaborationProvider>
      </ClerkLoaded>
    </>
  );
};

export default App;
