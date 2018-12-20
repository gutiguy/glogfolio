const AWS = require("aws-sdk");
const {
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET,
  AWS_ENDPOINT,
  AWS_REGION
} = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  endpoint: AWS_ENDPOINT,
  signatureVersion: "v4",
  region: AWS_REGION
});

module.exports = {
  deleteFiles: function(Objects) {
    return s3.deleteObjects(
      { Bucket: AWS_BUCKET, Delete: { Objects } },
      (err, data) => {
        if (err) {
          return err;
        } else {
          return data;
        }
      }
    );
  },

  addFile: function(Body, Key, ContentType, cb) {
    return s3.putObject({ Body, Bucket: AWS_BUCKET, Key, ContentType }, cb);
  },

  s3
};
