interface Parameters {
  setEpochs: (epochs: number) => void;
}

/**
 * Epochs Input component
 * @returns JSX.Element
 */
export default function EpochsInput(params: Parameters): JSX.Element {
  const onChange = (e: any) => {
    const value: string = e.currentTarget.value || "10";
    const valueInt: number = parseInt(value, 10);
    params.setEpochs(valueInt);
  };

  return (
    <input
      type="number"
      placeholder="Epochs"
      defaultValue={10}
      min="1"
      max="100"
      className="w-full rounded-md border-2 border-slate-100 p-4"
      onChange={onChange}
    />
  );
}
