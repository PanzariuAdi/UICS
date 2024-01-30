package uaic.ro.UICS.languageProcessor;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class Node {

    private String type;
    private List<Node> children;
    private Map<String, String> attributesMap;

    public Node() {
        this.children = new ArrayList<>();
        this.attributesMap = new HashMap<>();
    }

    public void addChild(Node node) {
        this.children.add(node);
    }

    public void addAttribute(String property, String value) {
        attributesMap.put(property, value);
    }
}
