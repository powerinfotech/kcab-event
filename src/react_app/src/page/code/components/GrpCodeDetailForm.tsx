import React from 'react';
import CustomInput from '@component/input/CustomInput';
import {ComGrpCdList} from '@interface/code/CommonGroupCode';
import {REF_FIELDS} from '../hooks/useCommonCodeIntegrated';

interface GrpCodeDetailFormProps {
    selectedGrpCd: ComGrpCdList | null;
    onDetailChange: (field: string, value: string) => void;
}

const GrpCodeDetailForm: React.FC<GrpCodeDetailFormProps> = ({
    selectedGrpCd,
    onDetailChange,
}) => {
    if (!selectedGrpCd) return null;

    const stringFields = REF_FIELDS.filter(f => f.type === 'string');
    const integerFields = REF_FIELDS.filter(f => f.type === 'integer');
    const floatFields = REF_FIELDS.filter(f => f.type === 'float');

    const renderRefField = (f: typeof REF_FIELDS[0]) => (
        <div key={f.ref} style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
            <span style={{minWidth: 55, fontSize: 12, color: '#666'}}>{f.label}</span>
            <CustomInput
                value={selectedGrpCd[f.ref] ?? ''}
                maxLength={200}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDetailChange(f.ref, e.target.value)}
                style={{flex: 1}}
                placeholder={`${f.label} 컬럼명`}
            />
        </div>
    );

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                <span style={{minWidth: 55, fontSize: 12, color: '#666'}}>설명</span>
                <CustomInput
                    value={selectedGrpCd.comGrpCdDesc ?? ''}
                    maxLength={200}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDetailChange('comGrpCdDesc', e.target.value)}
                    style={{flex: 1}}
                />
            </div>

            <div style={{fontSize: 12, fontWeight: 600, margin: '8px 0 4px', color: '#333'}}>관리항목(문자형)</div>
            {stringFields.map(renderRefField)}

            <div style={{fontSize: 12, fontWeight: 600, margin: '8px 0 4px', color: '#333'}}>관리항목(정수형)</div>
            {integerFields.map(renderRefField)}

            <div style={{fontSize: 12, fontWeight: 600, margin: '8px 0 4px', color: '#333'}}>관리항목(실수형)</div>
            {floatFields.map(renderRefField)}
        </div>
    );
};

export default GrpCodeDetailForm;
