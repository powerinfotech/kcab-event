package com.kcabEvent.service.event.impl;

import com.kcabEvent.dao.EventDao;
import com.kcabEvent.service.event.EventBatchService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("eventBatchService")
public class EventBatchServiceImpl extends EgovAbstractServiceImpl implements EventBatchService {

    private static final String STATUS_CLOSED = "closed";
    private static final List<String> CLOSABLE_STATUSES = List.of(
            "pending_approval",
            "published"
    );

    @Resource(name = "eventDao")
    private EventDao eventDao;

    @Override
    @Transactional("transactionManager")
    public int closeExpiredEvents() {
        return eventDao.closeExpiredEvents(STATUS_CLOSED, CLOSABLE_STATUSES);
    }

}
