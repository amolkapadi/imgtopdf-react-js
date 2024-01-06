import React, { useRef, useState} from 'react'
import {Document, Page, Text, Image, pdf, StyleSheet } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

import './App.css'

const styles = StyleSheet.create({
  image: {
    padding: 20,
    marginTop:20
  }
 
});

export default function App() {
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const converttoPdf = async () => {
      const files =fileInputRef.current.files;
      const images = [];

      for(let i = 0; i < files.length; i++){
          const file = files[i];
          const reader = new FileReader();

          reader.onload = (event) => {
            images.push(event.target.result);
            
            if(images.length === files.length){
              pdfDownload(images);
              fileInputRef.current.value = "";
            };
          };
          reader.onerror = (error) => {
            console.log("Error reading file", error)
          }
          reader.readAsDataURL(file)
      };
  };

  const pdfDownload = (images) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        if(currentProgress > 100){
          clearInterval(interval);
          genratePdf(images);
          setProgress(0);
        }else{
          setProgress(currentProgress);
        }
      }, 300);
  }

  const genratePdf = async (images) => {
        try{
          const doc = (
            <Document>
              {images.map((img, index) => (
                <Page key={index}>
                  <Image  src={img} style={styles.image} />
                </Page>
              ))}
            </Document>
          );
          const asPdf = pdf();
              
          asPdf.updateContainer(doc);
          const pdfBlob = await asPdf.toBlob();
          saveAs(pdfBlob, 'convert pdf')

        }catch(error){
          console.log("error", error);
        }
  }


  return (
    <div className='container'>
        <div className='card'>
          <h1>Convert img to pdf</h1>
          <input type='file' ref={fileInputRef} multiple/>
          <button onClick={converttoPdf} className='btn-convert'>Convert to pdf</button>
          <div style={{width:'100%', height:'20px', border:'1px solid #ccc', marginTop:50, marginBottom:30}}>
              <div className='progress'
                style={{
                  width:`${progress}%`,
                  height:'100%',
                  backgroundColor:'#2196f3',
                  transition:'width 0.3s ease-in-out'
                }}
              >

              </div>
          </div>
        </div>
    </div>
  )
}
