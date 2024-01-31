package uaic.ro.UICS.sparql;

import jakarta.json.Json;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import org.springframework.stereotype.Component;
import uaic.ro.UICS.languageProcessor.LanguageNode;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class SparqlQueryExecutor {
    private static final String FUSEKI_ENDPOINT = "http://localhost:3330/dataset/sparql";

    public String getForNode(LanguageNode languageNode) {
        String query = getFormattedString(languageNode.getComponent());

        return executeSparqlQuery(query);
    }

    private String executeSparqlQuery(String sparqlQuery) {
        try (QueryExecution queryExecution = QueryExecutionFactory.sparqlService(FUSEKI_ENDPOINT, sparqlQuery)) {
            ResultSet resultSet = queryExecution.execSelect();
            return getJsonResult(resultSet);
        }
    }

    private static String getJsonResult(ResultSet resultSet) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ResultSetFormatter.outputAsJSON(outputStream, resultSet);
        return outputStream.toString();
    }

    private String getFormattedString(String component) {
        return String.format("""
             PREFIX owl: <http://www.w3.org/2002/07/owl#>
             PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
             PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
             PREFIX uics: <http://www.semanticweb.org/adi/ontologies/2024/0/ont#>
             
             SELECT ?property ?value
             WHERE {
                 uics:%s ?property ?value .
             }
             """, component);
    }

}
