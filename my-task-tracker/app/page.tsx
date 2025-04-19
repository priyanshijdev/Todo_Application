"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Toaster } from "sonner";
import { Plus, Search, X, Check, Trash2, Edit, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  priority: "low" | "medium" | "high";
};

export default function Home() {
  // const
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const savedTodos = localStorage.getItem("todos");
      return savedTodos ? JSON.parse(savedTodos) : [];
    }
    return [];
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
  // add a new todo:
  const addTodo = () => {
    if (!newTodo.trim()) return;

    const newTodoItem: Todo = {
      id: Date.now().toString(),
      title: newTodo,
      description: newDescription,
      completed: false,
      createdAt: new Date(),
      priority: newPriority,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
    setNewDescription("");
    setNewPriority("medium");
    setIsAddDialogOpen(false);

    toast.success("successfully!", {
      description: "New todo added!",
    });
  };
  // delete a todo:
  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("successfully!", {
      description: "Todo deleted!",
    });
  };
  //  // Toggle todo completion status
  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  // edit a toido:
  const startEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditDialogOpen(true);
  };
  // save edit Todo:
  const handleSaveEdit = () => {
    if (!editingTodo) return;

    if (editingTodo.title.trim() === "") {
      toast.error("error!", {
        description: "Todo title cannot be empty!",
      });
      return;
    }
    setTodos(
      todos.map((todo) => (todo.id === editingTodo.id ? editingTodo : todo))
    );

    setEditingTodo(null);
    setIsEditDialogOpen(false);
    toast.success("successfully!", {
      description: "Todo edited!",
    });
    toast.success("successfully!", {
      description: "Todo updated successfully!",
    });
  };
  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    toast.success("successfully!", {
      description: "All completed todos cleared!",
    });
  };
  /// Filter and sort todos
  const filteredTodos = todos
    .filter((todo) => {
      // Apply search filter
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply tab filter
      if (activeFilter === "active") return !todo.completed && matchesSearch;
      if (activeFilter === "completed") return todo.completed && matchesSearch;
      return matchesSearch;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  function renderTodoList(todos: Todo[]) {
    if (todos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="rounded-full bg-muted p-3">
            <Check className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No todos found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "Try a different search term"
              : "Add a new todo to get started"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              "flex items-start justify-between p-4 rounded-lg border",
              todo.completed ? "bg-muted/50" : ""
            )}
          >
            <div className="flex items-start space-x-3 flex-1">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-full p-0 flex-shrink-0 mt-1",
                  todo.completed ? "bg-primary text-primary-foreground" : ""
                )}
                onClick={() => toggleComplete(todo.id)}
              >
                {todo.completed && <Check className="h-3 w-3" />}
              </Button>
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-medium",
                    todo.completed ? "line-through text-muted-foreground" : ""
                  )}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={cn(
                      "text-sm text-muted-foreground mt-1",
                      todo.completed ? "line-through" : ""
                    )}
                  >
                    {todo.description}
                  </p>
                )}
                <div className="flex items-center mt-2 space-x-2">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getPriorityColor(todo.priority))}
                  >
                    {todo.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => startEditTodo(todo)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTodo(todo.id)}
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <>
      <Card className="w-full justify-center">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Todo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Todo</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter todo title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Enter todo description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <div className="flex gap-2">
                    {["low", "medium", "high"].map((priority) => (
                      <Button
                        key={priority}
                        type="button"
                        variant={
                          newPriority === priority ? "default" : "outline"
                        }
                        onClick={() =>
                          setNewPriority(priority as "low" | "medium" | "high")
                        }
                        className="flex-1"
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addTodo}>Add Todo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search todos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1.5 h-7 w-7 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Sort by Date{" "}
                  {sortBy === "date" && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("priority")}>
                  Sort by Priority{" "}
                  {sortBy === "priority" && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>
                  Sort Alphabetically{" "}
                  {sortBy === "alphabetical" && (
                    <Check className="ml-2 h-4 w-4" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs
            defaultValue="all"
            value={activeFilter}
            onValueChange={setActiveFilter}
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              {renderTodoList(filteredTodos)}
            </TabsContent>
            <TabsContent value="active" className="mt-0">
              {renderTodoList(filteredTodos)}
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              {renderTodoList(filteredTodos)}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            {/* {todos.length} {todos.length === 1 ? "todo" : "todos"} */}
            {todos.filter((todo) => todo.completed).length}
            {" items left "}
          </div>
          <Button variant="outline" size="sm" onClick={clearCompleted}>
            Clear completed
          </Button>
        </CardFooter>
        {/* Edit Todo Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Todo</DialogTitle>
            </DialogHeader>
            {editingTodo && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingTodo.title}
                    onChange={(e) =>
                      setEditingTodo({ ...editingTodo, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingTodo.description}
                    onChange={(e) =>
                      setEditingTodo({
                        ...editingTodo,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <div className="flex gap-2">
                    {["low", "medium", "high"].map((priority) => (
                      <Button
                        key={priority}
                        type="button"
                        variant={
                          editingTodo.priority === priority
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setEditingTodo({
                            ...editingTodo,
                            priority: priority as "low" | "medium" | "high",
                          })
                        }
                        className="flex-1"
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
