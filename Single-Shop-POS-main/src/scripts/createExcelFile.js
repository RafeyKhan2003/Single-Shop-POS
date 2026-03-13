import ExcelJS from 'exceljs'

export async function generateExcel(data, filePath = 'output.xlsx') {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Invalid data: Must be a non-empty array of objects', filePath)
    return
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet 1')

  // Get headers from the keys of the first object
  const headers = Object.keys(data[0])
  // Add headers to the worksheet first row
  worksheet.addRow(headers)

  // Add data rows
  data.forEach((row) => {
    worksheet.addRow(headers.map((key) => row[key]))
  })

  // Save the Excel file
  await workbook.xlsx.writeFile(filePath)
  console.log(`Excel file created: ${filePath}`)

  return filePath
}
