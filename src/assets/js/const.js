export const API_URL = import.meta.env.PROD ? "/api" : 'http://localhost:3000/api';

export const baseChartOpts = {
  color: {
    pairing: {
      option: 1
    }
  },
  toolbar: {
    enabled: false
  }
}

export const baseMeterChartOpts = {
  ...baseChartOpts,
}
