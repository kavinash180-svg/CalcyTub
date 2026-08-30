export default function AdSlot({ label = "Ad Space" }) {
  return (
    <div className="ad-slot my-6" data-testid="ad-slot" aria-hidden="true">
      {label}
    </div>
  );
}
