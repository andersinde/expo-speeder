export const get_wheel_speed_kmh_from_frequency = (frequency: number, wheelDiameter: number) => {
  return frequency * (wheelDiameter/1000) * Math.PI * 3.6;
}
