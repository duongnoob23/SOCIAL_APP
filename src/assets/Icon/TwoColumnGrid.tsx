import * as React from "react";
import Svg, { Path } from "react-native-svg";
const TwoColumnGrid = (props:any) => (
  <Svg
    width={16}
    height={22}
    viewBox="0 0 16 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M2.17871 0.75H4.35645C5.27158 0.75 5.78493 1.35077 5.78516 1.83301V20.167C5.78492 20.6492 5.27158 21.25 4.35645 21.25H2.17871C1.26358 21.25 0.750231 20.6492 0.75 20.167V1.83301C0.750231 1.35077 1.26358 0.75 2.17871 0.75ZM10.7627 0.75H12.9414C13.8563 0.750172 14.3689 1.35083 14.3691 1.83301V20.167C14.3689 20.6492 13.8563 21.2498 12.9414 21.25H10.7627C9.84756 21.25 9.33422 20.6492 9.33398 20.167V1.83301C9.33421 1.35077 9.84756 0.75 10.7627 0.75Z"
      stroke="#2B2B2B"
      strokeWidth={1.5}
    />
  </Svg>
);
export default TwoColumnGrid;
