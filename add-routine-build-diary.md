# add routine component build

1. make taks section and make saveable (show with prompt an console.log)
```js
import React, { useId, useState } from "react";

function AddRoutineForm() {
  const [name, setName] = useState(""); 
  const nameId = useId();

  // Handle page submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, tasks });
    alert("Saved (check console)");
    };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={nameId}>Routine name</label>
        <input
          id={nameId}
          type="text"
          placeholder="e.g. Morning Routine"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default AddRoutineForm
```

2. Add in the task fieldset - only one for now
```js
import React, { useId, useState } from "react";

function AddRoutineForm() {
  const [name, setName] = useState(""); 
  const nameId = useId();
  // create fields for task objects
  const [tasks, setTasks] = useState([{ id: 1, title: "", duration: "00:30" }]);
  const updateFirstTask = (field, value) => {
    setTasks(prev => [{ ...prev[0], [field]: value }]);
  };
  // Handle page submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, tasks });
    alert("Saved (check console)");
 };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={nameId}>Routine name</label>
        <input
          id={nameId}
          type="text"
          placeholder="e.g. Name your routine here..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
    {/* field set, and inputs for tasks within the routine */} 
      <fieldset>
        <legend>Tasks</legend>
        <div>
          <span>1.</span>{" "}
          <input 
            type="text" 
            placeholder="Task name" 
            value={tasks[0].title}
            onChange={(event) => updateFirstTask("title", event.target.value)} 
          />{" "}
          <input
            type="text"
            placeholder="mm:ss"
            value={tasks[0].duration}
            onChange={(e) => updateFirstTask("duration", e.target.value)}
          />{" "}
          <button type="button" disabled>Remove</button>
        </div>
        <button type="button" disabled>Add task</button>
      </fieldset>

      <div style={{ marginTop: 16 }}>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default AddRoutineForm
```

3. Make first task editable
```js
import React, { useId, useState } from "react";

function AddRoutineForm() {
  const [name, setName] = useState(""); 
  const nameId = useId();
  // create fields for task objects
  const [tasks, setTasks] = useState([{ id: 1, title: "", duration: "00:30" }]);
  const updateFirstTask = (field, value) => {
    setTasks(prev => [{ ...prev[0], [field]: value }]);
  };
  // Handle page submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, tasks });
 };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={nameId}>Routine name</label>
        <input
          id={nameId}
          type="text"
          placeholder="e.g. Name your routine here..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
    {/* field set, and inputs for tasks within the routine */} 
      <fieldset>
        <legend>Tasks</legend>
        <div>
          <span>1.</span>{" "}
          <input 
            type="text" 
            placeholder="Task name" 
            value={tasks[0].title}
            /*onChange- run when input changes*/
            onChange={(event) => updateFirstTask("title", event.target.value)} 
          />{" "}
          <input
            type="text"
            placeholder="mm:ss"
            value={tasks[0].duration}
            onChange={(e) => updateFirstTask("duration", e.target.value)}
          />{" "}
          <button type="button" disabled>Remove</button>
        </div>
        <button type="button" disabled>Add task</button>
      </fieldset>

      <div style={{ marginTop: 16 }}>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default AddRoutineForm
```

4. Add a new tasks
```js
import React, { useId, useState } from "react";

function AddRoutineForm() {
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState([{ id: 1, title: "", duration: "00:30" }]);
  const nameId = useId();

  // append a new blank task
  const addTask = () => {
    setTasks((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
      return [...prev, { id: nextId, title: "", duration: "00:30" }];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, tasks });
    // non-blocking toast would be nicer than alert; keeping console for now
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={nameId}>Routine name</label>
        <input
          id={nameId}
          type="text"
          placeholder="e.g. Name your routine here..."
          value={name}
          /*onChange- run whenever the input value changes */
          onChange={(event) => /* */
            setTasks(prev =>
                prev.map((task, i) =>
                i === idx ? { ...task, title: event.target.value } : task
                )
            )
        }
        required
        />
      </div>

      <fieldset>
        <legend>Tasks</legend>

        {tasks.map((task, idx) => (
          <div key={task.id}>
            <span>{idx + 1}.</span>{" "}
            <input
              type="text"
              placeholder="Task name"
              value={task.title}
              onChange={(e) => updateTaskAt(idx, "title", e.target.value)}
            />{" "}
            <input
              type="text"
              placeholder="mm:ss"
              value={task.duration}
              onChange={(e) => updateTaskAt(idx, "duration", e.target.value)}
            />{" "}
            <button type="button" disabled>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addTask}>Add task</button>
      </fieldset>

      <div style={{ marginTop: 16 }}>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default AddRoutineForm;
```


