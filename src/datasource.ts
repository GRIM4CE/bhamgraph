import { RESTDataSource } from 'apollo-datasource-rest'
import { Project, Gallery } from './types/generated'
import { ObjectId } from "mongodb";

interface Project_DB_res {
  id: String,
  projects: Project[]
}


export class Projects extends RESTDataSource {
  async fetchProjects(sort = { year: 1 }, count = 20): Promise<Project[]> {
    const res = await this.context.projects.find().limit(count).sort({year: -1}).toArray()
    return res
  }

  async createProject(project): Promise<Project | Partial<Project>> {
    try {
      const dbReadyProject = this.dbProjectReducer(project)
      const res = await this.context.projects.insertOne(dbReadyProject)
      return res.ops[0]
    } catch(e) {
      return e
    }
  }

  async updateProject(project): Promise<Project | Partial<Project>> {
    try {
      const id = project._id
      const dbReadyProject = this.dbProjectReducer(project)
      console.log(dbReadyProject)
      const res = await this.context.projects.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: dbReadyProject }
      )
      console.log(res)
      return res.value
    } catch(e) {
      return e
    }
  }

  async deleteProject(_id): Promise<Project | Partial<Project>> {
    try {
      const res = await this.context.projects.findOneAndDelete({ _id: new ObjectId(_id) })
      return res.value
    } catch(e) {
      return e
    }
  }

  dbProjectReducer(project) {
    if(project._id) delete project._id
    if(project.image) {
      const { image } = project
      const lastIndex = image.lastIndexOf('.')
      const [path, fileType] = [image.slice(0, lastIndex), image.slice(lastIndex)]
      project.image = {path, fileType}
    }
    return project
  }
}


export class Galleries extends RESTDataSource {
  async fetchGallery(id): Promise<Project[]> {
    // const res = await this.findOneById('60456391f0f2c6ace104d3e2')
    // return res[id]
    return []
  }
}
