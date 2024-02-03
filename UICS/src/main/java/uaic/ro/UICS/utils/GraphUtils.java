package uaic.ro.UICS.utils;

import uaic.ro.UICS.languageProcessor.LanguageNode;
import uaic.ro.UICS.languageProcessor.Node;

public class GraphUtils {
    private static final String COLOR_ATTRIBUTE = "color";
    private static final String ALIGN_ATTRIBUTE = "textAlign";
    private static final String FONT_SIZE = "fontSize";

    public static void addCustomStyles(LanguageNode languageNode, Node node) {
        for (String style : languageNode.getStyles()) {
            if (isColorAttribute(style)) {
               node.getAttributesMap().put(COLOR_ATTRIBUTE, style);
            } else if (isAlignAttribute(style)) {
                if (style.equals("centered")) {
                    style = "center";
                }
                node.getAttributesMap().put(ALIGN_ATTRIBUTE, style);
            } else if (isSizeAttribute(style)) {
                node.getAttributesMap().put(FONT_SIZE, style);
            }
        }
    }

    private static boolean isSizeAttribute(String attribute) {
        return attribute.equals("large") ||
               attribute.equals("medium") ||
                attribute.equals("small");
    }

    private static boolean isColorAttribute(String attribute) {
        return attribute.equals("red") ||
                attribute.equals("yellow") ||
                attribute.equals("green") ||
                attribute.equals("white") ||
                attribute.equals("black") ||
                attribute.equals("gray") ||
                attribute.equals("blue");
    }

    private static boolean isAlignAttribute(String attribute) {
        return attribute.equals("left") ||
                attribute.equals("right") ||
                attribute.equals("centered");
    }
}
