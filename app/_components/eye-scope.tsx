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
        <label className="basis-[30%] font-bold">{`${tableName} Eye`}</label>
        <div className="basis-[70%]">
          <table className="">
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
          </table>
        </div>
      </div>
    </>
  );
}
