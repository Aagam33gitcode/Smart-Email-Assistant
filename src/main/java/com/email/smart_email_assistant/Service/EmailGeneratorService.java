package com.email.smart_email_assistant.Service;

import com.email.smart_email_assistant.DTO.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {
    @Value("${gemini.api.url}")
    private String gemniniAPiUrl;
    @Value("${gemini.api.key}")
    private String geminiAPiKey;
    private final WebClient webClient;
    public EmailGeneratorService(WebClient webClient) {
        this.webClient = webClient;
    }

    public String generateEmail(EmailRequest email){
    String prompt=buildPrompt(email);
    //for content structure
    Map<String ,Object> request=Map.of(
            "contents",new Object[]{
            Map.of("parts",new Object[]{
                    Map.of("text",prompt)
    })
    });
String response=webClient
        .post()
        .uri(gemniniAPiUrl + geminiAPiKey)
        .bodyValue(request)
        .header("Content-Type","application/json")
        .retrieve()
        .bodyToMono(String.class)
        .block();
return extractResponse(response);
}

    private String extractResponse(String response) {
try {
    ObjectMapper mapper=new ObjectMapper();
    JsonNode root=mapper.readTree(response);
    return root
            .path("candidates")
            .get(0)
            .path("content")
            .path("parts")
            .get(0)
            .path("text")
            .asText();
}catch (Exception e){
    return "error reaponse"+ e.getMessage();
}
    }

    private String buildPrompt(EmailRequest email) {
    StringBuilder prompt=new StringBuilder();
        prompt.append("You are an assistant that always outputs in email format.\n");
        prompt.append("Your response must include:\n");
        prompt.append("- A clear subject line\n");
        prompt.append("- Proper greeting (e.g., Dear ..., Hi ...)\n");
        prompt.append("- A well-structured body\n");
        prompt.append("- A polite closing with sender name placeholder\n");
        if(email.getTone()!=null&& !email.getTone().isEmpty()){
        prompt.append("Use a ").append(email.getTone()).append(" tone.");
    }
    prompt.append("\nOriginal email: \n").append(email.getEmailContent());

    return prompt.toString();
    }
}
