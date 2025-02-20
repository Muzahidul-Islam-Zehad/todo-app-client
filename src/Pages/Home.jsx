import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Providers/AuthProvider/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MdDragIndicator } from "react-icons/md";
import { FaCalendarAlt, FaTag, FaFire, FaTrash, FaEdit } from "react-icons/fa";

const Home = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const queryClient = useQueryClient();
    
    const { data = [], isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await axiosPublic.get(`/tasks?email=${user?.email}`);
            return response.data || [];
        }
    });

    const [tasks, setTasks] = useState({
        "To-Do": [],
        "In Progress": [],
        "Done": []
    });

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            const updatedTasks = { "To-Do": [], "In Progress": [], "Done": [] };
            data.forEach(item => {
                if (item.tasks && Array.isArray(item.tasks)) {
                    updatedTasks[item.category] = [...item.tasks];
                }
            });
            setTasks(updatedTasks);
        }
    }, [data]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        if (source.droppableId === destination.droppableId) return;

        const draggedTask = { ...tasks[source.droppableId][source.index] };
        draggedTask.category = destination.droppableId;

        const updatedTasks = { ...tasks };
        updatedTasks[source.droppableId].splice(source.index, 1);
        updatedTasks[destination.droppableId].splice(destination.index, 0, draggedTask);
        setTasks(updatedTasks);

        try {
            await axiosPublic.put(`/tasks/${draggedTask._id}`, { category: destination.droppableId });
            queryClient.invalidateQueries(['tasks']);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await axiosPublic.delete(`/tasks/${taskId}`);
            queryClient.invalidateQueries(['tasks']);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleUpdate = (task) => {
        console.log("Update Task:", task);
        // Here, you can open a modal or navigate to an update page
    };

    return (
        <div className="w-11/12 mx-auto py-8">
            <h1 className="text-4xl font-bold text-purple-700 text-center mb-6">Task Board</h1>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-3 gap-6">
                    {Object.keys(tasks).map((category) => (
                        <Droppable key={category} droppableId={category}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-100 p-6 rounded-xl shadow-md min-h-[350px] border border-gray-300"
                                >
                                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">{category}</h2>
                                    {tasks[category]?.map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`relative bg-white p-5 rounded-lg shadow-md mb-4 border-l-4 transition-transform
                                                    ${
                                                        category === "To-Do"
                                                            ? "border-blue-500"
                                                            : category === "In Progress"
                                                            ? "border-yellow-500"
                                                            : "border-green-500"
                                                    } ${
                                                        snapshot.isDragging ? "scale-105 shadow-lg" : ""
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <MdDragIndicator className="text-gray-500 text-xl cursor-grab mt-1" />
                                                        <div className="w-full">
                                                            <h3 className="font-semibold text-lg">{task.title}</h3>
                                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                                {task.description || "No description available..."}
                                                            </p>

                                                            <div className="mt-3 text-sm text-gray-700 space-y-1">
                                                                <p className="flex items-center gap-2">
                                                                    <FaCalendarAlt className="text-blue-500" />
                                                                    <span>Due: {task.dueDate || "Not set"}</span>
                                                                </p>
                                                                <p className="flex items-center gap-2">
                                                                    <FaTag className="text-green-500" />
                                                                    <span>Category: {task.category}</span>
                                                                </p>
                                                                <p className="flex items-center gap-2">
                                                                    <FaFire className={`text-${task.priority === "High" ? "red" : task.priority === "Medium" ? "yellow" : "gray"}-500`} />
                                                                    <span>Priority: {task.priority || "Medium"}</span>
                                                                </p>
                                                            </div>

                                                            {/* Delete & Update Buttons */}
                                                            <div className="flex justify-end gap-3 mt-4">
                                                                <button
                                                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 flex items-center gap-2"
                                                                    onClick={() => handleDelete(task._id)}
                                                                >
                                                                    <FaTrash /> Delete
                                                                </button>
                                                                <button
                                                                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center gap-2"
                                                                    onClick={() => handleUpdate(task)}
                                                                >
                                                                    <FaEdit /> Update
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
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
    );
};

export default Home;
