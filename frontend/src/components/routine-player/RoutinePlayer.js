// frontend/src/components/routine-player/PlayRoutine.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoutinePlayer } from "../../api/routines";

export default function PlayRoutine() {
  const { id } = useParams();

  const [title, setTitle] = useState("…");
  const [taskName, setTaskName] = useState("…");
  const [progress, setProgress] = useState("—");
  const [timeText, setTimeText] = useState("--:--");
  const [nextIndex, setNextIndex] = useState("—");
  const [nextName, setNextName] = useState("—");

  // NEW: next task time text
  const [nextTime, setNextTime] = useState("--:--");

  useEffect(() => {
    (async () => {
      const data = await getRoutinePlayer(Number(id));

      setTitle(data.routine.routine_name);

      const firstTask = data.tasks?.[0];
      setTaskName(firstTask ? firstTask.task_text : "—");

      const total = Array.isArray(data.tasks) ? data.tasks.length : 0;
      setProgress(total ? `1/${total}` : "—");

      const minutes = Number(firstTask?.task_time);
      setTimeText(
        Number.isFinite(minutes) && minutes >= 0
          ? `${String(minutes).padStart(2, "0")}:00`
          : "--:--"
      );

      const secondTask = data.tasks?.[1];
      setNextIndex(
        secondTask && Number.isFinite(Number(secondTask.task_order))
          ? String(secondTask.task_order)
          : "—"
      );
      setNextName(secondTask?.task_text ?? "—");

      // NEW: format next task's time (minutes) as MM:00
      const nextMinutes = Number(secondTask?.task_time);
      setNextTime(
        Number.isFinite(nextMinutes) && nextMinutes >= 0
          ? `${String(nextMinutes).padStart(2, "0")}:00`
          : "--:--"
      );
    })();
  }, [id]);

  return (
    <section className="player">
      <h1 className="player__title">{title}</h1>

      <div className="player__card">
        <div className="player__task-name">{taskName}</div>
        <div className="player__progress">{progress}</div>
        <button className="player__play" type="button" disabled>
          {timeText}
        </button>
      </div>

      <button className="player__early" type="button" disabled>
        Finished Task Early
      </button>

      <div className="player__next">
        <div className="player__next-label">
          {nextName === "—" ? "All tasks complete" : "Next Task"}
        </div>
        <div className="player__next-pill">
          <span className="player__next-index">{nextIndex}</span>
          <span className="player__next-name">{nextName}</span>
          {/* NEW: dynamic next time */}
          <span className="player__next-time">{nextTime}</span>
        </div>
      </div>
    </section>
  );
}

