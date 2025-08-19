# Building the Play Routine component

1. Static page with no behaviour or logic etc
2. Link to backend to fill fields with axios

## 1. Static page with no behaviour or logic etc
A static layout that matches the design: title -> card (task name, 1/3, big play) -> “Finished Task Early” → “Next Task” pill.

```js
// frontend/src/components/routine-player/PlayRoutine.jsx
import React from "react";
//import "./PlayRoutine.css"; // optional; you can add styles later

function PlayRoutine() {

  return (
    <section className="player">
      {/* Page title */}
      <h1 className="player__title">Morning Routine</h1>

      {/* Task card */}
      <div className="player__card">
        {/* Current task name */}
        <div className="player__task-name">Breakfast</div>

        {/* Position in routine */}
        <div className="player__progress">1/3</div>

        {/* Big play button (purely visual for now) */}
        <button className="player__play" aria-label="Start task" type="button">
          ▶
        </button>
      </div>

      {/* Finished early pill button (no handler yet) */}
      <button className="player__early" type="button">
        Finished Task Early
      </button>

      {/* Next task preview */}
      <div className="player__next">
        <div className="player__next-label">Next Task</div>

        <div className="player__next-pill">
          <span className="player__next-index">2</span>
          <span className="player__next-name">Shower</span>
          <span className="player__next-time">00:30</span>
        </div>
      </div>
    </section>
  );
}

export default PlayRoutine
```

## 2. Link to backend to fill fields with axios
```js
// frontend/src/api/routines.js
import { api } from "./client";

// GET /routine-player?routine_id=123  → { routine, tasks: [...] }
export async function getRoutinePlayer(routine_id) {
  const res = await api.get("/routine-player", { params: { routine_id } });
  return res.data; // { routine, tasks }
}
```
```js
// frontend/src/api/routines.js
import { api } from "./client";

// GET /routine-player?routine_id=123  → { routine, tasks: [...] }
export async function getRoutinePlayer(routine_id) {
  const res = await api.get("/routine-player", { params: { routine_id } });
  return res.data; // { routine, tasks }
}
```
### Add to basic component

### 2.1 - Wire up the routineName
```js
// frontend/src/components/routine-player/PlayRoutine.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";      // reads :id from the URL
import { getRoutinePlayer } from "../../api/routines";
//import "./PlayRoutine.css";

export default function PlayRoutine() {
  const { id } = useParams(); // expect route like /routines/play/42
  const [routineName, setRoutineName] = useState("…");  // routineName text

  useEffect(() => {
    (async () => {
      // call your backend: GET /routine-player?routine_id=:id
      const data = await getRoutinePlayer(Number(id));
      setRoutineName(data.routine.routine_name);   // <-- put DB value into title state
    })();
  }, [id]);

  return (
    <section className="player">
      {/* ONLY this is dynamic right now */}
      <h1 className="player__title">{routineName}</h1> 
```

### 2.2 - Wire up the taskName
```js
// frontend/src/components/routine-player/PlayRoutine.jsx
// frontend/src/components/routine-player/PlayRoutine.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";      // reads :id from the URL
import { getRoutinePlayer } from "../../api/routines";
//import "./PlayRoutine.css";

export default function PlayRoutine() {
  const { id } = useParams();  // expect route like /routines/play/42
  const [routineName, setRoutineName] = useState("…"); // routine name
  const [taskName, setTaskName] = useState("…");   // NEW: current task name

  useEffect(() => {
    (async () => {
      // call your backend: GET /routine-player?routine_id=:id
      const data = await getRoutinePlayer(Number(id));
      // Routine name
      setRoutineName(data.routine.routine_name); // <-- put DB value into routineName state
      // current task name from the first task in the ordered list
      const firstTask = data.tasks?.[0]; // task array index 0 (the first one in the array)
      setTaskName(firstTask ? firstTask.task_text : "—"); // set as 1st task as the task text
    })();
  }, [id]);

  return (
    <section className="player">
      {/* ONLY this is dynamic right now */}
      <h1 className="player__title">{routineName}</h1>

      {/* Everything below stays static for now */}
      <div className="player__card">
        <div className="player__task-name">{taskName}</div> {/*feed in task name*/}
```

