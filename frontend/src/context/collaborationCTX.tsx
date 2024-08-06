import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../lib/socket';
import { useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getRandCol } from '@/lib/helper';
import { useDebouncedCallback } from 'use-debounce';
import { Socket } from 'socket.io-client';
import { AudioLines } from 'lucide-react';

export type Action =
  | { type: 'SET_ROOM_ID'; payload: string | null }
  | { type: 'SET_USERS'; payload: RoomUser[] }
  | { type: 'ADD_USER'; payload: RoomUser }
  | { type: 'SET_MESSAGES'; payload: RoomMessage[] }
  | { type: 'ADD_MESSAGE'; payload: RoomMessage }
  | { type: 'SET_CURSORS'; payload: { [userId: string]: Cursor } }
  | { type: 'UPDATE_CURSOR'; payload: { userId: string; cursor: Cursor } }
  | { type: 'USER_LEFT'; payload: string }
  | { type: 'SET_LINES'; payload: LineNode[] }
  | { type: 'ADD_LINE'; payload: LineNode }
  | {
      type: 'UPDATE_LINE_PATH';
      payload: { lineId: string; position: { x: number; y: number } };
    }
  | { type: 'RESET' };

const initialState: CurrentRoomState = {
  roomId: null,
  users: [],
  messages: [],
  cursors: {},
  lines: [],
};

