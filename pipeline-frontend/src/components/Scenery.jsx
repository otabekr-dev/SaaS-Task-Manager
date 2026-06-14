// Decorative mountain/skyline illustration used on auth pages
export default function Scenery() {
  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="300" height="400" fill="#E6F1FB" />
      <circle cx="220" cy="65" r="26" fill="#FAC775" />
      <path d="M-10 200 L60 110 L120 200 Z" fill="#B5D4F4" />
      <path d="M70 200 L160 90 L240 200 Z" fill="#85B7EB" />
      <path d="M170 200 L250 130 L310 200 Z" fill="#B5D4F4" />
      <g fill="#185FA5">
        <rect x="10" y="240" width="28" height="120" />
        <rect x="46" y="210" width="22" height="150" />
        <rect x="76" y="260" width="30" height="100" />
        <rect x="114" y="225" width="24" height="135" />
        <rect x="146" y="245" width="34" height="115" />
        <rect x="188" y="200" width="22" height="160" />
        <rect x="218" y="255" width="28" height="105" />
        <rect x="254" y="230" width="24" height="130" />
        <rect x="40" y="220" width="6" height="10" />
        <rect x="54" y="230" width="6" height="10" />
        <rect x="120" y="240" width="6" height="10" />
        <rect x="194" y="220" width="6" height="10" />
      </g>
      <path d="M0 360 L300 360 L300 400 L0 400 Z" fill="#0C447C" />
    </svg>
  )
}
