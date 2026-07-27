import type { LoteOverride } from '../../data/oportunidadesData';

type Props = {
  lotes: LoteOverride[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function LoteSelector({ lotes, selectedId, onSelect }: Props) {
  return (
    <div className="pi-lote-selector" role="tablist">
      {lotes.map((lote) => (
        <button
          key={lote.id}
          type="button"
          role="tab"
          aria-selected={lote.id === selectedId}
          className={`pi-lote-tab ${lote.id === selectedId ? 'pi-lote-tab--active' : ''}`}
          onClick={() => onSelect(lote.id)}
        >
          {lote.label}
        </button>
      ))}
    </div>
  );
}
