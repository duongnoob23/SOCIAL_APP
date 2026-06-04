import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ArrowLeftIcon = (props:any) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M20 12H4M4 12L10 6M4 12L10 18"
      stroke="#2B2B2B"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default ArrowLeftIcon;
