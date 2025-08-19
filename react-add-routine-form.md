STEP 0 (done): Static markup — routine name, one task (text + minutes + seconds), Add Task + Save buttons disabled.

STEP 1: Make routine_name a controlled input (state only).

STEP 2: Make the single task controlled (text/min/sec) with simple normalization on blur.

STEP 3: Switch to a tasks array + “Add Task” to append a blank row.

STEP 4: Live total time display next to the routine name.

STEP 5: Minimal submit that logs a local draft (still no API).

STEP 6: Add ability to remove task per row

---

## Step 0: Static markup
disabled buttons no behaviour
```js
function AddRoutineForm() {
  return (
    <>
      {/* Header Section */}
      <div className="container-fluid container-header">
        <section className="content-section content-section-title-description">
          <h2>Add a Routine</h2>
        </section>
      </div>

      <div className="">
        <form className="">
          {/* Routine Name */}
          <div className="row">
            <div className="">
              <label htmlFor="routine_name">Routine Name</label>
              <input
                id="routine_name"
                name="routine_name"
                minLength={3}
                maxLength={100}
                type="text"
                className="validate"
                required
                placeholder="e.g. Morning routine"
              />
              {/* Total will appear here later */}
              <small style={{ marginLeft: 8, opacity: 0.8 }}>
                Total: 0:00 (≈ 0 min)
              </small>
            </div>
          </div>

          {/* Add Tasks section */}
          <div className="">
            <div className="">
              <h5>Add tasks to your routine</h5>
            </div>
          </div>

          {/* Task list (static for now) */}
          <div id="add-tasks">
            <div className="row">
              <div
                className="input-field"
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}
              >
                {/* Task text */}
                <div>
                  <input
                    type="text"
                    id="task_1"
                    className="validate"
                    required
                    placeholder="Task 1"
                  />
                  <label htmlFor="task_1">Task 1</label>
                </div>

                {/* Minutes */}
                <div>
                  <label htmlFor="task_1_min">Minutes</label>
                  <input
                    type="number"
                    id="task_1_min"
                    className="validate"
                    inputMode="numeric"
                    min={0}
                    max={1440}
                    placeholder="0"
                  />
                </div>

                {/* Seconds */}
                <div>
                  <label htmlFor="task_1_sec">Seconds</label>
                  <input
                    type="number"
                    id="task_1_sec"
                    className="validate"
                    inputMode="numeric"
                    min={0}
                    max={59}
                    placeholder="00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add New Task Button (inert for now) */}
          <div className="row">
            <button type="button" id="add-task-btn" className="btn" disabled title="Will add behavior later">
              Add Task
            </button>
          </div>

          {/* Submit Button (inert for now) */}
          <div className="row">
            <div className="input-field">
              <button className="btn btn-primary" type="button" disabled title="Will add behavior later">
                Save (local)
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
export default function AddRoutineForm
```

# STEP 1: Make routine_name a controlled input (state only).
, only routine_name is now controlled with React state. Everything else remains static and disabled
```js
import { useState } from 'react';

// STEP 1 — Only routine_name is controlled (state). Everything else is static/inert.
export default function AddRoutineForm() {
  const [routineName, setRoutineName] = useState("");

  function handleNameChange(e) {
    setRoutineName(e.target.value);
  }

  return (
    <>
      {/* Header Section */}
      <div className="container-fluid container-header">
        <section className="content-section content-section-title-description">
          <h2>Add a Routine</h2>
        </section>
      </div>

      <div className="">
        <form className="">
          {/* Routine Name (controlled) */}
          <div className="row">
            <div className="">
              <label htmlFor="routine_name">Routine Name</label>
              <input
                id="routine_name"
                name="routine_name"
                minLength={3}
                maxLength={100}
                type="text"
                className="validate"
                required
                placeholder="e.g. Morning routine"
                value={routineName} <----- Added
                onChange={handleNameChange}  <---------Added
              />
```

---

# STEP 2: Make the single task controlled (text/min/sec) with simple normalization on blur.
the single task row is now fully controlled:

