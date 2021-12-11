package com.business.consumer.starter.controller;

import com.business.consumer.starter.util.RequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.SerializationUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicLong;

@RestController
public class RabbitController {

    @Autowired
    RabbitTemplate rabbitTemplate;

    @Autowired
    RequestService requestService;

    private Logger logger = LoggerFactory.getLogger(RabbitController.class);
    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @GetMapping("/requests/${instance.index}/{requestCount}")
    public ResponseEntity<String> requests(@PathVariable int requestCount) {

        logger.info("\n Message Received : ");
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setDeliveryTag(1);

        byte[] msg = SerializationUtils.serialize("Something interesting");


        return requestService.wreckUrl(30, requestCount);
    }

}
