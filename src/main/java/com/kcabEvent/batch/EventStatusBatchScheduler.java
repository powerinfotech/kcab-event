package com.kcabEvent.batch;

import com.kcabEvent.service.event.EventBatchService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class EventStatusBatchScheduler {

    @Resource(name = "eventBatchService")
    private EventBatchService eventBatchService;

    @Scheduled(
            cron = "${saf.batch.close-expired-events.cron:0 0 * * * *}",
            zone = "${saf.batch.close-expired-events.zone:Asia/Seoul}"
    )
    public void closeExpiredEvents() {
        int updatedCount = eventBatchService.closeExpiredEvents();
        if (updatedCount > 0) {
            log.info("Closed expired events. updatedCount={}", updatedCount);
        } else {
            log.debug("No expired events to close.");
        }
    }

}
