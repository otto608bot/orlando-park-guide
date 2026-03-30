import { client } from './sanity'
import { allPostSlugsQuery } from './queries'

export async function getAllPostSlugs(): Promise<string[]> {
  return client.fetch(allPostSlugsQuery)
}