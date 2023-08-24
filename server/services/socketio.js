const { Server } = require('socket.io');

// Define a Socket.io server using the provided HTTP server instance.
const socketServer = (server) => {
    // Objects to store information about chat rooms and users.
    let rooms = {}
    let users = {}
 
    // Initialize and configure the Socket.io server.
    const io = new Server(server, {
        cors: {
            origin: '*',          // Allow connections from all origins.
            methods: ['GET', "POST"] // Allow specified HTTP methods.
        }
    });

    // Event handler for a new client connection.
    io.on('connection', (socket) => {

        // Event handler for a client joining a chat room.
        socket.on('join', (user) => {
            const room = user.room;
            socket.join(room);
            users[socket.id] = { ...user };
            delete user.room;
            rooms[room] = !rooms[room] ? 
                        { [socket.id]: user } :
                        { ...rooms[room], [socket.id]: user };
            
            // Notify all users in the room about the updated list of users.
            const roomUsers = rooms[room];            
            for (let user in roomUsers) {
                io.to(user).emit('users', roomUsers);
            }
        });

        // Event handler for receiving a message from a client.
        socket.on('message', ({ data, aesKey }) => {
            // Broadcast the message to all users in the room with their encrypted AES keys.
            for (let userId in aesKey) {
                io.to(userId).emit('message', { data, 'aesKey': aesKey[userId] });
            }
        });

        // Event handler for a client disconnecting.
        socket.on('disconnect', () => {
            const room = users[socket.id]?.room;
            delete users[socket.id];
            delete rooms[room]?.[socket.id];
            const roomUsers = rooms[room];            
            for (let user in roomUsers) {
                // Notify remaining users in the room about the updated list of users.
                io.to(user).emit('users', roomUsers);
            }
        });

        // Event handler for a client logging out.
        socket.on('logout', () => {
            // Disconnect the client.
            socket.disconnect();
        });
    });
}

module.exports = socketServer;
