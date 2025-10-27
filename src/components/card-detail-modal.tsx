'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CalendarIcon,
  Paperclip,
  Plus,
  Copy,
  X,
  Send,
  Upload,
  User,
  Edit2,
  Check,
  Square,
  Trash2,
  Percent,
  Lock,
  Unlock,
  Tag,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Board, Employee, ProjectPriority, ProjectStatus, SubTask, Task } from '@/api/types';
import toast from 'react-hot-toast';
import { addComment, deleteProject, deleteTask, getCommentsByProject } from '@/api/project.api';

interface CardDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task, isFinalSave?: boolean) => void;
  onDuplicate: (task: Task) => void;
  onDelete: (taskId: number) => void;
  isNewCard?: boolean;
  statuses: ProjectStatus[];
  priorities: ProjectPriority[];
  boardsData: Board[];
  employees: Employee[];
  fetchAllProjects: () => Promise<void>;
}

export function CardDetailModal({
  task,
  isOpen,
  onClose,
  onSave,
  onDuplicate,
  onDelete,
  isNewCard = false,
  statuses,
  priorities,
  boardsData,
  employees,
  fetchAllProjects,
}: CardDetailModalProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskOwner, setNewSubtaskOwner] = useState('');
  const [newSubtaskDate, setNewSubtaskDate] = useState<Date>();
  const [isLocked, setIsLocked] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const availableBoards = boardsData.map((b) => b.name);

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        owners: task.owners || [task.assignee],
        subtasks: task.subtasks || [],
        progress: task.progress || 0,
        progressEnabled: task.progressEnabled ?? false,
        boards: task.boards,
      });
      if (task.dueDate) {
        const parsedDate = new Date(task.dueDate);
        if (!isNaN(parsedDate.getTime())) {
          setSelectedDate(parsedDate);
        } else {
          setSelectedDate(undefined);
        }
      } else {
        setSelectedDate(undefined);
      }

      if (isNewCard) {
        setEditingTitle(true);
      }
    }
  }, [task, isNewCard]);

  useEffect(() => {
    fetchComments();
  }, [task]);

  const fetchComments = async () => {
    if (task?.id) {
      const res = await getCommentsByProject(task.id);
      if (res.success) {
        setEditedTask((prev) => (prev ? { ...prev, commentsArray: res.data } : prev));
      }
    }
  };

  useEffect(() => {
    if (editedTask && task) {
      const timeoutId = setTimeout(() => {
        onSave(editedTask);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [editedTask, onSave, task]);

  const handleDuplicate = () => {
    if (editedTask) {
      const duplicatedTask = {
        ...editedTask,
        id: Math.floor(Math.random() * 1000000),
        title: `${editedTask.title} (Copy)`,
      };
      onDuplicate(duplicatedTask);
      onClose();
    }
  };

  // Helper to always format as "YYYY-MM-DD"
  const formatDate = (dateValue?: Date): string => {
    if (!dateValue) return new Date().toISOString().split('T')[0];
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!projectId) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) return;

    try {
      const response = await deleteProject(projectId);

      if (response.success) {
        toast.success('Project deleted successfully!');
        fetchAllProjects();
        onClose();
      } else {
        toast.error(response.message || 'Failed to delete project.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Something went wrong while deleting the project.');
    }
  };

  const handleComplete = () => {
    if (editedTask) {
      const updatedTask = {
        ...editedTask,
        completed: !editedTask.completed,
      };
      setEditedTask(updatedTask);
      onSave(updatedTask);
    }
  };

  const addCustomField = () => {
    if (newFieldName && newFieldValue && editedTask) {
      setEditedTask({
        ...editedTask,
      });
      setNewFieldName('');
      setNewFieldValue('');
    }
  };

  const removeCustomField = (index: number) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const addSubtask = () => {
    if (newSubtaskTitle && newSubtaskOwner && editedTask) {
      const foundEmployee = employees.find((e) => e.name === newSubtaskOwner);

      const newSubtask: SubTask = {
        id: 0,
        title: newSubtaskTitle.trim(),
        assignedTo: foundEmployee?.id ?? employees[0]?.id ?? 1,
        assignee: foundEmployee?.name ?? newSubtaskOwner,
        dueDate: newSubtaskDate
          ? format(newSubtaskDate, 'yyyy-MM-dd')
          : new Date().toISOString().split('T')[0],
        completed: false,
      };

      const updatedTask: Task = {
        ...editedTask,
        subtasks: [...(editedTask.subtasks || []), newSubtask],
      };

      setEditedTask(updatedTask); 
      onSave(updatedTask); 
      setNewSubtaskTitle('');
      setNewSubtaskOwner('');
      setNewSubtaskDate(undefined);
    }
  };

  const toggleSubtaskComplete = (subtaskId: number) => {
    if (editedTask) {
      const updatedTask = {
        ...editedTask,
        subtasks:
          editedTask.subtasks?.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
          ) || [],
      };
      setEditedTask(updatedTask);
      onSave(updatedTask);
    }
  };

  const deleteSubtask = async (subtaskId: number) => {
    if (!editedTask) return;

    try {
      const response = await deleteTask(subtaskId);

      if (response.success) {
        toast.success('Subtask deleted successfully');

        const updatedTask = {
          ...editedTask,
          subtasks: editedTask.subtasks?.filter((subtask) => subtask.id !== subtaskId) || [],
        };

        setEditedTask(updatedTask);
        onSave(updatedTask);
      } else {
        toast.error(response.message || 'Failed to delete subtask');
      }
    } catch (error) {
      console.error('Error deleting subtask:', error);
      toast.error('Something went wrong while deleting subtask');
    }
  };

  const addCommentHandler = async () => {
    if (!editedTask?.id || editedTask.id === 0) {
      toast.error('Please save the project before adding comments');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await addComment({
        projectId: editedTask.id,
        content: newComment,
        userName: 'You',
      });

      if (response.success && response.data) {
        toast.success('Comment added successfully');

        const updatedComments = [...(editedTask.commentsArray || []), response.data];
        setEditedTask({
          ...editedTask,
          commentsArray: updatedComments,
        });

        setNewComment('');
      } else {
        toast.error(response.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Something went wrong while adding comment');
    }
  };

  const toggleBoard = (boardName: string) => {
    if (!editedTask || isLocked) return;

    const currentBoards = editedTask.boards || [];
    const isCurrentlySelected = currentBoards.includes(boardName);

    let newBoards: string[];
    if (isCurrentlySelected) {
      // Remove board if currently selected
      newBoards = currentBoards.filter((board) => board !== boardName);
    } else {
      // Add board if not currently selected
      newBoards = [...currentBoards, boardName];
    }

    const updatedTask = {
      ...editedTask,
      boards: newBoards,
    };
    setEditedTask(updatedTask);
    onSave(updatedTask);
  };

  if (!task || !editedTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[75vw] w-[75vw] max-h-[90vh] overflow-y-auto sm:max-w-[75vw]">
        <DialogTitle className="sr-only">Task Details</DialogTitle>
        <div className={editedTask.completed ? 'opacity-60 grayscale' : ''}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {editingTitle ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                      className="text-lg font-semibold max-w-md"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingTitle(false);
                        if (e.key === 'Escape') setEditingTitle(false);
                      }}
                      autoFocus
                      onFocus={(e) => {
                        if (isNewCard && editedTask.title === 'New Task') {
                          e.target.select();
                        }
                      }}
                      disabled={isLocked}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTitle(false)}
                      disabled={isLocked}
                      className="ml-4 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <DialogTitle className="text-xl">{editedTask.title}</DialogTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingTitle(true)}
                      disabled={isLocked}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-2 items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleComplete}
                  className={
                    editedTask.completed
                      ? 'bg-gray-400 hover:bg-gray-500 text-white border-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                  }
                  disabled={isLocked}
                >
                  {editedTask.completed ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Square className="h-4 w-4 mr-2" />
                  )}
                  {editedTask.completed ? 'Mark Incomplete' : 'Complete'}
                </Button>
                <Button
                  variant={editedTask.progressEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    setEditedTask({ ...editedTask, progressEnabled: !editedTask.progressEnabled })
                  }
                  className="ml-2 p-2"
                  disabled={isLocked}
                >
                  <Percent className="h-4 w-4" />
                </Button>
                <Button
                  variant={isLocked ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsLocked(!isLocked)}
                  className="ml-2 p-2"
                >
                  {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicate}
                  className="ml-2 bg-transparent"
                  disabled={isLocked}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteProject(editedTask?.id ?? 0)}
                  className="ml-2 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLocked}
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>

              {/* ✅ New Save Project Button */}
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  if (editedTask) {
                    onSave(editedTask, true);
                  }
                }}
                disabled={isLocked}
              >
                <Send className="h-4 w-4 mr-2" />
                Save Project
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-16 mt-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Progress Bar */}
              {editedTask.progressEnabled && (
                <div className="space-y-3 mb-4">
                  <label className="text-sm font-medium mb-3 block">Progress</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <div
                        className={`w-full bg-muted rounded-full h-3 border border-gray-300 ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        onClick={(e) => {
                          if (isLocked) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const percentage = Math.round((x / rect.width) * 100);
                          const clampedPercentage = Math.max(0, Math.min(100, percentage));
                          setEditedTask({ ...editedTask, progress: clampedPercentage });
                        }}
                      >
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-300 relative"
                          style={{ width: `${editedTask.progress || 0}%` }}
                        >
                          <div
                            className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-primary border-2 border-white rounded-full shadow-md ${isLocked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
                            onMouseDown={(e) => {
                              if (isLocked) return;
                              e.preventDefault();
                              const startX = e.clientX;
                              const startProgress = editedTask.progress || 0;
                              const progressBar = e.currentTarget.parentElement?.parentElement;

                              const handleMouseMove = (moveEvent: MouseEvent) => {
                                if (progressBar) {
                                  const rect = progressBar.getBoundingClientRect();
                                  const deltaX = moveEvent.clientX - startX;
                                  const deltaPercentage = (deltaX / rect.width) * 100;
                                  const newProgress = Math.max(
                                    0,
                                    Math.min(100, startProgress + deltaPercentage),
                                  );
                                  setEditedTask({
                                    ...editedTask,
                                    progress: Math.round(newProgress),
                                  });
                                }
                              };

                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                              };

                              document.addEventListener('mousemove', handleMouseMove);
                              document.addEventListener('mouseup', handleMouseUp);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                      {editedTask.progress || 0}%
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                {editingDescription ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedTask.description}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, description: e.target.value })
                      }
                      rows={4}
                      placeholder="Add a description..."
                      disabled={isLocked}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setEditingDescription(false)}
                        disabled={isLocked}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Done
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingDescription(false)}
                        disabled={isLocked}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-3 border rounded-md min-h-[100px] ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted/50'}`}
                    onClick={() => {
                      if (!isLocked) setEditingDescription(true);
                    }}
                  >
                    {editedTask.description || 'Click to add a description...'}
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Tasks ({editedTask.subtasks?.length || 0})
                </h3>
                <div className="space-y-3">
                  {editedTask.subtasks?.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-3 p-3 border rounded-md">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSubtaskComplete(subtask.id)}
                        className="p-0 h-auto"
                        disabled={isLocked}
                      >
                        {subtask.completed ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm truncate ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {subtask.title}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          {/* <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs">
                              {subtask.owner
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{subtask.owner}</span> */}
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{subtask.dueDate}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSubtask(subtask.id)}
                          className="p-1 h-auto text-red-500 hover:text-red-700"
                          disabled={isLocked}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {!newSubtaskTitle ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (isLocked) return;
                        setNewSubtaskTitle(' ');
                        setNewSubtaskOwner('You');
                      }}
                      className="w-auto p-2 h-auto text-muted-foreground hover:text-foreground border border-gray-300 hover:border-gray-400"
                      disabled={isLocked}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/20">
                      <Input
                        placeholder="Task title"
                        value={newSubtaskTitle === ' ' ? '' : newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        className="flex-1"
                        autoFocus
                        disabled={isLocked}
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 h-auto rounded-full bg-gray-100 hover:bg-gray-200"
                            disabled={isLocked}
                          >
                            <User className="h-4 w-4 text-gray-600" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2" align="center">
                          <Select
                            value={newSubtaskOwner}
                            onValueChange={setNewSubtaskOwner}
                            disabled={isLocked}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select owner" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees && employees.length > 0 ? (
                                employees.map((emp) => (
                                  <SelectItem key={emp.id} value={emp.name}>
                                    {emp.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="You">You</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 h-auto"
                            disabled={isLocked}
                          >
                            <CalendarIcon className="h-4 w-4 text-gray-600" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <Calendar
                            mode="single"
                            selected={newSubtaskDate}
                            onSelect={(date) => {
                              if (!date) return;
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const selected = new Date(date);
                              selected.setHours(0, 0, 0, 0);

                              if (selected < today) {
                                toast.error('Subtask due date cannot be in the past');
                                return;
                              }
                              setNewSubtaskDate(date);
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        size="sm"
                        onClick={addSubtask}
                        disabled={!newSubtaskTitle.trim() || !newSubtaskOwner || isLocked}
                        className="p-2 h-auto bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNewSubtaskTitle('');
                          setNewSubtaskOwner('');
                          setNewSubtaskDate(undefined);
                        }}
                        className="p-2 h-auto text-red-500 hover:text-red-700"
                        disabled={isLocked}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Comments ({editedTask.commentsArray?.length || 0})
                </h3>

                <div className="space-y-3">
                  {editedTask.commentsArray && editedTask.commentsArray.length > 0 ? (
                    editedTask.commentsArray.map((comment) => (
                      <div key={comment.id} className="flex gap-3 items-start">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/diverse-team-member.png" alt="avatar" />
                          <AvatarFallback>
                            {comment.userName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 bg-gray-50 border rounded-lg p-2">
                          <p className="text-sm font-medium">{comment.userName}</p>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No comments yet</p>
                  )}

                  <div className="flex gap-3 mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/diverse-team-member.png" />
                      <AvatarFallback>YO</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        disabled={isLocked}
                      />
                      <Button
                        size="sm"
                        className="mt-2"
                        disabled={
                          !newComment.trim() || isLocked || !editedTask?.id || editedTask.id === 0
                        }
                        onClick={addCommentHandler}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {/* <div>
                <h3 className="text-sm font-medium mb-3">Attachments ({task.attachments})</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 border rounded-md">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">research-findings.pdf</span>
                    <span className="text-xs text-muted-foreground ml-auto">2.4 MB</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    disabled={isLocked}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Attachment
                  </Button>
                </div>
              </div> */}

              {/* Custom Fields
              <div>
                <h3 className="text-sm font-medium mb-3">Custom Fields</h3>
                <div className="space-y-3">
                  {editedTask.customFields?.map((field, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                      <div className="flex-1">
                        <span className="text-sm font-medium">{field.name}:</span>
                        <span className="text-sm text-muted-foreground ml-2">{field.value}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCustomField(index)}
                        disabled={isLocked}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <Input
                      placeholder="Field name"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      disabled={isLocked}
                    />
                    <Input
                      placeholder="Field value"
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      disabled={isLocked}
                    />
                    <Button
                      size="sm"
                      onClick={addCustomField}
                      disabled={!newFieldName || !newFieldValue || isLocked}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                    </Button>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Priority */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Status & Priority</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium mb-2 block">Status</label>
                    <Select
                      value={editedTask.status}
                      onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
                      disabled={isLocked}
                    >
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(editedTask.status)}`}
                          />
                          <SelectValue placeholder="Select Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {statuses && statuses.length > 0 ? (
                          statuses.map((status) => (
                            <SelectItem key={status.id} value={status.name}>
                              {status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none">No Status Found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-2 block">Priority</label>
                    <Select
                      value={editedTask.priority}
                      onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
                      disabled={isLocked}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities?.map((p) => (
                          <SelectItem key={p.id} value={p.name}>
                            {p?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Due Date */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Due Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                        disabled={isLocked}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (!date) return;
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const selected = new Date(date);
                          selected.setHours(0, 0, 0, 0);

                          if (selected < today) {
                            toast.error('You cannot select a past date for due date');
                            return;
                          }

                          setSelectedDate(date);
                          if (editedTask) {
                            const formattedDate = formatDate(date);
                            setEditedTask({ ...editedTask, dueDate: formattedDate });
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              {/* Owners */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Owners</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {editedTask.owners?.map((owner, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/diverse-team-member.png" />
                        <AvatarFallback className="text-xs">
                          {owner
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{owner}</span>
                    </div>
                  ))}
                  <Select
                    onValueChange={(value) => {
                      if (editedTask) {
                        setEditedTask({
                          ...editedTask,
                          owners: [...(editedTask.owners || []), value],
                        });
                      }
                    }}
                    disabled={isLocked}
                  >
                    <SelectTrigger className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Add Owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.name}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Boards */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Boards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {editedTask.boards?.map((board, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                        onClick={() => toggleBoard(board)}
                      >
                        {board}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Available Boards:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableBoards
                        .filter(
                          (board) =>
                            board !== 'All Projects' && !editedTask.boards?.includes(board),
                        )
                        .map((board) => (
                          <Badge
                            key={board}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-muted"
                            onClick={() => toggleBoard(board)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {board}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
