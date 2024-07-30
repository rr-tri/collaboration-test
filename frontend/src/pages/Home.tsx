import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useCollaboration } from "@/context/collaborationCTX";
import ChatBox from "@/components/chatBox";
import UserCursors from "@/components/UserCursors";

const Home: React.FC = () => {
  const {
    state,
    curUser,
    startCollaboration,
    leaveCollaboration,
    sendMessage,
    handleMouseMove,
  } = useCollaboration();

  return (
    <div className="relative w-100 min-h-[100vh]" onMouseMove={handleMouseMove}>
     
      {state.roomId ? (
        <>
          {(state.users.length > 1 || state.messages) && (
            <div className="absolute bottom-4 right-4">
              <Popover>
                <PopoverTrigger>
                  <div className=" w-10 h-10 rounded-full border flex flex-col items-center justify-center bg-red-100 shadow-sm">
                    <img src="/message.svg" className="h-6 w-6 " />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="h-[30rem] w-[20rem] mr-2 bg-green-400 p-1">
                  <ChatBox
                    curUser={curUser}
                    messages={state.messages}
                    sendMessage={sendMessage}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Button
            className="m-1"
            variant={"destructive"}
            onClick={leaveCollaboration}
          >
            Stop Session
          </Button>
          {state.cursors && curUser && (
            <UserCursors curId={curUser.id} cursors={state.cursors} />
          )}
          <ul>
            {state.users.map((user, i) => (
              <li key={i + user.id}>{user.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <Button onClick={startCollaboration} className="m-1" size={"sm"}>
            Start Session
          </Button>
        </>
      )}
    </div>
  );
};

export default Home;
