import request from "./request";

const ENDPOINT = "api/category";

const getAll = async (params) => {
  let url = `${ENDPOINT}/all`;
  if (params) {
    url = `${ENDPOINT}`;
  }
  return request.get(url, { params }).then((res) => {
    return res;
  });
};

const getById = async (id) => {
  const url = `${ENDPOINT}/byId?id=${id}`;
  return request.get(url).then((res) => {
    return res;
  });
};

const deleteCategory = async (id) => {
  const url = `${ENDPOINT}?id=${id}`;
  return request.delete(url).then((res) => {
    return res;
  });
};

const save = async (data) => {
  if (data.categoryId) {
    // If categoryId exists, it means we are updating an existing category
    const url = `${ENDPOINT}/${data.categoryId}`;
    return request.put(url, data).then((res) => {
      return res;
    });
  } else {
    // If categoryId doesn't exist, it means we are adding a new category
    const url = `${ENDPOINT}`;
    return request.post(url, data).then((res) => {
      return res;
    });
  }
};

const categoryService = { getAll, getById, deleteCategory, save };

export default categoryService;