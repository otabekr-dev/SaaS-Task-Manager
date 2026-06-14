// Wide, short skyline illustration used as a banner on the dashboard
export default function BannerScenery() {
  return (
    <svg
      viewBox="0 0 680 110"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="680" height="110" fill="#E6F1FB" />
      <circle cx="610" cy="28" r="14" fill="#FAC775" />
      <path d="M-10 75 L120 30 L260 75 Z" fill="#B5D4F4" />
      <path d="M180 75 L360 20 L520 75 Z" fill="#85B7EB" />
      <path d="M420 75 L560 38 L690 75 Z" fill="#B5D4F4" />
      <g fill="#185FA5">
        <rect x="20" y="85" width="22" height="25" />
        <rect x="48" y="78" width="16" height="32" />
        <rect x="70" y="88" width="24" height="22" />
        <rect x="450" y="82" width="18" height="28" />
        <rect x="474" y="90" width="26" height="20" />
        <rect x="506" y="76" width="16" height="34" />
        <rect x="528" y="86" width="22" height="24" />
      </g>
      <path d="M0 102 L680 102 L680 110 L0 110 Z" fill="#0C447C" />
    </svg>
  )
}
