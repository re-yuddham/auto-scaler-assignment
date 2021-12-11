package com.business.consumer.starter.config;

import com.business.consumer.starter.listener.QueueListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class QueueListenerConfig {
    @Autowired
    private RabbitMessagingImplementation rabbitMessagingImplementation;

    @Autowired
    private Environment env;

    private final Logger logger = LoggerFactory.getLogger(getClass());

    public String QUEUE_NAME = "requests_";

    public static String EXCHANGE = "req";

    public static String KEY = "key";

    @Autowired private QueueListener queueListener;

    /**
     * create and attach listener.
     */
    @PostConstruct
    public void CreateQueueAndRegisterListener() throws InternalError {
        String instanceIndex = env.getProperty("instance.index");

        final String queueName = QUEUE_NAME+instanceIndex;
        logger.info("registered queue name : {}",queueName);
        rabbitMessagingImplementation.declareQueueAndAttachListener(
                queueName,
                EXCHANGE,
                KEY,
                queueListener);
    }
}