Task 1 text, Minutes, and Seconds are wired to state.

On blur, time normalizes (seconds carry to minutes; seconds padded; minutes clamped to 0–1440).

Buttons remain disabled; total still a placeholder.

```js

import { useState } from 'react';

// STEP 2 — Single task row is now controlled (text/min/sec) with tiny normalize-on-blur
// No arrays, no totals yet (placeholder remains). Buttons are still inert.
export default function AddRoutineForm() {
  const [routineName, setRoutineName] = useState("");

  // Task 1 state (controlled)
  const [taskText, setTaskText] = useState("");
  const [taskMin, setTaskMin] = useState(""); // keep as string for inputs
  const [taskSec, setTaskSec] = useState("");

  function handleNameChange(e) {
    setRoutineName(e.target.value);
  }

  function handleTaskTextChange(e) {
    setTaskText(e.target.value);
  }

  function handleMinChange(e) {
    // digits only
    const clean = e.target.value.replace(/[^0-9]/g, "");
    setTaskMin(clean);
  }

  function handleSecChange(e) {
    const clean = e.target.value.replace(/[^0-9]/g, "");
    setTaskSec(clean);
  }

  function normalizeTime() {
    // carry seconds → minutes, clamp ranges, pad seconds
    let m = parseInt(taskMin, 10);
    let s = parseInt(taskSec, 10);
    m = Number.isFinite(m) ? m : 0;
    s = Number.isFinite(s) ? s : 0;
    if (s < 0) s = 0;
    if (m < 0) m = 0;
    m += Math.floor(s / 60);
    s = s % 60;
    if (m > 1440) m = 1440;
    setTaskMin(String(m));
    setTaskSec(String(s).padStart(2, "0"));
  }

  return (
    <>
      {/* Header Section */}
      <div className="container-fluid container-header">
        <section className="content-section content-section-title-description">
          <h2>Add a Routine</h2>
        </section>
      </div>

      <div className="">
        <form className="">
          {/* Routine Name (controlled) */}
          <div className="row">
            <div className="">
              <label htmlFor="routine_name">Routine Name</label>
              <input
                id="routine_name"
                name="routine_name"
                minLength={3}
                maxLength={100}
                type="text"
                className="validate"
                required
                placeholder="e.g. Morning routine"
                value={routineName}
                onChange={handleNameChange}
              />
              {/* Total will become live later; placeholder for now */}
              <small style={{ marginLeft: 8, opacity: 0.8 }}>
                Total: 0:00 (≈ 0 min)
              </small>
            </div>
          </div>

          {/* Add Tasks section */}
          <div className="">
            <div className="">
              <h5>Add tasks to your routine</h5>
            </div>
          </div>

          {/* Task list (single controlled row) */}
          <div id="add-tasks">
            <div className="row">
              <div
                className="input-field"
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}
              >
                {/* Task text */}
                <div>
                  <input
                    type="text"
                    id="task_1"
                    className="validate"
                    required
                    placeholder="Task 1"
                    value={taskText}
                    onChange={handleTaskTextChange}
                  />
                  <label htmlFor="task_1">Task 1</label>
                </div>

                {/* Minutes */}
                <div>
                  <label htmlFor="task_1_min">Minutes</label>
                  <input
                    type="number"
                    id="task_1_min"
                    className="validate"
                    inputMode="numeric"
                    min={0}
                    max={1440}
                    placeholder="0"
                    value={taskMin}
                    onChange={handleMinChange}
                    onBlur={normalizeTime}
                  />
                </div>

                {/* Seconds */}
                <div>
                  <label htmlFor="task_1_sec">Seconds</label>
                  <input
                    type="number"
                    id="task_1_sec"
                    className="validate"
                    inputMode="numeric"
                    min={0}
                    max={59}
                    placeholder="00"
                    value={taskSec}
                    onChange={handleSecChange}
                    onBlur={normalizeTime}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add New Task Button (still inert) */}
          <div className="row">
            <button type="button" id="add-task-btn" className="btn" disabled title="Will add behavior later">
              Add Task
            </button>
          </div>

          {/* Submit Button (still inert) */}
          <div className="row">
            <div className="input-field">
              <button className="btn btn-primary" type="button" disabled title="Will add behavior later">
                Save (local)
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

```

