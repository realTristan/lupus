interface Parameters {
  setTestData: (testData: number) => void;
}
/**
 * Test Data Input component
 * @returns JSX.Element
 */
export default function TestDataInput(params: Parameters): JSX.Element {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.currentTarget.value;
    const valueInt: number = parseInt(value ?? "1", 10);
    params.setTestData(valueInt);
  };

  return (
    <input
      type="number"
      placeholder="Input"
      defaultValue={1}
      className="w-full rounded-md border-2 border-slate-100 px-3 py-2 text-sm"
      onChange={onChange}
    />
  );
}
