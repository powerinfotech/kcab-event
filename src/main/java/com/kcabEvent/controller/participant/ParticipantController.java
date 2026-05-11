package com.kcabEvent.controller.participant;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.participant.ParticipantEventOptionDto;
import com.kcabEvent.dto.participant.ParticipantListDto;
import com.kcabEvent.service.participant.ParticipantService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/admin/participants")
public class ParticipantController {

    @Resource(name = "participantService")
    private ParticipantService participantService;

    @GetMapping
    public ApiResponse<List<ParticipantListDto>> selectParticipantList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String eventSeqs,
            @RequestParam(required = false) String statuses
    ) {
        return ApiResponse.ok(participantService.selectParticipantList(
                keyword,
                parseLongCsv(eventSeqs),
                parseStringCsv(statuses),
                loginUser
        ));
    }

    @GetMapping("/events")
    public ApiResponse<List<ParticipantEventOptionDto>> selectEventOptions(@KcabEventSession LoginUser loginUser) {
        return ApiResponse.ok(participantService.selectEventOptions(loginUser));
    }

    private List<Long> parseLongCsv(String csv) {
        return parseStringCsv(csv).stream()
                .map(Long::valueOf)
                .toList();
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
