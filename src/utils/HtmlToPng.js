import html2canvas from 'html2canvas';
  
 export const HtmlToImage = (CurrentComponentRef, formate) => {
    if (CurrentComponentRef) {
      html2canvas(CurrentComponentRef).then((canvas) => {
        const imgData = canvas.toDataURL(`image/${formate}`);
        
        // Create a temporary anchor element to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = imgData;
        downloadLink.download = `captured-image.${formate}`;
        
        // Trigger a click event on the anchor element
        downloadLink.click();
      
      });
    }
  };
