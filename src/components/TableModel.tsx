import { Component } from "react";
import CrossSVG from "./svgs/Cross";
import * as tf from "@tensorflow/tfjs";
import PlusSVG from "./svgs/Plus";
import { base64encode } from "~/lib/crypto";
import { cn } from "~/utils/cn";

export default class TrainDataTable extends Component {
  state: any;
  props: any = {
    headers: [],
    data: [],
    className: "",
  };

  constructor(props: any) {
    super(props);

    this.state = {
      headers: props.headers,
      data: props.data,
      testEpochs: 10,
      testInput: 1,
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
                <tr key={row.id}>
                  {row.input.map((input: any) => {
                    const id: string = base64encode(Math.random().toString());

                    return <this.TableBody key={id} input={input} row={row} />;
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

        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-row gap-4">
            <this.DataInput />
            <this.EpochsInput />
          </div>

          <this.GeneratePredictionButton />
          <p className="text-red-500">
            {this.state.testEpochs > 100 ? "Too many epochs. Maximum: 100" : ""}
          </p>
          <p>
            Output:{" "}
            {this.state.prediction ? this.state.prediction : "Nothing yet."}
          </p>
        </div>
      </div>
    );
  }

  /**
   * Table data component
   * @param props Table data props
   * @returns JSX.Element
   * @memberof Table
   */
  private readonly TableBody = (props: {
    row: any;
    input: string;
  }): JSX.Element => {
    const onBlur = (e: any) => {
      const newInput = props.row.input.map((i: any) =>
        i === props.input ? e.currentTarget.textContent : i,
      );

      const newData = this.state.data.map((d: any) =>
        d.id === props.row.id ? { ...d, input: newInput } : d,
      );

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
    const onClick = () => {
      if (this.state.data.length >= 25) {
        return;
      }

      const id = base64encode(Math.random().toString());

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
        <button
          onClick={() => onClick()}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-5 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
        >
          <PlusSVG className="h-5 w-5 fill-slate-950" />
          <span>Add Row</span>
        </button>
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
  private readonly GeneratePredictionButton = (): JSX.Element => {
    const onClick = async () => {
      if (this.state.testEpochs > 100) {
        return;
      }

      const pred = await this.predictGenderFromHeight();
      this.setState({
        prediction: pred.toString(),
      });
    };

    return (
      <>
        <button
          onClick={async () => await onClick()}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-5 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
        >
          <span>
            Generate Prediction for <strong>{this.state.testInput}</strong> with{" "}
            <strong>{this.state.testEpochs}</strong> epochs
          </span>
        </button>
      </>
    );
  };

  /**
   * Predict the gender from the height
   * @param data The data to train the network on
   * @returns the tensor prediction
   */
  predictGenderFromHeight = async () => {
    const { data } = this.state;

    const model = tf.sequential();

    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    const xs = tf.tensor2d(
      data.map((d: any) => d.input[0]),
      [data.length, 1],
    );

    const ys = tf.tensor2d(
      data.map((d: any) => d.input[1]),
      [data.length, 1],
    );

    await model.fit(xs, ys, { epochs: this.state.testEpochs });

    const testTensor = tf.tensor2d([this.state.testInput], [1, 1]);
    const pred = model.predict(testTensor);

    return pred;
  };
}
