"use client"

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';


const initialColumns = [
  {
    id: 'todo',
    title: 'Pendente',
    color: 'bg-blue-500',
    tasks: [
      {
        id: '1',
        title: 'Design System Update',
        description: 'Update the design system components and documentation',
        priority: 'high',
        assignee: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        dueDate: '2024-02-15',
        tags: ['Design', 'UI/UX']
      },
      {
        id: '2',
        title: 'API Integration',
        description: 'Integrate third-party payment API',
        priority: 'medium',
        assignee: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        tags: ['Backend', 'API']
      }
    ]
  },
  {
    id: 'progress',
    title: 'Em andamento',
    color: 'bg-yellow-500',
    tasks: [
      {
        id: '3',
        title: 'Mobile App Development',
        description: 'Develop responsive mobile application',
        priority: 'high',
        assignee: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        dueDate: '2024-02-20',
        tags: ['Mobile', 'React Native']
      }
    ]
  },
  {
    id: 'review',
    title: 'Revisando',
    color: 'bg-purple-500',
    tasks: [
      {
        id: '4',
        title: 'Code Review',
        description: 'Review pull requests and merge changes',
        priority: 'medium',
        assignee: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
        tags: ['Code Review', 'QA']
      }
    ]
  },
  {
    id: 'done',
    title: 'Finalizado',
    color: 'bg-green-500',
    tasks: [
      {
        id: '5',
        title: 'User Authentication',
        description: 'Implement secure user authentication system',
        priority: 'high',
        assignee: 'Alex Brown',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
        tags: ['Security', 'Backend']
      }
    ]
  }
];

export function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [searchTerm, setSearchTerm] = useState('');

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return;

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];

      // Find source and target columns
      const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
      const targetColumn = newColumns.find(col => col.id === targetColumnId);

      if (!sourceColumn || !targetColumn) return prevColumns;

      const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) return prevColumns;

      const [task] = sourceColumn.tasks.splice(taskIndex, 1);

      targetColumn.tasks.push(task);

      return newColumns;
    });
  };

  const addNewTask = (columnId) => {
    const newTask = {
      id: Date.now().toString(),
      title: 'New Task',
      description: 'Task description',
      priority: 'medium',
      assignee: 'Unassigned',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      tags: []
    };

    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId ? { ...column, tasks: [...column.tasks, newTask] } : column
      )
    );
  };

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Quadro de Projetos</h1>
              <p className="text-sm text-gray-600 mt-1">Organize seus afazeres</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Pesquisar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-64"/>
              </div>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />Filtro
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />Configurações
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />Adicionar tarefa
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex space-x-6 h-full min-w-max">
            {filteredColumns.map(column => (
              <KanbanColumn key={column.id} column={column} onMoveTask={moveTask} onAddTask={() => addNewTask(column.id)}/>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}