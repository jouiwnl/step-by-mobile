import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface SubtitleProps {
  width?: number;
  height?: number;
}

export function Subtitle({ height, width }: SubtitleProps) {
  return (
    <Svg
      width={width ?? 116}
      height={height ?? 32}
      viewBox="0 0 116 16"
      fill="none"
    >
      <Path
        d="M12 0.5H4C2.067 0.5 0.5 2.067 0.5 4V12C0.5 13.933 2.067 15.5 4 15.5H12C13.933 15.5 15.5 13.933 15.5 12V4C15.5 2.067 13.933 0.5 12 0.5Z"
        fill="#18181B"
        stroke="#27272A"
      />
      <Path
        d="M32 0.5H24C22.067 0.5 20.5 2.067 20.5 4V12C20.5 13.933 22.067 15.5 24 15.5H32C33.933 15.5 35.5 13.933 35.5 12V4C35.5 2.067 33.933 0.5 32 0.5Z"
        fill="#92A0ED"
        stroke="#9AA9FD"
      />
      <Path
        d="M52 0.5H44C42.067 0.5 40.5 2.067 40.5 4V12C40.5 13.933 42.067 15.5 44 15.5H52C53.933 15.5 55.5 13.933 55.5 12V4C55.5 2.067 53.933 0.5 52 0.5Z"
        fill="#6679E5"
        stroke="#7085FA"
      />
      <Path
        d="M72 0.5H64C62.067 0.5 60.5 2.067 60.5 4V12C60.5 13.933 62.067 15.5 64 15.5H72C73.933 15.5 75.5 13.933 75.5 12V4C75.5 2.067 73.933 0.5 72 0.5Z"
        fill="#3B53DE"
        stroke="#415DFF"
      />
      <Path
        d="M92 0.5H84C82.067 0.5 80.5 2.067 80.5 4V12C80.5 13.933 82.067 15.5 84 15.5H92C93.933 15.5 95.5 13.933 95.5 12V4C95.5 2.067 93.933 0.5 92 0.5Z"
        fill="#213AC4"
        stroke="#294AFF"
      />
      <Path
        d="M112 0.5H104C102.067 0.5 100.5 2.067 100.5 4V12C100.5 13.933 102.067 15.5 104 15.5H112C113.933 15.5 115.5 13.933 115.5 12V4C115.5 2.067 113.933 0.5 112 0.5Z"
        fill="#1A2D99"
        stroke="#0026FF"
      />
    </Svg>
  );
}

export default Subtitle;