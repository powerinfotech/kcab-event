package com.kcabEvent.dto.email;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmailLogResendResultDto {
    private int requestedCount;
    private int successCount;
    private int failedCount;
}
