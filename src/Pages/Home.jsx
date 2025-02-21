import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../Providers/AuthProvider/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MdDragIndicator } from "react-icons/md";
import { FaCalendarAlt, FaTag, FaFire, FaTrash, FaEdit, FaHourglassStart } from "react-icons/fa";
import Swal from "sweetalert2";
import { format } from "date-fns";

const Home = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const queryClient = useQueryClient();
    const modalRef = useRef();
    const [titleLen, setTitlelen] = useState(0);
    const [desLen, setDeslen] = useState(0);
    const [loading, setLoading] = useState(false);
    const [taskID, setTaskID] = useState(null);

    const { data = [], isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await axiosPublic.get(`/tasks?email=${user?.email}`);
            return response.data || [];
        }
    });
    const [task, setTask] = useState({
        title: "",
        description: "",
        category: "To-Do",
        dueDate: "",
        priority: "Medium",
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
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosPublic.delete(`/tasks/${taskId}`);
                    queryClient.invalidateQueries(['tasks']);
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your task has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error("Error deleting task:", error);
                }

            }
        });

    };

    const handleUpdate = (task) => {
        console.log("Update Task:", task);
        // Here, you can open a modal or navigate to an update page
        modalRef.current?.showModal();

        setTaskID(null);

        setTask({
            title: task?.title,
            description: task?.description,
            category: task?.category,
            dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
            priority: task.priority,
        })
        setTitlelen(task?.title.length);
        setDeslen(task?.description.length);
        setTaskID(task._id);
    };

    const handleChange = async (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('submit the form');

        setLoading(true);
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;
        const dueDate = format(new Date(form.dueDate.value), "PP");
        const priority = form.priority.value;
        const email = user?.email;


        const updateTaskData = { title, description, category, dueDate, priority, email };


        try {
            await axiosPublic.patch(`/tasks/${taskID}`, updateTaskData);
            queryClient.invalidateQueries(['tasks']);
            modalRef.current?.close();
            Swal.fire({
                title: "Updated!",
                text: "Your task has been updated.",
                icon: "success"
            });
        } catch (error) {
            console.error("Error deleting task:", error);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="w-11/12 mx-auto py-8">
            <h1 className="text-4xl font-bold text-purple-700 text-center mb-6">Task Board</h1>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                                    ${category === "To-Do"
                                                            ? "border-blue-500"
                                                            : category === "In Progress"
                                                                ? "border-yellow-500"
                                                                : "border-green-500"
                                                        } ${snapshot.isDragging ? "scale-105 shadow-lg" : ""
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



            {/* Update task modal */}

            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <dialog ref={modalRef} className={`modal z-10`}>
                <div className="modal-box">
                    <button type="button" onClick={() => modalRef.current?.close()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

                    <div className="mb-3">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#7B2CBF] text-center">
                            Update Task
                        </h1>
                    </div>


                    {/* form for update task */}
                    <form onSubmit={handleSubmit} className="bg-[#E6E6FA] p-6 rounded-xl shadow-md">
                        <label className="block text-[#7B2CBF] font-medium">Task Title</label>
                        <input
                            type="text"
                            name="title"
                            maxLength="50"
                            value={task.title}
                            onChange={(e) => { handleChange(e), setTitlelen(e.target.value.length) }}
                            className="input w-full mt-1  bg-white border border-[#7B2CBF] focus:ring-2 focus:ring-[#007BFF]"
                            placeholder="Enter task title"
                            required
                        />
                        <p className="text-xs mt-1 text-right text-[#121212]">{titleLen}/50</p>

                        <label className="block text-[#7B2CBF] font-medium">Description</label>
                        <textarea
                            name="description"
                            maxLength="200"
                            value={task.description}
                            onChange={(e) => { handleChange(e), setDeslen(e.target.value.length) }}
                            className="textarea w-full mt-1 bg-white border border-[#7B2CBF] focus:ring-2 focus:ring-[#007BFF]"
                            placeholder="Enter task description"
                        ></textarea>
                        <p className="text-xs mt-1 text-right text-[#121212]">{desLen}/200</p>

                        <label className="block text-[#7B2CBF] font-medium">Category</label>
                        <select
                            name="category"
                            value={task.category}
                            onChange={handleChange}
                            className="select w-full mt-1 mb-3 bg-white border border-[#7B2CBF] focus:ring-2 focus:ring-[#007BFF]"
                        >
                            <option>To-Do</option>
                            <option>In Progress</option>
                            <option>Done</option>
                        </select>

                        <label className="block text-[#7B2CBF] font-medium">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={task.dueDate}
                            onChange={handleChange}
                            className="input w-full mt-1 mb-3 bg-white border border-[#7B2CBF] focus:ring-2 focus:ring-[#007BFF]"
                        />

                        <label className="block text-[#7B2CBF] font-medium">Priority</label>
                        <select
                            name="priority"
                            value={task.priority}
                            onChange={handleChange}
                            className="select w-full mt-1 mb-3 bg-white border border-[#7B2CBF] focus:ring-2 focus:ring-[#007BFF]"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>

                        {/* Submit Button */}
                        <button type="submit" disabled={loading} className="w-full btn bg-[#007BFF]  text-white font-bold rounded-lg hover:bg-[#00A6FB] transition-all">
                            {
                                loading ? <span className={`animate-spin`}><FaHourglassStart /></span>
                                    :
                                    `Update Task`
                            }

                        </button>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default Home;
