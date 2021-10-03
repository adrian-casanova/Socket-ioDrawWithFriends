import React, { useContext, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import { getDistance } from '../../../../utils';
import { SessionContext } from '../../../../contextStore.js';
import { io } from 'socket.io-client';

const useStyles = makeStyles(theme => ({
  canvas: {
    border: '1px solid black',
    marginTop: theme.spacing(2),
  },
}));

const PIXEL_SIZE = 1;

function DrawingPad() {
  const classes = useStyles();
  const canvasRef = useRef(null);
  const drawingPoints = useRef([]);
  const lastPointDrawn = useRef(null);
  const movingMouse = useRef(false);

  const socketRef = useRef(null);

  const { currentSession } = useContext(SessionContext);
  console.log('currentSessiona: ', currentSession);

  function joinRoom() {
    const socket = io('http://localhost:3005?room=' + currentSession.sessionId);
    if (currentSession.canvas) {
      renderCanvas(currentSession.canvas);
    }
    socket.on('point_drawn', e => {
      console.log('pointDrawn: ', e);
      renderPoint(e);
    });
    socket.on('connect', () => {
      socketRef.current = socket;
    });

    socket.on('disconnect', () => {
      console.log(socket.id); // undefined
    });
  }

  useEffect(() => {
    joinRoom();
  }, []);

  function renderCanvas(data) {
    const ctx = canvasRef.current.getContext('2d');
    for (let i = 0; i < data.length; i++) {
      const points = data[i];
      ctx.rect(points[0], points[1], PIXEL_SIZE, PIXEL_SIZE);
      ctx.fill();
    }
  }

  function curveBetweenPoints(point) {
    const x1 = lastPointDrawn.current[0];
    const y1 = lastPointDrawn.current[1];
    const x2 = point[0];
    const y2 = point[1];
    var ang1 = 350;
    var ang2 = 350;

    const ctx = canvasRef.current.getContext('2d');

    const len = Math.hypot(x2 - x1, y2 - y1);
    const ax1 = Math.cos(ang1) * len * (1 / 3);
    const ay1 = Math.sin(ang1) * len * (1 / 3);

    const ax2 = Math.cos(ang2) * len * (1 / 3);
    const ay2 = Math.sin(ang2) * len * (1 / 3);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1 + ax1, y1 + ay1, x2 - ax1, y2 - ay2, x2, y2);
    ctx.stroke();
  }
  function renderPoint(point) {
    console.log('renderingPoint: ', point);
    const ctx = canvasRef.current.getContext('2d');

    if (lastPointDrawn.current && movingMouse.current) {
      curveBetweenPoints(point);
    }
    ctx.rect(point[0], point[1], PIXEL_SIZE, PIXEL_SIZE);
    ctx.fill();
    lastPointDrawn.current = point;
  }

  function addPoint(x, y) {
    const point = [x, y];
    socketRef.current.emit('point_drawn', point);
    renderPoint(point);
    //drawingPoints.current.push(point);
  }

  function onCanvasMouseDown(e) {
    const { offsetX, offsetY } = e;
    canvasRef.current.addEventListener('mousemove', onCanvasMouseMove);
    addPoint(offsetX, offsetY);
  }

  function onCanvasMouseUp(e) {
    movingMouse.current = false;
    const { offsetX, offsetY } = e;
    canvasRef.current.removeEventListener('mousemove', onCanvasMouseMove);
    addPoint(offsetX, offsetY);
  }

  function onCanvasMouseMove(e) {
    const { offsetX, offsetY } = e;
    movingMouse.current = true;
    addPoint(offsetX, offsetY);
  }

  function initHandlers() {
    canvasRef.current.addEventListener('mousedown', onCanvasMouseDown);
    canvasRef.current.addEventListener('mouseup', onCanvasMouseUp);
  }

  useEffect(() => {
    initHandlers();
  }, []);

  return (
    <React.Fragment>
      <canvas
        ref={canvasRef}
        className={classes.canvas}
        height={400}
        width={600}
        id="canvas"
      />
    </React.Fragment>
  );
}

export default DrawingPad;
