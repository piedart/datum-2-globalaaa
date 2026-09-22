import fetch from 'node-fetch';
import { StageRunner, successResult, errorResult } from '@torv-io/node-sdk';

interface FetchNomisDatasetIdsParams {}
interface FetchNomisDatasetIdsInputs {}
interface FetchNomisDatasetIdsOutputs {
  dataset_ids: string[];
}

const NOMIS_API_URL = 'https://www.nomisweb.co.uk/api/v01/dataset/def.sdmx.json';

const fetchDatasetIds: StageRunner = async (context) => {
  try {
    const response = await fetch(NOMIS_API_URL);
    if (!response.ok) {
      return errorResult(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.structure || !data.structure.keyfamilies || !Array.isArray(data.structure.keyfamilies.keyfamily)) {
      return errorResult('Unexpected data structure received.');
    }

    const datasetIds = data.structure.keyfamilies.keyfamily.map((d: { id: string }) => d.id);
    return successResult({ dataset_ids: datasetIds });
  } catch (error) {
    return errorResult(`Error fetching dataset IDs: ${error.message}`);
  }
};

export default fetchDatasetIds;
