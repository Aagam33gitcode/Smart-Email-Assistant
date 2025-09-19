package com.email.smart_email_assistant.Controller;

import com.email.smart_email_assistant.DTO.EmailRequest;
import com.email.smart_email_assistant.Service.EmailGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailGeneratController {

    private final EmailGeneratorService service;
    public EmailGeneratController(EmailGeneratorService service) {
        this.service = service;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest email){
    String response=service.generateEmail(email);
    return ResponseEntity.ok(response);
}

}
