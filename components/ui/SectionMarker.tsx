export function SectionMarker({
  label,
  coord,
}: {
  label: string;
  coord?: string;
}) {
  return (
    <p className="marker">
      {label}
      {coord ? <span className="coord">{coord}</span> : null}
    </p>
  );
}
