import http from '~/api/booth/http'


export interface EventItem {
  id: string;
  labels: string[];
}

export interface FilterEventsRequest {
  address: string;
  events: EventItem[];
  users: string[];
}

export interface EventMatchedItem {
  interested: string[] 
  isEnabled: string[]
  followingUsers: string[]
  matchedUsers: string[]
  courses: MatchedCourse[]
  registrants: string[]
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
  address: string
  targetId: string
 
}
export function interestEvent(request:InterestEventRequest){
  return http.post('/interest', {
    ...request,
    targetType: 'link3_event'
  })
}