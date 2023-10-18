import { cn } from "~/utils/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function SlateBorderButton(props: Props): JSX.Element {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={cn(
        "flex flex-row items-center justify-center gap-1 rounded-md border-2 border-slate-100 bg-white px-7 py-2 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
