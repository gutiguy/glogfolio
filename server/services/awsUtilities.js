const AWS = require("aws-sdk");
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_BUCKET } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  endpoint: "s3-eu-central-1.amazonaws.com",
  signatureVersion: "v4",
  region: "eu-central-1"
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

  s3: s3
};
