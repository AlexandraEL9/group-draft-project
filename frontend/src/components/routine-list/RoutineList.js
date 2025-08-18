// frontend/src/components/routine-list/RoutineList.jsx

// Import React and two hooks:
// - useState: store component state (the routines array)
// - useEffect: run side-effects (fetching data after render)
import React, { useEffect, useState } from "react";

// Import navigation hook from React Router so we can go to other pages in code
import { useNavigate } from "react-router-dom";

// Import your Axios-based API helper that calls GET /routines?user_id=...
import { getRoutines } from "../../api/routines";

// Define and export the component so it can be used elsewhere
function RoutinesList() {

  // Grab the navigate() function so we can push to URLs (e.g., edit/play/new)
  const navigate = useNavigate();

  // Read the logged-in user's id (saved by Login) from localStorage (stored as a string)
  const userId = localStorage.getItem("userId"); // set at login

  // Create a piece of state to hold the routines returned from the API (start empty)
  const [routines, setRoutines] = useState([]);

  // Run once on mount (and again if userId changes): fetch the user's routines
  useEffect(() => {
    // Immediately-invoked async function so we can use await inside useEffect
    (async () => {
      // Call the API helper; backend expects a number for user_id
      const { routines } = await getRoutines(Number(userId));

      // Save the routines array into state (fallback to [] if undefined/null)
      setRoutines(routines ?? []);
    })();
  }, [userId]); // Re-run if a different userId is present (e.g., user logs out/in)

  // JSX UI for the list page
  return (
    <section className="routines">
      {/* Header area for the page title */}
      <div className="routines__header">
        <h1 className="routines__title">Your Routines</h1>
      </div>

      {/* Unordered list that will contain one <li> per routine */}
      <ul className="routines__list">
        {routines.map((r) => (
          // React needs a stable key to track items; routine_id is unique from DB
          <li key={r.routine_id} className="routine-card">
            {/* Left side: routine label info */}
            <div className="routine-card__info">
              {/* Routine name as a subheading */}
              <h2>{r.routine_name}</h2>
              {/* Routine duration in minutes */}
              <p>Duration: {r.routine_duration_minutes} mins</p>
            </div>

            {/* Right side: action buttons for this specific routine */}
            <div className="routine-card__actions">
              {/* Play button navigates to the routine player route with this routine's id */}
              <button
                className="btn btn--secondary"
                onClick={() => navigate(`/routines/play/${r.routine_id}`)}
              >
                Play
              </button>

              {/* Edit button navigates to the edit screen for this routine */}
              <button
                className="btn btn--secondary"
                onClick={() => navigate(`/routines/edit/${r.routine_id}`)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Global add button to create a brand-new routine */}
      <button
        className="btn btn--secondary"
        onClick={() => navigate("/routines/new")}
      >
        + Add Routine
      </button>
    </section>
  );
}

// Export as default so importing files can do: import RoutinesList from './RoutineList'
export default RoutinesList;
