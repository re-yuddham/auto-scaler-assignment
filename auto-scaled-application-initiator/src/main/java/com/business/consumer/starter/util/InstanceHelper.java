package com.business.consumer.starter.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class InstanceHelper {

    static Logger logger = LoggerFactory.getLogger(InstanceHelper.class);

    public static int getInstanceIndex() {
        Map<String, String> env = System.getenv();

        try {
            return Integer.parseInt(env.get("CF_INSTANCE_INDEX"));
        } catch (NumberFormatException e) {
            logger.error("error");
        }
        return 0;
    }
}
