import Navbar from './Navbar'
import { IoMdAddCircle } from 'react-icons/io'
import Task from './Task'


const TodoList = ({ tasks, input, setInput, addTask, deleteTask }) => (
  <div className='w-[70%] bg-[#354ea3] py-4 px-9 rounded-[30px] overflow-y-scroll'>
    <Navbar />
    <h2 className='text-4xl bolder text-white pb-8'>
      What&apos;s up, Frenn!
    </h2>
    <div className='py-3 text-[#7d99e9]'>Laporan tugas harian &apos; Dan hasil pekerjaan</div>
    <form
      className='flex items-center justify-center'
      onSubmit={(e) => {
        e.preventDefault();
        addTask();
      }}
    >
      <input
        className='rounded-[10px] w-full p-[10px] border-none outline-none bg-[#031956] text-white mb-[10px]'
        placeholder='Tulis disini, okay?...'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <IoMdAddCircle
        onClick={(e) => {
          addTask(e);
        }}
        className='text-[#ea0aff] text-[50px] cursor-pointer ml-[20px] mb-[10px]'
      />
    </form>
    <ul>
      {/* Loop through all tasks here using the Task component */}
      {tasks.map(item => (
        <Task 
          key={item.id}
          taskText={item.taskText}
          onClick={deleteTask(item.id)}
        />
      ))}
    </ul>
  </div>
);

export default TodoList;
