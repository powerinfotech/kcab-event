package com.kcabEvent.util;

import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.Base64;

/**
 * Builds the shared HTML shell used by editable email templates.
 */
public final class EmailHtmlLayout {

    private static final String BRAND_NAME = "Seoul ADR Festival";
    private static final String HEADER_BACKGROUND = "#62c4d2";
    private static final String STAMP_IMAGE_RESOURCE = "email-assets/seoul-adr-stamp.png";
    private static final String STAMP_IMAGE_SRC = loadStampImageSrc();

    private EmailHtmlLayout() {
    }

    public static String wrapTemplateBody(String bodyHtml) {
        return wrapTemplateBody(bodyHtml, null);
    }

    public static String wrapTemplateBody(String bodyHtml, String topImageSrc) {
        String normalizedHtml = normalizeStoredHtml(bodyHtml);
        if (!StringUtils.hasText(normalizedHtml)) {
            normalizedHtml = "<p>No body content.</p>";
        }
        if (isFullHtmlDocument(normalizedHtml)) {
            return normalizedHtml;
        }

        return """
                <!doctype html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <style>
                      body { margin: 0; background: #f4f6f9; font-family: Arial, 'Segoe UI', sans-serif; color: #1f2937; }
                      .mail-shell { max-width: 640px; margin: 0 auto; padding: 32px 20px; }
                      .mail-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
                      .mail-header { padding: 24px 28px; background: __HEADER_BACKGROUND__; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: .2px; }
                      .mail-body { padding: 28px; font-size: 15px; line-height: 1.65; }
                      .mail-top-image { margin: 0 0 24px; }
                      .mail-top-image img { display: block; width: 100%; max-width: 584px; height: auto; border: 0; border-radius: 6px; }
                      .mail-body p { margin: 0 0 14px; }
                      .mail-body a { color: #1f5b95; font-weight: 700; }
                      .mail-footer { padding: 18px 28px; border-top: 1px solid #edf1f5; color: #64748b; font-size: 12px; line-height: 1.5; }
                      .mail-footer-text { vertical-align: bottom; }
                      .mail-stamp-cell { width: 172px; text-align: right; vertical-align: bottom; }
                      .mail-stamp { display: block; width: 158px; max-width: 158px; height: auto; margin-left: auto; }
                      img { max-width: 100%; height: auto; }
                      table { max-width: 100%; }
                    </style>
                  </head>
                  <body style="margin:0;background:#f4f6f9;font-family:Arial,'Segoe UI',sans-serif;color:#1f2937;">
                    <div class="mail-shell" style="max-width:640px;margin:0 auto;padding:32px 20px;">
                      <div class="mail-card" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                        <div class="mail-header" style="padding:24px 28px;background:__HEADER_BACKGROUND__;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:.2px;">__BRAND_NAME__</div>
                        <div class="mail-body" style="padding:28px;font-size:15px;line-height:1.65;">__TOP_IMAGE_HTML____BODY_HTML__</div>
                        <div class="mail-footer" style="padding:18px 28px;border-top:1px solid #edf1f5;color:#64748b;font-size:12px;line-height:1.5;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;max-width:100%;">
                            <tr>
                              <td class="mail-footer-text" style="vertical-align:bottom;color:#64748b;font-size:12px;line-height:1.5;">This is an automated email from __BRAND_NAME__.</td>
                              <td class="mail-stamp-cell" align="right" style="width:172px;text-align:right;vertical-align:bottom;">
                                <img class="mail-stamp" src="__STAMP_IMAGE_SRC__" width="158" alt="Seoul ADR Festival" style="display:block;width:158px;max-width:158px;height:auto;margin-left:auto;">
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                  </body>
                </html>
                """
                .replace("__HEADER_BACKGROUND__", HEADER_BACKGROUND)
                .replace("__BRAND_NAME__", BRAND_NAME)
                .replace("__STAMP_IMAGE_SRC__", STAMP_IMAGE_SRC)
                .replace("__TOP_IMAGE_HTML__", buildTopImageHtml(topImageSrc))
                .replace("__BODY_HTML__", normalizedHtml);
    }

    private static boolean isFullHtmlDocument(String html) {
        return html != null && html.matches("(?is).*<html[\\s>].*");
    }

    private static String loadStampImageSrc() {
        try (InputStream input = EmailHtmlLayout.class.getClassLoader().getResourceAsStream(STAMP_IMAGE_RESOURCE)) {
            if (input == null) {
                throw new IllegalStateException("Email stamp image resource not found: " + STAMP_IMAGE_RESOURCE);
            }
            String base64 = Base64.getEncoder().encodeToString(input.readAllBytes());
            return "data:image/png;base64," + base64;
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load email stamp image.", e);
        }
    }

    private static String buildTopImageHtml(String topImageSrc) {
        if (!StringUtils.hasText(topImageSrc)) {
            return "";
        }
        return """
                <div class="mail-top-image" style="margin:0 0 24px;">
                  <img src="__TOP_IMAGE_SRC__" alt="" style="display:block;width:100%;max-width:584px;height:auto;border:0;border-radius:6px;">
                </div>
                """.replace("__TOP_IMAGE_SRC__", escapeAttribute(topImageSrc.trim()));
    }

    private static String escapeAttribute(String value) {
        return value
                .replace("&", "&amp;")
                .replace("\"", "&quot;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }

    private static String normalizeStoredHtml(String bodyHtml) {
        String html = bodyHtml == null ? "" : bodyHtml.trim();
        if (!StringUtils.hasText(html)) {
            return "";
        }
        if (html.contains("<")) {
            return html;
        }
        if (!html.matches("(?is).*&(?:amp|lt|gt|quot|#35|#39|#40|#41);.*")) {
            return html;
        }

        return html
                .replace("&#35;", "#")
                .replace("&#40;", "(")
                .replace("&#41;", ")")
                .replace("&amp;", "&")
                .replace("&lt;", "<")
                .replace("&gt;", ">")
                .replace("&quot;", "\"")
                .replace("&#39;", "'");
    }
}
