import { useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { format } from "date-fns";

const AddTask = () => {
    const axiosPublic = useAxiosPublic();
    const [task, setTask] = useState({
        title: "",
        description: "",
        category: "To-Do",
        dueDate: "",
        priority: "Medium",
    });
    const [titleLen, setTitlelen] = useState(0);
    const [desLen, setDeslen] = useState(0);

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;
        const dueDate = format(new Date(form.dueDate.value), "PP") ;
        const priority = form.priority.value;


        const addTaskData = { title, description, category, dueDate, priority };

        try{
            const {data} = await axiosPublic.post('/tasks', addTaskData);
            console.log(data);
        }
        catch(err)
        {
            console.log(err);
        }

        // console.log(addTaskData);
        
    }

    // console.log(titleLen);
    return (
        <div className="w-11/12 mx-auto py-8">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-[#7B2CBF]">Create a New Task</h1>
            <p className="text-[#121212] mb-6">Organize your workflow efficiently. Add details below!</p>

            {/* Layout Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Task Form */}
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
                    <button type="submit" className="w-full py-2 mt-3 bg-[#007BFF] text-white font-bold rounded-lg hover:bg-[#00A6FB] transition-all">
                        Add Task
                    </button>
                </form>

                {/* Right: Live Task Preview */}
                <div className="bg-[#E6E6FA] p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-[#7B2CBF] mb-3">Task Preview</h2>
                    <div className="p-4 bg-[#00A6FB] text-white rounded-lg shadow-md">
                        <h3 className="text-lg font-bold">{task.title || "Task Title Here"}</h3>
                        <p className="text-sm mb-2">{task.description || "Task description preview..."}</p>
                        <p className="text-xs">📅 Due: {task.dueDate  ? format(new Date(task?.dueDate), "PP") : "Not set"}</p>
                        <p className="text-xs">🏷️ Category: {task.category}</p>
                        <p className="text-xs">🔥 Priority: {task.priority}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTask;
