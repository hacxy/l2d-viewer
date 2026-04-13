import { useAtomValue } from 'jotai'
import { hitAreaBoundsAtom } from '@/atoms/model'

export default function HitAreaOverlay() {
  const bounds = useAtomValue(hitAreaBoundsAtom)

  return (
    <>
      {bounds.map((area) => (
        <div
          key={area.name}
          style={{
            position: 'absolute',
            left: `${area.x * 100}%`,
            top: `${area.y * 100}%`,
            width: `${area.w * 100}%`,
            height: `${area.h * 100}%`,
            border: '2px solid rgba(0, 255, 128, 0.8)',
            backgroundColor: 'rgba(0, 255, 128, 0.1)',
            pointerEvents: 'none',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ color: '#00ff80', fontSize: 12, padding: '2px 4px' }}>
            {area.name}
          </span>
        </div>
      ))}
    </>
  )
}
