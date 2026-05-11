package com.kcabEvent.dto.participant;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ParticipantListDto {
    private Long participantSeq;
    private String email;
    private String fullName;
    private String organizationName;
    private String position;
    private String country;
    private Integer eventCount = 0;
    private String statusSummary;
    private LocalDateTime latestRegisteredAt;
    private List<ParticipantEventDto> events = new ArrayList<>();

    public void refreshSummary() {
        if (eventCount == null || eventCount <= 0) {
            eventCount = events.size();
        }
        Map<String, Integer> counts = new LinkedHashMap<>();
        for (ParticipantEventDto event : events) {
            String status = event.getStatus() != null ? event.getStatus() : "unknown";
            counts.put(status, counts.getOrDefault(status, 0) + 1);
            LocalDateTime registeredAt = event.getRegisteredAt();
            if (registeredAt != null && (latestRegisteredAt == null || registeredAt.isAfter(latestRegisteredAt))) {
                latestRegisteredAt = registeredAt;
            }
        }
        statusSummary = counts.entrySet().stream()
                .map(entry -> entry.getKey() + " " + entry.getValue())
                .reduce((left, right) -> left + " · " + right)
                .orElse("-");
    }
}
