import React from 'react';
import { useDrag } from 'react-dnd';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import buildImageUrl from '@/lib/image';
import { Calendar, MessageCircle, Paperclip } from 'lucide-react';
import { Task } from './KanbanBoard';

export function TaskCard({ task, columnId }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, columnId },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging(), }),
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div ref={drag} className={`bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-shadow dark:bg-black ${isDragging ? 'opacity-50' : ''}`}>
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
          {task.priority.toUpperCase()}
        </Badge>
        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Task Title and Description */}
      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 dark:text-gray-200">{task.title}</h4>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 dar:text-gray-500">{task.description}</p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {task.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={buildImageUrl(task.avatar)} alt={task.assignee} />
            <AvatarFallback className="text-xs">
              {task.assignee.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600">{task.assignee}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-400">
          <div className="flex items-center">
            <MessageCircle className="w-3 h-3 mr-1" />
            <span className="text-xs">2</span>
          </div>
          <div className="flex items-center">
            <Paperclip className="w-3 h-3 mr-1" />
            <span className="text-xs">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}