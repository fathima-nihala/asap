"use client";

import React from "react";
import Image from "next/image";
import { Box, Typography, ButtonBase } from "@mui/material";
import { IoMdCloudUpload } from "react-icons/io";

interface DropzoneImageProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  image?: string | null;
  id: string;
}

const DropzoneImage: React.FC<DropzoneImageProps> = ({ onChange, image, id }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <ButtonBase
        component="label"
        htmlFor={id}
        sx={{
          p: 2,
          border: "2px dashed",
          borderColor: "grey.400",
          borderRadius: 2,
          cursor: "pointer",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 300,
        }}
      >
        <IoMdCloudUpload size={35} style={{ marginBottom: 8 }} />
        <Typography variant="body1">
          Drop your file here, or{" "}
          <Typography component="span" color="primary">
            browse
          </Typography>
        </Typography>
        <Typography variant="caption" color="textSecondary">
          PNG, JPG, and GIF files are allowed
        </Typography>
        <input
          id={id}
          type="file"
          accept=".png, .jpg, .gif"
          hidden
          onChange={onChange}
        />
      </ButtonBase>

      {image && (
        <Box mt={2}>
          <Image src={image} alt="preview" width={150} height={150} style={{ borderRadius: 8, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }} />
        </Box>
      )}
    </Box>
  );
};

export default DropzoneImage;
