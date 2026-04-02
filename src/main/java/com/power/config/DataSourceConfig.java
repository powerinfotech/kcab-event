package com.power.config;

import com.power.PowerReactApplication;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

/**
 * DataSourceConfig - MyBatis / 트랜잭션 설정
 *
 * <p>application.yml의 DataSource를 기반으로 MyBatis {@link SqlSessionFactory}와
 * Spring 트랜잭션 매니저를 구성한다.</p>
 *
 * <h3>설정 내용</h3>
 * <ul>
 *   <li>Mapper 스캔: {@code com.power.dao} 패키지의 {@code @Mapper} 인터페이스를 자동 등록</li>
 *   <li>TypeAlias: {@code com.power.domain} 패키지의 도메인 클래스를 MyBatis TypeAlias로 등록
 *       (XML Mapper에서 전체 패키지명 없이 클래스 단순명으로 사용 가능)</li>
 *   <li>MyBatis 전역 설정: {@code classpath:/mybatis-config.xml}</li>
 *   <li>Mapper XML 위치: {@code classpath:/mappers/*.xml}</li>
 *   <li>트랜잭션 관리: {@code @Transactional} 어노테이션 기반, Bean 이름 "transactionManager"</li>
 * </ul>
 *
 * <h3>관련 파일</h3>
 * <pre>
 * src/main/resources/mybatis-config.xml   - MyBatis 전역 설정 (캐시, lazyLoading 등)
 * src/main/resources/mappers/*.xml        - SQL Mapper XML 파일들
 * application.yml (spring.datasource.*)   - DB 연결 정보
 * </pre>
 */
@Configuration
@EnableTransactionManagement
@MapperScan(basePackages = "com.power.dao")
public class DataSourceConfig {

    /**
     * MyBatis SqlSessionFactory 생성
     *
     * @param dataSource application.yml에서 자동 구성된 DataSource
     * @return 설정이 완료된 SqlSessionFactory
     * @throws Exception SqlSessionFactoryBean 초기화 실패 시
     */
    @Bean("sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        PathMatchingResourcePatternResolver pmrpr = new PathMatchingResourcePatternResolver();
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setTypeAliasesPackage(PowerReactApplication.class.getPackageName() + ".domain");
        sqlSessionFactoryBean.setConfigLocation(pmrpr.getResource("classpath:/mybatis-config.xml"));
        sqlSessionFactoryBean.setMapperLocations(pmrpr.getResources("classpath:/mappers/*.xml"));
        return sqlSessionFactoryBean.getObject();
    }

    /**
     * JDBC 트랜잭션 매니저 생성
     *
     * <p>{@code @Transactional}이 붙은 메서드에 트랜잭션 경계(begin/commit/rollback)를 적용한다.</p>
     *
     * @param dataSource application.yml에서 자동 구성된 DataSource
     * @return DataSourceTransactionManager
     */
    @Bean(name = "transactionManager")
    public DataSourceTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
