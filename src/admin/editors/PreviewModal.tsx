import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Monitor, RotateCw, Smartphone, Tablet } from 'lucide-react';
import { Btn, IconBtn, Modal } from '../components/ui';

const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: 1440, icon: Monitor },
  { id: 'tablet', label: 'Tablet', width: 768, icon: Tablet },
  { id: 'mobile', label: 'Mobile', width: 375, icon: Smartphone },
] as const;

/** Loads the real public site in draft mode, so previews can never drift from what ships. */
export const PreviewModal: React.FC<{ open: boolean; onClose: () => void; path: string; sectionId?: string }> = ({ open, onClose, path, sectionId }) => {
  const [device, setDevice] = useState<(typeof DEVICES)[number]['id']>('desktop');
  const [sectionOnly, setSectionOnly] = useState(false);
  const [nonce, setNonce] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(1000);
  const width = DEVICES.find((d) => d.id === device)!.width;

  useEffect(() => {
    if (!open || !stageRef.current) return;
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (open) setSectionOnly(Boolean(sectionId));
  }, [open, sectionId]);

  const joiner = path.includes('?') ? '&' : '?';
  const src = `${path}${joiner}cmsPreview=draft${sectionOnly && sectionId ? `&cmsSection=${sectionId}` : ''}`;
  const scale = Math.min(1, stageWidth / width);

  return (
    <Modal open={open} onClose={onClose} title="Draft preview" size="full">
      <div className="flex flex-col h-full gap-3 min-h-[60vh]">
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Preview size" className="adm-tile !rounded-full flex gap-1 p-1">
            {DEVICES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={device === id}
                onClick={() => setDevice(id)}
                className={`min-h-[34px] px-3.5 rounded-full inline-flex items-center gap-1.5 text-[13px] transition-colors ${device === id ? 'bg-adm-deep text-white' : 'text-adm-mute hover:text-adm-ink'}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          {sectionId && (
            <Btn size="sm" variant="ghost" aria-pressed={sectionOnly} onClick={() => setSectionOnly(!sectionOnly)}>
              {sectionOnly ? 'Show whole page' : 'Show only this section'}
            </Btn>
          )}
          <div className="flex-1" />
          <span className="text-[12px] text-adm-mute hidden sm:inline">{width}px · draft content, not public</span>
          <IconBtn label="Reload preview" onClick={() => setNonce(nonce + 1)}><RotateCw className="w-4 h-4" /></IconBtn>
          <a href={src} target="_blank" rel="noreferrer" aria-label="Open preview in a new tab" title="Open in a new tab" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-adm-mute hover:bg-adm-deep/[0.05]">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div ref={stageRef} className="flex-1 min-h-0 bg-adm-deep/10 rounded-[16px] overflow-hidden flex justify-center">
          <div style={{ width: width * scale, height: '100%' }}>
            <iframe
              key={`${src}-${nonce}`}
              title="Website preview"
              data-testid="preview-frame"
              src={src}
              className="bg-white border-0 origin-top-left"
              style={{ width, height: `${100 / scale}%`, transform: `scale(${scale})` }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
