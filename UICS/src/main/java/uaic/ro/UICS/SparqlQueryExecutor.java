package uaic.ro.UICS;

import jakarta.json.Json;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;

@Component
public class SparqlQueryExecutor {
    private static final String FUSEKI_ENDPOINT = "http://localhost:3330/dataset/sparql";

    public String getAll() {
        String queryString = """
                PREFIX owl: <http://www.w3.org/2002/07/owl#>
                PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\s
                PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\s
                PREFIX pizza:<http://www.semanticweb.org/adi/ontologies/2024/0/pizza#>
                SELECT ?pizzaInstance
                WHERE {
                  ?pizzaInstance rdf:type pizza:MargheritaPizza .
                }""";

        Query query = QueryFactory.create(queryString);

        try (QueryExecution qexec = QueryExecutionFactory.sparqlService(FUSEKI_ENDPOINT, query)) {
            // Execute the query and obtain the result set
            ResultSet resultSet = qexec.execSelect();

            return getJsonResult(resultSet);
        }
    }

    private static String getJsonResult(ResultSet resultSet) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ResultSetFormatter.outputAsJSON(outputStream, resultSet);
        return outputStream.toString();
    }
}
