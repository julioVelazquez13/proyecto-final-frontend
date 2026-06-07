import axios from 'axios'

const API_URL = 'http://localhost:3000/categorias'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export default {
  async getAll() {
    const response = await api.get('/')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/${id}`)
    return response.data
  },

  async create(categoria) {
    const response = await api.post('/', categoria)
    return response.data
  },

  async update(id, categoria) {
    const response = await api.put(`/${id}`, categoria)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/${id}`)
    return response.data
  }
}