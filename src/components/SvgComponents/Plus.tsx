import { cn } from "~/utils/cn";

export default function PlusSVG(props: { className?: string }): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="25"
      viewBox="0 0 24 24"
      width="25"
      className={cn("fill-white", props.className)}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M11 18h2v-5h5v-2h-5V6h-2v5H6v2h5z" />
    </svg>
  );
}
