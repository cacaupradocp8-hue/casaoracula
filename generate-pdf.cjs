
const { jsPDF } = require('jspdf');
const fs = require('fs');

const doc = new jsPDF();
const content = fs.readFileSync('DOCUMENTACAO_SISTEMA_ORACULA.md', 'utf8');

doc.setFontSize(16);
doc.text('Documentacao Tecnica: Casa Oracula', 10, 10);
doc.setFontSize(10);

const splitText = doc.splitTextToSize(content, 180);
doc.text(splitText, 10, 20);

const pdfData = doc.output();
fs.writeFileSync('DOCUMENTACAO_SISTEMA_ORACULA.pdf', Buffer.from(pdfData, 'binary'));
console.log('PDF generated successfully');
