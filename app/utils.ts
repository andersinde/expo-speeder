// import FFT from "fft.js";

export const rmsFromChunk = (chunk: any[], mean: number) => {
  const chunkLength = chunk.length;
  const chunkArray = new Uint8Array(chunk);
  let rms = 0;
  for (let i = 0; i < chunkLength; i++) {
    rms += Math.pow(chunkArray[i] - mean, 2);
  }
  return Math.sqrt(rms) / chunkLength;
};

const find_local_maxima = (xs: any) => {
  let midpoints = [];
  let left_edges = [];
  let right_edges = [];

  let m = 0;
  let i = 1;
  let i_max = xs.length - 1;

  while (i < i_max) {
    if (xs[i - 1] < xs[i]) {
      let i_ahead = i + 1;
      while (i_ahead < i_max && xs[i_ahead] == xs[i]) {
        i_ahead += 1;
      }

      // Maxima is found if next unequal sample is smaller than x[i]
      if (xs[i_ahead] < xs[i]) {
        left_edges[m] = i;
        right_edges[m] = i_ahead - 1;
        midpoints[m] = Math.floor((left_edges[m] + right_edges[m]) / 2);
        m += 1;
        i = i_ahead;
      }
    }
    i += 1;
  }

  return midpoints;
};

/**
 * Filter peaks by required properties.
 */
const filter_maxima = ({ indices, xs, height }: { indices: number[], xs: any, height: number }) => {
  let new_indices = indices;
  if (height != undefined) {
    new_indices = indices.filter(i => xs[i] > height);
  }
  return new_indices;
};

export const find_peaks = (xs: any, height: number) => {
  let indices = find_local_maxima(xs)
  return filter_maxima({ indices: indices, xs: xs, height: height });
};

export const average_distance_between_peaks = (indices: number[]) => {
  let distances = [];
  for (let i = 1; i < indices.length; ++i) {
    distances.push(indices[i] - indices[i-1]);
  }
  const mean_distance = distances.reduce((a, b) => a + b, 0) / distances.length;
  return { mean_distance, std: distances.reduce((a, b) => a + Math.pow(b - mean_distance, 2), 0) / distances.length };
}

export const get_frequency_from_peaks = (peaks: number[], sampleRate: number) => {
  if (peaks.length < 2) {
    return 0;
  }
  const { mean_distance } = average_distance_between_peaks(peaks);

  return sampleRate / mean_distance;  // 1/s  *  [-]
}

export const get_wheel_speed_kmh = (chunk: any, wheel_diameter: number, sampleRate: number) => {
  const peaks = find_peaks(chunk, 10)
  const frequency = get_frequency_from_peaks(peaks, sampleRate);
  return frequency * Math.PI * wheel_diameter/1000 * 3.6 / 2;  // (two magnets)
}