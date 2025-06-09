const puppeteer = require('puppeteer');

const generatePDFFromUrl = async(url:string, outputPath:string)=> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(url, {
    waitUntil: 'networkidle0'
  });
  
    await page.pdf({
            path: outputPath,
            format: 'A4', // or 'Letter', 'Legal', etc.
            landscape: false, // or true for landscape
            printBackground: true, // include background graphics
            margin: {
                top: '30mm',
                right: '20mm',
                bottom: '30mm',
                left: '20mm'
            },
            headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%;">Header</div>',
            footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
            displayHeaderFooter: true,
            preferCSSPageSize: true // use CSS @page size if available
    });
  await browser.close();
}

export default generatePDFFromUrl


