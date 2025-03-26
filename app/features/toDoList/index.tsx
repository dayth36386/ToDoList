"use client";
import { useState } from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { Input } from "../../../components/ui/input";
import { PlaceholdersAndVanishInput } from "../../../components/ui/placeholders-and-vanish-input";
import { cn } from "../../../lib/utils";

type ToDoList = {
  key: string;
  value: string;
  status: boolean;
  edit: boolean;
};

export default function ToDoListReder() {
  const placeholders = ["What are you doing Today?", "Today ?"];
  const [todos, setTodos] = useState<ToDoList[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputValueEdit, setInputValueEdit] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueEdit(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue !== "") {
      setTodos([
        ...todos,
        { key: uuidv4(), value: inputValue, status: false, edit: false },
      ]);
      setInputValue("");
    }
  };
  const onSubmitEdit = (key: string) => {
    if (inputValueEdit !== "") {
      setTodos(
        todos.map((todo) =>
          todo.key === key
            ? { ...todo, value: inputValueEdit, edit: false }
            : todo,
        ),
      );
      setInputValueEdit("");
    }
  };
  console.log(todos);
  useEffect(() => {
    const storedTodos = localStorage.getItem("toDoList");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("toDoList", JSON.stringify(todos));
  }, [todos]);
  const handleDeleteTodo = (key: string) => {
    setTodos(todos.filter((todo) => todo.key !== key));
  };
  const handleChangeState = (key: string, status: boolean) => {
    setTodos(
      todos.map((todo) =>
        todo.key === key ? { ...todo, status: !status } : todo,
      ),
    );
  };
  const handleChangeStateEdit = (key: string, value: string, edit: boolean) => {
    setInputValueEdit(value);
    setTodos(
      todos.map((todo) => (todo.key === key ? { ...todo, edit: !edit } : todo)),
    );
  };

  return (
    <div className="bg-black w-full h-screen flex justify-center items-center text-white select-none">
      <div className="relative inline-flex overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer rounded-2xl bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          <div className="p-5 flex gap-2.5 flex-col">
            <p className="text-4xl font-bold mx-auto">To Do List</p>
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
            {todos.map((item) => (
              <div
                key={item.key}
                className={cn(
                  "flex items-center justify-between p-2 bg-slate-900 rounded-full mt-2",
                )}
              >
                <div className="flex justify-between items-center w-full text-xl px-2.5">
                  {item.edit ? (
                    <Input
                      className="border-none"
                      value={inputValueEdit}
                      onChange={handleChangeEdit}
                    />
                  ) : (
                    <p
                      onClick={() => {
                        handleChangeState(item.key, item.status);
                      }}
                      className={cn("w-full", { "line-through": item.status })}
                    >
                      {item.value}
                    </p>
                  )}
                  {item.edit ? (
                    <div className="flex gap-2.5">
                      <button
                        className="text-sm"
                        onClick={() => {
                          onSubmitEdit(item.key);
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="text-sm"
                        onClick={() => {
                          handleChangeStateEdit(
                            item.key,
                            item.value,
                            item.edit,
                          );
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2.5">
                      <button
                        className="text-sm"
                        onClick={() => {
                          handleChangeStateEdit(
                            item.key,
                            item.value,
                            item.edit,
                          );
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm"
                        onClick={() => {
                          handleDeleteTodo(item.key);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </span>
      </div>
    </div>
  );
}
