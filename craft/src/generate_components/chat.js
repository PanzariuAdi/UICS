import React, { useState, useEffect } from "react";

const ToggleableTextBox = (props) => {
  const [jsonData, setJsonData] = useState([]);
  const [text, setText] = useState("");

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handeClick = () => {
    const requestUrl = `http://localhost:8080/?input=${text}`;
    fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        setJsonData([data]);
        props.handleButtonClick(data);
      })
      .catch((error) => console.error("Error fetching JSON:", error));
  };

  return (
    <div className="mb-6 p-5 flex flex-col items-center justify-center bg-gray-200">
      <input
        type="text"
        className="block w-full p-4 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-150 "
        onChange={handleChange}
        value={text}
        style={{ padding: "5px", margin: "5px" }}
        placeholder="Insert prompt"
      />

      <button type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-5"
              onClick={handeClick}
              >
              Get results
      </button>
    </div>
  );
};

export default ToggleableTextBox;
