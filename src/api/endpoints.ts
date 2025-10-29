export const projectEndpoints = {
  create: '/projects',
  getAll: '/projects',
  getById: (id: number) => `/projects/${id}`,
  update: (id: number) => `/projects/${id}`,
  delete: (id: number) => `/projects/${id}`,
  deleteTask: (id: number) => `/projects/tasks/${id}`,
};

export const taskEndpoints = {
  delete: (id: number) => `/projects/tasks/${id}`,
};

export const masterEndpoints = {
  getMasterData: '/master/all',
};


export const commentEndpoints = {
  addComment: '/comments/project',
  getProjectComment: (projectId: number) => `/comments/project/${projectId}`,
};
