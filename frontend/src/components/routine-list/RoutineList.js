import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // used for navigation away from page
// useState: lets us store and update component state (like the routines data)
// useEffect: lets us run side effects (like fetching from an API) after render
//import '../styles/RoutinesList.scss'; 

function RoutinesList() {
  // Get the logged-in user's ID from localStorage
  // localStorage always stores strings, so userId will be a string here
  const userId = localStorage.getItem('userId');

  // routines: an array of the user's routines
  // setRoutines: function to update routines state
  // Start with an empty array so .map() works even before we fetch data
  const [routines, setRoutines] = useState([]);

  const navigate = useNavigate(); // use navigate within the component


  // useEffect runs after the component first renders, and whenever userId changes
  useEffect(() => {
    // If there's no userId in localStorage, don't bother fetching
    if (!userId) return;

    // Send a GET request to the backend API to fetch routines for this user
    fetch(`http://localhost:5000/routines?user_id=${userId}`)
      // When the fetch resolves, convert the HTTP response body from JSON into a JS object
      .then(res => res.json())

      // Once we have the parsed JSON object, update state with the routines array
      .then(json => setRoutines(json.routines || []));
      // json.routines is expected to be an array (from our backend)
      // If it's missing or undefined, we fallback to an empty array
  }, [userId]); 
  // Dependency array: only run this effect on first render and when userId changes

  // JSX returned by this component
  return (
    <section className="routines">
      <div className="routines__header">
        <h1 className="routines__title">Your Routines</h1>
      </div>

      <ul className="routines__list">
        {/* 
          Map over the 'routines' state array.
          For each routine object 'r', create one <li> element in the list.
          'map' returns a new array of JSX elements, which React can render directly.
        */}
        {routines.map(r => (
          // Each list item needs a unique key so React can track it efficiently.
          // Here, we use r.routine_id (from the DB) because it’s unique per routine.
          <li key={r.routine_id} className="routine-card">
            
            {/* Left side: Routine name + duration */}
            <div className="routine-card__info">
              {/* Routine name displayed as a heading */}
              <h2>{r.routine_name}</h2>

              {/* Duration displayed in minutes */}
              <p>Duration: {r.routine_duration_minutes} mins</p>
            </div>

            {/* Right side: Action buttons for this routine */}
            <div className="routine-card__actions">
              {/* 'Play' button — could later start this routine */}
              <button 
                className="btn btn--secondary" 
                // onclicking the button, use navigate to go to the play routine page with this routines routine_id
                onClick={() => navigate(`/routines/play/${r.routine_id}`)}
                >
                Play
              </button>


              {/* 'Edit' button — could later open a form to edit the routine */}
              <button 
                className="btn btn--secondary" 
                // onclicking the button, use navigate to go to the edit routine page with this routines routine_id
                onClick={() => navigate(`/routines/edit/${r.routine_id}`)}
                >
                Edit
              </button>
            </div>

          </li>
        ))}
      </ul>

      <button 
            className="btn btn--secondary" 
            // onclicking the button, use navigate to go to the add routine page with this routines routine_id
            onClick={() => navigate(`/routines/add/`)}
            >
            + Add Routine
      </button>
    </section>
  );
}

export default RoutinesList;
