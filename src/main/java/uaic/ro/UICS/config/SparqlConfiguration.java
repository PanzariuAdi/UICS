package uaic.ro.UICS.config;

import org.apache.jena.fuseki.main.FusekiServer;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.util.FileManager;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class SparqlConfiguration {
    private final String RDF_PATH = "uics.rdf";
    private final String PREFIX = "http://www.semanticweb.org/adi/ontologies/2024/0/ont/";

    @Bean
    public CommandLineRunner startFusekiServer() {
        return args -> {
            Model model = ModelFactory.createDefaultModel();

            InputStream in = FileManager.getInternal().open(RDF_PATH);
            if (in == null) {
                throw new IllegalArgumentException("File: " + RDF_PATH + " not found");
            }

            model.read(in, "");
            model.setNsPrefix("", PREFIX);

            Dataset dataset = DatasetFactory.create(model);

            FusekiServer server = FusekiServer.create()
                    .add("/dataset", dataset)
                    .build();
            server.start();

            Runtime.getRuntime().addShutdownHook(new Thread(server::stop));
        };
    }
}
