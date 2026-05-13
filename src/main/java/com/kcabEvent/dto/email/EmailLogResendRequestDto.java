package com.kcabEvent.dto.email;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmailLogResendRequestDto {
    private List<Long> emailLogSeqs;
}
