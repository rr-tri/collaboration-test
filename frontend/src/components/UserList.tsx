import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { StopCircle, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useCollaboration } from '@/context/collaborationCTX';

const UserList: React.FC = () => {
  const { state, userColors, leaveCollaboration } = useCollaboration();
  return (
    <div className="absolute top-1 right-1 m-2 z-10">
      <Popover>
        <PopoverTrigger asChild>
          <span className="relative z-50">
            <span className="bg-red-500 z-[1] text-[12px] px-[5px] text-white font-bold rounded-full absolute top-0 left-7 ">
              {state.users.length}
            </span>
            <Users className="w-9 h-9 relative bg-amber-500 p-1 rounded-full" />
          </span>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-34">
          <div className="flex flex-col gap-1 w-full">
            <Button
              className="hover:bg-red-300 text-xs m-1 gap-2"
              variant={'default'}
              size="sm"
              onClick={leaveCollaboration}
            >
              <StopCircle />
              <span> Stop Session</span>
            </Button>
            {state.users.map((user, i) => (
              <span
                key={i + user.id}
                className={cn(
                  ' flex flex-row gap-1 items-center justify-start w-full p-1',
                )}
              >
                <Avatar className="w-7">
                  <AvatarFallback
                    className={cn(
                      userColors[user.id],
                      ' flex flex-col items-center justify-center text-white w-full',
                    )}
                  >
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-[10px]">{user.name}</p>
              </span>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserList;
