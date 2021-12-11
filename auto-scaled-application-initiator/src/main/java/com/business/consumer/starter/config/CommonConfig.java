package com.business.consumer.starter.config;

import io.pivotal.cfenv.core.CfEnv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommonConfig {
    @Bean
    public CfEnv cfEnv() {
        return new CfEnv();
    }

}