---

# STEP 3: Switch to a tasks array + “Add Task” to append a blank row.
Switched to a tasks array in state: each task has { text, min, sec }.

Rendered tasks with tasks.map(...) so you get Task 1, Task 2, … rows.

Add Task now works — it appends a new blank row.

Still no totals and no submit behavior; Save stays disabled.
```js
import { useState } from 'react';

// STEP 3 — Switch to a tasks array; Add Task appends a new blank row
// Still no totals and no submit behavior. Save button stays disabled.
export default function AddRoutineForm() {
  const [routineName, setRoutineName] = useState("");

  // Tasks array: each task has text, min, sec (all strings for inputs)
  const [tasks, setTasks] = useState([{ text: "", min: "", sec: "" }]);

  function handleNameChange(e) {
    setRoutineName(e.target.value);
  }

  function setTask(index, updater) {
    setTasks((prev) => {
      const copy = [...prev];
      copy[index] = typeof updater === 'function'
        ? updater(copy[index])
        : { ...copy[index], ...updater };
      return copy;
    });
  }

  function handleTaskTextChange(index, value) {
    setTask(index, { text: value });
  }

  function handleMinChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "");
    setTask(index, { min: clean });
  }

  function handleSecChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "");
    setTask(index, { sec: clean });
  }

  function normalizeTime(index) {
    setTask(index, (t) => {
      let m = parseInt(t.min, 10);
      let s = parseInt(t.sec, 10);
      m = Number.isFinite(m) ? m : 0;
      s = Number.isFinite(s) ? s : 0;
      if (s < 0) s = 0;
      if (m < 0) m = 0;
      m += Math.floor(s / 60);
      s = s % 60;
      if (m > 1440) m = 1440;
      return { ...t, min: String(m), sec: String(s).padStart(2, "0") };
    });
  }

  function addTask() {
    setTasks((prev) => [...prev, { text: "", min: "", sec: "" }]);
  }

  return (
    <>
      {/* Header Section */}
      <div className="container-fluid container-header">
        <section className="content-section content-section-title-description">
          <h2>Add a Routine</h2>
        </section>
      </div>

      <div className="">
        <form className="">
          {/* Routine Name (controlled) */}
          <div className="row">
            <div className="">
              <label htmlFor="routine_name">Routine Name</label>
              <input
                id="routine_name"
                name="routine_name"
                minLength={3}
                maxLength={100}
                type="text"
                className="validate"
                required
                placeholder="e.g. Morning routine"
                value={routineName}
                onChange={handleNameChange}
              />
              {/* Total will become live later; placeholder for now */}
              <small style={{ marginLeft: 8, opacity: 0.8 }}>
                Total: 0:00 (≈ 0 min)
              </small>
            </div>
          </div>

          {/* Add Tasks section */}
          <div className="">
            <div className="">
              <h5>Add tasks to your routine</h5>
            </div>
          </div>

          {/* Task list (dynamic) */}
          <div id="add-tasks">
            {tasks.map((t, i) => (
              <div className="row" key={i}>
                <div
                  className="input-field"
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}
                >
                  {/* Task text */}
                  <div>
                    <input
                      type="text"
                      id={`task_${i + 1}`}
                      className="validate"
                      required
                      placeholder={`Task ${i + 1}`}
                      value={t.text}
                      onChange={(e) => handleTaskTextChange(i, e.target.value)}
                    />
                    <label htmlFor={`task_${i + 1}`}>Task {i + 1}</label>
                  </div>

                  {/* Minutes */}
                  <div>
                    <label htmlFor={`task_${i + 1}_min`}>Minutes</label>
                    <input
                      type="number"
                      id={`task_${i + 1}_min`}
                      className="validate"
                      inputMode="numeric"
                      min={0}
                      max={1440}
                      placeholder="0"
                      value={t.min}
                      onChange={(e) => handleMinChange(i, e.target.value)}
                      onBlur={() => normalizeTime(i)}
                    />
                  </div>

                  {/* Seconds */}
                  <div>
                    <label htmlFor={`task_${i + 1}_sec`}>Seconds</label>
                    <input
                      type="number"
                      id={`task_${i + 1}_sec`}
                      className="validate"
                      inputMode="numeric"
                      min={0}
                      max={59}
                      placeholder="00"
                      value={t.sec}
                      onChange={(e) => handleSecChange(i, e.target.value)}
                      onBlur={() => normalizeTime(i)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Task Button (now works; just appends a row) */}
          <div className="row">
            <button type="button" id="add-task-btn" className="btn" onClick={addTask}>
              Add Task
            </button>
          </div>

          {/* Submit Button (still inert) */}
          <div className="row">
            <div className="input-field">
              <button className="btn btn-primary" type="button" disabled title="Will add behavior later">
                Save (local)
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

```

