import { S3 } from 'aws-sdk';
import { StageRunner, StageContext, successResult, errorResult, requireParam, requireInput } from '@torv-io/node-sdk';

const saveToFileAndUpload = async (datasetIds: string[], bucketName: string, fileName: string, accessKeyId: string, secretAccessKey: string): Promise<{ success: boolean; message: string }> => {
  try {
    const s3 = new S3({
      accessKeyId,
      secretAccessKey
    });
    const fileContent = datasetIds.join('\n');
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
    };
    await s3.putObject(params).promise();
    return { success: true, message: "File uploaded successfully." };
  } catch (error) {
    return { success: false, message: `Error uploading file: ${error.message}` };
  }
};

export default (async function run(context: StageContext) {
  try {
    const accessKeyId = requireParam(context, 'aws_access_key_id') as string;
    const secretAccessKey = requireParam(context, 'aws_secret_access_key') as string;
    const bucketName = requireParam(context, 's3_bucket_name') as string;
    const fileName = requireParam(context, 'file_name') as string;
    const datasetIds = requireInput(context, 'dataset_ids') as string[];

    const { success, message } = await saveToFileAndUpload(datasetIds, bucketName, fileName, accessKeyId, secretAccessKey);

    if (success) {
      return successResult({ success, message });
    } else {
      return errorResult(message);
    }
  } catch (error) {
    return errorResult(`Stage execution failed: ${error.message}`);
  }
} as StageRunner);