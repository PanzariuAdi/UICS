package uaic.ro.UICS.languageProcessor;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class LanguageNode {
    private String component;
    private int count;
    private List<String> styles;
    private List<LanguageNode> children;

    public LanguageNode(String component) {
       this.count = 0;
       this.component = component;
       this.styles = new ArrayList<>();
       this.children = new ArrayList<>();
    }

    public LanguageNode() {
        this.count = 0;
        this.styles = new ArrayList<>();
        this.children = new ArrayList<>();
    }

    public void addChild(LanguageNode languageNode) {
        this.children.add(languageNode);
    }

    public void addStyle(String style) {
        this.styles.add(style);
    }
}
