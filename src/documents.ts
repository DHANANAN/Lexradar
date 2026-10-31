export async function extractDocx(file: File) {
  const { extractRawText } = await import('mammoth');
  const result = await extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

export async function exportDocx(text: string, title: string) {
  const { Document, Packer, Paragraph, TextRun } = await import('docx');
  const doc = new Document({
    sections: [
      {
        children: text.split('\n').map(
          line =>
            new Paragraph({
              children: [new TextRun({ text: line, font: 'Times New Roman', size: 24 })],
              spacing: { after: 160 },
            })
        ),
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = (title.replace(/[^a-z0-9 -]/gi, '').slice(0, 80) || 'manuscript') + '.docx';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
