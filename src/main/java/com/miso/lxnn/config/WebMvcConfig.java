package com.miso.lxnn.config;

import com.miso.lxnn.config.interceptor.LogInterceptor;
import com.miso.lxnn.config.interceptor.SessionCheckInterceptor;
import com.miso.lxnn.util.formatter.LocalDateFormatter;
import com.miso.lxnn.util.formatter.LocalDateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@RequiredArgsConstructor
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final LoginUserArgumentResolver loginUserArgumentResolver;

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:[\\w\\-]+}").setViewName("forward:/");
        registry.addViewController("/**/{spring:[\\w\\-]+}").setViewName("forward:/");
        registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}").setViewName("forward:/");
//        registry.addViewController("/secure-login").setViewName("forward:/");

        // /api/로 시작하지 않는 url은 모두 client 화면으로 보내줄 것이다
        registry.addViewController("/{x:^(?!api$).*$}/**/{y:[\\w\\-]+}").setViewName("forward:/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedHeaders("*")
                .allowedMethods("OPTIONS", "GET", "POST", "PUT", "DELETE")
                .maxAge(300);
    }


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SessionCheckInterceptor())
                .order(1) //첫번째로 실행 될 인터셉터로 등록
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/common/login-info", "/api/login", "/api/logout", "/css/**", "/images/**", "/js/**","/api/find-user/**");

        registry.addInterceptor(new LogInterceptor())
                .order(2) //첫번째로 실행 될 인터셉터로 등록
                .addPathPatterns("/api/**")
                .excludePathPatterns("/css/**", "/images/**", "/js/**");
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new LocalDateFormatter());
        registry.addFormatter(new LocalDateTimeFormatter());
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolverList) {
        resolverList.add(loginUserArgumentResolver);
    }

}