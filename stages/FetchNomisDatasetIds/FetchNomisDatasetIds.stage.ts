import { StageRunner, StageContext, successResult, errorResult } from '@torv-io/node-sdk';
import fetch from 'node-fetch';

interface FetchNomisDatasetIdsOutputs {
  dataset_ids: string[];
}

const FetchNomisDatasetIds: StageRunner = async (context: StageContext) => {
  const apiUrl = 'https://www.nomisweb.co.uk/api/v01/dataset/def.sdmx.json';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch datasets: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.structure || !Array.isArray(data.structure.keyfamilies.keyfamily)) {
      throw new Error('Invalid response format');
    }
    const datasetIds = data.structure.keyfamilies.keyfamily.map((dataset: { id: string }) => dataset.id);
    return successResult({ dataset_ids: datasetIds });
  } catch (error) {
    context.logger.error('Error fetching dataset IDs', error);
    return errorResult(`Error fetching dataset IDs: ${error.message}`);
  }
};

export default FetchNomisDatasetIds;
