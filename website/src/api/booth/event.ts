import http from '~/api/booth/http'


export interface EventItem {
  id: string;
  labels: string[];
}

export interface FilterEventsRequest {
  userId: string;
  events: EventItem[];
  users: string[];
}

export interface EventUserItem {
  id: string
  name: string
  avatar: string
  address: string
  displayName: string
}

export interface RecomendedUsers {
  count: number
  users: EventUserItem[]
}

export interface EventMatchedItem {
  interested: string[]
  isEnabled: boolean
  followingUsers: RecomendedUsers
  matchedUsers: RecomendedUsers
  courses: MatchedCourse[]
  registrants: RecomendedUsers
  hasInterested: boolean
}

export interface MatchedCourse {
  id: string
  title: string
  description: string
  seriesId: string
  coverImage: string
}

export function filterEvents(request: FilterEventsRequest): Promise<EventMatchedItem[]> {
  return http.post('/events', request)
}

export interface InterestEventRequest {
  userId: string
  targetId: string

}
export function interestEvent(request: InterestEventRequest) {
  return http.post('/interest', {
    ...request,
    targetType: 'link3_event',
  })
}
