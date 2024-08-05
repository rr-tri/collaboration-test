const { Server } = require("socket.io");
const logger = require("./logger.cjs");

let rooms = {};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://collaboration-demo.onrender.com",
      ],
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
          lines: [],
        };
      }

      // join room if present
      if (user) {
        const checkUsr = rooms[roomId].users.find((usr) => usr.id === user.id);
        if (!checkUsr) {
          rooms[roomId].users.push(user);
        }
        socket.join(roomId);

        io.to(roomId).emit("user_joined", user);
        io.to(roomId).emit("room_users", rooms[roomId].users);
        io.to(roomId).emit("room_messages", rooms[roomId].messages);
        // io.to(roomId).emit("get_brush_lines", roomId);
      } else {
        logger.info("user is null");
      }
    };
    socket.on("update_user_name", ({ user, roomId }) => {
      if (rooms[roomId]) {
        rooms[roomId].users = rooms[roomId].users.map((usr) => {
          if (usr.id === user.id) {
            usr.name = user.name;
          }
          return usr;
        });
        io.to(roomId).emit("room_users", rooms[roomId].users);
        logger.info("user name updated");
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
        io.to(roomId).emit("user_left", user);
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

    socket.on("set_brush_lines", (roomId, lines) => {
      // logger.info("----fetching the brush strokes------");
      rooms[roomId].lines = lines;
      io.to(roomId).emit("draw_brush_lines", rooms[roomId].lines);
      // logger.info("----fetched the brush strokes------");
    });
    
    socket.on("get_brush_lines", (roomId) => {
      // logger.info("----fetching the brush strokes------");
      if (rooms[roomId]) {
        if (rooms[roomId].lines) {
          io.to(roomId).emit("draw_brush_lines", rooms[roomId].lines);
        }
      }
      logger.info("----fetched the brush strokes------");
    });
    socket.on("new_brush_line", (roomId, line) => {
      if (rooms[roomId]) {
        rooms[roomId].lines.push(line);
        io.to(roomId).emit("new_brush_line", line);
      }
    });
    socket.on("update_brush_line_path", (roomId, lineId, position) => {
      if (rooms[roomId]) {
        rooms[roomId].lines.map((line) => {
          if (line.id === lineId) {
            line.points = [...line.points, position.x, position.y];
          }
          return line;
        });
        io.to(roomId).emit("update_existing_brush_path", lineId, position);
      }
    });

    // socket.on("update_cursor", (data) => {
    //   const { roomId, userId, x, y, name } = data;
    //   if (rooms[roomId]) {
    //     io.to(roomId).emit("update_cursor", { userId, x, y, name });
    //   }
    // });

    socket.on("disconnect", () => {
      logger.info("client on socket", socket.id, " disconnected");
    });
  });
};
module.exports = initSocket;
