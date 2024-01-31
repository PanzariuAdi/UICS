import React, { useState, useEffect } from "react";
const ToggleableTextBox = (props) => {
  const [jsonData, setJsonData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState("Footer with 5 paragraph red and 5 image.");
  const toggleVisibility = () => setIsVisible(!isVisible);

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
    <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
      <div
        onClick={toggleVisibility}
        style={{ cursor: "pointer", marginBottom: "5px" }}
      >
        Click to {isVisible ? "hide" : "show"} text box
      </div>
      {isVisible && (
        <input
          type="text"
          value={text}
          style={{ padding: "5px", margin: "5px" }}
        />
      )}

      <button onClick={handeClick}>Click Me</button>
    </div>
  );
};

export default ToggleableTextBox;
