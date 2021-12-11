package com.business.consumer.starter.config;

import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.api.ChannelAwareMessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RabbitMessagingImplementation {
    private final RabbitAdmin rabbitAdmin;
    private final ConnectionFactory rabbitConnectionFactory;

    @Autowired
    public RabbitMessagingImplementation(
            RabbitAdmin rabbitAdmin,
            ConnectionFactory rabbitConnectionFactory) {
        this.rabbitAdmin = rabbitAdmin;
        this.rabbitConnectionFactory = rabbitConnectionFactory;
    }

    public void declareQueueAndAttachListener(
            String queueName,
            String exchangeName,
            String routingKey,
            ChannelAwareMessageListener queueListener) {

        final SimpleMessageListenerContainer simpleMessageListenerContainer =
                new SimpleMessageListenerContainer();
        simpleMessageListenerContainer.setConnectionFactory(rabbitConnectionFactory);
        simpleMessageListenerContainer.setDefaultRequeueRejected(false);
        simpleMessageListenerContainer.setAutoStartup(true);

        final DirectExchange exchange =
                ExchangeBuilder.directExchange(exchangeName).durable(true).build();
        rabbitAdmin.declareExchange(exchange);
        final Queue queue =
                QueueBuilder.durable(queueName)
                        .deadLetterExchange(exchangeName)
                        .deadLetterRoutingKey(routingKey)
                        .lazy()
                        .build();
        rabbitAdmin.declareQueue(queue);
        rabbitAdmin.declareBinding(BindingBuilder.bind(queue).to(exchange).with(queueName));

        simpleMessageListenerContainer.addQueueNames(queueName);
        simpleMessageListenerContainer.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        simpleMessageListenerContainer.setMessageListener(queueListener);
        simpleMessageListenerContainer.start();
    }
}

