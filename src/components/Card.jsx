import React from "react";

export default function Card({ card, onClick }) {
  return (
    <img
      src={`/uno-cards/${card}.png`}
      alt={card}
      style={{ width: "80px", margin: "5px", cursor: "pointer" }}
      onClick={onClick}
    />
  );
}