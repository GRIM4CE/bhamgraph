import { RESTDataSource } from 'apollo-datasource-rest'
import { Project, Gallery } from './types/generated'
import { ObjectId } from "mongodb";

interface Project_DB_res {
  id: String,
  projects: Project[]
}

const isAuthorized = (context, secure_api = true) => {
  if((context.API_KEY === process.env.PUBLIC_API_KEY ||
      context.API_KEY === process.env.API_KEY) &&
      !secure_api) return
  if(context.API_KEY === process.env.API_KEY && secure_api) return
  throw new Error('Not Authorized')
}

export class Projects extends RESTDataSource {
  async fetchProjects(filter, sort = { date: -1 }, count = 20): Promise<Project[]> {
    try {
      isAuthorized(this.context, false)
      let payload: Partial<{category: any}> = {}
      if(filter) payload.category = { $in: [filter] }
      const res = await this.context.projects.find(payload).limit(count).sort(sort).toArray()
      return res
    } catch(e) {
      return e
    }
  }

  async fetchProject(projectId): Promise<Project | Partial<Project>> {
    try {
      isAuthorized(this.context, false)
      const res = await this.context.projects.findOne({ _id: new ObjectId(projectId) })
      return res
    } catch(e) {
      return e
    }
  }


  async createProject(project): Promise<Project | Partial<Project>> {
    try {
      isAuthorized(this.context)
      const dbReadyProject = this.dbProjectReducer(project)
      const res = await this.context.projects.insertOne(dbReadyProject)
      return res.ops[0]
    } catch(e) {
      return e
    }
  }

  async updateProject(project): Promise<Project | Partial<Project>> {
    try {
      isAuthorized(this.context)
      const id = project._id
      const dbReadyProject = this.dbProjectReducer(project)
      const res = await this.context.projects.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: dbReadyProject }
      )
      return res.value
    } catch(e) {
      return e
    }
  }

  async deleteProject(_id): Promise<Project | Partial<Project>> {
    try {
      isAuthorized(this.context)
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
      const [path, fileType] = [image.slice(0, lastIndex), image.slice(lastIndex + 1)]
      project.image = { path, fileType, fallbackFileType: 'jpeg' }
    }
    return project
  }
}


export class Galleries extends RESTDataSource {
  async fetchGalleries(count = 20): Promise<Gallery[]> {
    isAuthorized(this.context, false)
    const res = await this.context.galleries.find().limit(count).toArray()
    return res
  }

  async fetchGallery(slug): Promise<Gallery> {
    isAuthorized(this.context, false)
    const res = await this.context.galleries.findOne({ slug })
    return res
  }

  async updateGallery(gallery): Promise<Gallery | Partial<Gallery>> {
    try {
      isAuthorized(this.context)
      const id = gallery._id
      const dbReadyGallery = this.dbGalleryReducer(gallery)
      const res = await this.context.galleries.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: dbReadyGallery }
      )
      return res.value
    } catch(e) {
      return e
    }
  }

  dbGalleryReducer(gallery) {
    if(gallery._id) delete gallery._id
    // if(gallery.image) {
    //   const { image } = gallery
    //   const lastIndex = image.lastIndexOf('.')
    //   const [path, fileType] = [image.slice(0, lastIndex), image.slice(lastIndex)]
    //   gallery.image = {path, fileType}
    // }
    return gallery
  }
}
