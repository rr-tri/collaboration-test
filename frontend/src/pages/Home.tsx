import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ChatBox from '@/components/chatBox';
import UserCursors from '@/components/UserCursors';
import NavMenu from '@/components/NavMenu';
import CollaborationControl from '@/components/CollaborationControl';
import { useCollaboration } from '@/context/collaborationCTX';
import { DialogProvider } from '@/context/dialogctx';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { getRandCol } from '@/lib/helper';
import { MessageSquareDot, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserList from '@/components/UserList';
import DrawingBoard from '@/components/Board';

const Home: React.FC = () => {
  const {
    state,
    curUser,
    userColors,
    sendMessage,
    handleMouseMove,
    leaveCollaboration,
  } = useCollaboration();

  return (
    <div
      className="relative  w-100 min-h-[100vh]"
      onMouseMove={handleMouseMove}
    >
      <DialogProvider>
        <NavMenu collaborating={state.roomId ? true : false} />
        <CollaborationControl />
      </DialogProvider>

      {state.roomId && (
        <>
          {state.messages && (
            <div className="absolute bottom-4 right-4 z-50">
              <Popover>
                <PopoverTrigger>
                  <MessageSquareDot className=" w-10 h-10 rounded-full border p-1 bg-amber-500 shadow-sm" />
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

          {state.cursors && curUser && (
            <UserCursors
              curId={curUser.id}
              userColors={userColors}
              cursors={state.cursors}
            />
          )}
          {state.users.length > 1 && <UserList />}
        </>
      )}
      <div className='z-1'>
        <DrawingBoard />
      </div>
    </div>
  );
};

export default Home;
