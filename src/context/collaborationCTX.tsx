import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../lib/socket";
import { useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";

export type Action =
  | { type: "SET_ROOM_ID"; payload: string | null }
  | { type: "SET_USERS"; payload: RoomUser[] }
  | { type: "SET_MESSAGES"; payload: RoomMessage[] }
  | { type: "ADD_MESSAGE"; payload: RoomMessage }
  | { type: "SET_CURSORS"; payload: { [userId: string]: RoomCursor } }
  | { type: "UPDATE_CURSOR"; payload: { userId: string; cursor: RoomCursor } }
  | { type: "USER_LEFT"; payload: string }
  | { type: "RESET" };

const initialState: CurrentRoomState = {
  roomId: null,
  users: [],
  messages: [],
  cursors: {},
};

const reducer = (state: CurrentRoomState, action: Action): CurrentRoomState => {
  switch (action.type) {
    case "SET_ROOM_ID":
      return { ...state, roomId: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_CURSORS":
      return { ...state, cursors: action.payload };
    case "UPDATE_CURSOR":
      return {
        ...state,
        cursors: {
          ...state.cursors,
          [action.payload.userId]: action.payload.cursor,
        },
      };
    case "USER_LEFT":
      const newCursors = { ...state.cursors };
      delete newCursors[action.payload];
      return { ...state, cursors: newCursors };
    case "RESET":
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
    }
  | undefined
>(undefined);

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [curUser, setCurUser] = useState<RoomUser | null>(null);

  useEffect(() => {
    socket.on("room_users", (usersFromServer: RoomUser[]) => {
      dispatch({ type: "SET_USERS", payload: usersFromServer });
    });
    socket.on("room_messages", (messagesFromServer: RoomMessage[]) => {
      dispatch({ type: "SET_MESSAGES", payload: messagesFromServer });
    });
    socket.on("new_message", (messageFromServer: RoomMessage) => {
      dispatch({ type: "ADD_MESSAGE", payload: messageFromServer });
    });

    socket.on(
      "update_cursor",
      ({ userId, cursor }: { userId: string; cursor: RoomCursor }) => {
        dispatch({ type: "UPDATE_CURSOR", payload: { userId, cursor } });
      }
    );

    socket.on("room_cursors", (cursors: { [userId: string]: RoomCursor }) => {
      dispatch({ type: "SET_CURSORS", payload: cursors });
    });

    socket.on("user_left", (userId: string) => {
      dispatch({ type: "USER_LEFT", payload: userId });
    });

    socket.on("room_closed", () => {
      dispatch({ type: "RESET" });
    });
    return () => {
      socket.off("room_users");
      socket.off("room_messages");
      socket.off("new_message");
      socket.off("update_cursor");
      socket.off("room_cursors");
      socket.off("user_left");
      socket.off("room_closed");
    };
  }, []);

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     if (state.roomId) {
  //       const curCursor = {
  //         roomId: state.roomId,
  //         userId: curUser?.id,
  //         x: e.clientX,
  //         y: e.clientY,
  //         name: curUser?.name,
  //       };
  //       socket.emit("update_cursor", curCursor);
  //     }
  //   };
  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, [state.roomId, curUser]);

  useEffect(() => {
    if (user) {
      const loggedUser = {
        id: user.id,
        name: user.fullName || "",
        loggedIn: true,
      };
      localStorage.setItem("curUser", JSON.stringify(loggedUser));
      setCurUser(loggedUser);
    } else {
      const storedCurUser = localStorage.getItem("curUser");
      if (storedCurUser) {
        setCurUser(JSON.parse(storedCurUser));
      } else {
        const newCurUser: RoomUser = {
          id: "user_" + uuidv4(),
          name: `Guest_${uuidv4().slice(0, 10)}`,
          loggedIn: false,
        };
        localStorage.setItem("curUser", JSON.stringify(newCurUser));
        setCurUser(newCurUser);
      }
    }
  }, [user]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.hash.replace("#", ""));
    const room = searchParams.get("room");
    if (room) {
      dispatch({ type: "SET_ROOM_ID", payload: room });
      if (curUser) {
        console.log("user: ", curUser?.name);
        joinCollaboration(room);
      }
    }
  }, [location, curUser]);

  const joinCollaboration = (roomId: string) => {
    if (curUser?.name) {
      socket.emit("join_room", { roomId, user: curUser });
    } else {
      console.log("no user found");
    }
  };
  const startCollaboration = () => {
    if (curUser) {
      const newRoomId = "Room_" + uuidv4();
      navigate(`#room=${newRoomId}`);
      dispatch({ type: "SET_ROOM_ID", payload: newRoomId });
      // socket.connect();
      socket.emit("create_room", { roomId: newRoomId, user: curUser });
    }
  };

  const leaveCollaboration = () => {
    if (state.roomId) {
      if (state.users.length < 2) {
        socket.emit("close_room", state.roomId);
      } else {
        socket.emit("leave_room", {
          roomId: state.roomId,
          user: curUser,
        });
      }
      // socket.disconnect();
      dispatch({ type: "RESET" });
      navigate("/");
    }
  };

  const sendMessage = (message: string) => {
    if (state.roomId) {
      socket.emit("send_message", {
        roomId: state.roomId,
        user: curUser?.name,
        message,
      });
    }
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (state.roomId) {
      const curCursor = {
        roomId: state.roomId,
        userId: curUser?.id,
        x: e.clientX,
        y: e.clientY,
        name: curUser?.name,
      };
      console.log("cursor: ", curCursor.x, ", " + curCursor.y);
      socket.emit("update_cursor", curCursor);
    }
  };
  return (
    <CollaborationContext.Provider
      value={{
        state,
        dispatch,
        curUser,
        startCollaboration,
        sendMessage,
        leaveCollaboration,
        handleMouseMove,
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
      "useCollaboration must be used within a CollaborationProvider"
    );
  }
  return context;
};
