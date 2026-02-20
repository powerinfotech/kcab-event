package com.miso.lxnn.util;

import com.miso.lxnn.SafetyAdminApplication;
import org.reflections.Reflections;
import org.reflections.util.ConfigurationBuilder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class EnumCodeUtil {
    private static  final String ENUM_PATH = SafetyAdminApplication.class.getPackageName()+".enums.";
    public static final String TEXT_VALUE  = "value";


    public static Map<String, Map<String, String>> getEnumCodeAll() {
        Map<String, Map<String, String>> codeMap = new LinkedHashMap<>();
        Reflections reflections = new Reflections(new ConfigurationBuilder().forPackage(ENUM_PATH));
        Set<Class<? extends Enum>> classes = reflections.getSubTypesOf((Class)Enum.class);
        classes = classes.stream().filter(v->v.getName().startsWith(ENUM_PATH)).collect(Collectors.toSet());
        for(Class<? extends Enum> enumClass : classes) {
            String codeGroupName = enumClass.getName().split("\\.")[enumClass.getName().split("\\.").length-1];
            Map<String, String> code = getEnumCode(codeGroupName);
            if(!code.keySet().isEmpty()) {
                codeMap.put(codeGroupName, code);
            }
        }
        return codeMap;
    }

    public static Map<String, String> getEnumCode(String codeGroupName) {
        Map<String, String> result = new LinkedHashMap<>();
        try {
            for(Object enumObject : getEnumVAlues(Class.forName(ENUM_PATH + codeGroupName))) {
                if(Arrays.stream(enumObject.getClass().getDeclaredFields()).noneMatch(v -> v.getName().equals(TEXT_VALUE))) {
                    break;
                }

                Field value = enumObject.getClass().getDeclaredField(TEXT_VALUE);
                value.trySetAccessible();
                result.put(nvl(enumObject), nvl(value.get(enumObject)));
            }
        } catch (NoSuchFieldException | ClassNotFoundException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }

        return result;
    }

    public static Map<String, String> getEnumCode(String codeGroupName, String key) {
        Map<String, String> result = new LinkedHashMap<>();
        try {
            for(Object enumObject : getEnumVAlues(Class.forName(ENUM_PATH + codeGroupName))) {
                if(Arrays.stream(enumObject.getClass().getDeclaredFields()).filter(v->v.getName().equals(TEXT_VALUE)).count() < 1) {
                    break;
                }

                Field value = enumObject.getClass().getDeclaredField(!"".equals(nvl(key)) ? key : TEXT_VALUE);
                value.trySetAccessible();
                result.put(nvl(enumObject), nvl(value.get(enumObject)));
            }
        } catch (NoSuchFieldException | ClassNotFoundException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }

        return result;
    }


    private static <E extends Enum> E[] getEnumVAlues(Class<?> enumClass) throws NoSuchFieldException, IllegalAccessException {
        Field field = enumClass.getDeclaredField("$VALUES");
        field.trySetAccessible();
        return (E[]) field.get(null);
    }

    public static String nvl(Object object) {
        return object == null ? "": object.toString();
    }
}
