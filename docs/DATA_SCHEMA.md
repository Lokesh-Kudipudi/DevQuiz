# Data & Schema Documentation

## Models Overview
Current Mongoose models: `User`, `Group`, `Quiz`, `Attempt`, `OnlineAssessment`, `CodingRound`.

## User
- `googleId: String`
- `email: String`
- `name: String`
- `password: String` (optional for local auth)
- `authProvider: 'google' | 'local'`
- `avatar: String`
- `joinedGroups: ObjectId[] -> Group`
- `createdGroups: ObjectId[] -> Group`
- `isDemo: Boolean`

## Group
- `name: String`
- `description: String`
- `inviteCode: String`
- `creator: ObjectId -> User`
- `members: ObjectId[] -> User`
- `quizzes: ObjectId[] -> Quiz`
- `onlineAssessments: ObjectId[] -> OnlineAssessment`

## Quiz
- `title: String`
- `topic: String` (legacy/backward compatibility)
- `topics: String` (topic prompt source)
- `difficulty: 'Easy' | 'Medium' | 'Hard'`
- `creator: ObjectId -> User`
- `group: ObjectId -> Group` (optional in solo scope)
- `scope: 'group' | 'solo'`
- `questions[]: { question, options[], correctAnswer }`
- `participants[]: { user, score, attemptedAt }`

## Attempt
- `quiz: ObjectId -> Quiz`
- `user: ObjectId -> User`
- `score: Number`
- `answers[]: { questionIndex, selectedOption, isCorrect }`
- `createdAt: Date`

## OnlineAssessment
- `title: String`
- `group: ObjectId -> Group` (optional in solo scope)
- `creator: ObjectId -> User`
- `scope: 'group' | 'solo'`
- `sections[]: { name, topics, difficulty, questionCount, timeLimit, questions[] }`
- `participants[]: {`
  - `user`
  - `startedAt`
  - `endedAt`
  - `status`
  - `sectionSubmissions[]: { sectionIndex, answers[], score, submittedAt, timeTaken }`
`}`

## CodingRound
- `title: String`
- `group: ObjectId -> Group` (optional in solo scope)
- `creator: ObjectId -> User`
- `scope: 'group' | 'solo'`
- `type: 'Piston' | 'External'`
- `status: 'Pending' | 'Live' | 'Completed'`
- `timeLimit: Number`
- `startTime: Date`
- `endTime: Date`
- `allowSelfAttempt: Boolean`
- `externalQuestionConfig: { targetQuestionCount?, difficulties?, topics? }`
- `questions[]: { title, description?, difficulty, topic?, starterCode?, language?, testCases?, platform?, url?, points?, addedBy? }`
- `participants[]: { user, startTime, submitTime, score, questionStatus[] }`
- `questionStatus[]` includes submission/timing fields such as `status`, `submittedAt`, `timeTaken`.

## Relationship Notes
- One user can create/join many groups.
- Group docs reference quizzes/OAs; coding rounds are queried by `group` field.
- Attempts are separate quiz-attempt records.
- OA and CodingRound participant state is embedded inside parent documents.
