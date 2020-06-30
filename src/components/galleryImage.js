import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doFetch } from '../util/api';

export default function(props) {
  const { id } = useParams();
  const [galleryImage, setGalleryImage] = useState({});

  useEffect(() => {
    doFetch(`/api/art/${id}`)
      .then(imageEntry => {
        setGalleryImage(imageEntry)
        console.log(imageEntry);
      });

  }, []);

  return (
    <>
      <img src={galleryImage.imageData} />
    </>
  )
}
