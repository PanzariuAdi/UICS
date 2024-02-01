package uaic.ro.UICS.languageProcessor;

import opennlp.tools.postag.POSModel;
import opennlp.tools.postag.POSTagger;
import opennlp.tools.postag.POSTaggerME;
import opennlp.tools.tokenize.Tokenizer;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

@Component
public class LanguageProcessor {
    public static String NLP_TOKEN_MODEL = "opennlp-en-ud-ewt-tokens-1.0-1.9.3.bin";
    public static String NLP_POS_MODEL = "opennlp-en-ud-ewt-pos-1.0-1.9.3.bin";

    private final POSTagger tagger;
    private final Tokenizer tokenizer;

    public LanguageProcessor() {
        try (InputStream modelIn = new FileInputStream(NLP_TOKEN_MODEL)) {
            TokenizerModel model = new TokenizerModel(modelIn);
            this.tokenizer = new TokenizerME(model);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        try (InputStream modelIn = new FileInputStream(NLP_POS_MODEL)) {
            POSModel posModel = new POSModel(modelIn);
            this.tagger = new POSTaggerME(posModel);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public LanguageNode process(String text) {
        String[] tokens = tokenizer.tokenize(text);
        String[] tags = tagger.tag(tokens);

        LanguageNode head = new LanguageNode("section");
        LanguageNode node = new LanguageNode();
        LanguageNode child = null;

        for (int i = 0; i < tokens.length; i++) {
            String word = tokens[i];
            String tag = tags[i];

            switch (tag) {
                case "PUNCT":
                    // add node to graph
                    if (child != null) {
                        node.addChild(child);
                    }
                    head.addChild(node);
                    node = new LanguageNode();
                    child = null;
                    break;
                case "NUM":
                    Objects.requireNonNullElse(child, node).setCount(Integer.parseInt(word));
                    break;
                case "ADP":
                    // need to start to create a child and append it to node
                    child = new LanguageNode();
                    break;
                case "NOUN":
                    Objects.requireNonNullElse(child, node).setComponent(word);
                    break;
                case "VERB", "ADJ":
                    Objects.requireNonNullElse(child, node).addStyle(word);
                    break;
                case "CCONJ":
                    // need to start to create another child and append current child to node
                    node.addChild(child);
                    child = new LanguageNode();
                    break;
            }
        }

        printTree(head, "", true);

        return head;
    }

    private void printTree(LanguageNode root, String prefix, boolean isTail) {
        System.out.println(prefix + (isTail ? "└── " : "├── ") + root.getCount() + " " + root.getComponent() + root.getStyles());

        for (int i = 0; i < root.getChildren().size() - 1; i++) {
            printTree(root.getChildren().get(i), prefix + (isTail ? "    " : "│   "), false);
        }

        if (!root.getChildren().isEmpty()) {
            printTree(root.getChildren().get(root.getChildren().size() - 1), prefix + (isTail ? "    " : "│   "), true);
        }
    }

    public static void main(String[] args) {
        LanguageProcessor languageProcessor = new LanguageProcessor();

        System.out.println("TEST");
    }
}
