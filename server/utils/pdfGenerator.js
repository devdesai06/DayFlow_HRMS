import PDFDocument from "pdfkit";

export async function generatePayslipPdfBuffer({
  appName,
  employee,
  payroll,
}) {
  const doc = new PDFDocument({ size: "A4", margin: 48 });
  const chunks = [];
  doc.on("data", (c) => chunks.push(c));

  const done = new Promise((resolve, reject) => {
    doc.on("end", resolve);
    doc.on("error", reject);
  });

  const navy = "#0F172A";
  const indigo = "#6366F1";
  const slate = "#475569";

  doc.fillColor(navy).fontSize(20).font("Helvetica-Bold").text(appName || "Dayflow");
  doc.moveDown(0.2);
  doc.fillColor(slate).fontSize(10).font("Helvetica").text("Payslip", { continued: true });
  doc.fillColor(indigo).font("Helvetica-Bold").text(`  ${payroll.periodYear}-${String(payroll.periodMonth).padStart(2, "0")}`);

  doc.moveDown(1);
  doc.fillColor(navy).fontSize(12).font("Helvetica-Bold").text("Employee");
  doc.moveDown(0.3);
  doc.fillColor(slate).fontSize(10).font("Helvetica");
  doc.text(`Name: ${employee.firstName} ${employee.lastName}`);
  doc.text(`Email: ${employee.email}`);
  doc.text(`Code: ${employee.employeeCode}`);

  doc.moveDown(1);
  doc.fillColor(navy).fontSize(12).font("Helvetica-Bold").text("Salary breakdown");
  doc.moveDown(0.3);

  const rows = [
    ["Base", payroll.structure.base],
    ["HRA", payroll.structure.hra],
    ["Allowances", payroll.structure.allowances],
    ["Deductions", payroll.structure.deductions],
    ["Gross", payroll.gross],
    ["Net pay", payroll.net],
  ];

  const leftX = doc.x;
  const col1 = leftX;
  const col2 = leftX + 320;
  const rowH = 18;
  let y = doc.y;

  for (const [label, amt] of rows) {
    doc.fillColor("#E2E8F0").rect(leftX, y - 2, 500, rowH).fillOpacity(label === "Net pay" ? 0.25 : 0.12).fill();
    doc.fillOpacity(1);
    doc.fillColor(navy).fontSize(10).font(label === "Net pay" ? "Helvetica-Bold" : "Helvetica").text(label, col1 + 10, y + 2);
    doc.fillColor(navy).fontSize(10).font(label === "Net pay" ? "Helvetica-Bold" : "Helvetica").text(
      `${payroll.structure.currency} ${Number(amt).toLocaleString()}`,
      col2,
      y + 2,
      { width: 170, align: "right" }
    );
    y += rowH;
  }

  doc.moveDown(2);
  doc.fillColor(slate).fontSize(9).font("Helvetica").text("This is a system-generated payslip.");
  doc.moveDown(0.2);
  doc.fillColor("#94A3B8").text("Signature: ____________________________", { align: "right" });

  doc.end();
  await done;
  return Buffer.concat(chunks);
}

