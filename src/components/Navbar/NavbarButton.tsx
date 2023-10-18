import Link from "next/link";
import { cn } from "~/utils/cn";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function NavbarButton(props: Props): JSX.Element {
  return (
    <Link
      onClick={props.onClick}
      href={props.href}
      className={cn(
        "flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-2 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50",
        props.className,
      )}
    >
      {props.children}
    </Link>
  );
}
