import { DateTime } from "luxon";

export interface Channel {
  id: string
  url: string
  icon: Icon
  'display-name': TextProp
  programs: Program[]
}

export interface Program {
  id: string;
  duration: number;
  durationPercent: number;
  coefficient: number;
  width: number;
  stopTime: DateTime;
  startTime: DateTime;
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

export const INTERVALS = [
  '00:00',
  '00:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
  '23:30',
]

export const MinutesPerDay = 1440 //24*60