---

# STEP 4: Live total time display next to the routine name.
added a live Total time next to the Routine Name:

It recomputes from all task mins/secs as you type.

Shows M:SS and the ceiling in minutes you’ll eventually save.

No submit or API yet; buttons unchanged.
```js
import { useState } from 'react';

// STEP 3 — Switch to a tasks array; Add Task appends a new blank row
// Still no totals and no submit behavior. Save button stays disabled.
export default function AddRoutineForm() {
  const [routineName, setRoutineName] = useState("");

  // Tasks array: each task has text, min, sec (all strings for inputs)
  const [tasks, setTasks] = useState([{ text: "", min: "", sec: "" }]);

  function handleNameChange(e) {
    setRoutineName(e.target.value);
  }

  function setTask(index, updater) {
    setTasks((prev) => {
      const copy = [...prev];
      copy[index] = typeof updater === 'function'
        ? updater(copy[index])
        : { ...copy[index], ...updater };
      return copy;
    });
  }

  function handleTaskTextChange(index, value) {
    setTask(index, { text: value });
  }

  function handleMinChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "");
    setTask(index, { min: clean });
  }

  function handleSecChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "");
    setTask(index, { sec: clean });
  }

  function normalizeTime(index) {
    setTask(index, (t) => {
      let m = parseInt(t.min, 10);
      let s = parseInt(t.sec, 10);
      m = Number.isFinite(m) ? m : 0;
      s = Number.isFinite(s) ? s : 0;
      if (s < 0) s = 0;
      if (m < 0) m = 0;
      m += Math.floor(s / 60);
      s = s % 60;
      if (m > 1440) m = 1440;
      return { ...t, min: String(m), sec: String(s).padStart(2, "0") };
    });
  }

  function addTask() {
    setTasks((prev) => [...prev, { text: "", min: "", sec: "" }]);
  }

  // --- derived totals (live) ----------------------------------------------
  function secondsFrom(minStr, secStr) {
    let m = parseInt(minStr, 10);
    let s = parseInt(secStr, 10);
    m = Number.isFinite(m) ? m : 0;
    s = Number.isFinite(s) ? s : 0;
    if (m < 0) m = 0;
    if (s < 0) s = 0;
    m += Math.floor(s / 60);
    s = s % 60;
    return m * 60 + s;
  }

  const totalSecondsLive = tasks.reduce((sum, t) => sum + secondsFrom(t.min, t.sec), 0);
  const totalMinutesLive = Math.floor(totalSecondsLive / 60);
  const totalSecondsRemainder = totalSecondsLive % 60;
  const totalMinutesCeilLive = Math.min(1440, Math.ceil(totalSecondsLive / 60));

  return (
    <>
      {/* Header Section */}
      <div className="container-fluid container-header">
        <section className="content-section content-section-title-description">
          <h2>Add a Routine</h2>
        </section>
      </div>

      <div className="">
        <form className="">
          {/* Routine Name (controlled) */}
          <div className="row">
            <div className="">
              <label htmlFor="routine_name">Routine Name</label>
              <input
                id="routine_name"
                name="routine_name"
                minLength={3}
                maxLength={100}
                type="text"
                className="validate"
                required
                placeholder="e.g. Morning routine"
                value={routineName}
                onChange={handleNameChange}
              />
              {/* Total will become live later; placeholder for now */}
              <small style={{ marginLeft: 8, opacity: 0.8 }}>
                Total: {totalMinutesLive}:{String(totalSecondsRemainder).padStart(2, '0')} (≈ {totalMinutesCeilLive} min)
              </small>
            </div>
          </div>

          {/* Add Tasks section */}
          <div className="">
            <div className="">
              <h5>Add tasks to your routine</h5>
            </div>
          </div>

          {/* Task list (dynamic) */}
          <div id="add-tasks">
            {tasks.map((t, i) => (
              <div className="row" key={i}>
                <div
                  className="input-field"
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}
                >
                  {/* Task text */}
                  <div>
                    <input
                      type="text"
                      id={`task_${i + 1}`}
                      className="validate"
                      required
                      placeholder={`Task ${i + 1}`}
                      value={t.text}
                      onChange={(e) => handleTaskTextChange(i, e.target.value)}
                    />
                    <label htmlFor={`task_${i + 1}`}>Task {i + 1}</label>
                  </div>

                  {/* Minutes */}
                  <div>
                    <label htmlFor={`task_${i + 1}_min`}>Minutes</label>
                    <input
                      type="number"
                      id={`task_${i + 1}_min`}
                      className="validate"
                      inputMode="numeric"
                      min={0}
                      max={1440}
                      placeholder="0"
                      value={t.min}
                      onChange={(e) => handleMinChange(i, e.target.value)}
                      onBlur={() => normalizeTime(i)}
                    />
                  </div>

                  {/* Seconds */}
                  <div>
                    <label htmlFor={`task_${i + 1}_sec`}>Seconds</label>
                    <input
                      type="number"
                      id={`task_${i + 1}_sec`}
                      className="validate"
                      inputMode="numeric"
                      min={0}
                      max={59}
                      placeholder="00"
                      value={t.sec}
                      onChange={(e) => handleSecChange(i, e.target.value)}
                      onBlur={() => normalizeTime(i)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Task Button (now works; just appends a row) */}
          <div className="row">
            <button type="button" id="add-task-btn" className="btn" onClick={addTask}>
              Add Task
            </button>
          </div>

          {/* Submit Button (still inert) */}
          <div className="row">
            <div className="input-field">
              <button className="btn btn-primary" type="button" disabled title="Will add behavior later">
                Save (local)
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

```

