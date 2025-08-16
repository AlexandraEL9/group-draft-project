import React, { useId, useState } from "react";

function AddRoutineForm() {
  const [name, setName] = useState(""); 
  const nameId = useId();

  // Handle page submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name: name.trim() });
    alert("Saved! (check console)");
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

      <div style={{ marginTop: 16 }}>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default AddRoutineForm
