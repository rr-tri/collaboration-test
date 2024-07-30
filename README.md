# Collaboration App

This is a React and Socket.IO-based collaboration app. Users can start and stop collaboration sessions, send messages, and see the mouse pointers of other users in real-time. The app supports generating unique usernames for guests and integrates with Clerk for authentication.

## Features

- **Start and Stop Collaboration**: Create a room and share a link to invite others to join.
- **Real-time Messaging**: Send and receive messages within the room.
- **Mouse Pointers**: See the mouse pointers of other users in the room with their names.
- **Unique Guest Names**: Generate unique names for guests in incognito mode.
- **Authentication**: Integrates with Clerk for user authentication.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.IO
- **Authentication**: Clerk

## Setup

### Prerequisites

- Node.js and npm installed
- Clerk account (for authentication)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/rr-tri/collaboration-test.git
cd collaboration-test
```

2. **Install dependencies:**

```bash
cd ./frontend && npm install && cd .. && cd./server && npm install

```

3. **Set up Clerk:**

   Follow the instructions on the [Clerk documentation](https://docs.clerk.dev/) to set up Clerk for your app. Update your Clerk frontend API key in the `.env` file.

### Running the App

At the root directory of the project run the followiing command of your choice:

1. **Start the Vite development server and socket.io development server:**

```bash
cd ./server && npm run dev && cd .. && cd ./frontend && npm run dev
```

2. **Start the the app (production):**

```bash
cd ./frontend && npm run build && cd .. && cd./server && npm start
```

### Context and State Management

The `CollaborationContext` is used to manage the state of the collaboration session. It uses a reducer to handle state changes.

### Socket.IO Events

The app communicates with the server using the following Socket.IO events:

- `create_room`: Create a new room.
- `join_room`: Join an existing room.
- `close_room`: Close a room.
- `leave_room`: Leave a room.
- `send_message`: Send a message to the room.
- `update_cursor`: Update the user's cursor position.
- `room_users`: Receive the list of users in the room.
- `room_messages`: Receive the list of messages in the room.
- `new_message`: Receive a new message.
- `room_cursors`: Receive the cursors of users in the room.
- `room_closed`: Notify that the room has been closed.
- `user_left`: Notify that a user has left the room.

### Usage

1. **Starting a Collaboration:**

   Click the "Start Collaboration" button to create a new room. The URL will change to include the room ID. Share this URL with others to invite them to join.

2. **Joining a Collaboration:**

   Open the shared URL to join the room. If you are logged in, your username will be used. Otherwise, a unique guest name will be generated.

3. **Sending Messages:**

   Type a message in the input box and click "Send" to send a message to the room.

4. **Viewing Cursors:**

   Move your mouse to see your cursor on the screen. Other users' cursors will also be visible with their names.

5. **Stopping a Collaboration:**

   Click the "Stop Collaboration" button to close the room and remove all users.

6. **Leaving a Collaboration:**

   Click the "Leave Collaboration" button to leave the room.
