import { FC } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatBoxInterface {
  curUser: RoomUser | null;
  messages: RoomMessage[];
  sendMessage: (message: string) => void;
}

const ChatBox: FC<ChatBoxInterface> = ({ curUser, messages, sendMessage }) => {
  return (
    <div className="w-full h-full rounded-md  flex flex-col">
      <div className="h-[90%]">
        <MessageList curUser={curUser?.name} messages={messages} />
      </div>

      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatBox;
