import { useState } from "react";
import contractABI from "./abi.json";
const { ethers } = require("ethers");

function App() {
  const [inputMessage, setInputMessage] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  const contractAddress = "0xcD639D00c826De3189E4c6bA1291566385471a5c";

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function setMessage() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const transaction = await contract.setMessage(inputMessage);
        await transaction.wait();
        setInputMessage("");
        console.log("Message set successfully");
      } catch (err) {
        console.error("Error setting message:", err);
      }
    } else {
      console.error("Metamask not installed");
    }
  }

  async function getMessage() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const message = await contract.getMessage();
        setDisplayMessage(message);
        console.log("Message retrieved successfully");
      } catch (err) {
        console.error("Error retrieving message:", err);
      }
    } else {
      console.error("Metamask not installed");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl font-bold underline mb-8">My Message App</h1>

      <div className="mb-4">
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 mr-2"
          placeholder="Enter message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={setMessage}
        >
          Set Message
        </button>
      </div>

      <div className="flex flex-col justify-center items-center">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={getMessage}
        >
          Get Message
        </button>
        <div className="border border-gray-300 rounded-md p-2 mt-2">
          Message: {displayMessage}
        </div>
      </div>
    </div>
  );
}

export default App;