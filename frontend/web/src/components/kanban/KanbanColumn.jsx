import React from 'react';
import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Column, Task } from './KanbanBoard';


export function KanbanColumn({ column, onMoveTask, onAddTask }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {onMoveTask(item.id, item.columnId, column.id);},
    collect: (monitor) => ({isOver: !!monitor.isOver(),}),
  });

  return (
    <div className="flex flex-col w-80 bg-white rounded-lg shadow-sm border border-gray-200 h-full dark:bg-black">
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
            <h3 className="font-medium text-gray-300">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {column.tasks.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tasks Container */}
      <div ref={drop} className={`flex-1 p-4 space-y-3 overflow-y-auto ${ isOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : ''}`}>
        {column.tasks.map(task => (
          <TaskCard key={task.id} task={task} columnId={column.id} />
        ))}
        
        {column.tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Transl className="text-sm">No tasks yet</Transl>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 dark:hover:text-gray-200" onClick={onAddTask}>
          <Plus className="w-4 h-4 mr-2" />
          <Transl>
          Adicionar tarefa
          </Transl>
        </Button>
      </div>
    </div>
  );
}