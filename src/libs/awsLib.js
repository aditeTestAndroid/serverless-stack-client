import { Storage } from "aws-amplify";

export const s3Upload = async (file) => {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  });

  return stored.key;
};

/*export const s3Delete = async (key) => {
  const removed = await Storage.vault
    .remove(key, { level: "protected" })
    .then((result) => console.log("Deleted Video from S3"))
    .catch((err) => console.log("Deleting video from S3 error: ", err));
  console.log(removed);
  return removed;
};*/
