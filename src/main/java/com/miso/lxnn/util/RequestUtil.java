package com.miso.lxnn.util;


import javax.servlet.http.HttpServletRequest;


public class RequestUtil {
    public static String getClientIp(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getHeader("Proxy-Client-IP");
        }
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getHeader("WL-Proxy-Client-IP");
        }
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (clientIp  == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp )) {
            clientIp  = request.getHeader("X-Real-IP");
        }
        if (clientIp  == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp )) {
            clientIp  = request.getHeader("X-RealIP");
        }
        if (clientIp  == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp )) {
            clientIp  = request.getHeader("REMOTE_ADDR");
        }
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        }
        return clientIp;
    }

    public static String getClientOS(String userAgent) {
        String os = "";
        userAgent = userAgent.toLowerCase();
        if (userAgent.contains("windows")) {
            os = "Windows";
        } else if (userAgent.contains("iphone")) {
            os = "iPhone";
        } else if (userAgent.contains("ipad")) {
            os = "iPad";
        } else if (userAgent.contains("android")) {
            os = "android";
        } else if (userAgent.contains("mac")) {
            os = "mac";
        } else if (userAgent.contains("linux")) {
            os = "Linux";
        } else {
            os = "Other";
        }

        return os;
    }


    public static String getBrowser(String userAgent) {
        String browser 	 = "";

        if(userAgent.contains("Trident")) {
            browser = "ie";
        } else if(userAgent.contains("Edge")) {
            browser = "edge";
        } else if(userAgent.contains("Whale")) {
            browser = "whale";
        } else if(userAgent.contains("Opera") || userAgent.contains("OPR")) {
            browser = "opera";
        } else if(userAgent.contains("Firefox")) {
            browser = "firefox";
        } else if(userAgent.contains("Safari") && !userAgent.contains("Chrome")) {
            browser = "safari";
        } else if(userAgent.contains("Chrome")) {
            browser = "chrome";
        }

	    return browser;
    }

     public static String getUserAgent(HttpServletRequest request) {
        return request.getHeader("USER-AGENT");
     }
}
