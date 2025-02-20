import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

const initialTasks = {
  "todo": [
    { id: "1", title: "Design Wireframes", priority: "High", dueDate: "12 March 2025" },
    { id: "2", title: "Setup Database", priority: "Medium", dueDate: "15 March 2025" },
  ],
  "inProgress": [
    { id: "3", title: "Implement Login", priority: "Low", dueDate: "10 March 2025" },
  ],
  "done": [
    { id: "4", title: "Project Setup", priority: "Medium", dueDate: "5 March 2025" },
  ],
};

const priorityColors = {
  Low: "bg-green-200 text-green-900",
  Medium: "bg-yellow-200 text-yellow-900",
  High: "bg-red-200 text-red-900",
}; 


const Home = () => {
    const [tasks, setTasks] = useState(initialTasks);

    const onDragEnd = (result) => {
      if (!result.destination) return;
      
      const { source, destination } = result;
  
      if (source.droppableId === destination.droppableId) {
        const copiedTasks = Array.from(tasks[source.droppableId]);
        const [movedTask] = copiedTasks.splice(source.index, 1);
        copiedTasks.splice(destination.index, 0, movedTask);
        setTasks({ ...tasks, [source.droppableId]: copiedTasks });
      } else {
        const sourceTasks = Array.from(tasks[source.droppableId]);
        const destTasks = Array.from(tasks[destination.droppableId]);
        const [movedTask] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, movedTask);
        setTasks({
          ...tasks,
          [source.droppableId]: sourceTasks,
          [destination.droppableId]: destTasks,
        });
      }
    };
    return (
        <div>
            <div className="w-11/12 mx-auto py-8">
                <h1 className="text-3xl font-bold text-[#7B2CBF] text-center">Task Board</h1>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {Object.entries(tasks).map(([status, taskList]) => (
                            <Droppable key={status} droppableId={status}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="bg-[#E6E6FA] p-4 rounded-lg shadow-md min-h-[300px]"
                                    >
                                        <h2 className="text-xl font-bold text-white bg-[#7B2CBF] py-2 px-4 rounded-md">
                                            {status === "todo" ? "To-Do" : status === "inProgress" ? "In Progress" : "Done"}
                                        </h2>

                                        {taskList.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className={`mt-3 p-4 rounded-md shadow-md ${priorityColors[task.priority]} cursor-pointer`}
                                                    >
                                                        <h3 className="font-bold">{task.title}</h3>
                                                        <p className="text-sm">📅 Due: {task.dueDate}</p>
                                                        <p className="text-xs font-semibold">🔥 {task.priority} Priority</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default Home;