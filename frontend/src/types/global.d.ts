
interface LineNode {
  id: string;
  points: number[];
  stroke: string;
  strokeWidth: number;
  name: string;
}

interface RoomUser {
  id: string;
  name: string;
  loggedIn: boolean;
}

interface RoomMessage {
  user: string;
  message: string;
}
interface Cursor {
  x: number;
  y: number;
  name: string;
}
interface RoomCursor {
  [userId: string]: Cursor
}

interface CurrentRoomState {
  roomId: string | null;
  users: RoomUser[];
  messages: RoomMessage[];
  cursors: RoomCursor;
  lines: LineNode[];
}

interface ServerToClientEvents {
  user_joined: (user: RoomUser) => void;
  room_users: (users: RoomUser[]) => void;
  room_messages: (messages: RoomMessage[]) => void;
  user_left: (user: RoomUser) => void;
  room_closed: () => void;
  new_message: (message: RoomMessage) => void;
  update_cursor: ({ userId: string, cursor: RoomCursor })
}

interface ClientToServerEvents {
  create_room: ({ roomId: string, user: RoomUser }) => void;
  join_room: ({ room: string, user: RoomUser }) => void;
  leave_room: ({ roomId: string, user: RoomUser }) => void;
  close_room: (roomId: string) => void;
  update_cursor: ({ roomId: string, userId: string, x: number, y: number, name: string }) => void;
  update_user_name: (user: RoomUser, roomId: string) => void;
  send_message: ({ user: RoomUser, roomId: string, message: string }) => void;

}
