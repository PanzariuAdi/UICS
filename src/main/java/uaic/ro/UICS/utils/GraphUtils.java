package uaic.ro.UICS.utils;

import uaic.ro.UICS.languageProcessor.LanguageNode;
import uaic.ro.UICS.languageProcessor.Node;

public class GraphUtils {
    private static final String COLOR_ATTRIBUTE = "hasColor";
    private static final String ALIGN_ATTRIBUTE = "hasAlign";

    public static void addCustomStyles(LanguageNode languageNode, Node node) {
        for (String style : languageNode.getStyles()) {
            if (isColorAttribute(style)) {
               node.getAttributesMap().put(COLOR_ATTRIBUTE, style);
            }
            if (isAlignAttribute(style)) {
                node.getAttributesMap().put(ALIGN_ATTRIBUTE, style);
            }
        }
    }

    private static boolean isColorAttribute(String attribute) {
        return attribute.equals("red") ||
                attribute.equals("blue");
    }

    private static boolean isAlignAttribute(String attribute) {
        return attribute.equals("left") ||
                attribute.equals("right") ||
                attribute.equals("center");
    }
}
