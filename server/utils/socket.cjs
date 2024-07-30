const { Server } = require("socket.io");
const logger = require("./logger.cjs");

let rooms = {};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:80"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info("client connected on socket: ", socket.id);
    logger.info("socket rooms on connection= ", socket.rooms);

    const createOrJoinRoom = (roomId, user) => {
      // create room if not present
      if (!rooms[roomId]) {
        rooms[roomId] = {
          users: [],
          messages: [],
          cursors: {},
        };
      }
      // join room if present
      if (user) {
        const checkUsr = rooms[roomId].users.find((usr) => usr.id === user.id);
        if (!checkUsr) {
          rooms[roomId].users.push(user);
        }
        socket.join(roomId);
        io.to(roomId).emit("room_users", rooms[roomId].users);
        io.to(roomId).emit("room_messages", rooms[roomId].messages);
      } else {
        logger.info("user is null");
      }
    };

    socket.on("update_user_data", ({ prev, cur, roomId }) => {
      if (rooms[roomId]) {
        // logger.info("users", rooms[roomId].users);
        // logger.info("prev user: ", prev);
        // logger.info("current user: ", cur);
        if (cur.loggedIn) {
          if (!rooms[roomId].users.find((usr) => usr.id === cur.id)) {
            const newUsers = rooms[roomId].users.filter(
              (usr) => usr.id !== prev.id
            );
            newUsers.push(cur);
            rooms[roomId].users = newUsers;
            io.to(roomId).emit("room_users", rooms[roomId].users);
          } else {
            const newUsers = rooms[roomId].users.filter(
              (usr) => usr.id !== prev.id
            );
            rooms[roomId].users = newUsers;
            io.to(roomId).emit("room_users", rooms[roomId].users);
            // logger.info("current user exists already");
          }
          logger.info("user detail updated");
        }
        // logger.info("socket.rooms= ", socket.rooms);
        // logger.info("users= ", rooms[roomId].users);
      }
    });

    socket.on("create_room", ({ roomId, user }) => {
      logger.info("--------------create-------------------------");
      createOrJoinRoom(roomId, user);
      logger.info(`Room ${roomId.slice(0, 10)} created by ${user.name}`);
      // logger.info("after room creation: rooms=", rooms);
      // logger.info("socket.rooms= ", socket.rooms);
      logger.info("---------------------------------------");
    });

    socket.on("join_room", (data) => {
      const { roomId, user } = data;
      logger.info("-------------------join--------------------");
      logger.info("before: room exists on socket", socket.rooms.has(roomId));
      createOrJoinRoom(roomId, user);
      logger.info("after: room exists on socket", socket.rooms.has(roomId));
      logger.info(`${user.name} joined room ${roomId.slice(0, 10)}`);
      // logger.info("after room exists on socket room: rooms=", rooms);
      // logger.info("socket.rooms= ", socket.rooms);
      logger.info("---------------------------------------");
    });

    socket.on("leave_room", (data) => {
      const { roomId, user } = data;
      if (rooms[roomId]) {
        rooms[roomId].users = rooms[roomId].users.filter(
          (u) => u.id !== user.id
        );
        delete rooms[roomId].cursors[user.id];
        socket.leave(roomId);
        io.to(roomId).emit("room_users", rooms[roomId].users);
        io.to(roomId).emit("user_left", user.id);
        logger.info(`${user.name} left room ${roomId.slice(0, 10)}`);
      }
      // logger.info("after leaving room: rooms=", rooms);
      logger.info("socket rooms on leave room= ", socket.rooms);
    });

    socket.on("close_room", (roomId) => {
      if (rooms[roomId]) {
        delete rooms[roomId];
        socket.leave(roomId);
        io.to(roomId).emit("room_closed");
        logger.info(`Room ${roomId.slice(0, 10)} closed`);
      }
      // logger.info("after closing room: rooms=", rooms);
      logger.info("socket rooms on close room= ", socket.rooms);
    });

    socket.on("send_message", (data) => {
      const { roomId, user, message } = data;
      if (rooms[roomId]) {
        const newMessage = { user, message };
        rooms[roomId].messages.push(newMessage);
        io.to(roomId).emit("new_message", newMessage);
      }
      // logger.info("after closing room: rooms=", rooms);
      // logger.info("socket.rooms= ", socket.rooms);
    });

    socket.on("update_cursor", (data) => {
      const { roomId, userId, x, y, name } = data;
      if (rooms[roomId]) {
        rooms[roomId].cursors[userId] = { x, y, name };
        io.to(roomId).emit("update_cursor", { userId, cursor: { x, y, name } });
        // logger.info("cursors: ", rooms[roomId].cursors[userId]);
      }
    });

    socket.on("disconnect", () => {
      logger.info("client on socket", socket.id, " disconnected");
    });
  });
};
module.exports = initSocket;
