import Home from "@/pages/Home";
import { CollaborationProvider } from "@/context/collaborationCTX";
import { UserButton, useUser } from "@clerk/clerk-react";

const App: React.FC = () => {
  const { user } = useUser();
  return (
    <>
      <div className="h-[40] bg-[#368750] p-4 flex flex-row justify-between items-center">
        <h1>Collaboration Home</h1>
        <div className="flex flex-row items-center">
          <UserButton showName />
          {/* ) : (
            <div className="flex flex-row gap-2 items-center font-semibold text-[10px]">
              <p>{curUser?.name}</p>
              <Avatar>
                <AvatarFallback>{curUser?.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          )} */}
        </div>
      </div>
      <CollaborationProvider>
        <Home />;
      </CollaborationProvider>
    </>
  );
};

export default App;
