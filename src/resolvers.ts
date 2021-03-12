import {Projects, Galleries} from './datasource'
import { DataSourceContainer } from './types/index'

export default {
  Query: {
    projects: (
      parent: null,
      { sort, count }: { sort: { date: number }, count: number },
      { dataSources }: { dataSources: DataSourceContainer<Projects> }
    ): ReturnType<Projects["fetchProjects"]>  => dataSources.projects.fetchProjects(sort, count),
    galleries: (
      parent: null,
      { count }: { count: number },
      { dataSources }: { dataSources: DataSourceContainer<Galleries> }
    ): ReturnType<Galleries["fetchGalleries"]>  => dataSources.galleries.fetchGalleries(count),
    gallery: (
      parent: null,
      { slug }: { slug: string },
      { dataSources }: { dataSources: DataSourceContainer<Galleries> }
    ): ReturnType<Galleries["fetchGallery"]>  => dataSources.galleries.fetchGallery(slug)
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
    updateGallery: (
      parent: null,
      gallery,
      { dataSources }: { dataSources: DataSourceContainer<Galleries> }
    ): ReturnType<Galleries["updateGallery"]>  => dataSources.galleries.updateGallery(gallery),
  },
  Gallery: {
    project: (
      { projectId }:  {projectId: String},
      args: null,
      { dataSources }: { dataSources: DataSourceContainer<Projects> }
    ): ReturnType<Projects["fetchProject"]>  => dataSources.projects.fetchProject(projectId),
  }
}
