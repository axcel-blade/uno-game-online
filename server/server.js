const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Allow connections from any origin (for local development)
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Store player data
let players = {};

// Utility to create a full UNO deck
const fullDeck = () => {
    const colors = ["red", "green", "blue", "yellow"];
    const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "skip", "reverse", "draw2"];
    const wilds = ["wild", "wild_draw4"];
    let deck = [];

    colors.forEach((color) => {
        values.forEach((value) => {
        deck.push(`${color}_${value}`);
        if (value !== "0") deck.push(`${color}_${value}`); // Each twice except 0
        });
    });

    wilds.forEach((wild) => {
        for (let i = 0; i < 4; i++) deck.push(wild);
    });

    return deck;
    };

    // Simple shuffle
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    // Socket.IO connection
    io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);
    players[socket.id] = { id: socket.id, hand: [] };

    io.emit("players", players);

    // 💥 Handle Start Game
    socket.on("startGame", () => {
        console.log("Starting game...");

        let deck = shuffle(fullDeck());

        Object.keys(players).forEach((id) => {
        players[id].hand = deck.splice(0, 7);
        });

        io.emit("players", players); // Send updated hands to all players
    });

    // 💥 Handle Card Play
    socket.on("playCard", ({ card, player }) => {
        console.log(`${player} played ${card}`);
        io.emit("cardPlayed", { card, player });
    });

    // 💥 Handle Disconnect
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit("players", players);
    });
    });

    // Start server
    const PORT = 4000;
    server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
