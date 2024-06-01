import { useEffect, useState } from 'react';
import WrongNetworkMessage from '../components/WrongNetworkMessage';
import ConnectWalletButton from '../components/ConnectWalletButton';
import TodoList from '../components/TodoList';
import { TaskContractAddress } from '../config.js';
import TaskAbi from '../../backend/build/contracts/TaskContract.json';
import { ethers } from 'ethers';

export default function Home() {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const init = async () => {
      await connectWallet();
      if (isUserLoggedIn && correctNetwork) {
        await getAllTasks();
      }
    };
    init();
  }, [isUserLoggedIn, correctNetwork]);

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Please install Metamask');
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log('connected to chain:', chainId);

      const sepoliaChainId = '0xaa36a7';
      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia network');
        setCorrectNetwork(false);
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Found account', accounts[0]);
      setIsUserLoggedIn(true);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log('ethereum object does not exist');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add tasks from front-end onto the blockchain
  const addTask = async (e) => {
    e.preventDefault();

    let task = {
      taskText: input,
      isDeleted: false
    };

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        TaskContract.addTask(task.taskText, task.isDeleted)
          .then((res) => {
            setTasks([...tasks, task]);
            console.log('Task added');
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log('Ethereum object does not exist!');
      }
    } catch (error) {
      console.log(error);
    }
    setInput('');
  };


  const deleteTask = key => async () => {
     try{
       const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
       const deleteTaskTx = await TaskContract.deleteTask(key, true)
       console.log('Task deleted', deleteTaskTx) 

        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log('Ethereum object Not Found!')
      } 

     } catch (error) {
       console.log(error);
     }

  }


  return (
    <div className='bg-[#97b5fe] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? (
        <ConnectWalletButton connectWallet={connectWallet} />
      ) : !correctNetwork ? (
        <WrongNetworkMessage />
      ) : (
        <TodoList tasks={tasks} input={input} setInput={setInput} addTask={addTask} deleteTask={deleteTask} />
      )}
    </div>
  );
}
