'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App } from 'antd';
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons';
import {
  callGetSettingsCodes,
  callGetSettingsGroups,
  callSaveSettingsCodes,
  callSaveSettingsGroups,
} from '@api/admin/SettingsApi';
import { SettingsCode, SettingsGroup } from '@interface/admin/Settings';

type IudType = 'I' | 'U' | 'D';

export default function Settings() {
  const { message, modal } = App.useApp();
  const tempSeqRef = useRef(-1);
  const [groups, setGroups] = useState<SettingsGroup[]>([]);
  const [settingCodes, setSettingCodes] = useState<SettingsCode[]>([]);
  const [selectedGroupSeq, setSelectedGroupSeq] = useState<number | null>(null);
  const [selectedCodeSeq, setSelectedCodeSeq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const visibleGroups = useMemo(() => groups.filter((item) => item.iudType !== 'D'), [groups]);
  const visibleCodes = useMemo(() => settingCodes.filter((item) => item.iudType !== 'D'), [settingCodes]);

  const selectedSettingGroup = useMemo(
    () => visibleGroups.find((item) => item.comGrpCdSeq === selectedGroupSeq) ?? visibleGroups[0],
    [visibleGroups, selectedGroupSeq],
  );
  const selectedSettingCode = useMemo(
    () => visibleCodes.find((item) => item.comCdSeq === selectedCodeSeq),
    [visibleCodes, selectedCodeSeq],
  );

  const markGroupChanged = (row: SettingsGroup): SettingsGroup => ({
    ...row,
    iudType: row.iudType === 'I' ? 'I' : 'U',
  });

  const markCodeChanged = (row: SettingsCode): SettingsCode => ({
    ...row,
    iudType: row.iudType === 'I' ? 'I' : 'U',
  });

  const fetchCodes = async (comGrpCd: string) => {
    if (!comGrpCd) {
      setSettingCodes([]);
      setSelectedCodeSeq(null);
      return;
    }
    const codeRes = await callGetSettingsCodes(comGrpCd);
    const rows = codeRes?.item ?? [];
    setSettingCodes(rows);
    setSelectedCodeSeq(rows[0]?.comCdSeq ?? null);
  };

  const fetchSettings = async (preferredGroupCode?: string) => {
    setLoading(true);
    try {
      const groupRes = await callGetSettingsGroups();
      const groupRows = groupRes?.item ?? [];
      const currentGroupCode = preferredGroupCode ?? selectedSettingGroup?.comGrpCd;
      const nextGroup = groupRows.find((item) => item.comGrpCd === currentGroupCode) ?? groupRows[0];
      setGroups(groupRows);
      setSelectedGroupSeq(nextGroup?.comGrpCdSeq ?? null);
      await fetchCodes(nextGroup?.comGrpCd ?? '');
      setDirty(false);
      setSubmitAttempted(false);
    } catch {
      message.error('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectGroup = async (group: SettingsGroup) => {
    if (group.comGrpCdSeq === selectedGroupSeq) return;
    setSelectedGroupSeq(group.comGrpCdSeq);
    if (!group.comGrpCd || group.iudType === 'I') {
      setSettingCodes([]);
      setSelectedCodeSeq(null);
      return;
    }
    setLoading(true);
    try {
      await fetchCodes(group.comGrpCd);
    } catch {
      message.error('Failed to load setting codes.');
    } finally {
      setLoading(false);
    }
  };

  const normalizeFieldValue = (key: string, value: string): string | number => {
    if (key === 'sortSeq') {
      const digits = value.replace(/[^0-9]/g, '');
      return digits === '' ? 0 : parseInt(digits, 10);
    }
    return value;
  };

  const updateGroup = (target: SettingsGroup, key: keyof SettingsGroup, value: string) => {
    const normalizedValue = key === 'comGrpCd' ? value.toUpperCase() : normalizeFieldValue(key, value);
    setGroups((prev) => prev.map((item) => (
      item.comGrpCdSeq === target.comGrpCdSeq
        ? markGroupChanged({ ...item, [key]: normalizedValue })
        : item
    )));
    setDirty(true);
  };

  const updateCode = (target: SettingsCode, key: keyof SettingsCode, value: string) => {
    const normalizedValue = key === 'comCd' ? value.toUpperCase() : normalizeFieldValue(key, value);
    setSettingCodes((prev) => prev.map((item) => (
      item.comCdSeq === target.comCdSeq
        ? markCodeChanged({ ...item, [key]: normalizedValue })
        : item
    )));
    setDirty(true);
  };

  const addGroup = () => {
    const tempSeq = tempSeqRef.current--;
    const nextRow: SettingsGroup = {
      comGrpCdSeq: tempSeq,
      comGrpCd: '',
      comGrpCdNm: '',
      comGrpCdDesc: '',
      ref01: '',
      ref02: '',
      ref03: '',
      sortSeq: visibleGroups.length + 1,
      iudType: 'I',
    };
    setGroups((prev) => [...prev, nextRow]);
    setSelectedGroupSeq(tempSeq);
    setSettingCodes([]);
    setSelectedCodeSeq(null);
    setDirty(true);
  };

  const removeSelectedGroup = async () => {
    if (!selectedSettingGroup) return;
    if (selectedSettingGroup.iudType === 'I') {
      setGroups((prev) => prev.filter((item) => item.comGrpCdSeq !== selectedSettingGroup.comGrpCdSeq));
    } else {
      setGroups((prev) => prev.map((item) => (
        item.comGrpCdSeq === selectedSettingGroup.comGrpCdSeq ? { ...item, iudType: 'D' as IudType } : item
      )));
    }
    const nextGroup = visibleGroups.find((item) => item.comGrpCdSeq !== selectedSettingGroup.comGrpCdSeq);
    setSelectedGroupSeq(nextGroup?.comGrpCdSeq ?? null);
    setSettingCodes([]);
    setSelectedCodeSeq(null);
    if (nextGroup?.comGrpCd && nextGroup.iudType !== 'I') {
      setLoading(true);
      try {
        await fetchCodes(nextGroup.comGrpCd);
      } catch {
        message.error('Failed to load setting codes.');
      } finally {
        setLoading(false);
      }
    }
    setDirty(true);
  };

  const handleDeleteGroup = () => {
    if (!selectedSettingGroup) {
      message.info('Select a setting group first.');
      return;
    }
    modal.confirm({
      title: 'Delete Setting Group',
      content: 'Do you want to delete this setting group row?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: removeSelectedGroup,
    });
  };

  const addCode = () => {
    if (!selectedSettingGroup?.comGrpCd || selectedSettingGroup.iudType === 'I') {
      message.info('Save the setting group before adding codes.');
      return;
    }
    const tempSeq = tempSeqRef.current--;
    const nextRow: SettingsCode = {
      comCdSeq: tempSeq,
      comGrpCdSeq: selectedSettingGroup.comGrpCdSeq,
      comGrpCd: selectedSettingGroup.comGrpCd,
      comCd: '',
      comCdNm: '',
      comCdDesc: '',
      refval01: '',
      refval02: '',
      refval03: '',
      sortSeq: visibleCodes.length + 1,
      iudType: 'I',
    };
    setSettingCodes((prev) => [...prev, nextRow]);
    setSelectedCodeSeq(tempSeq);
    setDirty(true);
  };

  const removeSelectedCode = () => {
    const row = selectedSettingCode;
    if (!row) return;
    if (row.iudType === 'I') {
      setSettingCodes((prev) => prev.filter((item) => item.comCdSeq !== row.comCdSeq));
    } else {
      setSettingCodes((prev) => prev.map((item) => (
        item.comCdSeq === row.comCdSeq ? { ...item, iudType: 'D' as IudType } : item
      )));
    }
    const nextCode = visibleCodes.find((item) => item.comCdSeq !== row.comCdSeq);
    setSelectedCodeSeq(nextCode?.comCdSeq ?? null);
    setDirty(true);
  };

  const handleDeleteCode = () => {
    if (!selectedSettingCode) {
      message.info('Select a code first.');
      return;
    }
    modal.confirm({
      title: 'Delete Common Code',
      content: 'Do you want to delete this common code row?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: removeSelectedCode,
    });
  };

  const persistSettings = async () => {
    setSaving(true);
    try {
      const selectedGroupCodeBeforeSave = selectedSettingGroup?.comGrpCd;
      const changedGroups = groups.filter((item) => item.iudType);
      if (changedGroups.length) {
        await callSaveSettingsGroups(changedGroups.map((item, index) => ({
          ...item,
          sortSeq: item.sortSeq ?? index + 1,
        })));
      }

      const changedCodes = settingCodes.filter((item) => item.iudType);
      if (selectedSettingGroup?.comGrpCd && selectedSettingGroup.iudType !== 'I' && changedCodes.length) {
        await callSaveSettingsCodes(selectedSettingGroup.comGrpCd, changedCodes.map((item, index) => ({
          ...item,
          comGrpCd: selectedSettingGroup.comGrpCd,
          comCdNm: item.comCdNm || item.comCd,
          sortSeq: item.sortSeq ?? index + 1,
        })));
      }

      message.success('Settings have been saved.');
      await fetchSettings(selectedGroupCodeBeforeSave);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!dirty) {
      message.info('No changes to save.');
      return;
    }
    setSubmitAttempted(true);
    const hasInvalidGroup = visibleGroups.some((item) => !item.comGrpCd?.trim() || !item.comGrpCdNm?.trim());
    const hasInvalidCode = visibleCodes.some((item) => !item.comCd?.trim() || !item.comCdNm?.trim());
    if (hasInvalidGroup || hasInvalidCode) {
      message.error('Please fill in all required fields.');
      return;
    }
    modal.confirm({
      title: 'Save Settings',
      content: 'Do you want to save changes?',
      okText: 'OK',
      cancelText: 'Cancel',
      centered: true,
      onOk: persistSettings,
    });
  };

  const refHeaders = [
    selectedSettingGroup?.ref01 || 'Ref 01',
    selectedSettingGroup?.ref02 || 'Ref 02',
    selectedSettingGroup?.ref03 || 'Ref 03',
  ];
  const requiredInputClass = (value?: string | null) => (
    submitAttempted && !value?.trim() ? 'is-required-error' : undefined
  );

  return (
    <div className="saf-screen saf-settings-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Settings</h1>
          <p>Manage operational rules used across the admin console.</p>
        </div>
        <div className="saf-screen-actions">
            <button type="button" className="saf-action-btn is-secondary" onClick={() => fetchSettings()} disabled={loading || saving}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
          <button type="button" className="saf-action-btn is-primary" onClick={handleSave} disabled={loading || saving || !dirty}>
            <SaveOutlined />
            <span>Save</span>
          </button>
        </div>
      </header>

      <div className="saf-settings-layout">
        <section className="saf-panel saf-settings-grade-panel">
          <div className="saf-settings-panel-head">
            <PanelTitle
              title="Setting Groups"
              subtitle="Manage common code groups used by settings."
            />
            <div className="saf-settings-row-actions">
              <button type="button" className="saf-action-btn is-secondary" onClick={addGroup} disabled={loading || saving}>
                <PlusOutlined />
                <span>Add</span>
              </button>
              <button type="button" className="saf-action-btn is-danger" onClick={handleDeleteGroup} disabled={loading || saving || !selectedSettingGroup}>
                <DeleteOutlined />
                <span>Delete</span>
              </button>
            </div>
          </div>
          <div className="saf-table-wrap saf-settings-group-table-wrap">
            <table className="saf-table saf-settings-grade-table">
              <thead>
                <tr>
                  <th className="saf-settings-sort-col">Sort</th>
                  <th><RequiredHeader>Group Code</RequiredHeader></th>
                  <th><RequiredHeader>Group Name</RequiredHeader></th>
                  <th>Ref 01</th>
                  <th>Ref 02</th>
                  <th>Ref 03</th>
                </tr>
              </thead>
              <tbody>
                {visibleGroups.map((item) => (
                  <tr
                    key={item.comGrpCdSeq}
                    className={item.comGrpCdSeq === selectedSettingGroup?.comGrpCdSeq ? 'is-selected' : ''}
                    onClick={() => handleSelectGroup(item)}
                  >
                    <td className="saf-settings-sort-col">
                      <input
                        type="number"
                        min={0}
                        className="saf-settings-sort-input"
                        value={item.sortSeq ?? 0}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => updateGroup(item, 'sortSeq', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.comGrpCd}
                        className={requiredInputClass(item.comGrpCd)}
                        aria-invalid={submitAttempted && !item.comGrpCd?.trim()}
                        disabled={item.iudType !== 'I'}
                        onChange={(event) => updateGroup(item, 'comGrpCd', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.comGrpCdNm ?? ''}
                        className={requiredInputClass(item.comGrpCdNm)}
                        aria-invalid={submitAttempted && !item.comGrpCdNm?.trim()}
                        onChange={(event) => updateGroup(item, 'comGrpCdNm', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.ref01 ?? ''}
                        onChange={(event) => updateGroup(item, 'ref01', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.ref02 ?? ''}
                        onChange={(event) => updateGroup(item, 'ref02', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.ref03 ?? ''}
                        onChange={(event) => updateGroup(item, 'ref03', event.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                {!visibleGroups.length && (
                  <tr>
                    <td colSpan={6} className="saf-settings-empty">
                      <SettingOutlined />
                      <span>{loading ? 'Loading...' : 'No setting groups found.'}</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="saf-panel saf-settings-limit-panel">
          <div className="saf-settings-panel-head">
            <PanelTitle
              title="Setting Groups Code"
              subtitle="Manage common codes under the selected setting group."
            />
            <div className="saf-settings-row-actions">
              <button type="button" className="saf-action-btn is-secondary" onClick={addCode} disabled={loading || saving || !selectedSettingGroup}>
                <PlusOutlined />
                <span>Add</span>
              </button>
              <button type="button" className="saf-action-btn is-danger" onClick={handleDeleteCode} disabled={loading || saving || !selectedSettingCode}>
                <DeleteOutlined />
                <span>Delete</span>
              </button>
            </div>
          </div>
          <div className="saf-table-wrap">
            <table className="saf-table saf-settings-limit-table">
              <thead>
                <tr>
                  <th className="saf-settings-sort-col">Sort</th>
                  <th><RequiredHeader>Code</RequiredHeader></th>
                  <th><RequiredHeader>Name</RequiredHeader></th>
                  <th>{refHeaders[0]}</th>
                  <th>{refHeaders[1]}</th>
                  <th>{refHeaders[2]}</th>
                </tr>
              </thead>
              <tbody>
                {visibleCodes.map((item) => (
                  <tr
                    key={item.comCdSeq}
                    className={item.comCdSeq === selectedCodeSeq ? 'is-selected' : ''}
                    onClick={() => setSelectedCodeSeq(item.comCdSeq)}
                  >
                    <td className="saf-settings-sort-col">
                      <input
                        type="number"
                        min={0}
                        className="saf-settings-sort-input"
                        value={item.sortSeq ?? 0}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => updateCode(item, 'sortSeq', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.comCd}
                        className={requiredInputClass(item.comCd)}
                        aria-invalid={submitAttempted && !item.comCd?.trim()}
                        disabled={item.iudType !== 'I'}
                        onChange={(event) => updateCode(item, 'comCd', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.comCdNm ?? ''}
                        className={requiredInputClass(item.comCdNm)}
                        aria-invalid={submitAttempted && !item.comCdNm?.trim()}
                        onChange={(event) => updateCode(item, 'comCdNm', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.refval01 ?? ''}
                        onChange={(event) => updateCode(item, 'refval01', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.refval02 ?? ''}
                        onChange={(event) => updateCode(item, 'refval02', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={item.refval03 ?? ''}
                        onChange={(event) => updateCode(item, 'refval03', event.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                {!visibleCodes.length && (
                  <tr>
                    <td colSpan={6} className="saf-settings-empty">
                      <SettingOutlined />
                      <span>{loading ? 'Loading...' : 'No common codes found.'}</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function RequiredHeader({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <span className="saf-grid-required-mark" aria-hidden="true">*</span>
    </>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="saf-panel-title">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
