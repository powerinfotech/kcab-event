package com.kcabEvent.controller.payment;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentDiscountValidationRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentDiscountValidationResponseDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentParticipantRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPrepareRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPrepareResponseDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPricingOptionDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentResultDto;
import com.kcabEvent.service.payment.RegistrationPaymentService;
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

    @Resource(name = "registrationPaymentService")
    private RegistrationPaymentService registrationPaymentService;

    @GetMapping("/api/public/registration/pricing")
    public ApiResponse<List<RegistrationPaymentPricingOptionDto>> selectPricing(@RequestParam Long eventSeq) {
        return ApiResponse.ok(registrationPaymentService.selectPublicRegistrationPricingOptions(eventSeq));
    }

    @GetMapping("/api/public/registration/participant")
    public ApiResponse<RegistrationPaymentParticipantRequestDto> selectParticipant(@RequestParam String email) {
        return ApiResponse.ok(registrationPaymentService.selectPublicRegistrationParticipant(email));
    }

    @PostMapping("/api/public/registration/discount/validate")
    public ApiResponse<RegistrationPaymentDiscountValidationResponseDto> validateDiscount(
            @RequestBody RegistrationPaymentDiscountValidationRequestDto request) {
        return ApiResponse.ok(registrationPaymentService.validatePublicRegistrationDiscountCode(request));
    }

    @PostMapping("/api/public/registration/payment/prepare")
    public ApiResponse<RegistrationPaymentPrepareResponseDto> preparePayment(@RequestBody RegistrationPaymentPrepareRequestDto request) {
        return ApiResponse.ok(registrationPaymentService.preparePublicRegistrationPayment(request));
    }

    @GetMapping("/api/public/registration/payment/result")
    public ApiResponse<RegistrationPaymentResultDto> selectResult(@RequestParam String orderId) {
        return ApiResponse.ok(registrationPaymentService.selectPublicRegistrationPaymentResult(orderId));
    }

    @RequestMapping(
            value = "/api/public/registration/payment/eximbay/status",
            method = {RequestMethod.GET, RequestMethod.POST}
    )
    public ResponseEntity<String> eximbayStatus(HttpServletRequest request) {
        return ResponseEntity.ok(registrationPaymentService.processEximbayStatus(request));
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
