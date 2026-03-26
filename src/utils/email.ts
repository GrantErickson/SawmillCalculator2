import { moneySymbol } from '../stores/settings'

export const pdfStyles = '<style>\n' +
  'td, th {\n' +
  '\tborder: 1px solid black;\n' +
  '\tpadding-left: 8px;\n' +
  '\tpadding-right: 8px;\n' +
  '\tpadding-top: 3px;\n' +
  '\tpadding-bottom: 3px;\n' +
  '\ttext-align: right;\n' +
  '}\n' +
  'table {\n' +
  '\tborder-collapse:collapse;\n' +
  '\tfont-size:.5em;\n' +
  '}\n' +
  'td.left, th.left {\n' +
  '   text-align:left;\n' +
  '}\n' +
  'th {\n' +
  '   font-weight: bold;\n' +
  '}\n' +
  '</style>\n'

function htmlToPlainText(html: string): string {
  var parsed = new DOMParser().parseFromString(html, 'text/html')
  var rows = parsed.querySelectorAll('tr')
  if (rows.length > 0) {
    var lines: string[] = []
    rows.forEach(function (row) {
      var cells = row.querySelectorAll('th, td')
      var cellTexts: string[] = []
      cells.forEach(function (cell) { cellTexts.push(cell.textContent || '') })
      lines.push(cellTexts.join('\t'))
    })
    return lines.join('\n')
  }
  return parsed.body.textContent || ''
}

export function sendEmail(subject: string, body: string, filename: string): void {
  var doc = new jsPDF('p', 'pt', 'letter')
  doc.fromHTML(body, 15, 15)

  try {
    // Use email composer plugin for HTML body with PDF attachment (native platforms)
    if ((window as any).Capacitor && (window as any).Capacitor.Plugins && (window as any).Capacitor.Plugins.EmailComposer) {
      var dataUri = doc.output('datauristring')
      var base64Idx = dataUri.indexOf('base64,')
      var base64Pdf = base64Idx !== -1 ? dataUri.substring(base64Idx + 7) : ''
      ;(window as any).Capacitor.Plugins.EmailComposer.open({
        subject: subject,
        body: body,
        isHtml: true,
        attachments: [{
          type: 'base64',
          path: base64Pdf,
          name: filename
        }]
      }).catch(function (err: any) {
        console.log('Email composer failed:', err)
        doc.save(filename)
      })
      return
    }
    // Fallback: Use the Web Share API if available
    if (navigator.share && typeof navigator.canShare === 'function') {
      var pdfBlob = doc.output('blob')
      var file = new File([pdfBlob], filename, { type: 'application/pdf' })
      var plainText = htmlToPlainText(body)
      var shareData = { title: subject, text: plainText, files: [file] }
      if (navigator.canShare(shareData)) {
        navigator.share(shareData).catch(function (err: any) {
          console.log('Share cancelled or failed:', err)
          doc.save(filename)
        })
        return
      }
    }
    // Fallback: save the PDF directly
    console.log(body)
    doc.save(filename)
  } catch (error) {
    alert(error)
  }
}
