import { cn } from "~/utils/cn";

/**
 * Circles Background
 * @returns JSX.Element
 */
export default function CirclesBackground(props: {
  className?: string;
}): JSX.Element {
  return (
    <svg
      className={cn(
        "absolute bottom-0 left-0 z-0 h-full w-full",
        props.className,
      )}
      viewBox="0 0 900 600"
      width="900"
      height="600"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <g fill="#004282">
        <circle r="127" cx="848" cy="478"></circle>
        <circle r="98" cx="72" cy="30"></circle>
        <circle r="72" cx="500" cy="292"></circle>
        <circle r="144" cx="19" cy="494"></circle>
        <circle r="72" cx="808" cy="57"></circle>
      </g>
    </svg>
  );
}
