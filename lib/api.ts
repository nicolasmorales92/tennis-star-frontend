import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/syroxtech';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});


api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiService = {

  register: async (userData: any) => {
    try {
      const res = await api.post('/usuarios', userData);
      return res.data;
    } catch (error: any) {
      console.error("Error en API register:", error.response?.data || error.message);
      throw error;
    }
  },
  login: async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  getUsuarios: async () => {
    try {
      const res = await api.get('/usuarios');
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.log(`error al cargar API usuarios: `, error)
      return [];
    }
  },


  getCategorias: async () => {
    try {
      const res = await api.get('/categorias');
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error("Error en API categorias:", error);
      return [];
    }
  },
  createCategoria: async (name: string) => {
    try {
      const res = await api.post('/categorias', { name: name });
      return res.data;
    } catch (error: any) {
      console.error("Error creando categoría:", error.response?.data);
      throw error;
    }
  },
  updateCategoria: async (id: number, productoData: any) => {
    try {
      const res = await api.patch(`/categorias/${id}`, productoData);
      return res.data;
    } catch (error: any) {
      console.error("Error editando categoria:", error.response?.data || error);
      throw error;
    }
  },
  deleteCategoria: async (id: number) => {
    try {
      const res = await api.delete(`/categorias/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("Error eliminando categoria:", error.response?.data || error);
      throw error;
    }
  }, 



  getProductos: async () => {
    try {
      const res = await api.get('/productos');
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error("Error en API Productos:", error);
      return [];
    }
  },
  createProducto: async (productoData: any) => {
    try {
      const res = await api.post('/productos', productoData);
      return res.data;
    } catch (error: any) {
      console.error("Error creando producto:", error);
      throw error;
    }
  },
  updateProducto: async (id: number, productoData: any) => {
    try {
      const res = await api.patch(`/productos/${id}`, productoData);
      return res.data;
    } catch (error: any) {
      console.error("Error editando producto:", error.response?.data || error);
      throw error;
    }
  },
  deleteProducto: async (id: number) => {
    try {
      const res = await api.delete(`/productos/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("Error eliminando producto:", error.response?.data || error);
      throw error;
    }
  }, 



  getVentas: async () => {
    try {
      const res = await api.get('/ventas');
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.log(`error al cargar API ventas: `, error)
      return [];
    }
  },
  createVentas: async (ventaData: any) => {
    try {
      const res = await api.post('/ventas', ventaData);
      return res.data;
    } catch (error: any) {
      console.error("Error creando la venta:", error);
      throw error;
    }
  },



  getMarcas: async () => {
    try {
      const res = await api.get('/productos/marcas');
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.log(`error al cargar API marcas: `, error)
      return [];
    }
  },
  
  getStats: async () => {
    try {
      const res = await api.get('/ventas/stats');
      return res.data;
    } catch (error) {
      console.log(`error al cargar API estadísticas: `, error);
      return { topProductos: [], topMarcas: [], topCategorias: [] };
    }
  },

};