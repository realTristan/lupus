import { Component, useState } from "react";
import CrossSVG from "./svgs/Cross";
import * as tf from "@tensorflow/tfjs";
import PlusSVG from "./svgs/Plus";
import { genId } from "~/lib/crypto";
import { LoadingRelative } from "./svgs/Loading";
import { useRouter } from "next/router";
import { type Table, type TableValue } from "~/lib/types";
import { MAX_ROWS } from "~/lib/constants";

interface TableModelProps {
  headers: string[];
  values: number[];
  layers: any[];
  table: Table;
}

interface TableModelState {
  headers: string[];
  values: TableValue[];
  testEpochs: number;
  testInput: number;
  model: tf.Sequential | null;
  prediction: string;
  hidden: boolean;
}

export default class TableModel extends Component {
  state: TableModelState;
  props!: TableModelProps;

  constructor(props: TableModelProps) {
    super(props);

    this.state = {
      headers: props.headers,
      values: [],
      testEpochs: 10,
      testInput: 1,
      model: null,
      prediction: "None",
      hidden: true,
    };

    const columns: number = props.headers.length;
    this.convertLinearTableValuesToObjects(columns, props.values).then(
      (values) => {
        this.setState({
          values,
        });
      },
    );
  }

  /**
   * Convert a linear array of numbers to an array of objects
   * @param {number[]} nums The linear array of numbers
   * @returns {Promise<{id: string, values: number[]}[]>} The array of objects
   * @async
   */
  private readonly convertLinearTableValuesToObjects = async (
    columns: number,
    nums: number[],
  ): Promise<TableValue[]> => {
    const result: TableValue[] = [];

    for (let i = 0; i < nums.length; i += columns) {
      const values: number[] = [nums[i] ?? 0, nums[i + 1] ?? 0];
      const id: string = await genId();

      result.push({
        id,
        values,
      });
    }

    return result;
  };

  /**
   * Render the component
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="flex w-full flex-col rounded-md border-2 border-slate-100 bg-white px-10 py-7">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="w-full text-5xl font-extrabold">
              {this.props.table.name}
            </h1>
            <p className="mt-2 w-full text-xl font-thin">
              {this.props.table.description}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hidden: !this.state.hidden })}
            className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-4 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
          >
            <p>{this.state.hidden ? "Show table" : "Hide table"}</p>
          </button>
        </div>
        <div
          className={
            this.state.hidden
              ? "hidden"
              : "mt-4 flex w-full flex-col gap-2 lg:flex-row"
          }
        >
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <table className="w-full">
              <thead>
                <tr>
                  {this.state.headers.map((header: string) => (
                    <this.TableHeader header={header} key={header} />
                  ))}
                  <this.TableHeader header={"Actions"} />
                </tr>
              </thead>

              <tbody>
                {this.state.values.map((row: any) => (
                  <tr key={row.id}>
                    {row.values.map((value: number[], index: number) => {
                      return (
                        <this.TableCell
                          key={row.id + ":" + index}
                          value={value}
                          row={row}
                          index={index}
                        />
                      );
                    })}

                    <this.RemoveRowButton id={row.id} />
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex w-full flex-row gap-2">
              <this.AddRowButton />
              <button className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
                <span>Import CSV</span>
              </button>
              <button className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
                <span>Export as CSV</span>
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="mb-1 flex flex-row gap-2">
              <this.DataInput />
              <this.TestModelButton />
            </div>

            <div className="flex flex-row gap-2">
              <this.EpochsInput />
              <this.BuildModelButton />
            </div>

            <p className="text-red-500">
              {this.state.testEpochs > 100
                ? "Too many epochs. Maximum: 100"
                : ""}
            </p>

            <this.DownloadModelButton />

            <p className="mt-2 flex h-full w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
              Output: {this.state.prediction}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Build model button component
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly BuildModelButton = (): JSX.Element => {
    const [building, setBuilding] = useState(false);

    const onClick = async () => {
      if (building) {
        return;
      }

      setBuilding(true);

      const newModel = await this.buildModel();
      this.setState({
        model: newModel,
      });

      setBuilding(false);
    };

    return building ? (
      <button
        onClick={async () => await onClick()}
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <LoadingRelative className="h-8 w-8" />
      </button>
    ) : (
      <button
        onClick={async () => await onClick()}
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <span>Build Model</span>
      </button>
    );
  };

  /**
   * Download model button component
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly DownloadModelButton = (): JSX.Element => {
    const router = useRouter();

    const onClick = async () => {
      if (!this.state.model) {
        return;
      }

      const model = await this.state.model.save("downloads://model");
      const modelJSON = JSON.stringify(model);
      const ENCODING_PREFIX = "data:text/plain;charset=utf-8,";

      router
        .push(`${ENCODING_PREFIX}${encodeURIComponent(modelJSON)}`)
        .catch((e) => console.log(e.message));

      return;
    };

    return (
      <button
        disabled={!this.state.model}
        onClick={async () => await onClick()}
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
      >
        <span>Download Model</span>
      </button>
    );
  };

  /**
   * Table data component
   * @param props Table data props
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly TableCell = (props: {
    row: any;
    value: number[];
    index: number;
  }): JSX.Element => {
    const onBlur = (e: any) => {
      const newValues = this.state.values.map((d: any) => {
        if (d.id === props.row.id) {
          d.values[props.index] = parseInt(e.currentTarget.textContent);
        }

        return d;
      });

      this.setState({
        values: newValues,
      });
    };

    return (
      <td
        className="border-2 border-slate-100 p-4"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => onBlur(e)}
      >
        {props.value}
      </td>
    );
  };

  /**
   * Remove row button component
   * @param props Remove row button props
   * @returns JSX.Element
   */
  private readonly RemoveRowButton = (props: { id: string }): JSX.Element => {
    const onClick = () => {
      this.setState({
        values: this.state.values.filter((row: any) => row.id !== props.id),
      });
    };

    return (
      <td
        onClick={() => onClick()}
        className="cursor-pointer border-2 border-slate-100 px-7 py-3 text-base hover:bg-slate-50"
      >
        <CrossSVG className="h-3 w-3 fill-slate-950" />
      </td>
    );
  };

