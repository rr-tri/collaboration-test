import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface MessageListProps {
  messages: { user: string; message: string }[];
  curUser?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, curUser }) => {
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTop = ulRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full flex flex-col  h-full">
      <h2 className="text-lg font-semibold border-b-[1px] mb-1">Messages</h2>
      <ul
        ref={ulRef}
        className="rounded flex flex-col flex-1 w-full bg-amber-200 px-2 overflow-y-scroll no-scrollbar"
      >
        {messages.map((msg, index) => (
          <li
            key={index}
            className={cn(
              'flex gap-1 my-1 ',
              curUser === msg?.user
                ? 'flex-row-reverse items-start justify-start'
                : 'flex-row items-start justify-start',
            )}
          >
            <Avatar className='mt-1'>
              <AvatarFallback className="bg-red-600 text-white">
                {msg.user[0]}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'text-xs rounded-sm  w-[60%] flex flex-col gap-0 items-start justify-end break-words',
              )}
            >
              <span
                className={cn(
                  'px-1 pt-1 bg-amber-200 w-full text-[10px] font-semibold ',
                  curUser === msg?.user ? 'text-right' : '',
                )}
              >
                {msg.user}
              </span>
              <span
                className={cn(
                  'w-full px-2 py-1 text-wrap text-white',
                  curUser === msg?.user
                    ? 'bg-blue-900 rounded-tl rounded-bl rounded-br mb-2'
                    : 'bg-green-700 rounded-tr rounded-br rounded-bl ',
                )}
              >
                {msg.message}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
