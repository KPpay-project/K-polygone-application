import * as React from 'react';
import { SVGProps } from 'react';
const FilledTicketsFallbackSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={150} height={150} fill="none" {...props}>
    <path fill="url(#a)" d="M75 150c41.421 0 75-33.579 75-75S116.421 0 75 0 0 33.579 0 75s33.579 75 75 75Z" />
    <path
      fill="#fff"
      d="M120 150H30V53a16.018 16.018 0 0 0 16-16h58a15.906 15.906 0 0 0 4.691 11.308A15.89 15.89 0 0 0 120 53v97Z"
    />
    <path fill="#2352E4" d="M75 102c13.255 0 24-10.745 24-24S88.255 54 75 54 51 64.745 51 78s10.745 24 24 24Z" />
    <path
      fill="#fff"
      d="M83.485 89.314 75 80.829l-8.485 8.485-2.829-2.829L72.172 78l-8.486-8.485 2.829-2.829L75 75.172l8.485-8.486 2.829 2.829L77.828 78l8.486 8.485-2.829 2.829Z"
    />
    <path fill="#EBF4FF" d="M88 108H62a3 3 0 1 0 0 6h26a3 3 0 1 0 0-6ZM97 120H53a3 3 0 1 0 0 6h44a3 3 0 1 0 0-6Z" />
    <defs>
      <linearGradient id="a" x1={75} x2={75} y1={0} y2={150} gradientUnits="userSpaceOnUse">
        <stop stopColor="#E3ECFA" />
        <stop offset={1} stopColor="#DAE7FF" />
      </linearGradient>
    </defs>
  </svg>
);
export default FilledTicketsFallbackSvg;
