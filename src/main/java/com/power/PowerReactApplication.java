package com.power;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * PowerReactApplication - 애플리케이션 진입점
 *
 * <p>Spring Boot 기반의 관리 어드민 시스템 메인 클래스.
 * {@link SpringBootApplication}이 컴포넌트 스캔, 자동 설정, 프로퍼티 로딩을 일괄 처리한다.</p>
 */
@SpringBootApplication
public class PowerReactApplication {

	public static void main(String[] args) {
		SpringApplication.run(PowerReactApplication.class, args);
	}

}
