import { StageRunner, successResult } from '@torv-io/node-sdk';

const runStage: StageRunner = async (context) => {
    context.logger.info('Hello World');
    return successResult({});
};

export default runStage;
