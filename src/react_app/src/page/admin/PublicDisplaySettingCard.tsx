'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { App } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import {
  callGetAdminDisplaySetting,
  callSaveDisplaySetting,
} from '@api/displaySetting/DisplaySettingApi';

const CURRENT_YEAR = new Date().getFullYear();

export default function PublicDisplaySettingCard() {
  const { message } = App.useApp();
  const [editionYear, setEditionYear] = useState<number | null>(null);
  const [showPartners, setShowPartners] = useState<string>('Y');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    callGetAdminDisplaySetting()
      .then((res) => {
        const item = res?.item;
        setEditionYear(item?.editionYear ?? null);
        setShowPartners(item?.showSponsors === 'N' ? 'N' : 'Y');
        setAvailableYears(item?.availableYears ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const yearOptions = useMemo(() => {
    const set = new Set<number>(availableYears);
    if (editionYear) set.add(editionYear);
    if (set.size === 0) set.add(CURRENT_YEAR);
    return Array.from(set).sort((a, b) => b - a);
  }, [availableYears, editionYear]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await callSaveDisplaySetting({ editionYear, showSponsors: showPartners });
      if (res?.code !== 200) {
        message.error(res?.message || 'Failed to save.');
        return;
      }
      message.success('Public display settings have been saved.');
    } catch {
      message.error('Failed to save public display settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="saf-panel saf-display-setting-panel">
      <div className="saf-display-setting-head">
        <h2>Public partners display</h2>
        <p>Show Sponsors / Supporters / Media partners on the public site, for the chosen edition year.</p>
      </div>

      <div className="saf-display-setting-row">
        <label className="saf-form-field saf-display-setting-year">
          <span>Edition year</span>
          <select
            value={editionYear ?? ''}
            onChange={(e) => setEditionYear(e.target.value ? Number(e.target.value) : null)}
            disabled={loading || saving}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>

        <div className="saf-display-setting-toggle">
          <span>Show partners</span>
          <button
            type="button"
            role="switch"
            aria-checked={showPartners === 'Y'}
            className={`saf-toggle${showPartners === 'Y' ? ' is-on' : ''}`}
            onClick={() => setShowPartners((v) => (v === 'Y' ? 'N' : 'Y'))}
            disabled={loading || saving}
          >
            <span className="saf-toggle-knob" />
          </button>
          <span className="saf-display-setting-state">{showPartners === 'Y' ? 'Visible' : 'Hidden'}</span>
        </div>

        <button
          type="button"
          className="saf-action-btn is-primary saf-display-setting-save"
          onClick={handleSave}
          disabled={loading || saving}
        >
          <SaveOutlined />
          <span>{saving ? 'Saving…' : 'Save'}</span>
        </button>
      </div>
    </section>
  );
}
