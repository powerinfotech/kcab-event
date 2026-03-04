import React, {useEffect} from 'react';
import {PageButtonHandlers} from '@interface/common';

export function usePageHandlers(
    handlersRef: React.MutableRefObject<PageButtonHandlers> | undefined,
    handlers: PageButtonHandlers,
): void {
    useEffect(() => {
        if (handlersRef) handlersRef.current = handlers;
    });
    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);
}
