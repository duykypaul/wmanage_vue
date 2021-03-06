import Repository from "@/repositories/Repository";

const resource = '/orders';
const consignments = '/consignments';
export default {
  findAll() {
    return Repository.get(`${resource}`);
  },
  findAllConsignments() {
    return Repository.get(`${resource}${consignments}`);
  },
  findById(id) {
    return Repository.get(`${resource}/${id}`);
  },
  create(payload) {
    return Repository.post(`${resource}`, payload);
  },
  update(id, payload) {
    return Repository.put (`${resource}/${id}`, payload);
  },
  delete(id) {
    return Repository.delete(`${resource}/${id}`);
  },
  deleteAllByIds(payload) {
    return Repository.delete(`${resource}`, payload);
  },
  saveAllData(payload) {
    return Repository.post(`${resource}`, payload);
  }
}
