import React from "react";

export default function Labels({ data }) {
  return (
    <main className="pr-1 h-32 overflow-y-scroll">
      {data.labels
        .sort((a, b) => b - a)
        .map((label, index) => (
          <LabelComponent
            key={label}
            name={label}
            color={data.colors[index]}
            percent={data.values[index]}
          />
        ))}
    </main>
  );
}

function LabelComponent({ name, color, percent }) {
  return (
    <div className="labels flex justify-between">
      <div className="flex items-center gap-2">
        <mark
          className="w-3 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3>{name}</h3>
      </div>
      <h3>{ } {percent}%</h3>
    </div>
  );
}