const reducer = (state: CurrentRoomState, action: Action): CurrentRoomState => {
  switch (action.type) {
    case 'SET_ROOM_ID':
      return { ...state, roomId: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_CURSORS':
      return { ...state, cursors: action.payload };
    case 'UPDATE_CURSOR':
      return {
        ...state,
        cursors: {
          ...state.cursors,
          [action.payload.userId]: action.payload.cursor,
        },
      };
    case 'USER_LEFT':
      const newCursors = { ...state.cursors };
      delete newCursors[action.payload];
      return { ...state, cursors: newCursors };
    case 'SET_LINES':
      return { ...state, lines: action.payload };
    case 'ADD_LINE':
      return { ...state, lines: [...state.lines, action.payload] };
    case 'UPDATE_LINE_PATH':
      // console.log('dispatched position', action.payload.position);
      return {
        ...state,
        lines: state.lines.map((line) => {
          if (action.payload.lineId === line.id) {
            return {
              ...line,
              points: [
                ...line.points,
                action.payload.position.x,
                action.payload.position.y,
              ],
            };
          }
          return line;
        }),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

interface CollaborationProviderProps {
  children: ReactNode;
}

const CollaborationContext = createContext<
  | {
      state: CurrentRoomState;
      dispatch: React.Dispatch<Action>;
      curUser: RoomUser | null;
      startCollaboration: () => void;
      sendMessage: (message: string) => void;
      leaveCollaboration: () => void;
      handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
      handleCurUserEditing: (e: React.ChangeEvent<HTMLInputElement>) => void;
      userColors: Record<string, string>;
      socket: Socket;
    }
  | undefined
>(undefined);

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [curUser, setCurUser] = useState<RoomUser | null>(null);
  const [userColors, setUserColors] = useState<Record<string, string>>({});

  useEffect(() => {
    socket.on('room_users', (usersFromServer: RoomUser[]) => {
      dispatch({ type: 'SET_USERS', payload: usersFromServer });
      const newUserColors: Record<string, string> = {};
      usersFromServer.forEach((usr) => {
        if (!userColors[usr.id]) {
          newUserColors[usr.id] = getRandCol();
        } else {
          newUserColors[usr.id] = userColors[usr.id];
        }
      });
      setUserColors(newUserColors);
    });
    socket.on('user_joined', (user) => {
      toast({ title: user.name + ' has joined the room.', variant: 'success' });
    });
    socket.on('room_messages', (messagesFromServer: RoomMessage[]) => {
      dispatch({ type: 'SET_MESSAGES', payload: messagesFromServer });
    });
    socket.on('new_message', (messageFromServer: RoomMessage) => {
      dispatch({ type: 'ADD_MESSAGE', payload: messageFromServer });
    });

    socket.on(
      'update_cursor',
      ({ userId, cursor }: { userId: string; cursor: Cursor }) => {
        dispatch({ type: 'UPDATE_CURSOR', payload: { userId, cursor } });
      },
    );

    socket.on('room_cursors', (cursors: { [userId: string]: Cursor }) => {
      dispatch({ type: 'SET_CURSORS', payload: cursors });
    });

    socket.on('user_left', (user: RoomUser) => {
      dispatch({ type: 'USER_LEFT', payload: user.id });
      toast({ title: `user ${user.name} left.`, variant: 'success' });
    });
    // console.log('refresh refresh');
    socket.on('room_closed', () => {
      dispatch({ type: 'RESET' });
    });

    return () => {
      socket.off('room_users');
      socket.off('user_joined');
      socket.off('room_messages');
      socket.off('new_message');
      socket.off('update_cursor');
      socket.off('room_cursors');
      socket.off('user_left');
      socket.off('room_closed');
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.roomId) {
        socket.emit('leave_room', { roomId: state.roomId, user: curUser });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.roomId, curUser]);

  const getStoredUser = () => {
    const storedCurUser = JSON.parse(localStorage.getItem('curUser') as string);
    if (isSignedIn) {
      if (storedCurUser.id !== user.id) {
        const loggedUser = {
          id: user.id,
          name: user.fullName || '',
          loggedIn: true,
        };
        localStorage.setItem('curUser', JSON.stringify(loggedUser));
        return loggedUser;
      } else {
        return storedCurUser;
      }
    } else {
      if (storedCurUser) {
        return storedCurUser;
      } else {
        const newCurUser: RoomUser = {
          id: 'user_' + uuidv4(),
          name: `Guest_${uuidv4().slice(0, 7)}`,
          loggedIn: false,
        };
        localStorage.setItem('curUser', JSON.stringify(newCurUser));
        return newCurUser;
      }
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.hash.replace('#', ''));
    const room = searchParams.get('room');
    if (room) {
      dispatch({ type: 'SET_ROOM_ID', payload: room });
      joinCollaboration(room);
    } else {
      leaveCollaboration();
    }
  }, [location]);

  const joinCollaboration = (roomId: string) => {
    const cUser = getStoredUser();
    if (cUser) {
      socket.emit('join_room', { roomId, user: cUser });
      setCurUser(cUser);
    } else {
      console.log('no user found');
    }
  };

  const startCollaboration = () => {
    const cUser = getStoredUser();
    if (cUser) {
      const newRoomId = 'Room_' + uuidv4();
      navigate(`#room=${newRoomId}`);
      dispatch({ type: 'SET_ROOM_ID', payload: newRoomId });
      // socket.connect();
      socket.emit('create_room', { roomId: newRoomId, user: cUser });
      setCurUser(cUser);
    }
  };

  const leaveCollaboration = () => {
    if (state.roomId) {
      socket.emit('leave_room', {
        roomId: state.roomId,
        user: curUser,
      });

      // socket.disconnect();
      dispatch({ type: 'RESET' });
      navigate('/');
    }
  };

  const sendMessage = (message: string) => {
    if (state.roomId) {
      socket.emit('send_message', {
        roomId: state.roomId,
        user: curUser?.name,
        message,
      });
    }
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (state.roomId && state.users.length > 1) {
      const curCursor = {
        roomId: state.roomId,
        userId: curUser?.id,
        x: e.clientX,
        y: e.clientY,
        name: curUser?.name,
      };
      // console.log("cursor: ", curCursor.x, ", " + curCursor.y);
      socket.emit('update_cursor', curCursor);
    }
  };
  const debounced = useDebouncedCallback((value: RoomUser) => {
    localStorage.setItem('curUser', JSON.stringify(value));
    if (state.roomId) {
      socket.emit('update_user_name', {
        user: value,
        roomId: state.roomId,
      });
    }
  }, 2000);
  const handleCurUserEditing = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (curUser) {
      const newValue = {
        id: curUser.id,
        name: e.target.value,
        loggedIn: curUser.loggedIn,
      };
      setCurUser(newValue);
      debounced(newValue);
    }
  };

  return (
    <CollaborationContext.Provider
      value={{
        state,
        dispatch,
        socket,
        curUser,
        userColors,
        startCollaboration,
        leaveCollaboration,
        sendMessage,
        handleMouseMove,
        handleCurUserEditing,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error(
      'useCollaboration must be used within a CollaborationProvider',
    );
  }
  return context;
};
