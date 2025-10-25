import axios from 'axios';

const apiService = {
  getAuthToken() {
    return localStorage.getItem('token');
  },

  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  async get(url, config = {}) {
    try {
      const response = await axios.get(url, {
        ...config,
        headers: { ...this.getHeaders(), ...config.headers },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async post(url, data, config = {}) {
    try {
      const response = await axios.post(url, data, {
        ...config,
        headers: { ...this.getHeaders(), ...config.headers },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async put(url, data, config = {}) {
    try {
      const response = await axios.put(url, data, {
        ...config,
        headers: { ...this.getHeaders(), ...config.headers },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await axios.delete(url, {
        ...config,
        headers: { ...this.getHeaders(), ...config.headers },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      return { message: 'No se pudo conectar con el servidor' };
    }
    return { message: error.message };
  },
};

export default apiService;