import http from '~/api/booth/http'
import type { CreatedResult, ErrorResult, PagedResult, ResumeProject, ResumeProjectCreateRequest, ResumeRole, ResumeRoleCreateRequest, SearchRequest } from './types';
import { searchQuery } from './types'

/**
 * 获取简历项目列表
 * @param request 
 * @returns 
 */
export function getResumeProjects(request: SearchRequest): Promise<PagedResult<ResumeProject>> {
  const query = searchQuery(request)
  return http.get(`/resume/projects${query.length > 0 ? `?${  query}` : ""}`)
}

/**
 * 创建简历项目
 * @param project 
 * @returns 
 */
export function createResumeProject(project: ResumeProjectCreateRequest): Promise<CreatedResult | ErrorResult> {
  return http.post(`/resume/projects`, project)
}

/**
 * 获取简历角色列表
 * @param project 
 * @returns 
 */
export function getResumeRoles(request: SearchRequest): Promise<PagedResult<ResumeRole>> {
  const query = searchQuery(request)
  return http.get(`/resume/roles${query.length > 0 ? `?${  query}` : ""}`)
}

/**
 * 创建简历角色
 * @param project 
 * @returns 
 */
export function createResumeRole(role: ResumeRoleCreateRequest): Promise<CreatedResult | ErrorResult> {
  return http.post(`/resume/roles`, role)
}