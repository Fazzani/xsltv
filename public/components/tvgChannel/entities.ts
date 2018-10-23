export interface Channel {
  id: string
  url: string
  icon: Icon
  'display-name': TextProp
  programs: Program[]
}

export interface Program {
  category: TextProp
  channel: string
  country: TextProp
  credits: Credits
  date: number
  desc: TextProp
  'episode-num': EpisodeNum
  icon: Icon
  start: string
  stop: string
  'sub-title': TextProp
  title: TextProp
}

interface EpisodeNum {
  text: string
  system: string
}

class Credits {
  director: string[] = []
  presenter: string[] = []
  actor: string[] = []
  writer: string[] = []
}

export interface Icon {
  src: string
}

export interface TextProp {
  '#text': string
  lang: string
}
