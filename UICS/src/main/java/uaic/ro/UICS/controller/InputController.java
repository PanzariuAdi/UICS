package uaic.ro.UICS.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uaic.ro.UICS.languageProcessor.Node;
import uaic.ro.UICS.services.LanguageService;


@RestController
@AllArgsConstructor
public class InputController {
    LanguageService languageService;

    @GetMapping("/")
    public Node getAllNodes(@RequestParam String input) {
        return languageService.getNodes(input);
    }

}
