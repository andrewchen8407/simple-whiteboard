import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Whiteboard: React.FC = () => {
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef(false);

  useEffect(() => {
    socket.on('drawing-data', (data: any) => {
      setLines(data);
    });
  }, []);

  const handleMouseDown = () => {
    isDrawing.current = true;
    const newLine = { points: [] };
    setLines([...lines, newLine]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
    socket.emit('drawing-data', lines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#df4b26"
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation="source-over"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Whiteboard;
