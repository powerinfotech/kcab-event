package com.kcabEvent.util;

import org.springframework.util.StringUtils;

/**
 * Builds the shared HTML shell used by editable email templates.
 */
public final class EmailHtmlLayout {

    private EmailHtmlLayout() {
    }

    public static String wrapTemplateBody(String bodyHtml) {
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
                      .mail-header { padding: 24px 28px; background: #102033; color: #ffffff; font-size: 20px; font-weight: 700; }
                      .mail-body { padding: 28px; font-size: 15px; line-height: 1.65; }
                      .mail-body p { margin: 0 0 14px; }
                      .mail-body a { color: #1f5b95; font-weight: 700; }
                      .mail-footer { padding: 18px 28px; border-top: 1px solid #edf1f5; color: #64748b; font-size: 12px; line-height: 1.5; }
                      img { max-width: 100%; height: auto; }
                      table { max-width: 100%; }
                    </style>
                  </head>
                  <body style="margin:0;background:#f4f6f9;font-family:Arial,'Segoe UI',sans-serif;color:#1f2937;">
                    <div class="mail-shell" style="max-width:640px;margin:0 auto;padding:32px 20px;">
                      <div class="mail-card" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                        <div class="mail-header" style="padding:24px 28px;background:#102033;color:#ffffff;font-size:20px;font-weight:700;">KCAB INTERNATIONAL</div>
                        <div class="mail-body" style="padding:28px;font-size:15px;line-height:1.65;">__BODY_HTML__</div>
                        <div class="mail-footer" style="padding:18px 28px;border-top:1px solid #edf1f5;color:#64748b;font-size:12px;line-height:1.5;">This is an automated email from KCAB International.</div>
                      </div>
                    </div>
                  </body>
                </html>
                """.replace("__BODY_HTML__", normalizedHtml);
    }

    private static boolean isFullHtmlDocument(String html) {
        return html != null && html.matches("(?is).*<html[\\s>].*");
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