  /**
   * Add row button component
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly AddRowButton = (): JSX.Element => {
    /**
     * On click event
     * @returns Promise<void>
     */
    const addRow = async (): Promise<void> => {
      if (this.state.values.length >= MAX_ROWS) {
        return;
      }

      const id: string = await genId();

      this.setState({
        values: [
          ...this.state.values,
          {
            id,
            values: [0, 0],
          },
        ],
      });
    };

    return this.state.values.length < MAX_ROWS ? (
      <button
        onClick={async () => await addRow()}
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <PlusSVG className="h-5 w-5 fill-slate-950" />
        <span>Add Row</span>
      </button>
    ) : (
      <></>
    );
  };

  /**
   * Data Input component
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly DataInput = (): JSX.Element => {
    const onChange = (e: any) => {
      const value: string = e.currentTarget.value || "1";

      this.setState({
        testInput: parseInt(value),
      });
    };

    return (
      <input
        type="number"
        placeholder="Input"
        defaultValue={1}
        className="w-full rounded-md border-2 border-slate-100 p-4"
        onChange={onChange}
      />
    );
  };

  /**
   * Epochs Input component
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly EpochsInput = (): JSX.Element => {
    const onChange = (e: any) => {
      const value: string = e.currentTarget.value || "10";

      this.setState({
        testEpochs: parseInt(value),
      });
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
  };

  /**
   * Table header component
   * @param props Table header props
   * @returns JSX.Element
   */
  private readonly TableHeader = (props: { header: string }): JSX.Element => {
    const onBlur = (e: any) => {
      const newHeaders = this.state.headers.map((h: string) =>
        h === props.header ? e.currentTarget.textContent : h,
      );

      this.setState({
        headers: newHeaders,
      });
    };

    return (
      <th
        className="border-2 border-slate-100 p-4"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => onBlur(e)}
      >
        {props.header}
      </th>
    );
  };

  /**
   * Generate the prediction button
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly TestModelButton = (): JSX.Element => {
    const [testing, setTesting] = useState(false);

    const onClick = async () => {
      if (this.state.testEpochs > 100) {
        return;
      }

      if (testing) {
        return;
      }

      setTesting(true);

      const pred = await this.testModel();
      this.setState({
        prediction: pred?.toString() ?? "Error",
      });

      setTesting(false);
    };

    return testing ? (
      <button
        onClick={async () => await onClick()}
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <LoadingRelative className="h-8 w-8" />
      </button>
    ) : (
      <button
        onClick={async () => await onClick()}
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-4 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <span>Test Model</span>
      </button>
    );
  };

  /**
   * Build the model
   * @returns Promise<void>
   * @memberof Table
   */
  private readonly buildModel = async (): Promise<tf.Sequential> => {
    const model = tf.sequential();

    for (const layer of this.props.layers) {
      console.log(layer);
      model.add(
        tf.layers.dense({
          units: layer.neurons,
          inputShape: [layer.shape],
        }),
      );
    }

    model.compile({ loss: "meanSquaredError", optimizer: "adam" });

    const xs = tf.tensor2d(
      this.state.values.map((d: any) => d.values[0]),
      [this.state.values.length, 1],
    );

    const ys = tf.tensor2d(
      this.state.values.map((d: any) => d.values[1]),
      [this.state.values.length, 1],
    );

    await model.fit(xs, ys, { epochs: this.state.testEpochs });

    return model;
  };

  /**
   * Test the model
   * @returns Promise<tf.Tensor>
   * @memberof Table
   */
  private readonly testModel = async () => {
    const predict = async (model: tf.Sequential) => {
      const testTensor = tf.tensor2d([this.state.testInput], [1, 1]);
      const pred = model.predict(testTensor);

      return pred;
    };

    if (this.state.model == null) {
      const newModel = await this.buildModel().catch((e) =>
        console.log(e.message),
      );

      if (!newModel) {
        return;
      }

      this.setState({
        model: newModel,
      });

      return await predict(newModel);
    }

    return await predict(this.state.model);
  };
}
