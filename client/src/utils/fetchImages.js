import axios from "axios";
import { backendUrl } from "../config";

const { REACT_APP_AWS_BUCKET_URI } = process.env;

export default async function() {
  const requestImages = await axios.get(backendUrl + "/api/artworks");
  return requestImages.data.map((image, index) => {
    let { image_key, description, name, ...otherProps } = image;
    let getDimensinos = image_key.match(/(\d+)x(\d+)\.jpe?g$/i);
    let [, width, height] = getDimensinos;
    return {
      image_key: "portfolio/" + image_key,
      src: REACT_APP_AWS_BUCKET_URI + "/portfolio/" + image.image_key,
      ...otherProps,
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      key: image.id,
      index,
      caption: name + ": " + description
    };
  });
}
