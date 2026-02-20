package com.miso.lxnn.config;

import com.miso.lxnn.SafetyAdminApplication;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@MapperScan(basePackages= "com.miso.lxnn.dao")
public class DataSourceConfig {
    @Bean("sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        PathMatchingResourcePatternResolver pmrpr = new PathMatchingResourcePatternResolver();
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setTypeAliasesPackage(SafetyAdminApplication.class.getPackageName()+".domain");
        sqlSessionFactoryBean.setConfigLocation(pmrpr.getResource("classpath:/mybatis-config.xml"));
        sqlSessionFactoryBean.setMapperLocations(pmrpr.getResources("classpath:/mappers/*.xml"));

        return sqlSessionFactoryBean.getObject();
    }


    @Bean(name="transactionManager")
    public DataSourceTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