---

# STEP 5: Minimal submit that logs a local draft (still no API).

onSubmit prevents default and logs a local draft:

routine_name

routineDurationMinutes (ceil of total secs / 60, max 1440)

tasks with { task_text, minutes, seconds, task_order }

The Save button now submits the form (no API).
```js
import { useState } from 'react';

// STEP 3 — Switch to a tasks array; Add Task appends a new blank row
// Still no totals and no submit behavior. Save button stays disabled.
export default function AddRoutineForm() {
  const [routineName, setRoutineName] = useState("");

  // Tasks array: each task has text, min, sec (all strings for inputs)
  const [tasks, setTasks] = useState([{ text: "", min: "", sec: "" }]);

  function handleNameChange(e) {
    setRoutineName(e.target.value);
  }

  function setTask(index, updater) {
    setTasks((prev) => {
      const copy = [...prev];
      copy[index] = typeof updater === 'function'
        ? updater(copy[index])
        : { ...copy[index], ...updater };
      return copy;
    });
  }

  function handleTaskTextChange(index, value) {
    setTask(index, { text: value });
  }

  function handleMinChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "");
    setTask(index, { min: clean });
  }

  function handleSecChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "");
    setTask(index, { sec: clean });
  }

  function normalizeTime(index) {
    setTask(index, (t) => {
      let m = parseInt(t.min, 10);
      let s = parseInt(t.sec, 10);
      m = Number.isFinite(m) ? m : 0;
      s = Number.isFinite(s) ? s : 0;
      if (s < 0) s = 0;
      if (m < 0) m = 0;
      m += Math.floor(s / 60);
      s = s % 60;
      if (m > 1440) m = 1440;
      return { ...t, min: String(m), sec: String(s).padStart(2, "0") };
    });
  }

  function addTask() {
    setTasks((prev) => [...prev, { text: "", min: "", sec: "" }]);
  }

  // --- derived totals (live) ----------------------------------------------
  function secondsFrom(minStr, secStr) {
    let m = parseInt(minStr, 10);
    let s = parseInt(secStr, 10);
    m = Number.isFinite(m) ? m : 0;
    s = Number.isFinite(s) ? s : 0;
    if (m < 0) m = 0;
    if (s < 0) s = 0;
    m += Math.floor(s / 60);
    s = s % 60;
    return m * 60 + s;
  }

  const totalSecondsLive = tasks.reduce((sum, t) => sum + secondsFrom(t.min, t.sec), 0);
  const totalMinutesLive = Math.floor(totalSecondsLive / 60);
  const totalSecondsRemainder = totalSecondsLive % 60;
  const totalMinutesCeilLive = Math.min(1440, Math.ceil(totalSecondsLive / 60));
  function handleSubmit(e) {
    e.preventDefault();
    // Local-only: summarise current form state (no API)
    const tasksNormalized = tasks
      .map((t, i) => ({
        task_text: t.text.trim(),
        minutes: Number.parseInt(t.min || '0', 10) || 0,
        seconds: Number.parseInt(t.sec || '0', 10) || 0,
        task_order: i + 1,
      }))
      .filter((t) => t.task_text);

    const totalSeconds = tasksNormalized.reduce((sum, t) => sum + (t.minutes * 60 + t.seconds), 0);
    const routineDurationMinutes = Math.min(1440, Math.ceil(totalSeconds / 60));

    console.log('Local routine draft', {
      routine_name: routineName,
      routineDurationMinutes,
      tasks: tasksNormalized,
    });
  }

  return (
    <>
      {/* Header Section */}
      <div className="container-fluid container-header">
        <section className="content-section content-section-title-description">
          <h2>Add a Routine</h2>
        </section>
      </div>

      <div className="">
        <form className="" onSubmit={handleSubmit}>
          {/* Routine Name (controlled) */}
          <div className="row">
            <div className="">
              <label htmlFor="routine_name">Routine Name</label>
              <input
                id="routine_name"
                name="routine_name"
                minLength={3}
                maxLength={100}
                type="text"
                className="validate"
                required
                placeholder="e.g. Morning routine"
                value={routineName}
                onChange={handleNameChange}
              />
              {/* Total will become live later; placeholder for now */}
              <small style={{ marginLeft: 8, opacity: 0.8 }}>
                Total: {totalMinutesLive}:{String(totalSecondsRemainder).padStart(2, '0')} (≈ {totalMinutesCeilLive} min)
              </small>
            </div>
          </div>

          {/* Add Tasks section */}
          <div className="">
            <div className="">
              <h5>Add tasks to your routine</h5>
            </div>
          </div>

          {/* Task list (dynamic) */}
          <div id="add-tasks">
            {tasks.map((t, i) => (
              <div className="row" key={i}>
                <div
                  className="input-field"
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}
                >
                  {/* Task text */}
                  <div>
                    <input
                      type="text"
                      id={`task_${i + 1}`}
                      className="validate"
                      required
                      placeholder={`Task ${i + 1}`}
                      value={t.text}
                      onChange={(e) => handleTaskTextChange(i, e.target.value)}
                    />
                    <label htmlFor={`task_${i + 1}`}>Task {i + 1}</label>
                  </div>

                  {/* Minutes */}
                  <div>
                    <label htmlFor={`task_${i + 1}_min`}>Minutes</label>
                    <input
                      type="number"
                      id={`task_${i + 1}_min`}
                      className="validate"
                      inputMode="numeric"
                      min={0}
                      max={1440}
                      placeholder="0"
                      value={t.min}
                      onChange={(e) => handleMinChange(i, e.target.value)}
                      onBlur={() => normalizeTime(i)}
                    />
                  </div>

                  {/* Seconds */}
                  <div>
                    <label htmlFor={`task_${i + 1}_sec`}>Seconds</label>
                    <input
                      type="number"
                      id={`task_${i + 1}_sec`}
                      className="validate"
                      inputMode="numeric"
                      min={0}
                      max={59}
                      placeholder="00"
                      value={t.sec}
                      onChange={(e) => handleSecChange(i, e.target.value)}
                      onBlur={() => normalizeTime(i)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Task Button (now works; just appends a row) */}
          <div className="row">
            <button type="button" id="add-task-btn" className="btn" onClick={addTask}>
              Add Task
            </button>
          </div>

          {/* Submit Button (still inert) */}
          <div className="row">
            <div className="input-field">
              <button className="btn btn-primary" type="submit">Save (local)</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

```

