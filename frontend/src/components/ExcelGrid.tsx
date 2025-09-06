import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

// Register all Handsontable modules
registerAllModules();

// ForwardRef so Interview.tsx can access hotInstance
const ExcelGrid = forwardRef((props, ref) => {
  const hotTableComponent = useRef<HotTable>(null);

  // Expose hotInstance to parent
  useImperativeHandle(ref, () => ({
    hotInstance: hotTableComponent.current?.hotInstance,
  }));

  // Empty grid for candidate to work on
  const data = [
    ["Sales", "Costs", "Profit"], // header
    ["", "", ""], // row 2 (candidate should enter formula in C2)
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const colHeaders = ["A", "B", "C"];
  const rowHeaders = true;

  return (
    <div className="excel-grid-container">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <HotTable
          ref={hotTableComponent}
          data={data}
          colHeaders={colHeaders}
          rowHeaders={rowHeaders}
          width="100%"
          height="400"
          licenseKey="non-commercial-and-evaluation"
          stretchH="all"
          contextMenu={true}
          manualColumnResize={true}
          manualRowResize={true}
          formulas={true}
          columnSorting={true}
          dropdownMenu={true}
          filters={true}
          allowInsertRow={true}
          allowInsertColumn={true}
          allowRemoveRow={true}
          allowRemoveColumn={true}
          className="excel-grid"
          cells={(row, col) => {
            const cellProperties: any = {};

            // Header row styling
            if (row === 0) {
              cellProperties.className =
                "bg-green-50 font-semibold text-green-800";
            }

            // Profit column styling
            if (col === 2 && row > 0) {
              cellProperties.className =
                "bg-blue-50 text-blue-800 font-mono text-sm";
            }

            return cellProperties;
          }}
        />
      </div>

      {/* Tips Section */}
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h3 className="text-sm font-semibold text-green-800 mb-2">
          Excel Tips:
        </h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Enter values in Sales (A) and Costs (B), write formula in Profit (C)</li>
          <li>• Use Excel functions like SUM, MAX, MIN, AVERAGE</li>
          <li>• Example: in C2 type =A2-B2 to calculate Profit</li>
          <li>• Right-click for context menu options</li>
          <li>• Double-click column edges to auto-resize</li>
        </ul>
      </div>
    </div>
  );
});

ExcelGrid.displayName = "ExcelGrid";
export default ExcelGrid;
