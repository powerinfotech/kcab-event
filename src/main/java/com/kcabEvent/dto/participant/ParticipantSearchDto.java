package com.kcabEvent.dto.participant;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ParticipantSearchDto {
    private String keyword;
    private List<Long> eventSeqs;
    private List<String> statuses;
    private Long organizationSeq;
}
