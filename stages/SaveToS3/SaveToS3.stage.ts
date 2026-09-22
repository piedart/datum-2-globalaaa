import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { StageRunner, successResult, errorResult, requireParam, requireInput } from '@torv-io/node-sdk';

interface SaveToS3Params {
  s3_bucket_name: string;
  aws_access_key_id: string;
  aws_secret_access_key: string;
}

interface SaveToS3Inputs {
  dataset_ids: string[];
}

interface SaveToS3Outputs {
  message: string;
}

const run: StageRunner = async (context) => {
  const bucketName = requireParam(context, 's3_bucket_name') as string;
  const accessKeyId = requireParam(context, 'aws_access_key_id') as string;
  const secretAccessKey = requireParam(context, 'aws_secret_access_key') as string;
  const datasetIds = requireInput(context, 'dataset_ids') as string[];

  const fileContent = datasetIds.join('\n');
  const fileName = 'dataset_ids.txt';

  const s3Client = new S3Client({
    region: 'eu-west-2',
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: 'text/plain'
    });
    await s3Client.send(command);

    return successResult({ message: `File '${fileName}' uploaded successfully to bucket '${bucketName}'.` });
  } catch (error) {
    context.logger.error('Failed to upload file to S3:', error);
    return errorResult('Failed to upload file to S3. Please check the bucket name and permissions.');
  }
};

export default run;