### 2.3 wire in `player_progress`
```js
// frontend/src/components/routine-player/PlayRoutine.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";      // reads :id from the URL
import { getRoutinePlayer } from "../../api/routines";
//import "./PlayRoutine.css";

export default function PlayRoutine() {
  const { id } = useParams();  // expect route like /routines/play/42
  const [routineName, setRoutineName] = useState("…"); // routine name
  const [taskName, setTaskName] = useState("…");   //current task name
  // NEW: simple text for progress like "1/3" (or "—" if unknown)
  const [progress, setProgress] = useState("—"); //holds the text we’ll show in the progress area (fallback “—” if no tasks).

  useEffect(() => {
    (async () => {
      // call your backend: GET /routine-player?routine_id=:id
      const data = await getRoutinePlayer(Number(id));
      // Routine name
      setRoutineName(data.routine.routine_name); // <-- put DB value into routineName state
      // current task name from the first task in the ordered list
      const firstTask = data.tasks?.[0]; // task array index 0 (the first one in the array)
      setTaskName(firstTask ? firstTask.task_text : "—"); // set as 1st task as the task text
       // NEW: progress = "1 / total tasks (length of array)"
      const total = Array.isArray(data.tasks) ? data.tasks.length : 0; //ount tasks; if the API returns no tasks/undefined, total becomes 0
      setProgress(total ? `1/${total}` : "—"); // no behavior yet, so “current” is task #1. When we add behavior later, we’ll change this toindex + 1`.
    })();
  }, [id]);

  return (
    <section className="player">
      {/* ONLY this is dynamic right now */}
      <h1 className="player__title">{routineName}</h1>

      {/* Everything below stays static for now */}
      <div className="player__card">
        <div className="player__task-name">{taskName}</div>
        <div className="player__progress">{progress}</div>
```

### 2.4 wire player_play
Goal: keep the button disabled; just display the first task’s task_time (minutes) as MM:00.
```js
// frontend/src/components/routine-player/PlayRoutine.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";      // reads :id from the URL
import { getRoutinePlayer } from "../../api/routines";
//import "./PlayRoutine.css";

export default function PlayRoutine() {
  const { id } = useParams();  // expect route like /routines/play/42
  const [routineName, setRoutineName] = useState("…"); // routine name
  const [taskName, setTaskName] = useState("…");   //current task name
    // simple text for progress like "1/3" (or "—" if unknown)
  const [progress, setProgress] = useState("—"); //holds the text we’ll show in the progress area (fallback “—” if no tasks).
  // NEW: text we render inside the big play button (MM:00)
  const [timeText, setTimeText] = useState("--:--");

  useEffect(() => {
    (async () => {
      // call your backend: GET /routine-player?routine_id=:id
      const data = await getRoutinePlayer(Number(id));
      // Routine name
      setRoutineName(data.routine.routine_name); // <-- put DB value into routineName state
      // current task name from the first task in the ordered list
      const firstTask = data.tasks?.[0]; // task array index 0 (the first one in the array)
      setTaskName(firstTask ? firstTask.task_text : "—"); // set as 1st task as the task text
       // NEW: progress = "1 / total tasks (length of array)"
      const total = Array.isArray(data.tasks) ? data.tasks.length : 0; //ount tasks; if the API returns no tasks/undefined, total becomes 0
      setProgress(total ? `1/${total}` : "—"); // no behavior yet, so “current” is task #1. When we add behavior later, we’ll change this toindex + 1`.
       // NEW: read task_time (minutes) from the first task and format as MM:00
      const minutes = Number(firstTask?.task_time);
      setTimeText(Number.isFinite(minutes) && minutes >= 0
        ? `${String(minutes).padStart(2, "0")}:00`
        : "--:--"
      );
    })();
  }, [id]);

  return (
    <section className="player">
      {/* ONLY this is dynamic right now */}
      <h1 className="player__title">{routineName}</h1>

      {/* Everything below stays static for now */}
      <div className="player__card">
        <div className="player__task-name">{taskName}</div>
        <div className="player__progress">{progress}</div>
         {/* NEW: show the current task's time on the button, still disabled */}
        <button className="player__play" type="button" disabled>▶{timeText}</button>
      </div>

      <button className="player__early" type="button" disabled>
        Finished Task Early
      </button>

      <div className="player__next">
        <div className="player__next-label">Next Task</div>
        <div className="player__next-pill">
          <span className="player__next-index">2</span>
          <span className="player__next-name">Shower</span>
          <span className="player__next-time">00:30</span>
        </div>
      </div>
    </section>
  );
}
```

### 2.5 wire `player__next-index`
Goal: leave everything else as-is. Just replace the hard-coded 2 with the next task’s task_order from your API

-----------NOT FULLY UNDERSTOOD TO BE IMPLEMENTED
```js
// frontend/src/components/routine-player/PlayRoutine.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";      // reads :id from the URL
import { getRoutinePlayer } from "../../api/routines";
//import "./PlayRoutine.css";

export default function PlayRoutine() {
  const { id } = useParams();  // expect route like /routines/play/42
  const [routineName, setRoutineName] = useState("…"); // routine name
  const [taskName, setTaskName] = useState("…");   //current task name
    // simple text for progress like "1/3" (or "—" if unknown)
  const [progress, setProgress] = useState("—"); //holds the text we’ll show in the progress area (fallback “—” if no tasks).
  // text we render inside the big play button (MM:00)
  const [timeText, setTimeText] = useState("--:--");
  // NEW: text for the little index bubble in the Next Task pill
  const [nextIndex, setNextIndex] = useState("—");

  useEffect(() => {
    (async () => {
      // call your backend: GET /routine-player?routine_id=:id
      const data = await getRoutinePlayer(Number(id));
      // Routine name
      setRoutineName(data.routine.routine_name); // <-- put DB value into routineName state
      // current task name from the first task in the ordered list
      const firstTask = data.tasks?.[0]; // task array index 0 (the first one in the array)
      setTaskName(firstTask ? firstTask.task_text : "—"); // set as 1st task as the task text
       // NEW: progress = "1 / total tasks (length of array)"
      const total = Array.isArray(data.tasks) ? data.tasks.length : 0; //ount tasks; if the API returns no tasks/undefined, total becomes 0
      setProgress(total ? `1/${total}` : "—"); // no behavior yet, so “current” is task #1. When we add behavior later, we’ll change this toindex + 1`.
      // read task_time (minutes) from the first task and format as MM:00
      const minutes = Number(firstTask?.task_time);
      setTimeText(Number.isFinite(minutes) && minutes >= 0
        ? `${String(minutes).padStart(2, "0")}:00`
        : "--:--"
      );
      // NEW: get the second task (the “next” one) and use its task_order
      const secondTask = data.tasks?.[1]; // set index of second task
      setNextIndex(secondTask && Number.isFinite(Number(secondTask.task_order))
        ? String(secondTask.task_order)
        : "—"
      );
    })();
  }, [id]);

  return (
    <section className="player">
      {/* ONLY this is dynamic right now */}
      <h1 className="player__title">{routineName}</h1>

      {/* Everything below stays static for now */}
      <div className="player__card">
        <div className="player__task-name">{taskName}</div>
        <div className="player__progress">{progress}</div>
         {/* NEW: show the current task's time on the button, still disabled */}
        <button className="player__play" type="button" disabled>▶{timeText}</button>
      </div>

      <button className="player__early" type="button" disabled>
        Finished Task Early
      </button>

      <div className="player__next">
        <div className="player__next-label">Next Task</div>
        <div className="player__next-pill">
          {/* NEW: dynamic index from tasks[1].task_order */}
          <span className="player__next-index">{nextIndex}</span>
          <span className="player__next-name">Shower</span>
          <span className="player__next-time">00:30</span>
        </div>
      </div>
    </section>
  );
}
```

### 2.6 wire in next task
```js
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

  // NEW: next task name text
  const [nextName, setNextName] = useState("—");

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

      // NEW: pull the next task's name (or em dash)
      setNextName(secondTask?.task_text ?? "—");
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
        <div className="player__next-label">Next Task</div>
        <div className="player__next-pill">
          <span className="player__next-index">{nextIndex}</span>

          {/* NEW: dynamic next task name */}
          <span className="player__next-name">{nextName}</span>

          <span className="player__next-time">00:30</span>
        </div>
      </div>
    </section>
  );
}
```

### 2.7 wire in next task time
Goal: leave everything else as-is. Replace the hard-coded 00:30 with the second task’s task_time (minutes) formatted as MM:00. If there’s no next task, show --:--.
```js
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
```

---
# Completed component
```js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoutinePlayer } from "../../api/routines";

