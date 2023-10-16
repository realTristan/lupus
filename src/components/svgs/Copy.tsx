import { cn } from "~/utils/cn";

export default function CopySVG(props: { className?: string }): JSX.Element {
  return (
    <svg
      className={cn(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 806 988.75"
      x="0px"
      y="0px"
      fill-rule="evenodd"
      clip-rule="evenodd"
      width={25}
      height={25}
    >
      <defs>
        <style type="text/css"></style>
      </defs>
      <g>
        <path d="M155 527c39,0 39,58 0,58l-75 0c-44,0 -80,-35 -80,-80l0 -425c0,-44 36,-80 80,-80l425 0c45,0 80,36 80,80l0 60c0,38 -58,38 -58,0l0 -60c0,-12 -10,-21 -22,-21l-425 0c-12,0 -21,9 -21,21l0 425c0,12 9,22 21,22l75 0zm146 -321l426 0c44,0 79,36 79,80l0 425c0,44 -35,80 -79,80l-426 0c-44,0 -80,-36 -80,-80l0 -425c0,-44 36,-80 80,-80zm426 58l-426 0c-12,0 -21,10 -21,22l0 425c0,12 9,22 21,22l426 0c11,0 21,-10 21,-22l0 -425c0,-12 -10,-22 -21,-22z" />
      </g>
    </svg>
  );
}
