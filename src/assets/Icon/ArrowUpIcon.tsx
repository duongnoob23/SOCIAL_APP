import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ArrowUpIcon = (props:any) => (
  <Svg
    width={16}
    height={12}
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12.3333 8L7.66667 4L3 8"
      stroke="#2B2B2B"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default ArrowUpIcon;
