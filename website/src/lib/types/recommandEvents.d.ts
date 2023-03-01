enum EventVisibility {
  PUBLIC,
  FOLLOWERS,
  PRIVATE,
}

enum EventStatus {
  LIVE,
  DELETED,
  CANCELED,
  UPCOMING,
  ENDED,
}

interface EventLightInfo {
  hasRaffle: boolean
  hasW3ST: boolean
}

interface EventSpeaker {
  twitterId: string
  twitterHandle: string
  displayName: string
  avatar: string
  avatarFrameTokenId: number
  title: string
  profileId: number
  twitterFollowers: number
}

interface RecomendedEvents {
  id: string
  title: string
  language: number
  tags: string[]
  info: string[]
  recap: string
  posterUrl: string
  startTimestamp: string
  endTimestamp: string
  createTimestamp: string
  status: EventStatus
  location: string
  visibility: EventVisibility
  speakers: EventSpeaker[]
  registrantsCount: number
  lightInfo: EventLightInfo
}

