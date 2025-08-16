import React, { useId, useState } from "react";

function AddRoutineForm() {
  const [name, setName] = useState(""); 
  const nameId = useId();
  // create fields for task objects
  const [tasks, setTasks] = useState([{ id: 1, title: "", duration: "00:30" }]);
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
          <input type="text" placeholder="Task name" value={tasks[0].title} />{" "}
          <input type="text" placeholder="mm:ss" value={tasks[0].duration} />{" "}
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
