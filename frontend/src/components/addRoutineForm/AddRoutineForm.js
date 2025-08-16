import React, { useId, useState, useRef } from "react";


function AddRoutineForm({ onSave }) {
  const uid = useId();

  // Only track how many rows to render (not their values)
  const [rows, setRows] = useState([1]);
  const nextId = useRef(2);

  const addTask = () => setRows(prev => [...prev, nextId.current++]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const name = (fd.get("name") || "").toString().trim();

    // Read values for each rendered row by name
    const tasks = rows
      .map(id => ({
        title: (fd.get(`tasks[${id}][title]`) || "").toString().trim(),
        duration: (fd.get(`tasks[${id}][duration]`) || "").toString().trim(),
      }))
      // ignore completely empty rows
      .filter(t => t.title); // <- only keep rows with a title

    const payload = { name, tasks };
    console.log("SAVE payload:", payload);

    // If you're ready to post to your API, uncomment:
    // await fetch("/api/routines", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });

    // reset the form and rows
    e.currentTarget.reset();
    setRows([1]);
    nextId.current = 2;

    onSave?.(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={`${uid}-name`}>Routine name</label>
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          placeholder="e.g. Morning Routine"
          required
        />
      </div>

      <fieldset>
        <legend>Tasks</legend>

        {rows.map((id, idx) => (
          <div key={id}>
            <span>{idx + 1}.</span>{" "}
            <input
              name={`tasks[${id}][title]`}
              placeholder="Task name"
            />{" "}
            <input
              name={`tasks[${id}][duration]`}
              placeholder="mm:ss"
              defaultValue="00:30"
            />
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

export default AddRoutineForm
