import Chat from "./chat";
import React, { useState, useEffect } from "react";

const Section = ({ children, style }) => (
  <div
    style={{
      ...style,
      border: "1px solid gray",
      margin: "50px",
      padding: "25px",
    }}
  >
    {children}
  </div>
);

const Title = ({ children, style }) => <div style={style}>{children}</div>;

const Header = ({ children, style }) => <div style={style}>{children}</div>;

const Paragraph = ({ children, style }) => <p style={style}>{children}</p>;

const Footer = ({ children, style }) => (
  <footer style={style}>{children}</footer>
);

const Navbar = ({ children, style }) => <nav style={style}>{children}</nav>;

const Button = ({ children, style, onClick }) => {
  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
};

// const Audio;
// const = link;
const Image = ({ src = "/dog.jpg", alt, style }) => {
  return <img src={src} alt={alt} style={style} />;
};

const PhotoGallery = ({ style }) => {
  const defaultStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    // Add any additional default styles if needed
  };

  const finalStyle = { ...defaultStyle, ...style };

  return (
    <div style={finalStyle}>
      <img src="/dog.jpg" alt="First" style={{ width: "30%" }} />
      <img src="/dog.jpg" alt="Second" style={{ width: "30%" }} />
      <img src="/dog.jpg" alt="Third" style={{ width: "30%" }} />
    </div>
  );
};

const Card = ({ children, style }) => {
  const cardStyle = {
    ...style,
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  };
  return <div style={cardStyle}>{children}</div>;
};

const List = ({ children, style }) => <ul style={style}>{children}</ul>;

const ListItem = ({ children, style }) => <li style={style}>{children}</li>;

const Accordion = ({ children, style }) => {
  // Simple accordion implementation
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={style}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

const Table = ({ headers = [], rows = [], style }) => (
  <table style={style}>
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, index) => (
        <tr key={index}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const Banner = ({ children, style }) => (
  <div style={{ ...style, padding: "20px", textAlign: "center" }}>
    {children}
  </div>
);

// const functionMap = {handleButtonClick: () => console.log("Button clicked!")};

const convertAttributesToStyle = (attributesMap) => {
  return attributesMap
    ? Object.keys(attributesMap).reduce((style, key) => {
        const camelCaseKey = key.replace(/-([a-z])/g, (match, letter) =>
          letter.toLowerCase()
        );
        const cssProperty = convertToCssProperty(
          camelCaseKey,
          attributesMap[key]
        );
        console.log(style);
        return { ...style, ...cssProperty };
      }, {})
    : {};
};

const convertToCssProperty = (key, value) => {
  switch (key) {
    case "hasColor":
      return { color: value };
    case "hasAlign":
      return { textAlign: value };
    case "hasFontSize":
      return { fontSize: `${value}px` };
    case "hasBackgroundColor":
      return { backgroundColor: value };
    default:
      return { [key]: value };
  }
};

const renderComponentFromJSON = (json, key) => {
  if (!json || typeof json !== "object") return null;

  const { type, children, attributesMap } = json;

  const componentMap = {
    Section: Section,
    Title: Title,
    Header: Header,
    Paragraph: Paragraph,
    Footer: Footer,
    Navbar: Navbar,
    Button: Button,
    Image: Image,
    Card: Card,
    List: List,
    ListItem: ListItem,
    Accordion: Accordion,
    Table: Table,
    Banner: Banner,
    PhotoGallery: PhotoGallery,
  };

  const Component = componentMap[type] || "div"; // Fallback to 'div' if type is null or undefined
  const style = convertAttributesToStyle(attributesMap);
  const textContent = attributesMap?.text; // Extract text content if available

  return (
    <Component key={key} style={style}>
      {textContent && <div>{textContent}</div>}{" "}
      {/* Render text content if available */}
      {children &&
        children.map((child, index) =>
          typeof child === "object" ? (
            <React.Fragment key={index}>
              {renderComponentFromJSON(child, index)}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{child}</React.Fragment>
          )
        )}
    </Component>
  );
};

const renderComponentToString = (json, indentLevel = 0) => {
  if (!json || typeof json !== "object") return "";

  const { type, children, attributesMap } = json;
  const tag = type || "div";
  const style = convertAttributesToStyle(attributesMap);
  const styleString = Object.entries(style)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
  const textContent = attributesMap?.text || "";

  const indent = " ".repeat(indentLevel * 2); // Adjust indent size as needed
  let childrenString = "";
  if (children) {
    childrenString = children
      .map((child) =>
        typeof child === "object"
          ? "\n" + renderComponentToString(child, indentLevel + 1)
          : child
      )
      .join("");
  }

  let openingTag = `<${tag} style="${styleString}">`;
  let closingTag = `</${tag}>`;

  if (childrenString) {
    return `${indent}${openingTag}\n${indent}  ${textContent}${childrenString}\n${indent}${closingTag}`;
  } else {
    return `${indent}${openingTag}${textContent}${closingTag}`;
  }
};

const HtmlCodePage = ({ data }) => {
  const [text, setText] = useState(data);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const htmlString = data
    .map((item) => renderComponentToString(item))
    .join("\n");

  return (
    <textarea
     rows="25"
     value={htmlString}
     onChange={handleChange}
     className="block p-2.5 w-full text-sm"
     >
     </textarea>
  );
}

const Test = () => {
  const [jsonData, setJsonData] = useState([]);

  const handleButtonClick = (data) => {
    setJsonData([data]);
  };

  const data = jsonData.map((item, index) => renderComponentFromJSON(item, index));

  return (
    <div className="bg-gray-100 justify-center">
      <Chat handleButtonClick={handleButtonClick} />
      { data }

      <div className="flex flex-col items-center justify-center">
        {<HtmlCodePage data={jsonData} />}

        <button type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-5"
        >
          Update
        </button>
      </div>

    </div>
  );
};

export default Test;
