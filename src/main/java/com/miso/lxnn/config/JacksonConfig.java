package com.miso.lxnn.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.miso.lxnn.util.json.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Configuration
public class JacksonConfig {


    @Bean
    public Module jsonMapperDateTimeModule() {
        SimpleModule module = new SimpleModule();
        module.addSerializer(LocalTime.class, new CustomLocalTimeSerializer());
        module.addSerializer(LocalDate.class, new CustomLocalDateSerializer());
        module.addSerializer(LocalDateTime.class, new CustomLocalDateTimeSerializer());
        module.addDeserializer(LocalTime.class, new CustomLocalTimeDeserializer());
        module.addDeserializer(LocalDate.class, new CustomLocalDateDeserializer());
        module.addDeserializer(LocalDateTime.class, new CustomLocalDateTimeDeserializer());

        return  module;
    }


    public Module customJsonDeSerializeModule() {
        SimpleModule module = new SimpleModule();
        module.addDeserializer(String.class, new StringStripJsonDeserializer());
        return module;
    }
}
