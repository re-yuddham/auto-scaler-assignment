package com.business.consumer.starter.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

public class MessageSender {

    @Autowired
    private RabbitTemplate template;

    private Queue queue;

    public void send() {
        String message = "Hello World!";
        queue = new Queue("PRODUCT_SOAP_CONFIRMATION_OUT_f5c6895b-a20f-446c-b136-5ceeeba227d7");
        this.template.convertAndSend(queue.getName(), message);
        System.out.println(" [x] Sent '" + message + "'");
    }
}
