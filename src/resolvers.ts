import {Projects, Galleries} from './datasource'
import { DataSourceContainer } from './types/index'

export default {
  Query: {
    projects: (
      parent: null,
      { sort, count }: { sort: { year: number }, count: number },
      { dataSources }: { dataSources: DataSourceContainer<Projects> }
    ): ReturnType<Projects["fetchProjects"]>  => dataSources.projects.fetchProjects(sort, count),
    gallery: (
      parent: null,
      { id }: { id: string },
      { dataSources }: { dataSources: DataSourceContainer<Galleries> }
    ): ReturnType<Galleries["fetchGallery"]>  => dataSources.galleries.fetchGallery(id)
  },
  Mutation: {
    addProject: (
      parent: null,
      project,
      { dataSources }: { dataSources: DataSourceContainer<Projects> }
    ): ReturnType<Projects["createProject"]>  => dataSources.projects.createProject(project),
    updateProject: (
      parent: null,
      project,
      { dataSources }: { dataSources: DataSourceContainer<Projects> }
    ): ReturnType<Projects["updateProject"]>  => dataSources.projects.updateProject(project),
    deleteProject: (
      parent: null,
      { _id }: { _id: string },
      { dataSources }: { dataSources: DataSourceContainer<Projects> }
    ): ReturnType<Projects["deleteProject"]>  => dataSources.projects.deleteProject(_id),
  }
}
