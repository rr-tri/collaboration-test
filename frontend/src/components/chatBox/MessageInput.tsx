import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  sendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (message) {
      sendMessage(message);
      setMessage('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="relative flex flex-row items-center w-full my-1">
      <Input
        className=" outline-none"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        onKeyDown={handleKeyDown}
      />
      <Button
        className={cn(
          'absolute right-1 bottom-1  pl-0 py-1 h-8 w-8',
          message ? 'bg-green-500 text-white ' : '',
        )}
        size={'icon'}
        variant="link"
        onClick={handleSendMessage}
      >
        <Send size={'1.2rem'} />
      </Button>
    </div>
  );
};

export default MessageInput;
