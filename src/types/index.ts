export interface TimelineMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  date: string;
  note: string;
  aspectRatio: '3/4' | '4/3' | '1/1' | '16/9';
}

export type GoalStatus = 'pending' | 'in-progress' | 'completed';

export interface GoalTask {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  photos: string[];
  tasks: GoalTask[];
  createdAt: string;
}

export interface ObjectiveCheckin {
  date: string; // YYYY-MM-DD
  note: string;
}

export interface PersonalObjective {
  id: string;
  owner: 'javi' | 'cami';
  title: string;
  description: string;
  emoji: string;
  priority: number;
  tasks: GoalTask[];
  checkins: ObjectiveCheckin[];
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  location: string;
  body: string;
  photos: string[];
  moodTags: string[];
}

export interface LoveLetter {
  id: string;
  date: string;
  label: string;
  content: string;
  opened: boolean;
}

export interface AppData {
  milestones: TimelineMilestone[];
  photos: GalleryPhoto[];
  goals: Goal[];
  personalObjectives: PersonalObjective[];
  journal: JournalEntry[];
  letters: LoveLetter[];
}
