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

/**
 * EnumCodeUtil - 열거형 코드 조회 유틸리티
 *
 * <p>Reflections 라이브러리를 통해 {@code com.miso.lxnn.enums} 패키지의 모든 열거형을 스캔하고,
 * {@code value} 필드를 기준으로 열거형 이름({@link Enum#name()}) → 값 문자열의 Map을 반환한다.</p>
 *
 * <p><strong>설계 참고:</strong> {@code @Component}로 등록되어 있으나 모든 메서드가 {@code static}이므로
 * 주입 없이 클래스명으로 직접 호출한다. Spring Bean 인스턴스는 생성되나 실제로 사용되지는 않는다.</p>
 *
 * <h3>전제 조건</h3>
 * <ul>
 *   <li>코드 목록으로 노출할 열거형은 {@code value}라는 이름의 {@link String} 필드를 가져야 한다.</li>
 *   <li>{@code value} 필드가 없는 열거형(예: {@link com.miso.lxnn.enums.IudType})은 자동으로 제외된다.</li>
 * </ul>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // 특정 열거형 코드 조회
 * Map{@literal <}String, String{@literal >} sexCodes = EnumCodeUtil.getEnumCode("Sex");
 * // → { "MAN": "남성", "WOMAN": "여성" }
 *
 * // 전체 열거형 코드 일괄 조회
 * Map{@literal <}String, Map{@literal <}String, String{@literal >}{@literal >} all = EnumCodeUtil.getEnumCodeAll();
 * // → { "Sex": { "MAN": "남성", "WOMAN": "여성" }, "MenuType": { "D": "디렉토리", "V": "화면" }, ... }
 *
 * // 특정 필드를 value 대신 사용
 * Map{@literal <}String, String{@literal >} sexShortCodes = EnumCodeUtil.getEnumCode("Sex", "temp");
 * // → { "MAN": "M", "WOMAN": "F" }
 * </pre>
 *
 * @see com.miso.lxnn.controller.CommonCodeController
 */
@Component
public class EnumCodeUtil {
    private static  final String ENUM_PATH = SafetyAdminApplication.class.getPackageName()+".enums.";
    /** 코드 값으로 사용할 enum 필드명 (기본값) */
    public static final String TEXT_VALUE  = "value";


    /**
     * {@code com.miso.lxnn.enums} 패키지의 모든 열거형을 스캔하여
     * 그룹명({@link Class#getSimpleName()}) → 코드 Map을 반환한다.
     * {@code value} 필드가 없는 열거형은 결과에서 제외된다.
     *
     * @return 열거형 클래스명 → (enum 이름 → value 문자열) 의 중첩 Map
     */
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

    /**
     * 열거형 이름으로 단일 그룹의 코드 Map을 반환한다.
     * {@code value} 필드가 없으면 빈 Map을 반환한다.
     *
     * @param codeGroupName 열거형 클래스 단순 이름 (예: {@code "Sex"}, {@code "MenuType"})
     * @return enum 이름 → value 문자열의 Map (삽입 순서 유지)
     * @throws RuntimeException 클래스를 찾을 수 없거나 리플렉션 오류 발생 시
     */
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

    /**
     * 열거형 이름과 필드명을 지정하여 코드 Map을 반환한다.
     * {@code key}가 빈 문자열이면 기본 필드({@code value})를 사용한다.
     *
     * @param codeGroupName 열거형 클래스 단순 이름 (예: {@code "Sex"})
     * @param key           값으로 사용할 enum 필드명 (빈 문자열이면 {@code "value"})
     * @return enum 이름 → 지정 필드 값의 Map
     * @throws RuntimeException 클래스·필드를 찾을 수 없거나 리플렉션 오류 발생 시
     */
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


    /**
     * 열거형 클래스의 모든 상수 배열을 리플렉션으로 가져온다.
     *
     * @param enumClass 열거형 클래스
     * @return 열거형 상수 배열
     * @throws NoSuchFieldException   {@code $VALUES} 필드가 없을 때
     * @throws IllegalAccessException 접근 권한 오류
     */
    private static <E extends Enum> E[] getEnumVAlues(Class<?> enumClass) throws NoSuchFieldException, IllegalAccessException {
        Field field = enumClass.getDeclaredField("$VALUES");
        field.trySetAccessible();
        return (E[]) field.get(null);
    }

    /**
     * null 안전 문자열 변환. {@code null}이면 빈 문자열을 반환한다.
     *
     * @param object 변환할 객체
     * @return {@code object.toString()}, 또는 {@code null}이면 {@code ""}
     */
    public static String nvl(Object object) {
        return object == null ? "": object.toString();
    }
}