---

# STEP 6: Add ability to remove task per row
added a Remove button on each task row:

Click Remove to delete that row.

It’s disabled when there’s only one task (so you always have at least one).

No other behavior changed.
```js
import { useState } from 'react';

// STEP 3 — Switch to a tasks array; Add Task appends a new blank row
// Still no totals and no submit behavior. Save button stays disabled.
export default function AddRoutineForm() {
  const [routineName, setRoutineName] = useState("");

  // Tasks array: each task has text, min, sec (all strings for inputs)
  const [tasks, setTasks] = useState([{ text: "", min: "", sec: "" }]);

  function handleNameChange(e) {
    setRoutineName(e.target.value);
  }

  function setTask(index, updater) {
    setTasks((prev) => {
      const copy = [...prev];
      copy[index] = typeof updater === 'function'
        ? updater(copy[index])
        : { ...copy[index], ...updater };
      return copy;
    });
  }

  function handleTaskTextChange(index, value) {
    setTask(index, { text: value });
  }

  function handleMinChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "");
    setTask(index, { min: clean });
  }

  function handleSecChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "");
    setTask(index, { sec: clean });
  }

  function normalizeTime(index) {
    setTask(index, (t) => {
      let m = parseInt(t.min, 10);
      let s = parseInt(t.sec, 10);
      m = Number.isFinite(m) ? m : 0;
      s = Number.isFinite(s) ? s : 0;
      if (s < 0) s = 0;
      if (m < 0) m = 0;
      m += Math.floor(s / 60);
      s = s % 60;
      if (m > 1440) m = 1440;
      return { ...t, min: String(m), sec: String(s).padStart(2, "0") };
    });
  }

  function addTask() {
    setTasks((prev) => [...prev, { text: "", min: "", sec: "" }]);
  }

  function removeTask(index) {
    setTasks((prev) => {
      if (prev.length <= 1) return prev; // keep at least one row
      return prev.filter((_, i) => i !== index);
    });
  }

  // --- derived totals (live) ----------------------------------------------
  function secondsFrom(minStr, secStr) {
    let m = parseInt(minStr, 10);
    let s = parseInt(secStr, 10);
    m = Number.isFinite(m) ? m : 0;
    s = Number.isFinite(s) ? s : 0;
    if (m < 0) m = 0;
    if (s < 0) s = 0;
    m += Math.floor(s / 60);
    s = s % 60;
    return m * 60 + s;
  }

  const totalSecondsLive = tasks.reduce((sum, t) => sum + secondsFrom(t.min, t.sec), 0);
  const totalMinutesLive = Math.floor(totalSecondsLive / 60);
  const totalSecondsRemainder = totalSecondsLive % 60;
  const totalMinutesCeilLive = Math.min(1440, Math.ceil(totalSecondsLive / 60));
  function handleSubmit(e) {
    e.preventDefault();
    // Local-only: summarise current form state (no API)
    const tasksNormalized = tasks
      .map((t, i) => ({
        task_text: t.text.trim(),
        minutes: Number.parseInt(t.min || '0', 10) || 0,
        seconds: Number.parseInt(t.sec || '0', 10) || 0,
        task_order: i + 1,
      }))
      .filter((t) => t.task_text);

    const totalSeconds = tasksNormalized.reduce((sum, t) => sum + (t.minutes * 60 + t.seconds), 0);
    const routineDurationMinutes = Math.min(1440, Math.ceil(totalSeconds / 60));

    console.log('Local routine draft', {
      routine_name: routineName,
      routineDurationMinutes,
      tasks: tasksNormalized,
    });
  }

  return (
    <>
      {/* Header Section */}
      <div className="container-fluid container-header">
        <section className="content-section content-section-title-description">
          <h2>Add a Routine</h2>
        </section>
      </div>

      <div className="">
        <form className="" onSubmit={handleSubmit}>
          {/* Routine Name (controlled) */}
          <div className="row">
            <div className="">
              <label htmlFor="routine_name">Routine Name</label>
              <input
                id="routine_name"
                name="routine_name"
                minLength={3}
                maxLength={100}
                type="text"
                className="validate"
                required
                placeholder="e.g. Morning routine"
                value={routineName}
                onChange={handleNameChange}
              />
              {/* Total will become live later; placeholder for now */}
              <small style={{ marginLeft: 8, opacity: 0.8 }}>
                Total: {totalMinutesLive}:{String(totalSecondsRemainder).padStart(2, '0')} (≈ {totalMinutesCeilLive} min)
              </small>
            </div>
          </div>

          {/* Add Tasks section */}
          <div className="">
            <div className="">
              <h5>Add tasks to your routine</h5>
            </div>
          </div>

          {/* Task list (dynamic) */}
          <div id="add-tasks">
            {tasks.map((t, i) => (
              <div className="row" key={i}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeTask(i)}
                    disabled={tasks.length === 1}
                    title={tasks.length === 1 ? "Keep at least one task" : "Remove task"}
                  >
                    Remove
                  </button>
                </div>
                <div
                  className="input-field"
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}
                >
                  {/* Task text */}
                  <div>
                    <input
                      type="text"
                      id={`task_${i + 1}`}
                      className="validate"
                      required
                      placeholder={`Task ${i + 1}`}
                      value={t.text}
                      onChange={(e) => handleTaskTextChange(i, e.target.value)}
                    />
                    <label htmlFor={`task_${i + 1}`}>Task {i + 1}</label>
                  </div>

                  {/* Minutes */}
                  <div>
                    <label htmlFor={`task_${i + 1}_min`}>Minutes</label>
                    <input
                      type="number"
                      id={`task_${i + 1}_min`}
                      className="validate"
                      inputMode="numeric"
                      min={0}
                      max={1440}
                      placeholder="0"
                      value={t.min}
                      onChange={(e) => handleMinChange(i, e.target.value)}
                      onBlur={() => normalizeTime(i)}
                    />
                  </div>

                  {/* Seconds */}
                  <div>
                    <label htmlFor={`task_${i + 1}_sec`}>Seconds</label>
                    <input
                      type="number"
                      id={`task_${i + 1}_sec`}
                      className="validate"
                      inputMode="numeric"
                      min={0}
                      max={59}
                      placeholder="00"
                      value={t.sec}
                      onChange={(e) => handleSecChange(i, e.target.value)}
                      onBlur={() => normalizeTime(i)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Task Button (now works; just appends a row) */}
          <div className="row">
            <button type="button" id="add-task-btn" className="btn" onClick={addTask}>
              Add Task
            </button>
          </div>

          {/* Submit Button (still inert) */}
          <div className="row">
            <div className="input-field">
              <button className="btn btn-primary" type="submit">Save (local)</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

```
