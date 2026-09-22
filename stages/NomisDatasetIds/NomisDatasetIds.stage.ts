import fetch from 'node-fetch';
import { StageRunner, StageContext, successResult, errorResult } from '@torv-io/node-sdk';

interface NomisDatasetIdsInputs {}
interface NomisDatasetIdsOutputs {
    datasetIds: string[];
}

const NOMIS_API_URL = 'https://www.nomisweb.co.uk/api/v01/dataset/def.sdmx.json';

const fetchDatasetIds = async (context: StageContext): Promise<NomisDatasetIdsOutputs> => {
    try {
        const response = await fetch(NOMIS_API_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch dataset IDs: ${response.statusText}`);
        }

        const data = await response.json();

        context.logger.info('API response structure', JSON.stringify(data));

        const datasetIds = Object.keys(data.structure?.codelists?.codelist || {});

        return successResult({ datasetIds });
    } catch (error: any) {
        context.logger.error('Error fetching dataset IDs', { error: error.message });
        return errorResult(error.message);
    }
};

const runner: StageRunner = async (context) => {
    return fetchDatasetIds(context);
};

export default runner;
