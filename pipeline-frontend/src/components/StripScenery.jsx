// Very thin horizon-line illustration used on working pages (kanban, settings)
export default function StripScenery() {
  return (
    <svg
      viewBox="0 0 680 36"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="680" height="36" fill="#E6F1FB" />
      <path d="M-10 28 L150 16 L320 28 Z" fill="#B5D4F4" />
      <path d="M260 28 L460 12 L640 28 Z" fill="#85B7EB" />
      <path d="M0 30 L680 30 L680 36 L0 36 Z" fill="#0C447C" />
    </svg>
  )
}
