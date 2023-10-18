import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import RemoveRowButton from "./RemoveRowButton";
import AddRowButton from "./AddRowButton";
import ImportCSVDialog from "./ImportCSVDialog";
import ExportCSVButton from "./ExportCSVButton";
import TestDataInput from "./TestDataInput";
import TestModelButton from "./TestModelButton";
import EpochsInput from "./EpochsInput";
import BuildModelButton from "./BuildModelButton";
import DownloadModelButton from "./DownloadModelButton";
import ModelsList from "./ModelsList";
import { linearTableToObjs } from "../../lib/projects/project/tables/linearTableToObjs";
import { ObjectState } from "~/lib/state";
import { useState } from "react";
import {
  type Table,
  type Network,
  type TableValue,
  type Model,
} from "~/lib/types";
import TableSVG from "../SvgComponents/Table";
import SlateBorderButton from "../SlateBorderButton";

/**
 * Test Model Button props
 * @interface Props
 * @property {Table} table The table
 * @property {string[]} headers The headers
 * @property {number[]} values The values
 * @property {Network} activeNetwork The active network
 */
interface Props {
  headers: string[];
  values: number[];
  table: Table;
  activeNetwork: Network;
}

/**
 * Generate the prediction button
 * @param {Props} props Props
 * @param {Table} props.table The table
 * @param {string[]} props.headers The headers
 * @param {number[]} props.values The values
 * @param {Network} props.activeNetwork The active network
 * @returns JSX.Element
 */
export default function TableModel(props: Props): JSX.Element {
  // All states
  const [hidden, setHidden] = useState<boolean>(true);
  const [headers, setHeaders] = useState<string[]>(props.headers);
  const [epochs, setEpochs] = useState<number>(10);
  const [prediction, setPrediction] = useState<string>("None");
  const [models, setModels] = useState<Model[]>([]);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const [testData, setTestData] = useState<number>(1);
  const values = new ObjectState<TableValue[]>([]);

  // Convert the linear array of numbers to an array of objects
  if (!values.updated) {
    linearTableToObjs(headers.length, props.values).then((res) => {
      values.set(res);
    });
  }

  // Return the component
  return (
    <div
      id={props.table.id}
      className="flex w-full flex-col rounded-md border-2 border-slate-100 bg-white px-7 py-5"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-px">
          <div className="flex flex-row gap-2">
            <TableSVG className="mt-px h-7 w-7 fill-slate-950" />
            <h1 className="w-full text-xl font-extrabold">
              {props.table.name}
            </h1>
          </div>
          <p className="mt-0.5 w-full text-sm font-thin">
            {props.table.description}
          </p>
        </div>
        <SlateBorderButton onClick={() => setHidden(!hidden)}>
          {hidden ? "Show table" : "Hide table"}
        </SlateBorderButton>
      </div>
      <div className={hidden ? "hidden" : "flex flex-col"}>
        <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
          <div className="flex w-full flex-col items-center gap-2 text-left">
            <table className="w-full">
              <thead>
                <tr>
                  {headers.map((header: string) => (
                    <TableHeader
                      header={header}
                      key={header}
                      headers={headers}
                      setNewHeaders={setHeaders}
                    />
                  ))}
                  <TableHeader
                    header={"Actions"}
                    headers={headers}
                    setNewHeaders={setHeaders}
                  />
                </tr>
              </thead>

              <tbody>
                {values.value.map((row: any) => (
                  <tr key={row.id}>
                    {row.values.map((value: number[], index: number) => {
                      return (
                        <TableCell
                          key={row.id + ":" + index}
                          value={value}
                          row={row}
                          index={index}
                          values={values.value}
                          setValues={values.set}
                        />
                      );
                    })}

                    <RemoveRowButton
                      id={row.id}
                      values={values.value}
                      setValues={values.set}
                    />
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex w-full flex-row gap-2">
              <ImportCSVDialog setValues={values.set} />
              <ExportCSVButton />
              <AddRowButton values={values.value} setValues={values.set} />
            </div>
            {/*<ImportTestDataButton />*/}
          </div>

          <div className="flex w-full flex-col gap-1">
            <div className="mb-1 flex flex-row gap-1">
              <TestDataInput setTestData={setTestData} />
              <TestModelButton
                input={testData}
                model={currentModel?.model ?? null}
                activeNetwork={props.activeNetwork}
                epochs={epochs}
                models={models}
                values={values.value}
                setCurrentModel={setCurrentModel}
                setModels={setModels}
                setPrediction={setPrediction}
              />
            </div>

            <div className="flex flex-row gap-1">
              <EpochsInput setEpochs={setEpochs} />
              <BuildModelButton
                models={models}
                setModels={setModels}
                activeNetwork={props.activeNetwork}
                epochs={epochs}
                values={values.value}
                setCurrentModel={setCurrentModel}
              />
            </div>
            <p className="text-red-500">
              {epochs > 100 ? "Too many epochs. Maximum: 100" : ""}
            </p>

            <DownloadModelButton model={currentModel?.model ?? null} />

            <SlateBorderButton className="py-3">
              Output: {prediction}
            </SlateBorderButton>
          </div>
        </div>

        <ModelsList
          activeNetwork={props.activeNetwork}
          models={models}
          setModels={setModels}
          setCurrentModel={setCurrentModel}
          currentModel={currentModel}
        />
      </div>
    </div>
  );
}
