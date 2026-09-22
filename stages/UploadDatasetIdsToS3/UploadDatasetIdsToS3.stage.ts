import {
    StageRunner,
    StageContext,
    successResult,
    errorResult,
    requireParam,
    requireInput,
} from '@torv-io/node-sdk';
import AWS from 'aws-sdk';

interface UploadDatasetIdsToS3Params {
    aws_access_key_id: string;
    aws_secret_access_key: string;
    s3_bucket_name: string;
    s3_key_prefix: string;
}

interface UploadDatasetIdsToS3Inputs {
    dataset_ids: string[];
}

interface UploadDatasetIdsToS3Outputs {
    success: boolean;
    message: string;
}

const uploadDatasetIdsToS3: StageRunner = async (context: StageContext) => {
    try {
        const awsAccessKeyId = requireParam(context, 'aws_access_key_id');
        const awsSecretAccessKey = requireParam(context, 'aws_secret_access_key');
        const s3BucketName = requireParam(context, 's3_bucket_name');
        const s3KeyPrefix = requireParam(context, 's3_key_prefix');
        const datasetIds = requireInput(context, 'dataset_ids');

        const s3 = new AWS.S3({
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
        });

        const fileContent = datasetIds.join('\n');
        const s3Key = `${s3KeyPrefix}/dataset_ids.txt`;

        await s3.putObject({
            Bucket: s3BucketName,
            Key: s3Key,
            Body: fileContent,
            ContentType: 'text/plain',
        }).promise();

        return successResult({ success: true, message: 'Upload successful' });
    } catch (error: any) {
        context.logger.error('Error uploading dataset IDs to S3', error);
        return errorResult(`Failed to upload dataset IDs: ${error.message}`);
    }
};

export default uploadDatasetIdsToS3;
