// Parser for Grasshopper output data format
// The data is in key=value format with comma-separated arrays

export interface UrbanAnalysisData {
  runId: string;
  pathLengthM: number;
  costDistance: number;
  gfaTotalM2: number;
  heightLevelsMin: number;
  heightLevelsMax: number;
  parkAreaTotalM2: number;
  isovistSM: number[];
  isovistAreaM2: number[];
  isovistOcclusivityRaw: number[];
  isovistOcclusivity: number[];
  meanRadial: number[];
  elongation: number[];
  dispersion: number[];
  nodeCloseness: number[];
  nodeBetweenness: number[];
  nodeNearestIsovistAreaM2: number[];
  nodeX: number[];
  nodeY: number[];
}

export function parseUrbanData(text: string): UrbanAnalysisData {
  const lines = text.trim().split('\n');
  const data: Partial<UrbanAnalysisData> = {};

  for (const line of lines) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=');
      const normalizedKey = key.trim();

      // Parse different data types
      if (normalizedKey === 'run_id') {
        data.runId = value.trim();
      } else if (normalizedKey.includes('isovist') || normalizedKey.includes('node_')) {
        // Parse comma-separated arrays
        const arrayValues = value.split(',').map((v) => parseFloat(v.trim())).filter((v) => !isNaN(v));
        if (arrayValues.length > 0) {
          switch (normalizedKey) {
            case 'isovist_s_m':
              data.isovistSM = arrayValues;
              break;
            case 'isovist_area_m2':
              data.isovistAreaM2 = arrayValues;
              break;
            case 'isovist_occlusivity_raw':
              data.isovistOcclusivityRaw = arrayValues;
              break;
            case 'isovist_occlusivity':
              data.isovistOcclusivity = arrayValues;
              break;
            case 'mean_radial':
              data.meanRadial = arrayValues;
              break;
            case 'elongation':
              data.elongation = arrayValues;
              break;
            case 'dispersion':
              data.dispersion = arrayValues;
              break;
            case 'node_closeness':
              data.nodeCloseness = arrayValues;
              break;
            case 'node_betweenness':
              data.nodeBetweenness = arrayValues;
              break;
            case 'node_nearest_isovist_area_m2':
              data.nodeNearestIsovistAreaM2 = arrayValues;
              break;
            case 'node_x':
              data.nodeX = arrayValues;
              break;
            case 'node_y':
              data.nodeY = arrayValues;
              break;
          }
        }
      } else {
        // Parse numeric values
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          switch (normalizedKey) {
            case 'path_length_m':
              data.pathLengthM = numValue;
              break;
            case 'cost_distance':
              data.costDistance = numValue;
              break;
            case 'gfa_total_m2':
              data.gfaTotalM2 = numValue;
              break;
            case 'height_levels_min':
              data.heightLevelsMin = numValue;
              break;
            case 'height_levels_max':
              data.heightLevelsMax = numValue;
              break;
            case 'park_area_total_m2':
              data.parkAreaTotalM2 = numValue;
              break;
          }
        }
      }
    }
  }

  return data as UrbanAnalysisData;
}
