import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setexampleForGlobalState } from '../../shared/store/shared.store';
import './Home.scss';

const HomeExamples = ({isHidden}:{isHidden?: boolean}) => {
 const [counter, setCounter] = useState(0);
 
 // global state from shared store
 const {exampleForGlobalState} = useAppSelector((state) => state.sharedStoreReducer);
 const dispatch = useAppDispatch();


  const onClick =() => {
    // set local state
    setCounter(counter + 1);

    // set global state
    dispatch(setexampleForGlobalState(`Counter is now ${counter + 1}`));
  }

  useEffect(() => {
    // this block run only on first time teh component is rendered
  },[]);

  useEffect(() => {
    // this block run on every change of the counter state
    console.log('Counter changed:', counter);
  },[counter]);

  // create issue list with name, description, status, and assignee
  const issues = [
    {
      name: "Login Bug",
      description: "Users are unable to log in with valid credentials.",
      status: "Open",
      assignee: "Alice"
    },
    {
      name: "UI Overlap",
      description: "Buttons overlap on mobile view.",
      status: "In Progress",
      assignee: "Bob"
    },
    {
      name: "Performance Lag",
      description: "Dashboard loads slowly for large datasets.",
      status: "Closed",
      assignee: "Charlie"
    }
  ];

return (
  <div className={`home-container ${isHidden ? 'hidden' : ''}`}>
      <h1>Home page</h1>
      <h2>example for global state from shared store: {exampleForGlobalState}</h2>
      <button onClick={onClick}>{counter}</button>
      {issues.map((issue, index) => (
        <div key={index} className="issue-card">
          <h2>{issue.name}</h2>
          <p>{issue.description}</p>
          <p>Status: {issue.status}</p>
          <p>Assignee: {issue.assignee}</p>
        </div>
      ))}
  </div>
  );
}

export default HomeExamples;
