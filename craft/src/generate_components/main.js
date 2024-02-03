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

const Title = ({ children, style }) => <h1 style={style}>{children}</h1>;

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
        return { ...style, ...cssProperty };
      }, {})
    : {};
};

const convertToCssProperty = (key, value) => {
  switch (key) {
    case "hasColor":
      return { color: value };
    case "textAlign":
      return { textAlign: value };
    case "hasFontSize":
      return { fontSize: `${value}` };
    case "hasBackgroundColor":
      return { backgroundColor: value };
    case "padding":
      return { padding: `${value}`};
    case "margin":
      return { margin: `${value}`};
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
    <Component key={key} style={style}  >
      {textContent && <div>{textContent} </div>}{" "}
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

  const optionalSrc = tag == "Image" ? "src=\"/dog.jpg\"" : "";
  console.log(tag);

  let openingTag = `<${tag} style="${styleString}" ${optionalSrc}>`;
  let closingTag = `</${tag}>`;

  if (childrenString) {
    return `${indent}${openingTag}\n${indent}  ${textContent}${childrenString}\n${indent}${closingTag}`;
  } else {
    return `${indent}${openingTag}${textContent}${closingTag}`;
  }
};

const HtmlCodePage = ({ data, onUpdate }) => {
  const [htmlString, setHtmlString] = useState("");

  useEffect(() => {
    // Initialize the textarea with the current JSON data rendered as HTML-like strings
    const initialHtml = data
      .map((item) => renderComponentToString(item))
      .join("\n");
    setHtmlString(initialHtml);
  }, [data]);

  const handleChange = (event) => {
    setHtmlString(event.target.value);
  };

  function parseHtmlLikeContentToJson(htmlString) {
    // Helper to convert style string to JSON attributesMap
    const styleStringToAttributesMap = (styleString) => {
      const attributesMap = {};
      styleString.split(";").forEach((style) => {
        const [key, value] = style.split(":").map((s) => s.trim());
        if (!key || !value) return;
        // Convert CSS property names to camelCase and prefix with 'has' if necessary
        const jsonKey = key.replace(/(-\w)/g, (g) => g[1].toUpperCase());
        attributesMap[jsonKey] = value;
      });
      return attributesMap;
    };

    // Recursive function to process each node and build JSON
    const processNode = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const type = node.tagName.toLowerCase(); // Get the tag name in lowercase
        const style = node.getAttribute("style");
        const src = node.getAttribute("src");

        const attributesMap = style ? styleStringToAttributesMap(style) : {};
        const additionalMap = {"src": src};

        const children = Array.from(node.childNodes)
          .map(processNode)
          .filter(Boolean); // Process child nodes recursively

        const tyype = type == "img" ? "Image" : type.charAt(0).toUpperCase() + type.slice(1);

        return {
          type: tyype,
          children,
          attributesMap,
          additionalMap,
        }; // Capitalize the first letter of type
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // If a text node has content, treat it as a special case, potentially as a Text type if needed
        // This behavior depends on how you want to handle text nodes in your JSON
        return null; // For this example, we're ignoring standalone text nodes
      }
    };

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const rootElement = doc.body.firstChild; // Assuming a single root element for simplicity

    return processNode(rootElement);
  }

  const handleUpdate = () => {
    const updatedJson = parseHtmlLikeContentToJson(htmlString);
    onUpdate(updatedJson);
  };

  return (
    <>
      <textarea
        rows="25"
        value={htmlString}
        onChange={handleChange}
        className="block p-2.5 w-full text-sm"
      ></textarea>
      <button onClick={handleUpdate}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-5"
       >
        Update
      </button>
    </>
  );
};

const Test = () => {
  const [jsonData, setJsonData] = useState([]);

  const handleButtonClick = (data) => {
    setJsonData([data]); // Assuming data is an object, not an array
  };

  const handleJsonUpdate = (updatedJson) => {
    setJsonData(Array.isArray(updatedJson) ? updatedJson : [updatedJson]);
  };

  const data = jsonData.map((item, index) =>
    renderComponentFromJSON(item, index)
  );

  return (
    <div className="bg-gray-100 justify-center">
      <Chat handleButtonClick={handleButtonClick} />
      {data}

      <div className="flex flex-col items-center justify-center">
        <HtmlCodePage data={jsonData} onUpdate={handleJsonUpdate} />
        {/* The update button has been moved into HtmlCodePage */}
      </div>
    </div>
  );
};

export default Test;

// TO DO : ONTOLOGY WITH ALIGN AND DEFAULT VALUES BETTER
// REPAIR THE FUCK THE PX
