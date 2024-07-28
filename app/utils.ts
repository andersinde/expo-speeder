import { Buffer } from "buffer";
import FFT from "fft.js";

export const lineDataFromChunk = (chunk: Buffer) => {
  const chunkLength = chunk.length;
  const chunkArray = new Uint8Array(chunk);
  const data = [];
  for (let i = 0; i < chunkLength; i++) {
    data.push({ value: chunkArray[i] });
  }
  return data;
}

export const rmsFromChunk = (chunk: Buffer, mean: number) => {
  const chunkLength = chunk.length;
  const chunkArray = new Uint8Array(chunk);
  let rms = 0;
  for (let i = 0; i < chunkLength; i++) {
    rms += Math.pow(chunkArray[i] - mean, 2);
  }
  return Math.sqrt(rms) / chunkLength;
}

export function detectPeaks(chunk: Buffer, windowWidth: number, threshold:number) {
  const peaks = [];
  for (let i = 0; i < chunk.length; i++) {
    const start = Math.max(0, i - windowWidth);
    const end = Math.min(chunk.length, i + windowWidth);
    let deltaAcc = 0;
    for (let a = start; a < end; a++) {
      deltaAcc += Math.abs(chunk[a - 1] - chunk[a]);
    }
    if (deltaAcc > threshold) {
      peaks.push(i);
    }
  }
  return peaks;
}


// https://stackoverflow.com/a/47593316/10694594
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

var random_function = mulberry32(0);

function mulberry_seed(a) {
  random_function = mulberry32(a);
}

// slight modification of solution taken from here:
// https://riptutorial.com/javascript/example/8330/random--with-gaussian-distribution
// distribution scale needs to be adjusted by 3.56/Math.sqrt(n)
// value found empirically.
function uniform_sum_distribution(mean=0.0, scale=1.0, n=5) {
  var x = 0;
  for (var i = 0; i < n; i++) { x += random_function(); }
  return mean + (x - n/2) * 3.56/Math.sqrt(n) * scale;
}

// https://stackoverflow.com/a/65410414/10694594
let decor = (v, i) => [v, i]; // combine index and value as pair
let undecor = pair => pair[1];  // remove value from pair
const argsort = arr => arr.map(decor).sort().map(undecor);

/**
 * Get indices of all local maxima in a sequence.
 * @param {number[]} xs - sequence of numbers
 * @returns {number[]} indices of local maxima
 */
function find_local_maxima(xs) {
  let maxima = [];
  // iterate through all points and compare direct neighbors
  for (let i = 1; i < xs.length-1; ++i) {
    if (xs[i] > xs[i-1] && xs[i] > xs[i+1])
      maxima.push(i);
  }
  return maxima;
}

/**
 * Remove peaks below minimum height.
 * @param {number[]} indices - indices of peaks in xs
 * @param {number[]} xs - original signal
 * @param {number} height - minimum peak height
 * @returns {number[]} filtered peak index list
 */
function filter_by_height(indices, xs, height) {
  return indices.filter(i => xs[i] > height);
}

/**
 * Remove peaks that are too close to higher ones.
 * @param {number[]} indices - indices of peaks in xs
 * @param {number[]} xs - original signal
 * @param {number} dist - minimum distance between peaks
 * @returns {number[]} filtered peak index list
 */
function filter_by_distance(indices, xs, dist) {
  let to_remove = Array(indices.length).fill(false);
  let heights = indices.map(i => xs[i]);
  let sorted_index_positions = argsort(heights).reverse();

  // adapted from SciPy find_peaks
  for (let current of sorted_index_positions) {
    if (to_remove[current]) {
      continue;  // peak will already be removed, move on.
    }

    let neighbor = current-1;  // check on left side of current peak
    while (neighbor >= 0 && (indices[current]-indices[neighbor]) < dist) {
      to_remove[neighbor] = true;
      --neighbor;
    }

    neighbor = current+1;  // check on right side of current peak
    while (neighbor < indices.length
    && (indices[neighbor]-indices[current]) < dist) {
      to_remove[neighbor] = true;
      ++neighbor;
    }
  }
  return indices.filter((v, i) => !to_remove[i]);
}

/**
 * Filter peaks by required properties.
 * @param {number[]}} indices - indices of peaks in xs
 * @param {number[]} xs - original signal
 * @param {number} distance - minimum distance between peaks
 * @param {number} height - minimum height of peaks
 * @returns {number[]} filtered peak indices
 */
function filter_maxima(indices, xs, distance, height) {
  let new_indices = indices;
  if (height != undefined) {
    new_indices = filter_by_height(indices, xs, height);
  }
  // if (distance != undefined) {
  //   new_indices = filter_by_distance(new_indices, xs, distance);
  // }
  return new_indices;
}

/**
 * Simplified version of SciPy's find_peaks function.
 * @param {number[]} xs - input signal
 * @param {number} distance - minimum distance between peaks
 * @param {number} height - minimum height of peaks
 * @returns {number[]} peak indices
 */
export function find_peaks(xs, distance, height) {
  let indices = find_local_maxima(xs)
  return filter_maxima(indices, xs, distance, height);
}



const average_distance_between_peaks = (indices: number[]) => {
  let distances = [];
  for (let i = 1; i < indices.length; ++i) {
    distances.push(indices[i] - indices[i-1]);
  }
  return distances.reduce((a, b) => a + b, 0) / distances.length;
}

export const get_frequency_from_peaks = (peaks: number[], sampleRate: number) => {
  if (peaks.length < 2) {
    return 0;
  }

  return sampleRate / average_distance_between_peaks(peaks);  // 1/s  *  [-]
}

export const get_wheel_speed_kmh = (chunk: Buffer, wheel_diameter: number, sampleRate: number) => {
  const peaks = find_peaks(chunk, 0, 0.5);
  const frequency = get_frequency_from_peaks(peaks, sampleRate);
  return frequency * Math.PI * wheel_diameter * 3.6;
}