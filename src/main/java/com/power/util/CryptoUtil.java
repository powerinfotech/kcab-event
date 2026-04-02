package com.power.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * CryptoUtil - BCrypt 비밀번호 암호화 유틸리티
 *
 * <p>Spring Security의 {@link BCryptPasswordEncoder}를 래핑하여
 * 비밀번호 해시 생성과 검증을 정적 메서드로 제공한다.
 * salt는 BCrypt 해시 결과에 포함되므로 별도 저장이 필요 없다.</p>
 *
 * <p><strong>설계 참고:</strong> {@code @Component}로 등록되어 있으나 모든 메서드가 {@code static}이므로
 * 주입 없이 클래스명으로 직접 호출한다. Spring Bean 인스턴스는 생성되나 실제로 사용되지는 않는다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // 회원가입 · 비밀번호 변경 시 해시 생성
 * String hash = CryptoUtil.encodePassword("myRawPassword");
 * // hash: "$2a$10$..." (BCrypt 형식)
 *
 * // 로그인 시 비밀번호 검증
 * boolean ok = CryptoUtil.matchesPassword("myRawPassword", hash); // true
 * boolean ng = CryptoUtil.matchesPassword("wrongPassword", hash); // false
 *
 * // null 입력 처리
 * CryptoUtil.encodePassword(null);         // null 반환
 * CryptoUtil.matchesPassword(null, hash);  // false 반환
 * </pre>
 *
 * @see BCryptPasswordEncoder
 */
@Component
public class CryptoUtil {
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * 평문 비밀번호를 BCrypt로 해시한다. salt는 결과 문자열에 포함된다.
     *
     * @param rawPassword 평문 비밀번호 ({@code null}이면 {@code null} 반환)
     * @return BCrypt 해시 문자열, 또는 {@code null}
     */
    public static String encodePassword(String rawPassword) {
        return rawPassword == null ? null : passwordEncoder.encode(rawPassword);
    }

    /**
     * 평문 비밀번호와 저장된 BCrypt 해시가 일치하는지 검증한다.
     *
     * @param rawPassword     평문 비밀번호
     * @param encodedPassword DB에 저장된 BCrypt 해시
     * @return 일치하면 {@code true}, 불일치하거나 인수가 {@code null}이면 {@code false}
     */
    public static boolean matchesPassword(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
