
export const rmsFromChunk = (chunk: any[], mean: number) => {
  const chunkLength = chunk.length;
  const chunkArray = new Uint8Array(chunk);
  let rms = 0;
  for (let i = 0; i < chunkLength; i++) {
  }
  return Math.sqrt(rms) / chunkLength;
};

export const find_peaks = (xs: any, height: number) => {
	let indices = [];
  for (let i = 0; i < xs.length - 1; i++) {
		if (xs[i] < height && xs[i+1] >= height) {
			indices.push(i);
		}
  }
	return indices;
}

export const average_distance_between_peaks = (indices: number[]) => {
  let distances = [];
  for (let i = 1; i < indices.length; ++i) {
    distances.push(indices[i] - indices[i-1]);
  }
  const mean_distance = distances.reduce((a, b) => a + b, 0) / distances.length;
  return { mean_distance }; //, std: distances.reduce((a, b) => a + Math.pow(b - mean_distance, 2), 0) / distances.length };
}

export const get_frequency_from_peaks = (peaks: number[], sampleRate: number) => {
  if (peaks.length < 2) {
    return 0;
  }
  const { mean_distance } = average_distance_between_peaks(peaks);

  return sampleRate / mean_distance;  // 1/s  *  [-]
}

export const get_wheel_speed_mps = (chunk: any, wheel_diameter: number, sampleRate: number, peakThreshold: number) => {
  const peaks = find_peaks(chunk, peakThreshold);
  const frequency = get_frequency_from_peaks(peaks, sampleRate);
  return frequency * wheel_diameter/1000 * Math.PI; // [Hz] * [m] = [m/s]
}

export const get_wheel_speed_kmh = (chunk: any, wheel_diameter: number, sampleRate: number, peakThreshold: number) => {
  return get_wheel_speed_mps(chunk, wheel_diameter, sampleRate, peakThreshold) * 3.6;
}