// src/components/AddRoutineForm.jsx
import React, { useState } from "react";

function AddRoutineForm() {
  const [name, setName] = useState("");

  return (
    <form>
      <div>
        <label htmlFor="routine-name">Routine name</label>
        <input
          id="routine-name"
          type="text"
          placeholder="e.g. Morning Routine"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <fieldset>
        <legend>Tasks</legend>

        <div>
          <span>1.</span>{" "}
          <input type="text" placeholder="Task name" />{" "}
          <input type="text" placeholder="mm:ss" />{" "}
          <button type="button">Remove</button>
        </div>

        <button type="button">Add task</button>
      </fieldset>

      <div style={{ marginTop: 16 }}>
        <button type="submit">Save</button>
        <button type="button">Delete this routine</button>
      </div>
    </form>
  );
}


export default AddRoutineForm
