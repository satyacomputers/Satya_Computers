export default function GrainOverlay({ opacity = 40 }: { opacity?: number }) {
  const opacityClass = opacity === 30 ? 'opacity-30' : opacity === 40 ? 'opacity-40' : opacity === 50 ? 'opacity-50' : 'opacity-40';
  return (
    <div 
      className={`pointer-events-none fixed inset-0 z-50 bg-grain ${opacityClass} hidden lg:block`} 
    />
  );
}
