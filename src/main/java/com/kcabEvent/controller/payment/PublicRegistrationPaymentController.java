package com.kcabEvent.controller.payment;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.paymenttest.PayTestDiscountValidationRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestDiscountValidationResponseDto;
import com.kcabEvent.dto.paymenttest.PayTestParticipantRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestPrepareRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestPrepareResponseDto;
import com.kcabEvent.dto.paymenttest.PayTestPricingOptionDto;
import com.kcabEvent.dto.paymenttest.PayTestResultDto;
import com.kcabEvent.service.payment.PayTestService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
public class PublicRegistrationPaymentController {

    @Resource(name = "payTestService")
    private PayTestService payTestService;

    @GetMapping("/api/public/registration/pricing")
    public ApiResponse<List<PayTestPricingOptionDto>> selectPricing(@RequestParam Long eventSeq) {
        return ApiResponse.ok(payTestService.selectPublicRegistrationPricingOptions(eventSeq));
    }

    @GetMapping("/api/public/registration/participant")
    public ApiResponse<PayTestParticipantRequestDto> selectParticipant(@RequestParam String email) {
        return ApiResponse.ok(payTestService.selectPublicRegistrationParticipant(email));
    }

    @PostMapping("/api/public/registration/discount/validate")
    public ApiResponse<PayTestDiscountValidationResponseDto> validateDiscount(
            @RequestBody PayTestDiscountValidationRequestDto request) {
        return ApiResponse.ok(payTestService.validatePublicRegistrationDiscountCode(request));
    }

    @PostMapping("/api/public/registration/payment/prepare")
    public ApiResponse<PayTestPrepareResponseDto> preparePayment(@RequestBody PayTestPrepareRequestDto request) {
        return ApiResponse.ok(payTestService.preparePublicRegistrationPayment(request));
    }

    @GetMapping("/api/public/registration/payment/result")
    public ApiResponse<PayTestResultDto> selectResult(@RequestParam String orderId) {
        return ApiResponse.ok(payTestService.selectPublicRegistrationPaymentResult(orderId));
    }

    @RequestMapping(
            value = "/api/public/registration/payment/eximbay/status",
            method = {RequestMethod.GET, RequestMethod.POST}
    )
    public ResponseEntity<String> eximbayStatus(HttpServletRequest request) {
        return ResponseEntity.ok(payTestService.processEximbayStatus(request));
    }

    @RequestMapping(
            value = "/api/public/registration/payment/eximbay/return",
            method = {RequestMethod.GET, RequestMethod.POST},
            produces = MediaType.TEXT_HTML_VALUE
    )
    public ResponseEntity<String> eximbayReturn(HttpServletRequest request) {
        String orderId = request.getParameter("order_id");
        if (orderId == null || orderId.isBlank()) {
            orderId = request.getParameter("merchant_order_id");
        }
        String html = """
                <!doctype html>
                <html lang="en">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>Payment Result</title>
                </head>
                <body>
                  <script>
                    (function () {
                      var payload = { type: 'KCAB_EXIMBAY_RETURN', orderId: '%s' };
                      if (window.opener) {
                        window.opener.postMessage(payload, '*');
                        window.close();
                      } else {
                        document.body.textContent = 'Payment result received. You can close this window.';
                      }
                    }());
                  </script>
                </body>
                </html>
                """.formatted(jsEscape(orderId));
        return ResponseEntity.ok()
                .contentType(new MediaType(MediaType.TEXT_HTML, StandardCharsets.UTF_8))
                .body(html);
    }

    private String jsEscape(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("\\", "\\\\")
                .replace("'", "\\'")
                .replace("\r", "")
                .replace("\n", "");
    }
}
