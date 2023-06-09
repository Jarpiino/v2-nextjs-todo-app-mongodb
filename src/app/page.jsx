"use client";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Todo from "@components/Todo";
import Form from "@components/Form";
import Spinner from "@components/Spinner";
import DarkModeToggle from "@components/Darkmode/DarkModeToggle";
import FilterButton from "@components/FilterButton";
import { useSession } from "next-auth/react";
import useSWR, { preload, useSWRConfig } from "swr";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function Home() {
  const { mutate } = useSWRConfig();
  const session = useSession();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  // !LOCAL STORAGE USE EFFECTS
  // useEffect(() => {
  //   const data = localStorage.getItem("my-todo-list-key");
  //   if (data !== null) setTasks(JSON.parse(data));
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("my-todo-list-key", JSON.stringify(tasks));
  // }, [tasks]);

  const addTask = (name) => {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  };
  const toggleTaskCompleted = async (id, completedState, setCompletedState) => {
    console.log(completedState);
    if (completedState === false) {
      try {
        {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL + "/api/todocompleted"}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                _id: id,
                completed: true,
              }),
            }
          );
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL + "/api/todocompleted"}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                _id: id,
                completed: false,
              }),
            }
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
    setCompletedState((prev) => (prev === false ? true : false));
    console.log("done");

    mutate(`${process.env.NEXT_PUBLIC_URL + "/api/todo"}`);
  };
  // const toggleTaskCompleted = (id) => {
  //   const updatedTasks = tasks.map((task) => {
  //     // if the task has the same ID as the edited task
  //     if (id === task.id) {
  //       // use object spread to make a new object
  //       // whose `completed` prop has been inverted
  //       return { ...task, completed: !task.completed };
  //     }
  //     return task;
  //   });
  //   setTasks(updatedTasks);
  // };

  const deleteTask = async (id) => {
    try {
      {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL + "/api/tododelete"}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _id: id,
            }),
          }
        );
      }
      mutate(`${process.env.NEXT_PUBLIC_URL + "/api/todo"}`);
    } catch (e) {
      console.log(e);
    }
  };
  // ! OLD DELETE
  // const deleteTask = (id) => {
  //   const remainingTasks = tasks.filter((task) => id !== task.id);
  //   setTasks(remainingTasks);
  // };
  // const editTask = (id, newName) => {
  //   const editedTaskList = tasks.map((task) => {
  //     if (id === task.id) {
  //       return { ...task, name: newName };
  //     }
  //     return task;
  //   });
  //   setTasks(editedTaskList);
  // };
  const editTask = async (id, newName) => {
    try {
      {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL + "/api/todo"}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _id: id,
              todoname: newName,
            }),
          }
        );
      }
      mutate(`${process.env.NEXT_PUBLIC_URL + "/api/todo"}`);
    } catch (e) {
      console.log(e);
    }
  };

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  preload(`${process.env.NEXT_PUBLIC_URL + "/api/todo"}`, fetcher);

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_URL + "/api/todo"}`,
    fetcher
  );

  if (error)
    return (
      <div className="todoapp stack-large">
        <div className="flex items-center justify-center text-8xl transparency">
          failed to load
        </div>
        <h1 className="text-6xl">Todo List</h1>
        <Form addTask={addTask} />
        <div className="filters btn-group stack-exception">{filterList}</div>
        <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}></h2>
        <div className="flex items-center justify-center h-60">
          <Spinner />
        </div>
      </div>
    );
  if (isLoading)
    return (
      <div className="todoapp stack-large">
        <h1 className="text-6xl">Todo List</h1>
        <Form addTask={addTask} />
        <div className="filters btn-group stack-exception">{filterList}</div>
        <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}></h2>
        <div className="flex items-center justify-center h-60">
          <Spinner />
        </div>
      </div>
    );
  const taskList = data
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task._id}
        name={task.todoname}
        completed={task.completed}
        key={task._id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const tasksReaminingNoun = filter !== "Completed" ? "remaining" : "completed";
  const headingText = `${taskList.length} ${tasksNoun} ${tasksReaminingNoun}`;

  // // !FOR MOVIES
  // const { data2, error2, isLoading2 } = useSWR(
  //   "http://localhost:3000/api/movies",
  //   fetcher
  // );

  // if (error2) return <div>failed to load</div>;
  // if (isLoading2) return <div>loading...</div>;
  // console.log(
  //   Object.entries(data2)[0][1].map((person) => console.log(person.plot))
  // );

  return (
    <div className="todoapp stack-large">
      <h1 className="text-6xl">Todo List</h1>
      <DarkModeToggle />
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default Home;
