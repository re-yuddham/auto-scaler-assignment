package com.business.consumer.starter.config;

import io.pivotal.cfenv.core.CfCredentials;
import io.pivotal.cfenv.core.CfEnv;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory.CacheMode;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableAutoConfiguration(excludeName = "com.business.consumer.starter.config.RabbitTemplateConfig")
public class RabbitMqConfiguration {
    @Autowired private CfEnv cfEnv;

    @Bean
    public ConnectionFactory rabbitConnectionFactory() {
        final CfCredentials rabbitCredentials = cfEnv.findCredentialsByLabel("rabbitmq");
        final String uri = (String) rabbitCredentials.getMap().get("uri");
        final List<String> uris = (List<String>) rabbitCredentials.getMap().get("uris");
        String addresses = null;

        if (uris != null) {
            addresses = addAddresses(uris);
        } else {
            addresses = addAddress(uri);
        }

        final CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setUsername(rabbitCredentials.getUsername());
        connectionFactory.setPassword(rabbitCredentials.getPassword());
        connectionFactory.setAddresses(addresses);
        connectionFactory.getRabbitConnectionFactory().setAutomaticRecoveryEnabled(true);
        connectionFactory.setCacheMode(CacheMode.CHANNEL);

        if (rabbitCredentials.getMap().get("virtual_host") != null) {
            connectionFactory.setVirtualHost(rabbitCredentials.getMap().get("virtual_host").toString());
        }
        return connectionFactory;
    }

    @Bean
    public RabbitAdmin amqpAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMandatory(true);
        return rabbitTemplate;
    }

    private String addAddress(String address) {
        String mappedAddress = "";
        try {
            final URI uri = new URI(address);
            mappedAddress = uri.getHost() + ":" + uri.getPort();

        } catch (final URISyntaxException e) {
            throw new IllegalStateException("Invalid Rabbitmq Address URI", e); // NOSONAR
        }
        return mappedAddress;
    }

    private String addAddresses(List<String> uris) {
        StringBuilder addresses = new StringBuilder();
        for (final String uriString : uris) {
            if (addresses.length() > 0) {
                addresses.append(",").append(addAddress(uriString));
            } else {
                addresses = new StringBuilder(addAddress(uriString));
            }
        }
        return addresses.toString();
    }
}

