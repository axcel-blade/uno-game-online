import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import PlayerHand from "./PlayerHand";

export default function GameBoard() {
    const [hand, setHand] = useState([]);
    const [players, setPlayers] = useState({});
    const [playerId, setPlayerId] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
        setPlayerId(socket.id);
        });

        socket.on("players", (allPlayers) => {
        setPlayers(allPlayers);
        if (allPlayers[socket.id]) {
            setHand(allPlayers[socket.id].hand || []);
        }
        });

        socket.on("cardPlayed", ({ card, player }) => {
        console.log(`${player} played ${card}`);
        });

        return () => {
        socket.off("connect");
        socket.off("players");
        socket.off("cardPlayed");
        };
    }, []);

    const playCard = (card) => {
        socket.emit("playCard", { card, player: socket.id });
    };

    const startGame = () => {
        socket.emit("startGame");
    };

    return (
        <div>
        <h2>UNO Game</h2>
        <button onClick={startGame}>Start Game</button>
        <PlayerHand hand={hand} playCard={playCard} />
        <div>Connected Players: {Object.keys(players).length}</div>
        </div>
    );
}