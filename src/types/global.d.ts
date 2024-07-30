interface RoomUser {
  id: string;
  name: string;
  loggedIn: boolean;
}

interface RoomMessage {
  user: string;
  message: string;
}
interface RoomCursor {
  x: number;
  y: number;
  name: string;

}

interface CurrentRoomState {
  roomId: string | null;
  users: RoomUser[];
  messages: RoomMessage[];
  cursors: RoomCursors;
}

interface ServerToClientEvents {
  your_move: (move: Move) => void;
  new_msg: (userId: string, msg: string) => void;
  room_exists: (exists: boolean) => void;
  room: (room: Room, usersMovesToParse: string, usersToParse: string) => void;
  created: (roomId: string) => void;
  joined: (roomId: string, failed?: boolean) => void;
  user_draw: (move: Move, userId: string) => void;
  user_undo(userId: string): void;
  mouse_moved: (x: number, y: number, userId: string) => void;
  new_user: (user_Id: string, username: string) => void;
  user_disconnected: (userId: string) => void;
}

interface ClientToServerEvents {
  create_room: (username: string) => void;
  check_room: (roomId: string) => void;
  draw: (moves: Move) => void;
  mouse_move: (x: number, y: number) => void;
  undo: () => void;
  join_room: (room: string, username: string) => void;
  joined_room: () => void;
  leave_room: () => void;
  send_msg: (msg: string) => void;
}
