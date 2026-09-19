export default function ColumnDivider({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
      <svg
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        style={{ width: '100px', height: '100%', position: 'absolute', right: '-1px' }}
      >
        <path
          d="M100,0 C20,150 120,350 40,550 C-40,750 80,850 0,1000 L100,1000 Z"
          fill="#FFF8E7" 
        />
      </svg>
    </div>
  );
}
