import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Tooltip from '@material-ui/core/Tooltip';

 function CameraUpload({place,onImageChange}) {

  const handleChange = (e)=> {
    onImageChange(e);
   }
      return (
    <div className={place}>
      <input onChange={handleChange} accept="image/*" style={{display :"none"}} id="icon-button-file" type="file" />
      <label htmlFor="icon-button-file">
        <Tooltip placement="bottom" title="Upload profile pic" arrow>
          <IconButton aria-label="upload picture" component="span">
            <CameraAltIcon  fontSize="large" />
          </IconButton>
        </Tooltip>
      </label>
    </div>
  );
}

export default CameraUpload;