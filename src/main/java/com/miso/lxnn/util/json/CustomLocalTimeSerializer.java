package com.miso.lxnn.util.json;

import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class CustomLocalTimeSerializer extends JsonSerializer<LocalTime> {
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("hh:mm:ss");

    @Override
    public void serialize(LocalTime value, com.fasterxml.jackson.core.JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.format(DATE_FORMAT));
    }
}
