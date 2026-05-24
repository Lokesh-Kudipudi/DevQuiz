# Data & Schema Doc

## Entities

### User
- Fields & Types
  - googleId: string
  - email: string
  - name: string
  - password: string (optional, local auth)
  - authProvider: "google" | "local"
  - avatar: string (url)
  - joinedGroups: ObjectId[] -> Group
  - createdGroups: ObjectId[] -> Group
  - isDemo: boolean

### Group
- Fields & Types
  - name: string
  - description: string
  - inviteCode: string
  - creator: ObjectId -> User
  - members: ObjectId[] -> User
  - quizzes: ObjectId[] -> Quiz
  - onlineAssessments: ObjectId[] -> OnlineAssessment

### Quiz
- Fields & Types
  - title: string
  - topic: string
  - difficulty: "Easy" | "Medium" | "Hard"
  - creator: ObjectId -> User
  - group: ObjectId -> Group
  - questions: { question, options[], correctAnswer }
  - participants: { user: ObjectId -> User, score: number, attemptedAt: date }

### Attempt
- Fields & Types
  - quiz: ObjectId -> Quiz
  - user: ObjectId -> User
  - score: number
  - answers: { questionIndex, selectedOption, isCorrect }

### CodingRound
- Fields & Types
  - title: string
  - group: ObjectId -> Group
  - creator: ObjectId -> User
  - type: "Piston" | "External"
  - status: "Pending" | "Live" | "Completed"
  - timeLimit: number
  - startTime: date
  - endTime: date
  - allowSelfAttempt: boolean
  - externalQuestionConfig: { targetQuestionCount?, difficulties?, topics? }
  - questions: { title, description?, difficulty, topic?, starterCode?, language?, testCases?, platform?, url?, points?, addedBy? }
  - participants: { user, startTime, submitTime, score, questionStatus[] }

### OnlineAssessment
- Fields & Types
  - title: string
  - group: ObjectId -> Group
  - creator: ObjectId -> User
  - status: "Pending" | "Open" | "Closed"
  - sections: { name, topics, questionCount, timeLimit, questions[] }
  - participants: { user, startedAt, endedAt, status, sectionSubmissions[] }

## Relationships
- User 1..* -> Groups (createdGroups, joinedGroups)
- Group 1..* -> Quizzes, OnlineAssessments, CodingRounds
- Quiz 1..* -> Attempts
- CodingRound and OnlineAssessment store participants embedded under their documents
