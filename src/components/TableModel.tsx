import { Component, useState } from "react";
import CrossSVG from "./svgs/Cross";
import * as tf from "@tensorflow/tfjs";
import PlusSVG from "./svgs/Plus";
import { base64encode } from "~/lib/crypto";
import { cn } from "~/utils/cn";
import { LoadingRelative } from "./svgs/Loading";
import { useRouter } from "next/router";

export default class TableModel extends Component {
  state: {
    headers: string[];
    data: any[];
    testEpochs: number;
    testInput: number;
    model: tf.Sequential | null;
    prediction: string;
  };
  props: any = {
    headers: [],
    data: [],
    className: "",
    layers: [],
  };

  constructor(props: any) {
    super(props);

    this.state = {
      headers: props.headers,
      data: props.data,
      testEpochs: 10,
      testInput: 1,
      model: null,
      prediction: "",
    };
  }

  /**
   * Render the component
   * @returns JSX.Element
   */
  render() {
    return (
      <div
        className={cn(
          "flex w-full flex-col gap-4 lg:flex-row lg:gap-10",
          this.props.className,
        )}
      >
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <table className="w-full">
            <thead>
              <tr>
                {this.state.headers.map((header: string) => (
                  <this.TableHeader header={header} key={header} />
                ))}
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((row: any) => (
                <tr key={row.id} id={`row-${row.id}`}>
                  {row.input.map((input: number[], index: number) => {
                    const id: string = base64encode(
                      Math.random() + ":" + Date.now() + "",
                    );

                    return (
                      <this.TableBody
                        key={id}
                        input={input}
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

          <this.AddRowButton />
          <p className="text-red-500">
            {this.state.data.length >= 25 ? "Maximum rows reached (25)" : ""}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="mb-1 flex flex-row gap-4">
            <this.DataInput />
            <this.EpochsInput />
          </div>

          <this.TestModelButton />
          <p className="text-red-500">
            {this.state.testEpochs > 100 ? "Too many epochs. Maximum: 100" : ""}
          </p>
          <div className="flex flex-row gap-4">
            <this.DownloadModelButton />
            <this.BuildModelButton />
          </div>

          <p className="mt-2 flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
            Output:{" "}
            {this.state.prediction ? this.state.prediction : "Nothing yet."}
          </p>
        </div>
      </div>
    );
  }

  /**
   * Network selection dropdown component
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly NetworkSelectionDropdown = (): JSX.Element => {
    return (
      <p className="mt-2 flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
        Using: <strong>Network 1</strong>
      </p>
    );
  };

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
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <LoadingRelative className="h-8 w-8" />
      </button>
    ) : (
      <button
        onClick={async () => await onClick()}
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <span>Build</span>
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
        <span>Download</span>
      </button>
    );
  };

  /**
   * Table body component
   * @param props Table data props
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly TableBody = (props: {
    row: any;
    input: number[];
    index: number;
  }): JSX.Element => {
    const onBlur = (e: any) => {
      const newData = this.state.data.map((d: any) => {
        if (d.id === props.row.id) {
          d.input[props.index] = parseInt(e.currentTarget.textContent);
        }

        return d;
      });

      this.setState({
        data: newData,
      });
    };

    return (
      <td
        className="border-2 border-slate-100 p-4"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => onBlur(e)}
      >
        {props.input}
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
        data: this.state.data.filter((row: any) => row.id !== props.id),
      });
    };

    return (
      <td
        onClick={() => onClick()}
        className="cursor-pointer border-2 border-slate-100 px-7 py-3 hover:bg-slate-50"
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
    const id = base64encode(Math.random() + ":" + Date.now() + "");

    const onClick = () => {
      if (this.state.data.length >= 25) {
        return;
      }

      this.setState({
        data: [
          ...this.state.data,
          {
            id,
            input: [0, 0],
          },
        ],
      });
    };

    return (
      <>
        <a
          onClick={() => onClick()}
          href={`#row-${id}`}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
        >
          <PlusSVG className="h-5 w-5 fill-slate-950" />
          <span>Add Row</span>
        </a>
      </>
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
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <LoadingRelative className="h-8 w-8" />
      </button>
    ) : (
      <button
        onClick={async () => await onClick()}
        className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-4 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <span>
          Test Model: <strong>{this.state.testInput}</strong> with{" "}
          <strong>{this.state.testEpochs}</strong> epochs
        </span>
      </button>
    );
  };

  /**
   * Build the model
   * @returns Promise<void>
   * @memberof Table
   */
  private readonly buildModel = async (): Promise<tf.Sequential> => {
    const { data } = this.state;

    const model = tf.sequential();

    for (const layer of this.props.layers) {
      model.add(
        tf.layers.dense({
          units: layer.neurons,
          inputShape: [layer.inputShape],
        }),
      );
    }

    model.compile({ loss: "meanSquaredError", optimizer: "adam" });

    const xs = tf.tensor2d(
      data.map((d: any) => d.input[0]),
      [data.length, 1],
    );

    const ys = tf.tensor2d(
      data.map((d: any) => d.input[1]),
      [data.length, 1],
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
