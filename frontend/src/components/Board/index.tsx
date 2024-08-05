import { Eraser, Pencil } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useCollaboration } from '@/context/collaborationCTX';
import { v4 } from 'uuid';
import { cn } from '@/lib/utils';

interface DrawingBoardProps {
  // roomId: string;
}

const DrawingBoard: React.FC<DrawingBoardProps> = ({}) => {
  const { socket, state, dispatch, curUser } = useCollaboration();
  const isDrawing = useRef(false);
  const [tool, setTool] = useState('brush');
  const stageRef = useRef<any>(null);
  const currentStroke = useRef<any>(null);

  useEffect(() => {
    if (state.roomId) {
      socket.emit('get_brush_lines', state.roomId);
      socket.on('draw_brush_lines', (linesFromServer: any[]) => {
        if (linesFromServer.length < state.lines.length) {
          socket.emit('set_brush_lines', state.roomId, state.lines);
        } else {
          dispatch({ type: 'SET_LINES', payload: linesFromServer });
          // setLines(lines);
        }
      });

      socket.on('new_brush_line', (line: any) => {
        dispatch({ type: 'ADD_LINE', payload: line });
        // setLines((prevLines) => [...prevLines, line]);
      });

      socket.on('update_existing_brush_path', (lineId, position) => {
        dispatch({ type: 'UPDATE_LINE_PATH', payload: { lineId, position } });
        // setLines((prevLines) => {
        //   prevLines.map((line) => {
        //     if (line.id === lineId) {
        //       line.points = [...line.points, position.x, position.y];
        //     }
        //     return line;
        //   });
        //   return prevLines;
        // });
      });
      return () => {
        socket.off('draw_brush_lines');
        socket.off('new_brush_line');
        socket.off('update_brush_line_path');
      };
    }
  }, [state.roomId]);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const id = v4();
    if (pos) {
      const newLine = {
        id,
        points: [pos.x, pos.y],
        stroke: '#DD4132',
        fill: '#DD4132',
        strokeWidth: 7,
        name: 'brush',
        tension: 0.2,
        globalCompositeOperation:
          tool === 'brush' ? 'source-over' : 'destination-out',
      };
      currentStroke.current = id;
      if (state.roomId) {
        socket.emit('new_brush_line', state.roomId, newLine);
      } else {
        dispatch({ type: 'ADD_LINE', payload: newLine });
        // setLines((prevLines) => [...prevLines, newLine]);
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const position = stage.getPointerPosition();
    // console.log('before dispatch position', position);
    if (state.roomId) {
      socket.emit(
        'update_brush_line_path',
        state.roomId,
        currentStroke.current,
        position,
      );
    } else {
      dispatch({
        type: 'UPDATE_LINE_PATH',
        payload: { lineId: currentStroke.current, position },
      });

      // setLines((lines) =>
      //   lines.map((line) => {
      //     if (line.id === currentStroke.current) {
      //       return {
      //         ...line,
      //         points: [...line.points, position.x, position.y],
      //       };
      //     }
      //     return line;
      //   }),
      // );
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    currentStroke.current = null;
    // console.log('lines', state.lines);s
    // socket.emit('new_line', {
    //   roomId: state.roomId,
    //   line: lines[lines.length - 1],
    // });
  };

  return (
    <div
      style={{
        cursor:
          tool === 'brush'
            ? 'url(/pencil.svg) 0 19, auto'
            : 'url(/eraser.svg) 4 8, auto',
      }}
    >

      <div className=" cursor-default absolute top-0 left-[50%] z-10 bg-gray-400 rounded shadow shadow-amber-700 mt-1 flex flex-row gap-1 items-center justify-center overflow-hidden">
        <Pencil className={cn("w-7 h-7 p-2",tool==='brush'&& "bg-gray-900 text-white p-2" )} onClick={() => setTool('brush')} />
        <Eraser className={cn("w-7 h-7 p-2",
          tool==='eraser' && "bg-gray-900 text-white "
        )} onClick={() => setTool('eraser')} />
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {state.lines.map((line, i) => (
            <Line key={line.id} {...line} lineCap="round" lineJoin="round" />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawingBoard;
