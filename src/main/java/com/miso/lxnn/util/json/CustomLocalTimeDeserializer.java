package com.miso.lxnn.util.json;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class CustomLocalTimeDeserializer extends JsonDeserializer<LocalTime> {
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("HH:mm:ss");
    @Override
    public LocalTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        return LocalTime.parse(p.getText(), DATE_FORMAT);
    }
}
