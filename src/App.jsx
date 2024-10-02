import React, { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isBefore } from "date-fns";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);

  return (
    <div className="bg-gray-200 min-h-screen pt-12">
      <div className="p-4 pb-10 max-w-lg mx-auto bg-gradient-to-b from-blue-200 to-white rounded-lg shadow-lg min-h-[80vh]">
        <div className="flex justify-between items-center px-2">
          <h1 className="text-3xl font-bold text-blue-600">To-Do List</h1>
          <AddTaskDialog onAddTask={(task) => setTasks([...tasks, task])} />
        </div>
        {tasks.length === 0 ? (
          <div className="h-[100%] flex flex-col items-center justify-center">
            <p className="mt-56 text-gray-500 text-center text-xl">
              No tasks added yet.
            </p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onTaskClick={setSelectedTask}
            onDeleteTask={(task) => {
              setSelectedTask(task);
              setShowDeleteTaskDialog(true);
            }}
          />
        )}
        {selectedTask && !showDeleteTaskDialog && (
          <TaskDetailDialog
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdateTask={(updatedTask) => {
              setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
              setSelectedTask(updatedTask);
            }}
          />
        )}
        {selectedTask && showDeleteTaskDialog && (
          <DeleteTaskDialog
            task={selectedTask}
            onDeleteConfirm={() => {
              setTasks(tasks.filter((t) => t.id !== selectedTask.id));
              setSelectedTask(null);
              setShowDeleteTaskDialog(false);
            }}
            onClose={() => setShowDeleteTaskDialog(false)}
          />
        )}
      </div>
    </div>
  );
}

function TaskList({ tasks, onTaskClick, onDeleteTask }) {
  return (
    <div className="mt-8 space-y-4">
      {tasks.map((task) => {
        const deadlinePassed = isBefore(new Date(task.deadline), new Date());
        const totalSubtasks = task.subtasks.length;
        const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
        const taskCompleted = totalSubtasks > 0 && completedSubtasks === totalSubtasks;

        return (
          <Card
            key={task.id}
            className="p-4 hover:shadow-lg transition-shadow bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div
                onClick={() => onTaskClick(task)}
                className="cursor-pointer flex-1"
              >
                <CardTitle className="text-lg font-semibold text-blue-600">
                  {task.title}
                </CardTitle>
                <CardDescription className="mt-1 text-sm">
                  Deadline:{" "}
                  <span className={deadlinePassed ? "text-red-500" : "text-gray-700"}>
                    {format(new Date(task.deadline), "MMM dd, yyyy")}
                    {deadlinePassed && " (Passed)"}
                  </span>
                </CardDescription>
                <div className="mt-1">
                  {taskCompleted ? (
                    <span className="text-green-500 font-medium">Task completed</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">
                      {completedSubtasks}/{totalSubtasks} subtasks completed
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task);
                }}
                className="ml-2"
              >
                Delete
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function TaskDetailDialog({ task, onClose, onUpdateTask }) {
  const [open, setOpen] = useState(true);
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const deadlinePassed = isBefore(new Date(task.deadline), new Date());
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const taskCompleted = totalSubtasks > 0 && completedSubtasks === totalSubtasks;

  const handleToggleSubtask = (subtaskId) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    onUpdateTask(updatedTask);
  };

  const handleAddSubtask = () => {
    if (subtaskTitle.trim() === "") return;
    const newSubtask = {
      id: Date.now(),
      title: subtaskTitle,
      completed: false,
    };
    const updatedTask = { ...task, subtasks: [...task.subtasks, newSubtask] };
    onUpdateTask(updatedTask);
    setSubtaskTitle("");
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {task.title}
          </DialogTitle>
          <DialogDescription>
            <div className="mt-2">
              Deadline:{" "}
              <span className={deadlinePassed ? "text-red-500" : "text-gray-700"}>
                {format(new Date(task.deadline), "MMM dd, yyyy")}
                {deadlinePassed && " (Passed)"}
              </span>
            </div>
            <div className="mt-1">
              {taskCompleted ? (
                <span className="text-green-500 font-medium">Task completed</span>
              ) : (
                <span className="text-yellow-600 font-medium">
                  {completedSubtasks}/{totalSubtasks} subtasks completed
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {task.subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center h-4">
              <Checkbox
                checked={subtask.completed}
                onCheckedChange={() => handleToggleSubtask(subtask.id)}
                className="h-4 w-4"
              />
              <span
                className={`ml-2 ${subtask.completed ? "line-through text-gray-500" : "text-gray-800"
                  }`}
              >
                {subtask.title}
              </span>
            </div>
          ))}
          <div className="flex mt-4">
            <Input
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
              placeholder="Add subtask"
            />
            <Button onClick={handleAddSubtask} className="ml-2">
              Add
            </Button>
          </div>
        </div>
        <DialogFooter className="justify-center mt-6">
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddTaskDialog({ onAddTask }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = () => {
    if (title.trim() === "" || deadline.trim() === "") return;
    const newTask = {
      id: Date.now(),
      title,
      deadline,
      subtasks: [],
    };
    onAddTask(newTask);
    setTitle("");
    setDeadline("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            Add New Task
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Deadline"
          />
        </div>
        <DialogFooter className="justify-center mt-6">
          <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white">
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTaskDialog({ task, onDeleteConfirm, onClose }) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600">
            Delete Task
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-700">
          Are you sure you want to delete "<span className="font-semibold">{task.title}</span>"?
        </DialogDescription>
        <DialogFooter className="justify-center mt-3">
          <Button variant="ghost" onClick={handleClose} className="bg-gray-200 hover:bg-gray-300">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeleteConfirm} className="mb-2">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
