package uaic.ro.UICS.services;

import lombok.AllArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import uaic.ro.UICS.languageProcessor.LanguageNode;
import uaic.ro.UICS.languageProcessor.LanguageProcessor;
import uaic.ro.UICS.languageProcessor.Node;
import uaic.ro.UICS.sparql.SparqlQueryExecutor;
import uaic.ro.UICS.utils.GraphUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@AllArgsConstructor
public class LanguageService {

    LanguageProcessor languageProcessor;
    SparqlQueryExecutor sparqlQueryExecutor;

    public Node getNodes(String input) {
        LanguageNode head = languageProcessor.process(input);
        Node node = new Node();

        constructGraph(head, node);

        return node.getChildren().get(0);
    }

    private void constructGraph(LanguageNode root, Node parent) {
        String result = sparqlQueryExecutor.getForNode(root);

        Node currentNode = getNodeFromResult(result);
        GraphUtils.addCustomStyles(root, currentNode);
        System.out.println(root.getStyles());

        for (int i = 0; i < root.getCount(); i++) {
            parent.addChild(currentNode);
        }

        root.getChildren().forEach(child -> {
            constructGraph(child, currentNode);
        });
    }

    private Node getNodeFromResult(String result) {
        JSONObject object = new JSONObject(result);
        JSONArray bindings = object.getJSONObject("results").getJSONArray("bindings");
        Node node = new Node();

        for (int i = 0; i < bindings.length(); i++) {
            JSONObject binding = bindings.getJSONObject(i);

            String property = removePrefix(binding.getJSONObject("property").getString("value"));
            String value = removePrefix(binding.getJSONObject("value").getString("value"));

            if (value.equals("NamedIndividual")) {
                continue;
            }

            if (property.equals("type")) {
                node.setType(value);
            } else {
                node.addAttribute(property, value);
            }
        }

        return node;
    }

    private String removePrefix(String input) {
        Pattern pattern = Pattern.compile("#(.+)$");
        Matcher matcher = pattern.matcher(input);

        if (!matcher.find()) return input;

        return matcher.group(1);
    }
}
