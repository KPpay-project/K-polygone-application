import { SVGProps, Ref, forwardRef, memo } from 'react';

const EmptyDataGrayedOut = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="150px"
    height="150px"
    viewBox="0 0 151 150"
    fill="none"
    ref={ref}
    {...props}
  >
    <path fill="#E5E7EB" d="M75.5 150c41.421 0 75-33.579 75-75s-33.579-75-75-75S.5 33.579.5 75s33.579 75 75 75Z" />
    <path
      fill="#fff"
      d="M120.5 150h-90V53a16.018 16.018 0 0 0 16-16h58a15.906 15.906 0 0 0 4.691 11.308A15.89 15.89 0 0 0 120.5 53v97Z"
    />
    <path fill="#6D7280" d="M75.5 102c13.255 0 24-10.745 24-24s-10.745-24-24-24-24 10.745-24 24 10.745 24 24 24Z" />
    <path
      fill="#fff"
      d="M83.985 89.314 75.5 80.829l-8.485 8.485-2.829-2.829L72.672 78l-8.486-8.485 2.829-2.829 8.485 8.486 8.485-8.486 2.829 2.829L78.328 78l8.486 8.485-2.829 2.829Z"
    />
    <path
      fill="#F9FAFB"
      d="M88.5 108h-26a3 3 0 1 0 0 6h26a3 3 0 1 0 0-6ZM97.5 120h-44a3 3 0 1 0 0 6h44a3 3 0 1 0 0-6Z"
    />
  </svg>
);
const ForwardRef = forwardRef(EmptyDataGrayedOut);
const EmptyTicketData = memo(ForwardRef);

export default EmptyTicketData;
export { EmptyTicketData };
