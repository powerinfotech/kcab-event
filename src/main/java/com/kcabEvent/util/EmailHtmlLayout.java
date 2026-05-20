package com.kcabEvent.util;

import org.springframework.util.StringUtils;

/**
 * Builds the shared HTML shell used by editable email templates.
 */
public final class EmailHtmlLayout {

    private static final String BRAND_NAME = "Seoul ADR Festival";
    private static final String HEADER_BACKGROUND = "#62c4d2";
    private static final String STAMP_IMAGE_SRC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iMTI0IiB2aWV3Qm94PSIwIDAgMjIwIDEyNCI+CiAgPHJlY3Qgd2lkdGg9IjIyMCIgaGVpZ2h0PSIxMjQiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgc3Ryb2tlPSIjNzNjOWQ3IiBzdHJva2Utd2lkdGg9IjEuNiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDxwYXRoIGQ9Ik0zNiA0MmMxOCA4IDQ5IDExIDc0IDExczU2LTMgNzQtMTEiLz4KICAgIDxwYXRoIGQ9Ik00OCAzNGMxMiA4IDM5IDExIDYyIDExczUwLTMgNjItMTEiLz4KICAgIDxwYXRoIGQ9Ik00MiAzOWMxNSA3IDQzIDEwIDY4IDEwczUzLTMgNjgtMTAiLz4KICAgIDxwYXRoIGQ9Ik01MiAyOGM0IDcgMCAxMC01IDExIi8+CiAgICA8cGF0aCBkPSJNMTY4IDI4Yy00IDcgMCAxMCA1IDExIi8+CiAgICA8cGF0aCBkPSJNNjUgMzNjMTcgNSA3MyA1IDkwIDAiLz4KICAgIDxwYXRoIGQ9Ik0zOSA2MWgxNDIiLz4KICAgIDxwYXRoIGQ9Ik00NyA1N2MxNyA3IDQzIDkgNjMgOXM0Ni0yIDYzLTkiLz4KICAgIDxwYXRoIGQ9Ik01MiA2NmgxMTYiLz4KICAgIDxwYXRoIGQ9Ik02MSA2OWg5OCIvPgogICAgPHBhdGggZD0iTTczIDUydjIzTTg4IDUzdjIyTTEwMyA1NHYyMU0xMTggNTR2MjFNMTMzIDUzdjIyTTE0OCA1MnYyMyIvPgogICAgPHBhdGggZD0iTTY1IDc1aDkwIi8+CiAgICA8cGF0aCBkPSJNNTkgODBoMTAyIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjExMCIgeT0iMTA0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9IjgwMCIgbGV0dGVyLXNwYWNpbmc9IjAuNiIgZmlsbD0iIzFmNzhhNCI+U0VPVUwgQURSIEZFU1RJVkFMPC90ZXh0Pgo8L3N2Zz4=";

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
                      .mail-header { padding: 24px 28px; background: __HEADER_BACKGROUND__; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: .2px; }
                      .mail-body { padding: 28px; font-size: 15px; line-height: 1.65; }
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
                        <div class="mail-body" style="padding:28px;font-size:15px;line-height:1.65;">__BODY_HTML__</div>
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
                .replace("__BODY_HTML__", normalizedHtml);
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
