interface Props {
  header: string;
  headers: string[];
  setNewHeaders: (headers: string[]) => void;
}

/**
 * Table header component
 * @param props Table header props
 * @returns JSX.Element
 */
export default function TableHeader(props: Props): JSX.Element {
  const onBlur = (e: React.FocusEvent<HTMLTableHeaderCellElement>): void => {
    const newHeaders = props.headers.map((h: string) =>
      h === props.header ? e.currentTarget.textContent ?? "" : h,
    );

    props.setNewHeaders(newHeaders);
  };

  return (
    <th
      className="border-2 border-slate-100 px-4 py-3 text-sm"
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={(e) => onBlur(e)}
    >
      {props.header}
    </th>
  );
}