export default function PlayRoutine() {
  const { id } = useParams();

  // Data
  const [title, setTitle] = useState("…");
  const [tasks, setTasks] = useState([]);
  const [current, setCurrent] = useState(0);

  // Timer (simple: one object state, no refs)
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [running, setRunning] = useState(false);

  // Helpers
  const pad = (n) => String(n).padStart(2, "0");
  const minsFromTask = (task) => {
    const m = Number(task?.task_time);
    return Number.isFinite(m) && m >= 0 ? m : 0;
  };

  // 1) Load routine + tasks
  useEffect(() => {
    (async () => {
      const data = await getRoutinePlayer(Number(id));
      const arr = Array.isArray(data?.tasks) ? data.tasks : [];
      setTitle(data?.routine?.routine_name ?? "…");
      setTasks(arr);
      setCurrent(0);
    })();
  }, [id]);

  const total = tasks.length;
  const currentTask = tasks[current] || null;
  const nextTask = tasks[current + 1] || null;

  // 2) Reset timer whenever the current task changes
  useEffect(() => {
    const start = minsFromTask(currentTask);
    setTime({ min: start, sec: 0 });
    setRunning(false);
  }, [currentTask]); // covers both initial load and skips

  // 3) Countdown + auto-advance
  useEffect(() => {
    if (!running) return;
    const tid = setInterval(() => {
      setTime((prev) => {
        // already zero? stop & advance
        if (prev.min === 0 && prev.sec === 0) {
          clearInterval(tid);
          setRunning(false);
          setCurrent((i) => (i < total - 1 ? i + 1 : i));
          return prev;
        }
        // roll minute when sec hits 0
        if (prev.sec === 0) return { min: prev.min - 1, sec: 59 };
        return { min: prev.min, sec: prev.sec - 1 };
      });
    }, 1000);
    return () => clearInterval(tid);
  }, [running, total]);

  // Controls
  const togglePlay = () => {
    if (time.min === 0 && time.sec === 0) return;
    setRunning((r) => !r);
  };

  const skipToNext = () => {
    setRunning(false);
    setCurrent((i) => (i < total - 1 ? i + 1 : i));
  };

  return (
    <section className="player">
      {/* Routine name */}
      <h1 className="player__title">{title}</h1>

      {/* Current task + timer */}
      <div className="player__card">
        <div className="player__task-name">{currentTask?.task_text ?? "—"}</div>

        <div className="timer-section">
          <div className="player__play">
            <span>{pad(time.min)}</span>:<span>{pad(time.sec)}</span>
          </div>

          <button className="btn" onClick={togglePlay} disabled={time.min === 0 && time.sec === 0}>
            {running ? "Pause" : "Play"}
          </button>

          <button className="btn" onClick={skipToNext} disabled={!nextTask}>
            Skip
          </button>
        </div>
      </div>

      {/* Next task preview */}
      <div className="player__next">
        <div className="player__next-label">{nextTask ? "Next Task" : "All tasks complete"}</div>
        {nextTask && (
          <div className="player__next-pill">
            <span className="player__next-name">{nextTask.task_text}</span>
            <span className="player__next-time">
              {pad(Number(nextTask.task_time) || 0)}:00
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
```




