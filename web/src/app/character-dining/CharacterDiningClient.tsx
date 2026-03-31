'use client';

import type { CharacterDining } from '@/lib/sanity-types';
import CharacterDiningTable from '@/components/CharacterDiningTable';

interface CharacterDiningClientProps {
  diningList: CharacterDining[];
}

export default function CharacterDiningClient({ diningList }: CharacterDiningClientProps) {
  return (
    <div className="dining-page-wrapper">
      <CharacterDiningTable diningList={diningList} />
    </div>
  );
}
