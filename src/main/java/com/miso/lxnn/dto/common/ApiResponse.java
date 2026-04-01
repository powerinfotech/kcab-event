package com.miso.lxnn.dto.common;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

/**
 * ApiResponse - 공통 API 응답 래퍼
 *
 * <p>모든 REST API 응답의 최상위 포맷. {@code code} / {@code message} / {@code item} 세 필드로 구성되며
 * 팩토리 메서드({@link #ok()}, {@link #ok(Object)})를 통해 생성한다.</p>
 *
 * <h3>응답 예시</h3>
 * <pre>
 * // 데이터 없는 성공
 * ApiResponse.ok()
 * // → { "code": 200, "message": null, "item": null }
 *
 * // 데이터 있는 성공
 * ApiResponse.ok(userList)
 * // → { "code": 200, "message": null, "item": [...] }
 *
 * // 커스텀 코드 + 메시지
 * ApiResponse.ok(null, 201, "사용자 등록 완료")
 * // → { "code": 201, "message": "사용자 등록 완료", "item": null }
 * </pre>
 *
 * @param <T> 응답 데이터 타입
 */
@Data
@Builder
@AllArgsConstructor
public class ApiResponse<T> {
    private int code;
    private String message;
    private T item;

    public ApiResponse(final int code, final String message) {
        this.code = code;
        this.message = message;
        this.item = null;
    }

    public static <T> ApiResponse<T> ok() {
        return response(HttpStatus.OK.value(), null, null);
    }

    public static <T> ApiResponse<T> ok(final T item) {
        return response(HttpStatus.OK.value(), null, item);
    }

    public static <T> ApiResponse<T> ok(final T item, final int code) {
        return response(code,null, item);
    }

    public static <T> ApiResponse<T> ok(final T item, final int code, String message) {
        return response(code, message, item);
    }

    private static <T> ApiResponse<T> response(final int code, final String message, final T item) {
        return ApiResponse.<T>builder()
                .code(code)
                .message(message)
                .item(item)
                .build();
    }


}
