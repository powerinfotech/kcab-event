package com.kcabEvent.controller.payment;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.payment.PaymentCancelRequestDto;
import com.kcabEvent.dto.payment.PaymentDetailDto;
import com.kcabEvent.dto.payment.PaymentEventOptionDto;
import com.kcabEvent.dto.payment.PaymentListDto;
import com.kcabEvent.dto.payment.PaymentMemoRequestDto;
import com.kcabEvent.dto.payment.PaymentSearchDto;
import com.kcabEvent.service.payment.PaymentService;
import jakarta.annotation.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/admin/payments")
public class PaymentController {

    @Resource(name = "paymentService")
    private PaymentService paymentService;

    @GetMapping
    public ApiResponse<List<PaymentListDto>> selectPaymentList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String eventSeqs,
            @RequestParam(required = false) String statuses,
            @RequestParam(required = false) String pgProviders,
            @RequestParam(required = false) String paymentMethods,
            @RequestParam(required = false) String currencies,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount
    ) {
        PaymentSearchDto searchDto = new PaymentSearchDto();
        searchDto.setKeyword(keyword);
        searchDto.setEventSeqs(parseLongCsv(eventSeqs));
        searchDto.setStatuses(parseStringCsv(statuses));
        searchDto.setPgProviders(parseStringCsv(pgProviders));
        searchDto.setPaymentMethods(parseStringCsv(paymentMethods));
        searchDto.setCurrencies(parseStringCsv(currencies));
        searchDto.setFromDate(fromDate);
        searchDto.setToDate(toDate);
        searchDto.setMinAmount(minAmount);
        searchDto.setMaxAmount(maxAmount);
        return ApiResponse.ok(paymentService.selectPaymentList(searchDto, loginUser));
    }

    @GetMapping("/events")
    public ApiResponse<List<PaymentEventOptionDto>> selectEventOptions(@KcabEventSession LoginUser loginUser) {
        return ApiResponse.ok(paymentService.selectEventOptions(loginUser));
    }

    @GetMapping("/{paymentSeq}")
    public ApiResponse<PaymentDetailDto> selectPaymentDetail(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long paymentSeq
    ) {
        return ApiResponse.ok(paymentService.selectPaymentDetail(paymentSeq, loginUser));
    }

    @PostMapping("/{paymentSeq}/cancel")
    public ApiResponse<PaymentDetailDto> cancelPayment(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long paymentSeq,
            @RequestBody PaymentCancelRequestDto request
    ) {
        return ApiResponse.ok(paymentService.cancelPayment(paymentSeq, request, loginUser));
    }

    @PutMapping("/{paymentSeq}/memo")
    public ApiResponse<Void> updateMemo(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long paymentSeq,
            @RequestBody PaymentMemoRequestDto request
    ) {
        paymentService.updateAdminMemo(paymentSeq, request != null ? request.getAdminMemo() : null, loginUser);
        return ApiResponse.ok();
    }

    private List<Long> parseLongCsv(String csv) {
        return parseStringCsv(csv).stream().map(Long::valueOf).toList();
    }

    private List<String> parseStringCsv(String csv) {
        if (csv == null || csv.isBlank()) {
            return List.of();
        }
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .toList();
    }
}
