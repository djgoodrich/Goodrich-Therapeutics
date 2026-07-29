export default function SvgFilters() {
  return (
    <svg className="sr-only" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="duotone-filter">
          <feColorMatrix
            type="matrix"
            values="0.30 0.59 0.11 0 0
                    0.30 0.59 0.11 0 0
                    0.30 0.59 0.11 0 0
                    0    0    0    1 0"
            result="gray"
          />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.027 0.478" />
            <feFuncG type="table" tableValues="0.039 0.620" />
            <feFuncB type="table" tableValues="0.039 0.494" />
          </feComponentTransfer>
        </filter>
        <filter id="displacement-filter">
          <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
