package com.miso.lxnn.config;

import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.egovframe.rte.fdl.cmmn.trace.handler.DefaultTraceHandler;
import org.egovframe.rte.fdl.cmmn.trace.handler.TraceHandler;
import org.egovframe.rte.fdl.cmmn.trace.manager.DefaultTraceHandleManager;
import org.egovframe.rte.fdl.cmmn.trace.manager.TraceHandlerService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.AntPathMatcher;

/**
 * CommonConfig - 공통 Bean 설정
 *
 * <p>eGovFrame 표준 추적(Trace) 핸들러와 Spring의 AntPathMatcher를 Bean으로 등록한다.</p>
 *
 * <h3>등록 Bean</h3>
 * <ul>
 *   <li>{@link AntPathMatcher} - Ant 패턴 기반 URL/경로 매칭 유틸 (SecurityConfig, WebMvcConfig 등에서 재사용)</li>
 *   <li>{@link DefaultTraceHandler} - eGovFrame 기본 추적 핸들러 (예외 발생 시 스택 정보 기록)</li>
 *   <li>{@link DefaultTraceHandleManager} - 모든 경로("*")에 추적 핸들러 적용</li>
 *   <li>{@link LeaveaTrace} - eGovFrame 예외 추적 진입점 (서비스 레이어 예외 발생 시 자동 호출)</li>
 * </ul>
 */
@Configuration
public class CommonConfig {

	@Bean
	public AntPathMatcher antPathMatcher() {
		return new AntPathMatcher();
	}

	@Bean
	public DefaultTraceHandler defaultTraceHandler() {
		return new DefaultTraceHandler();
	}

	@Bean
	public DefaultTraceHandleManager traceHandlerService() {
		DefaultTraceHandleManager defaultTraceHandleManager = new DefaultTraceHandleManager();
		defaultTraceHandleManager.setReqExpMatcher(antPathMatcher());
		defaultTraceHandleManager.setPatterns(new String[]{"*"});
		defaultTraceHandleManager.setHandlers(new TraceHandler[]{defaultTraceHandler()});
		return defaultTraceHandleManager;
	}

	@Bean
	public LeaveaTrace leaveaTrace() {
		LeaveaTrace leaveaTrace = new LeaveaTrace();
		leaveaTrace.setTraceHandlerServices(new TraceHandlerService[]{traceHandlerService()});
		return leaveaTrace;
	}

}
