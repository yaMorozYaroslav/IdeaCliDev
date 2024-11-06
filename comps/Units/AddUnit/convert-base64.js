import React from "react";
import Resizer from "react-image-file-resizer";

const convert64 = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      300,
      "JPG",
      50,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
export const uploadImage = async(e) => {
		const file = e.target.files[0]
		//~ console.log(file)
		if(file && file.size > 10000000){alert('File is bigger than 10MB.')
		}else{
		const base64 = await convert64(file)
		var stringLength = base64.length - 'data:image/png;base64,'.length;
        var sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
        const sizeInKb=sizeInBytes/1000;
		//~ console.log(sizeInKb)
		
		return {base64, file, sizeInKb}
	
		}}
