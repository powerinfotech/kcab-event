package com.kcabEvent.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * MailUtil - 이메일 발송 유틸리티
 *
 * <p>Spring의 {@link JavaMailSender}를 래핑하여 단순 텍스트 메일 발송 기능을 제공한다.
 * 발신자(From) 주소는 {@code application.properties}의
 * {@code spring.mail.username} 값으로 자동 설정된다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // 아이디/비밀번호 찾기 등 인증 메일 발송
 * mailUtil.sendEmail(
 *     "user@example.com",
 *     "[안전관리] 임시 비밀번호 안내",
 *     "임시 비밀번호는 [A1b2C3d4] 입니다."
 * );
 * </pre>
 *
 * <h3>주의사항</h3>
 * <ul>
 *   <li>HTML 형식을 지원하지 않는다. HTML 메일이 필요하면 {@code MimeMessage}를 사용한다.</li>
 *   <li>발송 실패 시 {@link org.springframework.mail.MailException}이 전파된다.</li>
 * </ul>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MailUtil {

    private final JavaMailSender mailSender;

    /**
     * 단순 텍스트 이메일을 발송한다.
     *
     * @param to      수신자 이메일 주소
     * @param subject 메일 제목
     * @param body    메일 본문 (plain text)
     * @throws org.springframework.mail.MailException SMTP 발송 실패 시
     */
    public void sendEmail(String to, String subject, String body) {
        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("수신자 이메일 주소는 필수입니다.");
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (MailException e) {
            log.error("[MailUtil] 이메일 발송 실패 - 수신자: {}, 제목: {}", to, subject, e);
            throw e;
        }
    }

}
