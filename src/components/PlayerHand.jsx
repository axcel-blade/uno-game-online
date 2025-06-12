import React from "react";
import Card from "./Card";

export default function PlayerHand({ hand, playCard }) {
    return (
        <div>
        {hand.map((card, idx) => (
            <Card key={idx} card={card} onClick={() => playCard(card)} />
        ))}
        </div>
    );
}