// src/components/routine/RoutinePlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function RoutinePlayer() {
  const { id: routineId } = useParams();

  const [routineName, setRoutineName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [remaining, setRemaining] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // fetch data
  useEffect(() => {
    if (!routineId) return;
    fetch(`http://localhost:5000/routine-player?routine_id=${routineId}`)
      .then((res) => res.json())
      .then((json) => {
        setRoutineName(json?.routine?.routine_name || "");
        setTasks(json?.tasks || []);
        setCurrentIndex(0);
      });
  }, [routineId]);

  const currentTask = tasks[currentIndex] || null;
  const nextTask = tasks[currentIndex + 1] || null;

  // reset timer whenever the task changes
  useEffect(() => {
    const mins = currentTask ? parseInt(currentTask.task_time, 10) || 0 : 0;
    setRemaining(mins * 60);
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [currentTask]);

  // countdown + auto-advance on 0
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setIsRunning(false);
          // move to next task if any
          setCurrentIndex((i) => (i < tasks.length - 1 ? i + 1 : i));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, tasks.length]);

  const togglePlay = () => {
    if (remaining <= 0) return;
    setIsRunning((r) => !r);
  };

  const skipToNext = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentIndex((i) => (i < tasks.length - 1 ? i + 1 : i));
  };

  const fmt = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <main>
      <h1>{routineName || "Routine"}</h1>

      {currentTask && <h2>{currentTask.task_text}</h2>}

      <section aria-label="Timer">
        <div>Time left: {fmt(remaining)}</div>
        <button type="button" onClick={togglePlay} disabled={remaining === 0}>
          {isRunning ? "Pause" : "Play"}
        </button>{" "}
        <button type="button" onClick={skipToNext} disabled={!nextTask}>
          Skip to Next
        </button>
      </section>

      <section aria-label="Next task">
        <div>Next Task</div>
        {nextTask ? (
          <div>
            {nextTask.task_text} — {nextTask.task_time} min
          </div>
        ) : (
          <div>None</div>
        )}
      </section>
    </main>
  );
}
