package com.kcabEvent.dto.event;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventReviewRequestDto {
    @NotBlank(message = "Please enter a rejection reason.")
    private String rejectionReason;
}
