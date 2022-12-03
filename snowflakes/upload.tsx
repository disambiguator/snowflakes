import { v4 as uuid } from "uuid";

function dataURItoBlob(dataURI: string) {
  var binary = atob(dataURI.split(",")[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/png" });
}

const uploadPhoto = async (uri: string) => {
  console.log(uri);
  const file = dataURItoBlob(uri);
  const filename = uuid() + ".png";
  const res = await fetch(`/api/upload?file=${filename}`);
  const { url, fields } = await res.json();
  const formData = new FormData();

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!upload.ok) {
    console.error("Upload failed.");
  }
};

export default uploadPhoto;