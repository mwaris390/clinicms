"use client";

export default function EyeScope({
  data,
  tableName,
}: {
  tableName: string;
  data?: any;
}) {
  function returnValidValue(val: number) {
    return val == 0 ? "--" : val;
  }
  return (
    <>
      <div className="flex flex-col items-center my-8">
        <label className="basis-[30%] font-bold my-4">{`${tableName} Eye Data`}</label>
        <div className="basis-[70%]">
          <div className="basis-[70%]">
            <div className="flex gap-x-4">
              {/* OD Table */}
              <table className="flex-1">
                <thead>
                  <tr>
                    <td
                      className="border-2 border-tertiary font-bold text-center"
                      colSpan={5}
                    >
                      OD
                    </td>
                  </tr>
                  <tr>
                    <td className="border-2 border-tertiary"></td>
                    <td className="border-2 border-tertiary text-center">
                      SPH
                    </td>
                    <td className="border-2 border-tertiary text-center">
                      CYL
                    </td>
                    <td className="border-2 border-tertiary text-center">
                      AXIS
                    </td>
                    <td className="border-2 border-tertiary text-center">VA</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-2 border-tertiary text-center w-20 px-2">
                      DIST.
                    </td>
                    <td className="border-2 border-tertiary w-20 px-2 text-center">
                      {returnValidValue(data.sphrd)}
                    </td>
                    <td className="border-2 border-tertiary w-20 px-2 text-center">
                      {returnValidValue(data.cylrd)}
                    </td>
                    <td className="border-2 border-tertiary w-20 px-2 text-center">
                      {returnValidValue(data.axisrd)}
                    </td>
                    <td className="border-2 border-tertiary w-20 px-2 text-center">
                      {returnValidValue(data.vard)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border-2 border-tertiary text-center w-20 px-2">
                      ADD.
                    </td>
                    <td
                      className="border-2 border-tertiary w-20 px-2 text-center"
                      colSpan={4}
                    >
                      {returnValidValue(data.add_note)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* OS Table */}
              <table className="flex-1">
                <thead>
                  <tr>
                    <td
                      className="border-2 border-tertiary font-bold text-center"
                      colSpan={5}
                    >
                      OS
                    </td>
                  </tr>
                  <tr>
                    <td className="border-2 border-tertiary"></td>
                    <td className="border-2 border-tertiary text-center">
                      SPH
                    </td>
                    <td className="border-2 border-tertiary text-center">
                      CYL
                    </td>
                    <td className="border-2 border-tertiary text-center">
                      AXIS
                    </td>
                    <td className="border-2 border-tertiary text-center">VA</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-2 border-tertiary text-center w-20 px-2">
                      DIST.
                    </td>
                    <td className="border-2 border-tertiary w-20 px-2 text-center">
                      {returnValidValue(data.sphld)}
                    </td>
                    <td className="border-2 border-tertiary w-20 px-2 text-center">
                      {returnValidValue(data.cylld)}
                    </td>
                    <td className="border-2 border-tertiary w-20 px-2 text-center">
                      {returnValidValue(data.axisld)}
                    </td>
                    <td className="border-2 border-tertiary w-20 px-2 text-center">
                      {returnValidValue(data.vald)}
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border-2 border-tertiary text-center w-20 px-2">
                      ADD.
                    </td>
                    <td
                      className="border-2 border-tertiary w-20 px-2 text-center"
                      colSpan={4}
                    >
                      {returnValidValue(data.add_noteL)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* <table className="">
            <thead>
              <tr>
                <th className="border-2 border-tertiary"></th>
                <th className="border-2 border-tertiary text-sm text-center">
                  SPH (L/R)
                </th>
                <th className="border-2 border-tertiary text-sm text-center">
                  CYL (L/R)
                </th>
                <th className="border-2 border-tertiary text-sm text-center">
                  AXIS (L/R)
                </th>
                <th className="border-2 border-tertiary text-sm text-center">
                  VA (L/R)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-2 border-tertiary font-bold text-[12px] w-[6rem] text-center">
                  DIST.
                </td>
                <td className="border-2 border-tertiary w-[12rem] text-center">
                  <div className="flex gap-x-6 justify-center">
                    <div>{returnValidValue(data.sphld)}</div>
                    <div>/</div>
                    <div>{returnValidValue(data.sphrd)}</div>
                  </div>
                </td>
                <td className="border-2 border-tertiary w-[12rem] text-center">
                  <div className="flex gap-x-6 justify-center">
                    <div>{returnValidValue(data.cylld)}</div>
                    <div>/</div>
                    <div>{returnValidValue(data.cylrd)}</div>
                  </div>
                </td>
                <td className="border-2 border-tertiary w-[12rem] text-center">
                  <div className="flex gap-x-6 justify-center">
                    <div>{returnValidValue(data.axisld)}</div>
                    <div>/</div>
                    <div>{returnValidValue(data.axisrd)}</div>
                  </div>
                </td>
                <td className="border-2 border-tertiary w-[12rem] text-center">
                  <div className="flex gap-x-6 justify-center">
                    <div>{returnValidValue(data.vald)}</div>
                    <div>/</div>
                    <div>{returnValidValue(data.vard)}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border-2 border-tertiary font-bold text-[12px] w-[6rem] text-center">
                  NEAR.
                </td>
                <td className="border-2 border-tertiary w-[12rem] text-center">
                  <div className="flex gap-x-6 justify-center">
                    <div>{returnValidValue(data.sphln)}</div>
                    <div>/</div>
                    <div>{returnValidValue(data.sphrn)}</div>
                  </div>
                </td>
                <td className="border-2 border-tertiary w-[12rem] text-center">
                  <div className="flex gap-x-6 justify-center">
                    <div>{returnValidValue(data.cylln)}</div>
                    <div>/</div>
                    <div>{returnValidValue(data.cylrn)}</div>
                  </div>
                </td>
                <td className="border-2 border-tertiary w-[12rem] text-center">
                  <div className="flex gap-x-6 justify-center">
                    <div>{returnValidValue(data.axisln)}</div>
                    <div>/</div>
                    <div>{returnValidValue(data.axisrn)}</div>
                  </div>
                </td>
                <td className="border-2 border-tertiary w-[12rem] text-center">
                  <div className="flex gap-x-6 justify-center">
                    <div>{returnValidValue(data.valn)}</div>
                    <div>/</div>
                    <div>{returnValidValue(data.varn)}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border-2 border-tertiary font-bold text-[12px] w-[6rem] text-center">
                  ADD.
                </td>
                <td
                  className="border-2 border-tertiary w-[12rem] text-center"
                  colSpan={4}
                >
                  {returnValidValue(data.add_note)}
                </td>
              </tr>
            </tbody>
          </table> */}
        </div>
      </div>
    </>
  );
}
