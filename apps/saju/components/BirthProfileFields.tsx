'use client';

import type { BirthProfile } from '../lib/saju-core';

type Props = {
  profile: BirthProfile;
  onChange: (next: BirthProfile) => void;
  showName?: boolean;
  nameLabel?: string;
  compact?: boolean;
};

export default function BirthProfileFields({ profile, onChange, showName = false, nameLabel = '이름 또는 호칭', compact = false }: Props) {
  const patch = (next: Partial<BirthProfile>) => onChange({ ...profile, ...next });

  return (
    <div className={compact ? 'birthFields compact' : 'birthFields'}>
      {showName && (
        <label>
          <span>{nameLabel}</span>
          <input
            type="text"
            value={profile.name || ''}
            maxLength={20}
            placeholder="선택 입력"
            onChange={(event) => patch({ name: event.target.value })}
          />
        </label>
      )}

      <label>
        <span>성별</span>
        <select value={profile.gender} onChange={(event) => patch({ gender: event.target.value as BirthProfile['gender'] })}>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </label>

      <label>
        <span>달력</span>
        <select
          value={profile.calendarType}
          onChange={(event) => {
            const calendarType = event.target.value as BirthProfile['calendarType'];
            patch({ calendarType, leapMonth: calendarType === 'lunar' ? profile.leapMonth : false });
          }}
        >
          <option value="solar">양력</option>
          <option value="lunar">음력</option>
        </select>
      </label>

      <label className="wideField">
        <span>생년월일</span>
        <input type="date" value={profile.birthDate} onChange={(event) => patch({ birthDate: event.target.value })} required />
      </label>

      <label>
        <span>출생시간</span>
        <input
          type="time"
          value={profile.birthTime}
          disabled={!profile.timeKnown}
          onChange={(event) => patch({ birthTime: event.target.value })}
        />
      </label>

      <label className="inlineCheck">
        <input
          type="checkbox"
          checked={!profile.timeKnown}
          onChange={(event) => patch({ timeKnown: !event.target.checked })}
        />
        <span>출생시간을 모릅니다</span>
      </label>

      {profile.calendarType === 'lunar' && (
        <label className="inlineCheck">
          <input type="checkbox" checked={profile.leapMonth} onChange={(event) => patch({ leapMonth: event.target.checked })} />
          <span>음력 윤달입니다</span>
        </label>
      )}
    </div>
  );
}
