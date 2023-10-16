import { Component } from "react";
import CrossSVG from "./svgs/Cross";
import { base64encode } from "~/lib/crypto";
import * as tf from "@tensorflow/tfjs";
import PlusSVG from "./svgs/Plus";

export default class TrainDataTable extends Component {
  state: any;
  props: {
    headers: string[];
    data: any[];
  } = {
    headers: [],
    data: [],
  };

  constructor(props: any) {
    super(props);

    this.state = {
      headers: props.headers,
      data: props.data,
      testEpochs: 1,
      testData: 0,
      prediction: "",
    };
  }

  /**
   * Function to remove a row
   * @param {string} id
   * @returns void
   * @memberof Table
   */
  private readonly handleRemoveRow = (id: string) => {
    this.setState({
      data: this.state.data.filter((row: any) => row.id !== id),
    });
  };

  /**
   * Function to add a new row
   * @returns void
   * @memberof Table
   */
  private readonly handleAddRow = () => {
    const id = base64encode(Math.random().toString());

    const row = {
      id,
      gender: 0,
      height: 0,
    };

    this.setState({
      data: [...this.state.data, row],
    });
  };

  /**
   * Function to get the state
   * @returns state
   * @memberof Table
   */
  public readonly getState = () => {
    // create a copy of the state
    const state = { ...this.state };
    return state;
  };

  /**
   * Render the component
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="m-10 flex w-full flex-col items-start justify-center gap-4 p-10">
        <table className="w-full">
          <thead>
            <tr>
              {this.state.headers.map((header: string) => (
                <th
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    this.setState({
                      headers: this.state.headers.map((h: string) => {
                        if (h === header) {
                          return e.currentTarget.textContent;
                        }
                        return h;
                      }),
                    });
                  }}
                  key={header}
                  className="border-2 border-slate-100 p-4"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {this.state.data.map((row: any) => (
              <tr key={row.id}>
                {Object.keys(row).map((key: string) => {
                  const _row: any = row as any;
                  const value = _row[key];
                  return (
                    <td
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        _row[key] = e.currentTarget.textContent;
                        this.setState({
                          data: this.state.data.map((r: any) => {
                            if (r.id === row.id) {
                              return _row;
                            }
                            return r;
                          }),
                        });
                      }}
                      key={key}
                      className="border-2 border-slate-100 p-4"
                    >
                      {value}
                    </td>
                  );
                })}

                <td
                  onClick={() => this.handleRemoveRow(row.id)}
                  className="group cursor-pointer border-2 border-slate-100 px-7 py-3 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                >
                  <CrossSVG className="h-3 w-3 fill-slate-950 group-hover:fill-white" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() => this.handleAddRow()}
          className="group flex w-full flex-row items-center justify-center gap-4 rounded-md border-2 border-slate-100 px-10 py-3 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
        >
          <PlusSVG className="h-5 w-5 fill-slate-950 group-hover:fill-white" />
          <span>Add Row</span>
        </button>

        {/* Add a new row button */}
        <div className="flex w-full flex-row gap-4">
          <input
            type="number"
            placeholder="Height"
            className="w-1/3 rounded-md border-2 border-slate-100 p-4"
            onChange={(e) => {
              const value = e.currentTarget.value ?? "0";
              const intValue = parseInt(value);

              this.setState({
                testData: intValue,
              });
            }}
          />
          <input
            type="number"
            placeholder="Epochs"
            min="1"
            max="100"
            className="w-1/3 rounded-md border-2 border-slate-100 p-4"
            onChange={(e) => {
              const value = e.currentTarget.value ?? "1";
              const intValue = parseInt(value);

              this.setState({
                testEpochs: intValue,
              });
            }}
          />

          <button
            onClick={async () => {
              const pred = await this.predictGenderFromHeight();
              this.setState({
                prediction: pred.toString(),
              });
            }}
            className="group flex w-full flex-row items-center justify-center gap-4 rounded-md border-2 border-slate-100 px-10 py-3 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
          >
            <span>
              Generate Prediction for <strong>{this.state.testData}</strong>{" "}
              with <strong>{this.state.testEpochs}</strong> epochs
            </span>
          </button>

          {/* Input for specific training data */}
        </div>
        <p>{this.state.prediction}</p>
      </div>
    );
  }

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
      data.map((d: any) => d.gender),
      [data.length, 1],
    );

    const ys = tf.tensor2d(
      data.map((d: any) => d.height),
      [data.length, 1],
    );

    await model.fit(xs, ys, { epochs: this.state.testEpochs });

    const testTensor = tf.tensor2d([this.state.testData], [1, 1]);
    return model.predict(testTensor);
  };
}
