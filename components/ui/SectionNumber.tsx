export default function SectionNumber({ number }: { number: string }) {
  return (
    <div className="absolute top-0 right-0 p-8 select-none pointer-events-none opacity-20 transition-opacity duration-300 hover:opacity-40">
      <span className="font-heading text-9xl text-brand-text/50">{number}</span>
    </div>
  );
}
