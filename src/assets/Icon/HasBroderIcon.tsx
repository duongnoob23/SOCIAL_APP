import * as React from "react";
import Svg, { Rect, Mask } from "react-native-svg";
const HasBorderIcon = (props:any) => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      x={2}
      y={4.5498}
      width={24}
      height={18.9}
      rx={0.75}
      stroke="#2B2B2B"
      strokeWidth={1.5}
    />
    <Mask id="path-2-inside-1_4319_7176" fill="white">
      <Rect x={5.0752} y={7.625} width={17.85} height={12.75} rx={1.36607} />
    </Mask>
    <Rect
      x={5.0752}
      y={7.625}
      width={17.85}
      height={12.75}
      rx={1.36607}
      stroke="#2B2B2B"
      strokeWidth={3}
      mask="url(#path-2-inside-1_4319_7176)"
    />
  </Svg>
);
export default HasBorderIcon;
