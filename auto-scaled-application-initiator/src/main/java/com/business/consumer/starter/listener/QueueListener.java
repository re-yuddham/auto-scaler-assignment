package com.business.consumer.starter.listener;

import com.business.consumer.starter.util.RequestService;
import com.google.gson.Gson;
import com.google.gson.internal.LinkedTreeMap;
import com.rabbitmq.client.Channel;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.listener.api.ChannelAwareMessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.Map;

@Component
public class QueueListener implements ChannelAwareMessageListener {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    final String instanceCountKey = "requestCount";

    @Autowired
    RequestService requestService;

    @Override
    public void onMessage(Message message, Channel channel) throws Exception {
        String payload = deserializedData(message.getBody());
        logger.info("message received {}",payload);

        Map<String, Object> map =
                new Gson().fromJson(payload.substring(payload.indexOf("{")), Map.class);

        Double count = (Double) map.get(instanceCountKey);

        logger.info("count received : {}",count);

        requestService.wreckUrl(200, count.intValue());
    }

    public String deserializedData(byte[] data) throws IOException {
        String transformedData = null;

        try (InputStream inputStream = new ByteArrayInputStream(data)) {
            StringWriter writer = new StringWriter();
            IOUtils.copy(inputStream, writer, "UTF-8");
            transformedData = writer.toString();
        }
        return transformedData;
    }
}
