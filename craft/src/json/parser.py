import json

def parse_json(node):
    # Print or process the current node
    print("Type:", node.get("type"))
    print("Attributes:", node.get("atribures", {}))

    # Recursively parse children
    for child in node.get("children", []):
        parse_json(child)

# Read the JSON file
file_path = "C:\master\craft\craft\src\json\data.json"
with open(file_path, "r") as file:
    json_data = json.load(file)

# Call the parser with the root node
parse_json(json_data["cildren"][0])
