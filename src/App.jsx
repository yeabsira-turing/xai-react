// App.jsx
import React, { useState } from 'react';
import TaskList from './TaskList';
import AddTaskModal from './AddTaskModal';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now(), subtasks: [] }]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
      <TaskList tasks={tasks} setTasks={setTasks} />
      <AddTaskModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} onAddTask={addTask} />
    </div>
  );
}

// TaskList.jsx
import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, setTasks }) => (
  <div className="grid gap-4">
    {tasks.map(task => (
      <TaskItem key={task.id} task={task} setTasks={setTasks} />
    ))}
  </div>
);

// TaskItem.jsx
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import TaskDetail from './TaskDetail';

const TaskItem = ({ task, setTasks }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <Card onClick={() => setIsDetailOpen(true)} className="cursor-pointer">
      <CardContent>
        <h3>{task.title}</h3>
        <TaskDetail task={task} isOpen={isDetailOpen} close={() => setIsDetailOpen(false)} setTasks={setTasks} />
      </CardContent>
    </Card>
  );
};

// TaskDetail.jsx
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from "@/components/ui/modal";
import SubTaskItem from './SubTaskItem';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const TaskDetail = ({ task, isOpen, close, setTasks }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const updateTask = (updates) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...updates } : t));
  };

  return (
    <Modal open={isOpen} onOpenChange={close}>
      <ModalContent>
        <ModalHeader className="space-y-2">
          <h2>{task.title}</h2>
          <p>Deadline: {task.deadline}</p>
        </ModalHeader>
        <ModalBody>
          {task.subtasks.map(sub => <SubTaskItem key={sub.id} subtask={sub} updateTask={updateTask} />)}
          <button 
            onClick={() => setIsDeleteModalOpen(true)} 
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete Task
          </button>
        </ModalBody>
        <ConfirmDeleteModal 
          isOpen={isDeleteModalOpen} 
          closeModal={() => setIsDeleteModalOpen(false)} 
          onConfirm={() => {
            setTasks(prev => prev.filter(t => t.id !== task.id));
            close();
          }}
        />
      </ModalContent>
    </Modal>
  );
};

// SubTaskItem.jsx
import React from 'react';

const SubTaskItem = ({ subtask, updateTask }) => (
  <div className="flex items-center">
    <input type="checkbox" checked={subtask.completed} onChange={() => updateTask({subtasks: subtask.completed ? [...subtask, {completed: false}] : [...subtask, {completed: true}]})} />
    <span style={{textDecoration: subtask.completed ? 'line-through' : 'none'}}>{subtask.name}</span>
  </div>
);

// AddTaskModal.jsx and ConfirmDeleteModal.jsx would follow similar structures using Shadcn's modal components.
